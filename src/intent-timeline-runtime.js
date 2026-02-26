import { initIntentTimelineHud } from './intent-timeline-hud.js';
import {
    computeIntentRuntimeTimeline,
    resolveIntentLoopAnchorSecForContinuity,
    resolveIntentShiftTurnElapsedSecByPathSec,
    resolveIntentStartTimingMinForRawContinuity,
    solveStartTimingMinForElapsedSecNow,
    solveStartTimingMinForPhaseNow,
} from './intent-timeline.js';

export function createIntentTimelineRuntime({
    devMode,
    clock,
    captureEnableMaxDeltaSec,
    intentMotionParams,
    shiftTurnState,
    saveSceneState,
}) {
    let capturedLoopStartShaderSec = null;

    function markLoopAnchorDirty() {
        capturedLoopStartShaderSec = null;
    }

    function persistState() {
        if (typeof saveSceneState === 'function') {
            saveSceneState();
        }
    }

    const hud = devMode ? initIntentTimelineHud({
        onApplyPhaseNow: (phase) => {
            const nowSec = clock.getElapsedTime();
            intentMotionParams.startTimingMin = solveStartTimingMinForPhaseNow(phase, nowSec, intentMotionParams);
            markLoopAnchorDirty();
            persistState();
        },
        onApplySecNow: (targetElapsedSec) => {
            const nowSec = clock.getElapsedTime();
            intentMotionParams.startTimingMin = solveStartTimingMinForElapsedSecNow(targetElapsedSec, nowSec, intentMotionParams);
            markLoopAnchorDirty();
            persistState();
        },
        onShiftSec: (deltaSec) => {
            const nowSec = clock.getElapsedTime();
            const range = shiftTurnState.getRange();
            const current = computeIntentRuntimeTimeline(nowSec, intentMotionParams);
            // Shift +/- follows wrapped path-space, then maps to elapsed seconds.
            const nextPathSec = current.shiftTurnPathSec + deltaSec;
            const targetElapsedSec = resolveIntentShiftTurnElapsedSecByPathSec(nextPathSec, range);
            intentMotionParams.startTimingMin = solveStartTimingMinForElapsedSecNow(targetElapsedSec, nowSec, intentMotionParams);
            markLoopAnchorDirty();
            persistState();
        },
        onCaptureLoopStart: () => {
            const nowSec = clock.getElapsedTime();
            const runtime = computeIntentRuntimeTimeline(nowSec, intentMotionParams);
            capturedLoopStartShaderSec = runtime.shaderTimeSec;
            const orbitSec = runtime.loopOrbitSec;
            intentMotionParams.loopAnchorSec = capturedLoopStartShaderSec - orbitSec;
            persistState();
        },
        onEnableSeamlessLoop: () => {
            const nowSec = clock.getElapsedTime();
            if (Number.isFinite(capturedLoopStartShaderSec)) {
                const runtime = computeIntentRuntimeTimeline(nowSec, intentMotionParams);
                const captureDeltaSec = capturedLoopStartShaderSec - runtime.shaderTimeSec;
                if (Math.abs(captureDeltaSec) <= captureEnableMaxDeltaSec) {
                    const orbitSec = runtime.loopOrbitSec;
                    intentMotionParams.loopAnchorSec = capturedLoopStartShaderSec - orbitSec;
                } else {
                    intentMotionParams.loopAnchorSec = resolveIntentLoopAnchorSecForContinuity(nowSec, intentMotionParams);
                    capturedLoopStartShaderSec = null;
                }
            } else {
                intentMotionParams.loopAnchorSec = resolveIntentLoopAnchorSecForContinuity(nowSec, intentMotionParams);
            }
            intentMotionParams.seamlessLoop = true;
            persistState();
        },
        onDisableSeamlessLoop: () => {
            const nowSec = clock.getElapsedTime();
            intentMotionParams.startTimingMin = resolveIntentStartTimingMinForRawContinuity(nowSec, intentMotionParams);
            intentMotionParams.seamlessLoop = false;
            markLoopAnchorDirty();
            persistState();
        },
    }) : null;

    function getTimelineState(nowSec) {
        const runtime = computeIntentRuntimeTimeline(nowSec, intentMotionParams);
        const captureDeltaSec = Number.isFinite(capturedLoopStartShaderSec)
            ? capturedLoopStartShaderSec - runtime.shaderTimeSec
            : null;

        return {
            runtime,
            debug: {
                ...runtime,
                capturedLoopStartSec: capturedLoopStartShaderSec,
                captureDeltaSec,
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
    };
}
