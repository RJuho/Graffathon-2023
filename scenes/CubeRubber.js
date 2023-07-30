import * as THREE from "three";
import { createBall } from "./generateCity";

class CubeRubber {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000);
    this.clock = new THREE.Clock();
    this.balls = []

    // for (let i = 0; i < 5; i++) {
    //   const ball = createBall(2, [150+(i*3.5),-150,5],null, this.scene, 0xccc)
    //   this.scene.add(ball)
    //   this.balls.push(ball)
    // }

    for (let i = 0; i < 5; i++) {
      const ball = createBall(2, [150+(i*3.5),-150,15],null, this.scene, 0xccc)
      this.scene.add(ball)
      this.balls.push(ball)
    }

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
    const curTime = Date.now() / 1000
    this.material.uniforms["time"].value = this.clock.getElapsedTime()
    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].position.x -= 0.35
      this.balls[i].position.y = Math.sin(2 * (curTime - i * 0.2)) * 5
    }
  }
}

export { CubeRubber };
