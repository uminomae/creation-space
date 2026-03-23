# TYPE T2: Theme Divergence/Tension Map

- **Template**: type-t2-divergence
- **Type**: T2 (Theme Divergence/Tension Map)
- **Version**: 1.0
- **Purpose**: Visualizing unresolved tensions in theme reports (section C)

## Placeholders

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{{theme_name_ja}}` | 縁の類型学 | Theme name in Japanese |
| `{{divergence_count}}` | 3 | Total number of divergences/tensions (2-3) |
| `{{divergences}}` | See format below | Structured data for each tension |

### divergences format

One line per divergence/tension:

```
pole_a | pole_b | description | domains_a | domains_b
```

Example:

```
構造的決定論 | 創発的自由 | 構造が行動を決定するか、創発が自由を生むか | D01,D03,D07,D12 | D05,D09,D14,D20
局所的作用 | 大域的整合 | 局所的なメカニズムと大域的な整合性の緊張 | D02,D08,D15 | D04,D11,D18,D22
段階的進行 | 非連続的飛躍 | 変化は漸進的か非連続的か | D06,D10,D16,D23,D28 | D19,D25,D27
```

---

## Prompt

Generate a single SVG infographic visualizing the unresolved tensions/divergences for the theme "{{theme_name_ja}}".

### Data

- **Theme**: {{theme_name_ja}}
- **Divergence count**: {{divergence_count}}
- **Divergences**:
{{divergences}}

### Layout specification

Create a tension/divergence map with the following structure:

**viewBox**: 1200x800.

**Title**: At the top center (x=600, y=50), display "{{theme_name_ja}} - 未解決の緊張構造" in white, font-size 30, bold.

**Tension bands**: For each divergence, create a horizontal band spanning the canvas width. If there are 2 divergences, place them at y=280 and y=560. If there are 3, place them at y=220, y=420, and y=620. Each band is approximately 160px tall.

**Pole nodes**: For each divergence, place two pole nodes at opposite ends of the band:
- Pole A (left): rounded rectangle (180x80, rx=10) centered at x=160, filled with #2a2a4e, accent-colored stroke (stroke-width 3). Pole name in accent color, font-size 18, bold.
- Pole B (right): rounded rectangle (180x80, rx=10) centered at x=1040, same styling with a contrasting accent color.

Accent color pairs for divergences:
- Divergence 1: Pole A #4a90e2 (blue), Pole B #e24a4a (red)
- Divergence 2: Pole A #50e3c2 (teal), Pole B #b34ae2 (purple)
- Divergence 3: Pole A #D4A857 (gold), Pole B #5B8DB8 (steel blue)

**Tension zone**: Between each pair of poles, draw a shaded rectangular band (x=280 to x=920, full band height) filled with a gradient-like effect using overlapping rectangles: the left half tinted with Pole A's accent color at opacity 0.08, the right half tinted with Pole B's accent color at opacity 0.08, and the center overlap zone at combined opacity 0.12. Add a dashed vertical line at x=600 (stroke="#ffffff", opacity 0.3, stroke-dasharray="8,6") to mark the midpoint.

**Description text**: Center the divergence description text (font-size 14, #cccccc) at the top of each band, centered at x=600.

**Domain circles**: Place domain circles along the spectrum between the two poles:
- Domains supporting Pole A cluster toward the left (x=300-500), each as a circle (r=16) with Pole A's accent color at opacity 0.4, stroke in accent color, domain ID in white font-size 9.
- Domains supporting Pole B cluster toward the right (x=700-900), same styling with Pole B's accent color.
- Stagger circles vertically within the band to avoid overlap.

**Connecting lines**: Draw faint lines (opacity 0.2, stroke-width 1) from each domain circle to its respective pole node.

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
