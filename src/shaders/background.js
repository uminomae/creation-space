// background.js — 背景グラデーションシェーダー

import * as THREE from 'three';
import {
    BG_V002_CENTER, BG_V002_EDGE,
    BG_V004_CENTER, BG_V004_EDGE,
} from '../config.js';

export function createBackgroundMaterial() {
    return new THREE.ShaderMaterial({
        uniforms: {
            uColorCenterA: { value: BG_V002_CENTER },
            uColorEdgeA:   { value: BG_V002_EDGE },
            uColorCenterB: { value: BG_V004_CENTER },
            uColorEdgeB:   { value: BG_V004_EDGE },
            uMix: { value: 1.0 },
            uOpacity: { value: 1.0 },
            uTime: { value: 0.0 },
            uFlowSpeed: { value: 0.06 },
            uNoiseScale: { value: 3.4 },
            uWarpStrength: { value: 0.5 },
            uSoftness: { value: 0.65 },
            uDepthFade: { value: 0.62 },
            uBrightness: { value: 0.42 },
            uSwirl: { value: 0.55 },
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vObjPos;
            varying vec3 vViewPos;
            void main() {
                vUv = uv;
                vObjPos = position;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vViewPos = mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 uColorCenterA;
            uniform vec3 uColorEdgeA;
            uniform vec3 uColorCenterB;
            uniform vec3 uColorEdgeB;
            uniform float uMix;
            uniform float uOpacity;
            uniform float uTime;
            uniform float uFlowSpeed;
            uniform float uNoiseScale;
            uniform float uWarpStrength;
            uniform float uSoftness;
            uniform float uDepthFade;
            uniform float uBrightness;
            uniform float uSwirl;
            varying vec2 vUv;
            varying vec3 vObjPos;
            varying vec3 vViewPos;

            const float PI = 3.14159265359;
            const float TAU = 6.28318530718;

            float hash12(vec2 p) {
                vec3 p3 = fract(vec3(p.xyx) * 0.1031);
                p3 += dot(p3, p3.yzx + 33.33);
                return fract((p3.x + p3.y) * p3.z);
            }

            float noise2(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                vec2 u = f * f * (3.0 - 2.0 * f);

                float a = hash12(i + vec2(0.0, 0.0));
                float b = hash12(i + vec2(1.0, 0.0));
                float c = hash12(i + vec2(0.0, 1.0));
                float d = hash12(i + vec2(1.0, 1.0));

                return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
            }

            float fbm(vec2 p) {
                float sum = 0.0;
                float amp = 0.5;
                for (int i = 0; i < 5; i++) {
                    sum += amp * noise2(p);
                    p = mat2(1.6, 1.2, -1.2, 1.6) * p + vec2(7.1, 3.7);
                    amp *= 0.52;
                }
                return sum;
            }

            void main() {
                vec3 dir = normalize(vObjPos);
                float azimuth = atan(dir.z, dir.x);
                float elevation = asin(clamp(dir.y, -1.0, 1.0));
                vec2 sphereUv = vec2(fract(azimuth / TAU + 0.5), elevation / PI + 0.5);
                float flowTime = uTime * uFlowSpeed;
                float equatorBand = pow(1.0 - abs(dir.y), 0.45 + uSwirl * 0.28);
                float swirlWave = sin(
                    sphereUv.y * TAU * (1.0 + uSwirl * 0.35)
                    + flowTime * 1.4
                    + azimuth * (0.6 + uSwirl)
                );
                vec2 base = vec2(
                    (sphereUv.x - 0.5) * (2.4 + uSwirl * 1.8) + swirlWave * 0.22,
                    (sphereUv.y - 0.5) * (2.0 + uSwirl * 0.7) - flowTime * (0.75 + uSwirl * 0.25)
                );

                float warp = fbm(base * uNoiseScale + vec2(flowTime * 0.25, -flowTime * 0.18));
                vec2 q = base + vec2(warp * uWarpStrength, -warp * (0.25 + uWarpStrength * 0.5));
                float liquidA = fbm(q * (uNoiseScale * 1.35) + vec2(flowTime * 0.42, -flowTime * 0.58));
                float liquidB = fbm(q * (uNoiseScale * 2.1) - vec2(flowTime * 0.36, flowTime * 0.21));
                float liquid = clamp(mix(liquidA, liquidB, 0.48), 0.0, 1.0);

                float softness = clamp(uSoftness, 0.01, 1.0);
                float contrastPow = mix(1.9, 0.75, softness);
                float stream = pow(liquid, contrastPow);
                float azimuthBand = 0.5 + 0.5 * sin(azimuth * (3.0 + uSwirl * 1.8) + flowTime * 2.0 + warp * 4.0);
                float bandMix = clamp(mix(equatorBand, azimuthBand, 0.45), 0.0, 1.0);

                vec3 centerColor = mix(uColorCenterA, uColorCenterB, uMix);
                vec3 edgeColor = mix(uColorEdgeA, uColorEdgeB, uMix);
                vec3 baseColor = mix(centerColor, edgeColor, clamp(0.2 + stream * 0.8, 0.0, 1.0));
                baseColor *= mix(0.72, 1.2, bandMix);

                float lineGlow = smoothstep(0.5, 1.0, stream + warp * 0.2 + bandMix * 0.2);
                vec3 highlight = mix(centerColor, edgeColor, 0.35) * lineGlow * 0.22;
                vec3 color = baseColor * (0.3 + stream * 0.66) + highlight;

                vec3 viewRay = normalize(vViewPos);
                float forward = clamp(-viewRay.z, 0.0, 1.0);
                float depthGrade = mix(1.0, 0.62 + equatorBand * 0.38, clamp(uDepthFade, 0.0, 1.0));
                float depthFog = mix(0.62, 1.0, forward);
                float sphereVignette = mix(0.86, 1.12, bandMix);

                color *= depthGrade;
                color *= depthFog;
                color *= sphereVignette;
                color *= (0.03 + uBrightness * 0.42);

                float grain = hash12(vUv * 193.7 + uTime * 0.013);
                color += (grain - 0.5) * 0.01;

                float opacity = clamp(uOpacity * mix(0.7, 1.0, forward), 0.0, 1.0);
                color *= opacity;
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        transparent: false,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
    });
}

export function createBackgroundMesh(material) {
    const geo = new THREE.SphereGeometry(1, 160, 96);
    const mesh = new THREE.Mesh(geo, material);
    mesh.renderOrder = -10000;
    mesh.frustumCulled = false;
    return mesh;
}
