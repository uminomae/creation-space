---
name: nl-debug
description: >
  30領域調査の自然言語デバッグ検査ハーネス。manifest/source-note/evidence の静的整合検査、
  PDF抽出測定、書誌照合、网羅性・バイアス検査を実行する。
  cs#245「自然言語デバッグ」の実行手順。
  triggers: "nl-debug", "manifest検査", "調査デバッグ", "整合チェック", "cs#245"
---

# nl-debug — 30領域調査 自然言語デバッグ ハーネス

cs#245 の実行手順。Phase A-D を順に実行し、severity 付きレポートを生成する。

## 前提

リポジトリルート（`creation-space/`）で実行すること。

```bash
# スクリプトに実行権限を付与（初回のみ）
chmod +x .claude/skills/nl-debug/scripts/*.sh
```

## 数量の実測（Phase A 実行前に必ず確認）

**重要**: 計画書に記載した数値と実行時の実測値が一致することを確認する。
不一致があれば Phase A レポート冒頭に記録する（cs#245 round 1 の教訓）。

```bash
bash .claude/skills/nl-debug/scripts/count-manifest.sh
```

期待値（2026-06-11 実測）:
- raw-confirmed: 107
- ローカル PDF: 101
- 欠落 PDF: 5
- 未参照 PDF: 1

実測値と乖離がある場合はレポートに記録し、原因を解明してから次フェーズへ進む。

---

## Phase A: 静的検査

### A-0: 前提値 self-check

```bash
bash .claude/skills/nl-debug/scripts/count-manifest.sh 2>&1 | tee .cache/research/nl-debug/A-counts.txt
bash scripts/validate-manifest-sync.sh 2>&1 | tee .cache/research/nl-debug/A-validate.txt
```

記録内容:
- 計画記載値と実行時実測値の差分
- validate-manifest-sync.sh の結果（ベースライン: PASS、Check 1 SKIP）

### A-1: 数量照合（3者対応）

source_id 単位で manifest テーブル行 ↔ PDF実体 ↔ source-note の全数照合。
count-manifest.sh の出力を使い、欠落/未参照の原因を分類する:
- manifest 自己申告の更新漏れ
- git 履歴上の削除
- 時点差（後から追加/削除）

### A-2: 数字並存の解明

manifest.md に並存する複数の数字（100/107/134 等）の出所を解明する。
各数字の根拠を `git log` と manifest 本文から確認し、どれが正しい母集団かを確定する。

### A-3: 参照切れ・絶対パス検査

```bash
bash .claude/skills/nl-debug/scripts/check-dead-refs.sh 2>&1 | tee .cache/research/nl-debug/A-deadrefs.txt
```

### A-4: source-note ヘッダ検査

source-note のヘッダは YAML frontmatter ではなく **Markdown bold 形式**（`**source_id**: D12-S01`）。
必須3フィールド: `source_id`, `domain_id`, `access_status`
（著者・タイトル・年は「## 1. 書誌情報」セクション内に `**著者**` `**タイトル**` で記載）

```bash
find knowledge/source-notes -name "D*-S*_*.md" | while read f; do
  for field in source_id domain_id access_status; do
    grep -q "\*\*${field}\*\*" "$f" || echo "MISSING $field: $f"
  done
done
```

### A-5: B-1 事前測定

```bash
bash .claude/skills/nl-debug/scripts/check-pdf-extract.sh 2>&1 | tee .cache/research/nl-debug/A-pdf-extract.txt
```

成功率が30%未満の場合は pjdhiro に報告し、確認待ち中は B-1 トラック1のみ続行。

### Phase A 進行ゲート

**全数量差の説明が「残差 0 件」になった場合のみ Phase B へ進む。**
残差 > 0 件なら保留して pjdhiro に確認。

出力: `.cache/research/nl-debug/A-structure-report.md`（severity 付き、全検出に再現コマンド）

---

## Phase B: 書誌・出典検査

### B-1: 書誌照合（2トラック制）

- トラック1（優先）: pdftotext 抽出可能な PDF → 先頭ページ書誌を manifest 行と照合
- トラック2: 抽出不能 PDF → 手動キュー

報告冒頭必須: `B-1 カバレッジ: トラック1 N=XX / 母集団 YY (ZZ%)`

不能率 30% 超 → pjdhiro 報告、確認待ちはトラック1のみ続行。

### B-2: 主張の抜き取り検証

対象: 2件/領域 ≈ 60件。
報告冒頭必須: `サンプル N≈60、全数証明ではない`

各サンプルについて:
1. source-note の「主要主張」を抜き出す
2. evidence の記述と照合する
3. 齟齬があれば `severity: major` で記録

### Phase B 収束ゲート（定量）

critic 1回適用。
- **指摘率 ≤ 15%** → 確定
- **指摘率 > 15%** → 追加ラウンド

N < 7 の場合は絶対数（指摘 ≥ 3件）で判定。

出力: `.cache/research/nl-debug/B-citation-report.md` + 修正キュー

---

## Phase C: 網羅性・バイアス検査

### C-1: 漏れ探索（全30領域）

各領域について:
1. manifest を**見ずに**主要理論リストを独立生成
2. manifest の収集済みリストと diff
3. 未収集候補を列挙（confidence: high/medium/low 付与）

「漏れの証明」ではなく「候補の提示」。確定漏れとは言わない。

### C-2: 敵対的再評価（限定スコープ）

対象: 「全5段階に対応あり」の source-note を優先サンプル + C-1 浮上分。
rerun 第1群（D08/D10/D14/D18/D20/D21/D22/D25）を優先。

V3-V6 で再評価:
- V3: 最強の反論
- V4: 確証バイアス検出
- V5: スコープ外一般化検出
- V6: 論理飛躍検出

### Phase C 収束ゲート

critic ゲート: 15%。N < 20 の場合は絶対数（指摘 ≥ 3件）で判定。

出力: `.cache/research/nl-debug/C-coverage-bias-report.md`

---

## Phase D: 公開面検査 + 統合

### D-1: 公開面確認

progress_level 表示と内部 SoT の一致確認。到達不能は WARN。
到達率 50% 未満 → 「部分完了」判定。

### D-2: 統合レポート（D-synthesis.md）

必須セクション: **「未検査領域・未検査観点」**
- C-2 未適用の領域リスト
- B-2 非全数性の明記
- SKIP 一覧

全検出を severity 別に統合し、修正 Issue 群に分解（修正は別スコープ）。

出力: `.cache/research/nl-debug/D-synthesis.md`

---

## Severity 定義

| レベル | 定義 | 対処 |
|--------|------|------|
| **critical** | 前提事実の誤り・数量の不一致 | 即時修正または pjdhiro エスカレーション |
| **major** | 書誌情報の齟齬・リンク切れ | 修正 Issue 起票 |
| **minor** | 自己申告更新漏れ・軽微な不一致 | 次回作業時に修正 |
| **info** | 情報共有のみ・改善候補 | 任意対応 |

---

## verify 節

Phase 完了時の確認コマンド:

```bash
# Phase A 完了確認
ls .cache/research/nl-debug/A-*.txt .cache/research/nl-debug/A-structure-report.md
bash scripts/validate-manifest-sync.sh | grep -E "(PASS|FAIL|SKIP|WARN)"

# Phase B 完了確認
ls .cache/research/nl-debug/B-citation-report.md
grep "B-1 カバレッジ" .cache/research/nl-debug/B-citation-report.md

# 全Phase 完了確認
ls .cache/research/nl-debug/{A-structure-report,B-citation-report,C-coverage-bias-report,D-synthesis}.md
```
