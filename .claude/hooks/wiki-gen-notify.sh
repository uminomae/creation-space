#!/usr/bin/env bash
# wiki-gen-notify.sh — cs#213 拡張版
# PostToolUse (Bash, git commit):
# - (A) knowledge/raw/ に新規 raw-confirmed PDF がコミット → source-reader 依頼
# - (B) knowledge/wiki/D*/D*-S*.md が追加・改訂 → wiki-compile Step 3b 依頼
# 両方まとめて 1 ファイルで pd/.cache/inbox/ に通知する。

set -euo pipefail
source "$(dirname "$0")/_common"
hook_init

# === (A) raw PDF 追加検知（既存ロジック） ===
PDF_LIST=""
RAW_CHANGES="$(git -C "$REPO_ROOT" diff --name-only HEAD~1 HEAD -- 'knowledge/raw/*.pdf' 2>/dev/null || true)"
MANIFEST="${REPO_ROOT}/knowledge/raw/manifest.md"
if [ -n "$RAW_CHANGES" ] && [ -f "$MANIFEST" ]; then
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    BASENAME="$(basename "$line")"
    MANIFEST_LINE="$(grep -F "$BASENAME" "$MANIFEST" 2>/dev/null | head -1 || true)"
    if echo "$MANIFEST_LINE" | grep -q 'raw-confirmed'; then
      PDF_LIST="${PDF_LIST}- ${BASENAME}"$'\n'
    fi
  done <<< "$RAW_CHANGES"
fi

# === (B) wiki 改訂検知（新規） ===
# knowledge/wiki/D{NN}/D{NN}-S{##}_*.md の追加・変更のみ対象
# （README.md / *-summary.md / templates/ は除外）
WIKI_LIST=""
WIKI_CHANGES="$(git -C "$REPO_ROOT" diff --name-only HEAD~1 HEAD -- 'knowledge/wiki/D*/D*-S*_*.md' 2>/dev/null || true)"
if [ -n "$WIKI_CHANGES" ]; then
  while IFS= read -r wiki_file; do
    [ -z "$wiki_file" ] && continue
    WIKI_LIST="${WIKI_LIST}- ${wiki_file}"$'\n'
  done <<< "$WIKI_CHANGES"
fi

# どちらも無ければ exit
if [ -z "$PDF_LIST" ] && [ -z "$WIKI_LIST" ]; then
  exit 0
fi

# === 出力先決定 ===
PD_INBOX="/Users/uminomae/dev/project-design/.cache/inbox"
mkdir -p "$PD_INBOX"
DATE="$(date +%Y%m%d)"
SEQ=1
while [ -f "${PD_INBOX}/wiki-gen-${DATE}-$(printf '%02d' $SEQ).md" ]; do
  SEQ=$((SEQ + 1))
done
OUTFILE="${PD_INBOX}/wiki-gen-${DATE}-$(printf '%02d' $SEQ).md"

# === 依頼ファイル生成 ===
{
  printf -- '---\n'
  printf 'action: auto-execute\n'
  printf 'source: creation-space\n'
  printf 'type: wiki-gen-request\n'
  printf 'date: %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf -- '---\n\n'
  printf '# Wiki 生成依頼 (cs#213)\n\n'
  printf 'creation-space のコミットに基づき、以下の作業を依頼します。\n'

  if [ -n "$PDF_LIST" ]; then
    printf '\n## (A) source-reader: raw PDF -> cs/knowledge/wiki/\n\n'
    printf 'knowledge/raw/ に新規 raw-confirmed PDF が追加されました。\n'
    printf 'source-reader エージェントで wiki 生成を実行してください。\n\n'
    printf '### 対象 PDF\n\n'
    printf '%s\n' "$PDF_LIST"
    printf '- manifest: cs/knowledge/raw/manifest.md\n'
    printf '- 出力先: cs/knowledge/wiki/D{NN}/\n'
  fi

  if [ -n "$WIKI_LIST" ]; then
    printf '\n## (B) wiki-compile Step 3b: cs wiki -> pd/wiki/sources/\n\n'
    printf 'creation-space の knowledge/wiki/ が改訂されました。\n'
    printf 'pd/wiki/sources/ の対応ページを生成/更新してください（wiki-compile skill, Step 3b）。\n'
    printf 'compile 後、pd の既存 hook (content-compile.sh → generate-wiki-index.mjs) が\n'
    printf 'pd/wiki/index.md を再生成します。\n\n'
    printf '### 変更された cs wiki\n\n'
    printf '%s\n' "$WIKI_LIST"
    printf '### 参照\n\n'
    printf -- '- cs manifest: cs/knowledge/raw/manifest.md\n'
    printf -- '- pd 出力先: pd/wiki/sources/\n'
    printf -- '- 命名規則: pd/.claude/skills/wiki-compile/SKILL.md (Step 3b)\n'
  fi
} > "$OUTFILE"

# systemMessage で通知
PDF_COUNT=$(printf '%s' "$PDF_LIST" | grep -c '^-' || true)
WIKI_COUNT=$(printf '%s' "$WIKI_LIST" | grep -c '^-' || true)
printf '{"systemMessage": "wiki-gen request -> %s (PDF: %d, wiki: %d)"}\n' "$OUTFILE" "$PDF_COUNT" "$WIKI_COUNT"
