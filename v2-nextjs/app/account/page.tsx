'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SparklesIcon, BookOpenIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

import ApiKeyManager from '@/components/account/ApiKeyManager';
import KnowledgeSourceManager from '@/components/account/KnowledgeSourceManager';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-[#F7F9FB]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-96 bg-slate-200 rounded-md animate-pulse"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{t('account.title')}</h1>
            <p className="mt-2 text-slate-500">{t('account.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              {/* Navigation can go here */}
              <ul className="space-y-2">
                <li><a href="#api-keys" className="font-semibold text-[var(--brand-500)]">{t('account.apiKeys.title')}</a></li>
                <li><a href="#my-skillbooks" className="text-slate-600 hover:text-[var(--brand-500)]">{t('skillBook.myBooks.title')}</a></li>
                <li><a href="#knowledge-sources" className="text-slate-600 hover:text-[var(--brand-500)]">{t('account.knowledgeSources.title')}</a></li>
                <li><a href="#ai-assistant" className="text-slate-600 hover:text-[var(--brand-500)]">{t('nav.aiAssistant')}</a></li>
                <li><a href="#account-settings" className="text-slate-600 hover:text-[var(--brand-500)]">{t('nav.account')}</a></li>
              </ul>
            </div>
            <div className="md:col-span-2 space-y-10">
              <section id="api-keys">
                <h2 className="text-xl font-semibold text-slate-700">{t('account.apiKeys.title')}</h2>
                <div className="mt-4 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
                  <ApiKeyManager />
                </div>
              </section>
              <section id="my-skillbooks">
                <h2 className="text-xl font-semibold text-slate-700">{t('skillBook.myBooks.title')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('skillBook.myBooks.subtitle')}</p>
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
                  <SparklesIcon className="mx-auto h-10 w-10 text-slate-300" />
                  <span className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    {t('skillBook.myBooks.comingSoon')}
                  </span>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                    {t('skillBook.myBooks.comingSoonDesc')}
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
                      <BookOpenIcon className="h-4 w-4" />
                      {t('skillBook.myBooks.created')}
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      {t('skillBook.myBooks.purchased')}
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
                      {t('skillBook.myBooks.export')}
                    </div>
                  </div>
                </div>
              </section>
              <section id="ai-assistant">
                <h2 className="text-xl font-semibold text-slate-700">{t('nav.aiAssistant')}</h2>
                 <div className="mt-4 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
                  <Link href="/chat">
                    <Button variant="primary">
                      {t('nav.aiAssistant')}
                    </Button>
                  </Link>
                </div>
              </section>
              <section id="knowledge-sources">
                <h2 className="text-xl font-semibold text-slate-700">{t('account.knowledgeSources.title')}</h2>
                <div className="mt-4 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
                  <KnowledgeSourceManager />
                </div>
              </section>
              <section id="account-settings">
                <h2 className="text-xl font-semibold text-slate-700">{t('nav.account')}</h2>
                 <div className="mt-4 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="flex items-center gap-4">
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User avatar'}
                        width={56}
                        height={56}
                        className="rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-slate-800">{session.user?.name}</p>
                      <p className="text-sm text-slate-500">{session.user?.email}</p>
                    </div>
                  </div>
                  <div className="mt-6 border-t pt-6">
                    <Button variant="danger" onClick={() => signOut({ callbackUrl: '/' })}>
                      {t('nav.logout')}
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}





