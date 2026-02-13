'use client';

import { useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { RorschachResponse } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { SCORING_CONFIG } from '@/lib/constants';
import { HEADER_ACCENT, ROW_COLORS } from '@/lib/colors';
import InputRow from './InputRow';
import Button from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { InformationCircleIcon, XMarkIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

// Determinants with NO form component (Pure C, T, V, Y, Cn)
const FORMLESS_DETERMINANTS = ['C', 'T', 'V', 'Y', 'Cn'];

// Special score level pairs (Level 1 ↔ Level 2)
const LEVEL_PAIRS: [string, string][] = [
  ['DV1', 'DV2'],
  ['DR1', 'DR2'],
  ['INCOM1', 'INCOM2'],
  ['FABCOM1', 'FABCOM2'],
];

interface InputTableProps {
  responses: RorschachResponse[];
  onChange: (responses: RorschachResponse[]) => void;
  maxRows?: number;
}

function createEmptyResponse(): RorschachResponse {
  return {
    card: '',
    response: '',
    location: '',
    dq: '',
    determinants: [],
    fq: '',
    pair: 'none',
    contents: [],
    popular: false,
    z: '',
    specialScores: []
  };
}

// Calculate Z score for a response
function calculateZScore(response: RorschachResponse): number | null {
  if (!response.card || !response.z) return null;

  const Z_TABLE = SCORING_CONFIG.TABLES.Z_SCORE;
  const cardScores = Z_TABLE[response.card as keyof typeof Z_TABLE];
  if (!cardScores) return null;

  const score = cardScores[response.z as keyof typeof cardScores];
  return typeof score === 'number' ? score : null;
}

// Simple GHR/PHR classification (for display only - actual calculation happens in calculator.ts)
function classifyGPHR(response: RorschachResponse): string {
  const humanContentCodes = SCORING_CONFIG.CODES.HUMAN_CONTENT_GPHR as readonly string[];
  const humanMovementCodes = SCORING_CONFIG.CODES.HUMAN_MOVEMENT as readonly string[];
  const animalMovementCodes = SCORING_CONFIG.CODES.ANIMAL_MOVEMENT as readonly string[];
  const copOrAgCodes = SCORING_CONFIG.CODES.COP_OR_AG as readonly string[];
  const fqGoodCodes = SCORING_CONFIG.CODES.FQ_GOOD as readonly string[];
  const cognitiveSsBadCodes = SCORING_CONFIG.CODES.COGNITIVE_SS_BAD as readonly string[];
  const agOrMorCodes = SCORING_CONFIG.CODES.AG_OR_MOR as readonly string[];
  const fqBadCodes = SCORING_CONFIG.CODES.FQ_BAD as readonly string[];
  const level2SsCodes = SCORING_CONFIG.CODES.LEVEL_2_SS as readonly string[];
  const gphrPopularCards = SCORING_CONFIG.CODES.GPHR_POPULAR_CARDS as readonly string[];

  const hasHumanContent = response.contents.some(c => humanContentCodes.includes(c));
  const hasHumanMovement = response.determinants.some(d => humanMovementCodes.includes(d));
  const hasAnimalMovement = response.determinants.some(d => animalMovementCodes.includes(d));
  const hasCopOrAg = response.specialScores.some(s => copOrAgCodes.includes(s));

  const isEligible = hasHumanContent || hasHumanMovement || (hasAnimalMovement && hasCopOrAg);
  if (!isEligible) return '';

  const isPureH = response.contents.includes('H');
  const isGoodFQ = fqGoodCodes.includes(response.fq);
  const hasBadCognitiveSS = response.specialScores.some(s => cognitiveSsBadCodes.includes(s));
  const hasAgOrMor = response.specialScores.some(s => agOrMorCodes.includes(s));

  if (isPureH && isGoodFQ && !hasBadCognitiveSS && !hasAgOrMor) {
    return 'GHR';
  }

  const isBadFQ = fqBadCodes.includes(response.fq);
  const hasLevel2SS = response.specialScores.some(s => level2SsCodes.includes(s));

  if (isBadFQ || hasLevel2SS) return 'PHR';
  if (response.specialScores.includes('COP') && !response.specialScores.includes('AG')) return 'GHR';
  if (response.specialScores.includes('FABCOM1') || response.specialScores.includes('MOR') || response.contents.includes('An')) return 'PHR';
  if (response.popular && gphrPopularCards.includes(response.card)) return 'GHR';
  if (response.specialScores.includes('AG') || response.specialScores.includes('INCOM1') || response.specialScores.includes('DR1') || response.contents.includes('Hd')) return 'PHR';

  return 'GHR';
}

export default function InputTable({ responses, onChange, maxRows = 50 }: InputTableProps) {
  const { t } = useTranslation();
  const memoTooltipText = "피검자의 언어 반응을 메모하는 공간이며, 계산에 영향을 주지 않으므로 비워둬도 괜찮습니다.";
  const scoreTooltipText = "[Card]와 [Z] 유형을 선택하면 자동으로 계산됩니다. [Z] 유형이 선택되지 않은 경우에는 표시되지 않습니다.";
  const gphrTooltipText = "반응에 인간 관련 내용(Contents에 H, (H) 등)이나 인간/동물 운동(Determinants에 M, FM 등)이 포함될 때, 다른 채점 항목들을 종합하여 자동으로 부여됩니다. 이 조건이 충족되지 않으면 표시되지 않습니다.";

  const { showToast } = useToast();
  const accent = HEADER_ACCENT.light;
  const rows = ROW_COLORS.light;
  const [editingResponseIndex, setEditingResponseIndex] = useState<number | null>(null);
  const portalRoot = typeof document !== 'undefined' ? document.body : null;

  const openResponsePopup = useCallback((index: number) => {
    setEditingResponseIndex(index);
  }, []);

  const closeResponsePopup = useCallback(() => {
    setEditingResponseIndex(null);
  }, []);

  // Calculate Z scores and G/PHR for all responses
  const calculatedData = useMemo(() => {
    return responses.map(r => ({
      zScore: calculateZScore(r),
      gphr: classifyGPHR(r)
    }));
  }, [responses]);

  const handleResponseChange = (index: number, response: RorschachResponse) => {
    const prev = responses[index];
    const r = { ...response };
    const activeDets = r.determinants.filter(d => d !== '');

    // Rule 1: Reflection-Pair Mutual Exclusion
    // Fr/rF takes priority → pair must be cleared
    const hasReflection = activeDets.some(d => d === 'Fr' || d === 'rF');
    if (hasReflection && r.pair === '(2)') {
      r.pair = 'none';
      if (prev.pair === '(2)' || (!prev.determinants.some(d => d === 'Fr' || d === 'rF'))) {
        showToast({ type: 'info', title: t('toast.reflectionPair.title'), message: t('toast.reflectionPair.message') });
      }
    }

    // Rule 2: DQ 'v' prohibits FQ '+'
    if (r.dq === 'v' && r.fq === '+') {
      r.fq = '';
      if (prev.dq !== 'v' || prev.fq !== '+') {
        showToast({ type: 'info', title: t('toast.dqVagueFq.title'), message: t('toast.dqVagueFq.message') });
      }
    }

    // Rule 3: DQ 'v' → Z must be empty (no Z score for vague responses)
    if (r.dq === 'v' && r.z !== '') {
      r.z = '';
      if (prev.dq !== 'v' || prev.z !== '') {
        showToast({ type: 'info', title: t('toast.dqVagueZ.title'), message: t('toast.dqVagueZ.message') });
      }
    }

    // Rule 4: Pure Determinant FQ Handling
    // If ALL active determinants are formless → FQ must be 'none'
    if (activeDets.length > 0 && activeDets.every(d => FORMLESS_DETERMINANTS.includes(d))) {
      if (r.fq !== 'none') {
        r.fq = 'none';
        const prevActiveDets = prev.determinants.filter(d => d !== '');
        const wasPrevAllFormless = prevActiveDets.length > 0 && prevActiveDets.every(d => FORMLESS_DETERMINANTS.includes(d));
        if (!wasPrevAllFormless) {
          showToast({ type: 'info', title: t('toast.pureDeterminantFq.title'), message: t('toast.pureDeterminantFq.message') });
        }
      }
    }

    // Rule 5: Special Score Integrity
    // DV, DR, INCOM, FABCOM — only one level per category
    const activeScores = r.specialScores.filter(s => s !== '');
    let levelConflict = false;
    for (const [lv1, lv2] of LEVEL_PAIRS) {
      const hasLv1 = activeScores.includes(lv1);
      const hasLv2 = activeScores.includes(lv2);
      if (hasLv1 && hasLv2) {
        levelConflict = true;
        // Find which one was just added by comparing with previous state
        const prevScores = prev.specialScores.filter(s => s !== '');
        const prevHadLv2 = prevScores.includes(lv2);
        // Keep the newly added one, remove the old one
        const removeTarget = (!prevHadLv2 && hasLv2) ? lv1 : lv2;
        r.specialScores = r.specialScores.map(s => s === removeTarget ? '' : s);
      }
    }
    if (levelConflict) {
      showToast({ type: 'info', title: t('toast.specialScoreLevel.title'), message: t('toast.specialScoreLevel.message') });
    }

    const newResponses = [...responses];
    newResponses[index] = r;
    onChange(newResponses);
  };

  const addRow = () => {
    if (responses.length < maxRows) {
      const newLength = responses.length + 1;
      onChange([...responses, createEmptyResponse()]);

      // Show warning when reaching 45 responses
      if (newLength === 45) {
        showToast({
          type: 'warning',
          title: t('toast.tooManyResponses.title'),
          message: t('toast.tooManyResponses.message')
        });
      }
    }
  };

  const removeLastRow = () => {
    if (responses.length > 1) {
      onChange(responses.slice(0, -1));
    }
  };

  // Header columns with accent colors — original labels preserved
  const headers = [
    { key: 'no',           label: 'No.',           accent: 'transparent',       className: 'w-10' },
    { key: 'action',       label: <PencilSquareIcon className="w-4 h-4 text-slate-400 mx-auto" />, tooltip: memoTooltipText, accent: 'transparent', className: 'w-10' },
    { key: 'card',         label: 'Card',          accent: accent.basic,        className: '' },
    { key: 'location',     label: 'Location',      accent: accent.location,     className: '' },
    { key: 'dq',           label: 'DQ',            accent: accent.dq,           className: '' },
    { key: 'determinants', label: 'Determinants',   accent: accent.determinants, className: '' },
    { key: 'fq',           label: 'FQ',            accent: accent.fq,           className: '' },
    { key: 'pair',         label: 'Pair',          accent: accent.pair,         className: '' },
    { key: 'contents',     label: 'Contents',      accent: accent.contents,     className: '' },
    { key: 'popular',      label: 'P',             accent: accent.popular,      className: '' },
    { key: 'z',            label: 'Z',             accent: accent.z,            className: '' },
    { key: 'score',        label: 'Score',         tooltip: scoreTooltipText, accent: accent.score,       className: 'w-14' },
    { key: 'gphr',         label: 'G/PHR',         tooltip: gphrTooltipText, accent: accent.gphr,       className: 'w-14' },
    { key: 'special',      label: 'Special Score', accent: accent.special,      className: '' },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 shadow-sm bg-white overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: rows.header }}>
              {headers.map((h) => (
                <th
                  key={h.key}
                  className={`px-2 py-3 text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${h.className}`}
                  style={{ borderBottom: `2.5px solid ${h.accent}` }}
                >
                  {h.tooltip ? (
                    <Tooltip content={h.tooltip}>
                      <span className="flex justify-center items-center h-full w-full">{h.label}</span>
                    </Tooltip>
                  ) : (
                    h.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((response, index) => (
              <InputRow
                key={index}
                index={index}
                response={response}
                onChange={(r) => handleResponseChange(index, r)}
                zScore={calculatedData[index].zScore}
                gphr={calculatedData[index].gphr}
                onResponseClick={openResponsePopup}
                rowBg={index % 2 === 0 ? rows.odd : rows.even}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Response editing popup - rendered via portal */}
      {editingResponseIndex !== null && portalRoot && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20"
          onClick={(e) => { if (e.target === e.currentTarget) closeResponsePopup(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">
                Response #{editingResponseIndex + 1}
              </h3>
              <button
                type="button"
                onClick={closeResponsePopup}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={responses[editingResponseIndex]?.response || ''}
              onChange={(e) => {
                const newResponses = [...responses];
                newResponses[editingResponseIndex] = {
                  ...newResponses[editingResponseIndex],
                  response: e.target.value,
                };
                onChange(newResponses);
              }}
              className="w-full h-32 px-3 py-2.5 text-sm rounded-lg bg-slate-50 border border-slate-200
                focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all resize-none"
              placeholder="..."
              autoFocus
            />
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={closeResponsePopup}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>,
        portalRoot
      )}

      {/* Row controls */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100" style={{ backgroundColor: rows.header }}>
        <p className="text-xs text-slate-500 pr-4 whitespace-pre-line">{t('input.rowOrderTip')}</p>
        <div className="flex items-center gap-3">
          {/* Tooltip info icon */}
          <div className="relative group">
            <InformationCircleIcon className="w-5 h-5 text-slate-400 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-pre-line">
              {t('input.tooltipInfo')}
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={addRow}
            disabled={responses.length >= maxRows}
          >
            {t('buttons.add')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={removeLastRow}
            disabled={responses.length <= 1}
          >
            {t('buttons.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}
