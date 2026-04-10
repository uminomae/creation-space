# 類似論文評価レポート — 代替33本 (cs#215 re-evaluation)
**Issue**: cs#215, cs#216
**日付**: 2026-04-10
**評価者**: 5並行検証エージェント (Claude)
**基準**: knowledge/schema/five-stages.md の5段階モデルとの構造類似性

## サマリ
- 対象: 33本（cs#215 Reject 後の代替として d0484c9 で追加）
- Accept: 22本
- CA: 7本（stage_affinity 修正後 Accept）
- Reject: 4本（manifest から除外）

---

## Reject 4本

### D12-S14: Dakos et al. (2012)
- **判定**: Reject `[WEAK_MAPPING]`
- **理由**: 臨界遷移の早期警告**方法論**論文。プロセス記述ではなく検出手法の比較が主題。Stage 2-4 への対応根拠が薄い。

### D12-S15: Menegat (2022)
- **判定**: Reject `[UNCERTAIN]`
- **理由**: MDPI 403 で OA アクセス不可。本文未確認のため Accept 不可。

### D16-S16: Turchin (2005)
- **判定**: Reject
- **理由**: 統計方法論入門論文であり固有の構造論なし。EV-HI-010 (Turchin 2003) と実質重複。

### D30-S14: Walker et al. (2004)
- **判定**: Reject (D30 文脈)
- **理由**: D12-S11 として既に Accept 済み。D30（伝統知）文脈での接点が弱い。レジリエンス理論は伝統知の応用先であり、伝統知そのものの構造論ではない。

---

## CA 7本（stage_affinity 修正）

### D05-S15: Feistel (2024)
- **判定**: CA → Accept（修正後）
- **修正**: Stage 1-5 → Stage 1-4（Stage 5 対応が論文の核心ではない）
- `[SPECULATIVE]`: 対称性の破れは一般的物理現象。生命起源との限定的接続。

### D06-S14: Friston (2012)
- **��定**: CA → Accept（修正後）
- **修��**: Stage 1-5 → Stage 1-4（Stage 5 明示的に論じられず）
- **注意**: D02-S14 として既に Accept 評価済み。重複処理要確���。

### D16-S17: Turchin (2014)
- **判定**: CA → Accept（修正後）
- **修正**: Stage 1-5 �� Stage 2-5（Stage 1 への対応は拡張的）

### D20-S15: Ostrom (1999)
- **判定**: CA → Accept（修正後）
- **修正**: Stage 2-5 → Stage 3-5（Stage 2 の揺動記述は薄い）
- **注意**: EV-LP-003 (Ostrom 1990) との差別化（森林事例の具体性）を明示。

### D20-S16: Friston (2013)
- **判定**: CA → Accept（修正後）
- **修正**: Stage 1-5 → Stage 2-5（Stage 1 への対応は拡張的）
- **注意**: D20 配置の適切性要検討。D02-S14 との差分明示必要。

### D24-S16: Berkovich-Ohana & Glicksohn (2014)
- **判���**: CA → Accept（修正後）
- **修正**: Stage 1-5 → Stage 1-4（Stage 5「束=方向・集合」への対応薄い）

### D30-S15: Olsson, Folke & Hahn (2004)
- **判定**: CA → Accept（修正後）
- **修正**: Stage 1-5 → Stage 2-5（D30 文脈で Stage 1 への対応は薄い）
- **注意**: D16-S18 評価が主軸。D30 配置は「地域知識」概念を「伝統知」と等置する解釈を前提。

---

## Accept 22本

| source_id | 著者 (年) | stage_affinity | 備考 |
|-----------|-----------|----------------|------|
| D01-S08 | Lakatos (1976) | 2-4 | 証明と反例の弁証法が場→波→縁→渦に対�� |
| D05-S14 | Bak, Tang & Wiesenfeld (1987) | 1-4 | SOC が Stage 3「縁」の物理的実装 |
| D06-S15 | Nicolis & Nicolis (2016) | 1-4 | 確率共鳴と自己組織化 |
| D07-S15 | Heylighen (2025) | 1-5 | 創発の一般理論 |
| D11-S17 | Tognoli & Kelso (2009) | 1-4 | メタ安定性の相転移構造 |
| D14-S07 | Hesse & Gross (2014) | 1-4 | SOC 相転移が Stage 1-4 に対応 |
| D15-S15 | Botella et al. (2018) | 1-5 | 創造プロセス段階が全5段階に対応 |
| D16-S18 | Olsson et al. (2004) | 1-5 | 社会-生態変容の段階的プロセス |
| D18-S10 | Nadell et al. (2010) | 1-4 | 空間的境界の自己組織的創発 |
| D21-S15 | Deco et al. (2008) | 1-4 | 多安定ポテンシャル→ノイズ揺動→創発 |
| D21-S16 | Walker et al. (2009) | 2-5 | レジリエンス・適応的再組織化 |
| D22-S16 | Hu & Chen (2021) | 1-5 | 対話的アイデア創発の軌跡 |
| D22-S17 | Friston (2018) | 1-5 | マル��フ毛布→自己意識的統合 |
| D23-S16 | Kartner & Koster (2024) | 1-4 | 動的システム発達論 |
| D23-S17 | Tononi (2014) | 1-5 | 統合情報理論 |
| D23-S18 | Kim & Carlson (2024) | 1-4 | 探索-活用ダイナミクス |
| D25-S16 | Cisneros-Velarde & Bullo (2021) | 2-4 | 階層構造の内生的創発 |
| D26-S17 | Schulkin & Raglan (2014) | 1-4 | 音楽の進化と社会的結合 |
| D26-S18 | Ellamil et al. (2016) | 2-5 | 集団同期の自己組織化 |
| D27-S16 | Chen (2011) | 3-5 | フラクタル都市階層 |
| D30-S16 | Ostrom (1999) | 2-5 | コモンズ自己統治（伝統知のガバナンス側面） |
| D30-S17 | Asmamaw et al. (2020) | 2-5 | 在来知識のレジリエンス機能 |

---

## 横断的所見

### OA アクセス状況
- MDPI 全般: 403 エラー（Feistel, Friston 2012, Nicolis, Heylighen）
- Ecology and Society: 403 エラー（Walker, Olsson）
- CIFOR: 403 エラー（Ostrom）
- archive.org: 404（Lakatos）
- Frontiers: リダイレクトのみ（HTML版で補完可能なケースあり）
- PLOS: HTML版でアクセス成功

### Friston 論文の重複問題
Friston (2012), (2013), (2018) が D02, D06, D20, D22 に分散配置。理論的根幹は同一（自由エネルギー原理+マルコフ毛布）。各ドメイン固有の解釈を明示する必要がある。

### 次アクション
1. Reject 4本を manifest から除外
2. CA 7本の stage_affinity を修正
3. 集計を更新（153 → 149本）
4. D12, D16 で 5本/領域を下回る場合は代替探索が必要
