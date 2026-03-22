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

/**
 * Classify a slide section into a type for CSS styling.
 * Returns one of: slide-title, slide-overview, slide-table, slide-entry,
 * slide-conclusion, slide-patterns, slide-questions, slide-default.
 */
function classifySlide(section, index, total) {
    const text = section.textContent || '';
    const hasTable = section.querySelector('table') !== null;
    const hasList = section.querySelector('ul, ol') !== null;
    const paragraphs = section.querySelectorAll('p');
    const h2 = section.querySelector('h2');
    const heading = h2 ? h2.textContent : '';

    // First slide is always title
    if (index === 0) return 'slide-title';

    // Last slide is conclusion
    if (index === total - 1) return 'slide-conclusion';

    // Heading-based detection
    if (/概要|overview/i.test(heading) && hasList) return 'slide-overview';
    if (/結論|まとめ|conclusion/i.test(heading)) return 'slide-conclusion';
    if (/横断|パターン|pattern|cross/i.test(heading)) return 'slide-patterns';
    if (/未解決|open.*question|問い/i.test(heading)) return 'slide-questions';

    // Content-based detection
    if (hasTable) return 'slide-table';

    // Dense prose = entry slide (3+ paragraphs or long text)
    if (paragraphs.length >= 3 || text.length > 400) return 'slide-entry';

    // Bullet-heavy = overview-like
    if (hasList && paragraphs.length <= 1) return 'slide-overview';

    return 'slide-default';
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
    console.log('[slide-viewer] openSlideViewer called', { title, hasText: !!markdownText });
    if (!markdownText) return;

    try {
        if (!overlayNode) {
            overlayNode = createOverlay();
            console.log('[slide-viewer] overlay created');
        }

        const { body } = parseFrontmatter(markdownText);

        const slides = body.split(/\n---\n/).filter((s) => s.trim());
        console.log('[slide-viewer] slides parsed:', slides.length);

        const { marked } = await import('marked');
        marked.setOptions({ breaks: true, gfm: true });

        const slidesContainer = overlayNode.querySelector('.slides');
        slidesContainer.innerHTML = '';

        for (let i = 0; i < slides.length; i++) {
            const section = document.createElement('section');
            let parsedHtml = marked.parse(slides[i].trim());
            parsedHtml = resolveImageUrls(parsedHtml, mdBaseUrl);
            section.innerHTML = DOMPurify.sanitize(parsedHtml, { FORBID_TAGS: ['a'] });
            const slideType = classifySlide(section, i, slides.length);
            section.classList.add(slideType);
            slidesContainer.appendChild(section);
        }
        console.log('[slide-viewer] sections appended');

        overlayNode.classList.add('visible');
        console.log('[slide-viewer] overlay visible');

        const Reveal = (await import('reveal.js')).default;
        console.log('[slide-viewer] Reveal imported');

        if (revealInstance) {
            console.log('[slide-viewer] destroying old instance');
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
            transition: 'fade',
            transitionSpeed: 'default',
            backgroundTransition: 'fade',
            width: 960,
            height: 700,
        });

        await revealInstance.initialize();
        console.log('[slide-viewer] Reveal initialized');

        // Debug: inspect first slide state after init
        const firstSection = overlayNode.querySelector('.slides > section');
        if (firstSection) {
            const cs = window.getComputedStyle(firstSection);
            console.log('[slide-viewer] first section classes:', firstSection.className);
            console.log('[slide-viewer] first section computed:', {
                display: cs.display,
                opacity: cs.opacity,
                visibility: cs.visibility,
                width: cs.width,
                height: cs.height,
                position: cs.position,
                transform: cs.transform,
            });
        }
        const revealEl2 = overlayNode.querySelector('.reveal');
        if (revealEl2) {
            const cs2 = window.getComputedStyle(revealEl2);
            console.log('[slide-viewer] .reveal computed:', {
                display: cs2.display,
                width: cs2.width,
                height: cs2.height,
                overflow: cs2.overflow,
                position: cs2.position,
            });
        }
        const slidesEl = overlayNode.querySelector('.slides');
        if (slidesEl) {
            const cs3 = window.getComputedStyle(slidesEl);
            console.log('[slide-viewer] .slides computed:', {
                display: cs3.display,
                width: cs3.width,
                height: cs3.height,
                position: cs3.position,
                transform: cs3.transform,
            });
        }

        window.addEventListener('keydown', onKeyDown);
        console.log('[slide-viewer] ready');
    } catch (err) {
        console.error('[slide-viewer] ERROR:', err);
    }
}

export function closeSlideViewer() {
    console.log('[slide-viewer] closeSlideViewer called', new Error().stack);
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
