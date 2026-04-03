# 添付テンプレートの3件記入と標準形式出力（言語学・構造類似調査）

## エグゼクティブサマリー

添付テンプレートは、創造プロセスを **場（Field）→波（Wave）→縁（Relation）→渦（Vortex）→束（Bundle）** の5段階として捉え、別領域の理論・現象がこの段階構造と「過程として」同型かどうかを点検する形式でした（表面的な語の一致ではなく、段階的な変容の流れ＝プロセスの構造を対応させる）。  
本レポートでは、テンプレートで求められている「3件分の具体記入」を、言語学の領域から **(A) 臨界期仮説（成熟制約）**、**(B) ニカラグア手話の自発的出現と体系化**、**(C) 構文の創発（usage-based／construction grammar）** の3候補で埋め、各候補について「確立された事実（一次文献ベース）」と「5段階対応」を明示しました。  
全体として、**（B）新しい手話が社会的伝達と世代（コホート）差を通じて文法化・体系化していく観察可能な生成過程**は、5段階モデルの「場→束」の流れを最も具体的に示しやすく、構造類似が高いと評価できます。citeturn23view1turn5view1turn24view3

加えて、テンプレート記入内容を、標準的なデータ交換形式（CSV/JSON）でも再利用できるよう、**3件を同一データとしてCSVとJSONに変換した“出力例”**も併記しました。CSVの基本形はRFC 4180、JSONはRFC 8259およびECMA-404が仕様面の拠り所になります。citeturn5view3turn5view4turn22view2

## テンプレート形式とフィールド定義

本テンプレートは、可搬性が高い**プレーンテキスト（Markdown系）**で、(1)「確立された事実」、(2)「段階プロセスの記述」、(3)「5段階対応表」、(4)「構造類似の質」、(5)「牽強付会リスク」、(6)「主要文献」を1セットとして3回繰り返し、最後に総評を書く構造でした。

一方、一般にテンプレート配布・入力・集計では、以下の標準（または広く標準化された）形式が用いられがちです。特にCSVとJSONは「テキストで相互運用しやすい」点でテンプレート用途と相性が良く、Office系（Word/Excel）に相当するOOXMLも標準化されています。citeturn5view3turn5view4turn22view0turn22view2

| 想定形式 | 主な用途 | 標準・仕様の基準（代表例） |
|---|---|---|
| CSV | 3件を“行”として管理し、集計・フィルタ・可視化をしやすい | RFC 4180（行＝レコード、区切り、ヘッダ等の共通フォーマット指針）citeturn5view3 |
| JSON | 1件を“オブジェクト”として階層化（本文・表・根拠など） | RFC 8259（JSONのデータ交換フォーマット）／ECMA-404（JSON構文の標準）citeturn5view4turn22view2 |
| Word/Excel 相当 | 文書テンプレ配布や上長レビュー、表の装飾 | ECMA-376（Office Open XMLの語彙・表現・パッケージング）citeturn22view0 |
| プレーンテキスト（Markdown） | 人間が読み書きし、LLM入力にも転用しやすい | 厳密な単一標準より“慣習”が中心（ただしCSV/JSONほど形式拘束は弱い） |

### フィールド定義（今回のテンプレートの“入力欄”）

| 欄 | 意味 | 記入ルール（テンプレート要求） |
|---|---|---|
| [P] 確立された事実 | その理論・現象について、一次文献に基づく「動かしがたい観察・結果・主張」 | 3〜5点。著者名・年・論文/書籍タイトルを明記（本文中に具体として書く） |
| プロセス/段階の記述 | その領域固有のステップ（時間発展／生成順序／学習過程など） | 抽象語だけにしない。段階ごとに具体 |
| 5段階との構造対応 | 5段階（場/波/縁/渦/束）と、当該理論の対応概念のマッピング | 表で、対応概念・根拠・強度（高/中/低）を埋める |
| 構造類似の質 | 「表面的類似」ではなく「過程としての同型」かの短評 | 2〜3文。5段階に無い独自要素も併記 |
| 牽強付会リスク | 無理な当てはめ度合い | 高/中/低＋理由 |
| 主要文献 | 一次文献（中核） | 3〜5点。著者(年). タイトル. 雑誌/出版社, 巻, ページ |

## 言語学テンプレート記入例

### 言語学-A: 言語獲得の臨界期仮説と成熟制約（Critical Period Hypothesis / maturational constraints）

**[P] 確立された事実**:
- entity["people","Eric H. Lenneberg","neurolinguist; 1967 book"]（1967）が、言語獲得が乳幼児期から思春期までの「臨界期」に強く依存するという見取り図を提示したことは、第二言語研究での導入記述でも明確に参照されている。citeturn10view3turn12view2
- entity["people","Jacqueline S. Johnson","sla critical period study"]とentity["people","Elissa L. Newport","language acquisition scientist"]（1989）は、英語への到着年齢が3〜39歳の学習者を比較し、**到着年齢が思春期までの範囲では成績が年齢と強く関連**し、思春期以後は**成績が低くなる一方で個人差が大きい**というパターンを報告している。citeturn10view3turn12view0
- Newport（1990）は、言語学習に成熟（maturation）に伴う制約があり、露出開始が遅いほど到達点（asymptotic performance）が低下し、年齢効果は小児期で概ね線形、成人期で平坦化する、と整理している。citeturn12view1turn20view0
- entity["people","Joshua K. Hartshorne","language learning researcher"]ら（2018）は、非常に大規模なデータとモデル化により、年齢・経験年数・初回露出年齢の影響を分離し、文法学習能力が**17.4歳頃まで保たれ、その後に低下**するという推定を提示している。citeturn11view2
- entity["people","Jan Vanhove","sla statistical critique"]（2013）は、臨界期仮説研究での予測の曖昧さや統計的手続きの問題を論じ、再解析の結果として「臨界期が年齢効果を一意に規定する」とは言いにくい、という結論を示している。citeturn12view2

**プロセス/段階の記述**:
1. 学習者は（第一・第二言語いずれでも）ある時点で言語入力に継続的に曝露される。入力は“場”として与えられ、開始年齢が強い条件になる。citeturn12view2
2. 幼少期〜児童期では、入力への感受性が高く、文法判断などの到達度が年齢に沿って比較的滑らかに変化する（到着年齢が早いほど有利）。citeturn10view3
3. 成熟に伴い、（暗黙的学習・統計学習・音韻カテゴリ化などを含む）学習メカニズムの効率が変化し、到達点の上限が低下しうる、という整理がなされる。citeturn12view1turn11view2
4. 思春期以後は、成績が一様に下がるというより、**低めの平均＋大きい個人差**（環境・動機・教育・入力量等の複合）として現れやすい。citeturn10view3
5. 一方で、年齢効果の形状（どこが“折れ目”か、成分別に複数の感受期があるか等）には論争が残り、モデルの置き方で結論が変わり得る。citeturn12view2turn11view2

**5段階との構造対応（候補）**:

| 5段階 | この理論の対応概念 | 対応の根拠 | 強度（高/中/低） |
|--------|-------------------|-----------|----------------|
| 場（Field） | 学習者＋入力環境（没入/教室/家庭等）＋開始年齢 | まだ結果が分化していない「条件の場」 | 高 |
| 波（Wave） | 年齢に沿った感受性差の立ち上がり（児童期の線形な成績差） | 同一入力でも“差”が現れ、その差が増幅される | 高 |
| 縁（Relation） | 成熟制約と学習方略（暗黙→明示寄り等）の関係づけ | どの能力が何に効くかの「関係」が前景化 | 中 |
| 渦（Vortex） | 個人ごとの最終到達度（ultimate attainment）の収束 | 学習履歴が「その人の到達状態」としてまとまる | 中 |
| 束（Bundle） | 生涯にわたる能力プロファイル（可塑性の残余＋固定化） | 収束した到達度が長期的に保持され、群として分布を作る | 中 |

**構造類似の質**:  
連続的な年齢曲線を扱う理論であり、5段階のような離散ステップを“そのまま”持っているわけではない。ただし「条件の場→差の顕在化→機構の関係づけ→個別到達状態→集団分布として固定」という流れに再表現すると、5段階の“生成→安定”の方向性とは整合する。citeturn10view3turn11view2turn12view2

**牽強付会リスク**: 中（年齢効果を5分割して見せる部分は分析上の再記述であり、理論固有の段階列挙ではないため）citeturn12view2

**主要文献**:
- Lenneberg, E. H. (1967). *Biological Foundations of Language*. Wiley. citeturn10view4  
- Johnson, J. S., & Newport, E. L. (1989). Critical Period Effects in Second Language Learning: The Influence of Maturational State on the Acquisition of English as a Second Language. *Cognitive Psychology*, 21(1), 60–99. citeturn12view0turn10view3  
- Newport, E. L. (1990). Maturational Constraints on Language Learning. *Cognitive Science*, 14(1), 11–28. citeturn20view0turn12view1  
- Hartshorne, J. K., et al. (2018). A critical period for second language acquisition: Evidence from 2/3 million English speakers. *Cognition*, 177, 263–277. citeturn11view2turn15search6  
- Vanhove, J. (2013). The Critical Period Hypothesis in Second Language Acquisition: A Statistical Critique and a Reanalysis. *PLOS ONE*, 8(7), e69172. citeturn12view2  

### 言語学-B: 新しい手話の自発的出現と体系化（ニカラグア手話のコホート変化）

**[P] 確立された事実**:
- entity["country","ニカラグア","central america country"]で1970年代後半以降に新しい手話が出現し、**複数の学習者コホート（世代）を比較することで、生成途上の文法がどのように形作られるか**を観察できる、という研究条件自体が明確に述べられている。citeturn23view1
- entity["people","Ann Senghas","nicaraguan sign language researcher"]らのScience論文（2004）は、言語創出の初期に子どもが出来事を基本要素へ分解し、階層的に組み立てる現象を捉え、さらに後続コホートがそれを拡張して体系へ変換していく、という筋道を提示している。citeturn5view1turn21view0
- Senghas（2011）は、空間変調（spatial modulation）という中心的装置を題材に、**最初期コホートと次コホート**の比較から、要素が「形と機能」を変えながら文法へ組み込まれていくことを示している。citeturn23view1
- 同研究枠組みでは、空間変調が「誰（参加者役割）」と「どこ（位置・方位）」という2機能を持ち、より抽象的な“who”構文が先に慣習化した可能性が述べられている。citeturn23view1
- entity["people","Annemarie Kocaba","temporal language in nsl"]ら（2016）は、NSLにおける時間表現の出現を複数コホート比較で調べ、言語の創出が個体の達成に閉じず、社会的伝達と収束（convergence）過程を伴う点を論じつつ、最終版の掲載情報（*Cognition*, 156:147–163）を示している。citeturn24view3turn24view0

**プロセス/段階の記述**:
1. 共同体成立以前：個別家庭内のジェスチャ／ホームサインなど、十分に整った体系が“まだ分かれていない場”として存在する（統一規範が薄い）。citeturn23view1turn21view0
2. 共同体成立直後：複数の子どもが持ち寄る表現が混ざり、同じ意味領域に多様な実現が生まれる（揺れ・競合＝波）。citeturn23view1
3. 初期コホート：頻出の区別（役割、イベント構造など）が関係づけられ、装置（例：空間変調）の機能が割り当てられていく（縁＝関係の編成）。citeturn23view1turn21view0
4. 後続コホート：子どもの学習・再生産が、表現をより離散的・組合せ的に整え、階層構造を伴う“言語としてのまとまり”が強化される（渦＝まとまりの立ち上がり）。citeturn5view1turn21view0
5. 多コホートの共存：複数世代により、語彙・カテゴリー・装置が束ねられ、次の変化のベースとなる「構造としての残り方」をする（束）。citeturn24view0turn24view3

**5段階との構造対応（候補）**:

| 5段階 | この理論の対応概念 | 対応の根拠 | 強度（高/中/低） |
|--------|-------------------|-----------|----------------|
| 場（Field） | 共同体成立前後の“未統一な表現資源”（ホームサイン/ジェスチャ群） | 規範が薄く、まだ分化していない素材の場 | 高 |
| 波（Wave） | 初期の変異・競合（同義領域の多様な符号化） | 差が立ち上がり、揺れとして顕在化 | 高 |
| 縁（Relation） | 役割・位置などの機能分化と装置割当（例：空間変調の機能） | 境界で接する概念が関係として固定される | 高 |
| 渦（Vortex） | 離散性・組合せ性・階層化を伴う体系の立ち上がり | “言語らしさ”が一つのまとまりとして成立 | 高 |
| 束（Bundle） | 世代間伝播＋共同体の収束（convergence）で残る規範 | 渦が束ねられ、次世代の基盤となる | 高 |

**構造類似の質**:  
5段階モデルが想定する「溶けた場から、差が立ち、関係が編まれ、まとまりが立ち、構造として残る」という流れを、観察可能な言語生成（言語誕生）として具体化しやすい点で強い。とくに“コホート間での再編”が、5段階の移行を社会的時間軸で可視化する。citeturn23view1turn5view1turn24view3

**牽強付会リスク**: 低（出現・体系化の実時間プロセスがあり、5段階を「生成から安定化へ」の写像として扱いやすい）citeturn21view0turn23view1

**主要文献**:
- Senghas, A., et al. (2004). Children creating core properties of language: Evidence from an emerging sign language in Nicaragua. *Science*, 305(5691), 1779–1782. citeturn21view0turn5view1  
- Senghas, A. (2011). The Emergence of Two Functions for Spatial Devices in Nicaraguan Sign Language. *Human Development*, 53(5), 287–302. citeturn23view1  
- Senghas, A., & Coppola, M. (2001). Children creating language: How Nicaraguan Sign Language acquired a spatial grammar. *Psychological Science*, 12, 323–328. doi:10.1111/1467-9280.00359 citeturn23view1  
- Kocaba, A., et al. (2016). The emergence of temporal language in Nicaraguan Sign Language. *Cognition*, 156, 147–163. doi:10.1016/j.cognition.2016.08.005 citeturn24view3turn24view0  

### 言語学-C: 構文の創発（usage-based approach / construction grammar）

**[P] 確立された事実**:
- entity["people","Joan L. Bybee","usage-based linguist"]とentity["people","Clay Beckner","usage-based linguist"]は、usage-based理論が「言語を身体化され社会的な行動」とみなし、使用（usage）が言語構造に影響するという視点を核に据える、と述べている。citeturn26view0turn28search10
- 同章は、言語の単位と構造が個別のコミュニケーション出来事から創発し、言語領域に特有の生得知識に依存することを避け、統計学習・チャンク化・カテゴリ化などの一般的認知能力から機構を導く、と整理している。citeturn14view0turn26view0
- その帰結として、子どもは構文の最初の使用を特定語彙に結びついた形で産出し、反復と一般化により他語彙へ拡張して生産的使用に至る、という獲得の型が述べられている。citeturn14view0
- entity["people","Michael Tomasello","usage-based language acquisition"]（2003）は、言語獲得を usage-based に捉え、言語能力を他の認知能力と切り離された“本能”として仮定しない方向で理論化している。citeturn7view2turn7view0
- entity["people","Adele E. Goldberg","construction grammar linguist"]（1995, 2003）は、構文（construction）を形式‐意味（機能）の対として中心化し、構文そのものが語彙とは独立に意味を担いうる、という立場を提示している。citeturn13view2turn13view0

**プロセス/段階の記述**:
1. コミュニケーション出来事の反復（入力の場）：使用事例（例文・談話）が大量に蓄積され、まだ“規則”は前面化しない。citeturn14view0
2. 反復と偏りの顕在化（波）：頻度・共起・分布の偏りが、学習側にとって“繰り返される塊”として立ち上がる。citeturn26view0turn14view0
3. チャンク化とカテゴリ化（縁）：塊が処理単位になり、類似事例がカテゴリーとして束ねられ、部分的抽象化（スキーマ化）が進む。citeturn14view0
4. 構文ネットワークの成立（渦）：形式‐意味ペアが「構文」として保存され、語彙の多様化にも耐える抽象構文が立ち上がる。citeturn13view0turn7view2
5. 生産性と伝播（束）：構文同士の一般化・連結が進み、知識体系（ネットワーク）が安定して残り、獲得・使用・変化の基盤になる。citeturn13view2turn26view0

**5段階との構造対応（候補）**:

| 5段階 | この理論の対応概念 | 対応の根拠 | 強度（高/中/低） |
|--------|-------------------|-----------|----------------|
| 場（Field） | 具体的使用事例の蓄積（談話・例文・相互行為） | まだ分化していない“経験の場”が前提 | 高 |
| 波（Wave） | 分布の偏り／頻度の勾配（反復による目立ち） | 差が立ち上がり、パターンとして揺れる | 高 |
| 縁（Relation） | チャンク化・カテゴリ化・類推による関係づけ | 境界で事例が接続され、規則性が生まれる | 高 |
| 渦（Vortex） | 構文（形式‐意味ペア）の成立と抽象構文化 | 「まとまり」として機能する単位が立つ | 高 |
| 束（Bundle） | 構文ネットワーク（一般化・生産性・伝播） | 単位が束ねられ、構造として残る | 高 |

**構造類似の質**:  
usage-based／construction grammar は「使用という場」から「パターンの顕在化」「関係づけ」「単位化（構文）」「ネットワークとしての残り方」へと、生成の流れを連続的に扱うため、5段階の“形が生まれて残る”方向性と噛み合う。独自要素としては、頻度分布や処理効率（チャンク化）など、5段階には明示されない“計量・認知メカニズム”が中核に置かれる。citeturn14view0turn13view0turn13view2

**牽強付会リスク**: 低（5段階を「経験→分化→関係→単位→ネットワーク」という生成スキーマとして読むと自然に対応しやすい）citeturn14view0turn13view0

**主要文献**:
- Tomasello, M. (2003). *Constructing a Language: A Usage-Based Theory of Language Acquisition*. Harvard University Press. citeturn7view0turn7view2  
- Bybee, J. L., & Beckner, C. (2010). Usage-based theory. In entity["people","Bernd Heine","linguist; handbook editor"] (Ed.), *The Oxford Handbook of Linguistic Analysis* (pp. 827–855). entity["organization","Oxford University Press","publisher; oxford"]. citeturn28search10turn26view0  
- Goldberg, A. E. (1995). *Constructions: A Construction Grammar Approach to Argument Structure*. entity["organization","University of Chicago Press","publisher; chicago"]. citeturn13view2  
- Goldberg, A. E. (2003). Constructions: a new theoretical approach to language. *Trends in Cognitive Sciences*, 7(5), 219–224. citeturn13view0  

## 標準形式への変換例（CSV/JSON）

### 3件サマリ表

| エントリ | 候補名 | 構造類似（総合） | 牽強付会リスク | “一次文献”の核 |
|---|---|---|---|---|
| 言語学-A | 臨界期仮説・成熟制約 | 中 | 中 | Johnson & Newport 1989／Newport 1990／Hartshorne et al. 2018 |
| 言語学-B | ニカラグア手話の出現・体系化 | 高 | 低 | Senghas et al. 2004／Senghas 2011／Kocaba et al. 2016 |
| 言語学-C | 構文の創発（usage-based / construction grammar） | 高 | 低 | Tomasello 2003／Bybee & Beckner 2010／Goldberg 1995, 2003 |

### CSV（RFC 4180を想定したヘッダ＋3レコード）

RFC 4180は、CSVにおける「1行＝1レコード」「ヘッダ行の任意性」など、典型実装で共有される形式を文書化しています。citeturn5view3

```csv
entry_id,candidate_name,overall_similarity,risk,key_sources
LI-A,"臨界期仮説・成熟制約",medium,medium,"Johnson & Newport (1989); Newport (1990); Hartshorne et al. (2018); Vanhove (2013)"
LI-B,"ニカラグア手話の出現・体系化",high,low,"Senghas et al. (2004); Senghas (2011); Kocaba et al. (2016)"
LI-C,"構文の創発（usage-based / construction grammar）",high,low,"Tomasello (2003); Bybee & Beckner (2010); Goldberg (1995); Goldberg (2003)"
```

### JSON（RFC 8259 / ECMA-404の想定）

JSONは、テキストベースで言語非依存のデータ交換形式としてRFC 8259で定義され、構文としてのJSONはECMA-404でも標準化されています。citeturn5view4turn22view2

```json
[
  {
    "entry_id": "LI-A",
    "candidate_name": "臨界期仮説・成熟制約",
    "overall_similarity": "medium",
    "risk": "medium",
    "key_sources": [
      "Johnson & Newport (1989)",
      "Newport (1990)",
      "Hartshorne et al. (2018)",
      "Vanhove (2013)"
    ]
  },
  {
    "entry_id": "LI-B",
    "candidate_name": "ニカラグア手話の出現・体系化",
    "overall_similarity": "high",
    "risk": "low",
    "key_sources": [
      "Senghas et al. (2004)",
      "Senghas (2011)",
      "Kocaba et al. (2016)"
    ]
  },
  {
    "entry_id": "LI-C",
    "candidate_name": "構文の創発（usage-based / construction grammar）",
    "overall_similarity": "high",
    "risk": "low",
    "key_sources": [
      "Tomasello (2003)",
      "Bybee & Beckner (2010)",
      "Goldberg (1995)",
      "Goldberg (2003)"
    ]
  }
]
```

## 言語学 総評

**構造類似の全体的強度**: 高（ただし、臨界期は「段階数を持つ理論」ではなく、連続曲線を段階化して読む側面があるため、1件だけ中評価が混ざる）citeturn12view2turn11view2

**最も構造類似が高い候補**: ニカラグア手話の自発的出現と体系化（言語誕生の実時間プロセスが「場→束」を具体的に追える）citeturn23view1turn21view0turn24view3

**この領域の独自性**:  
言語学の強みは、「個体内メカニズム（学習・処理）」と「共同体内メカニズム（収束・世代間伝播）」が絡み合って、構造が“生成され、残っていく”ところを、観察・実験・コーパスなど複数手法で支えられる点にある。citeturn14view0turn24view0

**既存エントリ（EV-LI-001〜003）との関係**:  
- EV-LI-001（文法化連鎖）には近接する語彙が出るが、今回の言語学-Cは「構文ネットワークの創発（獲得と使用）」に焦点を置き、歴史変化の典型連鎖そのものは扱っていない。citeturn14view0turn13view0  
- EV-LI-002（音変化の拡散モデル）とは対象機構（音韻拡散 vs 生成・体系化）が異なる。  
- EV-LI-003（クレオール形成）と今回の言語学-Bはいずれも“言語生成”だが、NSLは主に手話共同体内部での創出と世代差に焦点があり、想定される入力条件（音声言語接触／第二言語化など）や生成メカニズムが別立てで議論される。citeturn21view0turn23view1

**注意点**:  
- 5段階対応の「強度」は、一次文献が5段階を明示しているわけではなく、テンプレート目的（構造類似の“指し示し”）に沿った評価である。  
- 臨界期仮説は、年齢効果の存在自体は広く観察されても、臨界期という単一機構で説明できるかは継続的に争点があるため、総合評価を過度に一方向へ固定しない。citeturn12view2turn11view2

## 前提と留意点

本記入は、添付テンプレートの要求（空欄を残さない／一次文献を挙げる／段階を具体化する）に合わせて作成している。一次文献の書誌情報は、出版元ページや論文データベース記載に基づいて整形した。citeturn12view0turn21view0turn23view1turn11view2  
また、個人情報（実在個人の住所・連絡先等）や、利用者固有の非公開データは一切作成・挿入していない。