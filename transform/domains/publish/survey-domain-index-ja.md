---
id: survey-domain-index-ja-v1
title: "構造類似調査 学術分冊PDFインデックス"
lang: ja
version: 1.1
date: 2026-03-04
generator_model: GPT-5 Codex (OpenAI)
generated_at: 2026-03-04
---

# 構造類似調査 学術分冊PDFインデックス

> LLMモデル: GPT-5 Codex (OpenAI)

## 使い方

- 本インデックスは、進捗報告（横断版）から分野詳細へ飛ぶための参照表です。
- 分冊は**学術版のみ**を対象とします。
- 学術分冊PDFは `creation-space/assets/reports/issue62/domains/` に配置します。

## 変換層の標準文書（新設）

| 文書 | 用途 |
|---|---|
| `transform/domains/reader-rules/reader-rules-creation-report.md` | 各領域分冊の変換ルール正本 |
| `transform/domains/publish/survey-research-bridge-ja.md` | 研究結果を上位プロジェクトへ接続するメタ台帳 |
| `transform/domains/publish/survey-status-ja.md` | 横断ハブ（進捗・運用方針） |

## 重点5分野（優先作成）

| 分野 | 想定ファイル名 | 主参照 |
|---|---|---|
| 西洋哲学 | `creation-domain-D13-philosophy-academic-ja.pdf` | `DR-D13-philosophy.md` |
| 東洋思想 | `creation-domain-D13-east-thought-academic-ja.pdf` | `DR-D13-philosophy.md`（東洋思想抽出） |
| 心理学（ビオン） | `creation-domain-D14-psychology-bion-academic-ja.pdf` | `DR-D14-psychology.md` + 臨床系参照 |
| 経営学（タックマン・チーム発達） | `creation-domain-D22-business-management-academic-ja.pdf` | `DR-D22-business-management.md` |
| 物理学（QFT） | `creation-domain-D02-physics-academic-ja.pdf` | `DR-D02-physics.md` |

## 作成済み（JA）

- `domain-D22-business-management-academic-ja.md`
- `domain-D02-physics-academic-ja.md`
- `creation-domain-D22-business-management-academic-ja.pdf`

## 全領域（D01-D30）テンプレ

命名規則:

`creation-domain-D{nn}-{slug}-academic-ja.pdf`

例:

- `creation-domain-D01-mathematics-academic-ja.pdf`
- `creation-domain-D02-physics-academic-ja.pdf`
- `creation-domain-D22-business-management-academic-ja.pdf`
