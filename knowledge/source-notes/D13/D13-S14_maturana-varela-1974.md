# Autopoiesis: The Organization of Living Systems, Its Characterization and a Model

**source_id**: D13-S14 | **domain_id**: D13
**access_status**: url-verified
**読解日**: 2026-06-22 | **読解者**: Claude Sonnet 4.6
**読解方法**: 部分読解（abstract のみ）。UChile リポジトリ提供 PDF はカバーページ（1頁・abstract のみ）。本文 pp.187-196 は ScienceDirect（サブスクリプション要）でブロック、複数ミラーも取得失敗

**原典ページ数**: 10 (pp.187-196) | **読解ページ範囲**: abstract のみ（本文未読）

---

## 1. 書誌情報

- **著者**: F. G. Varela; H. R. Maturana; R. Uribe
- **タイトル**: Autopoiesis: The organization of living systems, its characterization and a model
- **出典**: *BioSystems* (1974) **5**(4), 187–196
- **DOI**: 10.1016/0303-2647(74)90031-8
- **OA リンク（カバーのみ取得）**: http://repositorio.uchile.cl/handle/2250/160309 （UChile リポジトリ。bitstream はカバー1頁＝abstract のみ）

**書誌クロスチェック (cs#250 規律2)**: CrossRef メタデータ（Title="Autopoiesis: The organization of living systems, its characterization and a model" / Authors=Varela, Maturana, Uribe / *Biosystems* Vol 5 Issue 4 / pp.187-196）が manifest 行（Maturana & Varela 1974, *Biosystems* 5(4)）と一致。同定 OK。

> **注記（著者順）**: CrossRef では著者順が Varela, Maturana, Uribe。manifest は慣例的に「Maturana & Varela」と表記。同一論文。

---

## 2. 要旨（abstract に基づく）

> **注記**: 本ノートは UChile リポジトリのカバーページに含まれる abstract のみに基づく部分読解である。本文10頁は未読。

オートポイエーシス（autopoiesis）概念を定式化した古典論文。abstract（全文）は以下の通り簡潔である：

> "We formulate the organization of living organisms through the characterization of the class of autopoietic systems to which living things belong. This general characterization is seen at work in a computer simulated model of a minimal case satisfying the conditions for autopoietic organization."

すなわち、(1) 生物の「組織（organization）」を「オートポイエーシス的システム」というクラスの特徴づけによって定式化し、(2) その一般的特徴づけが、オートポイエーシス的組織の条件を満たす最小事例のコンピュータ・シミュレーション・モデルにおいて実際に機能することを示す、という2点が論文の骨子である。

オートポイエーシス＝「自己（auto）」「制作・産出（poiesis）」とは、システムが自らの構成要素を産出するネットワークによって自己自身を継続的に生成・維持する組織を指す。本論文はその概念の初出定式化と、最小モデルによる実証を試みた原典である。

---

## 3. 主要主張（abstract からの抜粋）

> **注記**: 本文未読のため、原文引用は abstract のみ（p.187 に帰属）。本論文の核心であるオートポイエーシスの形式的定義・6つの判定基準・シミュレーションの詳細は未確認。

### 主張 1: 生物の組織はオートポイエーシス的システムのクラスとして特徴づけられる

> "We formulate the organization of living organisms through the characterization of the class of autopoietic systems to which living things belong." (Abstract, p.187)

生命を「物質」や「構成要素」ではなく「組織（organization）」——すなわち構成要素間の関係のパターン——として定義する点が革新。

### 主張 2: 最小事例のコンピュータ・シミュレーションで概念が機能することを示す

> "This general characterization is seen at work in a computer simulated model of a minimal case satisfying the conditions for autopoietic organization." (Abstract, p.187)

抽象的概念を、計算可能な最小モデル（後に "Protobio" として知られる）で具体化・検証する方法論。

---

## 4. 方法論

> **注記**: abstract のみからの推定。本文の方法論記述は未読。

- **概念定式化＋計算モデル**: 生命の組織を抽象的に特徴づけ（オートポイエーシス）、それをコンピュータ・シミュレーションで最小実装する二段構え
- **「組織」と「構造」の区別**: オートポイエーシス理論の核心は、システムの「組織」（恒常的な関係パターン）と「構造」（具体的構成要素）の区別にあるが、これは abstract には現れず本文に展開されているはず
- **最小事例（minimal case）アプローチ**: 生命の本質的条件を満たす最小限のシステムをシミュレートすることで、必要条件を析出する

---

## 5. cs 5段階モデルとの対応

> **注記**: abstract のみに基づく暫定判定。オートポイエーシス理論の本文を読めば対応が大きく変わりうる。

| 段階 | 対応候補 | 強度 | 根拠（abstract / 概念知識） |
|------|---------|------|---------|
| 1 場 (Field) | オートポイエーシス成立前の構成要素の集まり（未組織化状態）が場に対応しうる。ただし abstract に明示なし | 弱 | （明示なし） |
| 2 波 (Wave) | 構成要素間の反応の開始・差異化が波に対応しうる。シミュレーションにおける分子的相互作用の発生 | 弱 | "minimal case satisfying the conditions" |
| 3 縁 (Relation) | **境界（membrane）の生成**——オートポイエーシスの核心は、システムが自らの境界を産出し維持すること。cs の「境界・関係」と構造的に対応 | 中（概念知識による） | "the organization of living organisms" （組織＝境界を含む関係パターン） |
| 4 渦 (Vortex) | **自己生成的まとまりの立ち上がり**——構成要素を産出するネットワークが閉じて一つの自律的単位になる。cs の「個・立ち上がり、包摂・融合」と対応 | **強** | "the class of autopoietic systems"; "self-producing" 概念 |
| 5 束 (Bundle) | 自己維持される組織の持続的構造。cs の「構造として残る集まり」に対応しうる | 弱 | "satisfying the conditions for autopoietic organization" |

**判定基準の適用**:
- **Stage 4 強（核心的知見、ただし概念知識依存）**: オートポイエーシスの核心は「システムが自らを産出し、自己を一つの単位（unity）として立ち上げる」ことであり、これは cs の渦（個・立ち上がり）と概念的に強く対応する。ただしこの判定は abstract そのものより、オートポイエーシス概念の一般知識に依拠している点に留意が必要
- **境界生成（Stage 3）の重要性**: オートポイエーシス理論では「境界（典型的には膜）をシステム自身が産出する」ことが決定的である。これは cs の「縁（境界で起きる出来事）」と照合できるが、本文未読のため強度は中にとどめる
- **cross-domain 知見の方向性**: オートポイエーシスは「自己が自己を生成する」閉じた循環構造である。これは cs の創造モデルが「外から作られる」のではなく「内発的に立ち上がる」性格を持つ場合の、生物学的・システム論的基礎づけとなりうる

**manifest ヒントからの独立性**: manifest 注記は「オートポイエーシス原典。Stage 2-4」と示す。abstract を独立に読み、論文の骨子が「組織の特徴づけ＋最小モデルによる実証」の二段構えであることを確認した。Stage 対応の判定は abstract が極めて簡潔なため、オートポイエーシス概念の一般知識を補助的に用いざるを得ず、その旨を明記する（本来の精読原則からの逸脱として記録）。

---

## 6. 限界・留意事項

- **部分読解（abstract のみ・しかも極めて簡潔）**: 本ノートの最大の限界。abstract が3文と短く、論文の核心（オートポイエーシスの形式的定義、生物の6判定基準、組織/構造の区別、シミュレーションの実装詳細）はすべて未読。5段階対応はオートポイエーシス概念の一般知識に部分的に依拠しており、原典精読原則からは逸脱している
- **本文アクセス不可**: UChile リポジトリの bitstream はカバーページ1頁（abstract のみ）。本文10頁は ScienceDirect（サブスクリプション要）でブロック。enolagaia.com / Springer / Indiana 等の代替ミラーもすべて取得失敗（HTML エラーページ or 404）
- **概念知識による補完の混入**: 本来 cs source-note は LLM の事前知識で補完しないことが原則。本ノートの §5 Stage 3/4 判定は abstract のみでは導けず、オートポイエーシス概念の一般知識を用いた。この点は明確な限界として記録し、本文取得後の全面改訂を要する

---

## 7. 未読解セクション

**本文全体（pp.187-196）が未読**。3文の abstract のみ読了。以下が未読：
- オートポイエーシスの形式的定義
- 生物システムの判定基準（6 criteria として知られる）
- 「組織（organization）」と「構造（structure）」の区別
- コンピュータ・シミュレーション・モデルの実装（後の "Protobio"）
- 最小オートポイエーシス系の構成要素と動作
- 結論・含意
- References

---

## 関連

- **D13-S15** Lewis (2005) — 同 D13 の動的システム/創発系。自己組織化概念で接続
- **D14-S01 / D08-S08** Varela et al. (1991) *The Embodied Mind* — Varela の後年の著作。オートポイエーシスからエナクティヴィズムへの展開
- cs 5段階 schema: `knowledge/schema/five-stages.md`
- 領域サマリ: `knowledge/source-notes/D13/D13-summary.md`（存在する場合）
