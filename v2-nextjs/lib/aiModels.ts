export type Provider = 'openai' | 'google' | 'anthropic';

export type ModelQualityLevel = 'basic' | 'standard' | 'advanced';
export type ModelPriceLevel = 'low' | 'medium' | 'high';
export type ModelSpeedLevel = 'fast' | 'balanced' | 'deep';

export type AIModelConfig = {
  id: string;
  provider: Provider;
  label: string;
  description: string;
  qualityLevel: ModelQualityLevel;
  priceLevel: ModelPriceLevel;
  speedLevel: ModelSpeedLevel;
  // USD per 1M tokens baseline (provider list price approximation, override with env if needed)
  inputUsdPer1M: number;
  outputUsdPer1M: number;
  // Protective cap for platform billing pre-check
  maxOutputTokens: number;
  // Minimum credits needed to start a platform-billed request
  minimumCreditsForPlatform: number;
  recommended: boolean;
};

const MODEL_CATALOG: AIModelConfig[] = [
  {
    id: 'gpt-4o',
    provider: 'openai',
    label: 'GPT-4o',
    description: 'Balanced multimodal model for high-quality analysis.',
    qualityLevel: 'advanced',
    priceLevel: 'high',
    speedLevel: 'balanced',
    inputUsdPer1M: 5,
    outputUsdPer1M: 15,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 120,
    recommended: true,
  },
  {
    id: 'gpt-4o-mini',
    provider: 'openai',
    label: 'GPT-4o mini',
    description: 'Lower-cost model for lightweight conversational tasks.',
    qualityLevel: 'standard',
    priceLevel: 'low',
    speedLevel: 'fast',
    inputUsdPer1M: 0.15,
    outputUsdPer1M: 0.6,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 20,
    recommended: true,
  },
  {
    id: 'gemini-2.0-flash',
    provider: 'google',
    label: 'Gemini 2.0 Flash',
    description: 'Fast response model with strong cost-efficiency.',
    qualityLevel: 'standard',
    priceLevel: 'low',
    speedLevel: 'fast',
    inputUsdPer1M: 0.1,
    outputUsdPer1M: 0.4,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 20,
    recommended: true,
  },
  {
    id: 'gemini-2.5-pro',
    provider: 'google',
    label: 'Gemini 2.5 Pro',
    description: 'Higher-depth reasoning model for complex interpretation.',
    qualityLevel: 'advanced',
    priceLevel: 'high',
    speedLevel: 'deep',
    inputUsdPer1M: 1.25,
    outputUsdPer1M: 10,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 90,
    recommended: false,
  },
  {
    id: 'claude-sonnet-4-5-20250929',
    provider: 'anthropic',
    label: 'Claude Sonnet 4.5',
    description: 'High-quality analytical model with strong writing clarity.',
    qualityLevel: 'advanced',
    priceLevel: 'high',
    speedLevel: 'balanced',
    inputUsdPer1M: 3,
    outputUsdPer1M: 15,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 110,
    recommended: true,
  },
  {
    id: 'claude-3-5-haiku-latest',
    provider: 'anthropic',
    label: 'Claude 3.5 Haiku',
    description: 'Low-cost fast model for routine interactions.',
    qualityLevel: 'basic',
    priceLevel: 'low',
    speedLevel: 'fast',
    inputUsdPer1M: 0.8,
    outputUsdPer1M: 4,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 40,
    recommended: false,
  },
];

const DEFAULT_MARKUP_MULTIPLIER = Number(process.env.PLATFORM_MARKUP_MULTIPLIER ?? '1.3');
const DEFAULT_USD_PER_CREDIT = Number(process.env.USD_PER_CREDIT ?? '0.01');

function sanitizeNumber(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function getModelCatalog(): AIModelConfig[] {
  return MODEL_CATALOG;
}

export function getModelById(modelId: string): AIModelConfig | null {
  return MODEL_CATALOG.find((model) => model.id === modelId) ?? null;
}

export function getMarkupMultiplier(): number {
  return sanitizeNumber(DEFAULT_MARKUP_MULTIPLIER, 1.3);
}

export function getUsdPerCredit(): number {
  return sanitizeNumber(DEFAULT_USD_PER_CREDIT, 0.01);
}

export function estimateTokens(text: string): number {
  const normalized = text.trim();
  if (!normalized) return 0;
  // Lightweight heuristic for mixed EN/KO text.
  return Math.max(1, Math.ceil(normalized.length / 3.6));
}

export function estimateTokenCostCredits(params: {
  model: AIModelConfig;
  inputTokens: number;
  outputTokens: number;
}) {
  const { model, inputTokens, outputTokens } = params;
  const markup = getMarkupMultiplier();
  const usdPerCredit = getUsdPerCredit();

  const inputUsd = (inputTokens / 1_000_000) * model.inputUsdPer1M;
  const outputUsd = (outputTokens / 1_000_000) * model.outputUsdPer1M;
  const billedUsd = (inputUsd + outputUsd) * markup;

  const credits = Math.max(1, Math.ceil(billedUsd / usdPerCredit));
  return {
    credits,
    billedUsd,
    rawProviderUsd: inputUsd + outputUsd,
    markupMultiplier: markup,
  };
}

export function toPsychologyLabel(level: ModelQualityLevel): string {
  if (level === 'advanced') return 'Clinical specialist level';
  if (level === 'standard') return 'Graduate trainee level';
  return 'Assistant summary level';
}


