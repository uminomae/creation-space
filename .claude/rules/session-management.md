# セッション管理ルール

## state.md プロトコル

パス: `.cache/session/state.md`

- **ローカル書き込み完了ごとに更新**（フリーズ対策の最重要ルール）
- 構造: ブランチ・コミット / 進行中 / 次のステップ / オーナー TODO / 必須ロード

## セッションログ

パス: `.cache/session/log-{YYYYMMDD}-{seq}.md`

セッション終了時に必ず作成。以下を含める:
- 基本情報（Issue番号、ブランチ、開始/終了コミットSHA）
- 作業内容と成果（判断理由を含めて詳細に）
- 変更ファイル一覧
- 重要な判断・決定
- 未解決事項
- 管理ドキュメントの更新状況
- 次セッションへの指示

## handoff ファイル運用

パス: `.cache/session/handoff-{FROM}-{YYYYMMDD}-{slug}.md`

| 方向 | 命名例 | 書く側 | 読む側 |
|------|--------|--------|--------|
| DT → CLI | handoff-DT-20260312-policy-change.md | DT App | CLI |
| CLI → DT | handoff-CLI-20260312-conflict-report.md | CLI | DT App |

### 使うタイミング（backlog / Issue コメントでは足りないとき）

- 方針転換の背景や判断理由が長い
- 複数タスクに跨る注意事項
- タスクに紐づかない申し送り
- 緊急の警告

### 読む義務

- CLI: セッション開始時に `ls .cache/session/handoff-DT-*.md` で確認
- DT App: セッション起動時に `ls .cache/session/handoff-CLI-*.md` で確認
- 読了後、ファイル末尾に `## 読了: {reader} {date}` を追記

### 寿命

- 読了マークがついた handoff は次のセッション開始時に `.cache/session/archive/` に移動してよい

## 中間退避

パス: `.cache/session/{topic}.md`

設計決定の確定時、重い分析結果の生成時に使用。途中経過の試行錯誤は退避しない。

## inbox 運用

パス: `.cache/inbox/`

| ファイル名規則 | 用途 |
|--------------|------|
| `REQ-{engine}-{date}-{seq}_*.md` | 外部エンジンへのレビュー/調査依頼 |
| `REVIEW-{engine}-*.md` | 外部エンジンレビュー出力 |
| `NEEDS-ISSUE-*` | 先にIssue登録を処理 |

inboxは一時置き場。確定後は必要に応じてアーカイブまたは削除。

## 成果品整合性チェック（DIC）

セッション開始時に黙示的に実行（問題なければ報告不要）:
1. state.md の完了済みタスクをリスト化
2. `.cache/inbox/` を確認
3. 完了済みタスクの依頼ファイルが残存していないか照合
4. 不整合があればオーナーに報告

コミット時にも同様にチェック。完了済みタスクの処理済み inbox ファイルは `git rm` 対象。
