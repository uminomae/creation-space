# transform/survey/ — survey 生成ワークフロー

## 5W1H

- **What**: 30領域全体の概要・索引を生成する workflow の置き場です。
- **Why**: 個別レポートだけでなく、全体像と導線を creation-space 側で完結させるためです。
- **Who**: survey 系の概要・索引を生成する CLI と review 担当者が使います。
- **When**: REPORTS 向けの survey-status / survey-domain-index を生成・更新するときです。
- **Where**: ルールは `reader-rules/`、生成物の受け皿は `build/creation/survey/` と `pjdhiro/assets/creation/survey/` です。
- **How**: survey reader-rules を読み、JA を先に生成してから EN と PDF へ進みます。

## 現在の状態

`transform/creation/` から survey 用 reader-rules を移管済みです（#250）。

- ルール正本: `reader-rules/reader-rules-creation-survey.md`
- 共通基盤: `transform/domains/reader-rules/reader-rules-creation.md`
- publish / domains への導線は `transform/domains/README.md` を参照

## 入口

- survey ルール: [reader-rules/reader-rules-creation-survey.md](/Users/uminomae/dev/creation-space/transform/survey/reader-rules/reader-rules-creation-survey.md)
- 共通基盤: [../domains/reader-rules/reader-rules-creation.md](/Users/uminomae/dev/creation-space/transform/domains/reader-rules/reader-rules-creation.md)
- domains workflow: [../domains/README.md](/Users/uminomae/dev/creation-space/transform/domains/README.md)
