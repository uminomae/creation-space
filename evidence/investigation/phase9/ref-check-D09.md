# D09 生命科学 — Phase 9 原典検証（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の Phase 9 原典検証メモを archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: ref-check 本文としては `not-yet-reviewed`
- source manifest には D09 first batch 11件を反映済み
- source 内訳は `raw-confirmed` 0 / `blocked-access` 3 / `citation-only` 8
- 既存の verified / plausible / overstated 判定は再保証しない
- 二次資料・要約・書誌情報のみで成立していた判定が混在していないか、原典アクセス状態から再点検する

## 2026-04-07 first batch

- blocked-access:
  `Pellerin & Magistretti 1994`, `Fields 2015`, `Iliff et al. 2012`
- citation-only:
  `Attwell & Laughlin 2001`, `Schafer et al. 2012`, `McEwen 1998`, `Schultz et al. 1997`, `Maynard Smith 1978`, `Tsukada & Ohsumi 1993`, `Wolpert 1969`, `Burnet 1957`

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/phase9/ref-check-D09.md`](../../archive/pre-rerun-20260407/phase9/ref-check-D09.md)
- 退避日: 2026-04-07
- 理由: 原典アクセス可否と本文確認の有無を切り分けて再監査するため

## 次の作業

- 当該領域の `knowledge/raw/` 候補原典を列挙する
- 既存判定の根拠を `raw-confirmed` / `citation-only` / `blocked-access` / `not-yet-reviewed` に振り分ける
- 新しい ref-check を history 参照つきで再作成する
