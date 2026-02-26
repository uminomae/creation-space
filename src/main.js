import * as THREE from 'three';

import { createIntentShiftTurnState } from './intent-shift-turn-state.js';
import { createIntentTimelineRuntime } from './intent-timeline-runtime.js';
import { createGraphicModeApplier } from './graphic-mode-apply.js';
import { cloneConfigState } from './config-state.js';
import { getScenePresetVersion, resolveSceneVariant } from './scene-presets.js';
import { DEV_VERSION } from './version.js';
import { createSceneStateStore } from './dev-scene-state.js';
import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { initMainDevRuntime } from './main-dev-runtime.js';
import { createMainSceneRuntime, prepareMainBootstrap } from './main-bootstrap.js';
import { initMainContentRuntime } from './main-content-runtime.js';
import { createMainFrameRuntime } from './main-frame-runtime.js';
import { initMainPostFxRuntime } from './main-postfx-runtime.js';
import {
    normalizeGraphicMode,
    syncGraphicModeQuery,
    setGraphicButtonState,
} from './graphic-mode.js';
import {
    resolveIntentShiftTurnRange,
} from './intent-timeline.js';
import {
    intentMotionParams,
} from './config.js';

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
    const {
        initialLang,
        initialGraphicMode,
        initialSceneVariant,
    } = prepareMainBootstrap({
        sceneStateStore,
        devMode: DEV_MODE,
        devVersion: DEV_VERSION,
    });

    const container = document.getElementById('canvas-container');
    if (!container) return;

    const {
        scene,
        camera,
        renderer,
        getCreationLinkTargetMeshes,
        updateScene,
    } = await createMainSceneRuntime({
        container,
        sceneVariant: initialSceneVariant,
    });
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

    const { postFxRuntime } = initMainPostFxRuntime({
        renderer,
        scene,
        camera,
        isIntentScene,
    });

    initMainContentRuntime({
        camera,
        container,
        renderer,
        getCreationLinkTargetMeshes,
        initialLang,
        initialGraphicMode,
        applyGraphicMode,
        devMode: DEV_MODE,
        devVersion: DEV_VERSION,
    });
    const shiftTurnState = createIntentShiftTurnState({
        intentMotionParams,
        resolveIntentShiftTurnRange,
    });
    shiftTurnState.syncFromParams();

    initMainDevRuntime({
        devMode: DEV_MODE,
        getSceneVariant: () => active3dSceneVariant,
        shiftTurnState,
        sceneStateStore,
        setStatsHandlers: (statsBegin, statsEnd) => {
            devStatsBegin = statsBegin;
            devStatsEnd = statsEnd;
        },
    });

    const clock = new THREE.Clock();
    const intentTimelineRuntime = createIntentTimelineRuntime({
        devMode: DEV_MODE,
        clock,
        captureEnableMaxDeltaSec: CAPTURE_ENABLE_MAX_DELTA_SEC,
        intentMotionParams,
        shiftTurnState,
        saveSceneState: () => {
            sceneStateStore.save(active3dSceneVariant, cloneConfigState());
        },
    });

    const frameRuntime = createMainFrameRuntime({
        clock,
        renderer,
        camera,
        isIntentScene,
        intentTimelineRuntime,
        updateScene,
        postFxRuntime,
        getDevStatsBegin: () => devStatsBegin,
        getDevStatsEnd: () => devStatsEnd,
    });

    frameRuntime.start();
}

main().catch((error) => {
    console.error('[main] init failed:', error);
    showStartupErrorOverlay(error);
});
