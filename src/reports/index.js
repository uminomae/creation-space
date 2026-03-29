import { normalizeLang } from '../i18n.js';
import {
    DEFAULT_PROGRESS_TAXONOMY,
    DEFAULT_REPORTS_ASSET_BASE,
    DEFAULT_REPORTS_DATA_URL,
    DEFAULT_REPORTS_MD_ASSET_BASE,
    GUIDES_MANIFEST_URL,
    MODEL_GUIDE_LINKS,
    PHASE8_THEMES_MANIFEST_URL,
    STATUS_REPORT_LINKS,
    SURVEY_MANIFEST_URL,
    SYNTHESIS_REPORT_LINKS,
    SYNTHESIS_PRESENTATION_LINKS,
    countReportsByProgressLevel,
    loadGuidesGeneratedAt,
    loadReportsData,
    normalizeAssetBaseUrl,
    normalizeDomainId,
    normalizeProgressTaxonomy,
    resolveLocalizedSources,
    resolveDomainReportSources,
    resolveDomainPresentationSources,
} from './data.js';
import {
    createReportsHistoryController,
    DOMAIN_HISTORY_MODE_INITIAL,
    DOMAIN_HISTORY_MODE_PUSH,
} from './history.js';
import { createGenericHistoryController } from './generic-history.js';
import { createSlideHistoryController } from '../slide-history.js';
import { createReportsModalController } from './modal.js';
import { createReportsRenderer, getDomainReportTitle, getReportsStrings } from './render.js';
import { createPhase8Renderer, loadPhase8Themes } from './phase8.js';
import { createSynthesisRenderer } from './synthesis.js';
import { createThemeVerificationRenderer, THEME_DATA, INTEGRATION_REPORT, THEME_VERIFICATION_BASE } from './theme-verification.js';
import { openRichSlideViewer } from '../slide-viewer.js';

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
        // Generic modal & guide history state
        activeGenericModalKey: '',
        activeGenericHistoryMode: '',
        activeGuideKey: '',
        activeGuideHistoryMode: '',
    },
    slide: {
        activeSlideKey: '',
        activeSlideHistoryMode: '',
        _isHistorySyncing: false,
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
    // Opener registries for page-load sync (populated after data loads)
    _modalOpeners: new Map(),
    _slideOpeners: new Map(),
};

let historyController;
let genericHistoryController;
let slideHistoryController;
let openDomainModalByIdImpl = () => false;

const modalController = createReportsModalController({
    state,
    getStrings: getReportsStrings,
    setActiveDomainModalState: (...args) => historyController?.setActiveDomainModalState(...args),
    setActiveGuideState: (...args) => genericHistoryController?.setActiveGuideState(...args),
    setActiveGenericModalState: (...args) => genericHistoryController?.setActiveGenericModalState(...args),
    updateGuideHistoryEntry: (...args) => genericHistoryController?.updateGuideHistoryEntry(...args),
    updateGenericHistoryEntry: (...args) => genericHistoryController?.updateGenericHistoryEntry(...args),
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
    wrapSlideOpen: (slideKey) => {
        if (!slideHistoryController) return null;
        slideHistoryController.pushSlideHistory(slideKey);
        return slideHistoryController.createSlideOnClose();
    },
});

const phase8Renderer = createPhase8Renderer({
    openMarkdownModal: (...args) => modalController.openMarkdownModal(...args),
    getLang: () => state.config.lang,
    wrapSlideOpen: (slideKey) => {
        if (!slideHistoryController) return null;
        slideHistoryController.pushSlideHistory(slideKey);
        return slideHistoryController.createSlideOnClose();
    },
});

const synthesisRenderer = createSynthesisRenderer({
    openMarkdownModal: (...args) => modalController.openMarkdownModal(...args),
    getLang: () => state.config.lang,
    wrapSlideOpen: (slideKey) => {
        if (!slideHistoryController) return null;
        slideHistoryController.pushSlideHistory(slideKey);
        return slideHistoryController.createSlideOnClose();
    },
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

genericHistoryController = createGenericHistoryController({
    state,
    ensureMdModalInstance: () => modalController.ensureMdModalInstance(),
    isMdModalVisible: () => modalController.isMdModalVisible(),
});

slideHistoryController = createSlideHistoryController({ state });

// --- Unified event handlers ---

function handleUnifiedMdModalHidden() {
    // _isHistorySyncing means a controller triggered the close (popstate/back)
    if (state.modal._isHistorySyncing) {
        state.modal._isHistorySyncing = false;
        historyController.clearActiveDomainModalState();
        genericHistoryController.clearActiveGuideState();
        genericHistoryController.clearActiveGenericModalState();
        return;
    }

    // Domain takes priority
    if (state.modal.activeDomainId) {
        historyController.handleMdModalHidden();
        return;
    }
    // Guide
    if (state.modal.activeGuideKey) {
        genericHistoryController.handleGuideModalHidden();
        return;
    }
    // Generic modal
    if (state.modal.activeGenericModalKey) {
        genericHistoryController.handleGenericModalHidden();
        return;
    }
}

function handleUnifiedPopState(event) {
    // Domain history handles its own param
    historyController.handleDomainPopState(event);

    // Generic modal / guide handles ?modal= and ?guide=
    genericHistoryController.handlePopState();

    // Slide handles ?slide= independently
    slideHistoryController.handlePopState();
}

function bindUnifiedHistorySyncEvents() {
    if (state.modal.historyEventsBound) return;
    if (state.dom.mdModal) {
        state.dom.mdModal.addEventListener('hidden.bs.modal', handleUnifiedMdModalHidden);
    }
    window.addEventListener('popstate', handleUnifiedPopState);
    state.modal.historyEventsBound = true;
}

// --- Slide opener helpers ---

// --- Modal opener registry builders ---

function buildModalOpenerRegistry() {
    const openers = state._modalOpeners;
    openers.clear();

    // Guide openers
    MODEL_GUIDE_LINKS.forEach((guide) => {
        openers.set('guide-' + guide.key, (historyMode) => {
            const strings = getReportsStrings(state.config.lang);
            const featureText = strings.features[guide.key];
            if (!featureText) return;
            modalController.openMarkdownModal({
                title: featureText.modalTitle || featureText.title,
                sources: resolveLocalizedSources(guide.links, state.config.lang),
                modalContext: { type: 'guide', guideKey: guide.key, historyMode },
            });
        });
    });

    // Status opener
    openers.set('status', (historyMode) => {
        const strings = getReportsStrings(state.config.lang);
        modalController.openMarkdownModal({
            title: strings.statusReportTitle,
            sources: resolveLocalizedSources(STATUS_REPORT_LINKS, state.config.lang),
            modalContext: { type: 'generic', modalKey: 'status', historyMode },
        });
    });

    // Synthesis opener
    openers.set('synthesis', (historyMode) => {
        const lang = state.config.lang;
        const strings = getReportsStrings(lang);
        const synthStrings = strings.synthesis || {};
        modalController.openMarkdownModal({
            title: synthStrings.reportTitle,
            sources: resolveLocalizedSources(SYNTHESIS_REPORT_LINKS, lang),
            modalContext: { type: 'generic', modalKey: 'synthesis', historyMode },
        });
    });

    // Phase 8 theme openers (built after themes are loaded)
    state.data.phase8Themes.forEach((theme) => {
        if (!theme.slug) return;
        openers.set('phase8-' + theme.slug, (historyMode) => {
            const lang = state.config.lang;
            const useJa = normalizeLang(lang) === 'ja';
            const name = useJa ? (theme.nameJa || theme.nameEn || theme.slug) : (theme.nameEn || theme.nameJa || theme.slug);
            const mdUrl = theme.mdByLang
                ? (() => {
                    const PJDHIRO_RAW_BASE = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main';
                    const relPath = theme.mdByLang[normalizeLang(lang)] || theme.mdByLang['ja'];
                    return relPath ? `${PJDHIRO_RAW_BASE}/assets/creation/${relPath}` : '';
                })()
                : '';
            if (!mdUrl) return;
            const pdfUrl = theme.pdfByLang
                ? (() => {
                    const PJDHIRO_RAW_BASE = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main';
                    const relPath = theme.pdfByLang[normalizeLang(lang)] || theme.pdfByLang['ja'];
                    return relPath ? `${PJDHIRO_RAW_BASE}/assets/creation/${relPath}` : '';
                })()
                : '';
            modalController.openMarkdownModal({
                title: name,
                sources: [{ mdUrl, pdfUrl, generatorModel: theme.generatorModel, generated: theme.generated }],
                modalContext: { type: 'generic', modalKey: 'phase8-' + theme.slug, historyMode },
            });
        });
    });

    // Theme verification openers
    THEME_DATA.forEach((theme) => {
        const normalizedId = theme.id.replace(/\+/g, '');
        openers.set('verify-' + normalizedId, (historyMode) => {
            const lang = state.config.lang;
            const useJa = normalizeLang(lang) === 'ja';
            const name = useJa ? theme.nameJa : (theme.nameEn || theme.nameJa);
            const mdUrl = THEME_VERIFICATION_BASE + '/' + theme.mdFile;
            modalController.openMarkdownModal({
                title: name,
                sources: [{ mdUrl }],
                modalContext: { type: 'generic', modalKey: 'verify-' + normalizedId, historyMode },
            });
        });
    });

    // Integration report opener
    openers.set('verify-integration', (historyMode) => {
        const lang = state.config.lang;
        const useJa = normalizeLang(lang) === 'ja';
        const name = useJa ? INTEGRATION_REPORT.nameJa : (INTEGRATION_REPORT.nameEn || INTEGRATION_REPORT.nameJa);
        const mdUrl = THEME_VERIFICATION_BASE + '/' + INTEGRATION_REPORT.mdFile;
        modalController.openMarkdownModal({
            title: name,
            sources: [{ mdUrl }],
            modalContext: { type: 'generic', modalKey: 'verify-integration', historyMode },
        });
    });
}

function buildSlideOpenerRegistry() {
    const openers = state._slideOpeners;
    openers.clear();

    // Domain slide openers
    state.data.reports.forEach((report) => {
        const id = normalizeDomainId(report?.id);
        if (!id) return;
        openers.set(id, async () => {
            const sources = resolveDomainPresentationSources(report, { lang: state.config.lang });
            const source = sources[0];
            if (!source) return;
            const useJa = normalizeLang(state.config.lang) === 'ja';
            const label = useJa ? (report.nameJa || report.nameEn) : (report.nameEn || report.nameJa);
            const title = `${report.id} ${label}`;

            if (source.htmlUrl) {
                try {
                    const resp = await fetch(source.htmlUrl, { method: 'HEAD', cache: 'no-store' });
                    if (resp.ok) {
                        openRichSlideViewer({ htmlUrl: source.htmlUrl, title, onClose: slideHistoryController.createSlideOnClose() });
                        return;
                    }
                } catch { /* fall through */ }
            }
            console.warn('[slide-viewer] rich HTML unavailable for', id);
        });
    });

    // Synthesis slide opener
    openers.set('synthesis', async () => {
        const lang = state.config.lang;
        const sources = resolveLocalizedSources(SYNTHESIS_PRESENTATION_LINKS, lang);
        const source = sources[0];
        if (!source) return;
        const strings = getReportsStrings(lang);
        const title = (strings.synthesis || {}).reportTitle;

        if (source.htmlUrl) {
            try {
                const resp = await fetch(source.htmlUrl, { method: 'HEAD', cache: 'no-store' });
                if (resp.ok) {
                    openRichSlideViewer({ htmlUrl: source.htmlUrl, title, onClose: slideHistoryController.createSlideOnClose() });
                    return;
                }
            } catch { /* fall through */ }
        }
        console.warn('[slide-viewer] rich HTML unavailable for synthesis');
    });

    // Phase 8 theme slide openers
    state.data.phase8Themes.forEach((theme) => {
        if (!theme.slug || !theme.presentationMdByLang) return;
        openers.set('phase8-' + theme.slug, async () => {
            const lang = state.config.lang;
            const PJDHIRO_RAW_BASE = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main';
            const PJDHIRO_PAGES_BASE = 'https://uminomae.github.io/pjdhiro';
            const relPath = theme.presentationMdByLang[normalizeLang(lang)] || theme.presentationMdByLang['ja'];
            if (!relPath) return;
            const mdUrl = `${PJDHIRO_RAW_BASE}/assets/creation/${relPath}`;
            const useJa = normalizeLang(lang) === 'ja';
            const title = useJa ? (theme.nameJa || theme.nameEn || theme.slug) : (theme.nameEn || theme.nameJa || theme.slug);

            // Try rich HTML
            const richHtmlUrl = mdUrl
                .replace(PJDHIRO_RAW_BASE, PJDHIRO_PAGES_BASE)
                .replace(/\/md\/([^/]+)\.md$/, '/html/$1.html');
            if (richHtmlUrl !== mdUrl) {
                try {
                    const resp = await fetch(richHtmlUrl, { method: 'HEAD', cache: 'no-store' });
                    if (resp.ok) {
                        openRichSlideViewer({ htmlUrl: richHtmlUrl, title, onClose: slideHistoryController.createSlideOnClose() });
                        return;
                    }
                } catch { /* fall through */ }
            }

            console.warn('[slide-viewer] rich HTML unavailable for phase8-' + theme.slug);
        });
    });
}

// --- Domain modal opener (unchanged logic) ---

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

// --- Exported helpers for renderers ---

// --- Init ---

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
    bindUnifiedHistorySyncEvents();

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

    // Build opener registries (needs data to be loaded)
    buildModalOpenerRegistry();
    buildSlideOpenerRegistry();

    // --- Page-load URL sync ---

    // 1. Domain sync (highest priority)
    if (!state.data.loadError) {
        historyController.syncDomainModalWithUrl({
            historyState: window.history?.state,
            fallbackHistoryMode: state.modal.pendingDomainHistoryMode,
            treatAsInitial: !state.modal.pendingDomainHistoryMode && Boolean(historyController.getDomainIdFromUrl()),
        });
    }

    // 2. Guide sync (only if no domain modal opened)
    if (!state.modal.activeDomainId) {
        const guideOpened = genericHistoryController.syncGuideWithUrl({ treatAsInitial: true });

        // 3. Generic modal sync (only if no guide opened)
        if (!guideOpened) {
            genericHistoryController.syncGenericModalWithUrl({ treatAsInitial: true });
        }
    }

    // 4. Slide sync (independent of modal, can coexist)
    slideHistoryController.syncSlideWithUrl({ treatAsInitial: true });
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
