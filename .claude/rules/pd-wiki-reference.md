# pd wiki 参照ルール

## pd wiki とは

`uminomae/project-design` リポジトリの `wiki/sources/D{NN}/D{NN}-S{##}_*.md` に格納された、cs raw PDF から **pd 側 Claude が独立生成** した原典解説ページ群。cs source-note（`knowledge/source-notes/D{NN}/D{NN}-S{##}_*.md`）と同一 source_id をキーに対応する鏡像関係にある。

## cs/pd の役割（cs#228）

| 主体 | 役割 |
|------|------|
| **cs** | 原典から独立して論を構築。pd wiki への出力義務なし |
| **pd wiki** | cs の調査時に LLM が品質チェック用に**参照する素材** |

cs は pd の状態を検査しない。pd 側が `wiki-cross-check.mjs` で矛盾検査を行う（pd#82）。

## いつ参照するか

以下の場面では pd wiki ページを確認する:

1. **source-note 生成時**: 対応する pd wiki ページが存在する場合、自分の 5段階マッピングと比較して大きな乖離がないか確認する
2. **品質チェック依頼時**: pjdhiro から「pd wiki と突合せて」と指示された場合
3. **cross-check 知見の記録時**: cs source-note の §4「cross-check 知見」は pd wiki との突合せ結果を書く欄

参照はあくまで**任意の品質チェック**。cs の結論を pd wiki に合わせる必要はない。

## ファイル構造

```
project-design/
  wiki/
    sources/
      D{NN}/
        D{NN}-S{##}_{slug}.md    # pd wiki ページ
        ...
```

cs source-note との対応:
- cs: `knowledge/source-notes/D22/D22-S09_tuckman-jensen-1977.md`
- pd: `wiki/sources/D22/D22-S09_tuckman-jensen-1977.md`（同 source_id、slug は異なる場合あり）

## アクセス方法

### LOCAL セッション（project-design が cs の兄弟リポジトリ）

```bash
# source_id で直接読む
cat "${REPO_ROOT}/../project-design/wiki/sources/D{NN}/D{NN}-S{##}_*.md"

# glob で探す
ls "${REPO_ROOT}/../project-design/wiki/sources/D22/D22-S09"*
```

### WEB/リモートセッション

**前提**: セッションのリポジトリスコープに `uminomae/project-design` が追加されていること。
Claude Code web の session 設定で project-design を追加すると、GitHub MCP 経由でアクセス可能になる。

追加後は GitHub MCP ツールで読める:

```
mcp__github__get_file_contents(
  owner = "uminomae",
  repo  = "project-design",
  path  = "wiki/sources/D22/D22-S09_tuckman-jensen-1977.md"
)
```

ページ名が不明な場合はディレクトリ一覧を取得:

```
mcp__github__get_file_contents(
  owner = "uminomae",
  repo  = "project-design",
  path  = "wiki/sources/D22"
)
```

**⚠️ 現セッションに project-design が未追加の場合**: アクセスは不可能。その場合は pd wiki との突合わせをスキップし、cs source-note を原典精読のみで完結させる。

## pd wiki ページを読む際のポイント

| 確認項目 | 説明 |
|---------|------|
| **5段階マッピング** | Stage 1–5 の「強/中/弱/なし」が cs source-note と大きく異なる場合は理由を考える |
| **引用・原文解釈** | pd wiki と cs source-note で原文解釈が食い違う場合は原典を再確認 |
| **cross-check 知見（§4）** | cs source-note §4 に「pd wiki との比較」として記録する |

## 不一致が見つかった場合

- cs は pd wiki に合わせる義務はない
- 有意な不一致は cs source-note §4「cross-check 知見」に記録する
- 重大な矛盾（原典解釈の根本的差異）は pjdhiro に報告

## 関連ルール・スクリプト

- `pd-side`: `project-design/scripts/wiki-cross-check.mjs` — pd が cs source-note ↔ pd wiki の矛盾検査を実行
- `cs-side`: `.claude/hooks/source-note-gen-notify.sh` — cs コミット時に pd inbox へ通知（LOCAL のみ）
- 詳細: `.claude/rules/source-note-invariants.md §5`
