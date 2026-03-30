export const ABOUT_QUERY_PARAM = 'about';

export function getSearchParams() {
    return new URLSearchParams(window.location.search);
}

export function updateSearchParams(updates, { replace = false, state = null } = {}) {
    const url = new URL(window.location.href);

    for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined) {
            url.searchParams.delete(key);
            continue;
        }
        url.searchParams.set(key, value);
    }

    history[replace ? 'replaceState' : 'pushState'](
        state,
        '',
        `${url.pathname}${url.search}${url.hash}`,
    );
}

export function createModalRouter({
    historyController,
    genericHistoryController,
    slideHistoryController,
    openAbout,
    closeAbout,
    isAboutOpen,
}) {
    function openModal(type, key = '', { pushHistory = true } = {}) {
        if (type !== 'about') return false;

        if (pushHistory && !getSearchParams().has(ABOUT_QUERY_PARAM)) {
            updateSearchParams(
                { about: '', domain: null, guide: null, modal: null },
                { state: { ...(history.state || {}), modal: 'about' } },
            );
        }

        openAbout({ pushHistory: false });
        return true;
    }

    function closeModal(type, { updateHistory = true } = {}) {
        if (type !== 'about') return false;
        if (!isAboutOpen()) return false;

        closeAbout({ updateHistory: false });

        if (!updateHistory) return true;

        if (getSearchParams().has(ABOUT_QUERY_PARAM)) {
            if (history.state?.modal === 'about') {
                history.back();
            } else {
                updateSearchParams({ about: null }, { replace: true, state: history.state || null });
            }
        }

        return true;
    }

    function syncAboutWithLocation({ replaceState = false } = {}) {
        const hasAbout = getSearchParams().has(ABOUT_QUERY_PARAM);

        if (hasAbout) {
            if (replaceState) {
                history.replaceState({ ...(history.state || {}), modal: 'about' }, '', window.location.href);
            }
            if (!isAboutOpen()) {
                openAbout({ pushHistory: false });
            }
            return;
        }

        if (isAboutOpen()) {
            closeAbout({ updateHistory: false });
        }
    }

    function handlePopState(event) {
        syncAboutWithLocation();
        historyController.handleDomainPopState(event);
        genericHistoryController.handlePopState();
        slideHistoryController.handlePopState();
    }

    function hydrateFromLocation({ hydrateReports, hydrateSlides }) {
        syncAboutWithLocation({ replaceState: true });

        if (typeof hydrateReports === 'function') {
            hydrateReports();
        }
        if (typeof hydrateSlides === 'function') {
            hydrateSlides();
        }
    }

    return {
        closeModal,
        handlePopState,
        hydrateFromLocation,
        openModal,
    };
}
