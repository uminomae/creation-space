export function initIntentTimelineHud({
    onApplyPhaseNow,
    onApplySecNow,
    onShiftSec,
    onCaptureLoopStart,
    onEnableSeamlessLoop,
    onDisableSeamlessLoop,
}) {
    const HUD_REFRESH_INTERVAL_MS = 120;
    const hud = document.createElement('aside');
    hud.id = 'intent-timeline-hud';
    hud.setAttribute('aria-live', 'polite');
    hud.innerHTML = `
        <div class="intent-timeline-hud-title">Intent Timeline</div>
        <pre class="intent-timeline-hud-readout" id="intent-timeline-hud-readout">phase: -</pre>
        <div class="intent-timeline-hud-controls">
            <label for="intent-timeline-phase-input">Phase (raw / unbounded)</label>
            <input id="intent-timeline-phase-input" type="number" step="0.0001" value="0.0000">
            <div class="intent-timeline-hud-actions intent-timeline-hud-actions-single">
                <button type="button" id="intent-timeline-apply-now">Jump Phase Now</button>
            </div>
        </div>
        <div class="intent-timeline-hud-controls">
            <label for="intent-timeline-sec-input">Timeline Sec (raw)</label>
            <input id="intent-timeline-sec-input" type="number" step="0.001" value="0.000">
            <div class="intent-timeline-hud-actions intent-timeline-hud-actions-single">
                <button type="button" id="intent-timeline-sec-now">Jump Sec Now</button>
            </div>
        </div>
        <div class="intent-timeline-hud-controls">
            <label for="intent-timeline-shift-sec-input">Shift Sec (+/-)</label>
            <input id="intent-timeline-shift-sec-input" type="number" step="1" value="300">
            <div class="intent-timeline-hud-actions">
                <button type="button" id="intent-timeline-shift-plus">Jump +Sec</button>
                <button type="button" id="intent-timeline-shift-minus">Jump -Sec</button>
            </div>
        </div>
        <div class="intent-timeline-hud-controls">
            <label>Seamless Loop (2-step)</label>
            <div class="intent-timeline-hud-actions">
                <button type="button" id="intent-timeline-loop-capture">Capture Start Now</button>
                <button type="button" id="intent-timeline-loop-on">Loop ON</button>
            </div>
            <div class="intent-timeline-hud-actions intent-timeline-hud-actions-single">
                <button type="button" id="intent-timeline-loop-off">Loop OFF</button>
            </div>
        </div>
    `;
    document.body.appendChild(hud);

    const readout = hud.querySelector('#intent-timeline-hud-readout');
    const phaseInput = hud.querySelector('#intent-timeline-phase-input');
    const secInput = hud.querySelector('#intent-timeline-sec-input');
    const shiftSecInput = hud.querySelector('#intent-timeline-shift-sec-input');
    const applyNowButton = hud.querySelector('#intent-timeline-apply-now');
    const applySecNowButton = hud.querySelector('#intent-timeline-sec-now');
    const shiftPlusButton = hud.querySelector('#intent-timeline-shift-plus');
    const shiftMinusButton = hud.querySelector('#intent-timeline-shift-minus');
    const loopCaptureButton = hud.querySelector('#intent-timeline-loop-capture');
    const loopOnButton = hud.querySelector('#intent-timeline-loop-on');
    const loopOffButton = hud.querySelector('#intent-timeline-loop-off');

    let latestTimeline = null;
    let hudVisible = false;
    let lastRefreshMs = 0;
    let lastReadoutText = '';

    function parseNumberInput(inputElement) {
        const text = String(inputElement.value ?? '').trim();
        if (text.length === 0) return null;
        const raw = Number(text);
        if (!Number.isFinite(raw)) return null;
        return raw;
    }

    function parsePhaseInput() {
        return parseNumberInput(phaseInput);
    }

    function parseSecInput() {
        return parseNumberInput(secInput);
    }

    function parseShiftSecInput() {
        return parseNumberInput(shiftSecInput);
    }

    function applyIfValid(parseFn, applyFn) {
        const value = parseFn();
        if (value === null) return;
        applyFn(value);
    }

    applyNowButton.addEventListener('click', () => {
        applyIfValid(parsePhaseInput, onApplyPhaseNow);
    });

    applySecNowButton.addEventListener('click', () => {
        applyIfValid(parseSecInput, onApplySecNow);
    });

    shiftPlusButton.addEventListener('click', () => {
        applyIfValid(parseShiftSecInput, onShiftSec);
    });

    shiftMinusButton.addEventListener('click', () => {
        applyIfValid(parseShiftSecInput, (value) => onShiftSec(-value));
    });

    loopCaptureButton.addEventListener('click', () => {
        onCaptureLoopStart();
    });

    loopOnButton.addEventListener('click', () => {
        onEnableSeamlessLoop();
    });

    loopOffButton.addEventListener('click', () => {
        onDisableSeamlessLoop();
    });

    return {
        setVisible(isVisible) {
            const nextVisible = Boolean(isVisible);
            if (nextVisible !== hudVisible) {
                lastRefreshMs = 0;
            }
            hudVisible = nextVisible;
            hud.classList.toggle('is-visible', nextVisible);
        },
        update(timeline) {
            latestTimeline = timeline;
            if (!hudVisible) return;

            const nowMs = window.performance?.now?.() ?? Date.now();
            const activeElement = document.activeElement;
            const isHudInteracting = Boolean(activeElement && hud.contains(activeElement));
            if (!isHudInteracting && (nowMs - lastRefreshMs) < HUD_REFRESH_INTERVAL_MS) {
                return;
            }
            lastRefreshMs = nowMs;

            if (!isHudInteracting) {
                phaseInput.value = timeline.rawPhase.toFixed(6);
                secInput.value = timeline.elapsedSec.toFixed(3);
            }
            const nextReadout = [
                `phase(raw/wrapped): ${timeline.rawPhase.toFixed(6)} / ${timeline.phase.toFixed(6)}`,
                `uTime(shader sec): ${timeline.shaderTimeSec.toFixed(3)}`,
                `loopAngle(rad): ${timeline.angle.toFixed(6)}`,
                `wrappedSec: ${timeline.wrappedSec.toFixed(3)} / ${timeline.loopPeriodSec.toFixed(3)}`,
                `elapsedSec(raw): ${timeline.elapsedSec.toFixed(3)}`,
                `elapsedSec(turn): ${timeline.shiftTurnElapsedSec.toFixed(3)}`,
                `turnSec(start/end): ${timeline.shiftTurnStartSec.toFixed(3)} / ${timeline.shiftTurnEndSec.toFixed(3)}`,
                `turnSpanSec: ${timeline.shiftTurnSpanSec.toFixed(3)}`,
                `startTimingMin: ${timeline.startTimingMin.toFixed(4)}`,
                `timeScale: ${timeline.timeScale.toFixed(4)}`,
                `loopMode: ${timeline.seamlessLoopEnabled ? 'seamless' : 'explore'}`,
                `loopAnchorSec: ${timeline.loopAnchorSec.toFixed(3)}`,
                `loopDriftSec: ${timeline.loopDriftSec.toFixed(3)}`,
                `loopOrbitSec: ${timeline.loopOrbitSec.toFixed(3)}`,
                `capture(sec): ${Number.isFinite(timeline.capturedLoopStartSec) ? timeline.capturedLoopStartSec.toFixed(3) : '-'}`,
                `captureDelta(sec): ${Number.isFinite(timeline.captureDeltaSec) ? timeline.captureDeltaSec.toFixed(3) : '-'}`,
                `sin/cos: ${timeline.loopSin.toFixed(4)} / ${timeline.loopCos.toFixed(4)}`,
            ].join('\n');
            if (nextReadout !== lastReadoutText) {
                readout.textContent = nextReadout;
                lastReadoutText = nextReadout;
            }
        },
        getLatestTimeline() {
            return latestTimeline;
        },
    };
}
