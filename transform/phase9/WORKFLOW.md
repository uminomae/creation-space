# Phase 9 End-to-End ワークフロー v1.0

**用途**: Phase 8 の知見を検証する Phase 9 計画書群の生成 → SVG → PDF → 公開
**入力**: Phase 8 の調査結果（ドメインレポート + テーマレポート + 統合分析）
**出力**: 概要計画 + 4トラック計画 x 2言語 = 10 MD + SVG + PDF

---

## A. 生成

### Step 1: 入力準備

Phase 8 の成果物が完成済みであることを確認する。

```bash
# domains, themes, synthesis が揃っていること
cat /Users/uminomae/dev/pjdhiro/assets/creation/manifests/phase8-themes.json | python3 -c "import json,sys; print(len(json.load(sys.stdin)['themes']))"
# → 5

ls /Users/uminomae/dev/pjdhiro/assets/creation/synthesis/ja/md/cross-domain-synthesis-ja.md
```

以下を読む:
1. Phase 8 テーマレポートの結論・未解決の問い
2. 統合分析レポートの結論
3. `manifests/phase9-tracks.json`（トラック定義）

### Step 2: MD 生成

**概要計画**: Phase 9 全体の検証戦略を記述する。

```
pjdhiro/assets/creation/phase9/overview-plan-ja.md
pjdhiro/assets/creation/phase9/overview-plan-en.md
```

**4トラック計画**: 各トラックの詳細検証計画。

| Track | key | 内容 |
|-------|-----|------|
| 9A | grounding | 実証接地 -- 学術的根拠調査 |
| 9B | falsification | 反証探索 -- 堅牢性検証 |
| 9C | frontier | 未踏領域探索 -- モデル汎用性テスト |
| 9D | formalization | 数理形式化 -- 定式化と定理導出 |

出力先:
```
pjdhiro/assets/creation/phase9/9{X}-{key}/plan-ja.md
pjdhiro/assets/creation/phase9/9{X}-{key}/plan-en.md
```

各トラックには `interim_md` と `final_md` のスロットがあるが、Phase 9 実行時に生成される（manifest で `null` のままにしておく）。

### Step 3: SVG インフォグラフィック

各トラックに1つの概要インフォグラフィックを生成する。

| Track | SVG 内容 |
|-------|---------|
| overview | Phase 9 全体の4トラック関係図 |
| 9A | 28領域の接地状況マップ |
| 9B | 反証探索の判定フロー図 |
| 9C | 未踏候補6領域の選定マップ |
| 9D | 数理形式化のステップ図 |

SVG 生成:
```bash
python3 scripts/generate-infographic-svgs.py
```

### Step 4: PDF ビルド

各トラック計画を個別に pandoc でビルドする。

```bash
# 概要計画
bash transform/scripts/build-pdf-guide.sh --kind synthesis --lang ja   # synthesis ビルダーを流用

# 個別ビルド（pandoc 直接）
for track in 9A-grounding 9B-falsification 9C-frontier 9D-formalization; do
  pandoc "pjdhiro/assets/creation/phase9/${track}/plan-ja.md" \
    -o "pjdhiro/assets/creation/phase9/${track}/plan-ja.pdf" \
    --pdf-engine=lualatex
done
```

出力先:
```
pjdhiro/assets/creation/phase9/overview-plan-ja.pdf
pjdhiro/assets/creation/phase9/overview-plan-en.pdf
pjdhiro/assets/creation/phase9/9{X}-{key}/plan-ja.pdf
pjdhiro/assets/creation/phase9/9{X}-{key}/plan-en.pdf
```

### Step 5: Manifest 更新

Phase 9 の進捗状況を manifest に記録する。

```
pjdhiro/assets/creation/manifests/phase9-tracks.json
```

各トラックの `status` フィールド:
- `planned` → 計画書のみ
- `in_progress` → 調査実行中
- `completed` → 最終レポート完成

### Step 6: 公開 push

```bash
# pjdhiro 側
cd /Users/uminomae/dev/pjdhiro
git add assets/creation/phase9/ assets/creation/manifests/phase9-tracks.json
git commit -m "docs: Phase 9 track plans publish

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main

# creation-space 側
cd /Users/uminomae/dev/creation-space
git add -A
git commit -m "feat: Phase 9 track plans 生成

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin develop
```

---

## B. 成果物マトリクス

| Item | JA | EN | SVG | PDF |
|------|----|----|-----|-----|
| overview-plan | MD | MD | 4-track overview | PDF |
| 9A-grounding plan | MD | MD | grounding map | PDF |
| 9B-falsification plan | MD | MD | falsification flow | PDF |
| 9C-frontier plan | MD | MD | frontier selection | PDF |
| 9D-formalization plan | MD | MD | formalization steps | PDF |

---

## C. 関連ファイル

| 用途 | パス |
|------|------|
| Phase 9 manifest | `pjdhiro/assets/creation/manifests/phase9-tracks.json` |
| PDF ビルドスクリプト | `transform/scripts/build-pdf-guide.sh` |
| SVG 生成スクリプト | `scripts/generate-infographic-svgs.py` |
| SVG インフォグラフィック SKILL | `skills/gemini-infographic/SKILL.md` |
| テーマワークフロー | `transform/themes/WORKFLOW.md` |
| 統合分析ワークフロー | `transform/synthesis/WORKFLOW.md` |
| Phase 8 テーマ manifest | `pjdhiro/assets/creation/manifests/phase8-themes.json` |
| 統合分析 manifest | `pjdhiro/assets/creation/manifests/synthesis.json` |
