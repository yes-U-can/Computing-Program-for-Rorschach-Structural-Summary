import { DOC_STRUCTURE, INFO_CATEGORIES_MAP } from '@/lib/constants';
import { getCategoryDescription, getCodeDescription } from '@/lib/infoTranslations';
import { resultVariableDescriptions } from '@/lib/result-variables';
import { Code, Language } from '@/types';
import { GROUP_COLORS, HEADER_ACCENT } from '@/lib/colors';

export type DocKind = 'category' | 'entry';

export type DocRouteItem = {
  kind: DocKind;
  id: string;
  slug: string[];
};

const CATEGORY_ONLY_DOC_IDS = new Set(['pair', 'popular']);

export const FIXED_EN_CATEGORY_LABELS: Record<string, string> = {
  'scoring-input': 'Scoring Input',
  'result-interpretation': 'Result Interpretation',
  'upper-section': 'Upper Section',
  'lower-section': 'Lower Section',
  'special-indices': 'Special Indices',
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
  core: 'Core',
  ideation: 'Ideation',
  affect: 'Affection',
  mediation: 'Cognitive Mediation',
  processing: 'Information Processing',
  interpersonal: 'Interpersonal',
  selfPerception: 'Self-Perception',
};

export const CANONICAL_ENTRY_LABELS: Record<string, string> = {
  Zf: 'Zf',
  ZSum: 'ZSum',
  ZEst: 'ZEst',
  Zd: 'Zd',
  W: 'W',
  D: 'D',
  Dd: 'Dd',
  S: 'S',
  dq_plus: '+',
  dq_o: 'o',
  dq_vplus: 'v/+',
  dq_v: 'v',
  R: 'R',
  Lambda: 'L',
  EB: 'EB',
  EA: 'EA',
  EBPer: 'EBPer',
  eb: 'eb',
  es: 'es',
  AdjD: 'Adj D',
  AdjEs: 'Adj es',
  SumCprime: "SumC'",
  a_p: 'a:p',
  Ma_Mp: 'Ma:Mp',
  _2AB_Art_Ay: '2AB+(Art+Ay)',
  WSum6: 'WSum6',
  M_minus: 'M-',
  FC_CF_C: 'FC:CF+C',
  PureC: 'Pure C',
  SumC_WSumC: "SumC':WSumC",
  S_aff: 'S',
  Blends_R: 'Blends:R',
  XA_percent: 'XA%',
  WDA_percent: 'WDA%',
  X_minus_percent: 'X-%',
  S_minus: 'S-',
  X_plus_percent: 'X+%',
  Xu_percent: 'Xu%',
  Zf_proc: 'Zf',
  Zd_proc: 'Zd',
  W_D_Dd: 'W:D:Dd',
  W_M: 'W:M',
  DQ_plus_proc: 'DQ+',
  DQ_v_proc: 'DQv',
  a_p_inter: 'a:p',
  SumT_inter: 'SumT',
  HumanCont: 'Human Cont',
  PureH: 'Pure H',
  ISO_Index: 'Isol Idx',
  _3r_2_R: '3r+(2)/R',
  Fr_rF: 'Fr+rF',
  SumV_self: 'SumV',
  An_Xy: 'An+Xy',
  MOR_self: 'MOR',
  H_ratio: 'H:(H)+Hd+(Hd)',
  PTI: 'PTI',
  DEPI: 'DEPI',
  CDI: 'CDI',
  SCON: 'S-CON',
  HVI: 'HVI',
  OBS: 'OBS',
};

const CATEGORY_COLOR_KEYS: Partial<Record<string, keyof typeof GROUP_COLORS.header>> = {
  card: 'basic',
  location: 'location',
  dq: 'dq',
  determinants: 'determinants',
  fq: 'fq',
  pair: 'pair',
  contents: 'contents',
  popular: 'popular',
  z: 'z',
  score: 'score',
  gphr: 'gphr',
  'special-score': 'special',
};

function fallbackLabel(id: string): string {
  return id
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function resolveCategoryTitle(id: string): string {
  return FIXED_EN_CATEGORY_LABELS[id] ?? fallbackLabel(id);
}

export function resolveEntryTitle(id: string, lang: Language): string {
  const canonical = CANONICAL_ENTRY_LABELS[id];
  if (canonical) return canonical;
  if (getCodeDescription(id as Code, lang)) return id;
  return resultVariableDescriptions[id]?.[lang]?.title ?? id;
}

function fallbackEntryDescription(title: string, lang: Language): string {
  const messages: Record<Language, string> = {
    en: `Temporary note for ${title}. This documentation will be refined later.`,
    ko: `${title}에 대한 임시 설명입니다. 추후 상세 문구로 보완 예정입니다.`,
    ja: `${title}の暫定説明です。後で詳細説明に更新予定です。`,
    es: `Nota temporal para ${title}. Esta documentación se completará más adelante.`,
    pt: `Nota temporária para ${title}. Esta documentação será refinada depois.`,
  };
  return messages[lang];
}

function fallbackCategoryDescription(title: string, lang: Language): string {
  const messages: Record<Language, string> = {
    en: `Temporary overview for ${title}. Detailed guidance will be added later.`,
    ko: `${title}에 대한 임시 개요입니다. 자세한 가이드는 추후 추가됩니다.`,
    ja: `${title}の暫定概要です。詳細ガイドは後で追加されます。`,
    es: `Resumen temporal de ${title}. La guía detallada se añadirá más adelante.`,
    pt: `Visão geral temporária de ${title}. O guia detalhado será adicionado depois.`,
  };
  return messages[lang];
}

export function resolveDocContent(item: DocRouteItem, lang: Language = 'en'): { title: string; description: string } {
  if (item.kind === 'entry') {
    const title = resolveEntryTitle(item.id, lang);
    const resultDesc = resultVariableDescriptions[item.id]?.[lang]?.description;
    if (resultDesc) return { title, description: resultDesc };

    const codeDesc = getCodeDescription(item.id as Code, lang);
    if (codeDesc?.description) return { title, description: codeDesc.description };

    return { title, description: fallbackEntryDescription(title, lang) };
  }

  const title = resolveCategoryTitle(item.id);
  const infoCategory = INFO_CATEGORIES_MAP[item.id as keyof typeof INFO_CATEGORIES_MAP];
  if (infoCategory) {
    const desc = getCategoryDescription(infoCategory, lang);
    if (desc) return { title, description: desc };
  }
  return { title, description: fallbackCategoryDescription(title, lang) };
}

export function resolveToneBySlug(slug: string[]): { bg: string; accent: string } | null {
  const categoryCandidate = slug.find((segment) => CATEGORY_COLOR_KEYS[segment]);
  if (!categoryCandidate) return null;
  const key = CATEGORY_COLOR_KEYS[categoryCandidate];
  if (!key) return null;
  return {
    bg: GROUP_COLORS.header[key],
    accent: HEADER_ACCENT.light[key],
  };
}

function walkDocStructure(): DocRouteItem[] {
  const items: DocRouteItem[] = [];

  const walk = (
    nodes: typeof DOC_STRUCTURE,
    parentSlug: string[] = []
  ) => {
    for (const node of nodes) {
      const nodeSlug = [...parentSlug, node.id];
      items.push({ kind: 'category', id: node.id, slug: nodeSlug });

      const effectiveCodes = CATEGORY_ONLY_DOC_IDS.has(node.id) ? [] : (node.codes ?? []);
      if (effectiveCodes.length) {
        for (const code of effectiveCodes) {
          items.push({ kind: 'entry', id: code, slug: [...nodeSlug, code] });
        }
      }

      if (node.children?.length) {
        const leafEntries = node.children.filter((c) => !c.children?.length && !c.codes?.length);
        for (const leaf of leafEntries) {
          items.push({ kind: 'entry', id: leaf.id, slug: [...nodeSlug, leaf.id] });
        }

        const nested = node.children.filter((c) => c.children?.length || c.codes?.length);
        if (nested.length) {
          walk(nested as typeof DOC_STRUCTURE, nodeSlug);
        }
      }
    }
  };

  walk(DOC_STRUCTURE);
  return items;
}

const DOC_ROUTE_ITEMS = walkDocStructure();

export function getAllDocRoutes(): DocRouteItem[] {
  return DOC_ROUTE_ITEMS;
}

export function findDocRouteBySlug(slug?: string[]): DocRouteItem | undefined {
  if (!slug?.length) return undefined;
  const key = slug.join('/');
  return DOC_ROUTE_ITEMS.find((item) => item.slug.join('/') === key);
}
