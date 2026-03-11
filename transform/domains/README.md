# transform/domains/ — 領域別レポート生成ワークフロー

## 5W1H

- **What**: evidence から領域別の調査レポート（Markdown / PDF）を生成する workflow です。
- **Why**: 5段階モデルと各分野語彙の接続を、読者が追える形で再生成するためです。
- **Who**: domains レポートを更新する Claude Code CLI と review 担当者が使います。
- **When**: 新規生成、evidence 更新後の再生成、bilingual 展開時に使います。
- **Where**: 入力は `evidence/`、ルールは `reader-rules/`、品質基準は `quality-test/`、公開用整形先はリポジトリ直下の `kb/` です。
- **How**: report ルールを読んで md を生成し、quality-test を通してから PDF と bilingual へ進みます。

## 現在の状態

- 30領域の evidence は揃っています。
- 既存公開物は `pjdhiro/assets/creation/domains/` にあります。
- `#208` の確定方針により、旧公開物は取り込まず、必要なものを空から再生成します。

## 状態ベースナビゲーション

### 新しい領域のレポートを生成したい

1. [reader-rules/reader-rules-creation-report.md](/Users/uminomae/dev/creation-space/transform/domains/reader-rules/reader-rules-creation-report.md) を読む
2. 対象の `evidence-D{NN}-*.md` を入力にする
3. Markdown を生成する
4. [quality-test/quality-test-domain-report.md](/Users/uminomae/dev/creation-space/transform/domains/quality-test/quality-test-domain-report.md) で自己採点する
5. PDF を生成する

### 既存レポートを更新したい

1. 対象 evidence の変更点を確認する
2. reader-rules に従って再生成する
3. quality-test を再実行して差分を確認する

### bilingual 展開したい

1. 先に JA 版を確定する
2. `kesson-driven-thinking/transform/translation-rules.md` を参照して EN を生成する
3. bilingual の公開先と manifest 更新は Phase C 以降で扱う

## 入口

- 生成ルール: [reader-rules/reader-rules-creation-report.md](/Users/uminomae/dev/creation-space/transform/domains/reader-rules/reader-rules-creation-report.md)
- 共通基盤: [reader-rules/reader-rules-creation.md](/Users/uminomae/dev/creation-space/transform/domains/reader-rules/reader-rules-creation.md)
- 品質基準: [quality-test/quality-test-domain-report.md](/Users/uminomae/dev/creation-space/transform/domains/quality-test/quality-test-domain-report.md)
