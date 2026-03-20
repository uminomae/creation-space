/**
 * Phase 8 Cross-Domain Themes — card rendering and data loading.
 *
 * Displays five structural themes extracted from the Phase 8 cross-domain
 * analysis as independent clickable cards in the REPORTS section.
 * Also renders conclusion summary cards above the domain grid.
 */

import { normalizeLang } from '../i18n.js';
import { dict } from '../i18n/dict.js';
import {
    PHASE8_THEMES_MANIFEST_URL,
} from './data.js';

const PJDHIRO_RAW_BASE = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main';
const CREATION_PATH = '/assets/creation';
const PJDHIRO_CREATION_RAW = `${PJDHIRO_RAW_BASE}${CREATION_PATH}`;

function getPhase8Strings(lang = 'ja') {
    const l = normalizeLang(lang);
    return dict[l]?.reports?.phase8Themes || dict.ja.reports.phase8Themes;
}

function normalizeTheme(raw) {
    return {
        id: typeof raw?.id === 'string' ? raw.id.trim() : '',
        slug: typeof raw?.slug === 'string' ? raw.slug.trim() : '',
        nameJa: typeof raw?.name_ja === 'string' ? raw.name_ja.trim() : '',
        nameEn: typeof raw?.name_en === 'string' ? raw.name_en.trim() : '',
        descriptionJa: typeof raw?.description_ja === 'string' ? raw.description_ja.trim() : '',
        descriptionEn: typeof raw?.description_en === 'string' ? raw.description_en.trim() : '',
        domainCount: typeof raw?.domain_count === 'number' ? raw.domain_count : 0,
        priority: typeof raw?.priority === 'string' ? raw.priority.trim() : '',
        mdByLang: typeof raw?.md === 'object' && raw.md !== null ? raw.md : null,
        summaryMdByLang: typeof raw?.summary_md === 'object' && raw.summary_md !== null ? raw.summary_md : null,
        pdfByLang: typeof raw?.pdf === 'object' && raw.pdf !== null ? raw.pdf : null,
        generatorModel: typeof raw?.generator_model === 'string' ? raw.generator_model.trim() : '',
        generated: typeof raw?.generated === 'string' ? raw.generated.trim() : '',
    };
}

function resolveThemeMdUrl(theme, lang = 'ja') {
    if (!theme.mdByLang) return '';
    const normalizedLang = normalizeLang(lang);
    const relPath = theme.mdByLang[normalizedLang] || theme.mdByLang['ja'];
    if (!relPath) return '';
    return `${PJDHIRO_CREATION_RAW}/${relPath}`;
}

function resolveThemePdfUrl(theme, lang = 'ja') {
    if (!theme.pdfByLang) return '';
    const normalizedLang = normalizeLang(lang);
    const relPath = theme.pdfByLang[normalizedLang] || theme.pdfByLang['ja'];
    if (!relPath) return '';
    return `${PJDHIRO_CREATION_RAW}/${relPath}`;
}

function resolveSummaryMdUrl(theme, lang = 'ja') {
    if (!theme.summaryMdByLang) return '';
    const normalizedLang = normalizeLang(lang);
    const relPath = theme.summaryMdByLang[normalizedLang] || theme.summaryMdByLang['ja'];
    if (!relPath) return '';
    return `${PJDHIRO_CREATION_RAW}/${relPath}`;
}

function getThemeDisplayName(theme, lang = 'ja') {
    const useJa = normalizeLang(lang) === 'ja';
    return useJa
        ? (theme.nameJa || theme.nameEn || theme.slug)
        : (theme.nameEn || theme.nameJa || theme.slug);
}

function getThemeDescription(theme, lang = 'ja') {
    const useJa = normalizeLang(lang) === 'ja';
    return useJa
        ? (theme.descriptionJa || theme.descriptionEn || '')
        : (theme.descriptionEn || theme.descriptionJa || '');
}

export async function loadPhase8Themes(url = PHASE8_THEMES_MANIFEST_URL) {
    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const rawThemes = Array.isArray(payload?.themes) ? payload.themes : [];
        return {
            generatedAt: typeof payload?.generated_at === 'string' ? payload.generated_at : '',
            themes: rawThemes.map(normalizeTheme).filter((t) => t.id && t.slug),
        };
    } catch (error) {
        console.warn('[phase8] manifest load failed:', error);
        return { generatedAt: '', themes: [] };
    }
}

/**
 * Create the Phase 8 themes renderer.
 *
 * @param {object} opts
 * @param {Function} opts.openMarkdownModal - from the modal controller
 * @param {Function} opts.getLang - returns current language
 */
export function createPhase8Renderer({ openMarkdownModal, getLang }) {
    let containerEl = null;

    let headingEl = null;
    let descriptionEl = null;

    let summaryContainerEl = null;
    let summarySectionEl = null;
    let summaryHeadingEl = null;
    let summaryDescriptionEl = null;

    function cacheDom() {
        containerEl = document.getElementById('reports-phase8-grid');
        headingEl = document.getElementById('reports-phase8-heading');
        descriptionEl = document.getElementById('reports-phase8-description');

        summaryContainerEl = document.getElementById('reports-phase8-summary-grid');
        summarySectionEl = document.getElementById('reports-phase8-summary-section');
        summaryHeadingEl = document.getElementById('reports-phase8-summary-heading');
        summaryDescriptionEl = document.getElementById('reports-phase8-summary-description');
    }

    function renderSummaryCards(themes = []) {
        if (!summaryContainerEl || !summarySectionEl) return;

        const lang = getLang();
        const strings = getPhase8Strings(lang);

        if (summaryHeadingEl) {
            summaryHeadingEl.textContent = strings.summaryHeading || '横断分析テーマ結論要約';
        }
        if (summaryDescriptionEl) {
            summaryDescriptionEl.textContent = strings.summaryDescription || '5つの構造テーマの結論要約。';
        }

        const themesWithSummary = themes.filter((t) => t.summaryMdByLang);
        if (!themesWithSummary.length) {
            summarySectionEl.style.display = 'none';
            return;
        }

        summarySectionEl.style.display = '';
        summaryContainerEl.innerHTML = '';

        const fragment = document.createDocumentFragment();

        themesWithSummary.forEach((theme) => {
            const col = document.createElement('div');
            col.className = 'col';

            const card = document.createElement('article');
            card.className = 'card kesson-card h-100 reports-phase8-summary-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');

            const name = getThemeDisplayName(theme, lang);

            card.setAttribute('aria-label', `${theme.id} ${name} - ${strings.summaryLabel || 'Summary'}`);

            const body = document.createElement('div');
            body.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

            const head = document.createElement('div');
            head.className = 'd-flex flex-wrap align-items-start justify-content-between gap-2';

            const idNode = document.createElement('span');
            idNode.className = 'badge rounded-pill bg-warning bg-opacity-25 text-warning-emphasis';
            idNode.textContent = theme.id;

            const summaryBadge = document.createElement('span');
            summaryBadge.className = 'badge rounded-pill bg-success bg-opacity-25 text-success-emphasis';
            summaryBadge.textContent = strings.summaryBadge || 'Summary';

            head.appendChild(idNode);
            head.appendChild(summaryBadge);

            const titleNode = document.createElement('h4');
            titleNode.className = 'h6 mb-0 text-light';
            titleNode.textContent = name;

            const openCard = () => {
                const mdUrl = resolveSummaryMdUrl(theme, lang);
                if (!mdUrl) return;
                openMarkdownModal({
                    title: `${theme.id}: ${name}`,
                    sources: [{
                        mdUrl,
                        pdfUrl: '',
                        generatorModel: theme.generatorModel,
                        generated: theme.generated,
                    }],
                });
            };

            card.addEventListener('click', openCard);
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openCard();
                }
            });

            body.appendChild(head);
            body.appendChild(titleNode);
            card.appendChild(body);
            col.appendChild(card);
            fragment.appendChild(col);
        });

        summaryContainerEl.appendChild(fragment);
    }

    function renderThemes(themes = []) {
        if (!containerEl) return;

        const lang = getLang();
        const strings = getPhase8Strings(lang);

        if (headingEl) headingEl.textContent = strings.heading;
        if (descriptionEl) descriptionEl.textContent = strings.description;

        containerEl.innerHTML = '';

        if (!themes.length) {
            const empty = document.createElement('div');
            empty.className = 'col-12 text-body-secondary';
            empty.textContent = strings.empty;
            containerEl.appendChild(empty);
            return;
        }

        const fragment = document.createDocumentFragment();

        themes.forEach((theme) => {
            const col = document.createElement('div');
            col.className = 'col';

            const card = document.createElement('article');
            card.className = 'card kesson-card h-100 reports-phase8-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');

            const name = getThemeDisplayName(theme, lang);
            const description = getThemeDescription(theme, lang);
            const domainLabel = strings.cardDomains.replace('{count}', String(theme.domainCount));

            card.setAttribute('aria-label', `${theme.id} ${name}`);

            const body = document.createElement('div');
            body.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

            const head = document.createElement('div');
            head.className = 'd-flex flex-wrap align-items-start justify-content-between gap-2';

            const idNode = document.createElement('span');
            idNode.className = 'badge rounded-pill bg-info bg-opacity-25 text-info-emphasis';
            idNode.textContent = theme.id;

            const domainBadge = document.createElement('span');
            domainBadge.className = 'badge rounded-pill bg-secondary bg-opacity-25 text-secondary-emphasis';
            domainBadge.textContent = domainLabel;

            head.appendChild(idNode);
            head.appendChild(domainBadge);

            const titleNode = document.createElement('h4');
            titleNode.className = 'h6 mb-1 text-light';
            titleNode.textContent = name;

            const descNode = document.createElement('p');
            descNode.className = 'small mb-0 reports-feature-description';
            descNode.textContent = description;

            const openCard = () => {
                const mdUrl = resolveThemeMdUrl(theme, lang);
                if (!mdUrl) return;
                const pdfUrl = resolveThemePdfUrl(theme, lang);
                openMarkdownModal({
                    title: `${theme.id}: ${name}`,
                    sources: [{
                        mdUrl,
                        pdfUrl,
                        generatorModel: theme.generatorModel,
                        generated: theme.generated,
                    }],
                });
            };

            card.addEventListener('click', openCard);
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openCard();
                }
            });

            body.appendChild(head);
            body.appendChild(titleNode);
            body.appendChild(descNode);
            card.appendChild(body);
            col.appendChild(card);
            fragment.appendChild(col);
        });

        containerEl.appendChild(fragment);

        // Also render summary cards
        renderSummaryCards(themes);
    }

    return { cacheDom, renderThemes };
}
