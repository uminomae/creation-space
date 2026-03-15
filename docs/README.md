# docs/README.md — プロジェクト管理ハブ

**バージョン**: 3.0
**更新日**: 2026-03-15

## 位置づけ

このファイルは `creation-space` の管理書類ハブ。
`CLAUDE.md` などのエージェント向け入口から最初に参照し、必要な管理文書へ移動する。

## docs/ のスコープ

docs/ に置くもの:
- プロジェクト管理体系のドキュメント（ルール、仕様、正本）
- 調査から抽出されたナレッジ（設計判断の結論、taxonomy の正本）
- CLI/AI 向けのリファレンス

docs/ に置かないもの:
- 調査レポートの原本（→ `evidence/` または `evidence/investigations/`）
- 一時的な作業メモ（→ `.cache/`）
- コード固有の説明（→ 該当ディレクトリの README.md）

## 1. プロジェクト概要

`creation-space` は、30の学術領域から創造プロセスの構造類似を集め、「創造の5段階モデル」を検証する独立モジュール。
調査資産は `evidence/`、公開向けの再生成 workflow は `transform/`、公開用ナレッジベースの受け皿は `knowledge/`、Web UI は `src/` に置く。

## 2. 主要エントリーポイント

| パス | 役割 |
|---|---|
| `README.md` | リポジトリ全体の目次 |
| `CLAUDE.md` | Claude Code CLI 向けの最小運用ルール |
| `evidence/PROJECT.md` | プロジェクト憲章。目的・5段階モデル・調査状況の正本 |
| `docs/evidence-metadata-creation.md` | creation 固有 metadata 正本。公開ラベル taxonomy と `generator_model` |
| `transform/README.md` | 変換 workflow 全体の入口 |
| `transform/domains/README.md` | 領域別レポート再生成の入口 |
| `knowledge/README.md` | 公開用 KB の役割と移行状態 |

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
| `evidence/investigations/` | 調査レポートの原本（cs23 カテゴリ設計、cs43 モーダル deep link 等） |
| `docs/evidence-metadata-creation.md` | 公開ラベル taxonomy / `generator_model` の正本 |
| `transform/domains/reader-rules/reader-rules-creation-report.md` | 領域レポート生成ルール |
| `knowledge/schema/five-stages.md` | 5段階モデル schema の現在参照先 |
| `knowledge/schema/academic-domains.md` | D01-D30 学問領域マスターの現在参照先 |

## 4. 管理書類一覧

| パス | 用途 |
|---|---|
| `CLAUDE.md` | セッション開始・終了、Git 規約、関連 repo の要約 |
| `.claude/rules/commit-rules.md` | コミットメッセージと push 前チェック |
| `.claude/rules/project-structure.md` | `src/` 構成、CSS 配置、データフロー概要 |
| `.claude/rules/docs-navigator.md` | タスク種別に応じた参照ガイド |
| `evidence/investigations/investigation-cs23-categorize.md` | REPORTS の進捗カテゴリ設計調査 |
| `evidence/investigations/investigation-cs43-modal-deeplink.md` | モーダル deep link 設計調査 |
| `docs/evidence-metadata-creation.md` | creation 固有 metadata 正本 |
| `docs/quality-management.md` | 品質チェック・テキスト基準・レビュー基準 |
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
- `knowledge/` は公開用整形の受け皿、`pjdhiro/assets/creation/` は現在の外部ホスティング先

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

## 6. 人間-AI協働の設計原則

このリポジトリは人間（pjdhiro）とAIが共同でプロダクトを構築するプロジェクトである。
以下の原則は、この協働が機能するために設計レベルで組み込まれている構造を記述する。

> 移植元: `kesson-driven-thinking` の設計原則 L1-L7 を creation-space の文脈に適応したもの。

**L1: 認知的継続性**
新セッションのAIが、前セッションの決定と文脈を遺失しないこと。
セッションは断絶する。だからこそ `CLAUDE.md` のセッション手順、Issue コメント、
commit メッセージで前セッションの判断根拠と中断点を次セッションに渡す。

**L2: 判断権限の明示**
人間とAIの能力境界を設計レベルで宣言すること。
`CLAUDE.md` の委任レベル（自律実行・確認後実行・pjdhiro専権）が実装。
AIが代替できない判断（デザイン方針、公開判定等）は、新セッションのAIも代替しない。

**L3: 文脈圧縮**
AIのコンテキスト有限性に構造的に対抗すること。
`docs/README.md` をハブとした段階的ロード、タスク別参照ガイド（`.claude/rules/docs-navigator.md`）で
必要な情報だけを必要な時に読む。全走査は前提としない。

**L4: 品質の構造保証**
品質基準をルールファイルに埋め込み、作業者（人間・AI）の記憶に依存しないこと。
`dev-components.html`（コンポーネント一覧）、`docs/design-system.md`（デザインシステム）、
`transform/domains/reader-rules/`（生成ルール）、`transform/domains/quality-test/`（レビュー基準）が実装。
CSS 変更時に `dev-components.html` を確認する手順も構造保証の一部である。

**L5: 忖度耐性**
AIが指示に合わせて結論を歪めることに構造的に対抗すること。
中立的な指示表現、多視点検討を設計に組み込む。
調査結果を都合よく解釈しない。読者適応と調査分析は別プロセス。

**L6: 組織的不確実性（設計仮説・保持論点）**
このリポジトリは情報システムだが、プログラミング言語のように一意に値が定まる関数群ではない。
コンテキスト（変数）が不確実であり、AIの生成（リターン）も不確実である。
両方が不確実であるがゆえに、人間の組織に近い。
したがって状態管理・引き継ぎ・品質保証の設計には、情報システム理論だけでなく、
組織行動論の知見が必要である。

**L7: 冗長性による耐性（Redundancy for Resilience）**
LLMの振る舞いは不確実であり、効率化の最適化がルールの適用を阻害する。
ルールを一箇所に正規化するのではなく、踏まれる全ての入口に重複して配置する。
`CLAUDE.md` の CSS 変更時ルール、各ディレクトリ README の参照誘導が実装例。

**実装の所在**:

| 原則 | 実装箇所 |
|------|---------|
| L1 認知的継続性 | `CLAUDE.md` セッション手順、commit メッセージ規約 |
| L2 判断権限の明示 | `CLAUDE.md` 委任レベル |
| L3 文脈圧縮 | `docs/README.md`（ハブ）、`.claude/rules/docs-navigator.md` |
| L4 品質の構造保証 | `dev-components.html`、`docs/design-system.md`、`transform/domains/reader-rules/`、`transform/domains/quality-test/` |
| L5 忖度耐性 | 中立的指示、多視点検討 |
| L6 組織的不確実性 | 保持論点として設計判断時に参照 |
| L7 冗長性による耐性 | `CLAUDE.md` CSS ルール、ディレクトリ README の参照誘導 |

---

## 7. タスク別の参照先

| タスク | 先に読むもの |
|---|---|
| UI / Reports 変更 | `src/reports.js`, `evidence/investigations/investigation-cs23-categorize.md`, `evidence/investigations/investigation-cs43-modal-deeplink.md` |
| 調査方針の確認 | `evidence/PROJECT.md` |
| 領域レポート再生成 | `transform/domains/README.md` |
| 管理体系の更新 | `CLAUDE.md`, `.claude/rules/commit-rules.md`, `.claude/rules/project-structure.md` |

## 8. 教訓管理

教訓の記録・追跡・infusion（ルール反映）を管理する。

| パス | 用途 |
|---|---|
| `docs/lessons/INDEX.md` | 教訓インデックス（CL-NNN 採番） |
| `docs/lessons/TEMPLATE.md` | 新規教訓の記録テンプレート |

ワークフロー:
1. 作業中に教訓候補を検知したら `TEMPLATE.md` をコピーして記録する
2. `INDEX.md` に1行追加する
3. 対策をルール・ワークフローに反映（infusion）したら状態を `infused` に更新する

## 更新履歴

| 日付 | バージョン | 内容 |
|---|---|---|
| 2026-03-10 | 1.0 | 初版。管理ハブとして新設 |
| 2026-03-11 | 1.1 | `transform/` と `knowledge/` の入口を追加 |
| 2026-03-14 | 2.0 | `CLAUDE.md` と `.claude/rules/` に合わせて管理ハブを再編 |
| 2026-03-14 | 2.1 | `docs/evidence-metadata-creation.md` を追加し、公開 metadata の正本参照先を更新 (#248) |
| 2026-03-15 | 2.2 | docs/ スコープルール追加。investigation を `evidence/investigations/` へ移動、`survey-progress-taxonomy.md` 削除 |
| 2026-03-15 | 3.0 | 設計原則 L1-L7 セクション追加、docs-navigator.md を管理書類一覧に追加 (cs#72) |
