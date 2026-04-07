# 30領域統一調査プロトコル（Phase 0-9）

**バージョン**: 1.1
**作成日**: 2026-03-17
**状態**: 2026-04-07 rerun gate 適用中

---

## 概要

Phase 1-4（幅優先スキャン→本格調査→GPTレビュー→突き合わせ）は30領域で統一済み・完了済み。
本プロトコルは Phase 4 以降の深掘り調査を統一し、30領域に適用する Phase 5-9 の仕様を定める。
ただし `cs#207` 以降は、**原典アクセス状態の棚卸し（Phase 0）を通過するまで既存の verified / accepted を再保証しない**。

旧名称（deepdive, run1, insight1, cross-insight）は内容を表さないため廃止。
ツール名（codex-parallel, claude-code-agent）もディレクトリ名から排除し、README メタデータに記録する。

---

## Phase 命名

| Phase | slug | 日本語名 | 内容 |
|-------|------|---------|------|
| Phase 0 | original-access-audit | 原典アクセス監査 | raw の有無・本文確認可否・停止条件を確定する |
| Phase 5 | evidence-audit | 論拠監査 | 既存エントリの強度分類・ギャップ分析・境界ガード・5段階カバレッジ |
| Phase 6 | structural-reread | 構造再読 | 各エントリを「正確/怪しい/破綻/未見」の4軸で再読 |
| Phase 7 | cross-domain-synthesis | 横断統合 | 領域内の横断パターン抽出・段階定義の精緻化・盲点特定 |
| Phase 8 | cross-domain-exploration | 領域横断探索 | 30領域横断のインサイト探索（3層: 圧縮→テーマ分析→統合） |
| Phase 9 | ref-check | 原典検証 | [P] 主張の根拠を原典アクセス状態つきで再確認する |

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

## Phase 0: original-access-audit（原典アクセス監査）

### 目的

- 既存の [P] 主張が、原典本文を直接確認したうえで書かれたものかを切り分ける
- `knowledge/raw/` に格納できるもの、書誌確認のみのもの、アクセス不能なものを分類する
- Phase 5-9 を再開してよい領域だけを前に進める

### access status

| status | 意味 | 扱い |
|---|---|---|
| `raw-confirmed` | `knowledge/raw/` に原典があり本文確認済み | verified 候補 |
| `citation-only` | 書誌のみ確認、本文未確認 | 内容断定に使わない |
| `blocked-access` | 合法経路はあるが本文未入手 | 保留 |
| `not-yet-reviewed` | 未棚卸し | 保留 |

### 停止条件

- `raw-confirmed` 以外の [P] 主張は verified 扱いしない
- `citation-only` / `blocked-access` は再調査待ちとして残す
- archive 化した旧本文は history 参照専用であり、現行根拠としては扱わない

### 出力

- `knowledge/raw/manifest.md`
- `evidence/review/original-access-status.md`
- 必要に応じて `knowledge/raw/` への原典ファイル追加

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

## reader-rules との関係（cs#120）

本プロトコルは **調査実行** の仕様。生成ルール（reader-rules）は **コンテンツ生成** の仕様。

- Phase 5-7 の output.md は本プロトコルの品質ゲートに準拠する（reader-rules ではない）
- Phase 7 完了後に生成される **ドメインレポート** は `reader-rules-creation-report.md` に準拠する
- 本プロトコルのスコープガード（5段階比較 >80%）と reader-rules §3（均等記述義務）は整合する
- **同期ルール**: 本プロトコルのスコープガードまたは品質ゲートを変更した場合、reader-rules §8 との整合性を確認すること

---

## ドメインレポート §2 テンプレ追記

Phase 5-7 完了領域のドメインレポート §2「調査の方法」に以下を追加:

> Phase 5（論拠監査）で既存{N}件の強度分類とギャップ分析を実施し、Phase 6（構造再読）で各エントリの5段階対応を4軸で再評価した。Phase 7（横断統合）で領域内の横断パターンを抽出した。

---

## レポート再生成時のマニフェスト同期チェックリスト（cs#121）

ドメインレポートを再生成・更新した場合、以下を必ず実行すること。

### 手順

1. **レポート配置**: `knowledge/domains/{slug}/ja/report.md` を `pjdhiro/assets/creation/domains/ja/md/` にコピー
2. **survey.json 更新**: `pjdhiro/assets/creation/manifests/survey.json` の `generated_at` を当日日付に更新
3. **domains.json 同期**: `index.json` の `progress_level` / `generated` / `generator_model` / `label_description_*` を更新し、`generate-domains-json.mjs` で `pjdhiro/domains.json` に同期
4. **front matter 除去確認**: `pjdhiro/assets/` 配下の `.md` ファイルに YAML front matter (`---`) が付いていないこと（NL-012）
5. **整合チェック実行**:
   ```bash
   bash ~/dev/kesson-driven-thinking/scripts/validate-manifest-sync.sh
   ```
   全 Check が PASS であることを確認。特に Check 6（ソース vs 公開の本文 diff）に注意。

### チェック項目一覧（validate-manifest-sync.sh）

| Check | 内容 |
|-------|------|
| 1 | domains.json vs index.json の progress_level / generated 一致 |
| 2 | survey.json generated_at >= max(domains.json generated) |
| 3 | pjdhiro/assets/ の md に front matter がないこと（NL-012） |
| 4 | index.json の progress_level が progress_taxonomy に存在するか |
| 5 | data.js と index.json の taxonomy ID 一致 |
| 6 | ソース（knowledge/）と公開（pjdhiro assets/）の本文 diff なし |

---

## Phase 9: source-verification（原典ベース再検証）

### 概要

Phase 8 の統合的洞察（Layer 3）が帰納的に導出した仮説群を、原典に遡って検証する。
Phase 8 までは「30領域の調査データから何が言えるか」。Phase 9 は「それは原典で本当に支持されるか」。

### 前提

Phase 8 Layer 3 が完了していること。

### サブフェーズ構成

| サブフェーズ | slug | 方法 | 入力 | ツール要件 |
|------------|------|------|------|-----------|
| Phase 9-0 | prep | 検証基盤の準備 | Layer 3 §3 | なし |
| Phase 9-1 | web-verify | Web検索ベース検証 | 優先度リスト + evidence + Web検索 | WebSearch / WebFetch |
| Phase 9-2 | rag-verify | RAG ベース検証 | 優先度リスト + evidence + 原典テキスト | RAG パイプライン（要構築） |
| Phase 9-3 | specialist-rag | 専門RAG検証 | Phase 9-2 で unverifiable だった項目 | 専門データベース・論文検索 |

### Phase 9-1 → 9-2 → 9-3 の切り替え条件

- **Phase 9-1 で開始**: 全検証対象について Web 検索ベースで実施
- **Phase 9-2 へ移行**: Phase 9-1 で unverifiable 率が 30% を超えた検証対象、または Phase 9-1 の plausible 判定を verified/overstated に確定させたい場合
- **Phase 9-3 へ移行**: Phase 9-2 でも unverifiable が残り、かつ段階定義への影響が大きい項目（優先度リスト順位1-2）

**判断が必要な点（pjdhiro確認事項）**:
- RAG パイプラインの技術選定（Phase 9-2 開始前に決定）
- unverifiable 率の打ち切り基準（全体の何%まで許容するか）

### 検証優先度

正本: `phase9/verification-priority.md`

### 判定基準

| 判定 | 定義 |
|------|------|
| verified | 原典の記述が5段階モデルとの構造類似を直接支持する |
| plausible | 原典の記述と矛盾しないが、直接の支持とは言えない |
| overstated | 5段階モデルとの対応が過大に主張されている |
| unverifiable | 原典へのアクセスが困難、または原典に該当する記述が見つからない |

テンプレート正本: `phase9/verification-template.md`

### ディレクトリ構造

```
evidence/investigation/phase9/
  verification-priority.md      ← 検証優先度リスト
  verification-template.md      ← テンプレート・判定基準
  web-verify/                   ← Phase 9-1 成果物
    {検証対象slug}/
      report-D{NN}.md           ← 個別検証レポート
      summary.md                ← 検証対象単位の集計
  rag-verify/                   ← Phase 9-2 成果物（同構造）
  specialist-rag/               ← Phase 9-3 成果物（同構造）
```

### 品質ゲート

| # | チェック項目 |
|---|------------|
| 1 | 各検証レポートに判定理由が記載されている |
| 2 | 原典の参照が具体的（著者・タイトル・年・該当箇所） |
| 3 | overstated 判定時に evidence への修正提案が含まれている |
| 4 | 検証対象単位の集計で自然科学/人文社会/実践の分布が報告されている |
| 5 | pjdhiro の「しっくり感チェック」（検証対象単位の統合判断） |

### スコープガード

- Phase 9 は「原典で確認できるか」の検証であり、新たな理論構築ではない
- 検証中に新たなパターンを発見した場合、検証レポートの備考に記録するが、判定には影響させない
- 原典の解釈が分かれる場合は plausible とし、複数の解釈を併記する

### 実行モデル

| サブフェーズ | 実行環境 | モデル | 方式 |
|------------|---------|--------|------|
| Phase 9-0（準備） | Claude CLI Main | claude-opus-4-6 | 手動 |
| Phase 9-1（Web検索） | Claude CLI | claude-opus-4-6 | Agent-BG / Main |
| Phase 9-2（RAG） | 未定 | 未定 | RAG パイプライン要構築 |
| Phase 9-3（専門RAG） | 未定 | 未定 | 専門DB要選定 |
