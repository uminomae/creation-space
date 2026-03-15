# creation-space — Claude Code CLI

`creation-space` で作業する Claude Code CLI 向けの最小運用ルール。管理書類の入口は `docs/README.md`、補助ルールは `.claude/rules/` を参照する。

## プロジェクト概要

- `creation-space` は「創造とは何か」を探索する独立モジュール。
- 30領域の調査資産を `evidence/` に蓄積し、`transform/` で公開用に整形し、`kb/` と Web UI に接続する。
- フロントエンドは `index.html` + `src/` の静的構成で、Three.js を中心に動く。
- `src/reports.js` は `pjdhiro` 側でホスティングされる manifest / Markdown / PDF を取得して表示する。

## Git 規約

- 通常作業ブランチは `develop`
- `main` は GitHub Pages 公開用ブランチ
- `main` への直接 push は行わない
- コミットメッセージ形式は `{type}: {summary}`
- コミット本文は任意だが、必要なら変更理由を短く追記する
- すべてのコミットに `Co-Authored-By: Claude <noreply@anthropic.com>` を含める
- push 前に `git status --short --branch` と `git diff --stat` を確認する
- `develop` を push する前に `git pull --rebase origin develop` を実行する

詳細: `.claude/rules/commit-rules.md`

## セッション開始手順

1. `git branch --show-current`
2. `git status --short --branch`
3. `docs/README.md` と、対象タスクに必要な関連ファイルを読む
4. UI 確認が必要なら `bash server.sh 3002` でローカル確認を開始する

## セッション終了時

1. `git diff --stat` で変更範囲を確認する
2. 関連 Issue に変更サマリを投稿する
3. コミットメッセージ形式と `Co-Authored-By` を確認してコミットする
4. `develop` 作業なら `git pull --rebase origin develop` の後に `git push origin develop`
5. 管理体系を更新した場合は `CLAUDE.md`、`docs/README.md`、`.claude/rules/` の整合を取る

## CSS変更時のルール

CSS（`src/styles/` 配下）を変更する前に:
1. `docs/design-system.md` を読む
2. `dev-components.html` のソースを読み、変更対象の影響範囲を確認する
3. CSS変更後、`dev-components.html` の該当コンポーネントも更新する

## ディレクトリ構造

| パス | 役割 |
|---|---|
| `src/` | Web UI 本体。Three.js 描画、Reports UI、スタイル、各種 runtime |
| `assets/` | ローカル静的データ。articles 一覧、reports シナリオなど |
| `docs/` | 管理書類のハブ（ルール・仕様・正本のみ。調査原本は evidence/ に置く） |
| `evidence/` | 30領域の調査データ本体、deepdive、review |
| `transform/` | evidence から公開用 Markdown / PDF / KB を再生成する workflow |
| `kb/` | 公開用ナレッジベースの受け皿 |
| `scripts/` | 補助スクリプト |

詳細: `.claude/rules/project-structure.md`

## 技術スタック

- 静的サイト: `index.html` + ES Modules
- 描画: Three.js `0.160.0`
- UI コンポーネント: Bootstrap `5.3.3`
- Markdown 表示: `marked` + `DOMPurify`
- ローカルサーバー: `bash server.sh [port]` (`serve.py` を呼ぶ)
- デプロイ先: GitHub Pages

## 関連リポジトリ

| リポジトリ | 関係 |
|---|---|
| `pjdhiro` | GitHub Pages 側の公開先。`assets/creation/` の manifest・Markdown・PDF をホスティングする |
| `kesson-driven-thinking` | 管理体系と workflow の参照元。`transform/`・`kb/` の一部はここから移植された履歴を持つ |
