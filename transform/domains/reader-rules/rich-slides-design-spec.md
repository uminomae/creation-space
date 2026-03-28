# Rich Slides — Design Specification

## HTML Shell

Every generated slide deck uses this outer structure. All CSS and JS are inlined.

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{TITLE}}</title>
<style>
  /* === RESET & BASE === */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg-deep: #0a0e17;
    --bg-elevated: #1e293b;
    --bg-card: rgba(17, 24, 39, 0.74);
    --text-primary: #f1f5f9;
    --text-secondary: #94a3b8;
    --text-tertiary: #64748b;
    --accent-blue: #60a5fa;
    --accent-violet: #a78bfa;
    --accent-green: #34d399;
    --accent-amber: #fbbf24;
    --glass-bg: rgba(17, 24, 39, 0.74);
    --glass-border: rgba(148, 163, 184, 0.14);
    --glass-blur: 16px;
    --font-heading: "Inter", "Noto Sans JP", system-ui, sans-serif;
    --font-body: "Inter", "Noto Sans JP", system-ui, sans-serif;
    --font-mono: "JetBrains Mono", "Fira Code", monospace;
    --radius: 16px;
    --radius-sm: 8px;
    --transition: 280ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  html, body {
    width: 100%; height: 100%;
    background: var(--bg-deep);
    color: var(--text-primary);
    font-family: var(--font-body);
    overflow: hidden;
  }

  /* === DECK CONTAINER === */
  .deck {
    width: 100vw; height: 100vh;
    position: relative;
    overflow: hidden;
  }

  /* === SLIDE === */
  .slide {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--transition), visibility var(--transition);
  }
  .slide.active {
    opacity: 1;
    visibility: visible;
  }
  .slide-inner {
    width: min(92vw, calc(88vh * 16 / 9));
    aspect-ratio: 16 / 9;
    border-radius: var(--radius);
    border: 1px solid var(--glass-border);
    overflow: hidden;
    position: relative;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
  }

  /* === AMBIENT GRADIENTS === */
  .slide-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }
  .slide-bg--blue {
    background:
      radial-gradient(ellipse at 18% 40%, rgba(96, 165, 250, 0.10), transparent 50%),
      radial-gradient(ellipse at 82% 20%, rgba(167, 139, 250, 0.08), transparent 40%),
      linear-gradient(180deg, #0c1220, #0a0e17);
  }
  .slide-bg--violet {
    background:
      radial-gradient(ellipse at 70% 30%, rgba(167, 139, 250, 0.12), transparent 50%),
      radial-gradient(ellipse at 20% 70%, rgba(96, 165, 250, 0.06), transparent 40%),
      linear-gradient(180deg, #0e0c20, #0a0e17);
  }
  .slide-bg--green {
    background:
      radial-gradient(ellipse at 50% 40%, rgba(52, 211, 153, 0.10), transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(96, 165, 250, 0.06), transparent 40%),
      linear-gradient(180deg, #0a1218, #0a0e17);
  }
  .slide-bg--amber {
    background:
      radial-gradient(ellipse at 30% 30%, rgba(251, 191, 36, 0.08), transparent 50%),
      radial-gradient(ellipse at 75% 60%, rgba(167, 139, 250, 0.06), transparent 40%),
      linear-gradient(180deg, #12100a, #0a0e17);
  }

  /* === SLIDE CONTENT AREA === */
  .slide-content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    padding: min(3.5rem, 4.8vw) min(4rem, 5.4vw);
    display: flex;
    flex-direction: column;
  }

  /* === TYPOGRAPHY === */
  h1 {
    font-family: var(--font-heading);
    font-size: min(3rem, 3.2vw);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
  h2 {
    font-family: var(--font-heading);
    font-size: min(2rem, 2.2vw);
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
    margin-bottom: 1.2rem;
    border-bottom: 2px solid transparent;
    border-image: linear-gradient(90deg, var(--accent-blue), var(--accent-violet)) 1;
    padding-bottom: 0.3em;
  }
  h3 {
    font-family: var(--font-heading);
    font-size: min(1.3rem, 1.4vw);
    font-weight: 500;
    color: var(--accent-violet);
    margin-bottom: 0.8rem;
  }
  p {
    font-size: min(1.1rem, 1.2vw);
    line-height: 1.8;
    color: var(--text-primary);
    margin-bottom: 0.8rem;
  }
  .text-muted { color: var(--text-secondary); }
  .text-accent-blue { color: var(--accent-blue); }
  .text-accent-violet { color: var(--accent-violet); }
  .text-accent-green { color: var(--accent-green); }

  /* === ACCENT LINE === */
  .accent-line {
    width: 80px;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-violet));
    margin: 1rem 0;
  }
  .accent-line--center { margin: 1rem auto; }
  .accent-line--green {
    background: linear-gradient(90deg, var(--accent-green), transparent);
  }

  /* === GLASS CARD === */
  .glass-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    padding: 1.5rem 2rem;
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
  }
  .glass-card--accent-left {
    border-left: 3px solid var(--accent-blue);
  }
  .glass-card--glow {
    box-shadow: 0 0 30px rgba(96, 165, 250, 0.08),
                0 8px 32px rgba(0, 0, 0, 0.3);
  }

  /* === METRIC BOX === */
  .metric-box {
    text-align: center;
    padding: 1.5rem;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    backdrop-filter: blur(var(--glass-blur));
  }
  .metric-value {
    font-family: var(--font-mono);
    font-size: min(3.2rem, 3.5vw);
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent-blue), var(--accent-violet));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .metric-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-top: 0.4rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* === TABLE === */
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    font-size: 0.9rem;
  }
  th {
    padding: 0.8rem 1.2rem;
    background: var(--bg-elevated);
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);
    text-align: left;
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  td {
    padding: 0.7rem 1.2rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.06);
  }
  table tbody tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.025);
  }
  th:first-child,
  td:first-child {
    font-weight: 600;
  }
  tr:last-child td { border-bottom: none; }

  /* === CODE BLOCK === */
  pre {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(148, 163, 184, 0.08);
    border-radius: var(--radius-sm);
    padding: 1.2rem 1.5rem;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    line-height: 1.7;
    color: var(--accent-green);
  }
  code {
    font-family: var(--font-mono);
    font-size: 0.85em;
    padding: 0.15em 0.4em;
    border-radius: 4px;
    background: rgba(52, 211, 153, 0.08);
    color: var(--accent-green);
  }
  pre code { padding: 0; background: none; }

  /* === BLOCKQUOTE === */
  blockquote {
    padding: 1.5rem 2rem;
    border-left: 3px solid var(--accent-blue);
    background: rgba(17, 24, 39, 0.6);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    border: 1px solid var(--glass-border);
    border-left: 3px solid var(--accent-blue);
    font-size: 1.15rem;
    line-height: 1.7;
    font-style: italic;
    color: var(--text-secondary);
  }
  blockquote strong { color: var(--accent-blue); font-style: normal; }

  /* === LIST === */
  ul, ol {
    padding-left: 0;
    list-style: none;
  }
  ul li, ol li {
    padding: 0.5rem 0 0.5rem 1.5rem;
    position: relative;
    line-height: 1.7;
  }
  ul li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 1rem;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent-blue);
  }
  ol { counter-reset: slide-ol; }
  ol li { counter-increment: slide-ol; }
  ol li::before {
    content: counter(slide-ol);
    position: absolute;
    left: 0;
    top: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--accent-violet);
    font-weight: 600;
  }

  /* ======================= */
  /* === LAYOUT VARIANTS === */
  /* ======================= */

  /* --- TITLE SLIDE --- */
  .layout-title .slide-content {
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.5rem;
  }
  .layout-title h1 {
    font-size: min(3.6rem, 4vw);
    font-weight: 700;
    max-width: 80%;
  }
  .layout-title .subtitle {
    font-size: min(1.3rem, 1.5vw);
    color: var(--text-secondary);
    letter-spacing: 0.04em;
    max-width: 70%;
  }
  .layout-title .meta {
    font-size: 0.85rem;
    color: var(--text-tertiary);
    margin-top: 1rem;
    font-family: var(--font-mono);
    letter-spacing: 0.06em;
  }

  /* --- SECTION DIVIDER --- */
  .layout-section .slide-content {
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .layout-section h2 {
    font-size: min(2.8rem, 3vw);
    font-weight: 600;
  }
  .layout-section .section-number {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--accent-blue);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  /* --- CONTENT SLIDE --- */
  .layout-content .slide-content {
    justify-content: flex-start;
    gap: 1rem;
  }
  .layout-content .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  /* --- SPLIT SLIDE (two columns) --- */
  .layout-split .slide-content {
    gap: 1rem;
  }
  .split-columns {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }
  .split-col {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  .split-divider {
    width: 1px;
    align-self: stretch;
    background: linear-gradient(180deg, transparent, var(--glass-border), transparent);
  }

  /* --- DATA / METRICS SLIDE --- */
  .layout-data .slide-content {
    gap: 1.5rem;
  }
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.2rem;
    flex: 1;
    align-content: center;
  }

  /* --- QUOTE SLIDE --- */
  .layout-quote .slide-content {
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: min(4rem, 5vw) min(6rem, 7vw);
  }
  .layout-quote blockquote {
    border: none;
    border-left: 4px solid var(--accent-amber);
    background: none;
    font-size: min(1.8rem, 2vw);
    line-height: 1.6;
    max-width: 80%;
    padding-left: 1.5em;
    font-style: italic;
    color: var(--text-primary);
  }
  .layout-quote .attribution {
    font-size: 0.9rem;
    color: var(--text-tertiary);
    margin-top: 1.5rem;
    font-style: normal;
  }

  /* --- VISUAL SLIDE (full image) --- */
  .layout-visual .slide-content {
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: min(2rem, 2.8vw) min(3rem, 4vw);
  }
  .layout-visual img, .layout-visual svg {
    max-width: 90%;
    max-height: 70%;
    border-radius: var(--radius);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }

  /* --- CONCLUSION SLIDE --- */
  .layout-conclusion .slide-content {
    gap: 1.2rem;
  }
  .layout-conclusion ul li::before {
    background: var(--accent-green);
    width: 8px;
    height: 8px;
  }

  /* === ANIMATIONS === */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .slide.active .animate-in {
    animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  }
  .slide.active .delay-1 { animation-delay: 0.08s; }
  .slide.active .delay-2 { animation-delay: 0.16s; }
  .slide.active .delay-3 { animation-delay: 0.24s; }
  .slide.active .delay-4 { animation-delay: 0.32s; }
  .slide.active .delay-5 { animation-delay: 0.40s; }

  /* === NAVIGATION === */
  .nav-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 0.6rem 1rem;
    background: rgba(10, 14, 23, 0.85);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--glass-border);
  }
  .nav-btn {
    padding: 0.4rem 1rem;
    border: 1px solid var(--glass-border);
    border-radius: 999px;
    background: var(--glass-bg);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
  }
  .nav-btn:hover { background: rgba(96, 165, 250, 0.12); border-color: rgba(96, 165, 250, 0.3); }
  .nav-btn:disabled { opacity: 0.4; cursor: default; }
  .nav-counter {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text-tertiary);
    min-width: 5rem;
    text-align: center;
  }
  .nav-title {
    font-family: var(--font-heading);
    font-size: 0.85rem;
    color: var(--text-secondary);
    max-width: 40vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .nav-fullscreen {
    padding: 0.4rem 0.6rem;
    border: 1px solid var(--glass-border);
    border-radius: 999px;
    background: var(--glass-bg);
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }
  .nav-fullscreen:hover { color: var(--text-primary); background: rgba(96, 165, 250, 0.12); }

  /* === PROGRESS BAR === */
  .progress-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-violet));
    transition: width 0.3s ease;
    z-index: 101;
  }

  /* === PRINT === */
  @media print {
    .nav-bar, .progress-bar { display: none; }
    .slide {
      position: relative;
      opacity: 1;
      visibility: visible;
      page-break-after: always;
      height: 100vh;
    }
    .slide-inner {
      width: 100%;
      box-shadow: none;
      border: none;
    }
  }

  /* === RESPONSIVE === */
  @media (max-width: 768px) {
    .slide-content { padding: 2rem 2.5rem; }
    .layout-title h1 { font-size: 2rem; }
    .split-columns { grid-template-columns: 1fr; }
    .nav-title { display: none; }
  }
</style>
</head>
<body>

<div class="deck" id="deck">
  <!-- SLIDES GO HERE -->
</div>

<div class="nav-bar">
  <button class="nav-btn" id="prevBtn" onclick="go(-1)">Prev</button>
  <span class="nav-title" id="deckTitle">{{TITLE}}</span>
  <span class="nav-counter" id="counter">1 / N</span>
  <button class="nav-btn" id="nextBtn" onclick="go(1)">Next</button>
  <button class="nav-fullscreen" onclick="toggleFS()" title="Fullscreen">&#x26F6;</button>
</div>
<div class="progress-bar" id="progress"></div>

<script>
  const slides = document.querySelectorAll('.slide');
  let cur = 0;
  function show(i) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    document.getElementById('counter').textContent = (i + 1) + ' / ' + slides.length;
    document.getElementById('progress').style.width = ((i + 1) / slides.length * 100) + '%';
    document.getElementById('prevBtn').disabled = i === 0;
    document.getElementById('nextBtn').disabled = i === slides.length - 1;
  }
  function go(d) {
    const next = Math.max(0, Math.min(slides.length - 1, cur + d));
    if (next !== cur) { cur = next; show(cur); }
  }
  function toggleFS() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
    if (e.key === 'f' || e.key === 'F') toggleFS();
    if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen();
  });
  // Touch swipe
  let touchX = 0;
  document.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  });
  show(0);
</script>
</body>
</html>
```

## Slide HTML Patterns

### Title Slide

```html
<div class="slide layout-title" data-bg="blue">
  <div class="slide-inner">
    <div class="slide-bg slide-bg--violet"></div>
    <div class="slide-content">
      <h1 class="animate-in">Presentation Title</h1>
      <div class="accent-line accent-line--center animate-in delay-1"></div>
      <p class="subtitle animate-in delay-2">Subtitle or description goes here</p>
      <p class="meta animate-in delay-3">Author &mdash; Date</p>
    </div>
  </div>
</div>
```

### Content Slide

```html
<div class="slide layout-content">
  <div class="slide-inner">
    <div class="slide-bg slide-bg--blue"></div>
    <div class="slide-content">
      <h2 class="animate-in">Section Heading</h2>
      <div class="accent-line animate-in delay-1"></div>
      <div class="body">
        <div class="glass-card glass-card--accent-left animate-in delay-2">
          <p><strong>Key Point:</strong> Important insight here</p>
        </div>
        <ul>
          <li class="animate-in delay-3">First supporting point</li>
          <li class="animate-in delay-4">Second supporting point</li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

### Split Slide

```html
<div class="slide layout-split">
  <div class="slide-inner">
    <div class="slide-bg slide-bg--blue"></div>
    <div class="slide-content">
      <h2 class="animate-in">Comparison Title</h2>
      <div class="accent-line animate-in delay-1"></div>
      <div class="split-columns">
        <div class="split-col animate-in delay-2">
          <h3>Left Column</h3>
          <div class="glass-card">
            <p>Content for left side</p>
          </div>
        </div>
        <div class="split-col animate-in delay-3">
          <h3>Right Column</h3>
          <div class="glass-card">
            <p>Content for right side</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Data / Metrics Slide

```html
<div class="slide layout-data">
  <div class="slide-inner">
    <div class="slide-bg slide-bg--violet"></div>
    <div class="slide-content">
      <h2 class="animate-in">Key Metrics</h2>
      <div class="accent-line animate-in delay-1"></div>
      <div class="metrics-grid">
        <div class="metric-box animate-in delay-2">
          <div class="metric-value">30</div>
          <div class="metric-label">Domains</div>
        </div>
        <div class="metric-box animate-in delay-3">
          <div class="metric-value">5</div>
          <div class="metric-label">Stages</div>
        </div>
        <div class="metric-box animate-in delay-4">
          <div class="metric-value">150+</div>
          <div class="metric-label">Theories</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Quote Slide

```html
<div class="slide layout-quote">
  <div class="slide-inner">
    <div class="slide-bg slide-bg--amber"></div>
    <div class="slide-content">
      <div class="accent-line accent-line--center animate-in"></div>
      <blockquote class="animate-in delay-1">
        "The insight goes here, formatted as a prominent quote."
      </blockquote>
      <p class="attribution animate-in delay-2">&mdash; Source</p>
    </div>
  </div>
</div>
```

### Conclusion Slide

```html
<div class="slide layout-conclusion">
  <div class="slide-inner">
    <div class="slide-bg slide-bg--green"></div>
    <div class="slide-content">
      <h2 class="animate-in">Key Takeaways</h2>
      <div class="accent-line accent-line--green animate-in delay-1"></div>
      <ul>
        <li class="animate-in delay-2">First conclusion point</li>
        <li class="animate-in delay-3">Second conclusion point</li>
        <li class="animate-in delay-4">Third conclusion point</li>
      </ul>
    </div>
  </div>
</div>
```

## Background Selection Guide

| Content Type | Background | Rationale |
|-------------|-----------|-----------|
| Title / intro | `--violet` | Warm, inviting |
| Body content | `--blue` | Neutral, readable |
| Data / metrics | `--violet` | Emphasis |
| Theory / concepts | `--blue` | Analytical tone |
| Conclusions | `--green` | Completion, positive |
| Warnings / caveats | `--amber` | Attention |
| Quotes / insights | `--amber` | Warmth |

## Phase 1 CSS Improvements (reflected from slides.css)

### Table Stripe

Alternating row backgrounds improve readability on data-heavy slides.

```css
table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.025);
}
```

### First Column Emphasis

The first column of every table is rendered in `font-weight: 600` to visually anchor row labels.

```css
th:first-child,
td:first-child {
  font-weight: 600;
}
```

### h2 Accent Line

All `h2` elements carry a gradient bottom border (blue to violet) as a visual accent, replacing the need for a separate `.accent-line` div after every heading.

```css
h2 {
  border-bottom: 2px solid transparent;
  border-image: linear-gradient(90deg, var(--accent-blue), var(--accent-violet)) 1;
  padding-bottom: 0.3em;
}
```

### accent-amber Variable

Defined in `:root` as `--accent-amber: #fbbf24`. Used for:

- **Quote layout** (`layout-quote`): blockquote left border
- **Amber background** (`slide-bg--amber`): warm gradient for quotes and warnings

### Quote Layout Enhancement

`.layout-quote blockquote` now uses an amber left border instead of being fully borderless, adding warmth to quote slides while maintaining the centered layout.

```css
.layout-quote blockquote {
  border-left: 4px solid var(--accent-amber);
  padding-left: 1.5em;
  font-style: italic;
}
```

## Jekyll Integration

For deploying to a Jekyll site (like pjdhiro), save the HTML file with YAML front matter:

```yaml
---
layout: null
title: "Presentation Title"
permalink: /presentations/my-deck/
---
```

The `layout: null` ensures Jekyll doesn't wrap the HTML in a template.
The file goes in the site root or a `presentations/` directory.
