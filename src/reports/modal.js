import DOMPurify from 'dompurify';

import {
    buildMarkdownFetchCandidates,
    formatDate,
    hasText,
    looksLikeHtmlDocument,
    normalizeModalSources,
    normalizePdfBrowserUrl,
    parseFrontmatter,
    resolveFirstAvailablePdfUrl,
} from './data.js';

export function createReportsModalController({
    state,
    getStrings,
    setActiveDomainModalState,
}) {
    let markedParser = null;

    async function getMarked() {
        if (!markedParser) {
            const { marked } = await import('marked');
            marked.setOptions({ breaks: true, gfm: true });
            markedParser = marked;
        }
        return markedParser;
    }

    function ensureMdModalInstance() {
        if (!state.dom.mdModal || !globalThis.bootstrap?.Modal) return null;
        if (!state.mdModalInstance) {
            state.mdModalInstance = globalThis.bootstrap.Modal.getOrCreateInstance(state.dom.mdModal);
        }
        return state.mdModalInstance;
    }

    function isMdModalVisible() {
        return Boolean(state.dom.mdModal?.classList.contains('show'));
    }

    function setModalPdfButton(pdfUrl) {
        if (!state.dom.mdOpenPdf) return;
        const strings = getStrings(state.lang);
        const browserPdfUrl = normalizePdfBrowserUrl(pdfUrl);
        if (browserPdfUrl) {
            state.dom.mdOpenPdf.href = browserPdfUrl;
            state.dom.mdOpenPdf.textContent = strings.modalOpenPdf;
            state.dom.mdOpenPdf.classList.remove('disabled');
            state.dom.mdOpenPdf.setAttribute('aria-disabled', 'false');
        } else {
            state.dom.mdOpenPdf.href = '#';
            state.dom.mdOpenPdf.textContent = strings.modalPdfPending;
            state.dom.mdOpenPdf.classList.add('disabled');
            state.dom.mdOpenPdf.setAttribute('aria-disabled', 'true');
        }
    }

    function setMarkdownModalLoading({ title, pdfUrl = '' }) {
        const strings = getStrings(state.lang);

        if (state.dom.mdModalTitle) {
            state.dom.mdModalTitle.textContent = title || strings.modalTitleDefault;
        }
        if (state.dom.mdModalMeta) {
            state.dom.mdModalMeta.textContent = '';
        }
        if (state.dom.mdModalContent) {
            state.dom.mdModalContent.innerHTML = `
                <div class="d-flex align-items-center gap-2 text-body-secondary">
                    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span>${strings.modalLoading}</span>
                </div>
            `;
        }
        if (state.dom.mdCloseBtn) {
            state.dom.mdCloseBtn.textContent = strings.modalClose;
        }
        setModalPdfButton(pdfUrl);
    }

    async function openMarkdownModal({ mdUrl, title = '', pdfUrl = '', sources = [], modalContext = null }) {
        const modalSources = normalizeModalSources({ mdUrl, pdfUrl, sources });
        if (!modalSources.length) return;
        const firstSource = modalSources[0];

        if (modalContext?.type === 'domain') {
            setActiveDomainModalState(modalContext.domainId, modalContext.historyMode);
        }

        const modal = ensureMdModalInstance();
        if (!modal) {
            window.open(firstSource.mdUrl, '_blank', 'noopener');
            return;
        }

        const requestId = ++state.mdRequestId;
        const availablePdfUrlPromise = resolveFirstAvailablePdfUrl(modalSources);
        setMarkdownModalLoading({ title, pdfUrl: '' });
        modal.show();

        try {
            const marked = await getMarked();
            let raw = '';
            let lastError = null;
            let resolvedSource = firstSource;

            for (const source of modalSources) {
                const mdCandidates = buildMarkdownFetchCandidates(source.mdUrl);
                for (const candidateUrl of mdCandidates) {
                    try {
                        const response = await fetch(candidateUrl, { cache: 'no-store' });
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        const text = await response.text();
                        if (looksLikeHtmlDocument(text)) {
                            throw new Error('Unexpected HTML response for markdown source');
                        }
                        raw = text;
                        resolvedSource = source;
                        break;
                    } catch (error) {
                        lastError = error;
                    }
                }
                if (raw) break;
            }

            if (!raw) throw (lastError || new Error('No markdown source could be loaded'));

            const { meta, body } = parseFrontmatter(raw);
            const html = DOMPurify.sanitize(marked.parse(body || raw));
            const availablePdfUrl = await availablePdfUrlPromise;

            if (requestId !== state.mdRequestId) return;

            setModalPdfButton(availablePdfUrl);
            if (state.dom.mdModalContent) {
                state.dom.mdModalContent.innerHTML = `
                    <div class="md-article">
                        <div class="md-body">${html}</div>
                    </div>
                `;
            }

            const strings = getStrings(state.lang);
            const metaParts = [];
            const generatorModel = hasText(meta.generator_model) ? meta.generator_model.trim() : resolvedSource.generatorModel;
            const generated = hasText(meta.generated) ? meta.generated.trim() : resolvedSource.generated;
            if (generatorModel) metaParts.push(`${strings.modalModel}: ${generatorModel}`);
            if (generated) metaParts.push(`${strings.modalGenerated}: ${formatDate(generated)}`);
            if (state.dom.mdModalMeta) {
                state.dom.mdModalMeta.textContent = metaParts.join(' / ');
            }
        } catch (error) {
            console.warn('[reports] markdown load failed:', error);
            const availablePdfUrl = await availablePdfUrlPromise.catch(() => '');
            if (requestId !== state.mdRequestId) return;

            const strings = getStrings(state.lang);
            if (state.dom.mdModalMeta) {
                state.dom.mdModalMeta.textContent = '';
            }
            if (state.dom.mdModalContent) {
                const pendingMessage = state.lang === 'en' ? strings.modalPreparing : strings.modalError;
                state.dom.mdModalContent.innerHTML = `<p class="text-warning-emphasis mb-0">${pendingMessage}</p>`;
            }
            setModalPdfButton(availablePdfUrl);
        }
    }

    return {
        ensureMdModalInstance,
        isMdModalVisible,
        openMarkdownModal,
    };
}
