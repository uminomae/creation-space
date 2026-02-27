const HUD_REFRESH_INTERVAL_MS = 120;
const RAD_TO_DEG = 180.0 / Math.PI;

function parseFiniteInput(inputEl) {
    if (!inputEl) return null;
    const value = Number(inputEl.value);
    return Number.isFinite(value) ? value : null;
}

function updateInputIfIdle(inputEl, value, digits = 3, lockSync = false) {
    if (!inputEl) return;
    if (lockSync) return;
    if (document.activeElement === inputEl) return;
    if (!Number.isFinite(value)) return;
    inputEl.value = value.toFixed(digits);
}

function buildReadoutText(timeline) {
    const loopAngleDeg = timeline.angle * RAD_TO_DEG;
    return [
        `uTime(shader sec): ${timeline.shaderTimeSec.toFixed(3)}`,
        `loopAngle(deg): ${loopAngleDeg.toFixed(3)}`,
        `wrappedSec: ${timeline.wrappedSec.toFixed(3)} / ${timeline.loopPeriodSec.toFixed(3)}`,
        `elapsedSec(raw): ${timeline.elapsedSec.toFixed(3)}`,
        `elapsedSec(turn): ${timeline.shiftTurnElapsedSec.toFixed(3)}`,
        `turnSec(start): ${timeline.shiftTurnStartSec.toFixed(3)}`,
        `turnSec(end): ${timeline.shiftTurnEndSec.toFixed(3)}`,
        `startTimingMin: ${timeline.startTimingMin.toFixed(4)}`,
    ].join('\n');
}

function bindApplyOnEnter(inputEl, applyFn) {
    inputEl?.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        applyFn();
    });
}

export function initIntentTimelineHud({
    getCameraAngleDeg = () => 0.0,
    onApplyCameraAngleDeg = null,
    onApplyUTimeSec = null,
    onShiftUTimeSec = null,
} = {}) {
    // Session intent contract:
    // - Readout and controls are intentionally split into two panels.
    // - Readout can be simplified without deleting operator inputs.
    // - Controls must keep working while values auto-refresh from runtime.
    const hud = document.createElement('aside');
    hud.id = 'intent-timeline-hud';
    hud.setAttribute('aria-live', 'polite');
    hud.innerHTML = `
        <pre class="intent-timeline-hud-readout" id="intent-timeline-hud-readout">uTime(shader sec): -</pre>
    `;
    document.body.appendChild(hud);

    const formPanel = document.createElement('aside');
    formPanel.id = 'intent-timeline-form-panel';
    formPanel.setAttribute('aria-live', 'polite');
    formPanel.innerHTML = `
        <div class="intent-timeline-hud-controls">
            <label for="intent-timeline-angle-deg-input">Camera Angle Deg</label>
            <input id="intent-timeline-angle-deg-input" type="number" step="0.1" />
            <div class="intent-timeline-hud-actions intent-timeline-hud-actions-single">
                <button type="button" id="intent-timeline-angle-apply-btn">Apply Angle</button>
            </div>

            <label for="intent-timeline-start-utime-input">Start uTime Sec</label>
            <input id="intent-timeline-start-utime-input" type="number" step="0.1" />
            <div class="intent-timeline-hud-actions intent-timeline-hud-actions-single">
                <button type="button" id="intent-timeline-start-utime-apply-btn">Set uTime</button>
            </div>

            <label for="intent-timeline-shift-sec-input">Shift Sec (+/-)</label>
            <input id="intent-timeline-shift-sec-input" type="number" step="0.1" value="300" />
            <div class="intent-timeline-hud-actions">
                <button type="button" id="intent-timeline-shift-plus-btn">Jump +Sec</button>
                <button type="button" id="intent-timeline-shift-minus-btn">Jump -Sec</button>
            </div>
        </div>
    `;
    document.body.appendChild(formPanel);

    const readout = hud.querySelector('#intent-timeline-hud-readout');
    const angleDegInput = formPanel.querySelector('#intent-timeline-angle-deg-input');
    const startUTimeInput = formPanel.querySelector('#intent-timeline-start-utime-input');
    const shiftSecInput = formPanel.querySelector('#intent-timeline-shift-sec-input');
    const angleApplyBtn = formPanel.querySelector('#intent-timeline-angle-apply-btn');
    const startUTimeApplyBtn = formPanel.querySelector('#intent-timeline-start-utime-apply-btn');
    const shiftPlusBtn = formPanel.querySelector('#intent-timeline-shift-plus-btn');
    const shiftMinusBtn = formPanel.querySelector('#intent-timeline-shift-minus-btn');

    let latestTimeline = null;
    let hudVisible = false;
    let lastRefreshMs = 0;
    let lastReadoutText = '';

    function syncFormPanelPosition() {
        if (!hudVisible) return;
        const rect = hud.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        formPanel.style.left = `${Math.round(rect.left)}px`;
        formPanel.style.top = `${Math.round(rect.bottom + 8)}px`;
        formPanel.style.width = `${Math.round(rect.width)}px`;
    }

    function applyHudVisibility(nextVisible) {
        const isVisible = Boolean(nextVisible);
        hudVisible = isVisible;
        hud.classList.toggle('is-visible', isVisible);
        formPanel.classList.toggle('is-visible', isVisible);
        if (isVisible) {
            syncFormPanelPosition();
        }
    }

    function applyAngleFromInput() {
        if (typeof onApplyCameraAngleDeg !== 'function') return;
        const nextAngleDeg = parseFiniteInput(angleDegInput);
        if (!Number.isFinite(nextAngleDeg)) return;
        onApplyCameraAngleDeg(nextAngleDeg, latestTimeline);
        angleDegInput.value = nextAngleDeg.toFixed(3);
    }

    function applyUTimeFromInput() {
        if (typeof onApplyUTimeSec !== 'function') return;
        const nextUTimeSec = parseFiniteInput(startUTimeInput);
        if (!Number.isFinite(nextUTimeSec)) return;
        onApplyUTimeSec(nextUTimeSec, latestTimeline);
        startUTimeInput.value = nextUTimeSec.toFixed(3);
    }

    function shiftUTime(sign) {
        const deltaBase = parseFiniteInput(shiftSecInput);
        if (!Number.isFinite(deltaBase) || deltaBase === 0) return;
        const deltaSec = Math.abs(deltaBase) * (sign >= 0 ? 1.0 : -1.0);

        if (typeof onShiftUTimeSec === 'function') {
            onShiftUTimeSec(deltaSec, latestTimeline);
            return;
        }

        if (typeof onApplyUTimeSec === 'function' && Number.isFinite(latestTimeline?.shaderTimeSec)) {
            onApplyUTimeSec(latestTimeline.shaderTimeSec + deltaSec, latestTimeline);
        }
    }

    angleApplyBtn?.addEventListener('click', applyAngleFromInput);
    startUTimeApplyBtn?.addEventListener('click', applyUTimeFromInput);
    shiftPlusBtn?.addEventListener('click', () => shiftUTime(1));
    shiftMinusBtn?.addEventListener('click', () => shiftUTime(-1));
    bindApplyOnEnter(angleDegInput, applyAngleFromInput);
    bindApplyOnEnter(startUTimeInput, applyUTimeFromInput);
    window.addEventListener('resize', syncFormPanelPosition);

    return {
        setVisible(isVisible) {
            const nextVisible = Boolean(isVisible);
            if (nextVisible !== hudVisible) {
                lastRefreshMs = 0;
            }
            applyHudVisibility(nextVisible);
        },
        update(timeline) {
            latestTimeline = timeline;
            if (!hudVisible) return;

            const nowMs = window.performance?.now?.() ?? Date.now();
            const activeElement = document.activeElement;
            const isFormInteracting = Boolean(activeElement && formPanel.contains(activeElement));
            const isHudInteracting = Boolean(
                activeElement && (hud.contains(activeElement) || formPanel.contains(activeElement))
            );
            if (!isHudInteracting && (nowMs - lastRefreshMs) < HUD_REFRESH_INTERVAL_MS) {
                return;
            }
            lastRefreshMs = nowMs;

            const nextReadout = buildReadoutText(timeline);
            if (nextReadout !== lastReadoutText) {
                readout.textContent = nextReadout;
                lastReadoutText = nextReadout;
            }

            updateInputIfIdle(
                angleDegInput,
                Number.isFinite(getCameraAngleDeg?.()) ? getCameraAngleDeg() : 0.0,
                3,
                isFormInteracting
            );
            updateInputIfIdle(startUTimeInput, timeline.shaderTimeSec, 3, isFormInteracting);
            syncFormPanelPosition();
        },
        getLatestTimeline() {
            return latestTimeline;
        },
        destroy() {
            window.removeEventListener('resize', syncFormPanelPosition);
            hud.remove();
            formPanel.remove();
        },
    };
}
