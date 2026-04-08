---
file_id: EV-LP
domain: law-politics
domain_id: D20
last_updated: 2026-04-07
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D20-law-politics.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：法学・政治学（Law & Political Science）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D20 first/second batch 10件を反映済み
- source 内訳は `raw-confirmed` 2 / `blocked-access` 2 / `citation-only` 6
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-07 first/second batch

- raw-confirmed:
  `International IDEA (2011)` は official PDF を `knowledge/raw/` に格納した
  `Ostrom (1990)` は Internet Archive open item を `knowledge/raw/` に格納した
- blocked-access:
  `UNCITRAL (2021)`, `United Nations (2018)` は CloudFront 403 HTML を返し raw 未取得
- citation-only:
  残る 6 source は archive refs / ref-check 起点の first-pass source rows
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D20-law-politics.md`](archive/pre-rerun-20260407/evidence/evidence-D20-law-politics.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 次の作業

- D20 の blocked-access source を別 route で再試行し、raw-confirmed を増やす
- D20 の残る citation-only source で official full-text route の有無を順送りで切り分ける
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
