# review-evidence-D24-religion.md

[Download the Markdown file](sandbox:/mnt/data/review-evidence-D24-religion.md)

出力ファイル名: **review-evidence-D24-religion.md**  
対象ファイル: **evidence-D24-religion.md**  
作成日: 2026-03-04（Asia/Tokyo）

## Executive Summary

本レビューは、対象ファイル（10エントリ＋領域レポートL-1〜L-5）を、REQが要求する **「エントリ別判定（Accept / P0 / P1 / 要議論）＋最後に総括コメント」** の形式で点検し、加えて 5観点（正確性、根拠/出典、中立性、明瞭性/構造、網羅性）で分析した（REQ側に5観点が明示されない前提でユーザー指定を採用）。  

結論として、現状は **全体判定: P1（条件付き採用）** が妥当。理由は、(a) 冒頭で「当てはめない」原則が明示され（L15–L17）構造比較の暴走を抑える設計ができている一方、(b) 多くのエントリで **v:未検証** が残り、さらに **lit:未確認** のまま triage が Accept の箇所があるため、外部利用者が「採用＝検証済み」と誤読しやすい。  

また、書誌（原著言語・初出年・翻訳年）の記述は概ね良いが、少なくともEV-RL-008では「独語初出→仏語版」等の書誌関係を明確にしないと混線リスクがある。citeturn19search16turn19search0turn3search0

## Methodology

- REQ文書を読み、要求形式が「エントリ別判定＋総括」であることを優先要件として採用。  
- 対象ファイルは、(1) YAML前提、(2) 凡例（[P]/[M]）と方法論、(3) 10件のEVエントリ、(4) L-1〜L-5の領域レポートに分解して通読。  
- 正確性の検証は「影響が大きい箇所」に絞り、一次/公的ソースを優先して照合（例：米国の宗教スイッチング統計、主要著作の書誌、仏典テキストDB、出版社カタログ、講義シリーズ公式ページ等）。citeturn12search3turn15view0turn11search6turn21search0turn18view0turn19search0  
- 行番号は「問題箇所の再現性」を高める目的で付与（ただし将来の編集で行ズレする前提）。

## Findings

**観点: 正確性（Accuracy）｜評価: B（局所修正でA相当へ）**  
最も優先すべき“正確性”修正は、書誌の混線回避（特にEV-RL-008）と、成立年代など断定が危うい箇所の緩和（EV-RL-010）である。  
- EV-RL-008（L352–L360）: *Le sacré et le profane* を「1957年の仏語著作」と読むと、独語初出（1957）→仏語版（Gallimard 1965）等の書誌整理と齟齬が出る可能性があるため、**原題/原言語/初出年/版差分**を分離して記述するのが安全。citeturn19search16turn19search0  
- EV-RL-010（L445付近）: 「紀元前後成立」などの断定は、十地品/十地経の研究史・漢訳史に照らして慎重化が望ましい。少なくとも一次テキスト番号（T0287）を固定し、成立年代は「諸説」＋参照文献に寄せる。citeturn21search0turn21search6  
- EV-RL-004（十牛図）の系譜は概ね方向性が良いが、寺院や禅籍DBが提示する「廓庵系・普明系」等の整理に合わせて、用語・系譜の根拠を固定すると精度が上がる。citeturn27search4turn27search9  

**観点: 根拠/出典（Sourcing / Evidence）｜評価: C（出典固定で改善余地が最大）**  
構造比較の思想は明確だが、「検証ステータス」と「採用判定」の運用が曖昧なため、出典品質が過小評価されてしまう。  
- 例: **lit:未確認 / v:未検証** が残るエントリが複数（例: EV-RL-005/006/009/010）ある一方、triage が Accept の箇所がある（例: EV-RL-005 L206–L210）。  
- 推奨: すべてのEVエントリに **sources:** ブロック（一次/公的・邦訳同定・学術二次）を追加し、「採用の前提条件（何が揃えばAcceptか）」を冒頭の凡例に明文化する。  
- “固定すべき一次/公的ソース”の例：  
  - 米国の宗教的所属変更率（35%等）は entity["organization","Pew Research Center","survey org, washington dc"] の該当レポート章を固定。citeturn12search3turn12search12  
  - 主要著作の邦訳同定は entity["organization","国立国会図書館","national library, japan"] で書誌固定（回心モデル、儀礼理論、エリアーデ邦訳など）。citeturn15view0turn11search6turn3search0  
  - 仏典は entity["organization","SAT大蔵経テキストデータベース研究会","buddhist text db, tokyo jp"] 等でテキスト番号を固定（例: T0287）。citeturn21search0turn21search1  
  - 錬金術は学術史研究（邦訳書誌や専門辞典）へ寄せる。citeturn10search0turn10search1turn10search8  
  - スーフィズムは国内研究の一次接続（大学機関の翻訳研究・報告）を最低1点置く。citeturn6search2turn6search6  

**観点: 中立性/バイアス（Neutrality / Bias）｜評価: B-（断定口調の微調整で改善）**  
強みは、[P]/[M]を分け、冒頭で無理な当てはめを戒めている点（L15–L17）。一方で、[学び] では現代的価値観への接続が強くなる箇所があり、説明から規範へ滑るリスクがある（例: EV-RL-003周辺）。  
- 推奨: [学び] を「観察（対応）」と「適用（一般化）」に分け、適用側には**条件・反例**を1行でも併記する。  
- EV-RL-008が「方法論的批判（恣意的比較）を自覚的に置く」良例になっているため、この書きぶりをL-4/L-5にも波及させると中立性が上がる。citeturn3search0turn19search0  

**観点: 明瞭性/構造（Clarity / Structure）｜評価: B（凡例拡張でAへ）**  
YAMLメタデータと共通フィールドは良く整っている（L1–L9、各EVの定型）。領域レポートもクラスター視点（L510–L513）が有用。  
- ただし、ファイル単体では flags（ai/hiro/lit/v）や module（M2）や mechanism_type（T5+T7）や 4チェック（A–D）の意味が外部依存。  
- 推奨: 凡例（L15）直後に「用語ミニ辞書」を10行程度で追加し、**読者の自己完結性**を上げる。  
- 推奨: L-2の集計値（Accept率等）は、判定更新に連動するため「手計算/自動」を注記し、可能なら生成手順を別ファイル化する。

**観点: 網羅性（Completeness）｜評価: B-（REQ欠落候補の取り込みで強化）**  
10件は実務的に十分だが、欠落候補として挙げやすい「神秘主義の5段階」や「ヨーガの八支則」などが未収録なら、P1で追加する価値が高い。citeturn23search1turn24search1  

## Summary Table

| 観点 | 評価 | 主要アクション | 期待効果 |
|---|---|---|---|
| 正確性 | B | 書誌（言語/初出/翻訳）分離、成立年代断定の緩和 | 基本誤差の除去 |
| 根拠/出典 | C | sources追加、一次/公的ソース固定、flags↔triage整合 | 追跡可能性が上がる |
| 中立性 | B- | [学び]の適用条件と反例、断定口調の調整 | 誤読の抑制 |
| 明瞭性/構造 | B | 用語ミニ辞書、集計注記 | 読者オンボーディング改善 |
| 網羅性 | B- | 欠落候補のP1追加 | 比較適用域の拡張 |

REQ準拠（10エントリ＋L-1〜L-5）エントリ別判定（提案）:

| 対象 | 判定 | 主な理由（短） |
|---|---|---|
| EV-RL-001 | Accept | 統計・書誌を一次/公的ソースで固定しやすい。citeturn12search3turn15view0 |
| EV-RL-002 | P1 | 一次引用・邦訳同定・概念境界の明示が必要。citeturn11search6turn0search10 |
| EV-RL-003 | P1 | 引用箇所同定と現代適用の条件づけが必要。citeturn3search15turn3search11 |
| EV-RL-004 | P1 | 系譜・用語を禅籍DB/寺院資料で固定したい。citeturn27search4turn27search9 |
| EV-RL-005 | P1 | 一次テキスト＋国内研究の参照固定が必要。citeturn6search2turn6search6 |
| EV-RL-006 | P1 | 研究史に寄せて“不安定性”を説明し直す。citeturn10search0turn10search1 |
| EV-RL-007 | 要議論 | 段階モデルというより類型論（仮説性の明文化が必要）。citeturn18view0turn17search4 |
| EV-RL-008 | P0 | 書誌（言語/刊年）の混線リスクを修正後にAccept推奨。citeturn19search16turn19search0turn3search0 |
| EV-RL-009 | P1 | 典拠テキストと国内研究を固定してからAcceptへ。citeturn6search2turn6search6 |
| EV-RL-010 | P1 | 大正蔵番号・テキストDB固定、成立年代断定回避。citeturn21search0turn22search7 |
| L-1 | P1 | 根拠リンクの明示が欲しい。 |
| L-2 | P1 | 本レビュー判定と差分が出るため再集計が必要。 |
| L-3 | Accept | スケール整理が明確。 |
| L-4 | P1 | 概念（受動性等）の典拠と反例条件を補うと強い。 |
| L-5 | Accept | 未解決性の提示が適切で、保持論点として有用。 |

## Implementation Plan

想定工数（低/中/高）を前提に、次の順で進めるのが効率的。

```mermaid
flowchart TD
  A[主張の抽出<br/>PとMを分離] --> B[一次/公的ソース固定<br/>書誌・テキスト番号]
  B --> C[flags更新<br/>lit/v]
  C --> D[triage再判定<br/>Accept/P1/P0/要議論]
  D --> E[L-2集計の再生成]
  E --> F[領域洞察(L-4/L-5)の根拠追記]
```

差分例（EV-RL-008の書誌を分離して混線を解消するパッチ例）:

```diff
diff --git a/evidence-D24-religion.md b/evidence-D24-religion.md
@@
- - **proposer**: Mircea Eliade (1907-1986). *Le Sacré et le Profane* (1957), *Le Mythe de l'éternel retour* (1949)
+ - **proposer**: Mircea Eliade (1907-1986).
+   - 原題/初出: Das Heilige und das Profane (1957, 独語) / Le sacré et le profane (1965, 仏語版例)
+   - 原題/初出: Le mythe de l'éternel retour (1949, 仏語)
@@
- - **claims**:
+ - **sources**:
+   - 一次/公的: 出版社カタログ（仏語版書誌）, 邦訳出版社, 図書館書誌
+ - **claims**:
```

## Final Recommendation

最終提案は **全体判定: P1（条件付き採用）**。  
対象ファイルは、宗教的実践・霊性プロセスを横断比較するための「論拠DB」として有望で、[P]/[M]分離と「当てはめ回避」原則が最初から実装されている点が強い（L15–L17）。一方で、検証フラグ（v）と採用判定（triage）の意味を明確にしないと、外部利用時に「採用＝検証済み」という誤読が発生しうる。よって、(1) 用語凡例、(2) sources付与、(3) EV-RL-008（P0）の書誌改善、(4) L-2再集計、の4点を満たした段階で Accept 相当へ引き上げるのが妥当である。