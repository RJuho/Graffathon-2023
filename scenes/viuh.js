import * as THREE from "three";
import { createBall } from './generateCity'
import { RGBShiftShader } from "three/addons/shaders/RGBShiftShader.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

class Viuh {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000)
    this.clock = new THREE.Clock();
    this.mixer = [];

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      100
    );
    this.camera.position.set(0, 0, -50);

    // Add camera to a "boom" so we can spin camera around the cube.
    this.cameraBoom = new THREE.Group();
    this.cameraBoom.position.set(0, 0, 0);
    this.cameraBoom.add(this.camera);

    this.scene.add(this.cameraBoom);
    this.balls = []

    for (let i = 0; i < 5; i++) {
      const ball = createBall(2, [50+(i*3.5),50,5],null, this.scene, 0xccc)
      this.scene.add(ball)
      this.balls.push(ball)
    }

    for (let i = 0; i < 5; i++) {
      const ball = createBall(2, [50+(i*3.5),50,15],null, this.scene, 0xccc)
      this.scene.add(ball)
      this.balls.push(ball)
    }

    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.IcosahedronGeometry(3);
      const material = new THREE.MeshLambertMaterial({ color: 0x888888 });
      const mesh = new THREE.Mesh(geometry, material);

      const keyframes = new THREE.VectorKeyframeTrack(
        ".position",
        [i+0, i+1, i+2, i+3, i+4, i+5, i+6],
        [10, 0, 10, 3, 10, 0, 3, 0, 0, -3, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3]
      );

      const xAxis = new THREE.Vector3(1, 1, 2);
      const spinStart = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
      const spinEnd = new THREE.Quaternion().setFromAxisAngle(xAxis, 3);
      const spinKeyframes = new THREE.QuaternionKeyframeTrack(
        ".quaternion",
        [0, 1, 2],
        [
          spinStart.x,
          spinStart.y,
          spinStart.z,
          spinStart.w,
          spinEnd.x,
          spinEnd.y,
          spinEnd.z,
          spinEnd.w,
          spinStart.x,
          spinStart.y,
          spinStart.z,
          spinStart.w,
        ]
      );

      const mixer = new THREE.AnimationMixer(mesh);
      const clip = new THREE.AnimationClip("Animation", 20+(i*2), [
        keyframes,
        spinKeyframes,
      ]);
      const clipAction = mixer.clipAction(clip);
      clipAction.play();
      this.mixer.push(mixer)

      this.scene.add(mesh);
    }

    this.scene.add(new THREE.HemisphereLight( 0xff0000, 0x0000ff, 20 ));
  }

  get getCamera() {
    return this.camera;
  }

  get getScene() {
    return this.scene;
  }

  get getEffectShaders() {
    return [new ShaderPass(RGBShiftShader)];
  }

  animate() {
    const delta = this.clock.getDelta();

    for (const m of this.mixer) {
      m.update(delta);
    }
    const curTime = Date.now() / 1000

    for (let i = 0; i < this.balls.length; i++) {
      this.balls[i].position.x -= 0.35
      this.balls[i].position.y = Math.sin(2 * (curTime - i * 0.2)) * 5
    }

    this.cameraBoom.rotation.x += 0.04;
  }
}

export { Viuh };
