# 出力ディレクトリ設計案 v1.0

**対象**: pjdhiro リポジトリ（公開）の assets/publications/
**日付**: 2026-03-05
**ステータス**: 吟味中

---

## 設計原則

1. **2層分離**: API層（.md, .yaml, .json）と配信層（.pdf）を物理的に分離する
2. **言語はファイル名で区別**: ディレクトリではなくサフィックス `-ja` / `-en`
3. **トピック→種別→形式の順**: `publications/{topic}/{kind}/{format}/`
4. **削除対象**: kesson-* は全て削除（別リポジトリに移行済み）
5. **重複禁止**: 1ファイル = 1箇所。コピーを置かない

---

## ディレクトリ構造

```
assets/publications/
├── creation/
│   ├── guides/
│   │   ├── md/
│   │   │   ├── creation-general-ja.md
│   │   │   ├── creation-general-en.md
│   │   │   ├── creation-academic-ja.md
│   │   │   ├── creation-academic-en.md
│   │   │   ├── creation-designer-ja.md
│   │   │   ├── creation-designer-en.md
│   │   │   ├── creation-pjdhiro-ja.md
│   │   │   └── creation-pjdhiro-en.md
│   │   └── pdf/
│   │       ├── creation-general-ja.pdf
│   │       ├── creation-general-en.pdf
│   │       ├── creation-academic-ja.pdf
│   │       ├── creation-academic-en.pdf
│   │       ├── creation-designer-ja.pdf
│   │       ├── creation-designer-en.pdf
│   │       ├── creation-pjdhiro-ja.pdf
│   │       └── creation-pjdhiro-en.pdf
│   ├── issue62/
│   │   ├── md/
│   │   │   ├── issue62-status-ja.md
│   │   │   ├── issue62-domain-index-ja.md
│   │   │   └── domains/
│   │   │       └── domain-{id}-{name}-{audience}-{lang}.md
│   │   └── pdf/
│   │       ├── issue62-status-ja.pdf
│   │       ├── issue62-domain-index-ja.pdf
│   │       └── domains/
│   │           └── domain-{id}-{name}-{audience}-{lang}.pdf
│   └── manifests/
│       ├── guides.json
│       ├── issue62.json
│       └── issue62-domains.json
```

---

## 命名規則

```
{topic}-{subtopic}-{lang}.{ext}
```

| 要素 | 値 | 例 |
|------|----|----|
| topic | `creation`, `issue62` | |
| subtopic | `general`, `academic`, `designer`, `pjdhiro`, `status`, `domain-index`, `domain-{id}-{name}-{audience}` | |
| lang | `ja`, `en` | |
| ext | `.md`, `.pdf`, `.json` | |

### 例

| ファイル名 | 説明 |
|-----------|------|
| `creation-general-ja.md` | 一般向け creation 説明文（日本語・API層） |
| `creation-general-en.pdf` | 一般向け creation 説明文（英語・配信層） |
| `domain-D22-business-management-academic-ja.md` | D22経営学ドメイン報告（学術・日本語・API層） |

---

## 削除対象

以下は全て削除する:

### assets/creation/model-guides/ （全体）
- kesson-academic-draft.md
- kesson-academic.pdf
- kesson-designer-draft.md
- kesson-designer.pdf
- kesson-general-draft.md
- kesson-general.pdf

### assets/pdf/ 内の kesson-*
- kesson-academic-draft.md
- kesson-academic-en-draft.md
- kesson-academic-en.pdf
- kesson-academic.pdf
- kesson-designer-draft.md
- kesson-designer-en-draft.md
- kesson-designer-en.pdf
- kesson-designer.pdf
- kesson-general-draft.md
- kesson-general-en-draft.md
- kesson-general-en.pdf
- kesson-general.pdf
- 0206/ （ディレクトリ全体: kesson-* のスナップショット）

### assets/pdf/ 内の creation-*（新構造に移動）
- creation-academic.pdf
- creation-designer.pdf
- creation-designer-en.pdf
- creation-general.pdf
- creation-general-en.pdf
- creation-pjdhiro.pdf
- creation-pjdhiro-en.pdf

### assets/publications/kesson/ （全体）
- manifests/guides.json
- md/guides/kesson-*-draft.md （6ファイル）
- pdf/guides/kesson-*.pdf （6ファイル）

---

## 移行マッピング

### 残す（新パスへ移動）

| 旧パス | 新パス |
|--------|--------|
| `assets/creation/creation-general-draft.md` | `assets/publications/creation/guides/md/creation-general-ja.md` |
| `assets/creation/creation-academic-draft.md` | `assets/publications/creation/guides/md/creation-academic-ja.md` |
| `assets/creation/creation-designer-draft.md` | `assets/publications/creation/guides/md/creation-designer-ja.md` |
| `assets/creation/creation-general.pdf` | `assets/publications/creation/guides/pdf/creation-general-ja.pdf` |
| `assets/creation/creation-academic.pdf` | `assets/publications/creation/guides/pdf/creation-academic-ja.pdf` |
| `assets/creation/creation-designer.pdf` | `assets/publications/creation/guides/pdf/creation-designer-ja.pdf` |
| `assets/pdf/creation-general-en.pdf` | `assets/publications/creation/guides/pdf/creation-general-en.pdf` |
| `assets/pdf/creation-designer-en.pdf` | `assets/publications/creation/guides/pdf/creation-designer-en.pdf` |
| `assets/pdf/creation-academic.pdf` | （重複。creation/ 側を使う） |
| `assets/pdf/creation-pjdhiro.pdf` | `assets/publications/creation/guides/pdf/creation-pjdhiro-ja.pdf` |
| `assets/pdf/creation-pjdhiro-en.pdf` | `assets/publications/creation/guides/pdf/creation-pjdhiro-en.pdf` |
| `assets/creation/issue62/*` | `assets/publications/creation/issue62/` 以下（構造維持） |
| `assets/publications/creation/manifests/*` | そのまま維持 |
| `assets/publications/creation/md/guides/*` | `assets/publications/creation/guides/md/` に移動 |
| `assets/publications/creation/pdf/guides/*` | `assets/publications/creation/guides/pdf/` に移動 |
| `assets/publications/creation/md/issue62/*` | `assets/publications/creation/issue62/md/` に移動 |
| `assets/publications/creation/pdf/issue62/*` | `assets/publications/creation/issue62/pdf/` に移動 |

### 削除後に空になるディレクトリ

- `assets/creation/model-guides/` → 削除
- `assets/creation/` → issue62 移動後に削除（publications/ に統合）
- `assets/pdf/0206/` → 削除
- `assets/pdf/PD/` → 要確認（kesson以外のコンテンツがある）
- `assets/publications/kesson/` → 削除

---

## 未決事項

1. **assets/pdf/PD/thinking-kesson/**: kesson関連だが `Kesson_Driven_Thinking_Architecture.pdf` は歴史的資料として残すか？
2. **assets/prism/**: LaTeX原稿。publications/ に入れるか、別管理か？
3. **assets/creation/ のトップレベル**: publications/ に全統合した後、このディレクトリ自体を削除するか？
4. **英語版 md**: 現在存在しない。生成するか？

---

## 判断根拠

| 判断 | pjdhiro発言 |
|------|------------|
| 2層分離 | 「.md,.yaml,.jsonはAPIのように機能する」 |
| kesson削除 | 「kesson関連は別な場所にあるので削除して良い」 |
| ゼロベース | 「現状は酷いのでゼロベースで見直したい。吟味したい」 |
