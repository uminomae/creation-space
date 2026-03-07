// font-size-ctrl.js -- creation-space
// CHANGED(2026-03-07): topbar A-/↺/A+ 統合 (kesson-space #114 互換)

const STEP_REM = 0.1;
const MIN_STEP = -1;
const MAX_STEP = 4;
const STORAGE_KEY = 'kesson-font-step';

const FONT_VARS = {
    '--kesson-font-size-ui-xs': 0.65,
    '--kesson-font-size-ui-sm': 0.70,
};

const CLASS_VARS = {
    '--ks-section-heading': 0.75,
    '--ks-card-title': 0.80,
    '--ks-card-text': 0.70,
    '--ks-card-summary': 0.68,
    '--ks-overlay-tagline': 0.55,
    '--ks-overlay-tagline-en': 0.48,
    '--ks-control-guide': 0.45,
    '--ks-footer-line': 0.45,
};

function normalizeStep(step) {
    const parsed = Number.parseInt(String(step), 10);
    if (!Number.isFinite(parsed)) return 0;
    return Math.min(MAX_STEP, Math.max(MIN_STEP, parsed));
}

function getCurrentStep() {
    try {
        return normalizeStep(window.localStorage.getItem(STORAGE_KEY) ?? '0');
    } catch {
        return 0;
    }
}

function setStep(step) {
    const normalized = normalizeStep(step);
    try {
        window.localStorage.setItem(STORAGE_KEY, String(normalized));
    } catch {
        // Ignore storage failures and still apply the current session value.
    }
    applyStep(normalized);
}

function applyStep(step) {
    const normalized = normalizeStep(step);
    const root = document.documentElement;

    Object.entries(FONT_VARS).forEach(([varName, base]) => {
        root.style.setProperty(varName, `${(base + normalized * STEP_REM).toFixed(2)}rem`);
    });
    Object.entries(CLASS_VARS).forEach(([varName, base]) => {
        root.style.setProperty(varName, `${(base + normalized * STEP_REM).toFixed(2)}rem`);
    });

    root.style.setProperty('--reports-font-step', `${(normalized * STEP_REM).toFixed(2)}rem`);

    const down = document.getElementById('font-size-down');
    const up = document.getElementById('font-size-up');
    const reset = document.getElementById('font-size-reset');
    if (down) down.disabled = normalized <= MIN_STEP;
    if (up) up.disabled = normalized >= MAX_STEP;
    if (reset) reset.disabled = normalized === 0;
}

export function initFontSizeCtrl() {
    applyStep(getCurrentStep());

    document.getElementById('font-size-down')?.addEventListener('click', () => {
        const current = getCurrentStep();
        if (current > MIN_STEP) setStep(current - 1);
    });
    document.getElementById('font-size-up')?.addEventListener('click', () => {
        const current = getCurrentStep();
        if (current < MAX_STEP) setStep(current + 1);
    });
    document.getElementById('font-size-reset')?.addEventListener('click', () => {
        setStep(0);
    });
}
