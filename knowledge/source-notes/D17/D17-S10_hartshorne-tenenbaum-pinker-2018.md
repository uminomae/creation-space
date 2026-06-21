# A Critical Period for Second Language Acquisition: Evidence from 2/3 Million English Speakers

**source_id**: D17-S10 | **domain_id**: D17
**access_status**: raw-confirmed
**読解日**: 2026-04-22 | **読解者**: claude-opus-4-7
**読解方法**: Read (PDF)
**原典ページ数**: 15（本文）+ 17（supplementary materials、計 32 pages） | **読解ページ範囲**: 本文 1-8, 11-15

---

## 1. 書誌情報

- **著者**: Joshua K. Hartshorne, Joshua B. Tenenbaum, Steven Pinker
- **タイトル**: A critical period for second language acquisition: Evidence from 2/3 million English speakers
- **出典**: Cognition, Vol. 177, pp. 263-277, 2018
- **DOI / URL**: 10.1016/j.cognition.2018.04.007
- **受理**: Received 2016-07-05; Accepted 2018-04-06
- **所属**: (a) MIT Brain & Cognitive Sciences, (b) Boston College Psychology, (c) Harvard Psychology
- **取得経路**: `https://stevenpinker.com/files/pinker/files/hartshorne_tenenbaum_pinker_a_critical_period_for_second_language_acquisition.pdf`（著者 self-archive）
- **データ公開**: http://osf.io/pyb8s

## 2. 要旨（読んだ内容に基づく）

Hartshorne, Tenenbaum, Pinker は 669,498 人分の英語文法クイズ回答（gameswithwords.org の "Which English" クイズ）を用いて、第二言語習得（L2）の "critical period" の形状を推定する。クイズは 132 項目の構文判定問題で、38 言語族から 1000 人以上の native speakers を含む。従来の研究は「学習能力（learning rate）」と「最終到達度（ultimate attainment）」を混同してきたが、この 2 つは原理的に 1 対 1 対応しないことを明示。**ELSD (Exponential Learning with Sigmoidal Decay) モデル** を当てはめ、grammar-learning ability は **17.4 歳** までほぼ保たれ、その後急速に減衰することを見出す（R² = 0.89）。従来の推定（5-15 歳）より遥かに遅く、出生前から学習能力が減衰するという対立仮説（R² = 0.66-0.70）を棄却する。この "sharply-defined" critical period は、(1) 最晩年まで native-like 到達が可能な期間は思春期後期、(2) 減衰は childhood ではなく late adolescence に起こる、(3) 神経死・神経剪定・青年期のホルモン変化・ワーキングメモリ低下・処理速度低下などの既存の説明候補では**一つも** 17.4 歳の不連続を予測できない、という 3 点を示す。

## 3. 主要主張（原文引用付き）

### 主張 1: learning ability と ultimate attainment は原理的に混同されてきた

> "Unfortunately, learning ability is a hidden variable that is difficult to measure directly... Thus, studies that are confined to the initial stages of learning cannot easily measure whatever it is that gives children their long-term advantage... Note that strictly speaking, these studies measure learning *rate*, not learning *ability*. While these are conceptually distinct, in practice they are difficult to disentangle, and the distinction has played little role in the literature." (p.2)

学習能力（learning rate）は直接測定できない隠れた潜在変数で、最終到達度（ultimate attainment）との関係は many-to-many。Fig. 2 で 2 つの非常に異なる learning-rate 曲線（2A: infancy からの steady decline / 2C: adolescence での sudden drop）が同一の ultimate attainment 曲線を生みうることを simulation で示す。

### 主張 2: クラウドソーシングで 66 万人規模のデータセットを構築した

> "Initial power calculations suggested that several hundred thousand subjects of diverse ages and linguistic backgrounds would be required to disentangle age of first exposure, age at testing, and years of exposure (we return to issues of power in the discussion, below). The standard undergraduate subject pool is not nearly large or diverse enough to achieve this, nor are crowdsourcing platforms like Amazon Mechanical Turk... we developed an Internet quiz we hoped would be sufficiently appealing as to attract large numbers of participants." (p.3)

インターネットの viral dissemination（Facebook で 300,000 回以上 share）を利用した quiz platform（gameswithwords.org の "Which English"）で 669,498 人のデータを収集。38 言語族から 1000 人以上の native speakers を含む大規模・多様性データを実現した。

### 主張 3: Grammar-learning ability は 17.4 歳で急減する

> "The best-fitting model (R² = 0.89) involved a rate change beginning at 17.4 years (Fig. 4E). The fit was significantly better than the best fit for alternative models in which learning rate did not change (R² = 0.66) or changed according to a step function with no further decline in the learning rate after the initial drop (R² = 0.70)." (p.7)

ELSD モデル（Exponential Learning with Sigmoidal Decay）が最良適合。learning rate が 17.4 歳までほぼ一定、その後 sigmoid で減衰するモデル。従来の「childhood からの steady decline」「puberty での step drop」の両方を有意に上回る。

### 主張 4: 新しく導入した ELSD モデル

> "g(t) = 1 - exp[-∫(t_e to t) E r dt]" (p.6, Eq. 1)
>
> "r(t) = { r_0 if t ≤ t_c ; r_0(1 - 1/(1+exp(-α(t-t_c-δ)))) if t > t_c }" (p.6, Eq. 2)

grammatical proficiency g(t) を exponential learning process でモデル化。learning rate r は age t_c まで一定で、それ以降 sigmoid で変化。パラメータ α（sigmoid の傾き）、δ（center shift）、t_c（開始年齢）、r_0（初期 rate）、E（experience discount factor）を Differential Evolution で同時最適化。Monte Carlo split-half cross-validated R² で評価し過剰適合を回避。

### 主張 5: Critical period の終わりは childhood でなく late adolescence

> "On the assumption that the present results apply broadly to syntax acquisition by diverse learners, they have profound theoretical implications. Most importantly, they clarify the shape of the well-attested critical period for second-language acquisition: a plateau followed by a continuous decline. The end of the plateau period must be due to changes in late adolescence rather than childhood, whether they are biological, social, or environmental." (p.12)

17.4 歳という結果は、"syntactic pruning in the first few years of life" の仮説（Johnson & Newport 1989, Lenneberg 1967, Pinker 1994）と整合しない。既存の神経学的説明の多くは childhood の変化に基づいており、この時期的不整合を説明できない。

### 主張 6: ホルモン仮説も働くメモリ仮説も棄却される

> "Also casting doubt on the effect of hormones is our finding that girls do not show a decline in learning ability before boys do, despite their earlier age of puberty... Likewise, the critical period cannot be explained by documented developmental changes in working memory, episodic memory, reasoning ability, processing speed, or social cognition (Hakuta et al., 2003; Hartshorne & Germine, 2015; Klindt, Devaine, & Daunizeau, 2017; Morgan-Short & Ullman, 2012; Newport, 1988)." (p.12)

thinking 能力や memory 能力の時間的発達と critical period の 17.4 歳ピンポイント減衰が一致しないことを、供給データと既存文献から確認。"any prior specific hypothesis that we know of" が 17.4 歳を予測できない、と強く述べる。

### 主張 7: Native speaker ですら asymptotic 到達には 30 年かかる

> "Little is known about how long it takes learners to reach asymptotic performance... Inspection of Fig. 5B suggests that native speakers did not reach asymptote until around 30 years old, though most of the learning takes place in the first 10-20 years." (p.7-8)

Fig. 5B で monolingual 話者ですら 30 歳まで微細な文法習得が続くことを示す。これは syntax acquisition が "protracted period of learning"（延長された学習期間）であることを示唆。

## 4. 方法論

論文の方法論は 4 段階:

1. **データ収集 (N = 669,498)**: gameswithwords.org で英語文法 132 項目クイズ（passivization, clefting, agreement, relative clauses, preposition use, wh-movement 等）と人口統計アンケート（age, country, L1 languages, education）を実施。Facebook 300,000+ share で viral 広がり
2. **3 群分類**: monolingual (N=246,497), immersion learners (N=45,067), non-immersion learners (N=266,701)。immersion は English-speaking 国で 90% 以上の L2 生活、non-immersion は 10% 未満 + ≤1 年
3. **ELSD モデル適合**: age of first exposure t_e、current age t、experience E の 3 変数を同時推定する exponential learning process。learning rate r(t) の piecewise（constant → sigmoidal decay）を導入。Differential Evolution で 3 群同時にパラメータ最適化、Monte Carlo split-half cross-validated R² で 過剰適合回避
4. **頑健性検査**: multivariate adaptive regression splines で ultimate attainment を独立推定し ELSD の結論を再現。item-level permutation analysis で exposure age ×難易度交互作用を検出（結果は無相関）。L1 言語族別分析（Uralic, Slavic, West Germanic, Romance, Turkic, Chinese）で effect が L1 非依存であることを示す

## 5. 5段階との対応候補

D17 は「言語の発生」領域。本論文の主題は **個体における言語習得能力の時間的プロファイル**。言語獲得そのものの「創造過程」とは距離があるが、幼児期から思春期後期にかけての「学習可能性の場」の構造を記述する。

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | Birth to 17.4 歳の "plateau" 期間。neural/cognitive plasticity の window。Lenneberg 以来の "window" 概念 | 強 | "grammar-learning ability is preserved almost to the crux of adulthood (17.4 years old) and then declines steadily" (Abstract); "a plateau followed by a continuous decline" (p.12) |
| 2 波 (Wave) | L2 exposure の到来と syntax 習得の伝播過程。exponential learning process | 中 | "modeled syntax acquisition as a simple exponential learning process: g(t) = 1 - e^(-∫Erdt)" (p.6, Eq. 1) |
| 3 縁 (Relation) | L1 と L2 の接触関係。immersion vs non-immersion の環境差が learning rate に与える効果 | 中 | "we modeled a possible developmental change in the learning rate r as a piecewise function" (p.6); 3 群（monolingual / immersion / non-immersion）比較 |
| 4 渦 (Vortex) | 17.4 歳で learning rate が急落する "sigmoidal decay" の不連続。場の終了と新しい構造の立ち上がり | 中-強 | "the best-fitting model (R² = 0.89) involved a rate change beginning at 17.4 years" (p.7); "a sharply defined critical period" (p.1); Fig. 4E |
| 5 束 (Bundle) | なし。本論文は 個人レベル の学習軌跡を扱い、集合的「束」を論じていない | なし | -- |

**判定基準**:
- Stage 1 を「強」とした。"plateau period" が 17.4 歳まで続くという発見は、学習可能性の「場」が定義された持続時間を持つことを示す。
- Stage 4 を「中-強」とした。17.4 歳の sigmoidal decay は「場の終了 → 別様態への移行」という不連続であり、vortex 的な立ち上がり構造に近い。ただし著者は vortex 的視点ではなく、神経成熟や cultural transition の帰結として論じる。
- Stage 2, 3 を「中」とした。exponential learning process と L1/L2 の接触関係は構造的類似。
- Stage 5 を「なし」とした。個人レベルの critical period 研究で、集合的束の議論はない。

## 6. 限界・留意事項

- **書記コンプレヘンション偏重**: 文法判定テストは書字・読解能力に依存し、phonology や oral production の critical period とは異なる可能性がある（p.11, §4.1.2）
- **自己報告バイアス**: インターネット self-report データは厳密な lab measurement より noisy。ただし著者は robustness を複数方法で確認
- **クロス言語汎化の限界**: 38 言語族を扱うが、英語を target language としたデータのみ。他の target language では結果が異なる可能性（author 自身が "our results apply broadly to syntax acquisition by diverse learners" を仮定として明示）
- **"critical period" の原因は未特定**: 17.4 歳という timing は既知の神経・ホルモン・認知発達のどの変化とも一致しない。"an epiphenomenon of culture" (p.13) という可能性も排除されていない
- **ELSD モデルの仮定**: piecewise 関数（constant → sigmoid）は単純化であり、より複雑な trajectory（段階的減衰、非線形干渉）は捉えにくい
- 5 段階の対応評価は、本論文が扱う「学習能力の時間的プロファイル」と「創造過程の 5 段階」の構造的類似に留まる。著者は言語獲得を創造と捉えていない

## 7. 未読解セクション（部分読解の場合）

本文 pp.9-10 (§4.1.3 Item selection and quiz difficulty の詳細、および 4.1.4 の後半) を部分読解。Supplementary Materials (17 pages、pp.16-32) は未読。主要論点（ELSD モデル、17.4 歳の発見、既存仮説の棄却）は読了。
