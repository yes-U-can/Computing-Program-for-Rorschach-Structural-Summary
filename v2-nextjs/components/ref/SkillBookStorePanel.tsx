'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';

type PublicSkillBook = {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  authorName: string;
};

export default function SkillBookStorePanel() {
  const { status } = useSession();
  const { t, language } = useTranslation();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<PublicSkillBook[]>([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'name'>('updated');
  const [importingId, setImportingId] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/skillbooks?visibility=public');
      if (!res.ok) {
        throw new Error('Failed to load');
      }
      setBooks(await res.json());
    } catch {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.store.loadFailed'),
      });
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? books
      : books.filter((book) =>
      [book.name, book.description, book.authorName].some((v) => v.toLowerCase().includes(q)),
    );

    return [...base].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [books, query, sortBy]);

  const formatDate = useCallback((value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(language, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  }, [language]);

  const handleImport = useCallback(async (skillBookId: string, activate: boolean) => {
    setImportingId(skillBookId);
    try {
      const res = await fetch('/api/skillbooks/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillBookId }),
      });
      if (!res.ok) {
        throw new Error('Import failed');
      }
      const data = await res.json() as { imported?: boolean; reason?: string; id?: string };
      const importedId = data.id ?? null;

      if (data.imported === false && data.reason === 'already_exists') {
        showToast({
          type: 'info',
          title: t('skillBook.store.importedTitle'),
          message: t('skillBook.store.alreadyImported'),
        });
      } else {
        showToast({
          type: 'success',
          title: t('skillBook.store.importedTitle'),
          message: t('skillBook.store.importedMessage'),
        });
      }

      if (activate && importedId) {
        const activeRes = await fetch('/api/user/active-skillbook', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skillBookId: importedId }),
        });
        if (activeRes.ok) {
          showToast({
            type: 'success',
            title: t('skillBook.store.activatedTitle'),
            message: t('skillBook.store.activatedMessage'),
          });
        }
      }
    } catch {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.store.importFailed'),
      });
    } finally {
      setImportingId(null);
    }
  }, [showToast, t]);

  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <SparklesIcon className="h-5 w-5 text-[var(--brand-600)]" />
        <h2 className="text-lg font-semibold text-slate-800">{t('skillBook.store.title')}</h2>
      </div>
      <p className="mt-1 text-sm text-slate-600">{t('skillBook.store.subtitle')}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('skillBook.store.searchPlaceholder')}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'updated' | 'name')}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
        >
          <option value="updated">{t('skillBook.store.sortUpdated')}</option>
          <option value="name">{t('skillBook.store.sortName')}</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-4 h-24 animate-pulse rounded-md bg-slate-100" />
      ) : filtered.length === 0 ? (
        <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
          {t('skillBook.store.empty')}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filtered.map((book) => (
            <li key={book.id} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm font-semibold text-slate-800">{book.name}</p>
              {book.description && (
                <p className="mt-1 text-xs text-slate-600">{book.description}</p>
              )}
              <p className="mt-2 text-[11px] text-slate-400">
                {t('skillBook.store.author')}: {book.authorName} · {t('skillBook.store.updatedAt')}: {formatDate(book.updatedAt)}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {status === 'authenticated' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => void handleImport(book.id, false)}
                      disabled={importingId === book.id}
                      className="rounded-md bg-[var(--brand-700)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--brand-700-hover)] disabled:opacity-60"
                    >
                      {importingId === book.id ? '...' : t('skillBook.store.import')}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleImport(book.id, true)}
                      disabled={importingId === book.id}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      {t('skillBook.store.importAndActivate')}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/"
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {t('skillBook.store.loginToImport')}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
