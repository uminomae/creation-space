import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { breathValue } from './animation-utils.js';
import { initControls, setCameraPosition, updateControls, getScrollProgress } from './controls.js';
import { initMouseTracking, updateMouseSmoothing } from './mouse-state.js';
import { createScene, updateScene } from './scene.js';
import { initScrollUI, updateScrollUI } from './scroll-ui.js';
import { initDevPanel } from './dev-panel.js';
import { createFluidSystem } from './shaders/fluid-field.js';
import { createLiquidSystem } from './shaders/liquid.js';
import { CameraDofShader, DistortionShader } from './shaders/distortion-pass.js';
import {
    breathConfig,
    distortionParams,
    fluidParams,
    liquidParams,
    quantumWaveParams,
    sceneParams,
    toggles,
} from './config.js';
import { detectLang } from './i18n.js';

const DEV_MODE = new URLSearchParams(window.location.search).has('dev');
let devStatsBegin = () => {};
let devStatsEnd = () => {};

const STRINGS = {
    ja: {
        title: '創造とは',
        subtitle: 'Creation Field',
        taglines: [
            '関係し合う欠片が、まだ名前を持たない輪郭を生む。',
            '観測と選択のあいだで、創造は静かに立ち上がる。',
        ],
        topbarMainTitle: '創造とは',
        topbarSubtitle: 'Creation Space',
        topbarHome: 'HOME',
        topbarArticles: 'ARTICLES',
        topbarCollab: 'AIとの協働で探索中',
        creditSignature: 'Project Concept: What Is Creation',
        articlesSectionHeading: 'ARTICLES',
        offcanvasArticlesTitle: 'ARTICLES',
        creationCardsHeading: 'CREATION CARDS',
        creationCardTitlePrefix: 'Card Slot',
        creationCardBody: '内容は後続指定',
        langToggleLabel: 'English',
        langToggleAria: '言語を英語に切り替え',
    },
    en: {
        title: 'What Is Creation',
        subtitle: 'Creation Field',
        taglines: [
            'Fragments in relation generate forms before they are named.',
            'Creation rises quietly between observation and choice.',
        ],
        topbarMainTitle: 'What Is Creation',
        topbarSubtitle: 'Creation Space',
        topbarHome: 'HOME',
        topbarArticles: 'ARTICLES',
        topbarCollab: 'Exploring with AI collaboration',
        creditSignature: 'Project Concept: What Is Creation',
        articlesSectionHeading: 'ARTICLES',
        offcanvasArticlesTitle: 'ARTICLES',
        creationCardsHeading: 'CREATION CARDS',
        creationCardTitlePrefix: 'Card Slot',
        creationCardBody: 'content to be specified',
        langToggleLabel: '日本語',
        langToggleAria: 'Switch language to Japanese',
    },
};

function applyCreationPreset() {
    Object.assign(toggles, {
        background: true,
        field: false,
        flowObjects: true,
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
    });
}

function applyPageLanguage(lang) {
    const strings = STRINGS[lang] || STRINGS.ja;

    const titleH1 = document.getElementById('title-h1');
    const titleSub = document.getElementById('title-sub');
    const taglineContainer = document.getElementById('taglines');
    const topbarMainTitle = document.getElementById('topbar-main-title');
    const topbarSubtitle = document.getElementById('topbar-subtitle');
    const topbarHomeLink = document.getElementById('topbar-home-link');
    const topbarArticlesBtn = document.getElementById('topbar-articles-btn');
    const topbarCollab = document.getElementById('credit-collab');
    const creditSignature = document.getElementById('credit-signature');
    const articlesSectionHeading = document.getElementById('articles-section-heading');
    const offcanvasArticlesTitle = document.getElementById('offcanvas-articles-title');
    const creationCardsHeading = document.getElementById('creation-cards-heading');
    const langToggle = document.getElementById('lang-toggle');

    if (titleH1) titleH1.textContent = strings.title;
    if (titleSub) titleSub.textContent = strings.subtitle;
    if (topbarMainTitle) topbarMainTitle.textContent = strings.topbarMainTitle;
    if (topbarSubtitle) topbarSubtitle.textContent = strings.topbarSubtitle;
    if (topbarHomeLink) topbarHomeLink.textContent = strings.topbarHome;
    if (topbarArticlesBtn) topbarArticlesBtn.textContent = strings.topbarArticles;
    if (topbarCollab) topbarCollab.textContent = strings.topbarCollab;
    if (creditSignature) creditSignature.textContent = strings.creditSignature;
    if (articlesSectionHeading) articlesSectionHeading.textContent = strings.articlesSectionHeading;
    if (offcanvasArticlesTitle) offcanvasArticlesTitle.textContent = strings.offcanvasArticlesTitle;
    if (creationCardsHeading) creationCardsHeading.textContent = strings.creationCardsHeading;
    if (langToggle) {
        langToggle.textContent = strings.langToggleLabel;
        langToggle.setAttribute('aria-label', strings.langToggleAria);
    }

    [1, 2, 3].forEach((slotIndex) => {
        const titleNode = document.getElementById(`creation-card-slot-${slotIndex}-title`);
        const bodyNode = document.getElementById(`creation-card-slot-${slotIndex}-body`);
        if (titleNode) titleNode.textContent = `${strings.creationCardTitlePrefix} ${String(slotIndex).padStart(2, '0')}`;
        if (bodyNode) bodyNode.textContent = strings.creationCardBody;
    });

    if (taglineContainer) {
        taglineContainer.innerHTML = '';
        const isEn = lang === 'en';
        strings.taglines.forEach((text) => {
            const p = document.createElement('p');
            p.className = isEn ? 'tagline-en' : 'tagline';
            p.textContent = text;
            taglineContainer.appendChild(p);
        });
    }

    document.documentElement.lang = lang;
}

function applyQuantumWaveUniforms(distortionPass) {
    if (!toggles.quantumWave) {
        distortionPass.uniforms.uQWaveStrength.value = 0;
        return;
    }

    const qp = quantumWaveParams;
    const du = distortionPass.uniforms;
    du.uQWaveStrength.value = qp.strength;
    du.uQWaveSpeed.value = qp.speed;
    du.uQWaveBaseFreq.value = qp.baseFreq;
    du.uQWaveDispersion.value = qp.dispersion;
    du.uQWaveNoiseAmp.value = qp.noiseAmp;
    du.uQWaveNoiseScale.value = qp.noiseScale;
    du.uQWaveCount.value = qp.waveCount;
    du.uQWaveEnvelope.value = qp.envelope;
    du.uQWaveYInfluence.value = qp.yInfluence;
    du.uQWaveGlowAmount.value = qp.glowAmount;
    du.uQWaveGlowColorR.value = qp.glowColorR;
    du.uQWaveGlowColorG.value = qp.glowColorG;
    du.uQWaveGlowColorB.value = qp.glowColorB;
    du.uQWaveCaberration.value = qp.caberration;
    du.uQWaveRimBright.value = qp.rimBright;
    du.uQWaveBlurAmount.value = qp.blurAmount;
    du.uQWaveFogDensity.value = qp.fogDensity;
    du.uQWaveFogColorR.value = qp.fogColorR;
    du.uQWaveFogColorG.value = qp.fogColorG;
    du.uQWaveFogColorB.value = qp.fogColorB;
    du.uQWaveDarken.value = qp.darken;
    du.uQWaveTurbulence.value = qp.turbulence;
    du.uQWaveSharpness.value = qp.sharpness;
}

function attachResize({ camera, renderer, composer }) {
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);
}

function main() {
    applyCreationPreset();
    applyPageLanguage(detectLang());
    initMouseTracking();

    const container = document.getElementById('canvas-container');
    if (!container) return;

    const { scene, camera, renderer } = createScene(container);
    renderer.autoClear = false;

    const fluidSystem = createFluidSystem(renderer);
    const liquidSystem = createLiquidSystem(renderer);
    const liquidTarget = new THREE.WebGLRenderTarget(liquidParams.textureSize, liquidParams.textureSize, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
    });

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const distortionPass = new ShaderPass(DistortionShader);
    distortionPass.uniforms.uLiquidOffsetScale.value = liquidParams.refractOffsetScale;
    distortionPass.uniforms.uLiquidThreshold.value = liquidParams.refractThreshold;
    composer.addPass(distortionPass);

    const dofPass = new ShaderPass(CameraDofShader);
    composer.addPass(dofPass);

    initControls(camera, container, renderer);
    initScrollUI();
    attachResize({ camera, renderer, composer });

    if (DEV_MODE) {
        import('./dev-links-panel.js').then(({ initDevLinksPanel }) => {
            initDevLinksPanel();
        }).catch((err) => {
            console.warn('[dev-links] init failed:', err.message);
        });

        import('./dev-stats.js').then(({ initDevStats, statsBegin, statsEnd }) => {
            devStatsBegin = statsBegin;
            devStatsEnd = statsEnd;
            initDevStats().catch((err) => {
                console.warn('[dev-stats] init failed:', err.message);
            });
        }).catch((err) => {
            console.warn('[dev-stats] import failed:', err.message);
        });
    }

    initDevPanel({
        onStateChanged: () => {
            setCameraPosition(sceneParams.camX, sceneParams.camY, sceneParams.camZ);
        },
    });

    const liquidMousePos = new THREE.Vector2();
    const liquidMouseVel = new THREE.Vector2();
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        devStatsBegin();

        const time = clock.getElapsedTime();
        const breathVal = breathValue(time, breathConfig.period);
        const scrollProg = getScrollProgress();

        updateScrollUI(scrollProg, breathVal);
        const mouse = updateMouseSmoothing();

        setCameraPosition(sceneParams.camX, sceneParams.camY, sceneParams.camZ);
        updateControls(time, breathVal);
        updateScene(time);

        if (toggles.fluidField) {
            fluidSystem.uniforms.uForce.value = fluidParams.force;
            fluidSystem.uniforms.uCurl.value = fluidParams.curl;
            fluidSystem.uniforms.uDecay.value = fluidParams.decay;
            fluidSystem.uniforms.uRadius.value = fluidParams.radius;
            distortionPass.uniforms.uFluidInfluence.value = fluidParams.influence;
            fluidSystem.uniforms.uMouse.value.set(mouse.smoothX, mouse.smoothY);
            fluidSystem.uniforms.uMouseVelocity.value.set(mouse.velX, mouse.velY);
            fluidSystem.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
            fluidSystem.update();
            distortionPass.uniforms.tFluidField.value = fluidSystem.getTexture();
        } else {
            distortionPass.uniforms.uFluidInfluence.value = 0;
        }

        if (toggles.liquid) {
            liquidSystem.uniforms.simulation.uTimestep.value = liquidParams.timestep;
            liquidSystem.uniforms.simulation.uDissipation.value = liquidParams.dissipation;
            liquidSystem.uniforms.force.uRadius.value = liquidParams.forceRadius;
            liquidSystem.uniforms.splat.uRadius.value = liquidParams.forceRadius;
            liquidSystem.uniforms.force.uStrength.value = liquidParams.forceStrength;
            liquidSystem.uniforms.render.uDensityMul.value = liquidParams.densityMul;
            liquidSystem.uniforms.render.uNoiseScale.value = liquidParams.noiseScale;
            liquidSystem.uniforms.render.uNoiseSpeed.value = liquidParams.noiseSpeed;
            liquidSystem.uniforms.render.uSpecPow.value = liquidParams.specularPow;
            liquidSystem.uniforms.render.uSpecInt.value = liquidParams.specularInt;

            liquidMousePos.set(mouse.smoothX, mouse.smoothY);
            liquidMouseVel.set(mouse.velX, mouse.velY);
            liquidSystem.update(liquidMousePos, liquidMouseVel);
            liquidSystem.setTime(time);
            liquidSystem.copyDensityTo(liquidTarget);
            distortionPass.uniforms.tLiquid.value = liquidTarget.texture;
            distortionPass.uniforms.uLiquidStrength.value = liquidParams.densityMul;
            distortionPass.uniforms.uLiquidOffsetScale.value = liquidParams.refractOffsetScale;
            distortionPass.uniforms.uLiquidThreshold.value = liquidParams.refractThreshold;
        } else {
            distortionPass.uniforms.uLiquidStrength.value = 0;
        }

        applyQuantumWaveUniforms(distortionPass);

        distortionPass.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
        distortionPass.uniforms.uTime.value = time;
        distortionPass.uniforms.uMouse.value.set(mouse.smoothX, mouse.smoothY);
        dofPass.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
        dofPass.uniforms.uMouse.value.set(mouse.smoothX, mouse.smoothY);

        if (toggles.heatHaze) {
            distortionPass.uniforms.uHeatHaze.value = distortionParams.heatHaze;
            distortionPass.uniforms.uHeatHazeRadius.value = distortionParams.heatHazeRadius;
            distortionPass.uniforms.uHeatHazeSpeed.value = distortionParams.heatHazeSpeed;
        } else {
            distortionPass.uniforms.uHeatHaze.value = 0;
        }

        if (toggles.dof) {
            dofPass.uniforms.uDofStrength.value = distortionParams.dofStrength;
            dofPass.uniforms.uDofFocusRadius.value = distortionParams.dofFocusRadius;
        } else {
            dofPass.uniforms.uDofStrength.value = 0;
        }

        renderer.clear();
        if (toggles.postProcess) {
            composer.render();
        } else {
            renderer.render(scene, camera);
        }
        devStatsEnd();
    }

    animate();
}

main();
