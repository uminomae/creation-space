#!/usr/bin/env bash
# agent-post-check.sh — Agent subagent 完了後の自動検証スクリプト
# 用途: DONE ファイル・pending agents・backlog/state 同期を機械的にチェック
# Stop hook として登録可能（stdout に結果を出力、exit code で判定）
#
# Usage: bash scripts/agent-post-check.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="${REPO_ROOT}/.cache"

# --- 出力ユーティリティ ---
has_fail=0
has_warn=0

pass()  { echo "  [PASS] $1"; }
warn()  { echo "  [WARN] $1"; has_warn=1; }
fail()  { echo "  [FAIL] $1"; has_fail=1; }
header(){ echo ""; echo "=== $1 ==="; }

# ============================================================
# Check 1: DONE files
# ============================================================
header "Check 1: DONE files (.cache/outbox/DONE-*.md)"

done_dir="${CACHE_DIR}/outbox"
if [ -d "$done_dir" ]; then
  done_files=()
  while IFS= read -r -d '' f; do
    done_files+=("$f")
  done < <(find "$done_dir" -maxdepth 1 -name 'DONE-*.md' -type f -print0 2>/dev/null || true)

  if [ ${#done_files[@]} -gt 0 ]; then
    pass "${#done_files[@]} DONE file(s) found"
    for f in "${done_files[@]}"; do
      basename_f="$(basename "$f")"
      # Show first 3 non-empty lines as summary
      summary="$(grep -m 3 -v '^$' "$f" 2>/dev/null | head -3 || true)"
      echo "    - ${basename_f}"
      if [ -n "$summary" ]; then
        while IFS= read -r line; do
          echo "      ${line}"
        done <<< "$summary"
      fi
    done
  else
    warn "No DONE files found in ${done_dir}/"
  fi
else
  warn "outbox directory does not exist: ${done_dir}/"
fi

# ============================================================
# Check 2: Pending agents
# ============================================================
header "Check 2: Pending agents (.cache/hooks/pending-agents/)"

pending_dir="${CACHE_DIR}/hooks/pending-agents"
if [ -d "$pending_dir" ]; then
  pending_files=()
  while IFS= read -r -d '' f; do
    pending_files+=("$f")
  done < <(find "$pending_dir" -maxdepth 1 -type f -print0 2>/dev/null || true)

  if [ ${#pending_files[@]} -gt 0 ]; then
    warn "${#pending_files[@]} pending agent(s) detected — may indicate incomplete Agent runs"
    for f in "${pending_files[@]}"; do
      basename_f="$(basename "$f")"
      # Extract description and status from frontmatter
      desc="$(grep -m 1 '^description:' "$f" 2>/dev/null | sed 's/^description: *//' || echo "unknown")"
      status="$(grep -m 1 '^status:' "$f" 2>/dev/null | sed 's/^status: *//' || echo "unknown")"
      echo "    - ${basename_f} (status: ${status}, desc: ${desc})"
    done
  else
    pass "No pending agents"
  fi
else
  pass "No pending agents directory (clean state)"
fi

# ============================================================
# Check 3: Backlog sync
# ============================================================
header "Check 3: Backlog sync (.cache/backlog.md)"

backlog_file="${CACHE_DIR}/backlog.md"
if [ -f "$backlog_file" ]; then
  # Look for items marked as in-progress (CLI作業中 or 外部実行中)
  active_items="$(grep -n 'CLI作業中\|外部実行中' "$backlog_file" 2>/dev/null || true)"
  if [ -n "$active_items" ]; then
    warn "Active items remain in backlog.md:"
    while IFS= read -r line; do
      echo "    ${line}"
    done <<< "$active_items"
  else
    pass "No active items in backlog.md"
  fi
else
  warn "backlog.md not found at ${backlog_file}"
fi

# ============================================================
# Check 4: State sync (HEAD SHA)
# ============================================================
header "Check 4: State sync (.cache/session/state.md HEAD SHA)"

state_file="${CACHE_DIR}/session/state.md"
if [ -f "$state_file" ]; then
  # Extract SHA from state.md — look for common patterns like "HEAD: abc1234" or "SHA: abc1234"
  state_sha="$(grep -oE '[0-9a-f]{7,40}' "$state_file" | head -1 || true)"
  actual_sha="$(git -C "$REPO_ROOT" rev-parse HEAD 2>/dev/null || true)"

  if [ -z "$state_sha" ]; then
    warn "Could not extract SHA from state.md"
  elif [ -z "$actual_sha" ]; then
    fail "Could not determine git HEAD SHA"
  else
    # Compare short SHAs (first 7 chars)
    state_short="${state_sha:0:7}"
    actual_short="${actual_sha:0:7}"
    if [ "$state_short" = "$actual_short" ]; then
      pass "HEAD SHA matches (${actual_short})"
    else
      fail "HEAD SHA mismatch: state.md=${state_short}, git HEAD=${actual_short}"
    fi
  fi
else
  warn "state.md not found at ${state_file}"
fi

# ============================================================
# Summary
# ============================================================
echo ""
echo "--- Summary ---"
if [ "$has_fail" -eq 1 ]; then
  echo "Result: FAIL (action required)"
  exit 1
elif [ "$has_warn" -eq 1 ]; then
  echo "Result: WARN (review recommended)"
  exit 0
else
  echo "Result: ALL PASS"
  exit 0
fi
