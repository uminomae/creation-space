# evidence/similar-papers/

## 背景とゴール

原典精読ベースへの方針転換に伴い、既存 source とは別に「5段階モデルと構造類似する論文」を独立に探索した。これは原典ベースの分析における**比較対象・補強証拠**を確保するためである。

### ゴール

全30領域で構造類似論文を確保し、VAL（独立検証）を経た論文のみを manifest に登録する。最終的には原典を精読し、wiki にまとめ、構造類似の分析を原典ベースで行う。

### 現在地（2026-04-10）

- 153本が VAL 検証済みで manifest に登録（全30領域 x 5本以上）
- VAL 統計: R1 Accept 79, CA 39, Reject 32 / R2 Accept 22, CA 7, Reject 4
- Stage affinity 分布: Stage 1(14%), 2(23%), 3(27%), 4(25%), 5(12%) — Stage 5 が過少
- **次のステップ**: Stage 5 過少カバレッジの仮説検証（cs#217 I2）、原典精読→wiki 化
- 追跡 Issue: cs#217

## 構成

| ファイル | 役割 |
|---------|------|
| `metadata.md` | 採用基準・分類タグ・Source ID 規則 |
| `validation/` | VAL 検証結果（Accept/CA/Reject の判定記録） |

類似論文の実データ（source_id, stage_affinity, OA URL 等）は `knowledge/raw/manifest.md` に [similar-papers] タグ付きで記録。
