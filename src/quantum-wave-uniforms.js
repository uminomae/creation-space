export function applyQuantumWaveUniforms(distortionPass, { enabled, params }) {
    if (!enabled) {
        distortionPass.uniforms.uQWaveStrength.value = 0;
        return;
    }

    const du = distortionPass.uniforms;
    du.uQWaveStrength.value = params.strength;
    du.uQWaveSpeed.value = params.speed;
    du.uQWaveBaseFreq.value = params.baseFreq;
    du.uQWaveDispersion.value = params.dispersion;
    du.uQWaveNoiseAmp.value = params.noiseAmp;
    du.uQWaveNoiseScale.value = params.noiseScale;
    du.uQWaveCount.value = params.waveCount;
    du.uQWaveEnvelope.value = params.envelope;
    du.uQWaveYInfluence.value = params.yInfluence;
    du.uQWaveGlowAmount.value = params.glowAmount;
    du.uQWaveGlowColorR.value = params.glowColorR;
    du.uQWaveGlowColorG.value = params.glowColorG;
    du.uQWaveGlowColorB.value = params.glowColorB;
    du.uQWaveCaberration.value = params.caberration;
    du.uQWaveRimBright.value = params.rimBright;
    du.uQWaveBlurAmount.value = params.blurAmount;
    du.uQWaveFogDensity.value = params.fogDensity;
    du.uQWaveFogColorR.value = params.fogColorR;
    du.uQWaveFogColorG.value = params.fogColorG;
    du.uQWaveFogColorB.value = params.fogColorB;
    du.uQWaveDarken.value = params.darken;
    du.uQWaveTurbulence.value = params.turbulence;
    du.uQWaveSharpness.value = params.sharpness;
}
