# Simondon 全著作 取得→精読→記録 台帳（cs#249 / D13）

Gilbert Simondon（1924-1989）の著作を、**「①取得・保存 → ②精読 → ③記録」の順序**で網羅的に処理するための追跡台帳。pjdhiro 指示（2026-06-27）に基づく。

> **鎖の不変条件との対応（`.claude/rules/source-note-invariants.md §2.6`）**: 本手順は cs 公開出力の鎖「**持つ（誰でも検証可に入手）→ 読む（全文）→ 解釈 → まとめる → 公開**」を Simondon コーパスに具体適用したもの。OA で取得不能な巻は read-list（書誌＋読みたい理由）のみで、source-note を作らない（Check 11a）。

---

## 1. 手順（正確・丁寧な順序）— 1著作ごとに ①→⑥ を完走する

| 段階 | 行為 | 具体 | 完了判定 |
|---|---|---|---|
| ① 列挙 | corpus を確定 | 本台帳 §2 の表。出典＝Monoskop + PhilPapers + 標準書誌。新発見 OA・新刊遺稿集は追記 | 表に1行ある |
| ② 取得可否 | OA をプローブ | `curl -sL -A <UA> <url> -w '%{http_code} %{content_type}'` ＋ 先頭5バイト `%PDF-` 判定 | OA有無を表に記録 |
| ③ 取得・保存 | OA PDF を保存 | `.cache/sources/simondon/<slug>.pdf`（gitignore 済・非コミット）。`pdfinfo` でページ数、`pdftotext -l3` でテキスト層有無を確認 | PDF magic OK＋ページ数記録 |
| ④ 精読 | 全文を読む | テキスト層あり→`Read`(PDF)。スキャン（テキスト層なし）→`Read` image mode で全面読解（D13-S02 と同方式）。**abstract/メタデータのみ禁止（Check 12）**。実読範囲を正直に記録 | 読解ページ範囲が全文/主要部 |
| ⑤ 記録 | source-note 生成 | `knowledge/source-notes/D13/D13-S{NN}_{slug}.md` を生成。manifest に **url-verified** 行を追加（OA URL ＝「持つ」の証明、PDF はコミットしない＝memory `feedback_raw_access_criteria`）。**同一コミット内**で `D13-summary.md`・evidence・cross-refs を更新（§3 改訂原則） | source-note ＋ manifest 行 ＋ 関連更新 |
| ⑥ 検証 | テストで担保 | `bash scripts/check-simondon-corpus.sh`（本コーパス専用整合テスト）＋ `bash scripts/validate-manifest-sync.sh`（Check 6/10/11/12 含む全体）。両者 PASS | errors=0 |

**順序の鉄則**:
- ③が終わるまで④に進まない（保存できていない巻を「読んだ」ことにしない）。
- ④が終わるまで⑤に進まない（読んでいない巻に source-note を作らない＝Check 12）。
- **OA 取得不能な巻は③で停止**し、source-note を作らず read-list（§3）に留める（Check 11a）。
- 1ターンで全著作を完走しようとしない。1著作ずつ確実に⑥まで通し、本台帳 §2 の状態列を更新する。

## 2. Corpus 表（取得・精読・記録 状態）

凡例: OA = ○取得可/●取得不能/◎処理済 ｜ saved = `.cache/sources/simondon/` 内ファイル ｜ read = 精読状態 ｜ note = source-note 状態

### A. 生前刊行・主要博士論文

| # | 著作（仏語原題） | 年 | 種別 | OA | saved | read | source_id | note |
|---|---|---|---|---|---|---|---|---|
| A1 | *Du mode d'existence des objets techniques* | 1958 | 副論文(書籍) | ◎ | (D13-S02 OA URL) | ✅ 全章踏破 約160頁 | D13-S02 | ✅ 生成済 |
| A2 | *L'individu et sa genèse physico-biologique*（主論文 第1部） | 1964/1995 | 書籍 | ○ | `individu-genese-physico-biologique_1995.pdf`（270p・スキャン） | ⬜ 未 | D13-S14(予定) | ⬜ 未 |
| A3 | *L'individuation à la lumière des notions de forme et d'information*（主論文 全体, Millon版） | 1957/2005 | 書籍 | ● 全文OAなし | — | — | D13-S01(既登録 blocked) | ✕ read-list（§3）。第1部=A2 が OA |
| A4 | *L'individuation psychique et collective*（主論文 第2部） | 1989 | 書籍 | ● 全文OAなし | — | — | — | ✕ read-list（§3） |

### B. 論文・短編・対談（OA 取得済）

| # | 著作（仏語原題） | 年 | 種別 | OA | saved | read | source_id | note |
|---|---|---|---|---|---|---|---|---|
| B1 | *Les limites du progrès humain* | 1959 | 論文 | ○ | `limites-du-progres-humain_1959.pdf`（6p・テキスト層あり） | ⬜ 未 | D13-S15(予定) | ⬜ 未 |
| B2 | *Cours sur la perception (1964-1965)* | 1964-65 | 講義 | ○ | `cours-sur-la-perception_1964-65.pdf`（37p・テキスト層あり） | ⬜ 未 | D13-S16(予定) | ⬜ 未 |
| B3 | *Entretien sur la mécanologie*（avec J. Le Moyne） | 1968 | 対談 | ○ | `entretien-sur-la-mecanologie_1968.pdf`（30p・テキスト層あり） | ⬜ 未 | D13-S17(予定) | ⬜ 未 |
| B4 | *Sur la techno-esthétique* ＋ *Réflexions préalables à une refonte de l'enseignement* | 1982 | 書簡/草稿 | ○ | `techno-esthetique-refonte-enseignement.pdf`（37p・**スキャン**） | ⬜ 未 | D13-S18(予定) | ⬜ 未 |
| B5 | *Sauver l'objet technique*（entretien avec A. Kechickian, *Esprit*） | 1983 | 対談 | ○ | `sauver-l-objet-technique_1983.pdf`（4p・テキスト層あり） | ⬜ 未 | D13-S19(予定) | ⬜ 未 |

### C. 遺稿集・講義集（OA 取得不能＝read-list 対象）

| # | 著作（仏語原題） | 年 | 出版社 | OA | 処理 |
|---|---|---|---|---|---|
| C1 | *Deux leçons sur l'animal et l'homme* | 2004 | Ellipses | ● | read-list（§3） |
| C2 | *L'invention dans les techniques. Cours et conférences* | 2005 | Seuil | ● | read-list（§3） |
| C3 | *Imagination et invention (1965-1966)* | 2008 | La Transparence/PUF | ● | read-list（§3） |
| C4 | *Communication et information. Cours et conférences* | 2010 | La Transparence | ● | read-list（§3） |
| C5 | *Sur la technique (1953-1983)* | 2014 | PUF | ● | read-list（§3） |
| C6 | *Sur la philosophie (1950-1980)* | 2016 | PUF | ● | read-list（§3） |

> §2 は extensible。追加の OA 短編（"Mentalité technique" 2006 / "Culture et technique" 1965 / "L'effet de halo en matière technique" 等）や新刊遺稿集が見つかれば②でプローブして追記する。参照補助として `_reference/intro-individuation_PT-translation.pdf`（主論文序論のポルトガル語訳）を保持するが、**仏語原典ではない**ため精読・source-note 対象外。

## 3. OA 取得不能巻の扱い（read-list）

C 群および A3/A4 は OA 全文が存在しない（PUF/Millon/Seuil/Ellipses 商業刊・著作権存続 = 仏 PMA+70年 → 2059年）。鎖の「持つ（誰でも検証可）」を満たさないため:

- manifest は `blocked-access` / `citation-only` のまま。**source-note を作らない（Check 11a）**。
- 残せるのは **read-list（書誌 ＋ 読みたい理由）** のみ。確定論拠・公開解釈を置かない（Check 11b）。
- 既登録 D13-S01（A3 全体, blocked）はこのまま。ただし**第1部 A2 は OA 取得可**のため、A2 を別 publication（1964 PUF 第1部 ＝ 2005 Millon 全体とは別 ISBN・別範囲）として新 source_id で処理する。これは Check 10 の重複には当たらない（書籍の版・範囲相違＝DOI/ISBN 相違に準ずる）。判断根拠は本欄に明記。manifest 追加時に pjdhiro 確認を取る。

## 4. テスト（信頼できる検証）

専用テスト `scripts/check-simondon-corpus.sh` が本台帳と実体の整合を機械検査する:

1. 台帳 §2 の各「saved」エントリに対応する PDF が `.cache/sources/simondon/` に実在し PDF magic を持つ
2. note=✅ の行に対応する source-note ファイルが実在する
3. read=✅ かつ note=✅ なら manifest に対応 url-verified 行が存在する
4. OA=● の巻に source-note が**存在しない**（Check 11a 整合）

加えて全体不変条件は `bash scripts/validate-manifest-sync.sh`（Check 6/10/11/12）で担保。⑤記録のたび両テストを走らせ PASS を確認する。

## 5. 進捗ログ

- **2026-06-27 #01**: pjdhiro 指示で本台帳・手順・テストを新設。①列挙・②プローブ・③取得を実行。**OA フランス語原典 6点を `.cache/sources/simondon/` に保存**（A2 270p, B1 6p, B2 37p, B3 30p, B4 37p, B5 4p）。非該当2点を除外（niksnews=二次文献 Salzmann / intro=PT訳）。④精読以降は次段階。A1=D13-S02 は既に全章踏破・記録済。
