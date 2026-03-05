#!/usr/bin/env bash
set -euo pipefail

# [DRAFT / 未完成]
# Bootstrap EN PDFs by printing local markdown pages as provisional PDFs.
# This is a temporary workflow and must be polished in the next session.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-4173}"
LOG_FILE="${TMPDIR:-/tmp}/creation-reports-en-pdf-${PORT}.log"

declare -a MAPPINGS=(
  "assets/creation/survey/en/md/commentary-status.md::assets/creation/survey/en/pdf/commentary-status.pdf"
  "assets/creation/guides/en/md/creation-general.md::assets/creation/guides/en/pdf/creation-general.pdf"
  "assets/creation/guides/en/md/creation-designer.md::assets/creation/guides/en/pdf/creation-designer.pdf"
  "assets/creation/guides/en/md/creation-academic.md::assets/creation/guides/en/pdf/creation-academic.pdf"
  "assets/creation/domains/en/md/commentary-domain-d22-business-management-academic.md::assets/creation/domains/en/pdf/commentary-domain-d22-business-management-academic.pdf"
)

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

cd "$ROOT_DIR"
python3 -m http.server "$PORT" >"$LOG_FILE" 2>&1 &
SERVER_PID=$!
sleep 1

for mapping in "${MAPPINGS[@]}"; do
  md_path="${mapping%%::*}"
  pdf_path="${mapping##*::}"
  mkdir -p "$(dirname "$pdf_path")"

  source_url="http://127.0.0.1:${PORT}/scripts/md-print.html?src=${md_path}"
  echo "[reports-en-pdf-draft] ${md_path} -> ${pdf_path}"
  npx --yes playwright pdf --paper-format A4 --wait-for-selector "body.ready" --wait-for-timeout 200 "$source_url" "$pdf_path" >/dev/null
done

echo "[reports-en-pdf-draft] completed"
