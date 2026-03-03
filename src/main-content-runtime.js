import { initArticles, setArticlesLanguage } from './articles.js';
import { initReports, setReportsLanguage } from './reports.js';
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
