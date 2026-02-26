import { createGraphicModeApplier } from './graphic-mode-apply.js';
import { cloneConfigState } from './config-state.js';
import { resolveSceneVariant } from './scene-presets.js';
import {
    normalizeGraphicMode,
    syncGraphicModeQuery,
    setGraphicButtonState,
} from './graphic-mode.js';

export function initMainGraphicModeRuntime({
    getActiveSceneVariant,
    sceneStateStore,
}) {
    return createGraphicModeApplier({
        getActiveSceneVariant,
        normalizeGraphicMode,
        resolveSceneVariant,
        saveSceneState: (sceneVariant) => {
            sceneStateStore.save(sceneVariant, cloneConfigState());
        },
        syncGraphicModeQuery,
        setGraphicButtonState,
    });
}
