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

# --- Check 9: dashboard-stats.json が最新か (ドリフト検知) ---
echo ""
echo "[9] dashboard-stats.json 鮮度: scripts/generate-dashboard-stats.mjs --check"
if [[ -f "${CS_DIR}/assets/dashboard-stats.json" ]]; then
    if node "${SCRIPT_DIR}/generate-dashboard-stats.mjs" --check >/dev/null 2>&1; then
        echo "  OK — dashboard-stats.json は manifest/source-note/領域数と整合"
    else
        echo "  WARN — dashboard-stats.json が古い。'node scripts/generate-dashboard-stats.mjs' で再生成すること"
        warnings=$((warnings + 1))
    fi
else
    echo "  SKIP — assets/dashboard-stats.json が見つからない"
    warnings=$((warnings + 1))
fi

# --- Check 10: 同一領域内の原典重複検知 (cs#249) ---
# 背景: D15-S09/D15-S10 (Dewey 1934) / D26-S06/D26-S09 (Huron 2006) /
#   D16-S03/D16-S04 (Toynbee A Study of History) のように、同一原典・同一領域の
#   manifest 行が複数存在する重複ミスが放置されていた。
#   重複は「原典→source-note 1:1 原則」(.claude/rules/source-note-invariants.md §1) に反する。
# 判定方針 (cs#249, pjdhiro 指示=実務標準の書誌重複ルールを採用):
#   1. 候補グルーピング: (領域, 正規化書名)。同一領域で書名一致＝重複候補。
#   2. DOI 主キー: ペアの両方が DOI を持ち、それが *異なれば別 publication* として除外
#      （速報 letter 版 vs 拡張 full article 版、版違い等。例: Bak SOC は別 DOI で自動判定）。
#   3. DOI で切り分けられない同一書名ペアのうち、レビュー済み例外
#      (knowledge/raw/duplicate-exceptions.md) に登録されたものを除外し、残りを FAIL。
#   クロス領域 anchor (同一原典を *異なる領域* で再利用) は領域が異なるため掛からない（正規）。
DUP_EXC="$(dirname "$MANIFEST")/duplicate-exceptions.md"
echo ""
echo "[10] 原典重複検知: 同一領域・同一書名 (DOI 相違は別publicationとして自動除外, cs#249)"
if [[ -f "$MANIFEST" ]]; then
    python3 - "$MANIFEST" "$DUP_EXC" <<'PY' || errors=$((errors + 1))
import re, sys
from itertools import combinations
manifest = sys.argv[1]
exc_file = sys.argv[2] if len(sys.argv) > 2 else ''

def norm_title(cit):
    """論文/書籍の実タイトルを抽出して正規化する。
    論文 "Author (year). Title. *Journal* vol" はイタリックが雑誌名なので、
    年括弧の後・最初のイタリック手前のテキストをタイトルとする。
    書籍 "Author (year). *Title*. Publisher" / "Author. *Title*. Pub"(年括弧なし) は
    イタリックがタイトル。"""
    s = cit.strip()
    m = re.search(r'\)\.\s*(.*)', s)                 # 年括弧 "(year)." の後ろ
    if m:
        rest = m.group(1).strip()
    else:                                            # 年括弧なし: 著者プレフィックスを捨て最初のイタリック以降
        mi = re.search(r'(\*.*)', s)
        rest = mi.group(1).strip() if mi else s.strip()
    if rest.startswith('*'):                          # 書籍: *Title*. publisher
        mt = re.match(r'\*([^*]+)\*', rest)
        title = mt.group(1) if mt else rest
    else:                                            # 論文: Title. *Journal* vol
        cut = rest.find(' *')                         # 最初のイタリック(雑誌)の手前で切る
        seg = rest[:cut] if cut >= 0 else rest
        title = re.split(r'[.?]', seg)[0]            # タイトル末尾の "." / "?" まで
    title = title.replace('*', '')
    return re.sub(r'[^a-z0-9぀-ヿ一-鿿]', '', title.lower())[:60]

def surname(cit):
    a = re.match(r'([A-Za-zÀ-ſ][\wÀ-ſ\'’-]*)', cit.strip())
    return a.group(1).lower() if a else '?'

def extract_doi(line):
    m = re.search(r'\b10\.\d{4,9}/[^\s。、,)）]+', line)
    return m.group(0).rstrip('.').lower() if m else None

# レビュー済み例外 (誤検知でない理由つき) を登録簿から読む。
# 形式: | source_id A | source_id B | カテゴリ | 理由 |  の行 (A/B が source_id のもの)
reviewed_pairs = {}   # frozenset({A,B}) -> 理由
if exc_file:
    try:
        for ln in open(exc_file, encoding='utf-8'):
            if not ln.lstrip().startswith('|'):
                continue
            c = [x.strip() for x in ln.strip().strip('|').split('|')]
            if len(c) >= 4 and re.fullmatch(r'D\d+-S\w+', c[0]) and re.fullmatch(r'D\d+-S\w+', c[1]):
                reviewed_pairs[frozenset((c[0], c[1]))] = c[3]
    except FileNotFoundError:
        pass

groups = {}
for line in open(manifest, encoding='utf-8'):
    if not re.match(r'\|\s*D\d+-S', line):
        continue
    cells = [x.strip() for x in line.strip().strip('|').split('|')]
    if len(cells) < 4:
        continue
    sid, dom, _acc, cit = cells[0], cells[1], cells[2], cells[3]
    dom_key = 'citation-only' if dom == 'citation-only' else dom
    t = norm_title(cit)
    if not t:
        continue
    # work-identity = (領域, 著者姓, 書名)。標準的な no-DOI 重複判定。
    # 著者姓を含めることで、同一誌の別論文(別著者)を誤検知せず、真の重複(著者一致)を捕捉する。
    groups.setdefault((dom_key, surname(cit), t), []).append((sid, cit, extract_doi(line)))

violations = 0
for (dom, _au, t), items in sorted(groups.items()):
    if len(items) < 2:
        continue
    dup_pairs, reviewed, doi_split = [], [], []
    for (s1, c1, d1), (s2, c2, d2) in combinations(items, 2):
        if d1 and d2 and d1 != d2:
            doi_split.append((s1, s2))          # 別 DOI = 別 publication (標準)
        elif frozenset((s1, s2)) in reviewed_pairs:
            reviewed.append((s1, s2))           # 登録簿でレビュー済み
        else:
            dup_pairs.append((s1, c1, s2, c2))
    if dup_pairs:
        violations += 1
        print(f"  FAIL 重複: [{dom}] «{t[:32]}» 同一領域に同一書名・DOI で切り分け不可")
        seen = set()
        for s1, c1, s2, c2 in dup_pairs:
            for sid, cit in ((s1, c1), (s2, c2)):
                if sid not in seen:
                    seen.add(sid)
                    print(f"        {sid}: {cit[:78]}")
    elif reviewed:
        print(f"  OK(例外) 同名だがレビュー済(別publication): [{dom}] «{t[:28]}» {[list(p) for p in reviewed]}")
    elif doi_split:
        print(f"  OK(DOI相違) 同名だが別DOI=別publication: [{dom}] «{t[:28]}» {doi_split}")

if violations:
    print(f"  → 重複 {violations} 群。重複行を manifest から除外するか、DOI で切り分け不可な別publicationなら")
    print(f"     knowledge/raw/duplicate-exceptions.md に「誤検知でない理由・論拠」を添えて登録すること")
    sys.exit(1)
print("  OK — 同一領域内の未レビュー重複なし")
PY
else
    echo "  SKIP — knowledge/raw/manifest.md が見つからない"
    warnings=$((warnings + 1))
fi

# --- Check 11: 鎖の不変条件 — 取得不能原典の上に公開解釈/論拠を置かない (cs#252) ---
# 原則「持つ(誰でも検証可)→読む→解釈→まとめる→公開」の逆方向検査。
# §1 の 1:1(raw-confirmed/url-verified → source-note 必須) の裏側として、
# citation-only/blocked-access(=誰でも検証可に入手できない) には公開解釈を置いてはならない。
echo ""
echo "[11] 鎖の不変条件: 取得不能原典に公開解釈/確定論拠を置かない (cs#252)"
if [[ -f "$MANIFEST" ]]; then
    python3 - "$MANIFEST" "$CS_SOURCE_NOTE_ROOT" <<'PY' || errors=$((errors + 1))
import os, re, sys
manifest, note_root = sys.argv[1], sys.argv[2]

access = {}   # source_id -> access_status (全行)
notes = {}    # source_id -> notes 列テキスト
for line in open(manifest, encoding='utf-8'):
    m = re.match(r'\|\s*(D\d+-S\d+[a-z]?)\s*\|\s*D\d+\s*\|\s*`([a-z-]+)`\s*\|(.*)', line)
    if m:
        access[m.group(1)] = m.group(2)
        notes[m.group(1)] = m.group(3)
inaccessible = [s for s, a in access.items() if a in ('citation-only', 'blocked-access')]

# 11a: 取得不能なのに source-note が存在する = 検証不能な根拠の上の公開「解釈/まとめ」(FAIL)
note_violations = []
for sid in inaccessible:
    d = os.path.join(note_root, sid.split('-')[0])
    if os.path.isdir(d):
        hits = [f for f in os.listdir(d) if f.startswith(sid + '_') or f.startswith(sid + '.')]
        if hits:
            note_violations.append((sid, access[sid], hits[0]))

# 11b: 取得不能原典が「確定」ステータス([phase-3-confirmed]/代替確定)を主張し、
#      その代替もまた取得不能な cs 原典である = 鎖が代替経由でも切れている (FAIL)。
#      取り消し線 ~~...~~ で撤回済みの記述は live ではないので除外する。
def strip_withdrawn(t):
    return re.sub(r'~~.*?~~', '', t)
chain_violations = []
for sid in inaccessible:
    live = strip_withdrawn(notes[sid])
    if '[phase-3-confirmed]' in live or '代替確定' in live or '採用確定' in live:
        refs = [r for r in re.findall(r'D\d+-S\d+[a-z]?', live) if r != sid]
        bad = sorted(set(r for r in refs if access.get(r) in ('citation-only', 'blocked-access')))
        if bad:
            chain_violations.append((sid, access[sid], bad))

rc = 0
if note_violations:
    print(f"  FAIL(11a) 取得不能原典に source-note が存在 ({len(note_violations)}件): 公開解釈を撤去し read-list 化すること")
    for sid, acc, f in note_violations:
        print(f"        {sid} ({acc}) -> {f}")
    rc = 1
else:
    print(f"  OK(11a) — 取得不能 {len(inaccessible)} 本に source-note なし")

if chain_violations:
    print(f"  FAIL(11b) 取得不能原典が取得不能な代替で確定主張 ({len(chain_violations)}件): 固定代替を撤回し探索継続へ")
    for sid, acc, bad in chain_violations:
        print(f"        {sid} ({acc}) の確定代替 {bad} も取得不能")
    rc = 1
else:
    print(f"  OK(11b) — 確定ステータスの代替に取得不能原典なし (取消線=撤回済は除外)")

sys.exit(rc)
PY
else
    echo "  SKIP — knowledge/raw/manifest.md が見つからない"
    warnings=$((warnings + 1))
fi

# --- Check 12: 鎖の「読む」— abstract/メタデータのみの source-note を禁止 (cs#252) ---
# source-note は原典を全文読んだ上で書く。読解ページ範囲が abstract/要旨/メタデータ「のみ」を
# 示すものは「読む」を欠くため FAIL。OA だが当環境未取得の read-obligation は登録簿で除外。
READ_EXC="${CS_DIR}/knowledge/raw/read-depth-exceptions.md"
echo ""
echo "[12] 鎖の「読む」: abstract/メタデータのみの source-note 禁止 (cs#252)"
if [[ -d "$CS_SOURCE_NOTE_ROOT" ]]; then
    python3 - "$CS_SOURCE_NOTE_ROOT" "$READ_EXC" <<'PY' || errors=$((errors + 1))
import os, re, sys
root, exc_file = sys.argv[1], sys.argv[2]

# 登録簿(read-obligation: OA だが当環境未取得)の source_id を除外
exempt = set()
if os.path.isfile(exc_file):
    for ln in open(exc_file, encoding='utf-8'):
        if ln.lstrip().startswith('|'):
            c = [x.strip() for x in ln.strip().strip('|').split('|')]
            if c and re.fullmatch(r'D\d+-S\d+[a-z]?', c[0]):
                exempt.add(c[0])

# 読解ページ範囲(実際に読んだ範囲)が abstract/メタデータ「のみ」= 全文未読の署名
only_pat = re.compile(r'(abstract|要旨|メタデータ|アブストラクト)[^。\n]{0,12}(のみ|only)|(のみ取得|要旨のみ|メタデータ・要旨のみ)')
viol = []
for dp, _, fs in os.walk(root):
    for f in fs:
        m = re.match(r'(D\d+-S\d+[a-z]?)_.*\.md$', f)
        if not m:
            continue
        sid = m.group(1)
        if sid in exempt:
            continue
        head = '\n'.join(open(os.path.join(dp, f), encoding='utf-8').read().split('\n')[:12])
        rng = re.search(r'読解ページ範囲\*\*?:\s*(.+)', head)   # 実読範囲を最優先
        target = rng.group(1) if rng else ''
        if only_pat.search(target):
            viol.append((sid, target[:64]))

if viol:
    print(f"  FAIL — abstract/メタデータのみで書かれた source-note ({len(viol)}件): 全文精読で再生成するか、真に取得不能なら破棄し降格(read-list化)")
    for sid, t in sorted(viol):
        print(f"        {sid}: 読解範囲「{t}」")
    sys.exit(1)
print(f"  OK — 全 source-note が全文(部分精読含む)ベース (read-obligation 登録 {len(exempt)}件は除外)")
PY
else
    echo "  SKIP — cs/knowledge/source-notes/ が見つからない"
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
