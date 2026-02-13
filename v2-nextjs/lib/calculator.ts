/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Rorschach Structural Summary Calculator v2.0.0
 * Main Calculation Logic
 * 
 * Code.gs의 calculateRorschach 함수를 TypeScript로 이전
 */

import { SCORING_CONFIG } from './constants';
import { val, fix1, fix2, zestFromZf, dTable } from './utils';
import type { RorschachResponse, CalculationResult, StructuralSummary } from '@/types';

/**
 * Form Data를 RorschachResponse 배열로 파싱
 */
export function parseFormData(formData: Record<string, any>): RorschachResponse[] {
  const responses: RorschachResponse[] = [];
  const totalRows = parseInt(formData.totalRows, 10) || 20;

  for (let i = 1; i <= totalRows; i++) {
    const row: RorschachResponse = {
      card: val(formData[`card${i}`]),
      response: val(formData[`response${i}`]),
      location: val(formData[`location${i}`]),
      dq: val(formData[`dq${i}`]),
      determinants: [],
      fq: val(formData[`fq${i}`]),
      pair: val(formData[`pair${i}`]),
      contents: [],
      popular: !!formData[`pop${i}`],
      z: val(formData[`z${i}`]),
      specialScores: []
    };

    // Determinants (6개)
    for (let j = 1; j <= 6; j++) {
      const d = val(formData[`det${i}_${j}`]);
      if (d && d !== '') row.determinants.push(d);
    }

    // Contents (6개)
    for (let j = 1; j <= 6; j++) {
      const c = val(formData[`con${i}_${j}`]);
      if (c && c !== '') row.contents.push(c);
    }

    // Special Scores (8개)
    for (let j = 1; j <= 8; j++) {
      const s = val(formData[`ss${i}_${j}`]);
      if (s && s !== '') row.specialScores.push(s);
    }

    if (row.card) responses.push(row);
  }

  return responses;
}

/**
 * 메인 계산 함수
 * Code.gs의 calculateRorschach를 TypeScript로 이전
 */
export function calculateStructuralSummary(
  responses: RorschachResponse[]
): CalculationResult {
  try {
    const validResponses = responses;
    const R = validResponses.length;
    
    if (R === 0) {
      return {
        success: false,
        errors: [{ field: 'responses', message: '생성된 반응 중 채점 내용이 입력되지 않은 행이 있습니다.\n다시 한 번 확인해주세요.' }]
      };
    }

    // 헬퍼 카운터 함수 정의
    const exactCountInRow = (row: RorschachResponse, tok: string, field: 'determinants' | 'contents' | 'specialScores' = 'determinants') => {
      const arr = field === 'determinants' ? row.determinants : 
                  field === 'contents' ? row.contents : 
                  row.specialScores;
      return Array.isArray(arr) ? arr.filter(x => x === tok).length : 0;
    };

    const exactCount = (tok: string, field: 'determinants' | 'contents' | 'specialScores' = 'determinants') => {
      return validResponses.reduce((a, r) => a + exactCountInRow(r, tok, field), 0);
    };

    const countContainsAnyInRow = (row: RorschachResponse, subs: string[], field: 'determinants' | 'contents' | 'specialScores' = 'determinants') => {
      const arr = field === 'determinants' ? row.determinants : 
                  field === 'contents' ? row.contents : 
                  row.specialScores;
      return Array.isArray(arr) ? arr.filter(x => subs.some(s => String(x).includes(s))).length : 0;
    };

    const countContainsAny = (subs: readonly string[], field: 'determinants' | 'contents' | 'specialScores' = 'determinants') => {
      return validResponses.reduce((a, r) => a + countContainsAnyInRow(r, subs as string[], field), 0);
    };

    const countLoc = (vals: readonly string[]) => {
      return validResponses.filter(r => vals.includes(r.location)).length;
    };

    // Z 점수 계산
    const Zf = validResponses.filter(r => r.z && r.z !== '').length;
    const ZSum = validResponses.reduce((acc, r) => {
      const Z_TABLE = SCORING_CONFIG.TABLES.Z_SCORE;
      if (r.card && r.z && Z_TABLE[r.card as keyof typeof Z_TABLE] && 
          Z_TABLE[r.card as keyof typeof Z_TABLE][r.z as keyof typeof Z_TABLE['I']]) {
        return acc + (Z_TABLE[r.card as keyof typeof Z_TABLE][r.z as keyof typeof Z_TABLE['I']] as number);
      }
      return acc;
    }, 0);

    const _ZEst = zestFromZf(Zf, SCORING_CONFIG.TABLES.ZEST);
    const ZEst = _ZEst === null ? '-' : _ZEst;
    const Zd = (typeof ZEst === 'number') ? (ZSum - ZEst) : '-';

    // 위치(Location) 집계
    const W = countLoc(SCORING_CONFIG.CODES.LOCATION_W);
    const D_loc = countLoc(SCORING_CONFIG.CODES.LOCATION_D);
    const Dd = countLoc(SCORING_CONFIG.CODES.LOCATION_Dd);
    const S = countLoc(SCORING_CONFIG.CODES.LOCATION_S);

    // 결정인(Determinants) 집계
    const M_total = SCORING_CONFIG.CODES.HUMAN_MOVEMENT
      .reduce((sum, code) => sum + exactCount(code), 0);
    const FM_total = SCORING_CONFIG.CODES.ANIMAL_MOVEMENT
      .reduce((sum, code) => sum + exactCount(code), 0);
    const m_total = SCORING_CONFIG.CODES.INANIMATE_MOVEMENT
      .reduce((sum, code) => sum + exactCount(code), 0);
    
    const FC = exactCount('FC');
    const CF = exactCount('CF');
    const C = exactCount('C');
    const { FC_WEIGHT, CF_WEIGHT, C_WEIGHT } = SCORING_CONFIG.CRITERIA.WSUMC;
    const WSumC = (FC_WEIGHT * FC) + (CF_WEIGHT * CF) + (C_WEIGHT * C);
    
    const SumCprime = countContainsAny(SCORING_CONFIG.CODES.ACHROMATIC_COLOR);
    const SumT = countContainsAny(SCORING_CONFIG.CODES.SHADING_TEXTURE);
    const SumV = countContainsAny(SCORING_CONFIG.CODES.SHADING_VISTA);
    const SumY = countContainsAny(SCORING_CONFIG.CODES.SHADING_DIFFUSE);
    const SumShadingAll = SumCprime + SumT + SumV + SumY;

    // 핵심 비율
    const EA = M_total + WSumC;
    const es_left = FM_total + m_total;
    const es = es_left + SumShadingAll;
    const AdjEs = es - Math.max(0, m_total - 1) - Math.max(0, SumY - 1);
    
    const D_bucket = dTable(
      EA - es,
      SCORING_CONFIG.CRITERIA.D_TABLE.MIN,
      SCORING_CONFIG.CRITERIA.D_TABLE.MAX,
      SCORING_CONFIG.CRITERIA.D_TABLE.DIVISOR,
      SCORING_CONFIG.CRITERIA.D_TABLE.OFFSET
    );
    const AdjD_bucket = dTable(
      EA - AdjEs,
      SCORING_CONFIG.CRITERIA.D_TABLE.MIN,
      SCORING_CONFIG.CRITERIA.D_TABLE.MAX,
      SCORING_CONFIG.CRITERIA.D_TABLE.DIVISOR,
      SCORING_CONFIG.CRITERIA.D_TABLE.OFFSET
    );

    let EBPer: string | number = '-';
    const { DIV_BY_ZERO_FALLBACK } = SCORING_CONFIG.CRITERIA.EBPER;
    if (M_total > 0 && WSumC > 0) {
      const largerVal = Math.max(M_total, WSumC);
      const smallerVal = Math.min(M_total, WSumC);
      EBPer = fix2(largerVal / (smallerVal || DIV_BY_ZERO_FALLBACK));
    }

    // Lambda
    const F_pure = validResponses.filter(r =>
      r.determinants.length === 1 && r.determinants[0] === 'F'
    ).length;
    const Lambda = (R - F_pure) !== 0 ? (F_pure / (R - F_pure)) : 0;

    // 형태질 및 Afr
    const fq_plus_count = validResponses.filter(r => r.fq === '+').length;
    const fq_o_count = validResponses.filter(r => r.fq === 'o').length;
    const fq_u_count = validResponses.filter(r => r.fq === 'u').length;
    const fq_minus_count = validResponses.filter(r => r.fq === '-').length;

    const XA_percent = R > 0 ? ((fq_plus_count + fq_o_count + fq_u_count) / R) : 0;
    const X_plus_percent = R > 0 ? ((fq_plus_count + fq_o_count) / R) : 0;
    const Xu_percent = R > 0 ? (fq_u_count / R) : 0;
    const X_minus_percent = R > 0 ? (fq_minus_count / R) : 0;

    const WD_resps = validResponses.filter(r => 
      SCORING_CONFIG.CODES.LOCATION_WD.includes(r.location as any)
    );
    const W_plus_D = WD_resps.length;
    const W_plus_D_good_fq = WD_resps.filter(r => 
      SCORING_CONFIG.CODES.FQ_GOOD.includes(r.fq as any)
    ).length;

    const WDA_percent = W_plus_D > 0 ? (W_plus_D_good_fq / W_plus_D) : 0;
    const S_locations = validResponses.filter(r => 
      SCORING_CONFIG.CODES.LOCATION_S.includes(r.location as any)
    );
    const S_minus_count = S_locations.filter(r => r.fq === '-').length;
    const Populars = validResponses.filter(r => r.popular).length;
    
    const lastThreeCardsCount = validResponses.filter(r => 
      ['VIII', 'IX', 'X'].includes(r.card)
    ).length;
    const firstSevenCardsCount = R - lastThreeCardsCount;
    const Afr = firstSevenCardsCount > 0 ? (lastThreeCardsCount / firstSevenCardsCount) : 0;

    // GHR/PHR 분류 함수
    function classifyGPHR(r: RorschachResponse): string {
      const hasAnyContent = (arr: readonly string[]) => 
        Array.isArray(r.contents) && r.contents.some(c => arr.includes(c));
      const hasAnySS = (arr: readonly string[]) => 
        Array.isArray(r.specialScores) && r.specialScores.some(s => arr.includes(s));
      const hasAnyDet = (arr: readonly string[]) => 
        Array.isArray(r.determinants) && r.determinants.some(d => arr.includes(d));
      
      const hasHumanContent = hasAnyContent(SCORING_CONFIG.CODES.HUMAN_CONTENT_GPHR);
      const hasHumanMovement = hasAnyDet(SCORING_CONFIG.CODES.HUMAN_MOVEMENT);
      const hasAnimalMovement = hasAnyDet(SCORING_CONFIG.CODES.ANIMAL_MOVEMENT);
      const hasCopOrAg = hasAnySS(SCORING_CONFIG.CODES.COP_OR_AG);
      const isEligible = hasHumanContent || hasHumanMovement || (hasAnimalMovement && hasCopOrAg);

      if (!isEligible) return "";

      const FQ = r.fq;
      const popular = r.popular;
      const card = r.card;
      const isPureH = hasAnyContent(SCORING_CONFIG.CODES.PURE_H);
      const isGoodFQ = SCORING_CONFIG.CODES.FQ_GOOD.includes(FQ as any);
      const hasBadCognitiveSS = hasAnySS(SCORING_CONFIG.CODES.COGNITIVE_SS_BAD);
      const hasAgOrMor = hasAnySS(SCORING_CONFIG.CODES.AG_OR_MOR);

      if (isPureH && isGoodFQ && !hasBadCognitiveSS && !hasAgOrMor) {
        return "GHR";
      }

      const isBadFQ = SCORING_CONFIG.CODES.FQ_BAD.includes(FQ as any);
      const hasLevel2SS = hasAnySS(SCORING_CONFIG.CODES.LEVEL_2_SS);

      if (isBadFQ || hasLevel2SS) return "PHR";
      if (hasAnySS(['COP']) && !hasAnySS(['AG'])) return "GHR";
      if (hasAnySS(['FABCOM1', 'MOR']) || hasAnyContent(['An'])) return "PHR";
      if (popular && SCORING_CONFIG.CODES.GPHR_POPULAR_CARDS.includes(card as any)) return "GHR";
      if (hasAnySS(['AG', 'INCOM1', 'DR1']) || hasAnyContent(['Hd'])) return "PHR";

      return "GHR";
    }

    const row_calculations = validResponses.map(r => ({
      card: r.card,
      response: r.response,
      gphr: classifyGPHR(r)
    }));
    const GHR = row_calculations.filter(x => x.gphr === "GHR").length;
    const PHR = row_calculations.filter(x => x.gphr === "PHR").length;

    // 계산용 추가 변수
    const Blends_count = validResponses.filter(r => r.determinants.length > 1).length;
    const isColorDet = (d: string) => SCORING_CONFIG.CODES.CHROMATIC_COLOR.includes(d as any);
    const isShadingDet = (d: string) => SCORING_CONFIG.CODES.SHADING_ALL_CONTAINS.some(s => d.includes(s));
    const ColorShadingBlends = validResponses.filter(r =>
      r.determinants.length > 1 &&
      r.determinants.some(isColorDet) &&
      r.determinants.some(isShadingDet)
    ).length;
    const F_pairs = validResponses.filter(r => r.pair === '(2)').length;
    const Fr = exactCount('Fr', 'determinants');
    const rF = exactCount('rF', 'determinants');
    const EgocentricityIndex = (R > 0) ? (((Fr + rF) * 2 + F_pairs) / R) : 0;
    const AB = exactCount('AB', 'specialScores');
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
    const COP = exactCount('COP', 'specialScores');
    const AG = exactCount('AG', 'specialScores');
    const MOR = exactCount('MOR', 'specialScores');
    const PSV = exactCount('PSV', 'specialScores');
    const M_minus = validResponses.reduce((acc, r) => {
      if (r.fq === '-') {
        const countInRow = r.determinants.filter(det =>
          SCORING_CONFIG.CODES.HUMAN_MOVEMENT.includes(det as any)
        ).length;
        return acc + countInRow;
      }
      return acc;
    }, 0);
    const WSum6_weights_table = SCORING_CONFIG.TABLES.WSUM6_WEIGHTS;
    const WSum6 = validResponses.reduce((acc, r) => {
      if (!Array.isArray(r.specialScores)) return acc;
      return acc + r.specialScores.reduce((s, ss) => s + (WSum6_weights_table[ss as keyof typeof WSum6_weights_table] || 0), 0);
    }, 0);
    const FABCOM2 = exactCount('FABCOM2', 'specialScores');
    const Level2_count = SCORING_CONFIG.CODES.LEVEL_2_SS
      .reduce((sum, code) => sum + exactCount(code, 'specialScores'), 0);
    const FV = exactCount('FV', 'determinants');
    const VF = exactCount('VF', 'determinants');
    const V = exactCount('V', 'determinants');
    const FD = exactCount('FD', 'determinants');
    const active_dets = countContainsAny(SCORING_CONFIG.CODES.MOVEMENT_ACTIVE);
    const passive_dets = countContainsAny(SCORING_CONFIG.CODES.MOVEMENT_PASSIVE);
    const PureH = exactCount('H', 'contents');
    const Ma = exactCount('Ma') + exactCount('Ma-p');
    const Mp = exactCount('Mp') + exactCount('Ma-p');
    const Mnone = validResponses.reduce((acc, r) => {
      if (r.fq === 'none') {
        const countInRow = r.determinants.filter(det =>
          SCORING_CONFIG.CODES.HUMAN_MOVEMENT.includes(det as any)
        ).length;
        return acc + countInRow;
      }
      return acc;
    }, 0);
    
    const contentCounts: Record<string, number> = {};
    SCORING_CONFIG.CODES.ALL_CONTENTS.forEach(con => {
      contentCounts[con] = exactCount(con, 'contents');
    });
    const HumanCont = SCORING_CONFIG.CODES.HUMAN_CONTENT_ALL
      .reduce((sum, code) => sum + (contentCounts[code] || 0), 0);

    // 특수 지표 계산 (PTI, DEPI, CDI, S-CON, HVI, OBS)
    const PTI_C = SCORING_CONFIG.CRITERIA.PTI;
    const pti_criteria = {
      c1: (XA_percent < PTI_C.C1_XA_PERCENT && WDA_percent < PTI_C.C1_WDA_PERCENT),
      c2: (X_minus_percent > PTI_C.C2_X_MINUS_PERCENT),
      c3: (Level2_count > PTI_C.C3_LEVEL2_COUNT && FABCOM2 > PTI_C.C3_FABCOM2_COUNT),
      c4: ((R < PTI_C.C4_R_LOW && WSum6 > PTI_C.C4_WSUM6_LOW) || (R > PTI_C.C4_R_HIGH && WSum6 > PTI_C.C4_WSUM6_HIGH)),
      c5: (M_minus > PTI_C.C5_M_MINUS || X_minus_percent > PTI_C.C5_X_MINUS_PERCENT)
    };
    const pti_score = Object.values(pti_criteria).filter(val => val === true).length;
    const PTI_val = `${pti_score}, -`;

    const DEPI_C = SCORING_CONFIG.CRITERIA.DEPI;
    const depi_criteria = {
      c1: ((FV + VF + V > DEPI_C.C1_V_COUNT) || (FD > DEPI_C.C1_FD_COUNT)),
      c2: ((ColorShadingBlends > DEPI_C.C2_COLOR_SHADING_BLENDS) || (S > DEPI_C.C2_S_COUNT)),
      c3: ((EgocentricityIndex > DEPI_C.C3_EGO_MAX && (Fr + rF) === DEPI_C.C3_EGO_NO_REF) || (EgocentricityIndex < DEPI_C.C3_EGO_MIN)),
      c4: ((Afr < DEPI_C.C4_AFR) || (Blends_count < DEPI_C.C4_BLENDS)),
      c5: ((SumShadingAll > (FM_total + m_total)) || (SumCprime > DEPI_C.C5_SUM_C_PRIME)),
      c6: ((MOR > DEPI_C.C6_MOR) || ((2 * AB + Art + Ay) > DEPI_C.C6_INTELLECT)),
      c7: ((COP < DEPI_C.C7_COP) || (IsolateIndex > DEPI_C.C7_ISOLATE))
    };
    const depi_score = Object.values(depi_criteria).filter(val => val === true).length;
    const DEPI_val = `${depi_score}, ${depi_score >= DEPI_C.SCORE_THRESHOLD ? 'Positive' : 'NO'}`;

    const CDI_C = SCORING_CONFIG.CRITERIA.CDI;
    const cdi_criteria = {
      c1: (EA < CDI_C.C1_EA || (typeof AdjD_bucket === 'number' && AdjD_bucket < CDI_C.C1_ADJ_D)),
      c2: (COP < CDI_C.C2_COP && AG < CDI_C.C2_AG),
      c3: (WSumC < CDI_C.C3_WSUMC || Afr < CDI_C.C3_AFR),
      c4: ((passive_dets > active_dets + CDI_C.C4_PASSIVE_RATIO) || PureH < CDI_C.C4_PURE_H),
      c5: (SumT > CDI_C.C5_SUM_T || IsolateIndex > CDI_C.C5_ISOLATE || Food > CDI_C.C5_FOOD)
    };
    const cdi_score = Object.values(cdi_criteria).filter(val => val === true).length;
    const CDI_val = `${cdi_score}, ${cdi_score >= CDI_C.SCORE_THRESHOLD ? 'Positive' : 'NO'}`;

    const SCON_C = SCORING_CONFIG.CRITERIA.SCON;
    const scon_criteria = {
      c1: (FV + VF + V + FD) > SCON_C.C1_VISTA_FD,
      c2: ColorShadingBlends > SCON_C.C2_COLOR_SHADING_BLENDS,
      c3: EgocentricityIndex < SCON_C.C3_EGO_MIN || EgocentricityIndex > SCON_C.C3_EGO_MAX,
      c4: MOR > SCON_C.C4_MOR,
      c5: (typeof Zd === 'number') && (Zd < SCON_C.C5_ZD_MIN || Zd > SCON_C.C5_ZD_MAX),
      c6: es > EA,
      c7: (CF + C) > (FC + SCON_C.C7_FC_RATIO - 1),
      c8: X_plus_percent < SCON_C.C8_X_PLUS_PERCENT,
      c9: S > SCON_C.C9_S,
      c10: Populars < SCON_C.C10_P_MIN || Populars > SCON_C.C10_P_MAX,
      c11: PureH < SCON_C.C11_PURE_H,
      c12: R < SCON_C.C12_R
    };
    const scon_score = Object.values(scon_criteria).filter(val => val === true).length;
    const SCON_val = `${scon_score}, ${scon_score >= SCON_C.SCORE_THRESHOLD ? 'Positive' : 'NO'}`;

    const HVI_C = SCORING_CONFIG.CRITERIA.HVI;
    const hvi_criteria = {
      c1: SumT === HVI_C.C1_SUM_T,
      c2: Zf > HVI_C.C2_ZF,
      c3: (typeof Zd === 'number') && Zd > HVI_C.C3_ZD,
      c4: S > HVI_C.C4_S,
      c5: HumanCont > HVI_C.C5_HUMAN_CONT,
      c6: (contentCounts['(H)'] + contentCounts['(A)'] + contentCounts['(Hd)'] + contentCounts['(Ad)']) > HVI_C.C6_PAREN_CONT,
      c7: (contentCounts['Hd'] + contentCounts['Ad']) > 0 ?
        ((contentCounts['H'] + contentCounts['A']) / (contentCounts['Hd'] + contentCounts['Ad'])) < HVI_C.C7_H_HD_RATIO : false,
      c8: Cg > HVI_C.C8_CG
    };
    const hvi_sub_score = Object.keys(hvi_criteria).slice(1).reduce((acc, key) => acc + (hvi_criteria[key as keyof typeof hvi_criteria] ? 1 : 0), 0);
    const is_hvi_positive = hvi_criteria.c1 && hvi_sub_score >= HVI_C.SUB_SCORE_THRESHOLD;
    const hvi_total_checks = Object.values(hvi_criteria).filter(val => val === true).length;
    const HVI_val = `${hvi_total_checks}, ${is_hvi_positive ? 'Positive' : 'NO'}`;

    const OBS_C = SCORING_CONFIG.CRITERIA.OBS;
    const obs_criteria = {
      c1: Dd > OBS_C.C1_DD,
      c2: Zf > OBS_C.C2_ZF,
      c3: (typeof Zd === 'number') && Zd > OBS_C.C3_ZD,
      c4: Populars > OBS_C.C4_P,
      c5: fq_plus_count > OBS_C.C5_FQ_PLUS
    };
    const obs_rules = {
      r1: obs_criteria.c1 && obs_criteria.c2 && obs_criteria.c3 && obs_criteria.c4 && obs_criteria.c5,
      r2: (Object.keys(obs_criteria).slice(0, 4).reduce((acc, key) => acc + (obs_criteria[key as keyof typeof obs_criteria] ? 1 : 0), 0) >= OBS_C.R2_CRITERIA_COUNT) && (fq_plus_count > OBS_C.R2_FQ_PLUS_COUNT),
      r3: (Object.values(obs_criteria).filter(v => v).length >= OBS_C.R3_CRITERIA_COUNT) && ((X_plus_percent) > OBS_C.R3_X_PLUS_PERCENT),
      r4: (fq_plus_count > OBS_C.R4_FQ_PLUS_COUNT) && ((X_plus_percent) > OBS_C.R4_X_PLUS_PERCENT)
    };
    const obs_score = Object.values(obs_rules).filter(v => v).length;
    const is_obs_positive = obs_score > 0;
    const obs_criteria_score = Object.values(obs_criteria).filter(val => val === true).length;
    const OBS_val = `${obs_criteria_score}, ${is_obs_positive ? 'Positive' : 'NO'}`;

    // Upper Section 상세 계산
    const dq_plus = validResponses.filter(r => r.dq === '+').length;
    const dq_o = validResponses.filter(r => r.dq === 'o').length;
    const dq_vplus = validResponses.filter(r => r.dq === 'v/+').length;
    const dq_v = validResponses.filter(r => r.dq === 'v').length;

    const formQualityCalculations: Record<string, { fqx: number; mqual: number; wd: number }> = {};
    const fqTypes = SCORING_CONFIG.DEFAULTS.FQ_TYPES;
    const MQualDeterminants = SCORING_CONFIG.CODES.HUMAN_MOVEMENT;
    fqTypes.forEach(fq => {
      const responsesWithFq = validResponses.filter(r => r.fq === fq);
      const mqual_count = responsesWithFq.reduce((total, response) => {
        const matchingDetsInResponse = response.determinants.filter(det => MQualDeterminants.includes(det as any)).length;
        return total + matchingDetsInResponse;
      }, 0);

      formQualityCalculations[fq] = {
        fqx: responsesWithFq.length,
        mqual: mqual_count,
        wd: responsesWithFq.filter(r => SCORING_CONFIG.CODES.LOCATION_WD.includes(r.location as any)).length
      };
    });

    const blends = validResponses.filter(r => r.determinants.length > 1).map(r => r.determinants);

    const detCounts: Record<string, number> = {};
    SCORING_CONFIG.CODES.ALL_DETERMINANTS.forEach(det => {
      detCounts[det] = exactCount(det);
    });
    const determinantSummary = { ...detCounts };
    determinantSummary['M'] = M_total;
    determinantSummary['FM'] = FM_total;
    determinantSummary['m'] = m_total;
    
    const singleDetCounts: Record<string, number> = {};
    SCORING_CONFIG.CODES.DETERMINANTS_SINGLE.forEach(d => singleDetCounts[d] = 0);
    validResponses.filter(r => r.determinants.length === 1).forEach(r => {
      const det = r.determinants[0];
      if (SCORING_CONFIG.CODES.HUMAN_MOVEMENT.includes(det as any)) singleDetCounts['M']++;
      else if (SCORING_CONFIG.CODES.ANIMAL_MOVEMENT.includes(det as any)) singleDetCounts['FM']++;
      else if (SCORING_CONFIG.CODES.INANIMATE_MOVEMENT.includes(det as any)) singleDetCounts['m']++;
      else if (singleDetCounts.hasOwnProperty(det)) singleDetCounts[det]++;
    });

    const approachData: Record<string, string[]> = {};
    SCORING_CONFIG.DEFAULTS.CARD_ORDER.forEach(card => approachData[card] = []);
    validResponses.forEach(r => {
      if (r.card && approachData[r.card]) {
        approachData[r.card].push(r.location);
      }
    });

    const specialScoreCounts = {
      DV1: exactCount('DV1', 'specialScores'),
      INCOM1: exactCount('INCOM1', 'specialScores'),
      DR1: exactCount('DR1', 'specialScores'),
      FABCOM1: exactCount('FABCOM1', 'specialScores'),
      DV2: exactCount('DV2', 'specialScores'),
      INCOM2: exactCount('INCOM2', 'specialScores'),
      DR2: exactCount('DR2', 'specialScores'),
      FABCOM2: exactCount('FABCOM2', 'specialScores'),
      ALOG: exactCount('ALOG', 'specialScores'),
      CONTAM: exactCount('CONTAM', 'specialScores'),
      AB, AG, COP, MOR,
      CP: exactCount('CP', 'specialScores'),
      PER: exactCount('PER', 'specialScores'),
      PSV
    };
    const sum6 = specialScoreCounts.DV1 + specialScoreCounts.INCOM1 + specialScoreCounts.DR1 + specialScoreCounts.FABCOM1 + 
                 specialScoreCounts.DV2 + specialScoreCounts.INCOM2 + specialScoreCounts.DR2 + specialScoreCounts.FABCOM2 + 
                 specialScoreCounts.ALOG + specialScoreCounts.CONTAM;

    // 최종 결과 객체 패키징 (Code.gs의 resultData 구조와 동일하게)
    // 타입은 나중에 더 정확하게 정의할 예정
    const resultData: any = {
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
        sum6, wsum6: WSum6,
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
        WSum6_ideation: WSum6,
        M_minus_ideation: M_minus,
        Mnone: Mnone,
        FC_CF_C: `${FC} : ${CF + C}`,
        PureC: C,
        SumC_WSumC: `${SumCprime} : ${fix1(WSumC)}`,
        S_aff: S,
        Blends_R: `${Blends_count} : ${R}`,
        CP: exactCount('CP', 'specialScores'),
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

    return {
      success: true,
      data: resultData as StructuralSummary
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      errors: [{ field: 'calculation', message: errorMessage }]
    };
  }
}

