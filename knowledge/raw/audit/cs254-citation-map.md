# cs#254 公開層の引用マップ — non-T1 原典に立脚する公開主張の突合

**作成**: 2026-07-02（pd#119 Phase 1b / Fable 5 実行）
**入力**: `confidence-tier.jsonl`（cs#253）× 公開 MD 正本（pjdhiro/assets/creation：domains ja/en 各30・guides 各3・phase8-themes・phase9・survey・synthesis）
**原則（cs#252→#254）**: 特定原典に確定帰属する**解釈的主張**（「Xはこう論じた」）は、その原典が **T1_READ（source-note 済＝精読）** であることを要する。一般常識・教科書的記述は対象外。

## 方法

confidence-tier で **T1 以外かつ source_id を持つ 12 件**（T2 obtainable 2 / T3 real-block 9 / T4 review 1）の理論家名を、公開 MD 全文に対して突合。T5_READLIST 99 件は cs#252 で既に公開解釈禁止のため対象外。各言及を「解釈的帰属（要 T1）」か「背景言及（対象外）」に人手（Fable）分類した。

## 突合結果（言及ゼロの 7 件は対象外）

言及ゼロ = 公開主張に立脚していない: **Feistel(D05-S15) / Nicolis(D06-S15) / Heylighen(D07-S15) / Moffat(D11-S16) / Beisner(D12-S13) / van der Maas(D23-S15) / van Geert(D23-S14)**。これらの Phase 2 wiki 生成は公開主張の是正ではなく wiki 網羅性の問題（削除リスクなし）。

## 立脚が確認された 5 件の判定

| # | 原典 | tier | 言及 | 分類 | severity | 処置 |
|---|---|---|---|---|---|---|
| 1 | Simondon『技術的対象の存在様態について』(D13-S02) | T2 obtainable・未精読 | 51回（D13 中心） | **解釈的帰属（深い）** | **HIGH** | 再接地（精読）または節精度の除去。要 pjdhiro |
| 2 | Attwell & Laughlin (2001) (D09-S02) | T3・PDF 保有/未精読 | 4回（D09） | 出典特有の定量主張 | MED | **安価に再接地**（PDF ローカル・Phase 2 inbox 対象。精読→T1） |
| 3 | Watts & Strogatz (1998) (D07-S13) | T2・未精読 | 6回（D29） | 教科書的＋引用衛生 | LOW-MED | 主張は教科書級。ただし manifest 登録は Strogatz(2001) で**別論文**。id 整合を是正 |
| 4 | Tsukada & Ohsumi (1993) (D09-S09) | T3 blocked | 7回（D09） | 教科書的背景 | LOW | オートファジー基礎＋ノーベル賞事実は一般常識。対象外寄り。ただし blocked のため定量特定主張は付さない |
| 5 | Luyckx (DIDS) (D23-S07) | T3 blocked | 3回（D23） | 分類表の名称のみ | LOW | 深い解釈段落なし（表・列挙のみ）。対象外寄り |

## 最重要所見: Simondon（cs#254 headline の裏取り）

cs#254 が「D13 はシモンドンを 16 箇所以上で解釈」と挙げた件を裏取りし、**懸念より悪い**ことを確認した。

- D13 [`domain-D13-philosophy.md`] L97 は「**事実として**: シモンドンは…前個体的準安定状態から transduction を通じて個体と環境が同時生成される…前個体的余剰が枯渇せず再個体化の可能性として保持される（*L'individuation à la lumière des notions de forme et d'information*, Introduction, §I）」と、**節レベルの精密な帰属**を付している。
- しかし (a) D13-S02 は **T2＝未精読**（source-note なし。D13 の note は Deleuze/Dewey/Whitehead/Bergson/James/Peirce のみ）。
- さらに (b) 引用元 `L'individuation…` は manifest 登録原典 `Du mode d'existence des objets techniques`(1958) **とは別の著作**。すなわち「事実として」＋§番号という最高精度の主張が、追跡原典でも精読原典でもない文献に付されている＝**偽の精密さ**。
- report は「事実として／読み取りとして／解釈として」の三層を持つ。**要 T1 は「事実として」層のみ**（L97・L191 前個体的余剰の残存 等）。「解釈として」の 5 段階対応は report 自身の読みであり原典忠実度への依存が低い。

### 推奨処置（Simondon、pjdhiro 承認事項）

3 択。cost 順:
1. **再接地**: Simondon『個体化』（`L'individuation…`）を実取得・精読して source-note 化（T1 昇格）→ 主張を維持。最も価値が高いが取得＋精読コスト。D13 の理論的核（個体化＝渦の典拠、cf. state.md の D13-S03 Deleuze 高価値記述）に直結するため推奨。
2. **精度の格下げ**: 「事実として…§I」を「一般に…と解される」等へ緩め、節番号・逐語主張を除去。低コスト・低価値。
3. **manifest 是正**: 登録原典を実際に依拠している `L'individuation…` に差し替え（or 追加 source_id）。(1)/(2) と併用。

## Phase 2（wiki 生成）との関係

Phase 2 inbox 7 件のうち、公開主張の是正に効くのは **Attwell(D09-S02)** のみ（#2）。他は wiki 網羅性向け。よって Phase 2 は「公開層の鎖執行」ではなく独立の資産拡充として進めてよい。

## 結論

「未検証原典に立脚した公開解釈」の実害は **Simondon 1 件に集中**。残りは教科書的背景（対象外寄り 3 件）か PDF 保有で安価に再接地可能（1 件）。cs#254 の削除範囲は限定的で、Simondon の「事実として」層の処置（上記 3 択）を pjdhiro が決めれば大半が解決する。
