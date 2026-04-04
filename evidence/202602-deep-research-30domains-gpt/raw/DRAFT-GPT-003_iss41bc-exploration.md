---
id: DRAFT-GPT-003
type: exploration
target: ISS-41-b, ISS-41-c
status: draft
created: 2026-02-11
author: ChatGPT（GPT-5.2）
confidence: medium
workflow_note: DRAFT-GPT only / Claude review required
---

# DRAFT-GPT-003: ISS-41-b/c 探索叩き台（REQ-GPT-003準拠）

**依頼日**: 2026-02-10  
**依頼元**: pjdhiro  
**前提**: CN-005, CN-006, DRAFT-GPT-001/002 を踏まえる  
**本DRAFTの役割**: 文章改善ではなく、概念定義の精度と先行研究への traceability を上げる

---

## 0. コア定義（参照固定）

| ID | 定義 |
|---|---|
| D1 | 欠損駆動思考：棄却される誤差を、問いとして拾う態度 |
| D2 | 欠損（Kesson）：予想と現実の誤差を、意識が「欠け」として捕らえた主観的経験 |
| D3 | 抱持：反射的に処理せず、誤差を問いとして保持する機能 |
| D4 | 情動の構成：欠損が生存軸（生存）と信頼軸（愛）で評価され、情動として構成されるプロセス |

> **H08中心仮説**：誤差が意識のゲートを超える際のルーティング先（生存軸 or 信頼軸）を決める変数。  
> ※「信頼」の中心仮説候補（CN-005/006前提）

---

# 1) ISS-41-b — H08は学習可能か／履歴依存か？

## 1.1 問い（A/B/C）

> H08（誤差のF/Oルーティング変数）は  
> A) 学習可能（成人後も訓練・介入で変化）  
> B) 履歴依存（幼少期で概ね固定、成人後は変化困難）  
> C) 条件付き可変（特定条件下でのみ変化可能）  
> のどれとして扱うのが、理論的・測定設計的に妥当か？

---

## 1.2 3案の比較表（A/B/C）

| 案 | 主張（H08の性質） | 代表的エビデンス（例） | 強み | 弱み/リスク | H08定義への影響 |
|---|---|---|---|---|---|
| A 学習可能 | 成人後も相当に変わる | Hudson 2018（security priming）／Benson 2013（カップル療法） | 介入可能性が高く、ISS-42と直結 | 「状態変化」と「構造変化」の混同リスク | H08を”単一可変パラメータ”として扱いがち→概念の粗さが増える |
| B 履歴依存 | 幼少期でほぼ決まる | Fraley 2002（メタ分析）／Sroufe 2010（ミネソタ縦断） | H08を”信頼の蓄積”に結びやすい | earned secure等の変化を説明しにくい | H08をtrait的に固定→短期タスクでの推定が弱くなる |
| C 条件付き可変 | 低頻度だが変わる／主に「状態成分」は動く | Roisman 2002（earned secure）／Taren 2015・Kral 2018（瞬想訓練）／Keller 2022（恐怖消去） | 安定性（B）と介入可能性（A）を分離し測定設計に落とせる | 「条件」の定義が曖昧だと”何でも説明”になる | H08を**成分分解**（例：bs/pl）して定義する圧が強い |

---

## 1.3 推奨（暫定）：C「条件付き可変」＋H08の成分分解（bs/pl）

### 推奨理由（プロジェクト定義D1-D4との整合）
- D1/D3（抱持）を「いつでもできる技能」と置くと、欠損駆動思考が”訓練で誰でも即達”の話に寄りやすい。  
  しかし本プロジェクトは「棄却される誤差を拾える／拾えない」の**ルーティング差**を中核に置いているため、**ベースラインの差（履歴）**を残す方が概念的に筋が良い。
- 一方で、ISS-42（測定設計）が目的である以上、成人期に観測可能な可変成分が無いと設計が成立しにくい。  
  → **”短期で動く成分”と”長期で動く成分”を分ける**のが最短。

### H08の暫定的な定義変更案（文言だけ）
- H08 = ルーティング機能（F/Oの配分）  
  - **H08.bs**：履歴依存（年スケール）でルーティングの”基準点”を与える  
  - **H08.pl**：状況依存（場面スケール）でルーティングの”ゲイン”を与える

> ここは「確定」ではない。**ISS-42の測定設計上の便益**（混同を防ぐ）で導入している。

---

## 1.4 「分からない」を維持すべき箇所（明示）
- earned secure（Roisman 2002）が示すのは「成人期に安全型が成立しうる」だが、それが  
  1) 内的作業モデルの構造変化（bs）なのか  
  2) 語り・意味づけの再編（測定上の再分類）なのか  
  3) 関係特異的変化（特定の相手でのみplが上がる）なのか  
  の切り分けが必要。
- 神経結合（vmPFC-扁桃体）系の研究は「可塑性」を支持しうるが、H08（ルーティング）に一対一対応させるのは危険（中間変数が多い）。

---

## 1.5 Evidence Card（ISS-41-b：重要3件）

```yaml
---
id: EV-GPT-Fraley-001
type: evidence-card
author: Fraley, R. C.
key_concept: Attachment stability from infancy to adulthood (meta-analysis; prototype dynamics)
relevance: ISS-41-b
confidence: [P]
supports: B（履歴依存）を強く、C（条件付き可変）を中程度に支持
note: 「安定性は中程度で、完全固定でも完全可変でもない」方向の根拠に使える
source: https://cir.nii.ac.jp/crid/1363388844999114752
---
```

```yaml
---
id: EV-GPT-Roisman-002
type: evidence-card
author: Roisman, G. I. et al.
key_concept: Earned-secure attachment (adult security can be achieved despite insecure history)
relevance: ISS-41-b
confidence: [P]
supports: C（条件付き可変）を支持（成人期の変化可能性の実例）
note: 「測定上の再分類」や「関係特異性」の可能性も残るため、過大解釈は避ける
source: https://pubmed.ncbi.nlm.nih.gov/12146743/
---
```

```yaml
---
id: EV-GPT-TarenKral-003
type: evidence-card
author: Taren, A. A. (2015); Kral, T. R. A. (2018)
key_concept: Mindfulness training alters amygdala functional connectivity; increases amygdala–vmPFC connectivity
relevance: ISS-41-b
confidence: [P]
supports: C（条件付き可変）を支持（前頭-扁桃体系の可塑性の実例）
note: 「H08=この結合」ではない。あくまで”可塑性がありうる”の補助根拠
source1: https://pmc.ncbi.nlm.nih.gov/articles/PMC4666115/
source2: https://pmc.ncbi.nlm.nih.gov/articles/PMC6671286/
---
```

---

## 1.6 自己評価（ISS-41-b）

* PASS: 3案比較→推奨→不確実性の明示、というREQ仕様を満たす
* WARN: H08と愛着概念（ECR/AAI等）の測定レベル差がまだ粗い（後で整理が必要）
* FAIL: なし（ただし「条件」の具体化は未）

---

# 2) ISS-41-c — 循環的因果を認めるか？

## 2.1 問い（A/B/C）

> Secure Base経験 → H08形成 → Secure Base提供能力
> この因果関係は
> A) 一方向（発達的因果のみ）
> B) 循環（成人後も経験がH08を更新し、提供能力が変化）
> C) 螺旋（世代間で繰り返す）
> のどれとして扱うのが妥当か？

---

## 2.2 3案の構造図（テキスト図解）

### 案A：一方向的因果（発達固定）

```
幼少期 Secure Base経験
  ↓
H08（成人期はほぼ固定）
  ↓
成人の Secure Base提供能力
  ↓
（次世代へは別モデルで扱う/切断）
```

### 案B：循環的因果（成人期の更新を含む）

```
Secure Base経験（成人期も起きる）
  ↓
H08.pl（短期更新）／H08.bs（長期は緩慢）
  ↓
Secure Base提供能力（対人の出力）
  ↓
相手の反応・関係の安定化
  ↓
新しい Secure Base経験（自己へ還流）
```

### 案C：螺旋的因果（世代間で反復；伝達ギャップ含む）

```
（世代n）
親のH08/提供能力
  ↓
子のSecure Base経験
  ↓
子のH08形成（bs寄りに蓄積）
  ↓
子の成人期の提供能力
  ↓
（世代n+1へ）

※感度・資源・文化でパラメータがドリフトする＝「螺旋」
```

---

## 2.3 各案の理論的含意

### 介入可能性への影響

* A: 介入は「提供能力の表層」になりがち（H08自体は動かない前提）
* B: 介入は「経験→H08→提供能力」のどこにも入りうる（特にpl）
* C: 介入は「親世代の提供能力」か「社会資源」を通じて世代間に効く

### 測定方法への影響（ISS-42接続）

* A: 縦断は幼少期中心。成人タスクではH08推定が弱い
* B: **同一場面内でO/Fルーティングを観測**できる可能性が上がる（ISS-42の価値が最大化）
* C: 世代間データ（親子）を前提に設計できるが、交絡（SES等）が極端に増える

### 責任帰属への倫理的含意（REQ指定）

* A: 成人の困難を「幼少期に帰属」しやすい（固定観の強化リスク）
* B: 成人の更新可能性を含むため「責任＝自己」へ寄りやすい（ただし”努力論”の危険）
* C: 個人責任に閉じず、社会・関係・資源の責任分配が自然に入る

---

## 2.4 Evidence Card（ISS-41-c：重要2件）

```yaml
---
id: EV-GPT-vanIJzendoorn-004
type: evidence-card
author: van IJzendoorn, M. H.; Bakermans-Kranenburg, M. J.
key_concept: Intergenerational transmission of attachment + "transmission gap"
relevance: ISS-41-c
confidence: [P]
supports: C（螺旋）を強く支持。B（循環）の議論にも「媒介が単純でない」制約として重要
note: 感受性（親の感受性/敏感性）だけでは説明が残る＝ループは単純ではない
source: https://pubmed.ncbi.nlm.nih.gov/29529480/
---
```

```yaml
---
id: EV-GPT-BensonHudson-005
type: evidence-card
author: Benson, L. A. (2013); Hudson, N. W. (2018)
key_concept: Attachment security can change during adult interventions (therapy / repeated priming)
relevance: ISS-41-c
confidence: [P]
supports: B（循環）を支持（成人期経験が”その後の安定化”に影響）
note: 変化が「関係特異的」か「一般化」か、bs/pl切り分けが必要
source1: https://pmc.ncbi.nlm.nih.gov/articles/PMC4581532/
source2: https://www.sciencedirect.com/science/article/abs/pii/S0092656618300345
---
```

---

## 2.5 本プロジェクトへの推奨（暫定）

### 推奨：B（循環）＋C（螺旋）を「二層モデル」として採用

* **個人内：循環（B）**
  ISS-42で「同一場面内のルーティング」を測りたい以上、成人期に更新ループがある前提の方が測定設計が成立する。
* **世代間：螺旋（C）**
  伝達ギャップ（単純媒介で説明できない）を入れておくと、H08を”単純な親→子のコピー”にしないで済む。

### 「分からない」を維持する論点

* 循環を採用すると”何でも説明できる”危険がある。
  → ISS-42では、**ループ上のどのエッジを測るのか**を明示し、観測変数で切断可能性を確保する必要がある。

---

## 2.6 自己評価（ISS-41-c）

* PASS: 3案図解＋含意（介入/測定/倫理）＋Evidence Card のREQ仕様を満たす
* WARN: 「循環」と「相関」を混同しないための”切断設計（edge measurement）”がまだ抽象
* FAIL: なし

---

# 3) 次にpjdhiroが確認すべき1点（最小）

**H08を bs/pl に分ける前提を、CN-005/006の用語体系に正式に取り込むか？**

* 取り込むなら：ISS-42（測定設計）は「bsは縦断・履歴、plは場面タスク」で二系統に割り切れる
* 取り込まないなら：ISS-42で”短期に動くのにtraitに見える”混同が起き、代理変数の解釈が崩れやすい

（この一点だけ、Claude側の正本判断が必要）
