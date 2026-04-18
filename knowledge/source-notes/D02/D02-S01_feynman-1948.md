# Space-Time Approach to Non-Relativistic Quantum Mechanics

**source_id**: D02-S01 | **domain_id**: D02
**access_status**: raw-confirmed
**読解日**: 2026-04-10 | **読解者**: Claude Opus 4.6 (1M context)
**読解方法**: Read (PDF)
**原典ページ数**: 21 (pp. 367-387) | **読解ページ範囲**: 全ページ (pp. 367-387)

---

## 1. 書誌情報

- **著者**: R. P. Feynman
- **タイトル**: Space-Time Approach to Non-Relativistic Quantum Mechanics
- **出典**: Reviews of Modern Physics, Volume 20, Number 2, April 1948, pp. 367-387
- **DOI / URL**: https://doi.org/10.1103/RevModPhys.20.367

## 2. 要旨（読んだ内容に基づく）

Feynman は非相対論的量子力学の第三の定式化を提示する。Schroedinger の微分方程式、Heisenberg の行列代数に続く、経路積分に基づく定式化である。粒子が時空のある領域にパスを持つ確率は、その領域内の各パスからの寄与の複素振幅の絶対値の二乗で与えられる。各パスの寄与は等しい振幅を持ち、位相は古典的作用（ラグランジアンの時間積分）を h-bar で割ったものである。この定式化が従来の Schroedinger 方程式と数学的に等価であることが証明され、応用として場の振動子座標の消去による量子電磁力学への接続が示される。

## 3. 主要主張（原文引用付き）

### 主張 1: 経路積分による量子力学の第三の定式化

> "This paper will describe what is essentially a third formulation of non-relativistic quantum theory. This formulation was suggested by some of Dirac's remarks concerning the relation of classical action to quantum mechanics." (p. 367)

Feynman は Dirac の古典的作用と量子力学の関係に関する示唆を出発点に、Schroedinger 方程式・Heisenberg 行列力学とは異なる第三の定式化を構築する。この定式化では確率振幅が粒子の時空における全運動に関連付けられる。

### 主張 2: 全経路の等振幅寄与と古典的作用による位相

> "The paths contribute equally in magnitude, but the phase of their contribution is the classical action (in units of h-bar); i.e., the time integral of the Lagrangian taken along the path." (p. 371)

これが第二の公準であり、経路積分定式化の核心である。各パスの寄与は exp(iS/h-bar) に比例し、S は古典的ラグランジアンの時間積分（古典的作用）である。

### 主張 3: 確率振幅の重ね合わせ — 古典力学との本質的な相違

> "Now, the essential difference between classical and quantum physics lies in Eq. (2). In quantum mechanics it is often false. We shall denote the quantum-mechanical probability that a measurement of C results in c when it follows a measurement of A giving a by P_ac." (p. 369)

古典力学では中間測定の結果を単純に合計して遷移確率を得るが（Eq. 4）、量子力学ではそれが複素振幅の重ね合わせに置き換わる（Eq. 5）。中間状態 b の測定を実際に行うかどうかで結果が変わるという点が、干渉現象の起源であり、本定式化の物理的基盤である。

### 主張 4: 波動関数の定義と Schroedinger 方程式の導出

> "We shall see that it is the possibility, (10), of expressing S as a sum, and hence Phi as a product, of contributions from successive sections of the path, which leads to the possibility of defining a quantity having the properties of a wave function." (p. 372)

作用 S が逐次的区間の寄与の和に分解できることから、波動関数 psi(x,t) を自然に定義でき、Eq. (18) を通じてこれが Schroedinger 方程式を満たすことが示される（Section 6, pp. 374-377）。

### 主張 5: 古典的極限 — 最小作用の原理の回復

> "We see then that the classical path is that for which the integral (37) suffers no first-order change on varying the path. This is Hamilton's principle and leads directly to the Lagrangian equations of motion." (p. 378)

h-bar が小さい極限では、経路積分の被積分関数の位相が急速に振動し、古典的経路（作用が停留値をとる経路）の近傍のみが有意に寄与する。これにより Hamilton の原理とラグランジュ方程式が自然に回復される。

### 主張 6: 場の振動子の消去 — 量子電磁力学への応用

> "The present formulation permits the solution of the motion of all the oscillators and their complete elimination from the equations describing the particles." (p. 385)

粒子と場（調和振動子として表現）の相互作用において、振動子の自由度を経路積分によって完全に消去し、粒子の座標のみで記述できることを示す。これは量子電磁力学への直接的な応用であり、従来の定式化では困難であった手法である。

## 4. 方法論

Feynman の方法は以下のステップで構成される:

1. **公理的出発点**: 2つの公準を設定する。(I) 粒子が時空領域にパスを持つ確率は各パスからの寄与の絶対値の二乗、(II) 各パスの寄与は等振幅で位相が古典的作用に比例する。
2. **等価性の証明**: 上記の公準から波動関数を定義し（Section 5）、それが Schroedinger の微分方程式を満たすことを導出する（Section 6）。ラグランジアンが速度について二次形式である場合に厳密に成立。
3. **演算子代数の再構成**: 行列要素・遷移振幅を経路積分の言語で再定式化し（Section 8）、交換関係・Newton の運動方程式の行列形式を再導出する（Section 9）。
4. **応用**: 調和振動子の消去により場の自由度を排除し、量子電磁力学へ接続する（Section 13）。

証明の鍵は、作用が逐次区間の和に分解できること（Eq. 10）と、自由粒子に対するガウス積分の明示的計算（A = (2*pi*h-bar*epsilon*i/m)^(1/2)）にある。

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | 全経路の等振幅寄与 — 測定前の確率振幅空間。全てのパスが等しく寄与し、特定の経路がまだ選ばれていない状態 | 弱 | "The paths contribute equally in magnitude" (p. 371) |
| 2 波 (Wave) | 位相の干渉 — 各経路の複素振幅が干渉し合い、打ち消し合いや強め合いが生じる | 弱 | "Eq. (5) is a typical representation of the wave nature of matter. Here, the chance of finding a particle going from a to c through several different routes... be represented as the square of a sum of several complex quantities -- one for each available route." (p. 369) |
| 3 縁 (Relation) | なし | なし | — |
| 4 渦 (Vortex) | なし | なし | — |
| 5 束 (Bundle) | 古典的極限での経路の収束 — h-bar → 0 で停留位相条件により古典的経路に収束 | 弱 | "if h is very small, the exponent will be a very rapidly varying function of any of its variables x_i. ... The region at which x_i contributes most strongly is that at which the phase of the exponent varies least rapidly with x_i (method of stationary phase)." (p. 378) |

**判定基準に関する注記**: Stage 1, 2, 5 について「弱」とした。Feynman の記述は量子力学の数学的構造に関するものであり、「場（Field）」「波（Wave）」という用語が5段階モデルの定義（未分化の海、差の生成）と直接対応するわけではない。Stage 1 は「全経路が等しく寄与する未決定状態」として構造的類似を見出せるが、著者の意図は確率計算の処方箋であって、創造プロセスの未分化状態を論じているわけではない。Stage 5 も停留位相による古典的経路への収束は「方向の収束」に類似するが、著者の文脈は古典力学との対応関係の証明である。Stage 3, 4 については対応を見出せない。

## 6. 限界・留意事項

- 本論文は非相対論的量子力学に限定されており、相対論的拡張（Dirac 方程式等）については Section 14 で形式的な言及があるのみで、完全な扱いではない。
- ラグランジアンが速度について二次形式（quadratic form）である場合にのみ Schroedinger 方程式との厳密な等価性が証明されている（p. 374: "We limit ourselves to the case that the Lagrangian is a quadratic, but perhaps inhomogeneous, form in the velocities"）。
- Section 11 で著者自身が「数学的概念が新しく、現段階では不自然で扱いにくい」と述べており（p. 384: "The formulation given here suffers from a serious drawback. The mathematical concepts needed are new."）、経路積分の数学的厳密性（測度の定義等）は未解決のまま残されている。
- 5段階との対応はいずれも「弱」であり、Feynman の定式化は創造プロセスの記述を目的としたものではない。量子力学の計算処方箋としての性格が強い。

## 7. 未読解セクション

全ページ読了（pp. 367-387, 21ページ）。
