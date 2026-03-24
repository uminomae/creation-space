# 領域別レポート End-to-End ワークフロー v1.1

**用途**: 領域別レポート（domains）の生成→品質テスト→独立レビュー→PDF公開の全手順
**前提**: evidence が `evidence/evidence-D{NN}-*.md` に存在すること
**参照 Issue**: cs#103, cs#76

---

## A. 1領域の新規生成（最小パス）

### Step 1: 入力準備

```bash
# evidence の存在確認
ls evidence/evidence-D{NN}-*.md
```

以下を読む（この順序で）:
1. `transform/domains/reader-rules/reader-rules-creation-report.md`（声・構成・品質基準）
2. `transform/domains/reader-rules/reader-rules-creation.md`（共通基盤）
3. `transform/domains/quality-test/quality-test-domain-report.md`（品質テスト — 生成前に内面化）
4. 対象の `evidence/evidence-D{NN}-*.md`
5. `base/text/m2-creation-process/creation-source.md`（5段階の定義）

### Step 2: MD 生成

`transform/domains/domain-report-template.md` の構造に従い生成する。

- reader-rules-creation-report.md の全§を遵守
- front matter: title, generator_model, lang, version, date を必須記入

出力先:
```
pjdhiro/assets/creation/domains/ja/md/domain-D{NN}-{slug}.md
```

**quality_level 更新**: index.json の当該ドメインの `quality_level` を `generated` に設定する。

### Step 3: 品質テスト

`transform/domains/quality-test/quality-test-domain-report.md` で自己採点する。

- FAIL があれば再生成（Step 2 に戻る）
- grep チェック + 目視チェック

**quality_level 更新**: PASS の場合、index.json の `quality_level` を `self_tested` に設定する。


### Step 3.5: 原典照合（cs#126）

品質テスト PASS 後、独立レビューの前に原典照合を実施する。

1. 本文で名前を挙げた理論・人物を列挙する
2. 各理論について信頼できる参照（原著、教科書、学術レビュー、百科事典等）を調べる
3. 共通基盤 §8.F の判定基準（`verified` / `plausible` / `overstated` / `unverifiable`）で検証する
4. 検証結果を `{filename}-ref-check.md` として生成物と同じディレクトリに保存する（公開はしない）
5. `overstated` → 本文を修正して Step 3 に戻る
6. `unverifiable` → 本文から除外、または温度を下げる

**判定基準の詳細**: `transform/domains/reader-rules/reader-rules-creation.md` §8.F を参照。
### Step 4: 独立レビュー（完了基準）

生成したレポートを、生成者とは別のエンジン（Codex CLI 等）でレビューする。

```
レビュー観点:
- T1: スコープ（構造比較の枠組みを維持しているか）
- T5: 文体（です・ます調の統一）
- NL-003: 5段階の均等記述
- §7: 返却設計（立ち位置明示・安全弁・温度開示）
- Colophon: evidence_count と本文の整合
- §5: 知見の3層分析（事実/読み取り/解釈）
```

- **FAIL** → Step 2 に戻り修正。修正後に再レビュー
- **WARN** → 修正して再レビュー（3件以上の WARN は再生成を検討）
- **PASS** → Step 5 に進む

レビュー結果は関連 Issue に記録する（品質保証の証跡）。

**Colophon への記録**: レビューを経たレポートは Colophon に以下を追記する:
```
| review_engine | {レビュー実施エンジン名}（例: codex:gpt-5.4） |
| review_result | PASS / WARN({件数}) |
```

**quality_level 更新**: PASS の場合、index.json の `quality_level` を `independent_reviewed` に設定し、`review_engine` と `review_result` も記入する。

### Step 5: SVG 生成 + 公開 MD 同期

公開用 `.md` を modal / PDF / EN で共用するため、PDF 前に SVG と md 埋め込みを同期する。

```bash
# JA/EN の SVG を生成
bash transform/scripts/generate-svg.sh --generate

# 公開用 md / presentation md に SVG 参照を同期
python3 scripts/sync-public-svg-embeds.py
```

確認:
- `pjdhiro/assets/creation/domains/{lang}/md/*.md` の H1 直後に SVG が入っている

### Step 6: PDF 生成 + manifest 更新 + 日付検証

**推奨: パイプラインを使用する（cs#128）:**
```bash
cd /Users/uminomae/dev/creation-space
bash scripts/generate-domain-pipeline.sh --domain D{NN}   # 単一
bash scripts/generate-domain-pipeline.sh --all             # 全30件
```

パイプラインは PDF 生成 → manifest 更新 → 日付検証 を一括実行する。

**個別実行する場合:**
```bash
# PDF 生成（同じ公開用 md を入力に使う。SVG は build 時に一時 PNG 化される）
bash transform/scripts/build-pdf-guide.sh --kind domains --lang ja

# manifest 更新
node scripts/generate-domains-json.mjs

# 確認
node scripts/generate-domains-json.mjs --check

# 日付検証
bash scripts/verify-domain-dates.sh --domain D{NN}
```

出力確認:
```
pjdhiro/assets/creation/domains/ja/pdf/domain-D{NN}-{slug}.pdf
```

**cs#101 準拠**: progress_level に意図しない変更がないことを確認する。

### Step 7: pjdhiro 側 commit & push

```bash
cd /Users/uminomae/dev/pjdhiro
git add assets/creation/domains/ assets/creation/manifests/domains.json
git diff --stat
git commit -m "docs: D{NN} domain report publish (cs#76)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

### Step 8: creation-space 側 commit & push

```bash
cd /Users/uminomae/dev/creation-space
git add -A
git commit -m "feat: D{NN} domain report 生成 (cs#76)

Co-Authored-By: Claude <noreply@anthropic.com>"
git pull --rebase origin develop
git push origin develop
```

### Step 9: creation-space develop → main マージ

```bash
cd /Users/uminomae/dev/creation-space
git checkout main
git merge develop --no-ff -m "Merge develop into main: D{NN} domain report publish"
git push origin main
git checkout develop
```

---

## B. 1領域の再生成（既存レポートの更新）

A と同じ手順。ただし:

- Step 1 で evidence の変更点を確認する
- Step 5 で status は変更しない（既に published）
- progress_level の変更が必要な場合は pjdhiro に確認（`.claude/rules/evidence-progress.md` 参照）

---

## C. 全30領域の一括生成

A を30回繰り返すのではなく、バッチで処理する。

### Step 1: MD 一括生成

30領域を順次（またはAgent並列で）生成。出力先:
```
pjdhiro/assets/creation/domains/ja/md/domain-D{NN}-{slug}.md
```

### Step 2: 品質テスト一括

各レポートに quality-test を実施。FAIL は個別に修正。

### Step 3: 独立レビュー一括

全レポートを Codex CLI 等でバッチレビュー。FAIL/WARN は個別に修正→再レビュー。
レビュー結果は Issue に記録。PASS になった領域のみ Step 4 に進む。

### Step 4: PDF 一括ビルド

```bash
bash transform/scripts/build-pdf-guide.sh --kind domains --lang ja
```

30件を一括でビルド。

### Step 5: manifest 一括更新

```bash
node scripts/generate-domains-json.mjs
node scripts/generate-domains-json.mjs --check
```

### Step 6: pjdhiro commit & push

```bash
cd /Users/uminomae/dev/pjdhiro
git add assets/creation/domains/ assets/creation/manifests/domains.json
git commit -m "docs: 30 domains report publish (cs#76)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

### Step 7: creation-space commit & push + main マージ

```bash
cd /Users/uminomae/dev/creation-space
git add -A
git commit -m "feat: 30 domains report 一括生成 (cs#76)

Co-Authored-By: Claude <noreply@anthropic.com>"
git pull --rebase origin develop
git push origin develop

git checkout main
git merge develop --no-ff -m "Merge develop into main: 30 domains report publish (cs#76)"
git push origin main
git checkout develop
```

---

## D. EN版の生成

JA版が確定した後に実施する。

### Step 1: 翻訳ルールを読む

`transform/domains/reader-rules/translation-rules.md`（EN 翻訳の品質基準・voice・用語統一ルール）

### Step 2: EN MD 生成（手動ステップ）

JA MD を入力として EN を生成。翻訳ルールの全項目を遵守すること。出力先:
```
pjdhiro/assets/creation/domains/en/md/domain-D{NN}-{slug}.md
```

### Step 3: PDF 生成 + manifest 更新 + 日付検証（パイプライン）

```bash
# 単一ドメイン
bash scripts/generate-domain-pipeline.sh --domain D{NN}

# 全ドメイン
bash scripts/generate-domain-pipeline.sh --all
```

パイプラインは以下を自動実行する:
1. JA PDF 生成（build-pdf-guide.sh --kind domains --lang ja）
2. EN PDF 生成（EN MD が存在する場合）
3. domains.json 更新（generate-domains-json.mjs）
4. 日付検証（verify-domain-dates.sh）

### Step 4: pjdhiro push → creation-space main マージ

A の Step 7-9 と同じ。

---

## E. パイプラインスクリプト一覧（cs#128）

| スクリプト | 用途 |
|-----------|------|
| `scripts/generate-domain-pipeline.sh` | JA→EN+PDF 一括パイプライン |
| `scripts/verify-domain-dates.sh` | ソース date と domains.json generated の一致検証 |
| `transform/scripts/build-pdf-guide.sh` | PDF ビルド（JA/EN） |
| `scripts/generate-domains-json.mjs` | domains.json 生成 |
| `transform/domains/reader-rules/translation-rules.md` | EN 翻訳ルール |

### verify-domain-dates.sh の検証内容

1. ソース MD（publish/domains/）の front matter `date` と domains.json の `generated` の一致
2. JA MD が存在するのに JA PDF がない場合の検出
3. EN MD が存在するのに EN PDF がない場合の検出

---

## 2リポジトリ間の操作境界

| 操作 | リポジトリ | ブランチ |
|------|-----------|---------|
| MD 生成 | creation-space | develop |
| 品質テスト | creation-space | develop |
| MD 配置 | pjdhiro | main |
| PDF ビルド | pjdhiro（出力先） | main |
| manifest 更新 | pjdhiro（出力先）+ creation-space（スクリプト） | main / develop |
| manifest commit & push | pjdhiro | main |
| creation-space commit & push | creation-space | develop |
| creation-space main マージ | creation-space | main ← develop |

**重要**: PDF 公開は pjdhiro push **かつ** creation-space の develop→main マージまで完了して初めて完了とする。

---

## reader-rules と template の関係

| template セクション | 対応する reader-rules の§ |
|---|---|
| 冒頭の立ち位置明示 | §7 返却設計 |
| §1 調査の目的と問い | §4 調査報告書の標準構成 |
| §2 調査の方法 + S60 開示 | §4 + S60 |
| §3 モデルの概要 | §5 用語 + NL-003 均等記述 |
| §4 調査結果: 全体像 | §4 + §7 安全弁 |
| §5 調査結果: 主要な知見 | §4 3層分析（事実/読み取り/解釈） |
| §6 横断的パターン | L-4 |
| §7 未解決の問い | L-5 |
| §8 結論 + 温度開示 | §7 返却設計 |
| Colophon | §8 準拠 |

**CLI向け判断基準**: テンプレート構造 + reader-rules の品質ゲート = 生成の全要件。両方を読むこと。

---

## 1領域の完了基準

以下の全条件を満たしたとき、その領域のレポートは「完了」とする:

1. **MD 生成済み**: reader-rules + template に準拠した MD が pjdhiro に配置されている
2. **品質テスト PASS**: quality-test-domain-report.md の全項目を通過
3. **独立レビュー PASS**: 生成者とは別のエンジンによるレビューで FAIL がない
4. **レビュー証跡**: レビュー結果が Issue に記録されている
5. **Colophon 記載**: review_engine と review_result が Colophon に含まれている
6. **PDF 公開済み**: pjdhiro に PDF が push されている
7. **main マージ済み**: creation-space の develop → main マージが完了している

**この完了基準自体が品質保証の一部である。** 各レポートの §2（調査の方法）には、独立レビューを経ていることを方法論として記載する。

---

## quality_level 更新ポイントまとめ（cs#111）

| WORKFLOW Step | quality_level 更新 |
|---|---|
| Step 2: MD 生成 | → `generated` |
| Step 3: 品質テスト PASS | → `self_tested` |
| Step 4: 独立レビュー PASS | → `independent_reviewed` + review_engine/review_result 記入 |
| pjdhiro レビュー | → `pjdhiro_reviewed` |

quality_level の逆行（例: `independent_reviewed` → `generated`）は原則禁止。
定義の正本: `docs/evidence-metadata-creation.md` §2.9

## 制約への参照

- **progress_level 保護**: `.claude/rules/evidence-progress.md`、CLAUDE.md §progress_level（cs#101）
- **front matter 除去**: NL-012（build-pdf-guide.sh が自動除去するが、MD 配置時にも確認）
- **PDFビルドコマンド**: `bash transform/scripts/build-pdf-guide.sh --kind domains --lang {ja|en}`
- **manifest 生成**: `node scripts/generate-domains-json.mjs`（`--check` で差分確認）
