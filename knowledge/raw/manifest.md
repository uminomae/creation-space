# knowledge/raw manifest

**更新日**: 2026-04-07
**起点**: cs#205, cs#207

原典は source 単位で追跡する。**完了条件は D01-D30 の全領域で source 行が実データに置き換わること**。
2026-04-07 時点では D01 / D02 / D10 / D14 / D18 の pilot source を登録し、source 未登録の他領域は pending placeholder で残している。

## 集計

- 探索対象として source 単位で管理中: 23本
- 有効な公開 PDF を発見: 9本
- `knowledge/raw/` に実格納済み: 9本
- `citation-only`: 4本
- `blocked-access`: 10本

## 集計の数え方

- **探索対象**: pending placeholder を除く source 行
- **発見**: `raw-confirmed` の source 行
- **raw格納済み**: `local_file` が存在し、実ファイルが PDF 判定できた source 行

| source_id | domain_id | access_status | source_title | local_file | linked_evidence | notes |
|---|---|---|---|---|---|---|
| D01-S01 | D01 | `raw-confirmed` | Morse Theory Indomitable | `knowledge/raw/D01_bott_1988_morse-theory-indomitable.pdf` | `evidence/evidence-D01-mathematics.md` | Numdam OA。D01 pilot raw-confirmed |
| D01-S02 | D01 | `blocked-access` | Topology and Data | — | `evidence/evidence-D01-mathematics.md` | 公式 AMS PDF 導線あり。2026-04-07 時点では Cloudflare で terminal 取得不可 |
| D01-S03 | D01 | `blocked-access` | Barcodes: The Persistent Topology of Data | — | `evidence/evidence-D01-mathematics.md` | 公式 AMS PDF 導線あり。2026-04-07 時点では Cloudflare で terminal 取得不可 |
| D10-S01 | D10 | `raw-confirmed` | Allergen immunotherapy / WAO JOA review | `knowledge/raw/D10_akdis_2014_allergen-immunotherapy.pdf` | `evidence/evidence-D10-clinical-medicine.md` | 試行格納1件目。D10 pilot raw-confirmed |
| D10-S02 | D10 | `raw-confirmed` | Mechanisms of human autoimmunity | `knowledge/raw/D10_rosenblum_2015_autoimmunity.pdf` | `evidence/evidence-D10-clinical-medicine.md` | 試行格納2件目。D10 pilot raw-confirmed |
| D10-S03 | D10 | `citation-only` | Burnet (1957), clonal selection | — | `evidence/evidence-D10-clinical-medicine.md` | 書誌確認のみ。本文未確認 |
| D10-S04 | D10 | `blocked-access` | Tonegawa (1983), somatic generation of antibody diversity | — | `evidence/evidence-D10-clinical-medicine.md` | 公開本文の安定取得に未達 |
| D14-S01 | D14 | `raw-confirmed` | The Embodied Mind | `knowledge/raw/D14_varela_1991_embodied-mind.pdf` | `evidence/evidence-D14-psychology.md` | Monoskop 公開 PDF。D14 pilot raw-confirmed |
| D14-S02 | D14 | `citation-only` | Clark & Chalmers (1998), The Extended Mind | — | `evidence/evidence-D14-psychology.md` | 書誌確認のみ。本文未確認 |
| D18-S01 | D18 | `raw-confirmed` | De la division du travail social | `knowledge/raw/D18_durkheim_1893_division-labor.pdf` | `evidence/evidence-D18-sociology.md` | Open Library / IA 実 PDF を取得。D18 pilot raw-confirmed |
| D18-S02 | D18 | `blocked-access` | The Social Construction of Reality | — | `evidence/evidence-D18-sociology.md` | Open Library では Download Options 表示あり。ただし実 PDF URL は 2026-04-07 時点で item unavailable / 401 |
| D18-S03 | D18 | `blocked-access` | The Constitution of Society | — | `evidence/evidence-D18-sociology.md` | Open Library / IA item から有効 PDF を取得できず |
| D18-S04 | D18 | `citation-only` | Granovetter (1973), The Strength of Weak Ties | — | `evidence/evidence-D18-sociology.md` | 書誌確認のみ。本文未確認 |
| D02-S01 | D02 | `raw-confirmed` | Space-Time Approach to Non-Relativistic Quantum Mechanics | `knowledge/raw/D02_feynman_1948_space-time-approach-nonrelativistic-quantum-mechanics.pdf` | `evidence/evidence-D02-physics.md` | CaltechAUTHORS OA PDF を保存。CLI 取得成功、実 PDF 判定 |
| D02-S02 | D02 | `blocked-access` | Ordering, Metastability and Phase Transitions in Two-Dimensional Systems | — | `evidence/evidence-D02-physics.md` | IOP PDF 導線あり。ただし 2026-04-07 時点の CLI では PDF URL が `text/html` の fulltext/download ページに着地し raw PDF 未取得。人手ブラウザで到達できる余地あり |
| D02-S03 | D02 | `raw-confirmed` | On the Magnetic Properties of Superconductors of the Second Group | `knowledge/raw/D02_abrikosov_1957_magnetic-properties-superconductors-second-group.pdf` | `evidence/evidence-D02-physics.md` | JETP 公式 PDF を保存。CLI 取得成功、実 PDF 判定 |
| D02-S04 | D02 | `blocked-access` | Observation of the Kibble-Zurek scaling law for defect formation in ion crystals | — | `evidence/evidence-D02-physics.md` | Nature PDF URL が `idp.nature.com/authorize` へ 303 redirect。PubMed では free article 表示あり、人手/機関ログインで取得できる可能性あり |
| D02-S05 | D02 | `blocked-access` | Broken Symmetries and the Masses of Gauge Bosons | — | `evidence/evidence-D02-physics.md` | APS 公式 PDF URL は Cloudflare challenge で HTTP 403。CLI / bot 由来の失敗で、ブラウザ手動閲覧なら到達余地あり |
| D02-S06 | D02 | `blocked-access` | Renormalization Group and Critical Phenomena | — | `evidence/evidence-D02-physics.md` | APS 公式 PDF URL は Cloudflare challenge で HTTP 403。CLI / bot 由来の失敗として記録 |
| D02-S07 | D02 | `blocked-access` | Synergetics: An Introduction | — | `evidence/evidence-D02-physics.md` | Springer book URL が `idp.springer.com/authorize` へ 303 redirect。機関ログインまたは人手ブラウザ確認余地あり |
| D02-S08 | D02 | `raw-confirmed` | The Problem of Thermal Convection in a Horizontal Layer of Fluid Heated from Below | `knowledge/raw/D02_rayleigh_1916_problem-thermal-convection-horizontal-layer-fluid-heated-below.pdf` | `evidence/evidence-D02-physics.md` | Zenodo OA PDF を保存。CLI 取得成功、実 PDF 判定 |
| D02-S09 | D02 | `raw-confirmed` | Decoherence, einselection, and the quantum origins of the classical | `knowledge/raw/D02_zurek_2003_decoherence-einselection-quantum-origins-classical.pdf` | `evidence/evidence-D02-physics.md` | arXiv OA PDF を保存。CLI 取得成功、71 pages 確認 |
| D02-S10 | D02 | `citation-only` | Becker-Doring (1935), nucleation kinetics | — | `evidence/evidence-D02-physics.md` | 2026-04-07 時点では書誌確認のみ。OA / paywalled route の切り分けは未了 |
| D03-PENDING | D03 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D03-chemistry.md` | 再監査待ち |
| D04-PENDING | D04 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D04-evolutionary-biology.md` | 再監査待ち |
| D05-PENDING | D05 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D05-earth-science.md` | 再監査待ち |
| D06-PENDING | D06 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D06-astronomy.md` | 再監査待ち |
| D07-PENDING | D07 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D07-engineering.md` | 再監査待ち |
| D08-PENDING | D08 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D08-neuroscience.md` | 再監査待ち |
| D09-PENDING | D09 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D09-life-sciences.md` | 再監査待ち |
| D11-PENDING | D11 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D11-pharmacy.md` | 再監査待ち |
| D12-PENDING | D12 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D12-agriculture.md` | 再監査待ち |
| D13-PENDING | D13 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D13-philosophy.md` | 再監査待ち |
| D15-PENDING | D15 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D15-aesthetics.md` | 再監査待ち |
| D16-PENDING | D16 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D16-history.md` | 再監査待ち |
| D17-PENDING | D17 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D17-linguistics.md` | 再監査待ち |
| D19-PENDING | D19 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D19-literary-studies.md` | 再監査待ち |
| D20-PENDING | D20 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D20-law-politics.md` | 再監査待ち |
| D21-PENDING | D21 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D21-economics.md` | 再監査待ち |
| D22-PENDING | D22 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D22-business-management.md` | 再監査待ち |
| D23-PENDING | D23 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D23-developmental-psychology.md` | 再監査待ち |
| D24-PENDING | D24 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D24-religion.md` | 再監査待ち |
| D25-PENDING | D25 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D25-anthropology.md` | 再監査待ち |
| D26-PENDING | D26 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D26-musicology.md` | 再監査待ち |
| D27-PENDING | D27 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D27-architecture.md` | 再監査待ち |
| D28-PENDING | D28 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D28-performing-arts.md` | 再監査待ち |
| D29-PENDING | D29 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D29-complexity-science.md` | 再監査待ち |
| D30-PENDING | D30 | `not-yet-reviewed` | TBD | — | `evidence/evidence-D30-traditional-knowledge.md` | 再監査待ち |
