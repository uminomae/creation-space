# A Free Energy Principle for Biological Systems

**source_id**: D02-S14 | **domain_id**: D02
**access_status**: url-verified
**読解日**: 2026-04-10 | **読解者**: Claude Opus 4.6 (1M context)
**読解方法**: WebFetch (PMC HTML)
**原典ページ数**: 22 (pp.2100-2121) | **読解ページ範囲**: 全文 (PMC HTML版、セクション1-6)

---

## 1. 書誌情報

- **著者**: Karl Friston
- **タイトル**: A Free Energy Principle for Biological Systems
- **出典**: Entropy, 14(11), 2100-2121 (2012)
- **DOI / URL**: https://doi.org/10.3390/e14112100 | PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC3510653/

## 2. 要旨（読んだ内容に基づく）

本論文は、生物システムが無秩序への自然な傾向に抗して組織を維持する能力を説明する自由エネルギー原理を提示する。シナジェティクスの円環的因果性（スレイビング原理）と結合力学系のモデルを用い、非線形 Fokker-Planck 方程式を通じてランダム力学系の定式化を行う。変分自由エネルギーの最小化が情報ボトルネック法と形式的に等価であることを示し、ベイズ推論・能動的推論・最大エントロピー原理を系として導出する。神経科学への応用として予測符号化による脳の階層的処理を具体化している。

## 3. 主要主張（原文引用付き）

### 主張 1: 生物システムは環境の構造的規則性を蒸留し、自らの形態と内部力学に体現する

> "biological systems can distil structural regularities from environmental fluctuations...and embody them in their form and internal dynamics." (Section 1)

生物システムが環境をモデル化することでホメオスタシスを獲得し、自身が占める状態の数を制限できるという中心的洞察。これが自由エネルギー原理の動機となる。

### 主張 2: 自由エネルギー原理 ― 内部状態が自由エネルギーを最小化するなら、系は最小作用の原理に従い能動系である

> "If the internal states r(t) minimize free energy, then the system conforms to the principle of least action and is an active system" (Section 3, Proposition 1)

これが論文の中核命題。変分自由エネルギーの最小化がサプライザル（自己情報量）の最小化に帰着し、エルゴード仮定のもとでシャノンエントロピーの最小化と等価になることを証明する。

### 主張 3: 能動的推論 ― 系は自らが「見ることを期待するもの」を選択的にサンプリングする

> "Systems that conform to the free energy principle will selectively sample what they 'expect to see'" (Section 3, Corollary 2)

系は事後信念のもとで最も確率の高い感覚状態を選択的にサンプリングする。これは知覚（内部状態の更新）と行為（環境のサンプリング）を統一的に説明する能動的推論の枠組みを確立する。

### 主張 4: 系はモデルを意図的に構築するのではなく、モデルを含意しない系は存在し得ない

> "if they did not entail a model that satisfies [Equation 13] they would not exist; or only exist for short periods of time (until their external states were dispersed by environmental fluctuations)." (Section 6)

これは淘汰論的な議論であり、自由エネルギー原理が設計原理ではなく存在条件であることを強調している。

### 主張 5: 自由エネルギー最小化は情報ボトルネック法と形式的に等価である

> "Active systems that minimise variational free energy...comply with the constraints afforded by the information bottleneck method." (Section 4)

エルゴード仮定と MAP 推論のもとで、自由エネルギーの経路積分が情報ボトルネック基準と数学的に一致することを示す。これにより、正確さと複雑さのトレードオフが自然に導かれる。

## 4. 方法論

理論物理学・確率論に基づく演繹的アプローチ。

- **ランダム力学系**: 状態空間を内部状態 R と外部状態 S に分割し、確率微分方程式で記述
- **エルゴード理論**: エルゴード密度の存在を仮定し、長時間平均と集合平均の等価性を利用
- **変分法**: 自由エネルギー汎関数を定義し、提案密度と生成密度の KL ダイバージェンスを通じて変分推論を定式化
- **情報理論**: 情報ボトルネック法との形式的等価性を導出
- **神経科学への適用**: 階層的生成モデルと予測符号化スキームによる具体化

実験データは含まないが、Table 1 で知覚・感覚学習・注意・運動制御・行動にわたる経験的予測を整理し、Table 3 で神経回路レベルの予測（階層的皮質組織、機能的非対称結合、反復抑制）を列挙している。

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | エルゴード密度・ランダム力学系の初期状態空間 | 弱 | "systems whose physical states x(t) are confined to a bounded subset of states and remain there indefinitely...possesses a random dynamical attractor" (Section 2) |
| 2 波 (Wave) | 環境ゆらぎとサプライザル | 弱 | "how a biological system...exposed to random and unpredictable fluctuations in its external milieu, can restrict itself to occupying a limited number of states" (Section 2) |
| 3 縁 (Relation) | 円環的因果性 ― 内部状態と外部状態の結合 | 弱 | "internal states depend on external states, while the internal couple back to the external states by changing their flow or motion" (Section 2) |
| 4 渦 (Vortex) | 能動系としての自己組織化・アトラクターへの収束 | 弱 | "an ergodic random dynamical system m=(Rd,phi) is said to be active if it possesses an internal map that satisfies (locally) the extremal condition" (Section 2, Definition 1) |
| 5 束 (Bundle) | なし | なし | ― |

**判定基準の説明**: 全て「弱」または「なし」とした。Friston の自由エネルギー原理は生物系の定常的な秩序維持メカニズムを記述するものであり、「創造」プロセスの段階的展開を直接論じていない。Stage 1-4 への対応は構造的類似に留まり、著者の文脈・意図とは異なる読みである。Stage 5（束: 方向性を持つ集合構造）に対応する議論は本論文には見出せなかった。

## 6. 限界・留意事項

- 本論文は自己組織化の維持原理を扱い、創造的な新規構造の生成過程を直接論じていない。自由エネルギー原理はアトラクターへの収束（秩序維持）を説明するが、アトラクター自体の生成・変容は射程外
- PMC HTML 版での読解のため、原著 PDF のページ番号を引用に付与できなかった。セクション番号で代替している
- 数式は PMC の HTML レンダリングから読み取ったため、記法の細部に不正確さがある可能性がある
- 本論文は理論的枠組みの提示であり、実験的検証は他の文献に委ねられている

## 7. 未読解セクション

全セクション読了（Section 1-6、PMC HTML版）。ただし、数式の詳細な導出過程（証明の中間ステップ）は自然言語での要約に依拠しており、逐語的な数式展開の検証は行っていない。
