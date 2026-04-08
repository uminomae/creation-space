# 類似論文メタデータ

**起点 Issue**: cs#214
**目的**: 創造の5段階モデルと構造類似する論文を、既存 source とは別に探索・管理する

## 採用基準

- 創造モデル（場→波→縁→渦→束）のいずれかの段階・構造と類似する論の展開を持つこと
- 既存 source となるべく無関係な趣旨であること（ばらつきへの配慮）
- OA でアクセス可能であることが望ましい（必須ではない）

## 分類タグ

| タグ | 意味 |
|------|------|
| `alternative` | 既存 source への代替。同一テーマで OA 取得可能な別論文 |
| `new` | 既存 source にない新規の構造類似論文 |

## Source ID 規則

既存 manifest の連番を継続する。例: D18 の既存が S01-S04 なら、新規は D18-S05 から。
manifest.md 本体に追加し、備考欄に `[similar-papers]` タグを付与する。

## 構造類似性の記述

各論文について、five-stages モデル（knowledge/schema/five-stages.md）との対応を記述する。

| フィールド | 説明 |
|-----------|------|
| source_id | D{NN}-S{NN} |
| domain | D{NN} |
| title | 論文タイトル |
| tag | `alternative` / `new` |
| replaces | alternative の場合、代替先の既存 Source ID。new の場合は `—` |
| stage_affinity | 最も対応する段階（1-5）と対応の概要 |
| oa_url | OA URL（発見した場合） |
| access_status | `raw-confirmed` / `url-verified` / `citation-only` |

## 探索対象領域（優先順: アクセス率が低い領域）

| 領域 | 分野 | 現アクセス率 | 不足本数 |
|------|------|------------|---------|
| D18 | 社会学 | 1/8 (12%) | 7 |
| D27 | 建築 | 1/7 (14%) | 6 |
| D28 | 舞台芸術 | 1/7 (14%) | 6 |
| D17 | 言語学 | 2/11 (18%) | 9 |
| D26 | 音楽学 | 2/11 (18%) | 9 |
| D19 | 文学研究 | 1/5 (20%) | 4 |
| D14 | 心理学 | 2/9 (22%) | 7 |
| D03 | 化学 | 2/8 (25%) | 6 |
| D24 | 宗教学 | 3/11 (27%) | 8 |

## 発見ログ

### 2026-04-09 Batch A+B (低率 9 領域)

24本発見、全て `url-verified`。Unpaywall / archive.org で OA 確認済み。

| source_id | tag | stage | 概要 |
|-----------|-----|-------|------|
| D03-S05 | alternative | 2-4 | Turing 1952 (Caltech ミラーで OA 確認) |
| D03-S11 | new | 3-4 | Pearson 1993, Gray-Scott パターン |
| D03-S12 | new | 1-5 | Thompson 1917, On Growth and Form |
| D14-S03 | new | 2-4 | Dewey 1910, How We Think |
| D14-S04 | new | 1-3 | James 1890, Principles of Psychology |
| D17-S11 | new | 3 | Beckner+ 2017, iterated learning |
| D17-S12 | new | 2-3 | Kirby+ 2008, 実験的言語進化 |
| D17-S13 | new | 3-4 | Raviv+ 2020, 社会ネットワーク×言語構造 |
| D18-S05 | new | 4 | Anzola+ 2016, 社会の自己組織化 |
| D18-S06 | new | 3 | Barabasi-Albert 1999, スケールフリー |
| D18-S07 | new | 5 | Bettencourt+ 2007, 都市スケーリング |
| D19-S11 | new | 1-5 | Freytag 1863, 物語の5段階 |
| D19-S12 | new | 2-4 | Aristotle, Poetics |
| D19-S13 | new | 3-4 | Polti 1895, 36 Dramatic Situations |
| D24-S11 | new | 1-4 | James 1902, Varieties of Religious Experience |
| D24-S12 | new | 1-2 | Otto 1917, Idea of the Holy |
| D24-S13 | new | 2-4 | Starbuck 1911, Psychology of Religion |
| D26-S12 | new | 2-4 | Limb-Braun 2008, ジャズ即興fMRI |
| D26-S13 | new | 5 | Serra+ 2012, 音楽進化定量分析 |
| D26-S14 | new | 1-2 | Wu+ 2009, 脳のスケールフリー音楽 |
| D27-S11 | new | 3 | Salingaros 1999, 建築パターン数理 |
| D27-S12 | new | 4 | Moroni+ 2019, 都市自己組織化 |
| D28-S11 | new | 4 | Sawyer 2026, 即興劇の集団創発 |
| D28-S12 | new | 2 | McNeilly 2022, 即興の不確定性 |
| D28-S13 | new | 1-4 | Randazzo 2026, ダンス即興の創発 |
