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

- 原典アクセス状態: `not-yet-reviewed`
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D10-clinical-medicine.md`](archive/pre-rerun-20260407/evidence/evidence-D10-clinical-medicine.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## Trial raw files

- [`D10_akdis_2014_allergen-immunotherapy.pdf`](../knowledge/raw/D10_akdis_2014_allergen-immunotherapy.pdf) — `raw-confirmed`
- [`D10_rosenblum_2015_autoimmunity.pdf`](../knowledge/raw/D10_rosenblum_2015_autoimmunity.pdf) — `raw-confirmed`

この2件は D10 の pilot raw-confirmed であり、D10 全体の再監査はまだ未完了。

## 次の作業

- 原典アクセス状態を `raw-confirmed` / `citation-only` / `blocked-access` / `not-yet-reviewed` で棚卸しする
- `knowledge/raw/README.md` の manifest に候補原典を記録する
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
