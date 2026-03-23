#!/usr/bin/env python3
"""Insert TYPE A/B/C infographic SVG links into domain report MDs.

Insertion points (from SKILL.md):
- TYPE A: After section 1 heading
- TYPE B: After section 4 heading
- TYPE C: After section 6 heading

Usage:
    python3 scripts/insert-infographic-links.py              # All domains, JA
    python3 scripts/insert-infographic-links.py --lang en     # EN
    python3 scripts/insert-infographic-links.py --domain D01  # Single domain
    python3 scripts/insert-infographic-links.py --dry-run     # Preview only
"""

import re
import sys
import argparse
from pathlib import Path

PJDHIRO_BASE = Path("/Users/uminomae/dev/pjdhiro/assets/creation")
SVG_BASE_URL = "https://uminomae.github.io/pjdhiro/assets/creation/img/svg/domains"
SVG_LOCAL_DIR = PJDHIRO_BASE / "img" / "svg" / "domains"

INSERTION_MAP_ACADEMIC = {
    "A": {"section": r"^##\s+1\.", "suffix": "01-overview-svg", "alt": "調査概要インフォグラフィック"},
    "B": {"section": r"^##\s+4\.", "suffix": "02-theories-map-svg", "alt": "理論×5段階対応マトリクス"},
    "C": {"section": r"^##\s+6\.", "suffix": "03-cross-patterns-svg", "alt": "横断的パターン図"},
}

INSERTION_MAP_PRESENTATION_JA = {
    "A": {"section": r"^##\s+調査の概要", "suffix": "01-overview-svg", "alt": "調査概要インフォグラフィック"},
    "B": {"section": r"^##\s+構造対応の全体像", "suffix": "02-theories-map-svg", "alt": "理論×5段階対応マトリクス"},
    "C": {"section": r"^##\s+横断的パターン", "suffix": "03-cross-patterns-svg", "alt": "横断的パターン図"},
}

INSERTION_MAP_PRESENTATION_EN = {
    "A": {"section": r"^##\s+Overview of the Study", "suffix": "01-overview-svg", "alt": "Research Overview Infographic"},
    "B": {"section": r"^##\s+Overview of Structural Correspondences", "suffix": "02-theories-map-svg", "alt": "Theory x 5-Stage Correspondence Matrix"},
    "C": {"section": r"^##\s+Cross-Cutting Patterns", "suffix": "03-cross-patterns-svg", "alt": "Cross-Cutting Patterns Diagram"},
}


def get_domain_id(filename):
    m = re.search(r"domain-(D\d+)-", filename)
    return m.group(1) if m else None


def get_domain_name(text):
    m = re.search(r"^#\s+(.+)", text, re.MULTILINE)
    return m.group(1).strip() if m else "Domain"


def insert_svg_links(md_path, lang, kind="academic", dry_run=False):
    text = md_path.read_text(encoding="utf-8")
    domain_id = get_domain_id(md_path.name)
    if not domain_id:
        return False, "no domain ID"

    if kind == "presentation":
        insertion_map = INSERTION_MAP_PRESENTATION_EN if lang == "en" else INSERTION_MAP_PRESENTATION_JA
    else:
        insertion_map = INSERTION_MAP_ACADEMIC
    domain_name = get_domain_name(text)
    lines = text.split("\n")
    insertions = 0
    new_lines = []

    for i, line in enumerate(lines):
        new_lines.append(line)

        for type_key, config in insertion_map.items():
            if re.match(config["section"], line):
                suffix = config["suffix"]
                svg_filename = f"{domain_id}-{suffix}.svg"
                svg_local = SVG_LOCAL_DIR / lang / svg_filename

                # EN fallback: if infographic SVG doesn't exist in EN,
                # reference the JA version (data visualization is language-agnostic)
                resolved_lang = lang
                if not svg_local.exists() and lang == "en":
                    svg_local_ja = SVG_LOCAL_DIR / "ja" / svg_filename
                    if svg_local_ja.exists():
                        resolved_lang = "ja"
                    else:
                        continue
                elif not svg_local.exists():
                    continue

                # Check if link already inserted (look ahead a few lines)
                already_exists = False
                for j in range(i + 1, min(i + 5, len(lines))):
                    if j < len(lines) and svg_filename in lines[j]:
                        already_exists = True
                        break

                if already_exists:
                    continue

                # Insert after section heading (with blank line)
                alt_text = f"{domain_name} — {config['alt']}"
                svg_url = f"{SVG_BASE_URL}/{resolved_lang}/{svg_filename}"
                link_line = f"\n![{alt_text}]({svg_url})\n"
                new_lines.append(link_line)
                insertions += 1

    if insertions > 0 and not dry_run:
        md_path.write_text("\n".join(new_lines), encoding="utf-8")

    return insertions > 0, f"{insertions} links inserted"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--lang", default="ja", choices=["ja", "en", "all"])
    parser.add_argument("--kind", default="all", choices=["academic", "presentation", "all"])
    parser.add_argument("--domain", help="Single domain ID")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    langs = ["ja", "en"] if args.lang == "all" else [args.lang]
    kinds = ["academic", "presentation"] if args.kind == "all" else [args.kind]
    total_modified = 0

    for lang in langs:
        for kind in kinds:
            if kind == "academic":
                md_dir = PJDHIRO_BASE / "domains" / lang / "md"
                pattern = "domain-D*.md"
            else:
                md_dir = PJDHIRO_BASE / "domains" / lang / "presentations" / "md"
                pattern = "domain-D*-presentation-*.md"

            if not md_dir.exists():
                print(f"SKIP: {md_dir} not found")
                continue

            md_files = sorted(md_dir.glob(pattern))
            if args.domain:
                md_files = [f for f in md_files if f"domain-{args.domain}-" in f.name]

            print(f"=== {lang.upper()} {kind} ({len(md_files)} files) ===")

            for md_file in md_files:
                domain_id = get_domain_id(md_file.name)
                modified, msg = insert_svg_links(md_file, lang, kind, args.dry_run)
                status = "MODIFIED" if modified else "skip"
                print(f"  [{domain_id}] {status}: {msg}")
                if modified:
                    total_modified += 1

    action = "would modify" if args.dry_run else "modified"
    print(f"\nTotal: {action} {total_modified} files")


if __name__ == "__main__":
    main()
