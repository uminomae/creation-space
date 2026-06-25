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
| （現在 有効登録なし） | — | — | — |

## 解消ログ

> ⚠️ Check 12 は「先頭セルが `D\d+-S\d+` の行」を exempt として読む。解消済みは exempt から外すため、**source_id を先頭セルに置かない**（解消日を先頭にする）。

| 解消日 | source | 登録日 | 解消方法 |
|---|---|---|---|
| 2026-06-25 | D28-S15 | 2026-06-25 | Junctions OA galley PDF を取得（小規模 OA 誌のため LLM egress で取得可）→ 全文精読 → source-note を全文ベースで再生成 → manifest を raw-confirmed 昇格。read-obligation 解消（cs#252） |
