import {
    INTENT_SHIFT_TURN_DEFAULT_SPAN_SEC as SHIFT_TURN_DEFAULT_SPAN_SEC,
} from './intent-motion-constants.js';

function finiteOr(value, fallback) {
    return Number.isFinite(value) ? value : fallback;
}

function normalizeUnitPhase(value) {
    if (!Number.isFinite(value)) return 0.0;
    return ((value % 1.0) + 1.0) % 1.0;
}

function wrap(value, period) {
    if (!Number.isFinite(period) || period <= 0) return 0;
    return ((value % period) + period) % period;
}

const SHIFT_TURN_MIN_SPAN_SEC = 0.001;

// Shift Turn range is a directed lane:
// start -> end when direction = +1, start <- end when direction = -1.
// We keep direction explicit so reversed ranges (start > end) work identically.
export function resolveIntentShiftTurnRange(intentMotionParams = {}) {
    const startSec = finiteOr(intentMotionParams.shiftTurnStartSec, 0.0);
    const requestedEndSec = finiteOr(
        intentMotionParams.shiftTurnEndSec,
        startSec + SHIFT_TURN_DEFAULT_SPAN_SEC
    );
    const spanSec = Math.max(SHIFT_TURN_MIN_SPAN_SEC, Math.abs(requestedEndSec - startSec));
    const direction = requestedEndSec >= startSec ? 1.0 : -1.0;
    return {
        startSec,
        endSec: requestedEndSec,
        spanSec,
        direction,
    };
}

// Project raw elapsed time onto an endless back-and-forth path.
// The returned value is in [0, span*2) on the directed lane.
export function resolveIntentShiftTurnPathSec(rawElapsedSec, shiftTurnRange) {
    const startSec = finiteOr(shiftTurnRange?.startSec, 0.0);
    const spanSec = Math.max(SHIFT_TURN_MIN_SPAN_SEC, finiteOr(shiftTurnRange?.spanSec, SHIFT_TURN_DEFAULT_SPAN_SEC));
    const direction = shiftTurnRange?.direction === -1.0 ? -1.0 : 1.0;
    const laneSec = (finiteOr(rawElapsedSec, 0.0) - startSec) * direction;
    const periodSec = spanSec * 2.0;
    return wrap(laneSec, periodSec);
}

// Fold path position back into lane space (triangle wave),
// then map it back to elapsed sec in world direction.
export function resolveIntentShiftTurnElapsedSecByPathSec(pathSec, shiftTurnRange) {
    const startSec = finiteOr(shiftTurnRange?.startSec, 0.0);
    const spanSec = Math.max(SHIFT_TURN_MIN_SPAN_SEC, finiteOr(shiftTurnRange?.spanSec, SHIFT_TURN_DEFAULT_SPAN_SEC));
    const direction = shiftTurnRange?.direction === -1.0 ? -1.0 : 1.0;
    const periodSec = spanSec * 2.0;
    const wrappedPathSec = wrap(pathSec, periodSec);
    const foldedLaneSec = wrappedPathSec <= spanSec ? wrappedPathSec : periodSec - wrappedPathSec;
    return startSec + foldedLaneSec * direction;
}

export function resolveIntentShiftTurnElapsedSec(rawElapsedSec, shiftTurnRange) {
    const pathSec = resolveIntentShiftTurnPathSec(rawElapsedSec, shiftTurnRange);
    return resolveIntentShiftTurnElapsedSecByPathSec(pathSec, shiftTurnRange);
}

export function isIntentSeamlessLoopEnabled(intentMotionParams = {}) {
    const value = intentMotionParams.seamlessLoop;
    if (typeof value === 'boolean') return value;
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric >= 0.5;
}

export function resolveIntentLoopAnchorSec(intentMotionParams = {}) {
    return finiteOr(intentMotionParams.loopAnchorSec, 0.0);
}

export function resolveIntentLoopDriftSec(intentMotionParams = {}) {
    return Math.max(0.0, finiteOr(intentMotionParams.loopDriftSec, 180.0));
}

export function computeIntentLoopOrbitByPhase(phase, loopDriftSec) {
    const unitPhase = normalizeUnitPhase(phase);
    const angle = unitPhase * Math.PI * 2.0;
    const loopSin = Math.sin(angle);
    const loopCos = Math.cos(angle);
    const sin2 = 2.0 * loopSin * loopCos;
    const cos2 = loopCos * loopCos - loopSin * loopSin;
    return loopSin * loopDriftSec
        + sin2 * loopDriftSec * 0.35
        + cos2 * loopDriftSec * 0.2;
}

export function computeIntentLoopOrbitByAngle(angle, loopDriftSec) {
    if (!Number.isFinite(angle)) return computeIntentLoopOrbitByPhase(0.0, loopDriftSec);
    const loopSin = Math.sin(angle);
    const loopCos = Math.cos(angle);
    const sin2 = 2.0 * loopSin * loopCos;
    const cos2 = loopCos * loopCos - loopSin * loopSin;
    return loopSin * loopDriftSec
        + sin2 * loopDriftSec * 0.35
        + cos2 * loopDriftSec * 0.2;
}

export function resolveIntentTimingParams(intentMotionParams = {}) {
    const loopPeriodSec = Math.max(0.001, finiteOr(intentMotionParams.loopPeriodSec, 480.0));
    const timeScale = finiteOr(intentMotionParams.timeScale, 1.0);
    const startTimingMin = finiteOr(
        intentMotionParams.startTimingMin,
        finiteOr(intentMotionParams.startTiming, 120.0) / 60.0
    );
    const startOffsetSec = startTimingMin * 60.0;
    return { loopPeriodSec, timeScale, startTimingMin, startOffsetSec };
}

export function computeIntentTimeline(timeSec, intentMotionParams = {}) {
    const timing = resolveIntentTimingParams(intentMotionParams);
    const elapsedSec = timeSec * timing.timeScale + timing.startOffsetSec;
    const wrappedSec = wrap(elapsedSec, timing.loopPeriodSec);
    const phase = wrappedSec / timing.loopPeriodSec;
    const rawPhase = elapsedSec / timing.loopPeriodSec;
    const angle = phase * Math.PI * 2.0;
    return {
        ...timing,
        elapsedSec,
        shaderTimeSec: elapsedSec,
        wrappedSec,
        phase,
        rawPhase,
        angle,
        loopSin: Math.sin(angle),
        loopCos: Math.cos(angle),
    };
}

export function computeIntentShaderTime(timeline, intentMotionParams = {}) {
    if (!timeline || typeof timeline !== 'object') return 0.0;
    if (!isIntentSeamlessLoopEnabled(intentMotionParams)) {
        const shiftTurnRange = resolveIntentShiftTurnRange(intentMotionParams);
        return resolveIntentShiftTurnElapsedSec(finiteOr(timeline.elapsedSec, 0.0), shiftTurnRange);
    }
    const anchorSec = resolveIntentLoopAnchorSec(intentMotionParams);
    const driftSec = resolveIntentLoopDriftSec(intentMotionParams);
    const orbitSec = computeIntentLoopOrbitByAngle(timeline.angle, driftSec);
    return anchorSec + orbitSec;
}

export function computeIntentRuntimeTimeline(timeSec, intentMotionParams = {}) {
    const timeline = computeIntentTimeline(timeSec, intentMotionParams);
    const seamlessLoopEnabled = isIntentSeamlessLoopEnabled(intentMotionParams);
    const loopAnchorSec = resolveIntentLoopAnchorSec(intentMotionParams);
    const loopDriftSec = resolveIntentLoopDriftSec(intentMotionParams);
    const shiftTurnRange = resolveIntentShiftTurnRange(intentMotionParams);
    const shiftTurnPathPeriodSec = shiftTurnRange.spanSec * 2.0;
    const shiftTurnPathSec = resolveIntentShiftTurnPathSec(timeline.elapsedSec, shiftTurnRange);
    const shiftTurnElapsedSec = resolveIntentShiftTurnElapsedSecByPathSec(shiftTurnPathSec, shiftTurnRange);
    const loopOrbitSec = computeIntentLoopOrbitByAngle(timeline.angle, loopDriftSec);
    const shaderTimeSec = seamlessLoopEnabled
        ? loopAnchorSec + loopOrbitSec
        : shiftTurnElapsedSec;
    return {
        ...timeline,
        shaderTimeSec,
        seamlessLoopEnabled,
        loopAnchorSec,
        loopDriftSec,
        loopOrbitSec,
        shiftTurnStartSec: shiftTurnRange.startSec,
        shiftTurnEndSec: shiftTurnRange.endSec,
        shiftTurnSpanSec: shiftTurnRange.spanSec,
        shiftTurnPathSec,
        shiftTurnPathPeriodSec,
        shiftTurnElapsedSec,
    };
}

export function solveStartTimingMinForPhaseNow(targetPhase, timeSec, intentMotionParams = {}) {
    const timing = resolveIntentTimingParams(intentMotionParams);
    const targetRawPhase = finiteOr(targetPhase, 0.0);
    const targetElapsedSec = targetRawPhase * timing.loopPeriodSec;
    const startOffsetSec = targetElapsedSec - timeSec * timing.timeScale;
    return startOffsetSec / 60.0;
}

export function startTimingMinForPhaseAtZero(targetPhase, intentMotionParams = {}) {
    const timing = resolveIntentTimingParams(intentMotionParams);
    const targetRawPhase = finiteOr(targetPhase, 0.0);
    return (targetRawPhase * timing.loopPeriodSec) / 60.0;
}

export function solveStartTimingMinForElapsedSecNow(targetElapsedSec, timeSec, intentMotionParams = {}) {
    const timing = resolveIntentTimingParams(intentMotionParams);
    const target = finiteOr(targetElapsedSec, 0.0);
    const startOffsetSec = target - timeSec * timing.timeScale;
    return startOffsetSec / 60.0;
}

export function resolveIntentLoopAnchorSecForContinuity(timeSec, intentMotionParams = {}) {
    const timeline = computeIntentTimeline(timeSec, intentMotionParams);
    const driftSec = resolveIntentLoopDriftSec(intentMotionParams);
    const orbitSec = computeIntentLoopOrbitByAngle(timeline.angle, driftSec);
    const shaderTimeSec = computeIntentShaderTime(timeline, intentMotionParams);
    return shaderTimeSec - orbitSec;
}

export function resolveIntentStartTimingMinForRawContinuity(timeSec, intentMotionParams = {}) {
    const timeline = computeIntentTimeline(timeSec, intentMotionParams);
    const shaderTimeSec = computeIntentShaderTime(timeline, intentMotionParams);
    return solveStartTimingMinForElapsedSecNow(shaderTimeSec, timeSec, intentMotionParams);
}

export function startTimingMinForElapsedSecAtZero(targetElapsedSec) {
    const target = finiteOr(targetElapsedSec, 0.0);
    return target / 60.0;
}
