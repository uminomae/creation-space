// fluid-field.js — ピンポンバッファ流体フィールド
// ★ 初期値は config.js の fluidParams を参照

import * as THREE from 'three';
import { fluidParams } from '../config.js';

// CHANGED: 256→128 (GPU負荷/メモリ75%削減、influence=0.06で視覚影響なし)
const FIELD_SIZE = 128;

export function createFluidSystem(renderer) {
    const opts = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
    };

    const targetA = new THREE.WebGLRenderTarget(FIELD_SIZE, FIELD_SIZE, opts);
    const targetB = new THREE.WebGLRenderTarget(FIELD_SIZE, FIELD_SIZE, opts);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const material = new THREE.ShaderMaterial({
        uniforms: {
            tPrevField:     { value: null },
            uMouse:         { value: new THREE.Vector2(0.5, 0.5) },
            uMouseVelocity: { value: new THREE.Vector2(0, 0) },
            uDecay:         { value: fluidParams.decay },
            uRadius:        { value: fluidParams.radius },
            uForce:         { value: fluidParams.force },
            uCurl:          { value: fluidParams.curl },
            uAspect:        { value: 1.0 },
        },

        vertexShader: /* glsl */`
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,

        fragmentShader: /* glsl */`
            uniform sampler2D tPrevField;
            uniform vec2 uMouse;
            uniform vec2 uMouseVelocity;
            uniform float uDecay;
            uniform float uRadius;
            uniform float uForce;
            uniform float uCurl;
            uniform float uAspect;
            varying vec2 vUv;

            void main() {
                vec2 uv = vUv;
                float texel = 1.0 / ${FIELD_SIZE}.0;
                vec2 prev = texture2D(tPrevField, uv).rg;
                vec2 n1 = texture2D(tPrevField, uv + vec2(texel, 0.0)).rg;
                vec2 n2 = texture2D(tPrevField, uv - vec2(texel, 0.0)).rg;
                vec2 n3 = texture2D(tPrevField, uv + vec2(0.0, texel)).rg;
                vec2 n4 = texture2D(tPrevField, uv - vec2(0.0, texel)).rg;
                vec2 neighbors = (n1 + n2 + n3 + n4) * 0.25;
                vec2 field = mix(prev, neighbors, 0.18);
                vec2 advectUv = uv - prev * 0.003;
                vec2 advected = texture2D(tPrevField, advectUv).rg;
                field = mix(field, advected, 0.25);
                field *= uDecay;
                vec2 diff = uv - uMouse;
                diff.x *= uAspect;
                float dist = length(diff);
                float influence = smoothstep(uRadius, 0.0, dist);
                float speed = length(uMouseVelocity);
                if (speed > 0.0003) {
                    field += uMouseVelocity * influence * uForce;
                    vec2 dir = normalize(diff + vec2(0.00001));
                    vec2 curlVec = vec2(-dir.y, dir.x);
                    field += curlVec * speed * influence * uCurl;
                }
                field = clamp(field, vec2(-0.5), vec2(0.5));
                gl_FragColor = vec4(field, 0.0, 1.0);
            }
        `,
        depthTest: false,
        depthWrite: false,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    let read = targetA;
    let write = targetB;

    return {
        uniforms: material.uniforms,
        update() {
            material.uniforms.tPrevField.value = read.texture;
            renderer.setRenderTarget(write);
            renderer.render(scene, camera);
            renderer.setRenderTarget(null);
            [read, write] = [write, read];
        },
        getTexture() {
            return read.texture;
        },
        dispose() {
            targetA.dispose();
            targetB.dispose();
            material.dispose();
        }
    };
}
