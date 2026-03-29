import * as THREE from 'three';

import { createMainDevStatsBridge } from './main-dev-stats-bridge.js';
import { prepareMainBootstrap } from './main-bootstrap.js';
import { createMainFrameRuntime } from './main-frame-runtime.js';
import { initMainScenePipelineRuntime } from './main-scene-pipeline-runtime.js';
import { initMainContentRuntime, attachMainSceneContentRuntime } from './main-content-runtime.js';
import { initMainGraphicModeRuntime } from './main-graphic-mode-runtime.js';
import { showStartupWarningBanner } from './startup-error-overlay.js';
import { intentMotionParams, sceneParams } from './config.js';
import { createIntentShiftTurnState } from './intent-shift-turn-state.js';
import { createIntentTimelineRuntime } from './intent-timeline-runtime.js';
import { resolveIntentShiftTurnRange } from './intent-timeline.js';
import { setCameraPosition, setCameraTarget } from './controls.js';
import { initDevAuxTools, initDevPanelRuntime } from './dev-runtime.js';
import { normalizeLang } from './i18n.js';
import { dict } from './i18n/dict.js';

function getSceneFallbackMessage(lang) {
    const l = normalizeLang(lang);
    return (dict[l]?.page || dict.ja.page).sceneFallbackMessage;
}

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
        intentQuerySeed,
    });

    const container = document.getElementById('canvas-container');
    if (!container) return;

    const getSceneVariant = () => initialSceneVariant;
    const applyGraphicMode = initMainGraphicModeRuntime({
        getActiveSceneVariant: getSceneVariant,
        sceneStateStore,
    });

    initMainContentRuntime({
        initialLang,
        initialGraphicMode,
        applyGraphicMode,
        devMode,
    });

    let scenePipeline;
    try {
        scenePipeline = await initMainScenePipelineRuntime({
            container,
            initialSceneVariant,
        });
    } catch (error) {
        console.error('[scene] init failed:', error);
        showStartupWarningBanner(getSceneFallbackMessage(initialLang));
        return;
    }
    const {
        scene,
        camera,
        renderer,
        updateScene,
        isIntentScene,
        getCreationLinkTargetMeshes,
        postFxRuntime,
    } = scenePipeline;

    attachMainSceneContentRuntime({
        camera,
        container,
        renderer,
        getCreationLinkTargetMeshes,
    });

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
