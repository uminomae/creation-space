#\!/usr/bin/env bash
# generate-domain-pipeline.sh — JA→EN+PDF 自動生成パイプライン (cs#128)
#
# 概要:
#   JA PDF 生成 → EN PDF 生成 → domains.json 更新 → 日付検証 を一括実行する。
#   EN 翻訳は手動ステップのため、本スクリプトでは既存の EN MD から PDF を生成する。
#
# 使い方:
#   bash scripts/generate-domain-pipeline.sh --domain D01        # 単一ドメイン
#   bash scripts/generate-domain-pipeline.sh --all               # 全ドメイン
#   bash scripts/generate-domain-pipeline.sh --domain D01 --ja-only   # JA のみ
#   bash scripts/generate-domain-pipeline.sh --all --skip-verify      # 検証スキップ
#
# 前提:
#   - JA MD が pjdhiro/assets/creation/domains/ja/md/ に存在すること
#   - EN MD が必要な場合は pjdhiro/assets/creation/domains/en/md/ に存在すること
#   - pandoc + lualatex がインストール済みであること

set -euo pipefail

# ── 色付き出力 ──
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; RED='\033[0;31m'; NC='\033[0m'

# ── パス ──
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CREATION_SPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PJDHIRO_DIR="/Users/uminomae/dev/pjdhiro"
DOMAINS_BASE="$PJDHIRO_DIR/assets/creation/domains"
BUILD_PDF="$CREATION_SPACE_ROOT/transform/scripts/build-pdf-guide.sh"
VERIFY_DATES="$SCRIPT_DIR/verify-domain-dates.sh"
GEN_DOMAINS_JSON="$SCRIPT_DIR/generate-domains-json.mjs"

# ── 引数解析 ──
DOMAIN=""
ALL=false
JA_ONLY=false
SKIP_VERIFY=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --domain|-d) DOMAIN="${2:-}"; shift 2 ;;
        --all|-a)    ALL=true; shift ;;
        --ja-only)   JA_ONLY=true; shift ;;
        --skip-verify) SKIP_VERIFY=true; shift ;;
        --help|-h)
            echo "使い方: bash scripts/generate-domain-pipeline.sh [オプション]"
            echo ""
            echo "オプション:"
            echo "  --domain D{NN}    単一ドメイン指定（例: D01）"
            echo "  --all             全ドメイン"
            echo "  --ja-only         JA PDF のみ生成（EN スキップ）"
            echo "  --skip-verify     日付検証をスキップ"
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

# ── ヘッダー ──
echo -e "${BLUE}══════════════════════════════════════${NC}"
echo -e "${BLUE}  domain pipeline — JA→EN+PDF (cs#128)${NC}"
echo -e "${BLUE}══════════════════════════════════════${NC}"
echo ""

# ── Step 1: 対象ドメインの確認 ──
if [ "$ALL" = true ]; then
    echo -e "${BLUE}[Step 0] 対象: 全ドメイン${NC}"
    JA_MD_DIR="$DOMAINS_BASE/ja/md"
    if [ \! -d "$JA_MD_DIR" ] || [ -z "$(ls "$JA_MD_DIR"/domain-D*.md 2>/dev/null)" ]; then
        echo -e "${RED}エラー: $JA_MD_DIR に domain-D*.md がありません${NC}"
        exit 1
    fi
    DOMAIN_COUNT=$(ls "$JA_MD_DIR"/domain-D*.md 2>/dev/null | wc -l | tr -d ' ')
    echo -e "  検出: ${DOMAIN_COUNT} ドメイン"
else
    echo -e "${BLUE}[Step 0] 対象: ${DOMAIN}${NC}"
    JA_MD=$(ls "$DOMAINS_BASE/ja/md/domain-${DOMAIN}-"*.md 2>/dev/null | head -1)
    if [ -z "$JA_MD" ]; then
        echo -e "${RED}エラー: JA MD が見つかりません: domain-${DOMAIN}-*.md${NC}"
        exit 1
    fi
    echo -e "  JA MD: $(basename "$JA_MD")"

    EN_MD=$(ls "$DOMAINS_BASE/en/md/domain-${DOMAIN}-"*.md 2>/dev/null | head -1)
    if [ -n "$EN_MD" ]; then
        echo -e "  EN MD: $(basename "$EN_MD")"
    else
        echo -e "  EN MD: ${YELLOW}なし（EN PDF はスキップ）${NC}"
    fi
fi
echo ""

# ── Step 1: JA PDF 生成 ──
echo -e "${BLUE}[Step 1] JA PDF 生成${NC}"
if bash "$BUILD_PDF" --kind domains --lang ja; then
    echo -e "  ${GREEN}JA PDF 生成完了${NC}"
else
    echo -e "  ${RED}JA PDF 生成失敗${NC}"
    exit 1
fi
echo ""

# ── Step 2: EN PDF 生成 ──
if [ "$JA_ONLY" = false ]; then
    EN_MD_DIR="$DOMAINS_BASE/en/md"
    if [ -d "$EN_MD_DIR" ] && [ -n "$(ls "$EN_MD_DIR"/domain-D*.md 2>/dev/null)" ]; then
        echo -e "${BLUE}[Step 2] EN PDF 生成${NC}"
        if bash "$BUILD_PDF" --kind domains --lang en; then
            echo -e "  ${GREEN}EN PDF 生成完了${NC}"
        else
            echo -e "  ${RED}EN PDF 生成失敗${NC}"
            exit 1
        fi
    else
        echo -e "${BLUE}[Step 2] EN PDF 生成: ${YELLOW}スキップ（EN MD なし）${NC}"
    fi
else
    echo -e "${BLUE}[Step 2] EN PDF 生成: ${YELLOW}スキップ（--ja-only）${NC}"
fi
echo ""

# ── Step 3: domains.json 更新 ──
echo -e "${BLUE}[Step 3] domains.json 更新${NC}"
if node "$GEN_DOMAINS_JSON"; then
    echo -e "  ${GREEN}domains.json 更新完了${NC}"
else
    echo -e "  ${RED}domains.json 更新失敗${NC}"
    exit 1
fi
echo ""

# ── Step 4: domains.json 整合チェック ──
echo -e "${BLUE}[Step 4] domains.json 整合チェック${NC}"
if node "$GEN_DOMAINS_JSON" --check; then
    echo -e "  ${GREEN}整合チェック OK${NC}"
else
    echo -e "  ${YELLOW}差分あり（上記出力を確認してください）${NC}"
fi
echo ""

# ── Step 5: 日付検証 ──
if [ "$SKIP_VERIFY" = false ]; then
    echo -e "${BLUE}[Step 5] 日付検証${NC}"
    if [ -f "$VERIFY_DATES" ]; then
        if [ "$ALL" = true ]; then
            if bash "$VERIFY_DATES" --all; then
                echo -e "  ${GREEN}日付検証 PASS${NC}"
            else
                echo -e "  ${RED}日付検証 FAIL（詳細は上記出力を確認）${NC}"
                exit 1
            fi
        else
            if bash "$VERIFY_DATES" --domain "$DOMAIN"; then
                echo -e "  ${GREEN}日付検証 PASS${NC}"
            else
                echo -e "  ${RED}日付検証 FAIL（詳細は上記出力を確認）${NC}"
                exit 1
            fi
        fi
    else
        echo -e "  ${YELLOW}verify-domain-dates.sh が見つかりません。スキップ${NC}"
    fi
else
    echo -e "${BLUE}[Step 5] 日付検証: ${YELLOW}スキップ（--skip-verify）${NC}"
fi
echo ""

# ── 完了 ──
echo -e "${GREEN}══════════════════════════════════════${NC}"
echo -e "${GREEN}  パイプライン完了${NC}"
echo -e "${GREEN}══════════════════════════════════════${NC}"
echo ""
echo -e "次のステップ:"
echo -e "  1. pjdhiro で git add & commit & push"
echo -e "  2. creation-space で git add & commit & push"
echo -e "  3. （公開時）creation-space develop → main マージ"
