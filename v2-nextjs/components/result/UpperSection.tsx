'use client';

interface UpperSectionProps {
  data: {
    Zf: number;
    ZSum: string;
    ZEst: string | number;
    Zd: string | number;
    W: number;
    D: number;
    Dd: number;
    S: number;
    dq_plus: number;
    dq_o: number;
    dq_vplus: number;
    dq_v: number;
    formQuality: Record<string, { fqx: number; mqual: number; wd: number }>;
    blends: string[][];
    detCounts: Record<string, number>;
    singleDetCounts: Record<string, number>;
    approachData: Record<string, string[]>;
    contentCounts: Record<string, number>;
    pairs: number;
    specialScoreCounts: Record<string, number>;
    sum6: number;
    wsum6: number;
    GHR: number;
    PHR: number;
  };
}

/** Zero-value gray-out: if value is 0, '-', or empty → muted style */
function cellClass(value: string | number | undefined | null): string {
  const v = value ?? '';
  if (v === 0 || v === '' || v === '-' || v === '0' || v === '0.0') {
    return 'bg-gray-50 text-gray-300';
  }
  return 'font-bold';
}

/** Common table cell styles */
const TH = 'px-1.5 py-1 text-[11px] font-normal text-left bg-slate-50 border border-gray-200';
const TD = 'px-1.5 py-1 text-[11px] text-center border border-gray-200 tabular-nums';

/** Card wrapper */
function GridCard({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`border border-gray-200 rounded bg-white flex flex-col ${className}`} style={style}>
      {children}
    </div>
  );
}

/** Card title */
function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-center py-1.5 border-b border-gray-200 flex-shrink-0">
      {children}
    </h3>
  );
}

export default function UpperSection({ data }: UpperSectionProps) {
  // WSum6 weight multipliers for display
  const WSUM6_WEIGHTS: Record<string, number> = {
    DV1: 1, INCOM1: 2, DR1: 3, FABCOM1: 4,
    DV2: 2, INCOM2: 4, DR2: 6, FABCOM2: 7,
    ALOG: 5, CONTAM: 7,
  };

  // All determinant keys for Single card
  const SINGLE_DETS = [
    'M', 'FM', 'm',
    'FC', 'CF', 'C', 'Cn',
    "FC'", "C'F", "C'",
    'FT', 'TF', 'T',
    'FV', 'VF', 'V',
    'FY', 'YF', 'Y',
    'Fr', 'rF', 'FD', 'F',
  ];

  // All content keys (27 categories)
  const ALL_CONTENTS = [
    'H', '(H)', 'Hd', '(Hd)', 'Hx',
    'A', '(A)', 'Ad', '(Ad)',
    'An', 'Art', 'Ay', 'Bl', 'Bt', 'Cg', 'Cl',
    'Ex', 'Fd', 'Fi', 'Ge', 'Hh', 'Ls', 'Na', 'Sc', 'Sx', 'Xy', 'Id',
  ];

  // Determinants for the full grid (3 rows × 8 cols)
  const DET_GRID = [
    ['M', 'FM', 'm', 'FC', 'CF', 'C', "FC'", "C'F"],
    ["C'", 'FV', 'VF', 'V', 'FT', 'TF', 'T', 'FD'],
    ['F', 'Cn', 'FY', 'YF', 'Y', 'Fr', 'rF', ''],
  ];

  const cards = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  const ss = data.specialScoreCounts;
  const W_plus_D = data.W + data.D;

  return (
    <div id="Upper_Section" className="space-y-3">
      {/* Main 26-column grid */}
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: 'repeat(26, 1fr)',
          gridTemplateRows: 'repeat(30, auto)',
        }}
      >
        {/* Location Features: col 1-4, row 1-14 */}
        <GridCard className="p-1.5" style={{ gridColumn: '1 / span 4', gridRow: '1 / span 14' } as React.CSSProperties}>
          <CardTitle>Location Features</CardTitle>
          <table className="w-full table-fixed border-collapse mt-1">
            <colgroup>
              <col className="w-[35%]" />
              <col />
            </colgroup>
            <tbody>
              {[
                ['Zf', data.Zf],
                ['ZSum', data.ZSum],
                ['ZEst', data.ZEst],
              ].map(([label, val]) => (
                <tr key={label as string}>
                  <th className={TH}>{label}</th>
                  <td className={`${TD} ${cellClass(val as string | number)}`}>{val as React.ReactNode}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-gray-200 my-1" />
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[35%]" />
              <col />
            </colgroup>
            <tbody>
              {[
                ['W', data.W],
                ['D', data.D],
                ['W+D', W_plus_D],
                ['Dd', data.Dd],
                ['S', data.S],
              ].map(([label, val]) => (
                <tr key={label as string}>
                  <th className={TH}>{label}</th>
                  <td className={`${TD} ${cellClass(val as number)}`}>{val as React.ReactNode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GridCard>

        {/* DQ: col 1-4, row 15-21 */}
        <GridCard className="p-1.5" style={{ gridColumn: '1 / span 4', gridRow: '15 / span 7' } as React.CSSProperties}>
          <CardTitle>DQ</CardTitle>
          <table className="w-full table-fixed border-collapse mt-1">
            <colgroup>
              <col className="w-[35%]" />
              <col />
            </colgroup>
            <tbody>
              {[
                ['+', data.dq_plus],
                ['o', data.dq_o],
                ['v/+', data.dq_vplus],
                ['v', data.dq_v],
              ].map(([label, val]) => (
                <tr key={label as string}>
                  <th className={TH}>{label}</th>
                  <td className={`${TD} ${cellClass(val as number)}`}>{val as React.ReactNode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GridCard>

        {/* Blends: col 5-10, row 1-21 */}
        <GridCard className="p-0" style={{ gridColumn: '5 / span 6', gridRow: '1 / span 21' } as React.CSSProperties}>
          <CardTitle>Blends</CardTitle>
          <div className="overflow-y-auto flex-grow">
            <table className="w-full table-fixed border-collapse border-t border-gray-200">
              <tbody>
                {data.blends.length > 0 ? (
                  data.blends.map((blend, i) => (
                    <tr key={i}>
                      <td className={`${TD} text-left font-bold text-[11px]`}>{blend.join('.')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className={`${TD} text-gray-300 italic`}>-</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GridCard>

        {/* Single: col 11-13, row 1-25 */}
        <GridCard className="p-1.5" style={{ gridColumn: '11 / span 3', gridRow: '1 / span 25' } as React.CSSProperties}>
          <CardTitle>Single</CardTitle>
          <table className="w-full table-fixed border-collapse mt-1">
            <colgroup>
              <col className="w-[35%]" />
              <col />
            </colgroup>
            <tbody>
              {SINGLE_DETS.map(det => {
                const count = data.singleDetCounts[det] || 0;
                return (
                  <tr key={det}>
                    <th className={TH}>{det}</th>
                    <td className={`${TD} ${cellClass(count)}`}>{count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GridCard>

        {/* Pairs: col 11-13, row 26-29 */}
        <GridCard className="p-1.5" style={{ gridColumn: '11 / span 3', gridRow: '26 / span 4' } as React.CSSProperties}>
          <CardTitle>Pairs</CardTitle>
          <table className="w-full table-fixed border-collapse mt-1">
            <colgroup>
              <col className="w-[35%]" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th className={TH}>(2)</th>
                <td className={`${TD} ${cellClass(data.pairs)}`}>{data.pairs}</td>
              </tr>
            </tbody>
          </table>
        </GridCard>

        {/* Contents: col 14-16, row 1-29 */}
        <GridCard className="p-1.5" style={{ gridColumn: '14 / span 3', gridRow: '1 / span 29' } as React.CSSProperties}>
          <CardTitle>Contents</CardTitle>
          <table className="w-full table-fixed border-collapse mt-1">
            <colgroup>
              <col className="w-[35%]" />
              <col />
            </colgroup>
            <tbody>
              {ALL_CONTENTS.map(con => {
                const count = data.contentCounts[con] || 0;
                return (
                  <tr key={con}>
                    <th className={TH}>{con}</th>
                    <td className={`${TD} ${cellClass(count)}`}>{count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GridCard>

        {/* Approach: col 17-26, row 1-11 */}
        <GridCard className="p-1.5" style={{ gridColumn: '17 / span 10', gridRow: '1 / span 11' } as React.CSSProperties}>
          <CardTitle>Approach</CardTitle>
          <table className="w-full table-fixed border-collapse mt-1">
            <colgroup>
              <col className="w-[8%]" />
              {Array.from({ length: 10 }).map((_, i) => (
                <col key={i} />
              ))}
            </colgroup>
            <tbody>
              {cards.map(card => {
                const locs = data.approachData[card] || [];
                return (
                  <tr key={card}>
                    <th className={TH}>{card}</th>
                    {Array.from({ length: 10 }).map((_, i) => {
                      const loc = locs[i] || '';
                      return (
                        <td key={i} className={`${TD} ${cellClass(loc)}`}>
                          {loc}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GridCard>

        {/* Special Scores: col 17-26, row 13-29 */}
        <GridCard className="p-1.5" style={{ gridColumn: '17 / span 10', gridRow: '13 / span 17' } as React.CSSProperties}>
          <CardTitle>Special Scores</CardTitle>
          {/* Level 1 / Level 2 table */}
          <table className="w-full table-fixed border-collapse mt-1">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[18%]" />
              <col className="w-[14%]" />
              <col className="w-[18%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead>
              <tr>
                <th className={TH}></th>
                <th className={`${TH} text-center`} colSpan={2}>Level 1</th>
                <th className={`${TH} text-center`} colSpan={2}>Level 2</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['DV', 'DV1', 'DV2'],
                ['INCOM', 'INCOM1', 'INCOM2'],
                ['DR', 'DR1', 'DR2'],
                ['FABCOM', 'FABCOM1', 'FABCOM2'],
              ].map(([label, lv1, lv2]) => {
                const n1 = ss[lv1] || 0;
                const w1 = `x${WSUM6_WEIGHTS[lv1]}`;
                const n2 = ss[lv2] || 0;
                const w2 = `x${WSUM6_WEIGHTS[lv2]}`;
                return (
                  <tr key={label}>
                    <th className={TH}>{label}</th>
                    <td className={`${TD} ${cellClass(n1)}`}>{n1}</td>
                    <td className={`${TD} text-gray-400 text-[10px]`}>{w1}</td>
                    <td className={`${TD} ${cellClass(n2)}`}>{n2}</td>
                    <td className={`${TD} text-gray-400 text-[10px]`}>{w2}</td>
                  </tr>
                );
              })}
              {/* ALOG */}
              <tr>
                <th className={TH}>ALOG</th>
                <td className={`${TD} ${cellClass(ss.ALOG || 0)}`}>{ss.ALOG || 0}</td>
                <td className={`${TD} text-gray-400 text-[10px]`}>x{WSUM6_WEIGHTS.ALOG}</td>
                <td className="border-0 bg-white" colSpan={2}></td>
              </tr>
              {/* CONTAM */}
              <tr>
                <th className={TH}>CONTAM</th>
                <td className={`${TD} ${cellClass(ss.CONTAM || 0)}`}>{ss.CONTAM || 0}</td>
                <td className={`${TD} text-gray-400 text-[10px]`}>x{WSUM6_WEIGHTS.CONTAM}</td>
                <td className="border-0 bg-white" colSpan={2}></td>
              </tr>
              {/* Sum6 / WSum6 */}
              <tr>
                <th className={`${TH} text-right`} colSpan={2}>Sum6 =</th>
                <td className={`${TD} ${cellClass(data.sum6)}`}>{data.sum6}</td>
                <th className={`${TH} text-right`}>WSum6 =</th>
                <td className={`${TD} ${cellClass(data.wsum6)}`}>{data.wsum6}</td>
              </tr>
            </tbody>
          </table>

          <div className="border-t border-gray-200 my-1" />

          {/* AB, AG, COP, MOR, CP, PER, PSV, GHR, PHR */}
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[25%]" />
              <col className="w-[25%]" />
              <col className="w-[25%]" />
              <col className="w-[25%]" />
            </colgroup>
            <tbody>
              {[
                [['AB', ss.AB || 0], ['GHR', data.GHR]],
                [['AG', ss.AG || 0], ['PHR', data.PHR]],
                [['COP', ss.COP || 0], ['MOR', ss.MOR || 0]],
                [['CP', ss.CP || 0], ['PER', ss.PER || 0]],
                [['', ''], ['PSV', ss.PSV || 0]],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map(([label, val], j) => {
                    if (label === '') {
                      return [
                        <th key={`h${j}`} className="border-0 bg-white"></th>,
                        <td key={`d${j}`} className="border-0 bg-white"></td>,
                      ];
                    }
                    const isGHR = label === 'GHR';
                    const isPHR = label === 'PHR';
                    return [
                      <th key={`h${j}`} className={TH}>{label}</th>,
                      <td key={`d${j}`} className={`${TD} ${
                        isGHR ? 'text-green-600 font-bold' :
                        isPHR ? 'text-red-500 font-bold' :
                        cellClass(val as number)
                      }`}>{val as React.ReactNode}</td>,
                    ];
                  }).flat()}
                </tr>
              ))}
            </tbody>
          </table>
        </GridCard>

        {/* Form Quality: col 1-10, row 22-29 */}
        <GridCard className="p-1.5" style={{ gridColumn: '1 / span 10', gridRow: '22 / span 8' } as React.CSSProperties}>
          <CardTitle>Form Quality</CardTitle>
          <table className="w-full table-fixed border-collapse mt-1">
            <thead>
              <tr>
                <th className={`${TH} text-left`}></th>
                <th className={`${TH} text-center`}>FQx</th>
                <th className={`${TH} text-center`}>MQual</th>
                <th className={`${TH} text-center`}>W+D</th>
              </tr>
            </thead>
            <tbody>
              {['+', 'o', 'u', '-', 'none'].map(fq => {
                const fqData = data.formQuality[fq] || { fqx: 0, mqual: 0, wd: 0 };
                return (
                  <tr key={fq}>
                    <th className={TH}>{fq}</th>
                    <td className={`${TD} ${cellClass(fqData.fqx)}`}>{fqData.fqx}</td>
                    <td className={`${TD} ${cellClass(fqData.mqual)}`}>{fqData.mqual}</td>
                    <td className={`${TD} ${cellClass(fqData.wd)}`}>{fqData.wd}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GridCard>
      </div>

      {/* Determinants Grid: full width footer */}
      <GridCard className="p-1.5">
        <CardTitle>Determinants</CardTitle>
        <table className="w-full table-fixed border-collapse mt-1">
          <tbody>
            {DET_GRID.map((row, ri) => (
              <tr key={ri}>
                {row.map((det, ci) => {
                  if (det === '') {
                    return [
                      <th key={`h${ci}`} className="border-0 bg-white"></th>,
                      <td key={`d${ci}`} className="border-0 bg-white"></td>,
                    ];
                  }
                  const count = data.detCounts[det] || 0;
                  return [
                    <th key={`h${ci}`} className={`${TH} w-[4.5%]`}>{det}</th>,
                    <td key={`d${ci}`} className={`${TD} w-[8%] ${cellClass(count)}`}>{count}</td>,
                  ];
                }).flat()}
              </tr>
            ))}
          </tbody>
        </table>
      </GridCard>
    </div>
  );
}
