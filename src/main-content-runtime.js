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
    devVersion,
    devDate,
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
        devVersion,
        devDate,
        setArticlesLanguage,
        setReportsLanguage,
    });

    applyGraphicMode(initialGraphicMode, { shouldSyncQuery: false });

    initArticles({ lang: initialLang }).catch((error) => {
        console.warn('[articles] init failed:', error);
    });

    initReports({ lang: initialLang }).catch((error) => {
        console.warn('[reports] init failed:', error);
    });
}
