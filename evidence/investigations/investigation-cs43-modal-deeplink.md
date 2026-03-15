# cs#43 モーダルディープリンク設計可能性調査

## 結論（推奨パターンと根拠）

結論から言うと、現行アーキテクチャの上でモーダルディープリンク設計は可能です。推奨は **パターン C: `domain` クエリパラメータ + `pushState` / `popstate`** です。

推奨理由は三つあります。第一に、`graphic` と `lang` がすでにクエリパラメータを `replaceState` で同期しており、URL を状態の一部として扱う流れと整合します。第二に、`createDomainGridItem()` の時点で `report.id` と `sources` が揃っており、`openMarkdownModal()` を URL 指定のドメインに対して再利用できます。第三に、`pushState` を使えば「戻る」でモーダルを閉じ、「進む」で再度開く、という最も自然な挙動を実現できます。

一方で、この推奨は無条件ではありません。`popstate` と Bootstrap Modal の `hide` / `hidden` の連鎖を制御する小さな状態機械が必要です。また、URL 直打ちで `?domain=D01` から入ったケースと、ページ内クリックでモーダルを開いたケースでは、閉じるときの履歴処理を分ける必要があります。この複雑さはありますが、現行コードベースの責務分割を大きく崩すものではありません。

## 判定: バグ / 機能追加 / 両方

**判定は両方です。**

- **機能追加**: 特定ドメインのモーダルを URL から直接開き、共有・ブックマークできるようにする点
- **バグ相当の UX 欠陥**: モーダルが URL / History と同期していないため、「戻る」でモーダルが閉じるはずだという期待に応えられていない点

より正確には、根本原因は機能不足です。ただし、その不足が戻るボタンの期待動作を崩しているので、ユーザー体験上はバグとしても観測されます。

## 現行アーキテクチャの要約

### ページ構造

- `index.html` は単一 HTML エントリで、`src/main.js` から初期化される
- ルーティングライブラリはなく、GitHub Pages 上の静的 1 ページ構成である
- ただし完全な SPA ではなく、`graphic` 切替時には場合によってページ再読込を伴う

### reports セクションの初期化

- `initMainContentRuntime()` から `initReports()` が呼ばれる
- `initReports()` はまず空表示を描画し、その後 `domains.json` 相当のデータを `fetch` して再描画する
- したがって、URL からモーダルを開く場合は、**reports データ取得完了後に再生する保留処理** が必要になる

### モーダル表示

- 各ドメインカードは `createDomainGridItem()` で生成される
- クリック時には `report.id` と `sources` を使って `openMarkdownModal()` を呼ぶ
- `openMarkdownModal()` は Bootstrap Modal を `show()` したあと Markdown を非同期取得する
- つまり、深い変更なしに「ドメイン ID からモーダルを開く」薄いラッパーを足せる

### 現在の URL 状態管理

現状の runtime で URL を読む・書く箇所は次のとおりです。

| パラメータ | 読み取り | 書き込み | 用途 | 備考 |
|---|---|---|---|---|
| `graphic` | あり | `replaceState` | グラフィックモード初期値 | 既存 query と共存する実装 |
| `lang` | あり | `replaceState` | 表示言語 | `ja` では削除、`en` で付与 |
| `reportsScenario` | あり | なし | reports シナリオ差し替え | 読取り専用 |
| `reportsTaxonomyTest` | あり | なし | `reportsScenario` の旧名互換 | 読取り専用 |
| `dev` | あり | なし | DEV モード | presence check のみ |
| `devstate=persist` | あり | なし | DEV state 永続化 | 読取り専用 |
| `utime` / `uTime` | あり | なし | Intent Loop 初期時刻 | 読取り専用 |
| `camdeg` 系 / `camrad` 系 / `camphase` / `camturn` | あり | なし | Intent Loop カメラ初期値 | 読取り専用、旧 alias 互換あり |

補足として、`articles-data.js` と `dev-links-panel.js` は URL を**生成**しますが、ページ状態を runtime で同期しているわけではありません。

### 現行 URL 利用の重要な特徴

- `pushState` は現状未使用
- `popstate` / `hashchange` のハンドラも未使用
- `graphic` と `lang` の更新は、`new URL(window.location.href)` を介して他クエリを温存する
- このため、`domain` をクエリパラメータに置く設計は既存実装と相性がよい

## 吟味の記録（発散→収束）

### Round 1: 各視点の初期意見

**🌐 ブラウザ API 専門家**

- A は実装が軽いが、History エントリを積まないので戻る対応ができない
- B は `hashchange` だけで成立しうるが、ハッシュをスクロール位置と状態の両方に使うと窮屈になる
- C は `popstate` で最も自然な履歴同期ができる

**🎨 UX デザイナー**

- ユーザーは「カードを開く」を軽いページ内ナビゲーションとして感じやすい
- そのため「戻る」でモーダルが閉じる挙動が最も自然
- A は共有 URL は作れても UX の一番痛いところが残る

**⚙️ 実装者**

- A が最も安全で、B が中間、C が最も複雑
- ただし C も `reports.js` に責務を閉じれば実装可能
- `initReports()` が非同期なので boot 時の再生タイミングだけは注意が必要

**⚖️ 批評家**

- C は `popstate -> modal.hide() -> hidden.bs.modal -> history更新` のループ事故が起きやすい
- B は `#reports-section` と `#report-D01` の競合を軽く見積もると後で痛む
- A は「簡単だが問題の核心を解かない」典型になる

### Round 2: 対立軸の特定

見解が割れたのは主に次の三点でした。

1. **戻る対応を最優先するか、実装単純さを優先するか**
2. **hash の軽さを取るか、既存のアンカー共存性を取るか**
3. **URL 直打ちで入ったモーダルを閉じるとき、`history.back()` でよいか**

このうち 1 は UX を優先すべきです。issue 自体が共有 URL と戻る/進む同期を問題にしているため、A の時点で要求に届きません。

2 は B の弱点をはっきりさせました。現行ページには `#reports-section` へのリンクが既に存在し、今後セクション deep link を増やす余地もあります。hash をモーダル状態専用にすると既存アンカーが窮屈になり、アンカーを優先するとモーダル state が表現しづらくなります。

3 は C の設計上の山場でした。直接 `?domain=D01` で入ったタブで閉じるときに `history.back()` を使うと、前ページへ離脱してしまう可能性があります。ここは「ページ内で開いた履歴」と「URL から直接入った初期履歴」を分けて扱う必要があります。

### Round 3: 収束

最終的な合意は次のとおりです。

- **採用は C**
- URL 表現は **`?domain=D01` を基本** とし、必要なら `#reports-section` を併用する
- モーダルをページ内で開いた場合のみ `pushState`
- URL 直打ちで最初から `domain` が付いていた場合は、そのエントリを「初期 deep link」として扱い、閉じるときは `replaceState` で `domain` を除去する
- `popstate` で URL を唯一の真実とみなし、モーダルの表示状態を追従させる
- `hidden.bs.modal` 側では、履歴由来の close 中かどうかをフラグで判定し、二重更新を防ぐ

これにより、共有 URL、リロード復元、戻る/進む同期を全部満たしつつ、GitHub Pages の静的制約も回避できます。

## パターン比較表

| 評価軸 | A: query + replaceState | B: hash | C: pushState + popstate |
|---|---|---|---|
| 1. リロード耐性 | ○ URL に残る間は復元可 | ○ hash で復元可 | ◎ query に残るので安定 |
| 2. 戻る/進む対応 | × 履歴を積まない | ○ `hashchange` で可能 | ◎ 最も自然 |
| 3. 外部リンク共有 | ○ 可能 | ○ 可能 | ◎ 可能 |
| 4. 既存パラメータ共存 | ◎ `graphic` / `lang` と同系統 | △ hash の一枠を奪う | ◎ query に素直に追加できる |
| 5. 非同期データ取得との整合 | ○ 保留再生が必要 | ○ 保留再生が必要 | ○ 保留再生が必要 |
| 6. Bootstrap Modal との相性 | ◎ 単純 | ○ hashchange 制御で済む | △ suppress flag が必要 |
| 7. 実装の複雑度 | ◎ 最小 | ○ 中程度 | △ 最も高い |
| 8. モバイル Safari 対応 | ○ 安全寄り | △ hash jump が読みづらい | ○ 要実機確認だが成立可能 |

## リスクと緩和策

### 1. `popstate` と `hidden.bs.modal` の相互再入

**リスク**

- `popstate` で `modal.hide()` を呼ぶ
- その結果 `hidden.bs.modal` が走る
- そこでさらに URL を書き換える
- ループ、または意図しない履歴破壊が起こる

**緩和策**

- `isSyncingFromHistory` のようなフラグを導入する
- `popstate` 起点で閉じたときは `hidden.bs.modal` 側の URL 更新を無効化する

### 2. 初期 deep link からの close で前ページへ離脱する

**リスク**

- 直接 `?domain=D01` で入ったタブで `history.back()` を使うと、サイト外へ戻る可能性がある

**緩和策**

- `modalEntryMode: 'initial' | 'push'` を持つ
- 初期 deep link は close 時に `replaceState` で `domain` を外す
- ページ内クリックで開いた場合のみ `history.back()` を使う

### 3. `initReports()` 完了前に URL 指定ドメインを開こうとする

**リスク**

- boot 直後は `state.reports` が空で、D01 を解決できない

**緩和策**

- `pendingDomainId` を保持する
- `loadReportsData()` 完了後、または `renderReports()` 後に `tryOpenDomainFromUrl()` を走らせる

### 4. `domain` が不正値または manifest に存在しない

**リスク**

- URL だけ残り、UI と state がずれる

**緩和策**

- `D\\d{2}` 程度の簡易正規化を入れる
- 該当 report が見つからなければモーダルは開かず、必要なら `replaceState` で `domain` を除去する

### 5. モーダル表示中に別の履歴エントリへ移動する

**リスク**

- `D01 -> D02 -> close` のような遷移で、モーダルの開閉と中身差し替えが競合する

**緩和策**

- active domain id を状態として保持する
- モーダル表示中に別 `domain` が来たら、hide せず `openMarkdownModal()` を再実行して内容だけ更新する

### 6. Three.js レンダリングループとの干渉

**リスク**

- 履歴同期をグローバルに広げると scene 側まで巻き込みやすい

**緩和策**

- deep link ロジックは `reports.js` に閉じる
- Three.js 側には介入しない
- モーダル open/close は DOM overlay として扱い、scene state は変更しない

### 7. GitHub Pages の静的ホスティング制約

**リスク**

- 独自 path route へ push するとリロードで 404 になる

**緩和策**

- `/` のまま query/hash だけを更新する
- `/report/D01` のような path-based routing は採らない

## 実装する場合の注意点

1. `reports.js` に `getDomainIdFromUrl()` と `syncDomainQuery()` の小さな helper を足す
2. `openMarkdownModal()` を直接 URL 同期に結びつけず、`openDomainModalById(reportId, { source })` のような薄い上位 API を作る
3. `initReports()` 完了後に `tryRestoreModalFromUrl()` を呼ぶ
4. Bootstrap Modal には少なくとも `hidden.bs.modal` を bind する
5. `pushState` は**ページ内操作の open 時だけ**行い、初期 deep link 復元では行わない
6. `graphic` / `lang` 更新は既存 helper が他クエリを温存するので、そのまま共存させる
7. 共有 URL の基本形は `?domain=D01#reports-section` を推奨する

## 現行コード上の実装ポイント

- `index.html`: `#reports-section` と `#reports-md-modal` は既に存在する
- `src/reports.js`: `createDomainGridItem()` で `report.id` を取得済み
- `src/reports.js`: `openMarkdownModal()` は title/sources 指定で再利用可能
- `src/reports.js`: `initReports()` が reports data の唯一の読込点なので、boot 時 restore をここへ寄せるのが自然
- `src/graphic-mode.js` / `src/i18n.js`: query 共存の既存パターンを参考にできる

## 最終判断

- **設計可能性**: 可能
- **推奨パターン**: C (`?domain=D01` + `pushState` / `popstate`)
- **判定**: 両方。ただし根は機能不足で、戻る問題はその派生
- **次のアクション案**: `reports.js` に閉じた形で URL <-> modal 同期の状態機械を足し、iPhone Safari を含む手動確認を行う
