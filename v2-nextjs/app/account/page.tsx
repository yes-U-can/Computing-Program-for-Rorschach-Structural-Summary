'use client';

import { useSession } from 'next-auth/react';
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

import ApiKeyManager from '@/components/account/ApiKeyManager';
import KnowledgeSourceManager from '@/components/account/KnowledgeSourceManager';
import SkillBookManager from '@/components/account/SkillBookManager';
import CreditBalancePanel from '@/components/account/CreditBalancePanel';
import DocSuggestionReviewPanel from '@/components/account/DocSuggestionReviewPanel';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const { t, language } = useTranslation();
  const router = useRouter();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isCancellingDeletion, setIsCancellingDeletion] = useState(false);
  const [deletionRequestedAt, setDeletionRequestedAt] = useState<string | null>(null);
  const [deletionScheduledAt, setDeletionScheduledAt] = useState<string | null>(null);
  const [isDocReviewAdmin, setIsDocReviewAdmin] = useState(false);
  const deleteAccountTextsByLanguage = {
    ko: {
      confirm: '회원탈퇴를 예약하시겠습니까? 지금부터 7일 후 계정이 완전히 삭제됩니다.',
      failed: '회원탈퇴 예약 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      statusFailed: '회원탈퇴 예약 상태를 불러오지 못했습니다.',
      processing: '예약 처리 중...',
      button: '회원탈퇴 예약',
      cancelConfirm: '예약된 회원탈퇴를 취소하시겠습니까?',
      cancelFailed: '회원탈퇴 예약 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      cancelling: '취소 처리 중...',
      cancelButton: '회원탈퇴 취소',
      scheduledLabel: '예약된 탈퇴 시점',
      infoTitle: '회원탈퇴 안내',
      info1: '버튼을 누르면 즉시 삭제되지 않으며, 7일 유예 후 자동으로 삭제됩니다.',
      info2: 'Google 계정 연결 해제는 Google 계정 관리(앱 연결 권한)에서 별도로 진행해야 합니다.',
      info3: '완전한 정리를 원하시면 (1) 여기서 회원탈퇴 예약 후 (2) Google 계정에서 앱 연결 해제를 진행해 주세요.',
    },
    en: {
      confirm: 'Schedule account deletion? Your account will be permanently deleted after 7 days.',
      failed: 'Failed to schedule account deletion. Please try again.',
      statusFailed: 'Failed to load scheduled deletion status.',
      processing: 'Scheduling...',
      button: 'Schedule Account Deletion',
      cancelConfirm: 'Cancel the scheduled account deletion?',
      cancelFailed: 'Failed to cancel scheduled deletion. Please try again.',
      cancelling: 'Cancelling...',
      cancelButton: 'Cancel Scheduled Deletion',
      scheduledLabel: 'Scheduled deletion time',
      infoTitle: 'Account Deletion Notice',
      info1: 'Deletion is not immediate. Your account is automatically deleted after a 7-day grace period.',
      info2: 'Disconnecting your Google account must be done separately in Google Account settings (app access).',
      info3: 'For full cleanup: (1) schedule deletion here, then (2) revoke app access in your Google account.',
    },
    ja: {
      confirm: '退会を予約しますか？7日後にアカウントが完全に削除されます。',
      failed: '退会予約に失敗しました。しばらくしてから再試行してください。',
      statusFailed: '退会予約の状態を読み込めませんでした。',
      processing: '予約処理中...',
      button: '退会を予約',
      cancelConfirm: '予約済みの退会を取り消しますか？',
      cancelFailed: '退会予約の取り消しに失敗しました。しばらくしてから再試行してください。',
      cancelling: '取り消し中...',
      cancelButton: '退会予約を取り消す',
      scheduledLabel: '削除予定日時',
      infoTitle: '退会のご案内',
      info1: 'ボタンを押しても即時削除はされず、7日間の猶予後に自動削除されます。',
      info2: 'Google連携の解除は、Googleアカウント管理（アプリ連携権限）で別途行ってください。',
      info3: '完全に整理するには、(1)ここで退会予約後、(2)Googleアカウントで連携解除を行ってください。',
    },
    es: {
      confirm: '¿Programar la eliminación de la cuenta? Se eliminará permanentemente después de 7 días.',
      failed: 'No se pudo programar la eliminación de la cuenta. Inténtalo de nuevo.',
      statusFailed: 'No se pudo cargar el estado de eliminación programada.',
      processing: 'Programando...',
      button: 'Programar eliminación de cuenta',
      cancelConfirm: '¿Cancelar la eliminación programada de la cuenta?',
      cancelFailed: 'No se pudo cancelar la eliminación programada. Inténtalo de nuevo.',
      cancelling: 'Cancelando...',
      cancelButton: 'Cancelar eliminación programada',
      scheduledLabel: 'Fecha programada de eliminación',
      infoTitle: 'Aviso de eliminación de cuenta',
      info1: 'La eliminación no es inmediata. Tu cuenta se elimina automáticamente después de 7 días.',
      info2: 'La desconexión de Google debe hacerse por separado en la configuración de tu cuenta de Google.',
      info3: 'Para una limpieza completa: (1) programa la eliminación aquí y (2) revoca el acceso de la app en Google.',
    },
    pt: {
      confirm: 'Agendar exclusão da conta? Sua conta será excluída permanentemente após 7 dias.',
      failed: 'Falha ao agendar a exclusão da conta. Tente novamente.',
      statusFailed: 'Falha ao carregar o status da exclusão agendada.',
      processing: 'Agendando...',
      button: 'Agendar exclusão da conta',
      cancelConfirm: 'Cancelar a exclusão agendada da conta?',
      cancelFailed: 'Falha ao cancelar a exclusão agendada. Tente novamente.',
      cancelling: 'Cancelando...',
      cancelButton: 'Cancelar exclusão agendada',
      scheduledLabel: 'Horário da exclusão agendada',
      infoTitle: 'Aviso de exclusão de conta',
      info1: 'A exclusão não é imediata. Sua conta será removida automaticamente após 7 dias.',
      info2: 'A desconexão da conta Google deve ser feita separadamente nas configurações da conta Google.',
      info3: 'Para remoção completa: (1) agende a exclusão aqui e (2) revogue o acesso do app na sua conta Google.',
    },
  };
  const deleteAccountTexts = deleteAccountTextsByLanguage[language] ?? deleteAccountTextsByLanguage.ko;

  const [autoCreateSkillBook] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URL(window.location.href).searchParams.get('create') === '1';
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const create = url.searchParams.get('create') === '1';
    if (create) {
      url.searchParams.delete('create');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash || ''}`);
    }
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') {
      setIsDocReviewAdmin(false);
      return;
    }

    let cancelled = false;
    const loadAdminStatus = async () => {
      try {
        const res = await fetch('/api/user/admin-status');
        if (!res.ok) {
          if (!cancelled) setIsDocReviewAdmin(false);
          return;
        }
        const data = (await res.json()) as { docReviewAdmin?: boolean };
        if (!cancelled) setIsDocReviewAdmin(Boolean(data.docReviewAdmin));
      } catch {
        if (!cancelled) setIsDocReviewAdmin(false);
      }
    };

    void loadAdminStatus();
    return () => {
      cancelled = true;
    };
  }, [status]);

  useEffect(() => {
    if (!session?.user?.email) return;

    const loadDeletionStatus = async () => {
      try {
        const response = await fetch('/api/user/account', { method: 'GET' });
        if (!response.ok) {
          throw new Error('failed');
        }
        const payload = await response.json();
        setDeletionRequestedAt(payload.deletionRequestedAt ?? null);
        setDeletionScheduledAt(payload.deletionScheduledAt ?? null);
      } catch {
        alert(deleteAccountTexts.statusFailed);
      }
    };

    loadDeletionStatus();
  }, [session?.user?.email, deleteAccountTexts.statusFailed]);

  const handleDeleteAccount = async () => {
    if (isDeletingAccount) return;
    const confirmed = window.confirm(deleteAccountTexts.confirm);
    if (!confirmed) return;

    setIsDeletingAccount(true);
    try {
      const response = await fetch('/api/user/account', { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('failed');
      }
      const payload = await response.json();
      setDeletionRequestedAt(payload.deletionRequestedAt ?? null);
      setDeletionScheduledAt(payload.deletionScheduledAt ?? null);
    } catch {
      alert(deleteAccountTexts.failed);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleCancelDeletion = async () => {
    if (isCancellingDeletion) return;
    const confirmed = window.confirm(deleteAccountTexts.cancelConfirm);
    if (!confirmed) return;

    setIsCancellingDeletion(true);
    try {
      const response = await fetch('/api/user/account', { method: 'PATCH' });
      if (!response.ok) {
        throw new Error('failed');
      }
      setDeletionRequestedAt(null);
      setDeletionScheduledAt(null);
    } catch {
      alert(deleteAccountTexts.cancelFailed);
    } finally {
      setIsCancellingDeletion(false);
    }
  };

  const hasScheduledDeletion = Boolean(deletionRequestedAt && deletionScheduledAt);
  const scheduledDateLabel = deletionScheduledAt
    ? new Date(deletionScheduledAt).toLocaleString(language)
    : null;

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
              <ul className="space-y-2">
                <li><a href="#api-keys" className="font-semibold text-[var(--brand-500)]">{t('account.apiKeys.title')}</a></li>
                <li><a href="#my-skillbooks" className="text-slate-600 hover:text-[var(--brand-500)]">{t('skillBook.myBooks.title')}</a></li>
                <li><a href="#credits" className="text-slate-600 hover:text-[var(--brand-500)]">Credits</a></li>
                {isDocReviewAdmin && (
                  <li><a href="#doc-review" className="text-slate-600 hover:text-[var(--brand-500)]">Doc Review</a></li>
                )}
                <li><a href="#knowledge-sources" className="text-slate-600 hover:text-[var(--brand-500)]">{t('account.knowledgeSources.title')}</a></li>
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
                <div className="mt-4 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
                  <SkillBookManager autoCreate={autoCreateSkillBook} />
                </div>
              </section>

              <section id="credits">
                <h2 className="text-xl font-semibold text-slate-700">Credits</h2>
                <p className="mt-1 text-sm text-slate-500">Balance and transaction history for store and builder usage.</p>
                <div className="mt-4 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
                  <CreditBalancePanel />
                </div>
              </section>

              <section id="knowledge-sources">
                <h2 className="text-xl font-semibold text-slate-700">{t('account.knowledgeSources.title')}</h2>
                <div className="mt-4 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
                  <KnowledgeSourceManager />
                </div>
              </section>

              {isDocReviewAdmin && (
                <section id="doc-review">
                  <h2 className="text-xl font-semibold text-slate-700">Doc Suggestion Review</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Admin queue for accepting or rejecting reference-page improvement suggestions.
                  </p>
                  <div className="mt-4 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
                    <DocSuggestionReviewPanel />
                  </div>
                </section>
              )}

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
                    {!hasScheduledDeletion && (
                      <Button variant="danger" onClick={handleDeleteAccount} disabled={isDeletingAccount}>
                        {isDeletingAccount ? deleteAccountTexts.processing : deleteAccountTexts.button}
                      </Button>
                    )}
                    {hasScheduledDeletion && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-rose-700">
                          {deleteAccountTexts.scheduledLabel}: {scheduledDateLabel}
                        </p>
                        <Button variant="secondary" onClick={handleCancelDeletion} disabled={isCancellingDeletion}>
                          {isCancellingDeletion ? deleteAccountTexts.cancelling : deleteAccountTexts.cancelButton}
                        </Button>
                      </div>
                    )}
                    <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                      <p className="font-semibold">{deleteAccountTexts.infoTitle}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>{deleteAccountTexts.info1}</li>
                        <li>{deleteAccountTexts.info2}</li>
                        <li>{deleteAccountTexts.info3}</li>
                      </ul>
                    </div>
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
