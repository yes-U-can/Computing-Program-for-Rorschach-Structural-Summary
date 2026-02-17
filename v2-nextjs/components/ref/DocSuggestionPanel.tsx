'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Language } from '@/types';

type SuggestionThread = {
  id: string;
  docSlug: string;
  title: string;
  body: string;
  status: 'open' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string | null };
  _count: { replies: number; likes: number };
  review: {
    decision: 'reviewed' | 'accepted' | 'rejected';
    decisionReason: string;
    appliedToDoc: boolean;
    linkedDocRevision: string | null;
    createdAt: string;
  } | null;
  viewerHasLiked?: boolean;
};

type SuggestionReply = {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; name: string | null };
};

type Props = {
  docSlug: string;
  language: Language;
};

const labels: Record<
  Language,
  {
    title: string;
    subtitle: string;
    threadTitle: string;
    threadBody: string;
    submit: string;
    submitting: string;
    empty: string;
    loginHint: string;
    replies: string;
    replyPlaceholder: string;
    sendReply: string;
    like: string;
    unlike: string;
    loadReplies: string;
    hideReplies: string;
    status: Record<'open' | 'reviewed' | 'accepted' | 'rejected', string>;
  }
> = {
  en: {
    title: 'Doc Improvement Suggestions',
    subtitle: 'Propose corrections, clarifications, and additional references for this page.',
    threadTitle: 'Suggestion title',
    threadBody: 'Explain what should change and why',
    submit: 'Submit suggestion',
    submitting: 'Submitting...',
    empty: 'No suggestions yet. Be the first contributor.',
    loginHint: 'Sign in to write suggestions, replies, and likes.',
    replies: 'Replies',
    replyPlaceholder: 'Write a reply for this suggestion thread',
    sendReply: 'Send reply',
    like: 'Like',
    unlike: 'Unlike',
    loadReplies: 'Load replies',
    hideReplies: 'Hide replies',
    status: {
      open: 'Open',
      reviewed: 'Reviewed',
      accepted: 'Accepted',
      rejected: 'Rejected',
    },
  },
  ko: {
    title: '문서 개선 제안',
    subtitle: '이 문서에 대한 수정, 보완, 근거 추가 제안을 남겨 주세요.',
    threadTitle: '제안 제목',
    threadBody: '어떤 내용을 왜 수정해야 하는지 작성해 주세요',
    submit: '제안 등록',
    submitting: '등록 중...',
    empty: '아직 제안이 없습니다. 첫 제안을 남겨 주세요.',
    loginHint: '제안/답글/좋아요는 로그인 후 이용할 수 있습니다.',
    replies: '답글',
    replyPlaceholder: '이 제안에 대한 답글을 작성해 주세요',
    sendReply: '답글 등록',
    like: '좋아요',
    unlike: '좋아요 취소',
    loadReplies: '답글 보기',
    hideReplies: '답글 닫기',
    status: {
      open: '검토 대기',
      reviewed: '검토 완료',
      accepted: '반영',
      rejected: '기각',
    },
  },
  ja: {
    title: 'ドキュメント改善提案',
    subtitle: 'このページへの修正提案や補足提案を投稿できます。',
    threadTitle: '提案タイトル',
    threadBody: '変更内容と理由を入力してください',
    submit: '提案を投稿',
    submitting: '投稿中...',
    empty: 'まだ提案がありません。最初の提案を投稿してください。',
    loginHint: '提案・返信・いいねはログイン後に利用できます。',
    replies: '返信',
    replyPlaceholder: 'この提案への返信を入力',
    sendReply: '返信を投稿',
    like: 'いいね',
    unlike: 'いいね取消',
    loadReplies: '返信を表示',
    hideReplies: '返信を隠す',
    status: {
      open: '未確認',
      reviewed: '確認済み',
      accepted: '採用',
      rejected: '却下',
    },
  },
  es: {
    title: 'Sugerencias de Mejora',
    subtitle: 'Proponga correcciones y mejoras para esta pagina.',
    threadTitle: 'Titulo de la sugerencia',
    threadBody: 'Explique que cambiar y por que',
    submit: 'Enviar sugerencia',
    submitting: 'Enviando...',
    empty: 'Aun no hay sugerencias.',
    loginHint: 'Inicie sesion para escribir sugerencias, respuestas y likes.',
    replies: 'Respuestas',
    replyPlaceholder: 'Escriba una respuesta para este hilo',
    sendReply: 'Enviar respuesta',
    like: 'Me gusta',
    unlike: 'Quitar me gusta',
    loadReplies: 'Ver respuestas',
    hideReplies: 'Ocultar respuestas',
    status: {
      open: 'Abierto',
      reviewed: 'Revisado',
      accepted: 'Aceptado',
      rejected: 'Rechazado',
    },
  },
  pt: {
    title: 'Sugestoes de Melhoria',
    subtitle: 'Proponha correcoes e melhorias para esta pagina.',
    threadTitle: 'Titulo da sugestao',
    threadBody: 'Explique o que deve mudar e por que',
    submit: 'Enviar sugestao',
    submitting: 'Enviando...',
    empty: 'Ainda nao ha sugestoes.',
    loginHint: 'Faca login para publicar sugestoes, respostas e curtidas.',
    replies: 'Respostas',
    replyPlaceholder: 'Escreva uma resposta para este topico',
    sendReply: 'Enviar resposta',
    like: 'Curtir',
    unlike: 'Descurtir',
    loadReplies: 'Ver respostas',
    hideReplies: 'Ocultar respostas',
    status: {
      open: 'Aberto',
      reviewed: 'Revisado',
      accepted: 'Aceito',
      rejected: 'Rejeitado',
    },
  },
};

function formatDate(date: string, language: Language) {
  const locale = language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-PT' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export default function DocSuggestionPanel({ docSlug, language }: Props) {
  const { status } = useSession();
  const copy = labels[language];

  const [threads, setThreads] = useState<SuggestionThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});
  const [repliesByThread, setRepliesByThread] = useState<Record<string, SuggestionReply[]>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [pendingThreadId, setPendingThreadId] = useState<string | null>(null);

  const canWrite = status === 'authenticated';

  const loadThreads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ref/suggestions?docSlug=${encodeURIComponent(docSlug)}`);
      if (!res.ok) throw new Error('failed');
      const data = (await res.json()) as SuggestionThread[];
      setThreads(data);
    } catch {
      setError('Failed to load suggestions.');
    } finally {
      setLoading(false);
    }
  }, [docSlug]);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  const loadReplies = useCallback(async (threadId: string) => {
    const res = await fetch(`/api/ref/suggestions/${threadId}/replies`);
    if (!res.ok) throw new Error('failed');
    const data = (await res.json()) as SuggestionReply[];
    setRepliesByThread((prev) => ({ ...prev, [threadId]: data }));
  }, []);

  const handleCreateThread = useCallback(async () => {
    const nextTitle = title.trim();
    const nextBody = body.trim();
    if (!nextTitle || !nextBody || !canWrite || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/ref/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docSlug, title: nextTitle, body: nextBody }),
      });
      if (!res.ok) throw new Error('failed');
      setTitle('');
      setBody('');
      await loadThreads();
    } catch {
      setError('Failed to submit suggestion.');
    } finally {
      setSubmitting(false);
    }
  }, [body, canWrite, docSlug, loadThreads, submitting, title]);

  const toggleReplies = useCallback(async (threadId: string) => {
    const isOpen = openReplies[threadId] ?? false;
    if (isOpen) {
      setOpenReplies((prev) => ({ ...prev, [threadId]: false }));
      return;
    }
    setOpenReplies((prev) => ({ ...prev, [threadId]: true }));
    if (!repliesByThread[threadId]) {
      try {
        await loadReplies(threadId);
      } catch {
        setError('Failed to load replies.');
      }
    }
  }, [loadReplies, openReplies, repliesByThread]);

  const handleReplySubmit = useCallback(async (threadId: string) => {
    const draft = (replyDrafts[threadId] ?? '').trim();
    if (!draft || !canWrite || pendingThreadId) return;
    setPendingThreadId(threadId);
    try {
      const res = await fetch(`/api/ref/suggestions/${threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: draft }),
      });
      if (!res.ok) throw new Error('failed');
      setReplyDrafts((prev) => ({ ...prev, [threadId]: '' }));
      await Promise.all([loadReplies(threadId), loadThreads()]);
    } catch {
      setError('Failed to submit reply.');
    } finally {
      setPendingThreadId(null);
    }
  }, [canWrite, loadReplies, loadThreads, pendingThreadId, replyDrafts]);

  const handleLikeToggle = useCallback(async (thread: SuggestionThread) => {
    if (!canWrite || pendingThreadId) return;
    setPendingThreadId(thread.id);
    try {
      const method = thread.viewerHasLiked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/ref/suggestions/${thread.id}/like`, { method });
      if (!res.ok) throw new Error('failed');
      const data = (await res.json()) as { likeCount: number };
      setThreads((prev) =>
        prev.map((item) =>
          item.id === thread.id
            ? {
                ...item,
                viewerHasLiked: !item.viewerHasLiked,
                _count: { ...item._count, likes: data.likeCount },
              }
            : item,
        ),
      );
    } catch {
      setError('Failed to update like.');
    } finally {
      setPendingThreadId(null);
    }
  }, [canWrite, pendingThreadId]);

  const orderedThreads = useMemo(() => threads, [threads]);

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-semibold text-slate-800">{copy.title}</h2>
      <p className="mt-1 text-sm text-slate-600">{copy.subtitle}</p>

      <div className="mt-4 grid gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={copy.threadTitle}
          disabled={!canWrite || submitting}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20 disabled:bg-slate-100"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={copy.threadBody}
          disabled={!canWrite || submitting}
          rows={4}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20 disabled:bg-slate-100"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">{!canWrite ? copy.loginHint : ''}</p>
          <button
            type="button"
            onClick={() => void handleCreateThread()}
            disabled={!canWrite || submitting || !title.trim() || !body.trim()}
            className="rounded-md bg-[var(--brand-700)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--brand-700-hover)] disabled:opacity-50"
          >
            {submitting ? copy.submitting : copy.submit}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : orderedThreads.length === 0 ? (
          <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">{copy.empty}</p>
        ) : (
          orderedThreads.map((thread) => {
            const showReplies = openReplies[thread.id] ?? false;
            const replies = repliesByThread[thread.id] ?? [];
            return (
              <article key={thread.id} className="rounded-lg border border-slate-200 px-3 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {copy.status[thread.status]}
                  </span>
                  <span className="text-xs text-slate-500">
                    {thread.author.name ?? 'Anonymous'} · {formatDate(thread.createdAt, language)}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-semibold text-slate-800">{thread.title}</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{thread.body}</p>

                {thread.review?.decisionReason ? (
                  <p className="mt-2 rounded-md bg-slate-50 px-2.5 py-2 text-xs text-slate-600">
                    Review note: {thread.review.decisionReason}
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleLikeToggle(thread)}
                    disabled={!canWrite || pendingThreadId === thread.id}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {thread.viewerHasLiked ? copy.unlike : copy.like} ({thread._count.likes})
                  </button>
                  <button
                    type="button"
                    onClick={() => void toggleReplies(thread.id)}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {showReplies ? copy.hideReplies : copy.loadReplies} ({thread._count.replies})
                  </button>
                </div>

                {showReplies && (
                  <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-semibold text-slate-600">{copy.replies}</p>
                    <div className="space-y-2">
                      {replies.map((reply) => (
                        <div key={reply.id} className="rounded-md bg-white px-2.5 py-2 text-sm text-slate-700">
                          <p className="whitespace-pre-wrap leading-6">{reply.body}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {reply.author.name ?? 'Anonymous'} · {formatDate(reply.createdAt, language)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <input
                        value={replyDrafts[thread.id] ?? ''}
                        onChange={(e) =>
                          setReplyDrafts((prev) => ({ ...prev, [thread.id]: e.target.value }))
                        }
                        placeholder={copy.replyPlaceholder}
                        disabled={!canWrite || pendingThreadId === thread.id}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20 disabled:bg-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => void handleReplySubmit(thread.id)}
                        disabled={!canWrite || pendingThreadId === thread.id || !(replyDrafts[thread.id] ?? '').trim()}
                        className="rounded-md bg-[var(--brand-700)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--brand-700-hover)] disabled:opacity-50"
                      >
                        {copy.sendReply}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

