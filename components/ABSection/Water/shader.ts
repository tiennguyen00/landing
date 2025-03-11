export const flowWaterVertexShader = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
attribute vec3 aRandom;

vec3 getPos(float progress) {
    float angle = progress * PI * 2.;
    float x = sin(angle) + 2. * sin(angle * 2.);
    float y = cos(angle) - 2. * cos(angle * 2.);
    float z = -sin(3. * angle);
    return vec3(x, y, z);
}

void main() {
    vec3 pos = position;
    pos = getPos(fract(uTime + aRandom.x));
    vUv = uv;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);
    gl_PointSize = 10. * (1. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;
export const flowWaterFragmentShader = `
void main() {
  vec3 color = vec3(0.136, 0.559, 0.832);
  gl_FragColor = vec4(color, 1.);
}
`;

export const godRaysVertexShader = `
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

export const godRaysFragmentShader = `
varying vec2 vUv;
varying vec3 vWorldPosition;
uniform sampler2D uTexture;
uniform float uTime;

void main() {

    vec2 godray = vWorldPosition.xy - vec2(0.,10.);
    float uvDirection = atan(godray.y, godray.x);

    float c = texture2D(uTexture, vec2(uvDirection, 0.) + 0.04 * uTime).x;
    float c1 = texture2D(uTexture, vec2(0.1, uvDirection) + 0.04 * uTime * 1.5).x;

    float alpha = min(c, c1);
    gl_FragColor = vec4(vUv, 0., 1.);
    float fade = smoothstep(0.15, 0.86, abs(vUv.y));
    gl_FragColor = vec4(vec3(alpha), alpha * 0.3 * fade);
}
`;
