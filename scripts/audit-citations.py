#!/usr/bin/env python3
"""cs#253 A軸: 書誌実在性監査.

manifest の raw-confirmed / url-verified 行の (著者/題/年) を Crossref で照合し、
canonical DOI と一致判定を構造化して書き出す。コンテキスト保護のため、
結果は JSONL + markdown サマリにファイル出力し、stdout には集計のみ出す。

使い方:
  python3 scripts/audit-citations.py [--limit N] [--status raw-confirmed,url-verified]

出力:
  knowledge/raw/audit/citation-audit.jsonl   全行の生結果
  knowledge/raw/audit/citation-audit.md       人間可読サマリ + 要レビュー行
"""
import re, os, sys, json, time, urllib.request, urllib.parse, argparse, difflib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, 'knowledge/raw/manifest.md')
OUTDIR = os.path.join(ROOT, 'knowledge/raw/audit')
MAILTO = 'uminomae@gmail.com'

def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--status', default='raw-confirmed,url-verified')
    ap.add_argument('--sleep', type=float, default=1.2)
    return ap.parse_args()

def load_rows(statuses):
    rows = []
    with open(MANIFEST) as f:
        for line in f:
            m = re.match(r'^\| (D\d+-S\d+\w?) \| (D\d+) \| `([a-z-]+)` \|', line)
            if not m:
                continue
            if m.group(3) not in statuses:
                continue
            cells = [c.strip() for c in line.rstrip('\n').split('|')]
            # ['', sid, did, `status`, title, local_file, evidence, notes]
            sid, did, status = m.group(1), m.group(2), m.group(3)
            title = cells[4] if len(cells) > 4 else ''
            notes = cells[7] if len(cells) > 7 else ''
            rows.append({'sid': sid, 'did': did, 'status': status,
                         'title_raw': title, 'notes': notes})
    return rows

DOI_RE = re.compile(r'10\.\d{4,9}/[^\s"<>)]+', re.I)

def extract_doi(text):
    m = DOI_RE.search(text)
    if not m:
        return None
    return m.group(0).rstrip('.,;。)')

def parse_citation(title_raw):
    """markdown title を解析。

    返り値: (author, year, title, well_formed)
    well_formed = 著者を先頭に持ち `(YYYY)` 形式の年を含む整形済み引用。
    そうでない行（年なし・著者なしの topic 語句）は STUB として well_formed=False。
    """
    plain = re.sub(r'[*`]', '', title_raw).strip()
    # 年括弧 (1957) / (1957/1959) / (2002a) を検出
    ym = re.search(r'\((\d{4})(?:[/–-]\d{2,4})?[a-z]?\)', plain)
    year = int(ym.group(1)) if ym else None
    # 整形済み判定: 先頭が著者姓らしく、年括弧がある
    author = None
    am = re.match(r"([A-Z][A-Za-z.'À-ſ-]+)", plain)
    leads_author = bool(am) and not plain[:1].islower()
    well_formed = bool(ym) and leads_author
    if am:
        author = am.group(1)
    # 題抽出（well_formed のみ意味を持つ）
    if ym:
        after = plain[ym.end():]
        after = after.lstrip(' .,)')
        # 翻訳/版表記を除去
        after = re.sub(r'^(Trans\.|Translated).*', '', after)
        title = after.split('. *')[0]
        title = re.split(r'\.\s+[A-Z][a-zA-Z]+\.?\s', title)[0]
        # 末尾の識別子（arXiv:.../ doi:.../ URL / 巻号頁）を除去
        title = re.split(r'\s+(?:arXiv:|doi:|https?://)', title, flags=re.I)[0]
        title = title.strip(' .,')
    else:
        # STUB: 行全体を題候補に（crossref で実在だけは試す）
        title = plain
        author = None  # 著者は信頼しない
    return author, year, title.strip(), well_formed

def http_json(url, timeout=30):
    req = urllib.request.Request(url, headers={'User-Agent': f'cs-audit (mailto:{MAILTO})'})
    raw = urllib.request.urlopen(req, timeout=timeout).read().decode('utf-8', 'replace')
    return json.loads(raw, strict=False)

def crossref_by_doi(doi):
    url = f'https://api.crossref.org/works/{urllib.parse.quote(doi)}?mailto={MAILTO}'
    try:
        d = http_json(url)
        return d.get('message')
    except Exception:
        return None

def crossref_by_bib(title, author, year):
    q = urllib.parse.quote((title or '')[:200])
    url = f'https://api.crossref.org/works?query.bibliographic={q}&rows=3&mailto={MAILTO}'
    if author:
        url += f'&query.author={urllib.parse.quote(author)}'
    try:
        d = http_json(url)
        return d.get('message', {}).get('items', [])
    except Exception:
        return []

def cr_fields(it):
    return {
        'src': 'crossref',
        'doi': (it.get('DOI') or '').lower() or None,
        'title': (it.get('title') or [''])[0],
        'year': ((it.get('issued', {}).get('date-parts') or [[None]])[0] or [None])[0],
        'author': ((it.get('author') or [{}])[0].get('family') or ''),
        'score': it.get('score'),
    }

def openalex_by_doi(doi):
    url = f'https://api.openalex.org/works/doi:{urllib.parse.quote(doi)}?mailto={MAILTO}'
    try:
        return http_json(url)
    except Exception:
        return None

def openalex_search(title, author):
    q = urllib.parse.quote((title or '')[:200])
    url = f'https://api.openalex.org/works?search={q}&per-page=3&mailto={MAILTO}'
    try:
        d = http_json(url)
        return (d.get('results') or [])
    except Exception:
        return []

def oa_fields(w):
    if not w:
        return None
    auth = ''
    aus = w.get('authorships') or []
    if aus:
        auth = ((aus[0].get('author') or {}).get('display_name') or '').split()[-1:] or ['']
        auth = auth[0]
    return {
        'src': 'openalex',
        'doi': (w.get('doi') or '').replace('https://doi.org/', '').lower() or None,
        'title': w.get('display_name') or '',
        'year': w.get('publication_year'),
        'author': auth,
        'type': w.get('type'),
    }

def norm(s):
    return re.sub(r'[^a-z0-9 ]', '', (s or '').lower()).strip()

def title_sim(a, b):
    return difflib.SequenceMatcher(None, norm(a), norm(b)).ratio()

def verdict(row, cr):
    """STRONG / WEAK / MISMATCH / NOMATCH を判定."""
    if cr is None:
        return 'NOMATCH', {}
    a_au, a_yr, a_ti = row['_author'], row['_year'], row['_title']
    sim = title_sim(a_ti, cr['title'])
    year_ok = (a_yr is not None and cr['year'] is not None and abs(a_yr - cr['year']) <= 1)
    auth_ok = bool(a_au and cr['author'] and a_au.lower() in cr['author'].lower())
    info = {'title_sim': round(sim, 2), 'year_ok': year_ok, 'auth_ok': auth_ok}
    if sim >= 0.7 and (year_ok or auth_ok):
        return 'STRONG', info
    if sim >= 0.5 or (year_ok and auth_ok):
        return 'WEAK', info
    return 'MISMATCH', info

def main():
    args = parse_args()
    statuses = set(args.status.split(','))
    os.makedirs(OUTDIR, exist_ok=True)
    rows = load_rows(statuses)
    if args.limit:
        rows = rows[:args.limit]
    jsonl_path = os.path.join(OUTDIR, 'citation-audit.jsonl')
    counts = {'STRONG': 0, 'WEAK': 0, 'MISMATCH': 0, 'NOMATCH': 0,
              'DOI_VERIFIED': 0, 'NO_DOI_IN_NOTES': 0,
              'WELL_FORMED': 0, 'STUB': 0}
    flagged = []   # MISMATCH / NOMATCH（well_formed のみ＝幻覚疑い）
    stubs = []     # 未成形書誌（著者/年欠落）
    with open(jsonl_path, 'w') as out:
        for i, row in enumerate(rows):
            au, yr, ti, wf = parse_citation(row['title_raw'])
            row['_author'], row['_year'], row['_title'] = au, yr, ti
            counts['WELL_FORMED' if wf else 'STUB'] += 1
            doi_in_notes = extract_doi(row['notes']) or extract_doi(row['title_raw'])
            cr = None
            method = None
            # 1) notes に DOI があれば DOI 直接照合（最優先・最も権威的）
            if doi_in_notes:
                cr_msg = crossref_by_doi(doi_in_notes)
                if cr_msg:
                    cr = cr_fields(cr_msg)
                    method = 'doi'
                    counts['DOI_VERIFIED'] += 1
                time.sleep(args.sleep)
                if cr is None:
                    oa = openalex_by_doi(doi_in_notes)
                    if oa:
                        cr = oa_fields(oa)
                        method = 'doi-oa'
                    time.sleep(args.sleep)
            else:
                counts['NO_DOI_IN_NOTES'] += 1
            # 2) DOI なし: Crossref bib 検索
            if cr is None:
                items = crossref_by_bib(ti, au, yr)
                if items:
                    cr = cr_fields(items[0])
                    method = 'bib'
                time.sleep(args.sleep)
            v, info = verdict(row, cr)
            # 3) Crossref で STRONG にならなければ OpenAlex で補完（preprint/書籍対策）
            oa_best = None
            if v != 'STRONG':
                results = openalex_search(ti, au)
                if results:
                    oa_best = oa_fields(results[0])
                    v2, info2 = verdict(row, oa_best)
                    rank = {'STRONG': 3, 'WEAK': 2, 'MISMATCH': 1, 'NOMATCH': 0}
                    if rank[v2] > rank[v]:
                        v, info, cr, method = v2, info2, oa_best, (method or '') + '+oa'
                time.sleep(args.sleep)
            counts[v] += 1
            rec = {'sid': row['sid'], 'did': row['did'], 'status': row['status'],
                   'entry_quality': 'WELL_FORMED' if wf else 'STUB',
                   'parsed': {'author': au, 'year': yr, 'title': ti[:120]},
                   'doi_in_notes': doi_in_notes, 'method': method,
                   'matched': cr, 'verdict': v, 'match': info}
            out.write(json.dumps(rec, ensure_ascii=False) + '\n')
            out.flush()
            # 幻覚疑いは well_formed なのに実在照合に失敗した行に限る
            if wf and v in ('MISMATCH', 'NOMATCH'):
                flagged.append(rec)
            if not wf:
                stubs.append(rec)
            print(f'[{i+1}/{len(rows)}] {row["sid"]} {"WF" if wf else "STUB"} {v}', flush=True)

    # markdown summary
    md = os.path.join(OUTDIR, 'citation-audit.md')
    with open(md, 'w') as f:
        f.write('# cs#253 A軸: 書誌実在性監査レポート\n\n')
        f.write(f'対象: {", ".join(sorted(statuses))} / {len(rows)} 行\n\n')
        f.write('2 軸で分類: **entry_quality**（書誌の整形度）× **existence**（Crossref 実在）\n\n')
        f.write('## 軸1: entry_quality\n\n')
        f.write('| quality | 件数 | 意味 |\n|---|---|---|\n')
        f.write(f'| WELL_FORMED | {counts["WELL_FORMED"]} | 著者+`(年)`+題 の整形済み引用 |\n')
        f.write(f'| STUB | {counts["STUB"]} | 著者/年欠落の topic 語句（**未成形書誌**） |\n\n')
        f.write('## 軸2: existence（Crossref 照合）\n\n')
        f.write('| verdict | 件数 | 意味 |\n|---|---|---|\n')
        f.write(f'| STRONG | {counts["STRONG"]} | 題類似≥0.7 かつ 年/著者一致 |\n')
        f.write(f'| WEAK | {counts["WEAK"]} | 部分一致（要目視） |\n')
        f.write(f'| MISMATCH | {counts["MISMATCH"]} | Crossref 上位と不一致 |\n')
        f.write(f'| NOMATCH | {counts["NOMATCH"]} | Crossref ヒットなし（非DOI書籍/STUB含む） |\n\n')
        f.write(f'- notes 内 DOI で直接検証: {counts["DOI_VERIFIED"]} 行\n')
        f.write(f'- notes に DOI なし（bib 検索のみ）: {counts["NO_DOI_IN_NOTES"]} 行\n\n')
        f.write('## 最重要: 幻覚疑い行（WELL_FORMED なのに MISMATCH/NOMATCH）\n\n')
        f.write('整形済み引用なのに Crossref 上位と一致しない＝誤記または実在しない疑い。\n\n')
        f.write('| sid | parsed | crossref top | verdict | sim |\n|---|---|---|---|---|\n')
        for r in flagged:
            p = r['parsed']
            cr = r['matched'] or {}
            f.write(f'| {r["sid"]} | {p["author"]} {p["year"]} — {p["title"][:50]} | '
                    f'{cr.get("author","-")} {cr.get("year","-")} — {(cr.get("title") or "-")[:50]} | '
                    f'{r["verdict"]} | {r["match"].get("title_sim","-")} |\n')
        f.write(f'\n## 未成形書誌 STUB（{len(stubs)} 行・著者/年を補うべき）\n\n')
        f.write('| sid | title_stub | crossref top (推定実体) | verdict |\n|---|---|---|---|\n')
        for r in stubs:
            p = r['parsed']
            cr = r['matched'] or {}
            f.write(f'| {r["sid"]} | {p["title"][:50]} | '
                    f'{cr.get("author","-")} {cr.get("year","-")} — {(cr.get("title") or "-")[:45]} | '
                    f'{r["verdict"]} |\n')
    print('\n=== SUMMARY ===')
    print(json.dumps(counts, ensure_ascii=False))
    print(f'flagged hallucination-suspect (WELL_FORMED & MISMATCH/NOMATCH): {len(flagged)}')
    print(f'stubs (under-specified): {len(stubs)}')
    print(f'report: {md}')

if __name__ == '__main__':
    main()
