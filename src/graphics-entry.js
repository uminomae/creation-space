import { applyScenePreset, resolveSceneVariant } from './scene-presets.js';

const GRAPHIC_MODE_DEFAULT = 'hoji';
const SCENE_VARIANTS = new Set(['hold', 'wabi', 'intent']);

function normalizeGraphicMode(mode) {
    if (mode === 'sinobi') return 'sinobi';
    if (mode === 'i') return 'i';
    return GRAPHIC_MODE_DEFAULT;
}

function normalizeSceneVariant(sceneVariant, graphicMode) {
    if (SCENE_VARIANTS.has(sceneVariant)) return sceneVariant;
    return resolveSceneVariant(normalizeGraphicMode(graphicMode));
}

async function loadSceneModule(sceneVariant) {
    if (sceneVariant === 'intent') {
        return import('./scene-intent.js');
    }
    if (sceneVariant === 'wabi') {
        return import('./scene.js');
    }
    return import('./scene-hold.js');
}

function resolveContainer(container) {
    if (typeof container === 'string') {
        const node = document.querySelector(container);
        if (!(node instanceof HTMLElement)) {
            throw new Error(`Container not found: ${container}`);
        }
        return node;
    }
    if (container instanceof HTMLElement) return container;
    throw new Error('`container` must be an HTMLElement or selector string.');
}

function resolveViewportSize(container) {
    const rect = container.getBoundingClientRect();
    const width = Math.max(
        1,
        Math.round(rect.width || container.clientWidth || window.innerWidth || 1)
    );
    const height = Math.max(
        1,
        Math.round(rect.height || container.clientHeight || window.innerHeight || 1)
    );
    return { width, height };
}

export async function createEmbeddedGraphic({
    container,
    graphicMode = GRAPHIC_MODE_DEFAULT,
    sceneVariant = null,
    clearContainer = false,
    autoStart = true,
    autoResize = true,
    onBeforeFrame = null,
    onAfterFrame = null,
} = {}) {
    const host = resolveContainer(container);
    if (clearContainer) host.textContent = '';

    const resolvedSceneVariant = normalizeSceneVariant(sceneVariant, graphicMode);
    applyScenePreset(resolvedSceneVariant);

    const sceneModule = await loadSceneModule(resolvedSceneVariant);
    const { scene, camera, renderer } = sceneModule.createScene(host);

    // Intent:
    // scene modules are window-size oriented in their defaults; this keeps camera/renderer
    // aligned to the embed container from the first frame and on subsequent resizes.
    function resize() {
        const { width, height } = resolveViewportSize(host);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    let animationFrameId = 0;
    let running = false;
    let elapsedOffsetSec = 0.0;
    let runStartMs = 0.0;
    let resizeObserver = null;

    function currentElapsedSec() {
        if (running) {
            return elapsedOffsetSec + ((performance.now() - runStartMs) * 0.001);
        }
        return elapsedOffsetSec;
    }

    function frame() {
        if (!running) return;
        animationFrameId = window.requestAnimationFrame(frame);
        const elapsedSec = currentElapsedSec();

        if (typeof onBeforeFrame === 'function') {
            onBeforeFrame({
                elapsedSec,
                scene,
                camera,
                renderer,
                sceneVariant: resolvedSceneVariant,
            });
        }

        sceneModule.updateScene(elapsedSec);
        renderer.clear();
        renderer.render(scene, camera);

        if (typeof onAfterFrame === 'function') {
            onAfterFrame({
                elapsedSec,
                scene,
                camera,
                renderer,
                sceneVariant: resolvedSceneVariant,
            });
        }
    }

    function start() {
        if (running) return;
        runStartMs = performance.now();
        running = true;
        frame();
    }

    function stop() {
        if (!running) return;
        elapsedOffsetSec = currentElapsedSec();
        running = false;
        if (animationFrameId) {
            window.cancelAnimationFrame(animationFrameId);
            animationFrameId = 0;
        }
    }

    function destroy() {
        stop();
        window.removeEventListener('resize', resize);
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
        if (renderer?.domElement?.parentElement === host) {
            host.removeChild(renderer.domElement);
        }
        if (typeof renderer?.dispose === 'function') renderer.dispose();
        if (typeof renderer?.forceContextLoss === 'function') renderer.forceContextLoss();
    }

    if (autoResize) {
        window.addEventListener('resize', resize);
        if (typeof window.ResizeObserver === 'function') {
            resizeObserver = new window.ResizeObserver(() => resize());
            resizeObserver.observe(host);
        }
    }

    resize();
    if (autoStart) start();

    return {
        sceneVariant: resolvedSceneVariant,
        scene,
        camera,
        renderer,
        canvas: renderer.domElement,
        start,
        stop,
        resize,
        destroy,
        isRunning() {
            return running;
        },
        getElapsedSec() {
            return currentElapsedSec();
        },
    };
}
