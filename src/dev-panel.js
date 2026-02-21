import {
    backgroundParams,
    breathConfig,
    creationLinkParams,
    distortionParams,
    fieldParams,
    flowParams,
    fluidParams,
    liquidParams,
    quantumWaveParams,
    sceneParams,
    toggles,
} from './config.js';

const PARAM_GROUPS = [
    {
        id: 'toggles',
        title: 'Display',
        type: 'toggle',
        target: toggles,
        fields: [
            ['background', 'Background'],
            ['field', 'Field Layer'],
            ['flowObjects', 'Flow Objects'],
            ['fog', 'Fog'],
            ['fluidField', 'Fluid Field'],
            ['liquid', 'Liquid'],
            ['quantumWave', 'Quantum Wave'],
            ['dof', 'DOF'],
            ['postProcess', 'Post Process'],
            ['autoRotate', 'Auto Rotate'],
            ['fovBreath', 'FOV Breath'],
            ['htmlBreath', 'HTML Breath'],
            ['heatHaze', 'Heat Haze'],
        ],
    },
    {
        id: 'scene',
        title: 'Scene',
        type: 'range',
        target: sceneParams,
        fields: [
            ['fogDensity', 'Fog Density', 0.0, 0.08, 0.001],
            ['camX', 'Cam X', -40, 40, 0.1],
            ['camY', 'Cam Y', -30, 30, 0.1],
            ['camZ', 'Cam Z', 8, 80, 0.1],
            ['mixCycle', 'Mix Cycle', 2.0, 30.0, 0.1],
        ],
    },
    {
        id: 'field',
        title: 'Field',
        type: 'range',
        target: fieldParams,
        fields: [
            ['intensity', 'Field Intensity', 0.0, 3.0, 0.01],
            ['alpha', 'Field Alpha', 0.0, 1.0, 0.005],
            ['lineLow', 'Line Low', 0.05, 1.2, 0.005],
            ['lineHigh', 'Line High', 0.1, 1.4, 0.005],
            ['bottomClip', 'Bottom Clip', 0.0, 0.8, 0.005],
            ['bottomFeather', 'Bottom Feather', 0.01, 0.6, 0.005],
        ],
    },
    {
        id: 'flow',
        title: 'Flow',
        type: 'range',
        target: flowParams,
        fields: [
            ['seedOpacity', 'Seed Opacity', 0.0, 1.0, 0.01],
            ['filamentOpacity', 'Filament Opacity', 0.0, 1.0, 0.01],
            ['seedDrift', 'Seed Drift', 0.1, 2.5, 0.01],
            ['chaos', 'Chaos', 0.1, 2.5, 0.01],
            ['bundleTightness', 'Bundle Tightness', 0.1, 1.5, 0.01],
            ['centerBandRatio', 'Center Band', 0.2, 0.8, 0.005],
        ],
    },
    {
        id: 'creationGlobal',
        title: 'Creation A Global',
        type: 'range',
        target: creationLinkParams,
        fields: [
            ['pulseSpeed', 'Pulse Speed', 0.1, 3.0, 0.01],
            ['vortexSpeed', 'Vortex Speed', 0.1, 2.4, 0.01],
            ['swirlStrength', 'Swirl Strength', 0.0, 1.0, 0.01],
            ['sphereFill', 'Sphere Fill', 0.2, 1.2, 0.01],
            ['colorSplitSoftness', 'Color Split Soft', 0.005, 0.3, 0.005],
            ['floatAmp', 'Float Amp', 0.0, 1.2, 0.01],
            ['floatOffset', 'Float Offset', -1.0, 1.0, 0.01],
            ['yawSpeed', 'Yaw Speed', 0.0, 1.5, 0.01],
            ['tiltSpeed', 'Tilt Speed', 0.0, 2.0, 0.01],
            ['tiltAmp', 'Tilt Amp', 0.0, 0.8, 0.01],
            ['baseScaleMul', 'Base Scale', 0.5, 2.0, 0.01],
            ['pulseScaleAmp', 'Pulse Scale', 0.0, 0.4, 0.005],
            ['hoverScaleBoost', 'Hover Scale', 0.0, 0.6, 0.01],
            ['hoverLerp', 'Hover Lerp', 0.01, 0.5, 0.005],
            ['pointAlpha', 'Point Alpha', 0.0, 1.0, 0.01],
            ['haloScalePulse', 'Halo Scale Pulse', 0.0, 4.0, 0.01],
            ['haloScaleHover', 'Halo Scale Hover', 0.0, 3.0, 0.01],
            ['haloOpacityBase', 'Halo Opacity', 0.0, 1.0, 0.01],
            ['haloOpacityPulse', 'Halo Pulse', 0.0, 1.0, 0.01],
            ['haloOpacityHover', 'Halo Hover', 0.0, 1.0, 0.01],
        ],
    },
    {
        id: 'creationLink1',
        title: 'Creation Link 1',
        type: 'range',
        target: creationLinkParams,
        fields: [
            ['link1PosX', 'Pos X', -20.0, 20.0, 0.1],
            ['link1PosY', 'Pos Y', -20.0, 20.0, 0.1],
            ['link1PosZ', 'Pos Z', -25.0, 5.0, 0.1],
            ['link1Scale', 'Scale', 0.4, 5.0, 0.01],
            ['link1GlowScale', 'Glow Scale', 0.5, 10.0, 0.01],
            ['link1HitRadius', 'Hit Radius', 0.4, 6.0, 0.01],
            ['link1Phase', 'Phase', 0.0, 6.3, 0.01],
            ['link1ColorAR', 'Color A R', 0.0, 1.0, 0.01],
            ['link1ColorAG', 'Color A G', 0.0, 1.0, 0.01],
            ['link1ColorAB', 'Color A B', 0.0, 1.0, 0.01],
            ['link1ColorBR', 'Color B R', 0.0, 1.0, 0.01],
            ['link1ColorBG', 'Color B G', 0.0, 1.0, 0.01],
            ['link1ColorBB', 'Color B B', 0.0, 1.0, 0.01],
        ],
    },
    {
        id: 'creationLink2',
        title: 'Creation Link 2',
        type: 'range',
        target: creationLinkParams,
        fields: [
            ['link2PosX', 'Pos X', -20.0, 20.0, 0.1],
            ['link2PosY', 'Pos Y', -20.0, 20.0, 0.1],
            ['link2PosZ', 'Pos Z', -25.0, 5.0, 0.1],
            ['link2Scale', 'Scale', 0.4, 5.0, 0.01],
            ['link2GlowScale', 'Glow Scale', 0.5, 10.0, 0.01],
            ['link2HitRadius', 'Hit Radius', 0.4, 6.0, 0.01],
            ['link2Phase', 'Phase', 0.0, 6.3, 0.01],
            ['link2ColorAR', 'Color A R', 0.0, 1.0, 0.01],
            ['link2ColorAG', 'Color A G', 0.0, 1.0, 0.01],
            ['link2ColorAB', 'Color A B', 0.0, 1.0, 0.01],
            ['link2ColorBR', 'Color B R', 0.0, 1.0, 0.01],
            ['link2ColorBG', 'Color B G', 0.0, 1.0, 0.01],
            ['link2ColorBB', 'Color B B', 0.0, 1.0, 0.01],
        ],
    },
    {
        id: 'creationLink3',
        title: 'Creation Link 3',
        type: 'range',
        target: creationLinkParams,
        fields: [
            ['link3PosX', 'Pos X', -20.0, 20.0, 0.1],
            ['link3PosY', 'Pos Y', -20.0, 20.0, 0.1],
            ['link3PosZ', 'Pos Z', -25.0, 5.0, 0.1],
            ['link3Scale', 'Scale', 0.4, 5.0, 0.01],
            ['link3GlowScale', 'Glow Scale', 0.5, 10.0, 0.01],
            ['link3HitRadius', 'Hit Radius', 0.4, 6.0, 0.01],
            ['link3Phase', 'Phase', 0.0, 6.3, 0.01],
            ['link3ColorAR', 'Color A R', 0.0, 1.0, 0.01],
            ['link3ColorAG', 'Color A G', 0.0, 1.0, 0.01],
            ['link3ColorAB', 'Color A B', 0.0, 1.0, 0.01],
            ['link3ColorBR', 'Color B R', 0.0, 1.0, 0.01],
            ['link3ColorBG', 'Color B G', 0.0, 1.0, 0.01],
            ['link3ColorBB', 'Color B B', 0.0, 1.0, 0.01],
        ],
    },
    {
        id: 'background',
        title: 'Background',
        type: 'range',
        target: backgroundParams,
        fields: [
            ['centerR', 'Center R', 0.0, 1.0, 0.001],
            ['centerG', 'Center G', 0.0, 1.0, 0.001],
            ['centerB', 'Center B', 0.0, 1.0, 0.001],
            ['edgeR', 'Edge R', 0.0, 1.0, 0.001],
            ['edgeG', 'Edge G', 0.0, 1.0, 0.001],
            ['edgeB', 'Edge B', 0.0, 1.0, 0.001],
            ['pulse', 'Pulse', 0.0, 1.0, 0.005],
            ['opacity', 'Opacity', 0.0, 1.0, 0.005],
        ],
    },
    {
        id: 'fluid',
        title: 'Fluid',
        type: 'range',
        target: fluidParams,
        fields: [
            ['influence', 'Influence', 0.0, 0.3, 0.001],
            ['force', 'Force', 0.0, 5.0, 0.01],
            ['curl', 'Curl', 0.0, 5.0, 0.01],
            ['decay', 'Decay', 0.8, 1.0, 0.001],
            ['radius', 'Radius', 0.01, 0.6, 0.001],
        ],
    },
    {
        id: 'liquid',
        title: 'Liquid',
        type: 'range',
        target: liquidParams,
        fields: [
            ['densityMul', 'Density Mul', 0.0, 4.0, 0.01],
            ['refractOffsetScale', 'Refract Offset', 0.0, 0.2, 0.001],
            ['refractThreshold', 'Refract Threshold', 0.0, 0.05, 0.0005],
            ['forceRadius', 'Force Radius', 0.01, 0.3, 0.001],
            ['forceStrength', 'Force Strength', 0.0, 12.0, 0.01],
            ['noiseScale', 'Noise Scale', 0.1, 20.0, 0.1],
            ['noiseSpeed', 'Noise Speed', 0.0, 0.2, 0.001],
            ['specularPow', 'Specular Pow', 0.1, 20.0, 0.1],
            ['specularInt', 'Specular Int', 0.0, 4.0, 0.01],
        ],
    },
    {
        id: 'quantum',
        title: 'Quantum Wave',
        type: 'range',
        target: quantumWaveParams,
        fields: [
            ['strength', 'Strength', 0.0, 0.2, 0.001],
            ['speed', 'Speed', 0.0, 1.0, 0.001],
            ['baseFreq', 'Base Freq', 0.2, 8.0, 0.01],
            ['dispersion', 'Dispersion', 0.0, 0.5, 0.001],
            ['noiseAmp', 'Noise Amp', 0.0, 1.0, 0.001],
            ['noiseScale', 'Noise Scale', 0.2, 8.0, 0.01],
            ['waveCount', 'Wave Count', 1.0, 8.0, 1.0],
            ['envelope', 'Envelope', 0.1, 2.0, 0.01],
            ['yInfluence', 'Y Influence', 0.0, 2.0, 0.01],
            ['glowAmount', 'Glow Amount', 0.0, 1.0, 0.01],
            ['caberration', 'Chromatic Aberr', 0.0, 0.02, 0.0005],
            ['rimBright', 'Rim Bright', 0.0, 1.0, 0.01],
            ['blurAmount', 'Blur Amount', 0.0, 0.1, 0.0005],
            ['fogDensity', 'Fog Density', 0.0, 0.3, 0.001],
            ['darken', 'Darken', 0.0, 1.0, 0.01],
            ['turbulence', 'Turbulence', 0.0, 1.0, 0.01],
            ['sharpness', 'Sharpness', 0.0, 1.0, 0.01],
        ],
    },
    {
        id: 'post',
        title: 'Post',
        type: 'range',
        target: distortionParams,
        fields: [
            ['dofStrength', 'DOF Strength', 0.0, 0.05, 0.0005],
            ['dofFocusRadius', 'DOF Focus', 0.05, 0.8, 0.005],
            ['heatHaze', 'Heat Haze', 0.0, 0.08, 0.0005],
            ['heatHazeRadius', 'Heat Radius', 0.05, 1.0, 0.005],
            ['heatHazeSpeed', 'Heat Speed', 0.05, 3.0, 0.01],
        ],
    },
    {
        id: 'breath',
        title: 'Breath',
        type: 'range',
        target: breathConfig,
        fields: [
            ['period', 'Period', 1.0, 20.0, 0.1],
            ['fovAmplitude', 'FOV Amplitude', 0.0, 6.0, 0.05],
            ['htmlMinOpacity', 'HTML Min Opacity', 0.0, 1.0, 0.01],
            ['htmlMaxOpacity', 'HTML Max Opacity', 0.0, 1.0, 0.01],
            ['htmlMaxBlur', 'HTML Max Blur', 0.0, 8.0, 0.05],
            ['htmlMinScale', 'HTML Min Scale', 0.5, 1.0, 0.005],
        ],
    },
];

function cloneState() {
    return {
        toggles: { ...toggles },
        sceneParams: { ...sceneParams },
        fieldParams: { ...fieldParams },
        flowParams: { ...flowParams },
        backgroundParams: { ...backgroundParams },
        fluidParams: { ...fluidParams },
        liquidParams: { ...liquidParams },
        creationLinkParams: { ...creationLinkParams },
        quantumWaveParams: { ...quantumWaveParams },
        distortionParams: { ...distortionParams },
        breathConfig: { ...breathConfig },
    };
}

function applyPartial(target, source) {
    if (!source || typeof source !== 'object') return;
    Object.keys(source).forEach((key) => {
        if (!(key in target)) return;
        const cur = target[key];
        const incoming = source[key];

        if (typeof cur === 'boolean') {
            target[key] = Boolean(incoming);
            return;
        }

        if (typeof cur === 'number') {
            const next = Number(incoming);
            if (Number.isFinite(next)) target[key] = next;
        }
    });
}

function formatNumber(value, step) {
    const decimals = String(step).includes('.')
        ? String(step).split('.')[1].length
        : 0;
    return Number(value).toFixed(Math.min(decimals, 4));
}

export function initDevPanel({
    onStateChanged = null,
    panelStartsOpen = false,
} = {}) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'dev-panel-toggle';
    toggleBtn.className = 'btn btn-sm btn-outline-info';
    toggleBtn.type = 'button';
    toggleBtn.textContent = 'DEV';

    const panel = document.createElement('aside');
    panel.id = 'dev-panel';
    panel.innerHTML = `
        <div class="dev-panel-header">
            <h2 class="dev-panel-title">Dev Panel</h2>
            <button type="button" class="btn btn-sm btn-outline-light" id="dev-panel-close">Close</button>
        </div>
        <div class="dev-panel-body">
            <div class="accordion" id="dev-panel-accordion"></div>
            <div class="mt-3">
                <label class="form-label" for="dev-json">Config JSON</label>
                <textarea id="dev-json" class="form-control form-control-sm" rows="8"></textarea>
                <div class="dev-json-actions mt-2">
                    <button type="button" class="btn btn-sm btn-outline-light" id="dev-json-copy">Copy JSON</button>
                    <button type="button" class="btn btn-sm btn-outline-light" id="dev-json-paste">Paste JSON</button>
                    <button type="button" class="btn btn-sm btn-primary" id="dev-json-apply">Apply JSON</button>
                </div>
                <div class="dev-json-status" id="dev-json-status"></div>
            </div>
        </div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    if (panelStartsOpen) panel.classList.add('is-open');

    const accordion = panel.querySelector('#dev-panel-accordion');
    const jsonArea = panel.querySelector('#dev-json');
    const jsonStatus = panel.querySelector('#dev-json-status');

    const controlIndex = new Map();

    function notifyStateChanged() {
        if (typeof onStateChanged === 'function') {
            onStateChanged();
        }
    }

    function refreshJson() {
        jsonArea.value = JSON.stringify(cloneState(), null, 2);
    }

    function setStatus(message, isError = false) {
        jsonStatus.textContent = message;
        jsonStatus.style.color = isError ? 'rgba(255, 138, 138, 0.95)' : 'rgba(201, 221, 255, 0.8)';
    }

    function updateControlValue(path, value, step) {
        const entry = controlIndex.get(path);
        if (!entry) return;
        entry.input.value = String(value);
        entry.valueNode.textContent = formatNumber(value, step);
    }

    function registerControl(path, input, valueNode, step) {
        controlIndex.set(path, { input, valueNode, step });
    }

    function buildToggleControl(group, field) {
        const [key, label] = field;
        const path = `${group.id}.${key}`;
        const wrapper = document.createElement('div');
        wrapper.className = 'form-check form-switch dev-row';

        const input = document.createElement('input');
        input.className = 'form-check-input';
        input.type = 'checkbox';
        input.id = `dev-${path}`;
        input.checked = Boolean(group.target[key]);

        const labelEl = document.createElement('label');
        labelEl.className = 'form-check-label';
        labelEl.setAttribute('for', input.id);
        labelEl.textContent = label;

        input.addEventListener('change', () => {
            group.target[key] = input.checked;
            notifyStateChanged();
            refreshJson();
        });

        wrapper.appendChild(input);
        wrapper.appendChild(labelEl);
        return wrapper;
    }

    function buildRangeControl(group, field) {
        const [key, label, min, max, step] = field;
        const path = `${group.id}.${key}`;

        const wrapper = document.createElement('div');
        wrapper.className = 'dev-row';

        const meta = document.createElement('div');
        meta.className = 'dev-row-meta';

        const labelEl = document.createElement('label');
        labelEl.className = 'form-label';
        labelEl.setAttribute('for', `dev-${path}`);
        labelEl.textContent = label;

        const valueEl = document.createElement('span');
        valueEl.className = 'dev-value';
        valueEl.textContent = formatNumber(group.target[key], step);

        meta.appendChild(labelEl);
        meta.appendChild(valueEl);

        const input = document.createElement('input');
        input.className = 'form-range';
        input.type = 'range';
        input.id = `dev-${path}`;
        input.min = String(min);
        input.max = String(max);
        input.step = String(step);
        input.value = String(group.target[key]);

        input.addEventListener('input', () => {
            const val = Number(input.value);
            group.target[key] = val;
            valueEl.textContent = formatNumber(val, step);
            notifyStateChanged();
        });

        input.addEventListener('change', refreshJson);

        registerControl(path, input, valueEl, step);

        wrapper.appendChild(meta);
        wrapper.appendChild(input);
        return wrapper;
    }

    PARAM_GROUPS.forEach((group, idx) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';

        const headerId = `dev-head-${group.id}`;
        const collapseId = `dev-collapse-${group.id}`;

        item.innerHTML = `
            <h2 class="accordion-header" id="${headerId}">
                <button class="accordion-button ${idx === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${idx === 0 ? 'true' : 'false'}" aria-controls="${collapseId}">
                    ${group.title}
                </button>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}" aria-labelledby="${headerId}" data-bs-parent="#dev-panel-accordion">
                <div class="accordion-body"></div>
            </div>
        `;

        const body = item.querySelector('.accordion-body');
        group.fields.forEach((field) => {
            const node = group.type === 'toggle'
                ? buildToggleControl(group, field)
                : buildRangeControl(group, field);
            body.appendChild(node);
        });

        accordion.appendChild(item);
    });

    function syncUIFromState() {
        PARAM_GROUPS.forEach((group) => {
            group.fields.forEach((field) => {
                const key = field[0];
                const path = `${group.id}.${key}`;

                if (group.type === 'toggle') {
                    const input = panel.querySelector(`#dev-${path}`);
                    if (input) input.checked = Boolean(group.target[key]);
                    return;
                }

                updateControlValue(path, group.target[key], field[4]);
            });
        });
    }

    async function copyJson() {
        refreshJson();
        try {
            await navigator.clipboard.writeText(jsonArea.value);
            setStatus('Copied JSON to clipboard.');
        } catch (error) {
            setStatus('Copy failed. Manual copy from textarea.', true);
        }
    }

    async function pasteJson() {
        try {
            const text = await navigator.clipboard.readText();
            jsonArea.value = text;
            applyJson();
        } catch (error) {
            setStatus('Paste failed. Paste text manually.', true);
        }
    }

    function applyJson() {
        try {
            const payload = JSON.parse(jsonArea.value);
            if (!payload || typeof payload !== 'object') {
                throw new Error('Invalid JSON object.');
            }

            applyPartial(toggles, payload.toggles);
            applyPartial(sceneParams, payload.sceneParams);
            applyPartial(fieldParams, payload.fieldParams);
            applyPartial(flowParams, payload.flowParams);
            applyPartial(backgroundParams, payload.backgroundParams);
            applyPartial(fluidParams, payload.fluidParams);
            applyPartial(liquidParams, payload.liquidParams);
            applyPartial(creationLinkParams, payload.creationLinkParams);
            applyPartial(quantumWaveParams, payload.quantumWaveParams);
            applyPartial(distortionParams, payload.distortionParams);
            applyPartial(breathConfig, payload.breathConfig);

            notifyStateChanged();
            syncUIFromState();
            refreshJson();
            setStatus('Applied JSON to current state.');
        } catch (error) {
            setStatus(`JSON apply failed: ${error.message}`, true);
        }
    }

    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('is-open');
    });

    panel.querySelector('#dev-panel-close').addEventListener('click', () => {
        panel.classList.remove('is-open');
    });

    panel.querySelector('#dev-json-copy').addEventListener('click', copyJson);
    panel.querySelector('#dev-json-paste').addEventListener('click', pasteJson);
    panel.querySelector('#dev-json-apply').addEventListener('click', applyJson);

    refreshJson();

    return {
        open() {
            panel.classList.add('is-open');
        },
        close() {
            panel.classList.remove('is-open');
        },
        destroy() {
            toggleBtn.remove();
            panel.remove();
        },
    };
}
