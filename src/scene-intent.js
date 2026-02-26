import * as THREE from 'three';
import { breathConfig, intentConsciousnessParams, intentMotionParams, sceneParams } from './config.js';
import { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR, CAMERA_LOOK_AT_Z } from './constants.js';
import {
    computeIntentRuntimeTimeline,
    resolveIntentLoopAnchorSec,
    resolveIntentLoopDriftSec,
} from './intent-timeline.js';

const INTENT_SHORT_EDGE_BREAKPOINT = 900;

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
uniform float uLoopEnabled;
uniform float uLoopSin;
uniform float uLoopCos;
uniform float uLoopAnchorSec;
uniform float uLoopDriftSec;
uniform float uBreath;
uniform vec2 uResolution;
uniform float uMaxSteps;
uniform float uFar;
uniform float uDetail;
uniform float uCamYaw;
uniform float uCamPitch;
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

float resolveTimeSec() {
    if (uLoopEnabled < 0.5) return uTime;
    float sin2 = 2.0 * uLoopSin * uLoopCos;
    float cos2 = uLoopCos * uLoopCos - uLoopSin * uLoopSin;
    float orbit = uLoopSin * uLoopDriftSec
        + sin2 * uLoopDriftSec * 0.35
        + cos2 * uLoopDriftSec * 0.2;
    return uLoopAnchorSec + orbit;
}

float getDensity(vec3 p, float progress, float breath, float detail01, float timeSec) {
    vec3 q = p;
    q.xy *= rot2(p.z * 0.24 + timeSec * 0.12);
    q.x -= timeSec * uCsFlowSpeed;

    vec2 axisCurve = vec2(
        0.24 * sin(p.x * 0.66 + timeSec * 0.31),
        0.18 * cos(p.x * 0.53 - timeSec * 0.28)
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

    float breath = clamp(uBreath, 0.0, 1.0);
    float detail01 = clamp(uDetail * 60.0, 0.0, 1.0);

    vec3 ro = vec3(0.0, 0.0, 3.5);
    vec3 rd = normalize(vec3(uv, -1.8));
    rd.xz = rot2(uCamYaw) * rd.xz;
    rd.yz = rot2(uCamPitch) * rd.yz;
    ro.xz = rot2(uCamYaw) * ro.xz;
    ro.yz = rot2(uCamPitch) * ro.yz;
    rd = normalize(rd);

    vec3 col = vec3(0.0);
    float transmittance = 1.0;
    float timeSec = resolveTimeSec();
    float t = hash21(gl_FragCoord.xy + vec2(timeSec * 17.0, timeSec * 11.0)) * 0.08;

    for (int i = 0; i < 64; i++) {
        if (float(i) >= uMaxSteps) break;

        vec3 p = ro + rd * t;
        float progress = smoothstep(-2.5, 2.5, p.x);
        float radial = length(p.yz);

        float envelope = smoothstep(uCsEnvelopeRadius, 0.08, radial);
        envelope *= smoothstep(-3.0, -1.75, p.x);
        envelope *= 1.0 - smoothstep(4.35, 5.75, p.x);

        if (envelope > 0.0005) {
            float dens = getDensity(p, progress, breath, detail01, timeSec) * envelope;
            if (dens > 0.0004) {
                vec3 colorA = vec3(uCsCoolR, uCsCoolG, uCsCoolB);
                vec3 colorB = vec3(uCsWarmR, uCsWarmG, uCsWarmB);
                vec3 gateColor = vec3(uCsGateR, uCsGateG, uCsGateB);
                vec3 tint = mix(colorA, colorB, pow(progress, 1.05));

                float gate = 1.0 - abs(progress - 0.5) * 2.0;
                gate = max(gate, 0.0);
                tint += gateColor * gate * gate * uCsGateTint;

                float focus = smoothstep(0.78, 0.06, length(p.xy));
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
let _renderer;
let _mesh;
let _material;
let _lastPixelRatio = null;

const _forward = new THREE.Vector3();
const _position = new THREE.Vector3();
const _cameraEuler = new THREE.Euler(0, 0, 0, 'YXZ');

function clamp01(value) {
    return Math.min(1.0, Math.max(0.0, value));
}

function finiteOr(value, fallback) {
    return Number.isFinite(value) ? value : fallback;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function detectStepLimit() {
    const mobileSteps = Math.max(8, Math.round(finiteOr(intentConsciousnessParams.maxStepsMobile, 34)));
    const desktopSteps = Math.max(8, Math.round(finiteOr(intentConsciousnessParams.maxStepsDesktop, 52)));
    const shortEdge = Math.min(window.innerWidth || 0, window.innerHeight || 0);
    return shortEdge > 0 && shortEdge < INTENT_SHORT_EDGE_BREAKPOINT ? mobileSteps : desktopSteps;
}

function resolveRenderPixelRatio() {
    const deviceRatio = finiteOr(window.devicePixelRatio, 1.0);
    const ratioCap = clamp(finiteOr(intentConsciousnessParams.renderPixelRatioCap, 1.4), 0.5, 2.0);
    const scale = clamp(finiteOr(intentConsciousnessParams.renderScale, 0.9), 0.5, 1.0);
    return Math.max(0.5, Math.min(deviceRatio, ratioCap) * scale);
}

function syncRendererQuality() {
    if (!_renderer) return;
    const nextPixelRatio = resolveRenderPixelRatio();
    if (_lastPixelRatio !== null && Math.abs(nextPixelRatio - _lastPixelRatio) < 0.001) return;
    _renderer.setPixelRatio(nextPixelRatio);
    _renderer.setSize(window.innerWidth, window.innerHeight);
    _lastPixelRatio = nextPixelRatio;
}

function syncConsciousnessUniforms(uniforms) {
    uniforms.uFar.value = Math.max(0.5, finiteOr(intentConsciousnessParams.far, 12.0));
    uniforms.uDetail.value = Math.max(0.0001, finiteOr(intentConsciousnessParams.detail, 0.0045));
    uniforms.uCsFlowSpeed.value = finiteOr(intentConsciousnessParams.csFlowSpeed, 0.21);
    uniforms.uCsFreqLow.value = finiteOr(intentConsciousnessParams.csFreqLow, 2.5);
    uniforms.uCsFreqHigh.value = finiteOr(intentConsciousnessParams.csFreqHigh, 1.0);
    uniforms.uCsThicknessLow.value = finiteOr(intentConsciousnessParams.csThicknessLow, 0.095);
    uniforms.uCsThicknessHigh.value = finiteOr(intentConsciousnessParams.csThicknessHigh, 0.17);
    uniforms.uCsEnvelopeRadius.value = finiteOr(intentConsciousnessParams.csEnvelopeRadius, 2.44);
    uniforms.uCsDensityGain.value = finiteOr(intentConsciousnessParams.csDensityGain, 0.2);
    uniforms.uCsStepNear.value = finiteOr(intentConsciousnessParams.csStepNear, 0.084);
    uniforms.uCsStepFar.value = finiteOr(intentConsciousnessParams.csStepFar, 0.215);
    uniforms.uCsGateTint.value = finiteOr(intentConsciousnessParams.csGateTint, 0.88);
    uniforms.uCsVignette.value = finiteOr(intentConsciousnessParams.csVignette, 0.01);
    uniforms.uCsMouseParallax.value = finiteOr(intentConsciousnessParams.csMouseParallax, 0.0);
    uniforms.uCsLightBoost.value = finiteOr(intentConsciousnessParams.csLightBoost, 1.55);
    uniforms.uCsPreGamma.value = finiteOr(intentConsciousnessParams.csPreGamma, 2.04);
    uniforms.uCsExposure.value = finiteOr(intentConsciousnessParams.csExposure, 2.45);
    uniforms.uCsCoolR.value = finiteOr(intentConsciousnessParams.csCoolR, 0.12);
    uniforms.uCsCoolG.value = finiteOr(intentConsciousnessParams.csCoolG, 0.2);
    uniforms.uCsCoolB.value = finiteOr(intentConsciousnessParams.csCoolB, 0.68);
    uniforms.uCsWarmR.value = finiteOr(intentConsciousnessParams.csWarmR, 1.0);
    uniforms.uCsWarmG.value = finiteOr(intentConsciousnessParams.csWarmG, 0.96);
    uniforms.uCsWarmB.value = finiteOr(intentConsciousnessParams.csWarmB, 0.96);
    uniforms.uCsGateR.value = finiteOr(intentConsciousnessParams.csGateR, 1.3);
    uniforms.uCsGateG.value = finiteOr(intentConsciousnessParams.csGateG, 0.9);
    uniforms.uCsGateB.value = finiteOr(intentConsciousnessParams.csGateB, 0.2);
}

function createConsciousnessMaterial() {
    return new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uLoopEnabled: { value: 0.0 },
            uLoopSin: { value: 0.0 },
            uLoopCos: { value: 1.0 },
            uLoopAnchorSec: { value: resolveIntentLoopAnchorSec(intentMotionParams) },
            uLoopDriftSec: { value: resolveIntentLoopDriftSec(intentMotionParams) },
            uBreath: { value: 0.5 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uMaxSteps: { value: detectStepLimit() },
            uFar: { value: finiteOr(intentConsciousnessParams.far, 12.0) },
            uDetail: { value: finiteOr(intentConsciousnessParams.detail, 0.0045) },
            uCamYaw: { value: 0.0 },
            uCamPitch: { value: 0.0 },
            uCsFlowSpeed: { value: finiteOr(intentConsciousnessParams.csFlowSpeed, 0.21) },
            uCsFreqLow: { value: finiteOr(intentConsciousnessParams.csFreqLow, 2.5) },
            uCsFreqHigh: { value: finiteOr(intentConsciousnessParams.csFreqHigh, 1.0) },
            uCsThicknessLow: { value: finiteOr(intentConsciousnessParams.csThicknessLow, 0.095) },
            uCsThicknessHigh: { value: finiteOr(intentConsciousnessParams.csThicknessHigh, 0.17) },
            uCsEnvelopeRadius: { value: finiteOr(intentConsciousnessParams.csEnvelopeRadius, 2.44) },
            uCsDensityGain: { value: finiteOr(intentConsciousnessParams.csDensityGain, 0.2) },
            uCsStepNear: { value: finiteOr(intentConsciousnessParams.csStepNear, 0.084) },
            uCsStepFar: { value: finiteOr(intentConsciousnessParams.csStepFar, 0.215) },
            uCsGateTint: { value: finiteOr(intentConsciousnessParams.csGateTint, 0.88) },
            uCsVignette: { value: finiteOr(intentConsciousnessParams.csVignette, 0.01) },
            uCsMouseParallax: { value: finiteOr(intentConsciousnessParams.csMouseParallax, 0.0) },
            uCsLightBoost: { value: finiteOr(intentConsciousnessParams.csLightBoost, 1.55) },
            uCsPreGamma: { value: finiteOr(intentConsciousnessParams.csPreGamma, 2.04) },
            uCsExposure: { value: finiteOr(intentConsciousnessParams.csExposure, 2.45) },
            uCsCoolR: { value: finiteOr(intentConsciousnessParams.csCoolR, 0.12) },
            uCsCoolG: { value: finiteOr(intentConsciousnessParams.csCoolG, 0.2) },
            uCsCoolB: { value: finiteOr(intentConsciousnessParams.csCoolB, 0.68) },
            uCsWarmR: { value: finiteOr(intentConsciousnessParams.csWarmR, 1.0) },
            uCsWarmG: { value: finiteOr(intentConsciousnessParams.csWarmG, 0.96) },
            uCsWarmB: { value: finiteOr(intentConsciousnessParams.csWarmB, 0.96) },
            uCsGateR: { value: finiteOr(intentConsciousnessParams.csGateR, 1.3) },
            uCsGateG: { value: finiteOr(intentConsciousnessParams.csGateG, 0.9) },
            uCsGateB: { value: finiteOr(intentConsciousnessParams.csGateB, 0.2) },
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
    _renderer = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    _lastPixelRatio = null;
    syncRendererQuality();
    container.appendChild(renderer.domElement);

    _material = createConsciousnessMaterial();
    _mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), _material);
    _mesh.renderOrder = 1000;
    _mesh.frustumCulled = false;
    _scene.add(_mesh);

    return { scene, camera, renderer };
}

export function updateScene(time) {
    if (!_mesh || !_camera || !_material) return;
    syncRendererQuality();

    const timeline = computeIntentRuntimeTimeline(time, intentMotionParams);
    const {
        angle,
        loopPeriodSec,
        shaderTimeSec,
        seamlessLoopEnabled,
        loopAnchorSec,
        loopDriftSec,
    } = timeline;
    const breathPeriod = Math.max(0.001, finiteOr(breathConfig.period, 8.0));
    const breathCycles = Math.max(1, Math.round(loopPeriodSec / breathPeriod));
    const breath = clamp01(0.5 + 0.5 * Math.sin(angle * breathCycles - (Math.PI / 2.0)));
    const uniforms = _material.uniforms;
    syncConsciousnessUniforms(uniforms);

    uniforms.uTime.value = shaderTimeSec;
    uniforms.uLoopEnabled.value = seamlessLoopEnabled ? 1.0 : 0.0;
    uniforms.uLoopSin.value = timeline.loopSin;
    uniforms.uLoopCos.value = timeline.loopCos;
    uniforms.uLoopAnchorSec.value = loopAnchorSec;
    uniforms.uLoopDriftSec.value = loopDriftSec;
    uniforms.uBreath.value = breath;
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    uniforms.uMaxSteps.value = detectStepLimit();

    if (!_camera.isPerspectiveCamera) return;
    _cameraEuler.setFromQuaternion(_camera.quaternion, 'YXZ');
    uniforms.uCamYaw.value = _cameraEuler.y;
    uniforms.uCamPitch.value = _cameraEuler.x;

    const overlayDistance = Math.max(0.25, finiteOr(intentConsciousnessParams.overlayDistance, 6.0));
    const coverageScale = Math.max(0.1, finiteOr(intentConsciousnessParams.coverageScale, 1.06));
    const aspect = Math.max(_camera.aspect || 1.0, 0.0001);
    const fovRad = THREE.MathUtils.degToRad(_camera.fov || CAMERA_FOV);
    const viewportHeight = 2.0 * Math.tan(fovRad * 0.5) * overlayDistance;
    const viewportWidth = viewportHeight * aspect;
    const breathScale = 0.995 + clamp01(breath) * 0.02;

    _forward.set(0, 0, -1).applyQuaternion(_camera.quaternion).normalize();
    _position.copy(_camera.position).addScaledVector(_forward, overlayDistance);

    _mesh.position.copy(_position);
    _mesh.quaternion.copy(_camera.quaternion);
    _mesh.scale.set(
        viewportWidth * coverageScale * breathScale,
        viewportHeight * coverageScale * breathScale,
        1.0
    );
}
