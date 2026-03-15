#!/usr/bin/env bash
set -euo pipefail

payload_file="$(mktemp)"
cat >"${payload_file}"
trap 'rm -f "${payload_file}"' EXIT

python3 - "${payload_file}" <<'PY'
import json
import sys

payload_path = sys.argv[1]
with open(payload_path, encoding="utf-8") as fh:
    payload = json.load(fh)

event_name = payload.get("hook_event_name", "")
tool_input = payload.get("tool_input") or payload.get("input") or {}
tool_input_text = json.dumps(tool_input, ensure_ascii=False)

if event_name != "PostToolUse":
    raise SystemExit(0)

if "shell.css" in tool_input_text or "src/styles/" in tool_input_text:
    print(
        "hook warn: CSS変数を変更しました。docs/design-system.md と dev-components.html も確認・更新してください",
        file=sys.stderr,
    )
PY
