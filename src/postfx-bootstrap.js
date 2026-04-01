export function createPostFxBootstrap({
    renderer,
    scene,
    camera,
    liquidParams,
    loadPostFxDeps,
    loadFluidFactory,
    loadLiquidFactory,
}) {
    let composer = null;
    let distortionPass = null;
    let dofPass = null;

    let postFxLoadingPromise = null;
    let fluidFactoryLoadingPromise = null;
    let liquidFactoryLoadingPromise = null;

    function shouldPrepare(intentScene, toggles) {
        return !intentScene && toggles.postProcess;
    }

    function hasPipeline() {
        return Boolean(composer && distortionPass && dofPass);
    }

    function ensurePipeline() {
        if (hasPipeline()) {
            return Promise.resolve(true);
        }
        if (postFxLoadingPromise) {
            return postFxLoadingPromise;
        }
        postFxLoadingPromise = loadPostFxDeps()
            .then((deps) => {
                const {
                    EffectComposer,
                    RenderPass,
                    ShaderPass,
                    OutputPass,
                    DistortionShader,
                    CameraDofShader,
                } = deps;

                composer = new EffectComposer(renderer);
                composer.addPass(new RenderPass(scene, camera));

                distortionPass = new ShaderPass(DistortionShader);
                distortionPass.uniforms.uLiquidOffsetScale.value = liquidParams.refractOffsetScale;
                distortionPass.uniforms.uLiquidThreshold.value = liquidParams.refractThreshold;
                composer.addPass(distortionPass);

                dofPass = new ShaderPass(CameraDofShader);
                composer.addPass(dofPass);
                composer.addPass(new OutputPass());
                composer.setSize(window.innerWidth, window.innerHeight);
                return true;
            })
            .catch((error) => {
                console.warn('[postfx] init failed:', error);
                return false;
            })
            .finally(() => {
                postFxLoadingPromise = null;
            });
        return postFxLoadingPromise;
    }

    function ensureFluidFactory(currentFactory) {
        if (currentFactory) {
            return Promise.resolve(currentFactory);
        }
        if (fluidFactoryLoadingPromise) {
            return fluidFactoryLoadingPromise;
        }
        fluidFactoryLoadingPromise = loadFluidFactory()
            .catch((error) => {
                console.warn('[fluid] import failed:', error);
                return null;
            })
            .finally(() => {
                fluidFactoryLoadingPromise = null;
            });
        return fluidFactoryLoadingPromise;
    }

    function ensureLiquidFactory(currentFactory) {
        if (currentFactory) {
            return Promise.resolve(currentFactory);
        }
        if (liquidFactoryLoadingPromise) {
            return liquidFactoryLoadingPromise;
        }
        liquidFactoryLoadingPromise = loadLiquidFactory()
            .catch((error) => {
                console.warn('[liquid] import failed:', error);
                return null;
            })
            .finally(() => {
                liquidFactoryLoadingPromise = null;
            });
        return liquidFactoryLoadingPromise;
    }

    return {
        shouldPrepare,
        hasPipeline,
        ensurePipeline,
        ensureFluidFactory,
        ensureLiquidFactory,
        getComposer() {
            return composer;
        },
        getDistortionPass() {
            return distortionPass;
        },
        getDofPass() {
            return dofPass;
        },
    };
}
