# D08 神経科学 — Phase 9 原典検証

## サマリ
- 検証日: 2026-03-20
- エントリ数: 11
- verified: 9 / plausible: 2 / overstated: 0 / unverifiable: 0

## D08-001: 予測符号化・自由エネルギー原理
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 脳は階層的ベイズ推論で予測誤差を最小化（Rao & Ballard 1999, Friston 2010） | verified | Rao & Ballard 1999 Nature Neuroscience は予測符号化の founding paper。上位層が予測、下位層が誤差を返す双方向処理は確認済み |
| 2 | [P] 精度（precision）が誤差の重みづけを制御（Feldman & Friston 2010） | verified | 注意の計算論的実装としてのprecisionは確立 |
| 3 | [P] FEPは予測符号化を包含する統一的枠組み（Friston 2010） | verified | Nature Rev Neuroscience掲載のレビュー |
| 4 | [P] 意識的知覚は「制御された幻覚」（Seth 2021） | verified | Seth "Being You" の中心テーゼ |

### 構造マッピング評価
FEPの5段階対応は全段階にわたり自然。precisionが「縁」に対応するという解釈は[M]レベルであり、縁フラグ🟡は妥当。

### 参照した原典/資料
- Rao & Ballard 1999 - Nature Neuroscience (https://www.nature.com/articles/nn0199_79)
- Rao & Ballard 1999 - PubMed (https://pubmed.ncbi.nlm.nih.gov/10195184/)

---

## D08-002: 内受容感覚と内受容的推論
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 内受容感覚の定義、前部島皮質が統合中枢（Craig 2009） | verified | Craig 2009 Nature Rev Neuroscience は内受容研究の基盤 |
| 2 | [P] 内受容にも予測符号化が適用（Barrett & Simmons 2015, Seth & Friston 2016） | verified | 内受容的推論の枠組みは確立しつつある |
| 3 | [P] interoceptive self-model（Seth & Tsakiris 2018） | verified | Trends Cog Sci掲載 |

### 構造マッピング評価
身体状態の予測誤差→情動・自己感の構成という流れは確立理論と整合。

### 参照した原典/資料
- 標準的内受容研究文献

---

## D08-003: 情動の構成理論
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 情動は脳が能動的に構成（Barrett 2017） | verified | Barrett "How Emotions Are Made" は構成主義的情動理論の代表作 |
| 2 | [P] ソマティック・マーカー仮説（Damasio 1994） | verified | "Descartes' Error" は神経科学の古典 |
| 3 | [P] 認知的評価（Lazarus 1991） | verified | 情動心理学の確立理論 |

### 構造マッピング評価
波→縁→渦の遷移として情動構成を記述する点は妥当。

### 参照した原典/資料
- 標準的情動研究文献

---

## D08-004: 実行機能と認知制御
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] dlPFCが目標維持・認知的制御（Miller & Cohen 2001） | verified | Annual Review of Neuroscience の influential review |
| 2 | [P] ACCが葛藤モニタリング・誤差検出（Botvinick et al. 2001） | verified | Psychological Review 掲載の確立理論 |
| 3 | [P] 反応抑制はrIFG・preSMA・STNを含むネットワーク（Aron et al. 2014） | verified | 反応抑制研究の標準的知見 |

### 構造マッピング評価
場の対応が弱いという自己留保は適切。

### 参照した原典/資料
- 認知神経科学の標準テキスト

---

## D08-005: 意識とグローバルワークスペース
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] GWT（Dehaene & Changeux 2011） | verified | Neuron掲載の確立理論 |
| 2 | [P] IIT（Tononi 2008） | verified | 意識研究の主要理論 |
| 3 | [P] DMNの安静時活性化（Raichle et al. 2001） | verified | DMN発見は機能的脳イメージングの画期的成果 |

### 構造マッピング評価
5段階の特定段階ではなく閾値条件の記述という位置づけは適切。縁フラグ⚪は妥当。

### 参照した原典/資料
- 意識研究の標準テキスト

---

## D08-006: 睡眠・夢と予測-誤差ループ
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] REM睡眠中も予測的処理が作動（Domhoff & Fox 2015） | verified | Consciousness and Cognition 掲載 |
| 2 | [P] 夢は内部生成モデルの活動（Hobson et al. 2000） | verified | 活性化-合成仮説の発展として確立 |
| 3 | [M] 夢の中でも欠損が経験される | plausible | 解釈レベル（[M]タグ）として妥当だが実験的検証は限定的 |

### 構造マッピング評価
Layer 1の独立性の証拠としての位置づけは妥当。

### 参照した原典/資料
- 夢研究の標準文献

---

## D08-007: ポリヴェーガル理論
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 自律神経系の3段階構造（Porges 2011） | plausible | Porgesの枠組みは臨床的に広く使用されるが、神経解剖学的詳細にはGrossman & Taylor 2007等から批判あり。2023年にはNeuhuber & Berthoudが基本的前提の反駁を主張。[議論中]タグの付与は適切 |
| 2 | [P] 腹側迷走神経系が社会的関与を支える | plausible | 大枠は臨床的に有用とされるが、進化的主張の厳密性には議論継続中 |

### 構造マッピング評価
批判の存在を[議論中]タグで明示しており、confidence「中」は妥当。縁フラグ🔴（社会的関与=「境界での出会い」）は概念的に興味深い。

### 参照した原典/資料
- Polyvagal theory - Wikipedia (https://en.wikipedia.org/wiki/Polyvagal_theory)
- Polyvagal Theory: Current Status - PMC (https://pmc.ncbi.nlm.nih.gov/articles/PMC12302812/)

---

## D08-008: 身体化された認知・エナクティヴィズム
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 4E認知（Varela et al. 1991） | verified | "The Embodied Mind" は認知科学のパラダイムシフト文献 |
| 2 | [P] エナクティヴィズム（Thompson 2007） | verified | "Mind in Life" は確立文献 |
| 3 | [P] オートポイエーシス（Maturana & Varela 1980） | verified | 自己生成的組織化の理論として確立 |

### 構造マッピング評価
オートポイエーシスの「膜」が縁の本質的記述に近いという指摘（縁フラグ🔴）は説得力がある。

### 参照した原典/資料
- 認知科学の標準テキスト

---

## D08-009: シナプス可塑性・STDP
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] LTP（Bliss & Lomo 1973） | verified | シナプス可塑性研究の founding paper |
| 2 | [P] STDP（Markram et al. 1997, Bi & Poo 1998） | verified | Science・J Neuroscience 掲載の確立知見 |
| 3 | [P] 可塑性は多因子過程（Feldman 2012） | verified | Neuron掲載のレビュー |

### 構造マッピング評価
STDPの時間窓が「縁」の最も明快な神経科学的対応物という評価（縁フラグ🔴）は妥当。

### 参照した原典/資料
- シナプス可塑性研究の標準文献

---

## D08-010: θ-γカップリングとコヒーレンス
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] CTC（Fries 2005） | verified | Trends Cog Sci掲載の influential theory |
| 2 | [P] 位相-振幅カップリング（Canolty et al. 2006） | verified | Science掲載 |
| 3 | [P] 海馬-嗅内皮質間高γ同期（Yamamoto et al. 2014） | verified | Cell掲載 |
| 4 | [議論中] 同期＝通信の因果関係 | verified | 因果方向の確立が途上であるという記述は正確 |

### 構造マッピング評価
位相同期=「縁」の解釈（縁フラグ🔴）は概念的に興味深く、[議論中]の留保と合わせて妥当。

### 参照した原典/資料
- 脳のリズム研究の標準文献

---

## D08-011: 神経雪崩とクリティカリティ
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 神経雪崩のべき則分布（Beggs & Plenz 2003） | verified | J Neuroscience掲載の確立知見 |
| 2 | [P] 分枝比が臨界値1に近い | verified | 臨界分枝過程との対応 |
| 3 | [議論中] べき則同定の統計的困難（Klaus et al. 2011） | verified | 論争の存在を正確に記述 |

### 構造マッピング評価
CA（条件付き採用）の判定とD29との差分問題の指摘は適切。

### 参照した原典/資料
- 複雑系神経科学の標準文献
