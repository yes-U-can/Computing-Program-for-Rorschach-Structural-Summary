import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CopyDocButton from '@/components/docs/CopyDocButton';
import { findDocRouteBySlug, getAllDocRoutes, resolveDocContent } from '@/lib/docsCatalog';

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
  return getAllDocRoutes().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug?.length) {
    return {
      title: 'Documentation',
      alternates: {
        canonical: '/docs',
      },
    };
  }
  const route = findDocRouteBySlug(slug);
  if (!route) {
    return {
      title: 'Documentation',
      alternates: {
        canonical: '/docs',
      },
    };
  }
  const content = resolveDocContent(route, 'en');
  return {
    title: `${content.title} | Docs`,
    description: content.description,
    alternates: {
      canonical: `/docs/${slug.join('/')}`,
    },
  };
}

export default async function DocDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug?.length) notFound();
  const route = findDocRouteBySlug(slug);
  if (!route) notFound();

  const content = resolveDocContent(route, 'en');
  const parentSegments = slug.slice(0, -1);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/docs" className="hover:text-slate-700">
          Docs
        </Link>
        {parentSegments.map((seg, idx) => {
          const href = `/docs/${slug.slice(0, idx + 1).join('/')}`;
          return (
            <span key={`${seg}-${idx}`}>
              {' '}
              /{' '}
              <Link href={href} className="hover:text-slate-700">
                {seg}
              </Link>
            </span>
          );
        })}
      </nav>

      <div
        className="rounded-lg border border-slate-200 bg-white p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="break-words text-2xl font-bold text-slate-800 sm:text-3xl">{content.title}</h1>
          <CopyDocButton text={`${content.title}\n\n${content.description}`} />
        </div>
        <p className="mt-6 whitespace-pre-wrap text-base leading-7 text-slate-700">{content.description}</p>
      </div>
    </main>
  );
}
