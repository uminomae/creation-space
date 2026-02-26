const DEFAULT_STORAGE_PREFIX = 'creation-dev-panel-state-v1';

function getStorage() {
    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

export function createSceneStateStore({
    enabled = false,
    getPresetVersion = () => '',
    storagePrefix = DEFAULT_STORAGE_PREFIX,
} = {}) {
    function getKey(sceneVariant) {
        return `${storagePrefix}:${sceneVariant}`;
    }

    function load(sceneVariant) {
        if (!enabled) return null;
        const storage = getStorage();
        if (!storage) return null;

        try {
            const raw = storage.getItem(getKey(sceneVariant));
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return null;

            const expectedPresetVersion = getPresetVersion(sceneVariant);
            const statePayload = parsed.state;
            const presetVersion = parsed.presetVersion;
            if (
                typeof presetVersion === 'string' &&
                presetVersion === expectedPresetVersion &&
                statePayload &&
                typeof statePayload === 'object'
            ) {
                return statePayload;
            }

            // Drop stale state so current scene defaults become effective.
            storage.removeItem(getKey(sceneVariant));
            return null;
        } catch (error) {
            console.warn('[dev-panel] failed to load scene state:', error);
            return null;
        }
    }

    function save(sceneVariant, state) {
        if (!enabled || !state || typeof state !== 'object') return;
        const storage = getStorage();
        if (!storage) return;

        try {
            const payload = {
                presetVersion: getPresetVersion(sceneVariant),
                state,
            };
            storage.setItem(getKey(sceneVariant), JSON.stringify(payload));
        } catch (error) {
            console.warn('[dev-panel] failed to save scene state:', error);
        }
    }

    return { load, save };
}
