// constants.js — カメラ/アニメーション共通定数

// --- camera setup ---
export const CAMERA_FOV = 60;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 1000;
export const CAMERA_LOOK_AT_Z = -10;
export const CAMERA_MAX_FOV = 120;

// --- camera control tuning ---
export const REF_ASPECT = 16 / 9;
export const REF_HEIGHT = 900;
export const DIVE_DEPTH = 30;
export const DIVE_SCROLL_VH = 1.5;
export const LOOKAT_BASE_Y = -1;

export const ROTATE_SENSITIVITY = 0.006;
export const ZOOM_SENSITIVITY = 0.008;
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2.5;

export const INERTIA_DECAY = 0.92;
export const VELOCITY_THRESHOLD = 0.0001;
export const AUTO_ROTATE_TIME_SCALE = 0.05;
