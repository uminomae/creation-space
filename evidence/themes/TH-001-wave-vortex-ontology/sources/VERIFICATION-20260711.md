# VERIFICATION-20260711 — 保管原典 ⇄ READER 全数照合の記録

**実施**: 2026-07-11（Claude Fable 5）／**方法**: 保管全ファイルを pdftotext で全文テキスト化（画像スキャンの ref04 は Read 画像モードで頁単位に照合）し、READER-wave-vortex.md の各主張・引用・数値を原文と突き合わせた。

## 結果サマリ

- **一致（逐語レベルで確認）**: 13 件
- **不一致 → READER を訂正**: 3 件（下記 ✗）
- **出典の付け替え**: 1 件（10⁻¹⁷ の一次出典を新設脚注 27 に）

## 照合表

| 脚注 | READER の主張 | 原文での確認 | 判定 |
|---|---|---|---|
| [1] BLV | 「アナロジーは同一性ではない」 | "Of course, analogy is not identity" 逐語一致。Unruh 1981 の位置づけ・普遍性の強調も確認 | ✓ |
| [2] Prigogine | 「外界とのエネルギー交換によって安定化された、巨大なゆらぎ」「非平衡は秩序の源になりうる」 | "a giant fluctuation stabilized by exchanges of energy with the outside world" / "non-equilibrium may be a source of order" 逐語一致 | ✓ |
| [3] Hobson | 「粒子は場から生じる随伴現象」「電子の場が電子そのものだ」二重スリット | "Particles are epiphenomena arising from fields" / "this field is the electron" / "each electron extends over both slits" 逐語一致 | ✓ |
| [5] Sassoli de Bianchi | 旧:「場は計算の道具（演算子）」 | 実際の論旨は「量子の実体は本来的に**非空間的**（non-spatial）で、粒子描像がだめなのと同じ理由で古典的な場の描像でも捉えられない」（"quantum fields are no more fields than quantum particles are particles"） | ✗→訂正 |
| [4] Varela+ | 「物質が絶え間なく入れ替わるもとで…そのものとして留まる」 | p.188 "remains as such only insofar as this organization is continuously realized under permanent turnover of matter" 逐語一致（画像頁照合） | ✓ |
| [8] Kelvin | 「渦の運動を生んだり消したりできるのは、創造の御業だけ」結び目=元素 | "To generate or to destroy 'Wirbelbewegung' in a perfect fluid can only be an act of creative power" / knotted vortex atoms 一致 | ✓ |
| [10] Bohm | pp.12-13「流れの安定したパターン」／p.24「作り、維持し、最終的に溶かし消す」／p.38「相対的に不変な状態」 | "stable patterns of flow"（figure 1.2）/ "creates, maintains, and ultimately dissolves the totality of vortex structures" / "relatively invariant states of continuing movement (e.g., recall the example of the vortex)" 逐語一致 | ✓ |
| [13] Steinhauer 2016 | 「自発的なホーキング放射を観測した」 | "We observe spontaneous Hawking radiation, stimulated by quantum vacuum fluctuations" 一致 | ✓ |
| [14] Leonhardt | 旧:「データ処理の見かけの効果では？」 | 実際は公表データの「理論限界との整合と統計的有意性」への疑義（"raises severe doubts"）。windowing/artifact の語は無し | ✗→訂正 |
| [15] 2019 | 7,400 回・0.35 nK・熱的・予測一致 | "repeated 7400 times" / "predicted Hawking temperature of 0.35 nK" / "agrees well with a thermal spectrum, and its temperature is given by Hawking's prediction" 一致 | ✓ |
| [16] 2021 | 97,000 回・連続 124 日・6 時点で定常性 | "97,000 repetitions ... 124 days of continuous measurement" / "stationary, by observing such a system at six different times" 一致 | ✓ |
| [18] Švančara | 旧:「リングダウンの初の証拠」と論文が呼ぶ | 出版版（PMC）の実際の表現は "represent **the very first hints** of this process taking place **in a quantum fluid**"（量子流体では初の「兆候」）。エルゴ領域未観測の但し書き "To directly observe this region ... further ... is required" は確認 | ✗→訂正 |
| [20] Zloshchastiev | 浸透問題への答えが論文に無い | "Lorentz" 15 回はすべて「フォノン極限で対称性が創発する」文脈。percolation / naturalness / fine-tuning は 0 件 → 主張成立 | ✓ |
| [21] Berezhiani-Khoury | 器でなく中身の理論（検問対象外） | "Lorentz" 0 件・付録 "A Relativistic Completion" 実在 → output.md の分析どおり | ✓ |
| [22] Liberati | 浸透問題・custodial 対称性・multi-BEC | "percolation of higher dimension Lorentz violating terms into the lower dimension terms" / "custodial symmetry" / multi-BEC（Sindoni）一致。**ただし光速異方性 10⁻¹⁷ の記述は本レビューに無い**（10⁻¹⁷ の出現は電子の閾値の別文脈）→ 10⁻¹⁷ の出典を脚注 27（Herrmann 2009）に付け替え | ✓/出典訂正 |
| [23] Volovik 2008 | 「この関門こそ最も重大なテスト」質量ゼロはトポロジーで保護 | "This requirement represents the most crucial test for the emergent scenario" / "The gaplessness of these fermions is protected by topology" 逐語一致 | ✓ |
| [24] Volovik 2001 | 実物のヘリウムでは低エネルギー側でも対称性が破れて戻る | "reentrant violation of the special relativity in the ultralow energy corner" を superfluid 3He-A で例示 — 一致 | ✓ |
| [27] Herrmann 2009（新設） | 光速異方性 10⁻¹⁷ | 論文タイトルそのものが "testing Lorentz invariance at the 10^-17 level"（回転光共振器） | ✓ 一次文献化 |

## 訂正の反映先

- READER 本文 3 箇所＋脚注 22 の説明＋脚注 27 新設（更新履歴 23）
- output.md §6: Steinhauer 2016 / Leonhardt を citation-only → 本文確認済みへ、Herrmann・代替 OA 各行を追記
- 30 領域台帳: D13-S14 を blocked-access → raw-confirmed に解除（全文取得の引き渡し）

## 読めない原典への代替（今回整備）

| 脚注 | 読めない原典 | 代替 | 保管 |
|---|---|---|---|
| [7] | Helmholtz 1858（De Gruyter 有料） | **原論文そのものの OA スキャンを発見**（Zenodo, unpaywall 判明）→「読めない」から昇格 | ref07（正規） |
| [9] | Moffatt 2008（Springer 有料） | 同一講演のロシア語訳・並行出版（Нелинейная динамика 2006, DOI:10.20537/nd0604002） | ref09alt |
| [11] | Hawking 1974（Nature 有料） | 完全版後続論文 Hawking 1975 CMP 43, 199（Project Euclid OA。bot 遮断のためリンクのみ） | リンクのみ |
| [12] | Unruh 1981（APS 有料・OA なし） | 本人の後年レビュー Unruh 2014 "Has Hawking radiation been measured?"（arXiv:1401.6612） | ref12alt |
| [19] | Volovik 2003 教科書（OUP 有料） | 前身の長編レビュー Phys. Rep. 351, 195 (2001)（arXiv:gr-qc/0005091、113頁） | ref19alt |
| [25] | Simondon 主著（OA なし） | 導入部の正典的英訳 "The Genesis of the Individual"（Incorporations 1992、Monoskop 公開） | ref25alt |

（[6][17][26] は Web で読める安定ページのため対象外。[2] は knowledge/raw/D29 に既存）
