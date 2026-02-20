'use client';

import { useEffect, useState } from 'react';
import type { ChatMessage } from '@prisma/client';
import { getCondensedSystemMessage } from '@/lib/chatMessageVisibility';
import { toPlainTextChat } from '@/lib/chatPlainText';

export default function ChatMessageView({ sessionId }: { sessionId: string | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    async function fetchMessages() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/chat/sessions/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Failed to fetch messages', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMessages();
  }, [sessionId]);

  if (isLoading) {
    return <div className="p-4 text-sm text-slate-500">Loading messages...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message) => {
          const condensed = getCondensedSystemMessage(message.content);
          if (condensed) {
            return (
              <div key={message.id} className="flex justify-center">
                <p className="max-w-[90%] rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
                  {condensed}
                </p>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`w-fit max-w-[calc(100%-2rem)] sm:max-w-[86%] px-4 py-2.5 shadow-sm ring-1 ${
                  message.role === 'ai'
                    ? 'rounded-2xl rounded-bl-md bg-white text-slate-800 ring-slate-200'
                    : 'rounded-2xl rounded-br-md bg-[var(--brand-700)] text-white ring-[var(--brand-700)]/20'
                }`}
              >
                <p className="whitespace-pre-wrap break-words break-all [overflow-wrap:anywhere] text-sm leading-6">
                  {message.role === 'ai' ? toPlainTextChat(message.content) : message.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


