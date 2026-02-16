'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { SparklesIcon, XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { loadUserKnowledgeSources, toChatKnowledgePayload } from '@/lib/userKnowledge';
import { useTranslation } from '@/hooks/useTranslation';

type Message = {
  id: number;
  role: 'ai' | 'user';
  content: string;
  hidden?: boolean;
  uiOnly?: boolean;
};

type ChatWidgetProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
};

type SkillBookSummary = {
  id: string;
  name: string;
  description: string;
};

export default function ChatWidget({ isOpen, onClose, initialMessage }: ChatWidgetProps) {
  const { status } = useSession();
  const { t, language } = useTranslation();
  const [provider, setProvider] = useState('openai');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [skillBooks, setSkillBooks] = useState<SkillBookSummary[]>([]);
  const [activeSkillBookId, setActiveSkillBookId] = useState<string | null>(null);
  const [isSkillBookLoading, setIsSkillBookLoading] = useState(false);
  const handledInitialMessageRef = useRef<string | null>(null);
  const activeSkillBookName =
    activeSkillBookId
      ? skillBooks.find((book) => book.id === activeSkillBookId)?.name ?? t('skillBook.myBooks.defaultOption')
      : t('skillBook.myBooks.defaultOption');

  // Load user knowledge once per mount, not per message
  const userKnowledgeRef = useRef<ReturnType<typeof toChatKnowledgePayload> | null>(null);
  useEffect(() => {
    userKnowledgeRef.current = toChatKnowledgePayload(loadUserKnowledgeSources());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const loadSkillBookState = useCallback(async () => {
    if (status !== 'authenticated') {
      setSkillBooks([]);
      setActiveSkillBookId(null);
      return;
    }

    setIsSkillBookLoading(true);
    try {
      const [activeRes, booksRes] = await Promise.all([
        fetch('/api/user/active-skillbook'),
        fetch('/api/skillbooks'),
      ]);

      if (activeRes.ok) {
        const data = await activeRes.json();
        setActiveSkillBookId(data.activeSkillBookId ?? null);
      }

      if (booksRes.ok) {
        setSkillBooks(await booksRes.json());
      }
    } finally {
      setIsSkillBookLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (!isOpen) return;
    void loadSkillBookState();
  }, [isOpen, loadSkillBookState]);

  const handleSkillBookChange = useCallback(async (value: string) => {
    if (status !== 'authenticated') return;
    const skillBookId = value === '__default__' ? null : value;

    const res = await fetch('/api/user/active-skillbook', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillBookId }),
    });

    if (res.ok) {
      setActiveSkillBookId(skillBookId);
    }
  }, [status]);

  const getFriendlyErrorMessage = useCallback((rawError: string) => {
    const message = rawError.toLowerCase();
    if (message.includes('api key not found') || message.includes('api key not configured')) {
      return t('chat.apiKeyMissing');
    }
    if (
      message.includes('insufficient_quota') ||
      message.includes('quota') ||
      message.includes('billing') ||
      message.includes('credit')
    ) {
      return t('chat.billingOrQuota');
    }
    if (message.includes('invalid') && message.includes('key')) {
      return t('chat.invalidApiKey');
    }
    return t('chat.errorMessage');
  }, [t]);

  const sendMessage = useCallback(async (
    messageText: string,
    currentMessages: Message[],
    options?: { hideUserBubble?: boolean; finalAiMessage?: string }
  ) => {
    if (messageText.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      hidden: options?.hideUserBubble ?? false,
    };
    const newMessages = [...currentMessages, userMessage];

    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const userKnowledge = userKnowledgeRef.current ?? [];
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages
            .filter((m) => !m.uiOnly)
            .map((m) => ({ role: m.role, content: m.content })),
          provider,
          chatSessionId,
          knowledgeItems: userKnowledge,
          lang: language,
        }),
      });

      if (!response.ok || !response.body) {
        let serverError = 'Failed to get response from server.';
        try {
          const data = await response.json();
          if (data?.error && typeof data.error === 'string') {
            serverError = data.error;
          }
        } catch {
          try {
            const text = await response.text();
            if (text) serverError = text;
          } catch {
            // no-op
          }
        }
        throw new Error(serverError);
      }

      const newSessionId = response.headers.get('X-Chat-Session-Id');
      if (newSessionId) {
        setChatSessionId(newSessionId);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = '';

      if (options?.finalAiMessage) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aiResponseText += decoder.decode(value, { stream: true });
        }
        setMessages((prev) => [
          ...prev.filter((m) => !m.uiOnly),
          { id: Date.now() + 2, role: 'ai', content: options.finalAiMessage as string },
        ]);
      } else {
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
      }

    } catch (error) {
      console.error(error);
      const message = getFriendlyErrorMessage(error instanceof Error ? error.message : '');
      if (options?.finalAiMessage) {
        setMessages((prev) => [
          ...prev.filter((m) => !m.uiOnly),
          { id: Date.now() + 3, role: 'ai', content: message },
        ]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 2, role: 'ai', content: message }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [chatSessionId, getFriendlyErrorMessage, isLoading, language, provider]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText, messages);
  };

  useEffect(() => {
    if (!isOpen) {
      handledInitialMessageRef.current = null;
      return;
    }

    if (!initialMessage || handledInitialMessageRef.current === initialMessage) return;
    handledInitialMessageRef.current = initialMessage;

    const loadingMessage: Message = {
      id: Date.now(),
      role: 'ai',
      content: t('chat.readingResults'),
      uiOnly: true,
    };

    setMessages([loadingMessage]);
    setChatSessionId(null);

    sendMessage(initialMessage, [loadingMessage], {
      hideUserBubble: true,
      finalAiMessage: t('chat.resultsReady'),
    });
  }, [initialMessage, isOpen, sendMessage, t]);

  useEffect(() => {
    if (!initialMessage && isOpen) {
      setChatSessionId(null);
      setMessages([]);
    }
  }, [initialMessage, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 sm:inset-auto sm:bottom-8 sm:right-8 sm:w-[420px] sm:h-[680px]">
      <div className="absolute inset-0 bg-white sm:hidden" />
      <div className="absolute inset-0 rounded-none border-0 bg-white shadow-2xl sm:rounded-2xl sm:border sm:border-slate-200/70 sm:bg-white/95 sm:backdrop-blur">
      {/* Header */}
      <div className="pt-safe flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-4 py-3 sm:rounded-t-2xl">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-700)] text-white shadow-sm">
            <SparklesIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-800">{t('chat.title')}</h3>
            <p className="truncate text-[11px] text-slate-500">{activeSkillBookName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <select
            value={activeSkillBookId ?? '__default__'}
            onChange={(e) => void handleSkillBookChange(e.target.value)}
            disabled={status !== 'authenticated' || isSkillBookLoading}
            aria-label={t('skillBook.myBooks.title')}
            className="max-w-[140px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="__default__">{t('skillBook.myBooks.defaultOption')}</option>
            {skillBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            aria-label="AI provider"
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]"
          >
            <option value="openai">OpenAI</option>
            <option value="google">Google</option>
            <option value="anthropic">Anthropic</option>
          </select>
          <Link
            href="/chat"
            aria-label="Open full chat page"
            className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <ArrowsPointingOutIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-[calc(100%-130px)] overflow-y-auto px-4 py-4 pb-3 sm:h-[calc(100%-136px)]">
        <div className="space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex h-full min-h-[260px] items-center justify-center">
              <div className="max-w-xs text-center">
                <ChatBubbleLeftRightIcon className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-600">{t('chat.emptyStateTitle')}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{t('chat.emptyStateDescription')}</p>
              </div>
            </div>
          )}
          {messages.filter((m) => !m.hidden).map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 shadow-sm ring-1 ${
                  message.role === 'ai'
                    ? 'rounded-2xl rounded-bl-md bg-white text-slate-800 ring-slate-200'
                    : 'rounded-2xl rounded-br-md bg-[var(--brand-700)] text-white ring-[var(--brand-700)]/20'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== 'ai' && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-slate-800 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="pb-safe border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:rounded-b-2xl sm:p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            aria-label={t('chat.placeholder')}
            placeholder={t('chat.placeholder')}
            className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition focus:border-[var(--brand-500)] focus:bg-white focus:ring-1 focus:ring-[var(--brand-500)]"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="rounded-xl bg-[var(--brand-700)] p-3 text-white shadow-sm transition-colors hover:bg-[var(--brand-700-hover)] disabled:opacity-50"
            disabled={inputText.trim() === '' || isLoading}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}





