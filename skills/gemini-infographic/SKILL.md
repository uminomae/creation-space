# SKILL: Gemini Infographic Generation

## Overview

Generate SVG infographics for domain reports, theme reports, and cross-domain synthesis using Gemini 3 Pro API. Each infographic visualizes the 5-stage model analysis results with a unified dark-theme design system.

## Decision

- **SVG adopted, PNG rejected** (pjdhiro decision 2026-03-23)
- Rationale: SVG allows precise control over layout, text, and colors; embeds directly in Markdown; no binary artifacts

## Model

- **Model ID**: `gemini-3-pro-image-preview`
- **Mode**: Text mode (`responseModalities: ["TEXT"]`)
- The model generates SVG markup as text output, not as an image binary

## API

- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- **Method**: `curl -X POST` with JSON body
- **API Key**: `$GEMINI_API_KEY` (stored in macOS Keychain, see #246)
- **Rate limit**: 5 second delay between consecutive API calls

## Template Types

| Type | Target | Description |
|------|--------|-------------|
| **A** | Domain report | 5-stage radar/summary card (after section 1) |
| **B** | Domain report | Theory correspondence matrix (after section 4) |
| **C** | Domain report | Key insight highlight card (after section 6) |
| **T1** | Theme report | Theme overview with domain comparison |
| **T2** | Theme report | Cross-domain pattern visualization |
| **S1** | Synthesis presentation | Title slide with stage overview |
| **S2** | Synthesis presentation | Domain cluster visualization |
| **S3** | Synthesis presentation | Key findings summary |

## Workflow

1. **Read source .md** -- Load the domain/theme/synthesis report
2. **Extract data for placeholders** -- Parse stage judgments, theory names, scores, and key findings
3. **Fill prompt template** -- Insert extracted data into the appropriate prompt template (A/B/C/T1/T2/S1/S2/S3)
4. **Call Gemini API** -- Send the filled prompt via curl to the API endpoint
5. **Extract SVG from response** -- Parse the JSON response and extract the SVG markup from the text content
6. **Validate** -- Check: valid XML, no forbidden elements, correct viewBox, dark background present
7. **Save to assets** -- Write the SVG file to the appropriate assets directory

## SVG Insertion Points

### Domain reports

| Type | Position |
|------|----------|
| TYPE A | After section 1 (overview) |
| TYPE B | After section 4 (theory correspondence) |
| TYPE C | After section 6 (key insights) |

### Theme reports

- Insert at line 10-11 (before section A)

### Synthesis presentation

- One SVG per slide

## Design System

See `context/design-system.md` for the unified visual design specification.

## Quality Gates

- [ ] Valid XML (parseable by xmllint or equivalent)
- [ ] No forbidden elements (`foreignObject`, `script`, `animate`, `image`, `filter`, `style`)
- [ ] Correct viewBox (`1200 800` standard, `1200 900` for 11+ theory matrices)
- [ ] Dark background present (`#1a1a2e` or gradient to `#111122`)
