# RECONCILE-D17-linguistics: GPTレビュー突き合わせ表

- **対象evidence**: `base/evidence/evidence-D17-linguistics.md`
- **GPTレビュー**: `chatgpt/output/0302/REVIEW-D17-linguistics.md`
- **実施日**: 2026-03-03
- **実施者**: Claude（Phase 4 Agent-WT）

---

## 突き合わせ表

| # | エントリ/箇所 | GPT指摘 | 重要度 | 修正提案 |
|---|--------------|---------|--------|---------|
| 1 | EV-LI-008 refs: Boroditsky (2001) | 掲載誌が誤り。evidence は *Cognition* 80(1-2) としているが、正しくは *Cognitive Psychology* 43(1), 1-22 | **P0** | refs 行を `Boroditsky, L. (2001). Does language shape thought?: Mandarin and English speakers' conceptions of time. *Cognitive Psychology*, 43(1), 1-22.` に修正 **--> 適用済み** |
| 2 | L-2 末尾: 「9タイプ」表記 | 表は10種類の型を列挙しているが末尾で「9タイプ」と記述。内部不整合 | **P0** | 「9タイプ」を「10タイプ」に修正（表の列挙数に合わせる） **--> 適用済み** |
| 3 | EV-LI-008 claims: Winawer et al. (2007) | claim内で引用しているがrefsに含まれていない。[P]層の検証可能性が低下 | P1 | refs に `Winawer, J., et al. (2007). Russian blues reveal effects of language on color discrimination. *PNAS*, 104(19), 7780-7785.` を追記 |
| 4 | EV-LI-010 [M] claim: 「ボトルネック=欠損」の同一視 | 「=欠損」は理論上の同一視に読める。牽強付会リスク | P1 | 「欠損」を「情報制約/学習データ制約」に言い換え、D1接続は「仮説的対応」として分離 |
| 5 | EV-LI-009 claim2: 「制約は2種類」断定 | OTは多様な制約族を含む。「2種類」は過度の単純化 | P1 | 「制約は**大別すると**2種類」に緩和 |
| 6 | EV-LI-009 [文脈]: OT出版経緯の明示不足 | 1993年技術報告が先行し2004年に書籍出版、という経緯が未記載 | P1 | [文脈]に出版経緯の1文を追記 |
| 7 | EV-LI-010 claim2: 実験設定の具体不足 | Kirby et al. (2008) の具体的タスク設計が記述されていない | P1 | タスク概要（人工言語の世代伝達実験）を1-2文追記 |
| 8 | EV-LI-002 claim3: 「決定する」言い切り | 「決定する」は過大。影響・傾向に緩和推奨 | P1 | 「決定する」を「強く影響する」に変更 |
| 9 | EV-LI-003 claim3: 「直接決定する」言い切り | 同上 | P1 | 「直接決定する」を「強く規定する」に変更 |
| 10 | EV-LI-009 [M] claim: 5段階対応の橋渡し不足 | OTは共時的枠組みであり通時変化への接続に追加説明が必要 | 要議論 | [M]領域の文を「仮説的対応」「比喩的対応」で明示的に弱める |
| 11 | EV-LI-003/008 CA判定 | CA維持自体は妥当だが「何を検証すればAcceptに上げるか」がより具体的であるべき | 要議論 | CA検証項目に1段具体的な検証条件を追記 |
| 12 | 信頼度の単一スカラー | [P]層と[M]層の信頼度差が埋もれる | 要議論 | [P]層信頼度/全体信頼度に分割する提案（構造変更のため要pjdhiro判断） |
| 13 | 全体: 外部参照(D1/D2/H-4/K-xx等)の未定義 | evidence単体での査読可能性が低い | 要議論 | 冒頭または付録に最小グロッサリを置く（構造変更のため要pjdhiro判断） |
| 14 | 観点3: 追補候補 | Weinreich-Labov-Herzog (1968) の問題系、伝達と拡散の区別、空間参照枠研究 | 要議論 | Phase 5以降で追加エントリの検討対象 |

---

## P0修正の適用記録

### 修正1: EV-LI-008 Boroditsky (2001) 書誌情報

- **修正前**: `Boroditsky, L. (2001). Does Language Shape Thought? *Cognition*, 80(1-2), 1-22.`
- **修正後**: `Boroditsky, L. (2001). Does language shape thought?: Mandarin and English speakers' conceptions of time. *Cognitive Psychology*, 43(1), 1-22.`
- **根拠**: GPTレビューが指摘。掲載誌は *Cognition* ではなく *Cognitive Psychology*。巻号ページも 80(1-2) ではなく 43(1), 1-22。

### 修正2: L-2 「9タイプ」-> 「10タイプ」

- **修正前**: `**縁の型の多様性**: 9タイプ。D15/D16と同等以上。`
- **修正後**: `**縁の型の多様性**: 10タイプ。D15/D16と同等以上。`
- **根拠**: GPTレビューが指摘。L-2の表は10種類の型（制度型/伝播型/界面型/閾値型/分化型/認知型/推論型/制約型/競合型/欠損型）を列挙しており、「9タイプ」は単純な数え間違い。

---

## サマリー

- **P0修正**: 2件適用済み（書誌誤り1件、数値不整合1件）
- **P1提案**: 7件（pjdhiro最終判定待ち）
- **要議論**: 5件（構造変更や理論的判断を伴うもの）
- **evidence status**: `"Step 7 Phase 4 P0修正適用済み（pjdhiro最終判定待ち）"` に更新済み
