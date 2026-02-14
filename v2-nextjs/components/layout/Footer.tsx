'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 mt-16 py-8 border-t border-slate-200/50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 1997-2026 Seoul Institute of Clinical Psychology (SICP). All rights reserved.</p>
          <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-700">
            {t('links.privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
