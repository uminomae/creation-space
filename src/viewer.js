import DOMPurify from 'dompurify';
import { normalizeLang } from './i18n.js';
import { dict } from './i18n/dict.js';

let markedParser = null;
let viewerNode = null;
let isOpen = false;

async function getMarked() {
    if (!markedParser) {
        const { marked } = await import('marked');
        marked.setOptions({ breaks: true, gfm: true });
        markedParser = marked;
    }
    return markedParser;
}

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

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatDate(isoStr) {
    if (!isoStr) return '';
    const match = String(isoStr).match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : String(isoStr);
}

function getViewerLang() {
    return normalizeLang(document.documentElement?.lang);
}

function getViewerStrings() {
    return dict[getViewerLang()]?.viewer || dict.ja.viewer;
}

function buildSourceFallbackText(label, lang, strings) {
    const safeLabel = String(label || '').trim();
    if (!safeLabel) return strings.openReference;
    return strings.openReferenceWithLabel
        ? strings.openReferenceWithLabel.replace('{label}', safeLabel)
        : strings.openReference;
}

function createViewer() {
    const strings = getViewerStrings();
    const node = document.createElement('div');
    node.id = 'kesson-viewer';
    node.innerHTML = `
        <div class="viewer-glass">
            <button class="viewer-close" aria-label="${escapeHtml(strings.closeAria)}">×</button>
            <div class="viewer-content"></div>
        </div>
    `;

    document.body.appendChild(node);

    node.querySelector('.viewer-close')?.addEventListener('click', closeViewer);
    node.addEventListener('click', (event) => {
        if (event.target === node) closeViewer();
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) closeViewer();
    });

    return node;
}

export function openViewer(content) {
    if (!viewerNode) viewerNode = createViewer();

    const closeButton = viewerNode.querySelector('.viewer-close');
    if (closeButton instanceof HTMLButtonElement) {
        closeButton.setAttribute('aria-label', getViewerStrings().closeAria);
    }

    const contentEl = viewerNode.querySelector('.viewer-content');
    if (!contentEl) return;

    contentEl.className = 'viewer-content';
    contentEl.innerHTML = DOMPurify.sanitize(content);

    requestAnimationFrame(() => {
        viewerNode.classList.add('visible');
        requestAnimationFrame(() => {
            viewerNode.classList.add('open');
        });
    });
    isOpen = true;
}

export function closeViewer() {
    if (!viewerNode) return;
    viewerNode.classList.remove('open');

    setTimeout(() => {
        viewerNode.classList.remove('visible');
        const contentEl = viewerNode.querySelector('.viewer-content');
        if (contentEl) {
            contentEl.className = 'viewer-content';
            contentEl.innerHTML = '';
        }
        isOpen = false;
    }, 500);
}

export function isViewerOpen() {
    return isOpen;
}

export async function openDraftViewer(draftUrl, label, sourceUrl = '') {
    if (!draftUrl) return;
    const lang = getViewerLang();
    const strings = getViewerStrings();

    openViewer(`
        <div class="md-loading">
            <div class="md-loading-dot"></div>
        </div>
    `);

    try {
        const [res, marked] = await Promise.all([
            fetch(draftUrl),
            getMarked(),
        ]);

        if (!res.ok) throw new Error(`${res.status}`);
        const raw = await res.text();

        if (raw.trim().startsWith('<!') || raw.trim().startsWith('<html')) {
            throw new Error('Got HTML instead of markdown');
        }

        const { meta, body } = parseFrontmatter(raw);
        const html = DOMPurify.sanitize(marked.parse(body));

        const model = meta.generator_model || '';
        const generated = formatDate(meta.generated);
        const provenanceParts = [];
        if (model) provenanceParts.push(`${strings.generatedBy} ${escapeHtml(model)}`);
        if (generated) provenanceParts.push(escapeHtml(generated));
        const provenanceHtml = provenanceParts.length
            ? `<div class="md-provenance">${provenanceParts.join(' · ')}</div>`
            : '';

        const sourceLinkHtml = sourceUrl
            ? `
                <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener" class="md-pdf-link">
                    ${escapeHtml(strings.openReference)} ↓
                </a>
            `
            : '';

        const draftLinkHtml = `
            <a href="${escapeHtml(draftUrl)}" target="_blank" rel="noopener" class="md-pdf-link">
                ${escapeHtml(strings.openDraft)} ↓
            </a>
        `;

        openViewer(`
            <div class="md-article">
                ${provenanceHtml}
                <div class="md-body">${html}</div>
                <div class="md-footer">
                    ${draftLinkHtml}
                    ${sourceLinkHtml}
                </div>
            </div>
        `);
    } catch (error) {
        console.warn('[viewer] draft.md fetch failed:', error);
        const sourceFallbackText = buildSourceFallbackText(label, lang, strings);
        const sourceFallbackHtml = sourceUrl
            ? `<p><a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(sourceFallbackText)}</a></p>`
            : '';
        openViewer(`
            <div class="md-article">
                <p>${escapeHtml(strings.draftLoadFailed)}</p>
                <p><a href="${escapeHtml(draftUrl)}" target="_blank" rel="noopener">${escapeHtml(strings.openSource)}</a></p>
                ${sourceFallbackHtml}
            </div>
        `);
    }
}
