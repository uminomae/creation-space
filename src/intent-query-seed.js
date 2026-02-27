const TWO_PI = Math.PI * 2.0;
const RAD_TO_DEG = 180.0 / Math.PI;
const DEG_TO_RAD = Math.PI / 180.0;

// Intent Loop deep-link contract (session outcome):
// - Authors share URLs with `utime` + camera heading.
// - Preferred camera key is `camdeg` (human-friendly).
// - Legacy links using radians (`camrad`/`camphase`) must keep working.
// - Query parsing should never silently break older links.
const CAMERA_DEG_QUERY_KEYS = ['camdeg', 'camDeg', 'camrotdeg', 'camRotDeg'];
const CAMERA_RAD_QUERY_KEYS = ['camrad', 'camRad', 'camrotrad', 'camRotRad'];
const CAMERA_PHASE_QUERY_KEYS = ['camphase', 'camPhase'];
const CAMERA_TURN_QUERY_KEYS = ['camturn', 'camTurn'];
const UTIME_QUERY_KEYS = ['utime', 'uTime'];

function parseFiniteParam(params, keys) {
    for (const key of keys) {
        const raw = params.get(key);
        if (raw === null || raw === '') continue;
        const value = Number(raw);
        if (Number.isFinite(value)) return value;
    }
    return null;
}

function toCameraSeed(valueRad, source, raw) {
    if (!Number.isFinite(valueRad)) return null;
    return {
        source,
        raw,
        valueRad,
        valueDeg: valueRad * RAD_TO_DEG,
    };
}

export function resolveIntentCameraQuerySeed(params) {
    // Query priority policy:
    // 1) camdeg for human-friendly sharing
    // 2) camrad for exact radian control
    // 3) camphase kept as legacy alias (radians) for old links
    // 4) camturn for normalized turn (1.0 = 360deg)
    const cameraDegParam = parseFiniteParam(params, CAMERA_DEG_QUERY_KEYS);
    if (Number.isFinite(cameraDegParam)) {
        return toCameraSeed(cameraDegParam * DEG_TO_RAD, 'camdeg', cameraDegParam);
    }

    const cameraRadParam = parseFiniteParam(params, CAMERA_RAD_QUERY_KEYS);
    if (Number.isFinite(cameraRadParam)) {
        return toCameraSeed(cameraRadParam, 'camrad', cameraRadParam);
    }

    // Legacy alias: camphase is treated as radians for compatibility.
    const cameraPhaseParam = parseFiniteParam(params, CAMERA_PHASE_QUERY_KEYS);
    if (Number.isFinite(cameraPhaseParam)) {
        return toCameraSeed(cameraPhaseParam, 'camphase(rad-legacy)', cameraPhaseParam);
    }

    const cameraTurnParam = parseFiniteParam(params, CAMERA_TURN_QUERY_KEYS);
    if (Number.isFinite(cameraTurnParam)) {
        return toCameraSeed(cameraTurnParam * TWO_PI, 'camturn', cameraTurnParam);
    }

    return null;
}

export function resolveIntentQuerySeed(params) {
    const initialUTimeSec = parseFiniteParam(params, UTIME_QUERY_KEYS);
    const camera = resolveIntentCameraQuerySeed(params);

    return {
        initialUTimeSec: Number.isFinite(initialUTimeSec) ? initialUTimeSec : null,
        cameraAngleDeg: Number.isFinite(camera?.valueDeg) ? camera.valueDeg : null,
        camera,
    };
}
