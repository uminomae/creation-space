# Increasing Returns and Economic Geography

**source_id**: D21-S13 | **domain_id**: D21
**access_status**: url-verified
**読解日**: 2026-06-22 | **読解者**: Claude Sonnet 4.6
**読解方法**: curl → NBER PDF保存（w3275.pdf）→ Read (PDF, 全26ページ)
**原典ページ数**: 26 | **読解ページ範囲**: 全文（pp.1-26）

---

## 1. 書誌情報

- **著者**: Paul Krugman
- **タイトル**: Increasing Returns and Economic Geography
- **出典**: *Journal of Political Economy* 99(3), 483-499. 1991
- **DOI / URL**: 10.3386/w3275 / OA (NBER Working Paper #3275): https://www.nber.org/system/files/working_papers/w3275/w3275.pdf

**書誌クロスチェック (cs#250 規律2)**: PDF タイトルページ "NBER Working Paper #3275 / March 1990 / INCREASING RETURNS AND ECONOMIC GEOGRAPHY / Paul Krugman / Department of Economics, MIT" を確認。発行誌（JPE）は本 NBER ワーキングペーパーの最終出版版（1991）の前版。著者・タイトルが manifest 行と一致。同定 OK。

---

## 2. 要旨（読んだ内容に基づく）

「なぜ製造業は特定の地域に集中するのか」という経済地理の根本問題を、収穫逓増と輸送費の相互作用という枠組みで形式化した論文。著者は Dixit-Stiglitz (1977) 型の独占的競争フレームワークを採用し、2地域・2部門（農業＝定数収益・輸送費ゼロ、製造業＝収穫逓増・輸送費あり）の一般均衡モデルを構築する。

核心的発見は「循環的因果 (circular causation)」の存在である。製造業者は大きな市場に立地しようとし、大きな市場は多くの製造業者を引きつける——この相互強化が、特定のパラメータ条件下で地域分岐（一地域への集中）を均衡として生み出す。収束（均等立地）か分岐（集中）かは、(1) 製造業消費割合 μ、(2) 代替弾力性 σ（規模の経済の逆指標）、(3) 輸送費 τ の3パラメータが決定する「位相境界（phase boundary）」によって規定される。

この「循環的因果・歴史依存・相転移」のメカニズムは、経済地理の中心部-周辺部パターンを、テクノロジー外部経済などに依拠せず、個人の利潤最大化行動と市場構造から純粋に導出する点で画期的であった。

---

## 3. 主要主張（原文引用付き）

### 主張 1: 経済地理は主流経済学で軽視されてきた

> "The study of economic geography -- of the location of factors of production in space -- occupies a relatively small part of standard economic analysis." (p.1)

> "The result is that discussions of economic geography have historically tended to rely either on logically incomplete models or on verbal discussion in which models are at best implicit." (p.2)

収穫逓増が不完全競争を含意し、数理化が困難だったことが放置の原因と著者は論じる。

### 主張 2: 地域分岐のメカニズム——循環的因果

> "A region with a relatively large nonrural population will be an attractive place to produce both because of the large local market and because of the availability of the goods and services produced there; this will attract still more population, at the expense of regions with smaller initial production; and the process will feed on itself until the whole of the nonrural population is concentrated in a few regions." (p.7)

> "What we will see is that it is possible to develop a very simple model of regional divergence based on the interaction of economies of scale with transportation costs." (p.3)

### 主張 3: 位相境界——収束か分岐かを決める臨界条件

> "Thus the geography will go through a kind of change of state when the index crosses a critical level, much as water changes its qualitative behavior when the temperature goes from a little above to a little below freezing." (p.7)

> "When ν<1, it is unprofitable for a firm to begin production in region 2 if all other manufacturing production is concentrated in region 1. Thus in this case regional divergence is the long-run equilibrium." (p.18)

分岐の条件は ν = (1/2)r^{μσ}[(1+μ)r^{σ-1}+(1-μ)r^{-(σ-1)}] < 1 で与えられ、低輸送費・高製造業割合・強い規模の経済が分岐を促進する。

### 主張 4: 歴史依存性と「無作為な対称性の破れ」

> "Second, the details of the geography that emerges -- which regions end up with the population -- depend sensitively on initial conditions. If one region has slightly more population than another when, say, transportation costs fall below some critical level, that region ends up gaining population at the other's expense; had the distribution of population at that critical moment been only slightly different, the roles of the regions might have been reversed. Again to use a physical analogy, this is a 'random broken symmetry': like ice crystallizing as water is cooled, the detailed structure depends on possibly small accidents of early history." (p.7)

歴史の偶発的な初期条件が、均衡選択に決定的影響を与えることを明示する。

### 主張 5: 多地域への拡張——中心地と後背地の階層

> "Consider, then, the economy shown in Figure 4. It contains six regions, laid out in a circle... What will long-run equilibrium look like in this model? Obviously one possibility is that manufactures production will be evenly spread among the six regions. A second possibility is the reverse: that all manufactures production will concentrate in a single 'metropolis'." (p.23)

2地域モデルを6地域の環状配置に拡張し、中心都市・後背地の階層構造が自然発生的に生じることを示す。

---

## 4. 方法論

- **理論モデル（一般均衡）**: Dixit-Stiglitz (1977) 型独占的競争フレームワーク
- **2地域・2部門モデル**: 農業（定数収益、農地に縛られた）+ 製造業（収穫逓増、移動可能）
- **3パラメータ分析**: μ（製造業消費割合）、σ（代替弾力性＝規模の経済の逆指標）、τ（輸送費）
- **位相境界の解析的導出**: ν 関数の偏微分によって「収束vs分岐」の臨界条件を解析的に特徴づけ
- **数値計算**: 解析が困難な部分は数値計算（Fig.1, Fig.3）で補完

---

## 5. cs 5段階モデルとの対応

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | 農業が均一に分散した「フィーチャレス平原」の初期状態——まだ製造業集積が形成されていない中立的な場——が「漂う」状態に対応 | 中 | "one might idealize the distribution of this first stratum by imagining it uniformly spread across a featureless plain" (p.5) |
| 2 波 (Wave) | 輸送費が臨界値を下回ったときの循環的因果の発火——小さな初期差が増幅される揺れ——が「分離・対立」に対応 | 強 | "small changes in the parameters of the economy may have large effects on its qualitative behavior... the process will feed on itself" (p.7) |
| 3 縁 (Relation) | 「位相境界（phase boundary）」——収束と分岐を分ける臨界曲線——が縁（境界・関係が生まれる場所）に強く対応 | 強 | "the parameters define a sort of 'phase boundary'; the geography of economies that lie on one side of that boundary will evolve in a fundamentally different way from that of economies that lie on the other side" (p.3) |
| 4 渦 (Vortex) | 製造業が一地域に集中した長期均衡（regional divergence equilibrium）——自己組織的に一つのまとまりとして立ち上がる——が渦に対応 | 強 | "When ν<1... regional divergence is the long-run equilibrium" (p.18) |
| 5 束 (Bundle) | 多地域の中心都市ネットワーク（中心地＋後背地の階層的構造）——複数の渦が影響し合い方向性のある構造として残る——が束に対応 | 弱 | "one metropolis in region 1, but a second one in region 4. Each of these metropolises has a 'hinterland' of two rural regions" (p.23) |

**cross-check 知見**: 本論文の「循環的因果 → 位相境界での相転移 → 一地域への集中均衡」という過程は、cs 5段階の「場（均一分散）→ 波（不均衡の増幅）→ 縁（臨界点での分岐）→ 渦（集中均衡の立ち上がり）」に構造的に強対応する。特に「位相境界」概念は cs の縁（境界で起きる出来事）に最も明快に対応する。歴史依存性・初期条件感受性（偶発的対称性の破れ）は、創造プロセスにおける「最初の小さな揺れが運命を決める」という洞察に接続できる。

---

## 6. 限界・留意事項

- **高度な抽象化**: 農業輸送費ゼロ・Samuelson iceberg 型輸送費など強い単純化を含む。著者も「highly special model」と認める（p.22）
- **動態の欠如**: モデル自体に明示的な動態はなく、短期・長期均衡の比較静学。均衡への収束過程は簡略化された形でのみ論じられる
- **創造・知識創出への直接言及なし**: 問題設定は産業立地の経済学であり、「創造プロセス」の記述ではない。5段階との対応は構造的類似の判定

---

## 7. 未読解セクション

なし（全26ページを読了。Section 1–5・Conclusion・References を全てカバー）。

---

## 関連

- **D21-S04** Hayek (1945) — 分散した知識の問題（本論文の市場集積とは逆方向の非集中化論）
- cs 5段階 schema: `knowledge/schema/five-stages.md`
- 領域サマリ: `knowledge/source-notes/D21/D21-summary.md`
