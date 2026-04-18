# Learning representations by back-propagating errors

**source_id**: D07-S04 | **domain_id**: D07
**access_status**: raw-confirmed
**読解日**: 2026-04-10 | **読解者**: Claude Opus 4.6 (1M context)
**読解方法**: Read (PDF)
**原典ページ数**: 4 (Nature letter, pp.533-536) | **読解ページ範囲**: 1-4（全ページ）

---

## 1. 書誌情報

- **著者**: David E. Rumelhart, Geoffrey E. Hinton, Ronald J. Williams
- **タイトル**: Learning representations by back-propagating errors
- **出典**: Nature, Vol. 323, 9 October 1986, pp. 533-536
- **DOI / URL**: doi:10.1038/323533a0

## 2. 要旨（読んだ内容に基づく）

著者らは、多層ニューラルネットワーク（隠れユニットを持つネットワーク）に対する学習手続きとして誤差逆伝播法（backpropagation）を記述している。ネットワークの出力と望ましい出力との差の尺度に基づき、接続の重みを繰り返し調整する。この手続きにより、隠れユニットが入力の有用な内部表現を自律的に発見し、タスクに適した特徴表現を構築できることを実証している。対称性検出、家族関係の学習などの具体例で、ネットワークが内部表現を自己組織化する過程を示している。

## 3. 主要主張（原文引用付き）

### 主張 1: 隠れユニットによる内部表現の自動発見

> "We describe a new learning procedure, back-propagation, for networks of neurone-like units. The procedure repeatedly adjusts the weights of the connections in the network so as to minimize a measure of the difference between the actual output vector of the net and the desired output vector." (p.533)

ネットワークが出力誤差を最小化するように重みを調整する過程で、隠れユニットが入力データの有用な内部表現を自動的に獲得する学習手続きを提案している。

### 主張 2: 勾配降下法による重みの効率的更新

> "To minimize E by gradient descent it is necessary to compute the partial derivative of E with respect to each weight in the network. This is simply the sum of the partial derivatives for each of the input-output cases." (p.534)

誤差関数 E の各重みに対する偏微分を、出力層から入力層へと連鎖律を用いて効率的に計算できることを示した。これが backpropagation の核心的アルゴリズムである。

### 主張 3: 隠れユニットの表現は解釈可能な構造を持つ

> "Fig. 4 The weights from the 24 input units that represent people to 6 units in the second layer form distinct distributed representations of people." (p.535)

家族関係タスクにおいて、隠れユニットの重みが人物の分散表現を形成し、国籍・世代などの意味的特徴を自発的にエンコードしていることを図示した。ネットワークは明示的に教えられていない特徴次元を自己組織的に発見する。

### 主張 4: 学習は内部構造の発見であり単なるパターン記憶ではない

> "Learning becomes more interesting but more difficult when we introduce hidden units whose actual or desired states are not specified by the task." (p.533)

隠れユニットの状態は外部から指定されず、ネットワーク自身が課題を解くために適切な内部構造を発見しなければならない。これにより学習は単純な入出力対応を超え、内部表現の創出というより深い問題となる。

### 主張 5: 手続きの生物学的妥当性への言及

> "The learning procedure, in its current form, is not a plausible model of learning in brains. However, applying the procedure to various tasks shows that interesting internal representations can be constructed by gradient descent in weight-space, and this suggests that it is worth looking for more biologically plausible ways of doing gradient descent in neural networks." (p.536)

著者らは、現行の backpropagation は脳の学習モデルとしては妥当でないと認めつつ、勾配降下による内部表現の構築が可能であること自体が、生物学的により妥当な類似メカニズムの探索を動機づけると述べている。

## 4. 方法論

- 多層フィードフォワードネットワーク（入力層・隠れ層・出力層）を用いた教師あり学習
- 非線形活性化関数（ロジスティック関数）を各ユニットに適用
- 誤差関数（出力と目標の差の二乗和）を定義し、連鎖律（chain rule）で各重みの偏微分を出力層から逆方向に計算
- 具体的な実験例:
  - 対称性検出（64次元入力の対称パターン判定）
  - 家族関係の推論（2つの同型家系図の関係トリプル学習）
  - 文字の空間変換の不変性

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | ランダム初期化された重みの状態（未分化な初期状態） | 弱 | "The initial weights were random and were uniformly distributed between -0.3 and 0.3." (p.534) |
| 2 波 (Wave) | なし | なし | |
| 3 縁 (Relation) | なし | なし | |
| 4 渦 (Vortex) | 隠れユニットが分散表現として個別の特徴構造を立ち上げる過程 | 弱 | "the second layer form distinct distributed representations of people" (p.535) |
| 5 束 (Bundle) | なし | なし | |

**判定基準**:
- Stage 1（弱）: ランダム初期化は「未分化な状態」との構造的類似があるが、著者は創造的プロセスとして論じておらず、単に学習アルゴリズムの初期条件として記述している。5段階モデルの「場」の定義（すべてが溶けている状態）とは文脈が大きく異なる。
- Stage 4（弱）: 隠れユニットが自己組織的に分散表現を形成する過程は「まとまりとして立ち上がる」との構造的類似があるが、著者は数学的最適化の結果として記述しており、創造的個体化の文脈ではない。
- 全体として、この論文は工学的な学習アルゴリズムの提案であり、5段階モデルが対象とする創造プロセスとの直接的対応は限定的である。

## 6. 限界・留意事項

- 本論文は Nature の短い letter（4ページ）であり、アルゴリズムの詳細な数学的分析や大規模実験は含まれていない。より詳細な記述は著者らの同時期の書籍章（Rumelhart et al., 1986, Parallel Distributed Processing）に含まれる
- 論文の主眼は学習アルゴリズムとその有効性の実証であり、創造性や認知プロセスの理論ではない
- 5段階との対応は構造的類似に基づく弱い対応のみであり、著者の意図とは異なる読みである点に留意が必要

## 7. 未読解セクション

全ページ読了
