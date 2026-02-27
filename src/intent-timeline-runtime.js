import { initIntentTimelineHud } from './intent-timeline-hud.js';
import {
    computeIntentRuntimeTimeline,
    solveStartTimingMinForElapsedSecNow,
} from './intent-timeline.js';

function toFiniteOrNull(value) {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

function resolveNowSecFromTimeline(timeline) {
    return toFiniteOrNull(timeline?.nowSec);
}

function resolveShaderTimeSecFromTimeline(timeline) {
    return toFiniteOrNull(timeline?.shaderTimeSec);
}

function applyTargetShaderTimeSec(targetUTimeSec, timeline, intentMotionParams) {
    const normalizedTargetUTimeSec = toFiniteOrNull(targetUTimeSec);
    if (!Number.isFinite(normalizedTargetUTimeSec)) return;

    const nowSec = resolveNowSecFromTimeline(timeline);
    if (Number.isFinite(nowSec)) {
        intentMotionParams.startTimingMin = solveStartTimingMinForElapsedSecNow(
            normalizedTargetUTimeSec,
            nowSec,
            intentMotionParams
        );
        return;
    }

    // Fallback path for very early lifecycle timing:
    // if runtime "now" is not available yet, seed by zero-time equivalence.
    intentMotionParams.startTimingMin = normalizedTargetUTimeSec / 60.0;
}

export function createIntentTimelineRuntime({
    devMode,
    intentMotionParams,
}) {
    // Operator context (from this session):
    // - Shareable URLs must deterministically seed Intent Loop camera angle and uTime.
    // - "uTime edit" is represented by startTimingMin under the hood (not a direct uTime state variable).
    // - HUD and Dev Panel are both live editors against intentMotionParams.
    // Keep conversion rules centralized here so future refactors do not desync controls.
    const hud = devMode
        ? initIntentTimelineHud({
            getCameraAngleDeg: () => Number(intentMotionParams.cameraAngleDeg),
            onApplyCameraAngleDeg: (nextAngleDeg) => {
                if (!Number.isFinite(nextAngleDeg)) return;
                intentMotionParams.cameraAngleDeg = nextAngleDeg;
            },
            onApplyUTimeSec: (targetUTimeSec, timeline) => {
                applyTargetShaderTimeSec(targetUTimeSec, timeline, intentMotionParams);
            },
            onShiftUTimeSec: (deltaSec, timeline) => {
                const normalizedDeltaSec = toFiniteOrNull(deltaSec);
                if (!Number.isFinite(normalizedDeltaSec)) return;
                const currentUTimeSec = resolveShaderTimeSecFromTimeline(timeline);
                if (!Number.isFinite(currentUTimeSec)) return;
                applyTargetShaderTimeSec(currentUTimeSec + normalizedDeltaSec, timeline, intentMotionParams);
            },
        })
        : null;

    function getTimelineState(nowSec) {
        const runtime = computeIntentRuntimeTimeline(nowSec, intentMotionParams);

        return {
            runtime,
            debug: {
                ...runtime,
                nowSec,
            },
        };
    }

    function updateHudVisibility(intentScene, debugTimeline) {
        if (!hud) return;
        hud.setVisible(intentScene);
        if (intentScene) hud.update(debugTimeline);
    }

    return {
        getTimelineState,
        updateHudVisibility,
        destroy() {
            hud?.destroy?.();
        },
    };
}
