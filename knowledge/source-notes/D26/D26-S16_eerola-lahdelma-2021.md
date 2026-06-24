# The Anatomy of Consonance/Dissonance

**source_id**: S16 | **domain_id**: D26
**access_status**: url-verified
**読解日**: 2026-06-25 | **読解者**: Claude Opus 4.8 (Main, WebFetch)
**読解方法**: WebFetch (SAGE full-text HTML, /doi/full) — 出版社 PDF (/doi/pdf) は Cloudflare で塞がれるが、gold OA 誌のため全文 HTML 版 (journals.sagepub.com/doi/full) で本文に到達・読解
**原典ページ数**: — (Music & Science 4, article 20592043211030471) | **読解ページ範囲**: 全文 HTML（Abstract / 導入 / 3 実験 / 結論を通読。各実験の統計テーブル・付録の詳細数値は範囲外）

---

## 1. 書誌情報

- **著者**: Tuomas Eerola, Imre Lahdelma
- **タイトル**: The Anatomy of Consonance/Dissonance: Evaluating Acoustic and Cultural Predictors Across Multiple Datasets with Chords
- **出典**: Music & Science, 4 (2021)
- **DOI / URL**: 10.1177/20592043211030471
- **種別**: 実証研究（複数データセットの統計モデリング）

## 2. 要旨（読んだ内容に基づく）

西洋音楽文化における協和/不協和（C/D）の知覚を、音響的予測因子と文化的予測因子の双方から評価した実証研究。著者らは、和音 C/D の知覚が roughness（粗さ）・harmonicity（調和性）・familiarity（親近性）という3要素の組み合わせに加え、spectral envelope（スペクトル包絡）という第4要素で説明されると論じる。3つの実験を通じて、まず階層的クラスタ分析で予測因子を4カテゴリに整理し（実験1）、各カテゴリ内で最適な指標を線形混合モデルで選び（実験2）、複数データセット（9セット・617刺激）でモデル性能を評価する（実験3）。改訂モデル「Eero21」は先行する Harrison & Pearce モデル（説明率62%）を上回る73%を達成し、分散の最大要因が familiarity（46.2%）であることを示した。中核主張は、C/D 知覚が音響だけでなく文化的親近性に強く依存する複合現象だ、というものである。

## 3. 主要主張（原文引用付き）

**注記**: 本論文は実証研究であり、以下は複数データセットの統計分析に基づく主張である。

### 主張 1: C/D は roughness・harmonicity・familiarity の組み合わせである

> "the overall perception of C/D in simultaneous sonorities in the Western musical culture is arguably based on a combination of *roughness*, *harmonicity*, and *familiarity*" (Introduction)

C/D を単一の音響属性ではなく複数要素の合成として捉える。

### 主張 2: 4要素それぞれが独立した予測カテゴリを成す

> Roughness: "the sound quality that arises from the beating of frequency components" (Introduction)

> Harmonicity: "how closely a sonority's spectrum corresponds to a harmonic series" (Introduction)

> Familiarity: "the prevalence of sonorities in a given musical culture which affects how familiar the listeners become with these sonorities" (Introduction)

> Spectral Envelope: "related to the shape of the energy distribution along the spectrum" (Experiment 1, Definition section)

実験1の階層的クラスタ分析がこの4カテゴリの独立性を確認する。

### 主張 3: 分散の最大要因は familiarity（文化的要素）である

> "familiarity accounts for the largest part of the variance in the model (46.2% of variance), whereas the combined roughness and harmonicity component is the second major element (19.3% of variance)" (Experiment 3, Discussion)

音響要素（roughness+harmonicity = 19.3%）よりも文化的親近性（46.2%）が支配的である。

### 主張 4: 改訂モデル Eero21 は先行モデルを上回る

> "the Harrison and Pearce model (62%) and a still significantly better rate for the revised model (73%)" (Abstract)

4要素を統合したモデルが従来モデルより高い説明率を示す。

## 4. 方法論

3つの実験から成る（節構成: Introduction / Experiment 1: Analysis of Consonance and Dissonance Predictors / Experiment 2: Features of C/D / Experiment 3: Assessing C/D Features with Multiple Datasets / Conclusions）:

- **実験1**: Durham Chord Dataset 等を用い、多数の予測因子を階層的クラスタ分析で4カテゴリ（roughness / harmonicity / familiarity / spectral envelope）に整理する
- **実験2**: 各カテゴリ内で最適な指標を線形混合モデルで選定する
- **実験3**: 9データセット・617刺激のプール回帰で Eero21（R²≈0.73）を先行モデル（≈0.62）と比較し、主成分分析で familiarity を最大分散源と同定する

統合の軸は「音響的予測因子 × 文化的予測因子 → 4カテゴリ合成モデル」である。

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | なし | なし | 未分化の場から構造が立ち上がるという生成論的枠組みは本論文の射程外。出発点は知覚現象の予測因子分解である |
| 2 波 (Wave) | roughness が「周波数成分のうなり（beating）」から生じること | 弱 | "the sound quality that arises from the beating of frequency components" (Introduction) — うなりは波の干渉現象であり、揺れ・干渉から知覚質が立つ構造は段階2と物理的接点を持つ。ただし著者の関心は知覚予測であり生成論ではない |
| 3 縁 (Relation) | C/D が同時に鳴る複数音の「関係」として定義されること | 弱 | "how closely a sonority's spectrum corresponds to a harmonic series" (Introduction) — 協和性が音の関係（スペクトルと倍音列の対応）から決まる構造は「縁」（関係から質が生じる）と接点を持つが、著者は関係を予測変数として扱い、関係からの生成を論じていない |
| 4 渦 (Vortex) | なし | なし | 個・まとまりの自己組織的立ち上がりという構造は本論文にない |
| 5 束 (Bundle) | C/D 知覚が4要素を束ねた複合として説明されること | 弱 | "a combination of *roughness*, *harmonicity*, and *familiarity*" (Introduction) — 複数要素の合成という構造は「束」と類似するが、著者の関心は知覚分散の説明であり、構造化された集合としての束の生成的含意とは動機が異なる |

**判定の根拠**: 本論文は協和/不協和という知覚現象を音響・文化の予測因子に分解する実証研究であり、創造の生成プロセスを論じる意図はない。段階2（うなり＝波の干渉）と段階3（音の関係としての協和性）に物理的・構造的接点があるが、いずれも著者にとっては予測変数であり生成原理ではないため「弱」とした。段階5（4要素の複合）も分析的分解であって生成的な束ではない。manifest ヒント「Stage 2-3」は接点の所在としては妥当だが強度は「弱」にとどまる。本原典は5段階モデルの強い裏付けにはならない。

## 6. 限界・留意事項

- 本論文は実証研究だが、創造の生成論ではなく知覚現象の予測モデルである。evidence への接続は慎重を要する
- 5段階対応は総じて「弱」または「なし」。本原典を5段階モデルの強い裏付けとして扱ってはならない
- roughness と「波（うなり）」の接点は物理的に実在するが、本論文の文脈では知覚予測因子であり、生成原理としては展開されていない
- familiarity が支配的という知見は「協和は普遍的音響法則」という素朴な見方への反証として価値があるが、これは音楽文化論（D26）固有の論点であり、5段階モデルとは独立した寄与である
- 出版社 PDF（/doi/pdf）は Cloudflare で塞がれたが、gold OA 誌の全文 HTML 版（/doi/full）で本文に到達した。本文の論旨は把握できたが、各実験の統計テーブルの完全な数値は範囲外

## 7. 未読解セクション（部分読解の場合）

- 全文 HTML 版の本文（Abstract / 導入 / 実験1-3 / 結論）を通読
- 各実験の統計テーブル・回帰係数の完全な数値・付録は未精査
- 引用された各音響指標アルゴリズム（Hutchinson & Knopoff 1978 等）の原典には遡及していない
