---
name: adversarial-review
description: >
  敵対的パネルレビュー（ポインタ）。高スティクスかつ係争的/検証可能な結論に、
  誤りの非相関（別ファミリー > 別Claudeモデル > 方法論分岐）×検証優位（再現による反証）の
  パネルを立てる。正本は project-design。agent-team-workflow REVIEW の Adversarial モードとしても呼ばれる。
  triggers: "敵対的レビュー", "adversarial review", "red-team this", "議論させて確かめて", "セカンドオピニオン", "パネルレビュー"
---

# adversarial-review（ポインタ）

**正本**: `/Users/uminomae/dev/project-design/.claude/skills/adversarial-review/SKILL.md`

このスキルを使うときは、まず上記の正本を Read すること。

## cs での適用メモ

- **枠ゲート**: Round 0 トリアージ直後に `bash scripts/budget-check.sh --plan {パネリスト数×ラウンド数相当}`。
  SUBAGENT_OK → 2×3 ／ CAUTION → 2×2・Sonnet/Haiku ／ MAIN_ONLY → 順次分離セクション縮退（弱いと明記）or pjdhiro 承認
- **適用先（優先順）**: 公開前ゲート（RC 系の上位互換）> 五段階接地判定の定常化 > source-note 解釈品質 > phase-gate
- **cs の team agents は 2 種のみ**（team-researcher / team-critic）。パネリストは汎用 `claude` subagent + `model` パラメータで立てる
- 完了処理: `.claude/rules/agent-completion.md`
- 先行実践: cs#258 W4b 盲検再導出・RC1/RC2（`evidence/themes/TH-001-wave-vortex-ontology/TEST-w4b-rc1-20260710.md`）
- 初回試行: cs#261 W8（TH-001 第2期の敵対的調査ラウンド）
