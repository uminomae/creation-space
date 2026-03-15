#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/_common"
hook_init

issue_state_path="${HOOK_CACHE_DIR}/issue-state.json"
event_name="$(hook_event_name)"
tool_name="$(hook_tool_name)"
command_text="$(hook_tool_input_field command)"

record_issue_action() {
  local action="$1"
  local issue_ref="$2"
  local with_comment="$3"
  python3 - "$issue_state_path" "$HOOK_SESSION_ID" "$action" "$issue_ref" "$with_comment" "$command_text" <<'PY'
import json
import os
import sys
from datetime import datetime, timezone

state_path, session_id, action, issue_ref, with_comment, command_text = sys.argv[1:7]
state = {"sessions": {}}
if os.path.exists(state_path):
    with open(state_path, encoding="utf-8") as fh:
        state = json.load(fh)

session = state["sessions"].setdefault(
    session_id,
    {"actions": [], "updated_at": None},
)
session["actions"].append(
    {
        "action": action,
        "issue_ref": issue_ref,
        "with_comment": with_comment == "1",
        "command": command_text,
        "at": datetime.now(timezone.utc).isoformat(),
    }
)
session["updated_at"] = datetime.now(timezone.utc).isoformat()

with open(state_path, "w", encoding="utf-8") as fh:
    json.dump(state, fh, ensure_ascii=False, indent=2)
    fh.write("\n")
PY
}

extract_issue_ref() {
  local action="$1"
  python3 - "$command_text" "$action" <<'PY'
import re
import sys

command_text, action = sys.argv[1], sys.argv[2]
patterns = {
    "create": [r"--title\s+['\"]?[^'\"]+['\"]?"],
    "close": [r"gh\s+issue\s+close\s+([0-9]+)", r"issue\s+close\s+#?([0-9]+)"],
    "comment": [r"gh\s+issue\s+comment\s+([0-9]+)", r"issue\s+comment\s+#?([0-9]+)"],
}
for pattern in patterns.get(action, []):
    match = re.search(pattern, command_text)
    if match and match.groups():
        print(match.group(1))
        sys.exit(0)
if action == "create":
    print("new-issue")
PY
}

session_summary() {
  python3 - "$issue_state_path" "$HOOK_SESSION_ID" <<'PY'
import json
import os
import sys

state_path, session_id = sys.argv[1:3]
if not os.path.exists(state_path):
    sys.exit(1)
with open(state_path, encoding="utf-8") as fh:
    state = json.load(fh)
session = state.get("sessions", {}).get(session_id)
if not session:
    sys.exit(1)
print(json.dumps(session, ensure_ascii=False))
PY
}

if [ "$event_name" = "PostToolUse" ] && [ "$tool_name" = "Bash" ]; then
  case "$command_text" in
    *"gh issue create"*)
      record_issue_action "create" "$(extract_issue_ref create)" 0
      ;;
    *"gh issue close"*)
      if printf '%s' "$command_text" | rg -q -- '--comment'; then
        with_comment=1
      else
        with_comment=0
      fi
      record_issue_action "close" "$(extract_issue_ref close)" "$with_comment"
      ;;
    *"gh issue comment"*)
      record_issue_action "comment" "$(extract_issue_ref comment)" 1
      ;;
  esac
  exit 0
fi

if [ "$event_name" != "Stop" ]; then
  exit 0
fi

session_json="$(session_summary 2>/dev/null || true)"
if [ -z "$session_json" ]; then
  exit 0
fi

needs_sync="$(printf '%s' "$session_json" | jq -r 'any(.actions[]; .action == "create" or .action == "close")')"
has_comment="$(printf '%s' "$session_json" | jq -r 'any(.actions[]; .action == "comment" or .with_comment == true)')"

if [ "$needs_sync" = "true" ] && ! hook_transcript_contains ".cache/backlog.md"; then
  hook_block "Issue 起票/close 後は同一セッションで .cache/backlog.md を更新してください。"
fi

if [ "$needs_sync" = "true" ] && [ "$has_comment" != "true" ]; then
  hook_block "Issue 起票/close を行ったセッションでは comment も同一セッションで残してください。"
fi

if printf '%s' "$session_json" | jq -e 'any(.actions[]; .action == "close")' >/dev/null; then
  close_issue_ref="$(printf '%s' "$session_json" | jq -r '.actions[] | select(.action == "close") | .issue_ref' | head -n 1)"
  instruction_file="$(find "${REPO_ROOT}/.cache/inbox" -maxdepth 1 -type f -name "*${close_issue_ref}*.md" | head -n 1 || true)"
  if [ -n "$instruction_file" ] && ! rg -q '^## Issue close 条件' "$instruction_file"; then
    hook_warn "Issue #${close_issue_ref} を close する前提の指示書に '## Issue close 条件' が見つかりません。"
  fi
fi

if hook_transcript_contains "_instructions-" && ! find "${REPO_ROOT}/.cache/outbox" -maxdepth 1 -type f -name 'DONE-*.md' | grep -q .; then
  hook_block "外部エージェント完了セッションでは .cache/outbox/DONE-*.md の作成が必須です。"
fi

agent_issues_file="${HOOK_CACHE_DIR}/agent-issues.json"
if [ -f "$agent_issues_file" ]; then
  pending_count=$(python3 -c "
import json
with open('$agent_issues_file', encoding='utf-8') as f:
    data = json.load(f)
pending = [p for p in data.get('pending', []) if p.get('status') == 'running']
print(len(pending))
" 2>/dev/null || echo "0")
  if [ "$pending_count" -gt 0 ]; then
    pending_issues=$(python3 -c "
import json
with open('$agent_issues_file', encoding='utf-8') as f:
    data = json.load(f)
for p in data.get('pending', []):
    if p.get('status') == 'running':
        print(f\"  - #{p['issue']} ({p['description']})\")
" 2>/dev/null || echo "  (読み取り失敗)")
    hook_warn "Agent subagent で処理した Issue の完了処理（コメント・close・backlog更新）が未確認です:
${pending_issues}
手動で Issue を更新してください。"
  fi
fi
