# 領域別レポート End-to-End ワークフロー v1.0

**用途**: 領域別レポート（domains）の生成→品質テスト→PDF公開→manifest更新の全手順
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

### Step 3: 品質テスト

`transform/domains/quality-test/quality-test-domain-report.md` で自己採点する。

- FAIL があれば再生成（Step 2 に戻る）
- grep チェック + 目視チェック

### Step 4: PDF 生成

```bash
bash transform/scripts/build-pdf-guide.sh --kind domains --lang ja
```

出力確認:
```
pjdhiro/assets/creation/domains/ja/pdf/domain-D{NN}-{slug}.pdf
```

### Step 5: manifest 更新

```bash
cd /Users/uminomae/dev/creation-space
node scripts/generate-domains-json.mjs
```

実行後の確認:
```bash
node scripts/generate-domains-json.mjs --check
```

**cs#101 準拠**: progress_level に意図しない変更がないことを確認する。

### Step 6: pjdhiro 側 commit & push

```bash
cd /Users/uminomae/dev/pjdhiro
git add assets/creation/domains/ assets/creation/manifests/domains.json
git diff --stat
git commit -m "docs: D{NN} domain report publish (cs#76)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

### Step 7: creation-space 側 commit & push

```bash
cd /Users/uminomae/dev/creation-space
git add -A
git commit -m "feat: D{NN} domain report 生成 (cs#76)

Co-Authored-By: Claude <noreply@anthropic.com>"
git pull --rebase origin develop
git push origin develop
```

### Step 8: creation-space develop → main マージ

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

### Step 3: PDF 一括ビルド

```bash
bash transform/scripts/build-pdf-guide.sh --kind domains --lang ja
```

30件を一括でビルド。

### Step 4: manifest 一括更新

```bash
node scripts/generate-domains-json.mjs
node scripts/generate-domains-json.mjs --check
```

### Step 5: pjdhiro commit & push

```bash
cd /Users/uminomae/dev/pjdhiro
git add assets/creation/domains/ assets/creation/manifests/domains.json
git commit -m "docs: 30 domains report publish (cs#76)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin main
```

### Step 6: creation-space commit & push + main マージ

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

`transform/translation-rules.md`（kesson-driven-thinking 側に正本あり）

### Step 2: EN MD 生成

JA MD を入力として EN を生成。出力先:
```
pjdhiro/assets/creation/domains/en/md/domain-D{NN}-{slug}.md
```

### Step 3: PDF 生成

```bash
bash transform/scripts/build-pdf-guide.sh --kind domains --lang en
```

### Step 4: manifest 更新 → pjdhiro push → creation-space main マージ

A の Step 5-8 と同じ。

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

## 制約への参照

- **progress_level 保護**: `.claude/rules/evidence-progress.md`、CLAUDE.md §progress_level（cs#101）
- **front matter 除去**: NL-012（build-pdf-guide.sh が自動除去するが、MD 配置時にも確認）
- **PDFビルドコマンド**: `bash transform/scripts/build-pdf-guide.sh --kind domains --lang {ja|en}`
- **manifest 生成**: `node scripts/generate-domains-json.mjs`（`--check` で差分確認）
