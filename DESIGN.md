# creation-space — DESIGN.md

> Self-contained design system entrypoint for Claude Design ingestion.
> Source of truth: `src/styles/tokens.css`. Programmatic version: `src/styles/tokens.json`.
> Format: [Stitch DESIGN.md](https://stitch.withgoogle.com/docs/design-md/format/) 9-section.

## 1. Visual Theme & Atmosphere
- **Mood**: 静謐で深い宇宙的暗背景の上に、藍色のアクセントが薄く広がる
- **Density**: コンテンツ密度はやや低め、余白を活かしたゆったりとした UI
- **Philosophy**: 制作行為そのものを邪魔しない、surface-based UI
- **Differentiator (vs awareness-space / kesson-space)**: cs は **UI scale 大**、surface (`--cs-surface-1/2/3`) ベースの action、Noto Sans UI 採用

## 2. Color Palette & Roles

| Token | Value | Role |
|-------|-------|------|
| `--ds-color-bg-body` | `#050508` | Body 背景 (深い暗) |
| `--ds-color-accent` | `rgb(100, 150, 255)` (#6496ff) | Accent (links, focus, emphasis) |
| `--ds-color-heading` | `rgb(255, 255, 255)` | Heading 文字色 |
| `--ds-color-sub-text` | `rgb(180, 200, 230)` | Sub-text |
| `--ds-color-highlight` | `rgb(220, 230, 245)` | Highlight |
| `--ds-color-link` | `rgb(130, 170, 255)` | Link |

cs 固有:
- Surface 階層: `--cs-surface-1` (`rgba(20, 25, 40, 0.3)`) → `--cs-surface-2` (0.6) → `--cs-surface-3` (0.9)
- Action は surface ベース: `--cs-action-bg: rgba(accent, 0.1)`, `--cs-card-bg: var(--cs-surface-3)`

## 3. Typography Rules
- **Display Serif**: `Noto Serif JP, Yu Mincho, MS PMincho, serif` (`--ds-font-serif-display`)
- **UI Sans**: `Noto Sans JP, Hiragino Sans, Yu Gothic, Meiryo, system-ui, sans-serif` (`--cs-font-sans-ui`、cs 固有)
- **Mono**: `SF Mono, Fira Code, Consolas, monospace` (`--ds-font-mono-ui`)

階層:
- h1: `clamp(1.0rem, 5.5vmin, 2.0rem)` (`--ds-h1-size`)
- Section heading: 0.88rem
- Card title: 1.0rem / Card text: 0.92rem / Card summary: 0.92rem
- UI base: 0.85rem (xs) / 0.88rem (sm)

Letter spacing scale:
- tight 0.03em / normal 0.06em / wide 0.1em / heading 0.15em

## 4. Component Stylings

### Card
- bg: `--cs-card-bg` (= `--cs-surface-3`)
- border: `--ds-card-border` / hover: `--ds-card-border-strong`
- shadow: `--ds-card-shadow-soft` / `--ds-card-shadow-rich`
- radius: `--ds-radius-md` (3px)

### Topbar
- height: 3.25rem (`--cs-topbar-height`)
- bg: `rgba(10, 14, 24, 0.10)` (blurred 14px)
- title: `clamp(0.96rem, 1.85vw, 1.38rem)`
- 詳細は `--cs-topbar-*` 参照

### Dev panels / HUD
- 暗背景 (`rgba(7, 12, 24, 0.96)`) + 藍色 border
- 詳細は `--cs-dev-panel-*` / `--cs-dev-hud-*` 参照

### Action (button-like)
- bg: `rgba(accent, 0.1)` → hover で card-bg に
- text: sub-text 50% alpha → hover で heading 70%

## 5. Layout Principles
- Spacing baseline: 1rem / 1.5rem (`--ds-section-content-padding: 1rem 1.5rem 0`)
- Section grid margin top: 1.5rem
- Surface stacking: surface-1 (0.3) → surface-2 (0.6) → surface-3 (0.9) で奥行き表現

## 6. Depth & Elevation

Z-index は `--cs-z-*` semantic tokens に集約 (cs#233):

```
content (1, 2) → raised (5, 6) → ui-low (10) → ui-mid (15-21)
→ ui-high (58) → topbar (60) → hud (100) → viewer-overlay (200)
→ modal-info (500) → dev-overlay (1001) → dev-panel (1200)
→ slides (1500-1510) → startup (99998-100000) → modal (100001+)
```

Shadow:
- soft: `0 4px 12px rgba(accent, 0.15)`
- rich: `0 8px 24px rgba(0, 0, 0, 0.38), 0 0 12px rgba(accent, 0.15)`

## 7. Do's and Don'ts
- ✅ **Do**: `--ds-*` で共通 token を参照 (cs/as/ks 横断対称)
- ✅ **Do**: cs 固有値は `--cs-*` namespace
- ✅ **Do**: surface 階層 (`--cs-surface-1/2/3`) で奥行き表現
- ✅ **Do**: 色は `rgb()` ではなく `r, g, b` の 3 値で定義 (`rgba()` で透明度を柔軟に変えるため)
- ✅ **Do**: サイト全体の空気を変えるなら root token (`--ds-*` / `--cs-*` 基底層)、特定 UI だけなら component-local 変数を優先 (同じ値の直書きが複数 css に現れたら新規直書きせず token へ寄せる)
- ❌ **Don't**: 生 `rgba(100, 150, 255, ...)` を書かない (token 化必須)
- ❌ **Don't**: z-index を数値直書きしない (`--cs-z-*` を使用)
- ❌ **Don't**: CDN / 多重 alias / 外部 design-system 参照 (self-contained 原則)

## 8. Responsive Behavior
- Mobile / desktop は `clamp()` ベースで自動追従
- Topbar title: `clamp(0.96rem, 1.85vw, 1.38rem)`
- h1: `clamp(1.0rem, 5.5vmin, 2.0rem)`
- Arrow / 装飾: `clamp(0.7rem, 3.5vmin, 1.2rem)`
- 明示的 breakpoint は最小限、`vmin` / `vw` による流動スケーリング優先

## 9. Agent Prompt Guide

creation-space スタイルで UI を生成するプロンプト雛形:

> 「creation-space スタイルで [コンポーネント名] を作って。
> bg は `--ds-color-bg-body` (#050508)、accent は `--ds-color-accent` (#6496ff)、
> surface は `--cs-surface-1/2/3` から選ぶ。
> font は UI なら `--cs-font-sans-ui`、display は `--ds-font-serif-display`。
> radius は `--ds-radius-md` (3px)、
> z-index は `--cs-z-*` semantic tokens から選ぶ。」

色クイック参照:
- BG: `#050508`
- Accent: `#6496ff`
- Heading: `#ffffff`
- Sub-text: `rgb(180, 200, 230)`
- Link: `rgb(130, 170, 255)`
