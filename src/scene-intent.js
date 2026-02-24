import * as THREE from 'three';
import { sceneParams } from './config.js';
import { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR, CAMERA_LOOK_AT_Z } from './constants.js';

const OVERLAY_DISTANCE = 6.0;
const COVERAGE_SCALE = 1.06;
const MOBILE_STEP_LIMIT = 48;
const DESKTOP_STEP_LIMIT = 74;
const BREATH_PERIOD = 8.0;

const CONSCIOUSNESS_PARAMS = {
    csFlowSpeed: 0.21,
    csFreqLow: 2.5,
    csFreqHigh: 1.0,
    csThicknessLow: 0.095,
    csThicknessHigh: 0.17,
    csEnvelopeRadius: 2.44,
    csDensityGain: 0.2,
    csStepNear: 0.084,
    csStepFar: 0.215,
    csGateTint: 0.88,
    csVignette: 0.01,
    csMouseParallax: 0.0,
    csLightBoost: 1.55,
    csPreGamma: 2.04,
    csExposure: 2.45,
    csCoolR: 0.12,
    csCoolG: 0.2,
    csCoolB: 0.68,
    csWarmR: 1.0,
    csWarmG: 0.96,
    csWarmB: 0.96,
    csGateR: 1.3,
    csGateG: 0.9,
    csGateB: 0.2,
};

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uBreath;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uMaxSteps;
uniform float uFar;
uniform float uDetail;
uniform float uCsFlowSpeed;
uniform float uCsFreqLow;
uniform float uCsFreqHigh;
uniform float uCsThicknessLow;
uniform float uCsThicknessHigh;
uniform float uCsEnvelopeRadius;
uniform float uCsDensityGain;
uniform float uCsStepNear;
uniform float uCsStepFar;
uniform float uCsGateTint;
uniform float uCsVignette;
uniform float uCsMouseParallax;
uniform float uCsLightBoost;
uniform float uCsPreGamma;
uniform float uCsExposure;
uniform float uCsCoolR;
uniform float uCsCoolG;
uniform float uCsCoolB;
uniform float uCsWarmR;
uniform float uCsWarmG;
uniform float uCsWarmB;
uniform float uCsGateR;
uniform float uCsGateG;
uniform float uCsGateB;

float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

mat2 rot2(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float gyroid(vec3 p) {
    return dot(sin(p), cos(p.yzx));
}

float getDensity(vec3 p, float progress, float breath, float detail01) {
    vec3 q = p;

    q.xy *= rot2(p.z * 0.24 + uTime * 0.12);
    q.x -= uTime * uCsFlowSpeed;

    vec2 axisCurve = vec2(
        0.24 * sin(p.x * 0.66 + uTime * 0.31),
        0.18 * cos(p.x * 0.53 - uTime * 0.28)
    );
    q.yz -= axisCurve;

    float frequency = mix(uCsFreqLow, uCsFreqHigh, progress) + detail01 * 0.45;
    float g0 = gyroid(q * frequency);
    float g1 = gyroid((q + vec3(1.2, -0.8, 0.5)) * (frequency * 1.35));
    float field = g0 * 0.74 + g1 * 0.26;

    float thickness = mix(uCsThicknessLow, uCsThicknessHigh, progress) * (1.0 + breath * 0.38);
    float membrane = 1.0 - smoothstep(0.0, thickness, abs(field));

    float radial = length(q.yz);
    float shell = exp(-3.6 * radial * radial) * (0.22 + 0.46 * progress);

    return membrane * 0.82 + shell * 0.18;
}

void main() {
    vec2 uv = (vUv * 2.0 - 1.0);
    float aspect = max(uResolution.x / max(uResolution.y, 1.0), 0.0001);
    uv.x *= aspect;

    vec2 mouseN = (uMouse * 2.0 - 1.0) * vec2(aspect, 1.0);
    float breath = clamp(uBreath, 0.0, 1.0);
    float detail01 = clamp(uDetail * 60.0, 0.0, 1.0);

    vec3 ro = vec3(0.0, 0.0, 3.5);
    vec3 rd = normalize(vec3(uv, -1.8));
    rd.xy += mouseN * uCsMouseParallax;
    rd = normalize(rd);

    vec3 col = vec3(0.0);
    float transmittance = 1.0;
    float t = hash21(gl_FragCoord.xy + vec2(uTime * 17.0, uTime * 11.0)) * 0.08;

    for (int i = 0; i < 96; i++) {
        if (float(i) >= uMaxSteps) break;

        vec3 p = ro + rd * t;
        float progress = smoothstep(-2.5, 2.5, p.x);
        float radial = length(p.yz);

        float envelope = smoothstep(uCsEnvelopeRadius, 0.08, radial);
        envelope *= smoothstep(-3.0, -1.75, p.x);
        envelope *= 1.0 - smoothstep(4.35, 5.75, p.x);

        if (envelope > 0.0005) {
            float dens = getDensity(p, progress, breath, detail01) * envelope;
            if (dens > 0.0004) {
                vec3 colorA = vec3(uCsCoolR, uCsCoolG, uCsCoolB);
                vec3 colorB = vec3(uCsWarmR, uCsWarmG, uCsWarmB);
                vec3 gateColor = vec3(uCsGateR, uCsGateG, uCsGateB);
                vec3 tint = mix(colorA, colorB, pow(progress, 1.05));

                float gate = 1.0 - abs(progress - 0.5) * 2.0;
                gate = max(gate, 0.0);
                tint += gateColor * gate * gate * uCsGateTint;

                float focus = smoothstep(0.78, 0.06, length(p.xy - mouseN * 0.5));
                tint += vec3(0.1, 0.14, 0.2) * focus * 0.35;

                float breathLight = 0.86 + 0.3 * breath;
                float weight = dens * breathLight * uCsDensityGain * uCsLightBoost;
                float stepAlpha = clamp(weight, 0.0, 0.34);

                col += tint * stepAlpha * transmittance;
                transmittance *= (1.0 - stepAlpha);
                if (transmittance < 0.024) break;
            }
        }

        float stepNear = min(uCsStepNear, uCsStepFar);
        float stepFar = max(uCsStepNear, uCsStepFar);
        float stepLen = mix(stepNear, stepFar, 1.0 - envelope);
        stepLen = mix(stepLen, 0.06, detail01 * 0.5);
        t += stepLen;
        if (t > uFar) break;
    }

    float alpha = 1.0 - transmittance;
    alpha = smoothstep(0.0, 0.85, alpha);
    if (alpha < 0.01) discard;

    col = pow(col, vec3(uCsPreGamma));
    col = 1.0 - exp(-col * uCsExposure);
    float vignette = 1.0 - dot(uv, uv) * uCsVignette;
    col *= vignette;
    alpha *= vignette;

    if (alpha < 0.012) discard;
    gl_FragColor = vec4(col, min(alpha, 0.96));
}
`;

let _scene;
let _camera;
let _mesh;
let _material;
let _pointerListenerBound = false;

const _mouse = new THREE.Vector2(0.5, 0.5);
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _position = new THREE.Vector3();

function clamp01(value) {
    return Math.min(1.0, Math.max(0.0, value));
}

function detectStepLimit() {
    const shortEdge = Math.min(window.innerWidth || 0, window.innerHeight || 0);
    return shortEdge > 0 && shortEdge < 900 ? MOBILE_STEP_LIMIT : DESKTOP_STEP_LIMIT;
}

function bindPointerTracking() {
    if (_pointerListenerBound) return;
    _pointerListenerBound = true;

    window.addEventListener('mousemove', (event) => {
        _mouse.x = clamp01(event.clientX / Math.max(window.innerWidth, 1));
        _mouse.y = clamp01(1.0 - (event.clientY / Math.max(window.innerHeight, 1)));
    });

    window.addEventListener('touchmove', (event) => {
        if (!event.touches || event.touches.length === 0) return;
        const touch = event.touches[0];
        _mouse.x = clamp01(touch.clientX / Math.max(window.innerWidth, 1));
        _mouse.y = clamp01(1.0 - (touch.clientY / Math.max(window.innerHeight, 1)));
    }, { passive: true });
}

function createConsciousnessMaterial() {
    return new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uBreath: { value: 0.5 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uMaxSteps: { value: detectStepLimit() },
            uFar: { value: 12.0 },
            uDetail: { value: 0.0045 },
            uCsFlowSpeed: { value: CONSCIOUSNESS_PARAMS.csFlowSpeed },
            uCsFreqLow: { value: CONSCIOUSNESS_PARAMS.csFreqLow },
            uCsFreqHigh: { value: CONSCIOUSNESS_PARAMS.csFreqHigh },
            uCsThicknessLow: { value: CONSCIOUSNESS_PARAMS.csThicknessLow },
            uCsThicknessHigh: { value: CONSCIOUSNESS_PARAMS.csThicknessHigh },
            uCsEnvelopeRadius: { value: CONSCIOUSNESS_PARAMS.csEnvelopeRadius },
            uCsDensityGain: { value: CONSCIOUSNESS_PARAMS.csDensityGain },
            uCsStepNear: { value: CONSCIOUSNESS_PARAMS.csStepNear },
            uCsStepFar: { value: CONSCIOUSNESS_PARAMS.csStepFar },
            uCsGateTint: { value: CONSCIOUSNESS_PARAMS.csGateTint },
            uCsVignette: { value: CONSCIOUSNESS_PARAMS.csVignette },
            uCsMouseParallax: { value: CONSCIOUSNESS_PARAMS.csMouseParallax },
            uCsLightBoost: { value: CONSCIOUSNESS_PARAMS.csLightBoost },
            uCsPreGamma: { value: CONSCIOUSNESS_PARAMS.csPreGamma },
            uCsExposure: { value: CONSCIOUSNESS_PARAMS.csExposure },
            uCsCoolR: { value: CONSCIOUSNESS_PARAMS.csCoolR },
            uCsCoolG: { value: CONSCIOUSNESS_PARAMS.csCoolG },
            uCsCoolB: { value: CONSCIOUSNESS_PARAMS.csCoolB },
            uCsWarmR: { value: CONSCIOUSNESS_PARAMS.csWarmR },
            uCsWarmG: { value: CONSCIOUSNESS_PARAMS.csWarmG },
            uCsWarmB: { value: CONSCIOUSNESS_PARAMS.csWarmB },
            uCsGateR: { value: CONSCIOUSNESS_PARAMS.csGateR },
            uCsGateG: { value: CONSCIOUSNESS_PARAMS.csGateG },
            uCsGateB: { value: CONSCIOUSNESS_PARAMS.csGateB },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide,
    });
}

export function getCreationLinkTargetMeshes() {
    return [];
}

export function createScene(container) {
    const scene = new THREE.Scene();
    _scene = scene;
    scene.fog = null;
    scene.background = new THREE.Color(0x02050d);

    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, aspect, CAMERA_NEAR, CAMERA_FAR);
    camera.position.set(sceneParams.camX, sceneParams.camY, sceneParams.camZ);
    camera.lookAt(0, sceneParams.camTargetY, CAMERA_LOOK_AT_Z);
    _camera = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    _material = createConsciousnessMaterial();
    _mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), _material);
    _mesh.renderOrder = 1000;
    _mesh.frustumCulled = false;
    _scene.add(_mesh);

    bindPointerTracking();
    return { scene, camera, renderer };
}

export function updateScene(time) {
    if (!_mesh || !_camera || !_material) return;

    const breath = 0.5 + 0.5 * Math.sin((time * Math.PI * 2.0) / BREATH_PERIOD);
    const uniforms = _material.uniforms;

    uniforms.uTime.value = time;
    uniforms.uBreath.value = breath;
    uniforms.uMouse.value.copy(_mouse);
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    uniforms.uMaxSteps.value = detectStepLimit();

    if (!_camera.isPerspectiveCamera) return;

    const aspect = Math.max(_camera.aspect || 1.0, 0.0001);
    const fovRad = THREE.MathUtils.degToRad(_camera.fov || CAMERA_FOV);
    const viewportHeight = 2.0 * Math.tan(fovRad * 0.5) * OVERLAY_DISTANCE;
    const viewportWidth = viewportHeight * aspect;
    const breathScale = 0.995 + clamp01(breath) * 0.02;

    _forward.set(0, 0, -1).applyQuaternion(_camera.quaternion).normalize();
    _right.set(1, 0, 0).applyQuaternion(_camera.quaternion).normalize();
    _up.set(0, 1, 0).applyQuaternion(_camera.quaternion).normalize();

    const cursorOffsetX = (_mouse.x - 0.5) * viewportWidth * 0.06;
    const cursorOffsetY = (_mouse.y - 0.5) * viewportHeight * 0.06;

    _position.copy(_camera.position).addScaledVector(_forward, OVERLAY_DISTANCE);
    _position.addScaledVector(_right, cursorOffsetX);
    _position.addScaledVector(_up, -cursorOffsetY);

    _mesh.position.copy(_position);
    _mesh.quaternion.copy(_camera.quaternion);
    _mesh.scale.set(
        viewportWidth * COVERAGE_SCALE * breathScale,
        viewportHeight * COVERAGE_SCALE * breathScale,
        1.0
    );
}
