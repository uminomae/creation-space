import { setCameraPosition, setCameraTarget } from './controls.js';
import { sceneParams } from './config.js';
import { initDevAuxTools, initDevPanelRuntime } from './dev-runtime.js';

export function initMainDevRuntime({
    devMode,
    getSceneVariant,
    shiftTurnState,
    sceneStateStore,
    setStatsHandlers,
}) {
    if (!devMode) return;

    initDevAuxTools({
        setStatsHandlers,
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
