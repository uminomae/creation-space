import DOMPurify from 'dompurify';
import { normalizeLang } from './i18n.js';

const CREATION_ASSETS_PAGES_BASE_URL = 'https://uminomae.github.io/pjdhiro/assets/publications/creation';
const CREATION_ASSETS_RAW_BASE_URL = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/publications/creation';
const CREATION_ASSETS_BASE_URL = CREATION_ASSETS_PAGES_BASE_URL;
const CREATION_ASSETS_MD_BASE_URL = `${CREATION_ASSETS_RAW_BASE_URL}/md`;
// Markdown fallback source (keep same canonical repo, rebuild from /assets/* path)
const CREATION_MARKDOWN_RAW_BASE_URL = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main';
const DEFAULT_REPORTS_DATA_URL = `${CREATION_ASSETS_RAW_BASE_URL}/manifests/issue62-domains.json`;
const DEFAULT_REPORTS_ASSET_BASE = `${CREATION_ASSETS_BASE_URL}/`;
const DEFAULT_REPORTS_MD_ASSET_BASE = `${CREATION_ASSETS_MD_BASE_URL}/`;
const STATUS_REPORT_LINKS = {
    ja: {
        mdUrl: `${CREATION_ASSETS_MD_BASE_URL}/issue62/issue62-status-ja.md`,
        pdfUrl: `${CREATION_ASSETS_BASE_URL}/pdf/issue62/creation-issue62-status-ja.pdf`,
    },
    en: {
        mdUrl: `${CREATION_ASSETS_MD_BASE_URL}/issue62/issue62-status-ja.md`,
        pdfUrl: `${CREATION_ASSETS_BASE_URL}/pdf/issue62/creation-issue62-status-ja.pdf`,
    },
};

const MODEL_GUIDE_LINKS = [
    {
        key: 'general',
        links: {
            ja: {
                mdUrl: `${CREATION_ASSETS_MD_BASE_URL}/guides/creation-general-draft.md`,
                pdfUrl: `${CREATION_ASSETS_BASE_URL}/pdf/guides/creation-general.pdf`,
            },
            en: {
                mdUrl: `${CREATION_ASSETS_MD_BASE_URL}/guides/creation-general-draft.md`,
                pdfUrl: `${CREATION_ASSETS_BASE_URL}/pdf/guides/creation-general-en.pdf`,
            },
        },
    },
    {
        key: 'designer',
        links: {
            ja: {
                mdUrl: `${CREATION_ASSETS_MD_BASE_URL}/guides/creation-designer-draft.md`,
                pdfUrl: `${CREATION_ASSETS_BASE_URL}/pdf/guides/creation-designer.pdf`,
            },
            en: {
                mdUrl: `${CREATION_ASSETS_MD_BASE_URL}/guides/creation-designer-draft.md`,
                pdfUrl: `${CREATION_ASSETS_BASE_URL}/pdf/guides/creation-designer-en.pdf`,
            },
        },
    },
    {
        key: 'expert',
        links: {
            ja: {
                mdUrl: `${CREATION_ASSETS_MD_BASE_URL}/guides/creation-academic-draft.md`,
                pdfUrl: `${CREATION_ASSETS_BASE_URL}/pdf/guides/creation-academic.pdf`,
            },
            en: {
                mdUrl: `${CREATION_ASSETS_MD_BASE_URL}/guides/creation-academic-draft.md`,
                pdfUrl: `${CREATION_ASSETS_BASE_URL}/pdf/guides/creation-academic.pdf`,
            },
        },
    },
];

const STRINGS = {
    ja: {
        error: 'レポート一覧の読み込みに失敗しました。',
        empty: '対象データがありません。',
        emptyFiltered: '該当する領域がありません。',
        metricGenerated: '更新日',
        metricTotal: '総領域',
        metricPublished: '公開済み',
        metricPlanned: '準備中',
        statusPublished: '公開済み',
        statusPlanned: '準備中',
        tabDomains: '領域別レポート',
        tabModels: 'モデル解説',
        filterGroupAria: '領域別レポート絞り込み',
        filterAll: '全件',
        filterPublished: '公開済み',
        filterPlanned: '準備中',
        openStatus: '調査内容',
        statusReportTitle: '5W1H作業報告',
        modalTitleDefault: '詳細',
        modalLoading: 'Markdown を読み込み中...',
        modalError: 'Markdown の読み込みに失敗しました。',
        modalOpenPdf: 'PDFを開く',
        modalPdfPending: 'PDF準備中',
        modalClose: '閉じる',
        modalModel: 'モデル',
        modalGenerated: '生成日',
        features: {
            general: {
                title: '一般向け',
                description: '創造モデルの全体像を短く把握するための解説。',
            },
            designer: {
                title: '設計者向け',
                description: '設計判断と運用視点で読む解説。',
            },
            expert: {
                title: '専門家向け',
                description: '理論比較と検証観点を含む解説。',
            },
        },
        featureRead: '解説を表示',
        featurePdf: 'PDF',
    },
    en: {
        error: 'Failed to load report data.',
        empty: 'No report data is available.',
        emptyFiltered: 'No domains match the current filter.',
        metricGenerated: 'Updated',
        metricTotal: 'Domains',
        metricPublished: 'Published',
        metricPlanned: 'Planned',
        statusPublished: 'Published',
        statusPlanned: 'Planned',
        tabDomains: 'Domain Reports',
        tabModels: 'Model Guides',
        filterGroupAria: 'Filter domain reports',
        filterAll: 'All',
        filterPublished: 'Published',
        filterPlanned: 'Planned',
        openStatus: 'Investigation Notes',
        statusReportTitle: '5W1H Status Report',
        modalTitleDefault: 'Details',
        modalLoading: 'Loading markdown...',
        modalError: 'Failed to load markdown.',
        modalOpenPdf: 'Open PDF',
        modalPdfPending: 'PDF Pending',
        modalClose: 'Close',
        modalModel: 'Model',
        modalGenerated: 'Generated',
        features: {
            general: {
                title: 'General',
                description: 'A concise overview of the creation model.',
            },
            designer: {
                title: 'Designer',
                description: 'Guide focused on design and implementation decisions.',
            },
            expert: {
                title: 'Expert',
                description: 'Theory comparison and verification-oriented guide.',
            },
        },
        featureRead: 'Open Guide',
        featurePdf: 'PDF',
    },
};

let markedParser = null;
const TABLE_FILTER_VALUES = new Set(['all', 'published', 'planned']);

const state = {
    lang: 'ja',
    generatedAt: '',
    reports: [],
    tableFilter: 'all',
    loadError: false,
    dataUrl: DEFAULT_REPORTS_DATA_URL,
    assetBaseUrl: DEFAULT_REPORTS_ASSET_BASE,
    assetMdBaseUrl: DEFAULT_REPORTS_MD_ASSET_BASE,
    mdModalInstance: null,
    mdRequestId: 0,
    quickLinksBound: false,
    dom: {
        error: null,
        openStatusBtn: null,
        domainsHeading: null,
        modelsHeading: null,
        featureCards: null,
        metrics: null,
        domainGrid: null,
        filterGroup: null,
        filterAll: null,
        filterPublished: null,
        filterPlanned: null,
        mdModal: null,
        mdModalTitle: null,
        mdModalMeta: null,
        mdModalContent: null,
        mdOpenPdf: null,
        mdCloseBtn: null,
    },
};

function getStrings(lang = 'ja') {
    return STRINGS[normalizeLang(lang)] || STRINGS.ja;
}

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

function formatDate(isoStr) {
    if (!isoStr) return '';
    const match = String(isoStr).match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : String(isoStr);
}

function normalizeAssetBaseUrl(url, fallback = DEFAULT_REPORTS_ASSET_BASE) {
    if (typeof url !== 'string' || !url.trim()) {
        return fallback;
    }
    return url.endsWith('/') ? url : `${url}/`;
}

function safeUrl(rawUrl, fallback = '#', baseHref = window.location.href) {
    if (typeof rawUrl !== 'string') return fallback;
    const trimmed = rawUrl.trim();
    if (!trimmed) return fallback;
    try {
        const resolved = new URL(trimmed, baseHref);
        if (resolved.protocol === 'http:' || resolved.protocol === 'https:') {
            return resolved.toString();
        }
    } catch {
        return fallback;
    }
    return fallback;
}

/**
 * Refactor context:
 * - Primary markdown reference: https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/publications/creation/md/*
 * - Primary JSON reference: https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/publications/creation/*
 * - Primary PDF reference: https://uminomae.github.io/pjdhiro/assets/publications/creation/*
 * - Fallback markdown reference: https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/*
 * - On GitHub Pages (Jekyll), `*.md` under project paths can fail as raw content.
 * - Therefore markdown fallback must change the URL target itself (github.io -> raw.githubusercontent),
 *   not only the suffix (`.md` -> none / `.html`).
 * - Fallbacking to extensionless/`.html` returns layout HTML, not markdown source.
 * - Rendering that HTML as markdown breaks modal content (raw `<link>`, `<script>` blocks shown).
 * - This page can be mirrored under multiple public paths (`/creation-space/`, `/pjdhiro/`).
 *   Raw fallback must stay on the canonical `pjdhiro` repo to avoid path drift.
 *
 * Update-time checks:
 * 1) localhost: `.md` direct fetch succeeds and renders as markdown.
 * 2) github.io: `.md` 404 still recovers via raw.githubusercontent markdown URL.
 * 3) HTML responses are rejected for markdown modal sources.
 */
function buildMarkdownFetchCandidates(rawUrl) {
    const primary = safeUrl(rawUrl, '');
    if (!primary) return [];

    const candidates = [primary];
    if (!/\.md(?:$|[?#])/i.test(primary)) {
        return candidates;
    }

    try {
        const parsed = new URL(primary);
        const pathParts = parsed.pathname.split('/').filter(Boolean);
        const assetsIndex = pathParts.findIndex((part) => part === 'assets');
        if (assetsIndex >= 0) {
            const filePath = pathParts.slice(assetsIndex).join('/');
            candidates.push(`${CREATION_MARKDOWN_RAW_BASE_URL}/${filePath}`);
        }
    } catch {
        // keep primary candidate only
    }

    return [...new Set(candidates)];
}

function looksLikeHtmlDocument(text) {
    if (typeof text !== 'string') return false;
    const sample = text.slice(0, 1024).trimStart().toLowerCase();
    return sample.startsWith('<!doctype html') || sample.startsWith('<html');
}

function slugToTitle(slug) {
    if (typeof slug !== 'string' || !slug.trim()) return '';
    return slug
        .trim()
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function normalizeReport(report, index) {
    const id = typeof report?.id === 'string' && report.id.trim()
        ? report.id.trim()
        : `D${String(index + 1).padStart(2, '0')}`;

    const nameJa = typeof report?.name_ja === 'string' && report.name_ja.trim()
        ? report.name_ja.trim()
        : id;

    const fallbackEn = slugToTitle(report?.slug) || nameJa;
    const nameEn = typeof report?.name_en === 'string' && report.name_en.trim()
        ? report.name_en.trim()
        : fallbackEn;

    return {
        id,
        nameJa,
        nameEn,
        status: report?.status === 'published' ? 'published' : 'planned',
        mdPath: typeof report?.md === 'string' ? report.md.trim() : '',
        pdfPath: typeof report?.pdf === 'string' ? report.pdf.trim() : '',
    };
}

function isMarkdownAssetPath(path) {
    return /\.md(?:$|[?#])/i.test(path);
}

function resolveReportAssetUrl(path) {
    if (typeof path !== 'string' || !path.trim()) return '';
    const trimmed = path.trim();

    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) {
        return safeUrl(trimmed, '');
    }

    const relativePath = trimmed.replace(/^\.\//, '');
    const baseUrl = isMarkdownAssetPath(relativePath) ? state.assetMdBaseUrl : state.assetBaseUrl;
    return safeUrl(`${baseUrl}${relativePath}`, '');
}

function sortReportsById(list) {
    return list.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
}

function cacheDom() {
    state.dom.error = document.getElementById('reports-error');
    state.dom.openStatusBtn = document.getElementById('reports-open-status-btn');
    state.dom.domainsHeading = document.getElementById('reports-domains-heading');
    state.dom.modelsHeading = document.getElementById('reports-models-heading');
    state.dom.featureCards = document.getElementById('reports-feature-cards');
    state.dom.metrics = document.getElementById('reports-metrics');
    state.dom.domainGrid = document.getElementById('reports-domain-grid');
    state.dom.filterGroup = document.getElementById('reports-table-filters');
    state.dom.filterAll = document.getElementById('reports-filter-all');
    state.dom.filterPublished = document.getElementById('reports-filter-published');
    state.dom.filterPlanned = document.getElementById('reports-filter-planned');
    state.dom.mdModal = document.getElementById('reports-md-modal');
    state.dom.mdModalTitle = document.getElementById('reports-md-modal-title');
    state.dom.mdModalMeta = document.getElementById('reports-md-meta');
    state.dom.mdModalContent = document.getElementById('reports-md-content');
    state.dom.mdOpenPdf = document.getElementById('reports-md-open-pdf');
    state.dom.mdCloseBtn = document.getElementById('reports-md-close-btn');
}

function ensureMdModalInstance() {
    if (!state.dom.mdModal || !globalThis.bootstrap?.Modal) return null;
    if (!state.mdModalInstance) {
        state.mdModalInstance = globalThis.bootstrap.Modal.getOrCreateInstance(state.dom.mdModal);
    }
    return state.mdModalInstance;
}

function setReportsError(message) {
    if (!state.dom.error) return;
    if (message) {
        state.dom.error.textContent = message;
        state.dom.error.classList.remove('d-none');
        return;
    }
    state.dom.error.textContent = '';
    state.dom.error.classList.add('d-none');
}

function setModalPdfButton(pdfUrl) {
    if (!state.dom.mdOpenPdf) return;
    const strings = getStrings(state.lang);
    if (pdfUrl) {
        state.dom.mdOpenPdf.href = pdfUrl;
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

function setMarkdownModalLoading({ title, pdfUrl }) {
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
    setModalPdfButton(pdfUrl);

    if (state.dom.mdCloseBtn) {
        state.dom.mdCloseBtn.textContent = strings.modalClose;
    }
}

function dedupeSources(sources = []) {
    const seenMdUrls = new Set();
    const normalized = [];

    sources.forEach((source) => {
        const safeMarkdownUrl = safeUrl(source?.mdUrl, '');
        if (!safeMarkdownUrl || seenMdUrls.has(safeMarkdownUrl)) return;
        seenMdUrls.add(safeMarkdownUrl);
        normalized.push({
            mdUrl: safeMarkdownUrl,
            pdfUrl: safeUrl(source?.pdfUrl, ''),
        });
    });

    return normalized;
}

function normalizeModalSources({ mdUrl = '', pdfUrl = '', sources = [] } = {}) {
    const merged = Array.isArray(sources) ? [...sources] : [];
    if (mdUrl) merged.push({ mdUrl, pdfUrl });
    return dedupeSources(merged);
}

function resolveLocalizedSources(linksByLang) {
    const lang = normalizeLang(state.lang);
    const primary = linksByLang?.[lang];
    const fallback = linksByLang?.ja;
    const sources = [];

    if (primary) sources.push(primary);
    if (lang !== 'ja' && fallback) sources.push(fallback);
    return dedupeSources(sources);
}

function withEnSuffix(path) {
    if (typeof path !== 'string' || !path.trim()) return '';
    return path.trim().replace(/-ja(?=\.[a-z0-9]+(?:[?#].*)?$)/i, '-en');
}

function resolveDomainReportSources(report) {
    const baseSource = {
        mdUrl: resolveReportAssetUrl(report?.mdPath),
        pdfUrl: resolveReportAssetUrl(report?.pdfPath),
    };

    if (normalizeLang(state.lang) !== 'en') {
        return dedupeSources([baseSource]);
    }

    const enSource = {
        mdUrl: resolveReportAssetUrl(withEnSuffix(report?.mdPath)),
        // Reuse the published PDF until English PDF artifacts are generated.
        pdfUrl: baseSource.pdfUrl,
    };
    return dedupeSources([enSource, baseSource]);
}

async function openMarkdownModal({ mdUrl, title = '', pdfUrl = '', sources = [] }) {
    const modalSources = normalizeModalSources({ mdUrl, pdfUrl, sources });
    if (!modalSources.length) return;
    const firstSource = modalSources[0];

    const modal = ensureMdModalInstance();
    if (!modal) {
        window.open(firstSource.mdUrl, '_blank', 'noopener');
        return;
    }

    const requestId = ++state.mdRequestId;
    setMarkdownModalLoading({ title, pdfUrl: firstSource.pdfUrl });
    modal.show();

    try {
        const marked = await getMarked();
        let raw = '';
        let activeSource = firstSource;
        let lastError = null;

        for (const source of modalSources) {
            const mdCandidates = buildMarkdownFetchCandidates(source.mdUrl);
            for (const mdUrl of mdCandidates) {
                try {
                    const response = await fetch(mdUrl, { cache: 'no-store' });
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const text = await response.text();
                    if (looksLikeHtmlDocument(text)) {
                        throw new Error('Unexpected HTML response for markdown source');
                    }
                    raw = text;
                    activeSource = { ...source, mdUrl };
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

        if (requestId !== state.mdRequestId) return;
        setModalPdfButton(activeSource.pdfUrl);
        if (state.dom.mdModalContent) {
            state.dom.mdModalContent.innerHTML = `
                <div class="md-article">
                    <div class="md-body">${html}</div>
                </div>
            `;
        }

        const strings = getStrings(state.lang);
        const metaParts = [];
        if (meta.generator_model) metaParts.push(`${strings.modalModel}: ${meta.generator_model}`);
        if (meta.generated) metaParts.push(`${strings.modalGenerated}: ${formatDate(meta.generated)}`);
        if (state.dom.mdModalMeta) {
            state.dom.mdModalMeta.textContent = metaParts.join(' / ');
        }
    } catch (error) {
        console.warn('[reports] markdown load failed:', error);
        if (requestId !== state.mdRequestId) return;
        const strings = getStrings(state.lang);
        if (state.dom.mdModalMeta) {
            state.dom.mdModalMeta.textContent = '';
        }
        if (state.dom.mdModalContent) {
            state.dom.mdModalContent.innerHTML = `<p class="text-danger-emphasis mb-0">${strings.modalError}</p>`;
        }
    }
}

function bindQuickLinks() {
    if (state.quickLinksBound) return;

    if (state.dom.openStatusBtn && !state.dom.openStatusBtn.dataset.boundClick) {
        state.dom.openStatusBtn.addEventListener('click', () => {
            const strings = getStrings(state.lang);
            openMarkdownModal({
                title: strings.statusReportTitle,
                sources: resolveLocalizedSources(STATUS_REPORT_LINKS),
            });
        });
        state.dom.openStatusBtn.dataset.boundClick = '1';
    }

    if (state.dom.mdOpenPdf && !state.dom.mdOpenPdf.dataset.boundClick) {
        state.dom.mdOpenPdf.addEventListener('click', (event) => {
            if (state.dom.mdOpenPdf?.classList.contains('disabled')) {
                event.preventDefault();
            }
        });
        state.dom.mdOpenPdf.dataset.boundClick = '1';
    }

    if (state.dom.filterGroup && !state.dom.filterGroup.dataset.boundClick) {
        state.dom.filterGroup.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            const button = target.closest('button[data-filter]');
            if (!(button instanceof HTMLButtonElement)) return;

            const nextFilter = button.dataset.filter;
            if (!TABLE_FILTER_VALUES.has(nextFilter) || nextFilter === state.tableFilter) return;

            state.tableFilter = nextFilter;
            updateFilterButtons();
            renderDomainGrid();
        });
        state.dom.filterGroup.dataset.boundClick = '1';
    }

    state.quickLinksBound = true;
}

function updateFilterButtons() {
    const controls = [
        ['all', state.dom.filterAll],
        ['published', state.dom.filterPublished],
        ['planned', state.dom.filterPlanned],
    ];

    controls.forEach(([filterKey, node]) => {
        if (!(node instanceof HTMLButtonElement)) return;
        const isActive = state.tableFilter === filterKey;
        node.classList.toggle('active', isActive);
        node.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

function applyStaticText() {
    const strings = getStrings(state.lang);

    if (state.dom.domainsHeading) state.dom.domainsHeading.textContent = strings.tabDomains;
    if (state.dom.modelsHeading) state.dom.modelsHeading.textContent = strings.tabModels;

    if (state.dom.filterGroup) state.dom.filterGroup.setAttribute('aria-label', strings.filterGroupAria);
    if (state.dom.filterAll) state.dom.filterAll.textContent = strings.filterAll;
    if (state.dom.filterPublished) state.dom.filterPublished.textContent = strings.filterPublished;
    if (state.dom.filterPlanned) state.dom.filterPlanned.textContent = strings.filterPlanned;
    if (state.dom.openStatusBtn) state.dom.openStatusBtn.textContent = strings.openStatus;
    updateFilterButtons();

    if (state.dom.mdCloseBtn) state.dom.mdCloseBtn.textContent = strings.modalClose;
}

function renderFeatureCards() {
    if (!state.dom.featureCards) return;

    const strings = getStrings(state.lang);
    state.dom.featureCards.innerHTML = '';

    const fragment = document.createDocumentFragment();
    MODEL_GUIDE_LINKS.forEach((guide) => {
        const featureText = strings.features[guide.key];
        if (!featureText) return;

        const col = document.createElement('div');
        col.className = 'col';

        const card = document.createElement('article');
        card.className = 'card kesson-card h-100 reports-feature-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `${featureText.title} ${strings.featureRead}`);

        const body = document.createElement('div');
        body.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

        const title = document.createElement('h3');
        title.className = 'h6 mb-1 text-light';
        title.textContent = featureText.title;

        const desc = document.createElement('p');
        desc.className = 'small mb-0 reports-feature-description';
        desc.textContent = featureText.description;
        body.appendChild(title);
        body.appendChild(desc);
        card.appendChild(body);

        const openCardModal = () => {
            openMarkdownModal({
                title: featureText.title,
                sources: resolveLocalizedSources(guide.links),
            });
        };
        card.addEventListener('click', openCardModal);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openCardModal();
            }
        });

        col.appendChild(card);
        fragment.appendChild(col);
    });

    state.dom.featureCards.appendChild(fragment);
}

function createMetricCard(label, value, variant = 'default') {
    const col = document.createElement('div');
    col.className = 'col-6 col-lg-3';

    const card = document.createElement('div');
    card.className = 'card report-metric-card h-100 border-secondary-subtle';
    if (variant === 'published') card.classList.add('border-success-subtle');
    if (variant === 'planned') card.classList.add('border-warning-subtle');

    const body = document.createElement('div');
    body.className = 'card-body py-2 px-3';

    const metricLabel = document.createElement('div');
    metricLabel.className = 'report-metric-label text-uppercase small';
    metricLabel.textContent = label;

    const metricValue = document.createElement('div');
    metricValue.className = 'report-metric-value fw-semibold';
    metricValue.textContent = value;

    body.appendChild(metricLabel);
    body.appendChild(metricValue);
    card.appendChild(body);
    col.appendChild(card);
    return col;
}

function renderMetrics() {
    if (!state.dom.metrics) return;
    const strings = getStrings(state.lang);
    const total = state.reports.length;
    const published = state.reports.filter((report) => report.status === 'published').length;
    const planned = Math.max(0, total - published);
    const generatedValue = state.generatedAt || '-';

    state.dom.metrics.innerHTML = '';
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createMetricCard(strings.metricGenerated, generatedValue));
    fragment.appendChild(createMetricCard(strings.metricTotal, String(total)));
    fragment.appendChild(createMetricCard(strings.metricPublished, String(published), 'published'));
    fragment.appendChild(createMetricCard(strings.metricPlanned, String(planned), 'planned'));
    state.dom.metrics.appendChild(fragment);
}

function createDomainGridItem({ report, muted = false, strings }) {
    const isPublished = report.status === 'published';
    const useJapanese = normalizeLang(state.lang) === 'ja';
    const domainLabel = useJapanese
        ? (report.nameJa || report.nameEn)
        : (report.nameEn || report.nameJa);
    const statusText = isPublished ? strings.statusPublished : strings.statusPlanned;
    const sources = isPublished ? resolveDomainReportSources(report) : [];
    const clickable = isPublished && sources.length > 0 && !muted;
    const tile = clickable ? document.createElement('button') : document.createElement('article');
    const reportTitle = `${report.id} ${domainLabel}`;

    if (clickable) {
        tile.type = 'button';
        tile.addEventListener('click', () => {
            openMarkdownModal({ title: reportTitle, sources });
        });
    }

    tile.className = [
        'reports-domain-item',
        'card',
        isPublished ? 'is-published' : 'is-planned',
        muted ? 'is-filter-muted' : '',
    ].join(' ').trim();
    tile.setAttribute('data-report-status', report.status);
    tile.setAttribute('aria-label', `${reportTitle} ${statusText}`);
    if (!clickable) {
        tile.setAttribute('aria-disabled', 'true');
    }

    tile.innerHTML = `
        <div class="card-body p-1 d-flex flex-column reports-domain-item-body">
            <div class="d-flex align-items-center justify-content-between gap-2 reports-domain-item-head">
                <span class="reports-domain-item-id">${report.id}</span>
                <span class="badge rounded-pill ${isPublished ? 'text-bg-success' : 'text-bg-warning text-dark'} reports-domain-item-status">${statusText}</span>
            </div>
            <div class="reports-domain-item-name" title="${domainLabel}">${domainLabel}</div>
        </div>
    `;

    return tile;
}

function renderDomainGrid() {
    if (!state.dom.domainGrid) return;
    const strings = getStrings(state.lang);
    const allReports = state.reports;

    state.dom.domainGrid.innerHTML = '';
    if (!allReports.length) {
        const empty = document.createElement('div');
        empty.className = 'reports-domain-empty text-body-secondary';
        empty.textContent = strings.empty;
        state.dom.domainGrid.appendChild(empty);
        return;
    }

    const fragment = document.createDocumentFragment();
    allReports.forEach((report) => {
        const muted = state.tableFilter !== 'all' && report.status !== state.tableFilter;
        fragment.appendChild(createDomainGridItem({ report, muted, strings }));
    });

    state.dom.domainGrid.appendChild(fragment);
}

function renderReports() {
    applyStaticText();
    renderFeatureCards();
    renderMetrics();
    renderDomainGrid();
    setReportsError(state.loadError ? getStrings(state.lang).error : '');
}

async function loadReportsData() {
    const response = await fetch(state.dataUrl, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const rawReports = Array.isArray(payload?.reports) ? payload.reports : [];
    state.generatedAt = typeof payload?.generated_at === 'string' ? payload.generated_at : '';
    state.reports = sortReportsById(rawReports.map(normalizeReport));
}

export async function initReports({
    lang = 'ja',
    dataUrl = DEFAULT_REPORTS_DATA_URL,
    assetBaseUrl = DEFAULT_REPORTS_ASSET_BASE,
    assetMdBaseUrl = DEFAULT_REPORTS_MD_ASSET_BASE,
} = {}) {
    cacheDom();
    bindQuickLinks();

    state.lang = normalizeLang(lang);
    state.dataUrl = dataUrl;
    state.assetBaseUrl = normalizeAssetBaseUrl(assetBaseUrl);
    state.assetMdBaseUrl = normalizeAssetBaseUrl(assetMdBaseUrl, DEFAULT_REPORTS_MD_ASSET_BASE);
    state.generatedAt = '';
    state.reports = [];
    state.tableFilter = 'all';
    state.loadError = false;

    renderReports();

    try {
        await loadReportsData();
        state.loadError = false;
    } catch (error) {
        state.reports = [];
        state.loadError = true;
        console.warn('[reports] load failed:', error);
    }

    renderReports();
}

export function setReportsLanguage(lang) {
    state.lang = normalizeLang(lang);
    renderReports();
}
