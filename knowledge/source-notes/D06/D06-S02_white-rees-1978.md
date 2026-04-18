# Core condensation in heavy halos: a two-stage theory for galaxy formation and clustering

**source_id**: D06-S02 | **domain_id**: D06
**access_status**: url-verified
**読解日**: 2026-04-10 | **読解者**: Claude Opus 4.6 (1M context)
**読解方法**: WebFetch (URL) -> Read (PDF)
**原典ページ数**: 18 | **読解ページ範囲**: 1-18（全ページ）

---

## 1. 書誌情報

- **著者**: S. D. M. White and M. J. Rees
- **タイトル**: Core condensation in heavy halos: a two-stage theory for galaxy formation and clustering
- **出典**: Monthly Notices of the Royal Astronomical Society, Vol. 183, pp. 341-358 (1978)
- **DOI / URL**: https://doi.org/10.1093/mnras/183.3.341

## 2. 要旨（読んだ内容に基づく）

宇宙の物質の大部分は初期に小さな「暗い」天体に凝縮し、その後階層的クラスタリングを経て大きな構造を形成したと提案する論文。銀河形成を純粋な重力過程（N体効果、クラスタリング）とガス力学的過程（散逸と放射冷却）の二段階に分けて説明する。暗黒物質ハロの中でガスが冷却・凝縮し、銀河は広大なダークハロに埋め込まれた集中した光る核として形成されるというモデルを提唱する。このモデルでは密度パラメータ Omega が約 0.2、暗黒物質が全質量の約80%を占め、観測される銀河の光度関数や半径と整合する。

## 3. 主要主張（原文引用付き）

### 主張 1: 銀河形成には散逸過程が不可欠である

> "The observed sizes of galaxies and their survival through later stages of the hierarchy seem inexplicable without invoking substantial dissipation; this dissipation allows the galaxies to become sufficiently concentrated to survive the disruption of their halos in groups and clusters of galaxies." (p.341)

純粋な重力的（無散逸的）クラスタリングだけでは銀河の観測サイズと、銀河団内での銀河の生存を説明できない。ガスの散逸冷却により銀河が十分に集中することで、ハロが破壊されても生き残れる。

### 主張 2: 階層的クラスタリングにおける下部構造の消滅

> "a three or four member group which is more tightly bound than its constituent members will be transformed by relaxation effects into an amorphous system in <= 1 crossing time." (p.347)

無散逸クラスタリングでは、各段階で崩壊した系の下部構造が約1交差時間で消滅し、自己相似的な質量分布が維持される。これは N 体シミュレーションでも確認されている。

### 主張 3: 冷却時間による銀河質量の上限設定

> "If t_cool <= t_dyn, any gas within the potential well must cool and collapse to the centre, probably fragmenting into stars." (p.348)

ガスの冷却時間（t_cool）と力学的時間（t_dyn）の比較が銀河形成の鍵となる。t_cool が t_dyn より短ければガスは冷却・凝縮して星に断片化するが、t_cool > t_dyn の場合はガスが凝縮できない。この条件が銀河の最大質量・光度の上限を決定する。

### 主張 4: 小さな銀河が先に形成され、光る核として生き残る

> "the luminous material that condensed in their centres may nevertheless have survived to the present day in identifiable stellar systems." (p.349)

低質量ハロ内で初期に凝縮した恒星系は、後にハロが大きな系に合体・破壊されても、光る核として現在まで生き残る。これが大きな銀河の周囲に衛星銀河が存在する理由を自然に説明する。

### 主張 5: 光度関数の観測との整合

> "the form and scale of our luminosity function compare quite well, at least at the bright end, with those of the fitting functions empirically derived by Schechter (1976)." (p.354)

具体的なモデルパラメータ（Omega = 0.2, h = 0.5, F_i = 0.2）を用いると、銀河の光度関数が観測されたシェヒター関数と明るい端で良い一致を示す。

## 4. 方法論

解析的理論モデルの構築。主な手法は以下の通り:

1. **初期密度揺らぎのべき乗則スペクトル仮定**: 密度揺らぎの振幅がべき乗則 M^{-alpha} に従うと仮定し、Press & Schechter (1974) の質量関数を拡張して階層的クラスタリングの時間発展を記述。
2. **銀河共分散関数による規格化**: 観測された銀河の二点相関関数を用いて、現在ターンアラウンドしている質量スケールのパラメータ（M_0, r_0, v_0）を決定。
3. **冷却・散逸の解析**: 制動放射・再結合・衝突励起による冷却時間を計算し、ポテンシャル井戸内でガスが凝縮できる条件（t_cool < t_dyn かつ t_cool < H^{-1}）を導出。
4. **断片化条件**: ガスが自己重力的になるための臨界半径条件（r_gas <= F^{1/3} r）を設定。
5. **光度関数の導出**: 質量-密度の同時分布関数から光度関数を積分で導出し、観測値と比較。
6. **下部構造消滅の解析的推定**（付録）: Spitzer (1958) の衝撃的遭遇の理論を拡張し、クラスタリングで形成された系内の下部構造が約1交差時間で破壊されることを示す。

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | 初期の一様な宇宙（べき乗則揺らぎを持つ密度場） | 弱 | "the present inhomogeneities in the Universe developed from initial density perturbations with a power-law spectrum" (p.344) |
| 2 波 (Wave) | 密度揺らぎの成長と非線形化 | 弱 | "the density perturbation on each mass scale grows as (delta rho / rho) proportional to (1+z)^{-1} until the amplitude becomes non-linear" (p.344) |
| 3 縁 (Relation) | なし | なし | |
| 4 渦 (Vortex) | 冷却・凝縮による銀河核の形成（個としての立ち上がり） | 弱 | "Every galaxy thus forms as a concentrated luminous core embedded in an extensive dark halo." (p.341) |
| 5 束 (Bundle) | 階層的クラスタリングによる銀河団・群の形成 | 弱 | "these objects must subsequently have undergone hierarchical clustering, whose present scale we infer from the large-scale distribution of galaxies" (p.341) |

**判定基準についての注記**: 本論文は銀河形成の物理モデルを構築する天体物理学の理論論文であり、5段階モデル（創造プロセスの記述）とは目的・文脈が根本的に異なる。上記の対応はいずれも構造的類似にとどまり、著者の意図する文脈とは異なる読みである。特に「場」「波」への対応は、物理学における密度場と揺らぎという概念が5段階モデルの「場」「波」と表面的に類似するにすぎない。「渦」への対応も、凝縮による個の形成という構造的類似はあるが、5段階モデルの「包摂・融合」というプロセスとはむしろ逆方向（散逸・収縮）である。

## 6. 限界・留意事項

- 本論文は 1978 年の古典的理論論文であり、現在の標準的宇宙論パラメータ（Omega_m ~ 0.3, Omega_Lambda ~ 0.7）とは異なるモデル（Omega = 0.2, Lambda = 0）を前提としている。ただし、二段階形成の基本的枠組み自体はその後の Cold Dark Matter モデルに受け継がれた。
- 著者自身が「schematic nature of the theory」(p.354) と述べているように、多くの簡略化がある（断片化の詳細、星形成の物理、フィードバック過程などは省略されている）。
- 暗黒物質の正体については特定していない（"nothing in our discussion would change if the dark matter consisted of, for instance, massive neutrinos, or black holes which formed before recombination" (p.342)）。
- 5段階モデルとの対応はいずれも弱く、本論文を5段階モデルの直接的な証拠として用いることは適切でない。構造形成過程の一例として参照する程度にとどめるべきである。

## 7. 未読解セクション（部分読解の場合）

全ページ読了
