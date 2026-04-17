#!/usr/bin/env bash
# validate-manifest-sync.sh — マニフェスト間整合チェック（creation-space 版）
# 用途: レポート生成後に実行し、データソース間の同期を検証
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CS_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PJDHIRO_DIR="${CS_DIR}/../pjdhiro"
PD_DIR="${CS_DIR}/../project-design"

INDEX_JSON="${CS_DIR}/transform/domains/publish/domains/index.json"
DATA_JS="${CS_DIR}/src/reports/data.js"
DOMAINS_JSON="${PJDHIRO_DIR}/assets/creation/manifests/domains.json"
CS_WIKI_ROOT="${CS_DIR}/knowledge/wiki"
PD_WIKI_ROOT="${PD_DIR}/wiki/sources"

WIKI_MIN=5

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

# --- Check 6: cs wiki >=5 本 / domain (cs#227) ---
echo ""
echo "[6] cs wiki 不変条件: 各領域で D{NN}-S{##}_*.md が ${WIKI_MIN} 本以上"
if [[ -d "$CS_WIKI_ROOT" ]]; then
    python3 -c "
import os, re, sys
root = '${CS_WIKI_ROOT}'
minimum = ${WIKI_MIN}
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
    echo "  SKIP — cs/knowledge/wiki/ が見つからない"
    warnings=$((warnings + 1))
fi

# --- Check 7: pd wiki >=5 本 / domain (cs#227, WARN only) ---
echo ""
echo "[7] pd wiki 不変条件: 各領域で D{NN}_*.md が ${WIKI_MIN} 本以上 (未配備領域は除外)"
if [[ -d "$PD_WIKI_ROOT" ]]; then
    set +e
    python3 -c "
import os, re, sys
root = '${PD_WIKI_ROOT}'
minimum = ${WIKI_MIN}
pat = re.compile(r'^(D\d+)_.+\.md$')
counts = {}
for f in os.listdir(root):
    m = pat.match(f)
    if m:
        counts[m.group(1)] = counts.get(m.group(1), 0) + 1
if not counts:
    print('  SKIP — D{NN}_*.md が見つからない')
    sys.exit(0)
warn = 0
for d in sorted(counts):
    if counts[d] < minimum:
        print(f'  WARN {d}: {counts[d]} 本 (< {minimum})')
        warn += 1
if warn == 0:
    print(f'  OK — 配備済み {len(counts)} 領域で {minimum} 本以上')
else:
    print(f'  WARN — {warn} 領域が不足 (pd 側生成待ち)')
sys.exit(2 if warn > 0 else 0)
"
    rc=$?
    set -e
    if [[ $rc -eq 2 ]]; then
        warnings=$((warnings + 1))
    elif [[ $rc -ne 0 ]]; then
        errors=$((errors + 1))
    fi
else
    echo "  SKIP — pd (project-design) が見つからない"
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
