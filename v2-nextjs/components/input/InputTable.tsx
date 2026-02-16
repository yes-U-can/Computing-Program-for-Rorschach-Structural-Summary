'use client';

import { useMemo, useState, useCallback, useRef, useEffect, Fragment } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import type { RorschachResponse } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { SCORING_CONFIG } from '@/lib/constants';
import { OPTIONS } from '@/lib/options';
import InputRow from './InputRow';
import Button from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { InformationCircleIcon, XMarkIcon, PencilSquareIcon, BarsArrowUpIcon } from '@heroicons/react/24/outline';

// Determinants with NO form component (Pure C, T, V, Y, Cn)
const FORMLESS_DETERMINANTS = ['C', 'T', 'V', 'Y', 'Cn'];

// Special score level pairs (Level 1 ??Level 2)
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
  const memoTooltipText = t('input.guideResponse');
  const rowTooltipText = t('input.tooltipInfo').replace(/,\s*/g, ',\n');
  const scoreTooltipText = t('input.scoreTooltip');
  const gphrTooltipText = t('input.gphrTooltip');
  const noTooltipText = t('input.noReorderTooltip');
  const cardSortLabel = 'Card 오름차순 정렬';

  const { showToast } = useToast();
  const [editingResponseIndex, setEditingResponseIndex] = useState<number | null>(null);
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
  const [dragInsertIndex, setDragInsertIndex] = useState<number | null>(null);
  const [dragGapHeight, setDragGapHeight] = useState(48);
  const portalRoot = typeof document !== 'undefined' ? document.body : null;
  const responsesRef = useRef(responses);
  const tbodyRef = useRef<HTMLTableSectionElement | null>(null);
  const ghostRef = useRef<HTMLElement | null>(null);
  const dragSourceRef = useRef<number | null>(null);
  const dragInsertRef = useRef<number | null>(null);
  const dragPointerOffsetYRef = useRef(0);
  const pointerYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const cardOrderMap = useMemo(
    () => new Map<string, number>(OPTIONS.CARDS.map((card, idx) => [card, idx])),
    []
  );

  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  useEffect(() => {
    dragSourceRef.current = dragSourceIndex;
  }, [dragSourceIndex]);

  useEffect(() => {
    dragInsertRef.current = dragInsertIndex;
  }, [dragInsertIndex]);

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

  // Handles row updates and applies domain rules before committing changes
  const handleResponseChange = useCallback((index: number, response: RorschachResponse) => {
    const currentResponses = responsesRef.current;
    const prev = currentResponses[index];
    const r = { ...response };
    const activeDets = r.determinants.filter(d => d !== '');

    // Rule 1: Reflection-Pair Mutual Exclusion
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

    // Rule 3: DQ 'v' → Z must be empty
    if (r.dq === 'v' && r.z !== '') {
      r.z = '';
      if (prev.dq !== 'v' || prev.z !== '') {
        showToast({ type: 'info', title: t('toast.dqVagueZ.title'), message: t('toast.dqVagueZ.message') });
      }
    }

    // Rule 4: Pure Determinant FQ Handling
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
    const activeScores = r.specialScores.filter(s => s !== '');
    let levelConflict = false;
    for (const [lv1, lv2] of LEVEL_PAIRS) {
      const hasLv1 = activeScores.includes(lv1);
      const hasLv2 = activeScores.includes(lv2);
      if (hasLv1 && hasLv2) {
        levelConflict = true;
        const prevScores = prev.specialScores.filter(s => s !== '');
        const prevHadLv2 = prevScores.includes(lv2);
        const removeTarget = (!prevHadLv2 && hasLv2) ? lv1 : lv2;
        r.specialScores = r.specialScores.map(s => s === removeTarget ? '' : s);
      }
    }
    if (levelConflict) {
      showToast({ type: 'info', title: t('toast.specialScoreLevel.title'), message: t('toast.specialScoreLevel.message') });
    }

    const newResponses = [...currentResponses];
    newResponses[index] = r;
    responsesRef.current = newResponses;
    onChange(newResponses);
  }, [onChange, showToast, t]);

  const addRow = useCallback(() => {
    const currentResponses = responsesRef.current;
    if (currentResponses.length < maxRows) {
      const newLength = currentResponses.length + 1;
      const newResponses = [...currentResponses, createEmptyResponse()];
      responsesRef.current = newResponses;
      onChange(newResponses);

      // Show warning when reaching 45 responses
      if (newLength === 45) {
        showToast({
          type: 'warning',
          title: t('toast.tooManyResponses.title'),
          message: t('toast.tooManyResponses.message')
        });
      }
    }
  }, [maxRows, onChange, showToast, t]);

  const removeLastRow = useCallback(() => {
    const currentResponses = responsesRef.current;
    if (currentResponses.length > 1) {
      const newResponses = currentResponses.slice(0, -1);
      responsesRef.current = newResponses;
      onChange(newResponses);
    }
  }, [onChange]);

  const sortByCardAscending = useCallback(() => {
    const currentResponses = responsesRef.current;
    const sorted = currentResponses
      .map((response, originalIndex) => ({ response, originalIndex }))
      .sort((a, b) => {
        const aRank = cardOrderMap.get(a.response.card) ?? Number.MAX_SAFE_INTEGER;
        const bRank = cardOrderMap.get(b.response.card) ?? Number.MAX_SAFE_INTEGER;
        if (aRank !== bRank) return aRank - bRank;
        return a.originalIndex - b.originalIndex;
      })
      .map((entry) => entry.response);

    responsesRef.current = sorted;
    onChange(sorted);
  }, [cardOrderMap, onChange]);

  const clearDragState = useCallback(() => {
    setDragSourceIndex(null);
    setDragInsertIndex(null);
    dragSourceRef.current = null;
    dragInsertRef.current = null;
    if (ghostRef.current && ghostRef.current.parentNode) {
      ghostRef.current.parentNode.removeChild(ghostRef.current);
    }
    ghostRef.current = null;
    document.body.style.userSelect = '';
  }, []);

  const getInsertIndexFromPointer = useCallback((clientY: number): number => {
    const sourceIndex = dragSourceRef.current;
    const total = responsesRef.current.length;
    if (sourceIndex === null || total <= 1) return sourceIndex ?? 0;

    const rows = Array.from(tbodyRef.current?.querySelectorAll('tr[data-row-index]') ?? []);
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const rowIndexAttr = row.getAttribute('data-row-index');
      if (rowIndexAttr === null) continue;
      const rowIndex = Number(rowIndexAttr);
      if (Number.isNaN(rowIndex) || rowIndex === sourceIndex) continue;
      const rect = row.getBoundingClientRect();
      if (clientY < rect.top + rect.height / 2) {
        return rowIndex;
      }
    }

    return total;
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    pointerYRef.current = event.clientY;
    if (rafIdRef.current !== null) return;

    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;

      const sourceIndex = dragSourceRef.current;
      if (sourceIndex === null) return;

      const y = pointerYRef.current;
      if (ghostRef.current) {
        ghostRef.current.style.top = `${y - dragPointerOffsetYRef.current}px`;
      }

      const nextInsertIndex = getInsertIndexFromPointer(y);
      if (dragInsertRef.current !== nextInsertIndex) {
        dragInsertRef.current = nextInsertIndex;
        setDragInsertIndex(nextInsertIndex);
      }
    });
  }, [getInsertIndexFromPointer]);

  const handlePointerUp = useCallback(() => {
    const sourceIndex = dragSourceRef.current;
    const insertIndex = dragInsertRef.current;

    if (sourceIndex !== null && insertIndex !== null) {
      let targetIndex = insertIndex;
      if (targetIndex > sourceIndex) targetIndex -= 1;

      if (targetIndex !== sourceIndex) {
        const currentResponses = responsesRef.current;
        const reordered = [...currentResponses];
        const [moved] = reordered.splice(sourceIndex, 1);
        reordered.splice(targetIndex, 0, moved);
        responsesRef.current = reordered;
        onChange(reordered);
      }
    }

    window.removeEventListener('pointermove', handlePointerMove);
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    clearDragState();
  }, [onChange, clearDragState, handlePointerMove]);

  const handleNoCellPointerDown = useCallback((index: number, event: ReactPointerEvent<HTMLTableCellElement>) => {
    if (event.button !== 0) return;
    const rowElement = event.currentTarget.closest('tr') as HTMLTableRowElement | null;
    if (!rowElement) return;

    event.preventDefault();
    const rect = rowElement.getBoundingClientRect();
    setDragGapHeight(Math.max(40, Math.round(rect.height)));
    const ghost = rowElement.cloneNode(true) as HTMLElement;
    ghost.style.position = 'fixed';
    ghost.style.top = `${rect.top}px`;
    ghost.style.left = `${rect.left}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.background = '#ffffff';
    ghost.style.opacity = '1';
    ghost.style.border = '1px solid rgba(100, 116, 139, 0.85)';
    ghost.style.boxShadow = '0 22px 40px rgba(15, 23, 42, 0.35)';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '99999';
    ghost.style.transform = 'scale(1.01)';
    document.body.appendChild(ghost);

    ghostRef.current = ghost;
    dragPointerOffsetYRef.current = event.clientY - rect.top;
    pointerYRef.current = event.clientY;
    dragSourceRef.current = index;
    dragInsertRef.current = index;
    setDragSourceIndex(index);
    setDragInsertIndex(index);
    document.body.style.userSelect = 'none';

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
  }, [handlePointerMove, handlePointerUp]);

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (ghostRef.current && ghostRef.current.parentNode) {
        ghostRef.current.parentNode.removeChild(ghostRef.current);
      }
      ghostRef.current = null;
      document.body.style.userSelect = '';
    };
  }, [handlePointerMove, handlePointerUp]);

  // Header columns — memoized to avoid recreating on every render
  const headers = useMemo(() => [
    { key: 'no',           label: 'No.',           tooltip: noTooltipText, accent: 'transparent',       className: 'w-10' },
    { key: 'action',       label: <PencilSquareIcon className="w-4 h-4 text-slate-400 mx-auto" />, tooltip: memoTooltipText, accent: 'transparent', className: 'w-10' },
    { key: 'card',         label: 'Card',          accent: 'transparent', className: '' },
    { key: 'location',     label: 'Location',      accent: 'transparent', className: '' },
    { key: 'dq',           label: 'DQ',            accent: 'transparent', className: '' },
    { key: 'determinants', label: 'Determinants',  accent: 'transparent', className: '' },
    { key: 'fq',           label: 'FQ',            accent: 'transparent', className: '' },
    { key: 'pair',         label: 'Pair',          accent: 'transparent', className: '' },
    { key: 'contents',     label: 'Contents',      accent: 'transparent', className: '' },
    { key: 'popular',      label: 'P',             accent: 'transparent', className: '' },
    { key: 'z',            label: 'Z',             accent: 'transparent', className: '' },
    { key: 'score',        label: 'Score',         tooltip: scoreTooltipText, accent: 'transparent', className: 'w-14' },
    { key: 'gphr',         label: 'G/PHR',         tooltip: gphrTooltipText, accent: 'transparent', className: 'w-14' },
    { key: 'special',      label: 'Special Score', accent: 'transparent', className: '' },
  ], [memoTooltipText, scoreTooltipText, gphrTooltipText, noTooltipText]);

  return (
    <div className="rounded-xl border border-slate-200/80 shadow-sm bg-white overflow-visible">
      {/* Table */}
      <div className="overflow-x-auto md:overflow-visible">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#C1D2DC' }}>
              {headers.map((h) => (
                <th
                  key={h.key}
                  className={`px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-wider border-r border-white/40 last:border-r-0 first:rounded-tl-xl last:rounded-tr-xl ${h.className}`}
                  style={{ borderBottom: '2px solid #A8BCC8', color: '#2A5F7F' }}
                >
                  {h.tooltip ? (
                    <Tooltip content={h.tooltip}>
                      <span className="flex justify-center items-center h-full w-full">{h.label}</span>
                    </Tooltip>
                  ) : h.key === 'card' ? (
                    <span className="flex justify-center items-center gap-1">
                      <span>{h.label}</span>
                      <button
                        type="button"
                        onClick={sortByCardAscending}
                        aria-label={cardSortLabel}
                        title={cardSortLabel}
                        className="inline-flex items-center justify-center rounded p-0.5 text-[#2A5F7F]/80 hover:bg-white/40 hover:text-[#2A5F7F] transition-colors"
                      >
                        <BarsArrowUpIcon className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ) : (
                    h.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {responses.map((response, index) => (
              <Fragment key={`group-${index}`}>
                {dragSourceIndex !== null && dragInsertIndex === index && (
                  <tr aria-hidden="true">
                    <td colSpan={headers.length} className="p-0 border-0">
                      <div
                        className="bg-[#2A5F7F]/10 border-y border-[#2A5F7F]/35 transition-all duration-100"
                        style={{ height: `${dragGapHeight}px` }}
                      />
                    </td>
                  </tr>
                )}
                <InputRow
                  index={index}
                  response={response}
                  onChange={handleResponseChange}
                  zScore={calculatedData[index].zScore}
                  gphr={calculatedData[index].gphr}
                  onResponseClick={openResponsePopup}
                  isDragging={dragSourceIndex === index}
                  isDragTarget={false}
                  onNoCellPointerDown={handleNoCellPointerDown}
                />
              </Fragment>
            ))}
            {dragSourceIndex !== null && dragInsertIndex === responses.length && (
              <tr aria-hidden="true">
                <td colSpan={headers.length} className="p-0 border-0">
                  <div
                    className="bg-[#2A5F7F]/10 border-y border-[#2A5F7F]/35 transition-all duration-100"
                    style={{ height: `${dragGapHeight}px` }}
                  />
                </td>
              </tr>
            )}
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
                {t('input.responseNumber', { index: String(editingResponseIndex + 1) })}
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
                focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/50 focus:border-[var(--brand-500)] transition-colors resize-none"
              placeholder="..."
            />
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={closeResponsePopup}
                className="px-5 py-2 text-sm font-medium text-white bg-[var(--brand-700)] hover:bg-[var(--brand-700-hover)] rounded-lg transition-colors shadow-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>,
        portalRoot
      )}

      {/* Row controls */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200" style={{ backgroundColor: '#F7F9FB' }}>
        <p className="text-xs text-slate-500 pr-4 whitespace-pre-line">{t('input.rowOrderTip')}</p>
        <div className="flex items-center gap-3">
          {/* Tooltip info icon */}
          <Tooltip content={rowTooltipText}>
            <InformationCircleIcon className="w-5 h-5 text-slate-400 cursor-help" />
          </Tooltip>

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

