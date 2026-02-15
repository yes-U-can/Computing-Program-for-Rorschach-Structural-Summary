'use client';

import { useMemo, useState } from 'react';
import type { Language } from '@/types';

type Props = {
  email: string;
  language: Language;
};

type Labels = {
  name: string;
  replyEmail: string;
  category: string;
  message: string;
  submit: string;
  categories: {
    bug: string;
    account: string;
    privacy: string;
    feature: string;
    partnership: string;
    business: string;
    other: string;
  };
  required: string;
};

const FORM_LABELS: Record<Language, Labels> = {
  en: {
    name: 'Name',
    replyEmail: 'Reply Email',
    category: 'Category',
    message: 'Message',
    submit: 'Open Email Draft',
    categories: {
      bug: 'Bug report',
      account: 'Account / API key',
      privacy: 'Privacy request',
      feature: 'Feature suggestion',
      partnership: 'Partnership / Collaboration',
      business: 'Business / Acquisition Proposal',
      other: 'Other',
    },
    required: 'Please enter a message.',
  },
  ko: {
    name: '\uC774\uB984',
    replyEmail: '\uD68C\uC2E0\uBC1B\uC744 \uC774\uBA54\uC77C',
    category: '\uBB38\uC758 \uC720\uD615',
    message: '\uBB38\uC758 \uB0B4\uC6A9',
    submit: '\uBA54\uC77C \uC784\uC2DC\uBB38 \uC5F4\uAE30',
    categories: {
      bug: '\uBC84\uADF8 \uC81C\uBCF4',
      account: '\uACC4\uC815 / API \uD0A4',
      privacy: '\uAC1C\uC778\uC815\uBCF4 \uAD00\uB828',
      feature: '\uAE30\uB2A5 \uC81C\uC548',
      partnership: '\uC81C\uD734 / \uD611\uC5C5 \uC81C\uC548',
      business: '\uC0AC\uC5C5 / \uC778\uC218 \uC81C\uC548',
      other: '\uAE30\uD0C0',
    },
    required: '\uBB38\uC758 \uB0B4\uC6A9\uC744 \uC785\uB825\uD574 \uC8FC\uC138\uC694.',
  },
  ja: {
    name: '\u304A\u540D\u524D',
    replyEmail: '\u8FD4\u4FE1\u7528\u30E1\u30FC\u30EB',
    category: '\u554F\u3044\u5408\u308F\u305B\u7A2E\u5225',
    message: '\u554F\u3044\u5408\u308F\u305B\u5185\u5BB9',
    submit: '\u30E1\u30FC\u30EB\u4E0B\u66F8\u304D\u3092\u958B\u304F',
    categories: {
      bug: '\u30D0\u30B0\u5831\u544A',
      account: '\u30A2\u30AB\u30A6\u30F3\u30C8 / API\u30AD\u30FC',
      privacy: '\u500B\u4EBA\u60C5\u5831\u95A2\u9023',
      feature: '\u6A5F\u80FD\u63D0\u6848',
      partnership: '\u63D0\u643A / \u5354\u696D\u63D0\u6848',
      business: '\u4E8B\u696D / \u8CB7\u53CE\u63D0\u6848',
      other: '\u305D\u306E\u4ED6',
    },
    required: '\u554F\u3044\u5408\u308F\u305B\u5185\u5BB9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002',
  },
  es: {
    name: 'Nombre',
    replyEmail: 'Correo para respuesta',
    category: 'Categoria',
    message: 'Mensaje',
    submit: 'Abrir borrador de correo',
    categories: {
      bug: 'Reporte de error',
      account: 'Cuenta / clave API',
      privacy: 'Privacidad',
      feature: 'Sugerencia de funcion',
      partnership: 'Alianza / Colaboracion',
      business: 'Propuesta de negocio / adquisicion',
      other: 'Otro',
    },
    required: 'Por favor, escribe tu mensaje.',
  },
  pt: {
    name: 'Nome',
    replyEmail: 'Email para resposta',
    category: 'Categoria',
    message: 'Mensagem',
    submit: 'Abrir rascunho de email',
    categories: {
      bug: 'Relato de bug',
      account: 'Conta / chave API',
      privacy: 'Privacidade',
      feature: 'Sugestao de recurso',
      partnership: 'Parceria / Colaboracao',
      business: 'Proposta de negocio / aquisicao',
      other: 'Outro',
    },
    required: 'Por favor, escreva sua mensagem.',
  },
};

export default function ContactMailtoForm({ email, language }: Props) {
  const labels = FORM_LABELS[language];
  const [name, setName] = useState('');
  const [replyEmail, setReplyEmail] = useState('');
  const [category, setCategory] = useState<'bug' | 'account' | 'privacy' | 'feature' | 'partnership' | 'business' | 'other'>('bug');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const categoryLabel = useMemo(() => labels.categories[category], [labels, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError(labels.required);
      return;
    }
    setError('');

    const subject = `[Contact] ${categoryLabel}`;
    const body = [
      `${labels.name}: ${name || '-'}`,
      `${labels.replyEmail}: ${replyEmail || '-'}`,
      `${labels.category}: ${categoryLabel}`,
      '',
      message.trim(),
    ].join('\n');

    const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-slate-700">
          <span className="mb-1 block">{labels.name}</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
          />
        </label>
        <label className="text-sm text-slate-700">
          <span className="mb-1 block">{labels.replyEmail}</span>
          <input
            type="email"
            value={replyEmail}
            onChange={(e) => setReplyEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
          />
        </label>
      </div>

      <label className="text-sm text-slate-700">
        <span className="mb-1 block">{labels.category}</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
        >
          <option value="bug">{labels.categories.bug}</option>
          <option value="account">{labels.categories.account}</option>
          <option value="privacy">{labels.categories.privacy}</option>
          <option value="feature">{labels.categories.feature}</option>
          <option value="partnership">{labels.categories.partnership}</option>
          <option value="business">{labels.categories.business}</option>
          <option value="other">{labels.categories.other}</option>
        </select>
      </label>

      <label className="text-sm text-slate-700">
        <span className="mb-1 block">{labels.message}</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]/20"
        />
      </label>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <button
        type="submit"
        className="inline-flex items-center rounded-md border border-[var(--brand-200)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-700)] transition-colors hover:bg-[#EEF3F7]"
      >
        {labels.submit}
      </button>
    </form>
  );
}
