# investigation-cs219-phase23-triage

**date**: 2026-04-19（WebFetch verification pass 実施）
**status**: Phase 2/3 triage + OA 代替検証完了。cs#219 close 可能状態
**scope**: cs#219 の `[phase-1-exhausted]` 22 本を Phase 2（購入/ILL）/ Phase 3（OA 代替採用）に振り分け + 実在性検証
**related**: cs#219, cs#212, cs#218

> **⚠️ 更新（cs#252, 2026-06-25）— D05 固定代替の撤回**
>
> 本票（2026-04-19）は **D05-S01 Wilson 1966** を `[phase-3-confirmed]` に昇格させる根拠として **D05-S04 Dewey & Bird 1970 を「url-verified の代替 co-ref」**として用いている（§Phase 2 候補 / pjdhiro 判断 2 / co-ref 充足表 / 確認事項 2）。
>
> しかし **D05-S04 はその後 citation-only（取得不能）に降格**された（cs#249, 2026-06-22）。本文中の「D05-S04, url-verified」表記は**いずれも古い**。取得不能な原典を Phase 3 確定の固定代替に据えることは、cs#252 の原則「取得不能な原典を論や解説の根拠にしてはならない」に反する。
>
> **cs#252 方針による整理（固定代替を立てない・探索継続）**:
> - D05-S01 Wilson 1966 の `[phase-3-confirmed]`（D05-S04 を固定代替とする確定）を**撤回**する。Dewey & Bird 1970 を「論を通す固定代替」として据えない。
> - D05-S01 Wilson / D05-S04 Dewey & Bird はいずれも **read-list（書誌＋読みたい理由）扱いの探索対象**に戻す。「ウィルソンサイクル命名源」という価値は read-list の読みたい理由として残すが、命名源不在を埋める固定代替は立てない。
> - 当該 claim の支持可否は、全候補にわたる OA 探索の継続に委ねる（本プロジェクトは探索中であり、正典の穴を固定代替で埋めない）。
> - 以下の旧記述は本バナーで上書きされる: §Phase 2 候補表 D05-S01 行の「Dewey & Bird 1970（D05-S04、url-verified）で論は通る」/ §pjdhiro 判断 2 / §co-ref 充足 4 本 D05-S01 行 / §確認事項 2。

## 目的

Phase 1（CLI alternate route 探索）を 2026-04-18 に完了し、22 本の論文が取得不能として `[phase-1-exhausted]` タグ付きで残った。cs#212 の出口条件フローに従い、以下の 2 経路のどちらに振るかを各本について判定する。

- **Phase 2**: pjdhiro が大学図書館・ILL・有料 DL で原典確保。命名源・代替不能な古典・教科書化されていない論文が対象
- **Phase 3**: OA 代替（後続レビュー・教科書・同著者後継作品・Nobel lecture 等）で論旨を同等に支える経路

CLI は Phase 2（購入/ILL）を実行できないため、本判定票は **pjdhiro 向けの候補分類** であり、最終判断は pjdhiro 専権。

## 判定 rubric

**Phase 2 候補の条件**:

- 命名・初出論文で代替なし（概念の権威が原典に集中）
- 同著者の後継作品が OA でない／同概念を書き直していない
- 教科書化されていない（新しすぎる、またはニッチ）
- 論の核心的位置に原典引用が必要

**Phase 3 候補の条件**:

- 同著者の後継作品が OA 取得可能
- 教科書・レビューに理論が収録済み（公知化済み）
- 後続の発展論文が論を同等に支えられる
- 同エントリ内で既に url-verified / raw-confirmed の co-ref が論を支えている

**境界条件**:

- 「命名の歴史的重み」を残すか vs「論旨は後続で支えられる」の判断は pjdhiro 専権
- Phase 3 候補の OA 代替は **提案レベル**。実在性の WebFetch 検証は未実施（論拠の学術慣用・一般入手性からの推定）

## 22 本の判定

### Phase 2 候補（2 本）

| source | 役割 | 判定理由 | 代替提案（Phase 3 として扱う場合） |
|---|---|---|---|
| **D05-S01** Wilson, J.T. (1966). Did the Atlantic Close and then Re-Open? *Nature* 211 | EV-D05-001 ウィルソンサイクル命名源 | 「ウィルソンサイクル」という概念名自体が著者名に由来する。後続文献は必ず Wilson (1966) を引用する。命名権威の欠落は理論的損失 | Dewey & Bird 1970（D05-S04、url-verified）で論は通るが、命名源不在の注記が必要 |
| **D03-S10** Goldbeter (1996). *Biochemical Oscillations and Cellular Rhythms*. Cambridge UP | EV-D03 生体化学振動の統一的記述 | **⚠️ 書籍**（Cambridge UP monograph）。論文 scope ではなく書籍 50 本の `[no-oa]` 側に分類すべき可能性 | Goldbeter 2002 *Nature* review "Computational approaches to cellular rhythms"（OA 高確率）+ Novák & Tyson 2008 *Nat Rev Mol Cell Biol* |

### Phase 3 候補（20 本）

| source | 役割 | 代替提案 |
|---|---|---|
| **D02-S10** Becker & Döring (1935) *Ann. Phys.* | EV-D02-011 古典核生成理論の原典引用 | Kelton-Greer 2010 *Nucleation in Condensed Matter*（書籍、教科書化）/ Kalikmanov 2013 *Nucleation Theory*（Springer、arXiv preprint あり）/ Karthika 2016 *Crystal Growth & Design* レビュー |
| **D03-S03** Leibler (1980). Theory of Microphase Separation. ACS | EV-D03-003 ミクロ相分離の理論枠組み確立 | Fredrickson 2006 *The Equilibrium Theory of Inhomogeneous Polymers*（Oxford、教科書）/ Rubinstein-Colby 2003 *Polymer Physics*（Oxford、教科書） |
| **D03-S09** Miller (1953). Amino Acids Production. *Science* | EV-D03 化学進化（evidence 側で CA 評価、論の中心でない） | 公知実験。Lazcano & Bada 2003 "The 1953 Stanley L. Miller Experiments" *Origins of Life* レビュー（OA）/ Bada 2013 *Chem Soc Rev* |
| **D04-S07** Barton & Hewitt (1985). Analysis of hybrid zones. *Ann. Rev. Ecol. Syst.* | 雑種帯理論の古典 | Payseur & Rieseberg 2016 *Mol Ecol* レビュー / Barton 2013 "Does hybridization influence speciation?" |
| **D05-S06** Nance et al. (2014). Supercontinent cycle retrospective. *Gondwana Res.* | EV-D05-001 超大陸サイクル記述 | Condie 2018 *Geosci Front* / Mitchell 2021 *Nature* "The supercontinent cycle" |
| **D05-S07** Philander (1983). ENSO phenomena. *Nature* | EV-D05-002 ENSO 記述 | 同エントリ内 Suarez-Schopf 1988（D05-S09、url-verified）+ Cane-Zebiak 1985 *JAS* + Bjerknes 1969（D05-S10、url-verified）で論は成立 |
| **D06-S05** Pollack et al. (1996). Giant Planets Accretion. *Icarus* | EV-D06-005 コア集積モデル原典 | Armitage 2020 *Astrophysics of Planet Formation*（教科書）/ Drążkowska et al. 2023 *PPVII* レビュー章（arXiv OA） |
| **D08-S02** Craig (2009). How do you feel. *Nature Reviews Neuroscience* | EV-D08 内受容感覚・島皮質 | 同エントリ内 Seth-Friston 2016 / Barrett-Simmons 2015（両方 url-verified）で論は成立 |
| **D08-S06** Hobson et al. (2000). Dreaming and the brain. *BBS* | EV-D08 REM 夢の内部モデル | Nir-Tononi 2010 *Trends Cogn Sci* / Windt 2015 *Dreaming*（MIT Press）+ Domhoff-Fox 2015 |
| **D08-S10** Fries (2005). CTC. *Trends Cogn. Sci.* | EV-D08 CTC 位相同期 | Fries 2015 *Neuron* "Rhythms for Cognition: Communication through Coherence and Competition"（PMC OA、後続の権威的 update） |
| **D09-S11** Burnet (1957). Clonal selection. *Aust. J. Sci.* | EV-D09 クローン選択説の命名源 | Burnet Nobel Lecture 1960（nobelprize.org、OA）が canonical 代替 / Burnet 1959 *The Clonal Selection Theory of Acquired Immunity*（書籍、archive.org 可） |
| **D11-S04** Higuchi (1963). Sustained-action medication. *J Pharm Sci* | EV-PM-004 Higuchi 式 Q=K√t 原典 | 公知数式。Siepmann-Peppas 2011 *AAPS J* レビュー（PMC OA）/ Peppas 1985 / 薬学教科書に導出掲載 |
| **D11-S05** Korsmeyer et al. (1983). Porous polymer release. *Int J Pharm* | EV-PM-004 Peppas-Korsmeyer モデル | Siepmann-Peppas 2011 *AAPS J* レビュー（PMC OA、Korsmeyer-Peppas モデルを包括） |
| **D17-S03** Traugott (1989). Epistemic meanings. *Language* | EV-LI-001 文法化駆動力 | Hopper-Traugott 2003 *Grammaticalization* 2nd ed.（CUP 教科書、archive.org 可） |
| **D19-S08** Bourdieu (1971). Le marché des biens symboliques | EV-LT-006 象徴財市場・文学場自律化 | Bourdieu 1992/1996 *The Rules of Art*（同著者後継、Stanford UP、archive.org 可） |
| **D26-S10** Madison (2006). Experiencing Groove. *Music Perception* | EV-MU グルーヴ最適複雑性 | Witek et al. 2014 *PLoS ONE* "Syncopation, Body-Movement and Pleasure in Groove Music"（OA） |
| **D27-S07** Menges (2012, 2015). Material Computation. *Architectural Design* | EV-AD-007 Material Computation | ICD Stuttgart 公式 publications（https://www.icd.uni-stuttgart.de/publications/ 多数 OA）/ Menges ResearchGate author upload |
| **D29-S03** Bak et al. (1987). SOC. *PRL* | EV-CX-002 SOC 基盤論文 | **D29-S04** Bak et al. 1988 *PRA*（既 raw-confirmed、PRL の拡張完全版）で代替確定 / Watkins et al. 2016（D29-S?、url-verified）25年レビュー |
| **D29-S07** Kauffman (1986). Autocatalytic sets. *J. Theor. Biol.* | EV-CX-003 RAF 原典 | Kauffman 1993 *The Origins of Order*（書籍、archive.org 可）/ Hordijk-Steel 2004 以降の数学的定式化論文群 |
| **D30-S01** Berkes et al. (2000). TEK Adaptive Management. *Ecol. Appl.* | EV-TK TEK 定義原典 | Berkes 2018 *Sacred Ecology* 4th ed.（書籍）/ Berkes 2009 *J Environ Manag* "Evolution of co-management"（OA 高確率） |

## 集計（初回 triage, 2026-04-19 AM）

- **Phase 2 候補**: 2 本（D05-S01 Wilson 命名源、D03-S10 Goldbeter 書籍 ⚠️ 分類要再確認）
- **Phase 3 候補**: 20 本

## pjdhiro 判断 (2026-04-19 PM)

1. **D03-S10 Goldbeter**: `[no-oa]` へ再分類（書籍として書籍 50 本側へ統合） → 実施済み。書籍 51 本、論文 21 本に更新
2. **D05-S01 Wilson 1966**: Phase 3 採用、Dewey & Bird 1970 (url-verified, D05-S04) で代替 → `[phase-3-confirmed]` に昇格
3. **Phase 3 候補 20 本**: WebFetch second pass (option B) で実在性検証実施

## WebFetch verification 結果（2026-04-19 PM）

### [phase-3-confirmed] 18 本

#### co-ref 充足 4 本（同エントリ内 url-verified / raw-confirmed で論成立）

| source | 代替 co-ref |
|---|---|
| D05-S01 Wilson 1966 | Dewey-Bird 1970（D05-S04、url-verified） |
| D05-S07 Philander 1983 | Suarez-Schopf 1988（D05-S09）+ Bjerknes 1969（D05-S10、両方 url-verified） |
| D08-S02 Craig 2009 | Seth-Friston 2016 + Barrett-Simmons 2015（両方 url-verified） |
| D29-S03 Bak 1987 PRL | D29-S04 Bak 1988 PRA（raw-confirmed、PRL 拡張完全版） |

#### OA 代替 WebFetch 検証済 14 本

| source | OA 代替 | 検証 |
|---|---|---|
| D02-S10 Becker-Döring | Dawoodian 2025 PMC12744345 | ✓ CC-BY |
| D03-S09 Miller 1953 | Bada-Lazcano 2003 Hawaii FTP PDF | ✓ 200 OK (231KB) |
| D04-S07 Barton-Hewitt | Moran 2021 eLife PMC8337078 | ✓ CC-BY |
| D05-S06 Nance 2014 | **Nance 2022** PMC9796656（同著者後継） | ✓ CC-BY |
| D06-S05 Pollack 1996 | Drążkowska 2023 arXiv:2203.09759 | ✓ OA |
| D08-S06 Hobson 2000 | Nir-Tononi 2010 PMC2814941 | ✓ NIHPA |
| D08-S10 Fries 2005 | Fries 2015 PMC4605134 | ✓ NIHPA |
| D09-S11 Burnet 1957 | Burnet Nobel Lecture 1960 nobelprize.org | ✓ 200 OK (131KB) |
| D11-S04 Higuchi | OA drug delivery review 2024 PMC12845442 | ✓ CC-BY |
| D11-S05 Korsmeyer | 同上 PMC12845442 | ✓ CC-BY |
| D19-S08 Bourdieu 1971 | Bourdieu 1985 英訳 web.mit.edu/allanmc/www/bourdieu2.pdf | ✓ 200 OK (413KB) |
| D26-S10 Madison | Witek 2014 PLoS ONE | ✓ CC-BY |
| D27-S07 Menges | Menges SAJ 2013 CUNY OpenLab PDF | ✓ 200 OK (510KB) |
| D29-S07 Kauffman 1986 | Hordijk-Steel 2015 PMC4428007 | ✓ CC-BY |

### [phase-3-candidate] 3 本（OA 代替 URL 未発見）

| source | 失敗理由 | 教科書参照 |
|---|---|---|
| D03-S03 Leibler 1980 | ACS Macromolecules paywall、OA 後続レビュー見つからず | Rubinstein-Colby 2003 / Fredrickson 2006 |
| D17-S03 Traugott 1989 | JSTOR paywall、Stanford 著者 page 403、archive.org 見つからず | Hopper-Traugott 2003 2nd ed. |
| D30-S01 Berkes 2000 | Wiley paywall、forestpolicypub.com 403、Semantic Scholar 空 | Berkes 2018 *Sacred Ecology* |

## pjdhiro への確認事項（今回 triage の解決事項）

1. ~~D03-S10 Goldbeter 1996 の扱い~~ → **[no-oa] 再分類済**（2026-04-19 pjdhiro 判断）
2. ~~D05-S01 Wilson 1966 の扱い~~ → **Phase 3 採用決定**（Dewey-Bird 1970 で代替、命名源欠落注記付き）
3. ~~Phase 3 候補 20 本の扱い~~ → **WebFetch second pass (option B) で検証完了**：18 本 confirmed、3 本 candidate 残存

## 残存事項（次回以降）

- **`[phase-3-candidate]` 3 本の扱い**（D03-S03 Leibler / D17-S03 Traugott / D30-S01 Berkes）: evidence 再構成時（cs#223/224）に以下のいずれかを選ぶ
  - (a) 教科書参照で論を支える（Rubinstein-Colby 2003 等、paywall 書籍扱い）
  - (b) さらに OA 代替探索を続ける（Google Scholar 著者 page 巡回など）
  - (c) evidence 側で該当 claim を除外するか、引用を緩和する

## 判定の限界

- 本判定は evidence archive（`pre-rerun-20260407/`）に基づく。現在の evidence-D{NN}-*.md は再監査待ち stub であり、本番 evidence 再構成時に各エントリの重要度が変わる可能性がある
- OA 代替の実在性は学術慣用からの推定。各本について WebFetch verification を行う second pass は未実施
- 「命名源」vs「論は後続で支えられる」のバランスは pjdhiro 専権

## 関連

- cs#212（Phase 1-3 出口条件）
- cs#218（並行運用 umbrella）
- cs#219（本 Issue、Phase 1 完了済）
- cs#223（evidence フォーマット、Phase 3 代替採用は evidence 再構成時に反映）
