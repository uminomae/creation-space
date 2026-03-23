# SKILL: Gemini Infographic Generation

## Overview

Generate SVG infographics for domain reports, theme reports, presentations, and cross-domain synthesis using Gemini API. Each infographic visualizes the 5-stage model analysis results with a unified dark-theme design system.

## Decision

- **SVG adopted, PNG rejected** (pjdhiro decision 2026-03-23)
- Rationale: SVG allows precise control over layout, text, and colors; embeds directly in Markdown; no binary artifacts

## Model

- **Primary**: `gemini-2.5-flash` (production — fast, reliable)
- **Fallback**: `gemini-2.5-pro` (complex layouts — slower, may timeout)
- **Mode**: Text mode (`responseModalities: ["TEXT"]`)
- The model generates SVG markup as text output, not as an image binary

## API

- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- **Method**: `curl -X POST` with JSON body
- **API Key**: `$GEMINI_API_KEY` (stored in macOS Keychain)
- **Rate limit**: 6 second delay between consecutive API calls
- **Timeout**: 180 seconds per call
- **maxOutputTokens**: 65536

## Template Types

| Type | Target | Description |
|------|--------|-------------|
| **A** | Domain report | 5-stage overview + theory heat map (after section 1) |
| **B** | Domain report | Theory × 5-stage correspondence matrix (after section 4) |
| **C** | Domain report | Cross-cutting patterns hub-satellite diagram (after section 6) |
| **T1** | Theme report | Theme convergence overview with domain comparison |
| **T2** | Theme report | Cross-domain divergence pattern visualization |
| **S1** | Synthesis report | Distribution overview |
| **S2** | Presentation | Slide-level infographic (same rules apply) |
| **S3** | Presentation | Key findings summary |

## Canonical Workflow (正規ワークフロー)

**This is the binding workflow for all infographic generation. All steps are mandatory.**

### Phase 1: SVG 生成

1. **Read source .md** — Load the domain/theme/synthesis/presentation report
2. **Extract data for placeholders** — Parse stage judgments, theory names, scores, key findings
3. **Fill prompt template** — Insert extracted data into the appropriate prompt template
4. **Call Gemini API** — Send the filled prompt via curl to the API endpoint
5. **Extract SVG from response** — Strip markdown fences, extract `<svg>...</svg>`
6. **Validate** — Check: `</svg>` present, no forbidden elements, viewBox present
7. **Save to assets** — Write to `pjdhiro/assets/creation/img/svg/{kind}/{lang}/`

**Script**: `scripts/generate-infographic-svgs.py`

### Phase 2: .md 更新

8. **Insert SVG image links into source .md** — At the canonical insertion points (see below)
9. **Commit and push to pjdhiro main** — MD changes go live via GitHub Pages

**Script**: `scripts/insert-infographic-links.py`

### Phase 3: UI 表示確認

10. **Verify in creation-space UI** — Open `127.0.0.1:3002/?domain=D{NN}`
11. **Check modal rendering** — Infographic SVGs should appear inline as `<img>` tags
12. **Check lightbox** — Click each SVG to confirm full-screen overlay works

### Phase 4: PDF 公開 push

13. **Rebuild PDFs** — `bash transform/scripts/build-pdf-guide.sh --kind domains --lang ja`
14. **Commit and push PDFs** — To pjdhiro main
15. **Update cs#157 Issue** — Comment with results

## SVG Insertion Points

### Domain reports (JA/EN)

| Type | Trigger (section heading) | Markdown link format |
|------|---------------------------|---------------------|
| TYPE A | `## 1.` | `![{domain_name} — 調査概要インフォグラフィック]({url})` |
| TYPE B | `## 4.` | `![{domain_name} — 理論×5段階対応マトリクス]({url})` |
| TYPE C | `## 6.` | `![{domain_name} — 横断的パターン図]({url})` |

### Presentations (JA/EN)

Same TYPE A/B/C rules apply. Presentations are shorter but follow identical section numbering.
If a presentation does not contain `## 4.` or `## 6.`, skip that TYPE.

### Theme reports

- TYPE T1: After the first heading
- TYPE T2: After the domain comparison section

### Synthesis

- One SVG per major section

## Language Handling (EN fallback)

### Rule: EN版は JA SVG が存在すれば同じものを参照する

```
if infographic SVG exists in img/svg/{kind}/ja/:
    # JA infographic がある → EN MD からも JA の SVG URL を参照
    url = "https://uminomae.github.io/pjdhiro/assets/creation/img/svg/{kind}/ja/{filename}"
elif overview SVG exists in img/svg/{kind}/en/:
    # EN 専用 overview SVG がある → それを参照（既存の概要図）
    url = "https://uminomae.github.io/pjdhiro/assets/creation/img/svg/{kind}/en/{filename}"
else:
    # SVG なし → リンクを挿入しない
    skip
```

**理由**: インフォグラフィック SVG はデータ可視化であり、ラベルは日本語でも構造は言語非依存。
EN 専用にラベル翻訳した SVG を生成するのは Phase 2 以降の課題。

## SVG Output Paths

| Kind | Path |
|------|------|
| Domain infographics | `pjdhiro/assets/creation/img/svg/domains/ja/{DNN}-{suffix}.svg` |
| Theme infographics | `pjdhiro/assets/creation/img/svg/themes/ja/{theme-slug}-{suffix}.svg` |
| Synthesis infographics | `pjdhiro/assets/creation/img/svg/synthesis/ja/{slug}-{suffix}.svg` |

### Naming Convention

| Type | Suffix |
|------|--------|
| A | `01-overview-svg` |
| B | `02-theories-map-svg` |
| C | `03-cross-patterns-svg` |
| T1 | `01-convergence-svg` |
| T2 | `02-divergence-svg` |
| S1 | `01-distribution-svg` |

## Design System

See `context/design-system.md` for the unified visual design specification.

## Quality Gates

- [ ] `</svg>` closing tag present
- [ ] No forbidden elements (`foreignObject`, `script`, `animate`, `image`, `filter`, `style`)
- [ ] viewBox attribute present (`1200 800` standard, dynamic height for TYPE B)
- [ ] Dark background present (`#1a1a2e` or gradient to `#111122`)
- [ ] File size > 1 KB (not truncated)
- [ ] UTF-8 encoded, Japanese text renders correctly

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/generate-infographic-svgs.py` | Phase 1: Gemini API → SVG 生成 |
| `scripts/insert-infographic-links.py` | Phase 2: MD への SVG リンク挿入 |
| `transform/scripts/build-pdf-guide.sh` | Phase 4: PDF 再ビルド |
