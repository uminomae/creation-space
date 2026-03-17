/**
 * dev-panel.js
 * Main panel orchestrator. Imports data/config from dev-panel-data.js
 * and UI builders from dev-panel-ui.js.
 */

import { applyConfigState, cloneConfigState } from './config-state.js';
import {
    GROUP_HELP_JA,
    PARAM_GROUPS,
    resolveVisibleParamGroups,
    resolveVisibleFields,
} from './dev-panel-data.js';
import {
    buildColorControl,
    buildRangeControl,
    buildToggleControl,
    formatHex,
    formatNumber,
} from './dev-panel-ui.js';

export function initDevPanel({
    onStateChanged = null,
    onStateSnapshot = null,
    panelStartsOpen = false,
    initialState = null,
    sceneVariant = 'hold',
} = {}) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'dev-panel-toggle';
    toggleBtn.className = 'dev-panel-toggle-btn';
    toggleBtn.type = 'button';
    toggleBtn.textContent = 'PANEL';

    const panel = document.createElement('aside');
    panel.id = 'dev-panel';
    panel.innerHTML = `
        <div class="dev-panel-header">
            <h2 class="dev-panel-title">Dev Panel</h2>
            <button type="button" class="btn btn-sm btn-outline-light" id="dev-panel-close">Close</button>
        </div>
        <div class="dev-panel-body">
            <div class="accordion" id="dev-panel-accordion"></div>
            <div class="mt-3">
                <label class="form-label" for="dev-json">Config JSON</label>
                <textarea id="dev-json" class="form-control form-control-sm" rows="8"></textarea>
                <div class="dev-json-actions mt-2">
                    <button type="button" class="btn btn-sm btn-outline-light" id="dev-json-copy">Copy JSON</button>
                    <button type="button" class="btn btn-sm btn-outline-light" id="dev-json-paste">Paste JSON</button>
                    <button type="button" class="btn btn-sm btn-primary" id="dev-json-apply">Apply JSON</button>
                </div>
                <div class="dev-json-status" id="dev-json-status"></div>
            </div>
        </div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    function applyFallbackLayoutIfNeeded() {
        // Fallback when dev-panel.css is missing/stale:
        // keep panel operable with inline positioning.
        const toggleStyle = window.getComputedStyle(toggleBtn);
        if (toggleStyle.position === 'static') {
            toggleBtn.style.position = 'fixed';
            toggleBtn.style.top = '50%';
            toggleBtn.style.right = '0';
            toggleBtn.style.left = 'auto';
            toggleBtn.style.transform = 'translateY(-50%)';
            toggleBtn.style.zIndex = '1001';
        }

        const panelStyle = window.getComputedStyle(panel);
        if (panelStyle.position === 'static') {
            panel.style.position = 'fixed';
            panel.style.top = '0';
            panel.style.right = '0';
            panel.style.width = 'min(92vw, 420px)';
            panel.style.height = '100vh';
            panel.style.zIndex = '1200';
            panel.style.background = 'rgba(7, 12, 24, 0.96)';
            panel.style.borderLeft = '1px solid rgba(140, 178, 255, 0.3)';
            panel.style.overflow = 'hidden';
        }
    }

    function hasActiveOffcanvas() {
        return Boolean(document.querySelector('.offcanvas.show, .offcanvas.showing'));
    }

    function syncToggleVisibility() {
        // Keep PANEL tab behavior aligned with LINKS:
        // hide while any offcanvas is active, and also while dev panel itself is open.
        const isPanelOpen = panel.classList.contains('is-open') || panel.classList.contains('open');
        const shouldHide = isPanelOpen || hasActiveOffcanvas();
        toggleBtn.classList.toggle('is-hidden', shouldHide);
    }

    const offcanvasVisibilityEvents = [
        'show.bs.offcanvas',
        'shown.bs.offcanvas',
        'hide.bs.offcanvas',
        'hidden.bs.offcanvas',
    ];

    function setPanelOpen(nextOpen) {
        const isOpen = Boolean(nextOpen);
        // Keep both class names for compatibility with old/new CSS.
        panel.classList.toggle('is-open', isOpen);
        panel.classList.toggle('open', isOpen);

        // Inline compatibility for both transform-based and right-based layouts.
        panel.style.transform = isOpen ? 'translateX(0)' : 'translateX(100%)';
        panel.style.right = isOpen ? '0' : '-300px';
        syncToggleVisibility();
    }

    applyFallbackLayoutIfNeeded();
    setPanelOpen(panelStartsOpen);
    offcanvasVisibilityEvents.forEach((eventName) => {
        document.addEventListener(eventName, syncToggleVisibility);
    });
    syncToggleVisibility();

    const accordion = panel.querySelector('#dev-panel-accordion');
    const jsonArea = panel.querySelector('#dev-json');
    const jsonStatus = panel.querySelector('#dev-json-status');

    const controlIndex = new Map();
    const colorControlIndex = new Map();
    const visibleParamGroups = resolveVisibleParamGroups(sceneVariant);
    const fallbackParamGroups = PARAM_GROUPS;
    const paramGroupsToRender = visibleParamGroups.length > 0
        ? visibleParamGroups
        : fallbackParamGroups;
    const visiblePanelGroups = paramGroupsToRender
        .map((group) => ({ group, fields: resolveVisibleFields(sceneVariant, group) }))
        .filter(({ fields }) => fields.length > 0);
    try {
        window.__devPanelDebug = {
            sceneVariant,
            visibleParamGroupIds: visibleParamGroups.map((group) => group.id),
            renderedGroupIds: visiblePanelGroups.map(({ group }) => group.id),
            renderedGroupCount: visiblePanelGroups.length,
        };
    } catch {
        // no-op: debug hook is best-effort
    }
    if (visibleParamGroups.length === 0) {
        console.warn('[dev-panel] no groups resolved for scene variant; using fallback groups.', {
            sceneVariant,
        });
    }
    if (visiblePanelGroups.length === 0) {
        console.warn('[dev-panel] no panel fields resolved; check scene variant and group schema.', {
            sceneVariant,
        });
    }

    function notifyStateChanged({ shouldSnapshot = true } = {}) {
        if (typeof onStateChanged === 'function') {
            try {
                onStateChanged();
            } catch (error) {
                console.warn('[dev-panel] onStateChanged callback failed:', error);
            }
        }
        if (shouldSnapshot && typeof onStateSnapshot === 'function') {
            try {
                onStateSnapshot(cloneConfigState());
            } catch (error) {
                console.warn('[dev-panel] onStateSnapshot callback failed:', error);
            }
        }
    }

    function refreshJson() {
        jsonArea.value = JSON.stringify(cloneConfigState(), null, 2);
    }

    function setStatus(message, isError = false) {
        jsonStatus.textContent = message;
        jsonStatus.style.color = isError ? 'rgba(255, 138, 138, 0.95)' : 'rgba(201, 221, 255, 0.8)';
    }

    function updateControlValue(path, value, step) {
        const entry = controlIndex.get(path);
        if (!entry) return;
        entry.input.value = String(value);
        entry.valueNode.textContent = formatNumber(value, step);
    }

    function registerControl(path, input, valueNode, step) {
        controlIndex.set(path, { input, valueNode, step });
    }

    function updateColorControlValue(path, color) {
        const entry = colorControlIndex.get(path);
        if (!entry || !color || typeof color.getHex !== 'function') return;
        const hex = color.getHex();
        entry.input.value = formatHex(hex);
        entry.valueNode.textContent = formatHex(hex);
    }

    function registerColorControl(path, input, valueNode) {
        colorControlIndex.set(path, { input, valueNode });
    }

    visiblePanelGroups.forEach(({ group, fields }, idx) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';

        const headerId = `dev-head-${group.id}`;
        const collapseId = `dev-collapse-${group.id}`;

        item.innerHTML = `
            <h2 class="accordion-header" id="${headerId}">
                <button class="accordion-button ${idx === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${idx === 0 ? 'true' : 'false'}" aria-controls="${collapseId}">
                    ${group.title}
                </button>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}" aria-labelledby="${headerId}" data-bs-parent="#dev-panel-accordion">
                <div class="accordion-body"></div>
            </div>
        `;

        const body = item.querySelector('.accordion-body');
        const groupHelp = GROUP_HELP_JA[group.id];
        if (groupHelp) {
            const helpNode = document.createElement('p');
            helpNode.className = 'dev-group-help';
            helpNode.textContent = groupHelp;
            body.appendChild(helpNode);
        }
        fields.forEach((field) => {
            let node;
            if (group.type === 'toggle') {
                node = buildToggleControl(group, field, notifyStateChanged, refreshJson);
            } else if (field.type === 'color') {
                node = buildColorControl(group, field, notifyStateChanged, refreshJson, registerColorControl);
            } else {
                node = buildRangeControl(group, field, notifyStateChanged, refreshJson, registerControl);
            }
            body.appendChild(node);
        });

        accordion.appendChild(item);
    });

    if (visiblePanelGroups.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'dev-panel-empty';
        empty.textContent = `No controls resolved for scene variant: ${sceneVariant}`;
        accordion.appendChild(empty);
    }

    function syncUIFromState() {
        visiblePanelGroups.forEach(({ group, fields }) => {
            fields.forEach((field) => {
                const key = field.type === 'color' ? field.key : field[0];
                const path = `${group.id}.${key}`;

                if (group.type === 'toggle') {
                    const input = panel.querySelector(`#dev-${path}`);
                    if (input) input.checked = Boolean(group.target[key]);
                    return;
                }

                if (field.type === 'color') {
                    updateColorControlValue(path, group.target[key]);
                    return;
                }

                updateControlValue(path, group.target[key], field[4]);
            });
        });
    }

    async function copyJson() {
        refreshJson();
        try {
            await navigator.clipboard.writeText(jsonArea.value);
            setStatus('Copied JSON to clipboard.');
        } catch (error) {
            setStatus('Copy failed. Manual copy from textarea.', true);
        }
    }

    async function pasteJson() {
        try {
            const text = await navigator.clipboard.readText();
            jsonArea.value = text;
            applyJson();
        } catch (error) {
            setStatus('Paste failed. Paste text manually.', true);
        }
    }

    function applyJson() {
        try {
            const payload = JSON.parse(jsonArea.value);
            if (!payload || typeof payload !== 'object') {
                throw new Error('Invalid JSON object.');
            }

            applyConfigState(payload);

            notifyStateChanged();
            syncUIFromState();
            refreshJson();
            setStatus('Applied JSON to current state.');
        } catch (error) {
            setStatus(`JSON apply failed: ${error.message}`, true);
        }
    }

    toggleBtn.addEventListener('click', () => {
        const willOpen = !panel.classList.contains('is-open') && !panel.classList.contains('open');
        setPanelOpen(willOpen);
    });

    panel.querySelector('#dev-panel-close').addEventListener('click', () => {
        setPanelOpen(false);
    });

    panel.querySelector('#dev-json-copy').addEventListener('click', copyJson);
    panel.querySelector('#dev-json-paste').addEventListener('click', pasteJson);
    panel.querySelector('#dev-json-apply').addEventListener('click', applyJson);

    if (initialState && typeof initialState === 'object') {
        applyConfigState(initialState);
        notifyStateChanged();
    }
    syncUIFromState();
    refreshJson();

    return {
        open() {
            setPanelOpen(true);
        },
        close() {
            setPanelOpen(false);
        },
        destroy() {
            offcanvasVisibilityEvents.forEach((eventName) => {
                document.removeEventListener(eventName, syncToggleVisibility);
            });
            toggleBtn.remove();
            panel.remove();
        },
        getStateSnapshot() {
            return cloneConfigState();
        },
    };
}
