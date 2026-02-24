const VALID_MODES = new Set(['hold', 'ripple', 'lattice']);

function normalizeMode(mode) {
    return VALID_MODES.has(mode) ? mode : 'hold';
}

function clamp01(value) {
    return Math.min(1, Math.max(0, value));
}

function drawRipple(ctx, width, height, timeSec) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(4, 8, 18, 0.42)';
    ctx.fillRect(0, 0, width, height);

    const cx = width * (0.5 + Math.sin(timeSec * 0.38) * 0.12);
    const cy = height * (0.48 + Math.cos(timeSec * 0.33) * 0.08);
    const maxRadius = Math.hypot(width, height) * 0.62;
    const ringCount = 7;
    const speed = 130.0;

    for (let i = 0; i < ringCount; i += 1) {
        const radius = (timeSec * speed + i * (maxRadius / ringCount)) % maxRadius;
        const alpha = clamp01(1.0 - radius / maxRadius);
        const hue = 188 + i * 8;
        ctx.lineWidth = 1.0 + alpha * 2.0;
        ctx.strokeStyle = `hsla(${hue}, 88%, 72%, ${0.08 + alpha * 0.42})`;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(4.0, radius), 0, Math.PI * 2);
        ctx.stroke();
    }

    const pulseRadius = 22 + Math.sin(timeSec * 2.4) * 5;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseRadius * 3.4);
    glow.addColorStop(0, 'rgba(170, 232, 255, 0.34)');
    glow.addColorStop(0.25, 'rgba(130, 190, 255, 0.22)');
    glow.addColorStop(1, 'rgba(70, 110, 170, 0.0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseRadius * 3.4, 0, Math.PI * 2);
    ctx.fill();
}

function drawLattice(ctx, width, height, timeSec) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(5, 10, 20, 0.55)';
    ctx.fillRect(0, 0, width, height);

    const spacing = Math.max(26, Math.min(54, width / 24));
    const phase = timeSec * 0.8;
    const amp = Math.min(22, spacing * 0.5);

    ctx.lineWidth = 1;
    for (let x = -spacing * 2; x <= width + spacing * 2; x += spacing) {
        const xOffset = Math.sin(phase + x * 0.014) * amp;
        ctx.strokeStyle = 'rgba(120, 180, 255, 0.17)';
        ctx.beginPath();
        ctx.moveTo(x + xOffset, 0);
        ctx.lineTo(x - xOffset, height);
        ctx.stroke();
    }

    for (let y = -spacing * 2; y <= height + spacing * 2; y += spacing) {
        const yOffset = Math.cos(phase * 1.2 + y * 0.02) * amp;
        ctx.strokeStyle = 'rgba(96, 152, 232, 0.15)';
        ctx.beginPath();
        ctx.moveTo(0, y + yOffset);
        ctx.lineTo(width, y - yOffset);
        ctx.stroke();
    }

    const nodeStep = spacing * 2;
    for (let y = 0; y <= height; y += nodeStep) {
        for (let x = 0; x <= width; x += nodeStep) {
            const wobbleX = Math.sin(phase + (x + y) * 0.02) * (amp * 0.32);
            const wobbleY = Math.cos(phase * 1.1 + (x - y) * 0.018) * (amp * 0.32);
            const r = 1.1 + (Math.sin(phase * 1.7 + x * 0.01 + y * 0.015) + 1) * 0.9;
            ctx.fillStyle = 'rgba(168, 224, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(x + wobbleX, y + wobbleY, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

export function initGraphicCanvasSwitcher({ container, initialMode = 'hold' } = {}) {
    if (!container) {
        return {
            setMode: () => {},
            getMode: () => 'hold',
            render: () => {},
            destroy: () => {},
        };
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'alt-graphic-canvas';
    canvas.className = 'alt-graphic-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: true });
    let logicalWidth = 1;
    let logicalHeight = 1;
    let activeMode = normalizeMode(initialMode);

    function resize() {
        const rect = container.getBoundingClientRect();
        logicalWidth = Math.max(1, Math.floor(rect.width || window.innerWidth || 1));
        logicalHeight = Math.max(1, Math.floor(rect.height || window.innerHeight || 1));
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.style.width = `${logicalWidth}px`;
        canvas.style.height = `${logicalHeight}px`;
        canvas.width = Math.max(1, Math.floor(logicalWidth * dpr));
        canvas.height = Math.max(1, Math.floor(logicalHeight * dpr));

        if (ctx) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    }

    function setMode(nextMode) {
        activeMode = normalizeMode(nextMode);
        canvas.style.display = activeMode === 'hold' ? 'none' : 'block';
    }

    function render(timeSec) {
        if (!ctx || activeMode === 'hold') return;
        if (activeMode === 'ripple') {
            drawRipple(ctx, logicalWidth, logicalHeight, timeSec);
            return;
        }
        drawLattice(ctx, logicalWidth, logicalHeight, timeSec);
    }

    function destroy() {
        window.removeEventListener('resize', resize);
        canvas.remove();
    }

    resize();
    setMode(activeMode);
    window.addEventListener('resize', resize);

    return {
        setMode,
        getMode: () => activeMode,
        render,
        destroy,
    };
}
