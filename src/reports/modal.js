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
    setActiveGuideState,
    setActiveGenericModalState,
    updateGuideHistoryEntry,
    updateGenericHistoryEntry,
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
        if (!state.modal.mdModalInstance) {
            state.modal.mdModalInstance = globalThis.bootstrap.Modal.getOrCreateInstance(state.dom.mdModal);
        }
        return state.modal.mdModalInstance;
    }

    function isMdModalVisible() {
        return Boolean(state.dom.mdModal?.classList.contains('show'));
    }

    function setModalPdfButton(pdfUrl) {
        if (!state.dom.mdOpenPdf) return;
        const strings = getStrings(state.config.lang);
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
        const strings = getStrings(state.config.lang);

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
        setModalPdfButton(pdfUrl);
    }

    async function openMarkdownModal({ mdUrl, title = '', pdfUrl = '', sources = [], modalContext = null }) {
        const modalSources = normalizeModalSources({ mdUrl, pdfUrl, sources });
        if (!modalSources.length) return;
        const firstSource = modalSources[0];

        if (modalContext?.type === 'domain') {
            setActiveDomainModalState(modalContext.domainId, modalContext.historyMode);
        } else if (modalContext?.type === 'guide') {
            if (modalContext.historyMode === 'push') {
                updateGuideHistoryEntry(modalContext.guideKey, { method: 'push', mode: 'push' });
            }
            setActiveGuideState(modalContext.guideKey, modalContext.historyMode);
        } else if (modalContext?.type === 'generic') {
            if (modalContext.historyMode === 'push') {
                updateGenericHistoryEntry(modalContext.modalKey, { method: 'push', mode: 'push' });
            }
            setActiveGenericModalState(modalContext.modalKey, modalContext.historyMode);
        }

        const modal = ensureMdModalInstance();
        if (!modal) {
            window.open(firstSource.mdUrl, '_blank', 'noopener');
            return;
        }

        const requestId = ++state.modal.mdRequestId;
        const availablePdfUrlPromise = resolveFirstAvailablePdfUrl(modalSources);
        setMarkdownModalLoading({ title, pdfUrl: '' });
        modal.show();

        try {
            const marked = await getMarked();
            let raw = '';
            let lastError = null;
            let resolvedSource = firstSource;
            let resolvedMdUrl = '';

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
                        resolvedMdUrl = candidateUrl;
                        break;
                    } catch (error) {
                        lastError = error;
                    }
                }
                if (raw) break;
            }

            if (!raw) throw (lastError || new Error('No markdown source could be loaded'));

            const { meta, body } = parseFrontmatter(raw);
            // 実際に取得できた Markdown URL を基準に相対パスを解決する。
            const mdBaseUrl = resolvedMdUrl ? resolvedMdUrl.replace(/\/[^/]*$/, '/') : '';
            let parsedHtml = marked.parse(body || raw);
            if (mdBaseUrl) {
                parsedHtml = parsedHtml.replace(/<img\s+([^>]*?)src="(?!https?:\/\/)([^"]+)"/g, (match, pre, relPath) => {
                    const absUrl = new URL(relPath, mdBaseUrl).href;
                    return `<img ${pre}src="${absUrl}"`;
                });
            }
            const html = DOMPurify.sanitize(parsedHtml, { FORBID_TAGS: ['a'] });
            const availablePdfUrl = await availablePdfUrlPromise;

            if (requestId !== state.modal.mdRequestId) return;

            setModalPdfButton(availablePdfUrl);
            if (state.dom.mdModalContent) {
                state.dom.mdModalContent.innerHTML = `
                    <div class="md-article">
                        <div class="md-body">${html}</div>
                    </div>
                `;

                // モーダル内リンク・画像クリック処理（重複登録防止）
                if (!state.dom.mdModalContent._contentClickBound) {
                    state.dom.mdModalContent._contentClickBound = true;
                    state.dom.mdModalContent.addEventListener('click', (event) => {
                        const img = event.target.closest('.md-body img');
                        if (img) {
                            event.preventDefault();
                            event.stopPropagation();
                            const overlay = document.createElement('div');
                            overlay.dataset.role = 'img-overlay';
                            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:2000;';
                            const closeBtn = document.createElement('button');
                            closeBtn.textContent = '✕';
                            closeBtn.style.cssText = 'position:absolute;top:16px;right:24px;background:none;border:none;color:#fff;font-size:32px;cursor:pointer;z-index:2001;line-height:1;padding:8px;';
                            const removeOverlay = () => { overlay.remove(); document.removeEventListener('keydown', onEsc, true); };
                            closeBtn.addEventListener('click', (e) => { e.stopPropagation(); removeOverlay(); });
                            const fullImg = document.createElement('img');
                            fullImg.src = img.src;
                            fullImg.style.cssText = 'max-width:90%;max-height:90%;border-radius:4px;cursor:default;';
                            fullImg.addEventListener('click', (e) => e.stopPropagation());
                            overlay.appendChild(closeBtn);
                            overlay.appendChild(fullImg);
                            overlay.addEventListener('click', (e) => { if (e.target === overlay) removeOverlay(); });
                            const onEsc = (e) => { if (e.key === 'Escape') { removeOverlay(); e.stopImmediatePropagation(); } };
                            document.addEventListener('keydown', onEsc, true);
                            document.body.appendChild(overlay);
                            return;
                        }

                    });
                }
            }

            const strings = getStrings(state.config.lang);
            const metaParts = [];
            const generatorModel = hasText(meta.generator_model) ? meta.generator_model.trim() : resolvedSource.generatorModel;
            const generated = hasText(meta.generated) ? meta.generated.trim() : resolvedSource.generated;
            const guideDate = state.data.guidesGeneratedAt || '';
            if (generatorModel) metaParts.push(`${strings.modalModel}: ${generatorModel}`);
            if (generated) {
                metaParts.push(`${strings.modalGenerated}: ${formatDate(generated)}`);
            } else if (guideDate) {
                metaParts.push(`${strings.modalGenerated}: ${formatDate(guideDate)}`);
            }
            if (state.dom.mdModalMeta) {
                state.dom.mdModalMeta.textContent = metaParts.join(' / ');
            }
        } catch (error) {
            console.warn('[reports] markdown load failed:', error);
            const availablePdfUrl = await availablePdfUrlPromise.catch(() => '');
            if (requestId !== state.modal.mdRequestId) return;

            const strings = getStrings(state.config.lang);
            if (state.dom.mdModalMeta) {
                state.dom.mdModalMeta.textContent = '';
            }
            if (state.dom.mdModalContent) {
                const pendingMessage = state.config.lang === 'en' ? strings.modalPreparing : strings.modalError;
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
