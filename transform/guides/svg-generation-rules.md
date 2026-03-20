# SVG 生成ルール — 図解スタイルガイド (cs#136)

公開用 MD の内容を図解する SVG を生成する際のルール。

## 1. 基本仕様

| 項目 | 値 |
|------|-----|
| フォーマット | SVG 1.1 |
| エンコーディング | UTF-8 |
| 外部リソース | 不使用（1ファイル完結） |
| viewBox | 必須（固定 width/height は設定しない） |
| 推奨サイズ | viewBox="0 0 800 600" を基準に調整 |

## 2. カラーパレット

### メインカラー（5段階モデル対応）

| 段階 | 色名 | HEX | 用途 |
|------|------|-----|------|
| 場（Field） | ウォームグレー | #8B8682 | 背景・基盤 |
| 波（Wave） | ソフトブルー | #5B8DB8 | 動き・変化 |
| 縁（Edge） | アンバー | #D4A857 | 境界・接触 |
| 渦（Vortex） | ディープレッド | #C45B4D | 変容・臨界 |
| 束（Bundle） | フォレストグリーン | #5B8B6A | 統合・安定 |

### 補助カラー

| 用途 | HEX |
|------|-----|
| テキスト（本文） | #2C2C2C |
| テキスト（補助） | #666666 |
| 背景 | #FAFAF8 |
| ボーダー | #E0DDD8 |
| ハイライト | #FFF3CD |
| 弱い対応 | #D0D0D0 |

## 3. タイポグラフィ

### フォント指定

```xml
<\!-- 日本語テキスト -->
<text font-family="'Hiragino Sans', 'Noto Sans JP', sans-serif">

<\!-- 英語テキスト -->
<text font-family="'Inter', 'Helvetica Neue', sans-serif">

<\!-- コード・数式 -->
<text font-family="'Menlo', 'Consolas', monospace">
```

### フォントサイズ

| 要素 | サイズ |
|------|--------|
| タイトル | 24px |
| セクション見出し | 18px |
| ラベル | 14px |
| 本文 | 13px |
| 注釈 | 11px |

## 4. 図解の種類と使い分け

### 4.1 構造図（Structure Diagram）

5段階モデルと対象領域の構造対応を示す。

- 用途: domain MD の主要図解
- レイアウト: 左から右、または上から下の5段階フロー
- 各段階をカラーパレットで色分け
- 対応の強さを線の太さ・スタイルで表現
  - 強い対応: 実線 (stroke-width: 2)
  - 部分的対応: 破線 (stroke-dasharray: 6,3)
  - 弱い対応: 点線 (stroke-dasharray: 2,2) + 補助カラー

### 4.2 フロー図（Flow Diagram）

プロセスや変遷を示す。

- 用途: 理論間の因果関係、段階の進行
- レイアウト: 矢印で接続したノード群
- 矢印: stroke-width: 1.5, marker-end で矢頭

### 4.3 対応表（Mapping Table）

領域固有の概念と5段階の対応を視覚化する。

- 用途: 各ドメインの理論と5段階のマッピング
- レイアウト: グリッド / マトリクス
- セルの色で対応度を表現

### 4.4 5段階マッピング図（Five-Stage Map）

30ドメインの横断的パターンを示す。

- 用途: theme MD の主要図解
- レイアウト: 5段階を横軸、ドメインを縦軸
- ヒートマップ的な色分け

### 4.5 ベン図・集合図（Set Diagram）

概念の重複・包含関係を示す。

- 用途: 盲点、共通パターン
- 半透明の塗りつぶし (opacity: 0.3)

## 5. レイアウト規約

- マージン: viewBox の各辺から 40px 以上
- 要素間の最小間隔: 20px
- テキストは必ず読める大きさ（最小 11px）
- 長いテキストは折り返し or 省略（... で表示）

## 6. SVG 埋め込みテンプレート（MD 用）

MD ファイルから SVG を参照する際の標準記法:

### インライン画像として埋め込む場合

```markdown
\![{タイトル}の構造図](../assets/svg/domains/domain-D{NN}-{name}.svg)
```

### HTML 直接埋め込み（サイズ制御が必要な場合）

```html
<div align="center">
  <img src="../assets/svg/domains/domain-D{NN}-{name}.svg" alt="{タイトル}の構造図" width="700">
</div>
```

### テーマ図の参照

```markdown
\![{テーマ名}の分析図](../assets/svg/themes/theme-{slug}.svg)
```

## 7. 品質チェック項目

SVG 生成後、以下を確認する:

- [ ] viewBox が設定されている（固定 width/height のみは NG）
- [ ] 外部リソース（画像、フォント URL）を参照していない
- [ ] 日本語テキストに適切な font-family が指定されている
- [ ] カラーパレットに準拠している（独自色の乱用なし）
- [ ] テキストが読める大きさ（最小 11px）
- [ ] ブラウザで表示確認（Safari, Chrome）
- [ ] ファイルサイズが 200KB 以下
- [ ] 命名規約に準拠（domain-D{NN}-{name}.svg / theme-{slug}.svg）
- [ ] MDの内容と図の整合性がある（タイトル・構造の一致）

## 8. pandoc PDF 埋め込み設定

pandoc で SVG を含む MD から PDF を生成する場合:

```bash
pandoc input.md -o output.pdf \
  --pdf-engine=lualatex \
  --resource-path=".:assets/svg/domains:assets/svg/themes" \
  --wrap=none
```

`--resource-path` に SVG ディレクトリを追加することで、MD 内の相対パスで SVG を解決できる。

> **注意**: lualatex は SVG を直接埋め込めないため、rsvg-convert 等で PNG/PDF に変換するか、
> `--lua-filter` で SVG → PDF 変換を挟む必要がある。将来の拡張として検討。
