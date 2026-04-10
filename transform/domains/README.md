# transform/domains/ — 領域別レポート生成ワークフロー

## 5W1H

- **What**: evidence から領域別の調査レポート（Markdown / PDF）を生成する workflow です。
- **Why**: 5段階モデルと各分野語彙の接続を、読者が追える形で再生成するためです。
- **Who**: domains レポートを更新する Claude Code CLI と review 担当者が使います。
- **When**: 新規生成、evidence 更新後の再生成、bilingual 展開時に使います。
- **Where**: 入力は `evidence/`、ルールは `reader-rules/`、品質基準は `quality-test/`、公開用整形先はリポジトリ直下の `knowledge/` です。
- **How**: report ルールを読んで public md を生成し、SVG を同期してから、その same md を使って PDF と bilingual へ進みます。

## 背景と現在地（2026-04-10）

調査が LLM 質問ベースから**原典精読ベースへ全面方針転換**したため、レポート再生成は**原典精査が完了してから**行う。現在の evidence は stub 状態であり、レポート再生成の入力データがまだ揃っていない。

- evidence-D*.md は全て stub（原典精読ベースの再構成待ち）
- 類似論文 153本のレポートへの組み込み方針は未定
- `#208` の確定方針により、旧公開物は取り込まず、空から再生成する
- **次のステップ**: 原典精読→evidence 再構成→レポート再生成（この順序が前提）
- 追跡 Issue: cs#217
- 既存公開物は `pjdhiro/assets/creation/domains/` にある

## ワークフロー

**End-to-End 手順書**: [WORKFLOW.md](WORKFLOW.md) — 生成→品質テスト→SVG同期→PDF公開→manifest更新の全手順

| やりたいこと | 参照先 |
|---|---|
| 1領域の新規生成 | WORKFLOW.md §A |
| 1領域の再生成（更新） | WORKFLOW.md §B |
| 全30領域の一括生成 | WORKFLOW.md §C |
| EN版の生成 | WORKFLOW.md §D |

## 入口

- 生成ルール: [reader-rules/reader-rules-creation-report.md](/Users/uminomae/dev/creation-space/transform/domains/reader-rules/reader-rules-creation-report.md)
- 共通基盤: [reader-rules/reader-rules-creation.md](/Users/uminomae/dev/creation-space/transform/domains/reader-rules/reader-rules-creation.md)
- 品質基準: [quality-test/quality-test-domain-report.md](/Users/uminomae/dev/creation-space/transform/domains/quality-test/quality-test-domain-report.md)

## 調査品質管理（cs#78）

- 3軸品質基準: [quality-criteria.md](quality-criteria.md) — 調査範囲/深さ/洞察の定量評価基準（D23ベンチマーク）
- 調査テンプレート: [survey-prompt-template.md](survey-prompt-template.md) — D23水準を再現する3Phaseプロンプト構造

## 領域間配置ルール（cs#105）

- 配置ルール: [cross-domain-reference.md](cross-domain-reference.md) — 一次配置と参照の判断基準
