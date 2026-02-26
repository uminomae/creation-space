// controls.js — カメラ制御（スクロール潜水 + 手動回転/ズーム）
// モバイルファースト:
//   縦スワイプ → ページスクロール（ブラウザネイティブ: touch-action: pan-y）
//   横スワイプ → カメラ回転（手動）
//   ピンチ     → カメラズーム
// デスクトップ:
//   マウス横ドラッグ → カメラ回転
//   ホイール → ページスクロール（そのまま）

import { toggles, breathConfig, sceneParams } from './config.js';
import {
    REF_ASPECT,
    REF_HEIGHT,
    DIVE_DEPTH,
    DIVE_SCROLL_VH,
    LOOKAT_BASE_Y,
    ROTATE_SENSITIVITY,
    ZOOM_SENSITIVITY,
    MIN_ZOOM,
    MAX_ZOOM,
    INERTIA_DECAY,
    VELOCITY_THRESHOLD,
    AUTO_ROTATE_TIME_SCALE,
    CAMERA_MAX_FOV,
} from './constants.js';

let _camera;
let _canvas;

// 自動回転
let _autoRotateSpeed = 1.0;
let _autoRotateTimeOffsetSec = 0.0;
let _autoRotateLoopPhase = null;
let _baseCamY = 0;
let _baseCamX = -14;
let _baseCamZ = 34;
let _baseTargetX = 0;
let _baseTargetY = LOOKAT_BASE_Y;
let _baseTargetZ = 0;

// スクロール進捗 (0 = 水面, 1 = 完全潜水)
let _scrollProgress = 0;

// --- 手動回転 ---
let _manualAngle = 0;           // ユーザー操作による回転オフセット (rad)

// --- ズーム ---
let _zoomFactor = 1.0;          // 軌道半径の倍率

// --- タッチ状態 ---
let _lastTouchX = 0;
let _lastPinchDist = 0;
let _activeTouches = 0;

// --- マウスドラッグ状態 ---
let _isDragging = false;
let _lastMouseX = 0;

// --- 慣性 ---
let _rotateVelocity = 0;

// --- クリーンアップ関数（二重バインド防止） ---
let _cleanupControls = null;

export function initControls(camera, container, renderer) {
    // 既存リスナーをクリーンアップ（再初期化時の二重バインド防止）
    _cleanupControls?.();

    _camera = camera;
    _canvas = renderer.domElement;
    _baseCamY = sceneParams.camY;
    _baseCamX = sceneParams.camX;
    _baseCamZ = sceneParams.camZ;
    _baseTargetX = Number.isFinite(sceneParams.camTargetX) ? sceneParams.camTargetX : 0;
    _baseTargetY = Number.isFinite(sceneParams.camTargetY) ? sceneParams.camTargetY : LOOKAT_BASE_Y;
    _baseTargetZ = Number.isFinite(sceneParams.camTargetZ) ? sceneParams.camTargetZ : 0;

    // --- touch-action: pan-y ---
    // ブラウザに「縦スクロールだけ任せる、横とピンチはJSで処理する」と宣言
    _canvas.style.touchAction = 'pan-y';

    // --- タッチイベント ---
    _canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    _canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    _canvas.addEventListener('touchend', onTouchEnd, { passive: true });

    // --- マウスドラッグ（デスクトップ） ---
    _canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // --- デスクトップ: Ctrl+ホイール でズーム（通常ホイールはページスクロール） ---
    _canvas.addEventListener('wheel', onWheel, { passive: false });

    // --- クリーンアップ関数を登録 ---
    _cleanupControls = () => {
        _canvas.removeEventListener('touchstart', onTouchStart);
        _canvas.removeEventListener('touchmove', onTouchMove);
        _canvas.removeEventListener('touchend', onTouchEnd);
        _canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        _canvas.removeEventListener('wheel', onWheel);
    };
}

/**
 * 全イベントリスナーを解除。再初期化前や破棄時に呼び出す。
 */
export function destroyControls() {
    _cleanupControls?.();
    _cleanupControls = null;
    _camera = null;
    _canvas = null;
}

// =============================
// タッチハンドラ
// =============================

function onTouchStart(e) {
    _activeTouches = e.touches.length;
    _rotateVelocity = 0; // 慣性停止

    if (e.touches.length === 1) {
        _lastTouchX = e.touches[0].clientX;
    } else if (e.touches.length === 2) {
        _lastPinchDist = getPinchDistance(e.touches);
    }
}

function onTouchMove(e) {
    _activeTouches = e.touches.length;

    if (e.touches.length === 1) {
        // --- 1本指: 横スワイプ → 回転 ---
        const currentX = e.touches[0].clientX;
        const dx = currentX - _lastTouchX;
        _manualAngle -= dx * ROTATE_SENSITIVITY;
        _rotateVelocity = -dx * ROTATE_SENSITIVITY;
        _lastTouchX = currentX;
        // 縦スクロールはブラウザが touch-action: pan-y で処理するので preventDefault 不要
    } else if (e.touches.length === 2) {
        // --- 2本指: ピンチ → ズーム ---
        e.preventDefault(); // ブラウザのピンチズーム防止
        const dist = getPinchDistance(e.touches);
        if (_lastPinchDist > 0) {
            const delta = dist - _lastPinchDist;
            _zoomFactor -= delta * ZOOM_SENSITIVITY;
            _zoomFactor = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, _zoomFactor));
        }
        _lastPinchDist = dist;
    }
}

function onTouchEnd(e) {
    _activeTouches = e.touches.length;
    if (e.touches.length === 0) {
        _lastPinchDist = 0;
        // 慣性は _rotateVelocity に残り、updateControls で減衰
    }
}

function getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
}

// =============================
// マウスハンドラ（デスクトップ）
// =============================

function onMouseDown(e) {
    if (e.button !== 0) return; // 左ボタンのみ
    _isDragging = true;
    _lastMouseX = e.clientX;
    _rotateVelocity = 0;
}

function onMouseMove(e) {
    if (!_isDragging) return;
    const dx = e.clientX - _lastMouseX;
    _manualAngle -= dx * ROTATE_SENSITIVITY;
    _rotateVelocity = -dx * ROTATE_SENSITIVITY;
    _lastMouseX = e.clientX;
}

function onMouseUp() {
    _isDragging = false;
}

function onWheel(e) {
    // Ctrl+ホイール or Cmd+ホイール → ズーム（ブラウザズーム防止）
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        _zoomFactor += e.deltaY * 0.002;
        _zoomFactor = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, _zoomFactor));
    }
    // 通常ホイール → ページスクロール（デフォルト動作）
}

// =============================
// 公開API
// =============================

export function setAutoRotateSpeed(speed) {
    _autoRotateSpeed = speed;
}

export function setAutoRotateStartOffsetSec(offsetSec) {
    _autoRotateTimeOffsetSec = Number.isFinite(offsetSec) ? offsetSec : 0.0;
}

export function setAutoRotateLoopPhase(phase) {
    if (!Number.isFinite(phase)) {
        _autoRotateLoopPhase = null;
        return;
    }
    _autoRotateLoopPhase = ((phase % 1.0) + 1.0) % 1.0;
}

export function setCameraPosition(x, y, z) {
    _baseCamX = x;
    _baseCamY = y;
    _baseCamZ = z;
}

export function setCameraTarget(x, y, z) {
    _baseTargetX = x;
    _baseTargetY = y;
    _baseTargetZ = z;
}

// REMOVED: setTarget() — スクロール潜水モードでは未使用（lookAtはupdateControls内で計算）

export function getScrollProgress() {
    return _scrollProgress;
}

/**
 * アスペクト比 + 画面高さに応じたFOV補正
 */
function getAdjustedFovBase() {
    const base = breathConfig.fovBase;
    const aspect = _camera.aspect;
    const height = window.innerHeight;

    let adjusted = base;

    if (aspect < 1) {
        const baseRad = base * Math.PI / 180;
        const hFov = 2 * Math.atan(Math.tan(baseRad / 2) * REF_ASPECT);
        adjusted = 2 * Math.atan(Math.tan(hFov / 2) / aspect) * 180 / Math.PI;
    } else if (height < REF_HEIGHT) {
        const heightRatio = height / REF_HEIGHT;
        const boost = 1.0 + (1.0 - heightRatio) * 0.35;
        adjusted = base * boost;
    }

    return Math.min(adjusted, CAMERA_MAX_FOV);
}

export function updateControls(time, breathVal = 0.5) {
    if (!_camera) return;

    // --- 慣性回転（ドラッグ終了後の減衰） ---
    if (!_isDragging && _activeTouches === 0 && Math.abs(_rotateVelocity) > VELOCITY_THRESHOLD) {
        _manualAngle += _rotateVelocity;
        _rotateVelocity *= INERTIA_DECAY;
    }

    // --- スクロール進捗 ---
    const diveScrollPx = window.innerHeight * DIVE_SCROLL_VH;
    _scrollProgress = Math.min(1, window.scrollY / diveScrollPx);

    // --- easeInOut for smooth dive ---
    const eased = _scrollProgress < 0.5
        ? 2 * _scrollProgress * _scrollProgress
        : 1 - Math.pow(-2 * _scrollProgress + 2, 2) / 2;

    // --- FOV呼吸 ---
    const fovBase = getAdjustedFovBase();
    let nextFov = fovBase;
    if (toggles.fovBreath) {
        nextFov += (breathVal * 2 - 1) * breathConfig.fovAmplitude;
    }
    const pulseAmp = Math.max(0, breathConfig.fovPulseAmplitude || 0);
    if (pulseAmp > 0) {
        const pulseSpeed = Math.max(0.05, breathConfig.fovPulseSpeed || 0.28);
        const pulseSharpness = Math.max(1.0, breathConfig.fovPulseSharpness || 8.0);
        const pulseCarrier = Math.max(0, Math.sin(time * pulseSpeed));
        const pulse = Math.pow(pulseCarrier, pulseSharpness);
        nextFov -= pulseAmp * pulse;
    }
    _camera.fov = Math.max(10, Math.min(CAMERA_MAX_FOV, nextFov));
    _camera.updateProjectionMatrix();

    // --- 軌道計算 ---
    const baseRadius = Math.sqrt(_baseCamX * _baseCamX + _baseCamZ * _baseCamZ);
    const radius = baseRadius * _zoomFactor;
    let angle = Math.atan2(_baseCamX, _baseCamZ);

    // 自動回転
    if (toggles.autoRotate) {
        if (Number.isFinite(_autoRotateLoopPhase)) {
            angle += _autoRotateLoopPhase * Math.PI * 2.0 * _autoRotateSpeed;
        } else {
            const autoTime = time + _autoRotateTimeOffsetSec;
            angle += autoTime * _autoRotateSpeed * AUTO_ROTATE_TIME_SCALE;
        }
    }

    // 手動回転を加算
    angle += _manualAngle;

    const rotX = radius * Math.sin(angle);
    const rotZ = radius * Math.cos(angle);

    // --- スクロールでカメラY下降 ---
    const diveY = _baseCamY - eased * DIVE_DEPTH;

    _camera.position.set(rotX, diveY, rotZ);
    _camera.lookAt(_baseTargetX, _baseTargetY - eased * DIVE_DEPTH * 0.5, _baseTargetZ);
}
