'use client';

import { useState } from 'react';
import type { Language } from '@/types';

type CopyPageButtonProps = {
  language: Language;
  targetId: string;
};

const LABELS: Record<Language, { idle: string; done: string }> = {
  en: { idle: 'Copy', done: 'Copied' },
  ko: { idle: '복사', done: '복사됨' },
  ja: { idle: 'コピー', done: 'コピー済み' },
  es: { idle: 'Copiar', done: 'Copiado' },
  pt: { idle: 'Copiar', done: 'Copiado' },
};

export default function CopyPageButton({ language, targetId }: CopyPageButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const el = document.getElementById(targetId);
    if (!el) {
      return;
    }

    const text = el.innerText.trim();
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const label = copied ? LABELS[language].done : LABELS[language].idle;

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
    >
      {label}
    </button>
  );
}
