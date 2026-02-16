'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { CheckCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

type SkillBookSummary = {
  id: string;
  name: string;
  description: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

type SkillBookFull = SkillBookSummary & {
  instructions: string;
  documents: string;
};

type SkillBookDocument = {
  title: string;
  content: string;
};

export default function SkillBookManager() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [books, setBooks] = useState<SkillBookSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit/Create state
  const [editing, setEditing] = useState<SkillBookFull | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formDocuments, setFormDocuments] = useState('[]');
  const [saving, setSaving] = useState(false);

  const fetchBooks = useCallback(async () => {
    try {
      const [booksRes, activeRes] = await Promise.all([
        fetch('/api/skillbooks'),
        fetch('/api/user/active-skillbook'),
      ]);
      if (booksRes.ok) {
        setBooks(await booksRes.json());
      }
      if (activeRes.ok) {
        const data = await activeRes.json();
        setActiveId(data.activeSkillBookId);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleActivate = async (id: string | null) => {
    const res = await fetch('/api/user/active-skillbook', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillBookId: id }),
    });
    if (res.ok) {
      setActiveId(id);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/skillbooks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      if (activeId === id) setActiveId(null);
    }
  };

  const handleEdit = async (id: string) => {
    const res = await fetch(`/api/skillbooks/${id}`);
    if (res.ok) {
      const data: SkillBookFull = await res.json();
      setEditing(data);
      setIsNew(false);
      setFormName(data.name);
      setFormDesc(data.description);
      setFormInstructions(data.instructions);
      try {
        const parsed = JSON.parse(data.documents || '[]');
        setFormDocuments(JSON.stringify(parsed, null, 2));
      } catch {
        setFormDocuments('[]');
      }
    }
  };

  const handleNew = () => {
    setEditing(null);
    setIsNew(true);
    setFormName('');
    setFormDesc('');
    setFormInstructions('');
    setFormDocuments('[]');
  };

  const parseDocuments = useCallback((): SkillBookDocument[] | null => {
    const trimmed = formDocuments.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (!Array.isArray(parsed)) return null;

      const normalized: SkillBookDocument[] = [];
      for (const item of parsed) {
        if (!item || typeof item !== 'object') return null;
        const title = (item as Record<string, unknown>).title;
        const content = (item as Record<string, unknown>).content;
        if (typeof title !== 'string' || typeof content !== 'string') return null;
        if (!title.trim() || !content.trim()) return null;
        normalized.push({ title: title.trim(), content: content.trim() });
      }
      return normalized;
    } catch {
      return null;
    }
  }, [formDocuments]);

  const handleSave = async () => {
    if (!formName.trim() || !formInstructions.trim()) return;
    const parsedDocuments = parseDocuments();
    if (parsedDocuments === null) {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.documentsInvalid'),
      });
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch('/api/skillbooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            description: formDesc,
            instructions: formInstructions,
            documents: parsedDocuments,
          }),
        });
        if (res.ok) {
          showToast({ type: 'success', title: t('buttons.save'), message: t('account.knowledgeSources.saved') });
          setIsNew(false);
          setEditing(null);
          await fetchBooks();
        }
      } else if (editing) {
        const res = await fetch(`/api/skillbooks/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            description: formDesc,
            instructions: formInstructions,
            documents: parsedDocuments,
          }),
        });
        if (res.ok) {
          showToast({ type: 'success', title: t('buttons.save'), message: t('account.knowledgeSources.saved') });
          setEditing(null);
          await fetchBooks();
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setIsNew(false);
    setFormDocuments('[]');
  };

  if (loading) {
    return <div className="h-24 animate-pulse rounded-md bg-slate-100" />;
  }

  // Show form (create or edit)
  if (isNew || editing) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('skillBook.myBooks.name')}
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder={t('skillBook.myBooks.namePlaceholder')}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('skillBook.myBooks.description')}
          </label>
          <input
            type="text"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder={t('skillBook.myBooks.descriptionOptional')}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('skillBook.myBooks.instructions')}
          </label>
          <textarea
            value={formInstructions}
            onChange={(e) => setFormInstructions(e.target.value)}
            placeholder={t('skillBook.myBooks.instructionsPlaceholder')}
            className="h-48 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t('skillBook.myBooks.documents')}
          </label>
          <textarea
            value={formDocuments}
            onChange={(e) => setFormDocuments(e.target.value)}
            placeholder={t('skillBook.myBooks.documentsPlaceholder')}
            className="h-36 w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-mono"
          />
          <p className="mt-1 text-xs text-slate-500">
            {t('skillBook.myBooks.documentsHelp')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !formName.trim() || !formInstructions.trim()}
            className="rounded-md bg-[var(--brand-700)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-700-hover)] disabled:opacity-50"
          >
            {saving ? '...' : t('buttons.save')}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            {t('buttons.close')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        {t('skillBook.myBooks.subtitle')}
      </p>

      {/* Default Skill Book */}
      <div
        className={`flex items-center justify-between rounded-md border p-3 ${
          !activeId ? 'border-[var(--brand-500)] bg-[var(--brand-50)]' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-800">SICP Rorschach Interpretation Guide</p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              {t('skillBook.myBooks.default')}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {t('skillBook.myBooks.defaultDescription')}
          </p>
        </div>
        {activeId ? (
          <button
            type="button"
            onClick={() => handleActivate(null)}
            className="shrink-0 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            {t('skillBook.myBooks.useDefault')}
          </button>
        ) : (
          <CheckCircleIcon className="h-5 w-5 shrink-0 text-[var(--brand-500)]" />
        )}
      </div>

      {/* User Skill Books */}
      {books.map((book) => (
        <div
          key={book.id}
          className={`flex items-center justify-between rounded-md border p-3 ${
            activeId === book.id ? 'border-[var(--brand-500)] bg-[var(--brand-50)]' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{book.name}</p>
            {book.description && (
              <p className="mt-0.5 truncate text-xs text-slate-500">{book.description}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {activeId === book.id ? (
              <CheckCircleIcon className="h-5 w-5 text-[var(--brand-500)]" />
            ) : (
              <button
                type="button"
                onClick={() => handleActivate(book.id)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                {t('skillBook.myBooks.activate')}
              </button>
            )}
            <button
              type="button"
              onClick={() => handleEdit(book.id)}
              className="rounded p-1 text-slate-400 hover:text-slate-600"
              title={t('skillBook.myBooks.edit')}
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(book.id)}
              className="rounded p-1 text-slate-400 hover:text-rose-600"
              title={t('skillBook.myBooks.delete')}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {books.length === 0 && (
        <p className="text-center text-sm text-slate-400 py-4">
          {t('skillBook.myBooks.empty')}
        </p>
      )}

      {/* Create button */}
      <button
        type="button"
        onClick={handleNew}
        className="w-full rounded-md border border-dashed border-slate-300 bg-white py-3 text-sm font-medium text-slate-500 hover:border-slate-400 hover:text-slate-700"
      >
        + {t('skillBook.myBooks.create')}
      </button>
    </div>
  );
}
