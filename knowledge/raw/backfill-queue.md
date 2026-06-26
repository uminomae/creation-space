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

## 2026-06-26 進捗（pjdhiro 手動DL → backfill 実行）

pjdhiro がブラウザ（別 egress）で B群を手動DL。配置された PDF を raw-confirmed 昇格 → source-reader で全文精読 → source-note 生成。

| source_id | 状態 (2026-06-26) | 備考 |
|---|---|---|
| D05-S15 Feistel 2024 | 🟡 raw-confirmed・**source-note 保留** | PDF DL済(2.4MB/10pp)。budget MAIN_ONLY のため次ラウンド精読 |
| D06-S15 Nicolis 2016 | 🟡 raw-confirmed・**source-note 保留** | PDF DL済(409KB)。次ラウンド精読 |
| D07-S13 Strogatz 2001 | ✅ **完了** (2026-06-26) | `D02_strogatz_2001_*.pdf` を D07 工学/情報視点で全文精読→`D07-S13_strogatz-2001.md` 生成。cross-domain-anchors.md #7 登録。manifest raw-confirmed 昇格。引用は D02-S13 と非重複 |
| D07-S15 Heylighen 2025 | ✅ **完了** (2026-06-26) | 全文精読(17pp, 本文§1-§12)→`D07-S15_heylighen-2025.md` 生成。5段階 全段階強対応。出版年は実際 2026(Complexities 2026,2,6)と source-note に明記 |
| D09-S02 Attwell-Laughlin 2001 | ✅ **完了** | 全文精読→`D09-S02_attwell-laughlin-2001.md` 生成 |
| D09-S09 Tsukada-Ohsumi 1993 | ⛔ **blocked-access 降格** | Wiley 実質paywall（Unpaywall bronze は stale）。OA代替なし→read-list 化 |
| D11-S16 Moffat 2017 | ⛔ **blocked-access 降格** | Nature 実質paywall。OA代替・repo copy なし→read-list 化 |
| D12-S13 Beisner 2003 | 🟡 raw-confirmed・**source-note 保留** | PDF DL済(238KB)。次ラウンド精読 |
| D23-S07 Luyckx 2006 | ⛔ **blocked-access 降格** | Wiley 実質paywall。OA代替なし→read-list 化 |
| D23-S14 van Geert 1998 | ✅ **完了** | 全文精読(pp.634-672)→`D23-S14_van-geert-1998.md` 生成 |
| D23-S15 van der Maas 2017 | 🟡 raw-confirmed・**source-note 保留** | 2026-06-26 再DL済(MDPI *J.Intelligence* 5(2):16, 3.4MB)。初回は別論文取り違えで `.cache/quarantine/` 退避。次ラウンド精読 |

### 次ラウンドの残務（budget 回復後）
1. **source-note 保留 5本**（D05-S15/D06-S15/D07-S15/D12-S13/D23-S15）= raw-confirmed 済・PDF あり → source-reader で全文精読して生成するだけ。
2. **D07-S13** = `cross-domain-anchors.md` に Strogatz 2001（D02↔D07）を追記し、D02版PDFを共用する source-note を D07 用に作成。

## 更新履歴

- 2026-06-25 #06: 初版。12本の gap を決定的トリアージし B群11 / スキャン1 に分類。PMID 3本の PMC 不在を確定。
- 2026-06-26: pjdhiro 手動DL 実施。完了2本(D09-S02/D23-S14)、降格3本(D09-S09/D11-S16/D23-S07=実質paywall)、source-note保留4本、要再DL1本(D23-S15取り違え)、DL不要1本(D07-S13)。budget MAIN_ONLY で打ち切り。
