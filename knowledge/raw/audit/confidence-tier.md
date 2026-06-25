# cs#253 C軸: confidence tier（A実在 × B取得 × source-note × 採録根拠）

対象 404 行。A軸/B軸 jsonl と source-note 有無・採録マーカーの決定的 join。

## ティア分布

| tier | 件数 | 意味 |
|---|---|---|
| T1_READ | 293 | source-note あり=精読済（最高位） |
| T2_OBTAINABLE | 2 | 実在確認 かつ 今取得可 |
| T3_REAL_BLOCK | 9 | 実在確認 かつ env-block（別egress必要） |
| T4_REVIEW | 1 | raw/url-verified で機械未確認/欠陥/STUB（要人手） |
| T5_READLIST | 99 | citation-only/blocked-access=取得不能・read-list（cs#252・公開解釈なし） |

## 採録マーカー別のティア分布（出自と信頼の相関）

| marker | T1 | T2 | T3 | T4 | T5 | 計 |
|---|---|---|---|---|---|---|
| [similar-papers] | 121 | 1 | 6 | 1 | 16 | 145 |
| [no-oa] | 0 | 0 | 0 | 0 | 43 | 43 |
| [phase-1-exhausted] | 0 | 0 | 0 | 0 | 18 | 18 |
| [phase-3-confirmed] | 0 | 0 | 0 | 0 | 14 | 14 |
| [phase-3-candidate] | 0 | 0 | 0 | 0 | 2 | 2 |

## T4_REVIEW 1 行（要人手）

| sid | status | A(実在) | A_quality | B(取得) | markers |
|---|---|---|---|---|---|
| D23-S14 | url-verified | MISMATCH | STUB | OA_HTML | similar-papers |
