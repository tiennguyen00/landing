export const vertexShader = `
varying vec2 vUv;
float PI = 3.141592653589793238;
uniform float uTime;
uniform vec2 uDelta;
uniform float uDirection;
void main()
{
    vec3 newPosition = position;
    // Final position
    newPosition.x += sin(uv.y * PI) * 0.1 * uDelta.x * uDirection;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
}
`;

export const fragmentShader = `
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uTextureAspect;
uniform float uTime;
void main()
{
  float aspect = uTextureAspect;
  // Adjust UV coordinates to maintain texture aspect ratio
  vec2 adjustedUV = vUv;
  float positionMap = mod(uTime, 1.);
  adjustedUV.x = (vUv.x - positionMap) / aspect + positionMap;  // Changed * to /

  // Final color
  gl_FragColor = texture(uTexture, adjustedUV);
}

`;
