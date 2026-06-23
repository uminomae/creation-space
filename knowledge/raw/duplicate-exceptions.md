# 原典重複 — 誤検知でない理由の登録簿（Check 10 例外）

`scripts/validate-manifest-sync.sh` の **Check 10**（同一領域・同一書名の重複検知）が FAIL を出したが、書誌学的には**別の publication** であり重複ではない、と人間がレビューして判断したペアをここに登録する。Check 10 は本ファイルを読み、登録済みペアを重複から除外する。

## 判定の前提（標準的な書誌重複ルール）

実務（systematic review の dedup、Zotero/EndNote 等の参照管理、Crossref/PubMed）に倣う:

1. **DOI が主キー**。同一領域に同一 DOI が複数あれば重複。**DOI が異なれば別 publication**（速報 letter 版 vs 拡張 full article 版、版違い等）。
   - → Check 10 は **DOI 相違ペアを自動で「別物」と判定する**ため、DOI を両方が持つペアは本登録簿への記載不要。
2. DOI が無い書籍等は **著者姓 + 書名** で同一性を判定（多巻物の年範囲・版差に依存しない）。
3. **本登録簿が必要なのは**「DOI が無い/同一なのに、同一書名で別物」という DOI で切り分けられないケースのみ（翻訳版 vs 原著、同名異著の別著作 等）。

## 登録簿

| source_id A | source_id B | カテゴリ | 誤検知でない理由・論拠（根拠つき） |
|---|---|---|---|
<!-- 例外を追加する場合は上の区切り行の下にこの形式で 1 行ずつ書く。
     A/B は `D\d+-S\w+` 形式の source_id。現在 有効な登録は 0 件
     （Bak SOC D29-S03/D29-S04 は DOI 相違で自動判定されるため登録不要）。 -->

### カテゴリ語彙

| カテゴリ | 意味 |
|---|---|
| `translation` | 翻訳版と原著（同一書名だが別 publication） |
| `edition` | 版違い（改訂版等） |
| `volume` | 多巻物の別巻 |
| `letter-vs-article` | 速報(letter)版と拡張(full article)版 ※通常は DOI 相違で自動判定されるため登録不要 |
| `same-title-diff-work` | 同名異著（偶然の書名一致による別著作） |
| `other` | その他（理由欄に詳述） |

## 関連

- 不変条件: `.claude/rules/source-note-invariants.md` §2.5
- 検査: `scripts/validate-manifest-sync.sh` Check 10
- Issue: cs#249
