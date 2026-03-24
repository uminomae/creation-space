# 並行作業・ワークツリー運用ルール

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

## マージプロトコル

1. Agent-WT 完了後、本体が diff を確認する
2. 品質基準を満たしていれば `develop` にマージする
3. 問題があれば修正するか、Agent-WT を再起動する

## 注意事項

- Agent-WT は push しない。本体がマージと push を行う
- Agent-BG は検証と報告に集中する
- 2並行を推奨（3レーン以上はレート制限リスク）
- Agent-WT 起動時は `max_turns` を設定する
