# 並行作業・ワークツリー運用ルール

## サブエージェント枠ゲート（最優先・cs#246）

> **背景**: Pro/Max サブスクではサブエージェント・skills・MCP も「サブスク枠」に含まれ追加API課金はされない。ただし並列サブエージェントは枠（ローリング窓）を急速消費する。**実測: サブエージェント4本×18分 = メイン13hの約1/3**。これで枠が枯れセッションが停止した。

**サブエージェント（Agent tool）を起動する前に、必ず枠ゲートを通す:**

```bash
bash scripts/budget-check.sh --plan {起動予定本数} --reset {リセット時刻 HH:MM}
```

判定に従う:

| 判定 | 条件 | アクション |
|------|------|-----------|
| **SUBAGENT_OK** | 消費率 <60% かつ ペース余裕 | 計画通り起動可 |
| **CAUTION** | 消費率 60-85% / 起動で85%超予測 | 1本まで・Haiku/Sonnet・小スコープ |
| **MAIN_ONLY** | 消費率 ≥85% / リセット前に枯渇するペース | サブエージェント禁止。対話で逐次 or 決定的スクリプト |

原則:
- **read-only の検査・集計は決定的スクリプト（`scripts/`）を優先**。LLM サブエージェントは「PDF全文読解→要約」等のコンテキスト分離が本質的に必要な場合に限る
- 並列は2本までを既定とする（3本以上は budget-check が OK でも要再考）
- 較正値 ceiling は `~/.claude/.budget-ceiling`（無ければ既定 4,800,000）

## 3レーン構成

| レーン | 実行方式 | 用途 |
|--------|---------|------|
| **Main** | 本体セッション | 設計決定、優先順位判断、最終検証 |
| **Agent-BG** | Agent(background) | 調査、検証、Issue 操作、報告生成 |
| **Agent-WT** | Agent(background, worktree) | ファイル編集を伴う独立タスク |

## ワークツリー・ブランチ規約

ブランチ命名: `wt/{task-slug}`

ライフサイクル:
1. Agent(worktree) が `.claude/worktrees/` に作成
2. worktree 内で編集・コミット
3. 本体が `develop` にマージ → worktree とブランチを削除

コミットメッセージ: `{type}: {summary} [wt/{slug}]`

## ファイル所有権（競合防止）

原則: 1ファイルを同時に2レーンが編集しない。
Main がタスク振り分け時に対象ファイルを明示し、所有権を割り当てる。

共有禁止ファイル（常に Main のみ編集）:
- `CLAUDE.md`
- `.claude/rules/*.md`

## 生成物所有権（共有出力の競合防止）

| 生成物 | 所有レーン | 理由 |
|--------|-----------|------|
| `pjdhiro/assets/creation/manifests/domains.json` | Main のみ | generate-domains-json.mjs の実行と配信は Main |
| `transform/domains/publish/domains/index.json` | Main のみ | progress_level の SoT。pjdhiro 承認必要 |
| PDF（`pjdhiro/assets/creation/domains/*/pdf/`） | Main のみ | ビルドと配信の一貫性 |

Agent-WT がデータパイプラインの上流を変更する場合は、下流への影響を報告し、Main が生成・配信する。

## マージプロトコル（必須）

Agent-WT 完了後、Main は以下を**同一ターンで**すべて実行する:

1. `git log` / `git diff develop..{branch} --stat` で変更を確認する
2. `git merge {branch} --no-edit` で develop にマージする
3. `git worktree remove .claude/worktrees/{agent-id} --force` で worktree を削除する
4. `git branch -D {branch}` でブランチを削除する
5. 問題があればマージ前に修正するか、Agent-WT を再起動する

**Agent-WT の起動プロンプトにもこの完了手順を含めること。**
Agent 側がマージ・worktree 削除を行ってはならない。Main の責務。

## 注意事項

- Agent-WT は push しない。本体がマージと push を行う
- Agent-BG は検証と報告に集中する
- 2並行を推奨（3レーン以上はレート制限リスク）
- Agent-WT 起動時は `max_turns` を設定する
