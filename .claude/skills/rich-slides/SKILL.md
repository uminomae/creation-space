---
name: rich-slides
description: >
  Generate visually rich, self-contained 16:9 HTML slide decks from Markdown input.
  Use this skill whenever the user wants to create slides, presentations, or deck-style
  content for browser viewing or web publishing. Triggers on: "slides", "presentation",
  "deck", "スライド", "プレゼン", "発表資料", or any request to convert markdown/text into
  a visual slide format. Also triggers when the user mentions "16:9", "slide show",
  or wants to publish visual content to a website. Do NOT trigger for PowerPoint (.pptx)
  file creation — use the pptx skill for that. This skill produces HTML files, not .pptx.
---

# Rich Slides — MD to Browser-Ready 16:9 HTML Slides

## What This Skill Does

Transforms Markdown content into a self-contained, visually polished HTML file that
displays as a 16:9 slide deck in the browser. The output is a single `.html` file with
all CSS and JS inlined — no external dependencies, ready to deploy to any static site.

## Design Philosophy

The visual language is a dark glassmorphism theme inspired by creation-space's existing
design system. Think: deep navy/charcoal backgrounds, frosted glass cards, subtle gradient
accents (blue → violet → green), and generous typography. The goal is a slide deck that
looks like it was designed by a professional, not like markdown rendered in a box.

## Workflow

### Step 1: Understand the Input

The user provides content in one of these forms:

1. **Markdown with `---` slide separators** — Each `---` on its own line starts a new slide
2. **Plain text or bullet points** — You structure it into slides
3. **A file path to an existing .md** — Read and convert
4. **A topic** — You write the content AND create the slides

If the input is a topic, draft the slide content first and confirm with the user before
generating the HTML.

### Step 2: Plan the Slide Structure

Before generating HTML, classify each slide into a layout type:

| Layout | When to Use | Visual Treatment |
|--------|------------|-----------------|
| `title` | First slide, section dividers | Centered, large heading, gradient accent line, subtitle in muted color |
| `section` | Major topic transition | Large heading with animated gradient underline |
| `content` | Text + bullet points | Left-aligned body, glassmorphism card for key points |
| `visual` | Image/SVG-heavy | Full-bleed media with minimal text overlay |
| `split` | Comparison, before/after | Two-column layout with glass divider |
| `data` | Charts, tables, metrics | Card grid or highlighted metric boxes |
| `quote` | Key insight, citation | Large centered quote with accent border, attribution |
| `conclusion` | Final slide | Gradient accent, summary points with green checkmarks |

### Step 3: Generate the HTML

Run the generation script:

```bash
python /path/to/skill/scripts/generate_slides.py \
  --input input.md \
  --output output.html \
  --title "Presentation Title" \
  --lang ja
```

If the script is not available or you need custom layouts, generate the HTML directly
following the design reference in `references/design-spec.md`.

### Key HTML Requirements

1. **Self-contained**: All CSS and JS must be inlined in the single HTML file
2. **16:9 aspect ratio**: Use `aspect-ratio: 16/9` with responsive scaling
3. **Keyboard navigation**: Arrow keys, Space, Escape (to exit fullscreen)
4. **Slide transitions**: Smooth opacity + subtle transform animation (200-300ms)
5. **Progress indicator**: Thin gradient bar at bottom + slide counter
6. **Print-friendly**: `@media print` styles that output one slide per page
7. **Touch support**: Swipe gestures for mobile/tablet viewing
8. **Fullscreen**: F key or button to enter native fullscreen

### Design Tokens (from creation-space)

```css
/* Backgrounds */
--bg-deep: #0a0e17;
--bg-elevated: #1e293b;
--bg-card: rgba(17, 24, 39, 0.74);

/* Text */
--text-primary: #f1f5f9;
--text-secondary: #94a3b8;
--text-tertiary: #64748b;

/* Accents */
--accent-blue: #60a5fa;
--accent-violet: #a78bfa;
--accent-green: #34d399;
--accent-amber: #fbbf24;

/* 5-Stage palette (for creation-space specific content) */
--stage-field: #8B8682;    /* 場 */
--stage-wave: #5B8DB8;     /* 波 */
--stage-edge: #D4A857;     /* 縁 */
--stage-vortex: #C45B4D;   /* 渦 */
--stage-bundle: #5B8B6A;   /* 束 */

/* Glass effect */
--glass-bg: rgba(17, 24, 39, 0.74);
--glass-border: rgba(148, 163, 184, 0.14);
--glass-blur: 16px;

/* Typography */
--font-heading: "Inter", "Noto Sans JP", system-ui, sans-serif;
--font-body: "Inter", "Noto Sans JP", system-ui, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", monospace;

/* Spacing & Radius */
--radius: 16px;
--radius-sm: 8px;
```

### Visual Effects That Make Slides Rich

These are what lift the output beyond "markdown in a frame":

1. **Ambient gradients**: Each slide has a subtle radial gradient glow that shifts
   based on content type (blue for data, violet for theory, green for conclusions)
2. **Glass cards**: Key points and callouts sit on frosted glass panels with
   `backdrop-filter: blur(16px)` and subtle borders
3. **Animated entry**: Content elements fade-in + slide-up on page transition
   (staggered 50ms per element)
4. **Accent lines**: Gradient lines (blue → violet) under headings and between sections
5. **Metric highlights**: Numbers and key stats get large, colored, mono-font treatment
6. **Code blocks**: Dark inset with green accent, proper syntax highlighting
7. **Table styling**: Rounded glass cards with header row in elevated background
8. **SVG integration**: If the slide references an SVG, inline it with proper scaling
9. **Subtle texture**: Optional noise overlay at very low opacity for depth

### Anti-Patterns (What Not to Do)

- No white backgrounds — this is a dark theme, always
- No generic bullet lists without visual treatment — use glass cards or icon markers
- No walls of text — if a slide has more than 5 lines of body text, split it
- No tiny fonts — minimum 1rem for body text at 1920x1080 equivalent
- No abrupt transitions — always animate with ease timing

## Output

Save the generated HTML to the user's workspace folder. The file should be viewable
by simply opening it in a browser — no build step, no server required.

For Jekyll deployment, the HTML can be placed in `_includes/` or used as a standalone
page with front matter:

```yaml
---
layout: null
title: "Presentation Title"
---
```

## File Organization

```
rich-slides/
├── SKILL.md              ← This file
├── scripts/
│   └── generate_slides.py  ← Python script for MD → HTML conversion
├── references/
│   └── design-spec.md      ← Detailed CSS patterns and layout templates
└── assets/
    └── (reserved for fonts, icons if needed)
```

## References

- Read `references/design-spec.md` for detailed CSS patterns, HTML structures, and
  layout templates for each slide type
- The design system draws from creation-space's `src/styles/slides.css` and
  `skills/gemini-infographic/context/design-system.md`
