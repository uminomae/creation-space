# MEMORY: Issue #76 Transform Layer (PDF/Publish) Subproject

Last updated: 2026-03-03 (JST)

## Purpose
Issue #62 の本線作業を妨げずに、変換層（publish Markdown -> PDF / modal publish）を独立サブプロジェクトとして進める。

## Scope Snapshot
- 作成対象（本線）
  - 一般向けPDF
  - 設計者向けPDF
  - 学術版PDF
  - 学術版のみ分冊（30領域）
  - 調査作業報告PDF（5W1H）
- 運用原則
  - `build/` 固定
  - `transform/creation/publish/*.md` を正本
  - EN対応は要件に含むが優先度は低い
  - introは現時点で実装しない

## Parallel Worktree Policy (Conflict Avoidance)
- `codexDT/*` ブランチ上でのみ変更。
- マージは Claude 側プロジェクト管理で実施（このワークツリーではマージしない）。
- 状態共有は以下の2点を必須化。
  - GitHub issue #76 コメント（外部可視の進捗）
  - この memory ファイル（セッション間の内部引き継ぎ正本）

## Handoff Contract (Session -> Session)
次セッション開始時に最低限更新する項目:
1. Current Checkpoint
2. Changed Files
3. Open Risks / Unknowns
4. Next 3 Actions

## Current Checkpoint
- ブランチ: `codexDT/issue76-transform-layer`
- issue: `https://github.com/uminomae/kesson-driven-thinking/issues/76`
- 並行管理:
  - `creation-space` 側は `codex/consciousness-clean-integration` でWIPチェックポイント済み
- 進行中:
  - creation-space のメイン `index.html` へ reportsインターフェース統合（Bootstrap優先）

## Execution Plan (Ordered)
1. issue #76 に「コンテキスト運用 + 実装計画」を追記
2. creation-space `index.html` に reports セクションを統合
3. reportsデータ（`assets/reports/issue62/domains/index.json`）を読み込み表示
4. JA/EN 切替時の見出し文言を最小対応
5. 反映内容を issue #76 と memory に再同期

## Changed Files (This Session)
- `codex/output/MEMORY-issue76-transform-layer.md` (new)

## Open Risks / Unknowns
- creation-space は別リポジトリのため、差分同期漏れリスクあり。
- index統合時、既存の `articles` セクションと UI干渉が起きる可能性あり（scroll/spacing）。

## Next 3 Actions
1. creation-space 側 UI 統合作業の整合性確認
2. issue #76 に進捗と判断根拠を追記
3. memory更新を継続
