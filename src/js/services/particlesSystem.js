/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["data"] }] */
import * as BAS from 'three-bas';
import * as THREE from 'three';
import { Power1, TweenMax } from 'gsap';
import Chuncks from './chunks';
import xRayVertex from '../shaders/xRay.vert';
import xRayFrag from '../shaders/xRay.frag';

class ParticleSystem {
    constructor(mainBrain, brainParticles, memories) {
        this.chuncks = new Chuncks();
        this.brainParticles = brainParticles;
        this.memories = memories;
        this.mainBrain = mainBrain;
        this.particlesStartColor = new THREE.Color(0xffffff);
        this.particlesColor = new THREE.Color(0xffffff);
        const { xRayEffect, systemPoints } = this.init();
        this.particles = systemPoints;
        this.xRay = xRayEffect;
    }

    static getLoadingPoints() {
        const geometry = new THREE.RingBufferGeometry(100, 40, 150, 150, 20);
        return geometry.attributes.position.array;
    }

    init() {
        const duration = 1.0;
        const maxPointDelay = 0.3;

        const brainPoints = this.brainParticles.attributes.position.array;

        const count = brainPoints.length / 3;
        const me = this;

        const geometry = new BAS.PointBufferGeometry(count);

        const loadingCircle = ParticleSystem.getLoadingPoints();
        geometry.createAttribute('aStartLoading', 3, (data, index, num) => {
            const startVec3 = new THREE.Vector3();
            if (loadingCircle.length < brainPoints.length) {
                startVec3.x = loadingCircle[(index * 3) + 0] || 0.0;
                startVec3.y = loadingCircle[(index * 3) + 1] || 0.0;
                startVec3.z = THREE.Math.randFloat(-80.0, 1500.0);
            } else {
                startVec3.x = 100.0;
                startVec3.y = 100.0;
                startVec3.z = THREE.Math.randFloat(-80.0, 1500.0);
            }
            startVec3.toArray(data);
        });

        const color = new THREE.Color();
        geometry.createAttribute('aStartColor', 3, (data) => {
            const { r, g, b } = me.particlesStartColor;
            color.setRGB(r, g, b);
            color.toArray(data);
        });

        geometry.createAttribute('scale', 1, (data) => {
            data[0] = THREE.Math.randFloat(200.0, 400.0);
        });

        geometry.createAttribute('aEndColor', 3, (data) => {
            const { r, g, b } = me.particlesStartColor;
            color.setRGB(r, g, b);
            color.toArray(data);
        });

        geometry.createAttribute('aEndPos', 3, (data, index) => {
            const startVec3 = new THREE.Vector3();
            startVec3.x = brainPoints[(index * 3) + 0];
            startVec3.y = brainPoints[(index * 3) + 1];
            startVec3.z = brainPoints[(index * 3) + 2];
            startVec3.toArray(data);
        });

        this.totalDuration = duration + maxPointDelay;

        geometry.createAttribute('aDelayDuration', 3, (data) => {
            data[0] = Math.random() * maxPointDelay;
            data[1] = duration;
        });

        const geometry2 = new BAS.PointBufferGeometry(count);

        geometry2.createAttribute('position', 3, (data, index) => {
            const startVec3 = new THREE.Vector3();
            startVec3.x = brainPoints[(index * 3) + 0];
            startVec3.y = brainPoints[(index * 3) + 1];
            startVec3.z = brainPoints[(index * 3) + 2];
            startVec3.toArray(data);
        });

        const material = new BAS.PointsAnimationMaterial({
            vertexColors: THREE.VertexColors,
            deptWrite: false,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            transparent: true,
            uniforms: {
                uTime: { type: 'f', value: 0 },
                uProgress: { type: 'float', value: 0.0 },
                uAngle: { type: 'f', value: 1.0 },
                uPointSizeEffect: { type: 'f', value: 0.1 },
                uColor: { value: new THREE.Color(0xffffff) },
            },
            uniformValues: {
                size: 1.9,
                scale: 400,
            },
            vertexFunctions: [
                BAS.ShaderChunk.ease_expo_in_out,
                BAS.ShaderChunk.quaternion_rotation,
                this.chuncks.rotate,
                this.chuncks.random,
                this.chuncks.noise,
            ],
            vertexParameters: [
                'uniform float uTime;',
                'uniform float uPointSizeEffect;',
                'uniform float uProgress;',
                'uniform float uAngle;',
                'attribute vec2 aDelayDuration;',
                'attribute vec3 aStartLoading;',
                'attribute vec3 aStartPos;',
                'attribute vec3 aEndPos;',
                'attribute vec3 aStartColor;',
                'attribute vec3 aEndColor;',
                'attribute float aStartOpacity;',
                'attribute float aEndOpacity;',
            ],
            varyingParameters: [
                'varying vec3 vParticle;',
                'varying vec3 vEndPos;',
                'varying vec3 vStartLoading;',
            ],
            vertexInit: [
                'float tProgress = clamp(uProgress - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;',
                'tProgress = easeExpoInOut(tProgress);',
            ],
            vertexPosition: [
                `if(tProgress < 0.5){ 
                    vec2 pos = vec2(aStartLoading.xy*5.0);
                    float n = noise(aStartLoading.yx);
                    vec2 test;
                    if(mod(aStartLoading.x, 2.0) < 0.2){
                        test = rotate2D(aStartLoading.xy, 3.14159265359*2.0 * uTime * uAngle * n);
                        transformed += vec3(test.x, test.y, aStartLoading.z * n);
                    }else if (mod(aStartLoading.x, 2.0) >= 0.2 && mod(aStartLoading.x, 2.0) < 1.5){
                        test = rotate2D(aStartLoading.xy + n, 3.14159265359*2.0 * uTime * 0.05 * uAngle * n);
                        transformed += vec3(test.x, test.y, aStartLoading.z * n);
                    }else {
                        test = rotate2D(aStartLoading.xy + n, 3.14159265359*2.0 * uTime * 0.01 * uAngle * n);
                        transformed += vec3(test.x, test.y , aStartLoading.z * n);
                    }
                }else{
                    transformed += mix(aStartLoading, aEndPos, tProgress);
                }`
            ],
            vertexColor: [
                'vParticle = aEndPos;',
                'vEndPos = aEndPos;',
                'vStartLoading = aStartLoading;',
            ],
            fragmentParameters: [
                'uniform float uTime;',
                'uniform vec3 uColor;',
            ],
            fragmentShape: [
                `float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                float pct = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
                vec3 color = vec3(1.0) * gl_FragColor.rgb;
                gl_FragColor = vec4(color, pct * gl_FragColor.a);`
            ],
        });

        const xRayMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: { type: 'f', value: 0.9 },
                p: { type: 'f', value: 6.7 },
                glowColor: { type: 'c', value: new THREE.Color(0x84ccff) },
                viewVector: { type: 'v3', value: new THREE.Vector3(0, 0, 0) },
                lightningTexture: { type: 't', value: this.mainBrain.loaders.brainXRayLight },
                offsetY: { type: 'f', value: 0.3 },
                uTime: { type: 'f', value: 0.0 },
            },
            vertexShader: xRayVertex,
            fragmentShader: xRayFrag,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
        });

        const systemPoints = new THREE.Points(geometry, material);
        const xRayGeometry = new THREE.Geometry().fromBufferGeometry(this.mainBrain.endPointsCollections);
        xRayGeometry.computeFaceNormals();
        xRayGeometry.mergeVertices();
        xRayGeometry.computeVertexNormals();

        const xRayEffect = new THREE.Mesh(xRayGeometry, xRayMaterial);

        systemPoints.castShadow = true;
        systemPoints.frustumCulled = false;
        systemPoints.customDistanceMaterial = BAS.Utils.createDistanceAnimationMaterial(material);
        systemPoints.customDepthMaterial = new THREE.ShaderMaterial({
            vertexShader: material.vertexShader,
            fragmentShader: material.fragmentShader,
            uniforms: material.uniforms,
        });

        return { xRayEffect, systemPoints };
    }

    update(deltaTime, camera, brain) {
        this.particles.material.uniforms.uTime.value = deltaTime;
        this.xRay.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, brain.position);
        this.xRay.material.uniforms.uTime.value = deltaTime;
    }

    isXRayActive(status) {
        if (status) {
            const progress = { p: 0.0 };
            TweenMax.fromTo(progress, 3.0, { p: 3.0 }, {
                p: 5.0,
                ease: Power1.easeIn,
                onUpdate: () => {
                    this.xRay.material.uniforms.offsetY.value = Math.sin(progress.p);
                },
            });
        } else {
            const progress = { p: 1.0 };
            TweenMax.fromTo(progress, 3.0, { p: 5.0 }, {
                p: 3.0,
                ease: Power1.easeIn,
                onUpdate: () => {
                    this.xRay.material.uniforms.offsetY.value = Math.sin(progress.p);
                },
            });
        }
    }

    updateTransitioning(val) {
        this.particles.material.uniforms.uProgress.value += 1 / 300;
        this.particles.customDepthMaterial.uniforms.uProgress.value += 1 / 300;
        this.particles.customDistanceMaterial.uniforms.uProgress.value += 1 / 300;
    }

    transform(status) {
        if (status) {
            const progress = { p: 0.0 };
            TweenMax.fromTo(progress, 5.9, { p: 0.0 }, {
                p: 1.5,
                ease: Power1.easeIn,
                onUpdate: () => {
                    this.updateTransitioning(progress.p);
                },
                onComplete: () => {
                    this.mainBrain.orbitControls.maxDistance = 700;
                    this.mainBrain.orbitControls.autoRotate = true;
                    this.updateTransitioning(1.5);
                },
            });
        } else {
            const progress = { p: 1.0 };
            TweenMax.fromTo(progress, 2.0, { p: 1.0 }, {
                p: 0.5,
                ease: Power1.easeIn,
                onUpdate: () => {
                    this.updateTransitioning(progress.p);
                },
            });
        }
    }
}

export default ParticleSystem;
