# cs#255 raw PDF 中身 vs 書誌 照合トリアージ

**実施日**: 2026-07-03 / **ツール**: `scripts/audit-raw-content.py`（本 issue で新設）
**対象**: `knowledge/raw/` の raw-confirmed 全 PDF（manifest 参照 128 行 + ディスク上 132 ファイル）

## 背景

Check 8/10 は「ファイル名・書誌テキスト」ベースで **PDF の中身を見ていない**。cs#249 backfill で
「ファイル名は正しいが中身が別論文」の取り違えが 2 件（D05-S15 / D23-S15）発覚したため、
全 raw PDF について冒頭を `pdftotext` 抽出し manifest 書誌（著者姓・年・タイトル語）と照合した。

## 結果サマリ

| 分類 | 件数 | 扱い |
|---|---|---|
| OK（自動一致） | 89 | 中身＝書誌一致（D12-S05 タイトル補完後に自動一致） |
| OK_KNOWN（正規理由で自動照合不能） | 16 | 全件実物確認済（`KNOWN_OK` に理由登録） |
| NO_TEXT（テキスト層なし画像 PDF） | 23 | 22 は source-note 既存＝生成時に精読検証済 / 1(D16-S08) は本セッションで image-Read 実物確認 |
| 孤立 PDF（manifest 行なし） | 0 | 7 件を pjdhiro 承認で削除済（下記） |
| **真の書誌欠陥** | **2** | **D30-S09（是正済）/ D12-S05（タイトル補完済）** |

→ **全 132 raw PDF で発見された実データ欠陥は 2 件（D30-S09 書誌不一致 / D12-S05 タイトル欠落）**、いずれも是正済。既知取り違え 2 件は前セッションで是正済。

## 是正した欠陥: D30-S09

manifest 書誌が実 PDF と食い違っていた（LLM 生成時の幻覚）。実 PDF 全文＋既存 source-note と照合し是正:

| 項目 | 旧（誤） | 新（実PDF） |
|---|---|---|
| 著者 | 松木**正恵**・沼田**千尋** | 松木**孝和**・沼田**秀穂**（香川大学） |
| 書名 | 茶事における場の共創:「一座建立」の意味空間 | 茶の湯文化継続を目的とした未経験者に対する、予約サイトを介した体験茶事における「一座建立」の可否について |

年(2021)・掲載(SSI/社会情報)は PDF 内に確認され正しい。source-note D30-S09 は当初から実 PDF に一致していた（欠陥は manifest 行のみ）。

## 孤立 PDF 7 件（pjdhiro 承認で削除済）

いずれも **git 未追跡**（未コミットの手動DL残骸）。manifest が参照する正規ファイルは別途存在し内容検証済。**2026-07-03 pjdhiro 承認により 7 件とも削除**（正規ファイルは knowledge/raw/ に残存）。

| 削除した孤立ファイル | 正規ファイル（残存） | md5 |
|---|---|---|
| D05-S15symmetry-16-01611.pdf | D05_feistel_2024_…pdf | 完全一致 |
| D06-S15entropy-18-00172.pdf | D06_nicolis_2016_…pdf | 完全一致 |
| D07-S15complexities-02-00006.pdf | D07_heylighen_2025_…pdf | 完全一致 |
| 23-S15jintelligence-05-00016-v3.pdf | D23_vandermaas_2017_…pdf | 完全一致 |
| D09-S02attwell-laughlin-….pdf | D09_attwell-laughlin_2001_…pdf | 相違（同一論文・同頁数13、別コピー） |
| D23-S14A_dynamic_systems_model_….pdf | D23_vangeert_1998_…pdf | 相違（同一論文・同頁数45、別コピー） |
| D12-S13Frontiers … Beisner ….pdf | D12_beisner_2003_…pdf | 相違（同一論文・同頁数7、別コピー） |

## 判定ヒューリスティックの限界（誤検知の型）

`OK_KNOWN` に登録した 17 件が示す、pdftotext 冒頭照合が失敗する正規パターン:
1. スキャン表紙・出版社前付け・DL 透かしが冒頭（本文は後頁）
2. OCR 崩れ（古スキャン）
3. 非ラテン文字タイトル（日本語・アラビア語・ギリシャ語）
4. 原典 vs 翻訳（manifest=原語題、PDF=訳題）
5. manifest 書誌がタイトルを省略/略記
6. 書誌の最初の括弧が年でない（例: `(d.school)`）→ パース端ケース

## standing 化

- ツール: `scripts/audit-raw-content.py`（`--json` で `raw-content.jsonl` 出力）
- `KNOWN_OK` に検証済み正規例外を登録済 → **今後 WARN に出る = 新規の中身不一致 = 要調査**
- NO_TEXT（画像 PDF）は pdftotext 照合外。source-note の有無で verified を担保、無いものは image-Read で個別確認
- validate-manifest-sync.sh への hard-gate 組み込みは見送り（誤検知型が多く FAIL ゲートに不適）。advisory 監査として運用

## 残タスク

- [x] 孤立 PDF 7 件を削除（pjdhiro 承認, 2026-07-03）
- [x] D12-S05 manifest 書誌に論文タイトル・共著者を補完（実PDF照合）

→ 残タスクなし。cs#255 クローズ可能。
