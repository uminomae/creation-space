# transform/domains/publish/domains/ — ドメイン公開素材

**目的**: creation ドメイン別の公開用 Markdown と進捗インデックスを置く。

---

## 命名規則

**正式命名**: `domain-{id}-{name}-{audience}.md`

旧命名 `issue62-*` は廃止。正本は `reader-rules-creation.md` §9。言語はディレクトリで分離するため、ファイル名には含めない。

> **注意**: 既存の `issue62-*` ファイルは順次リネーム予定（別タスク）。新規生成では必ず `domain-*` 命名を使うこと。

---

## 3層の関係

| 層 | 場所 | 性格 |
|---|---|---|
| **staging** | 本ディレクトリ（`transform/domains/publish/domains/`） | 生成・品質テスト・レビューの作業場 |
| **API層** | `pjdhiro/assets/creation/domains/{lang}/md/` | 他システムからデータを取得するエンドポイント |
| **配信層** | `pjdhiro/assets/creation/domains/{lang}/pdf/` | 読者への最終出力 |

staging で品質テストを通過した md が API層に配置され、そこから PDF（配信層）が生成される。

---

## ワークフロー: ここに md を配置するまでの流れ

```
evidence-D{NN}-*.md（creation-space）
  ↓  reader-rules-creation-report.md v2.0 適用
domain-{id}-{name}-{audience}.md（本ディレクトリに配置）
  ↓  品質テスト → pjdhiro しっくり感チェック
build-pdf-creation.sh → PDF
  ↓
pjdhiro repo assets/creation/domains/ja/{md,pdf}/ に最終配置
```

**詳細は `read_text_file` で `transform/domains/README.md` のワークフローセクションを読むこと。**

### 現在の進行状況（2026-03-15）

| ファイル | ドメイン | 状態 | 備考 |
|---|---|---|---|
| `issue62-domain-d02-physics-academic-ja.md` | D02 物理学 | 生成済み | NL-010 以前。リネーム・再生成が必要 |
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
| 4 | `/Users/uminomae/dev/creation-space/docs/evidence-metadata-creation.md` | front matter・`generator_model`・進捗ラベルの定義 |

### ⛔ 注意事項

- **テンプレート（`issue62-domain-template-academic-ja.md`）は NL-010 以前の設計で使用禁止。** D1-D4 接続、Accept/Reject、E-1〜E-8 等の禁止語を含む。構成は reader-rules v2.0 §4 に従うこと。
- **pjdhiro/assets/ 配下に配置する md に front matter を含めないこと（NL-012）。** Jekyll がページとして処理しビルドエラーになる。
- **命名規則**: `domain-{id}-{name}-{audience}.md`（旧 `issue62-domain-*` は廃止）

## ルール

- ここに置くのは publish 用の成果物と `index.json` だけ
- evidence 本体の更新は `/Users/uminomae/dev/creation-space/evidence/` 側で先に行う
- front matter や進捗ラベルは `read_text_file` で `/Users/uminomae/dev/creation-space/docs/evidence-metadata-creation.md` を読み、その定義に従う
- metadata フィールドの正本は `docs/evidence-metadata-creation.md`。`generator_model` の書式は同 §2.5 を参照
- 配置・命名を変える前に `read_text_file` で `transform/domains/README.md` を確認する

### ドメイン公開後の分類更新

ドメインの md + PDF を pjdhiro repo に配置した後、以下の JSON を更新する:

1. **`index.json`**（本ディレクトリ）: `status` → `"published"`, `progress_level` の更新, `generator_model` の更新, `md`/`pdf` パスの追加
2. **`pjdhiro/assets/creation/manifests/domains.json`**: `progress_level`, `label_description_ja/en`, `generator_model` の更新

正本: `/Users/uminomae/dev/creation-space/docs/evidence-metadata-creation.md` §2 / §2.5（progress_level タクソノミー、`generator_model` 書式）
ワークフロー: `skills/creation-publish/SKILL.md` §11 (F9)（`read_text_file` で読むこと）

## 含まれるもの

| パス | 役割 |
|---|---|
| `index.json` | ドメイン進捗・公開メタ情報の索引。`generator_model` フィールドを使用（§2.5 準拠） |
| `domain-{id}-{name}-{audience}.md` | ドメイン別の公開用 Markdown（正式命名） |
| `issue62-domain-*-academic-ja.md` | 旧命名のドメイン別 Markdown（リネーム予定） |
| `issue62-domain-template-academic-ja.md` | ⚠️ NL-010 以前のテンプレート。新規生成では使用禁止 |
