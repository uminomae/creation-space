# transform/domains/publish/domains/ — ドメイン公開素材

**目的**: creation ドメイン別の公開用 Markdown と進捗インデックスを置く。

---

## ワークフロー: ここに md を配置するまでの流れ

```
evidence-D{NN}-*.md（creation-space）
  ↓  reader-rules-creation-report.md v2.0 適用
issue62-domain-d{nn}-*-academic-ja.md（本ディレクトリに配置）
  ↓  品質テスト → pjdhiro しっくり感チェック
build-pdf-creation.sh → PDF
  ↓
pjdhiro repo assets/creation/domains/ja/{md,pdf}/ に最終配置
```

**詳細は `read_text_file` で `transform/domains/README.md` のワークフローセクションを読むこと。**

### 現在の進行状況（2026-03-10）

| ファイル | ドメイン | 状態 | 備考 |
|---|---|---|---|
| `issue62-domain-d02-physics-academic-ja.md` | D02 物理学 | 生成済み | NL-010 以前。再生成が必要な可能性 |
| `issue62-domain-d22-business-management-academic-ja.md` | D22 経営学 | 生成済み | 同上 |
| （未生成） | **D23 発達心理学** | **#209 CLI 指示書配置済み** | reader-rules v2.0 適用のテストケース |

---

## ⚠️ このディレクトリに書き込む前に

ここは `/Users/uminomae/dev/creation-space/evidence/` の一次データ置き場ではなく、**publish 用の配置ディレクトリ**です。
新規作成・更新の前に、少なくとも次を `read_text_file` で読むこと。

| 順序 | ファイル | 何のために |
|---|---|---|
| 1 | `transform/domains/reader-rules/reader-rules-creation-report.md` | **変換ルール正本 v2.1。声・構成・禁止事項** |
| 2 | `transform/domains/quality-test/quality-test-domain-report.md` | **品質テスト v1.3。FAIL 基準の内面化** |
| 3 | `transform/domains/README.md` | ワークフロー全体像・配置ルール |
| 4 | `/Users/uminomae/dev/creation-space/docs/evidence-metadata-creation.md` | front matter・進捗ラベルの定義 |

### ⛔ 注意事項

- **テンプレート（`issue62-domain-template-academic-ja.md`）は NL-010 以前の設計で使用禁止。** D1-D4 接続、Accept/Reject、E-1〜E-8 等の禁止語を含む。構成は reader-rules v2.0 §4 に従うこと。
- **pjdhiro/assets/ 配下に配置する md に front matter を含めないこと（NL-012）。** Jekyll がページとして処理しビルドエラーになる。
- **命名規則**: `issue62-domain-d{nn}-{slug}-academic-ja.md`

## ルール

- ここに置くのは publish 用の成果物と `index.json` だけ
- evidence 本体の更新は `/Users/uminomae/dev/creation-space/evidence/` 側で先に行う
- front matter や進捗ラベルは `read_text_file` で `/Users/uminomae/dev/creation-space/docs/evidence-metadata-creation.md` を読み、その定義に従う
- 配置・命名を変える前に `read_text_file` で `transform/domains/README.md` を確認する

### ドメイン公開後の分類更新

ドメインの md + PDF を pjdhiro repo に配置した後、以下の JSON を更新する:

1. **`index.json`**（本ディレクトリ）: `status` → `"published"`, `progress_level` の更新, `md`/`pdf` パスの追加
2. **`pjdhiro/assets/creation/manifests/domains.json`**: `progress_level`, `label_description_ja/en`, `generator_model` の更新

正本: `/Users/uminomae/dev/creation-space/docs/evidence-metadata-creation.md` §2 / §2.5（progress_level タクソノミー、`generator_model` 書式）
ワークフロー: `skills/creation-publish/SKILL.md` §11 (F9)（`read_text_file` で読むこと）

## 含まれるもの

| パス | 役割 |
|---|---|
| `index.json` | ドメイン進捗・公開メタ情報の索引 |
| `issue62-domain-*-academic-ja.md` | issue62 ドメイン別の公開用 Markdown |
| `issue62-domain-template-academic-ja.md` | ⚠️ NL-010 以前のテンプレート。新規生成では使用禁止 |
