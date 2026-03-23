#!/usr/bin/env python3
"""Generate TYPE A/B/C SVG infographics for all 30 domain reports using Gemini API.

Usage:
    python3 scripts/generate-infographic-svgs.py                    # All domains, all types
    python3 scripts/generate-infographic-svgs.py --domain D01       # Single domain
    python3 scripts/generate-infographic-svgs.py --type A           # All domains, TYPE A only
    python3 scripts/generate-infographic-svgs.py --dry-run          # Show targets without calling API
"""

import os
import re
import sys
import json
import time
import argparse
import subprocess
from pathlib import Path

PJDHIRO_DOMAINS_JA = Path("/Users/uminomae/dev/pjdhiro/assets/creation/domains/ja/md")
SVG_OUTPUT_DIR = Path("/Users/uminomae/dev/pjdhiro/assets/creation/img/svg/domains/ja")
TEMPLATES_DIR = Path("/Users/uminomae/dev/creation-space/skills/gemini-infographic/prompts")
API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL = "gemini-2.5-flash"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
RATE_LIMIT_SEC = 6


def extract_domain_data(md_path):
    """Extract structured data from a domain report MD file."""
    text = md_path.read_text(encoding="utf-8")

    # Domain ID and name
    domain_id_match = re.search(r"domain-(D\d+)-", md_path.name)
    domain_id = domain_id_match.group(1) if domain_id_match else "D??"

    # First H1 = domain name
    name_match = re.search(r"^#\s+(.+)", text, re.MULTILINE)
    domain_name = name_match.group(1).strip() if name_match else md_path.stem

    # Extract theory table (section 4)
    theories = []
    table_pattern = re.compile(
        r"\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|"
    )
    in_section4 = False
    for line in text.split("\n"):
        if re.match(r"^##\s+4\.", line):
            in_section4 = True
        elif re.match(r"^##\s+5\.", line):
            in_section4 = False
        if in_section4:
            m = table_pattern.match(line)
            if m:
                num, theory, origin, stages, judgment = (
                    m.group(1),
                    m.group(2).strip(),
                    m.group(3).strip(),
                    m.group(4).strip(),
                    m.group(5).strip(),
                )
                # Normalize judgment
                if "強い" in judgment:
                    j = "strong"
                elif "部分" in judgment:
                    j = "partial"
                else:
                    j = "conditional"
                theories.append(
                    {
                        "name": theory,
                        "origin": origin,
                        "stages": stages,
                        "judgment": j,
                        "judgment_ja": judgment,
                    }
                )

    # Extract cross-cutting patterns (section 6)
    patterns = []
    in_section6 = False
    current_pattern = None
    for line in text.split("\n"):
        if re.match(r"^##\s+6\.", line):
            in_section6 = True
            continue
        if re.match(r"^##\s+7\.", line):
            if current_pattern:
                patterns.append(current_pattern)
            in_section6 = False
            continue
        if in_section6:
            h3 = re.match(r"^###\s+(.+)", line)
            if h3:
                if current_pattern:
                    patterns.append(current_pattern)
                current_pattern = {
                    "name": h3.group(1).strip(),
                    "description": "",
                    "theories": [],
                }
            elif current_pattern and line.strip() and not current_pattern["description"]:
                # First non-empty line after heading = description
                # Extract theory count if present
                count_match = re.search(r"(\d+)件中(\d+)件|(\d+)件", line)
                if count_match:
                    current_pattern["count_text"] = count_match.group(0)
                # Extract theory names in parentheses
                theory_match = re.search(r"（(.+?)）", line)
                if theory_match:
                    current_pattern["theories"] = [
                        t.strip() for t in theory_match.group(1).split("、")
                    ]
                # First sentence as description
                desc = re.split(r"[。]", line.strip())[0]
                # Clean up: remove "N件中M件（...）が" prefix
                desc = re.sub(r"^\d+件中\d+件（.+?）が", "", desc)
                desc = re.sub(r"^「", "", desc).strip()
                desc = re.sub(r"」.*$", "", desc).strip()
                if not desc:
                    desc = line.strip()[:80]
                current_pattern["description"] = desc

    # Count judgments
    strong = sum(1 for t in theories if t["judgment"] == "strong")
    partial = sum(1 for t in theories if t["judgment"] == "partial")
    conditional = sum(1 for t in theories if t["judgment"] == "conditional")

    return {
        "domain_id": domain_id,
        "domain_name": domain_name,
        "theory_count": len(theories),
        "strong_count": strong,
        "partial_count": partial,
        "conditional_count": conditional,
        "theories": theories,
        "patterns": patterns,
    }


def build_theories_list(theories):
    """Build theories_list for TYPE A."""
    lines = []
    stages_map = {"場": "場", "波": "波", "縁": "縁", "渦": "渦", "束": "束"}
    for t in theories:
        # Parse stages from Japanese text like "場・束" or "全5段階" or "縁・渦・束"
        raw_stages = t["stages"]
        if "全5段階" in raw_stages or "全5" in raw_stages:
            covered = "場,波,縁,渦,束"
        else:
            covered_list = []
            for s in ["場", "波", "縁", "渦", "束"]:
                if s in raw_stages:
                    covered_list.append(s)
            covered = ",".join(covered_list) if covered_list else raw_stages
        lines.append(f"{t['name']} | {t['judgment']} | {covered}")
    return "\n".join(lines)


def build_matrix_data(theories):
    """Build matrix_data for TYPE B (simplified — use stage names as mapping terms)."""
    lines = []
    stage_names = ["場", "波", "縁", "渦", "束"]
    for t in theories:
        raw = t["stages"]
        if "全5段階" in raw or "全5" in raw:
            mappings = [s for s in stage_names]
        else:
            mappings = []
            for s in stage_names:
                if s in raw:
                    mappings.append(s)
                else:
                    mappings.append("-")
        line = f"{t['name']} | {t['judgment']} | {' | '.join(mappings)}"
        lines.append(line)
    return "\n".join(lines)


def build_prompt_type_a(data):
    """Build TYPE A prompt from extracted data."""
    template = TEMPLATES_DIR / "type-a-overview.md"
    prompt_text = template.read_text(encoding="utf-8")

    # Extract only the ## Prompt section onwards
    prompt_start = prompt_text.find("## Prompt")
    if prompt_start >= 0:
        prompt_text = prompt_text[prompt_start:]
    # Also append SVG Rules
    rules_start = prompt_text.find("## SVG Rules")
    # Keep everything from Prompt to end (includes rules)

    theories_list = build_theories_list(data["theories"])

    prompt_text = prompt_text.replace("{{domain_id}}", data["domain_id"])
    prompt_text = prompt_text.replace("{{domain_name_ja}}", data["domain_name"])
    prompt_text = prompt_text.replace("{{theory_count}}", str(data["theory_count"]))
    prompt_text = prompt_text.replace("{{strong_count}}", str(data["strong_count"]))
    prompt_text = prompt_text.replace("{{partial_count}}", str(data["partial_count"]))
    prompt_text = prompt_text.replace(
        "{{conditional_count}}", str(data["conditional_count"])
    )
    prompt_text = prompt_text.replace("{{theories_list}}", theories_list)

    return prompt_text


def build_prompt_type_b(data):
    """Build TYPE B prompt from extracted data."""
    template = TEMPLATES_DIR / "type-b-matrix.md"
    prompt_text = template.read_text(encoding="utf-8")

    prompt_start = prompt_text.find("## Prompt")
    if prompt_start >= 0:
        prompt_text = prompt_text[prompt_start:]

    matrix_data = build_matrix_data(data["theories"])

    prompt_text = prompt_text.replace("{{domain_id}}", data["domain_id"])
    prompt_text = prompt_text.replace("{{domain_name_ja}}", data["domain_name"])
    prompt_text = prompt_text.replace("{{theory_count}}", str(data["theory_count"]))
    prompt_text = prompt_text.replace("{{matrix_data}}", matrix_data)

    return prompt_text


def build_prompt_type_c(data):
    """Build TYPE C prompt from extracted data."""
    template = TEMPLATES_DIR / "type-c-patterns.md"
    prompt_text = template.read_text(encoding="utf-8")

    prompt_start = prompt_text.find("## Prompt")
    if prompt_start >= 0:
        prompt_text = prompt_text[prompt_start:]

    patterns = data["patterns"]
    if not patterns:
        return None  # Skip if no patterns found

    primary = patterns[0]
    satellites = patterns[1:5]  # Max 4 satellites

    prompt_text = prompt_text.replace("{{domain_id}}", data["domain_id"])
    prompt_text = prompt_text.replace("{{domain_name_ja}}", data["domain_name"])
    prompt_text = prompt_text.replace("{{pattern_count}}", str(len(patterns)))
    prompt_text = prompt_text.replace(
        "{{primary_pattern_name}}", primary["name"]
    )
    prompt_text = prompt_text.replace(
        "{{primary_pattern_count}}",
        primary.get("count_text", f"{len(primary.get('theories', []))}/{data['theory_count']}"),
    )
    prompt_text = prompt_text.replace(
        "{{primary_pattern_description}}", primary["description"]
    )
    prompt_text = prompt_text.replace(
        "{{primary_pattern_theories}}",
        ", ".join(primary.get("theories", [])),
    )

    # Build satellite patterns text
    sat_lines = []
    for sp in satellites:
        count = sp.get("count_text", f"{len(sp.get('theories', []))}/{data['theory_count']}")
        theories_str = ", ".join(sp.get("theories", []))
        sat_lines.append(f"{sp['name']} | {count} | {sp['description']} | {theories_str}")
    prompt_text = prompt_text.replace("{{satellite_patterns}}", "\n".join(sat_lines))

    return prompt_text


def call_gemini_api(prompt):
    """Call Gemini API via curl and return SVG text."""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 65536,
        },
    }

    result = subprocess.run(
        [
            "curl",
            "-s",
            "-X",
            "POST",
            f"{API_URL}?key={API_KEY}",
            "-H",
            "Content-Type: application/json",
            "-d",
            json.dumps(payload, ensure_ascii=False),
        ],
        capture_output=True,
        text=True,
        timeout=180,
    )

    if result.returncode != 0:
        print(f"  ERROR: curl failed: {result.stderr[:200]}", file=sys.stderr)
        return None

    try:
        response = json.loads(result.stdout)
    except json.JSONDecodeError:
        print(f"  ERROR: Invalid JSON response", file=sys.stderr)
        return None

    # Check for API errors
    if "error" in response:
        print(
            f"  ERROR: API error: {response['error'].get('message', 'unknown')}",
            file=sys.stderr,
        )
        return None

    # Extract text from response
    try:
        text = response["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError):
        print(f"  ERROR: Unexpected response structure", file=sys.stderr)
        return None

    # Strip markdown code fences if present
    text = re.sub(r"^```(?:xml|svg|html)?\s*\n?", "", text.strip())
    text = re.sub(r"\n?```\s*$", "", text.strip())

    # Extract SVG from text
    svg_match = re.search(r"(<svg[\s\S]*</svg>)", text, re.DOTALL)
    if svg_match:
        return svg_match.group(1)

    # If the entire text starts with <svg
    if text.strip().startswith("<svg"):
        return text.strip()

    print(f"  ERROR: No SVG found in response (length={len(text)})", file=sys.stderr)
    print(f"  DEBUG first 500 chars: {text[:500]}", file=sys.stderr)
    return None


def validate_svg(svg_text):
    """Basic SVG validation."""
    errors = []
    if not svg_text.strip().startswith("<svg"):
        errors.append("Does not start with <svg>")
    if "</svg>" not in svg_text:
        errors.append("Missing </svg>")
    for forbidden in [
        "<foreignObject",
        "<script",
        "<animate",
        "<image",
        "<filter",
        "<style",
    ]:
        if forbidden in svg_text:
            errors.append(f"Forbidden element: {forbidden}")
    if "viewBox" not in svg_text:
        errors.append("Missing viewBox")
    return errors


def main():
    parser = argparse.ArgumentParser(description="Generate infographic SVGs")
    parser.add_argument("--domain", help="Single domain ID (e.g. D01)")
    parser.add_argument("--type", choices=["A", "B", "C"], help="Single type")
    parser.add_argument("--dry-run", action="store_true", help="Show targets only")
    parser.add_argument("--force", action="store_true", help="Overwrite existing")
    args = parser.parse_args()

    if not API_KEY and not args.dry_run:
        print("ERROR: GEMINI_API_KEY not set", file=sys.stderr)
        sys.exit(1)

    # Find all domain MDs
    md_files = sorted(PJDHIRO_DOMAINS_JA.glob("domain-D*.md"))
    if args.domain:
        md_files = [f for f in md_files if f"domain-{args.domain}-" in f.name]

    types = ["A", "B", "C"]
    if args.type:
        types = [args.type]

    type_suffixes = {"A": "01-overview-svg", "B": "02-theories-map-svg", "C": "03-cross-patterns-svg"}
    prompt_builders = {
        "A": build_prompt_type_a,
        "B": build_prompt_type_b,
        "C": build_prompt_type_c,
    }

    total = 0
    success = 0
    skipped = 0
    failed = 0

    print(f"=== SVG Infographic Generation ===")
    print(f"Domains: {len(md_files)}, Types: {types}")
    print(f"Output: {SVG_OUTPUT_DIR}")
    print()

    for md_file in md_files:
        data = extract_domain_data(md_file)
        print(f"[{data['domain_id']}] {data['domain_name']} ({data['theory_count']} theories)")

        for t in types:
            suffix = type_suffixes[t]
            out_path = SVG_OUTPUT_DIR / f"{data['domain_id']}-{suffix}.svg"
            total += 1

            if out_path.exists() and not args.force:
                print(f"  TYPE {t}: SKIP (exists)")
                skipped += 1
                continue

            if args.dry_run:
                print(f"  TYPE {t}: -> {out_path.name}")
                continue

            # Build prompt
            prompt = prompt_builders[t](data)
            if prompt is None:
                print(f"  TYPE {t}: SKIP (no data)")
                skipped += 1
                continue

            print(f"  TYPE {t}: generating...", end="", flush=True)

            # Call API
            svg = call_gemini_api(prompt)
            if svg is None:
                print(" FAIL")
                failed += 1
                continue

            # Validate
            errors = validate_svg(svg)
            if errors:
                print(f" WARN: {', '.join(errors)}")
                # Still save but with warnings

            # Save
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(svg, encoding="utf-8")
            size_kb = len(svg.encode("utf-8")) / 1024
            print(f" OK ({size_kb:.1f} KB)")
            success += 1

            # Rate limit
            time.sleep(RATE_LIMIT_SEC)

    print()
    print(f"=== Results ===")
    print(f"Total: {total}, Success: {success}, Skipped: {skipped}, Failed: {failed}")


if __name__ == "__main__":
    main()
