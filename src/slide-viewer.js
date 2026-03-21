import DOMPurify from 'dompurify';

let overlayNode = null;
let revealInstance = null;

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

function createOverlay() {
    const node = document.createElement('div');
    node.id = 'slide-viewer-overlay';
    node.innerHTML = `
        <button class="slide-viewer-close" aria-label="Close slides">&times;</button>
        <div class="reveal">
            <div class="slides"></div>
        </div>
    `;

    node.querySelector('.slide-viewer-close').addEventListener('click', closeSlideViewer);

    document.body.appendChild(node);
    return node;
}

function onKeyDown(event) {
    if (event.key === 'Escape') {
        closeSlideViewer();
    }
}

export async function openSlideViewer({ markdownText, title, mdBaseUrl }) {
    if (!markdownText) return;

    if (!overlayNode) {
        overlayNode = createOverlay();
    }

    const { body } = parseFrontmatter(markdownText);

    const slides = body.split(/\n---\n/).filter((s) => s.trim());

    const { marked } = await import('marked');
    marked.setOptions({ breaks: true, gfm: true });

    const slidesContainer = overlayNode.querySelector('.slides');
    slidesContainer.innerHTML = '';

    for (const slideContent of slides) {
        const section = document.createElement('section');
        let parsedHtml = marked.parse(slideContent.trim());
        parsedHtml = resolveImageUrls(parsedHtml, mdBaseUrl);
        section.innerHTML = DOMPurify.sanitize(parsedHtml, { FORBID_TAGS: ['a'] });
        slidesContainer.appendChild(section);
    }

    overlayNode.classList.add('visible');

    const Reveal = (await import('reveal.js')).default;

    if (revealInstance) {
        revealInstance.destroy();
        revealInstance = null;
    }

    const revealEl = overlayNode.querySelector('.reveal');

    revealInstance = new Reveal(revealEl, {
        hash: false,
        history: false,
        controls: true,
        progress: true,
        slideNumber: true,
        embedded: true,
        keyboard: true,
        overview: false,
        center: true,
        transition: 'slide',
        width: 960,
        height: 700,
    });

    await revealInstance.initialize();

    window.addEventListener('keydown', onKeyDown);
}

export function closeSlideViewer() {
    window.removeEventListener('keydown', onKeyDown);

    if (revealInstance) {
        revealInstance.destroy();
        revealInstance = null;
    }

    if (overlayNode) {
        overlayNode.classList.remove('visible');
        const slidesContainer = overlayNode.querySelector('.slides');
        if (slidesContainer) {
            slidesContainer.innerHTML = '';
        }
    }
}
