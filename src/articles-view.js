import { normalizeLang } from './i18n.js';
import { formatArticleDate, getLocalizedText, sanitizeHttpUrl } from './articles-data.js';
import { dict } from './i18n/dict.js';

const INITIAL_DISPLAY = 3;
const ARTICLE_COL_CLASS_WIDE = 'col-12 col-md-6 col-xl-4';
const ARTICLE_COL_CLASS_OFFCANVAS = 'col-12 col-md-6 col-lg-4';

export function getArticlesStrings(lang = 'ja') {
    return dict[normalizeLang(lang)]?.articles || dict.ja.articles;
}

export function normalizeArticlesFilterType(type) {
    if (type === 'page' || type === 'post') return type;
    return 'all';
}

export function setArticlesError(errorNode, message) {
    if (!errorNode) return;
    if (message) {
        errorNode.classList.remove('d-none');
        errorNode.textContent = message;
        return;
    }
    errorNode.textContent = '';
    errorNode.classList.add('d-none');
}

function buildArticleAriaLabel(titleText, lang) {
    const strings = getArticlesStrings(lang);
    const safeTitle = titleText || strings.articleLabel;
    if (normalizeLang(lang) === 'en') {
        return `${strings.openArticle}: ${safeTitle}`;
    }
    return `${safeTitle}${strings.openArticle}`;
}

function updateFilterButtonLabels(filterButtons, lang, activeType) {
    const strings = getArticlesStrings(lang);
    filterButtons.forEach((button) => {
        const type = normalizeArticlesFilterType(button.dataset.type);
        button.textContent = strings.typeLabel[type];
        const isActive = type === activeType;
        button.classList.toggle('active', isActive);
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

function createEmptyCard(lang, useWideLayout) {
    const strings = getArticlesStrings(lang);
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

function createArticleCard(article, lang, useWideLayout) {
    const normalizedLang = normalizeLang(lang);
    const strings = getArticlesStrings(normalizedLang);
    const titleText = getLocalizedText(article.raw, 'title', normalizedLang)
        || getLocalizedText(article.raw, 'label', normalizedLang)
        || article.id;
    const excerptText = getLocalizedText(article.raw, 'excerpt', normalizedLang)
        || getLocalizedText(article.raw, 'description', normalizedLang)
        || getLocalizedText(article.raw, 'summary', normalizedLang);
    const dateText = formatArticleDate(article.raw?.date, normalizedLang);
    const safeUrl = sanitizeHttpUrl(article.url, '#');
    const safeTeaserUrl = sanitizeHttpUrl(article.raw?.teaser, '');

    const col = document.createElement('article');
    col.className = getArticleColumnClass(useWideLayout);

    const anchor = document.createElement('a');
    anchor.href = safeUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.className = 'text-decoration-none';
    anchor.setAttribute('aria-label', buildArticleAriaLabel(titleText, normalizedLang));

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

function createReadMoreButton(lang, totalCount, visibleCount) {
    const strings = getArticlesStrings(lang);
    const btnContainer = document.createElement('div');
    btnContainer.className = 'text-center mt-3';
    btnContainer.dataset.role = 'articles-readmore-wrap';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'card kesson-card btn btn-kesson-action btn-sm d-inline-block';
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

function renderMainArticles(mainGrid, articles, lang) {
    if (!mainGrid) return;
    clearNode(mainGrid);

    const searchRoot = mainGrid.closest('.container') || mainGrid.parentNode;
    const existingReadMore = searchRoot
        ? searchRoot.querySelector('[data-role="articles-readmore-wrap"]')
        : null;
    if (existingReadMore) {
        existingReadMore.remove();
    }

    if (!articles.length) {
        mainGrid.appendChild(createEmptyCard(lang, true));
        return;
    }

    const initialItems = articles.slice(0, INITIAL_DISPLAY);
    const mainFrag = document.createDocumentFragment();
    initialItems.forEach((article) => {
        mainFrag.appendChild(createArticleCard(article, lang, true));
    });
    mainGrid.appendChild(mainFrag);

    // Insert button outside .reports-tab-content, after the container
    const container = mainGrid.closest('.reports-tab-content') || mainGrid.parentNode;
    if (container && container.parentNode) {
        const readMoreButton = createReadMoreButton(lang, articles.length, initialItems.length);
        container.parentNode.insertBefore(readMoreButton, container.nextSibling);
    }
}

function renderOffcanvasArticles(offcanvasGrid, filteredArticles, lang) {
    if (!offcanvasGrid) return;
    clearNode(offcanvasGrid);

    if (!filteredArticles.length) {
        offcanvasGrid.appendChild(createEmptyCard(lang, false));
        return;
    }

    const frag = document.createDocumentFragment();
    filteredArticles.forEach((article) => {
        frag.appendChild(createArticleCard(article, lang, false));
    });
    offcanvasGrid.appendChild(frag);
}

function updateOffcanvasCount(countNode, activeType, filteredCount, totalCount, lang) {
    if (!countNode) return;
    const strings = getArticlesStrings(lang);
    if (activeType === 'all') {
        countNode.textContent = `${totalCount} ${strings.countUnit}`;
        return;
    }
    countNode.textContent = `${filteredCount} / ${totalCount} ${strings.countUnit}`;
}

export function renderArticlesView({
    mainGrid,
    offcanvasGrid,
    countNode,
    filterButtons,
    articles,
    activeType,
    lang,
}) {
    if (!mainGrid && !offcanvasGrid) {
        return;
    }

    const normalizedLang = normalizeLang(lang);
    const normalizedType = normalizeArticlesFilterType(activeType);
    const safeButtons = Array.isArray(filterButtons) ? filterButtons : [];
    updateFilterButtonLabels(safeButtons, normalizedLang, normalizedType);

    const filtered = normalizedType === 'all'
        ? articles
        : articles.filter((article) => article.type === normalizedType);

    renderMainArticles(mainGrid, articles, normalizedLang);
    renderOffcanvasArticles(offcanvasGrid, filtered, normalizedLang);
    updateOffcanvasCount(countNode, normalizedType, filtered.length, articles.length, normalizedLang);
}
