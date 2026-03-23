# TYPE A: Research Overview + Methodology Flow + Heat Map

- **Template**: type-a-overview
- **Type**: A (Domain Overview)
- **Version**: 1.0
- **Proven by**: D01-01-overview-svg.svg, D15-01-overview-svg.svg, D30-01-overview-svg.svg

## Placeholders

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{{domain_id}}` | D01 | Domain identifier |
| `{{domain_name_ja}}` | 数学 | Domain name in Japanese |
| `{{theory_count}}` | 11 | Total theories investigated |
| `{{strong_count}}` | 5 | Strong correspondence count |
| `{{partial_count}}` | 3 | Partial correspondence count |
| `{{conditional_count}}` | 3 | Conditional correspondence count |
| `{{theories_list}}` | See format below | Structured theory data |

### theories_list format

One line per theory:

```
theory_name | judgment | stage_coverage
```

Example:

```
層とČechコホモロジー | strong | 場,波,縁,渦,束
Milnorファイブレーション | strong | 場,波,縁,渦,束
高次圏 | conditional | 場,波
ガロア理論 | conditional | 場,束
ホッジ理論 | conditional | 場
```

---

## Prompt

Generate a single SVG infographic providing a research overview for the {{domain_name_ja}} domain ({{domain_id}}).

### Data

- **Domain**: {{domain_id}} {{domain_name_ja}}
- **Theories investigated**: {{theory_count}}
- **Judgment distribution**: 強い対応 {{strong_count}}件 / 部分的対応 {{partial_count}}件 / 条件付き {{conditional_count}}件
- **Theories**:
{{theories_list}}

### Layout specification

The infographic has three major sections arranged in a balanced layout:

**Title section (top, full width)**:
- Main title: "{{domain_id}} {{domain_name_ja}} — 5段階モデルとの構造対応調査" in white, font-size 36, bold, centered at (600, 60).
- Subtitle: "{{theory_count}}理論の横断的分析" in #cccccc, font-size 20, centered at (600, 95).

**Left column (x=50-350): Research methodology flow**:
Display 5 phase boxes connected by arrows in a vertical flow:
1. "Phase 1-2: 文献確認・理論選定"
2. "Phase 3-4: 構造対応の判定"
3. "Phase 5: 論拠監査"
4. "Phase 6: 構造再読（4軸再評価）"
5. "Phase 7: 横断統合"

Each box: width 300, height 60, rx=10, fill with a gradient (linearGradient from #2C3E50 to #34495E), stroke #cccccc. Text centered, white, font-size 18.

Connect boxes with short arrows (stroke #F39C12, stroke-width 4). Space boxes at 100px intervals vertically starting from y=160.

Add subtle glow rects behind each box (same shape, 5px larger, fill #4A90E2 at opacity 0.2).

**Right section (x=400-1150): Theory correspondence heat map**:
Display a grid with 5 stage columns and N theory rows.

Column headers: 5 rounded rects (width ~140, height 30) with stage colors:
- 場 (#8B8682), 波 (#5B8DB8), 縁 (#D4A857), 渦 (#C45B4D), 束 (#5B8B6A)
- White text, font-size 16, bold, centered.

Row labels: Theory names on the left, white text, font-size 14, right-aligned.

Cells: For each theory, fill cells with the stage color at full opacity for stages that match, and at opacity 0.3 for stages that don't match.
- "strong" theories: all matched stages at full brightness
- "partial" theories: matched stages at 0.7 opacity, unmatched at 0.3
- "conditional" theories: matched stages at 0.4 opacity, unmatched at 0.2

Each cell: width ~140, height 50, with 2px gap between cells.

**Bottom bar (y=730, full width)**:
A rounded rect (rx=20, fill #2C3E50, stroke #cccccc) containing the judgment summary:
- Three colored indicators with labels: ■ 強い対応: N件 / ■ 部分的対応: N件 / ■ 条件付き: N件
- Colors: green #27AE60, yellow #F1C40F, orange #E67E22

---

## SVG Rules (mandatory)

These rules are non-negotiable. The SVG will be rejected if any rule is violated.

1. **viewBox**: `viewBox="0 0 1200 800"`. Do NOT set fixed `width` or `height` attributes on the root `<svg>` element.
2. **Background**: `<rect width="100%" height="100%" fill="#1a1a2e" />` as the first child element.
3. **Forbidden elements**: Do NOT use any of the following: `<foreignObject>`, `<script>`, `<animate>`, `<animateTransform>`, `<animateMotion>`, `<image>`, `<filter>`, `<style>`. None of these may appear anywhere in the output.
4. **Text rendering**: All text must use `<text>` and `<tspan>` elements only. Set `font-family="sans-serif"` on the root `<svg>` element.
5. **5-stage color palette** (use for thematic accents where appropriate):
   - 場 (Ba): #8B8682
   - 波 (Nami): #5B8DB8
   - 縁 (En): #D4A857
   - 渦 (Uzu): #C45B4D
   - 束 (Taba): #5B8B6A
6. **Output**: Return the complete SVG code only. No markdown fences, no explanation text, no preamble.
7. **Encoding**: Use UTF-8. Japanese text must render correctly.
8. **No external resources**: No external fonts, no linked stylesheets, no external images.
