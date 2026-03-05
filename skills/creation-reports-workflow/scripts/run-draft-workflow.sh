#!/usr/bin/env bash
set -euo pipefail

# [DRAFT / 未完成]
# This wrapper is intentionally provisional.
# Refine and split responsibilities in the next session.

REPO_ROOT="${1:-$(pwd)}"
cd "$REPO_ROOT"

echo "[creation-reports-workflow:draft] step 1/3 generate EN draft PDFs"
bash scripts/reports-en-pdf-draft.sh

echo "[creation-reports-workflow:draft] step 2/3 check EN assets"
node scripts/check-reports-en-assets.mjs

echo "[creation-reports-workflow:draft] step 3/3 require EN PDF assets"
node scripts/check-reports-en-assets.mjs --require-en-pdf

echo "[creation-reports-workflow:draft] done"
