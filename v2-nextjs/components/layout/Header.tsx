'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRightOnRectangleIcon, UserCircleIcon, HomeIcon } from '@heroicons/react/24/outline';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.56 2.68-3.86 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.98 10.72A5.41 5.41 0 0 1 3.7 9c0-.6.1-1.2.28-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.02-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A8.97 8.97 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.02 2.33c.7-2.12 2.68-3.7 5.02-3.7z" />
    </svg>
  );
}

export default function Header() {
  const { data: session, status } = useSession();
  const { t, language } = useTranslation();
  const pathname = usePathname();

  const isHome = pathname === '/';
  const hideGlobalNav =
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/terms');

  const user = session?.user;
  const hasUserImage = typeof user?.image === 'string' && user.image.length > 0;

  const introByLang = {
    en: {
      line1: 'Web tool for Exner CS Structural Summary calculation in the Rorschach test.',
      line2: 'Results are for reference and do not replace clinical judgment.',
    },
    ko: {
      line1: '로샤 심리검사 Exner(CS)체계 구조요약 계산을 지원하는 웹 도구입니다.',
      line2: '결과는 참고용이며 임상 판단을 대체하지 않습니다.',
    },
    ja: {
      line1: 'ロールシャッハ心理検査のExner CS構造要約計算を支援するWebツールです。',
      line2: '結果は参考情報であり、臨床判断を代替しません。',
    },
    es: {
      line1: 'Herramienta web para el calculo del Structural Summary Exner CS en Rorschach.',
      line2: 'Los resultados son de referencia y no sustituyen el juicio clinico.',
    },
    pt: {
      line1: 'Ferramenta web para calculo do Structural Summary Exner CS no Rorschach.',
      line2: 'Os resultados sao de referencia e nao substituem o julgamento clinico.',
    },
  } as const;

  const navItems = [
    { href: `/ref?lang=${language}`, label: t('nav.more'), active: pathname === '/ref' || pathname.startsWith('/ref/') },
    { href: `/chat?lang=${language}`, label: t('nav.aiAssistant'), active: pathname === '/chat' },
    { href: `/account?lang=${language}`, label: t('nav.accountManage'), active: pathname === '/account' },
  ];

  return (
    <header className="relative z-10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/?lang=${language}`}
              className="group inline-flex items-center gap-2 rounded-xl border border-[var(--brand-200)] bg-gradient-to-b from-white to-[#F8FBFD] px-3 py-2 shadow-[0_4px_14px_rgba(78,115,170,0.08)] transition-all hover:-translate-y-0.5 hover:border-[var(--brand-500)] hover:shadow-[0_8px_18px_rgba(78,115,170,0.14)]"
              aria-label="Go to workspace home"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#E9F0F5] text-[var(--brand-700)] transition-colors group-hover:bg-[var(--brand-700)] group-hover:text-white">
                <HomeIcon className="h-4 w-4" />
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight group-hover:text-[var(--brand-700)]">
                {t('app.title')}
              </h1>
            </Link>

            {status === 'loading' ? (
              <div className="h-10 w-44 bg-slate-200 rounded-md animate-pulse" />
            ) : session ? (
              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                <button
                  onClick={() => signOut({ callbackUrl: `/?lang=${language}` })}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[var(--brand-200)] bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#EEF3F7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-500)] sm:min-h-0 sm:w-auto sm:justify-start sm:text-xs"
                >
                  {hasUserImage ? (
                    <Image
                      src={user.image as string}
                      alt={user.name || t('nav.account')}
                      width={24}
                      height={24}
                      className="rounded-md"
                    />
                  ) : (
                    <UserCircleIcon className="h-5 w-5 text-slate-500" />
                  )}
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </button>
                <div className="hidden h-6 w-px bg-slate-200 sm:block" />
                <LanguageSelector />
              </div>
            ) : (
              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                <button
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  aria-label={t('auth.googleContinue')}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[var(--brand-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-500)] hover:bg-[#EEF3F7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-500)] sm:min-h-0 sm:w-auto"
                >
                  <GoogleIcon />
                  <span>{t('auth.googleContinue')}</span>
                </button>
                <div className="hidden h-6 w-px bg-slate-200 sm:block" />
                <LanguageSelector />
              </div>
            )}
          </div>

          {!hideGlobalNav && (
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              {isHome ? (
                <p className="min-w-0 flex-1 pr-0 text-[11px] leading-snug text-slate-600 lg:pr-4 lg:text-xs">
                  <span className="block">{introByLang[language].line1}</span>
                  <span className="block">{introByLang[language].line2}</span>
                </p>
              ) : (
                <div />
              )}

              {session ? (
                <nav className="overflow-x-auto lg:ml-4 lg:flex-shrink-0">
                  <div className="inline-flex min-w-max overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm divide-x divide-slate-300">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          item.active
                            ? 'bg-[var(--brand-700)] text-white'
                            : 'text-slate-700 hover:bg-[#EEF3F7] hover:text-[var(--brand-700)]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              ) : (
                <p className="text-xs text-slate-600 lg:ml-4 lg:max-w-xl">
                  {t('nav.aiGuide')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
