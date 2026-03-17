export const GRAPHIC_MODE_DEFAULT = 'i';
export const GRAPHIC_MODE_OPTIONS = new Set(['sinobi', 'i']);

export function normalizeGraphicMode(mode) {
    if (mode === 'hold' || mode === 'hoji') return 'sinobi';
    if (mode === 'wabi') return 'sinobi';
    if (mode === 'intent') return 'i';
    return GRAPHIC_MODE_OPTIONS.has(mode) ? mode : GRAPHIC_MODE_DEFAULT;
}

export function syncGraphicModeQuery(mode) {
    if (!window.history?.replaceState) return;
    const normalized = normalizeGraphicMode(mode);
    const url = new URL(window.location.href);
    url.searchParams.set('graphic', normalized);
    window.history.replaceState(window.history.state, '', url.toString());
}

export function setGraphicButtonState(mode) {
    const normalized = normalizeGraphicMode(mode);
    const zoomGuideRow = document.getElementById('control-guide-zoom-row');
    if (zoomGuideRow instanceof HTMLElement) {
        zoomGuideRow.hidden = normalized === 'i';
    }
    document.querySelectorAll('[data-graphic-mode]').forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) return;
        const isActive = normalizeGraphicMode(button.dataset.graphicMode) === normalized;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

export function initGraphicModeButtons(initialMode, onChange) {
    setGraphicButtonState(initialMode);

    document.querySelectorAll('[data-graphic-mode]').forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) return;
        button.addEventListener('click', () => {
            const nextMode = normalizeGraphicMode(button.dataset.graphicMode);
            setGraphicButtonState(nextMode);
            if (typeof onChange === 'function') {
                onChange(nextMode);
            }
        });
    });
}
