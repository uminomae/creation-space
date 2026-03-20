#!/usr/bin/env bash
# generate-presentations.sh — ドメインレポートからプレゼン資料を生成 v1.0
#
# 概要:
#   既存ドメインレポート(.md)からプレゼン資料を生成するバッチスクリプト。
#   実際のコンテンツ生成は Claude CLI に委譲する。
#   本スクリプトは対象の特定・スキップ判定・指示書生成を担当する。
#
# 使い方:
#   bash transform/scripts/generate-presentations.sh --domain D08    # D08 のみ
#   bash transform/scripts/generate-presentations.sh --all           # 全ドメイン
#   bash transform/scripts/generate-presentations.sh --list          # 対象一覧表示
#   bash transform/scripts/generate-presentations.sh --dry-run       # 実行せず指示書のみ表示
#
# 出力:
#   transform/domains/publish/presentations/domain-D{NN}-{slug}-presentation-ja.md
#
# 互換性:
#   bash 3.2以上（macOS標準）で動作。${var^^} は使用しない。

set -euo pipefail

# ── 色付き出力 ──
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC}  $*"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# ── パス ──
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CREATION_SPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DOMAINS_SRC="$CREATION_SPACE_ROOT/transform/domains/publish/domains"
PRESENTATIONS_DST="$CREATION_SPACE_ROOT/transform/domains/publish/presentations"
TEMPLATE="$CREATION_SPACE_ROOT/transform/domains/reader-rules/presentation-template.md"
READER_RULES="$CREATION_SPACE_ROOT/transform/domains/reader-rules/reader-rules-creation-report.md"

# ── 引数解析 ──
MODE=""
TARGET_DOMAIN=""
DRY_RUN=false

usage() {
    cat <<USAGE
Usage: $(basename "$0") [OPTIONS]

Options:
  --domain D{NN}  指定ドメインのみ生成（例: --domain D08）
  --all           全ドメインを生成（既存はスキップ）
  --list          対象ドメインの一覧と状態を表示
  --dry-run       実行せず、Claude CLI 用の指示書のみ表示
  -h, --help      このヘルプを表示

Examples:
  $(basename "$0") --domain D08
  $(basename "$0") --all
  $(basename "$0") --all --dry-run
USAGE
    exit 0
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --domain)
            MODE="single"
            TARGET_DOMAIN="$2"
            shift 2
            ;;
        --all)
            MODE="all"
            shift
            ;;
        --list)
            MODE="list"
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            log_error "不明なオプション: $1"
            usage
            ;;
    esac
done

if [[ -z "$MODE" ]]; then
    log_error "モードを指定してください（--domain D{NN} / --all / --list）"
    usage
fi

# ── 依存チェック ──
check_deps() {
    log_info "依存チェック..."
    local missing=0

    if [[ ! -d "$DOMAINS_SRC" ]]; then
        log_error "ドメインレポートディレクトリが見つかりません: $DOMAINS_SRC"
        missing=1
    else
        log_ok "ドメインレポートディレクトリ: $DOMAINS_SRC"
    fi

    if [[ ! -f "$TEMPLATE" ]]; then
        log_error "テンプレートが見つかりません: $TEMPLATE"
        missing=1
    else
        log_ok "テンプレート: $TEMPLATE"
    fi

    if [[ ! -f "$READER_RULES" ]]; then
        log_warn "reader-rules が見つかりません: $READER_RULES"
    else
        log_ok "reader-rules: $READER_RULES"
    fi

    # 出力ディレクトリの作成
    if [[ ! -d "$PRESENTATIONS_DST" ]]; then
        mkdir -p "$PRESENTATIONS_DST"
        log_ok "出力ディレクトリを作成: $PRESENTATIONS_DST"
    else
        log_ok "出力ディレクトリ: $PRESENTATIONS_DST"
    fi

    if [[ $missing -eq 1 ]]; then
        log_error "必須ファイルが不足しています。中断します。"
        exit 1
    fi
}

# ── ドメイン一覧取得 ──
get_domain_list() {
    for f in "$DOMAINS_SRC"/domain-D*-academic-ja.md; do
        [[ -f "$f" ]] || continue
        local basename
        basename="$(basename "$f")"
        local dnn
        dnn="$(echo "$basename" | sed -E 's/domain-(D[0-9]+)-.*/\1/')"
        local slug
        slug="$(echo "$basename" | sed -E 's/domain-D[0-9]+-(.+)-academic-ja\.md/\1/')"
        local pres_file="$PRESENTATIONS_DST/domain-${dnn}-${slug}-presentation-ja.md"
        local status="pending"
        if [[ -f "$pres_file" ]]; then
            status="exists"
        fi
        echo "${dnn}|${slug}|${status}|${f}|${pres_file}"
    done | sort
}

# ── 一覧表示 ──
show_list() {
    log_info "ドメインレポート一覧:"
    echo ""
    printf "  %-6s %-30s %s\n" "ID" "Slug" "Status"
    printf "  %-6s %-30s %s\n" "------" "------------------------------" "--------"

    local total=0
    local existing=0
    local pending=0

    while IFS='|' read -r dnn slug status src dst; do
        total=$((total + 1))
        if [[ "$status" == "exists" ]]; then
            existing=$((existing + 1))
            printf "  ${GREEN}%-6s %-30s %s${NC}\n" "$dnn" "$slug" "exists"
        else
            pending=$((pending + 1))
            printf "  ${YELLOW}%-6s %-30s %s${NC}\n" "$dnn" "$slug" "pending"
        fi
    done < <(get_domain_list)

    echo ""
    log_info "合計: ${total} 件（生成済: ${existing}, 未生成: ${pending}）"
}

# ── 指示書生成 ──
generate_instruction() {
    local dnn="$1"
    local slug="$2"
    local src="$3"
    local dst="$4"

    cat <<INSTRUCTION
--- Claude CLI 用指示書 ---

以下の手順でプレゼン資料を生成してください。

1. Read: ${READER_RULES}
2. Read: ${TEMPLATE}
3. Read: ${src}
4. テンプレートに従い、ドメインレポートの内容からプレゼン資料を生成
5. Write: ${dst}

禁止事項:
- NL-005: 欠損駆動思考への言及禁止
- NL-010: 抱持・欠損（Kesson）への言及禁止
- レポートに書かれていない内容の追加禁止

対象: ${dnn} (${slug})
入力: ${src}
出力: ${dst}
--------------------------
INSTRUCTION
}

# ── 単一ドメイン処理 ──
process_single() {
    local target="$1"
    local found=false

    while IFS='|' read -r dnn slug status src dst; do
        if [[ "$dnn" == "$target" ]]; then
            found=true

            if [[ "$status" == "exists" ]]; then
                log_warn "${dnn} (${slug}) のプレゼンは既に存在します: ${dst}"
                log_info "上書きする場合は既存ファイルを削除してから再実行してください。"
                return 0
            fi

            log_info "${dnn} (${slug}) のプレゼン生成..."

            if [[ "$DRY_RUN" == true ]]; then
                generate_instruction "$dnn" "$slug" "$src" "$dst"
            else
                echo ""
                generate_instruction "$dnn" "$slug" "$src" "$dst"
                echo ""
                log_info "上記の指示書に従って Claude CLI でプレゼンを生成してください。"
            fi
            return 0
        fi
    done < <(get_domain_list)

    if [[ "$found" == false ]]; then
        log_error "ドメイン ${target} のレポートが見つかりません。"
        log_info "利用可能なドメインは --list で確認できます。"
        exit 1
    fi
}

# ── 全ドメイン処理 ──
process_all() {
    local pending=0
    local skipped=0

    while IFS='|' read -r dnn slug status src dst; do
        if [[ "$status" == "exists" ]]; then
            skipped=$((skipped + 1))
            log_ok "${dnn} (${slug}) — スキップ（既存）"
            continue
        fi

        pending=$((pending + 1))

        if [[ "$DRY_RUN" == true ]]; then
            echo ""
            generate_instruction "$dnn" "$slug" "$src" "$dst"
        else
            echo ""
            generate_instruction "$dnn" "$slug" "$src" "$dst"
        fi
    done < <(get_domain_list)

    echo ""
    log_info "スキップ: ${skipped} 件、生成対象: ${pending} 件"

    if [[ $pending -gt 0 && "$DRY_RUN" == false ]]; then
        echo ""
        log_info "上記の指示書に従って Claude CLI で各プレゼンを生成してください。"
    fi
}

# ── メイン ──
main() {
    log_info "generate-presentations.sh v1.0"
    echo ""

    check_deps
    echo ""

    case "$MODE" in
        list)
            show_list
            ;;
        single)
            process_single "$TARGET_DOMAIN"
            ;;
        all)
            process_all
            ;;
    esac
}

main
