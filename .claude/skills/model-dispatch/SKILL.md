---
name: model-dispatch
description: >
  設計と実行のモデル振り分け方針（ポインタ）。Fable 5（Main）= 設計者・複雑推論・
  統合判断、Opus/Sonnet/Haiku = 調査・実装の実行。正本は project-design。
  triggers: "model-dispatch", "モデル振り分け", "fable5 で設計", "実行は opus/sonnet で"
---

# model-dispatch（ポインタ）

**正本**: `/Users/uminomae/dev/project-design/.claude/skills/model-dispatch/SKILL.md`

このスキルを使うときは、まず上記の正本を Read すること。

## cs での適用メモ

- 枠ゲート: `bash scripts/budget-check.sh --plan N`（cs#246）
- cs の team agents は 2 種のみ（team-researcher / team-critic）。
  worker / planner が要るフェーズは Main（Fable 5）が代行するか、
  汎用 `claude` subagent + `model: "sonnet"` で立てる
- 完了処理: `.claude/rules/agent-completion.md`
- 初出ユースケース: cs#259（TH-001 READER パイプライン）
