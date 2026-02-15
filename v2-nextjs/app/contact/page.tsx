import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContactMailtoForm from '@/components/contact/ContactMailtoForm';
import { buildLanguageAlternates } from '@/lib/seo';
import type { Language } from '@/types';

type ContactPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

function normalizeLang(lang?: string): Language {
  return lang === 'ko' || lang === 'ja' || lang === 'es' || lang === 'pt' ? lang : 'en';
}

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact channel for service operation, bug reports, and privacy inquiries.',
  alternates: {
    canonical: '/contact',
    languages: buildLanguageAlternates('/contact'),
  },
};

const SUPPORT_EMAIL = 'mow.coding@gmail.com';

type Copy = {
  title: string;
  subtitle: string;
  emailLabel: string;
  responseGuide: string;
  scopeTitle: string;
  scopeItems: string[];
  formTitle: string;
  formHelp: string;
  faqTitle: string;
  faqHelp: string;
  faqItems: Array<{ q: string; a: string }>;
};

const CONTENT: Record<Language, Copy> = {
  en: {
    title: 'Contact',
    subtitle: 'For service operation, bug reports, and privacy-related requests, use the channel below.',
    emailLabel: 'Support Email',
    responseGuide: 'Typical response time: within 2-3 business days.',
    scopeTitle: 'Recommended inquiry topics',
    scopeItems: [
      'Calculation errors or unexpected behavior',
      'Account, login, or API key issues',
      'Privacy or data handling requests',
      'Feature requests and usability feedback',
    ],
    formTitle: 'Quick contact form',
    formHelp: 'This form opens your mail app with a pre-filled email draft.',
    faqTitle: 'FAQ',
    faqHelp: 'Start here first. If you still need help, use the contact form below.',
    faqItems: [
      { q: 'How many responses are needed for interpretation?', a: 'As a general guideline, 14 or more valid responses are recommended.' },
      { q: 'The AI interpretation button is disabled.', a: 'Please check Google login status and API key setup in Account Settings.' },
      { q: 'Where are my input data stored?', a: 'Input data are primarily stored in your browser local storage for convenience.' },
      { q: 'How do I report a bug?', a: 'Select "Bug report" in the form and include steps, screenshot, and expected behavior.' },
      { q: 'Can I send a collaboration or business proposal?', a: 'Yes. Select "Partnership / Collaboration" or "Business / Acquisition Proposal".' },
    ],
  },
  ko: {
    title: '\uBB38\uC758\uD558\uAE30',
    subtitle: '\uC11C\uBE44\uC2A4 \uC6B4\uC601, \uBC84\uADF8 \uC81C\uBCF4, \uAC1C\uC778\uC815\uBCF4 \uAD00\uB828 \uC694\uCCAD\uC740 \uC544\uB798 \uCC44\uB110\uC744 \uC774\uC6A9\uD574 \uC8FC\uC138\uC694.',
    emailLabel: '\uBB38\uC758 \uC774\uBA54\uC77C',
    responseGuide: '\uC77C\uBC18\uC801\uC73C\uB85C \uC601\uC5C5\uC77C \uAE30\uC900 2~3\uC77C \uC774\uB0B4\uC5D0 \uB2F5\uBCC0\uB4DC\uB9BD\uB2C8\uB2E4.',
    scopeTitle: '\uC544\uB798 \uC8FC\uC81C\uB85C \uBB38\uC758\uD558\uC2DC\uBA74 \uC88B\uC2B5\uB2C8\uB2E4',
    scopeItems: [
      '\uCC44\uC810 \uACC4\uC0B0 \uC624\uB958 \uB610\uB294 \uC608\uC0C1\uACFC \uB2E4\uB978 \uB3D9\uC791',
      '\uACC4\uC815, \uB85C\uADF8\uC778, API \uD0A4 \uAD00\uB828 \uBB38\uC81C',
      '\uAC1C\uC778\uC815\uBCF4 \uBC0F \uB370\uC774\uD130 \uCC98\uB9AC \uAD00\uB828 \uC694\uCCAD',
      '\uD3B8\uC758\uC131 \uAC1C\uC120/\uAE30\uB2A5 \uC81C\uC548',
    ],
    formTitle: '\uAC04\uD3B8 \uBB38\uC758 \uD3FC',
    formHelp: '\uD3FC\uC744 \uC81C\uCD9C\uD558\uBA74 \uBA54\uC77C \uC571\uC5D0 \uC784\uC2DC \uBB38\uC11C\uAC00 \uC790\uB3D9\uC73C\uB85C \uC791\uC131\uB429\uB2C8\uB2E4.',
    faqTitle: 'FAQ',
    faqHelp: '\uBA3C\uC800 FAQ\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694. \uD574\uACB0\uB418\uC9C0 \uC54A\uC73C\uBA74 \uC544\uB798 \uBB38\uC758 \uD3FC\uC744 \uC774\uC6A9\uD574 \uC8FC\uC138\uC694.',
    faqItems: [
      { q: '\uD574\uC11D\uC744 \uC704\uD55C \uCD5C\uC18C \uBC18\uC751 \uC218\uB294 \uBA87 \uAC1C\uC778\uAC00\uC694?', a: '\uC77C\uBC18\uC801\uC73C\uB85C \uC720\uD6A8 \uBC18\uC751 14\uAC1C \uC774\uC0C1\uC744 \uAD8C\uC7A5\uD569\uB2C8\uB2E4.' },
      { q: 'AI \uD574\uC11D \uBC84\uD2BC\uC774 \uBE44\uD65C\uC131\uD654\uB418\uC5B4 \uC788\uC5B4\uC694.', a: 'Google \uB85C\uADF8\uC778 \uC0C1\uD0DC\uC640 \uACC4\uC815\uAD00\uB9AC\uC758 API \uD0A4 \uC124\uC815 \uC5EC\uBD80\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.' },
      { q: '\uC785\uB825\uD55C \uB370\uC774\uD130\uB294 \uC5B4\uB514\uC5D0 \uC800\uC7A5\uB418\uB098\uC694?', a: '\uC785\uB825 \uB370\uC774\uD130\uB294 \uD3B8\uC758\uB97C \uC704\uD574 \uC8FC\uB85C \uBE0C\uB77C\uC6B0\uC800 \uB85C\uCEEC \uC800\uC7A5\uC18C\uC5D0 \uC800\uC7A5\uB429\uB2C8\uB2E4.' },
      { q: '\uBC84\uADF8 \uC81C\uBCF4\uB294 \uC5B4\uB5BB\uAC8C \uD558\uBA74 \uB418\uB098\uC694?', a: '\uBB38\uC758 \uC720\uD615\uC5D0\uC11C "\uBC84\uADF8 \uC81C\uBCF4"\uB97C \uC120\uD0DD\uD558\uACE0, \uC7AC\uD604 \uC21C\uC11C/\uC2A4\uD06C\uB9B0\uC0F7/\uAE30\uB300 \uB3D9\uC791\uC744 \uD568\uAED8 \uC801\uC5B4 \uC8FC\uC138\uC694.' },
      { q: '\uD611\uC5C5 \uC81C\uC548\uC774\uB098 \uC778\uC218 \uC81C\uC548\uB3C4 \uBB38\uC758 \uAC00\uB2A5\uD55C\uAC00\uC694?', a: '\uB124. \uBB38\uC758 \uC720\uD615\uC5D0\uC11C "\uC81C\uD734/\uD611\uC5C5 \uC81C\uC548" \uB610\uB294 "\uC0AC\uC5C5/\uC778\uC218 \uC81C\uC548"\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.' },
    ],
  },
  ja: {
    title: '\u304A\u554F\u3044\u5408\u308F\u305B',
    subtitle: '\u30B5\u30FC\u30D3\u30B9\u904B\u7528\u3001\u30D0\u30B0\u5831\u544A\u3001\u500B\u4EBA\u60C5\u5831\u306B\u95A2\u3059\u308B\u4F9D\u983C\u306F\u4EE5\u4E0B\u306E\u7A93\u53E3\u3092\u3054\u5229\u7528\u304F\u3060\u3055\u3044\u3002',
    emailLabel: '\u9023\u7D61\u30E1\u30FC\u30EB',
    responseGuide: '\u901A\u5E38\u30012\u301C3\u55B6\u696D\u65E5\u4EE5\u5185\u306B\u56DE\u7B54\u3057\u307E\u3059\u3002',
    scopeTitle: '\u304A\u554F\u3044\u5408\u308F\u305B\u306E\u4E3B\u306A\u5185\u5BB9',
    scopeItems: [
      '\u63A1\u70B9\u8A08\u7B97\u30A8\u30E9\u30FC\u307E\u305F\u306F\u4E88\u671F\u3057\u306A\u3044\u52D5\u4F5C',
      '\u30A2\u30AB\u30A6\u30F3\u30C8\u3001\u30ED\u30B0\u30A4\u30F3\u3001API\u30AD\u30FC\u306E\u554F\u984C',
      '\u500B\u4EBA\u60C5\u5831\u30FB\u30C7\u30FC\u30BF\u53D6\u6271\u3044\u306B\u95A2\u3059\u308B\u4F9D\u983C',
      '\u4F7F\u3044\u52DD\u624B\u6539\u5584\u30FB\u6A5F\u80FD\u63D0\u6848',
    ],
    formTitle: '\u7C21\u6613\u304A\u554F\u3044\u5408\u308F\u305B\u30D5\u30A9\u30FC\u30E0',
    formHelp: '\u9001\u4FE1\u3059\u308B\u3068\u3001\u30E1\u30FC\u30EB\u30A2\u30D7\u30EA\u3067\u4E0B\u66F8\u304D\u304C\u81EA\u52D5\u4F5C\u6210\u3055\u308C\u307E\u3059\u3002',
    faqTitle: 'FAQ',
    faqHelp: '\u307E\u305AFAQ\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002\u89E3\u6C7A\u3057\u306A\u3044\u5834\u5408\u306F\u4E0B\u306E\u30D5\u30A9\u30FC\u30E0\u3092\u3054\u5229\u7528\u304F\u3060\u3055\u3044\u3002',
    faqItems: [
      { q: '\u89E3\u91C8\u306B\u5FC5\u8981\u306A\u53CD\u5FDC\u6570\u306E\u76EE\u5B89\u306F\uFF1F', a: '\u4E00\u822C\u7684\u306B\u306F\u6709\u52B9\u53CD\u5FDC14\u4EF6\u4EE5\u4E0A\u304C\u63A8\u5968\u3067\u3059\u3002' },
      { q: 'AI\u89E3\u91C8\u30DC\u30BF\u30F3\u304C\u7121\u52B9\u3067\u3059\u3002', a: 'Google\u30ED\u30B0\u30A4\u30F3\u72B6\u614B\u3068\u30A2\u30AB\u30A6\u30F3\u30C8\u8A2D\u5B9A\u306EAPI\u30AD\u30FC\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002' },
      { q: '\u5165\u529B\u30C7\u30FC\u30BF\u306F\u3069\u3053\u306B\u4FDD\u5B58\u3055\u308C\u307E\u3059\u304B\uFF1F', a: '\u4E3B\u306B\u5229\u4FBF\u6027\u306E\u305F\u3081\u30D6\u30E9\u30A6\u30B6\u306E\u30ED\u30FC\u30AB\u30EB\u4FDD\u5B58\u9818\u57DF\u306B\u4FDD\u5B58\u3055\u308C\u307E\u3059\u3002' },
      { q: '\u30D0\u30B0\u5831\u544A\u306E\u65B9\u6CD5\u306F\uFF1F', a: '\u30D5\u30A9\u30FC\u30E0\u3067\u300C\u30D0\u30B0\u5831\u544A\u300D\u3092\u9078\u3073\u3001\u518D\u73FE\u624B\u9806\u30FB\u753B\u9762\u30FB\u671F\u5F85\u52D5\u4F5C\u3092\u8A18\u8F09\u3057\u3066\u304F\u3060\u3055\u3044\u3002' },
      { q: '\u5354\u696D\u63D0\u6848\u3084M&A\u63D0\u6848\u306F\u53EF\u80FD\u3067\u3059\u304B\uFF1F', a: '\u306F\u3044\u3002\u300C\u63D0\u643A/\u5354\u696D\u63D0\u6848\u300D\u307E\u305F\u306F\u300C\u4E8B\u696D/\u8CB7\u53CE\u63D0\u6848\u300D\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002' },
    ],
  },
  es: {
    title: 'Contacto',
    subtitle: 'Para operacion del servicio, reporte de errores y solicitudes de privacidad, use el canal de abajo.',
    emailLabel: 'Correo de soporte',
    responseGuide: 'Tiempo de respuesta habitual: 2-3 dias habiles.',
    scopeTitle: 'Consultas recomendadas',
    scopeItems: [
      'Errores de calculo o comportamiento inesperado',
      'Problemas de cuenta, inicio de sesion o clave API',
      'Solicitudes de privacidad y manejo de datos',
      'Sugerencias de funciones y mejoras de uso',
    ],
    formTitle: 'Formulario rapido de contacto',
    formHelp: 'Al enviar el formulario, se abrira tu app de correo con un borrador listo.',
    faqTitle: 'FAQ',
    faqHelp: 'Revise primero esta seccion. Si no se resuelve, use el formulario de contacto.',
    faqItems: [
      { q: 'Cuantas respuestas se recomiendan para interpretar?', a: 'Como guia general, se recomiendan 14 o mas respuestas validas.' },
      { q: 'El boton de interpretacion AI esta desactivado.', a: 'Verifique el inicio de sesion con Google y la configuracion de la clave API.' },
      { q: 'Donde se guardan mis datos?', a: 'Principalmente en el almacenamiento local del navegador para su comodidad.' },
      { q: 'Como reporto un error?', a: 'Elija "Reporte de error" e incluya pasos, captura y resultado esperado.' },
      { q: 'Puedo enviar propuesta de colaboracion o adquisicion?', a: 'Si. Seleccione "Alianza / Colaboracion" o "Propuesta de negocio / adquisicion".' },
    ],
  },
  pt: {
    title: 'Contato',
    subtitle: 'Para operacao do servico, relato de bugs e solicitacoes de privacidade, use o canal abaixo.',
    emailLabel: 'Email de suporte',
    responseGuide: 'Prazo medio de resposta: 2-3 dias uteis.',
    scopeTitle: 'Assuntos recomendados',
    scopeItems: [
      'Erros de calculo ou comportamento inesperado',
      'Problemas de conta, login ou chave de API',
      'Solicitacoes de privacidade e tratamento de dados',
      'Sugestoes de recursos e melhorias de usabilidade',
    ],
    formTitle: 'Formulario rapido de contato',
    formHelp: 'Ao enviar, seu app de email sera aberto com um rascunho preenchido.',
    faqTitle: 'FAQ',
    faqHelp: 'Veja primeiro esta secao. Se ainda precisar, use o formulario de contato.',
    faqItems: [
      { q: 'Quantas respostas sao recomendadas para interpretacao?', a: 'Como orientacao geral, recomenda-se 14 ou mais respostas validas.' },
      { q: 'O botao de interpretacao por IA esta desativado.', a: 'Verifique o login Google e a configuracao da chave de API.' },
      { q: 'Onde meus dados sao armazenados?', a: 'Principalmente no armazenamento local do navegador para conveniencia.' },
      { q: 'Como relatar um bug?', a: 'Escolha "Relato de bug" e informe passos, imagem e resultado esperado.' },
      { q: 'Posso enviar proposta de parceria ou aquisicao?', a: 'Sim. Selecione "Parceria / Colaboracao" ou "Proposta de negocio / aquisicao".' },
    ],
  },
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { lang } = await searchParams;
  const activeLang = normalizeLang(lang);
  const content = CONTENT[activeLang];

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">{content.title}</h1>
          <p className="mt-3 text-slate-600">{content.subtitle}</p>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{content.emailLabel}</p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-1 inline-block text-base font-semibold text-[var(--brand-700)] underline underline-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>
            <p className="mt-2 text-xs text-slate-500">{content.responseGuide}</p>
          </div>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-slate-800">{content.scopeTitle}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {content.scopeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-lg border border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-800">{content.faqTitle}</h2>
            <p className="mt-1 text-sm text-slate-500">{content.faqHelp}</p>
            <div className="mt-4 space-y-2">
              {content.faqItems.map((item) => (
                <details key={item.q} className="rounded-md border border-slate-200 bg-white">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-800">
                    {item.q}
                  </summary>
                  <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-lg border border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-800">{content.formTitle}</h2>
            <p className="mt-1 text-sm text-slate-500">{content.formHelp}</p>
            <ContactMailtoForm email={SUPPORT_EMAIL} language={activeLang} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
