// distortion-pass.js — ポストプロセスシェーダー
// 流体フィールド + 鬼火屈折 + 熱波 + リキッド（DOFは最終パスで適用）
// ★ 初期値は config.js の distortionParams / fluidParams / liquidParams を参照

import * as THREE from 'three';
import { distortionParams, fluidParams, liquidParams, quantumWaveParams } from '../config.js';

export const DistortionShader = {
    uniforms: {
        'tDiffuse':       { value: null },
        'tFluidField':    { value: null },
        'tLiquid':        { value: null },
        'uLiquidStrength':{ value: liquidParams.densityMul },
        'uLiquidOffsetScale': { value: liquidParams.refractOffsetScale },
        'uLiquidThreshold':   { value: liquidParams.refractThreshold },
        'uFluidInfluence':{ value: fluidParams.influence },
        'uOrbs':          { value: [new THREE.Vector2(-1, -1), new THREE.Vector2(-1, -1), new THREE.Vector2(-1, -1)] },
        'uOrbRadii':      { value: [0.0, 0.0, 0.0] },
        'uOrbStrengths':  { value: [0.0, 0.0, 0.0] },
        'uStrength':      { value: distortionParams.strength },
        'uAberration':    { value: distortionParams.aberration },
        'uAspect':        { value: 1.0 },
        'uHaloColor':     { value: new THREE.Vector3(distortionParams.haloColorR, distortionParams.haloColorG, distortionParams.haloColorB) },
        'uHaloIntensity': { value: distortionParams.haloIntensity },
        'uHaloWidth':     { value: distortionParams.haloWidth },
        'uTime':          { value: 0.0 },
        'uTurbulence':    { value: distortionParams.turbulence },
        'uBlurAmount':    { value: distortionParams.blurAmount },
        'uBaseBlur':      { value: distortionParams.baseBlur },
        'uInnerGlow':     { value: distortionParams.innerGlow },
        'uMouse':         { value: new THREE.Vector2(0.5, 0.5) },
        'uHeatHaze':      { value: distortionParams.heatHaze },
        'uHeatHazeRadius':{ value: distortionParams.heatHazeRadius },
        'uHeatHazeSpeed': { value: distortionParams.heatHazeSpeed },
        'uQWaveStrength':   { value: quantumWaveParams.strength },
        'uQWaveSpeed':      { value: quantumWaveParams.speed },
        'uQWaveBaseFreq':   { value: quantumWaveParams.baseFreq },
        'uQWaveDispersion': { value: quantumWaveParams.dispersion },
        'uQWaveNoiseAmp':   { value: quantumWaveParams.noiseAmp },
        'uQWaveNoiseScale': { value: quantumWaveParams.noiseScale },
        'uQWaveCount':      { value: quantumWaveParams.waveCount },
        'uQWaveEnvelope':   { value: quantumWaveParams.envelope },
        'uQWaveYInfluence': { value: quantumWaveParams.yInfluence },
        'uQWaveGlowAmount':  { value: quantumWaveParams.glowAmount },
        'uQWaveGlowColorR':  { value: quantumWaveParams.glowColorR },
        'uQWaveGlowColorG':  { value: quantumWaveParams.glowColorG },
        'uQWaveGlowColorB':  { value: quantumWaveParams.glowColorB },
        'uQWaveCaberration': { value: quantumWaveParams.caberration },
        'uQWaveRimBright':   { value: quantumWaveParams.rimBright },
        'uQWaveBlurAmount':  { value: quantumWaveParams.blurAmount },
        'uQWaveFogDensity':  { value: quantumWaveParams.fogDensity },
        'uQWaveFogColorR':   { value: quantumWaveParams.fogColorR },
        'uQWaveFogColorG':   { value: quantumWaveParams.fogColorG },
        'uQWaveFogColorB':   { value: quantumWaveParams.fogColorB },
        'uQWaveDarken':      { value: quantumWaveParams.darken },
        'uQWaveTurbulence':  { value: quantumWaveParams.turbulence },
        'uQWaveSharpness':   { value: quantumWaveParams.sharpness },
    },

    vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /* glsl */`
        uniform sampler2D tDiffuse;
        uniform sampler2D tFluidField;
        uniform sampler2D tLiquid;
        uniform float uLiquidStrength;
        uniform float uLiquidOffsetScale;
        uniform float uLiquidThreshold;
        uniform float uFluidInfluence;
        uniform vec2 uOrbs[3];
        uniform float uOrbRadii[3];
        uniform float uOrbStrengths[3];
        uniform float uStrength;
        uniform float uAberration;
        uniform float uAspect;
        uniform vec3 uHaloColor;
        uniform float uHaloIntensity;
        uniform float uHaloWidth;
        uniform float uTime;
        uniform float uTurbulence;
        uniform float uBlurAmount;
        uniform float uBaseBlur;
        uniform float uInnerGlow;
        uniform vec2 uMouse;
        uniform float uHeatHaze;
        uniform float uHeatHazeRadius;
        uniform float uHeatHazeSpeed;
        uniform float uQWaveStrength;
        uniform float uQWaveSpeed;
        uniform float uQWaveBaseFreq;
        uniform float uQWaveDispersion;
        uniform float uQWaveNoiseAmp;
        uniform float uQWaveNoiseScale;
        uniform float uQWaveCount;
        uniform float uQWaveEnvelope;
        uniform float uQWaveYInfluence;
        uniform float uQWaveGlowAmount;
        uniform float uQWaveGlowColorR;
        uniform float uQWaveGlowColorG;
        uniform float uQWaveGlowColorB;
        uniform float uQWaveCaberration;
        uniform float uQWaveRimBright;
        uniform float uQWaveBlurAmount;
        uniform float uQWaveFogDensity;
        uniform float uQWaveFogColorR;
        uniform float uQWaveFogColorG;
        uniform float uQWaveFogColorB;
        uniform float uQWaveDarken;
        uniform float uQWaveTurbulence;
        uniform float uQWaveSharpness;
        varying vec2 vUv;

        float hash(vec2 p) {
            vec3 p3 = fract(vec3(p.xyx) * 0.1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
        }

        float valueNoise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
            float f = 0.0;
            float amp = 0.5;
            for (int i = 0; i < 4; i++) {
                f += amp * valueNoise(p);
                p = p * 2.0 + vec2(uTime * 0.07, uTime * 0.05);
                amp *= 0.5;
            }
            return f;
        }

        float fbmFast(vec2 p) {
            float f = 0.0;
            f += 0.5 * valueNoise(p);
            p = p * 2.0 + vec2(uTime * uHeatHazeSpeed * 0.3, uTime * uHeatHazeSpeed * 0.2);
            f += 0.25 * valueNoise(p);
            return f;
        }

        vec3 discBlur(vec2 uv, float blurAmt) {
            vec3 col = texture2D(tDiffuse, uv).rgb;
            if (blurAmt < 0.0005) return col;
            float totalWeight = 1.0;
            float goldenAngle = 2.39996;
            for (int i = 1; i <= 12; i++) {
                float fi = float(i);
                float angle = fi * goldenAngle;
                float radius = sqrt(fi / 12.0) * blurAmt;
                vec2 offset = vec2(cos(angle), sin(angle)) * radius;
                offset.x /= uAspect;
                float weight = 1.0 - (fi / 13.0) * 0.4;
                col += texture2D(tDiffuse, uv + offset).rgb * weight;
                totalWeight += weight;
            }
            return col / totalWeight;
        }

        void main() {
            vec2 uv = vUv;

            // 0. 流体フィールド
            vec2 fluidOffset = texture2D(tFluidField, uv).rg * uFluidInfluence;
            uv += fluidOffset;

            // 1. 熱波エフェクト
            vec2 mouseAspect = vec2((uv.x - uMouse.x) * uAspect, uv.y - uMouse.y);
            float mouseDist = length(mouseAspect);
            float heatMask = smoothstep(uHeatHazeRadius, 0.0, mouseDist);
            if (heatMask > 0.001 && uHeatHaze > 0.0001) {
                vec2 heatCoord = uv * 15.0 + uMouse * 5.0;
                float hx = fbmFast(heatCoord) - 0.5;
                float hy = fbmFast(heatCoord + vec2(3.7, 8.1)) - 0.5;
                uv += vec2(hx, hy) * uHeatHaze * heatMask;
            }

            vec3 color = texture2D(tDiffuse, uv).rgb;

            // 2. 鬼火オーブ屈折
            float totalHalo = 0.0;
            float totalInnerGlow = 0.0;
            for (int i = 0; i < 3; i++) {
                vec2 orbCenter = uOrbs[i];
                float orbRadius = uOrbRadii[i];
                float strength = uOrbStrengths[i];
                if (orbCenter.x < 0.0 || strength <= 0.001 || orbRadius <= 0.001) continue;
                vec2 diff = uv - orbCenter;
                diff.x *= uAspect;
                float dist = length(diff);
                float r = dist / orbRadius;
                if (r < 1.0) {
                    float z = sqrt(1.0 - r * r);
                    vec3 normal = normalize(vec3(diff / orbRadius, z));
                    vec2 noiseCoord = diff * 4.0 + orbCenter * 20.0;
                    float nx = fbm(noiseCoord) - 0.5;
                    float ny = fbm(noiseCoord + vec2(7.3, 3.1)) - 0.5;
                    normal.xy += vec2(nx, ny) * uTurbulence;
                    normal = normalize(normal);
                    vec3 incident = vec3(0.0, 0.0, 1.0);
                    vec3 refracted = refract(incident, normal, 1.0 / (1.0 + uStrength));
                    vec2 offset = refracted.xy - incident.xy;
                    offset.x /= uAspect;
                    vec2 baseUV = uv + offset;
                    float blur = uBaseBlur + r * r * uBlurAmount;
                    vec3 blurred = discBlur(baseUV, blur);
                    float ca = uAberration * r;
                    vec3 caColor;
                    caColor.r = texture2D(tDiffuse, baseUV + offset * ca).r;
                    caColor.g = blurred.g;
                    caColor.b = texture2D(tDiffuse, baseUV - offset * ca).b;
                    color = mix(blurred, caColor, 0.5);
                    float innerGlowMask = smoothstep(0.3, 0.95, r);
                    totalInnerGlow += innerGlowMask * strength;
                }
                float haloOuter = orbRadius * (1.0 + uHaloWidth);
                float haloInner = orbRadius * (1.0 - uHaloWidth * 0.3);
                float outer = smoothstep(haloOuter, orbRadius, dist);
                float inner = smoothstep(haloInner, orbRadius, dist);
                totalHalo += outer * inner * strength;
            }
            totalHalo = clamp(totalHalo, 0.0, 1.0);
            totalInnerGlow = clamp(totalInnerGlow, 0.0, 1.0);
            color += uHaloColor * totalHalo * uHaloIntensity;
            color += uHaloColor * totalInnerGlow * uInnerGlow;

            // 3. リキッドエフェクト（マウス追従・透明屈折のみ）
            vec4 liquid = texture2D(tLiquid, vUv);
            if (liquid.a > uLiquidThreshold && uLiquidStrength > uLiquidThreshold) {
                // 液体の屈折効果のみ（色なし・透明）
                vec2 liquidOffset = (liquid.rg - 0.5) * uLiquidOffsetScale * uLiquidStrength;
                vec3 refractedColor = texture2D(tDiffuse, vUv + liquidOffset).rgb;
                // 屈折した色のみ適用（白色ブレンドなし）
                color = mix(color, refractedColor, liquid.a * uLiquidStrength);
            }

            // 4. 量子波屈折（透明リキッドレンズ + 拡張エフェクト）
            if (uQWaveStrength > 0.0001) {
                float qGradX = 0.0;
                float qGradY = 0.0;
                float qPsi = 0.0;

                int qCount = int(clamp(uQWaveCount, 1.0, 8.0));

                // 位相ノイズ（リキッド揺らぎ + 乱流）
                float phaseNoise = 0.0;
                if (uQWaveNoiseAmp > 0.001) {
                    vec2 noiseCoord = vUv * uQWaveNoiseScale * 6.0 + vec2(uTime * 0.05, uTime * 0.03);
                    phaseNoise = fbm(noiseCoord) * uQWaveNoiseAmp;
                }
                // 乱流: 小スケールの高周波ノイズを追加
                float turb = 0.0;
                if (uQWaveTurbulence > 0.001) {
                    turb = (valueNoise(vUv * 50.0 + uTime * 0.3) - 0.5) * uQWaveTurbulence;
                }

                for (int n = 0; n < 8; n++) {
                    if (n >= qCount) break;
                    float idx = float(n);
                    float angle = idx * 0.4 + 0.1 * sin(idx * 2.3);
                    float kMag = uQWaveBaseFreq * (1.0 + idx * 0.25);
                    float kx = kMag * cos(angle);
                    float ky = kMag * sin(angle) * uQWaveYInfluence;
                    float omega = uQWaveDispersion * kMag * kMag;
                    float phase = kx * vUv.x + ky * vUv.y - omega * uTime * uQWaveSpeed + idx * 1.618 + phaseNoise + turb;
                    float amp = 1.0 / (1.0 + idx * 0.4);
                    qPsi   += amp * sin(phase);
                    qGradX += amp * kx * cos(phase);
                    qGradY += amp * ky * cos(phase);
                }

                // ガウシアンエンベロープ
                float envDist = length(vUv - 0.5) * 2.0;
                float envelope = exp(-envDist * envDist / max(uQWaveEnvelope * uQWaveEnvelope, 0.01));

                // 波の強度（正規化 |ψ|）— エフェクトのマスクに使用
                float psiAbs = abs(qPsi) / max(uQWaveCount * 0.5, 1.0);
                psiAbs = clamp(psiAbs, 0.0, 1.0);

                // シャープネス適用（勾配のコントラスト調整）
                float gradMag = length(vec2(qGradX, qGradY));
                float sharpFactor = mix(0.5, 2.0, uQWaveSharpness);
                qGradX *= sharpFactor;
                qGradY *= sharpFactor;

                // 勾配 → UVオフセット（屈折）
                vec2 qOffset = vec2(-qGradX, -qGradY) * uQWaveStrength * envelope;
                qOffset.x /= uAspect;

                // --- ぼかし ---
                vec3 qRefracted;
                if (uQWaveBlurAmount > 0.0005) {
                    float blurAmt = uQWaveBlurAmount * psiAbs * envelope;
                    qRefracted = discBlur(vUv + qOffset, blurAmt);
                } else {
                    qRefracted = texture2D(tDiffuse, vUv + qOffset).rgb;
                }

                // --- 色収差 ---
                if (uQWaveCaberration > 0.0001) {
                    float ca = uQWaveCaberration * psiAbs * envelope;
                    qRefracted.r = texture2D(tDiffuse, vUv + qOffset * (1.0 + ca)).r;
                    qRefracted.b = texture2D(tDiffuse, vUv + qOffset * (1.0 - ca)).b;
                }

                // 屈折適用
                color = mix(color, qRefracted, envelope);

                // --- 暗化 ---
                if (uQWaveDarken > 0.001) {
                    float darkMask = psiAbs * envelope * uQWaveDarken;
                    color *= (1.0 - darkMask);
                }

                // --- 霧（白濁）---
                if (uQWaveFogDensity > 0.001) {
                    vec3 fogColor = vec3(uQWaveFogColorR, uQWaveFogColorG, uQWaveFogColorB);
                    float fogMask = psiAbs * envelope * uQWaveFogDensity;
                    color = mix(color, fogColor, fogMask);
                }

                // --- 発光 ---
                if (uQWaveGlowAmount > 0.001) {
                    vec3 glowColor = vec3(uQWaveGlowColorR, uQWaveGlowColorG, uQWaveGlowColorB);
                    float glowMask = psiAbs * psiAbs * envelope * uQWaveGlowAmount;
                    color += glowColor * glowMask;
                }

                // --- リムライト ---
                if (uQWaveRimBright > 0.001) {
                    // 勾配の大きさ = 屈折のエッジ → リムライト
                    float normGrad = clamp(gradMag * 0.1, 0.0, 1.0);
                    float rimMask = normGrad * envelope * uQWaveRimBright;
                    color += vec3(rimMask * 0.5, rimMask * 0.7, rimMask * 1.0);
                }
            }

            gl_FragColor = vec4(color, 1.0);
        }
    `
};

export const CameraDofShader = {
    // 一眼レフのようなレンズ由来のボケを想定した「カメラ最終段」DOF。
    // このパスは composer の最後で実行し、画面全体に一貫して適用する。
    uniforms: {
        'tDiffuse':       { value: null },
        'uAspect':        { value: 1.0 },
        'uMouse':         { value: new THREE.Vector2(0.5, 0.5) },
        'uDofStrength':   { value: distortionParams.dofStrength },
        'uDofFocusRadius':{ value: distortionParams.dofFocusRadius },
    },

    vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /* glsl */`
        uniform sampler2D tDiffuse;
        uniform float uAspect;
        uniform vec2 uMouse;
        uniform float uDofStrength;
        uniform float uDofFocusRadius;
        varying vec2 vUv;

        vec3 discBlur(vec2 uv, float blurAmt) {
            vec3 col = texture2D(tDiffuse, uv).rgb;
            if (blurAmt < 0.0005) return col;
            float totalWeight = 1.0;
            float goldenAngle = 2.39996;
            for (int i = 1; i <= 12; i++) {
                float fi = float(i);
                float angle = fi * goldenAngle;
                float radius = sqrt(fi / 12.0) * blurAmt;
                vec2 offset = vec2(cos(angle), sin(angle)) * radius;
                offset.x /= uAspect;
                float weight = 1.0 - (fi / 13.0) * 0.4;
                col += texture2D(tDiffuse, uv + offset).rgb * weight;
                totalWeight += weight;
            }
            return col / totalWeight;
        }

        void main() {
            vec2 uv = vUv;
            vec2 mouseAspect = vec2((uv.x - uMouse.x) * uAspect, uv.y - uMouse.y);
            float dofDist = length(mouseAspect);
            float dofBlur = smoothstep(uDofFocusRadius, uDofFocusRadius + 0.5, dofDist) * uDofStrength;

            vec3 color = (dofBlur > 0.0005)
                ? discBlur(uv, dofBlur)
                : texture2D(tDiffuse, uv).rgb;

            gl_FragColor = vec4(color, 1.0);
        }
    `
};
