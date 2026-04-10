# knowledge/wiki/ — 原典精読 wiki

## 背景とゴール

過去の調査は LLM の知識ベースに依存しており、原典を読んでいなかった。pjdhiro の判断で**原典精読ベースへ全面方針転換**した。このディレクトリは「原典を読む→wiki にまとめる」の成果物置き場である。

### パイプライン全体像

```
原典を探す → 原典を読む → wiki にまとめる → 原典ベースで構造類似分析
(knowledge/raw)  (本ディレクトリ)              (evidence/ 再構成)
```

### ゴール

全30領域の readable source について:
1. 原典を実際に読み、構造化された wiki を生成する（1論文=1ファイル）
2. 領域ごとの5段階対応マップを作成する
3. wiki と原文引用を根拠に、evidence を再構成する

### 現在地（2026-04-10）

- パイプライン設計完了。Pilot-1（D01）から着手
- 追跡 Issue: cs#217

## 構成

```
knowledge/wiki/
  README.md                  ← 本ファイル
  READING-PROTOCOL.md        ← 精読パイプライン仕様
  templates/
    source-reading.md        ← 個別論文 wiki テンプレート
    domain-summary.md        ← 領域まとめテンプレート
  D{NN}/
    {source_id}_{著者}-{年}.md  ← 1論文=1ファイル
    D{NN}-summary.md            ← 領域まとめ
```

## 命名規則

- 論文 wiki: `{source_id}_{著者姓}-{年}.md`（例: `D01-S01_bott-1988.md`）
- 領域まとめ: `D{NN}-summary.md`
- source_id は `knowledge/raw/manifest.md` と 1:1 対応

## 品質ルール（要約）

詳細は `READING-PROTOCOL.md` を参照。

- 原文引用にはページ番号を付ける
- LLM の事前知識で補完しない。読んだ内容だけ書く
- 5段階との対応がない段階は「なし」と明記。無理に作らない
- 「読めなかった」「対応が見つからなかった」は正直に書く
