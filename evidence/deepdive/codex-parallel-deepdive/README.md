# codex-parallel-deepdive/ — 並列マルチエージェント深掘り探索

**概要**: Codex CLI を使い、複数エージェントを並列に走らせて deepdive を行う手法ディレクトリ。各エージェントは独立コンテキストで担当観点を分け、最後に統合結果を `output.md` にまとめる。

- モデル: gpt-5.4 xhigh
- タクソノミーid: `codex_parallel_deepdive`
- 親ディレクトリ: [deepdive/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/README.md)

## 調査対象の原則

**本ディレクトリの調査対象は「創造の5段階モデル（場→波→縁→渦→束）との構造類似」である。**

探索の過程で記録するもの:
- 構造類似度の尺度（どの程度似ているか、何が似ているか）
- 微妙な違いの種類（表面的類似 vs 構造的類似、スケールの違い等）
- 類似が破綻する箇所（これこそ重要な発見）
- 発見・洞察（5段階モデルの理解を押し広げうる知見）

**持ち込まないもの**:
- 欠損駆動思考（D1-D4）の理論的検証・深化 → kesson-* の管轄
- F軸/O軸の理論的含意 → kesson-* の管轄

この分離は #186（創造モデル独立宣言）に基づく。
D22 insight1 の却下（2026-03-09）はこの原則の違反が原因。

## ドメイン一覧

### D22-business-management/

| 項目 | 状態 | 参照 |
|---|---|---|
| `run1/` | ✅ 完了（2026-03-07）。2026-03-10 管轄チェック済み: 5段階焦点で維持（kesson#206） | [run1/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/codex-parallel-deepdive/D22-business-management/run1/README.md) |
| `insight1/` | ❌ 却下（2026-03-09）。2026-03-10 管轄チェック確定: やり直し必要（D1-D4 / F軸O軸へ逸脱, kesson#206） | [insight1/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/codex-parallel-deepdive/D22-business-management/insight1/README.md) |

### D23-developmental-psychology/

| 項目 | 状態 | 参照 |
|---|---|---|
| `insight1/` | ✅ 完了（2026-03-10） | [insight1/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/codex-parallel-deepdive/D23-developmental-psychology/insight1/README.md) |

## 手法メモ

- 並列マルチエージェント方式。観点別にサブエージェントを同時実行する。
- 各エージェントはコンテキスト独立で動き、役割の混線を避ける。
- Run ごとにサブエージェント出力と統合 `output.md` を残す。
- ブリーフィングには必ず「調査対象の原則」のガードレールを含めること。

## 関連

- 親サマリー: [deepdive/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/README.md)
- D22 Run1: [run1/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/codex-parallel-deepdive/D22-business-management/run1/README.md)
- D22 insight1: [insight1/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/codex-parallel-deepdive/D22-business-management/insight1/README.md)
- D22 管轄チェック: [JURISDICTION-CHECK.md](/Users/uminomae/dev/creation-space/evidence/deepdive/codex-parallel-deepdive/D22-business-management/JURISDICTION-CHECK.md)
- 管轄分離の根拠: kesson#186（創造モデル独立宣言）
