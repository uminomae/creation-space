#!/usr/bin/env bash
# budget-check.sh — サブスク枠の消費ペースを集計し、サブエージェント起動の可否を判定する
#
# 背景: Pro/Max サブスクではサブエージェントも skills も MCP も「サブスク枠」に含まれ
#       追加API課金はされない。ただし並列サブエージェントは枠（5hローリング窓）を
#       急速消費する。実測(cs#246): サブエージェント4本×18分 = メイン13hの約1/3を消費。
#       → 起動前にこのスクリプトで「残枠 ÷ 残時間」のペース判断を行う。
#
# 使い方:
#   bash scripts/budget-check.sh                          # 現状の消費率と判定
#   bash scripts/budget-check.sh --plan 4                 # サブエージェント4本起動を想定した判定
#   bash scripts/budget-check.sh --window 5 --reset 22:40 # 窓5h・リセット22:40(ローカル)で判定
#
# 較正: 上限到達時の消費を ~/.claude/.budget-ceiling に1行(weighted tokens)で保存。
#       無ければ既定 4800000（cs#246 セッションの到達実測）を使う。
set -euo pipefail

WINDOW=5
PLAN=0
RESET=""
CEILING_FILE="${HOME}/.claude/.budget-ceiling"
PER_AGENT=350000   # サブエージェント1本あたりの weighted 消費見積（実測 ~310K に安全マージン）

while [[ $# -gt 0 ]]; do
  case "$1" in
    --window) WINDOW="$2"; shift 2;;
    --plan)   PLAN="$2"; shift 2;;
    --reset)  RESET="$2"; shift 2;;
    *) echo "unknown arg: $1" >&2; exit 2;;
  esac
done

CEILING=4800000
[[ -f "$CEILING_FILE" ]] && CEILING=$(tr -dc '0-9' < "$CEILING_FILE")

export WINDOW PLAN RESET CEILING PER_AGENT

python3 - <<'PY'
import json, glob, os
from datetime import datetime, timezone, timedelta

W       = float(os.environ['WINDOW'])
PLAN    = int(os.environ['PLAN'])
RESET   = os.environ['RESET'].strip()
CEILING = int(os.environ['CEILING'])
PER     = int(os.environ['PER_AGENT'])

now = datetime.now(timezone.utc)
window = now - timedelta(hours=W)

tot = {'input':0,'cc':0,'cr':0,'out':0}
for f in glob.glob(os.path.expanduser('~/.claude/projects/**/*.jsonl'), recursive=True):
    try:
        with open(f, errors='ignore') as fh:
            for line in fh:
                if '"usage"' not in line: continue
                try: d = json.loads(line)
                except Exception: continue
                ts = d.get('timestamp')
                if not ts: continue
                try: t = datetime.fromisoformat(ts.replace('Z','+00:00'))
                except Exception: continue
                if t < window: continue
                u = d.get('message',{}).get('usage')
                if not isinstance(u, dict): continue
                tot['input'] += u.get('input_tokens',0) or 0
                tot['cc']    += u.get('cache_creation_input_tokens',0) or 0
                tot['cr']    += u.get('cache_read_input_tokens',0) or 0
                tot['out']   += u.get('output_tokens',0) or 0
    except OSError: continue

billable = tot['input'] + tot['cc'] + tot['out']
weighted = billable + tot['cr'] // 10
ratio = weighted / CEILING if CEILING else 0
remain = CEILING - weighted

reset_info = ""
pace_over = False
if RESET:
    try:
        hh, mm = map(int, RESET.split(':'))
        local_now = datetime.now().astimezone()
        target = local_now.replace(hour=hh, minute=mm, second=0, microsecond=0)
        if target <= local_now:
            target += timedelta(days=1)
        hrs = (target - local_now).total_seconds()/3600
        allow_pace = remain / hrs if hrs > 0 else 0
        cur_pace   = weighted / W
        reset_info = f"リセットまで {hrs:.1f}h / 現ペース {cur_pace:,.0f}/h vs 許容 {allow_pace:,.0f}/h"
        if cur_pace > allow_pace:
            pace_over = True
    except Exception:
        reset_info = f"(reset 解析失敗: {RESET})"

def verdict():
    if ratio >= 0.85: return "MAIN_ONLY", "枠の85%超。サブエージェント禁止。対話で逐次 or 決定的スクリプトのみ"
    if pace_over:     return "MAIN_ONLY", "現ペースではリセット前に枯渇。対話で逐次"
    if ratio >= 0.60: return "CAUTION", "枠の60%超。サブエージェントは1本まで・Haiku/Sonnet・小スコープ"
    if PLAN > 0:
        projected = weighted + PLAN*PER
        if projected/CEILING >= 0.85:
            n_ok = max(0, int((0.85*CEILING - weighted)//PER))
            return "CAUTION", f"{PLAN}本起動で85%超予測。安全なのは最大{n_ok}本まで"
    return "SUBAGENT_OK", (f"余裕あり。サブエージェント起動可（予定{PLAN}本）" if PLAN else "余裕あり")

v, msg = verdict()
bn = min(int(ratio*20), 20)
bar = '#'*bn + '-'*(20-bn)

print("=== サブエージェント枠ゲート (budget-check) ===")
print(f"集計窓: 直近{W:g}h（{window.strftime('%m-%d %H:%M')}Z 以降、全プロジェクト+subagents）")
print(f"weighted消費: {weighted:,}  (billable {billable:,} + cache_read/10 {tot['cr']//10:,})")
print(f"枠較正値:     {CEILING:,}")
print(f"消費率: [{bar}] {ratio*100:.0f}%")
if reset_info: print(reset_info)
if PLAN: print(f"予定起動: {PLAN}本 x {PER:,}/本(見積) = +{PLAN*PER:,}")
print(f"--- 判定: {v} ---")
print(msg)
PY
