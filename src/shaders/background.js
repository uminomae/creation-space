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
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 uColorCenterA;
            uniform vec3 uColorEdgeA;
            uniform vec3 uColorCenterB;
            uniform vec3 uColorEdgeB;
            uniform float uMix;
            uniform float uOpacity;
            varying vec2 vUv;
            void main() {
                float dist = length(vUv - 0.5);
                float vignette = smoothstep(0.0, 1.2, dist);

                vec3 colorA = mix(uColorCenterA, uColorEdgeA, vignette);
                vec3 colorB = mix(uColorCenterB, uColorEdgeB, vignette);
                vec3 color = mix(colorA, colorB, uMix);

                float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
                color += (noise - 0.5) * 0.015;

                gl_FragColor = vec4(color * uOpacity, uOpacity);
            }
        `,
        depthWrite: false,
        depthTest: false
    });
}

export function createBackgroundMesh(material) {
    const geo = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geo, material);
    mesh.renderOrder = -999;
    return mesh;
}
