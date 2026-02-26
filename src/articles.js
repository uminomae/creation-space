import { normalizeLang } from './i18n.js';
import {
    DEFAULT_ARTICLES_DATA_URLS,
    DEFAULT_ARTICLES_I18N_CACHE_URLS,
    formatArticleDate,
    getLocalizedText,
    loadAndMergeArticles,
    sanitizeHttpUrl,
} from './articles-data.js';

const INITIAL_DISPLAY = 3;
const ARTICLE_COL_CLASS_WIDE = 'col-12 col-md-6 col-xl-4';
const ARTICLE_COL_CLASS_OFFCANVAS = 'col-12 col-md-6 col-lg-4';

const UI_STRINGS = {
    ja: {
        articleLabel: '記事',
        openArticle: 'を読む',
        readMore: '▸ 続きを見る',
        viewAll: '▸ すべて表示',
        countUnit: '件',
        typeLabel: {
            all: 'すべて',
            page: 'ページ',
            post: '投稿',
        },
        empty: '公開中の記事はまだありません。',
        error: '記事一覧の読み込みに失敗しました。',
    },
    en: {
        articleLabel: 'article',
        openArticle: 'Read',
        readMore: '▸ Read More',
        viewAll: '▸ View All',
        countUnit: 'articles',
        typeLabel: {
            all: 'All',
            page: 'Page',
            post: 'Post',
        },
        empty: 'No articles are available yet.',
        error: 'Failed to load article data.',
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
        error: null,
        count: null,
        filterButtons: [],
    },
};

function getStrings(lang = state.lang) {
    return UI_STRINGS[normalizeLang(lang)];
}

function normalizeFilterType(type) {
    if (type === 'page' || type === 'post') return type;
    return 'all';
}

function buildArticleAriaLabel(titleText, lang) {
    const strings = getStrings(lang);
    const safeTitle = titleText || strings.articleLabel;
    if (normalizeLang(lang) === 'en') {
        return `${strings.openArticle}: ${safeTitle}`;
    }
    return `${safeTitle}${strings.openArticle}`;
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

function getArticleColumnClass(useWideLayout) {
    return useWideLayout ? ARTICLE_COL_CLASS_WIDE : ARTICLE_COL_CLASS_OFFCANVAS;
}

function createEmptyCard(useWideLayout) {
    const strings = getStrings(state.lang);
    const col = document.createElement('article');
    col.className = getArticleColumnClass(useWideLayout);

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
    const lang = normalizeLang(state.lang);
    const strings = getStrings(lang);
    const titleText = getLocalizedText(article.raw, 'title', lang)
        || getLocalizedText(article.raw, 'label', lang)
        || article.id;
    const excerptText = getLocalizedText(article.raw, 'excerpt', lang)
        || getLocalizedText(article.raw, 'description', lang)
        || getLocalizedText(article.raw, 'summary', lang);
    const dateText = formatArticleDate(article.raw?.date, lang);
    const safeUrl = sanitizeHttpUrl(article.url, '#');
    const safeTeaserUrl = sanitizeHttpUrl(article.raw?.teaser, '');

    const col = document.createElement('article');
    col.className = getArticleColumnClass(useWideLayout);

    const anchor = document.createElement('a');
    anchor.href = safeUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.className = 'text-decoration-none';
    anchor.setAttribute('aria-label', buildArticleAriaLabel(titleText, lang));

    const card = document.createElement('div');
    card.className = 'card kesson-card h-100';

    if (safeTeaserUrl) {
        const teaserImg = document.createElement('img');
        teaserImg.src = safeTeaserUrl;
        teaserImg.className = 'card-img-top';
        teaserImg.alt = '';
        teaserImg.addEventListener('error', () => {
            teaserImg.style.display = 'none';
        });
        card.appendChild(teaserImg);
    }

    const body = document.createElement('div');
    body.className = 'card-body';

    const badge = document.createElement('span');
    badge.className = 'badge bg-secondary mb-2 badge-article-type';
    badge.textContent = strings.typeLabel[article.type];

    const title = document.createElement('h6');
    title.className = 'card-title mb-1';
    title.textContent = titleText;

    const date = document.createElement('small');
    date.textContent = dateText;

    body.appendChild(badge);
    body.appendChild(title);

    if (excerptText) {
        const excerpt = document.createElement('p');
        excerpt.className = 'card-text';
        excerpt.textContent = excerptText;
        body.appendChild(excerpt);
    }

    body.appendChild(date);
    card.appendChild(body);
    anchor.appendChild(card);
    col.appendChild(anchor);
    return col;
}

function createReadMoreButton(totalCount, visibleCount) {
    const strings = getStrings(state.lang);
    const btnContainer = document.createElement('div');
    btnContainer.className = 'text-center mt-3';
    btnContainer.dataset.role = 'articles-readmore-wrap';

    const btn = document.createElement('button');
    btn.className = 'btn-read-more';
    btn.setAttribute('data-bs-toggle', 'offcanvas');
    btn.setAttribute('data-bs-target', '#articlesOffcanvas');
    btn.setAttribute('aria-controls', 'articlesOffcanvas');

    const remaining = totalCount - visibleCount;
    btn.textContent = remaining > 0
        ? `${strings.readMore} (${remaining})`
        : `${strings.viewAll} (${totalCount})`;

    btnContainer.appendChild(btn);
    return btnContainer;
}

function renderMainArticles(articles) {
    const grid = state.dom.mainGrid;
    if (!grid) return;

    clearNode(grid);

    const existingReadMore = grid.parentNode
        ? grid.parentNode.querySelector('[data-role="articles-readmore-wrap"]')
        : null;
    if (existingReadMore) {
        existingReadMore.remove();
    }

    if (!articles.length) {
        grid.appendChild(createEmptyCard(true));
        return;
    }

    const initialItems = articles.slice(0, INITIAL_DISPLAY);
    const mainFrag = document.createDocumentFragment();
    initialItems.forEach((article) => {
        mainFrag.appendChild(createArticleCard(article, true));
    });
    grid.appendChild(mainFrag);

    if (grid.parentNode) {
        const readMoreButton = createReadMoreButton(articles.length, initialItems.length);
        grid.parentNode.insertBefore(readMoreButton, grid.nextSibling);
    }
}

function renderOffcanvasArticles(filteredArticles) {
    const grid = state.dom.offcanvasGrid;
    if (!grid) return;

    clearNode(grid);

    if (!filteredArticles.length) {
        grid.appendChild(createEmptyCard(false));
        return;
    }

    const frag = document.createDocumentFragment();
    filteredArticles.forEach((article) => {
        frag.appendChild(createArticleCard(article, false));
    });
    grid.appendChild(frag);
}

function updateOffcanvasCount(filteredCount) {
    const count = state.dom.count;
    if (!count) return;
    const strings = getStrings(state.lang);
    if (state.activeType === 'all') {
        count.textContent = `${state.articles.length} ${strings.countUnit}`;
        return;
    }
    count.textContent = `${filteredCount} / ${state.articles.length} ${strings.countUnit}`;
}

function renderArticles() {
    if (!state.dom.mainGrid && !state.dom.offcanvasGrid) {
        return;
    }

    updateFilterButtonLabels();

    const filtered = state.activeType === 'all'
        ? state.articles
        : state.articles.filter((article) => article.type === state.activeType);

    renderMainArticles(state.articles);
    renderOffcanvasArticles(filtered);
    updateOffcanvasCount(filtered.length);
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

function cacheDom() {
    state.dom.mainGrid = document.getElementById('articles-grid');
    state.dom.offcanvasGrid = document.getElementById('offcanvas-articles-grid');
    state.dom.error = document.getElementById('articles-error');
    state.dom.count = document.getElementById('offcanvas-articles-count');
    state.dom.filterButtons = Array.from(document.querySelectorAll('.articles-filter-btn'));
}

export async function initArticles({
    lang = 'ja',
    dataUrls = DEFAULT_ARTICLES_DATA_URLS,
    i18nUrls = DEFAULT_ARTICLES_I18N_CACHE_URLS,
} = {}) {
    cacheDom();
    state.lang = normalizeLang(lang);
    state.activeType = 'all';

    updateFilterButtonLabels();
    bindFilterButtons();

    try {
        setError('');
        state.articles = await loadAndMergeArticles(dataUrls, i18nUrls);
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
    state.lang = normalizeLang(lang);
    setError(state.loadError ? getStrings(state.lang).error : '');
    renderArticles();
}
