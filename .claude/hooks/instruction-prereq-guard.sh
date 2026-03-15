#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/_common"
hook_init

read_state_path="${HOOK_CACHE_DIR}/read-state.json"

hook_has_read_state() {
  local rel_path="$1"
  python3 - "$read_state_path" "$HOOK_SESSION_ID" "$rel_path" <<'PY'
import json
import os
import sys

state_path, session_id, rel_path = sys.argv[1:4]
if os.path.exists(state_path):
    with open(state_path, encoding="utf-8") as fh:
        state = json.load(fh)
    reads = state.get("sessions", {}).get(session_id, {}).get("reads", {})
    if rel_path in reads:
        sys.exit(0)
sys.exit(1)
PY
}

if [ "$(hook_event_name)" != "PreToolUse" ]; then
  exit 0
fi

is_instruction_target=0
instruction_target=""
while IFS= read -r raw_path; do
  [ -n "$raw_path" ] || continue
  normalized="$(hook_normalize_path "$raw_path")"
  rel_path="$(hook_repo_rel "$normalized" 2>/dev/null || true)"
  case "$rel_path" in
    .cache/inbox/_instructions-*.md)
      is_instruction_target=1
      instruction_target="$rel_path"
      break
      ;;
  esac
done < <(hook_collect_paths)

if [ "$is_instruction_target" -ne 1 ]; then
  exit 0
fi

case "$instruction_target" in
  .cache/inbox/_instructions-*.md)
    ;;
  *)
    hook_block "CLI 指示書は .cache/inbox/_instructions-*.md に配置してください。"
    ;;
esac

missing=()
for required in "skills/cli-instruction/SKILL.md" "docs/README.md"; do
  if ! hook_has_read_state "$required" && ! hook_transcript_contains "$required"; then
    missing+=("$required")
  fi
done

if [ "${#missing[@]}" -gt 0 ]; then
  hook_block "CLI 指示書を編集する前に必読ファイルを読んでください: ${missing[*]}"
fi
