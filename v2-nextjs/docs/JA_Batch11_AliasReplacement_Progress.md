## JA Batch 11 - Alias Replacement Progress

Date: 2026-02-14

### Completed in this batch
- Replaced Japanese alias maps with native Japanese content for:
  - `CARD_DETAILS_JA` (I~X)
  - `CONTENT_DETAILS_JA` (core set; remaining set already covered by `CONTENT_DETAILS_JA_EXTRA`)
  - `FQ_DETAILS_JA`
  - `DQ_DETAILS_JA`
  - `LOCATION_DETAILS_JA`
  - `Z_DETAILS_JA`
  - `GPHR_DETAILS_JA`
  - `SPECIAL_SCORE_DETAILS_JA`

### Remaining alias
- `DETERMINANT_DETAILS_JA` is still aliased to EN and is the final major JA alias block.

### Validation
- `npx.cmd eslint lib/docsDetailed.ts` passed.
- `npm.cmd test` passed (all test files green).
