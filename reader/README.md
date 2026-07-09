# reader/ — テーマ解説ページ（生成物）

**このディレクトリ内の HTML は生成物。直接編集禁止。**

| ページ | 正本（編集はこちら） |
|---|---|
| `wave-vortex.html` | `evidence/themes/TH-001-wave-vortex-ontology/READER-wave-vortex.md` |

## このページが何か

`wave-vortex.html` は **TH-001 wave-vortex-ontology（波間の渦）調査の万人向け解説ページ（草稿）**。
調査の進行（cs#258 / cs#259）に合わせて正本 MD が更新され、本ページはそれに追随する。
草稿のため `<meta name="robots" content="noindex">` を付与している。

## 更新手順

1. 正本の READER (MD) を編集する
2. 再生成: `python3 scripts/build-reader-th.py`
3. ローカル確認: `bash server.sh 3002` → http://127.0.0.1:3002/reader/wave-vortex.html

テスト用に別ファイルを指定できる:

```bash
python3 scripts/build-reader-th.py --src "$TMPDIR/fixture.md" --out "$TMPDIR/out.html"
```

## デザイン制約（必須）

生成ページは cs の VI を継承する（`dashboard.html` 方式。WebGL なし）:

- `src/styles/tokens.css` の CSS 変数のみで配色（生 `rgba(数値)` 直書き禁止）
- cosmic ambient 背景（radial-gradient）
- 見出し・カード・目次は `reader-heading` / `reader-card` / `reader-toc` クラス
  （テンプレート `scripts/reader-th-template.html` 内で定義）
- 信頼度バッジ: `.badge-p` 実証済み / `.badge-m` 解釈 / `.badge-s` 推測
