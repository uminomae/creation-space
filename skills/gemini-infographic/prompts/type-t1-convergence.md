# TYPE T1: Theme Convergence Network (Hub-and-Spoke)

- **Template**: type-t1-convergence
- **Type**: T1 (Theme Convergence Network)
- **Version**: 1.0
- **Purpose**: Phase 8 theme reports showing convergence points and supporting domains

## Placeholders

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{{theme_name_ja}}` | 縁の類型学 | Theme name in Japanese |
| `{{convergence_count}}` | 4 | Total number of convergence points (3-5) |
| `{{convergences}}` | See format below | Structured data for convergence nodes |

### convergences format

One line per convergence point:

```
name | domain_count | description | domains
```

Example:

```
境界の普遍性 | 8 | 異なる領域で境界構造が同型的に出現する | D01,D03,D07,D12,D15,D18,D22,D28
関係性の凝縮 | 6 | 関係が特定条件下で凝縮する現象 | D02,D05,D09,D14,D20,D25
段階的展開 | 5 | 構造が段階を踏んで展開される共通パターン | D04,D08,D11,D19,D27
非線形遷移 | 4 | 閾値を超えると質的に変化する構造 | D06,D10,D16,D23
```

---

## Prompt

Generate a single SVG infographic visualizing the convergence network for the theme "{{theme_name_ja}}".

### Data

- **Theme**: {{theme_name_ja}}
- **Convergence points**: {{convergence_count}}
- **Convergences**:
{{convergences}}

### Layout specification

Create a hub-and-spoke diagram with the following structure:

**viewBox**: 1200x800.

**Title**: At the top center (x=600, y=50), display "{{theme_name_ja}} - 収束ネットワーク" in white, font-size 30, bold.

**Central node (hub)**: Place the theme name "{{theme_name_ja}}" at the center of the canvas (approximately x=600, y=400). This is a large circle (r=80) with fill="#2a2a4e", stroke="#D4A857", stroke-width 4. Add a golden glow effect using a larger circle behind it (#D4A857 at opacity 0.15, r=95). Inside, display the theme name in #D4A857, font-size 22, bold, centered.

**Convergence point nodes**: Distribute {{convergence_count}} convergence nodes radially around the center at a radius of approximately 250px. Each convergence node is a rounded rectangle (roughly 200x100, rx=12) with fill="#2a2a4e" and a distinct accent-colored stroke (stroke-width 3). Each gets a distinct accent color:
- Convergence 1: #4a90e2 (blue)
- Convergence 2: #e24a4a (red)
- Convergence 3: #50e3c2 (teal)
- Convergence 4: #b34ae2 (purple)
- Convergence 5: #D4A857 (gold)

Inside each convergence card:
- Convergence name in the accent color, font-size 16, bold
- Domain count (e.g., "8 domains") in white, font-size 13
- Description in #cccccc, font-size 12 (split across 2 lines if needed)

**Domain circles**: For each convergence, cluster small domain circles (r=14) near the convergence node, arranged in a tight arc on the outer side. Each domain circle has fill matching the convergence accent color at opacity 0.3, stroke matching accent color at opacity 0.6, stroke-width 1.5. Inside each circle, display the domain ID (e.g., "D01") in white, font-size 8, bold.

**Connecting lines (hub to convergence)**: Draw lines from center hub to each convergence node. Use two layers:
1. Bottom layer: accent color, stroke-width 4, opacity 0.3 (glow)
2. Top layer: accent color, stroke-width 2, full opacity (sharp line)

**Legend**: At the bottom-right (x=1050, y=750), show a small legend listing each convergence name with its accent color dot.

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
