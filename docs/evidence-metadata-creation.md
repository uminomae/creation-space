# evidence-metadata（creation-space 固有）

**正本**: creation-space/docs/evidence-metadata-creation.md
**移植元**: 旧 private repo evidence-metadata.md §2, §2.5（移植完了・本ファイルが正本）
**状態**: 移植版

creation-space の公開ラベルタクソノミー、`generator_model`、`domains.json` 連携の正本。
evidence 内部管理用のフラグ書式は `evidence/deepdive/README.md` を参照する。

---

## §2 公開ラベルタクソノミー（正本定義）

creation-space の REPORTS 画面に表示されるラベルの正本。

| id | label_ja | label_en | description_ja（読者向け・操作の事実） | order | tone |
|---|---|---|---|---|---|
| `not_surveyed` | 調査前 | Not yet surveyed | AI支援調査が未実施 | 10 | secondary |
| `initial_scan` | 初期スキャン済 | Initial scan | 幅優先スキャンで候補理論を抽出した（Phase 1-2） | 20 | warning |
| `cross_reviewed` | 独立照合済 | Cross-reviewed | 複数AIエンジンによる独立レビューと突き合わせを実施した（Phase 3-4） | 30 | primary |
| `deep_investigated` | 深掘り調査済 | Deep-investigated | 論拠監査・構造再読・横断統合を含む多段階深掘り調査を実施した（Phase 5-7） | 40 | primary |
| `cross_explored` | 領域横断探索済 | Cross-domain explored | 領域横断的な構造探索を実施した（Phase 8） | 50 | primary |
| `human_reviewed` | 人間レビュー済 | Human-reviewed | 著者による最終確認を実施した | 60 | success |

> **tone の有効値**: `secondary` / `warning` / `primary` / `success`
> `info` は `reports.js` の badgeClass マップに未定義のため使用不可（`secondary` にフォールバックする）。

### description_en

| id | description_en |
|---|---|
| `not_surveyed` | No AI-assisted survey conducted yet |
| `initial_scan` | Candidate theories extracted via breadth-first scan (Phase 1-2) |
| `cross_reviewed` | Independent review and cross-check by multiple AI engines (Phase 3-4) |
| `deep_investigated` | Multi-stage deep investigation including audit, re-reading, and cross-integration (Phase 5-7) |
| `cross_explored` | Cross-domain structural exploration conducted (Phase 8) |
| `human_reviewed` | Author final confirmation conducted |

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
| `not_surveyed` | `not_applicable` |
| `initial_scan` | `claude:{model}` |
| `cross_reviewed` | `claude:{model}+gpt:deep-research` |
| `deep_investigated` | `claude:{model}+gpt:deep-research+claude-code-agent:{model}` |
| `cross_explored` | 上記 + 横断分析モデル |
| `human_reviewed` | 上記のいずれか（pjdhiro確認済み） |

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
| `quick_scan` | `initial_scan` | v3.0以前 |
| `structure_exploration` | `initial_scan` | v3.0以前 |
| `analysis_complete` | `cross_reviewed` | v3.0以前 |
| `claude_screened` | `initial_scan` | v4.2以前 |
| `claude_gpt_reviewed` | `cross_reviewed` | v4.2以前 |
| `api_deepdive` | `deep_investigated` | v4.2以前 |
| `codex_parallel_deepdive` | `deep_investigated` | v4.2以前 |

新規データでは旧 level 名を使用しないこと。

## §2.8 progress_note の運用ルール

`progress_note` は `progress_level` の補足説明フィールド。

| ルール | 内容 |
|--------|------|
| 役割 | progress_level の label_ja と異なる追加情報がある場合のみ使用 |
| 冗長禁止 | label_ja と同じ文面を繰り返さない（例: 「Claude＋GPT照合済」が label と同一なら省略可） |
| 内部用語禁止 | Phase、Step、Issue番号は含めない |
| 空値許可 | 追加情報がなければ空文字列で可 |

## §3 運用ルール（CLI参照先）

以下の運用ルールは CLAUDE.md および `.claude/rules/evidence-progress.md` に配置されている。
evidence-metadata-creation.md はタクソノミー**定義**の正本であり、**運用手順**の正本は下記を参照すること。

| ルール | 配置先 |
|--------|-------|
| progress_level 変更禁止ルール | CLAUDE.md §progress_level + `.claude/rules/evidence-progress.md` |
| evidence 更新時チェックリスト | CLAUDE.md §evidence 更新時チェックリスト |
| deepdive 後の更新フロー | `.claude/rules/evidence-progress.md` |
| 内部Level→公開タクソノミーのマッピング | CLAUDE.md §progress_level の決定基準 |
| 情報フローと SoT | `.claude/rules/evidence-progress.md` |

移植元: 旧 private repo evidence-metadata.md v1.9 §4/§5/§6/§8（移植完了）

## §2.9 品質レベルタクソノミー（quality_level）

ドメインレポートの品質保証状態を追跡するためのフィールド。`progress_level`（調査進捗）とは独立した軸。

| id | label_ja | 意味 |
|---|---|---|
| `not_generated` | 未生成 | MD が存在しない |
| `generated` | 生成済み | MD が存在するが品質テスト未実施 |
| `self_tested` | 自己テスト済み | quality-test-domain-report.md で PASS |
| `independent_reviewed` | 独立レビュー済み | 生成者と別エンジンでレビュー PASS |
| `pjdhiro_reviewed` | pjdhiro レビュー済み | pjdhiro しっくり感チェック PASS |

### 関連フィールド

| フィールド | 型 | 説明 |
|---|---|---|
| `quality_level` | string | 上記タクソノミーの id |
| `quality_rules_version` | string | 適用した品質テストルールのバージョン（空欄可） |
| `review_engine` | string | 独立レビューを実施したエンジン名（例: `codex:gpt-5.4`） |
| `review_result` | string | レビュー結果（例: `PASS`, `WARN(2)`） |

### quality_level の順序と逆行禁止

quality_level は以下の順序で進行する。逆行（例: `independent_reviewed` → `generated`）は原則禁止。

```
not_generated → generated → self_tested → independent_reviewed → pjdhiro_reviewed
```

### quality_level と WORKFLOW の対応

| WORKFLOW Step | quality_level 更新 |
|---|---|
| Step 2: MD 生成 | → `generated` |
| Step 3: 品質テスト PASS | → `self_tested` |
| Step 4: 独立レビュー PASS | → `independent_reviewed` + review_engine/review_result 記入 |
| pjdhiro レビュー | → `pjdhiro_reviewed` |

## 更新履歴

| 日付 | バージョン | 内容 |
|---|---|---|
| 2026-03-19 | 2.0 | §2 Phase ベースタクソノミーに全面改訂、§2.5/§2.7 マイグレーション更新 (cs#123) |
| 2026-03-17 | 1.3 | §2.9 品質レベルタクソノミー（quality_level）を追加 (cs#111) |
| 2026-03-16 | 1.2 | §3 運用ルール参照先を追加。旧 private repo §4/§5/§6/§8 の移植完了を記録 (cs#101) |
| 2026-03-16 | 1.1 | §2.7 旧 level マイグレーションテーブル、§2.8 progress_note 運用ルールを追加 (cs#77 子タスク4-5) |
| 2026-03-14 | 1.0 | 旧 private repo evidence-metadata.md §2/§2.5 を creation-space 側へ移植し、公開ラベルタクソノミーと `generator_model` の正本を分離 (#248) |
