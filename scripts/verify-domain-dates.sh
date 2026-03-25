#!/usr/bin/env bash
# verify-domain-dates.sh — ドメインレポート日付一致検証 (cs#128)
#
# 概要:
#   JA MD のソース front matter date と domains.json の generated フィールドの一致チェック。
#   JA PDF / EN PDF のファイル存在チェック。
#   不一致があれば EXIT 1 + 詳細レポート。
#
# 使い方:
#   bash scripts/verify-domain-dates.sh --domain D01    # 単一ドメイン
#   bash scripts/verify-domain-dates.sh --all           # 全ドメイン

set -euo pipefail

# ── 色付き出力 ──
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

# ── パス ──
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CREATION_SPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PJDHIRO_DIR="/Users/uminomae/dev/pjdhiro"
DOMAINS_BASE="$PJDHIRO_DIR/assets/creation/domains"
SOURCE_DIR="$CREATION_SPACE_ROOT/transform/domains/publish/domains"
DOMAINS_JSON="$PJDHIRO_DIR/assets/creation/manifests/domains.json"

# ── 引数解析 ──
DOMAIN=""
ALL=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --domain|-d) DOMAIN="${2:-}"; shift 2 ;;
        --all|-a)    ALL=true; shift ;;
        --help|-h)
            echo "使い方: bash scripts/verify-domain-dates.sh [オプション]"
            echo ""
            echo "オプション:"
            echo "  --domain D{NN}    単一ドメイン検証"
            echo "  --all             全ドメイン検証"
            echo "  --help            このヘルプを表示"
            exit 0
            ;;
        *) echo -e "${RED}不明なオプション: $1${NC}"; exit 1 ;;
    esac
done

if [ -z "$DOMAIN" ] && [ "$ALL" = false ]; then
    echo -e "${RED}エラー: --domain D{NN} または --all を指定してください${NC}"
    exit 1
fi

# ── ヘルパー: ソース MD から date を抽出 ──
extract_source_date() {
    local domain_id="$1"
    local source_file
    source_file=$(ls "$SOURCE_DIR"/domain-"${domain_id}"-*-ja.md 2>/dev/null | head -1)
    if [ -z "$source_file" ]; then
        echo ""
        return
    fi
    # front matter の date フィールドを抽出
    python3 -c "
import sys, re
text = open(sys.argv[1]).read()
m = re.search(r'^---\n(.*?)\n---', text, re.DOTALL)
if m:
    for line in m.group(1).split('\n'):
        if line.startswith('date:'):
            val = line.split(':', 1)[1].strip().strip('\"').strip(\"'\")
            print(val)
            sys.exit()
print('')
" "$source_file"
}

# ── ヘルパー: domains.json から generated を抽出 ──
extract_json_generated() {
    local domain_id="$1"
    if [ ! -f "$DOMAINS_JSON" ]; then
        echo ""
        return
    fi
    python3 -c "
import json, sys
data = json.load(open(sys.argv[1]))
did = sys.argv[2]
for r in data.get('reports', []):
    if r.get('id') == did:
        print(r.get('generated', ''))
        sys.exit()
print('')
" "$DOMAINS_JSON" "$domain_id"
}

# ── 検証ロジック ──
ERRORS=0
WARNINGS=0
CHECKED=0

verify_domain() {
    local domain_id="$1"
    local has_error=false

    CHECKED=$((CHECKED + 1))

    # 1. ソース date と domains.json generated の一致チェック
    local source_date
    source_date=$(extract_source_date "$domain_id")
    local json_generated
    json_generated=$(extract_json_generated "$domain_id")

    if [ -n "$source_date" ] && [ -n "$json_generated" ]; then
        # domains.json の generated が ISO形式の場合、日付部分のみ比較
        local json_date
        json_date=$(echo "$json_generated" | cut -d'T' -f1)
        if [ "$source_date" != "$json_date" ]; then
            echo -e "  ${RED}FAIL${NC} ${domain_id}: source date=${source_date} != domains.json generated=${json_date}"
            ERRORS=$((ERRORS + 1))
            has_error=true
        fi
    elif [ -z "$source_date" ]; then
        echo -e "  ${YELLOW}WARN${NC} ${domain_id}: ソース MD の date が見つかりません"
        WARNINGS=$((WARNINGS + 1))
    fi

    # 2. JA PDF 存在チェック
    local ja_pdf
    ja_pdf=$(ls "$DOMAINS_BASE/ja/pdf/domain-${domain_id}-"*.pdf 2>/dev/null | head -1)
    local ja_md
    ja_md=$(ls "$DOMAINS_BASE/ja/md/domain-${domain_id}-"*.md 2>/dev/null | head -1)

    if [ -n "$ja_md" ] && [ -z "$ja_pdf" ]; then
        echo -e "  ${RED}FAIL${NC} ${domain_id}: JA MD は存在するが JA PDF がありません"
        ERRORS=$((ERRORS + 1))
        has_error=true
    fi

    # 3. EN PDF 存在チェック（EN MD がある場合のみ）
    local en_md
    en_md=$(ls "$DOMAINS_BASE/en/md/domain-${domain_id}-"*.md 2>/dev/null | head -1)
    local en_pdf
    en_pdf=$(ls "$DOMAINS_BASE/en/pdf/domain-${domain_id}-"*.pdf 2>/dev/null | head -1)

    if [ -n "$en_md" ] && [ -z "$en_pdf" ]; then
        echo -e "  ${RED}FAIL${NC} ${domain_id}: EN MD は存在するが EN PDF がありません"
        ERRORS=$((ERRORS + 1))
        has_error=true
    fi

    if [ "$has_error" = false ]; then
        echo -e "  ${GREEN}PASS${NC} ${domain_id}"
    fi
}

# ── メイン ──
echo "domain date verification (cs#128)"
echo ""

if [ "$ALL" = true ]; then
    # ソース MD から全ドメイン ID を収集
    for source_file in "$SOURCE_DIR"/domain-D*-*-ja.md; do
        [ ! -f "$source_file" ] && continue
        basename_file=$(basename "$source_file")
        # domain-D01-mathematics-academic-ja.md → D01
        domain_id=$(echo "$basename_file" | sed 's/^domain-\(D[0-9]*\)-.*/\1/')
        verify_domain "$domain_id"
    done
else
    verify_domain "$DOMAIN"
fi

echo ""
echo "結果: ${CHECKED} 件チェック / ${ERRORS} エラー / ${WARNINGS} 警告"

if [ "$ERRORS" -gt 0 ]; then
    echo -e "${RED}FAIL: ${ERRORS} 件の不一致が検出されました${NC}"
    exit 1
else
    echo -e "${GREEN}PASS: 全件一致${NC}"
    exit 0
fi
