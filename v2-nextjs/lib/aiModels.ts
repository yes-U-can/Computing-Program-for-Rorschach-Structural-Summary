export type Provider = 'openai' | 'google' | 'anthropic';

export type ModelQualityLevel = 'basic' | 'standard' | 'advanced';
export type ModelPriceLevel = 'low' | 'medium' | 'high';
export type ModelSpeedLevel = 'fast' | 'balanced' | 'deep';

export type AIModelConfig = {
  id: string;
  provider: Provider;
  label: string;
  description: string;
  descriptionKo: string;
  contextWindowTokens?: number;
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
  // ── OpenAI ──────────────────────────────────────────────────────────────
  {
    id: 'gpt-4o',
    provider: 'openai',
    label: 'GPT-4o',
    description: 'Flagship multimodal model balancing quality and speed.',
    descriptionKo: '품질과 속도를 균형 있게 갖춘 OpenAI 플래그십 모델.',
    qualityLevel: 'advanced',
    priceLevel: 'high',
    speedLevel: 'balanced',
    inputUsdPer1M: 2.5,
    outputUsdPer1M: 10,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 90,
    recommended: true,
  },
  {
    id: 'gpt-4o-mini',
    provider: 'openai',
    label: 'GPT-4o mini',
    description: 'Lightweight, low-cost model for everyday conversational tasks.',
    descriptionKo: '일상적인 대화 작업에 적합한 저비용 경량 모델.',
    qualityLevel: 'standard',
    priceLevel: 'low',
    speedLevel: 'fast',
    inputUsdPer1M: 0.15,
    outputUsdPer1M: 0.6,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 10,
    recommended: true,
  },
  {
    id: 'gpt-4.1',
    provider: 'openai',
    label: 'GPT-4.1',
    description: 'High-quality GPT model for precise reasoning and writing.',
    descriptionKo: '정교한 추론과 글쓰기에 강한 고품질 GPT 모델.',
    qualityLevel: 'advanced',
    priceLevel: 'high',
    speedLevel: 'balanced',
    inputUsdPer1M: 2,
    outputUsdPer1M: 8,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 80,
    recommended: false,
  },
  {
    id: 'gpt-4.1-mini',
    provider: 'openai',
    label: 'GPT-4.1 mini',
    description: 'Compact GPT-4.1 variant optimized for fast everyday usage.',
    descriptionKo: '빠른 일상 사용에 최적화된 GPT-4.1 경량 모델.',
    qualityLevel: 'standard',
    priceLevel: 'low',
    speedLevel: 'fast',
    inputUsdPer1M: 0.4,
    outputUsdPer1M: 1.6,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 20,
    recommended: false,
  },
  {
    id: 'o1',
    provider: 'openai',
    label: 'o1',
    description: 'Advanced reasoning model for complex, multi-step analysis.',
    descriptionKo: '복잡한 다단계 분석에 특화된 고급 추론 모델.',
    qualityLevel: 'advanced',
    priceLevel: 'high',
    speedLevel: 'deep',
    inputUsdPer1M: 15,
    outputUsdPer1M: 60,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 600,
    recommended: false,
  },
  {
    id: 'o4-mini',
    provider: 'openai',
    label: 'o4-mini',
    description: 'Fast reasoning model for structured analytical workflows.',
    descriptionKo: '구조화된 분석 워크플로우에 적합한 고속 추론 모델.',
    qualityLevel: 'advanced',
    priceLevel: 'medium',
    speedLevel: 'deep',
    inputUsdPer1M: 1.5,
    outputUsdPer1M: 6,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 60,
    recommended: false,
  },
  {
    id: 'o1-mini',
    provider: 'openai',
    label: 'o1-mini',
    description: 'Faster, lower-cost reasoning model for structured tasks.',
    descriptionKo: '구조화된 작업을 위한 빠르고 저렴한 추론 모델.',
    qualityLevel: 'standard',
    priceLevel: 'medium',
    speedLevel: 'balanced',
    inputUsdPer1M: 3,
    outputUsdPer1M: 12,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 110,
    recommended: false,
  },
  {
    id: 'o3-mini',
    provider: 'openai',
    label: 'o3-mini',
    description: 'Compact next-gen reasoning model for analytical tasks.',
    descriptionKo: '분석 작업에 최적화된 소형 차세대 추론 모델.',
    qualityLevel: 'advanced',
    priceLevel: 'medium',
    speedLevel: 'deep',
    inputUsdPer1M: 1.1,
    outputUsdPer1M: 4.4,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 50,
    recommended: false,
  },
  // ── Google ───────────────────────────────────────────────────────────────
  {
    id: 'gemini-2.0-flash',
    provider: 'google',
    label: 'Gemini 2.0 Flash',
    description: 'Fast, cost-efficient model with strong general capability.',
    descriptionKo: '빠른 속도와 높은 비용 효율을 갖춘 범용 모델.',
    qualityLevel: 'standard',
    priceLevel: 'low',
    speedLevel: 'fast',
    inputUsdPer1M: 0.1,
    outputUsdPer1M: 0.4,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 10,
    recommended: true,
  },
  {
    id: 'gemini-1.5-flash',
    provider: 'google',
    label: 'Gemini 1.5 Flash',
    description: 'High-throughput lightweight model for rapid responses.',
    descriptionKo: '빠른 응답이 필요한 작업에 최적화된 경량 모델.',
    qualityLevel: 'standard',
    priceLevel: 'low',
    speedLevel: 'fast',
    inputUsdPer1M: 0.075,
    outputUsdPer1M: 0.3,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 10,
    recommended: false,
  },
  {
    id: 'gemini-2.5-pro',
    provider: 'google',
    label: 'Gemini 2.5 Pro',
    description: 'High-end reasoning model for deep, complex interpretation.',
    descriptionKo: '복잡한 심층 해석에 특화된 Google 최고 성능 모델.',
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
    id: 'gemini-2.5-flash',
    provider: 'google',
    label: 'Gemini 2.5 Flash',
    description: 'Faster Gemini 2.5 line optimized for responsive interactions.',
    descriptionKo: '응답성을 강화한 Gemini 2.5 고속 라인 모델.',
    qualityLevel: 'standard',
    priceLevel: 'low',
    speedLevel: 'fast',
    inputUsdPer1M: 0.2,
    outputUsdPer1M: 0.8,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 15,
    recommended: false,
  },
  // ── Anthropic ────────────────────────────────────────────────────────────
  {
    id: 'claude-opus-4-6',
    provider: 'anthropic',
    label: 'Claude Opus 4.6',
    description: 'Most capable Claude model for deep clinical-level analysis.',
    descriptionKo: '임상 수준의 심층 분석을 위한 Claude 최고 성능 모델.',
    qualityLevel: 'advanced',
    priceLevel: 'high',
    speedLevel: 'deep',
    inputUsdPer1M: 15,
    outputUsdPer1M: 75,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 500,
    recommended: false,
  },
  {
    id: 'claude-sonnet-4-6',
    provider: 'anthropic',
    label: 'Claude Sonnet 4.6',
    description: 'Excellent analytical quality with clear, precise writing.',
    descriptionKo: '명확하고 정밀한 글쓰기와 높은 분석 품질을 갖춘 모델.',
    qualityLevel: 'advanced',
    priceLevel: 'medium',
    speedLevel: 'balanced',
    inputUsdPer1M: 3,
    outputUsdPer1M: 15,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 110,
    recommended: true,
  },
  {
    id: 'claude-sonnet-4-20250514',
    provider: 'anthropic',
    label: 'Claude Sonnet 4',
    description: 'Balanced Claude 4 model for reliable quality and speed.',
    descriptionKo: '품질과 속도의 균형이 좋은 Claude 4 모델.',
    qualityLevel: 'advanced',
    priceLevel: 'medium',
    speedLevel: 'balanced',
    inputUsdPer1M: 3,
    outputUsdPer1M: 15,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 110,
    recommended: false,
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    provider: 'anthropic',
    label: 'Claude 3.5 Sonnet',
    description: 'Previous-generation Sonnet with strong general capabilities.',
    descriptionKo: '강력한 범용 성능을 갖춘 이전 세대 Sonnet 모델.',
    qualityLevel: 'advanced',
    priceLevel: 'medium',
    speedLevel: 'balanced',
    inputUsdPer1M: 3,
    outputUsdPer1M: 15,
    maxOutputTokens: 4096,
    minimumCreditsForPlatform: 110,
    recommended: false,
  },
  {
    id: 'claude-haiku-4-5-20251001',
    provider: 'anthropic',
    label: 'Claude Haiku 4.5',
    description: 'Ultra-fast, low-cost model for quick routine interactions.',
    descriptionKo: '빠른 일상 대화에 최적화된 초고속 저비용 모델.',
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
