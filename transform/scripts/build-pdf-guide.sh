#!/usr/bin/env bash
# build-pdf-guide.sh — creation-space PDF/SVG 生成 v3.0 (wrapper)
#
# 概要:
#   PDF ビルドの正本 (project-design/transform/scripts/build-pdf.sh) を呼び出す
#   オーケストレーション層。creation-space 固有のロジック（種別振り分け、
#   タイトル定義、manifest 更新、SVG 生成委譲）を担当する。
#
# 使い方:
#   bash transform/scripts/build-pdf-guide.sh                                  # guides general JA（デフォルト）
#   bash transform/scripts/build-pdf-guide.sh --kind guides --audience all     # guides 全3種 JA
#   bash transform/scripts/build-pdf-guide.sh --kind guides --lang all         # guides general JA+EN
#   bash transform/scripts/build-pdf-guide.sh --kind domains --lang ja         # domains JA 全30件
#   bash transform/scripts/build-pdf-guide.sh --kind themes --lang all         # themes JA+EN
#   bash transform/scripts/build-pdf-guide.sh --kind all --lang ja             # 全種 JA
#   bash transform/scripts/build-pdf-guide.sh --kind svg                       # SVG対象一覧
#   bash transform/scripts/build-pdf-guide.sh --push                           # ビルド後 manifest を更新
#   bash transform/scripts/build-pdf-guide.sh --setup                          # 依存チェックのみ
#
# 出力:
#   guides:    pjdhiro/assets/creation/guides/{lang}/pdf/creation-{audience}.pdf
#   domains:   pjdhiro/assets/creation/domains/{lang}/pdf/domain-D{NN}-{name}.pdf
#   themes:    pjdhiro/assets/creation/phase8-themes/{lang}/pdf/theme-{slug}.pdf
#   synthesis: pjdhiro/assets/creation/synthesis/{lang}/pdf/cross-domain-synthesis*.pdf
#
# 互換性:
#   bash 3.2以上（macOS標準）で動作。${var^^} は使用しない。
#
# v3.0 変更点:
#   - PDF ビルドを project-design 正本 (build-pdf.sh v1.0) に委譲
#   - ローカルの strip_frontmatter, make_header_*, run_pandoc_pdf,
#     rewrite_svg_links_for_pdf を削除し、正本の build_single を利用
#   - creation-space 固有ロジック（--kind, --audience, --push, manifest）は維持

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
MANIFESTS_DIR="$PJDHIRO_DIR/assets/creation/manifests"
GENERATE_SVG="$CREATION_SPACE_ROOT/transform/scripts/generate-svg.sh"

# ── 正本パス ──
BUILD_PDF="/Users/uminomae/dev/project-design/transform/scripts/build-pdf.sh"

# ── 正本の存在チェック ──
check_canonical() {
    if [ ! -f "$BUILD_PDF" ]; then
        echo -e "${RED}✗${NC} 正本が見つかりません: $BUILD_PDF"
        echo "  project-design/transform/scripts/build-pdf.sh が必要です"
        exit 1
    fi
}

# ── タイトル定義（guides 固有） ──
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

# ── guides ビルド（1ファイル） ──
build_guide() {
    local audience="$1"
    local lang="${2:-ja}"

    local md_dir="$GUIDES_BASE/${lang}/md"
    local pdf_dir="$GUIDES_BASE/${lang}/pdf"
    local md_file="$md_dir/creation-${audience}.md"
    local pdf_file="$pdf_dir/creation-${audience}.pdf"

    local lang_label="JA"
    [ "$lang" = "en" ] && lang_label="EN"
    echo -e "${BLUE}guides: creation-${audience} [${lang_label}]${NC}"

    if [ ! -f "$md_file" ]; then
        echo -e "  ${RED}✗${NC} ソースが見つかりません: ${md_file}"
        return 1
    fi

    mkdir -p "$pdf_dir"

    local title subtitle
    title="$(get_guide_title "$audience" "$lang")"
    subtitle="$(get_guide_subtitle "$audience" "$lang")"

    if bash "$BUILD_PDF" "$md_file" "$pdf_file" \
        --lang "$lang" --title "$title" --subtitle "$subtitle"; then
        return 0
    else
        return 1
    fi
}

# ── domains ビルド ──
build_domains() {
    local lang="${1:-ja}"
    local md_dir="$DOMAINS_BASE/${lang}/md"
    local pdf_dir="$DOMAINS_BASE/${lang}/pdf"

    local lang_label="JA"
    [ "$lang" = "en" ] && lang_label="EN"
    echo -e "${BLUE}domains [${lang_label}] ビルド中...${NC}"

    if [ ! -d "$md_dir" ] || [ -z "$(ls "$md_dir"/domain-D*.md 2>/dev/null)" ]; then
        echo -e "  ${YELLOW}スキップ${NC}: $md_dir に domain-D*.md がありません"
        return 0
    fi

    mkdir -p "$pdf_dir"

    local d_success=0 d_fail=0
    for md_file in "$md_dir"/domain-D*.md; do
        local basename_md
        basename_md=$(basename "$md_file" .md)
        local out="$pdf_dir/${basename_md}.pdf"

        if bash "$BUILD_PDF" "$md_file" "$out" --lang "$lang"; then
            d_success=$((d_success + 1))
        else
            d_fail=$((d_fail + 1))
        fi
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
    echo -e "${BLUE}themes [${lang_label}] ビルド中...${NC}"

    local has_themes=0
    [ -d "$md_dir" ] && [ -n "$(ls "$md_dir"/theme-*.md 2>/dev/null)" ] && has_themes=1
    if [ "$has_themes" -eq 0 ]; then
        echo -e "  ${YELLOW}スキップ${NC}: $md_dir に theme-*.md がありません"
        return 0
    fi

    mkdir -p "$pdf_dir"

    local t_success=0 t_fail=0
    for md_file in "$md_dir"/theme-*.md; do
        local basename_md
        basename_md=$(basename "$md_file" .md)
        local out="$pdf_dir/${basename_md}.pdf"

        if bash "$BUILD_PDF" "$md_file" "$out" --lang "$lang"; then
            t_success=$((t_success + 1))
        else
            t_fail=$((t_fail + 1))
        fi
    done

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
    echo -e "${BLUE}synthesis [${lang_label}] ビルド中...${NC}"

    if [ ! -d "$md_dir" ] || [ -z "$(ls "$md_dir"/cross-domain-synthesis*.md 2>/dev/null)" ]; then
        echo -e "  ${YELLOW}スキップ${NC}: $md_dir に cross-domain-synthesis*.md がありません"
        return 0
    fi

    mkdir -p "$pdf_dir"

    local s_success=0 s_fail=0
    for md_file in "$md_dir"/cross-domain-synthesis*.md; do
        local basename_md
        basename_md=$(basename "$md_file" .md)
        local out="$pdf_dir/${basename_md}.pdf"

        if bash "$BUILD_PDF" "$md_file" "$out" --lang "$lang"; then
            s_success=$((s_success + 1))
        else
            s_fail=$((s_fail + 1))
        fi
    done

    echo -e "  synthesis [${lang_label}]: ${s_success}成功 / ${s_fail}失敗"
    [ "$s_fail" -gt 0 ] && return 1
    return 0
}

# ── SVG 生成（generate-svg.sh に委譲） ──
build_svg() {
    echo -e "${BLUE}SVG 図解生成${NC}"

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
    echo -e "${BLUE}manifests 更新${NC}"
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
    echo -e "${BLUE}  creation-space — PDF/SVG生成 v3.0${NC}"
    echo -e "${BLUE}  (正本: project-design/build-pdf.sh)${NC}"
    echo -e "${BLUE}══════════════════════════════════════${NC}"
    echo ""

    local kind="guides"
    local audience="general"
    local lang="ja"
    local do_push=false

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --setup|-s)    check_canonical; bash "$BUILD_PDF" --setup; exit 0 ;;
            --kind|-k)     kind="${2:-guides}"; shift 2 ;;
            --audience|-a) audience="${2:-general}"; shift 2 ;;
            --lang|-l)     lang="${2:-ja}"; shift 2 ;;
            --push|-p)     do_push=true; shift ;;
            --help|-h)
                echo "使い方: bash transform/scripts/build-pdf-guide.sh [オプション]"
                echo ""
                echo "オプション:"
                echo "  --kind {guides|domains|themes|synthesis|svg|all}  種別（デフォルト: guides）"
                echo "  --audience {general|designer|academic|all}        対象（guides時のみ。デフォルト: general）"
                echo "  --lang {ja|en|all}                                言語（デフォルト: ja）"
                echo "  --push                                            ビルド後 manifest を更新"
                echo "  --setup                                           依存チェックのみ"
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

    check_canonical
    echo ""

    local langs=()
    case "$lang" in
        all) langs=(ja en) ;;
        ja|en) langs=("$lang") ;;
        *) echo -e "${RED}不明なlang: $lang${NC}"; exit 1 ;;
    esac

    local kinds=()
    case "$kind" in
        all)       kinds=(guides domains themes synthesis svg) ;;
        guides)    kinds=(guides) ;;
        domains)   kinds=(domains) ;;
        themes)    kinds=(themes) ;;
        svg)       kinds=(svg) ;;
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

    echo -e "${GREEN}══════════════════════════════════════${NC}"
    echo -e "${GREEN}  完了: ${success}成功 / ${fail}失敗${NC}"
    if ! $do_push; then
        echo -e "  ${YELLOW}manifest未更新。--push で更新できます${NC}"
    fi
    echo -e "${GREEN}══════════════════════════════════════${NC}"
}

main "$@"
