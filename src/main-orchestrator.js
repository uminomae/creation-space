import * as THREE from 'three';

import { createMainDevStatsBridge } from './main-dev-stats-bridge.js';
import { prepareMainBootstrap } from './main-bootstrap.js';
import { createMainFrameRuntime } from './main-frame-runtime.js';
import { initMainScenePipelineRuntime } from './main-scene-pipeline-runtime.js';
import { intentMotionParams, sceneParams } from './config.js';
import { createIntentShiftTurnState } from './intent-shift-turn-state.js';
import { createIntentTimelineRuntime } from './intent-timeline-runtime.js';
import { resolveIntentShiftTurnRange } from './intent-timeline.js';
import { setCameraPosition, setCameraTarget } from './controls.js';
import { initDevAuxTools, initDevPanelRuntime } from './dev-runtime.js';

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

    // --- intent runtime (inlined from main-intent-runtime.js) ---
    const shiftTurnState = createIntentShiftTurnState({
        intentMotionParams,
        resolveIntentShiftTurnRange,
    });
    shiftTurnState.syncFromParams();

    const intentTimelineRuntime = createIntentTimelineRuntime({
        devMode,
        intentMotionParams,
    });

    // --- dev runtime (inlined from main-dev-runtime.js) ---
    if (devMode) {
        const devComponentsLink = document.getElementById('dev-components-link');
        if (devComponentsLink) {
            devComponentsLink.classList.add('is-visible');
        }

        initDevAuxTools({
            setStatsHandlers: (statsBegin, statsEnd) => {
                devStatsBridge.setHandlers(statsBegin, statsEnd);
            },
        });

        initDevPanelRuntime({
            sceneVariant: getSceneVariant(),
            sceneParams,
            setCameraPosition,
            setCameraTarget,
            onSyncShiftTurn: () => {
                shiftTurnState.syncFromParams();
            },
            onStateSnapshot: (state) => {
                sceneStateStore.save(getSceneVariant(), state);
            },
        });
    }

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
