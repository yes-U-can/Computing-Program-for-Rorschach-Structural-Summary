'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { SparklesIcon, XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { loadUserKnowledgeSources, toChatKnowledgePayload } from '@/lib/userKnowledge';
import { useTranslation } from '@/hooks/useTranslation';

type Message = {
  id: number;
  role: 'ai' | 'user';
  content: string;
};

type ChatWidgetProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
};

export default function ChatWidget({ isOpen, onClose, initialMessage }: ChatWidgetProps) {
  const { t, language } = useTranslation();
  const [provider, setProvider] = useState('openai');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const pendingInitialMessage = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = useCallback(async (messageText: string, currentMessages: Message[]) => {
    if (messageText.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: messageText };
    const newMessages = [...currentMessages, userMessage];

    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const userKnowledge = toChatKnowledgePayload(loadUserKnowledgeSources());
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          provider,
          chatSessionId,
          knowledgeItems: userKnowledge,
          lang: language,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response from server.');
      }

      const newSessionId = response.headers.get('X-Chat-Session-Id');
      if (newSessionId) {
        setChatSessionId(newSessionId);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = '';
      const aiMessageId = Date.now() + 1;

      setMessages(prev => [...prev, { id: aiMessageId, role: 'ai', content: '' }]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          aiResponseText += decoder.decode(value, { stream: true });
          setMessages(prev => prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, content: aiResponseText } : msg
          ));
        }
      } catch (streamError) {
        console.error('Stream interrupted:', streamError);
        if (aiResponseText) {
          setMessages(prev => prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, content: aiResponseText + '\n\n[Stream interrupted]' } : msg
          ));
        }
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 2, role: 'ai', content: t('chat.errorMessage') }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, provider, chatSessionId, language, t]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText, messages);
  };

  // Handle initialMessage safely without setTimeout race condition
  useEffect(() => {
    if (initialMessage && isOpen) {
      pendingInitialMessage.current = initialMessage;
      setMessages([]);
      setChatSessionId(null);
    }
  }, [initialMessage, isOpen]);

  useEffect(() => {
    if (pendingInitialMessage.current && messages.length === 0 && !isLoading) {
      const msg = pendingInitialMessage.current;
      pendingInitialMessage.current = null;
      sendMessage(msg, []);
    }
  }, [messages, isLoading, sendMessage]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-white rounded-none shadow-2xl flex flex-col z-50 border-0 sm:inset-auto sm:bottom-8 sm:right-8 sm:w-96 sm:h-[600px] sm:rounded-2xl sm:border sm:border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 sm:rounded-t-2xl">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-[#4E73AA]" />
          <h3 className="font-bold text-slate-800">{t('chat.title')}</h3>
        </div>
        <div className="flex items-center gap-2">
           <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="text-xs bg-transparent border-none rounded-md focus:ring-0"
          >
            <option value="openai">OpenAI</option>
            <option value="google">Google</option>
            <option value="anthropic">Anthropic</option>
          </select>
          <Link href="/chat">
            <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200">
              <ArrowsPointingOutIcon className="w-5 h-5" />
            </button>
          </Link>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl ${
                  message.role === 'ai'
                    ? 'bg-slate-100 text-slate-800 rounded-bl-none'
                    : 'bg-[#2A5F7F] text-white rounded-br-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
           {isLoading && messages[messages.length - 1]?.role !== 'ai' && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-none">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-slate-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-200 bg-white sm:rounded-b-2xl">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="flex-1 w-full px-4 py-2.5 text-sm rounded-xl bg-slate-100 border-transparent focus:bg-white focus:border-[#4E73AA] focus:ring-1 focus:ring-[#4E73AA] transition"
          />
          <button
            type="submit"
            className="p-3 bg-[#2A5F7F] text-white rounded-xl shadow-sm hover:bg-[#1E4D6A] disabled:opacity-50"
            disabled={inputText.trim() === '' || isLoading}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}




