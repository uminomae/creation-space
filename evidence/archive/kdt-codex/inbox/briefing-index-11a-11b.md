# TASK #11系 ブリーフィング索引

**作成日**: 2026-02-08
**作成者**: Claude.ai（Session 10）

---

## タスク一覧

| TASK | ブリーフィング | Type | 内容 | 依存 |
|------|-------------|------|------|------|
| #11a | briefing-11a-base-integration.md | A | #10c-g REPORTをbase/に配置 | なし |
| #11b | briefing-11b-post-integration-admin.md | A | TR-006, CURRENT更新, アーカイブ移設 | #11a完了後 |

## 依存関係

```
#11a base/配置 ──→ #11b 管理タスク一括
（hard dependency: #11aが完了してから#11bを実行）
```

## 実行順序

1. #11a を実行（2コミット）
2. #11a の完了条件を確認
3. #11b を実行（1コミット）

## codex/inbox/ への配置

```
codex/inbox/briefing-11a-base-integration.md
codex/inbox/briefing-11b-post-integration-admin.md
codex/inbox/briefing-index-11a-11b.md
```
