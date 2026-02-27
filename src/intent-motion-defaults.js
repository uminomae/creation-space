import {
    INTENT_SHIFT_TURN_DEFAULT_END_SEC,
    INTENT_SHIFT_TURN_DEFAULT_START_SEC,
} from './intent-motion-constants.js';

// Single source of truth for Intent Loop startup defaults.
// Used by both runtime config and scene presets to prevent drift.
export const INTENT_MOTION_DEFAULTS = Object.freeze({
    cameraRotateSpeed: 1.0,
    // Operator-facing camera heading seed (deg). Query seeds and Dev Panel use this.
    cameraAngleDeg: 0.0,
    startTimingMin: 7.638,
    loopPeriodSec: 480.0,
    timeScale: 1.0,
    shiftTurnStartSec: INTENT_SHIFT_TURN_DEFAULT_START_SEC,
    shiftTurnEndSec: INTENT_SHIFT_TURN_DEFAULT_END_SEC,
    seamlessLoop: false,
    loopAnchorSec: 458.278,
    loopDriftSec: 180.0,
});
