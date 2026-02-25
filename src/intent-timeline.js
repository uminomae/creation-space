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
        return finiteOr(timeline.elapsedSec, 0.0);
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
    const loopOrbitSec = computeIntentLoopOrbitByAngle(timeline.angle, loopDriftSec);
    const shaderTimeSec = seamlessLoopEnabled
        ? loopAnchorSec + loopOrbitSec
        : timeline.elapsedSec;
    return {
        ...timeline,
        shaderTimeSec,
        seamlessLoopEnabled,
        loopAnchorSec,
        loopDriftSec,
        loopOrbitSec,
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
