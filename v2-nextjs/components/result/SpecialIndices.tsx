'use client';

import { useTranslation } from '@/hooks/useTranslation';

interface SpecialIndicesProps {
  data: {
    PTI: string;
    pti_criteria: Record<string, boolean>;
    DEPI: string;
    depi_criteria: Record<string, boolean>;
    CDI: string;
    cdi_criteria: Record<string, boolean>;
    SCON: string;
    scon_criteria: Record<string, boolean>;
    HVI: string;
    hvi_criteria: Record<string, boolean>;
    OBS: string;
    obs_criteria: Record<string, boolean>;
    obs_rules: Record<string, boolean>;
    GHR: number;
    PHR: number;
  };
}

/** Custom read-only checkbox */
function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={`flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center mr-2 mt-0.5 ${
        checked
          ? 'bg-green-500 border-green-500'
          : 'bg-white border-gray-300'
      }`}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
}

/** Criterion item row */
function CriterionItem({ label, met, highlight = false }: { label: string; met: boolean; highlight?: boolean }) {
  return (
    <div className={`flex items-start py-1 ${highlight ? 'font-bold border-b border-gray-200 pb-2 mb-1' : ''}`}>
      <Checkbox checked={met} />
      <span className={`text-[11px] leading-relaxed ${
        met ? 'text-slate-800' : 'text-slate-400'
      }`}>
        {label}
      </span>
    </div>
  );
}

type IndexCriterion = { label: string; met: boolean; primary?: boolean };

function IndexCard({
  title,
  isPositive,
  thresholdLabel,
  criteria,
  note,
}: {
  title: string;
  isPositive: boolean;
  thresholdLabel: string;
  criteria: IndexCriterion[];
  note?: string;
}) {
  return (
    <div className="border border-gray-200 rounded bg-white p-3">
      <h3 className="text-sm font-semibold text-center pb-2 border-b border-gray-200 mb-2">
        {title}
      </h3>

      <div className="flex items-start mb-3 pb-2 border-b border-gray-200">
        <Checkbox checked={isPositive} />
        <div>
          <span className={`text-[11px] leading-relaxed ${isPositive ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
            {thresholdLabel}
          </span>
          {note && (
            <span className="block text-[10px] text-amber-600 mt-0.5">{note}</span>
          )}
        </div>
      </div>

      <div>
        {criteria.map((item, i) => (
          <CriterionItem
            key={i}
            label={item.label}
            met={item.met}
            highlight={item.primary}
          />
        ))}
      </div>
    </div>
  );
}

export default function SpecialIndices({ data }: SpecialIndicesProps) {
  const { t } = useTranslation();

  // Parse score and positive status from value string like "5, Positive"
  const parseIndex = (value: string) => {
    const [score, result] = value.split(', ');
    return { score: parseInt(score) || 0, isPositive: result === 'Positive' };
  };

  // PTI Criteria
  const ptiCriteria = [
    { label: '(1) XA% < .70 & WDA% < .75', met: data.pti_criteria.c1 },
    { label: '(2) X-% > .29', met: data.pti_criteria.c2 },
    { label: '(3) Lv2 > 2 & FAB2 > 0', met: data.pti_criteria.c3 },
    { label: '(4) R<17 & WSum6>12 or R>16 & WSum6>17', met: data.pti_criteria.c4 },
    { label: '(5) M- > 1 or X-% > .40', met: data.pti_criteria.c5 },
  ];

  // DEPI Criteria
  const depiCriteria = [
    { label: '(1) FV+VF+V > 0 or FD > 2', met: data.depi_criteria.c1 },
    { label: '(2) Col-Shd Bl > 0 or S > 2', met: data.depi_criteria.c2 },
    { label: '(3) 3r+(2)/R > .44 & Fr+rF=0 or < .33', met: data.depi_criteria.c3 },
    { label: '(4) Afr < .46 or Bl < 4', met: data.depi_criteria.c4 },
    { label: "(5) SumShading > FM+m or SumC' > 2", met: data.depi_criteria.c5 },
    { label: '(6) MOR > 2 or 2AB+Art+Ay > 3', met: data.depi_criteria.c6 },
    { label: '(7) COP < 2 or Isol > .24', met: data.depi_criteria.c7 },
  ];

  // CDI Criteria
  const cdiCriteria = [
    { label: '(1) EA < 6 or AdjD < 0', met: data.cdi_criteria.c1 },
    { label: '(2) COP < 2 & AG < 2', met: data.cdi_criteria.c2 },
    { label: '(3) WSumC < 2.5 or Afr < .46', met: data.cdi_criteria.c3 },
    { label: '(4) p > a+1 or H < 2', met: data.cdi_criteria.c4 },
    { label: '(5) T > 1 or Isol > .24 or Fd > 0', met: data.cdi_criteria.c5 },
  ];

  // S-CON Criteria
  const sconCriteria = [
    { label: '(1) FV+VF+V+FD > 2', met: data.scon_criteria.c1 },
    { label: '(2) Color-Shading Blends > 0', met: data.scon_criteria.c2 },
    { label: '(3) 3r+(2)/R < .31 or > .44', met: data.scon_criteria.c3 },
    { label: '(4) MOR > 3', met: data.scon_criteria.c4 },
    { label: '(5) Zd > +3.5 or Zd < -3.5', met: data.scon_criteria.c5 },
    { label: '(6) es > EA', met: data.scon_criteria.c6 },
    { label: '(7) CF+C > FC', met: data.scon_criteria.c7 },
    { label: '(8) X+% < .70', met: data.scon_criteria.c8 },
    { label: '(9) S > 3', met: data.scon_criteria.c9 },
    { label: '(10) P < 3 or P > 8', met: data.scon_criteria.c10 },
    { label: '(11) H < 2', met: data.scon_criteria.c11 },
    { label: '(12) R < 17', met: data.scon_criteria.c12 },
  ];

  // HVI Criteria
  const hviCriteria = [
    { label: '(1) FT+TF+T = 0', met: data.hvi_criteria.c1, primary: true },
    { label: '(2) Zf > 12', met: data.hvi_criteria.c2 },
    { label: '(3) Zd > +3.5', met: data.hvi_criteria.c3 },
    { label: '(4) S > 3', met: data.hvi_criteria.c4 },
    { label: '(5) H+(H)+Hd+(Hd) > 6', met: data.hvi_criteria.c5 },
    { label: '(6) (H)+(A)+(Hd)+(Ad) > 3', met: data.hvi_criteria.c6 },
    { label: '(7) H+A : Hd+Ad < 4:1', met: data.hvi_criteria.c7 },
    { label: '(8) Cg > 3', met: data.hvi_criteria.c8 },
  ];

  // OBS Criteria and Rules
  const obsCriteria = [
    { label: '(1) Dd > 3', met: data.obs_criteria.c1 },
    { label: '(2) Zf > 12', met: data.obs_criteria.c2 },
    { label: '(3) Zd > +3.0', met: data.obs_criteria.c3 },
    { label: '(4) P > 7', met: data.obs_criteria.c4 },
    { label: '(5) FQ+ > 1', met: data.obs_criteria.c5 },
  ];

  const obsRules = [
    { label: `${t('specialIndices.obs_r1')}`, met: data.obs_rules.r1 },
    { label: `${t('specialIndices.obs_r2')} & FQ+ > 3`, met: data.obs_rules.r2 },
    { label: `${t('specialIndices.obs_r3')} & X+% > .89`, met: data.obs_rules.r3 },
    { label: 'FQ+ > 3 & X+% > .89', met: data.obs_rules.r4 },
  ];

  const depi = parseIndex(data.DEPI);
  const cdi = parseIndex(data.CDI);
  const scon = parseIndex(data.SCON);
  const hvi = parseIndex(data.HVI);
  const obs = parseIndex(data.OBS);

  return (
    <div id="Special_Indices" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {/* S-Constellation */}
      <IndexCard
        title="S-Constellation"
        isPositive={scon.isPositive}
        thresholdLabel={t('specialIndices.scon_main')}
        criteria={sconCriteria}
        note={t('specialIndices.scon_note')}
      />

      {/* DEPI */}
      <IndexCard
        title="DEPI"
        isPositive={depi.isPositive}
        thresholdLabel={t('specialIndices.depi_main')}
        criteria={depiCriteria}
      />

      {/* PTI — no top checkbox (no cutoff), just title + criteria */}
      <div className="border border-gray-200 rounded bg-white p-3">
        <h3 className="text-sm font-semibold text-center pb-2 border-b border-gray-200 mb-2">
          PTI
        </h3>
        <div>
          {ptiCriteria.map((item, i) => (
            <CriterionItem key={i} label={item.label} met={item.met} />
          ))}
        </div>
      </div>

      {/* CDI */}
      <IndexCard
        title="CDI"
        isPositive={cdi.isPositive}
        thresholdLabel={t('specialIndices.cdi_main')}
        criteria={cdiCriteria}
      />

      {/* HVI */}
      <IndexCard
        title="HVI"
        isPositive={hvi.isPositive}
        thresholdLabel={t('specialIndices.hvi_main')}
        criteria={hviCriteria}
      />

      {/* OBS — rules then criteria, no section labels */}
      <div className="border border-gray-200 rounded bg-white p-3">
        <h3 className="text-sm font-semibold text-center pb-2 border-b border-gray-200 mb-2">
          OBS
        </h3>

        {/* Main criterion checkbox */}
        <div className="flex items-start mb-3 pb-2 border-b border-gray-200">
          <Checkbox checked={obs.isPositive} />
          <span className={`text-[11px] leading-relaxed ${obs.isPositive ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
            {t('specialIndices.obs_main')}
          </span>
        </div>

        {/* Rules */}
        <div className="mb-2">
          {obsRules.map((item, i) => (
            <CriterionItem key={`r${i}`} label={item.label} met={item.met} />
          ))}
        </div>

        {/* Criteria */}
        <div className="pt-2 border-t border-gray-200">
          {obsCriteria.map((item, i) => (
            <CriterionItem key={`c${i}`} label={item.label} met={item.met} />
          ))}
        </div>
      </div>
    </div>
  );
}
