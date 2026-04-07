> **正本移転**: このディレクトリの正本は `pjdhiro/assets/creation/kb/` に移行しました。
> このコピーは参照互換のために残しています。

# knowledge/ — ナレッジベース

## 5W1H

- **What**: 創造モデルに関するナレッジベースです。スキーマ定義、領域別レポート、公開用正本を格納します。
- **Why**: 調査結果と理論定義を一箇所に集約し、外部からの参照先として機能させるためです。
- **Who**: 読者（LLM・人間）、レポート生成 CLI、公開ワークフローが参照します。
- **When**: レポート生成時、公開物の配置時、定義の参照時に使います。
- **Where**: creation-space/knowledge/
- **How**: reader-rules が定義参照先として指定し、生成物の配置先としても使います。

## 役割分離

| ディレクトリ | 役割 |
|---|---|
| **knowledge/** | ナレッジベース。知識の実体（定義・レポート・公開正本） |
| **evidence/** | 調査の生データ（30領域の evidence-D*.md） |
| **transform/** | 変換ワークフロー（reader-rules、quality-test） |
| **docs/** | プロジェクト管理（運用ルール、管理書類） |

## ディレクトリ構成

| パス | 内容 |
|---|---|
| `schema/` | 創造モデルのスキーマ定義。レポート生成時の参照正本 |
| `domains/` | 領域別調査レポート（日英。D23 等） |
| `raw/` | 原典 PDF と access 状況の追跡場所。原典未確認の生成物は暫定扱いとし、探索進展に応じて更新する |
| `glossary.md` | 用語集。5段階モデルと関連概念の定義 |
| `five-stages-guide.md` | 5段階モデル解説。各段階の読み方・遷移条件・よくある誤読 |

## 収録状況

- `schema/five-stages.md` — 5段階の定義テーブル + 各段階の詳細 + 対応概念
- `schema/academic-domains.md` — D01-D30 の全学問領域マスターリスト
- `domains/D23-developmental-psychology/ja/report.md` — 発達心理学レポート（日本語）
- `domains/D23-developmental-psychology/en/report.md` — Developmental psychology report (English)
- `glossary.md` — 用語集（5段階モデル用語 + 関連概念 + 調査用語）
- `five-stages-guide.md` — 5段階モデル解説（全体像・遷移条件・よくある誤読）

## 外部ユーザー向け: 推奨読み順

このナレッジベースを初めて利用する場合、以下の順序で読むことを推奨します。

1. **[llms.txt](../llms.txt)** — 安全ガイダンス（§1-§3）を確認し、LLM への防御指示を設定する
2. **[five-stages-guide.md](five-stages-guide.md)** — 5段階モデル（場→波→縁→渦→束）の全体像、各段階の読み方、遷移条件、よくある誤読を把握する
3. **[glossary.md](glossary.md)** — 用語の定義を確認する。モデル固有の用語（場・波・縁・渦・束）や調査用語の意味を正確に理解する
4. **興味ある領域のレポート** — [evidence/](../evidence/) から自分の専門や関心に近い領域を選び、具体的な構造類似の分析例を読む
5. **[llms-full.txt](../llms-full.txt)** — 全30領域レポートと横断分析テーマへのリンク一覧。LLM に読ませる場合はこちらを参照

## 移行状態

正本は `pjdhiro/assets/creation/kb/` に移行済み（#218）。
このディレクトリは参照互換のために残存。
