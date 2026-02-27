import * as THREE from 'three';
import { INTENT_MOTION_DEFAULTS } from '../intent-motion-defaults.js';

export const toggles = {
    background: true,
    field: true,
    flowObjects: true,
    fog: true,
    fovBreath: true,
    htmlBreath: true,
    autoRotate: true,
    postProcess: true,
    fluidField: false,
    liquid: false,
    dof: true,
    quantumWave: false,
    showPlasma: true,
};

export const breathConfig = {
    period: 8,
    htmlMinOpacity: 0.1,
    htmlMaxOpacity: 0.8,
    htmlMaxBlur: 3,
    htmlMinScale: 0.95,
    fovBase: 60,
    fovAmplitude: 1,
};

export const BG_V002_CENTER = new THREE.Color(0x0b1130);
export const BG_V002_EDGE = new THREE.Color(0x02040f);
export const BG_V004_CENTER = new THREE.Color(0x1c2a63);
export const BG_V004_EDGE = new THREE.Color(0x060b22);

export const backgroundParams = {
    centerR: 0.042,
    centerG: 0.041,
    centerB: 0.066,
    edgeR: 0.041,
    edgeG: 0.168,
    edgeB: 0.268,
    pulse: 0.105,
    opacity: 1,
    tubeRadius: 89.5,
    tubeLength: 768.0,
    tubeFlowSpeed: 0.031,
    tubeNoiseScale: 4.36,
    tubeWarpStrength: 1.21,
    tubeSoftness: 0.85,
    tubeDepthFade: 0.78,
    tubeBrightness: 0.62,
    tubeSwirl: 2.5,
    starOpacity: 0.84,
    starSoftness: 7.0,
    starSize: 1.15,
};

export const FOG_V002_COLOR = new THREE.Color(0x050508);
export const FOG_V002_DENSITY = 0.02;
export const FOG_V004_COLOR = new THREE.Color(0x0a1520);
export const FOG_V004_DENSITY = 0.015;

export const sceneParams = {
    mixCycle: 16,
    styleCycle: 22,
    fogDensity: 0.008,
    camX: -2,
    camY: 0,
    camZ: 38,
    camTargetY: -2,
};

export const fieldParams = {
    intensity: 1.2,
    alpha: 0.42,
    lineLow: 0.3,
    lineHigh: 0.72,
    bottomClip: 0,
    bottomFeather: 0.15,
};

export const flowParams = {
    seedOpacity: 0.53,
    filamentOpacity: 0.5,
    seedDrift: 1.34,
    chaos: 1.8,
    bundleTightness: 0.25,
    centerBandRatio: 0.25,
    centerThickness: 0.97,
    depthScatter: 1.28,
    speed: 1.0, // Added speed parameter per user request
};

export const plasmaParams = {
    coreOpacity: 0,
    chaosOpacity: 0.05,
    radius: 14,
    chaos: 0.6,
    speed: 0.8,
    heightRatio: 0.6,
    autoChaosAmp: 30,
    wSeparation: 0.35,
    projectionScale: 0.4,
    colorA: new THREE.Color(8172519), // Convert from int
    colorB: new THREE.Color(13363187), // Convert from int
};

export const creationLinkParams = {
    sizeGain: 5.81,
    linkSpread: 2.96,
    linkDepthSpread: 1.57,
    pulseSpeed: 0.37,
    vortexSpeed: 0.92,
    swirlStrength: 0.26,
    sphereFill: 0.95,
    colorSplitSoftness: 0.08,
    particleBrightness: 0.72,
    particleSoftness: 3.2,
    coreSharpness: 0.72,
    fluidDrift: 0.14,
    pointerBurstStrength: 1,
    pointerBurstSpread: 20,
    colorContrast: 0.55,
    floatAmp: 0.25,
    floatOffset: -0.1,
    yawSpeed: 0.18,
    tiltSpeed: 0.3,
    tiltAmp: 0.08,
    baseScaleMul: 1,
    pulseScaleAmp: 0.065,
    hoverScaleBoost: 0.48,
    hoverLerp: 0.025,
    pointAlpha: 0.025,
    shellOpacityBase: 0.78,
    shellOpacityPulse: 0.84,
    shellOpacityHover: 0.7,
    shellSpinSpeed: 1.49,
    haloScalePulse: 0.39,
    haloScaleHover: 0.32,
    haloOpacityBase: 0.08,
    haloOpacityPulse: 0.28,
    haloOpacityHover: 0.34,

    link1PosX: 0,
    link1PosY: -1,
    link1PosZ: -2,
    link1Scale: 13,
    link1GlowScale: 6,
    link1HitRadius: 2.8,
    link1Phase: 0.15,
    link1ColorAR: 0.09,
    link1ColorAG: 0.22,
    link1ColorAB: 0.74,
    link1ColorBR: 0.84,
    link1ColorBG: 0.96,
    link1ColorBB: 1,
    link2PosX: 0.1,
    link2PosY: -0.8,
    link2PosZ: -9.4,
    link2Scale: 10.0,
    link2GlowScale: 5.2,
    link2HitRadius: 2.2,
    link2Phase: 1.4,
    link2ColorAR: 1.0,
    link2ColorAG: 1.0,
    link2ColorAB: 1.0,
    link2ColorBR: 0.06,
    link2ColorBG: 0.72,
    link2ColorBB: 0.72,
    link3PosX: 9.2,
    link3PosY: -1.95,
    link3PosZ: -7.1,
    link3Scale: 10.0,
    link3GlowScale: 4.5,
    link3HitRadius: 1.95,
    link3Phase: 2.8,
    link3ColorAR: 1.0,
    link3ColorAG: 1.0,
    link3ColorAB: 1.0,
    link3ColorBR: 0.06,
    link3ColorBG: 0.72,
    link3ColorBB: 0.72,
};

export const fluidParams = {
    force: 1,
    curl: 1,
    decay: 0.948,
    radius: 0.21,
    influence: 0.06,
};

export const liquidParams = {
    textureSize: 128,
    timestep: 0.001,
    dissipation: 0.904,
    iterations: 12,
    forceRadius: 0.08,
    forceStrength: 4.5,
    splatGain: 5,
    densityMul: 1.8,
    noiseScale: 9.5,
    noiseSpeed: 0.02,
    noiseAmp: 0.1,
    specularPow: 8,
    specularInt: 1.8,
    normalZ: 0.3,
    diffuseGain: 0.3,
    densityEdge: 0.5,
    alphaEdge: 0.3,
    alphaMax: 0.9,
    refractOffsetScale: 0.055,
    refractThreshold: 0.006,
    baseColorR: 0.8,
    baseColorG: 0.85,
    baseColorB: 0.85,
    highlightR: 0.9,
    highlightG: 0.9,
    highlightB: 0.9
};

export const quantumWaveParams = {
    strength: 0.032,
    speed: 0.24,
    baseFreq: 2.4,
    dispersion: 0.11,
    noiseAmp: 0.25,
    noiseScale: 2.1,
    waveCount: 8,
    envelope: 0.82,
    yInfluence: 0.7,
    glowAmount: 0,
    glowColorR: 0.45,
    glowColorG: 0.72,
    glowColorB: 1,
    caberration: 0,
    rimBright: 0,
    blurAmount: 0,
    fogDensity: 0,
    fogColorR: 0.34,
    fogColorG: 0.46,
    fogColorB: 0.62,
    darken: 0,
    turbulence: 0,
    sharpness: 0.74
};

export const distortionParams = {
    strength: 0.01,
    aberration: 0.03,
    turbulence: 0.1,
    baseBlur: 0.02,
    blurAmount: 0.05,
    innerGlow: 0.1,
    haloIntensity: 0.2,
    haloWidth: 1,
    haloColorR: 0.3,
    haloColorG: 0.2,
    haloColorB: 0.05,
    dofStrength: 0.006,
    dofFocusRadius: 0.26
};

export const intentMotionParams = {
    ...INTENT_MOTION_DEFAULTS,
};

export const intentConsciousnessParams = {
    maxStepsMobile: 34,
    maxStepsDesktop: 52,
    renderPixelRatioCap: 1.4,
    renderScale: 0.9,
    far: 12.0,
    detail: 0.0045,
    overlayDistance: 6.0,
    coverageScale: 1.06,
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
