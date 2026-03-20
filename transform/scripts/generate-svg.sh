#!/usr/bin/env bash
# generate-svg.sh — 公開用 MD の図解 SVG 生成ワークフロー (cs#136)
#
# 概要:
#   公開用 MD（domains / themes）を読み、図解 SVG を生成するためのワークフロー。
#   実際の SVG 生成は Claude CLI に委譲する。本スクリプトは以下を行う:
#     - 対象 MD ファイルの一覧を取得
#     - 既存 SVG があればスキップ（冪等性）
#     - SVG 格納先ディレクトリ作成
#     - Claude CLI 呼び出し用のプロンプトを生成・表示
#
# 使い方:
#   bash transform/scripts/generate-svg.sh                          # 全 domains + themes
#   bash transform/scripts/generate-svg.sh --kind domains           # domains のみ
#   bash transform/scripts/generate-svg.sh --kind themes            # themes のみ
#   bash transform/scripts/generate-svg.sh --domain D01             # 単一ドメイン
#   bash transform/scripts/generate-svg.sh --force                  # 既存 SVG も再生成
#   bash transform/scripts/generate-svg.sh --dry-run                # 対象一覧のみ表示
#   bash transform/scripts/generate-svg.sh --generate               # Claude CLI で自動生成
#
# 格納先:
#   assets/svg/domains/{domain-id}-{slug}.svg
#   assets/svg/themes/theme-{slug}.svg
#
# 命名規約:
#   domains: domain-D{NN}-{name}.svg  (例: domain-D01-mathematics.svg)
#   themes:  theme-{slug}.svg         (例: theme-blind-spots.svg)

set -euo pipefail

# ── 色付き出力 ──
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; RED='\033[0;31m'; NC='\033[0m'

# ── パス ──
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CREATION_SPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PUBLISH_DOMAINS_DIR="$CREATION_SPACE_ROOT/transform/domains/publish/domains"
PHASE8_THEMES_DIR="$CREATION_SPACE_ROOT/evidence/investigation/phase8/themes"
SVG_DOMAINS_DIR="$CREATION_SPACE_ROOT/assets/svg/domains"
SVG_THEMES_DIR="$CREATION_SPACE_ROOT/assets/svg/themes"
SVG_RULES="$CREATION_SPACE_ROOT/transform/guides/svg-generation-rules.md"

# ── 引数解析 ──
KIND="all"
DOMAIN=""
FORCE=false
DRY_RUN=false
GENERATE=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --kind|-k)     KIND="${2:-all}"; shift 2 ;;
        --domain|-d)   DOMAIN="${2:-}"; KIND="domains"; shift 2 ;;
        --force|-f)    FORCE=true; shift ;;
        --dry-run|-n)  DRY_RUN=true; shift ;;
        --generate|-g) GENERATE=true; shift ;;
        --help|-h)
            echo "使い方: bash transform/scripts/generate-svg.sh [オプション]"
            echo ""
            echo "オプション:"
            echo "  --kind {domains|themes|all}   種別（デフォルト: all）"
            echo "  --domain D{NN}                単一ドメイン指定（例: D01）"
            echo "  --force                       既存 SVG も再生成"
            echo "  --dry-run                     対象一覧のみ表示（生成しない）"
            echo "  --generate                    Claude CLI で自動生成"
            echo "  --help                        このヘルプを表示"
            exit 0
            ;;
        *) echo -e "${RED}不明なオプション: $1${NC}"; exit 1 ;;
    esac
done

# ── ヘッダー ──
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  SVG 図解生成ワークフロー (cs#136)${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# ── ディレクトリ作成 ──
mkdir -p "$SVG_DOMAINS_DIR" "$SVG_THEMES_DIR"

# ── MD タイトル取得 ──
get_md_title() {
    local file="$1"
    python3 - "$file" << 'PYEOF'
import sys, re
text = open(sys.argv[1]).read()
m = re.search(r'^title:\s*["\x27](.*?)["\x27]', text, re.MULTILINE)
if m:
    print(m.group(1))
else:
    h = re.search(r'^#\s+(.+)', text, re.MULTILINE)
    if h:
        raw = h.group(1).strip()
        clean = re.split(r'[x{2014}x{2015}]+', raw)[0].strip()
        print(clean)
    else:
        print(sys.argv[1])
PYEOF
}

# ── SVG ファイル名を MD から導出 ──
get_svg_name_domain() {
    local md_file="$1"
    local base
    base=$(basename "$md_file" .md)
    # domain-D01-mathematics-academic-ja → domain-D01-mathematics
    echo "$base" | sed -E 's/-academic-ja$//' | sed -E 's/-academic-en$//'
}

get_svg_name_theme() {
    local md_file="$1"
    basename "$md_file" .md
}

# ── プロンプトテンプレート生成 ──
generate_prompt() {
    local md_file="$1"
    local svg_file="$2"
    local title="$3"
    local kind="$4"

    cat << PROMPT
--- SVG 生成指示 ---
対象MD: $md_file
出力先: $svg_file
タイトル: $title
種別: $kind

以下のMDを読み、内容を図解するSVGを生成してください。
スタイルガイド: $SVG_RULES

要件:
- MDの主要な構造・関係性を視覚化する
- 日本語テキストを含む場合は font-family に "Hiragino Sans", "Noto Sans JP", sans-serif を指定
- viewBox を適切に設定し、レスポンシブに表示できること
- 色はスタイルガイドのパレットに従う
- 1ファイル完結（外部リソース不使用）
---
PROMPT
}

# ── domains 処理 ──
process_domains() {
    echo -e "${BLUE}[domains] 対象 MD を検索中...${NC}"

    if [ ! -d "$PUBLISH_DOMAINS_DIR" ]; then
        echo -e "  ${YELLOW}スキップ${NC}: $PUBLISH_DOMAINS_DIR が存在しません"
        return 0
    fi

    local count=0 skip=0 target=0

    for md_file in "$PUBLISH_DOMAINS_DIR"/domain-D*.md; do
        [ -f "$md_file" ] || continue

        # 単一ドメイン指定時はフィルタ
        if [ -n "$DOMAIN" ]; then
            case "$md_file" in
                *"domain-${DOMAIN}-"*) ;;
                *) continue ;;
            esac
        fi

        local svg_name
        svg_name="$(get_svg_name_domain "$md_file")"
        local svg_file="$SVG_DOMAINS_DIR/${svg_name}.svg"

        count=$((count + 1))

        # 冪等性チェック
        if [ "$FORCE" = false ] && [ -f "$svg_file" ]; then
            skip=$((skip + 1))
            continue
        fi

        target=$((target + 1))
        local title
        title="$(get_md_title "$md_file")"

        if [ "$DRY_RUN" = true ]; then
            echo -e "  ${BLUE}*${NC} ${svg_name}.svg (${title})"
        elif [ "$GENERATE" = true ]; then
            echo -e "  ${BLUE}*${NC} 生成中: ${svg_name}.svg (${title})"
            if command -v claude &>/dev/null; then
                local prompt
                prompt="$(generate_prompt "$md_file" "$svg_file" "$title" "domain")"
                local md_content
                md_content="$(cat "$md_file")"
                local rules_content=""
                if [ -f "$SVG_RULES" ]; then
                    rules_content="$(cat "$SVG_RULES")"
                fi
                echo "${prompt}

## スタイルガイド
${rules_content}

## MD 内容
${md_content}

上記のMDの内容を図解するSVGを生成し、${svg_file} に保存してください。" | claude --print 2>/dev/null > "$svg_file" || {
                    echo -e "    ${RED}生成失敗${NC}: ${svg_name}.svg"
                    rm -f "$svg_file"
                }
                if [ -f "$svg_file" ] && [ -s "$svg_file" ]; then
                    echo -e "    ${GREEN}OK${NC}: ${svg_name}.svg"
                fi
            else
                echo -e "    ${RED}claude CLI が見つかりません${NC}"
                return 1
            fi
        else
            generate_prompt "$md_file" "$svg_file" "$title" "domain"
            echo ""
        fi
    done

    echo -e "  domains: 検出=${count}, スキップ=${skip}, 対象=${target}"
    echo ""
}

# ── themes 処理 ──
process_themes() {
    echo -e "${BLUE}[themes] 対象 MD を検索中...${NC}"

    if [ ! -d "$PHASE8_THEMES_DIR" ]; then
        echo -e "  ${YELLOW}スキップ${NC}: $PHASE8_THEMES_DIR が存在しません"
        return 0
    fi

    local count=0 skip=0 target=0

    for md_file in "$PHASE8_THEMES_DIR"/theme-*.md; do
        [ -f "$md_file" ] || continue

        local svg_name
        svg_name="$(get_svg_name_theme "$md_file")"
        local svg_file="$SVG_THEMES_DIR/${svg_name}.svg"

        count=$((count + 1))

        # 冪等性チェック
        if [ "$FORCE" = false ] && [ -f "$svg_file" ]; then
            skip=$((skip + 1))
            continue
        fi

        target=$((target + 1))
        local title
        title="$(get_md_title "$md_file")"

        if [ "$DRY_RUN" = true ]; then
            echo -e "  ${BLUE}*${NC} ${svg_name}.svg (${title})"
        elif [ "$GENERATE" = true ]; then
            echo -e "  ${BLUE}*${NC} 生成中: ${svg_name}.svg (${title})"
            if command -v claude &>/dev/null; then
                local prompt
                prompt="$(generate_prompt "$md_file" "$svg_file" "$title" "theme")"
                local md_content
                md_content="$(cat "$md_file")"
                local rules_content=""
                if [ -f "$SVG_RULES" ]; then
                    rules_content="$(cat "$SVG_RULES")"
                fi
                echo "${prompt}

## スタイルガイド
${rules_content}

## MD 内容
${md_content}

上記のMDの内容を図解するSVGを生成し、${svg_file} に保存してください。" | claude --print 2>/dev/null > "$svg_file" || {
                    echo -e "    ${RED}生成失敗${NC}: ${svg_name}.svg"
                    rm -f "$svg_file"
                }
                if [ -f "$svg_file" ] && [ -s "$svg_file" ]; then
                    echo -e "    ${GREEN}OK${NC}: ${svg_name}.svg"
                fi
            else
                echo -e "    ${RED}claude CLI が見つかりません${NC}"
                return 1
            fi
        else
            generate_prompt "$md_file" "$svg_file" "$title" "theme"
            echo ""
        fi
    done

    echo -e "  themes: 検出=${count}, スキップ=${skip}, 対象=${target}"
    echo ""
}

# ── メイン ──
main() {
    case "$KIND" in
        all)
            process_domains
            process_themes
            ;;
        domains)
            process_domains
            ;;
        themes)
            process_themes
            ;;
        *)
            echo -e "${RED}不明な kind: $KIND${NC}"
            exit 1
            ;;
    esac

    echo -e "${GREEN}======================================${NC}"
    if [ "$DRY_RUN" = true ]; then
        echo -e "${GREEN}  dry-run 完了（生成は行っていません）${NC}"
    elif [ "$GENERATE" = true ]; then
        echo -e "${GREEN}  SVG 生成完了${NC}"
    else
        echo -e "${GREEN}  プロンプト出力完了${NC}"
        echo ""
        echo -e "次のステップ:"
        echo -e "  1. 上記プロンプトを Claude CLI に渡して SVG を生成"
        echo -e "  2. または --generate オプションで自動生成:"
        echo -e "     bash transform/scripts/generate-svg.sh --generate"
    fi
    echo -e "${GREEN}======================================${NC}"
}

main
