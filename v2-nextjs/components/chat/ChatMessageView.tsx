'use client';

import { useEffect, useState } from 'react';
import type { ChatMessage } from '@prisma/client';

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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[86%] px-4 py-2.5 shadow-sm ring-1 ${
                message.role === 'ai'
                  ? 'rounded-2xl rounded-bl-md bg-white text-slate-800 ring-slate-200'
                  : 'rounded-2xl rounded-br-md bg-[var(--brand-700)] text-white ring-[var(--brand-700)]/20'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


