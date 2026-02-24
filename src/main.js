import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { breathValue } from './animation-utils.js';
import { initControls, setCameraPosition, updateControls, getScrollProgress } from './controls.js';
import { initMouseTracking, updateMouseSmoothing } from './mouse-state.js';
import { initScrollUI, refreshGuideLang, updateScrollUI } from './scroll-ui.js';
import { initDevPanel } from './dev-panel.js';
import { createFluidSystem } from './shaders/fluid-field.js';
import { createLiquidSystem } from './shaders/liquid.js';
import { CameraDofShader, DistortionShader } from './shaders/distortion-pass.js';
import { initCreationLinkInteractions } from './creation-link-interactions.js';
import { initArticles, setArticlesLanguage } from './articles.js';
import { applyConfigState, cloneConfigState } from './config-state.js';
import { applyScenePreset, getScenePresetVersion, resolveSceneVariant } from './scene-presets.js';
import { DEV_VERSION } from './version.js';
import {
    breathConfig,
    distortionParams,
    fluidParams,
    liquidParams,
    quantumWaveParams,
    sceneParams,
    toggles,
} from './config.js';
import { detectLang } from './i18n.js';

const DEV_MODE = new URLSearchParams(window.location.search).has('dev');
let devStatsBegin = () => {};
let devStatsEnd = () => {};
const GRAPHIC_MODE_DEFAULT = 'hold';
const GRAPHIC_MODE_OPTIONS = new Set(['hold', 'wabi']);
const DEV_PANEL_STATE_STORAGE_PREFIX = 'creation-dev-panel-state-v1';

function getSceneStateStorageKey(sceneVariant) {
    return `${DEV_PANEL_STATE_STORAGE_PREFIX}:${sceneVariant}`;
}

function loadSceneState(sceneVariant) {
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
        topbarHome: 'HOME',
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
        topbarHome: 'HOME',
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
    if (sceneVariant === 'wabi') {
        return import('./scene.js');
    }
    return import('./scene-hold.js');
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
    const creditSignature = document.getElementById('credit-signature');
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
    if (creditSignature) creditSignature.textContent = strings.creditSignature;
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

function normalizeGraphicMode(mode) {
    return GRAPHIC_MODE_OPTIONS.has(mode) ? mode : GRAPHIC_MODE_DEFAULT;
}

function syncGraphicModeQuery(mode) {
    if (!window.history?.replaceState) return;
    const url = new URL(window.location.href);
    if (mode === GRAPHIC_MODE_DEFAULT) {
        url.searchParams.delete('graphic');
    } else {
        url.searchParams.set('graphic', mode);
    }
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

function attachResize({ camera, renderer, composer }) {
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);
}

function initDevVersionBadge() {
    const existing = document.getElementById('dev-version-badge');
    if (existing) existing.remove();

    const params = new URLSearchParams(window.location.search);
    const queryVersion = params.get('ver');
    const badge = document.createElement('div');
    badge.id = 'dev-version-badge';
    badge.textContent = queryVersion
        ? `開発版 ver ${DEV_VERSION} · ${queryVersion}`
        : `開発版 ver ${DEV_VERSION}`;
    const brandWrap = document.querySelector('#kesson-topbar .topbar-brand-wrap');
    if (brandWrap) {
        brandWrap.appendChild(badge);
    } else {
        document.body.appendChild(badge);
    }
}

function initInlineVersionLabel() {
    const label = document.getElementById('dev-version-inline');
    if (!label) return;

    const params = new URLSearchParams(window.location.search);
    const queryVersion = params.get('ver');
    label.textContent = queryVersion
        ? `開発ver ${DEV_VERSION} · ${queryVersion}`
        : `開発ver ${DEV_VERSION}`;
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

    const fluidSystem = createFluidSystem(renderer);
    const liquidSystem = createLiquidSystem(renderer);
    const liquidTarget = new THREE.WebGLRenderTarget(liquidParams.textureSize, liquidParams.textureSize, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
    });

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const distortionPass = new ShaderPass(DistortionShader);
    distortionPass.uniforms.uLiquidOffsetScale.value = liquidParams.refractOffsetScale;
    distortionPass.uniforms.uLiquidThreshold.value = liquidParams.refractThreshold;
    composer.addPass(distortionPass);

    const dofPass = new ShaderPass(CameraDofShader);
    composer.addPass(dofPass);

    initControls(camera, container, renderer);
    initCreationLinkInteractions({
        camera,
        domElement: renderer.domElement,
        getTargets: getCreationLinkTargetMeshes,
    });
    initScrollUI();
    initLanguageToggle(initialLang);
    initGraphicModeButtons(initialGraphicMode, (nextMode) => {
        applyGraphicMode(nextMode);
    });
    applyGraphicMode(initialGraphicMode, { shouldSyncQuery: false });
    initArticles({ lang: initialLang }).catch((error) => {
        console.warn('[articles] init failed:', error);
    });
    attachResize({ camera, renderer, composer });

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
            onStateChanged: () => {
                setCameraPosition(sceneParams.camX, sceneParams.camY, sceneParams.camZ);
            },
            onStateSnapshot: (state) => {
                saveSceneState(active3dSceneVariant, state);
            },
        });
    }

    const liquidMousePos = new THREE.Vector2();
    const liquidMouseVel = new THREE.Vector2();
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        devStatsBegin();

        const time = clock.getElapsedTime();
        const breathVal = breathValue(time, breathConfig.period);
        const scrollProg = getScrollProgress();

        updateScrollUI(scrollProg, breathVal);
        setCameraPosition(sceneParams.camX, sceneParams.camY, sceneParams.camZ);
        updateControls(time, breathVal);
        const mouse = updateMouseSmoothing();

        updateScene(time);

        if (toggles.fluidField) {
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

        if (toggles.liquid) {
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

        applyQuantumWaveUniforms(distortionPass);

        distortionPass.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
        distortionPass.uniforms.uTime.value = time;
        distortionPass.uniforms.uMouse.value.set(mouse.smoothX, mouse.smoothY);
        dofPass.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
        dofPass.uniforms.uMouse.value.set(mouse.smoothX, mouse.smoothY);

        if (toggles.heatHaze) {
            distortionPass.uniforms.uHeatHaze.value = distortionParams.heatHaze;
            distortionPass.uniforms.uHeatHazeRadius.value = distortionParams.heatHazeRadius;
            distortionPass.uniforms.uHeatHazeSpeed.value = distortionParams.heatHazeSpeed;
        } else {
            distortionPass.uniforms.uHeatHaze.value = 0;
        }

        if (toggles.dof) {
            dofPass.uniforms.uDofStrength.value = distortionParams.dofStrength;
            dofPass.uniforms.uDofFocusRadius.value = distortionParams.dofFocusRadius;
        } else {
            dofPass.uniforms.uDofStrength.value = 0;
        }

        renderer.clear();
        if (toggles.postProcess) {
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
});
