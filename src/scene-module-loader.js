let postFxDepsPromise = null;
let fluidFactoryPromise = null;
let liquidFactoryPromise = null;

export async function loadSceneModule(sceneVariant) {
    if (sceneVariant === 'intent') {
        return import('./scene-intent.js');
    }
    if (sceneVariant === 'wabi') {
        return import('./scene.js');
    }
    return import('./scene-hold.js');
}

export function loadPostFxDeps() {
    if (!postFxDepsPromise) {
        postFxDepsPromise = Promise.all([
            import('three/addons/postprocessing/EffectComposer.js'),
            import('three/addons/postprocessing/RenderPass.js'),
            import('three/addons/postprocessing/ShaderPass.js'),
            import('./shaders/distortion-pass.js'),
        ]).then(([composerModule, renderPassModule, shaderPassModule, distortionModule]) => ({
            EffectComposer: composerModule.EffectComposer,
            RenderPass: renderPassModule.RenderPass,
            ShaderPass: shaderPassModule.ShaderPass,
            DistortionShader: distortionModule.DistortionShader,
            CameraDofShader: distortionModule.CameraDofShader,
        }));
    }
    return postFxDepsPromise;
}

export function loadFluidFactory() {
    if (!fluidFactoryPromise) {
        fluidFactoryPromise = import('./shaders/fluid-field.js').then((module) => module.createFluidSystem);
    }
    return fluidFactoryPromise;
}

export function loadLiquidFactory() {
    if (!liquidFactoryPromise) {
        liquidFactoryPromise = import('./shaders/liquid.js').then((module) => module.createLiquidSystem);
    }
    return liquidFactoryPromise;
}
