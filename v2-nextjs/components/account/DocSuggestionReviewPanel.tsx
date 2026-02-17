'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type ReviewDecision = 'reviewed' | 'accepted' | 'rejected';
type StatusFilter = 'open' | 'reviewed' | 'accepted' | 'rejected' | 'all';
type AIProvider = 'openai' | 'google' | 'anthropic';

type SuggestionThread = {
  id: string;
  docSlug: string;
  title: string;
  body: string;
  status: 'open' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
  author: { id: string; name: string | null };
  _count: { replies: number; likes: number };
  review: {
    decision: 'reviewed' | 'accepted' | 'rejected';
    decisionReason: string;
    appliedToDoc: boolean;
    linkedDocRevision: string | null;
    createdAt: string;
  } | null;
};

type AIRecommendation = {
  threadId: string;
  recommendation: 'accept' | 'reject' | 'needs_human_review';
  confidence: number;
  rationale: string;
  proposedDecisionReason: string;
  appliedToDoc: boolean;
  linkedDocRevision: string | null;
  riskFlags: string[];
};

type AIReviewResponse = {
  summary: string;
  recommendations: AIRecommendation[];
};

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getCurrentMonthRange() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: toDateInputValue(first),
    to: toDateInputValue(last),
  };
}

export default function DocSuggestionReviewPanel() {
  const monthRange = useMemo(() => getCurrentMonthRange(), []);
  const [threads, setThreads] = useState<SuggestionThread[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('open');
  const [docSlugFilter, setDocSlugFilter] = useState('');
  const [fromDate, setFromDate] = useState(monthRange.from);
  const [toDate, setToDate] = useState(monthRange.to);

  const [aiProvider, setAiProvider] = useState<AIProvider>('openai');
  const [aiModel, setAiModel] = useState('');
  const [confidenceThreshold, setConfidenceThreshold] = useState('0.8');

  const [decisionReason, setDecisionReason] = useState<Record<string, string>>({});
  const [linkedRevision, setLinkedRevision] = useState<Record<string, string>>({});
  const [aiSummary, setAiSummary] = useState('');
  const [aiByThread, setAiByThread] = useState<Record<string, AIRecommendation>>({});
  const [runningAI, setRunningAI] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkResult, setBulkResult] = useState<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams();
      if (statusFilter !== 'all') q.set('status', statusFilter);
      if (docSlugFilter.trim()) q.set('docSlug', docSlugFilter.trim());
      if (fromDate) q.set('from', `${fromDate}T00:00:00.000Z`);
      if (toDate) q.set('to', `${toDate}T23:59:59.999Z`);
      const res = await fetch(`/api/ref/suggestions?${q.toString()}`);
      if (!res.ok) throw new Error('Failed to load suggestions');
      const data = (await res.json()) as SuggestionThread[];
      setThreads(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }, [docSlugFilter, fromDate, statusFilter, toDate]);

  useEffect(() => {
    void load();
  }, [load]);

  const submitDecision = useCallback(
    async (
      threadId: string,
      decision: ReviewDecision,
      options?: { reason?: string; appliedToDoc?: boolean; linkedDocRevision?: string },
    ) => {
      setBusyId(threadId);
      setError(null);
      try {
        const reason = options?.reason ?? decisionReason[threadId] ?? '';
        const linked = options?.linkedDocRevision ?? linkedRevision[threadId] ?? '';
        const appliedToDoc = options?.appliedToDoc ?? decision === 'accepted';

        const res = await fetch(`/api/ref/suggestions/${threadId}/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            decision,
            decisionReason: reason,
            appliedToDoc,
            linkedDocRevision: linked,
          }),
        });
        if (!res.ok) {
          const body = (await res.text()) || 'Failed to submit review';
          throw new Error(body);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to submit review');
      } finally {
        setBusyId(null);
      }
    },
    [decisionReason, linkedRevision],
  );

  const runAIPreReview = useCallback(async () => {
    setRunningAI(true);
    setError(null);
    setAiSummary('');
    try {
      const res = await fetch('/api/internal/ref-suggestion-ai-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiProvider,
          model: aiModel.trim() || undefined,
          docSlug: docSlugFilter.trim() || undefined,
          from: fromDate ? `${fromDate}T00:00:00.000Z` : undefined,
          to: toDate ? `${toDate}T23:59:59.999Z` : undefined,
          limit: 100,
        }),
      });
      if (!res.ok) {
        const body = (await res.text()) || 'Failed to run AI pre-review';
        throw new Error(body);
      }
      const data = (await res.json()) as AIReviewResponse;
      setAiSummary(data.summary ?? '');
      const map: Record<string, AIRecommendation> = {};
      for (const rec of data.recommendations ?? []) {
        map[rec.threadId] = rec;
      }
      setAiByThread(map);

      setDecisionReason((prev) => {
        const next = { ...prev };
        for (const rec of data.recommendations ?? []) {
          if (!next[rec.threadId] && rec.proposedDecisionReason) {
            next[rec.threadId] = rec.proposedDecisionReason;
          }
        }
        return next;
      });
      setLinkedRevision((prev) => {
        const next = { ...prev };
        for (const rec of data.recommendations ?? []) {
          if (!next[rec.threadId] && rec.linkedDocRevision) {
            next[rec.threadId] = rec.linkedDocRevision;
          }
        }
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to run AI pre-review');
    } finally {
      setRunningAI(false);
    }
  }, [aiModel, aiProvider, docSlugFilter, fromDate, toDate]);

  const applyAIRecommendation = useCallback(
    async (threadId: string) => {
      const rec = aiByThread[threadId];
      if (!rec) return;
      if (rec.recommendation === 'needs_human_review') {
        await submitDecision(threadId, 'reviewed', {
          reason: rec.proposedDecisionReason || rec.rationale,
          appliedToDoc: false,
          linkedDocRevision: rec.linkedDocRevision ?? '',
        });
        await load();
        return;
      }
      const decision: ReviewDecision = rec.recommendation === 'accept' ? 'accepted' : 'rejected';
      await submitDecision(threadId, decision, {
        reason: rec.proposedDecisionReason || rec.rationale,
        appliedToDoc: rec.recommendation === 'accept' ? rec.appliedToDoc : false,
        linkedDocRevision: rec.linkedDocRevision ?? '',
      });
      await load();
    },
    [aiByThread, load, submitDecision],
  );

  const applyHighConfidenceBatch = useCallback(async () => {
    const threshold = Math.max(0, Math.min(1, Number(confidenceThreshold || '0.8')));
    const candidates = Object.values(aiByThread).filter(
      (rec) => rec.recommendation !== 'needs_human_review' && rec.confidence >= threshold,
    );

    if (!candidates.length) {
      setBulkResult('No AI recommendations met the threshold.');
      return;
    }

    setBulkRunning(true);
    setBulkResult('');
    let applied = 0;
    let failed = 0;
    for (const rec of candidates) {
      const decision: ReviewDecision = rec.recommendation === 'accept' ? 'accepted' : 'rejected';
      try {
        await submitDecision(rec.threadId, decision, {
          reason: rec.proposedDecisionReason || rec.rationale,
          appliedToDoc: rec.recommendation === 'accept' ? rec.appliedToDoc : false,
          linkedDocRevision: rec.linkedDocRevision ?? '',
        });
        applied += 1;
      } catch {
        failed += 1;
      }
    }
    await load();
    setBulkRunning(false);
    setBulkResult(`Batch done. Applied: ${applied}, Failed: ${failed}, Threshold: ${threshold}.`);
  }, [aiByThread, confidenceThreshold, load, submitDecision]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-6">
        <input
          value={docSlugFilter}
          onChange={(e) => setDocSlugFilter(e.target.value)}
          placeholder="Filter by doc slug"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
        >
          <option value="open">Open</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
        />
        <select
          value={aiProvider}
          onChange={(e) => setAiProvider(e.target.value as AIProvider)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
        >
          <option value="openai">AI: OpenAI</option>
          <option value="google">AI: Google</option>
          <option value="anthropic">AI: Anthropic</option>
        </select>
        <input
          value={aiModel}
          onChange={(e) => setAiModel(e.target.value)}
          placeholder="Model override"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={() => void runAIPreReview()}
          disabled={runningAI}
          className="rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
        >
          {runningAI ? 'Running AI pre-review...' : 'Run AI Pre-Review'}
        </button>
        <input
          value={confidenceThreshold}
          onChange={(e) => setConfidenceThreshold(e.target.value)}
          className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-xs text-slate-700"
          placeholder="0.8"
        />
        <button
          type="button"
          onClick={() => void applyHighConfidenceBatch()}
          disabled={bulkRunning}
          className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
        >
          {bulkRunning ? 'Applying...' : 'Apply High-Confidence Batch'}
        </button>
      </div>

      {bulkResult ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {bulkResult}
        </p>
      ) : null}

      {aiSummary ? (
        <div className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
          <p className="font-semibold">AI Summary</p>
          <p className="mt-1 whitespace-pre-wrap">{aiSummary}</p>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      ) : null}

      {loading ? (
        <div className="h-24 animate-pulse rounded-md bg-slate-100" />
      ) : threads.length === 0 ? (
        <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          No suggestion threads found for current filters.
        </p>
      ) : (
        <ul className="space-y-3">
          {threads.map((thread) => (
            <li key={thread.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {thread.status}
                </span>
                <span className="text-xs text-slate-500">{thread.docSlug}</span>
                <span className="text-xs text-slate-500">
                  by {thread.author.name ?? 'Anonymous'} · likes {thread._count.likes} · replies {thread._count.replies}
                </span>
              </div>
              <h3 className="mt-2 text-base font-semibold text-slate-800">{thread.title}</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{thread.body}</p>

              {aiByThread[thread.id] ? (
                <div className="mt-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs text-indigo-900">
                  <p className="font-semibold">
                    AI recommendation: {aiByThread[thread.id].recommendation} (confidence {Math.round(aiByThread[thread.id].confidence * 100)}%)
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{aiByThread[thread.id].rationale}</p>
                  {aiByThread[thread.id].riskFlags.length > 0 ? (
                    <p className="mt-1">Risk flags: {aiByThread[thread.id].riskFlags.join(', ')}</p>
                  ) : null}
                </div>
              ) : null}

              {thread.review ? (
                <div className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <p>Last decision: {thread.review.decision}</p>
                  <p>Applied to doc: {thread.review.appliedToDoc ? 'yes' : 'no'}</p>
                  {thread.review.decisionReason ? <p>Reason: {thread.review.decisionReason}</p> : null}
                  {thread.review.linkedDocRevision ? <p>Revision: {thread.review.linkedDocRevision}</p> : null}
                </div>
              ) : null}

              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <input
                  value={linkedRevision[thread.id] ?? ''}
                  onChange={(e) =>
                    setLinkedRevision((prev) => ({ ...prev, [thread.id]: e.target.value }))
                  }
                  placeholder="Linked doc revision (optional)"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
                />
                <input
                  value={decisionReason[thread.id] ?? ''}
                  onChange={(e) =>
                    setDecisionReason((prev) => ({ ...prev, [thread.id]: e.target.value }))
                  }
                  placeholder="Decision reason"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busyId === thread.id}
                  onClick={() => void submitDecision(thread.id, 'reviewed').then(() => load())}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Mark Reviewed
                </button>
                <button
                  type="button"
                  disabled={busyId === thread.id}
                  onClick={() => void submitDecision(thread.id, 'accepted').then(() => load())}
                  className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  type="button"
                  disabled={busyId === thread.id}
                  onClick={() => void submitDecision(thread.id, 'rejected').then(() => load())}
                  className="rounded-md border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                >
                  Reject
                </button>
                {aiByThread[thread.id] && (
                  <button
                    type="button"
                    disabled={busyId === thread.id}
                    onClick={() => void applyAIRecommendation(thread.id)}
                    className="rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                  >
                    Apply AI Recommendation
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

