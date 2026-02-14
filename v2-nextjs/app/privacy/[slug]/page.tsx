import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPrivacySection, PRIVACY_SECTIONS } from '@/lib/privacySections';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PRIVACY_SECTIONS.map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const section = getPrivacySection(slug);

  if (!section) {
    return {
      title: 'Privacy Policy',
      alternates: { canonical: '/privacy' },
    };
  }

  return {
    title: `${section.title} | Privacy Policy`,
    description: section.body[0],
    alternates: {
      canonical: `/privacy/${section.slug}`,
    },
  };
}

export default async function PrivacyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const section = getPrivacySection(slug);
  if (!section) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/privacy" className="hover:text-[#4E73AA]">
          Privacy Policy
        </Link>
      </nav>

      <article className="rounded-lg border border-slate-200 bg-white p-5">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">{section.title}</h1>
        <div className="mt-6 space-y-3 text-base leading-7 text-slate-700">
          {section.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
