import type { Language } from '@/types';

type ItemLike = {
  kind: 'category' | 'entry';
  id: string;
  slug: string[];
};

const CATEGORY_LABELS: Record<string, Record<Language, string>> = {
  card: { en: 'Card', ko: '카드', ja: 'カード', es: 'Lámina', pt: 'Cartão' },
  location: { en: 'Location', ko: '위치', ja: '反応領域', es: 'Localización', pt: 'Localização' },
  dq: { en: 'Developmental Quality', ko: '발달질', ja: '発達質', es: 'Calidad Evolutiva', pt: 'Qualidade do Desenvolvimento' },
  determinants: { en: 'Determinants', ko: '결정인', ja: '決定因', es: 'Determinantes', pt: 'Determinantes' },
  fq: { en: 'Form Quality', ko: '형태질', ja: '形態質', es: 'Calidad Formal', pt: 'Qualidade Formal' },
  pair: { en: 'Pair', ko: '쌍반응', ja: '対反応', es: 'Par', pt: 'Par' },
  contents: { en: 'Contents', ko: '내용', ja: '内容', es: 'Contenidos', pt: 'Conteúdos' },
  popular: { en: 'Popular', ko: '평범반응', ja: '平凡反応', es: 'Popular', pt: 'Popular' },
  z: { en: 'Z', ko: '조직활동', ja: '組織化活動', es: 'Z', pt: 'Z' },
  score: { en: 'Score', ko: '점수', ja: '得点', es: 'Puntuación', pt: 'Pontuação' },
  gphr: { en: 'G/PHR', ko: 'G/PHR', ja: 'G/PHR', es: 'G/PHR', pt: 'G/PHR' },
  'special-score': { en: 'Special Score', ko: '특수점수', ja: '特殊得点', es: 'Puntuación Especial', pt: 'Pontuação Especial' },
};

function firstScoringCategory(slug: string[]): string | null {
  if (!slug.includes('scoring-input')) return null;
  const known = Object.keys(CATEGORY_LABELS);
  return slug.find((s) => known.includes(s)) ?? null;
}

function sectionForResult(slug: string[]): string {
  if (slug.includes('core')) return 'core';
  if (slug.includes('ideation')) return 'ideation';
  if (slug.includes('affect')) return 'affect';
  if (slug.includes('mediation')) return 'mediation';
  if (slug.includes('processing')) return 'processing';
  if (slug.includes('interpersonal')) return 'interpersonal';
  if (slug.includes('selfPerception')) return 'self';
  if (slug.includes('special-indices')) return 'indices';
  if (slug.includes('upper-section')) return 'upper';
  return 'general';
}

function scoringEntryText(code: string, categoryId: string, lang: Language): string {
  const category = CATEGORY_LABELS[categoryId]?.[lang] ?? categoryId;
  const map: Record<Language, string> = {
    en: [
      `[Definition] ${code} is a ${category} coding element in the Exner Comprehensive System. It should be assigned only when the response explicitly supports the code, not by inference.`,
      `[How to Score] First identify the exact response phrase, then confirm whether it satisfies the category rule, and finally check mutual-exclusion rules with neighboring codes.`,
      `[Interpretation] A single code should never be interpreted in isolation. Use frequency, distribution across cards, and co-occurrence with DQ/FQ/Special Scores before making clinical hypotheses.`,
      `[Common Errors] The most frequent mistakes are over-coding, coding by examiner expectation, and ignoring hierarchy rules. When uncertain, record lower-confidence options in notes, then review with the full protocol.`,
      `[AI Usage Note] This code definition is intended to support protocol discussion, not independent diagnosis. Final interpretation must integrate interview, history, and qualified clinical judgment.`,
    ].join('\n\n'),
    ko: [
      `[정의] ${code}는 Exner 종합체계의 ${category} 채점 코드입니다. 피검자의 실제 반응에 근거해 부여해야 하며, 추정으로 부여하면 안 됩니다.`,
      `[채점 절차] 반응 원문을 먼저 확정하고, 해당 코드의 기준을 충족하는지 확인한 다음, 인접 코드와의 상호배제/우선순위 규칙을 점검합니다.`,
      `[해석 원칙] 단일 코드는 단독 해석하지 않습니다. 빈도, 카드별 분포, DQ·FQ·특수점수와의 동시 출현 패턴을 함께 보아야 임상 가설을 세울 수 있습니다.`,
      `[흔한 오류] 과잉 채점, 검사자 기대에 의한 채점, 위계 규칙 무시가 가장 흔합니다. 애매한 경우는 메모로 보류하고 프로토콜 전체 맥락에서 재검토해야 합니다.`,
      `[AI 활용 주의] 본 설명은 교육 및 논의 지원용입니다. 최종 임상판단은 면담·병력·전문가 평가를 통합해 내려야 합니다.`,
    ].join('\n\n'),
    ja: [
      `[定義] ${code} は Exner 包括システムの ${category} コードです。被検者の実際の反応に基づいて付与し、推測で付与してはいけません。`,
      `[採点手順] 反応の原文を確定し、基準適合を確認し、隣接コードとの排他・優先ルールを点検します。`,
      `[解釈原則] 単一コードの単独解釈は避けます。頻度、カード分布、DQ・FQ・特殊得点との組み合わせを統合して解釈します。`,
      `[よくある誤り] 過剰採点、検査者期待による採点、階層規則の無視が代表的です。不確実な場合は保留して全体プロトコルで再検討します。`,
      `[AI利用上の注意] 本説明は議論支援目的であり、最終臨床判断は面接・病歴・専門的評価の統合が必要です。`,
    ].join('\n\n'),
    es: [
      `[Definición] ${code} es un elemento de codificación de ${category} en el sistema Exner. Debe asignarse por evidencia explícita de la respuesta, no por inferencia.`,
      `[Cómo puntuar] Identifique la frase exacta, verifique el criterio del código y revise reglas de exclusión/jerarquía con códigos cercanos.`,
      `[Interpretación] No se interpreta un código aislado. Use frecuencia, distribución por lámina y co-ocurrencia con DQ/FQ/Puntuaciones Especiales.`,
      `[Errores comunes] Sobre-codificación, codificación por expectativa del evaluador y omitir reglas jerárquicas. Si hay duda, documente y reevalúe con el protocolo completo.`,
      `[Nota de uso con IA] Este contenido apoya discusión técnica; no reemplaza diagnóstico clínico integral.`,
    ].join('\n\n'),
    pt: [
      `[Definição] ${code} é um elemento de codificação de ${category} no sistema Exner. Deve ser atribuído por evidência explícita da resposta, não por inferência.`,
      `[Como pontuar] Identifique a frase exata, confirme o critério do código e revise regras de exclusão/hierarquia com códigos próximos.`,
      `[Interpretação] Um código isolado não deve ser interpretado sozinho. Considere frequência, distribuição por cartão e coocorrência com DQ/FQ/Pontuações Especiais.`,
      `[Erros comuns] Supercodificação, codificação por expectativa do avaliador e ignorar regras hierárquicas. Em caso de dúvida, registre e reavalie com o protocolo completo.`,
      `[Nota para uso com IA] Este texto apoia discussão técnica e não substitui diagnóstico clínico integrado.`,
    ].join('\n\n'),
  };
  return map[lang];
}

function resultEntryText(title: string, base: string, section: string, lang: Language): string {
  const sectionName: Record<Language, Record<string, string>> = {
    en: { upper: 'Upper Section', core: 'Core', ideation: 'Ideation', affect: 'Affect', mediation: 'Mediation', processing: 'Processing', interpersonal: 'Interpersonal', self: 'Self-Perception', indices: 'Special Indices', general: 'General' },
    ko: { upper: '상단영역', core: '핵심영역', ideation: '사고영역', affect: '정서영역', mediation: '매개영역', processing: '처리영역', interpersonal: '대인관계영역', self: '자기지각영역', indices: '특수지표', general: '일반영역' },
    ja: { upper: '上位領域', core: '中核領域', ideation: '思考領域', affect: '感情領域', mediation: '媒介領域', processing: '処理領域', interpersonal: '対人領域', self: '自己知覚領域', indices: '特殊指標', general: '一般領域' },
    es: { upper: 'Sección Superior', core: 'Núcleo', ideation: 'Ideación', affect: 'Afecto', mediation: 'Mediación', processing: 'Procesamiento', interpersonal: 'Interpersonal', self: 'Autopercepción', indices: 'Índices Especiales', general: 'General' },
    pt: { upper: 'Seção Superior', core: 'Núcleo', ideation: 'Ideação', affect: 'Afeto', mediation: 'Mediação', processing: 'Processamento', interpersonal: 'Interpessoal', self: 'Autopercepção', indices: 'Índices Especiais', general: 'Geral' },
  };

  const sec = sectionName[lang][section] ?? sectionName[lang].general;
  const safeBase = base && !base.startsWith('Temporary ') ? base : '';

  const map: Record<Language, string> = {
    en: [
      `[Concept] ${title} is interpreted within ${sec}. ${safeBase}`,
      `[Clinical Reading] Evaluate this variable through level, direction, and stability across the whole protocol. Use neighboring indicators to separate trait-like pattern from state-like fluctuation.`,
      `[Integration Rule] Do not anchor conclusions on a single cut-off. Prioritize convergence across structural domains (processing, affect, ideation, and interpersonal representation).`,
      `[Caution] Extreme values can emerge from response style, protocol length, or situational stress. Always examine validity conditions before high-stakes interpretation.`,
      `[AI Usage Note] This text supports structured case discussion. Final clinical decisions require licensed professional judgment.`,
    ].join('\n\n'),
    ko: [
      `[개념] ${title}는 ${sec} 맥락에서 해석합니다. ${safeBase}`,
      `[임상 해석] 해당 변수의 절대수준, 방향성, 프로토콜 전반의 일관성을 함께 확인합니다. 인접 지표와 결합해 상태 요인과 특성 요인을 구분해야 합니다.`,
      `[통합 원칙] 단일 절단점에 의존하지 말고 처리·정서·사고·대인영역의 수렴 근거를 우선합니다.`,
      `[주의점] 극단값은 반응양식, 반응수, 상황 스트레스의 영향을 받을 수 있습니다. 타당도 조건을 먼저 점검해야 합니다.`,
      `[AI 활용 주의] 본 문서는 구조화된 사례 토의를 돕는 자료이며, 최종 임상결정은 전문가 판단이 필요합니다.`,
    ].join('\n\n'),
    ja: [
      `[概念] ${title} は ${sec} の文脈で解釈します。${safeBase}`,
      `[臨床的読解] 水準・方向・プロトコル全体での安定性を確認し、隣接指標との組み合わせで状態要因と特性要因を区別します。`,
      `[統合原則] 単一のカットオフに依存せず、処理・感情・思考・対人領域の収束を優先します。`,
      `[注意点] 極端値は反応様式、反応数、状況ストレスの影響で生じます。まず妥当性条件を確認してください。`,
      `[AI利用上の注意] 本文は症例検討支援用であり、最終判断は有資格専門家が行う必要があります。`,
    ].join('\n\n'),
    es: [
      `[Concepto] ${title} se interpreta en el contexto de ${sec}. ${safeBase}`,
      `[Lectura clínica] Evalúe nivel, dirección y estabilidad en todo el protocolo. Combine con indicadores vecinos para distinguir rasgo vs. estado.`,
      `[Regla de integración] No dependa de un único punto de corte. Priorice convergencia entre procesamiento, afecto, ideación e interpersonal.`,
      `[Precaución] Valores extremos pueden reflejar estilo de respuesta, longitud del protocolo o estrés situacional. Revise primero condiciones de validez.`,
      `[Nota de IA] Este texto apoya discusión estructurada de casos; no reemplaza decisión clínica profesional.`,
    ].join('\n\n'),
    pt: [
      `[Conceito] ${title} é interpretado no contexto de ${sec}. ${safeBase}`,
      `[Leitura clínica] Avalie nível, direção e estabilidade no protocolo completo. Combine com indicadores vizinhos para diferenciar traço vs. estado.`,
      `[Regra de integração] Não dependa de um único ponto de corte. Priorize convergência entre processamento, afeto, ideação e domínio interpessoal.`,
      `[Cuidado] Valores extremos podem refletir estilo de resposta, tamanho do protocolo ou estresse situacional. Verifique primeiro as condições de validade.`,
      `[Nota de IA] Este conteúdo apoia discussão estruturada de caso e não substitui decisão clínica profissional.`,
    ].join('\n\n'),
  };

  return map[lang];
}

function categoryText(title: string, lang: Language): string {
  const map: Record<Language, string> = {
    en: `[Overview] ${title} defines one major scoring domain in the Exner system.\n\n[What to Document] Record the exact response wording, coding rationale, and any ambiguity notes.\n\n[Interpretation Strategy] Read category patterns at protocol level (frequency, distribution, and co-occurrence) rather than judging isolated items.\n\n[Quality Control] Re-check hierarchy rules, mutual exclusions, and card-context fit before finalizing codes.\n\n[AI Usage Note] Use this section as a structured reference for case discussion and supervision.`,
    ko: `[개요] ${title}는 Exner 체계의 핵심 채점 영역입니다.\n\n[기록 원칙] 반응 원문, 코드 부여 근거, 애매한 지점을 반드시 함께 기록합니다.\n\n[해석 전략] 개별 항목이 아니라 빈도·분포·동시출현의 패턴으로 프로토콜 수준에서 해석합니다.\n\n[품질 점검] 위계 규칙, 상호배제 규칙, 카드 맥락 적합성을 최종 확인합니다.\n\n[AI 활용 주의] 본 항목은 교육/슈퍼비전용 참고자료입니다.`,
    ja: `[概要] ${title} は Exner 体系の主要採点領域です。\n\n[記録原則] 反応原文、採点根拠、曖昧点を必ず併記します。\n\n[解釈戦略] 単一項目ではなく、頻度・分布・共起パターンをプロトコル全体で読みます。\n\n[品質確認] 階層規則、排他規則、カード文脈適合を最終確認します。\n\n[AI利用上の注意] 本項目は教育・スーパービジョン用の参照資料です。`,
    es: `[Resumen] ${title} define un dominio principal de puntuación en el sistema Exner.\n\n[Qué documentar] Registre frase exacta, justificación de código y notas de ambigüedad.\n\n[Estrategia de interpretación] Lea patrones por protocolo completo (frecuencia, distribución y co-ocurrencia), no ítems aislados.\n\n[Control de calidad] Revise reglas jerárquicas, exclusiones y ajuste al contexto de lámina.\n\n[Nota de IA] Úselo como referencia estructurada para discusión y supervisión clínica.`,
    pt: `[Visão geral] ${title} define um domínio principal de pontuação no sistema Exner.\n\n[O que documentar] Registre frase exata, justificativa do código e notas de ambiguidade.\n\n[Estratégia de interpretação] Leia padrões no protocolo completo (frequência, distribuição e coocorrência), não itens isolados.\n\n[Controle de qualidade] Revise regras hierárquicas, exclusões e adequação ao contexto do cartão.\n\n[Nota de IA] Use como referência estruturada para discussão e supervisão clínica.`,
  };
  return map[lang];
}

export function buildDetailedDocDescription(item: ItemLike, lang: Language, title: string, baseDescription: string): string {
  if (item.kind === 'category') return categoryText(title, lang);

  const scoringCategory = firstScoringCategory(item.slug);
  if (scoringCategory) return scoringEntryText(title, scoringCategory, lang);

  return resultEntryText(title, baseDescription, sectionForResult(item.slug), lang);
}

