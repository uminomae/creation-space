#!/usr/bin/env bash
# validate-manifest-sync.sh — マニフェスト間整合チェック（creation-space 版）
# 用途: レポート生成後に実行し、データソース間の同期を検証
# オプション: --deep  Check 8 で PDF 本文1-2頁の年照合も行う（info のみ・合否に非影響、cs#240）
set -euo pipefail

DEEP=0
for arg in "$@"; do
    case "$arg" in
        --deep) DEEP=1 ;;
    esac
done

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CS_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PJDHIRO_DIR="${CS_DIR}/../pjdhiro"
PD_DIR="${CS_DIR}/../project-design"

INDEX_JSON="${CS_DIR}/transform/domains/publish/domains/index.json"
DATA_JS="${CS_DIR}/src/reports/data.js"
DOMAINS_JSON="${PJDHIRO_DIR}/assets/creation/manifests/domains.json"
CS_SOURCE_NOTE_ROOT="${CS_DIR}/knowledge/source-notes"
MANIFEST="${CS_DIR}/knowledge/raw/manifest.md"

SOURCE_NOTE_MIN=5

errors=0
warnings=0

echo "=== validate-manifest-sync (creation-space) ==="

# --- Check 4: taxonomy 整合 — index.json の progress_level が progress_taxonomy に存在するか ---
echo ""
echo "[4] taxonomy 整合: index.json の progress_level が taxonomy 定義に存在するか"
if [[ -f "$INDEX_JSON" ]]; then
    python3 -c "
import json, sys
with open('${INDEX_JSON}') as f: ij = json.load(f)
valid = {t['id'] for t in ij.get('progress_taxonomy', [])}
invalid = 0
for r in ij.get('reports', []):
    pl = r.get('progress_level', '')
    if pl and pl not in valid:
        print(f'  INVALID {r[\"id\"]}: progress_level=\"{pl}\" not in taxonomy {sorted(valid)}')
        invalid += 1
if invalid == 0:
    print('  OK — 全 progress_level が taxonomy に存在')
sys.exit(1 if invalid > 0 else 0)
" || errors=$((errors + 1))
else
    echo "  SKIP — index.json が見つからない"
    warnings=$((warnings + 1))
fi

# --- Check 5: 定義ドリフト — data.js と index.json の taxonomy ID 一致 ---
echo ""
echo "[5] 定義ドリフト: data.js と index.json の taxonomy ID 一致チェック"
if [[ -f "$DATA_JS" && -f "$INDEX_JSON" ]]; then
    python3 -c "
import json, re, sys
# index.json の taxonomy ID を取得
with open('${INDEX_JSON}') as f: ij = json.load(f)
index_ids = sorted(t['id'] for t in ij.get('progress_taxonomy', []))
# data.js から id: '...' を抽出（DEFAULT_PROGRESS_TAXONOMY 内）
with open('${DATA_JS}') as f: content = f.read()
# DEFAULT_PROGRESS_TAXONOMY ブロックを切り出し
start = content.find('DEFAULT_PROGRESS_TAXONOMY')
end = content.find('];', start)
block = content[start:end] if start >= 0 else ''
js_ids = sorted(re.findall(r\"id:\s*'([^']+)'\", block))
if index_ids == js_ids:
    print(f'  OK — 一致: {index_ids}')
else:
    print(f'  DRIFT — index.json={index_ids}, data.js={js_ids}')
    sys.exit(1)
" || errors=$((errors + 1))
else
    echo "  SKIP — ファイルが見つからない"
    warnings=$((warnings + 1))
fi

# --- Check 1: domains.json vs index.json — progress_level と generated の一致 ---
echo ""
echo "[1] domains.json vs index.json: progress_level / generated 一致チェック"
if [[ -f "$DOMAINS_JSON" && -f "$INDEX_JSON" ]]; then
    python3 -c "
import json, sys
with open('${DOMAINS_JSON}') as f: dj = json.load(f)
with open('${INDEX_JSON}') as f: ij = json.load(f)
dj_map = {r['id']: r for r in dj.get('reports', [])}
ij_map = {r['id']: r for r in ij.get('reports', [])}
mismatches = 0
for did in sorted(dj_map):
    d = dj_map[did]
    i = ij_map.get(did, {})
    dp = d.get('progress_level', '')
    ip = i.get('progress_level', '')
    if dp != ip:
        print(f'  MISMATCH {did}: domains.json={dp}, index.json={ip}')
        mismatches += 1
    dg = d.get('generated', '')
    ig = i.get('generated', '')
    if dg and ig and dg != ig:
        print(f'  MISMATCH {did} generated: domains.json={dg}, index.json={ig}')
        mismatches += 1
if mismatches == 0:
    print('  OK — 全ドメイン一致')
sys.exit(1 if mismatches > 0 else 0)
" || errors=$((errors + 1))
else
    echo "  SKIP — ファイルが見つからない (pjdhiro が必要)"
    warnings=$((warnings + 1))
fi

# --- Check 6: cs source-note >=5 本 / domain (cs#227, cs#228 で命名変更) ---
echo ""
echo "[6] cs source-note 不変条件: 各領域で D{NN}-S{##}_*.md が ${SOURCE_NOTE_MIN} 本以上"
if [[ -d "$CS_SOURCE_NOTE_ROOT" ]]; then
    python3 -c "
import os, re, sys
root = '${CS_SOURCE_NOTE_ROOT}'
minimum = ${SOURCE_NOTE_MIN}
fail = 0
pat = re.compile(r'^(D\d+)-S\d+_.+\.md$')
domains = sorted(d for d in os.listdir(root) if re.match(r'^D\d+$', d))
if not domains:
    print('  SKIP — D{NN}/ ディレクトリなし')
    sys.exit(0)
for d in domains:
    files = [f for f in os.listdir(os.path.join(root, d)) if pat.match(f)]
    if len(files) < minimum:
        print(f'  FAIL {d}: {len(files)} 本 (< {minimum})')
        fail += 1
if fail == 0:
    print(f'  OK — 全 {len(domains)} 領域で {minimum} 本以上')
sys.exit(1 if fail > 0 else 0)
" || errors=$((errors + 1))
else
    echo "  SKIP — cs/knowledge/source-notes/ が見つからない"
    warnings=$((warnings + 1))
fi

# Check 7 は cs#228 で削除。cs は pd の状態を検査しない原則（pd wiki の整合は pd 側の責任）。

# --- Check 8: 書誌クロスチェック — raw-confirmed の local_file 存在性 + 書誌ドリフト (cs#240) ---
# 背景: D03-S08 で manifest citation と PDF 実体（著者順・年・巻号・頁・DOI）が齟齬し未検出だった。
#   存在性: local_file が無く .gitignore 外なら FAIL（壊れたパス）。gitignore 済み大著は local-only として info。
#   年整合: ファイル名年 != source_title 年なら WARN（D03-S08 クラス。preprint/published 差等は人手レビュー）。
#   --deep: PDF 本文1-2頁の年照合を info 出力（scanned PDF でノイズ ~16% のため合否には影響させない）。
echo ""
echo "[8] 書誌クロスチェック: raw-confirmed local_file 存在性 + 書誌ドリフト (cs#240)"
if [[ -f "$MANIFEST" ]]; then
    DEEP="$DEEP" CS_DIR="$CS_DIR" MANIFEST="$MANIFEST" python3 -c "
import re, os, sys, subprocess
manifest = os.environ['MANIFEST']
csdir = os.environ['CS_DIR']
deep = os.environ.get('DEEP') == '1'

def pdfpath(lf):
    m = re.search(r'\`([^\`]+\.pdf)\`', lf)
    return m.group(1) if m else ''

rows = []
with open(manifest) as f:
    for line in f:
        if not line.startswith('| D'): continue
        cols = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cols) < 5: continue
        rows.append(cols[:5])  # sid, did, status, title, local_file

rc = [r for r in rows if 'raw-confirmed' in r[2] and pdfpath(r[4])]

fail = 0           # 壊れたパス（gitignore 外で実体なし）
year_warn = []     # ファイル名年 != title 年
local_only = []    # gitignore 済みでローカル不在（正規）
deep_info = []     # --deep: PDF 本文に年が見当たらない（scanned 含む、info のみ）

def is_ignored(rel):
    return subprocess.run(['git', '-C', csdir, 'check-ignore', '-q', rel]).returncode == 0

for r in rc:
    rel = pdfpath(r[4])
    full = os.path.join(csdir, rel)
    if not os.path.exists(full):
        if is_ignored(rel):
            local_only.append((r[0], rel))
        else:
            print(f'  FAIL {r[0]}: local_file 実体なし & .gitignore 外 -> {rel}')
            fail += 1
        continue
    fn = os.path.basename(rel)
    fym = re.search(r'_(1[89]\d\d|20\d\d)_', fn)
    tys = set(re.findall(r'\b(1[89]\d\d|20\d\d)\b', r[3]))
    if fym and tys and fym.group(1) not in tys:
        year_warn.append((r[0], fym.group(1), sorted(tys), fn))
    if deep and fym:
        try:
            txt = subprocess.run(['pdftotext', '-f', '1', '-l', '2', full, '-'],
                                 capture_output=True, text=True, timeout=30).stdout
        except Exception:
            txt = ''
        if len(txt.strip()) >= 200 and fym.group(1) not in txt:
            deep_info.append((r[0], fym.group(1), fn))

for sid, fy, tys, fn in year_warn:
    print(f'  WARN {sid}: ファイル名年 {fy} が source_title 年 {tys} に不在 ({fn})')

if local_only:
    print(f'  info — gitignore 済み local-only 大著 {len(local_only)} 件はスキップ（正規）')

if deep and deep_info:
    print(f'  info(--deep) — PDF 本文1-2頁に年が見当たらない {len(deep_info)} 件（scanned/表紙年なし含む、要人手確認）:')
    for sid, fy, fn in deep_info:
        print(f'      {sid}: 期待年 {fy} 未検出 ({fn})')

if fail == 0 and not year_warn:
    print(f'  OK — raw-confirmed {len(rc)} 件すべて local_file 整合・年整合')
elif fail == 0:
    print(f'  PASS(warn) — 壊れたパスなし。年ドリフト {len(year_warn)} 件は人手レビュー対象')

sys.exit(1 if fail > 0 else 0)
" || errors=$((errors + 1))
    # WARN を集計（年ドリフト件数を warnings に加算するのは過剰なので errors のみ反映）
else
    echo "  SKIP — knowledge/raw/manifest.md が見つからない"
    warnings=$((warnings + 1))
fi

# --- Summary ---
echo ""
echo "=== 結果: errors=${errors}, warnings=${warnings} ==="
if [[ $errors -gt 0 ]]; then
    echo "FAIL"
    exit 1
else
    echo "PASS"
    exit 0
fi
