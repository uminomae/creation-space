# D03 化学 — Phase 9 原典検証

## サマリ
- 検証日: 2026-03-20
- エントリ数: 10
- verified: 9 / plausible: 1 / overstated: 0 / unverifiable: 0

---

## EV-D03-001: 結晶核生成（CNT）

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 過飽和系で臨界核サイズを境に挙動が分岐。体積利得(r3)と界面コスト(r2)の拮抗 | verified | Wikipedia "Classical nucleation theory", ScienceDirect で確認 |
| 2 | [P] Becker-Doring (1935) の速度論 | verified | Wikipedia, 学術文献で確認 |
| 3 | [P] 非古典的経路（prenucleation cluster等）が報告（Gebauer et al. 2018） | verified | 非古典的核生成は活発な研究領域。「議論が残る」との注記は適切 |

### 構造マッピング評価
CNTの5段階対応は定量的で堅牢。化学における縁の最も直接的な実現との評価は妥当。非古典経路は「厚い縁」として帯域性を持つとの指摘は独創的。

### 参照した原典/資料
- Gibbs (1878), Volmer-Weber (1926), Becker-Doring (1935)

---

## EV-D03-002: 触媒反応サイクル（Michaelis-Menten / Langmuir-Hinshelwood）

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] E+S⇄ES→E+P。触媒は反応後に再生。Michaelis-Menten(1913)の飽和型動力学 | verified | 生化学の基礎。教科書レベルの確立事実 |
| 2 | [P] Langmuir-Hinshelwood機構: 吸着→表面反応→脱離 | verified | 表面触媒化学の標準的機構 |
| 3 | [P] TON/TOFが触媒効率の指標 | verified | 触媒化学の標準的指標 |

### 構造マッピング評価
触媒サイクルが5段階の「循環」版である読みは自然。縁フラグ🟡（ES形成はKdで決まる平衡であり「未決定性」が弱い）は適切な自己評価。

### 参照した原典/資料
- Michaelis-Menten (1913), Langmuir (1922), Hinshelwood (1926)

---

## EV-D03-003: ブロック共重合体ミクロ相分離

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] χN と組成f が秩序相を支配。Leibler (1980) が理論枠組み確立 | verified | 高分子物理学の確立された理論 |
| 2 | [P] 有限波数q*の不安定モードとして秩序化開始 | verified | Leibler理論の核心的予測 |
| 3 | [P] ラメラ/シリンダー/bcc/ジャイロイド等の形態出現。共有結合拘束で巨視的相分離は禁止 | verified | 高分子物理学の確立事実 |
| 4 | [P] Fredrickson-Helfand (1987) がゆらぎ補正を導入 | verified | 理論的拡張として認知 |

### 構造マッピング評価
q*が文字通り「波」として存在する点は5段階対応の確度を高める。「拘束が秩序を可能にする」の読みは独創的かつ妥当。

### 参照した原典/資料
- Leibler (1980), Fredrickson-Helfand (1987), de Gennes (1979)

---

## EV-D03-004: BZ反応と散逸構造

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 溶液相で色が周期的に変化する化学振動反応 | verified | Wikipedia, Scholarpedia で確認 |
| 2 | [P] FKN機構 (Field-Koros-Noyes 1972) | verified | Wikipedia, Scholarpedia で確認 |
| 3 | [P] Oregonator (Field-Noyes 1974) が3変数簡約モデル | verified | Scholarpedia "Oregonator" で確認 |
| 4 | [P] スパイラル波・ターゲットパターン（Winfree 1972） | verified | Winfree (1972) "Spiral Waves of Chemical Activity" Science |
| 5 | [P] Prigogineの散逸構造理論 (1977ノーベル化学賞) | verified | 標準的事実 |
| 6 | [P] Belousovは1951頃に観察、1959に短報、国際的認知は1960年代後半以降 | verified | Kiprijanov (2016) Annalen der Physik、Wikipedia で確認 |

### 構造マッピング評価
D03のconfidence最高 (0.90)。渦=スパイラル波は文字通り「渦」。5段階すべてが実験的に可視化可能。Prigogineの「非平衡が秩序の条件」の記述は正確。

### 参照した原典/資料
- Belousov (1959), Zhabotinsky (1964), Field-Koros-Noyes (1972), Winfree (1972), Prigogine & Nicolis (1977)

---

## EV-D03-005: 反応拡散チューリングパターン

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] Turing (1952): activator-inhibitor系で均一状態から空間パターンが自発発生 | verified | Wikipedia "Turing pattern", 複数の学術レビューで確認 |
| 2 | [P] activator拡散係数 < inhibitor拡散係数が必要条件 | verified | 標準的な条件 |
| 3 | [P] Castets et al. (1990) がCIMA反応で初の実験室確認 | verified | PRL (1990) で確認。Frontiers Physics (2024) で詳細記述あり |
| 4 | [P] Kondo & Miura (2010) でゼブラフィッシュ縞模様の生物学的実証 | verified | 広く引用される研究 |

### 構造マッピング評価
「拡散が不安定化を引き起こす」反直観的結果の記述は正確。30領域中で数学的に最も厳密な5段階対応の一つとの評価は妥当。

### 参照した原典/資料
- Turing (1952), Castets et al. (1990), Kondo & Miura (2010)

---

## EV-D03-006: 超分子自己組織化

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 非共有結合相互作用により高次構造が自発形成 | verified | 超分子化学の基礎 |
| 2 | [P] Lehn (1995) の「超分子化学」枠組み。1987ノーベル化学賞 | verified | 標準的事実 |
| 3 | [P] 可逆性、選択性、階層性が自己組織化の特徴 | verified | 超分子化学の基本原理 |
| 4 | [P] 動的共有結合化学（Lehn 2007） | verified | 学術文献で確認 |

### 構造マッピング評価
縁フラグ🟡（形状相補性は決定論的）は適切。平衡系と非平衡系(004)の「同じ5段階」で語る二重性の指摘は重要。

### 参照した原典/資料
- Lehn (1987, 1995, 2007), Whitesides & Grzybowski (2002)

---

## EV-D03-007: 分岐爆発限界（H2/O2系）

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 3つの爆発限界が温度-圧力空間に複雑な境界を形成 | verified | 燃焼化学の確立事実 |
| 2 | [P] 第1限界: 壁面停止 vs 分岐の競合 | verified | Lewis-von Elbe (1961) の標準的記述 |
| 3 | [P] 第2限界: 三体関与の気相終止が強まり爆発→非爆発へ | verified | 標準的記述 |
| 4 | [P] 第3限界: 再び爆発域。支配機構は条件依存 | verified | 「条件に依存する」との注記は誠実 |

### 構造マッピング評価
「同一系が複数の質的に異なる縁を持つ」は独自の貢献。「爆発は秩序形成ではなく破壊的変換」との自己批判は重要。

### 参照した原典/資料
- Semenov (1935), Hinshelwood (1956), Lewis-von Elbe (1961)

---

## EV-D03-008: ゾル-ゲル転移

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 架橋反応の進行で無限クラスターが突然出現 | verified | Springer, Wikipedia, 学術文献で確認 |
| 2 | [P] Flory (1941)-Stockmayer (1943) のゲル化理論。pc = 1/(f-1) | verified | 標準的理論。ランダム架橋・環形成無視等の前提条件の注記も正確 |
| 3 | [P] パーコレーション理論が臨界指数を記述 | verified | Stauffer & Aharony (1994) で確認 |
| 4 | [P] Winter-Chambon基準 (1986): ゲル点でG'とG"が同一べき乗則 | verified | J. Rheology (1986) で確認 |

### 構造マッピング評価
ゲル点=パーコレーション閾値は「つながりの閾値」として縁の最も直観的な表現。Winter-Chambon基準による「縁の上にいる瞬間」の同定は独自の強み。

### 参照した原典/資料
- Flory (1941), Stockmayer (1943), Winter & Chambon (1986), Stauffer & Aharony (1994)

---

## EV-D03-009: 化学進化とRNA world仮説

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] Miller-Urey実験 (1953): 原始大気模擬でアミノ酸生成 | verified | 標準的実験 |
| 2 | [P] RNA world仮説（Gilbert 1986）。リボザイム発見 (Cech 1982, Altman 1989) | verified | 標準的事実 |
| 3 | [議論中] 段階的生成論の詳細は未確定、競合シナリオ多数 | plausible | 「議論中」の注記は正確。CA判定は妥当 |

### 構造マッピング評価
CA判定は適切。「段階的に見えるからといって5段階と対応するとは限らない」との自己批判は方法論的に重要。

### 参照した原典/資料
- Miller & Urey (1953), Gilbert (1986), Cech (1982), Altman (1989)

---

## EV-D03-010: 化学振動の普遍構造

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] Hopf分岐近傍で同一の正規形に還元される局所普遍性 | verified | 非線形力学の標準的結果 |
| 2 | [P] 生体系での化学振動: p53-Mdm2, Ca2+振動, 解糖振動 | verified | Goldbeter (1996) で統一的記述 |
| 3 | [P] Ca2+周波数コード仮説 (Berridge 1997) | verified | Dolmetsch et al. (1998) で実験的支持 |
| 4 | [P] 興奮可能性: 閾値以下では応答なし、超えると全か無か | verified | 神経・心臓・化学系で共通する標準的概念 |

### 構造マッピング評価
「同一の数学的構造が4桁以上のスケールを横断」は正確で強力な主張。004(BZ反応)が「象の鼻」なら010は「象の骨格」という比喩は適切。

### 参照した原典/資料
- Goldbeter (1996), Prigogine & Lefever (1968), Strogatz (2014), Berridge (1997)
