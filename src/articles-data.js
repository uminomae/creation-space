import { normalizeLang } from './i18n.js';

export const DEFAULT_ARTICLES_DATA_URLS = [
    'https://uminomae.github.io/pjdhiro/api/creation-articles.json',
    '/pjdhiro/api/creation-articles.json',
    './assets/page-links.json',
];

export const DEFAULT_ARTICLES_I18N_CACHE_URLS = [
    './assets/articles/articles.json',
];

export function sanitizeHttpUrl(url, fallback = '#', baseHref = window.location.href) {
    if (typeof url !== 'string') return fallback;
    const trimmed = url.trim();
    if (!trimmed) return fallback;
    try {
        const parsed = new URL(trimmed, baseHref);
        if (/^https?:$/i.test(parsed.protocol)) {
            return parsed.toString();
        }
    } catch {
        return fallback;
    }
    return fallback;
}

export function getLocalizedText(item, key, lang) {
    if (!item || typeof item !== 'object') return '';

    const normalizedLang = normalizeLang(lang);
    const fallbackLang = normalizedLang === 'en' ? 'ja' : 'en';
    const byLangKey = `${key}_${normalizedLang}`;
    const fallbackByLangKey = `${key}_${fallbackLang}`;

    if (typeof item[byLangKey] === 'string' && item[byLangKey].trim()) {
        return item[byLangKey].trim();
    }
    if (typeof item[fallbackByLangKey] === 'string' && item[fallbackByLangKey].trim()) {
        return item[fallbackByLangKey].trim();
    }

    const i18nValue = item[`${key}_i18n`];
    if (i18nValue && typeof i18nValue === 'object') {
        if (typeof i18nValue[normalizedLang] === 'string' && i18nValue[normalizedLang].trim()) {
            return i18nValue[normalizedLang].trim();
        }
        if (typeof i18nValue[fallbackLang] === 'string' && i18nValue[fallbackLang].trim()) {
            return i18nValue[fallbackLang].trim();
        }
    }

    const base = item[key];
    if (typeof base === 'string' && base.trim()) {
        return base.trim();
    }
    if (base && typeof base === 'object') {
        if (typeof base[normalizedLang] === 'string' && base[normalizedLang].trim()) {
            return base[normalizedLang].trim();
        }
        if (typeof base[fallbackLang] === 'string' && base[fallbackLang].trim()) {
            return base[fallbackLang].trim();
        }
    }

    return '';
}

export function formatArticleDate(dateStr, lang) {
    if (!dateStr) return '';

    const normalizedLang = normalizeLang(lang);
    const locale = normalizedLang === 'en' ? 'en-US' : 'ja-JP';

    try {
        return new Date(dateStr).toLocaleDateString(locale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    } catch {
        return '';
    }
}

function buildUrl(basePath, item) {
    const explicitUrl = typeof item?.url === 'string' && item.url.trim()
        ? item.url.trim()
        : (typeof item?.href === 'string' && item.href.trim()
            ? item.href.trim()
            : (typeof item?.link === 'string' && item.link.trim()
                ? item.link.trim()
                : null));
    const path = explicitUrl || (typeof item?.path === 'string' && item.path.trim()
        ? item.path.trim()
        : (basePath || './'));
    const url = new URL(path, window.location.href);
    const query = item?.query;

    if (query && typeof query === 'object') {
        Object.entries(query).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return;
            url.searchParams.set(key, String(value));
        });
    }

    if (item?.hash) {
        url.hash = String(item.hash).replace(/^#/, '');
    }
    return url;
}

function normalizeType(item, url) {
    const explicit = String(item?.type || '').toLowerCase();
    if (explicit === 'post') return 'post';
    if (explicit === 'page') return 'page';

    const pathname = String(url?.pathname || '').toLowerCase();
    if (pathname.includes('/post/') || pathname.includes('/posts/')) return 'post';
    if (pathname.endsWith('.md') || pathname.endsWith('.markdown')) return 'post';
    return 'page';
}

function normalizeArticle(key, item, basePath) {
    const url = buildUrl(basePath, item);
    const parsedDate = Date.parse(item?.date || '');
    return {
        id: String(key),
        url: url.toString(),
        type: normalizeType(item, url),
        raw: item,
        dateMs: Number.isFinite(parsedDate) ? parsedDate : Number.NaN,
    };
}

function resolveArticleEntries(data) {
    if (!data || typeof data !== 'object') {
        return {
            basePath: './',
            entries: [],
        };
    }

    const basePath = typeof data.basePath === 'string' ? data.basePath : './';

    if (data.presets && typeof data.presets === 'object') {
        return {
            basePath,
            entries: Object.entries(data.presets),
        };
    }

    const list = Array.isArray(data.articles)
        ? data.articles
        : (Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : null));
    if (list) {
        return {
            basePath,
            entries: list
                .filter((item) => item && typeof item === 'object')
                .map((item, idx) => {
                    const id = item.id || item.slug || item.key || item.url || `article_${idx + 1}`;
                    return [String(id), item];
                }),
        };
    }

    const mapEntries = Object.entries(data)
        .filter(([key, value]) => {
            if (key === 'basePath') return false;
            if (!value || typeof value !== 'object') return false;
            const hasPathLike = typeof value.path === 'string'
                || typeof value.url === 'string'
                || typeof value.href === 'string'
                || typeof value.link === 'string';
            return hasPathLike;
        });

    return {
        basePath,
        entries: mapEntries,
    };
}

function normalizeArticlesFromData(data) {
    const { basePath, entries } = resolveArticleEntries(data);
    return entries.map(([key, item]) => normalizeArticle(key, item, basePath));
}

function mergeArticleI18nFromCache(primaryArticles, cacheArticles) {
    if (!Array.isArray(primaryArticles) || !Array.isArray(cacheArticles) || !cacheArticles.length) {
        return primaryArticles;
    }

    const cacheByUrl = new Map();
    cacheArticles.forEach((article) => {
        const key = sanitizeHttpUrl(article.url, '');
        if (key) cacheByUrl.set(key, article.raw || {});
    });

    return primaryArticles.map((article) => {
        const key = sanitizeHttpUrl(article.url, '');
        const cached = key ? cacheByUrl.get(key) : null;
        if (!cached || typeof cached !== 'object') return article;

        return {
            ...article,
            raw: {
                ...article.raw,
                title_ja: article.raw?.title_ja || cached.title_ja,
                title_en: article.raw?.title_en || cached.title_en,
                excerpt_ja: article.raw?.excerpt_ja || cached.excerpt_ja,
                excerpt_en: article.raw?.excerpt_en || cached.excerpt_en,
            },
        };
    });
}

async function loadArticles(dataUrls) {
    const candidates = Array.isArray(dataUrls) ? dataUrls : [dataUrls];
    let loaded = null;
    let lastError = null;

    for (const candidate of candidates) {
        if (typeof candidate !== 'string' || !candidate.trim()) continue;
        try {
            const res = await fetch(candidate, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            loaded = await res.json();
            break;
        } catch (error) {
            lastError = error;
        }
    }

    if (!loaded) {
        throw (lastError || new Error('No article data available.'));
    }

    return loaded;
}

function sortArticlesByDate(articles) {
    return articles.sort((a, b) => {
        const diff = b.dateMs - a.dateMs;
        if (Number.isFinite(diff) && diff !== 0) return diff;
        return a.id.localeCompare(b.id);
    });
}

export async function loadAndMergeArticles(
    dataUrls = DEFAULT_ARTICLES_DATA_URLS,
    i18nUrls = DEFAULT_ARTICLES_I18N_CACHE_URLS,
) {
    const primaryData = await loadArticles(dataUrls);
    const primaryArticles = normalizeArticlesFromData(primaryData);

    let cacheArticles = [];
    try {
        const cacheData = await loadArticles(i18nUrls);
        cacheArticles = normalizeArticlesFromData(cacheData);
    } catch (error) {
        console.warn('[articles] i18n cache unavailable:', error);
    }

    const merged = mergeArticleI18nFromCache(primaryArticles, cacheArticles);
    return sortArticlesByDate(merged);
}
