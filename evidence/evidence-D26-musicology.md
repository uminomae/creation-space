---
file_id: EV-D26
domain: musicology
domain_id: D26
last_updated: 2026-04-08
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D26-musicology.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：音楽学（Musicology）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D26 first batch 10件を反映済み
- source 内訳は `raw-confirmed` 0 / `blocked-access` 2 / `citation-only` 8
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-08 first/second batch

- raw-confirmed: 0件
- blocked-access:
  `Mehr et al. (2019)` は Science official PDF route が Cloudflare challenge 403 HTML、Harvard Scholar mirror file route も 403 HTML に着地し raw 未取得。manual/browser 再試行余地あり
  `Savage et al. (2015)` は PNAS official PDF route が Cloudflare challenge 403 HTML、PMC mirror PDF route も HTML interstitial に着地し raw 未取得。manual/browser 再試行余地あり
- citation-only: 8件。archive refs / ref-check 起点の first-pass source rows
- manual/browser 余地:
  blocked-access source は CLI challenge / login redirect / HTML landing の可能性を残すため、notes を維持する
## 2026-06-13 理論系ギャップ是正（cs#245 follow-up）

- cs#245 C-1 網羅性分析は D26 を「全空白(CRITICAL)」と記載したが、これは測定バグ（`raw-confirmed=0` を「全件空白」と誤認）。実測は url-verified 10件・source-note 8本で、神経科学・実証系のカバレッジは十分。
- 真のギャップは **理論・美学系の薄さ**（Meyer 1956 / Huron 2006 は citation-only/blocked、Lerdahl & Jackendoff 1983 / Hanslick は不在）。
- 是正: **Hanslick『The Beautiful in Music』(1854/1891 Cohen 英訳)** を public domain OA で取得し `url-verified` 登録、source-note `D26-S21_hanslick-1891.md` を生成。音楽美学の自律的形式論（tönend bewegte Formen = 創造的精神の直接的産物）を Stage 2-4 アンカーとして追加。

## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D26-musicology.md`](archive/pre-rerun-20260407/evidence/evidence-D26-musicology.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 次の作業

- 原典アクセス状態を `raw-confirmed` / `citation-only` / `blocked-access` / `not-yet-reviewed` で棚卸しする
- `knowledge/raw/README.md` の manifest に候補原典を記録する
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
