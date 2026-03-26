// prologue-timeline.js — 5段階モデルのタイムライン表示 (cs#179 Phase B)

import { detectLang, normalizeLang } from './i18n.js';
import { dict } from './i18n/dict.js';

const STAGE_COLORS = [
    'rgba(100, 150, 255, 0.9)',   // 場 — blue
    'rgba(120, 200, 170, 0.9)',   // 波 — teal
    'rgba(220, 180, 100, 0.9)',   // 縁 — amber
    'rgba(200, 120, 100, 0.9)',   // 渦 — coral
    'rgba(170, 140, 220, 0.9)',   // 束 — purple
];

let _observer = null;

export function initPrologueTimeline() {
    const section = document.getElementById('model-section');
    if (!section) return;
    if (section.querySelector('.prologue-timeline')) return;

    const lang = normalizeLang(detectLang());
    const stages = dict[lang]?.reports?.stages || dict.ja.reports.stages;

    const contentWrap = section.querySelector('.section-content-wrap');
    if (!contentWrap) return;

    // タイムラインコンテナ
    const timeline = document.createElement('div');
    timeline.className = 'prologue-timeline';
    timeline.setAttribute('role', 'list');
    timeline.setAttribute('aria-label', lang === 'ja' ? '創造の5段階' : 'Five Stages of Creation');

    // ノード行
    const nodesRow = document.createElement('div');
    nodesRow.className = 'prologue-nodes';

    // 説明エリア
    const descArea = document.createElement('div');
    descArea.className = 'prologue-desc';
    descArea.setAttribute('aria-live', 'polite');

    stages.forEach((stage, i) => {
        const node = document.createElement('div');
        node.className = 'prologue-node';
        node.setAttribute('role', 'listitem');
        node.setAttribute('tabindex', '0');
        node.dataset.stageIndex = String(i);
        node.style.setProperty('--stage-color', STAGE_COLORS[i]);

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

        node.addEventListener('click', () => activateStage(i, stages, descArea));
        node.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateStage(i, stages, descArea);
            }
        });
        node.addEventListener('focus', () => activateStage(i, stages, descArea));

        nodesRow.appendChild(node);
    });

    // 進行線
    const progressLine = document.createElement('div');
    progressLine.className = 'prologue-progress-line';
    nodesRow.appendChild(progressLine);

    timeline.appendChild(nodesRow);
    timeline.appendChild(descArea);

    // feature cards の前に挿入
    const container = contentWrap.querySelector('.container');
    const featureCards = document.getElementById('reports-feature-cards');
    if (container && featureCards) {
        container.insertBefore(timeline, featureCards.closest('.reports-tab-content') || featureCards);
    } else if (container) {
        container.appendChild(timeline);
    }

    // 初期状態: 最初のステージをアクティブに
    activateStage(0, stages, descArea);

    // スクロール連動
    initScrollObserver(nodesRow, stages, descArea);
}

function activateStage(index, stages, descArea) {
    const nodes = document.querySelectorAll('.prologue-node');
    nodes.forEach((n, i) => {
        n.classList.toggle('is-active', i === index);
    });

    // 進行線の更新
    const line = document.querySelector('.prologue-progress-line');
    if (line) {
        const progress = ((index + 1) / stages.length) * 100;
        line.style.setProperty('--progress', `${progress}%`);
    }

    // 説明テキスト更新
    const stage = stages[index];
    if (descArea && stage) {
        descArea.innerHTML = '';
        const title = document.createElement('span');
        title.className = 'prologue-desc-title';
        title.textContent = `${stage.label}（${stage.sub}）`;
        title.style.color = STAGE_COLORS[index];

        const text = document.createElement('span');
        text.className = 'prologue-desc-text';
        text.textContent = stage.desc;

        descArea.appendChild(title);
        descArea.appendChild(text);
    }
}

function initScrollObserver(nodesRow, stages, descArea) {
    if (_observer) _observer.disconnect();

    // タイムライン全体がビューポートにいるときにスクロール位置で段階を切り替え
    _observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    // ビューポート内での位置から段階を算出
                    const updateOnScroll = () => {
                        const rect = nodesRow.getBoundingClientRect();
                        const viewportH = window.innerHeight;
                        // ノード行がビューポートの中央付近にいるとき
                        const centerRatio = 1 - (rect.top / viewportH);
                        const stageIndex = Math.min(
                            stages.length - 1,
                            Math.max(0, Math.floor(centerRatio * stages.length * 0.6)),
                        );
                        activateStage(stageIndex, stages, descArea);
                    };
                    window.addEventListener('scroll', updateOnScroll, { passive: true });

                    // cleanup when leaving
                    const leaveObserver = new IntersectionObserver(
                        (es) => {
                            if (!es[0].isIntersecting) {
                                window.removeEventListener('scroll', updateOnScroll);
                                leaveObserver.disconnect();
                            }
                        },
                        { threshold: 0 },
                    );
                    leaveObserver.observe(nodesRow);
                }
            }
        },
        { threshold: 0.2 },
    );
    _observer.observe(nodesRow);
}
