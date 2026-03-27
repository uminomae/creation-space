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
        const parent = doc.body || doc.documentElement;
        if (parent) parent.appendChild(overlay);
    }
    overlay.textContent = `[startup-error]\n${message}`;
}

export function showStartupWarningBanner(message) {
    const doc = window.document;
    if (!doc) return;
    let banner = doc.getElementById('app-startup-warning-banner');
    if (!banner) {
        banner = doc.createElement('div');
        banner.id = 'app-startup-warning-banner';
        const parent = doc.body || doc.documentElement;
        if (parent) parent.appendChild(banner);
    }
    banner.textContent = message;
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
