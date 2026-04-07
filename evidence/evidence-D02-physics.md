---
file_id: EV-D02
domain: physics
domain_id: D02
last_updated: 2026-04-07
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D02-physics.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：物理学（D02）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D02 first batch 10件を反映済み
- source 内訳は `raw-confirmed` 4 / `blocked-access` 5 / `citation-only` 1
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-07 first batch

- raw-confirmed:
  `Feynman 1948`, `Abrikosov 1957`, `Rayleigh 1916`, `Zurek 2003` は実 PDF を `knowledge/raw/` に格納した
- blocked-access:
  IOP / Nature / APS / Springer で、HTML 着地、login redirect、Cloudflare challenge を source 単位で記録した
- citation-only:
  `Becker-Doring (1935)` は書誌確認のみ。本文 access route は次便で切り分ける
- manual/browser 余地:
  APS / IOP / Nature / Springer 系は、CLI や bot 判定で失敗している可能性を notes に残した

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D02-physics.md`](archive/pre-rerun-20260407/evidence/evidence-D02-physics.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 次の作業

- D02 の残り source を manifest へ追加し、first batch を全 source 行へ拡張する
- raw 取得不能理由を source ごとに追記し、手動ブラウザ余地の有無も切り分ける
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
