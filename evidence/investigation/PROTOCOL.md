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
| Phase 8 | cross-domain-exploration | 領域横断探索 | 30領域横断のインサイト探索（3層: 圧縮→テーマ分析→統合） |

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
| Phase 8 Layer 1（圧縮） | Claude CLI | claude-opus-4-6 | Agent-BG x 2並行 |
| Phase 8 Layer 2（テーマ分析） | Claude CLI | claude-opus-4-6 | Agent-BG x 2並行 |
| Phase 8 Layer 3（統合） | Claude CLI Main | claude-opus-4-6 | 手動実行 |

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

## Phase 8: cross-domain-exploration（領域横断インサイト探索）

### 概要

Phase 5-7 は **1領域内** の深掘り。Phase 8 は **30領域横断** のインサイト探索。
3層ハイブリッド方式で、コンテキスト制約と各種バイアスに対処する。

### 前提

Phase 7 が全30領域で完了していること。

### 3層構造

| Layer | slug | 内容 | 入力 | 出力 |
|-------|------|------|------|------|
| Layer 1 | card-compression | Phase 7 output を圧縮カードに変換 | Phase 7 output x 1本 | `phase8/cards/card-D{NN}.md` x 30 |
| Layer 2 | theme-analysis | テーマ別横断分析 | 圧縮カード30枚 + 原文最大5本 | `phase8/themes/theme-{slug}.md` x 5-7 |
| Layer 3 | synthesis | テーマ統合 | Layer 2 出力 + カード集計 | `phase8/phase8-synthesis.md` |

### ディレクトリ構造

```
evidence/investigation/phase8/
  PROTOCOL-phase8.md           ← Phase 8 固有の詳細仕様
  README.md                    ← 実施状況
  theme-seeds.md               ← テーマ候補リスト
  theme-registry.md            ← テーマ x 領域マトリクス
  card-template.md             ← 圧縮カードテンプレート
  cards/
    card-D{NN}.md x 30         ← 圧縮カード
  themes/
    theme-{slug}.md x 5-7      ← テーマ別横断分析
  phase8-synthesis.md           ← 最終統合文書
```

### Layer 1: card-compression（圧縮カード生成）

**入力（各タスク）:**
- Phase 7 output.md（~14KB）— 1本のみ
- card-template.md（~1KB）

**圧縮カード構造（~2KB/枚）:**
1. パターン一覧（§A抽出）: # / パターン名 / 関連段階 / 強度 / 1行要約
2. 段階提案（§E抽出）: 段階 / 提案内容 / 確信度
3. 盲点（§C抽出）: # / 盲点名 / 他領域との接続可能性
4. 保持論点（§D抽出）: # / 論点 / 状態
5. 破綻条件（§B抽出）: # / 条件 / 5段階への含意
6. 除外パターン: # / 除外理由

**圧縮原則:**
- パターンのエントリ対応（「なぜそう言えるか」）は削除。必要時に原文参照
- 段階提案は「現理解」列を削除し「更新内容」と「確信度」のみ
- §B の「強い対応の条件」と「比較原則」は除外（Layer 2 で必要時に原文参照）
- **除外パターンセクション必須**: 面白くないパターンの消失防止

**実行環境:**
- Agent-BG x 2並行
- investigation-dispatch チェーン構造を流用

### Layer 2: theme-analysis（テーマ別横断分析）

**入力（各テーマ）:**
- 圧縮カード30枚（~60KB）
- theme-registry.md（~5KB）
- 関連度の高い原文 Phase 7 output 最大5本（~70KB）
- p1-cross-domain-insights.md の関連セクション
- core-definitions.md（~5KB）

合計 ~140KB。1Mコンテキストの14%。

**output.md 構造:**
- **§A: テーマを支持する領域とパターン** — 30領域すべてへの言及必須
- **§B: 収束点** — 複数領域が同じことを言っている箇所
- **§C: 分岐点** — 領域間の矛盾・緊張
- **§D: 5段階モデルへの含意** — 具体的な更新提案
- **§E: 保持論点** — テーマに関する未解決の問い
- **§F: 領域分布** — 自然科学:人文社会:実践の比率報告

**実行環境:**
- Agent-BG x 2並行

### Layer 3: synthesis（統合）

**入力:**
- テーマ別分析 5-7本（~60KB）
- 圧縮カード集計（~60KB）
- core-definitions.md（~5KB）

**output 構造:**
1. 段階定義の更新提案
2. 盲点の統合マップ
3. 保持論点の整理（解消可能 / Phase 8 でも未解消）
4. 5段階モデルの限界条件（有効範囲と破綻境界）
5. 次の Phase への指針

**実行環境:**
- Main（手動）

### 品質ゲート

| Step | ゲート | 通過条件 | 判定者 |
|------|--------|---------|--------|
| 0 | テーマシード確認 | pjdhiro がテーマ候補リストを承認 | pjdhiro |
| 1 | 圧縮品質 | 30枚完備 + サンプル3枚を原文と突き合わせ PASS | CLI + Main |
| 2 | テーマ確定 | pjdhiro がテーマリストを承認 | pjdhiro |
| 3 | 横断性 | 各テーマが10+領域に言及 | CLI自動 |
| 3 | 両面性 | 収束点(§B)と分岐点(§C)の両方が存在 | Main |
| 3 | JURISDICTION | 5段階比較 >80% | CLI自動 |
| 4 | しっくり感 | pjdhiro が主要発見5-7件を確認 | pjdhiro |
| 4 | バイアス保護 | 独自の主張が通説に丸められていない | Main + pjdhiro |

### バイアス対策（構造的）

| バイアス | 対策 |
|---------|------|
| 注意機構（中間部落とし） | Layer 2 指示で「30領域すべてに言及。欠落理由を明記」 |
| 選択（分野偏り） | Layer 2 §F で自然科学:人文:実践の比率報告を義務化 |
| 圧縮損失 | Layer 1 に「除外パターン」セクション設置 |
| 合意（LLM支持傾向） | テーマに「5段階モデルが記述できないもの」を必ず1つ含める |

---

## ドメインレポート §2 テンプレ追記

Phase 5-7 完了領域のドメインレポート §2「調査の方法」に以下を追加:

> Phase 5（論拠監査）で既存{N}件の強度分類とギャップ分析を実施し、Phase 6（構造再読）で各エントリの5段階対応を4軸で再評価した。Phase 7（横断統合）で領域内の横断パターンを抽出した。
