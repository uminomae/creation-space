# 変換ルール: creation survey版 v1.0

**対象コンテンツ**: 30領域横断構造類似調査の概要と索引
**対象読者**: creation-space REPORTS セクションの訪問者（「調査内容」ボタンから到達する人）
**目的**: 何を調べ、何が見え、個別レポートにどうたどり着くかを示す
**性格**: 読者向けの調査概要と索引。内部管理文書ではない
**継承元**: `transform/domains/reader-rules/reader-rules-creation.md`（共通基盤 v1.4）を継承し、以下を上書きする

---

## §0 ソース原則

共通基盤 §1 を継承し、survey 固有のソース指定を追加する。

### 参照すべきソース

| ソース | 何のために |
|--------|----------|
| `/Users/uminomae/dev/creation-space/evidence/review/p1-cross-domain-insights.md` | 横断的知見の素材 |
| `/Users/uminomae/dev/creation-space/evidence/review/plan-step7-fieldwork.md` | 30領域の一覧と調査設計 |
| `/Users/uminomae/dev/creation-space/evidence/PROJECT.md` | サブプロジェクト全体像 |
| `/Users/uminomae/dev/creation-space/evidence/evidence-D*.md` | 各領域の調査結果（概要把握用） |
| `/Users/uminomae/dev/kesson-driven-thinking/base/text/m2-creation-process/creation-source.md`（未移植） | 5段階の定義 |

### 参照してはならないもの

| 除外 | 理由 |
|------|------|
| Issue番号（#62 等） | 内部管理情報 |
| Phase番号、DR、triage | 内部ワークフロー用語 |
| 内部進捗ログ、state.md | AI作業環境（NL-002） |
| 202602-deep-research-30domains-gpt/README.md | 内部管理表 |

---

## §1 読者定義

| 項目 | 内容 |
|------|------|
| 想定読者 | creation-space を訪れ、「調査内容」を押した人。30領域の調査が何であるかをまだ知らない |
| 前提知識 | 5段階モデルの名前を見たことがある程度（guides で知った、またはこれから知る） |
| 関心 | 「30領域で何を調べたのか。結果はどうだったのか。詳しく見たい領域がある」 |

---

## §2 対象ファイルと性格

### survey-status.md

**性格**: 30領域を横断して何を調べ、何が見えたかの読者向け報告。

**構成**:

1. 調査の目的（1-2段落。何のために30領域を調べたか）
2. 調査の方法（§6.5 方法論的開示義務を含む。AI代行の解釈であることの開示）
3. 5段階モデルの概要（読者がこの先を読むための最小限の前提）
4. 横断的知見（複数領域にまたがって見えた構造。特に「縁」の対応。代表的な例を1〜5つ、一言解説で）
5. 領域ごとの調査深度の概要（全領域を同一深度で検証していないことの開示）
6. 個別調査レポートへの案内（domains/ への導線。survey-domain-index.md への参照）
7. まとめ（温度開示で閉じる）

**一言解説の粒度**（§4 横断的知見内）:

1理論あたり2-3文。以下が基準:

> 孵化は場〜波に、照明は縁〜渦に、検証は束にそれぞれ対応する。意識的な作業と非意識的な処理の交代という基本構造が共通する。5段階モデルには「縁」という明示的な段階がある。Wallasの記述では、孵化と照明の間の移行——矛盾が最大化し、どちらにも収束しない状態——が構造的に記述されていない。

対応表や網羅的分析は含めない。読者が「こういう見方をするのか」を掴み、詳細は domains に進む動機を持つためのもの。

### survey-domain-index.md

**性格**: 30領域の索引。各ドメインレポートへの導線。

**構成**:

1. 使い方（この索引の読み方。1-2文）
2. 30領域一覧（各領域について: 領域名、1-2行の概要、主要な知見の要約、ドメインレポートへの参照リンク）
3. 凡例（調査深度の説明。ただし内部用語は使わない）

**各領域の記述量**: 2-3行。詳細は domains/ に委ねる。

---

## §3 声の設計

### 基本の声

**調査を依頼されたコンサルタントが、依頼主に報告する声。** 読者は依頼主であり、調査結果を受け取る立場。コンサルタントは知見を明快に整理して届け、次のアクション（個別レポートを読む）を促す。

| 特徴 | 内容 |
|------|------|
| **報告** | 何を調べ、何が見え、何が未解決かを構造的に伝える |
| **正直** | 調査深度のばらつき、方法論の限界を隠さない。不都合も報告する |
| **提案** | 関心を持った読者に次のステップ（個別レポート）を具体的に示す |

### 禁止する声

| 禁止パターン | 理由 |
|-------------|------|
| 内部管理口調（「Phase 2 完了」「DR揃い」） | 読者に無意味（NL-002） |
| 進捗報告口調（「30/30達成」「残タスク」） | 内部管理情報 |
| 「ピンとこなければ〜」「合わなければ〜」 | 責任逃れ（NL-001） |

---

## §4 用語方針

共通基盤 §5 の温度表現を継承。

survey 固有:
- 「構造類似」「構造対応」は使用可（初出で簡潔な説明を添える）
- 「evidence」「Phase」「triage」「DR」は使用禁止
- 5段階の名称は survey-status.md §3 で導入後に使用

---

## §5 domains への参照方法

### survey-status.md 内

横断的知見で特定領域に言及するとき:

> 詳しくは「D08 神経科学」のドメインレポートを参照。

または文末にまとめて:

> 各領域の詳細な調査結果は、ドメインレポートとして公開しています。索引は survey-domain-index を参照してください。

### survey-domain-index.md 内

各領域エントリに参照リンクを含める。リンク先は出力時点の公開状態に応じて:
- 公開済み: 具体的なパス（`domains/{lang}/md/domain-D{NN}-{name}.md`）
- 未公開: 「準備中」と記す

---

## §6 除外ルール

共通基盤 §3 を継承。survey 固有の調整:

| カテゴリ | 扱い |
|---------|------|
| 先行研究の詳細 | domains に委ねる。survey では名前と一言のみ |
| 数理表現 | 除外 |
| F-O軸 | 除外 |
| スピノル | 除外 |
| 調査方法の詳細 | §6.5 開示義務の範囲に留める |

---

## §7 品質ゲート

### A. 共通基盤チェック（§8 A〜E）

共通基盤 §8 のチェックリスト全項目を通過すること。

### B. survey 固有チェック

- [ ] 内部管理情報が完全に排除されているか（Issue番号、Phase、DR、進捗ログ）
- [ ] 30領域のドメインレポートへの参照が含まれているか（NL-017）
- [ ] 横断的知見の例示が1〜5例の一言解説に収まっているか（対応表禁止）
- [ ] 調査深度のばらつきが正直に開示されているか
- [ ] §6.5 方法論的開示義務が含まれているか
- [ ] survey-status から survey-domain-index への導線があるか
- [ ] survey-domain-index の全30領域にエントリがあるか

---

## §8 front matter

### survey-status.md

---
id: survey-status
title: "全分野構造類似探索: 調査概要"
lang: {ja|en}
audience: survey
version: 1.0
date: {YYYY-MM-DD}
source: /Users/uminomae/dev/creation-space/evidence/review/p1-cross-domain-insights.md, /Users/uminomae/dev/creation-space/evidence/PROJECT.md
rules: reader-rules-creation-survey.md v1.0, transform/domains/reader-rules/reader-rules-creation.md v1.4
generator_model: {model_name}
---

### survey-domain-index.md

---
id: survey-domain-index
title: "全分野構造類似探索: 領域索引"
lang: {ja|en}
audience: survey
version: 1.0
date: {YYYY-MM-DD}
source: /Users/uminomae/dev/creation-space/evidence/review/plan-step7-fieldwork.md
rules: reader-rules-creation-survey.md v1.0, transform/domains/reader-rules/reader-rules-creation.md v1.4
generator_model: {model_name}
---

---

## §9 他版との関係

| 次元 | survey | report (domains) | guides |
|------|--------|-------------------|--------|
| 読者 | REPORTS訪問者（初見） | 特定領域に関心あり | モデル全体に関心あり |
| 性格 | 調査の入口・俯瞰 | 個別領域の詳細報告 | モデルの解説 |
| 粒度 | 1領域2-3行 | 1領域で1文書 | 全体で1文書 |
| domains参照 | 全30領域へのリンク | 自身が個別レポート | 横断的に言及 |

---

## ナレッジログ

| ID | 内容 | 根拠 |
|----|------|------|
| NL-001 | 内部管理情報の排除 | 既存 survey-status.md が Issue #62 の作業報告であり読者向けでなかった |
| NL-002 | domains への参照義務 | pjdhiro: 「本来は一体のもので紐づけるべき」（共通基盤 NL-017） |
| NL-003 | 一言解説の粒度 | pjdhiro: Wallas の例文（2-3文）を基準として提示 |
| NL-004 | トーンはコンサルタント | pjdhiro: 「トーンはコンサルタントです」 |

---

## 更新履歴

| 日付 | バージョン | 内容 |
|------|-----------|------|
| 2026-03-05 | 1.0 | 初版。#96 |
