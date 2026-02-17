import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CopyDocButton from '@/components/docs/CopyDocButton';
import DocSuggestionPanel from '@/components/ref/DocSuggestionPanel';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { findDocRouteBySlug, getAllDocRoutes, getDocChildren, resolveDocContent } from '@/lib/docsCatalog';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ lang?: string }>;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export async function generateStaticParams() {
  return getAllDocRoutes().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  if (!slug?.length) {
    return {
      title: 'Documentation',
      alternates: {
        canonical: '/ref',
        languages: buildLanguageAlternates('/ref'),
      },
    };
  }
  const route = findDocRouteBySlug(slug);
  if (!route) {
    return {
      title: 'Documentation',
      alternates: {
        canonical: '/ref',
        languages: buildLanguageAlternates('/ref'),
      },
    };
  }
  const content = resolveDocContent(route, activeLang);
  return {
    title: `${content.title} | Docs`,
    description: content.description,
    alternates: {
      canonical: `/ref/${slug.join('/')}`,
      languages: buildLanguageAlternates(`/ref/${slug.join('/')}`),
    },
  };
}

export default async function DocDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  if (!slug?.length) notFound();
  const route = findDocRouteBySlug(slug);
  if (!route) notFound();

  const content = resolveDocContent(route, activeLang);
  const docSlug = slug.join('/');
  const level1Items = getDocChildren([]);
  const selectedLevel1 = slug[0] ?? level1Items[0]?.slug[0];

  const level2Prefix = selectedLevel1 ? [selectedLevel1] : [];
  const level2Items = level2Prefix.length ? getDocChildren(level2Prefix) : [];
  const selectedLevel2 = slug[1] ?? level2Items[0]?.slug[1];

  const level3Prefix = selectedLevel1 && selectedLevel2 ? [selectedLevel1, selectedLevel2] : [];
  const level3Items = level3Prefix.length ? getDocChildren(level3Prefix) : [];

  const docsLabel: Record<Language, string> = {
    en: 'Reference',
    ko: '참조',
    ja: '参照',
    es: 'Referencia',
    pt: 'Referência',
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <section className="mb-6 rounded-xl border border-[var(--brand-200)] bg-white p-4 shadow-sm">
          <div>
            <div className="flex flex-wrap gap-2 pb-3">
              <Link
                href={`/ref?lang=${activeLang}`}
                className="rounded-md border border-[var(--brand-200)] bg-[var(--brand-200)]/25 px-2.5 py-1 text-xs font-semibold text-[var(--brand-700)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--brand-200)]/40 hover:shadow-sm active:translate-y-0"
              >
                ← {docsLabel[activeLang]}
              </Link>
              {level1Items.map((item) => {
                const itemTitle = resolveDocContent(item, activeLang).title;
                const itemPath = item.slug.join('/');
                const currentPath = slug.join('/');
                const isActive = itemPath === currentPath;
                const isInPath = currentPath.startsWith(`${itemPath}/`);

                return (
                  <Link
                    key={`l1-${itemPath}`}
                    href={`/ref/${itemPath}?lang=${activeLang}`}
                    className={`rounded-md border px-2.5 py-1 text-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 ${
                      isActive
                        ? 'border-[var(--brand-700)] bg-[var(--brand-700)] text-white'
                        : isInPath
                          ? 'border-[var(--brand-200)] bg-[var(--brand-200)]/20 text-[var(--brand-700)]'
                          : 'border-slate-300 bg-white text-slate-600 hover:border-[var(--brand-200)] hover:bg-slate-50'
                    }`}
                  >
                    {itemTitle}
                  </Link>
                );
              })}
            </div>

            <div className="mt-2 flex flex-wrap gap-2 border-t border-slate-200 pt-3">
              {level2Items.map((item) => {
                const itemTitle = resolveDocContent(item, activeLang).title;
                const itemPath = item.slug.join('/');
                const currentPath = slug.join('/');
                const isActive = itemPath === currentPath;
                const isInPath = currentPath.startsWith(`${itemPath}/`);

                return (
                  <Link
                    key={`l2-${itemPath}`}
                    href={`/ref/${itemPath}?lang=${activeLang}`}
                    className={`rounded-md border px-2.5 py-1 text-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 ${
                      isActive
                        ? 'border-[var(--brand-700)] bg-[var(--brand-700)] text-white'
                        : isInPath
                          ? 'border-[var(--brand-200)] bg-[var(--brand-200)]/20 text-[var(--brand-700)]'
                          : 'border-slate-300 bg-white text-slate-600 hover:border-[var(--brand-200)] hover:bg-slate-50'
                    }`}
                  >
                    {itemTitle}
                  </Link>
                );
              })}
            </div>

            <div className="mt-2 flex flex-wrap gap-2 border-t border-slate-200 pt-3">
              {level3Items.map((item) => {
                const itemTitle = resolveDocContent(item, activeLang).title;
                const itemPath = item.slug.join('/');
                const currentPath = slug.join('/');
                const isActive = itemPath === currentPath;
                const isInPath = currentPath.startsWith(`${itemPath}/`);

                return (
                  <Link
                    key={`l3-${itemPath}`}
                    href={`/ref/${itemPath}?lang=${activeLang}`}
                    className={`rounded-md border px-2.5 py-1 text-xs transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 ${
                      isActive
                        ? 'border-[var(--brand-700)] bg-[var(--brand-700)] text-white'
                        : isInPath
                          ? 'border-[var(--brand-200)] bg-[var(--brand-200)]/20 text-[var(--brand-700)]'
                          : 'border-slate-300 bg-white text-slate-600 hover:border-[var(--brand-200)] hover:bg-slate-50'
                    }`}
                  >
                    {itemTitle}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="break-words text-2xl font-bold text-slate-800 sm:text-3xl">{content.title}</h1>
            <CopyDocButton text={`${content.title}\n\n${content.description}`} />
          </div>
          <p className="mt-6 whitespace-pre-wrap text-base leading-7 text-slate-700">{content.description}</p>
        </div>
        <DocSuggestionPanel docSlug={docSlug} language={activeLang} />
      </main>
      <Footer />
    </div>
  );
}



