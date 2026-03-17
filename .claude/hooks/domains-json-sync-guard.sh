#\!/usr/bin/env bash
# domains-json-sync-guard.sh — cs#110
# Stop: index.json 変更時に generate-domains-json.mjs --check 実行、差分あれば WARN
# PostToolUse: pjdhiro/domains.json への直接書き込みを BLOCK

set -euo pipefail
source "$(dirname "$0")/_common"
hook_init

TOOL="$(hook_tool_name)"
EVENT="$(hook_event_name)"

INDEX_REL="transform/domains/publish/domains/index.json"
PJDHIRO_DOMAINS_REL="assets/creation/manifests/domains.json"
PJDHIRO_ROOT="${REPO_ROOT}/../pjdhiro"

# ---- PostToolUse: pjdhiro/domains.json 直接書き込み BLOCK ----
if [ "$EVENT" = "PostToolUse" ]; then
  paths="$(hook_collect_paths)"
  [ -z "$paths" ] && exit 0

  while IFS= read -r p; do
    norm="$(hook_normalize_path "$p")" || continue
    # pjdhiro/assets/creation/manifests/domains.json への書き込みを検知
    if echo "$norm" | grep -qF "pjdhiro/${PJDHIRO_DOMAINS_REL}"; then
      hook_block "pjdhiro/domains.json への直接書き込みは禁止です。generate-domains-json.mjs を使用してください。"
    fi
  done <<< "$paths"
  exit 0
fi

# ---- Stop: index.json 変更時に同期チェック ----
if [ "$EVENT" = "Stop" ]; then
  # index.json が変更されているか確認
  local_changes="$(git -C "$REPO_ROOT" diff --name-only -- "$INDEX_REL" 2>/dev/null || true)"
  staged_changes="$(git -C "$REPO_ROOT" diff --cached --name-only -- "$INDEX_REL" 2>/dev/null || true)"

  if [ -z "$local_changes" ] && [ -z "$staged_changes" ]; then
    exit 0
  fi

  # generate-domains-json.mjs --check を実行
  if [ -x "${REPO_ROOT}/scripts/generate-domains-json.mjs" ] || [ -f "${REPO_ROOT}/scripts/generate-domains-json.mjs" ]; then
    check_output="$(node "${REPO_ROOT}/scripts/generate-domains-json.mjs" --check 2>&1)" || true
    check_exit=$?

    if [ $check_exit -ne 0 ] || echo "$check_output" | grep -qiE 'differ|mismatch|changed'; then
      hook_warn "index.json が変更されましたが pjdhiro/domains.json と同期されていません。generate-domains-json.mjs を実行してください。"
      hook_warn "詳細: ${check_output}"
    fi
  else
    hook_warn "generate-domains-json.mjs が見つかりません。index.json 変更後の同期チェックをスキップしました。"
  fi
  exit 0
fi

exit 0
