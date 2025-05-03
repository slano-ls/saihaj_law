uniform vec3 glowColor;
uniform sampler2D lightningTexture;
uniform float uTime;

varying float intensity;
varying vec2 uv;

void main() {
    vec2 lightUv = uv;
    lightUv.x = mod(lightUv.x + uTime * 0.1, 1.0);
    
    vec3 glow = glowColor * intensity;
    vec3 color = vec3(step(0.1, uv.y) - step(0.2, uv.y));
    
    gl_FragColor = vec4(glow, 1.0);
}