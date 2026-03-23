# Synthesis End-to-End ワークフロー v1.0

**用途**: 30領域ドメインレポート + 5テーマレポートを統合した領域横断分析レポートの生成 → SVG → PDF → 公開
**入力**: 30領域ドメインレポート + 5テーマレポート（Phase 8）
**出力**: 統合分析レポート（学術版 + プレゼン版）x 2言語 + SVG + PDF

---

## A. 生成

### Step 1: 入力準備

以下が完成済みであることを確認する。

```bash
# 30領域のドメインレポート
ls /Users/uminomae/dev/pjdhiro/assets/creation/domains/ja/md/domain-D*.md | wc -l
# → 30

# 5テーマレポート
ls /Users/uminomae/dev/pjdhiro/assets/creation/phase8-themes/ja/md/theme-*.md | wc -l
# → 5
```

以下を読む:
1. 全30領域のドメインレポートの結論セクション
2. 5テーマレポートの主要知見
3. `base/text/m2-creation-process/creation-source.md`（5段階モデルの定義）

### Step 2: MD 生成

**学術版**: 30領域の調査結果を統合し、モデル全体の構造的妥当性を評価する。

出力先:
```
pjdhiro/assets/creation/synthesis/ja/md/cross-domain-synthesis-ja.md
```

**プレゼン版**: 学術版の主要知見をスライド形式に凝縮する。

出力先:
```
pjdhiro/assets/creation/synthesis/ja/md/cross-domain-synthesis-presentation-ja.md
```

### Step 3: SVG インフォグラフィック

| Type | 内容 | 配置先 |
|------|------|--------|
| TYPE S1 (distribution) | 30領域の判定分布ヒートマップ | `pjdhiro/assets/creation/img/svg/synthesis/ja/{slug}-01-distribution-svg.svg` |
| Themes network | 5テーマの関係ネットワーク図 | `pjdhiro/assets/creation/img/svg/synthesis/ja/{slug}-themes-network.svg` |

SVG 生成:
```bash
python3 scripts/generate-infographic-svgs.py
```

### Step 4: PDF ビルド

```bash
bash transform/scripts/build-pdf-guide.sh --kind synthesis --lang ja
bash transform/scripts/build-pdf-guide.sh --kind synthesis --lang en   # EN版がある場合
```

出力先:
```
pjdhiro/assets/creation/synthesis/ja/pdf/cross-domain-synthesis-ja.pdf
pjdhiro/assets/creation/synthesis/ja/pdf/cross-domain-synthesis-presentation-ja.pdf
```

### Step 5: EN 版生成

JA 版が確定した後に実施する。

1. 学術版の EN 翻訳
2. プレゼン版の EN 翻訳
3. EN PDF ビルド

出力先:
```
pjdhiro/assets/creation/synthesis/en/md/cross-domain-synthesis-en.md
pjdhiro/assets/creation/synthesis/en/md/cross-domain-synthesis-presentation-en.md
```

### Step 6: 公開 push

```bash
# pjdhiro 側
cd /Users/uminomae/dev/pjdhiro
git add assets/creation/synthesis/ assets/creation/img/svg/synthesis/ assets/creation/manifests/synthesis.json
git commit -m "docs: cross-domain synthesis publish

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main

# creation-space 側
cd /Users/uminomae/dev/creation-space
git add -A
git commit -m "feat: cross-domain synthesis 生成

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin develop
```

---

## B. 成果物マトリクス

| Item | JA | EN | SVG | PDF |
|------|----|----|-----|-----|
| cross-domain-synthesis (academic) | MD | MD | S1 distribution + themes network | PDF |
| cross-domain-synthesis-presentation | MD | MD | (shares academic SVGs) | PDF |

---

## C. 関連ファイル

| 用途 | パス |
|------|------|
| PDF ビルドスクリプト | `transform/scripts/build-pdf-guide.sh` |
| SVG 生成スクリプト | `scripts/generate-infographic-svgs.py` |
| synthesis manifest | `pjdhiro/assets/creation/manifests/synthesis.json` |
| SVG インフォグラフィック SKILL | `skills/gemini-infographic/SKILL.md` |
| ドメインワークフロー | `transform/domains/WORKFLOW.md` |
| テーマワークフロー | `transform/themes/WORKFLOW.md` |
| 5段階モデル定義 | `base/text/m2-creation-process/creation-source.md` |
