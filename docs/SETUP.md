# docs/SETUP.md — 開発セットアップ

**用途**: `creation-space` をローカルで読める状態にし、初回セッションの確認まで通すための再現手順。

---

## 1. 先に知っておくこと

- 通常のローカル閲覧では `npm install` は不要
- フロントエンドの実行時依存は `index.html` から CDN 読み込みしている
  - Bootstrap 5
  - Three.js
  - marked
  - DOMPurify
- `pjdhiro` リポジトリは**トップページのローカル表示だけなら必須ではない**
- ただし REPORTS の manifest 検証や `scripts/smoke-test.js` の既定動作では `../pjdhiro` がある前提

## 2. 必須環境

- `git`
- `python3`
- `node`

`node` はブラウザ表示そのものには不要だが、`scripts/smoke-test.js` の実行に使う。

## 3. リポジトリを clone する

推奨配置:

```bash
mkdir -p ~/dev
cd ~/dev
git clone https://github.com/uminomae/creation-space.git
cd creation-space
git switch develop
```

## 4. 依存関係の取得方針

### 4.1 npm / node_modules

現時点の `creation-space` にはルートの `package.json` がない。
そのため、通常セットアップとしての `npm install` は存在しない。

- `node_modules` を前提にしない
- bundler も前提にしない
- 静的ファイルを `python3` で配信して確認する

### 4.2 CDN 依存

`index.html` では以下を CDN から取得する:

- Bootstrap CSS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/...`
- Three.js: `https://cdn.jsdelivr.net/npm/three@0.160.0/...`
- marked: `https://cdn.jsdelivr.net/npm/marked@15.0.7/...`
- DOMPurify: `https://cdn.jsdelivr.net/npm/dompurify@3.2.4/...`

オフライン完全再現は未整備なので、通常のブラウザ確認ではネットワーク接続を前提にする。

## 5. `pjdhiro` リポジトリとの連携

### 5.1 何に使うか

REPORTS UI は、`pjdhiro` 側で公開している manifest / Markdown / PDF を読む。
既定のデータ元は `src/reports/data.js` で定義されている。

主な URL:

- manifest: `https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/creation/manifests/domains.json`
- 公開アセット基底 URL: `https://uminomae.github.io/pjdhiro/assets/creation/`
- Markdown 基底 URL: `https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/creation/`

### 5.2 clone が必要なケース

以下を行うなら `pjdhiro` をローカル clone しておく:

- `scripts/smoke-test.js` を既定パスのまま実行する
- manifest 整合チェックを行う
- `transform/` / `scripts/` の一部で `../pjdhiro` 前提の処理を動かす

推奨配置:

```bash
cd ~/dev
git clone https://github.com/uminomae/pjdhiro.git
```

期待される並び:

```text
~/dev/
  creation-space/
  pjdhiro/
```

トップページをブラウザで開いて雰囲気を見るだけなら、`pjdhiro` の clone は後回しでもよい。

## 6. `.cache/` を初期化する

通常は clone 時点で最低限の構造が入っている。
不足している場合だけ以下を作る:

```bash
mkdir -p .cache/active .cache/inbox .cache/outbox .cache/session
touch .cache/active/.gitkeep
```

役割の目安:

- `.cache/active/`: 実行中タスク
- `.cache/inbox/`: 指示書・レビュー依頼
- `.cache/outbox/`: DONE / REVIEW 出力
- `.cache/session/`: セッションログ・handoff

## 7. hooks 設定を確認する

このリポジトリには `.claude/hooks.json` と各種 hook script が含まれる。
最低限、設定ファイルと参照先が存在することを確認する:

```bash
test -f .claude/hooks.json
test -f .claude/hooks/progress-level-guard.sh
test -f .claude/hooks/domains-json-sync-guard.sh
test -f .claude/hooks/quality-level-guard.sh
```

追加で中身を見る場合:

```bash
sed -n '1,200p' .claude/hooks.json
```

注記:

- ここで確認しているのは「設定ファイルとスクリプトが repo 内にそろっているか」
- 実際に hooks をどう読み込むかは使用するエージェント環境に依存する

## 8. 開発サーバーを起動する

既定ポート:

```bash
bash server.sh
```

明示ポート指定:

```bash
bash server.sh 3002
```

- 既定ポートは `3001`
- `server.sh` は内部で `python3 serve.py "${1:-3001}"` を呼ぶ

起動後はブラウザで以下を開く:

- `http://localhost:3001/`
- または指定したポート

## 9. 初回セッションテスト

### 9.1 最小確認

1. サーバーを起動する
2. `http://localhost:3001/` を開く
3. トップページが表示されることを確認する
4. `?lang=en` を付けて英語表示に切り替わることを確認する
5. REPORTS セクションが表示されることを確認する

### 9.2 `pjdhiro` を clone 済みなら追加確認

```bash
node scripts/smoke-test.js
```

このスクリプトは既定で `../pjdhiro/assets/creation/manifests/domains.json` を読む。
hooks ファイルの存在確認も合わせて行う。

## 10. よくある詰まりどころ

### `npm install` が見つからない

正常。通常セットアップでは不要。

### REPORTS のデータ検証が通らない

`pjdhiro` が `../pjdhiro` に clone されているか確認する。

### ブラウザで表示されるが一部アセットが取れない

CDN 依存または `pjdhiro` 側の公開アセットに依存している可能性がある。
まずネットワーク接続と manifest URL を確認する。

## 11. 最短手順だけ知りたい場合

```bash
cd ~/dev
git clone https://github.com/uminomae/creation-space.git
git clone https://github.com/uminomae/pjdhiro.git
cd creation-space
git switch develop
bash server.sh 3001
node scripts/smoke-test.js
```

ブラウザで `http://localhost:3001/` を開けば初回確認まで進められる。
