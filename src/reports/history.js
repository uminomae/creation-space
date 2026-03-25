import { normalizeDomainId } from './data.js';

export const DOMAIN_QUERY_PARAM = 'domain';
export const DOMAIN_HISTORY_STATE_KEY = 'reportsDomainModal';
export const DOMAIN_HISTORY_MODE_PUSH = 'push';
export const DOMAIN_HISTORY_MODE_INITIAL = 'initial';

export function getDomainIdFromUrl(search = window.location.search) {
    try {
        const params = new URLSearchParams(search);
        return normalizeDomainId(params.get(DOMAIN_QUERY_PARAM));
    } catch {
        return '';
    }
}

function hasDomainQueryParam(search = window.location.search) {
    try {
        return new URLSearchParams(search).has(DOMAIN_QUERY_PARAM);
    } catch {
        return false;
    }
}

export function getDomainHistoryMarker(historyState = window.history?.state, domainId = '') {
    if (!historyState || typeof historyState !== 'object') return null;
    const marker = historyState[DOMAIN_HISTORY_STATE_KEY];
    if (!marker || typeof marker !== 'object') return null;

    const normalizedId = normalizeDomainId(marker.domainId);
    const normalizedMode = marker.mode === DOMAIN_HISTORY_MODE_INITIAL
        ? DOMAIN_HISTORY_MODE_INITIAL
        : (marker.mode === DOMAIN_HISTORY_MODE_PUSH ? DOMAIN_HISTORY_MODE_PUSH : '');

    if (!normalizedId || !normalizedMode) return null;
    if (domainId && normalizedId !== normalizeDomainId(domainId)) return null;

    return {
        domainId: normalizedId,
        mode: normalizedMode,
    };
}

export function buildDomainHistoryState(domainId = '', mode = '', historyState = window.history?.state) {
    const baseState = historyState && typeof historyState === 'object'
        ? { ...historyState }
        : {};

    if (domainId) {
        baseState[DOMAIN_HISTORY_STATE_KEY] = {
            domainId,
            mode: mode === DOMAIN_HISTORY_MODE_INITIAL ? DOMAIN_HISTORY_MODE_INITIAL : DOMAIN_HISTORY_MODE_PUSH,
        };
    } else {
        delete baseState[DOMAIN_HISTORY_STATE_KEY];
    }

    return baseState;
}

export function updateDomainHistoryEntry(domainId = '', { method = 'replace', mode = '' } = {}) {
    const historyApi = window.history;
    const writer = method === 'push' ? historyApi?.pushState : historyApi?.replaceState;
    if (typeof writer !== 'function') return false;

    const normalizedId = normalizeDomainId(domainId);
    const url = new URL(window.location.href);
    if (normalizedId) {
        url.searchParams.set(DOMAIN_QUERY_PARAM, normalizedId);
    } else {
        url.searchParams.delete(DOMAIN_QUERY_PARAM);
    }

    writer.call(
        historyApi,
        buildDomainHistoryState(normalizedId, mode, historyApi.state),
        '',
        url.toString(),
    );
    return true;
}

export function createReportsHistoryController({
    state,
    ensureMdModalInstance,
    isMdModalVisible,
    openDomainModalById,
}) {
    function setActiveDomainModalState(domainId, historyMode = DOMAIN_HISTORY_MODE_PUSH) {
        state.modal.activeDomainId = normalizeDomainId(domainId);
        state.modal.activeDomainHistoryMode = state.modal.activeDomainId
            ? (historyMode === DOMAIN_HISTORY_MODE_INITIAL ? DOMAIN_HISTORY_MODE_INITIAL : DOMAIN_HISTORY_MODE_PUSH)
            : '';
    }

    function clearActiveDomainModalState() {
        state.modal.activeDomainId = '';
        state.modal.activeDomainHistoryMode = '';
    }

    function queuePendingDomainSync(domainId, historyMode = DOMAIN_HISTORY_MODE_PUSH) {
        state.modal.pendingDomainId = normalizeDomainId(domainId);
        state.modal.pendingDomainHistoryMode = state.modal.pendingDomainId
            ? (historyMode === DOMAIN_HISTORY_MODE_INITIAL ? DOMAIN_HISTORY_MODE_INITIAL : DOMAIN_HISTORY_MODE_PUSH)
            : '';
    }

    function clearPendingDomainSync() {
        state.modal.pendingDomainId = '';
        state.modal.pendingDomainHistoryMode = '';
    }

    function hideActiveDomainModalFromHistory() {
        if (!state.modal.activeDomainId) return;

        if (!isMdModalVisible()) {
            clearActiveDomainModalState();
            return;
        }

        state.modal._isHistorySyncing = true;
        const modal = ensureMdModalInstance();
        if (modal) {
            modal.hide();
            return;
        }

        state.modal._isHistorySyncing = false;
        clearActiveDomainModalState();
    }

    function syncDomainModalWithUrl({
        historyState = window.history?.state,
        fallbackHistoryMode = '',
        treatAsInitial = false,
    } = {}) {
        const domainId = getDomainIdFromUrl();
        const rawHasDomainParam = hasDomainQueryParam();
        if (!domainId) {
            clearPendingDomainSync();
            if (rawHasDomainParam) {
                updateDomainHistoryEntry('', { method: 'replace' });
            }
            if (!state.modal.activeDomainId) {
                return;
            }
            hideActiveDomainModalFromHistory();
            return;
        }

        const historyMode = getDomainHistoryMarker(historyState, domainId)?.mode
            || (fallbackHistoryMode === DOMAIN_HISTORY_MODE_INITIAL
                ? DOMAIN_HISTORY_MODE_INITIAL
                : (fallbackHistoryMode === DOMAIN_HISTORY_MODE_PUSH
                    ? DOMAIN_HISTORY_MODE_PUSH
                    : (treatAsInitial ? DOMAIN_HISTORY_MODE_INITIAL : DOMAIN_HISTORY_MODE_PUSH)));

        if (!state.data.reportsReady) {
            queuePendingDomainSync(domainId, historyMode);
            return;
        }

        if (state.modal.activeDomainId === domainId && isMdModalVisible()) {
            setActiveDomainModalState(domainId, historyMode);
            clearPendingDomainSync();
            if (treatAsInitial) {
                updateDomainHistoryEntry(domainId, {
                    method: 'replace',
                    mode: DOMAIN_HISTORY_MODE_INITIAL,
                });
            }
            return;
        }

        const opened = openDomainModalById(domainId, {
            historyMode,
            syncUrl: treatAsInitial ? 'replace' : 'none',
        });

        if (opened) return;

        clearPendingDomainSync();
        updateDomainHistoryEntry('', { method: 'replace' });
        hideActiveDomainModalFromHistory();
    }

    function handleMdModalHidden() {
        if (state.modal._isHistorySyncing) {
            state.modal._isHistorySyncing = false;
            clearActiveDomainModalState();
            return;
        }

        if (!state.modal.activeDomainId) return;

        const activeDomainId = state.modal.activeDomainId;
        const historyMode = state.modal.activeDomainHistoryMode;
        clearActiveDomainModalState();
        clearPendingDomainSync();

        if (getDomainIdFromUrl() !== activeDomainId) return;

        if (historyMode === DOMAIN_HISTORY_MODE_PUSH && typeof window.history?.back === 'function') {
            window.history.back();
            return;
        }

        updateDomainHistoryEntry('', { method: 'replace' });
    }

    function handleDomainPopState(event) {
        const domainId = getDomainIdFromUrl();
        const fallbackHistoryMode = getDomainHistoryMarker(event.state, domainId)?.mode || '';

        if (!state.data.reportsReady) {
            queuePendingDomainSync(domainId, fallbackHistoryMode || DOMAIN_HISTORY_MODE_PUSH);
            if (!domainId) {
                clearPendingDomainSync();
            }
            return;
        }

        syncDomainModalWithUrl({
            historyState: event.state,
            fallbackHistoryMode,
            treatAsInitial: false,
        });
    }

    function bindHistorySyncEvents() {
        if (state.modal.historyEventsBound) return;
        if (state.dom.mdModal) {
            state.dom.mdModal.addEventListener('hidden.bs.modal', handleMdModalHidden);
        }
        window.addEventListener('popstate', handleDomainPopState);
        state.modal.historyEventsBound = true;
    }

    return {
        bindHistorySyncEvents,
        clearActiveDomainModalState,
        clearPendingDomainSync,
        getDomainHistoryMarker,
        getDomainIdFromUrl,
        handleDomainPopState,
        handleMdModalHidden,
        queuePendingDomainSync,
        setActiveDomainModalState,
        syncDomainModalWithUrl,
        updateDomainHistoryEntry,
    };
}
