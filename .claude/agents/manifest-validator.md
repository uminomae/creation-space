---
name: manifest-validator
description: >
  [DEPRECATED: cs#246] LLM ラッパー不要の決定的処理のため廃止。
  代替: `bash scripts/validate-manifest-sync.sh` を Main が直接実行する。
  phase-gate スキルを使うと進行ゲートの手順も含む。
model: haiku
tools:
  - Read
  - Glob
  - Grep
  - Bash
maxTurns: 15
---

# Manifest Validator [DEPRECATED]

**cs#246 で廃止。直接スクリプト実行に置き換える:**

```bash
bash scripts/validate-manifest-sync.sh
node scripts/generate-domains-json.mjs --check
```

progress_level 遷移チェックは `/phase-gate` スキルを使うこと。
