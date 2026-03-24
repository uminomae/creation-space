import { initArticles, setArticlesLanguage } from './articles.js';
import { initReports, setReportsLanguage } from './reports/index.js';
import { initMainUiRuntime } from './main-ui-runtime.js';

export function initMainContentRuntime({
    camera,
    container,
    renderer,
    getCreationLinkTargetMeshes,
    initialLang,
    initialGraphicMode,
    applyGraphicMode,
    devMode,
}) {
    initMainUiRuntime({
        camera,
        container,
        renderer,
        getCreationLinkTargetMeshes,
        initialLang,
        initialGraphicMode,
        applyGraphicMode,
        devMode,
        setArticlesLanguage,
        setReportsLanguage,
    });

    applyGraphicMode(initialGraphicMode, { shouldSyncQuery: false });

    initArticles({ lang: initialLang, devMode }).catch((error) => {
        console.warn('[articles] init failed:', error);
    });

    initReports({ lang: initialLang }).catch((error) => {
        console.warn('[reports] init failed:', error);
    });
}
