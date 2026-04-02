# .cache 作業ディレクトリ案内

`.cache/` は AI と人間の協働作業で使う一時作業領域であり、公開用ドキュメントの正本ではない。セッション継続に必要なログや依頼書を置くが、最終成果物そのものは `docs/` `evidence/` `knowledge/` などに残す。

## 主な中身

- `active/`: 進行中タスクのメモや一時ステータス
- `inbox/`: 他エンジンや他レーンへの依頼書、未処理の指示
- `outbox/`: 完了報告、レビュー結果、DONE メモ
- `session/`: セッションログ、handoff、state
- `backlog.md`: 作業候補のメモ

## 使い方の基本

1. セッション開始時に `active/` と `inbox/` を確認する
2. 一時メモは `.cache/` に置き、正本化する内容だけを他ディレクトリへ移す
3. 完了した依頼やログは `archive/` へ寄せるか、運用ルールに従って整理する

## 初期化

clone 直後に不足している場合は、少なくとも次を作ればよい。

```bash
mkdir -p .cache/active .cache/inbox .cache/outbox .cache/session
touch .cache/active/.gitkeep
```

既存の `README` やルールは `.claude/rules/session-management.md` を参照すること。
