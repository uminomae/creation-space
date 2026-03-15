---
name: commit-review-with-log
description: |
  コミット単位の変更影響をレビューし、参照切れ・パス不整合・副作用を検出する。
  同期レビューと別 CLI による非同期レビューの両モードに対応する。
triggers: |
  「コミット影響レビュー」「変更の副作用を見たい」「コミット前に確認したい」
  ファイル移動・削除・リネームや cross-repo 変更を含むコミットの前後。
applyTo: ".cache/outbox/, .cache/session/"
agent: "both"
---

# skills/commit-review-with-log/SKILL.md — コミット影響レビュー

**目的**: コミットごとに変更の影響を広範囲にレビューし、参照切れ・パス不整合・副作用を検出する。

**使用タイミング**: ファイルの移動・削除・リネームを含むコミットの前後。特に cross-repo 変更時。

**担当**: 任意の LLM エージェント（Claude Code CLI, Codex, Gemini 等）

**バージョン**: 1.0
**作成日**: 2026-03-15
**移植元**: kesson-driven-thinking/skills/commit-review-with-log/SKILL.md

---

## 0. 運用モード

### モード A: 同期（作業 CLI 自身が実行）

コミット前に自分でレビューする。安全だが作業が止まる。

### モード B: 非同期（別 CLI で並行実行）

作業 CLI はコミット＆push に専念。別の LLM が非同期でレビューし、問題があれば Issue コメントで報告する。作業を止めない。

**非同期フロー:**

```
作業CLI: commit → push → 次のタスクへ
                ↓ (コミットSHA)
レビューCLI: SKILL.md を読む → git diff で変更検出 → Phase 1-3 → レポート出力
                ↓
            PASS → Issue コメントに PASS 報告
            WARN → Issue コメントに警告 + 対応 Issue 番号
            FAIL → Issue コメントに FAIL 報告 → オーナーに通知
```

### モード B の起動方法

レビュー CLI に以下を伝える：

```
あなたはレビュー専任です。作業は一切しません。

skills/commit-review-with-log/SKILL.md を読んでください。

以下のコミットの影響をレビューしてください:
- repo: {リポジトリ名}
- branch: {ブランチ名}
- コミットSHA: [SHA]（または「最新コミット」）
- 関連Issue: #{番号}

Phase 1-3 を実行し、レポートを Issue #{番号} にコメントしてください。
```

---

## 1. 入力

レビュー対象を特定するための情報。以下のいずれかを受け取る。

| 入力パターン | 取得方法 |
|---|---|
| コミットSHA | `git diff <SHA>~1 <SHA> --name-status` |
| ステージング済み | `git diff --cached --name-status` |
| 作業ツリー | `git diff --name-status` + `git status` |
| 指定ファイルリスト | 指示書に列挙されたパス |
| ブランチ差分 | `git diff develop..feature/xxx --name-status` |

**出力**: 変更ファイルの一覧と変更種別（Added / Modified / Deleted / Renamed）

---

## 2. レビュー手順

### Phase 1: 変更の分類

変更ファイルを以下に分類する。

| 分類 | 説明 | リスク |
|---|---|---|
| **パス変更**（Delete / Rename / Move） | ファイルが消えた or 場所が変わった | 参照切れの直接原因 |
| **内容変更**（Modified） | ファイルの中身が変わった | 依存先の期待値と不一致の可能性 |
| **追加**（Added） | 新規ファイル | 通常は安全。ただしルールファイルの追加は波及あり |

### Phase 2: 影響範囲の走査

**パス変更があった各ファイルについて、以下を全件実行する。**

#### 2a. ファイルパス参照の grep（最重要）

```bash
# 変更されたファイルのパス（相対パス部分）を全 repo から検索
SEARCH_TERM="変更パスの特徴的な部分"

# リポジトリ内検索
grep -rn "$SEARCH_TERM" --include='*.md' --include='*.sh' --include='*.py' --include='*.js' --include='*.json' --include='*.mjs' \
    . 2>/dev/null | grep -v '.git/' | grep -v 'node_modules/' || echo "(none)"
```

検出されたファイルごとに、該当行と修正要否を報告する。

#### 2b. スクリプトの入出力チェック

変更がスクリプト（.sh, .py, .mjs）の入出力パスに影響する場合、scripts/ 配下を検索する。

#### 2c. 管理書類の整合チェック

変更が以下の管理書類の記述と矛盾しないか確認：

| ファイル | チェック内容 |
|---|---|
| `docs/README.md` | パスリンク、ロード指示、リンク集 |
| `CLAUDE.md` | ディレクトリ構造の記述 |
| `.cache/active/TASK-*.md` | 作業指示内のパス |
| `skills/*/SKILL.md` | スキル定義内のパス |

#### 2d. cross-repo 依存チェック（該当する場合）

関連リポジトリがある場合、cross-repo 参照パターンを検索する。

#### 2e. import / require チェック（JS ファイル変更時）

```bash
grep -rn "import.*from.*'変更ファイル名'" src/
```

### Phase 3: 影響レポート作成

以下の形式でレポートを出力する。

```markdown
## コミット影響レビュー

**対象**: [コミットSHA or 変更内容の要約]
**レビュー日**: YYYY-MM-DD
**レビュー担当**: [エージェント名]
**モード**: A（同期） / B（非同期）

### 変更サマリー

| ファイル | 変更種別 | リスク |
|---|---|---|
| path/to/file | Deleted | 要注意 |

### 検出された影響

| # | 影響先ファイル | 該当行 | 影響内容 | 対応状況 |
|---|---|---|---|---|
| 1 | docs/README.md:42 | パス参照 | パス参照切れ | 要修正 |

### 対応不要の検出（誤検知）

| 影響先 | 理由 |
|---|---|
| .cache/inbox/archive/old-file.md | archive済み。参照されない |

### 未検査項目

| 項目 | 理由 |
|---|---|

### 総合判定

PASS / WARN / FAIL
```

**レポートの保存（必須）**: `.cache/outbox/REVIEW-{SHA短縮}-{YYYYMMDD}.md` にレポートを保存する。

**モード B の場合**: レポートを該当 Issue にコメントとして投稿する。

---

## 3. 判定基準

| 判定 | 条件 | アクション |
|---|---|---|
| PASS | 影響なし or 全て対応済み | コミット可（モードA）/ 報告のみ（モードB） |
| WARN | 影響あるが別 Issue で対応予定 | コミット可。Issue 番号を明記 |
| FAIL | 未対応の参照切れあり | モードA: コミット前に修正。モードB: オーナーに即時通知 |

---

## 4. 運用ルール

- **ファイル移動・削除・リネームを含むコミットでは必ず実行する**
- 内容変更のみのコミットでは任意（大規模変更時は推奨）
- レポートは完了報告に含める（Issue コメント等）
- Phase 2a の grep は可能な限り**全関連 repo** で実行する
- 検出結果が多すぎる場合は、パス変更のあるファイルに絞って報告
- **モード B のレビュー CLI は作業を一切しない**。検出と報告のみ

---

## 5. 使い方の例

### モード A: 同期（CLI への指示例）

```
作業後、コミット前に commit-review-with-log を実行してください。
skills/commit-review-with-log/SKILL.md を読み、Phase 1-3 を実行。
対象: git diff --cached --name-status で確認
```

### モード B: 非同期（レビュー CLI への起動指示）

```
あなたはレビュー専任です。作業は一切しません。

skills/commit-review-with-log/SKILL.md を読んでください。

以下のコミットの影響をレビューしてください:
- repo: creation-space
- branch: develop
- コミットSHA: [SHA]
- 関連Issue: #NNN

Phase 1-3 を実行し、レポートを Issue #NNN にコメントしてください。
FAIL の場合はオーナーに即通知が必要です。
```

### 指示書への組み込み例（モード A）

```markdown
### Step N: コミット影響レビュー

`skills/commit-review-with-log/SKILL.md` に従い、Phase 1-3 を実行する。
FAIL の場合はコミットしない。完了報告にレポートを含めること。
```

---

## 6. 更新履歴

| 日付 | バージョン | 内容 |
|---|---|---|
| 2026-03-15 | 1.0 | kesson-driven-thinking から汎用スキルとして移植 |
