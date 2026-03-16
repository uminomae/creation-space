---
id: survey-research-bridge-ja-v1
title: "構造類似調査 研究結果→上位プロジェクト接続メタ文書"
subtitle: "transform層の成果を base / schema / publish に接続する運用台帳"
lang: ja
version: 1.0
date: 2026-03-04
generator_model: GPT-5 Codex (OpenAI)
generated_at: 2026-03-04
---

# 構造類似調査 研究結果→上位プロジェクト接続メタ文書

> この文書は、領域別リサーチで得た知見を上位プロジェクトへ反映するための「接続台帳」です。  
> 目的は、分冊PDFを作って終わる運用を避け、knowledge/schema/ と reader-rules/publish更新までを追跡することです。

## 0. この文書で担保すること

- 担保1: 研究結果がどの上位概念（D1-D4, M1/M2, ISS）に効くかを明示する
- 担保2: どのファイルを更新すべきかを明示する
- 担保3: 反映済み/未反映を可視化する
- 担保4: 反証候補と保留論点を残す

---

## 1. 接続先マップ（固定）

| 接続先カテゴリ | 主な対象 | 代表ファイル |
|---|---|---|
| コア定義 | D1/D2/D3/D4 の定義・成立条件・循環 | `/Users/uminomae/dev/kesson-driven-thinking/base/schema/core-definitions.md` |
| モデル構造 | 4層（M1）/5段階（M2）の関係 | `/Users/uminomae/dev/kesson-driven-thinking/base/schema/four-layers.md`, `knowledge/schema/five-stages.md` |
| 論拠DB | 領域別の証拠・比較・判定 | `/Users/uminomae/dev/creation-space/evidence/evidence-DXX-*.md` |
| 変換規則 | 読者別の変換方針 | `transform/domains/reader-rules/*.md`, `transform/guides/reader-rules/*.md`, `transform/survey/reader-rules/*.md` |
| 公開ソース | モーダル/PDFに出る本文 | `transform/domains/publish/*.md` |
| 公開資産 | creation-space 側の表示資産 | `assets/reports/issue62/...`（同期先） |

---

## 2. 研究結果トレーサビリティ表（更新用）

| ドメイン | 主要知見 | 上位概念への影響 | 更新対象ファイル | 反映ステータス | 備考 |
|---|---|---|---|---|---|
| D22 経営学 | Storming/弱信号保持の重要性、縁の記述強度差、制度化Withhold | D1, D3, M2(縁), ISS(適用境界) | `/Users/uminomae/dev/creation-space/evidence/evidence-D22-business-management.md`, `transform/domains/publish/domains/domain-D22-business-management-academic-ja.md` | 反映済（publish）/ 一部保留（base反映） | 反証候補は継続管理 |
| D02 物理学 | 縁の物理的具体化（相互作用/界面/競合/RG流）、marginal=保持、渦なし経路の保留論点 | D1, D3, M2(縁), ISS(5段階必須性) | `/Users/uminomae/dev/creation-space/evidence/evidence-D02-physics.md`, `transform/domains/publish/domains/domain-D02-physics-academic-ja.md` | 反映済（publish）/ 一部保留（schema反映） | D02をルール移行テストとして実施 |
| D13 哲学 | <次回記入> | <次回記入> | <次回記入> | 未着手 | D02との比較でテンプレ改訂点を抽出予定 |

> 運用ルール: 「publishだけ更新してbase未更新」の状態を3営業日以上放置しない。

---

## 3. 反映判断の基準

### 3.1 反映してよい知見

- [P] の裏づけがあり、既存定義と矛盾しない
- [M] でも、E-1/E-3/E-7 と CHK-A〜D を通過し、反証条件が書ける

### 3.2 まだ反映しない知見

- 温度が [S] で、反証条件が定義できない
- スケール混同（個人/組織/産業）で説明が崩れる
- 既存ファイルに入れると定義衝突を起こす

---

## 4. 1領域あたりの運用フロー（実務）

1. `/Users/uminomae/dev/creation-space/evidence/evidence-DXX-*.md` の更新  
2. `transform/domains/publish/domains/domain-DXX-*.md` を作成  
3. 本文の `6.5 研究結果→上位接続` を記入  
4. 本メタ文書（本ファイル）に1行追加  
5. 必要に応じて `knowledge/schema/*` / `reader-rules/*` を更新  
6. `survey-status-ja.md` の進捗と接続状況を更新  

---

## 5. 構造類似調査 横断報告との関係

- `survey-status-ja.md` は「現在地の共有」を担うハブ
- 本ファイルは「接続状況の追跡」を担うメタ台帳
- 領域別分冊は「理論比較の実体」を担う

3文書を分離する理由:
- statusだけだと深掘り理由が消える
- 分冊だけだと上位反映が追えない
- 本メタ文書で両者を接続する

---

## 6. 次回更新時のチェック

- [ ] 追加した知見が D1-D4/M1-M2 のどこに効くか明示した
- [ ] 接続先ファイルを具体パスで書いた
- [ ] 反映ステータスを更新した
- [ ] 保留理由（なぜ未反映か）を書いた
- [ ] status文書の更新日と整合した

---

## 7. 補足

- 本調査の主目的は「分冊の量産」ではなく「上位プロジェクトの精度向上」である。
- したがって、分冊の完成数と同じ重みで「反映率（接続率）」を追う。
