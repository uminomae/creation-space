#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/_common"
hook_init

[ "$(hook_event_name)" = "PreToolUse" ] || exit 0
[ "$(hook_tool_name)" = "Bash" ] || exit 0

command_text="$(hook_tool_input_field command)"
[ -n "$command_text" ] || exit 0

if python3 - "$command_text" <<'PY'
import os
import re
import shlex
import sys

command_text = sys.argv[1]
home = os.path.expanduser("~")

exfil_tool = re.compile(r'(^|[^A-Za-z0-9_-])(curl|wget|nc|ncat)(?=$|[^A-Za-z0-9_-])')
data_flag = re.compile(
    r'(^|[^A-Za-z0-9_-])('
    r'--data(?:-[A-Za-z]+)?'
    r'|-d'
    r'|--upload-file'
    r'|-T'
    r'|--post-file'
    r')(?=$|[^A-Za-z0-9_-])'
)
command_substitution = re.compile(r'\$\([^)]*\)|`[^`]+`')

if not exfil_tool.search(command_text):
    sys.exit(1)

sensitive_patterns = [
    re.compile(r'(^|[^A-Za-z0-9_.-])\.env(?:\.[^/\s"\'`]+)?(?=$|[^A-Za-z0-9_.-])'),
    re.compile(r'(^|[^A-Za-z0-9_.-])[^\s"\'`]+\.key(?=$|[^A-Za-z0-9_.-])'),
    re.compile(r'(^|[^A-Za-z0-9_.-])[^\s"\'`]+\.pem(?=$|[^A-Za-z0-9_.-])'),
    re.compile(r'(^|[^A-Za-z0-9_.-])credentials\.json(?=$|[^A-Za-z0-9_.-])'),
    re.compile(r'(^|[^A-Za-z0-9_.-])secrets\.json(?=$|[^A-Za-z0-9_.-])'),
    re.compile(r'token', re.IGNORECASE),
    re.compile(r'~/.ssh/'),
    re.compile(r'~/.aws/'),
    re.compile(r'~/.config/gh/hosts\.yml'),
    re.compile(re.escape(os.path.join(home, ".ssh")) + r'/'),
    re.compile(re.escape(os.path.join(home, ".aws")) + r'/'),
    re.compile(re.escape(os.path.join(home, ".config", "gh", "hosts.yml"))),
]

def sensitive_token(token):
    token = token.lstrip("@").strip(",:;()[]{}")
    if not token:
        return False

    basename = os.path.basename(token)
    expanded = os.path.expanduser(token)
    lowered = token.lower()

    if basename == ".env" or basename.startswith(".env."):
        return True
    if basename in {"credentials.json", "secrets.json"}:
        return True
    if basename.endswith(".key") or basename.endswith(".pem"):
        return True
    if "token" in lowered:
        return True
    if token.startswith("~/.ssh/") or expanded.startswith(os.path.join(home, ".ssh") + os.sep):
        return True
    if token.startswith("~/.aws/") or expanded.startswith(os.path.join(home, ".aws") + os.sep):
        return True
    if token == "~/.config/gh/hosts.yml" or expanded == os.path.join(home, ".config", "gh", "hosts.yml"):
        return True
    return False

tokens = []
try:
    tokens.extend(shlex.split(command_text))
except ValueError:
    tokens.extend(re.findall(r"[^\s\"'`]+", command_text))

expanded_tokens = []
for token in tokens:
    expanded_tokens.append(token)
    if "=" in token:
        expanded_tokens.append(token.split("=", 1)[1])

has_sensitive_ref = any(sensitive_token(token) for token in expanded_tokens)
has_sensitive_ref = has_sensitive_ref or any(pattern.search(command_text) for pattern in sensitive_patterns)
has_send_with_substitution = bool(data_flag.search(command_text) and command_substitution.search(command_text))

if has_sensitive_ref or has_send_with_substitution:
    sys.exit(0)
sys.exit(1)
PY
then
  hook_block "🚫 外部送信コマンドと認証情報の組み合わせを検知。データ漏洩リスクのためブロックしました"
fi

exit 0
