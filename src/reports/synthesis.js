/**
 * Cross-Domain Synthesis Report — card rendering for the synthesis section.
 *
 * Renders two cards in the cross-analysis section:
 * 1. Synthesis report (full analysis)
 * 2. Presentation slides (14-slide summary)
 */

import { normalizeLang } from '../i18n.js';
import { dict } from '../i18n/dict.js';
import { openSlideViewer } from '../slide-viewer.js';
import {
    SYNTHESIS_REPORT_LINKS,
    SYNTHESIS_PRESENTATION_LINKS,
    resolveLocalizedSources,
    buildMarkdownFetchCandidates,
    looksLikeHtmlDocument,
} from './data.js';

function getSynthesisStrings(lang = 'ja') {
    const l = normalizeLang(lang);
    return dict[l]?.reports?.synthesis || dict.ja.reports.synthesis;
}

/**
 * Create the synthesis report renderer.
 *
 * @param {object} opts
 * @param {Function} opts.openMarkdownModal - from the modal controller
 * @param {Function} opts.getLang - returns current language
 */
export function createSynthesisRenderer({ openMarkdownModal, getLang }) {
    let containerEl = null;
    let descriptionEl = null;

    function cacheDom() {
        containerEl = document.getElementById('reports-synthesis-grid');
        descriptionEl = document.getElementById('reports-synthesis-description');
    }

    function renderSynthesis() {
        if (!containerEl) return;

        const lang = getLang();
        const strings = getSynthesisStrings(lang);

        if (descriptionEl) {
            descriptionEl.textContent = strings.description;
        }

        containerEl.innerHTML = '';

        const fragment = document.createDocumentFragment();

        // Card 1: Synthesis report
        const reportCol = document.createElement('div');
        reportCol.className = 'col';

        const reportCard = document.createElement('article');
        reportCard.className = 'card kesson-card h-100 reports-feature-card';
        reportCard.setAttribute('role', 'button');
        reportCard.setAttribute('tabindex', '0');
        reportCard.setAttribute('aria-label', strings.reportTitle);

        const reportBody = document.createElement('div');
        reportBody.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

        const reportTitle = document.createElement('h4');
        reportTitle.className = 'h6 mb-1 text-light';
        reportTitle.textContent = strings.reportTitle;

        const reportDesc = document.createElement('p');
        reportDesc.className = 'small mb-0 reports-feature-description';
        reportDesc.textContent = strings.reportDescription;

        const openReport = () => {
            openMarkdownModal({
                title: strings.reportTitle,
                sources: resolveLocalizedSources(SYNTHESIS_REPORT_LINKS, lang),
            });
        };

        reportCard.addEventListener('click', openReport);
        reportCard.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openReport();
            }
        });

        reportBody.appendChild(reportTitle);
        reportBody.appendChild(reportDesc);
        reportCard.appendChild(reportBody);
        reportCol.appendChild(reportCard);
        fragment.appendChild(reportCol);

        // Card 2: Presentation
        const presCol = document.createElement('div');
        presCol.className = 'col';

        const presCard = document.createElement('article');
        presCard.className = 'card kesson-card h-100 reports-feature-card';
        presCard.setAttribute('role', 'button');
        presCard.setAttribute('tabindex', '0');
        presCard.setAttribute('aria-label', strings.presentationTitle);

        const presBody = document.createElement('div');
        presBody.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

        const presTitle = document.createElement('h4');
        presTitle.className = 'h6 mb-1 text-light';
        presTitle.textContent = strings.presentationTitle;

        const presDesc = document.createElement('p');
        presDesc.className = 'small mb-0 reports-feature-description';
        presDesc.textContent = strings.presentationDescription;

        const openPresentation = () => {
            openMarkdownModal({
                title: strings.presentationModalTitle || strings.presentationTitle,
                sources: resolveLocalizedSources(SYNTHESIS_PRESENTATION_LINKS, lang),
            });
        };

        presCard.addEventListener('click', openPresentation);
        presCard.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPresentation();
            }
        });

        const presSlideBtn = document.createElement('button');
        presSlideBtn.className = 'btn btn-sm btn-outline-info mt-auto reports-domain-slide-btn';
        presSlideBtn.textContent = normalizeLang(lang) === 'ja' ? 'スライド' : 'Slides';
        presSlideBtn.setAttribute('aria-label', strings.presentationTitle + ' slides');
        presSlideBtn.addEventListener('click', async (event) => {
            event.stopPropagation();
            const sources = resolveLocalizedSources(SYNTHESIS_PRESENTATION_LINKS, lang);
            const source = sources[0];
            if (!source || !source.mdUrl) return;
            const candidates = buildMarkdownFetchCandidates(source.mdUrl);
            let markdownText = '';
            let mdBaseUrl = '';
            for (const url of candidates) {
                try {
                    const resp = await fetch(url, { cache: 'no-store' });
                    if (!resp.ok) continue;
                    const text = await resp.text();
                    if (looksLikeHtmlDocument(text)) continue;
                    markdownText = text;
                    mdBaseUrl = url.replace(/\/[^/]*$/, '/');
                    break;
                } catch {
                    continue;
                }
            }
            if (!markdownText) return;
            openSlideViewer({
                markdownText,
                title: strings.presentationModalTitle || strings.presentationTitle,
                mdBaseUrl,
            });
        });

        presBody.appendChild(presTitle);
        presBody.appendChild(presDesc);
        presBody.appendChild(presSlideBtn);
        presCard.appendChild(presBody);
        presCol.appendChild(presCard);
        fragment.appendChild(presCol);

        containerEl.appendChild(fragment);
    }

    return { cacheDom, renderSynthesis };
}
