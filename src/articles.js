import { normalizeLang } from './i18n.js';
import {
    DEFAULT_ARTICLES_DATA_URLS,
    DEFAULT_ARTICLES_I18N_CACHE_URLS,
    loadAndMergeArticles,
} from './articles-data.js';
import {
    getArticlesStrings,
    normalizeArticlesFilterType,
    renderArticlesView,
    setArticlesError,
} from './articles-view.js';

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

function renderArticles() {
    renderArticlesView({
        mainGrid: state.dom.mainGrid,
        offcanvasGrid: state.dom.offcanvasGrid,
        countNode: state.dom.count,
        filterButtons: state.dom.filterButtons,
        articles: state.articles,
        activeType: state.activeType,
        lang: state.lang,
    });
}

function bindFilterButtons() {
    if (state.filtersBound) return;
    state.dom.filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextType = normalizeArticlesFilterType(button.dataset.type);
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
    devMode = false,
    i18nUrls = DEFAULT_ARTICLES_I18N_CACHE_URLS,
} = {}) {
    cacheDom();
    state.lang = normalizeLang(lang);
    state.activeType = 'all';

    renderArticles();
    bindFilterButtons();

    try {
        setArticlesError(state.dom.error, '');
        const allArticles = await loadAndMergeArticles(dataUrls, i18nUrls);
        state.articles = devMode ? allArticles : allArticles.filter((a) => !a.devOnly);
        state.loadError = false;
    } catch (error) {
        state.articles = [];
        state.loadError = true;
        setArticlesError(state.dom.error, getArticlesStrings(state.lang).error);
        console.warn('[articles] load failed:', error);
    }

    renderArticles();
}

export function setArticlesLanguage(lang) {
    state.lang = normalizeLang(lang);
    setArticlesError(
        state.dom.error,
        state.loadError ? getArticlesStrings(state.lang).error : '',
    );
    renderArticles();
}
