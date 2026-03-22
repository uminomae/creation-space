#!/usr/bin/env python3
"""
rewrite-svg-links-for-pdf.py

Convert SVG references in markdown/html image tags into temporary PNG files
so pandoc + lualatex can build PDFs from the same source markdown.
"""

from __future__ import annotations

import argparse
import hashlib
import re
import subprocess
from pathlib import Path

MD_IMAGE_RE = re.compile(r'(!\[[^\]]*\]\()([^)]+\.svg)(\))')
HTML_IMAGE_RE = re.compile(r'(<img\b[^>]*?\bsrc=")([^"]+\.svg)(")')


def convert_svg(svg_path: Path, out_dir: Path) -> Path:
    digest = hashlib.sha1(str(svg_path).encode("utf-8")).hexdigest()[:12]
    png_path = out_dir / f"{svg_path.stem}-{digest}.png"
    if png_path.is_file():
        return png_path
    out_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["rsvg-convert", str(svg_path), "-o", str(png_path)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return png_path


def rewrite(text: str, source_md: Path, raster_dir: Path) -> str:
    source_dir = source_md.parent
    replacements: dict[str, str] = {}

    def resolve_and_convert(raw: str) -> str:
        if raw in replacements:
            return replacements[raw]
        svg_path = Path(raw)
        if not svg_path.is_absolute():
            svg_path = (source_dir / raw).resolve()
        if not svg_path.is_file():
            return raw
        png_path = convert_svg(svg_path, raster_dir)
        replacements[raw] = str(png_path)
        return replacements[raw]

    text = MD_IMAGE_RE.sub(lambda m: f"{m.group(1)}{resolve_and_convert(m.group(2))}{m.group(3)}", text)
    text = HTML_IMAGE_RE.sub(lambda m: f"{m.group(1)}{resolve_and_convert(m.group(2))}{m.group(3)}", text)
    return text


def main() -> int:
    parser = argparse.ArgumentParser(description="Rewrite SVG links in markdown to PNG for PDF builds")
    parser.add_argument("--input-md", required=True)
    parser.add_argument("--source-md", required=True)
    parser.add_argument("--raster-dir", required=True)
    args = parser.parse_args()

    input_md = Path(args.input_md)
    source_md = Path(args.source_md)
    raster_dir = Path(args.raster_dir)

    text = input_md.read_text(encoding="utf-8")
    updated = rewrite(text, source_md, raster_dir)
    input_md.write_text(updated, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
