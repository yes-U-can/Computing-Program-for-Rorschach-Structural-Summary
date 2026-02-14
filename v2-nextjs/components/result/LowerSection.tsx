'use client';

interface SpecialIndicesData {
  PTI?: string;
  DEPI?: string;
  CDI?: string;
  SCON?: string;
  HVI?: string;
  OBS?: string;
  [key: string]: unknown;
}

interface LowerSectionProps {
  specialIndices?: SpecialIndicesData;
  data: {
    R: number;
    Lambda: string;
    EB: string;
    EA: string;
    EBPer: string | number;
    eb: string;
    es: string;
    D: number | string;
    AdjD: number | string;
    AdjEs: string;
    FM: number;
    m: number;
    SumCprime: number;
    SumT: number;
    SumV: number;
    SumY: number;
    a_p: string;
    Ma_Mp: string;
    _2AB_Art_Ay: number;
    MOR: number;
    Sum6: number;
    Lv2: number;
    WSum6_ideation: number;
    M_minus_ideation: number;
    Mnone: number;
    FC_CF_C: string;
    PureC: number;
    SumC_WSumC: string;
    Afr: string;
    S_aff: number;
    Blends_R: string;
    CP: number;
    XA_percent: string;
    WDA_percent: string;
    X_minus_percent: string;
    S_minus: number;
    P: number;
    X_plus_percent: string;
    Xu_percent: string;
    Zf: number;
    Zd: string | number;
    W_D_Dd: string;
    W_M: string;
    PSV: number;
    DQ_plus: number;
    DQ_v: number;
    COP: number;
    AG: number;
    a_p_inter: string;
    Food: number;
    SumT_inter: number;
    HumanCont: number;
    PureH: number;
    PER: number;
    ISO_Index: string;
    _3r_2_R: string;
    Fr_rF: number;
    SumV_self: number;
    FD: number;
    An_Xy: number;
    MOR_self: number;
    H_ratio: string;
  };
}

/** Zero-value gray-out */
function cellClass(value: string | number | undefined | null): string {
  const v = value ?? '';
  if (v === 0 || v === '' || v === '-' || v === '0' || v === '0.00') {
    return 'bg-gray-50 text-gray-300';
  }
  return 'font-bold';
}

const TH = 'px-1 py-1.5 text-[10px] font-normal text-left bg-slate-50 border border-gray-200 whitespace-nowrap overflow-hidden';
const TD = 'px-2 py-1.5 text-[11px] text-center border border-gray-200 tabular-nums';
const EMPTY_CELL = 'border-0 bg-white';

function GridCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded bg-white flex flex-col">
      <h3 className="text-xs font-semibold text-center py-1.5 border-b border-gray-200 flex-shrink-0">
        {title}
      </h3>
      <div className="p-1.5 flex-grow">
        {children}
      </div>
    </div>
  );
}

/** Simple 2-column table row */
function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <tr>
      <th className={TH}>{label}</th>
      <td className={`${TD} ${cellClass(value)}`}>{value}</td>
    </tr>
  );
}

export default function LowerSection({ data, specialIndices }: LowerSectionProps) {
  return (
    <div id="Lower_Section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {/* Row 1: Core, Affection, Interpersonal, Self-Perception */}

      {/* Core Card - complex 3-column table (matches legacy) */}
      <GridCard title="Core">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: '16%' }} />
            <col style={{ width: '17.33%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '17.33%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '17.33%' }} />
          </colgroup>
          <tbody>
            {/* R, Lambda */}
            <tr>
              <th className={TH}>R</th>
              <td className={`${TD} ${cellClass(data.R)}`}>{data.R}</td>
              <th className={TH}>Lambda</th>
              <td className={`${TD} ${cellClass(data.Lambda)}`}>{data.Lambda}</td>
              <td className={EMPTY_CELL} colSpan={2}></td>
            </tr>
            {/* EB, EA, EBPer */}
            <tr>
              <th className={TH}>EB</th>
              <td className={`${TD} ${cellClass(data.EB)}`}>{data.EB}</td>
              <th className={TH}>EA</th>
              <td className={`${TD} ${cellClass(data.EA)}`}>{data.EA}</td>
              <th className={TH}>EBPer</th>
              <td className={`${TD} ${cellClass(data.EBPer)}`}>{data.EBPer}</td>
            </tr>
            {/* eb, es, D */}
            <tr>
              <th className={TH}>eb</th>
              <td className={`${TD} ${cellClass(data.eb)}`}>{data.eb}</td>
              <th className={TH}>es</th>
              <td className={`${TD} ${cellClass(data.es)}`}>{data.es}</td>
              <th className={TH}>D</th>
              <td className={`${TD} ${cellClass(data.D)}`}>{data.D}</td>
            </tr>
            {/* (empty), Adj es, Adj D */}
            <tr>
              <td className={EMPTY_CELL} colSpan={2}></td>
              <th className={TH}>Adj es</th>
              <td className={`${TD} ${cellClass(data.AdjEs)}`}>{data.AdjEs}</td>
              <th className={TH}>Adj D</th>
              <td className={`${TD} ${cellClass(data.AdjD)}`}>{data.AdjD}</td>
            </tr>
            {/* FM, SumC', SumT */}
            <tr>
              <th className={TH}>FM</th>
              <td className={`${TD} ${cellClass(data.FM)}`}>{data.FM}</td>
              <th className={TH}>SumC&apos;</th>
              <td className={`${TD} ${cellClass(data.SumCprime)}`}>{data.SumCprime}</td>
              <th className={TH}>SumT</th>
              <td className={`${TD} ${cellClass(data.SumT)}`}>{data.SumT}</td>
            </tr>
            {/* m, SumV, SumY */}
            <tr>
              <th className={TH}>m</th>
              <td className={`${TD} ${cellClass(data.m)}`}>{data.m}</td>
              <th className={TH}>SumV</th>
              <td className={`${TD} ${cellClass(data.SumV)}`}>{data.SumV}</td>
              <th className={TH}>SumY</th>
              <td className={`${TD} ${cellClass(data.SumY)}`}>{data.SumY}</td>
            </tr>
          </tbody>
        </table>
      </GridCard>

      {/* Affection Card */}
      <GridCard title="Affection">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            <Row label="FC : CF+C" value={data.FC_CF_C} />
            <Row label="Pure C" value={data.PureC} />
            <Row label="SumC' : WSumC" value={data.SumC_WSumC} />
            <Row label="Afr" value={data.Afr} />
            <Row label="S" value={data.S_aff} />
            <Row label="Blends : R" value={data.Blends_R} />
            <Row label="CP" value={data.CP} />
          </tbody>
        </table>
      </GridCard>

      {/* Interpersonal Card */}
      <GridCard title="Interpersonal">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            <Row label="COP" value={data.COP} />
            <Row label="AG" value={data.AG} />
            <Row label="a : p" value={data.a_p_inter} />
            <Row label="Food" value={data.Food} />
            <Row label="SumT" value={data.SumT_inter} />
            <Row label="Human Cont" value={data.HumanCont} />
            <Row label="Pure H" value={data.PureH} />
            <Row label="PER" value={data.PER} />
            <Row label="ISO Index" value={data.ISO_Index} />
          </tbody>
        </table>
      </GridCard>

      {/* Self-Perception Card */}
      <GridCard title="Self-Perception">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            <Row label="3r+(2)/R" value={data._3r_2_R} />
            <Row label="Fr+rF" value={data.Fr_rF} />
            <Row label="SumV" value={data.SumV_self} />
            <Row label="FD" value={data.FD} />
            <Row label="An+Xy" value={data.An_Xy} />
            <Row label="MOR" value={data.MOR_self} />
            <Row label="H : (H)+Hd+(Hd)" value={data.H_ratio} />
          </tbody>
        </table>
      </GridCard>

      {/* Row 2: Ideation, Cognitive Mediation, Information Processing, Special Indices */}

      {/* Ideation Card - 4-column table (matches legacy) */}
      <GridCard title="Ideation">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '25%' }} />
          </colgroup>
          <tbody>
            <tr>
              <th className={TH}>a : p</th>
              <td className={`${TD} ${cellClass(data.a_p)}`}>{data.a_p}</td>
              <th className={TH}>Sum6</th>
              <td className={`${TD} ${cellClass(data.Sum6)}`}>{data.Sum6}</td>
            </tr>
            <tr>
              <th className={TH}>Ma : Mp</th>
              <td className={`${TD} ${cellClass(data.Ma_Mp)}`}>{data.Ma_Mp}</td>
              <th className={TH}>Lv2</th>
              <td className={`${TD} ${cellClass(data.Lv2)}`}>{data.Lv2}</td>
            </tr>
            <tr>
              <th className={TH}>2AB+Art+Ay</th>
              <td className={`${TD} ${cellClass(data._2AB_Art_Ay)}`}>{data._2AB_Art_Ay}</td>
              <th className={TH}>WSum6</th>
              <td className={`${TD} ${cellClass(data.WSum6_ideation)}`}>{data.WSum6_ideation}</td>
            </tr>
            <tr>
              <th className={TH}>MOR</th>
              <td className={`${TD} ${cellClass(data.MOR)}`}>{data.MOR}</td>
              <th className={TH}>M-</th>
              <td className={`${TD} ${cellClass(data.M_minus_ideation)}`}>{data.M_minus_ideation}</td>
            </tr>
            <tr>
              <td className={EMPTY_CELL} colSpan={2}></td>
              <th className={TH}>Mnone</th>
              <td className={`${TD} ${cellClass(data.Mnone)}`}>{data.Mnone}</td>
            </tr>
          </tbody>
        </table>
      </GridCard>

      {/* Cognitive Mediation Card */}
      <GridCard title="Cognitive Mediation">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            <Row label="XA%" value={data.XA_percent} />
            <Row label="WDA%" value={data.WDA_percent} />
            <Row label="X-%" value={data.X_minus_percent} />
            <Row label="S-" value={data.S_minus} />
            <Row label="P" value={data.P} />
            <Row label="X+%" value={data.X_plus_percent} />
            <Row label="Xu%" value={data.Xu_percent} />
          </tbody>
        </table>
      </GridCard>

      {/* Information Processing Card */}
      <GridCard title="Information Processing">
        <table className="w-full table-fixed border-collapse">
          <tbody>
            <Row label="Zf" value={data.Zf} />
            <Row label="W : D : Dd" value={data.W_D_Dd} />
            <Row label="W : M" value={data.W_M} />
            <Row label="Zd" value={data.Zd} />
            <Row label="PSV" value={data.PSV} />
            <Row label="DQ+" value={data.DQ_plus} />
            <Row label="DQv" value={data.DQ_v} />
          </tbody>
        </table>
      </GridCard>

      {/* Special Indices Summary Card - 3-column row */}
      <GridCard title="Special Indices">
        <SpecialIndicesSummary specialIndices={specialIndices} />
      </GridCard>
    </div>
  );
}

/** Special Indices summary: 3-column (Label, Score, Result) */
function SpecialIndicesSummary({ specialIndices }: { specialIndices?: SpecialIndicesData }) {
  const indices = [
    { name: 'PTI', key: 'PTI' },
    { name: 'DEPI', key: 'DEPI' },
    { name: 'CDI', key: 'CDI' },
    { name: 'S-CON', key: 'SCON' },
    { name: 'HVI', key: 'HVI' },
    { name: 'OBS', key: 'OBS' },
  ];

  return (
    <table className="w-full table-fixed border-collapse">
      <tbody>
        {indices.map(({ name, key }) => {
          const raw = specialIndices?.[key] || '';
          const [score, result] = typeof raw === 'string' ? raw.split(', ') : ['-', ''];
          const isPositive = result === 'Positive';
          return (
            <tr key={name}>
              <th className={TH}>{name}</th>
              <td className={`${TD} ${cellClass(score)}`}>{score}</td>
              <td className={`${TD} text-[10px] ${
                isPositive
                  ? 'text-red-600 font-bold bg-red-50'
                  : 'text-slate-400'
              }`}>
                {isPositive ? 'Positive' : result || '-'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
