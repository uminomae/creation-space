# 教訓インデックス

**採番規則**: CL-NNN（creation-space 固有）

| ID | 日付 | 要約 | infusion先 | 状態 |
|---|---|---|---|---|
| CL-001 | 2026-03-22 | Markdown スライドは Reveal.js ではなく 16:9 HTML modal を基本にする | `docs/design-system.md`, `src/slide-viewer.js`, `src/styles/slides.css` | infused |
| CL-002 | 2026-03-15 | Agent subagent は完了処理（Issue コメント・DONE ファイル）を自発的にやらない。プロンプトに明記必須 | `.claude/rules/agent-completion.md` | infused |
| CL-003 | 2026-03-15 | データパイプラインの上流変更は下流消費者を全列挙してから投入すべき | `.claude/rules/breaking-change-checklist.md` | infused |
| CL-004 | 2026-03-15 | フィールド名・キー名の変更は破壊的変更。後方互換フォールバック必須 | `.claude/rules/breaking-change-checklist.md` | infused |
| CL-005 | 2026-03-15 | フロントエンド変更はビジュアル検証なしに品質保証できない（CLI の構造的限界） | なし（構造的問題） | identified |
| CL-006 | 2026-03-15 | 場当たり的修正の連鎖は最初の変更の影響分析不足が原因 | `.claude/rules/breaking-change-checklist.md` | infused |
| CL-007 | 2026-03-15 | Agent プロンプトに「影響範囲の検証」を明示しなければ Agent は自発的にやらない | `.claude/rules/agent-completion.md` | infused |
| CL-008 | 2026-06-21 | 原典取得は「わかったつもり」で間違える。url-verified は取得可・同定済を意味しない（cs#221/#240 の正本未統合が真因） | `docs/knowledge-raw-policy.md`, `knowledge/source-notes/READING-PROTOCOL.md`, `knowledge/raw/README.md` | infused |
| CL-009 | 2026-06-22 | 同一原典の同一領域重複が「重複と注記しながら放置」されていた。ワークフローに対応する自動テストが無いと欠陥がすり抜ける。テストの無いワークフローを作らない | `.claude/rules/source-note-invariants.md`(§2.5), `scripts/validate-manifest-sync.sh`(C10), `docs/quality-management.md`(§7-§9), `scripts/qc-all.sh` | infused |
| CL-010 | 2026-07-02 | 偽の精密さ: 未精読原典への §付き帰属は「読んだ証明」に見える幻覚の隠れ蓑。§付き引用は source-note 実在時のみ。監査成果物はスナップショット＝行動前に実物再確認 | `transform/domains/reader-rules/reader-rules-creation-report.md`, `knowledge/raw/audit/README.md`, `docs/knowledge-raw-policy.md` | infused |
