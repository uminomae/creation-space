import { createSceneStateStore } from './dev-scene-state.js';
import { getScenePresetVersion } from './scene-presets.js';
import { resolveIntentQuerySeed } from './intent-query-seed.js';

export function createMainRuntimeContext(search = window.location.search) {
    const params = new URLSearchParams(search);
    const devMode = params.has('dev');
    const devPanelStatePersist = params.get('devstate') === 'persist';
    const intentQuerySeed = resolveIntentQuerySeed(params);
    // Keep query-seed visibility explicit in dev mode because link sharing
    // (utime/camdeg) is now an operator workflow, not just debug behavior.
    if (devMode && (Number.isFinite(intentQuerySeed.initialUTimeSec) || intentQuerySeed.camera)) {
        console.info('[query-seed]', {
            utime: intentQuerySeed.initialUTimeSec,
            camera: intentQuerySeed.camera,
        });
    }

    const sceneStateStore = createSceneStateStore({
        enabled: devPanelStatePersist,
        getPresetVersion: getScenePresetVersion,
    });

    return {
        devMode,
        sceneStateStore,
        intentQuerySeed,
    };
}
