import {
    backgroundParams,
    breathConfig,
    creationLinkParams,
    distortionParams,
    fieldParams,
    flowParams,
    intentConsciousnessParams,
    intentMotionParams,
    fluidParams,
    liquidParams,
    plasmaParams,
    quantumWaveParams,
    sceneParams,
    textStyleParams,
    toggles,
} from './config.js';

const GROUP_TARGETS = {
    toggles,
    sceneParams,
    fieldParams,
    flowParams,
    plasmaParams,
    backgroundParams,
    fluidParams,
    liquidParams,
    creationLinkParams,
    quantumWaveParams,
    distortionParams,
    breathConfig,
    intentMotionParams,
    intentConsciousnessParams,
    textStyleParams,
};

function cloneGroupState(target) {
    const output = {};
    Object.entries(target).forEach(([key, value]) => {
        if (value && typeof value.getHex === 'function') {
            output[key] = value.getHex();
            return;
        }
        output[key] = value;
    });
    return output;
}

function clamp01(value) {
    return Math.min(1, Math.max(0, value));
}

function parseColorHex(incoming) {
    if (typeof incoming === 'number' && Number.isFinite(incoming)) {
        return Math.max(0, Math.min(0xffffff, Math.round(incoming)));
    }

    if (typeof incoming === 'string') {
        const raw = incoming.trim();
        const normalized = raw.startsWith('#') ? raw.slice(1) : raw;
        if (/^[0-9a-fA-F]{6}$/.test(normalized)) {
            return parseInt(normalized, 16);
        }
    }

    if (incoming && typeof incoming === 'object') {
        const r = Number(incoming.r);
        const g = Number(incoming.g);
        const b = Number(incoming.b);
        if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) {
            const rr = Math.round(clamp01(r) * 255);
            const gg = Math.round(clamp01(g) * 255);
            const bb = Math.round(clamp01(b) * 255);
            return (rr << 16) | (gg << 8) | bb;
        }
    }

    return null;
}

function applyPartial(target, source) {
    if (!source || typeof source !== 'object') return;
    Object.keys(source).forEach((key) => {
        if (!(key in target)) return;
        const current = target[key];
        const incoming = source[key];

        if (current && typeof current.setHex === 'function') {
            const nextHex = parseColorHex(incoming);
            if (nextHex !== null) current.setHex(nextHex);
            return;
        }

        if (typeof current === 'boolean') {
            target[key] = Boolean(incoming);
            return;
        }

        if (typeof current === 'number') {
            const next = Number(incoming);
            if (Number.isFinite(next)) target[key] = next;
        }
    });
}

export function cloneConfigState() {
    const state = {};
    Object.entries(GROUP_TARGETS).forEach(([groupName, target]) => {
        state[groupName] = cloneGroupState(target);
    });
    return state;
}

export function applyConfigState(state) {
    if (!state || typeof state !== 'object') return;
    Object.entries(GROUP_TARGETS).forEach(([groupName, target]) => {
        applyPartial(target, state[groupName]);
    });
}
