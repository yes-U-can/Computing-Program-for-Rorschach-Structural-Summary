import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import { createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import { buildKnowledgePrompt, KnowledgeItem, selectRelevantKnowledge } from '@/lib/chatKnowledge';
import type { Language } from '@/types';
import { prisma } from '@/lib/prisma';
const scryptAsync = promisify(scrypt);

const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

type Provider = 'openai' | 'google' | 'anthropic';
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

async function callOpenAI(apiKey: string, messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) {
  const openai = new OpenAI({ apiKey });
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: messages,
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

async function callGoogle(apiKey: string, messages: { role: string; content: string }[]) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

async function callAnthropic(apiKey: string, messages: { role: string; content: string }[], systemPrompt?: string) {
  const anthropic = new Anthropic({ apiKey });
  const stream = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
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
      provider: Provider;
      chatSessionId?: string;
      knowledgeItems?: Array<{ title: string; content: string }>;
      lang?: Language;
    };
    const { messages, provider, lang } = body;
    let { chatSessionId } = body;

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
      return new NextResponse('API key not found or configured.', { status: 400 });
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
                title: userMessage.content.substring(0, 50),
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

    // Build knowledge context
    const selectedKnowledge = selectRelevantKnowledge(userMessage.content, userKnowledge, undefined, lang ?? 'en');
    const knowledgePrompt = buildKnowledgePrompt(selectedKnowledge);

    // For providers that support system messages (OpenAI, Anthropic), use system role.
    // For Google, prepend as first user message since it doesn't have system role.
    let finalMessages: { role: string; content: string }[];
    let systemPrompt: string | undefined;

    if (knowledgePrompt) {
      if (provider === 'anthropic') {
        systemPrompt = knowledgePrompt;
        finalMessages = formattedMessages;
      } else if (provider === 'openai') {
        finalMessages = [{ role: 'system', content: knowledgePrompt }, ...formattedMessages];
      } else {
        // Google: prepend as user context (will be merged if next is also user)
        finalMessages = [{ role: 'user', content: knowledgePrompt }, ...formattedMessages];
      }
    } else {
      finalMessages = formattedMessages;
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
        }
    });

    let stream: ReadableStream;
    if (provider === 'openai') {
      stream = await callOpenAI(
        apiKey,
        finalMessages as { role: 'system' | 'user' | 'assistant'; content: string }[]
      );
    } else if (provider === 'google') {
      stream = await callGoogle(apiKey, finalMessages);
    } else if (provider === 'anthropic') {
      stream = await callAnthropic(apiKey, finalMessages, systemPrompt);
    } else {
      return new NextResponse('Provider is not supported.', { status: 400 });
    }

    // FIX: tee() first, then pipe one branch to DB logging
    const [returnStream, dbStream] = stream.tee();
    dbStream.pipeTo(loggingStream).catch(console.error);

    const responseHeaders = new Headers();
    responseHeaders.set('X-Chat-Session-Id', activeChatSessionId);

    return new Response(returnStream, { headers: responseHeaders });

  } catch (error) {
    console.error('Error in chat API:', error);
    if (error instanceof Error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
