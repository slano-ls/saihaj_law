uniform vec3 glowColor;
uniform float uFadeTime;
varying float intensity;
varying float alpha;

void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float pct = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
    vec3 color = vec3(1.0);
    vec3 glow = glowColor * intensity;
    
    // Combine alpha and fadeTime
    float finalAlpha = clamp(alpha, 0.0, uFadeTime) * pct;
    
    gl_FragColor = vec4(glow, finalAlpha);
}