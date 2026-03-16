# ルール × 守護者マトリクス

**バージョン**: 1.0
**更新日**: 2026-03-16
**採番規則**: CS-NNN（creation-space 固有。kesson-driven-thinking の G-ID とは独立）

## レビュー手順

### トリガー

| 状況 | やること |
|---|---|
| 教訓（CL-*）を記録したとき | そのルールの CS-ID を確認。なければ割り当てる。守護者が機能していたか確認 |
| 新規ルール・制約・ガイドを追加したとき | CS-ID を割り当て、守護者（主）（副）を決定 |
| periodic-review 時 | 守護者不在行（守護者（主）が空欄）を走査 |

### 手順

1. 本マトリクスを開く
2. 該当ルールの CS-ID を特定（なければ新規採番: 末尾 +1）
3. 守護者（主）（副）が適切か確認。不在なら割り当てを提案
4. 正本ファイルとの対応が最新か確認
5. 変更があれば本マトリクスを更新し、commit に含める

## 概要

本マトリクスは、`CLAUDE.md`、`.claude/rules/*.md`、`docs/quality-management.md`、`docs/README.md` にある運用ルールを、
「誰がチェックするか（守護者）」と「いつチェックするか（タイミング）」で再配置したものである。

守護者の凡例:
- **hook**: `.claude/hooks/` のスクリプトが自動チェック
- **CLI自律**: Claude Code CLI が自律的にチェック
- **オーナー**: pjdhiro が判断

## マトリクス

### セッション管理

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-001 | セッション開始時に branch 確認・git status・docs/README.md を読む | CLI自律 | — | セッション開始時 | `CLAUDE.md` §セッション開始手順 | hook: session-start-guard.sh |
| CS-002 | state.md の「CLI 作業中」にセッション登録し HEAD SHA を更新する | CLI自律 | — | セッション開始時 | `.claude/rules/state-sync.md` | hook: session-start-guard.sh |
| CS-003 | セッション終了時に git diff 確認・Issue コメント・commit・push する | CLI自律 | — | セッション終了時 | `CLAUDE.md` §セッション終了時 | hook: — |
| CS-004 | state.md / backlog.md 書き換え時に lock 取得→読込→更新→解放する | CLI自律 | — | state 更新時 | `.claude/rules/state-sync.md`, `.claude/rules/session-management.md` | hook: state-lock-guard.sh |
| CS-005 | セッションログを `.cache/session/log-{YYYYMMDD}-{seq}.md` に作成する | CLI自律 | — | セッション終了時 | `.claude/rules/session-management.md` | hook: — |
| CS-006 | handoff ファイルの命名・確認・読了追記・archive ルールを守る | CLI自律 | — | セッション開始時 / handoff 読了時 | `.claude/rules/session-management.md` | hook: — |
| CS-007 | compaction 後はタスクプラン再読・作業中ファイル再読・仮定禁止を実行する | CLI自律 | — | compaction 後 | セッション運用の一般原則 | hook: — |
| CS-008 | DIC（成果品整合性チェック）をセッション開始時とコミット時に実行する | CLI自律 | — | セッション開始時 / コミット時 | `.claude/rules/session-management.md` | hook: — |

### state.md / backlog.md 同期

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-009 | Issue 起票と backlog.md 更新は同一ターンで実行する（分離禁止） | CLI自律 | — | Issue 起票時 | `.claude/rules/state-sync.md` | hook: issue-sync-guard.sh |
| CS-010 | commit & push 後に state.md の HEAD SHA を更新する | CLI自律 | — | push 後 | `.claude/rules/state-sync.md` | hook: — |
| CS-011 | タスク完了時に state.md から削除し backlog.md に完了フラグを立て Issue にコメントする | CLI自律 | — | タスク完了時 | `.claude/rules/state-sync.md` | hook: issue-sync-guard.sh |
| CS-012 | 外部エージェント並行実行の開始時に state.md の「外部エージェント待ち」に登録する | CLI自律 | — | Agent 投入時 | `.claude/rules/state-sync.md` | hook: — |
| CS-013 | 外部エージェント完了時に投入側が state.md / backlog.md を更新する（Agent は state.md を操作しない） | CLI自律 | — | Agent 完了時 | `.claude/rules/state-sync.md` | hook: — |

### Git・コミット

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-014 | 通常作業は develop。main は GitHub Pages 公開用で直接 push しない | CLI自律 | — | push 時 | `CLAUDE.md`, `.claude/rules/commit-rules.md` | hook: — |
| CS-015 | コミットメッセージは `{type}: {summary}` + `Co-Authored-By` | CLI自律 | — | コミット時 | `CLAUDE.md`, `.claude/rules/commit-rules.md` | hook: — |
| CS-016 | push 前に `git status` / `git diff --stat` / `git pull --rebase` を実行する | CLI自律 | — | push 前 | `CLAUDE.md`, `.claude/rules/commit-rules.md` | hook: — |
| CS-017 | `git add` するファイルが実際に存在することを確認する（DIC） | CLI自律 | — | コミット時 | `.claude/rules/commit-rules.md` | hook: — |
| CS-018 | wt/{slug} ブランチは develop から分岐し、マージ後に削除する | CLI自律 | — | ワークツリー使用時 | `.claude/rules/commit-rules.md`, `.claude/rules/parallel-worktree.md` | hook: — |

### Agent 運用

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-019 | Agent 起動時に下流消費者リストと完了処理をプロンプトに含める | CLI自律 | — | Agent 起動時 | `.claude/rules/agent-completion.md` | hook: — |
| CS-020 | Agent 完了報告を Read/Grep で検証し、Issue コメント・backlog を同一ターンで処理する | CLI自律 | — | Agent 完了時 | `.claude/rules/agent-completion.md` | hook: — |
| CS-021 | Agent は state.md / backlog.md を操作しない。投入側の責務 | CLI自律 | — | Agent 実行中 | `.claude/rules/agent-completion.md`, `.claude/rules/state-sync.md` | hook: — |
| CS-022 | エージェント指示は中立的な表現で記述する（忖度誘導を避ける） | CLI自律 | — | 指示書作成時 | `.claude/rules/agents.md` | hook: — |
| CS-023 | Agent-WT 起動時は max_turns を必ず設定する（フリーズ防止） | CLI自律 | — | Agent-WT 起動時 | `.claude/rules/parallel-worktree.md` | hook: — |
| CS-024 | ファイル所有権を宣言し、1ファイルを同時に2レーンが編集しない | CLI自律 | — | Agent 振り分け時 | `.claude/rules/parallel-worktree.md` | hook: — |
| CS-025 | 共有禁止ファイル（CLAUDE.md, .claude/rules/*, state.md, backlog.md）は Main のみ編集 | CLI自律 | — | Agent 実行中 | `.claude/rules/parallel-worktree.md` | hook: — |

### 破壊的変更

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-026 | 破壊的変更の前に下流消費者を列挙し影響範囲を評価する | CLI自律 | — | フィールド名・構造変更時 | `.claude/rules/breaking-change-checklist.md` | hook: — |
| CS-027 | 破壊的変更と下流の修正は同一コミットまたは同一 Agent タスクで行う | CLI自律 | — | 破壊的変更時 | `.claude/rules/breaking-change-checklist.md` | hook: — |

### 読込・参照

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-028 | inbox ファイルを参照するときはフルパスを使う | CLI自律 | — | inbox 参照時 | セッション管理の一般原則 | hook: read-path-guard.sh |
| CS-029 | タスク種別対応表に従って関連 docs を読む | CLI自律 | — | タスク着手時 | `.claude/rules/docs-navigator.md` | hook: read-path-guard.sh |
| CS-030 | 大きなファイルは全文読まずセクション指定で読む。CLAUDE.md が常に優先 | CLI自律 | — | docs 読込時 | `.claude/rules/docs-navigator.md` | hook: read-path-guard.sh |
| CS-031 | 参照・判断時にファイルを実際に読んでいるか（読了なき参照の防止） | CLI自律 | — | ファイル参照時 | 品質原則 | hook: — |

### 品質チェック

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-032 | レイヤ分離: 調査事実 / 解釈 / 仮説を混在させない | CLI自律 | オーナー | テキスト生成時 | `docs/quality-management.md` #1 | hook: — |
| CS-033 | 牽強付会チェック: 表面的な類似だけで構造対応を主張しない | CLI自律 | オーナー | 調査・レポート時 | `docs/quality-management.md` #2 | hook: — |
| CS-034 | 出自明示: AI 生成と人間判断を区別できるか | CLI自律 | — | テキスト生成時 | `docs/quality-management.md` #3 | hook: — |
| CS-035 | 情報一元化: 同じ情報が複数箇所に存在しないか（正本 + リンク） | CLI自律 | — | ファイル作成・更新時 | `docs/quality-management.md` #4 | hook: — |
| CS-036 | OPS（運用整合性テスト）: 新規作成時に OPS-1〜OPS-5 を確認する | CLI自律 | — | 新規ファイル作成時 | `docs/quality-management.md` §3 | hook: — |
| CS-037 | 人間レビュー: 公開前に pjdhiro が方針・公開判定を確認する | オーナー | — | 公開前 | `docs/quality-management.md` #6 | hook: — |
| CS-038 | コミット前チェック: diff 確認・品質チェック・Co-Authored-By・管理書類整合 | CLI自律 | — | コミット前 | `docs/quality-management.md` §4 | hook: — |
| CS-039 | 成果物にタイトル・日付・著者が明記され、管理用情報が混入していないか | CLI自律 | — | PDF/レポート作成時 | `docs/quality-management.md` §5 | hook: — |

### CSS・デザインシステム

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-040 | CSS 変更前に docs/design-system.md と dev-components.html を読む | CLI自律 | — | CSS 変更時 | `CLAUDE.md` §CSS変更時のルール | hook: design-system-guard.sh |
| CS-041 | CSS 変更後に dev-components.html の該当コンポーネントも更新する | CLI自律 | — | CSS 変更後 | `CLAUDE.md` §CSS変更時のルール | hook: design-system-guard.sh |

### メモリ・状態管理

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-042 | CLI メモリと .cache/ に同じ情報を書かない（重複禁止） | CLI自律 | — | メモリ書き込み時 | `.claude/rules/memory-policy.md` | hook: — |
| CS-043 | CLI メモリにはコード構造・ファイルパス・Git 履歴・セッション状態を書かない | CLI自律 | — | メモリ書き込み時 | `.claude/rules/memory-policy.md` | hook: — |

### 教訓管理

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-044 | 教訓候補を検知したら `docs/lessons/` に CL-NNN で記録する | CLI自律 | — | 予期せぬ失敗・発見時 | `CLAUDE.md` §教訓記録, `docs/lessons/INDEX.md` | hook: — |
| CS-045 | 対策をルール・ワークフローに反映（infusion）したら状態を `infused` に更新する | CLI自律 | — | infusion 実施時 | `CLAUDE.md` §教訓記録 | hook: — |

### セキュリティ・保護

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-046 | 機密情報（トークン、キー、パスワード等）をファイル操作で参照・漏洩しない | hook | — | ファイル読み書き時 | セキュリティ原則 | hook: credential-guard.sh |
| CS-047 | Bash コマンドで外部へのデータ送信（curl --data 等）を検知・防止する | hook | — | Bash 実行時 | セキュリティ原則 | hook: exfil-guard.sh |

### 指示書

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-048 | 指示書（_instructions-*.md）の編集時に前提条件を満たしているか確認する | hook | CLI自律 | 指示書 Edit/Write 時 | 指示書運用規約 | hook: instruction-prereq-guard.sh |
| CS-049 | 指示書の lint チェック（構造・必須フィールドの検証） | hook | CLI自律 | 指示書 Edit/Write 後 | 指示書運用規約 | hook: instruction-lint.sh |

### プロジェクト構造

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-050 | ディレクトリ構成とデータフローは project-structure.md に従う | CLI自律 | — | ファイル作成・移動時 | `.claude/rules/project-structure.md` | hook: — |
| CS-051 | docs/ には管理書類・ナレッジ・リファレンスのみ。調査原本は evidence/ に置く | CLI自律 | — | ファイル配置時 | `docs/README.md` §docs/ のスコープ | hook: — |

### 設計原則（参照用）

| CS-ID | ルール要旨 | 守護者（主） | 守護者（副） | チェックタイミング | 正本 | hook coverage |
|---|---|---|---|---|---|---|
| CS-052 | L1 認知的継続性: 前セッションの決定と文脈を引き継ぐ | CLI自律 | — | セッション開始・終了時 | `docs/README.md` §6 | hook: — |
| CS-053 | L2 判断権限の明示: 人間と AI の能力境界を設計レベルで宣言する | オーナー | CLI自律 | 権限判断時 | `docs/README.md` §6 | hook: — |
| CS-054 | L3 文脈圧縮: docs/README.md をハブとした段階的ロード | CLI自律 | — | ファイル読込時 | `docs/README.md` §6 | hook: — |
| CS-055 | L4 品質の構造保証: 品質基準をルールファイルに埋め込む | CLI自律 | — | ルール変更時 | `docs/README.md` §6 | hook: — |
| CS-056 | L5 忖度耐性: AI が指示に合わせて結論を歪めない | CLI自律 | オーナー | 指示・レビュー時 | `docs/README.md` §6 | hook: — |
| CS-057 | L7 冗長性による耐性: ルールを踏まれる全入口に配置する | CLI自律 | — | ルール追加時 | `docs/README.md` §6 | hook: — |

## hook カバレッジサマリ

| hook スクリプト | カバー CS-ID | トリガー |
|---|---|---|
| `session-start-guard.sh` | CS-001, CS-002 | SessionStart |
| `state-lock-guard.sh` | CS-004 | PreToolUse(Edit/Write), Stop |
| `issue-sync-guard.sh` | CS-009, CS-011 | PostToolUse(Bash), Stop |
| `read-path-guard.sh` | CS-028, CS-029, CS-030 | PreToolUse(Read/Glob/Grep/Bash), PostToolUse(Read) |
| `credential-guard.sh` | CS-046 | PreToolUse(Read/Glob/Grep/LS/Bash) |
| `exfil-guard.sh` | CS-047 | PreToolUse(Bash) |
| `design-system-guard.sh` | CS-040, CS-041 | PostToolUse(Edit/Write) |
| `instruction-prereq-guard.sh` | CS-048 | PreToolUse(Edit/Write) |
| `instruction-lint.sh` | CS-049 | PostToolUse(Edit/Write) |

## 更新履歴

| 日付 | バージョン | 内容 |
|---|---|---|
| 2026-03-16 | 1.0 | 初版。CLAUDE.md / .claude/rules/ / docs/ から57件のルールを抽出 (cs#67) |
