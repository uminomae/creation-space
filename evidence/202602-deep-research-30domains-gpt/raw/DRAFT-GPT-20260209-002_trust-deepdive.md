---
id: DRAFT-GPT-20260209-002
type: deepdive
target: CN-005 / CN-TRUST
status: draft
created: 2026-02-09
author: ChatGPT
confidence: medium
workflow_note: DRAFT-GPT only / Claude review required before adoption
claude_review: pending（TASK #23で統合議論）
---

# Trust Deep Dive（DRAFT-GPT）

本ドキュメントは **展開・比較・叩き台生成**を目的とする。
正本化・統合判断は **Claudeレビュー工程**に委ねる。

---

## Part A. Evidence Card（3枚）

---

### EV-GPT-Bion-001

```yaml
---
id: EV-GPT-Bion-001
type: evidence-card
status: draft
source: Wilfred Bion
related_hypotheses: [H01,H02,H03,H10]
confidence: medium
---
```

**対象概念**

* Container / Contained
* 未処理情動の保持

**対応づけ**

* H01（Container内在化）
* H10（問いとして保持する空間）

**要点（主張ではなく対応）**

* BionのContainerは「不安を消す装置」ではなく
  **未消化のまま保持し、変形を遅延させる機能**。
* これは D3（抱持）と**機能的に同型**。

**注意**

* Bionは「信頼」を直接定義しない
* あくまで **H01/H10の現象記述側の根拠**

---

### EV-GPT-Bowlby-001

```yaml
---
id: EV-GPT-Bowlby-001
type: evidence-card
status: draft
source: John Bowlby / Mary Ainsworth
related_hypotheses: [H02,H03,H04,H13]
confidence: high
---
```

**対象概念**

* Secure Base
* Attachment
* Repair expectation

**対応づけ**

* H02（安全基地）
* H04（対象恒常性）
* H13（修復可能性の予期）

**要点**

* Secure baseは「常時安全」ではなく
  **探索と分離を許容する前提条件**。
* 修復可能性の期待があると、誤差は破綻にならない。

**注意**

* これは **結果記述層**
* ルーティング（H08）の原因説明には使えない

---

### EV-GPT-Friston-001

```yaml
---
id: EV-GPT-Friston-001
type: evidence-card
status: draft
source: Karl Friston
related_hypotheses: [H05,H06,H07,H08,D4]
confidence: medium
---
```

**対象概念**

* Predictive Processing
* Precision weighting
* Active inference

**対応づけ**

* H05（信頼軸評価の可能性）
* H08（ルーティング変数）
* D4（情動構成）

**要点**

* 情動は「誤差そのもの」ではなく
  **誤差の評価（precision ×価値）**。
* F/O の分岐は、評価関数として記述可能。

**注意**

* Fristonは「関係」「信頼」を直接扱わない
* **形式的裏付け**として限定使用
* **D1（誤差を問いとして拾う）との緊張関係**: Fristonの予測誤差最小化は「誤差を消す」方向であり、D1とは逆向きの力

---

## Part B. H01–H04 / H05–H08 層分離設計（3案比較）

| 案           | 構造                         | 利点               | リスク      |
| ----------- | -------------------------- | ---------------- | -------- |
| **案１：完全分離** | H01–H04＝現象層<br>H05–H08＝機能層 | 混線が消える<br>検証しやすい | 二重記述に見える |
| 案２：翻訳対応     | H01–H04をH05–H08の自然言語訳として扱う | 直感的              | 循環定義リスク  |
| 案３：統合単一層    | 全部同一現象の別名                  | シンプル             | 理論崩壊     |

### **ChatGPT推奨案：案１（完全分離）**

* 理由：

  * H08（ルーティング）を**因果仮説**として保護できる
  * Bion/Bowlbyを「結果側」に固定できる
  * 反証設計が可能

### **pjdhiro判断待ち**: もう少し議論が必要

---

## Part C. CN-TRUST v2（採用候補・DRAFT）

```yaml
---
id: CN-TRUST
status: draft
version: v2
basis: CN-005
core_hypothesis: H08
evaluation_axis: E08
related_hypotheses: [H01-H17]
confidence: medium
---
```

### 一文定義（v2）

**信頼とは、予測誤差が生じたとき、それを生存軸の脅威反応ではなく、信頼軸の関係的探索へルーティングしても安全だと評価する内的変数である。**

---

### 構造定義（層）

#### 機能・評価層（因果）

* H05–H08
* 誤差評価／情動構成／ルーティング

#### 現象・臨床層（結果）

* H01–H04
* Container内在化／安全基地／対象恒常性

※ 因果は **上→下** のみ許可

---

### 操作的定義（暫定）

#### T-min（最小成立）

* 誤差後、即時F反応が抑制される
* 誤差が問いとして保持される
* 修復・再交渉が想像可能

#### T-fail（不成立）

* 誤差＝脅威に固定
* 探索停止
* 不可逆感覚の出現

---

## 自己評価（DRAFT-GPT）

* Evidence Card：PASS
* 層分離比較：PASS
* CN-TRUST v2：WARN（H08因果側は未完）

---

## 次に pjdhiro が確認すべき **1点**

> **H08（ルーティング変数）を「学習可能なもの」と見るか、「履歴依存の固定傾向」と見るか。**

ここで理論の将来分岐が決まります。

---

## Claude品質チェック結果（Session 16b）

| # | チェック項目 | 結果 | コメント |
|---|-------------|------|----------|
| 1 | コア定義との整合性 | ✅PASS | D1-D4を参照、D3/D4との接続明確 |
| 2 | 5段階/4層との対応 | ✅PASS | Part Bで4層モデル言及 |
| 3 | レイヤ分離 [P][M][S] | ⚠️WARN | Evidence Cardにconfidenceあるが[P][M][S]未使用 |
| 4 | 群盲象チェック | ✅PASS | 精神分析×愛着×認知神経科学の3領域 |
| 5 | 牽強付会チェック | ✅PASS | **注意**欄でBion/Bowlby/Fristonの限界を明記 |
| 8 | しっくり感チェック | 保留 | TASK #23で統合議論 |

### AI多数派バイアス検出

| 箇所 | 検出結果 |
|------|----------|
| EV-GPT-Bion-001 | ✅問題なし（「信頼を直接定義しない」と明記） |
| EV-GPT-Bowlby-001 | ✅問題なし（「結果記述層」と限定） |
| EV-GPT-Friston-001 | ✅追記済（D1との緊張関係を明記） |
| CN-TRUST v2 | ✅問題なし（H08/H17中心を維持） |
