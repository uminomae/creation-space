#!/usr/bin/env bash
# svg2png.sh — SVG → PNG 一括変換スクリプト (cs#136)
#
# macOS の qlmanage を使い、日本語フォントを正しく描画した PNG を生成する。
# 出力ファイル名は qlmanage が `.svg.png` を付けるため、リネームする。
#
# 使い方:
#   bash transform/scripts/svg2png.sh                # 全 SVG を変換
#   bash transform/scripts/svg2png.sh --domains      # domains のみ
#   bash transform/scripts/svg2png.sh --themes       # themes のみ
#   bash transform/scripts/svg2png.sh --force         # 既存 PNG も上書き

set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; RED='\033[0;31m'; NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

SVG_DOMAINS="$ROOT/assets/svg/domains"
SVG_THEMES="$ROOT/assets/svg/themes"
PNG_DOMAINS="$ROOT/assets/img/domains"
PNG_THEMES="$ROOT/assets/img/themes"

SIZE=1600
DOMAINS=true
THEMES=true
FORCE=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --domains) THEMES=false; shift ;;
        --themes) DOMAINS=false; shift ;;
        --force) FORCE=true; shift ;;
        --size) SIZE="$2"; shift 2 ;;
        *) echo -e "${RED}Unknown option: $1${NC}"; exit 1 ;;
    esac
done

convert_dir() {
    local svg_dir="$1"
    local png_dir="$2"
    local label="$3"
    local count=0 skip=0

    mkdir -p "$png_dir"

    for svg_file in "$svg_dir"/*.svg; do
        [ -f "$svg_file" ] || continue
        local base
        base="$(basename "$svg_file" .svg)"
        local png_file="$png_dir/${base}.png"

        if [ "$FORCE" = false ] && [ -f "$png_file" ]; then
            skip=$((skip + 1))
            continue
        fi

        # qlmanage outputs {filename}.svg.png in the output directory
        qlmanage -t -s "$SIZE" -o "$png_dir" "$svg_file" >/dev/null 2>&1

        local ql_output="$png_dir/${base}.svg.png"
        if [ -f "$ql_output" ]; then
            mv "$ql_output" "$png_file"
            local size
            size=$(wc -c < "$png_file" | tr -d ' ')
            echo -e "  ${GREEN}OK${NC}: ${base}.png (${size} bytes)"
            count=$((count + 1))
        else
            echo -e "  ${RED}FAIL${NC}: ${base}.svg"
        fi
    done

    echo -e "  ${label}: converted=${count}, skipped=${skip}"
}

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  SVG → PNG 変換 (qlmanage, ${SIZE}px)${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

if [ "$DOMAINS" = true ]; then
    echo -e "${BLUE}[domains]${NC}"
    convert_dir "$SVG_DOMAINS" "$PNG_DOMAINS" "domains"
    echo ""
fi

if [ "$THEMES" = true ]; then
    echo -e "${BLUE}[themes]${NC}"
    convert_dir "$SVG_THEMES" "$PNG_THEMES" "themes"
    echo ""
fi

echo -e "${GREEN}変換完了${NC}"
