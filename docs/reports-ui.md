# REPORTS UI 概要

## 位置づけ

`REPORTS` は `creation-space` トップページ内で、30領域の調査成果と関連ガイドを閲覧するための UI である。`src/reports/` が表示ロジックを持ち、実データ本体は主に `pjdhiro` リポジトリ上の公開アセットを参照する。

## 何を表示するか

- 30領域のドメインカード
- 進捗レベル別の件数とフィルタ
- 各領域レポートの Markdown / PDF
- 横断統合レポート、ガイド、survey status、Phase 8 関連資料
- 必要に応じて HTML スライドや追加モーダル

## 利用者ができる操作

1. ドメインカードを開き、領域ごとの調査レポートを Markdown モーダルで読む
2. 公開済みレポートがある場合は PDF を開く
3. 進捗レベルでカードを絞り込む
4. ガイド、survey status、synthesis、Phase 8 テーマ分析へ移動する
5. 履歴同期付きの URL で、モーダルやスライド状態を直接開く

## データソース

`src/reports/data.js` が既定の参照先を定義している。

- ドメイン一覧: `https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/creation/manifests/domains.json`
- レポート Markdown: `https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/creation/...`
- PDF / HTML 公開物: `https://uminomae.github.io/pjdhiro/assets/creation/...`
- ローカル検証シナリオ: `assets/reports/scenarios/*.json`

つまり `creation-space` 側は REPORTS の UI と正規化ロジックを持ち、配信対象の manifest / Markdown / PDF は `pjdhiro` 側が SoT になる。

## 進捗ラベル

表示ラベルの正本は `docs/evidence-metadata-creation.md` にあり、`src/reports/data.js` の既定 taxonomy と整合している必要がある。カードのバッジやフィルタは `progress_level` を正規化して描画する。

## ローカル確認の最小手順

```bash
bash server.sh 3002
# http://localhost:3002/
```

- `REPORTS` セクションでカード一覧、フィルタ、モーダルが開くことを確認する
- 公開アセット依存のため、`pjdhiro` 側 manifest が未更新だと表示内容は追随しない
- データ整合の確認は `node scripts/smoke-test.js` や `bash scripts/validate-manifest-sync.sh` を使う

## 参照先

- `src/reports/index.js`
- `src/reports/data.js`
- `docs/evidence-metadata-creation.md`
- `evidence/investigations/investigation-cs23-categorize.md`
- `evidence/investigations/investigation-cs43-modal-deeplink.md`
