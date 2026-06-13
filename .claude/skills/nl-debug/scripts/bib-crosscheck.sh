#!/usr/bin/env bash
# bib-crosscheck.sh — B-1 書誌照合の一次スクリーニング（決定的・サブエージェント不使用）
# 各 raw-confirmed source について、ファイル名の著者slug/年・source-note書誌・PDF先頭ページ
# の3者で「年」と「著者slug」の整合を機械チェックし、齟齬候補を出力する。
# 最終判定は Main が候補を見て行う（表記ゆれによる誤検出を含むため）。
#
# 再現コマンド: bash .claude/skills/nl-debug/scripts/bib-crosscheck.sh [D範囲正規表現]
#   例: bash .claude/skills/nl-debug/scripts/bib-crosscheck.sh 'D0[1-8]'
set -euo pipefail

MANIFEST="knowledge/raw/manifest.md"
SN_ROOT="knowledge/source-notes"
RANGE="${1:-D[0-9]+}"

have_pdftotext=0
command -v pdftotext >/dev/null 2>&1 && have_pdftotext=1

echo "=== B-1 書誌照合スクリーニング ($(date +%Y-%m-%d)) ==="
echo "対象範囲: $RANGE / pdftotext: $([ $have_pdftotext -eq 1 ] && echo あり || echo なし)"
echo ""
printf "%-10s | %-6s | %-22s | %-6s | %-6s | %s\n" "source_id" "年" "PDF" "年照合" "著者照合" "フラグ"
echo "-----------|--------|------------------------|--------|--------|--------"

flag_count=0
track2_count=0
checked=0

while IFS= read -r line; do
  sid=$(echo "$line" | grep -oE '^\| (D[0-9]+-S[0-9]+)' | sed 's/| //')
  [[ -z "$sid" ]] && continue
  echo "$sid" | grep -qE "^${RANGE}-" || continue
  pdf=$(echo "$line" | grep -oE 'knowledge/raw/[A-Za-z0-9_./-]+\.pdf' | head -1)
  [[ -z "$pdf" ]] && continue

  base=$(basename "$pdf" .pdf)
  fn_year=$(echo "$base" | grep -oE '_(1[6-9][0-9]{2}|20[0-9]{2})_' | head -1 | tr -d '_')
  author_slug=$(echo "$base" | sed -E 's/^D[0-9]+_([a-zA-Z-]+)_.*/\1/' | tr 'A-Z' 'a-z' | tr -d '-')

  dnn=$(echo "$sid" | grep -oE '^D[0-9]+')
  pdf_dnn=$(basename "$pdf" | grep -oE '^D[0-9]+')
  sn=$(ls "${SN_ROOT}/${dnn}/${sid}_"*.md 2>/dev/null | head -1 || true)
  sn_year=""
  if [[ -n "$sn" ]]; then
    # H1見出しの括弧年を優先（例: # Clements, F. E. (1916). ...）。読解日(2026)の誤抽出を防ぐ
    sn_year=$(head -1 "$sn" | grep -oE '\((1[6-9][0-9]{2}|20[0-9]{2})\)' | grep -oE '[0-9]{4}' | head -1 || true)
    [[ -z "$sn_year" ]] && sn_year=$(grep -vE '読解' "$sn" | grep -oE '(1[6-9][0-9]{2}|20[0-9]{2})' | head -1 || true)
  fi

  year_chk="?"; auth_chk="?"; flag=""
  # クロス領域 anchor（source_id の D番号 ≠ PDF の D番号）は正規。齟齬としない（cs#245）
  xdom=""
  [[ "$dnn" != "$pdf_dnn" ]] && xdom="[クロス領域:${pdf_dnn}由来]"
  if [[ ! -f "$pdf" ]]; then
    flag="MISSING-PDF"
  elif [[ $have_pdftotext -eq 1 ]]; then
    txt=$(pdftotext -f 1 -l 2 "$pdf" - 2>/dev/null | head -80 | tr 'A-Z' 'a-z' || true)
    if [[ ${#txt} -lt 100 ]]; then
      flag="TRACK2-scan"; track2_count=$((track2_count+1))
    else
      checked=$((checked+1))
      if [[ -n "$fn_year" ]]; then
        echo "$txt" | grep -q "$fn_year" && year_chk="OK" || year_chk="NG"
      fi
      if [[ ${#author_slug} -ge 4 ]]; then
        echo "$txt" | grep -q "$author_slug" && auth_chk="OK" || auth_chk="NG"
      fi
      if [[ -n "$sn_year" && -n "$fn_year" && "$sn_year" != "$fn_year" ]]; then
        flag="${flag}SN年≠FN年($sn_year/$fn_year) "
      fi
      [[ "$year_chk" == "NG" && "$auth_chk" == "NG" ]] && flag="${flag}要確認(年/著者不出現) "
    fi
  fi

  [[ -n "$flag" && "$flag" != "TRACK2-scan" ]] && flag_count=$((flag_count+1))
  printf "%-10s | %-6s | %-22s | %-6s | %-6s | %s%s\n" "$sid" "${fn_year:-?}" "${base:0:22}" "$year_chk" "$auth_chk" "$flag" "$xdom"
done < <(grep -E "^\| D[0-9]+-S[0-9]+ \|.*\`raw-confirmed\`" "$MANIFEST")

echo ""
echo "=== サマリ ==="
echo "照合実施(トラック1): $checked / スキャンPDF(トラック2): $track2_count / 要確認フラグ: $flag_count"
echo "※ 年照合/著者照合NG や SN年≠FN年 は齟齬候補。Main が PDF実体と source-note を読んで最終判定する"
