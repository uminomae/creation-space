# Cowork セッション運用ルール

## Cowork とは

Cowork は Claude Desktop App の機能で、軽量 Linux VM 内で動作する。
CLI（Claude Code）とはプロセス・コンテキストが完全に分離されている。

## VM 環境の制約

| 項目 | 制約 | 対処 |
|------|------|------|
| ファイルシステム | VM ルートは揮発性。共有マウントのみ永続 | `.claude/rules/cowork-output.md` に従う |
| git 操作 | `.git/index.lock` が FUSE 制約で削除不能な場合がある | コミットを CLI に委任する |
| ネットワーク | egress proxy により curl/wget がブロックされる場合がある | GitHub MCP API を代替手段とする |
| CLI メモリ | `~/.claude/` にアクセス不可 | handoff ファイルで CLI に委任する |

## セッション開始手順

1. **共有マウントの確認**
   ```bash
   ls /sessions/*/mnt/creation-space/CLAUDE.md
   ```
   このパスが creation-space のルート。以降の全作業はここ配下で行う。

2. **CLAUDE.md を読む**

3. **タスクに応じたルール・ドキュメントを読む**
   `.claude/rules/docs-navigator.md` の対応表に従う。

4. **CLI からの引き継ぎを確認**
   ```bash
   ls .cache/session/handoff-CLI-*.md 2>/dev/null
   ls .cache/active/TASK-*.md 2>/dev/null
   ```

5. **現在のブランチと状態を確認**
   ```bash
   git branch --show-current
   git status --short --branch
   ```

## Cowork が得意な作業

- スキル作成・テスト（`.claude/skills/` 配下）
- ファイル生成バッチ（HTML、MD、PDF 等）
- UI 変更の実装（`src/` の編集）
- プロトタイピングと検証
- 指示書・ドキュメントの作成

## Cowork が CLI に委任すべき作業

- git commit / push（lock 問題のリスク）
- pjdhiro へのデプロイ
- Issue の起票・管理
- 外部 URL からの大量ファイル取得

## CLI への引き継ぎ手順

1. 成果物を `.cache/` にステージングする
2. `.cache/active/TASK-*.md` に CLI 指示書を作成する
3. 教訓・メモリ保存依頼があれば `.cache/session/handoff-CW-*.md` に書く
4. 未コミット変更がある場合、指示書にコミット手順を含める

## セッション終了時

1. 全成果物が共有マウント配下にあることを確認する
2. CLI 指示書が最新の状態であることを確認する
3. 必要なら handoff ファイルを作成する

## Agent subagent の起動

Cowork から Agent subagent を起動する場合:

- **出力先を明示する**: 共有マウント配下（`.cache/` 等）を Agent プロンプトに含める
- **VM ルートを使わせない**: `/sessions/{id}/` 直下への出力を禁止する指示を入れる
- `.claude/rules/cowork-output.md` の「Agent subagent への適用」セクションも参照

## 命名規約

| ファイル | 規則 |
|---------|------|
| CLI 指示書 | `.cache/active/TASK-{slug}.md` |
| Cowork → CLI handoff | `.cache/session/handoff-CW-{YYYYMMDD}-{slug}.md` |
| 一時生成物 | `.cache/{topic}/` |
