import * as THREE from "three";
import { GUI as LilGUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { Power1, Back, TweenMax } from "gsap";
import testPayload from "../data/testPayload";

class BrainGUI {
  constructor(mainBrain) {
    this.mainBrain = mainBrain;
    this.gui = new LilGUI();
    this.controls = {
      rotationSpeed: 0.5,
      floor: 0xdde3e9,
      transitioning: false,
      autoRotate: true,
      lightIntensity: 1.45,
      lightDistance: 175,
      lightHelper: false,
      angle: 1.0,
      uBurbleUp: 0.0,
      burbleProgress: 0.1,
      showBubbles: false,
      particleGlow: 0xdde3e9,
      memory: 1,
      thinking: false,
      startIntro: true,
      recording: false,
      cameraAnimation: 1,
      c: 1.11,
      p: 1.0,
      offsetY: 0.1,
      showXray: false,
      bloomStrength: 1.0,
      bloomRadius: 0.0,
      bloomThreshold: 0.0,
    };

    this.init();
  }

  init() {
    const folder = this.gui.addFolder("Controls");
    folder.add(this.controls, "rotationSpeed", 0.0, 2.0).name("Rotation Speed");
    folder.add(this.controls, "autoRotate").onChange((val) => {
      this.mainBrain.orbitControls.autoRotate = val;
    });

    folder.add(this.controls, "recording").onChange((val) => {
      this.mainBrain.isRecording = val;
    });

    folder.add(this.controls, "showXray").onChange((e) => {
      this.mainBrain.particlesSystem.isXRayActive(e);
    });

    folder.add(this.controls, "lightIntensity", 0.0, 2.0).onChange((val) => {
      this.mainBrain.spotLight.intensity = val;
    });

    folder.add(this.controls, "c", 0.0, 2.0).onChange((val) => {
      this.mainBrain.particlesSystem.xRay.material.uniforms.c.value = val;
    });
    folder.add(this.controls, "p", 0.0, 20.0).onChange((val) => {
      this.mainBrain.particlesSystem.xRay.material.uniforms.p.value = val;
    });

    folder.add(this.controls, "offsetY", 0.0, 2.0).onChange((val) => {
      this.mainBrain.particlesSystem.xRay.material.uniforms.offsetY.value = val;
    });

    folder.add(this.controls, "lightHelper").onChange((val) => {
      if (val) {
        this.mainBrain.scene.add(this.mainBrain.spotLightHelper);
      } else {
        this.mainBrain.scene.remove(this.mainBrain.spotLightHelper);
      }
    });
    folder.add(this.controls, "cameraAnimation", 0, 4).onFinishChange((val) => {
      this.mainBrain.thinkingAnimation.animationCamera(val);
    });

    folder.add(this.controls, "lightDistance", 0.0, 1800.0).onChange((val) => {
      this.mainBrain.spotLight.position.set(0, val, -10);
    });

    folder.add(this.controls, "uBurbleUp", 0.0, 1.0).onChange((val) => {
      this.mainBrain.bubblesAnimation.updateBurbleUp(val);
    });

    folder.add(this.controls, "memory", 0, 4).onChange((val) => {
      this.mainBrain.bubblesAnimation.updateSubSystem(testPayload);
    });

    folder.addColor(this.controls, "particleGlow").onChange((e) => {
      this.mainBrain.scene.background = new THREE.Color(e);
    });

    folder.addColor(this.controls, "floor").onChange((e) => {
      this.mainBrain.plane.material.color = new THREE.Color(e);
    });

    folder.add(this.controls, "burbleProgress", 0.0, 1.0).onChange((val) => {
      this.mainBrain.bubblesAnimation.updateBurbleUp(val);
    });

    folder.add(this.controls, "showBubbles").onChange((val) => {
      this.mainBrain.bubblesAnimation.animate(val);
    });

    folder.add(this.controls, "startIntro").onChange((val) => {
      this.mainBrain.startIntro(val);
    });

    folder.add(this.controls, "thinking").onChange((e) => {
      this.mainBrain.thinkingAnimation.isActive(e);
    });

    folder.add(this.controls, "transitioning").onChange((e) => {
      if (e) {
        const progress = { p: 0.0 };
        TweenMax.fromTo(
          progress,
          2.0,
          { p: 0.0 },
          {
            p: 1.5,
            ease: Power1.easeIn,
            onUpdate: (value) => {
              this.mainBrain.particlesSystem.updateTransitioning(progress.p);
            },
          }
        );
      } else {
        const progress = { p: 1.0 };
        TweenMax.fromTo(
          progress,
          2.0,
          { p: 1.0 },
          {
            p: 0.5,
            ease: Power1.easeIn,
            onUpdate: (value) => {
              this.mainBrain.particlesSystem.updateTransitioning(progress.p);
            },
          }
        );
      }
    });

    folder.add(this.controls, "bloomStrength", 0.0, 3.0).name("Bloom Strength");
    folder.add(this.controls, "bloomRadius", 0.0, 1.0).name("Bloom Radius");
    folder.add(this.controls, "bloomThreshold", 0.0, 1.0).name("Bloom Threshold");

    folder.open();
  }
}

export default BrainGUI;
