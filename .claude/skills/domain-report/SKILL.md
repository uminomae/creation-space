---
name: domain-report
description: >
  領域別レポートの生成ワークフロー。transform/domains/WORKFLOW.md のスキル化。
  domain-report-generator + report-quality-evaluator のペアを定量ゲートで制御する。
  triggers: "領域レポート生成", "domain-report", "レポート生成", "D{NN}のレポート"
---

# domain-report — 領域別レポート生成ワークフロー

`transform/domains/WORKFLOW.md` をスキル化したもの。
**詳細な生成ルールは `transform/domains/reader-rules/reader-rules-creation-report.md` を参照**（漸進的開示）。

## 前提確認

```bash
# 対象領域の evidence ファイルを確認
ls evidence/evidence-D{NN}-*.md
# source-note の数を確認（≥5 が前提）
find knowledge/source-notes/D{NN} -name "D{NN}-S*_*.md" | wc -l
```

## Step 1: Generator 起動

```
Agent(domain-report-generator):
  対象: D{NN} {領域名}
  evidence: evidence/evidence-D{NN}-*.md
  source-notes: knowledge/source-notes/D{NN}/
  出力先: transform/domains/output/D{NN}-report.md
  必読: transform/domains/reader-rules/reader-rules-creation-report.md
```

## Step 2: Evaluator 起動（定量ゲートで判定）

```
Agent(report-quality-evaluator):
  対象: transform/domains/output/D{NN}-report.md
  評価基準: transform/domains/quality-test/quality-test-domain-report.md
  出力: 指摘リスト（severity 付き）+ 指摘率
```

## Step 3: 収束ゲート

| 条件 | 判定 | アクション |
|------|------|-----------|
| 指摘率 ≤ 15% | 確定 | publish へ進む |
| 指摘率 > 15% | 追加ラウンド | Generator に差し戻し（最大2回） |
| N < 7 かつ指摘 ≥ 3件 | 追加ラウンド | 同上 |
| 2回差し戻し後も > 15% | エスカレーション | pjdhiro に確認 |

**指摘率の計測方法**: 指摘件数 / 評価項目数（T1〜T6 の各チェック数）

## Step 4: publish

```bash
# 公開先にコピー
cp transform/domains/output/D{NN}-report.md transform/domains/publish/D{NN}-{slug}-report.md
# 日付・バージョン確認
grep "generated:" transform/domains/publish/D{NN}-*-report.md
```

## verify 節

```bash
# 品質テストの主要チェックを手動確認
grep -c "^## " transform/domains/publish/D{NN}-*-report.md  # セクション数
grep "出典:" transform/domains/publish/D{NN}-*-report.md | wc -l  # 出典記述数
bash scripts/validate-guide-evidence.sh D{NN} 2>/dev/null || echo "スキップ"
```
