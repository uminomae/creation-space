# Congestion Avoidance and Control

**source_id**: D07-S03 | **domain_id**: D07
**access_status**: url-verified
**読解日**: 2026-04-13 | **読解者**: Claude Opus 4.6 (1M context)
**読解方法**: WebFetch 不可のため curl で PDF 取得 → Read (PDF image mode)
**原典ページ数**: 約25 (本論 1-17 + 付録 A-D + 参考文献) | **読解ページ範囲**: 1-20 (本論全部 + 付録 A, B 全部。付録 C, D と参考文献は未読)

---

## 1. 書誌情報

- **著者**: Van Jacobson (Lawrence Berkeley Laboratory), Michael J. Karels (University of California at Berkeley)
- **タイトル**: Congestion Avoidance and Control
- **出典**: Proceedings of SIGCOMM '88 (ACM Computer Communication Review, Vol. 18, No. 4, August 1988), pp. 314-329。本ファイルは LBL ホストの 1988年11月の "very slightly revised version"
- **DOI / URL**: https://doi.org/10.1145/52324.52356 / https://ee.lbl.gov/papers/congavoid.pdf

## 2. 要旨（読んだ内容に基づく）

1986年10月、Internet で初の "congestion collapse" シリーズが発生し、LBL-UC Berkeley 間のスループットが 32 Kbps から 40 bps へと約千分の一に落ちた。著者らは 4.3BSD TCP の実装を調査し、輻輳問題の多くは「プロトコル仕様」ではなく「実装」に由来することを示した。論文は 4.3BSD TCP に投入した7つの新アルゴリズム（うち (i)-(v) を本論で詳述）の根拠を述べる。中核となる原理は "conservation of packets"（パケット保存則）で、平衡状態にある接続では「古いパケットがネットワークを離れない限り新しいパケットを入れない」ことを要求する。この原理を破る三つの失敗モード（平衡到達失敗、タイマー誤りによる早期注入、経路上の資源限界）に対応するのが slow-start、RTT 分散推定を含む再送タイマ、congestion avoidance（加法的増加・乗法的減少）である。著者らは自己クロック化された送信器という比喩、線形システム理論による指数バックオフの正当化、Lyapunov 安定性への言及などを通じ、TCP の挙動を「物理系」として論じる。

## 3. 主要主張（原文引用付き）

### 主張 1: 輻輳制御は「パケット保存則」を守る問題である

> "Algorithms (i) – (v) spring from one observation: The flow on a TCP connection (or ISO TP-4 or Xerox NS SPP connection) should obey a 'conservation of packets' principle. And, if this principle were obeyed, congestion collapse would become the exception rather than the rule. Thus congestion control involves finding places that violate conservation and fixing them." (p.2)

> "By 'conservation of packets' we mean that for a connection 'in equilibrium', i.e., running stably with a full window of data in transit, the packet flow is what a physicist would call 'conservative': A new packet isn't put into the network until an old packet leaves. The physics of flow predicts that systems with this property should be robust in the face of congestion." (p.2)

著者は輻輳問題を「保存則違反を探して直す」という物理学的フレームに置き直した。注釈で Lyapunov 安定性への対応を明示している (p.2 footnote 1)。

### 主張 2: 保存則の破れは三通りしかない

> "There are only three ways for packet conservation to fail: 1. The connection doesn't get to equilibrium, or 2. A sender injects a new packet before an old packet has exited, or 3. The equilibrium can't be reached because of resource limits along the path." (p.2)

論文の §1, §2, §3 はこの三分類に1対1で対応する。これは論文全体の構造を決める分類学である。

### 主張 3: ack はクロックである — slow-start による平衡への到達

> "Another way to look at the conservation property is to say that the sender uses acks as a 'clock' to strobe new packets into the network. Since the receiver can generate acks no faster than data packets can get through the network, the protocol is 'self clocking' (fig. 1). Self clocking systems automatically adjust to bandwidth and delay variations and have a wide dynamic range" (p.2-3)

> "To start the 'clock', we developed a slow-start algorithm to gradually increase the amount of data in-transit. ... Add a congestion window, cwnd, to the per-connection state. When starting or restarting after a loss, set cwnd to one packet. On each ack for new data, increase cwnd by one packet. When sending, send the minimum of the receiver's advertised window and cwnd." (p.3-4)

> "Actually, the slow-start window increase isn't that slow: it takes time R log₂ W where R is the round-trip-time and W is the window size in packets" (p.4)

slow-start は名前に反して指数的（log₂W ラウンドトリップ）に窓を開く。送信器の自己クロック化と窓の指数的立ち上げが、平衡を「点火」する装置として説明される。

### 主張 4: RTT の平均だけでなく分散を推定する必要がある

> "One mistake is not estimating the variation, σ_R, of the round trip time, R. From queuing theory we know that R and the variation in R increase quickly with load. If the load is ρ (the ratio of average arrival rate to average departure rate), R and σ_R scale like (1−ρ)⁻¹. To make this concrete, if the network is running at 75% of capacity, as the Arpanet was in last April's collapse, one should expect round-trip-time to vary by a factor of sixteen (−2σ to +2σ)." (p.6)

> "The parameter β accounts for RTT variation (see [5], section 5). The suggested β = 2 can adapt to loads of at most 30%. Above this point, a connection will respond to load increases by retransmitting packets that have only been delayed in transit. ... I.e., this is the network equivalent of pouring gasoline on a fire." (p.7)

待ち行列理論を直接持ち込み、RFC793 の固定 β = 2 が高負荷下で破綻する理由を示す。付録 A で平均偏差 mdev を用いた廉価な分散推定アルゴリズムを与える (p.18-20)。

### 主張 5: 指数バックオフは線形システム安定化の唯一の解

> "For a transport endpoint embedded in a network of unknown topology and with an unknown, unknowable and constantly changing population of competing conversations, only one scheme has any hope of working—exponential backoff—but a proof of this is beyond the scope of this paper." (p.7)

> "To finesse a proof, note that a network is, to a very good approximation, a linear system. ... Linear system theory says that if a system is stable, the stability is exponential. This suggests that an unstable system (a network subject to random load shocks and prone to congestive collapse) can be stabilized by adding some exponential damping (exponential timer backoff) to its primary excitation (senders, traffic sources)." (p.8)

ネットワークを線形システムとみなし、指数バックオフを「指数減衰」項として正当化する。

### 主張 6: 輻輳回避は加法的増加・乗法的減少 (AIMD) である

> "On congestion: W_i = dW_{i−1} (d < 1) I.e., a multiplicative decrease of the window size (which becomes an exponential decrease over time if the congestion persists)" (p.9)

> "Without justification, we'll state that the best increase policy is to make small, constant changes to the window size: On no congestion: W_i = W_{i−1} + u (u ≪ W_max) ... This is the additive increase / multiplicative decrease policy suggested in [15] and the policy we've implemented in TCP." (p.10)

> "On any timeout, set cwnd to half the current window size (this is the multiplicative decrease). On each ack for new data, increase cwnd by 1/cwnd (this is the additive increase)." (p.10)

Chiu & Jain の AIMD 政策を 4.3BSD TCP に投入した。3行のコードで実装可能であることを強調する (p.10)。

## 4. 方法論

- **観測**: 1986年10月の congestion collapse を観測し、LBL-UCB 間のスループット低下を計測した
- **トレース実験**: 二台の Sun 3/50 を IP gateway 経由 230.4 Kbps ポイント・ツー・ポイント・リンクで繋ぎ、シーケンス番号と送信時刻のドット図で TCP の挙動を可視化（Fig. 3, 4, 5, 6）
- **多接続実験**: 4台 ↔ 4台の Sun/Vax で同時 TCP 会話を流し、輻輳回避ありなしを比較（Fig. 7-12, p.12-17）
- **物理学的フレーミング**: 保存則・線形系・Lyapunov 安定性などの物理・制御理論の道具立てを TCP の挙動の説明に持ち込む
- **理論的補強**: 待ち行列理論で β=2 の上限負荷を導出、AIMD の根拠は Chiu & Jain (1989, ref [15]) に依拠
- **実装**: 4.3BSD TCP に 7 アルゴリズムを投入。本論は (i)-(v) を扱う
- **付録 A**: RTT 平均と平均偏差の整数演算による高速推定（シフト演算で gain g=1/8 を実装）

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | ネットワーク全体を「未知のトポロジ・未知の競合会話人口を持つ系」として扱う背景認識。ただし「場」というより「未知環境」 | 弱 | "a network of unknown topology and with an unknown, unknowable and constantly changing population of competing conversations" (p.7) |
| 2 波 (Wave) | 輻輳ウィンドウの「damped oscillation」と「punctuated equilibrium」型の bandwidth 振動 | 弱 | "about 20 seconds of damped oscillation as the congestion control 'regulator' for each TCP finds the correct window size" (p.15); "competing conversations frequently exhibit this type of 'punctuated equilibrium' behavior" (p.15) |
| 3 縁 (Relation) | "self-clocking" — 送信器・受信器・ボトルネック・ack の循環ループという関係構造そのものが系の安定性を生む。Fig. 1 の物理的な漏斗イメージ | 強 | "if packets after the first burst are sent only in response to an ack, the sender's packet spacing will exactly match the packet time on the slowest link in the path" (p.3); "the protocol is 'self clocking' (fig. 1). Self clocking systems automatically adjust to bandwidth and delay variations" (p.3) |
| 4 渦 (Vortex) | 個々の TCP 接続が「平衡」状態（個として立ち上がる）に到達するプロセス。slow-start は渦の点火に相当 | 強 | "By 'conservation of packets' we mean that for a connection 'in equilibrium', i.e., running stably with a full window of data in transit, the packet flow is what a physicist would call 'conservative'" (p.2); "To start the 'clock', we developed a slow-start algorithm to gradually increase the amount of data in-transit" (p.3) |
| 5 束 (Bundle) | 多数の TCP 接続が共有ボトルネックで「fair share」の集合構造を形成する場面（Fig. 9-12, §3, §4 の Gateway 議論） | 弱 | "competing conversations frequently exhibit this type of 'punctuated equilibrium' behavior" (p.15); "While algorithms at the transport endpoints can insure the network capacity isn't exceeded, they cannot insure fair sharing of that capacity" (p.11) |

**判定基準**:
- **強**: 著者が直接その概念・構造を論じており、5段階の定義と明確に対応する
- **弱**: 構造的類似はあるが、著者の文脈・意図とは異なる読みである
- **なし**: 対応が見出せない

**注記**: Stage 3（縁）と Stage 4（渦）は強い対応が認められる。特に self-clocking は「ack を介したループ的関係」が系の安定性そのものを生むという点で、境界での関係から個が立ち上がる縁→渦の遷移を地で行く例である。Stage 5（束）は複数接続の集合的振る舞いとして弱い類似があるが、論文の主焦点は単一接続の振舞いに置かれており、束としての構造論ではない。Stage 1（場）の対応は薄く、Stage 2（波）は damped oscillation という定常状態の擾乱として現れるが、創造の生成位相としての「波」とは方向性が異なる。manifest ヒントの存在を仮定せず原典で再判定した結果、強対応は §3-4 の二段階に集中する。

## 6. 限界・留意事項

- **論文の射程**: 1988年時点の TCP/IP の輻輳問題への工学的応答であり、創造論を意図したものではない。物理学的比喩（保存則、線形系、Lyapunov）は著者自身が説明の道具として導入しており、観測装置（パッシブ計測）と工学的介入が分離された科学と工学の両義的テクストとして読むべきである
- **「平衡」の意味**: 物理系の熱平衡ではなく、「窓いっぱいのパケットがパイプ内に常駐し、ack が一定リズムで戻る」という運転状態を指す
- **partial reading**: 本論 (p.1-17) と付録 A, B (p.18-20) は読了。付録 C (おそらく追加実装メモ) と D, および参考文献は未読
- **"three lines of code"**: 著者は実装の単純さを強調するが、後続の研究では fast retransmit・fast recovery・SACK・BBR など多くの追加機構が必要となった。本論はその出発点であって完成形ではない
- **Stage 5 への外挿**: §4 の Gateway 議論は論文の最後にあり、著者自身が "Future work" と明示している。束としての対応は将来研究への問題提起としてあるに過ぎない

## 7. 未読解セクション（部分読解の場合）

- 付録 C, D（appendix C, D）— 本文中で "see appendix D" 等の参照あり
- 参考文献リスト — citation 番号 [1]-[26] は本文内で確認したが、書誌情報そのものは未読
- (本論 §1-§4 と付録 A-B は全て読了済み)
