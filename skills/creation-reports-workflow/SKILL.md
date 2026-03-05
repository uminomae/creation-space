---
name: creation-reports-workflow
description: Draft workflow for maintaining Creation REPORTS assets and links across survey/guides/domains. Use when path renames occur, REPORTS modal links need fixes, EN PDFs must be bootstrapped, visibility toggles must be checked, and issue/commit work reports are required.
---

# [DRAFT / 未完成] Creation Reports Workflow

> This skill is intentionally incomplete.
> Use it as a bootstrap now and explicitly refine it in the next session.

## Quick Start (Draft Call Side)
1. Run: `bash skills/creation-reports-workflow/scripts/run-draft-workflow.sh /absolute/path/to/repo`
2. Confirm checks and decide whether to keep/remove generated EN PDFs.
3. Post work report to issues and commit changes.

## Workflow

1. Scan impact first
```bash
rg -n "creation/commentary|creation/survey|commentary-status|commentary-domain" src scripts assets README.md index.html
```

2. Apply path and link updates
- Keep directory path (`survey`, `guides`, `domains`) consistent with runtime constants in `src/reports.js`.
- Keep EN asset checks in sync with runtime path policy via `scripts/check-reports-en-assets.mjs`.

3. Generate EN PDFs (draft bootstrap)
```bash
bash scripts/reports-en-pdf-draft.sh
```
- This is provisional output from markdown page printing.
- Treat generated PDFs as placeholders until the next refinement session.

4. Validate
```bash
node scripts/check-reports-en-assets.mjs
node scripts/check-reports-en-assets.mjs --require-en-pdf
```

5. Smoke check in browser
- Open REPORTS section and verify markdown modal + PDF button state.
- Ensure existing JA behavior remains unchanged.

6. Report and commit
- Append issue work report (what changed, what remains).
- Commit with clear scope (`fix/reports` or `refactor/creation`).

## Known Gaps (Refine Next Session)
- Improve PDF generation quality (typography/layout/template), not just raw markdown print.
- Add stricter link visibility matrix tests for JA/EN.
- Add a one-command issue reporting helper.

## References
- `references/path-map.md`: current canonical path map for reports/survey/guides/domains.
- `scripts/run-draft-workflow.sh`: draft orchestrator for this workflow.
