# 30領域統一調査プロトコル（Phase 5-7）

**バージョン**: 1.0
**作成日**: 2026-03-17
**状態**: 策定済み・試行前

---

## 概要

Phase 1-4（幅優先スキャン→本格調査→GPTレビュー→突き合わせ）は30領域で統一済み・完了済み。
本プロトコルは Phase 4 以降の深掘り調査を統一し、30領域に適用する Phase 5-7 の仕様を定める。

旧名称（deepdive, run1, insight1, cross-insight）は内容を表さないため廃止。
ツール名（codex-parallel, claude-code-agent）もディレクトリ名から排除し、README メタデータに記録する。

---

## Phase 命名

| Phase | slug | 日本語名 | 内容 |
|-------|------|---------|------|
| Phase 5 | evidence-audit | 論拠監査 | 既存エントリの強度分類・ギャップ分析・境界ガード・5段階カバレッジ |
| Phase 6 | structural-reread | 構造再読 | 各エントリを「正確/怪しい/破綻/未見」の4軸で再読 |
| Phase 7 | cross-domain-synthesis | 横断統合 | 領域内の横断パターン抽出・段階定義の精緻化・盲点特定 |

---

## ディレクトリ構造

```
evidence/investigation/
  PROTOCOL.md                    ← 本ファイル（統一プロトコル仕様書）
  README.md                      ← 実施状況テーブル
  D{NN}-{slug}/
    phase5-evidence-audit/
      README.md                  ← 実行メタデータ
      output.md                  ← 主成果物
    phase6-structural-reread/
      README.md
      output.md
    phase7-cross-domain-synthesis/
      README.md
      output.md
```

---

## スコープガード（全Phase共通）

- 主語は常に「5段階モデルとの構造類似」。ドメイン理論の拡張ではない
- 5段階構造比較 >80%、ドメイン固有語 <20%
- 3文以上ドメイン理論を書いたら必ず5段階に接続する
- 弱い理論を無理に強く見せない
- Safety valve タグ: `[SPECULATIVE]`, `[WEAK_MAPPING]`, `[SCALE_JUMP]`, `[UNCERTAIN]`

---

## Phase 5: evidence-audit（論拠監査）

### 入力

| 優先度 | ファイル |
|--------|---------|
| ★★★ | `evidence-D{NN}.md` |
| ★★★ | `DR-D{NN}.md`（Deep Research一次ソース） |
| ★★ | GPTレビュー・reconcile 結果 |
| ★ | 公開ドメインレポート（存在する場合） |

### output.md 構造

1. **Scope** — 何を監査し、何をしないか
2. **Summary** — 件数、Anchor/Scoped/High-risk 分類、ギャップ候補数、5段階カバレッジ概要
3. **Entry-level audit** — 全エントリ × 強度tier・カバレッジ・課題・推奨アクション
4. **Gap scan** — 不足候補の優先順位付きリスト
5. **Boundary guard** — スコープドリフト・過適合リスク・隣接領域との境界
6. **Stage coverage map** — 場・波・縁・渦・束 × 強いエントリ/弱いエントリ
7. **Safety valves** — ドメイン固有の過適合防止ルール
8. **Audit verdict** — 新規/変更/棄却/維持の件数

### 実行環境

- Codex CLI サブエージェント（gpt-5.4 xhigh）
- 並列実行可

---

## Phase 6: structural-reread（構造再読）

### 前提

Phase 5 完了・品質ゲート通過済み

### 入力

| 優先度 | ファイル |
|--------|---------|
| ★★★ | `evidence-D{NN}.md` |
| ★★★ | Phase 5 output.md |
| ★★ | DR-D{NN}.md |
| ★★ | GPTレビュー結果 |

### output.md 構造

- **§A: Entry-by-entry reread** — 全エントリ × 正確な対応/怪しい対応/破綻箇所/見えていなかった構造
- **§B: 再読から浮上した問い** — 3-7件、5段階モデル視点で記述
- **§C: 仮説と統合的知見** — 2-5件、`[SPECULATIVE]`等タグ付き
- **§D: 保持論点**

### 実行環境

- Claude CLI バックグラウンド実行（claude-opus-4-6）

---

## Phase 7: cross-domain-synthesis（横断統合）

### 前提

Phase 6 完了・品質ゲート通過済み

### 入力

| 優先度 | ファイル |
|--------|---------|
| ★★★ | `evidence-D{NN}.md` |
| ★★★ | Phase 6 output.md |
| ★★ | Phase 5 output.md |
| ★★ | GPTレビュー結果 |
| ★ | 5段階モデル定義 |

### output.md 構造

- **§A: 横断パターン** — 3-7件
- **§B: 精度と限界** — 強い対応の条件/破綻条件/比較原則
- **§C: 盲点** — 2件以上
- **§D: 保持論点の更新**
- **§E: 段階定義の精緻化提案** — 場・波・縁・渦・束 × 現理解/D{NN}からの更新/確信度

### 実行環境

- Claude CLI バックグラウンド実行（claude-opus-4-6）

---

## 品質ゲート（Phase 完了時）

| # | チェック項目 |
|---|------------|
| 1 | output.md が存在し、プロトコル指定の全セクションヘッダーがある |
| 2 | README.md メタデータが完備（実行日・モデル・入力・出力・完了チェックリスト） |
| 3 | JURISDICTION-CHECK: 5段階比較 >80% |
| 4 | evidence の全エントリが output に登場（漏れなし） |
| 5 | pjdhiro の「しっくり感チェック」（主要発見2-3件） |

---

## 実行モデル

| Phase | 実行環境 | モデル | 方式 |
|-------|---------|--------|------|
| Phase 5（論拠監査） | Codex CLI | gpt-5.4 xhigh | サブエージェント（並列可） |
| Phase 6（構造再読） | Claude CLI | claude-opus-4-6 | バックグラウンド実行 |
| Phase 7（横断統合） | Claude CLI | claude-opus-4-6 | バックグラウンド実行 |

- **Phase 5→6→7 は通しで実行**（途中の pjdhiro 確認なし。品質ゲートは自動チェックのみ）
- 完了後にまとめて pjdhiro がレビュー
- 同一 Phase は複数領域で並行実行可
- 1領域 = 1指示書（Phase 5-7 を通しで記載）

---

## 指示書テンプレート構成

1領域 = 1指示書。以下の構成で作成する。

1. 対象領域（D{NN} + slug）
2. PROTOCOL.md 参照指示
3. 入力ファイル一覧（★★★/★★/★ 優先度付き）
4. Phase 5 の具体的指示 + 完了条件 + 出力先
5. Phase 6 の具体的指示 + 完了条件 + 出力先
6. Phase 7 の具体的指示 + 完了条件 + 出力先
7. スコープガード（80/20 ルール、anti-drift）
8. Safety valve タグ使用ルール
9. README メタデータ記載指示

---

## README.md メタデータ（各Phase）

```markdown
- 実行日: YYYY-MM-DD
- モデル: （LLMが自己申告した値）
- 入力ファイル: （列挙）
- 出力ファイル: output.md
- evidence フラグ: [ai:investigation:{model}]
- 完了チェックリスト:
  - [ ] 全セクションヘッダー存在
  - [ ] JURISDICTION-CHECK 通過
  - [ ] 全エントリ網羅
  - [ ] pjdhiro しっくり感チェック
```

---

## evidence フラグ・progress_level

- evidence フラグ: `[ai:investigation:{model}]`（Phase 7 完了時に付与）
- progress_level: `investigation_complete`（Phase 7 完了のみ記録。途中経過は内部管理のみ）

---

## ドメインレポート §2 テンプレ追記

Phase 5-7 完了領域のドメインレポート §2「調査の方法」に以下を追加:

> Phase 5（論拠監査）で既存{N}件の強度分類とギャップ分析を実施し、Phase 6（構造再読）で各エントリの5段階対応を4軸で再評価した。Phase 7（横断統合）で領域内の横断パターンを抽出した。
