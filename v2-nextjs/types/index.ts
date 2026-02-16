/**
 * Computing Program for Rorschach Structural Summary v2.0.0
 * TypeScript Type Definitions
 */

export type { Language } from '@/i18n/config';

// Scoring category IDs (internal, lowercase with hyphens)
export type Category = 'card' | 'location' | 'dq' | 'determinants' | 'fq' | 'pair' | 'contents' | 'popular' | 'z' | 'score' | 'gphr' | 'special-score';

// Display-facing category names (matches GAS legacy keys)
export type InfoCategory = 'Card' | 'Location' | 'DQ' | 'Determinants' | 'FQ' | 'Pair' | 'Contents' | 'Popular' | 'Z' | 'Score' | 'G/PHR' | 'Special Score';

// Generic code type for all scoring codes
export type Code = string;

// Info translation structures
export interface Gtm {
  title: string;
  description: string;
}

export interface Docs {
  title: string;
  description: string;
}

export interface InfoTranslation {
  docs?: Record<string, { title: string; description: string }>;
  gtm?: Record<string, { title: string; description: string }>;
}

// Type guards
export function isCode(value: string): value is Code {
  return typeof value === 'string' && value.length > 0;
}

export interface InfoNode {
  id: string;
  children?: InfoNode[];
  codes?: Code[];
}


export function isInfoCategory(value: string): value is InfoCategory {
  return ['Card', 'Location', 'DQ', 'Determinants', 'FQ', 'Pair', 'Contents', 'Popular', 'Z', 'Score', 'G/PHR', 'Special Score'].includes(value);
}

export interface RorschachResponse {
  card: string;                    // I, II, ..., X
  response: string;                // 반응 내용
  location: string;                // W, D, Dd, etc.
  dq: string;                      // o, v/+, v, +
  determinants: string[];          // F, M, FC, etc. (max 6)
  fq: string;                      // +, o, u, -, none
  pair: string;                    // (2), none
  contents: string[];              // A, H, Bt, etc. (max 6)
  popular: boolean;                // P
  z: string;                       // ZW, ZA, ZD, ZS
  specialScores: string[];         // DV, DR, INCOM, etc. (max 8)
}

// Matches calculator.ts output structure
export interface StructuralSummary {
  upper_section: {
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
  lower_section: {
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
    Afr: string;
    XA_percent: string;
    WDA_percent: string;
    X_minus_percent: string;
    S_minus: number;
    P: number;
    X_plus_percent: string;
    Xu_percent: string;
    Zf: number;
    Zd: string | number;
    PSV: number;
    DQ_plus: number;
    DQ_v: number;
    W_D_Dd: string;
    W_M: string;
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
    S_aff: number;
    Blends_R: string;
    CP: number;
    _3r_2_R: string;
    Fr_rF: number;
    SumV_self: number;
    FD: number;
    An_Xy: number;
    MOR_self: number;
    H_ratio: string;
    COP: number;
    AG: number;
    a_p_inter: string;
    Food: number;
    SumT_inter: number;
    HumanCont: number;
    PureH: number;
    PER: number;
    ISO_Index: string;
  };
  special_indices: {
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
  row_calculations: Array<{
    card: string;
    response: string;
    gphr: string;
  }>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CalculationResult {
  success: boolean;
  data?: StructuralSummary;
  errors?: ValidationError[];
}

export interface AutoSaveData {
  timestamp: string;               // ISO 8601
  totalRows: number;
  responses: RorschachResponse[];
}
