# Sea-Floor Spreading and Continental Drift

**source_id**: D05-S03 | **domain_id**: D05
**access_status**: raw-confirmed
**読解日**: 2026-04-22 | **読解者**: claude-opus-4-7
**読解方法**: Read (PDF)
**原典ページ数**: 37 | **読解ページ範囲**: 1-5, 15-20, 33-37（主要部抜粋読解）

---

## 1. 書誌情報

- **著者**: Xavier Le Pichon
- **タイトル**: Sea-Floor Spreading and Continental Drift
- **出典**: Journal of Geophysical Research, Vol. 73, No. 12, pp. 3661-3697, June 15, 1968
- **DOI / URL**: 10.1029/JB073i012p03661
- **受理**: 1968-01-02
- **所属**: Lamont Geological Observatory, Columbia University（現所属 CNEXO, Paris）
- **取得経路**: `https://www.geologie.ens.fr/50years_plate_tectonics/j-geophys-res-1968-le-picho.pdf`（curl -k で TLS 検証をスキップして取得）
- **Lamont Geological Observatory Contribution** 1197

## 2. 要旨（読んだ内容に基づく）

Le Pichon は Morgan (1968) が提起した「地球表面は少数の剛体ブロックに分割され、その相対運動は球面上の回転で記述される」という仮説を受け、地球表面全体を **6 つの大ブロック**（Pacific, America, Antarctica, Africa, Eurasia, India）に単純化したモデルで世界の表面運動の全体像を構築した。5 つの主要な拡大系（Arctic, Atlantic, Indian, South Pacific, North Pacific）について、transform fault の走向と拡大速度から最小二乗法で回転極を推定し、ブロック境界 37 箇所における differential motion ベクトル（拡大・圧縮・横ずれ）を計算。さらに Cenozoic（約 6500 万年前以降）の拡大史を 3 期（Mesozoic, early Cenozoic, late Cenozoic）に分け、スプレッディングの episodic な性質を議論している。結論部では、少数の剛体ブロックの相対運動で地表運動が global に consistent に記述できることを確認し、Elsasser/McKenzie/Morgan/Oliver-Isacks の tectosphere（リソスフェア）モデルを支持する。

## 3. 主要主張（原文引用付き）

### 主張 1: 地球表面は 6 つの大ブロックで表現できる

> "Second, we adopt a simple earth model consisting of six large rigid blocks. Using the parameters obtained in the first part, we obtain the vectors of differential motion between blocks along all the boundaries. The picture obtained is in reasonable agreement with physiographic, seismic, and geological data." (p.3662)

Morgan が約 20 個としたブロック数を大胆に簡約し、Pacific, America, Antarctica, Africa, Eurasia, India の 6 大ブロックに集約した。この簡約はブロック数の自由度と観測データの拘束条件のバランスを取るためのものであり、"It is important to realize that the number of blocks is chosen in such a way that the problem can be solved." (p.3676) と明記されている。

### 主張 2: 拡大運動は単一の回転で近似できる

> "We first show that the opening of the South Pacific, the Atlantic, the Arctic, the North Pacific, and the Indian oceans can each be described by a single rotation. The parameters of these rotations are obtained." (p.3662)

5 つの主要な拡大系それぞれについて、(1) transform fault の方位と (2) 拡大速度という 2 つの独立なデータから最小二乗法で回転極の位置と角速度を決定。Table 2 に 5 系統の回転極が列挙され、例えば Atlantic（America-Africa）は 58°N, 37°W（fracture zone 方式）/ 69°N, 32°W（spreading rate 方式）で近似されている。

### 主張 3: 境界 37 箇所の differential motion が計算可能

> "Tables 2 and 4 were used to compute the vectors of differential movement at 37 locations along the boundaries of the six blocks. The results are shown in Figure 6 and listed in Table 5." (p.3676)

Table 5 は、Kurile Trench, Japan Trench, New Guinea, Tonga Trench, Peru Trench, Aleutian Trench, Himalayas, Azores, Gibraltar, Sicily, Crete, Java Trench など世界の主要変動帯における相対運動の方向・大きさ・方位を数値化する。圧縮 5 cm/yr 超（Himalayas 5.6 cm/yr, Java 6.0 cm/yr）、拡大（Indian Ridge 5.8 cm/yr）、横ずれ（Aleutian 1.6 cm/yr）など多様な境界が統一された枠組みで扱われる。

### 主張 4: 運動様式と境界タイプには速度相関がある

> "...zones of folding and compression have differential rates of motion smaller than about 6 cm/yr, whereas active trenches (zones of thrust) have differential rates larger than 5 cm/yr... Finally, it should be noted that along the Pacific borders the main system of trenches has been a western system since latest Miocene time." (p.3679-3680)

圧縮/褶曲帯（Alpine-Himalayan など）は < 6 cm/yr、活動的な海溝は > 5 cm/yr という速度閾値が観察される。さらに速度が 8-9 cm/yr を超えると系が **2 つの平行な海溝系** に decouple する傾向が指摘される。

### 主張 5: Cenozoic の拡大は 3 期のエピソードに分かれる

> "We have attempted to apply this concept to obtain a reconstruction of the history of spreading during Cenozoic time. Three main episodes of spreading are recognized—late Mesozoic, early Cenozoic, and late Cenozoic. The beginning of each cycle of spreading is marked by the reorganization of the global pattern of motion." (p.3693)

スプレッディングは等速ではなく episodic で、各サイクルの開始が global な運動パターンの再編と同期し、これが造山運動（orogenic paroxysm）と相関する。Ewing et al. (1968) の堆積物分布データと整合的。

### 主張 6: 結論 — 少数の剛体ブロックで地球運動を global に記述できる

> "Morgan [1968] has suggested that the surface of the earth can be approximated by a small number of rigid blocks in relative motion with respect to each other. This assumption has been confirmed by a geometrical analysis of the data on sea-floor spreading. In accordance with this concept, we have given a simplified but complete and consistent picture of the global pattern of surface motion. We have shown that all movements are interrelated, so that no spreading mid-ocean ridge can be understood independently of the others. Thus any major change in the pattern of spreading must be global." (p.3693)

"all movements are interrelated" という主張は本論文の本質。個々の海嶺・海溝を局所現象としてではなく、**global な幾何学的拘束条件を満たす相互依存系** として扱う視座を確立した。さらに Elsasser, McKenzie, Morgan, Oliver-Isacks の tectosphere モデル（厚さ数十 km の剛体リソスフェアが弱い asthenosphere の上を滑る）を支持すると結論する。

## 4. 方法論

Le Pichon の分析手順は明確に構造化されている:

1. **最小二乗法による回転極決定**: 5 つの拡大系それぞれについて、(a) transform fault の方位から、(b) 正規化拡大速度から、2 方式で回転極を独立に推定。両者の一致度が単一回転による近似の妥当性を示す（Table 2 の standard deviation: 0.058-0.096 は非常に小さい）
2. **球面幾何の vector composition**: Morgan の Euler 回転定理を使い、例えば America-Antarctica の回転ベクトルを Pacific-Antarctica, America-Pacific, Africa-America, India-Africa の合成として計算（p.3676）
3. **回路閉合の自己整合性検証**: 過剰決定系（overdetermined system）として、例えば Indian Ocean の拡大が計算結果から拡大であるべき（圧縮ではない）という予測と実データの一致を確認
4. **Cenozoic 再構築**: 磁気異常 pattern の相対年代スケール（Pitman 1967, Heirtzler et al. 1968）と、Heirtzler et al. (1968) の絶対時間スケール（Vine 1966 の一定速度仮定）を用いて、過去 80 m.y. の拡大速度変化を復元
5. **付録の数値方法**: center of rotation 決定の最小化アルゴリズム（fracture zone 方位残差二乗和の最小化、spreading rate 残差二乗和の最小化）を Appendix に明示

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | spreading 以前の均一地殻（asthenosphere 上の tectosphere）。明示的な「場」としての記述は弱い | 弱 | "supports... the model of a rigid and mobile lithosphere (tectosphere) several tens of kilometers thick on top of a weak asthenosphere" (p.3693) |
| 2 波 (Wave) | 中央海嶺での新地殻の連続的生成。海嶺から離れるにつれ生成される地殻の「波紋」 | 中 | "new crustal material may be added" (p.3661); 拡大速度 0.95-6 cm/yr で連続的に地殻が拡散 (Table 1) |
| 3 縁 (Relation) | ブロック境界の 3 種類（rise, trench, fault）と 37 箇所の differential motion。海嶺と海溝の相互変換（Carlsberg ridge が Himalayan sink へ vector 変換） | 強 | "The pattern of movement... is consequently controlled not only by the directions of the driving stress pattern and the locations of zones of weakness where crust may part but also by the locations of the major sinks." (p.3679); Table 5 全体 |
| 4 渦 (Vortex) | 6 大ブロックが独立した rotational vortex として球面上を運動する構造。Euler 回転軸が各ブロックの「個」を定める | 強 | "The parameters of rotation adopted for the calculation of the movements of the different blocks are underlined in the table." (p.3665); Table 4 全体 |
| 5 束 (Bundle) | "all movements are interrelated" — 全ブロック運動が global な相互依存系として閉じている。個別の海嶺は全体の一部として統合される | 中 | "all movements are interrelated, so that no spreading mid-ocean ridge can be understood independently of the others. Thus any major change in the pattern of spreading must be global." (p.3693) |

**判定基準**:
- Stage 3, 4 を「強」とした。ブロック境界の多様な interaction（Table 5 の 37 種類）と 6 大ブロックの独立回転極（Table 4）が、それぞれ「関係の生成」「自立した運動体の立ち上がり」に構造的に対応する。
- Stage 5 を「中」とした。"interrelated" "global" という語彙は束の統合に近いが、著者は力学的統合として論じており、創発的な全体性を主張しているわけではない。
- Stage 2 を「中」とした。新地殻生成と拡大は確かに「差異化の伝播」として読めるが、著者は波動現象として論じていない。
- Stage 1 を「弱」とした。tectosphere/asthenosphere の記述はあるが、「場としての未分化性」を論じる文脈ではない。

## 6. 限界・留意事項

- 1968 年の論文で、現代のプレートテクトニクス理論（プレート数 15 前後、境界詳細分類、マントル対流の 3D 解析）とは異なる。例えば Nazca, Cocos, Philippine, Caribbean などは独立プレートとして扱われておらず、本論文では Pacific または America ブロックの一部とされる
- 著者自身が次の限界を認めている:
  - 南西/南東 Indian Ocean Ridge の 2 つの回転は「不明（unknown）」で計算から導出している (p.3676)
  - Mediterranean 境界は「arbitrary」で複数の圧縮帯の合成（p.3679）
  - Caribbean 周辺の運動は「ignored」で、Lesser Antilles trench に対する small difference として扱われる (p.3679)
  - India Ocean 中央海嶺の axial magnetic pattern は拡大仮説で解釈できないため除外（p.3664）
- Cenozoic 再構築の絶対時間スケールは Vine (1966) の拡大速度一定仮定に依存し、再構築 3 期の境界年代には数 m.y. の不確かさがある
- 5段階との対応は力学的構造の類似に留まり、Le Pichon 自身は「創造過程」を論じていない

## 7. 未読解セクション（部分読解の場合）

- pp.6-14: South Pacific, Atlantic, Indian の各海域の個別解析（spreading rate 分布、fracture zone azimuth の詳細）
- pp.21-32: North Pacific, Arctic の個別解析、および Cenozoic 再構築の詳細（磁気異常 pattern の領域別解析）

主要主張・方法論・結論・Cenozoic 再構築の要約・Conclusion・Appendix・References は読了。未読部は個別海域の数値的詳細であり、全体の論旨と 5 段階対応評価に影響しない。
