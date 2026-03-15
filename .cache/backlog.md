# backlog.md — 積み残しタスク管理
# 最終更新: 2026-03-15 初期構築（cs#71）

## 分類タグ

| タグ | 意味 |
|------|------|
| `ui` | UI/UX・コンポーネント・スタイリング |
| `content` | コンテンツ・テキスト・翻訳 |
| `infra` | CLI/運用インフラ・ビルド |
| `design` | 設計・アーキテクチャ |

## 記述ルール

- **依存関係を明記する**: `blocked by cs#NNN` または `→ unblocked after cs#NNN`
- **親子関係を明記する**: 親 Issue 番号を記載
- タスク完了時（CLI）: 行を削除せず `✅ 完了（log: log-*.md）` フラグを立てる
- Issue close 時は同一ターンで該当行を削除
- **親Issue**: セクションヘッダーで表現。行としては記載しない

### 依存関係の全体図

```
cs#67 運用基盤移植（親）
├── cs#68 移植: .claude/rules/ 汎用ルール5件
├── cs#69 移植: skills/ 汎用スキル4件
├── cs#70 移植: .claude/hooks/ 汎用ガード4件
├── cs#71 移植: .cache/ キャッシュ体系構築
└── cs#72 移植: docs/ 拡充（設計原則・ナビゲータ）
```

---

## CLI 作業中

（なし）

---

## Open Issue 一覧（タグ別）

### `infra` — 運用基盤移植

| Issue | タイトル | 状態 |
|-------|---------|------|
| cs#67 | kesson-driven-thinking → creation-space 運用基盤移植（親） | open |
| cs#68 | 移植: .claude/rules/ 汎用ルール5件 | open |
| cs#69 | 移植: skills/ 汎用スキル4件 | open |
| cs#70 | 移植: .claude/hooks/ 汎用ガード4件 | open |
| cs#71 | 移植: .cache/ キャッシュ体系構築 | open |
| cs#72 | 移植: docs/ 拡充（設計原則・ナビゲータ） | open |

### `ui` — UI/UX

| Issue | タイトル | 状態 |
|-------|---------|------|
| cs#65 | UI修正: dev-components.html へのナビリンクを ?dev 時のみ追加 | open |
| cs#66 | CSS リファクタリング: dev-components.html との整合性確保と共通化 | open |
