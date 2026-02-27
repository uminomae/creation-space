import { intentMotionParams } from './config.js';
import { createIntentShiftTurnState } from './intent-shift-turn-state.js';
import { createIntentTimelineRuntime } from './intent-timeline-runtime.js';
import { resolveIntentShiftTurnRange } from './intent-timeline.js';

export function initMainIntentRuntime({
    devMode,
}) {
    const shiftTurnState = createIntentShiftTurnState({
        intentMotionParams,
        resolveIntentShiftTurnRange,
    });
    shiftTurnState.syncFromParams();

    const intentTimelineRuntime = createIntentTimelineRuntime({
        devMode,
        intentMotionParams,
    });

    return {
        shiftTurnState,
        intentTimelineRuntime,
    };
}
