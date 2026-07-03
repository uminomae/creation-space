#!/usr/bin/env python3
"""audit-raw-content.py — raw PDF の中身 vs manifest 書誌の照合 (cs#255)

背景: Check 8/10 は「ファイル名・書誌テキスト」ベースで、PDF の中身は見ていない。
D05-S15 / D23 で「ファイル名は正しいが中身が別論文」の取り違えが発覚した
(cs#249 backfill)。本スクリプトは raw-confirmed の各 PDF について冒頭数頁を
pdftotext で抽出し、manifest の source_title(著者姓/年/タイトル語) と照合して
不一致候補を WARN 出力する。

使い方:
  python3 scripts/audit-raw-content.py            # 全 raw-confirmed を照合
  python3 scripts/audit-raw-content.py --json      # JSONL も出力
  python3 scripts/audit-raw-content.py --only D23   # 領域を絞る

判定はヒューリスティック。WARN は「人手レビュー候補」であって確定ではない。
翻訳版・分割 part・スキャン表紙・クロス領域 anchor 等の正規パターンは
除外リストで抑制する（issue cs#255 の既知パターン）。
"""
import argparse
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
MANIFEST = REPO / "knowledge" / "raw" / "manifest.md"

# 既知の正規パターン（誤検知として WARN を抑制する source_id）。
# cs#255 (2026-07-03) で全 raw PDF を実物照合し、以下は「中身は正しい原典。
# ヒューリスティックが照合できない正規理由がある」ものと確認済み。
# 将来 WARN に出る = ここに無い新規の不一致 = 要調査。
KNOWN_OK = {
    # 原典 vs 翻訳（同 stem・別 source_id）
    "D16-S08": "アラビア語原典 Muqaddimah（p1装丁・本文アラビア語。実物確認済）",
    "D16-S09": "Rosenthal 英訳",
    # OCR 崩れ・スキャン表紙・前付け（本文/後頁に正しい書誌）
    "D14-S01": "Varela Embodied Mind。p1 OCR崩れだが Francisco J. Varela/1991 確認。cross-domain anchor",
    "D08-S08": "同 D14_varela ファイル（cross-domain anchor D14+D08）",
    "D18-S01": "Durkheim。archive.org デジタル化告知が p1（deladivisiondu…durk のIA id 確認）",
    "D02-S12": "Lorenz。p1-2 が DL 透かしのみ。本文は後頁",
    "D07-S04": "Rumelhart backprop。p1 が © 1986 Nature Publishing Group",
    "D12-S01": "Clements Plant Succession。p1 が Carnegie Institution 1916 表紙",
    "D19-S10": "Barthes S/Z。p1 が著作一覧の前付け（OCR崩れ）。短タイトルで語照合不能",
    "D19-S12": "Aristotle Poetics。Butcher 版のギリシャ語スキャン表紙",
    "D24-S11": "James Varieties。p1 が同著者他作リストの前付け（Toronto 蔵書）",
    "D25-S07": "Mauss。英訳 'The Gift'（仏原題 Essai sur le don の翻訳）",
    # 非ラテン文字タイトル（pdftotext + ASCII 正規化で照合不能。中身は一致）
    "D12-S07": "農水省 IPM 実践指針。日本語タイトルが p1 に完全一致",
    "D23-S06": "木下孝司 幼児自己映像。日本語タイトルが p1 に完全一致（神戸大リポジトリ）",
    "D30-S09": "松木孝和・沼田秀穂 一座建立。日本語（cs#255 で書誌是正済）",
    # manifest 書誌がタイトルを省略/略記（中身は正しい）
    "D22-S05": "Stanford d.school Design Thinking Process Guide。p1 に完全一致（(d.school) を年括弧と誤パース）",
    "D30-S03": "IPBES 2019 ILK guidance。IPBES/7/INF/8 の正式文書（略記タイトル）",
}

STOPWORDS = {
    "the", "a", "an", "of", "and", "or", "in", "on", "to", "for", "with",
    "from", "by", "as", "at", "is", "are", "be", "its", "der", "die", "das",
    "und", "von", "einer", "eines", "la", "le", "les", "des", "du", "et",
    "il", "un", "une", "sur", "vol", "no", "pp", "trans", "ed", "eds",
}


def strip_accents(s: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFKD", s) if not unicodedata.combining(c)
    )


def normalize(s: str) -> str:
    s = strip_accents(s.lower())
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def parse_manifest():
    """raw-confirmed かつ local_file が .pdf の行を返す。"""
    rows = []
    for line in MANIFEST.read_text(encoding="utf-8").splitlines():
        if not line.startswith("| D") or "raw-confirmed" not in line:
            continue
        cols = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cols) < 5:
            continue
        source_id, domain_id, access, title, local_file = cols[:5]
        m = re.search(r"`([^`]+\.pdf)`", local_file)
        if not m:
            continue
        rows.append({
            "source_id": source_id,
            "domain_id": domain_id,
            "title": title,
            "local_file": m.group(1),
        })
    return rows


def extract_biblio(title: str):
    """source_title から著者姓・年・タイトル語を抽出。

    例: 'Bott, R. (1988). Morse Theory Indomitable.'
        -> surnames=['bott'], year='1988', title_tokens={morse,theory,indomitable}
       'Thurston (1994). On Proof and Progress in Mathematics. *Bull. AMS* 30(2).'
        -> surnames=['thurston'], year='1994', title_tokens={proof,progress,mathematics}
    """
    year = None
    ym = re.search(r"\((\d{4})", title)
    if ym:
        year = ym.group(1)

    # 著者部 = 最初の ( の手前
    author_part = title.split("(")[0]
    surnames = []
    # 'Bott, R.' / 'Nelson & Winter' / 'Krasner' 形式に対応
    for chunk in re.split(r"[&;/]| and ", author_part):
        chunk = chunk.strip()
        if not chunk:
            continue
        # 'Surname, F.' -> Surname; 'Surname' -> Surname
        surname = chunk.split(",")[0].strip()
        surname = normalize(surname)
        # 1語のみ（イニシャル除去後）で長さ>=3 を採る
        toks = [t for t in surname.split() if len(t) >= 3]
        if toks:
            surnames.append(toks[-1])  # 複合姓は最後の語

    # タイトル部 = 最初の ). の後～次の . まで
    title_body = title
    after = re.split(r"\)\s*\.?\s*", title, maxsplit=1)
    if len(after) > 1:
        title_body = after[1]
    title_body = title_body.strip()
    # 書籍は TITLE がイタリック *...*、論文は JOURNAL がイタリックでタイトルは plain。
    # → body がイタリックで始まれば最初の *...* をタイトルとして採る（書籍）。
    #   そうでなければ最初の *...* 手前（or 最初の '. ' まで）を採る（論文）。
    if title_body.startswith("*"):
        m = re.search(r"\*([^*]+)\*", title_body)
        title_body = m.group(1) if m else title_body.strip("*")
    else:
        title_body = title_body.split("*")[0]
        title_body = re.split(r"\.\s", title_body)[0]
    title_norm = normalize(title_body)
    title_tokens = {
        t for t in title_norm.split() if len(t) >= 4 and t not in STOPWORDS
    }
    return surnames, year, title_tokens


def pdf_head_text(pdf_path: Path, pages: int = 3) -> str:
    try:
        out = subprocess.run(
            ["pdftotext", "-f", "1", "-l", str(pages), str(pdf_path), "-"],
            capture_output=True, timeout=60,
        )
        return out.stdout.decode("utf-8", errors="replace")
    except Exception as e:  # noqa
        return f"__PDFERROR__ {e}"


def audit_row(row):
    pdf = REPO / row["local_file"]
    result = {**row, "status": "OK", "notes": []}
    if not pdf.exists():
        result["status"] = "MISSING_PDF"
        result["notes"].append("local_file が存在しない")
        return result

    text = pdf_head_text(pdf)
    if text.startswith("__PDFERROR__"):
        result["status"] = "PDF_ERROR"
        result["notes"].append(text)
        return result
    norm = normalize(text)
    if len(norm) < 40:
        # 画像スキャンでテキスト層なし。中身照合不能（画像 OCR は範囲外）
        result["status"] = "NO_TEXT"
        result["notes"].append(f"冒頭テキスト層が薄い({len(norm)}字)。画像PDFの可能性")
        return result

    surnames, year, title_tokens = extract_biblio(row["title"])

    author_hit = any(s in norm for s in surnames) if surnames else None
    year_hit = (year in text) if year else None
    if title_tokens:
        hit = {t for t in title_tokens if t in norm}
        title_frac = len(hit) / len(title_tokens)
    else:
        title_frac = None
        hit = set()

    result["author_hit"] = author_hit
    result["year_hit"] = year_hit
    result["title_frac"] = round(title_frac, 2) if title_frac is not None else None
    result["title_hits"] = sorted(hit)
    result["title_tokens"] = sorted(title_tokens)
    result["surnames"] = surnames
    result["year"] = year

    # 判定ヒューリスティック
    # 強一致: タイトル語被覆 >=0.5 or (>=0.34 かつ著者一致)
    # 疑わしい: 著者もタイトルもほぼ出ない
    strong = (title_frac is not None and title_frac >= 0.5) or \
             (title_frac is not None and title_frac >= 0.34 and author_hit)
    if strong:
        result["status"] = "OK"
    elif author_hit and (title_frac is None or title_frac >= 0.2):
        result["status"] = "OK"
        result["notes"].append("著者一致・タイトル被覆低（表紙/翻訳の可能性）")
    else:
        result["status"] = "WARN"
        bits = []
        if author_hit is False:
            bits.append(f"著者{surnames}不出現")
        if title_frac is not None:
            bits.append(f"タイトル被覆{title_frac:.0%}")
        if year_hit is False:
            bits.append(f"年{year}不出現")
        result["notes"].append("中身が書誌と不一致の疑い: " + ", ".join(bits))

    if row["source_id"] in KNOWN_OK and result["status"] == "WARN":
        result["status"] = "OK_KNOWN"
        result["notes"].append("既知正規パターン: " + KNOWN_OK[row["source_id"]])
    return result


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true", help="JSONL も出力")
    ap.add_argument("--only", help="領域で絞る (例: D23)")
    ap.add_argument("--all", action="store_true", help="OK 行も表示")
    args = ap.parse_args()

    rows = parse_manifest()
    if args.only:
        rows = [r for r in rows if r["domain_id"] == args.only]

    results = [audit_row(r) for r in rows]

    # 孤立 PDF（manifest 本文のどこにも .pdf パスとして現れないもの）。
    # local_file 列だけでなく notes 列（part2 / gitignore ローカル保持パス等）も走査する。
    manifest_text = MANIFEST.read_text(encoding="utf-8")
    referenced = set(re.findall(r"knowledge/raw/[^`\s|]+\.pdf", manifest_text))
    raw_dir = REPO / "knowledge" / "raw"
    orphans = [
        f"knowledge/raw/{p.name}" for p in sorted(raw_dir.glob("*.pdf"))
        if f"knowledge/raw/{p.name}" not in referenced
    ]

    by_status = {}
    for r in results:
        by_status.setdefault(r["status"], []).append(r)

    print(f"# cs#255 raw content 照合レポート")
    print(f"対象 raw-confirmed PDF 行: {len(results)}")
    for st in ["OK", "OK_KNOWN", "WARN", "NO_TEXT", "PDF_ERROR", "MISSING_PDF"]:
        n = len(by_status.get(st, []))
        if n:
            print(f"- {st}: {n}")
    if orphans:
        print(f"- 孤立PDF(manifest行なし): {len(orphans)}")

    for st in ["WARN", "MISSING_PDF", "PDF_ERROR", "NO_TEXT"]:
        items = by_status.get(st, [])
        if not items:
            continue
        print(f"\n## {st} ({len(items)})")
        for r in items:
            print(f"- **{r['source_id']}** {r['local_file']}")
            print(f"  - 書誌: {r['title']}")
            for note in r["notes"]:
                print(f"  - {note}")
            if st == "WARN":
                print(f"  - hits: title={r.get('title_hits')} / author={r.get('author_hit')} / year={r.get('year_hit')}")

    if args.all:
        print(f"\n## OK ({len(by_status.get('OK', []))})")
        for r in by_status.get("OK", []):
            print(f"- {r['source_id']} title_frac={r.get('title_frac')} author={r.get('author_hit')}")

    if orphans:
        print(f"\n## 孤立PDF ({len(orphans)})")
        for o in orphans:
            print(f"- {o}")

    if args.json:
        out = REPO / "knowledge" / "raw" / "audit" / "raw-content.jsonl"
        out.parent.mkdir(parents=True, exist_ok=True)
        with out.open("w", encoding="utf-8") as f:
            for r in results:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
        print(f"\nJSONL: {out.relative_to(REPO)}")

    # WARN があれば exit 1（standing 化時の CI 判定用）
    return 1 if by_status.get("WARN") or by_status.get("MISSING_PDF") else 0


if __name__ == "__main__":
    sys.exit(main())
