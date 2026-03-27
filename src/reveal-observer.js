// reveal-observer.js — IntersectionObserver による段階的コンテンツ出現
// cs#179 Phase A: ナレーション・ブリッジ + グリッド行スタガー

import { detectLang } from './i18n.js';

const NARRATIONS = {
    'model-section': {
        ja: 'ひとつの問いから始まりました。三十の領域が、同じ方向を指していたのです。',
        en: 'It began with one question. Thirty domains pointed in the same direction.',
    },
    'reports-section': {
        ja: 'ここから先には、三十の個室があります。どれも、違う言語で同じことを語っています。',
        en: 'Beyond here, thirty private rooms. Each speaks a different language about the same thing.',
    },
    'reports-cross-analysis-section': {
        ja: '三十の旅人が別々の道を歩きました。全員が、同じ跡を残していたのです。',
        en: 'Thirty travelers, each taking a different road. They all left the same footprints.',
    },
    'articles-section': {
        ja: '思考の途中が、記事になりました。',
        en: 'These are thoughts in the middle of becoming.',
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
        // Also check if narration was already placed outside (before parent container)
        if (section.closest('.reports-tab-content, .section-content-wrap')?.previousElementSibling?.classList.contains('room-narration')) continue;

        const wrapper = document.createElement('div');
        wrapper.className = 'room-narration';
        wrapper.setAttribute('aria-hidden', 'false');

        const p = document.createElement('p');
        p.className = 'room-narration-text';
        const raw = texts[lang] || texts.ja;
        if (lang === 'ja') {
            p.innerHTML = raw.replace(/。/g, '。<br>');
        } else {
            p.innerHTML = raw.replace(/\. /g, '.<br>');
        }

        wrapper.appendChild(p);

        // Insert narration following the pattern: narration → heading → container
        const contentWrap = section.querySelector('.section-content-wrap');
        if (contentWrap) {
            section.insertBefore(wrapper, contentWrap);
        } else {
            const parentContainer = section.closest('.reports-tab-content, .section-content-wrap');
            if (parentContainer && parentContainer.parentElement) {
                // If there's a heading before the container, insert before the heading
                const heading = parentContainer.previousElementSibling;
                if (heading && heading.classList.contains('section-heading')) {
                    parentContainer.parentElement.insertBefore(wrapper, heading);
                } else {
                    parentContainer.parentElement.insertBefore(wrapper, parentContainer);
                }
            } else {
                section.insertBefore(wrapper, section.firstChild);
            }
        }
    }
}

export function destroyRevealObserver() {
    _observer?.disconnect();
    _observer = null;
    _rowObserver?.disconnect();
    _rowObserver = null;
}
