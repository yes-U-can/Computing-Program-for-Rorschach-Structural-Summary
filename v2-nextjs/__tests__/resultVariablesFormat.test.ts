import { describe, expect, it } from 'vitest';

import { resultVariableDescriptions } from '@/lib/result-variables';

const REQUIRED_SECTIONS = [
  'Definition:',
  'Operational basis:',
  'Interpretive direction:',
  'Cross-checks:',
  'Caution:',
];

describe('resultVariableDescriptions format', () => {
  it('ensures every English description contains required structured sections', () => {
    const missingById: Array<{ id: string; missing: string[] }> = [];

    for (const [id, localized] of Object.entries(resultVariableDescriptions)) {
      const description = localized.en.description ?? '';
      const missing = REQUIRED_SECTIONS.filter((section) => !description.includes(section));
      if (missing.length > 0) {
        missingById.push({ id, missing });
      }
    }

    expect(missingById).toEqual([]);
  });
});
