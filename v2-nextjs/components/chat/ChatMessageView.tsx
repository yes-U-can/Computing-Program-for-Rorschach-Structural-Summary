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
    return <div className="p-4">Loading messages...</div>;
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-xs lg:max-w-xl px-4 py-2.5 rounded-2xl ${
                message.role === 'ai'
                  ? 'bg-slate-100 text-slate-800 rounded-bl-none'
                  : 'bg-sky-600 text-white rounded-br-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
