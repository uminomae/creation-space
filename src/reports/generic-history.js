/**
 * Generic modal URL history controller.
 *
 * Manages `?modal=` and `?guide=` query parameters for non-domain modals.
 * Works alongside the domain-specific history in history.js without modifying it.
 */

export const MODAL_QUERY_PARAM = 'modal';
export const GUIDE_QUERY_PARAM = 'guide';
const HISTORY_STATE_KEY = 'reportsGenericModal';
const GUIDE_HISTORY_STATE_KEY = 'reportsGuideModal';
const MODE_PUSH = 'push';
const MODE_INITIAL = 'initial';

export function getModalKeyFromUrl(search = window.location.search) {
    try {
        return new URLSearchParams(search).get(MODAL_QUERY_PARAM) || '';
    } catch {
        return '';
    }
}

export function getGuideKeyFromUrl(search = window.location.search) {
    try {
        return new URLSearchParams(search).get(GUIDE_QUERY_PARAM) || '';
    } catch {
        return '';
    }
}

function normalizeMode(mode) {
    return mode === MODE_INITIAL ? MODE_INITIAL : MODE_PUSH;
}

function buildHistoryState(stateKey, key, mode, historyState = window.history?.state) {
    const base = historyState && typeof historyState === 'object'
        ? { ...historyState }
        : {};
    if (key) {
        base[stateKey] = { key, mode: normalizeMode(mode) };
    } else {
        delete base[stateKey];
    }
    return base;
}

function getHistoryMarker(stateKey, historyState = window.history?.state) {
    if (!historyState || typeof historyState !== 'object') return null;
    const marker = historyState[stateKey];
    if (!marker || typeof marker !== 'object' || !marker.key) return null;
    return { key: marker.key, mode: normalizeMode(marker.mode) };
}

function updateUrlParam(paramName, value, { method = 'replace', stateKey = '', mode = '' } = {}) {
    const historyApi = window.history;
    const writer = method === 'push' ? historyApi?.pushState : historyApi?.replaceState;
    if (typeof writer !== 'function') return false;

    const url = new URL(window.location.href);
    if (value) {
        url.searchParams.set(paramName, value);
    } else {
        url.searchParams.delete(paramName);
    }

    writer.call(
        historyApi,
        buildHistoryState(stateKey, value, mode, historyApi.state),
        '',
        url.toString(),
    );
    return true;
}

/**
 * Create a generic history controller for ?modal= and ?guide= params.
 */
export function createGenericHistoryController({
    state,
    ensureMdModalInstance,
    isMdModalVisible,
}) {
    // --- Guide state ---

    function setActiveGuideState(key, historyMode = MODE_PUSH) {
        state.modal.activeGuideKey = key || '';
        state.modal.activeGuideHistoryMode = key ? normalizeMode(historyMode) : '';
    }

    function clearActiveGuideState() {
        state.modal.activeGuideKey = '';
        state.modal.activeGuideHistoryMode = '';
    }

    function updateGuideHistoryEntry(key, { method = 'replace', mode = '' } = {}) {
        return updateUrlParam(GUIDE_QUERY_PARAM, key, {
            method,
            stateKey: GUIDE_HISTORY_STATE_KEY,
            mode,
        });
    }

    // --- Generic modal state ---

    function setActiveGenericModalState(key, historyMode = MODE_PUSH) {
        state.modal.activeGenericModalKey = key || '';
        state.modal.activeGenericHistoryMode = key ? normalizeMode(historyMode) : '';
    }

    function clearActiveGenericModalState() {
        state.modal.activeGenericModalKey = '';
        state.modal.activeGenericHistoryMode = '';
    }

    function updateGenericHistoryEntry(key, { method = 'replace', mode = '' } = {}) {
        return updateUrlParam(MODAL_QUERY_PARAM, key, {
            method,
            stateKey: HISTORY_STATE_KEY,
            mode,
        });
    }

    // --- Modal hidden handler (called from unified handler in index.js) ---

    function handleGuideModalHidden() {
        if (!state.modal.activeGuideKey) return false;

        const key = state.modal.activeGuideKey;
        const historyMode = state.modal.activeGuideHistoryMode;
        clearActiveGuideState();

        if (getGuideKeyFromUrl() !== key) return true;

        if (historyMode === MODE_PUSH && typeof window.history?.back === 'function') {
            window.history.back();
            return true;
        }

        updateGuideHistoryEntry('', { method: 'replace' });
        return true;
    }

    function handleGenericModalHidden() {
        if (!state.modal.activeGenericModalKey) return false;

        const key = state.modal.activeGenericModalKey;
        const historyMode = state.modal.activeGenericHistoryMode;
        clearActiveGenericModalState();

        if (getModalKeyFromUrl() !== key) return true;

        if (historyMode === MODE_PUSH && typeof window.history?.back === 'function') {
            window.history.back();
            return true;
        }

        updateGenericHistoryEntry('', { method: 'replace' });
        return true;
    }

    // --- Popstate handler ---

    function handlePopState() {
        const guideKey = getGuideKeyFromUrl();
        const modalKey = getModalKeyFromUrl();

        // If a guide was active but URL no longer has it, close modal
        if (state.modal.activeGuideKey && !guideKey) {
            if (isMdModalVisible()) {
                state.modal._isHistorySyncing = true;
                const modal = ensureMdModalInstance();
                if (modal) modal.hide();
            }
            clearActiveGuideState();
            return;
        }

        // If a generic modal was active but URL no longer has it, close modal
        if (state.modal.activeGenericModalKey && !modalKey) {
            if (isMdModalVisible()) {
                state.modal._isHistorySyncing = true;
                const modal = ensureMdModalInstance();
                if (modal) modal.hide();
            }
            clearActiveGenericModalState();
            return;
        }

        // If URL has a guide param but no modal is open, try to reopen
        // Use treatAsInitial to avoid pushing duplicate history entries
        if (guideKey && !state.modal.activeGuideKey && !isMdModalVisible()) {
            syncGuideWithUrl({ treatAsInitial: true });
            return;
        }

        // If URL has a modal param but no modal is open, try to reopen
        if (modalKey && !state.modal.activeGenericModalKey && !isMdModalVisible()) {
            syncGenericModalWithUrl({ treatAsInitial: true });
        }
    }

    // --- Page-load sync ---

    function syncGuideWithUrl({ treatAsInitial = false, fallbackMode = '' } = {}) {
        const key = getGuideKeyFromUrl();
        if (!key) return false;

        const opener = state._modalOpeners?.get('guide-' + key);
        if (!opener) {
            updateGuideHistoryEntry('', { method: 'replace' });
            return false;
        }

        const mode = treatAsInitial ? MODE_INITIAL : (fallbackMode || MODE_PUSH);
        if (treatAsInitial) {
            updateGuideHistoryEntry(key, { method: 'replace', mode: MODE_INITIAL });
        }
        opener(mode);
        return true;
    }

    function syncGenericModalWithUrl({ treatAsInitial = false, fallbackMode = '' } = {}) {
        const key = getModalKeyFromUrl();
        if (!key) return false;

        const opener = state._modalOpeners?.get(key);
        if (!opener) {
            updateGenericHistoryEntry('', { method: 'replace' });
            return false;
        }

        const mode = treatAsInitial ? MODE_INITIAL : (fallbackMode || MODE_PUSH);
        if (treatAsInitial) {
            updateGenericHistoryEntry(key, { method: 'replace', mode: MODE_INITIAL });
        }
        opener(mode);
        return true;
    }

    return {
        setActiveGuideState,
        clearActiveGuideState,
        updateGuideHistoryEntry,
        setActiveGenericModalState,
        clearActiveGenericModalState,
        updateGenericHistoryEntry,
        handleGuideModalHidden,
        handleGenericModalHidden,
        handlePopState,
        syncGuideWithUrl,
        syncGenericModalWithUrl,
        getModalKeyFromUrl,
        getGuideKeyFromUrl,
    };
}
