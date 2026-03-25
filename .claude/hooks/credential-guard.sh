#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/_common"
hook_init

find_sensitive_refs() {
  python3 - "$HOOK_PAYLOAD_FILE" <<'PY'
import json
import os
import re
import sys

payload_path = sys.argv[1]

with open(payload_path, encoding="utf-8") as fh:
    data = json.load(fh)

tool_input = data.get("tool_input") or data.get("input") or {}

strings = []

def walk(value):
    if isinstance(value, dict):
        for item in value.values():
            walk(item)
    elif isinstance(value, list):
        for item in value:
            walk(item)
    elif isinstance(value, str) and value:
        strings.append(value)

walk(tool_input)

home = os.path.expanduser("~")
seen = set()

def iter_tokens(text):
    for token in re.findall(r"[^\s\"'`]+", text):
        yield token
        if "=" in token:
            _, rhs = token.split("=", 1)
            if rhs:
                yield rhs

def normalize(token):
    token = token.lstrip("@")
    token = token.strip(",:;()[]{}")
    return token

def match_sensitive(token):
    token = normalize(token)
    if not token:
        return None

    basename = os.path.basename(token)
    expanded = os.path.expanduser(token)

    if basename == ".env" or basename.startswith(".env."):
        return token
    if basename in {".npmrc", ".netrc", "credentials.json", "secrets.json"}:
        return token
    if basename.endswith(".pem") or basename.endswith(".key"):
        return token
    if "_token" in basename:
        return token
    if token.startswith("~/.ssh/") or expanded.startswith(os.path.join(home, ".ssh") + os.sep):
        return token
    if token.startswith("~/.aws/") or expanded.startswith(os.path.join(home, ".aws") + os.sep):
        return token
    if token == "~/.config/gh/hosts.yml" or expanded == os.path.join(home, ".config", "gh", "hosts.yml"):
        return token
    return None

for text in strings:
    for token in iter_tokens(text):
        match = match_sensitive(token)
        if match and match not in seen:
            seen.add(match)
            print(match)
PY
}

[ "$(hook_event_name)" = "PreToolUse" ] || exit 0

case "$(hook_tool_name)" in
  Read|Glob|Grep|Bash)
    ;;
  *)
    exit 0
    ;;
esac

while IFS= read -r sensitive_ref; do
  [ -n "$sensitive_ref" ] || continue
  hook_warn "⚠️ 認証情報ファイルへのアクセスを検知: ${sensitive_ref}"
done < <(find_sensitive_refs)

exit 0
