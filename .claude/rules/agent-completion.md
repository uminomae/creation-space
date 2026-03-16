# Agent subagent 完了処理ルール

## 背景

Agent subagent（background / worktree）は本体セッションと別コンテキストで動作する。
完了条件の自己申告だけでは、検証漏れや Issue 報告漏れが起きやすい。

このルールは Main セッション（投入側）と外部エージェントの責務を分ける。

## Agent 起動時の必須プロンプト要素

Issue に紐づく Agent subagent を起動するとき、プロンプトに以下を必ず含める。

### 1. 下流消費者リスト（破壊的変更対策・必須）

データ構造やフィールド名を変更するタスクでは、変更対象の下流消費者を列挙する。

```text
## 下流消費者（変更時に同時更新が必要）
- {ファイル1}: {フィールド名} を参照
- {ファイル2}: {フィールド名} を参照
変更後、上記の全ファイルで動作に影響がないか検証すること。
```

詳細は `.claude/rules/breaking-change-checklist.md` を参照。

### 2. 完了処理（必須）

```text
## 完了処理（必須）

1. 完了条件を自己検証し、結果を報告に含めること
2. `gh issue comment {issue} -R {owner/repo} --body "..."` で Issue にコメントを投稿すること
   - コメントには: commit SHA、変更概要、完了条件の検証結果を含める
3. `.cache/outbox/DONE-{issue}-{YYYYMMDD}.md` を作成すること
   - 内容には: commit SHA、変更ファイル、検証結果、未解決事項を含める
```

## Agent 側の責務

- 作業本体を完了する
- 必要なら commit まで行う
- 完了条件を自己検証する
- Issue コメントを投稿する
- DONE ファイルを作成する

**行わないこと**:
- `.cache/session/state.md` の更新
- `.cache/backlog.md` の更新
- Main に割り当てられた管理ファイルの編集

## Main（投入側）の完了後チェックリスト

Agent 完了報告を受けたら、Main は以下を同一ターンで実行する。

1. 完了条件を Read / Grep / diff で検証する
2. Issue コメントが投稿済みか確認する
3. DONE ファイルの内容を確認する
4. 必要なら `.cache/session/state.md` と `.cache/backlog.md` を更新する
5. 必要なら Issue の追加処理を行う

## 怠った場合のリスク

- 完了条件を満たしていない変更が見逃される
- Issue だけ更新され、リポジトリ内の進捗管理がずれる
- 次セッションで作業状態の復元に時間がかかる
