'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
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

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, language } = useTranslation();

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [provider, setProvider] = useState('openai');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [streamingMessages, setStreamingMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Scroll to bottom when streaming messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streamingMessages]);

  // Clear streaming state when switching sessions
  useEffect(() => {
    setStreamingMessages([]);
    setIsStreaming(false);
    setChatSessionId(selectedSessionId);
  }, [selectedSessionId]);

  // Close sidebar on mobile when a session is selected
  const handleSessionSelect = useCallback((sessionId: string) => {
    setSelectedSessionId(sessionId);
    setSidebarOpen(false);
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
        // If this was a new conversation, select the session so the sidebar reflects it
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

      // After streaming is done, refresh ChatMessageView so it picks up the saved messages
      setRefreshKey(prev => prev + 1);
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
  }, [isLoading, streamingMessages, provider, chatSessionId, selectedSessionId, language, t]);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="flex h-[calc(100vh-110px)]">
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
            fixed inset-y-0 left-0 z-40 w-72 transform border-r bg-white transition-transform duration-200 ease-in-out
            md:relative md:z-0 md:w-1/4 md:max-w-xs md:translate-x-0
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
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Top bar with mobile toggle */}
          <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="text-sm font-semibold text-slate-700">{t('nav.aiAssistant')}</h1>
          </div>

          <main className="flex flex-1 flex-col p-3 md:p-6">
            <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white">
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto">
                {selectedSessionId ? (
                  <>
                    {/* Show persisted messages from ChatMessageView when not actively streaming */}
                    {!isStreaming && (
                      <ChatMessageView
                        key={`${selectedSessionId}-${refreshKey}`}
                        sessionId={selectedSessionId}
                      />
                    )}
                    {/* Show streaming messages when actively streaming */}
                    {isStreaming && (
                      <div className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-4">
                          {streamingMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-xl px-4 py-2.5 rounded-2xl ${
                                  message.role === 'ai'
                                    ? 'bg-slate-100 text-slate-800 rounded-bl-none'
                                    : 'bg-[var(--brand-700)] text-white rounded-br-none'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              </div>
                            </div>
                          ))}
                          {isLoading && streamingMessages[streamingMessages.length - 1]?.role !== 'ai' && (
                            <div className="flex justify-start">
                              <div className="max-w-xs lg:max-w-xl px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-800 rounded-bl-none">
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
                    )}
                  </>
                ) : (
                  <div className="flex flex-1 h-full items-center justify-center p-8">
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

              {/* Input form */}
              <div className="border-t border-slate-200 bg-white p-3 md:p-4 rounded-b-lg">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="hidden sm:block shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2.5 text-xs text-slate-600 focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)]"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="google">Google</option>
                    <option value="anthropic">Anthropic</option>
                  </select>
                  {/* Mobile-only compact provider select */}
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="block sm:hidden shrink-0 w-16 rounded-lg border border-slate-200 bg-slate-50 px-1 py-2.5 text-[10px] text-slate-600 focus:border-[var(--brand-500)] focus:ring-1 focus:ring-[var(--brand-500)]"
                  >
                    <option value="openai">GPT</option>
                    <option value="google">Gem</option>
                    <option value="anthropic">Cld</option>
                  </select>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t('chat.placeholder')}
                    className="flex-1 rounded-xl border-transparent bg-slate-100 px-4 py-2.5 text-sm transition-colors focus:border-[var(--brand-500)] focus:bg-white focus:ring-1 focus:ring-[var(--brand-500)]"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-[var(--brand-700)] p-3 text-white shadow-sm hover:bg-[var(--brand-700-hover)] disabled:opacity-50"
                    disabled={inputText.trim() === '' || isLoading}
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
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





