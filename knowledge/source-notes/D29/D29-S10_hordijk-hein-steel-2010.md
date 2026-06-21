# Autocatalytic Sets and the Origin of Life

**source_id**: D29-S10 | **domain_id**: D29
**access_status**: raw-confirmed
**読解日**: 2026-04-24 | **読解者**: claude-opus-4-7
**読解方法**: Read (PDF, image mode)
**原典ページ数**: 10 | **読解ページ範囲**: 全 10 頁精読（本文 p.1733-1739 + References p.1740-1742）

---

## 1. 書誌情報

- **著者**: Wim Hordijk (University of Oxford, Dept. of Statistics), Jotun Hein (同), Mike Steel (University of Canterbury, Allan Wilson Centre for Molecular Ecology and Evolution, Biomathematics Research Centre, corresponding author)
- **タイトル**: Autocatalytic Sets and the Origin of Life
- **出典**: *Entropy* 12 (2010), pp.1733-1742. MDPI *Entropy* journal (Review)
- **DOI**: 10.3390/e12071733 | ISSN 1099-4300
- **受理**: Received 2010-05-16; Accepted 2010-06-28; Published 2010-06-30
- **ライセンス**: CC-BY 3.0
- **取得経路**: MDPI 直接 (www.mdpi.com) は Akamai 403 → **web.archive.org snapshot (20210502214417if_) で PDF 取得成功**（180KB、10 頁、公刊版）
- **キーワード**: origin of life; autocatalytic sets; RAF sets

## 2. 要旨（読んだ内容に基づく）

Hordijk, Hein, Steel は **"collectively autocatalytic set"** を形式化した **RAF framework** を review 形式で導入し、生命起源 (OoL) シナリオの中核に位置付ける。RAF とは触媒反応系 (CRS) の subset $\mathcal{R}$ であり、3 条件を満たすもの: (1) **Reflexively Autocatalytic (RA)** — $\mathcal{R}$ の全反応が $\mathcal{R}$ 内のいずれかの分子によって触媒される、(2) **F-generated (F)** — $\mathcal{R}$ の全 reactant が food set $F$ から $\mathcal{R}$ 内の反応の逐次適用で構築できる、(3) **RAF** — RA かつ F の両方を満たす。Autocatalytic cycle / hypercycle / collectively autocatalytic set はすべて RAF set の特殊例。論文の最重要主張は **"Kauffman の original argument は『触媒活性が系サイズに対して指数成長する必要がある』としたが、これは誤りで、実際は線形成長で十分"** — 著者らの先行研究 [37] で 2-polymer binary polymer model での polynomial-time algorithm を開発し、RAF 出現には **平均 1-2 reactions per molecule の触媒活性** で十分と示した（これは実生化学のタンパク質で現実的に達成される値）。論文は (a) OoL の標準シナリオ (Inorganic chemistry ⇒ Prebiotic metabolism ⇒ RNA world ⇒ Proteins ⇒ DNA) の各段階で autocatalytic cycle が必要な必要条件 (necessary but not sufficient) であること、(b) RAF は Petri net / Rosen の (M,R) systems / Eigen-Schuster hypercycle / Gánti の Chemoton を包摂する一般枠組であること、(c) RAF 単独では生命の 3 条件（containment / heredity / 選択）のうち 2 つを欠くこと、を主張する。結論は autocatalytic set は「強力だが不十分」な生命性必要条件であり、RAF framework が従来の代替モデル（hypercycle / Chemoton / metabolic network）を統合する mathematical foundation を提供することを示す。

## 3. 主要主張（原文引用付き）

### 主張 1: OoL シナリオの全段階で autocatalytic cycle が中心的

> "Despite differences between various proposed scenarios, one common element seems to be the emergence of an autocatalytic set or cycle at some stage." (Abstract)
>
> "Autocatalytic cycles and sets seem to play an important role in more than one of the steps in the above OoL scenario, and are a necessary, although not sufficient, condition for life." (§2)

標準 OoL シナリオ: $(\text{In})\text{organic chemistry} \Rightarrow \text{Prebiotic metabolism} \Rightarrow \text{RNA world} \Rightarrow \text{Proteins} \Rightarrow \text{DNA}$ (§1.4) の各遷移で autocatalysis は必須。

### 主張 2: RAF set の 3 条件による形式化

> "Given a network of catalyzed chemical reactions, a (sub)set $\mathcal{R}$ of such reactions is called:
> 1. Reflexively autocatalytic (RA) if every reaction in $\mathcal{R}$ is catalyzed by at least one molecule involved in any of the reactions in $\mathcal{R}$;
> 2. F-generated (F) if every reactant in $\mathcal{R}$ can be constructed from a small "food set" $F$ by successive applications of reactions from $\mathcal{R}$;
> 3. Reflexively autocatalytic and F-generated (RAF) if it is both RA and F." (§2)

Figure 1 は 7 分子 {a,b,c,d,e,f,g}、4 反応 {r1,r2,r3,r4}、food set F={a,b} の CRS で subset $\mathcal{R}=\{r_1,r_2\}$ が RAF となる具体例を示す。

### 主張 3: RAF 検出は polynomial-time algorithm で解ける

> "Introduced a polynomial-time algorithm for determining if any CRS has within it an RAF set, and if so, finding such self-sustaining subsystems (including ones that are minimal)" (§2 bullet list)
>
> "In [37], we introduced a polynomial time algorithm for finding RAF sets, and applied it to Kauffman's model of binary polymers with ligation and cleavage reactions [26,27]. The average running time of the algorithm was shown to be sub-quadratic (in the size of the reaction network)." (§3)

計算可能性を保証する点が理論的ブレークスルー。Kauffman モデルに適用すると **実用的に解ける**（7M reactions の Beilstein database に応用可能と示唆）。

### 主張 4: 線形成長で十分 — Kauffman の exponential 主張を覆す

> "Showed that only a linear growth rate (with system size) in catalytic activity is sufficient for RAF sets to appear with high probability in random instances of a simple catalytic reaction system based on polymer cleavage and ligation reactions (the original model of [26])." (§2)
>
> "Our computational results in [37] indicate that only a linear growth in catalytic activity (with system size) is necessary for RAF sets to appear with high likelihood in Kauffman's binary polymer model. This was subsequently verified analytically [39]. The level of catalysis necessary for RAF sets to occur in our simulations is between 1 and 2 reactions per molecule (on average), a number which is (bio)chemically quite realistic, especially for proteins [53–55]. This is in stark contrast to the exponential growth required in Kauffman's original argument, and therefore re-instates his claim that in 'sufficiently complex chemical reaction systems' autocatalytic sets will arise almost inevitably." (§3)

Kauffman 1986/1993 は触媒活性の exponential growth が必要と誤って主張し、Lifson 1997 [29] に批判された。著者らは **線形成長で十分** と証明し、Kauffman 主張を救い出した。この reversal が本論文の理論的核心。

### 主張 5: RAF set は autocatalytic cycle / hypercycle / Chemoton を一般化する

> "autocatalytic cycles, hypercycles, and collectively autocatalytic sets can all be seen as particular instances of RAF sets." (§2)
>
> "It is also possible to express the RAF model within other mathematical frameworks—in particular, it can be rephrased within the context of Petri nets, a model that Sharov has used to study self-reproducing systems in biology in an early paper [40] (see also [41]). The concept of an RAF also shares some similarities with Rosen's category-theoretic approach to metabolic closure [42,43]. Other mathematically-based models of autocatalysis have been proposed in, e.g., [44–46]." (§2)

Eigen-Schuster hypercycle (1977)、Gánti Chemoton (1997)、Rosen (M,R) system、Petri net などの代替モデルをすべて RAF の特殊例または等価形式として位置付け、**RAF を生命性モデルの統一言語**として提示する。

### 主張 6: RAF は必要条件だが十分条件ではない — 3 つの欠陥

> "It is important, though, to stress that the existence of an RAF, while necessary for the emergence of self-sustaining life, is far from sufficient for it for at least three reasons.
>
> Firstly, the approach ignores the concentration and stoichiometry of reactants, the possibility of degrading side reactions or the presence of molecules that inhibit other reactions, or complex catalysis in which a catalyst may remain bound at the end of the reaction to some of the products...
>
> Secondly, the approach does not address (let alone solve) the 'containment problem' that requires reactions to be physically contained by some boundary or membrane so the reactants do not diffuse and reduce their concentrations...
>
> And thirdly, the RAF approach does not directly address the problem of heredity in prebiotic systems, and the role of natural selection." (§3)

RAF は (1) 動力学 / 化学量論、(2) 区画化 (membrane containment)、(3) 遺伝 / 自然選択 の 3 要素を扱わない。これらは別アプローチ（lipid world [56]、Martin-Russel の alkaline vents [35,36]）と統合が必要。

### 主張 7: 反応論的拡張で RAF は生化学的現実性を獲得

> "Next to the above basic three requirements in an RAF we can easily build in additional assumptions to incorporate greater biochemical realism and to exclude trivial situations. Some such assumptions are:
> - Allowing some reactions to proceed without any catalysis;
> - Ensuring that at least some reaction products in the RAF are not contained in the food set $F$;
> - Ensuring that not all reactions are only catalyzed by molecules in $F$. In this case some of the catalysts must arise by either (i) being built up from $F$ by a series of reactions... this concept of a 'constructively auto-catalytic and F-generated' system was formalized and explored in [39]; or (ii) by being produced initially in trace quantities from non-catalyzed reactions (i.e. at much lower rates) which helps to establish an RAF for which the molecules' production is possible via catalyzed reactions." (§2)

"constructively auto-catalytic and F-generated" (cRAF) という強化版が [39] で形式化済。trivial case（全 reaction が F の分子だけで触媒される）を排除する実用的拡張。

### 主張 8: RAF framework の将来展開 — kinetics、実 database、evolution

> "The next steps would be (1) to include dynamics into the models in the form of reaction kinetics and the evolution of reaction sets (for example by using a genetic algorithm to evolve reaction sets [57]), and (2) to use the RAF framework to analyze real (bio)chemical networks as discussed above (e.g., the Beilstein database and bacterial metabolic networks). For a different but somewhat related (topological) approach to formally analyzing the appearance of structure and organization in chemical reaction systems, see e.g., [58]." (§4)

未来の研究方向として (a) 反応速度論的動力学、(b) Beilstein database（7M 反応）への適用、(c) 細菌代謝ネットワーク、(d) Chemical Organization Theory (Benkö-Dittrich-Stadler [58]) との接続、を挙げる。

## 4. 方法論

1. **formal 層 (§2)**: Catalytic Reaction System (CRS) = (分子集合 $X$, 反応集合 $\mathcal{R}_{full}$, 触媒関係, food set $F$) の 4 組定義。RAF は CRS の subset として 3 条件で定義

2. **algorithm 層**: polynomial-time 探索アルゴリズム（具体式は本論文では参照 [37] で開示、review では概要のみ）:
   - CRS の初期 $\mathcal{R}_0$ = 全触媒反応
   - $\mathcal{R}_{i+1}$ = $\mathcal{R}_i$ のうち触媒が $\mathcal{R}_i$ 内で得られ、reactant が F + $\mathcal{R}_i$ で得られる反応
   - 収束 $\mathcal{R}_\infty$ が非空なら最大 RAF、空なら RAF 不在
   - sub-quadratic な実測計算時間

3. **実証 / 統計層**: Kauffman の binary polymer model（長さ $\leq n$ の binary string、ligation + cleavage reactions、各反応が確率 $p$ で触媒される）で RAF 出現確率を測定。"触媒活性 $p \cdot 2^n$" を変えて simulation、RAF 出現に必要な $p$ の scaling が線形（$p \propto 1/n$）と判明

4. **比較層**: RAF と既存モデル（Eigen-Schuster hypercycle、Gánti Chemoton、Rosen (M,R)、Sharov Petri nets、Kauffman sets、Lancet chemtracts [45]、Bartsev-Mezhevikin [46]）の相互関係を記述

5. **限界解析層 (§3 末尾)**: RAF では扱えない 3 問題（dynamics / containment / heredity）を明示し、今後の拡張課題として定式化

## 5. 5段階との対応候補

D29「複雑性科学」は系全体の自己組織化を扱う。RAF は **生命起源における複雑系の最小構造モデル**として、5 段階のうち場・縁・渦・束は強くカバー、波は意図的に排除される（動力学は今後課題）。

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | **Catalytic Reaction System (CRS) = 分子集合 × 反応集合 × 触媒関係 × food set** が場を定義。Kauffman binary polymer model の場合、場は $\{0,1\}^{\leq n}$ の binary string 全体。**food set $F$ が場の境界条件**（外部から供給される分子の集合）として機能 | 強 | "The food set $F$ contains molecules that are assumed to be freely available in the environment. Thus, an RAF set formally captures the notion of 'catalytic closure', i.e., a self-sustaining set supported by a steady supply of (simple) molecules from some food set." (§2); Figure 1 の F={a,b} の構造; "Given a network of catalyzed chemical reactions, a (sub)set $\mathcal{R}$ of such reactions..." (§2) |
| 2 波 (Wave) | **本論文は動力学を扱わない**。反応速度論、濃度、化学量論は除外される。時間発展は「反応の組合せ論的到達可能性」にしか反映されない。これは論文の明示的限界 | 弱 | "the approach ignores the concentration and stoichiometry of reactants, the possibility of degrading side reactions or the presence of molecules that inhibit other reactions" (§3 limitation 1); "The next steps would be (1) to include dynamics into the models in the form of reaction kinetics" (§4 Summary) |
| 3 縁 (Relation / Boundary) | **触媒関係 (catalysis) が「縁」の核**。"どの分子がどの反応を触媒するか" の binary relation が系の構造を規定。また **catalytic closure**（食集合外のすべての触媒が系内で生成される）が「縁の自己充足性」を表現。Figure 1 の dashed arrow（catalysis）が縁の可視化 | 強 | "an RAF set formally captures the notion of 'catalytic closure'" (§2); "Reflexively autocatalytic (RA) if every reaction in $\mathcal{R}$ is catalyzed by at least one molecule involved in any of the reactions in $\mathcal{R}$" (§2); "The subset $\mathcal{R} = \{r_1, r_2\}$ (shown with bold arrows) is RAF: (1) The molecules involved in $\mathcal{R}$ are $\{a, b, c, d\}$, reaction $r_1$ is catalyzed by $d$, and $r_2$ by $a$, so $\mathcal{R}$ is reflexively autocatalytic (RA)." (Figure 1 caption) |
| 4 渦 (Vortex) | **Reflexive autocatalysis 自体が渦の純粋形式**。系内の分子が互いを循環的に産出する closed loop。各反応の「産物が他の反応の触媒となる」再帰構造が渦の数学的定義。**"design without a designer"** と同構造の invisible hand 機構 | 強 | "With an autocatalytic set we do not mean a set of autocatalytic reactions, but rather a set of (arbitrary) molecules and reactions which is 'collectively autocatalytic' in the sense that all molecules help in producing each other (through mutual catalysis) in some closed and self-sustained manner (supported by a food set)." (§2); "A collectively autocatalytic set is a set of molecules and catalyzed reactions where each molecule is created by at least one reaction from this set, and each reaction is catalyzed by at least one molecule from the set." (§1.3) |
| 5 束 (Bundle) | **RAF set $\mathcal{R}$ 自体が生命性の最小束**。minimum RAF、maximum RAF、sub-RAFs の階層が束の内部構造を与える。hypercycle / Chemoton / (M,R) system がすべて特殊な RAF 束として整理される。**"束のクラス"としての RAF** が本論文の貢献 | 強 | "autocatalytic cycles, hypercycles, and collectively autocatalytic sets can all be seen as particular instances of RAF sets." (§2); "Introduced a polynomial-time algorithm for determining if any CRS has within it an RAF set, and if so, finding such self-sustaining subsystems (including ones that are minimal)" (§2); "The RAF framework is important and relevant to the origin of life in several ways. First, it places the notion of autocatalytic sets in a formal framework which can be... used and studied both analytically and computationally." (§3) |

**判定基準**: 場・縁・渦・束が「強」、波が「弱」。全 5 段階ではないが、**D29 領域で「生命起源の最小構造モデル」を形式化した foundational paper** として高い価値。Friston 2013 (D20-S16) の Markov blanket と対比すると、Friston が「境界をもつ ergodic 系の必然的 Bayesian 挙動」を提示するのに対し、Hordijk らは「反応ネットワークの触媒閉包という別種の境界」を提示する。両者は独立した「生命性の形式化」であり、D29 complexity science と D20 自律性を結ぶ理論的橋渡しとなる。

## 6. 限界・留意事項

- **review paper であり primary simulation results は参照 [37-39] に依存**: 本稿は前 3 論文の要約 + 統合。線形成長 scaling の厳密証明は本論文では示されない
- **動力学を扱わない**: 反応速度論、濃度、stoichiometry は無視。「RAF が存在する」と「RAF が現実に自己維持する」の間にはギャップ。著者自身明示的限界とする
- **containment problem を扱わない**: 膜 / 区画化が必要だが、RAF framework は空間構造を持たない。lipid world [56]、alkaline vent [35,36]、Wächtershäuser の pyrite surface [13,14] など別アプローチと統合が必要
- **heredity / natural selection を扱わない**: 遺伝情報の世代間伝達と選択的変異は RAF では記述できない。これは **D04 生物学の継承**の側面で欠落
- **Kauffman binary polymer model の抽象性**: 実生化学の多様性（三次元構造、折り畳み、allosteric 制御）を捨象。"moonlighting proteins" [53-55] の現象論的観察が現実的触媒活性 1-2 rxns/molecule を支持するが、構造的生物学的 validation は不足
- **exponential → linear の証明は binary polymer model 限定**: 他のモデル（RNA folding、peptide chemistry）で同じ scaling が成立する保証なし
- **"sufficient complexity" の定義が post-hoc**: 「線形成長で十分」と示すが、何を「sufficient complexity」とするかの事前定義は弱く、循環論法気味
- **Kauffman 原論 [26] の批判 [29] との関係**: Lifson 1997 の批判を Hordijk らが解消したという記述だが、Lifson 自身の反論可能性は考察されない
- **実 database への適用は未実施**: Beilstein (7M reactions)、細菌代謝 network への RAF algorithm 適用は「今後の課題」として提示。2010 年時点で最大規模の Kauffman model simulation は 5M reactions
- **review 形式ゆえの圧縮**: OoL シナリオの各段階 (inorganic → prebiotic → RNA → proteins → DNA) の個別展開は §1.1-1.4 で概説のみ。各段階の科学的論争の全容は述べられない

## 7. 未読解セクション（部分読解の場合）

全 10 頁精読完了（本文 p.1733-1739 + References p.1740-1742、58 文献）。主要参照は把握: Gilbert 1986 RNA world [1]、Kauffman 1986/1993 [26,27]、Eigen-Schuster 1977 hypercycle [20,21]、Rosen (M,R) systems [42,43]、Gánti Chemoton [44]、Segré/Lancet Lipid World [45,56]、Martin-Russel alkaline vents [35,36]、著者らの先行 RAF papers [37,38,39]、Benkö-Dittrich-Stadler Chemical Organization Theory [58]。本論文内で完結しており、未読部分なし。
