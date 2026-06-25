# read-depth 例外登録簿（鎖の不変条件「読む」・cs#252）

`validate-manifest-sync.sh` の **Check 12**（abstract/メタデータのみで書かれた source-note の禁止）が読み込む登録簿。

## 原則

source-note（公開「解釈／まとめ」）は原典を**全文読んだ**上で書く。abstract / メタデータのみで生成した source-note は鎖「持つ→**読む**→解釈→まとめる→公開」の「読む」を欠くため**禁止**（FAIL）。cs#249 で abstract-only 6本を破棄済。

## 例外の意味（放置ではなく追跡された read-obligation）

ここに登録できるのは「**OA で誰でも全文入手できるが、当環境では未取得のため暫定的に abstract で書かれている**」もの（＝B群型）に限る。これは「取得不能」ではなく**精読義務が立っている**状態。budget 回復後に source-reader 精読 → source-note を全文ベースで再生成し、**本登録から除去する**。

**真に取得不能（OA 全文なし）なものは登録不可** → source-note を破棄し manifest を blocked-access/citation-only に降格して read-list 化する（D11-S01 Paul 2010 はこちらで処理済）。

形式: `| source_id | journal/OA根拠 | 登録日 | 全文精読の予定・根拠 |`

| source_id | OA 根拠 | 登録日 | 精読予定 |
|---|---|---|---|
| D28-S15 | *Junctions* 3(1) は Utrecht 大学の OA 大学院誌（本文 PDF は OA だが当環境で未取得） | 2026-06-25 | budget 回復後に source-reader（別 egress）で全文精読 → 全文ベースで source-note 再生成 → 本登録から除去（cs#252 B群と同枠） |
