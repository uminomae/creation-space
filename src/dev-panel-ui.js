/**
 * dev-panel-ui.js
 * DOM building functions and format helpers for the dev panel.
 */

import { getFieldHelpText } from './dev-panel-data.js';

export function formatNumber(value, step) {
    const decimals = String(step).includes('.')
        ? String(step).split('.')[1].length
        : 0;
    return Number(value).toFixed(Math.min(decimals, 4));
}

export function formatHex(value) {
    return `#${Math.max(0, Math.min(0xffffff, Math.round(value))).toString(16).padStart(6, '0')}`;
}

export function buildToggleControl(group, field, notifyStateChanged, refreshJson) {
    const [key, label] = field;
    const path = `${group.id}.${key}`;
    const wrapper = document.createElement('div');
    wrapper.className = 'form-check form-switch dev-row';

    const input = document.createElement('input');
    input.className = 'form-check-input';
    input.type = 'checkbox';
    input.id = `dev-${path}`;
    input.checked = Boolean(group.target[key]);

    const labelEl = document.createElement('label');
    labelEl.className = 'form-check-label';
    labelEl.setAttribute('for', input.id);
    labelEl.textContent = label;

    input.addEventListener('change', () => {
        group.target[key] = input.checked;
        notifyStateChanged();
        refreshJson();
    });

    wrapper.appendChild(input);
    wrapper.appendChild(labelEl);
    return wrapper;
}

export function buildRangeControl(group, field, notifyStateChanged, refreshJson, registerControl) {
    const [key, label, min, max, step] = field;
    const path = `${group.id}.${key}`;

    const wrapper = document.createElement('div');
    wrapper.className = 'dev-row';

    const meta = document.createElement('div');
    meta.className = 'dev-row-meta';

    const labelEl = document.createElement('label');
    labelEl.className = 'form-label';
    labelEl.setAttribute('for', `dev-${path}`);
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.className = 'dev-value';
    valueEl.textContent = formatNumber(group.target[key], step);

    meta.appendChild(labelEl);
    meta.appendChild(valueEl);

    const input = document.createElement('input');
    input.className = 'form-range';
    input.type = 'range';
    input.id = `dev-${path}`;
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(group.target[key]);

    input.addEventListener('input', () => {
        const val = Number(input.value);
        group.target[key] = val;
        valueEl.textContent = formatNumber(val, step);
        // Drag responsiveness priority:
        // avoid expensive full-state snapshot on every slider tick.
        notifyStateChanged({ shouldSnapshot: false });
    });

    input.addEventListener('change', () => {
        notifyStateChanged({ shouldSnapshot: true });
        refreshJson();
    });

    registerControl(path, input, valueEl, step);

    const helpText = getFieldHelpText(group.id, key);

    wrapper.appendChild(meta);
    wrapper.appendChild(input);
    if (helpText) {
        const help = document.createElement('div');
        help.className = 'dev-row-help';
        help.textContent = helpText;
        wrapper.appendChild(help);
    }
    return wrapper;
}

export function buildColorControl(group, field, notifyStateChanged, refreshJson, registerColorControl) {
    const { key, label } = field;
    const path = `${group.id}.${key}`;
    const color = group.target[key];

    const wrapper = document.createElement('div');
    wrapper.className = 'dev-row';

    const meta = document.createElement('div');
    meta.className = 'dev-row-meta';

    const labelEl = document.createElement('label');
    labelEl.className = 'form-label';
    labelEl.setAttribute('for', `dev-${path}`);
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.className = 'dev-value';
    valueEl.textContent = formatHex(color.getHex());

    meta.appendChild(labelEl);
    meta.appendChild(valueEl);

    const input = document.createElement('input');
    input.className = 'form-control form-control-color';
    input.type = 'color';
    input.id = `dev-${path}`;
    input.value = formatHex(color.getHex());
    input.title = label;

    input.addEventListener('input', () => {
        group.target[key].set(input.value);
        valueEl.textContent = formatHex(group.target[key].getHex());
        notifyStateChanged({ shouldSnapshot: false });
    });

    input.addEventListener('change', () => {
        notifyStateChanged({ shouldSnapshot: true });
        refreshJson();
    });

    registerColorControl(path, input, valueEl);

    const helpText = getFieldHelpText(group.id, key);
    wrapper.appendChild(meta);
    wrapper.appendChild(input);
    if (helpText) {
        const help = document.createElement('div');
        help.className = 'dev-row-help';
        help.textContent = helpText;
        wrapper.appendChild(help);
    }
    return wrapper;
}
