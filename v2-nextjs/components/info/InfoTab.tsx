'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Code, InfoNode, Language } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { getCategoryDescription, getCodeDescription } from '@/lib/infoTranslations';
import { INFO_CATEGORIES_MAP, DOC_STRUCTURE } from '@/lib/constants';
import { resolveDocContent } from '@/lib/docsCatalog';
import { resultVariableDescriptions } from '@/lib/result-variables';
import { BookOpenIcon, ChevronRightIcon, TagIcon, MagnifyingGlassIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

type SelectedItem =
  | {
      type: 'category';
      id: string;
      slug: string[];
    }
  | {
      type: 'entry';
      id: string;
      slug: string[];
    };

type ResolvedContent = {
  title: string;
  description: string;
};

const CATEGORY_ONLY_DOC_IDS = new Set(['pair', 'popular']);

const CANONICAL_ENTRY_LABELS: Record<string, string> = {
  // Upper Section
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
  // Core
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
  // Ideation
  a_p: 'a:p',
  Ma_Mp: 'Ma:Mp',
  _2AB_Art_Ay: '2AB+(Art+Ay)',
  WSum6: 'WSum6',
  M_minus: 'M-',
  // Affect
  FC_CF_C: 'FC:CF+C',
  PureC: 'Pure C',
  SumC_WSumC: "SumC':WSumC",
  S_aff: 'S',
  Blends_R: 'Blends:R',
  // Mediation
  XA_percent: 'XA%',
  WDA_percent: 'WDA%',
  X_minus_percent: 'X-%',
  S_minus: 'S-',
  X_plus_percent: 'X+%',
  Xu_percent: 'Xu%',
  // Processing
  Zf_proc: 'Zf',
  Zd_proc: 'Zd',
  W_D_Dd: 'W:D:Dd',
  W_M: 'W:M',
  DQ_plus_proc: 'DQ+',
  DQ_v_proc: 'DQv',
  // Interpersonal
  a_p_inter: 'a:p',
  SumT_inter: 'SumT',
  HumanCont: 'Human Cont',
  PureH: 'Pure H',
  ISO_Index: 'Isol Idx',
  // Self-perception
  _3r_2_R: '3r+(2)/R',
  Fr_rF: 'Fr+rF',
  SumV_self: 'SumV',
  An_Xy: 'An+Xy',
  MOR_self: 'MOR',
  H_ratio: 'H:(H)+Hd+(Hd)',
  // Special Indices
  PTI: 'PTI',
  DEPI: 'DEPI',
  CDI: 'CDI',
  SCON: 'S-CON',
  HVI: 'HVI',
  OBS: 'OBS',
};

const SCORING_CATEGORY_INPUT_KEYS: Record<string, string> = {
  card: 'card',
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
  'special-score': 'specialScores',
};

const FIXED_EN_CATEGORY_LABELS: Record<string, string> = {
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

function fallbackLabel(id: string): string {
  return id
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function includesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

function getEntryDescriptionForSearch(id: string, lang: Language): string {
  const fromResultVars = resultVariableDescriptions[id]?.[lang]?.description;
  if (fromResultVars) return fromResultVars;

  const fromCodeDesc = getCodeDescription(id as Code, lang)?.description;
  if (fromCodeDesc) return fromCodeDesc;

  const title = resolveEntryTitle(id, lang);
  return fallbackEntryDescription(title, lang);
}

function getCategoryDescriptionForSearch(id: string, lang: Language, t: (key: string) => string): string {
  const infoCategory = INFO_CATEGORIES_MAP[id as keyof typeof INFO_CATEGORIES_MAP];
  if (infoCategory) {
    const desc = getCategoryDescription(infoCategory, lang);
    if (desc) return desc;
  }

  return fallbackCategoryDescription(resolveCategoryLabel(id, t), lang);
}

function resolveCategoryLabel(id: string, t: (key: string) => string): string {
  const fixedEnLabel = FIXED_EN_CATEGORY_LABELS[id];
  if (fixedEnLabel) return fixedEnLabel;

  const infoCategoryLabel = t(`info.categories.${id}`);
  if (infoCategoryLabel !== `info.categories.${id}`) return infoCategoryLabel;

  const inputKey = SCORING_CATEGORY_INPUT_KEYS[id];
  if (inputKey) {
    const inputLabel = t(`input.${inputKey}`);
    if (inputLabel !== `input.${inputKey}`) return inputLabel;
  }

  return fallbackLabel(id);
}

function resolveEntryTitle(id: string, lang: Language): string {
  const canonical = CANONICAL_ENTRY_LABELS[id];
  if (canonical) return canonical;

  // For scoring/code entries, preserve the raw code notation as-is.
  if (getCodeDescription(id as Code, lang)) {
    return id;
  }

  const fromResultVars = resultVariableDescriptions[id]?.[lang]?.title;
  if (fromResultVars) return fromResultVars;

  return id;
}

function fallbackEntryDescription(title: string, lang: Language): string {
  const messages: Record<Language, string> = {
    en: `Temporary note for ${title}. This documentation will be refined later.`,
    ko: `[${title}] description is temporarily unavailable.`,
    ja: `[${title}] description is temporarily unavailable.`,
    es: `[${title}] description is temporarily unavailable.`,
    pt: `[${title}] description is temporarily unavailable.`,
  };
  return messages[lang];
}

function fallbackCategoryDescription(title: string, lang: Language): string {
  const messages: Record<Language, string> = {
    en: `Temporary overview for ${title}. Detailed guidance will be added later.`,
    ko: `[${title}] overview is temporarily unavailable.`,
    ja: `[${title}] overview is temporarily unavailable.`,
    es: `[${title}] overview is temporarily unavailable.`,
    pt: `[${title}] overview is temporarily unavailable.`,
  };
  return messages[lang];
}

function resolveContent(selected: SelectedItem, lang: Language, t: (key: string) => string): ResolvedContent {
  const mapped = resolveDocContent(
    {
      kind: selected.type === 'entry' ? 'entry' : 'category',
      id: selected.id,
      slug: selected.slug,
    },
    lang
  );

  return {
    title: mapped.title || resolveCategoryLabel(selected.id, t),
    description: mapped.description || fallbackCategoryDescription(resolveCategoryLabel(selected.id, t), lang),
  };
}

function filterDocNode(
  node: InfoNode,
  query: string,
  lang: Language,
  t: (key: string) => string
): InfoNode | null {
  if (!query.trim()) return node;

  const label = resolveCategoryLabel(node.id, t);
  const categoryDescription = getCategoryDescriptionForSearch(node.id, lang, t);
  const selfMatches =
    includesQuery(label, query) ||
    includesQuery(node.id, query) ||
    includesQuery(categoryDescription, query);

  if (selfMatches) return node;

  const searchableCodes = CATEGORY_ONLY_DOC_IDS.has(node.id) ? [] : (node.codes ?? []);
  const filteredCodes = searchableCodes.filter((code) => {
    const title = resolveEntryTitle(code, lang);
    const description = getEntryDescriptionForSearch(code, lang);
    return (
      includesQuery(code, query) ||
      includesQuery(title, query) ||
      includesQuery(description, query)
    );
  });

  const filteredChildren = (node.children ?? [])
    .map((child) => filterDocNode(child, query, lang, t))
    .filter((child): child is InfoNode => child !== null);

  const isLeafEntryNode = !node.codes?.length && !node.children?.length;
  if (isLeafEntryNode) {
    const title = resolveEntryTitle(node.id, lang);
    const description = getEntryDescriptionForSearch(node.id, lang);
    if (
      includesQuery(title, query) ||
      includesQuery(node.id, query) ||
      includesQuery(description, query)
    ) {
      return node;
    }
    return null;
  }

  if (filteredCodes.length || filteredChildren.length) {
    return {
      ...node,
      codes: filteredCodes.length ? filteredCodes : undefined,
      children: filteredChildren.length ? filteredChildren : undefined,
    };
  }

  return null;
}

function collectNodeIds(nodes: InfoNode[]): string[] {
  const ids: string[] = [];
  const walk = (list: InfoNode[]) => {
    for (const node of list) {
      ids.push(node.id);
      if (node.children?.length) walk(node.children);
    }
  };
  walk(nodes);
  return ids;
}

type NavItemProps = {
  node: InfoNode;
  nodePath: string[];
  level: number;
  selected: SelectedItem;
  onSelect: (item: SelectedItem) => void;
  openNodes: string[];
  onToggleNode: (id: string) => void;
};

function NavItem({ node, nodePath, level, selected, onSelect, openNodes, onToggleNode }: NavItemProps) {
  const { language, t } = useTranslation();
  const hasChildren = Boolean(node.children?.length);
  const effectiveCodes = CATEGORY_ONLY_DOC_IDS.has(node.id) ? [] : (node.codes ?? []);
  const hasCodes = Boolean(effectiveCodes.length);
  const hasExpandableContent = hasChildren || hasCodes;
  const isOpen = openNodes.includes(node.id);
  const selectedKey = selected.slug.join('/');
  const currentNodeKey = nodePath.join('/');
  const isCategorySelected = selected.type === 'category' && selectedKey === currentNodeKey;
  const label = resolveCategoryLabel(node.id, t);

  const handleSelectCategory = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect({ type: 'category', id: node.id, slug: nodePath });
    if (hasExpandableContent) {
      onToggleNode(node.id);
    }
  };

  return (
    <li className={level > 0 ? 'ml-4' : ''}>
      <div
        className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-opacity hover:opacity-90 ${
          isCategorySelected ? 'font-semibold' : 'font-semibold'
        }`}
        onClick={handleSelectCategory}
      >
        <span
          className={`${level === 0 ? 'text-base font-bold' : ''} ${
            isCategorySelected ? 'font-bold' : ''
          }`}
          style={{ color: '#334155' }}
        >
          {label}
        </span>
        {hasExpandableContent && (
          <ChevronRightIcon
            className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
        )}
      </div>
      {isOpen && hasExpandableContent && (
        <ul className="mt-1 ml-3 space-y-1 border-l-2 border-slate-100 pl-3">
          {node.children?.map((childNode) => {
            const isChildLeaf = !childNode.children?.length && !childNode.codes?.length;
            if (isChildLeaf && level > 0) {
              const leafPath = [...nodePath, childNode.id];
              const isSelected =
                selected.type === 'entry' && selected.slug.join('/') === leafPath.join('/');
              return (
                <li key={childNode.id}>
                  <button
                    type="button"
                    className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                      isSelected ? 'font-semibold bg-slate-100' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    style={isSelected ? { fontWeight: 600 } : undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect({ type: 'entry', id: childNode.id, slug: leafPath });
                    }}
                  >
                    {resolveEntryTitle(childNode.id, language)}
                  </button>
                </li>
              );
            }

            return (
              <NavItem
                key={childNode.id}
                node={childNode}
                nodePath={[...nodePath, childNode.id]}
                level={level + 1}
                selected={selected}
                onSelect={onSelect}
                openNodes={openNodes}
                onToggleNode={onToggleNode}
              />
            );
          })}
          {effectiveCodes.map((code) => {
            const codePath = [...nodePath, code];
            const isCodeSelected = selected.type === 'entry' && selected.slug.join('/') === codePath.join('/');
            return (
              <li key={code}>
                  <button
                    type="button"
                    className={`block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                      isCodeSelected ? 'font-semibold bg-slate-100' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect({ type: 'entry', id: code, slug: codePath });
                  }}
                >
                  {resolveEntryTitle(code, language)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

type SidebarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  selected: SelectedItem;
  onSelect: (item: SelectedItem) => void;
};

function Sidebar({ query, onQueryChange, selected, onSelect }: SidebarProps) {
  const { language, t } = useTranslation();
  const [openNodes, setOpenNodes] = useState<string[]>(['scoring-input', 'result-interpretation']);

  const handleToggleNode = (nodeId: string) => {
    setOpenNodes((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const filteredStructure = useMemo(() => {
    if (!query.trim()) return DOC_STRUCTURE;
    return DOC_STRUCTURE
      .map((node) => filterDocNode(node, query, language, t))
      .filter((node): node is InfoNode => node !== null);
  }, [query, language, t]);
  const effectiveOpenNodes = useMemo(
    () => (query.trim() ? collectNodeIds(filteredStructure) : openNodes),
    [query, filteredStructure, openNodes]
  );

  return (
    <nav className="max-h-[48vh] w-full overflow-auto rounded-lg border border-slate-200 p-2 md:max-h-none md:w-72 md:flex-shrink-0 md:overflow-visible md:rounded-none md:border-0 md:p-0 md:pr-8">
      <div className="mb-2">
        <label className="sr-only" htmlFor="docs-search">Search docs</label>
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="docs-search"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search docs..."
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
          />
        </div>
      </div>
      {filteredStructure.length === 0 ? (
        <p className="px-2 py-3 text-sm text-slate-500">No matching docs in this tab.</p>
      ) : (
        <ul className="space-y-2">
          {filteredStructure.map((node) => (
            <NavItem
              key={node.id}
              node={node}
              nodePath={[node.id]}
              level={0}
              selected={selected}
              onSelect={onSelect}
              openNodes={effectiveOpenNodes}
              onToggleNode={handleToggleNode}
            />
          ))}
        </ul>
      )}
    </nav>
  );
}

function ContentDisplay({ item, lang }: { item: SelectedItem; lang: Language }) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const content = useMemo(() => {
    return resolveContent(item, lang, t);
  }, [item, lang, t]);

  const handleCopy = async () => {
    const textToCopy = `${content.title}\n\n${content.description}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast({
        type: 'success',
        title: 'Copied',
        message: 'Documentation text copied to clipboard.',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Copy failed',
        message: 'Could not copy text. Please copy manually.',
      });
    }
  };

  if (!content.title || !content.description) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <BookOpenIcon className="h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Select an Item</h2>
        <p className="mt-2 text-gray-500">Choose an item from the left menu to see its description.</p>
      </div>
    );
  }

  return (
    <article className="prose prose-blue max-w-none flex-1">
      <div
        className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2"
      >
        <TagIcon className="h-6 w-6 text-slate-400" />
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          {content.title}
        </h1>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/ref/${item.slug.join('/')}`}
            className="text-sm font-medium text-[var(--brand-500)] hover:text-[var(--brand-700)]"
          >
            Open As Page
          </Link>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
            Copy
          </button>
        </div>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-gray-600 md:text-lg">{content.description}</p>
    </article>
  );
}

const InfoTab = () => {
  const { language } = useTranslation();
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    type: 'category',
    id: 'scoring-input',
    slug: ['scoring-input'],
  });

  return (
    <div className="flex h-full min-h-[60vh] flex-col gap-4 p-2 sm:p-4 md:flex-row">
      <Sidebar
        query={query}
        onQueryChange={setQuery}
        selected={selectedItem}
        onSelect={setSelectedItem}
      />
      <div className="flex flex-1 md:ml-8 md:border-l md:border-gray-200 md:pl-8">
        <ContentDisplay lang={language} item={selectedItem} />
      </div>
    </div>
  );
};

export default InfoTab;




