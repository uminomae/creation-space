# codex-parallel-deepdive/ — 並列マルチエージェント深掘り探索

**概要**: Codex CLI を使い、複数エージェントを並列に走らせて deepdive を行う手法ディレクトリ。各エージェントは独立コンテキストで担当観点を分け、最後に統合結果を `output.md` にまとめる。

- モデル: gpt-5.4 xhigh
- タクソノミーid: `codex_parallel_deepdive`
- 親ディレクトリ: [deepdive/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/README.md)

## ドメイン一覧

### D22-business-management/

| 項目 | 状態 | 参照 |
|---|---|---|
| `run1/` | ✅ 完了（2026-03-07） | [run1/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/codex-parallel-deepdive/D22-business-management/run1/README.md) |
| `insight1/` | ✅ 完了（2026-03-07、2026-03-09 却下判定記録あり） | [insight1/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/codex-parallel-deepdive/D22-business-management/insight1/README.md) |

## 手法メモ

- 並列マルチエージェント方式。観点別にサブエージェントを同時実行する。
- 各エージェントはコンテキスト独立で動き、役割の混線を避ける。
- Run ごとにサブエージェント出力と統合 `output.md` を残す。

## 関連

- 親サマリー: [deepdive/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/README.md)
- D22 Run1: [run1/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/codex-parallel-deepdive/D22-business-management/run1/README.md)
- D22 insight1: [insight1/README.md](/Users/uminomae/dev/creation-space/evidence/deepdive/codex-parallel-deepdive/D22-business-management/insight1/README.md)
