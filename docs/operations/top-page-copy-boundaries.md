# トップページ文言の責務境界

## 目的

`index.html` 上の文言が「runtime 用」「SEO 用」「noscript 用」のどれなのかを明確にする。

## 1. runtime 用文言

対象:

- topbar
- graphic switcher
- hero
- control guide
- model / reports / articles の見出しと補助文言
- modal / offcanvas の aria など、起動後 UI に属するもの

ルール:

- `index.html` 側は `data-i18n` / `data-i18n-attr-*` を付ける
- 正本は `src/i18n/dict.js` の `page` に置く
- `src/page-language.js` は page shell だけを反映する

## 2. feature module 用文言

対象:

- `reports` の描画結果
- `articles` の描画結果
- `about` modal 本文
- `viewer` / `slide-viewer` の機能別 UI

ルール:

- 各 feature module が自分の辞書領域だけを参照する
- page shell 用の `page-language.js` に feature-level 文言責務を持ち込まない

## 3. SEO / crawler 用文言

対象:

- `#seo-content-summary`
- `<noscript>`

ルール:

- runtime i18n の対象外
- クローラー向け静的要約として扱う
- runtime UI 文言の変更時に自動で追従する前提を置かない

## 4. 更新時の判断基準

- 画面起動後に JS が直接扱うもの: runtime
- 機能モジュールが描画するもの: feature module
- JS 無効時や crawler 向けの静的要約: SEO / noscript
