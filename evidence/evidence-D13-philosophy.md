---
file_id: EV-D13
domain: philosophy
domain_id: D13
last_updated: 2026-04-08
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D13-philosophy.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：哲学（Philosophy）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D13 first batch 10件を反映済み
- source 内訳は `raw-confirmed` 3 / `blocked-access` 0 / `citation-only` 7
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-08 second/third batch

- raw-confirmed:
  `knowledge/raw/D13_dewey_1910_how-we-think.pdf`
  `knowledge/raw/D13_whitehead_1929_process-and-reality.pdf`
  `knowledge/raw/D13_dewey_1916_democracy-and-education.pdf`
- blocked-access: 0件。source ごとの理由は `knowledge/raw/manifest.md` の notes を参照
- citation-only: 7件。archive refs / ref-check 起点の first-pass source rows
- manual/browser 余地:
  blocked-access source は CLI challenge / login redirect / HTML landing の可能性を残すため、notes を維持する
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D13-philosophy.md`](archive/pre-rerun-20260407/evidence/evidence-D13-philosophy.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 次の作業

- 原典アクセス状態を `raw-confirmed` / `citation-only` / `blocked-access` / `not-yet-reviewed` で棚卸しする
- `knowledge/raw/README.md` の manifest に候補原典を記録する
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
