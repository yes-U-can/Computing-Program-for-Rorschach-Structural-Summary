'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightOnRectangleIcon, UserCircleIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.56 2.68-3.86 2.68-6.62z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.98 10.72A5.41 5.41 0 0 1 3.7 9c0-.6.1-1.2.28-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.02-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58A8.97 8.97 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.02 2.33c.7-2.12 2.68-3.7 5.02-3.7z"/>
    </svg>
  );
}

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
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <LanguageSelector />
            <div className="w-px h-6 bg-slate-200"></div>
            {status === 'loading' ? (
              <div className="h-10 w-44 bg-slate-200 rounded-md animate-pulse"></div>
            ) : session ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-[#4E73AA] hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4E73AA]"
              >
                <GoogleIcon />
                <span>{t('auth.googleContinue')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
