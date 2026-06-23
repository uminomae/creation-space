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

## Design system

CSS（`src/styles/` 配下）を変更する前に:
1. `DESIGN.md` (root) を読む — design system 全体像 (Stitch DESIGN.md format, Claude Design 互換)
2. `src/styles/tokens.css` を読む — source of truth (CSS custom properties)
3. `dev-components.html` のソースを読み、変更対象の影響範囲を確認する
4. CSS変更後、`dev-components.html` の該当コンポーネントも更新する

並走ファイル: `src/styles/tokens.json` — W3C Design Tokens 形式 (機械可読補助)

変更時の制約:
- `--ds-*` token は cs/as/ks 横断で同型 (値同一)、cs 固有は `--cs-*` namespace
- 色は `rgb()` ではなく `r, g, b` の 3 値で定義 (`rgba()` で透明度を柔軟に変えるため)
- z-index は数値直書き禁止、`--cs-z-*` semantic tokens を使う
- 生 `rgba(100, 150, 255, ...)` を書かない (token 化必須)

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

## cs/pd 役割分離原則（cs#228）

- **cs**: 30 領域の原典から独立して論を構築する調査。pd wiki に対する出力義務は負わない
- **pd / obsidian wiki**: cs の調査時に LLM が品質チェック用に**参照する素材**。cs の出力の投影先ではない
- cs は pd の状態を検査しない（validate-manifest-sync.sh の旧 Check 7 は削除済）
- pd 側は `wiki-cross-check.mjs` で cs source-note との矛盾検査を行う（pd#82）が、cs に義務は発生しない

## 原典と source-note の 1:1 原則（cs 内部の不変条件）

- cs `knowledge/raw/manifest.md` の `raw-confirmed` / `url-verified` 行には対応する cs source-note (`knowledge/source-notes/D{NN}/{source_id}_*.md`) が必須
- 各領域で cs source-note ≥5 本（FAIL 不変条件、`bash scripts/validate-manifest-sync.sh` Check 6）
- **🚫 原典重複禁止（FAIL 不変条件・Check 10, cs#249）**: **同一原典を同一領域に複数行登録してはならない**。判定は実務標準の書誌重複ルール（pjdhiro 指示）= work-identity `(領域,著者姓,書名)` でグルーピングし、**DOI が異なれば別 publication として自動除外**、DOI で切り分け不可な同名別物のみ `knowledge/raw/duplicate-exceptions.md` に理由・論拠つきで登録。manifest に行を追加する前に必ず `grep` で同一書名の既存行を確認すること。クロス領域 anchor は §7 の正規パターン（領域が異なる）。**重複と気づいたら注記して放置せず、その場で重複行を除外する**（D15-S10/D26-S09 は「重複」注記しながら放置されていた = 再発させてはならない QC 欠陥）
- source-note 改訂時は `D{NN}-summary.md` / evidence / cross-refs を同一コミット内で更新
- 検知: `.claude/hooks/source-note-gen-check.sh` (SessionStart) / `source-note-gen-notify.sh` (commit) / `validate-manifest-sync.sh` Check 10 (重複)

詳細: `.claude/rules/source-note-invariants.md`
