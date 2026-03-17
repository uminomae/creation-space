# evidence/archive

**目的**: evidence ファイルの Revise 前スナップショットを保存する。

**背景**: D22 Revise 作業で Revise 前版の直接参照手段が不足したため、#123 を受けて退避場所を整備し、#126 で運用ルールを確定した。

**ルール**: `docs/operations.md §3.2.1` を参照。

## ⚠️ archive に保存する前に

このディレクトリは `evidence/evidence-D{NN}-*.md` の **Revise 前スナップショット専用**です。
Revise 後の最新版や deepdive 出力をここへ置かないこと。

- 先に `docs/operations.md §3.2.1` を読む
- archive コピーと Revise 本体は **同一コミット** に含める
- 命名は `evidence-D{NN}-pre-revise-{YYYYMMDD}.md` に統一する

## ファイル命名規則

```
evidence-D{NN}-pre-revise-{YYYYMMDD}.md
```

例: `evidence-D22-pre-revise-20260307.md`

## 参照方法

- **ファイル直接比較**: archive ファイルと現行 `evidence/evidence-D{NN}-*.md` を diff する
- **git 履歴**: archive を追加したコミットと Revise 本体の差分を `git show` / `git diff` で確認する

## 運用ルール

- `evidence/evidence-D{NN}-*.md` を Revise する前に、当時点のファイルをここへコピーする
- archive コピーと Revise 本体は **同一コミット** に含める
- `git tag` は使わず、archive ファイル名と git 履歴で追跡する

## 保存済みアーカイブ

| ファイル | 対象 | 保存日 | 備考 |
|---|---|---|---|
| `evidence-D22-pre-revise-20260307.md` | D22 | 2026-03-07 | Run1 指摘反映前の退避 |
| `evidence-D22-business-management-20260307-pre-revise.md` | D22 | 2026-03-07 | 初期命名の旧 archive。互換保持のため残置 |
| `evidence-D23-pre-revise-20260309.md` | D23 | 2026-03-09 | #167 deepdive 前の退避。archive 漏れの事後復元 |

## 先に読むファイル

- `docs/operations.md` 正本（外部運用repo）
- [evidence/README.md](/Users/uminomae/dev/creation-space/evidence/README.md)

## この README の役割

命名規則・保存理由・既存 archive 一覧の正本は本ファイルが担う。

## 関連

- Issue: #123, #126
- Metadata rule: `docs/evidence-metadata-creation.md`
