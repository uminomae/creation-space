# creation-space — Claude Code CLI

## 0. エントリーポイント

プロジェクト全体像・管理書類・ファイル構成は `docs/README.md` を参照。
変換層の入口は `transform/README.md`、domains workflow の入口は `transform/domains/README.md`。
公開KBの受け皿は `kb/README.md`。

## 1. 役割定義

creation-space プロジェクトの Claude Code CLI エージェントとして動作する。
DT（Claude.ai Desktop）から指示書を受けて実装する。

## 2. ブランチ・ワークツリー規定

| 作業場所 | パス | ブランチ | 用途 |
|---|---|---|---|
| **root** | `/Users/uminomae/dev/creation-space` | develop または main | 通常作業場所 |
| 作業用 | 都度作成 | `fix/*` / `feature/*` | 分離作業ブランチ |

- ローカルサーバー: `bash server.sh 3002` → http://localhost:3002/
  （kesson-space が 3001 を使用するため 3002 を使用）
- 旧常設 develop worktree は #181 で削除済み

## 3. セッション終了チェックリスト

セッション終了前に必ず実行:

- [ ] 作業中の Issue にコメントで進捗を記録
- [ ] コミット・`git push origin <作業ブランチ>`
- [ ] 必要なら `develop` で preview を起動する:
  ```bash
  cd /Users/uminomae/dev/creation-space
  git checkout develop
  bash ./server.sh 3002 &
  # → http://localhost:3002/
  ```
- [ ] ユーザーに完了報告（サーバーURL を含める）

**注意: main への直接 push は行わない。PR経由でマージする。**

## 4. 技術スタック・参照

- Three.js 0.160.0（ES Modules）
- ローカルサーバー: `bash server.sh [port]`（CLI運用では 3002）
- デプロイ: GitHub Pages

### 参照リンク

- [GitHub Issues](https://github.com/uminomae/creation-space/issues)
