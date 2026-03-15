#\!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/_common"
hook_init

state_lock_path="${REPO_ROOT}/.cache/session/state.lock"
lock_state_path="${HOOK_CACHE_DIR}/lock-state.json"
event_name="$(hook_event_name)"

touches_state_files() {
  local raw_path normalized rel
  while IFS= read -r raw_path; do
    [ -n "$raw_path" ] || continue
    normalized="$(hook_normalize_path "$raw_path")"
    rel="$(hook_repo_rel "$normalized" 2>/dev/null || true)"
    case "$rel" in
      .cache/session/state.md|.cache/backlog.md)
        return 0
        ;;
    esac
  done < <(hook_collect_paths)
  return 1
}

record_touch() {
  python3 - "$lock_state_path" "$HOOK_SESSION_ID" <<'PY'
import json
import os
import sys
from datetime import datetime, timezone

state_path, session_id = sys.argv[1:3]
state = {"sessions": {}}
if os.path.exists(state_path):
    with open(state_path, encoding="utf-8") as fh:
        state = json.load(fh)

state["sessions"][session_id] = {
    "touched": True,
    "updated_at": datetime.now(timezone.utc).isoformat(),
}

with open(state_path, "w", encoding="utf-8") as fh:
    json.dump(state, fh, ensure_ascii=False, indent=2)
    fh.write("\n")
PY
}

session_touched() {
  python3 - "$lock_state_path" "$HOOK_SESSION_ID" <<'PY'
import json
import os
import sys

state_path, session_id = sys.argv[1:3]
if not os.path.exists(state_path):
    sys.exit(1)

with open(state_path, encoding="utf-8") as fh:
    state = json.load(fh)

if state.get("sessions", {}).get(session_id, {}).get("touched"):
    sys.exit(0)
sys.exit(1)
PY
}

case "$event_name" in
  PreToolUse)
    if \! touches_state_files; then
      exit 0
    fi
    if [ \! -f "$state_lock_path" ]; then
      hook_block ".cache/session/state.md または .cache/backlog.md を更新する前に .cache/session/state.lock を取得してください。"
    fi
    lock_age="$(hook_file_age_seconds "$state_lock_path" 2>/dev/null || echo 0)"
    if [ "$lock_age" -gt 300 ]; then
      hook_block ".cache/session/state.lock が stale です。削除と再取得を先に実施してください。"
    fi
    record_touch
    ;;
  Stop)
    if \! session_touched; then
      exit 0
    fi
    if [ -f "$state_lock_path" ]; then
      hook_block "state/backlog 更新後も .cache/session/state.lock が残っています。lock を解放してから終了してください。"
    fi
    ;;
esac
