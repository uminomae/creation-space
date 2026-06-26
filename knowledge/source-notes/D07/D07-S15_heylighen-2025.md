# Why Emergence and Self-Organization Are Conceptually Simple, Common and Natural

**source_id**: S15 | **domain_id**: D07
**access_status**: raw-confirmed
**読解日**: 2026-06-26 | **読解者**: claude-opus-4-8
**読解方法**: Read (PDF, image mode)
**原典ページ数**: 17 (本文 pp.1-15 + 文献 pp.15-17) | **読解ページ範囲**: 全 17 ページ（本文全節 §1-§12 精読、文献一覧 ref.1-67 概観）

---

## 1. 書誌情報

- **著者**: Francis Heylighen (Center Leo Apostel, Vrije Universiteit Brussel)
- **タイトル**: Why Emergence and Self-Organization Are Conceptually Simple, Common and Natural
- **出典**: *Complexities* (MDPI) 2026, 2(1), 6
- **DOI**: 10.3390/complexities2010006
- **掲載日**: Published 13 March 2026（Received 18 Dec 2025 / Accepted 10 March 2026）。Open Access (CC BY)。
- **資金**: John Templeton Foundation, project "The Origins of Goal-Directedness" (grant ID61733)
- **年表記注記**: manifest source_title は「2025」（投稿年ベース）だが、正式な出版は *Complexities* 2026, 2, 6（2026-03-13）。引用時は 2026 が権威的。本論文は 2023 年 UM6P の Science Week on Complexity 招待講演の初の正式出版版。

## 2. 要旨（D07 工学・情報の観点で読んだ内容）

本論文は「創発（emergence）」と「自己組織化（self-organization）」が、突飛な形而上学を必要としない**概念的に単純な**現象であることを、系統理論・サイバネティクス・力学系の言葉で論証する。D07（工学・情報科学）視点で読むと、本論文の骨格は徹底して**入出力・カップリング・制約・フィードバック**という制御工学/システム理論の語彙で構築されている: (1) 性質を「系への入力と対応する出力の関係」として操作的に定義（量子測定論の observable 定義を一般化）、(2) 系を「部品が入出力で連結（coupled）された全体」とし、連結の型を serial / parallel / circular に分類、(3) 自己組織化を「変異＋自然選択により安定構成が残る」機構として定式化（Ashby の self-organization 原理）、(4) 安定構成を力学系の**アトラクタ**＝制約として捉え、(5) 創発した制約が部品を「下方因果（downward causation）」で規定する emergent law（遺伝コード・文法・規範）になる、と展開する。情報科学的には「化学組織理論（Chemical Organization Theory）」による自己維持反応網のモデル化が中核。

## 3. 主要主張（原文引用付き）

### 主張 1: 性質は「入力と出力の関係」として操作的に定義される（測定論の一般化）

> "Unlike classical mechanics, quantum mechanics does not assume that the properties of some system, such as an electron, are inherent to the system. Instead, quantum theory defines properties as the outcome of an observation, i.e., an interaction between the system and some observation apparatus controlled by the experimenter. [...] The property is then established by the relation between input and output." (pp.4)

性質を実体に内在するものではなく、**入力（stimulus/preparation）に対する出力（response/detection）の関係**として定義する。これは制御工学・情報科学の transfer function（伝達関数）的な系の見方であり、創発性質もこの枠組みで「全体の入出力関係」として扱える。

### 主張 2: 系＝カップリングされた全体。連結の型は serial / parallel / circular

> "We say that components form a system or whole when they are coupled in a particular manner. When they are independent, i.e., not coupled, then the components form an aggregate rather than a system. [...] The simplest case of coupling is serial (or sequential): components A and B are coupled in series if the output of A forms (part of) the input of B. Other rudimentary forms of coupling are parallel [...] and circular (input of A is output of B and vice-versa)." (p.5)

部品が独立なら集合体（aggregate, 例: 砂）、入出力が連結されれば系（system, 例: 砂岩）。連結の型（直列・並列・循環）の組合せが複雑なネットワーク（マザーボードの集積回路、食物網、細菌の代謝網）を成す。これは D07 のシステム/回路/ネットワーク設計そのものの語彙。

### 主張 3: 系は部品への「制約」である

> "Thus, a system can be understood as imposing a constraint on its components. In contrast, for an aggregate the components are free to interact in any which way. [...] Such a constraint defines a certain order or organization in the system, restricting the number of possible interactions between components." (p.6)

全体の形成＝部品の自由度の制限。気体（集合体・自由）と結晶（系・幾何的制約）の対比。情報理論的には、制約が系の状態空間を縮約し秩序＝低エントロピーを定義する。

### 主張 4: 自己組織化＝変異＋自然選択。安定構成が残る（Ashby の原理）

> "Stable configurations (by definition of stability) tend to persist, while unstable ones tend to fall apart." (p.6)

> "The mechanism of mutual adaptation we described here is what the cybernetician Ashby has formulated long ago as 'the principle of self-organization'. Another way to formulate this principle uses the language of dynamical systems [...] The dynamics of such a complex system typically exhibits a number of attractors [...] In other words, the system is now constrained: it no longer has the freedom to move outside the attractor." (p.7)

自己組織化は設計者なしに安定構成を選び出す機構で、トートロジー的に単純（安定なものは安定だから残る）。サイバネティクス（Ashby）と力学系（アトラクタ）の双方で定式化される。アトラクタに入った系は外に出られない＝制約＝組織化。これが D07 の制御理論的中核。

### 主張 5: 「局所相互作用から大域秩序が立ち上がる」— 磁化の波

> "Through on-going random variation caused by thermal fluctuations, the neighboring ones will sooner or later also join the aligned configuration [...] Thus, an accelerating 'wave' of alignment will tend to sweep through all the atoms in the material, starting from the initial local alignment, until alignment becomes global [...] This illustrates a common characterization of self-organization as global order arising from local interactions." (p.8)

磁化を例に、局所的整列が正のフィードバックで増幅され「整列の波」として系全体に広がり大域秩序になる。"global order arising from local interactions" は自己組織化の標準的特徴づけ。

### 主張 6: 自己維持反応網＝化学組織（Chemical Organization Theory）

> "Chemical Organization Theory is a recently developed formalism for modeling such self-maintaining networks of processes [...] It demonstrates that such self-sustaining configurations (called 'chemical organizations') can self-organize rather easily. This happens by different processes mutually adjusting their inputs and outputs until they are either in balance with others—or eliminated because they could not find a sufficient inflow of resources." (p.9)

生態系や代謝のような自己維持系は、入出力が均衡する「化学組織」に自己組織化する。入力 →F・出力 E→ をもつ反応網が閉じて自己生産的になる形式モデル。情報科学的に autopoiesis を計算可能化したもの。

### 主張 7: 創発性質は本質的に予測不能（量子不確定性＋バタフライ効果）

> "We may conclude that the forms and properties that could emerge through the processes of self-organization and evolution intrinsically cannot be determined. This statement holds not only in practice, but also in principle, because of the Heisenberg uncertainty principle and the non-linear amplification of the quantum fluctuations entailed by the butterfly effect." (p.11)

組合せ爆発（Kauffman の adjacent possible）＋非線形増幅＋量子不確定性により、創発形態は原理的に予測不能＝真に新奇（創造的）。

### 主張 8: 下方因果と emergent law（遺伝コード・文法・規範）

> "A whole imposes a restriction on the freedom of its constituent parts: they can no longer act independently, but must obey certain rules, norms, or 'laws' inherent to the system to which they belong. [...] This feature is called downward causation. It is as if the whole, in a 'top-down' manner, tells its parts how they should behave." (pp.11-12)

> "Thus, the specific code used by life is traditionally considered as a 'frozen accident': something that might have ended up very differently, but which now no longer can be changed." (p.12)

創発した全体は部品を上位から規定する（downward causation）。遺伝コード・言語文法・社会規範はいずれも偶発的自己組織化で固定された「凍結事故（frozen accident）」型の emergent law。

## 4. 方法論

理論論文（概念分析）。実験・データなし（"No new data were created"）。方法は (1) 性質の操作的定義（量子測定論の一般化）、(2) システム理論のカップリング分類、(3) 変異＋選択＋制約による自己組織化の定式化、(4) 力学系（アトラクタ）・サイバネティクス（Ashby）・化学組織理論の統合、(5) 多領域の具体例（電気双極子・NaCl・磁化・結晶・代謝・遺伝コード・文法・社会規範）による例証。Heylighen 自身の先行研究（self-organization, goal-directedness, relational agency）に依拠。

## 5. 5段階との対応候補（D07 工学・制御・情報角度）

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | 連結前の独立部品群＝集合体（aggregate）。自由に相互作用しうる可能空間 | 強 | "When they are independent, i.e., not coupled, then the components form an aggregate rather than a system. An example of an aggregate is sand [...]" (p.5) |
| 2 波 (Wave) | ランダム変異・衝突による構成探索、正フィードバックで増幅される「整列の波」が系を掃く | 強 | "an accelerating 'wave' of alignment will tend to sweep through all the atoms in the material, starting from the initial local alignment, until alignment becomes global" (p.8) |
| 3 縁 (Relation) | 入出力が dependable に連結し制約が生じる瞬間／安定構成が選択される閾値 | 強 | "A whole is formed when components become coupled, i.e., when inputs and outputs become connected in a dependable manner [...] the interactions between the different components are not arbitrary but constrained." (pp.5-6) |
| 4 渦 (Vortex) | アトラクタとして立ち上がる創発的全体（分子・磁区・化学組織）。自己維持する個 | 強 | "the system will typically end up in an attractor [...] it can no longer leave that attractor. The further trajectory of the system is now restricted to remain within the attractor." (p.7) |
| 5 束 (Bundle) | 下方因果として残る emergent law＝再利用される制約（遺伝コード・文法・規範＝frozen accident） | 強 | "This feature is called downward causation. It is as if the whole, in a 'top-down' manner, tells its parts how they should behave." (p.12); "the specific code used by life is traditionally considered as a 'frozen accident'" (p.12) |

**判定基準**:
- **強**: 著者が直接その概念・構造を論じており、5段階の定義と明確に対応する
- **弱**: 構造的類似はあるが、著者の文脈・意図とは異なる読みである
- **なし**: 対応が見出せない。無理に作らない

**注記**: 本論文は5段階モデルと**全段階で強対応**する稀な原典である。Heylighen の「集合体→カップリング→制約→アトラクタ→下方因果（emergent law）」の流れが、5段階「場→波→縁→渦→束」とほぼ同型に読める。特に Stage 2 波は著者自身が "wave" の語で記述（磁化）、Stage 4 渦はアトラクタ＝立ち上がる個、Stage 5 束は frozen accident として残る制約、と語彙レベルで一致する。ただし「創造」概念そのものは結語の "creation is an on-going process of the emergence of novel phenomena" (p.14) で一度言及されるのみで、5段階対応は評価者側の解釈である点は他原典と同様。

## 6. 限界・留意事項

- 概念論文であり、実証データ・数理的厳密化は伴わない（Chemical Organization Theory 等は別文献に依拠）。
- 「自己組織化は単純」という主張は、変異＋選択のトートロジー的単純さに依存しており、複雑な創発の**具体的予測**を与えるものではない（著者自身が予測不能性を主張・主張7）。
- 多領域の例（双極子・NaCl・磁化・遺伝コード・文法）は説明的例証であり、各領域の専門的厳密性は犠牲にされている。
- D07 視点で読んだが、本論文自体は領域横断的メタ理論であり、特定の工学システム設計を扱うわけではない（工学は語彙の出所として機能）。

## 7. 未読解セクション

本文 §1-§12（pp.1-15）を全節精読。文献一覧 ref.1-67（pp.15-17）は個別確認時に参照が必要だが、本論の理解には読解済み範囲で十分。図 Figure 1（電気双極子）・Figure 2（磁化）はキャプション中心に読解。
