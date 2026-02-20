import type { Language } from '@/types';
import type { Provider } from '@/lib/aiModels';

const PROVIDER_LABELS: Record<Language, Record<Provider, string>> = {
  ko: { openai: 'OpenAI', google: 'Gemini', anthropic: 'Claude' },
  en: { openai: 'OpenAI', google: 'Gemini', anthropic: 'Claude' },
  ja: { openai: 'OpenAI', google: 'Gemini', anthropic: 'Claude' },
  es: { openai: 'OpenAI', google: 'Gemini', anthropic: 'Claude' },
  pt: { openai: 'OpenAI', google: 'Gemini', anthropic: 'Claude' },
};

const MODEL_DESC: Record<string, Partial<Record<Language, string>>> = {
  'gpt-4o': {
    ko: '품질과 속도의 균형이 좋은 OpenAI 대표 멀티모달 모델입니다.',
    en: 'OpenAI flagship multimodal model balancing quality and speed.',
    ja: '品質と速度のバランスに優れた OpenAI の主力マルチモーダルモデルです。',
    es: 'Modelo multimodal insignia de OpenAI, equilibrado entre calidad y velocidad.',
    pt: 'Modelo multimodal principal da OpenAI, equilibrando qualidade e velocidade.',
  },
  'gpt-4o-mini': {
    ko: '일상적인 대화와 작업에 적합한 저비용 경량 모델입니다.',
    en: 'Lightweight, low-cost model for everyday conversational tasks.',
    ja: '日常的な会話や軽作業に適した低コストの軽量モデルです。',
    es: 'Modelo ligero y económico para conversaciones y tareas cotidianas.',
    pt: 'Modelo leve e econômico para conversas e tarefas do dia a dia.',
  },
  'gpt-4.1': {
    ko: '정교한 추론과 글쓰기에 강한 고품질 GPT 모델입니다.',
    en: 'High-quality GPT model for precise reasoning and writing.',
    ja: '精密な推論と文章生成に強い高品質 GPT モデルです。',
    es: 'Modelo GPT de alta calidad para razonamiento y redacción precisos.',
    pt: 'Modelo GPT de alta qualidade para raciocínio e escrita precisos.',
  },
  'gpt-4.1-mini': {
    ko: '빠른 일상 작업에 최적화된 GPT-4.1 경량 모델입니다.',
    en: 'Compact GPT-4.1 variant optimized for fast everyday usage.',
    ja: '日常利用向けに最適化された GPT-4.1 の軽量モデルです。',
    es: 'Variante compacta de GPT-4.1 optimizada para uso diario rápido.',
    pt: 'Variante compacta do GPT-4.1 otimizada para uso diário rápido.',
  },
  o1: {
    ko: '복잡한 다단계 추론에 강한 고성능 모델입니다.',
    en: 'Advanced reasoning model for complex, multi-step analysis.',
    ja: '複雑な多段推論に強い高性能モデルです。',
    es: 'Modelo de razonamiento avanzado para análisis complejos de varios pasos.',
    pt: 'Modelo avançado de raciocínio para análises complexas em múltiplas etapas.',
  },
  'o1-mini': {
    ko: '구조화된 추론 작업에 적합한 경량 추론 모델입니다.',
    en: 'Faster, lower-cost reasoning model for structured tasks.',
    ja: '構造化された推論タスクに適した軽量推論モデルです。',
    es: 'Modelo de razonamiento más rápido y económico para tareas estructuradas.',
    pt: 'Modelo de raciocínio mais rápido e econômico para tarefas estruturadas.',
  },
  'o3-mini': {
    ko: '분석 중심 작업에 최적화된 차세대 소형 추론 모델입니다.',
    en: 'Compact next-gen reasoning model for analytical tasks.',
    ja: '分析タスク向けに最適化された次世代の小型推論モデルです。',
    es: 'Modelo compacto de nueva generación para tareas analíticas.',
    pt: 'Modelo compacto de nova geração para tarefas analíticas.',
  },
  'o4-mini': {
    ko: '구조화된 분석 워크플로우에 적합한 고속 추론 모델입니다.',
    en: 'Fast reasoning model for structured analytical workflows.',
    ja: '構造化された分析ワークフロー向けの高速推論モデルです。',
    es: 'Modelo de razonamiento rápido para flujos analíticos estructurados.',
    pt: 'Modelo de raciocínio rápido para fluxos analíticos estruturados.',
  },
  'gemini-2.0-flash': {
    ko: '빠르고 비용 효율적인 범용 모델입니다.',
    en: 'Fast, cost-efficient model with strong general capability.',
    ja: '高速でコスト効率の高い汎用モデルです。',
    es: 'Modelo rápido y rentable con buena capacidad general.',
    pt: 'Modelo rápido e econômico com ótima capacidade geral.',
  },
  'gemini-1.5-flash': {
    ko: '즉시 응답이 필요한 작업에 적합한 고속 모델입니다.',
    en: 'High-throughput lightweight model for rapid responses.',
    ja: '高速応答が必要な場面に適した高スループットモデルです。',
    es: 'Modelo ligero de alto rendimiento para respuestas rápidas.',
    pt: 'Modelo leve de alto desempenho para respostas rápidas.',
  },
  'gemini-2.5-pro': {
    ko: '깊고 복잡한 해석 작업에 강한 고성능 모델입니다.',
    en: 'High-end reasoning model for deep, complex interpretation.',
    ja: '深い・複雑な解釈に強い高性能推論モデルです。',
    es: 'Modelo de razonamiento avanzado para interpretaciones complejas.',
    pt: 'Modelo de raciocínio avançado para interpretações complexas.',
  },
  'gemini-2.5-flash': {
    ko: '응답성이 중요한 작업에 맞춘 Gemini 2.5 고속 모델입니다.',
    en: 'Faster Gemini 2.5 line optimized for responsive interactions.',
    ja: '応答性を重視した Gemini 2.5 の高速モデルです。',
    es: 'Modelo rápido de Gemini 2.5 optimizado para respuestas ágiles.',
    pt: 'Modelo rápido da linha Gemini 2.5, otimizado para respostas ágeis.',
  },
  'claude-opus-4-6': {
    ko: '심층 분석에 강한 Claude 최상위 모델입니다.',
    en: 'Most capable Claude model for deep clinical-level analysis.',
    ja: '深い分析に強い Claude の最上位モデルです。',
    es: 'Modelo Claude más potente para análisis clínicos en profundidad.',
    pt: 'Modelo Claude mais avançado para análises profundas em nível clínico.',
  },
  'claude-sonnet-4-6': {
    ko: '정확한 분석과 안정적인 응답 품질을 제공하는 균형형 모델입니다.',
    en: 'Excellent analytical quality with clear, precise writing.',
    ja: '分析品質と文章の明瞭さに優れたバランス型モデルです。',
    es: 'Modelo equilibrado con gran calidad analítica y redacción precisa.',
    pt: 'Modelo equilibrado com ótima qualidade analítica e escrita precisa.',
  },
  'claude-sonnet-4-20250514': {
    ko: '품질과 속도의 균형이 좋은 Claude 4 Sonnet 모델입니다.',
    en: 'Balanced Claude 4 model for reliable quality and speed.',
    ja: '品質と速度のバランスに優れた Claude 4 Sonnet モデルです。',
    es: 'Modelo Claude 4 equilibrado, con buena calidad y velocidad.',
    pt: 'Modelo Claude 4 equilibrado, com boa qualidade e velocidade.',
  },
  'claude-3-5-sonnet-20241022': {
    ko: '검증된 성능의 이전 세대 Sonnet 모델입니다.',
    en: 'Previous-generation Sonnet with strong general capabilities.',
    ja: '実績のある前世代 Sonnet モデルです。',
    es: 'Modelo Sonnet de generación anterior con capacidad sólida.',
    pt: 'Modelo Sonnet da geração anterior com capacidade sólida.',
  },
  'claude-haiku-4-5-20251001': {
    ko: '빠른 일상 질의에 적합한 초고속 경량 모델입니다.',
    en: 'Ultra-fast, low-cost model for quick routine interactions.',
    ja: '日常の短い問い合わせ向けの超高速軽量モデルです。',
    es: 'Modelo ultrarrápido y económico para interacciones rutinarias.',
    pt: 'Modelo ultrarrápido e econômico para interações rotineiras.',
  },
};

export function getProviderLabel(provider: Provider, lang: Language): string {
  return PROVIDER_LABELS[lang]?.[provider] ?? PROVIDER_LABELS.en[provider];
}

export function getLocalizedModelDescription(
  modelId: string,
  fallback: { description: string; descriptionKo?: string },
  lang: Language
): string {
  const localized = MODEL_DESC[modelId]?.[lang];
  if (localized) return localized;
  if (lang === 'ko' && fallback.descriptionKo) return fallback.descriptionKo;
  return fallback.description;
}
