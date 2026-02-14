import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllDocRoutes, resolveDocContent } from '@/lib/docsCatalog';

type DocsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'Searchable documentation for Rorschach scoring items and structural summary variables.',
  alternates: {
    canonical: '/docs',
  },
};

function includesQuery(value: string, q: string): boolean {
  return value.toLowerCase().includes(q.toLowerCase());
}

export default async function DocsIndexPage({ searchParams }: DocsPageProps) {
  const { q } = await searchParams;
  const query = (q ?? '').trim();

  const routes = getAllDocRoutes().filter((route) => route.kind === 'entry');
  const filteredRoutes = routes.filter((route) => {
    if (!query) return true;
    const content = resolveDocContent(route, 'en');
    return (
      includesQuery(content.title, query) ||
      includesQuery(content.description, query) ||
      includesQuery(route.slug.join('/'), query)
    );
  });

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Rorschach Documentation Pages',
    itemListElement: filteredRoutes.slice(0, 50).map((route, index) => {
      const content = resolveDocContent(route, 'en');
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: `/docs/${route.slug.join('/')}`,
        name: content.title,
      };
    }),
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <h1 className="text-3xl font-bold text-slate-800">Documentation</h1>
      <p className="mt-2 text-slate-600">
        Search scoring-item and result-variable reference pages.
      </p>

      <form action="/docs" method="get" className="mt-6">
        <label htmlFor="docs-query" className="sr-only">
          Search documentation
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="docs-query"
            name="q"
            defaultValue={query}
            placeholder="Search by code, title, keyword..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[#4E73AA] focus:outline-none focus:ring-2 focus:ring-[#4E73AA]/20"
          />
          <button
            type="submit"
            className="rounded-md bg-[#2A5F7F] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E4D6A]"
          >
            Search
          </button>
        </div>
      </form>

      <p className="mt-3 text-sm text-slate-500">
        {filteredRoutes.length} result{filteredRoutes.length === 1 ? '' : 's'}
        {query ? ` for "${query}"` : ''}
      </p>

      {filteredRoutes.length === 0 ? (
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No matching docs found. Try a broader keyword.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {filteredRoutes.map((route) => {
            const content = resolveDocContent(route, 'en');
            return (
              <li
                key={route.slug.join('/')}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <Link
                  href={`/docs/${route.slug.join('/')}`}
                  className="break-words text-base font-semibold text-slate-800 hover:text-[#4E73AA]"
                >
                  {content.title}
                </Link>
                <p className="mt-1 text-xs text-slate-400">/{route.slug.join('/')}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{content.description}</p>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
