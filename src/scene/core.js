import * as THREE from 'three';
import {
    backgroundParams,
    creationLinkParams,
    fieldParams,
    flowParams,
    plasmaParams,
    sceneParams,
    toggles,
    FOG_V002_COLOR,
    FOG_V002_DENSITY,
    FOG_V004_COLOR,
    FOG_V004_DENSITY,
} from '../config.js';
import { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR, CAMERA_LOOK_AT_Z } from '../constants.js';
import { lerp } from '../animation-utils.js';
import { createBackgroundMaterial, createBackgroundMesh } from '../shaders/background.js';

export { sceneParams } from '../config.js';

function clamp01(value) {
    return Math.min(1, Math.max(0, value));
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function randRange(min, max) {
    return min + Math.random() * (max - min);
}

function calcCamZ(aspect) {
    if (aspect >= 1) return sceneParams.camZ;
    const t = Math.max(0, (aspect - 0.5) * 2.0);
    return sceneParams.camZ * t;
}

function getCreationLinkParam(id) {
    const key = `link${id}`;
    return {
        posX: creationLinkParams[`${key}PosX`],
        posY: creationLinkParams[`${key}PosY`],
        posZ: creationLinkParams[`${key}PosZ`],
        scale: creationLinkParams[`${key}Scale`],
        glowScale: creationLinkParams[`${key}GlowScale`],
        hitRadius: creationLinkParams[`${key}HitRadius`],
        phase: creationLinkParams[`${key}Phase`],
        colorAR: clamp(creationLinkParams[`${key}ColorAR`], 0.0, 1.0),
        colorAG: clamp(creationLinkParams[`${key}ColorAG`], 0.0, 1.0),
        colorAB: clamp(creationLinkParams[`${key}ColorAB`], 0.0, 1.0),
        colorBR: clamp(creationLinkParams[`${key}ColorBR`], 0.0, 1.0),
        colorBG: clamp(creationLinkParams[`${key}ColorBG`], 0.0, 1.0),
        colorBB: clamp(creationLinkParams[`${key}ColorBB`], 0.0, 1.0),
    };
}

function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
}

function createGlowTexture(colorHex) {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const color = new THREE.Color(colorHex);
    const rgb = `${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}`;
    const gradient = ctx.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.5);
    gradient.addColorStop(0.0, `rgba(${rgb}, 0.95)`);
    gradient.addColorStop(0.25, `rgba(${rgb}, 0.68)`);
    gradient.addColorStop(0.6, `rgba(${rgb}, 0.28)`);
    gradient.addColorStop(1.0, `rgba(${rgb}, 0.0)`);

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size * 0.5, size * 0.5, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function createCreationHitProxy() {
    return new THREE.Mesh(
        new THREE.IcosahedronGeometry(1, 1),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.0,
            depthWrite: false,
        })
    );
}

export function createSceneModule({
    creationLinkDefs,
    createFlowObjects,
    updateFlowObjects,
    createStarMaterial,
    updateStars,
    createHopfPointMaterial,
    updateCreationLinks,
    updateBackground,
    updateSceneExtras,
    decorateCreationLinkTarget,
    isCreationLinkInteractive = (def) => def.interactive !== false,
}) {
    let _scene;
    let _camera;
    let _bgMaterial;
    let _bgMesh;
    let _fieldMaterial;
    let _fieldMesh;
    let _flowGroup;
    let _flowState = null;
    let _starFieldGroup;
    let _starMaterials = [];
    let _creationLinkGroup;
    let _creationLinkTargets = [];

    const _fogColor = new THREE.Color();
    const _bgCenterA = new THREE.Color();
    const _bgCenterB = new THREE.Color();
    const _bgEdgeA = new THREE.Color();
    const _bgEdgeB = new THREE.Color();

    const helpers = {
        THREE,
        backgroundParams,
        creationLinkParams,
        fieldParams,
        flowParams,
        plasmaParams,
        sceneParams,
        toggles,
        lerp,
        clamp,
        clamp01,
        randRange,
        calcCamZ,
        getCreationLinkParam,
        smoothstep,
    };

    function createStarLayer({
        count,
        radiusMin,
        radiusMax,
        sizeMin,
        sizeMax,
        yStretch,
    }) {
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const phases = new Float32Array(count);
        const temps = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2.0 * Math.PI * u;
            const phi = Math.acos(2.0 * v - 1.0);
            const radius = radiusMin + Math.random() * (radiusMax - radiusMin);

            positions[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.cos(phi) * yStretch;
            positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
            sizes[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
            phases[i] = Math.random();
            temps[i] = Math.pow(Math.random(), 4.0);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
        geometry.setAttribute('aTemp', new THREE.BufferAttribute(temps, 1));

        const material = createStarMaterial({ helpers });
        _starMaterials.push(material);
        return new THREE.Points(geometry, material);
    }

    function createStarField() {
        _starMaterials = [];

        const group = new THREE.Group();
        const farLayer = createStarLayer({
            count: 2800,
            radiusMin: 70,
            radiusMax: 130,
            sizeMin: 0.7,
            sizeMax: 1.5,
            yStretch: 0.85,
        });
        const midLayer = createStarLayer({
            count: 1400,
            radiusMin: 46,
            radiusMax: 82,
            sizeMin: 0.9,
            sizeMax: 1.8,
            yStretch: 0.75,
        });

        farLayer.position.y = -4;
        midLayer.position.y = -7;
        group.add(farLayer, midLayer);
        return group;
    }

    function createLinkHalo(linkParam) {
        const color = new THREE.Color(linkParam.colorBR, linkParam.colorBG, linkParam.colorBB);
        const glowTexture = createGlowTexture(color.getHex());
        if (!glowTexture) return null;

        const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            transparent: true,
            opacity: creationLinkParams.haloOpacityBase,
            color,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const glow = new THREE.Sprite(glowMaterial);
        glow.scale.setScalar(linkParam.glowScale);
        glow.renderOrder = 38;
        return glow;
    }

    function createHopfPoints(def, linkParam) {
        const pointCount = def.pointCount;
        const basePositions = new Float32Array(pointCount * 3);
        const initial4 = new Float32Array(pointCount * 4);
        const flowDir = new Float32Array(pointCount);
        const sizes = new Float32Array(pointCount);
        const phases = new Float32Array(pointCount);

        for (let i = 0; i < pointCount; i++) {
            const p4 = i * 4;
            const x = Math.random() * 2.0 - 1.0;
            const y = Math.random() * 2.0 - 1.0;
            const z = Math.random() * 2.0 - 1.0;
            const w = Math.random() * 2.0 - 1.0;
            const invLen = 1.0 / Math.max(0.0001, Math.hypot(x, y, z, w));

            initial4[p4 + 0] = x * invLen;
            initial4[p4 + 1] = y * invLen;
            initial4[p4 + 2] = z * invLen;
            initial4[p4 + 3] = w * invLen;

            flowDir[i] = i < pointCount * 0.5 ? 1.0 : -1.0;
            sizes[i] = randRange(1.8, 4.8);
            phases[i] = Math.random() * Math.PI * 2.0;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(basePositions, 3));
        geometry.setAttribute('aInitial4', new THREE.BufferAttribute(initial4, 4));
        geometry.setAttribute('aFlowDir', new THREE.BufferAttribute(flowDir, 1));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

        const material = createHopfPointMaterial({ linkParam, helpers });
        const points = new THREE.Points(geometry, material);
        points.renderOrder = 40;
        return { points, material };
    }

    function createCreationLinks() {
        _creationLinkTargets = [];

        const group = new THREE.Group();
        creationLinkDefs.forEach((def, index) => {
            const linkParam = getCreationLinkParam(def.id);
            const node = new THREE.Group();
            node.position.set(linkParam.posX, linkParam.posY, linkParam.posZ);
            node.userData.phaseOffset = index * 0.37;

            const { points, material } = createHopfPoints(def, linkParam);
            node.add(points);

            const halo = createLinkHalo(linkParam);
            if (halo) node.add(halo);

            const proxy = createCreationHitProxy();
            proxy.scale.setScalar(linkParam.hitRadius);
            proxy.userData.isCreationLinkTarget = isCreationLinkInteractive(def);
            proxy.userData.draftUrl = def.draftUrl;
            proxy.userData.sourceUrl = def.sourceUrl;
            proxy.userData.label = def.label;
            proxy.userData.isHovered = false;
            proxy.renderOrder = 41;
            node.add(proxy);

            group.add(node);

            const target = {
                id: def.id,
                group: node,
                material,
                halo,
                mesh: proxy,
                hoverValue: 0,
                phaseOffset: index * 0.37,
                colorA: new THREE.Color(linkParam.colorAR, linkParam.colorAG, linkParam.colorAB),
                colorB: new THREE.Color(linkParam.colorBR, linkParam.colorBG, linkParam.colorBB),
            };
            const extraTargetData = typeof decorateCreationLinkTarget === 'function'
                ? decorateCreationLinkTarget({ def, index, linkParam, target, helpers })
                : null;
            if (extraTargetData && typeof extraTargetData === 'object') {
                Object.assign(target, extraTargetData);
            }
            _creationLinkTargets.push(target);
        });

        return group;
    }

    function getCreationLinkTargetMeshes() {
        return _creationLinkTargets
            .map((target) => target.mesh)
            .filter((mesh) => mesh?.userData?.isCreationLinkTarget);
    }

    function createScene(container) {
        const scene = new THREE.Scene();
        _scene = scene;
        scene.fog = new THREE.FogExp2(FOG_V004_COLOR.getHex(), FOG_V004_DENSITY);

        _bgMaterial = createBackgroundMaterial();
        _bgMesh = createBackgroundMesh(_bgMaterial);
        scene.add(_bgMesh);

        const aspect = window.innerWidth / window.innerHeight;
        const camera = new THREE.PerspectiveCamera(CAMERA_FOV, aspect, CAMERA_NEAR, CAMERA_FAR);
        camera.position.set(sceneParams.camX, sceneParams.camY, calcCamZ(aspect));
        camera.lookAt(0, sceneParams.camTargetY, CAMERA_LOOK_AT_Z);
        _camera = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        _flowState = createFlowObjects({ helpers });
        _fieldMesh = _flowState?.fieldMesh || null;
        _fieldMaterial = _flowState?.fieldMaterial || null;
        _flowGroup = _flowState?.group || null;
        _starFieldGroup = createStarField();
        _creationLinkGroup = createCreationLinks();

        if (_fieldMesh) scene.add(_fieldMesh);
        if (_flowGroup) scene.add(_flowGroup);
        if (_starFieldGroup) scene.add(_starFieldGroup);
        if (_creationLinkGroup) scene.add(_creationLinkGroup);

        return { scene, camera, renderer };
    }

    function updateScene(time) {
        const m = (Math.sin(time * Math.PI / sceneParams.mixCycle) + 1.0) * 0.5;

        if (toggles.background && _bgMaterial) {
            const pulse = (m * 2.0 - 1.0) * backgroundParams.pulse;
            const centerAFactor = clamp01(1.0 - pulse * 0.45);
            const centerBFactor = clamp01(1.0 + pulse * 0.45);
            const edgeAFactor = clamp01(1.0 - pulse * 0.25);
            const edgeBFactor = clamp01(1.0 + pulse * 0.25);

            _bgCenterA.setRGB(
                clamp01(backgroundParams.centerR * centerAFactor),
                clamp01(backgroundParams.centerG * centerAFactor),
                clamp01(backgroundParams.centerB * centerAFactor)
            );
            _bgCenterB.setRGB(
                clamp01(backgroundParams.centerR * centerBFactor),
                clamp01(backgroundParams.centerG * centerBFactor),
                clamp01(backgroundParams.centerB * centerBFactor)
            );
            _bgEdgeA.setRGB(
                clamp01(backgroundParams.edgeR * edgeAFactor),
                clamp01(backgroundParams.edgeG * edgeAFactor),
                clamp01(backgroundParams.edgeB * edgeAFactor)
            );
            _bgEdgeB.setRGB(
                clamp01(backgroundParams.edgeR * edgeBFactor),
                clamp01(backgroundParams.edgeG * edgeBFactor),
                clamp01(backgroundParams.edgeB * edgeBFactor)
            );

            _bgMaterial.uniforms.uColorCenterA.value.copy(_bgCenterA);
            _bgMaterial.uniforms.uColorCenterB.value.copy(_bgCenterB);
            _bgMaterial.uniforms.uColorEdgeA.value.copy(_bgEdgeA);
            _bgMaterial.uniforms.uColorEdgeB.value.copy(_bgEdgeB);
            _bgMaterial.uniforms.uMix.value = m;
            _bgMaterial.uniforms.uOpacity.value = backgroundParams.opacity;
        }

        if (_bgMesh) {
            _bgMesh.visible = toggles.background;
        }

        if (typeof updateBackground === 'function') {
            updateBackground({
                time,
                mix: m,
                bgMaterial: _bgMaterial,
                bgMesh: _bgMesh,
                camera: _camera,
                helpers,
            });
        }

        if (toggles.fog && _scene?.fog) {
            _fogColor.lerpColors(FOG_V002_COLOR, FOG_V004_COLOR, m);
            _scene.fog.color.copy(_fogColor);
            _scene.fog.density = lerp(FOG_V002_DENSITY, sceneParams.fogDensity, m);
        } else if (_scene?.fog) {
            _scene.fog.density = 0;
        }

        if (_flowGroup) {
            _flowGroup.visible = toggles.flowObjects;
            if (toggles.flowObjects) {
                updateFlowObjects({
                    time,
                    flowState: _flowState,
                    helpers,
                });
            }
        }

        if (typeof updateStars === 'function') {
            updateStars({
                time,
                starFieldGroup: _starFieldGroup,
                starMaterials: _starMaterials,
                helpers,
            });
        }

        if (_creationLinkTargets.length > 0 && typeof updateCreationLinks === 'function') {
            updateCreationLinks({
                time,
                creationLinkTargets: _creationLinkTargets,
                camera: _camera,
                helpers,
            });
        }

        if (typeof updateSceneExtras === 'function') {
            updateSceneExtras({
                time,
                fieldMaterial: _fieldMaterial,
                fieldMesh: _fieldMesh,
                flowGroup: _flowGroup,
                scene: _scene,
                camera: _camera,
                helpers,
            });
        }
    }

    return {
        getCreationLinkTargetMeshes,
        createScene,
        updateScene,
    };
}
