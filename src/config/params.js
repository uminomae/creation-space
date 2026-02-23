import * as THREE from 'three';

export const toggles = {
    background: true,
    field: true,
    flowObjects: true,
    fog: true,
    fovBreath: true,
    htmlBreath: true,
    autoRotate: false,
    postProcess: true,
    fluidField: true,
    liquid: false,
    heatHaze: false,
    dof: true,
    quantumWave: false,
    showSwirl: true,
};

export const breathConfig = {
    period: 8.0,
    htmlMinOpacity: 0.1,
    htmlMaxOpacity: 0.8,
    htmlMaxBlur: 3.0,
    htmlMinScale: 0.95,
    fovBase: 60,
    fovAmplitude: 1.0,
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
    opacity: 1.0,
};

export const FOG_V002_COLOR = new THREE.Color(0x050508);
export const FOG_V002_DENSITY = 0.02;
export const FOG_V004_COLOR = new THREE.Color(0x0a1520);
export const FOG_V004_DENSITY = 0.015;

export const sceneParams = {
    mixCycle: 16.0,
    styleCycle: 22.0,
    fogDensity: 0.008,
    camX: -2,
    camY: 0,
    camZ: 38,
    camTargetY: -2,
};

export const fieldParams = {
    intensity: 1.2,
    alpha: 0.42,
    lineLow: 0.30,
    lineHigh: 0.72,
    bottomClip: 0.0,
    bottomFeather: 0.15,
};

export const flowParams = {
    seedOpacity: 0.65,
    filamentOpacity: 0.5,
    seedDrift: 1.25,
    chaos: 1.8,
    bundleTightness: 0.25,
    centerBandRatio: 0.25, // For forcing the tight center pinch
    centerThickness: 0.5,
};

export const swirlParams = {
    opacity: 0.35,
    chaos: 3.5, // Extreme chaos for swarm
    speed: 0.20,
    radius: 12.0, // Tight central cluster
    heightRatio: 1.0, // Full sphere, no squeezing
    colorA: new THREE.Color(0.20, 0.45, 0.8),
    colorB: new THREE.Color(0.60, 0.80, 0.9),
};

export const creationLinkParams = {
    pulseSpeed: 0.37,
    vortexSpeed: 0.92,
    swirlStrength: 0.26,
    sphereFill: 0.95,
    colorSplitSoftness: 0.08,
    particleBrightness: 0.72,
    particleSoftness: 3.2,
    fluidDrift: 0.14,
    pointerBurstStrength: 1.0,
    pointerBurstSpread: 20.0,
    colorContrast: 0.55,
    floatAmp: 0.25,
    floatOffset: -0.1,
    yawSpeed: 0.18,
    tiltSpeed: 0.30,
    tiltAmp: 0.08,
    baseScaleMul: 1.0,
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

    link1PosX: 0.0,
    link1PosY: -1.0,
    link1PosZ: -2.0,
    link1Scale: 13.0,
    link1GlowScale: 6.0,
    link1HitRadius: 2.8,
    link1Phase: 0.15,
    link1ColorAR: 0.09,
    link1ColorAG: 0.22,
    link1ColorAB: 0.74,
    link1ColorBR: 0.84,
    link1ColorBG: 0.96,
    link1ColorBB: 1.0,
};

export const fluidParams = {
    force: 1.0,
    curl: 1.0,
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
    splatGain: 5.0,
    densityMul: 1.8,
    noiseScale: 9.5,
    noiseSpeed: 0.02,
    noiseAmp: 0.1,
    specularPow: 8.0,
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
    highlightB: 0.9,
};

export const quantumWaveParams = {
    strength: 0.032,
    speed: 0.24,
    baseFreq: 2.4,
    dispersion: 0.11,
    noiseAmp: 0.25,
    noiseScale: 2.1,
    waveCount: 8.0,
    envelope: 0.82,
    yInfluence: 0.7,
    glowAmount: 0.0,
    glowColorR: 0.45,
    glowColorG: 0.72,
    glowColorB: 1.0,
    caberration: 0.0,
    rimBright: 0.0,
    blurAmount: 0.0,
    fogDensity: 0.0,
    fogColorR: 0.34,
    fogColorG: 0.46,
    fogColorB: 0.62,
    darken: 0.0,
    turbulence: 0.0,
    sharpness: 0.74,
};

export const distortionParams = {
    strength: 0.01,
    aberration: 0.03,
    turbulence: 0.1,
    baseBlur: 0.02,
    blurAmount: 0.05,
    innerGlow: 0.1,
    haloIntensity: 0.2,
    haloWidth: 1.0,
    haloColorR: 0.3,
    haloColorG: 0.2,
    haloColorB: 0.05,
    heatHaze: 0.024,
    heatHazeRadius: 0.5,
    heatHazeSpeed: 1.0,
    dofStrength: 0.006,
    dofFocusRadius: 0.26,
};
