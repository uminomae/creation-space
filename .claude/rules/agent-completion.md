# Agent subagent 完了処理ルール

## Agent 起動時の必須プロンプト要素

### 1. 下流消費者リスト（破壊的変更対策）

データ構造やフィールド名を変更するタスクでは、変更対象の下流消費者を列挙する。
詳細は `.claude/rules/breaking-change-checklist.md` を参照。

### 2. 完了処理

```text
## 完了処理（必須）
1. 完了条件を自己検証し、結果を報告に含めること
2. `gh issue comment {issue} -R {owner/repo} --body "..."` で Issue にコメントを投稿すること
3. `.cache/outbox/DONE-{issue}-{YYYYMMDD}.md` を作成すること
```

## Agent 側の責務

- 作業本体を完了し、必要なら commit まで行う
- 完了条件を自己検証する
- Issue コメントを投稿する
- DONE ファイルを作成する

## Main（投入側）の完了後チェックリスト

1. 完了条件を Read / Grep / diff で検証する
2. Issue コメントが投稿済みか確認する
3. DONE ファイルの内容を確認する
4. 必要なら Issue の追加処理を行う
