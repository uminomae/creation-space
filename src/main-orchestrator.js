import * as THREE from 'three';

import { initMainDevRuntime } from './main-dev-runtime.js';
import { initMainIntentRuntime } from './main-intent-runtime.js';
import { createMainSceneRuntime, prepareMainBootstrap } from './main-bootstrap.js';
import { initMainContentRuntime } from './main-content-runtime.js';
import { createMainFrameRuntime } from './main-frame-runtime.js';
import { initMainGraphicModeRuntime } from './main-graphic-mode-runtime.js';
import { initMainPostFxRuntime } from './main-postfx-runtime.js';

export async function runMainOrchestrator({
    runtimeContext,
    devVersion,
}) {
    const devMode = Boolean(runtimeContext?.devMode);
    const sceneStateStore = runtimeContext?.sceneStateStore;
    let devStatsBegin = () => {};
    let devStatsEnd = () => {};

    const {
        initialLang,
        initialGraphicMode,
        initialSceneVariant,
    } = prepareMainBootstrap({
        sceneStateStore,
        devMode,
        devVersion,
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
        devMode,
        devVersion,
    });

    const clock = new THREE.Clock();
    const { shiftTurnState, intentTimelineRuntime } = initMainIntentRuntime({
        devMode,
        clock,
        captureEnableMaxDeltaSec: runtimeContext?.captureEnableMaxDeltaSec,
        sceneStateStore,
        getSceneVariant: () => active3dSceneVariant,
    });

    initMainDevRuntime({
        devMode,
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
