import { initDevPanel } from './dev-panel.js';

export function initDevAuxTools({ setStatsHandlers }) {
    import('./dev-links-panel.js').then(({ initDevLinksPanel }) => {
        initDevLinksPanel();
    }).catch((err) => {
        console.warn('[dev-links] init failed:', err.message);
    });

    import('./dev-stats.js').then(({ initDevStats, statsBegin, statsEnd }) => {
        if (typeof setStatsHandlers === 'function') {
            setStatsHandlers(statsBegin, statsEnd);
        }
        initDevStats().catch((err) => {
            console.warn('[dev-stats] init failed:', err.message);
        });
    }).catch((err) => {
        console.warn('[dev-stats] import failed:', err.message);
    });
}

export function initDevPanelRuntime({
    sceneVariant,
    sceneParams,
    setCameraPosition,
    setCameraTarget,
    onSyncShiftTurn,
    onStateSnapshot,
}) {
    initDevPanel({
        sceneVariant,
        panelStartsOpen: false,
        onStateChanged: () => {
            setCameraPosition(sceneParams.camX, sceneParams.camY, sceneParams.camZ);
            setCameraTarget(
                sceneParams.camTargetX ?? 0,
                sceneParams.camTargetY ?? 0,
                sceneParams.camTargetZ ?? 0,
            );
            if (typeof onSyncShiftTurn === 'function') {
                onSyncShiftTurn();
            }
        },
        onStateSnapshot: (state) => {
            if (typeof onStateSnapshot === 'function') {
                onStateSnapshot(state);
            }
        },
    });
}
