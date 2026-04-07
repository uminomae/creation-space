---
file_id: EV-CM
domain: clinical-medicine-immunology
domain_id: D10
last_updated: 2026-04-07
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D10-clinical-medicine.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：臨床医学・免疫学（Clinical Medicine & Immunology）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D10 first batch 4件を反映済み
- source 内訳は `raw-confirmed` 2 / `blocked-access` 1 / `citation-only` 1
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D10-clinical-medicine.md`](archive/pre-rerun-20260407/evidence/evidence-D10-clinical-medicine.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 2026-04-07 first batch

- raw-confirmed:
  `Akdis (2014)` と `Rosenblum (2015)` は raw PDF を `knowledge/raw/` に格納した
- blocked-access:
  `Tonegawa (1983)` は公開本文の安定取得に未達
- citation-only:
  `Burnet (1957)` は書誌確認のみ

## 次の作業

- D10 blocked/citation-only source の route を追加で切り分ける
- raw-confirmed source を起点に旧 verified 判定を source 単位へ再分解する
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
