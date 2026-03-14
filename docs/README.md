# docs/README.md — プロジェクト管理ハブ

**バージョン**: 2.0
**更新日**: 2026-03-14

## 位置づけ

このファイルは `creation-space` の管理書類ハブ。
`CLAUDE.md` などのエージェント向け入口から最初に参照し、必要な管理文書へ移動する。

## 1. プロジェクト概要

`creation-space` は、30の学術領域から創造プロセスの構造類似を集め、「創造の5段階モデル」を検証する独立モジュール。
調査資産は `evidence/`、公開向けの再生成 workflow は `transform/`、公開用ナレッジベースの受け皿は `kb/`、Web UI は `src/` に置く。

## 2. 主要エントリーポイント

| パス | 役割 |
|---|---|
| `README.md` | リポジトリ全体の目次 |
| `CLAUDE.md` | Claude Code CLI 向けの最小運用ルール |
| `evidence/PROJECT.md` | プロジェクト憲章。目的・5段階モデル・調査状況の正本 |
| `transform/README.md` | 変換 workflow 全体の入口 |
| `transform/domains/README.md` | 領域別レポート再生成の入口 |
| `kb/README.md` | 公開用 KB の役割と移行状態 |

## 3. ファイルカタログ

| パス | 役割 |
|---|---|
| `index.html` | 単一ページ UI の HTML エントリーポイント |
| `server.sh` | ローカル確認用サーバー起動スクリプト |
| `serve.py` | `server.sh` から呼ばれる静的サーバー本体 |
| `src/main.js` | フロントエンド起動点 |
| `src/reports.js` | REPORTS UI、進捗 taxonomy、外部 Markdown / PDF 読み込み |
| `src/styles/` | プロジェクト固有 CSS |
| `assets/articles/articles.json` | ARTICLES のローカル fallback データ |
| `assets/reports/scenarios/split-d22.json` | reports taxonomy / UI の検証シナリオ |
| `evidence/PROJECT.md` | 調査方針・5段階モデル・進捗管理の正本 |
| `docs/survey-progress-taxonomy.md` | 進捗ラベルの設計記録 |
| `transform/domains/reader-rules/reader-rules-creation-report.md` | 領域レポート生成ルール |
| `kb/schema/five-stages.md` | 5段階モデル schema の現在参照先 |

## 4. 管理書類一覧

| パス | 用途 |
|---|---|
| `CLAUDE.md` | セッション開始・終了、Git 規約、関連 repo の要約 |
| `.claude/rules/commit-rules.md` | コミットメッセージと push 前チェック |
| `.claude/rules/project-structure.md` | `src/` 構成、CSS 配置、データフロー概要 |
| `docs/investigation-cs23-categorize.md` | REPORTS の進捗カテゴリ設計調査 |
| `docs/investigation-cs43-modal-deeplink.md` | モーダル deep link 設計調査 |
| `docs/survey-progress-taxonomy.md` | 調査進捗ラベルの正本メモ |
| `evidence/CLAUDE.md` | `evidence/` 配下での補助ルール |

## 5. 開発フロー

### ローカルサーバー起動

```bash
bash server.sh 3002
# http://localhost:3002/
```

- `server.sh` の既定ポートは `3001`
- `kesson-space` と並行起動する場合は `3002` を使う

### ビルド / 再生成

- Web UI は bundler を使わない静的 ES Modules 構成。通常の UI 変更では別途 build は不要
- 領域レポートや KB を再生成するときは `transform/domains/README.md` から workflow を辿る
- `kb/` は公開用整形の受け皿、`pjdhiro/assets/creation/` は現在の外部ホスティング先

### デプロイ

- 通常作業は `develop`
- `main` は GitHub Pages 公開用ブランチ
- `main` への直接 push はしない
- `develop` を更新する基本手順:

```bash
git status --short --branch
git diff --stat
git pull --rebase origin develop
git push origin develop
```

## 6. タスク別の参照先

| タスク | 先に読むもの |
|---|---|
| UI / Reports 変更 | `src/reports.js`, `docs/investigation-cs23-categorize.md`, `docs/investigation-cs43-modal-deeplink.md` |
| 調査方針の確認 | `evidence/PROJECT.md` |
| 領域レポート再生成 | `transform/domains/README.md` |
| 管理体系の更新 | `CLAUDE.md`, `.claude/rules/commit-rules.md`, `.claude/rules/project-structure.md` |

## 更新履歴

| 日付 | バージョン | 内容 |
|---|---|---|
| 2026-03-10 | 1.0 | 初版。管理ハブとして新設 |
| 2026-03-11 | 1.1 | `transform/` と `kb/` の入口を追加 |
| 2026-03-14 | 2.0 | `CLAUDE.md` と `.claude/rules/` に合わせて管理ハブを再編 |
