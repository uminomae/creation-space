import * as THREE from 'three';
import {
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
let _particleCloud;

const _fogColor = new THREE.Color();

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

function createParticleCloud() {
    const count = 1800;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const r = 18 + Math.random() * 38;
        const a = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 28;
        positions[i * 3 + 0] = Math.cos(a) * r;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(a) * r;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x8fb5ff,
        size: 0.12,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    points.position.y = -8;
    return points;
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
    _particleCloud = createParticleCloud();

    scene.add(_fieldMesh);
    scene.add(_particleCloud);

    return { scene, camera, renderer };
}

export function updateScene(time) {
    const m = (Math.sin(time * Math.PI / sceneParams.mixCycle) + 1.0) * 0.5;

    if (toggles.background && _bgMaterial) {
        _bgMaterial.uniforms.uMix.value = m;
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

    if (_particleCloud) {
        _particleCloud.rotation.y = time * 0.05;
        _particleCloud.rotation.x = Math.sin(time * 0.2) * 0.08;
    }
}
