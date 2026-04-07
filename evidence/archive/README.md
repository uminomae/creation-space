# evidence/archive

**目的**: evidence 系ファイルの Revise 前スナップショットと、再監査前の一括退避版を保存する。

**背景**: D22 Revise 作業を契機に #123 / #126 で archive 運用を整備した。
2026-04-07 には `cs#207` により、原典アクセス再監査のため 30領域 evidence 本体と Phase 9 ref-check を一括退避した。

**ルール**: `docs/operations.md §3.2.1` を参照。

## 使い分け

- ルート直下の `evidence-D{NN}-pre-revise-{YYYYMMDD}.md`
  - 個別 Revise 前の単発スナップショット
- `pre-rerun-20260407/`
  - `cs#207` 対応の一括 archive
  - `evidence/` と `phase9/` の 2026-04-07 時点本文を保存

## ⚠️ archive に保存する前に

個別 Revise の場合は、引き続き `evidence/evidence-D{NN}-*.md` の **Revise 前スナップショット**として扱う。
一括退避は、Issue ベースの再調査や再監査を始めるときだけ使う。

- 先に `docs/operations.md §3.2.1` を読む
- archive コピーと Revise 本体は **同一コミット** に含める
- 個別 Revise の命名は `evidence-D{NN}-pre-revise-{YYYYMMDD}.md` に統一する

## 個別 Revise の命名規則

```
evidence-D{NN}-pre-revise-{YYYYMMDD}.md
```

例: `evidence-D22-pre-revise-20260307.md`

## 参照方法

- **ファイル直接比較**: archive ファイルと現行パスを diff する
- **git 履歴**: archive を追加したコミットと現行 stub / revise 本体の差分を `git show` / `git diff` で確認する

## 保存済みアーカイブ

| ファイル / ディレクトリ | 対象 | 保存日 | 備考 |
|---|---|---|---|
| `evidence-D22-pre-revise-20260307.md` | D22 | 2026-03-07 | Run1 指摘反映前の退避 |
| `evidence-D22-business-management-20260307-pre-revise.md` | D22 | 2026-03-07 | 初期命名の旧 archive。互換保持のため残置 |
| `evidence-D23-pre-revise-20260309.md` | D23 | 2026-03-09 | #167 deepdive 前の退避。archive 漏れの事後復元 |
| `pre-rerun-20260407/` | 30領域 evidence + Phase 9 ref-check | 2026-04-07 | `cs#207` 原典アクセス再監査の基準スナップショット |

## 先に読むファイル

- `docs/operations.md` 正本（外部運用repo）
- [evidence/README.md](/Users/uminomae/dev/creation-space/evidence/README.md)
- [original-access-status.md](/Users/uminomae/dev/creation-space/evidence/review/original-access-status.md)

## この README の役割

命名規則・保存理由・既存 archive 一覧の正本は本ファイルが担う。

## 関連

- Issue: #123, #126, #207
- Metadata rule: `docs/evidence-metadata-creation.md`
