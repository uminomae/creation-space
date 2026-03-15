# CLI 進捗の state.md / backlog.md 自動反映ルール

**このルールは CLI / Desktop App が必ず守ること。他エージェントからの可視性を担保する生命線。**

## トリガーと更新義務

### 1. セッション開始時
- state.md の「CLI 作業中」に自分を登録する
- HEAD SHA を最新に更新する

### 2. Issue 起票時（同一ターン必須）
- **Issue 起票と backlog.md 更新は同一ターン（同一レスポンス）で実行する。分離禁止。**
- backlog.md の該当セクションに新規行を追加する
- 依存関係がある場合は依存関係の全体図も更新する

### 3. commit & push 後
- state.md の HEAD SHA を更新する

### 4. タスク完了時
- state.md の「CLI 作業中」から削除する
- backlog.md の該当行に `完了 (SHA)` フラグを立てる
- Issue にコメントを残す

### 5. 外部エージェント並行実行の開始時（投入側の責務）
- **投入側（CLI / DT App）が** state.md の「外部エージェント待ち」に登録する（Issue番号、内容、エンジン名）
- 外部エージェント自身は state.md を操作しない

### 6. 外部エージェント完了時（責務分離）
- **外部エージェントが行うこと**: Issue にコメント + `.cache/outbox/DONE-{issue}-{YYYYMMDD}.md` を作成
- **投入側が行うこと**: state.md の「外部エージェント待ち」から削除、backlog.md のステータス更新、session log 作成、inbox archive

**設計理由**: 外部エージェントが state.md の lock プロトコルを実行するとフリーズしやすい。state.md / backlog.md 管理を投入側に集約し、外部エージェントは作業本体 + commit + DONE ファイルに集中させる。

### 7. セッション終了時
- state.md を最終状態に更新する（R-B-W + Lock プロトコル）
- backlog.md を最終状態に更新する
- セッションログを作成する

## 更新手順

state.md / backlog.md を書き換える際は必ず:

1. `.cache/session/state.lock` を確認（存在して5分以内なら待つ、5分超なら stale として削除）
2. lock を作成
3. **ファイルを読み直してから**書き換える（Read-Before-Write）
4. lock を削除

## backlog.md 更新のフォーマット

新規 Issue を追加する場合:
```
| #NNN | タイトル | CLI作業中 / 外部実行中 / 完了(SHA) | 依存 |
```

## 怠った場合のリスク

- 他エージェントから CLI の進捗が見えなくなる
- オーナーが状況を把握できず、判断が遅れる
- エージェント間の協調が機能しない
