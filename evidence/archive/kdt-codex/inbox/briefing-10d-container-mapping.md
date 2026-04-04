# briefing-10d-container-mapping.md

**タスク名**: TASK #10d — 兆候→Container（介入）対応表
**Type**: C（Creative analysis + Practical design）
**出力先**: `codex/output/REPORT-container-mapping.md`
**作成日**: 2026-02-07
**起点**: `codex/archive/deepdive/REPORT-抱持-observability.md`（§A全段階）、`codex/archive/deepdive/REPORT-抱持-structuring.md`（§A, §C）
**依存**: TASK #10c（[UNCERTAIN]精度上げ）の結果があれば参照する。なければREPORT-抱持-observability.mdの現行版で進行

---

## 0. Source Repository

**リポジトリ**: `uminomae/kesson-driven-thinking`（GitHub, Private）

**作業開始前に、リポジトリ全体のファイル構造を確認し、以下の必読ファイルを全て読み込んでからタスクに着手せよ。**

### 必読ファイル

| 優先度 | パス | 読む理由 |
|--------|------|----------|
| ★★★ | `codex/archive/deepdive/REPORT-抱持-observability.md` | §A全段階の兆候。本タスクの入力 |
| ★★★ | `codex/archive/deepdive/REPORT-抱持-structuring.md` | §A（スペクトラム）、§C（共依存）。Container6類型 |
| ★★★ | `base/schema/core-definitions.md` | D3-a（成立条件の4層）。Container設計の根拠 |
| ★★ | `codex/archive/deepdive/REPORT-evidence-cross-analysis.md` | Container6類型の原典 |
| ★★ | `base/evidence/evidence-psychoanalysis.md` | EV-PA-002（Container-Contained）、EV-PA-004（PS-D） |
| ★★ | `base/evidence/evidence-business-org.md` | EV-BZ-009（ダイアローグ）、EV-BZ-013（TPS）。制度的Container |
| ★★ | `base/evidence/evidence-developmental-psychology.md` | EV-DP-002（安全基地内在化）、EV-DP-004（実行機能） |
| ★★ | `base/evidence/evidence-neuroscience.md` | EV-NS-007（ポリヴェーガル）。安全↔危険の身体的支援 |
| ★ | `base/evidence/evidence-creativity.md` | EV-CR-017（発散保護）、EV-CR-018（外部化） |
| ★ | `base/evidence/evidence-philosophy.md` | EV-PH-005（西田）、EV-PH-007（秘すれば花）。文化的Container |
| ★ | `codex/archive/deepdive/REPORT-抱持-uncertain-resolution.md` | TASK #10cの出力。**存在すれば**参照（なければスキップ） |

---

## 1. Context（タスクの背景）

REPORT-抱持-observability.mdは「いまどの段階にいそうか」を観測する道具を提供した。
しかし**観測の次の問い——「では何をするか」**が未記述である。

本タスクは、各段階で**効果が期待できるContainer（介入）**と**やると段階を落としやすい失敗**を対応表にする。

### Container6類型（既存成果）

REPORT-evidence-cross-analysisで導出済みの6類型を再利用する：

| 類型 | 内容 | 代表Evidence |
|------|------|-------------|
| 対人的Container | 安全基地、師弟、分析者 | EV-PA-002, EV-DP-002 |
| 制度的Container | アンドン、ルール、プロセス | EV-BZ-013 |
| 対話的Container | ダイアローグ、suspension | EV-BZ-009 |
| 外部化Container | メモ、図、プロトタイプ | EV-CR-017, EV-CR-018 |
| 身体的Container | 呼吸法、瞑想、型 | EV-NS-007, EV-PH |
| 文化的Container | 公案、茶道の作法、学問のディシプリン | EV-PH-007 |

---

## 2. Scope（作業範囲）

### §A: 段階×Container効果表（7段階×6類型）

各セルに以下を記述する：

| フィールド | 内容 |
|-----------|------|
| **効果** | ◎高い / ○ある / △限定的 / ×逆効果のリスク |
| **機序** | なぜこのContainerがこの段階で効く/効かないか（1-2文） |
| **具体例** | 対人支援場面での具体的アクション（1文） |
| **Evidence** | EV-ID |
| **タグ** | `[SPECULATIVE]`/`[CONTEXT_DEPENDENT]`等 |

#### 出力形式（1段階分の例）

```markdown
### 段階3: 早期収束

| Container類型 | 効果 | 機序 | 具体例 | Evidence | タグ |
|--------------|------|------|--------|----------|------|
| 対人的 | ○ | 安全な関係が「急がなくてよい」信号を送る | 「まだ決めなくていいよ」と声をかける | EV-DP-002 | [CONTEXT_DEPENDENT] |
| 制度的 | ○ | 「保留」を許可する手続きがあると、個人の耐性に依存しない | 「いったん保留」を議事録に記載する | EV-BZ-009 | |
| 対話的 | ◎ | suspension（判断保留の対話）が早期収束を直接抑制する | 「ほかに考えたことはある？」と問い返す | EV-BZ-009 | |
| 外部化 | ○ | 書き出すと「閉じた」感覚が減る | ホワイトボードに選択肢を並べる | EV-CR-017 | [SPECULATIVE] |
| 身体的 | △ | 直接的な早期収束抑制効果は弱い。ただしLayer 0安定は前提 | 深呼吸を促す（補助的） | EV-NS-007 | [CONTEXT_DEPENDENT] |
| 文化的 | △ | 長期的には効果あるが、即効性は低い | — | — | [SPECULATIVE] |
```

### §B: 段階別の「やってはいけない」（失敗パターン表）

各段階で**段階を落としやすい典型的失敗**を3-5個列挙する。

| フィールド | 内容 |
|-----------|------|
| **失敗行動** | 支援者/制度がやりがちなこと |
| **なぜ落ちるか** | メカニズム（1-2文） |
| **落ちる先** | 段階N → 段階Mへの退行パターン |
| **Evidence** | EV-ID |

#### 出力形式（1段階分の例）

```markdown
### 段階5: 関係依存保持 — やってはいけない

| # | 失敗行動 | なぜ落ちるか | 落ちる先 | Evidence | タグ |
|---|---------|-------------|---------|----------|------|
| 1 | 依存を切り離す（「一人で考えなさい」） | 外的Containerが唯一の保持基盤の段階で撤去すると保持が崩壊 | 段階1-2 | EV-PA-002, EV-DP-002 | [CONTEXT_DEPENDENT] |
| 2 | 「依存は良くない」と説教する | 信頼軸の安全を脅かし、生存軸過剰を引き起こす | 段階2 | EV-PA-004 | |
| 3 | 内在化を急がせる（「もう一人でできるでしょ」） | 撤去が早い。段階6の定着前に足場を外す | 段階3-4 | EV-DP-002 | [CONTEXT_DEPENDENT] |
```

### §C: Container差し込みのタイミング原則

段階判定（REPORT-抱持-observability.md §D.1フロー）と本タスクの効果表を接続する原則を3-5項で記述する。

#### 記述すべき内容

1. **「まずLayer 0を確保」原則**: どの段階でも身体的安全が先。Container投入前のLayer 0チェック
2. **段階に合わないContainerの害**: 段階1-2に対話的Containerを使うと「説教」になりやすい（段階が落ちる）
3. **複数Containerの併用**: 段階5-6では対人的＋外部化の併用が有効な場合がある
4. **Container撤去の段階性**: 段階5→6への移行期は「少しだけ足りない」（Winnicott的）が原則
5. **支援者自身の抱持**: Container提供者が自分の抱持を保持できていないと、段階を落とす

---

## 3. Vocabulary Constraints（用語制約）

### 必ず使う用語

| 用語 | 意味 | 注意 |
|------|------|------|
| D1-D4 | コア定義 | 番号を間違えない |
| Layer 0-3 | 4層モデル | 必ず番号付き |
| 生存軸, 信頼軸 | 恐れ/生存 と 愛/関係 | 混同しない |
| 抱持 | 保持機能（大文字W） | |
| Container | 他者が抱持を支える機能（大文字C） | |
| Container6類型 | 対人的/制度的/対話的/外部化/身体的/文化的 | 順番と名称を固定 |
| 段階1-7 | TASK #10の名称を正確に | 名称ブレ防止 |

### 使ってはいけない用語

| 禁止 | 理由 | 代替 |
|------|------|------|
| 「治療」「セラピー」 | 本レポートは診断・治療の代替ではない | 「支援」「Container提供」 |
| 「必ず効く」「確実に」 | 観測指標と同様、効果は文脈依存 | 「〜が期待できる」「〜の可能性がある」 |
| 「この段階の人は」 | 人のラベル化 | 「この段階にいるとき」 |

---

## 4. Safety Valves（安全弁）

| タグ | 使用場面 |
|------|---------|
| `[UNCERTAIN]` | Container効果の確度が低い箇所 |
| `[SPECULATIVE]` | Evidence不足で推定に基づく箇所 |
| `[CONTEXT_DEPENDENT]` | 文脈・関係の質で効果が大きく変わる箇所 |
| `[SCALE_JUMP]` | 個人→集団のスケール移動時（特に制度的/文化的Container） |

**重要**:
- 全42セル（7段階×6類型）を埋める義務はない。Evidenceがなければ空欄＋`[SPECULATIVE]`でよい
- 「やってはいけない」は実践的に重要。遠慮せずに書け。ただし「絶対にやるな」ではなく「やると〜のリスクがある」の書き方で

---

## 5. Completion Criteria（完了条件）

| # | 条件 | 確認方法 |
|---|------|---------|
| 1 | §A: 7段階×6類型の表が全段階分ある | 段階1-7のセクション存在確認 |
| 2 | §A: 各段階で最低3セルに具体的記述がある | セル数を数える |
| 3 | §B: 全7段階に「やってはいけない」が最低2項目ある | 項目数を数える |
| 4 | §B: 各失敗に「落ちる先」（退行パターン）が明記されている | 全項目確認 |
| 5 | §C: タイミング原則が3項目以上ある | セクション確認 |
| 6 | Evidence IDが§A/§Bの50%以上のセルに付記されている | 全体スキャン |
| 7 | Safety Valveタグが適切に使用されている | 全体スキャン |
| 8 | 禁止用語が含まれていない | 全体スキャン |

---

## 6. Output Format（出力形式）

```markdown
# REPORT: 兆候→Container（介入）対応表

- タスク名: TASK #10d — 兆候→Container対応表
- Type: C
- 作成日: YYYY-MM-DD
- 起点: REPORT-抱持-observability.md, REPORT-抱持-structuring.md
- 出力先: codex/archive/deepdive/REPORT-container-mapping.md

---

## 0. イントロ（目的・前提・Container6類型の再固定）

# §A: 段階×Container効果表
## A.1 段階1: 非保持（凍結・解離）
...
## A.7 段階7: 生成的抱持

# §B: 段階別の「やってはいけない」
## B.1 段階1の失敗パターン
...
## B.7 段階7の失敗パターン

# §C: Container差し込みのタイミング原則

# §D: 統合と限界
## D.1 効果表の使い方の注意
## D.2 [UNCERTAIN]残量レポート

## 付録A: 段階×Container効果クイックカード（早見表）
## 付録B: 本レポートが参照した主要ファイル
```

---

## 7. Output Location

```
codex/archive/deepdive/REPORT-container-mapping.md
```

---

## 8. 注意事項

- 本タスクは「対人支援の実践ガイド」の萌芽であるが、**臨床マニュアルではない**。§0イントロで「診断・治療の代替ではない」を必ず明記すること
- Container6類型は既存成果。新しい類型を追加するな。6類型内で記述せよ
- 段階1-2（凍結・闘争逃避）では、対話的/制度的Containerよりも身体的/対人的Containerが先行する。この優先順位を表に反映すること
- **TASK #10cの出力が存在すれば参照**する。特にU-3（内在化判定）の追加指標は§C（タイミング原則）に直結する。存在しなければ現行版で進行
- **TASK #10f（ケースブック）の入力になる**: 本タスクの「やってはいけない」は、ケースブックの失敗ケースの根拠として使われる
