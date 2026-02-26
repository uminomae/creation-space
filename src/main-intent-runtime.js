import { cloneConfigState } from './config-state.js';
import { intentMotionParams } from './config.js';
import { createIntentShiftTurnState } from './intent-shift-turn-state.js';
import { createIntentTimelineRuntime } from './intent-timeline-runtime.js';
import { resolveIntentShiftTurnRange } from './intent-timeline.js';

export function initMainIntentRuntime({
    devMode,
    clock,
    captureEnableMaxDeltaSec,
    sceneStateStore,
    getSceneVariant,
}) {
    const shiftTurnState = createIntentShiftTurnState({
        intentMotionParams,
        resolveIntentShiftTurnRange,
    });
    shiftTurnState.syncFromParams();

    const intentTimelineRuntime = createIntentTimelineRuntime({
        devMode,
        clock,
        captureEnableMaxDeltaSec,
        intentMotionParams,
        shiftTurnState,
        saveSceneState: () => {
            sceneStateStore.save(getSceneVariant(), cloneConfigState());
        },
    });

    return {
        shiftTurnState,
        intentTimelineRuntime,
    };
}
