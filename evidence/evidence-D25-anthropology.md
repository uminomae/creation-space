---
file_id: EV-D25
domain: anthropology
domain_id: D25
last_updated: 2026-04-08
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D25-anthropology.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：人類学・民族学（Anthropology）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D25 first/second batch 10件を反映済み
- source 内訳は `raw-confirmed` 1 / `blocked-access` 2 / `citation-only` 7
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-08 first/second batch

- raw-confirmed:
  `knowledge/raw/D25_pratt_1991_arts-of-the-contact-zone.pdf`
- blocked-access:
  `van Gennep (1909)` は Internet Archive download route が 503/HTML error page を返し raw 未取得。manual/browser 再試行余地あり
  `Lamont & Molnar (2002)` は SSRN delivery PDF route が Cloudflare challenge 403 HTML に着地し raw 未取得。manual/browser 再試行余地あり
- citation-only:
  残る 7 source は archive refs / ref-check 起点の first-pass source rows
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D25-anthropology.md`](archive/pre-rerun-20260407/evidence/evidence-D25-anthropology.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 次の作業

- 原典アクセス状態を `raw-confirmed` / `citation-only` / `blocked-access` / `not-yet-reviewed` で棚卸しする
- `knowledge/raw/README.md` の manifest に候補原典を記録する
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
