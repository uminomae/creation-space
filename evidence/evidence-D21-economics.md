---
file_id: EV-EC
domain: economics
domain_id: D21
last_updated: 2026-04-08
entry_count: 0
origin: "Archived pre-rerun snapshot for cs#207"
status: "再監査待ち（原典アクセス状態の棚卸し前）"
source_archive: "evidence/archive/pre-rerun-20260407/evidence/evidence-D21-economics.md"
original_access_status: not-yet-reviewed
---

# 論拠DB：経済学（Economics）（再監査待ち）

このファイルは `cs#207` 対応として、2026-04-07 時点の分析本文を archive に退避したうえで、再監査用の stub に差し替えたものです。

## 現在の扱い

- 原典アクセス状態: evidence 本文としては `not-yet-reviewed`
- source manifest には D21 first/second batch 10件を反映済み
- source 内訳は `raw-confirmed` 5 / `blocked-access` 0 / `citation-only` 5
- [P] 主張の verified / accepted 判定は現時点では再保証しない
- `knowledge/raw/` の整備と原典アクセス棚卸しが完了するまで、本文の再構成を優先する

## 2026-04-08 second/third batch

- raw-confirmed:
  `Schumpeter (1912)` は Internet Archive open item を `knowledge/raw/` に格納した
  `Schumpeter (1939)` は Internet Archive open item を `knowledge/raw/` に格納した
  `Hayek (1945)` は OLL / Liberty Fund hosted PDF を `knowledge/raw/` に格納した
  `Hayek (2002)` は Mises Institute hosted PDF を `knowledge/raw/` に格納した
  `Knight (1921)` は Internet Archive open item を `knowledge/raw/` に格納した
- blocked-access:
  0件
- citation-only:
  残る 5 source は archive refs / ref-check 起点の first-pass source rows
## History

- スナップショット: [`evidence/archive/pre-rerun-20260407/evidence/evidence-D21-economics.md`](archive/pre-rerun-20260407/evidence/evidence-D21-economics.md)
- 退避日: 2026-04-07
- 理由: 原典未入手・本文未確認・LLM 補完混入の可能性を切り分けずに維持しないため

## 次の作業

- 原典アクセス状態を `raw-confirmed` / `citation-only` / `blocked-access` / `not-yet-reviewed` で棚卸しする
- `knowledge/raw/README.md` の manifest に候補原典を記録する
- 再調査後に、このファイルへ history 参照つきで新しい本文を戻す
