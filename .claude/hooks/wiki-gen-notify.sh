#!/usr/bin/env bash
# wiki-gen-notify.sh — cs#213
# PostToolUse (Bash, git commit): knowledge/raw/ に新規 PDF がコミットされたら
# pd の inbox に wiki 生成依頼を書き出す

set -euo pipefail
source "$(dirname "$0")/_common"
hook_init

# knowledge/raw/ に変更があるか確認（直近のコミット）
RAW_CHANGES="$(git -C "$REPO_ROOT" diff --name-only HEAD~1 HEAD -- 'knowledge/raw/*.pdf' 2>/dev/null || true)"
if [ -z "$RAW_CHANGES" ]; then
  exit 0
fi

# manifest から raw-confirmed かチェック
MANIFEST="${REPO_ROOT}/knowledge/raw/manifest.md"
if [ ! -f "$MANIFEST" ]; then
  exit 0
fi

# 新規 PDF リストを生成
PDF_LIST=""
while IFS= read -r line; do
  BASENAME="$(basename "$line")"
  MANIFEST_LINE="$(grep -F "$BASENAME" "$MANIFEST" 2>/dev/null | head -1 || true)"
  if echo "$MANIFEST_LINE" | grep -q 'raw-confirmed'; then
    PDF_LIST="${PDF_LIST}- ${BASENAME}\n"
  fi
done <<< "$RAW_CHANGES"

if [ -z "$PDF_LIST" ]; then
  exit 0
fi

# 出力先
PD_INBOX="/Users/uminomae/dev/project-design/.cache/inbox"
DATE="$(date +%Y%m%d)"
SEQ=1
while [ -f "${PD_INBOX}/wiki-gen-${DATE}-$(printf '%02d' $SEQ).md" ]; do
  SEQ=$((SEQ + 1))
done
OUTFILE="${PD_INBOX}/wiki-gen-${DATE}-$(printf '%02d' $SEQ).md"

mkdir -p "$PD_INBOX"
cat > "$OUTFILE" <<NOTIFY
---
action: auto-execute
source: creation-space
type: wiki-gen-request
date: $(date -u +%Y-%m-%dT%H:%M:%SZ)
---

# Wiki 生成依頼 (cs#213)

creation-space の knowledge/raw/ に新規 PDF が追加されました。
source-reader エージェントで wiki 生成を実行してください。

## 対象 PDF

$(printf '%b' "$PDF_LIST")

## 参照

- manifest: knowledge/raw/manifest.md
- wiki 出力先: knowledge/wiki/
NOTIFY

printf '{"systemMessage": "wiki-gen request → %s (%d PDFs)"}\n' "$OUTFILE" "$(printf '%b' "$PDF_LIST" | grep -c '^-')"
