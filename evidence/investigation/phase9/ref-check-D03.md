# D03 化学 — Phase 9 原典検証（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の Phase 9 原典検証メモを archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: ref-check 本文としては `not-yet-reviewed`
- source manifest には D03 first batch 10件を反映済み
- source 内訳は `raw-confirmed` 0 / `blocked-access` 6 / `citation-only` 4
- 既存の verified / plausible / overstated 判定は再保証しない
- 二次資料・要約・書誌情報のみで成立していた判定が混在していないか、原典アクセス状態から再点検する

## 2026-04-07 first batch

- blocked-access:
  `Johnson & Goody 2011`, `Leibler 1980`, `Field-Koros-Noyes 1972`, `Turing 1952`, `Winter & Chambon 1986`, `Miller & Urey 1953` は publisher 側 Cloudflare challenge により CLI 取得失敗
- citation-only:
  `Becker-Doring 1935`, `Lehn 1995`, `Lewis-von Elbe 1961`, `Goldbeter 1996` は書誌確認のみ
- 注意:
  D03 は hard paywall よりも challenge/bot gating が支配的で、手動ブラウザ回収余地が比較的大きい

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/phase9/ref-check-D03.md`](../../archive/pre-rerun-20260407/phase9/ref-check-D03.md)
- 退避日: 2026-04-07
- 理由: 原典アクセス可否と本文確認の有無を切り分けて再監査するため

## 次の作業

- D03 の blocked-access source について manual/browser 余地の優先順位を付ける
- raw-confirmed が出た source から旧 verified 判定を source 単位へ再分解する
- 新しい ref-check を history 参照つきで再作成する
