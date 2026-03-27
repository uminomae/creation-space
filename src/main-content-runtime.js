import { initArticles, setArticlesLanguage } from './articles.js';
import { initReports, setReportsLanguage } from './reports/index.js';
import { initMainPageUiRuntime, attachMainSceneUiRuntime } from './main-ui-runtime.js';

export function initMainContentRuntime({
    initialLang,
    initialGraphicMode,
    applyGraphicMode,
    devMode,
}) {
    initMainPageUiRuntime({
        initialLang,
        initialGraphicMode,
        applyGraphicMode,
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

export function attachMainSceneContentRuntime({
    camera,
    container,
    renderer,
    getCreationLinkTargetMeshes,
}) {
    attachMainSceneUiRuntime({
        camera,
        container,
        renderer,
        getCreationLinkTargetMeshes,
    });
}
