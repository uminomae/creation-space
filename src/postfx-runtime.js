import * as THREE from 'three';

import { applyQuantumWaveUniforms } from './quantum-wave-uniforms.js';

export function createPostFxRuntime({
    postFx,
    renderer,
    toggles,
    distortionParams,
    fluidParams,
    liquidParams,
    quantumWaveParams,
}) {
    const createLiquidRenderTarget = () => new THREE.WebGLRenderTarget(liquidParams.textureSize, liquidParams.textureSize, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
    });

    let createFluidSystemFactory = null;
    let createLiquidSystemFactory = null;
    let fluidSystem = null;
    let liquidSystem = null;
    let liquidTarget = null;
    const liquidMousePos = new THREE.Vector2();
    const liquidMouseVel = new THREE.Vector2();

    function shouldRunPostFx(intentScene) {
        return !intentScene && toggles.postProcess;
    }

    function prewarm(intentScene) {
        if (postFx.shouldPrepare(intentScene, toggles)) {
            void postFx.ensurePipeline();
        }
        if (!intentScene && toggles.postProcess && toggles.fluidField) {
            void postFx.ensureFluidFactory(createFluidSystemFactory).then((factory) => {
                if (factory) createFluidSystemFactory = factory;
            });
        }
        if (!intentScene && toggles.postProcess && toggles.liquid) {
            void postFx.ensureLiquidFactory(createLiquidSystemFactory).then((factory) => {
                if (factory) createLiquidSystemFactory = factory;
            });
        }
    }

    function update({ time, mouse, intentScene }) {
        const shouldRun = shouldRunPostFx(intentScene);

        if (postFx.shouldPrepare(intentScene, toggles) && !postFx.hasPipeline()) {
            void postFx.ensurePipeline();
        }
        if (shouldRun && toggles.fluidField && !createFluidSystemFactory) {
            void postFx.ensureFluidFactory(createFluidSystemFactory).then((factory) => {
                if (factory) createFluidSystemFactory = factory;
            });
        }
        if (shouldRun && toggles.liquid && !createLiquidSystemFactory) {
            void postFx.ensureLiquidFactory(createLiquidSystemFactory).then((factory) => {
                if (factory) createLiquidSystemFactory = factory;
            });
        }

        const composer = postFx.getComposer();
        const distortionPass = postFx.getDistortionPass();
        const dofPass = postFx.getDofPass();

        if (distortionPass && dofPass) {
            if (shouldRun && toggles.fluidField) {
                if (!fluidSystem && createFluidSystemFactory) {
                    fluidSystem = createFluidSystemFactory(renderer);
                }
                if (fluidSystem) {
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
            } else {
                distortionPass.uniforms.uFluidInfluence.value = 0;
            }

            if (shouldRun && toggles.liquid) {
                if (!liquidSystem && createLiquidSystemFactory) {
                    liquidSystem = createLiquidSystemFactory(renderer);
                }
                if (liquidSystem && !liquidTarget) {
                    liquidTarget = createLiquidRenderTarget();
                }
                if (liquidSystem && liquidTarget) {
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
            } else {
                distortionPass.uniforms.uLiquidStrength.value = 0;
            }

            if (shouldRun) {
                applyQuantumWaveUniforms(distortionPass, {
                    enabled: toggles.quantumWave,
                    params: quantumWaveParams,
                });
            } else {
                distortionPass.uniforms.uQWaveStrength.value = 0;
            }

            distortionPass.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
            distortionPass.uniforms.uTime.value = time;
            dofPass.uniforms.uAspect.value = window.innerWidth / window.innerHeight;
            dofPass.uniforms.uMouse.value.set(mouse.smoothX, mouse.smoothY);
            if (shouldRun && toggles.dof) {
                dofPass.uniforms.uDofStrength.value = distortionParams.dofStrength;
                dofPass.uniforms.uDofFocusRadius.value = distortionParams.dofFocusRadius;
            } else {
                dofPass.uniforms.uDofStrength.value = 0;
            }
        }

        return { shouldRunPostFx: shouldRun, composer };
    }

    return {
        prewarm,
        update,
    };
}
