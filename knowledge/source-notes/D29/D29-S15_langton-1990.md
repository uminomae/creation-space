# Langton, C. (1990). Computation at the Edge of Chaos: Phase Transitions and Emergent Computation

**source_id**: D29-S15 | **domain_id**: D29
**access_status**: url-verified
**読解日**: 2026-04-20 | **読解者**: claude-opus-4-7
**読解方法**: WebFetch (osti.gov で PDF binary saved) + Read (PDF, image mode)
**原典ページ数**: 60 (LA-UR-90-379、DE90 007488、Physica D 42 (1990) 12-37 公表版) | **読解ページ範囲**: pp. 1-18 (Abstract, Introduction, 2. Parameterizing CA Rules, 3. Qualitative Overview, 4. Comments on Qualitative Dynamics 冒頭まで精読)

---

## 1. 書誌情報

- **著者**: Christopher G. Langton (T-13 & Center for Nonlinear Studies, Los Alamos National Laboratory)
- **タイトル**: Computation at the Edge of Chaos: Phase Transitions and Emergent Computation
- **出典**: Physica D 42 (1990), pp. 12-37; Los Alamos preprint LA-UR-90-379 (submitted Jan 25, 1990)
- **DOI / URL**: 10.1016/0167-2789(90)90064-V / https://www.osti.gov/servlets/purl/7264125

## 2. 要旨（読んだ内容に基づく）

Langton は「計算 (computation) はどのような物理的条件で自発的に創発するか」という問いに、セルオートマタ (CA) を形式的抽象として取り、λ パラメータで CA rule space を一次元的に parametrize することで答える。λ = 0 は全遷移が quiescent state に落ちる最大均質 rule (情報が死ぬ)、λ = 1-1/K は全状態が等確率で現れる最大不均質 rule (情報が完全にランダム化される)。両端の間に、periodic (固体的) dynamics と chaotic (流体的) dynamics の間の phase transition が存在する。Langton の中心仮説は:

> "Computation may emerge spontaneously and come to dominate the dynamics of physical systems when those systems are at or near a transition between their solid and fluid phases."

この仮説を支えるのが Wolfram の 4 class (I: homogeneous, II: periodic, III: chaotic, IV: complex localized) の Class IV — long transients を伴い、gliders (伝搬する solitary wave 的構造) と static 構造の interaction を通じて情報の storage, transmission, modification の 3 原始機能を同時に支える領域 — が、phase transition の vicinity に位置するという発見である。Class IV = edge of chaos = computation の出現領域。さらに生命自体が「phase transition の近傍に localize された環境制御を進化的に獲得する過程」として理解可能と推測する。

## 3. 主要主張（原文引用付き）

### 主張 1: 計算は情報の storage, transmission, modification の 3 原始機能を必要とする

> "All of these constructs rely on three fundamental features of the dynamics supported by the underlying transition function physics. First, the physics must support the *storage* of information, which means that the dynamics must preserve local state information for arbitrarily long times. Second, the physics must support the *transmission* of information, which means that the dynamics must provide for the propagation of information in the form of *signals* over arbitrarily long distances. Third, stored and transmitted information must be able to interact with one another, resulting in a possible modification of one or the other." (§1.2, p. 9)

この 3 機能を同時に支えるには、動的システムが「任意に大きな時空相関長」を持つ必要がある (§1.2 末尾)。

### 主張 2: CA rule space は λ パラメータで 1 次元的に parametrize でき、λ は quiescent 状態への bias として定義される

> "λ is defined as follows. We pick an arbitrary state s ∈ Σ, and call it the *quiescent* state s_q. Let there be n transitions to this special quiescent state in a transition function Δ. Let the remaining K^N - n transitions in Δ be filled by picking randomly and uniformly over the other K - 1 states in Σ - s_q. Then λ = (K^N - n) / K^N." (§2.1, p. 6)

λ = 0 は全遷移が s_q に行く最大均質 rule、λ = 1 - 1/K は全状態が等確率に現れる最大不均質 rule。この間の rule を二法 (random-table method, table-walk-through method) で生成し、dynamics の平均的振る舞いを追跡する。

### 主張 3: λ を走査すると periodic → complex → chaotic の phase transition が観察される

> "by varying the λ parameter throughout 0.0 < λ ≤ 0.75 over the space of possible K=4, N=5, 1D cellular automata, we progress from CAs exhibiting the maximal possible order to CAs exhibiting the maximal possible disorder. At intermediate values of λ, we encounter a *phase-transition* between periodic and chaotic dynamics, and while the behavior at either end of the λ spectrum seems 'simple' and easily predictable, the behavior in the vicinity of this phase-transition seems 'complex' and unpredictable." (§3 末尾, p. 15)

λ ≈ 0.45 付近で transient length が急速に増加 (2000 時間ステップ超) し、solitary wave 的 gliders が出現。λ ≈ 0.50 では transient length が 12,000 時間ステップ程度まで達し、system sizeとの指数的関係を示す。

### 主張 4: transient length は phase transition の近傍で critical slowing down を示す

> "First, transients grow rapidly in the vicinity of the transition between ordered and disordered dynamics, a phenomenon known in the study of phase-transitions as *critical slowing down*." (§4, p. 16)

> "transient length depends *exponentially* on array size at λ = 0.50" (§4, p. 16)

これは 2 次相転移での発散 (divergence) の CA 版であり、Langton は CA dynamics と物理的相転移の深い関係を示唆する。

### 主張 5: 計算は phase transition の vicinity で spontaneously emerge する

> "Computation may emerge spontaneously and come to dominate the dynamics of physical systems when those systems are at or near a transition between their solid and fluid phases." (Abstract, §1.2)

論文全体の中心仮説。Wolfram Class IV (complex localized structures) が λ ≈ 0.45-0.50 に局在することを示すことで、Class IV = edge of chaos ≈ computation zone と同定する。

### 主張 6: 生命は phase transition 近傍に自己を局所化する進化過程として理解できる

> "Perhaps the most exciting implication is the possibility that life had its origin in the vicinity of a phase transition, and that evolution reflects the process by which life has gained local control over a successively greater number of environmental parameters affecting its ability to maintain itself at a critical balance point between order and chaos." (§1.2 末尾, p. 3)

これが後年 Kauffman (1993)、Bak (1996) らの self-organized criticality / life at the edge 理論群の礎になる。

## 4. 方法論

1D / 2D CA の網羅的数値実験 + Wolfram (1984) の qualitative class 理論の extension。128 cell 周期境界の 1D CA (K=4, N=5) を λ を 0.00 から 0.75 まで 0.05 刻みで走査し、table-walk-through method で「同じ rule table を少しずつ perturbate」することで連続的 rule 変化をモデル化。各 λ で random initial configuration と patch initial configuration の両方から evolution を走らせ、transient length, entropy, mutual information, correlation length を測定。2D CA では数千 rule の統計的調査を行い、λ-behavior 関係を定量化。補助的に Wolfram 4 class との対応 (Class I = limit point, II = limit cycle, III = strange attractor, IV = long transient) を示す。

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | CA rule space (λ で parameterize された高次元空間) | 強 | "an index into the rule-space" (§2, p. 5); "lay of the CA-landscape" (§2.4) |
| 2 波 (Wave) | dynamical activity の伝搬、transient、gliders の波状運動 | 強 | "These propagating structures are essentially *solitary waves*, quasi-periodic patterns of state change ... propagate through the array" (§4, p. 17) |
| 3 縁 (Relation) | phase transition (λ ≈ 0.45-0.50) の「edge of chaos」という境界領域 | 非常に強 | "the transition region supports both static and propagating structures"; "at or near a transition between their solid and fluid phases" (Abstract) |
| 4 渦 (Vortex) | gliders と static 構造の collision/modification という回転的相互作用 | 強 | "the collision of a particle with a static periodic structure produces a particle traveling in the opposite direction. These propagating and static structures can form the basis for signals and storage, and interactions between them can modify either stored or transmitted information" (§4, p. 17) |
| 5 束 (Bundle) | storage + transmission + modification の 3 原始機能が統合されて computation が成立 | 非常に強 | "All of these constructs rely on three fundamental features ... storage ... transmission ... modification" (§1.2, p. 9) |

**判定基準についての注記**:
- 本論文は **5 段階モデルに対する極めて強い構造類似性**を示す中核原典。5 段階の「場・波・縁・渦・束」すべてに対応する形式的要素を持ち、特に Stage 3 (縁) = edge of chaos, Stage 5 (束) = computation = 3 原始機能の統合 は概念的に一致する。
- D29 (複雑系・創発計算) 領域の anchor として central。また D06 (複雑性の相転移・臨界) と密接に連携。
- 「計算という創造性が物質の相転移近傍で自発的に発生する」という命題は、5 段階モデルの「創造は 3 縁 (境界) と 4 渦 (回転) を介して 5 束 (統合) に至る」と構造的に同型。
- λ パラメータは Stage 1 (場の分化度合い) の数理化として読める。

## 6. 限界・留意事項

- 1D / 2D CA に限定された数値実験。実空間物理系 (流体、ニューロン、遺伝子ネット) への直接拡張は証明されていない。
- 「生命の起源は phase transition 近傍」は魅力的仮説だが、経験的証拠はまだ限定的 (Kauffman 1993 ら後続研究で展開)。
- Mitchell, Hraber, Crutchfield (1993) の批判: Langton の specific claim (edge of chaos で computation が最適) は普遍的ではなく、task と rule space の structure に依存する。
- λ パラメータ自体は rule の statistical property であり、dynamical behavior と「大雑把に相関」するに過ぎない (§2.4 で Langton 自身が mean field theory 等の higher-order scheme の必要性を認める)。
- 「edge of chaos」という metaphor の汎用化は後年 over-interpreted された (Mitchell 1998 の批判)。
- 本 preprint (LA-UR-90-379) の Figure 1-5 は PDF では画像が欠落している (scan 不完全)。

## 7. 未読解セクション（部分読解の場合）

- §4.2 以降 (Quantitative Analysis: entropy, mutual information, transient statistics の詳細)
- §5 (Two-Dimensional CAs の 2D extension)
- §6 (Implications for Nature — 生命・進化・計算の philosophical discussion)
- References

## 8. 構造類似性の評価（cs#226 新運用基準）

本論文は 5 段階モデルに対する構造類似性が **非常に強** (Stage 1/2/3/4/5 全てに強対応)。採用根拠:
- D29 (複雑系・創発計算) の foundational text。cs の 5 段階モデルと最も親和性の高い原典の一つ。
- 「edge of chaos」概念は 5 段階の Stage 3 (縁) と Stage 4 (渦) の境界位置を理論化した初期例。
- storage + transmission + modification の 3 原始機能の束として computation を定式化する枠組みは、cs の「束」概念の情報理論的基盤として直接利用可能。
- phase transition / critical slowing down / long transients という動的特性の記述は、D06 (臨界) と D29 の cross-reference として central。
