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
  Zf: localize('Zf', 'Frequency of Z scores. Higher values usually indicate more scanning and organizational effort.'),
  ZSum: localize('ZSum', 'Total weighted Z score. Reflects overall organizational activity across responses.'),
  ZEst: localize('ZEst', 'Expected ZSum for the given protocol size. Used as a reference when interpreting Zd.'),
  Zd: localize('Zd', 'Difference between observed and expected organizational activity. Very high or low values suggest imbalance in scanning style.'),
  W: localize('W', 'Whole-blot responses. Often linked to broad, global processing style.'),
  Dd: localize('Dd', 'Unusual detail responses. Can indicate idiosyncratic focus, overselectivity, or cognitive strain when excessive.'),
  S: localize('S', 'White-space use. May indicate oppositionality, autonomy needs, or assertive distancing depending on context.'),
  dq_plus: localize('DQ+', 'Synthesized and well-elaborated developmental quality. Suggests integrative and complex ideation.'),
  dq_o: localize('DQo', 'Ordinary developmental quality. Typical and adequate structural organization.'),
  dq_vplus: localize('DQv/+', 'Vague but with some synthesized quality. Mixed signal between ambiguity and integration.'),
  dq_v: localize('DQv', 'Vague developmental quality. Often reflects less precise structuring or reduced form articulation.'),

  // === Core ===
  R: localize('R (Total Responses)', 'Total number of responses in the protocol. Very low R may weaken interpretive confidence; very high R may increase complexity.'),
  Lambda: localize('L (Lambda)', 'Form-dominant simplification index. High Lambda suggests avoidant/simplifying style; low Lambda suggests more affective involvement.'),
  EB: localize('EB (Experience Balance)', 'Ratio of M to WSumC. Indicates preferred coping style along introversive-extratensive dimensions.'),
  EA: localize('EA (Experience Actual)', 'Available coping resources (M + WSumC). Higher EA generally indicates stronger capacity to manage stress demands.'),
  EBPer: localize('EBPer', 'Flags strongly one-sided EB pattern. Suggests rigid reliance on one coping style.'),
  eb: localize('eb', "Ratio of FM+m to SumC'+SumT+SumV+SumY. Reflects needs/drives vs tension-distress balance."),
  es: localize('es', "Current stimulation/stress load (FM+m+SumC'+SumT+SumV+SumY). Higher values indicate greater felt demand."),
  D: localize('D Score', 'Current stress tolerance index (EA - es). Negative values suggest demands exceed currently available coping resources.'),
  AdjD: localize('Adj D', 'Adjusted stress tolerance estimate after removing transient situational pressure effects.'),
  AdjEs: localize('Adj es', 'Adjusted experienced stimulation value used in Adj D computation.'),
  FM: localize('FM', 'Animal movement responses. Often related to less regulated drives and intermediate-level impulse activity.'),
  m: localize('m', 'Inanimate movement responses. Often associated with tension, pressure, or perceived external force.'),
  SumCprime: localize("SumC'", 'Total achromatic color/shading-color activation component used in core stress-affect calculations.'),
  SumT: localize('SumT', 'Texture-related shading score. Often associated with needs for closeness, comfort, or contact.'),
  SumV: localize('SumV', 'Vista shading score. Often associated with self-critical or painful self-awareness themes.'),
  SumY: localize('SumY', 'Diffuse shading score. Often linked with situational anxiety and generalized tension.'),

  // === Ideation ===
  a_p: localize('a:p', 'Active-to-passive movement ratio. Describes assertive vs receptive style in ideation and approach tendencies.'),
  Ma_Mp: localize('Ma:Mp', 'Active vs passive human movement balance. Helps characterize intentional agency in thought processes.'),
  _2AB_Art_Ay: localize('2AB+(Art+Ay)', 'Cognitive complexity marker combining abstraction and specific content indicators.'),
  MOR: localize('MOR', 'Morbid content score. Elevated values can reflect pessimism, damage themes, or negative self/object representations.'),
  Sum6: localize('Sum6', 'Total count of cognitive special scores. Index of thought disturbance load.'),
  Lv2: localize('Lv2', 'Level-2 severe cognitive special scores. Higher values indicate more serious disorganization.'),
  WSum6: localize('WSum6', 'Weighted Sum6 score. Severity-weighted index of cognitive slippage/disorder.'),
  M_minus: localize('M-', 'Poor-form human movement responses. Suggests reduced reality adequacy in ideational activity.'),
  Mnone: localize('Mnone', 'Human movement content without ordinary form quality support. Marker of weak reality anchoring for ideation.'),

  // === Affect ===
  FC_CF_C: localize('FC:CF+C', 'Color modulation ratio. Higher FC generally indicates better affect modulation; higher CF/C indicates less modulation.'),
  PureC: localize('Pure C', 'Unmodulated chromatic color responses. May reflect direct and less controlled affect discharge.'),
  SumC_WSumC: localize("SumC':WSumC", "Balance between achromatic distress coloration and chromatic affective expression."),
  Afr: localize('Afr', 'Affective ratio. Lower values can suggest affective constriction; higher values suggest approach to emotional stimuli.'),
  S_aff: localize('S', 'White-space contribution within affective domain context. Interpreted with broader pattern, not in isolation.'),
  Blends_R: localize('Blends:R', 'Blend proportion per response. Often reflects psychological complexity and multidimensional processing.'),
  CP: localize('CP', 'Color projection marker. Can indicate affective defensiveness or externalization tendencies in some contexts.'),

  // === Mediation ===
  XA_percent: localize('XA%', 'Conventional form-use proportion. Higher XA% usually indicates better reality mediation.'),
  WDA_percent: localize('WDA%', 'Common-area form accuracy index. Sensitive marker for mediation quality in ordinary perceptual fields.'),
  X_minus_percent: localize('X-%', 'Distorted form proportion. Higher values suggest poorer perceptual mediation and reality testing strain.'),
  S_minus: localize('S-', 'Distorted white-space responses. May indicate oppositional tendencies combined with poor form fit.'),
  P: localize('P', 'Popular response count. Reflects level of conventional social-perceptual agreement with common answers.'),
  X_plus_percent: localize('X+%', 'Excellent/ordinary-plus form proportion. Higher values indicate strong conventional perceptual mediation.'),
  Xu_percent: localize('Xu%', 'Unusual but acceptable form proportion. Elevated values suggest idiosyncratic yet not necessarily distorted perception.'),

  // === Processing ===
  Zf_proc: localize('Zf', 'Processing frequency of organizational activity. Interpreted alongside Zd and W:D:Dd pattern.'),
  Zd_proc: localize('Zd', 'Processing efficiency/imbalance index comparing observed vs expected organization.'),
  W_D_Dd: localize('W:D:Dd', 'Distribution of whole/common-detail/unusual-detail scanning. Describes breadth and selectivity of attention.'),
  W_M: localize('W:M', 'Whole-response to human-movement balance. Often used in interpretive hypotheses on cognitive style.'),
  PSV: localize('PSV', 'Perseveration score. Elevated values suggest rigidity and reduced cognitive flexibility.'),
  DQ_plus_proc: localize('DQ+', 'High-level developmental quality within processing perspective. Indicates integrative structuring ability.'),
  DQ_v_proc: localize('DQv', 'Vague developmental quality within processing perspective. Indicates lower precision of structuring.'),

  // === Interpersonal ===
  COP: localize('COP', 'Cooperative movement indicator. Higher values suggest expectation or representation of collaborative interaction.'),
  AG: localize('AG', 'Aggressive movement indicator. Higher values suggest hostile, forceful, or conflict-oriented interpersonal themes.'),
  a_p_inter: localize('a:p', 'Active-passive balance in interpersonal representation. Helps describe interpersonal stance.'),
  Food: localize('Food', 'Food content count. In context, may reflect dependency, nurturance, or oral-comfort themes.'),
  SumT_inter: localize('SumT', 'Texture score in interpersonal cluster. Often associated with contact and closeness needs.'),
  HumanCont: localize('Human Cont', 'Total human-related content load. Indicates interpersonal salience in representational field.'),
  PureH: localize('Pure H', 'Whole realistic human content. Often linked to mature and integrated human representations.'),
  PER: localize('PER', 'Personalization score. Elevated values may suggest defensive self-reference or interpersonal sensitivity.'),
  ISO_Index: localize('Isol Idx', 'Isolation index. Higher values are often associated with interpersonal distancing or limited relatedness.'),

  // === Self-Perception ===
  _3r_2_R: localize('3r+(2)/R', 'Egocentricity index. Very low may suggest self-devaluation; very high may suggest self-focus or narcissistic coloring.'),
  Fr_rF: localize('Fr+rF', 'Reflection responses. Often interpreted in relation to self-attention, self-regard, and reflective self-focus.'),
  SumV_self: localize('SumV', 'Vista in self-perception domain. Often linked to painful self-evaluation and self-critical processing.'),
  FD: localize('FD', 'Form dimension responses. Frequently related to introspection and psychological distance-taking.'),
  An_Xy: localize('An+Xy', 'Anatomy and X-ray content sum. Elevated values may indicate bodily concern or somatic preoccupation themes.'),
  MOR_self: localize('MOR', 'Morbid content in self domain. Elevated values can reflect negative self-image and damage-oriented themes.'),
  H_ratio: localize('H:(H)+Hd+(Hd)', 'Human representational ratio. Used to evaluate integration and realism of person perception.'),

  // === Special Indices ===
  PTI: localize('PTI', 'Perceptual-Thinking Index. Composite marker related to thought/perceptual disturbance risk profile.'),
  DEPI: localize('DEPI', 'Depression Index. Composite indicator of depressive features; interpret with full protocol context.'),
  CDI: localize('CDI', 'Coping Deficit Index. Composite estimate of social-coping limitations and adaptation strain.'),
  SCON: localize('S-CON', 'Suicide Constellation. Risk-screening constellation that requires careful clinical context and follow-up assessment.'),
  HVI: localize('HVI', 'Hypervigilance Index. Composite pattern suggesting guardedness, mistrust, and threat-monitoring style.'),
  OBS: localize('OBS', 'Obsessive Style Index. Pattern marker for overcontrol, precision focus, and compulsive stylistic tendencies.'),
};
