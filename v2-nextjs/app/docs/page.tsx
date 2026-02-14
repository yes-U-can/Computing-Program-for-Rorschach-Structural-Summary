import Link from 'next/link';
import type { Metadata } from 'next';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllDocRoutes, resolveDocContent } from '@/lib/docsCatalog';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type DocsPageProps = {
  searchParams: Promise<{ q?: string; lang?: string }>;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Searchable documentation for Rorschach scoring items and structural summary variables.',
  alternates: {
    canonical: '/docs',
    languages: buildLanguageAlternates('/docs'),
  },
};

function includesQuery(value: string, q: string): boolean {
  return value.toLowerCase().includes(q.toLowerCase());
}

export default async function DocsIndexPage({ searchParams }: DocsPageProps) {
  const { q, lang } = await searchParams;
  const query = (q ?? '').trim();
  const hasQuery = query.length > 0;
  const activeLang = normalizeLang(lang);

  const routes = getAllDocRoutes().filter((route) => route.kind === 'entry');
  const filteredRoutes = routes.filter((route) => {
    if (!hasQuery) return false;
    const content = resolveDocContent(route, activeLang);
    return (
      includesQuery(content.title, query) ||
      includesQuery(content.description, query) ||
      includesQuery(route.slug.join('/'), query)
    );
  });

  const labels: Record<Language, { title: string; subtitle: string; search: string; placeholder: string; empty: string; idle: string; results: (count: number, q: string) => string }> = {
    en: {
      title: 'Documentation',
      subtitle: 'Search scoring-item and result-variable reference pages.',
      search: 'Search',
      placeholder: 'Search by code, title, keyword...',
      empty: 'No matching docs found. Try a broader keyword.',
      idle: 'Enter a keyword to view document results.',
      results: (count, text) => `${count} result${count === 1 ? '' : 's'}${text ? ` for "${text}"` : ''}`,
    },
    ko: {
      title: '\uBB38\uC11C',
      subtitle: '\uCC44\uC810 \uD56D\uBAA9\uACFC \uACB0\uACFC \uBCC0\uC218 \uC124\uBA85\uC744 \uAC80\uC0C9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.',
      search: '\uAC80\uC0C9',
      placeholder: '\uCF54\uB4DC, \uC81C\uBAA9, \uD0A4\uC6CC\uB4DC\uB85C \uAC80\uC0C9...',
      empty: '\uC77C\uCE58\uD558\uB294 \uBB38\uC11C\uB97C \uCC3E\uC9C0 \uBABB\uD588\uC5B4\uC694. \uAC80\uC0C9\uC5B4\uB97C \uC870\uAE08 \uB354 \uB113\uAC8C \uC785\uB825\uD574 \uBCF4\uC138\uC694.',
      idle: '\uAC80\uC0C9\uC5B4\uB97C \uC785\uB825\uD558\uBA74 \uACB0\uACFC\uAC00 \uD45C\uC2DC\uB429\uB2C8\uB2E4.',
      results: (count, text) => `\uAC80\uC0C9 \uACB0\uACFC ${count}\uAC74${text ? `: \"${text}\"` : ''}`,
    },
    ja: {
      title: '\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8',
      subtitle: '\u63A1\u70B9\u9805\u76EE\u3068\u7D50\u679C\u5909\u6570\u306E\u53C2\u7167\u30DA\u30FC\u30B8\u3092\u691C\u7D22\u3067\u304D\u307E\u3059\u3002',
      search: '\u691C\u7D22',
      placeholder: '\u30B3\u30FC\u30C9\u3001\u30BF\u30A4\u30C8\u30EB\u3001\u30AD\u30FC\u30EF\u30FC\u30C9\u3067\u691C\u7D22...',
      empty: '\u8A72\u5F53\u3059\u308B\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u3088\u308A\u5E45\u5E83\u3044\u30AD\u30FC\u30EF\u30FC\u30C9\u3092\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002',
      idle: '\u691C\u7D22\u8A9E\u3092\u5165\u529B\u3059\u308B\u3068\u7D50\u679C\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002',
      results: (count, text) => `\u691C\u7D22\u7D50\u679C ${count}\u4EF6${text ? `: \"${text}\"` : ''}`,
    },
    es: {
      title: 'Documentacion',
      subtitle: 'Busque paginas de referencia de codigos y variables de resultados.',
      search: 'Buscar',
      placeholder: 'Buscar por codigo, titulo o palabra clave...',
      empty: 'No se encontraron documentos coincidentes. Pruebe una palabra clave mas amplia.',
      idle: 'Escriba una palabra clave para ver resultados.',
      results: (count, text) => `${count} resultado${count === 1 ? '' : 's'}${text ? ` para \"${text}\"` : ''}`,
    },
    pt: {
      title: 'Documentacao',
      subtitle: 'Pesquise paginas de referencia de codigos e variaveis de resultado.',
      search: 'Buscar',
      placeholder: 'Buscar por codigo, titulo ou palavra-chave...',
      empty: 'Nenhum documento correspondente foi encontrado. Tente uma palavra-chave mais ampla.',
      idle: 'Digite uma palavra-chave para ver resultados.',
      results: (count, text) => `${count} resultado${count === 1 ? '' : 's'}${text ? ` para \"${text}\"` : ''}`,
    },
  };

  const text = labels[activeLang];

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <h1 className="text-3xl font-bold text-slate-800">{text.title}</h1>
        <p className="mt-2 text-slate-600">{text.subtitle}</p>

        <form action="/docs" method="get" className="mt-6">
          <input type="hidden" name="lang" value={activeLang} />
          <label htmlFor="docs-query" className="sr-only">
            Search documentation
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="docs-query"
              name="q"
              defaultValue={query}
              placeholder={text.placeholder}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
            />
            <button
              type="submit"
              aria-label={text.search}
              title={text.search}
              className="inline-flex items-center justify-center rounded-md bg-[var(--brand-700)] px-3 py-2 text-white hover:bg-[var(--brand-700-hover)]"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </form>

        {!hasQuery ? (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">{text.idle}</div>
        ) : filteredRoutes.length === 0 ? (
          <>
            <p className="mt-3 text-sm text-slate-500">{text.results(filteredRoutes.length, query)}</p>
            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">{text.empty}</div>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-slate-500">{text.results(filteredRoutes.length, query)}</p>
            <ul className="mt-6 space-y-3">
              {filteredRoutes.map((route) => {
                const content = resolveDocContent(route, activeLang);
                return (
                  <li
                    key={route.slug.join('/')}
                    className="group rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--brand-200)] hover:shadow"
                  >
                    <Link href={`/docs/${route.slug.join('/')}?lang=${activeLang}`} className="block">
                      <span className="break-words text-base font-semibold text-slate-800 group-hover:text-[var(--brand-700)]">{content.title}</span>
                      <p className="mt-1 text-xs text-slate-400">/{route.slug.join('/')}</p>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{content.description}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
