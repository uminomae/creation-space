import { normalizeLang } from '../i18n.js';
import { dict } from '../i18n/dict.js';
import {
    MODEL_GUIDE_LINKS,
    STATUS_REPORT_LINKS,
    formatReportsScenarioFallbackLabel,
    getDefaultProgressTaxonomyEntry,
    hasText,
    normalizeProgressLevelId,
    resolveLocalizedSources,
} from './data.js';
import { DOMAIN_HISTORY_MODE_PUSH } from './history.js';

export function getReportsStrings(lang = 'ja') {
    return dict[normalizeLang(lang)]?.reports || dict.ja.reports;
}

export function getDomainReportTitle(report, lang = 'ja') {
    if (!report) return '';
    const useJapanese = normalizeLang(lang) === 'ja';
    const domainLabel = useJapanese
        ? (report.nameJa || report.nameEn)
        : (report.nameEn || report.nameJa);
    return `${report.id} ${domainLabel}`.trim();
}

export function createReportsRenderer({
    state,
    openMarkdownModal,
    openDomainModalById,
    getReportSources,
}) {
    function getReportsScenarioLabel(scenario = state.activeScenario) {
        if (!scenario) return '';
        if (normalizeLang(state.lang) === 'ja') {
            return scenario.labelJa || scenario.labelEn || formatReportsScenarioFallbackLabel(scenario.name);
        }
        return scenario.labelEn || scenario.labelJa || formatReportsScenarioFallbackLabel(scenario.name);
    }

    function getReportsScenarioDescription(scenario = state.activeScenario) {
        if (!scenario) return '';
        if (normalizeLang(state.lang) === 'ja') {
            return scenario.descriptionJa || scenario.descriptionEn || '';
        }
        return scenario.descriptionEn || scenario.descriptionJa || '';
    }

    function getProgressTaxonomyEntry(level) {
        const normalizedLevel = normalizeProgressLevelId(level);
        return state.progressTaxonomy.find((entry) => entry.id === normalizedLevel)
            || getDefaultProgressTaxonomyEntry(normalizedLevel);
    }

    function getProgressLevelLabel(level) {
        const taxonomyEntry = getProgressTaxonomyEntry(level);
        return normalizeLang(state.lang) === 'ja'
            ? (taxonomyEntry.labelJa || taxonomyEntry.labelEn || taxonomyEntry.id)
            : (taxonomyEntry.labelEn || taxonomyEntry.labelJa || taxonomyEntry.id);
    }

    function getProgressLevelDescription(level) {
        const taxonomyEntry = getProgressTaxonomyEntry(level);
        return normalizeLang(state.lang) === 'ja'
            ? (taxonomyEntry.descriptionJa || taxonomyEntry.descriptionEn || '')
            : (taxonomyEntry.descriptionEn || taxonomyEntry.descriptionJa || '');
    }

    function formatProgressDescription(level) {
        return getProgressLevelDescription(level);
    }
    function getPresentProgressTaxonomy() {
        return state.progressTaxonomy.filter((entry) => (state.progressLevelCounts[entry.id] || 0) > 0);
    }

    function buildProgressPaletteMap(presentTaxonomy = getPresentProgressTaxonomy()) {
        const paletteMap = new Map();
        const source = presentTaxonomy.length ? presentTaxonomy : state.progressTaxonomy;

        source.forEach((entry, index) => {
            paletteMap.set(entry.id, `is-palette-${(index % 10) + 1}`);
        });

        return paletteMap;
    }

    function getProgressPaletteClass(level, paletteMap) {
        const normalizedLevel = normalizeProgressLevelId(level);
        if (!normalizedLevel) return 'is-palette-1';
        return paletteMap.get(normalizedLevel) || 'is-palette-1';
    }

    function getAvailableFilterKeys() {
        return new Set(['all', ...getPresentProgressTaxonomy().map((entry) => entry.id)]);
    }

    function cacheDom() {
        state.dom.error = document.getElementById('reports-error');
        state.dom.openStatusBtn = document.getElementById('reports-open-status-btn');
        state.dom.domainsHeading = document.getElementById('reports-domains-heading');
        state.dom.scenarioNote = document.getElementById('reports-scenario-note');
        state.dom.levelLegend = document.getElementById('reports-level-legend');
        state.dom.featureCards = document.getElementById('reports-feature-cards');
        state.dom.metrics = document.getElementById('reports-metrics');
        state.dom.domainGrid = document.getElementById('reports-domain-grid');
        state.dom.filterGroup = document.getElementById('reports-table-filters');
        state.dom.mdModal = document.getElementById('reports-md-modal');
        state.dom.mdModalTitle = document.getElementById('reports-md-modal-title');
        state.dom.mdModalMeta = document.getElementById('reports-md-meta');
        state.dom.mdModalContent = document.getElementById('reports-md-content');
        state.dom.mdOpenPdf = document.getElementById('reports-md-open-pdf');
    }

    function setReportsError(message) {
        if (!state.dom.error) return;
        if (message) {
            state.dom.error.textContent = message;
            state.dom.error.classList.remove('d-none');
            return;
        }
        state.dom.error.textContent = '';
        state.dom.error.classList.add('d-none');
    }

    function renderLevelLegend() {
        if (!state.dom.levelLegend) return;

        const strings = getReportsStrings(state.lang);
        const legendNode = state.dom.levelLegend;
        const presentTaxonomy = getPresentProgressTaxonomy();
        const paletteMap = buildProgressPaletteMap(presentTaxonomy);
        if (!presentTaxonomy.length) {
            legendNode.textContent = state.loadError ? strings.levelLegendUnavailable : strings.levelLegend;
            return;
        }

        if (presentTaxonomy.length === 1) {
            const level = presentTaxonomy[0].id;
            const count = state.progressLevelCounts[level] || 0;
            const label = getProgressLevelLabel(level);
            legendNode.textContent = strings.levelLegendSingle
                .replace('{count}', String(count))
                .replace('{label}', label);
            return;
        }

        legendNode.innerHTML = '';

        const fragment = document.createDocumentFragment();
        const prefixNode = document.createElement('span');
        prefixNode.className = 'reports-level-legend-prefix';
        prefixNode.textContent = `${strings.levelLegendPrefix}:`;
        fragment.appendChild(prefixNode);

        presentTaxonomy.forEach((entry) => {
            const paletteClass = getProgressPaletteClass(entry.id, paletteMap);
            const lineNode = document.createElement('span');
            lineNode.className = 'reports-level-legend-line';

            const labelNode = document.createElement('span');
            labelNode.className = `badge rounded-pill reports-progress-chip reports-level-legend-label ${paletteClass}`;
            labelNode.textContent = getProgressLevelLabel(entry.id);
            lineNode.appendChild(labelNode);

            const description = getProgressLevelDescription(entry.id);
            if (description) {
                const descriptionNode = document.createElement('span');
                descriptionNode.className = 'reports-level-legend-description';
                descriptionNode.textContent = ` ${description}`;
                lineNode.appendChild(descriptionNode);
            }

            fragment.appendChild(lineNode);
        });

        legendNode.appendChild(fragment);
    }

    function createFilterButton({ filterKey, label, isActive, paletteClass = '' }) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = [
            'btn',
            'btn-outline-light',
            'btn-sm',
            'reports-filter-btn',
            paletteClass,
            isActive ? 'active' : '',
        ].join(' ').trim();
        button.dataset.filter = filterKey;
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        button.textContent = label;
        return button;
    }

    function updateFilterButtons() {
        if (!state.dom.filterGroup) return;

        const strings = getReportsStrings(state.lang);
        const presentTaxonomy = getPresentProgressTaxonomy();
        const paletteMap = buildProgressPaletteMap(presentTaxonomy);
        if (presentTaxonomy.length <= 1) {
            state.tableFilter = 'all';
            state.dom.filterGroup.innerHTML = '';
            state.dom.filterGroup.classList.remove('d-flex');
            state.dom.filterGroup.classList.add('d-none');
            return;
        }

        state.dom.filterGroup.classList.remove('d-none');
        state.dom.filterGroup.classList.add('d-flex');
        if (!getAvailableFilterKeys().has(state.tableFilter)) {
            state.tableFilter = 'all';
        }

        const fragment = document.createDocumentFragment();
        fragment.appendChild(createFilterButton({
            filterKey: 'all',
            label: strings.filterAll,
            isActive: state.tableFilter === 'all',
        }));

        presentTaxonomy.forEach((entry) => {
            fragment.appendChild(createFilterButton({
                filterKey: entry.id,
                label: getProgressLevelLabel(entry.id),
                isActive: state.tableFilter === entry.id,
                paletteClass: getProgressPaletteClass(entry.id, paletteMap),
            }));
        });

        state.dom.filterGroup.innerHTML = '';
        state.dom.filterGroup.appendChild(fragment);
    }

    function applyStaticText() {
        const strings = getReportsStrings(state.lang);

        if (state.dom.domainsHeading) state.dom.domainsHeading.textContent = strings.tabDomains;
        if (state.dom.scenarioNote) {
            const scenarioLabel = getReportsScenarioLabel();
            const scenarioDescription = getReportsScenarioDescription();
            if (scenarioLabel) {
                state.dom.scenarioNote.textContent = `${strings.scenarioPrefix}: ${scenarioLabel}`;
                state.dom.scenarioNote.title = scenarioDescription;
                state.dom.scenarioNote.classList.remove('d-none');
            } else {
                state.dom.scenarioNote.textContent = '';
                state.dom.scenarioNote.title = '';
                state.dom.scenarioNote.classList.add('d-none');
            }
        }
        renderLevelLegend();

        if (state.dom.filterGroup) state.dom.filterGroup.setAttribute('aria-label', strings.filterGroupAria);
        if (state.dom.openStatusBtn) state.dom.openStatusBtn.textContent = strings.openStatus;

        updateFilterButtons();
    }

    function renderFeatureCards() {
        if (!state.dom.featureCards) return;

        const strings = getReportsStrings(state.lang);
        state.dom.featureCards.innerHTML = '';

        const fragment = document.createDocumentFragment();
        MODEL_GUIDE_LINKS.forEach((guide) => {
            const featureText = strings.features[guide.key];
            if (!featureText) return;

            const col = document.createElement('div');
            col.className = 'col';

            const card = document.createElement('article');
            card.className = 'card kesson-card h-100 reports-feature-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `${featureText.title} ${strings.featureRead}`);

            const body = document.createElement('div');
            body.className = 'card-body p-2 p-md-3 d-flex flex-column gap-1';

            const title = document.createElement('h3');
            title.className = 'h6 mb-1 text-light';
            title.textContent = featureText.title;

            const desc = document.createElement('p');
            desc.className = 'small mb-0 reports-feature-description';
            desc.textContent = featureText.description;

            const openCardModal = () => {
                openMarkdownModal({
                    title: featureText.modalTitle || featureText.title,
                    sources: resolveLocalizedSources(guide.links, state.lang),
                });
            };

            body.appendChild(title);
            body.appendChild(desc);
            card.appendChild(body);
            card.addEventListener('click', openCardModal);
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openCardModal();
                }
            });

            col.appendChild(card);
            fragment.appendChild(col);
        });

        state.dom.featureCards.appendChild(fragment);
    }

    function createMetricCard(label, value, { paletteClass = '' } = {}) {
        const col = document.createElement('div');
        col.className = 'col-6 col-lg';

        const card = document.createElement('div');
        card.className = [
            'card',
            'report-metric-card',
            'h-100',
            paletteClass ? 'reports-progress-card' : '',
            paletteClass,
        ].join(' ').trim();

        const body = document.createElement('div');
        body.className = 'card-body py-2 px-3';

        const metricLabel = document.createElement('div');
        metricLabel.className = 'report-metric-label text-uppercase small';
        metricLabel.textContent = label;

        const metricValue = document.createElement('div');
        metricValue.className = 'report-metric-value fw-semibold';
        metricValue.textContent = value;

        body.appendChild(metricLabel);
        body.appendChild(metricValue);
        card.appendChild(body);
        col.appendChild(card);
        return col;
    }

    function renderMetrics() {
        if (!state.dom.metrics) return;

        const strings = getReportsStrings(state.lang);
        const total = state.reports.length;
        const generatedValue = state.generatedAt ? state.generatedAt.slice(0, 10) : '-';
        const presentTaxonomy = getPresentProgressTaxonomy();
        const paletteMap = buildProgressPaletteMap(presentTaxonomy);

        state.dom.metrics.innerHTML = '';
        const fragment = document.createDocumentFragment();
        fragment.appendChild(createMetricCard(strings.metricGenerated, generatedValue));
        fragment.appendChild(createMetricCard(strings.metricTotal, String(total)));

        presentTaxonomy.forEach((entry) => {
            fragment.appendChild(createMetricCard(
                getProgressLevelLabel(entry.id),
                String(state.progressLevelCounts[entry.id] || 0),
                { paletteClass: getProgressPaletteClass(entry.id, paletteMap) },
            ));
        });

        state.dom.metrics.appendChild(fragment);
    }

    function createDomainGridItem({ report, muted = false, paletteMap }) {
        const strings = getReportsStrings(state.lang);
        const useJapanese = normalizeLang(state.lang) === 'ja';
        const domainLabel = useJapanese
            ? (report.nameJa || report.nameEn)
            : (report.nameEn || report.nameJa);
        const level = normalizeProgressLevelId(report.progressLevel) || 'not_surveyed';
        const paletteClass = getProgressPaletteClass(level, paletteMap);
        const statusText = getProgressLevelLabel(level);
        const statusDescription = formatProgressDescription(level);
        const sources = getReportSources(report);
        const clickable = sources.length > 0 && !muted;
        const tile = clickable ? document.createElement('button') : document.createElement('article');
        const reportTitle = getDomainReportTitle(report, state.lang) || `${report.id} ${domainLabel}`;

        if (clickable) {
            tile.type = 'button';
            tile.addEventListener('click', () => {
                openDomainModalById(report.id, {
                    historyMode: DOMAIN_HISTORY_MODE_PUSH,
                    syncUrl: 'push',
                });
            });
        }

        tile.className = [
            'reports-domain-item',
            'card',
            paletteClass,
            `is-level-${level.replace(/_/g, '-')}`,
            muted ? 'is-filter-muted' : '',
        ].join(' ').trim();
        tile.setAttribute('data-report-level', level);
        tile.setAttribute('aria-label', `${reportTitle} ${statusText}`);

        const hoverHint = [statusDescription, report.progressNote]
            .filter((part) => hasText(part))
            .join('\n');
        if (hoverHint) {
            tile.setAttribute('title', hoverHint);
        }
        if (!clickable) {
            tile.setAttribute('aria-disabled', 'true');
        }

        const body = document.createElement('div');
        body.className = 'card-body p-1 d-flex flex-column reports-domain-item-body';

        const head = document.createElement('div');
        head.className = 'd-flex align-items-center justify-content-between gap-2 reports-domain-item-head';

        const idNode = document.createElement('span');
        idNode.className = 'reports-domain-item-id';
        idNode.textContent = report.id;

        const statusNode = document.createElement('span');
        statusNode.className = `badge rounded-pill reports-progress-chip reports-domain-item-status ${paletteClass}`;
        statusNode.textContent = statusText;
        if (hoverHint) {
            statusNode.setAttribute('title', hoverHint);
        }

        const nameNode = document.createElement('div');
        nameNode.className = 'reports-domain-item-name';
        nameNode.title = domainLabel;
        nameNode.textContent = domainLabel;

        head.appendChild(idNode);
        head.appendChild(statusNode);
        body.appendChild(head);
        body.appendChild(nameNode);
        tile.appendChild(body);

        return tile;
    }

    function renderDomainGrid() {
        if (!state.dom.domainGrid) return;

        const allReports = state.reports;
        const paletteMap = buildProgressPaletteMap(getPresentProgressTaxonomy());

        state.dom.domainGrid.innerHTML = '';
        if (!allReports.length) {
            const empty = document.createElement('div');
            empty.className = 'reports-domain-empty text-body-secondary';
            empty.textContent = getReportsStrings(state.lang).empty;
            state.dom.domainGrid.appendChild(empty);
            return;
        }

        const fragment = document.createDocumentFragment();
        allReports.forEach((report) => {
            const muted = state.tableFilter !== 'all' && report.progressLevel !== state.tableFilter;
            fragment.appendChild(createDomainGridItem({ report, muted, paletteMap }));
        });

        state.dom.domainGrid.appendChild(fragment);
    }

    function bindUiEvents() {
        if (state.quickLinksBound) return;

        if (state.dom.openStatusBtn && !state.dom.openStatusBtn.dataset.boundClick) {
            state.dom.openStatusBtn.addEventListener('click', () => {
                const strings = getReportsStrings(state.lang);
                openMarkdownModal({
                    title: strings.statusReportTitle,
                    sources: resolveLocalizedSources(STATUS_REPORT_LINKS, state.lang),
                });
            });
            state.dom.openStatusBtn.dataset.boundClick = '1';
        }

        if (state.dom.mdOpenPdf && !state.dom.mdOpenPdf.dataset.boundClick) {
            state.dom.mdOpenPdf.addEventListener('click', (event) => {
                if (state.dom.mdOpenPdf?.classList.contains('disabled')) {
                    event.preventDefault();
                }
            });
            state.dom.mdOpenPdf.dataset.boundClick = '1';
        }

        if (state.dom.filterGroup && !state.dom.filterGroup.dataset.boundClick) {
            state.dom.filterGroup.addEventListener('click', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLElement)) return;
                const button = target.closest('button[data-filter]');
                if (!(button instanceof HTMLButtonElement)) return;

                const nextFilter = button.dataset.filter;
                if (!getAvailableFilterKeys().has(nextFilter) || nextFilter === state.tableFilter) return;

                state.tableFilter = nextFilter;
                updateFilterButtons();
                renderDomainGrid();
            });
            state.dom.filterGroup.dataset.boundClick = '1';
        }

        state.quickLinksBound = true;
    }

    function renderReports() {
        applyStaticText();
        renderFeatureCards();
        renderMetrics();
        renderDomainGrid();
        setReportsError(state.loadError ? getReportsStrings(state.lang).error : '');
    }

    return {
        bindUiEvents,
        cacheDom,
        getStrings: getReportsStrings,
        renderReports,
    };
}
