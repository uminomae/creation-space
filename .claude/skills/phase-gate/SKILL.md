---
name: phase-gate
description: >
  progress_level 遷移前の4箇所整合チェックを機械化するスキル。
  evidence-progress.md のチェックリストをコマンド付きで実行する。
  変更の実施は含まない（pjdhiro 専権）。
  triggers: "progress_level 変更", "phase遷移", "phase-gate", "progress更新"
---

# phase-gate — Progress Level 遷移 整合チェック

`.claude/rules/evidence-progress.md §Phase遷移チェックリスト` をコマンド付きで実行するスキル。
**このスキルは検証のみ。変更実施は pjdhiro 承認後の別作業。**

## Step 1: 変更前の現在値を記録

```bash
python3 -c "
import json
with open('transform/domains/publish/domains/index.json') as f:
    d = json.load(f)
for r in d['reports']:
    print(r['id'], r.get('progress_level', '(none)'))
"
```

## Step 2: taxonomy ID の確認

使おうとしている ID が `index.json` の `progress_taxonomy[]` に存在するか確認:

```bash
python3 -c "
import json
with open('transform/domains/publish/domains/index.json') as f:
    d = json.load(f)
print('定義済み taxonomy IDs:', [t['id'] for t in d['progress_taxonomy']])
"
```

## Step 3: 4箇所の整合確認

| 箇所 | ファイル | 確認内容 |
|------|----------|----------|
| 1 | `docs/evidence-metadata-creation.md §2` | taxonomy 定義の記述 |
| 2 | `transform/domains/publish/domains/index.json` | progress_taxonomy[] + reports[].progress_level |
| 3 | `src/reports/data.js` | DEFAULT_PROGRESS_TAXONOMY の id リスト |
| 4 | `src/reports/data.js` | normalizeProgressLevel() の後方互換マッピング |

```bash
# 3と4の確認コマンド
grep -A 30 "DEFAULT_PROGRESS_TAXONOMY" src/reports/data.js | grep "id:"
grep -A 20 "normalizeProgressLevel" src/reports/data.js
```

## Step 4: 検証コマンド実行

```bash
# スキーマ検証
node scripts/generate-domains-json.mjs --check
# → 期待: "Schema validation: OK" + "No differences"

# 総合検証（Check 1/4/5 を確認）
bash scripts/validate-manifest-sync.sh
# → 期待: Check 4 PASS, Check 5 PASS（Check 1 は pjdhiro repo 不在で SKIP）
```

## Step 5: 結果を pjdhiro に提示

チェック結果を Issue コメントで報告:
```
## phase-gate 検証結果 ({date})

変更対象: progress_level `{旧}` → `{新}` ({N}領域)

### 4箇所整合チェック
- [ ] taxonomy ID `{id}` が index.json に存在: {OK/NG}
- [ ] data.js DEFAULT_PROGRESS_TAXONOMY に `{id}` が存在: {OK/NG}
- [ ] normalizeProgressLevel で旧 ID の後方互換マッピングが不要であること確認: {OK/NG}

### スクリプト検証
- generate-domains-json.mjs --check: {OK/NG}
- validate-manifest-sync.sh Check 4/5: {OK/NG}

### 変更実施の可否
{問題なし → 実施可 / 問題あり → 要解決後に再チェック}
```

## verify 節

```bash
bash scripts/validate-manifest-sync.sh | grep -E "(Check [145]|PASS|FAIL)"
node scripts/generate-domains-json.mjs --check
```
