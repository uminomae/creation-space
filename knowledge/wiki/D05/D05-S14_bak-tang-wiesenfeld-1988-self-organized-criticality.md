# Self-Organized Criticality (Bak-Tang-Wiesenfeld 1988 PRA)

**source_id**: D05-S14 | **domain_id**: D05
**access_status**: url-verified
**読解日**: 2026-04-15 | **読解者**: Claude Opus 4.6 (1M context)
**読解方法**: WebFetch (psychsafety.com, ResearchGate 経由) → Read (PDF)
**原典ページ数**: 11 頁 (PRA 38(1) p.364-374) | **読解ページ範囲**: 全頁

---

## 1. 書誌情報（citation mismatch 警告あり — §6 を参照）

- **著者**: Per Bak, Chao Tang, Kurt Wiesenfeld (Department of Physics, Brookhaven National Laboratory, Upton, New York 11973)
- **タイトル**: Self-organized criticality
- **出典**: *Physical Review A*, Vol.38 No.1 (July 1, 1988), pp.364-374. Received 28 August 1987
- **DOI / URL**: https://doi.org/10.1103/PhysRevA.38.364 / https://psychsafety.com/wp-content/uploads/2025/04/SOC.pdf
- **manifest の記載との差異**: manifest には「Bak, P., Tang, C. & Wiesenfeld, K. (1987). Self-organized criticality: An explanation of the 1/f noise. *Phys Rev Lett* 59(4), 381-384」とあるが、実際の PDF は 1988 年の Physical Review A 38(1) 拡張論文である。両者は同一著者・同一テーマで、1987 PRL は 4 ページのレターで結果の announcement、1988 PRA が計 11 ページの詳細論文という関係。1988 PRA は PRL 版を引用しつつ、より詳しい数値シミュレーション結果とスケーリング解析を含む

## 2. 要旨（読んだ内容に基づく）

Bak, Tang, Wiesenfeld は、多数の等価な自由度を持つ散逸動力学系が、外部からの微調整なしに **臨界状態 (critical state)** へと自己組織化することを、2 次元・3 次元のセルオートマトン「砂山模型 (sand-pile automaton)」を用いて示した。臨界状態は (i) 空間的な fractal 構造、(ii) スケール不変な power-law クラスタサイズ分布、(iii) 時間的 "fingerprint" としての flicker noise (1/f noise) の出現、という三位一体的特徴を持つ。2D 50×50 格子では cluster size 指数 τ ≈ 1.0、lifetime 指数 α ≈ 0.43、power spectrum 指数 β ≈ 1.57 が得られ、3D 20×20×20 格子では τ ≈ 1.37、α ≈ 0.92、β ≈ 1.08 が得られた (Sec.III.B, p.368-369)。閉境界（closed boundary）の場合は完全な 1/f noise は現れないが、開境界（open boundary）に変えると 2D で α ≈ 1.05, β ≈ 0.95 という真の 1/f スペクトルが得られる (Sec.III.C, p.372)。SOC は平衡相転移理論とは独立に、散逸的に駆動される open system が結合された nonlinear dynamics を示すときに生じる普遍現象であり、地震・1/f noise・乱流・自然界の自己相似性などを統一的に説明しうる「動的分類」の候補と位置付けられる (Sec.IV, p.373)。

## 3. 主要主張（原文引用付き）

### 主張 1: ある散逸動力学系は臨界状態へ自己組織化する

> "We show that certain extended dissipative dynamical systems naturally evolve into a critical state, with no characteristic time or length scales. The temporal 'fingerprint' of the self-organized critical state is the presence of flicker noise or 1/f noise; its spatial signature is the emergence of scale-invariant (fractal) structure." (Abstract, p.364)

冒頭の abstract が本論文の命題を最も簡潔にまとめている。散逸的・extended・dynamical の 3 条件を満たすシステムは、チューニングなしに critical state に evolve するという強い一般化主張である。

### 主張 2: 1/f noise と fractal 構造は互いに分離できない「自己組織化臨界性」の二面である

> "We believe that the concept of self-organized criticality can be taken much further and can be the underlying concept for temporal and spatial scaling in dissipative nonequilibrium systems. One of our models [with closed boundary conditions] could be considered a toy model of generalized turbulence, with dissipation correlated on all length scales. Of course, there is no direct connection with (for instance) the Navier-Stokes equation, where the metastability is due to the storage of kinetic energy in vortices, not potential energy as is made discussed here." (Sec.I, p.365)

> "Flicker noise, or 1/f noise, is characterized by a power spectrum S(f) with low-frequency divergence f^(-φ) with roughly unity equal to 2-1." (Sec.I, p.364)

Sec.I で Bak-Tang-Wiesenfeld は、1/f noise という時間的普遍性と、fractal 空間構造という空間的普遍性を同一機構で説明することの理論的重要性を強調する (p.364-365)。

### 主張 3: 砂山模型 (sand-pile automaton) が最小モデルである

> "Figure 1(a) shows a model of a one-dimensional sand pile of length N. The boundary conditions are such that sand can leave the system at the right-hand side only. We may think of this arrangement as half of a symmetric sand pile with both ends open. The numbers z_n represent height differences, z_n = h(n)−h(n+1), between nearest neighbor positions along the sand pile." (Sec.II, p.365)

1D モデルの定義 (eq.2.1-2.2, p.366):

> "When the height difference becomes higher than a fixed critical value z_c, one unit of sand tumbles to the lower level, i.e.,
> z_n → z_n − 2,
> z_{n±1} → z_{n±1} + 1    for z_n > z_c;" (eq.2.2, p.366)

2D への拡張 (Sec.III.A, eq.3.1, p.367):

> "z(x, y) → z(x, y) − 4,
> z(x, y±1) → z(x, y±1) + 1,
> z(x±1, y) → z(x±1, y) + 1,   for z(x, y) > z_c," (eq.3.1, p.367)

この非線形離散拡散方程式は「sand」ではなく「energy, water, light, electrons など transport される量」としても解釈可能だと著者は明記する (Sec.II, p.366)。

### 主張 4: 最小安定状態 (minimally stable state) は大域的な摂動反応の単一体を形成する

> "If sand is added randomly from an empty system, the pile will build up, eventually reaching the point where all the height differences z_n assume the critical value z_n = z_c. This is the least stable of all the stationary states. Then, any additional sand simply falls from site to site (left to right) and falls off at the end n=N, leaving the system in the minimally stable state. Alternatively, if one pushes one unit downwards it will also continue its fall until it reaches the edge. In the pendulum picture, this corresponds to kicking one pendulum in the forward direction. This will cause the force on the two nearest-neighbor pendula to exceed the critical value and the perturbation will propagate by a domino effect until it hits the ends of the array. At the end of this process the forces are back to their original values and all pendula have rotated one full period." (Sec.II, p.366)

> "In other words, the effect of a small local perturbation is communicated throughout the system, but the system is robust with respect to noise insofar as it returns to the globally minimally stable state. If units are added randomly, the resulting sandflow is also random white noise, i.e., with power spectrum 1/f^0. As we shall see in the next section, the robustness of the minimally stable state is lost in two and higher dimensions and their dynamics are dramatically different." (Sec.II, p.366-367)

1D では外乱が端まで伝播して元の状態に戻るので 1/f は生まれない。2D 以上で構造が破綻する点が鍵 (Sec.II → Sec.III 遷移)。

### 主張 5: 2D/3D で冪乗クラスタ分布 (power-law cluster distribution) が現れる

閉境界 2D 50×50 格子でのシミュレーション結果 (Sec.III.B, p.368):

> "Figure 3(a) shows the results for the distribution function D(s) for a 50×50 array, averaged over 200 samples. The log-log plot follows a pretty respectable straight line, with slope −1.0, i.e.,
> D(s) ≈ s^(−τ),  τ ≈ 1.0 for D = 2 ." (eq.3.3, p.368)

> "Indeed, in three-dimensional (3D) simulations on a 20×20×20 array, Fig. 3(b) once again finds a power law, but now D(s) ≈ s^(−1.37). At small sizes the curve deviates from the straight line because discreteness effects of the lattice come into play." (Sec.III.B, p.368)

cluster size の分布は D=2 で τ≈1.0、D=3 で τ≈1.37 となる (eq.3.3)。

### 主張 6: cluster の寿命分布もまた power-law で、その指数は 1/f noise と結ばれる

> "We now consider the response to a situation where the system is locally perturbed randomly in space and time [...] The total number of slidings F(t) at time t (the total cluster size of the cluster) represents the (instantaneous) growth rate. [...] The idea that a distribution of relaxation times T, operating simultaneously and independently, leads to 1/f noise is an old one, originally due to van der Ziel." (Sec.III.B, p.369)

> "D(T) = T^(−α),
> α ≈ 0.43 for D = 2,  α ≈ 0.92 for D = 3." (eq.3.4, p.369)

> "S(f) = f^(−β+1/T_c),
> β ≈ 1.57 for D = 2,  β ≈ 1.08 for D = 3." (eq.3.7, p.370)

2D 閉境界では β≈1.57 で真の 1/f ではなく 1/f^1.57 ("flicker noise 様" だが divergent) であり、3D でもやや 1/f から外れる (eq.3.7)。

### 主張 7: 開境界にすれば真の 1/f noise が現れる

> "In this set of simulations we consider an 'open-ended' system where particles are transported through the system and are allowed to leave the box at the two edges x=N and y=N. The idea is to simulate a situation resembling some of the systems known to have 1/f noise. In the hour glass, sand is transported through the system; in quasars (and in the case of sunspots) light is transported through an open-ended system, and in the case of rivers, water is transported." (Sec.III.C, p.371)

> "Figure 10 shows D(T) for a 2D system of size 75×75. Again the distribution follows a power law for a decade or so, this time with exponent equal to unity, α ≈ 1.05. The distribution on lifetimes translates directly into a power-law frequency spectrum
> S(f) ≈ f^(−β),  β ≈ 0.95 ." (eq.3.13, p.372)

開境界 2D 75×75 では α ≈ 1.05, β ≈ 0.95 となり、**真の 1/f に極めて近い値が得られる** (Sec.III.C, p.372)。閉境界では得られなかった 1/f が、開境界への変更だけで実現することは、1/f noise が自然界の dissipative transport 系と不可分であるという主張を補強する。

### 主張 8: 指数間の scaling relation が成立する

> "The exponents τ and α representing the spatial and temporal evolution of the clusters, respectively, can be related through 'scaling relations.' If the perturbation grows with an exponent γ within the clusters, the lifetime T of a cluster is related to its size by
> s ≈ T^(1+γ) ." (eq.3.9, p.371)

> "The scaling laws
> α = 2 − β = (γ+1)τ − 2γ (3.11)
> can be directly read off Eqs. (3.7) and (3.10). Since we have measured α and τ independently, we can find the anomalous growth exponent γ from Eq. (3.11),
> γ ≈ 0.57 for D = 2,  γ ≈ 0.71 for D = 3." (eq.3.11, 3.9', p.371)

scaling relation は臨界現象の finite-size scaling 理論と類似しており、Sec.IV で「SOC は平衡相転移理論を非平衡に拡張する自然な一般化」という見方を支持する根拠となる。

### 主張 9: SOC は乱流・1/f noise・地震・雪崩などを統一的に説明する candidate である

> "In summary, our general arguments and numerical simulations show that dissipative dynamical systems with extended degrees of freedom can evolve towards a self-organized critical state, with spatial and temporal power-law scaling behavior. The spatial scaling leads to self-similar 'fractal' structure while the frequency spectrum in 1/f noise or flicker noise with a power-law spectrum S(f) ≈ f^(−β). Thus, in our picture 1/f noise is not noise but reflects the generic dynamics of extended dynamical systems. We found values of β tolerably close to one (and certainly between 0 and 2). It remains to be seen to what extent systems can be grouped into universality classes which share common universality dimension, and so on. We strongly suspect that the criticality discovered here cannot depend on the local details of the models, in analogy with equilibrium second-order phase transitions." (Sec.IV Summary, p.373)

> "Moreover, we conclude that 1/f noise is intimately related to the underlying spatial organization. This can be tested directly, for instance by measuring the frequency cutoff versus the system size." (Sec.IV, p.373)

最終節で著者は本論文の貢献を「1/f noise は 'noise' ではなく extended dynamical systems の generic dynamics を反映する動的構造」という再解釈として要約する。universal classes の存在も示唆される。

## 4. 方法論

- **セルオートマトン + 数値シミュレーション**: 1D/2D/3D の格子上で離散 (x,y,z) 配列と離散的な toppling rule (eq.2.2, eq.3.1, eq.3.12) を実装し、数千〜数万ステップの実行を繰り返して ensemble average を取る
- **境界条件の対比設計**: closed boundary (周期/壁) と open boundary (x=N と y=N で粒子が離脱) の 2 ケースを比較し、1/f の出現条件を切り分ける (Sec.III.B vs III.C, p.368-372)
- **cluster の定義と測定**: cluster = 一度の局所摂動がトリガーする「全連結雪崩」のこと。cluster size s は滑った回数の総和、lifetime T は摂動から沈静までの時間ステップ数 (Sec.III.B, p.369)
- **power spectrum F(t) 解析**: 雪崩を時間軸上に重ね合わせた F(t) の power spectrum S(f) を FFT で計算し、1/f に対応する β を直接測定 (Fig.6-7, p.371)
- **finite-size scaling**: D(T) = T^(−α) F(L^σ/T), D(s) = s^(−τ) F(L^d/s) という crossover scaling function を導入し、異なる格子サイズ L=10, 20, 30, 50 での収束を確認して系サイズ効果を排除 (eq.3.14-15, p.372, Fig.11)
- **既知分布との比較**: 臨界指数が universal かをチェックするため、25% のボンド除去 (quenched disorder) を行って同じ指数が得られることを確認 (Sec.III.B 末尾, p.371)。対応する flicker noise 仮説群 (van der Ziel 1950) との関係も批判的に整理
- **散逸の役割の強調**: SOC は保存的 (conservative) 系ではなく散逸的 (dissipative) 系で現れるという点を、open boundary 実験で直接示す

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | 砂山の初期状態（均一な低勾配平面）から「critical state」という特定の場への evolution 全体が、創造以前の場の立ち上がり構造に対応する | 強 | "If sand is added randomly from an empty system, the pile will build up, eventually reaching the point where all the height differences z_n assume the critical value" (Sec.II, p.366); "the critical state can be approached in a different way, which shows directly how the 1/f noise represents the intrinsic dynamics in a stationary dynamic system in the self-organized critical state." (Sec.III.B, p.370) |
| 2 波 (Wave) | 任意サイズのクラスタ (雪崩) 分布が power law で広がる構造は、あらゆる時間スケールの揺らぎが同時に存在するという Stage 2 の本質に強く対応する | 強 | "The presence of weak coupling does not alter this basic arithmetic. Surprisingly, our model evolves towards the very least stable of all these states." (Sec.I, p.365); eq.3.4 D(T) = T^(−α), eq.3.7 S(f) = f^(−β) |
| 3 縁 (Relation) | toppling rule は「隣接サイトへの局所転送」であり、雪崩は近傍縁を介して伝播する。cluster の空間構造 (Fig.2 の fractal domain) は縁のネットワークの実在化である | 強 | "the effect of a small local perturbation is communicated throughout the system" (Sec.II, p.366); "a local perturbation can grow to (some) nearest-neighbor sites, then to next-nearest neighbors, and so on in a 'domino' dying out after a total time T, having induced a total of s slidings" (Sec.III.B, p.369) |
| 4 渦 (Vortex) | 自己組織化のプロセスそのもの — チューニングなしに critical state という dynamical attractor に引き寄せられる構造 — は Stage 4 の核心。散逸的 open system が自ら中心に渦巻くように臨界に向かう | 強 | "certain extended dissipative dynamical systems naturally evolve into a critical state, with no characteristic time or length scales" (Abstract, p.364); "The system 'self-averages' over many configurations as time progresses, and no resetting is necessary." (Sec.III.B, p.370) |
| 5 束 (Bundle) | 複数の指数 τ, α, β, γ が単一の scaling relation α = 2 − β = (γ+1)τ − 2γ で束ねられ、空間的 fractal と時間的 1/f が単一の「critical state」概念に統合される | 強 | "These exponents are related through 'scaling relations.'" (Sec.III.B, p.371, eq.3.11); "1/f noise is intimately related to the underlying spatial organization" (Sec.IV, p.373) |

**判定基準**:
- **強**: 著者が直接その概念・構造を論じており、5段階の定義と明確に対応する
- **弱**: 構造的類似はあるが、著者の文脈・意図とは異なる読みである
- **なし**: 対応が見出せない。無理に作らない

**総合判定**: 本論文は統計物理学の基礎論文であり、創造プロセスの 5 段階モデルを論じる文書ではない。しかし、SOC という動的自己組織化の発見それ自体が 5 段階の全ステージ（場・波・縁・渦・束）に明示的対応を持つ稀有なケースである。D05 (地球科学 / 複雑系) 領域の中核理論として、地震・山火事・太陽フレア・neuronal avalanche などの普遍的冪乗則現象の統一枠組として位置付けられる。manifest ヒント「Stage 1-4: SOC 雪崩的自己組織化」に対して、本読解では Stage 5 にも強対応（scaling relation による統合）を認めた。

**manifest ヒントからの独立性**: manifest ヒントは Stage 1-4 を示唆するが、本読解では Sec.III.B 末尾の scaling relation (eq.3.11) が Stage 5 の束の構造に強く対応すると判定した。これはヒントに追従せず、原文の scaling analysis に基づく独立判定である。

## 6. 限界・留意事項

- **manifest との citation mismatch**: 本 raw/ に配置された PDF は 1988 Phys Rev A 38(1) 364-374 であり、manifest 記載の 1987 Phys Rev Lett 59(4) 381-384 ではない。両者は同一著者・同一トピックで、PRL 1987 が short letter、PRA 1988 が 11 頁の full article。wiki 本文は実際に読んだ 1988 PRA に基づく。manifest の source_id D05-S14 を PRA 1988 に差し替えるか、PRL 1987 を別途取得して別 source_id を立てるかは pjdhiro 判断
- **モデルの単純化**: 砂山モデルは実際の砂粒の物理ではなく「cellular automaton 的 toppling rule」。Sec.V で著者自身が "We cannot rule out that the exponent is identical to unity with the present numerical accuracy" など numerical な限界を認める (p.372)
- **scaling relation の適用範囲**: eq.3.11 は specific class of SOC models でのみ検証されている。より一般の dissipative nonequilibrium systems への外挿は著者も speculation と明言する (Sec.IV, p.373)
- **"quenched randomness" の実装**: Sec.III.B 末尾で 10-25% のボンド除去を行って exponent が不変であることを確認しているが、これは一つのランダム化方法でしかなく、異なる quenched disorder では異なる exponent が出る可能性を排除していない
- **定性的地震予測・1/f noise 一般論への拡張**: 著者は Sec.IV で「We can speculate that some such mechanisms may have played a part in regulating …」という suggestive な扱い。evidence として使う際、SOC → 地震予測 / 生命系の臨界性 / 金融クラッシュ 等の応用は、本論文からの直接含意ではなく後続研究 (Bak 1996, Munoz 2018 D29-S13 など) を介した派生である
- **1D モデルの扱い**: Sec.II で 1D は 1/f を示さないことが明示される。しかし 1D での minimally stable state の robust 性の観察は、2D/3D の挙動への bridging argument としては鍵
- **Per Bak 以降の批判的受容**: 本論文以降、SOC の「真の universality」に対する批判 (Jensen 1998, Pruessner 2012, Munoz 2018) が提起されてきた。本 wiki は原典の範囲に留まるが、「SOC は議論継続中」という現代的評価を念頭に置く必要がある

## 7. 未読解セクション（部分読解の場合）

全 11 頁 (PRA p.364-374) を完読した。Abstract、Sec.I Introduction、Sec.II One-Dimensional Case、Sec.III A/B/C (Self-Organized Criticality in Two and Three Dimensions, Closed boundary, Open boundary)、Sec.IV Summary and Discussion、Acknowledgment、References 15 件、Fig.1-11 すべて確認。eq.(2.1)-(3.15) の数式もすべて記録。
