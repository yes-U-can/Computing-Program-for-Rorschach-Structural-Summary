'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import SkillBookBuilder from './SkillBookBuilder';

type SkillBookDocument = {
  title: string;
  content: string;
};

type SkillBookFull = {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  instructions: string;
  documents: string;
};

type Props = {
  editingId: string | null;
  onDone: () => void;
};

const SKILLBOOK_DRAFT_KEY = 'skillbook:new:draft:v2';
const SKILLBOOK_DRAFT_SCHEMA_VERSION = 1;

type SkillBookDraft = {
  name: string;
  description: string;
  instructions: string;
  documents: string;
  isPublic: boolean;
};

type SkillBookDraftEnvelope = {
  v: number;
  data: SkillBookDraft;
};

function buildFormSnapshot(input: {
  name: string;
  description: string;
  instructions: string;
  documents: string;
  isPublic: boolean;
}) {
  return JSON.stringify(input);
}

export default function SkillBookEditor({ editingId, onDone }: Props) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<SkillBookFull | null>(null);
  const [loading, setLoading] = useState(Boolean(editingId));
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formDocuments, setFormDocuments] = useState('[]');
  const [formIsPublic, setFormIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const lastDraftSnapshotRef = useRef<string | null>(null);
  const initialEditSnapshotRef = useRef<string>('');

  const isNew = editingId === null;

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(SKILLBOOK_DRAFT_KEY);
      lastDraftSnapshotRef.current = null;
    } catch {
      // no-op
    }
  }, []);

  const restoreDraft = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(SKILLBOOK_DRAFT_KEY);
      if (!raw) return false;
      const envelope = JSON.parse(raw) as Partial<SkillBookDraftEnvelope>;
      if (envelope.v !== SKILLBOOK_DRAFT_SCHEMA_VERSION || !envelope.data) return false;
      const draft = envelope.data as Partial<SkillBookDraft>;

      setFormName(typeof draft.name === 'string' ? draft.name : '');
      setFormDesc(typeof draft.description === 'string' ? draft.description : '');
      setFormInstructions(typeof draft.instructions === 'string' ? draft.instructions : '');
      setFormDocuments(typeof draft.documents === 'string' ? draft.documents : '[]');
      setFormIsPublic(Boolean(draft.isPublic));
      lastDraftSnapshotRef.current = raw;
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!editingId) {
      setEditing(null);
      setLoading(false);
      setFormName('');
      setFormDesc('');
      setFormInstructions('');
      setFormDocuments('[]');
      setFormIsPublic(false);
      setBuilderOpen(false);
      const restored = restoreDraft();
      if (restored) {
        showToast({
          type: 'info',
          title: t('skillBook.draft.restoredTitle'),
          message: t('skillBook.draft.restoredMessage'),
        });
      }
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/skillbooks/${editingId}`);
        if (!res.ok) throw new Error('Failed to load');
        const data = (await res.json()) as SkillBookFull;
        let documentsText = '[]';
        try {
          const parsed = JSON.parse(data.documents || '[]');
          documentsText = JSON.stringify(parsed, null, 2);
        } catch {
          documentsText = '[]';
        }
        if (!cancelled) {
          setEditing(data);
          setFormName(data.name);
          setFormDesc(data.description);
          setFormInstructions(data.instructions);
          setFormDocuments(documentsText);
          setFormIsPublic(data.isPublic);
          setBuilderOpen(false);
          initialEditSnapshotRef.current = buildFormSnapshot({
            name: data.name,
            description: data.description,
            instructions: data.instructions,
            documents: documentsText,
            isPublic: data.isPublic,
          });
        }
      } catch {
        if (!cancelled) {
          showToast({
            type: 'error',
            title: t('errors.title'),
            message: t('skillBook.myBooks.loadFailed'),
          });
          onDone();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [editingId, onDone, restoreDraft, showToast, t]);

  useEffect(() => {
    if (!isNew) return;
    const draft: SkillBookDraft = {
      name: formName,
      description: formDesc,
      instructions: formInstructions,
      documents: formDocuments,
      isPublic: formIsPublic,
    };
    const envelope: SkillBookDraftEnvelope = {
      v: SKILLBOOK_DRAFT_SCHEMA_VERSION,
      data: draft,
    };
    const timer = window.setTimeout(() => {
      try {
        const snapshot = JSON.stringify(envelope);
        if (snapshot === lastDraftSnapshotRef.current) return;
        window.localStorage.setItem(SKILLBOOK_DRAFT_KEY, snapshot);
        lastDraftSnapshotRef.current = snapshot;
      } catch {
        // no-op
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [isNew, formName, formDesc, formInstructions, formDocuments, formIsPublic]);

  const currentFormSnapshot = useMemo(
    () =>
      buildFormSnapshot({
        name: formName,
        description: formDesc,
        instructions: formInstructions,
        documents: formDocuments,
        isPublic: formIsPublic,
      }),
    [formName, formDesc, formInstructions, formDocuments, formIsPublic],
  );

  const hasUnsavedChanges = useMemo(() => {
    if (isNew) {
      return Boolean(
        formName.trim() ||
          formDesc.trim() ||
          formInstructions.trim() ||
          formDocuments.trim() !== '[]' ||
          formIsPublic,
      );
    }
    if (!editing) return false;
    return currentFormSnapshot !== initialEditSnapshotRef.current;
  }, [
    currentFormSnapshot,
    editing,
    formDesc,
    formDocuments,
    formInstructions,
    formIsPublic,
    formName,
    isNew,
  ]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasUnsavedChanges]);

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
          showToast({
            type: 'success',
            title: t('buttons.save'),
            message: t('account.knowledgeSources.saved'),
          });
          clearDraft();
          onDone();
        } else {
          showToast({
            type: 'error',
            title: t('errors.title'),
            message: t('skillBook.myBooks.saveFailed'),
          });
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
          showToast({
            type: 'success',
            title: t('buttons.save'),
            message: t('account.knowledgeSources.saved'),
          });
          onDone();
        } else {
          showToast({
            type: 'error',
            title: t('errors.title'),
            message: t('skillBook.myBooks.saveFailed'),
          });
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges && !window.confirm(t('skillBook.draft.unsavedWarning'))) {
      return;
    }
    if (isNew) clearDraft();
    onDone();
  };

  const handleClearDraft = () => {
    clearDraft();
    setFormName('');
    setFormDesc('');
    setFormInstructions('');
    setFormDocuments('[]');
    setFormIsPublic(false);
  };

  if (loading) {
    return <div className="h-24 animate-pulse rounded-md bg-slate-100" />;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
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
        <label className="mb-1 block text-sm font-medium text-slate-700">
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

      <div className="rounded-md border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">{t('skillBook.builder.title')}</p>
          <button
            type="button"
            onClick={() => setBuilderOpen((prev) => !prev)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {builderOpen ? t('buttons.close') : t('skillBook.builder.open')}
          </button>
        </div>
        {builderOpen && (
          <div className="mt-3">
            <SkillBookBuilder
              initialName={formName}
              initialDescription={formDesc}
              onGenerated={(instructions, documents) => {
                setFormInstructions(instructions);
                setFormDocuments(JSON.stringify(documents, null, 2));
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
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
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {t('skillBook.myBooks.documents')}
        </label>
        <textarea
          value={formDocuments}
          onChange={(e) => setFormDocuments(e.target.value)}
          placeholder={t('skillBook.myBooks.documentsPlaceholder')}
          className="h-36 w-full rounded-md border border-slate-300 px-3 py-2 text-xs font-mono"
        />
        <p className="mt-1 text-xs text-slate-500">{t('skillBook.myBooks.documentsHelp')}</p>
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
        {isNew && (
          <button
            type="button"
            onClick={handleClearDraft}
            className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 hover:bg-rose-100"
          >
            {t('skillBook.draft.clear')}
          </button>
        )}
      </div>
    </div>
  );
}
