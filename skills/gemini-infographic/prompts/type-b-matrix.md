# TYPE B: Theory x 5-Stage Correspondence Matrix

- **Template**: type-b-matrix
- **Type**: B (Correspondence Matrix)
- **Version**: 1.0
- **Based on**: D01 pilot SVG (D01-02-theories-map-svg.svg)

---

## Prompt

Generate a single SVG infographic showing a correspondence matrix between {{theory_count}} theories in the domain "{{domain_name_ja}}" ({{domain_id}}) and the 5-stage model (場 / 波 / 縁 / 渦 / 束).

### Data

Domain: {{domain_id}} {{domain_name_ja}}
Theory count: {{theory_count}}

Matrix data (one row per theory):
Format: "theory_name | judgment | 場_mapping | 波_mapping | 縁_mapping | 渦_mapping | 束_mapping"

{{matrix_data}}

Judgment values and their visual treatment:
- "strong" = full stage color, full opacity, white text (#ffffff)
- "partial" = darkened stage color, opacity="0.7", light text (#e0e0e0)
- "conditional" = heavily darkened stage color, opacity="0.3", muted text (#aaaaaa)
- Cell text "-" or empty = near-invisible cell (opacity="0.2"), text "#888888", display "-"

### Layout

1. **Title** at top center: "{{theory_count}}{{domain_name_ja}}理論と5段階モデルの対応関係マトリクス"
2. **Column headers**: 5 colored bars with stage names
   - 場 (Field) | 波 (Wave) | 縁 (Edge) | 渦 (Vortex) | 束 (Bundle)
3. **Row labels**: Numbered theory names on the left side
4. **Matrix cells**: Rectangles colored by judgment strength, with mapping term as text
5. **Legend** at bottom: three swatches showing strong / partial / conditional

Row height: 55px with 10px gap (65px pitch).
Column width: 180px with 10px gap (190px pitch).
Row labels area: 220px on the left.

Adjust viewBox height dynamically: use `0 0 1200 H` where H = 100 (title) + 50 (headers) + ({{theory_count}} * 65) + 80 (legend + padding). Round up to nearest 50.

---

## SVG Rules (mandatory)

All of the following rules are strict requirements. Violating any one produces an unusable file.

1. **viewBox**: `viewBox="0 0 1200 {H}"` -- calculate H from theory count as described above. Do NOT set fixed `width` or `height` attributes on the root `<svg>` element.
2. **Background**: `#1a1a2e` applied via a full-size `<rect>` as the first child element (do NOT use `style="background-color:..."` on the `<svg>` tag).
3. **Forbidden elements**: Do NOT use any of: `<foreignObject>`, `<script>`, `<animate>`, `<animateTransform>`, `<image>`, `<filter>`, `<feGaussianBlur>`, `<style>` (tag). None of these may appear anywhere in the output.
4. **Text rendering**: All text must use `<text>` and `<tspan>` elements only. Set `font-family="sans-serif"` on the root `<svg>` or on each text element.
5. **5-stage colors**:
   - 場: `#8B8682`
   - 波: `#5B8DB8`
   - 縁: `#D4A857`
   - 渦: `#C45B4D`
   - 束: `#5B8B6A`
6. **Judgment-to-style mapping**:
   - Strong: stage color at full opacity, `fill="#ffffff"` on text
   - Partial: darkened variant of stage color, `opacity="0.7"` on rect, `fill="#e0e0e0"` on text
   - Conditional: heavily darkened variant, `opacity="0.3"` on rect, `fill="#aaaaaa"` on text
   - Empty / "-": `opacity="0.2"` on rect, `fill="#888888"` on text, display "-"
7. **Rounded corners**: `rx="5" ry="5"` on all rectangles.
8. **No inline CSS**: Use SVG presentation attributes only (fill, font-size, opacity, etc.). Do not use `style="..."` attributes.
9. **Legend**: Three swatches at the bottom:
   - Full color swatch + "強い対応 (Strong)"
   - 70% opacity swatch + "部分的 (Partial)"
   - 30% opacity swatch + "条件付き/弱い (Conditional/Weak)"
10. **Encoding**: Output raw SVG (not base64, not wrapped in HTML). UTF-8, no BOM.

---

## Example instantiation

```
{{domain_id}} = "D01"
{{domain_name_ja}} = "数学"
{{theory_count}} = "11"
{{matrix_data}} =
層とCechコホモロジー | strong | 台空間 | 局所データ | 重なり整合 | コサイクル | ファイバー束
Milnorファイブレーション | strong | 解析データ | 近傍ファイバー | リンク | モノドロミー | ファイバー束
分岐理論 | strong | パラメータ空間 | 摂動 | 分岐点 | 解の再編成 | アトラクター
Morse理論 | strong | 多様体 | 勾配流 | 臨界点 | ハンドル付け | ハンドル分解
特異摂動 | strong | 状態空間 | εパラメータ | 境界層 | マッチング | 統一解
Julia集合 | partial | (全体) | (反復) | 境界 | (カオス) | (構造)
パーシステントホモロジー | partial | データ点群 | フィルトレーション | 発生/消滅 | (持続性) | バーコード
スピノル | partial | 時空 | 場の量子化 | ? | ? | スピノル束
高次圏 | conditional | 対象 | 射 | - | - | -
ガロア理論 | conditional | 基礎体 | - | - | - | ガロア群
ホッジ理論 | conditional | ケーラー多様体 | 微分形式 | 調和形式 | 分解 | ホッジ構造
```
