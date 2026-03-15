import * as THREE from 'three';
import { createSceneModule } from './core.js';

export { sceneParams } from './core.js';

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
        interactive: false,
        draftUrl: '',
        sourceUrl: '',
        shape: 'crystal',
        pointCount: 1800,
    },
    {
        id: 2,
        label: 'Creation Notes II',
        interactive: false,
        draftUrl: '',
        sourceUrl: '',
        shape: 'ring',
        pointCount: 2100,
    },
    {
        id: 3,
        label: 'Creation Notes III',
        interactive: false,
        draftUrl: '',
        sourceUrl: '',
        shape: 'frame',
        pointCount: 1700,
    },
];

function createFlowPointMaterial({ colorA, colorB }, flowState) {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uOpacity: { value: 1.0 },
            uColorA: { value: colorA.clone() },
            uColorB: { value: colorB.clone() },
            uSoftness: { value: 2.2 },
            uSizeScale: { value: 0.82 },
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
                gl_PointSize = aSize * (340.0 / max(-mvPosition.z, 0.001));
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

                float core = smoothstep(0.52, 0.0, r);
                float halo = smoothstep(1.0, 0.0, r) * 0.56;
                float lum = (core * 1.22 + halo) * vTwinkle;
                vec3 c = mix(uColorA, uColorB, vTemp) * lum;
                float a = clamp(lum * uOpacity * 1.18, 0.0, 1.0);
                gl_FragColor = vec4(c, a);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    flowState.materials.push(material);
    return material;
}

function resetSeedParticle(system, i, helpers) {
    const { randRange } = helpers;
    const p3 = i * 3;
    system.positions[p3 + 0] = randRange(FLOW_X_MIN * 1.03, -10.0);
    system.positions[p3 + 1] = randRange(-FLOW_FULL_HALF_Y, FLOW_FULL_HALF_Y);
    system.positions[p3 + 2] = randRange(-FLOW_FULL_HALF_Z, FLOW_FULL_HALF_Z);

    system.velocities[p3 + 0] = randRange(-0.02, 0.04);
    system.velocities[p3 + 1] = randRange(-0.02, 0.02);
    system.velocities[p3 + 2] = randRange(-0.01, 0.01);
    system.lanes[i] = randRange(-FLOW_FULL_HALF_Y, FLOW_FULL_HALF_Y);
    system.depthLanes[i] = randRange(-FLOW_FULL_HALF_Z, FLOW_FULL_HALF_Z);
}

function createFlowObjects({ helpers }) {
    const { randRange } = helpers;
    const flowState = {
        group: new THREE.Group(),
        materials: [],
        seedSystem: null,
        filamentSystem: null,
        lastFlowTime: 0,
    };

    const seedCount = 420;
    const seedPositions = new Float32Array(seedCount * 3);
    const seedVelocities = new Float32Array(seedCount * 3);
    const seedSizes = new Float32Array(seedCount);
    const seedPhases = new Float32Array(seedCount);
    const seedTemps = new Float32Array(seedCount);
    const seedLanes = new Float32Array(seedCount);
    const seedDepthLanes = new Float32Array(seedCount);

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
    }, flowState);
    seedMaterial.userData.kind = 'seed';

    const seedPoints = new THREE.Points(seedGeometry, seedMaterial);
    flowState.group.add(seedPoints);
    flowState.seedSystem = {
        points: seedPoints,
        positions: seedPositions,
        velocities: seedVelocities,
        lanes: seedLanes,
        depthLanes: seedDepthLanes,
        count: seedCount,
    };

    for (let i = 0; i < seedCount; i++) {
        resetSeedParticle(flowState.seedSystem, i, helpers);
    }
    seedGeometry.attributes.position.needsUpdate = true;

    const filamentCount = 620;
    const filamentPositions = new Float32Array(filamentCount * 3);
    const filamentSizes = new Float32Array(filamentCount);
    const filamentPhases = new Float32Array(filamentCount);
    const filamentTemps = new Float32Array(filamentCount);
    const filamentLanes = new Float32Array(filamentCount);
    const filamentDepthBias = new Float32Array(filamentCount);
    const filamentSpeeds = new Float32Array(filamentCount);
    const filamentWobbles = new Float32Array(filamentCount);
    const laneCount = 23;

    for (let i = 0; i < filamentCount; i++) {
        filamentSizes[i] = randRange(1.7, 3.9);
        filamentPhases[i] = Math.random();
        filamentTemps[i] = Math.random();
        filamentLanes[i] = Math.floor(Math.random() * laneCount);
        filamentDepthBias[i] = randRange(-1.0, 1.0);
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
    }, flowState);
    filamentMaterial.userData.kind = 'filament';

    const filamentPoints = new THREE.Points(filamentGeometry, filamentMaterial);
    flowState.group.add(filamentPoints);
    flowState.filamentSystem = {
        points: filamentPoints,
        positions: filamentPositions,
        lanes: filamentLanes,
        depthBias: filamentDepthBias,
        phases: filamentPhases,
        speeds: filamentSpeeds,
        wobbles: filamentWobbles,
        laneCount,
        count: filamentCount,
    };

    return flowState;
}

function updateSeedParticles(time, dtScale, flowState, helpers) {
    const { clamp, clamp01, lerp, randRange, flowParams } = {
        ...helpers,
        flowParams: helpers.flowParams,
    };
    const { seedSystem } = flowState;
    if (!seedSystem) return;

    const centerBandRatio = clamp(flowParams.centerBandRatio, 0.2, 0.8);
    const centerBandHalf = FLOW_FULL_HALF_Y * centerBandRatio;
    const chaos = flowParams.chaos;
    const drift = flowParams.seedDrift;
    const tight = flowParams.bundleTightness;
    const depthScatter = clamp(flowParams.depthScatter ?? 1.0, 0.0, 2.0);

    for (let i = 0; i < seedSystem.count; i++) {
        const p3 = i * 3;
        let x = seedSystem.positions[p3 + 0];
        let y = seedSystem.positions[p3 + 1];
        let z = seedSystem.positions[p3 + 2];
        let vx = seedSystem.velocities[p3 + 0];
        let vy = seedSystem.velocities[p3 + 1];
        let vz = seedSystem.velocities[p3 + 2];

        const progress = clamp01((x - FLOW_X_MIN) / (FLOW_X_MAX - FLOW_X_MIN));

        if (progress < FLOW_LEFT_END) {
            const t = progress / FLOW_LEFT_END;
            vx += (0.112 * drift - vx) * 0.052 * dtScale;
            vy += (-y) * lerp(0.008, 0.026, t) * dtScale;
            vy += randRange(-0.003, 0.003) * dtScale * chaos;
            const zTarget = seedSystem.depthLanes[i] * 0.38 * depthScatter;
            vz += (zTarget - z) * 0.012 * dtScale + randRange(-0.0025, 0.0025) * dtScale * depthScatter;
        } else if (progress < FLOW_CENTER_END) {
            const dx = x;
            const dy = y;
            const inv = 1.0 / (dx * dx + dy * dy + 2.6);
            const swirlX = -dy * inv * 0.12 * chaos;
            const swirlY = dx * inv * 0.12 * chaos;
            const toCenterX = -x * 0.006 * chaos;
            const overflow = Math.max(0.0, Math.abs(y) - centerBandHalf);
            const bandSpring = -Math.sign(y || 1) * overflow * 0.045;
            const depthPhase = time * (1.25 + depthScatter * 0.5) + i * 0.19 + x * 0.05;
            const orbitalZ = Math.sin(depthPhase) * FLOW_FULL_HALF_Z * 0.26 * (0.45 + depthScatter * 0.55);
            const laneDepth = seedSystem.depthLanes[i] * centerBandRatio * (0.35 + 0.45 * depthScatter);
            const targetZ = orbitalZ + laneDepth;

            vx += (swirlX + toCenterX + randRange(-0.0025, 0.0025)) * dtScale;
            vy += (swirlY + bandSpring + randRange(-0.003, 0.003)) * dtScale;
            vz += (targetZ - z) * 0.026 * dtScale + randRange(-0.0025, 0.0025) * dtScale * depthScatter;
        } else {
            const spread = smoothstep(FLOW_CENTER_END, 1.0, progress);
            const targetY = seedSystem.lanes[i] * lerp(centerBandRatio, 1.0, spread);
            const laneDepth = seedSystem.depthLanes[i] * lerp(centerBandRatio * 0.35, 1.0, spread);
            const spiralZ = Math.sin(time * 1.0 + i * 0.13 + x * 0.04)
                * FLOW_FULL_HALF_Z * (0.08 + spread * 0.34 * depthScatter);
            const targetZ = laneDepth * 0.58 + spiralZ;
            vx += (0.13 * drift - vx) * 0.065 * dtScale;
            vy += (targetY - y) * 0.022 * dtScale * tight;
            vz += (targetZ - z) * 0.021 * dtScale;
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
            resetSeedParticle(seedSystem, i, helpers);
            continue;
        }

        seedSystem.positions[p3 + 0] = x;
        seedSystem.positions[p3 + 1] = y;
        seedSystem.positions[p3 + 2] = z;
        seedSystem.velocities[p3 + 0] = vx;
        seedSystem.velocities[p3 + 1] = vy;
        seedSystem.velocities[p3 + 2] = vz;
    }

    seedSystem.points.geometry.attributes.position.needsUpdate = true;
}

function updateFilamentParticles(time, flowState, helpers) {
    const { clamp, lerp, flowParams } = {
        ...helpers,
        flowParams: helpers.flowParams,
    };
    const { filamentSystem } = flowState;
    if (!filamentSystem) return;

    const centerBandRatio = clamp(flowParams.centerBandRatio, 0.2, 0.8);
    const centerLane = (filamentSystem.laneCount - 1) * 0.5;
    const tight = flowParams.bundleTightness;
    const depthScatter = clamp(flowParams.depthScatter ?? 1.0, 0.0, 2.0);

    for (let i = 0; i < filamentSystem.count; i++) {
        const p3 = i * 3;
        const lane = filamentSystem.lanes[i];
        const depthBias = filamentSystem.depthBias[i];
        const phase = filamentSystem.phases[i];
        const speed = filamentSystem.speeds[i];
        const wobble = filamentSystem.wobbles[i];
        const t = (phase + time * speed) % 1.0;

        const laneNorm = (lane - centerLane) / Math.max(centerLane, 1.0);
        const fullY = laneNorm * FLOW_FULL_HALF_Y;
        const fullZ = Math.sin(laneNorm * 2.4 + i * 0.01) * FLOW_FULL_HALF_Z * 0.32;
        const x = lerp(FLOW_X_MIN, FLOW_X_MAX, t);

        const leftToCenter = smoothstep(0.0, FLOW_LEFT_END, t);
        const rightSpread = smoothstep(FLOW_CENTER_END, 1.0, t);
        let bandScale = lerp(1.0, centerBandRatio, leftToCenter);
        bandScale = lerp(bandScale, 1.0, rightSpread);

        const jitterScale = lerp(1.0, centerBandRatio, leftToCenter);
        const twist = Math.sin(t * 11.0 - time * 2.2 + lane * 0.75) * 0.55 * wobble * jitterScale;
        const ripple = Math.sin(t * 20.0 + time * 1.6 + i * 0.02) * 0.14 * jitterScale;
        const spreadNoise = Math.sin(time * 1.25 + i * 0.09)
            * FLOW_FULL_HALF_Y * 0.05 * rightSpread * (1.0 - tight * 0.4);
        const depthLift = depthBias * FLOW_FULL_HALF_Z * 0.34 * bandScale * (0.45 + depthScatter * 0.55);
        const depthSpiral = Math.sin(t * 14.0 - time * (1.6 + depthScatter * 0.4) + lane * 0.33)
            * FLOW_FULL_HALF_Z * 0.2 * (0.3 + rightSpread * 0.9 * depthScatter);

        let y = fullY * bandScale + twist + ripple + spreadNoise;
        y += Math.cos(t * 10.0 + depthBias * 2.2 + time * 0.9) * 0.2 * bandScale * depthScatter;
        let z = fullZ * bandScale + Math.cos(t * 12.0 - time * 1.8 + lane * 0.42) * 0.65 * wobble * jitterScale;
        z += depthLift + depthSpiral;

        filamentSystem.positions[p3 + 0] = x;
        filamentSystem.positions[p3 + 1] = y;
        filamentSystem.positions[p3 + 2] = z;
    }

    filamentSystem.points.geometry.attributes.position.needsUpdate = true;
}

function updateFlowObjects({ time, flowState, helpers }) {
    const { flowParams } = helpers;
    const dt = flowState.lastFlowTime > 0 ? Math.min(0.05, Math.max(0.001, time - flowState.lastFlowTime)) : 0.016;
    flowState.lastFlowTime = time;
    const dtScale = dt * 60.0;

    updateSeedParticles(time, dtScale, flowState, helpers);
    updateFilamentParticles(time, flowState, helpers);

    flowState.materials.forEach((material) => {
        material.uniforms.uTime.value = time;
        material.uniforms.uOpacity.value = material.userData.kind === 'seed'
            ? flowParams.seedOpacity
            : flowParams.filamentOpacity;
    });
}

function createStarMaterial() {
    return new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uOpacity: { value: 1.0 },
            uSoftness: { value: 2.2 },
            uSizeScale: { value: 0.82 },
        },
        vertexShader: `
            attribute float aSize;
            attribute float aPhase;
            attribute float aTemp;
            varying float vTwinkle;
            varying float vTemp;

            uniform float uTime;
            uniform float uSizeScale;

            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                float twinkle = 0.62 + 0.38 * sin(uTime * 0.8 + aPhase * 6.2831853);
                vTwinkle = twinkle;
                vTemp = aTemp;

                float pointSize = aSize * (0.85 + 0.75 * twinkle);
                gl_PointSize = pointSize * uSizeScale * (320.0 / max(-mvPosition.z, 0.001));
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vTwinkle;
            varying float vTemp;
            uniform float uOpacity;
            uniform float uSoftness;

            void main() {
                vec2 uv = gl_PointCoord * 2.0 - 1.0;
                float r = length(uv);
                if (r > 1.0) discard;

                float softness = max(1.2, uSoftness);
                float gaussian = exp(-r * r * softness);
                float halo = smoothstep(1.0, 0.0, r) * 0.32;
                float luminance = (gaussian * 1.08 + halo) * (0.78 + gaussian * 0.22);
                luminance *= vTwinkle;

                vec3 cold = vec3(0.60, 0.76, 1.00);
                vec3 warm = vec3(0.84, 0.88, 0.93);
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
}

function updateStars({ time, starFieldGroup, starMaterials, helpers }) {
    const { backgroundParams, clamp } = helpers;
    if (starMaterials.length > 0) {
        const starOpacity = clamp(backgroundParams.starOpacity, 0.0, 1.0);
        const starSoftness = clamp(backgroundParams.starSoftness, 1.2, 8.0);
        const starSize = clamp(backgroundParams.starSize, 0.2, 2.0);
        starMaterials.forEach((material, index) => {
            material.uniforms.uTime.value = time + index * 0.7;
            material.uniforms.uOpacity.value = starOpacity;
            material.uniforms.uSoftness.value = starSoftness;
            material.uniforms.uSizeScale.value = starSize;
        });
    }

    if (starFieldGroup) {
        starFieldGroup.rotation.y = time * 0.018;
        starFieldGroup.rotation.x = Math.sin(time * 0.16) * 0.035;
    }
}

function createHopfPointMaterial({ linkParam, helpers }) {
    const { creationLinkParams } = helpers;
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
            uCoreSharpness: { value: creationLinkParams.coreSharpness ?? 1.0 },
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

                float splitSoft = max(0.01, uColorSplitSoftness * 0.35);
                float split = smoothstep(-splitSoft, splitSoft, p3.x);
                float flowSplit = aFlowDir * 0.5 + 0.5;
                float colorMix = clamp(mix(flowSplit, split, 0.42), 0.0, 1.0);
                vec3 baseColor = mix(uColorA, uColorB, colorMix);
                float c = clamp(uColorContrast, 0.0, 1.8);
                float contrastGain = 1.0 + c * 0.55;
                baseColor = clamp((baseColor - 0.5) * contrastGain + 0.5, 0.03, 1.0);
                float pulse = 0.48 + 0.52 * sin(phase * 1.4 + eta * 2.1);
                float brightness = clamp(uParticleBrightness, 0.05, 2.0);
                vColor = baseColor * (0.46 + pulse * 0.44 + uHover * 0.2) * brightness;
                float alphaGain = 0.35 + uAlpha * 2.2;
                vAlpha = (0.35 + pulse * 0.4) * alphaGain * mix(1.0, 0.6, hoverBurst);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vAlpha;
            uniform float uParticleSoftness;
            uniform float uCoreSharpness;

            void main() {
                vec2 uv = gl_PointCoord * 2.0 - 1.0;
                float r = length(uv);
                if (r > 1.0) discard;

                float softness = max(1.2, uParticleSoftness);
                float gaussian = exp(-r * r * softness);
                float coreExp = mix(1.1, 4.2, clamp(uCoreSharpness * 0.5, 0.0, 1.0));
                float core = pow(max(0.0, 1.0 - r), coreExp);
                float edge = smoothstep(1.0, 0.0, r);
                float alpha = clamp((gaussian * 0.84 + core * 1.12) * edge * vAlpha, 0.0, 1.0);
                vec3 color = vColor * (0.42 + gaussian * 0.88 + core * 1.08);
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
}

function decorateCreationLinkTarget({ index }) {
    return {
        orbitYaw: index * (Math.PI * 2.0 / 3.0),
    };
}

function updateCreationLinks({ time, creationLinkTargets, camera, helpers }) {
    const { creationLinkParams, sceneParams, clamp, clamp01, getCreationLinkParam, lerp } = helpers;

    const pulseSpeed = clamp(creationLinkParams.pulseSpeed, 0.01, 6.0);
    const sizeGain = clamp(creationLinkParams.sizeGain ?? 1.0, 0.2, 6.0);
    const sizeGainRoot = Math.sqrt(sizeGain);
    const linkSpread = clamp(creationLinkParams.linkSpread ?? 1.0, 0.5, 3.0);
    const linkDepthSpread = clamp(creationLinkParams.linkDepthSpread ?? 0.0, 0.0, 2.0);
    const orbitSpeed = clamp(pulseSpeed * 0.36, 0.05, 3.2);
    const gazeY = sceneParams.camTargetY;
    const vortexSpeed = clamp(creationLinkParams.vortexSpeed, 0.01, 4.0);
    const swirlStrength = clamp(creationLinkParams.swirlStrength, 0.0, 1.5);
    const sphereFill = clamp(creationLinkParams.sphereFill, 0.2, 1.5);
    const colorSplitSoftness = clamp(creationLinkParams.colorSplitSoftness, 0.001, 0.5);
    const particleBrightness = clamp(creationLinkParams.particleBrightness, 0.05, 2.0);
    const particleSoftness = clamp(creationLinkParams.particleSoftness, 1.2, 8.0);
    const coreSharpness = clamp(creationLinkParams.coreSharpness ?? 1.0, 0.2, 2.5);
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

    creationLinkTargets.forEach((target) => {
        const linkParam = getCreationLinkParam(target.id);
        const pulse = Math.sin(time * pulseSpeed + linkParam.phase + target.phaseOffset);
        const pulse01 = pulse * 0.5 + 0.5;
        const hoverTarget = target.mesh.userData.isHovered ? 1.0 : 0.0;
        target.hoverValue = lerp(target.hoverValue, hoverTarget, hoverLerp);

        target.colorA.setRGB(linkParam.colorAR, linkParam.colorAG, linkParam.colorAB);
        target.colorB.setRGB(linkParam.colorBR, linkParam.colorBG, linkParam.colorBB);

        target.material.uniforms.uTime.value = time + target.phaseOffset;
        target.material.uniforms.uHover.value = target.hoverValue;
        target.material.uniforms.uScale.value = clamp(linkParam.scale, 0.05, 15.0) * sizeGainRoot;
        target.material.uniforms.uAlpha.value = pointAlpha;
        target.material.uniforms.uVortexSpeed.value = vortexSpeed;
        target.material.uniforms.uSwirlStrength.value = swirlStrength;
        target.material.uniforms.uSphereFill.value = sphereFill;
        target.material.uniforms.uColorSplitSoftness.value = colorSplitSoftness;
        target.material.uniforms.uParticleBrightness.value = particleBrightness;
        target.material.uniforms.uParticleSoftness.value = particleSoftness;
        target.material.uniforms.uCoreSharpness.value = coreSharpness;
        target.material.uniforms.uFluidDrift.value = fluidDrift;
        target.material.uniforms.uPointerBurstStrength.value = pointerBurstStrength;
        target.material.uniforms.uPointerBurstSpread.value = pointerBurstSpread;
        target.material.uniforms.uColorContrast.value = colorContrast;
        if (camera) {
            const distance = camera.position.distanceTo(target.group.position);
            const proximity = clamp01(1.0 - (distance - 8.0) / 22.0);
            target.material.uniforms.uCameraProximity.value = proximity;
        } else {
            target.material.uniforms.uCameraProximity.value = 0.0;
        }
        target.material.uniforms.uColorA.value.copy(target.colorA);
        target.material.uniforms.uColorB.value.copy(target.colorB);

        const orbitPhase = time * orbitSpeed + linkParam.phase + target.phaseOffset;
        const orbitA = Math.max(5.0, Math.abs(linkParam.posX) * linkSpread * 0.28);
        const orbitB = Math.max(2.4, Math.abs(linkParam.posZ) * (0.16 + linkDepthSpread * 0.11));
        const localX = orbitA * (Math.cos(orbitPhase) - 1.0);
        const localZ = orbitB * Math.sin(orbitPhase);
        const cosYaw = Math.cos(target.orbitYaw);
        const sinYaw = Math.sin(target.orbitYaw);
        const orbitX = localX * cosYaw - localZ * sinYaw;
        const orbitZ = localX * sinYaw + localZ * cosYaw;
        const orbitY = gazeY + Math.sin(orbitPhase * 0.5) * (0.2 + floatAmp * 0.8) + floatOffset * 0.05;

        target.group.position.set(orbitX, orbitY, orbitZ);
        target.group.rotation.y = time * yawSpeed + target.phaseOffset;
        target.group.rotation.x = Math.sin(time * tiltSpeed + target.phaseOffset) * tiltAmp;

        const scale = (baseScaleMul + pulse01 * pulseScaleAmp + target.hoverValue * hoverScaleBoost) * sizeGainRoot;
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

function updateBackground({ time, bgMaterial, bgMesh, camera, helpers }) {
    const { backgroundParams, clamp } = helpers;
    if (bgMaterial) {
        bgMaterial.uniforms.uTime.value = time;
        bgMaterial.uniforms.uFlowSpeed.value = clamp(backgroundParams.tubeFlowSpeed, 0.0, 0.4);
        bgMaterial.uniforms.uNoiseScale.value = clamp(backgroundParams.tubeNoiseScale, 0.2, 12.0);
        bgMaterial.uniforms.uWarpStrength.value = clamp(backgroundParams.tubeWarpStrength, 0.0, 2.0);
        bgMaterial.uniforms.uSoftness.value = clamp(backgroundParams.tubeSoftness, 0.01, 1.0);
        bgMaterial.uniforms.uDepthFade.value = clamp(backgroundParams.tubeDepthFade, 0.0, 1.0);
        bgMaterial.uniforms.uBrightness.value = clamp(backgroundParams.tubeBrightness, 0.0, 1.2);
        bgMaterial.uniforms.uSwirl.value = clamp(backgroundParams.tubeSwirl, 0.0, 2.5);
    }

    if (bgMesh) {
        const radiusBase = clamp(backgroundParams.tubeRadius, 20.0, 240.0);
        const radiusFromLength = clamp(backgroundParams.tubeLength * 0.16, 20.0, 240.0);
        bgMesh.scale.setScalar(Math.max(radiusBase, radiusFromLength) * 1.25);
        if (camera) {
            bgMesh.position.copy(camera.position);
        }
    }
}

const api = createSceneModule({
    creationLinkDefs: CREATION_LINK_DEFS,
    createFlowObjects,
    updateFlowObjects,
    createStarMaterial,
    updateStars,
    createHopfPointMaterial,
    decorateCreationLinkTarget,
    updateCreationLinks,
    updateBackground,
});

export const getCreationLinkTargetMeshes = api.getCreationLinkTargetMeshes;
export const createScene = api.createScene;
export const updateScene = api.updateScene;
