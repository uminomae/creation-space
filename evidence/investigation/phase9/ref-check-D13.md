# Phase 9-1 原典検証: D13 哲学 (Philosophy)（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の Phase 9 原典検証メモを archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: ref-check 本文としては `not-yet-reviewed`
- source manifest には D13 first batch 10件を反映済み
- source 内訳は `raw-confirmed` 4 / `blocked-access` 1 / `citation-only` 5
- 既存の verified / plausible / overstated 判定は再保証しない
- 二次資料・要約・書誌情報のみで成立していた判定が混在していないか、原典アクセス状態から再点検する

## 2026-04-08 second/third batch

- raw-confirmed:
  `knowledge/raw/D13_dewey_1910_how-we-think.pdf`
  `knowledge/raw/D13_whitehead_1929_process-and-reality.pdf`
  `knowledge/raw/D13_dewey_1934_art-as-experience.pdf`
  `knowledge/raw/D13_dewey_1929_quest-for-certainty.pdf`
- blocked-access:
  `Dewey (1933)` は Internet Archive download route `howwethinkrestat0000john.pdf` が redirect 後に item unavailable / 401 へ着地し raw 未取得
- citation-only: 5件。archive refs / ref-check 起点の first-pass source rows
- 注意:
  blocked-access は「本文不存在」ではなく、CLI challenge / login / HTML 着地を含む
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/phase9/ref-check-D13.md`](../../archive/pre-rerun-20260407/phase9/ref-check-D13.md)
- 退避日: 2026-04-07
- 理由: 原典アクセス可否と本文確認の有無を切り分けて再監査するため

## 次の作業

- 当該領域の `knowledge/raw/` 候補原典を列挙する
- 既存判定の根拠を `raw-confirmed` / `citation-only` / `blocked-access` / `not-yet-reviewed` に振り分ける
- 新しい ref-check を history 参照つきで再作成する
