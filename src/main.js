import * as THREE from 'three';

import { getScenePresetVersion } from './scene-presets.js';
import { DEV_VERSION } from './version.js';
import { createSceneStateStore } from './dev-scene-state.js';
import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { initMainDevRuntime } from './main-dev-runtime.js';
import { initMainIntentRuntime } from './main-intent-runtime.js';
import { createMainSceneRuntime, prepareMainBootstrap } from './main-bootstrap.js';
import { initMainContentRuntime } from './main-content-runtime.js';
import { createMainFrameRuntime } from './main-frame-runtime.js';
import { initMainGraphicModeRuntime } from './main-graphic-mode-runtime.js';
import { initMainPostFxRuntime } from './main-postfx-runtime.js';

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
    const active3dSceneVariant = initialSceneVariant;
    const isIntentScene = () => active3dSceneVariant === 'intent';

    const applyGraphicMode = initMainGraphicModeRuntime({
        getActiveSceneVariant: () => active3dSceneVariant,
        sceneStateStore,
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
    const clock = new THREE.Clock();
    const { shiftTurnState, intentTimelineRuntime } = initMainIntentRuntime({
        devMode: DEV_MODE,
        clock,
        captureEnableMaxDeltaSec: CAPTURE_ENABLE_MAX_DELTA_SEC,
        sceneStateStore,
        getSceneVariant: () => active3dSceneVariant,
    });

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
