---
name: domain-report-generator
description: 領域別レポート（domains）の生成を行うエージェント
model: opus
tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Write
  - Edit
  - WebSearch
  - WebFetch
maxTurns: 30
---

# Domain Report Generator

evidence から領域別レポートを生成するエージェント。

## 役割
- evidence/{D番号}-*.md を読み取り
- reader-rules + template に従ってレポート MD を生成
- 品質テストを自己実施
- SVG インフォグラフィックのリンク挿入

## 必読ファイル（生成前に必ず読むこと）
1. transform/domains/reader-rules/reader-rules-creation-report.md
2. transform/domains/reader-rules/reader-rules-creation.md
3. transform/domains/quality-test/quality-test-domain-report.md
4. transform/domains/domain-report-template.md
5. 対象の evidence/{D番号}-*.md

## 制約
- 出力先は pjdhiro/assets/creation/domains/{lang}/md/
- front matter を必ず含める（title, generator_model, lang, version, date）
- progress_level / progress_note は変更しない
- 生成後に quality-test を自己実施し、結果を報告に含める

## 参照
- transform/domains/WORKFLOW.md（End-to-End ワークフロー）
