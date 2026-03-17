#\!/usr/bin/env bash
# quality-level-guard.sh — cs#111
# PreToolUse: quality_level の逆行を BLOCK
# PostToolUse: 独立レビュー未実施のまま PDF 公開しようとしたら WARN

set -euo pipefail
source "$(dirname "$0")/_common"
hook_init

TOOL="$(hook_tool_name)"
EVENT="$(hook_event_name)"

# 対象: index.json への書き込み操作のみ
INDEX_REL="transform/domains/publish/domains/index.json"
INDEX_ABS="${REPO_ROOT}/${INDEX_REL}"

# quality_level の順序定義（低い方が前）
QUALITY_ORDER="not_generated generated self_tested independent_reviewed pjdhiro_reviewed"

quality_level_rank() {
  local level="$1"
  local rank=0
  for l in $QUALITY_ORDER; do
    if [ "$l" = "$level" ]; then
      echo "$rank"
      return 0
    fi
    ((rank++)) || true
  done
  echo "-1"
  return 0
}

# パスを収集して index.json が含まれるか判定
is_index_target() {
  local paths
  paths="$(hook_collect_paths)"
  [ -z "$paths" ] && return 1

  while IFS= read -r p; do
    local norm
    norm="$(hook_normalize_path "$p")" || continue
    local rel
    rel="$(hook_repo_rel "$norm")" || continue
    if [ "$rel" = "$INDEX_REL" ]; then
      return 0
    fi
  done <<< "$paths"
  return 1
}

# Edit/Write の内容から quality_level 変更を検知
has_quality_change() {
  local old_string new_string content command
  old_string="$(hook_tool_input_field 'old_string')" || true
  new_string="$(hook_tool_input_field 'new_string')" || true
  content="$(hook_tool_input_field 'content')" || true
  command="$(hook_tool_input_field 'command')" || true

  if [ -n "$old_string" ] || [ -n "$new_string" ]; then
    if echo "$old_string" "$new_string" | grep -qE '"quality_level"'; then
      return 0
    fi
  fi

  if [ "$TOOL" = "Write" ] && [ -n "$content" ] && [ -f "$INDEX_ABS" ]; then
    local current_levels new_levels
    current_levels="$(python3 - "$INDEX_ABS" <<'PY' 2>/dev/null || true
import json, sys
with open(sys.argv[1]) as f:
    data = json.load(f)
for r in data.get('reports', []):
    print(r['id'], r.get('quality_level',''))
PY
)"
    new_levels="$(echo "$content" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for r in data.get('reports', []):
    print(r['id'], r.get('quality_level',''))
" 2>/dev/null || true)"
    if [ -n "$current_levels" ] && [ -n "$new_levels" ] && [ "$current_levels" \!= "$new_levels" ]; then
      return 0
    fi
  fi

  if [ -n "$command" ]; then
    if echo "$command" | grep -qE 'quality_level'; then
      if echo "$command" | grep -q "$INDEX_REL\|index\.json"; then
        return 0
      fi
    fi
  fi

  return 1
}

# quality_level の逆行チェック（Write の場合）
check_quality_regression() {
  local content
  content="$(hook_tool_input_field 'content')" || true

  if [ "$TOOL" \!= "Write" ] || [ -z "$content" ] || [ \! -f "$INDEX_ABS" ]; then
    # Edit の場合は old_string/new_string から検知
    local old_string new_string
    old_string="$(hook_tool_input_field 'old_string')" || true
    new_string="$(hook_tool_input_field 'new_string')" || true

    if [ -n "$old_string" ] && [ -n "$new_string" ]; then
      local old_level new_level
      old_level="$(echo "$old_string" | python3 -c "
import sys, re
text = sys.stdin.read()
m = re.search(r'\"quality_level\"\s*:\s*\"([^\"]+)\"', text)
print(m.group(1) if m else '')
" 2>/dev/null || true)"
      new_level="$(echo "$new_string" | python3 -c "
import sys, re
text = sys.stdin.read()
m = re.search(r'\"quality_level\"\s*:\s*\"([^\"]+)\"', text)
print(m.group(1) if m else '')
" 2>/dev/null || true)"

      if [ -n "$old_level" ] && [ -n "$new_level" ]; then
        local old_rank new_rank
        old_rank="$(quality_level_rank "$old_level")"
        new_rank="$(quality_level_rank "$new_level")"
        if [ "$new_rank" -lt "$old_rank" ] && [ "$old_rank" -ge 0 ] && [ "$new_rank" -ge 0 ]; then
          hook_block "quality_level の逆行は禁止です: ${old_level} → ${new_level}（evidence-metadata-creation.md §2.9）"
        fi
      fi
    fi
    return
  fi

  # Write: 全体比較（content を stdin 経由で渡し ARG_MAX を回避）
  local rc=0
  echo "$content" | python3 - "$INDEX_ABS" <<'PY' || rc=$?
import json, sys

order = ['not_generated', 'generated', 'self_tested', 'independent_reviewed', 'pjdhiro_reviewed']
rank = {v: i for i, v in enumerate(order)}

with open(sys.argv[1]) as f:
    current = json.load(f)

new_data = json.load(sys.stdin)

current_map = {r['id']: r.get('quality_level', '') for r in current.get('reports', [])}
regressions = []
for r in new_data.get('reports', []):
    did = r['id']
    old_ql = current_map.get(did, '')
    new_ql = r.get('quality_level', '')
    old_r = rank.get(old_ql, -1)
    new_r = rank.get(new_ql, -1)
    if old_r >= 0 and new_r >= 0 and new_r < old_r:
        regressions.append(f"{did}: {old_ql} -> {new_ql}")

if regressions:
    print("REGRESSION:" + "; ".join(regressions))
    sys.exit(1)
PY
  if [ $rc -ne 0 ]; then
    hook_block "quality_level の逆行を検知しました（evidence-metadata-creation.md §2.9）"
  fi
}

# PDF 公開操作で独立レビュー未実施を検知
check_unpublish_guard() {
  local command
  command="$(hook_tool_input_field 'command')" || true

  if [ -z "$command" ]; then
    return
  fi

  # build-pdf-guide.sh の実行を検知
  if echo "$command" | grep -q 'build-pdf-guide'; then
    if [ -f "$INDEX_ABS" ]; then
      local unreviewed
      unreviewed="$(python3 - "$INDEX_ABS" <<'PY' 2>/dev/null || true
import json, sys

reviewed_levels = {'independent_reviewed', 'pjdhiro_reviewed'}
with open(sys.argv[1]) as f:
    data = json.load(f)
unreviewed = []
for r in data.get('reports', []):
    ql = r.get('quality_level', 'generated')
    if ql not in reviewed_levels:
        unreviewed.append(r['id'])
if unreviewed:
    print(', '.join(unreviewed))
PY
)"
      if [ -n "$unreviewed" ]; then
        hook_warn "独立レビュー未実施のドメインがあります: ${unreviewed}（WORKFLOW.md Step 4 参照）"
      fi
    fi
  fi
}

# ---- メイン処理 ----

case "$EVENT" in
  PreToolUse)
    # index.json の quality_level 変更を検知
    if is_index_target && has_quality_change; then
      check_quality_regression
    fi
    # PDF 公開ガード（Bash ツールの場合）
    if [ "$TOOL" = "Bash" ]; then
      check_unpublish_guard
    fi
    ;;
  PostToolUse)
    # index.json の quality_level 変更を検知（事後警告）
    if is_index_target && has_quality_change; then
      # 事後の逆行は PreToolUse で BLOCK 済みなので追加処理なし
      true
    fi
    ;;
esac

exit 0
