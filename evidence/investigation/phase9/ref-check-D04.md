# D04 進化生物学 — Phase 9 原典検証（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の Phase 9 原典検証メモを archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: ref-check 本文としては `not-yet-reviewed`
- source manifest には D04 first batch 10件を反映済み
- source 内訳は `raw-confirmed` 1 / `blocked-access` 2 / `citation-only` 7
- 既存の verified / plausible / overstated 判定は再保証しない
- 二次資料・要約・書誌情報のみで成立していた判定が混在していないか、原典アクセス状態から再点検する

## 2026-04-08 second/third batch

- raw-confirmed:
  `knowledge/raw/D04_darwin_1859_origin-of-species.pdf`
- blocked-access: 2件。source ごとの理由は `knowledge/raw/manifest.md` の notes を参照
- citation-only: 7件。archive refs / ref-check 起点の first-pass source rows
- 注意:
  blocked-access は「本文不存在」ではなく、CLI challenge / login / HTML 着地を含む
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/phase9/ref-check-D04.md`](../../archive/pre-rerun-20260407/phase9/ref-check-D04.md)
- 退避日: 2026-04-07
- 理由: 原典アクセス可否と本文確認の有無を切り分けて再監査するため

## 次の作業

- D04 の blocked-access source の manual/browser 余地を source ごとに詰める
- raw-confirmed が取れた source から旧 verified 判定を source 単位へ再分解する
- 新しい ref-check を history 参照つきで再作成する
