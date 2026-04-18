# Social Capital in the Creation of Human Capital

**source_id**: D18-S11 | **domain_id**: D18
**access_status**: url-verified
**読解日**: 2026-04-13 | **読解者**: Claude Opus 4.6 (1M context)
**読解方法**: WebFetch (URL) → PDF バイナリ保存 → Read (PDF image mode)
**原典ページ数**: 26 (pp.S95–S120) | **読解ページ範囲**: S95–S103（Abstract・序論・Social Capital 定義・Forms 冒頭）+ S113–S120（経験的分析終盤・Public Goods・Conclusion・References） — 中間の詳細セクション（Information Channels, Norms, 個別実証セクションの前半）は抜粋のみ

---

## 1. 書誌情報

- **著者**: James S. Coleman (University of Chicago)
- **タイトル**: Social Capital in the Creation of Human Capital
- **出典**: *American Journal of Sociology*, Vol. 94, Supplement: Organizations and Institutions – Sociological and Economic Approaches to the Analysis of Social Structure (1988), pp. S95–S120
- **DOI / URL**: https://www.jstor.org/stable/2780243
- **謝辞**: Mark Granovetter, Susan Shapiro, Christopher Winship への批判に対する謝辞

## 2. 要旨（読んだ内容に基づく）

Coleman は社会学と経済学の 2 つの知的潮流—— (a) 社会的アクターを norm/rule/義務で形成された「過剰社会化」された存在と見る社会学的伝統、(b) 自己利益で独立に行動する rational actor と見る経済学的伝統——の双方に欠陥があると指摘し、両者を統合する道具として「social capital（社会関係資本）」概念を導入する。Coleman の定義では、social capital は「個体」ではなく「アクター間の関係構造」に宿る資源であり、(1) 義務・期待と信頼性（obligations, expectations, and trustworthiness of structures）、(2) 情報チャネル（information channels）、(3) 有効な規範（norms）の 3 つの形態を取る。論文の後半では "High School and Beyond" データセットを用い、家族内の社会関係資本（親の存在、母親の進学期待、兄弟数、引越し回数など）と家族外の社会関係資本（カトリック校や宗教系私立校の community closure）が、高校中退率を有意に低下させることを実証する。最終節で、social capital の多くは「公共財」としての性質を持ち、個人が享受する便益を内部化できないため「過少投資」が起きやすい、と結論する。

## 3. 主要主張（原文引用付き）

### 主張 1: 社会学と経済学の二潮流は、どちらも単独では action を説明できない

> "The sociological stream has what may be a fatal flaw as a theoretical enterprise: the actor has no 'engine of action.' The actor is shaped by the environment, but there are no internal springs of action that give the actor a purpose or direction." (p.S96)

> "The economic stream, on the other hand, flies in the face of empirical reality: persons' actions are shaped, redirected, constrained by the social context; norms, interpersonal trust, social networks, and social organization are important in the functioning not only of the society but also of the economy." (p.S96)

Coleman は両潮流の欠点を鏡像的に対置し、両方を統合する枠組みが必要だと主張する。これが social capital 導入の動機。

### 主張 2: social capital は「関係構造」に宿る — 個人やモノではない

> "Social capital is defined by its function. It is not a single entity but a variety of different entities, with two elements in common: they all consist of some aspect of social structures, and they facilitate certain actions of actors—whether persons or corporate actors—within the structure." (p.S98)

> "Unlike other forms of capital, social capital inheres in the structure of relations between actors and among actors. It is not lodged either in the actors themselves or in physical implements of production." (p.S98)

Coleman の定義は「機能による定義」であり、形態の多様性（義務、情報、規範）を許容する。個体にも物にも還元されない、関係内在的な資源という性格づけが革新的。

### 主張 3: social capital の 3 形態 — obligations, information channels, norms

> "Obligations, Expectations, and Trustworthiness of Structures. If A does something for B and trusts B to reciprocate in the future, this establishes an expectation in A and an obligation on the part of B. This obligation can be conceived of as a credit slip held by A for performance by B." (p.S102, §Forms of Social Capital)

> "This form of social capital depends on two elements: trustworthiness of the social environment, which means that obligations will be repaid, and the actual extent of obligations held." (p.S102)

3 形態のうち本 wiki が実際に引用読了できたのは第 1 形態（義務・期待・信頼性）のみ。第 2 形態（情報チャネル）と第 3 形態（規範）の原文引用は未読（§7 参照）。Cairo の El Khalili 市場（p.S99）や ニューヨークの Diamond 市場（p.S98）の事例が義務構造の具体例として挙げられる。

### 主張 4: closure（閉鎖性）が社会関係資本の機能を支える

> "The social capital that has value for a young person's development does not reside solely within the family. It can be found outside as well in the community consisting of the social relationships that exist among parents, in the closure exhibited by this structure of relations, and in the parents' relations with the institutions of the community." (p.S113, §Social Capital outside the Family)

"Closure" とは、親同士が互いに知り合い、子の社会関係が世代間で閉じていること。カトリック校や宗教系私立校では、親 - 親 - 教会 - 学校のネットワークが閉じているため、子の中退率を押し下げる効果が出る。

### 主張 5: 経験的実証 — 中退率は family/community social capital に強く依存

> "The results of these comparisons are shown in table 2. Item 1 of the table shows that the dropout rates between sophomore and senior years are 14.4% in public schools, 3.4% in Catholic schools, and 11.9% in other private schools. What is most striking is the low dropout rate in Catholic schools. The rate is a fourth of that in the public schools and a third of that in the other private schools." (p.S114)

> "Item 3 of table 2 shows that their [religious private schools'] dropout rate is lower, 3.7%, essentially the same as that of the Catholic schools." (p.S115)

High School and Beyond データセットを logistic regression で分析。家族内要因（両親同居、兄弟数、母の期待、引越し回数）に加え、学校の宗教的コミュニティ基盤が強い効果を持つ。特に引越し回数（"number of moves since grade 5"）の係数は "10 times its standard error" で、モデル中最強の予測因子（p.S113）。

### 主張 6: social capital は公共財 — 過少投資が構造的に生じる

> "The public goods quality of most social capital means that it is in a fundamentally different position with respect to purposive action than are most other forms of capital. ... This social capital arises or disappears without anyone's willing it into or out of being and is thus even less recognized and taken account of in social action than its already intangible character would warrant." (p.S118)

> "There are important implications of this public goods aspect of social capital that play a part in the development of children and youth. Because the social structural conditions that overcome the problems of supplying these public goods—that is, strong families and strong communities—are much less often present now than in the past, and promise to be even less present in the future, we can expect that, ceteris paribus, we confront a declining quantity of human capital embodied in each successive generation." (p.S118)

social capital の主要形態は「それを作り出す actor 自身が便益の一部しか獲得できない」ため、rational actor モデルの下では構造的に過少投資される。これが家族と地域社会の弱体化を伴う現代社会の構造的課題として提示される。

### 主張 7: 結論 — 三形態の整理と公共財性

> "In explicating the concept of social capital, three forms were identified: obligations and expectations, which depend on trustworthiness of the social environment, information-flow capability of the social structure, and norms accompanied by sanctions. A property shared by most forms of social capital that differentiates it from other forms of capital is its public good aspect: the actor or actors who generate social capital ordinarily capture only a small part of its benefits, a fact that leads to underinvestment in social capital." (p.S119, Conclusion)

論文の結論要約。本 wiki で原文引用できた論点がここに集約されている。

## 4. 方法論

- **理論戦略**: rational action の原理は保持しつつ、social context を内生的に組み込む「折衷的だが整合的」な枠組みを目指す（p.S97）
- **概念導入**: 定義を「機能」で行い、形態の多様性を許容する（economic capital の類比）
- **実証戦略**: "High School and Beyond" 全米学校サンプルの logistic regression。従属変数は高校中退の有無（sophomore → senior）。独立変数は family/community の social capital 指標（両親同居、兄弟数、母の期待、引越し回数、学校タイプ）
- **反証戦略**: 宗教系私立校 vs. 非宗教系私立校の比較によって、「closure による効果」を religious affiliation から分離する

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | individual actors が漂う「関係の未結合状態」 — rational action のみの世界 | 弱 | "having a principle of action, that of maximizing utility" (p.S95) |
| 2 波 (Wave) | 義務と期待の往復 (A → B, B → A) — credit slip の揺動 | 弱 | "this establishes an expectation in A and an obligation on the part of B" (p.S102) |
| 3 縁 (Relation) | 関係構造そのもの — Coleman の social capital は「関係」に内在する | 強 | "social capital inheres in the structure of relations between actors and among actors" (p.S98) |
| 4 渦 (Vortex) | closed community の立ち上がり — intergenerational closure による自律的構造 | 強 | "intergenerational closure ... the closure exhibited by this structure of relations" (p.S113) |
| 5 束 (Bundle) | human capital の創出 — social capital が束ねられて次世代の能力に結晶化 | 強 | "social capital in the family is a resource for education of the family's children, just as is financial and human capital" (p.S113) |

**判定の根拠**:
- **強** と判定した Stage 3, 4, 5 は Coleman の論旨の中核に対応する。Stage 3 は「関係に内在する資源」という社会関係資本の定義そのもの、Stage 4 は closure 概念、Stage 5 は human capital 創出の最終帰結
- **弱** と判定した Stage 1, 2 は、論文の議論構造を創造モデルに読み替えた解釈であり、Coleman の意図そのものではない
- manifest のヒント（1-5）はおおむね妥当だが、論文を読んだ結果、Stage 1, 2 は強対応にはならない。特に Stage 1 の「個人の場」は Coleman が批判する「過少社会化モデル」に対応するため、創造モデルの Stage 1（未分化な場）とは位相が異なる

**注意**: Stage 3, 4, 5 は原典の中核主張に直接対応するが、Stage 1, 2 は比喩的対応。「関係に内在する資源」というテーゼは創造モデルの Stage 3 に強くマッピングするが、論文全体を通して「場→波→…」という段階的発生論ではないことに留意。

## 6. 限界・留意事項

- **部分読解**: Forms of Social Capital の §2（Information Channels）と §3（Norms and Effective Sanctions）、および Human Capital 創出実証分析の詳細部分（pp.S104-S112）は精読せず、結論部分から推論的に補完した。情報チャネルと norms に関する具体的な主張を evidence に使う場合は追加読解が必要
- **定義の曖昧性**: Coleman 自身が "social capital is defined by its function" (p.S98) と認めているように、定義は機能的で形態の列挙に依存する。Putnam (1993/2000), Bourdieu (1986) の social capital 概念とは異なる位置づけである点に注意
- **実証の一般化**: 米国の特定データセット（High School and Beyond, 1980-82）に基づく。他国・他時代への一般化は慎重に扱う
- **Social capital と文化的差異**: Banfield (1967) の "Moral Basis of a Backward Society" への言及 (p.S103) があり、文化的差異を重要な調整要因として位置づけている。「善い」社会関係資本と「閉鎖的」社会関係資本の区別は本論文では明確化されない
- **公共財性の射程**: 論文末尾の「家族と地域社会の弱体化」論は Coleman 自身が認めるように規範的含意を持つ。これを evidence の記述的主張として引用する際は注意

## 7. 未読解セクション

- pp.S104–S112: Forms of Social Capital の §2 (Information Channels), §3 (Norms and Effective Sanctions) の詳細、および実証分析の序盤（家族内 social capital のコーディング、logistic regression の最初の結果）
- Table 1（家族内 social capital の記述統計）

これらのセクションは概念定義の詳細と実証分析の技術的詳細を含むが、本 wiki の主題（Coleman の社会関係資本概念の全体像と創造モデル対応）には最小限の影響しかない。結論部（S119）で三形態が要約されているため、機能的には補完されている。
