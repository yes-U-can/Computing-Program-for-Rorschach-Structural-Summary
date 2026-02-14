'use client';

import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import {
  UserKnowledgeSource,
  loadUserKnowledgeSources,
  saveUserKnowledgeSources,
} from '@/lib/userKnowledge';

const MAX_FILE_SIZE = 500 * 1024; // 500KB

export default function KnowledgeSourceManager() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [sources, setSources] = useState<UserKnowledgeSource[]>(() => loadUserKnowledgeSources());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) return;
    const next = [
      {
        id: `${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
      },
      ...sources,
    ];
    setSources(next);
    saveUserKnowledgeSources(next);
    setTitle('');
    setContent('');
    showToast({ type: 'success', title: t('account.knowledgeSources.saved'), message: t('account.knowledgeSources.savedMessage') });
  };

  const handleRemove = (id: string) => {
    const next = sources.filter((s) => s.id !== id);
    setSources(next);
    saveUserKnowledgeSources(next);
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      showToast({ type: 'error', title: 'Error', message: t('account.knowledgeSources.fileTooLarge') });
      return;
    }
    const text = await file.text();
    const next = [
      {
        id: `${Date.now()}`,
        title: file.name.replace(/\.[^.]+$/, ''),
        content: text.trim(),
      },
      ...sources,
    ];
    setSources(next);
    saveUserKnowledgeSources(next);
    showToast({ type: 'success', title: t('account.knowledgeSources.uploaded'), message: t('account.knowledgeSources.uploadedMessage', { filename: file.name }) });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        {t('account.knowledgeSources.description')}
      </p>

      <div className="grid gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('account.knowledgeSources.sourceTitle')}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('account.knowledgeSources.pastePlaceholder')}
          className="h-32 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-md bg-[#2A5F7F] px-3 py-2 text-sm font-medium text-white hover:bg-[#1E4D6A]"
          >
            {t('account.knowledgeSources.addButton')}
          </button>
          <label className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            {t('account.knowledgeSources.uploadButton')}
            <input
              type="file"
              accept=".txt,.md,.csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFileUpload(file);
                e.currentTarget.value = '';
              }}
            />
          </label>
        </div>
      </div>

      <ul className="space-y-2">
        {sources.map((source) => (
          <li key={source.id} className="rounded-md border border-slate-200 bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{source.title}</p>
                <p className="mt-1 line-clamp-3 text-xs text-slate-600">{source.content}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(source.id)}
                className="text-xs font-medium text-rose-600 hover:text-rose-700"
              >
                {t('account.knowledgeSources.removeButton')}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


