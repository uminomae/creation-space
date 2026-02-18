import * as THREE from 'three';
import {
    backgroundParams,
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

    scene.add(_fieldMesh);
    scene.add(_flowGroup);
    scene.add(_starFieldGroup);

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
}
