import DOMPurify from 'dompurify';
import { normalizeLang } from './i18n.js';

const PJDHIRO_PAGES_BASE = 'https://uminomae.github.io/pjdhiro';
const PJDHIRO_RAW_BASE = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main';
const CREATION_PATH = '/assets/creation';
const PJDHIRO_CREATION_PAGES = `${PJDHIRO_PAGES_BASE}${CREATION_PATH}`;
const PJDHIRO_CREATION_RAW = `${PJDHIRO_RAW_BASE}${CREATION_PATH}`;
const DEFAULT_REPORTS_DATA_URL = `${PJDHIRO_CREATION_RAW}/manifests/domains.json`;
const DEFAULT_REPORTS_ASSET_BASE = `${PJDHIRO_CREATION_PAGES}/`;
const DEFAULT_REPORTS_MD_ASSET_BASE = `${PJDHIRO_CREATION_RAW}/`;
const STATUS_REPORT_LINKS = {
    ja: {
        mdUrl: `${PJDHIRO_CREATION_RAW}/survey/ja/md/survey-status.md`,
        pdfUrl: `${PJDHIRO_CREATION_PAGES}/survey/ja/pdf/survey-status.pdf`,
    },
    en: {
        mdUrl: `${PJDHIRO_CREATION_RAW}/survey/en/md/survey-status.md`,
        pdfUrl: `${PJDHIRO_CREATION_PAGES}/survey/en/pdf/survey-status.pdf`,
    },
};

const MODEL_GUIDE_LINKS = [
    {
        key: 'general',
        links: {
            ja: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/ja/md/creation-general.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/ja/pdf/creation-general.pdf`,
            },
            en: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/en/md/creation-general.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/en/pdf/creation-general.pdf`,
            },
        },
    },
    {
        key: 'designer',
        links: {
            ja: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/ja/md/creation-designer.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/ja/pdf/creation-designer.pdf`,
            },
            en: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/en/md/creation-designer.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/en/pdf/creation-designer.pdf`,
            },
        },
    },
    {
        key: 'expert',
        links: {
            ja: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/ja/md/creation-academic.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/ja/pdf/creation-academic.pdf`,
            },
            en: {
                mdUrl: `${PJDHIRO_CREATION_RAW}/guides/en/md/creation-academic.md`,
                pdfUrl: `${PJDHIRO_CREATION_PAGES}/guides/en/pdf/creation-academic.pdf`,
            },
        },
    },
];

const DEFAULT_PROGRESS_TAXONOMY = [
    {
        id: 'quick_scan',
        labelJa: '簡易調査',
        labelEn: 'Quick Scan',
        descriptionJa: '3件/領域',
        descriptionEn: '3/domain',
        tone: 'warning',
        order: 10,
    },
    {
        id: 'structure_exploration',
        labelJa: '構造類似探索',
        labelEn: 'Structure Exploration',
        descriptionJa: '10件/領域',
        descriptionEn: '10/domain',
        tone: 'primary',
        order: 20,
    },
    {
        id: 'analysis_complete',
        labelJa: '分析完了',
        labelEn: 'Analysis Complete',
        descriptionJa: '完了',
        descriptionEn: 'Completed',
        tone: 'success',
        order: 30,
    },
];

const STRINGS = {
    ja: {
        error: 'レポート一覧の読み込みに失敗しました。',
        empty: '対象データがありません。',
        emptyFiltered: '該当する領域がありません。',
        metricGenerated: '更新日',
        metricTotal: '総領域',
        levelLegendPrefix: '進捗レベル',
        levelLegend: '進捗レベル: 簡易調査（3件/領域） / 構造類似探索調査（10件/領域） / 分析完了',
        levelLegendSingle: '{count}領域すべてが現在「{label}」に分類されています。',
        tabDomains: '領域別レポート',
        tabModels: 'モデル解説',
        filterGroupAria: '領域別レポート絞り込み',
        filterAll: '全件',
        openStatus: '調査内容',
        statusReportTitle: '調査概要',
        modalTitleDefault: '詳細',
        modalLoading: 'Markdown を読み込み中...',
        modalError: 'Markdown の読み込みに失敗しました。',
        modalPreparing: '英語版は準備中です。',
        modalOpenPdf: 'PDFを開く',
        modalPdfPending: 'PDF準備中',
        modalClose: '閉じる',
        modalModel: 'モデル',
        modalGenerated: '生成日',
        features: {
            general: {
                title: '一般向け',
                modalTitle: '創造とは——5段階の地図',
                description: '創造モデルの全体像を短く把握するための解説。',
            },
            designer: {
                title: '設計者向け',
                modalTitle: '創造の構造——設計者のための地図',
                description: '設計判断と運用視点で読む解説。',
            },
            expert: {
                title: '専門家向け',
                modalTitle: '創造とは——学術版',
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
        levelLegendPrefix: 'Progress levels',
        levelLegend: 'Progress levels: Quick Scan (3/domain) / Structure Exploration (10/domain) / Analysis Complete',
        levelLegendSingle: 'All {count} domains are currently classified as "{label}".',
        tabDomains: 'Domain Reports',
        tabModels: 'Model Guides',
        filterGroupAria: 'Filter domain reports',
        filterAll: 'All',
        openStatus: 'Investigation Notes',
        statusReportTitle: 'Survey Overview',
        modalTitleDefault: 'Details',
        modalLoading: 'Loading markdown...',
        modalError: 'Failed to load markdown.',
        modalPreparing: 'English version is in preparation.',
        modalOpenPdf: 'Open PDF',
        modalPdfPending: 'PDF Pending',
        modalClose: 'Close',
        modalModel: 'Model',
        modalGenerated: 'Generated',
        features: {
            general: {
                title: 'General',
                modalTitle: 'Creation — A Map of Five Stages',
                description: 'A concise overview of the creation model.',
            },
            designer: {
                title: 'Designer',
                modalTitle: 'Creation as Structure — A Guide for Project Designers',
                description: 'Guide focused on design and implementation decisions.',
            },
            expert: {
                title: 'Expert',
                modalTitle: 'Creation — An Exploratory Description of the Five-Stage Process',
                description: 'Theory comparison and verification-oriented guide.',
            },
        },
        featureRead: 'Open Guide',
        featurePdf: 'PDF',
    },
};

let markedParser = null;

const state = {
    lang: 'ja',
    generatedAt: '',
    reports: [],
    progressTaxonomy: DEFAULT_PROGRESS_TAXONOMY.map((entry) => ({ ...entry })),
    progressLevelCounts: {},
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
        levelLegend: null,
        featureCards: null,
        metrics: null,
        domainGrid: null,
        filterGroup: null,
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

function getReportsDebugTaxonomyMode() {
    try {
        const value = new URLSearchParams(window.location.search).get('reportsTaxonomyTest');
        return hasText(value) ? value.trim().toLowerCase() : '';
    } catch {
        return '';
    }
}

function hasText(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

function normalizeProgressLevelId(value) {
    return hasText(value) ? value.trim().toLowerCase() : '';
}

function formatProgressLevelFallbackLabel(level) {
    const normalizedLevel = normalizeProgressLevelId(level);
    if (!normalizedLevel) return '';
    return slugToTitle(normalizedLevel.replace(/_/g, '-')) || normalizedLevel;
}

function getDefaultProgressTaxonomyEntry(level) {
    const normalizedLevel = normalizeProgressLevelId(level);
    const matched = DEFAULT_PROGRESS_TAXONOMY.find((entry) => entry.id === normalizedLevel);
    if (matched) {
        return { ...matched };
    }

    const fallbackLabel = formatProgressLevelFallbackLabel(normalizedLevel);
    return {
        id: normalizedLevel,
        labelJa: fallbackLabel || normalizedLevel,
        labelEn: fallbackLabel || normalizedLevel,
        descriptionJa: '',
        descriptionEn: '',
        tone: 'secondary',
        order: Number.MAX_SAFE_INTEGER,
    };
}

function normalizeProgressTaxonomy(rawTaxonomy, reports = []) {
    const sourceEntries = Array.isArray(rawTaxonomy) && rawTaxonomy.length
        ? rawTaxonomy
        : DEFAULT_PROGRESS_TAXONOMY;
    const normalized = [];
    const seen = new Set();

    sourceEntries.forEach((entry, index) => {
        const id = normalizeProgressLevelId(entry?.id);
        if (!id || seen.has(id)) return;

        const fallback = getDefaultProgressTaxonomyEntry(id);
        const order = Number(entry?.order);
        normalized.push({
            id,
            labelJa: hasText(entry?.label_ja) ? entry.label_ja.trim() : fallback.labelJa,
            labelEn: hasText(entry?.label_en) ? entry.label_en.trim() : fallback.labelEn,
            descriptionJa: hasText(entry?.description_ja) ? entry.description_ja.trim() : fallback.descriptionJa,
            descriptionEn: hasText(entry?.description_en) ? entry.description_en.trim() : fallback.descriptionEn,
            tone: hasText(entry?.tone) ? entry.tone.trim().toLowerCase() : fallback.tone,
            order: Number.isFinite(order) ? order : (fallback.order + index),
        });
        seen.add(id);
    });

    reports.forEach((report, index) => {
        const id = normalizeProgressLevelId(report?.progressLevel);
        if (!id || seen.has(id)) return;

        const fallback = getDefaultProgressTaxonomyEntry(id);
        normalized.push({
            ...fallback,
            order: fallback.order === Number.MAX_SAFE_INTEGER ? 1000 + index : fallback.order,
        });
        seen.add(id);
    });

    return normalized.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.id.localeCompare(b.id, 'en');
    });
}

function applyDebugProgressTaxonomy({ reports, progressTaxonomy }) {
    const debugMode = getReportsDebugTaxonomyMode();
    if (debugMode !== 'split-d22') {
        return { reports, progressTaxonomy };
    }

    const injectedLevelId = 'three_of_five_scan_10_theories_per_domain';
    const nextReports = reports.map((report) => ({
        ...report,
        progressLevel: report.id === 'D22' ? report.progressLevel : injectedLevelId,
    }));
    const nextTaxonomy = normalizeProgressTaxonomy([
        ...progressTaxonomy,
        {
            id: injectedLevelId,
            label_ja: '3/5調査:10論/領域',
            label_en: '3/5 Scan: 10 theories/domain',
            description_ja: '経営学以外のテスト分類',
            description_en: 'Test category for all domains except business management',
            tone: 'secondary',
            order: 15,
        },
    ], nextReports);

    return {
        reports: nextReports,
        progressTaxonomy: nextTaxonomy,
    };
}

function getProgressTaxonomyEntry(level) {
    const normalizedLevel = normalizeProgressLevelId(level);
    return state.progressTaxonomy.find((entry) => entry.id === normalizedLevel)
        || getDefaultProgressTaxonomyEntry(normalizedLevel);
}

function getProgressLevelLabel(level, strings = getStrings(state.lang)) {
    const taxonomyEntry = getProgressTaxonomyEntry(level);
    return normalizeLang(state.lang) === 'ja'
        ? (taxonomyEntry.labelJa || taxonomyEntry.labelEn || taxonomyEntry.id)
        : (taxonomyEntry.labelEn || taxonomyEntry.labelJa || taxonomyEntry.id);
}

function getProgressLevelDescription(level) {
    const taxonomyEntry = getProgressTaxonomyEntry(level);
    return normalizeLang(state.lang) === 'ja'
        ? (taxonomyEntry.descriptionJa || taxonomyEntry.descriptionEn || '')
        : (taxonomyEntry.descriptionEn || taxonomyEntry.descriptionJa || '');
}

function getProgressLevelTone(level) {
    const taxonomyEntry = getProgressTaxonomyEntry(level);
    return taxonomyEntry.tone || 'secondary';
}

function countReportsByProgressLevel(reports = []) {
    return reports.reduce((counts, report) => {
        const level = normalizeProgressLevelId(report?.progressLevel);
        if (!level) return counts;
        counts[level] = (counts[level] || 0) + 1;
        return counts;
    }, {});
}

function getPresentProgressTaxonomy() {
    return state.progressTaxonomy.filter((entry) => (state.progressLevelCounts[entry.id] || 0) > 0);
}

function getAvailableFilterKeys() {
    return new Set(['all', ...getPresentProgressTaxonomy().map((entry) => entry.id)]);
}

function getLevelLegendText(strings = getStrings(state.lang)) {
    const presentTaxonomy = getPresentProgressTaxonomy();
    if (!presentTaxonomy.length) {
        return strings.levelLegend;
    }

    if (presentTaxonomy.length === 1) {
        const level = presentTaxonomy[0].id;
        const count = state.progressLevelCounts[level] || 0;
        const label = getProgressLevelLabel(level, strings);
        return strings.levelLegendSingle
            .replace('{count}', String(count))
            .replace('{label}', label);
    }

    const lang = normalizeLang(state.lang);
    const legendItems = presentTaxonomy.map((entry) => {
        const label = getProgressLevelLabel(entry.id, strings);
        const description = getProgressLevelDescription(entry.id);
        if (!description) return label;
        return lang === 'ja'
            ? `${label}（${description}）`
            : `${label} (${description})`;
    });
    return `${strings.levelLegendPrefix}: ${legendItems.join(' / ')}`;
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

// Policy:
// Open PDFs in-browser for reading (new tab), not as forced downloads.
// Normalize known raw/blob URL forms to browser-viewable pages URL when possible.
function normalizePdfBrowserUrl(rawUrl) {
    const resolved = safeUrl(rawUrl, '');
    if (!resolved) return '';

    try {
        const parsed = new URL(resolved);
        if (!/\.pdf(?:$|[?#])/i.test(parsed.pathname)) {
            return resolved;
        }

        if (parsed.hostname === 'raw.githubusercontent.com') {
            const parts = parsed.pathname.split('/').filter(Boolean);
            if (parts.length >= 4) {
                const [owner, repo, _branch, ...restPath] = parts;
                return `https://${owner}.github.io/${repo}/${restPath.join('/')}`;
            }
        }

        if (parsed.hostname === 'github.com') {
            const parts = parsed.pathname.split('/').filter(Boolean);
            if (parts.length >= 5 && parts[2] === 'blob') {
                const [owner, repo, _blob, _branch, ...restPath] = parts;
                return `https://${owner}.github.io/${repo}/${restPath.join('/')}`;
            }
        }

        return resolved;
    } catch {
        return '';
    }
}

async function isPdfReachable(pdfUrl) {
    const normalizedPdfUrl = normalizePdfBrowserUrl(pdfUrl);
    if (!normalizedPdfUrl) return false;

    try {
        const headResponse = await fetch(normalizedPdfUrl, { method: 'HEAD', cache: 'no-store' });
        if (headResponse.ok) return true;
        if (headResponse.status !== 405 && headResponse.status !== 501) {
            return false;
        }
    } catch {
        // Fall through to range request fallback.
    }

    try {
        const rangeResponse = await fetch(normalizedPdfUrl, {
            method: 'GET',
            headers: { Range: 'bytes=0-0' },
            cache: 'no-store',
        });
        return rangeResponse.ok || rangeResponse.status === 206;
    } catch {
        return false;
    }
}

async function resolveFirstAvailablePdfUrl(sources = []) {
    for (const source of sources) {
        const candidate = normalizePdfBrowserUrl(source?.pdfUrl);
        if (!candidate) continue;
        if (await isPdfReachable(candidate)) {
            return candidate;
        }
    }
    return '';
}

/**
 * Refactor context:
 * - Primary markdown reference: https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/publications/creation/md/*
 * - Primary JSON reference: https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/publications/creation/*
 * - Primary PDF reference: https://uminomae.github.io/pjdhiro/assets/publications/creation/*
 * - PDF behavior policy: open in browser for reading (new tab), not download-first links.
 *   Keep/normalize PDF URLs so "Open PDF" is view-oriented.
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
            candidates.push(`${PJDHIRO_RAW_BASE}/${filePath}`);
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

function normalizeProgressLevel(rawLevel, rawStatus) {
    const level = normalizeProgressLevelId(rawLevel);
    if (level) return level;

    if (rawStatus === 'published') return 'analysis_complete';
    return 'quick_scan';
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

    // v2.0: md/pdf can be objects { ja: "path", en: "path" }
    const mdRaw = report?.md;
    const pdfRaw = report?.pdf;

    return {
        id,
        slug: typeof report?.slug === 'string' ? report.slug.trim() : '',
        nameJa,
        nameEn,
        status: report?.status === 'published' ? 'published' : 'planned',
        progressLevel: normalizeProgressLevel(report?.progress_level, report?.status),
        progressNote: typeof report?.progress_note === 'string' ? report.progress_note.trim() : '',
        mdPath: typeof mdRaw === 'string' ? mdRaw.trim() : '',
        pdfPath: typeof pdfRaw === 'string' ? pdfRaw.trim() : '',
        mdByLang: typeof mdRaw === 'object' && mdRaw !== null ? mdRaw : null,
        pdfByLang: typeof pdfRaw === 'object' && pdfRaw !== null ? pdfRaw : null,
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
    state.dom.levelLegend = document.getElementById('reports-level-legend');
    state.dom.featureCards = document.getElementById('reports-feature-cards');
    state.dom.metrics = document.getElementById('reports-metrics');
    state.dom.domainGrid = document.getElementById('reports-domain-grid');
    state.dom.filterGroup = document.getElementById('reports-table-filters');
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
            pdfUrl: normalizePdfBrowserUrl(source?.pdfUrl),
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
    const sources = [];

    if (primary) {
        sources.push(...buildLocalizedSourceCandidates(primary, lang));
    }
    return dedupeSources(sources);
}

function withEnglishAssetSuffix(path) {
    if (typeof path !== 'string' || !path.trim()) return '';
    const trimmed = path.trim();
    if (/-en(?=\.[a-z0-9]+(?:[?#].*)?$)/i.test(trimmed)) {
        return trimmed;
    }
    if (/-ja(?=\.[a-z0-9]+(?:[?#].*)?$)/i.test(trimmed)) {
        return trimmed.replace(/-ja(?=\.[a-z0-9]+(?:[?#].*)?$)/i, '-en');
    }
    if (/\.[a-z0-9]+(?:[?#].*)?$/i.test(trimmed)) {
        return trimmed.replace(/(\.[a-z0-9]+(?:[?#].*)?)$/i, '-en$1');
    }
    return `${trimmed}-en`;
}

function hasExplicitEnglishDirectory(path) {
    if (typeof path !== 'string') return false;
    return /\/en\/(?:md|pdf)\//i.test(path);
}

function buildCreationDomainSource(report, lang = state.lang) {
    if (typeof report?.id !== 'string' || typeof report?.slug !== 'string') return null;
    if (!report.id.trim() || !report.slug.trim()) return null;
    const idOrig = report.id.trim();
    const slug = report.slug.trim();
    const normalizedLang = normalizeLang(lang);
    const baseName = `domain-${idOrig}-${slug}`;
    return {
        mdUrl: `${PJDHIRO_CREATION_RAW}/domains/${normalizedLang}/md/${baseName}.md`,
        pdfUrl: `${PJDHIRO_CREATION_PAGES}/domains/${normalizedLang}/pdf/${baseName}.pdf`,
    };
}

function buildLocalizedSourceCandidates(source, lang = state.lang) {
    const normalizedLang = normalizeLang(lang);
    const baseSource = {
        mdUrl: safeUrl(source?.mdUrl, ''),
        pdfUrl: safeUrl(source?.pdfUrl, ''),
    };

    if (normalizedLang !== 'en') {
        return dedupeSources([baseSource]);
    }

    const enSource = {
        mdUrl: safeUrl(
            hasExplicitEnglishDirectory(baseSource.mdUrl) ? baseSource.mdUrl : withEnglishAssetSuffix(baseSource.mdUrl),
            '',
        ),
        pdfUrl: safeUrl(
            hasExplicitEnglishDirectory(baseSource.pdfUrl) ? baseSource.pdfUrl : withEnglishAssetSuffix(baseSource.pdfUrl),
            '',
        ),
    };
    return dedupeSources([enSource]);
}

function resolveV2LangPath(pathByLang, lang, urlBase) {
    if (!pathByLang || typeof pathByLang !== 'object') return '';
    const relPath = pathByLang[lang];
    if (typeof relPath !== 'string' || !relPath.trim()) return '';
    return `${urlBase}/${relPath.trim()}`;
}

function resolveDomainReportSources(report) {
    const lang = normalizeLang(state.lang);
    const sources = [];

    // v2.0: md/pdf are language-keyed objects with CREATION_PATH-relative paths
    if (report.mdByLang) {
        const mdUrl = resolveV2LangPath(report.mdByLang, lang, PJDHIRO_CREATION_RAW);
        const pdfUrl = resolveV2LangPath(report.pdfByLang, lang, PJDHIRO_CREATION_PAGES);
        if (mdUrl) {
            sources.push({ mdUrl, pdfUrl: pdfUrl || '' });
        }
    }

    const creationSource = buildCreationDomainSource(report, lang);
    if (creationSource) {
        sources.push(...buildLocalizedSourceCandidates(creationSource, lang));
    }

    // v1.0 fallback: md/pdf as plain string paths
    const hasBaseMarkdown = typeof report?.mdPath === 'string' && report.mdPath.trim();
    if (hasBaseMarkdown) {
        const baseSource = {
            mdUrl: resolveReportAssetUrl(report.mdPath),
            pdfUrl: resolveReportAssetUrl(report?.pdfPath),
        };
        sources.push(...buildLocalizedSourceCandidates(baseSource, lang));
    }

    return dedupeSources(sources);
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
    const availablePdfUrlPromise = resolveFirstAvailablePdfUrl(modalSources);
    setMarkdownModalLoading({ title, pdfUrl: '' });
    modal.show();

    try {
        const marked = await getMarked();
        let raw = '';
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
        const availablePdfUrl = await availablePdfUrlPromise;

        if (requestId !== state.mdRequestId) return;
        setModalPdfButton(availablePdfUrl);
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
        const availablePdfUrl = await availablePdfUrlPromise.catch(() => '');
        if (requestId !== state.mdRequestId) return;
        const strings = getStrings(state.lang);
        if (state.dom.mdModalMeta) {
            state.dom.mdModalMeta.textContent = '';
        }
        if (state.dom.mdModalContent) {
            const pendingMessage = normalizeLang(state.lang) === 'en' ? strings.modalPreparing : strings.modalError;
            state.dom.mdModalContent.innerHTML = `<p class="text-warning-emphasis mb-0">${pendingMessage}</p>`;
        }
        setModalPdfButton(availablePdfUrl);
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
            if (!getAvailableFilterKeys().has(nextFilter) || nextFilter === state.tableFilter) return;

            state.tableFilter = nextFilter;
            updateFilterButtons();
            renderDomainGrid();
        });
        state.dom.filterGroup.dataset.boundClick = '1';
    }

    state.quickLinksBound = true;
}

function createFilterButton({ filterKey, label, isActive }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `btn btn-outline-light btn-sm${isActive ? ' active' : ''}`;
    button.dataset.filter = filterKey;
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    button.textContent = label;
    return button;
}

function updateFilterButtons() {
    if (!state.dom.filterGroup) return;

    const strings = getStrings(state.lang);
    const presentTaxonomy = getPresentProgressTaxonomy();
    if (presentTaxonomy.length <= 1) {
        state.tableFilter = 'all';
        state.dom.filterGroup.innerHTML = '';
        state.dom.filterGroup.classList.add('d-none');
        return;
    }

    state.dom.filterGroup.classList.remove('d-none');
    if (!getAvailableFilterKeys().has(state.tableFilter)) {
        state.tableFilter = 'all';
    }

    const fragment = document.createDocumentFragment();
    fragment.appendChild(createFilterButton({
        filterKey: 'all',
        label: strings.filterAll,
        isActive: state.tableFilter === 'all',
    }));

    presentTaxonomy.forEach((entry) => {
        fragment.appendChild(createFilterButton({
            filterKey: entry.id,
            label: getProgressLevelLabel(entry.id, strings),
            isActive: state.tableFilter === entry.id,
        }));
    });

    state.dom.filterGroup.innerHTML = '';
    state.dom.filterGroup.appendChild(fragment);
}

function applyStaticText() {
    const strings = getStrings(state.lang);

    if (state.dom.domainsHeading) state.dom.domainsHeading.textContent = strings.tabDomains;
    if (state.dom.modelsHeading) state.dom.modelsHeading.textContent = strings.tabModels;
    if (state.dom.levelLegend) state.dom.levelLegend.textContent = getLevelLegendText(strings);

    if (state.dom.filterGroup) state.dom.filterGroup.setAttribute('aria-label', strings.filterGroupAria);
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
                title: featureText.modalTitle || featureText.title,
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

function createMetricCard(label, value, tone = 'default') {
    const col = document.createElement('div');
    col.className = 'col-6 col-lg';

    const card = document.createElement('div');
    card.className = 'card report-metric-card h-100 border-secondary-subtle';
    if (tone === 'warning') card.classList.add('border-warning-subtle');
    if (tone === 'primary') card.classList.add('border-primary-subtle');
    if (tone === 'success') card.classList.add('border-success-subtle');

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
    const generatedValue = state.generatedAt ? formatDate(state.generatedAt) : '-';

    state.dom.metrics.innerHTML = '';
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createMetricCard(strings.metricGenerated, generatedValue));
    fragment.appendChild(createMetricCard(strings.metricTotal, String(total)));

    getPresentProgressTaxonomy().forEach((entry) => {
        fragment.appendChild(createMetricCard(
            getProgressLevelLabel(entry.id, strings),
            String(state.progressLevelCounts[entry.id] || 0),
            getProgressLevelTone(entry.id),
        ));
    });

    state.dom.metrics.appendChild(fragment);
}

function createDomainGridItem({ report, muted = false, strings }) {
    const useJapanese = normalizeLang(state.lang) === 'ja';
    const domainLabel = useJapanese
        ? (report.nameJa || report.nameEn)
        : (report.nameEn || report.nameJa);
    const level = normalizeProgressLevelId(report.progressLevel) || 'quick_scan';
    const statusText = getProgressLevelLabel(level, strings);
    const tone = getProgressLevelTone(level);
    const sources = resolveDomainReportSources(report);
    const clickable = sources.length > 0 && !muted;
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
        `is-level-${level.replace(/_/g, '-')}`,
        muted ? 'is-filter-muted' : '',
    ].join(' ').trim();
    tile.setAttribute('data-report-level', level);
    tile.setAttribute('aria-label', `${reportTitle} ${statusText}`);
    if (report.progressNote) {
        tile.setAttribute('title', `${reportTitle} — ${report.progressNote}`);
    }
    if (!clickable) {
        tile.setAttribute('aria-disabled', 'true');
    }

    const badgeClass = ({
        warning: 'text-bg-warning text-dark',
        primary: 'text-bg-primary',
        success: 'text-bg-success',
        secondary: 'text-bg-secondary',
    })[tone] || 'text-bg-secondary';

    const body = document.createElement('div');
    body.className = 'card-body p-1 d-flex flex-column reports-domain-item-body';

    const head = document.createElement('div');
    head.className = 'd-flex align-items-center justify-content-between gap-2 reports-domain-item-head';

    const idNode = document.createElement('span');
    idNode.className = 'reports-domain-item-id';
    idNode.textContent = report.id;

    const statusNode = document.createElement('span');
    statusNode.className = `badge rounded-pill ${badgeClass} reports-domain-item-status`;
    statusNode.textContent = statusText;

    const nameNode = document.createElement('div');
    nameNode.className = 'reports-domain-item-name';
    nameNode.title = domainLabel;
    nameNode.textContent = domainLabel;

    head.appendChild(idNode);
    head.appendChild(statusNode);
    body.appendChild(head);
    body.appendChild(nameNode);
    tile.appendChild(body);

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
        const muted = state.tableFilter !== 'all' && report.progressLevel !== state.tableFilter;
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
    const normalizedReports = sortReportsById(rawReports.map(normalizeReport));
    const normalizedTaxonomy = normalizeProgressTaxonomy(payload?.progress_taxonomy, normalizedReports);
    const adjustedData = applyDebugProgressTaxonomy({
        reports: normalizedReports,
        progressTaxonomy: normalizedTaxonomy,
    });
    state.reports = adjustedData.reports;
    state.progressTaxonomy = adjustedData.progressTaxonomy;
    state.progressLevelCounts = countReportsByProgressLevel(state.reports);
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
    state.progressTaxonomy = normalizeProgressTaxonomy([]);
    state.progressLevelCounts = countReportsByProgressLevel([]);
    state.tableFilter = 'all';
    state.loadError = false;

    renderReports();

    try {
        await loadReportsData();
        state.loadError = false;
    } catch (error) {
        state.reports = [];
        state.progressTaxonomy = normalizeProgressTaxonomy([]);
        state.progressLevelCounts = countReportsByProgressLevel([]);
        state.loadError = true;
        console.warn('[reports] load failed:', error);
    }

    renderReports();
}

export function setReportsLanguage(lang) {
    state.lang = normalizeLang(lang);
    renderReports();
}
