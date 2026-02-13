'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 mt-16 py-8 border-t border-slate-200/50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-xs text-slate-500 space-y-4">
          <h3 className="font-semibold text-sm text-slate-700">
            {t('modal.privacy.title')}
          </h3>
          <p className="leading-relaxed">
            {t('modal.privacy.noticeText_part1')}
            <br />
            {t('modal.privacy.noticeText_part2')}
            <br />
            {t('modal.privacy.noticeText_part3')}
          </p>
          <p>
            <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-700">
              {t('links.privacy')}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
