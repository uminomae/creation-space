# cs#253 C軸 confidence tier — 所見 + 3軸統合結論

機械生成 `confidence-tier.md` / `confidence-tier.jsonl`（再実行で上書き）を人間が読んだ確定所見。スクリプト: `scripts/audit-confidence.py`（A軸/B軸 jsonl + source-note 有無 + 採録マーカーの決定的 join・API 不要）。

## ティア定義（cs#252 の鎖「持つ→読む→解釈→公開」に対応）

| tier | 意味 | 件数 |
|---|---|---|
| **T1_READ** | source-note あり＝全文精読し構造化ノート化済（最高位・照合ノイズに非依存） | **293** |
| **T2_OBTAINABLE** | ノート無 / 実在確認(A) かつ 今取得可(B) | 2 |
| **T3_REAL_BLOCK** | ノート無 / 実在確認(A) かつ env-block(B)＝別 egress 必要 | 9 |
| **T4_REVIEW** | raw/url-verified で機械未確認/欠陥/STUB（要人手） | **1** |
| **T5_READLIST** | citation-only/blocked-access＝取得不能・read-list（cs#252・公開解釈なし） | 99 |

## 結論

### 1. 「アクセス達成」305 行の信頼は事実上クリーン
raw-confirmed + url-verified の 305 行は **T1 293 + T2 2 + T3 9 + T4 1**。
- **293/305 (96%) が精読済（T1）** — 全文を読み source-note 化されている＝鎖の「読む」まで到達。
- **要人手レビューは T4 の 1 行（D23-S14）のみ** — url-verified・STUB・van Geert 1998（backfill-queue で既知の B群／rug file 403）。
- T3 の 9 行は実在確認済だが env-block。降格不可（cs#252）、別 egress で再取得。

### 2. ユーザーの当初の不信（LLM 採録＝幻覚？）への直接回答
最も疑われた `[similar-papers]`（LLM 類似論文提案）**145 行**の内訳:

| | T1 精読 | T2 | T3 | T4 | T5 read-list |
|---|---|---|---|---|---|
| [similar-papers] | **121** | 1 | 6 | 1 | 16 |

- **121/145 が実際に精読・ノート化済**。捏造原典ではなく、提案後に人手で読まれ検証された原典だった。
- 欠陥は 1 行のみ。**「LLM が拾ったから信用できない」は機械検証では支持されない。**

### 3. read-list 99 行は仕様であって欠陥ではない
T5 の 99 行は cs#252 で意図的に「取得不能＝read-list（書誌＋読みたい理由のみ・公開解釈なし）」とした行。`[no-oa]` 43・`[phase-1-exhausted]` 18・`[phase-3-confirmed]` 14 などのマーカーが全て T5 に集中するのは整合的（OA が見つからなかった行）。
- **注意点**: `[phase-3-confirmed]` 14 行は「取得不能なのに確定」を主張するマーカー。cs#252 **Check 11b** が live（取り消し線でない）なものを FAIL にする。本ティアはこの 14 行をクラスタとして可視化した → Check 11b の網羅性を別途確認し、再調査候補（B群昇格 or 撤回）に回すとよい。

## 3軸統合: 「大元のデータは信頼できる」が機械的に確定

| 観点 | 結論 |
|---|---|
| A 書誌実在 | 幻覚ほぼ無し。STRONG 177、真の題誤り 2 件のみ |
| B OA 取得 | url-verified の 74% 即取得可、取れない分は env-block（データ誤りでない）、真の欠陥 4 件 |
| C 信頼度 | アクセス達成 305 行の 96% が精読済（T1）。要レビュー 1 行のみ |

**不信の正体は「データが偽」ではなく「検証記録が機械可読でなかった」こと**だった。本監査でその記録が `knowledge/raw/audit/` に常設化された。

## 残務（全軸横断・要 pjdhiro 確認）
1. **真の欠陥 6 件**: A=2（D06-S11 題通称・D11-S08 題欠落）／ B=4（D18-S12・D08-S04・D24-S15 リンク腐敗・D26-S08 URL未記録）。
2. **STUB 33 行**に著者/年/題を補完（A軸 findings (a)/(b)）。
3. **canonical DOI 列の構造化**（25/305 のみ記録）＝最大の基盤改善。破壊的変更チェックリスト適用。
4. **`[phase-3-confirmed]` on read-list 14 行**の Check 11b 網羅確認。
5. **standing 化 = Check 13**: 上記 1-3 の是正後、3 監査スクリプトを定期実行＋ティア劣化を検知するゲートとして validate に組み込む設計。

## 更新履歴
- 2026-06-25 #06: 初版。A×B×note×marker を join。アクセス達成 305 行の 96% が T1 精読済、要レビュー 1 行、read-list 99 と確定。LLM 採録 [similar-papers] の 121/145 が精読済と判明。
