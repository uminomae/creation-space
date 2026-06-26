# クロス領域 anchor 一覧（複数領域で共有される原典）

> **目的**: 同一原典を複数領域の anchor として再利用しているケースを文脈付きで記録し、
> 「単純重複だから片方を消す」という将来の誤判断を防ぐ。
>
> **原則（cs#245 調査で確立）**: creation-space は「創造の5段階構造」が30領域にどう現れるかを探索する。
> 一部の原典は本質的に複数領域に跨る（認知の身体化、日本的「花」の創造論、レジリエンス概念など）。
> これらは異なる領域観点で**別々の source-note**として読解されており、**重複ではなく正規の複数領域 anchor** である。

## 重要: 検査スクリプトでの扱い

- `knowledge/raw/` の PDF ファイル名の D番号は「**最初にその原典を raw 確保した領域**」を示すだけで、
  その原典が属する唯一の領域を意味しない。
- したがって「source_id の D番号 ≠ PDF ファイル名の D番号」は**齟齬ではない**。
  `bib-crosscheck.sh` / `count-manifest.sh` 等でこのパターンを検出しても、本ドキュメントに記載のものは正規。
- 同様に、版違いファイル（例: van Gennep 1909仏語原著 と 1960英訳）が未参照として残るのも別事象（重複ではない）。

## 一覧（7原典・15 source-note）

### 1. Varela, Thompson & Rosch (1991) *The Embodied Mind*
- **PDF**: `knowledge/raw/D14_varela_1991_embodied-mind.pdf`（D14 で初確保）
- **なぜ複数領域か**: エナクティビズム（認知は表象でなく身体的行為による世界の制定）は認知科学を横断し、神経科学と心理学の双方の基盤理論。

| source_id | 領域 | 読解の重点 |
|---|---|---|
| **D14-S01** (原典側) | 心理学 | 基本的循環性・マインドフルネス方法論・西洋現象学と仏教瞑想の対話（認識論的観点、導入+核心章+結論） |
| **D08-S08** (再利用) | 神経科学 | エナクション全体・色彩知覚のケーススタディ・selfless minds・進化=自然漂流（生物学的観点、本文全体を広く） |

### 2. 世阿弥『風姿花伝』（15世紀）
- **PDF**: `knowledge/raw/D28_zeami_classics_part1.pdf`（D28 で初確保、Wikimedia Commons / NDL scan）
- **なぜ複数領域か**: 「花」「幽玄」「一座建立」の概念が、能の演技論（舞台芸術）・花の美学・共同体的伝統知の3領域に対応する。日本的創造論の中核テキスト。

| source_id | 領域 | 読解の重点 |
|---|---|---|
| **D28-S01** (原典側) | 舞台芸術 | 能の演技論・修行段階・花の獲得過程 |
| **D15-S03** (再利用) | 美学 | 「花」の美学・幽玄 |
| **D30-S07** (再利用) | 伝統知 | 「一座建立の寿福」＝共同体的・場の知 |

### 3. Dewey, J. (1934) *Art as Experience*
- **PDF**: `knowledge/raw/D13_dewey_1934_art-as-experience.pdf`（D13 で初確保、Internet Archive）
- **なぜ複数領域か**: 「an experience（一つの経験）」概念がプラグマティズム哲学と美学（芸術経験論）の双方の源流。

| source_id | 領域 | 読解の重点 |
|---|---|---|
| **D13-S09** (原典側) | 哲学 | プラグマティズム・経験論 |
| **D15-S09** (再利用) | 美学 | 芸術経験（Ch.1 "The Live Creature", Ch.3 "Having an Experience", Ch.5 "The Expressive Object"） |

### 4. Holling, C. S. (1973) *Resilience and Stability of Ecological Systems*
- **PDF**: `knowledge/raw/D12_holling_1973_resilience-stability.pdf`（D12 で初確保、IIASA OA）
- **なぜ複数領域か**: レジリエンス概念は生態学で生まれ、adaptive governance / polycentric な制度設計の源流として法学・政治学に波及した（Ostrom 系譜）。

| source_id | 領域 | 読解の重点 |
|---|---|---|
| **D12-S03** (原典側) | 農学生態 | 生態系のレジリエンスと安定性 |
| **D20-S13** (再利用) | 法学・政治学 | adaptive governance / polycentric 制度設計の源流（Stage 1-4、D20視点で 1場・5束 強） |

### 5. Olsson, Folke & Hahn (2004) *Social-Ecological Transformation for Ecosystem Management*
- **URL**: https://www.ecologyandsociety.org/vol9/iss4/art2/print.pdf（OA、ES 誌上論文）
- **なぜ複数領域か**: スウェーデン湿地管理の事例が、(1) 既存体制→危機→新ガバナンス制度化という「制度変化」の歴史的過程（D16）と、(2) 在来知（農業慣行・博物学的知識）の動員・統合・組織化（D30）の両面を同時に記述している。

| source_id | 領域 | 読解の重点 |
|---|---|---|
| **D16-S18** (原典側) | 歴史・制度変化 | 制度変化の3段階（準備→政策の窓→新体制のレジリエンス構築）・Kingdon 政策の窓理論・政策起業家的行動 |
| **D30-S15** (再利用) | 伝統知 | 在来知（農業実践・博物学的観察）の蓄積・統合・動員プロセス・「水の国」という共通概念による知識の縁結び |

### 6. James, W. (1890) *The Principles of Psychology, Vol. 1*
- **URL**: https://archive.org/details/theprinciplesofp01jameuoft（OA スキャン、public。local raw PDF なし＝両 source-note とも url-verified）
- **なぜ複数領域か**: 『心理学原理』は心理学（自然科学としての心）と心の哲学（自己論・過程哲学）の双方の源流であり、章ごとに異なる領域観点で読める。意識の流れ・習慣は心理学、自己論（the I/the me・Pure Ego）・関係の感覚（fringe）は哲学。

| source_id | 領域 | 読解の重点 |
|---|---|---|
| **D14-S04** (原典側) | 心理学 | Ch.IV「Habit」(神経可塑性・行動連鎖) と Ch.IX「Stream of Thought」の意識流れ五特性（連続性・選択性・個人性）。場・渦を強対応 |
| **D13-S12** (再利用) | 哲学 | Ch.X「Consciousness of Self」(the I/the me・Pure Ego 三理論・人格同一性=passing Thought の appropriation) と Ch.IX の "feelings of relation"/"fringe" の過程哲学的含意・mind-stuff 批判。縁・渦を強対応（引用は D14-S04 と完全非重複） |

### 7. Strogatz, S. H. (2001) *Exploring complex networks*. *Nature* 410.
- **PDF**: `knowledge/raw/D02_strogatz_2001_exploring-complex-networks.pdf`（D02 で初確保、著者個人サイト OA）
- **なぜ複数領域か**: 複雑ネットワーク科学のレビューだが、(1) 同期相転移・small-world・scale-free の数理構造（複雑系物理 D02）と、(2) 工学インフラの故障伝播・制御目標としての同期・自己修復ネットワーク設計・探索アルゴリズム複雑性（工学/情報科学 D07）の双方の基盤となる。冒頭の動機（送電網カスケード故障・Love Bug ワーム）と結語（自己修復ネットワーク設計）は工学的、本体の数理モデルは物理的。

| source_id | 領域 | 読解の重点 |
|---|---|---|
| **D02-S13** (原典側) | 複雑系物理 | 6複雑性・Winfree/Kuramoto 同期相転移（Kc 閾値）・Watts-Strogatz small-world 構造・scale-free 次数分布（pk~k^-3）・ランダム故障耐性。Stage 3-5 強 |
| **D07-S13** (再利用) | 工学・情報科学 | カスケード故障/ワーム伝播・「構造が機能を決める」命題・レーザアレイ出力最大化（N²）としての同期目標・信号伝播/計算/探索の性能・自己修復ネットワーク設計。Stage 2 波が強（引用は D02-S13 と完全非重複） |

## 不変条件

- 本一覧の原典の source-note を改訂するときは、**同一原典を共有する全 source-note**（上表の同一行グループ）への影響を確認する。
- 新たにクロス領域 anchor（source_id の D番号 ≠ PDF の D番号）を追加するときは、本ドキュメントに追記し、manifest の注記列に再利用元を明記する。
- 検査で「D番号不一致」を検出した場合、本ドキュメントに記載があれば正規。無ければ新規クロス領域 anchor として本ドキュメントに追記するか、誤登録として修正する。

## 関連

- cs#245 — 自然言語デバッグ（本一覧の発見元。Phase B 書誌照合で `bib-crosscheck.sh` が D番号不一致を検出）
- cs#249 — Olsson et al. (2004) クロス領域 anchor 追加（D16-S18 / D30-S15）
- cs#249 — Strogatz (2001) クロス領域 anchor 追加（D02-S13 / D07-S13）。D02 既読 PDF を D07 工学/情報視点で再読、引用非重複
- `.claude/rules/source-note-invariants.md` §7 — クロス領域 anchor の扱い
- `transform/domains/cross-domain-reference.md` — 領域間の知見配置ルール（別事象）
