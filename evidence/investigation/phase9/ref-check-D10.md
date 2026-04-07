# D10 臨床医学 — Phase 9 原典検証（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の Phase 9 原典検証メモを archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: ref-check 本文としては `not-yet-reviewed`
- source manifest には D10 first batch 4件を反映済み
- source 内訳は `raw-confirmed` 2 / `blocked-access` 1 / `citation-only` 1
- 既存の verified / plausible / overstated 判定は再保証しない
- 二次資料・要約・書誌情報のみで成立していた判定が混在していないか、原典アクセス状態から再点検する

## 2026-04-07 first batch

- raw-confirmed: 2件
- blocked-access: 1件。source ごとの理由は `knowledge/raw/manifest.md` の notes を参照
- citation-only: 1件。archive refs / ref-check 起点の first-pass source rows
- 注意:
  blocked-access は「本文不存在」ではなく、CLI challenge / login / HTML 着地を含む
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/phase9/ref-check-D10.md`](../../archive/pre-rerun-20260407/phase9/ref-check-D10.md)
- 退避日: 2026-04-07
- 理由: 原典アクセス可否と本文確認の有無を切り分けて再監査するため

## 2026-04-07 first batch

- raw-confirmed:
  `Akdis (2014)` と `Rosenblum (2015)` は raw PDF 取得済み
- blocked-access:
  `Tonegawa (1983)` は公開本文の安定取得に未達
- citation-only:
  `Burnet (1957)` は書誌確認のみ

## 次の作業

- D10 blocked/citation-only source の route を追加で切り分ける
- raw-confirmed source を起点に旧 verified 判定を source 単位へ再分解する
- 新しい ref-check を history 参照つきで再作成する
