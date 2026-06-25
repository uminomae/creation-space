# cs#253 B軸: OA 取得実態監査レポート

対象: raw-confirmed, url-verified / 305 行

## 集計

| verdict | 件数 | 意味 |
|---|---|---|
| OA_PDF | 122 | 200+PDF = オープンに本文取得可 ✓ |
| OA_HTML | 32 | 200+HTML = 全文ページ or landing/paywall（要目視） |
| BLOCKED | 42 | 401/403 = env ブロック or paywall |
| DEAD | 3 | 404/410 = リンク腐敗 |
| NET_ERR | 9 | 接続不能（sandbox/DNS/timeout・判定不能） |
| NO_URL | 91 | notes に URL 無し |
| OTHER | 6 | その他 |

## url-verified 主張と乖離する行（BLOCKED / DEAD）

`url-verified` を主張するが現在オープン取得できない行。env-block(別egress)か腐敗かの切り分けは host で判断。

| sid | status | verdict | http | url |
|---|---|---|---|---|
| D10-S05 | raw-confirmed | BLOCKED | 403 | https://journals.physiology.org/doi/pdf/10.1152/physrev.00067.2017 |
| D18-S12 | url-verified | DEAD | 404 | https://germanhistorydocs.ghi-dc.org/pdf/eng/322_Georg%20Simmel_Metrop |
| D02-S05 | raw-confirmed | BLOCKED | 403 | http://link.aps.org/pdf/10.1103/PhysRevLett.13.508 |
| D02-S06 | raw-confirmed | BLOCKED | 403 | http://link.aps.org/pdf/10.1103/PhysRevLett.39.1201 |
| D02-S11 | url-verified | BLOCKED | 403 | https://www.pnas.org/doi/10.1073/pnas.97.1.28 |
| D02-S14 | url-verified | BLOCKED | 403 | https://www.mdpi.com/1099-4300/14/11/2100/pdf |
| D03-S14 | url-verified | BLOCKED | 403 | https://www.mdpi.com/1099-4300/12/7/1733/pdf |
| D03-S15 | url-verified | BLOCKED | 403 | https://www.mdpi.com/2075-1729/11/4/308/pdf |
| D04-S04 | url-verified | BLOCKED | 403 | https://royalsocietypublishing.org/doi/pdf/10.1098/rspb.2015.1019 |
| D04-S11 | url-verified | BLOCKED | 403 | http://www.cell.com/article/S0960982215009902/pdf |
| D04-S12 | url-verified | BLOCKED | 403 | http://www.cell.com/article/S0169534715002931/pdf |
| D04-S15 | url-verified | BLOCKED | 403 | http://www.cell.com/article/S0092867412014389/pdf |
| D05-S11 | url-verified | BLOCKED | 403 | https://www.tandfonline.com/doi/pdf/10.3402/tellusb.v35i4.14616 |
| D05-S13 | url-verified | BLOCKED | 403 | https://www.mdpi.com/1099-4300/12/3/613/pdf |
| D05-S15 | url-verified | BLOCKED | 403 | https://www.mdpi.com/2073-8994/16/12/1611/pdf |
| D06-S02 | url-verified | BLOCKED | 403 | https://academic.oup.com/mnras/article-pdf/183/3/341/2943374/mnras183- |
| D06-S14 | url-verified | BLOCKED | 403 | https://www.mdpi.com/1099-4300/14/11/2100/pdf |
| D06-S15 | url-verified | BLOCKED | 403 | https://www.mdpi.com/1099-4300/18/5/172/pdf |
| D07-S03 | url-verified | BLOCKED | 403 | https://dl.acm.org/doi/pdf/10.1145/52324.52356 |
| D07-S14 | url-verified | BLOCKED | 403 | https://www.mdpi.com/1099-4300/14/11/2100/pdf |
| D07-S15 | url-verified | BLOCKED | 403 | https://www.mdpi.com/journal/complexities |
| D08-S04 | url-verified | DEAD | 404 | https://ekmillerlab.mit.edu/wp-content/uploads/2013/03/Miller-Cohen-20 |
| D08-S05 | url-verified | BLOCKED | 403 | http://www.cell.com/article/S0896627311002583/pdf |
| D08-S11 | url-verified | BLOCKED | 403 | https://www.jneurosci.org/content/jneuro/23/35/11167.full.pdf |
| D08-S14 | url-verified | BLOCKED | 403 | https://royalsocietypublishing.org/doi/pdf/10.1098/rstb.2014.0167 |
| D08-S16 | url-verified | BLOCKED | 403 | http://www.cell.com/article/S0896627320300520/pdf |
| D09-S02 | url-verified | BLOCKED | 403 | https://journals.sagepub.com/doi/pdf/10.1097/00004647-200110000-00001 |
| D09-S03 | url-verified | BLOCKED | 403 | http://www.cell.com/article/S0896627312003340/pdf |
| D09-S12 | url-verified | BLOCKED | 403 | http://jcb.rupress.org/content/155/2/181.full.pdf |
| D12-S13 | url-verified | BLOCKED | 403 | https://onlinelibrary.wiley.com/doi/pdfdirect/10.1890/1540-9295%282003 |
| D16-S05 | url-verified | BLOCKED | 403 | https://cadmus.eui.eu/bitstream/1814/23648/1/1997_EUI%20WP_JeanMonnet_ |
| D16-S09 | raw-confirmed | BLOCKED | 401 | https://dn720209.ca.archive.org/0/items/etaoin/The%20Muqaddimah%20%E2% |
| D16-S11 | raw-confirmed | BLOCKED | 403 | https://www.pnas.org/content/pnas/110/41/16384.full.pdf |
| D17-S11 | url-verified | BLOCKED | 403 | https://academic.oup.com/jole/article-pdf/2/2/160/19522987/lzx001.pdf |
| D17-S12 | raw-confirmed | BLOCKED | 403 | https://www.pnas.org/content/pnas/105/31/10681.full.pdf |
| D17-S13 | raw-confirmed | BLOCKED | 403 | https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/cogs.12876 |
| D20-S14 | raw-confirmed | BLOCKED | 403 | https://www.annualreviews.org/doi/pdf/10.1146/annurev.energy.30.050504 |
| D20-S16 | raw-confirmed | BLOCKED | 403 | https://royalsocietypublishing.org/doi/pdf/10.1098/rsif.2013.0475 |
| D23-S15 | url-verified | BLOCKED | 403 | https://www.preprints.org/manuscript/201701.0107/v1/download |
| D24-S03 | url-verified | BLOCKED | 403 | https://www.pewresearch.org/religion/2025/03/26/around-the-world-many- |
| D24-S15 | url-verified | DEAD | 404 | https://archive.org/download/cosmconscious/cosmconscious.pdf |
| D26-S16 | url-verified | BLOCKED | 403 | https://journals.sagepub.com/doi/pdf/10.1177/20592043211030471 |
| D27-S13 | url-verified | BLOCKED | 403 | https://www.mdpi.com/2413-8851/3/3/96/pdf |
| D27-S15 | raw-confirmed | BLOCKED | 403 | https://www.preprints.org/manuscript/202501.1694/v1/download |
| D29-S10 | raw-confirmed | BLOCKED | 403 | https://www.mdpi.com/1099-4300/12/7/1733/pdf |

## host 別集計（egress ブロックの偏りを見る）

| host | OA_PDF | OA_HTML | BLOCKED | DEAD | NET_ERR |
|---|---|---|---|---|---|
| archive.org | 18 | 10 | 0 | 1 | 1 |
| arxiv.org | 17 | 0 | 0 | 0 | 0 |
| www.frontiersin.org | 11 | 2 | 0 | 0 | 0 |
| journals.plos.org | 10 | 1 | 0 | 0 | 0 |
| www.mdpi.com | 0 | 0 | 11 | 0 | 0 |
| www.ncbi.nlm.nih.gov | 0 | 8 | 0 | 0 | 0 |
| www.cell.com | 0 | 0 | 6 | 0 | 1 |
| doi.org | 1 | 5 | 0 | 0 | 0 |
| europepmc.org | 2 | 0 | 0 | 0 | 0 |
| www.nature.com | 1 | 1 | 0 | 0 | 2 |
| www.pnas.org | 0 | 0 | 3 | 0 | 1 |
| onlinelibrary.wiley.com | 0 | 0 | 2 | 0 | 2 |
| link.springer.com | 3 | 0 | 0 | 0 | 0 |
| royalsocietypublishing.org | 0 | 0 | 3 | 0 | 0 |
| journals.sagepub.com | 0 | 0 | 2 | 0 | 1 |
| monoskop.org | 3 | 0 | 0 | 0 | 0 |
| web.mit.edu | 3 | 0 | 0 | 0 | 0 |
| www.ams.org | 0 | 0 | 0 | 0 | 0 |
| link.aps.org | 0 | 0 | 2 | 0 | 0 |
| journals.ametsoc.org | 1 | 1 | 0 | 0 | 0 |
| academic.oup.com | 0 | 0 | 2 | 0 | 0 |
| www.cs.utexas.edu | 2 | 0 | 0 | 0 | 0 |
| www.cambridge.org | 2 | 0 | 0 | 0 | 0 |
| www.ecologyandsociety.org | 2 | 0 | 0 | 0 | 0 |
| pure.rug.nl | 2 | 0 | 0 | 0 | 0 |
| www.scielo.br | 2 | 0 | 0 | 0 | 0 |
| www.preprints.org | 0 | 0 | 2 | 0 | 0 |
