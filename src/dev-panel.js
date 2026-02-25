import {
    backgroundParams,
    breathConfig,
    creationLinkParams,
    distortionParams,
    fieldParams,
    flowParams,
    intentConsciousnessParams,
    intentMotionParams,
    quantumWaveParams,
    sceneParams,
    plasmaParams,
    toggles,
} from './config.js';
import { applyConfigState, cloneConfigState } from './config-state.js';

const GROUP_HELP_JA = {
    toggles: '表示や機能のON/OFFを切り替えます。',
    scene: 'カメラ位置や霧の濃さなど、シーン全体を調整します。',
    intentCamera: '意グラフィックのカメラ位置と注視点を調整します。',
    intentMotion: '意グラフィックの時間軸。開始タイミング・回転速度・速度倍率を調整します。',
    intentLoop: '意グラフィックの2段階ループ設定。探索位置を固定してシームレスに循環させます。',
    intentConsciousness: '意グラフィック本体の密度・速度・収束感を調整します。',
    field: '場のレイヤー表現の強度と線の出方を調整します。',
    flow: '流体オブジェクトの密度感・まとまり・揺らぎを調整します。',
    background: '背景グラデーションの色と脈動を調整します。',
    quantum: '量子波による屈折・発光・霧表現を調整します。',
    post: '被写界深度やポスト効果の強さを調整します。',
    breath: '呼吸演出によるFOVやUIの変化量を調整します。',
    creationGlobal: 'A案の全体挙動。渦の速度・球内の密度・色分割・明るさ・流動感をまとめて調整します。',
    creationLink1: 'オブジェクト1の個別設定。位置・サイズ・色・クリック判定半径を調整します。',
    creationLink2: 'オブジェクト2の個別設定。位置・サイズ・色・クリック判定半径を調整します。',
    creationLink3: 'オブジェクト3の個別設定。位置・サイズ・色・クリック判定半径を調整します。',
    plasma: '中心の乱数（虫の群れ）の設定。カオス度や回転速度・空間サイズを調整します。',
};

const PLASMA_HELP_JA = {
    opacity: '不透明度です。',
    chaos: 'カオス度（暴れ具合・揺らぎ）です。大きくすると激しく散らばります。',
    speed: '回転・飛び交う速度です。',
    radius: '群れの全体的な空間サイズ（半径基準）です。',
    heightRatio: '縦方向の潰れ具合です。',
    autoChaosAmp: '秩序/拡散の自動呼吸に使うカオス増幅量です。',
    wSeparation: '四元数のW軸分離量です。陰陽の帯の分かれ方を調整します。',
    projectionScale: 'ステレオ投影の基準スケールです。全体の広がり方を調整します。',
    colorA: '色Aです。',
    colorB: '色Bです。',
};

const CREATION_GLOBAL_HELP_JA = {
    pulseSpeed: '呼吸（上下移動・拡縮）の速さ。上げるとせわしなく動きます。',
    vortexSpeed: '球内部の渦回転速度。上げると内部フローが速くなります。',
    swirlStrength: '渦のねじれ量。上げると巻き感が強くなります。',
    sphereFill: '粒子が占める球の体積感。上げると外側まで満ちます。',
    colorSplitSoftness: '二色境界のぼかし幅。下げると境界がくっきりします。',
    particleBrightness: '粒子の発光明度。下げると全体が暗く落ち着きます。',
    particleSoftness: '粒子エッジの柔らかさ。上げるとクッキリ感が減ります。',
    fluidDrift: '液体風の流れ揺らぎ。上げると流動感が増します。',
    pointerBurstStrength: 'ポインタ/カメラ接近時の拡散強度。上げるほど画面へ広がります。',
    pointerBurstSpread: 'ポインタ時の拡散距離。上げるとより遠くへ飛びます。',
    colorContrast: '二色のメリハリ。上げると色差が強くなります。',
    floatAmp: 'オブジェクト全体の上下振幅です。',
    floatOffset: '上下運動の基準位置オフセットです。',
    yawSpeed: 'オブジェクト全体のY回転速度です。',
    tiltSpeed: '傾き揺れの速度です。',
    tiltAmp: '傾き揺れの角度量です。',
    baseScaleMul: 'オブジェクト全体の基準サイズ倍率です。',
    pulseScaleAmp: '呼吸によるサイズ変化幅です。',
    hoverScaleBoost: 'ホバー時の追加拡大量です。',
    hoverLerp: 'ホバー追従速度。上げると即反応、下げると粘ります。',
    pointAlpha: '粒子そのものの透明度です。',
    haloScalePulse: 'ハローの呼吸スケール増分です。',
    haloScaleHover: 'ホバー時ハロー拡大量です。',
    haloOpacityBase: 'ハロー基本不透明度です。',
    haloOpacityPulse: '呼吸で増えるハロー不透明度です。',
    haloOpacityHover: 'ホバー時に増えるハロー不透明度です。',
};

const CREATION_LINK_HELP_JA = {
    link1PosX: '3D配置のX座標です。',
    link1PosY: '3D配置のY座標です。',
    link1PosZ: '3D配置のZ座標です。',
    link1Scale: '球内部渦のサイズです。',
    link1GlowScale: 'ハローの基準サイズです。',
    link1HitRadius: 'クリック判定の半径です（見た目とは別）。',
    link1Phase: '位相オフセット。動きのズレを作ります。',
    link1ColorAR: '二色A側カラーのR成分です。',
    link1ColorAG: '二色A側カラーのG成分です。',
    link1ColorAB: '二色A側カラーのB成分です。',
    link1ColorBR: '二色B側カラーのR成分です。',
    link1ColorBG: '二色B側カラーのG成分です。',
    link1ColorBB: '二色B側カラーのB成分です。',
};

const INTENT_CAMERA_HELP_JA = {
    camX: 'カメラのX位置です。',
    camY: 'カメラのY位置です。',
    camZ: 'カメラのZ位置です。',
    camTargetY: '注視点のY座標です。',
};

const INTENT_MOTION_HELP_JA = {
    cameraRotateSpeed: '自動回転速度です。0で停止、1が基準速度です。',
    startTimingMin: '開始時間ポイント（分）です。ループ周期上の開始位置を決めます。',
    loopPeriodSec: '1周の秒数です。大きいほどゆっくり変化します。',
    timeScale: '全体の時間進行倍率です。',
    loopAnchorSec: 'シームレスループ時の基準時刻（秒）です。探索で見つけた位置を固定します。',
    loopDriftSec: '基準時刻の周囲を往復する幅（秒）です。大きいほど変化幅が広がります。',
};

const INTENT_LOOP_HELP_JA = {
    seamlessLoop: 'ONでシームレス循環モード。OFFで探索モード（raw時間）です。',
};

const INTENT_CONSCIOUSNESS_HELP_JA = {
    maxStepsMobile: 'モバイル時のレイマーチ最大ステップ数です。',
    maxStepsDesktop: 'デスクトップ時のレイマーチ最大ステップ数です。',
    renderPixelRatioCap: '描画ピクセル比の上限です。下げるほどGPU負荷が下がります。',
    renderScale: '内部描画スケールです。下げるほど負荷が下がります。',
    far: '描画の奥行き距離です。',
    detail: '細部の密度です。高いほど細かくなります。',
    overlayDistance: 'カメラ前方に置く面の距離です。',
    coverageScale: '画面を覆うスケール倍率です。',
    csFlowSpeed: '意識流の進行速度です。',
    csFreqLow: '低周波の空間周波数です。',
    csFreqHigh: '高周波の空間周波数です。',
    csThicknessLow: '膜の最小厚みです。',
    csThicknessHigh: '膜の最大厚みです。',
    csEnvelopeRadius: '密度が集まる半径です。',
    csDensityGain: '発光密度ゲインです。',
    csStepNear: '近距離ステップ長です。',
    csStepFar: '遠距離ステップ長です。',
    csLightBoost: '全体の光量ブーストです。',
    csExposure: '露光量です。',
    csVignette: '周辺減光の強さです。',
};

function getFieldHelpText(groupId, key) {
    if (groupId === 'intentCamera') {
        return INTENT_CAMERA_HELP_JA[key] || '';
    }
    if (groupId === 'intentMotion') {
        return INTENT_MOTION_HELP_JA[key] || '';
    }
    if (groupId === 'intentLoop') {
        return INTENT_LOOP_HELP_JA[key] || '';
    }
    if (groupId === 'intentConsciousness') {
        return INTENT_CONSCIOUSNESS_HELP_JA[key] || '';
    }
    if (groupId === 'creationGlobal') {
        return CREATION_GLOBAL_HELP_JA[key] || '';
    }
    if (groupId === 'creationLink1' || groupId === 'creationLink2' || groupId === 'creationLink3') {
        const normalizedKey = key.replace(/^link[123]/, 'link1');
        return CREATION_LINK_HELP_JA[normalizedKey] || '';
    }
    if (groupId === 'plasma') {
        return PLASMA_HELP_JA[key] || '';
    }
    return '';
}

const PARAM_GROUPS = [
    {
        id: 'toggles',
        title: 'Display',
        type: 'toggle',
        target: toggles,
        fields: [
            ['background', 'Background'],
            ['field', 'Field Layer'],
            ['flowObjects', 'Flow Objects'],
            ['fog', 'Fog'],
            ['quantumWave', 'Quantum Wave'],
            ['dof', 'DOF'],
            ['postProcess', 'Post Process'],
            ['autoRotate', 'Auto Rotate'],
            ['fovBreath', 'FOV Breath'],
            ['htmlBreath', 'HTML Breath'],
            ['showPlasma', 'Plasma'],
        ],
    },
    {
        id: 'scene',
        title: 'Scene',
        type: 'range',
        target: sceneParams,
        fields: [
            ['fogDensity', 'Fog Density', 0.0, 0.08, 0.001],
            ['camX', 'Cam X', -40, 40, 0.1],
            ['camY', 'Cam Y', -30, 30, 0.1],
            ['camZ', 'Cam Z', 8, 80, 0.1],
            ['mixCycle', 'Mix Cycle', 2.0, 30.0, 0.1],
        ],
    },
    {
        id: 'intentCamera',
        title: 'Intent Camera',
        type: 'range',
        target: sceneParams,
        fields: [
            ['camX', 'Cam X', -60.0, 60.0, 0.1],
            ['camY', 'Cam Y', -40.0, 40.0, 0.1],
            ['camZ', 'Cam Z', 4.0, 120.0, 0.1],
            ['camTargetY', 'Cam Target Y', -40.0, 40.0, 0.1],
        ],
    },
    {
        id: 'intentMotion',
        title: 'Intent Motion',
        type: 'range',
        target: intentMotionParams,
        fields: [
            ['cameraRotateSpeed', 'Camera Rotate Speed', 0.0, 4.0, 0.01],
            ['startTimingMin', 'Start Timing Min', -120.0, 1440.0, 0.1],
            ['loopPeriodSec', 'Loop Period Sec', 1.0, 3600.0, 0.1],
            ['timeScale', 'Time Scale', 0.0, 4.0, 0.01],
            ['loopAnchorSec', 'Loop Anchor Sec', -36000.0, 36000.0, 0.1],
            ['loopDriftSec', 'Loop Drift Sec', 0.0, 7200.0, 0.1],
        ],
    },
    {
        id: 'intentLoop',
        title: 'Intent Loop',
        type: 'toggle',
        target: intentMotionParams,
        fields: [
            ['seamlessLoop', 'Seamless Loop'],
        ],
    },
    {
        id: 'intentConsciousness',
        title: 'Intent Consciousness',
        type: 'range',
        target: intentConsciousnessParams,
        fields: [
            ['maxStepsMobile', 'Max Steps Mobile', 8.0, 64.0, 1.0],
            ['maxStepsDesktop', 'Max Steps Desktop', 8.0, 64.0, 1.0],
            ['renderPixelRatioCap', 'Render PixelRatio Cap', 0.75, 2.0, 0.01],
            ['renderScale', 'Render Scale', 0.5, 1.0, 0.01],
            ['far', 'Render Far', 2.0, 40.0, 0.1],
            ['detail', 'Detail', 0.0005, 0.02, 0.0001],
            ['overlayDistance', 'Overlay Distance', 0.5, 20.0, 0.1],
            ['coverageScale', 'Coverage Scale', 0.5, 2.0, 0.01],
            ['csFlowSpeed', 'Flow Speed', -2.0, 2.0, 0.01],
            ['csFreqLow', 'Freq Low', 0.2, 6.0, 0.01],
            ['csFreqHigh', 'Freq High', 0.2, 6.0, 0.01],
            ['csThicknessLow', 'Thickness Low', 0.01, 0.4, 0.001],
            ['csThicknessHigh', 'Thickness High', 0.01, 0.6, 0.001],
            ['csEnvelopeRadius', 'Envelope Radius', 0.2, 5.0, 0.01],
            ['csDensityGain', 'Density Gain', 0.01, 1.0, 0.01],
            ['csStepNear', 'Step Near', 0.01, 0.2, 0.001],
            ['csStepFar', 'Step Far', 0.02, 0.5, 0.001],
            ['csLightBoost', 'Light Boost', 0.2, 4.0, 0.01],
            ['csExposure', 'Exposure', 0.2, 5.0, 0.01],
            ['csVignette', 'Vignette', 0.0, 1.0, 0.001],
        ],
    },
    {
        id: 'field',
        title: 'Field',
        type: 'range',
        target: fieldParams,
        fields: [
            ['intensity', 'Field Intensity', 0.0, 3.0, 0.01],
            ['alpha', 'Field Alpha', 0.0, 1.0, 0.005],
            ['lineLow', 'Line Low', 0.05, 1.2, 0.005],
            ['lineHigh', 'Line High', 0.1, 1.4, 0.005],
            ['bottomClip', 'Bottom Clip', 0.0, 0.8, 0.005],
            ['bottomFeather', 'Bottom Feather', 0.01, 0.6, 0.005],
        ],
    },
    {
        id: 'flow',
        title: 'Flow',
        type: 'range',
        target: flowParams,
        fields: [
            ['seedOpacity', 'Seed Opacity', 0.0, 1.0, 0.01],
            ['filamentOpacity', 'Filament Opacity', 0.0, 1.0, 0.01],
            ['seedDrift', 'Seed Drift', 0.1, 2.5, 0.01],
            ['chaos', 'Chaos', 0.1, 2.5, 0.01],
            ['bundleTightness', 'Bundle Tightness', 0.1, 1.5, 0.01],
            ['centerBandRatio', 'Center Band', 0.2, 0.8, 0.005],
            ['centerThickness', 'Center Thick', 0.0, 1.0, 0.01],
            ['speed', 'Speed', 0.0, 5.0, 0.01],
        ],
    },
    {
        id: 'plasma',
        title: 'Plasma',
        type: 'range',
        target: plasmaParams,
        fields: [
            ['coreOpacity', 'Core Opacity', 0.0, 1.0, 0.01],
            ['chaosOpacity', 'Chaos Opacity', 0.0, 1.0, 0.01],
            ['chaos', 'Chaos', 0.0, 50.0, 0.2],
            ['speed', 'Speed', 0.0, 15.0, 0.05],
            ['radius', 'Radius', 1.0, 100.0, 0.5],
            ['heightRatio', 'Height Ratio', 0.1, 10.0, 0.1],
            ['autoChaosAmp', 'Auto Chaos Amp', 0.0, 80.0, 0.2],
            ['wSeparation', 'W Separation', 0.0, 1.2, 0.01],
            ['projectionScale', 'Projection Scale', 0.05, 1.2, 0.01],
            { type: 'color', key: 'colorA', label: 'Color A' },
            { type: 'color', key: 'colorB', label: 'Color B' },
        ],
    },
    {
        id: 'creationGlobal',
        title: 'Creation A Global',
        type: 'range',
        target: creationLinkParams,
        fields: [
            ['pulseSpeed', 'Pulse Speed', 0.1, 3.0, 0.01],
            ['vortexSpeed', 'Vortex Speed', 0.1, 2.4, 0.01],
            ['swirlStrength', 'Swirl Strength', 0.0, 1.0, 0.01],
            ['sphereFill', 'Sphere Fill', 0.2, 1.2, 0.01],
            ['colorSplitSoftness', 'Color Split Soft', 0.005, 0.3, 0.005],
            ['particleBrightness', 'Particle Bright', 0.2, 1.5, 0.01],
            ['particleSoftness', 'Particle Soft', 1.5, 6.0, 0.01],
            ['fluidDrift', 'Fluid Drift', 0.0, 0.6, 0.01],
            ['pointerBurstStrength', 'Pointer Burst', 0.0, 1.5, 0.01],
            ['pointerBurstSpread', 'Burst Spread', 0.0, 36.0, 0.1],
            ['colorContrast', 'Color Contrast', 0.0, 1.5, 0.01],
            ['floatAmp', 'Float Amp', 0.0, 1.2, 0.01],
            ['floatOffset', 'Float Offset', -1.0, 1.0, 0.01],
            ['yawSpeed', 'Yaw Speed', 0.0, 1.5, 0.01],
            ['tiltSpeed', 'Tilt Speed', 0.0, 2.0, 0.01],
            ['tiltAmp', 'Tilt Amp', 0.0, 0.8, 0.01],
            ['baseScaleMul', 'Base Scale', 0.5, 2.0, 0.01],
            ['pulseScaleAmp', 'Pulse Scale', 0.0, 0.4, 0.005],
            ['hoverScaleBoost', 'Hover Scale', 0.0, 0.6, 0.01],
            ['hoverLerp', 'Hover Lerp', 0.01, 0.5, 0.005],
            ['pointAlpha', 'Point Alpha', 0.0, 1.0, 0.01],
            ['haloScalePulse', 'Halo Scale Pulse', 0.0, 4.0, 0.01],
            ['haloScaleHover', 'Halo Scale Hover', 0.0, 3.0, 0.01],
            ['haloOpacityBase', 'Halo Opacity', 0.0, 1.0, 0.01],
            ['haloOpacityPulse', 'Halo Pulse', 0.0, 1.0, 0.01],
            ['haloOpacityHover', 'Halo Hover', 0.0, 1.0, 0.01],
        ],
    },
    {
        id: 'creationLink1',
        title: 'Creation Link 1',
        type: 'range',
        target: creationLinkParams,
        fields: [
            ['link1PosX', 'Pos X', -20.0, 20.0, 0.1],
            ['link1PosY', 'Pos Y', -20.0, 20.0, 0.1],
            ['link1PosZ', 'Pos Z', -25.0, 5.0, 0.1],
            ['link1Scale', 'Scale', 0.4, 15.0, 0.01],
            ['link1GlowScale', 'Glow Scale', 0.5, 10.0, 0.01],
            ['link1HitRadius', 'Hit Radius', 0.4, 6.0, 0.01],
            ['link1Phase', 'Phase', 0.0, 6.3, 0.01],
            ['link1ColorAR', 'Color A R', 0.0, 1.0, 0.01],
            ['link1ColorAG', 'Color A G', 0.0, 1.0, 0.01],
            ['link1ColorAB', 'Color A B', 0.0, 1.0, 0.01],
            ['link1ColorBR', 'Color B R', 0.0, 1.0, 0.01],
            ['link1ColorBG', 'Color B G', 0.0, 1.0, 0.01],
            ['link1ColorBB', 'Color B B', 0.0, 1.0, 0.01],
        ],
    },
    {
        id: 'creationLink2',
        title: 'Creation Link 2',
        type: 'range',
        target: creationLinkParams,
        fields: [
            ['link2PosX', 'Pos X', -20.0, 20.0, 0.1],
            ['link2PosY', 'Pos Y', -20.0, 20.0, 0.1],
            ['link2PosZ', 'Pos Z', -25.0, 5.0, 0.1],
            ['link2Scale', 'Scale', 0.4, 15.0, 0.01],
            ['link2GlowScale', 'Glow Scale', 0.5, 10.0, 0.01],
            ['link2HitRadius', 'Hit Radius', 0.4, 6.0, 0.01],
            ['link2Phase', 'Phase', 0.0, 6.3, 0.01],
            ['link2ColorAR', 'Color A R', 0.0, 1.0, 0.01],
            ['link2ColorAG', 'Color A G', 0.0, 1.0, 0.01],
            ['link2ColorAB', 'Color A B', 0.0, 1.0, 0.01],
            ['link2ColorBR', 'Color B R', 0.0, 1.0, 0.01],
            ['link2ColorBG', 'Color B G', 0.0, 1.0, 0.01],
            ['link2ColorBB', 'Color B B', 0.0, 1.0, 0.01],
        ],
    },
    {
        id: 'creationLink3',
        title: 'Creation Link 3',
        type: 'range',
        target: creationLinkParams,
        fields: [
            ['link3PosX', 'Pos X', -20.0, 20.0, 0.1],
            ['link3PosY', 'Pos Y', -20.0, 20.0, 0.1],
            ['link3PosZ', 'Pos Z', -25.0, 5.0, 0.1],
            ['link3Scale', 'Scale', 0.4, 15.0, 0.01],
            ['link3GlowScale', 'Glow Scale', 0.5, 10.0, 0.01],
            ['link3HitRadius', 'Hit Radius', 0.4, 6.0, 0.01],
            ['link3Phase', 'Phase', 0.0, 6.3, 0.01],
            ['link3ColorAR', 'Color A R', 0.0, 1.0, 0.01],
            ['link3ColorAG', 'Color A G', 0.0, 1.0, 0.01],
            ['link3ColorAB', 'Color A B', 0.0, 1.0, 0.01],
            ['link3ColorBR', 'Color B R', 0.0, 1.0, 0.01],
            ['link3ColorBG', 'Color B G', 0.0, 1.0, 0.01],
            ['link3ColorBB', 'Color B B', 0.0, 1.0, 0.01],
        ],
    },
    {
        id: 'background',
        title: 'Background',
        type: 'range',
        target: backgroundParams,
        fields: [
            ['centerR', 'Center R', 0.0, 1.0, 0.001],
            ['centerG', 'Center G', 0.0, 1.0, 0.001],
            ['centerB', 'Center B', 0.0, 1.0, 0.001],
            ['edgeR', 'Edge R', 0.0, 1.0, 0.001],
            ['edgeG', 'Edge G', 0.0, 1.0, 0.001],
            ['edgeB', 'Edge B', 0.0, 1.0, 0.001],
            ['pulse', 'Pulse', 0.0, 1.0, 0.005],
            ['opacity', 'Opacity', 0.0, 1.0, 0.005],
        ],
    },
    {
        id: 'quantum',
        title: 'Quantum Wave',
        type: 'range',
        target: quantumWaveParams,
        fields: [
            ['strength', 'Strength', 0.0, 0.2, 0.001],
            ['speed', 'Speed', 0.0, 1.0, 0.001],
            ['baseFreq', 'Base Freq', 0.2, 8.0, 0.01],
            ['dispersion', 'Dispersion', 0.0, 0.5, 0.001],
            ['noiseAmp', 'Noise Amp', 0.0, 1.0, 0.001],
            ['noiseScale', 'Noise Scale', 0.2, 8.0, 0.01],
            ['waveCount', 'Wave Count', 1.0, 8.0, 1.0],
            ['envelope', 'Envelope', 0.1, 2.0, 0.01],
            ['yInfluence', 'Y Influence', 0.0, 2.0, 0.01],
            ['glowAmount', 'Glow Amount', 0.0, 1.0, 0.01],
            ['caberration', 'Chromatic Aberr', 0.0, 0.02, 0.0005],
            ['rimBright', 'Rim Bright', 0.0, 1.0, 0.01],
            ['blurAmount', 'Blur Amount', 0.0, 0.1, 0.0005],
            ['fogDensity', 'Fog Density', 0.0, 0.3, 0.001],
            ['darken', 'Darken', 0.0, 1.0, 0.01],
            ['turbulence', 'Turbulence', 0.0, 1.0, 0.01],
            ['sharpness', 'Sharpness', 0.0, 1.0, 0.01],
        ],
    },
    {
        id: 'post',
        title: 'Post',
        type: 'range',
        target: distortionParams,
        fields: [
            ['dofStrength', 'DOF Strength', 0.0, 0.05, 0.0005],
            ['dofFocusRadius', 'DOF Focus', 0.05, 0.8, 0.005],
        ],
    },
    {
        id: 'breath',
        title: 'Breath',
        type: 'range',
        target: breathConfig,
        fields: [
            ['period', 'Period', 1.0, 20.0, 0.1],
            ['fovAmplitude', 'FOV Amplitude', 0.0, 6.0, 0.05],
            ['htmlMinOpacity', 'HTML Min Opacity', 0.0, 1.0, 0.01],
            ['htmlMaxOpacity', 'HTML Max Opacity', 0.0, 1.0, 0.01],
            ['htmlMaxBlur', 'HTML Max Blur', 0.0, 8.0, 0.05],
            ['htmlMinScale', 'HTML Min Scale', 0.5, 1.0, 0.005],
        ],
    },
];

const HIDDEN_GROUP_IDS_BY_VARIANT = {
    hold: new Set([
        'intentCamera',
        'intentMotion',
        'intentLoop',
        'intentConsciousness',
        'field',
        'plasma',
    ]),
    wabi: new Set([
        'intentCamera',
        'intentMotion',
        'intentLoop',
        'intentConsciousness',
        'creationLink2',
        'creationLink3',
    ]),
    intent: new Set([
        'scene',
        'toggles',
        'field',
        'flow',
        'plasma',
        'background',
        'quantum',
        'post',
        'breath',
        'creationGlobal',
        'creationLink1',
        'creationLink2',
        'creationLink3',
    ]),
};

const HIDDEN_FIELD_KEYS_BY_VARIANT = {
    hold: {
        toggles: new Set([
            'field',
            'showPlasma',
        ]),
        flow: new Set([
            'centerThickness',
            'speed',
        ]),
    },
};

function normalizeSceneVariant(sceneVariant) {
    if (sceneVariant === 'wabi' || sceneVariant === 'intent') return sceneVariant;
    return 'hold';
}

function resolveVisibleParamGroups(sceneVariant) {
    const variant = normalizeSceneVariant(sceneVariant);
    const hiddenGroupIds = HIDDEN_GROUP_IDS_BY_VARIANT[variant] || new Set();
    return PARAM_GROUPS.filter((group) => !hiddenGroupIds.has(group.id));
}

function getFieldKey(field) {
    return field && typeof field === 'object' && 'key' in field ? field.key : field[0];
}

function resolveVisibleFields(sceneVariant, group) {
    const variant = normalizeSceneVariant(sceneVariant);
    const hiddenByGroup = HIDDEN_FIELD_KEYS_BY_VARIANT[variant];
    const hiddenFieldKeys = hiddenByGroup?.[group.id];
    if (!hiddenFieldKeys || hiddenFieldKeys.size === 0) {
        return group.fields;
    }
    return group.fields.filter((field) => !hiddenFieldKeys.has(getFieldKey(field)));
}

function formatNumber(value, step) {
    const decimals = String(step).includes('.')
        ? String(step).split('.')[1].length
        : 0;
    return Number(value).toFixed(Math.min(decimals, 4));
}

function formatHex(value) {
    return `#${Math.max(0, Math.min(0xffffff, Math.round(value))).toString(16).padStart(6, '0')}`;
}

export function initDevPanel({
    onStateChanged = null,
    onStateSnapshot = null,
    panelStartsOpen = false,
    initialState = null,
    sceneVariant = 'hold',
} = {}) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'dev-panel-toggle';
    toggleBtn.className = 'btn btn-sm btn-outline-info';
    toggleBtn.type = 'button';
    toggleBtn.textContent = 'DEV';

    const panel = document.createElement('aside');
    panel.id = 'dev-panel';
    panel.innerHTML = `
        <div class="dev-panel-header">
            <h2 class="dev-panel-title">Dev Panel</h2>
            <button type="button" class="btn btn-sm btn-outline-light" id="dev-panel-close">Close</button>
        </div>
        <div class="dev-panel-body">
            <div class="accordion" id="dev-panel-accordion"></div>
            <div class="mt-3">
                <label class="form-label" for="dev-json">Config JSON</label>
                <textarea id="dev-json" class="form-control form-control-sm" rows="8"></textarea>
                <div class="dev-json-actions mt-2">
                    <button type="button" class="btn btn-sm btn-outline-light" id="dev-json-copy">Copy JSON</button>
                    <button type="button" class="btn btn-sm btn-outline-light" id="dev-json-paste">Paste JSON</button>
                    <button type="button" class="btn btn-sm btn-primary" id="dev-json-apply">Apply JSON</button>
                </div>
                <div class="dev-json-status" id="dev-json-status"></div>
            </div>
        </div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    if (panelStartsOpen) panel.classList.add('is-open');

    const accordion = panel.querySelector('#dev-panel-accordion');
    const jsonArea = panel.querySelector('#dev-json');
    const jsonStatus = panel.querySelector('#dev-json-status');

    const controlIndex = new Map();
    const colorControlIndex = new Map();
    const visibleParamGroups = resolveVisibleParamGroups(sceneVariant);
    const visiblePanelGroups = visibleParamGroups
        .map((group) => ({ group, fields: resolveVisibleFields(sceneVariant, group) }))
        .filter(({ fields }) => fields.length > 0);

    function notifyStateChanged() {
        if (typeof onStateChanged === 'function') {
            onStateChanged();
        }
        if (typeof onStateSnapshot === 'function') {
            onStateSnapshot(cloneConfigState());
        }
    }

    function refreshJson() {
        jsonArea.value = JSON.stringify(cloneConfigState(), null, 2);
    }

    function setStatus(message, isError = false) {
        jsonStatus.textContent = message;
        jsonStatus.style.color = isError ? 'rgba(255, 138, 138, 0.95)' : 'rgba(201, 221, 255, 0.8)';
    }

    function updateControlValue(path, value, step) {
        const entry = controlIndex.get(path);
        if (!entry) return;
        entry.input.value = String(value);
        entry.valueNode.textContent = formatNumber(value, step);
    }

    function registerControl(path, input, valueNode, step) {
        controlIndex.set(path, { input, valueNode, step });
    }

    function updateColorControlValue(path, color) {
        const entry = colorControlIndex.get(path);
        if (!entry || !color || typeof color.getHex !== 'function') return;
        const hex = color.getHex();
        entry.input.value = formatHex(hex);
        entry.valueNode.textContent = formatHex(hex);
    }

    function registerColorControl(path, input, valueNode) {
        colorControlIndex.set(path, { input, valueNode });
    }

    function buildToggleControl(group, field) {
        const [key, label] = field;
        const path = `${group.id}.${key}`;
        const wrapper = document.createElement('div');
        wrapper.className = 'form-check form-switch dev-row';

        const input = document.createElement('input');
        input.className = 'form-check-input';
        input.type = 'checkbox';
        input.id = `dev-${path}`;
        input.checked = Boolean(group.target[key]);

        const labelEl = document.createElement('label');
        labelEl.className = 'form-check-label';
        labelEl.setAttribute('for', input.id);
        labelEl.textContent = label;

        input.addEventListener('change', () => {
            group.target[key] = input.checked;
            notifyStateChanged();
            refreshJson();
        });

        wrapper.appendChild(input);
        wrapper.appendChild(labelEl);
        return wrapper;
    }

    function buildRangeControl(group, field) {
        const [key, label, min, max, step] = field;
        const path = `${group.id}.${key}`;

        const wrapper = document.createElement('div');
        wrapper.className = 'dev-row';

        const meta = document.createElement('div');
        meta.className = 'dev-row-meta';

        const labelEl = document.createElement('label');
        labelEl.className = 'form-label';
        labelEl.setAttribute('for', `dev-${path}`);
        labelEl.textContent = label;

        const valueEl = document.createElement('span');
        valueEl.className = 'dev-value';
        valueEl.textContent = formatNumber(group.target[key], step);

        meta.appendChild(labelEl);
        meta.appendChild(valueEl);

        const input = document.createElement('input');
        input.className = 'form-range';
        input.type = 'range';
        input.id = `dev-${path}`;
        input.min = String(min);
        input.max = String(max);
        input.step = String(step);
        input.value = String(group.target[key]);

        input.addEventListener('input', () => {
            const val = Number(input.value);
            group.target[key] = val;
            valueEl.textContent = formatNumber(val, step);
            notifyStateChanged();
        });

        input.addEventListener('change', refreshJson);

        registerControl(path, input, valueEl, step);

        const helpText = getFieldHelpText(group.id, key);

        wrapper.appendChild(meta);
        wrapper.appendChild(input);
        if (helpText) {
            const help = document.createElement('div');
            help.className = 'dev-row-help';
            help.textContent = helpText;
            wrapper.appendChild(help);
        }
        return wrapper;
    }

    function buildColorControl(group, field) {
        const { key, label } = field;
        const path = `${group.id}.${key}`;
        const color = group.target[key];

        const wrapper = document.createElement('div');
        wrapper.className = 'dev-row';

        const meta = document.createElement('div');
        meta.className = 'dev-row-meta';

        const labelEl = document.createElement('label');
        labelEl.className = 'form-label';
        labelEl.setAttribute('for', `dev-${path}`);
        labelEl.textContent = label;

        const valueEl = document.createElement('span');
        valueEl.className = 'dev-value';
        valueEl.textContent = formatHex(color.getHex());

        meta.appendChild(labelEl);
        meta.appendChild(valueEl);

        const input = document.createElement('input');
        input.className = 'form-control form-control-color';
        input.type = 'color';
        input.id = `dev-${path}`;
        input.value = formatHex(color.getHex());
        input.title = label;

        input.addEventListener('input', () => {
            group.target[key].set(input.value);
            valueEl.textContent = formatHex(group.target[key].getHex());
            notifyStateChanged();
        });

        input.addEventListener('change', refreshJson);

        registerColorControl(path, input, valueEl);

        const helpText = getFieldHelpText(group.id, key);
        wrapper.appendChild(meta);
        wrapper.appendChild(input);
        if (helpText) {
            const help = document.createElement('div');
            help.className = 'dev-row-help';
            help.textContent = helpText;
            wrapper.appendChild(help);
        }
        return wrapper;
    }

    visiblePanelGroups.forEach(({ group, fields }, idx) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';

        const headerId = `dev-head-${group.id}`;
        const collapseId = `dev-collapse-${group.id}`;

        item.innerHTML = `
            <h2 class="accordion-header" id="${headerId}">
                <button class="accordion-button ${idx === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${idx === 0 ? 'true' : 'false'}" aria-controls="${collapseId}">
                    ${group.title}
                </button>
            </h2>
            <div id="${collapseId}" class="accordion-collapse collapse ${idx === 0 ? 'show' : ''}" aria-labelledby="${headerId}" data-bs-parent="#dev-panel-accordion">
                <div class="accordion-body"></div>
            </div>
        `;

        const body = item.querySelector('.accordion-body');
        const groupHelp = GROUP_HELP_JA[group.id];
        if (groupHelp) {
            const helpNode = document.createElement('p');
            helpNode.className = 'dev-group-help';
            helpNode.textContent = groupHelp;
            body.appendChild(helpNode);
        }
        fields.forEach((field) => {
            const node = group.type === 'toggle'
                ? buildToggleControl(group, field)
                : (field.type === 'color' ? buildColorControl(group, field) : buildRangeControl(group, field));
            body.appendChild(node);
        });

        accordion.appendChild(item);
    });

    function syncUIFromState() {
        visiblePanelGroups.forEach(({ group, fields }) => {
            fields.forEach((field) => {
                const key = field.type === 'color' ? field.key : field[0];
                const path = `${group.id}.${key}`;

                if (group.type === 'toggle') {
                    const input = panel.querySelector(`#dev-${path}`);
                    if (input) input.checked = Boolean(group.target[key]);
                    return;
                }

                if (field.type === 'color') {
                    updateColorControlValue(path, group.target[key]);
                    return;
                }

                updateControlValue(path, group.target[key], field[4]);
            });
        });
    }

    async function copyJson() {
        refreshJson();
        try {
            await navigator.clipboard.writeText(jsonArea.value);
            setStatus('Copied JSON to clipboard.');
        } catch (error) {
            setStatus('Copy failed. Manual copy from textarea.', true);
        }
    }

    async function pasteJson() {
        try {
            const text = await navigator.clipboard.readText();
            jsonArea.value = text;
            applyJson();
        } catch (error) {
            setStatus('Paste failed. Paste text manually.', true);
        }
    }

    function applyJson() {
        try {
            const payload = JSON.parse(jsonArea.value);
            if (!payload || typeof payload !== 'object') {
                throw new Error('Invalid JSON object.');
            }

            applyConfigState(payload);

            notifyStateChanged();
            syncUIFromState();
            refreshJson();
            setStatus('Applied JSON to current state.');
        } catch (error) {
            setStatus(`JSON apply failed: ${error.message}`, true);
        }
    }

    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('is-open');
    });

    panel.querySelector('#dev-panel-close').addEventListener('click', () => {
        panel.classList.remove('is-open');
    });

    panel.querySelector('#dev-json-copy').addEventListener('click', copyJson);
    panel.querySelector('#dev-json-paste').addEventListener('click', pasteJson);
    panel.querySelector('#dev-json-apply').addEventListener('click', applyJson);

    if (initialState && typeof initialState === 'object') {
        applyConfigState(initialState);
        notifyStateChanged();
    }
    syncUIFromState();
    refreshJson();

    return {
        open() {
            panel.classList.add('is-open');
        },
        close() {
            panel.classList.remove('is-open');
        },
        destroy() {
            toggleBtn.remove();
            panel.remove();
        },
        getStateSnapshot() {
            return cloneConfigState();
        },
    };
}
