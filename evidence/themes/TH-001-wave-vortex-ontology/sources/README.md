# sources/ — TH-001 出典アーカイブ（LLM 照合ハーネス）

## 背景・ゴール・現在地

- **背景**: `READER-wave-vortex.md`（公開ページ `reader/wave-vortex.html`）の脚注 [1]〜[29] は Web の公開版にリンクしているが、リンク切れ・egress ブロック・ネットワーク不通のとき LLM が原典照合を再現できない。
- **ゴール**: 無料公開版が存在する出典のローカル控えを取得日・sha256 付きで保管し、**LLM が「本文の主張 ⇄ 原典」の突き合わせをオフラインで再現できる**ようにする。
- **現在地**: 2026-07-11 時点で 22 件を保管（正規 18＋代替 4）。**全件の全文照合レビューを完了**（[`VERIFICATION-20260711.md`](VERIFICATION-20260711.md)。誤帰属 1 件・精度不足 3 件を検出し READER を訂正）。残る非保管 9 件は理由と代替つきで記録。

## 使い方（LLM 向け）

1. 検証したい主張の脚注番号 n を READER で特定する
2. `refNN_*.pdf` を Read で開く（`text_layer: false` のものは pages 指定の**画像モード**で読む）。`refNNalt_*` はその脚注の読めない原典の**代替文献**（同一講演の訳・後継完全版・本人の後年レビュー等。sources.json の `substitute: true`）
3. 該当ページと本文・脚注の記述を突き合わせる
4. 機械可読メタデータは [`sources.json`](sources.json)（書誌・DOI・取得元 URL・取得日・sha256・頁数・ライセンス・30 領域台帳とのクロス参照）

> **実績**: 取得時の 1 ページ目照合で脚注 5 の誤帰属（Stenger→Sassoli de Bianchi）を検出（2026-07-11）。全文照合レビューでさらに 3 件の精度不足（Leonhardt 批判の中身／「リングダウンの初の証拠」→「最初の兆候」／SdB の論旨）と 10⁻¹⁷ の Wikipedia 孫引きを検出・訂正した。詳細は VERIFICATION-20260711.md。

## 保管ファイル（脚注番号順）

| 脚注 | ファイル | 出典 | 頁 | テキスト層 |
|---|---|---|---|---|
| [1] | `ref01_barcelo-liberati-visser-2011_analogue-gravity_arxiv-v4.pdf` | Analogue Gravity… | 212 | あり |
| [3] | `ref03_hobson-2013_no-particles-only-fields_arxiv.pdf` | There are no particles, there are only fie… | 32 | あり |
| [4] | `ref04_varela-maturana-uribe-1974_autopoiesis_monoskop.pdf` | Autopoiesis: The organization of living sy… | 10 | **なし**（画像モードで読む） |
| [5] | `ref05_sassoli-de-bianchi-2013_quantum-fields-are-not-fields_arxiv.pdf` | Quantum fields are not fields… | 2 | あり |
| [7] | `ref07_helmholtz-1858_wirbelbewegungen_zenodo.pdf` | Über Integrale der hydrodynamischen Gleich… | 31 | あり |
| [8] | `ref08_kelvin-1867_on-vortex-atoms_zapatopi.html` | On Vortex Atoms… | - | あり |
| [9]（代替） | `ref09alt_moffatt-2006_vortex-dynamics-legacy_rcd.pdf` | Вихревая динамика: наследие Гельмгольца и … | 10 | あり |
| [10] | `ref10_bohm-1980_wholeness-implicate-order_archive-org.pdf` | Wholeness and the Implicate Order… | 306 | あり |
| [12]（代替） | `ref12alt_unruh-2014_has-hawking-radiation-been-measured_arxiv.pdf` | Has Hawking radiation been measured?… | 10 | あり |
| [13] | `ref13_steinhauer-2016_quantum-hawking-radiation-entanglement_arxiv.pdf` | Observation of quantum Hawking radiation a… | 23 | あり |
| [14] | `ref14_leonhardt-2018_questioning-observation_arxiv.pdf` | Questioning the recent observation of quan… | 17 | あり |
| [15] | `ref15_munoz-de-nova-2019_thermal-hawking-radiation_arxiv.pdf` | Observation of thermal Hawking radiation a… | 11 | あり |
| [16] | `ref16_kolobov-2021_stationary-hawking-radiation_arxiv.pdf` | Observation of stationary spontaneous Hawk… | 15 | あり |
| [18] | `ref18_svancara-2024_giant-quantum-vortex_arxiv.pdf` | Rotating curved spacetime signatures from … | 9 | あり |
| [19]（代替） | `ref19alt_volovik-2001_superfluid-analogies-cosmological_arxiv.pdf` | Superfluid analogies of cosmological pheno… | 113 | あり |
| [20] | `ref20_zloshchastiev-2020_svt-scale-dependent-gravity_arxiv.pdf` | An Alternative to Dark Matter and Dark Ene… | 17 | あり |
| [21] | `ref21_berezhiani-khoury-2015_dark-matter-superfluidity_arxiv.pdf` | Theory of Dark Matter Superfluidity… | 44 | あり |
| [22] | `ref22_liberati-2013_tests-lorentz-invariance_arxiv.pdf` | Tests of Lorentz invariance: a 2013 update… | 62 | あり |
| [23] | `ref23_volovik-2008_fermi-point-scenario_arxiv.pdf` | Emergent physics: Fermi point scenario… | 16 | あり |
| [24] | `ref24_volovik-2001_reentrant-violation_arxiv.pdf` | Reentrant violation of special relativity … | 5 | あり |
| [25]（代替） | `ref25alt_simondon-1992_genesis-of-the-individual_monoskop.pdf` | The Genesis of the Individual… | 24 | あり |
| [27] | `ref27_herrmann-2009_rotating-optical-cavity-lorentz_arxiv.pdf` | Rotating optical cavity experiment testing… | 8 | あり |

## 非保管の出典（理由・代替つき）

- **[2]** Prigogine, I. "Time, Structure and Fluctuations", Nobel Lecture (1977) — repo 内に既存の同一原典があるため重複保管しない（repo 内: `knowledge/raw/D29_prigogine_1977_time-structure-fluctuations.pdf`）
- **[6]** Slowik, E. "Descartes' Physics", Stanford Encyclopedia of Philosophy — Web 百科事典（SEP）。安定機関のためリンク参照で足りる
- **[9]** Moffatt, H. K. "Vortex Dynamics: The Legacy of Helmholtz and Kelvin" (Springer IUTAM, 2008) — 出版社（Springer）有料のみ。無料公開版が確認できていない。**代替を保管**: `ref09alt_moffatt-2006_vortex-dynamics-legacy_rcd.pdf（同一講演のロシア語訳）`
- **[11]** Hawking, S. W. "Black hole explosions?", Nature 248, 30 (1974) — 出版社（Nature 1974）有料のみ。**代替リンク**: Hawking 1975 "Particle creation by black holes" CMP 43, 199 — https://projecteuclid.org/journals/communications-in-mathematical-physics/volume-43/issue-3/Particle-creation-by-black-holes/cmp/1103899181.full（Project Euclid OA。Semantic Scholar の OA 記録で確認。bot 遮断のためアーカイブ不可）
- **[12]** Unruh, W. G. "Experimental Black-Hole Evaporation?", Phys. Rev. Lett. 46, 1351 (1981) — 出版社（APS）有料のみ。OA 版なし（unpaywall 確認 2026-07-09）。**代替を保管**: `ref12alt_unruh-2014_has-hawking-radiation-been-measured_arxiv.pdf`
- **[17]** Physics World "Thermal spectrum of analogue black hole puts Hawking radiation in a new light" (2019) — 商業メディア記事（著作権）。リンク参照で足りる
- **[19]** Volovik, G. E. "The Universe in a Helium Droplet" (OUP, 2003) — 書籍（OUP）有料のみ。**代替を保管**: `ref19alt_volovik-2001_superfluid-analogies-cosmological_arxiv.pdf`
- **[25]** Simondon, G. "L'individuation à la lumière des notions de forme et d'information" (1958/2005) — 無料の全文公開版が確認できていない。**代替を保管**: `ref25alt_simondon-1992_genesis-of-the-individual_monoskop.pdf`
- **[26]** "Process Philosophy", Stanford Encyclopedia of Philosophy — Web 百科事典（SEP）。安定機関のためリンク参照で足りる

## 30 領域台帳（knowledge/raw/manifest.md）とのクロス参照

- **[2]** ↔ D29-S01 raw-confirmed（`knowledge/raw/D29_prigogine_1977_time-structure-fluctuations.pdf`） — 同一原典。sources/ には重複保管しない
- **[4]** ↔ D13-S14 raw-confirmed（2026-07-11 に blocked-access から解除）（`knowledge/raw/D13_varela-maturana-uribe_1974_autopoiesis.pdf`） — TH-001 の取得（ref04）を D13 に引き渡し。D13 source-note は全文精読の上で再生成待ち
- **[25]** ↔ D13-S01 blocked-access [no-oa] — 主著は 30 領域側も取得不能。ref25alt（導入部英訳）が部分代替
- **[26]** ↔ D13-S10 raw-confirmed（`knowledge/raw/D13_whitehead_1929_process-and-reality.pdf`） — 『Process and Reality』本体は 30 領域側に raw あり
- **[28]** ↔ D02-S08 raw-confirmed（`knowledge/raw/D02_rayleigh_1916_problem-thermal-convection-horizontal-layer-fluid-heated-below.pdf`） — ベナール対流の原論文。本体で全文精読済み（source-note D02-S08）。sources/ には重複保管しない
- **[29]** ↔ D07-S01 raw-confirmed（`knowledge/raw/D07_wiener_1948_cybernetics.pdf`） — サイバネティクスの原典。本体で精読済み（source-note D07-S01）。sources/ には重複保管しない

## 運用ルール

- **このディレクトリは TH-001 テーマ調査専用**。`knowledge/raw/manifest.md`（30 領域台帳）には登録しない。source-note 生成義務・Check 6/10/11/12 の対象外（テーマ資産とドメイン台帳の分離）。台帳側と同一原典を扱う場合は上のクロス参照に記録し、**同じ PDF を二重に数えない**
- ファイル命名: `ref{脚注番号2桁}_{著者}-{年}_{slug}_{取得元}.{ext}`。代替文献は `ref{NN}alt_`。脚注番号は READER の「出典（脚注）」と 1:1
- 新規追加時は必ず: (1) 1 ページ目の書誌照合（取り違え・誤帰属検出）、(2) `sources.json` への追記（sha256 含む）、(3) この README の表の更新
- READER の脚注を改番したら、ここのファイル名と `sources.json` も同一コミットで追随させる
