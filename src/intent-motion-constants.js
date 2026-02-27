// Intent timeline defaults are centralized here so presets, timeline fallback,
// and dev panel range stay consistent while we iterate query/angle UX.
export const INTENT_SHIFT_TURN_DEFAULT_START_SEC = 0.0;
export const INTENT_SHIFT_TURN_DEFAULT_END_SEC = 10000.0;
export const INTENT_SHIFT_TURN_DEFAULT_SPAN_SEC =
    INTENT_SHIFT_TURN_DEFAULT_END_SEC - INTENT_SHIFT_TURN_DEFAULT_START_SEC;

export const INTENT_SHIFT_TURN_SLIDER_MIN_SEC = -200000.0;
export const INTENT_SHIFT_TURN_SLIDER_MAX_SEC = 200000.0;
