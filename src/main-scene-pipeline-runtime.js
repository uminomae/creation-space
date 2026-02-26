import { createMainSceneRuntime } from './main-bootstrap.js';
import { initMainContentRuntime } from './main-content-runtime.js';
import { initMainGraphicModeRuntime } from './main-graphic-mode-runtime.js';
import { initMainPostFxRuntime } from './main-postfx-runtime.js';

export async function initMainScenePipelineRuntime({
    container,
    initialLang,
    initialGraphicMode,
    initialSceneVariant,
    devMode,
    devVersion,
    sceneStateStore,
}) {
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

    const activeSceneVariant = initialSceneVariant;
    const getSceneVariant = () => activeSceneVariant;
    const isIntentScene = () => getSceneVariant() === 'intent';

    const applyGraphicMode = initMainGraphicModeRuntime({
        getActiveSceneVariant: getSceneVariant,
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

    return {
        scene,
        camera,
        renderer,
        updateScene,
        isIntentScene,
        getSceneVariant,
        postFxRuntime,
    };
}
