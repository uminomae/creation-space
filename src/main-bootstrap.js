import { initMouseTracking } from './mouse-state.js';
import { applyConfigState } from './config-state.js';
import { applyScenePreset, resolveSceneVariant } from './scene-presets.js';
import { applyPageLanguage } from './page-language.js';
import { normalizeGraphicMode } from './graphic-mode.js';
import { loadSceneModule } from './scene-module-loader.js';
import { detectLang, normalizeLang } from './i18n.js';

export function prepareMainBootstrap({
    sceneStateStore,
    devMode,
    devVersion,
}) {
    const initialLang = normalizeLang(detectLang());
    const initialGraphicMode = normalizeGraphicMode(new URLSearchParams(window.location.search).get('graphic'));
    const initialSceneVariant = resolveSceneVariant(initialGraphicMode);

    applyScenePreset(initialSceneVariant);
    const initialSceneState = sceneStateStore.load(initialSceneVariant);
    if (initialSceneState) {
        applyConfigState(initialSceneState);
    }
    applyPageLanguage(initialLang, { devMode, devVersion });
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
