import * as THREE from 'three';
import {
    backgroundParams,
    creationLinkParams,
    fieldParams,
    flowParams,
    sceneParams,
    toggles,
    FOG_V002_COLOR,
    FOG_V002_DENSITY,
    FOG_V004_COLOR,
    FOG_V004_DENSITY,
} from './config.js';
import { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR, CAMERA_LOOK_AT_Z } from './constants.js';
import { lerp } from './animation-utils.js';
import { createBackgroundMaterial, createBackgroundMesh } from './shaders/background.js';

export { sceneParams } from './config.js';

let _scene;
let _camera;
let _bgMaterial;
let _bgMesh;
let _fieldMaterial;
let _fieldMesh;
let _flowGroup;
let _flowMaterials = [];
let _seedSystem;
let _filamentSystem;
let _lastFlowTime = 0;
let _starFieldGroup;
let _starMaterials = [];
let _creationLinkGroup;
let _creationLinkTargets = [];

const _fogColor = new THREE.Color();
const _bgCenterA = new THREE.Color();
const _bgCenterB = new THREE.Color();
const _bgEdgeA = new THREE.Color();
const _bgEdgeB = new THREE.Color();

const FLOW_X_MIN = -46.0;
const FLOW_X_MAX = 46.0;
const FLOW_FULL_HALF_Y = 20.0;
const FLOW_FULL_HALF_Z = 11.5;
const FLOW_LEFT_END = 0.42;
const FLOW_CENTER_END = 0.64;
const CREATION_LINK_DEFS = [
    {
        id: 1,
        label: 'Creation Notes I',
        draftUrl: 'https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/pdf/kesson-general-draft.md',
        sourceUrl: 'https://uminomae.github.io/pjdhiro/assets/pdf/kesson-general.pdf',
        shape: 'crystal',
        pointCount: 1800,
    },
    {
        id: 2,
        label: 'Creation Notes II',
        draftUrl: 'https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/pdf/kesson-designer-draft.md',
        sourceUrl: 'https://uminomae.github.io/pjdhiro/assets/pdf/kesson-designer.pdf',
        shape: 'ring',
        pointCount: 2100,
    },
    {
        id: 3,
        label: 'Creation Notes III',
        draftUrl: 'https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/pdf/kesson-academic-draft.md',
        sourceUrl: 'https://uminomae.github.io/pjdhiro/assets/pdf/kesson-academic.pdf',
        shape: 'frame',
        pointCount: 1700,
    },
];

function clamp01(v) {
    return Math.min(1, Math.max(0, v));
}

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function randRange(min, max) {
    return min + Math.random() * (max - min);
}

function calcCamZ(aspect) {
    if (aspect >= 1) return sceneParams.camZ;
    const t = Math.max(0, (aspect - 0.5) * 2.0);
    return sceneParams.camZ * t;
}

function getCreationLinkParam(id) {
    const key = `link${id}`;
    return {
        posX: creationLinkParams[`${key}PosX`],
        posY: creationLinkParams[`${key}PosY`],
        posZ: creationLinkParams[`${key}PosZ`],
        scale: creationLinkParams[`${key}Scale`],
        glowScale: creationLinkParams[`${key}GlowScale`],
        hitRadius: creationLinkParams[`${key}HitRadius`],
        phase: creationLinkParams[`${key}Phase`],
        colorAR: clamp(creationLinkParams[`${key}ColorAR`], 0.0, 1.0),
        colorAG: clamp(creationLinkParams[`${key}ColorAG`], 0.0, 1.0),
        colorAB: clamp(creationLinkParams[`${key}ColorAB`], 0.0, 1.0),
        colorBR: clamp(creationLinkParams[`${key}ColorBR`], 0.0, 1.0),
        colorBG: clamp(creationLinkParams[`${key}ColorBG`], 0.0, 1.0),
        colorBB: clamp(creationLinkParams[`${key}ColorBB`], 0.0, 1.0),
    };
}

function createFieldMesh() {
    _fieldMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uAspect: { value: window.innerWidth / window.innerHeight },
            uIntensity: { value: fieldParams.intensity },
            uAlpha: { value: fieldParams.alpha },
            uLineLow: { value: fieldParams.lineLow },
            uLineHigh: { value: fieldParams.lineHigh },
            uBottomClip: { value: fieldParams.bottomClip },
            uBottomFeather: { value: fieldParams.bottomFeather },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform float uAspect;
            uniform float uIntensity;
            uniform float uAlpha;
            uniform float uLineLow;
            uniform float uLineHigh;
            uniform float uBottomClip;
            uniform float uBottomFeather;
            uniform vec2 uResolution;
            varying vec2 vUv;

            void main() {
                vec2 p = (vUv - 0.5) * 2.0;
                p.x *= uAspect;

                float t = uTime * 0.22;
                float waves = 0.0;
                for (int i = 0; i < 6; i++) {
                    float fi = float(i);
                    float a = fi * 0.62 + sin(t * 0.3 + fi * 1.7) * 0.18;
                    vec2 k = vec2(cos(a), sin(a));
                    float w = 2.0 + fi * 0.35;
                    float omega = 0.1 * w * w;
                    waves += sin(dot(p, k) * w - omega * t + fi * 1.618) / (1.0 + fi * 0.35);
                }

                float r = length(p);
                float envelope = exp(-r * r * 0.85);
                float band = abs(waves) * 0.42;
                float lineLow = min(uLineLow, uLineHigh - 0.01);
                float lineHigh = max(uLineHigh, lineLow + 0.01);
                float filaments = smoothstep(lineLow, lineHigh, band);

                vec3 colorA = vec3(0.11, 0.22, 0.42);
                vec3 colorB = vec3(0.52, 0.74, 1.0);
                vec3 color = mix(colorA, colorB, filaments) * envelope * uIntensity;

                float screenY = gl_FragCoord.y / max(uResolution.y, 1.0);
                float bottomMask = smoothstep(uBottomClip, uBottomClip + uBottomFeather, screenY);
                color *= bottomMask;

                float alpha = filaments * envelope * uAlpha * bottomMask;
                if (alpha < 0.001) discard;
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(120, 120, 1, 1), _fieldMaterial);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, -14, 0);
    return mesh;
}

function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
}

function createFlowPointMaterial({ colorA, colorB }) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uOpacity: { value: 1.0 },
            uColorA: { value: colorA.clone() },
            uColorB: { value: colorB.clone() },
        },
        vertexShader: `
            attribute float aSize;
            attribute float aPhase;
            attribute float aTemp;
            varying float vTwinkle;
            varying float vTemp;

            uniform float uTime;

            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                float flicker = 0.72 + 0.28 * sin(uTime * 1.1 + aPhase * 6.2831853);
                vTwinkle = flicker;
                vTemp = aTemp;
                gl_PointSize = aSize * (250.0 / max(-mvPosition.z, 0.001));
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform float uOpacity;
            uniform vec3 uColorA;
            uniform vec3 uColorB;
            varying float vTwinkle;
            varying float vTemp;

            void main() {
                vec2 uv = gl_PointCoord * 2.0 - 1.0;
                float r = length(uv);
                if (r > 1.0) discard;

                float core = smoothstep(0.48, 0.0, r);
                float halo = smoothstep(1.0, 0.0, r) * 0.44;
                float lum = (core * 1.05 + halo) * vTwinkle;
                vec3 c = mix(uColorA, uColorB, vTemp) * lum;
                float a = clamp(lum * uOpacity, 0.0, 1.0);
                gl_FragColor = vec4(c, a);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    _flowMaterials.push(material);
    return material;
}

function resetSeedParticle(system, i) {
    const p3 = i * 3;
    system.positions[p3 + 0] = randRange(FLOW_X_MIN * 1.03, -10.0);
    system.positions[p3 + 1] = randRange(-FLOW_FULL_HALF_Y, FLOW_FULL_HALF_Y);
    system.positions[p3 + 2] = randRange(-FLOW_FULL_HALF_Z, FLOW_FULL_HALF_Z);

    system.velocities[p3 + 0] = randRange(-0.02, 0.04);
    system.velocities[p3 + 1] = randRange(-0.02, 0.02);
    system.velocities[p3 + 2] = randRange(-0.01, 0.01);
    system.lanes[i] = randRange(-FLOW_FULL_HALF_Y, FLOW_FULL_HALF_Y);
}

function createFlowObjects() {
    _flowMaterials = [];
    const group = new THREE.Group();

    const seedCount = 420;
    const seedPositions = new Float32Array(seedCount * 3);
    const seedVelocities = new Float32Array(seedCount * 3);
    const seedSizes = new Float32Array(seedCount);
    const seedPhases = new Float32Array(seedCount);
    const seedTemps = new Float32Array(seedCount);
    const seedLanes = new Float32Array(seedCount);

    for (let i = 0; i < seedCount; i++) {
        seedSizes[i] = randRange(1.4, 3.2);
        seedPhases[i] = Math.random();
        seedTemps[i] = Math.pow(Math.random(), 0.8);
    }

    const seedGeometry = new THREE.BufferGeometry();
    seedGeometry.setAttribute('position', new THREE.BufferAttribute(seedPositions, 3));
    seedGeometry.setAttribute('aSize', new THREE.BufferAttribute(seedSizes, 1));
    seedGeometry.setAttribute('aPhase', new THREE.BufferAttribute(seedPhases, 1));
    seedGeometry.setAttribute('aTemp', new THREE.BufferAttribute(seedTemps, 1));

    const seedMaterial = createFlowPointMaterial({
        colorA: new THREE.Color(0.42, 0.66, 0.95),
        colorB: new THREE.Color(0.86, 0.94, 1.0),
    });
    seedMaterial.userData.kind = 'seed';

    const seedPoints = new THREE.Points(seedGeometry, seedMaterial);
    group.add(seedPoints);

    _seedSystem = {
        points: seedPoints,
        positions: seedPositions,
        velocities: seedVelocities,
        lanes: seedLanes,
        count: seedCount,
    };

    for (let i = 0; i < seedCount; i++) {
        resetSeedParticle(_seedSystem, i);
    }
    seedGeometry.attributes.position.needsUpdate = true;

    const filamentCount = 620;
    const filamentPositions = new Float32Array(filamentCount * 3);
    const filamentSizes = new Float32Array(filamentCount);
    const filamentPhases = new Float32Array(filamentCount);
    const filamentTemps = new Float32Array(filamentCount);
    const filamentLanes = new Float32Array(filamentCount);
    const filamentSpeeds = new Float32Array(filamentCount);
    const filamentWobbles = new Float32Array(filamentCount);
    const laneCount = 23;

    for (let i = 0; i < filamentCount; i++) {
        filamentSizes[i] = randRange(1.7, 3.9);
        filamentPhases[i] = Math.random();
        filamentTemps[i] = Math.random();
        filamentLanes[i] = Math.floor(Math.random() * laneCount);
        filamentSpeeds[i] = randRange(0.09, 0.17);
        filamentWobbles[i] = randRange(0.75, 1.25);
    }

    const filamentGeometry = new THREE.BufferGeometry();
    filamentGeometry.setAttribute('position', new THREE.BufferAttribute(filamentPositions, 3));
    filamentGeometry.setAttribute('aSize', new THREE.BufferAttribute(filamentSizes, 1));
    filamentGeometry.setAttribute('aPhase', new THREE.BufferAttribute(filamentPhases, 1));
    filamentGeometry.setAttribute('aTemp', new THREE.BufferAttribute(filamentTemps, 1));

    const filamentMaterial = createFlowPointMaterial({
        colorA: new THREE.Color(0.45, 0.78, 1.0),
        colorB: new THREE.Color(0.88, 0.98, 1.0),
    });
    filamentMaterial.userData.kind = 'filament';

    const filamentPoints = new THREE.Points(filamentGeometry, filamentMaterial);
    group.add(filamentPoints);

    _filamentSystem = {
        points: filamentPoints,
        positions: filamentPositions,
        lanes: filamentLanes,
        phases: filamentPhases,
        speeds: filamentSpeeds,
        wobbles: filamentWobbles,
        laneCount,
        count: filamentCount,
    };

    return group;
}

function updateSeedParticles(time, dtScale) {
    if (!_seedSystem) return;

    const centerBandRatio = clamp(flowParams.centerBandRatio, 0.2, 0.8);
    const centerBandHalf = FLOW_FULL_HALF_Y * centerBandRatio;
    const chaos = flowParams.chaos;
    const drift = flowParams.seedDrift;
    const tight = flowParams.bundleTightness;

    for (let i = 0; i < _seedSystem.count; i++) {
        const p3 = i * 3;
        let x = _seedSystem.positions[p3 + 0];
        let y = _seedSystem.positions[p3 + 1];
        let z = _seedSystem.positions[p3 + 2];
        let vx = _seedSystem.velocities[p3 + 0];
        let vy = _seedSystem.velocities[p3 + 1];
        let vz = _seedSystem.velocities[p3 + 2];

        const progress = clamp01((x - FLOW_X_MIN) / (FLOW_X_MAX - FLOW_X_MIN));

        // Left: full-height random field converging toward center.
        if (progress < FLOW_LEFT_END) {
            const t = progress / FLOW_LEFT_END;
            vx += (0.112 * drift - vx) * 0.052 * dtScale;
            vy += (-y) * lerp(0.008, 0.026, t) * dtScale;
            vy += randRange(-0.003, 0.003) * dtScale * chaos;
            vz += (-z) * 0.01 * dtScale + randRange(-0.002, 0.002) * dtScale;
        // Middle: keep chaos but confine to center band.
        } else if (progress < FLOW_CENTER_END) {
            const centerX = 0.0;
            const centerY = 0.0;
            const dx = x - centerX;
            const dy = y - centerY;
            const inv = 1.0 / (dx * dx + dy * dy + 2.6);
            const swirlX = -dy * inv * 0.12 * chaos;
            const swirlY = dx * inv * 0.12 * chaos;
            const toCenterX = (centerX - x) * 0.006 * chaos;
            const overflow = Math.max(0.0, Math.abs(y) - centerBandHalf);
            const bandSpring = -Math.sign(y || 1) * overflow * 0.045;

            vx += (swirlX + toCenterX + randRange(-0.0025, 0.0025)) * dtScale;
            vy += (swirlY + bandSpring + randRange(-0.003, 0.003)) * dtScale;
            vz += (-z * 0.014 + randRange(-0.002, 0.002)) * dtScale;
        // Right: from center-band density to full-height spread.
        } else {
            const spread = smoothstep(FLOW_CENTER_END, 1.0, progress);
            const targetY = _seedSystem.lanes[i] * lerp(centerBandRatio, 1.0, spread);
            const targetZ = Math.sin(time * 1.0 + i * 0.13) * FLOW_FULL_HALF_Z * (0.08 + spread * 0.22);
            vx += (0.13 * drift - vx) * 0.065 * dtScale;
            vy += (targetY - y) * 0.022 * dtScale * tight;
            vz += (targetZ - z) * 0.019 * dtScale;
        }

        const damping = Math.pow(0.986, dtScale);
        vx *= damping;
        vy *= damping;
        vz *= damping;

        x += vx * dtScale;
        y += vy * dtScale;
        z += vz * dtScale;

        if (
            x > FLOW_X_MAX * 1.06 ||
            Math.abs(y) > FLOW_FULL_HALF_Y * 1.28 ||
            Math.abs(z) > FLOW_FULL_HALF_Z * 1.35
        ) {
            resetSeedParticle(_seedSystem, i);
            continue;
        }

        _seedSystem.positions[p3 + 0] = x;
        _seedSystem.positions[p3 + 1] = y;
        _seedSystem.positions[p3 + 2] = z;
        _seedSystem.velocities[p3 + 0] = vx;
        _seedSystem.velocities[p3 + 1] = vy;
        _seedSystem.velocities[p3 + 2] = vz;
    }

    _seedSystem.points.geometry.attributes.position.needsUpdate = true;
}

function updateFilamentParticles(time) {
    if (!_filamentSystem) return;

    const centerBandRatio = clamp(flowParams.centerBandRatio, 0.2, 0.8);
    const centerLane = (_filamentSystem.laneCount - 1) * 0.5;
    const tight = flowParams.bundleTightness;

    for (let i = 0; i < _filamentSystem.count; i++) {
        const p3 = i * 3;
        const lane = _filamentSystem.lanes[i];
        const phase = _filamentSystem.phases[i];
        const speed = _filamentSystem.speeds[i];
        const wobble = _filamentSystem.wobbles[i];
        const t = (phase + time * speed) % 1.0;

        const laneNorm = (lane - centerLane) / Math.max(centerLane, 1.0);
        const fullY = laneNorm * FLOW_FULL_HALF_Y;
        const fullZ = Math.sin(laneNorm * 2.4 + i * 0.01) * FLOW_FULL_HALF_Z * 0.32;
        let x = lerp(FLOW_X_MIN, FLOW_X_MAX, t);

        // Left->Center: compress to center band, then keep dense, then spread to full on right.
        const leftToCenter = smoothstep(0.0, FLOW_LEFT_END, t);
        const rightSpread = smoothstep(FLOW_CENTER_END, 1.0, t);
        let bandScale = lerp(1.0, centerBandRatio, leftToCenter);
        bandScale = lerp(bandScale, 1.0, rightSpread);

        const jitterScale = lerp(1.0, centerBandRatio, leftToCenter);
        const twist = Math.sin(t * 11.0 - time * 2.2 + lane * 0.75) * 0.55 * wobble * jitterScale;
        const ripple = Math.sin(t * 20.0 + time * 1.6 + i * 0.02) * 0.14 * jitterScale;
        const spreadNoise = Math.sin(time * 1.25 + i * 0.09) * FLOW_FULL_HALF_Y * 0.05 * rightSpread * (1.0 - tight * 0.4);

        let y = fullY * bandScale + twist + ripple + spreadNoise;
        let z = fullZ * bandScale + Math.cos(t * 12.0 - time * 1.8 + lane * 0.42) * 0.65 * wobble * jitterScale;

        _filamentSystem.positions[p3 + 0] = x;
        _filamentSystem.positions[p3 + 1] = y;
        _filamentSystem.positions[p3 + 2] = z;
    }

    _filamentSystem.points.geometry.attributes.position.needsUpdate = true;
}

function updateFlowObjects(time) {
    if (!_flowGroup) return;

    const dt = _lastFlowTime > 0 ? Math.min(0.05, Math.max(0.001, time - _lastFlowTime)) : 0.016;
    _lastFlowTime = time;
    const dtScale = dt * 60.0;

    updateSeedParticles(time, dtScale);
    updateFilamentParticles(time);

    _flowMaterials.forEach((mat) => {
        mat.uniforms.uTime.value = time;
        if (mat.userData.kind === 'seed') {
            mat.uniforms.uOpacity.value = flowParams.seedOpacity;
        } else {
            mat.uniforms.uOpacity.value = flowParams.filamentOpacity;
        }
    });
}

function createStarMaterial() {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uOpacity: { value: 1.0 },
        },
        vertexShader: `
            attribute float aSize;
            attribute float aPhase;
            attribute float aTemp;
            varying float vTwinkle;
            varying float vTemp;

            uniform float uTime;

            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

                float twinkle = 0.62 + 0.38 * sin(uTime * 0.8 + aPhase * 6.2831853);
                vTwinkle = twinkle;
                vTemp = aTemp;

                float pointSize = aSize * (0.85 + 0.75 * twinkle);
                gl_PointSize = pointSize * (320.0 / max(-mvPosition.z, 0.001));
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vTwinkle;
            varying float vTemp;
            uniform float uOpacity;

            void main() {
                vec2 uv = gl_PointCoord * 2.0 - 1.0;
                float r = length(uv);
                if (r > 1.0) discard;

                float core = smoothstep(0.38, 0.0, r);
                float halo = smoothstep(1.0, 0.0, r) * 0.42;
                float spikeX = smoothstep(0.08, 0.0, abs(uv.x)) * smoothstep(0.92, 0.0, abs(uv.y));
                float spikeY = smoothstep(0.08, 0.0, abs(uv.y)) * smoothstep(0.92, 0.0, abs(uv.x));
                float spikes = (spikeX + spikeY) * 0.35;

                float luminance = core * 1.15 + halo + spikes;
                luminance *= vTwinkle;

                vec3 cold = vec3(0.60, 0.76, 1.00);
                vec3 warm = vec3(0.84, 0.88, 0.93);
                // Warm side is intentionally muted to keep sea/cosmos ambiguity.
                vec3 starColor = mix(cold, warm, vTemp * 0.28);
                vec3 color = starColor * luminance;

                float alpha = clamp(luminance * uOpacity, 0.0, 1.0);
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: false,
    });

    _starMaterials.push(material);
    return material;
}

function createStarLayer({
    count,
    radiusMin,
    radiusMax,
    sizeMin,
    sizeMax,
    yStretch,
}) {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const temps = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2.0 * Math.PI * u;
        const phi = Math.acos(2.0 * v - 1.0);
        const radius = radiusMin + Math.random() * (radiusMax - radiusMin);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi) * yStretch;
        const z = radius * Math.sin(phi) * Math.sin(theta);

        positions[i * 3 + 0] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        sizes[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
        phases[i] = Math.random();
        // Bias toward colder stars so red/orange dust does not dominate.
        temps[i] = Math.pow(Math.random(), 4.0);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aTemp', new THREE.BufferAttribute(temps, 1));

    return new THREE.Points(geometry, createStarMaterial());
}

function createStarField() {
    _starMaterials = [];

    const group = new THREE.Group();

    const farLayer = createStarLayer({
        count: 2800,
        radiusMin: 70,
        radiusMax: 130,
        sizeMin: 0.7,
        sizeMax: 1.5,
        yStretch: 0.85,
    });

    const midLayer = createStarLayer({
        count: 1400,
        radiusMin: 46,
        radiusMax: 82,
        sizeMin: 0.9,
        sizeMax: 1.8,
        yStretch: 0.75,
    });

    farLayer.position.y = -4;
    midLayer.position.y = -7;

    group.add(farLayer, midLayer);
    return group;
}

function createGlowTexture(colorHex) {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const color = new THREE.Color(colorHex);
    const rgb = `${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}`;
    const gradient = ctx.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.5);
    gradient.addColorStop(0.0, `rgba(${rgb}, 0.95)`);
    gradient.addColorStop(0.25, `rgba(${rgb}, 0.68)`);
    gradient.addColorStop(0.6, `rgba(${rgb}, 0.28)`);
    gradient.addColorStop(1.0, `rgba(${rgb}, 0.0)`);

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size * 0.5, size * 0.5, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function createHopfPointMaterial(linkParam) {
    return new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uHover: { value: 0.0 },
            uScale: { value: linkParam.scale },
            uAlpha: { value: creationLinkParams.pointAlpha },
            uColorA: { value: new THREE.Color(linkParam.colorAR, linkParam.colorAG, linkParam.colorAB) },
            uColorB: { value: new THREE.Color(linkParam.colorBR, linkParam.colorBG, linkParam.colorBB) },
        },
        vertexShader: `
            uniform float uTime;
            uniform float uHover;
            uniform float uScale;
            uniform float uAlpha;
            uniform vec3 uColorA;
            uniform vec3 uColorB;

            attribute vec4 aInitial4;
            attribute float aFlowDir;
            attribute float aSize;
            attribute float aPhase;

            varying vec3 vColor;
            varying float vAlpha;

            vec4 qmul(vec4 q1, vec4 q2) {
                return vec4(
                    q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
                    q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
                    q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w,
                    q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z
                );
            }

            vec4 qconj(vec4 q) {
                return vec4(-q.x, -q.y, -q.z, q.w);
            }

            vec4 qrotate(vec4 p, vec4 q) {
                return qmul(qmul(q, p), qconj(q));
            }

            void main() {
                float t = uTime * (0.34 + uHover * 0.26);
                float phase = aPhase + t * aFlowDir;

                vec4 qx = normalize(vec4(sin(phase * 0.5) * 0.72, 0.0, 0.0, cos(phase * 0.5)));
                vec4 qy = normalize(vec4(0.0, sin((phase + 1.31) * 1.0) * 0.62, 0.0, cos((phase + 1.31) * 1.0)));
                vec4 qz = normalize(vec4(0.0, 0.0, sin((phase + 0.57) * 0.7) * 0.45, cos((phase + 0.57) * 0.7)));
                vec4 rot = normalize(qmul(qmul(qx, qy), qz));

                vec4 p4 = qrotate(aInitial4, rot);
                float denom = max(0.24, 1.0 - p4.w);
                vec3 p3 = p4.xyz / denom;

                float swirl = sin(phase * 2.2 + aPhase * 0.35) * 0.11;
                vec2 dir = normalize(p3.xy + vec2(0.0001));
                p3.xy += dir * swirl;
                p3.z += cos(phase * 1.8 + aPhase) * 0.16;
                p3 *= uScale;

                vec4 mvPosition = modelViewMatrix * vec4(p3, 1.0);
                float depthFactor = clamp(1.0 / max(-mvPosition.z, 0.001), 0.0, 1.2);
                gl_PointSize = aSize * (310.0 * depthFactor) * (1.0 + uHover * 0.34);
                gl_Position = projectionMatrix * mvPosition;

                float colorMix = aFlowDir * 0.5 + 0.5;
                vec3 baseColor = mix(uColorA, uColorB, colorMix);
                float lum = 0.54 + 0.46 * sin(phase * 1.5 + aPhase * 0.73);
                vColor = baseColor * (0.62 + lum * 0.74 + uHover * 0.26);
                vAlpha = (0.46 + lum * 0.4) * uAlpha;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vAlpha;

            void main() {
                vec2 uv = gl_PointCoord * 2.0 - 1.0;
                float r = length(uv);
                if (r > 1.0) discard;

                float core = smoothstep(0.48, 0.0, r);
                float halo = smoothstep(1.0, 0.0, r) * 0.42;
                float alpha = clamp((core * 1.2 + halo) * vAlpha, 0.0, 1.0);
                vec3 color = vColor * (core * 1.08 + halo * 0.84);
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
}

function createHopfPoints(def, linkParam) {
    const pointCount = def.pointCount;
    const basePositions = new Float32Array(pointCount * 3);
    const initial4 = new Float32Array(pointCount * 4);
    const flowDir = new Float32Array(pointCount);
    const sizes = new Float32Array(pointCount);
    const phases = new Float32Array(pointCount);

    for (let i = 0; i < pointCount; i++) {
        const p4 = i * 4;
        const x = Math.random() * 2.0 - 1.0;
        const y = Math.random() * 2.0 - 1.0;
        const z = Math.random() * 2.0 - 1.0;
        const w = Math.random() * 2.0 - 1.0;
        const invLen = 1.0 / Math.max(0.0001, Math.hypot(x, y, z, w));

        initial4[p4 + 0] = x * invLen;
        initial4[p4 + 1] = y * invLen;
        initial4[p4 + 2] = z * invLen;
        initial4[p4 + 3] = w * invLen;

        flowDir[i] = i % 2 === 0 ? 1.0 : -1.0;
        sizes[i] = randRange(1.8, 4.8);
        phases[i] = Math.random() * Math.PI * 2.0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(basePositions, 3));
    geometry.setAttribute('aInitial4', new THREE.BufferAttribute(initial4, 4));
    geometry.setAttribute('aFlowDir', new THREE.BufferAttribute(flowDir, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const material = createHopfPointMaterial(linkParam);
    const points = new THREE.Points(geometry, material);
    points.renderOrder = 40;

    return { points, material };
}

function createLinkShell(def) {
    let geometry;
    if (def.shape === 'ring') {
        geometry = new THREE.TorusKnotGeometry(0.72, 0.22, 150, 18, 2, 3);
    } else if (def.shape === 'frame') {
        geometry = new THREE.OctahedronGeometry(1.1, 0);
    } else {
        geometry = new THREE.IcosahedronGeometry(1.05, 1);
    }

    const edges = new THREE.EdgesGeometry(geometry, 20);
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: creationLinkParams.shellOpacityBase,
    });
    const line = new THREE.LineSegments(edges, material);
    line.renderOrder = 39;
    return line;
}

function createLinkHalo(linkParam) {
    const color = new THREE.Color(linkParam.colorBR, linkParam.colorBG, linkParam.colorBB);
    const glowTexture = createGlowTexture(color.getHex());
    if (!glowTexture) return null;

    const glowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        transparent: true,
        opacity: creationLinkParams.haloOpacityBase,
        color,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.setScalar(linkParam.glowScale);
    glow.renderOrder = 38;
    return glow;
}

function createCreationHitProxy() {
    return new THREE.Mesh(
        new THREE.IcosahedronGeometry(1, 1),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.0,
            depthWrite: false,
        })
    );
}

function createCreationLinks() {
    _creationLinkTargets = [];

    const group = new THREE.Group();
    CREATION_LINK_DEFS.forEach((def, index) => {
        const linkParam = getCreationLinkParam(def.id);
        const node = new THREE.Group();
        node.position.set(linkParam.posX, linkParam.posY, linkParam.posZ);
        node.userData.phaseOffset = index * 0.37;

        const { points, material } = createHopfPoints(def, linkParam);
        node.add(points);

        const shell = createLinkShell(def);
        node.add(shell);

        const halo = createLinkHalo(linkParam);
        if (halo) node.add(halo);

        const proxy = createCreationHitProxy();
        proxy.scale.setScalar(linkParam.hitRadius);
        proxy.userData.isCreationLinkTarget = true;
        proxy.userData.draftUrl = def.draftUrl;
        proxy.userData.sourceUrl = def.sourceUrl;
        proxy.userData.label = def.label;
        proxy.userData.isHovered = false;
        proxy.renderOrder = 41;
        node.add(proxy);

        group.add(node);
        _creationLinkTargets.push({
            id: def.id,
            group: node,
            material,
            shell,
            halo,
            mesh: proxy,
            hoverValue: 0,
            phaseOffset: index * 0.37,
            colorA: new THREE.Color(linkParam.colorAR, linkParam.colorAG, linkParam.colorAB),
            colorB: new THREE.Color(linkParam.colorBR, linkParam.colorBG, linkParam.colorBB),
        });
    });

    return group;
}

export function getCreationLinkTargetMeshes() {
    return _creationLinkTargets.map((target) => target.mesh);
}

export function createScene(container) {
    const scene = new THREE.Scene();
    _scene = scene;
    scene.fog = new THREE.FogExp2(FOG_V004_COLOR.getHex(), FOG_V004_DENSITY);

    _bgMaterial = createBackgroundMaterial();
    _bgMesh = createBackgroundMesh(_bgMaterial);
    scene.add(_bgMesh);

    const aspect = window.innerWidth / window.innerHeight;
    const camZ = calcCamZ(aspect);

    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, aspect, CAMERA_NEAR, CAMERA_FAR);
    camera.position.set(sceneParams.camX, sceneParams.camY, camZ);
    camera.lookAt(0, sceneParams.camTargetY, CAMERA_LOOK_AT_Z);
    _camera = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    _fieldMesh = createFieldMesh();
    _flowGroup = createFlowObjects();
    _lastFlowTime = 0;
    _starFieldGroup = createStarField();
    _creationLinkGroup = createCreationLinks();

    scene.add(_fieldMesh);
    scene.add(_flowGroup);
    scene.add(_starFieldGroup);
    scene.add(_creationLinkGroup);

    return { scene, camera, renderer };
}

export function updateScene(time) {
    const m = (Math.sin(time * Math.PI / sceneParams.mixCycle) + 1.0) * 0.5;

    if (toggles.background && _bgMaterial) {
        const pulse = (m * 2.0 - 1.0) * backgroundParams.pulse;
        const centerAFactor = clamp01(1.0 - pulse * 0.45);
        const centerBFactor = clamp01(1.0 + pulse * 0.45);
        const edgeAFactor = clamp01(1.0 - pulse * 0.25);
        const edgeBFactor = clamp01(1.0 + pulse * 0.25);

        _bgCenterA.setRGB(
            clamp01(backgroundParams.centerR * centerAFactor),
            clamp01(backgroundParams.centerG * centerAFactor),
            clamp01(backgroundParams.centerB * centerAFactor)
        );
        _bgCenterB.setRGB(
            clamp01(backgroundParams.centerR * centerBFactor),
            clamp01(backgroundParams.centerG * centerBFactor),
            clamp01(backgroundParams.centerB * centerBFactor)
        );
        _bgEdgeA.setRGB(
            clamp01(backgroundParams.edgeR * edgeAFactor),
            clamp01(backgroundParams.edgeG * edgeAFactor),
            clamp01(backgroundParams.edgeB * edgeAFactor)
        );
        _bgEdgeB.setRGB(
            clamp01(backgroundParams.edgeR * edgeBFactor),
            clamp01(backgroundParams.edgeG * edgeBFactor),
            clamp01(backgroundParams.edgeB * edgeBFactor)
        );

        _bgMaterial.uniforms.uColorCenterA.value.copy(_bgCenterA);
        _bgMaterial.uniforms.uColorCenterB.value.copy(_bgCenterB);
        _bgMaterial.uniforms.uColorEdgeA.value.copy(_bgEdgeA);
        _bgMaterial.uniforms.uColorEdgeB.value.copy(_bgEdgeB);
        _bgMaterial.uniforms.uMix.value = m;
        _bgMaterial.uniforms.uOpacity.value = backgroundParams.opacity;
    }

    if (toggles.fog && _scene?.fog) {
        _fogColor.lerpColors(FOG_V002_COLOR, FOG_V004_COLOR, m);
        _scene.fog.color.copy(_fogColor);
        _scene.fog.density = lerp(FOG_V002_DENSITY, sceneParams.fogDensity, m);
    } else if (_scene?.fog) {
        _scene.fog.density = 0;
    }

    if (_fieldMaterial) {
        _fieldMaterial.uniforms.uTime.value = time;
        _fieldMaterial.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
        _fieldMaterial.uniforms.uIntensity.value = fieldParams.intensity;
        _fieldMaterial.uniforms.uAlpha.value = fieldParams.alpha;
        _fieldMaterial.uniforms.uLineLow.value = fieldParams.lineLow;
        _fieldMaterial.uniforms.uLineHigh.value = fieldParams.lineHigh;
        _fieldMaterial.uniforms.uBottomClip.value = fieldParams.bottomClip;
        _fieldMaterial.uniforms.uBottomFeather.value = fieldParams.bottomFeather;
        _fieldMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }

    if (_fieldMesh) {
        _fieldMesh.visible = toggles.field;
        if (toggles.field) {
            _fieldMesh.rotation.z = time * 0.02;
        }
    }

    if (_flowGroup) {
        _flowGroup.visible = toggles.flowObjects;
        if (toggles.flowObjects) {
            updateFlowObjects(time);
        }
    }

    if (_starMaterials.length > 0) {
        _starMaterials.forEach((mat, index) => {
            mat.uniforms.uTime.value = time + index * 0.7;
            mat.uniforms.uOpacity.value = 0.8;
        });
    }

    if (_starFieldGroup) {
        _starFieldGroup.rotation.y = time * 0.018;
        _starFieldGroup.rotation.x = Math.sin(time * 0.16) * 0.035;
    }

    if (_creationLinkTargets.length > 0) {
        const pulseSpeed = clamp(creationLinkParams.pulseSpeed, 0.01, 6.0);
        const floatAmp = clamp(creationLinkParams.floatAmp, 0.0, 2.5);
        const floatOffset = clamp(creationLinkParams.floatOffset, -2.0, 2.0);
        const yawSpeed = clamp(creationLinkParams.yawSpeed, 0.0, 3.0);
        const tiltSpeed = clamp(creationLinkParams.tiltSpeed, 0.0, 4.0);
        const tiltAmp = clamp(creationLinkParams.tiltAmp, 0.0, 1.2);
        const baseScaleMul = clamp(creationLinkParams.baseScaleMul, 0.05, 3.0);
        const pulseScaleAmp = clamp(creationLinkParams.pulseScaleAmp, 0.0, 1.0);
        const hoverScaleBoost = clamp(creationLinkParams.hoverScaleBoost, 0.0, 1.0);
        const hoverLerp = clamp(creationLinkParams.hoverLerp, 0.01, 1.0);
        const pointAlpha = clamp01(creationLinkParams.pointAlpha);
        const shellOpacityBase = clamp01(creationLinkParams.shellOpacityBase);
        const shellOpacityPulse = clamp(creationLinkParams.shellOpacityPulse, 0.0, 1.0);
        const shellOpacityHover = clamp(creationLinkParams.shellOpacityHover, 0.0, 1.0);
        const shellSpinSpeed = clamp(creationLinkParams.shellSpinSpeed, 0.0, 3.0);
        const haloScalePulse = clamp(creationLinkParams.haloScalePulse, 0.0, 6.0);
        const haloScaleHover = clamp(creationLinkParams.haloScaleHover, 0.0, 4.0);
        const haloOpacityBase = clamp01(creationLinkParams.haloOpacityBase);
        const haloOpacityPulse = clamp(creationLinkParams.haloOpacityPulse, 0.0, 1.0);
        const haloOpacityHover = clamp(creationLinkParams.haloOpacityHover, 0.0, 1.0);

        _creationLinkTargets.forEach((target) => {
            const linkParam = getCreationLinkParam(target.id);
            const pulse = Math.sin(time * pulseSpeed + linkParam.phase + target.phaseOffset);
            const pulse01 = pulse * 0.5 + 0.5;
            const hoverTarget = target.mesh.userData.isHovered ? 1.0 : 0.0;
            target.hoverValue = lerp(target.hoverValue, hoverTarget, hoverLerp);

            target.colorA.setRGB(linkParam.colorAR, linkParam.colorAG, linkParam.colorAB);
            target.colorB.setRGB(linkParam.colorBR, linkParam.colorBG, linkParam.colorBB);

            target.material.uniforms.uTime.value = time + target.phaseOffset;
            target.material.uniforms.uHover.value = target.hoverValue;
            target.material.uniforms.uScale.value = Math.max(0.05, linkParam.scale);
            target.material.uniforms.uAlpha.value = pointAlpha;
            target.material.uniforms.uColorA.value.copy(target.colorA);
            target.material.uniforms.uColorB.value.copy(target.colorB);

            target.group.position.set(
                linkParam.posX,
                linkParam.posY + (pulse + floatOffset) * floatAmp,
                linkParam.posZ
            );
            target.group.rotation.y = time * yawSpeed + target.phaseOffset;
            target.group.rotation.x = Math.sin(time * tiltSpeed + target.phaseOffset) * tiltAmp;

            const scale = baseScaleMul + pulse01 * pulseScaleAmp + target.hoverValue * hoverScaleBoost;
            target.group.scale.setScalar(scale);

            target.shell.material.color.copy(target.colorB);
            target.shell.material.opacity = clamp(
                shellOpacityBase + pulse01 * shellOpacityPulse + target.hoverValue * shellOpacityHover,
                0.0,
                0.98
            );
            target.shell.rotation.z = time * shellSpinSpeed + target.phaseOffset * 1.8;
            target.mesh.scale.setScalar(Math.max(0.1, linkParam.hitRadius));

            if (target.halo) {
                target.halo.material.color.copy(target.colorB);
                target.halo.scale.setScalar(
                    Math.max(0.1, linkParam.glowScale + pulse01 * haloScalePulse + target.hoverValue * haloScaleHover)
                );
                target.halo.material.opacity = clamp(
                    haloOpacityBase + pulse01 * haloOpacityPulse + target.hoverValue * haloOpacityHover,
                    0.0,
                    0.98
                );
            }
        });
    }
}
