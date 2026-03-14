---
id: issue62-domain-template-academic-ja-v1
title: "Issue #62 学術分冊テンプレート（領域別）"
subtitle: "省略なし・研究レポート兼読み物"
lang: ja
version: 1.0
date: 2026-03-04
generator_model: claude:claude-opus-4-6+gpt:deep-research
generated_at: 2026-03-04
---

# Issue #62 学術分冊テンプレート（領域別）

> 本テンプレートは、`transform/domains/publish/domains/` に配置する領域別分冊の標準形です。  
> 目的は「対比表だけで終わらず、判断理由・限界・上位プロジェクト接続までを1本で読めること」です。

## 0. 使用ルール（必須）

- 省略しない:
  - **対比表**だけでなく、**採否理由・反証条件・適用境界・接続先ファイル**まで書く。
- 温度を分離する:
  - [P] 文献で確認済み
  - [M] 構造比較による推定
  - [S] 仮説（保持論点）
- 「読み物」として成立させる:
  - 各節冒頭に「何を明らかにする節か」を1-2文で先に書く。
- 上位接続を明示する:
  - D1/D2/D3/D4, M1/M2, ISS, reader-rules, publish資産への反映点を明記する。

---

## 1. フロントマター（差し替え）

```yaml
---
id: issue62-domain-dXX-<slug>-academic-ja-vN
title: "Issue #62 学術分冊 DXX <領域名>"
subtitle: "初見読者向け: 作業内容・比較理論・構造類似の分析"
lang: ja
version: 1.0
date: YYYY-MM-DD
domain_id: DXX
domain: <slug>
source_issue: internal-issue-62
source_issue_comment_latest: internal-log-latest
source_material:
  - /Users/uminomae/dev/creation-space/evidence/evidence-DXX-<slug>.md
  - /Users/uminomae/dev/creation-space/evidence/202602-deep-research-30domains-gpt/DR-DXX-<slug>.md
generator_model: {tool}:{model_string}  # 例: claude:claude-opus-4-6+gpt:deep-research
                                         # 書式ルール: /Users/uminomae/dev/creation-space/docs/evidence-metadata-creation.md §2.5
generated_at: YYYY-MM-DD
---
```

---

## 2. 本文テンプレート（省略なし）

```markdown
# Issue #62 学術分冊 DXX <領域名>

> LLMモデル: <model>
>
> 作成日: YYYY-MM-DD
>
> 対象: DXX（<領域名>）

## 0. 読み方（初見向け）

- 本稿で何を検証するか（2-3行）
- どこまで確定で、どこが探索中か（2-3行）
- まずどの節から読むとよいか（1行）

## 1. 何をしたか（作業内容）

- 対象領域:
- 目的:
- 実施内容（最低3項目）:
  - 進捗同期（Issueコメントの日付）
  - evidence/DR からの理論抽出
  - 比較手順と判定基準の定義

## 2. 比較対象の既存理論（全件）

> [記述ガイド] 2〜5件ではなく、今回採否判断した対象を全件列挙する。

| 理論 | 採用可否（暫定） | 主理由 |
|---|---|---|
| <theory-1> | Accept / Hold / Reject | <理由> |
| <theory-2> | ... | ... |

## 3. 分析手順（判定ロジック）

1. 原典主張の短文化（粒度統一）
2. 5段階側の短文化（場→波→縁→渦→束）
3. 遷移意味で照合（段階数一致だけで判定しない）
4. E-1〜E-8で採否判定
5. CHK-A〜D（非二元性・フラクタル・指月・群盲象）で過剰投影を除外

## 4. 構造類似の比較結果（統合表）

> [記述ガイド] 「似ている」ではなく、どの段階で何が同型かを書く。

| 理論 | 5段階対応 | 縁の記述強度 | D1/D3/D4接続 | 一致しない点 | 根拠強度 |
|---|---|---|---|---|---|
| <theory-1> | 場←..., 波←..., ... | 🔴/🟡/⬜ | D1:..., D3:..., D4:... | <差分> | 高/中/低 |

## 5. 判断理由（対比表の裏側）

### 5.1 採用した理由

- <理論A> を採用した理由:
  - E-1:
  - E-3:
  - E-7:

### 5.2 保持/棄却した理由

- <理論B> を Hold/Reject した理由:
  - どの条件で再採用可能か
  - 何が不足しているか（文献/機序/スケール）

## 6. 反証候補と適用境界

> [記述ガイド] 反証不能な主張を残さない。

- 反証候補1:
  - 観測条件:
  - 観測されたら何を下方修正するか:
- 反証候補2:
  - ...

## 6.5 研究結果→上位プロジェクト接続（必須）

> [記述ガイド] この節は必須。分冊が「読んで終わり」にならないための接続点を明示する。

| 研究で得た結果 | 上位概念 | 反映先ファイル | 反映ステータス | 次アクション |
|---|---|---|---|---|
| <insight-1> | D1/D2/D3/D4 | base/schema/core-definitions.md | 未反映/反映済 | <action> |
| <insight-2> | M1/M2 | base/schema/four-layers.md / five-stages.md | ... | ... |
| <insight-3> | ISS | <ISS管理先> | ... | ... |
| <insight-4> | 読者変換 | transform/domains/reader-rules/*.md, transform/guides/reader-rules/*.md | ... | ... |
| <insight-5> | 公開資産 | transform/domains/publish/*.md | ... | ... |

## 7. 読み物としての要点（知と洞察）

> [記述ガイド] ここは単なる要約ではなく「この領域が何を見せてくれたか」を書く。

- 洞察1（この領域でしか見えないもの）
- 洞察2（他領域にも移植できるもの）
- 洞察3（誤読しやすいが重要な差）

## 8. 次アクション

1. <検証アクション>
2. <文書更新アクション>
3. <公開アクション>

## 9. 参照

- Issue #62: 内部管理
- 内部進捗ログ
- `/Users/uminomae/dev/creation-space/evidence/evidence-DXX-<slug>.md`
- `/Users/uminomae/dev/creation-space/evidence/202602-deep-research-30domains-gpt/DR-DXX-<slug>.md`
- （必要に応じて）関連 schema / reader-rules / decision-log
```

---

## 3. 運用チェックリスト（執筆後）

- [ ] 比較対象を「全件」列挙した（有名理論だけを抜粋していない）
- [ ] 統合対比表に「一致しない点」を明記した
- [ ] 反証候補を2件以上書いた
- [ ] `6.5` で上位プロジェクト接続を具体ファイルで示した
- [ ] [P]/[M]/[S] の温度混在を整理した
- [ ] 「わからない点」を隠さず残した

---

## 4. 補足

- 本テンプレートの狙いは、作業を重くすることではなく、  
  「調査→判断→反映」の断絶を防ぐことにある。
- 迷った場合は、`issue62-research-bridge-ja.md` の接続表を先に埋める。
