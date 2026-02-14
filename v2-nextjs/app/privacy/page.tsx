import Link from 'next/link';
import type { Metadata } from 'next';
import { PRIVACY_SECTIONS } from '@/lib/privacySections';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy index and subpages for this service.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-4 text-slate-600">
        This page explains how account, API key, and AI chat data are handled in this service.
      </p>

      <div className="mt-8 space-y-4">
        {PRIVACY_SECTIONS.map((section) => (
          <section key={section.slug} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-800">
              <Link href={`/privacy/${section.slug}`} className="hover:text-[#4E73AA]">
                {section.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{section.body[0]}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
