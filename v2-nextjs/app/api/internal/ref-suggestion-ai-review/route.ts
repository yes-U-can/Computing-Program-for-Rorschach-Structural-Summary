import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type Provider = 'openai' | 'google' | 'anthropic';

type ReviewRecommendation = {
  threadId: string;
  recommendation: 'accept' | 'reject' | 'needs_human_review';
  confidence: number;
  rationale: string;
  proposedDecisionReason: string;
  appliedToDoc: boolean;
  linkedDocRevision: string | null;
  riskFlags: string[];
};

type ReviewResult = {
  reviewWindow: {
    from: string | null;
    to: string | null;
    docSlug: string | null;
    threadCount: number;
  };
  summary: string;
  recommendations: ReviewRecommendation[];
};

async function isAuthorizedInternalRequest(request: Request): Promise<boolean> {
  const cronSecret = process.env.CRON_SECRET ?? '';
  const reviewSecret = process.env.REFDOC_REVIEW_ADMIN_SECRET ?? '';
  const authHeader = request.headers.get('authorization') ?? '';
  const adminHeader = request.headers.get('x-admin-review-secret') ?? '';

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (reviewSecret && adminHeader === reviewSecret) return true;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? '';
  if (!userId) return false;

  try {
    const rows = await prisma.$queryRaw<Array<{ role: string | null }>>`
      SELECT "role" FROM "User" WHERE "id" = ${userId} LIMIT 1
    `;
    return rows[0]?.role === 'admin';
  } catch {
    return false;
  }
}

function pickPlatformKey(provider: Provider): string {
  if (provider === 'openai') return process.env.PLATFORM_OPENAI_API_KEY ?? '';
  if (provider === 'google') return process.env.PLATFORM_GOOGLE_API_KEY ?? '';
  return process.env.PLATFORM_ANTHROPIC_API_KEY ?? '';
}

function buildPrompt(payload: {
  from: string | null;
  to: string | null;
  docSlug: string | null;
  threads: Array<{
    id: string;
    docSlug: string;
    title: string;
    body: string;
    likes: number;
    replies: Array<{ body: string }>;
  }>;
}) {
  const threadText = payload.threads
    .map((thread, idx) => {
      const replies = thread.replies
        .slice(0, 10)
        .map((reply, i) => `  - reply ${i + 1}: ${reply.body.slice(0, 500)}`)
        .join('\n');
      return [
        `Thread ${idx + 1}`,
        `id: ${thread.id}`,
        `docSlug: ${thread.docSlug}`,
        `title: ${thread.title}`,
        `body: ${thread.body.slice(0, 2000)}`,
        `likes: ${thread.likes}`,
        replies ? `replies:\n${replies}` : 'replies: none',
      ].join('\n');
    })
    .join('\n\n---\n\n');

  return `
You are reviewing reference-document improvement suggestions for a clinical psychology web app.
Output STRICT JSON only.

Required JSON shape:
{
  "summary": "string",
  "recommendations": [
    {
      "threadId": "string",
      "recommendation": "accept" | "reject" | "needs_human_review",
      "confidence": 0.0,
      "rationale": "string",
      "proposedDecisionReason": "string",
      "appliedToDoc": true | false,
      "linkedDocRevision": "string or null",
      "riskFlags": ["string", "..."]
    }
  ]
}

Rules:
- Be conservative. If evidence is unclear, choose "needs_human_review".
- Focus on factual correctness, safety, and clinical caution.
- Never invent citations.
- Keep rationale concise and specific.

Review window:
- from: ${payload.from ?? 'null'}
- to: ${payload.to ?? 'null'}
- docSlug: ${payload.docSlug ?? 'all'}

Threads:
${threadText}
`.trim();
}

function parseJsonResult(raw: string): { summary: string; recommendations: ReviewRecommendation[] } {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : raw;
  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  const jsonText =
    firstBrace >= 0 && lastBrace > firstBrace ? candidate.slice(firstBrace, lastBrace + 1) : candidate;

  const parsed = JSON.parse(jsonText) as {
    summary?: string;
    recommendations?: Array<Partial<ReviewRecommendation>>;
  };

  const recommendations = Array.isArray(parsed.recommendations)
    ? parsed.recommendations
        .filter((item): item is Partial<ReviewRecommendation> => Boolean(item?.threadId))
        .map((item) => {
          const recommendation: ReviewRecommendation['recommendation'] =
            item.recommendation === 'accept' || item.recommendation === 'reject'
              ? item.recommendation
              : 'needs_human_review';
          return {
            threadId: String(item.threadId),
            recommendation,
            confidence: Math.max(0, Math.min(1, Number(item.confidence ?? 0.5))),
            rationale: String(item.rationale ?? '').slice(0, 2000),
            proposedDecisionReason: String(item.proposedDecisionReason ?? '').slice(0, 2000),
            appliedToDoc: Boolean(item.appliedToDoc),
            linkedDocRevision:
              typeof item.linkedDocRevision === 'string' && item.linkedDocRevision.trim()
                ? item.linkedDocRevision.trim().slice(0, 200)
                : null,
            riskFlags: Array.isArray(item.riskFlags)
              ? item.riskFlags
                  .map((flag) => String(flag).trim())
                  .filter(Boolean)
                  .slice(0, 10)
              : [],
          };
        })
    : [];

  return {
    summary: String(parsed.summary ?? '').slice(0, 4000),
    recommendations,
  };
}

async function runOpenAI(apiKey: string, prompt: string, model: string) {
  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model,
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  });
  return response.choices[0]?.message?.content ?? '';
}

async function runGoogle(apiKey: string, prompt: string, model: string) {
  const client = new GoogleGenerativeAI(apiKey);
  const aiModel = client.getGenerativeModel({ model });
  const response = await aiModel.generateContent(prompt);
  return response.response.text();
}

async function runAnthropic(apiKey: string, prompt: string, model: string) {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  });
  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
}

export async function POST(request: Request) {
  if (!(await isAuthorizedInternalRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    from?: string;
    to?: string;
    docSlug?: string;
    provider?: Provider;
    model?: string;
    limit?: number;
  };

  const provider: Provider =
    body.provider === 'google' || body.provider === 'anthropic' ? body.provider : 'openai';
  const model =
    body.model?.trim() ||
    (provider === 'openai'
      ? 'gpt-4o'
      : provider === 'google'
        ? 'gemini-2.0-flash'
        : 'claude-sonnet-4-5-20250929');
  const limit = Math.max(1, Math.min(100, Number(body.limit ?? 50)));
  const docSlug = body.docSlug?.trim() || null;
  const fromDate = body.from ? new Date(body.from) : null;
  const toDate = body.to ? new Date(body.to) : null;

  const where: {
    status: 'open';
    docSlug?: string;
    createdAt?: { gte?: Date; lte?: Date };
  } = { status: 'open' };
  if (docSlug) where.docSlug = docSlug;
  if (fromDate || toDate) {
    where.createdAt = {};
    if (fromDate && !Number.isNaN(fromDate.getTime())) where.createdAt.gte = fromDate;
    if (toDate && !Number.isNaN(toDate.getTime())) where.createdAt.lte = toDate;
  }

  const threads = await prisma.refDocSuggestionThread.findMany({
    where,
    orderBy: [{ createdAt: 'asc' }],
    take: limit,
    select: {
      id: true,
      docSlug: true,
      title: true,
      body: true,
      _count: { select: { likes: true } },
      replies: {
        orderBy: { createdAt: 'asc' },
        select: { body: true },
      },
    },
  });

  if (!threads.length) {
    const empty: ReviewResult = {
      reviewWindow: {
        from: fromDate?.toISOString() ?? null,
        to: toDate?.toISOString() ?? null,
        docSlug,
        threadCount: 0,
      },
      summary: 'No open suggestions found in the requested window.',
      recommendations: [],
    };
    return NextResponse.json(empty);
  }

  const apiKey = pickPlatformKey(provider);
  if (!apiKey) {
    return NextResponse.json(
      { error: `Platform API key is missing for provider: ${provider}` },
      { status: 503 },
    );
  }

  const prompt = buildPrompt({
    from: fromDate?.toISOString() ?? null,
    to: toDate?.toISOString() ?? null,
    docSlug,
    threads: threads.map((thread) => ({
      id: thread.id,
      docSlug: thread.docSlug,
      title: thread.title,
      body: thread.body,
      likes: thread._count.likes,
      replies: thread.replies,
    })),
  });

  let raw = '';
  if (provider === 'openai') raw = await runOpenAI(apiKey, prompt, model);
  else if (provider === 'google') raw = await runGoogle(apiKey, prompt, model);
  else raw = await runAnthropic(apiKey, prompt, model);

  const parsed = parseJsonResult(raw);
  const result: ReviewResult = {
    reviewWindow: {
      from: fromDate?.toISOString() ?? null,
      to: toDate?.toISOString() ?? null,
      docSlug,
      threadCount: threads.length,
    },
    summary: parsed.summary,
    recommendations: parsed.recommendations,
  };

  return NextResponse.json(result);
}
