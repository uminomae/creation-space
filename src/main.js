import * as THREE from 'three';

import { breathValue } from './animation-utils.js';
import {
    setAutoRotateSpeed,
    setAutoRotateLoopPhase,
    setAutoRotateStartOffsetSec,
    setCameraPosition,
    setCameraTarget,
    updateControls,
    getScrollProgress,
} from './controls.js';
import { initMouseTracking, updateMouseSmoothing } from './mouse-state.js';
import { updateScrollUI } from './scroll-ui.js';
import { initDevAuxTools, initDevPanelRuntime } from './dev-runtime.js';
import { initArticles, setArticlesLanguage } from './articles.js';
import { initIntentTimelineHud } from './intent-timeline-hud.js';
import { createIntentShiftTurnState } from './intent-shift-turn-state.js';
import { createPostFxBootstrap } from './postfx-bootstrap.js';
import { createGraphicModeApplier } from './graphic-mode-apply.js';
import { attachResize } from './render-resize.js';
import { applyConfigState, cloneConfigState } from './config-state.js';
import { applyScenePreset, getScenePresetVersion, resolveSceneVariant } from './scene-presets.js';
import { DEV_VERSION } from './version.js';
import { createSceneStateStore } from './dev-scene-state.js';
import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { applyPageLanguage } from './page-language.js';
import { applyQuantumWaveUniforms } from './quantum-wave-uniforms.js';
import { initMainUiRuntime } from './main-ui-runtime.js';
import {
    normalizeGraphicMode,
    syncGraphicModeQuery,
    setGraphicButtonState,
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

    const applyGraphicMode = createGraphicModeApplier({
        getActiveSceneVariant: () => active3dSceneVariant,
        normalizeGraphicMode,
        resolveSceneVariant,
        saveSceneState: (sceneVariant) => {
            sceneStateStore.save(sceneVariant, cloneConfigState());
        },
        syncGraphicModeQuery,
        setGraphicButtonState,
    });

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

    const postFx = createPostFxBootstrap({
        renderer,
        scene,
        camera,
        liquidParams,
        loadPostFxDeps,
        loadFluidFactory,
        loadLiquidFactory,
    });

    if (postFx.shouldPrepare(isIntentScene(), toggles)) {
        void postFx.ensurePipeline();
    }
    if (!isIntentScene() && toggles.postProcess && toggles.fluidField) {
        void postFx.ensureFluidFactory(createFluidSystemFactory).then((factory) => {
            if (factory) createFluidSystemFactory = factory;
        });
    }
    if (!isIntentScene() && toggles.postProcess && toggles.liquid) {
        void postFx.ensureLiquidFactory(createLiquidSystemFactory).then((factory) => {
            if (factory) createLiquidSystemFactory = factory;
        });
    }

    initMainUiRuntime({
        camera,
        container,
        renderer,
        getCreationLinkTargetMeshes,
        initialLang,
        initialGraphicMode,
        applyGraphicMode,
        devMode: DEV_MODE,
        devVersion: DEV_VERSION,
        setArticlesLanguage,
    });
    applyGraphicMode(initialGraphicMode, { shouldSyncQuery: false });
    initArticles({ lang: initialLang }).catch((error) => {
        console.warn('[articles] init failed:', error);
    });
    attachResize({
        camera,
        renderer,
        getComposer: () => postFx.getComposer(),
    });

    const shiftTurnState = createIntentShiftTurnState({
        intentMotionParams,
        resolveIntentShiftTurnRange,
    });
    shiftTurnState.syncFromParams();

    if (DEV_MODE) {
        initDevAuxTools({
            setStatsHandlers: (statsBegin, statsEnd) => {
                devStatsBegin = statsBegin;
                devStatsEnd = statsEnd;
            },
        });
    }

    if (DEV_MODE) {
        initDevPanelRuntime({
            sceneVariant: active3dSceneVariant,
            sceneParams,
            setCameraPosition,
            setCameraTarget,
            onSyncShiftTurn: () => {
                shiftTurnState.syncFromParams();
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
    function markLoopAnchorDirty() {
        capturedLoopStartShaderSec = null;
    }
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
            const range = shiftTurnState.getRange();
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
        if (postFx.shouldPrepare(intentScene, toggles) && !postFx.hasPipeline()) {
            void postFx.ensurePipeline();
        }
        if (shouldRunPostFx && toggles.fluidField && !createFluidSystemFactory) {
            void postFx.ensureFluidFactory(createFluidSystemFactory).then((factory) => {
                if (factory) createFluidSystemFactory = factory;
            });
        }
        if (shouldRunPostFx && toggles.liquid && !createLiquidSystemFactory) {
            void postFx.ensureLiquidFactory(createLiquidSystemFactory).then((factory) => {
                if (factory) createLiquidSystemFactory = factory;
            });
        }

        const composer = postFx.getComposer();
        const distortionPass = postFx.getDistortionPass();
        const dofPass = postFx.getDofPass();
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
                applyQuantumWaveUniforms(distortionPass, {
                    enabled: toggles.quantumWave,
                    params: quantumWaveParams,
                });
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
