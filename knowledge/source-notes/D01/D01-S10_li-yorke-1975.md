# Period Three Implies Chaos

**source_id**: D01-S10 | **domain_id**: D01
**access_status**: url-verified
**読解日**: 2026-04-13 | **読解者**: Claude Opus 4.6 (1M context)
**読解方法**: WebFetch (URL) → PDF バイナリをローカル保存 → Read (PDF image mode)
**原典ページ数**: 8 (pp.985–992) | **読解ページ範囲**: 1–8（全ページ読了）

---

## 1. 書誌情報

- **著者**: Tien-Yien Li, James A. Yorke
- **タイトル**: Period Three Implies Chaos
- **出典**: *The American Mathematical Monthly*, Vol. 82, No. 10 (December 1975), pp. 985–992
- **DOI / URL**: https://www.its.caltech.edu/~matilde/LiYorke.pdf （JSTOR stable: jstor.org/stable/2318254）
- **出版者**: Mathematical Association of America

## 2. 要旨（読んだ内容に基づく）

本論文は区間上の連続写像 F: J → J が有限差分方程式 x_{n+1} = F(x_n) として反復された場合に、周期 3 の点が存在するという条件だけから、(i) 任意の周期 k = 1, 2, 3, ... を持つ周期点が存在すること、(ii) 周期点を含まない「非可算集合 S ⊂ J」が存在し、この集合の任意の 2 点は互いに離れたり近づいたりして漸近的周期性を持たないこと（= "chaotic" な振る舞い）、という 2 点を示す。証明は連続性と中間値定理から得られる初等的な補題（Lemma 0, 1, 2）のみを用い、測度論や滑らかさを必要としない。論文は「周期 3 → すべての周期 + 非周期軌道」という単一命題（Theorem 1）に集中し、Lorenz（流体）、個体群動態、ロジスティック写像などの応用例を文脈として提示する。Theorem 2 として、ほぼ至るところ密度 g(x) の存在を保証する先行結果を引用する。Appendix 1 は「周期 5 は周期 3 を含意しない」反例、Appendix 2 は T2（非可算集合 S の存在）の詳細証明を与える。

## 3. 主要主張（原文引用付き）

### 主張 1: 差分方程式 x_{n+1}=F(x_n) は複雑な生物学・物理現象の単純モデルである

> "The way phenomena or processes evolve or change in time is often described by differential equations or difference equations. One of the simplest mathematical situations occurs when the phenomenon can be described by a single number..." (p.985)

論文の冒頭で著者は、単一変数反復 F: J → J が人口動態（ロジスティック方程式 (1.2) x_{n+1} = r x_n [1 − x_n/K]）や昆虫個体群（Utida [10]、Oster et al. [14, 15]）の文脈で使われてきたことを示し、これが単純でありながら複雑な挙動を持ちうることを強調する。

### 主張 2: Theorem 1 — 周期 3 の点が存在すれば、全周期の周期点が存在し、かつ非可算な "カオス" 集合が存在する

> "Theorem 1. Let J be an interval and let F: J → J be continuous. Assume there is a point a ∈ J for which the points b = F(a), c = F^2(a) and d = F^3(a), satisfy d ≤ a < b < c (or d ≥ a > b > c)." (p.987)

> "T1: for every k = 1, 2, ... there is a periodic point in J having period k. Furthermore, T2: there is an uncountable set S ⊂ J (containing no periodic points), which satisfies the following conditions: (A) For every p, q ∈ S with p ≠ q, lim sup_{n→∞} |F^n(p) − F^n(q)| > 0 and lim inf_{n→∞} |F^n(p) − F^n(q)| = 0. (B) For every p ∈ S and periodic point q ∈ J, lim sup_{n→∞} |F^n(p) − F^n(q)| > 0." (p.987)

この定理が論文の中心命題である。仮説 d ≤ a < b < c は「周期 3 の点」の存在より弱く、周期 3 の存在は仮説を満たす（Remarks, p.987）。T2(A) は S 内の任意の 2 軌道が「無限回近づく」かつ「無限回離れる」という振る舞い、T2(B) は S の点が周期軌道に漸近しないことを意味する。

### 主張 3: Theorem 1 の証明は 3 つの初等的補題のみで構成される

> "Lemma 0. Let G: I → R be continuous, where I is an interval. For any compact interval I_1 ⊂ G(I) there is a compact interval Q ⊂ I such that G(Q) = I_1." (p.987)

> "Lemma 1. Let F: J → J be continuous and let {I_n}_{n=0}^∞ be a sequence of compact intervals with I_n ⊂ J and I_{n+1} ⊂ F(I_n) for all n. Then there is a sequence of compact intervals Q_n such that Q_{n+1} ⊂ Q_n ⊂ I_0 and F^n(Q_n) = I_n for n ≥ 0. For any x ∈ Q = ∩ Q_n we have F^n(x) ∈ I_n for all n." (p.987)

> "Lemma 2. Let G: J → R be continuous. Let I ⊂ J be a compact interval. Assume I ⊂ G(I). Then there is a point p ∈ I such that G(p) = p." (p.988)

証明は Smale の "horseshoe example" における「区間の区間への写像を追跡する」手法に類似する（p.988, [13] 参照）。

### 主張 4: 漸近的に周期的な点と Lorenz 型写像（カスプ写像）の対比

> "We do not know when values of a begin to occur for which F in (3.1) has points which are not asymptotically periodic." (p.989)

> "For such a function every periodic point is 'unstable' since for x near a periodic point y of period k, the kth iterate F^k(x) is further from y than x." (p.989)

F(x) = a x (1 − x) のロジスティック族（§3, eq.(3.1)）では、小さい a で「ほぼすべての点が漸近的周期」だが、a を大きくすると非漸近的周期の点が出現する。Lorenz の連続微分可能写像（図 2、テント型に近い）では |dF/dx| > 1 が成り立ち、全周期点が不安定になる。この対比が Theorem 2（§4）の動機になる。

### 主張 5: Theorem 2 — 3 条件を満たす F については密度関数 g と不変測度が存在する（引用定理）

> "Theorem 2. [5]. Let F: J → J satisfy the following conditions: 1) F is continuous. 2) Except at one point t ∈ J, F is twice continuously differentiable. 3) F satisfies (4.1). Then there exists a function g: J → [0, ∞), such that for almost all x ∈ J, g is the density of x. Also for almost all x ∈ J, L(x) = {y: g(y) > 0} which is an interval. Moreover, the set J_∞ = {y: g(y) > 0} is an interval, and L(x) = J_∞ for almost all x." (p.990)

これは Lasota-Yorke（[5]）の先行結果の引用であり、Theorem 1 の反復挙動の「統計的な規則性」側を補完する。Theorem 1 が個別軌道の不規則性、Theorem 2 が統計的分布の規則性を保証する、という 2 層構造で論文は構成されている。

## 4. 方法論

- **道具**: 区間 J 上の連続写像の反復 F^n、中間値定理、コンパクト性
- **証明技法**: 区間の系列 {I_n} に対して、各 I_n に写る先行区間 Q_n の入れ子列を構成し、その共通部分に不動点を取る（Lemma 1, 2 の組み合わせ）
- **T1 の証明**: 任意の k について、K = [a, b], L = [b, c] の 2 区間に対し、「L, L, ..., L, K, L（長さ k）」の反復パターンで I_n を定義し、Lemma 1 から共通部分 Q に属する点 p_k が F^{k−1}(p_k) = b, F^k(p_k) ∈ K を満たすことを示す。このとき p_k は真の周期 k を持つ
- **T2 の証明**（Appendix 2）: 無数の sequence M' ∈ M_0 を構成し、各列に対応する点 x_r を ∩ Q_n に取る。各点は「Q のうち K か L かを可算列として追跡した履歴」で区別されるので非可算
- **Appendix 1 の反例**: F(1)=3, F(2)=5, F(3)=4, F(4)=2, F(5)=1 で区間上に線形に拡張した写像が「周期 5 を持つが周期 3 を持たない」ことを、F^3 の不動点が [3, 4] 区間内に唯一存在することを示して証明する

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | 連続写像 F: J → J と区間 J — 「単一変数の反復」という最小構造 | 弱 | "the phenomenon can be described by a single number" (p.985) |
| 2 波 (Wave) | 周期 2 の出現（Appendix 1 の例で a ∈ (3, 1+√6) での周期 2 の生成）、および d ≤ a < b < c の条件による「反転と復帰」の幾何 | 弱 | "there are two points of period 2 which we may call p and q" (p.989) |
| 3 縁 (Relation) | 「周期 3 の存在 → 全周期の存在」という境界条件。K = [a, b] と L = [b, c] の境界 b を介した相互作用（Lemma 1 の入れ子構成） | 強 | "let {I_n} be the sequence of intervals I_n = L for n = 0, ..., k−2 and I_{k−1} = K" (p.988) |
| 4 渦 (Vortex) | 非可算カオス集合 S の立ち上がり — 周期軌道に吸収されない「個」の群 | 強 | "there is an uncountable set S ⊂ J (containing no periodic points), which satisfies ..." (p.987) |
| 5 束 (Bundle) | Theorem 2 が保証する密度 g と不変測度 — 個別軌道は不規則だが統計分布は一意的にまとまる（引用定理のため著者の寄与ではない） | 弱 | "g is the density of x. Also for almost all x ∈ J, L(x) = {y: g(y) > 0} which is an interval" (p.990) |

**判定の根拠**:
- **強** と判定した Stage 3, 4 は、論文の中心主張 Theorem 1 そのものに対応する。Stage 3 は「境界 b を介した K と L の入れ子関係」という論文の証明構造に直結し、Stage 4 は「非可算カオス集合の創発」という主結果 T2 に直結する
- **弱** と判定した Stage 1, 2, 5 は、論文が明示的に 5 段階モデルを意図していないため。Stage 5 は Lasota-Yorke の引用結果であり、本論文のオリジナル寄与ではないことに留意

**注意**: 全 5 段階に形式的対応を当てはめたが、Stage 1, 2, 5 は「構造的読み替え」であり、Li-Yorke の意図そのものではない。本 wiki を evidence に使う際は Stage 3, 4 の対応のみを強い根拠として扱うこと。

## 6. 限界・留意事項

- 本論文は **区間上の 1 次元連続写像** を扱う。高次元系（ストレンジアトラクタ）や滑らかな力学系一般への拡張は別問題
- Theorem 1 の T2 は「chaotic な非可算集合 S が存在する」ことを保証するが、**S の測度**（ルベーグ測度で正か 0 か）については何も言わない。観測可能な "カオス" かどうかは別途議論が必要
- 論文は「chaos」という語を数学的定義語として固定しているのではなく、Lorenz [1] の文脈を受けた比喩的語彙として導入している（§1 末尾 "... which retained some of the chaotic aspects of the original flow"）
- Appendix 1 が示すように、「周期 3」は「全周期」を含意するが、逆は成立しない。Sharkovsky の順序（より強い結果）への言及はない（1975 年時点では Sharkovsky 1964 の英訳が普及していなかった可能性を示唆）
- Theorem 2 は本論文の定理ではなく **[5] Lasota-Yorke 先行研究** の引用である旨、明示されている

## 7. 未読解セクション

全ページ読了（pp.985–992, Appendices 1, 2 含む）。
