# Phase 9-1 原典検証: D25 人類学（Anthropology）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の Phase 9 原典検証メモを archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: ref-check 本文としては `not-yet-reviewed`
- source manifest には D25 first/second batch 10件を反映済み
- source 内訳は `raw-confirmed` 1 / `blocked-access` 3 / `citation-only` 6
- 既存の verified / plausible / overstated 判定は再保証しない
- 二次資料・要約・書誌情報のみで成立していた判定が混在していないか、原典アクセス状態から再点検する

## 2026-04-08 first/second batch

- raw-confirmed:
  `knowledge/raw/D25_pratt_1991_arts-of-the-contact-zone.pdf`
- blocked-access:
  `van Gennep (1909)` は Internet Archive download route が 503/HTML error page を返し raw 未取得
  `Lamont & Molnar (2002)` は SSRN delivery PDF route が Cloudflare challenge 403 HTML に着地し raw 未取得
  `Leroi-Gourhan / Lemonnier cluster` は Internet Archive download route が redirect 後に item unavailable / 401 へ着地し raw 未取得
- citation-only:
  残る 6 source は archive refs / ref-check 起点の first-pass source rows
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/phase9/ref-check-D25.md`](../../archive/pre-rerun-20260407/phase9/ref-check-D25.md)
- 退避日: 2026-04-07
- 理由: 原典アクセス可否と本文確認の有無を切り分けて再監査するため

## 次の作業

- 当該領域の `knowledge/raw/` 候補原典を列挙する
- 既存判定の根拠を `raw-confirmed` / `citation-only` / `blocked-access` / `not-yet-reviewed` に振り分ける
- 新しい ref-check を history 参照つきで再作成する
