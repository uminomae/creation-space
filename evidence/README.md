# evidence/ -- 30領域構造類似調査データ

**目的**: 30領域の構造類似調査で得られた evidence、本格調査の一次ソース、深掘り探索、レビュー素材を格納する。

このディレクトリは、欠損駆動思考プロジェクトにおける構造類似探索の主データ置き場である。個別領域の evidence 本体に加え、深掘り探索、レビュー、一次ソース、退避アーカイブを分けて保持する。

## 移動経緯

このディレクトリは 2026-03-10 に `kesson-driven-thinking/base/evidence/` から移動した。
理由は、creation-space を「創造モデルの独立モジュール」として切り出し、Three.js アプリケーションと根拠データを同じリポジトリで扱えるようにするためである。

元リポジトリでは `kesson-driven-thinking` #61（全分野構造類似探索）と #62（30領域本格調査）の中核データとして管理されていた。

## 5W1H

### What

30領域の調査結果、Deep Research 一次ソース、deepdive 出力、レビュー成果、中間素材を含む evidence データ群。

### Why

creation-space が表示する「調査内容」や、創造モデルの構造比較の根拠を独立して保持するため。

### Who

pjdhiro、Claude、Codex、および creation-space の REPORTS / evidence 閲覧者が使う。

### When

調査は 2026-02 に開始し、2026-03-10 に creation-space へ移動した。

### Where

現在地は `creation-space/evidence/`。
移動元は private repo `kesson-driven-thinking/base/evidence/`。

### How

幅優先スキャン → 本格調査 → GPTレビュー → deepdive → 横断分析という順で増築されてきた。
正本の schema は引き続き `kesson-driven-thinking/base/schema/` 側に置く。

## ⚠️ evidence-D*.md を編集・Revise する前に

`evidence/evidence-D{NN}-*.md` を Revise（既存エントリの書き換え・削除・大幅追記）する場合、
**必ず事前に archive コピーを作成すること**。

- **ルール詳細**: `docs/operations.md §3.2.1`
- **archive 場所と命名**: `archive/README.md`
- **CLI 指示書には必ず以下を含めること**:

```bash
cp evidence/evidence-D{NN}-{slug}.md \
   evidence/archive/evidence-D{NN}-pre-revise-{YYYYMMDD}.md
```

- archive コピーと Revise 本体は **同一コミットに含める**

## 含まれるもの

| パス | 役割 |
|------|------|
| `evidence-D*.md` | 30領域の個別 evidence 本体 |
| `PROJECT.md` | 全分野構造類似探索サブプロジェクトの憲章 |
| `iss62-sources/` | #62 本格調査で収集した一次ソース |
| `deepdive/` | Level 2 evidence を壊さずに深掘り探索を行う分離領域 |
| `review/` | 横断分析、計画書、レビュー成果 |
| `archive/` | Revise 前スナップショットや退避資料 |
| `work/` | 作業中の中間ファイル |
| `INSIGHTS.md` | deepdive・P1横断洞察の索引 |

## 参照（ルール・正本・関連 Issue）

- [PROJECT.md](/Users/uminomae/dev/creation-space/evidence/PROJECT.md)
- [deepdive/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/README.md)
- [iss62-sources/README.md](/Users/uminomae/dev/creation-space/evidence/iss62-sources/README.md)
- [archive/README.md](/Users/uminomae/dev/creation-space/evidence/archive/README.md)
- [evidence-metadata.md](/Users/uminomae/dev/kesson-driven-thinking/base/schema/evidence-metadata.md)
- `kesson-driven-thinking` #61
- `kesson-driven-thinking` #62
- `kesson-driven-thinking` #166
- `kesson-driven-thinking` #180

## 文脈

- 親ディレクトリ: [base/README.md](/Users/uminomae/dev/kesson-driven-thinking/base/README.md)
- 関連 Issue: #61, #62, #120, #166, #180

`PROJECT.md` はサブプロジェクト憲章であり、この README はディレクトリ案内を担う。役割を分けて参照すること。
`evidence-metadata.md` の正本は creation-space ではなく `kesson-driven-thinking/base/schema/evidence-metadata.md` にある。
