// liquid.js — リキッド（簡易流体 + 密度レンダリング）
// - Navier-Stokes系（発散→圧力→勾配減算）の最小構成
// - マウス追従で速度/密度を注入
// ★ 初期値は config.js の liquidParams を参照

import * as THREE from 'three';
import { liquidParams } from '../config.js';
import { noiseGLSL } from './noise.glsl.js';

import {
    LIQUID_FULLSCREEN_VERT,
    LIQUID_ADVECTION_FRAG,
    LIQUID_DIVERGENCE_FRAG,
    LIQUID_POISSON_FRAG,
    LIQUID_GRADIENT_SUBTRACT_FRAG,
    LIQUID_FORCE_FRAG,
    LIQUID_DENSITY_SPLAT_FRAG,
    LIQUID_COPY_DENSITY_FRAG,
    LIQUID_RENDER_FRAG_BODY,
} from './liquid-shaders.glsl.js';

const DEFAULT_LIQUID_SIZE = 128;

export function createLiquidSystem(renderer) {
    const size = liquidParams.textureSize ?? DEFAULT_LIQUID_SIZE;
    const texel = 1.0 / size;

    const opts = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
    };

    // ピンポンバッファ
    const velocityA = new THREE.WebGLRenderTarget(size, size, opts);
    const velocityB = new THREE.WebGLRenderTarget(size, size, opts);
    const densityA  = new THREE.WebGLRenderTarget(size, size, opts);
    const densityB  = new THREE.WebGLRenderTarget(size, size, opts);
    const pressureA = new THREE.WebGLRenderTarget(size, size, opts);
    const pressureB = new THREE.WebGLRenderTarget(size, size, opts);
    const divergence = new THREE.WebGLRenderTarget(size, size, opts);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    // --- 移流（Advection） ---
    const advectionMaterial = new THREE.ShaderMaterial({
        uniforms: {
            tVelocity:   { value: null },
            tSource:     { value: null },
            uTimestep:   { value: liquidParams.timestep },
            uDissipation: { value: liquidParams.dissipation },
        },
        vertexShader: LIQUID_FULLSCREEN_VERT,
        fragmentShader: LIQUID_ADVECTION_FRAG,
        depthTest: false,
        depthWrite: false,
    });

    // --- 発散（Divergence） ---
    const divergenceMaterial = new THREE.ShaderMaterial({
        uniforms: {
            tVelocity: { value: null },
            uTexel: { value: texel },
        },
        vertexShader: LIQUID_FULLSCREEN_VERT,
        fragmentShader: LIQUID_DIVERGENCE_FRAG,
        depthTest: false,
        depthWrite: false,
    });

    // --- Poisson（圧力） ---
    const poissonMaterial = new THREE.ShaderMaterial({
        uniforms: {
            tPressure:   { value: null },
            tDivergence: { value: null },
            uTexel: { value: texel },
        },
        vertexShader: LIQUID_FULLSCREEN_VERT,
        fragmentShader: LIQUID_POISSON_FRAG,
        depthTest: false,
        depthWrite: false,
    });

    // --- 勾配減算（非圧縮化） ---
    const gradientMaterial = new THREE.ShaderMaterial({
        uniforms: {
            tPressure: { value: null },
            tVelocity: { value: null },
            uTexel: { value: texel },
        },
        vertexShader: LIQUID_FULLSCREEN_VERT,
        fragmentShader: LIQUID_GRADIENT_SUBTRACT_FRAG,
        depthTest: false,
        depthWrite: false,
    });

    // --- 外力（速度の注入） ---
    const forceMaterial = new THREE.ShaderMaterial({
        uniforms: {
            tVelocity:  { value: null },
            uMouse:     { value: new THREE.Vector2(0.5, 0.5) },
            uMouseVel:  { value: new THREE.Vector2(0, 0) },
            uRadius:    { value: liquidParams.forceRadius },
            uStrength:  { value: liquidParams.forceStrength },
        },
        vertexShader: LIQUID_FULLSCREEN_VERT,
        fragmentShader: LIQUID_FORCE_FRAG,
        depthTest: false,
        depthWrite: false,
    });

    // --- 密度の注入 ---
    const splatMaterial = new THREE.ShaderMaterial({
        uniforms: {
            tDensity:   { value: null },
            uMouse:     { value: new THREE.Vector2(0.5, 0.5) },
            uMouseVel:  { value: new THREE.Vector2(0, 0) },
            uRadius:    { value: liquidParams.forceRadius },
            uGain:      { value: liquidParams.splatGain ?? 5.0 },
        },
        vertexShader: LIQUID_FULLSCREEN_VERT,
        fragmentShader: LIQUID_DENSITY_SPLAT_FRAG,
        depthTest: false,
        depthWrite: false,
    });

    // --- 密度コピー（フィードバックループ回避用） ---
    const copyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            tDensity: { value: null },
        },
        vertexShader: LIQUID_FULLSCREEN_VERT,
        fragmentShader: LIQUID_COPY_DENSITY_FRAG,
        depthTest: false,
        depthWrite: false,
    });

    // --- 密度レンダリング（色 + α） ---
    const renderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            tDensity:    { value: null },
            uTime:       { value: 0 },
            uTexel:      { value: texel },
            uDensityMul: { value: liquidParams.densityMul },
            uNoiseScale: { value: liquidParams.noiseScale },
            uNoiseSpeed: { value: liquidParams.noiseSpeed },
            uNoiseAmp:   { value: liquidParams.noiseAmp ?? 0.1 },
            uSpecPow:    { value: liquidParams.specularPow },
            uSpecInt:    { value: liquidParams.specularInt },
            uBaseColor:  { value: new THREE.Vector3(liquidParams.baseColorR, liquidParams.baseColorG, liquidParams.baseColorB) },
            uHighlight:  { value: new THREE.Vector3(liquidParams.highlightR, liquidParams.highlightG, liquidParams.highlightB) },
            uNormalZ:    { value: liquidParams.normalZ ?? 0.3 },
            uDiffuseGain:{ value: liquidParams.diffuseGain ?? 0.3 },
            uDensityEdge:{ value: liquidParams.densityEdge ?? 0.5 },
            uAlphaEdge:  { value: liquidParams.alphaEdge ?? 0.3 },
            uAlphaMax:   { value: liquidParams.alphaMax ?? 0.9 },
        },
        vertexShader: LIQUID_FULLSCREEN_VERT,
        fragmentShader: /* glsl */`
            ${noiseGLSL}
            ${LIQUID_RENDER_FRAG_BODY}
        `,
        transparent: true,
        depthTest: false,
        depthWrite: false,
    });

    const quad = new THREE.Mesh(geometry, advectionMaterial);
    scene.add(quad);

    let velRead = velocityA, velWrite = velocityB;
    let denRead = densityA, denWrite = densityB;
    let pressureRead = pressureA, pressureWrite = pressureB;

    return {
        uniforms: {
            simulation: advectionMaterial.uniforms,
            force: forceMaterial.uniforms,
            splat: splatMaterial.uniforms,
            render: renderMaterial.uniforms,
        },

        update(mousePos, mouseVel) {
            // マウス情報を更新
            forceMaterial.uniforms.uMouse.value.copy(mousePos);
            forceMaterial.uniforms.uMouseVel.value.copy(mouseVel);
            splatMaterial.uniforms.uMouse.value.copy(mousePos);
            splatMaterial.uniforms.uMouseVel.value.copy(mouseVel);

            // 1. 外力（速度）
            forceMaterial.uniforms.tVelocity.value = velRead.texture;
            quad.material = forceMaterial;
            renderer.setRenderTarget(velWrite);
            renderer.render(scene, camera);
            {
                const tmp = velRead;
                velRead = velWrite;
                velWrite = tmp;
            }

            // 1b. 密度
            splatMaterial.uniforms.tDensity.value = denRead.texture;
            quad.material = splatMaterial;
            renderer.setRenderTarget(denWrite);
            renderer.render(scene, camera);
            {
                const tmp = denRead;
                denRead = denWrite;
                denWrite = tmp;
            }

            // 2. 移流（速度）
            advectionMaterial.uniforms.tVelocity.value = velRead.texture;
            advectionMaterial.uniforms.tSource.value = velRead.texture;
            quad.material = advectionMaterial;
            renderer.setRenderTarget(velWrite);
            renderer.render(scene, camera);
            {
                const tmp = velRead;
                velRead = velWrite;
                velWrite = tmp;
            }

            // 3. 移流（密度）
            advectionMaterial.uniforms.tVelocity.value = velRead.texture;
            advectionMaterial.uniforms.tSource.value = denRead.texture;
            quad.material = advectionMaterial;
            renderer.setRenderTarget(denWrite);
            renderer.render(scene, camera);
            {
                const tmp = denRead;
                denRead = denWrite;
                denWrite = tmp;
            }

            // 4. 発散
            divergenceMaterial.uniforms.tVelocity.value = velRead.texture;
            quad.material = divergenceMaterial;
            renderer.setRenderTarget(divergence);
            renderer.render(scene, camera);

            // 5. Poisson（圧力）
            for (let i = 0; i < liquidParams.iterations; i++) {
                poissonMaterial.uniforms.tPressure.value = pressureRead.texture;
                poissonMaterial.uniforms.tDivergence.value = divergence.texture;
                quad.material = poissonMaterial;
                renderer.setRenderTarget(pressureWrite);
                renderer.render(scene, camera);
                [pressureRead, pressureWrite] = [pressureWrite, pressureRead];
            }

            // 6. 勾配減算
            gradientMaterial.uniforms.tPressure.value = pressureRead.texture;
            gradientMaterial.uniforms.tVelocity.value = velRead.texture;
            quad.material = gradientMaterial;
            renderer.setRenderTarget(velWrite);
            renderer.render(scene, camera);
            {
                const tmp = velRead;
                velRead = velWrite;
                velWrite = tmp;
            }

            renderer.setRenderTarget(null);
        },

        render(target) {
            renderMaterial.uniforms.tDensity.value = denRead.texture;
            quad.material = renderMaterial;
            renderer.setRenderTarget(target);
            renderer.render(scene, camera);
            renderer.setRenderTarget(null);
        },

        // 密度を白テクスチャとしてコピー（WebGLフィードバックループ回避用）
        copyDensityTo(target) {
            copyMaterial.uniforms.tDensity.value = denRead.texture;
            quad.material = copyMaterial;
            renderer.setRenderTarget(target);
            renderer.render(scene, camera);
            renderer.setRenderTarget(null);
        },

        setTime(t) {
            renderMaterial.uniforms.uTime.value = t;
        },

        getDensityTexture() {
            return denRead.texture;
        },

        getVelocityTexture() {
            return velRead.texture;
        },

        dispose() {
            velocityA.dispose();
            velocityB.dispose();
            densityA.dispose();
            densityB.dispose();
            pressureA.dispose();
            pressureB.dispose();
            divergence.dispose();
            geometry.dispose();
            advectionMaterial.dispose();
            divergenceMaterial.dispose();
            poissonMaterial.dispose();
            gradientMaterial.dispose();
            forceMaterial.dispose();
            splatMaterial.dispose();
            renderMaterial.dispose();
            copyMaterial.dispose();
        }
    };
}
