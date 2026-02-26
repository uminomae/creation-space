# Intent Repro (Gemini 3.1 / One-file)

この1ファイルだけを共有すれば、以下を再現できます。

- Gemini 3.1 に渡す固定プロンプト
- 生成結果の `index.html`（埋め込み済み）
- ローカル表示手順

再現性を上げるため、生成時は `temperature=0` を推奨します。

## 1) Prompt (Gemini 3.1)

以下のブロックをそのまま Gemini 3.1 に渡してください。

<!-- BEGIN_PROMPT -->
```text
You are a senior creative-coding engineer.
Output exactly one file: index.html.

Requirements:
- Single-file HTML (no build step, no external assets, no npm).
- Use only standard browser APIs.
- Fullscreen canvas visual named "Intent".
- Atmosphere: deep ocean blue, drifting particles, breathing pulse, subtle swirl.
- Mouse drag should influence horizontal drift slightly.
- Mouse wheel should influence vertical parallax slightly.
- Include minimal UI:
  - top-left badge: "Intent Prototype"
  - top-right hint: "Drag: rotate feel / Wheel: depth feel"
- Keep performance safe on laptops:
  - use requestAnimationFrame
  - cap particle count to <= 500
  - avoid expensive per-frame allocations
- Accessibility:
  - readable foreground text contrast
  - respect prefers-reduced-motion (reduce animation amplitude)

Implementation notes:
- Use one canvas and 2D context.
- Implement deterministic pseudo-random for particle initialization.
- Implement a breathing function over time (slow sine).
- Implement resize handling.
- Write clean comments for intent and tradeoffs.

Return only the complete index.html source code.
```
<!-- END_PROMPT -->

## 2) Embedded index.html

このファイルには、参照用の `index.html` 実装も埋め込んであります。

<!-- BEGIN_INDEX_HTML -->
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Intent Prototype</title>
  <style>
    :root {
      --fg: #d7e7ff;
      --fg-dim: #9fb3d7;
      --badge: rgba(10, 27, 56, 0.65);
      --line: rgba(130, 180, 255, 0.45);
      --bg-a: #020712;
      --bg-b: #031a3d;
      --bg-c: #0a3b7a;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; height: 100%; background: #020712; }
    body {
      overflow: hidden;
      color: var(--fg);
      font-family: "SF Mono", "IBM Plex Mono", "Menlo", monospace;
    }
    canvas {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }
    .hud {
      position: fixed;
      inset: 0;
      pointer-events: none;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .badge {
      border: 1px solid var(--line);
      background: var(--badge);
      border-radius: 999px;
      padding: 8px 14px;
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--fg);
      backdrop-filter: blur(6px);
    }
    .hint {
      color: var(--fg-dim);
      font-size: 12px;
      letter-spacing: 0.04em;
      text-align: right;
      line-height: 1.7;
      text-shadow: 0 0 16px rgba(0, 0, 0, 0.55);
    }
  </style>
</head>
<body>
  <canvas id="c" aria-label="Intent visual canvas"></canvas>
  <div class="hud" aria-hidden="true">
    <div class="badge">Intent Prototype</div>
    <div class="hint">Drag: rotate feel<br />Wheel: depth feel</div>
  </div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d', { alpha: false });

    // Deterministic PRNG so initialization is reproducible.
    function mulberry32(seed) {
      let t = seed >>> 0;
      return function () {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), t | 1);
        r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
      };
    }

    const rand = mulberry32(20260226);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 1;
    let h = 1;
    let dpr = 1;

    const POINTER = { x: 0.5, y: 0.5, dragX: 0, dragY: 0, down: false };
    let wheelOffset = 0;

    // Keep count moderate for laptop safety.
    const PARTICLE_COUNT = 420;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const z = rand();
      return {
        x: rand(),
        y: rand(),
        z,
        s: 0.4 + rand() * 2.0,
        a: 0.2 + rand() * 0.8,
        v: 0.02 + rand() * 0.12,
        swirl: rand() * Math.PI * 2,
      };
    });

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.floor(window.innerWidth));
      h = Math.max(1, Math.floor(window.innerHeight));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function clamp(v, lo, hi) {
      return Math.max(lo, Math.min(hi, v));
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointerdown', () => { POINTER.down = true; }, { passive: true });
    window.addEventListener('pointerup', () => { POINTER.down = false; }, { passive: true });
    window.addEventListener('pointermove', (e) => {
      const nx = clamp(e.clientX / Math.max(1, w), 0, 1);
      const ny = clamp(e.clientY / Math.max(1, h), 0, 1);
      if (POINTER.down) {
        POINTER.dragX += (nx - POINTER.x) * 0.7;
        POINTER.dragY += (ny - POINTER.y) * 0.7;
      }
      POINTER.x = nx;
      POINTER.y = ny;
    }, { passive: true });

    window.addEventListener('wheel', (e) => {
      wheelOffset += e.deltaY * 0.00035;
      wheelOffset = clamp(wheelOffset, -0.5, 0.5);
    }, { passive: true });

    resize();

    let prev = performance.now();
    let t = 0;

    function frame(now) {
      const dt = Math.min(0.05, (now - prev) * 0.001);
      prev = now;
      t += dt;

      POINTER.dragX *= 0.93;
      POINTER.dragY *= 0.93;
      wheelOffset *= 0.985;

      const breathAmp = prefersReducedMotion ? 0.02 : 0.075;
      const breath = 0.5 + 0.5 * Math.sin(t * 0.65);
      const pulse = 1 + breathAmp * breath;

      // Ocean-like layered gradient background.
      const g = ctx.createRadialGradient(
        w * (0.5 + (POINTER.x - 0.5) * 0.18),
        h * (0.5 + (POINTER.y - 0.5 + wheelOffset * 0.5) * 0.2),
        Math.min(w, h) * 0.08,
        w * 0.5,
        h * 0.55,
        Math.max(w, h) * 0.9
      );
      g.addColorStop(0, '#0a3b7a');
      g.addColorStop(0.45, '#031a3d');
      g.addColorStop(1, '#020712');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const baseYParallax = wheelOffset * 80;
      const baseXParallax = POINTER.dragX * 140;

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        // Continuous drift with swirl and depth-scaled parallax.
        p.y += p.v * dt * (0.45 + p.z * 1.2);
        if (p.y > 1.08) p.y = -0.08;

        const phase = t * (0.35 + p.z * 1.2) + p.swirl;
        const swirlX = Math.sin(phase) * (6 + p.z * 14);
        const swirlY = Math.cos(phase * 0.8) * (3 + p.z * 8);

        const depth = 0.25 + p.z * 1.2;
        const x = p.x * w + baseXParallax * depth + swirlX;
        const y = p.y * h + baseYParallax * depth + swirlY;

        const r = p.s * pulse * (0.6 + p.z);
        const alpha = clamp((0.08 + p.a * 0.5) * (0.35 + p.z), 0, 1);

        ctx.beginPath();
        ctx.fillStyle = `rgba(200, 226, 255, ${alpha})`;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  </script>
</body>
</html>
```
<!-- END_INDEX_HTML -->

## 3) index.html をこの md から出力

```bash
awk '/^<!-- BEGIN_INDEX_HTML -->/{f=1;next}/^<!-- END_INDEX_HTML -->/{f=0}f' INTENT_REPRO_ONEFILE.md \
| sed '/^```html$/d;/^```$/d' > index.html
```

## 4) ローカル表示

```bash
python3 -m http.server 3002
# open http://localhost:3002/index.html
```
