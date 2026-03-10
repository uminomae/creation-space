# evidence/work/ -- 初期スキャンと中間素材

このディレクトリは、evidence 本体へ蒸留される前のスキャン出力や中間素材を置く場所である。

## 5W1H

### What

Phase 1 初期スキャンの生出力、トリアージ結果、Deep Research 準備素材を置く。
現在は 17 ファイルある。

### Why

最終版の evidence だけを残すと、「何を候補に挙げ、何を落とし、どういう途中経過を辿ったか」が消える。
このディレクトリは、L4 試行錯誤の資産化を実現するための作業層である。

### Who

pjdhiro、Claude、Codex が使う。
初期候補の確認、トリアージ根拠の再読、古い分類との対応確認をしたいときに読む。

### When

主に 2026-02 初旬〜中旬の Phase 1 で作成された。
2026-03-10 に旧 private repo の `base/evidence/work/` から移動した。

### Where

現在地は `creation-space/evidence/work/`。
30領域構造類似調査の「作業台」「ワークベンチ」に相当する。

### How

Claude が各領域にスキャンを実行して候補を抽出し、`phase3-triage.md` で分類し、採用候補だけを evidence 本体へ昇格させる流れで蓄積された。
scan-* ファイルは Phase 1 時点のアルファベット分類をそのまま残している。

## 参照

- トリアージ結果: [phase3-triage.md](phase3-triage.md)
- Step 6 設計: [../review/plan-step6-fieldwork.md](../review/plan-step6-fieldwork.md)
- 親ディレクトリ: [../README.md](../README.md)
- 関連記録番号: #62

## ファイル一覧

| ファイル | 役割 |
|---|---|
| `deepresearch-d01-mathematics-briefing.md` | D01 数学向け Deep Research 依頼書の移動案内 |
| `deepresearch-d24-d30-output.md` | D24-D30 の GPT Deep Research 出力まとめ |
| `phase3-triage.md` | 42候補の Phase 3 トリアージ結果 |
| `scan-A-law-politics.md` | 法学・政治学の初期スキャン |
| `scan-B-economics-theory.md` | 理論経済学の初期スキャン |
| `scan-C-history.md` | 歴史学の初期スキャン |
| `scan-D-linguistics.md` | 言語学の初期スキャン |
| `scan-E-sociology.md` | 社会学の初期スキャン |
| `scan-F-literary-studies.md` | 文学・文芸学の初期スキャン |
| `scan-G-chemistry.md` | 化学の初期スキャン |
| `scan-H-evolutionary-biology.md` | 進化生物学の初期スキャン |
| `scan-I-earth-science.md` | 地球科学の初期スキャン |
| `scan-J-astronomy-cosmophysics.md` | 天文学・宇宙物理学の初期スキャン |
| `scan-K-engineering-information-science.md` | 工学・情報科学の初期スキャン |
| `scan-L-agriculture-ecology.md` | 農学・生態学の初期スキャン |
| `scan-M-pharmacy.md` | 薬学の初期スキャン |
| `scan-N-clinical-medicine-immunology.md` | 臨床医学・免疫学の初期スキャン |
