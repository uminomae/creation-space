# Unified Design System for SVG Infographics

## Background

- Primary background: `#1a1a2e`
- Optional gradient: `#1a1a2e` to `#111122` (top to bottom)

## Text Colors

| Role | Color |
|------|-------|
| Primary text | `#f0f0f0` |
| Secondary text | `#cccccc` |
| Disabled / muted | `#888888` |

## 5-Stage Color Palette

| Stage | Japanese | English | Color |
|-------|----------|---------|-------|
| 場 | Ba | Field | `#8B8682` |
| 波 | Nami | Wave | `#5B8DB8` |
| 縁 | En | Edge | `#D4A857` |
| 渦 | Uzu | Vortex | `#C45B4D` |
| 束 | Taba | Bundle | `#5B8B6A` |

## Accent Colors (for satellites and supplementary elements)

| Name | Color |
|------|-------|
| Blue | `#4a90e2` |
| Red | `#e24a4a` |
| Teal | `#50e3c2` |
| Purple | `#b34ae2` |

## Typography

- Font family: `font-family="sans-serif"`
- Title: 28-36px, bold (`font-weight="bold"`)
- Body text: 14-18px
- Labels / annotations: 12-14px

## Card Style

- Fill: `#2a2a4e`
- Rounded corners: `rx="10"`
- Stroke: use accent color appropriate to context
- Example:
  ```xml
  <rect x="50" y="100" width="300" height="200" rx="10" fill="#2a2a4e" stroke="#4a90e2" stroke-width="1.5"/>
  ```

## Glow Effects

Create glow by layering semi-transparent rectangles behind the main card:

```xml
<\!-- Outer glow -->
<rect x="48" y="98" width="304" height="204" rx="12" fill="#4a90e2" opacity="0.2"/>
<\!-- Inner glow -->
<rect x="49" y="99" width="302" height="202" rx="11" fill="#4a90e2" opacity="0.3"/>
<\!-- Card -->
<rect x="50" y="100" width="300" height="200" rx="10" fill="#2a2a4e" stroke="#4a90e2" stroke-width="1.5"/>
```

## Gradients

Define gradients in `<defs>` using `<linearGradient>`:

```xml
<defs>
  <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a1a2e"/>
    <stop offset="100%" stop-color="#111122"/>
  </linearGradient>
</defs>
<rect width="1200" height="800" fill="url(#bgGradient)"/>
```

## viewBox

- Standard: `viewBox="0 0 1200 800"`
- Extended (for 11+ theory matrices): `viewBox="0 0 1200 900"`

## SVG Constraints (Forbidden Elements)

The following elements MUST NOT appear in generated SVGs:

- `<foreignObject>` -- not reliably supported
- `<script>` -- security risk
- `<animate>` -- not rendered in static contexts
- `<image>` -- external dependency
- `<filter>` -- inconsistent rendering across viewers
- `<style>` -- use inline attributes instead

## Judgment Visualization

Map judgment strength to opacity of the stage color:

| Judgment | Rendering |
|----------|-----------|
| Strong correspondence | Full stage color (opacity 1.0) |
| Partial correspondence | Stage color at opacity 0.7, dimmed variant |
| Conditional correspondence | Stage color at opacity 0.3-0.4 |
| No correspondence | Near-background, opacity 0.2 |
