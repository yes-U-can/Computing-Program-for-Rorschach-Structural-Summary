'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';

type BuilderProvider = 'openai' | 'google' | 'anthropic';
type ApiKeyStatus = Record<BuilderProvider, boolean>;

type SkillBookDocument = {
  title: string;
  content: string;
};

type BuilderSource = {
  id: string;
  title: string;
  content: string;
};

type Props = {
  initialName?: string;
  initialDescription?: string;
  onGenerated: (instructions: string, documents: SkillBookDocument[]) => void;
};

const MAX_FILE_SIZE = 500 * 1024;

export default function SkillBookBuilder({
  initialName = '',
  initialDescription = '',
  onGenerated,
}: Props) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [builderProvider, setBuilderProvider] = useState<BuilderProvider>('openai');
  const [builderSources, setBuilderSources] = useState<BuilderSource[]>([]);
  const [builderLoading, setBuilderLoading] = useState(false);
  const [builderTitleInput, setBuilderTitleInput] = useState('');
  const [builderContentInput, setBuilderContentInput] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus>({
    openai: false,
    google: false,
    anthropic: false,
  });

  useEffect(() => {
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
  }, []);

  const addBuilderSource = useCallback((title: string, content: string) => {
    if (!title.trim() || !content.trim()) return;
    setBuilderSources((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: title.trim(),
        content: content.trim(),
      },
      ...prev,
    ]);
  }, []);

  const removeBuilderSource = useCallback((id: string) => {
    setBuilderSources((prev) => prev.filter((source) => source.id !== id));
  }, []);

  const handleBuilderFileUpload = useCallback(
    async (file: File) => {
      if (file.size > MAX_FILE_SIZE) {
        showToast({
          type: 'error',
          title: t('errors.title'),
          message: t('skillBook.builder.fileTooLarge'),
        });
        return;
      }
      const text = await file.text();
      addBuilderSource(file.name.replace(/\.[^.]+$/, ''), text);
    },
    [addBuilderSource, showToast, t],
  );

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
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.builder.noSources'),
      });
      return;
    }

    setBuilderLoading(true);
    try {
      const res = await fetch('/api/skillbooks/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: builderProvider,
          name: initialName,
          description: initialDescription,
          sourceDocs: builderSources.map((source) => ({
            title: source.title,
            content: source.content,
          })),
        }),
      });
      if (!res.ok) {
        let message = t('skillBook.builder.generateFailed');
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          // no-op
        }
        showToast({ type: 'error', title: t('errors.title'), message });
        return;
      }

      const data = (await res.json()) as {
        instructions: string;
        documents: SkillBookDocument[];
      };
      onGenerated(data.instructions, data.documents);
      showToast({
        type: 'success',
        title: t('skillBook.builder.generatedTitle'),
        message: t('skillBook.builder.generatedMessage'),
      });
    } catch {
      showToast({
        type: 'error',
        title: t('errors.title'),
        message: t('skillBook.builder.generateFailed'),
      });
    } finally {
      setBuilderLoading(false);
    }
  }, [
    apiKeyStatus,
    builderProvider,
    builderSources,
    initialDescription,
    initialName,
    onGenerated,
    showToast,
    t,
  ]);

  return (
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
      <p className="mt-1 rounded bg-amber-50 px-2 py-1 text-xs text-amber-600">
        {t('skillBook.builder.usesYourKey')}
      </p>
      {!apiKeyStatus[builderProvider] && (
        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="text-xs text-rose-600">{t('skillBook.builder.noApiKey')}</p>
          <a
            href="#api-keys"
            className="text-[11px] font-semibold text-[var(--brand-700)] hover:underline"
          >
            {t('skillBook.builder.goToApiKeys')}
          </a>
        </div>
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
            disabled={
              builderLoading ||
              builderSources.length === 0 ||
              !apiKeyStatus[builderProvider]
            }
            className="rounded-md bg-[var(--brand-700)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--brand-700-hover)] disabled:opacity-50"
          >
            {builderLoading ? '...' : t('skillBook.builder.generate')}
          </button>
        </div>
      </div>

      {builderSources.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {builderSources.map((source) => (
            <li
              key={source.id}
              className="flex items-center justify-between gap-2 rounded border border-slate-200 bg-white px-2.5 py-1.5"
            >
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
  );
}
