# cs#253 A軸: 書誌実在性監査レポート

対象: raw-confirmed, url-verified / 305 行

2 軸で分類: **entry_quality**（書誌の整形度）× **existence**（Crossref 実在）

## 軸1: entry_quality

| quality | 件数 | 意味 |
|---|---|---|
| WELL_FORMED | 272 | 著者+`(年)`+題 の整形済み引用 |
| STUB | 33 | 著者/年欠落の topic 語句（**未成形書誌**） |

## 軸2: existence（Crossref 照合）

| verdict | 件数 | 意味 |
|---|---|---|
| STRONG | 177 | 題類似≥0.7 かつ 年/著者一致 |
| WEAK | 85 | 部分一致（要目視） |
| MISMATCH | 39 | Crossref 上位と不一致 |
| NOMATCH | 4 | Crossref ヒットなし（非DOI書籍/STUB含む） |

- notes 内 DOI で直接検証: 25 行
- notes に DOI なし（bib 検索のみ）: 221 行

## 最重要: 幻覚疑い行（WELL_FORMED なのに MISMATCH/NOMATCH）

整形済み引用なのに Crossref 上位と一致しない＝誤記または実在しない疑い。

| sid | parsed | crossref top | verdict | sim |
|---|---|---|---|---|
| D01-S05 | Poincare 1908 — Science and Method | Arnold 1905 — La Valeur de la Science. | MISMATCH | 0.34 |
| D01-S09 | Perelman 2002 — The entropy formula for the Ricci flow and its geo | Perelman 2012 — Towards the Validity of Itô's Formula for Disconti | MISMATCH | 0.45 |
| D06-S11 | Springel 2005 — Millennium Simulation | Zhang 2010 — GENUS STATISTICS USING THE DELAUNAY TESSELLATION F | MISMATCH | 0.28 |
| D07-S01 | Wiener 1948 — Cybernetics: Or Control and Communication in the A | Wiener None — Cybernetics and psychopathology. | MISMATCH | 0.44 |
| D11-S08 | Wu 2014 — Chin Med, 9, 24 | Liu 2023 — Sleeve resection after neoadjuvant treatment via m | MISMATCH | 0.09 |
| D11-S10 | ICH 2009 — Q8(R2) Pharmaceutical Development Guideline | Nosek 1978 — Changes in the cell surface coat during the develo | MISMATCH | 0.4 |
| D11-S11 | ICH 2008 — Q10 Pharmaceutical Quality System Guideline |  None — An implementation of a SCADA system based on TCP/I | MISMATCH | 0.35 |
| D11-S12 | ICH 2023 — Q9(R1) Quality Risk Management Guideline | Ich 2021 — Free vibration and buckling of bidirectional funct | MISMATCH | 0.12 |
| D11-S15 | Csermely 2011 — Allo-Network Drugs | Csermely 2013 — Editorial (Hot Topic: From Allosteric Drugs to All | MISMATCH | 0.22 |
| D12-S03 | Holling 1973 — Ann | HOLLING 1965 — Closed Chest Resuscitation | MISMATCH | 0.14 |
| D15-S07 | Kant 1790 — Kritik der Urteilskraft. 邦訳: 牧野英二訳『判断力批判』岩波文庫 | KANEHARA None — シューベルトのピアノ・ソナタ : D 958・D 959・D 960の連作性に基づく演奏解釈の一考察 | MISMATCH | 0.16 |
| D15-S09 | Dewey 1934 — Art as Experience. Minton, Balch & Company. （特にCh. | Dewey None — Experience, nature and art. | MISMATCH | 0.35 |
| D16-S09 | Ibn 1377 — The Muqaddimah: An Introduction to History. tr. F | Ibn Khaldûn 2015 — The Muqaddimah | MISMATCH | 0.47 |
| D17-S16 | Jakobson 1956 — Fundamentals of Language. Mouton, The Hague | Jakobson 1980 — Part II: Two Aspects Of Language And Two Types Of  | MISMATCH | 0.47 |
| D19-S10 | Barthes 1970 — S/Z. Seuil | Jacob 1972 — Roland Barthes, S / Z, Seuil, 1970 ; Roland Barthe | MISMATCH | 0.19 |
| D20-S04 | Sieyès 1789 — What Is the Third Estate? | - - — - | NOMATCH | - |
| D20-S06 | International 2011 — A Practical Guide to Constitution Building |  2020 — Food Safety Handbook: A Practical Guide for Buildi | MISMATCH | 0.42 |
| D20-S07 | UNCITRAL 2021 — Mediation Rules | - - — - | NOMATCH | - |
| D21-S02 | Schumpeter 1939 — Business Cycles. McGraw-Hill.（イノベーションの群生・波及と循環の議論の | - - — - | NOMATCH | - |
| D21-S03 | Schumpeter 1942 — Capitalism, Socialism and Democracy. Harper | Schumpeter 2013 — plausible Capitalism | MISMATCH | 0.33 |
| D21-S15 | Deco 2008 — Noise during Rest Enables the Exploration of the B | Cabral 2009 — Inter-cortical time delays shape the brain in dyna | MISMATCH | 0.23 |
| D23-S16 | Kartner 2024 — Early social-cognitive development as a dynamic de | Cox 2011 — A femtosecond-precision, fiber-optic timing transf | MISMATCH | 0.25 |
| D24-S02 | Di 2019 — "Experiences of Affiliation, Conversion, 'Brainwas | Shaik","email":"afsarsk4cology@gmail.com","affiliation":"Fac 2024 — Significance of Alternative Medicines in Treatment | MISMATCH | 0.33 |
| D24-S03 | Pew 2025 — Religious switching reports | Pew 2019 — Bilious Airways: A Case of Bilothorax Following Li | MISMATCH | 0.32 |
| D24-S05 | Van 1909 — The Rites of Passage. U Chicago Press | Alstyne 1979 — Rites of Passage: Race, the Supreme Court, and the | MISMATCH | 0.46 |
| D24-S11 | James 1902 — The Varieties of Religious Experience. Longmans, G | James 2012 — Philosophy | MISMATCH | 0.16 |
| D24-S12 | Otto 1917 — The Idea of the Holy | Otto 1932 — Essays by Professor Otto<i>Religious Essays. (A Su | MISMATCH | 0.33 |
| D25-S15 | Viveiros 1998 — Amerindian Perspectivism | de Castro 2017 — Kosmologiczna deixis oraz perspektywizm indiański | MISMATCH | 0.42 |
| D29-S13 | Munoz 2018 — Criticality and dynamical scaling in living system | Leal 2022 — Invariant Cantor sets in the parametrized Hénon-De | MISMATCH | 0.31 |
| D30-S03 | IPBES 2019 — ILK methodological guidance | - - — - | NOMATCH | - |
| D30-S04 | Convention 2018 — Nagoya Protocol |  2017 — “SIA AKKA/LLA v. LATVIA” | MISMATCH | 0.17 |

## 未成形書誌 STUB（33 行・著者/年を補うべき）

| sid | title_stub | crossref top (推定実体) | verdict |
|---|---|---|---|
| D01-S01 | Morse Theory Indomitable | Bott 1989 — Morse Theory Indomitable | WEAK |
| D01-S02 | Topology and Data | Carlsson 2009 — Topology and data | WEAK |
| D01-S03 | Barcodes: The Persistent Topology of Data | Ghrist 2007 — Barcodes: The persistent topology of data | WEAK |
| D10-S01 | Allergen immunotherapy / WAO JOA review |  2004 — Pharmacoeconomic Considerations for Allergen  | MISMATCH |
| D10-S02 | Mechanisms of human autoimmunity | Conrad 2003 — Potential Mechanisms of Interferon-α Induced  | WEAK |
| D14-S01 | The Embodied Mind |  2010 — The Mind Embodied, Embedded, Enacted, and Ext | WEAK |
| D18-S01 | De la division du travail social | Durkheim 2013 — De la division du travail social | WEAK |
| D02-S01 | Space-Time Approach to Non-Relativistic Quantum Me |  2011 — FROM FRACTAL SPACE TO NON-RELATIVISTIC QUANTU | WEAK |
| D02-S03 | On the Magnetic Properties of Superconductors of t | De Gennes 2018 — Magnetic Properties of Second Kind Supercondu | WEAK |
| D02-S04 | Observation of the Kibble-Zurek scaling law for de | Ulm 2013 — Observation of the Kibble–Zurek scaling law f | WEAK |
| D02-S05 | Broken Symmetries and the Masses of Gauge Bosons | Higgs 1964 — Broken Symmetries and the Masses of Gauge Bos | WEAK |
| D02-S07 | Synergetics: An Introduction | Hutt 2020 — Synergetics: An Introduction | WEAK |
| D02-S08 | The Problem of Thermal Convection in a Horizontal  | Myznikova 1977 — Convection in a plane-horizontal fluid layer  | WEAK |
| D02-S09 | Decoherence, einselection, and the quantum origins |  2025 — Decoherence, Einselection, and Its Consequenc | WEAK |
| D03-S05 | The Chemical Basis of Morphogenesis | Nanjundiah 2003 — Alan Turing and “The Chemical Basis of Morpho | WEAK |
| D08-S08 | The Embodied Mind |  2010 — The Mind Embodied, Embedded, Enacted, and Ext | WEAK |
| D12-S07 | 農林水産省, 総合的病害虫・雑草管理（IPM）実践指針 | 秦岭 2021 — 森林病虫害的综合防治 | MISMATCH |
| D15-S03 | 世阿弥 (15C). 『風姿花伝』 |  2017 — 偽現世的風景──電影《風景》的真實叩問 | MISMATCH |
| D15-S04 | 『源氏物語玉の小櫛』 | Kim, Jung Hee 2011 — 宣長の「もののあはれ」説の成立と変遷 -『源氏物語玉の小櫛』を中心に- | WEAK |
| D15-S06 | 『幽玄論』 | 浦木 1973 — 世阿弥の幽玄論 | WEAK |
| D19-S12 | Aristotle (c.335 BCE/1907). Poetics. Trans. Butche |  2015 — Nicomachus (1), son of Aristotle, 4th cent. B | MISMATCH |
| D21-S06 | Hayek, F.A. (2002 [orig. 1968]). "Competition as a |  1968 — 英語論文の書き方（V）基礎編B-講演発表，手紙，論文要旨について | MISMATCH |
| D22-S05 | Stanford/HPI Design Thinking Process Guide | Koch 2016 — Introduction: The HPI-Stanford Design Thinkin | WEAK |
| D23-S06 | 幼児は自己映像を"自分のこと"として見ているか？ 神戸大学発達科学部研究紀要, 8(2), 91-1 |  2009 — 定型発達／自閉症幼児における自己遅延映像への反応 | MISMATCH |
| D23-S09 | 多次元アイデンティティ発達尺度（DIDS）日本語版 | Nakama 2015 — Researching identity development and statuses | MISMATCH |
| D23-S11 | Dynamic Systems, Process and Development |  2012 — The search for process characteristics | MISMATCH |
| D23-S14 | Piaget, Vygotsky, and Beyond via DST |  2003 — Piaget, mathematics and Vygotsky | MISMATCH |
| D23-S15 | Network Models for Cognitive Development. Preprint |  2008 — Neural Network Models of Cognitive Developmen | WEAK |
| D24-S07 | Santa Teresa de Jesús, El Castillo Interior / The  | Bobadilla Rodrí­guez 2015 — El Castillo Interior o Las Moradas, de Santa  | WEAK |
| D25-S01 | Les rites de passage. Émile Nourry. 英訳: The Rites  |  2002 — 2 Rites de passage, rites d’initiation | WEAK |
| D28-S01 | 世阿弥古典集（風姿花伝を含む） | Mizuno 2022 — Interpretations of Some Passages from the Sac | MISMATCH |
| D30-S07 | 世阿弥.『風姿花伝』（一座建立の寿福） | KIMURA 1978 — ON "WAGA YADO" | MISMATCH |
| D30-S09 | 茶事における場の共創: 「一座建立」の意味空間. SSI2021 論文集 | 大橋 2026 — [研究論文(原著論文)] スタンドポイント理論における方法論的要請の位置付け --「周縁化 | MISMATCH |
