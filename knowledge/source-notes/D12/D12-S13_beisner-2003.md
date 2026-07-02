# Alternative stable states in ecology

**source_id**: S13 | **domain_id**: D12
**access_status**: raw-confirmed
**読解日**: 2026-06-26 | **読解者**: claude-opus-4-8
**読解方法**: Read (PDF, image mode)
**原典ページ数**: 7 (pp.376-382) | **読解ページ範囲**: pp.376-382 全ページ（本文全節 + 文献概観）

---

## 1. 書誌情報

- **著者**: Beverley E. Beisner¹, Daniel T. Haydon¹, Kim Cuddington²（¹Dept. of Zoology, University of Guelph; ²Dept. of Environmental Science and Policy, UC Davis）
- **タイトル**: Alternative stable states in ecology
- **出典**: *Frontiers in Ecology and the Environment* 2003; 1(7): 376-382（REVIEWS）
- **発行**: The Ecological Society of America
- **DOI**: 10.1890/1540-9295(2003)001[0376:ASSIE]2.0.CO;2

## 2. 要旨（読んだ内容に基づく）

本レビューは、生態学で1960年代以来繰り返し論じられてきた「代替安定状態（alternative stable states）」の概念を、2つの相補的な視座のもとで整理する: (A) **群集視座（community perspective）**＝環境を一定とし、状態変数（個体群密度など）への摂動で状態間を遷移させる見方、(B) **生態系視座（ecosystem perspective）**＝パラメータ（出生率・死亡率・環境ドライバ）の変化で景観（landscape）そのものが変形する見方。両者は「ボール・イン・カップ（ball-in-cup）」のヒューリスティック図で統一的に理解でき、安定状態＝引力域（basin of attraction）、現状＝ボールとして表される。著者らはこの枠組みで **resilience（レジリエンス）** と **hysteresis（ヒステリシス）** を再定義し、代替安定状態の存在を示すには「2つ以上の局所安定状態の実証」が必要だと論じる。本論文は D12-S03 Holling (1973) のレジリエンス概念を引き継ぎ、その操作化・概念整理を担う後継テキストである。

## 3. 主要主張（原文引用付き）

### 主張 1: 代替安定状態には2つの視座がある（状態変数 vs パラメータ）

> "Theoretical ecologists envision two ways in which a community can move from one stable state to another. The first requires that different states exist simultaneously under the same set of conditions and that the community be conveyed from one state to another by a sufficiently large perturbation applied directly to the state variables [...]. The second way requires a change in the parameters that determine the behavior of state variables and the ways they interact with each other." (pp.376-377)

群集視座は「景観固定・ボールが動く」、生態系視座は「景観そのものが変形する」。状態変数（速く反応）とパラメータ（遅い/外生）の区別が両視座を分ける。

### 主張 2: ボール・イン・カップ図 — 状態空間を景観として表す

> "A useful heuristic device that we will use throughout this article to explain the two ways of thinking about shifting between alternative stable states is the ball-in-cup analogy outlined in Figure 1. All conceivable states of the system can be represented by a surface or landscape, with the actual state of the community as a point or a ball residing on this surface. [...] Valleys or dips in the surface represent domains of attraction for a state (balls always roll into that state once in the 'domain')." (p.377)

可能な全状態を景観（surface）として表し、谷＝引力域、ボール＝現状とする。摂動はボールを動かす（状態変数視座）か景観を変形させる（パラメータ視座）。

### 主張 3: パラメータと変数の区別は「定式化の問題」（共通枠組み）

> "Ultimately, whether a quantity in a model is treated as a parameter or a variable is a matter of formulation – and therein lies the key to understanding the apparent differences between the community and ecosystem perspectives. [...] we examine the quantities involved in a dynamic process and identify as variables those quantities that change 'quickly' in response to feedback from model dynamics. Parameters are those quantities that are either independent of, or subject only to very slow feedback from state variables within the model." (p.378)

漁業の漁獲圧を例に、それを外生パラメータと見れば生態系視座、捕食者（人間）-被食者（魚）モデルの内生変数と見れば群集視座になる。両視座は時間スケール（速い/遅いフィードバック）による定式化の選択に帰着する。

### 主張 4: レジリエンスの2側面 — 復帰時間（engineering）と摂動許容幅（ecological）

> "Steepness of the sides of the basin affects the return time of the ball to the lowest point in the basin. [...] Return time is a measure of local stability (Pimm 1991) and has been called 'engineering resilience' by Peterson et al. (1998). [...] The ball can only move out of a basin if it experiences a push sufficiently large to escape the basin boundaries. Thus, the size of the perturbation to state variables affects the likelihood of escape from a basin. This has been called 'ecological resilience' (Peterson et al. 1998)." (p.379)

レジリエンスには2側面がある: 谷の傾斜＝摂動後の復帰時間（engineering resilience＝局所安定性）、谷の幅＝引力域を脱出するのに要する摂動の大きさ（ecological resilience）。D12-S03 Holling 1973 の resilience/stability 二分法をこの2軸として精緻化している。

### 主張 5: レジリエンスは漸進的に侵食され、破局的遷移を招く

> "An example is the gradual addition of nutrients to shallow lakes that erodes the resilience of the clear water state (Scheffer et al. 1993). This gradual change makes the entire system more prone to catastrophic shifts toward an algae-dominated, turbid water state. Catastrophes arise with slight changes in spring conditions [...]" (p.379)

浅い湖への栄養塩の漸進的添加が「澄んだ水」状態のレジリエンス（引力域）を侵食し、わずかな引き金で「濁った藻類優占」状態への破局的遷移を招く。臨界遷移（regime shift）の典型例。

### 主張 6: ヒステリシス — 状態遷移の履歴依存性

> "Hysteresis is revealed if the return trajectory of the equilibrium point differs from that adopted during its 'outward' journey [...]. Consequently, there must be multiple possible equilibrium points for some values of the perturbed parameter, and which of these states is adopted depends on the history of past perturbation. [...] communities and ecosystems might be easily pushed into some configurations from which it may prove much more difficult for them to recover." (pp.379-380)

パラメータを元に戻しても系が同じ経路で戻らない（履歴依存）。生態系管理上、一度移った状態から復帰が困難になりうることを含意する。

### 主張 7: 代替安定状態の実証には「2つ以上の局所安定状態の証明」が必要

> "Demonstration of at least two states that are each locally stable is sufficient evidence for alternative stable states. However, reverting to a former state will usually also demonstrate hysteresis; complete reversal of a perturbation will not lead to reversal of community structure because of asymmetry in most ball-in-cup 'landscapes'." (p.380)

群集視座・生態系視座のいずれでも、必要な実験的証拠は同型（摂動停止後の新状態の安定性の実証）。代替安定状態の存在は、少なくとも2つの局所安定状態の demonstration で示される。

## 4. 方法論

レビュー/概念整理論文。著者ら独自の実験データはなく、(1) ball-in-cup ヒューリスティック図（Fig.1, 3, 4, 5）による視覚的概念モデル、(2) 漁業（sigmoid 成長 + 線形死亡率による多重平衡, Fig.2）・浅い湖（栄養塩→濁水遷移）等の文献例、(3) 群集視座（Lewontin 1969, Sutherland 1974, Lotka-Volterra 競争）と生態系視座（May 1977, Scheffer et al. 2001）の系譜整理を組み合わせる。Holling (1973)・Pimm (1991)・Peterson et al. (1998) のレジリエンス概念を統合する。

## 5. 5段階との対応候補（D12 生態学角度）

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | 可能な全状態の景観（surface/landscape）。複数の引力域を含む状態空間 | 強 | "All conceivable states of the system can be represented by a surface or landscape [...] Valleys or dips in the surface represent domains of attraction for a state" (p.377) |
| 2 波 (Wave) | 状態変数への摂動／パラメータ漸進変化（景観の "tremors"）／環境確率性。ボールを動かし景観を揺らす擾乱 | 強 | "environmental stochasticity may be viewed two ways: as variation in parameters omitted from the model, which cause variables to 'vibrate' [...] or as variation in parameters [...] manifesting themselves as 'tremors' in the landscape surface" (p.378) |
| 3 縁 (Relation) | 引力域間の鞍点（saddle）／不安定平衡（Fig.2 の X）＝どちらの状態に決まるかの臨界閾値 | 強 | "When the saddle between two basins is low enough, a small stochastic perturbation to state variables can cause the final shift into the new basin." (p.379); "Each point at which these lines cross represents an equilibrium: the outer two represent stable states and the middle one is unstable." (p.377) |
| 4 渦 (Vortex) | 系が落ち着く新たな局所安定状態（引力域に静止するボール）＝立ち上がる個別の安定配置 | 強 | "Once in a new domain, the community will persist there unless subject to another large perturbation." (p.377) |
| 5 束 (Bundle) | 引力域の幾何（傾斜・幅＝resilience）とヒステリシス（履歴依存）として残る構造的不変則 | 強 | "which of these states is adopted depends on the history of past perturbation" (p.380); "the size of the perturbation to state variables affects the likelihood of escape from a basin. This has been called 'ecological resilience'" (p.379) |

**判定基準**:
- **強**: 著者が直接その概念・構造を論じており、5段階の定義と明確に対応する
- **弱**: 構造的類似はあるが、著者の文脈・意図とは異なる読みである
- **なし**: 対応が見出せない。無理に作らない

**注記**: 本論文は力学系的な状態遷移を扱うため5段階と全段階で対応するが、特に Stage 3 縁（鞍点＝臨界閾値）と Stage 5 束（resilience/hysteresis として残る景観構造）が強い。D12-S03 Holling (1973) が resilience/stability の原理を提示したのに対し、本 Beisner et al. (2003) はそれを ball-in-cup 図で操作化し「engineering resilience（復帰時間）vs ecological resilience（摂動許容幅）」の2軸に分節化した後継テキストとして読める。「創造」概念は登場せず、5段階対応は評価者側の解釈である。

## 6. 限界・留意事項

- レビュー論文であり、独自の実証データ・数理的厳密化はない（漁業 sigmoid モデル等は概念図レベル）。
- ball-in-cup 図は2次元の直観的ヒューリスティックであり、高次元状態空間の実際の引力域構造を厳密に表すものではない（著者も heuristic device と明示）。
- 「どの状態を truly alternative と見なすか」の基準（統計的差異で十分か、生物学的/人間的指標が要るか）は未決着と著者が認める（p.381）。
- 本論文は生態学の概念整理であり、D12（農学生態）の特定の農業生態系を扱うわけではないが、漁業資源・浅い湖・放牧地など応用例は管理科学に直結する。

## 7. 未読解セクション

全 7 ページ（pp.376-382）読了。文献一覧（Carpenter 1999 〜 Woolhouse 1996）は個別確認時に参照が必要だが、本レビュー本体の理解には読解済み範囲で十分。図 Fig.1-5 はキャプション・本文記述を中心に読解。

## 8. 関連 source-note

- **D12-S03 Holling (1973) Resilience and Stability of Ecological Systems**: 本論文が引き継ぐレジリエンス概念の原典。Holling の resilience/stability 二分法を、本 Beisner et al. は ball-in-cup の傾斜（engineering resilience）と幅（ecological resilience）に操作化。
