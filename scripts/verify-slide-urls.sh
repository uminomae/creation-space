#!/usr/bin/env bash
# verify-slide-urls.sh — マニフェストの slug と実ファイル名の整合チェック
#
# 用途: domains.json の slug から生成される URL が実在するか確認
# CI/CD: push 前 or 定期レビューで実行
# 前提: pjdhiro リポがローカルにある (~/dev/pjdhiro/)
#
# 使い方:
#   bash scripts/verify-slide-urls.sh           # ローカルファイルチェック
#   bash scripts/verify-slide-urls.sh --remote   # リモート URL の HEAD チェック

set -euo pipefail

PJDHIRO_DIR="${PJDHIRO_DIR:-$HOME/dev/pjdhiro}"
MANIFEST="$PJDHIRO_DIR/assets/creation/manifests/domains.json"
REMOTE_BASE="https://uminomae.github.io/pjdhiro/assets/creation"
MODE="${1:-local}"

if [ ! -f "$MANIFEST" ]; then
    echo "ERROR: $MANIFEST not found" >&2
    exit 1
fi

FAIL=0

# Extract domain entries: id and slug
python3 -c "
import json, sys
with open('$MANIFEST') as f:
    data = json.load(f)
for r in data['reports']:
    print('%s\t%s' % (r['id'], r['slug']))
" | while IFS=$'\t' read -r id slug; do
    for lang in ja en; do
        for ext in html md; do
            filename="domain-${id}-${slug}-presentation-${lang}.${ext}"
            if [ "$MODE" = "--remote" ]; then
                url="${REMOTE_BASE}/domains/${lang}/presentations/${ext}/${filename}"
                status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
                if [ "$status" != "200" ]; then
                    echo "FAIL [$status]: $url"
                    FAIL=1
                fi
            else
                path="$PJDHIRO_DIR/assets/creation/domains/${lang}/presentations/${ext}/${filename}"
                if [ ! -f "$path" ]; then
                    echo "FAIL: $path"
                    FAIL=1
                fi
            fi
        done
    done
done

if [ "$FAIL" = "0" ]; then
    echo "PASS: All slide URLs match manifest slugs"
else
    echo ""
    echo "FAIL: Slug/filename mismatches detected. Fix manifest or rename files."
    exit 1
fi
