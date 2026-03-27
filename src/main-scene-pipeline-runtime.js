import { createMainSceneRuntime } from './main-bootstrap.js';
import { initMainPostFxRuntime } from './main-postfx-runtime.js';

export async function initMainScenePipelineRuntime({
    container,
    initialSceneVariant,
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

    const isIntentScene = () => initialSceneVariant === 'intent';

    const { postFxRuntime } = initMainPostFxRuntime({
        renderer,
        scene,
        camera,
        isIntentScene,
    });

    return {
        scene,
        camera,
        renderer,
        updateScene,
        isIntentScene,
        getCreationLinkTargetMeshes,
        postFxRuntime,
    };
}
