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
| `url-verified` | OA URL でページ・PDF の存在を確認済み（多くは**人間がブラウザで確認**） | **本文抽出の保証ではない**。下記「原典取得・検証の追加規律」を必ず参照 |
| `citation-only` | 書誌情報や出版社ページ等は確認済みだが、本文は未確認 | 書誌存在の確認まで。内容要約の根拠には使わない |
| `blocked-access` | 合法的な入手経路はあるが、現時点で本文にアクセスできない | 保留。verified 扱いしない |
| `not-yet-reviewed` | まだ棚卸し前 | 保留。verified 扱いしない |

> ⚠️ **`url-verified` の落とし穴**: この状態は「URL が存在し閲覧できた」までしか保証しない。
> その URL を **LLM が WebFetch/curl で取得し、原文を抽出できるか**は別問題（→ cs#221）。
> また、取得した PDF が **manifest の論文と同一か**も別問題（→ cs#240, D03-S08, D23-S08）。
> source-note 生成前に「原典取得・検証の追加規律」（本ファイル末尾）を必ず適用すること。

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
- cs#212: blocked-access 出口条件定義
- techo#97: ポリシー策定元

---

## blocked-access / citation-only 出口条件（cs#212）

### 取得手段の試行フロー

blocked-access / citation-only source に対して、以下の順序で試行する。試行結果は manifest の備考欄に記録。

#### Phase 1: 無料・合法の直接取得

1. OA版・著者最終稿（出版社 Gold OA、accepted manuscript）
2. プレプリントサーバ（arXiv, bioRxiv, SSRN, PhilPapers）
3. 機関リポジトリ（大学 DSpace / CRIS）
4. 著者個人ページ（ResearchGate, Academia.edu, 個人サイト）
5. OA アグリゲータ（Unpaywall, CORE — DOI 必須）
6. Google Scholar「全バージョン」
7. Internet Archive / Open Library（借覧・digitized 版）
8. HathiTrust / Project Gutenberg（パブリックドメイン）

#### Phase 2: 有料・手続きが必要（pjdhiro 専権）

- 図書館ILL（相互貸借）
- 書籍購入（中古・電子版含む）
- 著者への直接連絡（reprint 依頼）

CLI は候補の提示と費用感の調査まで。実行判断は pjdhiro。

#### Phase 3: 代替 source 探索（原典取得不可の場合）

| 優先度 | 代替手段 | 条件 |
|--------|----------|------|
| A | 同著者の後継論文・改訂版 | 同じ理論を著者自身が更新・再述 |
| B | 同著者の別媒体での再述 | 講演録、インタビュー、教科書章 |
| C | メタ分析・系統的レビュー | 原典の主張を直接引用し検証した査読済み論文 |
| D | 複数の独立した二次文献の一致 | 3件以上の信頼できる二次文献が同一主張を引用 |

### 代替参照の許容条件

- 代替 source 自体が `raw-confirmed` であること
- 原典のどの主張を代替 source のどの記述で補完しているか明示すること
- `[原典未確認・代替参照]` ラベルを付与すること
- 代替 D ランク（二次文献一致）は理論の骨格主張には使わない（周辺事実の補強のみ）

### source 単位の出口条件

| 状態 | 出口 |
|------|------|
| `blocked-access` | Phase 1 全試行済 → pjdhiro が Phase 2 判断 → 不可なら Phase 3 → 代替採用 or 取得断念 |
| `citation-only` | まず Phase 1 試行 → `raw-confirmed` / `blocked-access` / 代替採用 に遷移 |
| 代替採用 | 代替 source が `raw-confirmed` + 許容条件充足 → `alt-confirmed` として管理 |
| 取得断念 | Phase 1-3 すべて不可 → 当該 source に依拠する主張を分析から除外。除外理由を記録 |

### 領域単位の出口条件

- 領域内の全 source が `raw-confirmed` / `alt-confirmed` / `取得断念（除外済み）` のいずれかに到達 → 再調査開始可
- 再調査は confirmed source のみに基づいて一から書く（既存分析のパッチではない）

---

## 原典取得・検証の追加規律（cs#250 / 教訓 cs#221・cs#240）

> **この節は source-note / wiki 生成の取得作業を始める前に必ず読むこと。**
> 過去に同じ失敗（取得をわかったつもりで間違える）を cs#221・cs#240 で文書化したが、
> 正本に統合されず CLOSED され、毎回ゼロから再発見していた。その再発防止のための正本。

### 規律 1: `url-verified` は「取得可能」を意味しない（検証主体と読解主体のズレ, cs#221）

`url-verified` の検証は多くが **人間（ブラウザ）** によるもので、**あらゆるホスト・anti-bot を突破できる**。
一方、source-note / wiki を生成する **LLM（WebFetch / curl / sandbox）は取得能力が大きく制限される**。
したがって `url-verified` を見て「取得できる」と判断してはならない。**実際に取得・抽出できて初めて使える。**

LLM 取得経路の現実（2026-06-21 cs#249 実測。経路が変われば更新する）:

| 経路 | 結果 | 例 |
|---|---|---|
| `link.springer.com` の content/pdf | ✅ curl で実 PDF | Anzola 2016, Dietrich 2004 |
| 小規模 edu / 機関リポジトリ / 著者サイトの born-digital PDF | ✅ WebFetch がローカル保存 → `pdftotext` | wisc.edu, ulisboa, ucf, msu, iu.edu, plijournal, pbworks |
| **大手 publisher（MDPI / Nature / PNAS / Wiley / SAGE / Cell / Frontiers / figshare）** | ❌ Akamai/Atypon の 403/402 | mdpi.com, nature.com, pnas.org |
| **JSTOR / philpapers / ecologyandsociety / karger** | ❌ 403 / JS challenge | — |
| **スキャン PDF（archive.org 書籍 / 一部 .edu）** | ⚠️ `pdftotext` 不可 → **OCR 必要**（Read の PDF ビジョン or 手動） | Connell(columbia), Mahoney(ethz), Suarez |
| **認証 / cert エラー** | ❌ login redirect / cert 不正 | wiu, kingston, warwick, uba.ar |

→ ❌ のホストは **LLM 単独では取得不可**。手動DL→`raw-confirmed`（規律 3）か並列エージェント経路に回す。
**ブロック先を同じ方法で何度も叩かない**（歩留まりゼロ。これが「わかったつもり」の典型）。

### 規律 2: 書誌クロスチェック必須（取得物の同定, cs#240 / D03-S08）

取得した PDF から source-note を生成する**前に**、必ず以下を照合する:

1. `pdftotext <pdf> - | head` または `pdfinfo <pdf>` で **タイトル・著者・年**（可能なら DOI）を抽出
2. manifest 行（`source_title` / 著者 / 年 / DOI）と照合
3. **不一致なら生成を停止**し、`.cache/inbox/` に manifest 誤りとして起票（cs#248 後続として扱う）

過去の実害:
- **D03-S08**: 著者順・年・巻号・頁・DOI が manifest と全部違い、11日間未検出（cs#240）
- **D23-S08**（2026-06-21）: OA URL `repository.uantwerpen.be/.../d:irua:19968` が **別論文（Luyckx 2023）** を返した。誤論文からの生成を回避し記録

> 自動化（`validate-manifest-sync.sh` への Check 追加 / hook 化）は **cs#240** で継続。本節は手順の正本。

### 規律 3: エスカレーション経路（取得不可・スキャン時）

| 状況 | 対応 |
|---|---|
| publisher bot ブロック（規律1の ❌） | **手動DL → `knowledge/raw/` 配置 → `raw-confirmed` 昇格**（Phase 2、pjdhiro 専権。cs#219 と同フロー） |
| スキャン PDF（`pdftotext` 不可） | **OCR**: Read ツールの PDF ビジョン読解、または手動 OCR。原文引用は OCR 由来の崩れを復元し注記 |
| OA URL が別論文 / 404 / 消失 | 規律2に従い manifest 誤りとして起票。正しい OA を再特定（cs#248 後続） |
| すべて不可 | blocked-access 出口条件（本ファイル上節）へ |

### この規律の infuse 先（再発防止）

| 反映先 | 内容 |
|---|---|
| 本ファイル（knowledge-raw-policy.md） | 取得・検証規律の正本 |
| `docs/lessons/CL-008` | 教訓登録 |
| `knowledge/source-notes/READING-PROTOCOL.md` | §2 手順から本節を参照（取得段階の入口） |
