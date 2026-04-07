# 原典アクセス状態トラッカー

**更新日**: 2026-04-07
**起点**: cs#205, cs#207

30領域の再監査に向けて、現行成果物を archive へ退避したうえで、原典アクセス状態をこの表で追跡する。

**最終完了条件**: D01-D30 の全領域で、追跡対象 source が `knowledge/raw/manifest.md` に登録され、source 単位の access status が確定していること。

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

## D10 pilot raw-confirmed

- `knowledge/raw/D10_akdis_2014_allergen-immunotherapy.pdf`
- `knowledge/raw/D10_rosenblum_2015_autoimmunity.pdf`

この2件は raw-confirmed だが、D10 evidence / ref-check の全体再監査はまだ pending。

補足:
- `Burnet (1957)` は `citation-only`
- `Tonegawa (1983)` は `blocked-access`

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
