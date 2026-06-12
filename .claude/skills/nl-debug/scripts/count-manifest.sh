#!/usr/bin/env bash
# count-manifest.sh — manifest.md の source 行数を status 別に集計する唯一の正本スクリプト
# 用途: nl-debug Phase A の前提値確認。LLM による ad hoc grep 集計を置き換える
# 再現コマンド: bash .claude/skills/nl-debug/scripts/count-manifest.sh
set -euo pipefail

MANIFEST="${1:-knowledge/raw/manifest.md}"

if [[ ! -f "$MANIFEST" ]]; then
  echo "ERROR: manifest not found: $MANIFEST" >&2
  exit 1
fi

echo "=== manifest source 行数集計 ($(date +%Y-%m-%d)) ==="
echo "対象: $MANIFEST"
echo ""

# テーブル行のみ対象（| D00-S00 | ... | status | ... 形式）
# status は backtick で囲まれている: `raw-confirmed` 等
count_status() {
  local status="$1"
  grep -cE "^\| D[0-9]+-S[0-9]+ \|.*\`${status}\`" "$MANIFEST" 2>/dev/null || echo 0
}

raw_confirmed=$(count_status "raw-confirmed")
url_verified=$(count_status "url-verified")
blocked_access=$(count_status "blocked-access")
citation_only=$(count_status "citation-only")
total_table=$(grep -cE "^\| D[0-9]+-S[0-9]+ \|" "$MANIFEST" 2>/dev/null || echo 0)

echo "raw-confirmed  : $raw_confirmed"
echo "url-verified   : $url_verified"
echo "blocked-access : $blocked_access"
echo "citation-only  : $citation_only"
echo "---"
echo "合計(テーブル行): $total_table"
echo ""

# 自己申告値との比較
self_declared=$(grep -oE "raw-confirmed [0-9]+" "$MANIFEST" 2>/dev/null | head -1 | grep -oE "[0-9]+" || echo "N/A")
echo "manifest 冒頭の自己申告: $self_declared"
if [[ "$self_declared" != "N/A" && "$self_declared" != "$raw_confirmed" ]]; then
  echo "WARNING: 自己申告 ($self_declared) とテーブル実測 ($raw_confirmed) が不一致"
fi

# PDF実体との照合
pdf_count=$(ls knowledge/raw/*.pdf 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "=== PDF 実体 ==="
echo "ローカル PDF 数: $pdf_count"

# raw-confirmed 行が参照する PDF ファイル名を抽出
echo ""
echo "=== manifest が参照する PDF (raw-confirmed 行) ==="
referenced=$(grep -E "^\| D[0-9]+-S[0-9]+ \|.*\`raw-confirmed\`" "$MANIFEST" \
  | grep -oE "knowledge/raw/[A-Za-z0-9_./-]+\.pdf" \
  | sort -u)
ref_count=$(echo "$referenced" | grep -c "\.pdf" || echo 0)
echo "参照 PDF 数 (unique): $ref_count"

# 欠落チェック
echo ""
echo "=== 欠落 PDF (manifest参照あり、ローカル実体なし) ==="
missing=0
while IFS= read -r pdfpath; do
  [[ -z "$pdfpath" ]] && continue
  if [[ ! -f "$pdfpath" ]]; then
    echo "  MISSING: $pdfpath"
    missing=$((missing + 1))
  fi
done <<< "$referenced"
if [[ $missing -eq 0 ]]; then
  echo "  (なし)"
fi

# 未参照チェック
echo ""
echo "=== 未参照 PDF (ローカル存在、manifest参照なし) ==="
unreferenced=0
while IFS= read -r localfile; do
  relpath="${localfile#./}"
  if ! echo "$referenced" | grep -qF "$relpath"; then
    echo "  UNREFERENCED: $relpath"
    unreferenced=$((unreferenced + 1))
  fi
done < <(find knowledge/raw -maxdepth 1 -name "*.pdf" | sort)
if [[ $unreferenced -eq 0 ]]; then
  echo "  (なし)"
fi

echo ""
echo "=== 完了 ==="
echo "欠落: $missing 件 / 未参照: $unreferenced 件"
