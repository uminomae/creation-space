# knowledge/raw/

## 背景とゴール

過去の調査は LLM の知識ベースに依存しており、原典を読んでいなかった。この反省から、**原典を探し、読み、wiki にまとめ、原典ベースで構造類似を分析する**パイプラインに全面転換した。このディレクトリはその**第1段階「原典を探す」の成果物置き場**である。

### ゴール

D01-D30 の全領域で、追跡対象 source の原典を取得し、精読可能な状態にする。

### 現在地（2026-04-10）

- 435本追跡中（`manifest.md` で管理）
- raw-confirmed（PDF 格納済み）: 80本
- url-verified（OA URL 閲覧確認済み）: 190本
- citation-only（書誌のみ）: 144本
- blocked-access（取得不可）: 21本
- **次のステップ**: raw-confirmed / url-verified の原典を精読→wiki 化（パイプライン第2-3段階）
- 追跡 Issue: cs#217

---

30領域調査で参照する一次データの置き場。
論文 PDF、プレプリント、公式報告書、著者公開版など、**本文を直接確認できる原典**を格納する。

## 運用開始の経緯

`cs#205` で受け皿を作成し、`cs#207` に合わせて manifest 先行で運用を始める。
2026-04-07 時点では、既存調査報告を一度 archive に退避して再監査へ切り替えた。
そのうえで pilot raw-confirmed として、次の 5 本を格納した。

- `D01_bott_1988_morse-theory-indomitable.pdf`
- `D10_akdis_2014_allergen-immunotherapy.pdf`
- `D10_rosenblum_2015_autoimmunity.pdf`
- `D14_varela_1991_embodied-mind.pdf`
- `D18_durkheim_1893_division-labor.pdf`

Carlsson (2009) と Ghrist (2008) は公式 AMS 側の PDF 導線を確認したが、2026-04-07 時点では terminal 経由の取得が Cloudflare で遮断されたため、manifest 上は `blocked-access` として扱う。
Berger / Luckmann (1966) と Giddens (1984) も公開導線を確認したが、2026-04-07 時点では有効な PDF 実体を取得できず、manifest 上は `blocked-access` として扱う。

## 運用ルール

- 格納対象は OA・プレプリント・著者公開版・公式公開 PDF を優先する
- 命名規則は `{領域ID}_{著者姓}_{年}_{キーワード}.pdf`
- 取得した原典は `manifest.md` に必ず記録する
- `raw-confirmed` になった原典だけを、[P] 主張の verified 候補として使う
- `citation-only` / `blocked-access` / `not-yet-reviewed` は manifest で管理し、本文の断定根拠には使わない

## 厳密さと更新方針

- 既存の生成物がすでに存在していても、**原典未確認の記述は暫定扱い**とする
- 結論は、取得できた原典の本文に依拠して積み上げる。少ない資料から強い一般化をしない
- 原典が乏しい場合は、無理に結論を埋めず、`不足している` `保留` `要再検証` を明記する
- 生成物は「現時点の原典到達状況に基づく暫定版」であり、文献探索の進展に応じて随時ブラッシュアップする
- raw が増えたら、対応する `evidence/` `ref-check` `knowledge/` の記述も見直し対象に戻す
- **嘘をつかないことを優先する**。原典で言えないことは、推測として分離するか、まだ言わない

## 追加手順

1. `manifest.md` に source 単位で候補原典を登録する
2. access status を判定する
3. `raw-confirmed` かつ合法的に保存可能な場合のみ PDF を配置する
4. 対応する `evidence/` と `ref-check` に raw 参照を追加する
5. 再監査で verified / 保留を確定する

## 参照

- [manifest.md](/Users/uminomae/dev/creation-space/knowledge/raw/manifest.md)
- [docs/knowledge-raw-policy.md](/Users/uminomae/dev/creation-space/docs/knowledge-raw-policy.md)
- [original-access-rerun-plan.md](/Users/uminomae/dev/creation-space/evidence/investigation/original-access-rerun-plan.md)

`manifest.md` を、raw ディレクトリの原典状況を常時追跡する正本リストとして扱う。
