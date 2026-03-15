#\!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/_common"
hook_init

if [ "$(hook_event_name)" \!= "SessionStart" ]; then
  exit 0
fi

session_state_path="${HOOK_CACHE_DIR}/session-start-state.json"
branch_name="$(git -C "$REPO_ROOT" branch --show-current)"

python3 - "$session_state_path" "$HOOK_SESSION_ID" "$branch_name" <<'PY'
import json
import os
import sys
from datetime import datetime, timezone

state_path, session_id, branch_name = sys.argv[1:4]
state = {"sessions": {}}
if os.path.exists(state_path):
    with open(state_path, encoding="utf-8") as fh:
        state = json.load(fh)

state["sessions"][session_id] = {
    "branch": branch_name,
    "started_at": datetime.now(timezone.utc).isoformat(),
}

with open(state_path, "w", encoding="utf-8") as fh:
    json.dump(state, fh, ensure_ascii=False, indent=2)
    fh.write("\n")
PY

if [ "$branch_name" \!= "develop" ]; then
  hook_block "セッション開始時は develop ブランチである必要があります。現在: ${branch_name}"
fi

if find "${REPO_ROOT}/.cache/outbox" -maxdepth 1 -type f \( -name 'DONE-*.md' -o -name 'REVIEW-*.md' \) 2>/dev/null | grep -q .; then
  hook_warn "未処理の DONE/REVIEW outbox があります。セッション開始手順どおり先に確認してください。"
fi

if \! hook_transcript_contains ".cache/session/state.md" && [ -f "${REPO_ROOT}/.cache/session/state.md" ]; then
  hook_warn "セッション開始手順の先頭で .cache/session/state.md を確認してください。"
fi
