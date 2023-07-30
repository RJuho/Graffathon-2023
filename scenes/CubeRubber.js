import * as THREE from "three";
import { createBall } from "./generateCity";

class CubeRubber {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000);
    this.clock = new THREE.Clock();

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      100
    );
    this.camera.position.set(-500, -500, -500);

    const geometry = new THREE.BoxGeometry(10,10,10,10,10,10);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 }
      },
      vertexShader: `
      uniform float time;

			void main() {
        float rota = sin(time*5.0)+1.5;
        float rotaDepth = 7.0;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(
          position.x * cos(position.z/rotaDepth/rota) - position.y * sin(position.z/rotaDepth/rota),
          position.y * cos(position.z/rotaDepth/rota) + position.x * sin(position.z/rotaDepth/rota),
          position.z,
          1.0
          );
			}
      `
     });
    this.material = material

    const mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh)
    this.scene.add(new THREE.HemisphereLight(0xffeeee, 0xffffff, 20));
  }

  get getCamera() {
    return this.camera;
  }

  get getScene() {
    return this.scene;
  }

  get getEffectShaders() {
    return [];
  }

  animate() {
    this.material.uniforms["time"].value = this.clock.getElapsedTime()
  }
}

export { CubeRubber };
