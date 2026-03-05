# [DRAFT / 未完成] Creation Reports Path Map

This reference is provisional and must be refined in the next session.

## Canonical paths (current)
- Status markdown (EN): `assets/creation/survey/en/md/survey-status.md`
- Status PDF (EN target): `assets/creation/survey/en/pdf/survey-status.pdf`
- Guides markdown (EN): `assets/creation/guides/en/md/creation-*.md`
- Guides PDF (EN target): `assets/creation/guides/en/pdf/creation-*.pdf`
- Domain markdown (EN): `assets/creation/domains/en/md/domain-*.md`
- Domain PDF (EN target): `assets/creation/domains/en/pdf/domain-*.pdf`

## Runtime touchpoints
- `src/reports.js`
- `scripts/validate-outputs.mjs`

## Validation commands
```bash
node scripts/validate-outputs.mjs
node scripts/validate-outputs.mjs --allow-missing-pdf
```
