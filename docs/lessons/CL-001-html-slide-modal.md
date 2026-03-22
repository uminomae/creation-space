# CL-001: Markdown スライドは 16:9 の HTML modal を基本にする

**日付**: 2026-03-22
**関連Issue**: cs#286

## 何が起きたか

Markdown をアプリ内でスライド表示するために Reveal.js ベースの viewer を組み込んだが、表示が一瞬だけ見えて真っ暗になる不具合が続き、CSS 調整を重ねても安定しなかった。

## 原因分析

この用途で本当に必要だったのは「プレゼンソフトの deck」ではなく、「16:9 固定の HTML デザインページを modal で順送り表示すること」だった。そこに Reveal.js という別のレイアウトエンジンを持ち込んだため、viewer 側とサイト側で寸法管理が二重化した。

- 見た目を作るたびに engine 側の centering / transform と競合する
- CSS バグの切り分けが「コンテンツ問題」ではなく「外部 engine 統合問題」になる
- 生成元が Markdown でも、必要なのは HTML ページャーで十分なのに設計が過剰になっていた

根本原因は、要件より重い表示基盤を選んだこと。

## 対策

1. Markdown 由来のスライド表示は、まず 16:9 固定の HTML modal を自前実装で検討する
2. 外部 slide engine は、fragments・nested deck・speaker notes・export など固有機能が本当に必要なときだけ導入する
3. viewer の責務は「ページ送り」と「固定比率の表示」に限定し、デザインは通常の HTML/CSS として組む

## infusion先

| 反映先 | 変更内容 | 日付 |
|---|---|---|
| `docs/design-system.md` | Markdown スライドは 16:9 HTML modal を優先する原則を追加 | 2026-03-22 |
| `src/slide-viewer.js` | Reveal.js 依存をやめ、HTML ページャーへ置換 | 2026-03-22 |
| `src/styles/slides.css` | 16:9 固定の HTML modal デザインへ再構成 | 2026-03-22 |

## 状態

- [x] infused / closed
