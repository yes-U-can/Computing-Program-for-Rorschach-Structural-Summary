# English Detailing Workflow (AI-first)

Goal: Produce high-precision, AI-readable item descriptions for in-app Rorschach documentation.
Scope: English first, then propagate to ko/ja/es/pt after English quality lock.

## Source policy
- Primary references: `docs/ref/로샤 종합체계 부호화 및 해석 한글 가이드라인.txt` and Exner-aligned references in `docs/ref/*.txt`.
- Rule: scoring criteria must be evidence-anchored; interpretation language must stay non-diagnostic and conditional.

## Execution order
1. Scoring foundations (highest retrieval impact)
- Location
- DQ
- Determinants
- FQ
- Pair / Popular

2. Cognitive error/special score layer
- DV/INCOM/DR/FABCOM/ALOG/CONTAM
- AB/AG/COP/MOR/PER/CP

3. Upper Section and Core regulators
- Zf, ZSum, ZEst, Zd
- Lambda, EB, EA, eb/es, D/AdjD

4. Domain clusters
- Ideation
- Affect
- Mediation
- Processing
- Interpersonal
- Self-Perception

5. Composite indices
- PTI, DEPI, CDI, S-CON, HVI, OBS

## Per-item writing format
- Definition
- Operational basis (formula/rule)
- Interpretive direction (high/low, non-diagnostic)
- Cross-check variables
- Misreadings to avoid
- Clinical cautions

## Quality gates
- Q1. No single-variable diagnosis claims
- Q2. Includes at least 2 cross-check links
- Q3. Uses explicit conditions instead of vague language
- Q4. States protocol validity constraints when relevant

## Delivery cadence
- Batch size: 6-12 items
- Each batch: write -> consistency pass -> integrate into app -> quick UI smoke check
- Current batch: Special Indices (6 items)
