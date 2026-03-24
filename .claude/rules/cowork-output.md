# Cowork セッションの出力先ルール

## 背景

Cowork は軽量 Linux VM 内で動作する。VM のファイルシステムは以下の構造を持つ:

```
/sessions/{session-id}/                  ← VM ルート（揮発性、CLI からアクセス不可）
/sessions/{session-id}/mnt/creation-space/ ← ホストとの共有マウント（永続、CLI からアクセス可）
```

VM ルート配下に出力したファイルは、セッション終了後にアクセスできず、CLI や他のエージェントからも到達できない。

## ルール

**Cowork セッションで生成するすべてのファイルは `/sessions/{session-id}/mnt/creation-space/` 配下に置くこと。**

VM ルート（`/sessions/{session-id}/` 直下）を作業ディレクトリに使ってはならない。

## 出力先の選択基準

| ファイルの性質 | 配置先 | 例 |
|--------------|--------|---|
| 一時的な生成物・ステージング | `.cache/{topic}/` | `.cache/rich-slides-output/ja/*.html` |
| CLI への指示書 | `.cache/active/TASK-*.md` | `.cache/active/TASK-rich-slides-deploy.md` |
| コミット対象のソース | `src/`, `scripts/`, `.claude/skills/` 等 | `src/slide-viewer.js` |
| 他リポジトリ向け成果物 | `.cache/{topic}/` でステージング | `.cache/pjdhiro-staging/` |

## 理由

- `.cache/` は `.gitignore` 対象であり、一時ファイルで git を汚染しない
- CLI がセッション開始時に `.cache/` を読むため、引き継ぎが成立する
- VM ルートに置くと CLI への再生成指示が必要になり、作業が二重になる

## 典型的な違反パターン

```bash
# NG: VM ルートに出力
mkdir -p /sessions/{session-id}/output/
python3 generate.py --output /sessions/{session-id}/output/

# OK: 共有マウント配下の .cache/ に出力
mkdir -p .cache/output/
python3 generate.py --output .cache/output/
```

## Agent subagent への適用

Cowork から Agent subagent を起動する場合も同じルールが適用される。
Agent プロンプトに出力先を明示し、共有マウント配下を指定すること。
