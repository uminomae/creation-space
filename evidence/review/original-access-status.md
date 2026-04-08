# 原典アクセス状態トラッカー

**更新日**: 2026-04-08
**起点**: cs#205, cs#207

30領域の再監査に向けて、現行成果物を archive へ退避したうえで、原典アクセス状態をこの表で追跡する。

**最終完了条件**: D01-D30 の全領域で、追跡対象 source が `knowledge/raw/manifest.md` に登録され、source 単位の access status が確定していること。

## Source Coverage Snapshot

| domain_id | total_sources | raw_confirmed | blocked_access | citation_only |
|---|---|---|---|---|
| D01 | 3 | 1 | 2 | 0 |
| D02 | 10 | 4 | 5 | 1 |
| D03 | 10 | 0 | 6 | 4 |
| D04 | 10 | 0 | 2 | 8 |
| D05 | 10 | 0 | 0 | 10 |
| D06 | 10 | 1 | 4 | 5 |
| D07 | 10 | 1 | 3 | 6 |
| D08 | 11 | 1 | 4 | 6 |
| D09 | 11 | 0 | 3 | 8 |
| D10 | 4 | 2 | 1 | 1 |
| D11 | 12 | 4 | 0 | 8 |
| D12 | 10 | 1 | 0 | 9 |
| D13 | 10 | 0 | 0 | 10 |
| D14 | 2 | 1 | 0 | 1 |
| D15 | 10 | 0 | 0 | 10 |
| D16 | 10 | 0 | 0 | 10 |
| D17 | 10 | 0 | 0 | 10 |
| D18 | 4 | 1 | 2 | 1 |
| D19 | 10 | 1 | 0 | 9 |
| D20 | 10 | 1 | 2 | 7 |
| D21 | 10 | 1 | 0 | 9 |
| D22 | 10 | 2 | 0 | 8 |
| D23 | 10 | 1 | 0 | 9 |
| D24 | 10 | 2 | 0 | 8 |
| D25 | 10 | 1 | 2 | 7 |
| D26 | 10 | 0 | 2 | 8 |
| D27 | 10 | 0 | 2 | 8 |
| D28 | 10 | 1 | 0 | 9 |
| D29 | 10 | 1 | 0 | 9 |
| D30 | 10 | 2 | 0 | 8 |

## D01 pilot raw-confirmed

- `knowledge/raw/D01_bott_1988_morse-theory-indomitable.pdf`

この1件は raw-confirmed だが、D01 evidence / ref-check の全体再監査はまだ pending。

補足:
- `Carlsson (2009)` は `blocked-access`
- `Ghrist (2008)` は `blocked-access`

## D02 first source batch

- `knowledge/raw/D02_feynman_1948_space-time-approach-nonrelativistic-quantum-mechanics.pdf`
- `knowledge/raw/D02_abrikosov_1957_magnetic-properties-superconductors-second-group.pdf`
- `knowledge/raw/D02_rayleigh_1916_problem-thermal-convection-horizontal-layer-fluid-heated-below.pdf`
- `knowledge/raw/D02_zurek_2003_decoherence-einselection-quantum-origins-classical.pdf`

この 4 件は raw-confirmed。D02 の anchor source 10 件を manifest に登録したが、evidence / ref-check 本文の再構成はまだ pending。

補足:
- `Ordering, Metastability and Phase Transitions in Two-Dimensional Systems` は `blocked-access`
  IOP PDF 導線はあるが、CLI では PDF URL が `text/html` の fulltext/download ページに着地した。人手ブラウザで取得できる余地あり
- `Observation of the Kibble-Zurek scaling law for defect formation in ion crystals` は `blocked-access`
  Nature PDF URL が `idp.nature.com/authorize` に 303 redirect。PubMed では free article 表示あり
- `Broken Symmetries and the Masses of Gauge Bosons` は `blocked-access`
  APS PDF URL が Cloudflare challenge で HTTP 403。CLI / bot 由来失敗の可能性あり
- `Renormalization Group and Critical Phenomena` は `blocked-access`
  APS PDF URL が Cloudflare challenge で HTTP 403。CLI / bot 由来失敗として記録
- `Synergetics: An Introduction` は `blocked-access`
  Springer book URL が `idp.springer.com/authorize` に 303 redirect
- `Becker-Doring (1935), nucleation kinetics` は `citation-only`
  書誌確認のみで、OA / paywalled route の切り分けは未了

## D03 first source batch

この first batch は raw PDF 未取得だが、anchor source 10件を source-level で登録した。

補足:
- `Johnson & Goody (2011)` は `blocked-access`
  ACS supporting-info PDF URL が Cloudflare challenge で HTTP 403。手動ブラウザ取得余地あり
- `Leibler (1980)` は `blocked-access`
  ACS PDF URL が Cloudflare challenge で HTTP 403
- `Field-Koros-Noyes (1972)` は `blocked-access`
  ACS PDF URL が Cloudflare challenge で HTTP 403
- `Turing (1952)` は `blocked-access`
  Royal Society PDF URL が Cloudflare challenge で HTTP 403。OA 記事自体は存在し、手動ブラウザ取得余地あり
- `Winter & Chambon (1986)` は `blocked-access`
  AIP/JOR PDF endpoint が Cloudflare challenge で HTTP 403
- `Miller & Urey (1953)` は `blocked-access`
  Science PDF URL が Cloudflare challenge で HTTP 403
- `Becker-Doring (1935)` / `Lehn (1995)` / `Lewis-von Elbe (1961)` / `Goldbeter (1996)` は `citation-only`
  archive refs と ref-check では確認できるが、stable primary full-text route は未確認

## D04 first source batch

この first batch は raw PDF 未取得だが、anchor source 10件を source-level で登録した。

補足:
- `Laland et al. (2015)` は `blocked-access`
  PMC article page には到達するが、PDF 直リンクは POW challenge HTML に着地
- `Woese (2002)` は `blocked-access`
  PMC article page には到達するが、PDF 直リンクは POW challenge HTML に着地
- `Darwin (1859)` / `Eldredge & Gould (1972)` / `Odling-Smee et al. (2003)` / `Waddington (1953)` / `Van Valen (1973)` / `Barton & Hewitt (1985)` / `Sagan (1967)` / `Schluter (2000)` は `citation-only`
  archive refs と ref-check では確認できるが、stable official full-text route は未確認

## D05 draft first source batch

manifest には D05 の draft source rows 10件を first pass として投入した。現時点では全件 `citation-only`。

補足:
- `Wilson (1966)` / `Morgan (1968)` / `Le Pichon (1968)` / `Dewey & Bird (1970)` / `Conrad & Lithgow-Bertelloni (2002)` / `Nance et al. (2014)` / `Philander (1983)` / `Cane & Zebiak (1985)` / `Suarez & Schopf (1988)` / `Bjerknes (1969)`
  archive refs 由来の draft で、2026-04-07 時点では書誌確認のみ

## D06 first source batch

- `knowledge/raw/D06_planck-collaboration_2016_cosmological-parameters.pdf`

この 1 件は raw-confirmed。残り 9 件を source-level で登録したが、evidence / ref-check 本文の再構成はまだ pending。

補足:
- `Jeans (1902)` / `Tumlinson et al. (2017)` / `Abbott et al. (2017)` は `blocked-access`
  Royal Society / Annual Reviews / APS の publisher route はあるが、CLI では Cloudflare challenge で止まる
- `Charbonneau (2020)` は `blocked-access`
  Springer PDF が `idp.springer.com/authorize` へ 303 redirect
- `White & Rees (1978)` / `Balbus & Hawley (1991)` / `Pollack et al. (1996)` / `Blandford & Ostriker (1978)` / `Spitzer (1987)` は `citation-only`
  archive refs / ref-check では確認できるが、stable official full-text route は未確認

## D07 first source batch

- `knowledge/raw/D07_shannon_1948_mathematical-theory-communication.pdf`

この 1 件は raw-confirmed。残り 9 件を source-level で登録したが、evidence / ref-check 本文の再構成はまだ pending。

補足:
- `Wiener (1948)` は `blocked-access`
  MIT Press OA monograph page はあるが、CLI では Cloudflare challenge に着地。手動ブラウザ取得余地あり
- `ISO 9001:2015` は `blocked-access`
  landing page は存在するが、full text は purchase/institution barrier
- `Rumelhart et al. (1986)` は `blocked-access`
  Nature PDF が `idp.nature.com/authorize` へ 303 redirect
- `Jacobson (1988)` / `Candes et al. (2006)` / `Schultz et al. (1997)` / `Holland (1975)` / `Fowler (1999)` / `Diffie & Hellman (1976)` は `citation-only`
  書誌確認はできるが、stable official full-text route は未確認

## D08 first source batch

- `knowledge/raw/D14_varela_1991_embodied-mind.pdf`

この 1 件は raw-confirmed。D08 では D14 と raw を共有する anchor として再利用した。

補足:
- `Rao & Ballard (1999)` / `Craig (2009)` は `blocked-access`
  Nature / Nature Reviews の PDF route が `idp.nature.com/authorize` に 303 redirect
- `Markram et al. (1997)` / `Beggs & Plenz (2003)` は `blocked-access`
  Science / JNeurosci の PDF route が Cloudflare challenge で HTTP 403
- `Barrett (2017)` / `Miller & Cohen (2001)` / `Dehaene & Changeux (2011)` / `Hobson et al. (2000)` / `Porges (2011)` / `Fries (2005)` は `citation-only`
  archive refs / ref-check で確認できるが、stable official full-text route は未確認

## D09 first source batch

この first batch は raw PDF 未取得だが、anchor source 11件を source-level で登録した。

補足:
- `Pellerin & Magistretti (1994)` は `blocked-access`
  PNAS PDF route が Cloudflare challenge で HTTP 403
- `Fields (2015)` は `blocked-access`
  Nature Reviews PDF route が `idp.nature.com/authorize` に 303 redirect
- `Iliff et al. (2012)` は `blocked-access`
  Science Translational Medicine PDF route が Cloudflare challenge で HTTP 403
- `Attwell & Laughlin (2001)` / `Schafer et al. (2012)` / `McEwen (1998)` / `Schultz et al. (1997)` / `Maynard Smith (1978)` / `Tsukada & Ohsumi (1993)` / `Wolpert (1969)` / `Burnet (1957)` は `citation-only`
  archive refs / ref-check で確認できるが、stable official full-text route は未確認

## D10 pilot raw-confirmed

- `knowledge/raw/D10_akdis_2014_allergen-immunotherapy.pdf`
- `knowledge/raw/D10_rosenblum_2015_autoimmunity.pdf`

この2件は raw-confirmed だが、D10 evidence / ref-check の全体再監査はまだ pending。

補足:
- `Burnet (1957)` は `citation-only`
- `Tonegawa (1983)` は `blocked-access`

## D11 second-pass raw upgrade

- `knowledge/raw/D11_ich_2009_q8-r2-guideline.pdf`
- `knowledge/raw/D11_ich_2008_q10-guideline.pdf`
- `knowledge/raw/D11_ich_2023_q9-r1-guideline.pdf`
- `knowledge/raw/D11_li_2014_network-pharmacology-qishenyiqi.pdf`

この 4 件を raw-confirmed に格上げした。

補足:
- ICH official PDF route と PLOS ONE official PDF route で HTTP 200 application/pdf を確認
- D11 は first-pass `citation-only` 起点から second pass の raw 回収へ進み始めた

## D14 pilot raw-confirmed

- `knowledge/raw/D14_varela_1991_embodied-mind.pdf`

この1件は raw-confirmed だが、D14 evidence / ref-check の全体再監査はまだ pending。

補足:
- `Clark & Chalmers (1998)` は `citation-only`

## D18 pilot raw-confirmed

- `knowledge/raw/D18_durkheim_1893_division-labor.pdf`

この1件は raw-confirmed だが、D18 evidence / ref-check の全体再監査はまだ pending。

補足:
- `Berger & Luckmann (1966)` は `blocked-access`
- `Giddens (1984)` は `blocked-access`
- `Granovetter (1973)` は `citation-only`

## D19 second-pass raw upgrade

- `knowledge/raw/D19_propp_1968_morphology-of-the-folktale.pdf`

この 1 件を raw-confirmed に格上げした。

補足:
- Monoskop hosted PDF route で HTTP 200 application/pdf を確認し、実 PDF を保存
- 残る 9 件は `citation-only`

## D25 second-pass raw/access update

- `knowledge/raw/D25_pratt_1991_arts-of-the-contact-zone.pdf`

この second pass では 1 件を raw-confirmed に格上げし、1 件を `blocked-access` に更新した。

補足:
- `Pratt (1991)` は Texas State University hosted PDF（Wabash Center resource page 経由）で HTTP 200 application/pdf を確認し、実 PDF を保存
- `Lamont & Molnar (2002)` は `blocked-access`
  SSRN delivery PDF route は Cloudflare challenge 403 HTML
- `van Gennep (1909)` は既存どおり `blocked-access`
- 残る 7 件は `citation-only`

## D26 second-pass access update

この second pass では raw PDF の追加取得には未達だが、1 件を追加で `blocked-access` に更新した。

補足:
- `Mehr et al. (2019)` は `blocked-access`
  Science official PDF route は Cloudflare challenge 403 HTML。Harvard Scholar mirror file route も 403 HTML に着地し raw 未取得
- `Savage et al. (2015)` は `blocked-access`
  PNAS official PDF route は Cloudflare challenge 403 HTML。PMC mirror PDF route も HTML interstitial に着地し raw 未取得
- 残る 8 件は `citation-only`

## D27 second-pass access update

この second pass では raw PDF の追加取得には未達だが、1 件を追加で `blocked-access` に更新した。

補足:
- `Menges & Knippers / ICD-ITKE pavilion cluster` は `blocked-access`
  CAD Journal / ScienceDirect PDF route は Cloudflare challenge 403 HTML。Architectural Design DOI route は Wiley landing へ進むが 403 HTML challenge
- `Aravena & Iacobelli (2012)` は `blocked-access`
  ELEMENTAL official PDF route は Vercel 403 text/plain `Forbidden` を返し raw 未取得
- 残る 8 件は `citation-only`

| domain_id | kind | active_path | archive_snapshot | access_status |
|---|---|---|---|---|
| D01 | evidence | `evidence/evidence-D01-mathematics.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D01-mathematics.md` | `not-yet-reviewed` |
| D02 | evidence | `evidence/evidence-D02-physics.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D02-physics.md` | `not-yet-reviewed` |
| D03 | evidence | `evidence/evidence-D03-chemistry.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D03-chemistry.md` | `not-yet-reviewed` |
| D04 | evidence | `evidence/evidence-D04-evolutionary-biology.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D04-evolutionary-biology.md` | `not-yet-reviewed` |
| D05 | evidence | `evidence/evidence-D05-earth-science.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D05-earth-science.md` | `not-yet-reviewed` |
| D06 | evidence | `evidence/evidence-D06-astronomy.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D06-astronomy.md` | `not-yet-reviewed` |
| D07 | evidence | `evidence/evidence-D07-engineering.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D07-engineering.md` | `not-yet-reviewed` |
| D08 | evidence | `evidence/evidence-D08-neuroscience.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D08-neuroscience.md` | `not-yet-reviewed` |
| D09 | evidence | `evidence/evidence-D09-life-sciences.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D09-life-sciences.md` | `not-yet-reviewed` |
| D10 | evidence | `evidence/evidence-D10-clinical-medicine.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D10-clinical-medicine.md` | `not-yet-reviewed` |
| D11 | evidence | `evidence/evidence-D11-pharmacy.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D11-pharmacy.md` | `not-yet-reviewed` |
| D12 | evidence | `evidence/evidence-D12-agriculture.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D12-agriculture.md` | `not-yet-reviewed` |
| D13 | evidence | `evidence/evidence-D13-philosophy.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D13-philosophy.md` | `not-yet-reviewed` |
| D14 | evidence | `evidence/evidence-D14-psychology.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D14-psychology.md` | `not-yet-reviewed` |
| D15 | evidence | `evidence/evidence-D15-aesthetics.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D15-aesthetics.md` | `not-yet-reviewed` |
| D16 | evidence | `evidence/evidence-D16-history.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D16-history.md` | `not-yet-reviewed` |
| D17 | evidence | `evidence/evidence-D17-linguistics.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D17-linguistics.md` | `not-yet-reviewed` |
| D18 | evidence | `evidence/evidence-D18-sociology.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D18-sociology.md` | `not-yet-reviewed` |
| D19 | evidence | `evidence/evidence-D19-literary-studies.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D19-literary-studies.md` | `not-yet-reviewed` |
| D20 | evidence | `evidence/evidence-D20-law-politics.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D20-law-politics.md` | `not-yet-reviewed` |
| D21 | evidence | `evidence/evidence-D21-economics.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D21-economics.md` | `not-yet-reviewed` |
| D22 | evidence | `evidence/evidence-D22-business-management.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D22-business-management.md` | `not-yet-reviewed` |
| D23 | evidence | `evidence/evidence-D23-developmental-psychology.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D23-developmental-psychology.md` | `not-yet-reviewed` |
| D24 | evidence | `evidence/evidence-D24-religion.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D24-religion.md` | `not-yet-reviewed` |
| D25 | evidence | `evidence/evidence-D25-anthropology.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D25-anthropology.md` | `not-yet-reviewed` |
| D26 | evidence | `evidence/evidence-D26-musicology.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D26-musicology.md` | `not-yet-reviewed` |
| D27 | evidence | `evidence/evidence-D27-architecture.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D27-architecture.md` | `not-yet-reviewed` |
| D28 | evidence | `evidence/evidence-D28-performing-arts.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D28-performing-arts.md` | `not-yet-reviewed` |
| D29 | evidence | `evidence/evidence-D29-complexity-science.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D29-complexity-science.md` | `not-yet-reviewed` |
| D30 | evidence | `evidence/evidence-D30-traditional-knowledge.md` | `evidence/archive/pre-rerun-20260407/evidence/evidence-D30-traditional-knowledge.md` | `not-yet-reviewed` |
| D01 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D01.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D01.md` | `not-yet-reviewed` |
| D02 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D02.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D02.md` | `not-yet-reviewed` |
| D03 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D03.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D03.md` | `not-yet-reviewed` |
| D04 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D04.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D04.md` | `not-yet-reviewed` |
| D05 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D05.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D05.md` | `not-yet-reviewed` |
| D06 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D06.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D06.md` | `not-yet-reviewed` |
| D07 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D07.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D07.md` | `not-yet-reviewed` |
| D08 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D08.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D08.md` | `not-yet-reviewed` |
| D09 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D09.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D09.md` | `not-yet-reviewed` |
| D10 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D10.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D10.md` | `not-yet-reviewed` |
| D13 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D13.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D13.md` | `not-yet-reviewed` |
| D14 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D14.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D14.md` | `not-yet-reviewed` |
| D15 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D15.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D15.md` | `not-yet-reviewed` |
| D16 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D16.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D16.md` | `not-yet-reviewed` |
| D17 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D17.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D17.md` | `not-yet-reviewed` |
| D18 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D18.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D18.md` | `not-yet-reviewed` |
| D19 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D19.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D19.md` | `not-yet-reviewed` |
| D20 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D20.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D20.md` | `not-yet-reviewed` |
| D21 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D21.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D21.md` | `not-yet-reviewed` |
| D22 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D22.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D22.md` | `not-yet-reviewed` |
| D24 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D24.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D24.md` | `not-yet-reviewed` |
| D25 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D25.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D25.md` | `not-yet-reviewed` |
| D26 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D26.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D26.md` | `not-yet-reviewed` |
| D28 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D28.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D28.md` | `not-yet-reviewed` |
| D30 | phase9-ref-check | `evidence/investigation/phase9/ref-check-D30.md` | `evidence/archive/pre-rerun-20260407/phase9/ref-check-D30.md` | `not-yet-reviewed` |
## D20 second-pass raw upgrade

- `knowledge/raw/D20_idea_2011_practical-guide-constitution-building.pdf`

この 1 件を raw-confirmed に格上げした。

補足:
- `UNCITRAL (2021), Mediation Rules` と `UN (2018), Singapore Convention on Mediation` は CloudFront 403 HTML のため `blocked-access` に更新
## D30 second-pass raw upgrade

- `knowledge/raw/D30_ipbes_2019_ilk-methodological-guidance.pdf`
- `knowledge/raw/D30_cbd_2018_nagoya-protocol.pdf`

この 2 件を raw-confirmed に格上げした。

補足:
- IPBES / CBD の official PDF route で HTTP 200 application/pdf を確認
- D30 は public institutional documents から second pass の raw 回収を進められる領域であることが分かった
## D29 second-pass raw upgrade

- `knowledge/raw/D29_prigogine_1977_time-structure-fluctuations.pdf`

この 1 件を raw-confirmed に格上げした。

補足:
- Nobel Prize official PDF route で実 PDF を確認
## D12 second-pass raw upgrade

- `knowledge/raw/D12_maff_2005_ipm-practical-guideline.pdf`

この 1 件を raw-confirmed に格上げした。

補足:
- 農林水産省 official PDF route で HTTP 200 application/pdf を確認
## D24 second-pass raw upgrade

- `knowledge/raw/D24_suzuki_1935_manual-of-zen-buddhism_part1.pdf`
- `knowledge/raw/D24_suzuki_1935_manual-of-zen-buddhism_part2.pdf`
- `knowledge/raw/D24_teresa_1921_interior-castle.pdf`

この 2 source を raw-confirmed に格上げした。

補足:
- Wikimedia Commons / NDL scan と CCEL-hosted PDF の実物を確認
## D25 blocked-access note

- `van Gennep (1909), Les rites de passage`

補足:
- Internet Archive download route は 503/HTML error page を返し、raw 取得に失敗
- manual/browser 再試行余地あり
## D22 second-pass raw upgrade

- `knowledge/raw/D22_stanford_2010_design-thinking-process-guide.pdf`
- `knowledge/raw/D22_akiike_2021_design-thinking-articles.pdf`

この 2 件を raw-confirmed に格上げした。

補足:
- Stanford-hosted PDF route と J-STAGE official PDF route で HTTP 200 application/pdf を確認
## D21 second-pass raw upgrade

- `knowledge/raw/D21_hayek_1945_use-of-knowledge-in-society.pdf`

この 1 件を raw-confirmed に格上げした。

補足:
- OLL / Liberty Fund hosted PDF で実 PDF を確認
## D28 second-pass raw upgrade

- `knowledge/raw/D28_zeami_classics_part1.pdf`
- `knowledge/raw/D28_zeami_classics_part2.pdf`

この 1 source を raw-confirmed に格上げした。

補足:
- Wikimedia Commons / NDL scan の実 PDF を確認
## D23 second-pass raw upgrade

- `knowledge/raw/D23_nakama_2014_dids-japanese-version.pdf`

この 1 件を raw-confirmed に格上げした。

補足:
- J-STAGE official PDF route で実 PDF を確認
