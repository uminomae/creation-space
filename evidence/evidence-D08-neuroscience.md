---
file_id: EV-D08
domain: neuroscience
domain_id: D08
last_updated: 2026-04-07
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D08-neuroscience.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：D08 神経科学（Neuroscience）— Step 7（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D08 first batch 11件を反映済み
- source 内訳は `raw-confirmed` 1 / `blocked-access` 4 / `citation-only` 6
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-07 first batch

- raw-confirmed:
  `Varela et al. (1991)` は D14 で確保済み raw を D08 anchor として再利用した
- blocked-access:
  Nature / Nature Reviews の login redirect、Science / JNeurosci の Cloudflare challenge を確認した
- citation-only:
  残る 6 source は archive refs / ref-check で書誌確認できるが、stable official full-text route は未確認

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D08-neuroscience.md`](archive/pre-rerun-20260407/evidence/evidence-D08-neuroscience.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 次の作業

- D08 の blocked-access source の manual/browser 余地を source ごとに詰める
- D08 の citation-only source で official full-text route の有無を順送りで切り分ける
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
