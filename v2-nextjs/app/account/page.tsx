'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
                <li><a href="#api-keys" className="font-semibold text-[#4E73AA]">{t('account.apiKeys.title')}</a></li>
                <li><a href="#knowledge-sources" className="text-slate-600 hover:text-[#4E73AA]">{t('account.knowledgeSources.title')}</a></li>
                <li><a href="#ai-assistant" className="text-slate-600 hover:text-[#4E73AA]">{t('nav.aiAssistant')}</a></li>
                <li><a href="#account-settings" className="text-slate-600 hover:text-[#4E73AA]">{t('nav.account')}</a></li>
              </ul>
            </div>
            <div className="md:col-span-2 space-y-10">
              <section id="api-keys">
                <h2 className="text-xl font-semibold text-slate-700">{t('account.apiKeys.title')}</h2>
                <div className="mt-4 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
                  <ApiKeyManager />
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




