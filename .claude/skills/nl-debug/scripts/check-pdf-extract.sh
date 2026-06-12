#!/usr/bin/env bash
# check-pdf-extract.sh — raw-confirmed PDF のテキスト抽出成功率を測定
# 用途: nl-debug Phase B-1 の事前測定。poppler-utils の pdftotext を使用
# 再現コマンド: bash .claude/skills/nl-debug/scripts/check-pdf-extract.sh
set -euo pipefail

MANIFEST="${1:-knowledge/raw/manifest.md}"

echo "=== PDF テキスト抽出チェック ($(date +%Y-%m-%d)) ==="
echo ""

# pdftotext の有無確認
if ! command -v pdftotext &>/dev/null; then
  echo "INFO: pdftotext が見つかりません"
  echo "  macOS: brew install poppler"
  echo "  Ubuntu/Debian: sudo apt-get install poppler-utils"
  echo ""
  echo "代替: Claude Code の Read ツールで PDF を直接読む（1ファイルずつ、低速）"
  exit 0
fi

# raw-confirmed 行から PDF パスを抽出
pdfs=$(grep -E "^\| D[0-9]+-S[0-9]+ \|.*\`raw-confirmed\`" "$MANIFEST" \
  | grep -oE "knowledge/raw/[A-Za-z0-9_./-]+\.pdf" \
  | sort -u)

total=0
success=0
fail=0
fail_list=""

while IFS= read -r pdfpath; do
  [[ -z "$pdfpath" ]] && continue
  [[ ! -f "$pdfpath" ]] && continue
  total=$((total + 1))

  # 先頭1ページだけ抽出して文字数確認
  extracted=$(pdftotext -f 1 -l 1 "$pdfpath" - 2>/dev/null | wc -c | tr -d ' ')
  if [[ $extracted -gt 100 ]]; then
    success=$((success + 1))
  else
    fail=$((fail + 1))
    fail_list="$fail_list\n  FAIL: $pdfpath (chars=$extracted)"
  fi
done <<< "$pdfs"

if [[ $total -eq 0 ]]; then
  echo "対象 PDF が見つかりませんでした"
  exit 0
fi

rate=$(( success * 100 / total ))
echo "対象 PDF 数: $total"
echo "抽出成功   : $success"
echo "抽出失敗   : $fail"
echo "成功率     : ${rate}%"
echo ""

if [[ $fail -gt 0 ]]; then
  echo "=== 抽出失敗リスト ==="
  echo -e "$fail_list"
  echo ""
fi

if [[ $rate -lt 70 ]]; then
  echo "WARNING: 成功率が70%未満。B-1 トラック1の対象が限定的になります"
  echo "  → pjdhiro への報告を検討してください"
fi

echo "=== 完了 ==="
