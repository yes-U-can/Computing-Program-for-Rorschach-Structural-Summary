'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t, language } = useTranslation();
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? '2.0.0';

  const labels = {
    en: {
      about: 'About',
      contact: 'Contact',
      terms: 'Terms',
      copyright: '© 2026 Seoul Institute of Clinical Psychology (SICP) and MOW. All rights reserved.',
    },
    ko: {
      about: '서비스 소개',
      contact: '문의하기',
      terms: '이용약관',
      copyright:
        '© 2026 서울임상심리연구소(Seoul Institute of Clinical Psychology, SICP), 모오(MOW). All rights reserved.',
    },
    ja: {
      about: 'サービス紹介',
      contact: 'お問い合わせ',
      terms: '利用規約',
      copyright: '© 2026 Seoul Institute of Clinical Psychology (SICP) and MOW. All rights reserved.',
    },
    es: {
      about: 'Acerca de',
      contact: 'Contacto',
      terms: 'Terminos',
      copyright: '© 2026 Seoul Institute of Clinical Psychology (SICP) and MOW. All rights reserved.',
    },
    pt: {
      about: 'Sobre',
      contact: 'Contato',
      terms: 'Termos',
      copyright: '© 2026 Seoul Institute of Clinical Psychology (SICP) and MOW. All rights reserved.',
    },
  } as const;

  const text = labels[language];
  const links = [
    { href: `/about?lang=${language}`, label: text.about },
    { href: `/contact?lang=${language}`, label: text.contact },
    { href: `/terms?lang=${language}`, label: text.terms },
    { href: `/privacy?lang=${language}`, label: t('links.privacy') },
  ];

  return (
    <footer className="relative z-10 mt-16 py-8 border-t border-slate-200/50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:hidden space-y-3 text-xs text-slate-500">
          <div className="grid grid-cols-2 gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-center text-xs font-medium text-slate-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-center">Version {appVersion}</p>
          <p className="text-center">{text.copyright}</p>
        </div>

        <div className="hidden sm:flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p>{text.copyright}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="underline underline-offset-2 hover:text-slate-700">
                {link.label}
              </Link>
            ))}
            <span className="text-slate-400">Version {appVersion}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
