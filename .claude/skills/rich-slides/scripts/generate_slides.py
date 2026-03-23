#!/usr/bin/env python3
"""
generate_slides.py — Convert Markdown to rich 16:9 HTML slide deck.

Usage:
    python generate_slides.py --input slides.md --output slides.html [--title "Title"] [--lang ja]

Input format:
    - Slides separated by `---` on its own line
    - Optional YAML frontmatter between opening `---` and second `---`
    - Layout hints via HTML comments: <!-- layout: split -->
    - Supports: headings, paragraphs, lists, tables, blockquotes, code blocks, images
"""

import argparse
import re
import sys
import json
from pathlib import Path
from html import escape


# ---------------------------------------------------------------------------
# Frontmatter
# ---------------------------------------------------------------------------

def parse_frontmatter(text: str) -> tuple[dict, str]:
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, re.DOTALL)
    if not m:
        return {}, text.strip()
    meta = {}
    for line in m.group(1).split('\n'):
        idx = line.find(':')
        if idx > 0:
            key = line[:idx].strip()
            val = line[idx + 1:].strip().strip('"').strip("'")
            meta[key] = val
    return meta, m.group(2).strip()


# ---------------------------------------------------------------------------
# Markdown → HTML (lightweight, no external deps)
# ---------------------------------------------------------------------------

def md_to_html(md: str) -> str:
    """Convert a single slide's markdown to HTML. Minimal but sufficient."""
    lines = md.split('\n')
    out = []
    in_list = None  # 'ul' or 'ol'
    in_code = False
    code_buf = []
    in_table = False
    table_buf = []
    delay = 0

    def next_delay():
        nonlocal delay
        delay += 1
        return f'animate-in delay-{min(delay, 5)}'

    def flush_list():
        nonlocal in_list
        if in_list:
            out.append(f'</{in_list}>')
            in_list = None

    def flush_table():
        nonlocal in_table, table_buf
        if not in_table:
            return
        in_table = False
        rows = table_buf
        table_buf = []
        if not rows:
            return
        html = f'<table class="{next_delay()}">'
        for i, row in enumerate(rows):
            cells = [c.strip() for c in row.strip('|').split('|')]
            # Skip separator row
            if all(re.match(r'^[-:]+$', c) for c in cells):
                continue
            tag = 'th' if i == 0 else 'td'
            html += '<tr>' + ''.join(f'<{tag}>{inline(c)}</{tag}>' for c in cells) + '</tr>'
        html += '</table>'
        out.append(html)

    def inline(text: str) -> str:
        """Inline markdown: bold, italic, code, links, images."""
        # Images
        text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img src="\2" alt="\1">', text)
        # Links
        text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" style="color:var(--accent-blue)">\1</a>', text)
        # Bold
        text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
        # Italic
        text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
        # Inline code
        text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
        return text

    for line in lines:
        # Code fence
        if line.strip().startswith('```'):
            if in_code:
                out.append(f'<pre class="{next_delay()}"><code>' + escape('\n'.join(code_buf)) + '</code></pre>')
                code_buf = []
                in_code = False
            else:
                flush_list()
                flush_table()
                in_code = True
            continue
        if in_code:
            code_buf.append(line)
            continue

        # Table
        if '|' in line and line.strip().startswith('|'):
            flush_list()
            if not in_table:
                in_table = True
            table_buf.append(line)
            continue
        else:
            flush_table()

        stripped = line.strip()
        if not stripped:
            flush_list()
            continue

        # Headings
        hm = re.match(r'^(#{1,3})\s+(.+)$', stripped)
        if hm:
            flush_list()
            level = len(hm.group(1))
            tag = f'h{level}'
            out.append(f'<{tag} class="{next_delay()}">{inline(hm.group(2))}</{tag}>')
            if level <= 2:
                suffix = '--green' if level == 2 and any(kw in hm.group(2) for kw in ['結論', 'まとめ', 'Conclusion', 'Takeaway']) else ''
                out.append(f'<div class="accent-line{" accent-line" + suffix if suffix else ""} {next_delay()}"></div>')
            continue

        # Blockquote
        if stripped.startswith('>'):
            flush_list()
            quote_text = inline(stripped.lstrip('> '))
            out.append(f'<blockquote class="{next_delay()}">{quote_text}</blockquote>')
            continue

        # Unordered list
        um = re.match(r'^[-*]\s+(.+)$', stripped)
        if um:
            if in_list != 'ul':
                flush_list()
                in_list = 'ul'
                out.append('<ul>')
            out.append(f'<li class="{next_delay()}">{inline(um.group(1))}</li>')
            continue

        # Ordered list
        om = re.match(r'^\d+\.\s+(.+)$', stripped)
        if om:
            if in_list != 'ol':
                flush_list()
                in_list = 'ol'
                out.append('<ol>')
            out.append(f'<li class="{next_delay()}">{inline(om.group(1))}</li>')
            continue

        # Paragraph
        flush_list()
        out.append(f'<p class="{next_delay()}">{inline(stripped)}</p>')

    flush_list()
    flush_table()
    if in_code and code_buf:
        out.append(f'<pre class="{next_delay()}"><code>' + escape('\n'.join(code_buf)) + '</code></pre>')

    return '\n'.join(out)


# ---------------------------------------------------------------------------
# Layout classification
# ---------------------------------------------------------------------------

def classify_slide(html: str, index: int, total: int, hint: str = '') -> tuple[str, str]:
    """Return (layout_class, bg_class) for a slide."""
    if hint:
        layout = hint
    elif index == 0:
        layout = 'title'
    elif index == total - 1:
        layout = 'conclusion'
    elif '<img ' in html and html.count('<p') <= 1:
        layout = 'visual'
    elif '<table' in html:
        layout = 'data'
    elif '<blockquote' in html and html.count('<p') <= 2 and '<ul>' not in html and '<ol>' not in html:
        layout = 'quote'
    elif 'metric-value' in html or 'metric-box' in html:
        layout = 'data'
    else:
        layout = 'content'

    bg_map = {
        'title': 'violet',
        'section': 'blue',
        'content': 'blue',
        'split': 'blue',
        'data': 'violet',
        'visual': 'blue',
        'quote': 'amber',
        'conclusion': 'green',
    }
    bg = bg_map.get(layout, 'blue')
    return f'layout-{layout}', f'slide-bg--{bg}'


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------

def build_slides_html(md_text: str, title: str = '', lang: str = 'ja') -> str:
    meta, body = parse_frontmatter(md_text)
    title = title or meta.get('title', 'Slides')
    lang = lang or meta.get('lang', 'ja')

    chunks = re.split(r'\n---\n', body)
    chunks = [c.strip() for c in chunks if c.strip()]

    slides_html = []
    for i, chunk in enumerate(chunks):
        # Check for layout hint comment
        hint = ''
        hm = re.search(r'<!--\s*layout:\s*(\w+)\s*-->', chunk)
        if hm:
            hint = hm.group(1)
            chunk = chunk[:hm.start()] + chunk[hm.end():]

        inner_html = md_to_html(chunk.strip())
        layout_cls, bg_cls = classify_slide(inner_html, i, len(chunks), hint)

        active = ' active' if i == 0 else ''
        slide = f'''<div class="slide {layout_cls}{active}">
  <div class="slide-inner">
    <div class="slide-bg {bg_cls}"></div>
    <div class="slide-content">
{inner_html}
    </div>
  </div>
</div>'''
        slides_html.append(slide)

    # Read the design-spec template
    spec_path = Path(__file__).parent.parent / 'references' / 'design-spec.md'
    if spec_path.exists():
        spec_text = spec_path.read_text()
        # Extract the HTML shell from the code block
        shell_match = re.search(r'```html\n(<!DOCTYPE html>.*?)</body>\s*</html>\s*```', spec_text, re.DOTALL)
        if shell_match:
            template = shell_match.group(1) + '</body>\n</html>'
            # Insert slides
            template = template.replace('  <!-- SLIDES GO HERE -->', '\n'.join(slides_html))
            template = template.replace('{{TITLE}}', escape(title))
            template = template.replace('lang="ja"', f'lang="{lang}"')
            return template

    # Fallback: minimal shell
    return _fallback_shell(slides_html, title, lang)


def _fallback_shell(slides_html: list, title: str, lang: str) -> str:
    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{escape(title)}</title>
<style>
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
html, body {{ width: 100%; height: 100%; background: #0a0e17; color: #f1f5f9; font-family: "Inter", "Noto Sans JP", system-ui, sans-serif; overflow: hidden; }}
.deck {{ width: 100vw; height: 100vh; position: relative; }}
.slide {{ position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0; visibility: hidden; transition: opacity 0.28s ease, visibility 0.28s ease; }}
.slide.active {{ opacity: 1; visibility: visible; }}
.slide-inner {{ width: min(92vw, calc(88vh * 16 / 9)); aspect-ratio: 16 / 9; border-radius: 16px; border: 1px solid rgba(148,163,184,0.14); overflow: hidden; position: relative; box-shadow: 0 24px 80px rgba(0,0,0,0.5); }}
.slide-bg {{ position: absolute; inset: 0; background: linear-gradient(180deg, #0c1220, #0a0e17); }}
.slide-content {{ position: relative; z-index: 1; width: 100%; height: 100%; padding: 3.5rem 4rem; display: flex; flex-direction: column; }}
h1 {{ font-size: 2.5rem; font-weight: 700; }}
h2 {{ font-size: 1.8rem; font-weight: 600; margin-bottom: 1rem; }}
p {{ font-size: 1rem; line-height: 1.8; margin-bottom: 0.8rem; }}
</style>
</head>
<body>
<div class="deck" id="deck">
{chr(10).join(slides_html)}
</div>
<script>
const slides=document.querySelectorAll('.slide');let cur=0;
function show(i){{slides.forEach((s,idx)=>s.classList.toggle('active',idx===i));}}
function go(d){{const n=Math.max(0,Math.min(slides.length-1,cur+d));if(n!==cur){{cur=n;show(cur);}}}}
document.addEventListener('keydown',e=>{{if(e.key==='ArrowRight'||e.key===' '){{e.preventDefault();go(1);}}if(e.key==='ArrowLeft'){{e.preventDefault();go(-1);}}}}); show(0);
</script>
</body>
</html>'''


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description='Generate rich HTML slides from Markdown')
    parser.add_argument('--input', '-i', required=True, help='Input Markdown file')
    parser.add_argument('--output', '-o', required=True, help='Output HTML file')
    parser.add_argument('--title', '-t', default='', help='Presentation title')
    parser.add_argument('--lang', '-l', default='ja', help='Language code')
    args = parser.parse_args()

    md_text = Path(args.input).read_text(encoding='utf-8')
    html = build_slides_html(md_text, title=args.title, lang=args.lang)
    Path(args.output).write_text(html, encoding='utf-8')
    print(f'Generated: {args.output} ({len(html):,} bytes)')


if __name__ == '__main__':
    main()
