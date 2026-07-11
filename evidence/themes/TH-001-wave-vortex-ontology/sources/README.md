# sources/ — TH-001 出典アーカイブ（LLM 照合ハーネス）

## 背景・ゴール・現在地

- **背景**: `READER-wave-vortex.md`（公開ページ `reader/wave-vortex.html`）の脚注 [1]〜[26] は Web の公開版にリンクしているが、リンク切れ・egress ブロック・ネットワーク不通のとき LLM が原典照合を再現できない。
- **ゴール**: 無料公開版が存在する出典のローカル控えを取得日・sha256 付きで保管し、**LLM が「本文の主張 ⇄ 原典」の突き合わせをオフラインで再現できる**ようにする。
- **現在地**: 2026-07-11 時点で 16 件を保管（下表）。残り 10 件は有料・Web 百科・重複等の理由で非保管（理由つきで記録）。

## 使い方（LLM 向け）

1. 検証したい主張の脚注番号 n を READER で特定する
2. `refNN_*.pdf` を Read で開く（`text_layer: false` のものは pages 指定の**画像モード**で読む）
3. 該当ページと本文・脚注の記述を突き合わせる
4. 機械可読メタデータは [`sources.json`](sources.json)（書誌・DOI・取得元 URL・取得日・sha256・頁数・ライセンス）

> **実績**: 2026-07-11 の取得時 1 ページ目照合で、脚注 5 の反論の著者が「Stenger」ではなく **Sassoli de Bianchi** である誤帰属を検出し、READER 本文・脚注・output.md を訂正した。この照合が機能した実例。

## 保管ファイル（脚注番号順）

| 脚注 | ファイル | 出典 | 頁 | テキスト層 |
|---|---|---|---|---|
| [1] | `ref01_barcelo-liberati-visser-2011_analogue-gravity_arxiv-v4.pdf` | Analogue Gravity… | 212 | あり |
| [3] | `ref03_hobson-2013_no-particles-only-fields_arxiv.pdf` | There are no particles, there are only fields… | 32 | あり |
| [4] | `ref04_varela-maturana-uribe-1974_autopoiesis_monoskop.pdf` | Autopoiesis: The organization of living syste… | 10 | **なし**（画像モードで読む） |
| [5] | `ref05_sassoli-de-bianchi-2013_quantum-fields-are-not-fields_arxiv.pdf` | Quantum fields are not fields… | 2 | あり |
| [8] | `ref08_kelvin-1867_on-vortex-atoms_zapatopi.html` | On Vortex Atoms… | - | あり |
| [10] | `ref10_bohm-1980_wholeness-implicate-order_archive-org.pdf` | Wholeness and the Implicate Order… | 306 | あり |
| [13] | `ref13_steinhauer-2016_quantum-hawking-radiation-entanglement_arxiv.pdf` | Observation of quantum Hawking radiation and … | 23 | あり |
| [14] | `ref14_leonhardt-2018_questioning-observation_arxiv.pdf` | Questioning the recent observation of quantum… | 17 | あり |
| [15] | `ref15_munoz-de-nova-2019_thermal-hawking-radiation_arxiv.pdf` | Observation of thermal Hawking radiation and … | 11 | あり |
| [16] | `ref16_kolobov-2021_stationary-hawking-radiation_arxiv.pdf` | Observation of stationary spontaneous Hawking… | 15 | あり |
| [18] | `ref18_svancara-2024_giant-quantum-vortex_arxiv.pdf` | Rotating curved spacetime signatures from a g… | 9 | あり |
| [20] | `ref20_zloshchastiev-2020_svt-scale-dependent-gravity_arxiv.pdf` | An Alternative to Dark Matter and Dark Energy… | 17 | あり |
| [21] | `ref21_berezhiani-khoury-2015_dark-matter-superfluidity_arxiv.pdf` | Theory of Dark Matter Superfluidity… | 44 | あり |
| [22] | `ref22_liberati-2013_tests-lorentz-invariance_arxiv.pdf` | Tests of Lorentz invariance: a 2013 update… | 62 | あり |
| [23] | `ref23_volovik-2008_fermi-point-scenario_arxiv.pdf` | Emergent physics: Fermi point scenario… | 16 | あり |
| [24] | `ref24_volovik-2001_reentrant-violation_arxiv.pdf` | Reentrant violation of special relativity in … | 5 | あり |

## 非保管の出典（理由つき）

- **[2]** Prigogine, I. "Time, Structure and Fluctuations", Nobel Lecture (1977) — repo 内に既存の同一原典があるため重複保管しない（repo 内: `knowledge/raw/D29_prigogine_1977_time-structure-fluctuations.pdf`）
- **[6]** Slowik, E. "Descartes' Physics", Stanford Encyclopedia of Philosophy — Web 百科事典（SEP）。安定機関のためリンク参照で足りる
- **[7]** Helmholtz, H. "Über Integrale der hydrodynamischen Gleichungen...", J. reine angew. Math. 55, 25 (1858) — 無料の全文公開版が確認できていない（内容は ref09 Moffatt レビュー経由で一次確認）
- **[9]** Moffatt, H. K. "Vortex Dynamics: The Legacy of Helmholtz and Kelvin" (Springer IUTAM, 2008) — 出版社（Springer）有料のみ。無料公開版が確認できていない
- **[11]** Hawking, S. W. "Black hole explosions?", Nature 248, 30 (1974) — 出版社（Nature 1974）有料のみ
- **[12]** Unruh, W. G. "Experimental Black-Hole Evaporation?", Phys. Rev. Lett. 46, 1351 (1981) — 出版社（APS）有料のみ。OA 版なし（unpaywall 確認 2026-07-09）
- **[17]** Physics World "Thermal spectrum of analogue black hole puts Hawking radiation in a new light" (2019) — 商業メディア記事（著作権）。リンク参照で足りる
- **[19]** Volovik, G. E. "The Universe in a Helium Droplet" (OUP, 2003) — 書籍（OUP）有料のみ
- **[25]** Simondon, G. "L'individuation à la lumière des notions de forme et d'information" (1958/2005) — 無料の全文公開版が確認できていない
- **[26]** "Process Philosophy", Stanford Encyclopedia of Philosophy — Web 百科事典（SEP）。安定機関のためリンク参照で足りる

## 運用ルール

- **このディレクトリは TH-001 テーマ調査専用**。`knowledge/raw/manifest.md`（30 領域台帳）には登録しない。source-note 生成義務・Check 6/10/11/12 の対象外（テーマ資産とドメイン台帳の分離）
- ファイル命名: `ref{脚注番号2桁}_{著者}-{年}_{slug}_{取得元}.{ext}`。脚注番号は READER の「出典（脚注）」と 1:1
- 新規追加時は必ず: (1) 1 ページ目の書誌照合（取り違え・誤帰属検出）、(2) `sources.json` への追記（sha256 含む）、(3) この README の表の更新
- READER の脚注を改番したら、ここのファイル名と `sources.json` も同一コミットで追随させる
