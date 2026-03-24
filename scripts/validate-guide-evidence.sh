#!/usr/bin/env bash
# Usage: bash scripts/validate-guide-evidence.sh [guide-file.md ...]
# If no files specified, checks all guides under pjdhiro/assets/creation/guides/
#
# Checks guide files for evidence constraint violations:
#   1. Causal inversion patterns (cs#166)
#   2. Person names not found in evidence
#   3. Causal assertion patterns
#   4. Unsubstantiated quantitative claims
#   5. Concepts not in five-stages.md (正本逸脱)
#
# Exit codes:
#   0 - All checks passed (PASS or WARN only)
#   1 - At least one FAIL detected

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
EVIDENCE_DIR="$PROJECT_ROOT/evidence"
PJDHIRO_GUIDES="$PROJECT_ROOT/../pjdhiro/assets/creation/guides"

FAIL_COUNT=0
WARN_COUNT=0
PASS_COUNT=0

# Colors (disabled if not a terminal)
if [ -t 1 ]; then
    RED='\033[0;31m'
    YELLOW='\033[0;33m'
    GREEN='\033[0;32m'
    NC='\033[0m'
else
    RED=''
    YELLOW=''
    GREEN=''
    NC=''
fi

report_pass() {
    echo -e "${GREEN}PASS${NC}: $1"
    PASS_COUNT=$((PASS_COUNT + 1))
}

report_warn() {
    echo -e "${YELLOW}WARN${NC}: $1"
    if [ -n "${2:-}" ]; then
        echo "  $2"
    fi
    WARN_COUNT=$((WARN_COUNT + 1))
}

report_fail() {
    echo -e "${RED}FAIL${NC}: $1"
    if [ -n "${2:-}" ]; then
        echo "  $2"
    fi
    FAIL_COUNT=$((FAIL_COUNT + 1))
}

# Determine target files
if [ $# -gt 0 ]; then
    FILES=("$@")
else
    if [ ! -d "$PJDHIRO_GUIDES" ]; then
        echo "Error: pjdhiro guides directory not found: $PJDHIRO_GUIDES"
        echo "Specify guide files as arguments instead."
        exit 1
    fi
    FILES=()
    while IFS= read -r -d '' f; do
        FILES+=("$f")
    done < <(find "$PJDHIRO_GUIDES" -name "*.md" -not -name "*-evidence-map.md" -not -name "*-ref-check.md" -print0 2>/dev/null)
    if [ ${#FILES[@]} -eq 0 ]; then
        echo "No guide files found under $PJDHIRO_GUIDES"
        exit 0
    fi
fi

echo "=== Guide Evidence Validation ==="
echo "Files to check: ${#FILES[@]}"
echo ""

for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Warning: File not found: $file (skipping)"
        continue
    fi

    echo "--- Checking: $(basename "$file") ---"

    # --------------------------------------------------
    # Check 1: Causal inversion patterns (cs#166)
    # --------------------------------------------------
    CAUSAL_JA=$(grep -in '調査から見出\|調査により発見\|調査に基づいて構築\|調査から.*導出\|見出されたもの\|調査が.*明らか' "$file" 2>/dev/null || true)
    CAUSAL_EN=$(grep -in 'investigation revealed\|discovered through\|derived from.*survey\|research revealed\|found through.*investigation' "$file" 2>/dev/null || true)
    CAUSAL_HITS="${CAUSAL_JA}${CAUSAL_EN}"

    if [ -z "$CAUSAL_HITS" ]; then
        report_pass "[Check 1] No causal inversion patterns"
    else
        report_fail "[Check 1] Causal inversion patterns detected" "$CAUSAL_HITS"
    fi

    # --------------------------------------------------
    # Check 2: Person names not found in evidence
    # --------------------------------------------------
    # Extract capitalized multi-syllable names (likely person names)
    # Filter out common English words and section headers
    NAMES=$(grep -oE '[A-Z][a-z]{3,}([-][A-Z][a-z]+)*' "$file" 2>/dev/null \
        | sort -u \
        | grep -vE '^(The|This|That|These|Those|What|Where|When|Which|While|With|From|Through|Between|About|After|Before|Into|Over|Under|Each|Every|Some|Many|Most|Such|Other|Stage|Section|Chapter|Table|Figure|Note|Step|Level|Phase|Part|Process|Structure|Model|Theory|Evidence|Creation|Creative|Practice|Design|Research|Investigation|Domain|Report|Guide|Overview|Summary|Introduction|Conclusion|Appendix|Reference|Index|Context|Example|Pattern|Analysis|Comparison|Framework|Approach|Method|Concept|Abstract|General|Academic|Designer|Markdown|Bootstrap|Three|JavaScript|Python|GitHub|Pages|Claude|Anthropic)$' \
        2>/dev/null || true)

    if [ -z "$NAMES" ]; then
        report_pass "[Check 2] No person name candidates found (or all filtered)"
    else
        MISSING_NAMES=""
        while IFS= read -r name; do
            [ -z "$name" ] && continue
            # Check if the name appears in any evidence file
            if ! grep -rql "$name" "$EVIDENCE_DIR"/evidence-D*.md 2>/dev/null; then
                # Also check without hyphen variations
                if ! grep -rql "$name" "$EVIDENCE_DIR"/ 2>/dev/null; then
                    MISSING_NAMES="${MISSING_NAMES}  ${name}\n"
                fi
            fi
        done <<< "$NAMES"

        if [ -z "$MISSING_NAMES" ]; then
            report_pass "[Check 2] All person name candidates found in evidence"
        else
            report_warn "[Check 2] Names not found in evidence (verify manually)" "$(echo -e "$MISSING_NAMES")"
        fi
    fi

    # --------------------------------------------------
    # Check 3: Causal assertion patterns
    # --------------------------------------------------
    CAUSAL_ASSERT_JA=$(grep -in '質を決める\|を保証する\|が.*を規定\|が.*を決定\|を左右する' "$file" 2>/dev/null || true)
    CAUSAL_ASSERT_EN=$(grep -in 'determines the quality\|guarantees\|ensures.*quality\|dictates\|governs the' "$file" 2>/dev/null || true)
    CAUSAL_ASSERT="${CAUSAL_ASSERT_JA}${CAUSAL_ASSERT_EN}"

    if [ -z "$CAUSAL_ASSERT" ]; then
        report_pass "[Check 3] No causal assertion patterns"
    else
        report_warn "[Check 3] Causal assertion patterns detected (verify evidence basis)" "$CAUSAL_ASSERT"
    fi

    # --------------------------------------------------
    # Check 4: Unsubstantiated quantitative claims
    # --------------------------------------------------
    QUANT_JA=$(grep -in '[0-9]*領域で.*確認\|最も多く\|大半の領域\|独立に確認\|すべての領域で' "$file" 2>/dev/null || true)
    QUANT_EN=$(grep -in 'most domains\|majority of.*domains\|all.*domains.*confirmed\|independently confirmed\|across all' "$file" 2>/dev/null || true)
    QUANT="${QUANT_JA}${QUANT_EN}"

    if [ -z "$QUANT" ]; then
        report_pass "[Check 4] No unsubstantiated quantitative claims"
    else
        report_warn "[Check 4] Quantitative claims detected (verify evidence basis)" "$QUANT"
    fi

    # --------------------------------------------------
    # Check 5: Concepts not in five-stages.md (正本逸脱)
    # --------------------------------------------------
    DEVIATION_JA=$(grep -in '逆行\|螺旋' "$file" 2>/dev/null || true)
    DEVIATION_EN=$(grep -in 'reversal\|spiral' "$file" 2>/dev/null || true)
    DEVIATION="${DEVIATION_JA}${DEVIATION_EN}"

    if [ -z "$DEVIATION" ]; then
        report_pass "[Check 5] No 正本逸脱 patterns"
    else
        report_warn "[Check 5] Potential 正本逸脱 detected (verify against five-stages.md)" "$DEVIATION"
    fi

    echo ""
done

# --------------------------------------------------
# Summary
# --------------------------------------------------
echo "=== Summary ==="
echo -e "  ${GREEN}PASS${NC}: $PASS_COUNT"
echo -e "  ${YELLOW}WARN${NC}: $WARN_COUNT"
echo -e "  ${RED}FAIL${NC}: $FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
    echo ""
    echo "Result: FAIL ($FAIL_COUNT failures detected)"
    exit 1
else
    echo ""
    echo "Result: OK (no failures)"
    exit 0
fi
