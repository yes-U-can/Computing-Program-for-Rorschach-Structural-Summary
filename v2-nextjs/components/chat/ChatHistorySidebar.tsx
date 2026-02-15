'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { ChatSession } from '@prisma/client';

type ChatHistorySidebarProps = {
  onSessionSelect: (sessionId: string) => void;
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

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800">{t('chat.history')}</h2>
          <button
            onClick={onNewChat}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-800"
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
        <ul className="space-y-2 overflow-y-auto pr-1 pb-safe">
          {sessions.map((session) => (
            <li key={session.id}>
              <button
                onClick={() => onSessionSelect(session.id)}
                className={`w-full rounded-lg border p-3 text-left transition-all ${
                  selectedSessionId === session.id
                    ? 'border-[var(--brand-200)] bg-[var(--brand-200)]/25 text-[var(--brand-700)] shadow-sm'
                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-semibold truncate">{session.title}</p>
                <p className={`text-xs ${
                  selectedSessionId === session.id ? 'text-[var(--brand-500)]' : 'text-slate-500'
                }`}>{new Date(session.updatedAt).toLocaleString()}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
