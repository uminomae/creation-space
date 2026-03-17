#\!/usr/bin/env bash
# verify-hooks.sh — cs#110
# hooks ファイルの存在・executable 権限・_common 依存の整合を検証

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOKS_DIR="${REPO_ROOT}/.claude/hooks"
HOOKS_JSON="${REPO_ROOT}/.claude/hooks.json"

passed=0
failed=0

assert() {
  local label="$1"
  local condition="$2"
  if eval "$condition" 2>/dev/null; then
    echo "  PASS: $label"
    ((passed++)) || true
  else
    echo "  FAIL: $label"
    ((failed++)) || true
  fi
}

echo "verify-hooks (cs#110)"
echo ""

# 1. _common が存在し executable であること
assert "_common exists" "[ -f '${HOOKS_DIR}/_common' ]"
assert "_common is executable" "[ -x '${HOOKS_DIR}/_common' ]"

# 2. hooks.json が存在すること
assert "hooks.json exists" "[ -f '${HOOKS_JSON}' ]"

# 3. hooks.json が valid JSON であること
assert "hooks.json is valid JSON" "python3 -c \"import json; json.load(open('${HOOKS_JSON}'))\""

# 4. hooks.json に登録された全スクリプトが存在し executable であること
echo ""
echo "  Checking hooks.json references:"
hook_scripts="$(python3 -c "
import json
with open('${HOOKS_JSON}') as f:
    data = json.load(f)
seen = set()
for event_hooks in data.get('hooks', {}).values():
    for matcher_group in event_hooks:
        for hook in matcher_group.get('hooks', []):
            cmd = hook.get('command', '')
            if cmd and cmd not in seen:
                seen.add(cmd)
                print(cmd)
" 2>/dev/null || true)"

while IFS= read -r script; do
  [ -z "$script" ] && continue
  full_path="${REPO_ROOT}/${script}"
  assert "  ${script} exists" "[ -f '${full_path}' ]"
  assert "  ${script} is executable" "[ -x '${full_path}' ]"
done <<< "$hook_scripts"

# 5. 全 hook スクリプトが _common を source しているか
echo ""
echo "  Checking _common dependency:"
for script_file in "${HOOKS_DIR}"/*.sh; do
  [ -f "$script_file" ] || continue
  name="$(basename "$script_file")"
  assert "  ${name} sources _common" "grep -q 'source.*_common' '${script_file}'"
done

# 6. 新規 hooks (progress-level-guard, domains-json-sync-guard) の存在確認
echo ""
echo "  Checking cs#110 hooks:"
assert "progress-level-guard.sh exists" "[ -f '${HOOKS_DIR}/progress-level-guard.sh' ]"
assert "progress-level-guard.sh is executable" "[ -x '${HOOKS_DIR}/progress-level-guard.sh' ]"
assert "domains-json-sync-guard.sh exists" "[ -f '${HOOKS_DIR}/domains-json-sync-guard.sh' ]"
assert "domains-json-sync-guard.sh is executable" "[ -x '${HOOKS_DIR}/domains-json-sync-guard.sh' ]"

# Summary
echo ""
echo "  ${passed} passed, ${failed} failed"
exit $(( failed > 0 ? 1 : 0 ))
