---
file_id: EV-SO
domain: sociology
domain_id: D18
last_updated: 2026-04-07
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D18-sociology.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：社会学（Sociology）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D18 first batch 4件を反映済み
- source 内訳は `raw-confirmed` 1 / `blocked-access` 2 / `citation-only` 1
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-07 first batch

- raw-confirmed: 1件
- blocked-access: 2件。source ごとの理由は `knowledge/raw/manifest.md` の notes を参照
- citation-only: 1件。archive refs / ref-check 起点の first-pass source rows
- manual/browser 余地:
  blocked-access source は CLI challenge / login redirect / HTML landing の可能性を残すため、notes を維持する
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D18-sociology.md`](archive/pre-rerun-20260407/evidence/evidence-D18-sociology.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 2026-04-07 first batch

- raw-confirmed:
  `Durkheim (1893)` は raw PDF を `knowledge/raw/` に格納した
- blocked-access:
  `Berger & Luckmann (1966)` と `Giddens (1984)` は blocked-access として追跡
- citation-only:
  `Granovetter (1973)` は書誌確認のみ

## 次の作業

- D18 blocked/citation-only source の route を追加で切り分ける
- raw-confirmed source を起点に旧 verified 判定を source 単位へ再分解する
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
