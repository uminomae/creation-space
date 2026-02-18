// liquid-shaders.glsl.js — liquid.js 用のGLSL文字列を分離
// ★ 可能な限り「数値埋め込み」を避け、uniformで受け取る（config.jsで集中管理しやすくする）

export const LIQUID_FULLSCREEN_VERT = /* glsl */`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

export const LIQUID_ADVECTION_FRAG = /* glsl */`
    uniform sampler2D tVelocity;
    uniform sampler2D tSource;
    uniform float uTimestep;
    uniform float uDissipation;
    varying vec2 vUv;

    void main() {
        vec2 vel = texture2D(tVelocity, vUv).xy;
        vec2 pos = vUv - uTimestep * vel;
        vec4 result = texture2D(tSource, clamp(pos, 0.0, 1.0));
        gl_FragColor = result * uDissipation;
    }
`;

export const LIQUID_DIVERGENCE_FRAG = /* glsl */`
    uniform sampler2D tVelocity;
    uniform float uTexel; // 1.0 / textureSize
    varying vec2 vUv;

    void main() {
        float L = texture2D(tVelocity, vUv - vec2(uTexel, 0.0)).x;
        float R = texture2D(tVelocity, vUv + vec2(uTexel, 0.0)).x;
        float B = texture2D(tVelocity, vUv - vec2(0.0, uTexel)).y;
        float T = texture2D(tVelocity, vUv + vec2(0.0, uTexel)).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`;

export const LIQUID_POISSON_FRAG = /* glsl */`
    uniform sampler2D tPressure;
    uniform sampler2D tDivergence;
    uniform float uTexel; // 1.0 / textureSize
    varying vec2 vUv;

    void main() {
        float L = texture2D(tPressure, vUv - vec2(uTexel, 0.0)).x;
        float R = texture2D(tPressure, vUv + vec2(uTexel, 0.0)).x;
        float B = texture2D(tPressure, vUv - vec2(0.0, uTexel)).x;
        float T = texture2D(tPressure, vUv + vec2(0.0, uTexel)).x;
        float div = texture2D(tDivergence, vUv).x;
        float p = (L + R + B + T - div) * 0.25;
        gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
    }
`;

export const LIQUID_GRADIENT_SUBTRACT_FRAG = /* glsl */`
    uniform sampler2D tPressure;
    uniform sampler2D tVelocity;
    uniform float uTexel; // 1.0 / textureSize
    varying vec2 vUv;

    void main() {
        float L = texture2D(tPressure, vUv - vec2(uTexel, 0.0)).x;
        float R = texture2D(tPressure, vUv + vec2(uTexel, 0.0)).x;
        float B = texture2D(tPressure, vUv - vec2(0.0, uTexel)).x;
        float T = texture2D(tPressure, vUv + vec2(0.0, uTexel)).x;
        vec2 grad = vec2(R - L, T - B) * 0.5;
        vec2 vel = texture2D(tVelocity, vUv).xy - grad;
        gl_FragColor = vec4(vel, 0.0, 1.0);
    }
`;

export const LIQUID_FORCE_FRAG = /* glsl */`
    uniform sampler2D tVelocity;
    uniform vec2 uMouse;
    uniform vec2 uMouseVel;
    uniform float uRadius;
    uniform float uStrength;
    varying vec2 vUv;

    void main() {
        vec2 vel = texture2D(tVelocity, vUv).xy;
        vec2 diff = vUv - uMouse;
        float dist = length(diff);
        float influence = smoothstep(uRadius, 0.0, dist);
        float speed = length(uMouseVel);
        if (speed > 0.0001) {
            vel += uMouseVel * influence * uStrength;
        }
        gl_FragColor = vec4(vel, 0.0, 1.0);
    }
`;

export const LIQUID_DENSITY_SPLAT_FRAG = /* glsl */`
    uniform sampler2D tDensity;
    uniform vec2 uMouse;
    uniform vec2 uMouseVel;
    uniform float uRadius;
    uniform float uGain;
    varying vec2 vUv;

    void main() {
        float density = texture2D(tDensity, vUv).r;
        vec2 diff = vUv - uMouse;
        float dist = length(diff);
        float influence = smoothstep(uRadius, 0.0, dist);
        float speed = length(uMouseVel);
        if (speed > 0.0001) {
            density += influence * speed * uGain;
        }
        gl_FragColor = vec4(density, 0.0, 0.0, 1.0);
    }
`;

export const LIQUID_COPY_DENSITY_FRAG = /* glsl */`
    uniform sampler2D tDensity;
    varying vec2 vUv;
    void main() {
        float d = texture2D(tDensity, vUv).r;
        gl_FragColor = vec4(d, d, d, d);
    }
`;

// ★ この断片は snoise() を外部（noise.glsl.js）から注入して使う
export const LIQUID_RENDER_FRAG_BODY = /* glsl */`
    uniform sampler2D tDensity;
    uniform float uTime;
    uniform float uTexel; // 1.0 / textureSize

    uniform float uDensityMul;
    uniform float uNoiseScale;
    uniform float uNoiseSpeed;
    uniform float uNoiseAmp;

    uniform float uSpecPow;
    uniform float uSpecInt;
    uniform vec3 uBaseColor;
    uniform vec3 uHighlight;

    // 見た目の微調整（magic number のconfig.js化）
    uniform float uNormalZ;
    uniform float uDiffuseGain;
    uniform float uDensityEdge;
    uniform float uAlphaEdge;
    uniform float uAlphaMax;

    varying vec2 vUv;

    void main() {
        float density = texture2D(tDensity, vUv).r;

        // ノイズで有機的な動き
        float noise = snoise(vUv * uNoiseScale + vec2(uTime * uNoiseSpeed));
        density += noise * uNoiseAmp;
        density *= uDensityMul;

        // 法線計算（密度勾配から）
        float dL = texture2D(tDensity, vUv - vec2(uTexel, 0.0)).r;
        float dR = texture2D(tDensity, vUv + vec2(uTexel, 0.0)).r;
        float dB = texture2D(tDensity, vUv - vec2(0.0, uTexel)).r;
        float dT = texture2D(tDensity, vUv + vec2(0.0, uTexel)).r;
        vec3 normal = normalize(vec3(dL - dR, dB - dT, uNormalZ));

        // ライティング（簡易）
        vec3 lightDir = normalize(vec3(0.5, 1.0, 0.8));
        vec3 viewDir = vec3(0.0, 0.0, 1.0);

        // ディフューズ
        float diffuse = max(dot(normal, lightDir), 0.0);

        // スペキュラ（表面張力の光沢）
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(reflectDir, viewDir), 0.0), uSpecPow);

        // 色合成
        vec3 color = uBaseColor + diffuse * uDiffuseGain;
        color += uHighlight * spec * uSpecInt;
        color = mix(vec3(0.0), color, smoothstep(0.0, uDensityEdge, density));

        float alpha = smoothstep(0.0, uAlphaEdge, density) * uAlphaMax;
        gl_FragColor = vec4(color, alpha);
    }
`;

