#!/usr/bin/env bash
# qc-all.sh — creation-space 品質テスト 網羅ランナー (cs#249)
#
# 用途: 決定的(LLM不要)な QC テストを 1 コマンドで一括実行する。
#   定期レビュー(periodic-review skill)・大きな backfill 後・push 前に回す。
# 正本カタログ: docs/quality-management.md §7-§9
#
# 各テストは非 fatal で実行し、最後に PASS/FAIL を集計する(最初の失敗で止めない)。
# 終了コード: すべて PASS=0 / 1件以上 FAIL=1 / スキップのみは PASS 扱い。
#
# オプション:
#   --deep   時間のかかる検査(PDF抽出測定等)も実行
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CS_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PJDHIRO_DIR="${CS_DIR}/../pjdhiro"
cd "$CS_DIR"

DEEP=0
for a in "$@"; do [[ "$a" == "--deep" ]] && DEEP=1; done

# linked worktree 検出: worktree では .git が file(gitdir ポインタ)。
# worktree は .claude/hooks が相対 symlink で切れる/隣接 repo パスがずれるため、
# 環境依存テスト(verify-hooks / 配信JSON / ガイド)は誤 FAIL になる。main checkout 推奨。
IS_WORKTREE=0
[[ -f "${CS_DIR}/.git" ]] && IS_WORKTREE=1

pass=0; fail=0; skip=0
results=()

run() {
    # run "<ラベル>" <コマンド...>
    local label="$1"; shift
    echo ""
    echo "────────────────────────────────────────────────────────"
    echo "▶ ${label}"
    echo "  \$ $*"
    if "$@"; then
        echo "  ✅ PASS: ${label}"
        results+=("PASS  ${label}"); pass=$((pass+1))
    else
        echo "  ❌ FAIL: ${label}"
        results+=("FAIL  ${label}"); fail=$((fail+1))
    fi
}

skip_msg() {
    echo ""
    echo "────────────────────────────────────────────────────────"
    echo "⏭  SKIP: $1"
    results+=("SKIP  $1"); skip=$((skip+1))
}

echo "========================================================"
echo "  creation-space QC 網羅ランナー (qc-all.sh)"
echo "  $(date '+%Y-%m-%d %H:%M:%S')  deep=${DEEP}"
echo "========================================================"

# --- 1. manifest 間整合 + 原典重複 (Check 1/4/5/6/8/9/10) ---
run "manifest 整合 + 原典重複 (validate-manifest-sync)" \
    bash scripts/validate-manifest-sync.sh

# --- 2. 配信 JSON 整合 ---
run "dashboard-stats 鮮度 (generate-dashboard-stats --check)" \
    node scripts/generate-dashboard-stats.mjs --check

if [[ -d "$PJDHIRO_DIR" ]]; then
    run "domains.json 整合 (generate-domains-json --check)" \
        node scripts/generate-domains-json.mjs --check
else
    skip_msg "domains.json 整合 — 配信先 pjdhiro repo が無い(worktree等)"
fi

# --- 3. hooks 健全性 (相対symlink依存のため main checkout でのみ意味を持つ) ---
if [[ $IS_WORKTREE -eq 0 ]]; then
    run "hooks 存在・権限・依存 (verify-hooks)" \
        bash scripts/verify-hooks.sh
else
    skip_msg "hooks 健全性 — linked worktree では hooks symlink が切れるため(main checkout で実行)"
fi

# --- 4. ドメインレポート日付一致 ---
run "ドメインレポート日付 (verify-domain-dates --all)" \
    bash scripts/verify-domain-dates.sh --all

# --- 5. ガイド evidence 制約 (pjdhiro 依存) ---
if [[ -d "$PJDHIRO_DIR" ]]; then
    run "ガイド evidence 制約 (validate-guide-evidence)" \
        bash scripts/validate-guide-evidence.sh
    run "スライド URL 整合 (verify-slide-urls)" \
        bash scripts/verify-slide-urls.sh
else
    skip_msg "ガイド/スライド検査 — 隣接 pjdhiro repo が無い"
fi

# --- 6. nl-debug 静的検査 (manifest 計数 / 死参照 / 書誌照合) ---
if [[ -d ".claude/skills/nl-debug/scripts" ]]; then
    run "nl-debug 死参照検査 (check-dead-refs)" \
        bash .claude/skills/nl-debug/scripts/check-dead-refs.sh
    run "nl-debug 書誌照合 (bib-crosscheck)" \
        bash .claude/skills/nl-debug/scripts/bib-crosscheck.sh
    if [[ $DEEP -eq 1 ]]; then
        run "nl-debug PDF抽出測定 (check-pdf-extract, --deep)" \
            bash .claude/skills/nl-debug/scripts/check-pdf-extract.sh
    fi
else
    skip_msg "nl-debug 静的検査 — skill scripts が無い"
fi

# --- Summary ---
echo ""
echo "========================================================"
echo "  QC 網羅ランナー 結果"
echo "========================================================"
for r in "${results[@]}"; do echo "  $r"; done
echo "--------------------------------------------------------"
echo "  PASS=${pass}  FAIL=${fail}  SKIP=${skip}"
if [[ $fail -gt 0 ]]; then
    echo "  ⛔ FAIL あり。上記の各テスト出力を確認して修正すること。"
    exit 1
fi
echo "  ✅ すべて PASS（スキップ除く）"
exit 0
