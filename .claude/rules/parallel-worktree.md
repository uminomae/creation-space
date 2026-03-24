# 並行作業・ワークツリー運用ルール

## 概要

Claude Code の Agent ツール（subagent / worktree / background）を活用し、複数タスクを並行処理する。
本体セッション（CLI または Desktop App）がプロジェクトマネージャーとして全レーンを統括する。

## 3レーン構成

| レーン | 実行方式 | 用途 | 判断レベル |
|--------|---------|------|-----------|
| **Main** | 本体セッション | 設計決定、優先順位判断、最終検証 | 高 |
| **Agent-BG** | Agent(background) | 調査、検証、Issue 操作、報告生成 | 低〜中 |
| **Agent-WT** | Agent(background, worktree) | ファイル編集を伴う独立タスク | 中 |

> Codex はフォールバックとして使ってよいが、同時編集範囲の宣言と完了条件の明確化は同じ基準で運用する。

## ワークツリー適用基準

| 条件 | ワークツリー |
|---|---|
| 20万 token 以上が予定される処理 | 使用する |
| 完了条件が明確に設定できる | 使用可 |
| 完了条件が曖昧・探索的 | 使用しない |
| 軽量タスク | develop 上で直接実行 |

ワークツリー作成時に事前明確化する項目:

1. 完了条件
2. マージ先（原則 `develop`）
3. 後処理（マージ、ワークツリー削除、ブランチ削除）

## ワークツリー・ブランチ規約

### ブランチ命名

```text
wt/{task-slug}
```

例:

- `wt/reports-modal-fix`
- `wt/knowledge-schema-sync`
- `wt/docs-nav-refresh`

### ライフサイクル

1. 作成: Agent(worktree) が `.claude/worktrees/` に作成
2. 作業: worktree 内で編集・コミット
3. マージ: 本体が `develop` にマージする
4. 削除: マージ後に worktree とブランチを削除

### ワークツリー内コミットメッセージ

```text
{type}: {summary} [wt/{slug}]

{body}

Co-Authored-By: Claude <noreply@anthropic.com>
```

## ファイル所有権（競合防止）

原則: 1ファイルを同時に2レーンが編集しない。

Main がタスク振り分け時に対象ファイルを明示し、所有権を割り当てる。

```text
Agent-WT(reports-modal-fix): src/reports/modal.js, src/styles/reports.css
Agent-BG(schema-check):     knowledge/schema/five-stages.md -> READ ONLY
Main:                       上記以外の全ファイル
```

共有禁止ファイル（常に Main のみ編集）:

- `CLAUDE.md`
- `.claude/rules/*.md`
- `.cache/session/state.md`
- `.cache/backlog.md`

## 生成物所有権（共有出力の競合防止）

入力ファイルの所有権だけでなく、生成物（共有出力）の所有権も明示する。
複数レーンが同じ生成物に書き込むと、3/15 インシデント（Reports 消失）の原因になる。

| 生成物 | 所有レーン | 理由 |
|--------|-----------|------|
| `pjdhiro/assets/creation/manifests/domains.json` | Main のみ | `generate-domains-json.mjs` の実行と pjdhiro への配信は Main が責任を持つ |
| `transform/domains/publish/domains/index.json` | Main のみ | progress_level の SoT。pjdhiro 承認が必要 |
| PDF（`pjdhiro/assets/creation/domains/*/pdf/`） | Main のみ | ビルドと配信の一貫性を保つ |

Agent-WT がデータパイプラインの上流（index.json, generate script）を変更する場合は、
下流の生成物への影響を報告し、Main が生成・配信を実行する。

## タスク分類基準

### Main 向き

- 設計決定・アーキテクチャ変更
- 複数レーンにまたがる優先順位調整
- 競合解消とマージ判断
- オーナー確認が必要な判断

### Agent-WT 向き

- `src/` の局所的な UI 修正
- `knowledge/` や `docs/` の構造整理
- `scripts/` の単機能追加や修正
- 完了条件が明確な複数ファイル編集

### Agent-BG 向き

- ファイル存在確認、Issue 状態確認
- grep / diff ベースの検証
- Issue コメント投稿
- DONE ファイル作成

## 本体（Main）の PM 責務

1. 作業開始時にレーン割当とファイル所有権を宣言する
2. Agent-BG / Agent-WT を必要に応じて並行起動する
3. background タスクの完了通知を監視し、結果を検証する
4. `.claude/rules/agent-completion.md` に従って完了処理を確認する
5. Agent-WT の成果を `develop` にマージするか判断する
6. 必要な状態ファイルと進捗管理ファイルを更新する

## Agent プロンプト必須要素

Issue に紐づく Agent subagent を起動する場合、以下をプロンプトに含める。

```text
## 完了処理（必須）

1. 完了条件を自己検証し、結果を報告に含めること
2. `gh issue comment {issue} -R {owner/repo} --body "..."` を実行すること
3. `.cache/outbox/DONE-{issue}-{YYYYMMDD}.md` を作成すること
```

対象タスクに対応する指示書テンプレートがある場合は、その参照も起動プロンプトに含める。

## マージプロトコル

1. Agent-WT 完了後、本体が diff を確認する
2. 品質基準を満たしていれば `develop` にマージする
3. 問題があれば本体が修正するか、Agent-WT を再起動する

## フリーズガード（Agent-WT）

| 対策 | 実装 | 目的 |
|------|------|------|
| **max_turns 制限** | `Agent(max_turns: N)` | N ターンで強制停止 |
| **出力監視** | `Read` or `tail` on output_file | 進捗を本体から確認 |
| **強制停止** | `TaskStop(task_id)` | フリーズ時に手動停止 |

### max_turns 目安

| タスク種別 | 推奨 max_turns |
|-----------|---------------|
| 形式修正・並べ替え | 10-15 |
| 比較 + 反映 | 20-25 |
| 複数ファイルのテンプレート適用 | 15-20 |

## 注意事項

- Agent-WT は push しない。本体がマージと push を行う
- Agent-BG は作業本体ではなく検証と報告に集中する
- 並行 push が発生する場合、2つ目以降は `git pull --rebase origin develop` を commit 後・push 前に入れる
- 3レーン以上の同時実行はレート制限リスクがあるため、2並行を推奨する
- Agent-WT 起動時は `max_turns` を必ず設定する
