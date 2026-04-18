# investigation-cs219-phase23-triage

**date**: 2026-04-19
**status**: pjdhiro 判断待ち
**scope**: cs#219 の `[phase-1-exhausted]` 22 本を Phase 2（購入/ILL）/ Phase 3（OA 代替採用）に振り分ける判定票
**related**: cs#219, cs#212, cs#218

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

## 集計

- **Phase 2 候補**: 2 本（D05-S01 Wilson 命名源、D03-S10 Goldbeter 書籍 ⚠️ 分類要再確認）
- **Phase 3 候補**: 20 本

## pjdhiro への確認事項

1. **D03-S10 Goldbeter 1996 の扱い**: 書籍なので `[no-oa]` 側（書籍 50 本）へ分類移動するのが正しいか、または Phase 2 候補として扱うか
2. **D05-S01 Wilson 1966 の扱い**: Phase 2（購入/ILL）で命名源を確保するか、Phase 3（Dewey-Bird 1970 で代替、命名源欠落注記付き）で済ませるか
3. **Phase 3 候補 20 本の扱い**:
   - 一括で `[phase-3-candidate]` タグを採用承認するか
   - 各本について OA 代替の実在性を WebFetch で検証する second pass を走らせるか
   - 既に論を支える url-verified / raw-confirmed co-ref がある場合（D05-S07, D08-S02, D29-S03）は代替検証不要で `[phase-3-confirmed]` に昇格するか

## 次アクション（pjdhiro 判断後）

- **Phase 2 承認**: 該当行の notes に `[phase-2-candidate]` タグ追加、pjdhiro ILL リストへ
- **Phase 3 承認**: 該当行の notes に `[phase-3-candidate]` タグ追加、evidence 再構成時に代替採用を明記
- **分類移動**: D03-S10 は `[phase-1-exhausted]` → `[no-oa]` へ書き換えの可能性

## 判定の限界

- 本判定は evidence archive（`pre-rerun-20260407/`）に基づく。現在の evidence-D{NN}-*.md は再監査待ち stub であり、本番 evidence 再構成時に各エントリの重要度が変わる可能性がある
- OA 代替の実在性は学術慣用からの推定。各本について WebFetch verification を行う second pass は未実施
- 「命名源」vs「論は後続で支えられる」のバランスは pjdhiro 専権

## 関連

- cs#212（Phase 1-3 出口条件）
- cs#218（並行運用 umbrella）
- cs#219（本 Issue、Phase 1 完了済）
- cs#223（evidence フォーマット、Phase 3 代替採用は evidence 再構成時に反映）
