import * as THREE from 'three';
import { createSceneModule } from './core.js';

export { sceneParams } from './core.js';

const FLOW_X_MIN = -150.0;
const FLOW_X_MAX = 150.0;
const FLOW_FULL_HALF_Y = 15.0;
const FLOW_FULL_HALF_Z = 9.0;
const CREATION_GUIDE_MD_BASE_URL = 'https://raw.githubusercontent.com/uminomae/pjdhiro/main/assets/publications/creation/md/guides';
const CREATION_GUIDE_PDF_BASE_URL = 'https://uminomae.github.io/pjdhiro/assets/publications/creation/pdf/guides';
const CREATION_LINK_DEFS = [
    {
        id: 1,
        label: 'Creation Field',
        draftUrl: `${CREATION_GUIDE_MD_BASE_URL}/creation-general-draft.md`,
        sourceUrl: `${CREATION_GUIDE_PDF_BASE_URL}/creation-general.pdf`,
        shape: 'crystal',
        pointCount: 3200,
    },
];

function createFieldMesh(helpers) {
    const { fieldParams } = helpers;
    const material = new THREE.ShaderMaterial({
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

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(120, 120, 1, 1), material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, -8, 0);
    return { fieldMesh: mesh, fieldMaterial: material };
}

function createFlowPointMaterial({ colorA, colorB, blending = THREE.AdditiveBlending }, flowState) {
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
                gl_PointSize = aSize * (400.0 / max(-mvPosition.z, 0.001));
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

                float lum = exp(-r * r * 4.5) * 1.25 * vTwinkle;
                vec3 c = mix(uColorA, uColorB, vTemp) * lum;
                float targetOpacity = mix(uCoreOpacity, uChaosOpacity, vChaosVal);
                float a = clamp(lum * targetOpacity, 0.0, 1.0);
                gl_FragColor = vec4(c, a);
            }
        `,
        transparent: true,
        blending,
        depthWrite: false,
    });

    flowState.materials.push(material);
    return material;
}

function resetSeedParticle(system, i, helpers) {
    const { randRange, flowParams } = helpers;
    const p3 = i * 3;
    const startX = randRange(FLOW_X_MIN, FLOW_X_MIN + 50.0);
    system.positions[p3 + 0] = startX;

    const theta = system.thetas[i];
    const rNorm = system.radiiNorm[i];
    const absX = Math.abs(startX);
    const scale = flowParams.centerThickness + Math.pow(absX / 35.0, 1.5) * 1.5;

    system.positions[p3 + 1] = Math.sin(theta) * rNorm * FLOW_FULL_HALF_Y * scale + randRange(-5, 5);
    system.positions[p3 + 2] = Math.cos(theta) * rNorm * FLOW_FULL_HALF_Z * scale + randRange(-5, 5);
    system.velocities[p3 + 0] = randRange(0.8, 2.0);
    system.velocities[p3 + 1] = 0.0;
    system.velocities[p3 + 2] = 0.0;
}

function createSeedObjects(flowState, helpers) {
    const { randRange } = helpers;
    const seedCount = 420;
    const seedPositions = new Float32Array(seedCount * 3);
    const seedVelocities = new Float32Array(seedCount * 3);
    const seedSizes = new Float32Array(seedCount);
    const seedPhases = new Float32Array(seedCount);
    const seedTemps = new Float32Array(seedCount);
    const seedThetas = new Float32Array(seedCount);
    const seedRadiiNorm = new Float32Array(seedCount);
    const seedChaosVals = new Float32Array(seedCount).fill(0.0);

    for (let i = 0; i < seedCount; i++) {
        seedSizes[i] = randRange(1.4, 3.2);
        seedPhases[i] = Math.random();
        seedTemps[i] = Math.pow(Math.random(), 0.8);
        seedThetas[i] = Math.random() * Math.PI * 2.0;
        seedRadiiNorm[i] = Math.pow(Math.random(), 0.5);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(seedPositions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(seedSizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(seedPhases, 1));
    geometry.setAttribute('aTemp', new THREE.BufferAttribute(seedTemps, 1));
    geometry.setAttribute('aChaosVal', new THREE.BufferAttribute(seedChaosVals, 1));

    const material = createFlowPointMaterial({
        colorA: new THREE.Color(0.42, 0.66, 0.95),
        colorB: new THREE.Color(0.86, 0.94, 1.0),
    }, flowState);
    material.userData.kind = 'seed';

    const points = new THREE.Points(geometry, material);
    flowState.seedSystem = {
        points,
        positions: seedPositions,
        velocities: seedVelocities,
        thetas: seedThetas,
        radiiNorm: seedRadiiNorm,
        count: seedCount,
    };

    for (let i = 0; i < seedCount; i++) {
        resetSeedParticle(flowState.seedSystem, i, helpers);
    }
    geometry.attributes.position.needsUpdate = true;
    return points;
}

function createFilamentObjects(flowState, helpers) {
    const { randRange } = helpers;
    const filamentCount = 620;
    const filamentPositions = new Float32Array(filamentCount * 3);
    const filamentSizes = new Float32Array(filamentCount);
    const filamentPhases = new Float32Array(filamentCount);
    const filamentTemps = new Float32Array(filamentCount);
    const filamentThetas = new Float32Array(filamentCount);
    const filamentRadii = new Float32Array(filamentCount);
    const filamentSpeeds = new Float32Array(filamentCount);
    const filamentWobbles = new Float32Array(filamentCount);
    const filamentChaosVals = new Float32Array(filamentCount).fill(0.0);

    for (let i = 0; i < filamentCount; i++) {
        filamentSizes[i] = randRange(1.7, 4.5);
        filamentPhases[i] = Math.random();
        filamentTemps[i] = Math.random();
        filamentThetas[i] = Math.random() * Math.PI * 2.0;
        filamentRadii[i] = Math.pow(Math.random(), 0.7);
        filamentSpeeds[i] = randRange(0.09, 0.17);
        filamentWobbles[i] = randRange(0.75, 1.25);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(filamentPositions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(filamentSizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(filamentPhases, 1));
    geometry.setAttribute('aTemp', new THREE.BufferAttribute(filamentTemps, 1));
    geometry.setAttribute('aChaosVal', new THREE.BufferAttribute(filamentChaosVals, 1));

    const material = createFlowPointMaterial({
        colorA: new THREE.Color(0.45, 0.78, 1.0),
        colorB: new THREE.Color(0.88, 0.98, 1.0),
    }, flowState);
    material.userData.kind = 'filament';

    const points = new THREE.Points(geometry, material);
    flowState.filamentSystem = {
        points,
        positions: filamentPositions,
        thetas: filamentThetas,
        radiiNorm: filamentRadii,
        phases: filamentPhases,
        speeds: filamentSpeeds,
        wobbles: filamentWobbles,
        count: filamentCount,
    };

    return points;
}

function createPlasmaObjects(flowState, helpers) {
    const { randRange, plasmaParams } = helpers;
    const group = new THREE.Group();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const temps = new Float32Array(count);
    const chaosVals = new Float32Array(count);
    const angles = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const u = Math.pow(Math.random(), 2.0);
        angles[i * 3 + 0] = Math.PI / 4.0 + (Math.random() - 0.5) * 0.45 * (1.0 - u * 0.5);
        angles[i * 3 + 1] = u;
        angles[i * 3 + 2] = Math.random() * Math.PI * 2.0;

        sizes[i] = randRange(2.5, 7.5) * (1.1 - u);
        phases[i] = Math.random();
        chaosVals[i] = 0.0;
        temps[i] = i % 2 === 0 ? 0.0 : 1.0;
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
        blending: THREE.NormalBlending,
    }, flowState);
    material.userData.kind = 'plasma';

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    group.add(points);

    flowState.plasmaSystem = {
        points,
        positions,
        angles,
        chaosVals,
        count,
    };

    return group;
}

function createFlowObjects({ helpers }) {
    const flowState = {
        group: new THREE.Group(),
        fieldMesh: null,
        fieldMaterial: null,
        materials: [],
        seedSystem: null,
        filamentSystem: null,
        plasmaSystem: null,
        lastFlowTime: 0,
    };

    const field = createFieldMesh(helpers);
    flowState.fieldMesh = field.fieldMesh;
    flowState.fieldMaterial = field.fieldMaterial;
    flowState.group.add(createSeedObjects(flowState, helpers));
    flowState.group.add(createFilamentObjects(flowState, helpers));
    flowState.group.add(createPlasmaObjects(flowState, helpers));
    return flowState;
}

function updateSeedParticles(dtScale, time, flowState, helpers) {
    const { flowParams, creationLinkParams, randRange } = helpers;
    const { seedSystem } = flowState;
    if (!seedSystem) return;

    const chaos = flowParams.chaos;
    const drift = flowParams.seedDrift;
    const tight = flowParams.bundleTightness;
    const safeDtScale = Math.min(dtScale * (flowParams.speed ?? 1.0), 3.0);

    const hopfX = creationLinkParams.link1PosX;
    const hopfY = creationLinkParams.link1PosY;
    const hopfZ = creationLinkParams.link1PosZ;

    for (let i = 0; i < seedSystem.count; i++) {
        const p3 = i * 3;
        let x = seedSystem.positions[p3 + 0];
        let y = seedSystem.positions[p3 + 1];
        let z = seedSystem.positions[p3 + 2];
        let vx = seedSystem.velocities[p3 + 0];
        let vy = seedSystem.velocities[p3 + 1];
        let vz = seedSystem.velocities[p3 + 2];

        const theta = seedSystem.thetas[i];
        const rNorm = seedSystem.radiiNorm[i];
        const absX = Math.abs(x - hopfX);
        const scale = flowParams.centerThickness + Math.pow(absX / 20.0, 2.5) * 2.0;

        const targetY = hopfY + Math.sin(theta) * rNorm * FLOW_FULL_HALF_Y * scale;
        const targetZ = hopfZ + Math.cos(theta) * rNorm * FLOW_FULL_HALF_Z * scale;
        const pullStrength = 0.005 + 4.0 / (absX + 5.0);
        const stabilize = x > hopfX ? 2.5 : 1.0;

        vy += (targetY - y) * pullStrength * safeDtScale * tight * stabilize;
        vz += (targetZ - z) * pullStrength * safeDtScale * tight * stabilize;

        const xAccel = 0.04 + 10.0 / (absX + 10.0);
        vx += (xAccel * drift - vx) * 0.1 * safeDtScale;

        let pinchChaos = 0.0;
        if (x < hopfX) {
            pinchChaos = chaos * Math.max(0.0, 1.0 - absX / 30.0);
        } else {
            pinchChaos = chaos * Math.max(0.0, 1.0 - absX / 8.0);
        }

        if (pinchChaos > 0.001) {
            vy += randRange(-0.04, 0.04) * pinchChaos * safeDtScale;
            vz += randRange(-0.04, 0.04) * pinchChaos * safeDtScale;
        }

        const damping = Math.pow(0.92, safeDtScale);
        vx *= damping;
        vy *= damping;
        vz *= damping;

        x += vx * safeDtScale;
        y += vy * safeDtScale;
        z += vz * safeDtScale;

        if (x > FLOW_X_MAX) {
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

function updateFilamentParticles(dtScale, time, flowState, helpers) {
    const { flowParams, creationLinkParams, lerp } = helpers;
    const { filamentSystem } = flowState;
    if (!filamentSystem) return;

    const hopfX = creationLinkParams.link1PosX;
    const hopfY = creationLinkParams.link1PosY;
    const hopfZ = creationLinkParams.link1PosZ;

    for (let i = 0; i < filamentSystem.count; i++) {
        const p3 = i * 3;
        const thetaBase = filamentSystem.thetas[i];
        const rNorm = filamentSystem.radiiNorm[i];
        const phase = filamentSystem.phases[i];
        const speed = filamentSystem.speeds[i];
        const wobble = filamentSystem.wobbles[i];
        const globalSpeed = flowParams.speed ?? 1.0;

        const progress = (phase + time * speed * flowParams.seedDrift * 0.1 * globalSpeed) % 1.0;
        const x = lerp(FLOW_X_MIN, FLOW_X_MAX, progress);
        const absX = Math.abs(x - hopfX);
        const scale = flowParams.centerThickness + Math.pow(absX / 20.0, 2.5) * 2.0;

        let wobbleMult = 0.0;
        if (x < hopfX) {
            wobbleMult = absX < 40.0 ? (1.0 - absX / 40.0) : 0.0;
        } else {
            wobbleMult = absX < 10.0 ? (1.0 - absX / 10.0) : 0.0;
        }
        const twistWobble = Math.sin(time * 3.5 + i) * wobble * flowParams.chaos * wobbleMult;
        const theta = thetaBase + twistWobble;

        filamentSystem.positions[p3 + 0] = x;
        filamentSystem.positions[p3 + 1] = hopfY + Math.sin(theta) * rNorm * FLOW_FULL_HALF_Y * scale;
        filamentSystem.positions[p3 + 2] = hopfZ + Math.cos(theta) * rNorm * FLOW_FULL_HALF_Z * scale;
    }

    filamentSystem.points.geometry.attributes.position.needsUpdate = true;
}

function updatePlasmaObjects(time, flowState, helpers) {
    const { plasmaSystem } = flowState;
    const { toggles, plasmaParams, creationLinkParams } = helpers;
    if (!plasmaSystem || !toggles.showPlasma) {
        if (plasmaSystem) plasmaSystem.points.visible = false;
        return;
    }
    plasmaSystem.points.visible = true;

    const speed = Number.isNaN(plasmaParams.speed) ? 0.5 : plasmaParams.speed;
    const baseChaos = Number.isNaN(plasmaParams.chaos) ? 0.0 : plasmaParams.chaos;
    const maxRadius = Number.isNaN(plasmaParams.radius) ? 12.0 : plasmaParams.radius;
    const heightRatio = Number.isNaN(plasmaParams.heightRatio) ? 1.0 : plasmaParams.heightRatio;
    const autoChaosAmp = Number.isNaN(plasmaParams.autoChaosAmp) ? 30.0 : Math.max(0.0, plasmaParams.autoChaosAmp);
    const wSeparation = Number.isNaN(plasmaParams.wSeparation) ? 0.35 : Math.max(0.0, plasmaParams.wSeparation);
    const projectionScale = Number.isNaN(plasmaParams.projectionScale) ? 0.4 : Math.max(0.01, plasmaParams.projectionScale);

    const autoChaos = Math.max(0.0, -Math.sin(time * 0.4)) * autoChaosAmp;
    const chaos = baseChaos + autoChaos;

    const hopfX = Number.isNaN(creationLinkParams.link1PosX) ? 0 : creationLinkParams.link1PosX;
    const hopfY = Number.isNaN(creationLinkParams.link1PosY) ? 0 : creationLinkParams.link1PosY;
    const hopfZ = Number.isNaN(creationLinkParams.link1PosZ) ? 0 : creationLinkParams.link1PosZ;

    for (let i = 0; i < plasmaSystem.count; i++) {
        const p3 = i * 3;
        const alpha = plasmaSystem.angles[p3 + 0];
        const u = plasmaSystem.angles[p3 + 1];
        const randomOffset = plasmaSystem.angles[p3 + 2];
        const isYang = i % 2 !== 0;

        const evolution = time * speed;
        const headAngle = evolution + (isYang ? Math.PI : 0.0);
        let gamma = headAngle - u * Math.PI * 1.5;
        let beta = time * speed * 2.0 + randomOffset;

        const turbulence = chaos * 0.05 * Math.sin(gamma * 3.0 + i * 0.01 + time * speed);
        beta += turbulence;
        gamma -= turbulence;

        const X = Math.sin(alpha) * Math.cos(beta);
        const Y = Math.sin(alpha) * Math.sin(beta);
        const Z = Math.cos(alpha) * Math.cos(gamma);
        const W = Math.cos(alpha) * Math.sin(gamma);

        const wOffset = isYang ? wSeparation : -wSeparation;
        const dynamicWOffset = wOffset * (1.0 - Math.min(1.0, chaos / 20.0));
        const denom = (1.0 - (W + dynamicWOffset)) + 0.01;

        let dx = (X / denom) * (maxRadius * projectionScale);
        let dy = (Y / denom) * (maxRadius * projectionScale);
        let dz = (Z / denom) * (maxRadius * projectionScale);

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const maxSpread = maxRadius * (1.0 + chaos * 0.15);
        const mappedDist = Math.atan(dist / (maxRadius * 0.5)) * (2.0 / Math.PI) * maxSpread;

        if (dist > 0.0001) {
            const factor = mappedDist / dist;
            dx *= factor;
            dy *= factor;
            dz *= factor;
        }

        let chaosVal = 0.0;
        if (mappedDist > maxRadius * 0.8) {
            chaosVal = Math.min(1.0, (mappedDist - maxRadius * 0.8) / (maxRadius * 0.5));
        } else if (chaos > 0.1) {
            chaosVal = Math.min(1.0, chaos / 30.0);
        }

        plasmaSystem.chaosVals[i] = chaosVal;
        dy *= heightRatio;

        plasmaSystem.positions[p3 + 0] = hopfX + dx;
        plasmaSystem.positions[p3 + 1] = hopfY + dy;
        plasmaSystem.positions[p3 + 2] = hopfZ + dz;
    }

    plasmaSystem.points.geometry.attributes.position.needsUpdate = true;
    plasmaSystem.points.geometry.attributes.aChaosVal.needsUpdate = true;
}

function updateFlowObjects({ time, flowState, helpers }) {
    const dt = flowState.lastFlowTime > 0 ? Math.min(0.05, Math.max(0.001, time - flowState.lastFlowTime)) : 0.016;
    flowState.lastFlowTime = time;
    const dtScale = dt * 60.0;

    updateSeedParticles(dtScale, time, flowState, helpers);
    updateFilamentParticles(dtScale, time, flowState, helpers);
    updatePlasmaObjects(time, flowState, helpers);

    flowState.materials.forEach((material) => {
        material.uniforms.uTime.value = time;
        if (material.userData.kind === 'seed') {
            material.uniforms.uCoreOpacity.value = helpers.flowParams.seedOpacity;
            material.uniforms.uChaosOpacity.value = helpers.flowParams.seedOpacity;
        } else if (material.userData.kind === 'plasma') {
            material.uniforms.uCoreOpacity.value = helpers.plasmaParams.coreOpacity;
            material.uniforms.uChaosOpacity.value = helpers.plasmaParams.chaosOpacity;
            material.uniforms.uColorA.value.copy(helpers.plasmaParams.colorA);
            material.uniforms.uColorB.value.copy(helpers.plasmaParams.colorB);
        } else {
            material.uniforms.uCoreOpacity.value = helpers.flowParams.filamentOpacity;
            material.uniforms.uChaosOpacity.value = helpers.flowParams.filamentOpacity;
        }
    });
}

function createStarMaterial() {
    return new THREE.ShaderMaterial({
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

                float lum = exp(-r * r * 5.0) * 1.5 * vTwinkle;
                vec3 cold = vec3(0.60, 0.76, 1.00);
                vec3 warm = vec3(0.84, 0.88, 0.93);
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
}

function updateStars({ time, starFieldGroup, starMaterials, helpers }) {
    const { toggles } = helpers;
    if (starMaterials.length > 0) {
        const starOpacity = toggles.background ? 0.8 : 0.0;
        starMaterials.forEach((material, index) => {
            material.uniforms.uTime.value = time + index * 0.7;
            material.uniforms.uOpacity.value = starOpacity;
        });
    }

    if (starFieldGroup) {
        starFieldGroup.visible = toggles.background;
        if (toggles.background) {
            starFieldGroup.rotation.y = time * 0.018;
            starFieldGroup.rotation.x = Math.sin(time * 0.16) * 0.035;
        }
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

function updateCreationLinks({ time, creationLinkTargets, camera, helpers }) {
    const { creationLinkParams, clamp, clamp01, getCreationLinkParam, lerp } = helpers;

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
        if (camera) {
            const distance = camera.position.distanceTo(target.group.position);
            const proximity = clamp01(1.0 - (distance - 8.0) / 22.0);
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

function updateSceneExtras({ time, fieldMaterial, fieldMesh, helpers }) {
    const { fieldParams, toggles } = helpers;
    if (fieldMaterial) {
        fieldMaterial.uniforms.uTime.value = time;
        fieldMaterial.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
        fieldMaterial.uniforms.uIntensity.value = fieldParams.intensity;
        fieldMaterial.uniforms.uAlpha.value = fieldParams.alpha;
        fieldMaterial.uniforms.uLineLow.value = fieldParams.lineLow;
        fieldMaterial.uniforms.uLineHigh.value = fieldParams.lineHigh;
        fieldMaterial.uniforms.uBottomClip.value = fieldParams.bottomClip;
        fieldMaterial.uniforms.uBottomFeather.value = fieldParams.bottomFeather;
        fieldMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }

    if (fieldMesh) {
        fieldMesh.visible = toggles.field;
        if (toggles.field) {
            fieldMesh.rotation.z = time * 0.02;
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
    updateCreationLinks,
    updateSceneExtras,
});

export const getCreationLinkTargetMeshes = api.getCreationLinkTargetMeshes;
export const createScene = api.createScene;
export const updateScene = api.updateScene;
