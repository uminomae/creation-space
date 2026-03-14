# コミットルール

## ブランチ

- `develop`: 通常作業と統合先
- `main`: GitHub Pages 公開用。直接 push しない

## コミットメッセージ

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
4. 関連 Issue に変更サマリを投稿
5. `git push origin develop`
