# TYPE C: Cross-cutting Patterns Hub-Satellite Diagram

- **Template**: type-c-patterns
- **Type**: C (Cross-cutting Patterns)
- **Version**: 1.0
- **Proven by**: D01-03-cross-patterns-svg.svg (D01 pilot)

## Placeholders

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{{domain_id}}` | D01 | Domain identifier |
| `{{domain_name_ja}}` | 数学 | Domain name in Japanese |
| `{{pattern_count}}` | 5 | Total number of cross-cutting patterns |
| `{{primary_pattern_name}}` | 境界凝縮パターン | Most prominent pattern (center) |
| `{{primary_pattern_count}}` | 6/11 | Frequency fraction (theories matching / total) |
| `{{primary_pattern_description}}` | 構造的情報が境界・臨界・整合条件の近傍に凝縮する | One-line description |
| `{{primary_pattern_theories}}` | Julia集合, 層/Cech, Milnor, 分岐理論, 特異摂動, Morse理論 | Comma-separated theory names |
| `{{satellite_patterns}}` | See format below | Structured data for remaining patterns |

### satellite_patterns format

One line per satellite pattern:

```
name | count | description | theories
```

Example:

```
構成的順序パターン | 3/11 | 数学的構成手順が5段階の順序と一致 | 層/Cech, Milnor, Morse
非完遂パターン | 3/11 | 場→束が完遂されない場合がある | ガロア, 層, 分岐
生成-消滅の対称性 | 3/11 | 構造の生成と消滅が対で記述される | パーシステントホモロジー, Milnor, 分岐理論
構成的 vs 分析的の二分法 | 3/11 | 構成的アプローチと分析的アプローチで対応強度が異なる | 層, Milnor, Morse, ホッジ, 高次圏
```

---

## Prompt

Generate a single SVG infographic visualizing cross-cutting patterns discovered in the {{domain_name_ja}} domain ({{domain_id}}).

### Data

- **Domain**: {{domain_id}} {{domain_name_ja}}
- **Total patterns found**: {{pattern_count}}
- **Primary pattern (center)**: {{primary_pattern_name}} ({{primary_pattern_count}} theories)
  - Description: "{{primary_pattern_description}}"
  - Found in: {{primary_pattern_theories}}
- **Satellite patterns**:
{{satellite_patterns}}

### Layout specification

Create a hub-satellite diagram with the following structure:

**Title**: At the top center, display "{{domain_name_ja}}探究における横断的パターンの発見" in white, font-size 32, bold.

**Center card (hub)**: Place the primary pattern "{{primary_pattern_name}}" at the center of the canvas (approximately x=600, y=400). This is the largest card (roughly 400x240). Give it a golden glow effect using layered rectangles with decreasing opacity (#D4A857 at opacity 0.2 and 0.3 behind the main card). The main card has fill="#2a2a4e", stroke="#D4A857", stroke-width 4. Inside the card, show:
- Pattern name in #D4A857, font-size 28, bold
- Count "({{primary_pattern_count}} theories)" in white, font-size 18
- Description as a quoted phrase in white, font-size 20 (split across 2 lines if needed)
- "Found in:" label in #cccccc, font-size 16
- Theory names in #D4A857, font-size 14 (split across 2 lines if needed)

**Satellite cards**: Distribute the remaining patterns around the center in a balanced layout. Use these positions for up to 4 satellites:
- Top-left: (300, 250)
- Top-right: (900, 250)
- Bottom-left: (300, 600)
- Bottom-right: (900, 600)

Each satellite card is smaller (roughly 300x180). Each gets a distinct accent color from this palette:
- Satellite 1: #4a90e2 (blue)
- Satellite 2: #e24a4a (red)
- Satellite 3: #50e3c2 (teal)
- Satellite 4: #b34ae2 (purple)

Each satellite card has a subtle glow (accent color at opacity 0.2), main rect with fill="#2a2a4e" and accent-colored stroke (stroke-width 2). Inside each card:
- Pattern name in accent color, font-size 20, bold
- Count in white, font-size 14
- Description as a quoted phrase in white, font-size 16 (split across 2 lines if needed)
- Theory names in #cccccc, font-size 14

**Connecting lines**: Draw lines from center to each satellite. Use two layers:
1. Bottom layer: stroke="#D4A857", stroke-width 4, opacity 0.4 (glow)
2. Top layer: stroke="#D4A857", stroke-width 2, full opacity (sharp line)

Optionally add fainter cross-connections between satellites (opacity 0.3) to suggest interconnection.

**Key finding callout**: Below the center card (around y=570 relative to center), place a pill-shaped highlight: rect with rx=25, fill="#D4A857" opacity 0.9, white stroke. Inside, white text on dark: "{{domain_name_ja}}で最も顕著な発見 = {{primary_pattern_name}}" in font-size 18, bold, fill="#1a1a2e".

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
