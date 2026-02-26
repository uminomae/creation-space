export function createIntentShiftTurnState({ intentMotionParams, resolveIntentShiftTurnRange }) {
    const state = {
        startSec: Number(intentMotionParams.shiftTurnStartSec),
        endSec: Number(intentMotionParams.shiftTurnEndSec),
    };

    function syncFromParams() {
        // Intent:
        // 1) keep runtime range in dedicated state
        // 2) dev panel edits are the only post-init update source
        // 3) mirror sanitized values back to config for timeline/render consistency
        const nextStartSec = Number(intentMotionParams.shiftTurnStartSec);
        const nextEndSec = Number(intentMotionParams.shiftTurnEndSec);
        if (Number.isFinite(nextStartSec)) {
            state.startSec = nextStartSec;
        }
        if (Number.isFinite(nextEndSec)) {
            state.endSec = nextEndSec;
        }
        if (!Number.isFinite(state.startSec)) {
            state.startSec = 0.0;
        }
        if (!Number.isFinite(state.endSec)) {
            state.endSec = resolveIntentShiftTurnRange({
                shiftTurnStartSec: state.startSec,
            }).endSec;
        }
        const normalized = resolveIntentShiftTurnRange(state);
        state.startSec = normalized.startSec;
        state.endSec = normalized.endSec;
        intentMotionParams.shiftTurnStartSec = normalized.startSec;
        intentMotionParams.shiftTurnEndSec = normalized.endSec;
    }

    function getRange() {
        return resolveIntentShiftTurnRange(state);
    }

    return {
        syncFromParams,
        getRange,
    };
}
