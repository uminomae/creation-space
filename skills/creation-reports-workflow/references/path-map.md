# [DRAFT / 未完成] Creation Reports Path Map

This reference is provisional and must be refined in the next session.

## Canonical paths (current)
- Status markdown (EN): `assets/creation/survey/en/md/commentary-status.md`
- Status PDF (EN target): `assets/creation/survey/en/pdf/commentary-status.pdf`
- Guides markdown (EN): `assets/creation/guides/en/md/creation-*.md`
- Guides PDF (EN target): `assets/creation/guides/en/pdf/creation-*.pdf`
- Domain markdown (EN): `assets/creation/domains/en/md/commentary-domain-*.md`
- Domain PDF (EN target): `assets/creation/domains/en/pdf/commentary-domain-*.pdf`

## Runtime touchpoints
- `src/reports.js`
- `scripts/check-reports-en-assets.mjs`

## Validation commands
```bash
node scripts/check-reports-en-assets.mjs
node scripts/check-reports-en-assets.mjs --require-en-pdf
```
