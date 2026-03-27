# トップページ section 構造

## 目的

`index.html` の section wrapper を読みやすく保ち、Bootstrap utility の羅列依存を減らす。

## 標準構造

各主要 section は次の形に揃える。

```html
<section>
  <div class="section-content-wrap">
    <div class="container creation-section-shell">
      ...
    </div>
  </div>
</section>
```

## ルール

- `creation-section-shell` を section 内共通 wrapper とする
- `d-flex flex-column mt-1` のような utility 連結は共通 class に吸収する
- section ごとの差分は component / feature class 側で表現する

## 意図

- HTML 構造の意味を読み取りやすくする
- CSS 側の selector 依存を浅くする
- 今後の section 追加時にコピペ構造を揃えやすくする
