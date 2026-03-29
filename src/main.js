import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { createMainRuntimeContext } from './main-runtime-context.js';
import { runMainOrchestrator } from './main-orchestrator.js';
import { initFontSizeCtrl } from './font-size-ctrl.js';
import { initScrollCoordinator } from './scroll-coordinator.js';
import { initRevealObserver } from './reveal-observer.js';
import { initPrologueTimeline } from './prologue-timeline.js';
import { initAboutModal } from './about-modal.js';
import { detectLang, initLanguageState } from './i18n.js';

installStartupErrorHandlers();

async function startMainApp() {
    initLanguageState(detectLang());
    initScrollCoordinator();
    initFontSizeCtrl();
    initRevealObserver();
    initPrologueTimeline();
    initAboutModal();
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
