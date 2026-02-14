import { getAllDocRoutes, resolveDocContent } from '@/lib/docsCatalog';
import type { Language } from '@/types';

export type KnowledgeItem = {
  title: string;
  content: string;
  source: 'builtin' | 'user';
};

function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(/[\p{L}\p{N}%+/'-]+/gu);
  return matches ?? [];
}

function overlapScore(queryTokens: Set<string>, text: string): number {
  const tokens = new Set(tokenize(text));
  let score = 0;
  queryTokens.forEach((t) => {
    if (tokens.has(t)) score += 1;
  });
  return score;
}

export function getBuiltInKnowledge(lang: Language = 'en'): KnowledgeItem[] {
  const routes = getAllDocRoutes();
  return routes.map((route) => {
    const content = resolveDocContent(route, lang);
    return {
      title: content.title,
      content: content.description,
      source: 'builtin' as const,
    };
  });
}

export function selectRelevantKnowledge(
  userQuery: string,
  userKnowledge: KnowledgeItem[] = [],
  builtInKnowledge?: KnowledgeItem[],
  lang: Language = 'en',
): KnowledgeItem[] {
  const effectiveBuiltIn = builtInKnowledge ?? getBuiltInKnowledge(lang);
  const queryTokens = new Set(tokenize(userQuery));
  if (queryTokens.size === 0) {
    return [...userKnowledge.slice(0, 2), ...effectiveBuiltIn.slice(0, 3)];
  }

  const scoreItem = (item: KnowledgeItem) => ({
    item,
    score: overlapScore(queryTokens, `${item.title}\n${item.content}`),
  });

  const rankedUser = userKnowledge
    .map(scoreItem)
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.item);

  const rankedBuiltin = effectiveBuiltIn
    .map(scoreItem)
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((r) => r.item);

  const merged = [...rankedUser, ...rankedBuiltin];
  return merged.length ? merged : [...userKnowledge.slice(0, 2), ...effectiveBuiltIn.slice(0, 3)];
}

export function buildKnowledgePrompt(knowledgeItems: KnowledgeItem[]): string {
  if (!knowledgeItems.length) return '';

  const serialized = knowledgeItems
    .map((k, i) => {
      const trimmed = k.content.length > 1400 ? `${k.content.slice(0, 1400)}...` : k.content;
      return `[${i + 1}] (${k.source.toUpperCase()}) ${k.title}\n${trimmed}`;
    })
    .join('\n\n');

  return [
    'Knowledge context for this response:',
    '- Prioritize USER knowledge when it conflicts with BUILTIN docs.',
    '- If uncertain, state uncertainty instead of fabricating.',
    '',
    serialized,
  ].join('\n');
}
