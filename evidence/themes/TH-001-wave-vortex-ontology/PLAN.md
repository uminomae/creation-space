# TH-001 調査計画 — READER 駆動の継続調査（cs#259）

**作成日**: 2026-07-09
**設計**: Claude Fable 5（Main、model-dispatch 準拠）
**追跡 Issue**: cs#258（調査本体）/ cs#259（READER パイプライン）
**正本の関係**: 調査成果の正本 = `output.md`。READER（`READER-wave-vortex.md`）は output.md の万人向け投影。HTML（`reader/`）は READER の生成物で直接編集禁止。

---

## 1. 運用サイクル（このテーマの回し方）

```
調査ラウンド実行（agent-team-workflow + model-dispatch）
  → output.md 改訂（層・タグを維持）
  → READER 正本 MD 更新（§「調査のいま」に現在地を刻む）
  → python3 scripts/build-reader-th.py で HTML 再生成
  → bash server.sh 3002 → http://127.0.0.1:3002/reader/wave-vortex.html で人間チェック
  → 公開判断は pjdhiro（main マージ）
```

- GitHub Issue は追跡簿、READER は人間が読む現在地。両方を各ラウンド終端で更新する
- READER 品質ゲート: pd `reader-comprehension`（文脈ゼロ LLM 読解テスト）＋ `reader-litt-conformance`（三技法監査）。公開前に必須、ローカル確認段階では任意

## 2. 調査ラウンド（保持論点 → 実行単位）

cs#258 の保持論点6件を、依存と実行可能性で並べ替えた実行計画。**W = 実行ラウンド／M = 監視／X = 外部待ち**。

| ラウンド | 内容 | 担当（model-dispatch） | 完了条件 | READER への反映 |
|---|---|---|---|---|
| **W0** | READER v1 立ち上げ（追加調査なし。output.md の現状を万人向けに投影） | 骨格 = Main / 下書き = Opus / 検証 = Main | HTML が 3002 で表示され、3層分離・防波堤・タグが保たれている | ページ全体 |
| **W1** | Bohm『Wholeness and the Implicate Order』川の渦比喩の一次確認（保持論点2）。原典取得 → 頁・文脈特定 | source-reader 系（Sonnet。取得難なら Main が WebFetch/PDF フォールバック） | 原著頁の特定 or 取得不能判定（取得不能なら read-list 化し READER は二次情報注記を維持） | §思想・系譜の Bohm 節の confidence 更新 |
| **W2** | 実証層 citation-only の昇格: Steinhauer 2019 / Kolobov 2021 / Unruh 1981 の OA 全文到達（PMC/arXiv 経路） | Sonnet（並行1本） | 各文献の raw/url-verified 化 or 取得不能判定 | §実験室のブラックホールの信頼度バッジ更新 |
| **W3** | SVT×LIV 定量整合（保持論点5）: 創発的ローレンツ対称性戦略と観測制約（10⁻¹⁷/10⁻³³ GeV）の定量照合 | **Opus**（高難度物理・単発） | 整合/不整合/未決の三値判定＋根拠文献。[S] low からの更新可否 | §時空は超流体かの「制約」節 |
| **W4** | 循環性の枠組み（保持論点3）: 五段階対応が「発見」か「事後的当てはめ」かを切り分ける方法論 | 設計 = **Main（Fable 5）** / 批判 = critic（Opus） | 判定枠組みの明文化＋接地候補5件への適用結果 | §五段階モデルへの接地の各行タグ再判定 |
| **M1** | Švančara 2024 独立追試の監視（保持論点4） | Sonnet（各ラウンド終端で軽く検索） | 追試の出現（出たら W ラウンド化） | §実験室のブラックホールに追記 |
| **X1** | Kandyba 2025 書誌確定（保持論点1） | **pjdhiro 手動**（403 壁） | 書誌確定 or 断念 | 確定するまで READER に内容を載せない |
| **X2** | glossary / five-stages-guide への昇格可否（保持論点6） | **pjdhiro 判断**（Q&A filing 済み候補） | 承認/却下 | 承認時に READER から concepts へのリンク追加 |

実行順: **W0 →（W1 ∥ W2）→ W3 → W4**。M1 は毎ラウンド終端、X1/X2 は非同期。
枠ゲート: 各ラウンド開始前に `bash scripts/budget-check.sh --plan N`。CAUTION 時は Opus→Sonnet 降格・1本化（model-dispatch §4）。

## 3. READER 骨格（W0 の設計、Main 決定）

対象読者: 物理の予備知識を仮定しない一般読者。pd `three-and-seven.html` の型（読む経路3本・畳み・信頼度の正直な明示）を踏襲する。

```
0. 入口 — 「創造は波間の渦のよう」という直観（これは比喩。検証対象の仮説ではない）
   ＋ このページが何で・何でないか（物理の当否判定ではない／調査中の草稿）
1. 防波堤 — 「アナロジーは同一性ではない」（BLV）。全節に効く読み方の注意
2. 実験室のブラックホール（実証層）— Unruh 1981 → Steinhauer 反証と改良の21回 → Švančara 2024 巨大量子渦
   言えること: 音波は曲がった時空の方程式に従う（数学的対応）。言えないこと: 時空が実際に流体
3. 時空は超流体か（仮説層）— Volovik / Zloshchastiev / 超流体ダークマター。査読済みだが少数派。
   LIV 制約という関門
4. 渦で宇宙を考えた人たち（思想・系譜層）— デカルト → ヘルムホルツ → ケルビン渦原子 → 結び目理論。
   Bohm の川の渦。そして「モノでなくパターンの持続」の3方面独立収束（散逸構造・QFT・オートポイエーシス）
5. 五段階モデル（場→波→縁→渦→束）への接地 — 対応表をタグごと見せる（[M]/[S] を読者向けバッジに翻訳）
6. 調査のいま — 保持論点の状態表（W/M/X の現在地）＋更新履歴。ここが「人間チェック」の定点
```

執筆制約（output.md から継承、緩めない）:
- 3層の信頼度宣言を層見出しに残す。[P]/[M]/[S] は読者向けに「実証済み/解釈/推測」バッジへ翻訳して可視化
- citation-only 文献の内容を断定調で書かない（鎖の不変条件 cs#252）
- Kandyba を含む書誌未確定の周縁群は内容を要旨化しない
- pjdhiro の直観は引用として扱い、文責は Claude（pd 声の帰属ルールと同型）

## 4. 成果物マップ（更新責務）

| ファイル | 役割 | 更新タイミング |
|---|---|---|
| `PLAN.md`（本ファイル） | 調査計画・ラウンド状態 | 各ラウンド終端（状態列を更新） |
| `output.md` | 調査成果の正本 | ラウンドで新事実が出たとき |
| `READER-wave-vortex.md` | 万人向け解説の正本 | output.md 改訂後、同一コミットで |
| `reader/wave-vortex.html`（リポジトリ root） | 生成物（直接編集禁止） | build スクリプト再実行 |
| cs#258 / cs#259 | 追跡簿 | ラウンド終端にコメント |

## 5. ラウンド状態

| ラウンド | 状態 | 最終更新 |
|---|---|---|
| W0 | in_progress（cs#259 で立ち上げ中） | 2026-07-09 |
| W1 | pending | — |
| W2 | pending | — |
| W3 | pending | — |
| W4 | pending | — |
| M1 | standing | — |
| X1 | pjdhiro 待ち | — |
| X2 | pjdhiro 待ち（Q&A filing 承認待ち） | — |
