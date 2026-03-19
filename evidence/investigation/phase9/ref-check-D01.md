# D01 数学 — Phase 9 原典検証

## サマリ
- 検証日: 2026-03-20
- エントリ数: 11
- verified: 9 / plausible: 2 / overstated: 0 / unverifiable: 0

---

## EV-D01-001: スピノルと720度回転

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] スピノルは360度回転で符号反転し、720度回転で元に戻る | verified | SU(2)の数学的性質として教科書に明記。Sakurai *Modern Quantum Mechanics* の標準的記述と一致 |
| 2 | [P] SU(2)はSO(3)の二重被覆群（核は{+I,-I}） | verified | リー群論の基本定理。複数の教科書・参考資料で確認 |
| 3 | [P] 中性子干渉実験で720度復元が確認（Rauch et al. 1975） | verified | Rauch, Zeilinger et al. (1975) および Werner et al. (1975) が独立に4pi対称性を実験確認。Oxford Academic, Nature npj Quantum Information 等で確認 |

### 構造マッピング評価
5段階対応は DEBATE 状態で適切に保留されている。スピノルの数学的性質[P]は堅牢だが、5段階への写像[M]は仮説A/Bの議論が未決着。この扱いは誠実。

### 参照した原典/資料
- Rauch et al. (1975) — Semantic Scholar, OSTI.GOV で確認
- Sakurai *Modern Quantum Mechanics* — 標準教科書
- Weinberg (1995) *The Quantum Theory of Fields* — Cambridge UP

---

## EV-D01-002: Julia集合と境界上の動態

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] Julia集合は複素力学系z→z²+cにおける充填Julia集合の境界 | verified | Wikipedia, MathWorld, Cornell lecture notes で一致 |
| 2 | [P] Julia集合上の点は発散せず有界だが安定な収束を保証せず、初期値に鋭敏 | verified | MathWorld, Stony Brook lecture notes で確認 |
| 3 | [P] Julia集合は典型的にフラクタル構造を持つ（パラメータ依存） | verified | Wikipedia: "for some functions the Julia set is a fractal"。パラメータ依存性の注記も正確 |

### 構造マッピング評価
Julia集合境界の「際に留まる」性質を「縁」に対応させる[M]は構造的に妥当。初期値鋭敏性が「未決定性」に対応する読みは自然。

### 参照した原典/資料
- Mandelbrot (1982) *The Fractal Geometry of Nature*
- Julia set — Wikipedia, MathWorld, Cornell lecture notes

---

## EV-D01-003: 層とCechコホモロジーによる束の構成

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 前層は開集合の圏から集合への反変関手 | verified | nLab, Stacks Project で確認。標準的定義 |
| 2 | [P] 層条件は局所データの重なり上での一致と貼り合わせを要求 | verified | Stacks Project, Wikipedia で確認 |
| 3 | [P] ファイバー束は遷移関数とコサイクル条件で構成 | verified | Wikipedia Fiber bundle, Addington notes で確認 |
| 4 | [P] パラコンパクトHausdorff上の主G束の同型類は[X,BG]で分類 | verified | Addington notes, Calegari notes で確認 |

### 構造マッピング評価
「局所→重なり→コサイクル→大域構造」が5段階と対応するという読みは、層理論の構成手順を正確に反映。D01で最も堅牢な対応の一つ。

### 参照した原典/資料
- Stacks Project "Sites and Sheaves"
- Addington notes (Oregon, 2007), Calegari notes (Chicago)

---

## EV-D01-004: Milnorファイブレーション

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 孤立特異点近傍で球面からリンクを除いた空間がS1にファイバー化（Milnor 1968） | verified | Wikipedia "Milnor map", JSTOR, AMS review で確認 |
| 2 | [P] モノドロミー（ファイバーの自己同相）が付随 | verified | Barz (Chicago REU 2023), Springer で確認 |

### 構造マッピング評価
「束が比喩ではなく定理としてのファイバー束」という記述は正確。D01で最も安全なエントリとの評価は妥当。

### 参照した原典/資料
- Milnor (1968) *Singular Points of Complex Hypersurfaces* AM-61

---

## EV-D01-005: 高次圏

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 圏論は対象・射・合成・恒等射の最小公理で定義 | verified | Mac Lane (1998) の標準的定義 |
| 2 | [P] n-圏は0-セル〜n-セルの階層で整合を管理 | verified | 高次圏論の標準的記述 |
| 3 | [P] 無限-圏は弱い等価と高次整合を扱う基盤 | verified | Lurie (2009) の基本的立場 |

### 構造マッピング評価
CA判定が妥当。可換図式は確定的であり「揺れる関係網」ではないとの注記は正確。

### 参照した原典/資料
- Eilenberg & Mac Lane (1945), Mac Lane (1998), Lurie (2009)

---

## EV-D01-006: ガロア理論

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 有限ガロア拡大E/Kに対し、中間体とGal(E/K)の部分群の間に全単射対応 | verified | Wikipedia "Fundamental theorem of Galois theory" で確認 |
| 2 | [P] 多項式が根号で解けることとガロア群の可解性が対応 | verified | Wikipedia "Abel-Ruffini theorem" で確認 |

### 構造マッピング評価
CA判定は妥当。「対応は確定的であり揺れる境界ではない」は正確な指摘。

### 参照した原典/資料
- Wikipedia: Fundamental theorem of Galois theory, Abel-Ruffini theorem

---

## EV-D01-007: 分岐理論

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] パラメータの連続変化により解の数・安定性が質的に変化 | verified | Wikipedia, Scholarpedia で確認 |
| 2 | [P] サドルノード分岐: 安定点と不安定点が衝突して消滅 | verified | Scholarpedia で確認 |
| 3 | [P] ホップ分岐: 定常状態からリミットサイクルが生まれる | verified | Scholarpedia, Wikipedia で確認 |
| 4 | [P] 分岐図でパラメータ空間における質的変化を可視化 | verified | 標準的な分岐理論の記述ツール |

### 構造マッピング評価
分岐点が縁の3条件を満たすとする読みは構造的に妥当。理論構造自体が段階的。

### 参照した原典/資料
- Guckenheimer & Holmes (1983) — Springer
- Kuznetsov (2004)

---

## EV-D01-008: パーシステントホモロジー

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] スケールパラメータ変化でトポロジカル特徴がbirth/deathする | verified | Wikipedia, Edelsbrunner et al. (2002) で確認 |
| 2 | [P] persistence diagram / バーコードで特徴の寿命を可視化 | verified | Carlsson (2009), Wikipedia で確認 |
| 3 | [M] 長寿命=シグナル、短寿命=ノイズという実務的解釈 | plausible | 広く用いられるヒューリスティックだが厳密な定理ではない。「方法論的ヒューリスティック」との注記は適切 |

### 構造マッピング評価
birthを「縁」と読む対応は新規性がある。縁フラグ🟡の自己評価は適切。

### 参照した原典/資料
- Edelsbrunner, Letscher & Zomorodian (2002)
- Carlsson (2009) *Bulletin of the AMS*

---

## EV-D01-009: 特異摂動と境界層

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] 微小パラメータεでε→0の極限が特異になる | verified | Wikipedia で確認 |
| 2 | [P] 正則近似では境界近傍で解が破綻 | verified | 特異摂動の定義的性質 |
| 3 | [P] 境界層: 急激な変化が起きる狭い領域 | verified | Prandtl (1904) に遡る。Wikipedia で確認 |
| 4 | [P] マッチング: 内部解と外部解を漸近的に接続 | verified | Wikipedia で確認 |

### 構造マッピング評価
「境界層に構造が凝縮」は特異摂動理論の本質。マッチングの「往復的構成」という独自性指摘は鋭い。

### 参照した原典/資料
- Prandtl (1904), O'Malley (1991), Wasow (1965)

---

## EV-D01-010: ホッジ理論

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] コンパクト向きづけリーマン多様体上でΩk = exact + coexact + harmonic | verified | Wikipedia, Berkeley/Purdue lecture notes で確認 |
| 2 | [P] 調和形式がドラム・コホモロジー類の一意的代表元 | verified | 複数のlecture notesで確認 |

### 構造マッピング評価
CA判定は妥当。「恣意性が高い」との自己評価は正直で適切。confidence 0.45は対応の弱さを反映。

### 参照した原典/資料
- Hodge (1941), Griffiths & Harris (1978)

---

## EV-D01-011: Morse理論

### Claims 検証
| # | Claim | 判定 | 根拠 |
|---|-------|------|------|
| 1 | [P] Morse関数の臨界点通過時にレベル集合の位相型が質的に変化 | verified | Wikipedia, Chicago REU paper で確認 |
| 2 | [P] 非退化臨界点では指数λのハンドルが付加される | verified | Wikipedia, Stanford/Columbia notes で確認 |
| 3 | [P] Morse不等式: 臨界点数≥ベッチ数 | verified | 標準的定理 |
| 4 | [P] Morse関数からハンドル分解が得られる | verified | Chicago REU (Bohm 2019) で確認 |
| 5 | [M] 臨界点通過が縁の3条件を完全に満たす数学的原型 | plausible | 構造的に自然な読みだが「完全に満たす」は解釈の範疇 |

### 構造マッピング評価
D01で最もクリーンな5段階対応との評価は妥当。指数λによる臨界点の「質」の定量化は独自の貢献。

### 参照した原典/資料
- Milnor (1963) *Morse Theory* AM-51
- Bott (1988), Nicolaescu (2011)
