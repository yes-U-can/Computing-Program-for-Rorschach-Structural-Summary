'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { CheckCircleIcon, PencilSquareIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

type SkillBookSummary = {
  id: string;
  name: string;
  description: string;
  source: string;
  isPublic: boolean;
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

type BuilderSource = {
  id: string;
  title: string;
  content: string;
};

type BuilderProvider = 'openai' | 'google' | 'anthropic';
type ApiKeyStatus = Record<BuilderProvider, boolean>;

type SkillBookManagerProps = {
  autoCreate?: boolean;
};

const MAX_FILE_SIZE = 500 * 1024; // 500KB

export default function SkillBookManager({ autoCreate = false }: SkillBookManagerProps) {
  const { t, language } = useTranslation();
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
  const [formIsPublic, setFormIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [builderProvider, setBuilderProvider] = useState<BuilderProvider>('openai');
  const [builderSources, setBuilderSources] = useState<BuilderSource[]>([]);
  const [builderLoading, setBuilderLoading] = useState(false);
  const [builderTitleInput, setBuilderTitleInput] = useState('');
  const [builderContentInput, setBuilderContentInput] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus>({ openai: false, google: false, anthropic: false });

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
      const data = await activeRes.json();
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
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    if (!autoCreate || loading) return;
    setEditing(null);
    setIsNew(true);
    setFormName('');
    setFormDesc('');
    setFormInstructions('');
    setFormDocuments('[]');
    setFormIsPublic(false);
    setBuilderSources([]);
    setBuilderTitleInput('');
    setBuilderContentInput('');
  }, [autoCreate, loading]);

  useEffect(() => {
    if (!isNew && !editing) return;
    let cancelled = false;
    const loadKeyStatus = async () => {
      try {
        const res = await fetch('/api/user/keys');
        if (!res.ok) return;
        const data = (await res.json()) as ApiKeyStatus;
        if (!cancelled) {
          setApiKeyStatus({
            openai: Boolean(data.openai),
            google: Boolean(data.google),
            anthropic: Boolean(data.anthropic),
          });
        }
      } catch {
        // no-op
      }
    };
    void loadKeyStatus();
    return () => {
      cancelled = true;
    };
  }, [isNew, editing]);

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
      setBooks((prev) => prev.filter((b) => b.id !== id));
      if (activeId === id) setActiveId(null);
    } else {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.deleteFailed'),
      });
    }
  };

  const formatUpdatedAt = useCallback((dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat(language, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  }, [language]);

  const handleEdit = async (id: string) => {
    const res = await fetch(`/api/skillbooks/${id}`);
    if (res.ok) {
      const data: SkillBookFull = await res.json();
      setEditing(data);
      setIsNew(false);
      setFormName(data.name);
      setFormDesc(data.description);
      setFormInstructions(data.instructions);
      setFormIsPublic(data.isPublic);
      setBuilderSources([]);
      setBuilderTitleInput('');
      setBuilderContentInput('');
      try {
        const parsed = JSON.parse(data.documents || '[]');
        setFormDocuments(JSON.stringify(parsed, null, 2));
      } catch {
        setFormDocuments('[]');
      }
    } else {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.loadFailed'),
      });
    }
  };

  const handleExport = async (id: string) => {
    const res = await fetch(`/api/skillbooks/${id}`);
    if (!res.ok) {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.myBooks.exportFailed'),
      });
      return;
    }

    const data = await res.json() as SkillBookFull;
    const payload = {
      name: data.name,
      description: data.description,
      instructions: data.instructions,
      documents: JSON.parse(data.documents || '[]'),
      exportedAt: new Date().toISOString(),
      version: 1,
    };
    const content = JSON.stringify(payload, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const safeName = data.name.replace(/[^a-zA-Z0-9-_]+/g, '_').slice(0, 60) || 'skillbook';
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}.skillbook.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleNew = () => {
    setEditing(null);
    setIsNew(true);
    setFormName('');
    setFormDesc('');
    setFormInstructions('');
    setFormDocuments('[]');
    setFormIsPublic(false);
    setBuilderSources([]);
    setBuilderTitleInput('');
    setBuilderContentInput('');
  };

  const handleImport = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      showToast({ type: 'error', title: t('errors.title'), message: t('skillBook.myBooks.importFailed') });
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

      if (!parsed.name?.trim() || !parsed.instructions?.trim() || !Array.isArray(parsed.documents)) {
        throw new Error('Invalid import payload');
      }

      const normalizedDocs = parsed.documents
        .filter((d) => d?.title?.trim() && d?.content?.trim())
        .map((d) => ({ title: d.title.trim(), content: d.content.trim() }));

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
      showToast({ type: 'error', title: t('errors.title'), message: t('skillBook.myBooks.importFailed') });
    }
  };

  const addBuilderSource = useCallback((title: string, content: string) => {
    if (!title.trim() || !content.trim()) return;
    setBuilderSources((prev) => [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: title.trim(), content: content.trim() },
      ...prev,
    ]);
  }, []);

  const removeBuilderSource = useCallback((id: string) => {
    setBuilderSources((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleBuilderFileUpload = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      showToast({ type: 'error', title: t('errors.title'), message: t('skillBook.builder.fileTooLarge') });
      return;
    }
    const text = await file.text();
    addBuilderSource(file.name.replace(/\.[^.]+$/, ''), text);
  }, [addBuilderSource, showToast, t]);

  const handleGenerateDraft = useCallback(async () => {
    if (!apiKeyStatus[builderProvider]) {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.builder.noApiKey'),
      });
      return;
    }

    if (!builderSources.length) {
      showToast({ type: 'error', title: t('errors.title'), message: t('skillBook.builder.noSources') });
      return;
    }

    setBuilderLoading(true);
    try {
      const res = await fetch('/api/skillbooks/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: builderProvider,
          name: formName,
          description: formDesc,
          sourceDocs: builderSources.map((s) => ({ title: s.title, content: s.content })),
        }),
      });
      if (!res.ok) {
        let message = t('skillBook.builder.generateFailed');
        try {
          const data = await res.json() as { error?: string };
          if (data.error) message = data.error;
        } catch {
          // no-op
        }
        showToast({ type: 'error', title: t('errors.title'), message });
        return;
      }

      const data = await res.json() as { instructions: string; documents: SkillBookDocument[] };
      setFormInstructions(data.instructions);
      setFormDocuments(JSON.stringify(data.documents, null, 2));
      showToast({ type: 'success', title: t('skillBook.builder.generatedTitle'), message: t('skillBook.builder.generatedMessage') });
    } catch {
      showToast({ type: 'error', title: t('errors.title'), message: t('skillBook.builder.generateFailed') });
    } finally {
      setBuilderLoading(false);
    }
  }, [apiKeyStatus, builderProvider, builderSources, formDesc, formName, showToast, t]);

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
            isPublic: formIsPublic,
          }),
        });
        if (res.ok) {
          showToast({ type: 'success', title: t('buttons.save'), message: t('account.knowledgeSources.saved') });
          setIsNew(false);
          setEditing(null);
          await fetchBooks();
        } else {
          showToast({ type: 'error', title: t('errors.title'), message: t('skillBook.myBooks.saveFailed') });
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
            isPublic: formIsPublic,
          }),
        });
        if (res.ok) {
          showToast({ type: 'success', title: t('buttons.save'), message: t('account.knowledgeSources.saved') });
          setEditing(null);
          await fetchBooks();
        } else {
          showToast({ type: 'error', title: t('errors.title'), message: t('skillBook.myBooks.saveFailed') });
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
    setFormIsPublic(false);
    setBuilderSources([]);
    setBuilderTitleInput('');
    setBuilderContentInput('');
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
        <div className="rounded-md border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-700">{t('skillBook.builder.title')}</p>
            <select
              value={builderProvider}
              onChange={(e) => setBuilderProvider(e.target.value as BuilderProvider)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
            >
              <option value="openai">OpenAI</option>
              <option value="google">Google</option>
              <option value="anthropic">Anthropic</option>
            </select>
          </div>
          <p className="mt-1 text-xs text-slate-500">{t('skillBook.builder.subtitle')}</p>
          {!apiKeyStatus[builderProvider] && (
            <p className="mt-1 text-xs text-rose-600">{t('skillBook.builder.noApiKey')}</p>
          )}

          <div className="mt-3 grid gap-2">
            <input
              type="text"
              value={builderTitleInput}
              onChange={(e) => setBuilderTitleInput(e.target.value)}
              placeholder={t('skillBook.builder.sourceTitle')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <textarea
              value={builderContentInput}
              onChange={(e) => setBuilderContentInput(e.target.value)}
              placeholder={t('skillBook.builder.sourceContent')}
              className="h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  addBuilderSource(builderTitleInput, builderContentInput);
                  setBuilderTitleInput('');
                  setBuilderContentInput('');
                }}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                {t('skillBook.builder.addSource')}
              </button>
              <label className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100">
                {t('skillBook.builder.uploadSource')}
                <input
                  type="file"
                  accept=".txt,.md,.csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleBuilderFileUpload(file);
                    e.currentTarget.value = '';
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => void handleGenerateDraft()}
                disabled={builderLoading || builderSources.length === 0 || !apiKeyStatus[builderProvider]}
                className="rounded-md bg-[var(--brand-700)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--brand-700-hover)] disabled:opacity-50"
              >
                {builderLoading ? '...' : t('skillBook.builder.generate')}
              </button>
            </div>
          </div>

          {builderSources.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {builderSources.map((source) => (
                <li key={source.id} className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2.5 py-1.5">
                  <p className="truncate text-xs text-slate-700">{source.title}</p>
                  <button
                    type="button"
                    onClick={() => removeBuilderSource(source.id)}
                    className="text-[11px] font-medium text-rose-600 hover:text-rose-700"
                  >
                    {t('skillBook.builder.removeSource')}
                  </button>
                </li>
              ))}
            </ul>
          )}
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
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={formIsPublic}
            onChange={(e) => setFormIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[var(--brand-700)] focus:ring-[var(--brand-500)]"
          />
          {t('skillBook.myBooks.publishToStore')}
        </label>
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
                onClick={() => handleActivate(book.id)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                {t('skillBook.myBooks.activate')}
              </button>
            )}
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
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleNew}
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
