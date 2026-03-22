import { normalizeLang } from '../i18n.js';
import {
    DEFAULT_PROGRESS_TAXONOMY,
    DEFAULT_REPORTS_ASSET_BASE,
    DEFAULT_REPORTS_DATA_URL,
    DEFAULT_REPORTS_MD_ASSET_BASE,
    GUIDES_MANIFEST_URL,
    PHASE8_THEMES_MANIFEST_URL,
    countReportsByProgressLevel,
    loadGuidesGeneratedAt,
    loadReportsData,
    normalizeAssetBaseUrl,
    normalizeDomainId,
    normalizeProgressTaxonomy,
    resolveDomainReportSources,
} from './data.js';
import {
    createReportsHistoryController,
    DOMAIN_HISTORY_MODE_INITIAL,
    DOMAIN_HISTORY_MODE_PUSH,
} from './history.js';
import { createReportsModalController } from './modal.js';
import { createReportsRenderer, getDomainReportTitle, getReportsStrings } from './render.js';
import { createPhase8Renderer, loadPhase8Themes } from './phase8.js';
import { createSynthesisRenderer } from './synthesis.js';
import { createThemeVerificationRenderer } from './theme-verification.js';

const state = {
    lang: 'ja',
    generatedAt: '',
    guidesGeneratedAt: '',
    reports: [],
    progressTaxonomy: DEFAULT_PROGRESS_TAXONOMY.map((entry) => ({ ...entry })),
    progressLevelCounts: {},
    activeScenario: null,
    tableFilter: 'all',
    loadError: false,
    dataUrl: DEFAULT_REPORTS_DATA_URL,
    assetBaseUrl: DEFAULT_REPORTS_ASSET_BASE,
    assetMdBaseUrl: DEFAULT_REPORTS_MD_ASSET_BASE,
    mdModalInstance: null,
    mdRequestId: 0,
    quickLinksBound: false,
    reportsReady: false,
    phase8Themes: [],
    phase8GeneratedAt: '',
    activeDomainId: '',
    activeDomainHistoryMode: '',
    pendingDomainId: '',
    pendingDomainHistoryMode: '',
    _isHistorySyncing: false,
    historyEventsBound: false,
    dom: {
        error: null,
        openStatusBtn: null,
        domainsHeading: null,
        scenarioNote: null,
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
        phase8Heading: null,
        phase8Description: null,
        phase8Grid: null,
    },
};

let historyController;
let openDomainModalByIdImpl = () => false;

const modalController = createReportsModalController({
    state,
    getStrings: getReportsStrings,
    setActiveDomainModalState: (...args) => historyController?.setActiveDomainModalState(...args),
});

const renderer = createReportsRenderer({
    state,
    openMarkdownModal: (...args) => modalController.openMarkdownModal(...args),
    openDomainModalById: (...args) => openDomainModalByIdImpl(...args),
    getReportSources: (report) => resolveDomainReportSources(report, {
        lang: state.lang,
        assetBaseUrl: state.assetBaseUrl,
        assetMdBaseUrl: state.assetMdBaseUrl,
    }),
});

const phase8Renderer = createPhase8Renderer({
    openMarkdownModal: (...args) => modalController.openMarkdownModal(...args),
    getLang: () => state.lang,
});

const synthesisRenderer = createSynthesisRenderer({
    openMarkdownModal: (...args) => modalController.openMarkdownModal(...args),
    getLang: () => state.lang,
});

const themeVerificationRenderer = createThemeVerificationRenderer({
    openMarkdownModal: (...args) => modalController.openMarkdownModal(...args),
    getLang: () => state.lang,
});

historyController = createReportsHistoryController({
    state,
    ensureMdModalInstance: () => modalController.ensureMdModalInstance(),
    isMdModalVisible: () => modalController.isMdModalVisible(),
    openDomainModalById: (...args) => openDomainModalByIdImpl(...args),
});

function findReportById(domainId) {
    const normalizedId = normalizeDomainId(domainId);
    if (!normalizedId) return null;
    return state.reports.find((report) => normalizeDomainId(report?.id) === normalizedId) || null;
}

openDomainModalByIdImpl = function openDomainModalById(
    domainId,
    {
        historyMode = DOMAIN_HISTORY_MODE_PUSH,
        syncUrl = 'push',
    } = {},
) {
    const normalizedId = normalizeDomainId(domainId);
    const report = findReportById(normalizedId);
    if (!report) return false;

    const sources = resolveDomainReportSources(report, {
        lang: state.lang,
        assetBaseUrl: state.assetBaseUrl,
        assetMdBaseUrl: state.assetMdBaseUrl,
    });
    if (!sources.length) return false;

    let resolvedHistoryMode = historyMode === DOMAIN_HISTORY_MODE_INITIAL
        ? DOMAIN_HISTORY_MODE_INITIAL
        : DOMAIN_HISTORY_MODE_PUSH;

    if (syncUrl === 'push') {
        const currentDomainId = historyController.getDomainIdFromUrl();
        const currentHistoryMode = historyController.getDomainHistoryMarker(window.history?.state, currentDomainId)?.mode;
        if (currentDomainId !== normalizedId || currentHistoryMode !== DOMAIN_HISTORY_MODE_PUSH) {
            const didPush = historyController.updateDomainHistoryEntry(normalizedId, {
                method: 'push',
                mode: DOMAIN_HISTORY_MODE_PUSH,
            });
            if (!didPush) {
                historyController.updateDomainHistoryEntry(normalizedId, {
                    method: 'replace',
                    mode: DOMAIN_HISTORY_MODE_INITIAL,
                });
                resolvedHistoryMode = DOMAIN_HISTORY_MODE_INITIAL;
            }
        }
    } else if (syncUrl === 'replace') {
        historyController.updateDomainHistoryEntry(normalizedId, {
            method: 'replace',
            mode: resolvedHistoryMode,
        });
    }

    historyController.clearPendingDomainSync();
    modalController.openMarkdownModal({
        title: getDomainReportTitle(report, state.lang),
        sources,
        modalContext: {
            type: 'domain',
            domainId: normalizedId,
            historyMode: resolvedHistoryMode,
        },
    });
    return true;
};

export async function initReports({
    lang = 'ja',
    dataUrl = DEFAULT_REPORTS_DATA_URL,
    assetBaseUrl = DEFAULT_REPORTS_ASSET_BASE,
    assetMdBaseUrl = DEFAULT_REPORTS_MD_ASSET_BASE,
} = {}) {
    renderer.cacheDom();
    phase8Renderer.cacheDom();
    synthesisRenderer.cacheDom();
    themeVerificationRenderer.cacheDom();
    renderer.bindUiEvents();
    historyController.bindHistorySyncEvents();

    state.lang = normalizeLang(lang);
    state.dataUrl = dataUrl;
    state.assetBaseUrl = normalizeAssetBaseUrl(assetBaseUrl);
    state.assetMdBaseUrl = normalizeAssetBaseUrl(assetMdBaseUrl, DEFAULT_REPORTS_MD_ASSET_BASE);
    state.generatedAt = '';
    state.reports = [];
    state.progressTaxonomy = normalizeProgressTaxonomy([]);
    state.progressLevelCounts = countReportsByProgressLevel([]);
    state.activeScenario = null;
    state.tableFilter = 'all';
    state.loadError = false;
    state.reportsReady = false;
    historyController.clearPendingDomainSync();

    renderer.renderReports();

    const guidesDatePromise = loadGuidesGeneratedAt(GUIDES_MANIFEST_URL);

    try {
        const loaded = await loadReportsData({
            dataUrl: state.dataUrl,
            lang: state.lang,
            assetBaseUrl: state.assetBaseUrl,
            assetMdBaseUrl: state.assetMdBaseUrl,
        });
        state.generatedAt = loaded.generatedAt;
        state.reports = loaded.reports;
        state.progressTaxonomy = loaded.progressTaxonomy;
        state.progressLevelCounts = loaded.progressLevelCounts;
        state.activeScenario = loaded.activeScenario;
        state.loadError = false;
        state.reportsReady = true;
        state.guidesGeneratedAt = await guidesDatePromise;
    } catch (error) {
        state.reports = [];
        state.progressTaxonomy = normalizeProgressTaxonomy([]);
        state.progressLevelCounts = countReportsByProgressLevel([]);
        state.activeScenario = null;
        state.loadError = true;
        state.reportsReady = false;
        console.warn('[reports] load failed:', error);
    }

    renderer.renderReports();

    // Load Phase 8 cross-domain themes
    try {
        const phase8Data = await loadPhase8Themes();
        state.phase8Themes = phase8Data.themes;
        state.phase8GeneratedAt = phase8Data.generatedAt;
    } catch (error) {
        console.warn('[reports] phase8 themes load failed:', error);
        state.phase8Themes = [];
    }
    phase8Renderer.renderThemes(state.phase8Themes);

    synthesisRenderer.renderSynthesis();
    themeVerificationRenderer.renderVerification();


    if (!state.loadError) {
        historyController.syncDomainModalWithUrl({
            historyState: window.history?.state,
            fallbackHistoryMode: state.pendingDomainHistoryMode,
            treatAsInitial: !state.pendingDomainHistoryMode && Boolean(historyController.getDomainIdFromUrl()),
        });
    }
}

export function setReportsLanguage(lang) {
    state.lang = normalizeLang(lang);
    renderer.renderReports();
    phase8Renderer.renderThemes(state.phase8Themes);
    synthesisRenderer.renderSynthesis();
    themeVerificationRenderer.renderVerification();
}

export {
    DEFAULT_PROGRESS_TAXONOMY,
    DEFAULT_REPORTS_ASSET_BASE,
    DEFAULT_REPORTS_DATA_URL,
    DEFAULT_REPORTS_MD_ASSET_BASE,
    GUIDES_MANIFEST_URL,
    PHASE8_THEMES_MANIFEST_URL,
};
