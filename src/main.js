import * as THREE from 'three';

import { breathValue } from './animation-utils.js';
import {
    initControls,
    setAutoRotateSpeed,
    setAutoRotateLoopPhase,
    setAutoRotateStartOffsetSec,
    setCameraPosition,
    updateControls,
    getScrollProgress,
} from './controls.js';
import { initMouseTracking, updateMouseSmoothing } from './mouse-state.js';
import { initScrollUI, refreshGuideLang, updateScrollUI } from './scroll-ui.js';
import { initDevPanel } from './dev-panel.js';
import { initCreationLinkInteractions } from './creation-link-interactions.js';
import { initArticles, setArticlesLanguage } from './articles.js';
import { applyConfigState, cloneConfigState } from './config-state.js';
import { applyScenePreset, getScenePresetVersion, resolveSceneVariant } from './scene-presets.js';
import { DEV_VERSION } from './version.js';
import {
    computeIntentRuntimeTimeline,
    resolveIntentLoopAnchorSecForContinuity,
    resolveIntentStartTimingMinForRawContinuity,
    solveStartTimingMinForElapsedSecNow,
    solveStartTimingMinForPhaseNow,
    resolveIntentShiftTurnRange,
    resolveIntentShiftTurnElapsedSecByPathSec,
} from './intent-timeline.js';
import {
    breathConfig,
    distortionParams,
    fluidParams,
    intentMotionParams,
    liquidParams,
    quantumWaveParams,
    sceneParams,
    toggles,
} from './config.js';
import { detectLang } from './i18n.js';

const DEV_MODE = new URLSearchParams(window.location.search).has('dev');
const DEV_PANEL_STATE_PERSIST = new URLSearchParams(window.location.search).get('devstate') === 'persist';
const CAPTURE_ENABLE_MAX_DELTA_SEC = 0.3;
let devStatsBegin = () => {};
let devStatsEnd = () => {};
const GRAPHIC_MODE_DEFAULT = 'hoji';
const GRAPHIC_MODE_OPTIONS = new Set(['hoji', 'sinobi', 'i']);
const DEV_PANEL_STATE_STORAGE_PREFIX = 'creation-dev-panel-state-v1';

function formatStartupError(errorLike) {
    if (!errorLike) return 'Unknown startup error';
    if (typeof errorLike === 'string') return errorLike;
    if (errorLike instanceof Error) {
        return errorLike.stack || `${errorLike.name}: ${errorLike.message}`;
    }
    try {
        return JSON.stringify(errorLike, null, 2);
    } catch {
        return String(errorLike);
    }
}

function showStartupErrorOverlay(errorLike) {
    const doc = window.document;
    if (!doc) return;
    const message = formatStartupError(errorLike);
    let overlay = doc.getElementById('app-startup-error-overlay');
    if (!overlay) {
        overlay = doc.createElement('pre');
        overlay.id = 'app-startup-error-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.maxHeight = '55vh';
        overlay.style.margin = '0';
        overlay.style.padding = '12px 14px';
        overlay.style.zIndex = '99999';
        overlay.style.overflow = 'auto';
        overlay.style.whiteSpace = 'pre-wrap';
        overlay.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        overlay.style.fontSize = '12px';
        overlay.style.lineHeight = '1.45';
        overlay.style.background = 'rgba(31, 9, 13, 0.95)';
        overlay.style.color = '#ffd5db';
        overlay.style.borderBottom = '1px solid rgba(255, 173, 186, 0.42)';
        const parent = doc.body || doc.documentElement;
        if (parent) parent.appendChild(overlay);
    }
    overlay.textContent = `[startup-error]\n${message}`;
}

window.addEventListener('error', (event) => {
    const value = event?.error || event?.message || event;
    showStartupErrorOverlay(value);
});

window.addEventListener('unhandledrejection', (event) => {
    showStartupErrorOverlay(event?.reason || event);
});

function getSceneStateStorageKey(sceneVariant) {
    return `${DEV_PANEL_STATE_STORAGE_PREFIX}:${sceneVariant}`;
}

function loadSceneState(sceneVariant) {
    if (!DEV_PANEL_STATE_PERSIST) return null;
    let storage;
    try {
        storage = window.localStorage;
    } catch (error) {
        return null;
    }
    if (!storage) return null;

    try {
        const raw = storage.getItem(getSceneStateStorageKey(sceneVariant));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return null;

        const expectedPresetVersion = getScenePresetVersion(sceneVariant);
        const statePayload = parsed.state;
        const presetVersion = parsed.presetVersion;

        if (
            typeof presetVersion === 'string' &&
            presetVersion === expectedPresetVersion &&
            statePayload &&
            typeof statePayload === 'object'
        ) {
            return statePayload;
        }

        // Drop legacy or stale state so current scene defaults become effective.
        storage.removeItem(getSceneStateStorageKey(sceneVariant));
        return null;
    } catch (error) {
        console.warn('[dev-panel] failed to load scene state:', error);
        return null;
    }
}

function saveSceneState(sceneVariant, state) {
    if (!DEV_PANEL_STATE_PERSIST) return;
    if (!state || typeof state !== 'object') return;
    let storage;
    try {
        storage = window.localStorage;
    } catch (error) {
        return;
    }
    if (!storage) return;

    try {
        const payload = {
            presetVersion: getScenePresetVersion(sceneVariant),
            state,
        };
        storage.setItem(getSceneStateStorageKey(sceneVariant), JSON.stringify(payload));
    } catch (error) {
        console.warn('[dev-panel] failed to save scene state:', error);
    }
}

const STRINGS = {
    ja: {
        title: '創造とは',
        subtitle: 'Creation Space',
        taglines: [
            '関係し合う欠片が、まだ名前を持たない輪郭を生む。',
            '観測と選択のあいだで、創造は静かに立ち上がる。',
        ],
        topbarMainTitle: '創造とは',
        topbarSubtitle: 'Creation Space',
        topbarHome: 'kesson-driven',
        topbarDev: 'DEV',
        topbarArticles: 'ARTICLES',
        topbarBlog: 'BLOG',
        topbarCollab: 'AIとの協働で探索中',
        creditSignature: 'Project Designer: pjdhiro',
        articlesSectionHeading: 'ARTICLES',
        offcanvasArticlesTitle: 'ARTICLES',
        creationCardsHeading: 'CREATION CARDS',
        creationCardTitlePrefix: 'Card Slot',
        creationCardBody: '内容は後続指定',
        langToggleLabel: 'English',
        langToggleAria: '言語を英語に切り替え',
    },
    en: {
        title: 'What Is Creation',
        subtitle: 'Creation Space',
        taglines: [
            'Fragments in relation generate forms before they are named.',
            'Creation rises quietly between observation and choice.',
        ],
        topbarMainTitle: 'What Is Creation',
        topbarSubtitle: 'Creation Space',
        topbarHome: 'kesson-driven',
        topbarDev: 'DEV',
        topbarArticles: 'ARTICLES',
        topbarBlog: 'BLOG',
        topbarCollab: 'Exploring with AI collaboration',
        creditSignature: 'Project Designer: pjdhiro',
        articlesSectionHeading: 'ARTICLES',
        offcanvasArticlesTitle: 'ARTICLES',
        creationCardsHeading: 'CREATION CARDS',
        creationCardTitlePrefix: 'Card Slot',
        creationCardBody: 'content to be specified',
        langToggleLabel: '日本語',
        langToggleAria: 'Switch language to Japanese',
    },
};

async function loadSceneModule(sceneVariant) {
    if (sceneVariant === 'intent') {
        return import('./scene-intent.js');
    }
    if (sceneVariant === 'wabi') {
        return import('./scene.js');
    }
    return import('./scene-hold.js');
}

let postFxDepsPromise = null;
let fluidFactoryPromise = null;
let liquidFactoryPromise = null;

function loadPostFxDeps() {
    if (!postFxDepsPromise) {
        postFxDepsPromise = Promise.all([
            import('three/addons/postprocessing/EffectComposer.js'),
            import('three/addons/postprocessing/RenderPass.js'),
            import('three/addons/postprocessing/ShaderPass.js'),
            import('./shaders/distortion-pass.js'),
        ]).then(([composerModule, renderPassModule, shaderPassModule, distortionModule]) => ({
            EffectComposer: composerModule.EffectComposer,
            RenderPass: renderPassModule.RenderPass,
            ShaderPass: shaderPassModule.ShaderPass,
            DistortionShader: distortionModule.DistortionShader,
            CameraDofShader: distortionModule.CameraDofShader,
        }));
    }
    return postFxDepsPromise;
}

function loadFluidFactory() {
    if (!fluidFactoryPromise) {
        fluidFactoryPromise = import('./shaders/fluid-field.js').then((module) => module.createFluidSystem);
    }
    return fluidFactoryPromise;
}

function loadLiquidFactory() {
    if (!liquidFactoryPromise) {
        liquidFactoryPromise = import('./shaders/liquid.js').then((module) => module.createLiquidSystem);
    }
    return liquidFactoryPromise;
}

function applyPageLanguage(lang) {
    const strings = STRINGS[lang] || STRINGS.ja;

    const titleH1 = document.getElementById('title-h1');
    const titleSub = document.getElementById('title-sub');
    const taglineContainer = document.getElementById('taglines');
    const topbarMainTitle = document.getElementById('topbar-main-title');
    const topbarSubtitle = document.getElementById('topbar-subtitle');
    const topbarHomeLink = document.getElementById('topbar-home-link');
    const topbarDevLink = document.getElementById('topbar-dev-link');
    const topbarArticlesBtn = document.getElementById('topbar-articles-btn');
    const topbarBlogLink = document.getElementById('topbar-blog-link');
    const topbarCollab = document.getElementById('credit-collab');
    const footerSignature = document.getElementById('footer-signature');
    const articlesSectionHeading = document.getElementById('articles-section-heading');
    const offcanvasArticlesTitle = document.getElementById('offcanvas-articles-title');
    const creationCardsHeading = document.getElementById('creation-cards-heading');
    const langToggle = document.getElementById('lang-toggle');

    if (titleH1) titleH1.textContent = strings.title;
    if (titleSub) titleSub.textContent = strings.subtitle;
    if (topbarMainTitle) topbarMainTitle.textContent = strings.topbarMainTitle;
    if (topbarSubtitle) topbarSubtitle.textContent = strings.topbarSubtitle;
    if (topbarHomeLink) topbarHomeLink.textContent = strings.topbarHome;
    if (topbarDevLink) topbarDevLink.textContent = strings.topbarDev;
    if (topbarArticlesBtn) topbarArticlesBtn.textContent = strings.topbarArticles;
    if (topbarBlogLink) topbarBlogLink.textContent = strings.topbarBlog;
    if (topbarCollab) topbarCollab.textContent = strings.topbarCollab;
    if (footerSignature) footerSignature.textContent = strings.creditSignature;
    if (articlesSectionHeading) articlesSectionHeading.textContent = strings.articlesSectionHeading;
    if (offcanvasArticlesTitle) offcanvasArticlesTitle.textContent = strings.offcanvasArticlesTitle;
    if (creationCardsHeading) creationCardsHeading.textContent = strings.creationCardsHeading;
    if (langToggle) {
        langToggle.textContent = strings.langToggleLabel;
        langToggle.setAttribute('aria-label', strings.langToggleAria);
    }

    [1, 2, 3].forEach((slotIndex) => {
        const titleNode = document.getElementById(`creation-card-slot-${slotIndex}-title`);
        const bodyNode = document.getElementById(`creation-card-slot-${slotIndex}-body`);
        if (titleNode) titleNode.textContent = `${strings.creationCardTitlePrefix} ${String(slotIndex).padStart(2, '0')}`;
        if (bodyNode) bodyNode.textContent = strings.creationCardBody;
    });

    if (taglineContainer) {
        taglineContainer.innerHTML = '';
        const isEn = lang === 'en';
        strings.taglines.forEach((text) => {
            const p = document.createElement('p');
            p.className = isEn ? 'tagline-en' : 'tagline';
            p.textContent = text;
            taglineContainer.appendChild(p);
        });
    }

    document.documentElement.lang = lang;
}

function normalizeLang(lang) {
    return lang === 'en' ? 'en' : 'ja';
}

function syncLangQuery(lang) {
    if (!window.history?.replaceState) return;
    const url = new URL(window.location.href);
    if (lang === 'en') {
        url.searchParams.set('lang', 'en');
    } else {
        url.searchParams.delete('lang');
    }
    window.history.replaceState(window.history.state, '', url.toString());
}

function initLanguageToggle(initialLang) {
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) return;

    let currentLang = normalizeLang(initialLang);
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ja' ? 'en' : 'ja';
        syncLangQuery(currentLang);
        applyPageLanguage(currentLang);
        refreshGuideLang();
        setArticlesLanguage(currentLang);
    });
}

function initMobileNavAutoCollapse() {
    const nav = document.getElementById('kessonTopbarNav');
    if (!nav) return;

    nav.querySelectorAll('.nav-link, [data-bs-toggle="offcanvas"]').forEach((el) => {
        el.addEventListener('click', () => {
            if (window.innerWidth >= 768) return;
            const collapseApi = window.bootstrap?.Collapse;
            if (!collapseApi) return;
            const collapse = collapseApi.getOrCreateInstance(nav, { toggle: false });
            collapse.hide();
        });
    });
}

function normalizeGraphicMode(mode) {
    if (mode === 'hold') return 'hoji';
    if (mode === 'wabi') return 'sinobi';
    if (mode === 'intent') return 'i';
    return GRAPHIC_MODE_OPTIONS.has(mode) ? mode : GRAPHIC_MODE_DEFAULT;
}

function syncGraphicModeQuery(mode) {
    if (!window.history?.replaceState) return;
    const url = new URL(window.location.href);
    url.searchParams.set('graphic', mode);
    window.history.replaceState(window.history.state, '', url.toString());
}

function setGraphicButtonState(mode) {
    document.querySelectorAll('[data-graphic-mode]').forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) return;
        const isActive = normalizeGraphicMode(button.dataset.graphicMode) === mode;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

function initGraphicModeButtons(initialMode, onChange) {
    setGraphicButtonState(initialMode);

    document.querySelectorAll('[data-graphic-mode]').forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) return;
        button.addEventListener('click', () => {
            const nextMode = normalizeGraphicMode(button.dataset.graphicMode);
            setGraphicButtonState(nextMode);
            onChange(nextMode);
        });
    });
}

function applyQuantumWaveUniforms(distortionPass) {
    if (!toggles.quantumWave) {
        distortionPass.uniforms.uQWaveStrength.value = 0;
        return;
    }

    const qp = quantumWaveParams;
    const du = distortionPass.uniforms;
    du.uQWaveStrength.value = qp.strength;
    du.uQWaveSpeed.value = qp.speed;
    du.uQWaveBaseFreq.value = qp.baseFreq;
    du.uQWaveDispersion.value = qp.dispersion;
    du.uQWaveNoiseAmp.value = qp.noiseAmp;
    du.uQWaveNoiseScale.value = qp.noiseScale;
    du.uQWaveCount.value = qp.waveCount;
    du.uQWaveEnvelope.value = qp.envelope;
    du.uQWaveYInfluence.value = qp.yInfluence;
    du.uQWaveGlowAmount.value = qp.glowAmount;
    du.uQWaveGlowColorR.value = qp.glowColorR;
    du.uQWaveGlowColorG.value = qp.glowColorG;
    du.uQWaveGlowColorB.value = qp.glowColorB;
    du.uQWaveCaberration.value = qp.caberration;
    du.uQWaveRimBright.value = qp.rimBright;
    du.uQWaveBlurAmount.value = qp.blurAmount;
    du.uQWaveFogDensity.value = qp.fogDensity;
    du.uQWaveFogColorR.value = qp.fogColorR;
    du.uQWaveFogColorG.value = qp.fogColorG;
    du.uQWaveFogColorB.value = qp.fogColorB;
    du.uQWaveDarken.value = qp.darken;
    du.uQWaveTurbulence.value = qp.turbulence;
    du.uQWaveSharpness.value = qp.sharpness;
}

function attachResize({ camera, renderer, getComposer }) {
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        const composer = typeof getComposer === 'function' ? getComposer() : null;
        if (composer) {
            composer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    window.addEventListener('resize', onResize);
}

function initDevVersionBadge() {
    const label = document.getElementById('dev-version-inline');
    if (!label) return;
    const params = new URLSearchParams(window.location.search);
    const queryVersion = params.get('ver');
    label.textContent = queryVersion
        ? `開発版 ver ${DEV_VERSION} · ${queryVersion}`
        : `開発版 ver ${DEV_VERSION}`;
}

function initInlineVersionLabel() {
    const label = document.getElementById('dev-version-inline');
    if (!label) return;
    label.textContent = `開発版 ver ${DEV_VERSION}`;
}

function initIntentTimelineHud({
    onApplyPhaseNow,
    onApplySecNow,
    onShiftSec,
    onCaptureLoopStart,
    onEnableSeamlessLoop,
    onDisableSeamlessLoop,
}) {
    const HUD_REFRESH_INTERVAL_MS = 120;
    const hud = document.createElement('aside');
    hud.id = 'intent-timeline-hud';
    hud.setAttribute('aria-live', 'polite');
    hud.innerHTML = `
        <div class="intent-timeline-hud-title">Intent Timeline</div>
        <pre class="intent-timeline-hud-readout" id="intent-timeline-hud-readout">phase: -</pre>
        <div class="intent-timeline-hud-controls">
            <label for="intent-timeline-phase-input">Phase (raw / unbounded)</label>
            <input id="intent-timeline-phase-input" type="number" step="0.0001" value="0.0000">
            <div class="intent-timeline-hud-actions intent-timeline-hud-actions-single">
                <button type="button" id="intent-timeline-apply-now">Jump Phase Now</button>
            </div>
        </div>
        <div class="intent-timeline-hud-controls">
            <label for="intent-timeline-sec-input">Timeline Sec (raw)</label>
            <input id="intent-timeline-sec-input" type="number" step="0.001" value="0.000">
            <div class="intent-timeline-hud-actions intent-timeline-hud-actions-single">
                <button type="button" id="intent-timeline-sec-now">Jump Sec Now</button>
            </div>
        </div>
        <div class="intent-timeline-hud-controls">
            <label for="intent-timeline-shift-sec-input">Shift Sec (+/-)</label>
            <input id="intent-timeline-shift-sec-input" type="number" step="1" value="300">
            <div class="intent-timeline-hud-actions">
                <button type="button" id="intent-timeline-shift-plus">Jump +Sec</button>
                <button type="button" id="intent-timeline-shift-minus">Jump -Sec</button>
            </div>
        </div>
        <div class="intent-timeline-hud-controls">
            <label>Seamless Loop (2-step)</label>
            <div class="intent-timeline-hud-actions">
                <button type="button" id="intent-timeline-loop-capture">Capture Start Now</button>
                <button type="button" id="intent-timeline-loop-on">Loop ON</button>
            </div>
            <div class="intent-timeline-hud-actions intent-timeline-hud-actions-single">
                <button type="button" id="intent-timeline-loop-off">Loop OFF</button>
            </div>
        </div>
    `;
    document.body.appendChild(hud);

    const readout = hud.querySelector('#intent-timeline-hud-readout');
    const phaseInput = hud.querySelector('#intent-timeline-phase-input');
    const secInput = hud.querySelector('#intent-timeline-sec-input');
    const shiftSecInput = hud.querySelector('#intent-timeline-shift-sec-input');
    const applyNowButton = hud.querySelector('#intent-timeline-apply-now');
    const applySecNowButton = hud.querySelector('#intent-timeline-sec-now');
    const shiftPlusButton = hud.querySelector('#intent-timeline-shift-plus');
    const shiftMinusButton = hud.querySelector('#intent-timeline-shift-minus');
    const loopCaptureButton = hud.querySelector('#intent-timeline-loop-capture');
    const loopOnButton = hud.querySelector('#intent-timeline-loop-on');
    const loopOffButton = hud.querySelector('#intent-timeline-loop-off');

    let latestTimeline = null;
    let hudVisible = false;
    let lastRefreshMs = 0;
    let lastReadoutText = '';

    function parseNumberInput(inputElement) {
        const text = String(inputElement.value ?? '').trim();
        if (text.length === 0) return null;
        const raw = Number(text);
        if (!Number.isFinite(raw)) return null;
        return raw;
    }

    function parsePhaseInput() {
        return parseNumberInput(phaseInput);
    }

    function parseSecInput() {
        return parseNumberInput(secInput);
    }

    function parseShiftSecInput() {
        return parseNumberInput(shiftSecInput);
    }

    function applyIfValid(parseFn, applyFn) {
        const value = parseFn();
        if (value === null) return;
        applyFn(value);
    }

    applyNowButton.addEventListener('click', () => {
        applyIfValid(parsePhaseInput, onApplyPhaseNow);
    });

    applySecNowButton.addEventListener('click', () => {
        applyIfValid(parseSecInput, onApplySecNow);
    });

    shiftPlusButton.addEventListener('click', () => {
        applyIfValid(parseShiftSecInput, onShiftSec);
    });

    shiftMinusButton.addEventListener('click', () => {
        applyIfValid(parseShiftSecInput, (value) => onShiftSec(-value));
    });

    loopCaptureButton.addEventListener('click', () => {
        onCaptureLoopStart();
    });

    loopOnButton.addEventListener('click', () => {
        onEnableSeamlessLoop();
    });

    loopOffButton.addEventListener('click', () => {
        onDisableSeamlessLoop();
    });

    return {
        setVisible(isVisible) {
            const nextVisible = Boolean(isVisible);
            if (nextVisible !== hudVisible) {
                lastRefreshMs = 0;
            }
            hudVisible = nextVisible;
            hud.classList.toggle('is-visible', nextVisible);
        },
        update(timeline) {
            latestTimeline = timeline;
            if (!hudVisible) return;

            const nowMs = window.performance?.now?.() ?? Date.now();
            const activeElement = document.activeElement;
            const isHudInteracting = Boolean(activeElement && hud.contains(activeElement));
            if (!isHudInteracting && (nowMs - lastRefreshMs) < HUD_REFRESH_INTERVAL_MS) {
                return;
            }
            lastRefreshMs = nowMs;

            if (!isHudInteracting) {
                phaseInput.value = timeline.rawPhase.toFixed(6);
                secInput.value = timeline.elapsedSec.toFixed(3);
            }
            const nextReadout = [
                `phase(raw/wrapped): ${timeline.rawPhase.toFixed(6)} / ${timeline.phase.toFixed(6)}`,
                `uTime(shader sec): ${timeline.shaderTimeSec.toFixed(3)}`,
                `loopAngle(rad): ${timeline.angle.toFixed(6)}`,
                `wrappedSec: ${timeline.wrappedSec.toFixed(3)} / ${timeline.loopPeriodSec.toFixed(3)}`,
                `elapsedSec(raw): ${timeline.elapsedSec.toFixed(3)}`,
                `elapsedSec(turn): ${timeline.shiftTurnElapsedSec.toFixed(3)}`,
                `turnSec(start/end): ${timeline.shiftTurnStartSec.toFixed(3)} / ${timeline.shiftTurnEndSec.toFixed(3)}`,
                `turnSpanSec: ${timeline.shiftTurnSpanSec.toFixed(3)}`,
                `startTimingMin: ${timeline.startTimingMin.toFixed(4)}`,
                `timeScale: ${timeline.timeScale.toFixed(4)}`,
                `loopMode: ${timeline.seamlessLoopEnabled ? 'seamless' : 'explore'}`,
                `loopAnchorSec: ${timeline.loopAnchorSec.toFixed(3)}`,
                `loopDriftSec: ${timeline.loopDriftSec.toFixed(3)}`,
                `loopOrbitSec: ${timeline.loopOrbitSec.toFixed(3)}`,
                `capture(sec): ${Number.isFinite(timeline.capturedLoopStartSec) ? timeline.capturedLoopStartSec.toFixed(3) : '-'}`,
                `captureDelta(sec): ${Number.isFinite(timeline.captureDeltaSec) ? timeline.captureDeltaSec.toFixed(3) : '-'}`,
                `sin/cos: ${timeline.loopSin.toFixed(4)} / ${timeline.loopCos.toFixed(4)}`,
            ].join('\n');
            if (nextReadout !== lastReadoutText) {
                readout.textContent = nextReadout;
                lastReadoutText = nextReadout;
            }
        },
        getLatestTimeline() {
            return latestTimeline;
        },
    };
}

async function main() {
    const initialLang = normalizeLang(detectLang());
    const initialGraphicMode = normalizeGraphicMode(new URLSearchParams(window.location.search).get('graphic'));
    const initialSceneVariant = resolveSceneVariant(initialGraphicMode);
    applyScenePreset(initialSceneVariant);
    const initialSceneState = loadSceneState(initialSceneVariant);
    if (initialSceneState) {
        applyConfigState(initialSceneState);
    }
    applyPageLanguage(initialLang);
    initInlineVersionLabel();
    initMouseTracking();

    const container = document.getElementById('canvas-container');
    if (!container) return;

    const sceneModule = await loadSceneModule(initialSceneVariant);
    const { createScene, getCreationLinkTargetMeshes, updateScene } = sceneModule;

    const { scene, camera, renderer } = createScene(container);
    renderer.autoClear = false;
    let active3dSceneVariant = initialSceneVariant;
    const isIntentScene = () => active3dSceneVariant === 'intent';

    function applyGraphicMode(nextMode, { shouldSyncQuery = true } = {}) {
        const normalizedMode = normalizeGraphicMode(nextMode);
        const nextSceneVariant = resolveSceneVariant(normalizedMode);
        if (nextSceneVariant !== active3dSceneVariant) {
            saveSceneState(active3dSceneVariant, cloneConfigState());
            if (shouldSyncQuery) {
                syncGraphicModeQuery(normalizedMode);
            }
            window.location.reload();
            return;
        }

        setGraphicButtonState(normalizedMode);

        if (shouldSyncQuery) {
            syncGraphicModeQuery(normalizedMode);
        }
    }

    const createLiquidRenderTarget = () => new THREE.WebGLRenderTarget(liquidParams.textureSize, liquidParams.textureSize, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
    });

    let createFluidSystemFactory = null;
    let createLiquidSystemFactory = null;
    let fluidSystem = null;
    let liquidSystem = null;
    let liquidTarget = null;

    let composer = null;
    let distortionPass = null;
    let dofPass = null;

    let postFxLoadingPromise = null;
    let fluidFactoryLoadingPromise = null;
    let liquidFactoryLoadingPromise = null;

    function shouldPreparePostFx(intentScene = isIntentScene()) {
        return !intentScene && toggles.postProcess;
    }

    function ensurePostFxPipeline() {
        if (composer && distortionPass && dofPass) {
            return Promise.resolve(true);
        }
        if (postFxLoadingPromise) {
            return postFxLoadingPromise;
        }
        postFxLoadingPromise = loadPostFxDeps()
            .then((deps) => {
                const {
                    EffectComposer,
                    RenderPass,
                    ShaderPass,
                    DistortionShader,
                    CameraDofShader,
                } = deps;

                composer = new EffectComposer(renderer);
                composer.addPass(new RenderPass(scene, camera));

                distortionPass = new ShaderPass(DistortionShader);
                distortionPass.uniforms.uLiquidOffsetScale.value = liquidParams.refractOffsetScale;
                distortionPass.uniforms.uLiquidThreshold.value = liquidParams.refractThreshold;
                composer.addPass(distortionPass);

                dofPass = new ShaderPass(CameraDofShader);
                composer.addPass(dofPass);
                composer.setSize(window.innerWidth, window.innerHeight);
                return true;
            })
            .catch((error) => {
                console.warn('[postfx] init failed:', error);
                return false;
            })
            .finally(() => {
                postFxLoadingPromise = null;
            });
        return postFxLoadingPromise;
    }

    function ensureFluidFactory() {
        if (createFluidSystemFactory) {
            return Promise.resolve(createFluidSystemFactory);
        }
        if (fluidFactoryLoadingPromise) {
            return fluidFactoryLoadingPromise;
        }
        fluidFactoryLoadingPromise = loadFluidFactory()
            .then((factory) => {
                createFluidSystemFactory = factory;
                return createFluidSystemFactory;
            })
            .catch((error) => {
                console.warn('[fluid] import failed:', error);
                return null;
            })
            .finally(() => {
                fluidFactoryLoadingPromise = null;
            });
        return fluidFactoryLoadingPromise;
    }

    function ensureLiquidFactory() {
        if (createLiquidSystemFactory) {
            return Promise.resolve(createLiquidSystemFactory);
        }
        if (liquidFactoryLoadingPromise) {
            return liquidFactoryLoadingPromise;
        }
        liquidFactoryLoadingPromise = loadLiquidFactory()
            .then((factory) => {
                createLiquidSystemFactory = factory;
                return createLiquidSystemFactory;
            })
            .catch((error) => {
                console.warn('[liquid] import failed:', error);
                return null;
            })
            .finally(() => {
                liquidFactoryLoadingPromise = null;
            });
        return liquidFactoryLoadingPromise;
    }

    if (shouldPreparePostFx()) {
        void ensurePostFxPipeline();
    }
    if (!isIntentScene() && toggles.postProcess && toggles.fluidField) {
        void ensureFluidFactory();
    }
    if (!isIntentScene() && toggles.postProcess && toggles.liquid) {
        void ensureLiquidFactory();
    }

    initControls(camera, container, renderer);
    initCreationLinkInteractions({
        camera,
        domElement: renderer.domElement,
        getTargets: getCreationLinkTargetMeshes,
    });
    initScrollUI();
    initLanguageToggle(initialLang);
    initMobileNavAutoCollapse();
    initGraphicModeButtons(initialGraphicMode, (nextMode) => {
        applyGraphicMode(nextMode);
    });
    applyGraphicMode(initialGraphicMode, { shouldSyncQuery: false });
    initArticles({ lang: initialLang }).catch((error) => {
        console.warn('[articles] init failed:', error);
    });
    attachResize({
        camera,
        renderer,
        getComposer: () => composer,
    });

    if (DEV_MODE) {
        initDevVersionBadge();
        import('./dev-links-panel.js').then(({ initDevLinksPanel }) => {
            initDevLinksPanel();
        }).catch((err) => {
            console.warn('[dev-links] init failed:', err.message);
        });

        import('./dev-stats.js').then(({ initDevStats, statsBegin, statsEnd }) => {
            devStatsBegin = statsBegin;
            devStatsEnd = statsEnd;
            initDevStats().catch((err) => {
                console.warn('[dev-stats] init failed:', err.message);
            });
        }).catch((err) => {
            console.warn('[dev-stats] import failed:', err.message);
        });
    }

    if (DEV_MODE) {
        initDevPanel({
            sceneVariant: active3dSceneVariant,
            onStateChanged: () => {
                setCameraPosition(sceneParams.camX, sceneParams.camY, sceneParams.camZ);
                syncShiftTurnRangeFromPanel();
            },
            onStateSnapshot: (state) => {
                saveSceneState(active3dSceneVariant, state);
            },
        });
    }

    const liquidMousePos = new THREE.Vector2();
    const liquidMouseVel = new THREE.Vector2();
    const clock = new THREE.Clock();
    let capturedLoopStartShaderSec = null;
    const shiftTurnState = {
        startSec: Number(intentMotionParams.shiftTurnStartSec),
        endSec: Number(intentMotionParams.shiftTurnEndSec),
    };
    function markLoopAnchorDirty() {
        capturedLoopStartShaderSec = null;
    }
    function syncShiftTurnRangeFromPanel() {
        // Intent:
        // 1) keep runtime range in a dedicated state object (shiftTurnState)
        // 2) dev panel edits are the only post-init update source
        // 3) mirror sanitized values back to config so timeline/render stay consistent
        const nextStartSec = Number(intentMotionParams.shiftTurnStartSec);
        const nextEndSec = Number(intentMotionParams.shiftTurnEndSec);
        if (Number.isFinite(nextStartSec)) {
            shiftTurnState.startSec = nextStartSec;
        }
        if (Number.isFinite(nextEndSec)) {
            shiftTurnState.endSec = nextEndSec;
        }
        if (!Number.isFinite(shiftTurnState.startSec)) {
            shiftTurnState.startSec = 0.0;
        }
        if (!Number.isFinite(shiftTurnState.endSec)) {
            shiftTurnState.endSec = resolveIntentShiftTurnRange({
                shiftTurnStartSec: shiftTurnState.startSec,
            }).endSec;
        }
        const normalized = resolveIntentShiftTurnRange(shiftTurnState);
        shiftTurnState.startSec = normalized.startSec;
        shiftTurnState.endSec = normalized.endSec;
        intentMotionParams.shiftTurnStartSec = normalized.startSec;
        intentMotionParams.shiftTurnEndSec = normalized.endSec;
    }
    syncShiftTurnRangeFromPanel();
    const intentTimelineHud = DEV_MODE ? initIntentTimelineHud({
        onApplyPhaseNow: (phase) => {
            const nowSec = clock.getElapsedTime();
            intentMotionParams.startTimingMin = solveStartTimingMinForPhaseNow(phase, nowSec, intentMotionParams);
            // Keep Shift turn range controlled by config/dev panel.
            // Do not silently overwrite start/end when timeline is jumped.
            markLoopAnchorDirty();
            saveSceneState(active3dSceneVariant, cloneConfigState());
        },
        onApplySecNow: (targetElapsedSec) => {
            const nowSec = clock.getElapsedTime();
            intentMotionParams.startTimingMin = solveStartTimingMinForElapsedSecNow(targetElapsedSec, nowSec, intentMotionParams);
            // Keep Shift turn range controlled by config/dev panel.
            markLoopAnchorDirty();
            saveSceneState(active3dSceneVariant, cloneConfigState());
        },
        onShiftSec: (deltaSec) => {
            const nowSec = clock.getElapsedTime();
            const range = resolveIntentShiftTurnRange(shiftTurnState);
            const current = computeIntentRuntimeTimeline(nowSec, intentMotionParams);
            // Shift +/- must operate on the same folded path that shader uTime uses.
            // We therefore shift path-space first, then map back to elapsed seconds.
            const nextPathSec = current.shiftTurnPathSec + deltaSec;
            const targetElapsedSec = resolveIntentShiftTurnElapsedSecByPathSec(nextPathSec, range);
            intentMotionParams.startTimingMin = solveStartTimingMinForElapsedSecNow(targetElapsedSec, nowSec, intentMotionParams);
            markLoopAnchorDirty();
            saveSceneState(active3dSceneVariant, cloneConfigState());
        },
        onCaptureLoopStart: () => {
            const nowSec = clock.getElapsedTime();
            const runtime = computeIntentRuntimeTimeline(nowSec, intentMotionParams);
            capturedLoopStartShaderSec = runtime.shaderTimeSec;
            const orbitSec = runtime.loopOrbitSec;
            intentMotionParams.loopAnchorSec = capturedLoopStartShaderSec - orbitSec;
            saveSceneState(active3dSceneVariant, cloneConfigState());
        },
        onEnableSeamlessLoop: () => {
            const nowSec = clock.getElapsedTime();
            if (Number.isFinite(capturedLoopStartShaderSec)) {
                const runtime = computeIntentRuntimeTimeline(nowSec, intentMotionParams);
                const captureDeltaSec = capturedLoopStartShaderSec - runtime.shaderTimeSec;
                if (Math.abs(captureDeltaSec) <= CAPTURE_ENABLE_MAX_DELTA_SEC) {
                    const orbitSec = runtime.loopOrbitSec;
                    intentMotionParams.loopAnchorSec = capturedLoopStartShaderSec - orbitSec;
                } else {
                    intentMotionParams.loopAnchorSec = resolveIntentLoopAnchorSecForContinuity(nowSec, intentMotionParams);
                    capturedLoopStartShaderSec = null;
                }
            } else {
                intentMotionParams.loopAnchorSec = resolveIntentLoopAnchorSecForContinuity(nowSec, intentMotionParams);
            }
            intentMotionParams.seamlessLoop = true;
            saveSceneState(active3dSceneVariant, cloneConfigState());
        },
        onDisableSeamlessLoop: () => {
            const nowSec = clock.getElapsedTime();
            intentMotionParams.startTimingMin = resolveIntentStartTimingMinForRawContinuity(nowSec, intentMotionParams);
            intentMotionParams.seamlessLoop = false;
            markLoopAnchorDirty();
            saveSceneState(active3dSceneVariant, cloneConfigState());
        },
    }) : null;

    function animate() {
        requestAnimationFrame(animate);
        devStatsBegin();

        const time = clock.getElapsedTime();
        const breathVal = breathValue(time, breathConfig.period);
        const scrollProg = getScrollProgress();
        const intentScene = isIntentScene();
        const intentTimeline = computeIntentRuntimeTimeline(time, intentMotionParams);
        const captureDeltaSec = Number.isFinite(capturedLoopStartShaderSec)
            ? capturedLoopStartShaderSec - intentTimeline.shaderTimeSec
            : null;
        const intentTimelineDebug = {
            ...intentTimeline,
            capturedLoopStartSec: capturedLoopStartShaderSec,
            captureDeltaSec,
        };

        updateScrollUI(scrollProg, breathVal);
        setCameraPosition(sceneParams.camX, sceneParams.camY, sceneParams.camZ);
        if (intentScene) {
            toggles.autoRotate = true;
            setAutoRotateSpeed(intentMotionParams.cameraRotateSpeed);
            setAutoRotateStartOffsetSec(0.0);
            setAutoRotateLoopPhase(intentTimeline.phase);
        } else {
            setAutoRotateSpeed(1.0);
            setAutoRotateStartOffsetSec(0.0);
            setAutoRotateLoopPhase(null);
        }
        if (intentTimelineHud) {
            intentTimelineHud.setVisible(intentScene);
            if (intentScene) intentTimelineHud.update(intentTimelineDebug);
        }
        updateControls(time, breathVal);
        const mouse = updateMouseSmoothing();

        updateScene(time);

        const shouldRunPostFx = !intentScene && toggles.postProcess;
        if (shouldPreparePostFx(intentScene) && !(composer && distortionPass && dofPass)) {
            void ensurePostFxPipeline();
        }
        if (shouldRunPostFx && toggles.fluidField && !createFluidSystemFactory) {
            void ensureFluidFactory();
        }
        if (shouldRunPostFx && toggles.liquid && !createLiquidSystemFactory) {
            void ensureLiquidFactory();
        }

        if (distortionPass && dofPass) {
            if (shouldRunPostFx && toggles.fluidField) {
                if (!fluidSystem && createFluidSystemFactory) {
                    fluidSystem = createFluidSystemFactory(renderer);
                }
                if (fluidSystem) {
                    fluidSystem.uniforms.uForce.value = fluidParams.force;
                    fluidSystem.uniforms.uCurl.value = fluidParams.curl;
                    fluidSystem.uniforms.uDecay.value = fluidParams.decay;
                    fluidSystem.uniforms.uRadius.value = fluidParams.radius;
                    distortionPass.uniforms.uFluidInfluence.value = fluidParams.influence;
                    fluidSystem.uniforms.uMouse.value.set(mouse.smoothX, mouse.smoothY);
                    fluidSystem.uniforms.uMouseVelocity.value.set(mouse.velX, mouse.velY);
                    fluidSystem.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
                    fluidSystem.update();
                    distortionPass.uniforms.tFluidField.value = fluidSystem.getTexture();
                } else {
                    distortionPass.uniforms.uFluidInfluence.value = 0;
                }
            } else {
                distortionPass.uniforms.uFluidInfluence.value = 0;
            }

            if (shouldRunPostFx && toggles.liquid) {
                if (!liquidSystem && createLiquidSystemFactory) {
                    liquidSystem = createLiquidSystemFactory(renderer);
                }
                if (liquidSystem && !liquidTarget) {
                    liquidTarget = createLiquidRenderTarget();
                }
                if (liquidSystem && liquidTarget) {
                    liquidSystem.uniforms.simulation.uTimestep.value = liquidParams.timestep;
                    liquidSystem.uniforms.simulation.uDissipation.value = liquidParams.dissipation;
                    liquidSystem.uniforms.force.uRadius.value = liquidParams.forceRadius;
                    liquidSystem.uniforms.splat.uRadius.value = liquidParams.forceRadius;
                    liquidSystem.uniforms.force.uStrength.value = liquidParams.forceStrength;
                    liquidSystem.uniforms.render.uDensityMul.value = liquidParams.densityMul;
                    liquidSystem.uniforms.render.uNoiseScale.value = liquidParams.noiseScale;
                    liquidSystem.uniforms.render.uNoiseSpeed.value = liquidParams.noiseSpeed;
                    liquidSystem.uniforms.render.uSpecPow.value = liquidParams.specularPow;
                    liquidSystem.uniforms.render.uSpecInt.value = liquidParams.specularInt;

                    liquidMousePos.set(mouse.smoothX, mouse.smoothY);
                    liquidMouseVel.set(mouse.velX, mouse.velY);
                    liquidSystem.update(liquidMousePos, liquidMouseVel);
                    liquidSystem.setTime(time);
                    liquidSystem.copyDensityTo(liquidTarget);
                    distortionPass.uniforms.tLiquid.value = liquidTarget.texture;
                    distortionPass.uniforms.uLiquidStrength.value = liquidParams.densityMul;
                    distortionPass.uniforms.uLiquidOffsetScale.value = liquidParams.refractOffsetScale;
                    distortionPass.uniforms.uLiquidThreshold.value = liquidParams.refractThreshold;
                } else {
                    distortionPass.uniforms.uLiquidStrength.value = 0;
                }
            } else {
                distortionPass.uniforms.uLiquidStrength.value = 0;
            }

            if (shouldRunPostFx) {
                applyQuantumWaveUniforms(distortionPass);
            } else {
                distortionPass.uniforms.uQWaveStrength.value = 0;
            }

            distortionPass.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
            distortionPass.uniforms.uTime.value = time;
            dofPass.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
            dofPass.uniforms.uMouse.value.set(mouse.smoothX, mouse.smoothY);
            if (shouldRunPostFx && toggles.dof) {
                dofPass.uniforms.uDofStrength.value = distortionParams.dofStrength;
                dofPass.uniforms.uDofFocusRadius.value = distortionParams.dofFocusRadius;
            } else {
                dofPass.uniforms.uDofStrength.value = 0;
            }
        }

        renderer.clear();
        if (shouldRunPostFx && composer) {
            composer.render();
        } else {
            renderer.render(scene, camera);
        }
        devStatsEnd();
    }

    animate();
}

main().catch((error) => {
    console.error('[main] init failed:', error);
    showStartupErrorOverlay(error);
});
