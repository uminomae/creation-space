---
file_id: EV-D04
domain: evolutionary-biology
domain_id: D04
last_updated: 2026-04-07
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D04-evolutionary-biology.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：進化生物学（D04）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D04 first batch 10件を反映済み
- source 内訳は `raw-confirmed` 0 / `blocked-access` 2 / `citation-only` 8
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-07 first batch

- blocked-access:
  `Laland et al. 2015`, `Woese 2002` は PMC article page までは到達するが、PDF 直リンクが POW challenge HTML を返した
- citation-only:
  残る 8 source は archive refs / ref-check で書誌確認できるが、stable official full-text route は未確認
- manual/browser 余地:
  PMC の POW challenge は CLI 制約由来で、手動ブラウザなら回収できる可能性が高い

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D04-evolutionary-biology.md`](archive/pre-rerun-20260407/evidence/evidence-D04-evolutionary-biology.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 次の作業

- D04 の POW challenge source を manual/browser 前提で再試行し、raw-confirmed を増やす
- D04 の citation-only source で official full-text route の有無を順送りで切り分ける
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
