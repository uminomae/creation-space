// IMPORTANT: openSlideViewer() is DEPRECATED (legacy MD fallback only).
// New code MUST use openRichSlideViewer() which displays pre-generated
// rich HTML via iframe. Do NOT call openSlideViewer() for new features.
// See: .claude/skills/rich-slides/SKILL.md

import DOMPurify from 'dompurify';

let overlayNode = null;
let slidesState = [];
let currentSlideIndex = 0;
let previousBodyOverflow = '';
let onCloseCallback = null;
function parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: text.trim() };

    const meta = {};
    match[1].split('\n').forEach((line) => {
        const idx = line.indexOf(':');
        if (idx <= 0) return;
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        meta[key] = val;
    });

    return { meta, body: match[2].trim() };
}

function resolveImageUrls(html, mdBaseUrl) {
    if (!mdBaseUrl) return html;
    return html.replace(
        /<img\s+([^>]*?)src="(?!https?:\/\/)([^"]+)"/g,
        (match, pre, relPath) => {
            const absUrl = new URL(relPath, mdBaseUrl).href;
            return `<img ${pre}src="${absUrl}"`;
        }
    );
}

async function inlineSvgImages(root) {
    if (!root) return;

    const images = Array.from(root.querySelectorAll('img'));
    await Promise.all(images.map(async (img) => {
        const src = img.getAttribute('src') || '';
        if (!/\.svg(?:$|[?#])/i.test(src)) return;

        try {
            const response = await fetch(src, { cache: 'no-store' });
            if (!response.ok) return;
            const svgText = await response.text();
            if (!svgText.trim().startsWith('<svg') && !svgText.trim().startsWith('<?xml')) return;
            const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml');
            const svgNode = parsed.documentElement;
            if (!svgNode || svgNode.nodeName.toLowerCase() === 'parsererror') return;

            const wrapper = document.createElement('figure');
            wrapper.className = 'slide-inline-svg';
            const alt = img.getAttribute('alt') || '';
            if (alt) {
                wrapper.setAttribute('aria-label', alt);
                wrapper.setAttribute('role', 'img');
            }

            const imported = document.importNode(svgNode, true);
            imported.removeAttribute('width');
            imported.removeAttribute('height');
            wrapper.appendChild(imported);
            img.replaceWith(wrapper);
        } catch (error) {
            console.warn('[slide-viewer] svg inline failed:', src, error);
        }
    }));
}

/**
 * Search for a domain SVG file matching the given base path prefix.
 * The SVG files follow the pattern: domain-D01-mathematics.svg
 * Since we only know the domain ID (e.g. "D01"), we list the directory
 * and find the first match.
 * @param {string} basePath - e.g. "assets/svg/domains/domain-D01"
 * @returns {Promise<string|null>} Full SVG path or null
 */
async function findDomainSvg(basePath) {
    // Try a HEAD request with a wildcard-style approach:
    // Fetch the directory listing is not reliable, so we try the known path pattern.
    // The basePath is like "assets/svg/domains/domain-D01"
    // We need to find "assets/svg/domains/domain-D01-*.svg"
    // Strategy: fetch the directory index and parse, or try common suffixes.
    // For robustness, we attempt a fetch of the basePath directory to find matches.
    try {
        const dirPath = basePath.replace(/\/[^/]*$/, '/');
        const prefix = basePath.split('/').pop(); // e.g. "domain-D01"
        const resp = await fetch(dirPath);
        if (!resp.ok) return null;
        const html = await resp.text();
        // Parse links from directory listing or HTML page
        const linkPattern = new RegExp(`href="([^"]*${prefix}[^"]*\\.svg)"`, 'i');
        const match = html.match(linkPattern);
        if (match) {
            const filename = match[1];
            // Handle both absolute and relative hrefs
            if (filename.startsWith('http')) return filename;
            return dirPath + filename.replace(/^\.\//, '');
        }
    } catch {
        // Directory listing not available
    }
    return null;
}

/**
 * Inject an SVG diagram into a slide based on its type.
 * @param {HTMLElement} page - Slide page element
 * @param {string} slideType - Return value of classifySlide()
 * @param {string} domainId - Domain ID (e.g. "D01")
 */
async function injectDiagramIfAvailable(page, slideType, domainId) {
    // Slide types that do not need diagrams
    const skipTypes = ['slide-entry', 'slide-questions', 'slide-visual', 'slide-default'];
    if (skipTypes.includes(slideType)) return;

    // Skip text-heavy slides (over 400 characters)
    const textLen = (page.textContent || '').length;
    if (textLen > 400) return;

    // Slide type to SVG path mapping
    const svgMap = {
        'slide-title': `assets/svg/domains/domain-${domainId}`,
        'slide-overview': `assets/svg/domains/domain-${domainId}`,
        'slide-patterns': `assets/svg/domains/domain-${domainId}`,
        'slide-table': `assets/svg/domains/domain-${domainId}`,
        'slide-conclusion': `assets/svg/domains/domain-${domainId}`,
    };

    const basePath = svgMap[slideType];
    if (!basePath) return;

    try {
        const svgPath = await findDomainSvg(basePath);
        if (!svgPath) return;

        const res = await fetch(svgPath);
        if (!res.ok) return;

        const svgText = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        if (doc.querySelector('parsererror')) return;

        const figure = document.createElement('figure');
        figure.className = 'slide-inline-svg';
        figure.appendChild(doc.documentElement);

        // slide-title uses thumbnail placement (bottom-right), others append at end
        if (slideType === 'slide-title') {
            figure.classList.add('slide-diagram-thumbnail');
        }
        page.appendChild(figure);
    } catch {
        // SVG injection failure is silent (fallback: no diagram)
    }
}

function classifySlide(page, index, total) {
    const text = page.textContent || '';
    const hasTable = page.querySelector('table') !== null;
    const hasList = page.querySelector('ul, ol') !== null;
    const hasImage = page.querySelector('img') !== null;
    const paragraphs = page.querySelectorAll('p');
    const h2 = page.querySelector('h2');
    const heading = h2 ? h2.textContent : '';

    if (index === 0) return 'slide-title';
    if (index === total - 1) return 'slide-conclusion';
    if (hasImage && text.length <= 80) return 'slide-visual';
    if (/概要|overview/i.test(heading) && hasList) return 'slide-overview';
    if (/結論|まとめ|conclusion/i.test(heading)) return 'slide-conclusion';
    if (/横断|パターン|pattern|cross/i.test(heading)) return 'slide-patterns';
    if (/未解決|open.*question|問い/i.test(heading)) return 'slide-questions';
    if (hasTable) return 'slide-table';
    if (paragraphs.length >= 3 || text.length > 400) return 'slide-entry';
    if (hasList && paragraphs.length <= 1) return 'slide-overview';
    return 'slide-default';
}

function getOverlayPart(selector) {
    return overlayNode ? overlayNode.querySelector(selector) : null;
}

function setBodyScrollLock(locked) {
    if (!document?.body) return;
    if (locked) {
        previousBodyOverflow = document.body.style.overflow || '';
        document.body.style.overflow = 'hidden';
        return;
    }
    document.body.style.overflow = previousBodyOverflow;
    previousBodyOverflow = '';
}

function getFullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
}

function requestElementFullscreen(element) {
    if (!element) return Promise.reject(new Error('missing fullscreen target'));
    if (typeof element.requestFullscreen === 'function') {
        return element.requestFullscreen();
    }
    if (typeof element.webkitRequestFullscreen === 'function') {
        element.webkitRequestFullscreen();
        return Promise.resolve();
    }
    return Promise.reject(new Error('fullscreen unsupported'));
}

function exitFullscreenMode() {
    if (typeof document.exitFullscreen === 'function') {
        return document.exitFullscreen();
    }
    if (typeof document.webkitExitFullscreen === 'function') {
        document.webkitExitFullscreen();
    }
    return Promise.resolve();
}

function isOverlayFullscreen() {
    return getFullscreenElement() === overlayNode;
}

function updateFullscreenUi() {
    const button = getOverlayPart('.slide-viewer-fullscreen');
    if (!button) return;

    const supported = Boolean(
        overlayNode
        && (typeof overlayNode.requestFullscreen === 'function'
            || typeof overlayNode.webkitRequestFullscreen === 'function')
    );
    if (!supported) {
        button.hidden = true;
        return;
    }

    button.hidden = false;
    const active = isOverlayFullscreen();
    button.textContent = active ? '⤢' : '⛶';
    button.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
}

async function toggleFullscreen() {
    if (!overlayNode) return;

    try {
        if (isOverlayFullscreen()) {
            await exitFullscreenMode();
        } else {
            await requestElementFullscreen(overlayNode);
        }
    } catch {
        // Fullscreen is best-effort. Keep the viewer usable even if the API fails.
    } finally {
        updateFullscreenUi();
    }
}

function updateSlideUi(title = '') {
    if (!overlayNode || !slidesState.length) return;

    const titleNode = getOverlayPart('.slide-viewer-title');
    const countNode = getOverlayPart('.slide-viewer-count');
    const prevButton = getOverlayPart('.slide-viewer-nav-prev');
    const nextButton = getOverlayPart('.slide-viewer-nav-next');

    slidesState.forEach((page, index) => {
        const active = index === currentSlideIndex;
        page.classList.toggle('is-active', active);
        page.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    if (titleNode) {
        titleNode.textContent = title;
    }
    if (countNode) {
        countNode.textContent = `${currentSlideIndex + 1} / ${slidesState.length}`;
    }
    if (prevButton) {
        prevButton.disabled = currentSlideIndex === 0;
    }
    if (nextButton) {
        nextButton.disabled = currentSlideIndex === slidesState.length - 1;
    }
}

function moveSlide(step) {
    if (!slidesState.length) return;
    const nextIndex = Math.min(slidesState.length - 1, Math.max(0, currentSlideIndex + step));
    if (nextIndex === currentSlideIndex) return;
    currentSlideIndex = nextIndex;
    updateSlideUi(getOverlayPart('.slide-viewer-title')?.textContent || '');
}

function createOverlay() {
    const node = document.createElement('div');
    node.id = 'slide-viewer-overlay';
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-modal', 'true');
    node.innerHTML = `
        <div class="slide-viewer-shell">
            <button class="slide-viewer-close" aria-label="Close slides">&times;</button>
            <button class="slide-viewer-fullscreen" aria-label="Enter fullscreen" aria-pressed="false">⛶</button>
            <div class="slide-viewer-frame">
                <div class="slide-viewer-stage"></div>
            </div>
            <div class="slide-viewer-toolbar">
                <button class="slide-viewer-nav slide-viewer-nav-prev" aria-label="Previous slide">Prev</button>
                <div class="slide-viewer-meta">
                    <div class="slide-viewer-title"></div>
                    <div class="slide-viewer-count"></div>
                </div>
                <button class="slide-viewer-nav slide-viewer-nav-next" aria-label="Next slide">Next</button>
            </div>
        </div>
    `;

    node.querySelector('.slide-viewer-close').addEventListener('click', closeSlideViewer);
    node.querySelector('.slide-viewer-fullscreen').addEventListener('click', () => {
        toggleFullscreen();
    });
    node.querySelector('.slide-viewer-nav-prev').addEventListener('click', () => moveSlide(-1));
    node.querySelector('.slide-viewer-nav-next').addEventListener('click', () => moveSlide(1));
    node.addEventListener('click', (event) => {
        if (event.target === node) {
            closeSlideViewer();
        }
    });

    // ESC handler for non-iframe cases (MD legacy slides, future extensions).
    // NOTE (cs#198): This does NOT cover iframe-focused state — iframe has
    // its own ESC handler injected in openRichSlideViewer().
    // Do NOT remove during refactoring.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && node.classList.contains('visible')) {
            event.stopPropagation();
            closeSlideViewer();
        }
    }, true);

    // Cross-origin ESC fallback (cs#198): rich HTML slides post a message
    // when ESC is pressed inside them. This covers file:// → https:// cases
    // where contentDocument is inaccessible.
    // Do NOT remove during refactoring.
    window.addEventListener('message', (event) => {
        if (event.data?.type === 'slide-escape' && node.classList.contains('visible')) {
            closeSlideViewer();
        }
    });
    document.addEventListener('fullscreenchange', updateFullscreenUi);
    document.addEventListener('webkitfullscreenchange', updateFullscreenUi);

    document.body.appendChild(node);
    updateFullscreenUi();
    return node;
}

function onKeyDown(event) {
    // ESC is handled by the capture-phase handler in createOverlay() (cs#198).
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        moveSlide(-1);
        return;
    }
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        moveSlide(1);
    }
}

/**
 * @deprecated LEGACY fallback only. Do NOT use for new features.
 * Use openRichSlideViewer() instead. This function exists solely as a
 * fallback when rich HTML is unavailable (404 / network error).
 */
export async function openSlideViewer({ markdownText, title = '', mdBaseUrl, onClose = null }) {
    if (!markdownText) return;

    try {
        onCloseCallback = typeof onClose === 'function' ? onClose : null;

        if (!overlayNode) {
            overlayNode = createOverlay();
        }

        const { meta, body } = parseFrontmatter(markdownText);
        const slideChunks = body.split(/\n---\n/).filter((chunk) => chunk.trim());
        if (!slideChunks.length) return;

        const { marked } = await import('marked');
        marked.setOptions({ breaks: true, gfm: true });

        const stage = getOverlayPart('.slide-viewer-stage');
        if (!stage) return;

        stage.innerHTML = '';
        slidesState = [];

        for (const [index, chunk] of slideChunks.entries()) {
            const page = document.createElement('article');
            page.className = 'slide-viewer-page';
            page.setAttribute('aria-hidden', 'true');

            let parsedHtml = marked.parse(chunk.trim());
            parsedHtml = resolveImageUrls(parsedHtml, mdBaseUrl);

            const content = document.createElement('div');
            content.className = 'slide-content';
            content.innerHTML = DOMPurify.sanitize(parsedHtml, { FORBID_TAGS: ['a'] });
            await inlineSvgImages(content);

            const slideType = classifySlide(content, index, slideChunks.length);
            page.classList.add(slideType);
            page.appendChild(content);
            stage.appendChild(page);
            slidesState.push(page);

            // Attempt SVG diagram injection based on slide type
            // Extract domainId from frontmatter, title, or mdBaseUrl (e.g. "D01")
            const domainId = meta.domain_id
                || (title.match(/\b(D\d{2})\b/) || [])[1]
                || (mdBaseUrl && (mdBaseUrl.match(/\b(D\d{2})\b/) || [])[1])
                || '';
            if (domainId) {
                await injectDiagramIfAvailable(page, slideType, domainId);
            }
        }

        currentSlideIndex = 0;
        overlayNode.classList.add('visible');
        overlayNode.setAttribute('aria-label', title || meta.title || 'Slides');
        setBodyScrollLock(true);
        updateSlideUi(title || meta.title || '');
        updateFullscreenUi();
        window.addEventListener('keydown', onKeyDown);
    } catch (err) {
        console.error('[slide-viewer] ERROR:', err);
    }
}

export function closeSlideViewer() {
    window.removeEventListener('keydown', onKeyDown);
    if (isOverlayFullscreen()) {
        void exitFullscreenMode();
    }
    setBodyScrollLock(false);

    if (overlayNode) {
        overlayNode.classList.remove('visible');
        const stage = getOverlayPart('.slide-viewer-stage');
        if (stage) {
            stage.innerHTML = '';
        }
        // Restore toolbar visibility when closing rich mode
        const toolbar = getOverlayPart('.slide-viewer-toolbar');
        if (toolbar) {
            toolbar.style.display = '';
        }
    }

    slidesState = [];
    currentSlideIndex = 0;
    updateFullscreenUi();

    if (onCloseCallback) {
        const cb = onCloseCallback;
        onCloseCallback = null;
        cb();
    }
}

/**
 * Open a pre-generated rich HTML slide deck in the viewer modal.
 *
 * The rich HTML is self-contained (CSS + JS inlined) and has its own
 * navigation, so we display it via iframe and hide the parent toolbar.
 *
 * @param {Object} options
 * @param {string} options.htmlUrl - URL of the rich HTML slide file
 * @param {string} [options.title] - Title for the overlay aria-label
 */
export function openRichSlideViewer({ htmlUrl, title = '', onClose = null }) {
    if (!htmlUrl) return;

    try {
        onCloseCallback = typeof onClose === 'function' ? onClose : null;

        if (!overlayNode) {
            overlayNode = createOverlay();
        }

        const stage = getOverlayPart('.slide-viewer-stage');
        if (!stage) return;

        stage.innerHTML = '';
        slidesState = [];

        // Hide parent toolbar — the rich HTML has its own nav
        const toolbar = getOverlayPart('.slide-viewer-toolbar');
        if (toolbar) {
            toolbar.style.display = 'none';
        }

        // Create iframe that fills the frame
        const iframe = document.createElement('iframe');
        iframe.src = htmlUrl;
        iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:inherit;';
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy');
        stage.appendChild(iframe);

        // ESC handler: inject into iframe's contentDocument after load (cs#198).
        // IMPORTANT: iframe is a separate browsing context — keydown events
        // inside iframe do NOT reach the parent document (not even in capture
        // phase). We must register directly on iframe.contentDocument.
        // Same-origin only; cross-origin silently falls back to close button.
        // Do NOT remove this handler during refactoring.
        iframe.addEventListener('load', () => {
            try {
                iframe.contentDocument.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        closeSlideViewer();
                    }
                });
            } catch (_) {
                // Cross-origin (e.g. file:// opening https:// iframe):
                // contentDocument is inaccessible. Use postMessage fallback.
                // The rich HTML slides call parent.postMessage({type:'slide-escape'})
                // when ESC is pressed inside them.
                console.warn('[slide-viewer] cross-origin iframe — ESC uses postMessage fallback');
            }
        });

        overlayNode.classList.add('visible');
        overlayNode.setAttribute('aria-label', title || 'Rich Slides');
        setBodyScrollLock(true);
        updateFullscreenUi();
    } catch (err) {
        console.error('[slide-viewer] rich slide ERROR:', err);
    }
}
