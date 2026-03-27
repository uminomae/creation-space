---
name: agent-team-workflow
description: |
  マルチエージェントチームによる汎用ワークフロー。
  SURVEY → REVIEW → PLAN → REVIEW → EXECUTE → REVIEW → CLOSE の7フェーズ。
  共通REVIEWエンジンと検証プリミティブV1-V6を持つ。
triggers: |
  「エージェントチームで」「マルチエージェントで」「チームレビューして」
  「agent-team-workflow で」
applyTo: "skills/, .cache/"
agent: "CLI"
---

# agent-team-workflow スキル

**バージョン**: 1.0
**作成日**: 2026-03-27
**Issue**: cs#188
**参照元**: [Imbad0202/academic-research-skills](https://github.com/Imbad0202/academic-research-skills) (CC BY-NC 4.0) のエッセンスを抽出し、pjdhiro プロジェクト向けに独自設計・独自実装。

---

## 0. 概要

全スキル・全CLIの基本作業フローをマルチエージェントチームで実行する汎用ワークフロー。

### 呼び出し方

| 方法 | 例 |
|------|-----|
| **全体実行** | 「このタスクを agent-team-workflow で」 |
| **特定 Phase のみ** | evidence 更新時 → Phase 2 のみ / コミット前 → Phase 6 のみ |
| **指示書から課題注入** | SKILL.md は骨格、具体的な課題・ゴール・スキップ指定はテンプレートで渡す |

不要な Phase はスキップしてよい。LLM または指示書が判断する。

---

## 1. ワークフロー

```
Phase 1: SURVEY（調査）
    ↓
Phase 2: REVIEW（調査のレビュー）── 未収束 → Phase 1 へ
    ↓
Phase 3: PLAN（計画）
    ↓
Phase 4: REVIEW（計画のレビュー）── 未収束 → Phase 3 へ
    ↓
Phase 5: EXECUTE（実装）
    ↓
Phase 6: REVIEW（実装のレビュー）── 未収束 → Phase 5 へ
    ↓
Phase 7: CLOSE
```

### Phase 1: SURVEY（調査）

1. **A5 共有辞書ロード**: 全 agent が共有する用語定義・判定基準・重大度レベルを読み込む
2. **B5 動的ペルソナ構成**: タスク内容を分析し、agent の役割を自動構成する
3. **並行調査**: 各 agent が同時に調査を実行
4. **V1-V6 裏取り**: 必要に応じて検証プリミティブを呼ぶ

**入力**: タスク定義（指示書 or 口頭指示）
**出力**: 調査結果（agent ごとの findings）

### Phase 2: REVIEW（調査のレビュー）

REVIEW エンジン（§2）を実行。入力 = Phase 1 の調査結果。
未収束なら Phase 1 へ戻る。

### Phase 3: PLAN（計画）

調査結果をもとに実行計画を立てる。

**入力**: Phase 2 で収束した調査結果 + INSIGHT
**出力**: 実行計画（ステップ・担当・成果物定義）

### Phase 4: REVIEW（計画のレビュー）

REVIEW エンジン（§2）を実行。入力 = Phase 3 の計画。
未収束なら Phase 3 へ戻る。

### Phase 5: EXECUTE（実装）

計画に基づいて実行する。

**入力**: Phase 4 で収束した計画
**出力**: 実装結果（コード・文書・成果物）

### Phase 6: REVIEW（実装のレビュー）

REVIEW エンジン（§2）を実行。入力 = Phase 5 の実装結果。
未収束なら Phase 5 へ戻る。

### Phase 7: CLOSE

1. **A6 メタ評価**（任意）: プロセス全体の協働品質を6次元で評価
2. 成果物の最終確認
3. 学んだことの記録（教訓候補があれば即記録）

---

## 2. REVIEW エンジン（共通サイクル）

毎回同じエンジン。入力が違うだけ（調査結果 / 計画 / 実装結果）。

```
┌─ A7 Question taxonomy
│    各 agent が問い種別を分担して投げる
│
├─ B4 Handoff schemas
│    結果を統一フォーマットに揃える
│
├─ A8 Consensus classification
│    合意度を判定する
│
├─ A3 INSIGHT extraction
│    発見を構造化して蓄積する
│
└─ A2 Convergence criteria
     収束判定。未収束なら前 Phase へ
```

### A7 Question taxonomy

agent が投げる問いの種別。全種類を網羅的に使う必要はなく、文脈に応じて選択する。

| 種別 | 目的 | 例 |
|------|------|-----|
| **clarifying** | 曖昧さの解消 | 「この用語の定義は？」 |
| **probing** | 深掘り | 「根拠は何か？」 |
| **structuring** | 構造化 | 「これらの関係は？」 |
| **challenging** | 異議申立て | 「反例はないか？」 |

### B4 Handoff schemas

agent 間・ラウンド間のデータ受け渡し型。

```yaml
handoff:
  from: "{agent_name}"
  phase: "{phase_number}"
  round: "{round_number}"
  findings:
    - claim: "{主張}"
      evidence: "{根拠}"
      confidence: high | medium | low
      verification: [V1, V2, ...]  # 使用した検証プリミティブ
  questions:
    - type: clarifying | probing | structuring | challenging
      target: "{対象}"
      content: "{問い}"
  insights: ["{INSIGHT}"]
```

### A8 Consensus classification

| レベル | 意味 | 次のアクション |
|--------|------|---------------|
| **CONSENSUS-4** | 全 agent 合意 | 収束 → 次 Phase へ |
| **CONSENSUS-3** | 大多数合意、軽微な留保 | 留保を記録して収束 |
| **SPLIT** | 意見が割れている | 追加ラウンドで深掘り |
| **CRITICAL** | 根本的な不一致 | 前 Phase に差し戻し |

### A3 INSIGHT extraction

各ラウンドで発見された洞察を構造化して蓄積する。

```yaml
insight:
  id: "INSIGHT-{NNN}"
  phase: "{phase_number}"
  round: "{round_number}"
  content: "{洞察の内容}"
  source_agents: ["{agent_name}"]
  confidence: high | medium | low
  actionable: true | false
```

### A2 Convergence criteria

収束の4シグナル。3つ以上満たせば収束とする。

| # | シグナル | 判定 |
|---|---------|------|
| 1 | **合意度** | CONSENSUS-4 or CONSENSUS-3 |
| 2 | **新規 INSIGHT** | 直近ラウンドで新規 INSIGHT が出なくなった |
| 3 | **未解決問い** | challenging 問いが全て回答済み |
| 4 | **ラウンド上限** | 最大3ラウンド（デフォルト。指示書で変更可） |

---

## 3. 検証プリミティブ（V1-V6）

REVIEW エンジン内で agent が必要に応じて呼ぶツール。

| # | 名前 | 問い | 使いどころ |
|---|------|------|-----------|
| **V1** | verify-reference | 参照先は実在するか？ | ファイルパス、URL、Issue 番号の実在確認 |
| **V2** | verify-claim | 主張と根拠は一致するか？ | 引用・数値・事実の照合 |
| **V3** | challenge-claim | 最強の反論は何か？ | Devil's Advocate。主張の堅牢性テスト |
| **V4** | detect-cherry | 都合の良い証拠だけ拾っていないか？ | 確証バイアスの検出 |
| **V5** | check-scope | 証拠の範囲を超えて一般化していないか？ | 過度な一般化の検出 |
| **V6** | check-logic | 論理の飛躍はないか？ | 前提→結論の論理チェック |

### 使用ガイドライン

- V1-V2 は **事実検証**。調査フェーズで積極的に使う
- V3-V6 は **批判的検証**。REVIEW フェーズで使う
- 全てを毎回使う必要はない。agent が文脈に応じて選択する

---

## 4. 基盤

### A5 Cross-Agent Alignment（共有辞書）

全 agent が共有する定義。ワークフロー開始時にロードする。

```yaml
alignment:
  terms:
    # プロジェクト固有の用語定義をここに置く
    # 例: 「欠損」「抱持」「情動の構成」
  severity_levels:
    critical: "プロジェクトの前提を覆す問題"
    major: "成果物の品質に影響する問題"
    minor: "改善の余地がある点"
    info: "参考情報"
  judgment_criteria:
    # タスク固有の判定基準をここに置く
```

### B5 Dynamic Persona Config（動的ペルソナ構成）

タスク内容を分析して agent の役割を自動構成する。

**デフォルト構成**（タスク種別に応じて増減）:

| agent | 役割 |
|-------|------|
| **researcher** | 調査・情報収集 |
| **critic** | 批判的検証（V3-V6 の主な使い手） |
| **architect** | 構造化・計画立案 |
| **implementer** | 実装・実行 |

**構成ルール**:
- 最小2 agent、最大5 agent
- タスクの複雑さに応じて LLM が判断
- 指示書で明示的に指定することも可能

---

## 5. A6 メタ評価（Phase 7 CLOSE 用）

プロセス全体の協働品質を評価する。任意実行。

| 次元 | 評価観点 |
|------|---------|
| **coverage** | 調査の網羅性 |
| **depth** | 分析の深さ |
| **rigor** | 検証の厳密さ |
| **coherence** | 成果物の一貫性 |
| **efficiency** | ラウンド数・時間の妥当性 |
| **novelty** | 新規 INSIGHT の質 |

---

## Gotchas

- **全 Phase 実行は重い**: 小タスクでは Phase 1-2 のみ、または Phase 5-6 のみで十分なことが多い。指示書でスキップを明示する
- **ラウンド上限に注意**: デフォルト3ラウンドで収束しない場合、問題の分割を検討する
- **V1-V6 の過剰使用**: 全検証を毎回回すとコストが高い。agent の判断に委ねる
- **共有辞書の肥大化**: プロジェクト固有用語が増えすぎたら分割を検討

---

## 更新履歴

| 日付 | バージョン | 内容 |
|------|-----------|------|
| 2026-03-27 | 1.0 | 初版。cs#188 設計に基づき骨格を作成 |
