# Life as we know it

**source_id**: D20-S16 | **domain_id**: D20
**access_status**: raw-confirmed
**読解日**: 2026-04-24 | **読解者**: claude-opus-4-7
**読解方法**: Read (PDF, image mode)
**原典ページ数**: 12 | **読解ページ範囲**: 全 12 頁精読（本文 p.1-11 + References p.11-12）

---

## 1. 書誌情報

- **著者**: Karl Friston (The Wellcome Trust Centre for Neuroimaging, Institute of Neurology, Queen Square, London WC1N 3BG, UK)
- **タイトル**: Life as we know it
- **出典**: *Journal of The Royal Society Interface* 10: 20130475 (2013)
- **DOI**: 10.1098/rsif.2013.0475
- **受理**: Received 2013-05-27; Accepted 2013-06-12; Published 2013-07-03
- **ライセンス**: CC-BY 3.0
- **取得経路**: Royal Society 公式 HTML ラッパ / web.archive.org は cookieSet redirect でブロック → **europepmc.org/articles/PMC3730701?pdf=render** で直接 PDF 取得成功（1.8MB、12 頁、公刊版）
- **キーワード**: autopoiesis, self-organization, active inference, free energy, ergodicity, random attractor

## 2. 要旨（読んだ内容に基づく）

Friston は「生命 = 境界をもつ ergodic な確率動的系」を数学的に定義し、**"Markov blanket をもつ任意の ergodic ランダム動的系は、あたかも変分自由エネルギーを最小化しているかのように振る舞い、これが近似 Bayesian 推論＝active inference に対応する"** という heuristic proof を提示する。系の状態空間を $(\Omega, \Psi, S, A, \Lambda)$ — 外部 / 感覚 / 行動 / 内部 — の 5 組 tuple に分割し、Markov blanket (= 感覚 + 行動状態) が内部状態を外部から**統計的に**隔てる必要十分条件を与える。Fokker–Planck 方程式の定常解から、内部＋行動状態の流れは ergodic density $p(\psi, s, a, \lambda | m)$ の対数勾配を登る循環的勾配降下として表現でき、この勾配降下が **Gibbs 自由エネルギー − variational density のエントロピー** の最小化と等価であることを示す (式 2.6–2.9)。証明原理として 128 個の結合確率動的部分系（電気化学状態は Lorenz 型、Newton 運動は短距離反発 + 長距離引力）をシミュレートし、約 1000 s 後に spectral graph theory で principal Markov blanket を同定する。結果 (Figure 3): 内部状態（青）は中央に小さな閉ループ（"cilium" 様）を形成、Markov blanket（感覚=マゼンタ、行動=赤）がそれを包む**細胞様構造**が自発的に立ち上がる。canonical variates analysis で内部状態の動態が外部状態の運動を有意に予測 ($\chi^2$ permutation, $p = 0.00052$) — active inference の経験的検証。最後に Markov blanket を「機能的に閉じる」lesion 実験を行い、**"oscillator death"**（自己組織化の崩壊、内部状態の外部への拡散）を示す (Figure 5)。この結果は autopoiesis (Maturana–Varela) の数学的再定式化であり、**"生命らしさ"は炭素化学の特殊性ではなく、Markov blanket をもつ ergodic 系の一般的性質** という結論を導く。論文は「感覚・行動の境界が先にあり、その後に内部構造が自己組織化する」という **境界先行の自己組織化論**を提示し、D20 における「自律性・境界性・統合」の形式化として決定的に重要。

## 3. 主要主張（原文引用付き）

### 主張 1: 生命 = Markov blanket をもつ ergodic 確率動的系 の必然的帰結

> "This paper presents a heuristic proof (and simulations of a primordial soup) suggesting that life—or biological self-organization—is an inevitable and emergent property of any (ergodic) random dynamical system that possesses a Markov blanket." (Abstract, p.1)
>
> "any ergodic random dynamical system that possesses a Markov blanket will appear to actively maintain its structural and dynamical integrity. We will associate this behaviour with the self-organization of living organisms." (Sec 2, p.2)

**生命性 (life-likeness) = 境界をもち、かつ時間平均が収束する系 が必然的に示す挙動**。炭素や RNA が特別ではなく、Markov blanket の存在が根本条件と主張。

### 主張 2: 5 組の状態空間 $(\Omega, \Psi, S, A, \Lambda)$ — 生命を記述する最小 tuple

Table 1 (p.2) の定義:
- $\Omega$: sample space（確率変動の引数）
- $\Psi$: external states（世界の状態、行動に応答）
- $S$: sensory states（行動と外部状態に依存）
- $A$: action states（感覚と内部状態に依存）
- $\Lambda$: internal states（行動を生み、感覚に依存）
- $p(\psi, s, a, \lambda | m)$: ergodic density
- $q(\psi | \lambda)$: variational density

> "External states cause sensory states that influence—but are not influenced by—internal states, while internal states cause active states that influence—but are not influenced by—external states" (p.2)

このいわゆる 2-条件独立が **Markov blanket** の数学的核心。

### 主張 3: Markov blanket の存在が内部状態の "Bayesian 推論" 的挙動を必然化

> "the flow of internal and active states minimizes free energy, rendering the variational density equivalent to the posterior density over external states." (p.4, eq. 2.6 以降)
>
> "This means that action will (on average) appear to minimize free energy and thereby place an upper bound on the entropy of the internal states and their Markov blanket. If we associate these states $v = \{s, a, \lambda\}$ with biological systems, then action places an upper bound on their dispersion (entropy) and will appear to conserve their structural and dynamical integrity." (p.5, eq. 2.9 の解説)

$q(\psi | \lambda) \to p(\psi | s, a, \lambda)$ に近づくにつれて KL divergence が 0 に漸近し、内部状態は外部状態に関する **"posterior belief"** を (変分) 表現しているかのように見える。これが **active inference** の正当化。

### 主張 4: 4 つの生命性 criterion — biological, blanket, inference, autopoiesis

> "biological systems are ergodic [26]: in the sense that the average of any measure of their states converges over a sufficient period of time..."
>
> "they are equipped with a Markov blanket [28]: the existence of a Markov blanket necessarily implies a partition of states..."
>
> "they exhibit active inference [11]: the partition of states implied by the Markov blanket endows internal states with the apparent capacity to represent hidden states probabilistically..."
>
> "they are autopoietic [4]: because active states change—but are not changed by—hidden states (figure 1), they will appear to place an upper (free energy) bound on the dispersion (entropy) of biological states. This homoeostasis is informed by internal states, which means that active states will appear to maintain the structural and functional integrity of biological states." (p.5)

Maturana & Varela の autopoiesis 概念を **"自由エネルギーの上界を内部・行動状態が協調して置くこと"** と再定式化。Ashby の good regulator theorem（主張 5 参照）との接続も明示。

### 主張 5: Good regulator theorem との接続

> "This is exactly consistent with the Bayesian modelling perspective, that is, with the good regulator theorem (every good regulator is a model of its environment) [13] and related treatments of self-organization [2,5,12,39,40]." (p.5, ref [13] = Conant & Ashby 1970)

Conant–Ashby 1970 の定理「よき制御子はその環境のモデルである」が、自由エネルギー原理と**同値**であることを主張。D20 で「自律性の形式化」を扱う最高レベルの定式化。

### 主張 6: 128 部分系の primordial soup シミュレーション（証明原理）

> "128 subsystems were integrated using Euler's (forward) method with step sizes of 1/512 s and initial conditions sampled from the normal distribution." (p.6)
>
> "for most values of the parameters, ergodic behaviour emerges as the ensemble approaches its random global attractor (usually after about 1000 s): generally, subsystems repel each other initially (much like illustrations of the big bang) and then fall back towards the centre, finding each other as they coalesce." (p.6)

電気化学状態は Lorenz 方程式（rate parameter $\kappa^{(i)}$ が部分系ごとに不均一）、Newton 運動は逆二乗反発 + 二次引力ポテンシャル。式 (3.1)–(3.3)。初期のビッグバン的分散 → 凝集 → ergodic 挙動 → Markov blanket の出現。

### 主張 7: Markov blanket は spectral graph theory で同定される

> "the Markov blanket of any subset of states encoded by a binary vector with elements $\chi_i \in \{0, 1\}$ is given by $[B \cdot \chi] \in \{0, 1\}$, where the Markov blanket matrix $B = A + A^T + A^T A$ encodes children, parents and parents of children." (p.6)
>
> "The principal eigenvector of the (symmetric) Markov blanket matrix will—by the Perron–Frobenius theorem—contain positive values... the internal states were defined as belonging to subsystems with the $k = 8$ largest values." (p.6)

**Markov blanket の具体的同定アルゴリズム**が与えられている点が画期的。単なる概念定義ではなく、シミュレーションデータから "生命の境界" を抽出できる。

### 主張 8: 自己組織化の空間構造（Figure 3）

> "a small loop structure with a little cilium, protected by the active states that support the surface or sensory states" (p.7 Fig.3 caption)
>
> "the closed subsystems have been rusticated to the periphery of the system. Recall that these subsystems cannot influence or engage other subsystems and are therefore expelled to the outer limits of the soup." (p.7)

内部状態が中央、感覚・行動状態が membrane、functionally closed な粒子は末梢に追い出される。**細胞構造（核 + 細胞膜 + 細胞骨格）に対応する幾何**がランダムな初期条件から必然的に現れる。

### 主張 9: active inference の統計的検証 — 内部状態が外部状態を予測

> "Figure 4d also shows the subsystems whose motion could be predicted reliably. This predictability is the most significant at the periphery of the ensemble... The distribution of the ensuing $\chi^2$ statistics (over 82 external elements) is shown in (b) for the true (black) and null (white) analyses. Crucially, five of the subsystems in the true analysis exceeded the largest statistic in the null analysis. The largest value of the null distribution provides protection against false positives at a level of 1/82. The probability of obtaining five $\chi^2$ values above this threshold by chance is vanishingly small $p = 0.00052$." (p.9)

canonical variates analysis で「内部状態の動態 → 外部状態の運動」が有意に予測可能。null distribution との比較で $p = 0.00052$。**active inference を経験的に証明**する最も重要な図。

### 主張 10: Autopoiesis と oscillator death（Figure 5）

> "In all simulations, a subset of states was lesioned by simply rendering their subsystems closed... These simulations illustrate the effective death of biological self-organization that is a well-known phenomenon in dynamical systems theory—known as oscillator death. In our setting, they are a testament to autopoiesis or self-creation—in the sense that self-organized dynamics are necessary to maintain structural or configurational integrity." (Figure 5 caption, p.10)

行動/感覚/内部のいずれを "functionally close" しても **自己組織化が崩壊**する。Figure 5(b)–(d): active 損傷 → 感覚状態の外部侵入、感覚損傷 → 行動状態の外部流出、内部損傷 → 内部状態の blanket 越境拡散。**生命は能動的に自分を維持し続けないと即座に消える** ことの数値的実演。

### 主張 11: Markov blanket は入れ子構造（fractal 的な生命性）

> "the Markov blanket of an animal encloses the Markov blankets of its organs, which enclose Markov blankets of cells, which enclose Markov blankets of nuclei and so on. In all, formally, every Markov blanket induces active (Bayesian) inference and there are probably an uncountable number of Markov blankets in the universe." (p.10)

動物 ⊃ 器官 ⊃ 細胞 ⊃ 核 の入れ子。生命性は離散的カテゴリではなく**blanket の連続的スケール階層**として記述できる。

### 主張 12: "minimum entropy Markov blanket" が生命の指標である可能性

> "One might conjecture that minimum entropy Markov blankets characterize biological systems." (p.10)
>
> "biological systems move around in their state space but revisit a limited number of states. This space filling aspect of attracting sets may rest on the divergence-free or solenoidal flow (equation (2.3)) that we have largely ignored in this paper but may hold the key for characterizing life forms." (p.11)

生命の数量化指標として "Markov blanket のエントロピー" を提案。最終段落では **石 (low entropy) vs 生命 (space-filling attractor)** の対比を挙げ、生命は単に低エントロピーではなく「限られた状態を反復訪問する attracting set」であると示唆。

## 4. 方法論

4 層の方法論:

1. **形式層 (Sec 2 Heuristic proof)**:
   - 5-tuple $(\Omega, \Psi, S, A, \Lambda)$ で状態空間を partition
   - Fokker–Planck eq. (式 2.2) の定常解 $p(x|m) = \exp(-G(x))$ から flow を導出
   - Helmholtz decomposition で flow を antisymmetric + scalar gradient に分解 (式 2.3)
   - ergodic 密度の対数勾配降下 (式 2.5–2.6) が **variational free energy 最小化** と等価 (Lemma 2.1, 式 2.7–2.9)

2. **シミュレーション層 (Sec 3.1–3.2)**:
   - 128 個の coupled subsystem
   - 電気化学状態: Lorenz dynamics（rate parameter $\kappa^{(i)} = \frac{1}{32}(1 - \exp(-4U))$ で異質化）
   - Newton 運動: 逆二乗反発 + 二次引力 + 粘性 (式 3.3)
   - 1/3 の部分系を "functionally closed"（電気化学影響を受けないが、物理運動は生きる）
   - 積分: Euler forward、step size 1/512 s、2048 s 走行

3. **Markov blanket 同定層 (Sec 3.3)**:
   - 隣接行列 $A$ は最後の 256 s で一度でも隣接（距離 1 未満）した部分系ペアを記録
   - $B = A + A^T + A^T A$ を計算
   - Perron–Frobenius 主固有ベクトルの top 8 = 内部状態
   - その Markov blanket（$[B \cdot \chi]$）を感覚 / 行動に再分割（外部状態の子か否かで判定）

4. **active inference 検証層 (Sec 3.4)**:
   - 内部 functional 状態の SVD で 32 主 eigenvariate を抽出
   - 時間埋め込み（lag ±16 s）後、外部 82 subsystem の位置を canonical variates analysis で予測
   - Wilks' lambda → $\chi^2$ → null permutation で有意性（flip external in time）

5. **autopoiesis 検証層 (Sec 3.5)**:
   - Markov blanket の任意の部分（action / sensory / internal）を lesion（物理接続は残すが、機能接続を切断）
   - 512 s 後の trajectory を Figure 5 で可視化
   - normal (a) vs lesioned (b/c/d) を比較

## 5. 5段階との対応候補

D20 は「法-政治」領域だが、manifest のメタ情報（Stage 2-5）は **"自律性 = 境界と推論と束の統合"** を形式化する論文として扱うことを意図している。5 段階のいずれも数学的 rigorosity で強くカバーされる。

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | **状態空間 $(\Omega, \Psi, S, A, \Lambda)$ + ergodic density $p(x|m)$ + random global attractor** が「場」を提供。ergodicity は「時間平均と状態空間平均の一致」であり、場の確率測度を定義する条件。simulation では 128 部分系の position × electrochemical 状態空間がそのまま「場」 | 強 | Table 1 (p.2) の 5-tuple 定義; "the system is ergodic it will, after a sufficient amount of time, converge to an invariant set of states called a pullback or random global attractor" (p.3); "biological systems are ergodic [26]: in the sense that the average of any measure of their states converges over a sufficient period of time" (p.5) |
| 2 波 (Wave) | **確率微分方程式 $\dot{x} = f(x) + \omega$** (式 2.1) と Fokker–Planck 方程式 (式 2.2) による **確率密度の時間発展**。シミュレーションでは Figure 2 の 2048 s 時系列が **位置と電気化学状態の波打ち** を可視化 (Lorenzian dynamical bursting) | 強 | "The associated ergodic density $p(x|m)$ is the solution to the Fokker–Planck equation (a.k.a. the Kolmogorov forward equation) [31] describing the evolution of the probability density over states" (p.3, 式 2.2); "transient synchronization can be seen as waves of dynamical bursting (due to the nonlinear coupling in equation (3.2))" (p.6); Figure 2(b,c) 時系列プロット |
| 3 縁 (Relation) | **Markov blanket こそ D20-S16 の核心**。感覚 + 行動状態が内部と外部を統計的に分離する「境界」を形成。形式的には「行動状態は外部状態の child ではない」「感覚状態は内部状態の child ではない」という conditional independence。この境界が生命性の**必要条件**として提示される | 強 | "A Markov blanket is a set of states that separates two other sets in a statistical sense." (p.2); "The Markov blanket can itself be partitioned into two sets that are, and are not, children of external states. We will refer to these as surface or sensory states and active states" (p.2); "if the coupling among an ensemble of dynamical systems is mediated by short-range forces, then the states of remote systems must be conditionally independent. These independencies induce a Markov blanket" (Abstract, p.1); Figure 3 で blanket の空間的出現を可視化 |
| 4 渦 (Vortex) | **循環因果性（circular causality）による action–perception cycle**。内部状態は感覚を通じて更新され、行動を通じて外部状態に循環的に作用する。この **rotational, solenoidal flow** が渦の本質であり、式 (2.5) の flow 分解と Helmholtz decomposition (式 2.3) が数学的表現を与える。simulation の Figure 3 で active/sensory が内部の周囲を "small loop structure with a little cilium" として**渦状に**配置される | 強 | "the dependencies induced by Markov blankets create a circular causality that is reminiscent of the action–perception cycle" (p.2); "This is the Helmholtz decomposition (a.k.a. the fundamental theorem of vector calculus) and can be formulated in terms of an antisymmetric matrix $R(x) = -R(x)^T$ and a scalar potential $G(x)$ we will call Gibbs energy" (p.3, 式 2.3); "the flow of internal and active states is essentially a (circuitous) gradient ascent on the (log) ergodic density. The gradient ascent is circuitous because it contains divergence-free (solenoidal) components that circulate on the isocontours of the ergodic density—like walking up a winding mountain path" (p.3) |
| 5 束 (Bundle) | 自己組織化の出力としての **"quasi-crystalline arrangement of the internal states and the Markov blanket"**（Figure 5a）。内部 (青) + 感覚 (マゼンタ) + 行動 (赤) + 外部 (cyan) の 4 種が機能的に結合した **cellular bundle**。lesion 実験で示される通り、この束は能動的な free energy minimization によって**常時維持**されている「動的な束」 | 強 | "a clear structure can be seen, where the internal subsystems are (unsurprisingly) close together and enshrouded by the Markov blanket. Interestingly, the active subsystems support the sensory subsystems that are exposed to hidden environmental states. This is reminiscent of a biological cell with a cytoskeleton that supports some sensory epithelia or receptors within its membrane." (p.7); "a preserved and quasicrystalline arrangement of the internal states and the Markov blanket" (Figure 5a caption, p.10); "self-organized dynamics are necessary to maintain structural or configurational integrity" (Figure 5 caption) |

**判定基準**: 全段階「強」。特に **縁 (stage 3)** と **渦 (stage 4)** の数学的定式化は D20 領域全体で最上位の厳密度。**束 (stage 5) は lesion による oscillator death 実験**で「束が維持されなければ崩壊する」ことを数値的に示す点で他の源泉にない実験的証拠をもつ。Markov blanket 論は autopoiesis (Maturana–Varela) の形式化であり、好個の regulator (Conant–Ashby) の拡張であり、good regulator theorem と autopoiesis と active inference を**同一の変分自由エネルギー最小化**で統一する。D20 領域が扱う「自律性 = 境界をもち、自己を維持する系」の理論基盤として決定的。

## 6. 限界・留意事項

- **heuristic proof であり厳密な数学証明ではない**: 著者自身 "heuristic proof" と明記。ergodicity の仮定、Fokker–Planck の滑らかさ、Markov blanket の exact 性などは idealized assumption。厳密化は Friston 以降の後続研究（Friston et al. 2021 "Path integrals" 等）で進行中
- **locally ergodic という但し書き**: "biological systems are only locally ergodic. The implication here is that self-organized systems cannot endure indefinitely and are only ergodic over a particular (somatic) timescale" (p.11)。生命の有限性・死亡性を理論は内包するが、本稿では扱わない
- **128 subsystems は小規模な証明原理**: 実細胞は $\sim 10^{14}$ atoms。スケール則が成り立つかは未検証
- **Lorenz dynamics という特殊選択**: "The Lorenz form for these dynamics is a somewhat arbitrary choice" (p.6)。他の chaotic dynamics でも同じ Markov blanket 出現が再現されるかは open question
- **active inference の経験的検証は $p = 0.00052$**: 有意だが effect size は小（82 external subsystem 中 5 個）。predictable なのは peripheral subsystem に偏る（internal からの距離が大きいほど予測性高い、Fig. 4d）。これは「感覚受容体は末梢にある」事実と整合するが、理論的予測は本稿になし
- **Markov blanket の uniqueness 問題**: "is there a unique Markov blanket for any given system? Our simulations focused on the principal Markov blanket—as defined by spectral graph theory. However, a system can have a multitude of partitions and Markov blankets" (p.10)。principal blanket の選択は spectral 法依存で、他の基準では別の blanket が現れる可能性
- **evolution / 遺伝への拡張は speculative**: 最終節で「長時間スケールで free energy minimization は適応・進化と等価かも」と述べるが、本稿では扱わない。cross-generational transmission は未扱い
- **複製 (reproduction) を扱わない**: 論文冒頭 "This contrasts with other treatments that consider the capacity of living organisms to reproduce by passing genetic material to their offspring" (p.10)。**血統/genealogy という D04 的側面**は理論の外部
- **"minimum entropy Markov blanket = 生命" 仮説は提案のみ**: "One might conjecture..." (p.10) で語られる程度。数値検証は未実施
- **シミュレーションコード非公開**: "the code for these simulations and the figures in this paper are available as part of the SPM academic freeware"。再現は SPM 環境依存

## 7. 未読解セクション（部分読解の場合）

全 12 頁精読完了。References (p.11-12) は主要理論的先行研究のみ読了（Schrödinger 1944, Conant & Ashby 1970, Maturana & Varela 1980, Friston 2010/2012, Ashby 1947, Turing 1952, Huygens 1673 oscillator sync 他）。詳細 references 62 本は必要に応じて個別参照。

補助資料（Appendix / Supplementary figures）は本論文にはなし（本体 12 頁完結）。SPM simulation code は外部リポジトリ依存だが、本稿の主張・図表・証明は本文 + Fig. 1-5 で自己完結。
