# docs/README.md — プロジェクト管理ハブ

**バージョン**: 1.1
**更新日**: 2026-03-11

## 設計原則

**本ファイルは全エントリーポイントの集約先。**
CLAUDE.md、将来の AGENTS.md 等の LLM エントリーポイントは本ファイルへの参照のみを持つ。

---

## 1. プロジェクト概要

このリポジトリの目的・コア理論・調査状況は `evidence/PROJECT.md` を参照。

---

## 2. ファイル構成

| パス | 役割 |
|---|---|
| `CLAUDE.md` | CLI エージェント向けエントリーポイント + 運用情報 |
| `evidence/PROJECT.md` | プロジェクト憲章（目的・理論・進捗・契約） |
| `evidence/CLAUDE.md` | evidence ディレクトリ固有のルール |
| `evidence/` | 30領域の調査結果本体 |
| `transform/README.md` | creation-space 側変換層の入口。domains / survey / guides / kb の workflow 案内 |
| `transform/domains/README.md` | 領域別レポート再生成 workflow の入口 |
| `kb/README.md` | 当面の公開KB正本の受け皿 |
| `src/` | Web UI（Three.js） |
| `docs/` | 管理書類（本ファイル） |
| `docs/survey-progress-taxonomy.md` | 進捗タクソノミー定義 |

---

## 3. 運用ルール

最小限。移行（#185/#186）が進む中で追記する。

- Issue 管理: 当面は外部の既存運用先で管理
- ブランチ戦略: `CLAUDE.md` §3 を参照
- セッション終了時: `CLAUDE.md` §4 を参照

## 4. 変換ワークフロー

- domains の入口: `transform/domains/README.md`
- survey / guides は placeholder。現行正本は kesson 側を参照
- 戦略方針の正本: `evidence/PROJECT.md` §0

---

## 更新履歴

| 日付 | バージョン | 内容 |
|---|---|---|
| 2026-03-10 | 1.0 | 初版。ハブとして新設（#190） |
| 2026-03-11 | 1.1 | `transform/` と `kb/` の入口を追加（#208 Phase A） |
