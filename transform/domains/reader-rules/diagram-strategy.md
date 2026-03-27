# 図解戦略 — スライドタイプ別の図解パターン定義

## 概要

スライドビューアが自動分類するスライドタイプに応じて、適切な図解（SVG）を挿入するルール。

## スライドタイプ → 図解マッピング

| スライドタイプ | 推奨図解 | SVG タイプ | 配置ルール |
|---------------|---------|-----------|-----------|
| slide-title | ドメインアイコン（サムネイル） | TYPE A (overview) | 右下に小さく配置 |
| slide-overview | 概要インフォグラフィック | TYPE A (overview) | テキストの後に全幅表示 |
| slide-entry | なし（テキスト優先） | - | テキスト量が多いため図解不要 |
| slide-table | 理論マトリクス | TYPE B (theories-map) | テーブルの直後に配置 |
| slide-patterns | 横断パターン図 | TYPE C (cross-patterns) | セクション冒頭に全幅配置 |
| slide-questions | なし | - | 問い自体が主役、図解は蛇足 |
| slide-conclusion | サマリー図 | TYPE A or TYPE C | 中央配置 |
| slide-visual | 既存画像を活用 | - | 画像がメインコンテンツ |
| slide-default | なし | - | 汎用のためルール不適用 |

## SVG 挿入ルール

1. **1スライド1図解**: 1つのスライドに挿入する図解は最大1つ
2. **テキスト優先**: テキスト量 > 400文字のスライドには図解を入れない
3. **ラッパー必須**: SVG は `.slide-inline-svg` figure 要素で囲む
4. **レスポンシブ**: モバイル時は max-width: 90% に自動縮小（slides.css 対応済み）
5. **フォールバック**: SVG ファイルが存在しない場合は何も挿入しない（エラーにしない）

## SVG タイプ定義

| タイプ | 命名規則 | 用途 | 配置場所 |
|--------|---------|------|---------|
| TYPE A | `domain-{DNN}-{name}.svg` | 領域全体の俯瞰・概要図 | `assets/svg/domains/` |
| TYPE B | `{domain}-02-theories-map-svg` | 理論×5段階（場→波→縁→渦→束）マトリクス | pjdhiro repo |
| TYPE C | `{domain}-03-cross-patterns-svg` | 横断パターンの視覚化 | pjdhiro repo |
| Theme | `theme-{name}.svg` | テーマ別分析図 | `assets/svg/themes/` |

## 自動挿入の判定フロー

```
classifySlide() → スライドタイプ判定
    ↓
マッピング表を参照
    ↓
SVG タイプを決定
    ↓
ドメインID から SVG パスを構築
    ↓
SVG ファイルの存在を確認（fetch HEAD）
    ↓
存在すれば figure.slide-inline-svg で挿入
存在しなければスキップ
```
