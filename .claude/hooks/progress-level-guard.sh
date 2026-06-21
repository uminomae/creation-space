#!/usr/bin/env bash
# progress-level-guard.sh — cs#110
# PreToolUse: index.json の progress_level/progress_note 変更を検知、Issue番号なしなら BLOCK
# PostToolUse: human_reviewed への昇格検知で WARN

set -euo pipefail
source "$(dirname "$0")/_common"
hook_init

TOOL="$(hook_tool_name)"
EVENT="$(hook_event_name)"

# 対象: index.json への書き込み操作のみ
INDEX_REL="transform/domains/publish/domains/index.json"
INDEX_ABS="${REPO_ROOT}/${INDEX_REL}"

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

# Edit/Write の内容から progress_level / progress_note 変更を検知
has_progress_change() {
  local old_string new_string content command
  old_string="$(hook_tool_input_field 'old_string')" || true
  new_string="$(hook_tool_input_field 'new_string')" || true
  content="$(hook_tool_input_field 'content')" || true
  command="$(hook_tool_input_field 'command')" || true

  # Edit: old_string or new_string に progress_level/progress_note が含まれるか
  if [ -n "$old_string" ] || [ -n "$new_string" ]; then
    if echo "$old_string" "$new_string" | grep -qE '"progress_(level|note)"'; then
      return 0
    fi
  fi

  # Write: content に progress_level が含まれる場合（全書き換え）
  # Write の場合は常に progress フィールドを含むので、現在のファイルと比較が必要
  if [ "$TOOL" = "Write" ] && [ -n "$content" ] && [ -f "$INDEX_ABS" ]; then
    # 現在のファイルから progress_level 値を抽出し、新しい content と比較
    local current_levels new_levels
    current_levels="$(python3 - "$INDEX_ABS" <<'PY' 2>/dev/null || true
import json, sys
with open(sys.argv[1]) as f:
    data = json.load(f)
for r in data.get('reports', []):
    print(r['id'], r.get('progress_level',''), r.get('progress_note',''))
PY
)"
    new_levels="$(echo "$content" | python3 -c "
import json, sys
data = json.load(sys.stdin)
for r in data.get('reports', []):
    print(r['id'], r.get('progress_level',''), r.get('progress_note',''))
" 2>/dev/null || true)"
    if [ -n "$current_levels" ] && [ -n "$new_levels" ] && [ "$current_levels" != "$new_levels" ]; then
      return 0
    fi
  fi

  # Bash: sed/awk 等による書き換え
  if [ -n "$command" ]; then
    if echo "$command" | grep -qE 'progress_(level|note)'; then
      if echo "$command" | grep -q "$INDEX_REL\|index\.json"; then
        return 0
      fi
    fi
  fi

  return 1
}

# transcript にIssue番号が含まれているか
has_issue_reference() {
  hook_transcript_contains "cs#" 2>/dev/null && return 0
  # tool_input の中にも cs# があるか確認
  local old_string new_string
  old_string="$(hook_tool_input_field 'old_string')" || true
  new_string="$(hook_tool_input_field 'new_string')" || true
  if echo "$old_string $new_string" | grep -qE 'cs#[0-9]+'; then
    return 0
  fi
  return 1
}

# human_reviewed への昇格検知
has_human_reviewed_promotion() {
  local new_string content
  new_string="$(hook_tool_input_field 'new_string')" || true
  content="$(hook_tool_input_field 'content')" || true

  if echo "$new_string" "$content" | grep -q '"human_reviewed"'; then
    return 0
  fi
  return 1
}

# ---- メイン処理 ----

# index.json が対象でなければスキップ
is_index_target || exit 0

case "$EVENT" in
  PreToolUse)
    # progress_level/progress_note の変更を検知
    if has_progress_change; then
      if ! has_issue_reference; then
        hook_block "progress_level/progress_note の変更には Issue 番号（cs#NNN）が必要です。evidence-progress.md §鉄則 参照。"
      fi
    fi
    ;;
  PostToolUse)
    # human_reviewed への昇格を検知
    if has_human_reviewed_promotion; then
      hook_warn "human_reviewed への昇格を検知しました。これは pjdhiro 専権です（evidence-progress.md §保護ルール）。"
    fi
    ;;
esac

exit 0
