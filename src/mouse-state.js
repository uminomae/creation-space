// mouse-state.js — マウス/タッチ座標の一元管理
// T-010: main.js と nav-objects.js で二重リスンしていた座標を統合

let _mouseX = 0.5;
let _mouseY = 0.5;
let _smoothX = 0.5;
let _smoothY = 0.5;
let _prevX = 0.5;
let _prevY = 0.5;

let _cleanup = null;

/**
 * マウス/タッチイベントを登録。
 * 再呼び出し時は既存リスナーを自動クリーンアップ。
 */
export function initMouseTracking() {
    _cleanup?.();

    const onMouseMove = (e) => {
        _mouseX = e.clientX / window.innerWidth;
        _mouseY = 1.0 - (e.clientY / window.innerHeight);
    };
    const onTouchMove = (e) => {
        if (e.touches.length > 0) {
            _mouseX = e.touches[0].clientX / window.innerWidth;
            _mouseY = 1.0 - (e.touches[0].clientY / window.innerHeight);
        }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);

    _cleanup = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
    };
}

/**
 * 全リスナーを解除。
 */
export function destroyMouseTracking() {
    _cleanup?.();
    _cleanup = null;
}

/**
 * 毎フレーム呼び出し: スムージング更新 + velocity計算。
 * @returns {{ x, y, smoothX, smoothY, velX, velY }}
 */
export function updateMouseSmoothing() {
    _smoothX += (_mouseX - _smoothX) * 0.08;
    _smoothY += (_mouseY - _smoothY) * 0.08;
    const velX = _smoothX - _prevX;
    const velY = _smoothY - _prevY;
    _prevX = _smoothX;
    _prevY = _smoothY;
    return { x: _mouseX, y: _mouseY, smoothX: _smoothX, smoothY: _smoothY, velX, velY };
}

/**
 * 生の正規化座標を取得（nav-objects.jsのラベルぼかし等）。
 * @returns {{ x: number, y: number }}
 */
export function getRawMouse() {
    return { x: _mouseX, y: _mouseY };
}
