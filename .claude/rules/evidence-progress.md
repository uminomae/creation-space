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
| Phase 1-2 完了（初期スキャン） | `initial_scan` | CLI（pjdhiro承認） |
| Phase 3-4 完了（独立照合） | `cross_reviewed` | CLI（pjdhiro承認） |
| Phase 5-7 完了（深掘り調査） | `deep_investigated` | CLI（pjdhiro承認） |
| Phase 8 完了（領域横断探索） | `cross_explored` | CLI（pjdhiro承認） |
| pjdhiro しっくり感チェック完了 | `human_reviewed` | pjdhiro 直接 |
| レポート公開（MD+PDF が pjdhiro に配置） | `status` → `published`（自動判定） | generate-domains-json.mjs |

## Phase 遷移チェックリスト (cs#123)

progress_level を変更するとき、以下を**すべて**確認してから commit すること。

1. **対象ドメインの特定**: 全30領域が同一 Phase を完了したなら**全30領域を同時に更新**。一部だけ異なる ID にしない
2. **taxonomy ID の確認**: `index.json` の `progress_taxonomy[]` に、使おうとしている ID が存在するか
3. **4箇所の整合確認**:
   - `docs/evidence-metadata-creation.md §2` — taxonomy 定義
   - `transform/domains/publish/domains/index.json` — progress_taxonomy[] + reports[].progress_level
   - `src/reports/data.js` — DEFAULT_PROGRESS_TAXONOMY
   - `src/reports/data.js` — normalizeProgressLevel() の後方互換マッピング
4. **検証コマンド実行**:
   - `node scripts/generate-domains-json.mjs --check` — Schema validation: OK + No differences
   - `bash scripts/validate-manifest-sync.sh` — Check 1 (domains.json整合) + Check 4 (taxonomy整合) + Check 5 (定義ドリフト) PASS
5. **Issue 番号をコミットメッセージに含める**: `cs#NNN`

> **教訓 (cs#123)**: ツール名ベースの taxonomy ID を使ったことで、同一 Phase でも D22/D23 だけ別ラベルになり、3回修正しても直らなかった。taxonomy ID は「調査状態」を表す名前にすること。

## 保護ルール

- **逆行禁止**: progress_level を下げる変更は原則 BLOCK
- **human_reviewed への昇格は pjdhiro 専権**
- **変更時は Issue 番号を根拠として記録**: コミットメッセージに `cs#NNN` を含める

## status フィールドについて

index.json の `status` フィールドは手動管理しない。
`generate-domains-json.mjs` が pjdhiro 側の物理ファイル存在を確認して自動判定する。
