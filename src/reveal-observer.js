// reveal-observer.js — IntersectionObserver による段階的コンテンツ出現
// cs#179 Phase A: ナレーション・ブリッジ + グリッド行スタガー

import { detectLang } from './i18n.js';

const NARRATIONS = {
    'model-section': {
        ja: '30の学術領域を横断して、ひとつの構造が浮かび上がった。',
        en: 'Across 30 academic domains, a single structure emerged.',
    },
    'reports-section': {
        ja: '神経科学から芸術学まで。30の領域を、ひとつずつ訪ねた。',
        en: 'From neuroscience to art studies. We visited 30 domains, one by one.',
    },
    'reports-cross-analysis-section': {
        ja: '30の探索を重ねると、領域を超えた構造テーマが見えてきた。',
        en: 'Layer the 30 explorations, and structural themes emerge across domains.',
    },
    'articles-section': {
        ja: '探索はまだ続いている。',
        en: 'The exploration continues.',
    },
};

const ROW_STAGGER_MS = 120;
const GRID_COLS_DESKTOP = 5;

let _observer = null;
let _rowObserver = null;

export function initRevealObserver() {
    if (_observer) return;

    const narrations = document.querySelectorAll('.room-narration-text');
    _observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    _observer.unobserve(entry.target);
                }
            }
        },
        { threshold: 0.4 },
    );
    narrations.forEach((el) => _observer.observe(el));

    initRowReveal();
}

function initRowReveal() {
    _rowObserver = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    _rowObserver.unobserve(entry.target);
                }
            }
        },
        { threshold: 0.15 },
    );

    observeGridItems();
}

/**
 * グリッドアイテムに行番号ベースの遅延を付与して observe する。
 * renderDomainGrid() の再描画後にも呼び出せるよう export する。
 */
export function observeGridItems() {
    if (!_rowObserver) return;

    const grid = document.getElementById('reports-domain-grid');
    if (!grid) return;

    const items = grid.querySelectorAll('.col');
    items.forEach((col, index) => {
        if (col.classList.contains('is-revealed')) return;
        const rowIndex = Math.floor(index / GRID_COLS_DESKTOP);
        col.style.transitionDelay = `${rowIndex * ROW_STAGGER_MS}ms`;
        col.dataset.revealRow = String(rowIndex);
        _rowObserver.observe(col);
    });
}

/**
 * ナレーション要素を各セクションの先頭に挿入する。
 * index.html に静的に書く代わりに JS で生成し、言語切り替えに対応。
 */
export function injectNarrations() {
    const lang = detectLang();

    for (const [sectionId, texts] of Object.entries(NARRATIONS)) {
        const section = document.getElementById(sectionId);
        if (!section) continue;
        if (section.querySelector('.room-narration')) continue;

        const wrapper = document.createElement('div');
        wrapper.className = 'room-narration';
        wrapper.setAttribute('aria-hidden', 'false');

        const p = document.createElement('p');
        p.className = 'room-narration-text';
        p.textContent = texts[lang] || texts.ja;

        wrapper.appendChild(p);

        const contentWrap = section.querySelector('.section-content-wrap');
        if (contentWrap) {
            contentWrap.insertBefore(wrapper, contentWrap.firstChild);
        } else {
            section.insertBefore(wrapper, section.firstChild);
        }
    }
}

export function destroyRevealObserver() {
    _observer?.disconnect();
    _observer = null;
    _rowObserver?.disconnect();
    _rowObserver = null;
}
