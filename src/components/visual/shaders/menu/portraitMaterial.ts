import { shaderMaterial } from "@react-three/drei";

const PortraitMaterial = shaderMaterial(
    {
        uPointer: null,
        tDepth: null,
        tNormal: null,
        tBase: null,
    },
    // vertex shader
    /*glsl*/ `
	precision mediump float;

	varying vec2 vUv;

	void main() {
		vec4 modelPosition = modelMatrix * vec4(position, 1.0);

		gl_Position = projectionMatrix * viewMatrix * modelPosition;

		// Varyings
		vUv = uv;
	}`,

    // fragment shader
    /*glsl*/ `
	precision mediump float; 

	// Depth texture
	uniform sampler2D tBase;
	uniform sampler2D tDepth;
	uniform sampler2D tNormal;

	// Common uniforms
	uniform vec2 uPointer;
	uniform vec2 uImageSizes;
	uniform vec2 uViewportSizes;

	varying vec2 vUv;

	void main() {
		vec2 uv = vUv;
		vec3 color = vec3(0.);

		// Image UVs
		vec2 iUv = uv;

		// Ambient light
		vec3 ambientColor = vec3(0.1);

		// Normal
		vec3 normal = normalize(texture2D(tNormal, iUv).xyz * 2. - 1.);

		// Diffuse
		vec3 diffuse = texture2D(tBase, iUv).xyz;

		// Depth
		float depth = texture2D(tDepth, iUv).r;
		vec3 depthOffset = vec3(0.0, 0.0, depth * 0.5);

		// Light
		vec3 lightDirection = normalize(vec3(uPointer.x * 2.0, uPointer.y * 2.0, 1.0));
		
		// Combine normal and depth for better 3D effect
		vec3 finalNormal = normalize(normal + depthOffset);
		float diffuseIntensity = max(dot(finalNormal, lightDirection), 0.4);

		color = ambientColor + diffuse * diffuseIntensity;
		gl_FragColor = vec4(color, 1.);
		#include <colorspace_fragment>
	}`
);

export default PortraitMaterial;
