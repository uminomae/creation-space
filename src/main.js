import { DEV_VERSION } from './version.js';
import { installStartupErrorHandlers, showStartupErrorOverlay } from './startup-error-overlay.js';
import { createMainRuntimeContext } from './main-runtime-context.js';
import { runMainOrchestrator } from './main-orchestrator.js';

const runtimeContext = createMainRuntimeContext();

installStartupErrorHandlers();

runMainOrchestrator({
    runtimeContext,
    devVersion: DEV_VERSION,
}).catch((error) => {
    console.error('[main] init failed:', error);
    showStartupErrorOverlay(error);
});
