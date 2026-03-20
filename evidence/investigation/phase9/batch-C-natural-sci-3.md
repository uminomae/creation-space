# Phase 9-1 原典検証: バッチC（自然科学3+応用）

**検証日**: 2026-03-20
**検証者**: Claude Opus 4.6 (1M context)
**検証方法**: Phase 9-1（Web検索による原典情報確認）
**対象ドメイン**: D11(薬学/10件), D12(農学/10件), D29(複雑系科学/10件), D27(建築/12件), D23(発達心理学/15件)
**合計**: 57件

---

## D11: 薬学（Pharmacy）— 10件

### EV-PM-001: 医薬品開発パイプライン
- **判定**: verified
- **検証元**: Paul, S. M. et al. (2010). *Nat. Rev. Drug Discov.*, 9, 203-214. Nature公式サイト・PubMedで論文実在確認
- **[P]主張の検証**:
  - 標的探索→リード最適化→前臨床→臨床試験→承認後監視の段階的絞込み: verified。Paul et al. (2010)は製薬R&D生産性を包括的に分析し、各段階の成功確率を推定。NMEあたり約18億ドルのコストも記載
  - Phase I→承認の成功確率約11.8%: plausible。Paul et al.の推定値として整合するが、疾患領域・期間により幅がある点はevidenceに記載済み
- **構造的類似の妥当性**: 段階的絞込みと規制による制度化は5段階対応として堅実。Go/No-Go判定が「縁」に対応する読みは妥当
- **備考**: 成功確率の数値は定義条件で変動するため、evidence記載の「幅がある」記述は適切

### EV-PM-002: ADME-PK/PDと用量最適化
- **判定**: verified
- **検証元**: Gabrielsson, J. & Weiner, D. (2006). *Pharmacokinetic & Pharmacodynamic Data Analysis*. 教科書として確立した文献
- **[P]主張の検証**:
  - ADME＋薬力学の定量モデル、コンパートメントモデル: verified。PK/PDモデルは臨床薬理学の標準的枠組み
  - CYP酵素群の遺伝的多型が代謝速度を規定: verified。Evans & McLeod (2003) NEJM 348, 538-549でも確認
- **構造的類似の妥当性**: PID制御構造との対応は妥当。投与量→血中濃度→治療域のフィードバックは制御理論的に読める
- **備考**: なし

### EV-PM-003: 抗菌薬耐性進化
- **判定**: verified
- **検証元**: Davies, J. & Davies, D. (2010). *MMBR*, 74(3), 417-433. ASMジャーナル・PubMed・PMCで論文実在確認
- **[P]主張の検証**:
  - 抗菌薬選択圧で耐性変異が集団内に拡散・固定化: verified。レビュー論文が包括的に記述
  - 水平遺伝子伝播（プラスミド等）が耐性遺伝子を種間で媒介: verified
  - 新薬→耐性獲得→治療方針更新の循環反復: verified
- **構造的類似の妥当性**: 束→場循環の明示的事例として堅実。進化の人為的加速版という位置づけも妥当
- **備考**: Fleming(1945)ノーベル講演での耐性警告は歴史的事実として確立

### EV-PM-004: 経口徐放性製剤の設計・評価
- **判定**: verified
- **検証元**: Higuchi, T. (1963). *J Pharm Sci*, 52, 1145-1149. Wiley Online Library・PubMedで論文実在確認。JPS史上最多引用論文（約3000回引用）
- **[P]主張の検証**:
  - Higuchi式（Q=K√t）による放出記述: verified。マトリクス中固体分散薬物の放出速度を理論的に導出
  - 多孔質ポリマーからの放出はKorsmeyer-Peppasモデル: verified。標準的モデルとして確立
- **構造的類似の妥当性**: 手続き的構造類似。数理モデルが波を定量記述する点での対応は堅実
- **備考**: なし

### EV-PM-005: 漢方処方設計原理（君臣佐使と多成分ネットワーク）
- **判定**: plausible
- **検証元**: Wu et al. (2014). *Chin Med*, 9, 24; Li et al. (2014). *PLOS ONE*, 9(5), e95004
- **[P]主張の検証**:
  - 君臣佐使は漢方処方の設計原理: verified。伝統的概念として確立
  - Wu et al.がネットワーク薬理学で定量同定: plausible。ネットワーク薬理学アプローチは発展中だが「定量同定」の強度は論文の解像度に依存
  - Li et al.が多化合物・多標的・多経路を確認: plausible。方法論的に妥当だが再現性は発展途上
- **構造的類似の妥当性**: 配伍が「縁」の薬学的実装という読みは独創的かつ妥当
- **備考**: ネットワーク薬理学は急速に発展中の分野であり、定量的結論の安定性は今後の検証次第

### EV-PM-006: QbDによる製剤開発・品質保証（ICH Q8/Q9/Q10）
- **判定**: verified
- **検証元**: ICH Q8(R2) 公式文書。EMA・PMDA・FDA各サイトで原文確認。ICH公式PDF（database.ich.org）でDesign Space定義を直接確認
- **[P]主張の検証**:
  - Design Space＝「入力変数と工程パラメータの多次元組合せ・相互作用で品質保証を示したもの」: verified。ICH Q8(R2)公式定義と完全一致。「multidimensional combination and interaction」が原文
  - Q9リスク循環、Q10継続的改善: verified。ICH公式ガイドラインとして確立
- **構造的類似の妥当性**: ICH公式定義に「相互作用」を含む点で縁の制度化という読みは極めて堅実。D11最有力の判断は妥当
- **備考**: Design Space内運用＝未決定の許容範囲が規制保証という読みも原典に支持される

### EV-PM-007: プロドラッグ設計
- **判定**: verified
- **検証元**: Rautio, J. et al. (2008). *Nat. Rev. Drug Discov.*, 7, 255-270. Nature公式サイトで論文実在確認
- **[P]主張の検証**:
  - 化学修飾で不活性前駆体として投与、体内酵素で活性体に変換: verified。プロドラッグの標準的定義
  - エナラプリル→エナラプリラート等: verified。肝臓での代謝変換による経口吸収改善の典型例
- **構造的類似の妥当性**: 「縁が起動スイッチ」として機能する読みは独自かつ妥当
- **備考**: なし

### EV-PM-008: ファーマコゲノミクス / 個別化医療
- **判定**: verified
- **検証元**: Evans, W. E. & McLeod, H. L. (2003). *NEJM*, 348, 538-549. NEJMで論文実在確認
- **[P]主張の検証**:
  - CYP酵素群の遺伝的多型が薬物代謝速度を規定: verified
  - PM/IM/EM/UMの4分類: verified。標準的分類
  - FDA(2005)が薬理ゲノミクスデータ提出の枠組みを明確化: plausible。FDAガイダンスの時期・内容について「2005年」は概ね正確だが、段階的に進展した経緯がある
- **構造的類似の妥当性**: ゲノム型が「縁の構造」を個別化するという読みは妥当
- **備考**: なし

### EV-PM-009: 薬物相互作用（DDI）
- **判定**: verified
- **検証元**: Huang, S.-M. et al. (2007). *Clin. Pharmacol. Ther.*, 81, 298-304; FDA (2020) DDI Guidance
- **[P]主張の検証**:
  - CYP阻害/誘導による多剤併用の動態変化: verified。臨床薬学の基本概念
  - 組み合わせ爆発で全容把握は原理的に困難: verified。多剤併用時の相互作用予測の限界は広く認識
- **構造的類似の妥当性**: 「縁の未決定性」が最大化される例という読みは妥当
- **備考**: なし

### EV-PM-010: 構造ベース創薬（SBDD）
- **判定**: verified
- **検証元**: Anderson, A. C. (2003). *Chem. Biol.*, 10, 787-797. Cell Chemical Biology・PubMedで論文実在確認
- **[P]主張の検証**:
  - X線結晶構造解析やクライオEMで標的タンパク質3D構造を解明し結合部位にフィットする分子を設計: verified
  - HIV治療薬（サキナビル等）が成功例: verified。Anderson (2003)がSBDD成功例として記載
- **構造的類似の妥当性**: 場（3D構造）→縁（分子認識）の対応は物理的に直接的で堅実
- **備考**: AlphaFoldによる構造予測革新は2020年代の事実

---

## D11 集計

| 判定 | 件数 | エントリ |
|------|------|---------|
| verified | 9 | PM-001〜004, PM-006〜010 |
| plausible | 1 | PM-005 |
| overstated | 0 | — |
| unverifiable | 0 | — |

---

## D12: 農学・生態学（Agriculture & Ecology）— 10件

### EV-AG-001: 生態遷移
- **判定**: verified
- **検証元**: Clements (1916); Connell & Slatyer (1977) *Am. Nat.* 111, 1119-1144; Holling (1973) *Ann. Rev. Ecol. Syst.* 4, 1-23
- **[P]主張の検証**:
  - 撹乱後の先駆種→種間競争→極相群集: verified。古典的生態学理論
  - Connell & Slatyerの促進・耐性・阻害3メカニズム: verified
  - Hollingのレジリエンス概念: verified
- **構造的類似の妥当性**: 5段階の生態学的体現として堅実
- **備考**: なし

### EV-AG-002: 農地窒素循環
- **判定**: verified
- **検証元**: Robertson & Vitousek (2009). *Annu. Rev. Environ. Resour.*, 34, 97-125
- **[P]主張の検証**: 施肥・硝化・脱窒・植物吸収・溶脱の連結循環系: verified
- **構造的類似の妥当性**: 物質収支の定量構造は堅実
- **備考**: なし

### EV-AG-003: IPMと経済閾値
- **判定**: verified
- **検証元**: Stern et al. (1959) *Hilgardia*; Pedigo et al. (1986) *Ann. Rev. Entomol.*
- **[P]主張の検証**: EIL/ETの意思決定モデル: verified。農学の基本概念
- **構造的類似の妥当性**: EIL/ETが「縁」として形式化された分岐点という読みは堅実
- **備考**: なし

### EV-AG-004: レジームシフト
- **判定**: verified
- **検証元**: Scheffer et al. (2001) *Nature* 413, 591-596. Nature公式サイトで確認
- **[P]主張の検証**:
  - 閾値を境に急激な状態移行: verified
  - ヒステリシス: verified
  - 早期警告シグナル: verified
- **構造的類似の妥当性**: 閾値＝「縁」が理論の核。極めて堅実
- **備考**: なし

### EV-AG-005: 境界理論（エコトーン）
- **判定**: verified
- **検証元**: Cadenasso et al. (2003) *BioScience* 53(8), 750-758. Oxford Academic確認
- **[P]主張の検証**: 境界を一般化する枠組み: verified
- **構造的類似の妥当性**: 理論の中心が「縁」そのもの。堅実
- **備考**: なし

### EV-AG-006: パーコレーション閾値
- **判定**: verified
- **検証元**: With & Crist (1995) *Ecology*; Taylor et al. (1993) *Oikos*
- **[P]主張の検証**: 臨界閾値での不連続的急変: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-AG-007: 乾燥地植生の自己組織化パターン
- **判定**: verified
- **検証元**: Klausmeier (1999) *Science* 284, 1826-1828. Science公式サイト・PubMed確認
- **[P]主張の検証**: 水制限下の規則的空間パターン、チューリング様不安定性: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-AG-008: 植物-土壌フィードバック
- **判定**: verified
- **検証元**: Bever (1994); Klironomos (2002) *Nature* 417, 67-70
- **[P]主張の検証**: 循環的フィードバック枠組み: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-AG-009: 生態系エンジニアリング
- **判定**: verified
- **検証元**: Jones et al. (1994, 1997) *Oikos*, *Ecology*
- **[P]主張の検証**: 環境の物理的改変によるハビタット創造: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-AG-010: 状態-遷移モデル（STMs）
- **判定**: verified
- **検証元**: Westoby et al. (1989); Briske et al. (2003)
- **[P]主張の検証**: 複数状態と遷移のカタログ: verified
- **構造的類似の妥当性**: AG-004の管理実装版。堅実
- **備考**: なし

---

## D12 集計

| 判定 | 件数 | エントリ |
|------|------|---------|
| verified | 10 | AG-001〜AG-010 |
| plausible | 0 | — |
| overstated | 0 | — |
| unverifiable | 0 | — |

---

## D29: 複雑系科学（Complexity Science）— 10件

### EV-CX-001: 散逸構造（Prigogine）
- **判定**: verified
- **検証元**: Prigogine (1977) Nobel Lecture. NobelPrize.org公式サイトPDF確認
- **[P]主張の検証**: 揺らぎの増幅→分岐→散逸構造: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-CX-002: SOC（Per Bak）
- **判定**: verified
- **検証元**: Bak, Tang & Wiesenfeld (1987) *Phys. Rev. Lett.* 59, 381-384
- **[P]主張の検証**: 自己組織化臨界、べき分布: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-CX-003: 自己触媒集合（Kauffman）
- **判定**: verified
- **検証元**: Kauffman (1986, 1993); Hordijk & Steel (2004)
- **[P]主張の検証**: RAF理論の形式化: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-CX-004: シナジェティクス（Haken）
- **判定**: verified
- **検証元**: Haken (1977, 1983) Springer
- **[P]主張の検証**: 秩序変数と従属原理: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-CX-005: 臨界現象と普遍性（Wilson）
- **判定**: verified
- **検証元**: Wilson (1971, 1983 Nobel Lecture)
- **[P]主張の検証**: 相関長発散、普遍性、繰り込み群: verified
- **構造的類似の妥当性**: 極めて堅実
- **備考**: なし

### EV-CX-006: パーコレーション
- **判定**: verified
- **検証元**: Broadbent & Hammersley (1957); Stauffer & Aharony (1994)
- **[P]主張の検証**: 浸透閾値p_cでの相転移: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-CX-007: オートポイエーシス
- **判定**: verified
- **検証元**: Maturana & Varela (1980); Varela et al. (1974)
- **[P]主張の検証**: 境界の自己産出: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-CX-008: 反応拡散（Turing）
- **判定**: verified
- **検証元**: Turing (1952); Castets et al. (1990)
- **[P]主張の検証**: 拡散駆動不安定性: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-CX-009: カオスの縁
- **判定**: plausible
- **検証元**: Langton (1990); Mitchell et al. (1993)の批判
- **[P]主張の検証**: 仮説としての位置づけ。Mitchell批判により精密な特徴付けは困難: plausible
- **構造的類似の妥当性**: CA判定は妥当
- **備考**: なし

### EV-CX-010: ネットワーク科学
- **判定**: verified
- **検証元**: Watts & Strogatz (1998); Barabasi & Albert (1999); Broido & Clauset (2019)
- **[P]主張の検証**: スモールワールド性、スケールフリー性、高次相互作用: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

---

## D29 集計

| 判定 | 件数 | エントリ |
|------|------|---------|
| verified | 9 | CX-001〜008, CX-010 |
| plausible | 1 | CX-009 |
| overstated | 0 | — |
| unverifiable | 0 | — |

---

## D27: 建築・空間デザイン（Architecture & Design）— 12件

### EV-AD-001: Alexander — Nature of Order
- **判定**: verified
- **検証元**: Alexander (2002-2005) *The Nature of Order* 全4巻. Wikipedia・CES Archive確認
- **[P]主張の検証**: centers, wholeness, 15性質, structure-preserving transformations: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-AD-002: Frei Otto — form-finding
- **判定**: verified
- **検証元**: Otto & Rasch (1996). 2015年プリツカー賞
- **[P]主張の検証**: 平衡形の探索、物理モデル: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-AD-003: van Eyck — in-between
- **判定**: verified
- **検証元**: Ligtelijn & Strauven (2008). Team 10文脈
- **[P]主張の検証**: in-between / doorstep, 遊び場計画700以上: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-AD-004: Hertzberger — threshold space
- **判定**: verified
- **検証元**: Hertzberger (1991). 建築教育の古典
- **[P]主張の検証**: gradient設計、threshold space: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-AD-005: Jacobs — 都市の多様性条件
- **判定**: verified
- **検証元**: Jacobs (1961). 都市計画の古典
- **[P]主張の検証**: 4条件、border vacuum: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-AD-006: 間（ma）
- **判定**: plausible
- **検証元**: 磯崎新 (1978); 神代雄一郎 (1999)
- **[P]主張の検証**: 概念自体は確立。ただし定義的不安定性がリスク
- **構造的類似の妥当性**: 妥当だが概念の不安定性でplausible
- **備考**: なし

### EV-AD-007: Menges — computational morphogenesis
- **判定**: plausible
- **検証元**: Menges (2012); ICD/ITKE Research Pavilions
- **[P]主張の検証**: 理論的枠組みは発展途上
- **構造的類似の妥当性**: 妥当だが発展途上
- **備考**: なし

### EV-AD-008: Aravena — ハーフハウス
- **判定**: verified
- **検証元**: Aravena & Iacobelli (2012). 2016年プリツカー賞
- **[P]主張の検証**: Quinta Monroy 93戸: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-AD-009: Pallasmaa — 身体感覚
- **判定**: plausible
- **検証元**: Pallasmaa (1996/2005)
- **[P]主張の検証**: 多感覚的統合: verified。ただし5段階全体との対応は弱い
- **構造的類似の妥当性**: 「場」への部分的対応のみ。CA判定は妥当
- **備考**: なし

### EV-AD-010: Schumacher — パラメトリシズム
- **判定**: overstated
- **検証元**: Schumacher (2008, 2011-2012)
- **[P]主張の検証**: 概念は存在するが5段階との構造対応は弱い
- **構造的類似の妥当性**: 「縁」と構造的に矛盾。Reject判定は妥当
- **備考**: なし

### EV-AD-011: poche
- **判定**: verified
- **検証元**: Rowe & Koetter (1978) *Collage City*
- **[P]主張の検証**: poche概念: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-AD-012: Lynch — edge
- **判定**: verified
- **検証元**: Lynch (1960) *The Image of the City*
- **[P]主張の検証**: 5要素、edgeの障壁/縫い目の両義性: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

---

## D27 集計

| 判定 | 件数 | エントリ |
|------|------|---------|
| verified | 8 | AD-001〜005, AD-008, AD-011, AD-012 |
| plausible | 3 | AD-006, AD-007, AD-009 |
| overstated | 1 | AD-010 |
| unverifiable | 0 | — |

---

## D23: 発達心理学（Developmental Psychology）— 15件

### EV-D23-001: キーガン 構造発達理論
- **判定**: verified
- **検証元**: Kegan (1982, 1994). Harvard University Press確認
- **[P]主張の検証**: 5つの意識の秩序、主体-客体変容、SOI: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-D23-002: ロシャ 5レベル自己認知
- **判定**: verified
- **検証元**: Rochat (2003) *Consciousness and Cognition*
- **[P]主張の検証**: 5水準の自己意識発達: verified
- **構造的類似の妥当性**: 妥当
- **備考**: なし

### EV-D23-003: DIDS（Luyckx）
- **判定**: plausible
- **検証元**: Luyckx et al. (2006, 2008); 中間ほか (2014)
- **[P]主張の検証**: 二重サイクル構造: verified
- **構造的類似の妥当性**: サイクルと段階の構造差異。CA判定は妥当
- **備考**: なし

### EV-D23-004: 動的システムアプローチ（Thelen & Smith）
- **判定**: verified
- **検証元**: Thelen & Smith (1994). MIT Press確認
- **[P]主張の検証**: 自己組織化、ステッピング反射、A-not-B課題: verified
- **構造的類似の妥当性**: 堅実。メタ理論的価値が高い
- **備考**: なし

### EV-D23-005: ピアジェ
- **判定**: verified
- **検証元**: Piaget (1952, 1970)
- **[P]主張の検証**: 4段階、同化・調節・均衡化: verified
- **構造的類似の妥当性**: 均衡化と欠損保持の差異。CA判定は妥当
- **備考**: なし

### EV-D23-006: ヴィゴツキー ZPD
- **判定**: verified
- **検証元**: Vygotsky (1978). Harvard University Press確認
- **[P]主張の検証**: ZPD、足場かけ、内言: verified
- **構造的類似の妥当性**: ZPD＝「縁」の最も強い対応。堅実
- **備考**: なし

### EV-D23-007: ボウルビィ 愛着理論
- **判定**: verified
- **検証元**: Bowlby (1969/1982). 確立した文献
- **[P]主張の検証**: 安全基地、内的作業モデル、愛着パターン: verified
- **構造的類似の妥当性**: 妥当
- **備考**: なし

### EV-D23-008: エリクソン
- **判定**: plausible
- **検証元**: Erikson (1950, 1968)
- **[P]主張の検証**: 8段階: verified
- **構造的類似の妥当性**: 段階数不一致。CA判定は妥当
- **備考**: なし

### EV-D23-009: マズロー
- **判定**: plausible
- **検証元**: Maslow (1943, 1954)
- **[P]主張の検証**: 欲求階層: verified
- **構造的類似の妥当性**: 表面的類似。CA判定は妥当
- **備考**: なし

### EV-D23-010: Cook-Greuter
- **判定**: verified
- **検証元**: Cook-Greuter (1999, 2004); Loevinger (1976)
- **[P]主張の検証**: Loevinger拡張、ポスト自律段階: verified
- **構造的類似の妥当性**: 堅実
- **備考**: なし

### EV-D23-011: ウィルバー AQAL
- **判定**: plausible
- **検証元**: Wilber (2000, 2006)
- **[P]主張の検証**: AQAL枠組み: verified（存在として）
- **構造的類似の妥当性**: メタ理論のため弱い。CA判定は妥当
- **備考**: なし

### EV-D23-012: フィッシャー 動的スキル理論
- **判定**: verified
- **検証元**: Fischer (1980) *Psychological Review*
- **[P]主張の検証**: 技能の階層的構成: verified
- **構造的類似の妥当性**: 妥当
- **備考**: なし

### EV-D23-013: スターン 自己感の発達
- **判定**: verified
- **検証元**: Stern (1985) *The Interpersonal World of the Infant*
- **[P]主張の検証**: emergent〜narrative selfの重層的発達: verified
- **構造的類似の妥当性**: 妥当
- **備考**: なし

### EV-D23-014: トマセロ 共有志向性
- **判定**: verified
- **検証元**: Tomasello (1999). Harvard University Press確認
- **[P]主張の検証**: 共同注意、shared intentionality、三項関係: verified
- **構造的類似の妥当性**: 堅実。三項関係が「縁」の最も明確な実現
- **備考**: なし

### EV-D23-015: コールバーグ
- **判定**: plausible
- **検証元**: Kohlberg (1981, 1984)
- **[P]主張の検証**: 3水準6段階: verified
- **構造的類似の妥当性**: 対象領域が限定的。CA判定は妥当
- **備考**: なし

---

## D23 集計

| 判定 | 件数 | エントリ |
|------|------|---------|
| verified | 10 | D23-001, 002, 004, 005, 006, 007, 010, 012, 013, 014 |
| plausible | 5 | D23-003, 008, 009, 011, 015 |
| overstated | 0 | — |
| unverifiable | 0 | — |

---

## 全体集計

### 判定分布（全57件）

| 判定 | 件数 | 比率 |
|------|------|------|
| verified | 46 | 80.7% |
| plausible | 10 | 17.5% |
| overstated | 1 | 1.8% |
| unverifiable | 0 | 0% |

### ドメイン別集計

| ドメイン | verified | plausible | overstated | unverifiable |
|---------|----------|-----------|------------|-------------|
| D11 薬学 (10件) | 9 | 1 | 0 | 0 |
| D12 農学 (10件) | 10 | 0 | 0 | 0 |
| D29 複雑系 (10件) | 9 | 1 | 0 | 0 |
| D27 建築 (12件) | 8 | 3 | 1 | 0 |
| D23 発達心理 (15件) | 10 | 5 | 0 | 0 |

### 統合判断

- **段階定義への影響**: 現行維持。overstatedはAD-010（Schumacher, Reject済み）のみ
- **根拠の強度**: 十分。verified率80.7%
- **次のアクション**: Phase 9-2（RAG検証）で plausible 10件を重点フォローアップ

### 検証上の所見

1. D12農学は全件verified。書誌精度が高い
2. D23のplausible 5件はすべてCA判定エントリ。Accept判定エントリは全件verified
3. D27唯一のoverstated（AD-010）はReject済み。品質管理が機能
4. D11 PM-005とD29 CX-009のplausibleは原典自体の不確定性を反映

---

*検証完了: 2026-03-20*
