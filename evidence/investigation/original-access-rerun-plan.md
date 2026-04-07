# 原典アクセス再監査計画

**更新日**: 2026-04-07
**Issue**: cs#207

30領域調査をやり直すにあたり、原典アクセス可否を先に棚卸しし、既存の分析本文を archive 参照へ切り替えたうえで再構成するための計画。

**完了条件は「D01-D30 の全領域で source 単位の access status が付与され、raw-confirmed / citation-only / blocked-access / not-yet-reviewed のいずれかに振り分けられていること」**。
first-wave は順番に進めるための実装単位であり、D14 / D18 だけで終わりではない。

## 背景

- 原典本文を直接確認していないまま [P] 主張が強く見えている可能性がある
- 無料入手できない原典や本文未確認の書籍が混在している
- LLM の補完が混じったまま verified / accepted が維持されると、30領域全体の信頼性が崩れる

## access status

| status | 意味 | 使い方 |
|---|---|---|
| `raw-confirmed` | 原典ファイルあり、本文確認済み | [P] 主張の verified 候補 |
| `citation-only` | 書誌情報のみ確認済み | 内容要約の根拠には使わない |
| `blocked-access` | 合法的な入手経路はあるが本文未入手 | 保留 |
| `not-yet-reviewed` | まだ棚卸し前 | 保留 |

## 進め方

1. 現行 `evidence-D*.md` と `phase9/ref-check-*.md` を archive に退避する
2. 元のパスには再監査待ち stub を置く
3. `knowledge/raw/manifest.md` に候補原典を登録する
4. 領域ごとに access status を判定する
5. `raw-confirmed` を増やしながら evidence / ref-check を history 参照つきで再作成する

## 現在のスコープ

- `evidence/evidence-D*.md`
- `evidence/investigation/phase9/ref-check-D*.md`
- `knowledge/raw/manifest.md`
- `evidence/review/original-access-status.md`

## 優先順位

- **第1群**: OA や公式公開版を確保しやすく、公開レポートへの影響も大きい領域
  - D08, D10, D14, D18, D20, D21, D22, D25
- **第2群**: 論文と書籍が混在し、access status の切り分けが必要な領域
  - D01, D02, D03, D04, D05, D06, D07, D09, D11, D12, D16, D17, D23, D26, D27, D28, D29
- **第3群**: 書籍・古典・翻訳依存が強く、blocked-access が増えやすい領域
  - D13, D15, D19, D24, D30

## history ルール

- 2026-04-07 時点の本文は `evidence/archive/pre-rerun-20260407/` を参照する
- 再作成時は、新しい本文から archive 先を必ずリンクする
- 「何が未検証だったか」「どこまで raw-confirmed になったか」を本文冒頭に明示する
