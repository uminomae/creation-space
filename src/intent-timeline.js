function finiteOr(value, fallback) {
    return Number.isFinite(value) ? value : fallback;
}

function wrap(value, period) {
    if (!Number.isFinite(period) || period <= 0) return 0;
    return ((value % period) + period) % period;
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

export function startTimingMinForElapsedSecAtZero(targetElapsedSec) {
    const target = finiteOr(targetElapsedSec, 0.0);
    return target / 60.0;
}
