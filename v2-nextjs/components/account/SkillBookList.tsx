'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import {
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon,
  LockClosedIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

type SkillBookSummary = {
  id: string;
  name: string;
  description: string;
  source: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  originalAuthor?: string | null;
  forkedFromName?: string | null;
};

type SkillBookFull = SkillBookSummary & {
  instructions: string;
  documents: string;
};

type SkillBookDocument = {
  title: string;
  content: string;
};

type Props = {
  onEdit: (id: string) => void;
  onNew: () => void;
};

const MAX_FILE_SIZE = 500 * 1024;

export default function SkillBookList({ onEdit, onNew }: Props) {
  const { t, language } = useTranslation();
  const { showToast } = useToast();
  const router = useRouter();
  const [books, setBooks] = useState<SkillBookSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<
    'all' | 'public' | 'private'
  >('all');

  const fetchBooks = useCallback(async () => {
    try {
      const [booksRes, activeRes] = await Promise.all([
        fetch('/api/skillbooks'),
        fetch('/api/user/active-skillbook'),
      ]);
      if (!booksRes.ok || !activeRes.ok) {
        throw new Error('Failed to load skill books');
      }
      setBooks(await booksRes.json());
      const data = (await activeRes.json()) as { activeSkillBookId: string | null };
      setActiveId(data.activeSkillBookId);
    } catch {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.loadFailed'),
      });
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    void fetchBooks();
  }, [fetchBooks]);

  const handleActivate = async (id: string | null) => {
    const res = await fetch('/api/user/active-skillbook', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillBookId: id }),
    });
    if (res.ok) {
      setActiveId(id);
    } else {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.activateFailed'),
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('skillBook.myBooks.deleteConfirm'))) {
      return;
    }

    const res = await fetch(`/api/skillbooks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBooks((prev) => prev.filter((book) => book.id !== id));
      if (activeId === id) setActiveId(null);
    } else {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.deleteFailed'),
      });
    }
  };

  const handleTogglePublic = async (book: SkillBookSummary) => {
    const res = await fetch(`/api/skillbooks/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic: !book.isPublic }),
    });
    if (!res.ok) {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.visibilityFailed'),
      });
      return;
    }
    setBooks((prev) =>
      prev.map((item) =>
        item.id === book.id ? { ...item, isPublic: !item.isPublic } : item,
      ),
    );
  };

  const handleUseInChat = async (id: string | null) => {
    const res = await fetch('/api/user/active-skillbook', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillBookId: id }),
    });
    if (!res.ok) {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.activateFailed'),
      });
      return;
    }
    setActiveId(id);
    router.push('/chat');
  };

  const handleExport = async (id: string) => {
    try {
      const res = await fetch(`/api/skillbooks/${id}`);
      if (!res.ok) throw new Error('export fetch failed');

      const data = (await res.json()) as SkillBookFull;
      let documents: SkillBookDocument[] = [];
      try {
        const parsed = JSON.parse(data.documents || '[]');
        if (Array.isArray(parsed)) {
          documents = parsed
            .filter((doc) => doc?.title?.trim() && doc?.content?.trim())
            .map((doc) => ({
              title: doc.title.trim(),
              content: doc.content.trim(),
            }));
        }
      } catch {
        documents = [];
      }

      const payload = {
        name: data.name,
        description: data.description,
        instructions: data.instructions,
        documents,
        exportedAt: new Date().toISOString(),
        version: 1,
      };
      const content = JSON.stringify(payload, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const safeName =
        data.name.replace(/[^a-zA-Z0-9-_]+/g, '_').slice(0, 60) || 'skillbook';
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${safeName}.skillbook.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.exportFailed'),
      });
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const postRes = await fetch(`/api/skillbooks/${id}/duplicate`, {
        method: 'POST',
      });
      if (!postRes.ok) throw new Error('Failed to duplicate skillbook');

      await fetchBooks();
      showToast({
        type: 'success',
        title: t('buttons.save'),
        message: t('account.knowledgeSources.saved'),
      });
    } catch {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.saveFailed'),
      });
    }
  };

  const handleImport = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.importFailed'),
      });
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as {
        name?: string;
        description?: string;
        instructions?: string;
        documents?: SkillBookDocument[];
      };

      if (
        !parsed.name?.trim() ||
        !parsed.instructions?.trim() ||
        !Array.isArray(parsed.documents)
      ) {
        throw new Error('Invalid import payload');
      }

      const normalizedDocs = parsed.documents
        .filter((doc) => doc?.title?.trim() && doc?.content?.trim())
        .map((doc) => ({
          title: doc.title.trim(),
          content: doc.content.trim(),
        }));

      const res = await fetch('/api/skillbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: parsed.name.trim(),
          description: parsed.description?.trim() ?? '',
          instructions: parsed.instructions.trim(),
          documents: normalizedDocs,
          isPublic: false,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create imported skillbook');
      }

      await fetchBooks();
      showToast({
        type: 'success',
        title: t('skillBook.myBooks.importedTitle'),
        message: t('skillBook.myBooks.importedMessage'),
      });
    } catch {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.importFailed'),
      });
    }
  };

  const formatUpdatedAt = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat(language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    },
    [language],
  );

  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return books.filter((book) => {
      const visibilityMatched =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'public' && book.isPublic) ||
        (visibilityFilter === 'private' && !book.isPublic);

      const queryMatched =
        !query ||
        book.name.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query);

      return visibilityMatched && queryMatched;
    });
  }, [books, searchQuery, visibilityFilter]);

  if (loading) {
    return <div className="h-24 animate-pulse rounded-md bg-slate-100" />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">{t('skillBook.myBooks.subtitle')}</p>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('skillBook.myBooks.searchPlaceholder')}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
        />
        <select
          value={visibilityFilter}
          onChange={(e) =>
            setVisibilityFilter(e.target.value as 'all' | 'public' | 'private')
          }
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="all">{t('skillBook.myBooks.filterAll')}</option>
          <option value="public">{t('skillBook.myBooks.filterPublic')}</option>
          <option value="private">{t('skillBook.myBooks.filterPrivate')}</option>
        </select>
      </div>

      <div
        className={`flex items-center justify-between rounded-md border p-3 ${
          !activeId
            ? 'border-[var(--brand-500)] bg-[var(--brand-50)]'
            : 'border-slate-200 bg-white'
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-800">
              SICP Rorschach Interpretation Guide
            </p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              {t('skillBook.myBooks.default')}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {t('skillBook.myBooks.defaultDescription')}
          </p>
        </div>
        {activeId ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => void handleUseInChat(null)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {t('skillBook.myBooks.useInChat')}
            </button>
            <button
              type="button"
              onClick={() => void handleActivate(null)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              {t('skillBook.myBooks.useDefault')}
            </button>
          </div>
        ) : (
          <CheckCircleIcon className="h-5 w-5 shrink-0 text-[var(--brand-500)]" />
        )}
      </div>

      {filteredBooks.map((book) => (
        <div
          key={book.id}
          className={`flex items-center justify-between rounded-md border p-3 ${
            activeId === book.id
              ? 'border-[var(--brand-500)] bg-[var(--brand-50)]'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-800">{book.name}</p>
              {book.isPublic && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {t('skillBook.myBooks.public')}
                </span>
              )}
            </div>
            {book.description && (
              <p className="mt-0.5 truncate text-xs text-slate-500">{book.description}</p>
            )}
            {book.originalAuthor && (
              <p className="mt-0.5 text-[11px] text-slate-400">
                {t('skillBook.myBooks.forkedFrom', { author: book.originalAuthor })}
              </p>
            )}
            <p className="mt-0.5 text-[11px] text-slate-400">
              {t('skillBook.myBooks.updatedAt')}: {formatUpdatedAt(book.updatedAt)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {activeId === book.id ? (
              <CheckCircleIcon className="h-5 w-5 text-[var(--brand-500)]" />
            ) : (
              <button
                type="button"
                onClick={() => void handleActivate(book.id)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                {t('skillBook.myBooks.activate')}
              </button>
            )}
            <button
              type="button"
              onClick={() => void handleUseInChat(book.id)}
              className="rounded p-1 text-slate-400 hover:text-slate-600"
              title={t('skillBook.myBooks.useInChat')}
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => void handleTogglePublic(book)}
              className="rounded p-1 text-slate-400 hover:text-slate-600"
              title={
                book.isPublic
                  ? t('skillBook.myBooks.makePrivate')
                  : t('skillBook.myBooks.makePublic')
              }
            >
              {book.isPublic ? (
                <LockClosedIcon className="h-4 w-4" />
              ) : (
                <GlobeAltIcon className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => void handleDuplicate(book.id)}
              className="rounded p-1 text-slate-400 hover:text-slate-600"
              title={t('skillBook.myBooks.duplicate')}
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => void handleExport(book.id)}
              className="rounded p-1 text-slate-400 hover:text-slate-600"
              title={t('skillBook.myBooks.export')}
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(book.id)}
              className="rounded p-1 text-slate-400 hover:text-slate-600"
              title={t('skillBook.myBooks.edit')}
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => void handleDelete(book.id)}
              className="rounded p-1 text-slate-400 hover:text-rose-600"
              title={t('skillBook.myBooks.delete')}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {filteredBooks.length === 0 && (
        <p className="py-4 text-center text-sm text-slate-400">
          {books.length === 0
            ? t('skillBook.myBooks.empty')
            : t('skillBook.myBooks.noMatches')}
        </p>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onNew}
          className="w-full rounded-md border border-dashed border-slate-300 bg-white py-3 text-sm font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700"
        >
          + {t('skillBook.myBooks.create')}
        </button>
        <label className="w-full cursor-pointer rounded-md border border-slate-300 bg-white py-3 text-center text-sm font-medium text-slate-600 hover:bg-slate-50">
          {t('skillBook.myBooks.import')}
          <input
            type="file"
            accept=".json,.skillbook.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImport(file);
              e.currentTarget.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
}
