# TASK #10系 深掘りブリーフィング索引

**作成日**: 2026-02-07
**作成者**: Claude.ai（Session 9a）
**状態**: Codex投入待ち

---

## タスク一覧

| TASK | ブリーフィング | Type | 出力先 | 依存 |
|------|-------------|------|--------|------|
| #10c | briefing-10c-uncertain-resolution.md | C | REPORT-抱持-uncertain-resolution.md | なし（先行） |
| #10d | briefing-10d-container-mapping.md | C | REPORT-container-mapping.md | #10c（あれば参照） |
| #10e | briefing-10e-boundary-casebook.md | C | REPORT-boundary-casebook.md | #10c, #10d（あれば参照） |
| #10f | briefing-10f-matching-recalibration.md | C | REPORT-matching-recalibration.md | #10c（あれば参照） |
| #10g | briefing-10g-collective-抱持-rubric.md | C | REPORT-collective-抱持-rubric.md | #10d（あれば参照） |

---

## 依存関係図

```
#10c [UNCERTAIN]精度上げ ──┬──→ #10e ケースブック
  （先行・独立）          ├──→ #10f マッチング再校正
                          │
#10d Container対応表 ─────┤
  （先行・独立）          ├──→ #10e ケースブック
                          └──→ #10g 集団ルーブリック
```

### 依存の性質

全依存は**soft dependency（あれば参照、なければ現行版で進行）**。
5タスク全てを一括投入可能。Codexが先に完了したタスクの出力を後続タスクが参照する形。

---

## Codex投入時の注意

1. **5タスクを同時投入する**。依存はsoft（各ブリーフィングの§0/§8に「存在すれば参照」と明記済み）
2. **出力ディレクトリ**: 全て `codex/archive/deepdive/REPORT-*.md`
3. **必読ファイルの共通基盤**: 5タスク全てが以下を参照する
   - `codex/archive/deepdive/REPORT-抱持-observability.md`
   - `codex/archive/deepdive/REPORT-抱持-structuring.md`
   - `base/schema/core-definitions.md`
4. **タスク番号**: #10c, #10d, #10e, #10f, #10g（#10a=#10本体, #10b=observability）

---

## TR-005ドラフト（REPORT-抱持-observability.mdレビュー結果）

track-record.mdへの追記用。

```markdown
## TR-005: 抱持 Observability (2026-02-07)

**Task**: TASK #10b — 抱持段階の観測可能化（フルルーブリック）
**Type**: C（Creative analysis + Structure building）
**Briefing**: `docs/briefings/briefing-抱持-observability.md`（明示的ブリーフィング文書あり）

### Results

- 7段階×4観点（言語/行動/身体/内省）の観測指標: 全段階カバー
- 6組の隣接境界判定ガイド: 核心的差異→判定質問→誤判定パターンの3点セット
- Layer 0-3チェックリスト: 計25問（L0:6, L1:6, L2:6, L3:7）
- 段階判定フロー（簡易版）
- [UNCERTAIN]残量: 3件（意図的保持）
- 付録A: 7段階クイックカード

### Capability Assessment

| 能力 | 評価 |
|------|------|
| ブリーフィング構造の忠実な展開 | ✅ §A-§D＋付録の全セクション完備 |
| タグ運用 | ✅ 5種タグ（UNCERTAIN/SPECULATIVE/SELF-REPORT_BIAS/CONTEXT_DEPENDENT/SCALE_JUMP）を誠実・一貫に使用 |
| Evidence接続 | ✅ 7領域中6領域カバー（数学/哲学系未参照は妥当） |
| D1-D4整合性 | ✅ 全段階がD3定義を軸に記述。D3-aの精神（条件の揃い方）が一貫 |
| 安全弁（ラベル化防止） | ✅ §0.2「人のラベルにしない」が§D.2・クイックカードの3箇所で一貫 |
| §B境界判定ガイドの実用性 | ✅ 特にB.3（3↔4）とB.5（5↔6）が実践レベル |

### Briefing Quality Impact

- §0の用語制約・禁止パターン・Safety Valve宣言がタグ運用品質を直接担保
- 完了条件の8項目チェックリストが構造の網羅性を保証
- 出力フォーマットの事前指定がセクション構造の安定に寄与

### Trust Update

| Type | Trust Level | Change |
|------|-------------|--------|
| C (Creative) | **High** | Medium-high → High。TR-003からの再現性確認 |

### Learning #7

Type Cの連続投入（#10→#10b）で前タスクの[UNCERTAIN]を次タスクの入力に使う「チェーン」パターンが有効。
今回の#10c-#10gはこのパターンをさらに拡張し、5タスクの並列チェーンを構成する。
```

---

## 次のアクション

1. **pjdhiroレビュー**: 5本のブリーフィングを確認
2. **ディレクトリ決定**: `docs/briefings/` に配置するか、別のパスにするか
3. **Codex投入**: 5タスク一括
4. **TR-005確定**: track-record.mdへの追記（_instructions.md作成）
5. **CURRENT.md更新**: Session 9a成果反映
