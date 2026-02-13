import { Category, InfoCategory, InfoNode } from '@/types';

/**
 * Rorschach Structural Summary Calculator v2.0.0
 * Constants and Configuration
 * 
 * Code.gs의 SCORING_CONFIG를 TypeScript로 이전
 */

export const DOC_STRUCTURE: InfoNode[] = [
  {
    id: 'scoring-input',
    children: [
      { id: 'card', codes: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] },
      { id: 'location', codes: ['W', 'WS', 'D', 'DS', 'Dd', 'DdS', 'S'] },
      { id: 'dq', codes: ['+', 'o', 'v/+', 'v'] },
      { id: 'determinants', codes: ["M", "FM", "m", "FC", "CF", "C", "Cn", "FC'", "C'F", "C'", "FT", "TF", "T", "FV", "VF", "V", "FY", "YF", "Y", "Fr", "rF", "FD", "F"] },
      { id: 'fq', codes: ['+', 'o', 'u', '-', 'none'] },
      { id: 'pair', codes: ['(2)'] },
      { id: 'contents', codes: ["H", "(H)", "Hd", "(Hd)", "Hx", "A", "(A)", "Ad", "(Ad)", "An", "Art", "Ay", "Bl", "Bt", "Cg", "Cl", "Ex", "Fd", "Fi", "Ge", "Hh", "Ls", "Na", "Sc", "Sx", "Xy", "Id"] },
      { id: 'popular', codes: ['P'] },
      { id: 'z', codes: ['ZW', 'ZA', 'ZD', 'ZS'] },
      { id: 'score' },
      { id: 'gphr', codes: ['GHR', 'PHR'] },
      { id: 'special-score', codes: ["DV1", "DV2", "INCOM1", "INCOM2", "DR1", "DR2", "FABCOM1", "FABCOM2", "CONTAM", "ALOG", "PSV", "AB", "AG", "COP", "MOR", "PER", "CP"] },
    ],
  },
  {
    id: 'result-interpretation',
    children: [
      {
        id: 'upper-section',
        children: [
          { id: 'Zf' }, { id: 'ZSum' }, { id: 'ZEst' }, { id: 'Zd' }, { id: 'W' }, { id: 'D' }, { id: 'Dd' }, { id: 'S' },
          { id: 'dq_plus' }, { id: 'dq_o' }, { id: 'dq_vplus' }, { id: 'dq_v' },
        ],
      },
      {
        id: 'lower-section',
        children: [
          { id: 'core', children: [{id: 'R'}, {id: 'Lambda'}, {id: 'EB'}, {id: 'EA'}, {id: 'EBPer'}, {id: 'eb'}, {id: 'es'}, {id: 'D'}, {id: 'AdjD'}, {id: 'AdjEs'}, {id: 'FM'}, {id: 'm'}, {id: 'SumCprime'}, {id: 'SumT'}, {id: 'SumV'}, {id: 'SumY'}] },
          { id: 'ideation', children: [{id: 'a_p'}, {id: 'Ma_Mp'}, {id: '_2AB_Art_Ay'}, {id: 'MOR'}, {id: 'Sum6'}, {id: 'Lv2'}, {id: 'WSum6'}, {id: 'M_minus'}, {id: 'Mnone'}] },
          { id: 'affect', children: [{id: 'FC_CF_C'}, {id: 'PureC'}, {id: 'SumC_WSumC'}, {id: 'Afr'}, {id: 'S_aff'}, {id: 'Blends_R'}, {id: 'CP'}] },
          { id: 'mediation', children: [{id: 'XA_percent'}, {id: 'WDA_percent'}, {id: 'X_minus_percent'}, {id: 'S_minus'}, {id: 'P'}, {id: 'X_plus_percent'}, {id: 'Xu_percent'}] },
          { id: 'processing', children: [{id: 'Zf_proc'}, {id: 'Zd_proc'}, {id: 'W_D_Dd'}, {id: 'W_M'}, {id: 'PSV'}, {id: 'DQ_plus_proc'}, {id: 'DQ_v_proc'}] },
          { id: 'interpersonal', children: [{id: 'COP'}, {id: 'AG'}, {id: 'a_p_inter'}, {id: 'Food'}, {id: 'SumT_inter'}, {id: 'HumanCont'}, {id: 'PureH'}, {id: 'PER'}, {id: 'ISO_Index'}] },
          { id: 'selfPerception', children: [{id: '_3r_2_R'}, {id: 'Fr_rF'}, {id: 'SumV_self'}, {id: 'FD'}, {id: 'An_Xy'}, {id: 'MOR_self'}, {id: 'H_ratio'}] },
        ]
      },
      {
        id: 'special-indices',
        children: [
          { id: 'PTI' }, { id: 'DEPI' }, { id: 'CDI' }, { id: 'SCON' }, { id: 'HVI' }, { id: 'OBS' },
        ],
      },
    ],
  },
];

export const INFO_CATEGORIES_MAP: Record<Category, InfoCategory> = {
  card: 'Card',
  location: 'Location',
  dq: 'DQ',
  determinants: 'Determinants',
  fq: 'FQ',
  pair: 'Pair',
  contents: 'Contents',
  popular: 'Popular',
  z: 'Z',
  score: 'Score',
  gphr: 'G/PHR',
  'special-score': 'Special Score',
};

export const SCORING_CONFIG = {
  /**
   * A. 코드 그룹 (CODES)
   */
  CODES: {
    // 결정인(Determinants) 그룹
    HUMAN_MOVEMENT: ['M', 'Ma', 'Mp', 'Ma-p'],
    ANIMAL_MOVEMENT: ['FM', 'FMa', 'FMp', 'FMa-p'],
    INANIMATE_MOVEMENT: ['m', 'ma', 'mp', 'ma-p'],

    CHROMATIC_COLOR: ['FC', 'CF', 'C'],
    ACHROMATIC_COLOR: ["C'"],
    SHADING_TEXTURE: ['T'],
    SHADING_VISTA: ['V'],
    SHADING_DIFFUSE: ['Y'],
    SHADING_ALL_CONTAINS: ["C'", 'T', 'V', 'Y'],

    MOVEMENT_ACTIVE: ['Ma', 'FMa', 'ma'],
    MOVEMENT_PASSIVE: ['Mp', 'FMp', 'mp'],

    // 위치(Location) 그룹
    LOCATION_W: ['W', 'WS'],
    LOCATION_D: ['D', 'DS'],
    LOCATION_Dd: ['Dd', 'DdS'],
    LOCATION_S: ['S', 'WS', 'DS', 'DdS'],
    LOCATION_WD: ['W', 'WS', 'D', 'DS'],

    // 내용(Contents) 그룹
    HUMAN_CONTENT_GPHR: ["H", "(H)", "Hd", "(Hd)", "Hx"],
    HUMAN_CONTENT_ALL: ['H', '(H)', 'Hd', '(Hd)'],
    PURE_H: ['H'],

    // 특수 점수(Special Scores) 그룹
    LEVEL_2_SS: ['DV2', 'INCOM2', 'DR2', 'FABCOM2'],
    COGNITIVE_SS_BAD: ['DR1', 'DR2', 'INCOM1', 'INCOM2', 'FABCOM1', 'FABCOM2', 'ALOG', 'CONTAM'],
    AG_OR_MOR: ['AG', 'MOR'],
    COP_OR_AG: ['COP', 'AG'],

    // GPHR 분류용
    FQ_GOOD: ['+', 'o', 'u'],
    FQ_BAD: ['-', 'none'],
    GPHR_POPULAR_CARDS: ['III', 'IV', 'VII', 'IX'],

    // 전체 목록 (집계용)
    ALL_DETERMINANTS: ["C","C'","CF","C'F","Cn","F","FC","FC'","FD","FM","FMa","FMa-p","FMp","FT","FV","FY","Fr","M","Ma","Ma-p","Mp","T","TF","V","VF","Y","YF","m","ma","ma-p","mp","rF"],
    DETERMINANTS_SINGLE: ["M", "FM", "m", "FC", "CF", "C", "Cn", "FC'", "C'F", "C'", "FT", "TF", "T", "FV", "VF", "V", "FY", "YF", "Y", "Fr", "rF", "FD", "F"],
    ALL_CONTENTS: ["H", "(H)", "Hd", "(Hd)", "Hx", "A", "(A)", "Ad", "(Ad)", "An", "Art", "Ay", "Bl", "Bt", "Cg", "Cl", "Ex", "Fd", "Fi", "Ge", "Hh", "Ls", "Na", "Sc", "Sx", "Xy", "Id"],
  },

  /**
   * B. 참조 테이블 (TABLES)
   */
  TABLES: {
    // ZEst (Zf 1~50)
    ZEST: [
      null,   2.5,   6.0,  10.0,
      13.5,  17.0,  20.5,  24.0,
      27.5,  31.0,
      34.5,  38.0,  41.5,  45.5,  49.0,  52.5,  56.0,  59.5,  63.0,  66.5,
      70.0,  73.5,  77.0,  81.0,  84.5,  88.0,  91.5,  95.0,  98.5, 102.5,
      105.5, 109.5, 112.5, 116.5, 120.0, 123.5, 127.0, 130.5, 134.0, 137.5,
      141.0, 144.5, 148.0, 152.0, 155.5, 159.0, 162.5, 166.0, 169.5, 173.0
    ],
    
    // Z_SCORE_TABLE (카드별 Z 가중치)
    Z_SCORE: {
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
    },
    
    // WSum6_weights (특수 점수 가중치)
    WSUM6_WEIGHTS: {
      DV1: 1, INCOM1: 2, DR1: 3, FABCOM1: 4,
      DV2: 2, INCOM2: 4, DR2: 6, FABCOM2: 7,
      ALOG: 5, CONTAM: 7
    }
  },

  /**
   * C. 특수 지표 기준치 (CRITERIA)
   */
  CRITERIA: {
    // D Table
    D_TABLE: {
      MIN: -15,
      MAX: 15,
      DIVISOR: 2.5,
      OFFSET: 0.25
    },
    
    // WSumC
    WSUMC: {
      FC_WEIGHT: 0.5,
      CF_WEIGHT: 1.0,
      C_WEIGHT: 1.5
    },
    
    // EBPer
    EBPER: {
      RATIO_THRESHOLD: 2.5,
      EA_THRESHOLD: 4.0,
      DIV_BY_ZERO_FALLBACK: 0.0001
    },
    
    // PTI
    PTI: {
      C1_XA_PERCENT: 0.70,
      C1_WDA_PERCENT: 0.75,
      C2_X_MINUS_PERCENT: 0.29,
      C3_LEVEL2_COUNT: 2,
      C3_FABCOM2_COUNT: 0,
      C4_R_LOW: 17,
      C4_WSUM6_LOW: 12,
      C4_R_HIGH: 16,
      C4_WSUM6_HIGH: 17,
      C5_M_MINUS: 1,
      C5_X_MINUS_PERCENT: 0.40
    },
    
    // DEPI
    DEPI: {
      C1_V_COUNT: 0,
      C1_FD_COUNT: 2,
      C2_COLOR_SHADING_BLENDS: 0,
      C2_S_COUNT: 2,
      C3_EGO_MAX: 0.44,
      C3_EGO_NO_REF: 0,
      C3_EGO_MIN: 0.33,
      C4_AFR: 0.46,
      C4_BLENDS: 4,
      C5_SUM_C_PRIME: 2,
      C6_MOR: 2,
      C6_INTELLECT: 3,
      C7_COP: 2,
      C7_ISOLATE: 0.24,
      SCORE_THRESHOLD: 5
    },
    
    // CDI
    CDI: {
      C1_EA: 6,
      C1_ADJ_D: 0,
      C2_COP: 2,
      C2_AG: 2,
      C3_WSUMC: 2.5,
      C3_AFR: 0.46,
      C4_PASSIVE_RATIO: 1,
      C4_PURE_H: 2,
      C5_SUM_T: 1,
      C5_ISOLATE: 0.24,
      C5_FOOD: 0,
      SCORE_THRESHOLD: 4
    },
    
    // S-CON
    SCON: {
      C1_VISTA_FD: 2,
      C2_COLOR_SHADING_BLENDS: 0,
      C3_EGO_MIN: 0.31,
      C3_EGO_MAX: 0.44,
      C4_MOR: 3,
      C5_ZD_MIN: -3.5,
      C5_ZD_MAX: 3.5,
      C7_FC_RATIO: 1,
      C8_X_PLUS_PERCENT: 0.70,
      C9_S: 3,
      C10_P_MIN: 3,
      C10_P_MAX: 8,
      C11_PURE_H: 2,
      C12_R: 17,
      SCORE_THRESHOLD: 8
    },
    
    // HVI
    HVI: {
      C1_SUM_T: 0,
      C2_ZF: 12,
      C3_ZD: 3.0,
      C4_S: 3,
      C5_HUMAN_CONT: 6,
      C6_PAREN_CONT: 3,
      C7_H_HD_RATIO: 4.0,
      C8_CG: 3,
      SUB_SCORE_THRESHOLD: 4
    },
    
    // OBS
    OBS: {
      C1_DD: 3,
      C2_ZF: 12,
      C3_ZD: 3.0,
      C4_P: 7,
      C5_FQ_PLUS: 1,
      R2_CRITERIA_COUNT: 2,
      R2_FQ_PLUS_COUNT: 3,
      R3_CRITERIA_COUNT: 3,
      R3_X_PLUS_PERCENT: 0.89,
      R4_FQ_PLUS_COUNT: 3,
      R4_X_PLUS_PERCENT: 0.89
    }
  },

  /**
   * D. 기타 설정 (DEFAULTS)
   */
  DEFAULTS: {
    CARD_ORDER: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"],
    FQ_TYPES: ['+', 'o', 'u', '-', 'none']
  }
} as const;

