# cs#23 領域調査状況のカテゴライズ調査

- 作成日: 2026-03-12
- 対象:
  - `src/reports.js`
  - `assets/reports/`
  - `/Users/uminomae/dev/pjdhiro/assets/creation/manifests/domains.json`
  - `evidence/evidence-D*.md`

## 結論

- REPORTS 画面のカテゴリは `evidence/` を見て決めているのではなく、`domains.json` の `progress_level` を `src/reports.js` で正規化して使っている。
- 現行 manifest の 30 領域は `claude_gpt_reviewed` 28 件、`codex_parallel_deepdive` 2 件だけで、画面上の active category も実質 2 つしかない。
- 一方、evidence frontmatter の `status` は少なくとも 4 群に分かれる。
  - `Step 7 確定`: 12件
  - `Phase 4修正適用済み`: 6件
  - `Phase 4完了（判断待ち）`: 11件
  - `Phase 4完了 + deepdive済`: 1件
- したがって、現在の `progress_level` は「進捗」より「どの調査手法を通ったか」を表すラベルとして振る舞っており、UI 文言の `進捗レベル` と意味がずれている。
- 問題の本体はカテゴリ名そのものより、`手法` と `ワークフロー状態` を 1 軸に押し込めているデータモデルにある。

## 1. 現在の分類ロジック

### 1.1 `src/reports.js` 側のロジック

- `DEFAULT_PROGRESS_TAXONOMY` には 6 カテゴリが定義されている。
  - `not_surveyed`
  - `claude_screened`
  - `claude_gpt_reviewed`
  - `api_deepdive`
  - `codex_parallel_deepdive`
  - `human_reviewed`
- 各レポートのカテゴリは `normalizeReport()` 内で `normalizeProgressLevel(report?.progress_level, report?.status)` を通して決まる。
- 旧ラベル互換は次の通り。
  - `quick_scan` -> `claude_screened`
  - `structure_exploration` -> `claude_screened`
  - `analysis_complete` -> `claude_gpt_reviewed`
- `progress_level` が空でも `status: "published"` なら `claude_gpt_reviewed` にフォールバックする。
- 画面に出す凡例・フィルタは「現在1件以上あるカテゴリ」だけを `getPresentProgressTaxonomy()` で抽出して表示する。

根拠:

- `src/reports.js:78-131`
- `src/reports.js:499-503`
- `src/reports.js:923-931`
- `src/reports.js:952-959`
- `src/reports.js:1531-1561`
- `src/reports.js:1851-1855`

### 1.2 manifest / local assets の役割

- REPORTS 本体のデータは `/Users/uminomae/dev/pjdhiro/assets/creation/manifests/domains.json` を読む。
- `domains.json` の top-level key は `version` / `generated_at` / `namespace` / `reports` のみで、`progress_taxonomy` は持っていない。
- そのため、カテゴリ名・説明文の正本は manifest ではなく `src/reports.js` の `DEFAULT_PROGRESS_TAXONOMY` にある。
- `assets/reports/` 配下にあるのは本番用 manifest ではなく、`scenarios/split-d22.json` だけである。
- この scenario は taxonomy 検証用で、旧ID `structure_exploration` もまだ使っている。

根拠:

- `/Users/uminomae/dev/pjdhiro/assets/creation/manifests/domains.json:1-5`
- `assets/reports/scenarios/split-d22.json:9-27`

### 1.3 `progress_level` の設計意図

- `evidence/PROJECT.md` では、進捗ラベルは「評価語ではなく、どの調査操作を実施したか」で記述すると整理されている。
- 同文書の現行ラベル説明は 4 段階で、
  - `調査前`
  - `Claude初期抽出済`
  - `Claude＋GPT照合済`
  - `人間レビュー済`
  とされている。
- 一方で `src/reports.js` 実装は deepdive 系 2 カテゴリを追加して 6 分類になっている。

根拠:

- `evidence/PROJECT.md:156-169`
- `src/reports.js:78-131`

## 2. 現行データの分類状況

### 2.1 manifest 上の分類件数

| progress_level | 件数 | 領域 |
|---|---:|---|
| `claude_gpt_reviewed` | 28 | D01-D21, D24-D30 |
| `codex_parallel_deepdive` | 2 | D22, D23 |

補足:

- D22 と D23 だけが `codex_parallel_deepdive`。
- `human_reviewed`、`api_deepdive`、`claude_screened`、`not_surveyed` は 0 件。

根拠:

- `/Users/uminomae/dev/pjdhiro/assets/creation/manifests/domains.json:11`
- `/Users/uminomae/dev/pjdhiro/assets/creation/manifests/domains.json:389-418`

### 2.2 evidence frontmatter `status` の集約

以下は frontmatter の `status` 文字列をそのまま集約したものであり、本文の解釈は含めない。

| evidence status 群 | 件数 | 領域 |
|---|---:|---|
| `Step 7 確定` | 12 | D01-D12 |
| `Step 7 Phase 4 P0/P1修正適用済み` | 6 | D15-D20 |
| `🟣 Phase 4完了（P1 pjdhiro判断待ち）` | 11 | D13, D14, D21, D22, D24-D30 |
| `🟢 Phase 4完了 + deepdive済` | 1 | D23 |

見えること:

- evidence の実態は少なくとも 4 段階に分かれている。
- しかし REPORTS 側はその 4 群を 2 カテゴリに潰して表示している。

### 2.3 30領域の対照表

| ID | 領域 | manifest `progress_level` | evidence `status` | 観察 |
|---|---|---|---|---|
| D01 | 数学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み + pjdhiro承認 2026-02-27） | manifest は承認済みを区別しない |
| D02 | 物理学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み + pjdhiro承認 2026-02-27） | 同上 |
| D03 | 化学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み + pjdhiro承認 2026-02-28） | 同上 |
| D04 | 進化生物学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-02-28） | 承認有無は manifest で見えない |
| D05 | 地球科学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-02-28） | 同上 |
| D06 | 天文学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み + pjdhiro承認 2026-02-28） | 同上 |
| D07 | 工学情報 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み + pjdhiro承認 2026-03-01） | 同上 |
| D08 | 神経科学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-03-01） | 同上 |
| D09 | 生命科学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-03-01） | 同上 |
| D10 | 臨床免疫 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-03-01） | 同上 |
| D11 | 薬学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-03-01） | 同上 |
| D12 | 農学生態 | `claude_gpt_reviewed` | Step 7 確定（pjdhiro承認 2026-03-05） | `status` には GPT が出ない |
| D13 | 哲学 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | 確定前でも同じカテゴリ |
| D14 | 心理学 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | 同上 |
| D15 | 美学 | `claude_gpt_reviewed` | Step 7 Phase 4 P1修正適用済み（pjdhiro承認 2026-03-04） | 修正適用済みも同じカテゴリ |
| D16 | 歴史学 | `claude_gpt_reviewed` | Step 7 Phase 4 P1修正適用済み（pjdhiro承認 2026-03-04） | 同上 |
| D17 | 言語学 | `claude_gpt_reviewed` | Step 7 Phase 4 P0修正適用済み（pjdhiro最終判定待ち） | 待ち状態も同じカテゴリ |
| D18 | 社会学 | `claude_gpt_reviewed` | Step 7 Phase 4 P1修正適用済み（pjdhiro最終判定待ち） | 同上 |
| D19 | 文学 | `claude_gpt_reviewed` | Step 7 Phase 4 P1修正適用済み（pjdhiro最終判定待ち） | 同上 |
| D20 | 法学・政治学 | `claude_gpt_reviewed` | Step 7 Phase 4 P1修正適用済み（pjdhiro最終判定待ち） | 同上 |
| D21 | 経済学 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | 確定前でも同じカテゴリ |
| D22 | 経営学 | `codex_parallel_deepdive` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | deepdive 実施は反映、承認待ちは見えない |
| D23 | 発達心理 | `codex_parallel_deepdive` | 🟢 Phase 4完了 + deepdive済（pjdhiro承認 2026-03-12） | deepdive と承認の両方が見える唯一の例 |
| D24 | 宗教学 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | manifest が粗い |
| D25 | 人類学 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | 同上 |
| D26 | 音楽学 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | 同上 |
| D27 | 建築 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | 同上 |
| D28 | 舞台芸術 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | 同上 |
| D29 | 複雑系 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | 同上 |
| D30 | 伝統知 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | 同上 |

## 3. カテゴリ名と実態の整合性

### 3.1 `Quick Scan / Structure Exploration / Analysis Complete` について

- この 3 名称は現行 manifest では使われていない。
- 実装上は旧データ互換のエイリアスとして `normalizeProgressLevel()` に残っているだけである。
- 実際に現在参照できるのは、scenario `split-d22.json` の `structure_exploration` のみで、本番表示名ではない。

判断:

- この3名称の吟味は「現行カテゴリ名の評価」ではなく、「旧IDをいつ消すか」の整理に近い。

### 3.2 現在の `progress_level` は進捗より手法タグに近い

- `claude_gpt_reviewed` は「Claude初期抽出 + GPT照合を経たか」を表す。
- `codex_parallel_deepdive` は「Codex並列 deepdive を実施したか」を表す。
- どちらも「承認済みか」「最終判定待ちか」「修正適用済みか」は表さない。
- `evidence/PROJECT.md` でも、進捗ラベルは「どの調査操作を実施したか」で書く方針になっている。

判断:

- データの意味は `調査経路` または `処理経路` であり、UI の `進捗レベル` という言い方は誤解を招きやすい。

### 3.3 `claude_gpt_reviewed` が広すぎる

同じ `claude_gpt_reviewed` の中に、少なくとも次の 3 系統が混在している。

- `Step 7 確定` 済み
  - D01-D12
- `Phase 4修正適用済み`
  - D15-D20
- `Phase 4完了（判断待ち）`
  - D13, D14, D21, D24-D30

判断:

- このカテゴリは現在の実データに対して粗すぎる。
- フィルタとしては使えても、状態理解には不十分。

### 3.4 `human_reviewed` が未使用

- `src/reports.js` では `human_reviewed` が定義済み。
- しかし manifest では 0 件。
- frontmatter だけ見ても D01, D02, D03, D06, D07 は `GPTレビュー突き合わせ済み + pjdhiro承認` を明示しており、定義上は `human_reviewed` 候補に見える。
- D15, D16 も `pjdhiro承認` は入っているが、frontmatter 文言だけでは GPT 実施を明示していない。

判断:

- `human_reviewed` は定義だけ存在して運用されていない。
- その結果、承認済み領域と未承認領域が同じ `claude_gpt_reviewed` に留まっている。

### 3.5 deepdive を同じ軸に置くのはやや不自然

- `evidence/deepdive/README.md` では deepdive は Level 2 evidence を壊さずに行う「補助探索」であり、evidence 本体と分離して運用すると書かれている。
- 同 README の実施状況でも、D22/D23 の deepdive は evidence 反映状況と別に管理されている。
- D22 evidence の frontmatter `status` は `🟣 Phase 4完了（P1 pjdhiro判断待ち）` のままだが、個別エントリの flags には `ai:deepdive-codex` が入っている。
- D23 は frontmatter に `progress_level: codex_parallel_deepdive` があり、manifest と同期している。

判断:

- deepdive は「進んだ段階」というより「追加で通した補助探索手法」である。
- したがって `claude_gpt_reviewed` と `codex_parallel_deepdive` を単純な同列カテゴリとして並べると、段階と手法が混ざる。

### 3.6 カテゴリ数は「少ない」のではなく「軸が違う」

- active category は 2 つしかなく、実態把握には不足している。
- ただし本質は単純な「カテゴリを増やせば解決」ではない。
- 1軸のまま `Step 7確定`、`Phase 4完了`、`deepdive済`、`承認済` を全部入れると、`手法` と `状態` が混ざった taxonomy になり、さらに説明しづらくなる。

判断:

- 問題はカテゴリ数よりデータモデルである。

## 4. 改善案

### 4.1 推奨: 2軸化する

`progress_level` 1本で表さず、少なくとも次の2軸に分ける。

#### 軸A: 調査手法

- `not_surveyed`
- `claude_screened`
- `claude_gpt_reviewed`
- `api_deepdive`
- `codex_parallel_deepdive`
- `human_reviewed`

#### 軸B: ワークフロー状態

- `phase4_pending`
- `phase4_applied`
- `step7_finalized`
- `approved`

表示案:

- 主バッジ: 調査手法
- 副バッジ: 現在状態

これなら D22 は

- 手法: `codex_parallel_deepdive`
- 状態: `phase4_pending`

D23 は

- 手法: `codex_parallel_deepdive`
- 状態: `approved`

と表現できる。

### 4.2 1軸のまま行くなら、主語を `progress` から変える

もし UI と manifest を大きく変えたくないなら、少なくとも表示文言を次のどれかに寄せた方がよい。

- `調査手法`
- `調査経路`
- `レビュー経路`

現在の `progress_level` は、語義としては `進捗` より `経路` に近い。

### 4.3 evidence frontmatter を構造化する

自由記述 `status` だけでは同期が崩れやすい。最低でも次のような構造化項目が欲しい。

```yaml
progress_level:
workflow_status:
gpt_reviewed:
human_reviewed:
deepdive_methods:
```

これにより、次の不整合を減らせる。

- D12: `status` には GPT が出ない
- D22: manifest は deepdive だが frontmatter に `progress_level` がない
- D23: frontmatter だけ `progress_level` がある

### 4.4 manifest を evidence から生成する

現状は手入力同期に見えるため、ズレが発生しやすい。

短期対応:

- D22 frontmatter に `progress_level: codex_parallel_deepdive` を追加するか再判定する
- `human_reviewed` を使うなら、どの条件で manifest に昇格させるかを明文化する

中期対応:

- evidence frontmatter を正本にする
- `domains.json` は生成物にする

### 4.5 仕様文書も同時に更新する

- `docs/survey-progress-taxonomy.md` は 4 カテゴリ前提で書かれており、現在の `src/reports.js` 6 カテゴリ実装と一致していない。
- taxonomy を見直すなら、実装、仕様文書、scenario を同時に更新する必要がある。

## 5. 最終判断

- `Quick Scan / Structure Exploration / Analysis Complete` は現行本番ラベルではない。旧互換の整理対象である。
- 現在の `Claude＋GPT照合済` / `Codex並列深掘り済` という名称自体は、手法名としては概ね妥当である。
- ただし field 名と UI 文言が `進捗` を名乗っているため、ユーザーは時系列の状態を期待する。
- 実態は `手法` と `状態` の混線なので、改善の優先順位は名前変更よりデータモデル整理の方が高い。

## 参照箇所メモ

- `src/reports.js:78-131`
- `src/reports.js:499-503`
- `src/reports.js:923-931`
- `src/reports.js:952-959`
- `src/reports.js:1531-1561`
- `src/reports.js:1851-1855`
- `assets/reports/scenarios/split-d22.json:9-27`
- `/Users/uminomae/dev/pjdhiro/assets/creation/manifests/domains.json:1-5`
- `/Users/uminomae/dev/pjdhiro/assets/creation/manifests/domains.json:385-418`
- `evidence/PROJECT.md:156-180`
- `evidence/PROJECT.md:182-215`
- `evidence/deepdive/README.md:11-16`
- `evidence/deepdive/README.md:99-112`
- `evidence/evidence-D22-business-management.md:1-9`
- `evidence/evidence-D22-business-management.md:26-30`
- `evidence/evidence-D23-developmental-psychology.md:1-9`
- `evidence/evidence-D13-philosophy.md:1-8`
- `evidence/evidence-D15-aesthetics.md:1-8`
