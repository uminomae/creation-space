import DOMPurify from 'dompurify';

let overlayNode = null;
let slidesState = [];
let currentSlideIndex = 0;
let previousBodyOverflow = '';
const DOMAIN_VISUAL_ASSET_MAP = Object.freeze({
    D01: 'domain-D01-mathematics',
    D02: 'domain-D02-physics',
    D03: 'domain-D03-chemistry',
    D04: 'domain-D04-evolutionary-biology',
    D05: 'domain-D05-earth-science',
    D06: 'domain-D06-astronomy',
    D07: 'domain-D07-engineering',
    D08: 'domain-D08-neuroscience',
    D09: 'domain-D09-life-science',
    D10: 'domain-D10-immunology',
    D11: 'domain-D11-pharmacology',
    D12: 'domain-D12-ecology',
    D13: 'domain-D13-philosophy',
    D14: 'domain-D14-clinical-psychology',
    D15: 'domain-D15-aesthetics',
    D16: 'domain-D16-history',
    D17: 'domain-D17-linguistics',
    D18: 'domain-D18-sociology',
    D19: 'domain-D19-literary-studies',
    D20: 'domain-D20-law-politics',
    D21: 'domain-D21-economics',
    D22: 'domain-D22-business-management',
    D23: 'domain-D23-developmental-psychology',
    D24: 'domain-D24-religion',
    D25: 'domain-D25-anthropology',
    D26: 'domain-D26-music',
    D27: 'domain-D27-architecture',
    D28: 'domain-D28-improvisation',
    D29: 'domain-D29-complexity',
    D30: 'domain-D30-cognitive-science',
});

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

function buildLocalAssetUrl(relativePath) {
    try {
        return new URL(relativePath, window.location.href).href;
    } catch {
        return relativePath;
    }
}

function buildDomainDiagramMarkdown(meta = {}, title = '') {
    const source = typeof meta.source === 'string' ? meta.source : '';
    const matched = source.match(/domain-(D\d+)-/i);
    if (!matched) return '';
    const domainId = matched[1].toUpperCase();
    const assetBaseName = DOMAIN_VISUAL_ASSET_MAP[domainId];
    if (!assetBaseName) return '';

    const imageUrl = buildLocalAssetUrl(`./assets/svg/domains/${assetBaseName}.svg`);
    const alt = `${title || domainId} の構造対応図`;
    return `## 構造対応図\n\n![${alt}](${imageUrl})`;
}

function injectFallbackDiagramSlide(slideChunks, meta = {}, title = '') {
    if (!Array.isArray(slideChunks) || !slideChunks.length) return slideChunks;
    const hasImageReference = slideChunks.some((chunk) => /!\[[^\]]*\]\([^)]+\)|<img\b/i.test(chunk));
    if (hasImageReference) return slideChunks;

    const diagramSlide = buildDomainDiagramMarkdown(meta, title);
    if (!diagramSlide) return slideChunks;

    const nextChunks = [...slideChunks];
    nextChunks.splice(Math.min(1, nextChunks.length), 0, diagramSlide);
    return nextChunks;
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
    node.querySelector('.slide-viewer-nav-prev').addEventListener('click', () => moveSlide(-1));
    node.querySelector('.slide-viewer-nav-next').addEventListener('click', () => moveSlide(1));
    node.addEventListener('click', (event) => {
        if (event.target === node) {
            closeSlideViewer();
        }
    });

    document.body.appendChild(node);
    return node;
}

function onKeyDown(event) {
    if (event.key === 'Escape') {
        closeSlideViewer();
        return;
    }
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

export async function openSlideViewer({ markdownText, title = '', mdBaseUrl }) {
    if (!markdownText) return;

    try {
        if (!overlayNode) {
            overlayNode = createOverlay();
        }

        const { meta, body } = parseFrontmatter(markdownText);
        const rawChunks = body.split(/\n---\n/).filter((chunk) => chunk.trim());
        const slideChunks = injectFallbackDiagramSlide(rawChunks, meta, title || meta.title || '');
        if (!slideChunks.length) return;

        const { marked } = await import('marked');
        marked.setOptions({ breaks: true, gfm: true });

        const stage = getOverlayPart('.slide-viewer-stage');
        if (!stage) return;

        stage.innerHTML = '';
        slidesState = slideChunks.map((chunk, index) => {
            const page = document.createElement('article');
            page.className = 'slide-viewer-page';
            page.setAttribute('aria-hidden', 'true');

            let parsedHtml = marked.parse(chunk.trim());
            parsedHtml = resolveImageUrls(parsedHtml, mdBaseUrl);

            const content = document.createElement('div');
            content.className = 'slide-content';
            content.innerHTML = DOMPurify.sanitize(parsedHtml, { FORBID_TAGS: ['a'] });

            page.classList.add(classifySlide(content, index, slideChunks.length));
            page.appendChild(content);
            stage.appendChild(page);
            return page;
        });

        currentSlideIndex = 0;
        overlayNode.classList.add('visible');
        overlayNode.setAttribute('aria-label', title || meta.title || 'Slides');
        setBodyScrollLock(true);
        updateSlideUi(title || meta.title || '');
        window.addEventListener('keydown', onKeyDown);
    } catch (err) {
        console.error('[slide-viewer] ERROR:', err);
    }
}

export function closeSlideViewer() {
    window.removeEventListener('keydown', onKeyDown);
    setBodyScrollLock(false);

    if (overlayNode) {
        overlayNode.classList.remove('visible');
        const stage = getOverlayPart('.slide-viewer-stage');
        if (stage) {
            stage.innerHTML = '';
        }
    }

    slidesState = [];
    currentSlideIndex = 0;
}
