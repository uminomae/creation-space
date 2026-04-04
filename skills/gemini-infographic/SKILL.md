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

**旧概要図（cs#136）は廃止**: `domain-D{NN}-{slug}.svg` 形式の冒頭概要図は TYPE A に統合・廃止。新規レポートには挿入しない。

### Domain reports (JA/EN)

| Type | Trigger (section heading) | Markdown link format |
|------|---------------------------|---------------------|
| TYPE A | `## 1.` | `![{domain_name} — 調査概要インフォグラフィック]({url})` |
| TYPE B | `## 4.` | `![{domain_name} — 理論×5段階対応マトリクス]({url})` |
| TYPE C | `## 6.` | `![{domain_name} — 横断的パターン図]({url})` |

### Presentations (JA/EN) — SVG Layout Rules (cs#160)

Presentations use section-name triggers (not numbered headings like domain reports).
Each SVG is placed **immediately after the section heading**, before the section's content.

**Design rationale**: SVGs serve as visual anchors — the overview heatmap orients the reader at the start, the theory matrix accompanies the evidence table, and the cross-cutting diagram precedes the pattern analysis. This "infographic then prose" order lets the reader form a visual mental model before reading details.

| Type | JA trigger heading | EN trigger heading | Alt text (JA) | Alt text (EN) |
|------|-------------------|-------------------|---------------|---------------|
| TYPE A | `## 調査の概要` | `## Survey Overview` or `## Overview of the Study` | `Domain — 調査概要インフォグラフィック` | `Domain — Research Overview Infographic` |
| TYPE B | `## 構造対応の全体像` | `## Overall Structural Correspondence` or `## Overview of Structural Correspondences` (variants OK) | `Domain — 理論×5段階対応マトリクス` | `Domain — Theory x 5-Stage Correspondence Matrix` |
| TYPE C | `## 横断的パターン` | `## Cross-Cutting Patterns` or `## Cross-Domain Patterns` | `Domain — 横断的パターン図` | `Domain — Cross-Cutting Patterns Diagram` |

**Insertion format** (no caption, no page break — the heading itself serves as context):

```markdown
## {Section Heading}

![{Alt text}](https://uminomae.github.io/pjdhiro/assets/creation/img/svg/domains/ja/D{NN}-{suffix}.svg)

- First bullet point of section content...
```

**Rules**:
- One blank line before and after the `![...]()` image link
- No separate `## 構造対応図` / `## Structural Correspondence Diagram` section — TYPE A replaces the old overview diagram
- EN presentations reference JA SVGs (same URL path) per the Language Handling rule above
- If a presentation uses a non-standard heading variant, match by substring (e.g. "Structural Correspond" for TYPE B)

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
- [ ] **SVG属性値に算術式が含まれていないこと** (後述「算術式禁止ルール」参照)

## 算術式禁止ルール (Arithmetic Expression Ban)

**背景**: 2026-04-01 に D07/D12/D17/D21/D24 の overview/theories-map SVG で表示崩れが発覚。原因は Gemini が SVG 属性値に `y="190 + 52*3"` のような算術式を出力し、ブラウザ/PDF レンダラが先頭の数値だけを解釈して全行が y=190 に重なったこと。techo#82 で修正。

**ルール**:
1. SVG の属性値（x, y, width, height, x1, y1, x2, y2, cx, cy, r, rx, ry, dx, dy 等）には **評価済みの数値のみ** を記述すること。`y="242"` は正、`y="190 + 52*1"` は不正。
2. Gemini API からの SVG 出力を受け取った後、Phase 1 Step 6 (Validate) で以下の検証を **必ず** 実行する:
   ```
   grep -E '(x|y|dx|dy|x1|y1|x2|y2|cx|cy|width|height)="[0-9]+\s*[\+\-\*]' output.svg
   ```
   ヒットした場合は **生成失敗** として扱い、算術式を評価済み数値に展開してから保存する。
3. 修正スクリプト（応急処置）:
   ```python
   import re
   def eval_expr(m):
       attr, expr = m.group(1), m.group(2)
       if re.match(r'^[\d\s\+\-\*\.]+$', expr.strip()):
           return f'{attr}="{int(eval(expr))}"'
       return m.group(0)
   content = re.sub(
       r'((?:x|y|dx|dy|x1|y1|x2|y2|cx|cy|r|rx|ry|width|height))="(\d+[\s]*[\+\-\*][\d\s\+\-\*\.]+)"',
       eval_expr, content)
   ```
4. Gemini プロンプトに以下の制約を明示的に含める:
   > **CRITICAL**: All SVG attribute values must be pre-computed numeric literals. Never use arithmetic expressions like `y="190 + 52*3"` — SVG does not evaluate math in attributes. Write `y="346"` instead.

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/generate-infographic-svgs.py` | Phase 1: Gemini API → SVG 生成 |
| `scripts/insert-infographic-links.py` | Phase 2: MD への SVG リンク挿入 |
| `transform/scripts/build-pdf-guide.sh` | Phase 4: PDF 再ビルド |

## Related Workflows

Each content container has its own end-to-end workflow documenting the full pipeline from MD generation through SVG insertion, PDF build, and publish push.

| Container | Workflow | Description |
|-----------|----------|-------------|
| Domains | `transform/domains/WORKFLOW.md` | 30 domain academic reports |
| Presentations | `transform/presentations/WORKFLOW.md` | Domain presentation slides |
| Themes (Phase 8) | `transform/themes/WORKFLOW.md` | 5 cross-domain theme reports |
| Synthesis | `transform/synthesis/WORKFLOW.md` | Cross-domain synthesis report |
| Guides | `transform/guides/WORKFLOW.md` | 3 audience-level guides |
| Phase 9 | `transform/phase9/WORKFLOW.md` | Verification track plans |
