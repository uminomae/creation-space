# Network Models for Cognitive Development and Intelligence

**source_id**: S15 | **domain_id**: D23
**access_status**: raw-confirmed
**読解日**: 2026-06-26 | **読解者**: claude-opus-4-8
**読解方法**: Read (PDF, image mode)
**原典ページ数**: 17 (pp.1-17) | **読解ページ範囲**: pp.1-17 全ページ（本文 §1-§5 全節 + 文献概観）

---

## 1. 書誌情報

- **著者**: Han L. J. van der Maas¹, Kees-Jan Kan², Maarten Marsman¹, Claire E. Stevenson¹（¹Psychological Methods, University of Amsterdam; ²Research Institute of Child Development and Education, University of Amsterdam）
- **タイトル**: Network Models for Cognitive Development and Intelligence
- **出典**: *Journal of Intelligence* 2017, 5(2), 16（Article）。Academic Editors: Andreas Demetriou, George Spanoudis
- **DOI**: 10.3390/jintelligence5020016
- **発行**: Received 24 Jan 2017 / Accepted 12 April 2017 / Published 20 April 2017。Open Access (CC BY)。

## 2. 要旨（読んだ内容に基づく）

本論文は、認知の**機構（mechanisms）**を扱う実験心理学と、**個人差（intelligence）**を扱う相関心理学という Cronbach (1957) の「2つの学問」の分断を、**ネットワークモデリング**で架橋することを主張する。一般知能の正の多様体（positive manifold＝認知能力テスト得点間の正相関）を説明する3モデル（g 因子モデル・サンプリングモデル・相利共生モデル）を比較し、van der Maas らの **相利共生（mutualism）モデル**（W 個の認知過程が相互に成長を促進し合う Lotka-Volterra 型力学系）が、g 因子を「脳内の単一実体」と仮定せずに正の多様体を創発させると論じる。さらにネットワークモデルが現代心理測定（factor model / IRT）と数学的に等価であること（Ising モデル ≡ 多次元2パラメータ IRT、相利共生 ≡ 因子モデル）を示し、ネットワークの相転移（カスプ破局・Ising 温度）が Piaget 的な離散的発達段階と連続的発達の双方を同一ネットワークから生み出すことを示す。

## 3. 主要主張（原文引用付き）

### 主張 1: 認知の機構と個人差はネットワークで架橋できる（Cronbach の2学問の統合）

> "unification requires models of the process within individuals—the mechanism, i.e., how it works—augmented with assumptions about sources of individual differences. [...] we argue that network modeling is a promising approach to integrate the processes of cognitive development and (developing) intelligence into one unified theory." (pp.2, Abstract)

機構（個人内の過程）と個人差（個人間の変動源）を統合するモデルが必要で、ネットワークモデルはその両方を担える。

### 主張 2: g 因子・潜在変数モデルの限界 — 潜在変数の解釈問題

> "The main problem with the latent variable approach is that it is often unclear how we should interpret the latent variable. What is g? Is it mental power, brain size, working memory, speed of information processing in the brain, or something else?" (p.3)

g 因子モデルは個人差をよく説明するが、潜在変数（g）の存在論的地位＝それが何を表すかが100年の研究でも未解決。反映モデル（reflective: 潜在変数が観測得点を因果的に生む）と形成モデル（formative: 潜在変数は複雑系の指標にすぎない）の区別が根本的（Fig.1）。

### 主張 3: 相利共生モデル — 相互促進する認知過程のネットワーク

> "The idea of the mutualism model of general intelligence is that such reciprocal causal effects also occur during development. We can think of the cognitive system as a large set of basic capacities or abilities, and growth in one aspect is partly autonomous and partly based on growth in other aspects." (p.5)

> "dxᵢ/dt = aᵢxᵢ(1 − xᵢ/Kᵢ) + aᵢ Σⱼ Mᵢⱼxᵢxⱼ/Kᵢ for i = 1..W" (Eq.1, p.5)

認知系を W 個の基本能力（作業記憶・推論・語彙等）のネットワークと捉え、各過程の成長を「自律的ロジスティック成長＋他過程との相利的相互作用（行列 M）」で記述する。個人差は限界容量 Kᵢ（遺伝 Gᵢ＋環境 Eᵢ, Eq.2）の差に由来し、**単一の個人差源（g）は存在しない**。

### 主張 4: 正の多様体は相利共生から創発する（g を仮定せず）

> "a mutualism model with equal interactions Mᵢⱼ = c and a one factor model with equal factor loadings imply exactly the same covariance matrix. [...] the mutualism model explains the positive manifold of correlations between cognitive ability tests—a major phenomenon in intelligence research." (p.6)

相利共生モデルは（弱く疎な相互作用でも）正の多様体・階層因子構造・g の遺伝率の年齢増加・統合/分化効果を説明する。等相互作用の相利共生モデルと1因子モデルは同一の共分散行列を生む＝g は創発的記述であって脳内実体ではない。

### 主張 5: ネットワークと心理測定の等価性（Ising ≡ IRT）

> "The Ising model is equivalent to a special case of the multivariate 2-parameter logistic IRT [...] This is very interesting in the context of this paper, as the link between the Ising model and MIRT establishes a link between models of processes and mechanisms (in the form of networks) and the statistical methods to analyze individual differences (psychometrics)." (pp.9-10)

強磁性を説明する Ising モデル（二値ノードの相互作用網）が多次元2パラメータ IRT と数学的に等価。これにより「機構のモデル（ネットワーク）」と「個人差の統計（心理測定）」が橋渡しされる。

### 主張 6: 同一ネットワークが連続的・離散的発達を生む（相転移）

> "complex systems can continuously change between a state, where change is discrete to a state where change is smooth and continuous. [...] The famous Ising network model [...] is formally equivalent to a multivariate 2-parameter logistic IRT model. Depending on the temperature [...] the resulting distribution of the latent trait is either unimodal or bimodal." (pp.12, 14)

ネットワークの温度（結合強度）パラメータに応じて、潜在特性分布が単峰（連続的発達＝IQ得点の漸増）にも双峰（離散的発達＝段階移行）にもなる。Piaget 的段階移行はカスプ破局（Fig.6）として相転移で記述でき、disequilibrium・stages・reorganization は複雑系理論の用語に対応する。

### 主張 7: 統一ネットワークモデル — 相利共生＋乗数＋サンプリング＋中心性

> "we proposed a new unified network model of general intelligence that incorporates four basic explanations: mutualism between basic cognitive processes during development, multiplier effects through the environment, sampling in manifest test scores, and centrality of key processes such as working memory." (p.13, Discussion)

統一モデル（Fig.2-3）は (1) 発達中の認知過程間の相利共生、(2) 環境を介した乗数効果（Dickens）、(3) テスト得点でのサンプリング、(4) 作業記憶など中心的過程のネットワーク中心性、を統合し、Jensen 効果・Flynn 効果・g の遺伝率増加等を説明する。

## 4. 方法論

理論・レビュー論文。独自データ収集はないが、(1) 正の多様体を説明する3モデル（g/サンプリング/相利共生）の比較、(2) 相利共生 Lotka-Volterra 力学系（Eq.1-2）の解析・シミュレーション結果の整理、(3) WAIS-III データへの相利共生ネットワーク（Gaussian graphical model, graphical lasso）と因子モデルの当てはめ比較（Fig.4-5）、(4) Ising モデル（Eq.4-5）と IRT（Eq.6-7 drift-diffusion D/Q）の数学的等価性の提示、(5) カスプ破局による段階移行の説明（Fig.6）を組み合わせる。van der Maas et al. (2006) の相利共生モデルを基盤とする。

## 5. 5段階との対応候補（D23 発達心理学角度）

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | W 個の独立な認知過程（基本能力）。相互作用前の自律的ロジスティック成長を持つネットワークノード群 | 強 | "the cognitive system as a large set of basic capacities or abilities [...] growth in one aspect is partly autonomous" (p.5); "The first term of Equation (1) models the autonomous growth of each sub-process" (p.5) |
| 2 波 (Wave) | 相利的相互作用＝発達中にネットワークを伝播する相互促進的成長（言語→認知、認知→メタ認知 等） | 強 | "such reciprocal causal effects also occur during development. [...] the positive influence of language on cognition, and vice versa" (p.5) |
| 3 縁 (Relation) | 相互作用行列 M／相転移の臨界（カスプ破局の制御変数、Ising 温度・結合強度）＝段階移行が決まる閾値 | 強 | "The crucial point is that the Ising model and many other network models also exhibit phase transitions between alternative stable states, such as the transition from primary reasoning to understanding permission rules" (p.11); "Catastrophe theory [...] particularly cusp catastrophe, classifies phase transitions" (p.11) |
| 4 渦 (Vortex) | 創発する正の多様体／新たな認知発達段階（alternative stable state）＝ネットワークから立ち上がる構造化された個 | 強 | "the occurrence of alternative stable states is especially relevant when it comes to development" (p.11); "the mutualism model explains the positive manifold" (p.6) |
| 5 束 (Bundle) | 残る統計構造＝g 因子・因子構造・潜在特性（IRT）として再利用される不変則。ネットワークと心理測定の等価性 | 強 | "a mutualism model with equal interactions Mᵢⱼ = c and a one factor model with equal factor loadings imply exactly the same covariance matrix" (p.6); "the same network can give rise to both continuous and discontinuous cognitive-intellectual development" (p.2) |

**判定基準**:
- **強**: 著者が直接その概念・構造を論じており、5段階の定義と明確に対応する
- **弱**: 構造的類似はあるが、著者の文脈・意図とは異なる読みである
- **なし**: 対応が見出せない。無理に作らない

**注記**: 本論文は相互作用ネットワークの相転移を扱うため5段階と全段階で対応する。特に Stage 3 縁（相互作用行列 M ／カスプ破局・Ising 相転移＝段階移行の臨界）と Stage 4 渦（正の多様体・新段階が立ち上がる alternative stable state）が強い。同領域 **D23-S14 van Geert (1998)** のダイナミックシステム発達論（成長者間の相互競争・支援）と相補的で、van Geert が個別成長軌道の力学を、van der Maas が認知過程ネットワークの創発構造（g）を扱う。「創造」概念は登場せず、5段階対応は評価者側の解釈である。なお本モデルはネットワーク全ノードが初期から存在する点で「過度に単純」と著者自身が認め、新ノード（新知識・能力）が蓄積する発達するネットワークを今後の課題とする（p.14）。

## 6. 限界・留意事項

- 理論統合論文であり、本論文自体は新規実証データを提示しない（WAIS-III 当てはめは既存データの再分析）。
- 相利共生モデルは批判（Gignac 2016: g は3歳から安定＝相利共生の予測と矛盾／Nisbett 2012: 遺伝・環境の分離不全）を受けており、著者は反論（van der Maas & Kan 2016）を提示するが論争は決着していない。
- 統一ネットワークモデルは「全ノードが初期から存在する」点で過度に単純で、発達的なノード生成（新知識の蓄積）を欠くと著者が明言（p.14）。
- 領域固有の認知機構（問題をどう解くか）はネットワークの外にあり、本モデルはそれら機構の「集合的作動」を扱うにとどまる（p.14）。
- 図 Fig.1-6 はモデル構造・当てはめ結果の図示であり、本読解ではキャプションと本文記述を中心に読んでいる。

## 7. 未読解セクション

全 17 ページ（pp.1-17）読了。本文 §1-§5 全節を精読。文献 ref.1-76 は個別確認時に参照が必要だが、本論の理解には読解済み範囲で十分。数式 Eq.1-7 は構造・意味を把握。

## 8. 関連 source-note

- **D23-S14 van Geert (1998)**: 同領域のダイナミックシステム発達論。個別成長軌道の相互競争・支援の力学を扱い、本論文（認知過程ネットワークの創発構造・g）と相補的。両者ともオランダ学派の発達ダイナミクス系譜。
