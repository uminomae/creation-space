import { initDevPanel } from './dev-panel.js';
import { textStyleParams } from './config.js';

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

function syncTextStyleCSSVars() {
    const s = document.documentElement.style;
    const p = textStyleParams;
    s.setProperty('--text-narration-opacity', String(p.narrationOpacity));
    s.setProperty('--text-timeline-label-opacity', String(p.timelineLabelOpacity));
    s.setProperty('--text-timeline-desc-opacity', String(p.timelineDescOpacity));
    s.setProperty('--text-question-opacity', String(p.questionOpacity));
    s.setProperty('--text-shadow-blur', p.shadowBlur + 'px');
    s.setProperty('--text-shadow-blur2', (p.shadowBlur * 2) + 'px');
    s.setProperty('--text-shadow-opacity', String(p.shadowOpacity));
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
            syncTextStyleCSSVars();
        },
        onStateSnapshot: (state) => {
            if (typeof onStateSnapshot === 'function') {
                onStateSnapshot(state);
            }
        },
    });
}
