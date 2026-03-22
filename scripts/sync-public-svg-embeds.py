#!/usr/bin/env python3
"""
sync-public-svg-embeds.py

Synchronize public markdown and presentation markdown so they reference
published SVG assets in pjdhiro/assets/creation/img/svg/{domains,themes}/{lang}/.
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

PUBLISH_ROOT = Path("/Users/uminomae/dev/pjdhiro/assets/creation")
PUBLISHED_CREATION_ASSET_BASE = "https://uminomae.github.io/pjdhiro/assets/creation"

IMAGE_LINE_RE = re.compile(r"^\\?!\[[^\]]*\]\(([^)]+)\)\s*$")
DOMAIN_ID_RE = re.compile(r"domain-(D\d+)-", re.I)


def has_text(value: str | None) -> bool:
    return isinstance(value, str) and bool(value.strip())


def build_public_svg_url(kind: str, lang: str, svg_name: str) -> str:
    return f"{PUBLISHED_CREATION_ASSET_BASE}/img/svg/{kind}/{lang}/{svg_name}"


def find_domain_svg(domain_id: str, lang: str) -> str:
    svg_dir = PUBLISH_ROOT / "img" / "svg" / "domains" / lang
    matches = sorted(svg_dir.glob(f"domain-{domain_id}-*.svg"))
    return matches[0].name if matches else ""


def theme_svg_name_from_markdown(path: Path) -> str:
    stem = path.stem
    if stem.startswith("summary-"):
        return f"theme-{stem.removeprefix('summary-')}.svg"
    if stem.startswith("theme-") and "-presentation-" in stem:
        return f"{stem.split('-presentation-', 1)[0]}.svg"
    if stem.startswith("theme-"):
        return f"{stem}.svg"
    if stem.startswith("conclusion-presentation"):
        return "theme-conclusion-summary.svg"
    return ""


def is_domain_diagram_line(line: str) -> bool:
    match = IMAGE_LINE_RE.match(line)
    if not match:
        return False
    target = match.group(1)
    return "img/domains" in target or "img/svg/domains" in target


def is_theme_diagram_line(line: str) -> bool:
    match = IMAGE_LINE_RE.match(line)
    if not match:
        return False
    target = match.group(1)
    return "img/svg/theme" in target or "img/svg/themes" in target


def normalize_h1_svg_embed(text: str, image_line: str, detector) -> str:
    lines = text.splitlines()
    h1_index = next((i for i, line in enumerate(lines) if line.startswith("# ")), None)
    if h1_index is None:
        return text

    before = lines[: h1_index + 1]
    after = lines[h1_index + 1 :]

    while after and after[0] == "":
        after.pop(0)

    if after and detector(after[0]):
        after.pop(0)
        while after and after[0] == "":
            after.pop(0)

    merged = before + ["", image_line, ""] + after
    return "\n".join(merged).rstrip() + "\n"


def split_frontmatter(text: str) -> tuple[str, str]:
    if not text.startswith("---\n"):
        return "", text
    end = text.find("\n---\n", 4)
    if end < 0:
        return "", text
    return text[: end + 5], text[end + 5 :]


def sync_domain_report(path: Path, lang: str) -> bool:
    match = DOMAIN_ID_RE.search(path.name)
    if not match:
        return False
    domain_id = match.group(1).upper()
    svg_name = find_domain_svg(domain_id, lang)
    if not svg_name:
        return False

    text = path.read_text(encoding="utf-8")
    title = next((line[2:].strip() for line in text.splitlines() if line.startswith("# ")), domain_id)
    image_line = f"![{title} — {'5段階モデルとの構造対応図' if lang == 'ja' else 'Structural correspondence diagram'}]({build_public_svg_url('domains', lang, svg_name)})"
    updated = normalize_h1_svg_embed(text, image_line, is_domain_diagram_line)
    if updated != text:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def sync_domain_presentation(path: Path, lang: str) -> bool:
    match = DOMAIN_ID_RE.search(path.name)
    if not match:
        return False
    domain_id = match.group(1).upper()
    svg_name = find_domain_svg(domain_id, lang)
    if not svg_name:
        return False

    text = path.read_text(encoding="utf-8")
    frontmatter, body = split_frontmatter(text)
    slides = [chunk for chunk in body.strip().split("\n\n---\n\n") if chunk.strip()]
    if not slides:
        return False

    image_title = "## 構造対応図" if lang == "ja" else "## Structural Correspondence Diagram"
    alt_title = "構造対応図" if lang == "ja" else "Structural correspondence diagram"
    image_slide = f"{image_title}\n\n![{alt_title}]({build_public_svg_url('domains', lang, svg_name)})"

    replaced = False
    for idx, chunk in enumerate(slides):
        if "img/svg/domains" in chunk or "img/domains" in chunk:
            slides[idx] = image_slide
            replaced = True
            break

    if not replaced:
        slides.insert(min(2, len(slides)), image_slide)

    rebuilt = ("\n\n---\n\n".join(slides)).rstrip() + "\n"
    next_text = f"{frontmatter}\n{rebuilt}" if frontmatter else rebuilt
    if next_text != text:
        path.write_text(next_text, encoding="utf-8")
        return True
    return False


def sync_theme_markdown(path: Path, lang: str, presentation: bool = False) -> bool:
    svg_name = theme_svg_name_from_markdown(path)
    if not svg_name:
        return False

    base = "themes"
    svg_path = build_public_svg_url("themes", lang, svg_name)
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    changed = False

    for idx, line in enumerate(lines):
        match = IMAGE_LINE_RE.match(line)
        if not match:
            continue
        target = match.group(1)
        if "img/svg/theme" in target or "img/svg/themes" in target:
            prefix = "!"
            alt = re.search(r"\[([^\]]*)\]", line)
            alt_text = alt.group(1) if alt else ""
            lines[idx] = f"{prefix}[{alt_text}]({svg_path})"
            changed = True

    if not changed:
        title = next((line[2:].strip() for line in lines if line.startswith("# ")), svg_name.replace(".svg", ""))
        image_line = f"![{title}]({svg_path})"
        next_text = normalize_h1_svg_embed(text, image_line, is_theme_diagram_line)
    else:
        next_text = "\n".join(lines).rstrip() + "\n"

    if next_text != text:
        path.write_text(next_text, encoding="utf-8")
        return True
    return False


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync public markdown SVG embeds")
    parser.add_argument("--domains-only", action="store_true")
    parser.add_argument("--themes-only", action="store_true")
    args = parser.parse_args()

    touched: list[str] = []

    if not args.themes_only:
        for lang in ("ja", "en"):
            report_dir = PUBLISH_ROOT / "domains" / lang / "md"
            for path in sorted(report_dir.glob("domain-D*.md")):
                if sync_domain_report(path, lang):
                    touched.append(str(path))

            pres_dir = PUBLISH_ROOT / "domains" / lang / "presentations" / "md"
            for path in sorted(pres_dir.glob("domain-D*-presentation-*.md")):
                if sync_domain_presentation(path, lang):
                    touched.append(str(path))

    if not args.domains_only:
        for lang in ("ja", "en"):
            theme_md_dir = PUBLISH_ROOT / "phase8-themes" / lang / "md"
            for path in sorted(theme_md_dir.glob("*.md")):
                if sync_theme_markdown(path, lang, presentation=False):
                    touched.append(str(path))

            theme_pres_dir = PUBLISH_ROOT / "phase8-themes" / lang / "presentations" / "md"
            for path in sorted(theme_pres_dir.glob("*.md")):
                if sync_theme_markdown(path, lang, presentation=True):
                    touched.append(str(path))

    for item in touched:
        print(item)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
