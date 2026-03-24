# creation-space — Claude Code CLI

`creation-space` で作業する Claude Code CLI 向けの最小運用ルール。管理書類の入口は `docs/README.md`、補助ルールは `.claude/rules/` を参照する。

## プロジェクト概要

- `creation-space` は「創造とは」を探索する独立モジュール。
- 30領域の調査資産を `evidence/` に蓄積し、`transform/` で公開用に整形し、`knowledge/` と Web UI に接続する。
- フロントエンドは `index.html` + `src/` の静的構成で、Three.js を中心に動く。
- `src/reports.js` は `pjdhiro` 側でホスティングされる manifest / Markdown / PDF を取得して表示する。

## Git 規約

通常作業は `develop`。`main` は GitHub Pages 公開用（直接 push しない）。
詳細: `.claude/rules/commit-rules.md`

## セッション開始手順

1. `git branch --show-current` / `git status --short --branch`
2. `docs/README.md` と、対象タスクに必要な関連ファイルを読む
3. 必要なら `bash server.sh 3002`

## コーディング禁止事項

- **JS/TS ファイルでシェルエスケープを使ってはならない**。具体的に禁止するパターン:
  - `\\!` → `\!` と書く（`\!==`, `\!value` 等）
  - `` \` `` → `` ` `` と書く（テンプレートリテラル）
  - `\${` → `${` と書く（テンプレートリテラル内の式展開）
- これらは全て SyntaxError になる。LLM がシェル向けエスケープを JS に混入する既知の問題であり、繰り返し発生しているため厳守すること。

## CSS変更時のルール

CSS（`src/styles/` 配下）を変更する前に:
1. `docs/design-system.md` を読む
2. `dev-components.html` のソースを読み、変更対象の影響範囲を確認する
3. CSS変更後、`dev-components.html` の該当コンポーネントも更新する

### Bootstrap 優先原則

- レイアウト（flex, grid, spacing）は Bootstrap ユーティリティクラスを最優先で使う
- ボタンは Bootstrap `.btn` をベースとし、テーマ上書きはCSS変数で行う
- レスポンシブ表示切替は Bootstrap の `d-{breakpoint}-*` クラスを使う
- カスタム CSS は Bootstrap で実現不可能なもの（独自アニメーション、glassmorphism、Three.js連携、デザイントークン）に限定する
- 新しいCSSプロパティを手書きする前に、同等の Bootstrap クラスが存在しないか確認する

## progress_level / progress_note の保護ルール

**禁止事項**: `transform/domains/publish/domains/index.json` の `progress_level` および `progress_note` フィールドは、pjdhiro の明示的な指示がない限り変更してはならない。
**正本**: `docs/evidence-metadata-creation.md` / **SoT**: `transform/domains/publish/domains/index.json`

詳細: `.claude/rules/evidence-progress.md`

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

## 公開 MD の正本ルール

- 公開用 MD の正本は `pjdhiro/assets/creation/` のみ
- `transform/` には変換ルール・テンプレート・スクリプトのみ配置
- `transform/*/publish/` に MD の実体を置かない
- UI は pjdhiro の raw URL または GitHub Pages URL を参照する
