# A Free Energy Principle for Biological Systems

**source_id**: S14 | **domain_id**: D07
**access_status**: url-verified
**読解日**: 2026-06-25 | **読解者**: Claude Opus 4.8 (Main, WebFetch)
**読解方法**: WebFetch (PMC full text, PMC3510653) — 出版社 (MDPI) の PDF/HTML は Cloudflare で 403、PMC 全文版を読解。EuropePMC fullTextXML は abstract のみ (404) のため PMC HTML を採用
**原典ページ数**: 22 (Entropy 14(11), 2100-2121) | **読解ページ範囲**: PMC 全文版（Abstract / 6 節本文を通読。数式の完全な導出・参考文献は範囲外）

---

## 1. 書誌情報

- **著者**: Karl Friston
- **タイトル**: A Free Energy Principle for Biological Systems
- **出典**: Entropy, 14(11), 2100-2121 (2012)
- **DOI / URL**: 10.3390/e14112100 / PMC3510653
- **種別**: 理論論文（数理的定式化を伴う原理提案）

## 2. 要旨（読んだ内容に基づく）

生物システムが無秩序（エントロピー増大）に抗してその形態と内部動態を維持できるのはなぜか、という問いに対し、Friston は「自由エネルギー原理（free energy principle）」を提示する。中核の主張は、生物システムは自らの感覚状態の「驚き（surprise, self-information）」を最小化するように内部状態と行動を組織し、その結果として外部状態を限られたアトラクタへと制約する、というものである。論文は (i) エルゴード的なランダム力学系がアトラクタに留まること＝エントロピー最小化、(ii) 自由エネルギー最小化が驚きの上界最小化であり、これがベイズ推論と同値になること、(iii) 知覚が「情報ボトルネック」（精度と複雑度のトレードオフ最適化）として理解できること、(iv) 脳における階層的生成モデルと予測符号化としての実装、という順で展開される。著者は最後に、この原理が「最小作用の原理の繊細な再構成」であり、単細胞生物から社会構造まで、あらゆる生物システムに適用されうると述べる。本論文は実験ではなく数理的・概念的な原理の定式化である。

## 3. 主要主張（原文引用付き）

**注記**: 本論文は理論論文であり、以下は数理的に定式化された原理の主張である。

### 主張 1: 生物システムは「驚き」を最小化する能動系である

> "an ergodic random dynamical system m=(Rd,φ) is said to be *active* if it possesses an internal map that satisfies (locally) the extremal condition: φR*=argminφRH(S∣m)" (§2.3 Circular Causality and Active Systems, Definition 1)

システムは感覚状態のエントロピー（驚きの長期平均）を内部マップによって最小化する。これがアトラクタへの自己制約として現れる。

### 主張 2: 自由エネルギー最小化＝驚きの最小化

> "minimizing free energy with respect to the internal states renders it the surprise that is minimized by active systems." (§3 Active Inference and the Free Energy Principle)

自由エネルギーは驚き（負の対数証拠）の上界であり、内部状態に関する最小化が驚きを抑える。

### 主張 3: 自由エネルギー原理に従う系はベイズ推論を実装している

> "Systems that conform to the free energy principle represent the causes of their sensory states in a Bayesian sense" (§3 Corollary 1, Bayesian Inference)

> "the optimal proposal density q(ψ(t)∣μ(t))–parameterized by internal states–becomes the posterior p(ψ(t)∣s(t),m)" (§3)

内部状態が外部原因の事後分布を近似的に表現する。

### 主張 4: 知覚は情報ボトルネック（精度と複雑度のトレードオフ）である

> "the information bottleneck method seeks to optimise the trade-off between accuracy and complexity when summarising hidden states" (§4.1 The Information Bottleneck)

> "the information bottleneck requires the internal states (representations) to predict sensory states accurately, under the constraint that their entropy is small." (§4.1)

### 主張 5: 脳は階層的生成モデルとして原理を実装する

> "Hidden causes v(t)=(v(1),v(2),…) link levels, whereas hidden states u(t)=(u(1),u(2),….)" (§5 Perception in the Brain, Eq.24)

各層の出力が次層の入力となり、深い（階層的）構造を構成する。

### 主張 6: 原理は最小作用原理の再構成であり、スケールを越えて適用される

> "the free energy principle is just a delicate reconstruction of the principle of least action, in the setting of random dynamical systems." (§6 Conclusions)

> "any biological system, from a single-cell organism to a social structure should have, encoded in its internal (macroscopic) states, a representation of causal structure in its external milieu" (§6)

## 4. 方法論

新規実験はなく、数理的定式化と概念的論証である。論文は次の論理連鎖で構成される（節構成: 1 Introduction / 2 Entropy and Random Dynamical Attractors / 3 Active Inference and the Free Energy Principle / 4 Perception, Free Energy and the Information Bottleneck / 5 Perception in the Brain / 6 Conclusions）:

- エルゴード理論・ランダム力学系のアトラクタ概念でエントロピー最小化を定義する
- 変分自由エネルギーを驚きの上界として導入し、その最小化を能動推論（知覚＋行動）として定式化する
- 情報ボトルネック法との同値性で、知覚を精度・複雑度のトレードオフとして特徴づける
- 階層的生成モデルと予測符号化で脳における実装を示す

統合の軸は「驚きの最小化＝自由エネルギー最小化＝ベイズ推論＝最小作用」という同値性の連鎖である。

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | システムが秩序を抽出する母体としての「環境のゆらぎ／ランダム力学系」 | 弱 | "an ergodic random dynamical system" (§2.3) — 未分化なゆらぎの場から構造を抽出するという含意は場と接点を持つが、著者の関心はゆらぎからの生成ではなく秩序の維持（エントロピー最小化）である |
| 2 波 (Wave) | なし | なし | 対立・揺れ・分離による生成という構造は本論文の射程外。動態はアトラクタへの収束として記述される |
| 3 縁 (Relation) | 内部状態と外部状態を媒介する感覚・能動状態という「境界での関係」 | 中 | "Systems that conform to the free energy principle represent the causes of their sensory states in a Bayesian sense" (§3) — 内/外を分かつ境界面で推論が成立する構造は「縁」（境界での相互作用から秩序が立つ）と構造的に近い。ただし著者の枠組みは関係からの生成ではなく推論である |
| 4 渦 (Vortex) | 系が限られたアトラクタへ自己制約し低エントロピー状態として立ち上がること | 中 | "active if it possesses an internal map that satisfies ... φR*=argminφRH(S∣m)" (§2.3) — ゆらぎの中で系が特定のアトラクタへ自己組織化し「まとまり」として持続する構造は段階4（個・立ち上がり）と最も近い。ただし駆動原理は驚き最小化であり生成的創発とは動機が異なる |
| 5 束 (Bundle) | 複数階層を連結した階層的生成モデル | 弱 | "Hidden causes v(t)... link levels, whereas hidden states u(t)..." (§5 Eq.24) — 層を束ねた深い構造は「束」と類似するが、束ねの目的は予測精度であり、構造化された集合としての束の含意とは動機が異なる |

**判定の根拠**: 本論文は生物の秩序維持を「驚き／自由エネルギーの最小化」という単一の数理原理で説明する理論論文である。構造的には段階4（アトラクタへの自己制約＝個の立ち上がり）と段階3（内/外境界での推論＝縁）に「中」程度の共鳴がある一方、著者の意図は一貫して推論・制御（秩序の維持）であり、ゆらぎからの生成（場→波→…）という創造の生成論ではない。manifest ヒント「Stage 1-4」に引きずられず、段階2（波）は対応なし、段階1・5は「弱」と判定した。本原典は5段階モデルのうち「個の自己組織化（渦）」と「境界の関係（縁）」に限って中程度の参照価値を持つ。

## 6. 限界・留意事項

- 本論文は数理的原理の提案であり、新規実験データはない。引用した定義・式は本文の定式化に依拠する
- 著者の関心は「秩序の維持・推論」であり、創造の生成プロセスではない。evidence への接続は段階3・4に限定し、生成論的に過大解釈してはならない
- 5段階対応は最大でも「中」（渦・縁）であり、本原典を5段階モデルの強い裏付けとして扱ってはならない
- 自由エネルギー原理は神経科学（D08）・心理学（D14）とも接続する横断的概念だが、本 source-note は D07（工学・制御）の角度（最小作用・制御原理としての定式化）で読解した
- 出版社（MDPI）の PDF/HTML は Cloudflare で取得できず、PMC 全文版を読解した。本文の論旨は把握できたが、数式の完全な導出と参考文献の精査は範囲外

## 7. 未読解セクション（部分読解の場合）

- PMC 全文版の本文 6 節（Introduction / Entropy and Random Dynamical Attractors / Active Inference / Information Bottleneck / Perception in the Brain / Conclusions）を通読
- 各数式（自由エネルギー汎関数・情報ボトルネック基準・階層生成モデル Eq.24）の完全な導出は未精査
- 参考文献リスト・付録は未読解
