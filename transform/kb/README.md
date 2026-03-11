# transform/kb/ — 公開用整形 workflow placeholder

## 5W1H

- **What**: リポジトリ直下の `kb/` に出力するための整形ルール置き場です。
- **Why**: 公開用の読みやすい層を raw evidence と分離して育てるためです。
- **Who**: kb 生成ルールを追加する CLI が使います。
- **When**: Phase C 以降で domains の再生成結果を公開用に整形するときです。
- **Where**: ルールはこのディレクトリ、正本の受け皿は [../../kb/README.md](/Users/uminomae/dev/creation-space/kb/README.md) です。
- **How**: domains / survey / guides の生成物を受けて、公開向けの構造に整形します。

## 現在の状態

- `creation-space/kb/` が当面の正本です。
- 将来は `pjdhiro/assets/creation/` へ移行する想定ですが、`#218` の低優先タスクとして後段で扱います。
