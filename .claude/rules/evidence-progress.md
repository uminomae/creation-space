# evidence 進捗管理ルール

## 鉄則

**`index.json` の `progress_level` / `progress_note` は pjdhiro 承認なしに変更禁止。**

これは最優先ルール。他のタスク（レポート生成、テンプレート適用、スキーマ更新等）の過程で `index.json` を編集する場合でも、progress_level / progress_note は元の値をそのまま保持すること。

## 情報フローと source of truth

```
docs/evidence-metadata-creation.md（タクソノミー定義）
    ↓
transform/domains/publish/domains/index.json（各ドメインの進捗値 — SoT）
    ↓ scripts/generate-domains-json.mjs
pjdhiro/assets/creation/manifests/domains.json（配信データ）
    ↓ fetch
src/reports/data.js → render.js（UI表示）
```

| 情報 | source of truth |
|---|---|
| タクソノミー定義 | `docs/evidence-metadata-creation.md` |
| 各ドメインの progress_level | `transform/domains/publish/domains/index.json` |
| 配信 manifest | `pjdhiro/assets/creation/manifests/domains.json` |

## deepdive 後の更新フロー

```
output.md 確認（pjdhiro）
    ↓
evidence/{D番号}-*.md 更新
    ↓
index.json の progress_level 更新 ← pjdhiro 承認必須
    ↓
generate-domains-json.mjs 実行
    ↓
pjdhiro 側にコミット・push
```

## 領域間配置ルール

evidence 関連作業で複数領域にまたがる知見の配置に迷った場合は `transform/domains/cross-domain-reference.md` を参照すること。
## index.json 編集時の必須手順

1. 編集前: `progress_level` と `progress_note` の現在値をメモする
2. 編集後: メモと突き合わせ、意図しない変更がないことを確認する
3. progress_level を変更する場合: Issue コメントで pjdhiro に確認を取る

## progress_level 更新トリガー (cs#109)

| トリガーイベント | 更新先 | 誰が |
|---|---|---|
| DR ファイル新規作成（GPTレビュー完了） | `claude_gpt_reviewed` に昇格 | CLI（pjdhiro承認 or Issue を根拠） |
| deepdive 完了（Claude Agent） | `api_deepdive` | CLI（pjdhiro承認） |
| deepdive 完了（Codex 並列） | `codex_parallel_deepdive` | CLI（pjdhiro承認） |
| pjdhiro しっくり感チェック完了 | `human_reviewed` | pjdhiro 直接 |
| レポート公開（MD+PDF が pjdhiro に配置） | `status` → `published`（自動判定） | generate-domains-json.mjs |

## 保護ルール

- **逆行禁止**: progress_level を下げる変更は原則 BLOCK
- **human_reviewed への昇格は pjdhiro 専権**
- **変更時は Issue 番号を根拠として記録**: コミットメッセージに `cs#NNN` を含める

## status フィールドについて

index.json の `status` フィールドは手動管理しない。
`generate-domains-json.mjs` が pjdhiro 側の物理ファイル存在を確認して自動判定する。
