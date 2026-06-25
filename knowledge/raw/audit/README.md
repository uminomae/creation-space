# 原典信頼性監査 — 入口とロードマップ

cs#253 で構築した原典データ信頼性監査の成果物入口と、関連 issue（cs#249 / cs#253 / cs#254）を**順に進めるための統合ロードマップ**。

## 成果物（cs#253・2026-06-25 #06 監査）

| ファイル | 内容 | 生成 |
|---|---|---|
| `A-axis-findings.md` | 書誌実在性（人手仕分け） | `scripts/audit-citations.py` |
| `citation-audit.{jsonl,md}` | A軸 機械出力（再実行で上書き） | 同上（Crossref+OpenAlex） |
| `B-axis-findings.md` | OA 取得実態（人手仕分け） | `scripts/audit-access.py` |
| `access-audit.{jsonl,md}` | B軸 機械出力 | 同上（urllib 実プローブ） |
| `C-axis-findings.md` | confidence tier + 3軸統合結論 | `scripts/audit-confidence.py` |
| `confidence-tier.{jsonl,md}` | C軸 機械出力（A×B×note×marker join） | 同上（API不要） |
| `backfill-queue.md` | 1:1 ギャップ12本のトリアージ（cs#249） | 手動 |

**3軸の結論**: 「大元のデータは信頼できない」は機械検証で**大部分が杞憂**だった。書誌は実在（幻覚ほぼ無し）、url-verified の 74% は即取得可、アクセス達成 305 行の 96% は精読済（T1）。不信の正体は「**検証記録が機械可読でなかった**」こと。本監査でその記録を常設化した。

## 統合ロードマップ（この順で進める）

3 つの issue は独立タスクではなく **1 本のパイプライン**。データ層 → 精読 → 公開層 → standing の順に依存する。

### Phase 1 — データ層の整合（cs#253 残務）【最優先・低リスク】
manifest を信頼できる SoT にする。公開層を直す前にここを固める。
1. **真の欠陥 6 件を修正**（要 pjdhiro 確認）:
   - A軸: D06-S11（題が通称「Millennium Simulation」→実題へ）/ D11-S08（題欠落・誌名巻号のみ→論文題補完）
   - B軸: D18-S12・D08-S04・D24-S15（リンク腐敗404→URL差替 or 降格）/ D26-S08（url-verified なのに URL未記録→補完）
2. **STUB 33 行に著者/年/題を補完**（A-axis-findings (a)英語ベタ題は matcher 実体で半自動 / (b)非ラテン古典は人手）。
3. **canonical DOI 列の構造化**（現状 25/305 のみ記録＝最大の基盤改善）。破壊的変更 → breaking-change-checklist で下流（domains.json/dashboard/reports）を列挙してから。

### Phase 2 — 未精読原典を読む（cs#249 backfill）【budget ゲート】
T2/T3（実在・取得可/取得可だが env-block・**未精読**）を T1（精読済）へ昇格。`backfill-queue.md` 参照。
- これを先に進めるほど Phase 3 で「削除」せず「再接地」で残せる公開主張が増える。
- env-block 11 本は別 egress（subagent）必要 → `scripts/budget-check.sh` を通してから。Main 単独可な PMC 経路があれば優先消化。

### Phase 3 — 公開層の鎖執行（cs#254）【pjdhiro 承認必須】
`confidence-tier.jsonl` を入力に、公開ページ（domains 120×2・guides・phase8/9・survey・synthesis）の解釈的主張で **非 T1 原典に立脚するもの**を抽出 → 削除 or 再接地。
- 既知の起点: D13 レポートのシモンドン解釈（D13-S02 = T2 未精読）。
- 削除・再生成は pjdhiro 公開 MD 正本に触れる → 範囲確定後 pjdhiro 承認。
- 引用マップ（prose→source_id）は決定的 join + LLM/人手補助。

### Phase 4 — standing 化（cs#253 Check 13 + 公開層 lint）
Phase 1-3 の是正後、3 監査スクリプトを定期実行＋ティア劣化を検知するゲートを `validate-manifest-sync.sh` に統合（Check 13）。公開層の主張接地 lint も検討。
- 併せて `[phase-3-confirmed]` on read-list 14 行の Check 11b 網羅確認。

## issue 対応表

| issue | 役割 | Phase |
|---|---|---|
| cs#253 | 信頼性監査（完了）＋ 残務（欠陥/STUB/DOI/Check13） | 1, 4 |
| cs#249 | 1:1 ギャップ backfill（未精読→精読） | 2 |
| cs#254 | 公開ページの鎖執行 | 3 |
