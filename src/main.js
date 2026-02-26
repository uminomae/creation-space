import * as THREE from 'three';

import { breathValue } from './animation-utils.js';
import {
    initControls,
    setAutoRotateSpeed,
    setAutoRotateLoopPhase,
    setAutoRotateStartOffsetSec,
    setCameraPosition,
    setCameraTarget,
    updateControls,
    getScrollProgress,
} from './controls.js';
import { initMouseTracking, updateMouseSmoothing } from './mouse-state.js';
import { initScrollUI, refreshGuideLang, updateScrollUI } from './scroll-ui.js';
import { initDevPanel } from './dev-panel.js';
import { initCreationLinkInteractions } from './creation-link-interactions.js';
import { initArticles, setArticlesLanguage } from './articles.js';
import { initIntentTimelineHud } from './intent-timeline-hud.js';
import { applyConfigState, cloneConfigState } from './config-state.js';
import { applyScenePreset, getScenePresetVersion, resolveSceneVariant } from './scene-presets.js';
import { DEV_VERSION } from './version.js';
import { createSceneStateStore } from './dev-scene-state.js';
import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { applyPageLanguage, initLanguageToggle } from './page-language.js';
import {
    normalizeGraphicMode,
    syncGraphicModeQuery,
    setGraphicButtonState,
    initGraphicModeButtons,
} from './graphic-mode.js';
import {
    loadSceneModule,
    loadPostFxDeps,
    loadFluidFactory,
    loadLiquidFactory,
} from './scene-module-loader.js';
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
import { detectLang, normalizeLang } from './i18n.js';

const DEV_MODE = new URLSearchParams(window.location.search).has('dev');
const DEV_PANEL_STATE_PERSIST = new URLSearchParams(window.location.search).get('devstate') === 'persist';
const CAPTURE_ENABLE_MAX_DELTA_SEC = 0.3;
let devStatsBegin = () => {};
let devStatsEnd = () => {};
const sceneStateStore = createSceneStateStore({
    enabled: DEV_PANEL_STATE_PERSIST,
    getPresetVersion: getScenePresetVersion,
});

installStartupErrorHandlers();

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

async function main() {
    const initialLang = normalizeLang(detectLang());
    const initialGraphicMode = normalizeGraphicMode(new URLSearchParams(window.location.search).get('graphic'));
    const initialSceneVariant = resolveSceneVariant(initialGraphicMode);
    applyScenePreset(initialSceneVariant);
    const initialSceneState = sceneStateStore.load(initialSceneVariant);
    if (initialSceneState) {
        applyConfigState(initialSceneState);
    }
    applyPageLanguage(initialLang, { devMode: DEV_MODE, devVersion: DEV_VERSION });
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
            sceneStateStore.save(active3dSceneVariant, cloneConfigState());
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
    initLanguageToggle(initialLang, (currentLang) => {
        applyPageLanguage(currentLang, { devMode: DEV_MODE, devVersion: DEV_VERSION });
        refreshGuideLang();
        setArticlesLanguage(currentLang);
    });
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
                setCameraTarget(
                    sceneParams.camTargetX ?? 0,
                    sceneParams.camTargetY ?? 0,
                    sceneParams.camTargetZ ?? 0,
                );
                syncShiftTurnRangeFromPanel();
            },
            onStateSnapshot: (state) => {
                sceneStateStore.save(active3dSceneVariant, state);
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
            sceneStateStore.save(active3dSceneVariant, cloneConfigState());
        },
        onApplySecNow: (targetElapsedSec) => {
            const nowSec = clock.getElapsedTime();
            intentMotionParams.startTimingMin = solveStartTimingMinForElapsedSecNow(targetElapsedSec, nowSec, intentMotionParams);
            // Keep Shift turn range controlled by config/dev panel.
            markLoopAnchorDirty();
            sceneStateStore.save(active3dSceneVariant, cloneConfigState());
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
            sceneStateStore.save(active3dSceneVariant, cloneConfigState());
        },
        onCaptureLoopStart: () => {
            const nowSec = clock.getElapsedTime();
            const runtime = computeIntentRuntimeTimeline(nowSec, intentMotionParams);
            capturedLoopStartShaderSec = runtime.shaderTimeSec;
            const orbitSec = runtime.loopOrbitSec;
            intentMotionParams.loopAnchorSec = capturedLoopStartShaderSec - orbitSec;
            sceneStateStore.save(active3dSceneVariant, cloneConfigState());
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
            sceneStateStore.save(active3dSceneVariant, cloneConfigState());
        },
        onDisableSeamlessLoop: () => {
            const nowSec = clock.getElapsedTime();
            intentMotionParams.startTimingMin = resolveIntentStartTimingMinForRawContinuity(nowSec, intentMotionParams);
            intentMotionParams.seamlessLoop = false;
            markLoopAnchorDirty();
            sceneStateStore.save(active3dSceneVariant, cloneConfigState());
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
        setCameraTarget(
            sceneParams.camTargetX ?? 0,
            sceneParams.camTargetY ?? 0,
            sceneParams.camTargetZ ?? 0,
        );
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
