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
    plasmaParams,
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
let _plasmaSystem; // Added for plasma system
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

const FLOW_X_MIN = -150.0;
const FLOW_X_MAX = 150.0;
const FLOW_FULL_HALF_Y = 15.0;
const FLOW_FULL_HALF_Z = 9.0;
const FLOW_LEFT_END = 0.42;
const FLOW_CENTER_END = 0.64;
const CREATION_LINK_DEFS = [
    {
        id: 1,
        label: 'Creation Field',
        draftUrl: './assets/reports/model-guides/kesson-general-draft.md',
        sourceUrl: 'https://uminomae.github.io/pjdhiro/assets/pdf/kesson-general.pdf',
        shape: 'crystal',
        pointCount: 3200,
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
    mesh.position.set(0, -8, 0);
    return mesh;
}

function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
}

function createFlowPointMaterial({ colorA, colorB, blending = THREE.AdditiveBlending }) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uCoreOpacity: { value: 1.0 },
            uChaosOpacity: { value: 1.0 },
            uColorA: { value: colorA.clone() },
            uColorB: { value: colorB.clone() },
        },
        vertexShader: `
            attribute float aSize;
            attribute float aPhase;
            attribute float aTemp;
            attribute float aChaosVal;
            varying float vTwinkle;
            varying float vTemp;
            varying float vChaosVal;

            uniform float uTime;

            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                float flicker = 0.72 + 0.28 * sin(uTime * 1.1 + aPhase * 6.2831853);
                vTwinkle = flicker;
                vTemp = aTemp;
                vChaosVal = aChaosVal;
                gl_PointSize = aSize * (400.0 / max(-mvPosition.z, 0.001)); // Increased size for probability clouds
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform float uCoreOpacity;
            uniform float uChaosOpacity;
            uniform vec3 uColorA;
            uniform vec3 uColorB;
            varying float vTwinkle;
            varying float vTemp;
            varying float vChaosVal;

            void main() {
                vec2 uv = gl_PointCoord * 2.0 - 1.0;
                float r = length(uv);
                if (r > 1.0) discard;

                // Probability cloud using Gaussian falloff
                float lum = exp(-r * r * 4.5) * 1.25 * vTwinkle;
                vec3 c = mix(uColorA, uColorB, vTemp) * lum;
                
                float targetOpacity = mix(uCoreOpacity, uChaosOpacity, vChaosVal);
                float a = clamp(lum * targetOpacity, 0.0, 1.0);
                gl_FragColor = vec4(c, a);
            }
        `,
        transparent: true,
        blending: blending,
        depthWrite: false,
    });

    _flowMaterials.push(material);
    return material;
}

function resetSeedParticle(system, i) {
    const p3 = i * 3;
    const startX = randRange(FLOW_X_MIN, FLOW_X_MIN + 50.0); // Spawn deep in space
    system.positions[p3 + 0] = startX;

    const theta = system.thetas[i];
    const rNorm = system.radiiNorm[i];

    const absX = Math.abs(startX);
    const scale = flowParams.centerThickness + Math.pow(absX / 35.0, 1.5) * 1.5;

    const y = Math.sin(theta) * rNorm * FLOW_FULL_HALF_Y * scale;
    const z = Math.cos(theta) * rNorm * FLOW_FULL_HALF_Z * scale;

    system.positions[p3 + 1] = y + randRange(-5, 5);
    system.positions[p3 + 2] = z + randRange(-5, 5);

    // Blast forward (gravity handles acceleration, but start with high speed)
    system.velocities[p3 + 0] = randRange(0.8, 2.0);
    system.velocities[p3 + 1] = 0.0;
    system.velocities[p3 + 2] = 0.0;
}

function createSeedObjects() {
    const seedCount = 420;
    const seedPositions = new Float32Array(seedCount * 3);
    const seedVelocities = new Float32Array(seedCount * 3);
    const seedSizes = new Float32Array(seedCount);
    const seedPhases = new Float32Array(seedCount);
    const seedTemps = new Float32Array(seedCount);
    const seedThetas = new Float32Array(seedCount);
    const seedRadiiNorm = new Float32Array(seedCount);

    for (let i = 0; i < seedCount; i++) {
        seedSizes[i] = randRange(1.4, 3.2);
        seedPhases[i] = Math.random();
        seedTemps[i] = Math.pow(Math.random(), 0.8);
        seedThetas[i] = Math.random() * Math.PI * 2.0;
        seedRadiiNorm[i] = Math.pow(Math.random(), 0.5);
    }

    const seedChaosVals = new Float32Array(seedCount).fill(0.0);

    const seedGeometry = new THREE.BufferGeometry();
    seedGeometry.setAttribute('position', new THREE.BufferAttribute(seedPositions, 3));
    seedGeometry.setAttribute('aSize', new THREE.BufferAttribute(seedSizes, 1));
    seedGeometry.setAttribute('aPhase', new THREE.BufferAttribute(seedPhases, 1));
    seedGeometry.setAttribute('aTemp', new THREE.BufferAttribute(seedTemps, 1));
    seedGeometry.setAttribute('aChaosVal', new THREE.BufferAttribute(seedChaosVals, 1));

    const seedMaterial = createFlowPointMaterial({
        colorA: new THREE.Color(0.42, 0.66, 0.95),
        colorB: new THREE.Color(0.86, 0.94, 1.0),
    });
    seedMaterial.userData.kind = 'seed';

    const seedPoints = new THREE.Points(seedGeometry, seedMaterial);

    _seedSystem = {
        points: seedPoints,
        positions: seedPositions,
        velocities: seedVelocities,
        thetas: seedThetas,
        radiiNorm: seedRadiiNorm,
        count: seedCount,
    };

    for (let i = 0; i < seedCount; i++) {
        resetSeedParticle(_seedSystem, i);
    }
    seedGeometry.attributes.position.needsUpdate = true;

    return seedPoints;
}

function createFilamentObjects() {
    const filamentCount = 620;
    const filamentPositions = new Float32Array(filamentCount * 3);
    const filamentSizes = new Float32Array(filamentCount);
    const filamentPhases = new Float32Array(filamentCount);
    const filamentTemps = new Float32Array(filamentCount);
    const filamentThetas = new Float32Array(filamentCount);
    const filamentRadii = new Float32Array(filamentCount);
    const filamentSpeeds = new Float32Array(filamentCount);
    const filamentWobbles = new Float32Array(filamentCount);

    for (let i = 0; i < filamentCount; i++) {
        filamentSizes[i] = randRange(1.7, 4.5);
        filamentPhases[i] = Math.random();
        filamentTemps[i] = Math.random();
        filamentThetas[i] = Math.random() * Math.PI * 2.0;
        filamentRadii[i] = Math.pow(Math.random(), 0.7); // Bias slightly towards center
        filamentSpeeds[i] = randRange(0.09, 0.17);
        filamentWobbles[i] = randRange(0.75, 1.25);
    }

    const filamentChaosVals = new Float32Array(filamentCount).fill(0.0);

    const filamentGeometry = new THREE.BufferGeometry();
    filamentGeometry.setAttribute('position', new THREE.BufferAttribute(filamentPositions, 3));
    filamentGeometry.setAttribute('aSize', new THREE.BufferAttribute(filamentSizes, 1));
    filamentGeometry.setAttribute('aPhase', new THREE.BufferAttribute(filamentPhases, 1));
    filamentGeometry.setAttribute('aTemp', new THREE.BufferAttribute(filamentTemps, 1));
    filamentGeometry.setAttribute('aChaosVal', new THREE.BufferAttribute(filamentChaosVals, 1));

    const filamentMaterial = createFlowPointMaterial({
        colorA: new THREE.Color(0.45, 0.78, 1.0),
        colorB: new THREE.Color(0.88, 0.98, 1.0),
    });
    filamentMaterial.userData.kind = 'filament';

    const filamentPoints = new THREE.Points(filamentGeometry, filamentMaterial);

    _filamentSystem = {
        points: filamentPoints,
        positions: filamentPositions,
        thetas: filamentThetas,
        radiiNorm: filamentRadii,
        phases: filamentPhases,
        speeds: filamentSpeeds,
        wobbles: filamentWobbles,
        count: filamentCount,
    };

    return filamentPoints;
}

function updateSeedParticles(dtScale, time) {
    if (!_seedSystem) return;

    const chaos = flowParams.chaos;
    const drift = flowParams.seedDrift;
    const tight = flowParams.bundleTightness;
    const speedMultiplier = flowParams.speed !== undefined ? flowParams.speed : 1.0;

    // Safety clamp to avoid physics explosions at high speeds
    const safeDtScale = Math.min(dtScale * speedMultiplier, 3.0);

    // Hopf position
    const hopfX = creationLinkParams.link1PosX;
    const hopfY = creationLinkParams.link1PosY;
    const hopfZ = creationLinkParams.link1PosZ;

    for (let i = 0; i < _seedSystem.count; i++) {
        const p3 = i * 3;
        let x = _seedSystem.positions[p3 + 0];
        let y = _seedSystem.positions[p3 + 1];
        let z = _seedSystem.positions[p3 + 2];
        let vx = _seedSystem.velocities[p3 + 0];
        let vy = _seedSystem.velocities[p3 + 1];
        let vz = _seedSystem.velocities[p3 + 2];

        const theta = _seedSystem.thetas[i];
        const rNorm = _seedSystem.radiiNorm[i];

        // The exact hourglass exponent logic based on absolute distance to the pinch center
        const absX = Math.abs(x - hopfX);

        // Use centerThickness to define how thick the 'pinch' should be
        // Creating a sharp hyperbolic funnel (wormhole) that flares out quickly
        const scale = flowParams.centerThickness + Math.pow(absX / 20.0, 2.5) * 2.0;

        const targetY = hopfY + Math.sin(theta) * rNorm * FLOW_FULL_HALF_Y * scale;
        const targetZ = hopfZ + Math.cos(theta) * rNorm * FLOW_FULL_HALF_Z * scale;

        // Central pinch force calculation
        const pullStrength = 0.005 + 4.0 / (absX + 5.0);

        // Smoothing the right side (flowing out like water) by strengthening alignment to the target positions
        const stabilize = (x > hopfX) ? 2.5 : 1.0;

        vy += (targetY - y) * pullStrength * safeDtScale * tight * stabilize;
        vz += (targetZ - z) * pullStrength * safeDtScale * tight * stabilize;

        // Accelerate X as it gets closer to center (gravity slingshot), constant drift when far
        const xAccel = 0.04 + 10.0 / (absX + 10.0);
        vx += (xAccel * drift - vx) * 0.1 * safeDtScale;

        // Add extreme chaos only on the left and center. Fade out rapidly on the right for water-like flow.
        let pinchChaos = 0.0;
        if (x < hopfX) {
            pinchChaos = chaos * Math.max(0.0, 1.0 - absX / 30.0);
        } else {
            pinchChaos = chaos * Math.max(0.0, 1.0 - absX / 8.0); // Smooths out fast!
        }

        if (pinchChaos > 0.001) {
            vy += randRange(-0.04, 0.04) * pinchChaos * safeDtScale;
            vz += randRange(-0.04, 0.04) * pinchChaos * safeDtScale;
        }

        const damping = Math.pow(0.92, safeDtScale); // High friction to prevent physics explosion
        vx *= damping;
        vy *= damping;
        vz *= damping;

        x += vx * safeDtScale;
        y += vy * safeDtScale;
        z += vz * safeDtScale;

        // Reset if they pass the Right edge
        if (x > FLOW_X_MAX) {
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

function updateFilamentParticles(dt, time) {
    if (!_filamentSystem) return;

    const hopfX = creationLinkParams.link1PosX;
    const hopfY = creationLinkParams.link1PosY;
    const hopfZ = creationLinkParams.link1PosZ;

    for (let i = 0; i < _filamentSystem.count; i++) {
        const p3 = i * 3;
        const thetaBase = _filamentSystem.thetas[i];
        const rNorm = _filamentSystem.radiiNorm[i];
        const phase = _filamentSystem.phases[i];
        const speed = _filamentSystem.speeds[i];
        const wobble = _filamentSystem.wobbles[i];
        const globalSpeed = flowParams.speed !== undefined ? flowParams.speed : 1.0;

        // Sweeping from -MAX to +MAX continuously
        const progress = (phase + time * speed * flowParams.seedDrift * 0.1 * globalSpeed) % 1.0;
        let x = lerp(FLOW_X_MIN, FLOW_X_MAX, progress);

        // Exponential spatial spread algorithm (wormhole funnel)
        const absX = Math.abs(x - hopfX);
        const scale = flowParams.centerThickness + Math.pow(absX / 20.0, 2.5) * 2.0;

        // Apply chaotic twisting while passing through center. Water-like smoothness on the right.
        let wobbleMult = 0.0;
        if (x < hopfX) {
            wobbleMult = (absX < 40.0) ? (1.0 - absX / 40.0) : 0.0;
        } else {
            wobbleMult = (absX < 10.0) ? (1.0 - absX / 10.0) : 0.0; // Rapidly removes twist
        }
        const twistWobble = Math.sin(time * 3.5 + i) * wobble * flowParams.chaos * wobbleMult;
        const theta = thetaBase + twistWobble;

        let y = hopfY + Math.sin(theta) * rNorm * FLOW_FULL_HALF_Y * scale;
        let z = hopfZ + Math.cos(theta) * rNorm * FLOW_FULL_HALF_Z * scale;

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

    updateSeedParticles(dtScale, time);
    updateFilamentParticles(dtScale, time);
    updatePlasmaObjects(time);
    updateStarField(time);

    _flowMaterials.forEach((mat) => {
        mat.uniforms.uTime.value = time;
        if (mat.userData.kind === 'seed') {
            mat.uniforms.uCoreOpacity.value = flowParams.seedOpacity;
            mat.uniforms.uChaosOpacity.value = flowParams.seedOpacity;
        } else if (mat.userData.kind === 'plasma') {
            mat.uniforms.uCoreOpacity.value = plasmaParams.coreOpacity;
            mat.uniforms.uChaosOpacity.value = plasmaParams.chaosOpacity;
            mat.uniforms.uColorA.value.copy(plasmaParams.colorA);
            mat.uniforms.uColorB.value.copy(plasmaParams.colorB);
        } else {
            mat.uniforms.uCoreOpacity.value = flowParams.filamentOpacity;
            mat.uniforms.uChaosOpacity.value = flowParams.filamentOpacity;
        }
    });
}

// ========================
// PLASMA CORE SYSTEM (Zero-Base Rebuild)
// ========================

function createPlasmaObjects() {
    const group = new THREE.Group();

    const count = 3000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const temps = new Float32Array(count);
    const chaosVals = new Float32Array(count);

    // Core parameters for each particle: Coordinates on the 3-sphere (S3)
    const angles = new Float32Array(count * 3); // alpha, beta/u, gamma for Hopf coordinates

    for (let i = 0; i < count; i++) {
        // Magatama distribution! (Comma shape Yin-Yang)
        // 'u' represents the position along the comma body, 0 = head, 1 = tail tip.
        // We square random to bias heavily towards the head where the bulk is.
        let u = Math.pow(Math.random(), 2.0);

        // alpha defines the offset from the core ring axis 
        // We give the head more thickness than the tail
        angles[i * 3 + 0] = Math.PI / 4.0 + (Math.random() - 0.5) * 0.45 * (1.0 - u * 0.5);

        // We store 'u' in the second slot to use in the update loop for the trailing effect
        angles[i * 3 + 1] = u;

        // Offset around the tube for volume
        angles[i * 3 + 2] = Math.random() * Math.PI * 2.0;

        positions[i * 3 + 0] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        // Size drastically falls off towards the tail giving a teardrop/comma shape
        sizes[i] = randRange(2.5, 7.5) * (1.1 - u);
        phases[i] = Math.random();
        chaosVals[i] = 0.0;

        // Explicit Yin-Yang Separation:
        // Even indices are Yin (ColorA, aTemp = 0.0)
        // Odd indices are Yang (ColorB, aTemp = 1.0)
        temps[i] = (i % 2 === 0) ? 0.0 : 1.0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aTemp', new THREE.BufferAttribute(temps, 1));
    geometry.setAttribute('aChaosVal', new THREE.BufferAttribute(chaosVals, 1));

    const material = createFlowPointMaterial({
        colorA: plasmaParams.colorA,
        colorB: plasmaParams.colorB,
        blending: THREE.NormalBlending, // Normal Blending to occlude background as "Dark Matter"
    });
    material.userData.kind = 'plasma';

    const points = new THREE.Points(geometry, material);

    // Safety check against culling issues
    points.frustumCulled = false;

    group.add(points);

    _plasmaSystem = {
        points,
        positions,
        angles,
        chaosVals,
        count
    };

    return group;
}

function updatePlasmaObjects(time) {
    if (!_plasmaSystem || !toggles.showPlasma) {
        if (_plasmaSystem) _plasmaSystem.points.visible = false;
        return;
    }
    _plasmaSystem.points.visible = true;

    // Safety checks
    let speed = isNaN(plasmaParams.speed) ? 0.5 : plasmaParams.speed;
    let baseChaos = isNaN(plasmaParams.chaos) ? 0.0 : plasmaParams.chaos;
    let maxRadius = isNaN(plasmaParams.radius) ? 12.0 : plasmaParams.radius;
    let heightRatio = isNaN(plasmaParams.heightRatio) ? 1.0 : plasmaParams.heightRatio;
    let autoChaosAmp = isNaN(plasmaParams.autoChaosAmp) ? 30.0 : Math.max(0.0, plasmaParams.autoChaosAmp);
    let wSeparation = isNaN(plasmaParams.wSeparation) ? 0.35 : Math.max(0.0, plasmaParams.wSeparation);
    let projectionScale = isNaN(plasmaParams.projectionScale) ? 0.4 : Math.max(0.01, plasmaParams.projectionScale);

    // Auto-oscillating chaos to create an alternating "Order (Sphere)" and "Chaos (Diffusion)" breath
    // Using a slow sine wave: when it's positive, we clamp to 0 (Sphere phase).
    // When it's negative, it rises up to 30.0 (Diffusion phase).
    const autoChaos = Math.max(0.0, -Math.sin(time * 0.4)) * autoChaosAmp;
    const chaos = baseChaos + autoChaos;

    const hopfX = isNaN(creationLinkParams.link1PosX) ? 0 : creationLinkParams.link1PosX;
    const hopfY = isNaN(creationLinkParams.link1PosY) ? 0 : creationLinkParams.link1PosY;
    const hopfZ = isNaN(creationLinkParams.link1PosZ) ? 0 : creationLinkParams.link1PosZ;

    for (let i = 0; i < _plasmaSystem.count; i++) {
        const p3 = i * 3;

        let alpha = _plasmaSystem.angles[p3 + 0];
        let u = _plasmaSystem.angles[p3 + 1];
        let randomOffset = _plasmaSystem.angles[p3 + 2];

        const isYang = (i % 2 !== 0);

        // Magatama 4D Spinor rotation
        // Base angle defines the current position of the head. Yin and Yang are 180 degrees (PI) apart.
        const evolution = time * speed;
        const headAngle = evolution + (isYang ? Math.PI : 0.0);

        // Gamma extends backwards forming the tail
        let gamma = headAngle - u * Math.PI * 1.5;

        // Beta rotates around the tube itself
        let beta = time * speed * 2.0 + randomOffset;

        // Chaos injects turbulent non-linear progression
        const turbulence = chaos * 0.05 * Math.sin(gamma * 3.0 + i * 0.01 + time * speed);

        beta += turbulence;
        gamma -= turbulence;

        // Map S3 Hopf Coordinates to 4D Vector (X, Y, Z, W)
        // Unit quaternion constraint: X^2 + Y^2 + Z^2 + W^2 = 1
        let X = Math.sin(alpha) * Math.cos(beta);
        let Y = Math.sin(alpha) * Math.sin(beta);
        let Z = Math.cos(alpha) * Math.cos(gamma);
        let W = Math.cos(alpha) * Math.sin(gamma);

        // STEREOGRAPHIC PROJECTION from S3 to R3
        // Strongly separating the W coordinate creates two highly distinct, interlocking toroidal bands
        const wOffset = isYang ? wSeparation : -wSeparation;

        // When chaos increases, we reduce the W separation so that the explosion 
        // integrates into a single unified spherical shell instead of two distinct ones.
        const dynamicWOffset = wOffset * (1.0 - Math.min(1.0, chaos / 20.0));

        const denom = (1.0 - (W + dynamicWOffset)) + 0.01;

        // Base mapping to R3. A slightly wider base radius spreads the spirals out.
        let dx = (X / denom) * (maxRadius * projectionScale);
        let dy = (Y / denom) * (maxRadius * projectionScale);
        let dz = (Z / denom) * (maxRadius * projectionScale);

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // --- 180-Degree Omnidirectional Diffusion (Spherical Mapping) ---
        // Use Math.atan to smoothly map the infinite stereographic projection into a finite spherical volume.
        // As dist approaches infinity (denom -> 0), mappedDist approaches maxSpread, creating a perfect sphere surface.
        const maxSpread = maxRadius * (1.0 + chaos * 0.15);

        // We use a scale factor (maxRadius * 0.5) to keep the inner core relatively untweaked,
        // while squashing the outer infinities onto the maxSpread shell.
        const mappedDist = Math.atan(dist / (maxRadius * 0.5)) * (2.0 / Math.PI) * maxSpread;

        if (dist > 0.0001) {
            const factor = mappedDist / dist;
            dx *= factor;
            dy *= factor;
            dz *= factor;
        }

        let chaosVal = 0.0;

        // Calculate chaos opacity based on how far it was mapped outward
        if (mappedDist > maxRadius * 0.8) {
            chaosVal = Math.min(1.0, (mappedDist - maxRadius * 0.8) / (maxRadius * 0.5));
        } else if (chaos > 0.1) {
            // Even particles inside core get a touch of chaos transparency if global chaos is high
            chaosVal = Math.min(1.0, chaos / 30.0);
        }

        // Output chaos values to buffer for shader Opacity split
        _plasmaSystem.chaosVals[i] = chaosVal;

        // Apply global squash via heightRatio safely
        dy *= heightRatio;

        _plasmaSystem.positions[p3 + 0] = hopfX + dx;
        _plasmaSystem.positions[p3 + 1] = hopfY + dy;
        _plasmaSystem.positions[p3 + 2] = hopfZ + dz;
    }

    _plasmaSystem.points.geometry.attributes.position.needsUpdate = true;
    _plasmaSystem.points.geometry.attributes.aChaosVal.needsUpdate = true;
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

                // Probability cloud using Gaussian falloff
                float lum = exp(-r * r * 5.0) * 1.5 * vTwinkle;

                vec3 cold = vec3(0.60, 0.76, 1.00);
                vec3 warm = vec3(0.84, 0.88, 0.93);
                // Warm side is intentionally muted to keep sea/cosmos ambiguity.
                vec3 starColor = mix(cold, warm, vTemp * 0.28);
                vec3 color = starColor * lum;

                float alpha = clamp(lum * uOpacity, 0.0, 1.0);
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

function updateStarField(time) {
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
            uVortexSpeed: { value: creationLinkParams.vortexSpeed },
            uSwirlStrength: { value: creationLinkParams.swirlStrength },
            uSphereFill: { value: creationLinkParams.sphereFill },
            uColorSplitSoftness: { value: creationLinkParams.colorSplitSoftness },
            uParticleBrightness: { value: creationLinkParams.particleBrightness },
            uParticleSoftness: { value: creationLinkParams.particleSoftness },
            uFluidDrift: { value: creationLinkParams.fluidDrift },
            uPointerBurstStrength: { value: creationLinkParams.pointerBurstStrength },
            uPointerBurstSpread: { value: creationLinkParams.pointerBurstSpread },
            uColorContrast: { value: creationLinkParams.colorContrast },
            uCameraProximity: { value: 0.0 },
            uColorA: { value: new THREE.Color(linkParam.colorAR, linkParam.colorAG, linkParam.colorAB) },
            uColorB: { value: new THREE.Color(linkParam.colorBR, linkParam.colorBG, linkParam.colorBB) },
        },
        vertexShader: `
            uniform float uTime;
            uniform float uHover;
            uniform float uScale;
            uniform float uAlpha;
            uniform float uVortexSpeed;
            uniform float uSwirlStrength;
            uniform float uSphereFill;
            uniform float uColorSplitSoftness;
            uniform float uParticleBrightness;
            uniform float uFluidDrift;
            uniform float uPointerBurstStrength;
            uniform float uPointerBurstSpread;
            uniform float uColorContrast;
            uniform float uCameraProximity;
            uniform vec3 uColorA;
            uniform vec3 uColorB;

            attribute vec4 aInitial4;
            attribute float aFlowDir;
            attribute float aSize;
            attribute float aPhase;

            varying vec3 vColor;
            varying float vAlpha;

            vec2 rotate2(vec2 p, float a) {
                float s = sin(a);
                float c = cos(a);
                return mat2(c, -s, s, c) * p;
            }

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
                float t = uTime * (0.38 + uHover * 0.22);
                float phase = aPhase + t * aFlowDir;

                vec4 qx = normalize(vec4(sin(phase * 0.5) * 0.68, 0.0, 0.0, cos(phase * 0.5)));
                vec4 qy = normalize(vec4(0.0, sin((phase + 1.2) * 0.95) * 0.58, 0.0, cos((phase + 1.2) * 0.95)));
                vec4 rot = normalize(qmul(qx, qy));

                vec4 p4 = qrotate(aInitial4, rot);
                float denom = max(0.3, 1.0 - p4.w);
                vec3 hopf = p4.xyz / denom;

                float eta = acos(clamp(aInitial4.w, -1.0, 1.0));
                float theta = phase * uVortexSpeed + eta * 1.12;
                float phi = phase * (1.45 + 0.45 * aFlowDir) + aInitial4.z * 3.2;

                vec3 dir = normalize(hopf + vec3(0.0001));
                dir.xz = rotate2(dir.xz, theta);
                dir.y += sin(phi) * 0.35;
                dir = normalize(dir);

                float radialNoise = 0.5 + 0.5 * sin(phi * 1.35 + aPhase * 0.62);
                float radialSeed = clamp(length(hopf) * 0.22, 0.0, 1.0);
                float radius = mix(0.16, max(0.18, uSphereFill), radialSeed * 0.5 + radialNoise * 0.5);

                vec3 p3 = dir * radius;
                vec3 tangent = vec3(-p3.z, 0.0, p3.x);
                p3 += tangent * (uSwirlStrength * (0.35 + 0.65 * (1.0 - radius)) * aFlowDir);
                vec3 fluid = vec3(
                    sin(phi + t * 0.7),
                    cos(theta * 1.2 - t * 0.55),
                    sin(phi * 0.65 - t * 0.8)
                );
                p3 += fluid * (uFluidDrift * (0.25 + 0.75 * (1.0 - radius)));
                p3 = normalize(p3 + vec3(0.0001)) * min(max(0.08, uSphereFill), length(p3));
                p3 *= uScale;

                float cameraBurst = pow(clamp(uCameraProximity, 0.0, 1.0), 1.35);
                float burstDrive = max(uHover, cameraBurst);
                float hoverBurst = clamp(burstDrive * uPointerBurstStrength, 0.0, 1.0);
                float burstMask = smoothstep(0.45, 1.0, (p4.w + 1.0) * 0.5);
                float stereoDen = max(0.012, 1.0 - p4.w);
                vec3 stereo = p4.xyz / stereoDen;
                vec3 burstDir = normalize(stereo + vec3(0.0001));
                vec3 burstPos = stereo * (1.0 + hoverBurst * (2.4 + burstMask * 4.0));
                burstPos += burstDir * hoverBurst * uPointerBurstSpread * (0.35 + burstMask);
                p3 = mix(p3, burstPos, hoverBurst * 0.96);

                vec4 mvPosition = modelViewMatrix * vec4(p3, 1.0);
                float depthFactor = clamp(1.0 / max(-mvPosition.z, 0.001), 0.0, 1.2);
                float burstPointScale = mix(1.0, 0.65, hoverBurst);
                gl_PointSize = aSize * (280.0 * depthFactor) * (1.0 + uHover * 0.2) * burstPointScale;
                gl_Position = projectionMatrix * mvPosition;

                float split = smoothstep(-uColorSplitSoftness, uColorSplitSoftness, p3.x);
                float colorMix = clamp(0.85 * split + 0.15 * (aFlowDir * 0.5 + 0.5), 0.0, 1.0);
                vec3 baseColor = mix(uColorA, uColorB, colorMix);
                float c = clamp(uColorContrast, 0.0, 1.8);
                baseColor = clamp((baseColor - 0.5) * (1.0 + c) + 0.5, 0.0, 1.0);
                float pulse = 0.48 + 0.52 * sin(phase * 1.4 + eta * 2.1);
                float brightness = clamp(uParticleBrightness, 0.05, 2.0);
                vColor = baseColor * (0.33 + pulse * 0.28 + uHover * 0.14) * brightness;
                float alphaGain = 0.18 + uAlpha * 1.25;
                vAlpha = (0.14 + pulse * 0.16) * alphaGain * mix(1.0, 0.48, hoverBurst);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vAlpha;
            uniform float uParticleSoftness;

            void main() {
                vec2 uv = gl_PointCoord * 2.0 - 1.0;
                float r = length(uv);
                if (r > 1.0) discard;

                float softness = max(1.2, uParticleSoftness);
                float gaussian = exp(-r * r * softness);
                float edge = smoothstep(1.0, 0.0, r);
                float alpha = clamp(gaussian * edge * vAlpha, 0.0, 1.0);
                vec3 color = vColor * (0.35 + gaussian * 0.85);
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

        flowDir[i] = i < pointCount * 0.5 ? 1.0 : -1.0;
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
    _flowGroup = new THREE.Group(); // Initialize _flowGroup here
    _flowGroup.add(createSeedObjects());
    _flowGroup.add(createFilamentObjects());
    _flowGroup.add(createPlasmaObjects());
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

    if (_bgMesh) {
        _bgMesh.visible = toggles.background;
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
        const starOpacity = toggles.background ? 0.8 : 0.0;
        _starMaterials.forEach((mat, index) => {
            mat.uniforms.uTime.value = time + index * 0.7;
            mat.uniforms.uOpacity.value = starOpacity;
        });
    }

    if (_starFieldGroup) {
        _starFieldGroup.visible = toggles.background;
        if (toggles.background) {
            _starFieldGroup.rotation.y = time * 0.018;
            _starFieldGroup.rotation.x = Math.sin(time * 0.16) * 0.035;
        }
    }

    if (_creationLinkTargets.length > 0) {
        const pulseSpeed = clamp(creationLinkParams.pulseSpeed, 0.01, 6.0);
        const vortexSpeed = clamp(creationLinkParams.vortexSpeed, 0.01, 4.0);
        const swirlStrength = clamp(creationLinkParams.swirlStrength, 0.0, 1.5);
        const sphereFill = clamp(creationLinkParams.sphereFill, 0.2, 1.5);
        const colorSplitSoftness = clamp(creationLinkParams.colorSplitSoftness, 0.001, 0.5);
        const particleBrightness = clamp(creationLinkParams.particleBrightness, 0.05, 2.0);
        const particleSoftness = clamp(creationLinkParams.particleSoftness, 1.2, 8.0);
        const fluidDrift = clamp(creationLinkParams.fluidDrift, 0.0, 1.0);
        const pointerBurstStrength = clamp(creationLinkParams.pointerBurstStrength, 0.0, 2.0);
        const pointerBurstSpread = clamp(creationLinkParams.pointerBurstSpread, 0.0, 64.0);
        const colorContrast = clamp(creationLinkParams.colorContrast, 0.0, 2.0);
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
            target.material.uniforms.uScale.value = clamp(linkParam.scale, 0.05, 15.0);
            target.material.uniforms.uAlpha.value = pointAlpha;
            target.material.uniforms.uVortexSpeed.value = vortexSpeed;
            target.material.uniforms.uSwirlStrength.value = swirlStrength;
            target.material.uniforms.uSphereFill.value = sphereFill;
            target.material.uniforms.uColorSplitSoftness.value = colorSplitSoftness;
            target.material.uniforms.uParticleBrightness.value = particleBrightness;
            target.material.uniforms.uParticleSoftness.value = particleSoftness;
            target.material.uniforms.uFluidDrift.value = fluidDrift;
            target.material.uniforms.uPointerBurstStrength.value = pointerBurstStrength;
            target.material.uniforms.uPointerBurstSpread.value = pointerBurstSpread;
            target.material.uniforms.uColorContrast.value = colorContrast;
            if (_camera) {
                const distance = _camera.position.distanceTo(target.group.position);
                const near = 8.0;
                const far = 30.0;
                const proximity = clamp01(1.0 - (distance - near) / (far - near));
                target.material.uniforms.uCameraProximity.value = proximity;
            } else {
                target.material.uniforms.uCameraProximity.value = 0.0;
            }
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
