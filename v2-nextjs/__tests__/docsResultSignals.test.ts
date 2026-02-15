import { describe, expect, it } from 'vitest';

import { getAllDocRoutes, resolveDocContent } from '@/lib/docsCatalog';

describe('docs result-entry structure (English)', () => {
  it('keeps detailed result interpretation signals for result entries', () => {
    const resultEntries = getAllDocRoutes().filter(
      (item) => item.kind === 'entry' && item.slug.includes('result-interpretation')
    );
    const failures: Array<{ id: string; slug: string; reason: string }> = [];

    for (const route of resultEntries) {
      const { description } = resolveDocContent(route, 'en');

      if (!description.includes('[Interpretive Preconditions]')) {
        failures.push({ id: route.id, slug: route.slug.join('/'), reason: 'missing_interpretive_preconditions' });
      }
      if (!description.includes('[Cross-Checks]')) {
        failures.push({ id: route.id, slug: route.slug.join('/'), reason: 'missing_cross_checks' });
      }
      if (!description.includes('[Common Misreading Guard]')) {
        failures.push({ id: route.id, slug: route.slug.join('/'), reason: 'missing_misreading_guard' });
      }
    }

    expect(failures).toEqual([]);
  });
});
