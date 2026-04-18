# 原典精読プロトコル

**バージョン**: 1.0
**作成日**: 2026-04-10
**状態**: Pilot-1（D01）で検証中

---

## 1. 概要

原典（論文・書籍）を実際に読み、構造化された wiki を生成するプロトコル。
LLM の事前知識ではなく、原典の本文に基づいて 5 段階モデルとの対応を記述する。

---

## 2. パイプライン

### Step A: 個別論文の精読 → wiki 生成

**入力**: manifest.md の source 行 + PDF / URL
**出力**: `knowledge/source-notes/D{NN}/{source_id}_{著者}-{年}.md`

#### 2つの経路と wiki 生成のタイミング

| 経路 | 原典の場所 | wiki 生成 | 備考 |
|------|-----------|----------|------|
| **raw-confirmed** | `knowledge/raw/` に PDF 格納済み | cs#213 の hook で自動トリガー（将来）。現在は CLI が直接生成 | 手動 DL（cs#219）→ commit → hook → wiki 生成 |
| **url-verified** | Web 上の OA URL | CLI が WebFetch で読んでその場で wiki 生成（PDF の DL はしない） | WebFetch は読むだけ。DL しないため hook では検知できず、明示的な wiki 生成指示が必要 |

つまり:
- **raw-confirmed 経路**: PDF を DL → `knowledge/raw/` に配置 → commit hook で wiki 生成がトリガーされる（hook 実装後）
- **url-verified 経路**: PDF を DL しない。WebFetch で読むだけなので、wiki 生成には明示的な CLI 指示が必要。現在の D01→D02→... の順次処理はこの指示を行っている

手順:
1. `knowledge/raw/manifest.md` から対象 source の情報を取得
2. access_status に応じて原典を読む:
   - `raw-confirmed`: Read ツールで `knowledge/raw/` の PDF を読む（大きい場合は pages パラメータで分割）
   - `url-verified`: WebFetch で URL からテキストを取得（読むだけ。DL しない）
3. `templates/source-reading.md` に従って構造化抽出
4. 5 段階との対応候補を記入（原文引用必須）
5. 部分読解の場合、未読セクションを明記

### Step B: 領域まとめ wiki の生成

**入力**: `knowledge/source-notes/D{NN}/` 配下の全論文 wiki
**出力**: `knowledge/source-notes/D{NN}/D{NN}-summary.md`
**タイミング**: Step A が当該領域の全 readable source で完了した後

### Step C: 原典ベース構造類似分析

**入力**: wiki + `knowledge/schema/five-stages.md` + archive の旧分析（参照用）
**出力**: `evidence/evidence-D{NN}-*.md` の再構成（stub → 実データ）
**接続先**: `evidence/investigation/PROTOCOL.md` の Phase 9 検証の入力になる

---

## 3. 品質ルール

### 3.1 原文引用の義務

- 主要主張にはページ番号付きの原文引用を含める
- 5 段階との対応候補にも原文引用を含める
- 引用がない主張は wiki に含めない

### 3.2 事前知識の排除

- LLM が原典を読む前から知っている情報で wiki を補完しない
- 「読んだ内容に基づく」セクションでは、原典に書かれていないことは書かない
- 背景知識が必要な場合は §6（限界・留意事項）に注記する

### 3.3 対応なしの正直な記述

- 5 段階のうち対応が見つからない段階は「なし」と書く
- 全5段階に対応がある場合は、逆に牽強付会の疑いがあるため要注意
- 弱い対応は「弱」と明記し、強い対応と区別する

### 3.4 部分読解の透明性

- PDF が大きくて全ページ読めない場合、読んだページ範囲を明記
- 未読セクションを §7 に列挙する
- 部分読解であることは wiki の品質を下げない（正直に記述すればよい）

### 3.5 読解失敗の扱い

- url-verified で WebFetch が失敗した場合:
  - manifest.md の notes に「wiki生成時 WebFetch 失敗」を追記
  - wiki は生成しない（空ファイルを作らない）
  - 領域まとめの §4（ギャップ）に記載する

---

## 4. エージェント実行

### source-reader エージェント

- `.claude/agents/source-reader.md` に定義
- 1 回の起動で 1 論文を処理
- Read / WebFetch で原典を読み、テンプレートに従って wiki を生成
- ファイル編集権限あり（wiki ファイルの作成のみ）

### 指示書の形式

```
対象: {source_id} - {source_title}
原典: {local_file or URL}
テンプレート: knowledge/source-notes/templates/source-reading.md
出力先: knowledge/source-notes/D{NN}/{source_id}_{著者}-{年}.md
五段階定義: knowledge/schema/five-stages.md
品質ルール: knowledge/source-notes/READING-PROTOCOL.md §3
```

---

## 5. 既存インフラとの接続

| 既存インフラ | 接続方法 |
|---|---|
| `knowledge/raw/manifest.md` | source_id で 1:1 対応。wiki 生成後に notes 更新 |
| `knowledge/raw/*.pdf` | raw-confirmed の入力として Read で読む |
| `evidence/investigation/PROTOCOL.md` | Phase 9-2 の RAG 入力として wiki を使う |
| `transform/domains/reader-rules/` | Step C の出力を使ったレポート再生成時に適用 |
| `evidence/similar-papers/` | 類似論文も manifest 経由で同じパイプラインで処理 |
