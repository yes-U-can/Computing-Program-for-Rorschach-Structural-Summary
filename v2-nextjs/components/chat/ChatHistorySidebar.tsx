'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ChatBubbleLeftRightIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { ChatSession } from '@prisma/client';

type ChatHistorySidebarProps = {
  onSessionSelect: (sessionId: string | null) => void;
  onNewChat: () => void;
  selectedSessionId: string | null;
  refreshTrigger?: number;
};

export default function ChatHistorySidebar({
  onSessionSelect,
  onNewChat,
  selectedSessionId,
  refreshTrigger = 0,
}: ChatHistorySidebarProps) {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      setIsLoading(true);
      setError(false);
      try {
        const response = await fetch('/api/chat/sessions');
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, [refreshTrigger]);

  if (isLoading) {
    return <div className="p-4 text-sm text-slate-500">{t('chat.loading')}</div>;
  }

  async function handleDeleteSession(sessionId: string) {
    const confirmed = window.confirm('이 대화 기록을 삭제할까요?');
    if (!confirmed) return;

    setDeletingSessionId(sessionId);
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete session');
      }
      setSessions((prev) => prev.filter((item) => item.id !== sessionId));
      if (selectedSessionId === sessionId) {
        onSessionSelect(null);
      }
    } catch {
      alert('대화 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setDeletingSessionId(null);
    }
  }

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-3 border-b border-slate-200 pb-2.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-800">{t('chat.history')}</h2>
          <button
            onClick={onNewChat}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            {t('chat.newChat')}
          </button>
        </div>
      </div>
      {error && (
        <p className="text-sm text-rose-500 mb-3">{t('chat.errorMessage')}</p>
      )}
      {sessions.length === 0 && !error ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <ChatBubbleLeftRightIcon className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">{t('chat.noSessions')}</p>
          <p className="mt-1 text-xs text-slate-400">{t('chat.startNew')}</p>
        </div>
      ) : (
        <ul className="space-y-1.5 overflow-y-auto pr-1 pb-safe">
          {sessions.map((session) => {
            return (
              <li key={session.id}>
                <div
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 transition-all ${
                    selectedSessionId === session.id
                      ? 'border-[var(--brand-300)] bg-[var(--brand-200)]/20 text-[var(--brand-700)] shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <button
                    onClick={() => onSessionSelect(session.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className={`text-xs ${
                      selectedSessionId === session.id ? 'text-[var(--brand-500)]' : 'text-slate-500'
                    }`}>{new Date(session.createdAt).toLocaleString()}</p>
                  </button>
                  <button
                    onClick={() => void handleDeleteSession(session.id)}
                    disabled={deletingSessionId === session.id}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-transparent text-slate-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                    title="대화 삭제"
                    aria-label="대화 삭제"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
