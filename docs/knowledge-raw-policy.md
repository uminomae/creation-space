# knowledge/raw/ 運用ポリシー（cs）

> **正本**: techo/knowledge/pd/mgmt/knowledge-raw-policy.md
> **上位参照**: project-design/knowledge/meta/knowledge-raw-policy.md
> **本ファイルの位置づけ**: cs 固有の補足ルール + 上位への参照

## 参照階層

```
techo（正本）
  └── pd（pd 独自ルール）
        └── cs（本ファイル：pd を参照 + cs 独自ルール）
```

上位のルールを継承し、矛盾がある場合は上位が優先する。
ただし、repo 固有の事情による補足・具体化は本ファイルで定義する。

## 上位から継承するルール

以下は techo 正本 → pd 経由で継承される要点。詳細は上位を参照すること。

- **目的**: `knowledge/raw/` に一次データ（論文 PDF 等）を集約
- **命名規則**: `{領域ID}_{著者姓}_{年}_{キーワード}.pdf`
- **メタデータ**: raw/README.md と manifest に格納一覧を記載
- **Git 管理**: 試行段階は通常管理、50MB 超で LFS 移行
- **著作権**: OA・プレプリント優先、private repo のみ

## cs 独自ルール

### 格納対象

cs の raw/ には以下を格納する。

- **30領域（D01〜D30）に属する原典**を優先的に格納する
- 5段階モデル（場→波→縁→渦→束）の構造類似を示す原典
- 各 `evidence-D*.md` が参照している論文・書籍・公式一次資料

### 原典アクセス状態

`cs#207` 以降、原典候補は次の状態で管理する。

| status | 意味 | 調査報告での扱い |
|---|---|---|
| `raw-confirmed` | 原典ファイルを `knowledge/raw/` に格納し、本文を直接確認済み | [P] 主張の verified 候補になれる |
| `citation-only` | 書誌情報や出版社ページ等は確認済みだが、本文は未確認 | 書誌存在の確認まで。内容要約の根拠には使わない |
| `blocked-access` | 合法的な入手経路はあるが、現時点で本文にアクセスできない | 保留。verified 扱いしない |
| `not-yet-reviewed` | まだ棚卸し前 | 保留。verified 扱いしない |

### 停止条件

- 原典本文を直接確認していない [P] 主張は verified / accepted の根拠にしない
- `citation-only` と `blocked-access` は「再調査待ち」に留める
- LLM の要約や二次資料の補完で成立している可能性がある本文は archive に退避し、再監査後に戻す

### evidence/ との紐付け

cs には `evidence/evidence-D01-mathematics.md` 〜 `evidence/evidence-D30-*.md` が存在する。
raw に原典を格納した場合、対応する evidence ファイルには access status を添えて追記する。

```markdown
## 原典参照
- [D14_csikszentmihalyi_1990_flow.pdf](../knowledge/raw/D14_csikszentmihalyi_1990_flow.pdf) — フロー理論の原典、access status: raw-confirmed
```

raw 未格納の場合は、`knowledge/raw/manifest.md` 側で `citation-only` / `blocked-access` を明示し、evidence 側では verified 判定を保留する。

### knowledge/domains/ との関係

- `knowledge/domains/D*/` は公開用レポート（二次データ）
- `knowledge/raw/` は原典ファイル（一次データ）
- `knowledge/raw/manifest.md` が、どの原典を取得済みか・未取得かの正本になる
- `knowledge/domains/` のレポートは、再監査済みの `evidence/` を介して raw へ遡れる状態を目標とする

### ディレクトリ構成

```
knowledge/
├── raw/
│   ├── README.md
│   └── manifest.md
├── domains/
├── schema/
├── glossary.md
└── five-stages-guide.md
```

### cs#205 と cs#207 の関係

- `cs#205` は `knowledge/raw/` と manifest の受け皿を整備する
- `cs#207` は「原典未入手時にどう止めるか」を定義し、既存調査報告を archive 前提で再監査する
- cs では **raw の受け皿整備を先に行い、実際の PDF 格納と verified 再構成は cs#207 の棚卸しに従って進める**

### 領域横断の原典

- 領域横断的な原典（DXX）は **pd の raw/** に格納することを優先する
- cs に置くのは、特定領域との関連が明確なもののみ

## 関連

- 正本: `techo/knowledge/pd/mgmt/knowledge-raw-policy.md`
- 上位: `project-design/knowledge/meta/knowledge-raw-policy.md`
- `knowledge/raw/README.md`
- `knowledge/raw/manifest.md`
- `evidence/investigation/original-access-rerun-plan.md`
- cs#205: 本 repo での試行 Issue
- cs#207: 原典未入手時の再監査 Issue
- techo#97: ポリシー策定元
