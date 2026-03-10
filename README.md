# creation-space

**本ファイルはこのリポジトリの目次である。**
各ディレクトリの詳細は、配下の README.md に記載されている。ここではプロジェクトの概要と、重要書類・ディレクトリへの案内を示す。

---

「創造とは何か」を探索するプロジェクト。30の学術領域から創造プロセスの構造類似パターンを収集・分析し、創造の5段階モデル（場→波→縁→渦→束）の妥当性を検証する。

本リポジトリは特定の思想体系に依存しない独立モジュールであり、調査データと Web UI を同梱する。

---

## 重要書類

| 書類 | 場所 | 概要 |
|------|------|------|
| **プロジェクト憲章** | [evidence/PROJECT.md](evidence/PROJECT.md) | 目的・5段階モデル定義・調査方法・30領域の進捗・呼び出し側への契約 |
| **管理ハブ** | [docs/README.md](docs/README.md) | ファイル構成・運用ルール・エントリーポイントの集約先 |
| **CLIエントリーポイント** | [CLAUDE.md](CLAUDE.md) | Claude Code CLI 向けの運用情報・ブランチ戦略・セッション終了手順 |
| **洞察目次** | [evidence/INSIGHTS.md](evidence/INSIGHTS.md) | deepdive・横断洞察の一覧。新しい分析結果の参照起点 |
| **進捗タクソノミー** | [docs/survey-progress-taxonomy.md](docs/survey-progress-taxonomy.md) | 調査進捗ラベルの定義と設計経緯 |

---

## ディレクトリ構成

| パス | 役割 |
|------|------|
| `evidence/` | 30領域の調査データ本体。evidence-D01〜D30、deepdive、レビュー、一次ソース |
| `evidence/deepdive/` | 個別領域の深掘り探索（insight、cross-insight、run） |
| `evidence/review/` | 横断分析、計画書、調査方法論の記録 |
| `evidence/202602-deep-research-30domains-gpt/` | GPT Deep Research による一次ソース（30領域） |
| `docs/` | 管理書類 |
| `src/` | Web UI（Three.js による視覚表現） |
| `scripts/` | ビルド・同期スクリプト |
| `assets/` | 静的アセット |

---

## Web UI

Three.js による創造プロセスの視覚表現。

### ローカル起動

```bash
./server.sh          # http://localhost:3001/
./server.sh 4173     # ポート指定
```

### Embed API

`src/graphics-entry.js` の `createEmbeddedGraphic()` で外部ページに埋め込み可能。graphicMode: `hoji` / `sinobi` / `i`。

### Reports

調査レポートの PDF / MD は [pjdhiro](https://github.com/uminomae/pjdhiro) リポジトリでホスティング。`src/reports.js` が取得・表示する。

---

## 関連リポジトリ

| リポジトリ | 役割 |
|------------|------|
| [pjdhiro](https://github.com/uminomae/pjdhiro) | GitHub Pages。レポート PDF/MD のホスティング、ブログ |
| kesson-driven-thinking (private) | 5段階モデルの定義正本（Phase 3 で本リポジトリへ移転予定） |
