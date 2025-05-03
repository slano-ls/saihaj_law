import * as THREE from 'three';

export const starVertexShader = `
    attribute float size;
    attribute float brightness;
    varying float vBrightness;
    
    void main() {
        vBrightness = brightness;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

export const starFragmentShader = `
    varying float vBrightness;
    uniform float time;
    
    void main() {
        float r = 0.0;
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        r = dot(cxy, cxy);
        
        if (r > 1.0) {
            discard;
        }
        
        // Create a smooth circle with glow
        float intensity = 1.0 - r;
        intensity = pow(intensity, 2.0);
        
        // Add subtle pulse effect
        float pulse = sin(time * 2.0) * 0.1 + 0.9;
        intensity *= pulse;
        
        // Apply brightness
        intensity *= vBrightness;
        
        // Create color with slight blue tint
        vec3 color = vec3(0.9, 0.95, 1.0) * intensity;
        
        gl_FragColor = vec4(color, intensity);
    }
`;

export const shootingStarVertexShader = `
    attribute float progress;
    varying float vProgress;
    
    void main() {
        vProgress = progress;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 4.0 * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
    }
`;

export const shootingStarFragmentShader = `
    varying float vProgress;
    uniform float time;
    
    void main() {
        float r = 0.0;
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        r = dot(cxy, cxy);
        
        if (r > 1.0) {
            discard;
        }
        
        // Create a smooth circle with glow
        float intensity = 1.0 - r;
        intensity = pow(intensity, 2.0);
        
        // Add trail effect
        float trail = smoothstep(0.0, 0.2, vProgress) * (1.0 - smoothstep(0.8, 1.0, vProgress));
        intensity *= trail;
        
        // Create color with slight blue tint
        vec3 color = vec3(0.9, 0.95, 1.0) * intensity;
        
        gl_FragColor = vec4(color, intensity);
    }
`; 