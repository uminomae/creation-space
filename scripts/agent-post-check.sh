#!/usr/bin/env bash
# agent-post-check.sh — Agent subagent 完了後の自動検証スクリプト
# 用途: DONE ファイル・pending agents・Issue コメント・backlog 同期を機械的にチェック
#
# Usage:
#   bash scripts/agent-post-check.sh              # 全般チェック（引数なし）
#   bash scripts/agent-post-check.sh --issue 123   # 特定 Issue チェック

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="${REPO_ROOT}/.cache"

# --- 引数パース ---
ISSUE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --issue)
      ISSUE="$2"
      shift 2
      ;;
    --issue=*)
      ISSUE="${1#--issue=}"
      shift
      ;;
    *)
      echo "Unknown option: $1" >&2
      echo "Usage: $0 [--issue NUMBER]" >&2
      exit 2
      ;;
  esac
done

# --- カウンタ ---
count_pass=0
count_warn=0
count_fail=0

pass() { echo "[PASS] $1"; count_pass=$((count_pass + 1)); }
warn() { echo "[WARN] $1"; count_warn=$((count_warn + 1)); }
fail() { echo "[FAIL] $1"; count_fail=$((count_fail + 1)); }

echo "=== Agent Post-Check ==="

# ============================================================
# Check 1: DONE ファイル確認
# ============================================================

done_dir="${CACHE_DIR}/outbox"
if [[ -d "$done_dir" ]]; then
  done_count=0
  while IFS= read -r -d '' _; do
    done_count=$((done_count + 1))
  done < <(find "$done_dir" -maxdepth 1 -name 'DONE-*.md' -type f -print0 2>/dev/null || true)

  if [[ $done_count -gt 0 ]]; then
    pass "DONE files: ${done_count} found"
  else
    warn "DONE files: 0 found in ${done_dir}/"
  fi
else
  warn "DONE files: outbox directory does not exist"
fi

# ============================================================
# Check 2: Pending agents 確認
# ============================================================

pending_dir="${CACHE_DIR}/hooks/pending-agents"
if [[ -d "$pending_dir" ]]; then
  pending_count=0
  while IFS= read -r -d '' _; do
    pending_count=$((pending_count + 1))
  done < <(find "$pending_dir" -maxdepth 1 -type f -print0 2>/dev/null || true)

  if [[ $pending_count -gt 0 ]]; then
    warn "Pending agents: ${pending_count} file(s) in .cache/hooks/pending-agents/"
  else
    pass "Pending agents: none"
  fi
else
  pass "Pending agents: none (directory absent)"
fi

# ============================================================
# Check 3: Issue コメント確認（--issue 指定時のみ）
# ============================================================

if [[ -n "$ISSUE" ]]; then
  if command -v gh &>/dev/null; then
    # gh CLI が利用可能
    head_sha="$(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null || true)"

    if [[ -z "$head_sha" ]]; then
      fail "Issue #${ISSUE}: could not determine HEAD SHA"
    else
      # 最新コメントを取得し SHA が含まれるか確認
      comments_json="$(gh issue view "$ISSUE" --json comments 2>/dev/null || true)"
      if [[ -z "$comments_json" ]]; then
        fail "Issue #${ISSUE}: could not fetch issue comments (gh failed)"
      else
        # コメント本文全体から SHA を検索
        if echo "$comments_json" | grep -q "$head_sha"; then
          pass "Issue #${ISSUE}: comment with SHA found"
        else
          fail "Issue #${ISSUE}: no comment containing SHA ${head_sha}"
        fi
      fi
    fi
  else
    echo "[SKIP] Issue #${ISSUE}: gh CLI not available"
  fi
fi

# ============================================================
# Check 4: backlog.md 整合（--issue 指定時のみ）
# ============================================================

if [[ -n "$ISSUE" ]]; then
  backlog_file="${CACHE_DIR}/backlog.md"
  if [[ -f "$backlog_file" ]]; then
    # Issue 番号の行を探し、完了マーク（完了 or DONE）があるか確認
    issue_line="$(grep -n "#${ISSUE}\b\|#${ISSUE} " "$backlog_file" 2>/dev/null || true)"
    if [[ -z "$issue_line" ]]; then
      fail "Backlog: Issue #${ISSUE} not found in backlog.md"
    else
      if echo "$issue_line" | grep -qi '完了\|done\|closed'; then
        pass "Backlog: Issue #${ISSUE} marked as complete"
      else
        fail "Backlog: Issue #${ISSUE} not marked as complete"
      fi
    fi
  else
    warn "Backlog: backlog.md not found"
  fi
fi

# ============================================================
# Summary
# ============================================================

echo "---"
echo "Result: ${count_fail} FAIL, ${count_warn} WARN, ${count_pass} PASS"

if [[ $count_fail -gt 0 ]]; then
  exit 1
else
  exit 0
fi
