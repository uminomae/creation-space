# docs/ ナビゲータ — タスク種別に応じた参照ガイド

CLI は docs/ を自動読み込みしない。以下の対応表に従い、タスクに関連するファイルを `Read` で読むこと。

## タスク種別 → 参照すべきファイル

| タスク | 必読ファイル | 理由 |
|--------|-------------|------|
| UI / Reports 変更 | `src/reports.js`, `evidence/investigations/investigation-cs23-categorize.md` | Reports UI 構造と設計判断 |
| CSS 変更 | `docs/design-system.md`, `dev-components.html` | デザインシステムとコンポーネント一覧 |
| 調査方針の確認 | `evidence/PROJECT.md` | プロジェクト憲章・5段階モデル・進捗 |
| 領域レポート再生成 | `transform/domains/README.md`, `transform/domains/reader-rules/reader-rules-creation-report.md` | 再生成 workflow と生成ルール |
| レポート品質レビュー | `transform/domains/quality-test/quality-test-domain-report.md` | レビュー評価基準 |
| KB 更新 | `knowledge/README.md`, `knowledge/schema/five-stages.md` | KB 構造と schema 定義 |
| evidence metadata 操作 | `docs/evidence-metadata-creation.md` | 公開ラベル taxonomy と generator_model |
| ファイル構造の変更・新規作成 | `docs/operations/project-structure.md` | ディレクトリ構成・データフロー |
| commit・push | `.claude/rules/commit-rules.md` | コミットメッセージと push 前チェック |
| 管理体系の更新 | `CLAUDE.md`, `.claude/rules/commit-rules.md`, `docs/operations/project-structure.md` | 管理文書の正本群 |
| プロジェクト全体の状況把握 | `docs/README.md` | エントリーポイント（管理ハブ） |
| 解説書(guides)の生成・更新 | `transform/guides/WORKFLOW.md`, `transform/guides/reader-rules/evidence-constraint.md`, `transform/guides/quality-test/quality-test-guide.md` | ガイド生成ワークフロー、evidence 制約、品質テスト |
| Cowork セッション作業 | `docs/operations/cowork-session.md`, `docs/operations/cowork-output.md` | VM 制約と出力先ルール |
| エージェント運用 | `docs/operations/agents.md` | 標準エージェント・中立性原則・敵対パターン |
| メモリ管理 | `docs/operations/memory-policy.md` | CLI メモリと .cache/ の棲み分け |

## 読み方の原則

- **全文読みは避ける**: 大きなファイルはセクション指定で読む
- **CLAUDE.md が常に優先**: docs/ と CLAUDE.md が矛盾したら CLAUDE.md に従う
- **判断に迷ったら**: `docs/README.md` の該当セクションを読む
