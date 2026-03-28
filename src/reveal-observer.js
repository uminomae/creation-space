// reveal-observer.js — IntersectionObserver によるグリッド行スタガー表示

const ROW_STAGGER_MS = 120;
const GRID_COLS_DESKTOP = 5;

let _rowObserver = null;

export function initRevealObserver() {
    if (_rowObserver) return;

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

export function destroyRevealObserver() {
    _rowObserver?.disconnect();
    _rowObserver = null;
}
