# transform/themes/ — テーマ検証の変換ルール・テンプレート

## 役割

Phase 8 で抽出された 5 つの構造テーマの検証レポートを生成するための変換ルール・テンプレート・品質テストを管理する。

## 正本ルール

**ここに .md の実体（公開用レポート）を置かない。**

公開用テーマ検証 MD の正本は `pjdhiro/assets/creation/phase8-themes/ja/verification/` にある。
UI（`theme-verification.js`）は pjdhiro の raw URL からテーマ検証 MD を読み込む。

## 含まれるもの

| パス | 役割 |
|---|---|
| `WORKFLOW.md` | テーマ検証の変換ワークフロー |
| `theme-report-template.md` | テーマ検証レポートのテンプレート |
| `reader-rules-theme-validation.md` | テーマ検証の reader-rules |
| `quality-test-theme-report.md` | テーマ検証の品質テスト |
| `publish/` | 変換出力のステージング（JSON のみ。MD を置かない） |
