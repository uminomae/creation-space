# On the Magnetic Properties of Superconductors of the Second Group

**source_id**: D02-S03 | **domain_id**: D02
**access_status**: raw-confirmed
**読解日**: 2026-04-10 | **読解者**: Claude Opus 4.6 (1M context)
**読解方法**: Read (PDF)
**原典ページ数**: 9 (pp. 1174-1182) | **読解ページ範囲**: 全ページ (pp. 1174-1182)

---

## 1. 書誌情報

- **著者**: A. A. Abrikosov
- **タイトル**: On the Magnetic Properties of Superconductors of the Second Group
- **出典**: Soviet Physics JETP, Volume 5, Number 6, pp. 1174-1182 (December 15, 1957). Originally: J. Exptl. Theoret. Phys. (U.S.S.R.) 32, 1442-1452 (June, 1957)
- **所属**: Institute of Physical Problems, Academy of Sciences, U.S.S.R.
- **DOI / URL**: (翻訳版; 原文はロシア語)

## 2. 要旨（読んだ内容に基づく）

Ginzburg-Landau 理論のパラメータ kappa が 1/sqrt(2) より大きい超伝導体（第二群）の磁気的性質を理論的に解析した論文。第二群超伝導体では、上部臨界磁場 H_c2 の近傍で常伝導状態への転移が二次相転移として生じ、その際の秩序パラメータ Psi が周期的な格子構造をとることを示した。磁場が低下すると量子化された磁束フィラメント（渦糸）が形成され、これらが正方格子または三角格子を構成する「混合状態」が存在することを理論的に予測した。Pb-Tl 合金などの実験データとの定量的比較により、理論の妥当性を検証した。

## 3. 主要主張（原文引用付き）

### 主張 1: 第二群超伝導体の定義と分類

> "the parameter kappa entering into the Ginzburg-Landau theory is less than 1/sqrt(2), and for the second group it is greater than 1/sqrt(2)." (p. 1174)

Ginzburg-Landau パラメータ kappa の値により超伝導体を二群に分類した。kappa > 1/sqrt(2) の第二群では表面エネルギーが負になり、第一群とは本質的に異なる磁気的性質を示す。

### 主張 2: 上部臨界磁場近傍での秩序パラメータの周期構造

> "This form of Psi is a solution of the linear equation, and refers in facts to H_0 = kappa." (p. 1175)

> "Thus |Psi|^2 has the symmetry of a square lattice." (p. 1177)

転移点近傍で秩序パラメータ Psi は周期関数の形をとり、自由エネルギーを最小化する構造として正方格子（N=1 の場合）が得られた。beta の最小値は beta = 1.18 と数値計算で求められた。ただし三角格子（beta = 1.16）がさらにエネルギー的に有利であることも脚注で言及されている。

### 主張 3: 混合状態と磁束フィラメント（渦糸）の形成

> "Let us call this the mixed state." (p. 1177)

> "This pattern reminds one of the distribution of vortex filaments, as proposed by Onsager and Feynman." (p. 1178)

常伝導でも超伝導でもない「混合状態」の存在を提唱した。磁場侵入の微視的構造として、超伝導秩序パラメータが中心でゼロになり位相が 2pi 変化する渦糸フィラメントのパターンを示し、これが Onsager-Feynman のヘリウム II における渦糸と類似していることを指摘した。

### 主張 4: 下部臨界磁場と磁束量子化

> "It follows from this that the filaments start being formed when the field strength H_0 attains the value H_c1 = epsilon kappa / 4 pi." (p. 1179)

> "B = 2 pi n / kappa." (p. 1179)

渦糸が形成され始める下部臨界磁場 H_c1 を導出した。磁束は個々のフィラメントに量子化され、磁気誘導 B はフィラメント密度 n に比例する。

### 主張 5: 正方格子から三角格子への転移

> "one sees clearly that for sufficiently small B there should be a transition to the triangular modification." (p. 1180)

> "The value of H_0 at the transition point is determined by setting the free energy equal to F_1 - 2H_0 B, and is H_1' = H_c1 + 0.0394/kappa." (p. 1180)

磁場強度により渦糸格子の対称性が変化し、低磁場では三角格子が、それ以上の磁場では正方格子が安定であることを自由エネルギーの比較から示した。

### 主張 6: 実験との定量的比較

> "It is seen from the table that the data for tan alpha are in very good agreement with the theory." (p. 1181)

Shubnikov, Khotkevich, Shepelev, Riabinin (1937) の Pb-Tl 合金の実験データと理論的予測を比較し、H_c2 近傍の磁化曲線の傾き tan alpha について 15% 以内の一致を確認した。H_c1 の理論値と実験値は同じオーダーだが定量的一致はやや劣る。

## 4. 方法論

Ginzburg-Landau の現象論的超伝導方程式（式 (2), (3)）を出発点とし、上部臨界磁場 H_c2 近傍で |Psi|^2 << 1 の近似のもとに秩序パラメータの解析解を構築した。Psi を振動子関数 psi_n(x) の線形結合として展開し（式 (8)）、非線形項を摂動的に取り込んで自由エネルギー（式 (17)-(19)）を最小化することで、パラメータ beta の最小化問題に帰着させた。

渦糸が十分離れている場合（kappa >> 1）には、個々のフィラメントを円筒対称で扱い（式 (25)-(30)）、フィラメント間相互作用を Bessel 関数 K_0 で記述した（式 (39)-(41)）。正方格子と三角格子の自由エネルギーを漸近展開で比較した。

実験との比較（第3節）では、H_cm と kappa の二つのパラメータを実験の磁化曲線から決定し、理論曲線との整合性を検証した。

## 5. 5段階との対応候補

| 段階 | 対応候補 | 強度 | 原文引用 |
|------|---------|------|---------|
| 1 場 (Field) | 超伝導凝縮体（一様な秩序パラメータ Psi の状態） | 弱 | "the superconductivity is maintained at fields greater than H_cm at which equilibrium could exist between the normal and the superconducting states" (p. 1175) |
| 2 波 (Wave) | 秩序パラメータの空間的揺らぎ・周期構造の出現 | 弱 | "it is natural to pick Psi in the form Psi = sum C_n e^{ikny} psi_n(x)" (p. 1175) |
| 3 縁 (Relation) | なし | なし | |
| 4 渦 (Vortex) | 磁束渦糸（vortex filament）の形成 | 強 | "This pattern reminds one of the distribution of vortex filaments, as proposed by Onsager and Feynman." (p. 1178) |
| 5 束 (Bundle) | 渦糸格子（正方・三角格子としての集団構造） | 弱 | "the structure of the field penetration... is periodic with the symmetry of a square lattice" (p. 1177) |

**判定基準**:
- **強**: 著者が直接その概念・構造を論じており、5段階の定義と明確に対応する
- **弱**: 構造的類似はあるが、著者の文脈・意図とは異なる読みである
- **なし**: 対応が見出せない。無理に作らない

**注意**: Stage 4（渦）のみが「強」判定。論文の中心的成果である磁束渦糸（vortex filament）は、5段階モデルの「渦 = 個として立ち上がる」と直接対応する。渦糸は中心で Psi = 0、位相が 2pi 回転する自己完結した構造として「個体化」の物理的実例である。Stage 1, 2, 5 は構造的類似に留まり、著者の意図とは異なる読みになるため「弱」とした。Stage 3 は本論文に対応する記述が見出せなかった。

## 6. 限界・留意事項

- 本論文は Ginzburg-Landau の現象論的理論に基づいており、微視的（BCS 的）基礎づけは含まれていない。著者自身も kappa が非常に大きくない場合の定量的限界を認めている。
- 実験との比較は主に Pb-Tl 合金系に限られ、他の材料系への一般化は本論文の射程外である。
- 三角格子が正方格子よりエネルギー的に有利であるという結果は脚注と簡潔な比較で述べられているのみであり、詳細な解析は後続研究に委ねられている。
- 翻訳版（英語）を読解しており、ロシア語原文との差異が存在する可能性がある。翻訳者は E. S. Troubetskoy および E. J. Saletan。

## 7. 未読解セクション

全ページ読了。
