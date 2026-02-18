import * as THREE from 'three';
import {
    backgroundParams,
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
let _starFieldGroup;
let _starMaterials = [];

const _fogColor = new THREE.Color();
const _bgCenterA = new THREE.Color();
const _bgCenterB = new THREE.Color();
const _bgEdgeA = new THREE.Color();
const _bgEdgeB = new THREE.Color();

function clamp01(v) {
    return Math.min(1, Math.max(0, v));
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
            uIntensity: { value: 1.0 },
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
                float filaments = smoothstep(0.28, 0.74, band);

                vec3 colorA = vec3(0.11, 0.22, 0.42);
                vec3 colorB = vec3(0.52, 0.74, 1.0);
                vec3 color = mix(colorA, colorB, filaments) * envelope * uIntensity;

                float alpha = filaments * envelope * 0.36;
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
    _starFieldGroup = createStarField();

    scene.add(_fieldMesh);
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
    }

    if (_fieldMesh) {
        _fieldMesh.rotation.z = time * 0.02;
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
