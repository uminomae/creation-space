#!/usr/bin/env bash
# build-pdf-guide.sh — creation-space PDF/SVG 生成 v2.2
#
# 概要:
#   --kind で guides / domains / themes / svg / all を指定し、PDF/SVG を生成する。
#   guides:  pjdhiro/assets/creation/guides/{lang}/md/ の MD から PDF を生成。
#   domains: pjdhiro/assets/creation/domains/{lang}/md/ の MD から PDF を生成。
#   themes:  pjdhiro/assets/creation/phase8-themes/{lang}/md/ の MD から PDF を生成。
#
# 使い方:
#   bash transform/scripts/build-pdf-guide.sh                                  # guides general JA（デフォルト）
#   bash transform/scripts/build-pdf-guide.sh --kind guides --audience all     # guides 全3種 JA
#   bash transform/scripts/build-pdf-guide.sh --kind guides --lang all         # guides general JA+EN
#   bash transform/scripts/build-pdf-guide.sh --kind domains --lang ja         # domains JA 全30件
#   bash transform/scripts/build-pdf-guide.sh --kind themes --lang all         # themes JA+EN
#   bash transform/scripts/build-pdf-guide.sh --kind all --lang ja             # 全種 JA
#   bash transform/scripts/build-pdf-guide.sh --kind svg                          # SVG対象一覧
#   bash transform/scripts/build-pdf-guide.sh --push                           # ビルド後 manifest を更新
#   bash transform/scripts/build-pdf-guide.sh --setup                          # 依存チェックのみ
#
# 出力:
#   guides:  pjdhiro/assets/creation/guides/{lang}/pdf/creation-{audience}.pdf
#   domains: pjdhiro/assets/creation/domains/{lang}/pdf/domain-D{NN}-{name}.pdf
#   themes:  pjdhiro/assets/creation/phase8-themes/{lang}/pdf/theme-{slug}.pdf
#
# 互換性:
#   bash 3.2以上（macOS標準）で動作。${var^^} は使用しない。
#
# v2.2 変更点:
#   - SVG 図解生成ワークフロー統合（--kind svg）
#
# v2.1 変更点:
#   - Phase 8 横断分析テーマ（themes）ビルド対応
#
# v2.0 変更点:
#   - 表紙（タイトル・サブタイトル・日付）生成
#   - 目次（TOC）生成
#   - JA/EN 対応
#   - front matter 除去
#   - domains ビルド対応
#   - 依存チェック・色付きログ・ファイルサイズ表示
#   - manifest 更新（--push 時）
#   - PDF エンジンを lualatex に変更（JA 対応向上）

set -euo pipefail

# ── 色付き出力 ──
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; RED='\033[0;31m'; NC='\033[0m'

# ── パス ──
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CREATION_SPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PJDHIRO_DIR="/Users/uminomae/dev/pjdhiro"
GUIDES_BASE="$PJDHIRO_DIR/assets/creation/guides"
DOMAINS_BASE="$PJDHIRO_DIR/assets/creation/domains"
THEMES_BASE="$PJDHIRO_DIR/assets/creation/phase8-themes"
SYNTHESIS_BASE="$PJDHIRO_DIR/assets/creation/synthesis"
IMG_DIR="$PJDHIRO_DIR/assets/creation/img"
MANIFESTS_DIR="$PJDHIRO_DIR/assets/creation/manifests"
GENERATE_SVG="$CREATION_SPACE_ROOT/transform/scripts/generate-svg.sh"
REWRITE_SVG_FOR_PDF="$CREATION_SPACE_ROOT/transform/scripts/rewrite-svg-links-for-pdf.py"

# ── YAML front matter を除去 ──
strip_frontmatter() {
    python3 -c "
import sys
lines = sys.stdin.readlines()
if lines and lines[0].strip() == '---':
    for i, l in enumerate(lines[1:], 1):
        if l.strip() == '---':
            print(''.join(lines[i+1:]), end=''); sys.exit()
print(''.join(lines), end='')
"
}

# ── 依存チェック ──
check_deps() {
    echo "依存チェック..."
    local missing=0
    for cmd in pandoc lualatex python3; do
        if command -v "$cmd" &>/dev/null; then
            echo -e "  ${GREEN}✓${NC} $cmd"
        else
            echo -e "  ${RED}✗${NC} $cmd が見つかりません"
            missing=1
        fi
    done
    if [ "$missing" -eq 1 ]; then
        echo ""
        echo -e "${YELLOW}インストール:${NC}"
        echo "  brew install pandoc"
        echo "  brew install --cask mactex-no-gui"
        echo "  sudo tlmgr install collection-luatex luatexja haranoaji"
        exit 1
    fi
    echo -e "  ${GREEN}✓${NC} 依存OK"
}

# ── タイトル定義 ──
get_guide_title() {
    local audience="$1"
    local lang="${2:-ja}"
    if [ "$lang" = "en" ]; then
        case "$audience" in
            general)  echo "The Structure of Creation — Five Stages" ;;
            designer) echo "What Lies Between Divergence and Convergence" ;;
            academic) echo "Structural Comparison of the Five-Stage Model and Prior Theories" ;;
        esac
    else
        case "$audience" in
            general)  echo "創造の構造——5つの段階" ;;
            designer) echo "発散と収束の間にあるもの" ;;
            academic) echo "創造の5段階モデルと先行理論の構造比較" ;;
        esac
    fi
}

get_guide_subtitle() {
    local audience="$1"
    local lang="${2:-ja}"
    if [ "$lang" = "en" ]; then
        case "$audience" in
            general)  echo "From Field to Bundle" ;;
            designer) echo "A Map for Seeing Your Team's Creation Structurally" ;;
            academic) echo "Do Different Labels Point to the Same Thing?" ;;
        esac
    else
        case "$audience" in
            general)  echo "場から束へ" ;;
            designer) echo "チームの創造を構造的に見るための地図" ;;
            academic) echo "異なるラベルは同じものを指しているか" ;;
        esac
    fi
}

# ── domain / theme タイトル取得（front matter の title フィールド） ──
get_domain_title() {
    local file="$1"
    local fallback
    fallback="$(basename "$file" .md)"
    python3 - "$file" "$fallback" << 'PYEOF'
import sys, re
text = open(sys.argv[1]).read()
# 1st: front matter title field
m = re.search(r'^title:\s*["\x27](.*?)["\x27]', text, re.MULTILINE)
if m:
    print(m.group(1))
else:
    # 2nd: first H1 heading (strip trailing decorations like "——...")
    h = re.search(r'^#\s+(.+)', text, re.MULTILINE)
    if h:
        raw = h.group(1).strip()
        # Remove subtitle after em-dash
        clean = re.split(r'[—―]+', raw)[0].strip()
        print(clean)
    else:
        print(sys.argv[2])
PYEOF
}

# ── YAML header 生成（JA） ──
make_header_ja() {
    local title="$1" subtitle="$2"
    local date_str
    date_str=$(TZ=Asia/Tokyo date "+%Y年%m月%d日")

    cat << YAML
---
title: "${title}"
subtitle: "${subtitle}"
author: ""
date: "${date_str}"
documentclass: ltjsarticle
classoption: [a4paper, 11pt]
header-includes:
  - \\usepackage{luatexja-fontspec}
  - \\setmainjfont{Hiragino Mincho ProN}
  - \\setsansjfont{Hiragino Sans}
  - \\setmonofont{Menlo}
  - \\usepackage{graphicx}
  - \\usepackage{hyperref}
  - \\usepackage{xcolor}
  - \\usepackage{longtable}
  - \\usepackage{booktabs}
  - \\hypersetup{colorlinks=true,linkcolor=blue,urlcolor=blue}
geometry: [margin=25mm]
toc: true
toc-depth: 2
---

\\newpage

YAML
}

# ── YAML header 生成（EN） ──
make_header_en() {
    local title="$1" subtitle="$2"
    local date_str
    date_str=$(TZ=Asia/Tokyo date "+%Y-%m-%d")

    cat << YAML
---
title: "${title}"
subtitle: "${subtitle}"
author: ""
date: "${date_str}"
documentclass: article
classoption: [a4paper, 11pt]
header-includes:
  - \\usepackage{fontspec}
  - \\setmonofont{Menlo}
  - \\usepackage{graphicx}
  - \\usepackage{hyperref}
  - \\usepackage{xcolor}
  - \\usepackage{longtable}
  - \\usepackage{booktabs}
  - \\hypersetup{colorlinks=true,linkcolor=blue,urlcolor=blue}
geometry: [margin=25mm]
toc: true
toc-depth: 2
---

\\newpage

YAML
}

rewrite_svg_links_for_pdf() {
    local tmp_md="$1"
    local source_md="$2"
    local raster_dir="$3"

    if [ ! -f "$REWRITE_SVG_FOR_PDF" ]; then
        return 0
    fi

    python3 "$REWRITE_SVG_FOR_PDF" \
        --input-md "$tmp_md" \
        --source-md "$source_md" \
        --raster-dir "$raster_dir"
}

run_pandoc_pdf() {
    local input_md="$1"
    local output_pdf="$2"
    shift 2

    mkdir -p "$CREATION_SPACE_ROOT/.build-tmp/texmf-var" "$CREATION_SPACE_ROOT/.build-tmp/texmf-config"
    env \
        TEXMFVAR="$CREATION_SPACE_ROOT/.build-tmp/texmf-var" \
        TEXMFCONFIG="$CREATION_SPACE_ROOT/.build-tmp/texmf-config" \
        pandoc "$input_md" -o "$output_pdf" "$@"
}

# ── guides ビルド（1ファイル） ──
build_guide() {
    local audience="$1"
    local lang="${2:-ja}"

    local md_dir="$GUIDES_BASE/${lang}/md"
    local pdf_dir="$GUIDES_BASE/${lang}/pdf"
    local md_file="$md_dir/creation-${audience}.md"
    local pdf_file="$pdf_dir/creation-${audience}.pdf"
    local tmp="$CREATION_SPACE_ROOT/.build-tmp/_guide_${audience}_${lang}.md"

    local lang_label="JA"
    [ "$lang" = "en" ] && lang_label="EN"
    echo -e "${BLUE}📄 creation-${audience} [${lang_label}] ビルド中...${NC}"

    if [ ! -f "$md_file" ]; then
        echo -e "  ${RED}✗${NC} ソースが見つかりません: ${md_file}"
        return 1
    fi

    mkdir -p "$pdf_dir"
    mkdir -p "$(dirname "$tmp")"

    local title subtitle
    title="$(get_guide_title "$audience" "$lang")"
    subtitle="$(get_guide_subtitle "$audience" "$lang")"

    # pandoc 用ヘッダー生成
    if [ "$lang" = "en" ]; then
        make_header_en "$title" "$subtitle" > "$tmp"
    else
        make_header_ja "$title" "$subtitle" > "$tmp"
    fi

    # フロントマターを除去して連結
    cat "$md_file" | strip_frontmatter >> "$tmp"
    rewrite_svg_links_for_pdf "$tmp" "$md_file" "$CREATION_SPACE_ROOT/.build-tmp/svg-raster/guides/${lang}-${audience}"

    echo "  pandoc 変換中..."
    if run_pandoc_pdf "$tmp" "$pdf_file" \
        --pdf-engine=lualatex \
        --resource-path="$IMG_DIR:$md_dir" \
        --wrap=none \
        2>&1 | sed 's/^/    /'; then
        local size
        size=$(du -k "$pdf_file" 2>/dev/null | cut -f1)
        echo -e "  ${GREEN}✅${NC} creation-${audience}.pdf (${size:-?} KB)"
    else
        echo -e "  ${RED}✗${NC} ビルド失敗: creation-${audience}.pdf"
        rm -f "$tmp"
        return 1
    fi

    rm -f "$tmp"
}

# ── domains ビルド ──
build_domains() {
    local lang="${1:-ja}"
    local md_dir="$DOMAINS_BASE/${lang}/md"
    local pdf_dir="$DOMAINS_BASE/${lang}/pdf"

    local lang_label="JA"
    [ "$lang" = "en" ] && lang_label="EN"
    echo -e "${BLUE}📄 domains [${lang_label}] ビルド中...${NC}"

    if [ ! -d "$md_dir" ] || [ -z "$(ls "$md_dir"/domain-D*.md 2>/dev/null)" ]; then
        echo -e "  ${YELLOW}スキップ${NC}: $md_dir に domain-D*.md がありません"
        return 0
    fi

    mkdir -p "$pdf_dir"
    mkdir -p "$CREATION_SPACE_ROOT/.build-tmp"

    local d_success=0 d_fail=0
    for md_file in "$md_dir"/domain-D*.md; do
        local basename_md
        basename_md=$(basename "$md_file" .md)
        local out="$pdf_dir/${basename_md}.pdf"
        local tmp="$CREATION_SPACE_ROOT/.build-tmp/_domain_${basename_md}_${lang}.md"

        local title
        title="$(get_domain_title "$md_file")"

        echo -e "  ${BLUE}→${NC} ${basename_md} [${lang_label}]"

        # pandoc 用ヘッダー生成
        if [ "$lang" = "en" ]; then
            make_header_en "$title" "" > "$tmp"
        else
            make_header_ja "$title" "" > "$tmp"
        fi

        # フロントマターを除去して連結
        cat "$md_file" | strip_frontmatter >> "$tmp"
        rewrite_svg_links_for_pdf "$tmp" "$md_file" "$CREATION_SPACE_ROOT/.build-tmp/svg-raster/domains/${lang}-${basename_md}"

        if run_pandoc_pdf "$tmp" "$out" \
            --pdf-engine=lualatex \
            --resource-path="$PJDHIRO_DIR/assets/creation:$md_dir:$PJDHIRO_DIR/assets/creation/img:$PJDHIRO_DIR/assets/creation/img/svg:$PJDHIRO_DIR/assets/creation/img/svg/domains/$lang" \
            --wrap=none \
            2>&1 | sed 's/^/      /'; then
            local size
            size=$(du -k "$out" 2>/dev/null | cut -f1)
            echo -e "    ${GREEN}✅${NC} ${basename_md}.pdf (${size:-?} KB)"
            d_success=$((d_success + 1))
        else
            echo -e "    ${RED}✗${NC} ビルド失敗: ${basename_md}.pdf"
            d_fail=$((d_fail + 1))
        fi

        rm -f "$tmp"
    done

    echo -e "  domains [${lang_label}]: ${d_success}成功 / ${d_fail}失敗"
    [ "$d_fail" -gt 0 ] && return 1
    return 0
}

# ── themes ビルド（Phase 8 横断分析テーマ） ──
build_themes() {
    local lang="${1:-ja}"
    local md_dir="$THEMES_BASE/${lang}/md"
    local pdf_dir="$THEMES_BASE/${lang}/pdf"

    local lang_label="JA"
    [ "$lang" = "en" ] && lang_label="EN"
    echo -e "${BLUE}📄 themes [${lang_label}] ビルド中...${NC}"

    local has_themes=0
    [ -d "$md_dir" ] && [ -n "$(ls "$md_dir"/theme-*.md 2>/dev/null)" ] && has_themes=1
    if [ "$has_themes" -eq 0 ]; then
        echo -e "  ${YELLOW}スキップ${NC}: $md_dir に theme-*.md がありません"
        return 0
    fi

    mkdir -p "$pdf_dir"
    mkdir -p "$CREATION_SPACE_ROOT/.build-tmp"

    local t_success=0 t_fail=0
    if [ "$has_themes" -eq 1 ]; then
    for md_file in "$md_dir"/theme-*.md; do
        local basename_md
        basename_md=$(basename "$md_file" .md)
        local out="$pdf_dir/${basename_md}.pdf"
        local tmp="$CREATION_SPACE_ROOT/.build-tmp/_theme_${basename_md}_${lang}.md"

        local title
        title="$(get_domain_title "$md_file")"

        echo -e "  ${BLUE}→${NC} ${basename_md} [${lang_label}]"

        # pandoc 用ヘッダー生成
        if [ "$lang" = "en" ]; then
            make_header_en "$title" "" > "$tmp"
        else
            make_header_ja "$title" "" > "$tmp"
        fi

        # フロントマターを除去して連結
        cat "$md_file" | strip_frontmatter >> "$tmp"
        rewrite_svg_links_for_pdf "$tmp" "$md_file" "$CREATION_SPACE_ROOT/.build-tmp/svg-raster/themes/${lang}-${basename_md}"

        # 画像の相対パスを絶対パスに変換（PDF生成用）
        sed -i "" "s|](\.\./.*/img/|]($PJDHIRO_DIR/assets/creation/img/|g" "$tmp"

        if run_pandoc_pdf "$tmp" "$out" \
            --pdf-engine=lualatex \
            --wrap=none \
            --resource-path="$IMG_DIR:$md_dir:$PJDHIRO_DIR/assets/creation" \
            2>&1 | sed 's/^/      /'; then
            local size
            size=$(du -k "$out" 2>/dev/null | cut -f1)
            echo -e "    ${GREEN}✅${NC} ${basename_md}.pdf (${size:-?} KB)"
            t_success=$((t_success + 1))
        else
            echo -e "    ${RED}✗${NC} ビルド失敗: ${basename_md}.pdf"
            t_fail=$((t_fail + 1))
        fi

        rm -f "$tmp"
    done
    fi

    echo -e "  themes [${lang_label}]: ${t_success}成功 / ${t_fail}失敗"
    [ "$t_fail" -gt 0 ] && return 1
    return 0
}



# ── synthesis ビルド（領域横断分析 総合レポート） ──
build_synthesis() {
    local lang="${1:-ja}"
    local md_dir="$SYNTHESIS_BASE/${lang}/md"
    local pdf_dir="$SYNTHESIS_BASE/${lang}/pdf"

    local lang_label="JA"
    [ "$lang" = "en" ] && lang_label="EN"
    echo -e "${BLUE}📄 synthesis [${lang_label}] ビルド中...${NC}"

    if [ \! -d "$md_dir" ] || [ -z "$(ls "$md_dir"/cross-domain-synthesis*.md 2>/dev/null)" ]; then
        echo -e "  ${YELLOW}スキップ${NC}: $md_dir に cross-domain-synthesis*.md がありません"
        return 0
    fi

    mkdir -p "$pdf_dir"
    mkdir -p "$CREATION_SPACE_ROOT/.build-tmp"

    local s_success=0 s_fail=0
    for md_file in "$md_dir"/cross-domain-synthesis*.md; do
        local basename_md
        basename_md=$(basename "$md_file" .md)
        local out="$pdf_dir/${basename_md}.pdf"
        local tmp="$CREATION_SPACE_ROOT/.build-tmp/_synthesis_${basename_md}_${lang}.md"

        local title
        title="$(get_domain_title "$md_file")"

        echo -e "  ${BLUE}→${NC} ${basename_md} [${lang_label}]"

        # pandoc 用ヘッダー生成
        if [ "$lang" = "en" ]; then
            make_header_en "$title" "" > "$tmp"
        else
            make_header_ja "$title" "" > "$tmp"
        fi

        # フロントマターを除去して連結
        cat "$md_file" | strip_frontmatter >> "$tmp"
        rewrite_svg_links_for_pdf "$tmp" "$md_file" "$CREATION_SPACE_ROOT/.build-tmp/svg-raster/synthesis/${lang}-${basename_md}"

        if run_pandoc_pdf "$tmp" "$out" --pdf-engine=lualatex --wrap=none 2>&1 | sed 's/^/      /'; then
            local size
            size=$(du -k "$out" 2>/dev/null | cut -f1)
            echo -e "    ${GREEN}✅${NC} ${basename_md}.pdf (${size:-?} KB)"
            s_success=$((s_success + 1))
        else
            echo -e "    ${RED}✗${NC} ビルド失敗: ${basename_md}.pdf"
            s_fail=$((s_fail + 1))
        fi

        rm -f "$tmp"
    done

    echo -e "  synthesis [${lang_label}]: ${s_success}成功 / ${s_fail}失敗"
    [ "$s_fail" -gt 0 ] && return 1
    return 0
}

# ── SVG 生成（generate-svg.sh に委譲） ──
build_svg() {
    local svg_args=("--dry-run")

    echo -e "${BLUE}📄 SVG 図解生成${NC}"

    if [ ! -f "$GENERATE_SVG" ]; then
        echo -e "  ${RED}✗${NC} generate-svg.sh が見つかりません: $GENERATE_SVG"
        return 1
    fi

    if bash "$GENERATE_SVG" --dry-run; then
        echo -e "  ${GREEN}✅${NC} SVG 対象一覧出力完了"
        echo -e "  ${YELLOW}自動生成するには: bash transform/scripts/generate-svg.sh --generate${NC}"
    else
        echo -e "  ${RED}✗${NC} SVG 対象一覧取得に失敗"
        return 1
    fi
}

# ── manifest 更新 ──
update_manifests() {
    echo -e "${BLUE}📋 manifests 更新${NC}"
    mkdir -p "$MANIFESTS_DIR"

    local date_str
    date_str=$(date +%Y-%m-%d)

    # ── guides.json ──
    python3 -c "
import json, os, sys

creation_dir = sys.argv[1]
date_str = sys.argv[2]
audiences = [
    ('general',  '一般向け',   'General'),
    ('designer', '設計者向け', 'Designer'),
    ('academic', '専門家向け', 'Academic'),
]
guides = []
for aid, title_ja, title_en in audiences:
    entry = {'id': aid, 'title_ja': title_ja, 'title_en': title_en, 'md': {}, 'pdf': {}}
    for lang in ('ja', 'en'):
        md_rel = f'guides/{lang}/md/creation-{aid}.md'
        pdf_rel = f'guides/{lang}/pdf/creation-{aid}.pdf'
        entry['md'][lang] = md_rel if os.path.isfile(os.path.join(creation_dir, md_rel)) else None
        entry['pdf'][lang] = pdf_rel if os.path.isfile(os.path.join(creation_dir, pdf_rel)) else None
    guides.append(entry)

manifest = {
    'version': '2.0',
    'generated_at': date_str,
    'namespace': 'creation',
    'guides': guides,
}
print(json.dumps(manifest, indent=2, ensure_ascii=False))
" "$PJDHIRO_DIR/assets/creation" "$date_str" > "$MANIFESTS_DIR/guides.json"

    echo -e "  ${GREEN}✓${NC} guides.json 更新完了"

    # ── domains.json ──
    python3 -c "
import json, os, sys

creation_dir = sys.argv[1]
date_str = sys.argv[2]
domains_dir = os.path.join(creation_dir, 'domains')

domains = []
ja_md_dir = os.path.join(domains_dir, 'ja', 'md')
if os.path.isdir(ja_md_dir):
    for name in sorted(os.listdir(ja_md_dir)):
        if name.startswith('domain-D') and name.endswith('.md'):
            base = name[:-3]
            parts = base.split('-')
            did = parts[1] if len(parts) >= 2 else base
            dname = '-'.join(parts[2:]) if len(parts) >= 3 else ''

            entry = {
                'id': did,
                'name': dname,
                'file_base': base,
                'md': {},
                'pdf': {},
            }
            for lang in ('ja', 'en'):
                md_rel = f'domains/{lang}/md/{base}.md'
                pdf_rel = f'domains/{lang}/pdf/{base}.pdf'
                entry['md'][lang] = md_rel if os.path.isfile(os.path.join(creation_dir, md_rel)) else None
                entry['pdf'][lang] = pdf_rel if os.path.isfile(os.path.join(creation_dir, pdf_rel)) else None
            domains.append(entry)

manifest = {
    'version': '1.0',
    'generated_at': date_str,
    'namespace': 'creation',
    'total': len(domains),
    'domains': domains,
}
print(json.dumps(manifest, indent=2, ensure_ascii=False))
" "$PJDHIRO_DIR/assets/creation" "$date_str" > "$MANIFESTS_DIR/domains.json"

    echo -e "  ${GREEN}✓${NC} domains.json 更新完了"
}

# ── メイン ──
main() {
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    echo -e "${BLUE}  creation-space — PDF/SVG生成 v2.2${NC}"
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    echo ""

    local kind="guides"
    local audience="general"
    local lang="ja"
    local do_push=false

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --setup|-s)    check_deps; exit 0 ;;
            --kind|-k)     kind="${2:-guides}"; shift 2 ;;
            --audience|-a) audience="${2:-general}"; shift 2 ;;
            --lang|-l)     lang="${2:-ja}"; shift 2 ;;
            --push|-p)     do_push=true; shift ;;
            --help|-h)
                echo "使い方: bash transform/scripts/build-pdf-guide.sh [オプション]"
                echo ""
                echo "オプション:"
                echo "  --kind {guides|domains|themes|synthesis|svg|all}             種別（デフォルト: guides）"
                echo "  --audience {general|designer|academic|all}       対象（guides時のみ。デフォルト: general）"
                echo "  --lang {ja|en|all}                               言語（デフォルト: ja）"
                echo "  --push                                           ビルド後 manifest を更新"
                echo "  --setup                                          依存チェックのみ"
                echo ""
                echo "例:"
                echo "  bash build-pdf-guide.sh --kind guides --audience all     # guides 全3種 JA"
                echo "  bash build-pdf-guide.sh --kind guides --lang all         # guides general JA+EN"
                echo "  bash build-pdf-guide.sh --kind domains --lang ja         # domains JA 全30件"
                echo "  bash build-pdf-guide.sh --kind themes --lang all         # themes JA+EN"
                echo "  bash build-pdf-guide.sh --kind all --lang all            # 全種 JA+EN"
                echo "  bash build-pdf-guide.sh --kind all --lang ja --push      # 全種 JA + manifest更新"
                exit 0
                ;;
            *) echo -e "${RED}不明なオプション: $1${NC}"; exit 1 ;;
        esac
    done

    check_deps
    echo ""

    local langs=()
    case "$lang" in
        all) langs=(ja en) ;;
        ja|en) langs=("$lang") ;;
        *) echo -e "${RED}不明なlang: $lang${NC}"; exit 1 ;;
    esac

    local kinds=()
    case "$kind" in
        all)     kinds=(guides domains themes synthesis svg) ;;
        guides)  kinds=(guides) ;;
        domains) kinds=(domains) ;;
        themes)  kinds=(themes) ;;
        svg)     kinds=(svg) ;;
        synthesis) kinds=(synthesis) ;;
        *) echo -e "${RED}不明なkind: $kind${NC}"; exit 1 ;;
    esac

    local success=0 fail=0

    for k in "${kinds[@]}"; do
        case "$k" in
            guides)
                local audiences=()
                case "$audience" in
                    all)                                audiences=(general designer academic) ;;
                    general|designer|academic)          audiences=("$audience") ;;
                    *) echo -e "${RED}不明なaudience: $audience${NC}"; exit 1 ;;
                esac

                for a in "${audiences[@]}"; do
                    for l in "${langs[@]}"; do
                        if build_guide "$a" "$l"; then
                            success=$((success + 1))
                        else
                            fail=$((fail + 1))
                        fi
                        echo ""
                    done
                done
                ;;
            domains)
                for l in "${langs[@]}"; do
                    if build_domains "$l"; then
                        success=$((success + 1))
                    else
                        fail=$((fail + 1))
                    fi
                    echo ""
                done
                ;;
            themes)
                for l in "${langs[@]}"; do
                    if build_themes "$l"; then
                        success=$((success + 1))
                    else
                        fail=$((fail + 1))
                    fi
                    echo ""
                done
                ;;
            synthesis)
                for l in "${langs[@]}"; do
                    if build_synthesis "$l"; then
                        success=$((success + 1))
                    else
                        fail=$((fail + 1))
                    fi
                    echo ""
                done
                ;;
            svg)
                if build_svg; then
                    success=$((success + 1))
                else
                    fail=$((fail + 1))
                fi
                echo ""
                ;;
        esac
    done

    # ── manifest 更新 ──
    if $do_push; then
        update_manifests
        echo ""
    fi

    # ── 一時ファイル削除 ──
    rm -rf "$CREATION_SPACE_ROOT/.build-tmp"

    echo -e "${GREEN}══════════════════════════════════════${NC}"
    echo -e "${GREEN}  完了: ${success}成功 / ${fail}失敗${NC}"
    if ! $do_push; then
        echo -e "  ${YELLOW}manifest未更新。--push で更新できます${NC}"
    fi
    echo -e "${GREEN}══════════════════════════════════════${NC}"
}

main "$@"
