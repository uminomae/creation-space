# knowledge/schema/ — 創造モデルのスキーマ定義

## 5W1H

- **What**: 創造モデルの主要スキーマ定義を格納するディレクトリです。
- **Why**: レポート生成時に LLM が定義を再発明しないよう、参照すべき正本を一箇所に置くためです。
- **Who**: レポートを生成する CLI と、reader-rules から参照されます。
- **When**: レポート生成時に §3（モデルの概要）を書くとき、このディレクトリの定義から要約します。
- **Where**: creation-space/knowledge/schema/
- **How**: reader-rules や関連ドキュメントが `knowledge/schema/` 配下を参照し、モデル定義と領域マスターを共有します。

## 移行状態

kesson-driven-thinking/base/schema/ からの移植は完了。
`five-stages.md` と `academic-domains.md` の正本をこのディレクトリに集約した。

## ファイル

| ファイル | 内容 |
|---|---|
| `five-stages.md` | 5段階の定義テーブル + 各段階の詳細 + 対応概念 |
| `academic-domains.md` | D01-D30 の全学問領域マスターリスト |

## 更新方針

- 調査（evidence）の進展に合わせて定義を精緻化する
- 更新は pjdhiro の判断に基づく（pjdhiro専権）
- LLM が独自に定義を書き換えない
