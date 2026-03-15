# transform/ — creation-space の変換層

## 5W1H

- **What**: evidence を公開用の Markdown / PDF / bilingual 出力へ変換するワークフロー群です。
- **Why**: 30領域の調査資産を、読者が辿れる形で再生成し、`knowledge/` を当面の正本として育てるためです。
- **Who**: Claude Code CLI と、creation-space の公開物を更新する人が使います。
- **When**: 新しい領域レポートを生成するとき、既存レポートを再生成するとき、survey / guides の移植を進めるときです。
- **Where**: 変換ルールは `transform/`、入力データは `evidence/`、公開用整形の受け皿はリポジトリ直下の `knowledge/` にあります。
- **How**: workflow README から入口を選び、reader-rules → quality-test → PDF / bilingual の順で進みます。

## ワークフロー一覧

| workflow | 役割 | 状態 |
|---|---|---|
| `domains/` | evidence から領域別調査レポート（md + PDF）を再生成する | **Phase A 実装済み** |
| `survey/` | 30領域全体の概要・索引を整える | **reader-rules 移管済み** |
| `guides/` | 5段階モデルの guide 類を strict separation で再構成する | **reader-rules / drafts / introductions 移管済み** |
| `transform/knowledge/` | 公開用整形ルールとメモの置き場 | **Phase C 以降** |

## PDF ビルド

### スクリプト

`scripts/build-pdf-guide.sh` — guides / domains の PDF 生成スクリプト（v2.0）。

### 使い方

```bash
# guides（デフォルト: general JA）
bash transform/scripts/build-pdf-guide.sh

# guides 全3種 JA
bash transform/scripts/build-pdf-guide.sh --kind guides --audience all

# guides general JA+EN
bash transform/scripts/build-pdf-guide.sh --kind guides --lang all

# domains JA 全30件
bash transform/scripts/build-pdf-guide.sh --kind domains --lang ja

# 全種 JA + manifest 更新
bash transform/scripts/build-pdf-guide.sh --kind all --lang ja --push

# 依存チェックのみ
bash transform/scripts/build-pdf-guide.sh --setup
```

### 機能

- 表紙（タイトル・サブタイトル・日付）自動生成
- 目次（TOC）自動生成
- JA/EN 対応（`--lang {ja|en|all}`）
- audience 別タイトル・サブタイトル
- front matter 自動除去
- pandoc + lualatex による堅牢な JA PDF 生成
- domains 30 領域一括ビルド
- manifest（guides.json / domains.json）自動更新（`--push` 時）
- 依存チェック・色付きログ・ファイルサイズ表示

### 依存

- `pandoc` — Markdown → PDF 変換
- `lualatex` — PDF エンジン（JA フォント対応）
- `python3` — front matter 除去・manifest 生成

```bash
brew install pandoc
brew install --cask mactex-no-gui
sudo tlmgr install collection-luatex luatexja haranoaji
```

## あなたが今ここに来たということは

- 新しい領域レポートを作りたいなら [domains/README.md](/Users/uminomae/dev/creation-space/transform/domains/README.md) を読みます。
- 調査全体の概要や索引を移したいなら [survey/README.md](/Users/uminomae/dev/creation-space/transform/survey/README.md) を確認します。
- guide 類の strict separation 移植を進めたいなら [guides/README.md](/Users/uminomae/dev/creation-space/transform/guides/README.md) から現行正本を辿ります。
- 公開用整形の置き場を確認したいなら [knowledge/README.md](/Users/uminomae/dev/creation-space/knowledge/README.md) を読みます。

## 参照先

- 戦略方針の正本: [evidence/PROJECT.md](/Users/uminomae/dev/creation-space/evidence/PROJECT.md) §0
- 現在の公開配置: `pjdhiro/assets/creation/`
- 移植元（履歴情報）: kesson-driven-thinking 側の旧 creation workflow。現在は本ディレクトリが正本
