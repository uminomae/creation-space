# Paths to Self-Organized Criticality

**source_id**: D29-S11 | **domain_id**: D29
**access_status**: raw-confirmed
**読解日**: 2026-04-24 | **読解者**: claude-opus-4-7
**読解方法**: Read (PDF, image mode)
**原典ページ数**: 23 (arXiv v2) | **読解ページ範囲**: p.1-18（本文: Abstract / I. Introduction / II. A Simple Example / III. ARW and Sandpiles / IV. Other Paths to SOC / V. SOC and the Real World / VI. Summary + Acknowledgements）+ p.19 References 冒頭、計 19 頁精読（残 4 頁は全 references p.19-23）

---

## 1. 書誌情報

- **著者**: Ronald Dickman (UF de Minas Gerais, Brazil), Miguel A. Muñoz (Institute Carlos I for Theoretical and Computational Physics, Univ. Granada, Spain), Alessandro Vespignani (ICTP Trieste, Italy), Stefano Zapperi (ESPCI Paris)
- **タイトル**: Paths to Self-Organized Criticality
- **出典**: *Brazilian Journal of Physics* 30, pp.27-41 (2000). arXiv preprint cond-mat/9910454 v2 (2000-05-25) — 公刊版と同内容
- **DOI**: 10.1590/S0103-97332000000100004
- **取得経路**: SciELO (www.scielo.br) は PDF 取得タイムアウト (curl exit 28) → **arXiv preprint (https://arxiv.org/pdf/cond-mat/9910454) で取得成功**（248KB、23 頁、v2 final）。arXiv は Braz J Phys 公刊版と同内容で、著者自身 "We present a pedagogical introduction" と明記
- **キーワード**: self-organized criticality; absorbing-state phase transitions; directed percolation; sandpiles; depinning; Bak-Sneppen; avalanches

## 2. 要旨（読んだ内容に基づく）

Dickman, Muñoz, Vespignani, Zapperi は **"SOC は自発的 / パラメタ自由ではない"** という強い主張を提示する pedagogical review を書く。Bak-Tang-Wiesenfeld (1987) 以来の「sandpile が自動的に critical point に到達する」という謎を、**conventional な absorbing-state phase transition と特別な駆動プロトコル（slow driving + 活動連動 dissipation）の組合せ**として再解釈する。具体的には: (1) 保存量 $\zeta$ (粒子密度) が absorbing-state 相転移を示す fixed-energy sandpile (FES) モデルから出発、(2) 系が absorbing configuration に落ちたときのみ粒子を infinitesimal rate $h \to 0^+$ で追加、(3) 活動中のみ境界で粒子を失う dissipation rate $\epsilon \to 0^+$、という「レシピ」により、系が必ず $\zeta \to \zeta_c$ の critical point に「固定」される仕組を明示。こうして **SOC = 駆動された conventional critical point** として自然に理解される。論文は Activated Random Walkers (ARW) = Manna sandpile、Bak-Tang-Wiesenfeld (deterministic) sandpile、driven interface (depinning transition)、Bak-Sneppen evolution model、Self-Organized Directed Percolation (SODP) の 5 つの代表例を、いずれも「conventional な absorbing-state / depinning 相転移を slow driving で SOC に変換する」という統一視点で re-derive。臨界指数は directed percolation universality class に属するか、別の universality class（ARW では保存 field との coupling のため）を示す。実験例としては Barkhausen noise (ferromagnetic domain walls)、superconductor flux lines、rice piles などが「真正な SOC 候補」として挙げられ、一方で通常の sandgrain、earthquakes、forest fires などは inertia や追加機構のため**理想 SOC から逸脱**する。結論は **"SOC refers neither to spontaneous or parameter-free criticality, nor to self-tuning. It becomes a useful concept for describing systems that, in isolation, would manifest a phase transition between active and frozen regimes, and that are in fact driven slowly from outside"**。D29 complexity science の中核概念 SOC を、mysterious な自発性から conventional な駆動現象へと de-mystify した決定的 review。

## 3. 主要主張（原文引用付き）

### 主張 1: SOC は absorbing-state phase transition + slow driving の組合せで生じる

> "In this paper we show that SOC is a phase transition to an absorbing state, a kind of criticality that has been well studied, principally in the guise of directed percolation." (Abstract, §I)
>
> "The genesis of self-organized criticality is a continuous absorbing-state phase transition. The dynamical system exhibiting the latter may be continuous or discrete, deterministic or stochastic, conservative or dissipative. To transform a conventional phase transition to SOC, we couple the local dynamics of the dynamical system to an external supervisor, or to a 'drive' (sources and sinks with rates {h})." (§VI Summary)

SOC の**核となる機構**を形式化する、論文最重要命題。

### 主張 2: SOC レシピ — 3 成分（conserved-density absorbing transition / 不活性時のみ infinitesimal 粒子追加 / 活動連動 dissipation）

> "The connection between activated random walkers and the Manna sandpile suggests the following recipe for SOC. Start with a system having a continuous absorbing-state phase transition at a critical value of a density ζ. This density should represent the global value of a local dynamical variable conserved by the dynamics. Add to the conservative local dynamics (1) a process for increasing the density in infinitesimal steps (ζ → ζ + dζ) when the local dynamics reaches an absorbing configuration, and (2) a process for decreasing the density at an infinitesimal rate while the system is active. Run the system until it reaches the stationary state; it is now ready to display scale invariance." (§III.A "A Recipe for SOC")

具体化された SOC レシピ。後の全節はこのレシピの変種（driven interface, Bak-Sneppen, SODP）を扱う。

### 主張 3: 系は必然的に $\zeta = \zeta_c$ に「ピン留め」される（機構の core）

> "In the presence of activity, then, ζ > ζ_c and dζ/dt < 0. In the absence of activity there is addition, but no loss of walkers, so ζ < ζ_c implies dζ/dt > 0. Evidently, the only possible stationary value for the density in the sandpile is ζ_c!" (§III)

この単純なフィードバック機構が SOC の「自己組織化」の正体。driving h と dissipation ε が活動の有無に連動することで、密度が臨界値に固定される。

### 主張 4: SOC は自発的 / パラメタ自由ではない — baby-sitter 議論

> "If we want to avoid building a supervisor or baby-sitter into the model, we had better say that addition goes on continuously, at rate h, and that SOC is realized in the limit h → 0+... We pay a price when we fire the baby-sitter: there is now a parameter h in the model, which has to be tuned to zero. Evidently, sandpiles don't exhibit generic scale invariance, but rather, scale invariance at a point in parameter space." (§III.B "Firing the Baby-Sitter")

BTW の original formulation には活動監視の「baby-sitter」が暗黙に存在する。これを取り除くと driving rate $h$ が現れ、**$h \to 0$ に tune する必要がある**。「パラメタ自由」は幻想で、SOC は**2 つのパラメタ (h, ε) を 0 に送る infinite time-scale separation**を要求する。

### 主張 5: driven interface depinning transition も同じレシピで理解される

> "Once again, we have transformed an absorbing-state phase transition (F = F_c) into SOC by driving the system at a rate approaching zero (V → 0). But there appear to be fundamental differences between sandpiles and driven interfaces. In the sandpile, but not in the driven interface, the order parameter is coupled to a conserved density. The sandpile, moreover, does not involve a quenched random field as does the driven interface. Despite these apparent differences, close connections have been suggested between the two kinds of model [15,49–51]." (§IV.A–B)

$\dot{H_i} = H_{i+1} + H_{i-1} - 2H_i + F - F_{p,i}(H_i)$ (§IV.A eq.6) — pinning force をもつ elastic interface。external force $F$ を $F_c$ に tune すれば depinning transition、$V \to 0$ の constant-velocity drive で SOC 化。**sandpile と同型の機構だが、pinning field (quenched random) が追加の複雑性**。

### 主張 6: Bak-Sneppen model も extremal dynamics による SOC の典型

> "Seen in this light, SODP bears some resemblance to the evolutionary dynamics represented, again in very abstract form, in the Bak-Sneppen model [6]. Here, the globally minimum fitness variable, along with its nearest neighbors, is replaced by a [0,1] random number at each time step. (If the x^i_j are associated with different species, then the appearance of a new species at site i affects the fitness of the 'neighboring' species in the community in an unpredictable way.) This is a kind of extremal dynamics, a scheme we've already encountered in the driven interface model" (§IV.C)

Bak-Sneppen の global minimum fitness 更新 = **extremal dynamics** は、SOC の order parameter 自体を 0 に tune する変種。sandpile の "activity がある → density 減少、activity がない → density 増加" と同型のフィードバック。

### 主張 7: Self-Organized Directed Percolation (SODP) は parameter-free だが別種

> "Remarkably, however, it is possible to define a parameter-free stochastic process whose stationary state reproduces the properties of critical DP [53–55]. This process, self-organized directed percolation (SODP), is obtained by replacing the discrete variables in Eq. (10) by real variables which store the value of one of the previous η^i_j." (§IV.C)
>
> "$x^{i+1}_j = \max\{\eta^i_j, \min\{x^i_{j-1}, x^i_{j+1}\}\}$" (eq. 11)
>
> "SODP doesn't fit into the same scheme as sandpiles or driven interfaces. It is a real-valued stochastic process that generates, by construction, the probability distribution of DP for all parameter values, including p_c. The process itself does not have a phase transition" (§IV.C)

SODP は「p パラメタがモデルから完全に消える」珍しい例だが、**一般物理系の説明にはならない**とされる — スカラー noise の役割を果たすメカニズムが自然界では考えにくい。

### 主張 8: 実験的 SOC 候補 — Barkhausen / type II superconductor / rice piles

> "The motion of domain walls in ferromagnets and flux lines in type II superconductors is overdamped, due to eddy-current dissipation; these systems are probably the cleanest experimental example of power-law distributed avalanches. The noise produced by domain wall motion is known as the Barkhausen effect, first detected in 1919 [71]... We recognize here the recipe for SOC given in section IVA: in the limit c → 0 and k → 0 we expect to reach the critical point. This fact was indeed verified in experiments" (§V)
>
> "A ricepile was carefully studied in Oslo: elongated grains poured at very small rate gave rise to a convincing power-law avalanche distribution [70]." (§V)

**SOC の成立条件（inertia が無視できる overdamped dynamics）を満たす実験系**として、Barkhausen noise (Sivert 1919 [71])、type II superconductor flux lines、rice piles（Oslo 実験 [70]）が挙げられる。他方、通常の砂山は inertia のため first-order transition に落ち、SOC 的 power-law にならない。

### 主張 9: 理論と実験を通底する universality class の観点

> "Numerical results indicate that sandpiles, driven interfaces, and the Bak-Sneppen model define a series of new universality classes." (§IV 末尾)

DP (directed percolation) が基本 universality class だが、**保存 field がある場合（sandpiles, ARW）は別 class**（Muñoz, Vespignani, Zapperi らの後続研究 [9,41-43] を参照）。universality class の分類は phase transition 理論の本丸で、SOC をその下位現象として位置付けることが本論文の貢献。

### 主張 10: 結論 — SOC は神秘ではなく「外部駆動された conventional 臨界現象」

> "Viewed in this light, 'self-organized criticality' refers neither to spontaneous or parameter-free criticality, nor to self-tuning. It becomes, rather, a useful concept for describing systems that, in isolation, would manifest a phase transition between active and frozen regimes, and that are in fact driven slowly from outside." (§VI Summary)

SOC に対する pedagogical な再解釈の要約。神秘性（spontaneity / parameter-freeness / self-tuning）は否定され、代わりに **"active/frozen 相転移 × 外部からの slow driving"** という明晰な説明が与えられる。

## 4. 方法論

1. **formal 層 (§II-III)**: Activated Random Walkers (ARW) を具体例として提示
   - Lattice sites $j$、site 変数 $z_j \in \{0, 1, 2, ...\}$、Markovian sequential dynamics
   - 活動 site ($z_j \geq 2$) は rate 1 で 2 個の walker を隣接 site に分配
   - Mean-field: $d\rho_z/dt = \rho_a(\rho_{z-1} - \rho_z) + (1/2)\rho_a(\rho_{z-2} - \rho_z) + \rho_{z+2} - \theta_{z-2}\rho_z$ (eq.1)
   - absorbing-state phase transition at $\zeta_c = 0.9486$ (1D) / 0.7169 (2D)、active-site density $\rho_a \sim (\zeta - \zeta_c)^\beta$ with $\beta \approx 0.43$

2. **"レシピ" 層 (§III.A)**:
   - ARW に (a) open boundary（粒子が境界から失われる、dissipation rate $\epsilon \propto L^{-1}\rho_b$）、(b) 系が不活性時のみ粒子追加（rate $h$）、の 2 修正を加えると **Manna SOC sandpile** に一致
   - $h/\epsilon \to 0$ の infinite time-scale separation で scale invariance が出現

3. **普遍化 層 (§III.C-D)**: レシピの自由度
   - loss は境界に限らず uniform dissipation でも可（Vespignani-Zapperi [9, 34]）
   - directed hopping → exactly-soluble sandpile [35]
   - deterministic dynamics → BTW sandpile [5]
   - forest-fire model [37,38] は conserved field を持たないが double slow driving $f, p \to 0, f/p \to 0$ で SOC 化

4. **driven interface 層 (§IV.A-B)**:
   - 粘性の elastic interface $\gamma \dot{H_i} = H_{i+1} + H_{i-1} - 2H_i + F - F_{p,i}(H_i)$ (eq.6)
   - constant-force $F$ での depinning transition at $F_c$
   - constant-velocity $dH_i/dt = v$ + $v \to 0$ で SOC 化 (eq.7)
   - BTW sandpile は driven interface の height representation で同型（Narayan-Middleton [15]）

5. **Bak-Sneppen 層 (§IV.C)**:
   - globally minimum fitness $x_j$ + 隣接 site を $[0,1]$ 一様乱数で置換
   - 局所版 (eq.13-16): rate $\Gamma e^{-\beta x_j}$ で 3-site flip、$\beta \to \infty$ 極限が Bak-Sneppen
   - 定常分布に step-function singularity が現れ、これが SOC 的

6. **SODP 層 (§IV.C)**:
   - site directed percolation を real-valued $x^i_j$ で再実装、$x^{i+1}_j = \max\{\eta^i_j, \min\{x^i_{j-1}, x^i_{j+1}\}\}$ (eq.11)
   - 定常密度 $\mu(x)$ が $x_c$ で特異点、DP の臨界値を**自動的に発見**する

7. **実験 層 (§V)**: Barkhausen noise、superconductor flux lines、rice piles (Oslo)、fracture、martensitic transformation、earthquakes、forest fires を SOC 候補として批判的レビュー

## 5. 5段階との対応候補

D29「複雑性科学」は自己組織化・emergent pattern formation を扱う。SOC は**臨界点への自発的到達**として古典的に語られるが、本論文はこれを **"場 × 波 × 縁 × 渦 × 束" の統一機構**として明示的に分解する。全 5 段階が強く現れ、特に **縁 × 渦** の接続が鮮明。

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | **格子上の粒子場 / 高さ場 / 界面場**が場を定義。conserved density $\zeta$、activated random walker の粒子数 $z_j$、BTW sandpile の height $H_i$、driven interface の位置 $H_i(t)$。場の構造が universality class を決める | 強 | "We begin with a simple model of activated random walkers (ARW). Each site j of a lattice (with periodic boundary conditions) harbors a number $z_j = 0, 1, 2, \ldots$ of random walkers." (§II); "We can write a set of equations for the fraction of sites with occupation z and $\rho_a = \sum_{z\geq 2} \rho_z$ is the fraction of active sites" (§II); "Consider the BTW fixed-energy sandpile in two dimensions; let $H_i(t)$ be the number of times site i has toppled since time zero." (§IV.B) |
| 2 波 (Wave) | **Avalanches = 波の伝播**。臨界点での power-law 分布 $P(s) \sim s^{-\tau}$、$\tau_s = 1.10(2)$、fractal dim $D = 2.21(1)$。活動の伝播が scale-invariant に全スケールで起こる。分岐・合流・消失の時空パタンが波動的 | 強 | "In the limit of infinitely slow input, the system displays a highly fluctuating, scale-invariant avalanche-like pattern of activity." (§I); "the Manna sandpile reaches a stationary state in which avalanches occur on all scales, up to the size of the system, and follow a power-law distribution, $P(s) \sim s^{-\tau}$" (§III); "The distribution follows a power law, $P(s) \sim s^{-\tau_s}$, over a wide range of avalanche sizes and durations; there is, as expected, an exponential cutoff $s_c \sim L^D_s$ for events larger than a characteristic value associated with the finite size of the lattice. (Our best estimates are $\tau_s = 1.10(2)$ and $D = 2.21(1)$.)" (§III) |
| 3 縁 (Relation / Boundary) | **Open boundary でのみ dissipation が起こる** — 縁が系を臨界へ引き寄せる要。+ $h \to 0$ の external drive (inflow) と $\epsilon \to 0$ の境界 loss の**二重極限**が SOC 成立条件。**無限時間スケール分離**が境界の本質 | 強 | "The latter implies a loss rate $d\zeta/dt \propto -L^{-1}\rho_b$, where $\rho_b$ is the activity density at the boundary sites." (§III.A); "Loss is typically restricted to the boundaries, so that $\epsilon \to 0$ is implicit in the infinite-size limit." (§I); "This parameter tuning corresponds, once again, to an infinite time-scale separation." (§IV.A); "Grinstein's definition of SOC, which requires an infinite separation of time scales from the outset [1]" (§III.B) |
| 4 渦 (Vortex) | **系が自発的に $\zeta_c$ に「吸い寄せられる」フィードバック機構**。活動あり → 密度減少、活動なし → 密度増加。この **non-intentional な self-tuning ループ** が渦の本質。extremal dynamics (Bak-Sneppen) も同様に order parameter を 0 に自動調整する。**"system is attracted to a critical (scale-invariant) stationary state"** という表現が渦そのもの | 強 | "the only possible stationary value for the density in the sandpile is ζ_c!" (§III); "In the infinite-size limit, the stationary activity density is zero for ζ < ζ_c, and positive for ζ > ζ_c, ensuring that ζ is pinned at ζ_c, when loss is contingent upon activity, and addition upon its absence." (§III); "we restrict the term to systems that are attracted to a critical (scale-invariant) stationary state" (§I); "in extremal dynamics we are directly adjusting the order parameter" (§IV.C) |
| 5 束 (Bundle) | **臨界定常状態 = 無限次元の束**。scale-invariant な avalanche 分布を生成する無数の microscale configuration が束として存在。universality class（DP vs 保存場あり vs Bak-Sneppen 型）が束の分類を与える。実験系での Barkhausen/superconductor/rice pile は同じ universality class に収束 | 強 | "the system reaches a critical (scale-invariant) stationary state; the chief examples are sandpile models" (§I); "Numerical results indicate that sandpiles, driven interfaces, and the Bak-Sneppen model define a series of new universality classes." (§IV 末尾); "Viewed in this light, 'self-organized criticality' refers neither to spontaneous or parameter-free criticality, nor to self-tuning. It becomes, rather, a useful concept for describing systems that, in isolation, would manifest a phase transition between active and frozen regimes, and that are in fact driven slowly from outside." (§VI); "the motion of domain walls in ferromagnets and flux lines in type II superconductors is overdamped... these systems are probably the cleanest experimental example of power-law distributed avalanches" (§V) |

**判定基準**: 全段階「強」。D29 complexity science の中核概念 SOC を、**conventional phase transition の駆動変種として de-mystify する決定的レビュー**。D29-S10 Hordijk の RAF（静的組合せ論的 closure）と対照的に、本論文は**動力学的な self-tuning 機構**を形式化する。両者は complexity の "境界 × 循環" の 2 つの顔（組合せ論的触媒閉包 vs 力学系的臨界引力）を記述し、相補的。Bak 1996 *How Nature Works* の「万物は SOC」言説を批判的に抑制する点で、**SOC 概念を成熟させた節目**の論文。

## 6. 限界・留意事項

- **Review 論文であり original simulation は限定的**: 本論文の数値結果（$\tau_s = 1.10(2)$, $D = 2.21(1)$, $\zeta_c$ 値など）は先行研究の整理。独自結果は 1D Manna sandpile の sequential-dynamics 版がほぼ唯一
- **SOC の universality class 理論は未完成**: "no one has been able to derive the critical exponents of avalanches in SOC sandpiles, even in the abelian case" (§IV 末尾)。理論的 derivation は本論文の 2000 年時点で未解決
- **実験的 SOC 候補は限定的**: §V で挙がるのは Barkhausen、superconductor flux lines、rice piles の 3 候補のみ。sand grain、earthquakes、biological evolution などへの SOC 適用は**限定的 / 不適切**と厳しく判定
- **SODP は "artificial" — 物理的対応物なし**: "SODP doesn't fit into the same scheme as sandpiles or driven interfaces... [it] seems a much less realistic description of a physical system" (§IV.C)。parameter-free だが実際の物理系の説明力は低い
- **"generic" scale invariance との関係が不明**: Grinstein [1,2] は "nonzero measure の parameter region で臨界性" と定義するが、本論文は「点で臨界性」を強調。両者の対立は未解決
- **discrete vs continuous dynamics の等価性**: sequential ARW、parallel Manna、deterministic BTW が全て同じ universality class かは本論文時点で未証明（"finite-size scaling" として観察）
- **conserved density の役割**: ARW/Manna は保存量あり、contact process は保存量なし。両者が異なる universality class になるが、保存則の本質的役割は部分的にしか理解されていない
- **inertia と power-law の成立**: §V で「inertia が negligible な overdamped dynamics のみ SOC 的」としているが、具体的な inertia の影響についての理論は不十分
- **arXiv 版と公刊版の同一性**: 本読解は arXiv v2 (May 2000) で行ったが、Braz J Phys 掲載版 (Vol. 30, pp.27-41) と内容同一か完全には未照合。ただし arXiv 末尾の acknowledgements と DOI metadata から同一と判断
- **2000 年時点の限界**: 以降の後続研究（Muñoz et al. 2018 D29-S13 で扱う "criticality in living systems" への拡張、Watkins 2016 D29-S05 の 25 years 回顧）で本論文の視点は深化・一部修正されている

## 7. 未読解セクション（部分読解の場合）

- **References (p.19-23, 約 94 本)**: 主要参照は読解範囲で把握済（Grinstein [1,2], Bak-Tang-Wiesenfeld [5], Bak-Sneppen [6], Manna [7], Dickman-Vespignani-Zapperi 前駆論文 [9], Dhar review [11], Muñoz 前駆論文 [18]）。全 refs 94 本は必要に応じて個別参照
- **arXiv v1 vs v2 の差分**: 本読解は v2 (2000-05-25)。v1 (1999-10) との差分は未確認だが、abstract 末尾 "We review the status of experimental realizations of SOC in light of these observations" の経緯から v2 が公刊最終版と判断

主要論点（SOC レシピ / 5 つの path / universality class / 実験批判 / de-mystification 結論）はすべて精読で把握。本論文の主張体系は内部で完結し、未読 references は parameter exponents の詳細計算を除き本質的理解に不要。
