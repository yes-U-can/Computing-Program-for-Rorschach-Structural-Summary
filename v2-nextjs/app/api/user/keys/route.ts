import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { prisma } from '@/lib/prisma';
const scryptAsync = promisify(scrypt);

const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
type Provider = 'openai' | 'google' | 'anthropic';

const PROVIDER_FIELDS: Record<Provider, { key: string; iv: string }> = {
  openai: { key: 'encryptedOpenAIKey', iv: 'openAIKeyIv' },
  google: { key: 'encryptedGoogleKey', iv: 'googleKeyIv' },
  anthropic: { key: 'encryptedAnthropicKey', iv: 'anthropicKeyIv' },
};

async function encrypt(text: string) {
  const iv = randomBytes(16);
  const key = (await scryptAsync(ENCRYPTION_KEY, 'salt', 32)) as Buffer;
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: iv.toString('hex') };
}

async function decrypt(encryptedText: string, iv: string) {
  const key = (await scryptAsync(ENCRYPTION_KEY, 'salt', 32)) as Buffer;
  const decipher = createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function maskKey(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  const tail = trimmed.slice(-4);
  return `****${tail}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        encryptedOpenAIKey: true,
        openAIKeyIv: true,
        encryptedGoogleKey: true,
        googleKeyIv: true,
        encryptedAnthropicKey: true,
        anthropicKeyIv: true,
      },
    });

    const masked = {
      openai:
        user?.encryptedOpenAIKey && user.openAIKeyIv
          ? maskKey(await decrypt(user.encryptedOpenAIKey, user.openAIKeyIv))
          : null,
      google:
        user?.encryptedGoogleKey && user.googleKeyIv
          ? maskKey(await decrypt(user.encryptedGoogleKey, user.googleKeyIv))
          : null,
      anthropic:
        user?.encryptedAnthropicKey && user.anthropicKeyIv
          ? maskKey(await decrypt(user.encryptedAnthropicKey, user.anthropicKeyIv))
          : null,
    };

    return NextResponse.json({
      openai: !!user?.encryptedOpenAIKey,
      google: !!user?.encryptedGoogleKey,
      anthropic: !!user?.encryptedAnthropicKey,
      masked,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch key status.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as { provider?: string; apiKey?: string };
  const provider = body.provider?.toLowerCase();
  const apiKey = body.apiKey;

  if (!provider || !apiKey) {
    return NextResponse.json({ error: 'Provider and API key are required' }, { status: 400 });
  }
  if (!['openai', 'google', 'anthropic'].includes(provider)) {
    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  }

  const { encrypted, iv } = await encrypt(apiKey);

  const updateDataByProvider: Record<Provider, Record<string, string>> = {
    openai: { encryptedOpenAIKey: encrypted, openAIKeyIv: iv },
    google: { encryptedGoogleKey: encrypted, googleKeyIv: iv },
    anthropic: { encryptedAnthropicKey: encrypted, anthropicKeyIv: iv },
  };
  const data = updateDataByProvider[provider as Provider];

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data,
    });
    return NextResponse.json({ message: `${provider} API key saved.` });
  } catch {
    return NextResponse.json({ error: 'Failed to save API key.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const provider = req.nextUrl.searchParams.get('provider')?.toLowerCase();
  if (!provider || !['openai', 'google', 'anthropic'].includes(provider)) {
    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  }

  const fields = PROVIDER_FIELDS[provider as Provider];
  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { [fields.key]: null, [fields.iv]: null },
    });
    return NextResponse.json({ message: `${provider} API key deleted.` });
  } catch {
    return NextResponse.json({ error: 'Failed to delete API key.' }, { status: 500 });
  }
}
