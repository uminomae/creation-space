// prologue-timeline.js — 5段階モデルのタイムライン表示 (cs#179 Phase B)

import { getCurrentLang, normalizeLang } from './i18n.js';
import { dict } from './i18n/dict.js';

const STAGE_COLORS = [
    'rgba(100, 150, 255, 0.9)',   // 場 — blue
    'rgba(120, 200, 170, 0.9)',   // 波 — teal
    'rgba(220, 180, 100, 0.9)',   // 縁 — amber
    'rgba(200, 120, 100, 0.9)',   // 渦 — coral
    'rgba(170, 140, 220, 0.9)',   // 束 — purple
];

let _observer = null;
let _scrollListener = null;
let _timeline = null;
let _nodesRow = null;
let _descArea = null;
let _stages = [];
let _activeStageIndex = 0;

function getStages(lang) {
    return dict[normalizeLang(lang)]?.reports?.stages || dict.ja.reports.stages;
}

export function initPrologueTimeline() {
    const section = document.getElementById('model-section');
    if (!section) return;

    const contentWrap = section.querySelector('.section-content-wrap');
    if (!contentWrap) return;

    if (!_timeline) {
        _timeline = document.createElement('div');
        _timeline.className = 'prologue-timeline';
        _timeline.setAttribute('role', 'list');

        _nodesRow = document.createElement('div');
        _nodesRow.className = 'prologue-nodes';

        _descArea = document.createElement('div');
        _descArea.className = 'prologue-desc';
        _descArea.setAttribute('aria-live', 'polite');

        _timeline.appendChild(_nodesRow);
        _timeline.appendChild(_descArea);
    }

    // feature cards の前に挿入
    const container = contentWrap.querySelector('.container');
    const featureCards = document.getElementById('reports-feature-cards');
    if (_timeline && !container?.contains(_timeline)) {
        if (container && featureCards) {
            container.insertBefore(_timeline, featureCards.closest('.reports-tab-content') || featureCards);
        } else if (container) {
            container.appendChild(_timeline);
        }
    }

    renderTimeline(getCurrentLang());
}

function renderTimeline(lang) {
    if (!_timeline || !_nodesRow || !_descArea) return;

    const normalized = normalizeLang(lang);
    _stages = getStages(normalized);
    _timeline.setAttribute('aria-label', normalized === 'ja' ? '創造の5段階' : 'Five Stages of Creation');
    _nodesRow.innerHTML = '';

    _stages.forEach((stage, index) => {
        const node = document.createElement('div');
        node.className = 'prologue-node';
        node.setAttribute('role', 'listitem');
        node.setAttribute('tabindex', '0');
        node.dataset.stageIndex = String(index);
        node.style.setProperty('--stage-color', STAGE_COLORS[index]);

        const dot = document.createElement('span');
        dot.className = 'prologue-dot';

        const label = document.createElement('span');
        label.className = 'prologue-label';
        label.textContent = stage.label;

        const sub = document.createElement('span');
        sub.className = 'prologue-sub';
        sub.textContent = stage.sub;

        node.appendChild(dot);
        node.appendChild(label);
        node.appendChild(sub);

        node.addEventListener('click', () => activateStage(index));
        node.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activateStage(index);
            }
        });
        node.addEventListener('focus', () => activateStage(index));

        _nodesRow.appendChild(node);
    });

    const progressLine = document.createElement('div');
    progressLine.className = 'prologue-progress-line';
    _nodesRow.appendChild(progressLine);

    activateStage(Math.min(_activeStageIndex, _stages.length - 1));
    initScrollObserver();
}

function activateStage(index) {
    _activeStageIndex = index;
    const nodes = _nodesRow?.querySelectorAll('.prologue-node') || [];
    nodes.forEach((node, i) => {
        node.classList.toggle('is-active', i === index);
    });

    // 進行線の更新
    const line = _nodesRow?.querySelector('.prologue-progress-line');
    if (line) {
        const progress = ((index + 1) / _stages.length) * 100;
        line.style.setProperty('--progress', `${progress}%`);
    }

    // 説明テキスト更新
    const stage = _stages[index];
    if (_descArea && stage) {
        _descArea.innerHTML = '';
        const title = document.createElement('span');
        title.className = 'prologue-desc-title';
        title.textContent = normalizeLang(getCurrentLang()) === 'ja'
            ? `${stage.label}（${stage.sub}）`
            : `${stage.label} (${stage.sub})`;
        title.style.color = STAGE_COLORS[index];

        const text = document.createElement('span');
        text.className = 'prologue-desc-text';
        text.textContent = stage.desc;

        _descArea.appendChild(title);
        _descArea.appendChild(text);
    }
}

function detachScrollListener() {
    if (_scrollListener) {
        window.removeEventListener('scroll', _scrollListener);
        _scrollListener = null;
    }
}

function initScrollObserver() {
    if (!_nodesRow) return;
    if (_observer) _observer.disconnect();
    detachScrollListener();

    const updateOnScroll = () => {
        if (!_nodesRow || !_stages.length) return;
        const rect = _nodesRow.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const centerRatio = 1 - (rect.top / viewportH);
        const stageIndex = Math.min(
            _stages.length - 1,
            Math.max(0, Math.floor(centerRatio * _stages.length * 0.6)),
        );
        activateStage(stageIndex);
    };

    _observer = new IntersectionObserver(
        (entries) => {
            const entry = entries[0];
            if (!entry) return;
            if (entry.isIntersecting) {
                if (!_scrollListener) {
                    _scrollListener = updateOnScroll;
                    window.addEventListener('scroll', _scrollListener, { passive: true });
                }
                updateOnScroll();
                return;
            }
            detachScrollListener();
        },
        { threshold: 0.2 },
    );
    _observer.observe(_nodesRow);
}

export function setPrologueTimelineLanguage(lang) {
    renderTimeline(lang);
}
