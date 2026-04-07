# D07 工学・情報科学 — Phase 9 原典検証（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の Phase 9 原典検証メモを archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: ref-check 本文としては `not-yet-reviewed`
- source manifest には D07 first batch 10件を反映済み
- source 内訳は `raw-confirmed` 1 / `blocked-access` 3 / `citation-only` 6
- 既存の verified / plausible / overstated 判定は再保証しない
- 二次資料・要約・書誌情報のみで成立していた判定が混在していないか、原典アクセス状態から再点検する

## 2026-04-07 first batch

- raw-confirmed:
  `Shannon (1948)` は Harvard-hosted PDF を取得済み
- blocked-access:
  `Wiener 1948`, `ISO 9001:2015`, `Rumelhart et al. 1986` はそれぞれ Cloudflare / purchase barrier / login redirect を確認
- citation-only:
  `Jacobson 1988`, `Candes et al. 2006`, `Schultz et al. 1997`, `Holland 1975`, `Fowler 1999`, `Diffie & Hellman 1976` は書誌確認のみ

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/phase9/ref-check-D07.md`](../../archive/pre-rerun-20260407/phase9/ref-check-D07.md)
- 退避日: 2026-04-07
- 理由: 原典アクセス可否と本文確認の有無を切り分けて再監査するため

## 次の作業

- D07 citation-only anchors で official publisher route を確認し、blocked-access との切り分けを進める
- Shannon 以外の raw-confirmed 候補を追加探索する
- 新しい ref-check を history 参照つきで再作成する
