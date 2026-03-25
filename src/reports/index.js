import { normalizeLang } from '../i18n.js';
import {
    DEFAULT_PROGRESS_TAXONOMY,
    DEFAULT_REPORTS_ASSET_BASE,
    DEFAULT_REPORTS_DATA_URL,
    DEFAULT_REPORTS_MD_ASSET_BASE,
    GUIDES_MANIFEST_URL,
    MODEL_GUIDE_LINKS,
    PHASE8_THEMES_MANIFEST_URL,
    countReportsByProgressLevel,
    loadGuidesGeneratedAt,
    loadReportsData,
    normalizeAssetBaseUrl,
    normalizeDomainId,
    normalizeProgressTaxonomy,
    resolveLocalizedSources,
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
    config: {
        lang: 'ja',
        dataUrl: DEFAULT_REPORTS_DATA_URL,
        assetBaseUrl: DEFAULT_REPORTS_ASSET_BASE,
        assetMdBaseUrl: DEFAULT_REPORTS_MD_ASSET_BASE,
    },
    data: {
        reports: [],
        generatedAt: '',
        guidesGeneratedAt: '',
        progressTaxonomy: DEFAULT_PROGRESS_TAXONOMY.map((entry) => ({ ...entry })),
        progressLevelCounts: {},
        activeScenario: null,
        phase8Themes: [],
        phase8GeneratedAt: '',
        reportsReady: false,
        loadError: false,
    },
    ui: {
        tableFilter: 'all',
        quickLinksBound: false,
    },
    modal: {
        mdModalInstance: null,
        mdRequestId: 0,
        activeDomainId: '',
        activeDomainHistoryMode: '',
        pendingDomainId: '',
        pendingDomainHistoryMode: '',
        _isHistorySyncing: false,
        historyEventsBound: false,
    },
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
        lang: state.config.lang,
        assetBaseUrl: state.config.assetBaseUrl,
        assetMdBaseUrl: state.config.assetMdBaseUrl,
    }),
});

const phase8Renderer = createPhase8Renderer({
    openMarkdownModal: (...args) => modalController.openMarkdownModal(...args),
    getLang: () => state.config.lang,
});

const synthesisRenderer = createSynthesisRenderer({
    openMarkdownModal: (...args) => modalController.openMarkdownModal(...args),
    getLang: () => state.config.lang,
});

const themeVerificationRenderer = createThemeVerificationRenderer({
    openMarkdownModal: (...args) => modalController.openMarkdownModal(...args),
    getLang: () => state.config.lang,
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
    return state.data.reports.find((report) => normalizeDomainId(report?.id) === normalizedId) || null;
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
        lang: state.config.lang,
        assetBaseUrl: state.config.assetBaseUrl,
        assetMdBaseUrl: state.config.assetMdBaseUrl,
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
        title: getDomainReportTitle(report, state.config.lang),
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

    state.config.lang = normalizeLang(lang);
    state.config.dataUrl = dataUrl;
    state.config.assetBaseUrl = normalizeAssetBaseUrl(assetBaseUrl);
    state.config.assetMdBaseUrl = normalizeAssetBaseUrl(assetMdBaseUrl, DEFAULT_REPORTS_MD_ASSET_BASE);
    state.data.generatedAt = '';
    state.data.reports = [];
    state.data.progressTaxonomy = normalizeProgressTaxonomy([]);
    state.data.progressLevelCounts = countReportsByProgressLevel([]);
    state.data.activeScenario = null;
    state.ui.tableFilter = 'all';
    state.data.loadError = false;
    state.data.reportsReady = false;
    historyController.clearPendingDomainSync();

    renderer.renderReports();

    const guidesDatePromise = loadGuidesGeneratedAt(GUIDES_MANIFEST_URL);

    try {
        const loaded = await loadReportsData({
            dataUrl: state.config.dataUrl,
            lang: state.config.lang,
            assetBaseUrl: state.config.assetBaseUrl,
            assetMdBaseUrl: state.config.assetMdBaseUrl,
        });
        state.data.generatedAt = loaded.generatedAt;
        state.data.reports = loaded.reports;
        state.data.progressTaxonomy = loaded.progressTaxonomy;
        state.data.progressLevelCounts = loaded.progressLevelCounts;
        state.data.activeScenario = loaded.activeScenario;
        state.data.loadError = false;
        state.data.reportsReady = true;
        state.data.guidesGeneratedAt = await guidesDatePromise;
    } catch (error) {
        state.data.reports = [];
        state.data.progressTaxonomy = normalizeProgressTaxonomy([]);
        state.data.progressLevelCounts = countReportsByProgressLevel([]);
        state.data.activeScenario = null;
        state.data.loadError = true;
        state.data.reportsReady = false;
        console.warn('[reports] load failed:', error);
    }

    renderer.renderReports();

    // Load Phase 8 cross-domain themes
    try {
        const phase8Data = await loadPhase8Themes();
        state.data.phase8Themes = phase8Data.themes;
        state.data.phase8GeneratedAt = phase8Data.generatedAt;
    } catch (error) {
        console.warn('[reports] phase8 themes load failed:', error);
        state.data.phase8Themes = [];
    }
    phase8Renderer.renderThemes(state.data.phase8Themes);

    synthesisRenderer.renderSynthesis();
    themeVerificationRenderer.renderVerification();


    if (!state.data.loadError) {
        historyController.syncDomainModalWithUrl({
            historyState: window.history?.state,
            fallbackHistoryMode: state.modal.pendingDomainHistoryMode,
            treatAsInitial: !state.modal.pendingDomainHistoryMode && Boolean(historyController.getDomainIdFromUrl()),
        });
    }

    // Auto-open guide modal from ?guide=general|designer|expert
    try {
        const guideKey = new URLSearchParams(window.location.search).get('guide');
        if (guideKey) {
            const guide = MODEL_GUIDE_LINKS.find((g) => g.key === guideKey);
            if (guide) {
                const strings = getReportsStrings(state.config.lang);
                const featureText = strings.features[guide.key];
                if (featureText) {
                    modalController.openMarkdownModal({
                        title: featureText.modalTitle || featureText.title,
                        sources: resolveLocalizedSources(guide.links, state.config.lang),
                    });
                }
            }
        }
    } catch { /* ignore parse errors */ }
}

export function setReportsLanguage(lang) {
    state.config.lang = normalizeLang(lang);
    renderer.renderReports();
    phase8Renderer.renderThemes(state.data.phase8Themes);
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
