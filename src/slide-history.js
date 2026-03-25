/**
 * Slide viewer URL history controller.
 *
 * Manages `?slide=` query parameter for the slide viewer overlay.
 * Independent of Bootstrap modal history — slide viewer is a separate overlay.
 */

import { closeSlideViewer } from './slide-viewer.js';

export const SLIDE_QUERY_PARAM = 'slide';
const HISTORY_STATE_KEY = 'reportsSlideViewer';
const MODE_PUSH = 'push';
const MODE_INITIAL = 'initial';

export function getSlideKeyFromUrl(search = window.location.search) {
    try {
        return new URLSearchParams(search).get(SLIDE_QUERY_PARAM) || '';
    } catch {
        return '';
    }
}

function normalizeMode(mode) {
    return mode === MODE_INITIAL ? MODE_INITIAL : MODE_PUSH;
}

function updateSlideUrlParam(value, { method = 'replace', mode = '' } = {}) {
    const historyApi = window.history;
    const writer = method === 'push' ? historyApi?.pushState : historyApi?.replaceState;
    if (typeof writer !== 'function') return false;

    const url = new URL(window.location.href);
    if (value) {
        url.searchParams.set(SLIDE_QUERY_PARAM, value);
    } else {
        url.searchParams.delete(SLIDE_QUERY_PARAM);
    }

    const base = historyApi.state && typeof historyApi.state === 'object'
        ? { ...historyApi.state }
        : {};
    if (value) {
        base[HISTORY_STATE_KEY] = { key: value, mode: normalizeMode(mode) };
    } else {
        delete base[HISTORY_STATE_KEY];
    }

    writer.call(historyApi, base, '', url.toString());
    return true;
}

/**
 * Create slide history controller.
 *
 * @param {object} opts
 * @param {object} opts.state - shared state (must have state.slide sub-object)
 */
export function createSlideHistoryController({ state }) {
    function setActiveSlideState(key, historyMode = MODE_PUSH) {
        state.slide.activeSlideKey = key || '';
        state.slide.activeSlideHistoryMode = key ? normalizeMode(historyMode) : '';
    }

    function clearActiveSlideState() {
        state.slide.activeSlideKey = '';
        state.slide.activeSlideHistoryMode = '';
    }

    /**
     * Push slide key to URL. Call when opening a slide viewer.
     */
    function pushSlideHistory(key) {
        if (!key) return;
        setActiveSlideState(key, MODE_PUSH);
        updateSlideUrlParam(key, { method: 'push', mode: MODE_PUSH });
    }

    /**
     * Build an onClose callback for the slide viewer.
     * When the user manually closes slides, this handles history cleanup.
     */
    function createSlideOnClose() {
        return () => {
            if (!state.slide.activeSlideKey) return;

            const key = state.slide.activeSlideKey;
            const historyMode = state.slide.activeSlideHistoryMode;
            clearActiveSlideState();

            if (getSlideKeyFromUrl() !== key) return;

            if (historyMode === MODE_PUSH && typeof window.history?.back === 'function') {
                window.history.back();
                return;
            }

            updateSlideUrlParam('', { method: 'replace' });
        };
    }

    /**
     * Handle popstate for slide param.
     */
    function handlePopState() {
        const slideKey = getSlideKeyFromUrl();

        // Slide was active but URL no longer has it — close the viewer
        if (state.slide.activeSlideKey && !slideKey) {
            // Clear state first to prevent onClose callback from calling history.back()
            clearActiveSlideState();
            closeSlideViewer();
            return;
        }

        // URL has slide param but no viewer is active — try to reopen
        if (slideKey && !state.slide.activeSlideKey) {
            syncSlideWithUrl({ treatAsInitial: false });
        }
    }

    /**
     * On page load, check for ?slide= and open the appropriate slide.
     */
    function syncSlideWithUrl({ treatAsInitial = false } = {}) {
        const key = getSlideKeyFromUrl();
        if (!key) return false;

        const opener = state._slideOpeners?.get(key);
        if (!opener) {
            updateSlideUrlParam('', { method: 'replace' });
            return false;
        }

        const mode = treatAsInitial ? MODE_INITIAL : MODE_PUSH;
        if (treatAsInitial) {
            updateSlideUrlParam(key, { method: 'replace', mode: MODE_INITIAL });
        }
        setActiveSlideState(key, mode);
        opener();
        return true;
    }

    return {
        pushSlideHistory,
        createSlideOnClose,
        handlePopState,
        syncSlideWithUrl,
        clearActiveSlideState,
        getSlideKeyFromUrl,
    };
}
