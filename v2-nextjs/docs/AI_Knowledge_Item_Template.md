# AI Knowledge Item Template (Rorschach)

Purpose: This template standardizes item descriptions so the in-app AI can retrieve and answer consistently.
Target reader: AI first, human second.

## Writing rules (required)
- Use short, explicit statements.
- Avoid vague words like "usually" unless the condition is defined.
- Separate scoring rules from interpretation hypotheses.
- Always include non-applicable/exception cases.
- If confidence is limited, say what extra context is required.
- Do not make diagnosis-level claims from a single indicator.

## Template A: Scoring Code Item

```md
Item ID: [code]
Item Type: scoring_code
Domain: [Card|Location|DQ|Determinants|FQ|Pair|Contents|Popular|Z|SpecialScore|GHRPHR|Score]
Aliases: [comma-separated variants]

Definition:
- [What this code means in one sentence]

When to Assign:
- [Observable condition 1]
- [Observable condition 2]

Do Not Assign When:
- [Exclusion condition 1]
- [Exclusion condition 2]

Boundary With Similar Codes:
- vs [code A]: [clear difference]
- vs [code B]: [clear difference]

Input Constraints In This App:
- [Any UI/input constraints, auto-rules, caps, mutual exclusions]

Scoring Notes:
- [Rule priority if multiple rules conflict]
- [How to handle ambiguous responses]

Mini Examples:
- Positive example: [very short example]
- Negative example: [very short counter-example]

Interpretation Relevance:
- [Which downstream indices/sections are influenced]

Cautions:
- [Common overcoding/undercoding trap]
- [What additional protocol context is needed]

Source Reliability:
- Primary source: [manual/book/page if known]
- Confidence: [high|medium|low]
```

## Template B: Result Variable Item

```md
Item ID: [variable]
Item Type: result_variable
Domain: [Core|Ideation|Affect|Mediation|Processing|Interpersonal|SelfPerception|SpecialIndices|UpperSection]
Aliases: [notation variants]

Operational Definition:
- Formula: [exact formula or computation rule]
- Components: [list of required components]

What High / Low Means (Non-diagnostic):
- Higher side: [concise tendency statement]
- Lower side: [concise tendency statement]

Interpretive Preconditions:
- [Minimum R, validity cautions, profile conditions, etc.]

Cross-Checks:
- Check with [variable A]: [why]
- Check with [variable B]: [why]

Common Misreadings:
- [misreading 1] -> [correction]
- [misreading 2] -> [correction]

AI Response Guideline:
- Safe wording: [recommended phrasing style]
- Avoid wording: [phrases that overstate certainty]

Cautions:
- [Single-variable limits]
- [Need for protocol-wide integration]

Source Reliability:
- Primary source: [manual/book/page if known]
- Confidence: [high|medium|low]
```

## JSON-like compact format (optional for future indexing)

```txt
id: Zf
type: result_variable
domain: UpperSection
definition.formula: "Count of Z-scored responses"
interpretation.high: "More scanning/organizational effort may be present"
interpretation.low: "Less scanning/organizational effort may be present"
cross_checks: ["Zd", "W:D:Dd"]
cautions: ["Interpret with protocol size and quality", "No single-index conclusion"]
confidence: medium
```

## Minimum quality checklist per item
- Definition is one-sentence and testable.
- Assignment conditions are observable, not inferred motives.
- At least two boundary distinctions are present.
- At least one false-positive trap is documented.
- Interpretation text avoids diagnostic certainty.
- A confidence level is explicitly set.
