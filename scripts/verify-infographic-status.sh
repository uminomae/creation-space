#!/usr/bin/env bash
# verify-infographic-status.sh — Verify infographic workflow completion
# Exit code: 0 if all pass, 1 if any fail
#
# Usage: bash scripts/verify-infographic-status.sh [--fix-xmlns]
#   --fix-xmlns  Automatically add missing xmlns attributes

set -euo pipefail

PJDHIRO="/Users/uminomae/dev/pjdhiro/assets/creation"
BASE_URL="https://uminomae.github.io/pjdhiro/assets/creation"
PASS=0; FAIL=0; WARN=0
FIX_XMLNS=false
FAIL_DETAILS=""

if [[ "${1:-}" == "--fix-xmlns" ]]; then
    FIX_XMLNS=true
fi

check() {
    local desc="$1" result="$2"
    if [ "$result" = "PASS" ]; then
        printf "  PASS %s\n" "$desc"
        PASS=$((PASS+1))
    elif [ "$result" = "WARN" ]; then
        printf "  WARN %s\n" "$desc"
        WARN=$((WARN+1))
    else
        printf "  FAIL %s\n" "$desc"
        FAIL=$((FAIL+1))
        FAIL_DETAILS="${FAIL_DETAILS}    - ${desc}
"
    fi
}

check_svg_valid() {
    local svg_path="$1" label="$2"
    if [ ! -f "$svg_path" ]; then
        check "$label — file exists" "FAIL"
        return
    fi
    check "$label — file exists" "PASS"

    if grep -q 'xmlns="http://www.w3.org/2000/svg"' "$svg_path" 2>/dev/null; then
        check "$label — has xmlns" "PASS"
    elif grep -q "xmlns='http://www.w3.org/2000/svg'" "$svg_path" 2>/dev/null; then
        check "$label — has xmlns" "PASS"
    elif grep -q 'xmlns=' "$svg_path" 2>/dev/null; then
        check "$label — has xmlns (non-standard)" "WARN"
    else
        check "$label — has xmlns" "FAIL"
    fi

    if grep -q '</svg>' "$svg_path" 2>/dev/null; then
        check "$label — has </svg> closing tag" "PASS"
    else
        check "$label — has </svg> closing tag" "FAIL"
    fi

    if grep -q '<style' "$svg_path" 2>/dev/null; then
        check "$label — NO <style> tag" "FAIL"
    else
        check "$label — NO <style> tag" "PASS"
    fi
}

check_md_svg_count() {
    local md_path="$1" expected="$2" label="$3"
    if [ ! -f "$md_path" ]; then
        check "$label — MD exists" "FAIL"
        return
    fi
    check "$label — MD exists" "PASS"
    local count
    count=$(grep -c '\.svg' "$md_path" 2>/dev/null || echo 0)
    if [ "$count" -ge "$expected" ]; then
        check "$label — has >=${expected} SVG links (found $count)" "PASS"
    else
        check "$label — has >=${expected} SVG links (found $count)" "FAIL"
    fi
}

check_pdf_exists() {
    local pdf_path="$1" label="$2"
    if [ -f "$pdf_path" ]; then
        check "$label — PDF exists" "PASS"
    else
        check "$label — PDF exists" "FAIL"
    fi
}

# Domain list: "ID:name" pairs
DOMAINS="
D01:mathematics
D02:physics
D03:chemistry
D04:evolutionary-biology
D05:earth-science
D06:astronomy
D07:engineering
D08:neuroscience
D09:life-sciences
D10:clinical-medicine
D11:pharmacy
D12:agriculture
D13:philosophy
D14:psychology
D15:aesthetics
D16:history
D17:linguistics
D18:sociology
D19:literary-studies
D20:law-politics
D21:economics
D22:business-management
D23:developmental-psychology
D24:religion
D25:anthropology
D26:musicology
D27:architecture
D28:performing-arts
D29:complexity-science
D30:traditional-knowledge
"

# Presentation name overrides (where presentation slug differs from domain slug)
# Format: "DNN:presentation-slug"
PRES_OVERRIDES="D12:agriculture-ecology D24:religious-studies D27:architecture-design"

get_pres_name() {
    local dnum="$1" default_name="$2"
    for override in $PRES_OVERRIDES; do
        local od="${override%%:*}"
        local oname="${override##*:}"
        if [ "$od" = "$dnum" ]; then
            echo "$oname"
            return
        fi
    done
    echo "$default_name"
}

echo "=================================================="
echo "  INFOGRAPHIC VERIFICATION — $(date '+%Y-%m-%d %H:%M')"
echo "=================================================="
echo ""

# ======================================================
# SECTION 1: DOMAINS (JA)
# ======================================================
echo "--- DOMAINS (JA) ---"
for entry in $DOMAINS; do
    d="${entry%%:*}"
    name="${entry##*:}"
    echo "  [$d] $name"
    for n in 01 02 03; do
        sfx=""
        case $n in
            01) sfx="overview" ;;
            02) sfx="theories-map" ;;
            03) sfx="cross-patterns" ;;
        esac
        check_svg_valid "$PJDHIRO/img/svg/domains/ja/${d}-${n}-${sfx}-svg.svg" \
            "JA $d SVG-${n} ($sfx)"
    done
    check_md_svg_count "$PJDHIRO/domains/ja/md/domain-${d}-${name}.md" 3 \
        "JA $d domain MD"
    check_pdf_exists "$PJDHIRO/domains/ja/pdf/domain-${d}-${name}.pdf" \
        "JA $d domain"
done

# ======================================================
# SECTION 2: DOMAINS (EN)
# ======================================================
echo ""
echo "--- DOMAINS (EN) ---"
for entry in $DOMAINS; do
    d="${entry%%:*}"
    name="${entry##*:}"
    echo "  [$d] $name"
    # EN uses single SVG per domain: domain-DNN-name.svg
    check_svg_valid "$PJDHIRO/img/svg/domains/en/domain-${d}-${name}.svg" \
        "EN $d SVG (single)"
    check_md_svg_count "$PJDHIRO/domains/en/md/domain-${d}-${name}.md" 3 \
        "EN $d domain MD"
    check_pdf_exists "$PJDHIRO/domains/en/pdf/domain-${d}-${name}.pdf" \
        "EN $d domain"
done

# ======================================================
# SECTION 3: DOMAIN PRESENTATIONS (JA)
# ======================================================
echo ""
echo "--- DOMAIN PRESENTATIONS (JA) ---"
for entry in $DOMAINS; do
    d="${entry%%:*}"
    name="${entry##*:}"
    pname=$(get_pres_name "$d" "$name")
    check_md_svg_count "$PJDHIRO/domains/ja/presentations/md/domain-${d}-${pname}-presentation-ja.md" 3 \
        "JA $d presentation MD"
    check_pdf_exists "$PJDHIRO/domains/ja/presentations/pdf/domain-${d}-${pname}-presentation-ja.pdf" \
        "JA $d presentation"
done

# ======================================================
# SECTION 4: DOMAIN PRESENTATIONS (EN)
# ======================================================
echo ""
echo "--- DOMAIN PRESENTATIONS (EN) ---"
for entry in $DOMAINS; do
    d="${entry%%:*}"
    name="${entry##*:}"
    pname=$(get_pres_name "$d" "$name")
    check_md_svg_count "$PJDHIRO/domains/en/presentations/md/domain-${d}-${pname}-presentation-en.md" 3 \
        "EN $d presentation MD"
    check_pdf_exists "$PJDHIRO/domains/en/presentations/pdf/domain-${d}-${pname}-presentation-en.pdf" \
        "EN $d presentation"
done

# ======================================================
# SECTION 5: THEMES (JA)
# ======================================================
echo ""
echo "--- THEMES (JA) ---"
THEMES="blind-spots edge-typology field-layers recirculation threshold"
for t in $THEMES; do
    echo "  [Theme] $t"
    # Main theme SVG
    check_svg_valid "$PJDHIRO/img/svg/themes/ja/theme-${t}.svg" \
        "JA theme $t main SVG"
    # T1 convergence
    check_svg_valid "$PJDHIRO/img/svg/themes/ja/theme-${t}-01-convergence-svg.svg" \
        "JA theme $t T1-convergence"
    # T2 divergence
    check_svg_valid "$PJDHIRO/img/svg/themes/ja/theme-${t}-02-divergence-svg.svg" \
        "JA theme $t T2-divergence"
    # Theme MD (3 SVG links expected)
    check_md_svg_count "$PJDHIRO/phase8-themes/ja/md/theme-${t}.md" 3 \
        "JA theme $t MD"
    # Summary MD (2 SVG links expected)
    check_md_svg_count "$PJDHIRO/phase8-themes/ja/md/summary-${t}.md" 2 \
        "JA theme $t summary MD"
    # PDFs
    check_pdf_exists "$PJDHIRO/phase8-themes/ja/pdf/theme-${t}.pdf" \
        "JA theme $t"
    check_pdf_exists "$PJDHIRO/phase8-themes/ja/pdf/summary-${t}.pdf" \
        "JA theme $t summary"
done
# Conclusion summary SVG
check_svg_valid "$PJDHIRO/img/svg/themes/ja/theme-conclusion-summary.svg" \
    "JA theme conclusion-summary SVG"

# ======================================================
# SECTION 6: THEMES (EN)
# ======================================================
echo ""
echo "--- THEMES (EN) ---"
for t in $THEMES; do
    echo "  [Theme] $t"
    check_svg_valid "$PJDHIRO/img/svg/themes/en/theme-${t}.svg" \
        "EN theme $t SVG"
    # EN summaries (2 SVG links)
    check_md_svg_count "$PJDHIRO/phase8-themes/en/md/summary-${t}.md" 2 \
        "EN theme $t summary MD"
    check_pdf_exists "$PJDHIRO/phase8-themes/en/pdf/summary-${t}.pdf" \
        "EN theme $t summary"
done
check_svg_valid "$PJDHIRO/img/svg/themes/en/theme-conclusion-summary.svg" \
    "EN theme conclusion-summary SVG"

# ======================================================
# SECTION 7: THEME PRESENTATIONS (JA/EN)
# ======================================================
echo ""
echo "--- THEME PRESENTATIONS ---"
for t in $THEMES; do
    check_md_svg_count "$PJDHIRO/phase8-themes/ja/presentations/md/theme-${t}-presentation-ja.md" 1 \
        "JA theme $t presentation MD"
    check_md_svg_count "$PJDHIRO/phase8-themes/en/presentations/md/theme-${t}-presentation-en.md" 1 \
        "EN theme $t presentation MD"
done
# Conclusion presentation
check_md_svg_count "$PJDHIRO/phase8-themes/ja/presentations/md/conclusion-presentation-ja.md" 1 \
    "JA conclusion presentation MD"
check_md_svg_count "$PJDHIRO/phase8-themes/en/presentations/md/conclusion-presentation-en.md" 1 \
    "EN conclusion presentation MD"

# ======================================================
# SECTION 8: SYNTHESIS (JA/EN)
# ======================================================
echo ""
echo "--- SYNTHESIS ---"
# JA synthesis SVGs
check_svg_valid "$PJDHIRO/img/svg/synthesis/ja/cross-domain-synthesis-01-distribution-svg.svg" \
    "JA synthesis S1 distribution"
check_svg_valid "$PJDHIRO/img/svg/synthesis/ja/cross-domain-synthesis-02-themes-network-svg.svg" \
    "JA synthesis S2 themes-network"
# JA synthesis MD
check_md_svg_count "$PJDHIRO/synthesis/ja/md/cross-domain-synthesis-ja.md" 2 \
    "JA synthesis MD"
check_pdf_exists "$PJDHIRO/synthesis/ja/pdf/cross-domain-synthesis-ja.pdf" \
    "JA synthesis"
# JA synthesis presentation
check_md_svg_count "$PJDHIRO/synthesis/ja/md/cross-domain-synthesis-presentation-ja.md" 3 \
    "JA synthesis presentation MD"
check_pdf_exists "$PJDHIRO/synthesis/ja/pdf/cross-domain-synthesis-presentation-ja.pdf" \
    "JA synthesis presentation"
# EN synthesis presentation
check_md_svg_count "$PJDHIRO/synthesis/en/md/cross-domain-synthesis-presentation-en.md" 3 \
    "EN synthesis presentation MD"
check_pdf_exists "$PJDHIRO/synthesis/en/pdf/cross-domain-synthesis-presentation-en.pdf" \
    "EN synthesis presentation"

# ======================================================
# SECTION 9: GUIDES (JA/EN)
# ======================================================
echo ""
echo "--- GUIDES ---"
AUDIENCES="academic designer general"
for a in $AUDIENCES; do
    echo "  [Audience] $a"
    check_svg_valid "$PJDHIRO/img/svg/guides/ja/creation-${a}-01-overview-svg.svg" \
        "JA guide $a SVG"
    check_md_svg_count "$PJDHIRO/guides/ja/md/creation-${a}.md" 1 \
        "JA guide $a MD"
    check_pdf_exists "$PJDHIRO/guides/ja/pdf/creation-${a}.pdf" \
        "JA guide $a"
    check_md_svg_count "$PJDHIRO/guides/en/md/creation-${a}.md" 1 \
        "EN guide $a MD"
    check_pdf_exists "$PJDHIRO/guides/en/pdf/creation-${a}.pdf" \
        "EN guide $a"
done

# ======================================================
# SECTION 10: PHASE 9
# ======================================================
echo ""
echo "--- PHASE 9 ---"
TRACKS="9A-grounding 9B-falsification 9C-frontier 9D-formalization"
for tr in $TRACKS; do
    echo "  [Track] $tr"
    check_svg_valid "$PJDHIRO/img/svg/phase9/ja/${tr}-01-overview-svg.svg" \
        "Phase9 $tr SVG"
    # JA plan MD
    check_md_svg_count "$PJDHIRO/phase9/${tr}/plan-ja.md" 1 \
        "Phase9 $tr JA plan MD"
    check_pdf_exists "$PJDHIRO/phase9/${tr}/plan-ja.pdf" \
        "Phase9 $tr JA"
    # EN plan MD
    check_md_svg_count "$PJDHIRO/phase9/${tr}/plan-en.md" 1 \
        "Phase9 $tr EN plan MD"
    check_pdf_exists "$PJDHIRO/phase9/${tr}/plan-en.pdf" \
        "Phase9 $tr EN"
done
# Phase 9 overview SVG
check_svg_valid "$PJDHIRO/img/svg/phase9/ja/overview-01-overview-svg.svg" \
    "Phase9 overview SVG"

# ======================================================
# SECTION 11: CROSS-CHECKS
# ======================================================
echo ""
echo "--- CROSS-CHECKS ---"

# xmlns completeness: find ALL SVGs missing xmlns
echo "  Scanning ALL SVGs for missing xmlns..."
MISSING_XMLNS=0
while IFS= read -r svgfile; do
    if ! grep -q 'xmlns=' "$svgfile" 2>/dev/null; then
        MISSING_XMLNS=$((MISSING_XMLNS+1))
        relpath=$(echo "$svgfile" | sed "s|$PJDHIRO/||")
        check "xmlns missing: $relpath" "FAIL"
        if [ "$FIX_XMLNS" = true ]; then
            sed -i '' 's/<svg /<svg xmlns="http:\/\/www.w3.org\/2000\/svg" /' "$svgfile"
            echo "    -> Fixed: added xmlns"
        fi
    fi
done < <(find "$PJDHIRO/img/svg" -name '*.svg' -type f 2>/dev/null | sort)
if [ "$MISSING_XMLNS" -eq 0 ]; then
    check "All SVGs have xmlns attribute" "PASS"
fi

# <style> tag check across ALL SVGs
echo "  Scanning ALL SVGs for <style> tags..."
STYLE_COUNT=0
while IFS= read -r svgfile; do
    if grep -q '<style' "$svgfile" 2>/dev/null; then
        STYLE_COUNT=$((STYLE_COUNT+1))
        relpath=$(echo "$svgfile" | sed "s|$PJDHIRO/||")
        check "<style> found: $relpath" "FAIL"
    fi
done < <(find "$PJDHIRO/img/svg" -name '*.svg' -type f 2>/dev/null | sort)
if [ "$STYLE_COUNT" -eq 0 ]; then
    check "No SVGs contain <style> tags" "PASS"
fi

# Git push sync check
echo "  Checking pjdhiro git sync..."
PJDHIRO_ROOT="/Users/uminomae/dev/pjdhiro"
LOCAL_HEAD=$(cd "$PJDHIRO_ROOT" && git rev-parse HEAD 2>/dev/null || echo "unknown")
REMOTE_HEAD=$(cd "$PJDHIRO_ROOT" && git rev-parse origin/main 2>/dev/null || echo "unknown")
if [ "$LOCAL_HEAD" = "$REMOTE_HEAD" ] && [ "$LOCAL_HEAD" != "unknown" ]; then
    check "pjdhiro: local HEAD = origin/main" "PASS"
else
    check "pjdhiro: local HEAD != origin/main (need push?)" "WARN"
fi

# Sample URL accessibility check
echo "  Checking sample SVG URL accessibility..."
SAMPLE_URL="${BASE_URL}/img/svg/domains/ja/D01-01-overview-svg.svg"
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' "$SAMPLE_URL" --max-time 10 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    check "Sample SVG URL accessible (HTTP $HTTP_CODE)" "PASS"
elif [ "$HTTP_CODE" = "000" ]; then
    check "Sample SVG URL check (network error/timeout)" "WARN"
else
    check "Sample SVG URL returned HTTP $HTTP_CODE" "FAIL"
fi

# Phase 9 SVG URL check
SAMPLE_P9_URL="${BASE_URL}/img/svg/phase9/ja/9A-grounding-01-overview-svg.svg"
HTTP_P9=$(curl -s -o /dev/null -w '%{http_code}' "$SAMPLE_P9_URL" --max-time 10 2>/dev/null || echo "000")
if [ "$HTTP_P9" = "200" ]; then
    check "Phase9 SVG URL accessible (HTTP $HTTP_P9)" "PASS"
elif [ "$HTTP_P9" = "000" ]; then
    check "Phase9 SVG URL check (network error/timeout)" "WARN"
else
    check "Phase9 SVG URL returned HTTP $HTTP_P9" "FAIL"
fi

# ======================================================
# SUMMARY
# ======================================================
echo ""
echo "=================================================="
echo "  === SUMMARY ==="
echo "  PASS: $PASS"
echo "  WARN: $WARN"
echo "  FAIL: $FAIL"
echo "=================================================="

if [ "$FAIL" -gt 0 ]; then
    echo ""
    echo "  FAILURES:"
    echo "$FAIL_DETAILS"
    exit 1
fi

exit 0
