#!/usr/bin/env bash
# check-dead-refs.sh — リポジトリ内のローカルファイル参照（絶対パス・相対パス）の死活確認
# 用途: nl-debug Phase A-4 の参照切れ検査
# 再現コマンド: bash .claude/skills/nl-debug/scripts/check-dead-refs.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
cd "$REPO_ROOT"

echo "=== 死リンク / 絶対パス参照チェック ($(date +%Y-%m-%d)) ==="
echo "対象: $REPO_ROOT"
echo ""

errors=0
warnings=0

# --- 絶対パス参照の検出 ---
# worktrees（孤児worktree、cs#238整理対象）と .cache（揮発作業領域）は除外
echo "[1] 絶対パス参照 (/Users/ など) — worktrees/.cache 除外"
abs_refs=$(grep -rn "/Users/" \
  --include="*.md" --include="*.sh" --include="*.mjs" --include="*.js" \
  --exclude-dir=".git" --exclude-dir="node_modules" \
  --exclude-dir="worktrees" --exclude-dir=".cache" \
  . 2>/dev/null | grep -v "binary" || true)

if [[ -z "$abs_refs" ]]; then
  echo "  OK — 絶対パス参照なし"
else
  total_abs=$(echo "$abs_refs" | grep -c ":" || true)
  archive_abs=$(echo "$abs_refs" | grep -c "/archive/" || true)
  active_abs=$((total_abs - archive_abs))
  echo "  WARNING — 絶対パス参照 $total_abs 件（うち archive $archive_abs 件 / 現役 $active_abs 件）:"
  echo "$abs_refs" | grep -v "/archive/" | head -20 | sed 's/^/    /'
  warnings=$((warnings + 1))
fi

echo ""

# --- source-note frontmatter 参照 PDF の実在チェック ---
echo "[2] source-note が参照する PDF の実在確認"
missing_sn=0
while IFS= read -r snfile; do
  pdf_ref=$(grep -E "^pdf_path:" "$snfile" 2>/dev/null | head -1 | sed 's/pdf_path: *//' | tr -d '"' || true)
  [[ -z "$pdf_ref" ]] && continue
  if [[ ! -f "$pdf_ref" && ! -f "$REPO_ROOT/$pdf_ref" ]]; then
    echo "  MISSING: $snfile → $pdf_ref"
    missing_sn=$((missing_sn + 1))
  fi
done < <(find knowledge/source-notes -name "D*-S*_*.md" 2>/dev/null)

if [[ $missing_sn -eq 0 ]]; then
  echo "  OK — 全 source-note の PDF 参照が実在"
else
  errors=$((errors + $missing_sn))
fi

echo ""

# --- evidence ファイルから source-note 参照切れ ---
echo "[3] evidence ファイルから source-note へのリンク切れ"
broken_ev=0
while IFS= read -r evfile; do
  while IFS= read -r ref; do
    if [[ ! -f "$ref" ]]; then
      echo "  BROKEN: $evfile → $ref"
      broken_ev=$((broken_ev + 1))
    fi
  done < <(grep -oE "knowledge/source-notes/D[0-9]+/D[0-9]+-S[0-9]+[^ )]*\.md" "$evfile" 2>/dev/null || true)
done < <(find evidence -name "evidence-D*.md" 2>/dev/null)

if [[ $broken_ev -eq 0 ]]; then
  echo "  OK — evidence → source-note リンク切れなし"
else
  errors=$((errors + $broken_ev))
fi

echo ""
echo "=== 完了 ==="
echo "ERROR: $errors 件 / WARNING: $warnings 件"
[[ $errors -gt 0 ]] && exit 1 || exit 0
