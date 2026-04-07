# D01 数学 — Phase 9 原典検証（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の Phase 9 原典検証メモを archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: ref-check 本文としては `not-yet-reviewed`
- source manifest には D01 first batch 3件を反映済み
- source 内訳は `raw-confirmed` 1 / `blocked-access` 2 / `citation-only` 0
- 既存の verified / plausible / overstated 判定は再保証しない
- 二次資料・要約・書誌情報のみで成立していた判定が混在していないか、原典アクセス状態から再点検する

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/phase9/ref-check-D01.md`](../../archive/pre-rerun-20260407/phase9/ref-check-D01.md)
- 退避日: 2026-04-07
- 理由: 原典アクセス可否と本文確認の有無を切り分けて再監査するため

## 2026-04-07 first batch

- raw-confirmed:
  `Bott (1988)` は raw PDF 取得済み
- blocked-access:
  `Carlsson (2009)` と `Ghrist (2008)` は AMS 導線があるが Cloudflare challenge で CLI 取得失敗

## 次の作業

- D01 blocked-access source の manual/browser 余地を再評価する
- raw-confirmed source を起点に旧 verified 判定を source 単位へ再分解する
- 新しい ref-check を history 参照つきで再作成する
