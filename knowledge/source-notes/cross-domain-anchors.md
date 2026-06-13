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

## 一覧（4原典・9 source-note）

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

## 不変条件

- 本一覧の原典の source-note を改訂するときは、**同一原典を共有する全 source-note**（上表の同一行グループ）への影響を確認する。
- 新たにクロス領域 anchor（source_id の D番号 ≠ PDF の D番号）を追加するときは、本ドキュメントに追記し、manifest の注記列に再利用元を明記する。
- 検査で「D番号不一致」を検出した場合、本ドキュメントに記載があれば正規。無ければ新規クロス領域 anchor として本ドキュメントに追記するか、誤登録として修正する。

## 関連

- cs#245 — 自然言語デバッグ（本一覧の発見元。Phase B 書誌照合で `bib-crosscheck.sh` が D番号不一致を検出）
- `.claude/rules/source-note-invariants.md` §7 — クロス領域 anchor の扱い
- `transform/domains/cross-domain-reference.md` — 領域間の知見配置ルール（別事象）
