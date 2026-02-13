'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/components/ui/Toast';
import { KeyIcon, EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline';

type AIProvider = 'openai' | 'google' | 'anthropic';

const PROVIDERS: { id: AIProvider; name: string }[] = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'google', name: 'Google' },
  { id: 'anthropic', name: 'Anthropic' },
];

type KeyStatus = Record<AIProvider, boolean>;

const ApiKeyInput = ({
  provider,
  isSaved,
  onStatusChange,
}: {
  provider: { id: AIProvider; name: string };
  isSaved: boolean;
  onStatusChange: () => void;
}) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: provider.id, apiKey }),
      });

      if (response.ok) {
        showToast({
          type: 'success',
          title: t('toast.apiKeySaved.title'),
          message: t('toast.apiKeySaved.message', { provider: provider.name }),
        });
        setApiKey('');
        onStatusChange();
      } else {
        throw new Error('Failed to save API key');
      }
    } catch {
      showToast({
        type: 'error',
        title: t('toast.apiKeyError.title'),
        message: t('toast.apiKeyError.message'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/user/keys?provider=${provider.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onStatusChange();
      }
    } catch {
      // silently fail
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={`${provider.id}-api-key`} className="block text-sm font-medium text-slate-700">
          {t(`account.apiKeys.${provider.id}`)}
        </label>
        <span className={`text-xs font-medium ${isSaved ? 'text-emerald-600' : 'text-slate-400'}`}>
          {isSaved ? t('account.apiKeys.saved') : t('account.apiKeys.notSaved')}
        </span>
      </div>
      <form onSubmit={handleSubmit} className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <KeyIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type={showKey ? 'text' : 'password'}
            name={`${provider.id}-api-key`}
            id={`${provider.id}-api-key`}
            className="block w-full rounded-none rounded-l-md border border-slate-300 pl-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
            placeholder={t('account.apiKeys.placeholder', { provider: provider.name })}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? (
              <EyeSlashIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
            ) : (
              <EyeIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
            )}
          </button>
        </div>
        <button
          type="submit"
          disabled={isSaving || !apiKey.trim()}
          className="relative -ml-px inline-flex items-center space-x-2 border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
        >
          {isSaving ? '...' : t('account.apiKeys.saveButton')}
        </button>
        {isSaved && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="relative -ml-px inline-flex items-center rounded-r-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
        {!isSaved && (
          <div className="rounded-r-md" />
        )}
      </form>
    </div>
  );
};

export default function ApiKeyManager() {
  const [keyStatus, setKeyStatus] = useState<KeyStatus>({ openai: false, google: false, anthropic: false });

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/user/keys');
      if (res.ok) {
        const data = await res.json();
        setKeyStatus(data);
      }
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="space-y-6">
      {PROVIDERS.map((provider) => (
        <ApiKeyInput
          key={provider.id}
          provider={provider}
          isSaved={keyStatus[provider.id]}
          onStatusChange={fetchStatus}
        />
      ))}
    </div>
  );
}
