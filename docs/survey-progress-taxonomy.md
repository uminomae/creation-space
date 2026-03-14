# 領域調査進捗ラベル — 設計記録

**バージョン**: 1.0  
**作成日**: 2026-03-07  
**実装場所**: `src/reports.js` → `DEFAULT_PROGRESS_TAXONOMY`  
**品質管理上の位置づけ**: 初期設計記録。現行の正本は `docs/evidence-metadata-creation.md` §2。

> **現行正本**: 公開ラベル taxonomy / `generator_model` の正本は `docs/evidence-metadata-creation.md` に移行した。  
> 本ファイルは Issue #23 段階の設計経緯を残す履歴文書であり、現行仕様の直接参照先ではない。

---

## 1. 現行ラベル一覧

| id | JA ラベル | EN ラベル | 説明 | tone | order |
|----|-----------|-----------|------|------|-------|
| `not_surveyed` | 調査前 | Not yet surveyed | Claude・GPTによる調査未実施 | secondary | 10 |
| `claude_screened` | Claude初期抽出済 | Claude-screened | Claude（1ターン）による候補ピックアップ実施 | warning | 20 |
| `claude_gpt_reviewed` | Claude＋GPT照合済 | Claude + GPT reviewed | Claude初期抽出＋ChatGPT独立レビュー突き合わせ実施 | primary | 30 |
| `human_reviewed` | 人間レビュー済 | Human-reviewed | Claude＋GPT照合に加え、人間による最終レビュー実施 | success | 40 |

### 設計原則

- **事実のみ記述**：「良い／悪い」「完了／未完了」の評価を含まない
- **操作の有無で分類**：何をやったかを明示し、何をやっていないかは暗示しない
- **AIによる単独処理は必ず明記**：`claude_screened` が「1ターン」と明示しているのはこのため
- **GPT照合は独立レビューである**：ChatGPTがClaudeと独立した視点でレビューし、突き合わせを実施したことを指す

---

## 2. 設計の経緯

### 起点：Issue #23（creation-space）

> [領域調査状況のカテゴライズを吟味する](https://github.com/uminomae/creation-space/issues/23)  
> 作成: 2026-03-06

旧ラベル（Quick Scan / Structure Exploration / Analysis Complete 等の英語名）が実際の調査状況を正確に表していないという問題意識から吟味を開始。

**問題点（旧来）**:
- 英語ラベルが調査「手法」ではなく「深さ」の隠喩に偏っていた
- AIによる処理と人間による処理の区別が不明確
- 「完了」という語感が「まだ続く調査」の性格に合っていなかった

**収束した方針（Issue #23 での議論）**:
1. ラベルは**手法の組み合わせ**で命名する（Claude / GPT / 人間、それぞれの有無）
2. 「達成・完了」のニュアンスを含む語を使わない
3. AIによる単独レビューは必ず明記する
4. 段階は順序付きだが「上位＝優れている」ではない（調査方法の違い）

### 吟味アーティファクト：`deliberation-label-rule.jsx`

> 作成日: 2026-03-07  
> 用途: 吟味ワークフロー（deliberation-workflow スキル）の Artifact 実装例

DRファイル（30領域の調査記録）から自動生成する「ラベル＋一文解説」のルール草案（v0.1）を、5エージェントによる発散→収束サイクルで吟味するためのもの。

**注意：上記 `DEFAULT_PROGRESS_TAXONOMY` とは別システム**：
- `DEFAULT_PROGRESS_TAXONOMY`：REPORTS UI に表示する「領域ごとの調査進捗状態」
- `deliberation-label-rule.jsx` が対象とするラベル：UIの比較・フィルタ用に DRファイルの内容（幅・深さ・操作）を記述するラベル（まだ未実装・草案段階）

---

## 3. 現行タクソノミーの範囲外（保持論点）

### D22 経営学 深掘り調査（2026-03-07 発見）

旧管理番号 #120 で開始した「APIエージェント多段探索（claude-opus-4-6 / 18ラウンド）」は、現行タクソノミーのどれにも該当しない。

| 比較 | 理由 |
|---|---|
| `claude_screened` より上 | 1ターンではなく18ラウンドの多段探索 |
| `claude_gpt_reviewed` とは別軸 | GPT照合なし。代わりにAPI多段探索という新しい手法 |
| `human_reviewed` ではない | 人間最終レビューはまだ実施していない |

**保持論点**：この「APIエージェント多段探索」ラベルを追加するか否か。

候補案：

| 案 | ラベル（JA） | ラベル（EN） | order |
|---|---|---|---|
| A | Claude深掘り済 | Claude deep-dived | 35（GPT照合後・人間前） |
| B | 現行のまま維持。deepdiveはevidenceの内部バージョン管理で吸収 | — | — |

→ **判断はpjdhiro専権**。D22 Run1の出力確認後に決定する。

---

## 4. 実装との対応

```
src/reports.js
  └── DEFAULT_PROGRESS_TAXONOMY  ← 実装上の既定値
      (not_surveyed / claude_screened / claude_gpt_reviewed / human_reviewed)

assets/reports/scenarios/split-d22.json  ← 目視確認用シナリオ
  └── URL: ?reportsScenario=split-d22 で起動
```

ラベルを変更する場合の手順：
1. `docs/evidence-metadata-creation.md` を先に更新する
2. 必要に応じて本ファイルへ設計経緯を追記する
3. `src/reports.js` の `DEFAULT_PROGRESS_TAXONOMY` を確認する
4. `assets/creation/manifests/domains.json` の各ドメインの `progress` フィールドを更新する
5. 目視確認（`?reportsScenario=` を利用）
6. コミット・push

---

## 5. 参照リンク

| リソース | URL / パス |
|---|---|
| Issue #23（吟味起点） | https://github.com/uminomae/creation-space/issues/23 |
| 旧管理番号 #120（D22深掘り） | 外部 issue record |
| 実装 | `src/reports.js` → `DEFAULT_PROGRESS_TAXONOMY` |
| シナリオファイル | `assets/reports/scenarios/split-d22.json` |
| 吟味アーティファクト | `deliberation-label-rule.jsx`（DT Appセッション 2026-03-07） |

---

## 6. 更新履歴

| 日付 | バージョン | 内容 |
|------|-----------|------|
| 2026-03-07 | 1.0 | Issue #23・deliberation-label-rule.jsx・D22深掘り発見を統合して初版作成 |
