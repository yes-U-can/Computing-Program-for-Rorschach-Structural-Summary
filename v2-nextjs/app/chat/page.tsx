'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ChatHistorySidebar from '@/components/chat/ChatHistorySidebar';
import ChatMessageView from '@/components/chat/ChatMessageView';
import { useTranslation } from '@/hooks/useTranslation';
import { loadUserKnowledgeSources, toChatKnowledgePayload } from '@/lib/userKnowledge';
import Header from '@/components/layout/Header';

type Message = {
  id: number;
  role: 'ai' | 'user';
  content: string;
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

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, language } = useTranslation();

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [provider, setProvider] = useState<Provider>('openai');
  const [modelId, setModelId] = useState('gpt-4o');
  const [billingMode, setBillingMode] = useState<BillingMode>('byok');
  const [models, setModels] = useState<ModelOption[]>([]);
  const [creditBalance, setCreditBalance] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [streamingMessages, setStreamingMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const [skillBooks, setSkillBooks] = useState<SkillBookSummary[]>([]);
  const [activeSkillBookId, setActiveSkillBookId] = useState<string | null>(null);
  const [isSkillBookLoading, setIsSkillBookLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const loadSkillBookState = useCallback(async () => {
    if (status !== 'authenticated') return;
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
    void loadSkillBookState();
  }, [loadSkillBookState]);

  const loadChatModelState = useCallback(async () => {
    if (status !== 'authenticated') return;
    setModelLoading(true);
    try {
      const res = await fetch('/api/chat/models');
      if (!res.ok) return;
      const data = (await res.json()) as {
        models: ModelOption[];
        creditBalance: number;
      };
      setModels(data.models ?? []);
      setCreditBalance(data.creditBalance ?? 0);

      const recommended =
        data.models?.find((m) => m.recommended && m.provider === provider) ??
        data.models?.[0];
      if (recommended) {
        setModelId(recommended.id);
        setProvider(recommended.provider);
        setBillingMode(recommended.byokAvailable ? 'byok' : 'platform');
      }
    } finally {
      setModelLoading(false);
    }
  }, [provider, status]);

  useEffect(() => {
    void loadChatModelState();
  }, [loadChatModelState]);

  const selectedModel = models.find((m) => m.id === modelId) ?? null;

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

  // Scroll to bottom when streaming messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamingMessages]);

  // When switching sessions: load previous messages so we can continue the conversation
  useEffect(() => {
    setIsStreaming(false);
    setChatSessionId(selectedSessionId);

    if (!selectedSessionId) {
      setStreamingMessages([]);
      return;
    }

    // Fetch previous messages so sendMessage can include them for AI context
    async function loadPreviousMessages() {
      try {
        const res = await fetch(`/api/chat/sessions/${selectedSessionId}`);
        if (res.ok) {
          const data = await res.json();
          const msgs: Message[] = (data.messages ?? []).map((m: { id: string; role: string; content: string }, i: number) => ({
            id: i,
            role: m.role as 'ai' | 'user',
            content: m.content,
          }));
          setStreamingMessages(msgs);
        }
      } catch {
        setStreamingMessages([]);
      }
    }
    loadPreviousMessages();
  }, [selectedSessionId]);

  // Close sidebar on mobile when a session is selected
  const handleSessionSelect = useCallback((sessionId: string) => {
    setSelectedSessionId(sessionId);
    setSidebarOpen(false);
  }, []);

  // New chat — reset everything
  const handleNewChat = useCallback(() => {
    setSelectedSessionId(null);
    setChatSessionId(null);
    setStreamingMessages([]);
    setIsStreaming(false);
    setSidebarOpen(false);
    inputRef.current?.focus();
  }, []);

  const sendMessage = useCallback(async (messageText: string) => {
    if (messageText.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: messageText };
    const newMessages = [...streamingMessages, userMessage];

    setStreamingMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const userKnowledge = toChatKnowledgePayload(loadUserKnowledgeSources());
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          provider,
          modelId,
          billingMode,
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
        if (!selectedSessionId) {
          setSelectedSessionId(newSessionId);
        }
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = '';
      const aiMessageId = Date.now() + 1;

      setStreamingMessages(prev => [...prev, { id: aiMessageId, role: 'ai', content: '' }]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          aiResponseText += decoder.decode(value, { stream: true });
          setStreamingMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId ? { ...msg, content: aiResponseText } : msg
            )
          );
        }
      } catch (streamError) {
        console.error('Stream interrupted:', streamError);
        if (aiResponseText) {
          setStreamingMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, content: aiResponseText + '\n\n[Stream interrupted]' }
                : msg
            )
          );
        }
      }

      // After streaming is done, refresh views
      setRefreshKey(prev => prev + 1);
      setSidebarRefresh(prev => prev + 1);
    } catch (error) {
      console.error(error);
      setStreamingMessages(prev => [
        ...prev,
        { id: Date.now() + 2, role: 'ai', content: t('chat.errorMessage') },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [isLoading, streamingMessages, provider, modelId, billingMode, chatSessionId, selectedSessionId, language, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  if (status === 'loading' || !session) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-[var(--brand-700)] border-t-transparent"></div>
      </div>
    );
  }

  // Determine what to show in the message area
  const showPersistedView = selectedSessionId && !isStreaming;
  const showStreamingView = isStreaming;
  const showEmptyState = !selectedSessionId && !isStreaming;
  const activeSkillBookName =
    activeSkillBookId
      ? skillBooks.find((book) => book.id === activeSkillBookId)?.name ?? t('skillBook.myBooks.defaultOption')
      : t('skillBook.myBooks.defaultOption');

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_left,#eef5fa_0%,#f8fafc_45%,#f8fafc_100%)]">
      <Header />
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 items-stretch px-0 py-3 sm:px-4 md:py-6 lg:px-6">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out
            md:relative md:inset-auto md:z-0 md:flex md:min-h-0 md:w-[280px] md:translate-x-0 md:flex-col md:self-stretch md:rounded-2xl md:shadow-sm
            lg:w-[300px] xl:w-[320px]
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Mobile close button for sidebar */}
          <div className="flex items-center justify-end p-2 md:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <ChatHistorySidebar
            selectedSessionId={selectedSessionId}
            onSessionSelect={handleSessionSelect}
            onNewChat={handleNewChat}
            refreshTrigger={sidebarRefresh}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Top bar with mobile toggle */}
          <div className="pt-safe flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-sm font-semibold text-slate-700">{t('nav.aiAssistant')}</h1>
          </div>

          <main className="flex min-h-0 flex-1 flex-col p-2.5 md:py-0 md:pl-4 md:pr-0">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_14px_38px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">{t('skillBook.myBooks.title')}</p>
                  <p className="truncate text-[11px] text-slate-400">{activeSkillBookName}</p>
                </div>
                <select
                  value={activeSkillBookId ?? '__default__'}
                  onChange={(e) => void handleSkillBookChange(e.target.value)}
                  disabled={status !== 'authenticated' || isSkillBookLoading}
                  className="max-w-[240px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)] disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label={t('skillBook.myBooks.title')}
                >
                  <option value="__default__">{t('skillBook.myBooks.defaultOption')}</option>
                  {skillBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/60 to-white">
                {showPersistedView && (
                  <ChatMessageView
                    key={`${selectedSessionId}-${refreshKey}`}
                    sessionId={selectedSessionId}
                  />
                )}
                {showStreamingView && (
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {streamingMessages.map((message) => (
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
                      {isLoading && streamingMessages[streamingMessages.length - 1]?.role !== 'ai' && (
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
                )}
                {showEmptyState && (
                  <div className="flex h-full flex-1 items-center justify-center p-8">
                    <div className="text-center">
                      <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-slate-300" />
                      <h2 className="mt-4 text-xl font-semibold text-slate-700">
                        {t('chat.emptyStateTitle')}
                      </h2>
                      <p className="mt-1 text-slate-500">
                        {t('chat.emptyStateDescription')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Skill Book Builder entry */}
              <div className="border-t border-dashed border-slate-200 bg-gradient-to-r from-amber-50/50 to-white px-4 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4 shrink-0 text-amber-500" />
                    <span className="text-xs font-medium text-slate-600">{t('skillBook.builder.toggle')}</span>
                  </div>
                  <a
                    href="/account?create=1#my-skillbooks"
                    className="rounded-md border border-amber-300 bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-200"
                  >
                    {t('skillBook.builder.open')}
                  </a>
                </div>
              </div>

              {/* Input form */}
              <div className="pb-safe rounded-b-2xl border-t border-slate-200 bg-white/95 p-3 md:p-4">
                <div className="mb-2 grid gap-2 md:grid-cols-[1fr_auto_auto]">
                  <select
                    value={modelId}
                    onChange={(e) => {
                      const next = models.find((m) => m.id === e.target.value);
                      if (!next) return;
                      setModelId(next.id);
                      setProvider(next.provider);
                      if (!next.byokAvailable) setBillingMode('platform');
                    }}
                    disabled={modelLoading || models.length === 0}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-700 focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)] disabled:opacity-60"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.provider.toUpperCase()} · {m.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={billingMode}
                    onChange={(e) => setBillingMode(e.target.value as BillingMode)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-700 focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)]"
                  >
                    <option value="byok">내 API 키 사용</option>
                    <option value="platform">플랫폼 크레딧 사용</option>
                  </select>
                  <div className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-600">
                    잔액: {creditBalance.toLocaleString()} cr
                  </div>
                </div>
                {selectedModel && (
                  <div className="mb-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] text-slate-600">
                    <p className="font-semibold text-slate-700">{selectedModel.label} · {selectedModel.psychologyLabel}</p>
                    <p className="mt-0.5">
                      가격: {selectedModel.priceLevel} · 속도: {selectedModel.speedLevel} · 품질: {selectedModel.qualityLevel}
                    </p>
                    <p className="mt-0.5">{selectedModel.description}</p>
                    {billingMode === 'byok' && !selectedModel.byokAvailable && (
                      <p className="mt-1 text-rose-600">선택한 제공자의 개인 API 키가 없어 플랫폼 모드를 권장합니다.</p>
                    )}
                    {billingMode === 'platform' && !selectedModel.platformAvailable && (
                      <p className="mt-1 text-rose-600">해당 모델의 플랫폼키가 아직 설정되지 않았습니다.</p>
                    )}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t('chat.placeholder')}
                    className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-colors focus:border-[var(--brand-500)] focus:bg-white focus:ring-1 focus:ring-[var(--brand-500)]"
                  />
                  <button
                    type="submit"
                    className="h-11 w-11 shrink-0 rounded-xl bg-[var(--brand-700)] p-0 text-white shadow-sm transition-colors hover:bg-[var(--brand-700-hover)] disabled:opacity-50"
                    disabled={inputText.trim() === '' || isLoading}
                  >
                    <PaperAirplaneIcon className="mx-auto h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
