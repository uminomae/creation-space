import * as THREE from 'three';

export const toggles = {
    background: true,
    fog: true,
    fovBreath: true,
    htmlBreath: true,
    autoRotate: true,
    postProcess: true,
    fluidField: true,
    liquid: true,
    heatHaze: false,
    dof: true,
    quantumWave: true,
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
    fogDensity: 0.018,
    camX: -14,
    camY: 0,
    camZ: 34,
    camTargetY: -1,
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
    glowAmount: 0.07,
    glowColorR: 0.45,
    glowColorG: 0.72,
    glowColorB: 1.0,
    caberration: 0.0015,
    rimBright: 0.22,
    blurAmount: 0.01,
    fogDensity: 0.03,
    fogColorR: 0.34,
    fogColorG: 0.46,
    fogColorB: 0.62,
    darken: 0.05,
    turbulence: 0.08,
    sharpness: 0.74,
};

export const distortionParams = {
    strength: 0.03,
    aberration: 0.1,
    turbulence: 0.4,
    baseBlur: 0.06,
    blurAmount: 0.15,
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
