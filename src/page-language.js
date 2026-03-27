import { normalizeLang, getCurrentLang, setCurrentLang } from './i18n.js';
import { dict } from './i18n/dict.js';

function getPageStrings(lang) {
    return dict[normalizeLang(lang)]?.page || dict.ja.page;
}

function resolvePathValue(source, path) {
    if (!source || !path) return undefined;
    return path.split('.').reduce((value, key) => {
        if (value && Object.prototype.hasOwnProperty.call(value, key)) {
            return value[key];
        }
        return undefined;
    }, source);
}

function applyTextBindings(strings) {
    document.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.getAttribute('data-i18n');
        const value = resolvePathValue(strings, key);
        if (typeof value === 'string') {
            node.textContent = value;
        }
    });

    document.querySelectorAll('*').forEach((node) => {
        node.getAttributeNames()
            .filter((name) => name.startsWith('data-i18n-attr-'))
            .forEach((name) => {
                const attrName = name.slice('data-i18n-attr-'.length);
                const key = node.getAttribute(name);
                const value = resolvePathValue(strings, key);
                if (typeof value === 'string') {
                    node.setAttribute(attrName, value);
                }
            });
    });
}

export function applyPageLanguage(lang) {
    const normalized = normalizeLang(lang);
    const strings = getPageStrings(normalized);
    const taglineContainer = document.getElementById('taglines');

    applyTextBindings(strings);

    if (taglineContainer) {
        taglineContainer.innerHTML = '';
        const isEn = normalized === 'en';
        strings.taglines.forEach((text) => {
            const p = document.createElement('p');
            p.className = isEn ? 'tagline-en' : 'tagline';
            p.textContent = text;
            taglineContainer.appendChild(p);
        });
    }

    document.documentElement.lang = normalized;
    document.title = strings.documentTitle;
}

export function initLanguageToggle(initialLang, onLanguageChanged) {
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) return;

    setCurrentLang(initialLang, { syncQuery: false });
    langToggle.addEventListener('click', () => {
        const currentLang = getCurrentLang();
        const nextLang = currentLang === 'ja' ? 'en' : 'ja';
        setCurrentLang(nextLang);
        if (typeof onLanguageChanged === 'function') {
            onLanguageChanged(nextLang);
        }
    });
}
