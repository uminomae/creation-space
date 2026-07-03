#!/usr/bin/env python3
"""cs#254: 公開ページの主張接地監査（機械抽出 v1）.

鎖の不変条件（持つ→読む→解釈→まとめる→**公開**）を公開層に適用する。
公開レポート（pjdhiro/assets/creation/domains/{ja,en}/md/）から「偽の精密さ」の
表面——§/頁/章アンカー付き引用・著者-年帰属——を機械抽出し、その帰属先原典が
T1_READ（精読済み source-note あり）かどうかを confidence-tier で突合する。

CL-010: §・頁引用は source-note が実在するときのみ許される。未精読/取得不能原典への
精密引用は「偽の精密さ」＝幻覚の隠れ蓑。

判定（prose は id 引用でないため決定的 join は不可。本 v1 は候補抽出=WARN 止まり）:
  OK        近傍で「精読済み」を自己宣言、または帰属著者が T1_READ の source-note に一致
  FLAG      帰属著者が非 T1（T5_READLIST/未精読/ノート無）に一致＝偽の精密さ候補
  REVIEW    帰属著者を manifest に機械照合できない精密アンカー＝人手確認

出力:
  knowledge/raw/audit/public-grounding.jsonl / .md
  cs#253 audit family と同様、API 不要・既存成果物の決定的 join + 正規表現抽出のみ。
"""
import re, os, json, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD = os.path.join(ROOT, 'knowledge/raw/audit')
MANIFEST = os.path.join(ROOT, 'knowledge/raw/manifest.md')
TIER = os.path.join(AUD, 'confidence-tier.jsonl')
# 公開 MD 正本は pjdhiro/assets/creation
PJDHIRO = os.path.normpath(os.path.join(ROOT, '..', 'pjdhiro'))
REPORTS_GLOB = os.path.join(PJDHIRO, 'assets/creation/domains/*/md/domain-D*.md')

# 精密アンカー: §, pp./p., 〜頁, 第N章
ANCHOR_RE = re.compile(r'§\s*[0-9IVXivx][0-9IVXivx.\-]*|pp?\.\s*[0-9]+(?:\s*[-–]\s*[0-9]+)?|[0-9]+\s*頁|第\s*[0-9一二三四五六七八九十]+\s*章')
# 著者-年帰属（英字姓 + 年）: "Deleuze (1966)" 等
AUTHYEAR_RE = re.compile(r'([A-Z][A-Za-zÀ-ɏ\-]{2,})\s*\((?:18|19|20)[0-9]{2}')
# 「精読済み」自己宣言
READ_DECL_RE = re.compile(r'精読済|読解済|全章精読|全文精読')
# 接地注記（cs#254 の標準化マーカー）: 「原典精読による検証ではない＝背景説明」の明示。
# CL-010 の偽の精密さは、精読を主張しないことを明示した時点で解消する。セクション単位で有効。
DISCLAIM_RE = re.compile(
    r'原典の精読による検証を主張するものではありません'
    r'|原典精読による確認ではない'
    r'|直接精読していない'
    r'|verification by close reading'
)
# 見出し行（セクション境界）
HEADING_RE = re.compile(r'^\s{0,3}#{1,6}\s')


def load_tier():
    d = {}
    if not os.path.exists(TIER):
        return d
    for line in open(TIER):
        line = line.strip()
        if not line:
            continue
        r = json.loads(line)
        d[r['sid']] = r
    return d


def domain_authors(tier):
    """manifest から domain_id -> [(surname_lower, sid)] を作る（英字姓のみ抽出）。"""
    by_dom = {}
    if not os.path.exists(MANIFEST):
        return by_dom
    for line in open(MANIFEST):
        if not line.startswith('| D'):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) < 4:
            continue
        sid, dom, _status, title = cells[0], cells[1], cells[2], cells[3]
        if not re.match(r'^D\d+-S\d+$', sid):
            continue
        # title 冒頭の英字姓を抽出（"Tonegawa, S. (1987)..." / "能勢朝次 (1944)..."）
        for m in re.finditer(r'[A-Z][A-Za-zÀ-ɏ\-]{2,}', title):
            by_dom.setdefault(dom, []).append((m.group(0).lower(), sid))
    return by_dom


def main():
    tier = load_tier()
    by_dom = domain_authors(tier)
    rows = []
    for path in sorted(glob.glob(REPORTS_GLOB)):
        base = os.path.basename(path)
        m = re.search(r'domain-(D\d+)', base)
        if not m:
            continue
        dom = m.group(1)
        lang = 'ja' if '/ja/' in path else ('en' if '/en/' in path else '?')
        authors = by_dom.get(dom, [])
        lines = open(path).read().split('\n')
        # セクション（見出し境界）ごとに接地注記の有無を先に判定する。
        # cs#254 の接地注記はブロック（P2=節末・P3=表直前の blockquote）に置かれ、
        # FLAG 候補行と同一節に共存する。行ローカル判定では拾えないため節単位で被覆する。
        sec_disclaimed = [False] * (len(lines) + 1)
        cur = []
        has_disc = False
        for idx, ln in enumerate(lines, 1):
            if HEADING_RE.match(ln):
                for j in cur:
                    sec_disclaimed[j] = has_disc
                cur, has_disc = [], False
            cur.append(idx)
            if DISCLAIM_RE.search(ln):
                has_disc = True
        for j in cur:
            sec_disclaimed[j] = has_disc
        for i, raw in enumerate(lines, 1):
            line = raw
            anchors = ANCHOR_RE.findall(line)
            ay = AUTHYEAR_RE.findall(line)
            if not anchors and not ay:
                continue
            # このアンカー/帰属行に精密引用があるか
            has_anchor = bool(anchors)
            self_read = bool(READ_DECL_RE.search(line))
            # 近傍著者を domain の sid に照合
            matched = []
            for surname in {a.lower() for a in ay}:
                for msurname, sid in authors:
                    if surname == msurname or surname in msurname or msurname in surname:
                        matched.append(sid)
            matched = sorted(set(matched))
            verdict = None
            note = ''
            if self_read:
                verdict = 'OK'
                note = '近傍で精読済みを自己宣言'
            elif matched:
                tiers = {sid: tier.get(sid, {}).get('tier', 'UNKNOWN') for sid in matched}
                if any(t == 'T1_READ' for t in tiers.values()):
                    verdict = 'OK'
                    note = f'T1 一致: {tiers}'
                elif sec_disclaimed[i]:
                    verdict = 'GROUNDED'
                    note = f'接地注記により背景説明と明示（cs#254 処置済）: {tiers}'
                else:
                    verdict = 'FLAG'
                    note = f'非T1 帰属: {tiers}'
            else:
                # アンカー付きだが著者を照合できない = 要人手確認
                verdict = 'REVIEW' if has_anchor else None
                note = '精密アンカーあり・著者照合不可' if has_anchor else ''
            if verdict is None:
                continue
            rows.append({
                'domain': dom, 'lang': lang, 'line': i,
                'anchors': anchors, 'authors': ay, 'matched': matched,
                'verdict': verdict, 'note': note,
                'text': line.strip()[:200],
            })

    # 出力
    os.makedirs(AUD, exist_ok=True)
    with open(os.path.join(AUD, 'public-grounding.jsonl'), 'w') as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + '\n')

    counts = {}
    for r in rows:
        counts[r['verdict']] = counts.get(r['verdict'], 0) + 1
    flags = [r for r in rows if r['verdict'] == 'FLAG']
    reviews = [r for r in rows if r['verdict'] == 'REVIEW']
    grounded = [r for r in rows if r['verdict'] == 'GROUNDED']

    md = []
    md.append('# 公開ページ主張接地監査 (cs#254, 機械抽出 v1)\n')
    md.append(f'対象: `pjdhiro/assets/creation/domains/{{ja,en}}/md/` の公開レポート\n')
    md.append(f'判定: OK={counts.get("OK",0)} / **FLAG={counts.get("FLAG",0)}** / '
              f'GROUNDED={counts.get("GROUNDED",0)} / REVIEW={counts.get("REVIEW",0)}\n')
    md.append('> FLAG=非T1原典への精密帰属（偽の精密さ候補・未処置）。'
              'GROUNDED=同一節に cs#254 接地注記があり背景説明と明示済（処置済）。'
              'REVIEW=著者を manifest に機械照合できない精密アンカー。\n')
    md.append('> prose は id 引用でないため本 v1 は候補抽出（人手/LLM 確認前提）。決定的 FAIL ゲートではない。\n')
    if flags:
        md.append('\n## FLAG — 非T1原典への精密帰属（未処置）\n')
        for r in flags:
            md.append(f'- **{r["domain"]}/{r["lang"]}:{r["line"]}** {r["note"]}\n  - `{r["text"]}`')
    if grounded:
        md.append('\n## GROUNDED — cs#254 接地注記で処置済\n')
        for r in grounded:
            md.append(f'- {r["domain"]}/{r["lang"]}:{r["line"]} {r["note"]}\n  - `{r["text"]}`')
    if reviews:
        md.append('\n## REVIEW — 精密アンカー・著者照合不可（人手確認）\n')
        for r in reviews:
            md.append(f'- {r["domain"]}/{r["lang"]}:{r["line"]} anchors={r["anchors"]}\n  - `{r["text"]}`')
    with open(os.path.join(AUD, 'public-grounding.md'), 'w') as f:
        f.write('\n'.join(md) + '\n')

    print(f'[public-grounding] reports scanned, rows={len(rows)} '
          f'OK={counts.get("OK",0)} FLAG={counts.get("FLAG",0)} '
          f'GROUNDED={counts.get("GROUNDED",0)} REVIEW={counts.get("REVIEW",0)}')
    print(f'  -> {os.path.join(AUD, "public-grounding.md")}')


if __name__ == '__main__':
    main()
