import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import { buildSystemPrompt, KnowledgeItem, selectRelevantKnowledge } from '@/lib/chatKnowledge';
import { DEFAULT_SKILL_BOOK } from '@/lib/defaultSkillBook';
import { getRorschachBaseSystemPrompt } from '@/lib/systemPrompts/rorschachBase';
import type { Language } from '@/types';
import { prisma } from '@/lib/prisma';
import { appendCreditEntry } from '@/lib/creditLedger';
import {
  estimateTokenCostCredits,
  estimateTokens,
  getModelById,
  getModelCatalog,
  Provider,
} from '@/lib/aiModels';
const scryptAsync = promisify(scrypt);

const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

type BillingMode = 'byok' | 'platform';
type IncomingMessage = {
  role: 'ai' | 'user';
  content: string;
};

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

async function callOpenAI(
  apiKey: string,
  model: string,
  maxOutputTokens: number,
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
) {
  const openai = new OpenAI({ apiKey });
  const stream = await openai.chat.completions.create({
    model,
    messages: messages,
    max_tokens: maxOutputTokens,
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ''));
      }
      controller.close();
    },
  });
}

async function callGoogle(
  apiKey: string,
  modelId: string,
  maxOutputTokens: number,
  messages: { role: string; content: string }[],
) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: { maxOutputTokens },
  });

  // Google requires alternating user/model roles.
  // Merge consecutive same-role messages instead of dropping them.
  const googleMessages: { role: string; parts: { text: string }[] }[] = [];
  for (const msg of messages) {
    const role = msg.role === 'assistant' ? 'model' : 'user';
    const last = googleMessages[googleMessages.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += '\n\n' + msg.content;
    } else {
      googleMessages.push({ role, parts: [{ text: msg.content }] });
    }
  }

  const lastMessage = googleMessages.pop();

  const chat = model.startChat({
      history: googleMessages,
  });

  const result = await chat.sendMessageStream(lastMessage?.parts || []);

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(new TextEncoder().encode(chunk.text()));
      }
      controller.close();
    },
  });
}

async function callAnthropic(
  apiKey: string,
  model: string,
  maxOutputTokens: number,
  messages: { role: string; content: string }[],
  systemPrompt?: string,
) {
  const anthropic = new Anthropic({ apiKey });
  const stream = await anthropic.messages.create({
    model,
    max_tokens: maxOutputTokens,
    system: systemPrompt || undefined,
    messages: messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = (await req.json()) as {
      messages: IncomingMessage[];
      provider?: Provider;
      modelId?: string;
      billingMode?: BillingMode;
      chatSessionId?: string;
      knowledgeItems?: Array<{ title: string; content: string }>;
      skillBookInstructions?: string;
      lang?: Language;
    };
    const { messages, lang } = body;
    let { chatSessionId } = body;

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const defaultProvider = body.provider ?? 'openai';
    const selectedModel =
      (body.modelId ? getModelById(body.modelId) : null) ??
      getModelCatalog().find((model) => model.provider === defaultProvider && model.recommended) ??
      getModelCatalog().find((model) => model.provider === defaultProvider) ??
      null;

    if (!selectedModel) {
      return NextResponse.json({ error: 'Selected model is not supported.' }, { status: 400 });
    }

    const provider = selectedModel.provider;
    const billingMode: BillingMode = body.billingMode === 'platform' ? 'platform' : 'byok';

    let apiKey = '';
    let keySource: BillingMode = billingMode;
    if (billingMode === 'byok') {
      if (provider === 'openai' && user.encryptedOpenAIKey && user.openAIKeyIv) {
        apiKey = await decrypt(user.encryptedOpenAIKey, user.openAIKeyIv);
      } else if (provider === 'google' && user.encryptedGoogleKey && user.googleKeyIv) {
        apiKey = await decrypt(user.encryptedGoogleKey, user.googleKeyIv);
      } else if (provider === 'anthropic' && user.encryptedAnthropicKey && user.anthropicKeyIv) {
        apiKey = await decrypt(user.encryptedAnthropicKey, user.anthropicKeyIv);
      }
    } else {
      if (provider === 'openai') apiKey = process.env.PLATFORM_OPENAI_API_KEY ?? '';
      if (provider === 'google') apiKey = process.env.PLATFORM_GOOGLE_API_KEY ?? '';
      if (provider === 'anthropic') apiKey = process.env.PLATFORM_ANTHROPIC_API_KEY ?? '';
      keySource = 'platform';
    }

    if (!apiKey) {
      if (keySource === 'platform') {
        return NextResponse.json(
          { error: 'Platform AI is currently unavailable for the selected model/provider.' },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: 'API key not found for selected provider. Add your key or switch to platform mode.' },
        { status: 400 },
      );
    }

    const userMessage = messages[messages.length - 1];
    const userKnowledge: KnowledgeItem[] = (body.knowledgeItems ?? [])
      .filter((k) => k.title?.trim() && k.content?.trim())
      .map((k) => ({
        title: k.title.trim(),
        content: k.content.trim(),
        source: 'user' as const,
      }));

    let currentSession;
    if (chatSessionId) {
        currentSession = await prisma.chatSession.findUnique({ where: { id: chatSessionId }});
    }

    if (!currentSession) {
        currentSession = await prisma.chatSession.create({
            data: {
                userId: user.id,
                // Title is no longer shown in UI; keep a neutral placeholder for schema compatibility.
                title: 'chat-session',
                provider: provider,
            }
        });
        chatSessionId = currentSession.id;
    }
    const activeChatSessionId = currentSession.id;

    await prisma.chatMessage.create({
        data: {
            chatSessionId: activeChatSessionId,
            role: 'user',
            content: userMessage.content,
        }
    });

    // Convert incoming messages to API format
    const formattedMessages = messages.map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content,
    }));

    // Resolve active Skill Book: DB selection > request body > default
    let activeInstructions = DEFAULT_SKILL_BOOK.instructions;
    let skillBookDocuments: KnowledgeItem[] = [];

    if (user.activeSkillBookId) {
      const activeBook = await prisma.skillBook.findUnique({
        where: { id: user.activeSkillBookId },
        select: { instructions: true, documents: true },
      });
      if (activeBook) {
        activeInstructions = activeBook.instructions;
        try {
          const docs = JSON.parse(activeBook.documents) as Array<{ title: string; content: string }>;
          skillBookDocuments = docs.map(d => ({ title: d.title, content: d.content, source: 'user' as const }));
        } catch { /* ignore parse errors */ }
      }
    } else if (body.skillBookInstructions) {
      activeInstructions = body.skillBookInstructions;
    }

    // Build system prompt: Skill Book instructions + relevant knowledge (RAG)
    const allKnowledge = [...userKnowledge, ...skillBookDocuments];
    const selectedKnowledge = selectRelevantKnowledge(userMessage.content, allKnowledge, undefined, lang ?? 'en');
    const basePrompt = getRorschachBaseSystemPrompt(lang ?? 'en');
    const mergedInstructions = [basePrompt, activeInstructions].filter(Boolean).join('\n\n---\n\n');
    const fullSystemPrompt = buildSystemPrompt(mergedInstructions, selectedKnowledge);

    // For providers that support system messages (OpenAI, Anthropic), use system role.
    // For Google, prepend as first user message since it doesn't have system role.
    let finalMessages: { role: string; content: string }[];
    let systemPrompt: string | undefined;

    if (fullSystemPrompt) {
      if (provider === 'anthropic') {
        systemPrompt = fullSystemPrompt;
        finalMessages = formattedMessages;
      } else if (provider === 'openai') {
        finalMessages = [{ role: 'system', content: fullSystemPrompt }, ...formattedMessages];
      } else {
        // Google: prepend as user context (will be merged if next is also user)
        finalMessages = [{ role: 'user', content: fullSystemPrompt }, ...formattedMessages];
      }
    } else {
      finalMessages = formattedMessages;
    }

    const inputTokenEstimate = estimateTokens(
      [fullSystemPrompt ?? '', ...formattedMessages.map((m) => m.content)].join('\n\n'),
    );
    const worstCaseCharge = estimateTokenCostCredits({
      model: selectedModel,
      inputTokens: inputTokenEstimate,
      outputTokens: selectedModel.maxOutputTokens,
    });
    if (keySource === 'platform' && user.creditBalance < worstCaseCharge.credits) {
      return NextResponse.json(
        {
          error: `Insufficient credits for this model. Minimum required to start: ${worstCaseCharge.credits} credits.`,
        },
        { status: 402 },
      );
    }

    // Set up DB logging stream
    let aiResponseContent = '';
    const loggingStream = new WritableStream({
        write(chunk) {
            aiResponseContent += new TextDecoder().decode(chunk);
        },
        async close() {
            await prisma.chatMessage.create({
                data: {
                    chatSessionId: activeChatSessionId,
                    role: 'ai',
                    content: aiResponseContent,
                }
            });
            await prisma.chatSession.update({
                where: { id: activeChatSessionId },
                data: { updatedAt: new Date() }
            });

            if (keySource === 'platform') {
              const outputTokenEstimate = estimateTokens(aiResponseContent);
              const billing = estimateTokenCostCredits({
                model: selectedModel,
                inputTokens: inputTokenEstimate,
                outputTokens: outputTokenEstimate,
              });

              try {
                await appendCreditEntry(prisma, {
                  userId: user.id,
                  amount: -billing.credits,
                  type: 'platform_ai_usage_burn',
                  description: `Platform AI usage (${selectedModel.label})`,
                  metadataJson: JSON.stringify({
                    feature: 'chat',
                    modelId: selectedModel.id,
                    provider: selectedModel.provider,
                    inputTokens: inputTokenEstimate,
                    outputTokens: outputTokenEstimate,
                    billedUsd: Number(billing.billedUsd.toFixed(6)),
                    rawProviderUsd: Number(billing.rawProviderUsd.toFixed(6)),
                    markupMultiplier: billing.markupMultiplier,
                  }),
                });
              } catch (billingError) {
                console.error('Platform billing failed:', billingError);
              }
            }
        }
    });

    let stream: ReadableStream;
    if (provider === 'openai') {
      stream = await callOpenAI(
        apiKey,
        selectedModel.id,
        selectedModel.maxOutputTokens,
        finalMessages as { role: 'system' | 'user' | 'assistant'; content: string }[]
      );
    } else if (provider === 'google') {
      stream = await callGoogle(apiKey, selectedModel.id, selectedModel.maxOutputTokens, finalMessages);
    } else if (provider === 'anthropic') {
      stream = await callAnthropic(
        apiKey,
        selectedModel.id,
        selectedModel.maxOutputTokens,
        finalMessages,
        systemPrompt,
      );
    } else {
      return new NextResponse('Provider is not supported.', { status: 400 });
    }

    // FIX: tee() first, then pipe one branch to DB logging
    const [returnStream, dbStream] = stream.tee();
    dbStream.pipeTo(loggingStream).catch(console.error);

    const responseHeaders = new Headers();
    responseHeaders.set('X-Chat-Session-Id', activeChatSessionId);
    responseHeaders.set('X-Chat-Model-Id', selectedModel.id);
    responseHeaders.set('X-Chat-Billing-Mode', keySource);

    return new Response(returnStream, { headers: responseHeaders });

  } catch (error) {
    console.error('Error in chat API:', error);
    if (error instanceof Error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
