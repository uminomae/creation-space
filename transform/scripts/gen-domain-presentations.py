#!/usr/bin/env python3
"""
gen-domain-presentations.py — ドメインレポートからプレゼン資料を生成

各ドメインレポートを読み込み、テンプレートに沿ったプレゼン Markdown を生成する。
D08 サンプルと同じフォーマット。

使い方:
  python3 transform/scripts/gen-domain-presentations.py --all
  python3 transform/scripts/gen-domain-presentations.py --domain D01
  python3 transform/scripts/gen-domain-presentations.py --list
"""

import json
import os
import re
import sys
import argparse
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DOMAINS_DIR = os.path.join("/Users/uminomae/dev/pjdhiro", "assets/creation/domains/ja/md")
PRESENTATIONS_DIR = os.path.join(ROOT, "transform/domains/publish/presentations")
INDEX_JSON = os.path.join(ROOT, "transform/domains/publish/domains/index.json")
SVG_DOMAINS_DIR = os.path.join(ROOT, "assets/svg/domains")
PUBLISHED_CREATION_ASSET_BASE = "https://uminomae.github.io/pjdhiro/assets/creation"


def load_index():
    with open(INDEX_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["reports"]


def find_report_file(domain_id, slug):
    path = os.path.join(DOMAINS_DIR, "domain-%s-%s.md" % (domain_id, slug))
    return path if os.path.isfile(path) else None


def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def extract_front_matter(content):
    m = re.match(r"^---\n(.*?)\n---\n", content, re.DOTALL)
    if m:
        fm = {}
        for line in m.group(1).split("\n"):
            if ":" in line:
                key, val = line.split(":", 1)
                fm[key.strip()] = val.strip().strip('"').strip("'")
        return fm, content[m.end():]
    return {}, content


def extract_section(content, section_num):
    lines = content.split("\n")
    collecting = False
    result = []
    for line in lines:
        if re.match(r"^## " + str(section_num) + r"\.", line):
            collecting = True
            continue
        elif collecting and re.match(r"^## ", line):
            break
        elif collecting:
            result.append(line)
    return "\n".join(result).strip()


def extract_section_by_title(content, title_fragment):
    lines = content.split("\n")
    collecting = False
    result = []
    for line in lines:
        if re.match(r"^## ", line) and title_fragment in line:
            collecting = True
            continue
        elif collecting and re.match(r"^## ", line):
            break
        elif collecting:
            result.append(line)
    return "\n".join(result).strip()


def extract_numbered_table(content):
    lines = content.split("\n")
    header_lines = []
    data_lines = []
    in_table = False

    for line in lines:
        if not in_table and line.startswith("|") and ("理論" in line or "概念" in line or "提唱者" in line or "研究者" in line):
            in_table = True
            header_lines.append(line)
            continue
        if in_table and re.match(r"^\|\s*[-:]+", line):
            header_lines.append(line)
            continue
        if in_table and re.match(r"^\| \d+", line):
            data_lines.append(line)
        elif in_table and line.startswith("|") and not data_lines:
            continue
        elif in_table and not line.startswith("|"):
            if line.strip() == "":
                continue
            elif data_lines:
                break

    if header_lines and data_lines:
        return "\n".join(header_lines + data_lines)
    return ""


def count_theories(content):
    table = extract_numbered_table(content)
    if table:
        return len([l for l in table.split("\n") if re.match(r"^\| \d+", l)])
    m = re.search(r"(\d+)\s*(?:理論|件|つの理論|つの概念)", content[:3000])
    if m:
        return int(m.group(1))
    return 0


def extract_judgments(content):
    table = extract_numbered_table(content)
    judgments = {}

    if table:
        for line in table.split("\n"):
            if re.match(r"^\| \d+", line):
                if "強い" in line:
                    judgments["strong"] = judgments.get("strong", 0) + 1
                elif "部分的" in line:
                    judgments["partial"] = judgments.get("partial", 0) + 1
                elif "条件付き" in line or "条件つき" in line or "限定的" in line:
                    judgments["conditional"] = judgments.get("conditional", 0) + 1
                elif "確認されなかった" in line or "対応なし" in line:
                    judgments["none"] = judgments.get("none", 0) + 1
    else:
        # Try to extract from section 4 text
        sec4 = extract_section(content, 4)
        if not sec4:
            sec4 = extract_section_by_title(content, "比較結果")
        if sec4:
            strong = len(re.findall(r"強い(?:構造)?対応", sec4))
            partial = len(re.findall(r"部分的な対応", sec4))
            conditional = len(re.findall(r"条件付き|条件つき|限定的", sec4))
            if strong:
                judgments["strong"] = strong
            if partial:
                judgments["partial"] = partial
            if conditional:
                judgments["conditional"] = conditional

    return judgments


def format_judgment_summary(judgments, total):
    parts = []
    if judgments.get("strong"):
        parts.append("強い対応 %d件" % judgments["strong"])
    if judgments.get("partial"):
        parts.append("部分的な対応 %d件" % judgments["partial"])
    if judgments.get("conditional"):
        parts.append("条件付きの対応 %d件" % judgments["conditional"])
    if judgments.get("none"):
        parts.append("対応なし %d件" % judgments["none"])
    return "、".join(parts) if parts else ("全%d件で対応を確認" % total if total else "")


def extract_main_entries(content, max_entries=3):
    sec5 = extract_section(content, 5)
    if not sec5:
        sec5 = extract_section_by_title(content, "判断理由")
    if not sec5:
        sec5 = extract_section_by_title(content, "主要な知見")
    if not sec5:
        return []

    entries = []
    lines = sec5.split("\n")
    current_entry = None
    current_content = []

    for line in lines:
        m = re.match(r"^### \d+\.\d+ (.+)", line)
        if not m:
            m = re.match(r"^### (.+)", line)
        if m:
            if current_entry and current_content:
                entries.append({"title": current_entry, "content": "\n".join(current_content).strip()})
            current_entry = m.group(1).strip()
            current_content = []
        elif current_entry:
            current_content.append(line)

    if current_entry and current_content:
        entries.append({"title": current_entry, "content": "\n".join(current_content).strip()})

    return entries[:max_entries]


def summarize_entry(entry_content, max_lines=6):
    lines = entry_content.split("\n")
    bullets = []

    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.startswith(">"):
            continue
        if line.startswith("- **"):
            bullets.append(line)
        elif line.startswith("- "):
            bullets.append(line)

    if not bullets:
        for line in lines:
            line = line.strip()
            if not line or line.startswith(">") or line.startswith("|"):
                continue
            if len(line) > 20:
                bullets.append("- " + line)
                if len(bullets) >= max_lines:
                    break

    return "\n".join(bullets[:max_lines])


def summarize_to_bullets(text, max_items=5):
    if not text:
        return "- （該当セクションなし）"

    lines = text.split("\n")
    bullets = []

    for line in lines:
        line = line.strip()
        if not line or line.startswith(">") or line.startswith("---"):
            continue
        if line.startswith("| "):
            continue
        if line.startswith("- "):
            bullets.append(line)
        elif line.startswith("* "):
            bullets.append("- " + line[2:])
        elif re.match(r"^\d+\. ", line):
            bullets.append("- " + re.sub(r"^\d+\. ", "", line))
        elif len(line) > 15 and not line.startswith("#"):
            sentence = re.split(r"[。]", line)[0]
            if sentence and len(sentence) > 10:
                bullets.append("- " + sentence)

    if not bullets:
        return "- （詳細はドメインレポートを参照）"

    return "\n".join(bullets[:max_items])


def resolve_domain_svg_url(domain_id):
    if not os.path.isdir(SVG_DOMAINS_DIR):
        return ""

    prefix = "domain-%s-" % domain_id
    for name in sorted(os.listdir(SVG_DOMAINS_DIR)):
        if name.startswith(prefix) and name.endswith(".svg"):
            return "%s/img/svg/domains/ja/%s" % (PUBLISHED_CREATION_ASSET_BASE, name)
    return ""


def generate_presentation(domain_info, content, fm):
    domain_id = domain_info["id"]
    name_ja = domain_info["name_ja"]
    slug = domain_info["slug"]
    source_file = "domain-%s-%s.md" % (domain_id, slug)
    svg_url = resolve_domain_svg_url(domain_id)

    num_theories = count_theories(content)
    judgments = extract_judgments(content)
    judgment_summary = format_judgment_summary(judgments, num_theories)

    numbered_table = extract_numbered_table(content)
    main_entries = extract_main_entries(content, max_entries=3)
    cross_patterns = extract_section(content, 6)
    if not cross_patterns:
        cross_patterns = extract_section_by_title(content, "横断的パターン")
    if not cross_patterns:
        cross_patterns = extract_section_by_title(content, "一致しない点")
    cross_bullets = summarize_to_bullets(cross_patterns, max_items=4)

    open_questions = extract_section(content, 7)
    if not open_questions:
        open_questions = extract_section_by_title(content, "未解決の問い")
    if not open_questions:
        open_questions = extract_section_by_title(content, "限界と次の検証")
    open_bullets = summarize_to_bullets(open_questions, max_items=4)

    conclusion = extract_section(content, 8)
    if not conclusion:
        conclusion = extract_section_by_title(content, "結論")
    conclusion_bullets = summarize_to_bullets(conclusion, max_items=4)

    slides = []

    # Title slide
    slides.append("## %s\n\n5段階モデル（場・波・縁・渦・束）との構造対応調査" % name_ja)

    # Overview slide
    overview_items = []
    if num_theories:
        overview_items.append("- **調査対象**: %sの主要理論 %d件" % (name_ja, num_theories))
    else:
        overview_items.append("- **調査対象**: %sの主要理論" % name_ja)
    overview_items.append("- **調査の問い**: %sの諸理論は、5段階モデルと構造的に対応するか" % name_ja)
    if judgment_summary:
        overview_items.append("- **判定結果**: %s" % judgment_summary)
    slides.append("## 調査の概要\n\n" + "\n".join(overview_items))

    if svg_url:
        slides.append("## 構造対応図\n\n![%s — 5段階モデルとの構造対応図](%s)" % (name_ja, svg_url))

    # 5-stage model slide
    slides.append("""## 5段階モデルの概要

| 段階 | 定義 |
|------|------|
| 場（ば） | 未分化の状態。方向も構造もまだ定まっていない初期条件 |
| 波（なみ） | 複数の方向性が発散・競合する探索の段階 |
| 縁（えん） | 対立する要素が共存し、どちらにも収束しない緊張状態。境界で接し、影響し合い、関係が生まれる場所 |
| 渦（うず） | 緊張の中から新たなまとまり（秩序）が自発的に立ち上がる段階 |
| 束（たば） | 形が確定し、再利用可能な構造として安定する段階 |""")

    # Theory table slide
    if numbered_table:
        table_lines = numbered_table.split("\n")
        # Check if table has confidence column
        has_confidence = any('confidence' in l.lower() for l in table_lines)
        cleaned = []
        for line in table_lines:
            if has_confidence:
                parts = line.rsplit('|', 2)
                cleaned.append(parts[0] + '|')
            else:
                cells = [c.strip() for c in line.split('|')]
                non_empty = [c for c in cells if c]
                if non_empty and re.match(r'^0\.\d+$', non_empty[-1]):
                    parts = line.rsplit('|', 2)
                    cleaned.append(parts[0] + '|')
                else:
                    cleaned.append(line)
        slides.append("## 構造対応の全体像\n\n" + "\n".join(cleaned))
    else:
        sec4 = extract_section(content, 4)
        if not sec4:
            sec4 = extract_section_by_title(content, "構造類似の比較結果")
        if not sec4:
            sec4 = extract_section_by_title(content, "比較結果")
        if sec4:
            table_lines = [l for l in sec4.split("\n") if l.startswith("|")]
            if table_lines:
                slides.append("## 構造対応の全体像\n\n" + "\n".join(table_lines))
            else:
                summary = summarize_to_bullets(sec4, max_items=6)
                slides.append("## 構造対応の全体像\n\n" + summary)
        else:
            slides.append("## 構造対応の全体像\n\n- （詳細はドメインレポートを参照）")

    # Main entries slides
    for i, entry in enumerate(main_entries, 1):
        title = entry["title"]
        if len(title) > 60:
            title = re.sub(r"（[^）]+）$", "", title).strip()
        summary = summarize_entry(entry["content"])
        if not summary:
            summary = "- （詳細はドメインレポートを参照）"
        slides.append("## 主要エントリ %d: %s\n\n%s" % (i, title, summary))

    if not main_entries:
        slides.append("## 主要な知見\n\n- 各理論の詳細な構造対応はドメインレポートを参照")

    # Cross patterns
    slides.append("## 横断的パターン\n\n%s" % cross_bullets)

    # Open questions
    slides.append("## 未解決の問い\n\n%s" % open_bullets)

    # Conclusion
    slides.append("## 結論\n\n%s" % conclusion_bullets)

    front_matter = """---
title: "%s - 5段階モデルとの構造対応"
lang: ja
version: "1.0"
date: "%s"
generator_model: "claude:claude-opus-4-6"
source: "%s"
type: presentation
---""" % (name_ja, date.today().isoformat(), source_file)

    body = "\n\n---\n\n".join(slides)
    return front_matter + "\n\n" + body + "\n"


def main():
    parser = argparse.ArgumentParser(description="Generate domain presentations")
    parser.add_argument("--domain", help="Generate for specific domain (e.g., D01)")
    parser.add_argument("--all", action="store_true", help="Generate for all domains")
    parser.add_argument("--list", action="store_true", help="List target domains")
    parser.add_argument("--skip-existing", action="store_true", help="Skip existing")
    args = parser.parse_args()

    if not any([args.domain, args.all, args.list]):
        parser.print_help()
        sys.exit(1)

    reports = load_index()
    os.makedirs(PRESENTATIONS_DIR, exist_ok=True)

    targets = []
    for r in reports:
        domain_id = r["id"]
        slug = r["slug"]
        name_ja = r["name_ja"]
        out_file = "domain-%s-%s-presentation-ja.md" % (domain_id, slug)
        out_path = os.path.join(PRESENTATIONS_DIR, out_file)

        if args.domain and domain_id != args.domain:
            continue
        if args.skip_existing and os.path.exists(out_path):
            continue

        report_path = find_report_file(domain_id, slug)
        if not report_path:
            print("WARN: No report file for %s (%s)" % (domain_id, name_ja))
            continue

        targets.append({
            "info": r,
            "report_path": report_path,
            "out_path": out_path,
            "out_file": out_file,
        })

    if args.list:
        for t in targets:
            exists = "EXISTS" if os.path.exists(t["out_path"]) else "NEW"
            print("  %s %-10s [%s] -> %s" % (t["info"]["id"], t["info"]["name_ja"], exists, t["out_file"]))
        print("\nTotal: %d domains" % len(targets))
        return

    generated = 0
    errors = 0
    for t in targets:
        domain_id = t["info"]["id"]
        name_ja = t["info"]["name_ja"]
        try:
            content = read_file(t["report_path"])
            fm, body = extract_front_matter(content)
            result = generate_presentation(t["info"], body, fm)
            with open(t["out_path"], "w", encoding="utf-8") as f:
                f.write(result)
            lines = len(result.split("\n"))
            print("  OK  %s %s -> %s (%d lines)" % (domain_id, name_ja, t["out_file"], lines))
            generated += 1
        except Exception as e:
            print("  ERR %s %s: %s" % (domain_id, name_ja, e))
            errors += 1

    print("\nGenerated: %d, Errors: %d" % (generated, errors))


if __name__ == "__main__":
    main()
