# gpt-deep-research/ — 2026-02 30領域 Deep Research 一次ソース

**用途**: 30領域構造類似調査で収集した GPT Deep Research 一次ソース
**作成**: 2026-02-24
**改名**: 2026-03-10

## 文脈

旧ディレクトリ名 `iss62-sources/` は他リポジトリ側の内部名だった。
その後、日付入りの暫定名称を経て、現在は用途がより直接分かる `gpt-deep-research/` を採用している。

このディレクトリの中身は、30領域それぞれに対して行った ChatGPT Deep Research の一次ソースであり、`evidence-D*.md` に蒸留される前の詳細出力を保持する。

## 目的

2026-02 に実施した各領域のディープリサーチ（主に ChatGPT）の出力原文を一次ソースとして格納する。

evidence-*.md のEVエントリは蒸留された要約であり、本ディレクトリの原文が詳細の参照先となる。

**ルール**: 全30領域でGPTディープリサーチを実施し、一次ソースを格納する。

## 命名規則

```
DR-D{NN}-{slug}.md
```

- DR = Deep Research
- D{NN} = academic-domains.md のドメイン番号
- {slug} = 英語ドメイン名

## ヘッダー書式

全DRファイルは、調査ロット、使用モデル、レビュー担当、指示書、GPT出力への参照を含む。モデル名の記載は必須（evidence-metadata.md §9）。

```markdown
# DR-D{NN}-{slug}.md - D{NN} {領域名} ディープリサーチ一次ソース

**調査ロット**: 2026-02 30domains Deep Research
**ソース**: ChatGPT Deep Research / {モデル名} ({日付})
**レビュー**: Claude / {モデル名} ({日付})
**指示書**: `chatgpt/inbox/{ファイル名}`
**GPT出力**: `chatgpt/output/{ファイル名}`
```

モデル名が不明な場合は `unknown` と記載する。
メタ情報ルールの正本は [evidence-metadata.md](/Users/uminomae/dev/kesson-driven-thinking/base/schema/evidence-metadata.md) を参照。

## 進捗管理（30領域全件）

全領域でGPTディープリサーチを実施し、一次ソースを格納する。

| D# | 領域 | 指示書 | GPT出力 | レビュー | DRファイル |
|----|------|--------|---------|---------|----------|
| D01 | 数学 | ✅ | ✅ | ✅ Accept 2, CA 1 | DR-D01-mathematics.md |
| D02 | 物理学 | ✅ v2 | ✅ v2 | ✅ Accept 3 (v1 reject→v2大幅改善) | DR-D02-physics.md |
| D03 | 化学 | ✅ v2 | ✅ v2 | ✅ Accept 3 (核生成🟡, 触媒サイクル🟡, ミクロ相分離🔴) | DR-D03-chemistry.md |
| D04 | 進化生物学 | ✅ | ✅ | ✅ Accept 10, CA 5 | DR-D04-evolutionary-biology.md |
| D05 | 地球科学 | ✅ | ✅ | ✅ Accept 3 | DR-D05-earth-science.md |
| D06 | 天文学 | ✅ | ✅ | ✅ Accept 3 | DR-D06-astronomy.md |
| D07 | 工学情報 | ✅ v2 | ✅ v2 | ✅ Accept 3 | DR-D07-engineering.md |
| D08 | 神経科学 | ✅ | ✅ | ✅ Accept 2, CA 1 | DR-D08-neuroscience.md |
| D09 | 生命科学 | ✅ | ✅ | ✅ Accept 3 | DR-D09-life-sciences.md |
| D10 | 臨床免疫 | ✅ | ✅ | ✅ Accept 1, CA 2 | DR-D10-clinical-medicine.md |
| D11 | 薬学 | ✅ v2 | ✅ v2 | ✅ Accept 3 | DR-D11-pharmacy.md |
| D12 | 農学生態 | ✅ v2 | ✅ v2 | ✅ Accept 3 (v1失敗→v2成功) | DR-D12-agriculture-ecology.md |
| D13 | 哲学 | ✅ | ✅ | ✅ Accept 2, CA 1 | DR-D13-philosophy.md |
| D14 | 心理学 | ✅ v3 | ✅ v3 | ✅ Accept 3 (v1-v2計3回失敗→v3成功) | DR-D14-psychology.md |
| D15 | 美学 | ✅ | ✅ | ✅ Accept 2, CA 1 | DR-D15-aesthetics.md |
| D16 | 歴史学 | ✅ v2 | ✅ v2 | ✅ Accept 3 | DR-D16-history.md |
| D17 | 言語学 | ✅ v2 | ✅ | ✅ Accept 3 | DR-D17-linguistics.md |
| D18 | 社会学 | ✅ v2 | ✅ v2 | ✅ Accept 3 (制度的同型化🟡, 社会構築主義🟡⚠️同時並行性, 社会運動🟡) | DR-D18-sociology.md |
| D19 | 文芸学 | ✅ v2 | ✅ | ✅ Accept 3 | DR-D19-literary-studies.md |
| D20 | 法学・政治学 | ✅ | ✅ | ✅ Accept 3 (憲法制定🟡, 多層ADR🟡, 国際レジーム🟡) | DR-D20-law-politics.md |
| D21 | 経済学 | ✅ | ✅ | ✅ Accept 3 (シュンペーター🟡, ミンスキー🔴, ノース🟡) | DR-D21-economics.md |
| D22 | 経営学 | ✅ | ✅ | ✅ Accept 3 (野中5フェーズ🟡, デザイン思考🟡⚠️保持論点, タックマン🟡) | DR-D22-business-management.md |
| D23 | 発達心理 | ✅ | ✅ | ✅ Accept 3 (キーガン🔴, ロシャ🟡, DIDS🟡) | DR-D23-developmental-psychology.md |
| D24 | 宗教学 | ✅ | ✅ | ✅ Accept 3 (ランボー回心🟡, 通過儀礼🟡, 霊魂の城🟡) | DR-D24-religious-studies.md |
| D25 | 人類学 | ✅ | ✅ | ✅ Accept 6, CA 6 | DR-D25-anthropology.md |
| D26 | 音楽学 | ✅ | ✅ | ✅ Accept 3 (ソナタ形式🟡, Meyer期待理論🔴, NHS🟡⚠️メタ) | DR-D26-musicology.md |
| D27 | 建築 | ✅ | ✅ | ✅ Accept 6, CA 10 | DR-D27-architecture-design.md |
| D28 | 舞台芸術 | ✅ | ✅ | ✅ Accept 3 (世阿弥芸道論🟡, 即興演劇🟡, Fischer-Lichte🟡) | DR-D28-performing-arts.md |
| D29 | 複雑系 | ✅ | ✅ | ✅ Accept 7, CA 2 | DR-D29-complexity-science.md |
| D30 | 伝統知 | ✅ | ✅ | ✅ Accept 3 (LPP🟡, 一座建立🟡, TEK🔴) | DR-D30-traditional-knowledge.md |

**✅ 全30領域完了 (30/30) — DRファイル全30件揃い ✅**

## 注意

- **output未保存（5件）**: D01, D04, D25, D27, D29 はチャット経由で受領し `chatgpt/output/` への生出力保存を省略。DRファイルに実質内容は保存済み。今後は計画書§4のワークフロー（output保存→レビュー→DR化）を遵守する。（2026-02-24記録）
- 全領域でGPTディープリサーチを実施する（プロジェクトルール）
- 新規ディープリサーチの出力は、Claudeレビュー完了後にここに昇格する
- 別バッチの深掘りは `YYYYMM-...` を先頭にした別ディレクトリとして分離する
