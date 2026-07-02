#!/usr/bin/env python3
"""cs#253 C軸: confidence tier 統合.

A軸(citation-audit.jsonl=実在) × B軸(access-audit.jsonl=取得) × source-note有無 ×
manifest の採録マーカーを sid で join し、各行に信頼度ティアを付与する。
API 不要・既存成果物の決定的 join のみ。

ティア（cs#252 の鎖「持つ→読む→解釈→公開」に対応）:
  T1_READ       source-note あり = 全文を精読し構造化ノート化済（最高位・照合ノイズに非依存）
  T2_OBTAINABLE ノート無 / 実在(A=STRONG|WEAK) かつ 取得可(B=OA_PDF|OA_HTML or raw-confirmedローカル)
  T3_REAL_BLOCK ノート無 / 実在 かつ 取得は env-block(B=BLOCKED|NET_ERR)= 別egress必要
  T4_REVIEW     上記以外 = 実在が機械未確認(MISMATCH|NOMATCH) / 取得欠陥(DEAD|NO_URL) / STUB
出力:
  knowledge/raw/audit/confidence-tier.jsonl / .md
"""
import re, os, json, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD = os.path.join(ROOT, 'knowledge/raw/audit')
MANIFEST = os.path.join(ROOT, 'knowledge/raw/manifest.md')
NOTES_GLOB = os.path.join(ROOT, 'knowledge/source-notes/D*/*.md')

def load_jsonl(name):
    d = {}
    p = os.path.join(AUD, name)
    if not os.path.exists(p):
        return d
    for line in open(p):
        r = json.loads(line)
        d[r['sid']] = r
    return d

def source_note_sids():
    sids = set()
    for f in glob.glob(NOTES_GLOB):
        m = re.match(r'(D\d+-S\d+\w?)_', os.path.basename(f))
        if m:
            sids.add(m.group(1))
    return sids

MARKER_RE = re.compile(r'\[([a-z0-9-]+)\]')

def manifest_markers():
    d = {}
    for line in open(MANIFEST):
        m = re.match(r'^\| (D\d+-S\d+\w?) \| (D\d+) \| `([a-z-]+)` \|', line)
        if not m:
            continue
        cells = [c.strip() for c in line.rstrip('\n').split('|')]
        notes = cells[7] if len(cells) > 7 else ''
        d[m.group(1)] = {'status': m.group(3), 'markers': MARKER_RE.findall(notes)}
    return d

def tier(sid, a, b, has_note, status):
    a_v = (a or {}).get('verdict')
    b_v = (b or {}).get('verdict')
    real = a_v in ('STRONG', 'WEAK')
    obtain = (b_v in ('OA_PDF', 'OA_HTML')) or (status == 'raw-confirmed' and b_v in ('NO_URL', 'OA_PDF', 'OA_HTML'))
    blocked = b_v in ('BLOCKED', 'NET_ERR')
    # citation-only / blocked-access は cs#252 で意図的に read-list 化した取得不能行。
    # 公開解釈を載せない前提なので「信頼度」軸ではなく read-list ティアに分離する。
    if status in ('citation-only', 'blocked-access'):
        return 'T5_READLIST'
    if has_note:
        return 'T1_READ'
    if real and obtain:
        return 'T2_OBTAINABLE'
    if real and blocked:
        return 'T3_REAL_BLOCK'
    return 'T4_REVIEW'

def main():
    A = load_jsonl('citation-audit.jsonl')
    B = load_jsonl('access-audit.jsonl')
    notes = source_note_sids()
    man = manifest_markers()
    sids = sorted(set(A) | set(B) | set(man))
    out_jsonl = os.path.join(AUD, 'confidence-tier.jsonl')
    counts = {'T1_READ': 0, 'T2_OBTAINABLE': 0, 'T3_REAL_BLOCK': 0, 'T4_REVIEW': 0, 'T5_READLIST': 0}
    t4 = []
    marker_tier = {}  # marker -> Counter(tier)
    with open(out_jsonl, 'w') as out:
        for sid in sids:
            a, b = A.get(sid), B.get(sid)
            mi = man.get(sid, {})
            status = mi.get('status', '?')
            has_note = sid in notes
            t = tier(sid, a, b, has_note, status)
            counts[t] += 1
            for mk in mi.get('markers', []):
                marker_tier.setdefault(mk, {}).setdefault(t, 0)
                marker_tier[mk][t] += 1
            rec = {'sid': sid, 'status': status, 'tier': t,
                   'has_note': has_note,
                   'A': (a or {}).get('verdict'), 'A_quality': (a or {}).get('entry_quality'),
                   'B': (b or {}).get('verdict'), 'markers': mi.get('markers', [])}
            out.write(json.dumps(rec, ensure_ascii=False) + '\n')
            if t == 'T4_REVIEW':
                t4.append(rec)

    md = os.path.join(AUD, 'confidence-tier.md')
    total = sum(counts.values())
    with open(md, 'w') as f:
        f.write('# cs#253 C軸: confidence tier（A実在 × B取得 × source-note × 採録根拠）\n\n')
        f.write(f'対象 {total} 行。A軸/B軸 jsonl と source-note 有無・採録マーカーの決定的 join。\n\n')
        f.write('## ティア分布\n\n| tier | 件数 | 意味 |\n|---|---|---|\n')
        f.write(f'| T1_READ | {counts["T1_READ"]} | source-note あり=精読済（最高位） |\n')
        f.write(f'| T2_OBTAINABLE | {counts["T2_OBTAINABLE"]} | 実在確認 かつ 今取得可 |\n')
        f.write(f'| T3_REAL_BLOCK | {counts["T3_REAL_BLOCK"]} | 実在確認 かつ env-block（別egress必要） |\n')
        f.write(f'| T4_REVIEW | {counts["T4_REVIEW"]} | raw/url-verified で機械未確認/欠陥/STUB（要人手） |\n')
        f.write(f'| T5_READLIST | {counts["T5_READLIST"]} | citation-only/blocked-access=取得不能・read-list（cs#252・公開解釈なし） |\n\n')
        f.write('## 採録マーカー別のティア分布（出自と信頼の相関）\n\n')
        f.write('| marker | T1 | T2 | T3 | T4 | T5 | 計 |\n|---|---|---|---|---|---|---|\n')
        for mk, c in sorted(marker_tier.items(), key=lambda kv: -sum(kv[1].values())):
            tot = sum(c.values())
            if tot < 2:
                continue
            f.write(f'| [{mk}] | {c.get("T1_READ",0)} | {c.get("T2_OBTAINABLE",0)} | '
                    f'{c.get("T3_REAL_BLOCK",0)} | {c.get("T4_REVIEW",0)} | {c.get("T5_READLIST",0)} | {tot} |\n')
        f.write(f'\n## T4_REVIEW {len(t4)} 行（要人手）\n\n')
        f.write('| sid | status | A(実在) | A_quality | B(取得) | markers |\n|---|---|---|---|---|---|\n')
        for r in t4:
            f.write(f'| {r["sid"]} | {r["status"]} | {r["A"]} | {r["A_quality"]} | {r["B"]} | '
                    f'{",".join(r["markers"])} |\n')
    print('=== SUMMARY ===')
    print(json.dumps(counts, ensure_ascii=False))
    print(f'T4_REVIEW: {len(t4)}')
    print(f'report: {md}')

if __name__ == '__main__':
    main()
