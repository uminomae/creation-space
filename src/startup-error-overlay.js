function formatStartupError(errorLike) {
    if (!errorLike) return 'Unknown startup error';
    if (typeof errorLike === 'string') return errorLike;
    if (errorLike instanceof Error) {
        return errorLike.stack || `${errorLike.name}: ${errorLike.message}`;
    }
    try {
        return JSON.stringify(errorLike, null, 2);
    } catch {
        return String(errorLike);
    }
}

export function showStartupErrorOverlay(errorLike) {
    const doc = window.document;
    if (!doc) return;
    const message = formatStartupError(errorLike);
    let overlay = doc.getElementById('app-startup-error-overlay');
    if (!overlay) {
        overlay = doc.createElement('pre');
        overlay.id = 'app-startup-error-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.maxHeight = '55vh';
        overlay.style.margin = '0';
        overlay.style.padding = '12px 14px';
        overlay.style.zIndex = '99999';
        overlay.style.overflow = 'auto';
        overlay.style.whiteSpace = 'pre-wrap';
        overlay.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        overlay.style.fontSize = '12px';
        overlay.style.lineHeight = '1.45';
        overlay.style.background = 'rgba(31, 9, 13, 0.95)';
        overlay.style.color = '#ffd5db';
        overlay.style.borderBottom = '1px solid rgba(255, 173, 186, 0.42)';
        const parent = doc.body || doc.documentElement;
        if (parent) parent.appendChild(overlay);
    }
    overlay.textContent = `[startup-error]\n${message}`;
}

let installed = false;

export function installStartupErrorHandlers() {
    if (installed) return;
    installed = true;

    window.addEventListener('error', (event) => {
        const value = event?.error || event?.message || event;
        showStartupErrorOverlay(value);
    });

    window.addEventListener('unhandledrejection', (event) => {
        showStartupErrorOverlay(event?.reason || event);
    });
}
