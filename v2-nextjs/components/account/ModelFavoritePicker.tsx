'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { LockClosedIcon, StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import type { Provider } from '@/lib/aiModels';
import { useTranslation } from '@/hooks/useTranslation';
import { getProviderLabel } from '@/lib/modelLocalization';

type SortKey = 'model' | 'cost' | 'performance' | 'releaseDate';
type SortDir = 'asc' | 'desc';
type QualityLevel = 'basic' | 'standard' | 'advanced';
type TierValue = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type CostTier = 'veryLow' | 'low' | 'medium' | 'mediumHigh' | 'high' | 'veryHigh' | 'extreme';

type ModelOption = {
  id: string;
  provider: Provider;
  label: string;
  inputUsdPer1M: number;
  outputUsdPer1M: number;
  releaseDate?: string;
  byokAvailable: boolean;
  recommended?: boolean;
  qualityLevel?: QualityLevel;
};

type ApiOverlay = {
  favoriteIds: string[];
};

const COPY = {
  ko: {
    model: '모델',
    cost: '비용',
    performance: '성능',
    releaseDate: '공개일',
    hint: '공급사별 대표 채팅 모델 8개만 표시됩니다. 즐겨찾기한 모델만 채팅 화면 모델 선택에 나타납니다.',
    keyRequired: '즐겨찾기를 사용하려면 API 키 등록이 필요합니다.',
    noData: '정보 없음',
    recommended: '추천',
    favAdd: '즐겨찾기 추가',
    favRemove: '즐겨찾기 해제',
    performanceTiers: {
      1: '입문 - 짧은 질문 응답',
      2: '기초 - 단순 요약/분류',
      3: '실용 - 일반 대화/작성',
      4: '강화 - 다단계 지시 처리',
      5: '고급 - 복잡한 추론',
      6: '전문 - 긴 맥락 분석',
      7: '최상 - 최고난도 추론',
    } as Record<TierValue, string>,
    costTiers: {
      veryLow: '매우 저렴 - 대량 사용 적합',
      low: '저렴 - 일반 사용 적합',
      medium: '보통 - 균형형',
      mediumHigh: '약간 높음 - 고성능용',
      high: '높음 - 정밀 분석용',
      veryHigh: '매우 높음 - 전문가급 분석용',
      extreme: '최고가 - 최상위 추론용',
    } as Record<CostTier, string>,
  },
  en: {
    model: 'Model',
    cost: 'Cost',
    performance: 'Performance',
    releaseDate: 'Release Date',
    hint: 'Only 8 representative chat models per provider are shown. Only favorited models appear in chat model dropdowns.',
    keyRequired: 'Register API keys to enable favorites.',
    noData: 'No data',
    recommended: 'Recommended',
    favAdd: 'Add favorite',
    favRemove: 'Remove favorite',
    performanceTiers: {
      1: 'Entry - short Q&A',
      2: 'Basic - simple summary',
      3: 'Practical - general writing',
      4: 'Strong - multi-step tasks',
      5: 'Advanced - complex reasoning',
      6: 'Expert - long-context analysis',
      7: 'Frontier - hardest reasoning',
    } as Record<TierValue, string>,
    costTiers: {
      veryLow: 'Very low - heavy use friendly',
      low: 'Low - everyday use',
      medium: 'Medium - balanced',
      mediumHigh: 'Medium-high - stronger models',
      high: 'High - precision analysis',
      veryHigh: 'Very high - expert tier',
      extreme: 'Extreme - top-tier reasoning',
    } as Record<CostTier, string>,
  },
} as const;

function getCostPer1M(model: ModelOption): number {
  const input = Number.isFinite(model.inputUsdPer1M) ? model.inputUsdPer1M : 0;
  const output = Number.isFinite(model.outputUsdPer1M) ? model.outputUsdPer1M : 0;
  if (input <= 0 || output <= 0) return 0;
  return input + output;
}

function getCostTier(value: number): CostTier | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  if (value <= 0.5) return 'veryLow';
  if (value <= 2) return 'low';
  if (value <= 8) return 'medium';
  if (value <= 20) return 'mediumHigh';
  if (value <= 50) return 'high';
  if (value <= 100) return 'veryHigh';
  return 'extreme';
}

function getReleaseDateValue(model: ModelOption): number {
  if (!model.releaseDate) return 0;
  const ms = Date.parse(model.releaseDate);
  return Number.isFinite(ms) ? ms : 0;
}

function formatReleaseDate(dateString: string | undefined, fallback: string): string {
  if (!dateString) return fallback;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toISOString().slice(0, 10);
}

function getPerformanceTierValue(model: ModelOption): TierValue | null {
  const id = model.id.toLowerCase();
  if (id.includes('gpt-5') || id.includes('opus-4-6') || id.includes('o1-pro') || id.includes('o3-pro')) return 7;
  if (id.includes('opus') || id === 'o1' || id === 'o3' || id === 'o4' || id.includes('gemini-2.5-pro') || id.includes('sonnet-4-6') || id.includes('gpt-4.5')) return 6;
  if (id.includes('sonnet') || id.includes('gpt-4') || id.includes('gemini-2.5') || id.includes('o1-') || id.includes('o3-') || id.includes('o4-')) return 5;
  if (id.includes('gemini-2.0') || id.includes('claude-3.5') || id.includes('gemini-1.5-pro')) return 4;
  if (id.includes('flash') || id.includes('mini') || id.includes('haiku') || id.includes('gpt-3.5')) return 3;
  if (model.qualityLevel === 'advanced') return 5;
  if (model.qualityLevel === 'standard') return 4;
  if (model.qualityLevel === 'basic') return 2;
  return null;
}

function getPerformanceNarrative(model: ModelOption, lang: 'ko' | 'en'): string | null {
  const id = model.id.toLowerCase();

  if (lang === 'ko') {
    if (model.provider === 'openai') {
      if (id.includes('o3') || id.includes('o1')) return '최상위 추론 - 복잡한 임상 가설 분석';
      if (id.includes('gpt-5')) return '최상위 분석 - 고난도 해석과 근거 정리';
      if (id.includes('gpt-4')) return '고성능 대화 - 안정적 분석/보고서 작성';
      if (id.includes('mini') || id.includes('nano')) return '경량 효율 - 빠른 검토/전처리';
    }
    if (model.provider === 'anthropic') {
      if (id.includes('opus')) return '최상위 서술 - 심층 통찰/정교한 표현';
      if (id.includes('sonnet')) return '고성능 통합 - 일관된 종합 보고서';
      if (id.includes('haiku')) return '경량 효율 - 빠른 요약/핵심 정리';
    }
    if (model.provider === 'google') {
      if (id.includes('2.5-pro') || id.includes('3') && id.includes('pro')) return '대규모 분석 - 긴 맥락 통합 분석';
      if (id.includes('flash')) return '실시간 효율 - 빠른 응답과 계산';
      return '표준 참조 - 균형형 분석';
    }
    return null;
  }

  if (model.provider === 'openai') return 'High-reasoning analysis';
  if (model.provider === 'anthropic') return 'Clinical report quality';
  if (model.provider === 'google') return 'Large-context analysis';
  return null;
}

export default function ModelFavoritePicker() {
  const { language } = useTranslation();
  const t = COPY[language as keyof typeof COPY] ?? COPY.en;
  const langKey: 'ko' | 'en' = language === 'ko' ? 'ko' : 'en';
  const [activeProviderTab, setActiveProviderTab] = useState<Provider>('openai');
  const [sortKey, setSortKey] = useState<SortKey>('releaseDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [models, setModels] = useState<ModelOption[]>([]);
  const [overlay, setOverlay] = useState<ApiOverlay | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/chat/models');
        if (!res.ok) return;
        const data = (await res.json()) as { models: ModelOption[]; favoriteModelIds: string[] };
        setModels(data.models ?? []);
        setOverlay({ favoriteIds: data.favoriteModelIds ?? [] });
      } catch {
        // no-op
      }
    };
    void load();
  }, []);

  const toggleFavorite = useCallback(async (modelId: string) => {
    if (!overlay || saving) return;
    const next = overlay.favoriteIds.includes(modelId)
      ? overlay.favoriteIds.filter((id) => id !== modelId)
      : [...overlay.favoriteIds, modelId];
    setOverlay({ favoriteIds: next });
    setSaving(true);
    try {
      await fetch('/api/user/favorite-models', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelIds: next }),
      });
    } finally {
      setSaving(false);
    }
  }, [overlay, saving]);

  const anyKeyRegistered = useMemo(() => models.some((m) => m.byokAvailable), [models]);
  const providerModels = useMemo(() => models.filter((m) => m.provider === activeProviderTab), [models, activeProviderTab]);

  const sortedModels = useMemo(() => {
    const list = [...providerModels];
    const direction = sortDir === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      if (sortKey === 'model') return direction * a.label.localeCompare(b.label);
      if (sortKey === 'cost') {
        const av = getCostPer1M(a) || Number.MAX_SAFE_INTEGER;
        const bv = getCostPer1M(b) || Number.MAX_SAFE_INTEGER;
        return direction * (av - bv);
      }
      if (sortKey === 'releaseDate') {
        return direction * (getReleaseDateValue(a) - getReleaseDateValue(b));
      }
      return direction * ((getPerformanceTierValue(a) ?? -1) - (getPerformanceTierValue(b) ?? -1));
    });
    return list;
  }, [providerModels, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    if (key === 'cost') setSortDir('asc');
    else if (key === 'releaseDate') setSortDir('desc');
    else setSortDir('desc');
  }

  const sortArrow = (key: SortKey) => (sortKey === key ? (sortDir === 'asc' ? '▲' : '▼') : '↕');

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">
        {t.hint}
        {!anyKeyRegistered && <span className="ml-1 text-amber-600">{t.keyRequired}</span>}
      </p>

      <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
        {(['openai', 'google', 'anthropic'] as const).map((provider) => {
          const active = activeProviderTab === provider;
          const count = models.filter((m) => m.provider === provider).length;
          return (
            <button
              key={provider}
              type="button"
              onClick={() => setActiveProviderTab(provider)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {getProviderLabel(provider, language as 'ko' | 'en' | 'ja' | 'es' | 'pt')} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-x-4 border-b border-slate-100 pb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
        <button type="button" onClick={() => toggleSort('model')} className="inline-flex items-center gap-1 text-left">
          <span>{t.model}</span>
          <span>{sortArrow('model')}</span>
        </button>
        <button type="button" onClick={() => toggleSort('cost')} className="inline-flex w-28 items-center justify-center gap-1">
          <span>{t.cost}</span>
          <span>{sortArrow('cost')}</span>
        </button>
        <button type="button" onClick={() => toggleSort('performance')} className="inline-flex w-44 items-center justify-center gap-1">
          <span>{t.performance}</span>
          <span>{sortArrow('performance')}</span>
        </button>
        <button type="button" onClick={() => toggleSort('releaseDate')} className="inline-flex w-24 items-center justify-center gap-1">
          <span>{t.releaseDate}</span>
          <span>{sortArrow('releaseDate')}</span>
        </button>
        <span className="w-7" />
      </div>

      <div className="divide-y divide-slate-100">
        {sortedModels.map((model) => {
          const isLocked = !model.byokAvailable;
          const isFavorite = overlay?.favoriteIds.includes(model.id) ?? false;
          const performanceTier = getPerformanceTierValue(model);
          const performanceNarrative = getPerformanceNarrative(model, langKey);
          const costTier = getCostTier(getCostPer1M(model));
          return (
            <div key={model.id} className={`grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-x-4 py-2.5 ${isLocked ? 'opacity-50' : ''}`}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`text-sm font-semibold ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{model.label}</span>
                  {!isLocked && model.recommended && (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                      {t.recommended}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-28 text-center text-[11px] text-slate-600">{costTier ? t.costTiers[costTier] : t.noData}</div>
              <div className="w-44 text-center text-[11px] text-slate-600 break-words">
                {performanceNarrative ?? (performanceTier ? t.performanceTiers[performanceTier] : t.noData)}
              </div>
              <div className="w-24 text-center text-[11px] text-slate-600">{formatReleaseDate(model.releaseDate, t.noData)}</div>
              <div className="flex w-7 justify-center">
                {isLocked ? (
                  <LockClosedIcon className="h-4 w-4 text-slate-300" />
                ) : (
                  <button
                    onClick={() => void toggleFavorite(model.id)}
                    aria-label={isFavorite ? t.favRemove : t.favAdd}
                    className="rounded p-0.5 text-slate-300 transition-colors hover:text-amber-400"
                  >
                    {isFavorite ? <StarIcon className="h-5 w-5 text-amber-400" /> : <StarOutlineIcon className="h-5 w-5" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
