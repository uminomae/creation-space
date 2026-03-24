# Themes (Phase 8) End-to-End ワークフロー v1.0

**用途**: 30領域の横断分析から抽出されたテーマレポート（Phase 8）の生成 → SVG → PDF → 公開
**入力**: 30領域のドメインレポート（`pjdhiro/assets/creation/domains/ja/md/`）
**出力**: 5テーマレポート + 5サマリーレポート + 統合レポート（JA/EN）+ プレゼン + PDF

---

## A. 生成

### Step 1: 入力準備

全30領域のドメインレポートが完成済みであることを確認する。

```bash
ls /Users/uminomae/dev/pjdhiro/assets/creation/domains/ja/md/domain-D*.md | wc -l
# → 30 であること
```

以下を読む:
1. `transform/themes/theme-report-template.md`（テーマレポートテンプレート）
2. `transform/themes/reader-rules-theme-validation.md`（テーマ検証ルール）
3. `transform/themes/quality-test-theme-report.md`（品質テスト）
4. 全30領域のドメインレポートから横断パターンを抽出

### Step 2: MD 生成

**テーマレポート（5件）**: 30領域の横断分析から共通パターンを抽出し、テーマとして構造化する。

テーマ一覧（manifest: `manifests/phase8-themes.json`）:

| ID | slug | テーマ名 |
|----|------|---------|
| T1 | edge-typology | 縁の類型学と統一分類 |
| T2 | threshold | 閾値構造と縁→渦遷移の条件 |
| T5 | recirculation | 再循環メカニズム（束→場の還流） |
| T6 | field-layers | 場の多層性 |
| T7T9 | blind-spots | 盲点と反例 |

出力先:
```
pjdhiro/assets/creation/phase8-themes/ja/md/theme-{slug}.md        # テーマレポート
pjdhiro/assets/creation/phase8-themes/ja/md/summary-{slug}.md      # サマリーレポート
```

**統合レポート**（pjdhiro 正本）:
```
pjdhiro/assets/creation/phase8-themes/ja/verification/theme-integration-ja.md
```

### Step 3: SVG インフォグラフィック

各テーマに 2種類の SVG を生成する。

| Type | 内容 | 配置先 |
|------|------|--------|
| TYPE T1 (convergence) | テーマ収束概要 + ドメイン比較 | `pjdhiro/assets/creation/img/svg/themes/ja/{theme-slug}-01-convergence-svg.svg` |
| TYPE T2 (divergence) | 領域間乖離パターン可視化 | `pjdhiro/assets/creation/img/svg/themes/ja/{theme-slug}-02-divergence-svg.svg` |

旧概要 SVG（`img/svg/theme-{slug}.svg`）は phase8-themes.json で参照されているため、既存参照を維持する。

SVG 生成:
```bash
bash transform/scripts/generate-svg.sh --kind themes
```

### Step 4: PDF ビルド

```bash
bash transform/scripts/build-pdf-guide.sh --kind themes --lang ja
bash transform/scripts/build-pdf-guide.sh --kind themes --lang en    # EN版がある場合
```

出力先:
```
pjdhiro/assets/creation/phase8-themes/ja/pdf/theme-{slug}.pdf
pjdhiro/assets/creation/phase8-themes/en/pdf/theme-{slug}.pdf
```

### Step 5: EN 版生成

JA 版が確定した後に実施する。

1. テーマレポートの EN 翻訳生成
2. EN 版 SVG は JA SVG を参照（Language Handling ルール準拠）
3. EN PDF ビルド

出力先:
```
pjdhiro/assets/creation/phase8-themes/en/md/theme-{slug}.md
```

### Step 6: プレゼン資料生成

各テーマのプレゼン資料を生成する。

出力先:
```
pjdhiro/assets/creation/phase8-themes/ja/presentations/md/theme-{slug}-presentation-ja.md
pjdhiro/assets/creation/phase8-themes/en/presentations/md/theme-{slug}-presentation-en.md
```

### Step 7: 公開 push

```bash
# pjdhiro 側
cd /Users/uminomae/dev/pjdhiro
git add assets/creation/phase8-themes/ assets/creation/img/svg/themes/ assets/creation/manifests/phase8-themes.json
git commit -m "docs: Phase 8 theme reports publish

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main

# creation-space 側
cd /Users/uminomae/dev/creation-space
git add -A
git commit -m "feat: Phase 8 theme reports 生成

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin develop
```

---

## B. 成果物マトリクス

| Item | JA | EN | SVG | PDF |
|------|----|----|-----|-----|
| theme-edge-typology | MD | MD | T1 + T2 + overview | PDF |
| theme-threshold | MD | MD | T1 + T2 + overview | PDF |
| theme-recirculation | MD | MD | T1 + T2 + overview | PDF |
| theme-field-layers | MD | MD | T1 + T2 + overview | PDF |
| theme-blind-spots | MD | MD | T1 + T2 + overview | PDF |
| summary-{slug} (x5) | MD | - | - | - |
| theme-integration | MD | - | - | - |
| theme presentations (x5) | MD | MD | - | - |
| conclusion-presentation | MD | MD | - | - |

---

## C. 関連ファイル

| 用途 | パス |
|------|------|
| テーマテンプレート | `transform/themes/theme-report-template.md` |
| テーマ検証ルール | `transform/themes/reader-rules-theme-validation.md` |
| テーマ品質テスト | `transform/themes/quality-test-theme-report.md` |
| SVG 生成スクリプト | `transform/scripts/generate-svg.sh` |
| PDF ビルドスクリプト | `transform/scripts/build-pdf-guide.sh` |
| テーマ manifest | `pjdhiro/assets/creation/manifests/phase8-themes.json` |
| SVG インフォグラフィック SKILL | `skills/gemini-infographic/SKILL.md` |
| SVG 生成ルール | `transform/guides/svg-generation-rules.md` |
| ドメインワークフロー | `transform/domains/WORKFLOW.md` |
