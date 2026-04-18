# A Free Energy Principle for Biological Systems

**source_id**: D06-S14 | **domain_id**: D06
**access_status**: url-verified
**読解日**: 2026-04-10 | **読解者**: Claude Opus 4.6 (1M context)
**読解方法**: WebFetch (PMC: PMC3510653) -- MDPI 直接アクセスは 403 のため PMC 経由
**原典ページ数**: 22 (pp.2100-2121) | **読解ページ範囲**: 全文（PMC HTML版）

---

## 1. 書誌情報

- **著者**: Karl Friston
- **タイトル**: A Free Energy Principle for Biological Systems
- **出典**: *Entropy* 14(11), 2100-2121 (2012)
- **DOI / URL**: https://doi.org/10.3390/e14112100 / PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC3510653/

## 2. 要旨（読んだ内容に基づく）

本論文は、生物系がなぜ無秩序への自然な傾向に抗して自己組織化できるかを説明する理論的枠組みを提示する。著者は、ランダム動的系の状態空間を外部状態（環境ゆらぎに晒される）と内部状態（決定論的）に分割し、内部状態が変分自由エネルギーを最小化するとき、系が「能動的システム」となり最小作用の原理に従うことを示す。この枠組みは、ベイズ推論・能動推論・最大エントロピー原理を系として導出し、脳の予測符号化から分子生物学・進化まで適用可能な統一原理として提案される。

## 3. 主要主張（原文引用付き）

### 主張 1: 生物系は環境の構造的規則性を蒸留し、内部ダイナミクスに体現する

> "biological systems can distil structural regularities from environmental fluctuations...and embody them in their form and internal dynamics." (Sec. 1, Introduction)

生物系は受動的に環境に反応するのではなく、環境の統計的規則性を抽出して自身の構造と動態に組み込むことで、占有する状態の数を制限する。

### 主張 2: 変分自由エネルギーを最小化する系は最小作用の原理に従う

> "If the internal states r(t) minimize free energy, then the system conforms to the principle of least action." (Sec. 3, Proposition 1)

これが論文の中核的命題（Proposition 1）であり、自由エネルギー最小化と物理学の最小作用原理を結びつける。

### 主張 3: 生物系は自身の環境モデルを含意し、そのモデルのエビデンスを最大化するように行動する

> "biological systems entail a model of their environment and act to maximize the evidence for that model and, implicitly, their own existence." (Sec. 6, Conclusions)

系が自由エネルギーを最小化することは、自身の生成モデルのエビデンスを最大化することと等価であり、それは暗黙的に自身の存在を維持することに相当する。

### 主張 4: 自由エネルギー最小化は精度と複雑性のトレードオフに対応する

> "minimising free energy corresponds to minimising complexity, while maximising accuracy." (Sec. 4)

情報ボトルネック法との形式的等価性を示し、自由エネルギー最小化が精度-複雑性トレードオフの最適化であることを論じる。

### 主張 5: 円環的因果性が能動的システムを特徴づける

> "circular causality arises because internal states depend on external states, while the internal couple back to the external states by changing their flow or motion." (Sec. 2.3)

内部状態と外部状態の相互依存（円環的因果性）が、生物系を特徴づける能動的システムの本質である。

## 4. 方法論

理論物理学・情報理論のアプローチ。ランダム動的系の数学的定式化から出発し、状態空間の分割（内部/外部）、エルゴード密度、不変測度を用いて能動的システムを定義する。変分自由エネルギーの最小化が最小作用原理に従うことを命題として証明し、系としてベイズ推論・能動推論・最大エントロピー原理を導出する。さらに情報ボトルネック法との形式的等価性を示す。脳への適用として、階層的予測符号化（表層錐体細胞が予測誤差を、深層錐体細胞が予測を符号化）を導出する。

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | エルゴード密度・ランダム動的系の状態空間 | 弱 | "The ergodic density p(x|m) is an invariant probability measure that can be regarded as the probability of finding the system in any state when observed at a random point in time." (Sec. 2.2) |
| 2 波 (Wave) | 環境ゆらぎ・外部状態の揺動 | 弱 | "biological systems can distil structural regularities from environmental fluctuations" (Sec. 1) |
| 3 縁 (Relation) | 内部-外部の円環的因果性 | 弱 | "internal states depend on external states, while the internal couple back to the external states by changing their flow or motion." (Sec. 2.3) |
| 4 渦 (Vortex) | 能動的システムとしての個体化 | 弱 | "any biological system, from a single-cell organism to a social structure should have, encoded in its internal (macroscopic) states, a representation of causal structure in its external milieu." (Conclusions) |
| 5 束 (Bundle) | なし | なし | -- |

**判定基準の注記**:

本論文は生物系の自己組織化を変分自由エネルギーの数理的枠組みで記述するものであり、5段階モデルとは異なる理論的文脈にある。上記の対応はいずれも構造的類似の指摘にとどまり、著者の意図とは異なる読みである。特に:
- Stage 1-2 への対応は、状態空間やゆらぎという概念が広すぎるため、本論文固有の対応とは言い難い
- Stage 3 への対応は最も実質的だが、円環的因果性は「境界での出来事」というより動的結合の記述
- Stage 4 への対応は、能動的システムの定義が個体化に類似するが、著者は明示的に個体化を論じていない
- Stage 5 への対応は見出せない

## 6. 限界・留意事項

- 本論文は高度に数理的な理論論文であり、WebFetch による HTML 版の読解では数式の詳細（特に Proposition 1 の証明過程、方程式 1-21）を十分に追えていない
- MDPI 直接アクセスが 403 であったため PMC 経由で読解した。PMC 版は本文内容は同一だが、ページ番号が MDPI 版と異なる可能性がある。引用はセクション番号で参照した
- Friston の自由エネルギー原理は後年の論文（特に 2013 以降）で Markov blanket の概念を本格導入するが、本論文（2012）では Markov blanket への明示的言及は確認できなかった
- 本論文は D06（天文学）ではなく理論神経科学・生物物理学の論文である。D06 への配置理由は manifest の設計判断による

## 7. 未読解セクション（部分読解の場合）

PMC HTML 版で全セクション（Sec. 1-6）を読解した。ただし数式の詳細（方程式群）は WebFetch の制約により完全には追跡できていない。
