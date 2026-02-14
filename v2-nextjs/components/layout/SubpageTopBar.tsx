'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES, type Language } from '@/i18n/config';
import { useTranslation } from '@/hooks/useTranslation';

type Props = {
  activeLang: Language;
};

export default function SubpageTopBar({ activeLang }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { setLanguage } = useTranslation();

  const switchLanguage = (lang: Language) => {
    setLanguage(lang);
    const nextParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    nextParams.set('lang', lang);
    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="mb-6 rounded-2xl border border-[var(--brand-200)] bg-gradient-to-b from-white to-[#F8FBFD] px-4 py-3 shadow-[0_8px_24px_rgba(78,115,170,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#E9F0F5] font-semibold text-[var(--brand-700)]">N</span>
          <span className="text-slate-400">/</span>
          <Link href={`/?lang=${activeLang}`} className="rounded-md px-2 py-1 font-medium text-slate-700 hover:bg-white hover:text-[var(--brand-700)]">
            Workspace
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-inner">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => switchLanguage(lang)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              lang === activeLang
                ? 'bg-white text-[var(--brand-700)] shadow-sm ring-1 ring-[var(--brand-200)]'
                : 'text-slate-600 hover:bg-white hover:text-slate-800'
            }`}
          >
            {LANGUAGE_NAMES[lang]}
          </button>
        ))}
        </div>
      </div>
    </div>
  );
}

