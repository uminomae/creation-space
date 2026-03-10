# claude-code-agent/ — 逐次多ラウンド深掘り探索

**概要**: Claude Code Agent を使い、前ラウンドの結果を踏まえながら逐次的に探索を深める手法ディレクトリ。ラウンドを重ねつつ文脈を引き継ぎ、最終的に `output.md` に統合する。

- モデル: claude-opus-4-6
- タクソノミーid: `api_deepdive`
- 親ディレクトリ: [deepdive/README.md](/Users/uminomae/dev/kesson-driven-thinking/base/evidence/deepdive/README.md)

## ドメイン一覧

### D22-business-management/

| 項目 | 状態 | 参照 |
|---|---|---|
| `run1/` | ✅ 完了（2026-03-08） | [run1/README.md](/Users/uminomae/dev/kesson-driven-thinking/base/evidence/deepdive/claude-code-agent/D22-business-management/run1/README.md) |

## 手法メモ

- 逐次多ラウンド方式。各ラウンドの結果を次ラウンドへ引き継ぐ。
- コンテキスト継続を前提に、同一探索線上で候補の精査と再判断を進める。
- Run ごとにラウンド別メモと統合 `output.md` を残す。

## 関連

- 親サマリー: [deepdive/README.md](/Users/uminomae/dev/kesson-driven-thinking/base/evidence/deepdive/README.md)
- D22 Run1: [run1/README.md](/Users/uminomae/dev/kesson-driven-thinking/base/evidence/deepdive/claude-code-agent/D22-business-management/run1/README.md)
