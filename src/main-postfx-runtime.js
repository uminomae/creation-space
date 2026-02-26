import { createPostFxBootstrap } from './postfx-bootstrap.js';
import { createPostFxRuntime } from './postfx-runtime.js';
import { attachResize } from './render-resize.js';
import {
    loadPostFxDeps,
    loadFluidFactory,
    loadLiquidFactory,
} from './scene-module-loader.js';
import {
    distortionParams,
    fluidParams,
    liquidParams,
    quantumWaveParams,
    toggles,
} from './config.js';

export function initMainPostFxRuntime({
    renderer,
    scene,
    camera,
    isIntentScene,
}) {
    const postFx = createPostFxBootstrap({
        renderer,
        scene,
        camera,
        liquidParams,
        loadPostFxDeps,
        loadFluidFactory,
        loadLiquidFactory,
    });

    const postFxRuntime = createPostFxRuntime({
        postFx,
        renderer,
        toggles,
        distortionParams,
        fluidParams,
        liquidParams,
        quantumWaveParams,
    });

    postFxRuntime.prewarm(isIntentScene());

    attachResize({
        camera,
        renderer,
        getComposer: () => postFx.getComposer(),
    });

    return {
        postFxRuntime,
    };
}
