import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

import { FilmShader } from "three/addons/shaders/FilmShader.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

import fontJson from "../assets/fonts/monsieur.json";

let shader;

let upDir = true

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
    this.camera.position.set(-73, -3, 80);

    shader = new ShaderPass(FilmShader)
    shader.uniforms["nIntensity"].value = 1;

    shader.uniforms["sCount"].value = 30;
    shader.uniforms["sIntensity"].value = 1;

    const loader = new FontLoader();

    const font = loader.parse(fontJson);
    const geometry = new TextGeometry("Code: mz\nCode: rjuho\nCode: ileska", {
      font: font,
      size: 3,
      height: 0.5,
      curveSegments: 0.00001,
      bevelEnabled: true,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    });


    const material = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = -5;
    mesh.position.y = 5;

    this.scene.add(mesh);

    this.scene.add(new THREE.HemisphereLight(0xbbbbbb, 0x777777, 20));
  }

  get getCamera() {
    return this.camera;
  }

  get getScene() {
    return this.scene;
  }

  get getEffectShaders() {
    return [shader];
  }

  animate() {
    shader.uniforms["sIntensity"].value = Math.sin(Date.now() / 50)

    if (upDir) {
      shader.uniforms["sCount"].value += 0.1;
    } else {
      shader.uniforms["sCount"].value -= 0.5;
    }

    if (shader.uniforms["sCount"].value < 10) {
      upDir = true
    }

    if (shader.uniforms["sCount"].value > 100) {
      upDir = false
    }

  }
}

export { Credits };
