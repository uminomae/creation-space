#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/_common"
hook_init

if [ "$(hook_event_name)" != "PostToolUse" ]; then
  exit 0
fi

target_file=""
while IFS= read -r raw_path; do
  [ -n "$raw_path" ] || continue
  normalized="$(hook_normalize_path "$raw_path")"
  rel_path="$(hook_repo_rel "$normalized" 2>/dev/null || true)"
  case "$rel_path" in
    .cache/inbox/_instructions-*.md)
      if [ -f "$normalized" ]; then
        target_file="$normalized"
        break
      fi
      ;;
  esac
done < <(hook_collect_paths)

if [ -z "$target_file" ]; then
  exit 0
fi

lint_output_file="$(mktemp)"
python3 - "$target_file" >"$lint_output_file" <<'PY'
import re
import sys
from pathlib import Path

path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")
errors = []
warnings = []

if "## 完了条件" not in text:
    errors.append("## 完了条件 がありません。")

if "検証" not in text:
    warnings.append("検証手順の見出しまたは記述が見当たりません。")

fence_pattern = re.compile(r"```([^\n`]*)\n(.*?)```", re.S)
neutrality_blacklist = [
    "必ず成功させる",
    "FAILにしてはいけない",
    "正解は",
    "問題なしと結論づける",
]

for phrase in neutrality_blacklist:
    if phrase in text:
        warnings.append(f"誘導的な表現の疑いがあります: {phrase}")

for language, block in fence_pattern.findall(text):
    lines = block.splitlines()
    shell_like = any(
        re.match(r"^\s*(cd|git|gh|bash|python3|for|if|while|test)\b", line)
        for line in lines
        if line.strip()
    )
    if shell_like and language.strip() != "bash":
        errors.append("シェルコマンドを含むコードブロックは ```bash で始めてください。")

    prev_nonempty = ""
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith("git ") and not prev_nonempty.startswith("cd "):
            warnings.append("git コマンドの直前に cd がありません。")
            break
        prev_nonempty = stripped

if ("新規ルール" in text or "ルール追加" in text) and "守護者" not in text:
    warnings.append("新規ルール指示なのに守護者の記述が見当たりません。")

if "インフォグラフィック" not in text and text.count(chr(96)) > 30:
    warnings.append("大きめの指示書です。インフォグラフィック要否を確認してください。")

for message in errors:
    print(f"ERROR\t{message}")
for message in warnings:
    print(f"WARN\t{message}")
PY

lint_output="$(cat "$lint_output_file")"
rm -f "$lint_output_file"

error_messages=()
warning_messages=()
while IFS=$'\t' read -r level message; do
  [ -n "$level" ] || continue
  case "$level" in
    ERROR)
      error_messages+=("$message")
      ;;
    WARN)
      warning_messages+=("$message")
      ;;
  esac
done <<<"$lint_output"

if [ "${#warning_messages[@]}" -gt 0 ]; then
  hook_warn "$(printf '%s; ' "${warning_messages[@]}")"
fi

if [ "${#error_messages[@]}" -gt 0 ]; then
  hook_block "$(printf '%s; ' "${error_messages[@]}")"
fi
