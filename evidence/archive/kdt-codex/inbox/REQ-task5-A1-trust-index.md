# REQ — TASK #5-A1: 信頼・間主観性関連の全出現箇所抽出

**依頼日**: 2026-02-08  
**依頼元**: Claude (Session 11)  
**タスク種別**: Type A（機械的検証・抽出）  
**親TASK**: TASK #5「信頼の構造モデル探索」（ISS-41拡張）  
**参照計画**: `codex/output/PLAN-task5-trust-model.md` §3.1 A1

---

## 0. 背景とブロッカー

`PLAN-task5-trust-model.md` §7で指摘されているとおり、「Session 6p: 信頼T1-T3、間主観性T4-T5」との記載が `docs/CURRENT.md` にあるが、**T1-T5の実体ファイル（定義本文）の所在が不明**。

これが本TASKの最大ブロッカーであり、A1の主目的は **T1-T5の発見**である。

---

## A. やってほしいこと

### A.1 抽出対象キーワード

以下の語彙が出現するすべての箇所を抽出せよ：

**基幹語**:
- 信頼 / trust
- 安心 / 安全 / safety / security
- 愛着 / attachment
- 間主観性 / intersubjectivity

**精神分析・発達心理学系**:
- Container / containing / contained
- 安全基地 / secure base
- 内的作業モデル / internal working model

**ビジネス系**:
- 贈与 / gift / reciprocity
- のれん / goodwill
- 純資産 / net assets / equity
- BS純資産 / PL-O（BSPLモデル関連）

### A.2 検索対象ファイル（優先度順）

| 優先度 | 対象 | 目的 |
|--------|------|------|
| ★★★ | `base/voice/pjdhiro-statements-db.md` | T1-T5候補の最有力。S22-S30周辺 |
| ★★★ | `base/schema/core-definitions.md` | D1-D4定義内での言及 |
| ★★★ | `base/schema/auxiliary/bspl-model.md` | 信頼レンズ（§4.4）、ISS-41発火点 |
| ★★ | `base/evidence/evidence-psychoanalysis.md` | Container/安全基地（EV-PA-002等） |
| ★★ | `base/evidence/evidence-business-org.md` | 組織Container/心理的安全 |
| ★★ | `base/evidence/evidence-life-sciences.md` | 余力条件（代謝/炎症/睡眠） |
| ★ | `base/schema/auxiliary/*.md`（他の補助モデル） | 関連言及の可能性 |
| ★ | `base/concepts/*.md` | 概念ノート内での展開 |
| ★ | `docs/quality-management.md` | TC-009等での生存-信頼分解文脈 |
| ★ | `docs/decision-log/` | 過去の検討ログ（特に2026-01以降） |

**検索対象外**:
- `transform/`, `outputs/`, `archive/`, `sessions/`, `inbox/`（これらはbase/層ではない）

### A.3 出力形式

以下の表形式で索引を作成せよ：

```markdown
| ファイル | セクション/行 | キーワード | 要約（1行） | タグ | 備考 |
|---------|-------------|-----------|-----------|------|------|
| base/voice/pjdhiro-statements-db.md | S23 | 信頼, 片側性 | 片側から始まる信頼（母子/ブランド） | - | T候補？ |
| base/schema/core-definitions.md | D4 | 信頼, 信頼軸 | 情動構成での信頼軸評価 | [M] | - |
| ... | ... | ... | ... | ... | ... |
```

**列の定義**:
- **ファイル**: 相対パス（`base/`起点）
- **セクション/行**: 見出し名 or 行番号範囲
- **キーワード**: 該当したキーワード（複数可）
- **要約**: その箇所で何が述べられているか（20-30語以内）
- **タグ**: 既存の[P][M][S]タグがあれば転記。なければ空欄
- **備考**: "T1-T5候補" / "ISS-41関連" / "Container定義" 等

### A.4 特別指示: T1-T5の発見

**T1-T5らしき記述**を見つけたら、備考欄に `T候補？` と明記せよ。

判定基準（推測）:
- 「信頼」を構造的に記述している（感情ラベルでなく、プロセス/構成として）
- 複数の記述がT1, T2, ... のように番号付けされている、または階層構造を持つ
- S22-S30周辺（voice DB）にある可能性が高い

**見つからない場合の報告**:
- 「T1-T5に該当する構造的定義は発見できなかった」と明記
- 代わりに「信頼の構造的記述」候補を3-5件リストアップ

---

## B. やってほしくないこと

- ❌ **新しい定義を創作しない**（あくまで既存記述の抽出）
- ❌ **transform/, outputs/を検索しない**（base/層のみ）
- ❌ **[P][M][S]タグを勝手に付与しない**（既存のものを転記するのみ）
- ❌ **牽強付会な「関連」を拡大しない**（キーワード一致ベースで機械的に）

---

## C. 品質チェック（納品前に自己確認）

### C.1 完了条件

- [ ] 抽出対象キーワード11種すべてについて検索を実施した
- [ ] 優先度★★★の3ファイルは必ず検索した
- [ ] T1-T5候補の有無を明記した（見つからなくても報告）
- [ ] 索引表の各列（ファイル/セクション/キーワード/要約/タグ/備考）が全行埋まっている
- [ ] 出力形式（Markdown表）が整形されている

### C.2 Safety Valve

- **[UNCERTAIN]**: 「これがT1-T5かどうか判断できない」場合は備考に明記
- **[UNABLE_TO_VERIFY]**: ファイルが見つからない、アクセスできない場合

---

## D. 成果物の配置

**出力先**: `codex/output/REPORT-task5-A1-trust-index.md`

**構成案**:
```markdown
# REPORT — TASK #5-A1: 信頼・間主観性関連の全出現箇所抽出

## 0. Executive Summary
- 検索対象: X件のファイル
- ヒット総数: Y箇所
- T1-T5候補: Z件（または「未発見」）

## 1. 索引表（全文）
[A.3の表形式]

## 2. T1-T5発見状況
- 候補X件をリスト
- または「未発見。代替候補として以下を推薦」

## 3. キーワード別出現頻度
[Optional: どのキーワードがどのファイルに多いか]

## 4. 次ステップ提案
[A2/A3への移行条件、または追加調査の必要性]
```

---

## E. 完了後の連絡

`codex/output/REPORT-task5-A1-trust-index.md` を配置したら、このREQファイルの冒頭に以下を追記せよ：

```markdown
**STATUS**: ✅ COMPLETED (YYYY-MM-DD)
**REPORT**: codex/output/REPORT-task5-A1-trust-index.md
```

---

## F. 参照資料

- `codex/output/PLAN-task5-trust-model.md` §3.1 A1（本タスクの詳細）
- `docs/README.md` §12（ファイルカタログ）
- `base/schema/core-definitions.md`（D1-D4）
- `skills/codex-agent/SKILL.md` §Type A（機械的タスクの品質基準）
- `skills/codex-agent/references/track-record.md` TR-001/002（参照監査の実績）
