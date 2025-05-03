uniform vec3 viewVector;
uniform float c;
uniform float p;
uniform float offsetY;
uniform float uTime;

varying float intensity;
varying vec2 uv;

void main() {
    vec3 vNormal = normalize( normalMatrix * normal );
    vec3 vNormel = normalize( normalMatrix * viewVector );
    intensity = pow(c - abs(dot(vNormal, vec3(0, 0, 1))), p);
   
    uv = vec2(0.0); 
    uv.y = 0.09 + smoothstep(0.0, 1.0, uTime*0.01) + offsetY;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}