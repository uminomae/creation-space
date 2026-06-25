# 1:1 ギャップ backfill キュー（cs#249）

manifest の `raw-confirmed` / `url-verified` 行のうち、対応する source-note が**未生成**の行（§1「原典→source-note 1:1 原則」のギャップ）の追跡簿。

> **これは「取得不能 read-list」ではない**。ここに載るのは **OA が存在する**行＝鎖の「持つ」を満たしうるもの。当環境（Main egress）から取得できるかどうかで処理経路が分かれる。真に取得不能（OA なし）なら blocked-access/citation-only へ降格して read-list 化（`source-note-invariants.md §2.6`）であり、本簿の対象外。

## 経路の決定的判定（2026-06-25 #06 トリアージ）

判定は `unpaywall` の oa_locations + 当環境 curl プローブ（HTTP code / content-type / magic）で機械実施。

| source_id | 領域 | OA 経路 | Main 到達 | 処理経路 |
|---|---|---|---|---|
| D05-S15 | D05 | MDPI (`sym16121611`) | ✗ 403 Cloudflare | **B群**: subagent 別egress |
| D06-S15 | D06 | MDPI (`e18050172`) / ULB mirror | ✗ MDPI 403・ULB は metadata only | **B群**: subagent 別egress |
| D07-S13 | D07 | Nature (`35065725`) | ✗ HTML landing(paywall) | **B群**: subagent 別egress |
| D07-S15 | D07 | MDPI (`complexities2010006`) | ✗ 403 Cloudflare | **B群**: subagent 別egress |
| D09-S02 | D09 | SAGE (`00004647-200110000-00001`) | ✗ SAGE wall | **B群**: subagent 別egress |
| D09-S09 | D09 | Wiley pdfdirect (`0014-5793(93)80398-E`) | ✗ 403 | **B群**: subagent 別egress |
| D11-S16 | D11 | Nature (`nrd.2017.111`) | ✗ paywall | **B群**: subagent 別egress |
| D12-S13 | D12 | Wiley pdfdirect (`1540-9295(2003)001`) | ✗ 403 | **B群**: subagent 別egress |
| D13-S02 | D13 | monoskop PDF (Simondon 1958/1989) | △ **PDF 到達可** | **スキャン**: 182頁・テキスト層なし・仏語。image 精読は要 budget |
| D23-S07 | D23 | Wiley pdfdirect (`j.adolescence.2005.03.008`) | ✗ 403 | **B群**: subagent 別egress |
| D23-S14 | D23 | rug.nl repository (van Geert 1998) | ✗ landing 200 だが file 403 | **B群**: subagent 別egress |
| D23-S15 | D23 | preprints.org (van der Maas 2017) | ✗ 403 | **B群**: subagent 別egress |

## 結論

- **11本 = B群**（OA は存在するが当環境 Main egress がブロック）。budget 回復後に source-reader を**別 egress**で起動して消化する。固定代替は立てない（探索継続）。
- **1本 = D13-S02 Simondon**：monoskop の 18MB スキャン PDF（182頁・テキスト層なし・仏語）。到達可だが全文 image 精読は budget を要する。budget 回復後に主要章を image mode で精読。
- **PMID 3本（D09-S09 / D11-S16 / D23-S07）は PMC に存在しない**（idconv `Identifier not found in PMC`）。前回想定の「PMID→PMCID→PMC 全文」経路は**存在しない**ため、これらも publisher CDN ブロックに帰着する。

> いずれも Check 6（領域 ≥5）は満たしており FAIL ではない。本キューは品質向上のための backfill debt であって不変条件違反ではない。

## 更新履歴

- 2026-06-25 #06: 初版。12本の gap を決定的トリアージし B群11 / スキャン1 に分類。PMID 3本の PMC 不在を確定。
