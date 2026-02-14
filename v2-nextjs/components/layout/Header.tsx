'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightOnRectangleIcon, UserCircleIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';

const UserMenu = () => {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!session || !session.user) return null;

  const { user } = session;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block rounded-lg border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4E73AA]"
        aria-label="Open user menu"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || 'User profile picture'}
            width={40}
            height={40}
            className="rounded-lg"
          />
        ) : (
          <UserCircleIcon className="h-10 w-10 text-slate-500" />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-sm text-slate-500 truncate">{user.email}</p>
            </div>
            <Link
              href="/account"
              className="text-slate-700 group flex items-center px-4 py-2 text-sm hover:bg-slate-100"
              role="menuitem"
              tabIndex={-1}
              onClick={() => setIsOpen(false)}
            >
              <Cog8ToothIcon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" aria-hidden="true" />
              {t('nav.account')}
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full text-left text-slate-700 group flex items-center px-4 py-2 text-sm hover:bg-slate-100"
              role="menuitem"
              tabIndex={-1}
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500" aria-hidden="true" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Header() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  return (
    <header className="relative z-10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
              Computing Program for Rorschach Structural Summary
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Copyright 1997-2026 Seoul Institute of Clinical Psychology (SICP). All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <LanguageSelector />
            <div className="w-px h-6 bg-slate-200"></div>
            {status === 'loading' ? (
              <div className="h-10 w-24 bg-slate-200 rounded-md animate-pulse"></div>
            ) : session ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => signIn('google')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#2A5F7F] bg-[#C1D2DC]/30 hover:bg-[#C1D2DC]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4E73AA]"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
