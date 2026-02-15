# EN Batch 01 Notes - Determinants

Date: 2026-02-14
Scope: Determinants + FQ + DQ + Location + Card + Contents + Z + G/PHR + Special Score in `lib/docsDetailed.ts` (English only)

## App-rule evidence used
- `components/input/InputTable.tsx`
  - Fr/rF and Pair (2) mutual exclusion
  - DQ `v` constraints (FQ `+` prohibited, Z blocked)
  - Pure formless determinant handling to FQ `none`
  - Formless set used in app logic: `C`, `T`, `V`, `Y`, `Cn`

- `i18n/locales/ko.json`
  - User-facing rule confirmations (reflection-pair, pure determinant FQ auto-setting)

## Reference reading used
- `docs/ref/로샤 종합체계 부호화 및 해석 한글 가이드라인.txt`
  - Texture determinant guidance (T / TF / FT)
  - Vista determinant guidance (V / VF / FV)
  - Reflection and Pair guidance (Fr / rF / (2))
  - Shading-system context and coding distinctions

## Output behavior change
- In `더보기` documentation, determinant entries now return item-specific English content instead of one generic scoring paragraph.
- FQ (`+`, `o`, `u`, `-`, `none`) and DQ (`+`, `o`, `v/+`, `v`) now also return item-specific English content.
- Location (`W`, `WS`, `D`, `DS`, `Dd`, `DdS`, `S`) now returns item-specific English content.
- Card (`I` to `X`) now returns item-specific English content.
- Contents (`H` to `Id`) now returns item-specific English content.
- Z (`ZW`, `ZA`, `ZD`, `ZS`) now returns item-specific English content.
- G/PHR (`GHR`, `PHR`) now returns item-specific English content.
- Special Scores (`DV1/2`, `INCOM1/2`, `DR1/2`, `FABCOM1/2`, `CONTAM`, `ALOG`, `PSV`, `AB`, `AG`, `COP`, `MOR`, `PER`, `CP`) now return item-specific English content.
- Other categories remain on the previous generic path and will be detailed in subsequent batches.
