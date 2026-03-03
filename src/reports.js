import { normalizeLang } from './i18n.js';

const DEFAULT_REPORTS_DATA_URL = './assets/reports/issue62/domains/index.json';
const DEFAULT_REPORTS_ASSET_BASE = './assets/reports/issue62/';

const STRINGS = {
    ja: {
        summaryNote: 'Issue #62 の作業報告・学術分冊・ドメイン進捗をここで追跡します。',
        error: 'レポート一覧の読み込みに失敗しました。',
        empty: '対象データがありません。',
        loading: '読み込み中...',
        metricGenerated: '更新日',
        metricTotal: '総領域',
        metricPublished: '公開済み',
        metricPlanned: '準備中',
        colId: 'ID',
        colDomain: '領域',
        colStatus: '状態',
        colMd: 'Markdown',
        colPdf: 'PDF',
        statusPublished: '公開済み',
        statusPlanned: '準備中',
        open: '開く',
        pending: '準備中',
        links: {
            hub: 'Issue #62 Hub',
            statusPdf: '5W1H作業報告 PDF',
            statusMd: '5W1H作業報告 Markdown',
            domainIndex: '分冊インデックス Markdown',
            issue: 'GitHub Issue #62',
        },
    },
    en: {
        summaryNote: 'Track Issue #62 status, academic volumes, and domain publication progress here.',
        error: 'Failed to load report data.',
        empty: 'No report data is available.',
        loading: 'Loading...',
        metricGenerated: 'Updated',
        metricTotal: 'Domains',
        metricPublished: 'Published',
        metricPlanned: 'Planned',
        colId: 'ID',
        colDomain: 'Domain',
        colStatus: 'Status',
        colMd: 'Markdown',
        colPdf: 'PDF',
        statusPublished: 'Published',
        statusPlanned: 'Planned',
        open: 'Open',
        pending: 'Pending',
        links: {
            hub: 'Issue #62 Hub',
            statusPdf: '5W1H Status PDF',
            statusMd: '5W1H Status Markdown',
            domainIndex: 'Domain Index Markdown',
            issue: 'GitHub Issue #62',
        },
    },
};

const state = {
    lang: 'ja',
    generatedAt: '',
    reports: [],
    loadError: false,
    dataUrl: DEFAULT_REPORTS_DATA_URL,
    assetBaseUrl: DEFAULT_REPORTS_ASSET_BASE,
    dom: {
        summary: null,
        error: null,
        metrics: null,
        tableBody: null,
        colId: null,
        colDomain: null,
        colStatus: null,
        colMd: null,
        colPdf: null,
        linkHub: null,
        linkStatusPdf: null,
        linkStatusMd: null,
        linkDomainIndex: null,
        linkIssue: null,
    },
};

function getStrings(lang = 'ja') {
    return STRINGS[normalizeLang(lang)] || STRINGS.ja;
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
    state.dom.summary = document.getElementById('reports-summary-note');
    state.dom.error = document.getElementById('reports-error');
    state.dom.metrics = document.getElementById('reports-metrics');
    state.dom.tableBody = document.getElementById('reports-table-body');
    state.dom.colId = document.getElementById('reports-col-id');
    state.dom.colDomain = document.getElementById('reports-col-domain');
    state.dom.colStatus = document.getElementById('reports-col-status');
    state.dom.colMd = document.getElementById('reports-col-md');
    state.dom.colPdf = document.getElementById('reports-col-pdf');
    state.dom.linkHub = document.getElementById('reports-link-hub');
    state.dom.linkStatusPdf = document.getElementById('reports-link-status-pdf');
    state.dom.linkStatusMd = document.getElementById('reports-link-status-md');
    state.dom.linkDomainIndex = document.getElementById('reports-link-domain-index');
    state.dom.linkIssue = document.getElementById('reports-link-issue');
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

function applyStaticText() {
    const strings = getStrings(state.lang);

    if (state.dom.summary) {
        state.dom.summary.textContent = strings.summaryNote;
    }

    if (state.dom.colId) state.dom.colId.textContent = strings.colId;
    if (state.dom.colDomain) state.dom.colDomain.textContent = strings.colDomain;
    if (state.dom.colStatus) state.dom.colStatus.textContent = strings.colStatus;
    if (state.dom.colMd) state.dom.colMd.textContent = strings.colMd;
    if (state.dom.colPdf) state.dom.colPdf.textContent = strings.colPdf;

    if (state.dom.linkHub) state.dom.linkHub.textContent = strings.links.hub;
    if (state.dom.linkStatusPdf) state.dom.linkStatusPdf.textContent = strings.links.statusPdf;
    if (state.dom.linkStatusMd) state.dom.linkStatusMd.textContent = strings.links.statusMd;
    if (state.dom.linkDomainIndex) state.dom.linkDomainIndex.textContent = strings.links.domainIndex;
    if (state.dom.linkIssue) state.dom.linkIssue.textContent = strings.links.issue;
}

function createMetricCard(label, value, variant = 'default') {
    const col = document.createElement('div');
    col.className = 'col-6 col-lg-3';

    const card = document.createElement('div');
    card.className = 'card report-metric-card h-100';
    if (variant === 'published') card.classList.add('is-published');
    if (variant === 'planned') card.classList.add('is-planned');

    const body = document.createElement('div');
    body.className = 'card-body py-2 px-3';

    const metricLabel = document.createElement('div');
    metricLabel.className = 'report-metric-label';
    metricLabel.textContent = label;

    const metricValue = document.createElement('div');
    metricValue.className = 'report-metric-value';
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

function createReportLinkCell(url, label, pendingLabel) {
    const td = document.createElement('td');
    if (!url) {
        const muted = document.createElement('span');
        muted.className = 'report-link-pending';
        muted.textContent = pendingLabel;
        td.appendChild(muted);
        return td;
    }

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = label;
    td.appendChild(link);
    return td;
}

function renderTable() {
    if (!state.dom.tableBody) return;
    const strings = getStrings(state.lang);

    state.dom.tableBody.innerHTML = '';
    if (!state.reports.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.className = 'text-muted';
        cell.textContent = strings.empty;
        row.appendChild(cell);
        state.dom.tableBody.appendChild(row);
        return;
    }

    const fragment = document.createDocumentFragment();
    state.reports.forEach((report) => {
        const row = document.createElement('tr');
        const isPublished = report.status === 'published';

        const idCell = document.createElement('td');
        idCell.textContent = report.id;

        const domainCell = document.createElement('td');
        domainCell.textContent = state.lang === 'en' ? report.nameEn : report.nameJa;

        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `badge rounded-pill reports-status ${isPublished ? 'reports-status-published' : 'reports-status-planned'}`;
        statusBadge.textContent = isPublished ? strings.statusPublished : strings.statusPlanned;
        statusCell.appendChild(statusBadge);

        const mdUrl = isPublished ? resolveReportAssetUrl(report.mdPath) : '';
        const pdfUrl = isPublished ? resolveReportAssetUrl(report.pdfPath) : '';
        const mdCell = createReportLinkCell(mdUrl, strings.open, strings.pending);
        const pdfCell = createReportLinkCell(pdfUrl, strings.open, strings.pending);

        row.appendChild(idCell);
        row.appendChild(domainCell);
        row.appendChild(statusCell);
        row.appendChild(mdCell);
        row.appendChild(pdfCell);
        fragment.appendChild(row);
    });

    state.dom.tableBody.appendChild(fragment);
}

function renderReports() {
    applyStaticText();
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
    state.lang = normalizeLang(lang);
    state.dataUrl = dataUrl;
    state.assetBaseUrl = normalizeAssetBaseUrl(assetBaseUrl);
    state.generatedAt = '';
    state.reports = [];
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
