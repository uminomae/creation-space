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
                float axisDepth = clamp(vObjPos.y + 0.5, 0.0, 1.0);
                float flowTime = uTime * uFlowSpeed;
                vec2 uv = vec2(vUv.x, axisDepth - flowTime);
                float azimuth = vUv.x * 6.2831853;
                float wallBand = pow(abs(cos(azimuth)), 0.45);

                float swirlWave = sin((uv.x + axisDepth * (0.4 + uSwirl)) * 6.2831853 * 2.0 + flowTime * 1.8);
                vec2 base = vec2((uv.x - 0.5) * (2.2 + uSwirl * 1.4), uv.y * 1.8);
                base.x += swirlWave * 0.18 + sin(uv.y * 8.4 + flowTime * 3.0) * 0.05;

                float warp = fbm(base * uNoiseScale + vec2(0.0, flowTime * 0.9));
                vec2 q = base + vec2(warp * uWarpStrength, -warp * (0.25 + uWarpStrength * 0.5));
                float liquidA = fbm(q * (uNoiseScale * 1.45) + vec2(flowTime * 0.28, -flowTime * 0.58));
                float liquidB = fbm(q * (uNoiseScale * 2.35) - vec2(flowTime * 0.42, flowTime * 0.16));
                float liquid = clamp(mix(liquidA, liquidB, 0.45), 0.0, 1.0);

                float softness = clamp(uSoftness, 0.01, 1.0);
                float contrastPow = mix(1.9, 0.75, softness);
                float stream = pow(liquid, contrastPow);
                float corridor = smoothstep(0.08, 1.0, axisDepth);
                float depthStripes = 0.5 + 0.5 * sin(axisDepth * 150.0 - flowTime * 20.0 + warp * 10.0);
                float stripeBoost = smoothstep(0.5, 1.0, depthStripes) * (0.5 + 0.5 * wallBand);

                vec3 centerColor = mix(uColorCenterA, uColorCenterB, uMix);
                vec3 edgeColor = mix(uColorEdgeA, uColorEdgeB, uMix);
                vec3 baseColor = mix(centerColor, edgeColor, clamp(0.2 + stream * 0.8, 0.0, 1.0));
                baseColor *= mix(0.55, 1.15, wallBand);

                float lineGlow = smoothstep(0.55, 1.0, stream + warp * 0.24 + stripeBoost * 0.18);
                vec3 highlight = mix(centerColor, edgeColor, 0.38) * lineGlow * 0.34;
                vec3 color = baseColor * (0.32 + stream * 0.62) + highlight;

                float depthGrade = mix(1.0, corridor, clamp(uDepthFade, 0.0, 1.0));
                float distanceFog = clamp((-vViewPos.z) / 420.0, 0.0, 1.0);
                float depthFog = mix(1.0, 1.0 - distanceFog * 0.68, clamp(uDepthFade, 0.0, 1.0));
                float tubeVignette = mix(0.82, 1.15, wallBand);

                color *= depthGrade;
                color *= depthFog;
                color *= tubeVignette;
                color *= (0.08 + uBrightness);

                float grain = hash12(vUv * 193.7 + uTime * 0.013);
                color += (grain - 0.5) * 0.01;

                float alpha = clamp(uOpacity * mix(0.95, 0.45, distanceFog * clamp(uDepthFade, 0.0, 1.0)), 0.0, 1.0);
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: true,
    });
}

export function createBackgroundMesh(material) {
    const geo = new THREE.CylinderGeometry(1, 1, 1, 128, 48, true);
    const mesh = new THREE.Mesh(geo, material);
    mesh.rotation.x = Math.PI * 0.5;
    mesh.renderOrder = -999;
    mesh.frustumCulled = false;
    return mesh;
}
