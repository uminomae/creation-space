# cs#253 A軸 書誌実在性監査 — 所見（人手キュレーション）

機械生成レポート `citation-audit.md` / `citation-audit.jsonl`（再実行で上書きされる）を人間が仕分けした確定所見。スクリプト: `scripts/audit-citations.py`。

対象: manifest の `raw-confirmed` + `url-verified` = **305 行**。照合: Crossref（DOI 直 or 書誌検索）+ OpenAlex 補完。

## 集計

| 軸 | 値 |
|---|---|
| entry_quality | WELL_FORMED **272** / STUB **33** |
| existence | STRONG 177 / WEAK 85 / MISMATCH 39 / NOMATCH 4 |
| notes 内 DOI で直接検証 | **25 / 305 行のみ** |

## 結論: 書誌の「実在性」は概ね健全。真の弱点は別の3点

サンプル時の印象どおり、**幻覚（実在しない原典の捏造）はほぼ無い**。機械が MISMATCH/NOMATCH を出した行も、内訳の大半は「実在するが機械照合しにくい原典」だった。真の問題は以下3点に集約される。

### 弱点1: 構造化 DOI がほぼ無い（最大の改善余地）
- 305 行中 DOI が notes に入っているのは **25 行のみ**。残り 280 行は DOI 未記録。
- DOI が無いため、再検証・重複検知・他DB照合がすべて題/著者の曖昧マッチに依存している。
- → **canonical DOI 列の構造化が standing 化の核**（B/C 軸とも共有する基盤）。

### 弱点2: 未成形書誌 STUB 33 行（著者/年/題が題セルに欠落）
題セルに著者・年が無く topic 語句だけの行。**作品自体は実在**するものが大半。2 類型:

- **(a) ベタ題・英語圏（matcher で実体特定済）— 著者/年を補えば WELL_FORMED 化**:
  D01-S01 Morse Theory→Bott / D01-S02 Topology and Data→Carlsson 2009 / D01-S03 Barcodes→Ghrist 2007 / D02-S05 Broken Symmetries→**Higgs 1964** / D03-S05 Chemical Basis of Morphogenesis→Turing / D18-S01 De la division→Durkheim / D02-S07 Synergetics→Haken / D14-S01・D08-S08 The Embodied Mind→Varela ほか。
- **(b) 非ラテン文字・古典（DB 照合困難・実在）— 人手で書誌完成**:
  D15-S03/D28-S01/D30-S07 世阿弥『風姿花伝』 / D15-S04 源氏物語玉の小櫛 / D15-S06 幽玄論 / D23-S06 神戸大紀要 / D24-S07 Santa Teresa El Castillo Interior / D25-S01 Van Gennep / D12-S07 農水省 IPM 指針 / D30-S09 茶事 SSI2021 ほか。

### 弱点3: WELL_FORMED なのに不一致 31 行 → 真の誤りは 2 件のみ
| 種別 | 件数 | 扱い |
|---|---|---|
| **真の誤り（要修正）** | **2** | **D06-S11** 題が通称「Millennium Simulation」（実題=Springel 2005 Nature 435 "Simulations of the formation, evolution and clustering of galaxies and quasars"）／ **D11-S08** 題欠落・誌名巻号のみ `Chin Med, 9, 24`（raw PDF あり＝実在、論文題を補完） |
| グレー文献（DOI 非対象・正当） | ~11 | ICH Q8/Q9/Q10 (D11-S10/11/12)・UNCITRAL (D20-S07)・IPBES (D30-S03)・Nagoya Protocol (D30-S04)・Sieyès (D20-S04)・Constitution Building (D20-S06)・Schumpeter 書籍 (D21-S02)・Pew report (D24-S03) 等 |
| 古典書籍・pre-DOI（実在・照合難） | ~13 | Poincaré (D01-S05)・Wiener Cybernetics (D07-S01)・Holling 1973 (D12-S03)・Kant (D15-S07)・Dewey (D15-S09)・Ibn Khaldun (D16-S09・年違いで実体一致)・Jakobson (D17-S16)・Barthes S/Z (D19-S10)・Schumpeter (D21-S03)・Van Gennep (D24-S05)・James (D24-S11)・Otto (D24-S12)・Viveiros de Castro (D25-S15) |
| preprint（Crossref 非収録・実在） | 1 | Perelman 2002 arXiv (D01-S09) |
| matcher 偽陽性（実在の整形済論文） | ~4 | Deco 2008 PLOS CB (D21-S15)・Kärtner 2024 Front Psychol (D23-S16)・Muñoz 2018 Rev Mod Phys (D29-S13)・Csermely (D11-S15) |

## WEAK 85 行の扱い
題類似 0.5〜0.7 の部分一致。STUB の正マッチ（Higgs 等）や題の表記揺れが大半で、**実在性に疑義のあるものは抽出されなかった**。row 単位は `citation-audit.jsonl` 参照。standing 化時はサンプル spot-check で足りる。

## 次アクション（A軸）
1. **真の誤り 2 件を修正**: D06-S11 題差し替え・D11-S08 題補完（要 pjdhiro 確認後、別コミット）。
2. **STUB 33 行に著者/年/題を補完**（(a) は matcher 実体で自動提案可、(b) は人手）。
3. **canonical DOI 列の構造化**（破壊的変更 → breaking-change-checklist 適用、B/C 軸と統合して着手）。
4. standing 化 = Check 13 は B/C 軸の所見と合流させてから設計（DOI 列・confidence 列を前提にするため）。

## 更新履歴
- 2026-06-25 #06: 初版。305 行を Crossref+OpenAlex 照合。幻覚ほぼ無し、真の弱点は DOI 未構造化・STUB 33・題誤り2件と確定。
