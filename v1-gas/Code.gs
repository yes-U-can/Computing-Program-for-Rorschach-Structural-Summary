/**
 * =================================================================================
 * 로샤 구조 요약지 계산 프로그램 (Computing Program for Rorschach Structural Summary)
 * =================================================================================
 *
 * 본 스크립트는 서울임상심리연구소(SICP)에 의해 개발되었습니다.
 * 저작권은 서울임상심리연구소에 귀속되어 있으나, 임상심리학 분야의 발전과
 * 전문가들의 원활한 업무를 돕기 위한 공익적 목적으로 본 코드를 공개합니다.
 *
 * This script was developed by the Seoul Institute of Clinical Psychology (SICP).
 * While the copyright is owned by SICP, this code is released for the public good
 * to contribute to the advancement of clinical psychology and to assist professionals.
 *
 * ---------------------------------------------------------------------------------
 *
 * MIT License
 * Copyright (c) 2025 서울임상심리연구소 (Seoul Institute of Clinical Psychology, SICP)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * ---------------------------------------------------------------------------------
 * @author      서울임상심리연구소 (SICP)
 * @address     서울시 종로구 숭인동 1245번지 3층
 * @created     2025-10
 * =================================================================================
 */


function doGet() {
  return HtmlService.createHtmlOutputFromFile('index.html')
    .setTitle('Rorschach Scoring')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

/* =========================
 * ZEst 테이블 (Perl과 동일)
 * Zf = 1..50만 유효, Zf=1은 '-'(null) 취급
 * ========================= */
function zestFromZf(zf) {
  if (typeof zf !== 'number' || !Number.isFinite(zf)) return null;
  if (zf < 1 || zf > 50) return null;
  const TABLE = [
    null,   2.5,   6.0,  10.0,  13.5,  17.0,  20.5,  24.0,  27.5,  31.0,
    34.5,  38.0,  41.5,  45.5,  49.0,  52.5,  56.0,  59.5,  63.0,  66.5,
    70.0,  73.5,  77.0,  81.0,  84.5,  88.0,  91.5,  95.0,  98.5, 102.5,
    105.5, 109.5, 112.5, 116.5, 120.0, 123.5, 127.0, 130.5, 134.0, 137.5,
    141.0, 144.5, 148.0, 152.0, 155.5, 159.0, 162.5, 166.0, 169.5, 173.0
  ];
  return TABLE[zf - 1];
}

/* =========================
 * D 테이블 (Perl d_table)
 * 입력: EA - es (또는 EA - Adj es), 범위: -15..+15
 * ========================= */
function dTable(x) {
  if (x < -15) return -5; // Per original logic, should not throw error but cap at min/max
  if (x >  15) return 5;
  if (typeof x !== 'number' || !Number.isFinite(x)) return '-'; // Handle non-numeric inputs
  if (x >= 0) return Math.trunc((x - 0.25) / 2.5);
  return -Math.trunc(((-x) - 0.25) / 2.5);
}


/* =========================
 * 유틸
 * ========================= */
function val(x) { if (x === null || x === undefined) return ''; const t = String(x).trim(); return t === '' ? '' : t; }
function fix1(n) { return Number(n).toFixed(1); }
function fix2(n) { return Number(n).toFixed(2); }

function calculateRorschach(formData) {
  try {
    // -----------------------------
    // 1) 입력 파싱
    // -----------------------------
    const responses = [];
    for (let i = 1; i <= 20; i++) {
      const row = {
        card:           val(formData[`card${i}`]),
        location:       val(formData[`location${i}`]),
        dq:             val(formData[`dq${i}`]),
        determinants: [],
        fq:             val(formData[`fq${i}`]),
        contents:       [],
        special_scores: [],
        z:              val(formData[`z${i}`]),
        pair:           val(formData[`pair${i}`]),
        popular:        !!formData[`pop${i}`]
      };
      for (let j = 1; j <= 6; j++) {
        const d = val(formData[`det${i}_${j}`]);
        const c = val(formData[`con${i}_${j}`]);
        const s = val(formData[`ss${i}_${j}`]);
        if (d) row.determinants.push(d);
        if (c) row.contents.push(c);
        if (s) row.special_scores.push(s);
      }
      if (row.card) responses.push(row);
    }

    const validResponses = responses;
    const R = validResponses.length;
    if (R === 0) return { success: false, error: 'No responses entered.' };

    // -----------------------------
    // 2) 헬퍼 계수기
    // -----------------------------
    const exactCountInRow = (row, tok, field = 'determinants') =>
      (Array.isArray(row[field]) ? row[field].filter(x => x === tok).length : 0);
    const exactCount = (tok, field='determinants') =>
      validResponses.reduce((a, r) => a + exactCountInRow(r, tok, field), 0);

    const countContainsAnyInRow = (row, subs, field='determinants') =>
      (Array.isArray(row[field]) ? row[field].filter(x => subs.some(s => String(x).includes(s))).length : 0);
    const countContainsAny = (subs, field='determinants') =>
      validResponses.reduce((a, r) => a + countContainsAnyInRow(r, subs, field), 0);

    const countLoc = (vals) => validResponses.filter(r => vals.includes(r.location)).length;

    // -----------------------------
    // 3) Zf / ZSum / ZEst / Zd
    // -----------------------------
    const Z_SCORE_TABLE = {
        "I":   {"ZW": 1.0, "ZA": 4.0, "ZD": 6.0, "ZS": 3.5},
        "II":  {"ZW": 4.5, "ZA": 3.0, "ZD": 5.5, "ZS": 4.5},
        "III": {"ZW": 5.5, "ZA": 3.0, "ZD": 4.0, "ZS": 4.5},
        "IV":  {"ZW": 2.0, "ZA": 4.0, "ZD": 3.5, "ZS": 5.0},
        "V":   {"ZW": 1.0, "ZA": 2.5, "ZD": 5.0, "ZS": 4.0},
        "VI":  {"ZW": 2.5, "ZA": 2.5, "ZD": 6.0, "ZS": 6.5},
        "VII": {"ZW": 2.5, "ZA": 1.0, "ZD": 3.0, "ZS": 4.0},
        "VIII":{"ZW": 4.5, "ZA": 3.0, "ZD": 3.0, "ZS": 4.0},
        "IX":  {"ZW": 5.5, "ZA": 2.5, "ZD": 4.5, "ZS": 5.0},
        "X":   {"ZW": 5.5, "ZA": 4.0, "ZD": 4.5, "ZS": 6.0}
    };
    
    const Zf = validResponses.filter(r => r.z).length;

    const ZSum = validResponses.reduce((acc, r) => {
        if (r.card && r.z && Z_SCORE_TABLE[r.card] && Z_SCORE_TABLE[r.card][r.z]) {
            return acc + Z_SCORE_TABLE[r.card][r.z];
        }
        return acc;
    }, 0);

    const _ZEst = zestFromZf(Zf);
    const ZEst  = (_ZEst === null ? '-' : _ZEst);
    const Zd    = (typeof ZEst === 'number') ? (ZSum - ZEst) : '-';

    // -----------------------------
    // 4) Location 집계
    // -----------------------------
    const W     = countLoc(['W', 'WS']);
    const D_loc = countLoc(['D', 'DS']);
    const Dd    = countLoc(['Dd', 'DdS']);
    const S     = countLoc(['S', 'WS', 'DS', 'DdS']);

    // -----------------------------
    // 5) 결정자 / 색채 / 셰이딩 (수정됨)
    // -----------------------------
    const M_total = exactCount('M') + exactCount('Ma') + exactCount('Mp') + exactCount('Ma-p');
    const FM_total = exactCount('FM') + exactCount('FMa') + exactCount('FMp') + exactCount('FMa-p');
    const m_total = exactCount('m') + exactCount('ma') + exactCount('mp') + exactCount('ma-p');

    const FC  = exactCount('FC');
    const CF  = exactCount('CF');
    const C   = exactCount('C');
    const WSumC = 0.5 * FC + 1.0 * CF + 1.5 * C;

    const SumCprime = countContainsAny(["C'"]);
    const SumT      = countContainsAny(['T']);
    const SumV      = countContainsAny(['V']);
    const SumY      = countContainsAny(['Y']);
    const SumShadingAll = SumCprime + SumT + SumV + SumY;

    // -----------------------------
    // 6) EA / es / Adj es / D / Adj D (수정됨)
    // -----------------------------
    const EA    = M_total + WSumC;
    const es_left = FM_total + m_total;
    const es    = es_left + SumShadingAll;
    const AdjEs = es - Math.max(0, m_total - 1) - Math.max(0, SumY - 1);

    const D_bucket    = dTable(EA - es);
    const AdjD_bucket = dTable(EA - AdjEs);
    
    let EBPer = '-';
    if (M_total > 0 || WSumC > 0) {
      if (M_total / (WSumC || 1) > 2.5 && EA >= 4.0 ) { // Handle WSumC=0 case
          EBPer = M_total / (WSumC || 0.0001); // Avoid division by zero, but show large number
      } else if (WSumC / (M_total || 1) > 2.5 && EA >= 4.0) {
          EBPer = WSumC / (M_total || 0.0001);
      }
      if (typeof EBPer === 'number') {
        EBPer = fix2(EBPer);
      }
    }
    
    // -----------------------------
    // 7) Lambda
    // -----------------------------
    const F_pure = validResponses.filter(r =>
      r.determinants.length === 1 &&
      r.determinants[0] === 'F'
    ).length;
    const Lambda = (R - F_pure) !== 0 ? (F_pure / (R - F_pure)) : 0;

    // -----------------------------
    // 8) Afr, X%, WDA%, X-%, S-%
    // -----------------------------
    const fq_plus_count = validResponses.filter(r => r.fq === '+').length;
    const fq_o_count = validResponses.filter(r => r.fq === 'o').length;
    const fq_u_count = validResponses.filter(r => r.fq === 'u').length;
    const fq_minus_count = validResponses.filter(r => r.fq === '-').length;

    const XA_percent = R > 0 ? ((fq_plus_count + fq_o_count + fq_u_count) / R) : 0; // 진짜 XA%
    const X_plus_percent = R > 0 ? ((fq_plus_count + fq_o_count) / R) : 0;
    const Xu_percent = R > 0 ? (fq_u_count / R) : 0; // Xu%
    const X_minus_percent = R > 0 ? (fq_minus_count / R) : 0;

    const WD_resps = validResponses.filter(r => ['W','WS','D','DS'].includes(r.location));
    const W_plus_D = WD_resps.length;
    const W_plus_D_good_fq = WD_resps.filter(r => ['+','o','u'].includes(r.fq)).length;
    const WDA_percent = W_plus_D > 0 ? (W_plus_D_good_fq / W_plus_D) : 0;

    const S_locations = validResponses.filter(r => ['S','WS','DS','DdS'].includes(r.location));
    const S_minus_count = S_locations.filter(r => r.fq === '-').length;
    
    const Populars = validResponses.filter(r => r.popular).length; // P (Popular) 개수

    const lastThreeCardsCount = validResponses.filter(r => ['VIII','IX','X'].includes(r.card)).length;
    const firstSevenCardsCount = R - lastThreeCardsCount;
    const Afr = firstSevenCardsCount > 0 ? (lastThreeCardsCount / firstSevenCardsCount) : 0;

    // -----------------------------
    // 9) GHR / PHR 분류
    // -----------------------------
    function classifyGPHR(r) {
        const hasAnyContent = (arr) => Array.isArray(r.contents) && r.contents.some(c => arr.includes(c));
        const hasAnySS = (arr) => Array.isArray(r.special_scores) && r.special_scores.some(s => arr.includes(s));
        const hasAnyDet = (arr) => Array.isArray(r.determinants) && r.determinants.some(d => arr.includes(d));

        const hasHumanContent = hasAnyContent(["H", "(H)", "Hd", "(Hd)", "Hx"]);
        const hasHumanMovement = hasAnyDet(["M", "Ma", "Mp", "Ma-p"]);
        const hasAnimalMovement = hasAnyDet(["FMa", "FMp", "FMa-p"]);
        const hasCopOrAg = hasAnySS(["COP", "AG"]);

        const isEligible = hasHumanContent || hasHumanMovement || (hasAnimalMovement && hasCopOrAg);
        if (!isEligible) { return ""; }

        const FQ = r.fq;
        const popular = r.popular;
        const card = r.card;
        const isPureH = hasAnyContent(['H']);
        const isGoodFQ = ['+', 'o', 'u'].includes(FQ);
        const hasBadCognitiveSS = hasAnySS(['DR1', 'DR2', 'INCOM1', 'INCOM2', 'FABCOM1', 'FABCOM2', 'ALOG', 'CONTAM']);
        const hasAgOrMor = hasAnySS(['AG', 'MOR']);
        if (isPureH && isGoodFQ && !hasBadCognitiveSS && !hasAgOrMor) { return "GHR"; }

        const isBadFQ = FQ === '-' || FQ === 'none';
        const hasLevel2SS = hasAnySS(['ALOG', 'CONTAM', 'DV2', 'INCOM2', 'DR2', 'FABCOM2']);
        if (isBadFQ || hasLevel2SS) { return "PHR"; }

        if (hasAnySS(['COP']) && !hasAnySS(['AG'])) { return "GHR"; }

        if (hasAnySS(['FABCOM1', 'MOR']) || hasAnyContent(['An'])) { return "PHR"; }

        if (popular && ['III', 'IV', 'VII', 'IX'].includes(card)) { return "GHR"; }
        
        if (hasAnySS(['AG', 'INCOM1', 'DR1']) || hasAnyContent(['Hd'])) { return "PHR"; }

        return "GHR";
    }

    const row_calculations = validResponses.map(r => ({ gphr: classifyGPHR(r) }));
    const GHR = row_calculations.filter(x => x.gphr === "GHR").length;
    const PHR = row_calculations.filter(x => x.gphr === "PHR").length;
    
    // -----------------------------
    // 9.5) 특수 지표 계산용 추가 변수
    // -----------------------------
    const Blends_count = validResponses.filter(r => r.determinants.length > 1).length;
    const isColorDet = (d) => ['FC', 'CF', 'C'].includes(d);
    const isShadingDet = (d) => d.includes('C\'') || d.includes('T') || d.includes('V') || d.includes('Y');
    const ColorShadingBlends = validResponses.filter(r => 
        r.determinants.length > 1 &&
        r.determinants.some(isColorDet) &&
        r.determinants.some(isShadingDet)
    ).length;

    const F_pairs = validResponses.filter(r => r.pair === '(2)').length; 
    const Fr = exactCount('Fr', 'determinants');
    const rF = exactCount('rF', 'determinants');
    const EgocentricityIndex = (R > 0) ? (((Fr + rF) * 2 + F_pairs) / R) : 0; 
    
    const AB = exactCount('AB', 'special_scores');
    const Art = exactCount('Art', 'contents');
    const Ay = exactCount('Ay', 'contents');

    const Bt = exactCount('Bt', 'contents');
    const Cl = exactCount('Cl', 'contents');
    const Ge = exactCount('Ge', 'contents');
    const Ls = exactCount('Ls', 'contents');
    const Na = exactCount('Na', 'contents');
    const IsolateIndex = (R > 0) ? ((Bt + 2 * Cl + Ge + Ls + 2 * Na) / R) : 0;
    
    const Food = exactCount('Fd', 'contents');
    
    const Cg = exactCount('Cg', 'contents');

    // -----------------------------
    // 10) Special Indices
    // -----------------------------
    const COP = exactCount('COP', 'special_scores');
    const AG  = exactCount('AG',  'special_scores');
    const MOR = exactCount('MOR', 'special_scores');
    const PSV = exactCount('PSV', 'special_scores');

    const M_minus = validResponses.reduce((acc, r) => {
        if (r.fq === '-') {
            const mDeterminants = ['M', 'Ma', 'Mp', 'Ma-p']; // Original M- includes M
            const countInRow = r.determinants.filter(det => mDeterminants.includes(det)).length;
            return acc + countInRow;
        }
        return acc;
    }, 0);
    const WSum6_weights = { DV1: 1, INCOM1: 2, DR1: 3, FABCOM1: 4, DV2: 2, INCOM2: 4, DR2: 6, FABCOM2: 7, ALOG: 5, CONTAM: 7 };
    const WSum6 = validResponses.reduce((acc, r) => {
      if (!Array.isArray(r.special_scores)) return acc;
      return acc + r.special_scores.reduce((s, ss) => s + (WSum6_weights[ss] || 0), 0);
    }, 0);
    const FABCOM2 = exactCount('FABCOM2', 'special_scores');
    const Level2_count = exactCount('DV2', 'special_scores') + exactCount('INCOM2', 'special_scores') + exactCount('DR2', 'special_scores') + FABCOM2;

    const FV = exactCount('FV', 'determinants');
    const VF = exactCount('VF', 'determinants');
    const V = exactCount('V', 'determinants');
    const FD = exactCount('FD', 'determinants');
    
    const active_dets  = countContainsAny(['Ma','FMa','ma']);
    const passive_dets = countContainsAny(['Mp','FMp','mp']);
    const PureH = exactCount('H', 'contents');
    const Ma = exactCount('Ma') + exactCount('Ma-p');
    const Mp = exactCount('Mp') + exactCount('Ma-p');
    const Mnone = validResponses.filter(r => r.fq === 'none' && countContainsAnyInRow(r, ['M','Ma','Mp','Ma-p']) > 0).length;
    
    const contentCounts = {};
    const allContents = ["H", "(H)", "Hd", "(Hd)", "Hx", "A", "(A)", "Ad", "(Ad)", "An", "Art", "Ay", "Bl", "Bt", "Cg", "Cl", "Ex", "Fd", "Fi", "Ge", "Hh", "Ls", "Na", "Sc", "Sx", "Xy", "Id"];
    allContents.forEach(con => {
        contentCounts[con] = exactCount(con, 'contents');
    });
    const HumanCont = contentCounts['H'] + contentCounts['(H)'] + contentCounts['Hd'] + contentCounts['(Hd)'];

    // --- PTI ---
    const pti_criteria = {
        c1: (XA_percent < 0.70 && WDA_percent < 0.75),
        c2: (X_minus_percent > 0.29),
        c3: (Level2_count > 2 && FABCOM2 > 0),
        c4: ((R < 17 && WSum6 > 12) || (R > 16 && WSum6 > 17)),
        c5: (M_minus > 1 || X_minus_percent > 0.40)
    };
    const pti_score = Object.values(pti_criteria).filter(val => val === true).length;
    const PTI_val = `${pti_score}, -`; // MODIFIED

    // --- DEPI ---
    const depi_criteria = {
        c1: ((FV + VF + V > 0) || (FD > 2)),
        c2: ((ColorShadingBlends > 0) || (S > 2)),
        c3: ((EgocentricityIndex > 0.44 && (Fr + rF) === 0) || (EgocentricityIndex < 0.33)),
        c4: ((Afr < 0.46) || (Blends_count < 4)),
        c5: ((SumShadingAll > (FM_total + m_total)) || (SumCprime > 2)),
        c6: ((MOR > 2) || ((2 * AB + Art + Ay) > 3)),
        c7: ((COP < 2) || (IsolateIndex > 0.24))
    };
    const depi_score = Object.values(depi_criteria).filter(val => val === true).length;
    const DEPI_val = `${depi_score}, ${depi_score >= 5 ? 'Positive' : 'NO'}`; // MODIFIED

    // --- CDI ---
    const cdi_criteria = {
        c1: (EA < 6 || AdjD_bucket < 0),
        c2: (COP < 2 && AG < 2),
        c3: (WSumC < 2.5 || Afr < 0.46),
        c4: ((passive_dets > active_dets + 1) || PureH < 2),
        c5: (SumT > 1 || IsolateIndex > 0.24 || Food > 0)
    };
    const cdi_score = Object.values(cdi_criteria).filter(val => val === true).length;
    const CDI_val = `${cdi_score}, ${cdi_score >= 4 ? 'Positive' : 'NO'}`; // MODIFIED

    // --- S-CON ---
    const scon_criteria = {
        c1: (FV + VF + V + FD) > 2,
        c2: ColorShadingBlends > 0,
        c3: EgocentricityIndex < 0.31 || EgocentricityIndex > 0.44,
        c4: MOR > 3,
        c5: (typeof Zd === 'number') && (Zd < -3.5 || Zd > 3.5),
        c6: es > EA,
        c7: (CF + C) > FC,
        c8: X_plus_percent < 0.70,
        c9: S > 3,
        c10: Populars < 3 || Populars > 8,
        c11: PureH < 2,
        c12: R < 17
    };
    const scon_score = Object.values(scon_criteria).filter(val => val === true).length;
    const SCON_val = `${scon_score}, ${scon_score >= 8 ? 'Positive' : 'NO'}`; // MODIFIED
    
    // --- HVI ---
    const hvi_criteria = {
        c1: SumT === 0,
        c2: Zf > 12,
        c3: (typeof Zd === 'number') && Zd > 3.0,
        c4: S > 3,
        c5: HumanCont > 6,
        c6: (contentCounts['(H)'] + contentCounts['(A)'] + contentCounts['(Hd)'] + contentCounts['(Ad)']) > 3,
        c7: (contentCounts['Hd'] + contentCounts['Ad']) > 0 ? ((contentCounts['H'] + contentCounts['A']) / (contentCounts['Hd'] + contentCounts['Ad'])) < 4 : false,
        c8: Cg > 3
    };
    const hvi_sub_score = Object.keys(hvi_criteria).slice(1).reduce((acc, key) => acc + (hvi_criteria[key] ? 1 : 0), 0);
    const is_hvi_positive = hvi_criteria.c1 && hvi_sub_score >= 4;
    const HVI_val = `${hvi_sub_score}, ${is_hvi_positive ? 'Positive' : 'NO'}`; // MODIFIED

    // --- OBS ---
    const obs_criteria = {
        c1: Dd > 3,
        c2: Zf > 12,
        c3: (typeof Zd === 'number') && Zd > 3.0,
        c4: Populars > 7,
        c5: fq_plus_count > 1
    };
    const obs_rules = {
        r1: obs_criteria.c1 && obs_criteria.c2 && obs_criteria.c3 && obs_criteria.c4 && obs_criteria.c5,
        r2: (Object.keys(obs_criteria).slice(0, 4).reduce((acc, key) => acc + (obs_criteria[key] ? 1 : 0), 0) >= 2) && (fq_plus_count > 3),
        r3: (Object.values(obs_criteria).filter(v => v).length >= 3) && ((X_plus_percent) > 0.89), // Corrected: XA%+X+% > .89 is likely X+% > .89
        r4: (fq_plus_count > 3) && ((X_plus_percent) > 0.89)
    };
    const obs_score = Object.values(obs_rules).filter(v => v).length;
    const is_obs_positive = obs_score > 0;
    const OBS_val = `${obs_score}, ${is_obs_positive ? 'Positive' : 'NO'}`; // MODIFIED

    // =================================================================
    // 10.5) Upper Section 상세 계산
    // =================================================================
    const dq_plus = validResponses.filter(r => r.dq === '+').length;
    const dq_o = validResponses.filter(r => r.dq === 'o').length;
    const dq_vplus = validResponses.filter(r => r.dq === 'v/+').length;
    const dq_v = validResponses.filter(r => r.dq === 'v').length;

    const formQualityCalculations = {};
    const fqTypes = ['+', 'o', 'u', '-', 'none'];
    const MQualMinusDeterminants = ['Ma', 'Mp', 'Ma-p']; 

    fqTypes.forEach(fq => {
        const responsesWithFq = validResponses.filter(r => r.fq === fq);
        const mqual_count = responsesWithFq.reduce((total, response) => {
            const matchingDetsInResponse = response.determinants.filter(det => MQualMinusDeterminants.includes(det)).length;
            return total + matchingDetsInResponse;
        }, 0);
        formQualityCalculations[fq] = {
            fqx: responsesWithFq.length,
            mqual: mqual_count,
            wd: responsesWithFq.filter(r => ['W', 'WS', 'D', 'DS'].includes(r.location)).length
        };
    });

    const blends = validResponses.filter(r => r.determinants.length > 1).map(r => r.determinants);

    const detCounts = {};
    const allDeterminants = ["C","C'","CF","C'F","Cn","F","FC","FC'","FD","FM","FMa","FMa-p","FMp","FT","FV","FY","Fr","M","Ma","Ma-p","Mp","T","TF","V","VF","Y","YF","m","ma","ma-p","mp","rF"];
    allDeterminants.forEach(det => {
        detCounts[det] = exactCount(det);
    });

    const determinantSummary = { ...detCounts };
    determinantSummary['M'] = M_total;
    determinantSummary['FM'] = FM_total;
    determinantSummary['m'] = m_total;

    const singleDetCounts = {};
    const singleDeterminantTypes = ["M", "FM", "m", "FC", "CF", "C", "Cn", "FC'", "C'F", "C'", "FT", "TF", "T", "FV", "VF", "V", "FY", "YF", "Y", "Fr", "rF", "FD", "F"];
    singleDeterminantTypes.forEach(d => singleDetCounts[d] = 0);

    validResponses.filter(r => r.determinants.length === 1).forEach(r => {
        const det = r.determinants[0];
        if (['M', 'Ma', 'Mp', 'Ma-p'].includes(det)) singleDetCounts['M']++;
        else if (['FM', 'FMa', 'FMp', 'FMa-p'].includes(det)) singleDetCounts['FM']++;
        else if (['m', 'ma', 'mp', 'ma-p'].includes(det)) singleDetCounts['m']++;
        else if (singleDetCounts.hasOwnProperty(det)) singleDetCounts[det]++;
    });

    const approachData = {};
    const cardOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    cardOrder.forEach(card => approachData[card] = []);

    validResponses.forEach(r => {
        if (r.card && approachData[r.card]) {
            approachData[r.card].push(r.location);
        }
    });

    const specialScoreCounts = {
        DV1: exactCount('DV1', 'special_scores'),
        INCOM1: exactCount('INCOM1', 'special_scores'),
        DR1: exactCount('DR1', 'special_scores'),
        FABCOM1: exactCount('FABCOM1', 'special_scores'),
        DV2: exactCount('DV2', 'special_scores'),
        INCOM2: exactCount('INCOM2', 'special_scores'),
        DR2: exactCount('DR2', 'special_scores'),
        FABCOM2: exactCount('FABCOM2', 'special_scores'),
        ALOG: exactCount('ALOG', 'special_scores'),
        CONTAM: exactCount('CONTAM', 'special_scores'),
        AB: AB, AG: AG, COP: COP, MOR: MOR,
        CP: exactCount('CP', 'special_scores'),
        PER: exactCount('PER', 'special_scores'),
        PSV: PSV
    };

    const sum6 = specialScoreCounts.DV1 + specialScoreCounts.INCOM1 + specialScoreCounts.DR1 + specialScoreCounts.FABCOM1 + specialScoreCounts.DV2 + specialScoreCounts.INCOM2 + specialScoreCounts.DR2 + specialScoreCounts.FABCOM2 + specialScoreCounts.ALOG + specialScoreCounts.CONTAM;
    const wsum6_val = (specialScoreCounts.DV1 * 1) + (specialScoreCounts.INCOM1 * 2) + (specialScoreCounts.DR1 * 3) + (specialScoreCounts.FABCOM1 * 4) + (specialScoreCounts.DV2 * 2) + (specialScoreCounts.INCOM2 * 4) + (specialScoreCounts.DR2 * 6) + (specialScoreCounts.FABCOM2 * 7) + (specialScoreCounts.ALOG * 5) + (specialScoreCounts.CONTAM * 7);

    // -----------------------------
    // 11) 결과 패키징
    // -----------------------------
    const resultData = {
      upper_section: {
        Zf, ZSum: fix1(ZSum), ZEst: (typeof ZEst === 'number' ? fix1(ZEst) : '-'), Zd: (typeof Zd === 'number' ? fix1(Zd) : '-'),
        W, D: D_loc, Dd, S,
        dq_plus, dq_o, dq_vplus, dq_v,
        formQuality: formQualityCalculations,
        blends,
        detCounts: determinantSummary,
        singleDetCounts,
        approachData,
        contentCounts,
        pairs: F_pairs,
        specialScoreCounts,
        sum6, wsum6: wsum6_val,
        GHR, PHR
      },
      lower_section: {
        R, 
        Lambda: fix2(Lambda), 
        EB: `${M_total}:${fix1(WSumC)}`,
        EA: fix1(EA),
        EBPer: EBPer,
        eb: `${es_left}:${SumShadingAll}`,
        es: fix1(es),
        AdjEs: fix1(AdjEs),
        D: D_bucket,
        AdjD: AdjD_bucket,
        FM: FM_total,
        m: m_total,
        SumCprime: SumCprime,
        SumT: SumT,
        SumV: SumV,
        SumY: SumY,
        Afr: fix2(Afr),
        XA_percent: fix2(XA_percent),
        WDA_percent: fix2(WDA_percent),
        X_minus_percent: fix2(X_minus_percent),
        S_minus: S_minus_count,
        P: Populars,
        X_plus_percent: fix2(X_plus_percent),
        Xu_percent: fix2(Xu_percent),
        Zf: Zf,
        Zd: (typeof Zd === 'number' ? fix1(Zd) : '-'),
        PSV: PSV,
        DQ_plus: dq_plus,
        DQ_v: dq_v,
        W_D_Dd: `${W}:${D_loc}:${Dd}`,
        W_M: `${W}:${M_total}`,
        a_p: `${active_dets} : ${passive_dets}`,
        Ma_Mp: `${Ma} : ${Mp}`,
        _2AB_Art_Ay: 2 * AB + Art + Ay,
        MOR: MOR,
        Sum6: sum6,
        Lv2: Level2_count,
        WSum6_ideation: wsum6_val,
        M_minus_ideation: M_minus,
        Mnone: Mnone,
        FC_CF_C: `${FC} : ${CF + C}`,
        PureC: C,
        SumC_WSumC: `${SumCprime} : ${fix1(WSumC)}`,
        S_aff: S,
        Blends_R: `${Blends_count} : ${R}`,
        CP: exactCount('CP', 'special_scores'),
        _3r_2_R: fix2(EgocentricityIndex),
        Fr_rF: Fr + rF,
        SumV_self: SumV,
        FD: FD,
        An_Xy: contentCounts['An'] + contentCounts['Xy'],
        MOR_self: MOR,
        H_ratio: `${PureH} : ${contentCounts['(H)'] + contentCounts['Hd'] + contentCounts['(Hd)']}`,
        COP: COP,
        AG: AG,
        a_p_inter: `${active_dets} : ${passive_dets}`,
        Food: Food,
        SumT_inter: SumT,
        HumanCont: HumanCont,
        PureH: PureH,
        PER: specialScoreCounts.PER,
        ISO_Index: fix2(IsolateIndex)
      },
      special_indices: {
        PTI: PTI_val, pti_criteria,
        DEPI: DEPI_val, depi_criteria,
        CDI: CDI_val, cdi_criteria,
        SCON: SCON_val, scon_criteria,
        HVI: HVI_val, hvi_criteria,
        OBS: OBS_val, obs_criteria, obs_rules,
        GHR, PHR
      },
      row_calculations
    };

    return { success: true, results: resultData };
  } catch (e) {
    // 에러 발생 시 로그를 남겨서 디버깅을 돕습니다.
    Logger.log(`ERROR in calculateRorschach: ${e.toString()} at line ${e.lineNumber}. Stack: ${e.stack}`);
    return { success: false, error: e && e.lineNumber ? `${e.toString()} (line ${e.lineNumber})` : String(e) };
  }
}