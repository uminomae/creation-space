# transform/guides/ — guide 生成ワークフロー

## 5W1H

- **What**: 5段階モデルの guide 類を生成する workflow の置き場です。
- **Why**: domains と切り分けた strict separation の guide 群を creation-space 側で正本化するためです。
- **Who**: guide 系の Markdown / PDF を再生成する CLI と review 担当者が使います。
- **When**: general / designer / academic guide を生成・更新するときです。
- **Where**: ルールは `reader-rules/` にあります。導入文は reader-rules 本文へ統合済みです。
- **How**: audience 別の reader-rules を読み、PDF ビルドへ進みます。

## 現在の状態

`transform/creation/` から audience 別 guide 資産を移管済みです（#250）。

- general: `reader-rules/reader-rules-creation-general.md`
- designer: `reader-rules/reader-rules-creation-designer.md`
- academic: `reader-rules/reader-rules-creation-academic.md`
- intro: reader-rules v4.0 で各 `reader-rules-creation-*.md` に統合済み

## 入口

- ルール: [reader-rules/reader-rules-creation-general.md](/Users/uminomae/dev/creation-space/transform/guides/reader-rules/reader-rules-creation-general.md)
- ルール: [reader-rules/reader-rules-creation-designer.md](/Users/uminomae/dev/creation-space/transform/guides/reader-rules/reader-rules-creation-designer.md)
- ルール: [reader-rules/reader-rules-creation-academic.md](/Users/uminomae/dev/creation-space/transform/guides/reader-rules/reader-rules-creation-academic.md)
- 導入文: general / designer / academic とも reader-rules 本文を参照
