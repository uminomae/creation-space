import * as THREE from 'three';

import { initMainDevRuntime } from './main-dev-runtime.js';
import { createMainDevStatsBridge } from './main-dev-stats-bridge.js';
import { initMainIntentRuntime } from './main-intent-runtime.js';
import { prepareMainBootstrap } from './main-bootstrap.js';
import { createMainFrameRuntime } from './main-frame-runtime.js';
import { initMainScenePipelineRuntime } from './main-scene-pipeline-runtime.js';

export async function runMainOrchestrator({
    runtimeContext,
}) {
    const {
        devMode: runtimeDevMode = false,
        sceneStateStore = null,
        intentQuerySeed = null,
    } = runtimeContext || {};
    const devMode = Boolean(runtimeDevMode);
    const devStatsBridge = createMainDevStatsBridge();

    const {
        initialLang,
        initialGraphicMode,
        initialSceneVariant,
    } = prepareMainBootstrap({
        sceneStateStore,
        devMode,
        intentQuerySeed,
    });

    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scenePipeline = await initMainScenePipelineRuntime({
        container,
        initialLang,
        initialGraphicMode,
        initialSceneVariant,
        devMode,
        sceneStateStore,
    });
    const {
        scene,
        camera,
        renderer,
        updateScene,
        isIntentScene,
        getSceneVariant,
        postFxRuntime,
    } = scenePipeline;

    const clock = new THREE.Clock();
    const { shiftTurnState, intentTimelineRuntime } = initMainIntentRuntime({
        devMode,
    });

    initMainDevRuntime({
        devMode,
        getSceneVariant,
        shiftTurnState,
        sceneStateStore,
        setStatsHandlers: (statsBegin, statsEnd) => {
            devStatsBridge.setHandlers(statsBegin, statsEnd);
        },
    });

    const frameRuntime = createMainFrameRuntime({
        clock,
        scene,
        renderer,
        camera,
        isIntentScene,
        intentTimelineRuntime,
        updateScene,
        postFxRuntime,
        devMode,
        getDevStatsBegin: () => devStatsBridge.getBegin(),
        getDevStatsEnd: () => devStatsBridge.getEnd(),
    });

    frameRuntime.start();
}
