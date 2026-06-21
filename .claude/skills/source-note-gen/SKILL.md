---
name: source-note-gen
description: >
  manifest の raw-confirmed/url-verified 行から source-note を生成するパイプライン。
  未生成 source-note の検出 → source-reader 起動 → 不変条件チェックのワークフロー。
  triggers: "source-note生成", "source-note 未生成", "manifest消化", "source-reader起動"
---

# source-note-gen — Source Note 生成パイプライン

`.claude/rules/source-note-invariants.md` の「原典 → source-note 1:1 原則」を実装するスキル。

## 未生成チェック

```bash
# 未生成 source-note を検出
bash .claude/hooks/source-note-gen-check.sh
# または
cat .cache/inbox/cs-source-note-gen-*.md 2>/dev/null | head -50
```

出力例（各行が生成対象）:
```
D03-S08: knowledge/raw/D03-S08_example.pdf (raw-confirmed)
D12-S03: https://example.com/paper (url-verified)
```

## 生成手順

### Step 1: 対象の選定

未生成リストから1件を選ぶ。選定基準（優先順）:
1. inbox の依頼順
2. raw-confirmed（PDFあり）を url-verified より優先
3. source-note が少ない領域を優先（`find knowledge/source-notes -name "D*-S*_*.md" | cut -d/ -f3 | sort | uniq -c | sort -n` で確認）

### Step 2: source-reader エージェントを起動

```
Agent(source-reader): 
  対象: {source_id} ({アクセス方法})
  manifest行: {manifest から貼り付け}
  出力先: knowledge/source-notes/D{NN}/{source_id}_{slug}.md
```

### Step 3: 不変条件チェック（生成後）

```bash
# 1. ファイルが作成されたか
ls knowledge/source-notes/D{NN}/{source_id}_*.md

# 2. frontmatter 必須フィールドの確認
for field in source_id title authors year domain_id access_status; do
  grep -q "^${field}:" knowledge/source-notes/D{NN}/{source_id}_*.md || echo "MISSING: $field"
done

# 3. 領域の source-note 数が ≥5 か
count=$(find knowledge/source-notes/D{NN} -name "D{NN}-S*_*.md" | wc -l)
echo "D{NN}: $count 本 (MIN=5)"
[ $count -ge 5 ] || echo "WARNING: 5本未満"

# 4. validate-manifest-sync Check 6
bash scripts/validate-manifest-sync.sh 2>&1 | grep "Check 6"
```

### Step 4: 同一コミット内の関連更新

source-note を生成したら、同一コミットで以下も確認・更新する（`source-note-invariants.md §3`）:
- `knowledge/source-notes/D{NN}/D{NN}-summary.md` — 領域サマリに追記
- 関連 `evidence/evidence-D{NN}-*.md` — 5段階モデル上の位置付けに影響がある場合
- `knowledge/source-notes/cross-refs/` — 領域跨ぎ接続がある場合

## verify 節

```bash
bash scripts/validate-manifest-sync.sh | grep -E "Check [36]"
find knowledge/source-notes -name "D*-S*_*.md" | cut -d/ -f3 | sort | uniq -c
```
