'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import type { ChatSession } from '@prisma/client';

type ChatHistorySidebarProps = {
  onSessionSelect: (sessionId: string) => void;
  selectedSessionId: string | null;
};

export default function ChatHistorySidebar({ onSessionSelect, selectedSessionId }: ChatHistorySidebarProps) {
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
  }, []);

  if (isLoading) {
    return <div className="p-4 text-sm text-slate-500">{t('chat.loading')}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">{t('chat.history')}</h2>
      {error && (
        <p className="text-sm text-rose-500 mb-3">{t('chat.errorMessage')}</p>
      )}
      {sessions.length === 0 && !error ? (
        <div className="flex flex-col items-center py-8 text-center">
          <ChatBubbleLeftRightIcon className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">{t('chat.noSessions')}</p>
          <p className="mt-1 text-xs text-slate-400">{t('chat.startNew')}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li key={session.id}>
              <button
                onClick={() => onSessionSelect(session.id)}
                className={`w-full text-left p-2 rounded-md transition-colors ${
                  selectedSessionId === session.id
                    ? 'bg-[#C1D2DC]/30 text-[#2A5F7F]'
                    : 'hover:bg-slate-100'
                }`}
              >
                <p className="font-semibold truncate">{session.title}</p>
                <p className={`text-xs ${
                  selectedSessionId === session.id ? 'text-[#4E73AA]' : 'text-slate-500'
                }`}>{new Date(session.updatedAt).toLocaleString()}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


