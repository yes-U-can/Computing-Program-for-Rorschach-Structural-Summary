import { Language } from '@/types';

type VariableDescription = Record<Language, { title: string; description: string }>;

function localize(title: string, description: string): VariableDescription {
  return {
    en: { title, description },
    ko: { title, description },
    ja: { title, description },
    es: { title, description },
    pt: { title, description },
  };
}

export const resultVariableDescriptions: Record<string, VariableDescription> = {
  // === Upper Section ===
  Zf: localize(
    'Zf',
    [
      'Definition: Frequency count of Z-scored organizational responses.',
      'Operational basis: Number of responses with valid Z coding.',
      'Interpretive direction: Higher Zf suggests greater frequency of organizational effort; lower Zf suggests less frequent organization attempts.',
      'Cross-checks: Interpret with ZSum, Zd, and W:D:Dd distribution.',
      'Caution: Meaning depends on protocol size and response productivity.',
    ].join('\n')
  ),
  ZSum: localize(
    'ZSum',
    [
      'Definition: Total weighted Z score across all Z-coded responses.',
      'Operational basis: Sum of card-by-Z-type weights in app scoring tables.',
      'Interpretive direction: Higher ZSum reflects greater total organizational activity load.',
      'Cross-checks: Interpret jointly with Zf and ZEst before drawing style conclusions.',
      'Caution: Absolute magnitude alone is insufficient without expected-value comparison.',
    ].join('\n')
  ),
  ZEst: localize(
    'ZEst',
    [
      'Definition: Expected ZSum based on protocol size (Zf-linked expectancy table).',
      'Operational basis: Lookup from app ZEST table by Zf.',
      'Interpretive direction: Serves as reference baseline for evaluating Zd.',
      'Cross-checks: Use only together with observed ZSum and computed Zd.',
      'Caution: Out-of-range or very short protocols reduce interpretive stability.',
    ].join('\n')
  ),
  Zd: localize(
    'Zd',
    [
      'Definition: Difference between observed organizational activity and expected level.',
      'Operational basis: Zd = ZSum - ZEst (rounded in app output).',
      'Interpretive direction: Positive values suggest overincorporation/over-scanning tendency; negative values suggest underincorporation/under-scanning tendency.',
      'Cross-checks: Interpret with Zf, W:D:Dd, and mediation quality indicators.',
      'Caution: Use range and context; extreme value interpretation requires protocol validity check.',
    ].join('\n')
  ),
  W: localize(
    'W',
    [
      'Definition: Count of whole-blot location responses.',
      'Operational basis: Number of responses coded in whole-area categories.',
      'Interpretive direction: Higher W suggests broader/global scanning emphasis.',
      'Cross-checks: Evaluate with D, Dd, and W:M pattern.',
      'Caution: High or low W alone is not adaptive/maladaptive by itself.',
    ].join('\n')
  ),
  Dd: localize(
    'Dd',
    [
      'Definition: Count of unusual detail location responses.',
      'Operational basis: Number of responses using rare or selective detail areas.',
      'Interpretive direction: Elevated Dd may reflect selective/idiosyncratic attentional focus.',
      'Cross-checks: Interpret with FQ, X-% and broader processing profile.',
      'Caution: Dd increases may be situational unless repeated across protocol patterns.',
    ].join('\n')
  ),
  S: localize(
    'S',
    [
      'Definition: White-space location usage count.',
      'Operational basis: Includes S-involved location coding per app rules.',
      'Interpretive direction: May indicate oppositional/distancing processing style in some contexts.',
      'Cross-checks: Read with S-, FQ, and interpersonal/affect clusters.',
      'Caution: S is context-sensitive and should not be overinterpreted in isolation.',
    ].join('\n')
  ),
  dq_plus: localize(
    'DQ+',
    [
      'Definition: Count of high synthesized developmental-quality responses.',
      'Operational basis: Number of responses coded DQ+.',
      'Interpretive direction: Higher values suggest stronger integrative structural organization.',
      'Cross-checks: Interpret with DQo, DQv, and mediation variables.',
      'Caution: DQ quality should be considered with form quality, not separately.',
    ].join('\n')
  ),
  dq_o: localize(
    'DQo',
    [
      'Definition: Count of ordinary developmental-quality responses.',
      'Operational basis: Number of responses coded DQo.',
      'Interpretive direction: Reflects typical adequate structural organization frequency.',
      'Cross-checks: Evaluate distribution with DQ+/DQv family and FQ profile.',
      'Caution: DQo dominance is not inherently rigid or deficient.',
    ].join('\n')
  ),
  dq_vplus: localize(
    'DQv/+',
    [
      'Definition: Count of mixed vague-with-synthesis developmental-quality responses.',
      'Operational basis: Number of responses coded DQv/+.',
      'Interpretive direction: Suggests coexisting ambiguity and partial integration attempts.',
      'Cross-checks: Compare with DQv and DQ+ proportions.',
      'Caution: Requires inquiry-supported coding reliability.',
    ].join('\n')
  ),
  dq_v: localize(
    'DQv',
    [
      'Definition: Count of vague developmental-quality responses.',
      'Operational basis: Number of responses coded DQv.',
      'Interpretive direction: Elevated values suggest reduced structural precision in organization.',
      'Cross-checks: Interpret with FQ pattern and Z-coding constraints.',
      'Caution: In this app, DQv enforces FQ/Z constraints at input level.',
    ].join('\n')
  ),

  // === Core ===
  R: localize(
    'R (Total Responses)',
    [
      'Definition: Total number of valid scored responses in protocol.',
      'Operational basis: Count of responses with required scoring fields present.',
      'Interpretive direction: Very low R reduces stability; very high R increases complexity/noise.',
      'Cross-checks: Use R as validity context for all downstream indices.',
      'Caution: Avoid high-confidence interpretation when R is insufficient.',
    ].join('\n')
  ),
  Lambda: localize(
    'L (Lambda)',
    [
      'Definition: Form-dominance simplification ratio.',
      'Operational basis: Pure F count divided by non-F responses (with app-safe denominator handling).',
      'Interpretive direction: Higher Lambda indicates stronger form-dominant simplification; lower Lambda indicates broader affective/complex involvement.',
      'Cross-checks: Interpret with Afr, FC:CF+C, and DQ/FQ profile.',
      'Caution: Extreme Lambda must be interpreted with R and protocol quality.',
    ].join('\n')
  ),
  EB: localize(
    'EB (Experience Balance)',
    [
      'Definition: Balance of ideational movement resources to color-driven affect resources.',
      'Operational basis: EB expressed as M : WSumC.',
      'Interpretive direction: Relative side prominence suggests preferred coping style direction.',
      'Cross-checks: Integrate with EBPer, EA, D/AdjD, and affect modulation indices.',
      'Caution: EB side difference is style information, not pathology by itself.',
    ].join('\n')
  ),
  EA: localize(
    'EA (Experience Actual)',
    [
      'Definition: Available coping resources estimate.',
      'Operational basis: EA = M + WSumC.',
      'Interpretive direction: Higher EA generally indicates greater available coping capacity.',
      'Cross-checks: Compare with es and D/AdjD for load-resource balance.',
      'Caution: Resource level must be interpreted against simultaneous demand load.',
    ].join('\n')
  ),
  EBPer: localize(
    'EBPer',
    [
      'Definition: Degree/flag of one-sidedness in EB pattern.',
      'Operational basis: Derived from EB side ratio criteria in app constants.',
      'Interpretive direction: Strong one-sidedness suggests more rigid reliance on one processing style.',
      'Cross-checks: Evaluate with Lambda, Afr, and adjustment indices.',
      'Caution: One-sided style can be adaptive in some contexts; avoid overpathologizing.',
    ].join('\n')
  ),
  eb: localize(
    'eb',
    [
      'Definition: Ratio of experienced drive/activation sources to distress-shading load components.',
      "Operational basis: eb expressed as (FM+m) : (SumC'+SumT+SumV+SumY).",
      'Interpretive direction: Side balance reflects need/drive versus distress-toned load configuration.',
      'Cross-checks: Read with es, EA, SumT/SumV/SumY, and affect cluster.',
      'Caution: Ratio form requires component-level inspection, not only formatted output.',
    ].join('\n')
  ),
  es: localize(
    'es',
    [
      'Definition: Experienced stimulation/stress load estimate.',
      "Operational basis: es = FM + m + SumC' + SumT + SumV + SumY.",
      'Interpretive direction: Higher es indicates larger current internal load burden.',
      'Cross-checks: Compare directly against EA to interpret D and AdjD meaning.',
      'Caution: High es alone is not dysfunction without resource-context comparison.',
    ].join('\n')
  ),
  D: localize(
    'D Score',
    [
      'Definition: Current stress tolerance balance index.',
      'Operational basis: D derived from EA - es, mapped through app D-table bucketing.',
      'Interpretive direction: Negative D suggests demand load exceeds currently available coping resources.',
      'Cross-checks: Interpret with AdjD, AdjEs, and broader core profile.',
      'Caution: Use as state-sensitive index, not fixed trait conclusion.',
    ].join('\n')
  ),
  AdjD: localize(
    'Adj D',
    [
      'Definition: Adjusted stress tolerance index controlling selected transient load effects.',
      'Operational basis: Computed from EA - AdjEs with same D-table framework.',
      'Interpretive direction: Helps separate baseline tolerance from acute/transient stress inflation.',
      'Cross-checks: Compare D vs AdjD gap to estimate situational pressure contribution.',
      'Caution: Interpretation depends on validity of component adjustment assumptions.',
    ].join('\n')
  ),
  AdjEs: localize(
    'Adj es',
    [
      'Definition: Adjusted experienced load used for AdjD calculation.',
      'Operational basis: App-specific adjusted variant of es components.',
      'Interpretive direction: Supports cleaner estimate of baseline coping-demand balance.',
      'Cross-checks: Evaluate alongside es, D, and AdjD.',
      'Caution: Treat as computational helper variable, not stand-alone inference target.',
    ].join('\n')
  ),
  FM: localize(
    'FM',
    [
      'Definition: Animal movement determinant load in core resource-demand system.',
      'Operational basis: Count of FM movement-coded responses.',
      'Interpretive direction: Higher FM contributes to drive/activation side in eb/es structure.',
      'Cross-checks: Interpret with m, eb, es, and D/AdjD.',
      'Caution: FM meaning depends on balance with coping resources (EA), not count alone.',
    ].join('\n')
  ),
  m: localize(
    'm',
    [
      'Definition: Inanimate movement determinant load in core stress-demand system.',
      'Operational basis: Count of m movement-coded responses.',
      'Interpretive direction: Elevation often increases perceived pressure/force component in es load.',
      'Cross-checks: Read with FM, SumY, es, and D/AdjD profile.',
      'Caution: Interpret as process signal, not direct event history indicator.',
    ].join('\n')
  ),
  SumCprime: localize(
    "SumC'",
    [
      'Definition: Achromatic color/shading-color activation total.',
      "Operational basis: Sum of achromatic-related determinant components used in core formulas.",
      'Interpretive direction: Higher values increase distress-toned load contribution in eb/es structure.',
      'Cross-checks: Integrate with SumV, SumY, SumC\':WSumC, and affect cluster.',
      'Caution: Component interpretation requires ratio context rather than isolated magnitude.',
    ].join('\n')
  ),
  SumT: localize(
    'SumT',
    [
      'Definition: Texture shading determinant total.',
      'Operational basis: Aggregate of T-family determinant contributions.',
      'Interpretive direction: Elevation may reflect stronger contact/closeness needs in contextual interpretation.',
      'Cross-checks: Read with Food, interpersonal SumT_inter, and stress-balance variables.',
      'Caution: Confirm determinant coding quality because T-family distinctions are inquiry-sensitive.',
    ].join('\n')
  ),
  SumV: localize(
    'SumV',
    [
      'Definition: Vista shading determinant total (depth via shading).',
      'Operational basis: Aggregate of V-family determinant contributions.',
      'Interpretive direction: Higher values can align with more self-evaluative/pain-awareness shading themes in context.',
      'Cross-checks: Interpret with SumV_self, MOR patterns, and DEPI-related markers.',
      'Caution: Do not infer self-pathology from SumV alone without converging data.',
    ].join('\n')
  ),
  SumY: localize(
    'SumY',
    [
      'Definition: Diffuse shading determinant total.',
      'Operational basis: Aggregate of Y-family determinant contributions.',
      'Interpretive direction: Elevation contributes to generalized tension/distress load side in core formulas.',
      'Cross-checks: Evaluate with es, D/AdjD, Afr, and affect modulation pattern.',
      'Caution: Y-family interpretation is strongest when supported by broader load-resource imbalance.',
    ].join('\n')
  ),

  // === Ideation ===
  a_p: localize(
    'a:p',
    [
      'Definition: Active-to-passive movement balance in ideational production.',
      'Operational basis: Ratio of active vs passive movement-coded components.',
      'Interpretive direction: Higher active side suggests more assertive/initiating style; higher passive side suggests receptive/less initiating style.',
      'Cross-checks: Interpret with Ma:Mp, EB direction, and interpersonal a:p.',
      'Caution: Ratio meaning depends on total movement volume and protocol context.',
    ].join('\n')
  ),
  Ma_Mp: localize(
    'Ma:Mp',
    [
      'Definition: Active vs passive human movement balance.',
      'Operational basis: Ratio of Ma to Mp components from human movement coding.',
      'Interpretive direction: Relative weighting informs style of intentional agency representation.',
      'Cross-checks: Read with total M, a:p, and control/tolerance indices.',
      'Caution: Small base counts reduce ratio stability.',
    ].join('\n')
  ),
  _2AB_Art_Ay: localize(
    '2AB+(Art+Ay)',
    [
      'Definition: Composite ideational complexity marker combining abstraction and selected content indicators.',
      'Operational basis: Sum of 2AB plus Art and Ay components.',
      'Interpretive direction: Higher values may indicate more abstract/conceptually elaborated ideational style.',
      'Cross-checks: Integrate with DQ profile, blends, and cognitive special scores.',
      'Caution: High abstraction is not equivalent to better reality adequacy.',
    ].join('\n')
  ),
  MOR: localize(
    'MOR',
    [
      'Definition: Morbid content frequency in ideation cluster context.',
      'Operational basis: Count of MOR special score occurrences.',
      'Interpretive direction: Elevation suggests increased damage/negative representation themes.',
      'Cross-checks: Interpret with SumV, DEPI pattern, and self-perception variables.',
      'Caution: MOR requires thematic integration; avoid single-score conclusions.',
    ].join('\n')
  ),
  Sum6: localize(
    'Sum6',
    [
      'Definition: Total frequency of six cognitive special score classes.',
      'Operational basis: Count aggregate of DV/INCOM/DR/FABCOM/ALOG/CONTAM levels.',
      'Interpretive direction: Higher Sum6 indicates greater cognitive slippage burden.',
      'Cross-checks: Interpret with Lv2, WSum6, M-, and mediation quality.',
      'Caution: Severity is better reflected by weighted indices than raw count alone.',
    ].join('\n')
  ),
  Lv2: localize(
    'Lv2',
    [
      'Definition: Count of level-2 severe cognitive special scores.',
      'Operational basis: Sum of DV2, INCOM2, DR2, FABCOM2 occurrences.',
      'Interpretive direction: Higher values suggest more severe disorganization signals.',
      'Cross-checks: Evaluate with WSum6 and X-%/XA% mediation profile.',
      'Caution: Confirm coding reliability for level distinction before interpretation.',
    ].join('\n')
  ),
  WSum6: localize(
    'WSum6',
    [
      'Definition: Severity-weighted cognitive disturbance index.',
      'Operational basis: Weighted sum using app WSum6 weights by special-score class/level.',
      'Interpretive direction: Higher WSum6 indicates greater severity of ideational slippage.',
      'Cross-checks: Read with Sum6, Lv2, PTI, and M- burden.',
      'Caution: Use with protocol validity and response quantity constraints.',
    ].join('\n')
  ),
  M_minus: localize(
    'M-',
    [
      'Definition: Human movement responses with poor form quality.',
      'Operational basis: Count of M responses coded with minus/insufficient form adequacy.',
      'Interpretive direction: Elevation suggests weaker reality-anchoring in ideational movement representations.',
      'Cross-checks: Interpret with XA%, X-%, PTI criteria, and WSum6.',
      'Caution: Confirm both movement and form-quality conditions are met.',
    ].join('\n')
  ),
  Mnone: localize(
    'Mnone',
    [
      'Definition: Human movement content lacking ordinary form support.',
      'Operational basis: Count of M responses with non-ordinary form quality classes.',
      'Interpretive direction: Higher values indicate less stable form-anchoring for ideational agency representations.',
      'Cross-checks: Review with M-, WDA%, and cognitive special scores.',
      'Caution: Consider denominator effects when total M is low.',
    ].join('\n')
  ),

  // === Affect ===
  FC_CF_C: localize(
    'FC:CF+C',
    [
      'Definition: Color modulation ratio contrasting form-modulated versus less-modulated color use.',
      'Operational basis: FC compared to combined CF and C frequencies.',
      'Interpretive direction: FC dominance suggests stronger modulation; CF/C dominance suggests less modulation control.',
      'Cross-checks: Integrate with Pure C, Afr, SumC profile, and D/AdjD.',
      'Caution: Ratio should be interpreted with total color response base size.',
    ].join('\n')
  ),
  PureC: localize(
    'Pure C',
    [
      'Definition: Count of pure chromatic color responses without form structure.',
      'Operational basis: Frequency of C determinant without form contribution.',
      'Interpretive direction: Elevation suggests more direct/unmodulated affective discharge style.',
      'Cross-checks: Interpret with FC:CF+C, Afr, and stress-load variables.',
      'Caution: Small absolute counts can still be meaningful; inspect raw responses.',
    ].join('\n')
  ),
  SumC_WSumC: localize(
    "SumC':WSumC",
    [
      'Definition: Balance of achromatic distress-color load to weighted chromatic affect expression.',
      "Operational basis: Ratio of SumC' to WSumC.",
      'Interpretive direction: Relative achromatic dominance may indicate distress-toned affective weighting.',
      'Cross-checks: Read with SumV/SumY, DEPI criteria, and FC:CF+C.',
      'Caution: Interpret ratio only with component-level review.',
    ].join('\n')
  ),
  Afr: localize(
    'Afr',
    [
      'Definition: Affective ratio indicating engagement with chromatic-affective card sectors.',
      'Operational basis: App formula uses responses on last three cards over first seven cards.',
      'Interpretive direction: Lower Afr can suggest affective constriction/avoidance; higher Afr suggests greater approach to affective stimuli.',
      'Cross-checks: Evaluate with FC:CF+C, Pure C, and EB/EBPer.',
      'Caution: Afr is sensitive to protocol length and card-level productivity.',
    ].join('\n')
  ),
  S_aff: localize(
    'S',
    [
      'Definition: White-space usage viewed in affective-cluster context.',
      'Operational basis: S-location count interpreted within affect domain patterning.',
      'Interpretive direction: May indicate oppositional/distancing affect handling when pattern-supported.',
      'Cross-checks: Integrate with S-, FC:CF+C, and interpersonal indicators.',
      'Caution: Do not infer affect style from S alone.',
    ].join('\n')
  ),
  Blends_R: localize(
    'Blends:R',
    [
      'Definition: Proportion of blended determinant responses relative to total responses.',
      'Operational basis: Blend count divided by R.',
      'Interpretive direction: Higher proportion suggests greater multidimensional processing complexity.',
      'Cross-checks: Read with DQ quality, WSum6, and mediation variables.',
      'Caution: Complexity is not automatically adaptive; quality matters.',
    ].join('\n')
  ),
  CP: localize(
    'CP',
    [
      'Definition: Color projection special score frequency.',
      'Operational basis: Count of CP-coded responses.',
      'Interpretive direction: May suggest externalized affective attribution pattern under some conditions.',
      'Cross-checks: Integrate with FC:CF+C, Pure C, and interpersonal profile.',
      'Caution: CP should be interpreted only as part of broader affective configuration.',
    ].join('\n')
  ),

  // === Mediation ===
  XA_percent: localize(
    'XA%',
    [
      'Definition: Overall acceptable form-use proportion in mediation domain.',
      'Operational basis: (FQ+, FQo, FQu) over total scorable responses.',
      'Interpretive direction: Higher XA% generally indicates stronger conventional mediation/reality adequacy.',
      'Cross-checks: Interpret with WDA%, X-%, and X+%.',
      'Caution: Inspect denominator size and protocol validity before strong conclusions.',
    ].join('\n')
  ),
  WDA_percent: localize(
    'WDA%',
    [
      'Definition: Form adequacy proportion within common perceptual areas (W and D domains).',
      'Operational basis: Acceptable FQ among responses in app-defined W/D location group.',
      'Interpretive direction: Higher WDA% supports stronger mediation in ordinary perceptual fields.',
      'Cross-checks: Compare with XA%, X-% and location distribution.',
      'Caution: Interpret cautiously when W/D sample is small.',
    ].join('\n')
  ),
  X_minus_percent: localize(
    'X-%',
    [
      'Definition: Distorted form proportion.',
      'Operational basis: Frequency of FQ- responses over total scorable responses.',
      'Interpretive direction: Higher X-% suggests greater mediation strain and perceptual distortion tendency.',
      'Cross-checks: Integrate with XA%, WDA%, PTI criteria, and M- burden.',
      'Caution: Single elevated percentage does not by itself establish severe disorder.',
    ].join('\n')
  ),
  S_minus: localize(
    'S-',
    [
      'Definition: Distorted white-space response count.',
      'Operational basis: Number of S-location responses coded with minus form quality.',
      'Interpretive direction: Elevation may indicate oppositional processing plus weak form mediation.',
      'Cross-checks: Review with S total, X-%, and interpersonal indicators.',
      'Caution: Requires both S usage and poor form fit; avoid inferential overreach.',
    ].join('\n')
  ),
  P: localize(
    'P',
    [
      'Definition: Popular response count.',
      'Operational basis: Number of responses matching commonly expected percepts per coding standards.',
      'Interpretive direction: Higher P generally reflects stronger conventional social-perceptual alignment.',
      'Cross-checks: Interpret with XA%, X+%, and overall protocol flexibility.',
      'Caution: Very high or very low values both require context and qualitative review.',
    ].join('\n')
  ),
  X_plus_percent: localize(
    'X+%',
    [
      'Definition: High-conventional form quality proportion.',
      'Operational basis: (FQ+ and FQo) over total scorable responses.',
      'Interpretive direction: Higher X+% indicates stronger conventional form mediation accuracy.',
      'Cross-checks: Evaluate with XA%, Xu%, and X-%.',
      'Caution: High X+% can co-exist with rigidity; examine alongside Lambda and flexibility indices.',
    ].join('\n')
  ),
  Xu_percent: localize(
    'Xu%',
    [
      'Definition: Unusual-but-acceptable form proportion.',
      'Operational basis: FQu frequency over total scorable responses.',
      'Interpretive direction: Elevated Xu% suggests idiosyncratic but still acceptable perception style.',
      'Cross-checks: Interpret jointly with X-% and X+% to separate creativity from distortion.',
      'Caution: Xu% alone does not indicate pathology or superior functioning.',
    ].join('\n')
  ),

  // === Processing ===
  Zf_proc: localize(
    'Zf',
    [
      'Definition: Frequency of organizational coding events viewed in processing cluster.',
      'Operational basis: Same Zf count interpreted specifically for information-processing style.',
      'Interpretive direction: Higher Zf suggests more frequent organization attempts in scanning.',
      'Cross-checks: Interpret with Zd_proc and W:D:Dd ratio.',
      'Caution: Frequency and efficiency are separate; pair with Zd.',
    ].join('\n')
  ),
  Zd_proc: localize(
    'Zd',
    [
      'Definition: Processing efficiency/imbalance marker from observed vs expected organization difference.',
      'Operational basis: Same Zd computation contextualized for processing interpretation.',
      'Interpretive direction: Positive/negative deviations indicate possible overincorporative vs underincorporative scanning style.',
      'Cross-checks: Read with Zf_proc, W:D:Dd, and mediation profile.',
      'Caution: Use moderate-range interpretation; extremes require validity checks.',
    ].join('\n')
  ),
  W_D_Dd: localize(
    'W:D:Dd',
    [
      'Definition: Distribution of whole, common-detail, and unusual-detail scanning.',
      'Operational basis: Ratio string from location counts.',
      'Interpretive direction: Pattern informs breadth versus selectivity of attentional allocation.',
      'Cross-checks: Integrate with Zd, DQ profile, and FQ pattern.',
      'Caution: Ratio shape must be read with total R and card distribution.',
    ].join('\n')
  ),
  W_M: localize(
    'W:M',
    [
      'Definition: Balance between whole-blot scanning and human movement ideational activity.',
      'Operational basis: Ratio of W location count to M movement count.',
      'Interpretive direction: Relative balance can inform broad processing style hypotheses.',
      'Cross-checks: Evaluate with EB, Ma:Mp, and W:D:Dd.',
      'Caution: Low M base makes ratio unstable; avoid overinterpretation.',
    ].join('\n')
  ),
  PSV: localize(
    'PSV',
    [
      'Definition: Perseveration special score frequency in processing cluster.',
      'Operational basis: Count of PSV-coded responses.',
      'Interpretive direction: Elevation suggests rigidity/repetition and reduced processing flexibility.',
      'Cross-checks: Read with Zd, OBS, and cognitive special score burden.',
      'Caution: Distinguish true perseveration from thematic continuity.',
    ].join('\n')
  ),
  DQ_plus_proc: localize(
    'DQ+',
    [
      'Definition: High-level developmental quality viewed from processing perspective.',
      'Operational basis: DQ+ frequency contextualized in processing cluster.',
      'Interpretive direction: Higher values indicate stronger integrative structuring during percept formation.',
      'Cross-checks: Compare with DQv_proc and mediation indices.',
      'Caution: Requires concurrent form adequacy to support adaptive interpretation.',
    ].join('\n')
  ),
  DQ_v_proc: localize(
    'DQv',
    [
      'Definition: Vague developmental quality viewed in processing cluster.',
      'Operational basis: DQv frequency contextualized for processing precision.',
      'Interpretive direction: Elevated values suggest reduced structural precision in processing.',
      'Cross-checks: Interpret with X-%, Zd, and cognitive special scores.',
      'Caution: Do not infer global impairment without converging indicators.',
    ].join('\n')
  ),

  // === Interpersonal ===
  COP: localize(
    'COP',
    [
      'Definition: Cooperative movement/content frequency in interpersonal cluster.',
      'Operational basis: Count of COP special-score occurrences.',
      'Interpretive direction: Higher COP suggests stronger representation of collaborative, mutually engaged interaction.',
      'Cross-checks: Interpret with AG, Human Cont, Pure H, and GHR/PHR balance.',
      'Caution: Cooperation themes should be evaluated for quality and context, not count alone.',
    ].join('\n')
  ),
  AG: localize(
    'AG',
    [
      'Definition: Aggressive movement/content frequency in interpersonal cluster.',
      'Operational basis: Count of AG special-score occurrences.',
      'Interpretive direction: Elevation indicates stronger representation of forceful/conflictual interpersonal action patterns.',
      'Cross-checks: Read with COP, MOR, S indicators, and affect modulation variables.',
      'Caution: AG signals theme prevalence, not inevitable real-world aggression.',
    ].join('\n')
  ),
  a_p_inter: localize(
    'a:p',
    [
      'Definition: Active-passive movement balance interpreted in interpersonal domain.',
      'Operational basis: Ratio of active and passive movement elements within interpersonal profile context.',
      'Interpretive direction: Active dominance suggests initiating interpersonal stance; passive dominance suggests receptive/withdrawing stance.',
      'Cross-checks: Integrate with COP/AG and interpersonal human-content variables.',
      'Caution: Interpret only with sufficient movement base and corroborating indicators.',
    ].join('\n')
  ),
  Food: localize(
    'Food',
    [
      'Definition: Food content frequency.',
      'Operational basis: Count of Fd/food-related content responses.',
      'Interpretive direction: In context, elevations may relate to dependency/nurturance themes.',
      'Cross-checks: Interpret with SumT_inter, CDI criteria, and interpersonal profile.',
      'Caution: Food content alone is nonspecific and requires pattern-level interpretation.',
    ].join('\n')
  ),
  SumT_inter: localize(
    'SumT',
    [
      'Definition: Texture determinant load interpreted in interpersonal domain.',
      'Operational basis: Sum of texture-related determinants (T family).',
      'Interpretive direction: Higher values may indicate stronger needs for contact/closeness.',
      'Cross-checks: Read with Food, COP/AG balance, and affect profile.',
      'Caution: Texture interpretation requires confirmed determinant coding quality.',
    ].join('\n')
  ),
  HumanCont: localize(
    'Human Cont',
    [
      'Definition: Total human-related content load.',
      'Operational basis: Aggregate of human content categories used in app computation.',
      'Interpretive direction: Higher load indicates stronger interpersonal salience in representational field.',
      'Cross-checks: Interpret with Pure H, GHR/PHR, COP/AG, and H ratio.',
      'Caution: Quantity does not equal adaptive interpersonal quality.',
    ].join('\n')
  ),
  PureH: localize(
    'Pure H',
    [
      'Definition: Frequency of whole realistic human content.',
      'Operational basis: Count of H content responses.',
      'Interpretive direction: Higher Pure H often supports more concrete integrated person representation.',
      'Cross-checks: Read with Human Cont, H ratio, and GHR/PHR outcomes.',
      'Caution: Interpret with form quality and interactional markers, not content alone.',
    ].join('\n')
  ),
  PER: localize(
    'PER',
    [
      'Definition: Personalization special score frequency.',
      'Operational basis: Count of PER-coded responses.',
      'Interpretive direction: Elevation may indicate defensive self-referential framing in interpersonal processing.',
      'Cross-checks: Evaluate with AG/COP, ISO index, and affect modulation variables.',
      'Caution: PER is stylistic/contextual and not diagnostic by itself.',
    ].join('\n')
  ),
  ISO_Index: localize(
    'Isol Idx',
    [
      'Definition: Isolation index for interpersonal distancing tendency.',
      'Operational basis: App-derived ratio combining isolation-linked content components.',
      'Interpretive direction: Higher values suggest greater interpersonal distance/limited relatedness patterning.',
      'Cross-checks: Interpret with Human Cont, Pure H, COP/AG, and S usage.',
      'Caution: Cultural/contextual communication style may influence this index.',
    ].join('\n')
  ),

  // === Self-Perception ===
  _3r_2_R: localize(
    '3r+(2)/R',
    [
      'Definition: Egocentricity index in self-perception domain.',
      'Operational basis: Composite ratio of reflection/pair-related weighting over total responses.',
      'Interpretive direction: Very low values may suggest reduced self-focus; very high values may suggest heightened self-focus.',
      'Cross-checks: Interpret with Fr+rF, H ratio, and interpersonal cluster.',
      'Caution: Midrange/context matters; avoid trait labels from this index alone.',
    ].join('\n')
  ),
  Fr_rF: localize(
    'Fr+rF',
    [
      'Definition: Reflection determinant frequency (Fr + rF).',
      'Operational basis: Count of reflection-coded responses.',
      'Interpretive direction: Elevation suggests increased reflective/self-referential representation emphasis.',
      'Cross-checks: Read with egocentricity index, pair coding behavior, and interpersonal profile.',
      'Caution: Reflection coding requires explicit reflection concept in response/inquiry.',
    ].join('\n')
  ),
  SumV_self: localize(
    'SumV',
    [
      'Definition: Vista load interpreted in self-perception context.',
      'Operational basis: Sum of V-family determinant contributions.',
      'Interpretive direction: Elevation can relate to self-critical/painful self-evaluative processing tendencies.',
      'Cross-checks: Integrate with MOR_self, DEPI indicators, and D/AdjD profile.',
      'Caution: Interpret only with converging self-domain variables.',
    ].join('\n')
  ),
  FD: localize(
    'FD',
    [
      'Definition: Form-dimension determinant frequency.',
      'Operational basis: Count of FD-coded responses (depth via form perspective).',
      'Interpretive direction: Often associated with introspective distance-taking style in interpretation frameworks.',
      'Cross-checks: Evaluate with SumV, egocentricity index, and affective load variables.',
      'Caution: FD can reflect adaptive reflective distancing in some contexts.',
    ].join('\n')
  ),
  An_Xy: localize(
    'An+Xy',
    [
      'Definition: Composite of anatomy and X-ray content frequencies.',
      'Operational basis: Sum of An and Xy content counts.',
      'Interpretive direction: Elevation may indicate increased bodily/somatic representational focus.',
      'Cross-checks: Read with MOR_self, SumV_self, and stress-load variables.',
      'Caution: Interpret as thematic emphasis, not medical symptom evidence.',
    ].join('\n')
  ),
  MOR_self: localize(
    'MOR',
    [
      'Definition: Morbid content load interpreted in self-perception domain.',
      'Operational basis: MOR frequency viewed within self-cluster context.',
      'Interpretive direction: Higher values suggest stronger negative/damaged self-representation themes.',
      'Cross-checks: Integrate with SumV_self, DEPI pattern, and egocentricity indicators.',
      'Caution: Requires full-protocol corroboration and contextual interview data.',
    ].join('\n')
  ),
  H_ratio: localize(
    'H:(H)+Hd+(Hd)',
    [
      'Definition: Human representational realism-integration ratio.',
      'Operational basis: Balance of whole realistic human content against less integrated/imaginary/partial human forms.',
      'Interpretive direction: Relative whole-realistic dominance suggests stronger integrated person representation quality.',
      'Cross-checks: Interpret with Human Cont, Pure H, GHR/PHR, and interpersonal variables.',
      'Caution: Ratio interpretation is unstable when human-content base is very small.',
    ].join('\n')
  ),

  // === Special Indices ===
  PTI: localize(
    'PTI',
    [
      'Definition: PTI (Perceptual-Thinking Index) is a composite screening index for possible thought/perceptual disorganization patterns in the protocol.',
      'Operational basis: Computed from multiple criteria (form-quality disruption, severe cognitive special scores, M- burden, and related thresholds in this app).',
      'Interpretive direction: More positive criteria indicate stronger concern for mediation-ideation disruption, not a standalone diagnosis.',
      'Cross-checks: Read with XA%, WDA%, X-%, WSum6, M-, and protocol quality (including response productivity).',
      'Common misreading: PTI elevation does not by itself confirm psychosis; low PTI does not rule out clinically relevant disturbance.',
      'Caution: Use only as a structured risk flag within full clinical integration.',
    ].join('\n')
  ),
  DEPI: localize(
    'DEPI',
    [
      'Definition: DEPI (Depression Index) is a composite marker of depressive-style affective and cognitive burden.',
      'Operational basis: Derived from multiple weighted criteria in this app (including affective constriction/distress and self-evaluative burden markers).',
      'Interpretive direction: Higher DEPI pattern suggests increased depressive features in protocol organization, not a diagnosis by itself.',
      'Cross-checks: Interpret with SumV, MOR, Afr, FD, and contextual interview data.',
      'Common misreading: Elevated DEPI does not prove current major depressive episode; normal DEPI does not exclude depression.',
      'Caution: Evaluate chronicity, situational stressors, and contradictory indicators before conclusion.',
    ].join('\n')
  ),
  CDI: localize(
    'CDI',
    [
      'Definition: CDI (Coping Deficit Index) estimates limitations in coping and interpersonal adaptation resources.',
      'Operational basis: Built from criteria reflecting coping resources, interpersonal reciprocity indicators, and affect-regulation load.',
      'Interpretive direction: Higher CDI pattern suggests greater adaptive strain in social-coping demands, especially under stress.',
      'Cross-checks: Review with EA, AdjD, COP/AG balance, SumT, Food, and Isol Idx.',
      'Common misreading: CDI elevation is not equivalent to fixed personality impairment; context and role demands matter.',
      'Caution: Combine with functional history and behavioral observations before high-stakes interpretation.',
    ].join('\n')
  ),
  SCON: localize(
    'S-CON',
    [
      'Definition: S-CON (Suicide Constellation) is a structured risk-screening constellation for self-harm vulnerability signals.',
      'Operational basis: Calculated from multi-criterion configuration in this app (including dysphoric burden, mediation strain, and related risk markers).',
      'Interpretive direction: More positive criteria increase concern and indicate need for immediate, careful clinical risk follow-up.',
      'Cross-checks: Integrate with clinical interview, current ideation/intent data, history of attempts, and real-time safety factors.',
      'Common misreading: S-CON is not a prediction tool with deterministic certainty; low score does not eliminate risk.',
      'Caution: Treat as escalation trigger for direct assessment, not as a stand-alone decision endpoint.',
    ].join('\n')
  ),
  HVI: localize(
    'HVI',
    [
      'Definition: HVI (Hypervigilance Index) captures a guarded, threat-monitoring interpersonal stance.',
      'Operational basis: Derived from a required gate condition plus additional criteria count in this app configuration.',
      'Interpretive direction: Positive HVI pattern suggests persistent scanning for threat, mistrust, and defensive monitoring style.',
      'Cross-checks: Read with Zd, Zf, S, interpersonal movement pattern (COP/AG), and narrative context.',
      'Common misreading: HVI elevation does not automatically indicate paranoia; it may also reflect learned defensive adaptation.',
      'Caution: Differentiate trait-like vigilance from acute situational threat response.',
    ].join('\n')
  ),
  OBS: localize(
    'OBS',
    [
      'Definition: OBS (Obsessive Style Index) reflects overcontrol, precision focus, and compulsive stylistic organization tendencies.',
      'Operational basis: Determined by rule-based condition set in this app (including form/organizational and control-related markers).',
      'Interpretive direction: Positive OBS profile suggests rigidity, perfectionistic control, and constrained flexibility under demand.',
      'Cross-checks: Integrate with PSV, Zd, DQ profile, and affect modulation indicators.',
      'Common misreading: OBS positivity alone is not OCD diagnosis and does not establish impairment severity.',
      'Caution: Confirm whether control style improves functioning or produces clinically meaningful cost.',
    ].join('\n')
  ),
};

const KO_DESCRIPTION_OVERRIDES: Partial<Record<string, string>> = {
  Zf: [
    'Definition: Z 채점이 부여된 반응의 빈도입니다.',
    'Operational basis: 유효한 Z 코딩이 있는 반응 수를 집계합니다.',
    'Interpretive direction: 값이 높을수록 조직화 시도가 자주 나타나고, 낮을수록 조직화 시도가 적습니다.',
    'Cross-checks: ZSum, Zd, W:D:Dd와 함께 해석합니다.',
    'Caution: 프로토콜 길이(R)와 반응 생산성을 함께 고려해야 합니다.',
  ].join('\n'),
  ZSum: [
    'Definition: 모든 Z 코딩 반응의 가중합입니다.',
    'Operational basis: 앱의 카드별 Z 가중치 테이블을 합산해 계산합니다.',
    'Interpretive direction: 값이 높을수록 전체 조직화 활동량이 큽니다.',
    'Cross-checks: Zf, ZEst와 함께 해석한 뒤 스타일 결론을 내립니다.',
    'Caution: 절대값 단독 해석은 피하고 기대값 대비를 확인해야 합니다.',
  ].join('\n'),
  ZEst: [
    'Definition: 프로토콜 크기(Zf)에 따른 기대 ZSum 값입니다.',
    'Operational basis: 앱의 ZEST 표에서 Zf 기준으로 조회합니다.',
    'Interpretive direction: Zd 해석을 위한 기준선 역할을 합니다.',
    'Cross-checks: 관찰값(ZSum)과 Zd를 함께 확인합니다.',
    'Caution: R이 매우 짧거나 범위 밖인 경우 안정성이 떨어집니다.',
  ].join('\n'),
  Zd: [
    'Definition: 관찰된 조직화 활동과 기대 수준의 차이입니다.',
    'Operational basis: Zd = ZSum - ZEst(앱 출력 기준 반올림 포함).',
    'Interpretive direction: 양(+)은 과도한 스캐닝/포섭 경향, 음(-)은 과소 스캐닝/포섭 경향을 시사할 수 있습니다.',
    'Cross-checks: Zf, W:D:Dd, 매개(Mediation) 지표와 함께 해석합니다.',
    'Caution: 극단값은 타당도 점검 후 해석해야 합니다.',
  ].join('\n'),
  W: [
    'Definition: 전체반점(Whole) 위치 반응 수입니다.',
    'Operational basis: 전체 영역 계열 위치 코딩을 집계합니다.',
    'Interpretive direction: 값이 높으면 보다 광범위한 전역 스캐닝 경향을 시사할 수 있습니다.',
    'Cross-checks: D, Dd, W:M과 함께 봅니다.',
    'Caution: W 단독으로 적응/부적응을 판단하지 않습니다.',
  ].join('\n'),
  Dd: [
    'Definition: 비전형 세부(Dd) 위치 반응 수입니다.',
    'Operational basis: 드물거나 선택적인 세부 영역 사용 반응을 집계합니다.',
    'Interpretive direction: 높을수록 선택적/개별화된 주의 초점 경향을 시사할 수 있습니다.',
    'Cross-checks: FQ, X-%, 처리(Processing) 패턴과 함께 해석합니다.',
    'Caution: 반복 패턴이 확인되기 전 과도한 의미부여를 피합니다.',
  ].join('\n'),
  S: [
    'Definition: 백지공간(S) 위치 사용 빈도입니다.',
    'Operational basis: 앱 규칙에 따라 S가 포함된 위치 코딩을 집계합니다.',
    'Interpretive direction: 일부 맥락에서 거리두기/반대 경향을 시사할 수 있습니다.',
    'Cross-checks: S-, FQ, 대인/정서 군집과 함께 해석합니다.',
    'Caution: S 단독 해석은 피합니다.',
  ].join('\n'),
  dq_plus: [
    'Definition: 높은 통합 발달질(DQ+) 빈도입니다.',
    'Operational basis: DQ+ 코딩 반응 수를 집계합니다.',
    'Interpretive direction: 높을수록 통합적 구조화 능력을 시사합니다.',
    'Cross-checks: DQo, DQv, 매개 지표와 함께 확인합니다.',
    'Caution: DQ는 FQ와 함께 봐야 합니다.',
  ].join('\n'),
  dq_o: [
    'Definition: 보통 발달질(DQo) 빈도입니다.',
    'Operational basis: DQo 코딩 반응 수를 집계합니다.',
    'Interpretive direction: 전형적이고 충분한 구조화 빈도를 나타냅니다.',
    'Cross-checks: DQ+/DQv 분포, FQ와 함께 해석합니다.',
    'Caution: DQo 우세 자체를 경직/결함으로 해석하지 않습니다.',
  ].join('\n'),
  dq_vplus: [
    'Definition: 모호+부분 통합(DQv/+) 빈도입니다.',
    'Operational basis: DQv/+ 코딩 반응 수를 집계합니다.',
    'Interpretive direction: 모호성과 부분 통합 시도가 함께 나타남을 시사합니다.',
    'Cross-checks: DQv, DQ+ 비율과 함께 비교합니다.',
    'Caution: Inquiry 기반 코딩 신뢰도를 먼저 확인합니다.',
  ].join('\n'),
  dq_v: [
    'Definition: 모호 발달질(DQv) 빈도입니다.',
    'Operational basis: DQv 코딩 반응 수를 집계합니다.',
    'Interpretive direction: 값이 높을수록 구조 정밀도 저하를 시사할 수 있습니다.',
    'Cross-checks: FQ 패턴, Z 관련 제약과 함께 해석합니다.',
    'Caution: 이 앱에서는 DQv 입력 시 FQ/Z 제약이 자동 적용됩니다.',
  ].join('\n'),
  R: [
    'Definition: 유효 채점 반응 총수입니다.',
    'Operational basis: 필수 채점 필드가 채워진 반응만 집계합니다.',
    'Interpretive direction: 너무 낮으면 안정성이 약해지고, 너무 높으면 복잡성이 커집니다.',
    'Cross-checks: 모든 하위 지표 해석 전 R을 타당도 맥락으로 확인합니다.',
    'Caution: R이 낮으면 고신뢰 해석을 피합니다.',
  ].join('\n'),
  Lambda: [
    'Definition: 형태 중심 단순화 비율(Lambda)입니다.',
    'Operational basis: 순수 F / 비F 반응으로 계산(앱의 0나눗셈 보정 포함).',
    'Interpretive direction: 높으면 형태 중심 단순화 경향, 낮으면 정서/복합 관여 확장을 시사할 수 있습니다.',
    'Cross-checks: Afr, FC:CF+C, DQ/FQ와 함께 해석합니다.',
    'Caution: 극단값은 R과 전체 프로토콜 질을 함께 점검합니다.',
  ].join('\n'),
  EB: [
    'Definition: 관념적 자원(M)과 색채 정서 자원(WSumC)의 균형입니다.',
    'Operational basis: EB를 M : WSumC 형태로 산출합니다.',
    'Interpretive direction: 어느 쪽 우세인지가 선호 대처 방향을 시사합니다.',
    'Cross-checks: EBPer, EA, D/AdjD, 정서 조절 지표와 함께 봅니다.',
    'Caution: EB는 스타일 정보이며 단독 병리 지표가 아닙니다.',
  ].join('\n'),
  EA: [
    'Definition: 가용 대처 자원 추정치입니다.',
    'Operational basis: EA = M + WSumC.',
    'Interpretive direction: 높을수록 가용 자원이 큰 편입니다.',
    'Cross-checks: es 및 D/AdjD와 함께 자원-부하 균형으로 해석합니다.',
    'Caution: 자원은 항상 동시 부하(es)와 함께 해석합니다.',
  ].join('\n'),
  EBPer: [
    'Definition: EB 편향(한쪽 치우침) 정도/플래그입니다.',
    'Operational basis: 앱 상수의 EB 비율 기준으로 도출합니다.',
    'Interpretive direction: 높을수록 한 가지 처리 스타일 의존이 강할 수 있습니다.',
    'Cross-checks: Lambda, Afr, 조정 지표와 함께 확인합니다.',
    'Caution: 한쪽성은 맥락에 따라 적응적일 수도 있습니다.',
  ].join('\n'),
  eb: [
    'Definition: 활성화 원천(FM+m) 대 음영 부하(SumC\'+SumT+SumV+SumY) 비율입니다.',
    'Operational basis: eb = (FM+m) : (SumC\'+SumT+SumV+SumY).',
    'Interpretive direction: 좌우 균형이 욕구/활성화 대 고통성 부하 구성을 보여줍니다.',
    'Cross-checks: es, EA, SumT/SumV/SumY와 함께 해석합니다.',
    'Caution: 문자열 비율만 보지 말고 구성요소 수준으로 확인합니다.',
  ].join('\n'),
  es: [
    'Definition: 경험된 자극/스트레스 부하 추정치입니다.',
    'Operational basis: es = FM + m + SumC\' + SumT + SumV + SumY.',
    'Interpretive direction: 높을수록 현재 체감 부하가 큽니다.',
    'Cross-checks: EA와 직접 비교하여 D/AdjD 의미를 해석합니다.',
    'Caution: es 단독으로 기능저하를 단정하지 않습니다.',
  ].join('\n'),
  D: [
    'Definition: 현재 스트레스 내성 균형 지표(D)입니다.',
    'Operational basis: EA-es를 앱 D 테이블 버킷으로 변환해 산출합니다.',
    'Interpretive direction: 음수일수록 현재 부하가 가용 자원을 초과할 가능성을 시사합니다.',
    'Cross-checks: AdjD, AdjEs, 코어 패턴과 함께 봅니다.',
    'Caution: 상태 민감 지표로 취급하고 고정 특성으로 단정하지 않습니다.',
  ].join('\n'),
  AdjD: [
    'Definition: 일시적 부하를 보정한 내성 지표(Adj D)입니다.',
    'Operational basis: EA-AdjEs를 같은 D 테이블 규칙으로 계산합니다.',
    'Interpretive direction: D와의 차이는 상황성 압력 기여를 분리해 보는 데 도움을 줍니다.',
    'Cross-checks: D와 AdjD의 간격을 함께 해석합니다.',
    'Caution: 보정 구성요소 가정의 타당성을 확인해야 합니다.',
  ].join('\n'),
  AdjEs: [
    'Definition: Adj D 계산에 쓰는 보정 부하값입니다.',
    'Operational basis: es 구성요소를 앱 규칙에 따라 보정해 산출합니다.',
    'Interpretive direction: 기준 내성 추정(AdjD)을 위한 보조 변수입니다.',
    'Cross-checks: es, D, AdjD와 함께 확인합니다.',
    'Caution: 단독 해석 대상이 아니라 계산 보조 변수로 사용합니다.',
  ].join('\n'),
  a_p: [
    'Definition: 관념 영역의 능동-수동 운동 균형(a:p)입니다.',
    'Operational basis: 능동/수동 운동 요소 비율로 산출합니다.',
    'Interpretive direction: 능동 우세는 주도적 접근, 수동 우세는 수용적/비주도적 경향을 시사할 수 있습니다.',
    'Cross-checks: Ma:Mp, EB 방향, 대인 a:p와 함께 해석합니다.',
    'Caution: 운동 총량이 적으면 비율 안정성이 떨어집니다.',
  ].join('\n'),
  Ma_Mp: [
    'Definition: 인간운동 내 능동-수동 균형(Ma:Mp)입니다.',
    'Operational basis: Ma 대 Mp 비율로 계산합니다.',
    'Interpretive direction: 의도적 행위 표상의 주도성/수동성 방향을 보여줄 수 있습니다.',
    'Cross-checks: 총 M, a:p, 조절/내성 지표와 함께 봅니다.',
    'Caution: 분모가 작을 때 과해석을 피합니다.',
  ].join('\n'),
  _2AB_Art_Ay: [
    'Definition: 추상성과 특정 내용 지표를 결합한 관념 복합지표입니다.',
    'Operational basis: 2AB + (Art + Ay)를 합산합니다.',
    'Interpretive direction: 높을수록 추상적·개념적 처리 강조를 시사할 수 있습니다.',
    'Cross-checks: DQ, blends, 인지 특수점수와 함께 해석합니다.',
    'Caution: 추상성 증가는 현실검증 우수와 동일하지 않습니다.',
  ].join('\n'),
  MOR: [
    'Definition: 관념 맥락에서의 MOR(손상/병리 내용) 빈도입니다.',
    'Operational basis: MOR 특수점수 출현 수를 집계합니다.',
    'Interpretive direction: 높을수록 손상·부정 표상 주제 비중이 높을 수 있습니다.',
    'Cross-checks: SumV, DEPI, 자기지각 지표와 함께 확인합니다.',
    'Caution: MOR 단독 해석은 피하고 패턴으로 통합합니다.',
  ].join('\n'),
  Sum6: [
    'Definition: 인지 특수점수 6군의 총 빈도입니다.',
    'Operational basis: DV/INCOM/DR/FABCOM/ALOG/CONTAM을 합산합니다.',
    'Interpretive direction: 높을수록 인지적 이탈 부담이 큽니다.',
    'Cross-checks: Lv2, WSum6, M-, 매개 지표와 함께 해석합니다.',
    'Caution: 중증도는 단순 빈도보다 가중지표(WSum6)를 우선 확인합니다.',
  ].join('\n'),
  Lv2: [
    'Definition: 2수준(Level 2) 중증 인지 특수점수 빈도입니다.',
    'Operational basis: DV2/INCOM2/DR2/FABCOM2를 합산합니다.',
    'Interpretive direction: 높을수록 더 심한 와해 신호를 시사합니다.',
    'Cross-checks: WSum6, X-%, XA%와 함께 봅니다.',
    'Caution: 레벨 구분 코딩 신뢰도를 먼저 점검합니다.',
  ].join('\n'),
  WSum6: [
    'Definition: 인지 이탈 중증도 가중합 지표입니다.',
    'Operational basis: 앱 가중치 표로 특수점수를 가중 합산합니다.',
    'Interpretive direction: 높을수록 관념 와해의 중증도가 큰 편입니다.',
    'Cross-checks: Sum6, Lv2, PTI, M-와 함께 해석합니다.',
    'Caution: R과 프로토콜 타당도 맥락 없이 단정하지 않습니다.',
  ].join('\n'),
  M_minus: [
    'Definition: 형태질이 나쁜 인간운동(M-) 빈도입니다.',
    'Operational basis: 인간운동 반응 중 형태 적합도가 낮은 반응을 집계합니다.',
    'Interpretive direction: 높을수록 관념의 현실고정 약화를 시사할 수 있습니다.',
    'Cross-checks: XA%, X-%, PTI, WSum6와 함께 봅니다.',
    'Caution: 운동성/형태질 조건이 모두 충족되는지 확인해야 합니다.',
  ].join('\n'),
  Mnone: [
    'Definition: 보통 형태질 지지가 없는 인간운동 빈도입니다.',
    'Operational basis: 비보통 형태질의 M 반응을 집계합니다.',
    'Interpretive direction: 높을수록 행위 표상의 형태 고정성이 약할 수 있습니다.',
    'Cross-checks: M-, WDA%, 인지 특수점수와 함께 해석합니다.',
    'Caution: 총 M이 적으면 비율/빈도 해석 안정성이 떨어집니다.',
  ].join('\n'),
  FC_CF_C: [
    'Definition: 색채 조절 비율(FC:CF+C)입니다.',
    'Operational basis: 형태조절 색채(FC)와 비조절 색채(CF+C)를 비교합니다.',
    'Interpretive direction: FC 우세는 상대적 조절성, CF/C 우세는 상대적 비조절성을 시사할 수 있습니다.',
    'Cross-checks: Pure C, Afr, D/AdjD와 함께 해석합니다.',
    'Caution: 색채 반응 기반 수가 적으면 과해석을 피합니다.',
  ].join('\n'),
  PureC: [
    'Definition: 순수 색채(Pure C) 빈도입니다.',
    'Operational basis: 형태 없이 C 결정인이 부여된 반응 수를 집계합니다.',
    'Interpretive direction: 높을수록 직접적/비조절적 정서 표출 경향을 시사할 수 있습니다.',
    'Cross-checks: FC:CF+C, Afr, 부하 지표(es)와 함께 봅니다.',
    'Caution: 절대 빈도뿐 아니라 실제 반응 내용도 함께 확인합니다.',
  ].join('\n'),
  SumC_WSumC: [
    'Definition: SumC\':WSumC 비율(무채색 고통성 대 유채색 정서 표현 균형)입니다.',
    'Operational basis: SumC\'를 WSumC로 비교해 산출합니다.',
    'Interpretive direction: 무채색 측 우세는 고통성 정서 부담 비중 증가를 시사할 수 있습니다.',
    'Cross-checks: SumV/SumY, DEPI, FC:CF+C와 함께 해석합니다.',
    'Caution: 비율 단독보다 구성요소를 함께 검토합니다.',
  ].join('\n'),
  Afr: [
    'Definition: 정서 비율(Afr)입니다.',
    'Operational basis: 앱 기준으로 후반 카드(8-10) 반응 / 전반 카드(1-7) 반응으로 계산합니다.',
    'Interpretive direction: 낮으면 정서 자극 회피/수축, 높으면 정서 자극 접근 경향을 시사할 수 있습니다.',
    'Cross-checks: FC:CF+C, Pure C, EB/EBPer와 함께 해석합니다.',
    'Caution: 카드별 반응량 영향이 크므로 R 맥락을 확인합니다.',
  ].join('\n'),
  S_aff: [
    'Definition: 정서 맥락에서 본 S 사용 지표입니다.',
    'Operational basis: S 위치 사용을 정서 군집 문맥에서 해석합니다.',
    'Interpretive direction: 패턴이 동반될 때 거리두기/대항적 정서 처리 가능성을 시사할 수 있습니다.',
    'Cross-checks: S-, FC:CF+C, 대인 지표와 함께 봅니다.',
    'Caution: S 단독으로 정서 스타일을 결론내리지 않습니다.',
  ].join('\n'),
  Blends_R: [
    'Definition: 반응당 블렌드 비율(Blends:R)입니다.',
    'Operational basis: 블렌드 수를 R로 나눠 산출합니다.',
    'Interpretive direction: 높을수록 다차원 처리 복합성이 큰 편일 수 있습니다.',
    'Cross-checks: DQ, WSum6, 매개 지표와 함께 해석합니다.',
    'Caution: 복합성 증가는 항상 적응적이라는 뜻이 아닙니다.',
  ].join('\n'),
  CP: [
    'Definition: CP(색채 투사) 특수점수 빈도입니다.',
    'Operational basis: CP 코딩 반응 수를 집계합니다.',
    'Interpretive direction: 일부 맥락에서 외현화된 정서 귀인 경향을 시사할 수 있습니다.',
    'Cross-checks: FC:CF+C, Pure C, 대인 패턴과 함께 해석합니다.',
    'Caution: CP 단독 해석을 피하고 정서 군집에서 통합합니다.',
  ].join('\n'),
  XA_percent: [
    'Definition: 수용 가능한 형태사용 비율(XA%)입니다.',
    'Operational basis: (FQ+, FQo, FQu) / 전체 스코어 가능 반응으로 계산합니다.',
    'Interpretive direction: 높을수록 매개/현실 적합성이 상대적으로 양호함을 시사합니다.',
    'Cross-checks: WDA%, X-%, X+%와 함께 해석합니다.',
    'Caution: 분모가 작으면 비율 안정성이 낮습니다.',
  ].join('\n'),
  WDA_percent: [
    'Definition: 일반 지각영역(W,D)에서의 형태 적합 비율(WDA%)입니다.',
    'Operational basis: 앱의 W/D 영역 반응 중 수용 가능한 FQ 비율로 계산합니다.',
    'Interpretive direction: 높을수록 일상적 지각 장면에서 매개 질이 양호함을 시사합니다.',
    'Cross-checks: XA%, X-%, 위치 분포와 함께 확인합니다.',
    'Caution: W/D 표본 수가 적으면 해석을 보수적으로 합니다.',
  ].join('\n'),
  X_minus_percent: [
    'Definition: 왜곡 형태질 비율(X-%)입니다.',
    'Operational basis: FQ- / 전체 스코어 가능 반응으로 계산합니다.',
    'Interpretive direction: 높을수록 매개 부담 및 지각 왜곡 경향 신호가 커질 수 있습니다.',
    'Cross-checks: XA%, WDA%, PTI, M-와 함께 해석합니다.',
    'Caution: 단일 비율 상승만으로 중증 결론을 내리지 않습니다.',
  ].join('\n'),
  S_minus: [
    'Definition: 백지공간 왜곡 반응 빈도(S-)입니다.',
    'Operational basis: S 위치 반응 중 형태질이 -인 반응을 집계합니다.',
    'Interpretive direction: 높을수록 대항성 + 형태 왜곡 결합 패턴을 시사할 수 있습니다.',
    'Cross-checks: S 총량, X-%, 대인 지표와 함께 봅니다.',
    'Caution: S 사용과 저형태질이 모두 충족돼야 합니다.',
  ].join('\n'),
  P: [
    'Definition: 평범반응(P) 빈도입니다.',
    'Operational basis: 규준적으로 흔한 반응과 일치하는 코딩 수를 집계합니다.',
    'Interpretive direction: 높을수록 관습적 사회지각 합치 경향을 시사할 수 있습니다.',
    'Cross-checks: XA%, X+%, 유연성 지표와 함께 해석합니다.',
    'Caution: 매우 높거나 매우 낮은 값 모두 맥락 검토가 필요합니다.',
  ].join('\n'),
  X_plus_percent: [
    'Definition: 높은 관습 형태질 비율(X+%)입니다.',
    'Operational basis: (FQ+ + FQo) / 전체 스코어 가능 반응으로 계산합니다.',
    'Interpretive direction: 높을수록 관습적 형태 매개 정확성이 높은 편입니다.',
    'Cross-checks: XA%, Xu%, X-%와 함께 해석합니다.',
    'Caution: 높은 X+%는 경직성과 공존할 수 있어 Lambda도 함께 봅니다.',
  ].join('\n'),
  Xu_percent: [
    'Definition: 특이하지만 수용 가능한 형태질 비율(Xu%)입니다.',
    'Operational basis: FQu / 전체 스코어 가능 반응으로 계산합니다.',
    'Interpretive direction: 상승은 비전형적이지만 왜곡은 아닌 지각 경향을 시사할 수 있습니다.',
    'Cross-checks: X-%, X+%와 함께 비교해 창의성/왜곡을 구분합니다.',
    'Caution: Xu% 단독으로 병리나 우수성을 단정하지 않습니다.',
  ].join('\n'),
  Zf_proc: [
    'Definition: 처리 영역에서 본 조직화 빈도(Zf)입니다.',
    'Operational basis: Z 코딩 빈도를 처리(Processing) 맥락으로 해석합니다.',
    'Interpretive direction: 높을수록 조직화 시도가 자주 나타날 수 있습니다.',
    'Cross-checks: Zd_proc, W:D:Dd와 함께 해석합니다.',
    'Caution: 빈도와 효율은 다르므로 Zd와 함께 확인합니다.',
  ].join('\n'),
  Zd_proc: [
    'Definition: 처리 효율/불균형 지표(Zd)입니다.',
    'Operational basis: 관찰 조직화와 기대 조직화의 차이를 처리 맥락으로 해석합니다.',
    'Interpretive direction: 양/음 편차는 과포섭형/과소포섭형 처리 경향을 시사할 수 있습니다.',
    'Cross-checks: Zf_proc, W:D:Dd, 매개 지표와 함께 봅니다.',
    'Caution: 극단값은 타당도와 함께 보수적으로 해석합니다.',
  ].join('\n'),
  W_D_Dd: [
    'Definition: W:D:Dd 스캐닝 분포 비율입니다.',
    'Operational basis: 전체/일반세부/비전형세부 위치 수를 비율로 표현합니다.',
    'Interpretive direction: 주의의 폭과 선택성 패턴을 보여줍니다.',
    'Cross-checks: Zd, DQ, FQ 패턴과 함께 해석합니다.',
    'Caution: R이 낮으면 분포비 해석 안정성이 떨어집니다.',
  ].join('\n'),
  W_M: [
    'Definition: 전체반점 처리와 인간운동의 균형(W:M)입니다.',
    'Operational basis: W 위치 수와 M 수의 비율로 계산합니다.',
    'Interpretive direction: 인지 처리 폭과 관념적 행위표상 간 균형을 시사할 수 있습니다.',
    'Cross-checks: EB, Ma:Mp, W:D:Dd와 함께 확인합니다.',
    'Caution: M이 적을 때 비율 과해석을 피합니다.',
  ].join('\n'),
  PSV: [
    'Definition: 반복고착(PSV) 빈도입니다.',
    'Operational basis: PSV 특수점수 출현 수를 집계합니다.',
    'Interpretive direction: 높을수록 처리 경직/반복 경향을 시사할 수 있습니다.',
    'Cross-checks: Zd, OBS, 인지 특수점수와 함께 해석합니다.',
    'Caution: 단순 주제 연속성과 PSV를 구분해야 합니다.',
  ].join('\n'),
  DQ_plus_proc: [
    'Definition: 처리 관점의 DQ+ 빈도입니다.',
    'Operational basis: DQ+ 빈도를 처리 군집 문맥에서 해석합니다.',
    'Interpretive direction: 높을수록 통합적 구조화 처리 능력을 시사할 수 있습니다.',
    'Cross-checks: DQv_proc, 매개 지표와 함께 봅니다.',
    'Caution: 형태 적합(FQ) 동반 여부를 함께 확인해야 합니다.',
  ].join('\n'),
  DQ_v_proc: [
    'Definition: 처리 관점의 DQv 빈도입니다.',
    'Operational basis: DQv 빈도를 처리 정밀도 문맥에서 해석합니다.',
    'Interpretive direction: 높을수록 구조 정밀도 저하를 시사할 수 있습니다.',
    'Cross-checks: X-%, Zd, 인지 특수점수와 함께 해석합니다.',
    'Caution: 단일 지표로 전반 기능 저하를 단정하지 않습니다.',
  ].join('\n'),
  COP: [
    'Definition: 협력 상호작용(COP) 빈도입니다.',
    'Operational basis: COP 특수점수 출현 수를 집계합니다.',
    'Interpretive direction: 높을수록 협력적 대인 표상 경향을 시사할 수 있습니다.',
    'Cross-checks: AG, Human Cont, Pure H, GHR/PHR와 함께 해석합니다.',
    'Caution: 빈도만이 아니라 상호작용의 질을 함께 봅니다.',
  ].join('\n'),
  AG: [
    'Definition: 공격 상호작용(AG) 빈도입니다.',
    'Operational basis: AG 특수점수 출현 수를 집계합니다.',
    'Interpretive direction: 높을수록 갈등/공격적 대인 행동 표상 비중이 클 수 있습니다.',
    'Cross-checks: COP, MOR, S, 정서조절 지표와 함께 해석합니다.',
    'Caution: AG는 주제 신호이며 실제 행동을 직접 예측하지 않습니다.',
  ].join('\n'),
  a_p_inter: [
    'Definition: 대인 영역의 능동-수동 균형(a:p)입니다.',
    'Operational basis: 대인 문맥에서 능동/수동 운동 요소 비율을 해석합니다.',
    'Interpretive direction: 능동 우세는 주도적, 수동 우세는 수용적/후퇴적 자세를 시사할 수 있습니다.',
    'Cross-checks: COP/AG, Human Cont, Pure H와 함께 확인합니다.',
    'Caution: 충분한 운동 표본이 있는지 먼저 점검합니다.',
  ].join('\n'),
  Food: [
    'Definition: 음식 내용(Food) 빈도입니다.',
    'Operational basis: Food 내용 코딩 출현 수를 집계합니다.',
    'Interpretive direction: 맥락에 따라 의존/돌봄 욕구 주제를 시사할 수 있습니다.',
    'Cross-checks: SumT_inter, CDI, 대인 패턴과 함께 해석합니다.',
    'Caution: Food 단독으로 성격 특성을 단정하지 않습니다.',
  ].join('\n'),
  SumT_inter: [
    'Definition: 대인 맥락의 질감 결정인 합(SumT)입니다.',
    'Operational basis: T 계열 결정인을 합산합니다.',
    'Interpretive direction: 높을수록 접촉/친밀 욕구 주제가 강화될 수 있습니다.',
    'Cross-checks: Food, COP/AG, 정서 패턴과 함께 해석합니다.',
    'Caution: T 코딩 신뢰도(질문 단계 확인)가 중요합니다.',
  ].join('\n'),
  HumanCont: [
    'Definition: 인간 관련 내용 총량(Human Cont)입니다.',
    'Operational basis: 인간 관련 내용 코드를 합산해 계산합니다.',
    'Interpretive direction: 높을수록 대인 표상의 현저성이 큽니다.',
    'Cross-checks: Pure H, H ratio, COP/AG, GHR/PHR와 함께 해석합니다.',
    'Caution: 양이 많아도 질이 항상 좋은 것은 아닙니다.',
  ].join('\n'),
  PureH: [
    'Definition: 현실적 완전 인간내용(Pure H) 빈도입니다.',
    'Operational basis: H 코딩 반응 수를 집계합니다.',
    'Interpretive direction: 높을수록 통합적 인물 표상 경향을 시사할 수 있습니다.',
    'Cross-checks: Human Cont, H ratio, GHR/PHR와 함께 확인합니다.',
    'Caution: 내용 빈도는 형태질/상호작용 질과 함께 봐야 합니다.',
  ].join('\n'),
  PER: [
    'Definition: 개인화(PER) 특수점수 빈도입니다.',
    'Operational basis: PER 코딩 반응 수를 집계합니다.',
    'Interpretive direction: 상승 시 방어적 자기참조적 대인 프레이밍을 시사할 수 있습니다.',
    'Cross-checks: AG/COP, ISO Index, 정서 조절 지표와 함께 해석합니다.',
    'Caution: PER 단독은 진단적 의미가 제한적입니다.',
  ].join('\n'),
  ISO_Index: [
    'Definition: 고립 지수(Isol Idx)입니다.',
    'Operational basis: 앱 규칙의 고립 관련 내용 비율로 산출합니다.',
    'Interpretive direction: 높을수록 대인 거리두기/연결 제한 경향을 시사할 수 있습니다.',
    'Cross-checks: Human Cont, Pure H, COP/AG, S와 함께 해석합니다.',
    'Caution: 문화적 의사소통 스타일 영향을 함께 고려합니다.',
  ].join('\n'),
  _3r_2_R: [
    'Definition: 자기중심성 지수(3r+(2)/R)입니다.',
    'Operational basis: 반사/쌍 관련 가중을 총 반응수로 나눈 복합비율입니다.',
    'Interpretive direction: 매우 낮으면 자기초점 저하, 매우 높으면 자기초점 과다를 시사할 수 있습니다.',
    'Cross-checks: Fr+rF, H ratio, 대인 군집과 함께 해석합니다.',
    'Caution: 중간범위/맥락을 포함해 해석하고 단일 라벨링을 피합니다.',
  ].join('\n'),
  Fr_rF: [
    'Definition: 반사 결정인 빈도(Fr+rF)입니다.',
    'Operational basis: Fr/rF 코딩 반응 수를 집계합니다.',
    'Interpretive direction: 상승 시 자기참조적/반영적 표상 강조를 시사할 수 있습니다.',
    'Cross-checks: 자기중심성 지수, Pair 패턴, 대인 지표와 함께 해석합니다.',
    'Caution: 반사 개념의 명시적 진술이 있어야 코딩합니다.',
  ].join('\n'),
  SumV_self: [
    'Definition: 자기지각 맥락의 SumV입니다.',
    'Operational basis: V 계열 결정인 합을 자기지각 문맥에서 해석합니다.',
    'Interpretive direction: 상승 시 고통성 자기평가 경향과 연결될 수 있습니다.',
    'Cross-checks: MOR_self, DEPI, D/AdjD와 함께 해석합니다.',
    'Caution: 자기영역 다른 지표와 수렴할 때 해석 강도가 높아집니다.',
  ].join('\n'),
  FD: [
    'Definition: 형태차원(FD) 결정인 빈도입니다.',
    'Operational basis: FD 코딩 반응 수를 집계합니다.',
    'Interpretive direction: 내성/심리적 거리두기 스타일과 관련될 수 있습니다.',
    'Cross-checks: SumV, 자기중심성, 정서 부하 지표와 함께 봅니다.',
    'Caution: FD는 맥락에 따라 적응적 거리두기를 반영할 수도 있습니다.',
  ].join('\n'),
  An_Xy: [
    'Definition: An+Xy(해부+엑스레이 내용) 합계입니다.',
    'Operational basis: An, Xy 내용 코드를 합산합니다.',
    'Interpretive direction: 상승 시 신체/신체내부 표상 초점 증가를 시사할 수 있습니다.',
    'Cross-checks: MOR_self, SumV_self, 스트레스 부하와 함께 해석합니다.',
    'Caution: 의학적 증상 근거로 직접 해석하지 않습니다.',
  ].join('\n'),
  MOR_self: [
    'Definition: 자기지각 맥락의 MOR 부하입니다.',
    'Operational basis: MOR 빈도를 자기영역 문맥으로 해석합니다.',
    'Interpretive direction: 높을수록 손상/부정 자기표상 주제 강화 가능성을 시사합니다.',
    'Cross-checks: SumV_self, DEPI, 자기중심성 지표와 함께 봅니다.',
    'Caution: 면담/맥락 자료와 통합해 해석합니다.',
  ].join('\n'),
  H_ratio: [
    'Definition: 인간표상 현실성-통합 비율(H:(H)+Hd+(Hd))입니다.',
    'Operational basis: 현실적 완전 인간 대 비통합/가상/부분 인간 표상 균형으로 계산합니다.',
    'Interpretive direction: 현실적 완전 인간 우세는 상대적으로 통합된 인물표상을 시사할 수 있습니다.',
    'Cross-checks: Human Cont, Pure H, GHR/PHR, 대인 지표와 함께 해석합니다.',
    'Caution: 인간내용 표본이 적으면 비율 안정성이 낮습니다.',
  ].join('\n'),
  FM: [
    'Definition: 동물운동(FM) 부하입니다.',
    'Operational basis: FM 코딩 반응 수를 집계합니다.',
    'Interpretive direction: 높을수록 eb/es 구성에서 활성화 측 기여가 커집니다.',
    'Cross-checks: m, eb, es, D/AdjD와 함께 해석합니다.',
    'Caution: FM 단독보다 EA와의 균형이 중요합니다.',
  ].join('\n'),
  m: [
    'Definition: 무생물운동(m) 부하입니다.',
    'Operational basis: m 코딩 반응 수를 집계합니다.',
    'Interpretive direction: 높을수록 압박/외적힘 체감 부하(es) 기여가 커질 수 있습니다.',
    'Cross-checks: FM, SumY, es, D/AdjD와 함께 해석합니다.',
    'Caution: 사건사 자체를 직접 의미하지는 않습니다.',
  ].join('\n'),
  SumCprime: [
    'Definition: 무채색 정서 활성 합(SumC\')입니다.',
    'Operational basis: 무채색 관련 결정인 성분을 합산합니다.',
    'Interpretive direction: 높을수록 고통성 정서 부하 측 기여가 커질 수 있습니다.',
    'Cross-checks: SumV, SumY, SumC\':WSumC, 정서 군집과 함께 봅니다.',
    'Caution: 구성요소 및 비율 맥락을 함께 해석합니다.',
  ].join('\n'),
  SumT: [
    'Definition: 질감 결정인 합(SumT)입니다.',
    'Operational basis: T 계열 결정인을 합산합니다.',
    'Interpretive direction: 상승 시 접촉/친밀 관련 주제 강화 가능성을 시사합니다.',
    'Cross-checks: Food, SumT_inter, 부하-자원 지표와 함께 해석합니다.',
    'Caution: T 계열 코딩 신뢰도가 중요합니다.',
  ].join('\n'),
  SumV: [
    'Definition: Vista 결정인 합(SumV)입니다.',
    'Operational basis: V 계열 결정인을 합산합니다.',
    'Interpretive direction: 상승 시 고통성 자기평가 주제와 연결될 수 있습니다.',
    'Cross-checks: SumV_self, MOR, DEPI와 함께 해석합니다.',
    'Caution: 단독으로 자기병리 결론을 내리지 않습니다.',
  ].join('\n'),
  SumY: [
    'Definition: 확산 음영 결정인 합(SumY)입니다.',
    'Operational basis: Y 계열 결정인을 합산합니다.',
    'Interpretive direction: 상승 시 일반화된 긴장/불편 부하 기여가 커질 수 있습니다.',
    'Cross-checks: es, D/AdjD, Afr와 함께 해석합니다.',
    'Caution: 전반 부하-자원 불균형과 함께 볼 때 의미가 강화됩니다.',
  ].join('\n'),
  PTI: [
    'Definition: PTI(지각-사고 지표)는 사고/지각 와해 가능성을 가늠하는 복합 스크리닝 지표입니다.',
    'Operational basis: 형태질 손상, 중증 인지 특수점수, M- 부담 등 다중 기준을 앱 규칙으로 계산합니다.',
    'Interpretive direction: 충족 기준이 많을수록 매개-관념 와해 우려가 커집니다(단독 진단 아님).',
    'Cross-checks: XA%, WDA%, X-%, WSum6, M-, 프로토콜 질과 함께 해석합니다.',
    'Caution: 위험 신호 플래그로 쓰되 임상 통합평가를 대체하지 않습니다.',
  ].join('\n'),
  DEPI: [
    'Definition: DEPI(우울 지표)는 우울성 정서/인지 부담의 복합 패턴을 나타냅니다.',
    'Operational basis: 정서 수축/고통, 자기평가 부담 등 다중 기준을 앱 규칙으로 산출합니다.',
    'Interpretive direction: 값이 높을수록 우울성 특징 가능성이 커집니다(단독 진단 아님).',
    'Cross-checks: SumV, MOR, Afr, FD, 면담 맥락과 함께 해석합니다.',
    'Caution: 단일 시점 점수로 주요우울 삽화를 확정하지 않습니다.',
  ].join('\n'),
  CDI: [
    'Definition: CDI(대처 결핍 지표)는 대처/대인 적응 자원 한계를 추정하는 복합 지표입니다.',
    'Operational basis: 자원 수준, 상호성 지표, 정서 조절 부담 기준을 결합해 계산합니다.',
    'Interpretive direction: 높을수록 특히 스트레스 상황에서 사회적 적응 부담이 클 수 있습니다.',
    'Cross-checks: EA, AdjD, COP/AG, SumT, Food, Isol Idx와 함께 해석합니다.',
    'Caution: 맥락과 역할요구를 무시한 고정 결함 해석을 피합니다.',
  ].join('\n'),
  SCON: [
    'Definition: S-CON은 자해 위험 신호를 스크리닝하는 복합 별자리 지표입니다.',
    'Operational basis: 불쾌감 부담, 매개 손상, 관련 위험 기준의 다중 조합으로 계산합니다.',
    'Interpretive direction: 충족 기준이 많을수록 즉각적이고 신중한 위험평가 필요성이 커집니다.',
    'Cross-checks: 현재 사고/의도, 과거 시도력, 안전요인, 임상면담과 통합합니다.',
    'Caution: 예언 도구가 아니며 단독 의사결정 종결점으로 사용하지 않습니다.',
  ].join('\n'),
  HVI: [
    'Definition: HVI는 경계적·위협감시적 대인 처리 스타일을 포착하는 지표입니다.',
    'Operational basis: 필수 게이트 조건 + 추가 기준 충족 수로 앱에서 산출합니다.',
    'Interpretive direction: 양성 패턴은 위협 스캐닝, 불신, 방어적 감시 경향을 시사할 수 있습니다.',
    'Cross-checks: Zd, Zf, S, COP/AG, 서술 맥락과 함께 해석합니다.',
    'Caution: 급성 상황 반응과 특성적 과경계를 구분해야 합니다.',
  ].join('\n'),
  OBS: [
    'Definition: OBS는 과통제·정밀집중·강박적 조직화 경향을 나타내는 지표입니다.',
    'Operational basis: 형태/조직/통제 관련 규칙 조합으로 앱에서 결정합니다.',
    'Interpretive direction: 양성 패턴은 경직, 완벽주의적 통제, 유연성 저하를 시사할 수 있습니다.',
    'Cross-checks: PSV, Zd, DQ, 정서 조절 지표와 함께 통합합니다.',
    'Caution: OBS 양성만으로 OCD 진단/손상 수준을 단정하지 않습니다.',
  ].join('\n'),
};

for (const [id, description] of Object.entries(KO_DESCRIPTION_OVERRIDES)) {
  const target = resultVariableDescriptions[id];
  if (target && typeof description === 'string') {
    target.ko.description = description;
  }
}

const ES_DESCRIPTION_OVERRIDES: Partial<Record<string, string>> = {
  Zf: ['Definition: Frecuencia de respuestas con puntuacion Z.', 'Operational basis: Conteo de respuestas con codificacion Z valida.', 'Interpretive direction: Valores mas altos sugieren mayor frecuencia de esfuerzo organizativo.', 'Cross-checks: Interpretar con ZSum, Zd y W:D:Dd.', 'Caution: Depende del tamano del protocolo y de R.'].join('\n'),
  ZSum: ['Definition: Suma ponderada total de Z.', 'Operational basis: Suma de pesos por tarjeta y tipo Z en la tabla de la app.', 'Interpretive direction: Valores altos reflejan mayor carga total de actividad organizativa.', 'Cross-checks: Revisar con Zf y ZEst antes de concluir estilo.', 'Caution: No interpretar solo por magnitud absoluta.'].join('\n'),
  ZEst: ['Definition: ZSum esperado segun tamano del protocolo.', 'Operational basis: Consulta de tabla ZEST por Zf.', 'Interpretive direction: Linea base para interpretar Zd.', 'Cross-checks: Usar junto con ZSum observado y Zd.', 'Caution: Protocolos muy cortos reducen estabilidad.'].join('\n'),
  Zd: ['Definition: Diferencia entre actividad organizativa observada y esperada.', 'Operational basis: Zd = ZSum - ZEst.', 'Interpretive direction: Positivo sugiere sobreincorporacion; negativo sugiere subincorporacion.', 'Cross-checks: Integrar con Zf, W:D:Dd y mediacion.', 'Caution: Extremos requieren chequeo de validez.'].join('\n'),
  R: ['Definition: Numero total de respuestas validas.', 'Operational basis: Conteo de respuestas con campos de puntuacion requeridos.', 'Interpretive direction: R muy bajo reduce confianza; R alto aumenta complejidad.', 'Cross-checks: Usar R como contexto de todos los indices.', 'Caution: Evitar conclusiones fuertes con R insuficiente.'].join('\n'),
  Lambda: ['Definition: Indice de simplificacion dominado por forma.', 'Operational basis: F puro dividido por respuestas no-F.', 'Interpretive direction: Alto sugiere simplificacion/forma dominante; bajo sugiere mayor involucramiento afectivo.', 'Cross-checks: Interpretar con Afr, FC:CF+C y DQ/FQ.', 'Caution: Revisar junto con R y calidad global del protocolo.'].join('\n'),
  EB: ['Definition: Balance de experiencia (M : WSumC).', 'Operational basis: Relacion entre recursos ideacionales y afectivos cromaticos.', 'Interpretive direction: La dominancia de un lado sugiere estilo de afrontamiento preferente.', 'Cross-checks: Integrar con EBPer, EA y D/AdjD.', 'Caution: No es diagnostico por si solo.'].join('\n'),
  EA: ['Definition: Recursos de afrontamiento disponibles.', 'Operational basis: EA = M + WSumC.', 'Interpretive direction: Valores mas altos sugieren mayor capacidad disponible.', 'Cross-checks: Comparar con es para balance carga-recurso.', 'Caution: Interpretar siempre con la demanda simultanea.'].join('\n'),
  es: ['Definition: Carga de estimulacion/estres experimentada.', "Operational basis: es = FM + m + SumC' + SumT + SumV + SumY.", 'Interpretive direction: Valores altos indican mayor carga interna.', 'Cross-checks: Comparar con EA y revisar D/AdjD.', 'Caution: No concluir disfuncion solo por es alto.'].join('\n'),
  D: ['Definition: Indice de tolerancia actual al estres.', 'Operational basis: Derivado de EA - es (tabla D de la app).', 'Interpretive direction: Negativo sugiere demanda mayor que recursos actuales.', 'Cross-checks: Integrar con AdjD y AdjEs.', 'Caution: Sensible a estado situacional.'].join('\n'),
  AdjD: ['Definition: Tolerancia al estres ajustada.', 'Operational basis: Derivado de EA - AdjEs con la misma tabla D.', 'Interpretive direction: Ayuda a separar presion situacional transitoria.', 'Cross-checks: Comparar brecha D vs AdjD.', 'Caution: Revisar supuestos del ajuste.'].join('\n'),
  PTI: ['Definition: PTI es un indice compuesto de cribado para desorganizacion perceptivo-pensamiento.', 'Operational basis: Criterios multiples (forma, puntajes cognitivos severos, M-, umbrales de app).', 'Interpretive direction: Mas criterios positivos aumentan preocupacion, no diagnostico por si solo.', 'Cross-checks: XA%, WDA%, X-%, WSum6, M- y calidad del protocolo.', 'Caution: Usar como bandera de riesgo estructurada, no como conclusion final.'].join('\n'),
  DEPI: ['Definition: DEPI es un indice compuesto de carga depresiva.', 'Operational basis: Criterios combinados de constriccion afectiva, distrés y autoevaluacion negativa.', 'Interpretive direction: Valores altos sugieren mayor presencia de rasgos depresivos.', 'Cross-checks: SumV, MOR, Afr, FD y entrevista clinica.', 'Caution: No confirma episodio depresivo mayor por si solo.'].join('\n'),
  CDI: ['Definition: CDI estima deficit de afrontamiento y adaptacion interpersonal.', 'Operational basis: Criterios de recursos, reciprocidad interpersonal y carga regulatoria.', 'Interpretive direction: Elevacion sugiere mayor tension adaptativa social.', 'Cross-checks: EA, AdjD, COP/AG, SumT, Food, Isol Idx.', 'Caution: Considerar contexto y demandas del rol.'].join('\n'),
  SCON: ['Definition: S-CON es una constelacion de cribado de riesgo autolesivo.', 'Operational basis: Configuracion multicriterio de carga disforica, mediacion y marcadores de riesgo.', 'Interpretive direction: Mas criterios positivos exigen evaluacion de riesgo inmediata y cuidadosa.', 'Cross-checks: Integrar con ideacion actual, intencion, historia de intentos y factores de seguridad.', 'Caution: No es herramienta determinista de prediccion.'].join('\n'),
  HVI: ['Definition: HVI capta estilo interpersonal hipervigilante y defensivo.', 'Operational basis: Condicion de puerta requerida mas conteo de criterios adicionales.', 'Interpretive direction: Patron positivo sugiere monitoreo de amenaza y desconfianza.', 'Cross-checks: Zd, Zf, S, COP/AG y contexto narrativo.', 'Caution: Distinguir rasgo de respuesta aguda situacional.'].join('\n'),
  OBS: ['Definition: OBS refleja sobrecontrol, precision y estilo compulsivo.', 'Operational basis: Conjunto de reglas sobre forma, organizacion y control.', 'Interpretive direction: Patron positivo sugiere rigidez y menor flexibilidad bajo demanda.', 'Cross-checks: PSV, Zd, perfil DQ e indicadores afectivos.', 'Caution: No equivale por si solo a diagnostico de TOC.'].join('\n'),
  W: ['Definition: Conteo de respuestas de localizacion global (mancha completa).', 'Operational basis: Numero de respuestas codificadas como area total.', 'Interpretive direction: Valores altos sugieren escaneo mas global y abarcador.', 'Cross-checks: Revisar junto con D, Dd y W:M.', 'Caution: W alto o bajo no implica adaptacion por si solo.'].join('\n'),
  Dd: ['Definition: Conteo de respuestas en detalles inusuales.', 'Operational basis: Numero de respuestas codificadas en areas de detalle raro.', 'Interpretive direction: Elevacion sugiere foco atencional selectivo o idiosincratico.', 'Cross-checks: Integrar con FQ, X-% y perfil de procesamiento.', 'Caution: Puede ser situacional si no hay patron consistente.'].join('\n'),
  S: ['Definition: Uso de espacio blanco en localizacion.', 'Operational basis: Conteo de respuestas con codificacion S segun reglas de la app.', 'Interpretive direction: En algunos contextos sugiere estilo oposicional o de distanciamiento.', 'Cross-checks: Interpretar con S-, FQ y variables interpersonales/afectivas.', 'Caution: Es sensible al contexto; no sobrerreaccionar a un valor aislado.'].join('\n'),
  dq_plus: ['Definition: Frecuencia de DQ+ (calidad evolutiva sintetica alta).', 'Operational basis: Conteo de respuestas codificadas DQ+.', 'Interpretive direction: Valores altos sugieren mayor integracion estructural.', 'Cross-checks: Revisar distribucion con DQo, DQv/+ y DQv.', 'Caution: Debe leerse junto con calidad formal (FQ).'].join('\n'),
  dq_o: ['Definition: Frecuencia de DQo (calidad evolutiva ordinaria).', 'Operational basis: Conteo de respuestas codificadas DQo.', 'Interpretive direction: Refleja organizacion estructural adecuada tipica.', 'Cross-checks: Comparar con DQ+/DQv y mediacion.', 'Caution: Predominio de DQo no implica rigidez ni deficit por si solo.'].join('\n'),
  dq_vplus: ['Definition: Frecuencia de DQv/+ (vaguedad con sintesis parcial).', 'Operational basis: Conteo de respuestas codificadas DQv/+.', 'Interpretive direction: Sugiere coexistencia de ambiguedad y esfuerzo integrador.', 'Cross-checks: Comparar proporcion con DQv y DQ+.', 'Caution: Requiere soporte de indagacion para codificacion estable.'].join('\n'),
  dq_v: ['Definition: Frecuencia de DQv (calidad evolutiva vaga).', 'Operational basis: Conteo de respuestas codificadas DQv.', 'Interpretive direction: Elevacion sugiere menor precision estructural.', 'Cross-checks: Revisar con FQ y restricciones de codificacion Z.', 'Caution: Un valor aislado no define deterioro global.'].join('\n'),
  EBPer: ['Definition: Indicador de unilateralidad del balance experiencial.', 'Operational basis: Derivado de criterios de proporcion entre lados de EB.', 'Interpretive direction: Mayor unilateralidad sugiere dependencia rigida de un estilo.', 'Cross-checks: Integrar con Lambda, Afr y D/AdjD.', 'Caution: Puede ser adaptativo en contextos especificos.'].join('\n'),
  AdjEs: ['Definition: Carga de estres ajustada para componentes situacionales.', 'Operational basis: Ajuste sobre es usando reglas de la app.', 'Interpretive direction: Ayuda a estimar carga basal mas estable.', 'Cross-checks: Comparar con es crudo y usar con AdjD.', 'Caution: Depende de supuestos del algoritmo de ajuste.'].join('\n'),
  FM: ['Definition: Movimiento animal (determinante FM).', 'Operational basis: Conteo de respuestas codificadas FM.', 'Interpretive direction: Elevacion suele asociarse a tension por necesidades o impulsos.', 'Cross-checks: Integrar con m y componentes de es.', 'Caution: Interpretar con contexto tematico del protocolo.'].join('\n'),
  m: ['Definition: Movimiento inanimado (determinante m).', 'Operational basis: Conteo de respuestas codificadas m.', 'Interpretive direction: Elevacion suele sugerir experiencia de presion o falta de control.', 'Cross-checks: Revisar junto con SumY, SumV y D/AdjD.', 'Caution: No equivale por si solo a desorganizacion severa.'].join('\n'),
  SumCprime: ['Definition: Suma de respuestas de color acromatico (C\').', "Operational basis: Conteo/suma de C' segun reglas del sistema.", 'Interpretive direction: Elevacion puede reflejar modulacion afectiva constrictiva o disforica.', 'Cross-checks: Integrar con Afr, FC:CF+C y DEPI.', 'Caution: No concluir depresion solo por aumento de C\'.'].join('\n'),
  SumT: ['Definition: Suma de respuestas de textura (T).', 'Operational basis: Conteo de determinantes T.', 'Interpretive direction: Elevacion suele indicar mayor necesidad de cercania/afiliacion.', 'Cross-checks: Integrar con Food, COP y variables interpersonales.', 'Caution: Considerar edad, contexto relacional y estilo cultural.'].join('\n'),
  SumV: ['Definition: Suma de respuestas de sombreado de vista (V).', 'Operational basis: Conteo de determinantes V.', 'Interpretive direction: Elevacion puede asociarse a autocrítica dolorosa o malestar interno.', 'Cross-checks: Interpretar con MOR, FD y DEPI.', 'Caution: Requiere corroboracion clinica, no inferencia unica.'].join('\n'),
  SumY: ['Definition: Suma de respuestas de sombreado difuso (Y).', 'Operational basis: Conteo de determinantes Y.', 'Interpretive direction: Elevacion sugiere tension difusa o ansiedad situacional.', 'Cross-checks: Integrar con m, D/AdjD y carga afectiva global.', 'Caution: Puede fluctuar por estres agudo reciente.'].join('\n'),
  Sum6: ['Definition: Suma simple de puntajes cognitivos especiales de nivel 6.', 'Operational basis: Conteo total de codigos especiales cognitivos relevantes.', 'Interpretive direction: Elevacion sugiere mayor perturbacion ideacional.', 'Cross-checks: Evaluar junto con WSum6, M- y PTI.', 'Caution: Revisar calidad del protocolo antes de inferencias fuertes.'].join('\n'),
  WSum6: ['Definition: Suma ponderada de puntajes cognitivos especiales.', 'Operational basis: Aplicacion de pesos por tipo de codigo especial.', 'Interpretive direction: Valores altos indican mayor severidad/carga de alteracion cognitiva.', 'Cross-checks: Integrar con Sum6, Lv2, PTI y mediacion.', 'Caution: No usar como diagnostico aislado.'].join('\n'),
  M_minus: ['Definition: Proporcion de movimiento humano con mala calidad formal (M-).', 'Operational basis: M- dividido por total de M segun reglas de la app.', 'Interpretive direction: Elevacion sugiere mayor distorsion en elaboracion ideacional.', 'Cross-checks: Revisar con XA%, WDA%, WSum6 y PTI.', 'Caution: Muy sensible a tamano de muestra de M.'].join('\n'),
  XA_percent: ['Definition: Proporcion de respuestas con calidad formal aceptable global (XA%).', 'Operational basis: Respuestas XA sobre total de respuestas calificables.', 'Interpretive direction: Valores bajos sugieren menor ajuste perceptivo convencional.', 'Cross-checks: Integrar con WDA%, X-% y P.', 'Caution: No interpretar sin considerar complejidad y R.'].join('\n'),
  WDA_percent: ['Definition: Proporcion de calidad formal adecuada en areas comunes (WDA%).', 'Operational basis: Respuestas adecuadas en W/D sobre total aplicable.', 'Interpretive direction: Valores bajos sugieren fallas en mediacion perceptiva cotidiana.', 'Cross-checks: Comparar con XA% y X-%.', 'Caution: Revisar consistencia de codificacion de localizacion.'].join('\n'),
  X_minus_percent: ['Definition: Proporcion de mala calidad formal (X-%).', 'Operational basis: Respuestas con FQ- sobre total calificable.', 'Interpretive direction: Elevacion indica mayor distorsion perceptiva/conceptual.', 'Cross-checks: Integrar con XA%, WDA%, S- y PTI.', 'Caution: No implica por si solo psicosis o diagnostico nosologico.'].join('\n'),
  a_p: ['Definition: Balance activo-pasivo de movimiento en ideacion.', 'Operational basis: Proporcion de componentes activos frente a pasivos.', 'Interpretive direction: Predominio activo sugiere mayor iniciativa; predominio pasivo sugiere mayor receptividad.', 'Cross-checks: Integrar con Ma:Mp, EB y a:p interpersonal.', 'Caution: Depende del volumen total de movimiento.'].join('\n'),
  Ma_Mp: ['Definition: Balance de movimiento humano activo versus pasivo.', 'Operational basis: Razon Ma sobre Mp.', 'Interpretive direction: Informa estilo de agencia intencional representada.', 'Cross-checks: Revisar con M total y D/AdjD.', 'Caution: Base M pequena reduce estabilidad.'].join('\n'),
  _2AB_Art_Ay: ['Definition: Marcador compuesto de complejidad ideacional.', 'Operational basis: Suma 2AB + Art + Ay.', 'Interpretive direction: Elevacion sugiere mayor elaboracion abstracta/conceptual.', 'Cross-checks: Integrar con DQ, blends y puntajes cognitivos.', 'Caution: Mayor abstraccion no garantiza mejor ajuste de realidad.'].join('\n'),
  MOR: ['Definition: Frecuencia MOR en ideacion.', 'Operational basis: Conteo de ocurrencias MOR.', 'Interpretive direction: Elevacion sugiere mayor tematizacion de dano/negatividad.', 'Cross-checks: Revisar con SumV, DEPI y autopercepcion.', 'Caution: Requiere integracion tematica del protocolo.'].join('\n'),
  Lv2: ['Definition: Conteo de puntajes cognitivos severos de nivel 2.', 'Operational basis: Suma DV2, INCOM2, DR2 y FABCOM2.', 'Interpretive direction: Valores altos sugieren mayor severidad de desorganizacion.', 'Cross-checks: Integrar con WSum6 y mediacion.', 'Caution: Confirmar calidad de codificacion por nivel.'].join('\n'),
  Mnone: ['Definition: Movimiento humano sin soporte formal ordinario.', 'Operational basis: Conteo de respuestas M con forma no ordinaria.', 'Interpretive direction: Elevacion sugiere anclaje formal menos estable.', 'Cross-checks: Revisar con M-, WDA% y WSum6.', 'Caution: Considerar efecto de denominador cuando M es bajo.'].join('\n'),
  FC_CF_C: ['Definition: Razon de modulacion de color FC frente a CF+C.', 'Operational basis: Comparacion de FC con suma de CF y C.', 'Interpretive direction: FC dominante sugiere mayor modulacion; CF/C dominante menor control.', 'Cross-checks: Integrar con Pure C, Afr y D/AdjD.', 'Caution: Interpretar con base total de respuestas de color.'].join('\n'),
  PureC: ['Definition: Frecuencia de color puro sin forma.', 'Operational basis: Conteo de determinante C sin soporte formal.', 'Interpretive direction: Elevacion sugiere descarga afectiva mas directa.', 'Cross-checks: Revisar con FC:CF+C, Afr y carga de estres.', 'Caution: Conteos pequenos tambien pueden ser relevantes.'].join('\n'),
  SumC_WSumC: ['Definition: Balance de SumC\' respecto a WSumC.', "Operational basis: Razon SumC' / WSumC.", 'Interpretive direction: Dominio acromatico relativo sugiere mayor tono disforico.', 'Cross-checks: Integrar con SumV/SumY, DEPI y FC:CF+C.', 'Caution: Revisar siempre ambos componentes por separado.'].join('\n'),
  Afr: ['Definition: Razon afectiva de aproximacion a estimulos cromaticos.', 'Operational basis: Formula de app con ultimas 3 laminas sobre primeras 7.', 'Interpretive direction: Afr bajo sugiere constriccion/evitacion; Afr alto mayor acercamiento afectivo.', 'Cross-checks: Integrar con FC:CF+C, Pure C y EB/EBPer.', 'Caution: Sensible a longitud de protocolo y productividad por lamina.'].join('\n'),
  S_aff: ['Definition: Uso de S interpretado en cluster afectivo.', 'Operational basis: Conteo S leido dentro del patron de afecto.', 'Interpretive direction: Puede sugerir manejo afectivo oposicional/distanciado cuando hay convergencia.', 'Cross-checks: Revisar con S-, FC:CF+C e interpersonal.', 'Caution: No concluir por S aislado.'].join('\n'),
  Blends_R: ['Definition: Proporcion de blends sobre R.', 'Operational basis: Conteo de blends dividido por R.', 'Interpretive direction: Elevacion sugiere mayor complejidad de procesamiento.', 'Cross-checks: Integrar con DQ, WSum6 y mediacion.', 'Caution: Complejidad no implica adaptacion automaticamente.'].join('\n'),
  CP: ['Definition: Frecuencia de puntaje especial CP.', 'Operational basis: Conteo de respuestas CP.', 'Interpretive direction: Puede sugerir atribucion afectiva externalizada en ciertas condiciones.', 'Cross-checks: Integrar con FC:CF+C, Pure C e interpersonal.', 'Caution: Interpretar en configuracion afectiva amplia.'].join('\n'),
  S_minus: ['Definition: Conteo de respuestas S con FQ- (S-).', 'Operational basis: Numero de respuestas de espacio blanco con mala calidad formal.', 'Interpretive direction: Elevacion sugiere oposicion con mediacion debil.', 'Cross-checks: Revisar con S total, X-% e interpersonal.', 'Caution: Requiere simultaneamente uso S y ajuste formal pobre.'].join('\n'),
  P: ['Definition: Conteo de respuestas populares.', 'Operational basis: Numero de percepciones comunes esperadas.', 'Interpretive direction: P alto suele indicar mayor alineacion convencional.', 'Cross-checks: Integrar con XA%, X+% y flexibilidad.', 'Caution: Extremos altos o bajos requieren lectura cualitativa.'].join('\n'),
  X_plus_percent: ['Definition: Proporcion de calidad formal convencional alta (X+%).', 'Operational basis: (FQ+ y FQo) sobre respuestas puntuables.', 'Interpretive direction: Elevacion sugiere mediacion convencional precisa.', 'Cross-checks: Revisar con XA%, Xu% y X-%.', 'Caution: Puede coexistir con rigidez.'].join('\n'),
  Xu_percent: ['Definition: Proporcion de forma inusual pero aceptable (Xu%).', 'Operational basis: FQu sobre total puntuable.', 'Interpretive direction: Elevacion sugiere estilo idiosincratico aceptable.', 'Cross-checks: Integrar con X+% y X-%.', 'Caution: Xu% aislado no implica patologia ni superioridad.'].join('\n'),
  Zf_proc: ['Definition: Zf interpretado en procesamiento.', 'Operational basis: Frecuencia Z en clave de estilo de escaneo.', 'Interpretive direction: Elevacion sugiere mas intentos de organizacion.', 'Cross-checks: Integrar con Zd_proc y W:D:Dd.', 'Caution: Frecuencia no equivale a eficiencia.'].join('\n'),
  Zd_proc: ['Definition: Zd interpretado en procesamiento.', 'Operational basis: Diferencia observada-esperada de organizacion en este cluster.', 'Interpretive direction: Desviaciones positivas/negativas sugieren sobre o subincorporacion.', 'Cross-checks: Revisar con Zf_proc, W:D:Dd y mediacion.', 'Caution: Extremos exigen verificacion de validez.'].join('\n'),
  W_D_Dd: ['Definition: Distribucion de escaneo W:D:Dd.', 'Operational basis: Razon de localizaciones globales, detalle comun y detalle inusual.', 'Interpretive direction: Informa amplitud versus selectividad atencional.', 'Cross-checks: Integrar con Zd, DQ y FQ.', 'Caution: Leer con R total y distribucion por laminas.'].join('\n'),
  W_M: ['Definition: Balance entre W y M.', 'Operational basis: Razon de localizacion global frente a movimiento humano.', 'Interpretive direction: Contribuye a hipotesis de estilo de procesamiento.', 'Cross-checks: Revisar con EB, Ma:Mp y W:D:Dd.', 'Caution: Inestable si M es bajo.'].join('\n'),
  PSV: ['Definition: Frecuencia de perseveracion (PSV).', 'Operational basis: Conteo de respuestas codificadas PSV.', 'Interpretive direction: Elevacion sugiere repeticion/rigidez.', 'Cross-checks: Integrar con Zd, OBS y carga cognitiva.', 'Caution: Distinguir perseveracion de continuidad tematica.'].join('\n'),
  DQ_plus_proc: ['Definition: DQ+ en perspectiva de procesamiento.', 'Operational basis: Frecuencia DQ+ leida en este cluster.', 'Interpretive direction: Elevacion sugiere mejor estructuracion integradora.', 'Cross-checks: Comparar con DQ_v_proc y mediacion.', 'Caution: Requiere soporte de FQ adecuado.'].join('\n'),
  DQ_v_proc: ['Definition: DQv en perspectiva de procesamiento.', 'Operational basis: Frecuencia DQv para precision estructural.', 'Interpretive direction: Elevacion sugiere menor precision al procesar.', 'Cross-checks: Integrar con X-%, Zd y puntajes cognitivos.', 'Caution: No concluir deterioro global sin convergencia.'].join('\n'),
  COP: ['Definition: Frecuencia de cooperacion (COP) interpersonal.', 'Operational basis: Conteo de ocurrencias COP.', 'Interpretive direction: Elevacion sugiere mayor representacion colaborativa.', 'Cross-checks: Revisar con AG, Human Cont, Pure H y GHR/PHR.', 'Caution: Conteo solo no define calidad relacional.'].join('\n'),
  AG: ['Definition: Frecuencia de agresion (AG) interpersonal.', 'Operational basis: Conteo de ocurrencias AG.', 'Interpretive direction: Elevacion sugiere mayor representacion conflictiva/forzada.', 'Cross-checks: Integrar con COP, MOR, S y afecto.', 'Caution: No equivale automaticamente a agresion conductual.'].join('\n'),
  a_p_inter: ['Definition: Balance activo-pasivo en dominio interpersonal.', 'Operational basis: Razon de elementos activos y pasivos en perfil interpersonal.', 'Interpretive direction: Activo sugiere postura iniciadora; pasivo postura receptiva/retirada.', 'Cross-checks: Revisar con COP/AG y contenidos humanos.', 'Caution: Requiere base de movimiento suficiente.'].join('\n'),
  Food: ['Definition: Frecuencia de contenido Food.', 'Operational basis: Conteo de respuestas de comida/alimento.', 'Interpretive direction: En contexto puede asociarse a dependencia/nutricion relacional.', 'Cross-checks: Integrar con SumT_inter, CDI e interpersonal.', 'Caution: Es inespecifico de forma aislada.'].join('\n'),
  SumT_inter: ['Definition: SumT interpretado en dominio interpersonal.', 'Operational basis: Suma de determinantes de textura.', 'Interpretive direction: Elevacion sugiere mayor necesidad de contacto/cercania.', 'Cross-checks: Revisar con Food, COP/AG y perfil afectivo.', 'Caution: Exige codificacion T confiable.'].join('\n'),
  HumanCont: ['Definition: Carga total de contenido humano.', 'Operational basis: Agregado de categorias de contenido humano.', 'Interpretive direction: Elevacion indica mayor saliencia interpersonal representacional.', 'Cross-checks: Integrar con Pure H, H ratio y GHR/PHR.', 'Caution: Cantidad no equivale a calidad adaptativa.'].join('\n'),
  PureH: ['Definition: Frecuencia de contenido humano completo realista.', 'Operational basis: Conteo de respuestas H.', 'Interpretive direction: Elevacion suele apoyar representacion de persona mas integrada.', 'Cross-checks: Revisar con HumanCont, H ratio y GHR/PHR.', 'Caution: Interpretar con FQ y marcadores interactivos.'].join('\n'),
  PER: ['Definition: Frecuencia de personalizacion (PER).', 'Operational basis: Conteo de respuestas PER.', 'Interpretive direction: Elevacion puede sugerir encuadre autorreferencial defensivo.', 'Cross-checks: Integrar con AG/COP, Isol Idx y afecto.', 'Caution: Es estilistico/contextual, no diagnostico por si solo.'].join('\n'),
  ISO_Index: ['Definition: Indice de aislamiento interpersonal.', 'Operational basis: Razon de componentes vinculados a distancia relacional.', 'Interpretive direction: Elevacion sugiere mayor distancia y menor reciprocidad.', 'Cross-checks: Revisar con HumanCont, Pure H, COP/AG y S.', 'Caution: Factores culturales pueden modular este indice.'].join('\n'),
  _3r_2_R: ['Definition: Indice de egocentricidad (3r+(2)/R).', 'Operational basis: Proporcion compuesta de ponderaciones de reflejo/par sobre R.', 'Interpretive direction: Muy bajo sugiere menor foco en si; muy alto mayor foco en si.', 'Cross-checks: Integrar con Fr+rF, H ratio e interpersonal.', 'Caution: Evitar etiquetas de rasgo con este indice aislado.'].join('\n'),
  Fr_rF: ['Definition: Frecuencia de determinantes de reflejo (Fr+rF).', 'Operational basis: Conteo de respuestas codificadas como reflejo.', 'Interpretive direction: Elevacion sugiere mayor enfasis autoreferencial.', 'Cross-checks: Revisar con egocentricidad, pair e interpersonal.', 'Caution: Requiere concepto explicito de reflejo.'].join('\n'),
  SumV_self: ['Definition: SumV interpretado en autopercepcion.', 'Operational basis: Suma de determinantes familia V en dominio self.', 'Interpretive direction: Elevacion puede asociarse a autocrítica dolorosa.', 'Cross-checks: Integrar con MOR_self, DEPI y D/AdjD.', 'Caution: Requiere convergencia de variables self.'].join('\n'),
  FD: ['Definition: Frecuencia de determinante de dimension por forma (FD).', 'Operational basis: Conteo de respuestas FD.', 'Interpretive direction: Puede asociarse a estilo introspectivo de distanciamiento.', 'Cross-checks: Revisar con SumV, egocentricidad y carga afectiva.', 'Caution: Puede ser adaptativo en ciertos contextos.'].join('\n'),
  An_Xy: ['Definition: Compuesto de contenidos anatomicos y rayos X (An+Xy).', 'Operational basis: Suma de conteos An y Xy.', 'Interpretive direction: Elevacion sugiere foco representacional corporal/somatico.', 'Cross-checks: Integrar con MOR_self, SumV_self y estres.', 'Caution: No es evidencia medica directa.'].join('\n'),
  MOR_self: ['Definition: Carga MOR en dominio de autopercepcion.', 'Operational basis: Frecuencia MOR leida en cluster self.', 'Interpretive direction: Elevacion sugiere mayor representacion negativa/danada de si.', 'Cross-checks: Revisar con SumV_self, DEPI y egocentricidad.', 'Caution: Requiere corroboracion de protocolo completo.'].join('\n'),
  H_ratio: ['Definition: Razon de realismo/integracion en representacion humana.', 'Operational basis: Balance entre H completo realista y formas humanas menos integradas.', 'Interpretive direction: Predominio de H completo sugiere representacion mas integrada de persona.', 'Cross-checks: Integrar con HumanCont, PureH y GHR/PHR.', 'Caution: Inestable con base humana muy pequena.'].join('\n'),
};

for (const [id, description] of Object.entries(ES_DESCRIPTION_OVERRIDES)) {
  const target = resultVariableDescriptions[id];
  if (target && typeof description === 'string') {
    target.es.description = description;
  }
}

const PT_DESCRIPTION_OVERRIDES: Partial<Record<string, string>> = {
  Zf: ['Definition: Frequencia de respostas com pontuacao Z.', 'Operational basis: Contagem de respostas com codificacao Z valida.', 'Interpretive direction: Valores mais altos sugerem maior frequencia de esforco organizacional.', 'Cross-checks: Interpretar com ZSum, Zd e W:D:Dd.', 'Caution: Depende do tamanho do protocolo e de R.'].join('\n'),
  ZSum: ['Definition: Soma ponderada total de Z.', 'Operational basis: Soma dos pesos por cartao e tipo Z na tabela do app.', 'Interpretive direction: Valores altos refletem maior carga total de atividade organizacional.', 'Cross-checks: Revisar com Zf e ZEst antes de concluir estilo.', 'Caution: Nao interpretar apenas por magnitude absoluta.'].join('\n'),
  ZEst: ['Definition: ZSum esperado conforme tamanho do protocolo.', 'Operational basis: Consulta da tabela ZEST por Zf.', 'Interpretive direction: Linha de base para interpretar Zd.', 'Cross-checks: Usar junto com ZSum observado e Zd.', 'Caution: Protocolos muito curtos reduzem estabilidade.'].join('\n'),
  Zd: ['Definition: Diferenca entre atividade organizacional observada e esperada.', 'Operational basis: Zd = ZSum - ZEst.', 'Interpretive direction: Positivo sugere sobreincorporacao; negativo sugere subincorporacao.', 'Cross-checks: Integrar com Zf, W:D:Dd e mediacao.', 'Caution: Extremos exigem checagem de validade.'].join('\n'),
  R: ['Definition: Numero total de respostas validas.', 'Operational basis: Contagem de respostas com campos obrigatorios de pontuacao.', 'Interpretive direction: R muito baixo reduz confianca; R alto aumenta complexidade.', 'Cross-checks: Usar R como contexto para todos os indices.', 'Caution: Evitar conclusoes fortes com R insuficiente.'].join('\n'),
  Lambda: ['Definition: Indice de simplificacao dominado por forma.', 'Operational basis: F puro dividido por respostas nao-F.', 'Interpretive direction: Alto sugere simplificacao por forma; baixo sugere maior envolvimento afetivo.', 'Cross-checks: Interpretar com Afr, FC:CF+C e DQ/FQ.', 'Caution: Revisar junto com R e qualidade global do protocolo.'].join('\n'),
  EB: ['Definition: Balanco de experiencia (M : WSumC).', 'Operational basis: Relacao entre recursos ideacionais e afetivos cromaticos.', 'Interpretive direction: Dominancia de um lado sugere estilo de coping preferencial.', 'Cross-checks: Integrar com EBPer, EA e D/AdjD.', 'Caution: Nao e diagnostico por si so.'].join('\n'),
  EA: ['Definition: Recursos de coping disponiveis.', 'Operational basis: EA = M + WSumC.', 'Interpretive direction: Valores mais altos sugerem maior capacidade disponivel.', 'Cross-checks: Comparar com es para balanco carga-recurso.', 'Caution: Interpretar sempre com a demanda simultanea.'].join('\n'),
  es: ['Definition: Carga de estimulo/estresse experimentada.', "Operational basis: es = FM + m + SumC' + SumT + SumV + SumY.", 'Interpretive direction: Valores altos indicam maior carga interna.', 'Cross-checks: Comparar com EA e revisar D/AdjD.', 'Caution: Nao concluir disfuncao apenas por es alto.'].join('\n'),
  D: ['Definition: Indice de tolerancia atual ao estresse.', 'Operational basis: Derivado de EA - es (tabela D do app).', 'Interpretive direction: Negativo sugere demanda maior que recursos atuais.', 'Cross-checks: Integrar com AdjD e AdjEs.', 'Caution: Sensivel a estado situacional.'].join('\n'),
  AdjD: ['Definition: Tolerancia ao estresse ajustada.', 'Operational basis: Derivado de EA - AdjEs com a mesma tabela D.', 'Interpretive direction: Ajuda a separar pressao situacional transitoria.', 'Cross-checks: Comparar diferenca D vs AdjD.', 'Caution: Revisar pressupostos do ajuste.'].join('\n'),
  PTI: ['Definition: PTI e um indice composto de triagem para desorganizacao perceptivo-pensamento.', 'Operational basis: Criterios multiplos (forma, escores cognitivos severos, M-, limiares do app).', 'Interpretive direction: Mais criterios positivos aumentam preocupacao, nao diagnostico isolado.', 'Cross-checks: XA%, WDA%, X-%, WSum6, M- e qualidade do protocolo.', 'Caution: Usar como sinalizador de risco estruturado, nao conclusao final.'].join('\n'),
  DEPI: ['Definition: DEPI e um indice composto de carga depressiva.', 'Operational basis: Criterios combinados de constricao afetiva, distress e autoavaliacao negativa.', 'Interpretive direction: Valores altos sugerem maior presenca de tracos depressivos.', 'Cross-checks: SumV, MOR, Afr, FD e entrevista clinica.', 'Caution: Nao confirma episodio depressivo maior isoladamente.'].join('\n'),
  CDI: ['Definition: CDI estima deficit de coping e adaptacao interpessoal.', 'Operational basis: Criterios de recursos, reciprocidade interpessoal e carga regulatoria.', 'Interpretive direction: Elevacao sugere maior tensao adaptativa social.', 'Cross-checks: EA, AdjD, COP/AG, SumT, Food, Isol Idx.', 'Caution: Considerar contexto e demandas de papel.'].join('\n'),
  SCON: ['Definition: S-CON e uma constelacao de triagem para risco de autoagressao.', 'Operational basis: Configuracao multicriterio de carga disforica, mediacao e marcadores de risco.', 'Interpretive direction: Mais criterios positivos exigem avaliacao imediata e cuidadosa de risco.', 'Cross-checks: Integrar ideacao atual, intencao, historico de tentativas e fatores de seguranca.', 'Caution: Nao e ferramenta deterministica de predicao.'].join('\n'),
  HVI: ['Definition: HVI capta estilo interpessoal hipervigilante e defensivo.', 'Operational basis: Condicao de gate obrigatoria mais contagem de criterios adicionais.', 'Interpretive direction: Padrao positivo sugere monitoramento de ameaca e desconfianca.', 'Cross-checks: Zd, Zf, S, COP/AG e contexto narrativo.', 'Caution: Distinguir traco de resposta aguda situacional.'].join('\n'),
  OBS: ['Definition: OBS reflete sobrecontrole, precisao e estilo compulsivo.', 'Operational basis: Conjunto de regras sobre forma, organizacao e controle.', 'Interpretive direction: Padrao positivo sugere rigidez e menor flexibilidade sob demanda.', 'Cross-checks: PSV, Zd, perfil DQ e indicadores afetivos.', 'Caution: Nao equivale isoladamente a diagnostico de TOC.'].join('\n'),
  W: ['Definition: Contagem de respostas de localizacao global (mancha inteira).', 'Operational basis: Numero de respostas codificadas como area total.', 'Interpretive direction: Valores altos sugerem varredura mais global e abrangente.', 'Cross-checks: Revisar com D, Dd e W:M.', 'Caution: W alto ou baixo nao implica adaptacao por si so.'].join('\n'),
  Dd: ['Definition: Contagem de respostas em detalhes incomuns.', 'Operational basis: Numero de respostas codificadas em areas de detalhe raro.', 'Interpretive direction: Elevacao sugere foco atencional seletivo ou idiossincratico.', 'Cross-checks: Integrar com FQ, X-% e perfil de processamento.', 'Caution: Pode ser situacional sem padrao consistente.'].join('\n'),
  S: ['Definition: Uso de espaco branco na localizacao.', 'Operational basis: Contagem de respostas com codificacao S segundo regras do app.', 'Interpretive direction: Em alguns contextos sugere estilo oposicional ou de distanciamento.', 'Cross-checks: Interpretar com S-, FQ e variaveis interpessoais/afetivas.', 'Caution: E sensivel ao contexto; evitar sobreinterpretacao isolada.'].join('\n'),
  dq_plus: ['Definition: Frequencia de DQ+ (qualidade evolutiva sintetica alta).', 'Operational basis: Contagem de respostas codificadas como DQ+.', 'Interpretive direction: Valores altos sugerem maior integracao estrutural.', 'Cross-checks: Revisar distribuicao com DQo, DQv/+ e DQv.', 'Caution: Deve ser lido junto com qualidade formal (FQ).'].join('\n'),
  dq_o: ['Definition: Frequencia de DQo (qualidade evolutiva ordinaria).', 'Operational basis: Contagem de respostas codificadas como DQo.', 'Interpretive direction: Reflete frequencia de organizacao estrutural adequada tipica.', 'Cross-checks: Comparar com DQ+/DQv e mediacao.', 'Caution: Predominio de DQo nao implica rigidez ou deficit por si so.'].join('\n'),
  dq_vplus: ['Definition: Frequencia de DQv/+ (vaguidade com sintese parcial).', 'Operational basis: Contagem de respostas codificadas como DQv/+.', 'Interpretive direction: Sugere coexistencia de ambiguidade e esforco integrador.', 'Cross-checks: Comparar proporcao com DQv e DQ+.', 'Caution: Exige boa qualidade de inquerito para estabilidade da codificacao.'].join('\n'),
  dq_v: ['Definition: Frequencia de DQv (qualidade evolutiva vaga).', 'Operational basis: Contagem de respostas codificadas como DQv.', 'Interpretive direction: Elevacao sugere menor precisao estrutural.', 'Cross-checks: Revisar com FQ e restricoes de codificacao Z.', 'Caution: Valor isolado nao define comprometimento global.'].join('\n'),
  EBPer: ['Definition: Indicador de unilateralidade do balanco experiencial.', 'Operational basis: Derivado de criterios de proporcao entre lados do EB.', 'Interpretive direction: Maior unilateralidade sugere dependencia mais rigida de um estilo.', 'Cross-checks: Integrar com Lambda, Afr e D/AdjD.', 'Caution: Pode ser adaptativo em contextos especificos.'].join('\n'),
  AdjEs: ['Definition: Carga de estresse ajustada para componentes situacionais.', 'Operational basis: Ajuste aplicado sobre es pelas regras do app.', 'Interpretive direction: Ajuda a estimar carga basal mais estavel.', 'Cross-checks: Comparar com es bruto e usar com AdjD.', 'Caution: Depende dos pressupostos do algoritmo de ajuste.'].join('\n'),
  FM: ['Definition: Movimento animal (determinante FM).', 'Operational basis: Contagem de respostas codificadas FM.', 'Interpretive direction: Elevacao costuma associar-se a tensao por necessidades/impulsos.', 'Cross-checks: Integrar com m e componentes de es.', 'Caution: Interpretar com contexto tematico do protocolo.'].join('\n'),
  m: ['Definition: Movimento inanimado (determinante m).', 'Operational basis: Contagem de respostas codificadas m.', 'Interpretive direction: Elevacao costuma sugerir experiencia de pressao ou perda de controle.', 'Cross-checks: Revisar com SumY, SumV e D/AdjD.', 'Caution: Nao equivale por si so a desorganizacao grave.'].join('\n'),
  SumCprime: ['Definition: Soma de respostas de cor acromatica (C\').', "Operational basis: Contagem/soma de C' segundo regras do sistema.", 'Interpretive direction: Elevacao pode refletir modulacao afetiva constritiva ou disforica.', 'Cross-checks: Integrar com Afr, FC:CF+C e DEPI.', 'Caution: Nao concluir depressao apenas por aumento de C\'.'].join('\n'),
  SumT: ['Definition: Soma de respostas de textura (T).', 'Operational basis: Contagem de determinantes T.', 'Interpretive direction: Elevacao costuma indicar maior necessidade de proximidade/afiliacao.', 'Cross-checks: Integrar com Food, COP e variaveis interpessoais.', 'Caution: Considerar idade, contexto relacional e estilo cultural.'].join('\n'),
  SumV: ['Definition: Soma de respostas de sombreado de vista (V).', 'Operational basis: Contagem de determinantes V.', 'Interpretive direction: Elevacao pode associar-se a autocritica dolorosa ou mal-estar interno.', 'Cross-checks: Interpretar com MOR, FD e DEPI.', 'Caution: Exige corroboracao clinica, nao inferencia unica.'].join('\n'),
  SumY: ['Definition: Soma de respostas de sombreado difuso (Y).', 'Operational basis: Contagem de determinantes Y.', 'Interpretive direction: Elevacao sugere tensao difusa ou ansiedade situacional.', 'Cross-checks: Integrar com m, D/AdjD e carga afetiva global.', 'Caution: Pode flutuar por estresse agudo recente.'].join('\n'),
  Sum6: ['Definition: Soma simples dos escores cognitivos especiais de nivel 6.', 'Operational basis: Contagem total de codigos especiais cognitivos relevantes.', 'Interpretive direction: Elevacao sugere maior perturbacao ideacional.', 'Cross-checks: Avaliar com WSum6, M- e PTI.', 'Caution: Revisar qualidade do protocolo antes de inferencias fortes.'].join('\n'),
  WSum6: ['Definition: Soma ponderada dos escores cognitivos especiais.', 'Operational basis: Aplicacao de pesos por tipo de codigo especial.', 'Interpretive direction: Valores altos indicam maior severidade/carga de alteracao cognitiva.', 'Cross-checks: Integrar com Sum6, Lv2, PTI e mediacao.', 'Caution: Nao usar como diagnostico isolado.'].join('\n'),
  M_minus: ['Definition: Proporcao de movimento humano com baixa qualidade formal (M-).', 'Operational basis: M- dividido pelo total de M segundo regras do app.', 'Interpretive direction: Elevacao sugere maior distorcao na elaboracao ideacional.', 'Cross-checks: Revisar com XA%, WDA%, WSum6 e PTI.', 'Caution: Muito sensivel ao tamanho de amostra de M.'].join('\n'),
  XA_percent: ['Definition: Proporcao global de qualidade formal aceitavel (XA%).', 'Operational basis: Respostas XA sobre total de respostas avaliaveis.', 'Interpretive direction: Valores baixos sugerem menor ajuste perceptivo convencional.', 'Cross-checks: Integrar com WDA%, X-% e P.', 'Caution: Nao interpretar sem considerar complexidade e R.'].join('\n'),
  WDA_percent: ['Definition: Proporcao de qualidade formal adequada em areas comuns (WDA%).', 'Operational basis: Respostas adequadas em W/D sobre total aplicavel.', 'Interpretive direction: Valores baixos sugerem falhas de mediacao perceptiva cotidiana.', 'Cross-checks: Comparar com XA% e X-%.', 'Caution: Revisar consistencia da codificacao de localizacao.'].join('\n'),
  X_minus_percent: ['Definition: Proporcao de baixa qualidade formal (X-%).', 'Operational basis: Respostas com FQ- sobre total avaliavel.', 'Interpretive direction: Elevacao indica maior distorcao perceptiva/conceitual.', 'Cross-checks: Integrar com XA%, WDA%, S- e PTI.', 'Caution: Nao implica por si so psicose ou diagnostico nosologico.'].join('\n'),
  a_p: ['Definition: Balanceamento ativo-passivo de movimento na ideacao.', 'Operational basis: Proporcao de componentes ativos versus passivos.', 'Interpretive direction: Dominancia ativa sugere mais iniciativa; dominancia passiva sugere mais receptividade.', 'Cross-checks: Integrar com Ma:Mp, EB e a:p interpessoal.', 'Caution: Depende do volume total de movimento.'].join('\n'),
  Ma_Mp: ['Definition: Balanceamento de movimento humano ativo versus passivo.', 'Operational basis: Razao Ma sobre Mp.', 'Interpretive direction: Informa estilo de agencia intencional representada.', 'Cross-checks: Revisar com M total e D/AdjD.', 'Caution: Base M pequena reduz estabilidade.'].join('\n'),
  _2AB_Art_Ay: ['Definition: Marcador composto de complexidade ideacional.', 'Operational basis: Soma 2AB + Art + Ay.', 'Interpretive direction: Elevacao sugere maior elaboracao abstrata/conceitual.', 'Cross-checks: Integrar com DQ, blends e escores cognitivos.', 'Caution: Maior abstracao nao garante melhor ajuste da realidade.'].join('\n'),
  MOR: ['Definition: Frequencia MOR na ideacao.', 'Operational basis: Contagem de ocorrencias MOR.', 'Interpretive direction: Elevacao sugere maior tematizacao de dano/negatividade.', 'Cross-checks: Revisar com SumV, DEPI e autopercepcao.', 'Caution: Requer integracao tematica do protocolo.'].join('\n'),
  Lv2: ['Definition: Contagem de escores cognitivos severos de nivel 2.', 'Operational basis: Soma DV2, INCOM2, DR2 e FABCOM2.', 'Interpretive direction: Valores altos sugerem maior severidade de desorganizacao.', 'Cross-checks: Integrar com WSum6 e mediacao.', 'Caution: Confirmar qualidade da codificacao por nivel.'].join('\n'),
  Mnone: ['Definition: Movimento humano sem suporte formal ordinario.', 'Operational basis: Contagem de respostas M com forma nao ordinaria.', 'Interpretive direction: Elevacao sugere ancoragem formal menos estavel.', 'Cross-checks: Revisar com M-, WDA% e WSum6.', 'Caution: Considerar efeito do denominador quando M e baixo.'].join('\n'),
  FC_CF_C: ['Definition: Razao de modulacao de cor FC versus CF+C.', 'Operational basis: Comparacao de FC com soma de CF e C.', 'Interpretive direction: FC dominante sugere maior modulacao; CF/C dominante menor controle.', 'Cross-checks: Integrar com Pure C, Afr e D/AdjD.', 'Caution: Interpretar com base total de respostas de cor.'].join('\n'),
  PureC: ['Definition: Frequencia de cor pura sem forma.', 'Operational basis: Contagem do determinante C sem suporte formal.', 'Interpretive direction: Elevacao sugere descarga afetiva mais direta.', 'Cross-checks: Revisar com FC:CF+C, Afr e carga de estresse.', 'Caution: Contagens pequenas tambem podem ser relevantes.'].join('\n'),
  SumC_WSumC: ['Definition: Balanceamento de SumC\' em relacao a WSumC.', "Operational basis: Razao SumC' / WSumC.", 'Interpretive direction: Dominancia acromatica relativa sugere maior tom disforico.', 'Cross-checks: Integrar com SumV/SumY, DEPI e FC:CF+C.', 'Caution: Revisar sempre os dois componentes separadamente.'].join('\n'),
  Afr: ['Definition: Razao afetiva de aproximacao a estimulos cromaticos.', 'Operational basis: Formula do app com ultimos 3 cartoes sobre primeiros 7.', 'Interpretive direction: Afr baixo sugere constricao/evitacao; Afr alto maior aproximacao afetiva.', 'Cross-checks: Integrar com FC:CF+C, Pure C e EB/EBPer.', 'Caution: Sensivel ao tamanho do protocolo e produtividade por cartao.'].join('\n'),
  S_aff: ['Definition: Uso de S interpretado no cluster afetivo.', 'Operational basis: Contagem S lida dentro do padrao afetivo.', 'Interpretive direction: Pode sugerir manejo afetivo oposicional/distanciado quando ha convergencia.', 'Cross-checks: Revisar com S-, FC:CF+C e interpessoal.', 'Caution: Nao concluir por S isolado.'].join('\n'),
  Blends_R: ['Definition: Proporcao de blends sobre R.', 'Operational basis: Contagem de blends dividida por R.', 'Interpretive direction: Elevacao sugere maior complexidade de processamento.', 'Cross-checks: Integrar com DQ, WSum6 e mediacao.', 'Caution: Complexidade nao implica adaptacao automaticamente.'].join('\n'),
  CP: ['Definition: Frequencia do escore especial CP.', 'Operational basis: Contagem de respostas CP.', 'Interpretive direction: Pode sugerir atribuicao afetiva externalizada em certas condicoes.', 'Cross-checks: Integrar com FC:CF+C, Pure C e interpessoal.', 'Caution: Interpretar em configuracao afetiva ampla.'].join('\n'),
  S_minus: ['Definition: Contagem de respostas S com FQ- (S-).', 'Operational basis: Numero de respostas de espaco branco com baixa qualidade formal.', 'Interpretive direction: Elevacao sugere oposicao com mediacao fragil.', 'Cross-checks: Revisar com S total, X-% e interpessoal.', 'Caution: Requer simultaneamente uso de S e ajuste formal ruim.'].join('\n'),
  P: ['Definition: Contagem de respostas populares.', 'Operational basis: Numero de percepcoes comuns esperadas.', 'Interpretive direction: P alto tende a indicar maior alinhamento convencional.', 'Cross-checks: Integrar com XA%, X+% e flexibilidade.', 'Caution: Extremos altos ou baixos pedem leitura qualitativa.'].join('\n'),
  X_plus_percent: ['Definition: Proporcao de qualidade formal convencional alta (X+%).', 'Operational basis: (FQ+ e FQo) sobre respostas pontuaveis.', 'Interpretive direction: Elevacao sugere mediacao convencional precisa.', 'Cross-checks: Revisar com XA%, Xu% e X-%.', 'Caution: Pode coexistir com rigidez.'].join('\n'),
  Xu_percent: ['Definition: Proporcao de forma incomum porem aceitavel (Xu%).', 'Operational basis: FQu sobre total pontuavel.', 'Interpretive direction: Elevacao sugere estilo idiossincratico aceitavel.', 'Cross-checks: Integrar com X+% e X-%.', 'Caution: Xu% isolado nao implica patologia nem superioridade.'].join('\n'),
  Zf_proc: ['Definition: Zf interpretado no processamento.', 'Operational basis: Frequencia Z lida como estilo de varredura.', 'Interpretive direction: Elevacao sugere mais tentativas de organizacao.', 'Cross-checks: Integrar com Zd_proc e W:D:Dd.', 'Caution: Frequencia nao equivale a eficiencia.'].join('\n'),
  Zd_proc: ['Definition: Zd interpretado no processamento.', 'Operational basis: Diferenca observado-esperado de organizacao neste cluster.', 'Interpretive direction: Desvios positivos/negativos sugerem sobre ou subincorporacao.', 'Cross-checks: Revisar com Zf_proc, W:D:Dd e mediacao.', 'Caution: Extremos exigem verificacao de validade.'].join('\n'),
  W_D_Dd: ['Definition: Distribuicao de varredura W:D:Dd.', 'Operational basis: Razao de localizacoes globais, detalhe comum e detalhe incomum.', 'Interpretive direction: Informa amplitude versus seletividade atencional.', 'Cross-checks: Integrar com Zd, DQ e FQ.', 'Caution: Ler com R total e distribuicao por cartoes.'].join('\n'),
  W_M: ['Definition: Balanceamento entre W e M.', 'Operational basis: Razao de localizacao global versus movimento humano.', 'Interpretive direction: Contribui para hipoteses de estilo de processamento.', 'Cross-checks: Revisar com EB, Ma:Mp e W:D:Dd.', 'Caution: Instavel se M for baixo.'].join('\n'),
  PSV: ['Definition: Frequencia de perseveracao (PSV).', 'Operational basis: Contagem de respostas codificadas PSV.', 'Interpretive direction: Elevacao sugere repeticao/rigidez.', 'Cross-checks: Integrar com Zd, OBS e carga cognitiva.', 'Caution: Distinguir perseveracao de continuidade tematica.'].join('\n'),
  DQ_plus_proc: ['Definition: DQ+ em perspectiva de processamento.', 'Operational basis: Frequencia DQ+ lida neste cluster.', 'Interpretive direction: Elevacao sugere melhor estruturacao integrativa.', 'Cross-checks: Comparar com DQ_v_proc e mediacao.', 'Caution: Requer suporte de FQ adequado.'].join('\n'),
  DQ_v_proc: ['Definition: DQv em perspectiva de processamento.', 'Operational basis: Frequencia DQv para precisao estrutural.', 'Interpretive direction: Elevacao sugere menor precisao no processamento.', 'Cross-checks: Integrar com X-%, Zd e escores cognitivos.', 'Caution: Nao concluir comprometimento global sem convergencia.'].join('\n'),
  COP: ['Definition: Frequencia de cooperacao (COP) interpessoal.', 'Operational basis: Contagem de ocorrencias COP.', 'Interpretive direction: Elevacao sugere maior representacao colaborativa.', 'Cross-checks: Revisar com AG, Human Cont, Pure H e GHR/PHR.', 'Caution: Contagem isolada nao define qualidade relacional.'].join('\n'),
  AG: ['Definition: Frequencia de agressao (AG) interpessoal.', 'Operational basis: Contagem de ocorrencias AG.', 'Interpretive direction: Elevacao sugere maior representacao conflitiva/forcada.', 'Cross-checks: Integrar com COP, MOR, S e afeto.', 'Caution: Nao equivale automaticamente a agressao comportamental.'].join('\n'),
  a_p_inter: ['Definition: Balanceamento ativo-passivo no dominio interpessoal.', 'Operational basis: Razao de elementos ativos e passivos no perfil interpessoal.', 'Interpretive direction: Ativo sugere postura iniciadora; passivo postura receptiva/retraida.', 'Cross-checks: Revisar com COP/AG e conteudos humanos.', 'Caution: Requer base de movimento suficiente.'].join('\n'),
  Food: ['Definition: Frequencia de conteudo Food.', 'Operational basis: Contagem de respostas de comida/alimento.', 'Interpretive direction: Em contexto pode associar-se a dependencia/nutricao relacional.', 'Cross-checks: Integrar com SumT_inter, CDI e interpessoal.', 'Caution: E inespecifico quando isolado.'].join('\n'),
  SumT_inter: ['Definition: SumT interpretado no dominio interpessoal.', 'Operational basis: Soma de determinantes de textura.', 'Interpretive direction: Elevacao sugere maior necessidade de contato/proximidade.', 'Cross-checks: Revisar com Food, COP/AG e perfil afetivo.', 'Caution: Exige codificacao T confiavel.'].join('\n'),
  HumanCont: ['Definition: Carga total de conteudo humano.', 'Operational basis: Agregado de categorias de conteudo humano.', 'Interpretive direction: Elevacao indica maior saliencia interpessoal representacional.', 'Cross-checks: Integrar com Pure H, H ratio e GHR/PHR.', 'Caution: Quantidade nao equivale a qualidade adaptativa.'].join('\n'),
  PureH: ['Definition: Frequencia de conteudo humano completo realista.', 'Operational basis: Contagem de respostas H.', 'Interpretive direction: Elevacao tende a apoiar representacao de pessoa mais integrada.', 'Cross-checks: Revisar com HumanCont, H ratio e GHR/PHR.', 'Caution: Interpretar com FQ e marcadores interativos.'].join('\n'),
  PER: ['Definition: Frequencia de personalizacao (PER).', 'Operational basis: Contagem de respostas PER.', 'Interpretive direction: Elevacao pode sugerir enquadre autorreferencial defensivo.', 'Cross-checks: Integrar com AG/COP, Isol Idx e afeto.', 'Caution: E estilistico/contextual, nao diagnostico isolado.'].join('\n'),
  ISO_Index: ['Definition: Indice de isolamento interpessoal.', 'Operational basis: Razao de componentes ligados a distancia relacional.', 'Interpretive direction: Elevacao sugere maior distancia e menor reciprocidade.', 'Cross-checks: Revisar com HumanCont, Pure H, COP/AG e S.', 'Caution: Fatores culturais podem modular o indice.'].join('\n'),
  _3r_2_R: ['Definition: Indice de egocentricidade (3r+(2)/R).', 'Operational basis: Proporcao composta de pesos de reflexo/par sobre R.', 'Interpretive direction: Muito baixo sugere menor foco no self; muito alto maior foco no self.', 'Cross-checks: Integrar com Fr+rF, H ratio e interpessoal.', 'Caution: Evitar rotulos de traco por indice isolado.'].join('\n'),
  Fr_rF: ['Definition: Frequencia de determinantes de reflexo (Fr+rF).', 'Operational basis: Contagem de respostas codificadas como reflexo.', 'Interpretive direction: Elevacao sugere maior enfase autorreferencial.', 'Cross-checks: Revisar com egocentricidade, pair e interpessoal.', 'Caution: Requer conceito explicito de reflexo.'].join('\n'),
  SumV_self: ['Definition: SumV interpretado em autopercepcao.', 'Operational basis: Soma dos determinantes familia V no dominio self.', 'Interpretive direction: Elevacao pode associar-se a autocritica dolorosa.', 'Cross-checks: Integrar com MOR_self, DEPI e D/AdjD.', 'Caution: Requer convergencia de variaveis self.'].join('\n'),
  FD: ['Definition: Frequencia do determinante de dimensao por forma (FD).', 'Operational basis: Contagem de respostas FD.', 'Interpretive direction: Pode associar-se a estilo introspectivo de distanciamento.', 'Cross-checks: Revisar com SumV, egocentricidade e carga afetiva.', 'Caution: Pode ser adaptativo em certos contextos.'].join('\n'),
  An_Xy: ['Definition: Composto de conteudos anatomicos e raio-X (An+Xy).', 'Operational basis: Soma de contagens An e Xy.', 'Interpretive direction: Elevacao sugere foco representacional corporal/somatico.', 'Cross-checks: Integrar com MOR_self, SumV_self e estresse.', 'Caution: Nao e evidencia medica direta.'].join('\n'),
  MOR_self: ['Definition: Carga MOR no dominio de autopercepcao.', 'Operational basis: Frequencia MOR lida no cluster self.', 'Interpretive direction: Elevacao sugere maior representacao negativa/danificada de si.', 'Cross-checks: Revisar com SumV_self, DEPI e egocentricidade.', 'Caution: Requer corroboracao do protocolo completo.'].join('\n'),
  H_ratio: ['Definition: Razao de realismo/integracao na representacao humana.', 'Operational basis: Balanceamento entre H completo realista e formas humanas menos integradas.', 'Interpretive direction: Predominio de H completo sugere representacao mais integrada de pessoa.', 'Cross-checks: Integrar com HumanCont, PureH e GHR/PHR.', 'Caution: Instavel com base humana muito pequena.'].join('\n'),
};

for (const [id, description] of Object.entries(PT_DESCRIPTION_OVERRIDES)) {
  const target = resultVariableDescriptions[id];
  if (target && typeof description === 'string') {
    target.pt.description = description;
  }
}

const JA_DESCRIPTION_OVERRIDES: Partial<Record<string, string>> = {
  Zf: ['Definition: Z得点が付与された反応の頻度です。', 'Operational basis: 有効なZコーディング反応数を集計します。', 'Interpretive direction: 高値は組織化努力の頻度増加を示唆します。', 'Cross-checks: ZSum, Zd, W:D:Ddと併せて解釈します。', 'Caution: プロトコル長とRを必ず考慮してください。'].join('\n'),
  ZSum: ['Definition: Zの加重合計です。', 'Operational basis: アプリのカード別Z重み表で合算します。', 'Interpretive direction: 高値は全体的な組織化活動量の増加を示唆します。', 'Cross-checks: Zf, ZEstと同時に確認します。', 'Caution: 絶対値のみで結論しないでください。'].join('\n'),
  ZEst: ['Definition: プロトコル規模に基づく期待ZSumです。', 'Operational basis: Zfに応じてZEST表から参照します。', 'Interpretive direction: Zd解釈の基準線です。', 'Cross-checks: 観測ZSumとZdを同時に評価します。', 'Caution: 短いプロトコルでは安定性が低下します。'].join('\n'),
  Zd: ['Definition: 観測組織化活動と期待値の差です。', 'Operational basis: Zd = ZSum - ZEst。', 'Interpretive direction: 正値は過剰取り込み、負値は取り込み不足傾向を示唆します。', 'Cross-checks: Zf, W:D:Dd, 媒介指標と統合します。', 'Caution: 極端値は妥当性確認後に解釈します。'].join('\n'),
  R: ['Definition: 有効反応の総数です。', 'Operational basis: 必須採点項目が埋まった反応を集計します。', 'Interpretive direction: 低Rは信頼性低下、高Rは複雑性増加を示します。', 'Cross-checks: 全指標解釈の前提としてRを確認します。', 'Caution: R不足時の強い結論は避けてください。'].join('\n'),
  Lambda: ['Definition: 形態優位の簡略化比率です。', 'Operational basis: 純粋Fを非F反応で除して算出します。', 'Interpretive direction: 高値は形態優位の単純化、低値は情動関与拡大を示唆します。', 'Cross-checks: Afr, FC:CF+C, DQ/FQと併せて評価します。', 'Caution: Rと全体品質を同時に確認します。'].join('\n'),
  EB: ['Definition: 経験バランス（M:WSumC）です。', 'Operational basis: 観念的資源と色彩情動資源の比率です。', 'Interpretive direction: 片側優位は対処スタイルの偏りを示唆します。', 'Cross-checks: EBPer, EA, D/AdjDと統合します。', 'Caution: 単独で診断的結論を出しません。'].join('\n'),
  EA: ['Definition: 利用可能な対処資源量です。', 'Operational basis: EA = M + WSumC。', 'Interpretive direction: 高値は利用可能資源の増加を示唆します。', 'Cross-checks: esと比較して負荷-資源バランスを見ます。', 'Caution: 需要側(es)と必ず同時に解釈します。'].join('\n'),
  es: ['Definition: 体験的刺激/ストレス負荷量です。', "Operational basis: es = FM + m + SumC' + SumT + SumV + SumY。", 'Interpretive direction: 高値は内的負荷の増大を示唆します。', 'Cross-checks: EA, D, AdjDと併せて評価します。', 'Caution: es単独で機能低下を断定しません。'].join('\n'),
  D: ['Definition: 現在のストレス耐性バランス指標です。', 'Operational basis: EA-esをDテーブルで区分して算出します。', 'Interpretive direction: 負値は需要が資源を上回る可能性を示唆します。', 'Cross-checks: AdjD, AdjEs, Core全体と統合します。', 'Caution: 状態依存性が高い指標です。'].join('\n'),
  AdjD: ['Definition: 調整後ストレス耐性指標です。', 'Operational basis: EA-AdjEsを同じDテーブルで算出します。', 'Interpretive direction: 一過性圧力の寄与分離に役立ちます。', 'Cross-checks: Dとの差分を必ず確認します。', 'Caution: 調整仮定の妥当性確認が必要です。'].join('\n'),
  PTI: ['Definition: PTIは知覚-思考の乱れリスクをみる複合スクリーニング指標です。', 'Operational basis: 形態質低下、重度認知特殊得点、M-等の複数基準で算出します。', 'Interpretive direction: 陽性基準が多いほど懸念が高まります（単独診断ではない）。', 'Cross-checks: XA%, WDA%, X-%, WSum6, M-, プロトコル品質と統合します。', 'Caution: リスクフラグとして用い、最終判断は臨床統合で行います。'].join('\n'),
  DEPI: ['Definition: DEPIは抑うつ的負荷をみる複合指標です。', 'Operational basis: 情動収縮、苦痛、自己評価負荷などの複数基準で算出します。', 'Interpretive direction: 高値は抑うつ特徴の増加を示唆します。', 'Cross-checks: SumV, MOR, Afr, FD, 面接情報と統合します。', 'Caution: 単独でうつ病エピソードを確定しません。'].join('\n'),
  CDI: ['Definition: CDIは対処資源不足と対人適応負荷をみる複合指標です。', 'Operational basis: 資源、相互性、調整負荷に関する基準を組み合わせます。', 'Interpretive direction: 高値は社会的対処負荷の増加を示唆します。', 'Cross-checks: EA, AdjD, COP/AG, SumT, Food, Isol Idxと統合します。', 'Caution: 文脈と役割要求を考慮します。'].join('\n'),
  SCON: ['Definition: S-CONは自傷リスクをみるスクリーニング指標です。', 'Operational basis: 不快負荷、媒介歪み、関連リスク基準の多基準構成です。', 'Interpretive direction: 陽性基準増加は即時かつ慎重なリスク評価の必要性を示します。', 'Cross-checks: 現在の希死念慮/意図、既往、自他保護因子を統合します。', 'Caution: 決定論的予測ツールではありません。'].join('\n'),
  HVI: ['Definition: HVIは過警戒的で防衛的な対人処理スタイルを捉えます。', 'Operational basis: 必須ゲート条件と追加基準数で算出します。', 'Interpretive direction: 陽性は脅威監視・不信傾向を示唆します。', 'Cross-checks: Zd, Zf, S, COP/AG, 叙述文脈と統合します。', 'Caution: 特性と急性状況反応を区別します。'].join('\n'),
  OBS: ['Definition: OBSは過統制・精密志向・強迫的様式傾向を示します。', 'Operational basis: 形態・組織化・統制関連ルールセットで判定します。', 'Interpretive direction: 陽性は硬さと柔軟性低下を示唆します。', 'Cross-checks: PSV, Zd, DQ, 情動指標と統合します。', 'Caution: 単独でOCD診断を確定しません。'].join('\n'),
  W: ['Definition: 全体領域(W)の位置反応数です。', 'Operational basis: 全体領域として採点された反応数を集計します。', 'Interpretive direction: 高値はより包括的・全体的な走査傾向を示します。', 'Cross-checks: D, Dd, W:Mと併せて解釈します。', 'Caution: Wの高低のみで適応性を判断しません。'].join('\n'),
  Dd: ['Definition: 稀な詳細領域(Dd)反応数です。', 'Operational basis: 珍しい詳細領域として採点された反応数を集計します。', 'Interpretive direction: 高値は選択的/特異的注意焦点を示唆します。', 'Cross-checks: FQ, X-%, 処理指標群と統合します。', 'Caution: 一過性増加の可能性を常に確認します。'].join('\n'),
  S: ['Definition: 空白領域(S)使用数です。', 'Operational basis: S採点規則に一致する反応数を集計します。', 'Interpretive direction: 文脈により反対的・距離化的処理傾向を示すことがあります。', 'Cross-checks: S-, FQ, 対人/情動群と統合します。', 'Caution: 単独値の過大解釈を避けます。'].join('\n'),
  dq_plus: ['Definition: DQ+（高次統合的発達質）反応数です。', 'Operational basis: DQ+として採点された反応数を集計します。', 'Interpretive direction: 高値は構造的統合力の高さを示唆します。', 'Cross-checks: DQo, DQv/+, DQvとの分布で評価します。', 'Caution: FQと切り離して解釈しません。'].join('\n'),
  dq_o: ['Definition: DQo（通常発達質）反応数です。', 'Operational basis: DQoとして採点された反応数を集計します。', 'Interpretive direction: 典型的な十分な構造化頻度を示します。', 'Cross-checks: DQ+/DQv系列と媒介指標を併読します。', 'Caution: 優勢だからといって硬直性を直ちに示しません。'].join('\n'),
  dq_vplus: ['Definition: DQv/+（曖昧さと部分統合の混合）反応数です。', 'Operational basis: DQv/+として採点された反応数を集計します。', 'Interpretive direction: 曖昧さと統合努力の併存を示唆します。', 'Cross-checks: DQv, DQ+との比率で判断します。', 'Caution: 質問段階の情報品質が重要です。'].join('\n'),
  dq_v: ['Definition: DQv（曖昧発達質）反応数です。', 'Operational basis: DQvとして採点された反応数を集計します。', 'Interpretive direction: 高値は構造的精密さの低下を示唆します。', 'Cross-checks: FQ, Z関連指標と統合します。', 'Caution: 単独高値で全体機能低下を断定しません。'].join('\n'),
  EBPer: ['Definition: EBの片側性指標です。', 'Operational basis: EB比率基準から片側優位を導出します。', 'Interpretive direction: 高値は単一スタイル依存の強さを示唆します。', 'Cross-checks: Lambda, Afr, D/AdjDと併読します。', 'Caution: 文脈により機能的な場合があります。'].join('\n'),
  AdjEs: ['Definition: 状況要因を調整したストレス負荷量です。', 'Operational basis: esにアプリ規則の調整を適用して算出します。', 'Interpretive direction: より基底的な負荷推定に有用です。', 'Cross-checks: 生のesと比較しAdjDと統合します。', 'Caution: 調整アルゴリズム仮定に依存します。'].join('\n'),
  FM: ['Definition: 動物運動(FM)決定因です。', 'Operational basis: FM採点反応数を集計します。', 'Interpretive direction: 高値は欲求/衝動由来の緊張増加を示唆します。', 'Cross-checks: mおよびes構成要素と統合します。', 'Caution: 主題内容文脈を必ず確認します。'].join('\n'),
  m: ['Definition: 無生物運動(m)決定因です。', 'Operational basis: m採点反応数を集計します。', 'Interpretive direction: 高値は圧迫感や統制不能感の体験を示唆します。', 'Cross-checks: SumY, SumV, D/AdjDと統合します。', 'Caution: 単独で重度障害を示すものではありません。'].join('\n'),
  SumCprime: ['Definition: 無彩色(C\')決定因の合計です。', "Operational basis: C'反応をシステム規則で合算します。", 'Interpretive direction: 高値は収縮的/不快的情動調整傾向を示唆します。', 'Cross-checks: Afr, FC:CF+C, DEPIと統合します。', 'Caution: C\'増加のみで抑うつを断定しません。'].join('\n'),
  SumT: ['Definition: 質感(T)決定因の合計です。', 'Operational basis: T採点反応数を集計します。', 'Interpretive direction: 高値は親和・近接欲求の高さを示唆します。', 'Cross-checks: Food, COP, 対人指標と統合します。', 'Caution: 年齢・関係文脈・文化要因を考慮します。'].join('\n'),
  SumV: ['Definition: 視覚陰影(V)決定因の合計です。', 'Operational basis: V採点反応数を集計します。', 'Interpretive direction: 高値は痛みを伴う自己批判や内的不快を示唆します。', 'Cross-checks: MOR, FD, DEPIと併せて解釈します。', 'Caution: 臨床情報で必ず裏付けます。'].join('\n'),
  SumY: ['Definition: 拡散陰影(Y)決定因の合計です。', 'Operational basis: Y採点反応数を集計します。', 'Interpretive direction: 高値はびまん性緊張や状況不安を示唆します。', 'Cross-checks: m, D/AdjD, 全体情動負荷と統合します。', 'Caution: 直近の急性ストレスで変動します。'].join('\n'),
  Sum6: ['Definition: 認知特殊得点の単純合計です。', 'Operational basis: 該当特殊得点コードの総数を集計します。', 'Interpretive direction: 高値は観念的攪乱の増加を示唆します。', 'Cross-checks: WSum6, M-, PTIと統合します。', 'Caution: プロトコル品質確認を先行します。'].join('\n'),
  WSum6: ['Definition: 認知特殊得点の加重合計です。', 'Operational basis: 特殊得点タイプ別重みを適用して算出します。', 'Interpretive direction: 高値は認知攪乱の重症度増加を示します。', 'Cross-checks: Sum6, Lv2, PTI, 媒介群と統合します。', 'Caution: 単独診断に使用しません。'].join('\n'),
  M_minus: ['Definition: 形態不良の人間運動(M-)比率です。', 'Operational basis: M-を全Mで除して算出します。', 'Interpretive direction: 高値は観念形成の歪み増加を示唆します。', 'Cross-checks: XA%, WDA%, WSum6, PTIと統合します。', 'Caution: M母数が小さいと不安定です。'].join('\n'),
  XA_percent: ['Definition: 全体的に許容可能な形態質比率(XA%)です。', 'Operational basis: XA反応を評価可能反応総数で除して算出します。', 'Interpretive direction: 低値は慣習的知覚適合の低下を示唆します。', 'Cross-checks: WDA%, X-%, Pと統合します。', 'Caution: 複雑性とRを同時に考慮します。'].join('\n'),
  WDA_percent: ['Definition: 一般領域での適切形態質比率(WDA%)です。', 'Operational basis: W/D領域の適切反応を該当総数で除して算出します。', 'Interpretive direction: 低値は日常的媒介の不安定さを示唆します。', 'Cross-checks: XA%, X-%との乖離を確認します。', 'Caution: 位置採点の一貫性を点検します。'].join('\n'),
  X_minus_percent: ['Definition: 不良形態質比率(X-%)です。', 'Operational basis: FQ-反応を評価可能総数で除して算出します。', 'Interpretive direction: 高値は知覚/概念の歪み増加を示します。', 'Cross-checks: XA%, WDA%, S-, PTIと統合します。', 'Caution: 単独で精神病性診断を確定しません。'].join('\n'),
  a_p: ['Definition: 観念領域における能動-受動運動バランスです。', 'Operational basis: 能動成分と受動成分の比率で算出します。', 'Interpretive direction: 能動優位は開始性、受動優位は受容性の高さを示唆します。', 'Cross-checks: Ma:Mp、EB、対人a:pと統合します。', 'Caution: 運動反応母数が小さい場合は不安定です。'].join('\n'),
  Ma_Mp: ['Definition: 人間運動の能動(Ma)-受動(Mp)比です。', 'Operational basis: MaをMpで比較して算出します。', 'Interpretive direction: 意図的主体性の表象様式を示します。', 'Cross-checks: M総数、D/AdjDと併読します。', 'Caution: Mが少ない場合は比率解釈を慎重に行います。'].join('\n'),
  _2AB_Art_Ay: ['Definition: 観念的複雑性の複合指標です。', 'Operational basis: 2AB + Art + Ayを合算します。', 'Interpretive direction: 高値は抽象化・概念化の増加を示唆します。', 'Cross-checks: DQ、Blends、認知特殊得点と統合します。', 'Caution: 抽象性が高くても現実適合が高いとは限りません。'].join('\n'),
  MOR: ['Definition: 観念クラスターにおけるMOR頻度です。', 'Operational basis: MOR特殊得点の出現数を集計します。', 'Interpretive direction: 高値は損傷/否定的主題の増加を示唆します。', 'Cross-checks: SumV、DEPI、自己知覚指標と統合します。', 'Caution: 主題統合なしに単独結論を出しません。'].join('\n'),
  Lv2: ['Definition: レベル2重度認知特殊得点の頻度です。', 'Operational basis: DV2、INCOM2、DR2、FABCOM2を合算します。', 'Interpretive direction: 高値は認知的攪乱の重症度増加を示唆します。', 'Cross-checks: WSum6、媒介指標と統合します。', 'Caution: レベル判定の採点信頼性を確認します。'].join('\n'),
  Mnone: ['Definition: 通常形態支持を欠くM反応数です。', 'Operational basis: 非通常形態質を伴うM反応を集計します。', 'Interpretive direction: 高値は観念主体性の形態アンカー不安定を示唆します。', 'Cross-checks: M-、WDA%、WSum6と統合します。', 'Caution: M母数が小さい場合は分母効果に注意します。'].join('\n'),
  FC_CF_C: ['Definition: 色彩調整比（FC対CF+C）です。', 'Operational basis: FCをCFとCの合計と比較します。', 'Interpretive direction: FC優位は調整性増加、CF/C優位は調整低下を示唆します。', 'Cross-checks: Pure C、Afr、D/AdjDと統合します。', 'Caution: 色彩反応総数を考慮して解釈します。'].join('\n'),
  PureC: ['Definition: 形態を伴わない純粋彩色反応数です。', 'Operational basis: 形態寄与なしのC決定因頻度を集計します。', 'Interpretive direction: 高値はより直接的な情動放出を示唆します。', 'Cross-checks: FC:CF+C、Afr、ストレス負荷と統合します。', 'Caution: 少数でも臨床的意味を持つ場合があります。'].join('\n'),
  SumC_WSumC: ['Definition: SumC\'とWSumCのバランス指標です。', "Operational basis: SumC'をWSumCで除して算出します。", 'Interpretive direction: 無彩色優位は不快トーンの相対的増加を示唆します。', 'Cross-checks: SumV/SumY、DEPI、FC:CF+Cと統合します。', 'Caution: 必ず構成要素ごとに確認します。'].join('\n'),
  Afr: ['Definition: 彩色情動刺激への接近を示す情動比です。', 'Operational basis: 後半3カード反応を前半7カード反応で評価します。', 'Interpretive direction: 低Afrは回避/収縮、高Afrは接近傾向を示唆します。', 'Cross-checks: FC:CF+C、Pure C、EB/EBPerと統合します。', 'Caution: プロトコル長とカード産出性の影響を受けます。'].join('\n'),
  S_aff: ['Definition: 情動クラスター文脈で読むS使用です。', 'Operational basis: S頻度を情動パターン内で解釈します。', 'Interpretive direction: 収束所見がある場合、反対的/距離化的処理を示唆します。', 'Cross-checks: S-、FC:CF+C、対人指標と統合します。', 'Caution: S単独で情動様式を断定しません。'].join('\n'),
  Blends_R: ['Definition: BlendsのRに対する比率です。', 'Operational basis: Blends数をRで除して算出します。', 'Interpretive direction: 高値は多次元的処理複雑性の増加を示唆します。', 'Cross-checks: DQ、WSum6、媒介群と統合します。', 'Caution: 複雑性増加は自動的に適応性を意味しません。'].join('\n'),
  CP: ['Definition: CP特殊得点の頻度です。', 'Operational basis: CP採点反応数を集計します。', 'Interpretive direction: 条件により外在化的情動帰属傾向を示唆します。', 'Cross-checks: FC:CF+C、Pure C、対人指標と統合します。', 'Caution: 広い情動構成内で解釈します。'].join('\n'),
  S_minus: ['Definition: FQ-を伴うS反応数(S-)です。', 'Operational basis: 空白領域反応のうち形態不良を伴う数を集計します。', 'Interpretive direction: 高値は反対性と媒介弱化の併存を示唆します。', 'Cross-checks: S総数、X-%、対人指標と統合します。', 'Caution: S使用と形態不良の両条件が必要です。'].join('\n'),
  P: ['Definition: Popular反応数です。', 'Operational basis: 標準的に期待される知覚反応数を集計します。', 'Interpretive direction: 高値は慣習的整合の高さを示します。', 'Cross-checks: XA%、X+%、柔軟性指標と統合します。', 'Caution: 極端高低値はいずれも質的検討が必要です。'].join('\n'),
  X_plus_percent: ['Definition: 高慣習的形態質比率(X+%)です。', 'Operational basis: (FQ+とFQo)を評価可能反応数で除して算出します。', 'Interpretive direction: 高値は慣習的媒介精度の高さを示します。', 'Cross-checks: XA%、Xu%、X-%と統合します。', 'Caution: 高値でも硬直性を伴う場合があります。'].join('\n'),
  Xu_percent: ['Definition: 非典型だが許容可能な形態質比率(Xu%)です。', 'Operational basis: FQuを評価可能反応総数で除して算出します。', 'Interpretive direction: 高値は許容範囲内の特異的知覚様式を示唆します。', 'Cross-checks: X+%、X-%と統合して判断します。', 'Caution: Xu%単独で病理や優位性を示しません。'].join('\n'),
  Zf_proc: ['Definition: 処理クラスターでのZfです。', 'Operational basis: Z頻度を情報処理様式として解釈します。', 'Interpretive direction: 高値は組織化試行の頻度増加を示唆します。', 'Cross-checks: Zd_proc、W:D:Ddと統合します。', 'Caution: 頻度と効率は同義ではありません。'].join('\n'),
  Zd_proc: ['Definition: 処理クラスターでのZdです。', 'Operational basis: 観測-期待組織化差を処理文脈で評価します。', 'Interpretive direction: 正負偏位は過剰取り込み/取り込み不足傾向を示唆します。', 'Cross-checks: Zf_proc、W:D:Dd、媒介群と統合します。', 'Caution: 極端値は妥当性確認を優先します。'].join('\n'),
  W_D_Dd: ['Definition: W:D:Dd走査分布です。', 'Operational basis: 全体・通常詳細・稀詳細の位置比率で算出します。', 'Interpretive direction: 注意配分の広さと選択性を示します。', 'Cross-checks: Zd、DQ、FQと統合します。', 'Caution: R総数とカード分布を伴って解釈します。'].join('\n'),
  W_M: ['Definition: WとMのバランス比です。', 'Operational basis: 全体走査と人間運動反応を比率化します。', 'Interpretive direction: 処理スタイル仮説に補助的情報を提供します。', 'Cross-checks: EB、Ma:Mp、W:D:Ddと統合します。', 'Caution: M母数が低いと比率は不安定です。'].join('\n'),
  PSV: ['Definition: 保続(PSV)頻度です。', 'Operational basis: PSV採点反応数を集計します。', 'Interpretive direction: 高値は反復/硬直傾向を示唆します。', 'Cross-checks: Zd、OBS、認知負荷指標と統合します。', 'Caution: 保続と主題連続性を区別します。'].join('\n'),
  DQ_plus_proc: ['Definition: 処理視点でのDQ+です。', 'Operational basis: DQ+頻度を処理クラスターで評価します。', 'Interpretive direction: 高値は統合的構造化の高さを示唆します。', 'Cross-checks: DQ_v_proc、媒介指標と統合します。', 'Caution: 適応的解釈には十分なFQが必要です。'].join('\n'),
  DQ_v_proc: ['Definition: 処理視点でのDQvです。', 'Operational basis: DQv頻度を構造精密性文脈で評価します。', 'Interpretive direction: 高値は処理時の構造精度低下を示唆します。', 'Cross-checks: X-%、Zd、認知特殊得点と統合します。', 'Caution: 収束所見なしに全般障害を断定しません。'].join('\n'),
  COP: ['Definition: 対人領域での協力(COP)頻度です。', 'Operational basis: COP出現数を集計します。', 'Interpretive direction: 高値は協働的相互作用表象の増加を示唆します。', 'Cross-checks: AG、Human Cont、Pure H、GHR/PHRと統合します。', 'Caution: 頻度のみで対人質を決めません。'].join('\n'),
  AG: ['Definition: 対人領域での攻撃性(AG)頻度です。', 'Operational basis: AG出現数を集計します。', 'Interpretive direction: 高値は葛藤的/強圧的表象の増加を示唆します。', 'Cross-checks: COP、MOR、S、情動調整と統合します。', 'Caution: 現実行動での攻撃を自動的に意味しません。'].join('\n'),
  a_p_inter: ['Definition: 対人領域での能動-受動バランスです。', 'Operational basis: 対人プロファイル内の能動/受動要素比率です。', 'Interpretive direction: 能動優位は開始姿勢、受動優位は受容/退避姿勢を示唆します。', 'Cross-checks: COP/AG、人間内容群と統合します。', 'Caution: 運動母数が十分な場合に解釈します。'].join('\n'),
  Food: ['Definition: Food内容頻度です。', 'Operational basis: 食物関連内容反応数を集計します。', 'Interpretive direction: 文脈により依存/養育主題との関連を示します。', 'Cross-checks: SumT_inter、CDI、対人群と統合します。', 'Caution: 単独では非特異的です。'].join('\n'),
  SumT_inter: ['Definition: 対人文脈でのSumTです。', 'Operational basis: 質感決定因を合算して評価します。', 'Interpretive direction: 高値は接触/近接欲求増加を示唆します。', 'Cross-checks: Food、COP/AG、情動群と統合します。', 'Caution: T採点の信頼性確認が必要です。'].join('\n'),
  HumanCont: ['Definition: 人間内容の総負荷です。', 'Operational basis: 人間内容カテゴリ全体を合算します。', 'Interpretive direction: 高値は対人表象の顕著化を示します。', 'Cross-checks: Pure H、H ratio、GHR/PHRと統合します。', 'Caution: 量は適応的質と同義ではありません。'].join('\n'),
  PureH: ['Definition: 現実的全体人間内容(Pure H)頻度です。', 'Operational basis: H反応数を集計します。', 'Interpretive direction: 高値は統合的人物表象を支持します。', 'Cross-checks: HumanCont、H ratio、GHR/PHRと統合します。', 'Caution: FQと相互作用マーカーを併読します。'].join('\n'),
  PER: ['Definition: 個人化(PER)頻度です。', 'Operational basis: PER採点反応数を集計します。', 'Interpretive direction: 高値は防衛的自己準拠枠づけを示唆します。', 'Cross-checks: AG/COP、Isol Idx、情動指標と統合します。', 'Caution: 様式的指標であり単独診断ではありません。'].join('\n'),
  ISO_Index: ['Definition: 対人孤立指数です。', 'Operational basis: 関係距離関連成分の比率で算出します。', 'Interpretive direction: 高値は距離増大と相互性制限を示唆します。', 'Cross-checks: HumanCont、Pure H、COP/AG、Sと統合します。', 'Caution: 文化的要因の影響を考慮します。'].join('\n'),
  _3r_2_R: ['Definition: 自己中心性指数(3r+(2)/R)です。', 'Operational basis: 反射/対要素重みの合成をRで除して算出します。', 'Interpretive direction: 極端低値は自己焦点低下、極端高値は自己焦点増加を示唆します。', 'Cross-checks: Fr+rF、H ratio、対人群と統合します。', 'Caution: 単独で特性ラベル化しません。'].join('\n'),
  Fr_rF: ['Definition: 反射決定因(Fr+rF)頻度です。', 'Operational basis: 反射採点反応数を集計します。', 'Interpretive direction: 高値は自己参照的表象強調を示唆します。', 'Cross-checks: 自己中心性、pair、対人群と統合します。', 'Caution: 反射概念の明示が必要です。'].join('\n'),
  SumV_self: ['Definition: 自己知覚文脈でのSumVです。', 'Operational basis: V系列決定因をself領域で合算します。', 'Interpretive direction: 高値は痛みを伴う自己評価傾向と関連します。', 'Cross-checks: MOR_self、DEPI、D/AdjDと統合します。', 'Caution: self領域の収束所見が必要です。'].join('\n'),
  FD: ['Definition: 形態次元決定因(FD)頻度です。', 'Operational basis: FD採点反応数を集計します。', 'Interpretive direction: 内省的距離取り様式と関連することがあります。', 'Cross-checks: SumV、自己中心性、情動負荷と統合します。', 'Caution: 文脈により適応的機能を持ちます。'].join('\n'),
  An_Xy: ['Definition: An+Xy複合内容頻度です。', 'Operational basis: An内容とXy内容を合算します。', 'Interpretive direction: 高値は身体・ソマティック焦点を示唆します。', 'Cross-checks: MOR_self、SumV_self、ストレス指標と統合します。', 'Caution: 医学的疾患の直接証拠ではありません。'].join('\n'),
  MOR_self: ['Definition: 自己知覚領域でのMOR負荷です。', 'Operational basis: MOR頻度をselfクラスターで評価します。', 'Interpretive direction: 高値は否定的/損傷自己表象主題を示唆します。', 'Cross-checks: SumV_self、DEPI、自己中心性と統合します。', 'Caution: 全プロトコルでの裏づけが必要です。'].join('\n'),
  H_ratio: ['Definition: 人間表象の現実性/統合性比です。', 'Operational basis: 現実的全体Hと部分/非統合的人間形態のバランスで算出します。', 'Interpretive direction: 全体H優位は統合的人物表象を示唆します。', 'Cross-checks: HumanCont、PureH、GHR/PHRと統合します。', 'Caution: 人間内容母数が小さいと不安定です。'].join('\n'),
};

for (const [id, description] of Object.entries(JA_DESCRIPTION_OVERRIDES)) {
  const target = resultVariableDescriptions[id];
  if (target && typeof description === 'string') {
    target.ja.description = description;
  }
}
