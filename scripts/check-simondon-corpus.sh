#!/usr/bin/env bash
# check-simondon-corpus.sh — Simondon コーパス取得→精読→記録 台帳の整合テスト（cs#249 / D13）
# 正本台帳: knowledge/raw/simondon-corpus-acquisition.md
# 用途: 「①取得・保存 → ②精読 → ③記録」手順の⑥検証段階で実行する。
#   T1 台帳が存在する
#   T2 保存 PDF が全て有効（PDF magic %PDF-）＝壊れ/HTMLエラーDLでない
#   T3 台帳 §2 が参照する saved PDF が実ファイルとして存在する（台帳↔ディスク整合）
#   T4 台帳が note=生成済 とする各 D13-S{NN} に source-note ファイルが実在する
#   T5 note=生成済 の各 source_id が manifest に登場する（記録の配線整合）
# 全体不変条件（Check 6/10/11/12）は scripts/validate-manifest-sync.sh が担保する。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CS_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

LEDGER="${CS_DIR}/knowledge/raw/simondon-corpus-acquisition.md"
PDF_DIR="${CS_DIR}/.cache/sources/simondon"
NOTE_DIR="${CS_DIR}/knowledge/source-notes/D13"
MANIFEST="${CS_DIR}/knowledge/raw/manifest.md"

errors=0
echo "=== check-simondon-corpus (cs#249 / D13) ==="

# T1: 台帳の存在
echo ""
echo "[T1] 台帳の存在"
if [[ -f "$LEDGER" ]]; then
    echo "  OK — $LEDGER"
else
    echo "  FAIL — 台帳が見つからない: $LEDGER"
    errors=$((errors + 1))
    echo ""; echo "=== 結果: errors=$errors ==="; exit 1
fi

# T2: 保存 PDF が全て有効
echo ""
echo "[T2] 保存 PDF の有効性（PDF magic）"
if [[ -d "$PDF_DIR" ]]; then
    shopt -s nullglob
    pdfs=("$PDF_DIR"/*.pdf)
    if [[ ${#pdfs[@]} -eq 0 ]]; then
        echo "  WARN — 保存 PDF が0件（③取得・保存 未実施なら正常）"
    fi
    for f in "${pdfs[@]}"; do
        magic="$(head -c 5 "$f" 2>/dev/null || true)"
        if [[ "$magic" == "%PDF-" ]]; then
            pages="$(pdfinfo "$f" 2>/dev/null | awk '/^Pages:/{print $2}')"
            echo "  OK — $(basename "$f") (pages=${pages:-?})"
        else
            echo "  FAIL — 非PDF/壊れ: $(basename "$f") (magic='$magic')"
            errors=$((errors + 1))
        fi
    done
    shopt -u nullglob
else
    echo "  WARN — 保存ディレクトリ未作成: $PDF_DIR（③未実施なら正常）"
fi

# T3: 台帳が参照する saved PDF が実在する（台帳↔ディスク）
echo ""
echo "[T3] 台帳 §2 の saved PDF が実在する"
# バッククォート囲みの *.pdf 名を台帳から抽出（bash3.2 互換: mapfile 不使用）
ref_pdfs="$(grep -oE '`[A-Za-z0-9._-]+\.pdf`' "$LEDGER" 2>/dev/null | tr -d '`' | sort -u)"
if [[ -z "$ref_pdfs" ]]; then
    echo "  INFO — 台帳に saved PDF 参照なし"
else
    while IFS= read -r name; do
        [[ -z "$name" ]] && continue
        if [[ -f "$PDF_DIR/$name" ]]; then
            echo "  OK — $name"
        else
            echo "  FAIL — 台帳が参照するが実在しない: $name"
            errors=$((errors + 1))
        fi
    done <<< "$ref_pdfs"
fi

# T4: note=生成済 の D13-S{NN} に source-note 実体がある
echo ""
echo "[T4] note=生成済 の source-note 実体"
# 「生成済」を含む行から D13-S{NN} を拾う（bash3.2 互換）
done_ids="$(grep '生成済' "$LEDGER" 2>/dev/null | grep -oE 'D13-S[0-9]+' | sort -u)"
if [[ -z "$done_ids" ]]; then
    echo "  INFO — note=生成済 の行なし（⑤記録 未実施なら正常）"
else
    while IFS= read -r id; do
        [[ -z "$id" ]] && continue
        if ls "$NOTE_DIR/${id}"_*.md >/dev/null 2>&1; then
            echo "  OK — $id → $(basename "$(ls "$NOTE_DIR/${id}"_*.md | head -1)")"
        else
            echo "  FAIL — 台帳は note=生成済 だが source-note 不在: $id"
            errors=$((errors + 1))
        fi
    done <<< "$done_ids"
fi

# T5: note=生成済 の source_id が manifest に登場する
echo ""
echo "[T5] note=生成済 の source_id が manifest に存在する"
if [[ -f "$MANIFEST" && -n "$done_ids" ]]; then
    while IFS= read -r id; do
        [[ -z "$id" ]] && continue
        if grep -qE "\|[[:space:]]*${id}[[:space:]]*\|" "$MANIFEST"; then
            echo "  OK — $id は manifest に存在"
        else
            echo "  FAIL — $id が manifest 行に不在（記録の配線漏れ）"
            errors=$((errors + 1))
        fi
    done <<< "$done_ids"
else
    echo "  INFO — 検査対象なし"
fi

echo ""
if [[ $errors -eq 0 ]]; then
    echo "=== 結果: PASS（errors=0）==="
else
    echo "=== 結果: FAIL（errors=$errors）==="
fi
exit $errors
