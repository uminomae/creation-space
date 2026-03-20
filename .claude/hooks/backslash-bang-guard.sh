#!/usr/bin/env bash
set -euo pipefail

# PostToolUse hook: JS/TS ファイルへの書き込み後に不正なエスケープを検出しブロック
# 検出対象: \! \` \${ （LLM がシェルエスケープを JS に混入する既知パターン）

payload_file="$(mktemp)"
cat >"${payload_file}"
trap 'rm -f "${payload_file}"' EXIT

python3 - "${payload_file}" <<'PY'
import json, sys, pathlib, re

payload_path = sys.argv[1]
with open(payload_path, encoding="utf-8") as fh:
    payload = json.load(fh)

if payload.get("hook_event_name") != "PostToolUse":
    raise SystemExit(0)

tool_input = payload.get("tool_input") or payload.get("input") or {}

# 対象ファイルパスを取得
file_path = tool_input.get("file_path", "") or tool_input.get("path", "")
if not file_path:
    raise SystemExit(0)

# JS/TS/JSX/TSX のみチェック
if not any(file_path.endswith(ext) for ext in (".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs")):
    raise SystemExit(0)

p = pathlib.Path(file_path)
if not p.is_file():
    raise SystemExit(0)

content = p.read_text(encoding="utf-8")
# 検出パターン: \! \` \${ （JS コード内で不正なシェルエスケープ）
bad_patterns = [
    (r"\\!", r"\! (バックスラッシュ+感嘆符)"),
    (r"\\`", r"\` (バックスラッシュ+バッククォート)"),
    (r"\\\$\{", r"\${ (バックスラッシュ+ドル+ブレース)"),
]

lines_with_issue = []
for i, line in enumerate(content.splitlines(), 1):
    for pattern, desc in bad_patterns:
        if re.search(pattern, line):
            lines_with_issue.append(f"  L{i} [{desc}]: {line.strip()}")
            break  # 1行につき1回だけ報告

if lines_with_issue:
    detail = "\n".join(lines_with_issue[:10])
    print(
        f"BLOCK: {file_path} に不正なシェルエスケープが検出されました。"
        f" JS では \\ なしで書いてください。\n{detail}",
        file=sys.stderr,
    )
    raise SystemExit(2)
PY
