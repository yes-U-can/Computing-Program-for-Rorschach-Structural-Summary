import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getPrivacySection, getPrivacySections, PRIVACY_SECTIONS } from '@/lib/privacySections';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export function generateStaticParams() {
  return PRIVACY_SECTIONS.map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  const section = getPrivacySection(slug, activeLang) ?? getPrivacySection(slug, 'en');

  if (!section) {
    return {
      title: 'Privacy Policy',
      alternates: {
        canonical: '/privacy',
        languages: buildLanguageAlternates('/privacy'),
      },
    };
  }

  return {
    title: `${section.title} | Privacy Policy`,
    description: section.body[0],
    alternates: {
      canonical: `/privacy/${section.slug}`,
      languages: buildLanguageAlternates(`/privacy/${section.slug}`),
    },
  };
}

export default async function PrivacyDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  const section = getPrivacySection(slug, activeLang) ?? getPrivacySection(slug, 'en');
  if (!section) notFound();
  const sections = getPrivacySections(activeLang);
  const indexLabel: Record<Language, string> = {
    en: 'Privacy Policy',
    ko: '개인정보처리방침',
    ja: 'プライバシーポリシー',
    es: 'Politica de Privacidad',
    pt: 'Politica de Privacidade',
  };
  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <section className="mb-6 rounded-xl border border-[var(--brand-200)] bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/privacy?lang=${activeLang}`}
                className="rounded-md border border-[var(--brand-200)] bg-[var(--brand-200)]/25 px-2.5 py-1 text-xs font-semibold text-[var(--brand-700)] transition-colors hover:bg-[var(--brand-200)]/40"
              >
                ← {indexLabel[activeLang]}
              </Link>
              {sections.map((item) => (
                <Link
                  key={item.slug}
                  href={`/privacy/${item.slug}?lang=${activeLang}`}
                  className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                    item.slug === slug
                      ? 'border-[var(--brand-700)] bg-[var(--brand-700)] text-white'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-[var(--brand-200)] hover:bg-slate-50'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </section>

          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">{section.title}</h1>
            <div className="mt-6 space-y-3 text-base leading-7 text-slate-700">
              {section.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
