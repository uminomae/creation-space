/**
 * hover-grid.js — 30-domain hover-expand grid (techo#53)
 *
 * MVP scope: A1 overscroll-contain, A2 overflow management,
 * B1 touch-tap expand, B2 outside-tap close.
 */

const COLS = 5;
const ROWS = 6;
const EXPANDED_RATIO = 4;
const COLLAPSED_RATIO = 0.5;
const TOUCH_MOVE_THRESHOLD = 10; // px — beyond this a touch is a drag, not a tap

/**
 * Initialise hover-grid interaction on a container that already has
 * `.hover-grid-cell` children rendered by renderHoverGrid().
 *
 * @param {HTMLElement} container  The `.hover-grid-container` element
 * @param {object}      opts
 * @param {function}    opts.onExpand  Called with (cellEl, index) when a cell expands
 */
export function initHoverGrid(container, { onExpand } = {}) {
    if (!container) return;

    let expandedIndex = null;
    const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // --- grid CSS-variable helpers ---

    function expandCell(idx) {
        if (expandedIndex === idx) return;
        expandedIndex = idx;

        const row = Math.floor(idx / COLS);
        const col = idx % COLS;

        for (let c = 0; c < COLS; c++) {
            container.style.setProperty(`--col-${c}`, `${c === col ? EXPANDED_RATIO : COLLAPSED_RATIO}fr`);
        }
        for (let r = 0; r < ROWS; r++) {
            container.style.setProperty(`--row-${r}`, `${r === row ? EXPANDED_RATIO : COLLAPSED_RATIO}fr`);
        }

        const cells = container.querySelectorAll('.hover-grid-cell');
        cells.forEach((cell, i) => {
            if (i === idx) {
                cell.classList.remove('collapsed');
                cell.classList.add('expanded');
            } else {
                cell.classList.remove('expanded');
                cell.classList.add('collapsed');
            }
        });

        if (typeof onExpand === 'function') {
            const expandedCell = cells[idx];
            if (expandedCell) onExpand(expandedCell, idx);
        }
    }

    function resetGrid() {
        expandedIndex = null;

        for (let c = 0; c < COLS; c++) {
            container.style.setProperty(`--col-${c}`, '1fr');
        }
        for (let r = 0; r < ROWS; r++) {
            container.style.setProperty(`--row-${r}`, '1fr');
        }

        container.querySelectorAll('.hover-grid-cell').forEach((cell) => {
            cell.classList.remove('expanded');
            cell.classList.add('collapsed');
        });
    }

    // --- Desktop: mouseenter / mouseleave ---

    function onMouseEnter(event) {
        if (isTouchDevice()) return;
        const cell = event.currentTarget;
        const idx = Number(cell.dataset.index);
        if (!Number.isNaN(idx)) expandCell(idx);
    }

    container.querySelectorAll('.hover-grid-cell').forEach((cell) => {
        cell.addEventListener('mouseenter', onMouseEnter);
    });
    container.addEventListener('mouseleave', () => {
        if (!isTouchDevice()) resetGrid();
    });

    // --- Touch: tap to toggle (B1) with 10 px threshold ---

    let touchStartX = 0;
    let touchStartY = 0;

    container.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        if (touch) {
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        }
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        if (!touch) return;

        const dx = Math.abs(touch.clientX - touchStartX);
        const dy = Math.abs(touch.clientY - touchStartY);
        if (dx > TOUCH_MOVE_THRESHOLD || dy > TOUCH_MOVE_THRESHOLD) return; // drag, not tap

        const cell = e.target.closest('.hover-grid-cell');
        if (!cell) return;

        const idx = Number(cell.dataset.index);
        if (Number.isNaN(idx)) return;

        e.preventDefault(); // suppress synthetic mouse events

        if (expandedIndex === idx) {
            resetGrid();
        } else {
            expandCell(idx);
        }
    });

    // --- Outside-tap close (B2) ---

    document.addEventListener('click', (e) => {
        if (expandedIndex === null) return;
        if (container.contains(e.target)) return;
        resetGrid();
    });

    document.addEventListener('touchend', (e) => {
        if (expandedIndex === null) return;
        if (container.contains(e.target)) return;
        resetGrid();
    }, { passive: true });

    // Initialise to collapsed state
    resetGrid();
}
