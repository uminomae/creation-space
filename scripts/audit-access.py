#!/usr/bin/env python3
"""cs#253 B軸: OA 取得実態監査.

manifest の raw-confirmed / url-verified 行が notes に記す OA URL を実際に叩き、
「今この環境でオープンに本文取得できるか」を分類する。`url-verified` は一回限りの
主張なので、現実(HTTP code / content-type / PDF magic)と突合する。

コンテキスト保護: 結果は JSONL + markdown サマリにファイル出力、stdout は集計のみ。

使い方:
  python3 scripts/audit-access.py [--limit N] [--timeout 20] [--sleep 0.3]

分類 verdict:
  OA_PDF      200 かつ PDF（content-type or %PDF magic）= オープンに本文取得可
  OA_HTML     200 かつ HTML（全文ページ or landing/paywall。size を併記し人手判定補助）
  BLOCKED     401/403 = env ブロック or paywall（到達はするが本文拒否）
  DEAD        404/410 = リンク腐敗
  NET_ERR     接続不能（sandbox allowlist 外 / DNS / timeout）= 判定不能
  NO_URL      notes に URL 抽出不可
  OTHER       その他の HTTP code
"""
import re, os, sys, json, time, argparse, ssl
import urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, 'knowledge/raw/manifest.md')
OUTDIR = os.path.join(ROOT, 'knowledge/raw/audit')
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0 Safari/537.36')

def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--timeout', type=float, default=20)
    ap.add_argument('--sleep', type=float, default=0.3)
    ap.add_argument('--status', default='raw-confirmed,url-verified')
    return ap.parse_args()

URL_RE = re.compile(r'https?://[^\s)）。、]+')

def load_rows(statuses):
    rows = []
    with open(MANIFEST) as f:
        for line in f:
            m = re.match(r'^\| (D\d+-S\d+\w?) \| (D\d+) \| `([a-z-]+)` \|', line)
            if not m or m.group(3) not in statuses:
                continue
            cells = [c.strip() for c in line.rstrip('\n').split('|')]
            notes = cells[7] if len(cells) > 7 else ''
            title = cells[4] if len(cells) > 4 else ''
            # OA URL を優先抽出（"OA:" の後ろ → なければ notes 内最初の URL）
            url = None
            oam = re.search(r'OA:\s*(https?://\S+)', notes)
            if oam:
                url = oam.group(1).rstrip('。、)')
            else:
                um = URL_RE.search(notes)
                if um:
                    url = um.group(0)
            rows.append({'sid': m.group(1), 'did': m.group(2), 'status': m.group(3),
                         'url': url, 'title': title})
    return rows

def probe(url, timeout):
    """GET して (code, ctype, size, magic, final_url, err) を返す。"""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*'})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as r:
            chunk = r.read(2048)
            ctype = r.headers.get('Content-Type', '')
            clen = r.headers.get('Content-Length')
            size = int(clen) if clen and clen.isdigit() else len(chunk)
            magic = chunk[:5].decode('latin-1', 'replace')
            return r.getcode(), ctype, size, magic, r.geturl(), None
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get('Content-Type', '') if e.headers else '', 0, '', url, None
    except Exception as e:
        return None, '', 0, '', url, type(e).__name__

def classify(code, ctype, magic):
    if code is None:
        return 'NET_ERR'
    ct = (ctype or '').lower()
    is_pdf = 'pdf' in ct or magic.startswith('%PDF')
    if code == 200:
        if is_pdf:
            return 'OA_PDF'
        if 'html' in ct or magic.lower().startswith(('<!do', '<htm', '<?xm')):
            return 'OA_HTML'
        return 'OTHER'
    if code in (401, 403):
        return 'BLOCKED'
    if code in (404, 410):
        return 'DEAD'
    return 'OTHER'

def main():
    args = parse_args()
    statuses = set(args.status.split(','))
    os.makedirs(OUTDIR, exist_ok=True)
    rows = load_rows(statuses)
    if args.limit:
        rows = rows[:args.limit]
    jsonl_path = os.path.join(OUTDIR, 'access-audit.jsonl')
    counts = {k: 0 for k in ['OA_PDF', 'OA_HTML', 'BLOCKED', 'DEAD', 'NET_ERR', 'NO_URL', 'OTHER']}
    by_host = {}
    flagged = []   # BLOCKED / DEAD = url-verified 主張が現実と乖離
    with open(jsonl_path, 'w') as out:
        for i, row in enumerate(rows):
            if not row['url']:
                v = 'NO_URL'
                rec = {**{k: row[k] for k in ('sid', 'did', 'status')}, 'url': None, 'verdict': v}
            else:
                code, ctype, size, magic, final, err = probe(row['url'], args.timeout)
                v = classify(code, ctype, magic)
                host = re.sub(r'^https?://([^/]+)/.*', r'\1', row['url'])
                by_host.setdefault(host, {}).setdefault(v, 0)
                by_host[host][v] += 1
                rec = {**{k: row[k] for k in ('sid', 'did', 'status')},
                       'url': row['url'], 'http': code, 'ctype': ctype[:40],
                       'size': size, 'magic': magic, 'err': err, 'verdict': v}
                time.sleep(args.sleep)
            counts[v] += 1
            out.write(json.dumps(rec, ensure_ascii=False) + '\n')
            out.flush()
            if v in ('BLOCKED', 'DEAD'):
                flagged.append(rec)
            print(f'[{i+1}/{len(rows)}] {row["sid"]} {v}', flush=True)

    md = os.path.join(OUTDIR, 'access-audit.md')
    with open(md, 'w') as f:
        f.write('# cs#253 B軸: OA 取得実態監査レポート\n\n')
        f.write(f'対象: {", ".join(sorted(statuses))} / {len(rows)} 行\n\n')
        f.write('## 集計\n\n| verdict | 件数 | 意味 |\n|---|---|---|\n')
        f.write(f'| OA_PDF | {counts["OA_PDF"]} | 200+PDF = オープンに本文取得可 ✓ |\n')
        f.write(f'| OA_HTML | {counts["OA_HTML"]} | 200+HTML = 全文ページ or landing/paywall（要目視） |\n')
        f.write(f'| BLOCKED | {counts["BLOCKED"]} | 401/403 = env ブロック or paywall |\n')
        f.write(f'| DEAD | {counts["DEAD"]} | 404/410 = リンク腐敗 |\n')
        f.write(f'| NET_ERR | {counts["NET_ERR"]} | 接続不能（sandbox/DNS/timeout・判定不能） |\n')
        f.write(f'| NO_URL | {counts["NO_URL"]} | notes に URL 無し |\n')
        f.write(f'| OTHER | {counts["OTHER"]} | その他 |\n\n')
        f.write('## url-verified 主張と乖離する行（BLOCKED / DEAD）\n\n')
        f.write('`url-verified` を主張するが現在オープン取得できない行。env-block(別egress)か腐敗かの切り分けは host で判断。\n\n')
        f.write('| sid | status | verdict | http | url |\n|---|---|---|---|---|\n')
        for r in flagged:
            f.write(f'| {r["sid"]} | {r["status"]} | {r["verdict"]} | {r.get("http","-")} | {(r.get("url") or "")[:70]} |\n')
        f.write('\n## host 別集計（egress ブロックの偏りを見る）\n\n')
        f.write('| host | OA_PDF | OA_HTML | BLOCKED | DEAD | NET_ERR |\n|---|---|---|---|---|---|\n')
        for host, c in sorted(by_host.items(), key=lambda kv: -sum(kv[1].values())):
            if sum(c.values()) < 2:
                continue
            f.write(f'| {host} | {c.get("OA_PDF",0)} | {c.get("OA_HTML",0)} | '
                    f'{c.get("BLOCKED",0)} | {c.get("DEAD",0)} | {c.get("NET_ERR",0)} |\n')
    print('\n=== SUMMARY ===')
    print(json.dumps(counts, ensure_ascii=False))
    print(f'flagged (BLOCKED+DEAD): {len(flagged)}')
    print(f'report: {md}')

if __name__ == '__main__':
    main()
