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

**バージョン**: 1.2
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
| **特定 Phase のみ** | 「Phase 1-2 だけ」「REVIEW だけ」 |
| **指示書から課題注入** | SKILL.md は骨格、具体的な課題・ゴール・スキップ指定はテンプレートで渡す |

不要な Phase はスキップしてよい。LLM または指示書が判断する。

### Agent 定義

| agent | 定義ファイル | 役割 |
|-------|-------------|------|
| **researcher** | `.claude/agents/team-researcher.md` | 調査・情報収集・V1-V2 事実検証 |
| **critic** | `.claude/agents/team-critic.md` | 批判的検証・V3-V6・合意度判定 |
| **architect** | Main が兼任（デフォルト） | 構造化・計画立案 |
| **implementer** | Main が兼任（デフォルト） | 実装・実行 |

最小構成は researcher + critic の2 agent。Main（呼び出し元）が architect/implementer を兼任する。

---

## 1. 実行手順

### Step 0: 起動準備

Main（本体セッション）が以下を実行する:

1. **タスク定義の確認**: 何を調べ/作り/検証するか
2. **Phase 選択**: 全 Phase か、特定 Phase のみか
3. **共有辞書の構築**: タスクに関連する用語・判定基準を整理

```yaml
# Main が構築する共有辞書（タスクごとに内容が変わる）
alignment:
  task: "{タスクの1行説明}"
  terms:
    # タスク固有の用語定義
  severity_levels:
    critical: "プロジェクトの前提を覆す問題"
    major: "成果物の品質に影響する問題"
    minor: "改善の余地がある点"
    info: "参考情報"
  scope: "{調査範囲の制約}"
  skip_phases: []  # スキップする Phase 番号
```

---

### Phase 1: SURVEY（調査）

**実行者**: researcher agent（Agent Teams で起動）

**Main の手順**:

1. Agent Teams で team-researcher を起動する。プロンプトに以下を含める:
   - `.claude/agents/team-researcher.md` を読むこと
   - alignment（共有辞書）
   - 答えるべき questions リスト
   - 調査範囲（scope）

2. 複数の観点がある場合、researcher を並行起動してよい（最大3並行）

**researcher の出力**: Handoff フォーマット（§3 参照）

---

### Phase 2: REVIEW（調査のレビュー）

**実行者**: critic agent（Agent Teams で起動）

**Main の手順**:

1. Phase 1 の researcher 出力を集約する
2. Agent Teams で team-critic を起動する。プロンプトに以下を含める:
   - `.claude/agents/team-critic.md` を読むこと
   - alignment（共有辞書）
   - researcher の Handoff 出力（全 agent 分）

3. critic の出力を確認する:
   - **CONSENSUS-4 / CONSENSUS-3** → Phase 3 へ進む
   - **SPLIT** → researcher を追加ラウンドで再起動（最大3ラウンド）
   - **CRITICAL** → Phase 1 からやり直し（問いを修正して再調査）

**critic の出力**: Review フォーマット（§3 参照）

---

### Phase 3: PLAN（計画）

**実行者**: Main（architect 兼任）

**Main の手順**:

1. Phase 2 の収束した調査結果 + INSIGHT を読む
2. 実行計画を立てる:
   - ステップの分解
   - 各ステップの担当（Main / agent）
   - 成果物の定義
   - リスクと対策

---

### Phase 4: REVIEW（計画のレビュー）

Phase 2 と同じ手順。入力 = Phase 3 の計画。

---

### Phase 5: EXECUTE（実装）

**実行者**: Main（implementer 兼任）、必要に応じて Agent-WT

**Main の手順**:

1. Phase 4 で収束した計画に基づいて実装する
2. ファイル編集を伴う独立タスクは Agent-WT（worktree）で並行実行可
3. 実装結果を記録する

---

### Phase 6: REVIEW（実装のレビュー）

Phase 2 と同じ手順。入力 = Phase 5 の実装結果。

---

### Phase 7: CLOSE

**実行者**: Main

1. 成果物の最終確認
2. INSIGHT の棚卸し（有用なものを記録）
3. 教訓候補があれば即記録（lessons INDEX.md）
4. メタ評価（任意、§5 参照）

---

## 2. REVIEW エンジン詳細

毎回同じエンジン。入力が違うだけ（調査結果 / 計画 / 実装結果）。

```
Main が critic を起動
  → critic が Question taxonomy で問いを生成
  → critic が V3-V6 で検証
  → critic が Consensus を判定
  → critic が INSIGHT を抽出
  → critic が収束判定を返す
Main が判定を確認
  → 収束 → 次 Phase
  → 未収束 → 前 Phase に差し戻し or 追加ラウンド
```

### 収束の4シグナル（3つ以上で収束）

| # | シグナル | 判定 |
|---|---------|------|
| 1 | **合意度** | CONSENSUS-4 or CONSENSUS-3 |
| 2 | **新規 INSIGHT** | 直近ラウンドで新規 INSIGHT が出なくなった |
| 3 | **未解決問い** | challenging 問いが全て回答済み |
| 4 | **ラウンド上限** | 最大3ラウンド（デフォルト。指示書で変更可） |

---

## 3. データフォーマット

### Handoff（researcher → Main）

```yaml
handoff:
  from: "researcher"
  phase: 1
  round: 1
  findings:
    - claim: "{主張}"
      evidence: "{根拠}"
      confidence: high | medium | low
      verification: [V1, V2]
  questions:
    - type: clarifying | probing | structuring | challenging
      target: "{対象}"
      content: "{問い}"
  insights: ["{INSIGHT}"]
```

### Review（critic → Main）

```yaml
review:
  from: "critic"
  phase: 2
  round: 1
  consensus: CONSENSUS-4 | CONSENSUS-3 | SPLIT | CRITICAL
  questions:
    - type: challenging
      target: "{対象の claim}"
      content: "{問い}"
      verification: [V3, V4, V5, V6]
  issues:
    - severity: critical | major | minor | info
      target: "{対象}"
      description: "{問題の説明}"
      suggestion: "{改善案}"
  insights: ["{検証から得られた洞察}"]
  convergence:
    agreement: true | false
    new_insights: true | false
    open_challenges: 0
    recommendation: "proceed | additional_round | escalate"
```

---

## 4. 検証プリミティブ（V1-V6）

| # | 名前 | 問い | 実行者 | 使いどころ |
|---|------|------|--------|-----------|
| **V1** | verify-reference | 参照先は実在するか？ | researcher | ファイル・URL・Issue 実在確認 |
| **V2** | verify-claim | 主張と根拠は一致するか？ | researcher | 引用・数値・事実の照合 |
| **V3** | challenge-claim | 最強の反論は何か？ | critic | Devil's Advocate |
| **V4** | detect-cherry | 都合の良い証拠だけ拾っていないか？ | critic | 確証バイアス検出 |
| **V5** | check-scope | 証拠の範囲を超えて一般化していないか？ | critic | 過度な一般化検出 |
| **V6** | check-logic | 論理の飛躍はないか？ | critic | 論理チェック |

---

## 5. メタ評価（Phase 7 CLOSE 用、任意）

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

- **全 Phase 実行は重い**: 小タスクでは Phase 1-2 のみ、または Phase 5-6 のみで十分
- **ラウンド上限**: デフォルト3ラウンドで収束しない場合、問題の分割を検討
- **V1-V6 の過剰使用**: 全検証を毎回回すとコスト高。agent の判断に委ねる
- **Main の役割**: Main は orchestrator。agent の起動・結果の集約・判定・次 Phase への遷移を制御する

---

## 更新履歴

| 日付 | バージョン | 内容 |
|------|-----------|------|
| 2026-03-27 | 1.2 | Agent subagent → Agent Teams に切り替え |
| 2026-03-27 | 1.1 | 実行可能な手順に更新。Agent 定義追加、Main の具体的手順を記述 |
| 2026-03-27 | 1.0 | 初版。cs#188 設計に基づき骨格を作成 |
