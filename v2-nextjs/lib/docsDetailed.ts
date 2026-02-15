import type { Language } from '@/types';

type ItemLike = {
  kind: 'category' | 'entry';
  id: string;
  slug: string[];
};

const CATEGORY_LABELS: Record<string, Record<Language, string>> = {
  card: { en: 'Card', ko: 'Card', ja: 'Card', es: 'Lamina', pt: 'Cartao' },
  location: { en: 'Location', ko: 'Location', ja: 'Location', es: 'Localizacion', pt: 'Localizacao' },
  dq: { en: 'Developmental Quality', ko: 'Developmental Quality', ja: 'Developmental Quality', es: 'Calidad Evolutiva', pt: 'Qualidade do Desenvolvimento' },
  determinants: { en: 'Determinants', ko: 'Determinants', ja: 'Determinants', es: 'Determinantes', pt: 'Determinantes' },
  fq: { en: 'Form Quality', ko: 'Form Quality', ja: 'Form Quality', es: 'Calidad Formal', pt: 'Qualidade Formal' },
  pair: { en: 'Pair', ko: 'Pair', ja: 'Pair', es: 'Par', pt: 'Par' },
  contents: { en: 'Contents', ko: 'Contents', ja: 'Contents', es: 'Contenidos', pt: 'Conteudos' },
  popular: { en: 'Popular', ko: 'Popular', ja: 'Popular', es: 'Popular', pt: 'Popular' },
  z: { en: 'Z', ko: 'Z', ja: 'Z', es: 'Z', pt: 'Z' },
  score: { en: 'Score', ko: 'Score', ja: 'Score', es: 'Puntuacion', pt: 'Pontuacao' },
  gphr: { en: 'G/PHR', ko: 'G/PHR', ja: 'G/PHR', es: 'G/PHR', pt: 'G/PHR' },
  'special-score': { en: 'Special Score', ko: 'Special Score', ja: 'Special Score', es: 'Puntuacion Especial', pt: 'Pontuacao Especial' },
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

const DETERMINANT_DETAILS_EN: Record<string, string> = {
  M: [
    'Definition: Human movement determinant; perceived movement of a human or human-like figure.',
    'Assign when: The response includes intentional human action (thinking, reaching, dancing, looking).',
    'Do not assign when: Motion is only animal-like (use FM) or inanimate force (use m).',
    'Boundary: M vs FM/m is based on movement class, not response quality.',
    'Caution: Anchor coding to explicit movement language from response/inquiry.',
  ].join('\n'),
  FM: [
    'Definition: Animal movement determinant; movement typical of an animal species.',
    'Assign when: The action is animal-consistent (flying, crawling, biting, running as animal).',
    'Do not assign when: Movement is human-intentional (M) or mechanical/natural force (m).',
    'Boundary: FM codes movement class, not emotional valence.',
    'Caution: If both active and passive tones are explicit, consider FMa/FM p variants in interpretation context.',
  ].join('\n'),
  m: [
    'Definition: Inanimate movement determinant; movement of objects, forces, or non-living phenomena.',
    'Assign when: Motion is attributed to pressure, pull, falling, exploding, drifting, etc.',
    'Do not assign when: Clear human agency (M) or animal movement (FM) is primary.',
    'Boundary: m captures perceived external force/pressure quality.',
    'Caution: Confirm that movement is actually perceived, not merely implied.',
  ].join('\n'),
  FC: [
    'Definition: Form-Color; form is primary and chromatic color is secondary.',
    'Assign when: Object shape is clearly organized, with color adding detail or refinement.',
    'Do not assign when: Color drives the response and form is secondary (CF/C).',
    'Boundary: FC generally reflects stronger modulation than CF/C.',
    'Caution: Judge priority from inquiry language, not code preference.',
  ].join('\n'),
  CF: [
    'Definition: Color-Form; chromatic color is primary and form is secondary.',
    'Assign when: The response is color-driven and form support is present but not dominant.',
    'Do not assign when: Form leads and color supports (FC), or no form is used (C).',
    'Boundary: CF sits between FC and C in form control.',
    'Caution: Distinguish true color primacy from merely mentioning color words.',
  ].join('\n'),
  C: [
    'Definition: Pure chromatic color determinant with no form basis.',
    'Assign when: Response is driven by color naming/experience without usable form.',
    'Do not assign when: Any meaningful form structure is used (FC/CF).',
    "App constraint: Pure formless determinants force FQ to 'none' automatically.",
    'Caution: Do not over-assign C from simple color adjectives.',
  ].join('\n'),
  Cn: [
    'Definition: Color naming response; naming color rather than perceiving an object.',
    'Assign when: Subject reports color labels without object perception.',
    'Do not assign when: A coherent object is identified from form and/or color.',
    "App constraint: Treated as formless determinant; FQ is auto-set to 'none'.",
    'Caution: Verify inquiry to separate naming from symbolic color use.',
  ].join('\n'),
  "FC'": [
    "Definition: Form-Achromatic Color; form is primary with achromatic shading/color (C') secondary.",
    "Assign when: Shape leads and black/gray shading refines the percept.",
    "Do not assign when: Achromatic shading is primary (C'F/C').",
    "Boundary: FC' vs C'F depends on determinant priority.",
    'Caution: Keep achromatic responses separate from chromatic FC/CF/C.',
  ].join('\n'),
  "C'F": [
    "Definition: Achromatic Color-Form; achromatic shading/color (C') is primary with form secondary.",
    "Assign when: Black/gray tonal quality drives the response, with partial form support.",
    "Do not assign when: Form is primary (FC') or absent (C').",
    "Boundary: C'F reflects weaker form control than FC'.",
    'Caution: Use inquiry to determine what came first perceptually.',
  ].join('\n'),
  "C'": [
    "Definition: Pure achromatic color determinant (black/gray) without form support.",
    "Assign when: Tonal achromatic impression is reported with no usable form.",
    "Do not assign when: Any meaningful form organization is present (FC'/C'F).",
    "App constraint: Only determinants listed in this app's formless set auto-force FQ none.",
    'Caution: Confirm this is achromatic perception, not depth (V) or diffuse shading (Y).',
  ].join('\n'),
  FT: [
    'Definition: Form-Texture; form is primary and texture/shading is secondary.',
    'Assign when: Object is clearly formed and texture (furry, rough, silky) is an added qualifier.',
    'Do not assign when: Texture is clearly primary (TF/T).',
    'Boundary: FT vs TF is decided by priority, not by presence of texture words alone.',
    'Caution: Inquiry is required because texture adjectives can appear without true texture determinant.',
  ].join('\n'),
  TF: [
    'Definition: Texture-Form; texture/shading is primary and form is secondary.',
    'Assign when: Texture quality drives the percept, then form is added for clarification.',
    'Do not assign when: Form clearly leads (FT) or no form is used (T).',
    'Boundary: TF typically has less specific object structure than FT.',
    'Caution: Do not infer TF automatically from card VI skin-like content.',
  ].join('\n'),
  T: [
    'Definition: Pure texture determinant; shading is used as texture without form support.',
    'Assign when: Texture is perceived directly and shape is not used to define object form.',
    'Do not assign when: Form contributes meaningfully (FT/TF).',
    "App constraint: Pure formless determinants force FQ to 'none' automatically.",
    'Caution: Rare code; confirm by inquiry before assigning.',
  ].join('\n'),
  FV: [
    'Definition: Form-Vista; form is primary with depth/dimensional shading secondary.',
    'Assign when: A formed object is seen, with depth/perspective added by shading.',
    'Do not assign when: Depth shading is primary (VF/V).',
    'Boundary: FV vs VF depends on what organizes perception first.',
    'Caution: Do not code FV from depth-related words alone without shading basis.',
  ].join('\n'),
  VF: [
    'Definition: Vista-Form; depth/dimensional shading is primary and form is secondary.',
    'Assign when: Perception is organized first by depth, then by partial object structure.',
    'Do not assign when: Form leads (FV) or no form is used (V).',
    'Boundary: VF content is often less structurally specific than FV.',
    'Caution: Confirm true depth construction rather than emotional tone only.',
  ].join('\n'),
  V: [
    'Definition: Pure vista determinant; depth/dimension from shading with no form support.',
    'Assign when: Depth or perspective is reported without meaningful form organization.',
    'Do not assign when: Form contributes to identification (FV/VF).',
    "App constraint: Pure formless determinants force FQ to 'none' automatically.",
    'Caution: Rare; require explicit depth basis in inquiry.',
  ].join('\n'),
  FY: [
    'Definition: Form-Diffuse Shading; form primary and diffuse shading secondary.',
    'Assign when: Clear form is present and diffuse shading adds affective pressure quality.',
    'Do not assign when: Diffuse shading is primary (YF/Y).',
    'Boundary: FY vs YF is determinant priority, not symptom severity.',
    'Caution: Keep separate from achromatic color codes unless achromatic quality is explicit.',
  ].join('\n'),
  YF: [
    'Definition: Diffuse Shading-Form; diffuse shading is primary and form secondary.',
    'Assign when: Diffuse shading/atmospheric pressure drives percept with limited form support.',
    'Do not assign when: Form clearly leads (FY) or no form is used (Y).',
    'Boundary: YF indicates weaker form organization than FY.',
    'Caution: Determine primacy by inquiry sequence and emphasis.',
  ].join('\n'),
  Y: [
    'Definition: Pure diffuse shading determinant with no form support.',
    'Assign when: Diffuse shading quality is reported without meaningful form structure.',
    'Do not assign when: Form is used to define object (FY/YF).',
    "App constraint: Pure formless determinants force FQ to 'none' automatically.",
    'Caution: Distinguish from achromatic color and texture codes.',
  ].join('\n'),
  Fr: [
    'Definition: Form-Reflection; form is primary and reflection is secondary.',
    'Assign when: A clear object is identified and interpreted as reflected/symmetrically mirrored.',
    'Do not assign when: Reflection quality is primary with vague form (rF).',
    "App constraint: If Fr/rF is selected, pair '(2)' is auto-cleared (mutual exclusion).",
    'Caution: Reflection requires explicit reflection concept, not merely two objects.',
  ].join('\n'),
  rF: [
    'Definition: Reflection-Form; reflection/symmetry is primary and form is vague/secondary.',
    'Assign when: Reflection language drives response (mirror image, reflected scene) with nonspecific form.',
    'Do not assign when: Form-specific object identification is primary (Fr).',
    "App constraint: If Fr/rF is selected, pair '(2)' is auto-cleared (mutual exclusion).",
    'Caution: Do not confuse with generic pair response.',
  ].join('\n'),
  FD: [
    'Definition: Form dimension determinant; depth/distance is perceived via form perspective, not shading.',
    'Assign when: Near-far/3D impression is built from form structure or size perspective.',
    'Do not assign when: Depth is specifically shading-based (V family).',
    'Boundary: FD (form perspective) vs V/FV/VF (shading perspective).',
    'Caution: Confirm dimensional basis in inquiry.',
  ].join('\n'),
  F: [
    'Definition: Pure form determinant; response is organized by form only.',
    'Assign when: Shape/outline structure is the sole basis of the percept.',
    'Do not assign when: Movement, color, shading, texture, or reflection contributes meaningfully.',
    'Boundary: F is the baseline determinant for form-dominant responses.',
    'Caution: Mixed responses should use combination determinants, not default F.',
  ].join('\n'),
};

const FQ_DETAILS_EN: Record<string, string> = {
  '+': [
    'Definition: Superior form quality; unusually precise and well-articulated fit to blot form.',
    'Assign when: Form match is highly exact and structurally advanced relative to ordinary responses.',
    "Do not assign when: Fit is only conventional (o) or unusual-but-acceptable (u).",
    'Boundary: + requires stronger precision than o, not merely a complex response.',
    "App rule: If DQ is 'v', FQ '+' is blocked in this app.",
  ].join('\n'),
  o: [
    'Definition: Ordinary form quality; conventional, acceptable match to blot form.',
    'Assign when: Response is common/standard and adequately fits form features.',
    'Do not assign when: Fit is unusually precise (+), unusual but acceptable (u), or distorted (-).',
    'Boundary: o is the baseline acceptable FQ level.',
    'Caution: Keep coding based on form fit, not content familiarity alone.',
  ].join('\n'),
  u: [
    'Definition: Unusual form quality; acceptable fit with less common object interpretation.',
    'Assign when: Form fit is adequate but response is infrequent in normative usage.',
    'Do not assign when: Fit is poor/distorted (-) or clearly ordinary (o).',
    'Boundary: u is acceptable perception, not automatic pathology.',
    'Caution: Confirm that rarity does not come from coding error or weak inquiry.',
  ].join('\n'),
  '-': [
    'Definition: Minus form quality; distorted or poorly fitting use of blot form.',
    'Assign when: Perceived object has weak/inaccurate form correspondence.',
    'Do not assign when: Form fit remains acceptable, even if unusual (u).',
    'Boundary: - reflects mediation weakness and should be used only with clear mismatch evidence.',
    'Caution: Avoid overuse from examiner expectation; rely on explicit fit criteria.',
  ].join('\n'),
  none: [
    "Definition: No form quality coding because form is not used as determinant basis.",
    'Assign when: Response is based on pure formless determinants in this app context.',
    'Do not assign when: Any meaningful form component is present.',
    "App rule: Auto-set when all active determinants are in app's formless list.",
    'Caution: Re-check determinant selection before finalizing none.',
  ].join('\n'),
};

const FQ_DETAILS_KO: Record<string, string> = {
  '+': [
    'Definition: 우수한 형태질(FQ+)입니다.',
    'Assign when: 반점 형태와의 대응이 매우 정밀하고 구조적으로 정교할 때 부여합니다.',
    'Do not assign when: 보통 적합(o) 또는 비전형-허용(u) 수준에 머무를 때.',
    "App rule: DQ가 'v'이면 FQ '+'는 앱에서 허용되지 않습니다.",
    'Caution: 내용의 그럴듯함이 아니라 형태 적합 근거로 판단합니다.',
  ].join('\n'),
  o: [
    'Definition: 보통 형태질(FQo)입니다.',
    'Assign when: 형태 적합이 관습적이고 수용 가능한 수준일 때 부여합니다.',
    'Do not assign when: 우수 적합(+), 비전형 허용(u), 불량(-)이 더 타당할 때.',
    'Boundary: o는 기본적인 수용 가능 형태질 수준입니다.',
    'Caution: 친숙한 내용이라는 이유만으로 o를 부여하지 않습니다.',
  ].join('\n'),
  u: [
    'Definition: 비전형이지만 수용 가능한 형태질(FQu)입니다.',
    'Assign when: 반응은 드물지만 형태 적합은 유지될 때 부여합니다.',
    'Do not assign when: 명백한 불일치(-) 또는 보통 적합(o)이 타당할 때.',
    'Boundary: u는 자동 병리 지표가 아니라 허용 가능한 지각 범주입니다.',
    'Caution: 희귀성이 코딩 오류나 탐문 부족에서 온 것은 아닌지 확인합니다.',
  ].join('\n'),
  '-': [
    'Definition: 불량 형태질(FQ-)입니다.',
    'Assign when: 지각 대상이 반점 형태와 충분히 맞지 않거나 왜곡될 때 부여합니다.',
    'Do not assign when: 비전형이어도 형태 적합이 수용 가능한 경우(u).',
    'Boundary: -는 중재 약화를 뜻하므로 명확한 불일치 근거가 필요합니다.',
    'Caution: 평가자 기대에 의한 과잉 부여를 피합니다.',
  ].join('\n'),
  none: [
    "Definition: 형태 근거가 없어 FQ를 부여하지 않는 상태('none')입니다.",
    'Assign when: 순수 비형태 결정인만으로 반응이 성립할 때 부여합니다.',
    'Do not assign when: 유의미한 형태 성분이 포함될 때.',
    "App rule: 앱의 순수 비형태 조합이면 FQ는 자동으로 'none' 처리됩니다.",
    'Caution: 최종 확정 전 결정인 선택을 재검토합니다.',
  ].join('\n'),
};

const DQ_DETAILS_EN: Record<string, string> = {
  '+': [
    'Definition: DQ+ indicates synthesized, well-integrated structural organization.',
    'Assign when: Multiple elements are combined into a coherent and elaborated whole.',
    'Do not assign when: Integration attempt is vague/unstable (v/+) or not synthesized (o).',
    'Boundary: DQ+ requires clear integration quality, not just response length.',
    'Caution: Verify synthesis is perceptual-structural, not narrative embellishment only.',
  ].join('\n'),
  o: [
    'Definition: DQo indicates ordinary, adequate structural organization.',
    'Assign when: Response has acceptable organization without strong synthesis.',
    'Do not assign when: Structure is clearly synthesized (+) or vague (v, v/+).',
    'Boundary: DQo is typical organization level in many protocols.',
    'Caution: Keep DQ coding independent from clinical valence of content.',
  ].join('\n'),
  'v/+': [
    'Definition: DQv/+ indicates mixed quality; attempted synthesis with notable vagueness.',
    'Assign when: Integrative effort is present but structural clarity remains limited.',
    'Do not assign when: Synthesis is clearly robust (+) or absent (v).',
    'Boundary: v/+ bridges between v and + and requires evidence of both features.',
    'Caution: Use inquiry to determine whether integration attempt is genuine.',
  ].join('\n'),
  v: [
    'Definition: DQv indicates vague structural organization.',
    'Assign when: Response form is imprecise and insufficiently organized.',
    "Do not assign when: Ordinary structure (o) or meaningful synthesis (+/v+) is present.",
    "App rules: If DQ is 'v', FQ '+' is cleared and Z coding is blocked.",
    'Caution: DQv should come from structural evidence, not response brevity alone.',
  ].join('\n'),
};

const DQ_DETAILS_KO: Record<string, string> = {
  '+': [
    'Definition: 통합적이고 합성도가 높은 발달질(DQ+)입니다.',
    'Assign when: 여러 요소가 일관된 전체로 구조화될 때 부여합니다.',
    'Do not assign when: 통합 시도가 모호(v/+)하거나 통합성이 부족(o)할 때.',
    'Boundary: DQ+는 반응 길이가 아니라 구조적 통합의 질로 판단합니다.',
    'Caution: 서술 장식이 아니라 지각 구조 통합 근거를 확인합니다.',
  ].join('\n'),
  o: [
    'Definition: 보통 발달질(DQo)입니다.',
    'Assign when: 수용 가능한 조직화는 있으나 강한 합성 통합은 아닐 때 부여합니다.',
    'Do not assign when: 명확한 합성 통합(+) 또는 모호한 조직(v, v/+)일 때.',
    'Boundary: DQo는 전형적인 조직화 수준입니다.',
    'Caution: 내용의 임상적 톤과 DQ 코딩을 혼동하지 않습니다.',
  ].join('\n'),
  'v/+': [
    'Definition: 모호성과 통합 시도가 혼재된 발달질(DQv/+)입니다.',
    'Assign when: 통합하려는 흔적은 있으나 구조 명료성이 제한될 때 부여합니다.',
    'Do not assign when: 통합이 분명히 강한(+) 경우 또는 통합 시도 자체가 약한(v) 경우.',
    'Boundary: v/+는 두 성분(모호성+통합시도) 근거가 모두 필요합니다.',
    'Caution: 탐문에서 실제 통합 시도가 있었는지 확인합니다.',
  ].join('\n'),
  v: [
    'Definition: 모호하고 미조직적인 발달질(DQv)입니다.',
    'Assign when: 반응 구조가 불명확하고 조직화 수준이 낮을 때 부여합니다.',
    'Do not assign when: 보통 조직(o)이나 유의미한 통합(+/v+)이 존재할 때.',
    "App rules: DQ가 'v'이면 FQ '+'는 해제되고 Z 코딩이 차단됩니다.",
    'Caution: 반응이 짧다는 이유만으로 DQv를 부여하지 않습니다.',
  ].join('\n'),
};

const LOCATION_DETAILS_EN: Record<string, string> = {
  W: [
    'Definition: Whole location; response uses the entire blot as perceptual field.',
    'Assign when: Subject clearly organizes the percept from full-blot configuration.',
    'Do not assign when: Response is anchored to only a specific common/unusual detail area.',
    'Boundary: W emphasizes broad scanning/integration breadth.',
    'Caution: Confirm full-area use in inquiry rather than inferred global style.',
  ].join('\n'),
  WS: [
    'Definition: Whole + White space location; whole blot is primary with S-space integration.',
    'Assign when: Full blot is used and white space is explicitly part of the percept.',
    'Do not assign when: White space is absent or only a minor unconfirmed mention.',
    'Boundary: WS differs from W by explicit S-space participation.',
    'Caution: Verify that white space is structurally used, not decorative commentary.',
  ].join('\n'),
  D: [
    'Definition: Common detail location; frequently selected conventional detail area.',
    'Assign when: Response is based on a standard/common blot subsection.',
    'Do not assign when: Area is unusual/rare (Dd) or whole-blot based (W).',
    'Boundary: D is common-detail focus, not unusual selectivity.',
    'Caution: Use location inquiry to avoid misclassifying D vs Dd.',
  ].join('\n'),
  DS: [
    'Definition: Common detail + White space location; D area with explicit S-space integration.',
    'Assign when: Common detail is primary and white space is part of construction.',
    'Do not assign when: White space role is absent or incidental only.',
    'Boundary: DS differs from D by required S contribution.',
    'Caution: Confirm both D anchoring and S involvement in inquiry.',
  ].join('\n'),
  Dd: [
    'Definition: Unusual detail location; less frequent/smaller/idiosyncratic detail area.',
    'Assign when: Response is anchored in a rare or atypical blot subsection.',
    'Do not assign when: Area is normatively common (D) or whole-blot (W).',
    'Boundary: Dd captures selective/idiosyncratic attentional focus.',
    'Caution: High Dd frequency should be interpreted with overall protocol context.',
  ].join('\n'),
  DdS: [
    'Definition: Unusual detail + White space location; Dd area integrated with S-space.',
    'Assign when: Rare detail is primary and white space is explicitly used.',
    'Do not assign when: Either Dd anchoring or S use is not evidentially clear.',
    'Boundary: DdS combines unusual selectivity with S-space processing.',
    'Caution: Require clear inquiry evidence for both elements.',
  ].join('\n'),
  S: [
    'Definition: Pure White space location; percept is based primarily on white (uninked) area.',
    'Assign when: Subject explicitly uses blank space as central perceptual basis.',
    'Do not assign when: White space is only secondary to inked form (use WS/DS/DdS as appropriate).',
    'Boundary: S is location coding and should not be overinterpreted alone.',
    'Caution: Interpret with form quality and related mediation indicators.',
  ].join('\n'),
};

const SPECIAL_SCORE_DETAILS_EN: Record<string, string> = {
  DV1: [
    'Definition: Deviant verbalization level 1; mild odd word usage or phrasing disturbance.',
    'Assign when: Verbal expression is unusual yet still partially understandable.',
    'Do not assign when: Disturbance reaches severe/bizarre level (DV2).',
    'Boundary: DV1 is lower-severity cognitive-linguistic slippage.',
    'Caution: Distinguish stylistic language from true coding-level deviance.',
  ].join('\n'),
  DV2: [
    'Definition: Deviant verbalization level 2; severe/bizarre verbal deviance.',
    'Assign when: Word usage/phrasing significantly disrupts comprehensibility.',
    'Do not assign when: Oddity remains mild (DV1).',
    'Boundary: DV2 carries higher severity weighting in WSum6.',
    'App rule: DV1 and DV2 cannot co-occur in same response.',
  ].join('\n'),
  INCOM1: [
    'Definition: Incongruous combination level 1; mild illogical joining of perceptual elements.',
    'Assign when: Elements are combined in strained but still partly coherent way.',
    'Do not assign when: Combination is grossly impossible/bizarre (INCOM2).',
    'Boundary: INCOM1 marks moderate conceptual mismatch.',
    'Caution: Check literal response wording before coding incongruity.',
  ].join('\n'),
  INCOM2: [
    'Definition: Incongruous combination level 2; severe impossible combination of elements.',
    'Assign when: Combined features are markedly incompatible in a bizarre way.',
    'Do not assign when: Incompatibility is mild/moderate (INCOM1).',
    'Boundary: INCOM2 is high-severity cognitive slippage marker.',
    'App rule: INCOM1 and INCOM2 are mutually exclusive per response.',
  ].join('\n'),
  DR1: [
    'Definition: Deviant response level 1; mild circumstantial or loose response process deviation.',
    'Assign when: Response process shows noticeable but limited derailment.',
    'Do not assign when: Disruption is severe enough for DR2.',
    'Boundary: DR1 indicates moderate thought-process inefficiency.',
    'Caution: Differentiate from narrative style without formal derailment.',
  ].join('\n'),
  DR2: [
    'Definition: Deviant response level 2; pronounced derailment/disorganization in response process.',
    'Assign when: Sequence/logic of response is severely disordered.',
    'Do not assign when: Only mild derailment indicators are present (DR1).',
    'Boundary: DR2 has stronger pathological weight than DR1.',
    'App rule: DR1 and DR2 cannot both be selected in one row.',
  ].join('\n'),
  FABCOM1: [
    'Definition: Fabulized combination level 1; mildly implausible fusion with partial coherence.',
    'Assign when: Combined percept has improbable relations but retains some structure.',
    'Do not assign when: Combination is clearly bizarre/impossible (FABCOM2).',
    'Boundary: FABCOM1 is lower-severity fabulation-like combination.',
    'Caution: Verify perceptual statement rather than interpretive paraphrase.',
  ].join('\n'),
  FABCOM2: [
    'Definition: Fabulized combination level 2; severe bizarre/impossible combination.',
    'Assign when: Perceptual combination is clearly fantastical and disorganized.',
    'Do not assign when: Implausibility is mild/moderate (FABCOM1).',
    'Boundary: FABCOM2 contributes heavily to severe ideational disturbance load.',
    'App rule: FABCOM1 and FABCOM2 are mutually exclusive per response.',
  ].join('\n'),
  CONTAM: [
    'Definition: Contamination; incompatible perceptual classes fused into a single impossible percept.',
    'Assign when: Response shows merged realities that should remain separate categories.',
    'Do not assign when: Simple metaphor or dramatic style lacks true perceptual fusion.',
    'Boundary: CONTAM is high-severity thought/percept integration failure marker.',
    'Caution: Require explicit fusion evidence in response wording.',
  ].join('\n'),
  ALOG: [
    'Definition: Inappropriate logic; idiosyncratic or faulty reasoning in response explanation.',
    'Assign when: Stated logic linking perceptual elements is clearly illogical.',
    'Do not assign when: Reasoning is unusual but still coherent and justifiable.',
    'Boundary: ALOG concerns reasoning structure, not just unusual content.',
    'Caution: Code from articulated logic statements, often during inquiry.',
  ].join('\n'),
  PSV: [
    'Definition: Perseveration; repetition/sticking to same response style or content pattern.',
    'Assign when: Response shows cognitive rigidity via repetitive carryover pattern.',
    'Do not assign when: Similarity reflects normal thematic continuity only.',
    'Boundary: PSV reflects process rigidity rather than single unusual idea.',
    'Caution: Interpret with protocol-wide pattern, not one isolated repetition.',
  ].join('\n'),
  AB: [
    'Definition: Abstract content special score; abstract/idea-level content emphasis.',
    'Assign when: Response content is coded at abstract conceptual level per scoring rules.',
    'Do not assign when: Content remains concrete and object-bound.',
    'Boundary: AB contributes to ideation profile alongside Art/Ay composites.',
    'Caution: Ensure abstractness is in response content, not examiner interpretation.',
  ].join('\n'),
  AG: [
    'Definition: Aggressive movement/content indicator in special score context.',
    'Assign when: Response clearly includes active aggression, attack, or destructive intent.',
    'Do not assign when: Conflict is implied but no explicit aggressive action is described.',
    'Boundary: AG is distinct from hostile tone without action representation.',
    'Caution: Separate AG coding from moral evaluation of content.',
  ].join('\n'),
  COP: [
    'Definition: Cooperative movement/content indicator.',
    'Assign when: Two or more figures are clearly engaged in positive cooperative interaction.',
    'Do not assign when: Co-presence is described without cooperative action.',
    'Boundary: COP requires explicit interaction quality, not just multiple figures.',
    'Caution: Code cooperation from behavior description, not inferred relationship.',
  ].join('\n'),
  MOR: [
    'Definition: Morbid content score; damaged, dead, ruined, or dysphoric object representation.',
    'Assign when: Content explicitly reflects injury, decay, defect, death, or contamination themes.',
    'Do not assign when: Negative affect words appear without morbid object depiction.',
    'Boundary: MOR is content-quality marker, not direct symptom diagnosis.',
    'Caution: Interpret MOR with broader affect/self-perception constellation.',
  ].join('\n'),
  PER: [
    'Definition: Personalization; defensive or idiosyncratic personal referencing style in response.',
    'Assign when: Subject introduces personalizing stance beyond task demands.',
    'Do not assign when: Normal first-person wording is task-appropriate and non-defensive.',
    'Boundary: PER indicates stylistic interpersonal framing, not severity by itself.',
    'Caution: Evaluate with interpersonal cluster variables before inference.',
  ].join('\n'),
  CP: [
    'Definition: Color projection marker.',
    'Assign when: Color is attributed/projected in a way indicating externalized affective loading.',
    'Do not assign when: Standard chromatic coding sufficiently explains the response.',
    'Boundary: CP is a specific special score, not a replacement for FC/CF/C coding.',
    'Caution: Use with affect modulation pattern, not in isolation.',
  ].join('\n'),
};

const SPECIAL_SCORE_DETAILS_ES: Record<string, string> = {
  DV1: ['Definition: Verbalizacion desviada nivel 1 (DV1).', 'Assign when: El uso verbal es extrano pero aun parcialmente comprensible.', 'Do not assign when: La desviacion es severa/bizarra (DV2).', 'Boundary: DV1 representa desliz cognitivo-linguistico de menor severidad.', 'Caution: Diferencie estilo expresivo de desviacion codificable.'].join('\n'),
  DV2: ['Definition: Verbalizacion desviada nivel 2 (DV2).', 'Assign when: La eleccion de palabras/fraseo altera claramente la comprension.', 'Do not assign when: La rareza permanece leve (DV1).', 'Boundary: DV2 tiene mayor peso de severidad en WSum6.', 'App rule: DV1 y DV2 son excluyentes en una misma respuesta.'].join('\n'),
  INCOM1: ['Definition: Combinacion incongruente nivel 1 (INCOM1).', 'Assign when: Elementos combinados de forma tensa pero parcialmente coherente.', 'Do not assign when: La combinacion es groseramente imposible/bizarra (INCOM2).', 'Boundary: INCOM1 marca incongruencia conceptual moderada.', 'Caution: Base la decision en frase literal de respuesta.'].join('\n'),
  INCOM2: ['Definition: Combinacion incongruente nivel 2 (INCOM2).', 'Assign when: La combinacion de rasgos es marcadamente incompatible y bizarra.', 'Do not assign when: La incompatibilidad es leve/moderada (INCOM1).', 'Boundary: INCOM2 es marcador de alta severidad de desliz cognitivo.', 'App rule: INCOM1 e INCOM2 son excluyentes por respuesta.'].join('\n'),
  DR1: ['Definition: Respuesta desviada nivel 1 (DR1).', 'Assign when: Hay desviacion de proceso con desorganizacion limitada.', 'Do not assign when: La desorganizacion alcanza nivel severo (DR2).', 'Boundary: DR1 sugiere ineficiencia moderada de curso del pensamiento.', 'Caution: Diferencie estilo narrativo de verdadero descarrilamiento.'].join('\n'),
  DR2: ['Definition: Respuesta desviada nivel 2 (DR2).', 'Assign when: La secuencia/logica de respuesta esta severamente desorganizada.', 'Do not assign when: Solo hay senales leves de desvio (DR1).', 'Boundary: DR2 tiene mayor peso patologico que DR1.', 'App rule: DR1 y DR2 no coexisten en la misma fila.'].join('\n'),
  FABCOM1: ['Definition: Combinacion fabulizada nivel 1 (FABCOM1).', 'Assign when: Fusion improbable con cierta coherencia residual.', 'Do not assign when: La combinacion es claramente bizarra/imposible (FABCOM2).', 'Boundary: FABCOM1 indica fabulaci처n de menor severidad.', 'Caution: Codifique desde declaracion perceptual, no parafrasis clinica.'].join('\n'),
  FABCOM2: ['Definition: Combinacion fabulizada nivel 2 (FABCOM2).', 'Assign when: Combinacion perceptual fantastica y desorganizada de forma clara.', 'Do not assign when: La inverosimilitud es leve/moderada (FABCOM1).', 'Boundary: FABCOM2 carga fuertemente en perturbacion ideacional severa.', 'App rule: FABCOM1 y FABCOM2 son excluyentes por respuesta.'].join('\n'),
  CONTAM: ['Definition: Contaminacion (CONTAM).', 'Assign when: Dos clases perceptuales incompatibles se fusionan en un unico percepto imposible.', 'Do not assign when: Solo hay metafora/estilo dramatico sin fusion perceptual real.', 'Boundary: CONTAM es marcador grave de falla de integracion pensamiento-percepcion.', 'Caution: Exija evidencia explicita de fusion en el texto.'].join('\n'),
  ALOG: ['Definition: Logica inapropiada (ALOG).', 'Assign when: El razonamiento declarado para unir elementos es claramente ilogico.', 'Do not assign when: El razonamiento es inusual pero defendible/coherente.', 'Boundary: ALOG evalua estructura de razonamiento, no solo contenido raro.', 'Caution: Suele codificarse con apoyo de indagacion.'].join('\n'),
  PSV: ['Definition: Perseveracion (PSV).', 'Assign when: Hay repeticion/pegajosidad de patron cognitivo en respuestas.', 'Do not assign when: La similitud refleja continuidad tematica normal.', 'Boundary: PSV refleja rigidez de proceso, no idea aislada rara.', 'Caution: Interprete con patron protocolar completo.'].join('\n'),
  AB: ['Definition: Contenido abstracto (AB).', 'Assign when: El contenido se expresa en nivel conceptual/abstracto segun regla.', 'Do not assign when: El contenido permanece concreto y objetual.', 'Boundary: AB aporta al perfil de ideacion junto con Art/Ay.', 'Caution: La abstraccion debe estar en la respuesta, no en inferencia del evaluador.'].join('\n'),
  AG: ['Definition: Indicador de agresion (AG).', 'Assign when: Se describe accion agresiva/ataque/intencion destructiva explicita.', 'Do not assign when: Hay conflicto implicito sin accion agresiva explicitada.', 'Boundary: AG requiere accion representada, no solo tono hostil.', 'Caution: Separe AG de juicios morales sobre contenido.'].join('\n'),
  COP: ['Definition: Indicador de cooperacion (COP).', 'Assign when: Dos o mas figuras participan en interaccion cooperativa positiva explicita.', 'Do not assign when: Solo hay copresencia sin accion cooperativa.', 'Boundary: COP exige cualidad interactiva, no mera pluralidad de figuras.', 'Caution: Codifique por conducta descrita, no por relacion inferida.'].join('\n'),
  MOR: ['Definition: Contenido morbido (MOR).', 'Assign when: El objeto aparece danado, muerto, deteriorado, defectuoso o contaminado.', 'Do not assign when: Hay palabras negativas sin representacion morbida del objeto.', 'Boundary: MOR es marcador de cualidad de contenido, no diagnostico directo.', 'Caution: Integrar con perfil afectivo y de autopercepcion.'].join('\n'),
  PER: ['Definition: Personalizacion (PER).', 'Assign when: Se introduce postura autorreferencial/personalizante mas alla de demanda de tarea.', 'Do not assign when: El uso de primera persona es normal y no defensivo.', 'Boundary: PER indica estilo interpersonal, no severidad por si mismo.', 'Caution: Interpretar con variables del cluster interpersonal.'].join('\n'),
  CP: ['Definition: Proyeccion de color (CP).', 'Assign when: El color se atribuye/proyecta con carga afectiva externalizada.', 'Do not assign when: La codificacion cromatica estandar explica suficientemente la respuesta.', 'Boundary: CP es puntaje especial especifico, no reemplazo de FC/CF/C.', 'Caution: Use con patron de modulacion afectiva global.'].join('\n'),
};

const SPECIAL_SCORE_DETAILS_PT: Record<string, string> = {
  DV1: ['Definition: Verbalizacao desviada nivel 1 (DV1).', 'Assign when: O uso verbal e estranho, mas ainda parcialmente compreensivel.', 'Do not assign when: A desviacao e severa/bizarra (DV2).', 'Boundary: DV1 representa deslize cognitivo-linguistico de menor severidade.', 'Caution: Diferencie estilo expressivo de desvio codificavel.'].join('\n'),
  DV2: ['Definition: Verbalizacao desviada nivel 2 (DV2).', 'Assign when: A escolha de palavras/frase compromete claramente a compreensao.', 'Do not assign when: A estranheza permanece leve (DV1).', 'Boundary: DV2 tem maior peso de severidade no WSum6.', 'App rule: DV1 e DV2 sao mutuamente exclusivos na mesma resposta.'].join('\n'),
  INCOM1: ['Definition: Combinacao incongruente nivel 1 (INCOM1).', 'Assign when: Elementos sao combinados de forma tensa, mas parcialmente coerente.', 'Do not assign when: A combinacao e grosseiramente impossivel/bizarra (INCOM2).', 'Boundary: INCOM1 marca incongruencia conceitual moderada.', 'Caution: Baseie a decisao na frase literal da resposta.'].join('\n'),
  INCOM2: ['Definition: Combinacao incongruente nivel 2 (INCOM2).', 'Assign when: A combinacao de tracos e marcadamente incompativel e bizarra.', 'Do not assign when: A incompatibilidade e leve/moderada (INCOM1).', 'Boundary: INCOM2 e marcador de alta severidade de deslize cognitivo.', 'App rule: INCOM1 e INCOM2 sao exclusivos por resposta.'].join('\n'),
  DR1: ['Definition: Resposta desviante nivel 1 (DR1).', 'Assign when: Ha desvio de processo com desorganizacao limitada.', 'Do not assign when: A desorganizacao alcanca nivel severo (DR2).', 'Boundary: DR1 sugere ineficiencia moderada do curso do pensamento.', 'Caution: Diferencie estilo narrativo de verdadeiro descarrilamento.'].join('\n'),
  DR2: ['Definition: Resposta desviante nivel 2 (DR2).', 'Assign when: A sequencia/logica da resposta esta severamente desorganizada.', 'Do not assign when: So ha sinais leves de desvio (DR1).', 'Boundary: DR2 possui peso patologico maior que DR1.', 'App rule: DR1 e DR2 nao coexistem na mesma linha.'].join('\n'),
  FABCOM1: ['Definition: Combinacao fabulizada nivel 1 (FABCOM1).', 'Assign when: Fusao improvavel com alguma coerencia residual.', 'Do not assign when: A combinacao e claramente bizarra/impossivel (FABCOM2).', 'Boundary: FABCOM1 indica fabula챌찾o de menor severidade.', 'Caution: Codifique a partir da declaracao perceptual, nao de parafrase clinica.'].join('\n'),
  FABCOM2: ['Definition: Combinacao fabulizada nivel 2 (FABCOM2).', 'Assign when: Combinacao perceptual claramente fantastica e desorganizada.', 'Do not assign when: A inverossimilhanca e leve/moderada (FABCOM1).', 'Boundary: FABCOM2 contribui fortemente para carga ideacional severa.', 'App rule: FABCOM1 e FABCOM2 sao exclusivos por resposta.'].join('\n'),
  CONTAM: ['Definition: Contaminacao (CONTAM).', 'Assign when: Classes perceptuais incompativeis se fundem em um unico percepto impossivel.', 'Do not assign when: Ha apenas metafora/estilo dramatico sem fusao perceptual real.', 'Boundary: CONTAM e marcador grave de falha de integracao pensamento-percepcao.', 'Caution: Exija evidencia explicita de fusao no texto.'].join('\n'),
  ALOG: ['Definition: Logica inapropriada (ALOG).', 'Assign when: O raciocinio declarado para ligar elementos e claramente ilogico.', 'Do not assign when: O raciocinio e incomum, mas coerente/defensavel.', 'Boundary: ALOG avalia estrutura de raciocinio, nao apenas conteudo estranho.', 'Caution: Frequentemente depende de dados do inquerito.'].join('\n'),
  PSV: ['Definition: Perseveracao (PSV).', 'Assign when: Ha repeticao/aderencia de padrao cognitivo nas respostas.', 'Do not assign when: A similaridade reflete continuidade tematica normal.', 'Boundary: PSV reflete rigidez de processo, nao ideia isolada rara.', 'Caution: Interpretar no padrao global do protocolo.'].join('\n'),
  AB: ['Definition: Conteudo abstrato (AB).', 'Assign when: O conteudo e expresso em nivel conceitual/abstrato segundo regra.', 'Do not assign when: O conteudo permanece concreto e objetual.', 'Boundary: AB compoe perfil de ideacao com Art/Ay.', 'Caution: A abstracao deve estar na resposta, nao na inferencia do avaliador.'].join('\n'),
  AG: ['Definition: Indicador de agressao (AG).', 'Assign when: Ha descricao explicita de ataque/agressao/intencao destrutiva.', 'Do not assign when: Existe conflito implicito sem acao agressiva explicitada.', 'Boundary: AG exige acao representada, nao apenas tom hostil.', 'Caution: Separe AG de juizo moral sobre conteudo.'].join('\n'),
  COP: ['Definition: Indicador de cooperacao (COP).', 'Assign when: Duas ou mais figuras participam de interacao cooperativa positiva explicita.', 'Do not assign when: Ha apenas copresenca sem acao cooperativa.', 'Boundary: COP exige qualidade de interacao, nao mera pluralidade de figuras.', 'Caution: Codifique pela conduta descrita, nao por relacao inferida.'].join('\n'),
  MOR: ['Definition: Conteudo morbido (MOR).', 'Assign when: O objeto aparece danificado, morto, arruinado, defeituoso ou contaminado.', 'Do not assign when: Ha termos negativos sem representacao morbida do objeto.', 'Boundary: MOR e marcador de qualidade de conteudo, nao diagnostico direto.', 'Caution: Integrar com perfil afetivo e de autopercepcao.'].join('\n'),
  PER: ['Definition: Personalizacao (PER).', 'Assign when: Surge postura autorreferencial/personalizante alem da demanda da tarefa.', 'Do not assign when: O uso de primeira pessoa e normal e nao defensivo.', 'Boundary: PER indica estilo interpessoal, nao severidade por si so.', 'Caution: Interpretar com variaveis do cluster interpessoal.'].join('\n'),
  CP: ['Definition: Projecao de cor (CP).', 'Assign when: A cor e atribuida/projetada com carga afetiva externalizada.', 'Do not assign when: A codificacao cromatica padrao explica suficientemente a resposta.', 'Boundary: CP e escore especial especifico, nao substitui FC/CF/C.', 'Caution: Use com padrao global de modulacao afetiva.'].join('\n'),
};

const SPECIAL_SCORE_DETAILS_JA: Record<string, string> = {
  DV1: ['Definition: 軽度の逸脱言語(DV1)です。', 'Assign when: 語の選択や言い回しに軽度の奇異さがあり、理解は部分的に維持される場合に付与します。', 'Do not assign when: 理解阻害が強く重度逸脱(DV2)が妥当な場合。', 'Boundary: DV1は軽中等度の認知言語逸脱です。', 'Caution: 表現癖と符号化可能な逸脱を区別します。'].join('\n'),
  DV2: ['Definition: 重度の逸脱言語(DV2)です。', 'Assign when: 語の選択・構文が理解可能性を明確に損なう場合に付与します。', 'Do not assign when: 奇異さが軽度でDV1に留まる場合。', 'Boundary: DV2はWSum6でより高い重みを持ちます。', 'App rule: 同一反応でDV1とDV2は排他的です。'].join('\n'),
  INCOM1: ['Definition: 軽度の不適合結合(INCOM1)です。', 'Assign when: 結合に不整合はあるが部分的整合が残る場合に付与します。', 'Do not assign when: 明白に不可能・奇異な結合(INCOM2)が妥当な場合。', 'Boundary: INCOM1は中等度の概念不整合を示します。', 'Caution: 逐語反応根拠で判定します。'].join('\n'),
  INCOM2: ['Definition: 重度の不適合結合(INCOM2)です。', 'Assign when: 属性結合が著しく不可能・奇異な場合に付与します。', 'Do not assign when: 不整合が軽中等度でINCOM1が妥当な場合。', 'Boundary: INCOM2は重度の思考逸脱指標です。', 'App rule: 同一反応でINCOM1とINCOM2は排他的です。'].join('\n'),
  DR1: ['Definition: 軽度の逸脱反応(DR1)です。', 'Assign when: 思考進行の逸脱があるが解体度は限定的な場合に付与します。', 'Do not assign when: 進行解体が重度でDR2が妥当な場合。', 'Boundary: DR1は中等度の思考進行効率低下を示します。', 'Caution: 単なる語り方の癖と区別します。'].join('\n'),
  DR2: ['Definition: 重度の逸脱反応(DR2)です。', 'Assign when: 反応系列や論理連結が著しく解体している場合に付与します。', 'Do not assign when: 軽度逸脱でDR1が妥当な場合。', 'Boundary: DR2はDR1より高い病理重みを持ちます。', 'App rule: 同一行でDR1とDR2は共存しません。'].join('\n'),
  FABCOM1: ['Definition: 軽度の奇異結合(FABCOM1)です。', 'Assign when: 非現実的融合があるが残存整合がみられる場合に付与します。', 'Do not assign when: 明確に奇異・不可能な融合(FABCOM2)が妥当な場合。', 'Boundary: FABCOM1は軽中等度の空想的結合です。', 'Caution: 知覚叙述に基づき判定し臨床言い換えで置換しません。'].join('\n'),
  FABCOM2: ['Definition: 重度の奇異結合(FABCOM2)です。', 'Assign when: 知覚融合が明確に幻想的かつ解体的な場合に付与します。', 'Do not assign when: 非現実性が軽中等度でFABCOM1が妥当な場合。', 'Boundary: FABCOM2は重度の観念障害負荷を示します。', 'App rule: 同一反応でFABCOM1とFABCOM2は排他的です。'].join('\n'),
  CONTAM: ['Definition: 汚染(Contamination)です。', 'Assign when: 両立不可能な知覚クラスが単一知覚として融合される場合に付与します。', 'Do not assign when: 比喩的表現のみで実際の知覚融合がない場合。', 'Boundary: CONTAMは思考-知覚統合の重度破綻指標です。', 'Caution: 融合の逐語証拠を必須とします。'].join('\n'),
  ALOG: ['Definition: 不適切論理(ALOG)です。', 'Assign when: 要素連結の推論が明確に非論理的な場合に付与します。', 'Do not assign when: 非典型でも整合的に弁護可能な場合。', 'Boundary: ALOGは内容奇異性ではなく推論構造を評価します。', 'Caution: 質問段階の説明文を重視します。'].join('\n'),
  PSV: ['Definition: 保続(PSV)です。', 'Assign when: 反応間で同一パターンへの固着・反復が認められる場合に付与します。', 'Do not assign when: 通常の主題連続性のみで説明可能な場合。', 'Boundary: PSVは単発奇異ではなく処理硬直の指標です。', 'Caution: 全プロトコルでの反復様式で判断します。'].join('\n'),
  AB: ['Definition: 抽象内容(AB)です。', 'Assign when: 内容が具体物より抽象概念水準で提示される場合に付与します。', 'Do not assign when: 内容が具体対象レベルに留まる場合。', 'Boundary: ABはArt/Ayとともに観念プロファイルに寄与します。', 'Caution: 評価者推論ではなく反応内容の抽象性で判定します。'].join('\n'),
  AG: ['Definition: 攻撃性指標(AG)です。', 'Assign when: 攻撃・破壊・加害意図が行為として明示される場合に付与します。', 'Do not assign when: 敵対感はあっても攻撃行為が明示されない場合。', 'Boundary: AGは行為表象を要し雰囲気だけでは付与しません。', 'Caution: 道徳判断と分離して符号化します。'].join('\n'),
  COP: ['Definition: 協力性指標(COP)です。', 'Assign when: 二者以上が肯定的協力行為として明示される場合に付与します。', 'Do not assign when: 同時存在のみで協力行為が示されない場合。', 'Boundary: COPは人数ではなく相互作用の質を要件とします。', 'Caution: 関係推測ではなく行動記述根拠で判定します。'].join('\n'),
  MOR: ['Definition: 病理的・損傷的内容(MOR)です。', 'Assign when: 損傷・死・腐敗・欠陥・汚染などが対象質として明示される場合に付与します。', 'Do not assign when: 否定語のみで病理対象表象がない場合。', 'Boundary: MORは内容質指標であり単独診断指標ではありません。', 'Caution: 情動・自己知覚クラスターと統合解釈します。'].join('\n'),
  PER: ['Definition: 個人化(PER)です。', 'Assign when: 課題要求を超える自己言及的・個人化姿勢が示される場合に付与します。', 'Do not assign when: 課題適合的な一人称表現に留まる場合。', 'Boundary: PERは対人スタイル指標で単独重症度指標ではありません。', 'Caution: 対人クラスター変数と併読します。'].join('\n'),
  CP: ['Definition: 色彩投影(CP)です。', 'Assign when: 色が外在化された情動負荷として投影的に扱われる場合に付与します。', 'Do not assign when: 標準色彩決定因(FC/CF/C)で十分説明できる場合。', 'Boundary: CPは特殊得点であり色彩決定因の代替ではありません。', 'Caution: 情動調整パターン全体と統合して扱います。'].join('\n'),
};

const CARD_DETAILS_EN: Record<string, string> = {
  I: [
    'Definition: Card I is often treated as an initial adaptation card in protocol sequence.',
    'Coding focus: Observe baseline approach to ambiguity, form use, and response style under first-contact conditions.',
    'Do not overread: Early hesitation or brevity can be situational; confirm with later cards.',
    'Cross-checks: Compare with overall R, Lambda, and early vs later card shifts.',
    'Caution: Use card-level observations as hypothesis seeds, not conclusions.',
  ].join('\n'),
  II: [
    'Definition: Card II introduces stronger chromatic stimulation and often recruits affect-laden processing.',
    'Coding focus: Track color determinants (FC/CF/C), modulation quality, and form control under affective load.',
    'Do not overread: Color mention alone is not dysregulation; code determinant priority carefully.',
    'Cross-checks: Review with FC:CF+C, SumC values, and FQ distribution.',
    'Caution: Integrate with inquiry detail before affective inferences.',
  ].join('\n'),
  III: [
    'Definition: Card III frequently elicits interpersonal/human movement content in many protocols.',
    'Coding focus: Monitor M quality, COP/AG indicators, and human representational structure.',
    'Do not overread: Presence of people content alone does not define interpersonal functioning quality.',
    'Cross-checks: Compare with Human Cont, Pure H, GHR/PHR, and a:p pattern.',
    'Caution: Evaluate interaction quality, not just number of figures.',
  ].join('\n'),
  IV: [
    'Definition: Card IV presents a heavier, high-impact perceptual field often linked to authority/power themes in interpretation traditions.',
    'Coding focus: Prioritize formal coding accuracy (location, determinants, FQ) over thematic assumptions.',
    'Do not overread: Thematic authority interpretations are optional hypotheses, not coding criteria.',
    'Cross-checks: Examine FQ, MOR, and coping indices before inferential framing.',
    'Caution: Keep scoring evidence-based and content-neutral at coding stage.',
  ].join('\n'),
  V: [
    'Definition: Card V is typically form-dominant and often used to observe conventional form mediation.',
    'Coding focus: Assess pure form organization, FQ stability, and popular/conventional responding.',
    'Do not overread: Low novelty on this card can be normal and not clinically negative.',
    'Cross-checks: Compare with P, XA%, X+%, and Lambda context.',
    'Caution: Use as one anchor point, not sole indicator of reality testing.',
  ].join('\n'),
  VI: [
    'Definition: Card VI commonly supports shading-texture and dimensional processing opportunities.',
    'Coding focus: Distinguish FT/TF/T and FV/VF/V from form-only responses via inquiry evidence.',
    'Do not overread: Typical content associations do not automatically justify texture/vista coding.',
    'Cross-checks: Review with SumT, SumV, SumY, and related affect/self-perception variables.',
    'Caution: Determinant priority must come from explicit response process.',
  ].join('\n'),
  VII: [
    'Definition: Card VII often invites relational/perceptual organization requiring careful inquiry clarification.',
    'Coding focus: Track location selectivity, human content quality, and interactional representation.',
    'Do not overread: Symbolic themes are interpretive hypotheses and should not alter coding rules.',
    'Cross-checks: Use with interpersonal and self-perception clusters.',
    'Caution: Maintain strict separation between scoring and thematic interpretation.',
  ].join('\n'),
  VIII: [
    'Definition: Card VIII is fully chromatic and frequently tests affective processing with structural integration demands.',
    'Coding focus: Evaluate color-form balance, blend quality, and mediation under chromatic complexity.',
    'Do not overread: Chromatic engagement is not equivalent to affective instability.',
    'Cross-checks: Read with Afr, FC:CF+C, Blends:R, and FQ pattern.',
    'Caution: Interpret card effect only after full-protocol comparison.',
  ].join('\n'),
  IX: [
    'Definition: Card IX has diffuse multi-color complexity and can increase organizational demand.',
    'Coding focus: Observe handling of ambiguity via DQ, FQ, and determinant integration quality.',
    'Do not overread: Confusion on this card alone does not imply global disorganization.',
    'Cross-checks: Compare with Zd, Zf, and W:D:Dd distribution across cards.',
    'Caution: Use card-level strain as conditional evidence only.',
  ].join('\n'),
  X: [
    'Definition: Card X presents broad, dispersed detail fields often requiring flexible scanning and integration.',
    'Coding focus: Monitor breadth/selectivity (W/D/Dd), content spread, and organizational closure quality.',
    'Do not overread: High detail count may reflect engagement rather than dysfunction.',
    'Cross-checks: Integrate with Z metrics, processing cluster, and protocol-wide consistency.',
    'Caution: Final meaning depends on pattern repetition, not single-card density.',
  ].join('\n'),
};

const CONTENT_DETAILS_EN: Record<string, string> = {
  H: [
    'Definition: Whole realistic human content.',
    'Assign when: A full, real human figure is identified.',
    'Do not assign when: Figure is fictional/mythical (H) variant or partial only (Hd).',
    'Caution: Content code does not determine quality; pair with FQ and GHR/PHR.',
  ].join('\n'),
  '(H)': [
    'Definition: Whole fictional/mythological human-like content.',
    'Assign when: Figure is human-like but unreal (ghost, angel, monster, mythic person).',
    'Do not assign when: Figure is realistic ordinary human (H).',
    'Caution: Fantasy status must be explicit in response meaning.',
  ].join('\n'),
  Hd: [
    'Definition: Human detail content (partial human parts).',
    'Assign when: Body parts or partial human figure is perceived.',
    'Do not assign when: Full integrated human figure is present (H).',
    'Caution: Distinguish anatomical part content from full-person representation.',
  ].join('\n'),
  '(Hd)': [
    'Definition: Fictional/mythic human detail content.',
    'Assign when: Partial figure belongs to unreal or fantasy human-like entity.',
    'Do not assign when: Partial content is realistic human only (Hd).',
    'Caution: Classify by realism status and figure completeness.',
  ].join('\n'),
  Hx: [
    'Definition: Human experience content (human-related but not clearly whole/part form).',
    'Assign when: Human association is present without direct concrete human figure coding.',
    'Do not assign when: Clear H/Hd categories are available.',
    'Caution: Use only when human reference is evident but structurally indeterminate.',
  ].join('\n'),
  A: [
    'Definition: Whole realistic animal content.',
    'Assign when: Full ordinary animal is identified.',
    'Do not assign when: Animal is fictional/unreal ((A)) or partial only (Ad).',
    'Caution: Keep movement coding separate (FM family).',
  ].join('\n'),
  '(A)': [
    'Definition: Whole fictional/mythical animal content.',
    'Assign when: Animal is unreal, symbolic, or mythological.',
    'Do not assign when: Animal is realistic ordinary species (A).',
    'Caution: Fantasy status must come from explicit response meaning.',
  ].join('\n'),
  Ad: [
    'Definition: Animal detail content (partial animal parts).',
    'Assign when: Partial animal features are perceived.',
    'Do not assign when: Whole animal is clearly represented (A).',
    'Caution: Detail status depends on perceptual structure, not word length.',
  ].join('\n'),
  '(Ad)': [
    'Definition: Fictional/mythic animal detail content.',
    'Assign when: Partial content belongs to unreal animal-like figure.',
    'Do not assign when: Partial realistic animal content only (Ad).',
    'Caution: Separate realism status from completeness status.',
  ].join('\n'),
  An: [
    'Definition: Anatomy content.',
    'Assign when: Internal organs, skeletal, or bodily anatomical references are explicit.',
    'Do not assign when: Generic body-part reference is better coded as Hd without anatomy quality.',
    'Caution: Interpret with An+Xy and broader self-perception pattern.',
  ].join('\n'),
  Art: [
    'Definition: Art content (artistic objects/products).',
    'Assign when: Response identifies paintings, statues, decorative art-like objects, etc.',
    'Do not assign when: Object is ordinary non-art item without artistic framing.',
    'Caution: Art code contributes to specific ideation composites in interpretation.',
  ].join('\n'),
  Ay: [
    'Definition: Anthropology content (cultural/ethnic/historical human-group references).',
    'Assign when: Response explicitly references cultural/ethnographic human representation.',
    'Do not assign when: Generic person coding (H/Hd) fully captures content.',
    'Caution: Use explicit response wording to avoid examiner projection.',
  ].join('\n'),
  Bl: [
    'Definition: Blood content.',
    'Assign when: Blood is explicitly identified as object/content element.',
    'Do not assign when: Red color is mentioned without blood content claim.',
    'Caution: Keep determinant color coding separate from content coding.',
  ].join('\n'),
  Bt: [
    'Definition: Botany content (plants, trees, flowers).',
    'Assign when: Plant-life objects are clearly identified.',
    'Do not assign when: Form is too vague to support botanical identification.',
    'Caution: Use with form-fit evidence, not thematic expectation.',
  ].join('\n'),
  Cg: [
    'Definition: Clothing content.',
    'Assign when: Garments or apparel items are identified.',
    'Do not assign when: Texture words imply fabric quality without object identification.',
    'Caution: Separate content from texture determinant coding.',
  ].join('\n'),
  Cl: [
    'Definition: Clouds content.',
    'Assign when: Cloud formations are explicitly perceived.',
    'Do not assign when: Vague atmospheric impression lacks cloud identification.',
    'Caution: Distinguish cloud content from diffuse shading determinant logic.',
  ].join('\n'),
  Ex: [
    'Definition: Explosion content.',
    'Assign when: Explosive event or blast-like object/process is clearly described.',
    'Do not assign when: General movement/energy does not specify explosion.',
    'Caution: Pair with movement and special scores only when criteria are met.',
  ].join('\n'),
  Fd: [
    'Definition: Food content.',
    'Assign when: Edible items/food objects are identified.',
    'Do not assign when: Texture or color references occur without food object claim.',
    'Caution: Interpret with interpersonal dependency markers only in full context.',
  ].join('\n'),
  Fi: [
    'Definition: Fire content.',
    'Assign when: Flames, fire, burning source is explicitly identified.',
    'Do not assign when: Warm color alone is used without fire object/percept.',
    'Caution: Maintain separation between chromatic determinants and content.',
  ].join('\n'),
  Ge: [
    'Definition: Geography content (maps, landforms, terrain representations).',
    'Assign when: Geographic features or map-like forms are identified.',
    'Do not assign when: Depth/perspective is coded without geographic object identity.',
    'Caution: Distinguish from vista determinant and pure form claims.',
  ].join('\n'),
  Hh: [
    'Definition: Household content.',
    'Assign when: Domestic/household objects are identified.',
    'Do not assign when: Object category is better classified under specific other content code.',
    'Caution: Use most specific applicable content code first.',
  ].join('\n'),
  Ls: [
    'Definition: Landscape content.',
    'Assign when: Natural scene/landscape composition is explicitly perceived.',
    'Do not assign when: Isolated objects are identified without scene-level organization.',
    'Caution: Scene coding may co-occur with reflection/vista only when criteria are explicit.',
  ].join('\n'),
  Na: [
    'Definition: Nature content (natural objects/phenomena not otherwise classified).',
    'Assign when: Natural-world referents are identified without a more specific content code.',
    'Do not assign when: More specific category (Bt, Cl, Fi, etc.) fits better.',
    'Caution: Prefer specific content over broad catch-all coding.',
  ].join('\n'),
  Sc: [
    'Definition: Science content (scientific/technical references).',
    'Assign when: Scientific instrument/process/concept is explicitly represented as content.',
    'Do not assign when: Technical language is metaphorical and no scientific object is perceived.',
    'Caution: Code from percept, not assumed knowledge level.',
  ].join('\n'),
  Sx: [
    'Definition: Sex content.',
    'Assign when: Sexual organs/acts/themes are explicitly identified as perceptual content.',
    'Do not assign when: Ambiguous relational wording lacks explicit sexual content.',
    'Caution: Use explicit-response threshold to prevent overcoding.',
  ].join('\n'),
  Xy: [
    'Definition: X-ray content.',
    'Assign when: Internal radiographic-like visibility (bones/internal structures) is explicitly described.',
    'Do not assign when: Generic anatomy is present without X-ray-like perspective.',
    'Caution: Interpret with An+Xy composite in broader context.',
  ].join('\n'),
  Id: [
    'Definition: Idiosyncratic content not fitting standard content classes.',
    'Assign when: Content is clear but does not match established categories.',
    'Do not assign when: A standard code is reasonably applicable.',
    'Caution: Minimize Id use; prefer specific standard coding when defensible.',
  ].join('\n'),
};

const CARD_DETAILS_ES: Record<string, string> = {
  I: ['Definition: Lamina I (adaptacion inicial).', 'Coding focus: Estilo basal de aproximacion a ambiguedad y uso de forma.', 'Do not overread: Dudas tempranas pueden ser situacionales.', 'Cross-checks: Comparar con R, Lambda y cambios posteriores.', 'Caution: Usar como hipotesis inicial, no conclusion.'].join('\n'),
  II: ['Definition: Lamina II (mayor carga cromatica).', 'Coding focus: FC/CF/C, control formal bajo carga afectiva.', 'Do not overread: Mencionar color no implica desregulacion.', 'Cross-checks: FC:CF+C, SumC y FQ.', 'Caution: Confirmar prioridad de determinantes por inquiry.'].join('\n'),
  III: ['Definition: Lamina III (frecuente activacion interpersonal).', 'Coding focus: Calidad de M, COP/AG y representacion humana.', 'Do not overread: Contenido de personas no define por si solo calidad interpersonal.', 'Cross-checks: Human Cont, Pure H, GHR/PHR, a:p.', 'Caution: Priorizar calidad de interaccion.'].join('\n'),
  IV: ['Definition: Lamina IV (campo de alto impacto perceptivo).', 'Coding focus: Exactitud formal de localizacion/determinantes/FQ.', 'Do not overread: Hipotesis tematicas no sustituyen reglas de codificacion.', 'Cross-checks: FQ, MOR e indices de afrontamiento.', 'Caution: Mantener codificacion basada en evidencia.'].join('\n'),
  V: ['Definition: Lamina V (predominio formal).', 'Coding focus: Mediacion formal convencional y estabilidad FQ.', 'Do not overread: Baja novedad puede ser normal.', 'Cross-checks: P, XA%, X+% y Lambda.', 'Caution: No usar como unico indicador de prueba de realidad.'].join('\n'),
  VI: ['Definition: Lamina VI (oportunidad de textura/dimensionalidad).', 'Coding focus: Diferenciar FT/TF/T y FV/VF/V con inquiry.', 'Do not overread: Asociaciones tipicas no justifican codigo por si solas.', 'Cross-checks: SumT, SumV, SumY.', 'Caution: Determinar prioridad por evidencia verbal.'].join('\n'),
  VII: ['Definition: Lamina VII (organizacion relacional).', 'Coding focus: Selectividad de localizacion y cualidad de contenido humano.', 'Do not overread: Simbolismo no altera reglas de scoring.', 'Cross-checks: Interpersonal y self-perception.', 'Caution: Separar scoring de interpretacion tematica.'].join('\n'),
  VIII: ['Definition: Lamina VIII (cromatica completa).', 'Coding focus: Balance color-forma y calidad de blends.', 'Do not overread: Activacion cromatica no equivale a inestabilidad.', 'Cross-checks: Afr, FC:CF+C, Blends:R, FQ.', 'Caution: Comparar con todo el protocolo.'].join('\n'),
  IX: ['Definition: Lamina IX (complejidad difusa multicolor).', 'Coding focus: Manejo de ambiguedad via DQ/FQ/integracion.', 'Do not overread: Confusion aislada no implica desorganizacion global.', 'Cross-checks: Zd, Zf, W:D:Dd.', 'Caution: Usar como evidencia condicional.'].join('\n'),
  X: ['Definition: Lamina X (detalles dispersos e integracion flexible).', 'Coding focus: Amplitud/selectividad de escaneo y cierre organizativo.', 'Do not overread: Alto detalle puede reflejar compromiso, no disfuncion.', 'Cross-checks: Metricas Z y consistencia interlaminas.', 'Caution: Basar significado en repeticion de patron.'].join('\n'),
};

const CARD_DETAILS_PT: Record<string, string> = {
  I: ['Definition: Cartao I (adaptacao inicial).', 'Coding focus: Estilo basal de aproximacao a ambiguidade e uso de forma.', 'Do not overread: Hesitacao inicial pode ser situacional.', 'Cross-checks: Comparar com R, Lambda e mudancas posteriores.', 'Caution: Usar como hipotese inicial, nao conclusao.'].join('\n'),
  II: ['Definition: Cartao II (maior carga cromatica).', 'Coding focus: FC/CF/C e controle formal sob carga afetiva.', 'Do not overread: Mencionar cor nao implica desregulacao.', 'Cross-checks: FC:CF+C, SumC e FQ.', 'Caution: Confirmar prioridade de determinantes via inquerito.'].join('\n'),
  III: ['Definition: Cartao III (frequente ativacao interpessoal).', 'Coding focus: Qualidade de M, COP/AG e representacao humana.', 'Do not overread: Conteudo de pessoas nao define sozinho qualidade interpessoal.', 'Cross-checks: Human Cont, Pure H, GHR/PHR, a:p.', 'Caution: Priorizar qualidade da interacao.'].join('\n'),
  IV: ['Definition: Cartao IV (campo perceptivo de alto impacto).', 'Coding focus: Precisao formal de localizacao/determinantes/FQ.', 'Do not overread: Hipoteses tematicas nao substituem regras de codificacao.', 'Cross-checks: FQ, MOR e indices de coping.', 'Caution: Manter codificacao baseada em evidencia.'].join('\n'),
  V: ['Definition: Cartao V (predominio formal).', 'Coding focus: Mediacao formal convencional e estabilidade de FQ.', 'Do not overread: Baixa novidade pode ser normal.', 'Cross-checks: P, XA%, X+% e Lambda.', 'Caution: Nao usar como unico indicador de teste de realidade.'].join('\n'),
  VI: ['Definition: Cartao VI (oportunidade de textura/dimensionalidade).', 'Coding focus: Diferenciar FT/TF/T e FV/VF/V com inquerito.', 'Do not overread: Associacoes tipicas nao justificam codigo por si so.', 'Cross-checks: SumT, SumV, SumY.', 'Caution: Definir prioridade por evidencia verbal.'].join('\n'),
  VII: ['Definition: Cartao VII (organizacao relacional).', 'Coding focus: Seletividade de localizacao e qualidade de conteudo humano.', 'Do not overread: Simbolismo nao altera regras de scoring.', 'Cross-checks: Interpessoal e autopercepcao.', 'Caution: Separar scoring de interpretacao tematica.'].join('\n'),
  VIII: ['Definition: Cartao VIII (cromatico completo).', 'Coding focus: Balanceamento cor-forma e qualidade de blends.', 'Do not overread: Engajamento cromatico nao equivale a instabilidade.', 'Cross-checks: Afr, FC:CF+C, Blends:R, FQ.', 'Caution: Comparar com o protocolo inteiro.'].join('\n'),
  IX: ['Definition: Cartao IX (complexidade difusa multicolor).', 'Coding focus: Manejo de ambiguidade via DQ/FQ/integracao.', 'Do not overread: Confusao isolada nao implica desorganizacao global.', 'Cross-checks: Zd, Zf, W:D:Dd.', 'Caution: Usar como evidencia condicional.'].join('\n'),
  X: ['Definition: Cartao X (detalhes dispersos e integracao flexivel).', 'Coding focus: Amplitude/seletividade de varredura e fechamento organizativo.', 'Do not overread: Alto detalhe pode indicar engajamento, nao disfuncao.', 'Cross-checks: Metricas Z e consistencia entre cartoes.', 'Caution: Basear significado na repeticao de padrao.'].join('\n'),
};

const CARD_DETAILS_JA: Record<string, string> = {
  I: ['Definition: カードIは初期適応の観察点です。', 'Coding focus: 曖昧性への初期接近、形態使用、反応スタイルを確認します。', 'Do not overread: 初期のためらいは状況要因のことがあるため単独解釈しません。', 'Cross-checks: R、Lambda、後続カードでの変化と比較します。', 'Caution: 単カード所見は仮説種に留めます。'].join('\n'),
  II: ['Definition: カードIIは色彩負荷が高まりやすいカードです。', 'Coding focus: FC/CF/Cの優先性、色彩下の形態統制を確認します。', 'Do not overread: 色への言及のみで情動失調とは判断しません。', 'Cross-checks: FC:CF+C、SumC、FQ分布を併読します。', 'Caution: 決定因優先は質問段階の逐語証拠で確定します。'].join('\n'),
  III: ['Definition: カードIIIは対人・人間運動反応を引き出しやすいカードです。', 'Coding focus: M質、COP/AG、人間表象の組織性を確認します。', 'Do not overread: 人物内容の有無だけで対人機能を断定しません。', 'Cross-checks: Human Cont、Pure H、GHR/PHR、a:pを併読します。', 'Caution: 人数ではなく相互作用の質を評価します。'].join('\n'),
  IV: ['Definition: カードIVは重厚な知覚場を提供するカードです。', 'Coding focus: テーマ推測より位置・決定因・FQの形式精度を優先します。', 'Do not overread: 権威テーマ等は符号化根拠ではなく解釈仮説です。', 'Cross-checks: FQ、MOR、対処関連指標と照合します。', 'Caution: 符号化段階では内容中立を維持します。'].join('\n'),
  V: ['Definition: カードVは形態優位の観察点です。', 'Coding focus: 純形態組織、FQ安定性、慣習的反応を確認します。', 'Do not overread: 新奇性が低いこと自体は病理所見ではありません。', 'Cross-checks: P、XA%、X+%、Lambdaと統合します。', 'Caution: 現実吟味は単カードで結論化しません。'].join('\n'),
  VI: ['Definition: カードVIは質感・次元性処理を誘発しやすいカードです。', 'Coding focus: FT/TF/TとFV/VF/Vを質問証拠で厳密に区別します。', 'Do not overread: 典型内容連想だけで質感/眺望決定因を付与しません。', 'Cross-checks: SumT、SumV、SumYおよび関連クラスターを確認します。', 'Caution: 優先決定因は反応生成過程に基づいて判断します。'].join('\n'),
  VII: ['Definition: カードVIIは関係性の知覚組織を観察しやすいカードです。', 'Coding focus: 位置選択、人間内容の質、相互作用表象を確認します。', 'Do not overread: 象徴仮説は符号化規則を変更しません。', 'Cross-checks: 対人・自己知覚クラスターと統合します。', 'Caution: 符号化と主題解釈を分離します。'].join('\n'),
  VIII: ['Definition: カードVIIIは全色彩カードで統合負荷が高い場面です。', 'Coding focus: 色彩と形態のバランス、ブレンド品質、媒介安定性を確認します。', 'Do not overread: 色彩活性化は情動不安定の同義ではありません。', 'Cross-checks: Afr、FC:CF+C、Blends:R、FQパターンを併読します。', 'Caution: 全プロトコル比較後に意味づけします。'].join('\n'),
  IX: ['Definition: カードIXは多色・拡散複雑性が高いカードです。', 'Coding focus: DQ/FQと決定因統合による曖昧性処理を確認します。', 'Do not overread: 単カード混乱を全体的解体と同一視しません。', 'Cross-checks: Zd、Zf、W:D:Ddをカード横断で検証します。', 'Caution: 条件付き証拠として扱い反復性を確認します。'].join('\n'),
  X: ['Definition: カードXは分散詳細と柔軟統合を要求するカードです。', 'Coding focus: 走査の幅と選択性、内容分散、組織的閉合を確認します。', 'Do not overread: 詳細数の多さは関与の高さで説明可能です。', 'Cross-checks: Z指標、処理クラスター、全体整合性を統合します。', 'Caution: 単発密度ではなく反復パターンで解釈します。'].join('\n'),
};

const CONTENT_DETAILS_ES: Record<string, string> = {
  H: ['Definition: Contenido humano completo realista (H).', 'Assign when: Se identifica una figura humana completa y real.', 'Do not assign when: Es humano ficticio ((H)) o parcial (Hd).', 'Caution: Integrar con FQ y GHR/PHR para calidad representacional.'].join('\n'),
  '(H)': ['Definition: Contenido humano completo ficticio ((H)).', 'Assign when: Figura humana no real (fantasma, angel, mitico).', 'Do not assign when: Es humano realista ordinario (H).', 'Caution: La cualidad fantastica debe ser explicita.'].join('\n'),
  Hd: ['Definition: Detalle humano (Hd).', 'Assign when: Se perciben partes del cuerpo o humano parcial.', 'Do not assign when: La figura humana es completa (H).', 'Caution: Diferenciar de contenido anatomico An.'].join('\n'),
  '(Hd)': ['Definition: Detalle humano ficticio ((Hd)).', 'Assign when: Parte humana asociada a entidad irreal/fantastica.', 'Do not assign when: Es detalle humano realista (Hd).', 'Caution: Clasificar por realismo y completitud.'].join('\n'),
  Hx: ['Definition: Experiencia humana (Hx).', 'Assign when: Hay referencia humana sin codificacion clara como H/Hd.', 'Do not assign when: H o Hd aplican con claridad.', 'Caution: Usar de forma conservadora con evidencia textual.'].join('\n'),
  A: ['Definition: Contenido animal completo realista (A).', 'Assign when: Se identifica animal ordinario completo.', 'Do not assign when: Es ficticio ((A)) o parcial (Ad).', 'Caution: Mantener separado de codigos de movimiento.'].join('\n'),
  '(A)': ['Definition: Contenido animal completo ficticio ((A)).', 'Assign when: Animal irreal/simbolico/mitico.', 'Do not assign when: Es especie real ordinaria (A).', 'Caution: Requiere evidencia explicita de fantasia.'].join('\n'),
  Ad: ['Definition: Detalle animal (Ad).', 'Assign when: Se identifican partes parciales de animal.', 'Do not assign when: Hay animal completo (A).', 'Caution: La parcialidad se define por estructura perceptual.'].join('\n'),
  '(Ad)': ['Definition: Detalle animal ficticio ((Ad)).', 'Assign when: Parte de animal irreal/fantastico.', 'Do not assign when: Es detalle animal realista (Ad).', 'Caution: Separar eje realismo del eje completitud.'].join('\n'),
  An: ['Definition: Contenido anatomico (An).', 'Assign when: Se mencionan organos/estructura anatomica explicitamente.', 'Do not assign when: La referencia corporal general encaja mejor en Hd.', 'Caution: Integrar con compuesto An+Xy y self-perception.'].join('\n'),
  Fd: ['Definition: Contenido comida (Fd/Food).', 'Assign when: Se identifican objetos comestibles.', 'Do not assign when: Solo hay color/textura sin objeto alimentario.', 'Caution: Interpretar dependencia solo en patron global.'].join('\n'),
  Xy: ['Definition: Contenido rayos X (Xy).', 'Assign when: Se describe visibilidad interna tipo radiografica.', 'Do not assign when: Hay anatomia general sin perspectiva radiografica.', 'Caution: Integrar con An+Xy en contexto clinico amplio.'].join('\n'),
  Sx: ['Definition: Contenido sexual (Sx).', 'Assign when: Organos/actos/temas sexuales se identifican explicitamente.', 'Do not assign when: La referencia relacional es ambigua y no sexual explicita.', 'Caution: Usar umbral alto de explicitud para evitar sobrecodificacion.'].join('\n'),
  Art: ['Definition: Contenido de arte (Art).', 'Assign when: Se identifican obras/objetos artisticos.', 'Do not assign when: Es objeto ordinario sin marco artistico.', 'Caution: Contribuye a compuestos de ideacion; requerir evidencia textual.'].join('\n'),
  Ay: ['Definition: Contenido antropologico/cultural (Ay).', 'Assign when: Hay referencia explicita a grupos/figuras historico-culturales.', 'Do not assign when: H/Hd ordinario cubre suficientemente el contenido.', 'Caution: Evitar inferencias culturales no explicitadas.'].join('\n'),
  Bl: ['Definition: Contenido sangre (Bl).', 'Assign when: La sangre se identifica explicitamente como contenido.', 'Do not assign when: Solo se menciona color rojo sin objeto sangre.', 'Caution: Separar codigo de contenido de determinantes de color.'].join('\n'),
  Bt: ['Definition: Contenido botanico (Bt).', 'Assign when: Se identifican plantas/arboles/flores.', 'Do not assign when: La forma es demasiado vaga para soporte botanico.', 'Caution: Requiere base de ajuste formal.'].join('\n'),
  Cg: ['Definition: Contenido vestimenta (Cg).', 'Assign when: Se identifican prendas/ropa.', 'Do not assign when: Solo hay cualidad textural sin objeto vestimenta.', 'Caution: Diferenciar de determinante de textura.'].join('\n'),
  Cl: ['Definition: Contenido nubes (Cl).', 'Assign when: Se perciben formaciones de nube explicitamente.', 'Do not assign when: Hay impresion atmosferica vaga sin identificacion de nube.', 'Caution: Diferenciar contenido Cl de logica de sombreado difuso.'].join('\n'),
  Ex: ['Definition: Contenido explosion (Ex).', 'Assign when: Se describe evento/objeto explosivo de forma clara.', 'Do not assign when: Solo hay energia/movimiento general sin explosion.', 'Caution: Combinar con movimiento/SS solo si criterios se cumplen.'].join('\n'),
  Fi: ['Definition: Contenido fuego (Fi).', 'Assign when: Se identifican llama/fuente de fuego explicitamente.', 'Do not assign when: Solo hay color calido sin objeto fuego.', 'Caution: Separar contenido de determinantes cromaticos.'].join('\n'),
  Ge: ['Definition: Contenido geografico (Ge).', 'Assign when: Se identifican mapas/terreno/rasgos geograficos.', 'Do not assign when: Solo hay profundidad/perspectiva sin objeto geografico.', 'Caution: Diferenciar Ge de V/FD.'].join('\n'),
  Hh: ['Definition: Contenido domestico/hogar (Hh).', 'Assign when: Se identifican objetos de uso domestico.', 'Do not assign when: Existe codigo de contenido mas especifico aplicable.', 'Caution: Priorizar codigo mas especifico disponible.'].join('\n'),
  Ls: ['Definition: Contenido paisaje (Ls).', 'Assign when: Se percibe escena/paisaje natural organizado.', 'Do not assign when: Solo hay objetos aislados sin nivel de escena.', 'Caution: Co-ocurrencia con vista/reflejo requiere criterios explicitos.'].join('\n'),
  Na: ['Definition: Contenido naturaleza (Na).', 'Assign when: Referente natural sin categoria mas especifica aplicable.', 'Do not assign when: Bt/Cl/Fi u otra categoria especifica ajusta mejor.', 'Caution: Evitar usar Na como comodin.'].join('\n'),
  Sc: ['Definition: Contenido ciencia/tecnico (Sc).', 'Assign when: Se identifica objeto/proceso cientifico o tecnico.', 'Do not assign when: Lenguaje tecnico metaforico sin objeto percibido.', 'Caution: Codificar desde percepto, no desde nivel educativo inferido.'].join('\n'),
  Id: ['Definition: Contenido idiosincratico (Id).', 'Assign when: El contenido es claro pero no encaja en categorias estandar.', 'Do not assign when: Un codigo estandar es razonablemente aplicable.', 'Caution: Minimizar Id y preferir codigos especificos defensables.'].join('\n'),
};

const CONTENT_DETAILS_PT: Record<string, string> = {
  H: ['Definition: Conteudo humano completo realista (H).', 'Assign when: Identifica-se figura humana completa e real.', 'Do not assign when: E humano ficticio ((H)) ou parcial (Hd).', 'Caution: Integrar com FQ e GHR/PHR para qualidade representacional.'].join('\n'),
  '(H)': ['Definition: Conteudo humano completo ficticio ((H)).', 'Assign when: Figura humana irreal (fantasma, anjo, mitico).', 'Do not assign when: E humano realista ordinario (H).', 'Caution: A qualidade fantastica deve ser explicita.'].join('\n'),
  Hd: ['Definition: Detalhe humano (Hd).', 'Assign when: Partes corporais ou humano parcial sao percebidos.', 'Do not assign when: A figura humana e completa (H).', 'Caution: Diferenciar de conteudo anatomico An.'].join('\n'),
  '(Hd)': ['Definition: Detalhe humano ficticio ((Hd)).', 'Assign when: Parte humana associada a entidade irreal/fantastica.', 'Do not assign when: E detalhe humano realista (Hd).', 'Caution: Classificar por realismo e completude.'].join('\n'),
  Hx: ['Definition: Experiencia humana (Hx).', 'Assign when: Ha referencia humana sem codificacao clara como H/Hd.', 'Do not assign when: H ou Hd se aplicam com clareza.', 'Caution: Usar de forma conservadora com evidencia textual.'].join('\n'),
  A: ['Definition: Conteudo animal completo realista (A).', 'Assign when: Animal ordinario completo e identificado.', 'Do not assign when: E ficticio ((A)) ou parcial (Ad).', 'Caution: Manter separado de codigos de movimento.'].join('\n'),
  '(A)': ['Definition: Conteudo animal completo ficticio ((A)).', 'Assign when: Animal irreal/simbolico/mitico.', 'Do not assign when: E especie real ordinaria (A).', 'Caution: Requer evidencia explicita de fantasia.'].join('\n'),
  Ad: ['Definition: Detalhe animal (Ad).', 'Assign when: Partes parciais de animal sao identificadas.', 'Do not assign when: Ha animal completo (A).', 'Caution: Parcialidade e definida por estrutura perceptual.'].join('\n'),
  '(Ad)': ['Definition: Detalhe animal ficticio ((Ad)).', 'Assign when: Parte de animal irreal/fantastico.', 'Do not assign when: E detalhe animal realista (Ad).', 'Caution: Separar eixo realismo do eixo completude.'].join('\n'),
  An: ['Definition: Conteudo anatomico (An).', 'Assign when: Orgaos/estrutura anatomica sao mencionados explicitamente.', 'Do not assign when: Referencia corporal geral cabe melhor em Hd.', 'Caution: Integrar com composto An+Xy e autopercepcao.'].join('\n'),
  Fd: ['Definition: Conteudo comida (Fd/Food).', 'Assign when: Objetos comestiveis sao identificados.', 'Do not assign when: Ha apenas cor/textura sem objeto alimentar.', 'Caution: Interpretar dependencia apenas em padrao global.'].join('\n'),
  Xy: ['Definition: Conteudo raio-X (Xy).', 'Assign when: Visibilidade interna tipo radiografica e descrita.', 'Do not assign when: Ha anatomia geral sem perspectiva radiografica.', 'Caution: Integrar com An+Xy em contexto clinico amplo.'].join('\n'),
  Sx: ['Definition: Conteudo sexual (Sx).', 'Assign when: Orgaos/atos/temas sexuais sao explicitamente identificados.', 'Do not assign when: Referencia relacional e ambigua e sem conteudo sexual explicito.', 'Caution: Usar limiar alto de explicitacao para evitar sobrecodificacao.'].join('\n'),
  Art: ['Definition: Conteudo artistico (Art).', 'Assign when: Obras/objetos artisticos sao identificados.', 'Do not assign when: E objeto comum sem enquadramento artistico.', 'Caution: Contribui para compostos de ideacao; exigir evidencia textual.'].join('\n'),
  Ay: ['Definition: Conteudo antropologico/cultural (Ay).', 'Assign when: Ha referencia explicita a grupos/figuras historico-culturais.', 'Do not assign when: H/Hd ordinario ja cobre o conteudo.', 'Caution: Evitar inferencias culturais nao explicitadas.'].join('\n'),
  Bl: ['Definition: Conteudo sangue (Bl).', 'Assign when: Sangue e identificado explicitamente como conteudo.', 'Do not assign when: Ha apenas mencao de cor vermelha sem objeto sangue.', 'Caution: Separar codigo de conteudo dos determinantes cromaticos.'].join('\n'),
  Bt: ['Definition: Conteudo botanico (Bt).', 'Assign when: Plantas/arvores/flores sao identificadas.', 'Do not assign when: Forma e vaga demais para suporte botanico.', 'Caution: Requer base de ajuste formal.'].join('\n'),
  Cg: ['Definition: Conteudo vestuario (Cg).', 'Assign when: Roupas/pecas de vestimenta sao identificadas.', 'Do not assign when: Ha apenas qualidade textural sem objeto vestuario.', 'Caution: Diferenciar de determinante de textura.'].join('\n'),
  Cl: ['Definition: Conteudo nuvens (Cl).', 'Assign when: Formacoes de nuvem sao explicitamente percebidas.', 'Do not assign when: Ha impressao atmosferica vaga sem identificacao de nuvem.', 'Caution: Diferenciar Cl de logica de sombreado difuso.'].join('\n'),
  Ex: ['Definition: Conteudo explosao (Ex).', 'Assign when: Evento/objeto explosivo e descrito de modo claro.', 'Do not assign when: Ha apenas energia/movimento geral sem explosao.', 'Caution: Combinar com movimento/SS apenas se criterios forem cumpridos.'].join('\n'),
  Fi: ['Definition: Conteudo fogo (Fi).', 'Assign when: Chama/fonte de fogo e explicitamente identificada.', 'Do not assign when: Ha somente cor quente sem objeto fogo.', 'Caution: Separar conteudo de determinantes cromaticos.'].join('\n'),
  Ge: ['Definition: Conteudo geografico (Ge).', 'Assign when: Mapas/terreno/feicoes geograficas sao identificados.', 'Do not assign when: Ha apenas profundidade/perspectiva sem objeto geografico.', 'Caution: Diferenciar Ge de V/FD.'].join('\n'),
  Hh: ['Definition: Conteudo domestico (Hh).', 'Assign when: Objetos de uso domestico sao identificados.', 'Do not assign when: Existe codigo de conteudo mais especifico aplicavel.', 'Caution: Priorizar codigo mais especifico disponivel.'].join('\n'),
  Ls: ['Definition: Conteudo paisagem (Ls).', 'Assign when: Cena/paisagem natural organizada e percebida.', 'Do not assign when: Ha apenas objetos isolados sem nivel de cena.', 'Caution: Coocorrencia com vista/reflexo exige criterios explicitos.'].join('\n'),
  Na: ['Definition: Conteudo natureza (Na).', 'Assign when: Referente natural sem categoria mais especifica aplicavel.', 'Do not assign when: Bt/Cl/Fi ou outra categoria especifica se ajusta melhor.', 'Caution: Evitar Na como categoria comodin.'].join('\n'),
  Sc: ['Definition: Conteudo cientifico/tecnico (Sc).', 'Assign when: Objeto/processo cientifico ou tecnico e identificado.', 'Do not assign when: Linguagem tecnica metaforica sem objeto percebido.', 'Caution: Codificar a partir do percepto, nao de escolaridade inferida.'].join('\n'),
  Id: ['Definition: Conteudo idiossincratico (Id).', 'Assign when: O conteudo e claro, mas nao se encaixa em categorias padrao.', 'Do not assign when: Um codigo padrao e razoavelmente aplicavel.', 'Caution: Minimizar Id e preferir codigos especificos defensaveis.'].join('\n'),
};

const CONTENT_DETAILS_JA: Record<string, string> = {
  H: ['Definition: 現実的な全体人間内容(H)です。', 'Assign when: 完整な現実的人物が同定される場合に付与します。', 'Do not assign when: 空想的人物((H))または部分人物(Hd)が適切な場合。', 'Caution: 表象の質はFQやGHR/PHRと統合して評価します。'].join('\n'),
  '(H)': ['Definition: 空想的・神話的な全体人間内容((H))です。', 'Assign when: 幽霊・天使・神話的人物など非現実的人間像が示される場合に付与します。', 'Do not assign when: 現実的人物(H)として妥当な場合。', 'Caution: 空想性は反応文中で明示されている必要があります。'].join('\n'),
  Hd: ['Definition: 人間部分内容(Hd)です。', 'Assign when: 身体部分や部分的人物が知覚される場合に付与します。', 'Do not assign when: 全体人物(H)として統合される場合。', 'Caution: An(解剖)との境界を逐語根拠で確認します。'].join('\n'),
  '(Hd)': ['Definition: 空想的人間部分内容((Hd))です。', 'Assign when: 非現実的存在に属する人間部分が示される場合に付与します。', 'Do not assign when: 現実的人間部分(Hd)が妥当な場合。', 'Caution: 完整性軸と現実性軸を分けて判断します。'].join('\n'),
  Hx: ['Definition: 人間経験内容(Hx)です。', 'Assign when: 人間関連性はあるがH/Hdへ明確に分類しにくい場合に付与します。', 'Do not assign when: HまたはHdが明確に成立する場合。', 'Caution: 保守的に使用し、逐語証拠を必須とします。'].join('\n'),
  A: ['Definition: 現実的な全体動物内容(A)です。', 'Assign when: 通常の全体動物が同定される場合に付与します。', 'Do not assign when: 空想動物((A))または部分動物(Ad)が適切な場合。', 'Caution: 動物運動(FM系)とは別軸で符号化します。'].join('\n'),
  '(A)': ['Definition: 空想的な全体動物内容((A))です。', 'Assign when: 神話・象徴・非現実的動物が示される場合に付与します。', 'Do not assign when: 現実的動物(A)が妥当な場合。', 'Caution: 空想性は反応上の明示が必要です。'].join('\n'),
  Ad: ['Definition: 動物部分内容(Ad)です。', 'Assign when: 動物の部分特徴が知覚される場合に付与します。', 'Do not assign when: 全体動物(A)が成立する場合。', 'Caution: 部分性は知覚構造に基づいて判断します。'].join('\n'),
  '(Ad)': ['Definition: 空想的動物部分内容((Ad))です。', 'Assign when: 非現実的動物に属する部分が示される場合に付与します。', 'Do not assign when: 現実的動物部分(Ad)が妥当な場合。', 'Caution: 現実性と部分性を混同しないようにします。'].join('\n'),
  An: ['Definition: 解剖内容(An)です。', 'Assign when: 内臓・骨格・解剖学的構造が明示される場合に付与します。', 'Do not assign when: 一般的身体部分としてHdがより妥当な場合。', 'Caution: An+Xy複合および自己知覚領域と統合して解釈します。'].join('\n'),
  Fd: ['Definition: 食物内容(Fd)です。', 'Assign when: 食べ物・可食対象が明示同定される場合に付与します。', 'Do not assign when: 色や質感のみで食物対象がない場合。', 'Caution: 依存性含意は単独で扱わず全体パターンで評価します。'].join('\n'),
  Xy: ['Definition: X線内容(Xy)です。', 'Assign when: 透視的な内部可視化(骨や内構造)が明示される場合に付与します。', 'Do not assign when: 単なる解剖言及でX線視点がない場合。', 'Caution: An+Xyとして文脈統合して扱います。'].join('\n'),
  Sx: ['Definition: 性内容(Sx)です。', 'Assign when: 性器・性的行為・性的主題が明示される場合に付与します。', 'Do not assign when: 関係語が曖昧で明示的性的内容がない場合。', 'Caution: 過剰符号化回避のため明示閾値を高く設定します。'].join('\n'),
};

const CONTENT_DETAILS_JA_EXTRA: Record<string, string> = {
  Art: ['Definition: 芸術内容(Art)です。', 'Assign when: 絵画・彫像など芸術対象が明示される場合に付与します。', 'Do not assign when: 芸術的枠づけのない通常物体の場合。', 'Caution: 観念複合で参照されるため逐語根拠を確認します。'].join('\n'),
  Ay: ['Definition: 文化・人類学内容(Ay)です。', 'Assign when: 文化・民族・歴史的人物群への明示参照がある場合に付与します。', 'Do not assign when: H/Hdで十分に記述できる場合。', 'Caution: 文化推測の過剰適用を避けます。'].join('\n'),
  Bl: ['Definition: 血液内容(Bl)です。', 'Assign when: 血液が対象内容として明示される場合に付与します。', 'Do not assign when: 赤色言及のみで血液対象がない場合。', 'Caution: 内容コードと色彩決定因を分離します。'].join('\n'),
  Bt: ['Definition: 植物内容(Bt)です。', 'Assign when: 木・花・植物対象が同定される場合に付与します。', 'Do not assign when: 形態根拠が不十分な場合。', 'Caution: 形態適合根拠と併せて判断します。'].join('\n'),
  Cg: ['Definition: 衣服内容(Cg)です。', 'Assign when: 衣服・衣類対象が同定される場合に付与します。', 'Do not assign when: 質感語のみで衣服対象がない場合。', 'Caution: 内容コードと質感決定因を区別します。'].join('\n'),
  Cl: ['Definition: 雲内容(Cl)です。', 'Assign when: 雲形態が明示同定される場合に付与します。', 'Do not assign when: 漠然とした大気印象のみの場合。', 'Caution: Cl内容と拡散陰影論理を混同しません。'].join('\n'),
  Ex: ['Definition: 爆発内容(Ex)です。', 'Assign when: 爆発・噴出イベントが明示される場合に付与します。', 'Do not assign when: 一般的エネルギー感のみの場合。', 'Caution: 必要時のみ運動/特殊得点と併用します。'].join('\n'),
  Fi: ['Definition: 火内容(Fi)です。', 'Assign when: 火炎・火源が明示同定される場合に付与します。', 'Do not assign when: 暖色言及のみで火対象がない場合。', 'Caution: 内容コードと彩色決定因を分離します。'].join('\n'),
  Ge: ['Definition: 地理内容(Ge)です。', 'Assign when: 地図・地形など地理対象が同定される場合に付与します。', 'Do not assign when: 地理対象なしで遠近言及のみの場合。', 'Caution: GeとV/FDを区別します。'].join('\n'),
  Hh: ['Definition: 家庭用品内容(Hh)です。', 'Assign when: 家庭内で用いる物品が同定される場合に付与します。', 'Do not assign when: より特異的内容コードが適用可能な場合。', 'Caution: 可能な限り特異コードを優先します。'].join('\n'),
  Ls: ['Definition: 風景内容(Ls)です。', 'Assign when: 自然場面レベルの風景構成が明示される場合に付与します。', 'Do not assign when: 孤立物体のみで場面構成がない場合。', 'Caution: 反射/Vista併存時は各基準を独立確認します。'].join('\n'),
  Na: ['Definition: 自然内容(Na)です。', 'Assign when: 他の具体自然コードに該当しない自然対象に付与します。', 'Do not assign when: Bt/Cl/Fi等の特異コードが適用可能な場合。', 'Caution: 可能な限り具体コードを優先します。'].join('\n'),
  Sc: ['Definition: 科学内容(Sc)です。', 'Assign when: 科学・技術対象が明示される場合に付与します。', 'Do not assign when: 比喩的専門語のみで対象同定がない場合。', 'Caution: 知識水準推定ではなく知覚対象で判定します。'].join('\n'),
  Id: ['Definition: 特異内容(Id)です。', 'Assign when: 内容は明確だが標準内容群に適合しない場合に付与します。', 'Do not assign when: 標準コードが合理的に適用可能な場合。', 'Caution: Idは最小化し標準特異コードを優先します。'].join('\n'),
};
const Z_DETAILS_EN: Record<string, string> = {
  ZW: [
    'Definition: ZW indicates organizational activity emphasizing whole-configuration structuring.',
    'Assign when: Response organization reflects whole-level synthesis pattern per Z coding rules.',
    'Do not assign when: Organization is better described by ZA/ZD/ZS criteria.',
    'Boundary: Z subtype is selected by the specific organization style observed.',
    'Caution: In this app, if DQ is v, Z coding is blocked.',
  ].join('\n'),
  ZA: [
    'Definition: ZA indicates organizational activity based on adjacent-area integration.',
    'Assign when: Percept is organized by meaningful relation of nearby blot regions.',
    'Do not assign when: Organization is whole-driven (ZW) or distant-part integration pattern fits better.',
    'Boundary: ZA is about adjacency-based structural linking.',
    'Caution: Base subtype choice on explicit response organization evidence.',
  ].join('\n'),
  ZD: [
    'Definition: ZD indicates organizational activity using distant/discrete area integration.',
    'Assign when: Non-adjacent regions are structurally linked in one organized percept.',
    'Do not assign when: Organization is adjacent (ZA) or simple whole form without such linking.',
    'Boundary: ZD captures complexity of integrating separated features.',
    'Caution: Confirm that integrated parts are perceptually specified, not inferred.',
  ].join('\n'),
  ZS: [
    'Definition: ZS indicates organizational activity involving white-space-related structuring.',
    'Assign when: White space is meaningfully incorporated into organizational construction.',
    'Do not assign when: White space is incidental and not structural.',
    'Boundary: ZS is a Z subtype, distinct from location-only S coding.',
    'Caution: Verify both organizational use and S involvement.',
  ].join('\n'),
};

const GPHR_DETAILS_EN: Record<string, string> = {
  GHR: [
    'Definition: Good Human Representation; adaptive/organized quality in human representational response.',
    'Assign when: Human content and response quality meet positive representational criteria.',
    'Do not assign when: Distortion, maladaptive interaction pattern, or poor quality indicators dominate.',
    'Boundary: GHR/PHR classification depends on representational quality, not human content alone.',
    'Caution: Evaluate with FQ, movement quality, and special scores before final class.',
  ].join('\n'),
  PHR: [
    'Definition: Poor Human Representation; maladaptive/distorted quality in human representational response.',
    'Assign when: Human representation shows significant distortion, conflictual degradation, or poor quality pattern.',
    'Do not assign when: Representation remains organized/adaptive (GHR criteria met).',
    'Boundary: PHR reflects representational quality concerns, not diagnosis by itself.',
    'Caution: Interpret only in aggregate with GHR balance and interpersonal cluster variables.',
  ].join('\n'),
};

const FQ_DETAILS_ES: Record<string, string> = {
  '+': ['Definition: Calidad formal superior (+).', 'Assign when: El ajuste de forma es inusualmente preciso y articulado.', 'Do not assign when: El ajuste es solo convencional (o) o inusual-pero-aceptable (u).', 'Boundary: + exige precision estructural alta, no solo respuesta compleja.', "App rule: Si DQ es 'v', FQ '+' se bloquea en la app."].join('\n'),
  o: ['Definition: Calidad formal ordinaria (o).', 'Assign when: La forma encaja de manera convencional y aceptable.', 'Do not assign when: Hay precision superior (+), inusual aceptable (u) o distorsion (-).', 'Boundary: o es el nivel base de ajuste formal aceptable.', 'Caution: Priorice ajuste formal, no familiaridad del contenido.'].join('\n'),
  u: ['Definition: Calidad formal inusual-pero-aceptable (u).', 'Assign when: El ajuste formal es adecuado pero la interpretacion es menos frecuente.', 'Do not assign when: El ajuste es claramente pobre (-) o claramente ordinario (o).', 'Boundary: u indica percepcion aceptable, no patologia automatica.', 'Caution: Verifique que la rareza no provenga de error de codificacion.'].join('\n'),
  '-': ['Definition: Calidad formal minus (-).', 'Assign when: La correspondencia forma-mancha es debil o distorsionada.', 'Do not assign when: El ajuste sigue siendo aceptable, aunque inusual (u).', 'Boundary: - refleja debilidad de mediacion con evidencia clara de desajuste.', 'Caution: Evite sobredimensionar por expectativa del evaluador.'].join('\n'),
  none: ['Definition: Sin codigo FQ por ausencia de base formal.', 'Assign when: La respuesta se basa en determinantes puros sin forma.', 'Do not assign when: Existe cualquier componente formal significativo.', "App rule: Se autoasigna 'none' con determinantes no formales puros.", 'Caution: Revalide seleccion de determinantes antes del cierre.'].join('\n'),
};

const FQ_DETAILS_PT: Record<string, string> = {
  '+': ['Definition: Qualidade formal superior (+).', 'Assign when: O ajuste de forma e incomumente preciso e articulado.', 'Do not assign when: O ajuste e apenas convencional (o) ou incomum-aceitavel (u).', 'Boundary: + exige alta precisao estrutural, nao apenas resposta complexa.', "App rule: Se DQ for 'v', FQ '+' fica bloqueado no app."].join('\n'),
  o: ['Definition: Qualidade formal ordinaria (o).', 'Assign when: A forma se ajusta de modo convencional e aceitavel.', 'Do not assign when: Ha precisao superior (+), incomum-aceitavel (u) ou distorcao (-).', 'Boundary: o e o nivel basico de ajuste formal aceitavel.', 'Caution: Priorize ajuste formal, nao familiaridade do conteudo.'].join('\n'),
  u: ['Definition: Qualidade formal incomum porem aceitavel (u).', 'Assign when: O ajuste formal e adequado, mas a interpretacao e menos frequente.', 'Do not assign when: O ajuste e claramente ruim (-) ou claramente ordinario (o).', 'Boundary: u indica percepcao aceitavel, nao patologia automatica.', 'Caution: Verifique se a raridade nao vem de erro de codificacao.'].join('\n'),
  '-': ['Definition: Qualidade formal minus (-).', 'Assign when: A correspondencia forma-mancha e fraca ou distorcida.', 'Do not assign when: O ajuste continua aceitavel, mesmo incomum (u).', 'Boundary: - indica fraqueza de mediacao com evidencia clara de desajuste.', 'Caution: Evite supercodificar por expectativa do avaliador.'].join('\n'),
  none: ['Definition: Sem codigo FQ por ausencia de base formal.', 'Assign when: A resposta se baseia em determinantes puros sem forma.', 'Do not assign when: Existe qualquer componente formal significativo.', "App rule: 'none' e autoatribuido em determinantes nao formais puros.", 'Caution: Revalide a selecao de determinantes antes do fechamento.'].join('\n'),
};

const FQ_DETAILS_JA: Record<string, string> = {
  '+': ['Definition: 形態質が非常に高い反応です。', 'Assign when: 斑点形態への適合が明確で精密な場合に付与します。', 'Do not assign when: 通常適合(o)や許容的な非典型(u)に留まる場合。', "App rule: DQがvの場合、FQ '+' はこのアプリで不可です。", 'Caution: 内容の印象ではなく形態適合根拠で判断します。'].join('\n'),
  o: ['Definition: 通常の形態質(o)です。', 'Assign when: 形態適合が一般的かつ許容範囲の場合に付与します。', 'Do not assign when: 精密適合(+)・非典型許容(u)・不適合(-)が優先される場合。', 'Boundary: oは標準的な適合水準です。', 'Caution: 単なる内容の馴染みやすさで判定しません。'].join('\n'),
  u: ['Definition: 非典型だが許容可能な形態質(u)です。', 'Assign when: 反応が稀でも形態適合は維持される場合に付与します。', 'Do not assign when: 明確な不適合(-)または通常適合(o)が妥当な場合。', 'Boundary: uは病理の自動指標ではありません。', 'Caution: 稀少性の理由が符号化ミスでないか確認します。'].join('\n'),
  '-': ['Definition: 形態質の不適合(-)です。', 'Assign when: 対象知覚が斑点形態と十分に対応しない場合に付与します。', 'Do not assign when: 非典型でも許容可能な適合が保たれる場合。', 'Boundary: -は媒介の弱さを示すため明確な不一致根拠が必要です。', 'Caution: 評価者期待による過剰付与を避けます。'].join('\n'),
  none: ['Definition: 形態質を付与しない状態(none)です。', 'Assign when: 純粋な非形態決定因のみで反応が成立する場合。', 'Do not assign when: 形態成分が有意に含まれる場合。', "App rule: 純非形態決定因のみならFQは自動で'none'になります。", 'Caution: 最終確定前に決定因選択を再確認します。'].join('\n'),
};

const DQ_DETAILS_ES: Record<string, string> = {
  '+': ['Definition: DQ+; organizacion sintetizada e integrada.', 'Assign when: Multiples elementos se combinan en una totalidad coherente.', 'Do not assign when: La sintesis es vaga(v/+) o no sintetizada(o).', 'Boundary: DQ+ exige integracion estructural clara, no solo longitud de respuesta.', 'Caution: Verifique sintesis perceptual, no adorno narrativo.'].join('\n'),
  o: ['Definition: DQo; organizacion ordinaria adecuada.', 'Assign when: Hay organizacion aceptable sin sintesis fuerte.', 'Do not assign when: Hay sintesis clara(+) o vaguedad(v, v/+).', 'Boundary: DQo es nivel organizativo tipico.', 'Caution: Mantenga DQ independiente del tono clinico del contenido.'].join('\n'),
  'v/+': ['Definition: DQv/+; mezcla de intento sintetico con vaguedad.', 'Assign when: Hay esfuerzo integrador pero claridad limitada.', 'Do not assign when: La sintesis es robusta(+) o ausente(v).', 'Boundary: v/+ requiere evidencia de ambos componentes.', 'Caution: Use indagacion para confirmar intento real de integracion.'].join('\n'),
  v: ['Definition: DQv; organizacion estructural vaga.', 'Assign when: La forma es imprecisa y poco organizada.', 'Do not assign when: Hay estructura ordinaria(o) o sintesis util(+/v+).', "App rule: Si DQ es v, la app bloquea FQ+ y codificacion Z.", 'Caution: No asignar DQv solo por brevedad.'].join('\n'),
};

const DQ_DETAILS_PT: Record<string, string> = {
  '+': ['Definition: DQ+; organizacao sintetizada e integrada.', 'Assign when: Multiplos elementos se combinam em um todo coerente.', 'Do not assign when: A sintese e vaga(v/+) ou nao sintetizada(o).', 'Boundary: DQ+ exige integracao estrutural clara, nao apenas resposta longa.', 'Caution: Verifique sintese perceptual, nao enfeite narrativo.'].join('\n'),
  o: ['Definition: DQo; organizacao ordinaria adequada.', 'Assign when: Ha organizacao aceitavel sem sintese forte.', 'Do not assign when: Ha sintese clara(+) ou vaguidade(v, v/+).', 'Boundary: DQo e nivel organizativo tipico.', 'Caution: Mantenha DQ independente do tom clinico do conteudo.'].join('\n'),
  'v/+': ['Definition: DQv/+; mistura de tentativa de sintese com vaguidade.', 'Assign when: Ha esforco integrador com clareza limitada.', 'Do not assign when: A sintese e robusta(+) ou ausente(v).', 'Boundary: v/+ exige evidencia de ambos os componentes.', 'Caution: Use inquerito para confirmar tentativa real de integracao.'].join('\n'),
  v: ['Definition: DQv; organizacao estrutural vaga.', 'Assign when: A forma e imprecisa e pouco organizada.', 'Do not assign when: Ha estrutura ordinaria(o) ou sintese util(+/v+).', "App rule: Se DQ for v, o app bloqueia FQ+ e codificacao Z.", 'Caution: Nao atribuir DQv apenas por brevidade.'].join('\n'),
};

const DQ_DETAILS_JA: Record<string, string> = {
  '+': ['Definition: 統合的で合成度の高い発達水準(DQ+)です。', 'Assign when: 複数要素が一貫した全体に構造化される場合に付与します。', 'Do not assign when: 統合が弱い(o)または曖昧(v/+, v)な場合。', 'Boundary: DQ+は長い反応ではなく構造統合の質で判断します。', 'Caution: 語りの装飾性ではなく知覚統合根拠で判断します。'].join('\n'),
  o: ['Definition: 標準的な発達水準(DQo)です。', 'Assign when: 適切な構造化はあるが強い統合合成までは至らない場合。', 'Do not assign when: 明確な統合(+)または曖昧(v, v/+)が示される場合。', 'Boundary: DQoは一般的な組織化水準です。', 'Caution: 内容の臨床的印象と独立して判定します。'].join('\n'),
  'v/+': ['Definition: 曖昧さと統合試行が混在する水準(DQv/+)です。', 'Assign when: 統合しようとする形跡はあるが明瞭性が不足する場合。', 'Do not assign when: 強固な統合(+)または統合不在(v)が妥当な場合。', 'Boundary: v/+は統合試行と曖昧性の両方の根拠が必要です。', 'Caution: 質問段階で統合意図の有無を確認します。'].join('\n'),
  v: ['Definition: 曖昧で未組織な発達水準(DQv)です。', 'Assign when: 形態構成が不明瞭で組織化が低い場合に付与します。', 'Do not assign when: 通常組織(o)や有効統合(+/v+)が認められる場合。', "App rule: DQがvの場合、FQ+とZ符号化はアプリ上で制限されます。", 'Caution: 反応の短さだけでDQvを付与しません。'].join('\n'),
};

const LOCATION_DETAILS_ES: Record<string, string> = {
  W: ['Definition: Ubicacion global (W).', 'Assign when: La percepcion se organiza desde toda la mancha.', 'Do not assign when: Se ancla solo en detalle comun o inusual.', 'Boundary: W refleja escaneo amplio/global.', 'Caution: Confirme uso de area total en indagacion.'].join('\n'),
  WS: ['Definition: Global + espacio blanco (WS).', 'Assign when: Se usa toda la mancha con integracion explicita de espacio blanco.', 'Do not assign when: El espacio blanco no participa estructuralmente.', 'Boundary: WS requiere participacion S explicita, a diferencia de W.', 'Caution: Verifique rol estructural real del blanco.'].join('\n'),
  D: ['Definition: Detalle comun (D).', 'Assign when: La respuesta se basa en subarea convencional.', 'Do not assign when: El area es inusual (Dd) o global (W).', 'Boundary: D refleja foco de detalle comun.', 'Caution: Diferencie D y Dd con indagacion.'].join('\n'),
  DS: ['Definition: Detalle comun + espacio blanco (DS).', 'Assign when: El detalle comun es principal y S participa en la construccion.', 'Do not assign when: El rol de S es ausente o incidental.', 'Boundary: DS = D con contribucion S requerida.', 'Caution: Confirme anclaje D y participacion S.'].join('\n'),
  Dd: ['Definition: Detalle inusual (Dd).', 'Assign when: La respuesta se ancla en zona rara/atipica.', 'Do not assign when: El area es comun (D) o global (W).', 'Boundary: Dd refleja selectividad atencional idiosincratica.', 'Caution: Interpretar frecuencia alta en contexto global.'].join('\n'),
  DdS: ['Definition: Detalle inusual + espacio blanco (DdS).', 'Assign when: Dd es principal y el blanco se integra explicitamente.', 'Do not assign when: Falta evidencia de Dd o de S.', 'Boundary: DdS combina selectividad inusual con procesamiento S.', 'Caution: Requiere evidencia clara de ambos componentes.'].join('\n'),
  S: ['Definition: Espacio blanco puro (S).', 'Assign when: El area blanca no entintada es base central del percepto.', 'Do not assign when: El blanco es solo secundario (usar WS/DS/DdS).', 'Boundary: S es codigo de localizacion, no conclusion clinica aislada.', 'Caution: Integrar con FQ y mediacion.'].join('\n'),
};

const LOCATION_DETAILS_PT: Record<string, string> = {
  W: ['Definition: Localizacao global (W).', 'Assign when: A percepcao e organizada a partir da mancha inteira.', 'Do not assign when: Fica ancorada apenas em detalhe comum ou incomum.', 'Boundary: W reflete varredura ampla/global.', 'Caution: Confirme uso de area total no inquerito.'].join('\n'),
  WS: ['Definition: Global + espaco branco (WS).', 'Assign when: Usa a mancha inteira com integracao explicita de espaco branco.', 'Do not assign when: O branco nao participa estruturalmente.', 'Boundary: WS exige participacao S explicita, diferente de W.', 'Caution: Verifique papel estrutural real do branco.'].join('\n'),
  D: ['Definition: Detalhe comum (D).', 'Assign when: A resposta se baseia em subarea convencional.', 'Do not assign when: A area e incomum (Dd) ou global (W).', 'Boundary: D reflete foco em detalhe comum.', 'Caution: Diferencie D e Dd com inquerito.'].join('\n'),
  DS: ['Definition: Detalhe comum + espaco branco (DS).', 'Assign when: O detalhe comum e principal e S participa da construcao.', 'Do not assign when: O papel de S e ausente ou incidental.', 'Boundary: DS = D com contribuicao S obrigatoria.', 'Caution: Confirme ancora D e participacao S.'].join('\n'),
  Dd: ['Definition: Detalhe incomum (Dd).', 'Assign when: A resposta se ancora em zona rara/atipica.', 'Do not assign when: A area e comum (D) ou global (W).', 'Boundary: Dd reflete seletividade atencional idiossincratica.', 'Caution: Interpretar frequencia alta no contexto global.'].join('\n'),
  DdS: ['Definition: Detalhe incomum + espaco branco (DdS).', 'Assign when: Dd e principal e o branco e integrado explicitamente.', 'Do not assign when: Falta evidencia de Dd ou de S.', 'Boundary: DdS combina seletividade incomum com processamento S.', 'Caution: Requer evidencia clara dos dois componentes.'].join('\n'),
  S: ['Definition: Espaco branco puro (S).', 'Assign when: A area branca sem tinta e base central do percepto.', 'Do not assign when: O branco e apenas secundario (usar WS/DS/DdS).', 'Boundary: S e codigo de localizacao, nao conclusao clinica isolada.', 'Caution: Integrar com FQ e mediacao.'].join('\n'),
};

const LOCATION_DETAILS_JA: Record<string, string> = {
  W: ['Definition: 全体領域(W)です。', 'Assign when: インクブロット全体を基盤に知覚構成する場合に付与します。', 'Do not assign when: 一般詳細(D)または稀詳細(Dd)のみで成立する場合。', 'Boundary: Wは広域走査と全体統合を反映します。', 'Caution: 質問段階で全体使用を確認します。'].join('\n'),
  WS: ['Definition: 全体+白地統合(WS)です。', 'Assign when: 全体知覚に白地(S)が構造的に統合される場合に付与します。', 'Do not assign when: 白地が付随的で構造寄与しない場合。', 'Boundary: WSはWに加えてSの明示寄与が必要です。', 'Caution: 白地の役割が構造的かを確認します。'].join('\n'),
  D: ['Definition: 一般詳細領域(D)です。', 'Assign when: よく用いられる標準的部分領域に基づく場合に付与します。', 'Do not assign when: 稀詳細(Dd)または全体(W)が妥当な場合。', 'Boundary: Dは典型的詳細焦点です。', 'Caution: DとDdは質問内容で区別します。'].join('\n'),
  DS: ['Definition: 一般詳細+白地(DS)です。', 'Assign when: D領域が主で白地(S)が構造に寄与する場合に付与します。', 'Do not assign when: S寄与が不明瞭または偶発的な場合。', 'Boundary: DSはD基盤にS寄与が必須です。', 'Caution: D主軸とS寄与の両方を確認します。'].join('\n'),
  Dd: ['Definition: 稀詳細領域(Dd)です。', 'Assign when: 非典型的または稀な小領域に知覚が集中する場合に付与します。', 'Do not assign when: 標準詳細(D)または全体(W)が適切な場合。', 'Boundary: Ddは選択性の高い注意焦点を示します。', 'Caution: 単独で病理結論を出さず全体頻度で解釈します。'].join('\n'),
  DdS: ['Definition: 稀詳細+白地(DdS)です。', 'Assign when: Ddが主で白地(S)が明示統合される場合に付与します。', 'Do not assign when: DdまたはSのどちらかの根拠が不足する場合。', 'Boundary: DdSは稀詳細選択性とS統合の複合です。', 'Caution: 両要件を逐語的に確認します。'].join('\n'),
  S: ['Definition: 純白地領域(S)です。', 'Assign when: 無彩色白地が中心的知覚基盤になる場合に付与します。', 'Do not assign when: 白地が二次的でWS/DS/DdSが妥当な場合。', 'Boundary: Sは位置コードであり単独で臨床結論を意味しません。', 'Caution: FQと媒介指標と併せて解釈します。'].join('\n'),
};

const Z_DETAILS_ES: Record<string, string> = {
  ZW: ['Definition: ZW; actividad organizativa centrada en configuracion global.', 'Assign when: La organizacion responde al patron de sintesis global.', 'Do not assign when: ZA/ZD/ZS describen mejor la organizacion.', 'Boundary: El subtipo Z se decide por estilo organizativo observado.', 'Caution: Si DQ es v, la app bloquea codificacion Z.'].join('\n'),
  ZA: ['Definition: ZA; organizacion por integracion de areas adyacentes.', 'Assign when: La percepcion se organiza por relacion significativa de zonas cercanas.', 'Do not assign when: Predomina organizacion global (ZW) o de partes distantes (ZD).', 'Boundary: ZA se define por enlace estructural de adyacencia.', 'Caution: Base la decision en evidencia explicita de organizacion.'].join('\n'),
  ZD: ['Definition: ZD; organizacion por integracion de areas distantes/discretas.', 'Assign when: Regiones no adyacentes se integran en un percepto unico.', 'Do not assign when: Corresponde mejor a ZA o a configuracion global simple.', 'Boundary: ZD refleja complejidad de integrar partes separadas.', 'Caution: Verifique partes integradas explicitamente indicadas.'].join('\n'),
  ZS: ['Definition: ZS; organizacion con participacion de espacio blanco.', 'Assign when: El espacio blanco se incorpora de manera estructural al organizador.', 'Do not assign when: El blanco es incidental y no estructural.', 'Boundary: ZS es subtipo Z distinto de la localizacion S.', 'Caution: Confirmar uso organizativo y participacion S.'].join('\n'),
};

const Z_DETAILS_PT: Record<string, string> = {
  ZW: ['Definition: ZW; atividade organizacional centrada na configuracao global.', 'Assign when: A organizacao segue padrao de sintese global.', 'Do not assign when: ZA/ZD/ZS descrevem melhor a organizacao.', 'Boundary: O subtipo Z e definido pelo estilo organizativo observado.', 'Caution: Se DQ for v, o app bloqueia codificacao Z.'].join('\n'),
  ZA: ['Definition: ZA; organizacao por integracao de areas adjacentes.', 'Assign when: A percepcao se organiza por relacao significativa de areas proximas.', 'Do not assign when: Predomina organizacao global (ZW) ou de partes distantes (ZD).', 'Boundary: ZA se define por vinculacao estrutural de adjacencia.', 'Caution: Baseie a decisao em evidencia explicita de organizacao.'].join('\n'),
  ZD: ['Definition: ZD; organizacao por integracao de areas distantes/discretas.', 'Assign when: Regioes nao adjacentes sao integradas em um percepto unico.', 'Do not assign when: Corresponde melhor a ZA ou configuracao global simples.', 'Boundary: ZD reflete complexidade de integrar partes separadas.', 'Caution: Verifique se as partes integradas foram explicitadas.'].join('\n'),
  ZS: ['Definition: ZS; organizacao com participacao de espaco branco.', 'Assign when: O branco e incorporado estruturalmente ao organizador.', 'Do not assign when: O branco e incidental e nao estrutural.', 'Boundary: ZS e subtipo Z distinto da localizacao S.', 'Caution: Confirmar uso organizativo e participacao S.'].join('\n'),
};

const Z_DETAILS_JA: Record<string, string> = {
  ZW: ['Definition: 全体構成型の組織化活動(ZW)です。', 'Assign when: 知覚構成が全体統合パターンで成立する場合に付与します。', 'Do not assign when: 隣接統合(ZA)や遠隔統合(ZD)等がより適切な場合。', 'Boundary: Z下位型は観察された組織化様式で決定します。', 'Caution: DQがvの場合、アプリではZ符号化が制限されます。'].join('\n'),
  ZA: ['Definition: 隣接領域統合型の組織化活動(ZA)です。', 'Assign when: 近接領域間の意味的連結で知覚が構成される場合に付与します。', 'Do not assign when: 全体主導(ZW)または遠隔統合(ZD)が妥当な場合。', 'Boundary: ZAは隣接連結の構造性が要点です。', 'Caution: 組織化根拠を逐語的に確認します。'].join('\n'),
  ZD: ['Definition: 遠隔・離散領域統合型の組織化活動(ZD)です。', 'Assign when: 非隣接領域を一つの知覚へ統合する場合に付与します。', 'Do not assign when: 隣接統合(ZA)または単純全体構成が適切な場合。', 'Boundary: ZDは分離特徴の統合複雑性を反映します。', 'Caution: 統合された各部分が反応内で明示されているか確認します。'].join('\n'),
  ZS: ['Definition: 白地関与型の組織化活動(ZS)です。', 'Assign when: 白地が組織化構成に意味的に利用される場合に付与します。', 'Do not assign when: 白地が偶発的で構造的役割を持たない場合。', 'Boundary: ZSは位置Sとは別のZ下位型です。', 'Caution: 組織化利用とS関与の両方を確認します。'].join('\n'),
};

const GPHR_DETAILS_ES: Record<string, string> = {
  GHR: ['Definition: Buena representacion humana (GHR).', 'Assign when: El contenido humano y la calidad de respuesta cumplen criterios adaptativos.', 'Do not assign when: Predominan distorsion o indicadores de calidad pobre.', 'Boundary: GHR/PHR depende de calidad representacional, no solo de contenido humano.', 'Caution: Integrar con FQ, calidad de movimiento y puntajes especiales.'].join('\n'),
  PHR: ['Definition: Representacion humana pobre (PHR).', 'Assign when: La representacion humana muestra distorsion significativa o patron desadaptativo.', 'Do not assign when: La representacion se mantiene organizada/adaptativa (GHR).', 'Boundary: PHR expresa problema de calidad representacional, no diagnostico por si solo.', 'Caution: Interpretar en conjunto con balance GHR y variables interpersonales.'].join('\n'),
};

const GPHR_DETAILS_PT: Record<string, string> = {
  GHR: ['Definition: Boa representacao humana (GHR).', 'Assign when: Conteudo humano e qualidade da resposta cumprem criterios adaptativos.', 'Do not assign when: Predominam distorcao ou indicadores de baixa qualidade.', 'Boundary: GHR/PHR depende da qualidade representacional, nao apenas de conteudo humano.', 'Caution: Integrar com FQ, qualidade de movimento e escores especiais.'].join('\n'),
  PHR: ['Definition: Representacao humana pobre (PHR).', 'Assign when: A representacao humana mostra distorcao relevante ou padrao desadaptativo.', 'Do not assign when: A representacao permanece organizada/adaptativa (GHR).', 'Boundary: PHR indica problema de qualidade representacional, nao diagnostico isolado.', 'Caution: Interpretar com balanceamento GHR e variaveis interpessoais.'].join('\n'),
};

const GPHR_DETAILS_JA: Record<string, string> = {
  GHR: ['Definition: 良好な人間表象(GHR)です。', 'Assign when: 人間内容と反応の質が適応的・組織的基準を満たす場合に付与します。', 'Do not assign when: 歪みや不適応的表象が優勢な場合。', 'Boundary: GHR/PHRは人間内容の有無だけでなく表象の質で判定します。', 'Caution: FQ・運動質・特殊得点と統合して最終判定します。'].join('\n'),
  PHR: ['Definition: 不良な人間表象(PHR)です。', 'Assign when: 人間表象に顕著な歪みや不適応的質が示される場合に付与します。', 'Do not assign when: 組織的で適応的な表象(GHR)が成立する場合。', 'Boundary: PHRは表象質の問題指標であり単独診断指標ではありません。', 'Caution: GHRとのバランスと対人クラスターで解釈します。'].join('\n'),
};

const DETERMINANT_DETAILS_ES: Record<string, string> = {
  M: ['Definition: Movimiento humano (M).', 'Assign when: La accion percibida es intencionalmente humana.', 'Do not assign when: Predomina movimiento animal (FM) o inanimado (m).', 'Boundary: M/FM/m se distingue por clase de movimiento.', 'Caution: Anclar en lenguaje explicito de respuesta/inquiry.'].join('\n'),
  FM: ['Definition: Movimiento animal (FM).', 'Assign when: El movimiento corresponde a conducta tipica de animal.', 'Do not assign when: La agencia principal es humana (M) o inanimada (m).', 'Boundary: FM codifica clase de movimiento, no valencia afectiva.', 'Caution: Verificar sujeto de la accion, no solo verbo de movimiento.'].join('\n'),
  m: ['Definition: Movimiento inanimado (m).', 'Assign when: El movimiento se atribuye a objeto/fuerza/fenomeno no vivo.', 'Do not assign when: Predomina agencia humana (M) o animal (FM).', 'Boundary: m refleja cualidad de presion/fuerza externa.', 'Caution: Exigir percepcion de movimiento explicitada.'].join('\n'),
  FC: ['Definition: Forma-Color (FC).', 'Assign when: La forma organiza y el color cromatico modula secundariamente.', 'Do not assign when: El color es primario (CF/C).', 'Boundary: FC suele implicar mayor modulacion que CF/C.', 'Caution: Determine prioridad por inquiry, no por preferencia del evaluador.'].join('\n'),
  CF: ['Definition: Color-Forma (CF).', 'Assign when: El color cromatico es primario y la forma secundaria.', 'Do not assign when: La forma es primaria (FC) o esta ausente (C).', 'Boundary: CF es intermedio entre FC y C en control formal.', 'Caution: No codificar CF por mera mencion de color.'].join('\n'),
  C: ['Definition: Color cromatico puro (C).', 'Assign when: La respuesta se sostiene en color sin base formal utilizable.', 'Do not assign when: Existe organizacion formal significativa (FC/CF).', "App rule: Determinantes puros no formales fuerzan FQ 'none'.", 'Caution: Diferencie adjetivo de color de percepto por color.'].join('\n'),
  "C'": ['Definition: Color acromatico puro (C\').', 'Assign when: Predomina tono negro/gris sin soporte formal.', "Do not assign when: Hay forma relevante (FC'/C'F).", "Boundary: C' es distinto de V/Y/T por tipo de sombreado.", 'Caution: Verificar que no sea profundidad (V) o textura (T).'].join('\n'),
  T: ['Definition: Textura pura (T).', 'Assign when: La cualidad textural se percibe sin soporte formal.', 'Do not assign when: La forma participa de modo significativo (FT/TF).', "App rule: T puro se codifica con FQ 'none' en esta app.", 'Caution: Codigo infrecuente; confirmar con inquiry.'].join('\n'),
  V: ['Definition: Vista pura (V).', 'Assign when: La profundidad/perspectiva se percibe sin soporte formal.', 'Do not assign when: La forma contribuye (FV/VF).', "App rule: V puro activa FQ 'none'.", 'Caution: Requiere evidencia explicita de base dimensional por sombreado.'].join('\n'),
  Y: ['Definition: Sombreado difuso puro (Y).', 'Assign when: La cualidad difusa se usa sin organizacion formal.', 'Do not assign when: Hay participacion formal significativa (FY/YF).', "App rule: Y puro activa FQ 'none'.", 'Caution: Distinguir de C\' y T.'].join('\n'),
  Fr: ['Definition: Forma-Reflejo (Fr).', 'Assign when: Hay objeto definido y concepto de reflejo como componente secundario.', 'Do not assign when: El reflejo es primario con forma vaga (rF).', "App rule: Fr/rF excluye pair '(2)' en la misma respuesta.", 'Caution: Exigir concepto explicito de reflejo.'].join('\n'),
  rF: ['Definition: Reflejo-Forma (rF).', 'Assign when: El concepto de reflejo/simetria es primario y la forma es secundaria.', 'Do not assign when: La identificacion formal es primaria (Fr).', "App rule: Fr/rF excluye pair '(2)'.", 'Caution: No confundir con respuesta de par generica.'].join('\n'),
  FD: ['Definition: Dimension por forma (FD).', 'Assign when: La profundidad se construye por perspectiva formal (no por sombreado).', 'Do not assign when: La profundidad depende de sombreado (V/FV/VF).', 'Boundary: FD = perspectiva formal; V-familia = perspectiva por sombreado.', 'Caution: Confirmar base dimensional en inquiry.'].join('\n'),
  F: ['Definition: Forma pura (F).', 'Assign when: La organizacion perceptual depende solo de forma.', 'Do not assign when: Movimiento/color/sombreado/reflectancia contribuyen significativamente.', 'Boundary: F es base de respuestas forma-dominantes.', 'Caution: No simplificar respuestas mixtas a F por inercia.'].join('\n'),
};

const DETERMINANT_DETAILS_PT: Record<string, string> = {
  M: ['Definition: Movimento humano (M).', 'Assign when: A acao percebida e intencionalmente humana.', 'Do not assign when: Predomina movimento animal (FM) ou inanimado (m).', 'Boundary: M/FM/m se distingue por classe de movimento.', 'Caution: Ancorar em linguagem explicita de resposta/inquerito.'].join('\n'),
  FM: ['Definition: Movimento animal (FM).', 'Assign when: O movimento corresponde a conduta tipica de animal.', 'Do not assign when: A agencia principal e humana (M) ou inanimada (m).', 'Boundary: FM codifica classe de movimento, nao valencia afetiva.', 'Caution: Verificar sujeito da acao, nao apenas verbo.'].join('\n'),
  m: ['Definition: Movimento inanimado (m).', 'Assign when: O movimento e atribuido a objeto/forca/fenomeno nao vivo.', 'Do not assign when: Predomina agencia humana (M) ou animal (FM).', 'Boundary: m reflete qualidade de pressao/forca externa.', 'Caution: Exigir percepcao de movimento explicitada.'].join('\n'),
  FC: ['Definition: Forma-Cor (FC).', 'Assign when: A forma organiza e a cor cromatica modula secundariamente.', 'Do not assign when: A cor e primaria (CF/C).', 'Boundary: FC tende a indicar maior modulacao que CF/C.', 'Caution: Definir prioridade via inquerito, nao por preferencia do avaliador.'].join('\n'),
  CF: ['Definition: Cor-Forma (CF).', 'Assign when: A cor cromatica e primaria e a forma secundaria.', 'Do not assign when: A forma e primaria (FC) ou ausente (C).', 'Boundary: CF e intermediario entre FC e C em controle formal.', 'Caution: Nao codificar CF por mera mencao de cor.'].join('\n'),
  C: ['Definition: Cor cromatica pura (C).', 'Assign when: A resposta se sustenta na cor sem base formal utilizavel.', 'Do not assign when: Existe organizacao formal significativa (FC/CF).', "App rule: Determinantes puros nao formais forcam FQ 'none'.", 'Caution: Diferenciar adjetivo de cor de percepto baseado em cor.'].join('\n'),
  "C'": ['Definition: Cor acromatica pura (C\').', 'Assign when: Predomina tonalidade preta/cinza sem suporte formal.', "Do not assign when: Ha forma relevante (FC'/C'F).", "Boundary: C' difere de V/Y/T pelo tipo de sombreado.", 'Caution: Verificar se nao e profundidade (V) ou textura (T).'].join('\n'),
  T: ['Definition: Textura pura (T).', 'Assign when: A qualidade textural e percebida sem suporte formal.', 'Do not assign when: A forma participa de modo significativo (FT/TF).', "App rule: T puro recebe FQ 'none' no app.", 'Caution: Codigo raro; confirmar no inquerito.'].join('\n'),
  V: ['Definition: Vista pura (V).', 'Assign when: Profundidade/perspectiva e percebida sem suporte formal.', 'Do not assign when: A forma contribui (FV/VF).', "App rule: V puro ativa FQ 'none'.", 'Caution: Exige evidencia explicita de dimensionalidade por sombreado.'].join('\n'),
  Y: ['Definition: Sombreado difuso puro (Y).', 'Assign when: Qualidade difusa e usada sem organizacao formal.', 'Do not assign when: Ha participacao formal significativa (FY/YF).', "App rule: Y puro ativa FQ 'none'.", 'Caution: Distinguir de C\' e T.'].join('\n'),
  Fr: ['Definition: Forma-Reflexo (Fr).', 'Assign when: Ha objeto definido e conceito de reflexo como componente secundario.', 'Do not assign when: O reflexo e primario com forma vaga (rF).', "App rule: Fr/rF exclui pair '(2)' na mesma resposta.", 'Caution: Exigir conceito explicito de reflexo.'].join('\n'),
  rF: ['Definition: Reflexo-Forma (rF).', 'Assign when: Conceito de reflexo/simetria e primario e forma secundaria.', 'Do not assign when: A identificacao formal e primaria (Fr).', "App rule: Fr/rF exclui pair '(2)'.", 'Caution: Nao confundir com resposta de par generica.'].join('\n'),
  FD: ['Definition: Dimensao por forma (FD).', 'Assign when: A profundidade e construida por perspectiva formal (nao por sombreado).', 'Do not assign when: A profundidade depende de sombreado (V/FV/VF).', 'Boundary: FD = perspectiva formal; familia V = perspectiva por sombreado.', 'Caution: Confirmar base dimensional no inquerito.'].join('\n'),
  F: ['Definition: Forma pura (F).', 'Assign when: A organizacao perceptual depende apenas da forma.', 'Do not assign when: Movimento/cor/sombreado/reflectancia contribuem significativamente.', 'Boundary: F e base de respostas forma-dominantes.', 'Caution: Nao reduzir respostas mistas a F por inercia.'].join('\n'),
};

const DETERMINANT_DETAILS_JA: Record<string, string> = {
  M: ['Definition: 人間運動決定因(M)です。', 'Assign when: 意図性をもつ人間的行為が知覚される場合に付与します。', 'Do not assign when: 動物運動(FM)または無生物運動(m)が主である場合。', 'Boundary: M/FM/mの区別は運動クラスで行います。', 'Caution: 反応・質問段階の逐語運動表現を根拠にします。'].join('\n'),
  FM: ['Definition: 動物運動決定因(FM)です。', 'Assign when: 動物種に典型的な運動が知覚される場合に付与します。', 'Do not assign when: 人間意図運動(M)または無生物運動(m)が妥当な場合。', 'Boundary: FMは運動クラス指標で情動価指標ではありません。', 'Caution: 行為主体を明確に同定します。'].join('\n'),
  m: ['Definition: 無生物運動決定因(m)です。', 'Assign when: 力・圧・落下・漂流など無生物的運動が知覚される場合に付与します。', 'Do not assign when: 人間運動(M)または動物運動(FM)が主である場合。', 'Boundary: mは外的力学感の知覚を反映します。', 'Caution: 暗示ではなく運動知覚の明示を要件とします。'].join('\n'),
  FC: ['Definition: 形態-色彩(FC)です。', 'Assign when: 形態が主で色彩が副次的に寄与する場合に付与します。', 'Do not assign when: 色彩主導(CF/C)である場合。', 'Boundary: FCはCF/Cより高い統制を示すことが多いです。', 'Caution: 優先判定は質問段階の知覚順序に基づきます。'].join('\n'),
  CF: ['Definition: 色彩-形態(CF)です。', 'Assign when: 色彩が主で形態が副次的に寄与する場合に付与します。', 'Do not assign when: 形態主導(FC)または形態不在(C)である場合。', 'Boundary: CFはFCとCの中間統制水準です。', 'Caution: 色語の出現だけでCFを付与しません。'].join('\n'),
  C: ['Definition: 純色彩決定因(C)です。', 'Assign when: 形態基盤なしで色彩体験が反応を主導する場合に付与します。', 'Do not assign when: 有意な形態組織が存在する場合。', "App rule: 純非形態決定因ではFQは自動的に'none'となります。", 'Caution: 色形容詞と色彩知覚主導を区別します。'].join('\n'),
  Cn: ['Definition: 色名反応(Cn)です。', 'Assign when: 対象知覚よりも色名の命名が中心である場合に付与します。', 'Do not assign when: 形態や対象同定が成立している場合。', "App rule: Cnは非形態反応としてFQが'none'になります。", 'Caution: 単なる色形容詞と区別して命名反応か確認します。'].join('\n'),
  "FC'": ['Definition: 形態-無彩色(FC\')です。', 'Assign when: 形態が主で無彩色陰影が副次的に寄与する場合に付与します。', "Do not assign when: 無彩色が主導する(C'F/C')場合。", "Boundary: FC'とC'Fは知覚優先順位で区別します。", 'Caution: 色彩系(FC/CF/C)と混同しないようにします。'].join('\n'),
  "C'F": ['Definition: 無彩色-形態(C\'F)です。', 'Assign when: 無彩色陰影が主で形態が副次的に寄与する場合に付与します。', "Do not assign when: 形態主導(FC')または形態不在(C')の場合。", "Boundary: C'FはFC'より形態統制が弱い水準です。", 'Caution: 質問段階で優先知覚を確認します。'].join('\n'),
  "C'": ['Definition: 純無彩色決定因(C\')です。', 'Assign when: 黒灰の色調印象が形態基盤なしで主導する場合に付与します。', "Do not assign when: 形態寄与(FC'/C'F)がある場合。", 'Boundary: C\'はV/Y/Tとは陰影機能が異なります。', 'Caution: 奥行き(V)や質感(T)との混同を避けます。'].join('\n'),
  FT: ['Definition: 形態-質感(FT)です。', 'Assign when: 形態が主で質感陰影が副次的に寄与する場合に付与します。', 'Do not assign when: 質感主導(TF/T)が妥当な場合。', 'Boundary: FTとTFは優先決定因で区別します。', 'Caution: 質感語の出現のみで自動付与しません。'].join('\n'),
  TF: ['Definition: 質感-形態(TF)です。', 'Assign when: 質感が主で形態が副次的に寄与する場合に付与します。', 'Do not assign when: 形態主導(FT)または形態不在(T)の場合。', 'Boundary: TFはFTより形態統制が弱い構造です。', 'Caution: 知覚順序を質問段階で確認します。'].join('\n'),
  T: ['Definition: 純質感決定因(T)です。', 'Assign when: 質感が形態基盤なしで直接知覚される場合に付与します。', 'Do not assign when: 形態寄与(FT/TF)が有意な場合。', "App rule: T単独ではFQは'none'になります。", 'Caution: まれなため質問段階で根拠確認を行います。'].join('\n'),
  FV: ['Definition: 形態-Vista(FV)です。', 'Assign when: 形態が主で陰影由来の奥行きが副次的に寄与する場合に付与します。', 'Do not assign when: 奥行き主導(VF/V)が妥当な場合。', 'Boundary: FVとVFは優先知覚で区別します。', 'Caution: 奥行き語のみで付与せず陰影基盤を確認します。'].join('\n'),
  VF: ['Definition: Vista-形態(VF)です。', 'Assign when: 陰影奥行きが主で形態が副次的に寄与する場合に付与します。', 'Do not assign when: 形態主導(FV)または形態不在(V)の場合。', 'Boundary: VFはFVより形態特定性が低い傾向です。', 'Caution: 情緒語ではなく次元構成根拠で判定します。'].join('\n'),
  V: ['Definition: 純Vista決定因(V)です。', 'Assign when: 陰影由来の奥行きが形態基盤なしで知覚される場合に付与します。', 'Do not assign when: 形態寄与(FV/VF)がある場合。', "App rule: V単独ではFQは'none'になります。", 'Caution: 次元感の陰影根拠を明示確認します。'].join('\n'),
  FY: ['Definition: 形態-拡散陰影(FY)です。', 'Assign when: 形態が主で拡散陰影が副次的に寄与する場合に付与します。', 'Do not assign when: 拡散陰影主導(YF/Y)が妥当な場合。', 'Boundary: FYとYFは優先決定因で区別します。', 'Caution: 無彩色決定因との混同を避けます。'].join('\n'),
  YF: ['Definition: 拡散陰影-形態(YF)です。', 'Assign when: 拡散陰影が主で形態が副次的に寄与する場合に付与します。', 'Do not assign when: 形態主導(FY)または形態不在(Y)の場合。', 'Boundary: YFはFYより形態統制が弱い水準です。', 'Caution: 優先判断は質問段階の記述順に基づきます。'].join('\n'),
  Y: ['Definition: 純拡散陰影決定因(Y)です。', 'Assign when: 拡散的陰影が形態基盤なしで知覚される場合に付与します。', 'Do not assign when: 形態寄与(FY/YF)がある場合。', "App rule: Y単独ではFQは'none'になります。", 'Caution: C\'やTとの鑑別を行います。'].join('\n'),
  Fr: ['Definition: 形態-反射(Fr)です。', 'Assign when: 明確な対象形態に反射概念が副次的に加わる場合に付与します。', 'Do not assign when: 反射概念が主で形態が曖昧な場合(rF)。', "App rule: Fr/rFが選択されるとpair '(2)'は同反応で排他です。", 'Caution: 単なる二対象反応と反射概念を区別します。'].join('\n'),
  rF: ['Definition: 反射-形態(rF)です。', 'Assign when: 反射・対称概念が主で形態同定が副次的な場合に付与します。', 'Do not assign when: 形態同定が主のFrが妥当な場合。', "App rule: Fr/rFはpair '(2)'と排他です。", 'Caution: 汎用ペア反応との混同を避けます。'].join('\n'),
  FD: ['Definition: 形態次元決定因(FD)です。', 'Assign when: 陰影ではなく形態遠近法で奥行きが構成される場合に付与します。', 'Do not assign when: 陰影次元(V/FV/VF)が基盤の場合。', 'Boundary: FDは形態遠近、V系は陰影遠近です。', 'Caution: 次元根拠を質問段階で確定します。'].join('\n'),
  F: ['Definition: 純形態決定因(F)です。', 'Assign when: 反応が形態のみで組織される場合に付与します。', 'Do not assign when: 運動・色彩・陰影・反射などが有意に寄与する場合。', 'Boundary: Fは形態優位反応の基準決定因です。', 'Caution: 混合反応を慣性でFへ単純化しません。'].join('\n'),
};

const LOCATION_DETAILS_KO: Record<string, string> = {
  W: [
    'Definition: 전체 위치(W)입니다.',
    'Assign when: 반응이 반점 전체 구성을 기반으로 형성될 때 부여합니다.',
    'Do not assign when: 특정 상세 영역(D/Dd)만이 근거일 때.',
    'Boundary: W는 광범위한 탐색과 전체 통합을 반영합니다.',
    'Caution: 추정이 아니라 탐문에서 전체 사용 근거를 확인합니다.',
  ].join('\n'),
  WS: [
    'Definition: 전체+백색공간 위치(WS)입니다.',
    'Assign when: 전체 반점이 주축이며 백색공간(S)이 구조적으로 통합될 때 부여합니다.',
    'Do not assign when: S가 부차적 언급에 그칠 때.',
    'Boundary: WS는 W와 달리 S의 명시적 기여가 필요합니다.',
    'Caution: 백색공간이 실제 지각 구조에 쓰였는지 확인합니다.',
  ].join('\n'),
  D: [
    'Definition: 보통 상세 위치(D)입니다.',
    'Assign when: 반응이 관습적으로 자주 쓰이는 상세 영역에 근거할 때 부여합니다.',
    'Do not assign when: 드문 상세(Dd) 또는 전체(W)가 더 타당할 때.',
    'Boundary: D는 전형적 상세 초점을 의미합니다.',
    'Caution: D와 Dd를 탐문으로 구분합니다.',
  ].join('\n'),
  DS: [
    'Definition: 보통 상세+백색공간 위치(DS)입니다.',
    'Assign when: D 영역이 주가 되고 S가 구조적으로 결합될 때 부여합니다.',
    'Do not assign when: S의 역할이 불명확하거나 우연적일 때.',
    'Boundary: DS는 D에 S 기여가 필수입니다.',
    'Caution: D 앵커와 S 관여를 모두 확인합니다.',
  ].join('\n'),
  Dd: [
    'Definition: 드문 상세 위치(Dd)입니다.',
    'Assign when: 반응이 비전형적/희귀한 하위 영역에 근거할 때 부여합니다.',
    'Do not assign when: 일반 상세(D) 또는 전체(W)가 타당할 때.',
    'Boundary: Dd는 선택적·특이적 주의 초점을 반영합니다.',
    'Caution: 높은 Dd 빈도는 전체 프로토콜 문맥에서 해석합니다.',
  ].join('\n'),
  DdS: [
    'Definition: 드문 상세+백색공간 위치(DdS)입니다.',
    'Assign when: Dd가 주축이고 S가 명시적으로 통합될 때 부여합니다.',
    'Do not assign when: Dd 또는 S 중 하나의 근거가 부족할 때.',
    'Boundary: DdS는 특이 선택성과 S 처리의 결합 코드입니다.',
    'Caution: 두 요소 모두 탐문 근거를 요구합니다.',
  ].join('\n'),
  S: [
    'Definition: 순수 백색공간 위치(S)입니다.',
    'Assign when: 무채색 백색 영역이 지각의 중심 기반일 때 부여합니다.',
    'Do not assign when: 백색공간이 보조적이며 WS/DS/DdS가 더 적합할 때.',
    'Boundary: S는 위치 코드이며 단독으로 과잉 해석하지 않습니다.',
    'Caution: FQ 및 중재 지표와 함께 통합 해석합니다.',
  ].join('\n'),
};

const Z_DETAILS_KO: Record<string, string> = {
  ZW: [
    'Definition: 전체 구성 중심의 조직화 활동(ZW)입니다.',
    'Assign when: 반응 조직화가 전체 수준 합성 패턴을 보일 때 부여합니다.',
    'Do not assign when: ZA/ZD/ZS가 조직화 양식을 더 잘 설명할 때.',
    'Boundary: Z 하위유형은 관찰된 조직화 방식으로 결정합니다.',
    "Caution: 이 앱에서 DQ가 v이면 Z 코딩은 제한됩니다.",
  ].join('\n'),
  ZA: [
    'Definition: 인접 영역 통합형 조직화 활동(ZA)입니다.',
    'Assign when: 가까운 반점 영역 간 의미 연결로 지각이 구성될 때 부여합니다.',
    'Do not assign when: 전체 주도(ZW) 또는 원거리 통합(ZD)이 더 적절할 때.',
    'Boundary: ZA는 인접성 기반 구조 연결이 핵심입니다.',
    'Caution: 조직화 근거를 반응/탐문에서 명시 확인합니다.',
  ].join('\n'),
  ZD: [
    'Definition: 원거리/분리 영역 통합형 조직화 활동(ZD)입니다.',
    'Assign when: 비인접 영역을 하나의 지각으로 구조 통합할 때 부여합니다.',
    'Do not assign when: 인접 통합(ZA)이나 단순 전체 구성(ZW)이 타당할 때.',
    'Boundary: ZD는 분리 특징 통합의 복잡성을 반영합니다.',
    'Caution: 통합된 부분이 실제로 명시되었는지 확인합니다.',
  ].join('\n'),
  ZS: [
    'Definition: 백색공간 관여형 조직화 활동(ZS)입니다.',
    'Assign when: 백색공간이 조직화 구성에 의미 있게 포함될 때 부여합니다.',
    'Do not assign when: 백색공간이 우연적으로만 언급될 때.',
    'Boundary: ZS는 위치 S와 구분되는 Z 하위유형입니다.',
    'Caution: 조직화 사용과 S 관여를 함께 확인합니다.',
  ].join('\n'),
};

const GPHR_DETAILS_KO: Record<string, string> = {
  GHR: [
    'Definition: 적응적인 인간표상(GHR)입니다.',
    'Assign when: 인간 내용과 반응 질이 긍정적 표상 기준을 충족할 때 부여합니다.',
    'Do not assign when: 왜곡·부적응 상호작용·저질 표상 징후가 우세할 때.',
    'Boundary: GHR/PHR는 인간 내용 자체가 아니라 표상 질로 구분합니다.',
    'Caution: FQ, 운동 질, 특수점수와 함께 최종 분류합니다.',
  ].join('\n'),
  PHR: [
    'Definition: 부적응적 인간표상(PHR)입니다.',
    'Assign when: 인간표상이 유의미한 왜곡 또는 갈등적 저질 패턴을 보일 때 부여합니다.',
    'Do not assign when: 조직적·적응적 표상(GHR) 기준이 충족될 때.',
    'Boundary: PHR는 표상 질 저하 지표이지 단독 진단 지표가 아닙니다.',
    'Caution: GHR 균형과 대인관계 클러스터 변수와 통합 해석합니다.',
  ].join('\n'),
};

const DETERMINANT_DETAILS_KO: Record<string, string> = {
  M: ['Definition: 인간운동 결정인(M)입니다.', 'Assign when: 의도성을 가진 인간적 행위가 지각될 때 부여합니다.', 'Do not assign when: 동물운동(FM) 또는 무생물운동(m)이 주된 경우.', 'Boundary: M/FM/m 구분은 움직임의 종류로 판단합니다.', 'Caution: 반응 및 탐문에서 명시된 운동 언어를 근거로 코딩합니다.'].join('\n'),
  FM: ['Definition: 동물운동 결정인(FM)입니다.', 'Assign when: 동물 종 특성에 맞는 움직임이 지각될 때 부여합니다.', 'Do not assign when: 인간 의도운동(M) 또는 무생물운동(m)이 타당한 경우.', 'Boundary: FM은 운동 분류 코드이며 정서가 코드가 아닙니다.', 'Caution: 동작 주체를 명확히 확인합니다.'].join('\n'),
  m: ['Definition: 무생물운동 결정인(m)입니다.', 'Assign when: 압력·당김·낙하·표류 등 비생물적 움직임이 지각될 때 부여합니다.', 'Do not assign when: 인간운동(M) 또는 동물운동(FM)이 주된 경우.', 'Boundary: m은 외적 힘/압박의 지각 특성을 반영합니다.', 'Caution: 암시가 아닌 실제 운동 지각의 명시가 필요합니다.'].join('\n'),
  FC: ['Definition: 형태-색채(FC)입니다.', 'Assign when: 형태가 주이고 색채가 부차적으로 기여할 때 부여합니다.', 'Do not assign when: 색채가 주도적(CF/C)인 경우.', 'Boundary: FC는 일반적으로 CF/C보다 더 높은 통제를 시사합니다.', 'Caution: 우선순위는 탐문에서의 지각 순서로 판단합니다.'].join('\n'),
  CF: ['Definition: 색채-형태(CF)입니다.', 'Assign when: 색채가 주이고 형태가 부차적으로 기여할 때 부여합니다.', 'Do not assign when: 형태가 주도적(FC) 또는 형태 부재(C)인 경우.', 'Boundary: CF는 FC와 C 사이의 통제 수준입니다.', 'Caution: 색 단어 언급만으로 CF를 부여하지 않습니다.'].join('\n'),
  C: ['Definition: 순수 색채 결정인(C)입니다.', 'Assign when: 형태 근거 없이 색채 경험이 반응을 주도할 때 부여합니다.', 'Do not assign when: 유의미한 형태 조직이 존재할 때.', "App rule: 순수 비형태 결정인에서는 FQ가 자동으로 'none' 처리됩니다.", 'Caution: 색 형용사 언급과 색채 주도 지각을 구분합니다.'].join('\n'),
  "C'": ['Definition: 순수 무채색 결정인(C\')입니다.', 'Assign when: 흑백/회색 톤 인상이 형태 근거 없이 주도할 때 부여합니다.', "Do not assign when: 형태 기여(FC'/C'F)가 있는 경우.", 'Boundary: C\'는 V/Y/T와 음영 기능이 다릅니다.', 'Caution: 깊이(V)나 질감(T)과 혼동하지 않습니다.'].join('\n'),
  T: ['Definition: 순수 질감 결정인(T)입니다.', 'Assign when: 질감이 형태 근거 없이 직접 지각될 때 부여합니다.', 'Do not assign when: 형태 기여(FT/TF)가 유의미한 경우.', "App rule: T 단독이면 FQ는 'none'이 됩니다.", 'Caution: 드문 코드이므로 탐문 근거를 재확인합니다.'].join('\n'),
  V: ['Definition: 순수 Vista 결정인(V)입니다.', 'Assign when: 음영 기반 깊이/원근이 형태 근거 없이 지각될 때 부여합니다.', 'Do not assign when: 형태 기여(FV/VF)가 있는 경우.', "App rule: V 단독이면 FQ는 'none'이 됩니다.", 'Caution: 차원감의 음영 근거를 명시적으로 확인합니다.'].join('\n'),
  Y: ['Definition: 순수 확산음영 결정인(Y)입니다.', 'Assign when: 확산적 음영이 형태 근거 없이 지각될 때 부여합니다.', 'Do not assign when: 형태 기여(FY/YF)가 있는 경우.', "App rule: Y 단독이면 FQ는 'none'이 됩니다.", 'Caution: C\' 및 T와의 감별을 확인합니다.'].join('\n'),
  Fr: ['Definition: 형태-반사(Fr)입니다.', 'Assign when: 명확한 대상 형태에 반사 개념이 부차적으로 결합될 때 부여합니다.', 'Do not assign when: 반사 개념이 주이고 형태가 모호한 경우(rF).', "App rule: Fr/rF 선택 시 pair '(2)'는 같은 반응에서 배타 처리됩니다.", 'Caution: 단순 2개 대상 반응과 반사 개념을 구분합니다.'].join('\n'),
  rF: ['Definition: 반사-형태(rF)입니다.', 'Assign when: 반사/대칭 개념이 주이고 형태 동일화가 부차적일 때 부여합니다.', 'Do not assign when: 형태 동일화가 주된 Fr이 타당한 경우.', "App rule: Fr/rF는 pair '(2)'와 배타입니다.", 'Caution: 일반 페어 반응과 혼동하지 않습니다.'].join('\n'),
  FD: ['Definition: 형태차원 결정인(FD)입니다.', 'Assign when: 음영이 아니라 형태 원근으로 깊이감이 형성될 때 부여합니다.', 'Do not assign when: 음영 기반 깊이(V/FV/VF)가 타당한 경우.', 'Boundary: FD는 형태 원근, V계열은 음영 원근입니다.', 'Caution: 차원 지각 근거를 탐문에서 확인합니다.'].join('\n'),
  F: ['Definition: 순수 형태 결정인(F)입니다.', 'Assign when: 반응이 형태만으로 조직될 때 부여합니다.', 'Do not assign when: 운동·색채·음영·반사가 유의미하게 기여하는 경우.', 'Boundary: F는 형태 중심 반응의 기준 코드입니다.', 'Caution: 혼합 반응을 관성적으로 F로 단순화하지 않습니다.'].join('\n'),
};

const CARD_DETAILS_KO: Record<string, string> = {
  I: ['Definition: 카드 I은 초기 적응 양식을 관찰하는 기준 카드입니다.', 'Coding focus: 모호성에 대한 첫 접근, 형태 사용, 반응 시작 패턴을 확인합니다.', 'Do not overread: 초기 머뭇거림은 상황적 요인일 수 있으므로 단독 해석하지 않습니다.', 'Cross-checks: R, Lambda, 이후 카드 변화와 비교합니다.', 'Caution: 단일 카드 인상은 가설 수준으로 유지합니다.'].join('\n'),
  II: ['Definition: 카드 II는 색채 자극이 증가하는 카드입니다.', 'Coding focus: FC/CF/C 우선성, 정서 부하 상황의 형태 통제를 확인합니다.', 'Do not overread: 색 언급만으로 정서조절 실패를 결론 내리지 않습니다.', 'Cross-checks: FC:CF+C, SumC, FQ 분포를 함께 봅니다.', 'Caution: 결정인 우선성은 탐문 근거로 확정합니다.'].join('\n'),
  III: ['Definition: 카드 III는 대인/인간운동 반응을 유발하기 쉬운 카드입니다.', 'Coding focus: M의 질, COP/AG, 인간표상의 조직성을 확인합니다.', 'Do not overread: 사람 내용의 존재만으로 대인기능을 단정하지 않습니다.', 'Cross-checks: Human Cont, Pure H, GHR/PHR, a:p와 통합합니다.', 'Caution: 인물 수보다 상호작용의 질을 우선 평가합니다.'].join('\n'),
  IV: ['Definition: 카드 IV는 무게감 있는 지각장을 제공하는 카드입니다.', 'Coding focus: 주제 해석보다 위치/결정인/FQ의 형식 정확도를 우선합니다.', 'Do not overread: 권위/힘 주제는 코딩 기준이 아니라 해석 가설입니다.', 'Cross-checks: FQ, MOR, 대처 관련 지표와 함께 검토합니다.', 'Caution: 코딩 단계에서는 내용 중립성을 유지합니다.'].join('\n'),
  V: ['Definition: 카드 V는 형태 중심 중재를 보기 좋은 카드입니다.', 'Coding focus: 순수 형태 조직, FQ 안정성, 관습적 반응을 확인합니다.', 'Do not overread: 새로움이 낮다는 이유만으로 부정적 결론을 내리지 않습니다.', 'Cross-checks: P, XA%, X+%, Lambda와 통합합니다.', 'Caution: 현실검증 결론은 단일 카드로 내리지 않습니다.'].join('\n'),
  VI: ['Definition: 카드 VI는 질감/입체 음영 결정인이 자주 관찰되는 카드입니다.', 'Coding focus: FT/TF/T 및 FV/VF/V를 탐문 근거로 엄격히 구분합니다.', 'Do not overread: 전형적 연상만으로 질감/비스타 코딩을 하지 않습니다.', 'Cross-checks: SumT, SumV, SumY와 관련 군집을 확인합니다.', 'Caution: 우선 결정인은 반응 생성 순서를 기준으로 판단합니다.'].join('\n'),
  VII: ['Definition: 카드 VII는 관계적 표상과 선택적 지각을 보기 좋은 카드입니다.', 'Coding focus: 위치 선택성, 인간 내용의 질, 상호작용 표상을 확인합니다.', 'Do not overread: 상징 해석이 코딩 규칙을 대체할 수 없습니다.', 'Cross-checks: 대인관계/자기지각 군집과 함께 읽습니다.', 'Caution: 코딩과 주제 해석을 단계적으로 분리합니다.'].join('\n'),
  VIII: ['Definition: 카드 VIII는 전면 색채 카드로 통합 부담이 높습니다.', 'Coding focus: 색채-형태 균형, 블렌드 질, 중재 안정성을 확인합니다.', 'Do not overread: 색채 활성화 자체를 불안정성과 동일시하지 않습니다.', 'Cross-checks: Afr, FC:CF+C, Blends:R, FQ와 통합합니다.', 'Caution: 전 프로토콜 비교 후 의미를 확정합니다.'].join('\n'),
  IX: ['Definition: 카드 IX는 다색·확산 복잡성이 큰 카드입니다.', 'Coding focus: DQ/FQ와 결정인 통합으로 모호성 처리 방식을 확인합니다.', 'Do not overread: 단일 카드 혼란을 전체 해체로 일반화하지 않습니다.', 'Cross-checks: Zd, Zf, W:D:Dd를 카드 간 비교합니다.', 'Caution: 조건부 증거로 취급하고 반복성을 확인합니다.'].join('\n'),
  X: ['Definition: 카드 X는 분산된 상세와 유연한 통합을 요구합니다.', 'Coding focus: 탐색 폭/선택성, 내용 분산, 조직적 종결을 확인합니다.', 'Do not overread: 상세 수가 많다는 이유만으로 병리로 해석하지 않습니다.', 'Cross-checks: Z 지표, 처리 군집, 프로토콜 일관성과 통합합니다.', 'Caution: 단발 반응이 아니라 반복 패턴으로 해석합니다.'].join('\n'),
};

const CONTENT_DETAILS_KO: Record<string, string> = {
  H: ['Definition: 현실적 전체 인간내용(H)입니다.', 'Assign when: 완전한 현실적 인간 형상이 확인될 때 부여합니다.', 'Do not assign when: 공상적 인간((H)) 또는 부분 인간(Hd)이 타당할 때.', 'Caution: 표상 질은 FQ, GHR/PHR과 함께 해석합니다.'].join('\n'),
  '(H)': ['Definition: 공상적/신화적 전체 인간내용((H))입니다.', 'Assign when: 유령, 천사, 신화 인물 등 비현실적 인간상이 명시될 때 부여합니다.', 'Do not assign when: 현실적 인간(H)으로 충분히 코딩 가능한 경우.', 'Caution: 공상성은 반응 문장에 명시되어야 합니다.'].join('\n'),
  Hd: ['Definition: 인간 부분내용(Hd)입니다.', 'Assign when: 신체 일부나 부분적 인간 형상이 지각될 때 부여합니다.', 'Do not assign when: 전체 인간(H)으로 통합되는 경우.', 'Caution: 해부학 내용(An)과 경계를 확인합니다.'].join('\n'),
  '(Hd)': ['Definition: 공상적 인간 부분내용((Hd))입니다.', 'Assign when: 비현실적 존재에 속한 인간 부분이 제시될 때 부여합니다.', 'Do not assign when: 현실적 인간 부분(Hd)이 타당한 경우.', 'Caution: 현실성 축과 완전성 축을 분리해 판단합니다.'].join('\n'),
  Hx: ['Definition: 인간 관련 경험내용(Hx)입니다.', 'Assign when: 인간 연관성은 있으나 H/Hd로 명확히 분류하기 어려울 때 부여합니다.', 'Do not assign when: H 또는 Hd가 명확히 성립하는 경우.', 'Caution: 보수적으로 사용하고 탐문 근거를 확인합니다.'].join('\n'),
  A: ['Definition: 현실적 전체 동물내용(A)입니다.', 'Assign when: 완전한 현실 동물이 확인될 때 부여합니다.', 'Do not assign when: 공상 동물((A)) 또는 부분 동물(Ad)이 더 적절할 때.', 'Caution: 동물운동(FM)은 별도 축으로 코딩합니다.'].join('\n'),
  '(A)': ['Definition: 공상적 전체 동물내용((A))입니다.', 'Assign when: 신화/상징/비현실 동물이 명시될 때 부여합니다.', 'Do not assign when: 현실 동물(A)로 충분한 경우.', 'Caution: 공상성의 명시 여부를 확인합니다.'].join('\n'),
  Ad: ['Definition: 동물 부분내용(Ad)입니다.', 'Assign when: 동물의 부분 특징이 지각될 때 부여합니다.', 'Do not assign when: 전체 동물(A)로 조직되는 경우.', 'Caution: 부분성은 지각 구조로 판단합니다.'].join('\n'),
  '(Ad)': ['Definition: 공상적 동물 부분내용((Ad))입니다.', 'Assign when: 비현실적 동물의 부분이 제시될 때 부여합니다.', 'Do not assign when: 현실적 동물 부분(Ad)인 경우.', 'Caution: 현실성과 부분성을 동시에 검토합니다.'].join('\n'),
  An: ['Definition: 해부학 내용(An)입니다.', 'Assign when: 내장/골격/해부학 구조가 명시될 때 부여합니다.', 'Do not assign when: 일반 신체부분으로 Hd가 더 타당한 경우.', 'Caution: An+Xy 및 자기지각 군집과 통합 해석합니다.'].join('\n'),
  Art: ['Definition: 예술 내용(Art)입니다.', 'Assign when: 그림/조각/예술 작품이 대상으로 명시될 때 부여합니다.', 'Do not assign when: 예술 틀 없이 일반 사물로 충분한 경우.', 'Caution: 2AB+Art+Ay 복합 지표와의 관련성을 확인합니다.'].join('\n'),
  Ay: ['Definition: 인류학/문화 내용(Ay)입니다.', 'Assign when: 문화·민족·역사적 집단/인물 참조가 명시될 때 부여합니다.', 'Do not assign when: H/Hd로 충분히 설명되는 경우.', 'Caution: 문화 추정 과잉을 피하고 반응 근거로만 코딩합니다.'].join('\n'),
  Bl: ['Definition: 혈액 내용(Bl)입니다.', 'Assign when: 혈액이 대상 내용으로 명확히 지목될 때 부여합니다.', 'Do not assign when: 빨간색 언급만 있고 혈액 대상이 없을 때.', 'Caution: 내용코드와 색채결정인을 분리합니다.'].join('\n'),
  Bt: ['Definition: 식물 내용(Bt)입니다.', 'Assign when: 식물/나무/꽃이 대상화될 때 부여합니다.', 'Do not assign when: 형태 근거가 부족한 경우.', 'Caution: 형태 적합 근거와 함께 판단합니다.'].join('\n'),
  Cg: ['Definition: 의복 내용(Cg)입니다.', 'Assign when: 옷/의복 항목이 명시적으로 확인될 때 부여합니다.', 'Do not assign when: 질감 언급만 있고 의복 대상이 없을 때.', 'Caution: 질감 결정인과 혼동하지 않습니다.'].join('\n'),
  Cl: ['Definition: 구름 내용(Cl)입니다.', 'Assign when: 구름 형상이 명시적으로 동정될 때 부여합니다.', 'Do not assign when: 막연한 대기 인상만 있는 경우.', 'Caution: Cl 내용과 확산음영(Y) 논리를 구분합니다.'].join('\n'),
  Ex: ['Definition: 폭발 내용(Ex)입니다.', 'Assign when: 폭발/분출 사건이 명확히 묘사될 때 부여합니다.', 'Do not assign when: 일반적 에너지감만 있고 폭발 대상이 없을 때.', 'Caution: 운동/특수점수와의 병용은 기준 충족 시에만 합니다.'].join('\n'),
  Fd: ['Definition: 음식 내용(Fd)입니다.', 'Assign when: 먹을 수 있는 대상이 명확히 확인될 때 부여합니다.', 'Do not assign when: 색/질감 언급만 있고 음식 대상이 없을 때.', 'Caution: 의존성 해석은 전체 패턴에서만 수행합니다.'].join('\n'),
  Fi: ['Definition: 불 내용(Fi)입니다.', 'Assign when: 불꽃/화염 원천이 명시될 때 부여합니다.', 'Do not assign when: 따뜻한 색 언급만 있고 불 대상이 없을 때.', 'Caution: 색채 결정인과 내용코드를 분리합니다.'].join('\n'),
  Ge: ['Definition: 지리 내용(Ge)입니다.', 'Assign when: 지도/지형/지리적 형상이 명시될 때 부여합니다.', 'Do not assign when: 지리 대상 없이 원근 언급만 있는 경우.', 'Caution: Ge와 V/FD를 구분합니다.'].join('\n'),
  Hh: ['Definition: 가정용품 내용(Hh)입니다.', 'Assign when: 가정 내 사용 물품이 확인될 때 부여합니다.', 'Do not assign when: 더 특이적인 내용코드가 적용 가능한 경우.', 'Caution: 가능한 한 특이 코드 우선 원칙을 적용합니다.'].join('\n'),
  Ls: ['Definition: 풍경 내용(Ls)입니다.', 'Assign when: 장면 수준의 자연 풍경 구성이 명시될 때 부여합니다.', 'Do not assign when: 고립된 사물만 있고 장면 구성이 없을 때.', 'Caution: 반사/Vista 동시 부여 시 각 기준을 독립 확인합니다.'].join('\n'),
  Na: ['Definition: 자연 내용(Na)입니다.', 'Assign when: 더 구체적 자연코드로 분류되지 않는 자연 대상일 때 부여합니다.', 'Do not assign when: Bt/Cl/Fi 등 특이 코드가 적용 가능한 경우.', 'Caution: Na를 만능 코드로 남용하지 않습니다.'].join('\n'),
  Sc: ['Definition: 과학/기술 내용(Sc)입니다.', 'Assign when: 과학/기술 대상 또는 과정이 명시될 때 부여합니다.', 'Do not assign when: 은유적 전문용어만 있고 대상 동정이 없는 경우.', 'Caution: 학력 추정이 아니라 지각 대상 기준으로 판정합니다.'].join('\n'),
  Sx: ['Definition: 성적 내용(Sx)입니다.', 'Assign when: 성기/성행위/성적 주제가 명시될 때 부여합니다.', 'Do not assign when: 관계 표현이 모호하고 성적 내용이 명시되지 않을 때.', 'Caution: 과잉코딩 방지를 위해 명시 기준을 높게 적용합니다.'].join('\n'),
  Xy: ['Definition: X선 내용(Xy)입니다.', 'Assign when: 내부가 투시적으로 보이는 묘사가 명시될 때 부여합니다.', 'Do not assign when: 일반 해부 표현만 있고 투시 관점이 없는 경우.', 'Caution: An+Xy 복합 문맥에서 해석합니다.'].join('\n'),
  Id: ['Definition: 특이 내용(Id)입니다.', 'Assign when: 내용은 분명하지만 표준 내용 범주에 적합하지 않을 때 부여합니다.', 'Do not assign when: 표준 코드가 합리적으로 적용 가능한 경우.', 'Caution: Id는 최소화하고 방어 가능한 특이 코드를 우선합니다.'].join('\n'),
};

const SPECIAL_SCORE_DETAILS_KO: Record<string, string> = {
  DV1: ['Definition: 경도 일탈언어(DV1)입니다.', 'Assign when: 표현이 다소 기이하지만 이해 가능성이 부분적으로 유지될 때 부여합니다.', 'Do not assign when: 이해를 뚜렷하게 해치는 중증 수준(DV2)일 때.', 'Boundary: DV1은 낮은 수준의 인지-언어 이탈입니다.', 'Caution: 문체적 특성과 코딩 가능한 일탈을 구분합니다.'].join('\n'),
  DV2: ['Definition: 중증 일탈언어(DV2)입니다.', 'Assign when: 단어 선택/구문이 이해 가능성을 뚜렷하게 손상할 때 부여합니다.', 'Do not assign when: 기이성이 경도 수준(DV1)에 머무를 때.', 'Boundary: DV2는 WSum6에서 더 높은 가중치를 가집니다.', 'App rule: DV1과 DV2는 동일 반응에서 상호배타입니다.'].join('\n'),
  INCOM1: ['Definition: 경도 부적합 결합(INCOM1)입니다.', 'Assign when: 결합에 불일치는 있으나 부분적 일관성이 남을 때 부여합니다.', 'Do not assign when: 결합이 명백히 불가능/기괴한 수준(INCOM2)일 때.', 'Boundary: INCOM1은 중등도 개념 불일치를 반영합니다.', 'Caution: 반응의 문자적 근거에 기반해 판단합니다.'].join('\n'),
  INCOM2: ['Definition: 중증 부적합 결합(INCOM2)입니다.', 'Assign when: 속성 결합이 현저히 비양립적이고 기괴할 때 부여합니다.', 'Do not assign when: 불일치가 경도/중등도(INCOM1) 수준일 때.', 'Boundary: INCOM2는 높은 심각도의 사고 이탈 지표입니다.', 'App rule: INCOM1/INCOM2는 동일 반응에서 상호배타입니다.'].join('\n'),
  DR1: ['Definition: 경도 사고진행 일탈(DR1)입니다.', 'Assign when: 사고 흐름의 일탈이 있으나 붕괴 범위가 제한적일 때 부여합니다.', 'Do not assign when: 진행 붕괴가 중증(DR2)일 때.', 'Boundary: DR1은 중등도 사고진행 비효율을 시사합니다.', 'Caution: 단순한 화법 특성과 구분합니다.'].join('\n'),
  DR2: ['Definition: 중증 사고진행 일탈(DR2)입니다.', 'Assign when: 반응의 순서/논리 연결이 심하게 해체될 때 부여합니다.', 'Do not assign when: 경도 일탈(DR1)이 더 타당할 때.', 'Boundary: DR2는 DR1보다 병리 가중이 큽니다.', 'App rule: DR1/DR2는 같은 행에서 공존하지 않습니다.'].join('\n'),
  FABCOM1: ['Definition: 경도 공상결합(FABCOM1)입니다.', 'Assign when: 비현실 결합이 있으나 잔여 일관성이 남아 있을 때 부여합니다.', 'Do not assign when: 결합이 명백히 기괴/불가능(FABCOM2)할 때.', 'Boundary: FABCOM1은 낮은 수준의 기괴 결합입니다.', 'Caution: 임상적 의역이 아닌 지각 진술에 근거합니다.'].join('\n'),
  FABCOM2: ['Definition: 중증 공상결합(FABCOM2)입니다.', 'Assign when: 지각 결합이 명확히 환상적이고 해체적일 때 부여합니다.', 'Do not assign when: 비현실성이 경도/중등도(FABCOM1) 수준일 때.', 'Boundary: FABCOM2는 심한 관념장애 부하를 반영합니다.', 'App rule: FABCOM1/2는 동일 반응에서 상호배타입니다.'].join('\n'),
  CONTAM: ['Definition: 오염(Contamination)입니다.', 'Assign when: 양립 불가능한 지각 범주가 하나의 불가능한 지각으로 융합될 때 부여합니다.', 'Do not assign when: 실제 융합 없이 은유적 표현만 존재할 때.', 'Boundary: CONTAM은 사고-지각 통합 실패의 중증 지표입니다.', 'Caution: 융합의 명시적 반응 근거를 요구합니다.'].join('\n'),
  ALOG: ['Definition: 부적절 논리(ALOG)입니다.', 'Assign when: 요소를 연결하는 추론이 명백히 비논리적일 때 부여합니다.', 'Do not assign when: 이례적이더라도 논리적으로 방어 가능한 경우.', 'Boundary: ALOG는 내용의 기이성보다 추론 구조를 평가합니다.', 'Caution: 탐문에서의 설명 문장을 중점 검토합니다.'].join('\n'),
  PSV: ['Definition: 보속(PSV)입니다.', 'Assign when: 반응들 사이에 반복적 고착 패턴이 나타날 때 부여합니다.', 'Do not assign when: 정상적인 주제 연속성으로 설명 가능한 경우.', 'Boundary: PSV는 단발 아이디어가 아니라 처리 경직 지표입니다.', 'Caution: 프로토콜 전반의 반복 형태로 판단합니다.'].join('\n'),
  AB: ['Definition: 추상 내용(AB)입니다.', 'Assign when: 내용이 구체물보다 개념/추상 수준으로 제시될 때 부여합니다.', 'Do not assign when: 내용이 구체 대상 수준에 머무를 때.', 'Boundary: AB는 Art/Ay와 함께 관념 프로파일을 구성합니다.', 'Caution: 평가자 해석이 아니라 반응 내용의 추상성으로 판단합니다.'].join('\n'),
  AG: ['Definition: 공격성 지표(AG)입니다.', 'Assign when: 공격/파괴/가해 의도가 행위로 명시될 때 부여합니다.', 'Do not assign when: 갈등 암시는 있으나 공격 행위가 명시되지 않을 때.', 'Boundary: AG는 행위 표상이 필요하며 적대적 분위기만으로 부여하지 않습니다.', 'Caution: 도덕 판단과 코딩을 분리합니다.'].join('\n'),
  COP: ['Definition: 협동성 지표(COP)입니다.', 'Assign when: 둘 이상이 긍정적 협동 상호작용을 명시할 때 부여합니다.', 'Do not assign when: 동시 존재만 있고 협동 행위가 없을 때.', 'Boundary: COP는 인원수가 아니라 상호작용의 질을 요구합니다.', 'Caution: 관계 추정이 아니라 행동 묘사로 코딩합니다.'].join('\n'),
  MOR: ['Definition: 병리적/손상적 내용(MOR)입니다.', 'Assign when: 손상·죽음·부패·결함·오염 등의 대상 질이 명시될 때 부여합니다.', 'Do not assign when: 부정 정서 단어만 있고 병리 대상 표상이 없을 때.', 'Boundary: MOR는 내용 질 지표이며 단독 진단 지표가 아닙니다.', 'Caution: 정서 및 자기지각 군집과 통합 해석합니다.'].join('\n'),
  PER: ['Definition: 개인화(PER)입니다.', 'Assign when: 과제 요구를 넘어서는 자기참조/개인화 자세가 나타날 때 부여합니다.', 'Do not assign when: 과제 적합적 1인칭 표현에 머무를 때.', 'Boundary: PER는 대인적 스타일 지표이지 단독 중증도 지표가 아닙니다.', 'Caution: 대인관계 군집 변수와 함께 해석합니다.'].join('\n'),
  CP: ['Definition: 색채투사(CP)입니다.', 'Assign when: 색채가 외현화된 정서 부하로 투사되는 방식이 명시될 때 부여합니다.', 'Do not assign when: 표준 색채결정인(FC/CF/C)으로 충분히 설명 가능한 경우.', 'Boundary: CP는 특수점수이며 색채결정인의 대체가 아닙니다.', 'Caution: 전반적 정서조절 패턴 속에서 해석합니다.'].join('\n'),
};

function englishScoringRelevance(categoryId: string): string {
  const map: Record<string, string> = {
    card: 'Downstream relevance: affects card-by-card process reading, early/late adaptation comparison, and protocol-level organization hypotheses.',
    location: 'Downstream relevance: contributes to W:D:Dd ratios, S usage, scanning style, and processing-effort interpretation.',
    dq: 'Downstream relevance: directly shapes developmental quality distributions (DQ+/DQv) and organizational complexity reading.',
    determinants: 'Downstream relevance: feeds core affect/ideation/self-perception variables (e.g., EB, SumC family, SumT/SumV/SumY, a:p patterns).',
    fq: 'Downstream relevance: central for mediation variables (XA%, WDA%, X-%, X+%, Xu%) and reality-testing quality.',
    contents: 'Downstream relevance: supports interpersonal/self-perception composites (Human Cont, Pure H, An+Xy, 2AB+Art+Ay, MOR context).',
    z: 'Downstream relevance: contributes to Zf/ZSum/Zd and broader processing-effort/organization indicators.',
    gphr: 'Downstream relevance: informs interpersonal representation quality and relation to Human Content cluster.',
    'special-score': 'Downstream relevance: contributes to WSum6 and severe ideational-disruption markers used by special indices.',
  };
  return map[categoryId] ?? 'Downstream relevance: interpret only with convergent indicators and full protocol context.';
}

function wrapScoringDoc(lang: Language, code: string, categoryId: string, core: string): string {
  const relevance = englishScoringRelevance(categoryId);
  const suffixByLang: Record<Language, string[]> = {
    en: [
      '[Input Constraints In This App] Apply mutual exclusion, determinant-priority, and auto-rule constraints implemented in calculator logic before final lock.',
      `[Interpretation Relevance] ${relevance}`,
      '[AI Usage Guideline] Use conservative wording: describe coding evidence and probable implications; avoid diagnosis-level conclusions from single codes.',
      '[Source Reliability] Primary grounding: Exner Comprehensive System coding logic + curated references in docs/ref; confidence: medium-high when inquiry evidence is explicit.',
    ],
    ko: [
      '[Input Constraints In This App] 최종 확정 전에 상호배제, 결정인 우선순위, 앱 자동 규칙을 모두 적용합니다.',
      `[Interpretation Relevance] ${relevance}`,
      '[AI Usage Guideline] 보수적 표현을 사용합니다. 단일 코드만으로 진단 수준 결론을 내리지 않습니다.',
      '[Source Reliability] 근거: Exner 종합체계 코딩 원리 + docs/ref 선별 자료. 탐문 근거가 명확할수록 신뢰도는 중~상입니다.',
    ],
    ja: [
      '[Input Constraints In This App] Apply mutual exclusion, determinant-priority, and auto-rule constraints implemented in calculator logic before final lock.',
      `[Interpretation Relevance] ${relevance}`,
      '[AI Usage Guideline] Use conservative wording: describe coding evidence and probable implications; avoid diagnosis-level conclusions from single codes.',
      '[Source Reliability] Primary grounding: Exner Comprehensive System coding logic + curated references in docs/ref; confidence: medium-high when inquiry evidence is explicit.',
    ],
    es: [
      '[Input Constraints In This App] Aplique exclusion mutua, prioridad jerarquica y reglas automaticas de la app antes del cierre.',
      `[Interpretation Relevance] ${relevance}`,
      '[AI Usage Guideline] Use lenguaje prudente: "puede indicar", "es consistente con"; evite afirmaciones diagnosticas de un solo codigo.',
      '[Source Reliability] Base principal: reglas de codificacion del Sistema Comprehensivo de Exner + referencias curadas en docs/ref; confianza: media-alta con evidencia explicita.',
    ],
    pt: [
      '[Input Constraints In This App] Aplique exclusao mutua, prioridade hierarquica e regras automaticas do app antes do fechamento.',
      `[Interpretation Relevance] ${relevance}`,
      '[AI Usage Guideline] Use linguagem prudente: "pode indicar", "e consistente com"; evite conclusoes diagnosticas por codigo isolado.',
      '[Source Reliability] Base principal: regras de codificacao do Sistema Compreensivo de Exner + referencias curadas em docs/ref; confianca: media-alta com evidencia explicita.',
    ],
  };

  return [
    core,
    ...suffixByLang[lang],
  ].join('\n\n');
}

function scoringEntryText(code: string, categoryId: string, lang: Language): string {
  const byCategory: Record<string, Record<Language, Record<string, string> | undefined>> = {
    determinants: { en: DETERMINANT_DETAILS_EN, ko: DETERMINANT_DETAILS_KO, ja: DETERMINANT_DETAILS_JA, es: DETERMINANT_DETAILS_ES, pt: DETERMINANT_DETAILS_PT },
    fq: { en: FQ_DETAILS_EN, ko: FQ_DETAILS_KO, ja: FQ_DETAILS_JA, es: FQ_DETAILS_ES, pt: FQ_DETAILS_PT },
    dq: { en: DQ_DETAILS_EN, ko: DQ_DETAILS_KO, ja: DQ_DETAILS_JA, es: DQ_DETAILS_ES, pt: DQ_DETAILS_PT },
    location: { en: LOCATION_DETAILS_EN, ko: LOCATION_DETAILS_KO, ja: LOCATION_DETAILS_JA, es: LOCATION_DETAILS_ES, pt: LOCATION_DETAILS_PT },
    z: { en: Z_DETAILS_EN, ko: Z_DETAILS_KO, ja: Z_DETAILS_JA, es: Z_DETAILS_ES, pt: Z_DETAILS_PT },
    gphr: { en: GPHR_DETAILS_EN, ko: GPHR_DETAILS_KO, ja: GPHR_DETAILS_JA, es: GPHR_DETAILS_ES, pt: GPHR_DETAILS_PT },
    'special-score': { en: SPECIAL_SCORE_DETAILS_EN, ko: SPECIAL_SCORE_DETAILS_KO, ja: SPECIAL_SCORE_DETAILS_JA, es: SPECIAL_SCORE_DETAILS_ES, pt: SPECIAL_SCORE_DETAILS_PT },
    card: { en: CARD_DETAILS_EN, ko: CARD_DETAILS_KO, ja: CARD_DETAILS_JA, es: CARD_DETAILS_ES, pt: CARD_DETAILS_PT },
    contents: { en: CONTENT_DETAILS_EN, ko: CONTENT_DETAILS_KO, ja: CONTENT_DETAILS_JA, es: CONTENT_DETAILS_ES, pt: CONTENT_DETAILS_PT },
  };

  if (categoryId === 'contents' && lang === 'ja') {
    const jaText = CONTENT_DETAILS_JA[code] ?? CONTENT_DETAILS_JA_EXTRA[code];
    if (jaText) return wrapScoringDoc(lang, code, categoryId, jaText);
  }

  const categoryMaps = byCategory[categoryId];
  const langMap = categoryMaps?.[lang];
  const localized = langMap?.[code];
  if (localized) return wrapScoringDoc(lang, code, categoryId, localized);

  const enFallback = categoryMaps?.en?.[code];
  if (enFallback) return wrapScoringDoc(lang, code, categoryId, enFallback);

  const category = CATEGORY_LABELS[categoryId]?.[lang] ?? CATEGORY_LABELS[categoryId]?.en ?? categoryId;

  const map: Record<Language, string> = {
    en: wrapScoringDoc(
      'en',
      code,
      categoryId,
      [
        `[Definition] ${code} is scored in the ${category} domain of Exner's Comprehensive System.`,
        `[Operational Criteria] Anchor coding to explicit response wording, hierarchy rules, and exclusion constraints.`,
        `[Boundary Handling] If response evidence is ambiguous, retain a note and adjudicate with transcript+inquiry context before final lock.`,
        `[Clinical Caution] Use as structured scoring support; final interpretation requires full clinical integration.`,
      ].join('\n\n')
    ),
    ko: wrapScoringDoc(
      'ko',
      code,
      categoryId,
      [
      `[Definition] ${code} is scored in the ${category} domain of Exner's Comprehensive System.`,
      `[Operational Criteria] Anchor coding to explicit response wording, hierarchy rules, and exclusion constraints.`,
      `[Integration Rule] Interpret in protocol context (distribution, clustering, and convergent variables), not in isolation.`,
      `[Clinical Caution] Use as structured scoring support; final interpretation requires full clinical integration.`,
      ].join('\n\n')
    ),
    ja: wrapScoringDoc(
      'ja',
      code,
      categoryId,
      [
      `[Definition] ${code} is scored in the ${category} domain of Exner's Comprehensive System.`,
      `[Operational Criteria] Anchor coding to explicit response wording, hierarchy rules, and exclusion constraints.`,
      `[Integration Rule] Interpret in protocol context (distribution, clustering, and convergent variables), not in isolation.`,
      `[Clinical Caution] Use as structured scoring support; final interpretation requires full clinical integration.`,
      ].join('\n\n')
    ),
    es: wrapScoringDoc(
      'es',
      code,
      categoryId,
      [
      `[Definicion] ${code} se puntua en el dominio ${category} del sistema Exner.`,
      `[Criterios Operativos] Ancle la codificacion en evidencia verbal explicita, jerarquia y reglas de exclusion.`,
      `[Regla de Integracion] Interprete en contexto de protocolo (distribucion, agrupamiento y convergencia), no de forma aislada.`,
      `[Cautela Clinica] Es apoyo estructurado; la interpretacion final requiere integracion clinica completa.`,
      ].join('\n\n')
    ),
    pt: wrapScoringDoc(
      'pt',
      code,
      categoryId,
      [
      `[Definicao] ${code} e pontuado no dominio ${category} do sistema Exner.`,
      `[Criterios Operacionais] Ancore a codificacao em evidencia verbal explicita, hierarquia e regras de exclusao.`,
      `[Regra de Integracao] Interprete no contexto do protocolo (distribuicao, agrupamento e convergencia), nao isoladamente.`,
      `[Cautela Clinica] E suporte estruturado; a interpretacao final exige integracao clinica completa.`,
      ].join('\n\n')
    ),
  };

  return map[lang];
}
function resultEntryText(title: string, base: string, section: string, lang: Language): string {
  const sectionName: Record<Language, Record<string, string>> = {
    en: { upper: 'Upper Section', core: 'Core', ideation: 'Ideation', affect: 'Affect', mediation: 'Mediation', processing: 'Processing', interpersonal: 'Interpersonal', self: 'Self-Perception', indices: 'Special Indices', general: 'General' },
    ko: { upper: 'Upper Section', core: 'Core', ideation: 'Ideation', affect: 'Affect', mediation: 'Mediation', processing: 'Processing', interpersonal: 'Interpersonal', self: 'Self-Perception', indices: 'Special Indices', general: 'General' },
    ja: { upper: 'Upper Section', core: 'Core', ideation: 'Ideation', affect: 'Affect', mediation: 'Mediation', processing: 'Processing', interpersonal: 'Interpersonal', self: 'Self-Perception', indices: 'Special Indices', general: 'General' },
    es: { upper: 'Seccion Superior', core: 'Nucleo', ideation: 'Ideacion', affect: 'Afecto', mediation: 'Mediacion', processing: 'Procesamiento', interpersonal: 'Interpersonal', self: 'Autopercepcion', indices: 'Indices Especiales', general: 'General' },
    pt: { upper: 'Secao Superior', core: 'Nucleo', ideation: 'Ideacao', affect: 'Afeto', mediation: 'Mediacao', processing: 'Processamento', interpersonal: 'Interpessoal', self: 'Autopercepcao', indices: 'Indices Especiais', general: 'Geral' },
  };

  const sec = sectionName[lang][section] ?? sectionName[lang].general;
  const safeBase = base && !base.startsWith('Temporary ') ? base : '';
  const enSectionChecks: Record<string, string[]> = {
    upper: [
      'Check with R and response productivity to avoid over-reading sparse protocols.',
      'Cross-read Zf/Zd/ZSum patterns before inferring processing style.',
    ],
    core: [
      'Read EB/EA/eb/es with AdjD and modulation variables rather than as isolated ratios.',
      'Confirm determinant-level evidence (M, SumC family, shading family) behind core summaries.',
    ],
    ideation: [
      'Integrate WSum6, M-, and special scores before inferring thought-disorder severity.',
      'Differentiate style complexity from disorganization by checking mediation (XA%, X-%).',
    ],
    affect: [
      'Interpret FC:CF+C, Pure C, and blends with protocol-wide form quality controls.',
      'Differentiate affect activation from dysregulation using mediation and coping indices.',
    ],
    mediation: [
      'Prioritize XA%, WDA%, X-%, X+%, Xu% convergence before drawing reality-testing conclusions.',
      'Check whether mediation shifts are global or concentrated on high-load cards.',
    ],
    processing: [
      'Use Z metrics with W:D:Dd and DQ pattern to distinguish efficiency vs over-inclusion.',
      'Verify whether processing findings replicate across multiple cards.',
    ],
    interpersonal: [
      'Read COP/AG/PER/Human Content as an interactional pattern, not single-score labels.',
      'Cross-check with self-perception and affect variables for role/relatedness hypotheses.',
    ],
    self: [
      'Integrate Fr+rF, SumV, MOR, and H-ratio carefully before self-image conclusions.',
      'Treat isolated morbid/self-focused signals as provisional without cluster convergence.',
    ],
    indices: [
      'Index elevation requires criterion-level review, not only total cutoff count.',
      'Confirm index interpretation only after coding quality and protocol validity checks.',
    ],
    general: [
      'Use neighboring variables to test convergence before interpretation.',
      'Keep conclusions provisional when protocol quality is limited.',
    ],
  };
  const checks = enSectionChecks[section] ?? enSectionChecks.general;

  const map: Record<Language, string> = {
    en: [
      `[Concept] ${title} is interpreted in the ${sec} frame of the Structural Summary. ${safeBase}`,
      '[Operational Definition] Confirm formula/components first, then read direction (higher/lower), magnitude, and distribution stability across cards.',
      '[Interpretive Preconditions] Check protocol adequacy (R length, coding confidence, inquiry quality) before interpreting extremes.',
      `[Cross-Checks] ${checks[0]} ${checks[1]}`,
      '[Common Misreading Guard] Do not infer traits or diagnosis from a single variable; treat isolated elevations as hypotheses requiring convergence.',
      '[AI Usage Guideline] Preferred wording: "may indicate", "is consistent with", "should be interpreted with". Avoid deterministic claims.',
      '[Source Reliability] Primary grounding: Exner Structural Summary conventions + curated references in docs/ref; confidence: medium-high when coding reliability is strong.',
    ].join('\n\n'),
    ko: [
      `[Concept] ${title} is interpreted in the ${sec} frame of the Structural Summary. ${safeBase}`,
      `[Reading Logic] Evaluate level, direction, and stability of the indicator across the protocol.`,
      `[Cross-Variable Rule] Confirm convergence with neighboring variables before concluding.`,
      `[Clinical Caution] This supports structured hypothesis building and does not replace full clinical judgment.`,
      '[AI Usage Guideline] Use conservative wording and avoid deterministic one-variable conclusions.',
      '[Source Reliability] Primary grounding: Exner Structural Summary conventions + curated references in docs/ref; confidence depends on coding reliability.',
    ].join('\n\n'),
    ja: [
      `[Concept] ${title} is interpreted in the ${sec} frame of the Structural Summary. ${safeBase}`,
      `[Reading Logic] Evaluate level, direction, and stability of the indicator across the protocol.`,
      `[Cross-Variable Rule] Confirm convergence with neighboring variables before concluding.`,
      `[Clinical Caution] This supports structured hypothesis building and does not replace full clinical judgment.`,
      '[AI Usage Guideline] Use conservative wording and avoid deterministic one-variable conclusions.',
      '[Source Reliability] Primary grounding: Exner Structural Summary conventions + curated references in docs/ref; confidence depends on coding reliability.',
    ].join('\n\n'),
    es: [
      `[Concepto] ${title} se interpreta en el marco de ${sec} del Resumen Estructural. ${safeBase}`,
      `[Logica de Lectura] Evalua nivel, direccion y estabilidad del indicador a lo largo del protocolo.`,
      `[Regla de Variables Cruzadas] Verifique convergencia con variables vecinas antes de concluir.`,
      `[Cautela Clinica] Es apoyo estructurado y no sustituye el juicio clinico integral.`,
      '[AI Usage Guideline] Use lenguaje prudente: "puede indicar", "es consistente con"; evite afirmaciones deterministas.',
      '[Source Reliability] Base principal: convenciones del Resumen Estructural de Exner + referencias curadas en docs/ref; confianza segun calidad de codificacion.',
    ].join('\n\n'),
    pt: [
      `[Conceito] ${title} e interpretado no contexto de ${sec} no Resumo Estrutural. ${safeBase}`,
      `[Logica de Leitura] Avalie nivel, direcao e estabilidade do indicador ao longo do protocolo.`,
      `[Regra de Variaveis Cruzadas] Confirme convergencia com variaveis vizinhas antes de concluir.`,
      `[Cautela Clinica] E suporte estruturado e nao substitui julgamento clinico integral.`,
      '[AI Usage Guideline] Use linguagem prudente: "pode indicar", "e consistente com"; evite afirmacoes deterministas.',
      '[Source Reliability] Base principal: convencoes do Resumo Estrutural de Exner + referencias curadas em docs/ref; confianca depende da qualidade da codificacao.',
    ].join('\n\n'),
  };

  return map[lang];
}

function categoryText(title: string, lang: Language): string {
  const map: Record<Language, string> = {
    en: [
      `[Overview] ${title} is a major coding and interpretation domain in Exner's Structural Summary.`,
      '[Scope] This section converts raw responses into structured indicators using explicit assignment rules, exclusion logic, and category hierarchies.',
      '[Workflow] Recommended order: transcript fidelity -> inquiry clarification -> candidate code selection -> hierarchy/exclusion check -> protocol integration.',
      '[Reliability Focus] Re-check card context, determinant priority, and inter-rater defensibility before finalizing code-level decisions.',
      '[Interpretation Guardrail] Category-level reading must be based on pattern convergence, not isolated striking responses.',
      '[AI Usage Guideline] Use this domain as reference knowledge for grounded explanation; separate scoring evidence from clinical hypothesis language.',
    ].join('\n\n'),
    ko: [
      `[Overview] ${title} is a major coding and interpretation domain in Exner's Structural Summary.`,
      `[Scope] This section converts raw responses into structured indicators via explicit coding rules.`,
      `[Reliability Focus] Apply hierarchy, exclusion, and card-context checks before final coding.`,
    ].join('\n\n'),
    ja: [
      `[Overview] ${title} is a major coding and interpretation domain in Exner's Structural Summary.`,
      `[Scope] This section converts raw responses into structured indicators via explicit coding rules.`,
      `[Reliability Focus] Apply hierarchy, exclusion, and card-context checks before final coding.`,
    ].join('\n\n'),
    es: [
      `[Resumen] ${title} es un dominio principal de codificacion e interpretacion en el Resumen Estructural de Exner.`,
      `[Alcance] Esta seccion transforma respuestas crudas en indicadores estructurados mediante reglas explicitas.`,
      `[Confiabilidad] Aplique jerarquia, exclusion y ajuste por contexto de lamina antes del cierre.`,
    ].join('\n\n'),
    pt: [
      `[Visao Geral] ${title} e um dominio central de codificacao e interpretacao no Resumo Estrutural de Exner.`,
      `[Escopo] Esta secao transforma respostas brutas em indicadores estruturados por regras explicitas.`,
      `[Confiabilidade] Aplique hierarquia, exclusao e adequacao ao contexto do cartao antes do fechamento.`,
    ].join('\n\n'),
  };

  return map[lang];
}
export function buildDetailedDocDescription(item: ItemLike, lang: Language, title: string, baseDescription: string): string {
  if (item.kind === 'category') return categoryText(title, lang);

  const scoringCategory = firstScoringCategory(item.slug);
  if (scoringCategory) return scoringEntryText(title, scoringCategory, lang);

  return resultEntryText(title, baseDescription, sectionForResult(item.slug), lang);
}

