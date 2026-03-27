const LANG_JA = 'ja';
const LANG_EN = 'en';
const languageListeners = new Set();
let currentLang = LANG_JA;

export function normalizeLang(lang) {
    return lang === LANG_EN ? LANG_EN : LANG_JA;
}

export function detectLang() {
    const raw = new URLSearchParams(window.location.search).get('lang');
    return normalizeLang(raw);
}

export function initLanguageState(lang = detectLang()) {
    currentLang = normalizeLang(lang);
    return currentLang;
}

export function getCurrentLang() {
    return currentLang;
}

export function setCurrentLang(lang, { syncQuery = true } = {}) {
    const normalized = normalizeLang(lang);
    const changed = normalized !== currentLang;
    currentLang = normalized;

    if (syncQuery) {
        syncLangQuery(normalized);
    }

    if (changed) {
        languageListeners.forEach((listener) => {
            listener(normalized);
        });
    }

    return normalized;
}

export function subscribeLanguageChange(listener) {
    if (typeof listener !== 'function') {
        return () => {};
    }
    languageListeners.add(listener);
    return () => {
        languageListeners.delete(listener);
    };
}

export function syncLangQuery(lang) {
    if (!window.history?.replaceState) return;
    const normalized = normalizeLang(lang);
    const url = new URL(window.location.href);
    if (normalized === LANG_EN) {
        url.searchParams.set('lang', LANG_EN);
    } else {
        url.searchParams.delete('lang');
    }
    window.history.replaceState(window.history.state, '', url.toString());
}
