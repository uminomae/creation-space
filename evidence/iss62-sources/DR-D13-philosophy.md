# DR-D13-philosophy.md — D13 哲学 ディープリサーチ一次ソース

**Issue**: #62 Step 6
**ソース**: ChatGPT Deep Research / deep-research (2026-02-24)
**レビュー**: Claude / claude-opus-4-5 (2026-02-25)
**指示書**: `chatgpt/inbox/REQ-GPT-20260224-D13_philosophy.md`
**GPT出力**: `chatgpt/output/d13deep-research-report.md`

---

## レビュー結果サマリー

| # | 候補名 | triage | 縁マッピング | 理由 |
|---|--------|--------|------------|------|
| 001 | Whitehead 過程哲学 | ✅ Accept | 🟡 | 渦（concrescence）・束（satisfaction）の対応が明瞭 |
| 002 | Dewey 反省的思考 | ✅ Accept | 🔴 | **一次文献で5段階列挙。全候補中最強の構造対応** |
| 003 | Levinas 他者論 | 🟡 CA | 🔴 | 縁（face-to-face）は深いが全体構造弱く牽強付会リスク高 |

**Accept 2件 / CA 1件**

---

## 哲学-001: Whitehead の過程哲学（哲学的実在＝生成プロセス）

### [P] 確立された事実
- Process and Reality (1929) で、実在の基本単位を "actual occasion" として設定。固定実体ではなく出来事的存在
- actual occasion は過去からのデータ移送（prehension）を "concrescence（合生）" で統合し、新たなデータとなる
- 合生の定式: "the many become one, and are increased by one"
- 合生完了で "satisfaction（充足）" に達し、superject として後続の occasion のデータになりつつ、主観的即時性は "perish"

### 5段階対応

| 5段階 | 対応概念 | 強度 |
|--------|---------|------|
| 場 | actual world（過去occasion群が与えるデータの場） | 高 |
| 波 | prehension / feeling（過去を感じ取る初動） | 中 |
| 縁 | nexus / 内的関係づけ（多から関係の網目が立つ） | 中 |
| 渦 | concrescence（統合の自己増幅・収束） | 高 |
| 束 | satisfaction / superject（結実した新規データ） | 高 |

### 構造類似の質
「前提場→受容の立ち上がり→関係編成→統合の収束→結実（次の前提へ）」という循環が理論内に自然に読める。特に "the many become one" は束の定義そのもの。ただし5段階モデル側の語義が未確定である以上、対応は "指し示し" として留める。

### スケール記述（TC-019）
- **形而上学的**: actual occasion（最小単位）→ nexus（複合体）→ society（持続的構造）→ cosmic epoch（宇宙的秩序）
- **フラクタル注記**: 「prehension→concrescence→satisfaction」の反復が全スケールで同型的に記述される

### 牽強付会リスク: 中
5段階モデルの各語（場/波/縁/渦/束）の意味を恣意的に当てはめると段階の切り方が増殖する。Whitehead自身のプロセス記述に忠実に留めることが重要。

### 主要文献
- Whitehead, A. N. (1929). *Process and Reality: An Essay in Cosmology*. Macmillan.
- Stanford Encyclopedia of Philosophy, "Process Philosophy" / "Alfred North Whitehead"

---

## 哲学-002: Dewey の反省的思考と探究（5段階列挙）

### [P] 確立された事実
- How We Think (1910) で反省を「5つの論理的に区別されるステップ」として明示的に列挙:
  (i) felt difficulty（感じられた困難）
  (ii) 困難の所在と定義
  (iii) 解決案の示唆
  (iv) 推論による展開
  (v) 観察と実験による採否
- 第1・第2ステップは融合しうる（不安や衝撃が先に来て、後から問題が明確化される場合がある）
- 探究の開始は "feeling of something amiss"（何かがおかしいという感覚）
- 探究の終点は "indeterminate situation" を "determinate one" へ変換すること

### 5段階対応

| 5段階 | 対応概念 | 強度 |
|--------|---------|------|
| 場 | 状況（conditions）＋目的（intended result） | 高 |
| 波 | felt difficulty / もやっとした不一致感 | 高 |
| 縁 | 困難の所在と定義（問題定式化＝要素の関係づけ） | 高 |
| 渦 | 解決案の示唆→推論による展開（仮説＋含意推論） | 高 |
| 束 | 観察・実験による採否（信念として束ねる） | 高 |

### 構造類似の質
**全30領域を通じて最も直接的な構造対応の可能性**。Dewey自身が5段階を一次文献で列挙しており、"段階数合わせ" による無理が最小化される。特に「felt difficulty → problem formulation → hypothesis → reasoning → testing」は場→波→縁→渦→束の流れとほぼ同型。

### スケール記述（TC-019）
- **個人認知**: 一人の思考者による反省プロセス
- **教育**: 教育方法論としての探究学習
- **社会**: 民主主義的問題解決の基盤（Deweyの社会哲学への接続）
- **フラクタル注記**: 同じ5段階が個人の思考→教室→社会で反復

### 牽強付会リスク: 低
Dewey自身が5段階を列挙しているため、段階数合わせのリスクが最小。ただし「創造一般」への拡張（芸術的生成 vs 問題解決的生成）は解釈が分かれ得る。

### 主要文献
- Dewey, J. (1910). *How We Think*. D.C. Heath & Co. — "Five distinct steps in reflection" 節
- Stanford Encyclopedia of Philosophy, "John Dewey"（探究の5相整理）

---

## 哲学-003: Levinas の他者論【CA】

### CA理由
1. **R-1弱**: 全体の構造類似が弱い（場中/波中/渦中/束低）。GPT自身が牽強付会リスク「高」と評価
2. **思想的抵抗**: 出来事性を段階に分解すること自体がレヴィナスの「全体化への抵抗」に反する
3. **縁の独自価値**: face-to-face（対面）= 非対称な関係は、縁の概念を哲学的に最も深く照らす
4. **昇格条件**: 縁の一点に焦点を絞った「縁の哲学的深化」エントリとして再構成すれば昇格可能

### 要約（参考）
- Totalité et Infini (1961) で倫理を第一哲学として再定義
- 他者の「顔」が言葉以前に命令として働き、主体の自由を中断する
- face-to-face の非対称な関係が「縁」として最も深い哲学的根拠を提供
- 文献: Levinas, *Totalité et Infini* (1961), Stanford Encyclopedia

---

## 哲学 総評

**構造類似の全体的強度**: 中（Deweyは高寄り、Whiteheadは中〜高、Levinasは中〜低）

**最も構造類似が高い候補**: PH-002（Dewey 反省的思考）
一次文献で5段階が明示されており、対応が最短距離で成立する。全30領域で最も直接的な構造対応の候補。

**この領域の独自性**:
同じ「プロセス」でも3つの位相が異なる:
- Whitehead = 存在論（実在の基礎を生成で捉える）
- Dewey = 方法論（探究・反省の手続き）
- Levinas = 倫理的出来事（遭遇が責任を起動）
この多角性により、5段階モデルを「創造プロセスの一般形」として照射できる幅が広がる。

**既存エントリ（EV-PH-001〜014）との関係**:
既存は東洋思想（国産み神話、般若心経、道元等）と西洋思想（弁証法、個体化論等）が中心。本3件はプロセス哲学・プラグマティズム・現象学という未カバー系譜を追加し、領域内のカバレッジを拡大。
