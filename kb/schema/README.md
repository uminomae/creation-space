# kb/schema/ — 5段階モデルのスキーマ定義

## 5W1H

- **What**: 創造の5段階（場→波→縁→渦→束）のスキーマ定義を格納するディレクトリです。
- **Why**: レポート生成時に LLM が定義を再発明しないよう、参照すべき正本を一箇所に置くためです。
- **Who**: レポートを生成する CLI と、reader-rules から参照されます。
- **When**: レポート生成時に §3（モデルの概要）を書くとき、このディレクトリの定義から要約します。
- **Where**: creation-space/kb/schema/
- **How**: reader-rules が「kb/schema/five-stages.md を参照して要約せよ」と指定します。

## 移行状態

kesson-driven-thinking/base/schema/ から段階的に移植中。
現時点では five-stages.md のみ。今後 academic-domains.md 等も移植予定。

## ファイル

| ファイル | 内容 |
|---|---|
| `five-stages.md` | 5段階の定義テーブル + 各段階の詳細 + 対応概念 |

## 更新方針

- 調査（evidence）の進展に合わせて定義を精緻化する
- 更新は pjdhiro の判断に基づく（pjdhiro専権）
- LLM が独自に定義を書き換えない
