import { DEV_VERSION, DEV_VERSION_DATE } from './version.js';
import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { createMainRuntimeContext } from './main-runtime-context.js';
import { runMainOrchestrator } from './main-orchestrator.js';
import { initFontSizeCtrl } from './font-size-ctrl.js';

installStartupErrorHandlers();

function startMainApp() {
    initFontSizeCtrl();
    const runtimeContext = createMainRuntimeContext();
    return runMainOrchestrator({
        runtimeContext,
        devVersion: DEV_VERSION,
        devDate: DEV_VERSION_DATE,
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
