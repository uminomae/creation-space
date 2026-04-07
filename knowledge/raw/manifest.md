# knowledge/raw manifest

**更新日**: 2026-04-07
**起点**: cs#205, cs#207

原典は source 単位で追跡する。**完了条件は D01-D30 の全領域で source 行が実データに置き換わること**。
2026-04-07 時点では D01 / D02 / D03 / D06 / D07 / D10 / D14 / D18 の pilot source を登録し、source 未登録の他領域は pending placeholder で残している。

## 集計

- 探索対象として source 単位で管理中: 73本
- 有効な公開 PDF を発見: 11本
- `knowledge/raw/` に実格納済み: 11本
- `citation-only`: 37本
- `blocked-access`: 25本

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
| D03-S01 | D03 | `citation-only` | Becker-Doring (1935), Kinetische Behandlung der Keimbildung in ubersattigten Dampfen | — | `evidence/evidence-D03-chemistry.md` | archive refs と ref-check で実在確認。2026-04-07 時点では primary full-text route 未確認 |
| D03-S02 | D03 | `blocked-access` | Johnson & Goody (2011), The Original Michaelis Constant: Translation of the 1913 Michaelis-Menten Paper | — | `evidence/evidence-D03-chemistry.md` | ACS supporting-info PDF URL が Cloudflare challenge で HTTP 403。手動ブラウザ取得余地あり |
| D03-S03 | D03 | `blocked-access` | Theory of Microphase Separation in Block Copolymers | — | `evidence/evidence-D03-chemistry.md` | ACS PDF URL が Cloudflare challenge で HTTP 403。bot/CLI 由来失敗の可能性が高い |
| D03-S04 | D03 | `blocked-access` | Oscillations in Chemical Systems. IV. Limit Cycle Behavior in a Model of a Real Chemical Reaction | — | `evidence/evidence-D03-chemistry.md` | ACS PDF URL が Cloudflare challenge で HTTP 403。手動ブラウザ取得余地あり |
| D03-S05 | D03 | `blocked-access` | The Chemical Basis of Morphogenesis | — | `evidence/evidence-D03-chemistry.md` | Royal Society PDF URL が Cloudflare challenge で HTTP 403。OA 記事自体は存在し、手動ブラウザ取得余地あり |
| D03-S06 | D03 | `citation-only` | Lehn (1995), Supramolecular Chemistry | — | `evidence/evidence-D03-chemistry.md` | archive refs と ref-check で実在確認。Lehn/Whitesides 系のどれを anchor にするかは後続で要統一 |
| D03-S07 | D03 | `citation-only` | Lewis-von Elbe (1961), Combustion, Flames and Explosions of Gases | — | `evidence/evidence-D03-chemistry.md` | archive refs と ref-check で実在確認。2026-04-07 時点では stable primary full-text route 未確認 |
| D03-S08 | D03 | `blocked-access` | Winter & Chambon (1986), Analysis of Linear Viscoelasticity of a Crosslinking Polymer at the Gel Point | — | `evidence/evidence-D03-chemistry.md` | AIP/JOR PDF endpoint が Cloudflare challenge で HTTP 403。手動ブラウザ取得余地あり |
| D03-S09 | D03 | `blocked-access` | A Production of Amino Acids Under Possible Primitive Earth Conditions | — | `evidence/evidence-D03-chemistry.md` | Science PDF URL が Cloudflare challenge で HTTP 403。publisher/bot gating の可能性が高い |
| D03-S10 | D03 | `citation-only` | Goldbeter (1996), Biochemical Oscillations and Cellular Rhythms | — | `evidence/evidence-D03-chemistry.md` | archive refs と ref-check で実在確認。2026-04-07 時点では stable primary full-text route 未確認 |
| D04-S01 | D04 | `citation-only` | Darwin (1859), On the Origin of Species | — | `evidence/evidence-D04-evolutionary-biology.md` | archive refs と ref-check で実在確認。2026-04-07 時点では stable primary full-text route 未確認 |
| D04-S02 | D04 | `citation-only` | Eldredge & Gould (1972), Punctuated equilibria | — | `evidence/evidence-D04-evolutionary-biology.md` | archive refs と ref-check で実在確認。official full-text route は未確認 |
| D04-S03 | D04 | `citation-only` | Odling-Smee, Laland & Feldman (2003), Niche Construction | — | `evidence/evidence-D04-evolutionary-biology.md` | archive refs と ref-check で実在確認。book-level anchor のため official full-text route は未確認 |
| D04-S04 | D04 | `blocked-access` | Laland et al. (2015), The extended evolutionary synthesis: its structure, assumptions and predictions | — | `evidence/evidence-D04-evolutionary-biology.md` | PMC article page は到達するが PDF 直リンクは \"Preparing to download ...\" POW challenge HTML を返し raw PDF 未取得。手動ブラウザ余地あり |
| D04-S05 | D04 | `citation-only` | Waddington (1953), Genetic assimilation of an acquired character | — | `evidence/evidence-D04-evolutionary-biology.md` | archive refs と ref-check で実在確認。official full-text route は未確認 |
| D04-S06 | D04 | `citation-only` | Van Valen (1973), A new evolutionary law | — | `evidence/evidence-D04-evolutionary-biology.md` | archive refs と ref-check で実在確認。official full-text route は未確認 |
| D04-S07 | D04 | `citation-only` | Barton & Hewitt (1985), Analysis of hybrid zones | — | `evidence/evidence-D04-evolutionary-biology.md` | archive refs と ref-check で実在確認。official full-text route は未確認 |
| D04-S08 | D04 | `citation-only` | Sagan (1967), On the Origin of Mitosing Cells | — | `evidence/evidence-D04-evolutionary-biology.md` | archive refs と ref-check で実在確認。official full-text route は未確認 |
| D04-S09 | D04 | `blocked-access` | Woese (2002), On the evolution of cells | — | `evidence/evidence-D04-evolutionary-biology.md` | PMC article page は到達するが PDF 直リンクは \"Preparing to download ...\" POW challenge HTML を返し raw PDF 未取得。手動ブラウザ余地あり |
| D04-S10 | D04 | `citation-only` | Schluter (2000), The Ecology of Adaptive Radiation | — | `evidence/evidence-D04-evolutionary-biology.md` | archive refs と ref-check で実在確認。book-level anchor のため official full-text route は未確認 |
| D05-S01 | D05 | `citation-only` | Wilson(1966) | — | `evidence/evidence-D05-earth-science.md` | archive refs 由来の draft。2026-04-07 時点では書誌確認のみ |
| D05-S02 | D05 | `citation-only` | Morgan(1968) | — | `evidence/evidence-D05-earth-science.md` | archive refs 由来の draft。2026-04-07 時点では書誌確認のみ |
| D05-S03 | D05 | `citation-only` | Le Pichon(1968) | — | `evidence/evidence-D05-earth-science.md` | archive refs 由来の draft。2026-04-07 時点では書誌確認のみ |
| D05-S04 | D05 | `citation-only` | Dewey & Bird(1970) | — | `evidence/evidence-D05-earth-science.md` | archive refs 由来の draft。2026-04-07 時点では書誌確認のみ |
| D05-S05 | D05 | `citation-only` | Conrad & Lithgow-Bertelloni(2002) | — | `evidence/evidence-D05-earth-science.md` | archive refs 由来の draft。2026-04-07 時点では書誌確認のみ |
| D05-S06 | D05 | `citation-only` | Nance et al.(2014) | — | `evidence/evidence-D05-earth-science.md` | archive refs 由来の draft。2026-04-07 時点では書誌確認のみ |
| D05-S07 | D05 | `citation-only` | Philander(1983) | — | `evidence/evidence-D05-earth-science.md` | archive refs 由来の draft。2026-04-07 時点では書誌確認のみ |
| D05-S08 | D05 | `citation-only` | Cane & Zebiak(1985) | — | `evidence/evidence-D05-earth-science.md` | archive refs 由来の draft。2026-04-07 時点では書誌確認のみ |
| D05-S09 | D05 | `citation-only` | Suarez & Schopf(1988) | — | `evidence/evidence-D05-earth-science.md` | archive refs 由来の draft。2026-04-07 時点では書誌確認のみ |
| D05-S10 | D05 | `citation-only` | Bjerknes(1969) | — | `evidence/evidence-D05-earth-science.md` | archive refs 由来の draft。2026-04-07 時点では書誌確認のみ |
| D06-S01 | D06 | `blocked-access` | Jeans (1902), The Stability of a Spherical Nebula | — | `evidence/evidence-D06-astronomy.md` | Royal Society PDF routeは存在するが、CLI では Cloudflare challenge で HTTP 403。手動ブラウザ取得余地あり |
| D06-S02 | D06 | `citation-only` | White & Rees (1978), Core condensation in heavy halos | — | `evidence/evidence-D06-astronomy.md` | ADS abstract で書誌確認。2026-04-07 時点では official full-text route 未確認 |
| D06-S03 | D06 | `blocked-access` | Tumlinson, Peeples & Werk (2017), The Circumgalactic Medium | — | `evidence/evidence-D06-astronomy.md` | Annual Reviews route が Cloudflare challenge で HTTP 403。手動ブラウザ取得余地あり |
| D06-S04 | D06 | `citation-only` | Balbus & Hawley (1991), A powerful local shear instability in weakly magnetized disks | — | `evidence/evidence-D06-astronomy.md` | archive refs と ref-check で実在確認。official PDF route は未確認 |
| D06-S05 | D06 | `citation-only` | Pollack et al. (1996), Formation of the Giant Planets by Concurrent Accretion of Solids and Gas | — | `evidence/evidence-D06-astronomy.md` | archive refs と ref-check で実在確認。official PDF route は未確認 |
| D06-S06 | D06 | `citation-only` | Blandford & Ostriker (1978), Particle Acceleration by Astrophysical Shocks | — | `evidence/evidence-D06-astronomy.md` | archive refs と ref-check で実在確認。official PDF route は未確認 |
| D06-S07 | D06 | `blocked-access` | Charbonneau (2020), Dynamo Models of the Solar Cycle | — | `evidence/evidence-D06-astronomy.md` | Springer PDF URL が `idp.springer.com/authorize` へ 303 redirect。機関ログインまたは手動ブラウザ余地あり |
| D06-S08 | D06 | `raw-confirmed` | Planck Collaboration (2016), Planck 2015 results. XIII. Cosmological parameters | `knowledge/raw/D06_planck-collaboration_2016_cosmological-parameters.pdf` | `evidence/evidence-D06-astronomy.md` | A&A 公式 PDF を保存。CLI 取得成功、実 PDF 判定 |
| D06-S09 | D06 | `blocked-access` | Abbott et al. (2017), GW170817: Observation of Gravitational Waves from a Binary Neutron Star Inspiral | — | `evidence/evidence-D06-astronomy.md` | APS PDF URL が Cloudflare challenge で HTTP 403。手動ブラウザ取得余地あり |
| D06-S10 | D06 | `citation-only` | Spitzer (1987), Dynamical Evolution of Globular Clusters | — | `evidence/evidence-D06-astronomy.md` | 書誌確認のみ。official full-text route は未確認 |
| D07-S01 | D07 | `blocked-access` | Wiener (1948), Cybernetics: Or Control and Communication in the Animal and the Machine | — | `evidence/evidence-D07-engineering.md` | MIT Press OA monograph page はあるが、CLI では Cloudflare challenge に着地。手動ブラウザ取得余地あり |
| D07-S02 | D07 | `blocked-access` | ISO 9001:2015 | — | `evidence/evidence-D07-engineering.md` | ISO landing page は HTTP 200 で存在確認。full text は purchase/institution barrier のため raw 未取得 |
| D07-S03 | D07 | `citation-only` | Jacobson (1988), Congestion Avoidance and Control | — | `evidence/evidence-D07-engineering.md` | archive refs と ref-check で実在確認。official ACM/SIGCOMM route は未確認 |
| D07-S04 | D07 | `blocked-access` | Rumelhart, Hinton, Williams (1986), Learning representations by back-propagating errors | — | `evidence/evidence-D07-engineering.md` | Nature PDF URL が `idp.nature.com/authorize` へ 303 redirect。機関ログインまたは手動ブラウザ余地あり |
| D07-S05 | D07 | `raw-confirmed` | Shannon (1948), A Mathematical Theory of Communication | `knowledge/raw/D07_shannon_1948_mathematical-theory-communication.pdf` | `evidence/evidence-D07-engineering.md` | Harvard-hosted PDF を保存。CLI 取得成功、実 PDF 判定 |
| D07-S06 | D07 | `citation-only` | Candes, Romberg, Tao (2006), Robust uncertainty principles: Exact signal reconstruction from highly incomplete frequency information | — | `evidence/evidence-D07-engineering.md` | archive refs と ref-check で実在確認。official IEEE route は未確認 |
| D07-S07 | D07 | `citation-only` | Schultz, Dayan, Montague (1997), A neural substrate of prediction and reward | — | `evidence/evidence-D07-engineering.md` | PubMed で書誌確認。official Science full text は未確認 |
| D07-S08 | D07 | `citation-only` | Holland (1975), Adaptation in Natural and Artificial Systems | — | `evidence/evidence-D07-engineering.md` | 書誌確認のみ。official full-text route は未確認 |
| D07-S09 | D07 | `citation-only` | Fowler (1999), Refactoring | — | `evidence/evidence-D07-engineering.md` | 書誌確認のみ。official full-text route は未確認 |
| D07-S10 | D07 | `citation-only` | Diffie & Hellman (1976), New Directions in Cryptography | — | `evidence/evidence-D07-engineering.md` | 書誌確認のみ。official IEEE route は未確認 |
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
