import { normalizeLang, syncLangQuery } from './i18n.js';
import { dict } from './i18n/dict.js';

function formatDevVersionLabel(lang, { devVersion = '', devDate = '' } = {}) {
    const resolvedLang = normalizeLang(lang);
    const strings = dict[resolvedLang]?.page || dict.ja.page;
    const prefix = typeof strings.devVersionPrefix === 'string' && strings.devVersionPrefix.trim()
        ? strings.devVersionPrefix.trim()
        : 'dev';
    const normalizedVersion = typeof devVersion === 'string' ? devVersion.trim() : '';
    const normalizedDate = typeof devDate === 'string' ? devDate.trim() : '';
    if (!normalizedVersion) return '';
    return normalizedDate
        ? `${prefix} ${normalizedVersion} · ${normalizedDate}`
        : `${prefix} ${normalizedVersion}`;
}

function updateInlineVersionLabel(lang, { devVersion = '', devDate = '' } = {}) {
    const label = document.getElementById('dev-version-inline');
    if (!label || !devVersion) return;
    label.textContent = formatDevVersionLabel(lang, { devVersion, devDate });
}

export function applyPageLanguage(lang, { devMode = false, devVersion = '', devDate = '' } = {}) {
    const normalized = normalizeLang(lang);
    const strings = dict[normalized]?.page || dict.ja.page;

    const titleH1 = document.getElementById('title-h1');
    const titleSub = document.getElementById('title-sub');
    const taglineContainer = document.getElementById('taglines');
    const topbarMainTitle = document.getElementById('topbar-main-title');
    const topbarDevLink = document.getElementById('topbar-dev-link');
    const topbarArticlesBtn = document.getElementById('topbar-articles-btn');
    const topbarReportsLink = document.getElementById('topbar-reports-link');
    const topbarPreparingBadge = document.getElementById('topbar-preparing-badge');
    const topbarBlogLink = document.getElementById('topbar-blog-link');
    const topbarCollab = document.getElementById('credit-collab');
    const footerSignature = document.getElementById('footer-signature');
    const modelSectionHeading = document.getElementById('model-section-heading');
    const articlesSectionHeading = document.getElementById('articles-section-heading');
    const reportsSectionHeading = document.getElementById('reports-section-heading');
    const reportsAiNotice = document.getElementById('reports-ai-notice');
    const offcanvasArticlesTitle = document.getElementById('offcanvas-articles-title');
    const langToggle = document.getElementById('lang-toggle');
    const graphicSwitcher = document.getElementById('graphic-switcher');
    const graphicHojiButton = document.querySelector('[data-graphic-mode="hoji"]');
    const graphicSinobiButton = document.querySelector('[data-graphic-mode="sinobi"]');
    const graphicIntentButton = document.querySelector('[data-graphic-mode="i"]');
    const surfaceButton = document.getElementById('surface-btn');

    if (titleH1) titleH1.textContent = strings.title;
    if (titleSub) titleSub.textContent = strings.subtitle;
    if (topbarMainTitle) topbarMainTitle.textContent = strings.topbarMainTitle;
    if (topbarDevLink) topbarDevLink.textContent = strings.topbarDev;
    if (topbarArticlesBtn) topbarArticlesBtn.textContent = strings.topbarArticles;
    if (topbarReportsLink) {
        topbarReportsLink.textContent = strings.topbarReports;
        topbarReportsLink.setAttribute('aria-label', strings.topbarReportsAria);
    }
    if (topbarPreparingBadge) topbarPreparingBadge.textContent = strings.topbarPreparingBadge;
    if (topbarBlogLink) {
        topbarBlogLink.textContent = strings.topbarBlog;
        topbarBlogLink.setAttribute('aria-label', strings.topbarBlogAria);
    }
    if (topbarCollab) topbarCollab.textContent = strings.topbarCollab;
    if (footerSignature) footerSignature.textContent = strings.creditSignature;
    if (modelSectionHeading) {
        modelSectionHeading.textContent = strings.modelSectionHeading;
        modelSectionHeading.setAttribute('aria-label', strings.modelSectionHeadingAria);
    }
    if (articlesSectionHeading) {
        articlesSectionHeading.textContent = strings.articlesSectionHeading;
        articlesSectionHeading.setAttribute('aria-label', strings.articlesSectionHeadingAria);
    }
    if (reportsSectionHeading) {
        reportsSectionHeading.textContent = strings.reportsSectionHeading;
        reportsSectionHeading.setAttribute('aria-label', strings.reportsSectionHeadingAria);
    }
    if (reportsAiNotice) reportsAiNotice.textContent = strings.reportsAiNotice;
    if (offcanvasArticlesTitle) offcanvasArticlesTitle.textContent = strings.offcanvasArticlesTitle;
    if (graphicSwitcher) graphicSwitcher.setAttribute('aria-label', strings.graphicSwitcherAria);
    if (graphicHojiButton) graphicHojiButton.textContent = strings.graphicModeHoji;
    if (graphicSinobiButton) graphicSinobiButton.textContent = strings.graphicModeSinobi;
    if (graphicIntentButton) graphicIntentButton.textContent = strings.graphicModeIntent;
    if (surfaceButton) surfaceButton.setAttribute('aria-label', strings.surfaceButtonAria);
    if (langToggle) {
        langToggle.textContent = strings.langToggleLabel;
        langToggle.setAttribute('aria-label', strings.langToggleAria);
    }

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
    updateInlineVersionLabel(normalized, { devMode, devVersion, devDate });
}

export function initLanguageToggle(initialLang, onLanguageChanged) {
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) return;

    let currentLang = normalizeLang(initialLang);
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ja' ? 'en' : 'ja';
        syncLangQuery(currentLang);
        if (typeof onLanguageChanged === 'function') {
            onLanguageChanged(currentLang);
        }
    });
}
