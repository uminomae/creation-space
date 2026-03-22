#!/usr/bin/env python3
"""
translate-svg-labels.py — JA SVG text nodes -> EN SVG text nodes

Deterministic translator for public SVG assets.
Used by generate-svg.sh so both Codex and Claude can run the same workflow.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path
from xml.etree import ElementTree as ET

SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)

JAPANESE_RE = re.compile(r"[ぁ-んァ-ン一-龯]")
FONT_JA = "'Hiragino Sans', 'Noto Sans JP', sans-serif"
FONT_EN = "'Inter', 'Helvetica Neue', sans-serif"

# Common terms should use stable project vocabulary instead of raw MT output.
OVERRIDES = {
    "場": "Field",
    "波": "Wave",
    "縁": "Edge",
    "渦": "Vortex",
    "束": "Bundle",
    "主要理論の対応状況": "Major Theoretical Correspondence",
    "強い対応（実線）": "Strong correspondence (solid)",
    "部分的対応（破線）": "Partial correspondence (dashed)",
    "条件付き対応（点線）": "Conditional correspondence (dotted)",
    "弱い対応（点線）": "Weak correspondence (dotted)",
    "確定に近い": "Near-certain",
    "有力": "Probable",
    "条件つき": "Conditional",
    "条件付き": "Conditional",
}


def load_cache(path: Path) -> dict[str, str]:
    if not path.is_file():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {}


def save_cache(path: Path, cache: dict[str, str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(cache, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")


def needs_translation(text: str) -> bool:
    return bool(text and JAPANESE_RE.search(text))


def translate_google(text: str, target_lang: str) -> str:
    query = urllib.parse.quote(text)
    url = (
        "https://translate.googleapis.com/translate_a/single"
        f"?client=gtx&sl=ja&tl={target_lang}&dt=t&q={query}"
    )
    with urllib.request.urlopen(url, timeout=20) as response:
        payload = json.loads(response.read().decode("utf-8"))
    return "".join(part[0] for part in payload[0] if part and part[0])


def postprocess_translation(source: str, translated: str) -> str:
    if source in OVERRIDES:
        return OVERRIDES[source]
    text = translated.strip()
    text = re.sub(r"\s+", " ", text)
    text = text.replace("G x E", "G×E")
    text = text.replace("Red Queen hypothesis", "Red Queen Hypothesis")
    text = text.replace("neutral theory", "Neutral Theory")
    text = text.replace("natural selection", "Natural Selection")
    text = text.replace("developmental plasticity", "Developmental Plasticity")
    text = text.replace("genetic accommodation", "Genetic Accommodation")
    text = text.replace("hybrid zone", "Hybrid Zone")
    text = text.replace("endosymbiosis", "Endosymbiosis")
    text = text.replace("punctuated equilibrium", "Punctuated Equilibrium")
    text = text.replace("coevolution", "Coevolution")
    text = text.replace("niche construction", "Niche Construction")
    text = text.replace("adaptive radiation", "Adaptive Radiation")
    text = text.replace("Major theory", "Major Theoretical")
    return text


def translate_text(text: str, target_lang: str, cache: dict[str, str]) -> str:
    if not needs_translation(text):
        return text
    if text in cache:
        return cache[text]

    translated = translate_google(text, target_lang)
    translated = postprocess_translation(text, translated)
    cache[text] = translated
    # Be polite to the endpoint during batch translation.
    time.sleep(0.08)
    return translated


def rewrite_style(css_text: str, target_lang: str) -> str:
    if target_lang != "en":
        return css_text
    return css_text.replace(FONT_JA, FONT_EN)


def translate_svg(src: Path, dest: Path, target_lang: str, cache_path: Path) -> None:
    cache = load_cache(cache_path)
    tree = ET.parse(src)
    root = tree.getroot()

    style_node = root.find(f".//{{{SVG_NS}}}style")
    if style_node is not None and style_node.text:
        style_node.text = rewrite_style(style_node.text, target_lang)

    for node in root.iter(f"{{{SVG_NS}}}text"):
        if node.text and node.text.strip():
            node.text = translate_text(node.text.strip(), target_lang, cache)

    xml_text = ET.tostring(root, encoding="unicode")
    if target_lang == "en" and JAPANESE_RE.search(xml_text):
        remaining = sorted(set(JAPANESE_RE.findall(xml_text)))
        raise RuntimeError(f"Japanese characters remain after translation: {remaining}")

    dest.parent.mkdir(parents=True, exist_ok=True)
    final_text = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_text
    dest.write_text(final_text, encoding="utf-8")
    save_cache(cache_path, cache)


def main() -> int:
    parser = argparse.ArgumentParser(description="Translate JA SVG labels into EN")
    parser.add_argument("--src", required=True, help="Source JA SVG file")
    parser.add_argument("--dest", required=True, help="Destination SVG file")
    parser.add_argument("--lang", default="en", choices=["en"], help="Target language")
    parser.add_argument("--cache", default=".cache/svg-translation-cache-en.json", help="Translation cache path")
    args = parser.parse_args()

    src = Path(args.src)
    dest = Path(args.dest)
    cache = Path(args.cache)

    if not src.is_file():
        raise SystemExit(f"Source SVG not found: {src}")

    translate_svg(src, dest, args.lang, cache)
    print(dest)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
