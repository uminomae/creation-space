---
file_id: EV-PM
domain: pharmacy
domain_id: D11
last_updated: 2026-04-07
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D11-pharmacy.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：薬学（Pharmacy）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D11 first/second batch 12件を反映済み
- source 内訳は `raw-confirmed` 4 / `blocked-access` 0 / `citation-only` 8
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-07 first/second batch

- raw-confirmed:
  `ICH Q8(R2)`, `ICH Q9(R1)`, `ICH Q10`, `Li et al. 2014 (PLOS ONE)` は official PDF を `knowledge/raw/` に格納した
- blocked-access:
  0件
- citation-only:
  残る 8 source は archive refs / ref-check 起点の first-pass source rows
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D11-pharmacy.md`](archive/pre-rerun-20260407/evidence/evidence-D11-pharmacy.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 次の作業

- D11 の残る citation-only source で official full-text route の有無を順送りで切り分ける
- Nature Reviews / NEJM / PLOS など public or semi-public route の second pass を継続する
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
