import { breathValue } from './animation-utils.js';
import {
    getScrollProgress,
    setAutoRotateLoopPhase,
    setAutoRotateSpeed,
    setAutoRotateStartOffsetSec,
    setCameraPosition,
    setCameraTarget,
    updateControls,
} from './controls.js';
import { updateMouseSmoothing } from './mouse-state.js';
import { updateScrollUI } from './scroll-ui.js';
import { breathConfig, intentMotionParams, sceneParams, toggles } from './config.js';

export function createMainFrameRuntime({
    clock,
    renderer,
    camera,
    isIntentScene,
    intentTimelineRuntime,
    updateScene,
    postFxRuntime,
    getDevStatsBegin = () => (() => {}),
    getDevStatsEnd = () => (() => {}),
}) {
    let frameId = 0;
    let running = false;

    function frame() {
        if (!running) return;
        frameId = requestAnimationFrame(frame);

        const devBegin = getDevStatsBegin();
        const devEnd = getDevStatsEnd();
        devBegin();

        const time = clock.getElapsedTime();
        const breathVal = breathValue(time, breathConfig.period);
        const scrollProg = getScrollProgress();
        const intentScene = isIntentScene();
        const timelineState = intentTimelineRuntime.getTimelineState(time);
        const intentTimeline = timelineState.runtime;

        updateScrollUI(scrollProg, breathVal);
        setCameraPosition(sceneParams.camX, sceneParams.camY, sceneParams.camZ);
        setCameraTarget(
            sceneParams.camTargetX ?? 0,
            sceneParams.camTargetY ?? 0,
            sceneParams.camTargetZ ?? 0,
        );

        if (intentScene) {
            toggles.autoRotate = true;
            setAutoRotateSpeed(intentMotionParams.cameraRotateSpeed);
            setAutoRotateStartOffsetSec(0.0);
            setAutoRotateLoopPhase(intentTimeline.phase);
        } else {
            setAutoRotateSpeed(1.0);
            setAutoRotateStartOffsetSec(0.0);
            setAutoRotateLoopPhase(null);
        }

        intentTimelineRuntime.updateHudVisibility(intentScene, timelineState.debug);
        updateControls(time, breathVal);
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

        devEnd();
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
