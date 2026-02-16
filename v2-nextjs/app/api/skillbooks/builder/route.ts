import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import { prisma } from '@/lib/prisma';
import { normalizeSkillBookDocuments, SKILLBOOK_LIMITS } from '@/lib/skillBookValidation';

const scryptAsync = promisify(scrypt);
const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

type Provider = 'openai' | 'google' | 'anthropic';
type SourceDoc = { title: string; content: string };
const PROVIDERS: Provider[] = ['openai', 'google', 'anthropic'];

async function decrypt(encryptedText: string, iv: string) {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not set in the environment variables.');
  }
  const key = (await scryptAsync(ENCRYPTION_KEY, 'salt', 32)) as Buffer;
  const decipher = createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function sanitizeSources(docs: SourceDoc[]): SourceDoc[] {
  const normalized = docs
    .filter((d) => d.title?.trim() && d.content?.trim())
    .map((d) => ({
      title: d.title.trim().slice(0, 120),
      content: d.content.trim().slice(0, 6000),
    }))
    .slice(0, 12);

  const result: SourceDoc[] = [];
  let totalChars = 0;
  for (const item of normalized) {
    if (totalChars >= 20000) break;
    const remaining = 20000 - totalChars;
    const truncatedContent = item.content.slice(0, remaining);
    result.push({ title: item.title, content: truncatedContent });
    totalChars += item.title.length + truncatedContent.length;
  }
  return result;
}

function buildPrompt(name: string, description: string, docs: SourceDoc[]) {
  const serializedDocs = docs
    .map((d, i) => `# Source ${i + 1}: ${d.title}\n${d.content}`)
    .join('\n\n');

  return `
You are creating a Skill Book draft for a professional Rorschach interpretation assistant.

Return STRICT JSON only with this shape:
{
  "instructions": "string",
  "documents": [{ "title": "string", "content": "string" }]
}

Rules:
- "instructions" must be concrete, safety-aware, and clinically cautious.
- Use hypothesis language, avoid diagnosis claims, avoid treatment prescriptions.
- Keep "instructions" between 500 and 2500 characters.
- "documents" must summarize and structure source content for RAG retrieval.
- Produce 3 to 8 document chunks.
- Each document must have concise "title" and useful "content".
- No markdown fences. JSON only.

Skill book name: ${name || 'Untitled Skill Book'}
Skill book description: ${description || '(none)'}

Source materials:
${serializedDocs || '(none)'}
`.trim();
}

function extractJson(text: string): { instructions: string; documents: SourceDoc[] } {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  const jsonText =
    firstBrace >= 0 && lastBrace > firstBrace ? candidate.slice(firstBrace, lastBrace + 1) : candidate;
  const parsed = JSON.parse(jsonText) as { instructions?: string; documents?: SourceDoc[] };
  if (!parsed.instructions || !Array.isArray(parsed.documents)) {
    throw new Error('Invalid builder response');
  }
  const normalized = normalizeSkillBookDocuments(parsed.documents);
  if (!normalized.ok) {
    throw new Error(normalized.error);
  }
  return {
    instructions: parsed.instructions.trim().slice(0, SKILLBOOK_LIMITS.instructionsMax),
    documents: normalized.value,
  };
}

async function generateWithOpenAI(apiKey: string, prompt: string) {
  const client = new OpenAI({ apiKey });
  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
  });
  return res.choices[0]?.message?.content ?? '';
}

async function generateWithGoogle(apiKey: string, prompt: string) {
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function generateWithAnthropic(apiKey: string, prompt: string) {
  const client = new Anthropic({ apiKey });
  const res = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    temperature: 0.4,
    messages: [{ role: 'user', content: prompt }],
  });
  return res.content
    .filter((c): c is Anthropic.TextBlock => c.type === 'text')
    .map((c) => c.text)
    .join('\n');
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = (await req.json()) as {
      provider?: Provider;
      name?: string;
      description?: string;
      sourceDocs?: SourceDoc[];
    };
    const provider = body.provider ?? 'openai';
    if (!PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
    }
    const docs = sanitizeSources(body.sourceDocs ?? []);
    if (!docs.length) {
      return NextResponse.json({ error: 'sourceDocs is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    let apiKey = '';
    if (provider === 'openai' && user.encryptedOpenAIKey && user.openAIKeyIv) {
      apiKey = await decrypt(user.encryptedOpenAIKey, user.openAIKeyIv);
    } else if (provider === 'google' && user.encryptedGoogleKey && user.googleKeyIv) {
      apiKey = await decrypt(user.encryptedGoogleKey, user.googleKeyIv);
    } else if (provider === 'anthropic' && user.encryptedAnthropicKey && user.anthropicKeyIv) {
      apiKey = await decrypt(user.encryptedAnthropicKey, user.anthropicKeyIv);
    }
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found or configured.' }, { status: 400 });
    }

    const prompt = buildPrompt(body.name?.trim() ?? '', body.description?.trim() ?? '', docs);
    let raw = '';
    if (provider === 'openai') {
      raw = await generateWithOpenAI(apiKey, prompt);
    } else if (provider === 'google') {
      raw = await generateWithGoogle(apiKey, prompt);
    } else {
      raw = await generateWithAnthropic(apiKey, prompt);
    }

    const parsed = extractJson(raw);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('SkillBook builder error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
