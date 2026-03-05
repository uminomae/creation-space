---
name: creation-reports-workflow
description: Draft workflow for maintaining Creation REPORTS assets and links across survey/guides/domains. Use when path renames occur, REPORTS modal links need fixes, EN PDFs must be bootstrapped, visibility toggles must be checked, and issue/commit work reports are required.
---

# [DRAFT / 未完成] Creation Reports Workflow

> This skill is intentionally incomplete.
> Use it as a bootstrap now and explicitly refine it in the next session.

## Quick Start (Draft Call Side)
1. Run: `bash skills/creation-reports-workflow/scripts/run-draft-workflow.sh /absolute/path/to/repo`
2. Decide UI mode from actual PDF presence.
3. Apply HTML/JS fixes, then post work report and commit.

## Workflow

1. Scan impact first
```bash
rg -n "creation/commentary|creation/survey|commentary-status|commentary-domain" src scripts assets README.md index.html
```

2. Apply path and link updates
- Keep directory path (`survey`, `guides`, `domains`) consistent with runtime constants in `src/reports.js`.
- Keep EN asset checks in sync with runtime path policy via `scripts/check-reports-en-assets.mjs`.

3. Decide from existing PDFs (no generation in this workflow)
```bash
node scripts/check-reports-en-assets.mjs
```
- If EN PDFs are missing, keep `PDF Pending` behavior.
- If EN PDFs exist, ensure `Open PDF` is enabled.

4. Apply HTML/JS fixes
- `index.html`: keep modal PDF anchor `#reports-md-open-pdf` in footer.
- `src/reports.js`: keep status/report path constants aligned to current directory policy.
- `src/reports.js`: keep existence-based PDF resolution (`resolveFirstAvailablePdfUrl`) and `setModalPdfButton`.

5. Validate
```bash
node scripts/check-reports-en-assets.mjs
```
- Run `--require-en-pdf` only when EN PDFs are expected to exist.

6. Smoke check in browser
- Open REPORTS section and verify markdown modal + PDF button state.
- Ensure existing JA behavior remains unchanged.

7. Report and commit
- Append issue work report (what changed, what remains).
- Commit with clear scope (`fix/reports` or `refactor/creation`).

## Known Gaps (Refine Next Session)
- Improve PDF generation quality (typography/layout/template), not just raw markdown print.
- Add stricter link visibility matrix tests for JA/EN.
- Add a one-command issue reporting helper.

## References
- `references/path-map.md`: current canonical path map for reports/survey/guides/domains.
- `scripts/run-draft-workflow.sh`: draft orchestrator for this workflow.
