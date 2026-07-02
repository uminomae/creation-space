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

**パス正本注記**: 公開 MD は creation-space 内ではなく **pjdhiro repo** に配置する（WORKFLOW.md Step 2）。中間 `transform/domains/output/` や `transform/domains/publish/D{NN}-*-report.md` は使わない（実体なし）。

## Step 1: Generator 起動

```
Agent(domain-report-generator):
  対象: D{NN} {領域名}
  evidence: evidence/evidence-D{NN}-*.md
  source-notes: knowledge/source-notes/D{NN}/
  出力先: ../pjdhiro/assets/creation/domains/ja/md/domain-D{NN}-{slug}.md
  必読: transform/domains/reader-rules/reader-rules-creation-report.md
```

生成後、`index.json` の当該ドメイン `quality_level` を `generated` に設定する。

## Step 2: Evaluator 起動（定量ゲートで判定）

```
Agent(report-quality-evaluator):
  対象: ../pjdhiro/assets/creation/domains/ja/md/domain-D{NN}-{slug}.md
  評価基準: transform/domains/quality-test/quality-test-domain-report.md
  出力: 指摘リスト（severity 付き）+ 指摘率
```

## Step 3: 収束ゲート

| 条件 | 判定 | アクション |
|------|------|-----------|
| 指摘率 ≤ 15% | 確定 | Step 4（PDF 公開）へ進む |
| 指摘率 > 15% | 追加ラウンド | Generator に差し戻し（最大2回） |
| N < 7 かつ指摘 ≥ 3件 | 追加ラウンド | 同上 |
| 2回差し戻し後も > 15% | エスカレーション | pjdhiro に確認 |

**指摘率の計測方法**: 指摘件数 / 評価項目数（T1〜T6 の各チェック数）

PASS 後、`quality_level` を `self_tested` に更新する。独立レビュー（Codex 等）まで含む完全手順は `transform/domains/WORKFLOW.md` Step 3.5〜4 を参照。

## Step 4: PDF 公開パイプライン

```bash
cd /Users/uminomae/dev/creation-space
# PDF 生成 → domains.json 更新 → 日付検証 を一括実行（cs#128）
bash scripts/generate-domain-pipeline.sh --domain D{NN}
```

出力確認:
```
pjdhiro/assets/creation/domains/ja/pdf/domain-D{NN}-{slug}.pdf
```

pjdhiro push → creation-space develop→main マージまでで公開完了（WORKFLOW.md Step 7-9）。

## verify 節

```bash
# 公開 MD の主要チェック（pjdhiro 側）
report=../pjdhiro/assets/creation/domains/ja/md/domain-D{NN}-*.md
grep -c "^## " $report          # セクション数
grep -c "出典" $report           # 出典記述数
# 日付整合（ソース date ↔ domains.json generated）
bash scripts/verify-domain-dates.sh --domain D{NN}
```
