# D02 物理学 — Phase 9 原典検証（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の Phase 9 原典検証メモを archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: ref-check 本文としては `not-yet-reviewed`
- source manifest には D02 first batch 10件を反映済み
- source 内訳は `raw-confirmed` 4 / `blocked-access` 5 / `citation-only` 1
- 既存の verified / plausible / overstated 判定は再保証しない
- 二次資料・要約・書誌情報のみで成立していた判定が混在していないか、原典アクセス状態から再点検する

## 2026-04-07 first batch

- raw-confirmed:
  `Feynman 1948`, `Abrikosov 1957`, `Rayleigh 1916`, `Zurek 2003` は raw PDF を取得済み
- blocked-access:
  `Kosterlitz-Thouless 1973`, `Ulm et al. 2013`, `Higgs 1964`, `Wilson 1971`, `Haken 1983` は publisher 側の HTML 着地 / login redirect / Cloudflare challenge を記録した
- citation-only:
  `Becker-Doring 1935` は書誌確認のみ
- 注意:
  APS / IOP / Nature / Springer 系は「本文が存在しない」のではなく、CLI 取得に失敗した可能性があるため、手動ブラウザ余地を notes に残した

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/phase9/ref-check-D02.md`](../../archive/pre-rerun-20260407/phase9/ref-check-D02.md)
- 退避日: 2026-04-07
- 理由: 原典アクセス可否と本文確認の有無を切り分けて再監査するため

## 次の作業

- D02 の残り source を manifest へ追加して source-level coverage を広げる
- raw-confirmed source を起点に、旧 verified 判定を source 単位へ分解して再点検する
- 新しい ref-check を history 参照つきで再作成する
