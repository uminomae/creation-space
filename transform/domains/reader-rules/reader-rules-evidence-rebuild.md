---
file_id: RR-EVIDENCE-REBUILD
last_updated: 2026-05-06
status: "Active"
parent_issue: cs#223
governs:
  - evidence/evidence-D??-*.md (rebuild 対象)
sot:
  - knowledge/source-notes/D??/D??-S??_*.md (原典 source-note = 単一真実源)
---

# evidence/ rebuild ルール

cs#223 で確定。`evidence/evidence-D??-*.md` を `knowledge/source-notes/`
（旧称 wiki）と `evidence/similar-papers/` から再構成する際の規則。

## 0. 思想

source-note を単一真実源（SoT）とし、evidence は領域横断の整理層に位置づける。

## 1. 判定軸（4 段階）

| 値 | 意味 | 必要条件 |
|---|---|---|
| `direct` | `knowledge/source-notes/` 原典 source-note を直接引用 | source-note §3（原文引用 + ページ番号）への参照 |
| `similar` | `evidence/similar-papers/` 経由の補強 | similar-papers manifest 行への参照 |
| `archive-historical` | archive 旧版にあったが原典再確認していない | `provenance: archive-EV-D??-NNN` field |
| `unverified` | それ以外 | — |

`accepted` 判定は撤廃。

## 2. 引用扱い

evidence は「5 段階対応の集積」が用途。原文引用は source-note §3 に集約し、evidence 側は

- 5 段階対応表（段階 / 対応の要旨 / 強度 / source-note への ページ参照）
- source-note への link

を持つ。短い 1 行引用は補助として可（例外規定）。

## 3. archive 旧版との関係

- 各 evidence 冒頭に `> archive: archive/pre-rerun-20260407/evidence/evidence-D??-*.md` の 1 行のみ
- entry 単位で archive 由来の場合は `provenance: archive-EV-D??-NNN` field
- 詳細な変更経緯は `evidence/CHANGELOG.md` に集約

## 4. 5 段階対応の明示

evidence 本体の構成:

1. ヘッダー（YAML frontmatter） + archive 1 行参照 + 概要
2. **段階別マトリクス** — 5 段階 × source の表（強 / 弱 / なし）。`similar` 由来は `(sim)` マーカー
3. **source 別セクション** — source-note §5（5段階対応候補表）をリンク or 再掲、`direct` / `similar` / `archive-historical` / `unverified` 判定を明示

マトリクス自動生成 script は別 issue（要起票）で分離。

## 5. 類似論文 153 本（similar-papers）の扱い

- 段階別マトリクスで `(sim)` マーカー
- evidence 末尾に `## 類似論文` セクション、similar-papers の該当 paper をリスト
- 重みづけ明示と DRY を両立

## 6. evidence ファイル構造（テンプレート）

```markdown
---
file_id: EV-D??
domain: <name>
domain_id: D??
last_updated: <YYYY-MM-DD>
entry_count: <N>
status: "Rebuilt from source-notes (cs#224)"
provenance_archive: "archive/pre-rerun-20260407/evidence/evidence-D??-*.md"
---

# 論拠DB：<領域名>（D??）

> archive: archive/pre-rerun-20260407/evidence/evidence-D??-*.md

**概要**: ...

## 段階別マトリクス

| 段階 | source 群 |
|------|-----------|
| 1 場 (Field) | [D??-S?? (direct)], [D??-Sxx (sim)], ... |
| 2 波 (Wave) | ... |
| 3 縁 (Relation) | ... |
| 4 渦 (Vortex) | ... |
| 5 束 (Bundle) | ... |

## source 別セクション

### EV-D??-S?? <タイトル>

- **判定**: direct / similar / archive-historical / unverified
- **provenance**: archive-EV-D??-NNN  (archive-historical のみ)
- **source-note**: [knowledge/source-notes/D??/D??-S??_*.md](...)
- **5段階対応**: source-note §5 から再掲 or リンク
  - 場: ...
  - 波: ...
  - 縁: ...
  - 渦: ...
  - 束: ...
- **mechanism_type**: T1 / T7 / etc (任意)

...

## 類似論文

| source_id | 著者 (年) | stage_affinity | OA URL |
|---|---|---|---|
| D??-Sxx | ... | Stage 3 | ... |
```

## 7. 用語

issue 文中の「wiki」は実体名 `knowledge/source-notes/` を指す。
決定文書では実体名で統一する。

## 8. 関連

- cs#217 Phase 3 SYNTHESIS（親 issue、I1 判断: (C) wiki ベース再構成）
- cs#223 本ルール起源（5 論点決定）
- cs#224 evidence rebuild umbrella（実装）
- knowledge/source-notes/READING-PROTOCOL.md（source-note 生成プロトコル）
- knowledge/five-stages-guide.md
