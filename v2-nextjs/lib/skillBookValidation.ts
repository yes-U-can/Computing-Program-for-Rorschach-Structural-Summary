export type SkillBookDocInput = { title: string; content: string };

export const SKILLBOOK_LIMITS = {
  nameMax: 120,
  descriptionMax: 500,
  instructionsMax: 12000,
  documentsMaxCount: 30,
  docTitleMax: 180,
  docContentMax: 12000,
} as const;

export function normalizeSkillBookDocuments(
  docs: unknown,
): { ok: true; value: SkillBookDocInput[] } | { ok: false; error: string } {
  if (docs === undefined) return { ok: true, value: [] };
  if (!Array.isArray(docs)) return { ok: false, error: 'documents must be an array' };
  if (docs.length > SKILLBOOK_LIMITS.documentsMaxCount) {
    return { ok: false, error: `documents max count is ${SKILLBOOK_LIMITS.documentsMaxCount}` };
  }

  const normalized: SkillBookDocInput[] = [];
  for (const item of docs) {
    if (!item || typeof item !== 'object') return { ok: false, error: 'invalid document item' };
    const title = (item as Record<string, unknown>).title;
    const content = (item as Record<string, unknown>).content;
    if (typeof title !== 'string' || typeof content !== 'string') {
      return { ok: false, error: 'document title/content must be strings' };
    }
    const t = title.trim();
    const c = content.trim();
    if (!t || !c) return { ok: false, error: 'document title/content cannot be empty' };
    normalized.push({
      title: t.slice(0, SKILLBOOK_LIMITS.docTitleMax),
      content: c.slice(0, SKILLBOOK_LIMITS.docContentMax),
    });
  }
  return { ok: true, value: normalized };
}

export function normalizeSkillBookText(
  name: unknown,
  description: unknown,
  instructions: unknown,
): { ok: true; value: { name: string; description: string; instructions: string } } | { ok: false; error: string } {
  if (typeof name !== 'string' || typeof instructions !== 'string') {
    return { ok: false, error: 'name and instructions are required' };
  }
  const normalizedName = name.trim();
  const normalizedInstructions = instructions.trim();
  const normalizedDescription = typeof description === 'string' ? description.trim() : '';
  if (!normalizedName || !normalizedInstructions) {
    return { ok: false, error: 'name and instructions are required' };
  }
  return {
    ok: true,
    value: {
      name: normalizedName.slice(0, SKILLBOOK_LIMITS.nameMax),
      description: normalizedDescription.slice(0, SKILLBOOK_LIMITS.descriptionMax),
      instructions: normalizedInstructions.slice(0, SKILLBOOK_LIMITS.instructionsMax),
    },
  };
}

export function normalizeSkillBookTextPatch(input: {
  name?: unknown;
  description?: unknown;
  instructions?: unknown;
}): {
  ok: true;
  value: Partial<{ name: string; description: string; instructions: string }>;
} | { ok: false; error: string } {
  const output: Partial<{ name: string; description: string; instructions: string }> = {};

  if (input.name !== undefined) {
    if (typeof input.name !== 'string') return { ok: false, error: 'name must be a string' };
    const normalizedName = input.name.trim();
    if (!normalizedName) return { ok: false, error: 'name cannot be empty' };
    output.name = normalizedName.slice(0, SKILLBOOK_LIMITS.nameMax);
  }

  if (input.description !== undefined) {
    if (typeof input.description !== 'string') return { ok: false, error: 'description must be a string' };
    output.description = input.description.trim().slice(0, SKILLBOOK_LIMITS.descriptionMax);
  }

  if (input.instructions !== undefined) {
    if (typeof input.instructions !== 'string') return { ok: false, error: 'instructions must be a string' };
    const normalizedInstructions = input.instructions.trim();
    if (!normalizedInstructions) return { ok: false, error: 'instructions cannot be empty' };
    output.instructions = normalizedInstructions.slice(0, SKILLBOOK_LIMITS.instructionsMax);
  }

  return { ok: true, value: output };
}
