# READER レシピ（正本）— 探究解説ページの生成・更新テンプレート

**正本**: このファイル。READER 型ページ（一般読者向けの探究解説）を**新規生成・更新**するとき、LLM はまずこれを読む。
**由来**: TH-001 wave-vortex（cs#258/259/261）で確立したパターンを再利用可能に一般化。
**関連正本**: 各スキルは pd `.claude/skills/`。ビルドは cs `scripts/build-reader-th.py` + `scripts/reader-th-template.html`。

---

## 0. READER とは何か（page_type）

調査の正本（`evidence/**/output.md` 等）を**万人向けに投影した解説ページ**。目的は「難しい概念を平易に解説して読者が学ぶこと」。**正誤判定でなく、他者の知識・研究を発想のヒント／基礎として知ること**（cs#261 pjdhiro 方針）。検証（読解テスト・敵対的パネル）は品質の裏付けであって主役ではない。検証結果は verdict でなく**学習素材に翻訳して**公開する。

## 1. 固定パイプライン（fixed — 変えない）

```
調査の正本 output.md（source_of_truth）
  → READER 正本 MD（reader_canonical。HTML は直接編集禁止）
  → python3 scripts/build-reader-th.py（--src/--out で差し替え可）
  → reader/{slug}.html（生成物。VI 継承、独自テーマ新造禁止）
  → bash server.sh 3002 で人間チェック
  → develop 検証 → develop→main merge push（GitHub Pages 公開）
```

- テンプレート: `scripts/reader-th-template.html`（`<!--TOC-->` は h2 から自動生成）
- デザイン制約: `reader/README.md` §デザイン制約（tokens.css の CSS 変数のみ、生 rgba 禁止、バッジ `.badge-p/.badge-m/.badge-s`）

## 2. オプション・メニュー（options — ページごとに選ぶ）

新規ページは下記から必要なものを選び、frontmatter の `build_recipe.options` に宣言する。`default` は特段の理由がなければ入れる。

### 2a. 理解促進デバイス（comprehension_devices）

| キー | 説明 | 既定 |
|---|---|---|
| `toc` | 目次（h2 から自動生成、reader-toc） | ✅ default |
| `fold_details` | アコーディオン「くわしく」= 深掘りを畳む。主題外の言い訳・ルールは冒頭「はじめに読む」に集約 | ✅ default |
| `quizzes` | 埋め込みクイズ「たしかめ」= 各節末、答えを畳んで隠す（Litt の speed regulator、`details.reader-quiz`） | ✅ default |
| `badges` | 確からしさバッジ [P]/[M]/[S]。正誤でなく確信度の目印 | ✅ default |
| `three_js_bg` | Three.js 背景埋め込み（createEmbeddedGraphic、?graphic=…）。可読性はガラス面で担保 | ⭘ optional |
| `svg_diagram` | 本文中の SVG 図解（地図・フロー） | ⭘ optional |

### 2b. スキル（skills — 使ったものを宣言）

| キー | いつ使う | 正本 |
|---|---|---|
| `agent-team-workflow` | 調査ラウンドの基本フロー（SURVEY→REVIEW…）。規模に応じ full/部分 | pd |
| `adversarial-review` | 高スティクスな**係争的/検証可能**な主張の敵対的パネル検証。外部CLI不可時は別モデル+方法論分岐に縮退し証拠力を格下げ | pd（cs#260） |
| `reader-comprehension` | 公開ページの推敲＋文脈ゼロ読解テスト（Litt 三技法＋speed regulator）。誤読は原則ページ側を直す | pd |
| `model-dispatch` | Fable5=設計・統合、Opus/Sonnet/Haiku=調査・実行。budget-check 枠ゲート連動 | pd |

### 2c. 品質ゲート（quality_gates）

| キー | 内容 | 既定 |
|---|---|---|
| `comprehension_test` | 読解テスト（RC 系）で中核誤読ゼロを公開前に確認 | ✅ 公開前 required |
| `adversarial_panel` | 係争的主張に敵対的パネル | ⭘ 必要時 |
| `litt_conformance` | Litt 三技法の実装監査（reader-litt-conformance） | ⭘ メジャー改稿時 |

## 3. 不変条件（invariants — 常に守る）

- **鎖の不変条件**（cs#252）: 取得不能原典の上に公開解釈を置かない。全文精読した原典のみ [P]。
- **声の帰属**: 文責は Claude（Fable5）。pjdhiro の直観・判定は引用として扱う。
- **verdict→学習素材**: 検証の生結果（「独立でない＝弱い証拠」等）をそのまま載せない。学びに翻訳する。
- **HTML 直接編集禁止**: 正本 MD を直し、build で再生成。

## 4. 運用サイクル（investigation_cycle）

```
調査ラウンド（agent-team-workflow + model-dispatch）
  → output.md 改訂 → READER 更新（§調査のいまに現在地を刻む）
  → build → 3002 で人間チェック → 公開判断は pjdhiro
```

## 5. 新規ページの frontmatter スケルトン（コピーして使う）

```yaml
---
title: {ページ題}
status: draft
updated: {YYYY-MM-DD}
issue: {cs#NNN}
source_of_truth: {調査正本 output.md のパス}
note: 本ファイルが READER の正本。reader/{slug}.html は生成物（直接編集禁止）
build_recipe:
  recipe: transform/reader/reader-recipe.md   # ← このレシピを参照（詳細はDRYで委譲）
  page_type: READER
  goal: {このページで何を学べるように}
  options:
    devices: [toc, fold_details, quizzes, badges]   # 2a から選択（+ three_js_bg / svg_diagram）
    skills: [reader-comprehension]                   # 2b から使ったものを（+ agent-team-workflow / adversarial-review / model-dispatch）
    quality_gates: [comprehension_test]              # 2c から（+ adversarial_panel / litt_conformance）
  page_notes: {このページ固有のメモ（任意）}
---
```

既存の実装例: `evidence/themes/TH-001-wave-vortex-ontology/READER-wave-vortex.md`（全オプション採用）。

## 6. 関連

- ビルド/デザイン: `reader/README.md`
- スキル正本: pd `.claude/skills/{agent-team-workflow,adversarial-review,reader-comprehension,model-dispatch}/`
- 初出: cs#259（パイプライン）/ cs#261（第2期・平易化・理解促進・本レシピ化）
