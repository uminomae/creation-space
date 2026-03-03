import DOMPurify from 'dompurify';
import { normalizeLang } from './i18n.js';

const CREATION_ASSETS_BASE_URL = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/creation';
const DEFAULT_REPORTS_DATA_URL = `${CREATION_ASSETS_BASE_URL}/issue62/domains/index.json`;
const DEFAULT_REPORTS_ASSET_BASE = `${CREATION_ASSETS_BASE_URL}/issue62/`;
const STATUS_REPORT_MD = `${CREATION_ASSETS_BASE_URL}/issue62/issue62-status-ja.md`;
const STATUS_REPORT_PDF = `${CREATION_ASSETS_BASE_URL}/issue62/creation-issue62-status-ja.pdf`;

const MODEL_GUIDE_LINKS = [
    {
        key: 'general',
        mdUrl: `${CREATION_ASSETS_BASE_URL}/model-guides/kesson-general-draft.md`,
        pdfUrl: `${CREATION_ASSETS_BASE_URL}/model-guides/kesson-general.pdf`,
    },
    {
        key: 'designer',
        mdUrl: `${CREATION_ASSETS_BASE_URL}/model-guides/kesson-designer-draft.md`,
        pdfUrl: `${CREATION_ASSETS_BASE_URL}/model-guides/kesson-designer.pdf`,
    },
    {
        key: 'expert',
        mdUrl: `${CREATION_ASSETS_BASE_URL}/model-guides/kesson-academic-draft.md`,
        pdfUrl: `${CREATION_ASSETS_BASE_URL}/model-guides/kesson-academic.pdf`,
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
        colId: 'ID',
        colDomain: '領域',
        colStatus: '状態',
        statusPublished: '公開済み',
        statusPlanned: '準備中',
        tabDomains: '領域別レポート',
        tabModels: 'モデル解説',
        filterGroupAria: '領域別レポート絞り込み',
        filterAll: '全件',
        filterPublished: '公開済み',
        filterPlanned: '準備中',
        openStatus: '作業報告を開く',
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
        colId: 'ID',
        colDomain: 'Domain',
        colStatus: 'Status',
        statusPublished: 'Published',
        statusPlanned: 'Planned',
        tabDomains: 'Domain Reports',
        tabModels: 'Model Guides',
        filterGroupAria: 'Filter domain reports',
        filterAll: 'All',
        filterPublished: 'Published',
        filterPlanned: 'Planned',
        openStatus: 'Open Status Report',
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
    mdModalInstance: null,
    mdRequestId: 0,
    quickLinksBound: false,
    dom: {
        error: null,
        openStatusBtn: null,
        domainsTab: null,
        modelsTab: null,
        featureCards: null,
        metrics: null,
        tableBody: null,
        colId: null,
        colDomain: null,
        colStatus: null,
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

function normalizeAssetBaseUrl(url) {
    if (typeof url !== 'string' || !url.trim()) {
        return DEFAULT_REPORTS_ASSET_BASE;
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

function resolveReportAssetUrl(path) {
    if (typeof path !== 'string' || !path.trim()) return '';
    const trimmed = path.trim();

    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) {
        return safeUrl(trimmed, '');
    }

    const relativePath = trimmed.replace(/^\.\//, '');
    return safeUrl(`${state.assetBaseUrl}${relativePath}`, '');
}

function sortReportsById(list) {
    return list.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
}

function cacheDom() {
    state.dom.error = document.getElementById('reports-error');
    state.dom.openStatusBtn = document.getElementById('reports-open-status-btn');
    state.dom.domainsTab = document.getElementById('reports-domains-tab');
    state.dom.modelsTab = document.getElementById('reports-models-tab');
    state.dom.featureCards = document.getElementById('reports-feature-cards');
    state.dom.metrics = document.getElementById('reports-metrics');
    state.dom.tableBody = document.getElementById('reports-table-body');
    state.dom.colId = document.getElementById('reports-col-id');
    state.dom.colDomain = document.getElementById('reports-col-domain');
    state.dom.colStatus = document.getElementById('reports-col-status');
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

async function openMarkdownModal({ mdUrl, title = '', pdfUrl = '' }) {
    const safeMarkdownUrl = safeUrl(mdUrl, '');
    const safePdfUrl = safeUrl(pdfUrl, '');
    if (!safeMarkdownUrl) return;

    const modal = ensureMdModalInstance();
    if (!modal) {
        window.open(safeMarkdownUrl, '_blank', 'noopener');
        return;
    }

    const requestId = ++state.mdRequestId;
    setMarkdownModalLoading({ title, pdfUrl: safePdfUrl });
    modal.show();

    try {
        const [response, marked] = await Promise.all([
            fetch(safeMarkdownUrl, { cache: 'no-store' }),
            getMarked(),
        ]);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const raw = await response.text();
        const { meta, body } = parseFrontmatter(raw);
        const html = DOMPurify.sanitize(marked.parse(body || raw));

        if (requestId !== state.mdRequestId) return;
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
                mdUrl: STATUS_REPORT_MD,
                title: strings.statusReportTitle,
                pdfUrl: STATUS_REPORT_PDF,
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
            renderTable();
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

    if (state.dom.colId) state.dom.colId.textContent = strings.colId;
    if (state.dom.colDomain) state.dom.colDomain.textContent = strings.colDomain;
    if (state.dom.colStatus) state.dom.colStatus.textContent = strings.colStatus;
    if (state.dom.domainsTab) state.dom.domainsTab.textContent = strings.tabDomains;
    if (state.dom.modelsTab) state.dom.modelsTab.textContent = strings.tabModels;

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
                mdUrl: guide.mdUrl,
                title: featureText.title,
                pdfUrl: guide.pdfUrl,
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

function createStatusCell({ isPublished, statusText, reportTitle, mdUrl, pdfUrl }) {
    const td = document.createElement('td');

    if (isPublished && mdUrl) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'badge rounded-pill text-bg-success border-0 reports-status-action';
        button.textContent = statusText;
        button.addEventListener('click', () => {
            openMarkdownModal({ mdUrl, title: reportTitle, pdfUrl });
        });
        td.appendChild(button);
        return td;
    }

    const badge = document.createElement('span');
    badge.className = isPublished ? 'badge rounded-pill text-bg-success' : 'badge rounded-pill text-bg-warning text-dark';
    badge.textContent = statusText;
    td.appendChild(badge);
    return td;
}

function renderTable() {
    if (!state.dom.tableBody) return;
    const strings = getStrings(state.lang);
    const visibleReports = state.tableFilter === 'all'
        ? state.reports
        : state.reports.filter((report) => report.status === state.tableFilter);

    state.dom.tableBody.innerHTML = '';
    if (!visibleReports.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.className = 'text-body-secondary';
        cell.textContent = state.reports.length && state.tableFilter !== 'all'
            ? strings.emptyFiltered
            : strings.empty;
        row.appendChild(cell);
        state.dom.tableBody.appendChild(row);
        return;
    }

    const fragment = document.createDocumentFragment();
    visibleReports.forEach((report) => {
        const row = document.createElement('tr');
        const isPublished = report.status === 'published';
        const localizedDomain = state.lang === 'en' ? report.nameEn : report.nameJa;

        const idCell = document.createElement('td');
        idCell.textContent = report.id;

        const domainCell = document.createElement('td');
        domainCell.textContent = localizedDomain;

        const mdUrl = isPublished ? resolveReportAssetUrl(report.mdPath) : '';
        const pdfUrl = isPublished ? resolveReportAssetUrl(report.pdfPath) : '';
        const reportTitle = `${report.id} ${localizedDomain}`;
        const statusCell = createStatusCell({
            isPublished,
            statusText: isPublished ? strings.statusPublished : strings.statusPlanned,
            reportTitle,
            mdUrl,
            pdfUrl,
        });

        row.appendChild(idCell);
        row.appendChild(domainCell);
        row.appendChild(statusCell);
        fragment.appendChild(row);
    });

    state.dom.tableBody.appendChild(fragment);
}

function renderReports() {
    applyStaticText();
    renderFeatureCards();
    renderMetrics();
    renderTable();
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
} = {}) {
    cacheDom();
    bindQuickLinks();

    state.lang = normalizeLang(lang);
    state.dataUrl = dataUrl;
    state.assetBaseUrl = normalizeAssetBaseUrl(assetBaseUrl);
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
