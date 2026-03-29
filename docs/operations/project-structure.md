# プロジェクト構造ガイド

## ルート構成

| パス | 役割 |
|---|---|
| `src/` | Web UI 本体 |
| `assets/` | ローカル静的アセット |
| `docs/` | 管理書類と調査メモ |
| `evidence/` | 調査データ本体 |
| `transform/` | 再生成 workflow |
| `knowledge/` | 公開用ナレッジベース |
| `scripts/` | 補助スクリプト |

## `src/` の見方

| パス | 内容 |
|---|---|
| `src/main.js` | フロントエンド起動点。静的ページシェルを初期化し、runtime context と orchestrator を呼ぶ |
| `src/main-*.js` | UI / scene / postfx / content の runtime 分割 |
| `src/scene*.js`, `src/shaders/` | Three.js の scene と shader |
| `src/reports/` | 領域別レポート UI、進捗 taxonomy、Markdown モーダル、外部 manifest 読み込み |
| `src/articles*.js` | ARTICLES データ取得と表示 |
| `src/nav/`, `src/config/` | 補助モジュール |
| `src/styles/` | ローカル CSS |

## CSS の置き場所

- Bootstrap は `index.html` から CDN 読み込み
- プロジェクト固有 CSS は `src/styles/` に置く
- 現在の主ファイル:
  - `src/styles/shell.css`
  - `src/styles/creation.css`
  - `src/styles/reports.css`
  - `src/styles/dev-panel.css`

## データフロー概要

1. `index.html` が CDN 依存関係と `src/main.js` を読み込む
2. `src/main.js` が静的に定義済みのページシェルを初期化し、runtime を起動する
3. `src/reports/` 配下の runtime が `pjdhiro/assets/creation/` 上の manifest / Markdown / PDF を取得して Reports UI を描画する
4. ローカル fallback / 検証用データは `assets/articles/articles.json` と `assets/reports/scenarios/` に置く
5. 調査データは `evidence/` に蓄積し、公開向けの再生成は `transform/`、受け皿は `knowledge/` が担う
