---
file_id: EV-D01
domain: mathematics
domain_id: D01
last_updated: 2026-04-07
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D01-mathematics.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：数学（D01）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D01 first batch 3件を反映済み
- source 内訳は `raw-confirmed` 1 / `blocked-access` 2 / `citation-only` 0
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-07 first batch

- raw-confirmed: 1件
- blocked-access: 2件。source ごとの理由は `knowledge/raw/manifest.md` の notes を参照
- citation-only: 0件。archive refs / ref-check 起点の first-pass source rows
- manual/browser 余地:
  blocked-access source は CLI challenge / login redirect / HTML landing の可能性を残すため、notes を維持する
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D01-mathematics.md`](archive/pre-rerun-20260407/evidence/evidence-D01-mathematics.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 2026-04-07 first batch

- raw-confirmed:
  `Bott (1988)` は Numdam OA PDF を `knowledge/raw/` に格納した
- blocked-access:
  `Carlsson (2009)` と `Ghrist (2008)` は AMS 導線までは確認できるが、CLI では Cloudflare challenge で止まる

## 次の作業

- D01 blocked-access source で manual/browser 余地を再確認する
- raw-confirmed source を起点に旧 verified 判定を source 単位へ再分解する
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
