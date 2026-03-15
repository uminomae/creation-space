# state.md — セッション状態

**更新**: 2026-03-15 初期構築（cs#71）
**最新セッションログ**: なし

## 設計方針

**state.md = セッション復元用スナップショット（状態のみ）**
**backlog.md = タスクの唯一の正本（優先順位・依存関係・候補）**

state.md にはタスク候補・投入待ち一覧・次のアクションを記載しない。
セッション冒頭でタスクを把握するには backlog.md の上位セクションを読む。

## 同時更新義務

state.md を更新するとき、以下のファイルも同時に整合を取ること。

| トリガー | 同時更新対象 | 何をするか |
|---|---|---|
| Issue を close した | `.cache/backlog.md` | 該当行を削除 |
| Issue を新規作成した | `.cache/backlog.md` | 適切なカテゴリに追加 |
| CLI指示書を配置した | `.cache/backlog.md` CLI在庫セクション | 指示書を追加 |
| CLI完了報告を受けた | `.cache/backlog.md` | ステータス更新または削除 |
| HEAD SHA が変わった | 本ファイル Gitテーブル | SHAを更新 |
| inboxファイルが完了した | `.cache/backlog.md` CLI在庫セクション | 完了マークまたは削除 |

**原則**: state.md だけ更新して backlog.md を放置しない。両方が一致している状態が正。

## Git

| repo | branch | HEAD | dirty | remote |
|------|--------|------|-------|--------|
| creation-space | develop | a3fcc27 | clean | synced |

## CLI 作業中（0件）

なし

## 外部エージェント待ち（0件）

なし

## Hot Topics（Context Traps）

| # | 内容 | 関連 |
|---|---|---|
| 1 | **cs#67 運用基盤移植**: kesson-driven-thinking の運用体系を creation-space に段階移植中 | cs#67-72 |
