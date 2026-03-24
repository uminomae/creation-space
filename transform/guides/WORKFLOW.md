# Guides End-to-End ワークフロー v1.0

**用途**: 3種類の読者向けガイド（一般/設計者/専門家）の生成 → SVG → PDF → 公開
**入力**: 基盤理論テキスト（`base/text/m2-creation-process/creation-source.md`）+ ドメインレポートの知見
**出力**: 3 audience x 2 languages = 6 MD + 各 PDF + 概要 SVG

---

## A. 生成

### Step 1: 入力準備

以下を読む:
1. `base/text/m2-creation-process/creation-source.md`（5段階モデルの正本テキスト）
2. `transform/guides/reader-rules/`（ガイド用 reader-rules）
3. `transform/guides/svg-generation-rules.md`（SVG 生成ルール）
4. 必要に応じてドメインレポートの事例

### Step 2: MD 生成

3種類の読者層に合わせたガイドを生成する。

| audience | JA title | EN title |
|----------|---------|---------|
| general | 創造の構造 -- 5つの段階 | The Structure of Creation -- Five Stages |
| designer | 発散と収束の間にあるもの | What Lies Between Divergence and Convergence |
| academic | 創造の5段階モデルと先行理論の構造比較 | Structural Comparison of the Five-Stage Model and Prior Theories |

出力先:
```
pjdhiro/assets/creation/guides/ja/md/creation-{audience}.md
pjdhiro/assets/creation/guides/en/md/creation-{audience}.md
```

kesson-driven-thinking の `/generate-drafts` コマンドを参照して生成手順を確認できる。

### Step 3: SVG インフォグラフィック

各ガイドに1つの概要インフォグラフィックを生成する。

| audience | SVG 内容 |
|----------|---------|
| general | 5段階の直感的な図解 |
| designer | 発散-収束プロセスと5段階の対応図 |
| academic | 先行理論マッピング概要図 |

SVG 生成:
```bash
python3 scripts/generate-infographic-svgs.py
```

配置先:
```
pjdhiro/assets/creation/img/svg/guides/ja/{audience}-overview.svg
```

### Step 4: PDF ビルド

```bash
# 全3種 JA
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang ja

# 全3種 EN
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all --lang en

# 特定の1種のみ
bash transform/scripts/build-pdf-guide.sh --kind guides --audience general --lang ja
```

出力先:
```
pjdhiro/assets/creation/guides/ja/pdf/creation-{audience}.pdf
pjdhiro/assets/creation/guides/en/pdf/creation-{audience}.pdf
```

### Step 5: 公開 push

```bash
# pjdhiro 側
cd /Users/uminomae/dev/pjdhiro
git add assets/creation/guides/ assets/creation/img/svg/guides/ assets/creation/manifests/guides.json
git commit -m "docs: guides publish

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main

# creation-space 側
cd /Users/uminomae/dev/creation-space
git add -A
git commit -m "feat: guides 生成

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin develop
```

---

## B. 成果物マトリクス

| Item | JA | EN | SVG | PDF |
|------|----|----|-----|-----|
| creation-general | MD | MD | overview | PDF |
| creation-designer | MD | MD | overview | PDF |
| creation-academic | MD | MD | overview | PDF |

---

## C. 関連ファイル

| 用途 | パス |
|------|------|
| PDF ビルドスクリプト | `transform/scripts/build-pdf-guide.sh` |
| SVG 生成スクリプト | `scripts/generate-infographic-svgs.py` |
| reader-rules | `transform/guides/reader-rules/` |
| SVG 生成ルール | `transform/guides/svg-generation-rules.md` |
| guides manifest | `pjdhiro/assets/creation/manifests/guides.json` |
| SVG インフォグラフィック SKILL | `skills/gemini-infographic/SKILL.md` |
| 5段階モデル定義 | `base/text/m2-creation-process/creation-source.md` |
