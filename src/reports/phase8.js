/**
 * Phase 8 Cross-Domain Themes — card rendering and data loading.
 *
 * Displays five structural themes extracted from the Phase 8 cross-domain
 * analysis as independent clickable cards in the REPORTS section.
 */

import { normalizeLang } from '../i18n.js';
import { openSlideViewer } from '../slide-viewer.js';
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
        pdfByLang: typeof raw?.pdf === 'object' && raw.pdf !== null ? raw.pdf : null,
        presentationMdByLang: typeof raw?.presentation_md === 'object' && raw.presentation_md !== null ? raw.presentation_md : null,
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

function resolveThemePresentationMdUrl(theme, lang = 'ja') {
    if (!theme.presentationMdByLang) return '';
    const normalizedLang = normalizeLang(lang);
    const relPath = theme.presentationMdByLang[normalizedLang] || theme.presentationMdByLang['ja'];
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

    function cacheDom() {
        containerEl = document.getElementById('reports-phase8-grid');
        headingEl = document.getElementById('reports-phase8-heading');
        descriptionEl = document.getElementById('reports-phase8-description');
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

            card.setAttribute('aria-label', name);

            const body = document.createElement('div');
            body.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

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
                    title: name,
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
            body.appendChild(titleNode);
            body.appendChild(descNode);

            const presentationMdUrl = resolveThemePresentationMdUrl(theme, lang);
            if (presentationMdUrl) {
                const slidesBtn = document.createElement('button');
                slidesBtn.className = 'btn btn-sm btn-outline-light mt-1 align-self-start';
                slidesBtn.textContent = strings.slidesButton || 'Slides';
                slidesBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const currentLang = getLang();
                    const currentUrl = resolveThemePresentationMdUrl(theme, currentLang);
                    if (!currentUrl) return;
                    const currentName = getThemeDisplayName(theme, currentLang);
                    fetch(currentUrl)
                        .then((res) => {
                            if (!res.ok) throw new Error('HTTP ' + res.status);
                            return res.text();
                        })
                        .then((md) => {
                            const mdBaseUrl = currentUrl.replace(/[^/]*$/, '');
                            openSlideViewer({ markdownText: md, title: currentName, mdBaseUrl });
                        })
                        .catch((err) => console.warn('[phase8] slides load failed:', err));
                });
                body.appendChild(slidesBtn);
            }

            card.appendChild(body);
            col.appendChild(card);
            fragment.appendChild(col);
        });

        containerEl.appendChild(fragment);
    }

    return { cacheDom, renderThemes };
}
