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
import { createIntentTimelineRuntime } from './intent-timeline-runtime.js';
import { createPostFxBootstrap } from './postfx-bootstrap.js';
import { createGraphicModeApplier } from './graphic-mode-apply.js';
import { attachResize } from './render-resize.js';
import { applyConfigState, cloneConfigState } from './config-state.js';
import { applyScenePreset, getScenePresetVersion, resolveSceneVariant } from './scene-presets.js';
import { DEV_VERSION } from './version.js';
import { createSceneStateStore } from './dev-scene-state.js';
import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { applyPageLanguage } from './page-language.js';
import { initMainUiRuntime } from './main-ui-runtime.js';
import { createPostFxRuntime } from './postfx-runtime.js';
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

    const postFx = createPostFxBootstrap({
        renderer,
        scene,
        camera,
        liquidParams,
        loadPostFxDeps,
        loadFluidFactory,
        loadLiquidFactory,
    });
    const postFxRuntime = createPostFxRuntime({
        postFx,
        renderer,
        toggles,
        distortionParams,
        fluidParams,
        liquidParams,
        quantumWaveParams,
    });

    postFxRuntime.prewarm(isIntentScene());

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

    const clock = new THREE.Clock();
    const intentTimelineRuntime = createIntentTimelineRuntime({
        devMode: DEV_MODE,
        clock,
        captureEnableMaxDeltaSec: CAPTURE_ENABLE_MAX_DELTA_SEC,
        intentMotionParams,
        shiftTurnState,
        initIntentTimelineHud,
        computeIntentRuntimeTimeline,
        solveStartTimingMinForPhaseNow,
        solveStartTimingMinForElapsedSecNow,
        resolveIntentShiftTurnElapsedSecByPathSec,
        resolveIntentLoopAnchorSecForContinuity,
        resolveIntentStartTimingMinForRawContinuity,
        saveSceneState: () => {
            sceneStateStore.save(active3dSceneVariant, cloneConfigState());
        },
    });

    function animate() {
        requestAnimationFrame(animate);
        devStatsBegin();

        const time = clock.getElapsedTime();
        const breathVal = breathValue(time, breathConfig.period);
        const scrollProg = getScrollProgress();
        const intentScene = isIntentScene();
        const timelineState = intentTimelineRuntime.getTimelineState(time);
        const intentTimeline = timelineState.runtime;

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
        intentTimelineRuntime.updateHudVisibility(intentScene, timelineState.debug);
        updateControls(time, breathVal);
        const mouse = updateMouseSmoothing();

        updateScene(time);

        const { shouldRunPostFx, composer } = postFxRuntime.update({
            time,
            mouse,
            intentScene,
        });

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
