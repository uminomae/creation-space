# TYPE S1: 30-Domain Stage Distribution Heatmap

- **Template**: type-s1-distribution
- **Type**: S1 (30-Domain Stage Distribution Heatmap)
- **Version**: 1.0
- **Purpose**: Cross-domain synthesis presentation showing stage correspondence strength per domain

## Placeholders

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{{distribution_data}}` | See format below | Structured data for all 30 domains |

### distribution_data format

One line per domain (30 lines total):

```
domain_id | domain_name | 場_strength | 波_strength | 縁_strength | 渦_strength | 束_strength
```

Strength values are 0-10 (integer), where 0 = no correspondence and 10 = strongest correspondence.

Example:

```
D01 | 数学 | 8 | 6 | 9 | 7 | 8
D02 | 物理学 | 7 | 5 | 8 | 6 | 7
D03 | 化学 | 6 | 4 | 7 | 5 | 6
D04 | 生物学 | 7 | 6 | 8 | 4 | 7
D05 | 神経科学 | 8 | 7 | 9 | 6 | 8
```

---

## Prompt

Generate a single SVG infographic visualizing the 30-domain stage distribution heatmap.

### Data

- **Distribution data**:
{{distribution_data}}
- **Stage totals**: 場(Ba)=15, 波(Nami)=9, 縁(En)=28, 渦(Uzu)=11, 束(Taba)=22

### Layout specification

Create a heatmap grid with the following structure:

**viewBox**: 1200x900.

**Title**: At the top center (x=600, y=40), display "30領域 x 5段階 対応強度ヒートマップ" in white, font-size 28, bold.

**Column headers**: Starting at y=80, display the 5 stage names as column headers, each in its stage color, font-size 14, bold:
- x=480: "場" in #8B8682
- x=560: "波" in #5B8DB8
- x=640: "縁" in #D4A857
- x=720: "渦" in #C45B4D
- x=800: "束" in #5B8B6A

**Row labels**: On the left side (x=30), display domain IDs (font-size 11, #cccccc) and domain names (font-size 11, white) for each of the 30 rows.

**Grid**: 30 rows x 5 columns. Each row is 24px tall, starting at y=100. Each cell is a rectangle (70x20, rx=3). Cell fill color is determined by the stage color at varying opacity:
- Strength 0: stage color at opacity 0.05 (nearly invisible)
- Strength 1-2: stage color at opacity 0.15
- Strength 3-4: stage color at opacity 0.30
- Strength 5-6: stage color at opacity 0.50
- Strength 7-8: stage color at opacity 0.70
- Strength 9-10: stage color at opacity 0.90

Inside each cell, display the strength number in white (font-size 10) if strength >= 3, or in #666666 if strength < 3.

**Right margin summary**: To the right of each row (x=870), display a short judgment summary as a horizontal bar. The bar width is proportional to the average strength across all 5 stages (max width 200px). Bar fill="#D4A857" at opacity 0.5, height 14, rx=3.

**Bottom totals row**: Below the grid (y=830), display stage totals in a highlighted row. Each total cell has a slightly brighter background. Show "合計" label on the left, and each stage total (e.g., "28", "22", "15", "11", "9") in white, font-size 14, bold, inside the corresponding column.

**Color legend**: At the bottom-right (x=950, y=870), show a small gradient legend from "弱 (0)" to "強 (10)" using 5 sample rectangles with increasing opacity.

---

## SVG Rules (mandatory)

These rules are non-negotiable. The SVG will be rejected if any rule is violated.

1. **viewBox**: `viewBox="0 0 1200 900"`. Do NOT set fixed `width` or `height` attributes on the root `<svg>` element.
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
