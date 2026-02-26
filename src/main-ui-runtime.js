import { initControls } from './controls.js';
import { initScrollUI, refreshGuideLang } from './scroll-ui.js';
import { initCreationLinkInteractions } from './creation-link-interactions.js';
import { initLanguageToggle, applyPageLanguage } from './page-language.js';
import { initMobileNavAutoCollapse } from './topbar-nav.js';
import { initGraphicModeButtons } from './graphic-mode.js';

export function initMainUiRuntime({
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
}) {
    initControls(camera, container, renderer);

    initCreationLinkInteractions({
        camera,
        domElement: renderer.domElement,
        getTargets: getCreationLinkTargetMeshes,
    });

    initScrollUI();
    initLanguageToggle(initialLang, (currentLang) => {
        applyPageLanguage(currentLang, { devMode, devVersion });
        refreshGuideLang();
        setArticlesLanguage(currentLang);
    });

    initMobileNavAutoCollapse();
    initGraphicModeButtons(initialGraphicMode, (nextMode) => {
        applyGraphicMode(nextMode);
    });
}
