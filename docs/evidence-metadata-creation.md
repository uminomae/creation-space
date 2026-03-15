# evidence-metadata（creation-space 固有）

**正本**: creation-space/docs/evidence-metadata-creation.md
**移植元**: kesson-driven-thinking/base/schema/evidence-metadata.md §2, §2.5
**状態**: 移植版

creation-space の公開ラベルタクソノミー、`generator_model`、`domains.json` 連携の正本。
evidence 内部管理用のフラグ体系と AI モデル来歴は、引き続き `/Users/uminomae/dev/kesson-driven-thinking/base/schema/evidence-metadata.md` を参照する。

---

## §2 公開ラベルタクソノミー（正本定義）

creation-space の REPORTS 画面に表示されるラベルの正本。

| id | label_ja | label_en | description_ja（読者向け・操作の事実） | order | tone |
|---|---|---|---|---|---|
| `not_surveyed` | 調査前 | Not yet surveyed | Claude・GPTによる調査未実施 | 10 | secondary |
| `claude_screened` | Claude初期抽出済 | Claude-screened | Claudeとの対話（1セッション）で候補理論を抽出した | 20 | warning |
| `claude_gpt_reviewed` | Claude＋GPT照合済 | Claude + GPT reviewed | Claude抽出後、ChatGPTによる独立レビューと突き合わせを実施した | 30 | primary |
| `api_deepdive` | Claude Agent深掘り済 | Claude Agent deepdive | Claude Code Agentによる逐次多ラウンド深掘り探索を実施した | 35 | primary |
| `codex_parallel_deepdive` | Codex並列深掘り済 | Codex parallel deepdive | Codex CLIマルチエージェント（並列）による深掘り探索を実施した | 36 | primary |
| `human_reviewed` | 人間レビュー済 | Human-reviewed | Claude＋GPT照合に加え、著者による最終確認を実施した | 40 | success |

> **tone の有効値**: `secondary` / `warning` / `primary` / `success`
> `info` は `reports.js` の badgeClass マップに未定義のため使用不可（`secondary` にフォールバックする）。

### description_en

| id | description_en |
|---|---|
| `not_surveyed` | No AI-assisted survey conducted yet |
| `claude_screened` | Candidate theories extracted via single-session Claude dialogue |
| `claude_gpt_reviewed` | Claude screening followed by independent ChatGPT review cross-check |
| `api_deepdive` | Multi-round sequential deep exploration via Claude Code Agent |
| `codex_parallel_deepdive` | Parallel multi-agent deep exploration via Codex CLI |
| `human_reviewed` | Claude + GPT review plus author final confirmation |

### 新設時の必須ルール

新しいラベル（id）を追加するとき、以下を**すべて**揃えてから `reports.js` に反映すること。

| フィールド | 必須 | 備考 |
|---|---|---|
| `id` | ✅ | snake_case |
| `label_ja` | ✅ | 10字以内の名詞句 |
| `label_en` | ✅ | |
| `description_ja` | ✅ | 内部用語なし・操作の事実を1文で |
| `description_en` | ✅ | 同上（英語） |
| `order` | ✅ | 既存 order との前後関係を明示 |
| `tone` | ✅ | secondary / warning / primary / success のいずれか（`info` は未定義・使用不可） |

**⚠️ description が欠けたままの状態で `reports.js` に追加してはならない。**
description が空欄の場合、UI上ではラベル名のみ表示され解説が出ない（2026-03-08 cs#36 で発覚）。

## §2.5 generator_model フィールド（正本定義）

front matter および manifest で使用する `generator_model` フィールドの書式ルール。

### 書式

`{tool}:{model_string}` 形式。複数モデルが関与した場合は `+` で連結。

| tool | model_string の例 | 意味 |
|---|---|---|
| `claude` | `claude-opus-4-6` / `claude-opus-4-5` / `claude-sonnet-4-6` | Anthropic Claude（APIモデル文字列） |
| `claude-code-agent` | `claude-opus-4-6` | Claude Code Agent（逐次多ラウンド深掘り） |
| `codex` | `gpt-5.4 xhigh` / `codex 5.3` | Codex CLI（CLIバージョン表記） |
| `gpt` | `gpt-4o` / `deep-research` | ChatGPT（モデル名またはモード名） |

**例**:
- `claude:claude-opus-4-6` — Claude Opus 4.6 単独
- `claude:claude-opus-4-6+gpt:deep-research` — Claude + ChatGPT Deep Research
- `codex:gpt-5.4 xhigh` — Codex 単独
- `claude:claude-opus-4-5+codex:gpt-5.4 xhigh` — Claude + Codex 並列

**不明な場合**: `unknown` を使う（空欄・省略禁止）
**未生成の場合**: `not_applicable` を使う（`not_surveyed` に限る）

### 有効値と progress_level との対応

| progress_level | 典型的な generator_model |
|---|---|
| `claude_screened` | `claude:{model}` |
| `claude_gpt_reviewed` | `claude:{model}+gpt:deep-research` |
| `api_deepdive` | `claude:{model}+gpt:deep-research+claude-code-agent:{model}` |
| `codex_parallel_deepdive` | `claude:{model}+gpt:deep-research+codex:{version}` |
| `human_reviewed` | 上記のいずれか（pjdhiro確認済み） |
| `not_surveyed` | `not_applicable` |

### フィールド名の統一

すべての場所で `generator_model` を使う。旧名 `progress_model` は廃止。`index.json` v4.0 以降は `generator_model` に統一済み。

### このフィールドを使う場所

1. `transform/domains/*.md` front matter の `generator_model`
2. `pjdhiro/assets/creation/manifests/domains.json` の各ドメインエントリ
3. `evidence/deepdive/*/run*/README.md` の `モデル:` 行（既存書式と整合）

## §2.6 domains.json / reports.js 連携

`pjdhiro/assets/creation/manifests/domains.json` では、公開ラベルタクソノミーから少なくとも以下の4項目を各ドメインへ反映する。

| フィールド | 内容 | source of truth |
|---|---|---|
| `progress_level` | 公開ラベル id | §2 |
| `label_description_ja` | 読者向け日本語説明 | §2 `description_ja` |
| `label_description_en` | 読者向け英語説明 | §2 `description_en` |
| `generator_model` | 生成モデル書式 | §2.5 |

### 情報フロー

```text
本ファイル（taxonomy / generator_model 定義）
    ↓
transform/domains/publish/domains/index.json
    ↓ generate-domains-json.mjs
pjdhiro/assets/creation/manifests/domains.json
    ↓
creation-space/src/reports.js
```

### `reports.js` 連携ルール

1. 新しいラベルを追加するときは、本ファイルを先に更新する
2. `reports.js` の taxonomy 表示と badge 対応を同時に確認する
3. `domains.json` 側の `progress_level` / `label_description_*` / `generator_model` と不一致のまま公開しない

## §2.7 旧 progress_level のマイグレーション

以下の旧 level 名は `src/reports/data.js` の `normalizeProgressLevel()` で自動変換される。

| 旧 level | 変換先 | 導入時期 |
|----------|--------|---------|
| `quick_scan` | `claude_screened` | v3.0以前 |
| `structure_exploration` | `claude_screened` | v3.0以前 |
| `analysis_complete` | `claude_gpt_reviewed` | v3.0以前 |

新規データでは旧 level 名を使用しないこと。

## §2.8 progress_note の運用ルール

`progress_note` は `progress_level` の補足説明フィールド。

| ルール | 内容 |
|--------|------|
| 役割 | progress_level の label_ja と異なる追加情報がある場合のみ使用 |
| 冗長禁止 | label_ja と同じ文面を繰り返さない（例: 「Claude＋GPT照合済」が label と同一なら省略可） |
| 内部用語禁止 | Phase、Step、Issue番号は含めない |
| 空値許可 | 追加情報がなければ空文字列で可 |

## 更新履歴

| 日付 | バージョン | 内容 |
|---|---|---|
| 2026-03-16 | 1.1 | §2.7 旧 level マイグレーションテーブル、§2.8 progress_note 運用ルールを追加 (cs#77 子タスク4-5) |
| 2026-03-14 | 1.0 | `kesson-driven-thinking/base/schema/evidence-metadata.md` §2 / §2.5 を creation-space 側へ移植し、公開ラベルタクソノミーと `generator_model` の正本を分離 (#248) |
