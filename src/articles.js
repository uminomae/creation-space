const ARTICLES_DATA_URLS = [
    '/pjdhiro/api/creation-articles.json',
    '../kesson-space/assets/page-links.json',
    './assets/page-links.json',
];

const CREATION_TOPIC_TOKENS = new Set(['創造', 'creation']);
const CREATION_TAXONOMY_KEYS = [
    'category',
    'categories',
    'tag',
    'tags',
    'topic',
    'topics',
    'category_ja',
    'categories_ja',
    'tag_ja',
    'tags_ja',
    'topic_ja',
    'topics_ja',
    'category_en',
    'categories_en',
    'tag_en',
    'tags_en',
    'topic_en',
    'topics_en',
];

const UI_STRINGS = {
    ja: {
        open: '開く',
        empty: '公開中の記事はまだありません。',
        error: '記事一覧の読み込みに失敗しました。',
        local: 'ローカル',
        external: '外部',
        typeLabel: {
            all: 'すべて',
            page: 'ページ',
            post: '投稿',
        },
        creationTopicLabel: '創造',
        creationEmpty: '「創造」カテゴリ/タグの記事はまだありません。',
        count: (visible, total) => `${visible}件 / 全${total}件`,
    },
    en: {
        open: 'Open',
        empty: 'No articles are available yet.',
        error: 'Failed to load the article list.',
        local: 'Local',
        external: 'External',
        typeLabel: {
            all: 'All',
            page: 'Page',
            post: 'Post',
        },
        creationTopicLabel: 'Creation',
        creationEmpty: 'No articles found for the "Creation" category/tag.',
        count: (visible, total) => `${visible} / ${total}`,
    },
};

const state = {
    lang: 'ja',
    activeType: 'all',
    articles: [],
    loadError: false,
    filtersBound: false,
    dom: {
        mainGrid: null,
        offcanvasGrid: null,
        creationCardsContainer: null,
        error: null,
        count: null,
        filterButtons: [],
    },
};

function getStrings(lang) {
    return UI_STRINGS[lang] || UI_STRINGS.ja;
}

function normalizeFilterType(type) {
    if (type === 'page' || type === 'post') return type;
    return 'all';
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

function normalizeTopicToken(value) {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/^#/, '').toLowerCase();
}

function collectTopicValues(value, output) {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
        value.forEach((item) => collectTopicValues(item, output));
        return;
    }

    if (typeof value === 'string') {
        value
            .split(/[,\u3001]/)
            .map((part) => normalizeTopicToken(part))
            .filter(Boolean)
            .forEach((token) => output.add(token));
        return;
    }

    if (typeof value === 'object') {
        ['name', 'label', 'slug', 'value'].forEach((key) => {
            const candidate = value[key];
            if (typeof candidate === 'string') {
                const token = normalizeTopicToken(candidate);
                if (token) output.add(token);
            }
        });
    }
}

function extractTopicTokens(rawItem) {
    const tokens = new Set();
    if (!rawItem || typeof rawItem !== 'object') return tokens;

    CREATION_TAXONOMY_KEYS.forEach((key) => {
        collectTopicValues(rawItem[key], tokens);
    });

    if (rawItem.meta && typeof rawItem.meta === 'object') {
        CREATION_TAXONOMY_KEYS.forEach((key) => {
            collectTopicValues(rawItem.meta[key], tokens);
        });
    }

    if (rawItem.taxonomy && typeof rawItem.taxonomy === 'object') {
        CREATION_TAXONOMY_KEYS.forEach((key) => {
            collectTopicValues(rawItem.taxonomy[key], tokens);
        });
    }

    return tokens;
}

function isCreationTopicArticle(article) {
    const tokens = extractTopicTokens(article?.raw);
    return Array.from(tokens).some((token) => CREATION_TOPIC_TOKENS.has(token));
}

function pickLocalized(item, key, lang) {
    if (!item || typeof item !== 'object') return '';

    const direct = item[`${key}_${lang}`];
    if (typeof direct === 'string' && direct.trim()) return direct.trim();

    const fallbackLang = lang === 'ja' ? 'en' : 'ja';
    const fallback = item[`${key}_${fallbackLang}`];
    if (typeof fallback === 'string' && fallback.trim()) return fallback.trim();

    const base = item[key];
    if (typeof base === 'string' && base.trim()) return base.trim();
    return '';
}

function fallbackDescription(url, lang) {
    const path = url.pathname || '/';
    const info = [];
    if (path && path !== '/') info.push(path);
    if (url.hash) info.push(`#${url.hash.replace(/^#/, '')}`);

    if (info.length > 0) return info.join(' · ');
    return lang === 'ja' ? 'リンク先ページ' : 'Linked page';
}

function normalizeArticle(key, item, basePath) {
    const url = buildUrl(basePath, item);
    return {
        id: key,
        url: url.toString(),
        isExternal: url.origin !== window.location.origin,
        type: normalizeType(item, url),
        raw: item,
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
                    const id = item.id || item.slug || item.key || `article_${idx + 1}`;
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

function setError(message) {
    const errorNode = state.dom.error;
    if (!errorNode) return;
    if (message) {
        errorNode.classList.remove('d-none');
        errorNode.textContent = message;
        return;
    }
    errorNode.textContent = '';
    errorNode.classList.add('d-none');
}

function updateFilterButtonLabels() {
    const strings = getStrings(state.lang);
    state.dom.filterButtons.forEach((button) => {
        const type = normalizeFilterType(button.dataset.type);
        button.textContent = strings.typeLabel[type];
        const isActive = type === state.activeType;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

function clearNode(node) {
    if (node) node.innerHTML = '';
}

function createEmptyCard(strings, useWideLayout) {
    const col = document.createElement('article');
    col.className = useWideLayout ? 'col-12 col-md-6 col-xl-4' : 'col-12';

    const card = document.createElement('div');
    card.className = 'card kesson-card h-100';
    card.setAttribute('aria-live', 'polite');

    const body = document.createElement('div');
    body.className = 'card-body';

    const text = document.createElement('p');
    text.className = 'card-text mb-0';
    text.textContent = strings.empty;

    body.appendChild(text);
    card.appendChild(body);
    col.appendChild(card);
    return col;
}

function createArticleCard(article, useWideLayout) {
    const strings = getStrings(state.lang);
    const title = pickLocalized(article.raw, 'label', state.lang) || article.id;
    const description = pickLocalized(article.raw, 'description', state.lang)
        || pickLocalized(article.raw, 'summary', state.lang)
        || fallbackDescription(new URL(article.url), state.lang);

    const col = document.createElement('article');
    col.className = useWideLayout ? 'col-12 col-md-6 col-xl-4' : 'col-12';

    const anchor = document.createElement('a');
    anchor.className = 'card kesson-card h-100 text-decoration-none';
    anchor.href = article.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.setAttribute('aria-label', `${title} (${strings.open})`);
    anchor.classList.add('cursor-pointer');

    const body = document.createElement('div');
    body.className = 'card-body d-flex flex-column';

    const headingRow = document.createElement('div');
    headingRow.className = 'd-flex justify-content-between align-items-start gap-2';

    const titleEl = document.createElement('h3');
    titleEl.className = 'card-title mb-1';
    titleEl.textContent = title;

    const typeBadge = document.createElement('span');
    typeBadge.className = 'badge rounded-pill text-bg-secondary badge-article-type';
    typeBadge.textContent = strings.typeLabel[article.type];

    const textEl = document.createElement('p');
    textEl.className = 'card-text mb-3 flex-grow-1';
    textEl.textContent = description;

    const cta = document.createElement('span');
    cta.className = 'btn-read-more mt-auto align-self-start';
    cta.textContent = strings.open;

    const meta = document.createElement('small');
    meta.className = 'd-block mt-2';
    meta.textContent = article.isExternal ? strings.external : strings.local;

    headingRow.appendChild(titleEl);
    headingRow.appendChild(typeBadge);
    body.appendChild(headingRow);
    body.appendChild(textEl);
    body.appendChild(cta);
    body.appendChild(meta);
    anchor.appendChild(body);
    col.appendChild(anchor);
    return col;
}

function createCreationEmptyCard() {
    const strings = getStrings(state.lang);
    const col = document.createElement('article');
    col.className = 'col-12';

    const card = document.createElement('div');
    card.className = 'creation-card-placeholder';

    const title = document.createElement('h3');
    title.textContent = strings.creationTopicLabel;

    const body = document.createElement('p');
    body.textContent = strings.creationEmpty;

    card.appendChild(title);
    card.appendChild(body);
    col.appendChild(card);
    return col;
}

function renderCreationCards() {
    const container = state.dom.creationCardsContainer;
    if (!container) return;

    clearNode(container);
    const creationArticles = state.articles.filter(isCreationTopicArticle).slice(0, 3);
    if (!creationArticles.length) {
        container.appendChild(createCreationEmptyCard());
        return;
    }

    const fragment = document.createDocumentFragment();
    creationArticles.forEach((article) => {
        fragment.appendChild(createArticleCard(article, true));
    });
    container.appendChild(fragment);
}

function renderArticles() {
    const { mainGrid, offcanvasGrid, count } = state.dom;
    if (!mainGrid && !offcanvasGrid && !state.dom.creationCardsContainer) return;

    updateFilterButtonLabels();

    const filtered = state.activeType === 'all'
        ? state.articles
        : state.articles.filter((article) => article.type === state.activeType);

    const strings = getStrings(state.lang);
    if (count) {
        count.textContent = strings.count(filtered.length, state.articles.length);
    }

    clearNode(mainGrid);
    clearNode(offcanvasGrid);

    if (!filtered.length) {
        if (mainGrid) {
            mainGrid.appendChild(createEmptyCard(strings, true));
        }
        if (offcanvasGrid) {
            offcanvasGrid.appendChild(createEmptyCard(strings, false));
        }
        renderCreationCards();
        return;
    }

    const mainFrag = document.createDocumentFragment();
    const offcanvasFrag = document.createDocumentFragment();

    filtered.forEach((article) => {
        mainFrag.appendChild(createArticleCard(article, true));
        offcanvasFrag.appendChild(createArticleCard(article, false));
    });

    if (mainGrid) {
        mainGrid.appendChild(mainFrag);
    }
    if (offcanvasGrid) {
        offcanvasGrid.appendChild(offcanvasFrag);
    }
    renderCreationCards();
}

function bindFilterButtons() {
    if (state.filtersBound) return;
    state.dom.filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextType = normalizeFilterType(button.dataset.type);
            if (nextType === state.activeType) return;
            state.activeType = nextType;
            renderArticles();
        });
    });
    state.filtersBound = true;
}

async function loadArticles(dataUrls) {
    const candidates = Array.isArray(dataUrls) ? dataUrls : [dataUrls];
    let data = null;
    let lastError = null;

    for (const candidate of candidates) {
        if (typeof candidate !== 'string' || !candidate.trim()) continue;
        try {
            const res = await fetch(candidate, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            data = await res.json();
            break;
        } catch (error) {
            lastError = error;
        }
    }

    if (!data) {
        throw (lastError || new Error('No article data available.'));
    }

    const { basePath, entries } = resolveArticleEntries(data);

    state.articles = entries
        .map(([key, item]) => normalizeArticle(key, item, basePath))
        .sort((a, b) => a.id.localeCompare(b.id));
}

function cacheDom() {
    state.dom.mainGrid = document.getElementById('articles-grid');
    state.dom.offcanvasGrid = document.getElementById('offcanvas-articles-grid');
    state.dom.creationCardsContainer = document.getElementById('creation-cards-container');
    state.dom.error = document.getElementById('articles-error');
    state.dom.count = document.getElementById('offcanvas-articles-count');
    state.dom.filterButtons = Array.from(document.querySelectorAll('.articles-filter-btn'));
}

export async function initArticles({ lang = 'ja', dataUrls = ARTICLES_DATA_URLS } = {}) {
    cacheDom();
    state.lang = lang === 'en' ? 'en' : 'ja';
    state.activeType = 'all';

    updateFilterButtonLabels();
    bindFilterButtons();

    try {
        setError('');
        await loadArticles(dataUrls);
        state.loadError = false;
    } catch (error) {
        state.articles = [];
        state.loadError = true;
        setError(getStrings(state.lang).error);
        console.warn('[articles] load failed:', error);
    }

    renderArticles();
}

export function setArticlesLanguage(lang) {
    state.lang = lang === 'en' ? 'en' : 'ja';
    setError(state.loadError ? getStrings(state.lang).error : '');
    renderArticles();
}
