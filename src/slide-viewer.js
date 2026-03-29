let overlayNode = null;
let slidesState = [];
let currentSlideIndex = 0;
let previousBodyOverflow = '';
let onCloseCallback = null;

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
