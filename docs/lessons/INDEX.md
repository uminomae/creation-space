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
