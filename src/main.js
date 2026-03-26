import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { createMainRuntimeContext } from './main-runtime-context.js';
import { runMainOrchestrator } from './main-orchestrator.js';
import { initFontSizeCtrl } from './font-size-ctrl.js';
import { initScrollCoordinator } from './scroll-coordinator.js';
import { injectNarrations, initRevealObserver } from './reveal-observer.js';

installStartupErrorHandlers();

function startMainApp() {
    initScrollCoordinator();
    initFontSizeCtrl();
    injectNarrations();
    initRevealObserver();
    const runtimeContext = createMainRuntimeContext();
    return runMainOrchestrator({
        runtimeContext,
    });
}

try {
    // Synchronous bootstrap errors (e.g. context creation) are handled here.
    // Async initialization errors are handled by the Promise chain below.
    startMainApp().catch((error) => {
        console.error('[main] init failed:', error);
        showStartupErrorOverlay(error);
    });
} catch (error) {
    console.error('[main] bootstrap failed:', error);
    showStartupErrorOverlay(error);
}
