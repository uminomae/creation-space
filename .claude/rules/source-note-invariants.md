# source-note 不変条件（cs 内部ルール）

cs 側の原典（manifest）と原典解説（source-notes）の整合を保つ cs 内部ルール。

> **重要（cs#228）**: 本ルールは cs 内部のみに適用される。cs は pd の状態を検査しない／pd への出力義務を負わない。pd は cs の調査時に参照する素材として扱う。
>
> **用語**: 旧称「cs wiki」→「cs source-notes」。本ルールでは cs `knowledge/source-notes/D{NN}/D{NN}-S{##}_*.md` を source-note と呼ぶ。

## 1. 「原典 → source-note 1:1」原則（cs 内部）

cs `knowledge/raw/manifest.md` の各行のうち、以下を**すべて**満たすものには対応する cs source-note ページが存在しなければならない。

- `access_status` ∈ { `raw-confirmed`, `url-verified` }
- `domain_id` が `D\d+` パターン（`citation-only` / `blocked-access` は対象外）

対応 source-note ページ:

```
cs/knowledge/source-notes/D{NN}/{source_id}_{slug}.md
```

例: `D27-S10` → `cs/knowledge/source-notes/D27/D27-S10_schumacher-2008.md`

### 検知機構

| 層 | hook / script | 役割 |
|---|---|---|
| cs SessionStart | `cs/.claude/hooks/source-note-gen-check.sh` | cs manifest → cs source-note 未生成を `.cache/inbox/cs-source-note-gen-{date}.md` に書き出す |
| cs PostToolUse | `cs/.claude/hooks/source-note-gen-notify.sh` | cs commit で (A) raw PDF 追加 / (B) cs source-note 改訂を pd `.cache/inbox/` に**通知のみ**（pd 側の義務は発生しない） |
| 手動検査 | `bash scripts/validate-manifest-sync.sh` | Check 6 (cs ≥5) を実行 |

## 2. 「各領域 source-note ≥5 本」不変条件（cs 内部）

cs 側の 30 領域すべてで、`D{NN}-S{##}_*.md` 形式の source-note ページが **5 本以上**存在しなければならない。

- **FAIL 判定**: `bash scripts/validate-manifest-sync.sh` の **Check 6** で FAIL
- **閾値**: 5（タクソノミー整合、progress_level 問わず固定）

## 2.5. 🚫 「原典重複禁止」不変条件（cs 内部・FAIL, cs#249）

**同一原典を同一領域の manifest 行に複数登録してはならない。** これは §1「原典 → source-note 1:1 原則」の裏返しであり、重複は 1:1 を壊す。

- **判定方針（cs#249, pjdhiro 指示 = 実務標準の書誌重複ルールを採用）**: systematic review の dedup / Zotero・EndNote 等の参照管理 / Crossref・PubMed に倣う。
  1. **work-identity = (領域, 著者姓, 正規化書名)** で重複候補をグルーピング（年・版の表記ゆれに依存しない。旧方式 `(領域,著者姓,年,書名)` は D16-S03「1934-1961」vs D16-S04 年欄空 の Toynbee を年差ですり抜けた）。
  2. **DOI が主キー**: 候補ペアの両方が DOI を持ち、それが**異なれば別 publication** として自動除外（速報 letter 版 vs 拡張 full article 版、版違い等。例: Bak SOC D29-S03/S04 は別 DOI で自動判定され例外登録不要）。
  3. DOI で切り分けられない同一 work-identity ペアのうち、登録簿の例外を除いた残りを重複として FAIL。
- **FAIL 判定**: `bash scripts/validate-manifest-sync.sh` の **Check 10** で FAIL。
- **書名抽出**: 論文/書籍の**実タイトル**を採る。論文 `Author (year). Title. *Journal*` はイタリックが雑誌名なので年括弧後・最初のイタリック手前のテキストを、書籍 `Author (year). *Title*.` / `Author. *Title*.`(年括弧なし) はイタリックをタイトルとする。
- **正規パターン（重複ではない・FAIL しない）**:
  - **DOI 相違**: 同一 work-identity でも DOI が異なれば別 publication（自動判定・登録不要）。
  - **クロス領域 anchor**（§7）: 同一原典を *異なる領域* で再利用。領域が異なるためキーが衝突せず掛からない。正本は `cross-domain-anchors.md`。
  - **レビュー済み例外（誤検知でない理由つき）**: DOI で切り分けられない同名別物（翻訳版 vs 原著、同名異著 等）は、登録簿 **`knowledge/raw/duplicate-exceptions.md`** に `| source_id A | source_id B | カテゴリ | 誤検知でない理由・論拠 |` 形式で人間がレビューして登録する。Check 10 が同ファイルを読んで除外する。現在 有効登録は 0 件（Bak は DOI 相違で自動判定）。`D25-S01b` van Gennep 1960英訳 raw 重複は 2026-06-22 に物理PDF・manifest行とも除外済み（pjdhiro 承認）。
- **運用ルール（再発防止）**:
  1. manifest に行を追加する前に、必ず `grep` で同一書名の既存行を確認する。
  2. **重複に気づいたら「重複」と注記して放置してはならない。その場で重複行を除外する**。
     - 教訓 (cs#249): `D15-S10`(Dewey 1934) / `D26-S09`(Huron 2006) は「=重複」と注記されながら manifest に残置されていた。注記＝放置の温床。除外まで完了させること。
  3. raw-confirmed の重複（物理 PDF を伴う）を除外する場合は、孤立 PDF の扱いを pjdhiro に確認する（破壊的操作のため）。

## 2.6. 🔗 「鎖の不変条件」— 取得不能原典の上に公開解釈/確定論拠を置かない（cs 内部・FAIL, cs#252）

**原則（公開出力の正当性の鎖）**: あらゆる公開・論拠化された解釈／要約は、その根拠原典が次の鎖をすべて満たさねばならない。

> **持つ（誰の目にも明らかに＝OA で誰でも検証可に入手できる）→ 読む（全文）→ 解釈 → まとめる → 公開**

§1 の「1:1（raw-confirmed/url-verified → source-note 必須）」の**裏側**として、取得不能（`citation-only` / `blocked-access` ＝誰でも検証可に入手できない）な原典の上には、公開「解釈／まとめ」を置いてはならない。取得不能原典に残せるのは **read-list（書誌＋読みたい理由）のログのみ**。

- **FAIL 判定**: `bash scripts/validate-manifest-sync.sh` の **Check 11**。
- **11a（FAIL）取得不能 → source-note 禁止**: `citation-only` / `blocked-access` の行に対応する cs source-note (`knowledge/source-notes/D{NN}/{source_id}_*.md`) が**存在してはならない**。検証不能な根拠の上の公開解釈は撤去し read-list 化する。
- **11b（FAIL）取得不能を取得不能で確定するな**: 取得不能原典が `[phase-3-confirmed]` / 「代替確定」等の**確定ステータス**を主張し、その**代替もまた取得不能な cs 原典**である場合 FAIL。鎖は「検証可能な代替経由」でしか成立しない（代替が OA 検証済なら可）。
  - **取り消し線 `~~...~~` で撤回済みの記述は live ではない**ので対象外（撤回の履歴は残してよい）。
  - 教訓 (cs#252): D05-S01 Wilson の `[phase-3-confirmed]` は、代替 D05-S04 Dewey&Bird が citation-only（取得不能）に降格した後も固定代替として残り、鎖が切れていた。固定代替を立てず探索継続へ戻す（investigation-cs219 冒頭バナー参照）。
- **「OA だが当環境ブロック」は取得不能ではない**: 別 egress で誰でも読めるため鎖を満たしうる。削除せず source-reader 精読 → source-note 生成の対象（cs#252 B群）。
- **pd 側の対**（cs#228 によりここでは検査しない）: pd `wiki/sources/` も取得不能原典のページを持ってはならない。pd 側の standing チェックは pd repo の wiki-lint（pd#114）が担う。

### 「読む」の機械化（Check 12, cs#252）

鎖の「読む」段階も執行する。source-note frontmatter の既存フィールド **「読解ページ範囲」**（実際に読んだ範囲）が abstract / 要旨 / メタデータ「**のみ**」を示すものは、全文未読＝「読む」を欠くため **FAIL**（`validate-manifest-sync.sh` Check 12）。

- **新規 source-note の鉄則**: 原典を**全文（または主要部の精読）**した上で書く。`読解方法` / `読解ページ範囲` に実読範囲を正直に記す。失敗した取得経路を `読解方法` に書く場合でも、`読解ページ範囲` には**最終的に読んだ範囲**を書く（Check 12 は範囲フィールドを最優先で見る）。
- **abstract のみで書いてしまった場合の処置**（cs#249/cs#252 で確立）:
  - 原典が**真に取得不能**（OA 全文なし） → source-note を破棄し、manifest を blocked-access/citation-only へ降格して read-list 化（例: D11-S01 Paul 2010 = Nature paywall）。
  - 原典が **OA だが当環境未取得**（B群型・例: D28-S15 = OA 誌 *Junctions*） → 破棄せず `knowledge/raw/read-depth-exceptions.md` に**精読義務**として登録（Check 12 は除外）。budget 回復後に全文精読 → 再生成 → 登録除去。
- **登録簿は「放置」ではない**: read-depth-exceptions は OA 全文がある（＝読める）もの限定の追跡された TODO。真に取得不能なものは登録不可（降格する）。

## 3. 「source-note 改訂 → 関連ページ同時更新」（cs 内部）

cs source-note を改訂するコミットでは、以下の関連ページのうち該当するものを**同一コミット内で**更新する。

- `knowledge/source-notes/D{NN}/D{NN}-summary.md` — 領域サマリ
- 関連 `evidence/evidence-D{NN}-*.md` — 5 段階モデル上の位置付けに影響があるとき
- `knowledge/source-notes/cross-refs/` や領域跨ぎ参照ドキュメント — 接続が変わったとき

分離コミットは中間状態での整合崩れを生むので避ける。

## 4. 違反時の扱い

| 違反 | 検知 | 対処 |
|---|---|---|
| cs source-note 未生成（raw-confirmed / url-verified） | cs hook `source-note-gen-check.sh` SessionStart で inbox 起票 | inbox の依頼順に生成。`knowledge/source-notes/D{NN}/{source_id}_*.md` を作成してコミット |
| 領域 source-note <5 本 | `validate-manifest-sync.sh` Check 6 FAIL | 原典を追加して source-note を生成する（manifest に url-verified or raw-confirmed を追加→hook が検知→source-note 生成） |
| **同一領域に原典重複行** | `validate-manifest-sync.sh` **Check 10** FAIL | 重複行を manifest から除外する。DOI で切り分け不可な同名別物なら `knowledge/raw/duplicate-exceptions.md` に理由・論拠つきで登録。raw 重複は孤立 PDF を pjdhiro 確認 |
| **取得不能原典に source-note がある** | `validate-manifest-sync.sh` **Check 11a** FAIL | 公開解釈を撤去し read-list 化（書誌＋読みたい理由のみ） |
| **取得不能原典が取得不能な代替で確定主張** | `validate-manifest-sync.sh` **Check 11b** FAIL | 固定代替を撤回し探索継続へ。撤回履歴は取り消し線 `~~...~~` で残してよい |
| **abstract/メタデータのみの source-note** | `validate-manifest-sync.sh` **Check 12** FAIL | 全文精読で再生成。真に取得不能なら破棄＋降格(read-list)。OA だが未取得なら `read-depth-exceptions.md` に精読義務として登録 |
| source-note 改訂で関連更新漏れ | code review | 追加コミットで補完し、理由を commit message に明記 |

## 5. pd 側の品質チェック（参照のみ、cs には義務なし）

pd は cs raw PDF から `wiki/sources/` を**独立生成**する。その生成直後、pd 側で cs source-note (`knowledge/source-notes/D{NN}/D{NN}-S{##}_*.md`) との**内容矛盾検査**を行う（pd#82）。

- 検査スクリプト: `project-design/scripts/wiki-cross-check.mjs`
- 検査手順: `project-design/.claude/skills/wiki-compile/SKILL.md` Step 3b「生成後チェック」
- cs は検査結果を受け取らない。矛盾が見つかった場合、pjdhiro が cs 側修正の要否を判断し、必要に応じて cs Issue に振り分ける

## 7. クロス領域 anchor の扱い（cs#245）

一部の原典は本質的に複数領域に跨り、**同一 PDF を複数領域の anchor として再利用**している（例: Varela『Embodied Mind』= D14心理学+D08神経科学、世阿弥『風姿花伝』= D28+D15+D30）。

- **`knowledge/raw/` の PDF ファイル名の D番号は「最初に raw 確保した領域」を示すだけ**。原典が属する唯一の領域ではない。
- したがって「source_id の D番号 ≠ PDF ファイル名の D番号」は**齟齬ではない**。検査スクリプト（`bib-crosscheck.sh` / `count-manifest.sh` 等）でこのパターンを検出しても、`knowledge/source-notes/cross-domain-anchors.md` に記載があれば正規。
- 同一原典を複数領域で読む場合、**領域ごとに別の source-note** を書く（異なる観点で読解）。これは重複ではない。
- 新規にクロス領域 anchor を追加するときは、`cross-domain-anchors.md` に追記し、manifest 注記列に再利用元を明記する。
- 正本一覧: **`knowledge/source-notes/cross-domain-anchors.md`**（4原典・9 source-note を記録）

## 8. 関連 Issue

- cs#225 — 乖離診断と原則の確立（closed）
- cs#226 — cs hook 新設（旧 `wiki-gen-check.sh` → `source-note-gen-check.sh` rename 済, closed）
- cs#227 — 本ルール初版（closed, cs#228 で「pd side」節と Check 7 を撤回）
- cs#228 — cs/pd 役割分離原則の明文化 + `knowledge/wiki/` → `knowledge/source-notes/` rename（本コミットで実装）
- pd#82 — pd wiki ↔ cs source-note 矛盾検査
- cs#249 — source-note backfill 中に原典重複（D15-S10/D26-S09）を発見。§2.5「原典重複禁止」不変条件 + Check 10 を新設
- cs#252 — 取得不能原典を wiki/source-note/論拠から除去し read-list 化。§2.6「鎖の不変条件」+ Check 11(a/b) を新設。pd 側は pd#114
