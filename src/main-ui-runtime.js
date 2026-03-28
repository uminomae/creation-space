import { initControls } from './controls.js';
import { initScrollUI } from './scroll-ui.js';
import { initCreationLinkInteractions } from './creation-link-interactions.js';
import { initLanguageToggle, applyPageLanguage } from './page-language.js';
import { initMobileNavAutoCollapse } from './topbar-nav.js';
import { initGraphicModeButtons } from './graphic-mode.js';
import { setPrologueTimelineLanguage } from './prologue-timeline.js';
import { setAboutLanguage } from './about-modal.js';

export function initMainPageUiRuntime({
    initialLang,
    initialGraphicMode,
    applyGraphicMode,
    setArticlesLanguage,
    setReportsLanguage,
}) {
    initScrollUI();
    initLanguageToggle(initialLang, (currentLang) => {
        applyPageLanguage(currentLang);
        setArticlesLanguage(currentLang);
        if (typeof setReportsLanguage === 'function') {
            setReportsLanguage(currentLang);
        }
        setPrologueTimelineLanguage(currentLang);
        setAboutLanguage(currentLang);
    });

    initMobileNavAutoCollapse();
    initGraphicModeButtons(initialGraphicMode, (nextMode) => {
        applyGraphicMode(nextMode);
    });
}

export function attachMainSceneUiRuntime({
    camera,
    container,
    renderer,
    getCreationLinkTargetMeshes,
}) {
    if (!camera || !container || !renderer) {
        return;
    }

    initControls(camera, container, renderer);

    initCreationLinkInteractions({
        camera,
        domElement: renderer.domElement,
        getTargets: getCreationLinkTargetMeshes,
    });
}
