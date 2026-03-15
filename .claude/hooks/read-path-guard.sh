#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/_common"
hook_init

event_name="$(hook_event_name)"
tool_name="$(hook_tool_name)"
read_state_path="${HOOK_CACHE_DIR}/read-state.json"

hook_mark_read_state() {
  local rel_path="$1"
  python3 - "$read_state_path" "$HOOK_SESSION_ID" "$rel_path" <<'PY'
import json
import os
import sys
from datetime import datetime, timezone

state_path, session_id, rel_path = sys.argv[1:4]
state = {"sessions": {}}
if os.path.exists(state_path):
    with open(state_path, encoding="utf-8") as fh:
        state = json.load(fh)

session = state["sessions"].setdefault(session_id, {"reads": {}, "updated_at": None})
session["reads"][rel_path] = datetime.now(timezone.utc).isoformat()
session["updated_at"] = datetime.now(timezone.utc).isoformat()

with open(state_path, "w", encoding="utf-8") as fh:
    json.dump(state, fh, ensure_ascii=False, indent=2)
    fh.write("\n")
PY
}

if [ "$event_name" = "PreToolUse" ]; then
  current_cwd="$(hook_cwd)"
  case "$current_cwd" in
    "${REPO_ROOT}"|${REPO_ROOT}/*)
      ;;
    *)
      hook_block "repo ルート外での作業は許可されていません: ${current_cwd}"
      ;;
  esac

  if [ "$tool_name" = "Bash" ]; then
    command_text="$(hook_tool_input_field command)"
    if printf '%s' "$command_text" | rg -q '\.cache/inbox/' && ! printf '%s' "$command_text" | rg -q "${REPO_ROOT}/\.cache/inbox/"; then
      hook_block ".cache/inbox/ を Bash から参照するときはフルパスを使ってください。"
    fi
  fi

  while IFS= read -r raw_path; do
    [ -n "$raw_path" ] || continue
    normalized="$(hook_normalize_path "$raw_path")"
    rel_path="$(hook_repo_rel "$normalized" 2>/dev/null || true)"
    if [ "$tool_name" = "Read" ] && [ -f "$normalized" ]; then
      line_count="$(wc -l < "$normalized" | tr -d ' ')"
      if [ "$line_count" -gt 400 ]; then
        hook_warn "大きなファイルです (${rel_path}, ${line_count} lines)。全文読みではなく section 指定を優先してください。"
      fi
    fi
    case "$rel_path" in
      docs/*|.claude/rules/*)
        if ! hook_transcript_contains "CLAUDE.md"; then
          hook_warn "docs/ や .claude/rules/ を読む前に CLAUDE.md を確認してください。"
        fi
        ;;
    esac
  done < <(hook_collect_paths)
fi

if [ "$event_name" = "PostToolUse" ] && [ "$tool_name" = "Read" ]; then
  while IFS= read -r raw_path; do
    [ -n "$raw_path" ] || continue
    normalized="$(hook_normalize_path "$raw_path")"
    rel_path="$(hook_repo_rel "$normalized" 2>/dev/null || true)"
    [ -n "$rel_path" ] || continue
    hook_mark_read_state "$rel_path"
  done < <(hook_collect_paths)
fi
