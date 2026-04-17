#!/usr/bin/env bash
# wiki-gen-check.sh — cs#226
# SessionStart: cs manifest の raw-confirmed / url-verified 源泉と
# cs knowledge/wiki/ の対応ページの整合を確認する。
# 未生成があれば .cache/inbox/cs-wiki-gen-{date}.md に生成依頼を書き出す。
#
# 役割分担:
# - wiki-gen-check.sh (このファイル): cs 内部の未生成検知 (SessionStart)
# - wiki-gen-notify.sh               : cs commit -> pd への通知 (PostToolUse)

set -euo pipefail

source "$(dirname "$0")/_common"
hook_init

if [ "$(hook_event_name)" != "SessionStart" ]; then
  exit 0
fi

MANIFEST="${REPO_ROOT}/knowledge/raw/manifest.md"
WIKI_ROOT="${REPO_ROOT}/knowledge/wiki"
INBOX_DIR="${REPO_ROOT}/.cache/inbox"

if [ ! -f "$MANIFEST" ]; then
  hook_warn "wiki-gen-check: knowledge/raw/manifest.md not found"
  exit 0
fi

python3 - "$MANIFEST" "$WIKI_ROOT" "$INBOX_DIR" "$REPO_ROOT" <<'PY'
import glob
import os
import re
import shutil
import sys
from datetime import date

manifest_path, wiki_root, inbox_dir, repo_root = sys.argv[1:5]

VALID_STATUSES = {"raw-confirmed", "url-verified"}
SOURCE_ID_RE = re.compile(r"^D\d+-S\d+$")
DOMAIN_ID_RE = re.compile(r"^D\d+$")

with open(manifest_path, encoding="utf-8") as fh:
    lines = fh.readlines()

missing = []
seen = set()
for line in lines:
    if not line.strip().startswith("|"):
        continue
    cols = [c.strip() for c in line.split("|")]
    if len(cols) < 7:
        continue

    source_id = cols[1]
    domain_id = cols[2]
    access_status = cols[3].strip("`").strip()
    source_title = cols[4]
    local_file = cols[5].strip("`").strip()
    notes = cols[7].strip() if len(cols) > 7 else ""

    if not SOURCE_ID_RE.match(source_id):
        continue
    if not DOMAIN_ID_RE.match(domain_id):
        continue
    if access_status not in VALID_STATUSES:
        continue
    if source_id in seen:
        continue
    seen.add(source_id)

    wiki_dir = os.path.join(wiki_root, domain_id)
    pattern = os.path.join(wiki_dir, f"{source_id}_*.md")
    if glob.glob(pattern):
        continue

    doi = ""
    oa_url = ""
    doi_match = re.search(r"DOI:\s*(10\.[0-9]{4,}[^\s,;。]+)", notes)
    if doi_match:
        doi = doi_match.group(1).rstrip(".)")
    oa_match = re.search(r"OA:\s*(https?://[^\s,;。()]+)", notes)
    if oa_match:
        oa_url = oa_match.group(1).rstrip(".)")

    missing.append({
        "source_id": source_id,
        "domain_id": domain_id,
        "access_status": access_status,
        "title": source_title,
        "local_file": local_file if local_file and local_file != "\u2014" else "",
        "doi": doi,
        "oa_url": oa_url,
    })

os.makedirs(inbox_dir, exist_ok=True)
today = date.today().isoformat()

archive_dir = os.path.join(inbox_dir, "archive")
os.makedirs(archive_dir, exist_ok=True)
date_pat = re.compile(r"cs-wiki-gen-(\d{4}-\d{2}-\d{2})\.md$")
for old in glob.glob(os.path.join(inbox_dir, "cs-wiki-gen-*.md")):
    m = date_pat.search(os.path.basename(old))
    if not m or m.group(1) >= today:
        continue
    dst = os.path.join(archive_dir, os.path.basename(old))
    if os.path.exists(dst):
        base, ext = os.path.splitext(os.path.basename(old))
        dst = os.path.join(archive_dir, f"{base}-stale{ext}")
    shutil.move(old, dst)

if not missing:
    sys.exit(0)

raw_count = sum(1 for m in missing if m["access_status"] == "raw-confirmed")
url_count = sum(1 for m in missing if m["access_status"] == "url-verified")

by_domain = {}
for m in missing:
    by_domain.setdefault(m["domain_id"], []).append(m)

req_path = os.path.join(inbox_dir, f"cs-wiki-gen-{today}.md")
with open(req_path, "w", encoding="utf-8") as fh:
    fh.write("# cs wiki 未生成源泉の検知 (cs#226)\n\n")
    fh.write(f"generated: {today}\n")
    fh.write("action: manual-review\n")
    fh.write("scope: cs/knowledge/wiki/\n\n")
    fh.write(
        f"## 未生成 {len(missing)} 件 "
        f"(raw-confirmed: {raw_count}, url-verified: {url_count})\n\n"
    )
    fh.write("| source_id | domain_id | access_status | title | local_file | doi | oa_url |\n")
    fh.write("|---|---|---|---|---|---|---|\n")
    for m in missing:
        fh.write(
            f"| {m['source_id']} | {m['domain_id']} | {m['access_status']}"
            f" | {m['title']} | {m['local_file']}"
            f" | {m['doi']} | {m['oa_url']} |\n"
        )
    fh.write("\n## ドメイン別内訳\n\n")
    for domain_id in sorted(by_domain):
        fh.write(f"- {domain_id}: {len(by_domain[domain_id])} 件\n")
    fh.write("\n## 処理手順\n\n")
    fh.write("1. raw-confirmed 行: `local_file` の PDF を `pdftotext` で読み、source-reader agent で wiki 生成\n")
    fh.write("2. url-verified 行: `oa_url` を WebFetch で読み、原典精読ベースで wiki 生成\n")
    fh.write("3. 出力先: `knowledge/wiki/D{NN}/{source_id}_{slug}.md`\n")
    fh.write("4. 生成後、この依頼ファイルを `archive/` に移動\n")

print(
    f"wiki-gen-check: {len(missing)} 件の cs wiki が未生成"
    f" (raw-confirmed: {raw_count}, url-verified: {url_count})"
    f" -> .cache/inbox/cs-wiki-gen-{today}.md",
    file=sys.stderr,
)
PY
