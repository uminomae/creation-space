# Paths to Self-Organized Criticality

**source_id**: D21-S11 | **domain_id**: D21
**access_status**: url-verified
**読解日**: 2026-06-22 | **読解者**: Claude Sonnet 4.6
**読解方法**: WebFetch（PDFバイナリ取得）→pdftotext 全文抽出（Abstract〜References・本文全読、数式詳細は概念把握に留める）
**原典ページ数**: Brazilian Journal of Physics 30(1), pp.27-41（15頁） | **読解ページ範囲**: 全文（Abstract / I 序論 / II 単純例 / III ARW とサンドパイル / IV 他の経路 / V 実験 / VI まとめ / References）

---

## 1. 書誌情報

- **著者**: Ronald Dickman, Miguel A. Muñoz, Alessandro Vespignani, Stefano Zapperi
- **タイトル**: Paths to Self-Organized Criticality
- **出典**: *Brazilian Journal of Physics* 30(1), 27-41 (March 2000)
- **DOI / URL**: OA: https://www.scielo.br/j/bjp/a/zybV3FQw8gSGCcP6H7hcmGm/?lang=en&format=pdf

**書誌クロスチェック (cs#250 規律2)**: PDF 1頁ヘッダ "Brazilian Journal of Physics, vol. 30, no. 1, Março, 2000 / 27 / Paths to Self-Organized Criticality / Ronald Dickman, Miguel A. Muñoz, Alessandro Vespignani, and Stefano Zapperi / Received 15 October 1999" が manifest 行（著者筆頭 Dickman・年2000・誌名 Braz. J. Phys.・巻30）と一致。manifest は "Dickman et al. (2000) ... *Braz. J. Phys.* 30." と略記、巻号・年が一致。同定 OK。

## 2. 要旨（読んだ内容に基づく）

自己組織化臨界（self-organized criticality, SOC）への教育的入門であり、SOC を非平衡相転移と結びつけて「不思議な現象（sui generis）」という神話を解体する論文。著者らの中心主張は、**SOC は本質的に「吸収状態相転移（absorbing-state phase transition）」へ駆動（supervision/driving）を課したものである**、という統一的視点である。通常の臨界点はパラメータの精密な調整（tuning）を要するが、SOC は系が自発的に臨界点に引き寄せられるように見える。著者らはサンドパイル模型（Bak-Tang-Wiesenfeld, Manna 等）を例に、活性化ランダムウォーカー（ARW）模型が保存密度をもつ吸収状態相転移を示すこと、そしてそこに「不活性時に粒子を無限小ずつ加え、活性時に境界から失う」という無限の時間スケール分離を課すと、密度が自動的に臨界値 ρ_c に固定されることを示す。これが SOC の機構である。著者らは「SOC のレシピ」を定式化し、駆動界面・Bak-Sneppen 模型・自己組織化有向浸透など他の経路も検討し、いずれも「臨界には調整（無限の時間スケール分離）が必要」と結論づける。SOC は「パラメータ空間の一点での臨界（自然な scale invariance ではない）」であると喝破する。

## 3. 主要主張（原文引用付き）

### 主張 1: SOC は「吸収状態への相転移」であり、有向浸透として既によく研究された臨界現象である

> "In this paper we show that SOC is a phase transition to an absorbing state, a kind of criticality that has been well studied, principally in the guise of directed percolation." (I Introduction)

SOC を sui generis（独自の世界の現象）とする見方を否定し、既知の非平衡臨界現象へ還元する。

### 主張 2: 通常の臨界は調整を要するが、SOC では系が自ら臨界点に維持される——その機構の解明が問い

> "'Self-organized criticality' (SOC) carries greater specificity, because criticality usually does not happen spontaneously: various parameters have to be tuned to reach the critical point. ... one has to show how the system is maintained (or maintains itself) at the critical point." (I Introduction)

「自己組織化」の核心は「臨界点への自己維持の機構」にある。

### 主張 3: SOC の機構は、活性に依存する損失と不活性に依存する付加が密度を臨界値に固定すること

> "In the presence of activity, then, ρ > ρc and dρ/dt < 0. In the absence of activity there is addition, but no loss of walkers, so ρ < ρc implies dρ/dt > 0. Evidently, the only possible stationary value for the density in the sandpile is ρc!" (III)

活性時は密度減少、不活性時は密度増加→密度は臨界値 ρ_c に「ピン留め」される。これが自己組織化の正体。

### 主張 4: SOC のレシピ＝吸収状態相転移 + 無限小付加（不活性時）+ 無限小損失（活性時）

> "The basic ingredients of our recipe are an absorbing-state phase transition, and a method for forcing the model to its critical point, by adding (removing) particles when the system is frozen (active). Following the recipe, the transformation of a conventional critical point to a self-organized one does not seem surprising." (III.1 A Recipe for SOC)

「通常の臨界点 → 自己組織化臨界点」への変換は、レシピに従えば驚くべきことではない。

### 主張 5: SOC は generic な scale invariance でなく、パラメータ空間の一点での臨界である（無限の時間スケール分離が必要）

> "We pay a price when we fire the baby-sitter: there is now a parameter h in the model, which has to be tuned to zero. Evidently, sandpiles don't exhibit generic scale invariance, but rather, scale invariance at a point in parameter space. This is consistent with Grinstein's definition of SOC, which requires an infinite separation of time scales from the outset." (III.2 Firing the Baby-Sitter)

「監視者（baby-sitter）」を排しても、駆動率 h→0 の調整が残る。SOC も結局は臨界点への「調整」を要する。

## 4. 方法論

- **理論物理（解析＋数値）**: 平均場理論、有限サイズスケーリング、モンテカルロ・シミュレーションで ARW・接触過程・Manna サンドパイル等の臨界指数を比較
- **統一的還元論**: 多様な SOC 模型（BTW, Manna, Bak-Sneppen, 駆動界面, 自己組織化有向浸透）を「吸収状態相転移＋駆動」という共通構造に還元
- **臨界指数による普遍性クラス判定**: ARW（β=0.43）と有向浸透（β=0.2765）の差から、保存場をもつ ARW が DP と別の普遍性クラスに属すると論じる
- **教育的レビュー**: 完全な網羅レビューではなく、SOC の概念的核心（自己組織化の機構）を明晰化することが主眼

## 5. cs 5段階モデルとの対応（cross-check 知見）

`knowledge/schema/five-stages.md` の創造5段階（場→波→縁→渦→束）と照合する。本原典は統計物理の臨界現象を主題とするが、five-stages.md「縁（Stage 3）」の対応概念に**「準安定状態」「Julia集合の境界」**が、「渦（Stage 4）」に**「自己組織化」**が明示的に挙げられており、SOC は cs モデルと概念的に直接接続する原典である。

| cs 段階 | 対応候補 | 強度 | 原文引用 |
|--------|---------|------|---------|
| 1 場 (Field) | 吸収状態（absorbing state）= 活動が消えた静止・未分化の状態 | 中 | "absorbing, in which no site is multiply occupied, rendering all the walkers immobile" (II) |
| 2 波 (Wave) | 活性の伝播・avalanche（雪崩）= 揺動・解放の連鎖 | 強 | "a highly fluctuating, scale-invariant avalanche-like pattern of activity" (I) |
| 3 縁 (Relation) | 臨界点 ρ_c = 吸収相と活性相の境界。系が引き寄せられる「縁」 | 強 | "the only possible stationary value for the density in the sandpile is ρc" (III) |
| 4 渦 (Vortex) | 自己組織化そのもの = 系が臨界点に自律的に立ち上がる | 強 | "systems that are attracted to a critical (scale-invariant) stationary state" (I) |
| 5 束 (Bundle) | scale-invariant な定常状態（べき乗則の構造）= 構造として残る集まり | 中 | "the Manna sandpile ... exhibits scale invariance in the stationary state" (III) |

**cross-check 知見（核心）**: 本原典は cs「縁（Stage 3, 境界・関係）」と「渦（Stage 4, 自己組織化）」に**強い直接対応**を示す（five-stages.md が両段階の対応概念に「準安定状態」「自己組織化」を明示）。最も重要な cross-check 知見は、**「自己組織化」とは無条件の自発性ではなく、臨界点への駆動（無限の時間スケール分離という調整）を要する**という本原典の脱神話化命題である。すなわち、cs「渦（自己組織化）」が「個・立ち上がりが自ずと生じる」ように見えても、その背後には「不活性時の蓄積（場の充填）と活性時の解放（波）」という非対称な駆動構造が必要である。これは cs の「場（蓄積）→波（解放）→縁（臨界）→渦（立ち上がり）」の系列を、統計物理の機構として裏づける。さらに、**avalanche（雪崩）= 解放の連鎖**が臨界（縁）で生じるという描像は、five-stages.md「波（Stage 2）: 対立・攪乱が次相を駆動しうる」（解放が遷移を駆動する、cs#244 接続）と**収束する**——生態遷移（D12-S02）・SES 変革（D12-S12）に続き、統計物理の SOC も「臨界での解放（avalanche）」を構造化の駆動因として独立に同定している。

**留保**: ただし本原典の核心は「SOC は自発的ではなく駆動を要する」という**脱神話化**であり、cs「渦」を素朴に「自ずと立ち上がる自己組織化」と読むことへの警告でもある。創造の渦も、背後に蓄積と解放の非対称な時間スケール分離を要するという読み筋を支持する一方、「自発性」の安易な措定を戒める。

**manifest ヒントからの独立性**: manifest 注記は誌名・巻号のみ。原典本文から独立に、SOC の脱神話化（駆動の必要性）と avalanche=解放の構造を読み取り、cs「渦」の自発性への留保と「波（解放）」との収束を判定した。

## 6. 限界・留意事項

- **論文種別**: 教育的レビュー兼研究論文。著者ら自身の研究結果（ARW の臨界指数等）を含むが、SOC 全分野の網羅レビューではない（著者明記）
- **数式詳細**: 平均場方程式・場の理論（式 1-4）の数学的導出は概念把握に留め、逐一検証していない（読解方法に明記）
- **創造プロセスとの類比は原典に存在しない**: 著者の関心は非平衡相転移の物理であり「創造の位相遷移」ではない。§5 の対応は構造類似の判定にとどまる
- **「自己組織化」の脱神話化**: 本原典は SOC を「自発的・パラメータフリー」とする通俗的理解を明確に否定する。cs 側がこの語を借用する際、この留保を踏まえる必要がある

## 7. 未読解セクション

なし（Abstract / I-VI 全節 / References を全読。数式の数学的導出のみ概念レベルで把握。Figs 1-2 の説明も確認）。

## 関連

- **D21-S16** Walker et al. (2009) — adaptive cycle の release/avalanche は SOC の avalanche と「臨界での解放」で接続
- **D12-S02** Connell & Slatyer (1977) — 「解放・破壊が遷移を駆動」する点で本ノートの avalanche と収束（five-stages.md 波の知見）
- cs 5段階 schema: `knowledge/schema/five-stages.md`（縁・渦の対応概念に「準安定状態」「自己組織化」を明示）
- 領域サマリ: `knowledge/source-notes/D21/D21-summary.md`
