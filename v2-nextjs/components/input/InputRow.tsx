'use client';

import type { RorschachResponse } from '@/types';
import { OPTIONS } from '@/lib/options';
import SlotSelect from './SlotSelect';
import DeterminantSlots from './DeterminantSlots';
import ContentSlots from './ContentSlots';
import SpecialScoreSlots from './SpecialScoreSlots';
import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface InputRowProps {
  index: number;
  response: RorschachResponse;
  onChange: (response: RorschachResponse) => void;
  zScore: number | null;
  gphr: string;
  onResponseClick: (index: number) => void;
  rowBg: string;
}

export default function InputRow({ index, response, onChange, zScore, gphr, onResponseClick, rowBg }: InputRowProps) {
  const updateField = <K extends keyof RorschachResponse>(
    field: K,
    value: RorschachResponse[K]
  ) => {
    onChange({ ...response, [field]: value });
  };

  // Rule 1: Disable pair checkbox when reflection determinant is present
  const hasReflection = response.determinants.some(d => d === 'Fr' || d === 'rF');
  // Rule 2: Disable FQ '+' when DQ is 'v'
  const isDqVague = response.dq === 'v';
  // Rule 3: Disable Z input when DQ is 'v'
  // (Z-Score is not assigned to vague responses)

  return (
    <tr
      className="border-b border-slate-100/50 hover:bg-slate-50 transition-colors"
      style={{ backgroundColor: rowBg }}
    >
      {/* Row Number */}
      <td className="px-2 py-2.5 text-center text-xs font-medium text-slate-400 w-10 tabular-nums">
        {index + 1}
      </td>

      {/* Memo icon */}
      <td
        className="px-1 py-1 text-center"
        style={{ backgroundColor: rowBg }}
      >
        <button
          type="button"
          onClick={() => onResponseClick(index)}
          className="p-1 rounded-md hover:bg-slate-100 transition-colors inline-flex"
          title="Response memo"
        >
          {response.response ? (
            <DocumentTextIcon className="w-4 h-4 text-slate-500" />
          ) : (
            <DocumentIcon className="w-4 h-4 text-slate-300" />
          )}
        </button>
      </td>

      {/* Card */}
      <td className="px-1 py-2">
        <SlotSelect
          value={response.card}
          onChange={(v) => updateField('card', v)}
          options={OPTIONS.CARDS}
          className="w-14"
        />
      </td>

      {/* Location */}
      <td className="px-1 py-2">
        <SlotSelect
          value={response.location}
          onChange={(v) => updateField('location', v)}
          options={OPTIONS.LOCATIONS}
          className="w-14"
        />
      </td>

      {/* DQ */}
      <td className="px-1 py-2">
        <SlotSelect
          value={response.dq}
          onChange={(v) => updateField('dq', v)}
          options={OPTIONS.DQ}
          className="w-12"
        />
      </td>

      {/* Determinants */}
      <td className="px-1 py-2">
        <DeterminantSlots
          values={response.determinants}
          onChange={(v) => updateField('determinants', v)}
        />
      </td>

      {/* FQ ??'+' disabled when DQ is 'v' */}
      <td className="px-1 py-2">
        <SlotSelect
          value={response.fq}
          onChange={(v) => updateField('fq', v)}
          options={OPTIONS.FQ}
          disabledOptions={isDqVague ? ['+'] : undefined}
          className="w-14"
        />
      </td>

      {/* Pair ??disabled when Fr/rF (reflection) is present */}
      <td className="px-1 py-2 text-center">
        <input
          type="checkbox"
          checked={response.pair === '(2)'}
          onChange={(e) => updateField('pair', e.target.checked ? '(2)' : 'none')}
          disabled={hasReflection}
          className={`w-4 h-4 rounded border-slate-300 text-[#2A5F7F]
            focus:ring-[#4E73AA] ${hasReflection ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
          title={hasReflection ? 'Reflection (Fr/rF) already implies symmetry. Pair (2) cannot be recorded concurrently.' : undefined}
        />
      </td>

      {/* Contents */}
      <td className="px-1 py-2">
        <ContentSlots
          values={response.contents}
          onChange={(v) => updateField('contents', v)}
        />
      </td>

      {/* Popular */}
      <td className="px-1 py-2 text-center">
        <input
          type="checkbox"
          checked={response.popular}
          onChange={(e) => updateField('popular', e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-[#2A5F7F]
            focus:ring-[#4E73AA] cursor-pointer"
        />
      </td>

      {/* Z ??disabled when DQ is 'v' (no organizational activity for vague responses) */}
      <td className="px-1 py-2">
        <SlotSelect
          value={response.z}
          onChange={(v) => updateField('z', v)}
          options={OPTIONS.Z_TYPES}
          disabled={isDqVague}
          className="w-14"
        />
      </td>

      {/* Score */}
      <td className="px-1 py-2 text-center w-14">
        <span className="text-xs font-medium text-slate-600 tabular-nums">
          {zScore !== null ? zScore.toFixed(1) : ''}
        </span>
      </td>

      {/* G/PHR */}
      <td className="px-1 py-2 text-center w-14">
        <span className={`text-xs font-semibold ${
          gphr === 'GHR' ? 'text-emerald-600'
          : gphr === 'PHR' ? 'text-rose-500'
          : ''
        }`}>
          {gphr || ''}
        </span>
      </td>

      {/* Special Scores */}
      <td className="px-1 py-2">
        <SpecialScoreSlots
          values={response.specialScores}
          onChange={(v) => updateField('specialScores', v)}
        />
      </td>
    </tr>
  );
}


