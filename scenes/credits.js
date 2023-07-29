import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

import fontJson from "../assets/fonts/helvetiker_regular.typeface.json";

class Credits {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      100
    );
    this.camera.position.set(-5, -50, -50);

    const loader = new FontLoader();

    const font = loader.parse(fontJson);
    const geometry = new TextGeometry("code: mz", {
      font: font,
      size: 3,
      height: 2,
      curveSegments: 12,
    });
    const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const mesh = new THREE.Mesh(geometry, material);

    this.scene.add(mesh);

    this.scene.add(new THREE.HemisphereLight(0xff0000, 0x0000ff, 20));
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
  }
}

export { Credits };
