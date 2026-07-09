#!/usr/bin/env python3
"""READER (evidence/themes/ の MD 正本) からテーマ解説ページ HTML を生成する。

正本: evidence/themes/TH-001-wave-vortex-ontology/READER-wave-vortex.md
出力: reader/wave-vortex.html
使い方: python3 scripts/build-reader-th.py [--src PATH] [--out PATH]

READER を更新したら本スクリプトを再実行してページを追随させる。
pd の scripts/build-reader-lp.py の cs 移植（cs#259）。

デザイン制約:
- 生成ページは cs の VI を継承する（dashboard.html 方式: tokens.css + cosmic ambient。WebGL なし）
- クラス名は cs 用に新設（reader-heading / reader-card / reader-callout / reader-table）。
  pd の glow-* 体系は cs に存在しないため持ち込まない
- 色・面はテンプレート側で token 変数経由で定義する（本スクリプトは構造フックのみ付与）
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SRC = ROOT / "evidence/themes/TH-001-wave-vortex-ontology/READER-wave-vortex.md"
TPL = ROOT / "scripts/reader-th-template.html"
DEFAULT_OUT = ROOT / "reader/wave-vortex.html"

# 信頼度バッジ: 正本 MD 内の表記をテンプレート定義のバッジ span に変換する
# 目次挿入位置マーカー（正本 MD 側に置く）と、pandoc 変換を生き延びる placeholder
TOC_MARKER = "<!--TOC-->"
TOC_PLACEHOLDER = "CSREADERTOCPLACEHOLDER9f2b"

BADGES = [
    ("実証済み [P]", "badge-p"),
    ("解釈 [M]", "badge-m"),
    ("推測 [S]", "badge-s"),
]


def convert_md(body_md: str) -> tuple[str, str]:
    """GFM → HTML。pandoc を優先し、無ければ npx marked にフォールバックする。

    戻り値: (html, 使用したコンバータ名)
    """
    try:
        r = subprocess.run(
            ["pandoc", "-f", "gfm", "-t", "html", "--wrap=none"],
            input=body_md, capture_output=True, text=True, check=True,
        )
        return r.stdout, "pandoc"
    except FileNotFoundError:
        pass  # pandoc 不在 → marked へ
    # フォールバック: npx marked --gfm（cs は marked を UI 側でも使用）
    r = subprocess.run(
        ["npx", "--yes", "marked", "--gfm"],
        input=body_md, capture_output=True, text=True,
    )
    if r.returncode != 0:
        sys.exit(f"ERROR: pandoc not found and npx marked failed:\n{r.stderr}")
    html = r.stdout
    # marked は見出しに id を付けないため、TOC 用に h2 へ id を補う
    counter = [0]

    def add_id(m: re.Match) -> str:
        counter[0] += 1
        return f'<h2 id="sec-{counter[0]}">'

    html = re.sub(r"<h2>", add_id, html)
    return html, "npx marked (fallback)"


def main() -> None:
    ap = argparse.ArgumentParser(description="READER MD からテーマ解説 HTML を生成する")
    ap.add_argument("--src", type=Path, default=DEFAULT_SRC, help="正本 MD のパス")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT, help="出力 HTML のパス")
    args = ap.parse_args()
    src: Path = args.src
    out: Path = args.out

    if not src.exists():
        sys.exit(f"ERROR: source MD not found: {src}")

    md = src.read_text(encoding="utf-8")

    # front matter を剥がす
    m = re.match(r"^---\n.*?\n---\n", md, re.S)
    body_md = md[m.end():] if m else md

    # <!--TOC--> マーカーは HTML コメントのため pandoc (gfm) が
    # &lt;!--TOC--&gt; にエスケープしてしまう。変換前にプレーンテキストの
    # プレースホルダへ差し替えて変換を生き延びさせ、変換後に目次と置換する。
    if TOC_MARKER not in body_md:
        sys.exit("ERROR: <!--TOC--> marker not found in source MD")
    body_md = body_md.replace(TOC_MARKER, TOC_PLACEHOLDER, 1)

    # 最終更新日は正本の git 履歴から取る（未追跡ファイル＝fixture 等は unknown）
    try:
        updated = subprocess.run(
            ["git", "log", "-1", "--format=%ad", "--date=format:%Y-%m-%d", "--", str(src)],
            cwd=ROOT, capture_output=True, text=True, check=True,
        ).stdout.strip() or "unknown"
    except subprocess.CalledProcessError:
        updated = "unknown"

    # GFM → HTML
    html, converter = convert_md(body_md)
    print(f"[converter] {converter}")

    # 先頭 H1 はテンプレートの hero と重複するため除去
    html = re.sub(r"<h1[^>]*>.*?</h1>\s*", "", html, count=1)

    # 見出しクラス付与（cs 用に reader-heading を新設。pd の glow-heading は使わない）
    html = re.sub(
        r"<h([23])( |>)",
        lambda mm: f'<h{mm.group(1)} class="reader-heading"' + (" " if mm.group(2) == " " else ">"),
        html,
    )
    # 表・引用はカードパネル（reader-card）に載せる。色はテンプレート側 token 変数で定義
    html = re.sub(r"(<table\b.*?</table>)", r'<div class="reader-card reader-table">\1</div>', html, flags=re.S)
    html = html.replace("<blockquote>", '<blockquote class="reader-card reader-callout">')

    # 信頼度バッジ: 「実証済み [P]」等の表記をバッジ span に変換
    for text, cls in BADGES:
        html = html.replace(text, f'<span class="{cls}">{text}</span>')

    # 目次: 本文の h2（章）から生成し、正本 MD の <!--TOC--> 位置に挿す
    toc_items = []
    for hid, text in re.findall(r'<h2[^>]*\bid="([^"]+)"[^>]*>(.*?)</h2>', html, flags=re.S):
        label = re.sub(r"<[^>]+>", "", text).strip()
        toc_items.append(f'<li><a href="#{hid}">{label}</a></li>')
    toc_html = (
        '<nav class="reader-toc reader-card" aria-label="目次">'
        '<p class="reader-toc-title">目次</p>'
        "<ol>" + "".join(toc_items) + "</ol></nav>"
    )
    ph = re.compile(r"<p>\s*" + TOC_PLACEHOLDER + r"\s*</p>|" + TOC_PLACEHOLDER)
    if not ph.search(html):
        sys.exit("ERROR: <!--TOC--> marker (placeholder) not found in generated body")
    html = ph.sub(lambda _: toc_html, html, count=1)

    page = TPL.read_text(encoding="utf-8")
    page = page.replace("<!--BODY-->", html).replace("<!--UPDATED-->", updated)

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")

    # UTF-8 置換文字（U+FFFD）検査
    if "�" in page:
        sys.exit("ERROR: U+FFFD found in output")
    try:
        shown = out.resolve().relative_to(ROOT)
    except ValueError:
        shown = out
    print(f"OK: {shown} ({len(page.encode('utf-8')):,} bytes, updated {updated}, converter: {converter})")


if __name__ == "__main__":
    main()
