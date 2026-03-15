#!/usr/bin/env bash
# build-pdf-guide.sh — creation guides の Markdown を PDF にビルドする
# 使い方:
#   ./build-pdf-guide.sh              # 全3種（general, designer, academic）をビルド
#   ./build-pdf-guide.sh general      # 指定した audience のみビルド
#   ./build-pdf-guide.sh designer academic  # 複数指定も可
#
# 依存: pandoc, weasyprint
# フォント: Hiragino Mincho ProN (本文), Hiragino Kaku Gothic ProN (見出し)

set -euo pipefail

# --- パス定数 ---
GUIDES_BASE="/Users/uminomae/dev/pjdhiro/assets/creation/guides/ja"
MD_DIR="${GUIDES_BASE}/md"
PDF_DIR="${GUIDES_BASE}/pdf"
IMG_DIR="/Users/uminomae/dev/pjdhiro/assets/creation/img"

# --- 有効な audience 一覧 ---
VALID_AUDIENCES=(general designer academic)

# --- CSS ---
CSS_CONTENT='
body {
  font-family: "Hiragino Mincho ProN", serif;
  font-size: 11pt;
  line-height: 1.8;
  margin: 2.5cm;
  color: #1a1a1a;
}
h1, h2, h3, h4 {
  font-family: "Hiragino Kaku Gothic ProN", sans-serif;
}
h1 { font-size: 1.6em; margin-top: 1.5em; }
h2 { font-size: 1.3em; margin-top: 1.3em; }
h3 { font-size: 1.1em; margin-top: 1.1em; }
img { max-width: 100%; height: auto; }
a { color: #2563eb; }
'

# --- 関数 ---
usage() {
  echo "Usage: $0 [audience ...]"
  echo "  audience: general | designer | academic (default: all)"
  exit 1
}

is_valid_audience() {
  local target="$1"
  for v in "${VALID_AUDIENCES[@]}"; do
    [[ "$v" == "$target" ]] && return 0
  done
  return 1
}

build_one() {
  local audience="$1"
  local md_file="${MD_DIR}/creation-${audience}.md"
  local pdf_file="${PDF_DIR}/creation-${audience}.pdf"

  if [[ ! -f "$md_file" ]]; then
    echo "ERROR: 入力ファイルが見つかりません: ${md_file}" >&2
    return 1
  fi

  echo "Building: ${audience} ..."
  echo "  input:  ${md_file}"
  echo "  output: ${pdf_file}"

  mkdir -p "${PDF_DIR}"

  local css_file
  css_file="$(mktemp "${TMPDIR:-/tmp}/guide-css-XXXXXX.css")"
  echo "${CSS_CONTENT}" > "${css_file}"

  pandoc "${md_file}" \
    -o "${pdf_file}" \
    --pdf-engine=weasyprint \
    --resource-path="${IMG_DIR}:${MD_DIR}" \
    --css="${css_file}" \
    --shift-heading-level-by=-1

  rm -f "${css_file}"
  echo "  done: ${pdf_file}"
}

# --- メイン ---
targets=()

if [[ $# -eq 0 ]]; then
  targets=("${VALID_AUDIENCES[@]}")
else
  for arg in "$@"; do
    if [[ "$arg" == "-h" || "$arg" == "--help" ]]; then
      usage
    fi
    if ! is_valid_audience "$arg"; then
      echo "ERROR: 無効な audience: '${arg}'" >&2
      echo "  有効な値: ${VALID_AUDIENCES[*]}" >&2
      exit 1
    fi
    targets+=("$arg")
  done
fi

failed=0
for t in "${targets[@]}"; do
  if ! build_one "$t"; then
    failed=$((failed + 1))
  fi
done

if [[ $failed -gt 0 ]]; then
  echo "ERROR: ${failed} 件のビルドに失敗しました" >&2
  exit 1
fi

echo "All done."
