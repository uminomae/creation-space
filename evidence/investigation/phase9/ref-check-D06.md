# D06 天文学 — Phase 9 原典検証（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の Phase 9 原典検証メモを archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: ref-check 本文としては `not-yet-reviewed`
- source manifest には D06 first batch 10件を反映済み
- source 内訳は `raw-confirmed` 1 / `blocked-access` 4 / `citation-only` 5
- 既存の verified / plausible / overstated 判定は再保証しない
- 二次資料・要約・書誌情報のみで成立していた判定が混在していないか、原典アクセス状態から再点検する

## 2026-04-07 first batch

- raw-confirmed:
  `Planck Collaboration (2016)` は official A&A PDF を取得済み
- blocked-access:
  `Jeans 1902`, `Tumlinson et al. 2017`, `Charbonneau 2020`, `Abbott et al. 2017` は challenge/login barrier を確認
- citation-only:
  `White & Rees 1978`, `Balbus & Hawley 1991`, `Pollack et al. 1996`, `Blandford & Ostriker 1978`, `Spitzer 1987` は書誌確認のみ

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/phase9/ref-check-D06.md`](../../archive/pre-rerun-20260407/phase9/ref-check-D06.md)
- 退避日: 2026-04-07
- 理由: 原典アクセス可否と本文確認の有無を切り分けて再監査するため

## 次の作業

- D06 の blocked-access source について manual/browser 余地の優先度を付ける
- raw-confirmed が出た source から旧 verified 判定を source 単位へ再分解する
- 新しい ref-check を history 参照つきで再作成する
