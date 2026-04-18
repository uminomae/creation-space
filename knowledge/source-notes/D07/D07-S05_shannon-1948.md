# A Mathematical Theory of Communication

**source_id**: D07-S05 | **domain_id**: D07
**access_status**: raw-confirmed
**読解日**: 2026-04-10 | **読解者**: Claude Opus 4.6 (1M context)
**読解方法**: Read (PDF)
**原典ページ数**: 45+ (本文27頁 + 付録・連続チャネル部) | **読解ページ範囲**: 1-30, 41-45

---

## 1. 書誌情報

- **著者**: Claude E. Shannon
- **タイトル**: A Mathematical Theory of Communication
- **出典**: The Bell System Technical Journal, Vol. 27, pp. 379-423, 623-656, July, October, 1948
- **DOI / URL**: (Bell System Technical Journal 再録版)

## 2. 要旨（読んだ内容に基づく）

本論文は通信の根本問題を数学的に定式化する。Shannon はメッセージの意味的側面を明示的に排除し、通信の工学的問題を「ある地点で選択されたメッセージを別の地点で正確にまたは近似的に再現すること」と定義する。情報源をマルコフ過程として確率的にモデル化し、エントロピー H = -sum(p_i log p_i) を情報の尺度として導入する。離散無雑音チャネル、離散有雑音チャネル、連続チャネルの各場合について、チャネル容量 C の定義と基本定理を証明する。特に、情報源のエントロピーがチャネル容量以下であれば、適切な符号化により任意に小さい誤り率で通信可能であることを示す。

## 3. 主要主張（原文引用付き）

### 主張 1: 通信の工学的問題は意味とは独立である

> "The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point. Frequently the messages have meaning; that is they refer to or are correlated according to some system with certain physical or conceptual entities. These semantic aspects of communication are irrelevant to the engineering problem." (p.1)

Shannon は通信問題の定式化において、メッセージの意味内容を意図的に捨象する。重要なのはメッセージが可能なメッセージの集合から選択されたという事実であり、システムは実際にどのメッセージが選ばれるか事前にわからない状態で設計されなければならない。

### 主張 2: エントロピーは情報・選択・不確実性の尺度である

> "Quantities of the form H = -sum(p_i log p_i) (the constant K merely amounts to a choice of a unit of measure) play a central role in information theory as measures of information, choice and uncertainty." (p.11)

Shannon は3つの合理的な公理（連続性、等確率時の単調増加性、選択の分解の加法性）を満たす唯一の尺度が H = -K sum(p_i log p_i) であることを証明する（Theorem 2）。この形式は統計力学におけるボルツマンのエントロピーと同型である。

### 主張 3: 無雑音チャネルの基本定理 -- エントロピーが符号化効率の限界を定める

> "Theorem 9: Let a source have entropy H (bits per symbol) and a channel have a capacity C (bits per second). Then it is possible to encode the output of the source in such a way as to transmit at the average rate C/H - epsilon symbols per second over the channel where epsilon is arbitrarily small. It is not possible to transmit at an average rate greater than C/H." (p.16)

エントロピー H は最も効率的な符号化における情報生成率を決定する。これにより通信の理論的上限が確立される。

### 主張 4: 有雑音チャネルの基本定理 -- 雑音があっても信頼性のある通信が可能

> "Theorem 11: Let a discrete channel have the capacity C and a discrete source the entropy per second H. If H <= C there exists a coding system such that the output of the source can be transmitted over the channel with an arbitrarily small frequency of errors (or an arbitrarily small equivocation)." (p.22)

雑音のあるチャネルでも、情報源エントロピーがチャネル容量以下であれば、冗長性を適切に導入する符号化によって誤り率を任意に小さくできる。逆に H > C であれば、等化誤差を H - C 未満にすることは不可能である。

### 主張 5: 連続チャネルの容量は帯域幅と信号対雑音比で決まる

> "Theorem 17: The capacity of a channel of band W perturbed by white thermal noise power N when the average transmitter power is limited to P is given by C = W log (P+N)/N." (p.43)

連続チャネルの場合、チャネル容量は帯域幅 W と信号電力対雑音電力比 (P+N)/N の対数の積で表される。これは Shannon-Hartley の定理として知られる結果の原型である。

## 4. 方法論

Shannon は確率論・マルコフ過程・エルゴード理論を通信工学に適用する理論的アプローチをとる。

1. **情報源のモデル化**: 離散情報源をマルコフ過程として定式化し、遷移確率のグラフ表現を導入する。英語テキストへの0次から2次までの近似を実例として示す（p.6-7）。
2. **公理的定義**: エントロピーを3つの公理から一意に導出する（Appendix 2, p.28-29）。
3. **存在証明**: 基本定理（Theorem 11）の証明は構成的ではなく存在証明であり、ランダム符号の集合における平均誤り率が小さいことから、少なくとも1つの良い符号の存在を示す（p.22-24）。
4. **連続への拡張**: 離散チャネルの結果を連続チャネルに拡張し、帯域制限・電力制限の条件下でのチャネル容量を導出する（Part IV, p.41-45）。

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | なし | なし | -- |
| 2 波 (Wave) | エントロピー最大の情報源（等確率・独立）と統計的構造による冗長性の対比。等確率状態からの「ゆれ」として統計的偏りが生じ、冗長性が生まれる構造に弱い類似がある | 弱 | "The redundancy of ordinary English, not considering statistical structure over greater distances than about eight letters, is roughly 50%. This means that when we write English half of what we write is determined by the structure of the language and half is chosen freely." (p.14) |
| 3 縁 (Relation) | チャネル容量 C の定義が入力と出力の関係性（条件付きエントロピー）で決まる。C = Max[H(x) - H_y(x)] は送受信間の「関係」の最大情報量を表す | 弱 | "The capacity C of a noisy channel should be the maximum possible rate of transmission, i.e., the rate when the source is properly matched to the channel. We therefore define the channel capacity by C = Max(H(x) - H_y(x))" (p.22) |
| 4 渦 (Vortex) | なし | なし | -- |
| 5 束 (Bundle) | なし | なし | -- |

**判定基準**:
- **弱**: 構造的類似はあるが、著者の文脈・意図とは異なる読みである
- **なし**: 対応が見出せない。無理に作らない

Stage 2 について: Shannon のエントロピー概念は「最大不確実性（等確率）」と「統計的構造による制約」の対比を含み、これは「場の中に差が生まれる」という波の段階と構造的類似を持つが、Shannon 自身は創造プロセスについて論じていない。あくまで通信効率の文脈であり、対応は弱い。

Stage 3 について: チャネル容量の定義が入力-出力間の相互情報量（関係性の定量化）であることは「境界で起きる出来事」としての縁と構造的類似を持つが、Shannon の文脈は情報伝送の信頼性限界であり、創造プロセスの「繋がり」とは異なる。

## 6. 限界・留意事項

- 本論文は通信の工学的問題に限定しており、情報の「意味」や「価値」については明示的に射程外としている（p.1）。情報の創造的側面への直接的な言及はない。
- 基本定理（Theorem 11）の証明は存在証明であり、実用的な符号化方式の構成は示していない。Shannon 自身がこの限界を認めている："The demonstration of Theorem 11, while not a pure existence proof, has some of the deficiencies of such proofs. An attempt to obtain a good approximation to ideal coding by following the method of the proof is generally impractical." (p.24)
- Part III（連続情報源、p.31-40）は今回の読解範囲外であり、連続情報源のエントロピーに関する詳細な議論は未読解である。
- 5段階モデルとの対応は弱い。本論文は通信システムの数学的限界を論じるものであり、創造プロセスとは異なる文脈にある。

## 7. 未読解セクション（部分読解の場合）

- Part III: The Mathematical Preliminaries for the Continuous Case（p.31-40 付近）: 連続情報源のエントロピー定義、エントロピー冪、連続チャネルの数学的準備
- Appendix 5-7（p.31 以降の付録部分）: 連続チャネルに関する数学的証明
