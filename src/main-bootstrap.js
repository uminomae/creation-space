import { initMouseTracking } from './mouse-state.js';
import { applyConfigState } from './config-state.js';
import { applyScenePreset, resolveSceneVariant } from './scene-presets.js';
import { applyPageLanguage } from './page-language.js';
import { normalizeGraphicMode } from './graphic-mode.js';
import { loadSceneModule } from './scene-module-loader.js';
import { detectLang, normalizeLang } from './i18n.js';
import { intentMotionParams } from './config.js';
import { startTimingMinForElapsedSecAtZero } from './intent-timeline.js';

function applyIntentLoopStartupOverrides(intentQuerySeed) {
    if (!intentQuerySeed || typeof intentQuerySeed !== 'object') return;

    // Initialization precedence contract:
    // 1) scene preset defaults
    // 2) persisted dev panel state (if enabled)
    // 3) query seed overrides for shareable URLs
    //
    // This function handles only step (3), and is called after (1)(2).
    if (Number.isFinite(intentQuerySeed.initialUTimeSec)) {
        intentMotionParams.startTimingMin = startTimingMinForElapsedSecAtZero(intentQuerySeed.initialUTimeSec);
    }
    if (Number.isFinite(intentQuerySeed.cameraAngleDeg)) {
        intentMotionParams.cameraAngleDeg = intentQuerySeed.cameraAngleDeg;
    }
}

export function prepareMainBootstrap({
    sceneStateStore,
    devMode,
    intentQuerySeed = null,
}) {
    const initialLang = normalizeLang(detectLang());
    const initialGraphicMode = normalizeGraphicMode(new URLSearchParams(window.location.search).get('graphic'));
    const initialSceneVariant = resolveSceneVariant(initialGraphicMode);

    // Startup state assembly:
    // (1) preset baseline -> (2) persisted dev state -> (3) query seed override.
    // Dev Panel initializes after this sequence, so sliders show final resolved values.
    // This preserves sharable URLs as the final source of truth at boot.
    applyScenePreset(initialSceneVariant);
    const initialSceneState = sceneStateStore?.load?.(initialSceneVariant) ?? null;
    if (initialSceneState) {
        applyConfigState(initialSceneState);
    }
    applyIntentLoopStartupOverrides(intentQuerySeed);
    applyPageLanguage(initialLang, { devMode });
    initMouseTracking();

    return {
        initialLang,
        initialGraphicMode,
        initialSceneVariant,
    };
}

export async function createMainSceneRuntime({
    container,
    sceneVariant,
}) {
    const sceneModule = await loadSceneModule(sceneVariant);
    const { createScene, getCreationLinkTargetMeshes, updateScene } = sceneModule;
    const { scene, camera, renderer } = createScene(container);
    renderer.autoClear = false;

    return {
        scene,
        camera,
        renderer,
        getCreationLinkTargetMeshes,
        updateScene,
    };
}
