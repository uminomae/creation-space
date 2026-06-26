# van Geert (1998). A Dynamic Systems Model of Basic Developmental Mechanisms: Piaget, Vygotsky, and Beyond

**source_id**: D23-S14 | **domain_id**: D23
**access_status**: raw-confirmed
**読解日**: 2026-06-26 | **読解者**: claude-sonnet-4-6
**読解方法**: ローカル PDF 全文精読
**原典ページ数**: 約43 (Psychological Review 105(4): 634-677) | **読解ページ範囲**: 全文（pp.634-672 の本文・全図表・結論。pp.673-677 は参考文献続き）

---

## 1. 書誌情報

- **著者**: Paul van Geert（フローニンゲン大学 心理学部 Heymans Institute）
- **タイトル**: A Dynamic Systems Model of Basic Developmental Mechanisms: Piaget, Vygotsky, and Beyond
- **出典**: *Psychological Review* 105(4), 634-677（1998）
- **DOI**: https://doi.org/10.1037/0033-295X.105.4.634-677
- **形式**: 理論＋計算モデル論文。Piaget と Vygotsky の「基本的発達メカニズム」を一般動的システムモデルとして数理化（Excel/Visual Basic 実装）し、対象概念・保存・水位課題・認知戦略・微視発達など多領域の実証パターンをシミュレーションで再現する。1996 年の両者生誕百周年を機に書かれた。

## 2. 要旨（読んだ内容に基づく）

本論文は、Piaget と Vygotsky の理論から抽出した**基本的発達メカニズム**を、非線形動的システム論の上に**単一の一般計算モデル**として再構成する試みである。中心命題は「認知発達の多様な特徴的パターン（連続・不連続、段階、移行期の多峰性、個人内・個人間変動）は、それ自体が**保守的な力と進歩的な力の緊張**から成る動的システムの**内在的ダイナミクス**の表現である」というもの。Piaget からは**同化 vs 調節**（保守＝現状の統合 vs 進歩＝環境への適応）、Vygotsky からは**現実的発達 vs 最近接発達領域（ZPD）**を取り出し、両者を「保守的・主体駆動」と「進歩的・環境駆動」の**弁証法的対立**として一般化する。発達を**発達距離次元**上に並んだ内容（スキル・知識・規則）の配列とし、各内容に**重み（活性化確率）**を与える。重みは動的な「現実水準（actual level）」のピークと、経験への感受性が最大となる「潜在水準（potential level＝アトラクタ）」の二点で最大成長する。シミュレーションは、連続的 S 字成長・突発的段階移行・移行期の二峰性（décalage）・準安定・水位課題や保存課題の二状態分布・戦略の波状的盛衰（Siegler）・微視発達の変動帯（Granott/Fischer）を、いずれも**創発的特性**として再現する。段階数が 3〜5（典型 4）になること、段階区間長が**べき乗則（フラクタル的）**で増えることもモデルから自然に出る。著者は「実体としての段階」を退け、段階＝**アトラクタ状態**、移行＝**準安定での切替**、不連続＝**カタストロフ的飛躍**と再記述する。

## 3. 主要主張（原文引用付き）

### 主張 1: 発達の多様なパターンは内在的ダイナミクスの表現である

> "The general aim of this article is to demonstrate that the wide variety of characteristic patterns of cognitive development is in fact the expression of the intrinsic dynamics of dynamic systems that operate on the basis of major developmental mechanisms that can already be found in Piaget's and Vygotsky's works." (p.634)

経験的に見られる発達パターンの多様性こそが説明対象であり、そのどれか一つだけを「真の」発達パターンとみなす理論的論争は不要だと論じる。

> "Major, but probably unnecessary, theoretical controversies are created if one first assumes that of all this variety of empirical findings only a small subset is indicative of the 'true' underlying developmental pattern …" (p.635)

### 主張 2: 発達の駆動因は「保守的×進歩的」の弁証法（同化/調節 = ZPD）

> "The fifth and probably most important point that has been directly adopted from Piaget's and Vygotsky's theories … states that there exists a fundamental dialectic between a primarily subject- and a primarily object-driven force, which constitutes the motor behind the developmental process." (p.639)

Piaget の同化-調節、Vygotsky の現実的発達-最近接発達領域、情報処理論の規則-情報、Thelen & Smith の進行中の行為-環境の可能性を、すべて同型の弁証法的緊張として束ねる。

> "Adaptation results from two opposing tendencies, *assimilation* and *accommodation*. Assimilation 'is the integration of external elements into evolving or completed structures of an organism' … In the complementary operation of accommodation, the child incorporates or adapts himself or herself to the particularities of reality." (p.636)

### 主張 3: 「現実水準」と「潜在水準（ZPD＝アトラクタ）」の二点で重みが最大成長する

> "Let me now focus on the second aspect, the potential level. The potential level has no mysterious status. It is simply a developmental level corresponding with a set of contents (skills, rules, etc.) in the array that is most sensitive to the effect of experience brought about by the activated content … this array of sensitivity to instruction is basically what Vygotsky intended with his ZPD concept." (p.642)

感受性が最大になる位置（潜在水準）は、新奇性選好と熟知性選好の二指数関数の交点として定式化され（Equations 4-5）、教育・ZPD によって発達的に前進しうる。重みは「現実水準」と「潜在水準」の二箇所で最も速く増える。

### 主張 4: 段階は「全体構造」ではなくアトラクタであり、移行は突発的・二峰的になりうる

> "In the starting phase, the model's output levels remain at approximately the same initial level or they fluctuate within a relatively narrow band. They then suddenly jump to a significantly higher level, which remains stable until they jump again toward a still higher level. This process repeats itself a few times … the four-stage pattern occurs most frequently." (p.652)

段階は実体ではなく、ダイナミクスから創発するもので、領域固有・個人差を伴う。

> "The present view on stages, however, is that if they occur, they are not like the all-encompassing changes attributed to Piaget. Rather, there exist significant interindividual and intraindividual differences … the stages are domain specific." (p.653)

移行期には旧水準と新水準の二峰（二峰性 bimodality）が一時的に共存し、これが水平的décalage や微視発達の変動の自然な現れとなる（Figures 4, 5, 9, 14）。

### 主張 5: 段階数（3〜5）と段階長のべき乗則はモデルから創発する（フラクタル的）

> "It just tells us that, given the dynamics of this kind of process, we should expect three to six major shifts and many small, (quasi-)continuous changes." (p.655)

> "The logarithmic plot of the average length of the stages … approximates a straight line, which shows that the increase of the stage or phase duration is governed by a power function." (p.655)

「なぜ段階数が少数なのか」「なぜ段階が進むほど長くなるのか」という古典的疑問に対し、保守×進歩の緊張で動く過程が**スケール不変（フラクタル）**だからだと答える。段階数の 4±2 という一致は「段階数が実在する」ことを意味しないと留保する。

### 主張 6: 一次元の発達距離は多次元ハイパースペースの距離であり、単純な一次元実在論ではない

> "It is important to note that a multidimensional ordering can always be transformed into a one-dimensional ordering … the dimensions need not be empirically independent of one another." (p.639)

対象概念課題が約20次元の記述空間上の一点であること（pp.647-648）を例に、一次元化は理論的単純化であって発達の単純さの存在論的主張ではないと明示する。

## 4. 方法・モデルの要点

- **発達空間と発達距離次元**: 発達的に関連する記述次元から成るハイパースペースを構成し、内容（スキル・規則・経験）を原点 ∅ からの**発達距離**（0〜1 の無次元数）で位置づける。多次元順序は常に一次元順序に変換できる（p.639）。
- **内部配列 I と外部配列 E**: 主体が遂行可能な行為・経験を一次元配列 `I(c1, c2, ...)` で表し、環境を `E`、内部を `I ⊆ E`（環境は学習・発達の潜在源）とする（p.640）。
- **活性化関数（Equation 2）**: 各内容の重み `w_i` に乱数 `ξ` を掛け、最大積を取る内容が活性化される確率的選択。重みは活性化確率に比例（Figure 1）。これにより「真の」無時間的発達水準は存在せず、文脈依存の「偶発的」水準のみが生じる（pp.641-642）。
- **二つの感受性ピーク**: 現実水準（同化＝現在の発達水準）と潜在水準（調節範囲＝ZPD）。潜在水準は新奇性 `f_novelty` と熟知性 `f_familiarity` の指数関数の交点で定義され（Equation 4-5、Figure 2）、教育により前進する。
- **三種の発達効果**: (a) 重みの更新（logistic 成長, Equations 7-8）、(b) 潜在（アトラクタ）水準の上昇（Equations 10-11）、(c) 内部配列の拡張（新内容の追加, Equation 9）。効果は発達距離に応じて近隣内容に拡散し（spreading parameter σ）、遠隔内容には負（競合）に作用する（pp.643-644）。
- **三つの入力条件**: 一様環境／Piaget 的（最適距離の逆U字分布）／Vygotsky 的（環境が系の需要に適応＝ZPD パラメータ ζ, ζ_p）（pp.646-647）。
- **再現された実証パターン**:
  - 連続的 S 字成長（normal input, Figure 3, r²≈.93-.98）。
  - 四段階の突発的移行＋移行時の重み低下（Piaget パラメータ, Figure 4）。移行直前の二峰（Figure 5）。
  - 段階数 3〜5（80シミュレーションの集計, Figure 6）。
  - 水位課題・保存課題の**二状態（good/poor performers）二峰分布**（Thomas & Lohaus 1993, van der Maas & Molenaar 1996 を再現, Figures 9-10）。
  - 認知戦略の波状的盛衰（Siegler 1995, Figures 11-12）と支持/非支持テスト条件での水準差（Figure 13）。
  - 微視発達の変動帯と一時的退行（Granott, Fischer & Granott 1995, Figures 14-15）。
- **限界の自己認識**: パラメータの心理学的実在、モデルの過剰決定（overpowered）による反証可能性の問題、間接的パラメータ推定の困難を明示的に論じる（pp.666-668）。

## 5. 創造の5段階（場・波・縁・渦・束）への対応評価

| 段階 | 対応候補 | 強度 | 原文引用・根拠 |
|------|---------|------|---------|
| 1 場 (Field) | 発達ハイパースペース／発達距離次元上の内容配列 `I`：構造が立ち上がる前の、すべての可能な行為・経験が距離で並ぶ潜勢的基底。重みが付与される前の「漂う」配列。 | 中 | "we can represent a developing system at time t as an ordered one-dimensional array of cells, I(c1, c2, ... cn, ...)" (p.639) / 多次元ハイパースペース（p.639, p.647）。配列＝場の数理化だが、本論の焦点は配列上の動態であり「未分化の海」そのものの記述は薄い |
| 2 波 (Wave) | 重みベクトルの揺らぎ・移行期の二峰性・段階区間のべき乗則（スケール不変＝フラクタル）。確率的活性化が生む変動と振動。 | 強 | "the model's output levels … suddenly jump … This process repeats itself" (p.652) / "temporary bimodality is a natural outcome of the stage shifts" (p.657) / "The logarithmic plot of the average length of the stages … power function … fractal" (p.655)。Siegler の「波（waves）」を明示的に再現（Figure 12, p.663）。揺れ・対立・分離が段階を駆動する点で「波」と高い一致 |
| 3 縁 (Relation) | 内部（主体）と外部（環境）の弁証法的緊張＝同化/調節・ZPD。準安定（metastability）が移行を生む境界。内容間の支持/競合の相互作用。 | 強 | "there exists a fundamental dialectic between a primarily subject- and a primarily object-driven force, which constitutes the motor behind the developmental process" (p.639) / 潜在水準＝ZPD は「内と外の関係」が発達を動かす場（p.642）。準安定・移行が境界で起きる（Figures 4-5）。「縁＝境界・関係・準安定」と構造的に一致 |
| 4 渦 (Vortex) | 保守×進歩の緊張から特徴的パターン（段階・戦略・スキル）が**創発的特性**として立ち上がる自己組織化。アトラクタ（段階）への個体化。 | 強 | "order, discontinuities, and new forms emerge precisely through the complex interactions of these heterogeneous forces … Developmental order comes about as a result of self-organization" (p.635, Thelen & Smith 引用) / "These principles concern interactions between conservative and progressive forces … The resulting phenomena concern … emergent properties" (p.666)。段階＝アトラクタへの収束は「渦の個体化・立ち上がり」と同型 |
| 5 束 (Bundle) | 段階の方向性（より進んだ水準への前進）。複数の戦略・スキルが配列上に共存・束化する band 構造（Figure 11 の bands 1-4）。 | 弱 | "development takes the form of bands of co-occurring levels" (Figure 11, p.662) は「束（方向を持つ集合）」に近いが、これは単一個体内の戦略共存であり、「複数の渦が影響し合って構造として残る集まり」という束の社会的・集合的中核とはずれる。方向性は前進として一貫するが、本論は単一発達系の軌道に閉じ、集合体形成は射程外 |

**判定基準**:
- **強**: 著者が直接その概念・構造を論じており、5段階の定義と明確に対応する
- **中**: 概念は存在するが本論の焦点ではない／部分的対応
- **弱**: 構造的類似はあるが、著者の文脈・意図とは異なる読みである
- **なし**: 対応が見出せない。無理に作らない

**注意**: 波・縁・渦が「強」で揃う。本論文は D23「発達」領域における**複雑動的システム論の計算モデル的アンカー**であり、5段階モデルの動力学的読み（場＝発達距離配列という潜勢的基底の上で、波＝重みの揺らぎ・移行が、縁＝同化/調節・ZPD という主体-環境の弁証法を通じて、渦＝段階というアトラクタへの自己組織化的創発を生む）と高い構造的同型を示す。同じ van Geert の 2019 論文（D23-S11）が本論を過程オントロジーの観点から一般化しており、2019 が「場・波・縁・渦が強／束が弱」と評価されたのに対し、本 1998 論文では「場」は配列として明示されるが未分化基底の記述が薄いため「中」、代わりに「波」が段階移行・フラクタル・Siegler の波の明示的再現により「強」となる。両論文を連動して読むと、van Geert の理論が「場の潜勢→波の変動→縁の弁証法→渦の創発」という鎖を一貫して描いていることが見える。束のみ弱いのは、van Geert の方向性が単一システムの軌道内に閉じ、複数個の社会的集合体形成を中心主題としないため（D23-S11 と同じ理由）。

## 6. 限界・留意事項

- **計算モデルの過剰決定（overpowered）**: 著者自身が「強い確率的成分を持つモデルでは、産み出せないパターンのクラスが存在することを形式的に示すのが難しい」と認める。"if the model is capable of simulating any pattern that could eventually be empirically found, it runs the danger that it cannot in principle be falsified."（p.666）。反証可能性は、特定パラメータ集合下での独立変数に関する予測（例: 保守性が高い子ほど移行が不連続）を立てることで担保すると論じる。
- **パラメータの心理学的実在**: 保守パラメータ η・進歩パラメータ θ・拡散パラメータ σ が現実の心理学的変数とどう対応するかは未解決（"a major problem … concerns the question by what mechanisms and processes the parameter values … are set and selected", p.666）。
- **パラメータ推定の困難**: 複雑モデルが単純モデルのインスタンス化であることを示すのが難しく、推定は回帰モデルより厳密性に欠ける間接的方法に依存する（p.668）。
- **特定内容の伝達は説明しない**: ニューラルネットモデルと異なり、本モデルは特定の戦略・スキルがどう伝達・獲得されるかは扱わず、配列上の動態（創発）のみを説明する（p.663）。
- **移行期の表現の制約**: モデルは一時点で一スキル/概念の一表現しか許さないため、Goldin-Meadow らの gesture-speech mismatch（同時に複数表現が共存）は、距離の異なる水準の継起的交替としてしか再現できない（footnote 9, p.664）。
- **「発達距離」に絶対的数値標準はなく**、無次元数（0〜1）で表されること、時間も明示的パラメータでなくステップ数で近似されること（p.647）に留意。

## 7. 未読解セクション（部分読解の場合）

本文（pp.634-672）・全15図・全脚注・結論を精読。pp.673-677 は参考文献の続きで本読解の射程外。引用される個別実証研究（Thomas & Lohaus 1993, van der Maas & Molenaar 1996, Siegler 1995, Fischer & Granott 1995 等）は本論の要約・再現レベルで把握しており、各原典そのものの精読は本ノートの範囲外。
</content>
</invoke>
