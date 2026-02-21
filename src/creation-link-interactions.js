import * as THREE from 'three';

const CLICK_MOVE_THRESHOLD_PX = 8;

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();

function setPointerFromEvent(event, domElement) {
    const rect = domElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    return true;
}

function resolveCreationLinkTarget(object) {
    let cursor = object;
    while (cursor) {
        if (cursor.userData?.isCreationLinkTarget) return cursor;
        cursor = cursor.parent;
    }
    return null;
}

export function initCreationLinkInteractions({ camera, domElement, getTargets }) {
    if (!camera || !domElement || typeof getTargets !== 'function') {
        return () => {};
    }

    let hoveredTarget = null;
    let downX = 0;
    let downY = 0;

    function updateHover(nextTarget) {
        if (hoveredTarget === nextTarget) return;
        if (hoveredTarget) hoveredTarget.userData.isHovered = false;
        hoveredTarget = nextTarget;
        if (hoveredTarget) hoveredTarget.userData.isHovered = true;
        domElement.style.cursor = hoveredTarget ? 'pointer' : '';
    }

    function pickTarget(event) {
        if (!setPointerFromEvent(event, domElement)) return null;
        const targets = getTargets();
        if (!Array.isArray(targets) || targets.length === 0) return null;

        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects(targets, true);
        if (!hits.length) return null;

        return resolveCreationLinkTarget(hits[0].object);
    }

    function onPointerMove(event) {
        if (event.pointerType === 'touch') return;
        updateHover(pickTarget(event));
    }

    function onPointerDown(event) {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        downX = event.clientX;
        downY = event.clientY;
    }

    function onPointerUp(event) {
        if (event.pointerType === 'mouse' && event.button !== 0) return;

        const dx = event.clientX - downX;
        const dy = event.clientY - downY;
        const moved = Math.hypot(dx, dy);
        if (moved > CLICK_MOVE_THRESHOLD_PX) return;

        const target = pickTarget(event);
        if (!target?.userData?.draftUrl) return;

        import('./viewer.js').then(({ openDraftViewer }) => {
            openDraftViewer(target.userData.draftUrl, target.userData.label, target.userData.sourceUrl);
        }).catch((error) => {
            console.warn('[creation-link] viewer import failed:', error);
        });
    }

    function onPointerLeave() {
        updateHover(null);
    }

    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('pointerleave', onPointerLeave);
    domElement.addEventListener('pointercancel', onPointerLeave);

    return () => {
        updateHover(null);
        domElement.removeEventListener('pointermove', onPointerMove);
        domElement.removeEventListener('pointerdown', onPointerDown);
        domElement.removeEventListener('pointerup', onPointerUp);
        domElement.removeEventListener('pointerleave', onPointerLeave);
        domElement.removeEventListener('pointercancel', onPointerLeave);
    };
}
