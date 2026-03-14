> **正本移転**: このディレクトリの正本は `pjdhiro/assets/creation/kb/` に移行しました。
> このコピーは参照互換のために残しています。

# kb/ — ナレッジベース

## 5W1H

- **What**: 創造モデルに関するナレッジベースです。スキーマ定義、領域別レポート、公開用正本を格納します。
- **Why**: 調査結果と理論定義を一箇所に集約し、外部からの参照先として機能させるためです。
- **Who**: 読者（LLM・人間）、レポート生成 CLI、公開ワークフローが参照します。
- **When**: レポート生成時、公開物の配置時、定義の参照時に使います。
- **Where**: creation-space/kb/
- **How**: reader-rules が定義参照先として指定し、生成物の配置先としても使います。

## 役割分離

| ディレクトリ | 役割 |
|---|---|
| **kb/** | ナレッジベース。知識の実体（定義・レポート・公開正本） |
| **evidence/** | 調査の生データ（30領域の evidence-D*.md） |
| **transform/** | 変換ワークフロー（reader-rules、quality-test） |
| **docs/** | プロジェクト管理（運用ルール、管理書類） |

## ディレクトリ構成

| パス | 内容 |
|---|---|
| `schema/` | 創造モデルのスキーマ定義。レポート生成時の参照正本 |
| `domains/` | 領域別調査レポート（日英。D23 等） |

## 収録状況

- `schema/five-stages.md` — 5段階の定義テーブル + 各段階の詳細 + 対応概念
- `schema/academic-domains.md` — D01-D30 の全学問領域マスターリスト
- `domains/D23-developmental-psychology/ja/report.md` — 発達心理学レポート（日本語）
- `domains/D23-developmental-psychology/en/report.md` — Developmental psychology report (English)

## 移行状態

正本は `pjdhiro/assets/creation/kb/` に移行済み（#218）。
このディレクトリは参照互換のために残存。
