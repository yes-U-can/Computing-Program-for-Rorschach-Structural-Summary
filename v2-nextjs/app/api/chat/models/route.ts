import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { OpenAI } from 'openai';
import { createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import {
  getModelCatalog,
  type Provider,
} from '@/lib/aiModels';

const scryptAsync = promisify(scrypt);
const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

async function decrypt(encryptedText: string, iv: string) {
  if (!ENCRYPTION_KEY) return '';
  const key = (await scryptAsync(ENCRYPTION_KEY, 'salt', 32)) as Buffer;
  const decipher = createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function humanizeModelLabel(modelId: string): string {
  return modelId
    .replace(/^models\//, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

const FALLBACK_GOOGLE_CHAT_MODEL_IDS = [
  'gemini-2.5-pro-exp-03-25',
  'gemini-2.5-pro-preview-06-05',
  'gemini-2.5-pro-preview-05-06',
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.5-flash-preview-04-17',
  'gemini-2.5-flash-lite',
  'gemini-2.0-pro-exp',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash-exp',
  'gemini-1.5-pro-002',
  'gemini-1.5-flash-002',
  'gemini-1.0-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-pro',
];

const FALLBACK_ANTHROPIC_CHAT_MODEL_IDS = [
  'claude-opus-4-20250514',
  'claude-opus-4-1',
  'claude-opus-4-0',
  'claude-sonnet-4-20250514',
  'claude-sonnet-4-5',
  'claude-sonnet-4-0',
  'claude-haiku-4-20250514',
  'claude-haiku-4-5',
  'claude-3-7-sonnet',
  'claude-3-5-sonnet-latest',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-haiku-latest',
  'claude-3-5-haiku-20241022',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
];

const PROVIDER_MODEL_LIMIT = 8;

type PricingOverride = {
  inputUsdPer1M: number;
  outputUsdPer1M: number;
};

const PRICING_OVERRIDES_EXACT: Record<string, PricingOverride> = {
  'gpt-5.2': { inputUsdPer1M: 1.75, outputUsdPer1M: 14 },
  'gpt-5.2-chat-latest': { inputUsdPer1M: 1.75, outputUsdPer1M: 14 },
  'gpt-5.2-pro': { inputUsdPer1M: 21, outputUsdPer1M: 168 },
  'gpt-5.1': { inputUsdPer1M: 1.25, outputUsdPer1M: 10 },
  'gpt-5.1-chat-latest': { inputUsdPer1M: 1.25, outputUsdPer1M: 10 },
  'gpt-5': { inputUsdPer1M: 1.25, outputUsdPer1M: 10 },
  'gpt-5-chat-latest': { inputUsdPer1M: 1.25, outputUsdPer1M: 10 },
  'gpt-5-mini': { inputUsdPer1M: 0.25, outputUsdPer1M: 2 },
  'gpt-5-nano': { inputUsdPer1M: 0.05, outputUsdPer1M: 0.4 },
  'gpt-4.1': { inputUsdPer1M: 2, outputUsdPer1M: 8 },
  'gpt-4.1-mini': { inputUsdPer1M: 0.4, outputUsdPer1M: 1.6 },
  'gpt-4o': { inputUsdPer1M: 2.5, outputUsdPer1M: 10 },
  'gpt-4o-mini': { inputUsdPer1M: 0.15, outputUsdPer1M: 0.6 },
  'claude-opus-4-1': { inputUsdPer1M: 15, outputUsdPer1M: 75 },
  'claude-opus-4-20250514': { inputUsdPer1M: 15, outputUsdPer1M: 75 },
  'claude-opus-4-0': { inputUsdPer1M: 15, outputUsdPer1M: 75 },
  'claude-sonnet-4-20250514': { inputUsdPer1M: 3, outputUsdPer1M: 15 },
  'claude-sonnet-4-5': { inputUsdPer1M: 3, outputUsdPer1M: 15 },
  'claude-sonnet-4-0': { inputUsdPer1M: 3, outputUsdPer1M: 15 },
  'claude-3-7-sonnet': { inputUsdPer1M: 3, outputUsdPer1M: 15 },
  'claude-3-5-sonnet-20241022': { inputUsdPer1M: 3, outputUsdPer1M: 15 },
  'claude-3-5-haiku-20241022': { inputUsdPer1M: 0.8, outputUsdPer1M: 4 },
  'claude-haiku-3.5': { inputUsdPer1M: 0.8, outputUsdPer1M: 4 },
  'claude-haiku-4-20250514': { inputUsdPer1M: 0.8, outputUsdPer1M: 4 },
  'claude-haiku-4-5': { inputUsdPer1M: 0.8, outputUsdPer1M: 4 },
  'gemini-2.5-pro': { inputUsdPer1M: 1.25, outputUsdPer1M: 10 },
  'gemini-2.5-flash': { inputUsdPer1M: 0.3, outputUsdPer1M: 2.5 },
  'gemini-2.5-flash-lite': { inputUsdPer1M: 0.1, outputUsdPer1M: 0.4 },
  'gemini-2.0-flash': { inputUsdPer1M: 0.1, outputUsdPer1M: 0.4 },
};

const PRICING_OVERRIDES_PREFIX: Array<{ prefix: string; pricing: PricingOverride }> = [
  { prefix: 'gpt-5.2', pricing: { inputUsdPer1M: 1.75, outputUsdPer1M: 14 } },
  { prefix: 'gpt-5.1', pricing: { inputUsdPer1M: 1.25, outputUsdPer1M: 10 } },
  { prefix: 'gpt-5', pricing: { inputUsdPer1M: 1.25, outputUsdPer1M: 10 } },
  { prefix: 'gpt-4.1', pricing: { inputUsdPer1M: 2, outputUsdPer1M: 8 } },
  { prefix: 'gpt-4o-mini', pricing: { inputUsdPer1M: 0.15, outputUsdPer1M: 0.6 } },
  { prefix: 'gpt-4o', pricing: { inputUsdPer1M: 2.5, outputUsdPer1M: 10 } },
  { prefix: 'claude-opus-4', pricing: { inputUsdPer1M: 15, outputUsdPer1M: 75 } },
  { prefix: 'claude-sonnet-4', pricing: { inputUsdPer1M: 3, outputUsdPer1M: 15 } },
  { prefix: 'claude-3-7-sonnet', pricing: { inputUsdPer1M: 3, outputUsdPer1M: 15 } },
  { prefix: 'claude-3-5-sonnet', pricing: { inputUsdPer1M: 3, outputUsdPer1M: 15 } },
  { prefix: 'claude-3-5-haiku', pricing: { inputUsdPer1M: 0.8, outputUsdPer1M: 4 } },
  { prefix: 'claude-haiku', pricing: { inputUsdPer1M: 0.8, outputUsdPer1M: 4 } },
  { prefix: 'gemini-2.5-pro', pricing: { inputUsdPer1M: 1.25, outputUsdPer1M: 10 } },
  { prefix: 'gemini-2.5-flash', pricing: { inputUsdPer1M: 0.3, outputUsdPer1M: 2.5 } },
  { prefix: 'gemini-2.5-flash-lite', pricing: { inputUsdPer1M: 0.1, outputUsdPer1M: 0.4 } },
  { prefix: 'gemini-2.0-flash', pricing: { inputUsdPer1M: 0.1, outputUsdPer1M: 0.4 } },
];

function isOpenAIChatModel(modelId: string): boolean {
  const id = modelId.toLowerCase();
  const blocked = [
    'search',
    'web-search',
    'codex',
    'dall',
    'tts',
    'whisper',
    'transcribe',
    'transcription',
    'embedding',
    'moderation',
    'image',
    'video',
    'vision',
    'realtime',
    'omni-moderation',
    'computer-use',
    'audio',
  ];
  if (blocked.some((token) => id.includes(token))) return false;
  if (!/^(gpt|o[1345]|chatgpt)/.test(id)) return false;
  // Exclude non-chat task-specific variants even when they share gpt/o prefixes.
  if (id.includes('audio') || id.includes('transcribe') || id.includes('search') || id.includes('realtime')) return false;
  return true;
}

function isGoogleChatModel(modelId: string): boolean {
  const id = modelId.toLowerCase();
  if (!id.includes('gemini')) return false;
  const blocked = ['embedding', 'imagen', 'veo', 'aqa', 'vision'];
  return !blocked.some((token) => id.includes(token));
}

function isAnthropicChatModel(modelId: string): boolean {
  return modelId.toLowerCase().startsWith('claude');
}

type DiscoveredGoogleModel = {
  id: string;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
  supportedGenerationMethods?: string[];
};

type DiscoveredOpenAIModel = {
  id: string;
  createdAt?: string;
};

type DiscoveredAnthropicModel = {
  id: string;
  createdAt?: string;
};

const KNOWN_RELEASE_DATES: Record<string, string> = {
  'gpt-5': '2025-08-07',
  'gpt-5-mini': '2025-08-07',
  'gpt-5-nano': '2025-08-07',
  'gpt-4.1': '2025-04-14',
  'gpt-4.1-mini': '2025-04-14',
  'gpt-4o': '2024-05-13',
  'gpt-4o-mini': '2024-07-18',
  'gemini-2.5-pro': '2025-03-25',
  'gemini-2.5-flash': '2025-04-17',
  'gemini-2.0-flash': '2024-12-11',
  'gemini-1.5-pro': '2024-05-14',
  'gemini-1.5-flash': '2024-05-14',
  'claude-3-7-sonnet': '2025-02-24',
  'claude-3-5-sonnet-20241022': '2024-10-22',
  'claude-3-5-haiku-20241022': '2024-10-22',
  'claude-3-opus-20240229': '2024-02-29',
  'claude-3-sonnet-20240229': '2024-02-29',
  'claude-3-haiku-20240307': '2024-03-07',
};

function resolveReleaseDate(modelId: string, primary?: string): string | undefined {
  return primary ?? KNOWN_RELEASE_DATES[modelId] ?? extractReleaseDateFromModelId(modelId);
}

function resolvePricing(modelId: string, inputUsdPer1M: number, outputUsdPer1M: number): PricingOverride {
  if (inputUsdPer1M > 0 && outputUsdPer1M > 0) {
    return { inputUsdPer1M, outputUsdPer1M };
  }
  const exact = PRICING_OVERRIDES_EXACT[modelId];
  if (exact) return exact;

  const lower = modelId.toLowerCase();
  const prefixMatch = PRICING_OVERRIDES_PREFIX.find((entry) => lower.startsWith(entry.prefix));
  if (prefixMatch) return prefixMatch.pricing;
  return { inputUsdPer1M, outputUsdPer1M };
}

function getReleaseDateMs(date?: string): number {
  if (!date) return 0;
  const ms = Date.parse(date);
  return Number.isFinite(ms) ? ms : 0;
}

function getPriorityIndex(provider: Provider, modelId: string): number {
  const id = modelId.toLowerCase();
  const providerPriority: Record<Provider, string[]> = {
    openai: ['gpt-5', 'gpt-4.1', 'gpt-4o', 'o3', 'o1', 'mini'],
    anthropic: ['claude-opus', 'claude-sonnet', 'claude-haiku'],
    google: ['gemini-3', 'gemini-2.5', 'gemini-2.0', 'gemini-1.5', 'gemini-pro'],
  };
  const arr = providerPriority[provider];
  const idx = arr.findIndex((token) => id.includes(token));
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

function selectTopModelsPerProvider<T extends { provider: Provider; id: string; releaseDate?: string }>(
  models: T[],
  limitPerProvider = PROVIDER_MODEL_LIMIT
): T[] {
  const grouped: Record<Provider, T[]> = { openai: [], google: [], anthropic: [] };
  for (const model of models) grouped[model.provider].push(model);

  const ordered = (Object.keys(grouped) as Provider[]).flatMap((provider) => {
    const list = [...grouped[provider]];
    list.sort((a, b) => {
      const aPriced = (a as { inputUsdPer1M?: number; outputUsdPer1M?: number }).inputUsdPer1M && (a as { inputUsdPer1M?: number; outputUsdPer1M?: number }).outputUsdPer1M;
      const bPriced = (b as { inputUsdPer1M?: number; outputUsdPer1M?: number }).inputUsdPer1M && (b as { inputUsdPer1M?: number; outputUsdPer1M?: number }).outputUsdPer1M;
      if (Boolean(aPriced) !== Boolean(bPriced)) return aPriced ? -1 : 1;

      const pa = getPriorityIndex(provider, a.id);
      const pb = getPriorityIndex(provider, b.id);
      if (pa !== pb) return pa - pb;

      const da = getReleaseDateMs(a.releaseDate);
      const db = getReleaseDateMs(b.releaseDate);
      if (da !== db) return db - da;

      return a.id.localeCompare(b.id);
    });
    return list.slice(0, limitPerProvider);
  });

  return ordered;
}

function extractReleaseDateFromModelId(modelId: string): string | undefined {
  const compact = modelId.match(/(?:^|[-_])(20\d{2})(\d{2})(\d{2})(?:[-_]|$)/);
  if (compact) return `${compact[1]}-${compact[2]}-${compact[3]}`;

  const dashed = modelId.match(/(?:^|[-_])(20\d{2})-(\d{2})-(\d{2})(?:[-_]|$)/);
  if (dashed) return `${dashed[1]}-${dashed[2]}-${dashed[3]}`;
  return undefined;
}

async function discoverOpenAIModels(apiKey: string): Promise<DiscoveredOpenAIModel[]> {
  try {
    const openai = new OpenAI({ apiKey });
    const list = await openai.models.list();
    return list.data
      .map((m) => {
        const created = typeof (m as { created?: number }).created === 'number'
          ? new Date(((m as { created?: number }).created as number) * 1000).toISOString().slice(0, 10)
          : undefined;
        return { id: m.id, createdAt: created };
      })
      .filter((m) => Boolean(m.id));
  } catch {
    return [];
  }
}

async function discoverGoogleModels(apiKey: string): Promise<DiscoveredGoogleModel[]> {
  try {
    const discovered: DiscoveredGoogleModel[] = [];
    let pageToken = '';

    for (let i = 0; i < 20; i += 1) {
      const query = new URLSearchParams({ key: apiKey, pageSize: '1000' });
      if (pageToken) query.set('pageToken', pageToken);

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?${query.toString()}`);
      if (!res.ok) break;
      const data = (await res.json()) as {
        models?: Array<{ name?: string; inputTokenLimit?: number; outputTokenLimit?: number; supportedGenerationMethods?: string[] }>;
        nextPageToken?: string;
      };

      discovered.push(
        ...(data.models ?? [])
          .map((m) => ({
            id: (m.name ?? '').replace(/^models\//, ''),
            inputTokenLimit: m.inputTokenLimit,
            outputTokenLimit: m.outputTokenLimit,
            supportedGenerationMethods: m.supportedGenerationMethods,
          }))
          .filter((m) => m.id)
      );

      const next = data.nextPageToken ?? '';
      if (!next || next === pageToken) break;
      pageToken = next;
    }

    const deduped = new Map<string, DiscoveredGoogleModel>();
    for (const model of discovered) {
      if (!deduped.has(model.id)) deduped.set(model.id, model);
    }
    return Array.from(deduped.values());
  } catch {
    return [];
  }
}

async function discoverAnthropicModels(apiKey: string): Promise<DiscoveredAnthropicModel[]> {
  try {
    const discovered = new Map<string, DiscoveredAnthropicModel>();
    let afterId = '';

    for (let i = 0; i < 20; i += 1) {
      const query = new URLSearchParams({ limit: '100' });
      if (afterId) query.set('after_id', afterId);

      const res = await fetch(`https://api.anthropic.com/v1/models?${query.toString()}`, {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      });
      if (!res.ok) break;

      const data = (await res.json()) as {
        data?: Array<{ id?: string; created_at?: string }>;
        has_more?: boolean;
        last_id?: string;
      };

      for (const model of data.data ?? []) {
        if (!model.id) continue;
        if (!discovered.has(model.id)) {
          discovered.set(model.id, {
            id: model.id,
            createdAt: model.created_at?.slice(0, 10),
          });
        }
      }

      if (!data.has_more || !data.last_id || data.last_id === afterId) break;
      afterId = data.last_id;
    }

    return Array.from(discovered.values());
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        encryptedOpenAIKey: true,
        openAIKeyIv: true,
        encryptedGoogleKey: true,
        googleKeyIv: true,
        encryptedAnthropicKey: true,
        anthropicKeyIv: true,
        creditBalance: true,
      },
    });

    // favoriteModelIds는 별도 쿼리 — 컬럼 문제 생겨도 나머지는 정상 반환
    let favoriteModelIds: string[] = [];
    try {
      const favRow = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { favoriteModelIds: true },
      });
      favoriteModelIds = favRow?.favoriteModelIds ?? [];
    } catch {
      // 컬럼이 아직 반영되지 않았을 경우 빈 배열로 폴백
    }

    const keyStatus: Record<Provider, boolean> = {
      openai: Boolean(user?.encryptedOpenAIKey),
      google: Boolean(user?.encryptedGoogleKey),
      anthropic: Boolean(user?.encryptedAnthropicKey),
    };

    const catalog = getModelCatalog();
    type ApiModel = (typeof catalog)[number] & {
      byokAvailable: boolean;
      platformAvailable: boolean;
      releaseDate?: string;
    };
    const modelMap = new Map<string, ApiModel>(
      catalog.map((model) => {
        const pricing = resolvePricing(model.id, model.inputUsdPer1M, model.outputUsdPer1M);
        return [model.id, {
        ...model,
        inputUsdPer1M: pricing.inputUsdPer1M,
        outputUsdPer1M: pricing.outputUsdPer1M,
        byokAvailable: keyStatus[model.provider],
        platformAvailable:
          (model.provider === 'openai' && Boolean(process.env.PLATFORM_OPENAI_API_KEY)) ||
          (model.provider === 'google' && Boolean(process.env.PLATFORM_GOOGLE_API_KEY)) ||
          (model.provider === 'anthropic' && Boolean(process.env.PLATFORM_ANTHROPIC_API_KEY)),
        releaseDate: resolveReleaseDate(model.id),
      }];
      })
    );

    const decryptedOpenAI =
      user?.encryptedOpenAIKey && user?.openAIKeyIv
        ? await decrypt(user.encryptedOpenAIKey, user.openAIKeyIv)
        : '';
    const decryptedGoogle =
      user?.encryptedGoogleKey && user?.googleKeyIv
        ? await decrypt(user.encryptedGoogleKey, user.googleKeyIv)
        : '';
    const decryptedAnthropic =
      user?.encryptedAnthropicKey && user?.anthropicKeyIv
        ? await decrypt(user.encryptedAnthropicKey, user.anthropicKeyIv)
        : '';

    const openAiDiscoveryKey = decryptedOpenAI || process.env.PLATFORM_OPENAI_API_KEY || '';
    const googleDiscoveryKey = decryptedGoogle || process.env.PLATFORM_GOOGLE_API_KEY || '';
    const anthropicDiscoveryKey = decryptedAnthropic || process.env.PLATFORM_ANTHROPIC_API_KEY || '';

    const [openAiDiscovered, googleDiscoveredRaw, anthropicDiscoveredRaw] = await Promise.all([
      openAiDiscoveryKey ? discoverOpenAIModels(openAiDiscoveryKey) : Promise.resolve([]),
      googleDiscoveryKey ? discoverGoogleModels(googleDiscoveryKey) : Promise.resolve([]),
      anthropicDiscoveryKey ? discoverAnthropicModels(anthropicDiscoveryKey) : Promise.resolve([]),
    ]);
    const googleDiscovered = Array.from(
      new Map(
        [...googleDiscoveredRaw, ...FALLBACK_GOOGLE_CHAT_MODEL_IDS.map((id): DiscoveredGoogleModel => ({ id }))]
          .map((model) => [model.id, model])
      ).values()
    );
    const anthropicDiscovered = Array.from(
      new Map<string, DiscoveredAnthropicModel>(
        [...anthropicDiscoveredRaw, ...FALLBACK_ANTHROPIC_CHAT_MODEL_IDS.map((id): DiscoveredAnthropicModel => ({ id }))]
          .map((model) => [model.id, model])
      ).values()
    );

    for (const model of openAiDiscovered) {
      if (!isOpenAIChatModel(model.id)) continue;
      if (modelMap.has(model.id)) continue;
      const pricing = resolvePricing(model.id, 0, 0);
      modelMap.set(model.id, {
        id: model.id,
        provider: 'openai',
        label: humanizeModelLabel(model.id),
        description: '',
        descriptionKo: '',
        qualityLevel: 'standard',
        priceLevel: 'medium',
        speedLevel: 'balanced',
        inputUsdPer1M: pricing.inputUsdPer1M,
        outputUsdPer1M: pricing.outputUsdPer1M,
        maxOutputTokens: 4096,
        minimumCreditsForPlatform: 0,
        recommended: false,
        byokAvailable: keyStatus.openai,
        platformAvailable: false,
        releaseDate: resolveReleaseDate(model.id, model.createdAt),
      });
    }

    for (const m of googleDiscovered) {
      if (!isGoogleChatModel(m.id)) continue;
      if (
        m.supportedGenerationMethods &&
        !m.supportedGenerationMethods.includes('generateContent')
      ) {
        continue;
      }
      if (modelMap.has(m.id)) continue;
      const pricing = resolvePricing(m.id, 0, 0);
      modelMap.set(m.id, {
        id: m.id,
        provider: 'google',
        label: humanizeModelLabel(m.id),
        description: '',
        descriptionKo: '',
        qualityLevel: 'standard',
        priceLevel: 'medium',
        speedLevel: 'balanced',
        inputUsdPer1M: pricing.inputUsdPer1M,
        outputUsdPer1M: pricing.outputUsdPer1M,
        maxOutputTokens: m.outputTokenLimit ?? 4096,
        minimumCreditsForPlatform: 0,
        recommended: false,
        byokAvailable: keyStatus.google,
        platformAvailable: false,
        contextWindowTokens: m.inputTokenLimit,
        releaseDate: resolveReleaseDate(m.id),
      });
    }

    for (const model of anthropicDiscovered) {
      if (!isAnthropicChatModel(model.id)) continue;
      if (modelMap.has(model.id)) continue;
      const pricing = resolvePricing(model.id, 0, 0);
      modelMap.set(model.id, {
        id: model.id,
        provider: 'anthropic',
        label: humanizeModelLabel(model.id),
        description: '',
        descriptionKo: '',
        qualityLevel: 'standard',
        priceLevel: 'medium',
        speedLevel: 'balanced',
        inputUsdPer1M: pricing.inputUsdPer1M,
        outputUsdPer1M: pricing.outputUsdPer1M,
        maxOutputTokens: 4096,
        minimumCreditsForPlatform: 0,
        recommended: false,
        byokAvailable: keyStatus.anthropic,
        platformAvailable: false,
        releaseDate: resolveReleaseDate(model.id, model.createdAt),
      });
    }

    const models = Array.from(modelMap.values()).map((model: ApiModel) => ({
      ...model,
      releaseDate: resolveReleaseDate(model.id, model.releaseDate),
    })).filter((model) => {
      if (model.provider === 'openai') return isOpenAIChatModel(model.id);
      if (model.provider === 'google') return isGoogleChatModel(model.id);
      if (model.provider === 'anthropic') return isAnthropicChatModel(model.id);
      return false;
    });
    const curatedModels = selectTopModelsPerProvider(models, PROVIDER_MODEL_LIMIT);

    return NextResponse.json({
      models: curatedModels,
      keyStatus,
      creditBalance: user?.creditBalance ?? 0,
      favoriteModelIds,
      pricingPolicy: {
        markupMultiplier: Number(process.env.PLATFORM_MARKUP_MULTIPLIER ?? '1.3'),
        usdPerCredit: Number(process.env.USD_PER_CREDIT ?? '0.01'),
      },
    });
  } catch (error) {
    console.error('[/api/chat/models] Unexpected error:', error);
    // 최소한 정적 카탈로그는 반환
    const models = getModelCatalog().map((model) => ({
      ...model,
      byokAvailable: false,
      platformAvailable: false,
    }));
    return NextResponse.json({
      models,
      keyStatus: { openai: false, google: false, anthropic: false },
      creditBalance: 0,
      favoriteModelIds: [],
      pricingPolicy: { markupMultiplier: 1.3, usdPerCredit: 0.01 },
    });
  }
}
