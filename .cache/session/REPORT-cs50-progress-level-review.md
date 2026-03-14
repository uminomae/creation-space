# cs#50 進捗レベル見直しレポート

- 作成日: 2026-03-14
- ブランチ: `develop`
- instruction: `_instructions-cs50-progress-level-review.md`

## 0. 前提と参照元

### 読んだもの

- `docs/survey-progress-taxonomy.md`
- `src/reports.js`
- `evidence/PROJECT.md`
- `evidence/deepdive/README.md`
- `evidence/evidence-D*.md` 30件
- `../pjdhiro/assets/creation/manifests/domains.json`
- `../kesson-driven-thinking/chatgpt/output/` 配下の `REVIEW-*` / `RECONCILE-*`
- `evidence/deepdive/claude-code-agent/D22-business-management/run1/README.md`
- `evidence/deepdive/codex-parallel-deepdive/D22-business-management/run1/README.md`
- `evidence/deepdive/codex-parallel-deepdive/D23-developmental-psychology/insight1/README.md`

### 読めなかったもの

- `../kesson-driven-thinking/base/evidence/iss62-sources/README.md`

現環境では `iss62-sources` 直下に `.DS_Store` しかなく、指示対象の `README.md` は存在しなかった。したがって 30領域の実態確認は `creation-space` 側の `evidence/PROJECT.md`、各 `evidence-D*.md` frontmatter、`chatgpt/output` の `REVIEW-*` / `RECONCILE-*` を代替根拠として行った。

## 1. 結論

- 仕様正本は 4段階だが、実装 `DEFAULT_PROGRESS_TAXONOMY` は 6段階で運用されている。
- 現在の manifest は `claude_gpt_reviewed` 20件、`claude_screened` 8件、`codex_parallel_deepdive` 2件。
- evidence 側の実態は 30領域すべてが少なくとも Phase 4 まで進んでおり、`claude_screened` に相当する領域は 0件。
- 明確な誤分類は 8件。D13 と D24-D30 は `REVIEW-*` と `RECONCILE-*` が存在し、frontmatter も `Phase 4完了` なのに manifest では `claude_screened` になっている。
- `human_reviewed` は実装に定義済みだが manifest では 0件。`pjdhiro承認` を人間レビュー完了とみなすなら、D01/D02/D03/D06/D07/D12/D15/D16/D23 の 9件が候補になる。
- D22 と D23 は「進捗状態」と「追加で通した deepdive 手法」が 1軸に混ざるため、単一 `progress_level` では表現し切れない。

### 4段階に引き直したときの暫定像

`pjdhiro承認` を `human_reviewed` 判定条件に含めるなら、現行 30領域は次のように引き直せる。

| 4段階 | 件数 | 領域 |
|---|---:|---|
| `not_surveyed` | 0 | なし |
| `claude_screened` | 0 | なし |
| `claude_gpt_reviewed` | 21 | D04, D05, D08-D11, D13, D14, D17-D22, D24-D30 |
| `human_reviewed` | 9 | D01-D03, D06, D07, D12, D15, D16, D23 |

ただし D22 / D23 の deepdive 実施情報はこの 4段階には落ちない。4段階に引き直すと、追加手法の情報が失われる。

## 2. 30領域の現状マッピング

| ID | 領域 | 現在の progress_level | evidence 上の実態 | 判定 |
|---|---|---|---|---|
| D01 | 数学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み + pjdhiro承認 2026-02-27） | status に GPT+承認が明示。`human_reviewed` 候補。 |
| D02 | 物理学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み + pjdhiro承認 2026-02-27） | status に GPT+承認が明示。`human_reviewed` 候補。 |
| D03 | 化学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み + pjdhiro承認 2026-02-28） | status に GPT+承認が明示。`human_reviewed` 候補。 |
| D04 | 進化生物学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-02-28） | 現4段階では整合。 |
| D05 | 地球科学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-02-28） | 現4段階では整合。 |
| D06 | 天文学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み + pjdhiro承認 2026-02-28） | status に GPT+承認が明示。`human_reviewed` 候補。 |
| D07 | 工学情報 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み + pjdhiro承認 2026-03-01） | status に GPT+承認が明示。`human_reviewed` 候補。 |
| D08 | 神経科学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-03-01） | 現4段階では整合。 |
| D09 | 生命科学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-03-01） | 現4段階では整合。 |
| D10 | 臨床免疫 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-03-01） | 現4段階では整合。 |
| D11 | 薬学 | `claude_gpt_reviewed` | Step 7 確定（GPTレビュー突き合わせ済み 2026-03-01） | 現4段階では整合。 |
| D12 | 農学生態 | `claude_gpt_reviewed` | Step 7 確定（pjdhiro承認 2026-03-05） | `REVIEW-D12-*` と `RECONCILE-D12-*` が存在。`human_reviewed` 候補。 |
| D13 | 哲学 | `claude_screened` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | `REVIEW-D13-*` / `RECONCILE-D13-*` あり。`claude_screened` は過小分類。 |
| D14 | 心理学 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | 現4段階では整合。 |
| D15 | 美学 | `claude_gpt_reviewed` | Step 7 Phase 4 P1修正適用済み（pjdhiro承認 2026-03-04） | Phase 4修正適用 + 承認済。`human_reviewed` 候補。 |
| D16 | 歴史学 | `claude_gpt_reviewed` | Step 7 Phase 4 P1修正適用済み（pjdhiro承認 2026-03-04） | Phase 4修正適用 + 承認済。`human_reviewed` 候補。 |
| D17 | 言語学 | `claude_gpt_reviewed` | Step 7 Phase 4 P0修正適用済み（pjdhiro最終判定待ち） | 現4段階では `claude_gpt_reviewed` に吸収。 |
| D18 | 社会学 | `claude_gpt_reviewed` | Step 7 Phase 4 P1修正適用済み（pjdhiro最終判定待ち） | 現4段階では `claude_gpt_reviewed` に吸収。 |
| D19 | 文芸学 | `claude_gpt_reviewed` | Step 7 Phase 4 P1修正適用済み（pjdhiro最終判定待ち） | 現4段階では `claude_gpt_reviewed` に吸収。 |
| D20 | 法学・政治学 | `claude_gpt_reviewed` | Step 7 Phase 4 P1修正適用済み（pjdhiro最終判定待ち） | 現4段階では `claude_gpt_reviewed` に吸収。 |
| D21 | 経済学 | `claude_gpt_reviewed` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | 現4段階では整合。 |
| D22 | 経営学 | `codex_parallel_deepdive` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | Phase 4完了に加え `codex_parallel_deepdive` と `api_deepdive` の両方が存在。1軸では不足。 |
| D23 | 発達心理 | `codex_parallel_deepdive` | 🟢 Phase 4完了 + deepdive済（pjdhiro承認 2026-03-12） | 承認済かつ deepdive 済。`human_reviewed` と deepdive 手法が衝突。 |
| D24 | 宗教学 | `claude_screened` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | `REVIEW-D24-*` / `RECONCILE-D24-*` あり。`claude_screened` は過小分類。 |
| D25 | 人類学 | `claude_screened` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | `REVIEW-D25-*` / `RECONCILE-D25-*` あり。`claude_screened` は過小分類。 |
| D26 | 音楽学 | `claude_screened` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | `REVIEW-D26-*` / `RECONCILE-D26-*` あり。`claude_screened` は過小分類。 |
| D27 | 建築 | `claude_screened` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | `REVIEW-D27-*` / `RECONCILE-D27-*` あり。`claude_screened` は過小分類。 |
| D28 | 舞台芸術 | `claude_screened` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | `REVIEW-D28-*` / `RECONCILE-D28-*` あり。`claude_screened` は過小分類。 |
| D29 | 複雑系 | `claude_screened` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | `REVIEW-D29-*` / `RECONCILE-D29-*` あり。`claude_screened` は過小分類。 |
| D30 | 伝統知 | `claude_screened` | 🟣 Phase 4完了（P1 pjdhiro判断待ち） | `REVIEW-D30-*` / `RECONCILE-D30-*` あり。`claude_screened` は過小分類。 |

## 3. 不整合一覧

### 3.1 仕様正本と実装がずれている

- `docs/survey-progress-taxonomy.md` は 4段階だけを正本として定義している。
- しかし `src/reports.js` の `DEFAULT_PROGRESS_TAXONOMY` は `api_deepdive` と `codex_parallel_deepdive` を含む 6段階。
- `docs/survey-progress-taxonomy.md` は「この文書が正本」と明記しているため、このズレは単なる補足差分ではなく仕様不整合。

### 3.2 `claude_screened` の 8件は明確な誤分類

対象:

- D13
- D24
- D25
- D26
- D27
- D28
- D29
- D30

根拠:

- `claude_screened` の定義は「Claude（1ターン）による候補ピックアップ実施」。
- 上記 8件は evidence frontmatter が `Phase 4完了`。
- さらに `../kesson-driven-thinking/chatgpt/output/0304/REVIEW-*` と `RECONCILE-*` が揃っている。

したがって現行定義に照らす限り、この 8件は少なくとも `claude_gpt_reviewed` 相当であり、`claude_screened` には置けない。

### 3.3 `human_reviewed` が運用されていない

- 実装には `human_reviewed` があるが、manifest は 0件。
- `pjdhiro承認` を人間レビュー完了とみなすなら、D01/D02/D03/D06/D07/D12/D15/D16/D23 は `human_reviewed` 候補。
- 特に D01/D02/D03/D06/D07 は status 文字列に `GPTレビュー突き合わせ済み + pjdhiro承認` が明示されており、現行定義上かなり強い候補。

### 3.4 D22 / D23 は 1軸 taxonomy の限界を示している

- D22 は `codex_parallel_deepdive` で manifest 化されているが、実態としては `claude-code-agent` 18ラウンド deepdive も実施済み。
- D23 は `codex_parallel_deepdive` が入っている一方で、frontmatter は `Phase 4完了 + deepdive済（pjdhiro承認 2026-03-12）`。
- つまり D23 は「手法として deepdive 済」と「状態として人間レビュー済」が同時に真になる。

この衝突は、`progress_level` が「進捗」なのか「調査手法」なのか未確定なまま 1フィールドに押し込まれていることによる。

### 3.5 `iss62-sources/README.md` が欠落している

- 指示書の Step 1 にある `../kesson-driven-thinking/base/evidence/iss62-sources/README.md` は現環境に存在しない。
- 現在の進捗正本は、実質的に `creation-space/evidence/PROJECT.md` と各 evidence frontmatter 側に移っているように見える。

## 4. 新レベル候補

以下は「1軸 `progress_level` を続ける場合」の候補。前半 2件は実装済みだが仕様書未反映、後半 2件は `claude_screened` と `claude_gpt_reviewed` の間の欠落補完案。

| id | JA ラベル | EN ラベル | 説明 | tone | order | 該当領域 |
|---|---|---|---|---|---:|---|
| `api_deepdive` | Claude Agent深掘り済 | Claude Agent deepdive | Claude Code Agent による逐次多ラウンド深掘り探索を実施した | `primary` | 35 | D22 |
| `codex_parallel_deepdive` | Codex並列深掘り済 | Codex parallel deepdive | Codex CLI マルチエージェント（並列）による深掘り探索を実施した | `primary` | 36 | D22, D23 |
| `claude_full_reviewed` | Claude本格調査済 | Claude full review | Claude 初期抽出後、Phase 2 のフルエージェント評価を完了した。GPT独立レビュー未取得。 | `warning` | 25 | 現時点の30領域には該当なし |
| `gpt_review_received` | GPT独立レビュー取得済 | GPT independent review received | Claude 本格調査に対する GPT 独立レビューを取得済み。Phase 4 レコンサイルは未完了。 | `primary` | 28 | 現時点の30領域には該当なし |

補足:

- `claude_full_reviewed` / `gpt_review_received` は、Phase 2 完了だが Phase 4 未完了の状態を 1軸で表すための補完案。
- ただしこの 2件を入れても、D22 / D23 の「手法」と「状態」の衝突は解決しない。

## 5. 分類判断ルール案

### 5.1 推奨方針

推奨は 2軸化。

- `progress_level`: 調査のワークフロー状態
- `research_methods` または `deepdive_methods[]`: 追加で通した手法

この分離をすると、たとえば次のように表せる。

- D22: `progress_level = claude_gpt_reviewed`, `deepdive_methods = [api_deepdive, codex_parallel_deepdive]`
- D23: `progress_level = human_reviewed`, `deepdive_methods = [codex_parallel_deepdive]`

### 5.2 1軸を維持する場合の暫定ルール

| 条件 | progress_level |
|---|---|
| evidence ファイルなし | `not_surveyed` |
| Phase 1（候補リスト）完了、Phase 2 以降の成果物なし | `claude_screened` |
| Phase 2（フルエージェント評価）完了、GPTレビュー未取得 | `claude_full_reviewed` |
| Phase 3（GPT独立レビュー取得）完了、Phase 4 未レコンサイル | `gpt_review_received` |
| Phase 4（レコンサイル）完了、pjdhiro 最終確認未了 | `claude_gpt_reviewed` |
| pjdhiro しっくり感チェック / 承認完了 | `human_reviewed` |

### 5.3 deepdive 取り扱いルール

progress を本当に「進捗」として扱うなら、deepdive は `progress_level` を上書きしない方がよい。

- `api_deepdive` / `codex_parallel_deepdive` は別軸に保持する
- どうしても 1軸のまま行くなら、`progress_level` は「進捗」ではなく「調査手法」または「調査経路」と改名する
- 1軸のまま deepdive を優先すると、D23 のような承認済み領域でも `human_reviewed` を表現できない

## 6. pjdhiro への判断依頼事項

1. `progress_level` は今後も「進捗」を意味させるか。それとも UI ごと `調査手法` / `調査経路` に寄せるか。
2. D13 と D24-D30 の `claude_screened` 8件は、今回の調査結果に基づいて `claude_gpt_reviewed` へ修正してよいか。
3. `pjdhiro承認` を `human_reviewed` の機械判定条件にしてよいか。D12/D15/D16/D23 まで自動昇格させるか。
4. D22 の deepdive は `api_deepdive` と `codex_parallel_deepdive` の両方を保持するか。単一値しか持てないならどちらを優先するか。
5. D23 のように「承認済み」と「deepdive済み」が同時に立つケースで、どちらを `progress_level` に優先させるか。
6. `claude_full_reviewed` / `gpt_review_received` のような中間レベルを追加するか。それとも Phase 状態は別軸に切り出すか。
7. `docs/survey-progress-taxonomy.md` を 6段階へ更新するか、逆に `src/reports.js` を 4段階へ戻すか。

## 7. 参照メモ

- `docs/survey-progress-taxonomy.md:10-17`
- `docs/survey-progress-taxonomy.md:61-82`
- `src/reports.js:78-131`
- `src/reports.js:920-928`
- `evidence/PROJECT.md:149-180`
- `evidence/PROJECT.md:182-215`
- `evidence/deepdive/README.md:11-16`
- `evidence/deepdive/README.md:95-112`
