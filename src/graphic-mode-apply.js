export function createGraphicModeApplier({
    getActiveSceneVariant,
    normalizeGraphicMode,
    resolveSceneVariant,
    saveSceneState,
    syncGraphicModeQuery,
    setGraphicButtonState,
    reloadPage = () => window.location.reload(),
}) {
    return function applyGraphicMode(nextMode, { shouldSyncQuery = true } = {}) {
        const normalizedMode = normalizeGraphicMode(nextMode);
        const nextSceneVariant = resolveSceneVariant(normalizedMode);
        const activeSceneVariant = getActiveSceneVariant();

        if (nextSceneVariant !== activeSceneVariant) {
            saveSceneState(activeSceneVariant);
            if (shouldSyncQuery) {
                syncGraphicModeQuery(normalizedMode);
            }
            reloadPage();
            return;
        }

        setGraphicButtonState(normalizedMode);

        if (shouldSyncQuery) {
            syncGraphicModeQuery(normalizedMode);
        }
    };
}
