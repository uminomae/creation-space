#!/usr/bin/env bash
set -euo pipefail

# [DRAFT / 未完成]
# This wrapper is intentionally provisional.
# Refine and split responsibilities in the next session.

REPO_ROOT="${1:-$(pwd)}"
cd "$REPO_ROOT"

echo "[creation-reports-workflow:draft] step 1/4 detect EN asset state"
check_output="$(node scripts/check-reports-en-assets.mjs)"
echo "$check_output"

optional_missing="$(printf '%s\n' "$check_output" | sed -nE 's/.*optional-missing: ([0-9]+).*/\1/p' | head -n 1)"
if [[ -z "$optional_missing" ]]; then
  optional_missing="0"
fi

if [[ "$optional_missing" -eq 0 ]]; then
  pdf_mode="open"
else
  pdf_mode="pending"
fi
echo "[creation-reports-workflow:draft] EN PDF mode: ${pdf_mode}"

echo "[creation-reports-workflow:draft] step 2/4 verify html/js touchpoints"
rg -n 'id="reports-md-open-pdf"' index.html >/dev/null
rg -n 'resolveFirstAvailablePdfUrl|setModalPdfButton' src/reports.js >/dev/null
echo "[creation-reports-workflow:draft] html/js touchpoints: OK"

echo "[creation-reports-workflow:draft] step 3/4 validate by policy"
if [[ "$pdf_mode" == "open" ]]; then
  node scripts/check-reports-en-assets.mjs --require-en-pdf
else
  echo "[creation-reports-workflow:draft] skip --require-en-pdf (pending mode)"
fi

echo "[creation-reports-workflow:draft] step 4/4 next action"
if [[ "$pdf_mode" == "open" ]]; then
  echo "[creation-reports-workflow:draft] Apply/verify Open PDF UI behavior in src/reports.js and smoke-check."
else
  echo "[creation-reports-workflow:draft] Keep/verify PDF Pending UI behavior in src/reports.js and smoke-check."
fi

echo "[creation-reports-workflow:draft] done (DRAFT)"
