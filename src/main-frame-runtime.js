import { breathValue } from './animation-utils.js';
import * as controls from './controls.js';
import { updateMouseSmoothing } from './mouse-state.js';
import { updateScrollUI } from './scroll-ui.js';
import { breathConfig, intentMotionParams, sceneParams, toggles } from './config.js';

export function createMainFrameRuntime({
    clock,
    scene,
    renderer,
    camera,
    isIntentScene,
    intentTimelineRuntime,
    updateScene,
    postFxRuntime,
    devMode = false,
    getDevStatsBegin = () => (() => {}),
    getDevStatsEnd = () => (() => {}),
}) {
    let frameId = 0;
    let running = false;
    const useDevStats = Boolean(devMode);

    function frame() {
        if (!running) return;
        frameId = requestAnimationFrame(frame);

        if (useDevStats) {
            const devBegin = getDevStatsBegin();
            devBegin();
        }

        const time = clock.getElapsedTime();
        const breathVal = breathValue(time, breathConfig.period);
        const scrollProg = controls.getScrollProgress();
        const intentScene = isIntentScene();
        const timelineState = intentTimelineRuntime.getTimelineState(time);
        const intentTimeline = timelineState.runtime;

        updateScrollUI(scrollProg, breathVal);
        controls.setCameraPosition(sceneParams.camX, sceneParams.camY, sceneParams.camZ);
        controls.setCameraTarget(
            sceneParams.camTargetX ?? 0,
            sceneParams.camTargetY ?? 0,
            sceneParams.camTargetZ ?? 0,
        );

        if (intentScene) {
            toggles.autoRotate = true;
            controls.setAutoRotateSpeed(intentMotionParams.cameraRotateSpeed);
            controls.setAutoRotateStartOffsetSec(0.0);
            controls.setAutoRotateLoopPhase(intentTimeline.phase);
            // cameraAngleDeg is the single operator-facing knob (query + dev panel).
            const angleDeg = Number.isFinite(intentMotionParams.cameraAngleDeg)
                ? intentMotionParams.cameraAngleDeg
                : 0.0;
            controls.setAutoRotateAngleOffsetRad?.((angleDeg * Math.PI) / 180.0);
        } else {
            controls.setAutoRotateSpeed(1.0);
            controls.setAutoRotateStartOffsetSec(0.0);
            controls.setAutoRotateLoopPhase(null);
            controls.setAutoRotateAngleOffsetRad?.(0.0);
        }

        intentTimelineRuntime.updateHudVisibility(intentScene, timelineState.debug);
        controls.updateControls(time, breathVal);
        const mouse = updateMouseSmoothing();

        updateScene(time);

        const { shouldRunPostFx, composer } = postFxRuntime.update({
            time,
            mouse,
            intentScene,
        });

        renderer.clear();
        if (shouldRunPostFx && composer) {
            composer.render();
        } else {
            renderer.render(scene, camera);
        }

        if (useDevStats) {
            const devEnd = getDevStatsEnd();
            devEnd();
        }
    }

    function start() {
        if (running) return;
        running = true;
        frame();
    }

    function stop() {
        running = false;
        if (frameId) {
            cancelAnimationFrame(frameId);
            frameId = 0;
        }
    }

    return {
        start,
        stop,
        isRunning: () => running,
    };
}
