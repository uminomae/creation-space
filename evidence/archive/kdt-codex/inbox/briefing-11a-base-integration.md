# briefing-11a-base-integration.md

**タスク名**: TASK #11a — REPORT #10c-g のbase/配置
**Type**: A（Mechanical — ファイル生成 + パッチ適用）
**出力先**: 各ファイルを直接配置（下記マッピング参照）
**作成日**: 2026-02-08

---

## 0. Source Repository

**リポジトリ**: `uminomae/kesson-driven-thinking`（GitHub, Private）
**ブランチ**: `develop`

### 必読ファイル

| 優先度 | パス | 読む理由 |
|--------|------|----------|
| ★★★ | `docs/architecture.md` | base/の構造を理解する |
| ★★★ | `base/text/m1-consciousness-os/part-5-抱持.md` | #10cパッチの適用先 |
| ★★★ | `base/schema/core-definitions.md` | D3, D3-aの確認 |
| ★★ | `base/concepts/index.md` | 概念ノート一覧。新規CN番号の採番 |
| ★★ | 下記ソースREPORT 5本 | 配置元 |

### ソースREPORT（5本）

| TASK | ソースパス |
|------|-----------|
| #10c | `codex/output/REPORT-抱持-uncertain-resolution.md` |
| #10d | `codex/output/REPORT-container-mapping.md` |
| #10e | `codex/output/REPORT-boundary-casebook.md` |
| #10f | `codex/output/REPORT-matching-recalibration.md` |
| #10g | `codex/output/REPORT-collective-抱持-rubric.md` |

---

## 1. 配置マッピング

| TASK | 操作 | 配置先 | 備考 |
|------|------|--------|------|
| #10c | **パッチ** | `base/text/m1-consciousness-os/part-5-抱持.md` | REPORTの§1.4, §2.4, §3.4の差分提案に従い、指定箇所に追記。REPORT自体はcodex/output/に残す |
| #10d | **新規作成** | `base/schema/container-mapping.md` | REPORTの§0（Container6類型）+ §A（段階×Container効果表）+ §B（失敗モード）を抽出・再構成 |
| #10e | **新規作成** | `base/concepts/CN-003_boundary-casebook.md` | REPORTの§A-§Eを概念ノート形式に変換 |
| #10f | **新規作成** | `base/schema/抱持-matching-v2.md` | REPORTの§D（v2統合表）を中心に、§C（横断分析）を付録として含める |
| #10g | **新規作成** | `base/concepts/CN-004_collective-抱持.md` | REPORTの§A-§Dを概念ノート形式に変換。ISS-34の最小回答として位置づけ |

---

## 2. 各操作の詳細

### 2.1 #10c → part-5-抱持.md パッチ

REPORTの差分提案を適用する。正本を読んで該当箇所を特定すること。

| 差分 | 対象セクション | 操作 |
|------|---------------|------|
| §1.4 | part-5-抱持.md 内の段階3身体的兆候の記述 | 「腹側迷走が戻りつつ交感動員が残る（急かし）」の運用語彙を追記。`[CONTEXT_DEPENDENT]``[SPECULATIVE]`タグ付き |
| §1.4 | part-5-抱持.md 内の限界の記述（あれば） | 「身体兆候だけでは段階3の識別が弱い→L1/L3兆候と併用する」運用原則を追記 |
| §2.4 | part-5-抱持.md 内の段階4の観測指標 | 追加指標4つ（語彙変化、質問応答パターン、外部化物の差分、時間軸）を追記 |
| §3.4 | part-5-抱持.md 内の段階5↔6の判定 | 内在化の兆候3つ（不在時の保持、外部化の継続、別関係での成立）と段階的撤去の枠組みを追記 |

**注意**: part-5-抱持.mdの既存構造を壊さない。追記のみ。

### 2.2 #10d → base/schema/container-mapping.md 新規作成

以下の構造で新規作成する:

```markdown
# Container対応表（Container Mapping）

## 概要
抱持 7段階に対する Container 6類型の効果・失敗モード対応表。

## Container 6類型
[REPORT §0のContainer6類型表をそのまま転記]

## 段階×Container効果表
[REPORT §Aの7段階×6類型の表を転記。◎/○/△/× + 機序 + 具体例 + Evidence + タグ]

## 失敗モード（段階別）
[REPORT §Bの各段階の「やってはいけない」を転記]

## 撤去の枠組み
[REPORT §Cの撤去関連記述を転記]

## 出典
本ファイルは codex/output/REPORT-container-mapping.md から抽出・再構成した。
```

**注意**: REPORTの`[UNCERTAIN]`タグはそのまま保持する。

### 2.3 #10e → base/concepts/CN-003_boundary-casebook.md 新規作成

概念ノートの必須セクション構成（architecture.md §2.5参照）に従う:

```markdown
# CN-003: 境界ケースブック（抱持 3↔4 / 4↔5 / 5↔6）

## 1. 概要
## 2. 関連する定義・スキーマ
## 3. 本文（§A-§E をREPORTからそのまま転記）
## 4. 他概念との関係
## 5. 出典
```

**注意**: 会話断片の理論用語不使用・Safety Valveタグをそのまま保持。

### 2.4 #10f → base/schema/抱持-matching-v2.md 新規作成

```markdown
# 抱持 マッチング表 v2（有向7×7）

## 概要
## マッチング表 v2（§D統合表をそのまま転記）
## 横断分析（§C: H2検証、非対称性、共倒れパターン）
## 限界と残課題（§E）
## 出典
```

### 2.5 #10g → base/concepts/CN-004_collective-抱持.md 新規作成

```markdown
# CN-004: 集団抱持最小ルーブリック（ISS-34）

## 1. 概要（スケールジャンプの原則を含む）
## 2. 関連する定義・スキーマ
## 3. 本文（§A-§D をREPORTからそのまま転記）
## 4. 他概念との関係
## 5. 残課題（§D.3の将来タスク候補）
## 6. 出典
```

**注意**: `[SCALE_JUMP]`タグを全項目で保持。

---

## 3. 付随更新

| 対象 | 操作 |
|------|------|
| `base/concepts/index.md` | CN-003, CN-004を追加 |
| `docs/architecture.md` §2 | base/schema/ に container-mapping.md, 抱持-matching-v2.md を追加（ファイル一覧がある場合） |

---

## 4. コミット

2コミットに分ける:

1. **コミット1**: `feat: apply #10c patch to part-5-抱持.md`
   - part-5-抱持.md への追記のみ

2. **コミット2**: `feat: add #10d-g outputs to base/ (schema + concepts)`
   - base/schema/container-mapping.md（新規）
   - base/schema/抱持-matching-v2.md（新規）
   - base/concepts/CN-003_boundary-casebook.md（新規）
   - base/concepts/CN-004_collective-抱持.md（新規）
   - base/concepts/index.md（更新）

---

## 5. 完了条件

| # | 条件 |
|---|------|
| 1 | part-5-抱持.md に#10cの差分が追記されている |
| 2 | base/schema/container-mapping.md が存在し、7段階×6類型の表がある |
| 3 | base/schema/抱持-matching-v2.md が存在し、7×7マトリクスがある |
| 4 | base/concepts/CN-003_boundary-casebook.md が存在し、9ケースがある |
| 5 | base/concepts/CN-004_collective-抱持.md が存在し、3軸チェックリストがある |
| 6 | base/concepts/index.md にCN-003, CN-004が登録されている |
| 7 | Safety Valveタグが全ファイルで保持されている |
| 8 | 2コミットが develop ブランチに作成されている |

---

## 6. 注意事項

- **REPORTの内容を改変しない**。構造の再構成（見出しの付け替え）は可だが、中身の編集・削除はしない
- `[UNCERTAIN]`や`[SCALE_JUMP]`等のタグは理論上の安全弁であり、削除してはならない
- CN番号（CN-003, CN-004）は `base/concepts/index.md` の既存番号と衝突しないことを確認してから採番せよ
- codex/output/ のREPORT原本はそのまま残す（アーカイブ移設は別タスク）
