/**
 * Cross-Domain Synthesis Report — card rendering for the synthesis section.
 *
 * Renders a single card with the synthesis report + slide button.
 */

import { normalizeLang } from '../i18n.js';
import { dict } from '../i18n/dict.js';
import { openSlideViewer, openRichSlideViewer } from '../slide-viewer.js';
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
export function createSynthesisRenderer({ openMarkdownModal, getLang, wrapSlideOpen }) {
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

        // Single card: Synthesis report + slide button
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
                modalContext: { type: 'generic', modalKey: 'synthesis', historyMode: 'push' },
            });
        };

        reportCard.addEventListener('click', openReport);
        reportCard.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openReport();
            }
        });

        // Slide button
        const slideBtn = document.createElement('button');
        const slideLabel = normalizeLang(lang) === 'ja' ? 'スライド' : 'Slides';
        slideBtn.type = 'button';
        slideBtn.className = 'reports-slide-btn mt-auto align-self-start';
        slideBtn.textContent = slideLabel;
        slideBtn.setAttribute('aria-label', `${strings.reportTitle} ${slideLabel}`);
        slideBtn.addEventListener('click', async (event) => {
            event.stopPropagation();
            const currentLang = getLang();
            const currentStrings = getSynthesisStrings(currentLang);
            const sources = resolveLocalizedSources(SYNTHESIS_PRESENTATION_LINKS, currentLang);
            const source = sources[0];
            if (!source) return;
            const slideOnClose = typeof wrapSlideOpen === 'function' ? wrapSlideOpen('synthesis') : null;

            // Try rich HTML first
            if (source.htmlUrl) {
                try {
                    const headResp = await fetch(source.htmlUrl, { method: 'HEAD', cache: 'no-store' });
                    if (headResp.ok) {
                        openRichSlideViewer({ htmlUrl: source.htmlUrl, title: currentStrings.reportTitle, onClose: slideOnClose });
                        return;
                    }
                } catch {
                    // Fall through to MD
                }
            }

            // DEPRECATED fallback — only runs when rich HTML is unavailable
            // Do NOT extend this path. New slide work uses openRichSlideViewer() above.
            if (!source.mdUrl) return;
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
                title: currentStrings.reportTitle,
                mdBaseUrl,
                onClose: slideOnClose,
            });
        });

        reportBody.appendChild(reportTitle);
        reportBody.appendChild(reportDesc);
        reportBody.appendChild(slideBtn);
        reportCard.appendChild(reportBody);
        reportCol.appendChild(reportCard);
        fragment.appendChild(reportCol);

        containerEl.appendChild(fragment);
    }

    return { cacheDom, renderSynthesis };
}
