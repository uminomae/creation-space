# creation-space — Claude Code CLI

## 1. 役割定義

creation-space プロジェクトの Claude Code CLI エージェントとして動作する。
DT（Claude.ai Desktop）から指示書を受けて実装する。

## 2. ブランチ・ワークツリー規定

| ワークツリー | パス | ブランチ | 用途 |
|---|---|---|---|
| **main** | `/Users/uminomae/dev/creation-space` | main | 本番（直接コミット非推奨） |
| **develop（常設）** | `/Users/uminomae/dev/creation-space-develop` | develop | 目視確認ゲート・ステージング（常時起動可） |
| 作業用 | 都度作成 | `fix/*` / `feature/*` | 作業ブランチ |

- ローカルサーバー: `bash server.sh 3002` → http://localhost:3002/
  （kesson-space が 3001 を使用するため 3002 を使用）
- develop ワークツリーは削除しない（常設）

## 3. セッション終了チェックリスト

セッション終了前に必ず実行:

- [ ] 作業中の Issue にコメントで進捗を記録
- [ ] コミット・`git push origin <作業ブランチ>`
- [ ] **develop ワークツリーにマージしてサーバーを起動する（必須）**:
  ```bash
  cd /Users/uminomae/dev/creation-space-develop   # develop ワークツリー
  git fetch origin
  git merge --no-ff <作業ブランチ> -m "Merge <作業ブランチ> into develop (preview)"
  bash /Users/uminomae/dev/creation-space/server.sh 3002 &
  # → http://localhost:3002/
  ```
  コンフリクトが発生した場合は自動解決せず DT App に報告する。
- [ ] ユーザーに完了報告（サーバーURL を含める）

**注意: main への直接 push は行わない。PR経由でマージする。**

## 4. 技術スタック・参照

- Three.js 0.160.0（ES Modules）
- ローカルサーバー: `bash server.sh [port]`（CLI運用では 3002）
- デプロイ: GitHub Pages

### 参照リンク

- [GitHub Issues](https://github.com/uminomae/creation-space/issues)
