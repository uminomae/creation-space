# transform/ — creation-space の変換層

## 5W1H

- **What**: evidence を公開用の Markdown / PDF / bilingual 出力へ変換するワークフロー群です。
- **Why**: 30領域の調査資産を、読者が辿れる形で再生成し、`kb/` を当面の正本として育てるためです。
- **Who**: Claude Code CLI と、creation-space の公開物を更新する人が使います。
- **When**: 新しい領域レポートを生成するとき、既存レポートを再生成するとき、survey / guides の移植を進めるときです。
- **Where**: 変換ルールは `transform/`、入力データは `evidence/`、公開用整形の受け皿はリポジトリ直下の `kb/` にあります。
- **How**: workflow README から入口を選び、reader-rules → quality-test → PDF / bilingual の順で進みます。

## ワークフロー一覧

| workflow | 役割 | 状態 |
|---|---|---|
| `domains/` | evidence から領域別調査レポート（md + PDF）を再生成する | **Phase A 実装済み** |
| `survey/` | 30領域全体の概要・索引を整える | **Phase 2 以降で移植予定** |
| `guides/` | 5段階モデルの guide 類を strict separation で再構成する | **Phase 2 以降で移植予定** |
| `transform/kb/` | 公開用整形ルールとメモの置き場 | **Phase C 以降** |

## あなたが今ここに来たということは

- 新しい領域レポートを作りたいなら [domains/README.md](/Users/uminomae/dev/creation-space/transform/domains/README.md) を読みます。
- 調査全体の概要や索引を移したいなら [survey/README.md](/Users/uminomae/dev/creation-space/transform/survey/README.md) を確認します。
- guide 類の strict separation 移植を進めたいなら [guides/README.md](/Users/uminomae/dev/creation-space/transform/guides/README.md) から現行正本を辿ります。
- 公開用整形の置き場を確認したいなら [kb/README.md](/Users/uminomae/dev/creation-space/kb/README.md) を読みます。

## 参照先

- 戦略方針の正本: [evidence/PROJECT.md](/Users/uminomae/dev/creation-space/evidence/PROJECT.md) §0
- 現在の公開配置: `pjdhiro/assets/creation/`
- 移植元（履歴情報）: `kesson-driven-thinking/transform/creation/`。現在は本ディレクトリが正本
