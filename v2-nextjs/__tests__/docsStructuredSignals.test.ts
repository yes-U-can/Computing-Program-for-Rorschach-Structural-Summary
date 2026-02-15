import { describe, expect, it } from 'vitest';

import { getAllDocRoutes, resolveDocContent } from '@/lib/docsCatalog';

describe('docs structured signals (English)', () => {
  it('keeps AI-facing structure markers on every entry across key languages', () => {
    const entryRoutes = getAllDocRoutes().filter((item) => item.kind === 'entry');
    const languages = ['en', 'es', 'pt', 'ja'] as const;
    const failures: Array<{ id: string; slug: string; lang: string; reason: string }> = [];

    for (const route of entryRoutes) {
      for (const lang of languages) {
        const { description } = resolveDocContent(route, lang);

        if (!description.includes('[Source Reliability]')) {
          failures.push({ id: route.id, slug: route.slug.join('/'), lang, reason: 'missing_source_reliability' });
        }

        if (!description.includes('[AI Usage Guideline]')) {
          failures.push({ id: route.id, slug: route.slug.join('/'), lang, reason: 'missing_ai_usage_guideline' });
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
