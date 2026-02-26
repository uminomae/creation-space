import { initArticles, setArticlesLanguage } from './articles.js';
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
    });

    applyGraphicMode(initialGraphicMode, { shouldSyncQuery: false });

    initArticles({ lang: initialLang }).catch((error) => {
        console.warn('[articles] init failed:', error);
    });
}
