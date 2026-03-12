# deepdive/ — 深掘り探索ディレクトリ

**バージョン**: 1.5
**更新日**: 2026-03-08
**関連ルール**: `base/schema/evidence-metadata.md §8`

---

## なぜこのディレクトリを作ったか

既存の evidence は Level 2（Claude初期抽出 + ChatGPT照合）で止まっている。
これは「何が候補か」を確認する段階であり、「なぜそこが縁なのか」を論証する段階ではない。

deepdive は、Level 2 の evidence を壊さずに、AIエージェントを使った多ラウンド・多視点の論証・批判・横断知見の抽出を行うために設けた分離領域。

**evidence 本体はここでは変更しない。** output.md を pjdhiro が確認してから evidence に反映する。

設計の経緯・実験設計の詳細は以下を参照：
- 旧 deepdive 設計記録（D22 経営学の多段探索実験）
- evidence メタ情報ルール一元化の記録
- 外部 schema repo の `evidence-metadata.md` 正本

---

## ⚠️ deepdive を新たに始める前に必読

### ブリーフィング必須項目（`docs/briefings/briefing-*.md`）

deepdive の品質はブリーフィングの品質で決まる（`skills/codex-agent/SKILL.md` 参照）。
**ブリーフィング文書なしで Codex / Claude Code に deepdive を投げてはならない。**

指示書の基本様式は `docs/agents.md §7.2` に定義済み。
deepdive 固有で必ず含める項目：

| 項目 | 内容 |
|---|---|
| 必読ファイル一覧（優先度付き） | 対象 evidence・DR・GPTレビュー等。★★★/★★/★ で優先度を付ける |
| リサーチ項目定義（§A-§D 相当） | **何を調査したら終わりか**を具体的に定義する。ここが抜けると完了条件が不明確になる |
| 完了条件チェックリスト | チェックボックス形式。output.md と README の必須記載項目を含める |
| Safety Valve タグ指示 | `[UNCERTAIN]` `[UNVERIFIED]` 等の使用ルールを明示する |
| モデル自己申告の指示 | 「自分のモデル名・バージョンを README の冒頭に記載せよ」と明示する |
| output README の記載内容 | 完了後に README に書くべき項目を指定する（モデル名・フラグ値・完了条件の充足状況） |

### Run README に必ず含める項目

```markdown
- 実行日: YYYY-MM-DD
- モデル: （LLMが自己申告した値をそのまま記載）
- エージェント数 / ラウンド数: N
- 入力ファイル: （列挙）
- 新規採用: N件 / CA変更: N件 / 棄却: N件 / 維持: N件
- 出力ファイル: （列挙）
- evidence 反映時のフラグ値: `[ai:deepdive-{手法}:{モデル名}]`（手法とモデル名はLLM自己申告値）
- progress_level: （evidence-metadata.md §4 のタクソノミーid）
- 洞察の発展: （後続作業・思考への接続）
- 活用状況: （INSIGHTS.md 登録 / evidence 反映 / 後続 Run 接続）
- 次のアクション: （列挙）
```

---

## ディレクトリ構造

```
deepdive/
  README.md                          ← 本ファイル
  script/                            再実行可能スクリプト群
  img/                               README用の図版・スクリーンショット置き場
  claude-code-agent/                 Claude Code Agent（逐次多ラウンド）
    D22-business-management/
      run1/                          ← 完了
  codex-parallel-deepdive/           Codex CLI マルチエージェント（並列）
    D22-business-management/
      run1/
        README.md
        agent-evidence-audit.md
        agent-gap-scan.md
        agent-boundary-guard.md
        agent-stage-coverage.md
        output.md
      insight1/
        README.md
        output.md
    D23-developmental-psychology/
      insight1/
        README.md
        output.md
      cross-insight/
        README.md
        output.md
```

---

## 手法別サマリー

| ディレクトリ | タクソノミーid | モデル | 操作プロトコル |
|---|---|---|---|
| [claude-code-agent/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/claude-code-agent/README.md) | `api_deepdive` | claude-opus-4-6 | 逐次多ラウンド。コンテキスト継続。 |
| [codex-parallel-deepdive/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/codex-parallel-deepdive/README.md) | `codex_parallel_deepdive` | gpt-5.4 xhigh | 並列マルチエージェント。コンテキスト独立。手法別サブエージェント同時実行。 |

---

## 実施状況

| 手法 | ドメイン | Run | 状態 | INSIGHTS.md | evidence 反映 |
|---|---|---|---|---|---|
| claude-code-agent | D22 経営学 | Run1 | ✅ 完了（2026-03-08） | ✅ 済（#129） | 🟡 一部反映（#123） |
| codex-parallel-deepdive | D22 経営学 | Run1 | ✅ 完了（2026-03-07） | ✅ 済（#129） | 🟡 一部反映（#123） |
| codex-parallel-deepdive | D22 経営学 | insight1 | ✅ 完了（2026-03-08） | ✅ 済（#129） | ⬜ 未 |
| codex-parallel-deepdive | D23 発達心理学 | insight1 | ✅ 完了（2026-03-10） | ⬜ 未 | ⬜ 未 |
| codex-parallel-deepdive | D23 発達心理学 | cross-insight | ✅ 完了（2026-03-10） | ⬜ 未 | ⬜ 未 |

---

## ルール

- 新手法を追加する場合は本ファイルの構造・手法表・実施状況を更新する
- ラベルid の正本定義は `base/schema/evidence-metadata.md §2`
- フラグ書式は `[ai:{操作種別}:{モデル名}]`（例: `[ai:deepdive-codex:gpt-5.4 xhigh]`）
- evidence 本体への反映は output.md を pjdhiro が確認してから行う
