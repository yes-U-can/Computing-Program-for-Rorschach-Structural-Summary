'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { SparklesIcon, XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { loadUserKnowledgeSources, toChatKnowledgePayload } from '@/lib/userKnowledge';
import { getCondensedSystemMessage } from '@/lib/chatMessageVisibility';
import { toPlainTextChat } from '@/lib/chatPlainText';
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

type BillingMode = 'byok' | 'platform';
type Provider = 'openai' | 'google' | 'anthropic';
type ModelOption = {
  id: string;
  provider: Provider;
  label: string;
  description: string;
  qualityLevel: 'basic' | 'standard' | 'advanced';
  priceLevel: 'low' | 'medium' | 'high';
  speedLevel: 'fast' | 'balanced' | 'deep';
  psychologyLabel: string;
  byokAvailable: boolean;
  platformAvailable: boolean;
  recommended: boolean;
};

export default function ChatWidget({ isOpen, onClose, initialMessage }: ChatWidgetProps) {
  const { status } = useSession();
  const { t, language } = useTranslation();
  const popupEmptyDescriptionByLanguage: Record<string, string> = {
    ko: '아래 입력창에 메시지를 입력해 새 대화를 시작하세요.',
    en: 'Type a message below to start a new conversation.',
    ja: '下の入力欄にメッセージを入力して、新しい会話を始めてください。',
    es: 'Escribe un mensaje abajo para iniciar una conversación nueva.',
    pt: 'Digite uma mensagem abaixo para iniciar uma nova conversa.',
  };
  const popupEmptyDescription =
    popupEmptyDescriptionByLanguage[language] ?? popupEmptyDescriptionByLanguage.en;
  const [provider, setProvider] = useState<Provider>('openai');
  const [modelId, setModelId] = useState('gpt-4o');
  const [billingMode, setBillingMode] = useState<BillingMode>('byok');
  const [models, setModels] = useState<ModelOption[]>([]);
  const [creditBalance, setCreditBalance] = useState(0);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [skillBooks, setSkillBooks] = useState<SkillBookSummary[]>([]);
  const [activeSkillBookId, setActiveSkillBookId] = useState<string | null>(null);
  const [isSkillBookLoading, setIsSkillBookLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [favoriteModelIds, setFavoriteModelIds] = useState<string[]>([]);
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

  const loadChatModelState = useCallback(async () => {
    if (status !== 'authenticated') return;
    setModelLoading(true);
    try {
      const res = await fetch('/api/chat/models');
      if (!res.ok) return;
      const data = (await res.json()) as {
        models: ModelOption[];
        creditBalance: number;
        favoriteModelIds: string[];
      };
      const allModels = data.models ?? [];
      const available = allModels.filter((m) => m.byokAvailable || m.platformAvailable);
      const favorites = data.favoriteModelIds ?? [];
      const favoriteByokModels = available.filter(
        (m) => m.byokAvailable && favorites.includes(m.id)
      );
      const platformCandidates = available.filter((m) => m.platformAvailable);

      setModels(available);
      setFavoriteModelIds(favorites);
      setCreditBalance(data.creditBalance ?? 0);
      if (favoriteByokModels.length > 0) {
        const recommendedByok =
          favoriteByokModels.find((m) => m.recommended) ?? favoriteByokModels[0];
        setModelId(recommendedByok.id);
        setProvider(recommendedByok.provider);
        setBillingMode('byok');
      } else if (platformCandidates.length > 0) {
        const recommendedPlatform =
          platformCandidates.find((m) => m.recommended) ?? platformCandidates[0];
        setModelId(recommendedPlatform.id);
        setProvider(recommendedPlatform.provider);
      }
    } finally {
      setModelLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (!isOpen) return;
    void loadSkillBookState();
    void loadChatModelState();
  }, [isOpen, loadSkillBookState, loadChatModelState]);

  const platformModels = useMemo(
    () => models.filter((m) => m.platformAvailable),
    [models]
  );
  const byokFavoriteModels = useMemo(
    () => models.filter((m) => m.byokAvailable && favoriteModelIds.includes(m.id)),
    [models, favoriteModelIds]
  );

  useEffect(() => {
    const pool = billingMode === 'platform' ? platformModels : byokFavoriteModels;
    if (pool.length === 0) return;
    const current = pool.find((m) => m.id === modelId);
    const next = current ?? pool.find((m) => m.recommended) ?? pool[0];
    if (!next) return;
    if (next.id !== modelId) setModelId(next.id);
    if (next.provider !== provider) setProvider(next.provider);
  }, [billingMode, platformModels, byokFavoriteModels, modelId, provider]);

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
    if (message.includes('platform ai is currently unavailable')) {
      return '플랫폼 AI가 아직 준비되지 않았습니다. 개인 API 키를 등록하거나 잠시 후 다시 시도해 주세요.';
    }
    if (message.includes('insufficient credits')) {
      return '크레딧이 부족합니다. 충전 후 다시 시도하거나 더 저렴한 모델을 선택해 주세요.';
    }
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
          modelId,
          billingMode,
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
  }, [chatSessionId, getFriendlyErrorMessage, isLoading, language, provider, modelId, billingMode]);

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
    <div className="fixed inset-0 z-50 sm:inset-auto sm:bottom-8 sm:right-8 sm:w-[420px] sm:h-[680px] sm:max-h-[calc(100dvh-2rem)]">
      <div className="absolute inset-0 bg-white sm:hidden" />
      <div className="absolute inset-0 flex flex-col rounded-none border-0 bg-white shadow-2xl sm:rounded-2xl sm:border sm:border-slate-300 sm:bg-white/95 sm:backdrop-blur">

      {/* Header */}
      <div className="pt-safe flex shrink-0 items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-4 py-3 sm:rounded-t-2xl">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-700)] text-white shadow-sm">
            <SparklesIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-800">{t('chat.title')}</h3>
            <p className="truncate text-[11px] text-slate-500">{activeSkillBookName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
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

      {/* Settings bar */}
      <div className="flex shrink-0 items-end gap-1.5 border-b border-slate-100 bg-slate-50/80 px-3 py-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">스킬북</span>
          <select
            value={activeSkillBookId ?? '__default__'}
            onChange={(e) => void handleSkillBookChange(e.target.value)}
            disabled={status !== 'authenticated' || isSkillBookLoading}
            aria-label={t('skillBook.myBooks.title')}
            className="min-w-0 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="__default__">{t('skillBook.myBooks.defaultOption')}</option>
            {skillBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">AI 모델</span>
          <select
            value={(billingMode === 'platform' ? platformModels : byokFavoriteModels).length === 0 ? '__no_favorite_model__' : modelId}
            onChange={(e) => {
              const pool = billingMode === 'platform' ? platformModels : byokFavoriteModels;
              const next = pool.find((m) => m.id === e.target.value);
              if (!next) return;
              setModelId(next.id);
              setProvider(next.provider);
              if (!next.byokAvailable) setBillingMode('platform');
            }}
            aria-label="AI model"
            disabled={modelLoading || billingMode === 'platform' || byokFavoriteModels.length === 0}
            className="min-w-0 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {billingMode !== 'platform' && byokFavoriteModels.length === 0 && (
              <option value="__no_favorite_model__" disabled>
                즐겨찾기된 모델이 없습니다. 계정 설정에서 모델을 즐겨찾기해 주세요.
              </option>
            )}
            {(billingMode === 'platform' ? platformModels : byokFavoriteModels).map((m) => (
              <option key={m.id} value={m.id}>
                {m.provider.toUpperCase()} · {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">결제 방식</span>
          <select
            value={billingMode}
            onChange={(e) => setBillingMode(e.target.value as BillingMode)}
            aria-label="Billing mode"
            className="min-w-0 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 focus:border-[var(--brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-500)]"
          >
            <option value="byok">내 API 키</option>
            <option value="platform">플랫폼 크레딧</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-3">
        <div className="space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex h-full min-h-[260px] items-center justify-center">
              <div className="max-w-xs text-center">
                <ChatBubbleLeftRightIcon className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-600">{t('chat.emptyStateTitle')}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{popupEmptyDescription}</p>
              </div>
            </div>
          )}
          {messages.filter((m) => !m.hidden).map((message) => {
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
                  className={`w-fit max-w-[calc(100%-2rem)] sm:max-w-[85%] px-4 py-2.5 shadow-sm ring-1 ${
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
      <div className="pb-safe shrink-0 border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:rounded-b-2xl sm:p-4">
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
