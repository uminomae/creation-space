---
file_id: EV-D09
domain: life-sciences
domain_id: D09
last_updated: 2026-04-07
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D09-life-sciences.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：D09 生命科学（Life Sciences）— Step 7（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D09 first batch 11件を反映済み
- source 内訳は `raw-confirmed` 0 / `blocked-access` 3 / `citation-only` 8
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-07 first batch

- raw-confirmed: 0件
- blocked-access: 3件。source ごとの理由は `knowledge/raw/manifest.md` の notes を参照
- citation-only: 8件。archive refs / ref-check 起点の first-pass source rows
- manual/browser 余地:
  blocked-access source は CLI challenge / login redirect / HTML landing の可能性を残すため、notes を維持する
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D09-life-sciences.md`](archive/pre-rerun-20260407/evidence/evidence-D09-life-sciences.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 次の作業

- D09 の blocked-access source の manual/browser 余地を source ごとに詰める
- D09 の citation-only source で official full-text route の有無を順送りで切り分ける
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
