// reveal-observer.js — IntersectionObserver による段階的コンテンツ出現
// cs#179 Phase A: ナレーション・ブリッジ + グリッド行スタガー

import { getCurrentLang, normalizeLang } from './i18n.js';
import { dict } from './i18n/dict.js';

const NARRATION_KEYS = {
    'model-section': 'modelSection',
    'reports-section': 'reportsSection',
    'reports-cross-analysis-section': 'reportsCrossAnalysisSection',
    'articles-section': 'articlesSection',
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

function getNarrationStrings(lang) {
    return dict[normalizeLang(lang)]?.page?.narrations || dict.ja.page.narrations;
}

function formatNarrationText(text, lang) {
    if (normalizeLang(lang) === 'ja') {
        return text.replace(/。/g, '。<br>');
    }
    return text.replace(/\. /g, '.<br>');
}

function ensureNarrationElement(section) {
    const existing = Array.from(section.children).find((child) => child.classList.contains('room-narration'));
    if (existing) {
        let textNode = existing.querySelector('.room-narration-text');
        if (!textNode) {
            textNode = document.createElement('p');
            textNode.className = 'room-narration-text';
            existing.appendChild(textNode);
        }
        return textNode;
    }

    const externalNarration = section.closest('.reports-tab-content, .section-content-wrap')?.previousElementSibling;
    if (externalNarration?.classList.contains('room-narration')) {
        let textNode = externalNarration.querySelector('.room-narration-text');
        if (!textNode) {
            textNode = document.createElement('p');
            textNode.className = 'room-narration-text';
            externalNarration.appendChild(textNode);
        }
        return textNode;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'room-narration';
    wrapper.setAttribute('aria-hidden', 'false');

    const textNode = document.createElement('p');
    textNode.className = 'room-narration-text';
    wrapper.appendChild(textNode);

    const contentWrap = section.querySelector('.section-content-wrap');
    if (contentWrap) {
        section.insertBefore(wrapper, contentWrap);
        return textNode;
    }

    const parentContainer = section.closest('.reports-tab-content, .section-content-wrap');
    if (parentContainer && parentContainer.parentElement) {
        const heading = parentContainer.previousElementSibling;
        if (heading && heading.classList.contains('section-heading')) {
            parentContainer.parentElement.insertBefore(wrapper, heading);
        } else {
            parentContainer.parentElement.insertBefore(wrapper, parentContainer);
        }
        return textNode;
    }

    section.insertBefore(wrapper, section.firstChild);
    return textNode;
}

/**
 * ナレーション要素を各セクションの先頭に挿入する。
 * index.html に静的に書く代わりに JS で生成し、言語切り替えに対応。
 */
export function injectNarrations(lang = getCurrentLang()) {
    const normalized = normalizeLang(lang);
    const narrationStrings = getNarrationStrings(normalized);

    for (const [sectionId, narrationKey] of Object.entries(NARRATION_KEYS)) {
        const section = document.getElementById(sectionId);
        if (!section) continue;
        const textNode = ensureNarrationElement(section);
        const raw = narrationStrings[narrationKey] || '';
        textNode.innerHTML = formatNarrationText(raw, normalized);
        if (_observer) {
            _observer.observe(textNode);
        }
    }
}

export function setNarrationLanguage(lang) {
    injectNarrations(lang);
}

export function destroyRevealObserver() {
    _observer?.disconnect();
    _observer = null;
    _rowObserver?.disconnect();
    _rowObserver = null;
}
