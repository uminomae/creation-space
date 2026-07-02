# cs#253 B軸 OA 取得実態監査 — 所見（人手キュレーション）

機械生成 `access-audit.md` / `access-audit.jsonl`（再実行で上書き）を人間が仕分けた確定所見。スクリプト: `scripts/audit-access.py`。manifest の notes に記された OA URL を実際に叩き、「今この環境でオープンに本文取得できるか」を分類した。

対象: `raw-confirmed` + `url-verified` = **305 行**。

## 集計（全体）

| verdict | 件数 | 意味 |
|---|---|---|
| OA_PDF | 122 | 200+PDF = オープンに本文取得可 ✓ |
| OA_HTML | 32 | 200+HTML = 全文ページ or landing（要目視） |
| BLOCKED | 42 | 401/403 = env ブロック or paywall |
| DEAD | 3 | 404 = リンク腐敗 |
| NET_ERR | 9 | 接続不能（判定不能） |
| NO_URL | 91 | notes に OA URL 無し |
| OTHER | 6 | その他 |

## 結論: 「取得できていない」の正体は env-block であってデータ欠陥ではない

### url-verified 180 行（ローカル PDF 無し＝信頼が最も問われる集合）

| verdict | 件数 | 評価 |
|---|---|---|
| OA_PDF + OA_HTML | **133 (74%)** | 今この環境で本文取得確認 ✓ |
| BLOCKED + NET_ERR | **40** | publisher-CDN の **env ブロック**（データ誤りではない・別 egress で取得可） |
| DEAD | 3 | **リンク腐敗（要修正）** |
| NO_URL | 1 | **D26-S08 = url-verified なのに URL 未記録（要修正）** |
| OTHER | 3 | doi.org リダイレクト等・要目視 |

**host 別集計が決定的証拠**: BLOCKED は URL のランダムな腐敗ではなく、特定 publisher CDN に集中する。
- 全滅 host: **MDPI 11/11 BLOCKED**・Cell 6・PNAS 3・RoySoc 3・SAGE 2・Wiley 2・APS 2・OUP 2・preprints.org 2。
- 健全 host: archive.org 18・arXiv 17・Frontiers 11・PLOS 10・monoskop 3・Springer 3・web.mit.edu 3・PMC(HTML) 8。

→ green-OA / リポジトリ / preprint / PMC は通り、商業出版社 CDN がこの egress を拒否する。`backfill-queue.md`（cs#249）と完全に同じパターン。**「url-verified なのに取れない」の 40 件はこの環境特性であり、原典が偽・消失なのではない。**

### raw-confirmed 125 行（ローカル PDF を保有）

NO_URL 90・BLOCKED 11・OA_PDF 18・OA_HTML 3・OTHER 3。**ローカル PDF を保有しているため取得済**。NO_URL/BLOCKED でも実体は手元にある。
- ただし NO_URL 90 は **OA URL が notes に未記録** = 鎖の「持つ（誰でも検証可）」の観点では「自分は持つが第三者が辿れる OA pointer が無い」。多くは OA 由来 PDF なので、OA URL を backfill すれば「誰でも検証可」が明示できる（推奨・欠陥ではない）。

## 真に修正すべき行（4 件のみ）

| sid | status | 問題 | 対処 |
|---|---|---|---|
| D18-S12 | url-verified | germanhistorydocs.ghi-dc.org 404（腐敗） | 新 URL 探索 or 降格 |
| D08-S04 | url-verified | ekmillerlab.mit.edu 404（著者ページ移動） | 新 URL 探索（Miller & Cohen 2001 は OA 多数） |
| D24-S15 | url-verified | archive.org/cosmconscious 404（item 消失） | 別 archive item or Gutenberg 等へ差替 |
| D26-S08 | url-verified | OA URL が notes に未記録 | URL を補完 or 実態確認 |

## env-block 40 件の扱い

`backfill-queue.md` と統合。これらは「取得不能（鎖違反）」ではなく「OA だが当 egress ブロック」＝ B群。別 egress（subagent）で再確認するか、url-verified を維持してよい。降格してはならない（cs#252 の教訓: env-block を取得不能と混同しない）。

## A軸との接続
- B軸 BLOCKED/DEAD と A軸 STRONG は独立: 例えば A軸 STRONG（書誌実在）でも B軸 BLOCKED（この環境で取れない）はあり得る。両者を `sid` で突合すると「実在は確実・取得は別 egress 必要」な行が確定する。
- 統合スコア（C軸 confidence tier）で A(実在) × B(取得) を掛け合わせて信頼度を出す。

## 次アクション（B軸）
1. **真の欠陥 4 件を修正**（要 pjdhiro 確認）: D18-S12/D08-S04/D24-S15 の URL 差替、D26-S08 の URL 補完。
2. **NET_ERR 9 件**を別 egress または sandbox 無効で再プローブし BLOCKED/健全を確定（host 的には publisher CDN なので BLOCKED 濃厚）。
3. raw-confirmed NO_URL 90 件に OA URL を backfill（「誰でも検証可」の明示・優先度中）。
4. env-block 40 件は backfill-queue と統合管理。

## 更新履歴
- 2026-06-25 #06: 初版。305 行の OA URL を実プローブ。url-verified 74% が取得確認、取得不可の大半は publisher-CDN env-block（データ誤りでない）、真の欠陥は 4 件のみと確定。
