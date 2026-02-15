import { describe, expect, it } from 'vitest';

import { getAllDocRoutes, resolveDocContent } from '@/lib/docsCatalog';

describe('docs catalog coverage (English)', () => {
  it('ensures every entry route resolves to non-temporary structured content', () => {
    const entryRoutes = getAllDocRoutes().filter((item) => item.kind === 'entry');
    const failures: Array<{ id: string; slug: string; reason: string }> = [];

    for (const route of entryRoutes) {
      const { description } = resolveDocContent(route, 'en');

      if (description.includes('Temporary note') || description.includes('Temporary overview')) {
        failures.push({ id: route.id, slug: route.slug.join('/'), reason: 'temporary_fallback' });
        continue;
      }

      const hasStructuredSignal =
        description.includes('Definition:') ||
        description.includes('[Definition]') ||
        description.includes('[Concept]');

      if (!hasStructuredSignal) {
        failures.push({ id: route.id, slug: route.slug.join('/'), reason: 'missing_structured_signal' });
      }
    }

    expect(failures).toEqual([]);
  });
});
