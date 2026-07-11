# TH-001 wave-vortex-ontology — ブリーフィング兼実行メタデータ

**テーマ**: 「創造は波間の渦のよう」（pjdhiro）の物理・思想的接地
**追跡 Issue**: cs#258（継続調査）
**作成日**: 2026-07-09
**orchestrator**: Claude Fable 5（pd セッション、agent-team-workflow full）
**実行 agents**: researcher ×3（sonnet ×2 / opus ×1）、critic（opus）、worker（opus）

## 背景

pjdhiro の仮説的直観: 「宇宙が海の渦のような現象でできている」「創造とは波間の渦のよう」。
五段階モデル（場→波→縁→渦→束）の「波」「渦」はこの直観の中核語であり、
その物理的対応物（アナログ重力・超流体真空・渦原子系譜）と思想的対応物（過程存在論）を
実証の厚み別に接地することが本テーマの目的。

## 30 領域調査に対する位置づけ（2026-07-11 pjdhiro 明確化）

本テーマは **30 領域調査の計画の 1 項目ではない**。物理学領域（D02）の調査計画から
枝分かれした深掘り（pjdhiro の興味を起点とする寄り道調査）である。

- 五段階モデルへの反映は、本テーマが直接行うのではなく、**30 領域調査の側が本テーマの
  成果物（READER / output.md）を部品として参照する**形で行う
- 引き渡し先候補: D02 物理学（アナログ重力・超流体真空・場の量子論・渦原子。D02 再監査の材料）、
  D13 哲学（Bohm・Whitehead・Simondon）、D29 複雑性科学（Prigogine）、D01 数学（結び目理論の誕生史）
- 既に反映済みのもの: Bohm 川の渦の Stage 4 対応概念採用（cs#261 X2、pjdhiro 承認）は
  モデル側 `knowledge/schema/five-stages.md` に本テーマ参照つきで記録済み。以後の採否判断も同じ向き
  （モデル/調査側が判断し、本テーマを参照する）で行う

発端の一次調査（pd セッション 2026-07-09）で判明済みの事実:

- ADS bibcode `2021EPJP..136..544M` の実体は Mondal「Electric dipole interaction in
  hydrogenic atoms from quantum spacetime」（EPJ Plus 136:544, 2021, 査読誌）
- 「カンディバ・P. 2025」= Pavel Kandyba の超流体時空仮説は別文献（自己公開系プレプリントの模様、
  一次ソース未確定 = `citation-only` 未満）。両者が紹介経路で混同されていた

## alignment（共有辞書）

```yaml
task: 渦宇宙論・超流体時空・渦的存在論のサーベイと五段階モデルへの接地
scale: full
review_mode: single  # critic=opus、最終ゲートは Main(Fable) が V3
severity_levels:
  critical: 実証層と仮説層の混同（fringe を主流として記述）
  major: citation-only 文献での内容断定、系譜の事実誤認
  minor: 表現・構成の改善余地
scope: 査読文献優先。周縁仮説は周縁と明記。五段階モデルへの接地は R3 のみが扱い、
  R1/R2 は物理の事実確定に徹する
```

## 調査の問い

| 担当 | model | 問い |
|---|---|---|
| R1 実証系 | sonnet | アナログ重力で何がどこまで実証されたか（Unruh 1981 → BEC ホーキング放射アナログ → 2024 Nature 巨大量子渦）。「数学的同型」と「時空の実在的主張」の境界線はどこか |
| R2 理論・周縁系 | sonnet | 超流体真空理論（Volovik、Zloshchastiev、超流体ダークマター）の現状とローレンツ不変性制約。Kandyba 2025 の一次ソース確定と書誌クロスチェック |
| R3 思想・系譜 | opus | デカルト渦動論 → ケルビン渦原子 → 結び目理論の概念史。過程哲学・関係優位の存在論と「渦＝過程としての形」の接続。五段階モデル（場→波→縁→渦→束）への接地候補 |

## 成果物構成

```
TH-001-wave-vortex-ontology/
  README.md                      ← 本ファイル
  PLAN.md                        ← 継続調査計画（cs#259。ラウンド W0-W4/M1/X1-X2 と READER 駆動サイクル）
  survey-R1-analog-gravity.md    ← R1 handoff 整形
  survey-R2-superfluid-vacuum.md ← R2 handoff 整形
  survey-R3-lineage-ontology.md  ← R3 handoff 整形
  output.md                      ← 統合成果物（本テーマの正本）
  review.md                      ← critic レビュー記録（Phase 2/6）
  READER-wave-vortex.md          ← 万人向け解説の正本（output.md の投影。HTML は reader/ に生成）
  TEST-w4b-rc1-20260710.md       ← 盲検テスト・読解テストの記録
  sources/                       ← 出典アーカイブ（READER 脚注 [1]-[26] の無料公開版ローカル控え。
                                    LLM 照合ハーネス用。メタデータ = sources/sources.json、詳細 = sources/README.md。
                                    30 領域台帳 knowledge/raw/manifest.md には登録しない）
```

## スコープガード

- 主語は「五段階モデルの中核比喩の接地」。物理理論の当否判定ではない
- 実証層（アナログ重力実験）/ 仮説層（SVT）/ 周縁層（Kandyba 等）を層として分離し、
  層をまたぐ推論には必ず `[SCALE_JUMP]` または `[SPECULATIVE]` を付す
- 「数学的同型」を「実在の主張」に格上げしない（アナロジーの過剰一般化 = V5 対象）
- pjdhiro の直観は「検証対象の仮説」ではなく「接地対象の比喩」として扱う
  （比喩の価値は物理の当否から独立）
