export function attachResize({ camera, renderer, getComposer }) {
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        const composer = typeof getComposer === 'function' ? getComposer() : null;
        if (composer) {
            composer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    window.addEventListener('resize', onResize);
}
