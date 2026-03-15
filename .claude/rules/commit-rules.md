# コミットルール

## ブランチ戦略

| ブランチ | 役割 |
|---------|------|
| **develop** | 通常作業と統合先 |
| **main** | GitHub Pages 公開用。直接 push しない |
| **wt/{slug}** | Agent-WT 用一時ブランチ。develop から分岐し、マージ後に削除 |

## コミットメッセージ形式

```text
{type}: {summary}

{body（任意）}

Co-Authored-By: Claude <noreply@anthropic.com>
```

- `type` は `feat` / `fix` / `docs` / `refactor` / `chore` などを使う
- `summary` は 1 行で内容が分かるように書く

## push 前チェック

1. `git status --short --branch`
2. `git diff --stat`
3. `develop` で作業している場合は `git pull --rebase origin develop`
4. 自律 push 範囲（CLAUDE.md 参照）は確認不要で push 可。それ以外はオーナーに確認
5. 関連 Issue に変更サマリを投稿
6. `git push origin develop`
7. state.md に最新コミット SHA を記録

## コミット時 DIC（成果品整合性チェック）

- `git add` するファイルが実際に存在することを確認
- 完了済みタスクの処理済み inbox ファイルがあれば `git rm` に含める
