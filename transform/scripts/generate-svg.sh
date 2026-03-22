#!/usr/bin/env bash
# generate-svg.sh — 公開用 MD の図解 SVG 生成ワークフロー (cs#136)
#
# 概要:
#   公開用 MD（domains / themes）を読み、図解 SVG を生成するためのワークフロー。
#   実際の SVG 生成は Claude CLI に委譲する。本スクリプトは以下を行う:
#     - public md（ja / en）を対象に一覧を取得
#     - 既存 SVG があればスキップ（冪等性）
#     - public 配下の SVG ディレクトリを作成
#     - Claude CLI 呼び出し用のプロンプトを生成・表示
#
# 使い方:
#   bash transform/scripts/generate-svg.sh                          # 全 domains + themes, ja+en
#   bash transform/scripts/generate-svg.sh --kind domains           # domains のみ
#   bash transform/scripts/generate-svg.sh --kind themes            # themes のみ
#   bash transform/scripts/generate-svg.sh --lang en               # EN のみ
#   bash transform/scripts/generate-svg.sh --domain D01             # 単一ドメイン
#   bash transform/scripts/generate-svg.sh --force                  # 既存 SVG も再生成
#   bash transform/scripts/generate-svg.sh --dry-run                # 対象一覧のみ表示
#   bash transform/scripts/generate-svg.sh --generate               # Claude CLI で自動生成
#
# 格納先:
#   /Users/uminomae/dev/pjdhiro/assets/creation/img/svg/domains/{lang}/{domain-id}-{slug}.svg
#   /Users/uminomae/dev/pjdhiro/assets/creation/img/svg/themes/{lang}/theme-{slug}.svg

set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; RED='\033[0;31m'; NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CREATION_SPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PJDHIRO_CREATION_DIR="/Users/uminomae/dev/pjdhiro/assets/creation"

DOMAINS_MD_JA="$PJDHIRO_CREATION_DIR/domains/ja/md"
DOMAINS_MD_EN="$PJDHIRO_CREATION_DIR/domains/en/md"
THEMES_MD_JA="$PJDHIRO_CREATION_DIR/phase8-themes/ja/md"
THEMES_MD_EN="$PJDHIRO_CREATION_DIR/phase8-themes/en/md"

SVG_DOMAINS_DIR="$PJDHIRO_CREATION_DIR/img/svg/domains"
SVG_THEMES_DIR="$PJDHIRO_CREATION_DIR/img/svg/themes"
SVG_RULES="$CREATION_SPACE_ROOT/transform/guides/svg-generation-rules.md"

KIND="all"
LANG="all"
DOMAIN=""
FORCE=false
DRY_RUN=false
GENERATE=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --kind|-k) KIND="${2:-all}"; shift 2 ;;
        --lang|-l) LANG="${2:-all}"; shift 2 ;;
        --domain|-d) DOMAIN="${2:-}"; KIND="domains"; shift 2 ;;
        --force|-f) FORCE=true; shift ;;
        --dry-run|-n) DRY_RUN=true; shift ;;
        --generate|-g) GENERATE=true; shift ;;
        --help|-h)
            echo "使い方: bash transform/scripts/generate-svg.sh [オプション]"
            echo ""
            echo "オプション:"
            echo "  --kind {domains|themes|all}   種別（デフォルト: all）"
            echo "  --lang {ja|en|all}            対象言語（デフォルト: all）"
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

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  SVG 図解生成ワークフロー (cs#136)${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

mkdir -p "$SVG_DOMAINS_DIR/ja" "$SVG_DOMAINS_DIR/en" "$SVG_THEMES_DIR/ja" "$SVG_THEMES_DIR/en"

get_langs() {
    case "$LANG" in
        ja) printf '%s\n' "ja" ;;
        en) printf '%s\n' "en" ;;
        all) printf '%s\n' "ja" "en" ;;
        *) echo -e "${RED}不明な lang: $LANG${NC}" >&2; exit 1 ;;
    esac
}

get_domain_md_dir() {
    if [ "$1" = "en" ]; then
        printf '%s\n' "$DOMAINS_MD_EN"
    else
        printf '%s\n' "$DOMAINS_MD_JA"
    fi
}

get_theme_md_dir() {
    if [ "$1" = "en" ]; then
        printf '%s\n' "$THEMES_MD_EN"
    else
        printf '%s\n' "$THEMES_MD_JA"
    fi
}

get_md_title() {
    local file="$1"
    python3 - "$file" <<'PYEOF'
import sys, re
text = open(sys.argv[1], encoding='utf-8').read()
m = re.search(r'^title:\s*["\x27](.*?)["\x27]', text, re.MULTILINE)
if m:
    print(m.group(1))
else:
    h = re.search(r'^#\s+(.+)', text, re.MULTILINE)
    if h:
        print(h.group(1).strip())
    else:
        print(sys.argv[1])
PYEOF
}

get_svg_name_domain() {
    basename "$1" .md
}

get_svg_name_theme() {
    basename "$1" .md
}

generate_prompt() {
    local md_file="$1"
    local svg_file="$2"
    local title="$3"
    local kind="$4"
    local lang="$5"

    cat <<PROMPT
--- SVG 生成指示 ---
対象MD: $md_file
出力先: $svg_file
タイトル: $title
種別: $kind
言語: $lang

以下のMDを読み、内容を図解するSVGを生成してください。
スタイルガイド: $SVG_RULES

要件:
- MD の主要な構造・関係性を視覚化する
- ラベルの言語は MD 本文の言語に合わせる（ja / en）
- 日本語テキストを含む場合は font-family に "Hiragino Sans", "Noto Sans JP", sans-serif を指定
- 英語テキストを含む場合は "Inter", "Helvetica Neue", sans-serif を優先する
- viewBox を適切に設定し、レスポンシブに表示できること
- 色はスタイルガイドのパレットに従う
- 1ファイル完結（外部リソース不使用）
---
PROMPT
}

generate_with_claude() {
    local md_file="$1"
    local svg_file="$2"
    local title="$3"
    local kind="$4"
    local lang="$5"

    if ! command -v claude >/dev/null 2>&1; then
        echo -e "    ${RED}claude CLI が見つかりません${NC}"
        return 1
    fi

    local prompt
    prompt="$(generate_prompt "$md_file" "$svg_file" "$title" "$kind" "$lang")"
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
        echo -e "    ${RED}生成失敗${NC}: $(basename "$svg_file")"
        rm -f "$svg_file"
        return 1
    }

    if [ -f "$svg_file" ] && [ -s "$svg_file" ]; then
        echo -e "    ${GREEN}OK${NC}: $(basename "$svg_file")"
    fi
}

process_domains() {
    echo -e "${BLUE}[domains] 対象 MD を検索中...${NC}"
    local count=0 skip=0 target=0
    local lang

    for lang in $(get_langs); do
        local md_dir
        md_dir="$(get_domain_md_dir "$lang")"
        if [ ! -d "$md_dir" ]; then
            echo -e "  ${YELLOW}スキップ${NC}: $md_dir が存在しません"
            continue
        fi

        for md_file in "$md_dir"/domain-D*.md; do
            [ -f "$md_file" ] || continue
            if [ -n "$DOMAIN" ]; then
                case "$md_file" in
                    *"domain-${DOMAIN}-"*) ;;
                    *) continue ;;
                esac
            fi

            local svg_name
            svg_name="$(get_svg_name_domain "$md_file")"
            local svg_file="$SVG_DOMAINS_DIR/$lang/${svg_name}.svg"
            local title
            title="$(get_md_title "$md_file")"

            count=$((count + 1))

            if [ "$FORCE" = false ] && [ -f "$svg_file" ]; then
                skip=$((skip + 1))
                continue
            fi

            target=$((target + 1))

            if [ "$DRY_RUN" = true ]; then
                echo -e "  ${BLUE}*${NC} [${lang}] ${svg_name}.svg (${title})"
            elif [ "$GENERATE" = true ]; then
                echo -e "  ${BLUE}*${NC} [${lang}] 生成中: ${svg_name}.svg (${title})"
                generate_with_claude "$md_file" "$svg_file" "$title" "domain" "$lang" || return 1
            else
                generate_prompt "$md_file" "$svg_file" "$title" "domain" "$lang"
                echo ""
            fi
        done
    done

    echo -e "  domains: 検出=${count}, スキップ=${skip}, 対象=${target}"
    echo ""
}

process_themes() {
    echo -e "${BLUE}[themes] 対象 MD を検索中...${NC}"
    local count=0 skip=0 target=0
    local lang

    for lang in $(get_langs); do
        local md_dir
        md_dir="$(get_theme_md_dir "$lang")"
        if [ ! -d "$md_dir" ]; then
            echo -e "  ${YELLOW}スキップ${NC}: $md_dir が存在しません"
            continue
        fi

        for md_file in "$md_dir"/theme-*.md; do
            [ -f "$md_file" ] || continue

            local svg_name
            svg_name="$(get_svg_name_theme "$md_file")"
            local svg_file="$SVG_THEMES_DIR/$lang/${svg_name}.svg"
            local title
            title="$(get_md_title "$md_file")"

            count=$((count + 1))

            if [ "$FORCE" = false ] && [ -f "$svg_file" ]; then
                skip=$((skip + 1))
                continue
            fi

            target=$((target + 1))

            if [ "$DRY_RUN" = true ]; then
                echo -e "  ${BLUE}*${NC} [${lang}] ${svg_name}.svg (${title})"
            elif [ "$GENERATE" = true ]; then
                echo -e "  ${BLUE}*${NC} [${lang}] 生成中: ${svg_name}.svg (${title})"
                generate_with_claude "$md_file" "$svg_file" "$title" "theme" "$lang" || return 1
            else
                generate_prompt "$md_file" "$svg_file" "$title" "theme" "$lang"
                echo ""
            fi
        done
    done

    echo -e "  themes: 検出=${count}, スキップ=${skip}, 対象=${target}"
    echo ""
}

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
