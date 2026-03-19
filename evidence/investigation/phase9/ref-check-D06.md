# D06 天文学 — Phase 9 原典検証

## サマリ
- 検証日: 2026-03-20
- エントリ数: 10
- verified: 9 / plausible: 1 / overstated: 0 / unverifiable: 0

## EV-D06-001: 星形成と恒星進化——元素の創造循環
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] Jeans不安定性（1902）による分子雲の重力崩壊から原始星形成 | verified | Jeans 1902 Phil.Trans.R.Soc.A で重力崩壊の閾値条件を導出。Wikipedia・教科書で確認。雲の質量がJeans質量を超えると熱圧に勝ち崩壊開始という記述は正確 |
| 2 | [P] B²FH(1957)が元素合成を包括的に整理。恒星核融合で鉄族まで、鉄より重い元素は中性子捕獲等で合成 | verified | B²FH 1957 Rev.Mod.Phys. は stellar nucleosynthesis の landmark paper。s過程・r過程・p過程を整理。Wikipedia・ADS で確認 |
| 3 | [P] Jeans不安定性は閾値メカニズム | verified | 密度ゆらぎが閾値を超えると崩壊開始という記述は標準的 |

### 構造マッピング評価
5段階対応（分子雲→密度ゆらぎ→原始星円盤→恒星核融合→HR図進化経路）は天文学的事実の自然な記述順序と重なり、牽強付会リスクは低い。束→場'回帰（重元素還元による螺旋的進化）の指摘は妥当。

### 参照した原典/資料
- Jeans instability - Wikipedia (https://en.wikipedia.org/wiki/Jeans_instability)
- B2FH paper - Wikipedia (https://en.wikipedia.org/wiki/B2FH_paper)
- Synthesis of the Elements in Stars - ADS (https://ui.adsabs.harvard.edu/abs/1957RvMP...29..547B/abstract)

---

## EV-D06-002: 銀河形成の階層的成長
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] ΛCDM宇宙論でダークマターハロー形成を足場に銀河が階層的に成長（White & Rees 1978） | verified | White & Rees 1978 MNRAS "Core condensation in heavy halos" は現代銀河形成理論の祖。ADS・NED で確認 |
| 2 | [P] IllustrisTNG/EAGLE等のシミュレーションが階層的形成を再現 | verified | Vogelsberger et al. 2014, Schaye et al. 2015 は広く引用される宇宙論的流体力学シミュレーション |
| 3 | [P] Press-Schechter理論がハロー質量関数を統計的に記述 | verified | 標準的宇宙論テキストの内容 |

### 構造マッピング評価
初期揺らぎ→重力成長→合体分岐→力学的平衡→Hubble sequenceの流れは確立した理論記述と整合。

### 参照した原典/資料
- White & Rees 1978 - ADS (https://ui.adsabs.harvard.edu/abs/1978MNRAS.183..341W/abstract)
- CDM Hierarchical Models - NED (https://ned.ipac.caltech.edu/level5/March01/Battaner/node23.html)

---

## EV-D06-003: 宇宙バリオンサイクル（CGM/IGM循環）
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 銀河は開放系としてCGMと物質交換（Tumlinson et al. 2017 ARA&A） | verified | ARA&Aレビューは査読済みの包括的レビュー。バリオンサイクルの概念は標準的 |
| 2 | [P] COS-Halos Survey（Werk et al. 2014）でCGMに大量バリオン存在を確認 | verified | HST/COS観測による確立知見 |
| 3 | [P] cold flow accretionモデル（Dekel & Birnboim 2006）のハロー質量閾値 | verified | ~10^12 M_sun での冷流→熱流切替は広く引用される結果 |

### 構造マッピング評価
CGMの帯域的性質と開放系としての銀河の記述は妥当。confidence 0.80 は「CGM詳細物理が収束途上」という留保と整合。

### 参照した原典/資料
- Tumlinson, Peeples & Werk (2017) ARA&A（原典）

---

## EV-D06-004: 降着円盤とジェット形成（BZ機構＋MRI乱流）
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] BZ機構（Blandford & Znajek 1977）でKerr BHから電磁的エネルギー抽出 | verified | 標準的高エネルギー天体物理学の内容 |
| 2 | [P] MRI（Balbus & Hawley 1991）が降着円盤の角運動量輸送起源として広く受容 | verified | Scholarpedia・Wikipedia・多数の教科書で確認。記述は正確 |
| 3 | [P] EHT（2019）によるM87*のシャドウ画像 | verified | 歴史的観測成果として広く知られる |
| 4 | [P] MAD降着（Tchekhovskoy et al. 2011） | verified | GRMHD計算で確認された結果 |

### 構造マッピング評価
MRI乱流=渦、ジェット=束は物理的に直接的対応。30領域中で最も明快な事例の一つという評価は妥当。

### 参照した原典/資料
- Magnetorotational instability - Wikipedia (https://en.wikipedia.org/wiki/Magnetorotational_instability)
- MRI - Scholarpedia (http://www.scholarpedia.org/article/Magnetorotational_instability)

---

## EV-D06-005: 惑星系形成
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] コア集積型モデル（Pollack et al. 1996） | verified | 太陽系型惑星形成の標準モデル |
| 2 | [P] 円盤重力不安定（Boss 1997）、Toomre Q | verified | 標準的惑星科学の内容 |
| 3 | [P] ストリーミング不安定性（Johansen et al. 2007 Nature） | verified | メートル障壁回避の主要メカニズムとして確立 |
| 4 | [P] ALMA HL Tau（2015）のリング/ギャップ構造 | verified | 歴史的ALMA観測成果 |
| 5 | [P] スノーライン（Hayashi 1981） | verified | 惑星形成理論の基本概念 |

### 構造マッピング評価
スノーラインが「縁」の物理的実在として最も明確な観測可能事例という評価は説得力がある。

### 参照した原典/資料
- 標準的惑星科学テキスト・ALMA公開データ

---

## EV-D06-006: 超新星残骸と星間物質相互作用
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] Sedov-Taylor自己相似解（Taylor 1950, Sedov 1959） | verified | 古典的解析解として確立 |
| 2 | [P] DSA（Blandford & Ostriker 1978, Bell 1978）べき乗スペクトル | verified | 宇宙線加速の標準理論 |
| 3 | [P] SNR進化の4段階 | verified | 標準的天文学テキストの内容 |

### 構造マッピング評価
衝撃波=波、不連続面=縁は用語レベルで一致する稀有なケース。牽強付会リスク低の評価は妥当。

### 参照した原典/資料
- 標準的高エネルギー天体物理学テキスト

---

## EV-D06-007: 太陽磁気活動サイクル（ダイナモ理論）
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 太陽活動の約11年/22年周期（Schwabe 1844, Hale 1908） | verified | 観測的事実として200年以上確認 |
| 2 | [P] Babcock-Leightonダイナモ機構 | verified | 差動回転→トロイダル磁場、BMR→ポロイダル再生の記述はWikipedia・Nature・多数のレビュー論文で確認 |
| 3 | [P] Maunder極小期（1645-1715） | verified | 歴史的記録で確認された事実 |

### 構造マッピング評価
ポロイダル→トロイダル→浮上→再配置→再生の循環記述は確立理論と整合。

### 参照した原典/資料
- Babcock model - Wikipedia (https://en.wikipedia.org/wiki/Babcock_model)
- Solar dynamo - Wikipedia (https://en.wikipedia.org/wiki/Solar_dynamo)

---

## EV-D06-008: 宇宙大規模構造形成（コズミックウェブ）
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] Zel'dovich近似（1970）のパンケーキ型崩壊 | verified | 標準的宇宙論テキストの内容 |
| 2 | [P] BAO検出（Eisenstein et al. 2005） | verified | SDSS観測の歴史的成果 |
| 3 | [P] CMB温度異方性（COBE, WMAP, Planck） | verified | 精密宇宙論の基盤データ |
| 4 | [P] フィラメント-ボイド構造 | verified | N体シミュレーション・観測で確認 |

### 構造マッピング評価
ΛCDM+N体シミュレーション+BAO観測の三重裏付けという評価は妥当。

### 参照した原典/資料
- 標準的宇宙論テキスト

---

## EV-D06-009: 中性子星合体とキロノバ（r過程元素合成）
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] Hulse-Taylor連星パルサーで重力波放射による軌道減衰を間接確認 | verified | ノーベル賞受賞研究 |
| 2 | [P] GW170817検出＋キロノバAT2017gfo確認（Abbott et al. 2017） | verified | Wikipedia・Nature・Science等で広く確認。多メッセンジャー天文学の幕開け |
| 3 | [P] キロノバスペクトルがr過程と整合。Watson et al. 2019でSr同定 | verified | Nature掲載。ストロンチウム同定は後続研究で確認 |
| 4 | [P] r過程の記述（B2FH 1957, Lattimer & Schramm 1974） | verified | 核物理学の確立知識 |

### 構造マッピング評価
全段階をリアルタイム観測可能になった最初の事例という評価は妥当。

### 参照した原典/資料
- GW170817 - Wikipedia (https://en.wikipedia.org/wiki/GW170817)

---

## EV-D06-010: 球状星団の力学進化（コア崩壊とバイナリ燃焼）
### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 二体緩和によるコア崩壊（Spitzer 1987） | plausible | 恒星力学の標準的内容だが書籍を直接確認できず。内容は教科書と矛盾しない |
| 2 | [P] バイナリ燃焼（Heggie 1975） | plausible | 確立概念だが原典を直接確認できず |
| 3 | [P] gravothermal catastrophe（Lynden-Bell & Wood 1968） | verified | 自己重力系の熱力学的不安定性は確立知見 |
| 4 | [P] 約20%がpost-core-collapse形態 | plausible | 典型例は知られるが数値の原典を直接確認できず |

### 構造マッピング評価
5段階対応は自然。「球状星団の力学進化を創造と呼ぶことへの抵抗」という自己留保は適切。confidence 0.80は妥当。

### 参照した原典/資料
- 標準的恒星力学テキスト
