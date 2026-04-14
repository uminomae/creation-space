# The Strength of Weak Ties

**source_id**: D18-S04 | **domain_id**: D18
**access_status**: url-verified
**読解日**: 2026-04-13 | **読解者**: Claude Opus 4.6
**読解方法**: Main curl→ローカル保存→Read (PDF image mode)
**原典ページ数**: 22 (pp.1360-1380) | **読解ページ範囲**: pp.1360-1368（前半9頁、後半13頁は §7 参照）

---

## 1. 書誌情報

- **著者**: Mark S. Granovetter (Johns Hopkins University, 投稿時)
- **タイトル**: The Strength of Weak Ties
- **出典**: *American Journal of Sociology* 78(6), 1360-1380 (May 1973)
- **DOI / URL**: https://www.jstor.org/stable/2776392 / https://snap.stanford.edu/class/cs224w-readings/granovetter73weakties.pdf

## 2. 要旨（読んだ内容に基づく）

Granovetter は社会ネットワーク分析をミクロ（対人的相互作用）とマクロ（社会移動・コミュニティ組織・政治構造）を接続する道具として提案し、その例示として「紐帯強度」の概念を精緻化する。紐帯の強さは「接触時間・情緒的強度・親密さ・相互サービス」の線形結合として定義され（p.1361）、強紐帯同士が共通する第三者を介して推移的に結び付きやすい（禁じられた三項組: forbidden triad）という仮説から、「橋 (bridge) になりうる紐帯は弱紐帯に限られる」という帰結を導く。その結果、情報・影響・機会の広域拡散においては、密な強紐帯クラスタ内ではなくクラスタ間を繋ぐ弱紐帯の方が決定的な役割を果たす。本論文の核心は、直観的には「弱い」ものが構造的には「強い」機能を持つという逆説を、単純な数理モデルと経験証拠で示すことにある。

## 3. 主要主張（原文引用付き）

### 主張 1: 紐帯の強度は「時間・情緒・親密・相互サービス」の線形結合として定義される

> "Most intuitive notions of the 'strength' of an interpersonal tie should be satisfied by the following definition: the strength of a tie is a (probably linear) combination of the amount of time, the emotional intensity, the intimacy (mutual confiding), and the reciprocal services which characterize the tie." (p.1361)

著者は各要素の操作的測定を将来の実証研究に委ね、当面は「強・弱・不在」の直観的区別で議論を展開する。脚注 4 で「不在」が完全な関係の無さと無意味な接触（"nodding" relationship）の両方を含むことに注意喚起。

### 主張 2: 強紐帯は推移的結合を生みやすい（時間配分と類似性）

> "The hypothesis which enables us to relate dyadic ties to larger structures is: the stronger the tie between A and B, the larger the proportion of individuals in S to whom they will both be tied, that is, connected by a weak or strong tie. This overlap in their friendship circles is predicted to be least when their tie is absent, most when it is strong, and intermediate when it is weak." (p.1362)

根拠は 2 つ: (a) 強紐帯は時間投資を伴うため C が A と B の両方と時間を共有しやすい、(b) Heider/Newcomb の認知的バランス理論によれば、C が A と B の双方と強く繋がっていて A-B が強紐帯なら、C と A-B の間に心理的均衡が形成され、さもなくば "psychological strain" が生じる。

### 主張 3: 強紐帯が 2 本あるとき、第三者同士の紐帯の「不在」は構造的に排除される（禁じられた三項組）

> "The triad which is most unlikely to occur, under the hypothesis stated above, is that in which A and B are strongly linked, A has a strong tie to some friend C, but the tie between C and B is absent. This triad is shown in figure 1." (p.1363)

著者は議論を単純化するため「この三項組は決して現れない」と仮定し、結果として得られる帰結を検証する。これが Figure 1 の "Forbidden triad"。

### 主張 4: 橋になりうる紐帯は弱紐帯のみである（強紐帯は橋にならない）

> "Now, if the stipulated triad is absent, it follows that, except under unlikely conditions, no strong tie is a bridge. Consider the strong tie A-B: if A has another strong tie to C, then forbidding the triad of figure 1 implies that a tie exists between C and B, so that the path A-C-B exists between A and B; hence, A-B is not a bridge. A strong tie can be a bridge, therefore, only if neither party to it has any other strong ties, unlikely in a social network of any size." (p.1364)

"Bridge" は 2 つのノード間の唯一の経路である紐帯。強紐帯は禁止三項組により推移的に迂回経路を生むため、通常は橋になれない。一方で「すべての橋は弱紐帯である」が成り立つ（ただし逆は偽：全ての弱紐帯が橋というわけではない）。

### 主張 5: 実際のネットワークでは「local bridge」が拡散の要となる

> "In large networks it probably happens only rarely, in practice, that a specific tie provides the *only* path between two points. The bridging function may nevertheless be served *locally* ... By the same logic used above, only weak ties may be local bridges." (p.1365)

完全なグローバル橋は稀だが、局所的に「代替経路が指定距離 n 以上」である "local bridge" は多数存在し、それらも全て弱紐帯に限られる。拡散・伝播のショートカットとして機能するのはこの local bridge。

### 主張 6: 拡散過程で弱紐帯は強紐帯より大きな社会的距離を横断する

> "Intuitively speaking, this means that whatever is to be diffused can reach a larger number of people, and traverse greater social distance (i.e., path length), when passed through weak ties rather than strong. If one tells a rumor to all his close friends, and they do likewise, many will hear the rumor a second and third time, since those linked by strong ties tend to share friends. If the motivation to spread the rumor is dampened a bit on each wave of retelling, then the rumor moving through strong ties is much more likely to be limited to a few cliques than that going via weak ones; bridges will not be crossed." (p.1366)

強紐帯クラスタは閉じやすく、弱紐帯（橋）を介さない情報は cliques 内部で周回する。これが「イノベーションの拡散」で "marginal" な個人（弱紐帯を多く持つ）が決定的役割を果たす機序の理論的基礎。

## 4. 方法論

- **概念的・数理的アプローチ**: ネットワーク分析の用語（bridge, degree, triad, path length）を社会学的議論に応用。明示的に mathematical に傾くが、数式は最小限で、主張の多くは graph-theoretic に直観的
- **経験証拠の転用**: Davis (1970) の 651 sociograms 解析、Newcomb (1961), Kerckhoff & Back (1968) のヒステリー集団伝染研究、Milgram (1967) の small-world 研究を引用し、弱紐帯仮説を支持するデータを集約
- **"Forbidden triad" の仮定化**: 実証されない（現実には時折現れる）仮定を議論の簡略化のため理想化し、その帰結を導く。著者自身「I will exaggerate it ... by supposing that the triad shown *never* occurs」(p.1363) と明示
- **将来研究への委譲**: 操作的測定・定量的モデリングは後続研究に委ね、本論文は「network analysis が micro-macro bridge として有効である」という方向性の提示に注力

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | ネットワーク全体という「場」の概念は背景的に存在 | 弱 | "Sociometry, the precursor of network analysis, has always been curiously peripheral" (p.1360) — 場よりも構造の議論 |
| 2 波 (Wave) | 情報・影響・イノベーションの拡散が波として広がる | 強 | "If the motivation to spread the rumor is dampened a bit on each wave of retelling, then the rumor moving through strong ties is much more likely to be limited to a few cliques than that going via weak ones" (p.1366) |
| 3 縁 (Relation) | 紐帯 (tie) そのものが「縁」の直接的対応。強紐帯/弱紐帯の区別は縁の質の細分化 | 強 | "the strength of a tie is a (probably linear) combination of the amount of time, the emotional intensity, the intimacy (mutual confiding), and the reciprocal services" (p.1361) |
| 4 渦 (Vortex) | 強紐帯クラスタ内で情報が周回する（渦的再循環）のに対し、弱紐帯は周回を脱出する経路 | 弱 | "many will hear the rumor a second and third time, since those linked by strong ties tend to share friends" (p.1366) |
| 5 束 (Bundle) | 強紐帯三項組（triad）は密な束として現れ、弱紐帯はそれらを束ね合わせる | 強 | "Consider the strong tie A-B: if A has another strong tie to C, then forbidding the triad of figure 1 implies that a tie exists between C and B, so that the path A-C-B exists" (p.1364) — 三者が互いに束化される論理構造 |

**判定基準の適用**:
- **Stage 2/3/5 強**: 「紐帯」「拡散の波」「三項組的な束」が論文の核心。Relation の強さはほぼ自明で、Wave は rumor diffusion、Bundle は forbidden triad の推移性に対応
- **Stage 1/4 弱**: 場としてのネットワーク全体、渦としての clique 内循環は副次的読み

**manifest ヒントからの独立性**: manifest には「Stage 2-4: 弱紐帯の構造的優位」とあった。原典を読むと、Stage 3 (縁) は論文の主題そのものであり強対応、Stage 2 (波) と Stage 5 (束) も明示的な記述がある。Stage 4 (渦) は弱対応が適切で、ヒントの「2-4」は Stage 5 の構造的重要性を捉え損なっている。原典独立判定の結果はヒントを修正する方向。

## 6. 限界・留意事項

- **論文種別**: 概念的・理論的論文。新規実証データは含まず、既存研究の再整理と仮定の帰結提示が中心
- **「禁じられた三項組」の仮定の強さ**: 著者自身が "I will exaggerate it ... by supposing that the triad shown *never* occurs" と誇張的仮定であると明示している (p.1363)。現実の三項組分布は 90% 程度の一致で、完全な排除ではない
- **紐帯強度の操作的定義の未完**: 4 要素の線形結合は概念的定義に留まり、具体的な測定手順は本論文では提示されない。後続の「弱紐帯仮説」検証研究はそれぞれ独自の代理指標を用いることになる
- **対称性と正の符号の仮定**: 脚注 2 で「本稿で議論する紐帯は正で対称的である」と限定している (p.1361)。非対称紐帯や負の紐帯は射程外
- **「創造」との関係**: 本論文は社会移動・コミュニティ組織・政治動員・拡散を論じており、「創造プロセス」の段階モデルとしては書かれていない。後続研究で innovation adoption との接続が試みられるが、それは本論文の射程外

## 7. 未読解セクション（部分読解の場合）

- **pp.1369-1380**: 読了したのは pp.1360-1368。残り約 13 頁は次の主題を含むと推測される:
  - 小世界実験（Milgram 1967; Travers & Milgram 1969）の本格的分析と紐帯強度との関係
  - 求職過程での weak ties の役割（Granovetter の博士論文由来の経験証拠）
  - コミュニティ組織と political mobilization への応用
  - ノーザン文化圏（Boston West End）の再開発反対運動における弱紐帯不足の論拠
  - 結論と理論的示唆
- 今回の読解では Figure 1-2 と "forbidden triad" の論理、bridge の定義、拡散過程での弱紐帯優位という **核心部分** がすべて含まれており、§5 の 5段階対応判定に十分な根拠がある。求職と community mobilization の実証部分は未読のままだが、それらは論文の中心主張を補強するものであり、修正する性質のものではない
