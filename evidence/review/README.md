# evidence/review/ -- 調査レビューと計画書

このディレクトリは、30領域構造類似調査の設計、進捗、横断分析、Phase 2 評価結果をまとめた場所である。

## 5W1H

### What

調査の計画書、横断分析レポート、進捗ログ、判断待ち一覧、Phase 2 評価結果を置く。
現在は 15 ファイルある。

### Why

evidence 本体だけでは「どういう設計で調査し、どこで判断が分かれ、何が残課題か」が追えない。
本ディレクトリは、調査プロセスの設計と意思決定の履歴を残し、後続の見直しや再利用を可能にするためにある。

### Who

pjdhiro、Claude、Codex が主に使う。
調査を設計する人、横断分析を行う人、過去の判断根拠を参照したい人が読む。

### When

2026-02-21 から 2026-03-09 にかけて作成・更新された。
元は旧 private repo の `base/evidence/review/` にあり、2026-03-10 に #180 で creation-space へ移動した。

### Where

現在地は `creation-space/evidence/review/`。
30領域構造類似調査の「分析層」「計画層」に相当する。

### How

Phase ごとに計画書を作り、実行し、横断メモを蓄積し、必要なタイミングでレビュー・報告書へ圧縮するサイクルで増えてきた。
個別領域の evidence を読むだけでなく、ここを読むと調査全体の意図と履歴が見える。

## 参照

- 全体状態: [status-report-20260226.md](status-report-20260226.md)
- P1 横断洞察: [p1-cross-domain-insights.md](p1-cross-domain-insights.md)
- フィールドワーク設計: [plan-step7-fieldwork.md](plan-step7-fieldwork.md)
- 親憲章: [../PROJECT.md](../PROJECT.md)
- 関連記録番号: #61, #62, #180

## ファイル一覧

| ファイル | 役割 |
|---|---|
| `codex-cross-domain-analysis-v2.md` | Codex による全30領域 DR 横断分析の記録 |
| `codex-review-step5.md` | Step 5 幅優先フェーズに対する Codex 監査レポート |
| `coverage-review-20260221.md` | 23領域→30領域拡張のための分野網羅性レビュー |
| `d01-phase2-evaluation.md` | D01 数学の Phase 2 評価ドラフト |
| `d02-phase2-evaluation.md` | D02 物理学の Phase 2 評価ドラフト |
| `exploration-questions.md` | 全30領域の深掘りで使う EQ-1〜EQ-5 の問い |
| `judgments.md` | pjdhiro の判断待ち項目を集約した一覧 |
| `memo-level2.md` | Level 2 均一化作業中のメモと保持論点 |
| `p1-cross-domain-insights.md` | P1 しっくり感チェック中に得た横断洞察ログ |
| `plan-level2-uniform.md` | 旧 Step 4.5 の均一化計画書 |
| `plan-step6-fieldwork.md` | Step 6 本格調査の計画書 v2 |
| `plan-step7-fieldwork.md` | Step 7 30領域×10理論評価の設計書 |
| `progress-log.md` | Step 4.5 の作業進捗ログ |
| `status-report-20260226.md` | サブプロジェクト全体の状態報告書 |
| `step5-survey-report.md` | 幅優先フェーズ完了報告（Step 5a） |
