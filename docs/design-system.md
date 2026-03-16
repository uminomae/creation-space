# デザインシステム — 変更ルール

## 正本

| 層 | 正本 | 確認方法 |
|---|---|---|
| デザイントークン（変数値） | `src/styles/shell.css` の `:root` | ファイルを直接読む |
| デザイン意図・コンポーネント例 | `dev-components.html` | ブラウザで開く / ソースを読む |
| 変更ルール・制約 | 本ファイル | — |

補足:
- `reports.css` などにある `--reports-*` は component-local な派生変数。root token を束ねた二次層として扱う。
- `viewer.css` / `dev-legacy.css` の `--bs-offcanvas-width` は Bootstrap bridge 変数。offcanvas 幅の接続点として見る。

## CSS変更前に必ず行うこと

1. 本ファイルを読む
2. `dev-components.html` のソースを読み、変更対象の変数がどのコンポーネントで使われているかを確認する

## 変更してよい範囲

- 色の値（色相・彩度・明度の微調整）
- フォントサイズの `clamp()` 値
- `radius`, `transition` の値
- 新しいコンポーネント変数の追加

## 変更時に守るべき制約

- 変数名の命名規則: `--kesson-{category}-{name}` または `--color-{name}`
- `rgb()` ではなく `r, g, b` の 3 値で定義する。`rgba()` で透明度を柔軟に変えるため
- ダークテーマ前提: 背景は暗い。テキストは明るい。コントラストを確保する
- `shell.css` を変更したら `dev-components.html` も確認・更新する
- component-local 変数を変える場合も、元になっている root token まで辿って整合を確認する

## カテゴリと命名パターン

| prefix | 用途 |
|---|---|
| `--color-*` | 基本パレット（accent, sub-text, highlight, link, heading, bg-body） |
| `--kesson-font-*` | タイポグラフィ（serif-display, serif-ui, mono-ui） |
| `--kesson-card-*` | カードコンポーネント |
| `--kesson-action-*` | ボタン・アクション |
| `--kesson-offcanvas-*` | オフキャンバスパネル |
| `--kesson-viewer-*` | MD / 埋め込み viewer |
| `--kesson-md-*` | MD 内の要素（h1-h4, link, quote, code, table） |
| `--kesson-ui-*` | UI 部品（ラベル、矢印、補助表示） |
| `--reports-*` | Reports 専用の派生変数。root token から組み立てる二次層 |

## 判断基準

- サイト全体の空気を変えたいなら root token を触る
- 特定 UI だけを調整したいなら component-local 変数を優先する
- 同じ色や影の値を複数 CSS に直書きしている箇所を見つけたら、新規直書きは増やさず token へ寄せる
- 迷ったら `dev-components.html` で隣接コンポーネントを見比べ、変化が波及してよい範囲だけを変える
- **Bootstrap 優先**: レイアウト・スペーシング・ボタン・レスポンシブ制御は Bootstrap ユーティリティクラスを最優先で使う。カスタム CSS は Bootstrap で実現不可能なものに限定する（詳細: `CLAUDE.md` §Bootstrap 優先原則）
