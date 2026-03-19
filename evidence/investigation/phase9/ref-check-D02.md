# D02 物理学 — Phase 9 原典検証

## サマリ
- 検証日: 2026-03-20
- エントリ数: 10 (001はRejected、実質9件検証)
- verified: 8 / plausible: 1 / overstated: 0 / unverifiable: 0

---

## EV-D02-001: パウリ行列と対称性の破れ [REJECTED]
Reject済みのため検証対象外。D01-001に統合された判断は妥当。

---

## EV-D02-002: 場の量子論（QFT）

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 量子場が基本的実体、粒子は場の励起状態。真空は量子ゆらぎを含む | verified | Weinberg (1995), Cambridge/Heidelberg QFT lecture notes で確認。「vacuum corresponds to the absence of any excitations」「fluctuations of the operator at a fixed point are infinite」 |
| 2 | [P] 相互作用はファインマン図の頂点として表現される | verified | Wikipedia "Feynman diagram", 複数のQFT lecture notes で確認 |
| 3 | [P] 経路積分形式では全可能性の重ね合わせから観測量が導かれる | verified | Feynman (1948) の経路積分。標準的QFT |
| 4 | [P] 外線は漸近的一粒子状態（LSZ） | verified | Wikipedia "LSZ reduction formula", Cambridge lecture notes で確認 |

### 構造マッピング評価
QFTが5段階モデルの発想源であることの明記、循環論法リスクへの自覚は方法論的に誠実。「他29領域での独立検証がプロジェクトの本体」との位置づけは適切。

### 参照した原典/資料
- Weinberg (1995), Feynman (1948), Schwinger (1951), Dyson (1949)

---

## EV-D02-003: BKT転移

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 2D系でのトポロジカル相転移、渦対の束縛/解離が駆動 | verified | Wikipedia "BKT transition", UBC lecture notes で確認 |
| 2 | [P] 転移点で超流動密度の普遍的跳び（Nelson-Kosterlitz 1977） | verified | Wikipedia で確認。universal jump |
| 3 | [P] 4He薄膜実験で支持（Bishop-Reppy 1978） | verified | 標準的実験的支持として引用される |

### 構造マッピング評価
渦対の束縛→解離が相転移を駆動する構造は、「渦」が物理的実体として存在する稀有な事例。5段階との対応は自然。

### 参照した原典/資料
- Berezinskii (1971), Kosterlitz-Thouless (1973), Wikipedia

---

## EV-D02-004: アブリコソフ渦糸格子

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] タイプII超伝導体で磁場がフィラメント（渦糸）として侵入、位相が2π変化 | verified | Wikipedia "Abrikosov vortex", Nobel Lecture で確認 |
| 2 | [P] 渦糸は三角格子を形成。電子顕微鏡で直接観察 | verified | Abrikosov Nobel Lecture で確認。ただし最初の実験的確認はEssmann-Trauble (1967) ではなくCribier et al. (1964) の中性子回折が先。電子顕微鏡による直接観察はEssmann-Trauble (1967) |
| 3 | [P] 磁束量子（hc/2e）で離散化。Abrikosov 2003ノーベル賞 | verified | Nobel Lecture で確認 |

### 構造マッピング評価
「渦→格子（束）が理論+観測で明示」はD02最有力との評価は妥当。

### 参照した原典/資料
- Abrikosov (1957), Nobel Lecture (2003), Essmann-Trauble (1967)

---

## EV-D02-005: キブル=ズレック機構（KZM）

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 有限速度の相転移横断→因果律により一様な真空選択が不可→欠陥形成 | verified | Wikipedia "KZM", Nature Communications で確認 |
| 2 | [P] 臨界減速によるfreeze-outがドメインサイズを規定 | verified | Wikipedia で確認 |
| 3 | [P] 捕獲イオン結晶で実験確認（Ulm et al. 2013） | verified | Nature Communications (2013) で確認。Pyka et al. (2013) も同時期に報告 |

### 構造マッピング評価
因果律による空間的不均一性の必然が[P]として堅牢。[S]の段階必然性主張は適切に分離されている。

### 参照した原典/資料
- Zurek (1985, 1996), Kibble (2002), Ulm et al. (2013), Pyka et al. (2013)

---

## EV-D02-006: 自発的対称性の破れ（SSB）+ヒッグス機構

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 高対称性の基底状態から一つの真空が選ばれる（SSB） | verified | Wikipedia で確認 |
| 2 | [P] ゴールドストーン定理: SSBに伴いmasslessモード出現 | verified | Wikipedia "Goldstone boson" で確認 |
| 3 | [P] ヒッグス機構: ゲージ場がゴールドストーンモードを吸収し質量獲得 | verified | Wikipedia "Higgs mechanism" で確認。3つのゴールドストーンボソンがW/Zボソンに吸収 |

### 構造マッピング評価
「全可能性の共存→一つの選択→構造の凝集→安定粒子」の読みは自然。縁フラグ🟡（未決定性の記述が弱い）は適切な自己評価。

### 参照した原典/資料
- Goldstone (1961), Higgs (1964), Anderson (1963), Weinberg (1967)

---

## EV-D02-007: くりこみ群と臨界現象

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 臨界点で相関長→無限、全スケール結合 | verified | Wikipedia, Cambridge lecture notes で確認 |
| 2 | [P] くりこみ群変換: 短距離自由度を粗視化し有効理論を得る | verified | 複数のlecture notesで確認 |
| 3 | [P] 固定点と臨界指数の普遍性。Wilson 1982ノーベル賞 | verified | Wikipedia で確認。Wilson の貢献は1971年 |
| 4 | [P] 演算子はrelevant/irrelevant/marginalに分類 | verified | Wikipedia, Cambridge notes で確認 |

### 構造マッピング評価
marginal operatorが「保持」の物理的対応という読みは独創的で構造的に妥当。「一次判定では決まらず高次補正で決着」は正確。

### 参照した原典/資料
- Wilson (1971), Wilson-Fisher (1972), Kadanoff (1966)

---

## EV-D02-008: レーザー発振と協同現象

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] ポンプ→反転分布→閾値超過で誘導放出カスケード→コヒーレント光 | verified | Wikipedia "Synergetics (Haken)" で確認 |
| 2 | [P] Hakenが相転移のアナロジーとして定式化（シナジェティクス） | verified | Wikipedia, Springer で確認。Haken (1983) *Synergetics* |
| 3 | [P] モード競合と支配モード選択（slaving principle） | verified | Springer "The Slaving Principle of Synergetics" で確認。1975年に導入 |

### 構造マッピング評価
モード競合=縁の「未決定性」、slaving principle=渦の包摂。物理学者自身が「異なるスケールの同じ構造」を認識していた点の指摘は正確。

### 参照した原典/資料
- Haken (1983) *Synergetics* / *Advanced Synergetics*, Maiman (1960)

---

## EV-D02-009: ベナール対流セル

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 臨界レイリー数超過→対流セル自発形成 | verified | Wikipedia: 臨界Ra=1708。標準的知見 |
| 2 | [P] 六角形/ロール等のパターンが対称性の破れとして出現 | verified | Wikipedia, ScienceDirect で確認 |
| 3 | [P] 散逸構造の最も古典的な実例 | verified | Wikipedia: "central in the paradigm of self-organizing dissipative structures" |
| 4 | [P] Benard(1900)は表面張力効果混在、純粋浮力対流との区別は後に確立 | verified | Wikipedia で確認。Benard実験とRayleigh-Benard対流の区別は標準的 |

### 構造マッピング評価
「無秩序→臨界→自己組織化→安定パターン」の読みは教科書的に自然。多重安定性（複数パターン共存）の指摘は保持論点として適切。

### 参照した原典/資料
- Rayleigh (1916), Benard (1900), Cross-Hohenberg (1993)

---

## EV-D02-010: 量子デコヒーレンス

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 環境との相互作用で干渉項が急速に抑制される | verified | Zurek (2003) で確認。標準的知見 |
| 2 | [P] einselection: pointer statesが環境に安定な状態として選択 | verified | Zurek が提唱した概念。広く認められている |

### 構造マッピング評価
CA判定は妥当。「渦段階が欠如」という5段階への問いかけは保持論点として価値がある。

### 参照した原典/資料
- Zurek (1981, 2003), Joos et al. (2003)

---

## EV-D02-011: 古典核生成理論（一次相転移）

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 臨界核の形成を経る。体積自由エネルギー利得と界面エネルギーコストの競合 | verified | Wikipedia "Classical nucleation theory", ScienceDirect で確認 |
| 2 | [P] 臨界半径 r* = 2γ/|ΔGv| | verified | 標準的CNTの公式 |
| 3 | [P] Becker-Doring (1935)の速度論 | verified | Wikipedia で確認。1935年の定式化 |
| 4 | [P] 結晶化、雲形成等に広範に適用 | verified | 広範な応用は標準的知見 |

### 構造マッピング評価
臨界核が「物理的に実在する界面」としての縁を体現するとの読みは自然。D02の概念的界面を補完する具体性との位置づけは適切。

### 参照した原典/資料
- Volmer-Weber (1926), Becker-Doring (1935), Turnbull-Fisher (1949)
