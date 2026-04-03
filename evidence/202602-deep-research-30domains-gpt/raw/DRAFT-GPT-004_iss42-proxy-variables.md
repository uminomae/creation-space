# DRAFT-GPT-004: ISS-42 観測可能な代理変数の候補リスト（Proxy Variables for Measurement Design）

**作成日**: 2026-02-10  
**ステータス**: DRAFT（候補網羅優先）  
**対象ISS**: ISS-42（測定設計）  
**前提**: H08二成分モデル（H08.bs / H08.pl）＋循環モデル（Secure Base経験 ↔ H08 ↔ Secure Base提供能力）

---

## 0. このDRAFTの使い方（設計上の約束）

- ここでいう「代理変数」は、**循環定義を回避するための観測可能ノード**（行動・生理・神経・言語）を置くための候補リスト。
- 代理変数は「信頼そのもの」ではない。**ループの辺（→）のどこで何が起きたか**を切り分けるための「計測可能な痕跡」。
- [P][M][S]タグは以下で用いる：
  - **[P]**: 物理・生理・神経・行動として測定可能（客観データ寄り）
  - **[M]**: モデル内部変数（推定・潜在変数・計算論的指標）
  - **[S]**: 探索的（概念は妥当そうだが測定設計が不確か／牽強付会リスクあり）

---

# 1. Task A: H08.bs / H08.pl の操作的区別（Operational Distinction）

## 1.1 まず「構造的 vs 活動的」の最小定義（ISS-42用）

- **H08.bs（構造・履歴依存）**：  
  「O軸へのルーティングが起きやすい」という**長期の基礎条件**。  
  *候補神経基盤*: vmPFC–扁桃体系の**構造的結線**（白質・結線強度）／発達史により形成。
- **H08.pl（活動・状況依存）**：  
  その場で「O軸へ流す／流せる」ための**短期の起動状態**。  
  *候補神経基盤*: vmPFC–扁桃体系の**一時的結合（functional coupling）**／安全学習・情動制御の「オン・オフ」。

> 重要：ここでは H08.bs と H08.pl を「別変数」ではなく、**単一H08の内部成分**として扱う（Session 18の案A）。

---

## 1.2 測定設計の基本戦略：二層の計測（構造×状態）

### A. H08.bs（構造・履歴依存）に寄せる指標候補

| 測定カテゴリ | 指標候補 | ねらい（H08.bsとの対応） | タグ |
|---|---|---|---|
| 神経構造（白質） | DTI/tractographyでのvmPFC–扁桃体（または前頭-辺縁）経路の構造指標（FAなど） | 長期的に変わりにくい「制御回路の器」 | [P] |
| 神経構造（皮質厚など） | vmPFC/ACC周辺の皮質厚・体積（発達史の反映） | 長期の「規制・統合」基盤の粗い代理 | [P] |
| 愛着表象（言語・物語） | Adult Attachment Interview（AAI）の分類／coherence指標 | 内的作業モデル（長期）を間接推定 | [P/M] |
| 表象スキーマ（スクリプト） | Secure Base Script Knowledge（SBK）課題 | 安全基地の「物語テンプレ」の長期蓄積 | [P/M] |
| 長期傾向（関係ストレス脆弱性） | 慢性的ストレス負荷（アロスタティック負荷指数）＋回復力指標 | 長期の安全感／調整能の基礎条件 | [P] |
| 治療・earned securityの履歴 | 長期縦断での愛着分類の変化（earned secure等） | 「年単位で更新されるbs成分」の実例 | [P/M] |

**参照の足場（例）**：  
- DTIによる扁桃体—前頭前野経路の個人差が情動傾向（不安等）と関連する研究は複数存在（例：Kim et al., 2009）。  
- AAIを用いて愛着表象と脳活動／結合を結ぶ研究も散見される（例：Vrtička et al., 2008 など）。

### B. H08.pl（活動・状況依存）に寄せる指標候補

| 測定カテゴリ | 指標候補 | ねらい（H08.plとの対応） | タグ |
|---|---|---|---|
| 神経活動（課題fMRI） | 愛着／社会的脅威／社会的支援課題での扁桃体反応性、vmPFC活動 | その場の「脅威⇄安全」状態 | [P] |
| 機能結合（task / rest） | vmPFC–扁桃体 functional connectivity（課題中／安静時） | 短期の「ゲーティング状態」 | [P] |
| 生理（自律神経） | HRV（迷走神経トーン）、皮膚電気反応（SCR）、呼吸、瞳孔 | その場の安全/脅威・調整の近接指標 | [P] |
| 反応時間・行動 | 情動干渉課題（例：emotion Stroop）、信頼ゲームでの投資額/更新率、協力課題での修復行動 | 「O軸へ回す」行動痕跡 | [P] |
| 経験サンプリング | EMAでの「その瞬間の安心・他者期待・回避衝動」＋文脈ログ | 状況変動（場面単位）を捕まえる | [P/M] |
| 内分泌/神経化学（注意） | オキシトシン等（条件依存） | **信頼文脈に同期した生理変動**（ただし再現性課題あり） | ⚠️[P] |

---

## 1.3 「構造的 vs 活動的」は trait vs state とどう違うか？

### 共通点
- H08.bs ≒ trait（安定性が高い）
- H08.pl ≒ state（状況で揺れる）

### 重要な相違（このプロジェクト固有）
1. **H08.bsは trait というより「回路・器」**  
   trait尺度は心理測定（質問紙）に閉じがちだが、H08.bsは「構造的接続」や「内的作業モデル」のように、**発達史が沈殿した制約条件**として扱う。  
   → traitをさらに分解して「構造（structural）」を前面に出す設計。

2. **H08.plは単なる気分ではなく「ルーティング状態（gating）」**  
   stateは感情状態・主観状態を指しがちだが、H08.plは「誤差がO軸へ流れる／流せる」**計算過程の作動状態**に近い。  
   → 「状態＝気分」ではなく「状態＝情報ルーティング」。

3. **bs と pl は統計的には "State–Trait" の枠に落とせるが、概念的には "Stock–Flow"**  
   BSPL（Stock–Flow）の直観に沿うなら、  
   - bs = ストック（構造資本・内的作業モデル）  
   - pl = フロー（短期の起動・結合・自律神経状態）  
   という二重化が、測定設計にそのまま接続する。

---

## 1.4 既存研究で「この区別に近い」測定設計はあるか？

近い設計パターン（典型）：

1. **DTI（構造）＋課題fMRI（活動）で同じ回路を見る** [P]  
   構造的結線の個人差が、課題中の反応性や結合と関係するかを同時に検討する系。

2. **AAI（表象の長期）＋神経活動／結合（短期）** [P/M]  
   AAI分類（例：secure / insecure / unresolved）により、愛着関連課題中の扁桃体反応や調整回路の活動差を検討する系。

3. **縦断（earned security等）で "bsが変わる" 条件を特定** [P/M]  
   年単位の変化が観測できるデータで、H08.bs更新の条件（治療的関係、重要な対人経験）を推定する系。

---

# 2. Task B: 循環ループの各辺（→）の代理変数候補

対象ループ：

```
Secure Base経験 → H08蓄積 → Secure Base提供能力 → (相手の)Secure Base経験 → …
```

## 2.1 辺1：Secure Base経験 → H08蓄積（更新・沈殿）

**何が起きているか（仮）**  
- 受け手側で「危機→支援→回復→修復」の経験が反復し、  
  - 長期：内的作業モデル/結線（bs）に沈殿  
  - 短期：安全学習・調整（pl）が起動しやすくなる

| 代理変数候補 | 何を観測するか | タグ |
|---|---|---|
| 養育の感受性（sensitivity）観察指標（例：親子相互作用のコーディング） | 安全基地経験の「入力品質」 | [P] |
| SSP（Strange Situation Procedure）などの子ども愛着指標 | 子ども側の安全基地経験の結果 | [P/M] |
| "社会的緩衝"の生理効果：ストレス課題でのコルチゾール/心拍/HRV回復が、支援条件で改善する度合い | Secure Baseが実際に生理を戻すか | [P] |
| 「修復イベント」頻度：破綻→修復の観察（会話/共同課題でのrepair指標） | "裏切られても戻れる"経験の反復 | [P] |
| EMA：支援を受けた直後の「脅威低下」「回避衝動低下」「再接近」 | 経験→短期状態の変化（pl更新） | [P/M] |
| 縦断でのAAI coherence / SBKの変化 | 経験が表象（bs）に沈殿した痕跡 | [P/M] |

⚠️ 牽強付会リスク：  
- "Secure Base経験"を「主観評価」だけで置くと循環（信頼感↔信頼）に戻りやすい。**観察指標（sensitivity, repair）＋生理回復**の組み合わせが安全。

---

## 2.2 辺2：H08 → Secure Base提供能力（内的モデル→行動生成）

**何が起きているか（仮）**  
- 供給者側で、  
  - 自分の誤差（不安・苛立ち）をF軸暴走させず、  
  - 相手の誤差をO軸で保持しつつ、  
  - "修復可能性"を前提にした応答（containing / repair）を生成する。

| 代理変数候補 | 何を観測するか | タグ |
|---|---|---|
| 養育感受性（sensitivity）／supportive behavior の観察コーディング | Secure Base提供の行動的本体 | [P] |
| Reflective Functioning / Mentalization（面接・課題） | 相手の内的状態を保持して扱えるか | [P/M] |
| "修復応答性"：相手の distress のサインに対する反応の速さ・適合度（latency / contingency） | repair可能性の実装 | [P] |
| 自律神経の安定：相手の distress への曝露中のHRV低下が小さい／回復が早い | 供給者が崩れずに支えられるか | [P] |
| "抱持 容量"の行動課題：衝動的介入を抑え、観察→問い返し→支援へ移れるか（プロトコル化） | D3（保持）を介した提供能力 | [P/M] |
| 二者神経同期（hyperscanning）／心拍同期 | 相互調整が成立しているか | ⚠️[P] |

⚠️ 牽強付会リスク：  
- hyperscanning / 同期系は"結果"であって"原因"ではない可能性が高い。辺2の主要代理はまず **行動コーディング（sensitivity/repair）** を軸に置くのが堅い。

---

## 2.3 辺3：Secure Base提供能力 →（相手の）Secure Base経験

**何が起きているか（仮）**  
- 供給者の行動が、受け手の  
  - 生理（脅威低下・回復）  
  - 認知（修復可能性の学習）  
  - 行動（探索・再接近）  
  に変換され、「安全基地経験」として成立する。

| 代理変数候補 | 何を観測するか | タグ |
|---|---|---|
| 受け手の探索行動（探索→戻る）を誘発する課題指標 | Secure Baseが「探索を可能にする」か | [P] |
| 受け手の生理回復：HRV回復、SCR減衰、コルチゾール低下 | "安心"が身体に起きたか | [P] |
| 受け手の認知更新：信頼ゲームでの裏切り後の更新率（learning rate）、再協力への復帰 | 修復可能性の学習が起きたか | [P/M] |
| 会話のrepair成立率：rupture→repairの成功頻度（受け手側の反応含む） | 関係の回復可能性が経験化したか | [P] |
| 受け手の表象：SBK/AAI（縦断）変化 | 経験が長期表象（bs）へ沈殿したか | [P/M] |

---

## 2.4 ループを "辺の観測" に分解するための最小セット（提案）

循環定義回避のため、最小でも以下の**異種データ**の三点セットを推奨：

1. **入力品質（観察）**：sensitivity / repair / contingency（供給者行動） [P]  
2. **受け手の回復（生理）**：HRV / SCR / cortisol / recovery slope [P]  
3. **長期沈殿（表象）**：AAI coherence / SBK の縦断変化 [P/M]

この三つが揃うと、  
- 「提供があった（行動）」  
- 「受け手に変化が起きた（身体）」  
- 「長期に残った（表象）」  
を別々に主張でき、循環の"辺"が計測設計として閉じる。

---

# 3. Task C: 先行研究サーベイ（測定設計を持つ説明可能な研究）

> ここでは「厳密な網羅」ではなく、ISS-42に**直結しやすい"測定設計の型"**を収集する。  
> それぞれに「何を測っているか」「どこに接続するか」「[P][M][S]」を付す。

---

## 3.1 H08.bs（構造）に近い：前頭-扁桃体の構造結線と個人差

### Kim et al. (2009) "The Structural Integrity of an Amygdala–Prefrontal Pathway …" (DTI + fMRI)
- 何を測定：DTIで扁桃体—前頭前野の構造結線指標＋課題fMRIで扁桃体反応性（恐怖顔）  
- 接続：**H08.bs候補（構造結線）** と、短期反応（pl的）を同時計測する"型"  
- レイヤ：主に [P]（構造＋活動）

### Tromp et al. (2012) "Reduced Structural Connectivity of a Major Frontolimbic Pathway …" (DTI + fMRI)
- 何を測定：腹側前頭—扁桃体系の構造結線＋機能結合  
- 接続：bs（構造）とpl（機能結合）を分けて見る測定設計  
- レイヤ：[P]

---

## 3.2 愛着表象（AAI等）×神経活動：H08.bsの"表象代理"とplの反応

### Vrtička et al. (2008) "Individual Attachment Style Modulates Human Amygdala …" (PLOS ONE)
- 何を測定：成人愛着スタイル（質問紙）×脳活動（扁桃体など）  
- 接続：H08.pl（場面での反応性）に近い。bsには質問紙の限界あり（⚠️）  
- レイヤ：[P]（脳）＋[M]（愛着測定の妥当性議論）

### Schneider-Hassloff et al. (2015) "Adult attachment style modulates neural responses …" (Neuropsychologia)
- 何を測定：愛着次元（回避/不安）と、課題中の扁桃体などの活動  
- 接続：H08.pl候補（社会的文脈での反応性差）  
- レイヤ：[P]

### Bernheim et al. (2022) "Neural Correlates of Attachment Representation …" (fMRI)
- 何を測定：愛着表象課題における脳活動（臨床群含む）  
- 接続：愛着表象の処理様式（bsの表象代理）と、課題反応（pl）の橋渡し候補  
- レイヤ：[P/M]（臨床文脈で混入因子あり）

---

## 3.3 earned security（変化機構）：bs更新が起きうることを示す縦断・分類枠

### Roisman et al. (2002) "Earned-secure attachment status in retrospect and prospect" (23-year longitudinal)
- 何を測定：AAI等での earned-secure の検討（長期縦断）  
- 接続：**H08.bsは絶対固定ではなく条件付きで更新されうる**という設計根拠（更新の痕跡）  
- レイヤ：[P/M]

### Roisman et al. (2006) "An experimental manipulation of retrospectively defined earned-secures …"
- 何を測定：earned secure の概念的検証（方法論）  
- 接続：earned security を bs更新の証拠に使う際の注意点（循環／回顧バイアス）  
- レイヤ：[M]（方法論）

---

## 3.4 世代間伝達（循環の"世代間螺旋"）：辺の代理変数を明示する研究

### van IJzendoorn et al. (2019) "Bridges across the intergenerational transmission of attachment …"
- 何を測定：親の愛着表象→養育（sensitivity等）→子の愛着、という"伝達ギャップ"の議論  
- 接続：ループ辺の分解（H08→提供能力→相手経験）に直結。**sensitivityが重要だが全てを説明しない**という設計上の注意。  
- レイヤ：[M]（統合レビュー）

### meta-analytic系（例：親のsensitivityと愛着の関係）
- 何を測定：観察された養育感受性と子の愛着安全性の関連  
- 接続：辺3（提供→相手経験）の主要代理として "sensitivity" を置く根拠  
- レイヤ：[M/P]（メタ分析）

---

## 3.5 「信頼」の行動・生理指標：H08.pl（場面）を捕まえる測定設計

### Ajenaghughrure et al. (2020) "Measuring Trust with Psychophysiological Signals" (mapping review)
- 何を測定：信頼を生理指標（EDA, HR, HRV等）で推定する研究群の整理  
- 接続：H08.plの代理変数候補（自律神経・覚醒）を広く拾うための地図  
- レイヤ：[M]（サーベイ）＋[P]（候補指標）

### van der Werff et al. (2019) "A Trait-State Model of Trust Propensity …" (state-trait modeling)
- 何を測定：信頼傾向を trait と state に統計分解する（latent state-trait等）  
- 接続：H08.bs/H08.pl を **統計モデルとして切り分ける**ときの設計テンプレ  
- レイヤ：[M]（測定モデル）

### Chen et al. (2023) "Towards a Neurometric-based Construct Validity of Trust" (neurometrics)
- 何を測定：脳指標から trust 構成概念妥当性を検討する枠組み  
- 接続：ISS-42で「信頼」を直接測らないとしても、**神経指標の構成妥当性**を語る論点を提供  
- レイヤ：[M/P]

---

## 3.6 "二者系"の測定：相互調整（co-regulation）を代理変数にする系

### Berni et al. (2025) "Together we sync … hyperscanning systematic review"
- 何を測定：相互作用中の脳—脳結合（inter-brain coupling）  
- 接続：辺2/3（提供↔経験）の結果指標として候補。ただし因果向きは慎重に。  
- レイヤ：⚠️[P/M]

---

# 4. 気づいた論点・提案（ISS-42の設計ガードレール）

## 4.1 "代理変数の罠"：主観評定だけで閉じない
- 「安心した」「信頼した」は重要だが、循環定義へ戻りやすい。  
- **観察（行動）×生理（回復）×表象（縦断）**の異種データで三点固定するのが堅い。

## 4.2 H13（修復可能性）を「辺」側に埋め込む
- H13は"信頼の根底"とされているが、概念として置くと循環する。  
- 代わりに、**repair eventの頻度・成功率・速度**という代理変数として、辺に実装する。

## 4.3 bs/pl の測定は "同一回路で二つの時間スケール" を狙う
- 同じ vmPFC–扁桃体系に対して  
  - bs：DTI・縦断表象  
  - pl：課題結合・自律神経  
  を当てると、概念の一貫性が保てる。

## 4.4 ⚠️ 牽強付会が出やすい領域（事前注意）
- オキシトシン等の単一分子で信頼を語る（再現性・文脈依存が強い）  
- 同期（心拍同期・脳同期）を"原因"と見なす（多くは結果指標）  
- 質問紙だけで bs と pl を切る（構造/回路の議論とズレやすい）

---

## 4.5 次アクション提案（ISS-42の具体化）

1. **「辺」ごとに最小プロトコル（計測パッケージ）を定義**  
   - 辺1：入力品質（sensitivity/repair）＋受け手回復（HRV/cortisol）＋縦断表象（AAI/SBK）  
   - 辺2：提供行動（support/repair）＋提供者の安定（HRV）＋抱持課題  
   - 辺3：受け手の探索/復帰行動＋生理回復＋学習率（trust game更新）

2. **統計モデルは "Stock–Flow" を明示**（BSPL整合）  
   - bs = latent stock（縦断でゆっくり）  
   - pl = latent state（EMA/課題で早い）  
   - それぞれに観測指標を複数割り当て、測定誤差を分離する。

---

## 参考（リンク）
- Kim et al., 2009 (DTI + fMRI): https://pmc.ncbi.nlm.nih.gov/articles/PMC2791525/  
- Tromp et al., 2012 (DTI + fMRI): https://jamanetwork.com/journals/jamapsychiatry/fullarticle/1356405  
- Vrtička et al., 2008 (PLOS ONE): https://journals.plos.org/plosone/article/file?id=10.1371%2Fjournal.pone.0002868&type=printable  
- Bernheim et al., 2022 (attachment representation fMRI): https://pmc.ncbi.nlm.nih.gov/articles/PMC8908102/  
- Roisman et al., 2002 (earned secure longitudinal): https://pubmed.ncbi.nlm.nih.gov/12146743/  
- Roisman et al., 2006 (earned secure methods): https://pubmed.ncbi.nlm.nih.gov/16460525/  
- van IJzendoorn et al., 2019 (intergenerational "bridges"): https://www.sciencedirect.com/science/article/abs/pii/S2352250X18300368  
- Ajenaghughrure et al., 2020 (psychophysiology trust mapping): https://www.mdpi.com/2414-4088/4/3/63  
- van der Werff et al., 2019 (trait-state trust propensity model): https://pmc.ncbi.nlm.nih.gov/articles/PMC6848461/  
- Chen et al., 2023 (neurometrics trust): https://elifesciences.org/reviewed-preprints/90096  
- Berni et al., 2025 (hyperscanning review): https://pmc.ncbi.nlm.nih.gov/articles/PMC12863086/
