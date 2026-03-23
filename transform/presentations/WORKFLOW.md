# Presentations End-to-End ワークフロー v1.0

**用途**: 領域別レポート（domains）からプレゼン資料を生成し、SVG インフォグラフィック挿入 → PDF ビルド → 公開 push までを実施する
**入力**: 領域別学術レポート MD（`pjdhiro/assets/creation/domains/ja/md/domain-D{NN}-{slug}.md`）
**出力**: プレゼン資料 MD + PDF（JA/EN）

---

## A. 生成

### Step 1: 入力準備

対象ドメインの学術レポートが公開済みであることを確認する。

```bash
ls /Users/uminomae/dev/pjdhiro/assets/creation/domains/ja/md/domain-D{NN}-*.md
```

以下を読む:
1. `transform/domains/reader-rules/presentation-template.md`（プレゼンテンプレート）
2. `transform/domains/reader-rules/reader-rules-creation-report.md`（品質基準）
3. 対象ドメインの学術レポート MD

### Step 2: MD 生成

2つの方法がある:

**方法A: Python スクリプトによる自動生成**
```bash
python3 transform/scripts/gen-domain-presentations.py --domain D{NN}
python3 transform/scripts/gen-domain-presentations.py --all          # 全30件
```

- index.json からメタデータを取得
- 学術レポートからセクションを抽出してスライド構造に変換
- 5段階モデル概要スライドを自動挿入

**方法B: シェルスクリプト + Claude CLI による生成**
```bash
bash transform/scripts/generate-presentations.sh --domain D{NN}
bash transform/scripts/generate-presentations.sh --all
bash transform/scripts/generate-presentations.sh --list     # 対象一覧確認
```

- Claude CLI 用の指示書を生成し、テンプレートに沿ったプレゼンを生成

出力先:
```
transform/domains/publish/presentations/domain-D{NN}-{slug}-presentation-ja.md
```

公開配置先:
```
pjdhiro/assets/creation/domains/ja/presentations/md/domain-D{NN}-{slug}-presentation-ja.md
```

### Step 3: SVG インフォグラフィック

プレゼン資料にはセクション見出しに応じて TYPE A/B/C の SVG を挿入する。

| Type | JA trigger heading | EN trigger heading | 内容 |
|------|-------------------|-------------------|------|
| TYPE A | `## 調査の概要` | `## Overview of the Study` | 5段階概要 + 理論ヒートマップ |
| TYPE B | `## 構造対応の全体像` | `## Overview of Structural Correspondences` | 理論 x 5段階対応マトリクス |
| TYPE C | `## 横断的パターン` | `## Cross-Cutting Patterns` | 横断的パターン図 |

挿入フォーマット（見出し直後、キャプションなし）:
```markdown
## {Section Heading}

\![{Alt text}](https://uminomae.github.io/pjdhiro/assets/creation/img/svg/domains/ja/D{NN}-{suffix}.svg)

- First bullet point...
```

SVG 生成・挿入:
```bash
# SVG 生成（Gemini API 経由）
python3 scripts/generate-infographic-svgs.py

# MD への SVG リンク挿入
python3 scripts/insert-infographic-links.py

# 公開用 MD に SVG 参照を同期
python3 scripts/sync-public-svg-embeds.py
```

EN 版は JA SVG を参照する（ラベルは日本語でもデータ構造は言語非依存）。

### Step 4: PDF ビルド

```bash
# domains プレゼンは domains PDF の一部としてビルドされる
bash transform/scripts/build-pdf-guide.sh --kind domains --lang ja
bash transform/scripts/build-pdf-guide.sh --kind domains --lang en   # EN版がある場合
```

出力先:
```
pjdhiro/assets/creation/domains/{lang}/pdf/domain-D{NN}-{slug}.pdf
```

### Step 5: 公開 push

```bash
# pjdhiro 側
cd /Users/uminomae/dev/pjdhiro
git add assets/creation/domains/
git commit -m "docs: D{NN} presentation publish

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main

# creation-space 側
cd /Users/uminomae/dev/creation-space
git add -A
git commit -m "feat: D{NN} presentation 生成

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin develop
```

---

## B. 成果物マトリクス

| Item | JA | EN | SVG | PDF |
|------|----|----|-----|-----|
| domain-D{NN}-{slug}-presentation | MD | MD | TYPE A/B/C | PDF |

全30領域分のプレゼン資料が対象。

---

## C. 関連ファイル

| 用途 | パス |
|------|------|
| Python 生成スクリプト | `transform/scripts/gen-domain-presentations.py` |
| Shell 生成スクリプト | `transform/scripts/generate-presentations.sh` |
| プレゼンテンプレート | `transform/domains/reader-rules/presentation-template.md` |
| SVG 生成スクリプト | `scripts/generate-infographic-svgs.py` |
| SVG リンク挿入スクリプト | `scripts/insert-infographic-links.py` |
| SVG 同期スクリプト | `scripts/sync-public-svg-embeds.py` |
| PDF ビルドスクリプト | `transform/scripts/build-pdf-guide.sh` |
| ドメインインデックス | `transform/domains/publish/domains/index.json` |
| SVG インフォグラフィック SKILL | `skills/gemini-infographic/SKILL.md` |
| ドメインワークフロー | `transform/domains/WORKFLOW.md` |
