const OFFCANVAS_ID = 'devLinksOffcanvas';
const TOGGLE_ID = 'dev-links-toggle';
const LIST_ID = 'dev-links-list';
const STATUS_ID = 'dev-links-status';
const JSON_LINK_ID = 'dev-links-json-link';
const JSON_PREVIEW_ID = 'dev-links-json-preview';
const RELOAD_BTN_ID = 'dev-links-reload';
const LINKS_JSON_URL = './assets/page-links.json';

let initialized = false;

function setStatus(message, tone = 'muted') {
    const el = document.getElementById(STATUS_ID);
    if (!el) return;
    el.className = tone === 'danger' ? 'text-danger' : 'text-muted';
    el.textContent = message;
}

async function copyText(text) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (error) {
        // fallback below
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.top = '-1000px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
}

function buildLinkUrl(item, basePath = './') {
    const path = item?.path || basePath || './';
    const url = new URL(path, window.location.href);
    const query = item?.query || {};

    Object.entries(query).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') return;
        url.searchParams.set(key, String(value));
    });

    if (item?.hash) {
        url.hash = String(item.hash).replace(/^#/, '');
    }
    return url.toString();
}

function createLinkItem(key, item, fullUrl) {
    const row = document.createElement('div');
    row.className = 'dev-links-item p-2 rounded border';

    const meta = document.createElement('div');
    meta.className = 'dev-links-key';
    meta.textContent = key;

    const label = document.createElement('div');
    label.className = 'fw-semibold text-light';
    label.textContent = item.label || key;

    const code = document.createElement('code');
    code.className = 'dev-links-url d-block mt-1';
    code.textContent = fullUrl;

    const actions = document.createElement('div');
    actions.className = 'd-flex gap-2 mt-2';

    const open = document.createElement('a');
    open.className = 'btn btn-sm btn-outline-light';
    open.href = fullUrl;
    open.target = '_blank';
    open.rel = 'noopener';
    open.textContent = 'Open';

    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'btn btn-sm btn-outline-info';
    copy.textContent = 'Copy';
    copy.addEventListener('click', async () => {
        const ok = await copyText(fullUrl);
        copy.textContent = ok ? 'Copied' : 'Copy failed';
        window.setTimeout(() => {
            copy.textContent = 'Copy';
        }, 1200);
    });

    actions.appendChild(open);
    actions.appendChild(copy);
    row.appendChild(meta);
    row.appendChild(label);
    row.appendChild(code);
    row.appendChild(actions);
    return row;
}

function renderLinks(data, jsonUrl, rawText) {
    const list = document.getElementById(LIST_ID);
    const jsonLink = document.getElementById(JSON_LINK_ID);
    const jsonPreview = document.getElementById(JSON_PREVIEW_ID);
    if (!list || !jsonLink || !jsonPreview) return;

    list.innerHTML = '';

    const basePath = data?.basePath || './';
    const presets = data?.presets || {};
    const entries = Object.entries(presets).sort(([a], [b]) => a.localeCompare(b));

    if (entries.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'text-muted small';
        empty.textContent = 'No links found.';
        list.appendChild(empty);
    } else {
        entries.forEach(([key, item]) => {
            const fullUrl = buildLinkUrl(item, basePath);
            list.appendChild(createLinkItem(key, item, fullUrl));
        });
    }

    jsonLink.href = jsonUrl;
    jsonLink.textContent = jsonUrl;
    jsonPreview.textContent = rawText;
}

async function loadLinks() {
    const jsonUrl = new URL(LINKS_JSON_URL, window.location.href).toString();
    setStatus('Loading links...');

    const res = await fetch(jsonUrl, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    const rawText = await res.text();
    const data = JSON.parse(rawText);
    renderLinks(data, jsonUrl, rawText);
    setStatus(`Loaded ${Object.keys(data?.presets || {}).length} links.`);
}

function createShell() {
    if (document.getElementById(TOGGLE_ID) || document.getElementById(OFFCANVAS_ID)) return;

    const toggle = document.createElement('button');
    toggle.id = TOGGLE_ID;
    toggle.type = 'button';
    toggle.className = 'dev-links-toggle-btn';
    toggle.setAttribute('data-bs-toggle', 'offcanvas');
    toggle.setAttribute('data-bs-target', `#${OFFCANVAS_ID}`);
    toggle.setAttribute('aria-controls', OFFCANVAS_ID);
    toggle.textContent = 'LINKS';
    document.body.appendChild(toggle);

    const panel = document.createElement('div');
    panel.id = OFFCANVAS_ID;
    panel.className = 'offcanvas offcanvas-end offcanvas-kesson offcanvas-links';
    panel.tabIndex = -1;
    panel.setAttribute('data-bs-theme', 'dark');
    panel.setAttribute('data-bs-backdrop', 'true');
    panel.innerHTML = `
      <div class="offcanvas-header border-bottom border-secondary">
        <div>
          <h5 class="text-light mb-0 offcanvas-title-spaced">LINK HUB</h5>
          <small id="${STATUS_ID}" class="text-muted">Preparing...</small>
        </div>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body p-3">
        <ul class="nav nav-tabs nav-fill" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" type="button" data-bs-toggle="tab"
              data-bs-target="#dev-links-tab-presets" role="tab" aria-selected="true">Presets</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" type="button" data-bs-toggle="tab"
              data-bs-target="#dev-links-tab-json" role="tab" aria-selected="false">JSON</button>
          </li>
        </ul>
        <div class="tab-content pt-3">
          <div class="tab-pane fade show active" id="dev-links-tab-presets" role="tabpanel">
            <div id="${LIST_ID}" class="d-grid gap-2"></div>
          </div>
          <div class="tab-pane fade" id="dev-links-tab-json" role="tabpanel">
            <p class="small text-muted mb-2">Source JSON</p>
            <a id="${JSON_LINK_ID}" class="small d-inline-block mb-2 text-break" href="#" target="_blank" rel="noopener">-</a>
            <div class="mb-2">
              <button id="${RELOAD_BTN_ID}" type="button" class="btn btn-sm btn-outline-light">Reload</button>
            </div>
            <pre id="${JSON_PREVIEW_ID}" class="dev-links-json-preview"></pre>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
}

async function waitForBootstrap(timeoutMs = 3000) {
    const started = Date.now();
    while (Date.now() - started <= timeoutMs) {
        if (window.bootstrap?.Offcanvas && window.bootstrap?.Tab) return true;
        await new Promise((resolve) => window.setTimeout(resolve, 50));
    }
    return false;
}

export async function initDevLinksPanel() {
    if (initialized) return;
    initialized = true;

    createShell();

    const hasBootstrap = await waitForBootstrap();
    if (!hasBootstrap) {
        setStatus('Bootstrap not ready.', 'danger');
        return;
    }

    const reloadBtn = document.getElementById(RELOAD_BTN_ID);
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            loadLinks().catch((error) => {
                console.error('[dev-links] load failed:', error);
                setStatus(`Load failed: ${error.message}`, 'danger');
            });
        });
    }

    loadLinks().catch((error) => {
        console.error('[dev-links] load failed:', error);
        setStatus(`Load failed: ${error.message}`, 'danger');
    });
}
