'use client';

import { useState, useMemo } from 'react';
import type { RorschachResponse } from '@/types';
import { OPTIONS } from '@/lib/options';
import { SCORING_CONFIG } from '@/lib/constants';
import SlotSelect from './SlotSelect';
import DeterminantSlots from './DeterminantSlots';
import ContentSlots from './ContentSlots';
import SpecialScoreSlots from './SpecialScoreSlots';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface MobileCardProps {
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

function calculateZScore(response: RorschachResponse): number | null {
  if (!response.card || !response.z) return null;
  const Z_TABLE = SCORING_CONFIG.TABLES.Z_SCORE;
  const cardScores = Z_TABLE[response.card as keyof typeof Z_TABLE];
  if (!cardScores) return null;
  const score = cardScores[response.z as keyof typeof cardScores];
  return typeof score === 'number' ? score : null;
}

export default function MobileCard({ responses, onChange, maxRows = 50 }: MobileCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentResponse = responses[currentIndex] || createEmptyResponse();

  const zScore = useMemo(() => calculateZScore(currentResponse), [currentResponse]);

  const updateField = <K extends keyof RorschachResponse>(field: K, value: RorschachResponse[K]) => {
    const newResponses = [...responses];
    newResponses[currentIndex] = { ...currentResponse, [field]: value };
    onChange(newResponses);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < responses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const addRow = () => {
    if (responses.length < maxRows) {
      const newResponses = [...responses, createEmptyResponse()];
      onChange(newResponses);
      setCurrentIndex(newResponses.length - 1);
    }
  };

  const removeCurrentRow = () => {
    if (responses.length > 1) {
      const newResponses = responses.filter((_, i) => i !== currentIndex);
      onChange(newResponses);
      if (currentIndex >= newResponses.length) {
        setCurrentIndex(newResponses.length - 1);
      }
    }
  };

  const progress = ((currentIndex + 1) / responses.length) * 100;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-[#2A5F7F] rounded-full transition-[colors,transform] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">
          Response {currentIndex + 1} / {responses.length}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={addRow}
            disabled={responses.length >= maxRows}
            className="p-2 rounded-lg bg-[#C1D2DC]/30 text-[#2A5F7F] hover:bg-[#C1D2DC]/50 disabled:opacity-50 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          <button
            onClick={removeCurrentRow}
            disabled={responses.length <= 1}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Form Fields - Labels always in English per original GAS design */}
      <div className="space-y-4">
        {/* Row 1: Card, Location, DQ */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Card</label>
            <SlotSelect
              value={currentResponse.card}
              onChange={(v) => updateField('card', v)}
              options={OPTIONS.CARDS}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
            <SlotSelect
              value={currentResponse.location}
              onChange={(v) => updateField('location', v)}
              options={OPTIONS.LOCATIONS}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">DQ</label>
            <SlotSelect
              value={currentResponse.dq}
              onChange={(v) => updateField('dq', v)}
              options={OPTIONS.DQ}
              className="w-full"
            />
          </div>
        </div>

        {/* Determinants */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Determinants</label>
          <DeterminantSlots
            values={currentResponse.determinants}
            onChange={(v) => updateField('determinants', v)}
          />
        </div>

        {/* Row 2: FQ, Pair, Z */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">FQ</label>
            <SlotSelect
              value={currentResponse.fq}
              onChange={(v) => updateField('fq', v)}
              options={OPTIONS.FQ}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Pair</label>
            <SlotSelect
              value={currentResponse.pair}
              onChange={(v) => updateField('pair', v)}
              options={OPTIONS.PAIR}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Z</label>
            <SlotSelect
              value={currentResponse.z}
              onChange={(v) => updateField('z', v)}
              options={OPTIONS.Z_TYPES}
              className="w-full"
            />
          </div>
        </div>

        {/* Contents */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Contents</label>
          <ContentSlots
            values={currentResponse.contents}
            onChange={(v) => updateField('contents', v)}
          />
        </div>

        {/* Popular */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600">P</label>
          <input
            type="checkbox"
            checked={currentResponse.popular}
            onChange={(e) => updateField('popular', e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-[#2A5F7F] focus:ring-[#4E73AA]"
          />
        </div>

        {/* Special Scores */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Special Score</label>
          <SpecialScoreSlots
            values={currentResponse.specialScores}
            onChange={(v) => updateField('specialScores', v)}
          />
        </div>

        {/* Response Text */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Response</label>
          <textarea
            value={currentResponse.response}
            onChange={(e) => updateField('response', e.target.value)}
            className="w-full h-20 px-3 py-2 text-sm rounded-lg bg-white/50 border border-slate-200
              focus:outline-none focus:ring-2 focus:ring-[#4E73AA] focus:border-[#4E73AA] resize-none"
            placeholder="..."
          />
        </div>

        {/* Calculated Score */}
        <div className="flex justify-center">
          <div className="px-4 py-2 bg-[#C1D2DC]/20 rounded-lg">
            <span className="text-sm font-medium text-slate-600">Score: </span>
            <span className="text-lg font-bold text-[#2A5F7F]">
              {zScore !== null ? zScore.toFixed(1) : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="flex-1 px-4 py-4 text-lg font-bold rounded-lg bg-slate-100/80 text-slate-500 hover:bg-slate-200/80 hover:text-slate-700 disabled:opacity-50 transition-[colors,transform]"
        >
          <ChevronLeftIcon className="w-6 h-6 mx-auto" />
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === responses.length - 1}
          className="flex-1 px-4 py-4 text-lg font-bold rounded-lg text-white shadow-lg shadow-[#2A5F7F]/20 bg-[#2A5F7F] hover:shadow-[#2A5F7F]/20 hover:bg-[#1E4D6A] disabled:opacity-50 transition-[colors,transform]"
        >
          <ChevronRightIcon className="w-6 h-6 mx-auto" />
        </button>
      </div>
    </div>
  );
}










