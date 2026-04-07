# D04 進化生物学 — Phase 9 原典検証（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の Phase 9 原典検証メモを archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: ref-check 本文としては `not-yet-reviewed`
- source manifest には D04 first batch 10件を反映済み
- source 内訳は `raw-confirmed` 0 / `blocked-access` 2 / `citation-only` 8
- 既存の verified / plausible / overstated 判定は再保証しない
- 二次資料・要約・書誌情報のみで成立していた判定が混在していないか、原典アクセス状態から再点検する

## 2026-04-07 first batch

- blocked-access:
  `Laland et al. 2015`, `Woese 2002` は PMC article page に到達する一方、PDF 直リンクは POW challenge HTML を返した
- citation-only:
  `Darwin 1859`, `Eldredge & Gould 1972`, `Odling-Smee et al. 2003`, `Waddington 1953`, `Van Valen 1973`, `Barton & Hewitt 1985`, `Sagan 1967`, `Schluter 2000`
- 注意:
  D04 は source 実在確認は進んでいるが、full-text route はまだ薄い。書誌確認済み source を無理に blocked に倒さない

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/phase9/ref-check-D04.md`](../../archive/pre-rerun-20260407/phase9/ref-check-D04.md)
- 退避日: 2026-04-07
- 理由: 原典アクセス可否と本文確認の有無を切り分けて再監査するため

## 次の作業

- D04 の blocked-access source の manual/browser 余地を source ごとに詰める
- raw-confirmed が取れた source から旧 verified 判定を source 単位へ再分解する
- 新しい ref-check を history 参照つきで再作成する
