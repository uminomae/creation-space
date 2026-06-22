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

**同一原典（著者 + 年 + 書名）を同一領域の manifest 行に複数登録してはならない。** これは §1「原典 → source-note 1:1 原則」の裏返しであり、重複は 1:1 を壊す。

- **FAIL 判定**: `bash scripts/validate-manifest-sync.sh` の **Check 10** で FAIL。
- **検知ロジック**: manifest 各行を `(領域, 著者姓, 年, 正規化書名)` でグルーピングし、同一キーが 2 行以上あれば重複候補。先頭を正本、残りを「要除外」として FAIL。
- **正規パターン（重複ではない・FAIL しない）**:
  - **クロス領域 anchor**（§7）: 同一原典を *異なる領域* で再利用。領域が異なるためキーが衝突せず、本検査に掛からない。正本は `cross-domain-anchors.md`。
  - **レビュー済み例外**: 版違い等で意図的に残す場合のみ、`validate-manifest-sync.sh` の `REVIEWED_DUP_EXCEPTIONS` に source_id と理由を明記して通す。現在 登録例外は 0 件（`D25-S01b` van Gennep 1960英訳 raw 重複は 2026-06-22 に物理PDF・manifest行とも除外済み、pjdhiro 承認）。
- **運用ルール（再発防止）**:
  1. manifest に行を追加する前に、必ず `grep` で同一著者・年・書名の既存行を確認する。
  2. **重複に気づいたら「重複」と注記して放置してはならない。その場で重複行を除外する**。
     - 教訓 (cs#249): `D15-S10`(Dewey 1934) / `D26-S09`(Huron 2006) は「=重複」と注記されながら manifest に残置されていた。注記＝放置の温床。除外まで完了させること。
  3. raw-confirmed の重複（物理 PDF を伴う）を除外する場合は、孤立 PDF の扱いを pjdhiro に確認する（破壊的操作のため）。

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
| **同一領域に原典重複行** | `validate-manifest-sync.sh` **Check 10** FAIL | 重複行を manifest から除外する。版違い等で残すなら `REVIEWED_DUP_EXCEPTIONS` に理由付きで追記。raw 重複は孤立 PDF を pjdhiro 確認 |
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
