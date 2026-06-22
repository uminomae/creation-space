# creation-space 品質管理

**バージョン**: 1.0
**更新日**: 2026-03-15

> 移植元: 旧 private repo の quality-management.md から AI 協働プロジェクト汎用の項目を抽出・適応。

---

## 1. 品質チェック（6項目）

| # | チェック項目 | 対象 | 実行者 |
|---|-------------|------|--------|
| 1 | レイヤ分離: 調査事実 / 解釈 / 仮説を混在させない | テキスト全般 | AI |
| 2 | 牽強付会チェック: 表面的な数の一致や用語の類似だけで構造対応を主張していないか | 調査・レポート | AI |
| 3 | 出自明示: AI 生成と人間判断を区別できるか | テキスト全般 | AI |
| 4 | 情報一元化: 同じ情報が複数箇所に存在しないか（正本 + リンク） | 管理書類 | AI |
| 5 | 運用整合性テスト（OPS）→ §3 | 新規ファイル作成時 | AI |
| 6 | 人間レビュー: pjdhiro が方針・公開判定を確認したか | 公開前 | **pjdhiro** |

---

## 2. テキスト品質基準

### 日本語

- 主語と述語の対応が明確であること
- 一文一義を原則とし、長文を避ける
- 専門用語には初出時に簡潔な説明を添える

### 英語

- ネイティブ読者が自然に読める文体を目指す
- 日本語からの直訳調を避ける
- 学術領域の用語は当該分野の慣用に従う

### 共通

- 数値・件数・状態を記述するときは実測に基づくこと（推測なら明示）
- 引用元がある場合は出典を記載する

---

## 3. 運用整合性テスト（OPS）

新規ファイル・ディレクトリ・ワークフロー作成時に確認する。

| # | 項目 |
|---|------|
| OPS-1 | この提案はユーザーの手動作業を増やすか？ |
| OPS-2 | `docs/README.md` と矛盾しないか？ |
| OPS-3 | 作成したファイルは使う場面で実際に参照できるか？ |
| OPS-4 | 同じ情報が複数箇所に存在しないか？ |
| OPS-5 | 壊れた場合の復元手順は明確か？（Git 履歴で復元可能か） |

---

## 4. コミット前チェック

1. `git diff --stat` で変更範囲を確認
2. 品質チェック #1-#5 に該当する変更がないか確認
3. `Co-Authored-By` がコミットメッセージに含まれているか
4. 管理書類（`CLAUDE.md`, `docs/README.md`, `.claude/rules/`）の整合が取れているか

---

## 5. 成果物（PDF・レポート）品質基準

| # | 項目 |
|---|------|
| P-1 | タイトル・日付・著者（生成 AI 含む）が明記されているか |
| P-2 | 調査ラベル（`docs/evidence-metadata-creation.md` 参照）が正しく付与されているか |
| P-3 | 内部管理用の情報（Issue 番号、作業メモ等）が最終出力に混入していないか |
| P-4 | リンク切れがないか |

---

## 6. レビュー基準

| 観点 | 確認内容 |
|------|---------|
| 正確性 | 事実と異なる記述がないか。AI 生成の要約が原文の意味を変えていないか |
| 網羅性 | 必要な領域・観点が欠落していないか |
| 忖度耐性 | 指示に合わせて結論を歪めていないか（設計原則 L5） |
| 再現性 | 別のセッション・別の AI が同じ入力から同等の結果を得られるか |

---

## 7. 自動テスト・カタログ（決定的テストの正本, cs#249）

> **本節が「テスト手順・リストの正本」**。新しい決定的テスト（script / hook / skill 検査）を追加したら、必ず本表に登録すること。LLM ラッパー不要の検査はここに集約し、`scripts/qc-all.sh` で一括実行する。

### 7.1 一括ランナー

```bash
bash scripts/qc-all.sh          # 決定的テストを網羅実行（PASS/FAIL/SKIP を集計）
bash scripts/qc-all.sh --deep   # PDF抽出測定など時間のかかる検査も含む
```

- **main checkout（develop）で実行する**。linked worktree では hooks の相対 symlink が切れ・隣接 pjdhiro の配信先が無いため、環境依存テストは自動 SKIP される。
- 終了コード: 全 PASS=0 / 1件以上 FAIL=1。

### 7.2 テスト一覧

| テスト | コマンド | 何を守るか | 主トリガー | qc-all |
|---|---|---|---|---|
| manifest 整合 + 原典重複 | `bash scripts/validate-manifest-sync.sh` | taxonomy/progress 整合(C1,4,5)・source-note≥5(C6)・書誌ドリフト(C8)・dashboard鮮度(C9)・**原典重複(C10)** | source-note / manifest / progress 変更時 | ✅ |
| 配信 JSON 整合 | `node scripts/generate-domains-json.mjs --check` | index.json → domains.json の同期 | index.json 変更時 | ✅(pjdhiro時) |
| dashboard 鮮度 | `node scripts/generate-dashboard-stats.mjs --check` | dashboard-stats.json の手集計ドリフト | manifest/source-note 増減時 | ✅ |
| hooks 健全性 | `bash scripts/verify-hooks.sh` | hooks の存在・実行権・_common 依存・hooks.json 整合 | hook 追加/改名時 | ✅(main時) |
| ドメイン日付一致 | `bash scripts/verify-domain-dates.sh --all` | レポート内日付の整合 (cs#128) | レポート再生成時 | ✅ |
| ガイド evidence 制約 | `bash scripts/validate-guide-evidence.sh` | ガイドが evidence 制約を満たすか | ガイド生成時 | ✅(pjdhiro時) |
| スライド URL 整合 | `bash scripts/verify-slide-urls.sh` | slug ↔ 実ファイル名 | スライド公開時 | ✅(pjdhiro時) |
| インフォグラフィック状態 | `bash scripts/verify-infographic-status.sh` | infographic workflow 完了 | infographic 作業時 | （個別） |
| nl-debug 死参照 | `bash .claude/skills/nl-debug/scripts/check-dead-refs.sh` | manifest/source-note の死リンク | 定期 | ✅ |
| nl-debug 書誌照合 | `bash .claude/skills/nl-debug/scripts/bib-crosscheck.sh` | PDF実体 ↔ 書誌の齟齬候補 | 定期 | ✅ |
| nl-debug PDF抽出 | `bash .claude/skills/nl-debug/scripts/check-pdf-extract.sh` | PDF からの抽出可否測定 | 定期(--deep) | ✅(--deep) |
| Agent 完了検証 | `bash scripts/agent-post-check.sh` | DONE/Issueコメント/pending agents | Agent 完了後 | （個別） |
| 枠ゲート | `bash scripts/budget-check.sh` | サブエージェント枠消費 (cs#246) | Agent 起動前 | （個別） |

> hooks（`.claude/hooks/*-guard.sh`）は「コミット/編集の瞬間に自動で効く」予防的テスト。一覧と守護者対応は `docs/guardian-matrix.md` を正本とする（本表と相補）。

## 8. ワークフロー × 品質書類 対応表（cs#249）

> **不変原則**: すべてのワークフローは、対応する品質書類（生成ルール／品質基準／自動テスト）と**セットで**存在しなければならない。新しいワークフローを作るときは、本表に行を追加し、品質書類が無ければ同時に作る。「テストの無いワークフロー」を作らない。

| ワークフロー | 手順書 | 品質書類（基準/レビュー） | 自動テスト |
|---|---|---|---|
| source-note 生成・backfill | `source-note-gen` skill / `.claude/rules/source-note-invariants.md` | 同 §1-§8（1:1原則・≥5本・**原典重複禁止§2.5**・改訂同時更新） | `validate-manifest-sync.sh`(C6/C8/**C10**) / nl-debug |
| 領域レポート生成 | `domain-report` skill / `transform/domains/WORKFLOW.md` | `transform/domains/quality-test/quality-test-domain-report.md` / `quality-criteria.md` | `verify-domain-dates.sh --all` / `report-quality-evaluator` agent |
| ガイド生成 | `transform/guides/WORKFLOW.md` | `transform/guides/quality-test/quality-test-guide.md` / `reader-rules/evidence-constraint.md` | `validate-guide-evidence.sh` |
| テーマレポート | `transform/themes/` | `transform/themes/quality-test-theme-report.md` | （手動レビュー） |
| progress_level 遷移 | `phase-gate` skill / `.claude/rules/evidence-progress.md` | 同（4箇所整合チェックリスト） | `validate-manifest-sync.sh`(C1/C4/C5) / `progress-level-guard.sh` hook |
| 配信データ生成 | `scripts/generate-domains-json.mjs` | `.claude/rules/breaking-change-checklist.md` | `generate-domains-json.mjs --check` / `domains-json-sync-guard.sh` hook |
| スライド/インフォグラフィック | `rich-slides` skill | `docs/design-system.md` / `dev-components.html` | `verify-slide-urls.sh` / `verify-infographic-status.sh` |
| Agent 並行作業 | `.claude/rules/parallel-worktree.md` / `agent-completion.md` | 同（完了処理・所有権） | `agent-post-check.sh` / `budget-check.sh` |
| 30領域 網羅デバッグ | `nl-debug` skill | 同 SKILL（severity 付きレポート） | nl-debug scripts 一式 |

> 欠落検知: `periodic-review` 時に本表を走査し、品質書類または自動テストが空欄のワークフローを洗い出す（守護者不在チェックと同様）。

## 9. 定期・網羅テスト ランブック（cs#249）

「気づいたら個別修正」ではなく、**定期的に網羅実行**して劣化を検知する。

| タイミング | 実行 | 目的 |
|---|---|---|
| `periodic-review` 実行時（定期） | `bash scripts/qc-all.sh --deep`（main checkout） | 全決定的テストの網羅実行・劣化検知 |
| 大きな backfill / 一括生成の後 | `bash scripts/qc-all.sh` | 投入物の整合・重複・ドリフト一括検査 |
| push 前（develop） | `bash scripts/validate-manifest-sync.sh` 最低限 | コミット直前の回帰検知 |
| ワークフロー追加時 | §8 表に登録 + 対応テストを作成し §7 に登録 | 「テストの無いワークフロー」を残さない |

手順:
1. main checkout（develop）に切替（worktree では環境依存テストが SKIP される）。
2. `bash scripts/qc-all.sh --deep` を実行。
3. FAIL があれば該当テストの出力で原因を特定し修正。`bib-crosscheck` 等の「要確認フラグ」は Main が PDF実体と source-note を読んで最終判定。
4. 結果サマリを `periodic-review` の state / Issue に記録。

## 更新履歴

| 日付 | バージョン | 内容 |
|------|-----------|------|
| 2026-06-22 | 1.1 | §7 自動テストカタログ / §8 ワークフロー×品質書類対応表 / §9 定期網羅ランブック を追加。`scripts/qc-all.sh` 新設 (cs#249) |
| 2026-03-15 | 1.0 | 初版。旧 private repo から汎用項目を抽出して新規作成 (cs#67) |
