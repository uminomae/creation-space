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
- **メタデータ**: raw/README.md に格納一覧を記載
- **Git 管理**: 試行段階は通常管理、50MB 超で LFS 移行
- **著作権**: OA・プレプリント優先、private repo のみ

## cs 独自ルール

### 格納対象

cs の raw/ には以下を格納する:

- **30領域（D01〜D30）に属する原典**を優先的に格納する
- 5段階モデル（場→波→縁→渦→束）の構造類似を示す原典
- 各 evidence-D*.md が参照している論文の原典

### evidence/ との紐付け

cs には既に `evidence/evidence-D01-mathematics.md` 〜 `evidence-D30-*.md` が存在する。
raw/ に原典を格納した場合、対応する evidence ファイルに以下を追記する:

```markdown
## 原典参照
- [ファイル名](../knowledge/raw/{ファイル名}) — {簡潔な説明}
```

### knowledge/domains/ との関係

- `knowledge/domains/D*/` は公開用レポート（二次データ）
- `knowledge/raw/` は原典ファイル（一次データ）
- domains/ のレポートが raw/ のどの原典に基づくかを README.md で追跡する

### ディレクトリ構成

```
knowledge/
├── raw/                    # ← 新設
│   └── README.md
├── domains/                # 既存: D01〜D30 レポート
├── schema/                 # 既存: スキーマ定義
├── glossary.md             # 既存
└── five-stages-guide.md    # 既存
```

### 領域横断の原典

- 領域横断的な原典（DXX）は **pd の raw/** に格納することを優先する
- cs に置くのは、特定領域との関連が明確なもののみ

## 関連

- 正本: `techo/knowledge/pd/mgmt/knowledge-raw-policy.md`
- 上位: `project-design/knowledge/meta/knowledge-raw-policy.md`
- cs#205: 本 repo での試行 Issue
- techo#97: ポリシー策定元
