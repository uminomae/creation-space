export function initMobileNavAutoCollapse() {
    const nav = document.getElementById('kessonTopbarNav');
    if (!nav) return;

    nav.querySelectorAll('.nav-link, [data-bs-toggle="offcanvas"]').forEach((el) => {
        el.addEventListener('click', () => {
            if (window.innerWidth >= 768) return;
            const collapseApi = window.bootstrap?.Collapse;
            if (!collapseApi) return;
            const collapse = collapseApi.getOrCreateInstance(nav, { toggle: false });
            collapse.hide();
        });
    });
}
