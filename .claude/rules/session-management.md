# セッション管理ルール

## セッションログ

パス: `.cache/session/log-{YYYYMMDD}-{seq}.md`

セッション終了時に作成。含める内容:
- 基本情報（Issue番号、ブランチ、開始/終了コミットSHA）
- 作業内容と成果（判断理由を含む）
- 変更ファイル一覧
- 未解決事項
- 次セッションへの指示

## handoff ファイル運用

パス: `.cache/session/handoff-{FROM}-{YYYYMMDD}-{slug}.md`

| 方向 | 命名例 | 書く側 | 読む側 |
|------|--------|--------|--------|
| DT → CLI | handoff-DT-20260312-policy-change.md | DT App | CLI |
| CLI → DT | handoff-CLI-20260312-conflict-report.md | CLI | DT App |

- CLI: セッション開始時に `ls .cache/session/handoff-DT-*.md` で確認
- 読了後、ファイル末尾に `## 読了: {reader} {date}` を追記
- 読了済みは `.cache/session/archive/` に移動してよい

## inbox 運用

パス: `.cache/inbox/`

| ファイル名規則 | 用途 |
|--------------|------|
| `REQ-{engine}-{date}-{seq}_*.md` | 外部エンジンへのレビュー/調査依頼 |
| `REVIEW-{engine}-*.md` | 外部エンジンレビュー出力 |
| `NEEDS-ISSUE-*` | 先にIssue登録を処理 |

## 成果品整合性チェック（DIC）

セッション開始時に黙示的に実行（問題なければ報告不要）:
1. `.cache/active/` の実行中タスクを確認
2. `.cache/inbox/` に未処理ファイルがないか確認
3. 不整合があればオーナーに報告

コミット時: 完了済みタスクの処理済み inbox ファイルは `git rm` 対象。
