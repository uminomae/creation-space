import { createSceneStateStore } from './dev-scene-state.js';
import { getScenePresetVersion } from './scene-presets.js';

const CAPTURE_ENABLE_MAX_DELTA_SEC = 0.3;

export function createMainRuntimeContext(search = window.location.search) {
    const params = new URLSearchParams(search);
    const devMode = params.has('dev');
    const devPanelStatePersist = params.get('devstate') === 'persist';

    const sceneStateStore = createSceneStateStore({
        enabled: devPanelStatePersist,
        getPresetVersion: getScenePresetVersion,
    });

    return {
        devMode,
        captureEnableMaxDeltaSec: CAPTURE_ENABLE_MAX_DELTA_SEC,
        sceneStateStore,
    };
}
