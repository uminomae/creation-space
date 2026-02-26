const LANG_JA = 'ja';
const LANG_EN = 'en';

export function normalizeLang(lang) {
    return lang === LANG_EN ? LANG_EN : LANG_JA;
}

export function detectLang() {
    const raw = new URLSearchParams(window.location.search).get('lang');
    return normalizeLang(raw);
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
